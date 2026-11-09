import { CardDefinition } from '../types/game';

/**
 * CATÁLOGO OFICIAL DE CARTAS — CHROMATIC PACT (1.049 CARTAS)
 * 100% Original Dark Fantasy IP — Sem Nomes, Anatomias ou Frases Protegidos por Direito Autoral.
 */
const ALL_CARDS_PART_1: CardDefinition[] = [
  {
    "id": "red_01_kobold",
    "name": "Batedor Escamado das Brasas",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Réptil • Batedor",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Causa 1 de dano diretamente ao Soberano inimigo.",
    "flavorText": "Pequenos em estatura, mas forjados na febre ardente das fendas vulcânicas de Pyros.",
    "imagePath": "/assets/cards/red_01_kobold.webp"
  },
  {
    "id": "red_02_magmin",
    "name": "Diabrete de Escória Vulcânica",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Elemental • Ígneo",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Último Suspiro: Causa 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Pele Incandescente. Armadura 1. Último Suspiro: Causa 1 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "Seu riso crepita como carvão seco prestes a explodir.",
    "imagePath": "/assets/cards/red_02_magmin.webp"
  },
  {
    "id": "red_03_mastim_infernal",
    "name": "Mastim das Cinzas",
    "domain": "red",
    "type": "creature",
    "subtype": "Fera • Infernal",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "breathDamage": 1,
    "effects": [],
    "description": "Ímpeto. Sopro 1: Antes de atacar, queima a fileira alvo em 1 de dano.",
    "flavorText": "Seu faro rastreia o medo através de léguas de fumaça e enxofre.",
    "imagePath": "/assets/cards/red_03_mastim_infernal.webp"
  },
  {
    "id": "red_04_meio_dragao",
    "name": "Campeão Dracônico",
    "domain": "red",
    "type": "creature",
    "subtype": "Dracônico • Guerreiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Fúria Crescente"
    ],
    "breathDamage": 2,
    "ascension": {
      "cost": 3,
      "newName": "Soberano Meio-Dragão Ascendido",
      "newAtk": 7,
      "newArmor": 2,
      "newMaxHp": 8,
      "addedKeywords": [
        "Voo",
        "Atropelar",
        "Ímpeto"
      ]
    },
    "effects": [],
    "description": "Voo, Fúria Crescente. Armadura 1. Sopro 2. Ascensão (3): Desperta asas dracônicas (7/8, Armadura 2, Voo, Atropelar, Ímpeto).",
    "flavorText": "O juramento de escama e sangue transforma o aço mortal em garra primordial.",
    "imagePath": "/assets/cards/red_04_meio_dragao.webp"
  },
  {
    "id": "red_05_salamandra",
    "name": "Salamandra do Mar de Brasas",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Serpente",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a um inimigo."
      }
    ],
    "description": "Pele Incandescente. Ao Entrar: Lança sua lança incandescente causando 2 de dano a um inimigo. Ascensão (3): Transforma-se em Imperatriz Salamandra do Magma (8/8, ARM 1).",
    "flavorText": "Forjada nas correntes ferventes onde o próprio ferro derrete como cera.",
    "imagePath": "/assets/cards/red_05_salamandra.webp",
    "ascension": {
      "cost": 3,
      "newName": "Imperatriz Salamandra do Magma",
      "newAtk": 8,
      "newArmor": 1,
      "newMaxHp": 8,
      "addedKeywords": [
        "Pele Incandescente",
        "Atropelar"
      ]
    }
  },
  {
    "id": "red_06_efreeti",
    "name": "Soberano Ígneo da Cidadela de Bronze",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Elemental • Nobre Ígneo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Varre a Vanguarda inimiga com 2 de dano."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Invoca uma parede de chamas que causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Nos terraços da Cidadela de Bronze, cada tratado de paz é selado com ferro em brasa.",
    "imagePath": "/assets/cards/red_06_efreeti.webp"
  },
  {
    "id": "red_07_gigante_fogo",
    "name": "Colosso Forjador do Vulcão",
    "domain": "red",
    "type": "creature",
    "subtype": "Gigante • Forjador",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Atacar: Causa 2 de dano direto ao Soberano inimigo."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 2. Ao Atacar: Estilhaça o solo causando 2 de dano ao Soberano inimigo.",
    "flavorText": "Cada martelada na bigorna da montanha faz tremer três reinos.",
    "imagePath": "/assets/cards/red_07_gigante_fogo.webp"
  },
  {
    "id": "red_08_dragao_vermelho",
    "name": "Igniskar, Tirano da Cratera",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Fúria Crescente"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Incinera a Vanguarda inimiga com 3 de dano."
      }
    ],
    "description": "Voo, Atropelar, Fúria Crescente. Armadura 1. Sopro 2. Ao Entrar: Causa 3 de dano a toda a Vanguarda inimiga.",
    "flavorText": "Ele não reclama coroas de reis; ele reclama o ouro derretido sobre seus ossos.",
    "imagePath": "/assets/cards/red_08_dragao_vermelho.webp"
  },
  {
    "id": "red_09_esfera_cinzas",
    "name": "Caveira Piroclástica",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Piromancia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano a toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: Explode sobre a linha de frente inimiga causando 3 de dano à Vanguarda e 2 de dano ao Soberano rival.",
    "flavorText": "A sabedoria de um arcanista morto reduzida à pura combustão.",
    "imagePath": "/assets/cards/red_09_esfera_cinzas.webp"
  },
  {
    "id": "red_10_altar_draconico",
    "name": "Máscara do Trono Rubro",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Dracônica",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 1,
        "description": "Início do Turno: Invoca uma Cria Dracônica (2/1)."
      }
    ],
    "description": "Ao Entrar: +1/+1 a todos os aliados. Início do Turno: Invoca uma Cria Dracônica (2/1).",
    "flavorText": "Quem veste a face do dragão jamais volta a falar na língua dos covardes.",
    "imagePath": "/assets/cards/red_10_altar_draconico.webp"
  },
  {
    "id": "red_11_azer",
    "name": "Artífice Bronze-Ardente",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Artífice",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Guardião, Pele Incandescente. Armadura 1. Queima atacantes corpo-a-corpo.",
    "flavorText": "Seu cabelo é labareda viva; seu corpo, bronze temperado no coração do sol.",
    "imagePath": "/assets/cards/red_11_azer.webp"
  },
  {
    "id": "red_12_mephit_magma",
    "name": "Diabrete de Magma",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Menor",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Cospe lava causando 2 de dano a um inimigo."
      }
    ],
    "description": "Voo, Ímpeto. Armadura 1. Ao Entrar: Causa 2 de dano a um inimigo.",
    "flavorText": "Gotejando rocha fundida por onde voa, incendeia estandartes e escudos.",
    "imagePath": "/assets/cards/red_12_mephit_magma.webp"
  },
  {
    "id": "red_13_mephit_fumaca",
    "name": "Espreitador da Fuligem",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Fumaça",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Cega a Vanguarda inimiga (-1 ATQ)."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Nuvem de fuligem reduz o ATQ da Vanguarda inimiga em 1.",
    "flavorText": "Onde há fumaça, há uma adaga de cinzas esperando pela sua garganta.",
    "imagePath": "/assets/cards/red_13_mephit_fumaca.webp"
  },
  {
    "id": "red_14_diabo_espinhos",
    "name": "Açoitador de Espinhos Ígneos",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Alado",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Voo, Alcance, Pele Incandescente. Dispara espinhos em chamas da Retaguarda.",
    "flavorText": "Cada pluma de suas asas é uma lança farpada embebida em brasa.",
    "imagePath": "/assets/cards/red_14_diabo_espinhos.webp"
  },
  {
    "id": "red_15_cambion",
    "name": "Príncipe Sangue-de-Brasa",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Nobre",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Raio de Fogo causa 2 de dano a um inimigo."
      }
    ],
    "description": "Voo, Alcance, Dreno de Vida. Ao Entrar: Dispara um raio ardente causando 2 de dano a um inimigo.",
    "flavorText": "Herdeiro de dois mundos, governa ambos pela ponta da lança.",
    "imagePath": "/assets/cards/red_15_cambion.webp"
  },
  {
    "id": "red_16_orc_saqueador",
    "name": "Berserker da Rocha Fendida",
    "domain": "red",
    "type": "creature",
    "subtype": "Guerreiro • Berserker",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Ímpeto, Fúria Crescente. Ganha +1 ATQ sempre que sobrevive a dano.",
    "flavorText": "Feridas apenas alimentam a fornalha em seu peito.",
    "imagePath": "/assets/cards/red_16_orc_saqueador.webp"
  },
  {
    "id": "red_17_orc_xama",
    "name": "Xamã da Chama Caolha",
    "domain": "red",
    "type": "creature",
    "subtype": "Xamã • Conjurador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 aos aliados."
      }
    ],
    "description": "Alcance. Ao Entrar: Cântico de sangue concede +1 ATQ e +1 VIDA a todos os aliados.",
    "flavorText": "Enxerga através da fumaça da batalha o ponto exato onde a linha inimiga vai quebrar.",
    "imagePath": "/assets/cards/red_17_orc_xama.webp"
  },
  {
    "id": "red_18_marechal_rubro",
    "name": "Marechal da Legião Férrea",
    "domain": "red",
    "type": "creature",
    "subtype": "Comandante • Militar",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Ao Atacar: Aliados ganham +1 ATQ."
      }
    ],
    "description": "Guardião. Armadura 2. Ao Atacar: Comanda a falange concedendo +1 ATQ a todos os aliados.",
    "flavorText": "Fúria sem disciplina é fumaça; fúria em formação é conquista.",
    "imagePath": "/assets/cards/red_18_marechal_rubro.webp"
  },
  {
    "id": "red_19_corcel_brasas",
    "name": "Corcel Pesadelo das Cinzas",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Corcel",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Voo",
      "Atropelar"
    ],
    "effects": [],
    "description": "Ímpeto, Voo, Atropelar. Galopa sobre as defesas inimigas no turno em que entra.",
    "flavorText": "Seus cascos não tocam a relva; deixam apenas pegadas de vidro derretido.",
    "imagePath": "/assets/cards/red_19_corcel_brasas.webp"
  },
  {
    "id": "red_20_quimera",
    "name": "Quimera da Garganta Vulcânica",
    "domain": "red",
    "type": "creature",
    "subtype": "Monstruosidade • Dracônica",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar"
    ],
    "breathDamage": 2,
    "effects": [],
    "description": "Voo, Atropelar. Sopro 2: A cabeça de dragão incinera a fileira inimiga com 2 de dano antes do golpe.",
    "flavorText": "Três fomes insaciáveis dividindo um único coração em chamas.",
    "imagePath": "/assets/cards/red_20_quimera.webp"
  },
  {
    "id": "red_21_diabo_chifres",
    "name": "Arconte de Chifres e Brasa",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Guarda",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a um inimigo."
      }
    ],
    "description": "Voo, Pele Incandescente. Armadura 2. Ao Entrar: Arremessa chama infernal causando 3 de dano a um inimigo.",
    "flavorText": "Sentinela inabalável das muralhas de basalto onde o magma corre como rio.",
    "imagePath": "/assets/cards/red_21_diabo_chifres.webp"
  },
  {
    "id": "red_22_tirano_fogo",
    "name": "Baelgor, Senhor do Fosso Ardente",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Pele Incandescente"
    ],
    "corruptionCost": 2,
    "effects": [
      {
        "trigger": "turn_end",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Fim do Turno: Queima a Vanguarda inimiga em 2 de dano."
      }
    ],
    "description": "Sobrecarga +2. Voo, Atropelar, Pele Incandescente. Fim do Turno: Aura de fogo causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Legiões inteiras marcham ao compasso do bater de suas asas.",
    "imagePath": "/assets/cards/red_22_tirano_fogo.webp"
  },
  {
    "id": "red_23_dragao_latao",
    "name": "Soberano de Latão do Deserto",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Ancião",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Sopro Sonífero paralisa 1 inimigo."
      }
    ],
    "description": "Voo, Alcance. Sopro 2. Ao Entrar: Exala gás soporífero que paralisa a criatura inimiga mais forte por 1 turno.",
    "flavorText": "Sob o sol escaldante das dunas, o bater de suas asas levanta tempestades de areia dourada.",
    "imagePath": "/assets/cards/red_23_dragao_latao.webp"
  },
  {
    "id": "red_24_dragao_cobre",
    "name": "Draco de Cobre das Ravinas",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Acrobata",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Entrar: Varre a Vanguarda inimiga com 1 de dano."
      }
    ],
    "description": "Voo, Atropelar. Armadura 1. Sopro 2. Ao Entrar: Causa 1 de dano à Vanguarda inimiga.",
    "flavorText": "Rápido como uma faísca e implacável como um deslizamento de rochas.",
    "imagePath": "/assets/cards/red_24_dragao_cobre.webp"
  },
  {
    "id": "red_25_erupcao_piroclastica",
    "name": "Cataclismo Piroclástico",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 3,
        "description": "Causa 3 de dano a TODAS as unidades no campo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: O chão se abre em lava, causando 3 de dano a todas as criaturas em campo e 3 de dano ao Soberano inimigo.",
    "flavorText": "A montanha não distingue aliados de inimigos quando desperta.",
    "imagePath": "/assets/cards/red_25_erupcao_piroclastica.webp"
  },
  {
    "id": "red_26_grilhoes_incandescentes",
    "name": "Grilhões da Fornalha",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Prende o inimigo mais forte por 1 turno."
      }
    ],
    "description": "Reação: Correntes em brasa causam 3 de dano a um inimigo e o imobilizam (Congelado/Preso) por 1 turno.",
    "flavorText": "Elo por elo, o ferro rubro aperta até a alma ceder.",
    "imagePath": "/assets/cards/red_26_grilhoes_incandescentes.webp"
  },
  {
    "id": "red_27_frenesi_batalha",
    "name": "Tambores da Conquista",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Comando",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 0,
        "description": "Concede +2 ATQ a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Concede +2 ATQ permanente a todos os seus aliados em campo e compra 1 carta.",
    "flavorText": "Ao soar do terceiro gongo, nenhuma lâmina permanece embainhada.",
    "imagePath": "/assets/cards/red_27_frenesi_batalha.webp"
  },
  {
    "id": "red_28_coroa_cinzas",
    "name": "Tiara do Arauto Escarlate",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Regalia",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "turn_end",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Fim do Turno: Queima o Soberano inimigo em 2 de dano."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano à Vanguarda inimiga. Fim do Turno: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Forjada com a primeira escama caída do trono pentacromático.",
    "imagePath": "/assets/cards/red_28_coroa_cinzas.webp"
  },
  {
    "id": "red_29_meteoro_draconico",
    "name": "Meteoro da Extinção Dracônica",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 5,
        "description": "Causa 5 de dano a toda a fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 4,
        "description": "Causa 4 de dano direto ao Soberano inimigo."
      }
    ],
    "description": "Feitiço Lendário: Um astro em chamas colide com o campo rival, causando 5 de dano à fileira inimiga e 4 de dano ao Soberano.",
    "flavorText": "Quando os céus sangram magma, nem mesmo as fortalezas de ferro restam de pé.",
    "imagePath": "/assets/cards/red_29_meteoro_draconico.webp"
  },
  {
    "id": "red_30_furia_sangue",
    "name": "Fúria de Sangue Vulcânico",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Guerra",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2 ATQ e +1 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 1,
        "secondaryValue": 1,
        "description": "Invoca uma Cria Dracônica (1/1)."
      }
    ],
    "description": "Feitiço: Concede +2/+1 a um aliado, invoca uma Cria Dracônica (1/1) e causa 2 de dano ao Soberano rival.",
    "flavorText": "A dor é apenas lenha para a fornalha da vitória.",
    "imagePath": "/assets/cards/red_30_furia_sangue.webp"
  },
  {
    "id": "red_31_jato_magma",
    "name": "Jato de Magma Incandescente",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Piromancia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: Dispara rocha fundida que causa 4 de dano a um inimigo e 1 ao Soberano rival.",
    "flavorText": "Derrete o escudo antes de alcançar o coração.",
    "imagePath": "/assets/cards/red_31_jato_magma.webp"
  },
  {
    "id": "red_32_ritual_cinzas",
    "name": "Ritual da Pira de Cinzas",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Ritual",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 1,
        "description": "Invoca uma Cria Dracônica (2/1)."
      }
    ],
    "description": "Feitiço: Invoca uma Cria Dracônica (2/1), gera +1⚡ de Essência neste turno e compra 1 carta.",
    "flavorText": "Das cinzas do que foi queimado salta a centelha do próximo massacre.",
    "imagePath": "/assets/cards/red_32_ritual_cinzas.webp"
  },
  {
    "id": "red_33_supernova_vulcanica",
    "name": "Supernova da Caldeira",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Piromancia",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano a toda a fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 aos seus aliados."
      }
    ],
    "description": "Feitiço: Causa 3 de dano à fileira inimiga, 2 de dano ao Soberano rival e concede +1/+1 aos seus aliados.",
    "flavorText": "Para os filhos do dragão, o incêndio é um cântico de guerra.",
    "imagePath": "/assets/cards/red_33_supernova_vulcanica.webp"
  },
  {
    "id": "red_34_mina_termita",
    "name": "Mina de Termita Anã",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Estilhaços causam 1 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Reação: Detona sob os pés do invasor causando 3 de dano ao alvo, 1 à fileira inimiga e 1 ao Soberano rival.",
    "flavorText": "Um passo em falso e o chão vira uma fornalha faminta.",
    "imagePath": "/assets/cards/red_34_mina_termita.webp"
  },
  {
    "id": "red_35_contra_ataque_igneo",
    "name": "Represália do Escudo em Brasa",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Combate",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao agressor."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 1,
        "description": "Invoca uma Cria Dracônica (2/1)."
      }
    ],
    "description": "Reação: Causa 3 de dano ao agressor, concede +1/+1 aos seus aliados e invoca uma Cria Dracônica (2/1).",
    "flavorText": "Golpear o ferro quente só espalha as faíscas.",
    "imagePath": "/assets/cards/red_35_contra_ataque_igneo.webp"
  },
  {
    "id": "red_36_bigorna_fogo",
    "name": "Bigorna do Rei da Fornalha",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Forja",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao Entrar: Invoca uma Cria Dracônica (2/1)."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Início do Turno: Causa 1 de dano ao Soberano rival."
      }
    ],
    "description": "Ao Entrar: +1/+1 aos aliados e invoca Cria Dracônica (2/1). Início do Turno: +1/+1 a um aliado e 1 de dano ao Soberano rival.",
    "flavorText": "Enquanto o malho bater, nenhuma espada da legião perderá o fio.",
    "imagePath": "/assets/cards/red_36_bigorna_fogo.webp"
  },
  {
    "id": "blue_01_sentinela_ventos",
    "name": "Sentinela das Correntes Aéreas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Celeste • Batedor",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [],
    "description": "Voo, Alcance. Ataca de longe sem sofrer contra-ataques terrestres.",
    "flavorText": "Eles vigiam os picos onde o ar é rarefeito demais para os dragões.",
    "imagePath": "/assets/cards/blue_01_sentinela_ventos.webp"
  },
  {
    "id": "blue_02_elemental_ar",
    "name": "Vórtice Elemental do Ar",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Vendaval",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Ao Entrar: Devolve uma criatura inimiga enfraquecida para a mão."
      }
    ],
    "description": "Voo, Ímpeto. Ao Entrar: Devolve uma criatura inimiga para a mão. Ascensão (4⚡): 6/7, Armadura 1, Voo, Ímpeto, Alcance.",
    "flavorText": "Nenhuma muralha detém aquilo que não possui forma.",
    "imagePath": "/assets/cards/blue_02_elemental_ar.webp",
    "ascension": {
      "cost": 4,
      "newName": "Senhor do Furacão Primordial",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 7,
      "addedKeywords": [
        "Voo",
        "Ímpeto",
        "Alcance"
      ]
    }
  },
  {
    "id": "blue_03_esfinge",
    "name": "Oráculo Esfinge do Pináculo",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Monstruosidade • Oráculo",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo, Alcance. Armadura 1. Ao Entrar: Compra 1 carta. Ascensão (4): Transforma-se em Esfinge Soberana do Tempo (7/8, ARM 2).",
    "flavorText": "Diante dos portões do Pináculo, até os reis precisam provar sua sabedoria antes de passar.",
    "imagePath": "/assets/cards/blue_03_esfinge.webp",
    "ascension": {
      "cost": 4,
      "newName": "Esfinge Soberana do Tempo",
      "newAtk": 7,
      "newArmor": 2,
      "newMaxHp": 8,
      "addedKeywords": [
        "Voo",
        "Alcance",
        "Escudo Divino"
      ]
    }
  },
  {
    "id": "blue_04_behir",
    "name": "Serpe Trovejante de Doze Patas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Elétrica",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "breathDamage": 2,
    "effects": [],
    "description": "Atropelar. Armadura 1. Sopro 2: Dispara um feixe de relâmpago que causa 2 de dano à fileira alvo antes de atacar.",
    "flavorText": "Até mesmo os dragões evitam as cavernas onde o trovão rasteja.",
    "imagePath": "/assets/cards/blue_04_behir.webp"
  },
  {
    "id": "blue_05_gigante_nuvens",
    "name": "Soberano das Nuvens Altas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Gigante • Nobre",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Guardião, Alcance. Armadura 1. Ao Entrar: Congela 1 inimigo.",
    "flavorText": "Acima das tempestades mortais, ele joga xadrez com reinos inteiros.",
    "imagePath": "/assets/cards/blue_05_gigante_nuvens.webp"
  },
  {
    "id": "blue_06_dragao_azul",
    "name": "Vorthurion, Tempestade do Deserto",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Fulmina um inimigo com 3 de dano."
      }
    ],
    "description": "Voo, Alcance. Armadura 2. Sopro 3. Ao Entrar: Queda de raio causa 4 de dano a um inimigo.",
    "flavorText": "O único aviso de sua chegada é o cheiro de ozônio e a areia virando vidro.",
    "imagePath": "/assets/cards/blue_06_dragao_azul.webp"
  },
  {
    "id": "blue_07_kraken",
    "name": "Kraken da Fossa Abissal",
    "domain": "blue",
    "type": "creature",
    "subtype": "Titã • Marinho",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Maremoto causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 2. Ao Entrar: Maremoto causa 2 de dano e Congela toda a Vanguarda inimiga.",
    "flavorText": "Quando ele se ergue das trincheiras oceânicas, os próprios continentes recuam.",
    "imagePath": "/assets/cards/blue_07_kraken.webp"
  },
  {
    "id": "blue_08_chamado_trovao",
    "name": "Cólera do Soberano das Marés",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Tempestade",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Causa 3 de dano de raio a um inimigo e compra 1 carta.",
    "flavorText": "As águas superiores e inferiores obedecem ao mesmo cetro de safira.",
    "imagePath": "/assets/cards/blue_08_chamado_trovao.webp"
  },
  {
    "id": "blue_09_onda_repulsora",
    "name": "Maremoto de Gelo",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Hidromancia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Causa 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Reação: Congela todas as unidades na Vanguarda inimiga por 1 turno e causa 1 de dano a elas.",
    "flavorText": "O ímpeto da carga inimiga transformado em estátuas de sal e geada.",
    "imagePath": "/assets/cards/blue_09_onda_repulsora.webp"
  },
  {
    "id": "blue_10_portal_runas",
    "name": "Códice da Ressonância Astral",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Rúnica",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Lançar Feitiço: Dispara 2 de dano rúnico em um inimigo."
      }
    ],
    "description": "Ao Entrar: Compra 2 cartas. Ao Lançar Feitiço: Causa 2 de dano a um inimigo.",
    "flavorText": "As runas não descrevem o mundo; elas o obrigam a obedecer.",
    "imagePath": "/assets/cards/blue_10_portal_runas.webp"
  },
  {
    "id": "blue_11_anomalia_agua",
    "name": "Serpente de Água Viva",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Aquático",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião. Ao Entrar: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Invisível até o instante em que a fonte inteira ganha presas.",
    "imagePath": "/assets/cards/blue_11_anomalia_agua.webp"
  },
  {
    "id": "blue_12_espreitador_eter",
    "name": "Caçador do Vento Invisível",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Assassino",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Golpeia de surpresa como uma lâmina de vácuo.",
    "flavorText": "Você sente apenas o frio súbito antes do ar deixar seus pulmões.",
    "imagePath": "/assets/cards/blue_12_espreitador_eter.webp"
  },
  {
    "id": "blue_13_lanceiro_mares",
    "name": "Tritão Guardião dos Recifes",
    "domain": "blue",
    "type": "creature",
    "subtype": "Aquático • Soldado",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Armadura 1. Defensor resiliente de custo baixo.",
    "flavorText": "Suas lanças de coral são temperadas na pressão das fossas abissais.",
    "imagePath": "/assets/cards/blue_13_lanceiro_mares.webp"
  },
  {
    "id": "blue_14_saqueador_abissal",
    "name": "Maré Sanguinária das Trincheiras",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Hidromancia",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Invoca um Elemental de Geada (2/2)."
      }
    ],
    "description": "Feitiço: Lança arpões de pressão abissal causando 3 de dano a um inimigo e invoca um Elemental de Geada (2/2).",
    "flavorText": "Onde um navio naufraga, cem garras emergem da espuma.",
    "imagePath": "/assets/cards/blue_14_saqueador_abissal.webp"
  },
  {
    "id": "blue_15_barao_recifes",
    "name": "Barão de Quatro Braços das Marés",
    "domain": "blue",
    "type": "creature",
    "subtype": "Aquático • Nobre",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Atropelar, Fúria Crescente. Armadura 1. Domina o combate corpo-a-corpo.",
    "flavorText": "Quatro braços para empunhar os troféus de cem frotas afundadas.",
    "imagePath": "/assets/cards/blue_15_barao_recifes.webp"
  },
  {
    "id": "blue_16_sirenideo",
    "name": "Canto Hipnótico das Sereias",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Encantamento",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Reduz o ATQ das tropas inimigas em -2."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 2,
        "description": "Congela até 2 inimigos na Vanguarda."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: O canto abissal reduz o ATQ dos inimigos em -2, congela até 2 unidades na Vanguarda inimiga e compra 1 carta.",
    "flavorText": "Os marinheiros pulam no mar sorrindo antes de verem seus dentes.",
    "imagePath": "/assets/cards/blue_16_sirenideo.webp"
  },
  {
    "id": "blue_17_bruxa_mar",
    "name": "Megera da Escuma Negra",
    "domain": "blue",
    "type": "creature",
    "subtype": "Fada • Bruxa",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião",
      "Alcance",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Olhar Horripilante congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Maldição marinha reduz em -1 o Ataque da Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Alcance, Toque Letal. Armadura 1. Ao Entrar: Congela 1 inimigo e reduz em -1 o Ataque da Vanguarda inimiga.",
    "flavorText": "Ela coleciona últimos suspiros em conchas quebradas.",
    "imagePath": "/assets/cards/blue_17_bruxa_mar.webp"
  },
  {
    "id": "blue_18_lobo_invernal",
    "name": "Lobo Alfa da Geada",
    "domain": "blue",
    "type": "creature",
    "subtype": "Fera • Glacial",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "breathDamage": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Uivo glacial congela um inimigo."
      },
      {
        "trigger": "on_attack",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Atacar: Congela um inimigo."
      }
    ],
    "description": "Ímpeto. Armadura 1. Sopro 1. Ao Entrar e Ao Atacar: Uivo glacial congela uma unidade inimiga.",
    "flavorText": "Sua pelagem é a própria nevasca; seu hálito, o fim do outono.",
    "imagePath": "/assets/cards/blue_18_lobo_invernal.webp"
  },
  {
    "id": "blue_19_yeti",
    "name": "Yeti Abominável do Pico",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Glacial",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Olhar Gelado congela 1 inimigo."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 2, Regeneração 2. Ao Entrar: Congela 1 inimigo.",
    "flavorText": "O vento uiva seu nome nas passagens onde ninguém jamais retornou.",
    "imagePath": "/assets/cards/blue_19_yeti.webp"
  },
  {
    "id": "blue_20_remorhaz",
    "name": "Centopeia Térmica da Geleira",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Boreal",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Atropelar, Pele Incandescente. Armadura 1. Escava o gelo eterno com placas ferventes.",
    "flavorText": "Fria como o pólo por fora, ardente como uma fornalha por dentro.",
    "imagePath": "/assets/cards/blue_20_remorhaz.webp"
  },
  {
    "id": "blue_21_executor_glacial",
    "name": "Arconte da Geada Inflexível",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Glacial",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Guardião. Armadura 2. Ao Entrar: Ergue uma muralha glacial que congela toda a Vanguarda inimiga.",
    "flavorText": "No lago congelado da traição, até o fogo se curva ao zero absoluto.",
    "imagePath": "/assets/cards/blue_21_executor_glacial.webp"
  },
  {
    "id": "blue_22_dragao_branco",
    "name": "Kryonax, Flagelo do Inverno",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Glacial",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 7,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Sopro de Nevasca congela 1 inimigo."
      }
    ],
    "description": "Voo, Atropelar. Armadura 1. Sopro 2. Ao Entrar: Congela o inimigo mais forte.",
    "flavorText": "Feral e implacável, ele guarda cada presa em sarcófagos de cristal.",
    "imagePath": "/assets/cards/blue_22_dragao_branco.webp"
  },
  {
    "id": "blue_23_dragao_bronze",
    "name": "Auronautilus, Dragão de Bronze",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Costeiro",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Ao Entrar: Sopro de Repulsão devolve 1 inimigo à mão."
      }
    ],
    "description": "Voo, Alcance. Armadura 2. Sopro 2. Ao Entrar: Onda de choque repele 1 inimigo de volta para a mão.",
    "flavorText": "Sentinela dos penhascos onde o oceano encontra a tempestade.",
    "imagePath": "/assets/cards/blue_23_dragao_bronze.webp"
  },
  {
    "id": "blue_24_tartaruga_dragao",
    "name": "Quelônio-Titã dos Mares",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Couraçado",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 3,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "breathDamage": 2,
    "effects": [],
    "description": "Guardião. Armadura 3. Sopro 2: Exala vapor escaldante que varre a fileira inimiga antes do impacto.",
    "flavorText": "Marinheiros a confundem com uma ilha, até que a ilha abre os olhos.",
    "imagePath": "/assets/cards/blue_24_tartaruga_dragao.webp"
  },
  {
    "id": "blue_25_roca",
    "name": "Roca das Nuvens Trovejantes",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Colossal",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Mergulha das nuvens para abater alvos desprotegidos.",
    "flavorText": "A sombra de suas asas eclipsa aldeias inteiras antes do bote.",
    "imagePath": "/assets/cards/blue_25_roca.webp"
  },
  {
    "id": "blue_26_prisao_glacial",
    "name": "Sarcófago de Gelo Profundo",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Criomancia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano gélido."
      }
    ],
    "description": "Congela 1 inimigo e causa 2 de dano gélido a ele.",
    "flavorText": "O tempo para quando o coração congela.",
    "imagePath": "/assets/cards/blue_26_prisao_glacial.webp"
  },
  {
    "id": "blue_27_dissipacao_astral",
    "name": "Refluxo da Mente Astral",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve 1 criatura inimiga para a mão."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Reação: Devolve uma criatura inimiga para a mão do dono e restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Redirecione a força do inimigo de volta para o vazio.",
    "imagePath": "/assets/cards/blue_27_dissipacao_astral.webp"
  },
  {
    "id": "blue_28_orbe_tempestade",
    "name": "Astrolábio do Olho do Furacão",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Tempestade",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 2,
        "description": "Ao Entrar: Congela a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Início do Turno: Congela o inimigo mais forte."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Início do Turno: Causa 2 de dano ao Soberano rival."
      }
    ],
    "description": "Ao Entrar: Congela a Vanguarda inimiga e compra 1 carta. Início do Turno: Congela 1 inimigo.",
    "flavorText": "No centro do ciclone reina o silêncio de quem tudo vê.",
    "imagePath": "/assets/cards/blue_28_orbe_tempestade.webp"
  },
  {
    "id": "blue_29_raio_cadeia",
    "name": "Relâmpago em Cadeia",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Tempestade",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Dispara arcos voltaicos que causam 2 de dano à fileira inimiga e compram 1 carta.",
    "flavorText": "A armadura de ferro é o melhor amigo do trovão.",
    "imagePath": "/assets/cards/blue_29_raio_cadeia.webp"
  },
  {
    "id": "blue_30_visao_ancestral",
    "name": "Visão do Oráculo Astral",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Divinação",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Restaura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Compra 1 carta, gera +1⚡ de Essência neste turno e restaura 3 de VIDA do seu Soberano.",
    "flavorText": "Vencer a batalha antes mesmo da primeira espada sair da bainha.",
    "imagePath": "/assets/cards/blue_30_visao_ancestral.webp"
  },
  {
    "id": "blue_31_zero_absoluto",
    "name": "Decreto do Zero Absoluto",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Criomancia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 2,
        "description": "Congela até 2 inimigos na Vanguarda."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano de geada à fileira inimiga."
      }
    ],
    "description": "Feitiço: Uma frente glacial congela até 2 inimigos na Vanguarda e causa 2 de dano à fileira.",
    "flavorText": "Até o fogo mais bravo silencia quando o próprio ar vira cristal.",
    "imagePath": "/assets/cards/blue_31_zero_absoluto.webp"
  },
  {
    "id": "blue_32_transmutar_eter",
    "name": "Transmutação em Éter Puro",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Transmutação",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve um inimigo para a mão do oponente."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Dissolve um inimigo de volta para a mão rival, gera +1⚡ de Essência e compra 1 carta.",
    "flavorText": "Matéria é apenas mana condensada esperando para ser desfeita.",
    "imagePath": "/assets/cards/blue_32_transmutar_eter.webp"
  },
  {
    "id": "blue_33_tempestade_psionica",
    "name": "Tempestade Psiônica do Vórtex",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 4 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 3,
        "description": "Congela até 3 inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      }
    ],
    "description": "Feitiço Lendário: Desencadeia um ciclone astral que causa 4 de dano à fileira inimiga, congela a Vanguarda e compra 2 cartas.",
    "flavorText": "O céu e o oceano trocam de lugar ao comando do Conclave.",
    "imagePath": "/assets/cards/blue_33_tempestade_psionica.webp"
  },
  {
    "id": "blue_34_barreira_espelhada",
    "name": "Barreira de Gelo Espelhado",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela o inimigo atacante."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Restaura 2 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Invoca um Elemental de Geada (2/2)."
      }
    ],
    "description": "Reação: Ergue prismas que congelam o agressor, invocam um Elemental de Geada (2/2) e curam 2 de VIDA no seu Soberano.",
    "flavorText": "O atacante vê seu próprio reflexo congelado um instante antes do impacto.",
    "imagePath": "/assets/cards/blue_34_barreira_espelhada.webp"
  },
  {
    "id": "blue_35_cetro_inverno",
    "name": "Cetro da Geada Soberana",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Criomancia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a um inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Início do Turno: Congela o inimigo mais forte."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Início do Turno: Causa 2 de dano ao Soberano rival."
      }
    ],
    "description": "Ao Entrar: Congela e causa 2 de dano. Início do Turno: Congela 1 inimigo.",
    "flavorText": "Esculpido no coração de uma geleira que jamais conheceu a primavera.",
    "imagePath": "/assets/cards/blue_35_cetro_inverno.webp"
  },
  {
    "id": "blue_36_tomo_infinito",
    "name": "Grimório do Infinito Rúnico",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Grimório",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Lançar Feitiço: Causa 2 de dano a um inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta extra."
      }
    ],
    "description": "Ao Entrar e no Início do Turno: Compra 1 carta. Ao Lançar Feitiço: Causa 2 de dano a um inimigo.",
    "flavorText": "Suas páginas se escrevem sozinhas a cada trovão que corta o céu.",
    "imagePath": "/assets/cards/blue_36_tomo_infinito.webp"
  },
  {
    "id": "purple_01_esqueleto",
    "name": "Legionário Ossudo",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Soldado",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Renascer"
    ],
    "effects": [],
    "description": "Renascer: Na primeira vez que morrer, retorna imediatamente à vida com 1 de VIDA.",
    "flavorText": "A carne apodrece; o juramento gravado no osso permanece.",
    "imagePath": "/assets/cards/purple_01_esqueleto.webp"
  },
  {
    "id": "purple_02_sombra",
    "name": "Sombra Estranguladora",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Incorpóreo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Dreno de Vida.",
    "flavorText": "Ela se alimenta do calor até que sua própria sombra se volte contra você.",
    "imagePath": "/assets/cards/purple_02_sombra.webp"
  },
  {
    "id": "purple_03_aparicao",
    "name": "Aparição do Véu Negro",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Espectro",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Drena -1 ATQ da Vanguarda inimiga."
      }
    ],
    "description": "Voo, Dreno de Vida. Ao Entrar: Sua aura fúnebre reduz o ATQ da Vanguarda inimiga em 1.",
    "flavorText": "Nascida da malícia pura que recusou o descanso do túmulo.",
    "imagePath": "/assets/cards/purple_03_aparicao.webp"
  },
  {
    "id": "purple_04_cefalita",
    "name": "Inquisidor da Máscara do Vazio",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Humanoide • Inquisidor Umbral",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Rajada Psíquica congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano psíquico."
      }
    ],
    "description": "Alcance. Ao Entrar: Atordoa (Congela) 1 inimigo e causa 2 de dano psíquico.",
    "flavorText": "Por trás da máscara espelhada de prata, seus anéis rúnicos silenciam a vontade do inimigo.",
    "imagePath": "/assets/cards/purple_04_cefalita.webp"
  },
  {
    "id": "purple_05_cavaleiro_morte",
    "name": "Paladino do Juramento Quebrado",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Cavaleiro",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Orbe de Fogo Profano causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Sobrecarga +1. Guardião, Dreno de Vida. Armadura 2. Ao Entrar: Causa 2 de dano à Vanguarda inimiga. Ascensão (4): Transforma-se em Grão-Marechal do Sol Negro (8/8, ARM 3).",
    "flavorText": "Mesmo na morte, sua espada ainda busca a honra que ele próprio assassinou.",
    "imagePath": "/assets/cards/purple_05_cavaleiro_morte.webp",
    "ascension": {
      "cost": 4,
      "newName": "Grão-Marechal do Sol Negro",
      "newAtk": 8,
      "newArmor": 3,
      "newMaxHp": 8,
      "addedKeywords": [
        "Guardião",
        "Atropelar",
        "Renascer"
      ]
    }
  },
  {
    "id": "purple_06_tirano_ocular",
    "name": "Serafim dos Anéis Abissais",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Constructo • Serafim Abissal",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Raio Ocular causa 3 de dano a um inimigo."
      }
    ],
    "description": "Voo, Alcance. Armadura 1. Ao Entrar: Feixe Convergente causa 3 de dano a um inimigo.",
    "flavorText": "Quatro anéis de obsidiana giram em torno de um núcleo vazio que desintegra tudo o que toca.",
    "imagePath": "/assets/cards/purple_06_tirano_ocular.webp"
  },
  {
    "id": "purple_07_lich",
    "name": "Vesperion, Arquimago Lich Imortal",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Renascer"
    ],
    "corruptionCost": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 5,
        "description": "Ao Entrar: Reanima uma criatura de custo até 5 da sua Cripta."
      },
      {
        "trigger": "turn_start",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Início do Turno: Raio necrótico causa 2 de dano a um inimigo."
      }
    ],
    "description": "Alcance, Renascer. Armadura 2. Ao Entrar: Reanima 1 criatura (custo <= 5) da Cripta. Início do Turno: Causa 2 de dano a um inimigo.",
    "flavorText": "A morte é apenas um obstáculo para os medíocres.",
    "imagePath": "/assets/cards/purple_07_lich.webp"
  },
  {
    "id": "purple_08_lorde_abissal",
    "name": "Balgorath, Flagelo do Abismo",
    "domain": "purple",
    "type": "creature",
    "subtype": "Demônio • Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Tempestade Abissal causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Atropelar, Pele Incandescente. Armadura 1. Ao Entrar: Causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Armado com o chicote de relâmpago negro e a lâmina da decapitação.",
    "imagePath": "/assets/cards/purple_08_lorde_abissal.webp"
  },
  {
    "id": "purple_09_desintegrar",
    "name": "Uivo do Crânio Arcano",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 6,
        "description": "Causa 6 de dano necrótico a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Drena 2 de VIDA para o seu Soberano."
      }
    ],
    "description": "Causa 5 de dano necrótico a uma criatura inimiga e restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Diamantes cravados em osso antigo cantam a nota que desfaz a carne.",
    "imagePath": "/assets/cards/purple_09_desintegrar.webp"
  },
  {
    "id": "purple_10_pacto_profano",
    "name": "Olho da Bruxa Noturna",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Maldição",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      },
      {
        "trigger": "turn_end",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Fim do Turno: Drena 1 de VIDA do Soberano rival."
      }
    ],
    "description": "Sobrecarga +1. Ao Entrar: Compra 2 cartas. Fim do Turno: Drena 1 de VIDA do Soberano inimigo.",
    "flavorText": "O preço é pago em pesadelos; o lucro é colhido em segredos.",
    "imagePath": "/assets/cards/purple_10_pacto_profano.webp"
  },
  {
    "id": "purple_11_garra_rastejante",
    "name": "Garra Decepada Animada",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Menor",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Ímpeto.",
    "flavorText": "Mesmo separada do braço do assassino, ainda lembra como estrangular.",
    "imagePath": "/assets/cards/purple_11_garra_rastejante.webp"
  },
  {
    "id": "purple_12_fogo_fatuo",
    "name": "Fogo-Fátuo do Pântano",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Luminescente",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "draw_cards",
        "value": 1,
        "description": "Último Suspiro: Compra 1 carta."
      }
    ],
    "description": "Voo, Dreno de Vida. Último Suspiro: Ao se apagar, revela visões além-túmulo e compra 1 carta.",
    "flavorText": "Uma lanterna acesa com o desespero de viajantes afogados.",
    "imagePath": "/assets/cards/purple_12_fogo_fatuo.webp"
  },
  {
    "id": "purple_13_zumbi",
    "name": "Errante das Catacumbas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Carniçal",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Renascer"
    ],
    "effects": [],
    "description": "Guardião, Renascer. Recusa-se a cair no primeiro golpe fatal.",
    "flavorText": "Cortem seus membros; ele continuará se arrastando com os dentes.",
    "imagePath": "/assets/cards/purple_13_zumbi.webp"
  },
  {
    "id": "purple_14_carnical",
    "name": "Carniçal Devorador de Ossos",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Predador",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Atacar: Garras Paralisantes congelam 1 inimigo."
      }
    ],
    "description": "Dreno de Vida. Ao Atacar: O veneno de suas garras paralisa um inimigo por 1 turno.",
    "flavorText": "Banqueteia-se nos campos de batalha muito depois dos corvos partirem.",
    "imagePath": "/assets/cards/purple_14_carnical.webp"
  },
  {
    "id": "purple_15_espectro",
    "name": "Espectro do Lamento",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Espírito",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Alcance, Dreno de Vida. Atravessa armaduras mundanas para drenar a força vital.",
    "flavorText": "O ódio puro não precisa de carne para ferir.",
    "imagePath": "/assets/cards/purple_15_espectro.webp"
  },
  {
    "id": "purple_16_fantasma",
    "name": "Dama Fantasma Possessora",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Fantasma",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Assombra a Vanguarda inimiga (-1 ATQ)."
      }
    ],
    "description": "Voo. Ao Entrar: Reduz o ATQ das criaturas inimigas em 1.",
    "flavorText": "Ela veste corpos vivos como quem troca de vestido.",
    "imagePath": "/assets/cards/purple_16_fantasma.webp"
  },
  {
    "id": "purple_17_banshee",
    "name": "Banshee do Grito Mortal",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Arauto",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Pranto Mortal causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Seu lamento estilhaça a Vanguarda inimiga causando 2 de dano a todos.",
    "flavorText": "Tapar os ouvidos é inútil; ela grita diretamente dentro da alma.",
    "imagePath": "/assets/cards/purple_17_banshee.webp"
  },
  {
    "id": "purple_18_mumia",
    "name": "Faraó Enfaixado da Cripta",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Monarca",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Toque Letal",
      "Renascer"
    ],
    "effects": [],
    "description": "Guardião, Toque Letal, Renascer. Armadura 1. Sua maldição apodrece quem ousa tocá-lo.",
    "flavorText": "Seu coração guardado em vaso canópico garante que seu reinado jamais termine.",
    "imagePath": "/assets/cards/purple_18_mumia.webp"
  },
  {
    "id": "purple_19_conde_vampiro",
    "name": "Nosferatu, Soberano Carmesim",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Nobre",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Renascer"
    ],
    "regeneration": 2,
    "ascension": {
      "cost": 4,
      "newName": "Nosferatu, Imperador da Noite Eterna",
      "newAtk": 9,
      "newArmor": 2,
      "newMaxHp": 10,
      "addedKeywords": [
        "Ímpeto",
        "Atropelar"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Drena essência vital restaurando 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Voo, Dreno de Vida, Renascer. Regeneração 2. Ao Entrar: Cura 3 no Soberano. Ascensão (4): Forma de Patriarca Sanguinário (9/10, Ímpeto, Atropelar).",
    "flavorText": "Brindemos à sua juventude — ela terá um sabor esplêndido.",
    "imagePath": "/assets/cards/purple_19_conde_vampiro.webp"
  },
  {
    "id": "purple_20_tecelao_profano",
    "name": "Aracnomante das Cavernas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Aberração • Aracnídeo",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião",
      "Alcance",
      "Toque Letal",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Teia Sombria prende 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião, Alcance, Toque Letal, Dreno de Vida. Armadura 1. Ao Entrar: Prende 1 inimigo em teias (Congelado) e cura 2 no Soberano.",
    "flavorText": "Metade elfo das profundezas, metade pesadelo de oito patas.",
    "imagePath": "/assets/cards/purple_20_tecelao_profano.webp"
  },
  {
    "id": "purple_21_abolete",
    "name": "Leviatã Psíquico Primordial",
    "domain": "purple",
    "type": "creature",
    "subtype": "Aberração • Primordial",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 8,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Dreno de Vida"
    ],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "steal_small_enemy",
        "value": 3,
        "description": "Ao Entrar: Escraviza um inimigo com ATQ <= 3."
      }
    ],
    "description": "Sobrecarga +1. Alcance, Dreno de Vida. Ao Entrar: Escraviza mentalmente um inimigo com ATQ <= 3.",
    "flavorText": "Antes dos deuses nascerem, ele já sonhava nas águas negras.",
    "imagePath": "/assets/cards/purple_21_abolete.webp"
  },
  {
    "id": "purple_22_orbe_necrotico",
    "name": "Crânio Arcano da Morte",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Aberração",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 7,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Toque Letal"
    ],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima um aliado da Cripta."
      }
    ],
    "description": "Sobrecarga +1. Voo, Alcance, Toque Letal. Ao Entrar: Reanima um aliado caído da sua Cripta.",
    "flavorText": "Quando um Serafim dos Anéis Abissais cai, sua vigília continua flutuando.",
    "imagePath": "/assets/cards/purple_22_orbe_necrotico.webp"
  },
  {
    "id": "purple_23_dracolich",
    "name": "Ossaurion, Dragão-Ossário Eterno",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Dragão • Morto-Vivo",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 2,
    "atk": 7,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Renascer",
      "Toque Letal"
    ],
    "breathDamage": 3,
    "corruptionCost": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Exala miasma necrótico causando 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 4,
        "description": "Ao Entrar: Reanima 1 criatura (custo <= 4) da sua Cripta."
      }
    ],
    "description": "Sobrecarga +2. Voo, Toque Letal, Renascer. Armadura 2. Sopro 3. Ao Entrar: Causa 3 de dano à Vanguarda inimiga e reanima 1 criatura (custo <= 4) da Cripta.",
    "flavorText": "Nem a própria extinção conseguiu apagar sua ganância.",
    "imagePath": "/assets/cards/purple_23_dracolich.webp"
  },
  {
    "id": "purple_24_dragao_sombras",
    "name": "Nocturnus, Dragão do Eclipse",
    "domain": "purple",
    "type": "creature",
    "subtype": "Dragão • Sombrio",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "breathDamage": 2,
    "effects": [],
    "description": "Voo, Dreno de Vida. Armadura 1. Sopro 2: Chamas de sombra drenam a luz da fileira inimiga.",
    "flavorText": "Suas asas são feitas da escuridão que resta quando as estrelas morrem.",
    "imagePath": "/assets/cards/purple_24_dragao_sombras.webp"
  },
  {
    "id": "purple_25_dama_seis_laminas",
    "name": "Serpente Abissal de Seis Espadas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Demônio • General",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 7,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Fúria Crescente"
    ],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Atacar: Dança das Lâminas causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Sobrecarga +1. Ímpeto, Fúria Crescente. Ao Atacar: Suas seis espadas causam 2 de dano a toda a Vanguarda inimiga.",
    "flavorText": "Seis lâminas para atacar, uma cauda para estrangular.",
    "imagePath": "/assets/cards/purple_25_dama_seis_laminas.webp"
  },
  {
    "id": "purple_26_ceifar_essencia",
    "name": "Banquete de Almas",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Sombra",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +2 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Arranca 3 de VIDA de uma criatura inimiga e transfere 3 de VIDA para o seu Soberano.",
    "flavorText": "Nada se perde no Abismo; toda dor se transforma em poder.",
    "imagePath": "/assets/cards/purple_26_ceifar_essencia.webp"
  },
  {
    "id": "purple_27_emboscada_umbrosa",
    "name": "Manto Sufocante da Caverna",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Emboscada",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Reduz o ATQ da Vanguarda inimiga em 2."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano a um inimigo."
      }
    ],
    "description": "Reação: Envolve a Vanguarda inimiga em trevas (-2 ATQ) e causa 2 de dano a um alvo.",
    "flavorText": "A estalactite no teto nunca foi pedra.",
    "imagePath": "/assets/cards/purple_27_emboscada_umbrosa.webp"
  },
  {
    "id": "purple_28_filacterio_noite",
    "name": "Máscara do Dragão da Noite",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Dracônica",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 6,
        "description": "Ao Entrar: Reanima uma criatura de custo até 6 da sua Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Sobrecarga +1. Ao Entrar: Reanima criatura da Cripta e 2 de dano à Vanguarda. Início do Turno: Cura 2 no Soberano.",
    "flavorText": "Esculpida em crânio de dragão negro, sussurra segredos de imortalidade ácida.",
    "imagePath": "/assets/cards/purple_28_filacterio_noite.webp"
  },
  {
    "id": "purple_29_colheita_sombras",
    "name": "Colheita de Almas Sombrias",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Sobrecarga +1. Feitiço: Ceifa a força vital de um inimigo causando 3 de dano, curando 2 de VIDA do seu Soberano e comprando 1 carta.",
    "flavorText": "A vida nunca é perdida; apenas muda de dono.",
    "imagePath": "/assets/cards/purple_29_colheita_sombras.webp"
  },
  {
    "id": "purple_30_erguer_mortos",
    "name": "Erguer Legião da Cripta",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 5,
        "description": "Reanima uma criatura de custo até 5 da sua Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 aos seus aliados."
      }
    ],
    "description": "Sobrecarga +1. Feitiço: Reanima uma criatura de custo até 5 da sua Cripta e concede +1/+1 a todos os aliados.",
    "flavorText": "Soldados mortos não pedem soldo, água ou descanso.",
    "imagePath": "/assets/cards/purple_30_erguer_mortos.webp"
  },
  {
    "id": "purple_31_peste_abissal",
    "name": "Praga Necrótica do Abismo",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Maldição",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Reduz o ATQ das tropas inimigas em -2."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Sobrecarga +1. Feitiço: Nuvem pestilenta causa 3 de dano à fileira inimiga, reduz o ATQ dos inimigos em -2 e cura 3 no Soberano.",
    "flavorText": "O aço enferruja e a carne desfalece ao primeiro sopro da Cripta.",
    "imagePath": "/assets/cards/purple_31_peste_abissal.webp"
  },
  {
    "id": "purple_32_apocalipse_vazio",
    "name": "Eclipse do Vazio Eterno",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "destroy_enemy",
        "value": 1,
        "description": "Aniquila a criatura inimiga mais forte."
      },
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 7,
        "description": "Reanima uma criatura da sua Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Sobrecarga +2. Feitiço Lendário: Destrói o inimigo mais forte, reanima um campeão da sua Cripta e causa 2 de dano ao Soberano rival.",
    "flavorText": "Quando o Sol Negro se ergue, os vivos trocam de lugar com os mortos.",
    "imagePath": "/assets/cards/purple_32_apocalipse_vazio.webp"
  },
  {
    "id": "purple_33_espelho_agonia",
    "name": "Espelho da Agonia Sangrenta",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Maldição",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao agressor."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Reflete 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Reação: Reflete a dor do golpe causando 3 de dano ao inimigo e 2 de dano direto ao Soberano rival.",
    "flavorText": "Toda ferida aberta em nós sangra duas vezes em você.",
    "imagePath": "/assets/cards/purple_33_espelho_agonia.webp"
  },
  {
    "id": "purple_34_cripta_espinhos",
    "name": "Sarcófago de Espinhos Negros",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "destroy_enemy",
        "value": 1,
        "description": "Executa a criatura inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Reação: Fecha correntes e espinhos de ferro sobre o atacante, destruindo o inimigo e curando 3 de VIDA do seu Soberano.",
    "flavorText": "Um túmulo feito sob medida para quem ousa avançar.",
    "imagePath": "/assets/cards/purple_34_cripta_espinhos.webp"
  },
  {
    "id": "purple_35_calice_vampirico",
    "name": "Cálice da Sede Carmesim",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Sanguínea",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_end",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Fim do Turno: Drena 2 de VIDA do Soberano rival."
      },
      {
        "trigger": "turn_end",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Fim do Turno: Cura 1 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Cura 3 de VIDA e compra 1 carta. Fim do Turno: Drena 2 de VIDA do Soberano inimigo.",
    "flavorText": "A taça transborda a cada batida do coração dos mortais.",
    "imagePath": "/assets/cards/purple_35_calice_vampirico.webp"
  },
  {
    "id": "purple_36_trono_ossos",
    "name": "Trono de Ossos do Arquimago",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Necromancia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Invoca uma Sombra Faminta (2/2)."
      }
    ],
    "description": "Sobrecarga +1. Ao Entrar: Invoca Sombra Faminta (2/2). Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Sentar-se nele exige abrir mão da carne; erguer-se dele move um império de ossos.",
    "imagePath": "/assets/cards/purple_36_trono_ossos.webp"
  },
  {
    "id": "green_01_goblin",
    "name": "Emboscador Goblin da Mata",
    "domain": "green",
    "type": "creature",
    "subtype": "Goblinoide • Caçador",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Disparo de emboscada causa 1 de dano a um inimigo."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Causa 1 de dano a um inimigo.",
    "flavorText": "Um goblin sozinho é um incômodo; vinte nos arbustos são um funeral.",
    "imagePath": "/assets/cards/green_01_goblin.webp"
  },
  {
    "id": "green_02_aranha_gigante",
    "name": "Tecelã Venenosa do Dossel",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Aracnídeo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Prende (Congela) 1 inimigo."
      }
    ],
    "description": "Alcance, Toque Letal. Ao Entrar: Prende (Congela) 1 inimigo.",
    "flavorText": "Suas teias são mais fortes que cordas de cânhamo e silenciosas como o musgo.",
    "imagePath": "/assets/cards/green_02_aranha_gigante.webp"
  },
  {
    "id": "green_03_ursogrifo",
    "name": "Urso-Garra de Couraça Silvestre",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Predador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Ursogrifo Patriarca Alfa",
      "newAtk": 7,
      "newArmor": 1,
      "newMaxHp": 7,
      "addedKeywords": [
        "Fúria Crescente",
        "Guardião"
      ]
    },
    "effects": [],
    "description": "Ímpeto, Atropelar. Armadura 1.",
    "flavorText": "A força bruta da montanha combinada com garras capazes de partir escudos de carvalho.",
    "imagePath": "/assets/cards/green_03_ursogrifo.webp"
  },
  {
    "id": "green_04_pantera_miragem",
    "name": "Lince Espectral da Névoa",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Espírito Silvestre",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ímpeto, Escudo Divino. Ao Entrar: Concede +1/+1 a um aliado.",
    "flavorText": "Onde a bruma esmeralda toca a relva, a lâmina inimiga encontra apenas o vento.",
    "imagePath": "/assets/cards/green_04_pantera_miragem.webp"
  },
  {
    "id": "green_05_minotauro",
    "name": "Minotauro Quebra-Muros",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Berserker",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Chifres de Cerco causam 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto, Atropelar, Fúria Crescente. Armadura 1. Ao Atacar: Causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Para ele, qualquer formação de escudos é apenas lenha esperando o machado.",
    "imagePath": "/assets/cards/green_05_minotauro.webp"
  },
  {
    "id": "green_06_basilisco",
    "name": "Basilisco de Olhar Petrificante",
    "domain": "green",
    "type": "creature",
    "subtype": "Réptil • Petrificador",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Alcance",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Petrifica (Congela) 1 inimigo."
      }
    ],
    "description": "Alcance, Toque Letal. Armadura 1. Ao Entrar: Causa 2 de dano e Petrifica (Congela) 1 inimigo.",
    "flavorText": "Seu covil é adornado por jardins das mais perfeitas estátuas de guerreiros.",
    "imagePath": "/assets/cards/green_06_basilisco.webp"
  },
  {
    "id": "green_07_troll",
    "name": "Troll Regenerador do Pântano",
    "domain": "green",
    "type": "creature",
    "subtype": "Gigante • Mutante",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 1,
    "atk": 6,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Fúria Crescente"
    ],
    "regeneration": 3,
    "effects": [],
    "description": "Guardião, Atropelar, Fúria Crescente. Armadura 1, Regeneração 3.",
    "flavorText": "A menos que você tenha fogo ou ácido, você está apenas treinando o apetite dele.",
    "imagePath": "/assets/cards/green_07_troll.webp"
  },
  {
    "id": "green_08_ente",
    "name": "Guardião Carvalho-Ancião",
    "domain": "green",
    "type": "creature",
    "subtype": "Planta • Colosso",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA de todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Guardião, Alcance. Armadura 2, Regeneração 2. Ao Entrar: Cura 3 de VIDA e concede +1/+1 a todos os aliados.",
    "flavorText": "Ele viu impérios nascerem como brotos e caírem como folhas secas.",
    "imagePath": "/assets/cards/green_08_ente.webp"
  },
  {
    "id": "green_09_hidra",
    "name": "Vorágine, Hidra Voraz do Pântano",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Lendária",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Alcance",
      "Fúria Crescente"
    ],
    "regeneration": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Atropelar, Alcance, Fúria Crescente. Armadura 2, Regeneração 3, Sopro 2. Ao Entrar: Causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Cinco gargantas famintas, e cada ferida faz brotar mais duas.",
    "imagePath": "/assets/cards/green_09_hidra.webp",
    "breathDamage": 2
  },
  {
    "id": "green_10_despertar_floresta",
    "name": "Bênção da Dríade Anciã",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Silvestre",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1 ATQ e +2 VIDA a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Concede +1 ATQ e +2 VIDA a todos os aliados e restaura 3 de VIDA do seu Soberano.",
    "flavorText": "A floresta cura os seus e sufoca os invasores em raízes.",
    "imagePath": "/assets/cards/green_10_despertar_floresta.webp"
  },
  {
    "id": "green_11_sugador_alado",
    "name": "Mosquito-Vampiro da Selva",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Parasita",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 1,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Dreno de Vida. Pequeno predador alado que drena sangue para o seu Soberano.",
    "flavorText": "Onde há pântano estagnado, o céu inteiro tem trombas afiadas.",
    "imagePath": "/assets/cards/green_11_sugador_alado.webp"
  },
  {
    "id": "green_12_pixie",
    "name": "Fada Pixie do Pó Estelar",
    "domain": "green",
    "type": "creature",
    "subtype": "Fada • Ilusionista",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Concede +1 Essência neste turno."
      }
    ],
    "description": "Voo, Escudo Divino. Ao Entrar: Pó feérico concede +1 de Essência extra neste turno.",
    "flavorText": "Uma pitada de pó dourado e o cavaleiro acredita que sua espada é uma serpente.",
    "imagePath": "/assets/cards/green_12_pixie.webp"
  },
  {
    "id": "green_13_satiro",
    "name": "Sátiro Flautista da Clareira",
    "domain": "green",
    "type": "creature",
    "subtype": "Fada • Bardo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +2 ATQ e +1 VIDA ao aliado mais forte."
      }
    ],
    "description": "Alcance. Ao Entrar: Sua melodia selvagem inspira o aliado mais forte (+2 ATQ / +1 VIDA).",
    "flavorText": "Sua flauta faz até as árvores marcharem para a guerra.",
    "imagePath": "/assets/cards/green_13_satiro.webp"
  },
  {
    "id": "green_14_gnoll",
    "name": "Caçador Hiena da Savana",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Saqueador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Fúria Crescente. Ganha +1 ATQ sempre que sobrevive a um combate.",
    "flavorText": "Sua gargalhada anuncia que a caçada começou.",
    "imagePath": "/assets/cards/green_14_gnoll.webp"
  },
  {
    "id": "green_15_bugbear",
    "name": "Brutamontes das Cavernas Emboscador",
    "domain": "green",
    "type": "creature",
    "subtype": "Goblinoide • Bruto",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a uma unidade inimiga."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Causa 2 de dano a uma unidade inimiga.",
    "flavorText": "Quando você ouve o galho quebrar, a maça já desceu.",
    "imagePath": "/assets/cards/green_15_bugbear.webp"
  },
  {
    "id": "green_16_ankheg",
    "name": "Mandíbula Escavadora Ácida",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Insetoide",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Alcance",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Toque Letal. Armadura 1 (Carapaça de Quitina). Suas mandíbulas secretam enzimas corrosivas.",
    "flavorText": "O solo da campina se abre e engole cavalo e cavaleiro de uma só vez.",
    "imagePath": "/assets/cards/green_16_ankheg.webp"
  },
  {
    "id": "green_17_centauro",
    "name": "Arqueiro Centauro das Campinas",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Arqueiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano a uma unidade inimiga."
      }
    ],
    "description": "Alcance • Ímpeto. Ao Entrar: Causa 1 de dano a uma unidade inimiga.",
    "flavorText": "Nenhum invasor cruza a fronteira das árvores antigas sem três flechas no peito.",
    "imagePath": "/assets/cards/green_17_centauro.webp"
  },
  {
    "id": "green_18_lobisomem",
    "name": "Licantropo da Lua Sangrenta",
    "domain": "green",
    "type": "creature",
    "subtype": "Metamorfo • Licantropo",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Fúria Crescente"
    ],
    "regeneration": 1,
    "effects": [],
    "description": "Ímpeto, Fúria Crescente. Regeneração 1. A maldição lunar cura suas feridas a cada turno.",
    "flavorText": "A besta lá dentro nunca esteve presa; ela apenas esperava a noite.",
    "imagePath": "/assets/cards/green_18_lobisomem.webp"
  },
  {
    "id": "green_19_guardiao_ursino",
    "name": "Patriarca Urso-Ancestral",
    "domain": "green",
    "type": "creature",
    "subtype": "Metamorfo • Guardião",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Guardião. Armadura 1, Regeneração 2. Ao Entrar: Cura 3 de VIDA no Soberano e concede +1/+2 a um aliado.",
    "flavorText": "Manso como o rio no verão; avassalador como a avalanche no inverno.",
    "imagePath": "/assets/cards/green_19_guardiao_ursino.webp"
  },
  {
    "id": "green_20_tubarao_terrestre",
    "name": "Tubarão Terrestre Couraçado",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Escavador",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Entrar: Salto Sísmico causa 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Atropelar. Armadura 2. Ao Entrar: Emerge do subsolo causando 1 de dano a toda a Vanguarda inimiga.",
    "flavorText": "A barbatana dorsal cortando a terra firme é o último aviso.",
    "imagePath": "/assets/cards/green_20_tubarao_terrestre.webp"
  },
  {
    "id": "green_21_colosso_pantano",
    "name": "Colosso de Vinhas do Pântano",
    "domain": "green",
    "type": "creature",
    "subtype": "Planta • Golias",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Guardião. Armadura 1, Regeneração 2. Uma massa viva de raízes e lodo que absorve impactos.",
    "flavorText": "Tudo o que apodrece no pântano acaba caminhando novamente dentro dele.",
    "imagePath": "/assets/cards/green_21_colosso_pantano.webp"
  },
  {
    "id": "green_22_wyvern",
    "name": "Serpe Wyvern do Ferrão",
    "domain": "green",
    "type": "creature",
    "subtype": "Dragão • Venenoso",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Voo, Ímpeto, Toque Letal. Mergulha dos céus com seu ferrão caudal venenoso.",
    "flavorText": "Menos nobre que os dragões verdadeiros, porém duas vezes mais faminta.",
    "imagePath": "/assets/cards/green_22_wyvern.webp"
  },
  {
    "id": "green_23_colosso_escavador",
    "name": "Tatu-Titã Quebra-Rochas",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Colosso Subterrâneo",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Olhar Confuso paralisa 1 inimigo."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 2. Ao Entrar: Seu tremor sísmico atordoa e paralisa 1 inimigo.",
    "flavorText": "Quando sua carapaça de granito rompe o solo, toda a fileira da frente perde o equilíbrio.",
    "imagePath": "/assets/cards/green_23_colosso_escavador.webp"
  },
  {
    "id": "green_24_verme_purpura",
    "name": "Leviatã Verme das Fendas",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Titã • Profundezas",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 10,
    "armor": 2,
    "hp": 10,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Terremoto causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Atropelar. Armadura 2. Ao Entrar: Terremoto Abismo Profundo causa 2 de dano a toda a Vanguarda inimiga.",
    "flavorText": "Cidades anãs inteiras desapareceram na garganta que engole montanhas.",
    "imagePath": "/assets/cards/green_24_verme_purpura.webp",
    "breathDamage": 2
  },
  {
    "id": "green_25_dragao_verde",
    "name": "Viperia, Tirana da Selva Tóxica",
    "domain": "green",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Toque Letal"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Ao Entrar: Névoa Clorídrica reduz o ATQ da Vanguarda inimiga em 2."
      }
    ],
    "description": "Voo, Alcance, Toque Letal. Sopro 2. Ao Entrar: Gás venenoso reduz o ATQ de toda a Vanguarda inimiga em 2.",
    "flavorText": "Mais perigosa que seu sopro venenoso é a teia de intrigas que ela sussurra.",
    "imagePath": "/assets/cards/green_25_dragao_verde.webp"
  },
  {
    "id": "green_26_instinto_predatorio",
    "name": "Bote do Tigre Ancestral",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Feral",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 3,
        "secondaryValue": 3,
        "description": "Concede +3 ATQ e +3 VIDA ao seu aliado mais forte."
      }
    ],
    "description": "Feitiço: Desperta o predador alfa, concedendo +3 ATQ e +3 VIDA à sua criatura de maior ataque.",
    "flavorText": "Na lei da selva, existe apenas o caçador e a carne.",
    "imagePath": "/assets/cards/green_26_instinto_predatorio.webp"
  },
  {
    "id": "green_27_esporos_toxicos",
    "name": "Eclosão de Esporos Micônicos",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Esporos",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 1,
        "description": "Restaura 1 de VIDA de todos os aliados."
      }
    ],
    "description": "Reação: Nuvem de esporos causa 2 de dano à Vanguarda inimiga e regenera 1 de VIDA de todos os seus aliados.",
    "flavorText": "Respire fundo o perfume da caverna — será a última vez.",
    "imagePath": "/assets/cards/green_27_esporos_toxicos.webp"
  },
  {
    "id": "green_28_totem_silvestre",
    "name": "Santuário do Espírito Silvestre",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Feérica",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Ao Entrar: Gera +2 de Essência neste turno."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Gera +2⚡ neste turno. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Onde as asas prismáticas pousam, a terra floresce em mana pura.",
    "imagePath": "/assets/cards/green_28_totem_silvestre.webp"
  },
  {
    "id": "green_29_manticora_espinhos",
    "name": "Mantícora da Floresta de Espinhos",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Alada",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Dispara espinhos da cauda causando 2 de dano a um inimigo."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Dispara uma salva de espinhos causando 2 de dano a um inimigo.",
    "flavorText": "Caça do alto das copas antes que a presa ouça o bater de suas asas.",
    "imagePath": "/assets/cards/green_29_manticora_espinhos.webp"
  },
  {
    "id": "green_30_xama_druida",
    "name": "Arquidruida do Círculo Antigo",
    "domain": "green",
    "type": "creature",
    "subtype": "Druida • Metamorfo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "regeneration": 1,
    "ascension": {
      "cost": 4,
      "newName": "Avatar da Árvore-Mundo",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 8,
      "addedKeywords": [
        "Guardião",
        "Atropelar"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA de todos os aliados."
      }
    ],
    "description": "Alcance, Regeneração 1. Ao Entrar: Cura 2 nos aliados. Ascensão (4): Avatar da Árvore-Mundo (6/8, ARM 1, Guardião, Atropelar).",
    "flavorText": "Ele fala em nome das raízes; quando se enfurece, ele se torna a própria floresta.",
    "imagePath": "/assets/cards/green_30_xama_druida.webp"
  },
  {
    "id": "green_31_escorpiao_colossal",
    "name": "Escorpião Imperador de Quitina",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Aracnídeo",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Ferrão venenoso causa 1 de dano a um inimigo."
      }
    ],
    "description": "Guardião, Toque Letal. Armadura 1. Ao Entrar: Golpeia com o ferrão causando 1 de dano a um inimigo.",
    "flavorText": "Uma gota de seu veneno basta para derrubar um mamute de guerra.",
    "imagePath": "/assets/cards/green_31_escorpiao_colossal.webp"
  },
  {
    "id": "green_32_gorila_alfa",
    "name": "Kongor, Rei de Costas Prateadas",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Primata",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Rugido Alfa concede +1/+1 aos aliados."
      }
    ],
    "description": "Atropelar, Fúria Crescente. Armadura 1. Ao Entrar: Concede +1 ATQ e +1 VIDA a todos os aliados.",
    "flavorText": "Quando ele bate no peito, até os dragões pensam duas vezes antes de pousar.",
    "imagePath": "/assets/cards/green_32_gorila_alfa.webp"
  },
  {
    "id": "green_33_behemoth_primordial",
    "name": "Gorgoroth, Behemoth Devorador de Montanhas",
    "domain": "green",
    "type": "creature",
    "subtype": "Titã • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião",
      "Fúria Crescente"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião, Atropelar, Fúria Crescente, Regeneração 2. ARM 2. Ao Entrar: +2/+2 aos aliados e cura 4 no Soberano.",
    "flavorText": "As cordilheiras do sul nada mais são do que as escamas de seu dorso adormecido.",
    "imagePath": "/assets/cards/green_33_behemoth_primordial.webp"
  },
  {
    "id": "green_34_furia_matilha",
    "name": "Chamado da Matilha Alfa",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Feral",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2 ATQ e +1 VIDA a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: O uivo ancestral desperta o instinto assassino, concedendo +2 ATQ e +1 VIDA a todos os aliados e comprando 1 carta.",
    "flavorText": "Um lobo é um batedor; vinte lobos são uma sentença.",
    "imagePath": "/assets/cards/green_34_furia_matilha.webp"
  },
  {
    "id": "green_35_fosso_vinhas",
    "name": "Fosso de Vinhas Estranguladoras",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "uncommon",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Prende e paralisa o inimigo atacante."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Espinhos causam 3 de dano ao inimigo."
      }
    ],
    "description": "Reação: Raízes espinhosas brotam do solo, paralisando o atacante e causando 3 de dano.",
    "flavorText": "A floresta guarda com carinho todos os ossos de quem pisa sem permissão.",
    "imagePath": "/assets/cards/green_35_fosso_vinhas.webp"
  },
  {
    "id": "green_36_coracao_floresta",
    "name": "Coração da Seiva Primordial",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Silvestre",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 1,
        "description": "Início do Turno: Cura 1 de VIDA em todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: +1⚡ e compra 1 carta. Início do Turno: Cura 1 em todos os aliados e +1/+1 a um aliado.",
    "flavorText": "Pulsa no mesmo compasso das marés e das estações.",
    "imagePath": "/assets/cards/green_36_coracao_floresta.webp"
  },
  {
    "id": "gold_01_espada_animada",
    "name": "Lâmina Voadora Consagrada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Arma",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Armadura 1. Uma lâmina sem braço que jamais cansa de golpear.",
    "flavorText": "Forjada para defender o altar mesmo quando todos os monges já tombaram.",
    "imagePath": "/assets/cards/gold_01_espada_animada.webp"
  },
  {
    "id": "gold_02_gargula",
    "name": "Gárgula da Catedral Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Elemental • Pedra",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Voo"
    ],
    "effects": [],
    "description": "Guardião, Voo. Armadura 1. Pele de granito que reduz todo dano sofrido em 1.",
    "flavorText": "Imóvel por cem anos no parapeito, até que o profano pisa no átrio.",
    "imagePath": "/assets/cards/gold_02_gargula.webp"
  },
  {
    "id": "gold_03_mimico",
    "name": "Mímico do Cofre Real",
    "domain": "gold",
    "type": "creature",
    "subtype": "Metamorfo • Armadilha",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Mordida Adesiva causa 1 de dano a um inimigo."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Sua língua adesiva cola e paralisa um inimigo por 1 turno.",
    "flavorText": "A ganância dos ladrões é o tempero favorito da masmorra.",
    "imagePath": "/assets/cards/gold_03_mimico.webp"
  },
  {
    "id": "gold_04_armadura_conjurada",
    "name": "Sentinela de Elmo Arcano",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Cavaleiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 2,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Voo",
      "Escudo Divino"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Colosso de Placas Celestiais",
      "newAtk": 6,
      "newArmor": 3,
      "newMaxHp": 7,
      "addedKeywords": [
        "Atropelar"
      ]
    },
    "effects": [],
    "description": "Guardião, Voo, Escudo Divino. Armadura 2. Ascensão (4): Colosso de Placas Celestiais (6/7, Armadura 3).",
    "flavorText": "Vazia de carne, imune ao medo, movida apenas pelo dever.",
    "imagePath": "/assets/cards/gold_04_armadura_conjurada.webp"
  },
  {
    "id": "gold_05_automato_guardiao",
    "name": "Autômato Égide da Cidadela",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Colosso",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 1,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião, Escudo Divino. Armadura 2, Regeneração 1. Ao Entrar: Transfere proteção arcana curando 3 de VIDA do seu Soberano.",
    "flavorText": "Gravado com o selo do mestre, ele recebe cada golpe sem dar um passo atrás.",
    "imagePath": "/assets/cards/gold_05_automato_guardiao.webp",
    "regeneration": 1
  },
  {
    "id": "gold_06_deva",
    "name": "Arauto Seráfico da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Celestial • Anjo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Escudo Divino",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Maça Radiante causa 2 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Voo, Escudo Divino, Dreno de Vida. Ao Entrar: Luz celestial cura 2 de VIDA de todos os aliados. Ascensão (4): Transforma-se em Arcanjo Solar do Zênite (8/9, ARM 2).",
    "flavorText": "Onde suas asas brancas descem, as feridas se fecham e as sombras recuam.",
    "imagePath": "/assets/cards/gold_06_deva.webp",
    "ascension": {
      "cost": 4,
      "newName": "Arcanjo Solar do Zênite",
      "newAtk": 8,
      "newArmor": 2,
      "newMaxHp": 9,
      "addedKeywords": [
        "Voo",
        "Escudo Divino",
        "Guardião"
      ]
    }
  },
  {
    "id": "gold_07_dragao_ouro",
    "name": "Aurarius, Majestade do Sol",
    "domain": "gold",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 8,
    "armor": 3,
    "hp": 10,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      }
    ],
    "description": "Voo, Guardião, Escudo Divino. Armadura 3. Sopro 2. Ao Entrar: Concede Escudo Divino a todos os seus aliados.",
    "flavorText": "Suas escamas refletem a própria alvorada da criação.",
    "imagePath": "/assets/cards/gold_07_dragao_ouro.webp"
  },
  {
    "id": "gold_08_golem_ferro",
    "name": "Golem de Ferro Inexpugnável",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Titã",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 2,
    "atk": 8,
    "armor": 3,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Sopro de Gás Venenoso causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 3. Reduz em 3 o dano de qualquer fonte.",
    "flavorText": "Trinta toneladas de aço maciço que desconhecem dor, piedade ou fadiga.",
    "imagePath": "/assets/cards/gold_08_golem_ferro.webp"
  },
  {
    "id": "gold_09_serafim_solar",
    "name": "Zephaniel, Arcanjo Solar do Zênite",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Lendário",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Escudo Divino",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Ao Entrar: Flecha Assassina causa 4 de dano a um inimigo."
      }
    ],
    "description": "Voo, Alcance, Escudo Divino, Dreno de Vida. Ao Entrar: Dispara um feixe solar que causa 4 de dano a um inimigo.",
    "flavorText": "Quando um Solar desembainha sua espada, até os lordes abissais fecham os olhos.",
    "imagePath": "/assets/cards/gold_09_serafim_solar.webp"
  },
  {
    "id": "gold_10_egide_radiante",
    "name": "Égide do Planetário",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Bênção",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1 ATQ e +2 VIDA a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Concede Escudo Divino, +1 ATQ e +2 de VIDA a todas as suas unidades aliadas, e compra 1 carta.",
    "flavorText": "Nenhum golpe profano atravessa o decreto da luz.",
    "imagePath": "/assets/cards/gold_10_egide_radiante.webp"
  },
  {
    "id": "gold_11_homunculo",
    "name": "Homúnculo do Alquimista",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Familiar",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo. Ao Entrar: Transmite visão telepática ao seu mestre, comprando 1 carta.",
    "flavorText": "Moldado em argila, raiz de mandrágora e três gotas do sangue do criador.",
    "imagePath": "/assets/cards/gold_11_homunculo.webp"
  },
  {
    "id": "gold_12_automato_engrenagem",
    "name": "Operário de Relojoaria",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Engrenagem",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 1,
    "armor": 1,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Armadura 1. Cumpre sua diretriz de defesa com precisão matemática.",
    "flavorText": "Tique-taque. O caos será corrigido.",
    "imagePath": "/assets/cards/gold_12_automato_engrenagem.webp"
  },
  {
    "id": "gold_13_sentinela_geometrico",
    "name": "Cubo Arbalista de Precisão",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Arqueiro",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [],
    "description": "Voo, Alcance. Armadura 1. Calcula trajetórias perfeitas a partir da Retaguarda.",
    "flavorText": "Quatro braços, quatro arcos, zero margem de erro.",
    "imagePath": "/assets/cards/gold_13_sentinela_geometrico.webp"
  },
  {
    "id": "gold_14_pegaso",
    "name": "Pégaso da Cavalaria Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Corcel",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Voo, Ímpeto. Ao Entrar: Inspira o aliado mais forte concedendo +1 ATQ e +1 VIDA.",
    "flavorText": "Apenas os puros de propósito conseguem tocar suas rédeas de luz.",
    "imagePath": "/assets/cards/gold_14_pegaso.webp"
  },
  {
    "id": "gold_15_grifo_real",
    "name": "Grifo Real da Cidadela",
    "domain": "gold",
    "type": "creature",
    "subtype": "Monstruosidade • Montaria",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Armadura 1. Predador nobre que patrulha as torres reais.",
    "flavorText": "Coragem de leão, visão de águia e garras que partem elmos de aço.",
    "imagePath": "/assets/cards/gold_15_grifo_real.webp"
  },
  {
    "id": "gold_16_unicornio",
    "name": "Unicórnio do Bosque Sagrado",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Guardião",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Ímpeto",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Escudo Divino. Armadura 1. Ao Entrar: O toque de seu chifre purifica e cura 4 de VIDA do seu Soberano.",
    "flavorText": "Veneno algum sobrevive nas águas onde ele inclina a fronte.",
    "imagePath": "/assets/cards/gold_16_unicornio.webp"
  },
  {
    "id": "gold_17_couatl",
    "name": "Couatl das Plumas Celestes",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Serpente",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_target_ally",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do aliado mais ferido."
      }
    ],
    "description": "Voo, Alcance, Escudo Divino. Armadura 1. Ao Entrar: Cura 3 de VIDA do aliado mais ferido.",
    "flavorText": "Guardião de profecias antigas escritas em penas de arco-íris e ouro.",
    "imagePath": "/assets/cards/gold_17_couatl.webp"
  },
  {
    "id": "gold_18_litomorfo",
    "name": "Sentinela de Rocha Viva",
    "domain": "gold",
    "type": "creature",
    "subtype": "Elemental • Rocha",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 3,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Armadura 3. Quase impenetrável contra ataques físicos comuns.",
    "flavorText": "A própria montanha se levanta quando seus veios sagrados são violados.",
    "imagePath": "/assets/cards/gold_18_litomorfo.webp"
  },
  {
    "id": "gold_19_touro_ferreo",
    "name": "Touro Couraçado de Bronze",
    "domain": "gold",
    "type": "creature",
    "subtype": "Monstruosidade • Couraçado",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "breathDamage": 1,
    "effects": [
      {
        "trigger": "on_attack",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Atacar: Vapor Petrificante congela 1 inimigo."
      }
    ],
    "description": "Atropelar. Armadura 2. Sopro 1. Ao Atacar: Exala gás metálico que petrifica 1 inimigo.",
    "flavorText": "Suas placas de ferro batido rangem como portões de fortaleza em carga.",
    "imagePath": "/assets/cards/gold_19_touro_ferreo.webp"
  },
  {
    "id": "gold_20_androesfinge",
    "name": "Esfinge Juíza do Templo Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Celestial • Guardião",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Rugido Trovejante causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Guardião. Armadura 2. Ao Entrar: Seu rugido sagrado causa 2 de dano a toda a Vanguarda inimiga.",
    "flavorText": "Sua voz ecoa pelas colunas do Templo Solar como o trovão que precede o julgamento.",
    "imagePath": "/assets/cards/gold_20_androesfinge.webp"
  },
  {
    "id": "gold_21_golem_barro",
    "name": "Golem de Argila Sagrada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Santuário",
    "rarity": "uncommon",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Fúria Crescente"
    ],
    "regeneration": 1,
    "effects": [],
    "description": "Guardião, Fúria Crescente. Armadura 2, Regeneração 1. Moldado pelos sumos sacerdotes.",
    "flavorText": "A palavra da verdade escrita em sua testa o mantém de pé contra mil espadas.",
    "imagePath": "/assets/cards/gold_21_golem_barro.webp"
  },
  {
    "id": "gold_22_soberano_dao",
    "name": "Grão-Cã das Minas de Ouro",
    "domain": "gold",
    "type": "creature",
    "subtype": "Gênio • Mineral",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Ao Entrar: Gera +2 de Essência neste turno."
      }
    ],
    "description": "Atropelar. Armadura 2. Ao Entrar: Abre veios de ouro puro, gerando +2 de Essência neste turno.",
    "flavorText": "Todo diamante sob a crosta do mundo pertence aos seus cofres.",
    "imagePath": "/assets/cards/gold_22_soberano_dao.webp"
  },
  {
    "id": "gold_23_dragao_prata",
    "name": "Argentum, Sentinela Alabastro",
    "domain": "gold",
    "type": "creature",
    "subtype": "Dragão • Ancião",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Gás Paralisante congela a Vanguarda inimiga."
      }
    ],
    "description": "Voo, Alcance, Escudo Divino. Armadura 2. Sopro 2. Ao Entrar: Paralisa toda a Vanguarda inimiga.",
    "flavorText": "Cavaleiros justos contam histórias do dragão prateado que desceu das nuvens na hora mais escura.",
    "imagePath": "/assets/cards/gold_23_dragao_prata.webp"
  },
  {
    "id": "gold_24_tita_empirico",
    "name": "Titã Primogênito da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Titã • Primogênito Solar",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 9,
    "armor": 2,
    "hp": 10,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Golpe de Malho causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Atropelar, Escudo Divino. Armadura 2. Ao Entrar: Faz tremer o campo de batalha causando 3 de dano à Vanguarda inimiga.",
    "flavorText": "Quando seus pés tocam o mármore de Solária, o próprio horizonte se ilumina em ouro.",
    "imagePath": "/assets/cards/gold_24_tita_empirico.webp"
  },
  {
    "id": "gold_25_veredito_celestial",
    "name": "Espada do Julgamento Solar",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Julgamento",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Coluna de luz solar causa 4 de dano a um inimigo e restaura 3 de VIDA do seu Soberano.",
    "flavorText": "A balança pesou suas obras; a lâmina executa a sentença.",
    "imagePath": "/assets/cards/gold_25_veredito_celestial.webp"
  },
  {
    "id": "gold_26_muralha_aco",
    "name": "Falange de Escudos Animados",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Fortificação",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os aliados."
      }
    ],
    "description": "Reação: Escudos encantados voam para proteger sua tropa, concedendo Escudo Divino a todos os aliados.",
    "flavorText": "O aço obedece ao comando antes mesmo do golpe inimigo chegar.",
    "imagePath": "/assets/cards/gold_26_muralha_aco.webp"
  },
  {
    "id": "gold_27_decreto_gloria",
    "name": "Juramento do Campeão",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Honra",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1 ATQ e +2 VIDA a todos os aliados."
      }
    ],
    "description": "Feitiço: Fortalece suas fileiras concedendo +1 ATQ e +2 VIDA a todas as suas unidades.",
    "flavorText": "Pela coroa, pelo pacto e pelo sol que nunca se põe!",
    "imagePath": "/assets/cards/gold_27_decreto_gloria.webp"
  },
  {
    "id": "gold_28_reliquia_pacto",
    "name": "Arca da Aliança Dourada",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Sagrado",
    "rarity": "rare",
    "cost": 2,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 1,
        "description": "Início do Turno: Restaura +1 de VIDA a todos os aliados."
      }
    ],
    "description": "Ao Entrar: Escudo Divino a todos os aliados. Início do Turno: Cura +1 em todos os aliados.",
    "flavorText": "Cinco brasões antigos unidos sob um único juramento de proteger a cidadela.",
    "imagePath": "/assets/cards/gold_28_reliquia_pacto.webp"
  },
  {
    "id": "gold_29_martelo_trovao",
    "name": "Martelo Forjado em Estrela",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Armamento",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Golpeia um inimigo causando 2 de dano."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Abençoa um aliado com +1/+1."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano a um inimigo. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Pesado demais para mãos mortais; leve como a luz para os justos.",
    "imagePath": "/assets/cards/gold_29_martelo_trovao.webp"
  },
  {
    "id": "gold_30_escudo_solar",
    "name": "Bastião do Sol Invicto",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Égide",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Restaura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Início do Turno: Concede +1 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Ao Entrar: Escudo Divino aos aliados e cura 3 no Soberano. Início do Turno: +1/+2 a um aliado.",
    "flavorText": "Nenhuma sombra atravessa o ouro consagrado ao meio-dia.",
    "imagePath": "/assets/cards/gold_30_escudo_solar.webp"
  },
  {
    "id": "gold_31_forja_runica",
    "name": "Fornalha Rúnica dos Anões",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Forja",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Reforça um aliado com +1/+1."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Concede +1/+1 a um aliado e compra 1 carta. Início do Turno: +1/+1 a um aliado.",
    "flavorText": "Ouro derretido e runas antigas alimentam o coração dos autômatos.",
    "imagePath": "/assets/cards/gold_31_forja_runica.webp"
  },
  {
    "id": "gold_32_estandarte_imperial",
    "name": "Estandarte da Legião Dourada",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Insígnia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 aos aliados."
      },
      {
        "trigger": "turn_end",
        "type": "heal_all_allies",
        "value": 1,
        "description": "Fim do Turno: Cura +1 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Invoca uma Sentinela de Ferro (2/2)."
      }
    ],
    "description": "Ao Entrar: +1/+1 aos aliados e invoca Sentinela (2/2). Fim do Turno: Cura +1 em todos.",
    "flavorText": "Enquanto o pavilhão dourado tremular, a falange jamais recuará.",
    "imagePath": "/assets/cards/gold_32_estandarte_imperial.webp"
  },
  {
    "id": "gold_33_trono_celestial",
    "name": "Trono Celestial do Zênite",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Lendária",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 1,
        "description": "Início do Turno: Cura +1 de VIDA em todos os aliados."
      }
    ],
    "description": "Ao Entrar: Escudo Divino e +1/+1 aos aliados. Início do Turno: Cura +1 em todos os aliados.",
    "flavorText": "Do alto do Zênite, cada sentença proferida se torna lei imutável.",
    "imagePath": "/assets/cards/gold_33_trono_celestial.webp"
  },
  {
    "id": "gold_34_luz_purificadora",
    "name": "Raio da Luz Purificadora",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Luz",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano radiante a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 1,
        "description": "Cura 1 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Uma coluna de luz solar causa 3 de dano a um inimigo, cura 1 de VIDA em todos os aliados e compra 1 carta.",
    "flavorText": "A mesma luz que aquece os justos reduz os corruptos a pó.",
    "imagePath": "/assets/cards/gold_34_luz_purificadora.webp"
  },
  {
    "id": "gold_35_chamado_valquirias",
    "name": "Chamado das Valquírias Solares",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Ressurreição",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 6,
        "description": "Reanima uma criatura de custo até 6 da sua Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os aliados."
      }
    ],
    "description": "Feitiço: As Valquírias trazem de volta um campeão da sua Cripta (custo até 6) e concedem Escudo Divino a todos os aliados.",
    "flavorText": "Os heróis da Ordem só descansam quando a última batalha termina.",
    "imagePath": "/assets/cards/gold_35_chamado_valquirias.webp"
  },
  {
    "id": "gold_36_santuario_inquebravel",
    "name": "Decreto do Santuário Inquebrável",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Proteção",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1 ATQ e +2 VIDA aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Reação: Ergue uma cúpula dourada no momento do impacto, concedendo +1/+2 às suas criaturas e curando 2 no Soberano.",
    "flavorText": "As portas da cidadela não cedem nem ao ariete nem ao dragão.",
    "imagePath": "/assets/cards/gold_36_santuario_inquebravel.webp"
  },
  {
    "id": "neutral_01_mercenario_veterano",
    "name": "Capitão Mercenário da Fronteira",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Mercenário",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Sem requisito de Afinidade. Ímpeto. Luta por qualquer Soberano que pague seu preço.",
    "flavorText": "Minha lealdade dura exatamente até a última moeda do saco.",
    "imagePath": "/assets/cards/neutral_01_mercenario_veterano.webp"
  },
  {
    "id": "neutral_02_assassino_guilda",
    "name": "Lâmina Silenciosa da Guilda",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Assassino",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Ímpeto",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Sem requisito de Afinidade. Alcance, Ímpeto, Toque Letal. Armadura 1.",
    "flavorText": "Veneno de wyvern na ponta da besta; silêncio no contrato.",
    "imagePath": "/assets/cards/neutral_02_assassino_guilda.webp"
  },
  {
    "id": "neutral_03_arcanista_errante",
    "name": "Erudito do Véu Cinzento",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Arcanista",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Sem requisito de Afinidade. Alcance. Ao Entrar: Compra 1 carta do seu grimório.",
    "flavorText": "Ele estuda todos os cinco domínios sem se ajoelhar diante de nenhum.",
    "imagePath": "/assets/cards/neutral_03_arcanista_errante.webp"
  },
  {
    "id": "neutral_04_espiao_duplo",
    "name": "Metamorfo Sem Rosto",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Metamorfo • Espião",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Sem requisito de Afinidade. Escudo Divino. Engana o primeiro golpe assumindo a face de um aliado.",
    "flavorText": "O guarda ao seu lado morreu ontem; quem está sorrindo no elmo dele?",
    "imagePath": "/assets/cards/neutral_04_espiao_duplo.webp"
  },
  {
    "id": "neutral_05_corsario_astral",
    "name": "Corsário da Lâmina Prateada",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Astral • Guerreiro",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 5,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Sem requisito de Afinidade. Ímpeto, Atropelar. Armadura 1. Viajante planar de ataque fulminante.",
    "flavorText": "Navegando pelos ventos prateados entre os mundos em galeões voadores.",
    "imagePath": "/assets/cards/neutral_05_corsario_astral.webp"
  },
  {
    "id": "neutral_06_cultista_ofidio",
    "name": "Grão-Ofídio de Sangue Frio",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Monstruosidade • Ofídio",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Sem requisito de Afinidade. Alcance, Toque Letal. Armadura 1. Dispara flechas embebidas em peçonha letal.",
    "flavorText": "Nos templos engolidos pela selva, eles abandonaram a fraqueza humana pelas escamas.",
    "imagePath": "/assets/cards/neutral_06_cultista_ofidio.webp"
  },
  {
    "id": "neutral_07_mutante_caos",
    "name": "Devorador Mutante do Limbo",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Aberração • Caos",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 5,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Sem requisito de Afinidade. Fúria Crescente. Regeneração 2. Criatura entrópica que se adapta a qualquer domínio.",
    "flavorText": "Nascido onde a matéria ferve sem leis nem deuses.",
    "imagePath": "/assets/cards/neutral_07_mutante_caos.webp"
  },
  {
    "id": "neutral_08_colosso_carne",
    "name": "Aberração Voltaica Costurada",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Voltaico",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Sem requisito de Afinidade. Guardião, Fúria Crescente. Armadura 1. Despertado pelo relâmpago.",
    "flavorText": "Costurado a partir de dez campeões caídos, animado por uma única tempestade.",
    "imagePath": "/assets/cards/neutral_08_colosso_carne.webp"
  },
  {
    "id": "neutral_09_baphometis_abismo",
    "name": "Tauron-Khor, Titã Quebra-Tronos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Criatura • Demônio • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 0,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Investida Sísmica causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Sem requisito de Afinidade. Sobrecarga +1. Atropelar, Fúria Crescente. Armadura 2. Ao Entrar: Causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Quando os portões de bronze resistem aos exércitos, eles soltam a besta.",
    "imagePath": "/assets/cards/neutral_09_baphometis_abismo.webp"
  },
  {
    "id": "neutral_10_valkyra_pentacromatica",
    "name": "Valkyra, Imperatriz Pentacromática",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Deidade Dracônica • Lendária",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 0,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Escudo Divino",
      "Fúria Crescente"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Sopro Pentacromático causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela os sobreviventes da Vanguarda inimiga."
      }
    ],
    "description": "Sem requisito de Afinidade. Voo, Atropelar, Escudo Divino, Fúria Crescente. Armadura 2. Sopro 3. Ao Entrar: Causa 3 de dano e Congela a Vanguarda inimiga.",
    "flavorText": "Cinco cabeças, cinco tormentas elementais, uma única soberana sobre todas as escamas.",
    "imagePath": "/assets/cards/neutral_10_valkyra_pentacromatica.webp"
  },
  {
    "id": "neutral_11_botas_aladas",
    "name": "Botas Aladas do Mensageiro",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Equipamento • Vento",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +2 ATQ e +1 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: +2/+1 a um aliado e compra 1 carta. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Costuradas com plumas de águia real e banhadas nas correntes de ar das grandes altitudes.",
    "imagePath": "/assets/cards/neutral_11_botas_aladas.webp"
  },
  {
    "id": "neutral_12_anel_regeneracao",
    "name": "Anel de Sangue Troll",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Anel",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "heal_target_ally",
        "value": 1,
        "description": "Início do Turno: Cura 1 de VIDA de um aliado."
      }
    ],
    "description": "Ao Entrar: Cura 3 no Soberano. Início do Turno: Cura 2 no Soberano e 1 em um aliado.",
    "flavorText": "A esmeralda engastada pulsa como um segundo coração.",
    "imagePath": "/assets/cards/neutral_12_anel_regeneracao.webp"
  },
  {
    "id": "neutral_13_grimorio_astral",
    "name": "Tomo das Estrelas Viajantes",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Grimório",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Lançar Feitiço: Causa 1 de dano ao Soberano inimigo."
      },
      {
        "trigger": "spell_cast",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Ao Lançar Feitiço: Cura 1 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Compra 2 cartas. Ao Lançar Feitiço: Drena 1 de VIDA do Soberano inimigo.",
    "flavorText": "Escrito em uma língua que todas as cinco tormentas compreendem.",
    "imagePath": "/assets/cards/neutral_13_grimorio_astral.webp"
  },
  {
    "id": "neutral_14_armadura_mithral",
    "name": "Cota de Malha de Mithral",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Armadura",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Início do Turno: Concede +1 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Ao Entrar: Escudo Divino aos aliados. Início do Turno: Concede +1/+2 a um aliado.",
    "flavorText": "Leve como seda sob a túnica, impenetrável como escama de dragão.",
    "imagePath": "/assets/cards/neutral_14_armadura_mithral.webp"
  },
  {
    "id": "neutral_15_ampulheta_tempo",
    "name": "Ampulheta das Areias Eternas",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Cronomancia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 2,
        "description": "Ao Entrar: Paralisa no tempo até 2 inimigos na Vanguarda."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1 de Essência neste turno."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta adicional."
      }
    ],
    "description": "Ao Entrar: Congela 2 inimigos e gera +1⚡. Início do Turno: Compra 1 carta adicional.",
    "flavorText": "Quem controla a queda dos grãos decide quem envelhece e quem ataca.",
    "imagePath": "/assets/cards/neutral_15_ampulheta_tempo.webp"
  },
  {
    "id": "neutral_16_lamina_vorpal",
    "name": "Lâmina Decapitadora do Carrasco",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Arma Lendária",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Ao Entrar: Corta um inimigo causando 4 de dano."
      },
      {
        "trigger": "turn_start",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Início do Turno: Desfere um golpe astral causando 2 de dano a um inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 4 de dano a um inimigo. Início do Turno: Causa 2 de dano a um inimigo.",
    "flavorText": "Um, dois! Um, dois! E através e através, a lâmina vorpal cantou.",
    "imagePath": "/assets/cards/neutral_16_lamina_vorpal.webp"
  },
  {
    "id": "neutral_17_pedra_filosofal",
    "name": "Pedra Filosofal do Alquimista",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Alquimia",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Ao Entrar: Gera +2 de Essência imediata."
      },
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA em todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência extra."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: +2⚡ e cura 2 em todos. Início do Turno: Gera +1⚡ e cura 2 no Soberano.",
    "flavorText": "Chumbo em ouro, ferida em vigor, mortal em eterno.",
    "imagePath": "/assets/cards/neutral_17_pedra_filosofal.webp"
  },
  {
    "id": "neutral_18_pocao_furia",
    "name": "Elixir de Fúria Alquímica",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Alquimia",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Feitiço Alquímico: Destila vigor titânico, concedendo +2 ATQ e +2 VIDA a uma criatura aliada por apenas 1⚡.",
    "flavorText": "Sabor de ferrugem e trovão; efeito imediato.",
    "imagePath": "/assets/cards/neutral_18_pocao_furia.webp"
  },
  {
    "id": "neutral_19_pergaminho_protecao",
    "name": "Pergaminho da Égide Universal",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Pergaminho",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Desenrola um selo ancestral que concede Escudo Divino aos aliados, cura 2 no Soberano e compra 1 carta.",
    "flavorText": "Nenhuma escola de magia detém o monopólio da sobrevivência.",
    "imagePath": "/assets/cards/neutral_19_pergaminho_protecao.webp"
  },
  {
    "id": "neutral_20_manto_invisibilidade",
    "name": "Manto Élfico das Sombras",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Evasão",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Confunde e devolve o atacante inimigo para a mão do oponente."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Reação: Oculta o defensor nas dobras do éter, devolvendo o inimigo atacante para a mão rival e comprando 1 carta.",
    "flavorText": "A lâmina inimiga corta apenas o vento e a névoa.",
    "imagePath": "/assets/cards/neutral_20_manto_invisibilidade.webp"
  },
  {
    "id": "red_37_saqueador_gith",
    "name": "Corsário Astral da Lâmina Rubra",
    "domain": "red",
    "type": "creature",
    "subtype": "Astral • Guerreiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Desfere um corte planar que causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Nascidos no mar de estrelas, eles cavalgam dragões vermelhos rumo à conquista.",
    "imagePath": "/assets/cards/red_37_saqueador_gith.webp"
  },
  {
    "id": "red_38_serpente_fogo",
    "name": "Víbora de Brasa Jovem",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Serpente",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Cospe fagulhas causando 1 de dano a um inimigo."
      }
    ],
    "description": "Ímpeto, Pele Incandescente. Ao Entrar: Cospe fagulhas causando 1 de dano a um inimigo.",
    "flavorText": "Onde ela rasteja, a pedra racha e a grama vira fuligem.",
    "imagePath": "/assets/cards/red_38_serpente_fogo.webp"
  },
  {
    "id": "red_39_elemental_magma",
    "name": "Colosso de Magma Fundido",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Ígneo",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Pele Incandescente. Armadura 1. Queima qualquer atacante corpo-a-corpo.",
    "flavorText": "O coração da montanha caminha sobre duas pernas de basalto em brasa.",
    "imagePath": "/assets/cards/red_39_elemental_magma.webp"
  },
  {
    "id": "red_40_forjador_azer",
    "name": "Mestre-Ferreiro das Cinzas",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Artífice",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao Entrar: Forja armas em brasa, concedendo +2 ATQ e +1 VIDA a um aliado."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Concede +2 ATQ e +1 VIDA a um aliado.",
    "flavorText": "Cada martelada na bigorna vulcânica desperta uma centelha de guerra.",
    "imagePath": "/assets/cards/red_40_forjador_azer.webp"
  },
  {
    "id": "red_41_verme_vulcanico",
    "name": "Verme da Caldeira Abissal",
    "domain": "red",
    "type": "creature",
    "subtype": "Monstruosidade • Escavador",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Pele Incandescente"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Leviatã Termal da Cratera",
      "newAtk": 7,
      "newArmor": 2,
      "newMaxHp": 8,
      "addedKeywords": [
        "Atropelar",
        "Pele Incandescente",
        "Fúria Crescente"
      ]
    },
    "effects": [],
    "description": "Atropelar, Pele Incandescente. Ascensão (4): Emerge como Leviatã Termal da Cratera (7/8, ARM 2, Fúria Crescente).",
    "flavorText": "Suas placas dorsais brilham como ferro recém-saído da fornalha.",
    "imagePath": "/assets/cards/red_41_verme_vulcanico.webp"
  },
  {
    "id": "red_42_cavaleiro_draconico",
    "name": "Ginete da Asa Escarlate",
    "domain": "red",
    "type": "creature",
    "subtype": "Dracônico • Cavaleiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Lorde-Dracônico da Lança Solar",
      "newAtk": 7,
      "newArmor": 1,
      "newMaxHp": 7,
      "addedKeywords": [
        "Voo",
        "Ímpeto",
        "Atropelar"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Concede +1⚡ Essência neste turno."
      }
    ],
    "description": "Voo, Ímpeto. Armadura 1. Sopro 1. Ao Entrar: Concede +1⚡ Essência. Ascensão (4): Lorde-Dracônico da Lança Solar.",
    "flavorText": "Apenas aqueles que sobrevivem ao sopro do draco têm o direito de empunhar suas rédeas.",
    "imagePath": "/assets/cards/red_42_cavaleiro_draconico.webp",
    "breathDamage": 1
  },
  {
    "id": "red_43_quimera_vulcanica",
    "name": "Quimera da Garganta de Enxofre",
    "domain": "red",
    "type": "creature",
    "subtype": "Monstruosidade • Dracônica",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Fúria Crescente"
    ],
    "breathDamage": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Queima a fileira inimiga em 2 de dano."
      }
    ],
    "description": "Voo, Fúria Crescente. Armadura 1. Sopro 1. Ao Entrar: Queima a fileira inimiga em 2 de dano.",
    "flavorText": "Três gargantas, três rugidos e uma única sentença de cinzas.",
    "imagePath": "/assets/cards/red_43_quimera_vulcanica.webp"
  },
  {
    "id": "red_44_gigante_forja",
    "name": "Titã Encouraçado da Caldeira",
    "domain": "red",
    "type": "creature",
    "subtype": "Gigante • Forjador",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Esmaga a Vanguarda inimiga causando 2 de dano."
      }
    ],
    "description": "Guardião, Atropelar, Pele Incandescente. Armadura 2. Ao Entrar: Causa 2 de dano à fileira inimiga.",
    "flavorText": "Dois escudos de ferro fundido avançam como as portas do próprio inferno.",
    "imagePath": "/assets/cards/red_44_gigante_forja.webp"
  },
  {
    "id": "red_45_fenix_primordial",
    "name": "Fênix da Coroa Solar",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Lendário",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Último Suspiro: Explode em chamas causando 2 de dano à fileira inimiga."
      }
    ],
    "description": "Voo, Ímpeto, Renascer. Último Suspiro: Causa 2 de dano a todos os inimigos na fileira.",
    "flavorText": "A morte é apenas o estopim do seu próximo alvorecer.",
    "imagePath": "/assets/cards/red_45_fenix_primordial.webp"
  },
  {
    "id": "red_46_tirano_carmesim",
    "name": "Ignarok, o Devorador de Reinos",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Fúria Crescente"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Atacar: Queima o Soberano inimigo em 2 de dano."
      }
    ],
    "description": "Voo, Atropelar, Fúria Crescente. Sopro 3. Ao Atacar: Causa 2 de dano direto ao Soberano inimigo.",
    "flavorText": "Impérios inteiros são medidos apenas pela altura das moedas em seu covil.",
    "imagePath": "/assets/cards/red_46_tirano_carmesim.webp"
  },
  {
    "id": "red_47_arquiduque_ferro",
    "name": "Belphegor, Regente da Cidadela Ardente",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao Entrar: Comanda a legião, concedendo +2 ATQ e +1 VIDA a todos os aliados."
      }
    ],
    "description": "Voo, Ímpeto, Pele Incandescente. Armadura 2. Ao Entrar: Concede +2/+1 a todos os seus aliados.",
    "flavorText": "Nas muralhas de bronze do primeiro círculo, sua espada dita a lei da guerra eterna.",
    "imagePath": "/assets/cards/red_47_arquiduque_ferro.webp"
  },
  {
    "id": "red_48_erupcao_piroclastica",
    "name": "Erupção de Escória",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Piromancia",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: Gêiseres de lava causam 2 de dano a toda a fileira inimiga e 2 de dano ao Soberano rival.",
    "flavorText": "O solo ferve antes de engolir os imprudentes.",
    "imagePath": "/assets/cards/red_48_erupcao_piroclastica.webp"
  },
  {
    "id": "red_49_marca_imolacao",
    "name": "Marca da Imolação",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Piromancia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 5,
        "description": "Causa 5 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: Crava um sigilo incandescente que causa 5 de dano a um inimigo e 2 ao Soberano rival.",
    "flavorText": "Quando a runa se fecha, até a sombra da vítima arde.",
    "imagePath": "/assets/cards/red_49_marca_imolacao.webp"
  },
  {
    "id": "red_50_forjar_no_sangue",
    "name": "Têmpera em Sangue Dracônico",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Guerra",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2 ATQ e +1 VIDA a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Banha as armas aliadas em fogo dracônico, concedendo +2/+1 a todos os aliados e comprando 1 carta.",
    "flavorText": "O aço temperado em sangue de dragão jamais perde o fio.",
    "imagePath": "/assets/cards/red_50_forjar_no_sangue.webp"
  },
  {
    "id": "red_51_cataclismo_draconico",
    "name": "Hora da Devastação Rubra",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 4 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 4,
        "description": "Causa 4 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: Um turbilhão de chamas dracônicas varre a fileira inimiga causando 4 de dano e 4 de dano ao Soberano rival.",
    "flavorText": "Não restaram muralhas, nem estandartes, nem nomes para lembrar.",
    "imagePath": "/assets/cards/red_51_cataclismo_draconico.webp"
  },
  {
    "id": "red_52_escama_incandescente",
    "name": "Escudo de Escama Fumegante",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Combate",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano ao atacante."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Protege seus aliados com aura ígnea."
      }
    ],
    "description": "Reação: Ergue uma barreira de escamas em brasa que causa 4 de dano ao atacante e concede Escudo Divino aos aliados.",
    "flavorText": "Tocar a couraça do dragão é abraçar a pira.",
    "imagePath": "/assets/cards/red_52_escama_incandescente.webp"
  },
  {
    "id": "red_53_explosao_vingativa",
    "name": "Detonação de Retaliação",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano ao invasor."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Reação: Explode contra o agressor causando 4 de dano a ele, 2 à fileira inimiga e 2 ao Soberano rival.",
    "flavorText": "Se cairmos, levaremos toda a vanguarda deles conosco.",
    "imagePath": "/assets/cards/red_53_explosao_vingativa.webp"
  },
  {
    "id": "red_54_coroa_chama_eterna",
    "name": "Coroa do Sol Incandescente",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Regalia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Varre a fileira inimiga com 2 de dano."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Início do Turno: Queima o Soberano inimigo em 2 de dano."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano à fileira inimiga. Início do Turno: Causa 2 de dano ao Soberano rival e dá +1/+1 a um aliado.",
    "flavorText": "Apenas uma fronte digna suporta o peso do ouro em fusão.",
    "imagePath": "/assets/cards/red_54_coroa_chama_eterna.webp"
  },
  {
    "id": "blue_37_mago_aprendiz",
    "name": "Iniciado da Torre Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humano • Arcanista",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Arquimago do Zênite Rúnico",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Voo",
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "spell_cast",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Lançar Feitiço: Dispara um míssil arcano causando 1 de dano a um inimigo."
      }
    ],
    "description": "Alcance. Ao Lançar Feitiço: Causa 1 de dano a um inimigo. Ascensão (4): Eleva-se a Arquimago do Zênite Rúnico (5/6, ARM 1, Voo, Escudo Divino).",
    "flavorText": "Cada página dominada aproxima o mortal das estrelas.",
    "imagePath": "/assets/cards/blue_37_mago_aprendiz.webp"
  },
  {
    "id": "blue_38_manta_eterea",
    "name": "Arraia das Correntes Etéreas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Fera • Vendaval",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo. Ao Entrar: Traz presságios dos ventos superiores, comprando 1 carta.",
    "flavorText": "Desliza entre as nuvens de tempestade como se o céu fosse um oceano.",
    "imagePath": "/assets/cards/blue_38_manta_eterea.webp"
  },
  {
    "id": "blue_39_elemental_gelo",
    "name": "Colosso da Geleira Eterna",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Glacial",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela um inimigo."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Congela uma unidade inimiga.",
    "flavorText": "O inverno não recua; ele apenas avança em silêncio cristalino.",
    "imagePath": "/assets/cards/blue_39_elemental_gelo.webp"
  },
  {
    "id": "blue_40_naga_guardia",
    "name": "Naga Oráculo das Marés",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Oráculo",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Soberana Naga do Dilúvio",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 7,
      "addedKeywords": [
        "Alcance",
        "Escudo Divino",
        "Renascer"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela um inimigo."
      }
    ],
    "description": "Alcance. Armadura 1. Ao Entrar: Congela um inimigo. Ascensão (4): Desperta como Soberana Naga do Dilúvio (6/7, ARM 1, Escudo Divino, Renascer).",
    "flavorText": "Seus olhos leem o curso dos rios e o destino dos reis.",
    "imagePath": "/assets/cards/blue_40_naga_guardia.webp"
  },
  {
    "id": "blue_41_golem_cristal",
    "name": "Autômato de Quartzo Rúnico",
    "domain": "blue",
    "type": "creature",
    "subtype": "Constructo • Rúnico",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "spell_cast",
        "type": "heal_all_allies",
        "value": 1,
        "description": "Ao Lançar Feitiço: Restaura +1 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Projeta um Elemental de Geada (1/2)."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Invoca um Elemental de Geada (1/2). Ao Lançar Feitiço: Cura +1 em todos os aliados.",
    "flavorText": "Seu núcleo refrata feitiços em prismas de pura proteção.",
    "imagePath": "/assets/cards/blue_41_golem_cristal.webp"
  },
  {
    "id": "blue_42_serpente_marinha",
    "name": "Leviatã da Fossa Boreal",
    "domain": "blue",
    "type": "creature",
    "subtype": "Titã • Marinho",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 6,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "breathDamage": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela um inimigo com jato glacial."
      }
    ],
    "description": "Atropelar. Sopro 1. Ao Entrar: Congela um inimigo.",
    "flavorText": "Quando ela emerge, os navios viram brinquedos de madeira no gelo.",
    "imagePath": "/assets/cards/blue_42_serpente_marinha.webp"
  },
  {
    "id": "blue_43_arconte_tempestade",
    "name": "Arconte do Relâmpago Vivo",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Tempestade",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Eletrocuta a fileira inimiga em 2 de dano."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Lançar Feitiço: Descarrega um raio causando 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Voo, Alcance. Armadura 1. Ao Entrar: Causa 2 de dano à fileira inimiga. Ao Lançar Feitiço: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Ele não conjura o trovão; ele é o próprio trovão.",
    "imagePath": "/assets/cards/blue_43_arconte_tempestade.webp"
  },
  {
    "id": "blue_44_dragao_prateado",
    "name": "Aureon, Dragão da Geada Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo, Escudo Divino. Armadura 2. Sopro 2. Ao Entrar: Congela toda a Vanguarda inimiga e compra 1 carta.",
    "flavorText": "Acima das tempestades mortais, ele guarda a biblioteca das constelações.",
    "imagePath": "/assets/cards/blue_44_dragao_prateado.webp"
  },
  {
    "id": "blue_45_oraculo_abissal",
    "name": "Nereus, Soberano das Sete Marés",
    "domain": "blue",
    "type": "creature",
    "subtype": "Titã • Oráculo",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Ao Entrar: Devolve um inimigo para a mão do oponente."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta adicional."
      }
    ],
    "description": "Alcance, Escudo Divino. Armadura 1. Ao Entrar: Devolve um inimigo à mão rival. Início do Turno: Compra 1 carta extra.",
    "flavorText": "Antes que os continentes se erguessem, ele já havia previsto a queda dos deuses.",
    "imagePath": "/assets/cards/blue_45_oraculo_abissal.webp"
  },
  {
    "id": "blue_46_prisao_glacial",
    "name": "Esfera de Estase Glacial",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Criomancia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano ao inimigo."
      }
    ],
    "description": "Feitiço: Encarcera um inimigo em gelo rúnico, congelando-o e causando 2 de dano.",
    "flavorText": "O tempo congela onde a runa de safira toca.",
    "imagePath": "/assets/cards/blue_46_prisao_glacial.webp"
  },
  {
    "id": "blue_47_singularidade_arcana",
    "name": "Convergência de Raios",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Tempestade",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Um arco voltaico causa 3 de dano a um inimigo e compra 1 carta.",
    "flavorText": "A energia não se perde; ela realimenta o conjurador.",
    "imagePath": "/assets/cards/blue_47_singularidade_arcana.webp"
  },
  {
    "id": "blue_48_inverter_gravidade",
    "name": "Reversão Gravitacional",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Transmutação",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve 1 unidade inimiga para a mão do oponente."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela (imobiliza por 1 turno) 1 unidade inimiga."
      }
    ],
    "description": "Devolve 1 unidade inimiga para a mão do oponente. Congela (imobiliza por 1 turno) 1 unidade inimiga.",
    "flavorText": "De que vale uma armadura pesada quando o chão deixa de existir?",
    "imagePath": "/assets/cards/blue_48_inverter_gravidade.webp"
  },
  {
    "id": "blue_49_mente_onisciente",
    "name": "Epifania do Astral Profundo",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Divinação",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência neste turno."
      }
    ],
    "description": "Feitiço: Abre o terceiro olho cósmico, comprando 2 cartas e gerando +1⚡ de Essência imediata.",
    "flavorText": "Compreender o infinito leva apenas um instante de clareza.",
    "imagePath": "/assets/cards/blue_49_mente_onisciente.webp"
  },
  {
    "id": "blue_50_diluvio_primordial",
    "name": "Maremoto de Zero Absoluto",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Uma muralha de água glacial causa 3 de dano à fileira inimiga, congela a Vanguarda rival e compra 1 carta.",
    "flavorText": "O oceano reclama tudo o que a terra ousou erguer.",
    "imagePath": "/assets/cards/blue_50_diluvio_primordial.webp"
  },
  {
    "id": "blue_51_dissipar_magia",
    "name": "Contramágica Rúnica",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela o atacante inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Reduz em -2 o ATQ da Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Reação: Anula o ímpeto inimigo congelando o agressor, reduzindo o ATQ da Vanguarda rival em -2 e comprando 1 carta.",
    "flavorText": "Sua palavra de poder foi desfeita antes de tocar o ar.",
    "imagePath": "/assets/cards/blue_51_dissipar_magia.webp"
  },
  {
    "id": "blue_52_passo_bruma",
    "name": "Translocação na Neblina",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Hidromancia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve o atacante inimigo para a mão do oponente."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      }
    ],
    "description": "Reação: Dissolve a formação em névoa prateada, devolvendo o atacante para a mão rival e protegendo aliados com Escudo Divino.",
    "flavorText": "Golpear a bruma é lutar contra o próprio reflexo.",
    "imagePath": "/assets/cards/blue_52_passo_bruma.webp"
  },
  {
    "id": "blue_53_orbe_tempestades",
    "name": "Orbe do Furacão Perpétuo",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Tempestade",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano à fileira inimiga."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Lançar Feitiço: Dispara um raio causando 1 de dano a um inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano à fileira inimiga. Ao Lançar Feitiço: Causa 1 de dano a um inimigo.",
    "flavorText": "Dentro do cristal repousa a fúria contida de mil ciclones.",
    "imagePath": "/assets/cards/blue_53_orbe_tempestades.webp"
  },
  {
    "id": "blue_54_planetario_arcano",
    "name": "Planetário das Esferas Celestes",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Rúnica",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência extra."
      },
      {
        "trigger": "spell_cast",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Ao Lançar Feitiço: Restaura 1 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Início do Turno: Gera +1⚡ de Essência. Ao Lançar Feitiço: Cura 1 no Soberano.",
    "flavorText": "Quando os anéis celestes se alinham no observatório, o firmamento inteiro despeja poder.",
    "imagePath": "/assets/cards/blue_54_planetario_arcano.webp"
  },
  {
    "id": "purple_37_acolito_oculto",
    "name": "Acólito do Sol Negro",
    "domain": "purple",
    "type": "creature",
    "subtype": "Humano • Ocultista",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Dreno de Vida"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Arauto Ascendido do Vazio",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Dreno de Vida",
        "Voo",
        "Toque Letal"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Entrar: Drena 1 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Ao Entrar: Cura 1 de VIDA do seu Soberano."
      }
    ],
    "description": "Dreno de Vida. Ao Entrar: Drena 1 de VIDA do Soberano rival para o seu. Ascensão (4): Arauto Ascendido do Vazio (6/6, ARM 1, Voo, Toque Letal).",
    "flavorText": "Ele entregou seu nome ao abismo em troca de uma única palavra de poder.",
    "imagePath": "/assets/cards/purple_37_acolito_oculto.webp"
  },
  {
    "id": "purple_38_espectro_faminto",
    "name": "Devorador de Almas Errante",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Espectro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Dreno de Vida. Atravessa defesas terrestres drenando o calor vital.",
    "flavorText": "Sua fome só cessa quando o último batimento cardíaco silencia.",
    "imagePath": "/assets/cards/purple_38_espectro_faminto.webp"
  },
  {
    "id": "purple_39_aranha_abissal",
    "name": "Tecelã de Teias Umbrosas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Aberração • Aracnídeo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [],
    "description": "Toque Letal. Qualquer ferimento causado por suas presas destrói a criatura inimiga.",
    "flavorText": "Suas teias são fiadas com pesadelos e veneno estígio.",
    "imagePath": "/assets/cards/purple_39_aranha_abissal.webp"
  },
  {
    "id": "purple_40_carnical_real",
    "name": "Lorde Carniçal das Catacumbas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Carniçal",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Renascer",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Renascer, Dreno de Vida. Armadura 1. Retorna com 1 de VIDA na primeira vez que é destruído.",
    "flavorText": "Mesmo na morte, ele ainda usa a coroa enferrujada de seu antigo banquete.",
    "imagePath": "/assets/cards/purple_40_carnical_real.webp"
  },
  {
    "id": "purple_41_aberracao_olhos",
    "name": "Sentinela do Prisma Umbral",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Constructo • Monólito Arcano",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Ao Entrar: Seu raio hipnótico reduz em -2 o ATQ da Vanguarda inimiga."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Reduz em -2 o ATQ da Vanguarda inimiga.",
    "flavorText": "De cada face do octaedro negro parte um feixe frio que drena a força da vanguarda.",
    "imagePath": "/assets/cards/purple_41_aberracao_olhos.webp"
  },
  {
    "id": "purple_42_pesadelo_infernal",
    "name": "Corcel Pesadelo de Ébano",
    "domain": "purple",
    "type": "creature",
    "subtype": "Corruptor • Corcel",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Voo"
    ],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto, Voo. Sobrecarga +1. Ao Entrar: Causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Seus cascos galopam sobre as almas dos traidores.",
    "imagePath": "/assets/cards/purple_42_pesadelo_infernal.webp"
  },
  {
    "id": "purple_43_assassino_sombra",
    "name": "Lâmina Silenciosa de Umbra",
    "domain": "purple",
    "type": "creature",
    "subtype": "Humano • Assassino",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Ímpeto"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Grão-Mestre do Eclipse Letal",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Toque Letal",
        "Ímpeto",
        "Dreno de Vida",
        "Renascer"
      ]
    },
    "effects": [],
    "description": "Toque Letal, Ímpeto. Ascensão (3): Torna-se Grão-Mestre do Eclipse Letal (6/6, ARM 1, Dreno de Vida, Renascer).",
    "flavorText": "A sombra nunca erra o coração porque ela já habita dentro dele.",
    "imagePath": "/assets/cards/purple_43_assassino_sombra.webp"
  },
  {
    "id": "purple_44_devorador_intelecto",
    "name": "Espectro Usurpador de Sombras",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Morto-Vivo • Espectro Astral",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Dreno de Vida"
    ],
    "corruptionCost": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "steal_small_enemy",
        "value": 3,
        "description": "Ao Entrar: Domina uma criatura inimiga com ATQ <= 3 (ou causa 3 de dano se não houver espaço)."
      }
    ],
    "description": "Alcance, Dreno de Vida. Sobrecarga +2. Ao Entrar: Toma o controle de um inimigo com ATQ <= 3.",
    "flavorText": "Quando suas correntes espectrais tocam o elmo do guerreiro, a espada muda de mestre.",
    "imagePath": "/assets/cards/purple_44_devorador_intelecto.webp"
  },
  {
    "id": "purple_45_dragao_sombras",
    "name": "Nyxarion, o Dragão do Eclipse",
    "domain": "purple",
    "type": "creature",
    "subtype": "Dragão • Sombrio",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "breathDamage": 2,
    "effects": [],
    "description": "Voo, Dreno de Vida. Armadura 1. Sopro 2: Varre a fileira inimiga com chamas umbrosas.",
    "flavorText": "Quando suas asas se abrem, o meio-dia transforma-se em meia-noite eterna.",
    "imagePath": "/assets/cards/purple_45_dragao_sombras.webp"
  },
  {
    "id": "purple_46_noiva_vampira",
    "name": "Carmilla, Condessa de Sangue e Ouro",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Nobre",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao Entrar: Drena 3 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA no seu Soberano."
      }
    ],
    "description": "Voo, Dreno de Vida, Renascer. Armadura 1. Ao Entrar: Drena 3 de VIDA do Soberano inimigo para o seu Soberano.",
    "flavorText": "No salão de espelhos partidos, o vinho servido nos cálices dourados ainda pulsa.",
    "imagePath": "/assets/cards/purple_46_noiva_vampira.webp"
  },
  {
    "id": "purple_47_avatar_escuridao",
    "name": "Nocturnus, Avatar da Noite Sem Fim",
    "domain": "purple",
    "type": "creature",
    "subtype": "Demônio • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Toque Letal",
      "Dreno de Vida"
    ],
    "corruptionCost": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima a criatura mais forte da sua Cripta."
      }
    ],
    "description": "Atropelar, Toque Letal, Dreno de Vida. Armadura 1. Sobrecarga +2. Ao Entrar: Reanima um campeão da sua Cripta.",
    "flavorText": "Quando a última estrela se apagar, apenas sua gargalhada restará no vazio.",
    "imagePath": "/assets/cards/purple_47_avatar_escuridao.webp"
  },
  {
    "id": "purple_48_toque_apodrecimento",
    "name": "Toque da Decomposição",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Murcha a carne do alvo causando 3 de dano a um inimigo e curando 2 de VIDA no seu Soberano.",
    "flavorText": "A vida roubada de um soldado prolonga o reinado do necromante.",
    "imagePath": "/assets/cards/purple_48_toque_apodrecimento.webp"
  },
  {
    "id": "purple_49_banquete_almas",
    "name": "Banquete de Sangue Carmesim",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Sombra",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano ao Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço (Sobrecarga +1): Drena 3 de VIDA do Soberano inimigo para o seu Soberano e compra 1 carta.",
    "flavorText": "O banquete nunca termina enquanto houver pulsos batendo no campo.",
    "imagePath": "/assets/cards/purple_49_banquete_almas.webp"
  },
  {
    "id": "purple_50_pacto_proibido",
    "name": "Contrato das Sete Correntes",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Maldição",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Gera +2 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      }
    ],
    "description": "Feitiço (Sobrecarga +2): Assina um pergaminho abissal, gerando +2⚡ de Essência imediata e comprando 2 cartas.",
    "flavorText": "A cláusula final cobra juros na moeda da própria eternidade.",
    "imagePath": "/assets/cards/purple_50_pacto_proibido.webp"
  },
  {
    "id": "purple_51_eclipse_eterno",
    "name": "Convergência do Sol Negro",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Reanima uma criatura da sua Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço (Sobrecarga +1): Um eclipse total causa 3 de dano à fileira inimiga, reanima um aliado da Cripta e cura 3 no seu Soberano.",
    "flavorText": "Sob a coroa negra do eclipse, os mortos marcham como reis.",
    "imagePath": "/assets/cards/purple_51_eclipse_eterno.webp"
  },
  {
    "id": "purple_52_mortalha_espectral",
    "name": "Sentença da Forca Sombria",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Maldição",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano ao atacante."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Reação: Correntes espectrais estrangulam o agressor causando 4 de dano e drenando 3 de VIDA para o seu Soberano.",
    "flavorText": "O cadafalso invisível aguarda o primeiro passo em falso.",
    "imagePath": "/assets/cards/purple_52_mortalha_espectral.webp"
  },
  {
    "id": "purple_53_lanterna_almas",
    "name": "Lanterna das Almas Penadas",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Necromancia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Drena 2 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Início do Turno: Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano ao Soberano rival. Início do Turno: Drena 1 do Soberano rival e cura 2 no seu.",
    "flavorText": "A chama azulada nunca se apaga porque queima memórias em vez de óleo.",
    "imagePath": "/assets/cards/purple_53_lanterna_almas.webp"
  },
  {
    "id": "purple_54_altar_sacrificio",
    "name": "Obelisco do Sangue Eterno",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Sanguínea",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_end",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Fim do Turno: Concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Invoca um Espectro de Sangue (2/2)."
      }
    ],
    "description": "Ao Entrar: Invoca um servo (2/2). Fim do Turno: Fortalece todos os aliados em +1/+1.",
    "flavorText": "Esculpido em obsidiana estígia, o obelisco pulsa como um coração vivo.",
    "imagePath": "/assets/cards/purple_54_altar_sacrificio.webp"
  },
  {
    "id": "green_37_lobo_atroz",
    "name": "Lobo Atroz da Espinha Gelada",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Matilha",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Fenrir, Patriarca da Alcateia",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Ímpeto",
        "Atropelar",
        "Fúria Crescente"
      ]
    },
    "effects": [],
    "description": "Ímpeto. Ascensão (3): Desperta como Fenrir, Patriarca da Alcateia (6/6, ARM 1, Atropelar, Fúria Crescente).",
    "flavorText": "Seu uivo reúne todas as presas da floresta sob um mesmo estandarte.",
    "imagePath": "/assets/cards/green_37_lobo_atroz.webp"
  },
  {
    "id": "green_38_driade_espinhos",
    "name": "Dríade Tecelã de Roseiras",
    "domain": "green",
    "type": "creature",
    "subtype": "Fada • Guardião",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "regeneration": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_target_ally",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA em um aliado."
      }
    ],
    "description": "Alcance. Regeneração 1. Ao Entrar: Cura 2 de VIDA em um aliado.",
    "flavorText": "A floresta cura seus filhos e sufoca seus invasores com a mesma raiz.",
    "imagePath": "/assets/cards/green_38_driade_espinhos.webp"
  },
  {
    "id": "green_39_javali_guerra",
    "name": "Javali Presa-de-Ferro",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Bruto",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Ímpeto, Atropelar. Abre caminho pela linha de frente inimiga sem diminuir o passo.",
    "flavorText": "Nem lanças nem paliçadas detêm três toneladas de fúria blindada.",
    "imagePath": "/assets/cards/green_39_javali_guerra.webp"
  },
  {
    "id": "green_40_licantropo_alfa",
    "name": "Rastreador Sangue-de-Lobo",
    "domain": "green",
    "type": "creature",
    "subtype": "Metamorfo • Licantropo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Fúria Crescente"
    ],
    "regeneration": 1,
    "ascension": {
      "cost": 4,
      "newName": "Senhor da Lua de Sangue",
      "newAtk": 7,
      "newArmor": 1,
      "newMaxHp": 8,
      "addedKeywords": [
        "Fúria Crescente",
        "Ímpeto",
        "Atropelar"
      ]
    },
    "effects": [],
    "description": "Ímpeto, Fúria Crescente. Armadura 1. Regeneração 1. Ascensão (4): Senhor da Lua de Sangue (7/8, ARM 1, Atropelar).",
    "flavorText": "Quando a lua cheia rompe a copa das árvores, o caçador e a fera tornam-se um só.",
    "imagePath": "/assets/cards/green_40_licantropo_alfa.webp"
  },
  {
    "id": "green_41_sapo_colossal",
    "name": "Batrácio Engolidor do Pântano",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Anfíbio",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Guardião, Toque Letal. Armadura 1. Sua língua peçonhenta abate qualquer atacante.",
    "flavorText": "Cavaleiros inteiros desaparecem no charco com um único estalo.",
    "imagePath": "/assets/cards/green_41_sapo_colossal.webp"
  },
  {
    "id": "green_42_ettin_selvagem",
    "name": "Gigante Bicéfalo das Colinas",
    "domain": "green",
    "type": "creature",
    "subtype": "Gigante • Bruto",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 5,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Atropelar, Fúria Crescente. Duas cabeças furiosas que golpeiam com o dobro de brutalidade.",
    "flavorText": "Eles discutem sobre tudo, exceto sobre quem vai esmagar o próximo soldado.",
    "imagePath": "/assets/cards/green_42_ettin_selvagem.webp"
  },
  {
    "id": "green_43_basilisco_pedra",
    "name": "Basilisco de Escama Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Réptil • Petrificador",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Petrifica (Congela) um inimigo."
      }
    ],
    "description": "Toque Letal. Armadura 1. Ao Entrar: Seu olhar petrificante Congela um inimigo.",
    "flavorText": "O jardim ao redor de sua toca é repleto de estátuas perfeitas.",
    "imagePath": "/assets/cards/green_43_basilisco_pedra.webp"
  },
  {
    "id": "green_44_centauro_chefe",
    "name": "Khan Centauro da Estepe Verde",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Comandante",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a todos os aliados."
      }
    ],
    "description": "Ímpeto, Atropelar. Ao Entrar: Galopa à frente da horda, concedendo +1/+1 a todos os aliados.",
    "flavorText": "O trovão que você ouve não vem das nuvens, mas de mil cascos na campina.",
    "imagePath": "/assets/cards/green_44_centauro_chefe.webp"
  },
  {
    "id": "green_45_verme_roxo",
    "name": "Titã Escavador das Raízes",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Titã • Profundezas",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 7,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Provoca um terremoto causando 2 de dano à fileira inimiga."
      }
    ],
    "description": "Atropelar. Armadura 1. Ao Entrar: Emerge do subsolo causando 2 de dano à fileira inimiga.",
    "flavorText": "Ele engole vagões de minério e cospe montanhas.",
    "imagePath": "/assets/cards/green_45_verme_roxo.webp"
  },
  {
    "id": "green_46_ent_anciao",
    "name": "Carvalho-Mestre de Mil Invernos",
    "domain": "green",
    "type": "creature",
    "subtype": "Planta • Colosso",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Fortalece os aliados com +1/+1."
      }
    ],
    "description": "Guardião, Alcance. Armadura 2. Regeneração 2. Ao Entrar: Cura 3 de VIDA e concede +1/+1 a todos os seus aliados.",
    "flavorText": "Suas raízes bebem do rio primordial; seus galhos sustentam o céu.",
    "imagePath": "/assets/cards/green_46_ent_anciao.webp"
  },
  {
    "id": "green_47_roc_tempestade",
    "name": "Ave Roc das Cumeadas",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Alada",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Atropelar"
    ],
    "effects": [],
    "description": "Voo, Atropelar. Mergulha dos picos selvagens com garras capazes de erguer elefantes.",
    "flavorText": "Sua sombra cobre um vale inteiro antes do impacto.",
    "imagePath": "/assets/cards/green_47_roc_tempestade.webp"
  },
  {
    "id": "green_48_rainha_formiga",
    "name": "Matriarca da Colmeia de Âmbar",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Insetoide",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "turn_end",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Fim do Turno: Nutre o enxame curando 2 de VIDA nos aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Invoca um Soldado Quitinoso (2/2)."
      }
    ],
    "description": "Guardião. Armadura 1, Regeneração 2. Ao Entrar: Invoca uma cria (2/2). Fim do Turno: Cura 2 de VIDA em todos os aliados.",
    "flavorText": "Enquanto a Matriarca respirar, o formigueiro jamais ficará sem soldados.",
    "imagePath": "/assets/cards/green_48_rainha_formiga.webp",
    "regeneration": 2
  },
  {
    "id": "green_49_dragao_esmeralda",
    "name": "Smaragda, Soberana da Selva Fechada",
    "domain": "green",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Toque Letal"
    ],
    "regeneration": 2,
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Sopro de esmeralda causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Toque Letal. Armadura 1. Regeneração 2. Sopro 2. Ao Entrar: Causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Cada árvore da floresta é uma espiã a serviço de sua coroa de espinhos.",
    "imagePath": "/assets/cards/green_49_dragao_esmeralda.webp"
  },
  {
    "id": "green_50_avatar_gaia",
    "name": "Sylvanor, o Coração do Mundo",
    "domain": "green",
    "type": "creature",
    "subtype": "Titã • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2 ATQ e +2 VIDA a todos os aliados."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 2. Regeneração 2. Ao Entrar: Desperta a selva concedendo +2/+2 a todos os seus aliados.",
    "flavorText": "Quando os continentes despertam, as cidades dos homens viram pó sob a relva.",
    "imagePath": "/assets/cards/green_50_avatar_gaia.webp"
  },
  {
    "id": "green_51_crescimento_gigante",
    "name": "Vigor Titânico da Selva",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Silvestre",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2 ATQ e +2 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 1,
        "secondaryValue": 1,
        "description": "Invoca uma Cria da Selva (1/1)."
      }
    ],
    "description": "Feitiço: Infunde seiva primordial em um aliado (+2/+2), invoca uma Cria da Selva (1/1) e cura 2 no seu Soberano.",
    "flavorText": "A força de cem carvalhos corre pelas veias do escolhido.",
    "imagePath": "/assets/cards/green_51_crescimento_gigante.webp"
  },
  {
    "id": "green_52_estouro_manada",
    "name": "Marcha dos Colossos",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Caçada",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2 ATQ e +2 VIDA a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: O rugido da floresta concede +2 ATQ e +2 VIDA a todos os seus aliados e compra 1 carta.",
    "flavorText": "Quando a manada corre unida, nenhuma muralha permanece de pé.",
    "imagePath": "/assets/cards/green_52_estouro_manada.webp"
  },
  {
    "id": "green_53_carapaca_espinhosa",
    "name": "Rebote de Espinhos Vivos",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1 ATQ e +2 VIDA aos aliados."
      }
    ],
    "description": "Reação: Espinhos de ferro-madeira perfuram o agressor em 3 de dano e fortalecem seus aliados em +1/+2.",
    "flavorText": "A casca da árvore antiga devolve cada golpe em dobro.",
    "imagePath": "/assets/cards/green_53_carapaca_espinhosa.webp"
  },
  {
    "id": "green_54_totem_ancestral",
    "name": "Monólito da Presa Primordial",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Totem",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Invoca um Espírito Lupino (2/2)."
      }
    ],
    "description": "Ao Entrar: Invoca um Lobo Espiritual (2/2). Início do Turno: Cura 2 de VIDA em todos os aliados.",
    "flavorText": "Entalhado no tronco da primeira árvore, ele chama os espíritos da mata.",
    "imagePath": "/assets/cards/green_54_totem_ancestral.webp"
  },
  {
    "id": "gold_37_escudeiro_solar",
    "name": "Escudeiro da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humano • Paladino",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Grão-Paladino da Luz Invicta",
      "newAtk": 5,
      "newArmor": 2,
      "newMaxHp": 7,
      "addedKeywords": [
        "Guardião",
        "Escudo Divino",
        "Voo"
      ]
    },
    "effects": [],
    "description": "Guardião, Escudo Divino. Armadura 1. Ascensão (4): Sagra-se Grão-Paladino da Luz Invicta (5/7, ARM 2, Escudo Divino, Voo).",
    "flavorText": "O escudo que hoje pesa no braço amanhã refletirá o próprio sol.",
    "imagePath": "/assets/cards/gold_37_escudeiro_solar.webp"
  },
  {
    "id": "gold_38_grifo_imperial",
    "name": "Grifo da Guarda Real",
    "domain": "gold",
    "type": "creature",
    "subtype": "Monstruosidade • Alada",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Patrulha os céus da cidadela com velocidade fulminante.",
    "flavorText": "Mais leal que o aço, mais veloz que a flecha.",
    "imagePath": "/assets/cards/gold_38_grifo_imperial.webp"
  },
  {
    "id": "gold_39_inquisidor_justica",
    "name": "Justicar do Martelo Radiante",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humano • Juiz",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Escudo Divino. Armadura 1. Ao Entrar: Cura 2 de VIDA do seu Soberano.",
    "flavorText": "A lei da luz não conhece suborno nem recuo.",
    "imagePath": "/assets/cards/gold_39_inquisidor_justica.webp"
  },
  {
    "id": "gold_40_pegaso_celeste",
    "name": "Corcel Alado do Empíreo",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celeste • Corcel",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Voo, Escudo Divino. Cruza os céus envolto em uma redoma de luz pura.",
    "flavorText": "Onde suas asas batem, a escuridão se dissipa como névoa ao meio-dia.",
    "imagePath": "/assets/cards/gold_40_pegaso_celeste.webp"
  },
  {
    "id": "gold_41_forjador_runico",
    "name": "Artífice da Bigorna Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Anão • Artífice",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Paragão do Colosso de Ouro",
      "newAtk": 6,
      "newArmor": 3,
      "newMaxHp": 7,
      "addedKeywords": [
        "Guardião",
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Reforça um aliado com +1 ATQ e +2 VIDA."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Concede +1/+2 a um aliado. Ascensão (4): Veste a armadura suprema como Paragão do Colosso de Ouro (6/7, ARM 3, Escudo Divino).",
    "flavorText": "Runas gravadas em mithral puro duram mais que as próprias montanhas.",
    "imagePath": "/assets/cards/gold_41_forjador_runico.webp"
  },
  {
    "id": "gold_42_leao_dourado",
    "name": "Leão Celestial de Heliópolis",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celeste • Fera",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Armadura 1. Sua juba de ouro maciço desvia lâminas enquanto avança.",
    "flavorText": "Seu rugido ressoa como os sinos de bronze da catedral solar.",
    "imagePath": "/assets/cards/gold_42_leao_dourado.webp"
  },
  {
    "id": "gold_43_sentinela_relogio",
    "name": "Sentinela da Engrenagem Real",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Couraçado",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Guardião, Escudo Divino. Armadura 1. Ao Entrar: Concede +1/+2 a um aliado.",
    "flavorText": "Projetado para nunca dormir, nunca hesitar e nunca ceder um centímetro.",
    "imagePath": "/assets/cards/gold_43_sentinela_relogio.webp"
  },
  {
    "id": "gold_44_valquiria_guerra",
    "name": "Valquíria da Lança da Aurora",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celeste • Guerreiro",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Voo, Escudo Divino. Armadura 1. Ao Entrar: Abençoa um campeão aliado com +2 ATQ e +2 VIDA.",
    "flavorText": "Ela escolhe não quem morre, mas quem prevalece na tempestade de espadas.",
    "imagePath": "/assets/cards/gold_44_valquiria_guerra.webp"
  },
  {
    "id": "gold_45_gigante_tempestade",
    "name": "Titã da Cidadela do Zênite",
    "domain": "gold",
    "type": "creature",
    "subtype": "Gigante • Celestial",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Julga a fileira inimiga com 2 de dano."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 2. Ao Entrar: Desfere um golpe sísmico que causa 2 de dano à fileira inimiga.",
    "flavorText": "Seus passos ecoam como o veredito final dos céus.",
    "imagePath": "/assets/cards/gold_45_gigante_tempestade.webp"
  },
  {
    "id": "gold_46_arcanjo_supremo",
    "name": "Caelestius, o Serafim de Seis Asas",
    "domain": "gold",
    "type": "creature",
    "subtype": "Titã • Celestial",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Voo, Escudo Divino, Alcance. Armadura 2. Ao Entrar: Cura 3 de VIDA em todos os aliados e 4 no seu Soberano.",
    "flavorText": "Seis asas de ouro ardente anunciam que a noite chegou ao fim.",
    "imagePath": "/assets/cards/gold_46_arcanjo_supremo.webp"
  },
  {
    "id": "gold_47_dragao_solar",
    "name": "Heliodor, Dragão do Sol Nascente",
    "domain": "gold",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1 ATQ e +2 VIDA a todos os aliados."
      }
    ],
    "description": "Voo, Escudo Divino. Armadura 2. Sopro 2. Ao Entrar: Inspira a falange concedendo +1 ATQ e +2 VIDA a todos os aliados.",
    "flavorText": "Suas escamas refletem a primeira aurora da criação.",
    "imagePath": "/assets/cards/gold_47_dragao_solar.webp"
  },
  {
    "id": "gold_48_decreto_imperial",
    "name": "Édito da Falange Dourada",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Honra",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 3,
        "description": "Invoca um Guarda Real (2/3)."
      }
    ],
    "description": "Feitiço: Invoca uma Sentinela de Ferro (2/3), concede +1/+1 a todos os aliados e compra 1 carta.",
    "flavorText": "Ao som das trombetas de ouro, nenhum soldado marcha sozinho.",
    "imagePath": "/assets/cards/gold_48_decreto_imperial.webp"
  },
  {
    "id": "gold_49_colera_divina",
    "name": "Julgamento do Zênite Solar",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Julgamento",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Cura 3 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      }
    ],
    "description": "Feitiço: Pilares de luz solar causam 3 de dano à fileira inimiga, curam 3 em todos os aliados e concedem Escudo Divino.",
    "flavorText": "A mesma luz que restaura os justos reduz os tiranos a cinzas.",
    "imagePath": "/assets/cards/gold_49_colera_divina.webp"
  },
  {
    "id": "gold_50_intervencao_angelical",
    "name": "Intervenção do Serafim",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Proteção",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano de luz ao agressor."
      }
    ],
    "description": "Reação: Asas douradas interceptam o golpe, concedendo Escudo Divino aos aliados, curando 3 no Soberano e causando 2 de dano ao agressor.",
    "flavorText": "Nenhuma lâmina atravessa o voto de um anjo guardião.",
    "imagePath": "/assets/cards/gold_50_intervencao_angelical.webp"
  },
  {
    "id": "gold_51_balista_cidadela",
    "name": "Balista de Repetição Imperial",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Armamento",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Dispara um virote causando 2 de dano a um inimigo."
      },
      {
        "trigger": "turn_end",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Fim do Turno: Dispara automaticamente causando 2 de dano a um inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano a um inimigo. Fim do Turno: Dispara causando 2 de dano a um inimigo.",
    "flavorText": "Suas engrenagens recarregam virotes de aço consagrado sem descanso.",
    "imagePath": "/assets/cards/gold_51_balista_cidadela.webp"
  },
  {
    "id": "gold_52_calice_graal",
    "name": "Cálice da Aurora Imortal",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Santuário",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Início do Turno: Cura 1 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Cura 3 no Soberano. Início do Turno: Cura 2 no Soberano e 1 em todos os aliados.",
    "flavorText": "Uma única gota de seu néctar dourado fecha qualquer ferida mortal.",
    "imagePath": "/assets/cards/gold_52_calice_graal.webp"
  },
  {
    "id": "gold_53_armadura_imperador",
    "name": "Relicário da Égide Soberana",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Égide",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Início do Turno: Concede +1 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Ao Entrar: Concede Escudo Divino aos aliados. Início do Turno: Concede +1 ATQ e +2 VIDA a um aliado.",
    "flavorText": "Forjada para o primeiro imperador, sua presença ainda blinda legiões inteiras.",
    "imagePath": "/assets/cards/gold_53_armadura_imperador.webp"
  },
  {
    "id": "gold_54_arca_alianca",
    "name": "Arca do Pacto Radiante",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Aliança",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1 ATQ e +2 VIDA a todos os aliados."
      },
      {
        "trigger": "turn_end",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Fim do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Dá +1/+2 aos aliados. Fim do Turno: Causa 1 de dano à fileira inimiga e cura 2 no Soberano.",
    "flavorText": "Dois querubins de ouro guardam o selo que mantém o mundo unido.",
    "imagePath": "/assets/cards/gold_54_arca_alianca.webp"
  },
  {
    "id": "neutral_21_mercenario_veterano",
    "name": "Capitão da Companhia Livre",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Mercenário",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Armadura 1. Luta por qualquer Soberano que pague em ouro vivo.",
    "flavorText": "Não pergunte por qual deus ele reza; pergunte apenas qual linha ele deve segurar.",
    "imagePath": "/assets/cards/neutral_21_mercenario_veterano.webp"
  },
  {
    "id": "neutral_22_homunculo_alquimico",
    "name": "Familiar de Mercúrio Alquímico",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Alquimia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 1,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo. Ao Entrar: Transmuta reagentes etéreos e compra 1 carta.",
    "flavorText": "Nascido em um frasco de vidro soprado sob três luas.",
    "imagePath": "/assets/cards/neutral_22_homunculo_alquimico.webp"
  },
  {
    "id": "neutral_23_golem_argila",
    "name": "Colosso de Barro Rúnico",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Guardião",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "regeneration": 1,
    "effects": [],
    "description": "Guardião. Armadura 1. Regeneração 1. Moldado em argila sagrada que se fecha após cada golpe.",
    "flavorText": "Enquanto a palavra da verdade brilhar em sua testa, ele jamais cairá.",
    "imagePath": "/assets/cards/neutral_23_golem_argila.webp"
  },
  {
    "id": "neutral_24_dragao_astral",
    "name": "Astrolon, Dragão do Vácuo Estelar",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Dragão • Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 0,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1 de Essência."
      }
    ],
    "description": "Voo, Escudo Divino. Armadura 1. Sopro 2. Ao Entrar: Compra 1 carta e gera +1⚡ de Essência.",
    "flavorText": "Suas escamas não têm cor porque refletem todas as estrelas do multiverso.",
    "imagePath": "/assets/cards/neutral_24_dragao_astral.webp"
  },
  {
    "id": "neutral_25_convergencia_harmonica",
    "name": "Convergência dos Cinco Pactos",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Pergaminho",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Gera +2 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Alinha os cinco fluxos elementais, gerando +2⚡ de Essência neste turno, curando 2 no Soberano e comprando 1 carta.",
    "flavorText": "Cinco cores se encontram no prisma; um único poder emerge.",
    "imagePath": "/assets/cards/neutral_25_convergencia_harmonica.webp"
  },
  {
    "id": "neutral_26_egide_dimensional",
    "name": "Passo Entre as Fendas",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Emboscada • Etéreo",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Reação: Desloca sua fileira para a Fenda Cinzenta por um instante, concedendo Escudo Divino aos aliados e curando 2 no Soberano.",
    "flavorText": "Entre um batimento e outro, você simplesmente não está no mesmo mundo.",
    "imagePath": "/assets/cards/neutral_26_egide_dimensional.webp"
  },
  {
    "id": "neutral_27_elmo_telepatia",
    "name": "Diadema da Mente Desperta",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Equipamento",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Clareia a mente curando 2 de VIDA do Soberano."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Início do Turno: Cura 2 de VIDA do seu Soberano.",
    "flavorText": "Conhecer o movimento do inimigo antes que ele empunhe a espada é metade da vitória.",
    "imagePath": "/assets/cards/neutral_27_elmo_telepatia.webp"
  },
  {
    "id": "neutral_28_manoplas_forca",
    "name": "Manoplas de Força de Titã",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Equipamento",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2 ATQ e +2 VIDA a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Dá +2/+2 a um aliado. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Com elas, um escudeiro ergue uma coluna de mármore como se fosse um graveto.",
    "imagePath": "/assets/cards/neutral_28_manoplas_forca.webp"
  },
  {
    "id": "neutral_29_esfera_aniquilacao",
    "name": "Orbe da Singularidade Nula",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Artefato",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Desintegra 3 de VIDA de um inimigo."
      },
      {
        "trigger": "turn_end",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Fim do Turno: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano a um inimigo. Fim do Turno: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Um buraco perfeito na tapeçaria da realidade.",
    "imagePath": "/assets/cards/neutral_29_esfera_aniquilacao.webp"
  },
  {
    "id": "neutral_30_coroa_pactos",
    "name": "Diadema Supremo Pentacromático",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Lendária",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Dá +1/+1 aos aliados e compra 1 carta. Início do Turno: Gera +1⚡ e cura 2 no Soberano.",
    "flavorText": "Rubi, safira, ametista, esmeralda e topázio: quem porta as cinco joias governa o pacto.",
    "imagePath": "/assets/cards/neutral_30_coroa_pactos.webp"
  },
  {
    "id": "red_55_diabrete_forja",
    "name": "Diabrete Soprador de Brasas",
    "domain": "red",
    "type": "creature",
    "subtype": "Ínfero • Elemental",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Aviva a forja concedendo +1⚡ Essência neste turno."
      }
    ],
    "description": "Voo. Ao Entrar: Concede +1⚡ Essência neste turno.",
    "flavorText": "Onde há fumaça na forja, há meia dúzia deles assoprando o carvão.",
    "imagePath": "/assets/cards/red_55_diabrete_forja.webp"
  },
  {
    "id": "red_56_cultista_chama",
    "name": "Acólito da Pira Primordial",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Humanoide • Piromante",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [],
    "ascension": {
      "cost": 4,
      "newName": "Arauto de Ignis-Vael Ascendido",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Ímpeto",
        "Pele Incandescente"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 1 de dano diretamente ao Soberano inimigo.",
    "flavorText": "Cinzas para as cinzas, e todo o resto para a fornalha sagrada.",
    "imagePath": "/assets/cards/red_56_cultista_chama.webp"
  },
  {
    "id": "red_57_salamandra_forja",
    "name": "Lanceiro Ígneo de Bronze",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Guerreiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Pele Incandescente. Ao Atacar: Causa 1 de dano ao Soberano inimigo.",
    "flavorText": "Sua lança nunca esfria desde o dia em que foi temperada no núcleo do mundo.",
    "imagePath": "/assets/cards/red_57_salamandra_forja.webp"
  },
  {
    "id": "red_58_berserker_cinzas",
    "name": "Berserker de Sangue Fervente",
    "domain": "red",
    "type": "creature",
    "subtype": "Humanoide • Bárbaro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Fúria Crescente (+1 ATQ sempre que sobrevive a dano).",
    "flavorText": "A dor apenas alimenta a fornalha que bate em seu peito.",
    "imagePath": "/assets/cards/red_58_berserker_cinzas.webp"
  },
  {
    "id": "red_59_cao_magma",
    "name": "Cão de Caça Piroclástico",
    "domain": "red",
    "type": "creature",
    "subtype": "Fera • Elemental",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Abocanha um inimigo causando 2 de dano."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Causa 2 de dano a um inimigo.",
    "flavorText": "Suas pegadas derretem o calçamento de pedra antes mesmo que a presa ouça o latido.",
    "imagePath": "/assets/cards/red_59_cao_magma.webp"
  },
  {
    "id": "red_60_artilheiro_kobold",
    "name": "Inventor Escamado de Alquimia",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Réptil • Artilheiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Mestre Bombardeiro Dracônico",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Voo"
      ]
    },
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Atacar: Lança frasco alquímico causando 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Alcance. Ao Atacar: Causa 1 de dano à Vanguarda rival. Ascensão (4⚡): Mestre Bombardeiro (5/1/6, Alcance, Voo).",
    "flavorText": "Três partes de enxofre, uma de piche e um escorpião muito irritado.",
    "imagePath": "/assets/cards/red_60_artilheiro_kobold.webp"
  },
  {
    "id": "red_61_manticora_fogo",
    "name": "Mantícora da Cratera",
    "domain": "red",
    "type": "creature",
    "subtype": "Monstruosidade • Alada",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [],
    "description": "Voo, Alcance. Dispara espinhos incandescentes da Retaguarda.",
    "flavorText": "Sua cauda dispara uma saraivada de farpas de ferro em brasa.",
    "imagePath": "/assets/cards/red_61_manticora_fogo.webp"
  },
  {
    "id": "red_62_colosso_obsidiana",
    "name": "Destruidor de Obsidiana Fundida",
    "domain": "red",
    "type": "creature",
    "subtype": "Constructo • Elemental",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Guardião, Pele Incandescente. Protege seus aliados e queima atacantes.",
    "flavorText": "Golpear seu peito é quebrar a própria espada contra vidro vulcânico e fogo.",
    "imagePath": "/assets/cards/red_62_colosso_obsidiana.webp"
  },
  {
    "id": "red_63_wyvern_imperial",
    "name": "Serpe Real de Escama Rubra",
    "domain": "red",
    "type": "creature",
    "subtype": "Dracônico • Alado",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "breathDamage": 1,
    "effects": [],
    "description": "Voo, Ímpeto. Armadura 1. Sopro 1. Mergulha das nuvens de cinza sobre a linha inimiga.",
    "flavorText": "Mais veloz que os grandes dragões e duas vezes mais faminta.",
    "imagePath": "/assets/cards/red_63_wyvern_imperial.webp"
  },
  {
    "id": "red_64_principe_fogo",
    "name": "Ignis-Vael, Príncipe do Núcleo Ardente",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Elemental • Primordial",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Pele Incandescente",
      "Atropelar"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "turn_end",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Fim do Turno: Concede +1 ATQ a todos os seus aliados."
      }
    ],
    "description": "Pele Incandescente, Atropelar. Sopro 2. Fim do Turno: Concede +1 ATQ a todos os seus aliados.",
    "flavorText": "Eu sou a fornalha viva que derrete tronos e transforma muralhas em vidro.",
    "imagePath": "/assets/cards/red_64_principe_fogo.webp"
  },
  {
    "id": "red_65_dragao_magma_anciao",
    "name": "Magmarok, o Tirano Piroclástico",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Ancião",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Atropelar"
    ],
    "breathDamage": 3,
    "effects": [],
    "description": "Voo, Ímpeto, Atropelar. Sopro 3: Incinera a fileira inimiga em 3 de dano antes de atacar.",
    "flavorText": "As forjas da montanha permanecem acesas dia e noite apenas como tributo ao seu despertar.",
    "imagePath": "/assets/cards/red_65_dragao_magma_anciao.webp"
  },
  {
    "id": "red_66_flecha_explosiva",
    "name": "Salva de Dardos Explosivos",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Causa 3 de dano a um inimigo e 2 de dano ao Soberano rival.",
    "flavorText": "As pontas de ferro carregam óleo alquímico que explode no impacto.",
    "imagePath": "/assets/cards/red_66_flecha_explosiva.webp"
  },
  {
    "id": "red_67_fornalha_interior",
    "name": "Fornalha Interior",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Transmutação",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2 ATQ e +1 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 1,
        "secondaryValue": 1,
        "description": "Invoca uma Cria Dracônica (1/1)."
      }
    ],
    "description": "Concede +2/+1 a um aliado, invoca uma Cria Dracônica (1/1) e compra 1 carta.",
    "flavorText": "Quando o coração bate no ritmo do tambor de guerra, o aço incandesce.",
    "imagePath": "/assets/cards/red_67_fornalha_interior.webp"
  },
  {
    "id": "red_68_chuva_enxofre",
    "name": "Tempestade de Escória e Enxofre",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 4 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Causa 4 de dano a todos os inimigos na Vanguarda e 3 de dano ao Soberano rival.",
    "flavorText": "O céu tornou-se de chumbo e choveu pedra derretida sobre os escudos.",
    "imagePath": "/assets/cards/red_68_chuva_enxofre.webp"
  },
  {
    "id": "red_69_ira_vulcao",
    "name": "Despertar da Caldeira Ancestral",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 6,
        "description": "Causa 6 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2/+1 a todos os seus aliados."
      }
    ],
    "description": "Causa 6 de dano a um inimigo, 2 à Vanguarda rival e concede +2/+1 a todos os seus aliados.",
    "flavorText": "Quando a montanha acorda, exércitos inteiros viram estátuas de cinza.",
    "imagePath": "/assets/cards/red_69_ira_vulcao.webp"
  },
  {
    "id": "red_70_armadilha_fogo",
    "name": "Glifo de Detonação Rubra",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Armadilha Rúnica",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência adicional."
      }
    ],
    "description": "Armadilha Oculta: Causa 3 de dano ao atacante inimigo e gera +1⚡ de Essência.",
    "flavorText": "O ladrão leu a primeira sílaba da runa; não sobrou nada para ler a segunda.",
    "imagePath": "/assets/cards/red_70_armadilha_fogo.webp"
  },
  {
    "id": "red_71_manto_brasas",
    "name": "Manto de Brasas do Sultão",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Abjuração Ígnea",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Armadilha Oculta: Causa 2 de dano à Vanguarda inimiga e cura 2 de VIDA no seu Soberano.",
    "flavorText": "As labaredas da Cidadela de Bronze envolvem seu portador e carbonizam quem ousa tocá-lo.",
    "imagePath": "/assets/cards/red_71_manto_brasas.webp"
  },
  {
    "id": "red_72_caldeirao_magma",
    "name": "Fornalha Rúnica da Caldeira",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Braseiro",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Entrar: Lança onda de magma causando 1 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "turn_end",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Fim do Turno: Causa 1 de dano a um inimigo."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Lançar Feitiço: Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano à Vanguarda rival. Fim do Turno: Causa 2 a um inimigo. Ao Lançar Feitiço: 1 de dano ao Soberano rival.",
    "flavorText": "Enquanto o braseiro arder, o ar do campo de batalha queima a cada respiração.",
    "imagePath": "/assets/cards/red_72_caldeirao_magma.webp"
  },
  {
    "id": "blue_55_familiar_coruja",
    "name": "Coruja Astral de Vigília",
    "domain": "blue",
    "type": "creature",
    "subtype": "Fera • Familiar",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo. Ao Entrar: Compra 1 carta.",
    "flavorText": "Seus olhos prateados enxergam através de nevoeiros e ilusões.",
    "imagePath": "/assets/cards/blue_55_familiar_coruja.webp"
  },
  {
    "id": "blue_56_tritao_mare",
    "name": "Domador de Marés Tritão",
    "domain": "blue",
    "type": "creature",
    "subtype": "Aquático • Mago",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [],
    "ascension": {
      "cost": 4,
      "newName": "Soberano das Correntes Abissais",
      "newAtk": 4,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Guardião",
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      },
      {
        "trigger": "on_attack",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Atacar: Congela 1 inimigo."
      }
    ],
    "description": "Ao Atacar: Congela 1 inimigo. Ascensão (4⚡): Soberano das Correntes (4/1/6, Guardião, Escudo Divino).",
    "flavorText": "As marés obedecem ao giro de seu tridente de coral.",
    "imagePath": "/assets/cards/blue_56_tritao_mare.webp"
  },
  {
    "id": "blue_57_espectro_gelo",
    "name": "Aparição da Nevasca",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Glacial",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Ao Entrar: Congela 1 inimigo.",
    "flavorText": "Seu toque transforma o suor do guerreiro em uma mortalha de cristal.",
    "imagePath": "/assets/cards/blue_57_espectro_gelo.webp"
  },
  {
    "id": "blue_58_cacador_kuo_toa",
    "name": "Arpoador Abissal das Marés",
    "domain": "blue",
    "type": "creature",
    "subtype": "Aquático • Caçador",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Prende e Congela 1 inimigo."
      }
    ],
    "description": "Alcance. Ao Entrar: Congela 1 inimigo.",
    "flavorText": "Das fossas abissais sob o gelo, seus arpões de safira nunca erram o bote.",
    "imagePath": "/assets/cards/blue_58_cacador_kuo_toa.webp"
  },
  {
    "id": "blue_59_mago_ilusao",
    "name": "Tecelão de Miragens Arcanas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Ilusionista",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Escudo Divino",
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Arquimago do Véu Espelhado",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Escudo Divino",
        "Alcance",
        "Voo"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "on_attack",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Atacar: Compra 1 carta."
      }
    ],
    "description": "Escudo Divino, Alcance. Ao Atacar: Compra 1 carta. Ascensão (4⚡): Arquimago do Véu (5/1/6, Voo).",
    "flavorText": "Qual dos cinco magos você pretende golpear primeiro?",
    "imagePath": "/assets/cards/blue_59_mago_ilusao.webp"
  },
  {
    "id": "blue_60_gigante_gelo_jarl",
    "name": "Jarl da Geleira Eterna",
    "domain": "blue",
    "type": "creature",
    "subtype": "Gigante • Glacial",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela a Vanguarda inimiga."
      }
    ],
    "description": "Guardião. Ao Entrar: Congela os inimigos na Vanguarda.",
    "flavorText": "Seu berrante de chifre de mamute anuncia um inverno que dura séculos.",
    "imagePath": "/assets/cards/blue_60_gigante_gelo_jarl.webp"
  },
  {
    "id": "blue_61_quimera_tempestade",
    "name": "Grifo-Tormenta de Asas Elétricas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Elemental",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 6,
    "armor": 0,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Mergulha das nuvens de tempestade no mesmo turno em que entra.",
    "flavorText": "Ele não voa entre os relâmpagos; ele é o próprio relâmpago.",
    "imagePath": "/assets/cards/blue_61_quimera_tempestade.webp"
  },
  {
    "id": "blue_62_principe_ar",
    "name": "Yan-Vael, Senhor do Furacão",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Primordial",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 3,
    "atk": 6,
    "armor": 0,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Guardião"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo. Sopro 2. Ao Entrar: Congela a Vanguarda inimiga e compra 1 carta.",
    "flavorText": "Invisível como a brisa, implacável como o tufão que arranca muralhas.",
    "imagePath": "/assets/cards/blue_62_principe_ar.webp"
  },
  {
    "id": "blue_63_leviata_primordial",
    "name": "Thalassia, A Maré Devoradora",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Elemental • Leviatã",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "turn_start",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Início do Turno: Congela 1 inimigo."
      }
    ],
    "description": "Guardião. Sopro 3. Início do Turno: Congela 1 inimigo.",
    "flavorText": "Cidades costeiras inteiras repousam silenciosas no fundo de seu abraço.",
    "imagePath": "/assets/cards/blue_63_leviata_primordial.webp"
  },
  {
    "id": "blue_64_seta_gelo",
    "name": "Lança de Gelo Perfurante",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Evocação",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      }
    ],
    "description": "Causa 2 de dano a um inimigo e o Congela.",
    "flavorText": "Estilhaça no impacto, congelando o sangue nas veias do alvo.",
    "imagePath": "/assets/cards/blue_64_seta_gelo.webp"
  },
  {
    "id": "blue_65_estudo_runico",
    "name": "Decifrar os Pergaminhos",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Adivinhação",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 1,
        "secondaryValue": 2,
        "description": "Invoca um Elemental de Geada (1/2)."
      }
    ],
    "description": "Compra 2 cartas e invoca um Elemental de Geada (1/2).",
    "flavorText": "O conhecimento antigo vale mais que mil espadas desembainhadas.",
    "imagePath": "/assets/cards/blue_65_estudo_runico.webp"
  },
  {
    "id": "blue_66_vortice_aquatico",
    "name": "Maelstrom Engolidor",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Controle",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela a Vanguarda inimiga."
      }
    ],
    "description": "Causa 3 de dano à Vanguarda inimiga e Congela os inimigos atingidos.",
    "flavorText": "A correnteza puxa armaduras e cavalos para o abismo gelado.",
    "imagePath": "/assets/cards/blue_66_vortice_aquatico.webp"
  },
  {
    "id": "blue_67_clone_espelhado",
    "name": "Duplicata Ilusória",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Ilusão",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Invoca um Elemental de Geada (2/2)."
      }
    ],
    "description": "Concede +1/+1 a todos os seus aliados, invoca um Elemental de Geada (2/2) e compra 1 carta.",
    "flavorText": "Quando o reflexo é tecido com geada encantada, sua espada corta tão fundo quanto a original.",
    "imagePath": "/assets/cards/blue_67_clone_espelhado.webp"
  },
  {
    "id": "blue_68_parar_tempo",
    "name": "Estase Temporal Absoluta",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 3,
        "secondaryValue": 3,
        "description": "Invoca um Elemental de Geada (3/3)."
      }
    ],
    "description": "Congela a Vanguarda inimiga, causa 3 de dano a ela, invoca um Elemental de Geada (3/3) e compra 1 carta.",
    "flavorText": "Entre uma batida e outra do pêndulo de safira, o arquimago já havia vencido a guerra.",
    "imagePath": "/assets/cards/blue_68_parar_tempo.webp"
  },
  {
    "id": "blue_69_escudo_arcano",
    "name": "Égide de Abjuração",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 3,
        "description": "Concede +1 ATQ e +3 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Armadilha Oculta: Concede +1/+3 a um aliado e compra 1 carta.",
    "flavorText": "Um gesto rápido no ar ergue uma parede invisível mais dura que o diamante.",
    "imagePath": "/assets/cards/blue_69_escudo_arcano.webp"
  },
  {
    "id": "blue_70_refletir_feitico",
    "name": "Reversão de Fluxo Rúnico",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Contrafeitiço",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela o inimigo."
      }
    ],
    "description": "Armadilha Oculta: Causa 3 de dano ao atacante inimigo e o Congela.",
    "flavorText": "Sua própria fúria foi devolvida na forma de uma lança de geada.",
    "imagePath": "/assets/cards/blue_70_refletir_feitico.webp"
  },
  {
    "id": "blue_71_tigela_mares",
    "name": "Cálice de Comando das Águas",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Vaso Elemental",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela a Vanguarda inimiga."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Lançar Feitiço: Jato de maré causa 2 de dano a um inimigo."
      },
      {
        "trigger": "spell_cast",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Lançar Feitiço: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Congela a Vanguarda rival. Ao Lançar Feitiço: Causa 2 a um inimigo e cura 2 no seu Soberano.",
    "flavorText": "Dentro da bacia de safira, um oceano inteiro aguarda o comando do conjurador.",
    "imagePath": "/assets/cards/blue_71_tigela_mares.webp"
  },
  {
    "id": "blue_72_incensario_ventos",
    "name": "Turíbulo dos Quatro Ventos",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Turíbulo",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Início do Turno: Rajada cortante causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 3,
        "description": "Ao Entrar: Invoca um Elemental de Geada (2/3) na Vanguarda."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta e invoca Elemental (2/3). Início do Turno: Causa 2 de dano à Vanguarda rival.",
    "flavorText": "Cada balanço da corrente libera um vendaval capaz de virar caravelas.",
    "imagePath": "/assets/cards/blue_72_incensario_ventos.webp"
  },
  {
    "id": "purple_55_rastejador_cripta",
    "name": "Escolo-Couraçada da Cripta",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Monstruosidade • Centopeia Abissal",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Toque Letal. Destrói qualquer criatura que sofrer dano de suas mandíbulas venenosas.",
    "flavorText": "Suas placas de quitina negra deslizam em silêncio entre os sarcófagos da catedral.",
    "imagePath": "/assets/cards/purple_55_rastejador_cripta.webp"
  },
  {
    "id": "purple_56_sacerdotisa_aranha",
    "name": "Novicia da Rainha Teia",
    "domain": "purple",
    "type": "creature",
    "subtype": "Elfo Sombrio • Clérigo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Matriarca Aracnídea Ascendida",
      "newAtk": 4,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Toque Letal",
        "Dreno de Vida"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano a um inimigo."
      }
    ],
    "description": "Dreno de Vida. Ao Entrar: Causa 1 de dano a um inimigo. Ascensão (4⚡): Matriarca Aracnídea (4/1/6, Toque Letal, Dreno de Vida).",
    "flavorText": "Nas cidades sem sol, toda prece é paga com veneno e seda negra.",
    "imagePath": "/assets/cards/purple_56_sacerdotisa_aranha.webp"
  },
  {
    "id": "purple_57_mastim_sombra",
    "name": "Sabujo do Véu Umbroso",
    "domain": "purple",
    "type": "creature",
    "subtype": "Fera • Sombra",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Salta das sombras e ataca no mesmo turno.",
    "flavorText": "Quando sua própria sombra começar a rosnar, já é tarde demais para correr.",
    "imagePath": "/assets/cards/purple_57_mastim_sombra.webp"
  },
  {
    "id": "purple_58_micoide_esporos",
    "name": "Soberano Fúngico Corrompido",
    "domain": "purple",
    "type": "creature",
    "subtype": "Planta • Fúngico",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Renascer"
    ],
    "effects": [],
    "description": "Guardião, Renascer. Quando abatido pela primeira vez, brota novamente dos esporos.",
    "flavorText": "A morte é apenas o adubo para o jardim da Dama dos Fungos.",
    "imagePath": "/assets/cards/purple_58_micoide_esporos.webp"
  },
  {
    "id": "purple_59_duergar_despota",
    "name": "Déspota Cinzento da Forja Negra",
    "domain": "purple",
    "type": "creature",
    "subtype": "Anão Sombrio • Guerreiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Dreno de Vida"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Colosso Psíquico da Forja Negra",
      "newAtk": 6,
      "newArmor": 2,
      "newMaxHp": 6,
      "addedKeywords": [
        "Guardião",
        "Atropelar"
      ]
    },
    "effects": [],
    "description": "Guardião, Dreno de Vida. Armadura 1. Ascensão (4⚡): Colosso Psíquico (6/2/6, Guardião, Atropelar).",
    "flavorText": "Alimentado pela dor e pela psique aprisionada em sua couraça de ferro negro.",
    "imagePath": "/assets/cards/purple_59_duergar_despota.webp"
  },
  {
    "id": "purple_60_bodak_olhar",
    "name": "Aparição do Olhar Abissal",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Abissal",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Toque Letal. Ao Entrar: Drena 2 de VIDA do Soberano rival.",
    "flavorText": "Não há pupilas em seu rosto, apenas dois poços que dão para o Vazio.",
    "imagePath": "/assets/cards/purple_60_bodak_olhar.webp"
  },
  {
    "id": "purple_61_sombra_assassina",
    "name": "Ceifador Etéreo de Meia-Noite",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Assassino",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 5,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Dreno de Vida. Cura seu Soberano a cada golpe desferido.",
    "flavorText": "A lâmina atravessa o aço sem fazer barulho e congela a própria alma.",
    "imagePath": "/assets/cards/purple_61_sombra_assassina.webp"
  },
  {
    "id": "purple_62_beholder_morte",
    "name": "Soberano do Crânio Abissal",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Aberração",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Raio de desintegração causa 3 de dano a um inimigo."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Causa 3 de dano a um inimigo.",
    "flavorText": "Mesmo após a morte, sua paranoia imortal continua vigiando as catacumbas.",
    "imagePath": "/assets/cards/purple_62_beholder_morte.webp"
  },
  {
    "id": "purple_63_rainha_fungos",
    "name": "Mycoria, Dama da Podridão",
    "domain": "purple",
    "type": "creature",
    "subtype": "Abissal • Soberana",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Renascer",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Início do Turno: Reanima 1 aliado da Cripta."
      }
    ],
    "description": "Renascer, Toque Letal. Início do Turno: Reanima 1 aliado da sua Cripta.",
    "flavorText": "Todos os impérios terminarão como alimento para o meu jardim eterno.",
    "imagePath": "/assets/cards/purple_63_rainha_fungos.webp"
  },
  {
    "id": "purple_64_lorde_sem_rosto",
    "name": "Voraghor, O Vazio Gelatinoso",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Limo • Primordial",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Toque Letal"
    ],
    "regeneration": 2,
    "breathDamage": 2,
    "effects": [],
    "description": "Guardião, Toque Letal, Regeneração 2. Sopro Ácido 2.",
    "flavorText": "Mil olhos vermelhos flutuam em uma maré de ácido negro que tudo dissolve.",
    "imagePath": "/assets/cards/purple_64_lorde_sem_rosto.webp"
  },
  {
    "id": "purple_65_principe_mortos",
    "name": "Malakor-Vael, Soberano da Não-Vida",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Abissal • Arquidemônio",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima 1 aliado da Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Dreno de Vida. Ao Entrar: Reanima 1 aliado da Cripta e causa 3 de dano à Vanguarda inimiga.",
    "flavorText": "Quando ele bate seu cetro no chão, até os reis sepultados há mil anos se levantam.",
    "imagePath": "/assets/cards/purple_65_principe_mortos.webp"
  },
  {
    "id": "purple_66_dreno_vital",
    "name": "Sifão de Almas",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Causa 3 de dano a um inimigo e cura 3 de VIDA no seu Soberano.",
    "flavorText": "A juventude roubada do inimigo fecha as feridas do invocador.",
    "imagePath": "/assets/cards/purple_66_dreno_vital.webp"
  },
  {
    "id": "purple_67_sussurros_loucura",
    "name": "Ecos da Loucura Abissal",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Psíquico",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano psíquico a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Causa 3 de dano a um inimigo, 2 ao Soberano rival e compra 1 carta.",
    "flavorText": "Uma melodia impossível que apenas a vítima consegue ouvir antes de cair.",
    "imagePath": "/assets/cards/purple_67_sussurros_loucura.webp"
  },
  {
    "id": "purple_68_exumar_legiao",
    "name": "Exumar a Legião Caída",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Reanima 1 aliado da Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 a todos os seus aliados."
      }
    ],
    "description": "Reanima 1 aliado da sua Cripta e concede +1/+1 a todos os seus aliados.",
    "flavorText": "O descanso eterno foi revogado por decreto da Cripta.",
    "imagePath": "/assets/cards/purple_68_exumar_legiao.webp"
  },
  {
    "id": "purple_69_dedo_morte",
    "name": "Sentença do Oblívio",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 6,
        "description": "Causa 6 de dano necrótico a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Cura 4 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Causa 5 de dano a um inimigo e cura 3 de VIDA no seu Soberano.",
    "flavorText": "Uma única palavra apaga o calor do corpo e acende a chama fria da cripta.",
    "imagePath": "/assets/cards/purple_69_dedo_morte.webp"
  },
  {
    "id": "purple_70_armadilha_teia",
    "name": "Emboscada da Teia Venenosa",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Imobiliza (Congela) 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano de veneno ao inimigo."
      }
    ],
    "description": "Armadilha Oculta: Imobiliza (Congela) o atacante inimigo e causa 2 de dano a ele.",
    "flavorText": "Quanto mais o cavaleiro se debate, mais fundo as presas se cravam.",
    "imagePath": "/assets/cards/purple_70_armadilha_teia.webp"
  },
  {
    "id": "purple_71_varinha_orcus",
    "name": "Cetro da Caveira Abissal",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Cetro Profano",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima 1 aliado da Cripta."
      },
      {
        "trigger": "turn_end",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Fim do Turno: Drena 2 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Reanima 1 aliado da Cripta. Fim do Turno: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Forjado em ferro estígio e coroado com o crânio de um antigo herói solar.",
    "imagePath": "/assets/cards/purple_71_varinha_orcus.webp"
  },
  {
    "id": "purple_72_espelho_aprisionador",
    "name": "Espelho Devorador de Almas",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Artefato",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano a um inimigo. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Dentro do vidro escuro, rostos silenciosos batem contra a superfície.",
    "imagePath": "/assets/cards/purple_72_espelho_aprisionador.webp"
  },
  {
    "id": "green_55_texugo_atroz",
    "name": "Texugo Escavador Furioso",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Selvagem",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Fúria Crescente (+1 ATQ sempre que sobrevive a dano).",
    "flavorText": "Até um dragão pensa duas vezes antes de enfiar a pata na toca dele.",
    "imagePath": "/assets/cards/green_55_texugo_atroz.webp"
  },
  {
    "id": "green_56_arqueiro_silvestre",
    "name": "Patrulheiro da Copa Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Elfo • Patrulheiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Mestre Franco-Atirador Silvestre",
      "newAtk": 5,
      "newArmor": 0,
      "newMaxHp": 5,
      "addedKeywords": [
        "Alcance",
        "Toque Letal"
      ]
    },
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Dispara flecha extra causando 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Alcance. Ao Atacar: Causa 1 de dano ao Soberano rival. Ascensão (4⚡): Franco-Atirador (5/0/5, Alcance, Toque Letal).",
    "flavorText": "Nenhuma folha cai na floresta sem que sua flecha já esteja na corda.",
    "imagePath": "/assets/cards/green_56_arqueiro_silvestre.webp"
  },
  {
    "id": "green_57_vespa_gigante",
    "name": "Vespa Caçadora da Selva",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Inseto",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Voo, Toque Letal. Abate até os maiores colossos com uma única ferroada.",
    "flavorText": "O zumbido de suas asas é o último aviso antes do veneno paralisar o coração.",
    "imagePath": "/assets/cards/green_57_vespa_gigante.webp"
  },
  {
    "id": "green_58_urso_polar",
    "name": "Urso Colossal da Tundra",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Guardião",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Ergue-se como uma muralha de músculos e garras na Vanguarda.",
    "flavorText": "Sua pelagem espessa desvia lanças como se fossem gravetos secos.",
    "imagePath": "/assets/cards/green_58_urso_polar.webp"
  },
  {
    "id": "green_59_xama_lagarto",
    "name": "Xamã da Escama Pantanosa",
    "domain": "green",
    "type": "creature",
    "subtype": "Reptiliano • Xamã",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [],
    "regeneration": 1,
    "ascension": {
      "cost": 4,
      "newName": "Avatar do Crocodilo Rei",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 7,
      "addedKeywords": [
        "Atropelar",
        "Guardião"
      ]
    },
    "effects": [],
    "description": "Regeneração 1. Ascensão (4⚡): Avatar do Crocodilo Rei (6/1/7, Atropelar, Guardião).",
    "flavorText": "Quando o pântano exige sangue, o xamã veste a mandíbula do próprio rio.",
    "imagePath": "/assets/cards/green_59_xama_lagarto.webp"
  },
  {
    "id": "green_60_tigre_dentes_sabre",
    "name": "Tigre Dentes-de-Sabre Alfa",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Predador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Salta sobre a presa no mesmo turno em que é invocado.",
    "flavorText": "Duas adagas de marfim capazes de perfurar uma couraça de bronze.",
    "imagePath": "/assets/cards/green_60_tigre_dentes_sabre.webp"
  },
  {
    "id": "green_61_planta_carnivora",
    "name": "Trepadeira Estranguladora",
    "domain": "green",
    "type": "creature",
    "subtype": "Planta • Colosso",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Guardião, Regeneração 2. Suas raízes se reconstroem a cada turno.",
    "flavorText": "Corte um cipó e três outros se enrolarão em seu escudo.",
    "imagePath": "/assets/cards/green_61_planta_carnivora.webp"
  },
  {
    "id": "green_62_rinoceronte_couracado",
    "name": "Rinoceronte de Chifre de Ferro",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Couraçado",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [],
    "description": "Atropelar. O dano excedente de sua investida atinge o Soberano rival.",
    "flavorText": "Quando ele abaixa a cabeça, nem portões de carvalho ficam de pé.",
    "imagePath": "/assets/cards/green_62_rinoceronte_couracado.webp"
  },
  {
    "id": "green_63_troll_venenoso",
    "name": "Troll Mutante do Pântano",
    "domain": "green",
    "type": "creature",
    "subtype": "Gigante • Troll",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Toque Letal, Regeneração 2. Suas garras destilam peçonha letal.",
    "flavorText": "Ele bebeu das lagoas negras até que seu próprio sangue se tornasse veneno.",
    "imagePath": "/assets/cards/green_63_troll_venenoso.webp"
  },
  {
    "id": "green_64_mamute_guerra",
    "name": "Mamute Lanoso de Batalha",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Colosso",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [],
    "description": "Guardião, Atropelar. Protege a fileira e esmaga defensores sob suas patas.",
    "flavorText": "O chão treme a uma légua de distância quando a manada começa a trotar.",
    "imagePath": "/assets/cards/green_64_mamute_guerra.webp"
  },
  {
    "id": "green_65_catoblepas_pantano",
    "name": "Fera-Peste do Brejo Negro",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Pântano",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Olhar pestilento causa 3 de dano a um inimigo."
      }
    ],
    "description": "Toque Letal. Ao Entrar: Causa 3 de dano a um inimigo.",
    "flavorText": "Onde quer que ele passe, os lírios apodrecem e os corvos caem das árvores.",
    "imagePath": "/assets/cards/green_65_catoblepas_pantano.webp"
  },
  {
    "id": "green_66_gorila_rei",
    "name": "Baphgor, O Rei Primata Ancestral",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Titã",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Rugido alfa concede +1/+1 a todos os seus aliados."
      }
    ],
    "description": "Fúria Crescente, Atropelar. Ao Entrar: Concede +1/+1 a todos os seus aliados.",
    "flavorText": "Quando ele bate no peito, o eco derruba pedras do alto da montanha.",
    "imagePath": "/assets/cards/green_66_gorila_rei.webp"
  },
  {
    "id": "green_67_tiranossauro_alfa",
    "name": "Rex Primordial da Cratera Perdida",
    "domain": "green",
    "type": "creature",
    "subtype": "Dinossauro • Titã",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 8,
    "armor": 0,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Ímpeto, Atropelar. Devasta a linha de frente inimiga no turno em que entra.",
    "flavorText": "No fundo da cratera fumegante, o antigo mundo nunca deixou de reinar.",
    "imagePath": "/assets/cards/green_67_tiranossauro_alfa.webp"
  },
  {
    "id": "green_68_zaratan_ilha",
    "name": "Chelonia, A Tartaruga-Continente",
    "domain": "green",
    "type": "creature",
    "subtype": "Elemental • Titã",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 3,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a todos os seus aliados."
      }
    ],
    "description": "Guardião. Armadura 3, Regeneração 2. Ao Entrar: Cura 4 no seu Soberano e concede +1/+2 a todos os aliados.",
    "flavorText": "Marinheiros acamparam em seu casco por semanas achando que haviam descoberto uma nova ilha.",
    "imagePath": "/assets/cards/green_68_zaratan_ilha.webp"
  },
  {
    "id": "green_69_chamado_selva",
    "name": "Comunhão com a Fera Interior",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Druídico",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2/+2 a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Concede +2/+2 a um aliado e compra 1 carta.",
    "flavorText": "Seus olhos tornam-se dourados como os do lobo, e seus punhos viram garras.",
    "imagePath": "/assets/cards/green_69_chamado_selva.webp"
  },
  {
    "id": "green_70_instinto_sobrevivencia",
    "name": "Rugido de Sobrevivência",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Instinto",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 3,
        "description": "Concede +2 ATQ e +3 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Armadilha Oculta: Concede +2/+3 a um aliado e cura 2 de VIDA no seu Soberano.",
    "flavorText": "A fera encurralada é sempre a mais perigosa da floresta.",
    "imagePath": "/assets/cards/green_70_instinto_sobrevivencia.webp"
  },
  {
    "id": "green_71_pedra_terra",
    "name": "Monólito de Comando da Terra",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Monólito",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA em todos os seus aliados."
      }
    ],
    "description": "Ao Entrar: Dá +1/+2 a um aliado. Início do Turno: Cura 2 de VIDA em todos os aliados.",
    "flavorText": "A própria rocha sob seus pés fecha as feridas dos filhos da selva.",
    "imagePath": "/assets/cards/green_71_pedra_terra.webp"
  },
  {
    "id": "green_72_cajado_floresta",
    "name": "Báculo da Árvore-Mãe",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Cajado Druídico",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os seus aliados."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência adicional."
      }
    ],
    "description": "Ao Entrar: Dá +1/+1 a todos os aliados. Início do Turno: Gera +1⚡ de Essência.",
    "flavorText": "Cortado do galho mais alto da primeira árvore que viu o sol nascer.",
    "imagePath": "/assets/cards/green_72_cajado_floresta.webp"
  },
  {
    "id": "gold_55_cao_guarda_real",
    "name": "Mastim Couraçado da Cidadela",
    "domain": "gold",
    "type": "creature",
    "subtype": "Fera • Guardião",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Protege a linha de frente desde o primeiro turno.",
    "flavorText": "Treinado desde filhote para não recuar nem diante de um gigante.",
    "imagePath": "/assets/cards/gold_55_cao_guarda_real.webp"
  },
  {
    "id": "gold_56_lanceiro_falange",
    "name": "Alabardeiro da Falange Dourada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Soldado",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Centurião Imortal da Aurora",
      "newAtk": 4,
      "newArmor": 2,
      "newMaxHp": 6,
      "addedKeywords": [
        "Guardião",
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Concede +1/+1 a um aliado. Ascensão (4⚡): Centurião Imortal.",
    "flavorText": "Escudo com escudo, lança com lança: a falange é uma muralha que caminha.",
    "imagePath": "/assets/cards/gold_56_lanceiro_falange.webp"
  },
  {
    "id": "gold_57_besteiro_imperial",
    "name": "Besteiro de Cerco Real",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Atirador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano a uma unidade inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Alcance. Ao Entrar: Causa 1 de dano a uma unidade inimiga. Ao Entrar: Compra 1 carta.",
    "flavorText": "A catraca de aço estala, e a armadura do inimigo deixa de importar.",
    "imagePath": "/assets/cards/gold_57_besteiro_imperial.webp"
  },
  {
    "id": "gold_58_sacerdote_luz",
    "name": "Clérigo da Aurora Radiante",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Clérigo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "ascension": {
      "cost": 4,
      "newName": "Sumo Pontífice Solar",
      "newAtk": 4,
      "newArmor": 2,
      "newMaxHp": 7,
      "addedKeywords": [
        "Escudo Divino",
        "Alcance"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Cura 3 de VIDA no seu Soberano. Ascensão (4⚡): Sumo Pontífice Solar (4/2/7, Escudo Divino, Alcance).",
    "flavorText": "Onde a luz da alvorada toca, nenhuma maldição consegue criar raízes.",
    "imagePath": "/assets/cards/gold_58_sacerdote_luz.webp"
  },
  {
    "id": "gold_59_cavaleiro_grifo",
    "name": "Ginete de Grifo da Cidadela",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Cavaleiro Alado",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo"
    ],
    "effects": [],
    "description": "Voo. Domina os céus com armadura pesada e lança de justa.",
    "flavorText": "Acima das torres de mármore, a cavalaria alada vigia o horizonte.",
    "imagePath": "/assets/cards/gold_59_cavaleiro_grifo.webp"
  },
  {
    "id": "gold_60_golem_bronze",
    "name": "Colosso de Bronze de Batalha",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Guardião",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Sua blindagem de 2🛡️ reduz drasticamente o dano físico.",
    "flavorText": "Movido por engrenagens sagradas que não conhecem fadiga nem medo.",
    "imagePath": "/assets/cards/gold_60_golem_bronze.webp"
  },
  {
    "id": "gold_61_arconte_justica",
    "name": "Arconte da Lança Celestial",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Celestial • Anjo",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_target_ally",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA em um aliado."
      }
    ],
    "description": "Voo, Escudo Divino. Ao Entrar: Cura 3 de VIDA em um aliado.",
    "flavorText": "Suas asas trazem alívio aos justos e ruína aos profanadores.",
    "imagePath": "/assets/cards/gold_61_arconte_justica.webp"
  },
  {
    "id": "gold_62_gigante_pedra_rei",
    "name": "Thane das Colunas de Mármore",
    "domain": "gold",
    "type": "creature",
    "subtype": "Gigante • Guardião",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "effects": [],
    "description": "Guardião, Alcance. Arremessa pilares de mármore e bloqueia investidas.",
    "flavorText": "Para ele, as muralhas do castelo são apenas blocos de montar.",
    "imagePath": "/assets/cards/gold_62_gigante_pedra_rei.webp"
  },
  {
    "id": "gold_63_esfinge_dourada",
    "name": "Esfinge Guardiã do Templo Dourado",
    "domain": "gold",
    "type": "creature",
    "subtype": "Monstruosidade • Celestial",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Seu rugido sagrado concede +1/+2 a todos os seus aliados."
      }
    ],
    "description": "Voo, Guardião. Ao Entrar: Concede +1/+2 a todos os seus aliados.",
    "flavorText": "Sob suas asas de ouro branco, os covardes recuam e os justos se erguem renovados.",
    "imagePath": "/assets/cards/gold_63_esfinge_dourada.webp"
  },
  {
    "id": "gold_64_rei_hekton",
    "name": "Hekaton, Monarca do Trono do Trovão",
    "domain": "gold",
    "type": "creature",
    "subtype": "Gigante • Monarca",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Julgamento do Trono causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Guardião. Ao Entrar: Causa 3 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "Acima de todos os clãs gigantes, sua palavra tem o peso do próprio firmamento.",
    "imagePath": "/assets/cards/gold_64_rei_hekton.webp"
  },
  {
    "id": "gold_65_emperion_solar",
    "name": "Aurelion, O Titã Empíreo",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Titã",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Glória Empírea concede +2/+2 a todos os seus aliados."
      }
    ],
    "description": "Escudo Divino, Guardião. Ao Entrar: Concede +2/+2 a todos os seus aliados.",
    "flavorText": "Quando ele pisa na terra mortal, as nuvens se abrem em ouro líquido.",
    "imagePath": "/assets/cards/gold_65_emperion_solar.webp"
  },
  {
    "id": "gold_66_bencao_escudo",
    "name": "Égide da Fé Inabalável",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Abjuração",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 3,
        "description": "Concede +1 ATQ e +3 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Concede +1/+3 a um aliado e cura 2 de VIDA no seu Soberano.",
    "flavorText": "Um escudo invisível de luz dourada intercepta cada flecha.",
    "imagePath": "/assets/cards/gold_66_bencao_escudo.webp"
  },
  {
    "id": "gold_67_julgamento_solar",
    "name": "Lança de Luz Purificadora",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Evocação Sagrada",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano radiante a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Causa 4 de dano a um inimigo e cura 2 de VIDA no seu Soberano.",
    "flavorText": "A luz que queima o corrupto é a mesma que consola o fiel.",
    "imagePath": "/assets/cards/gold_67_julgamento_solar.webp"
  },
  {
    "id": "gold_68_decreto_protecao",
    "name": "Bastião de Invulnerabilidade",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1/+2 a todos os seus aliados."
      }
    ],
    "description": "Armadilha Oculta: Quando ativada, concede +1/+2 a todos os seus aliados.",
    "flavorText": "Nenhuma linha da Cidadela jamais se rompeu sob este estandarte.",
    "imagePath": "/assets/cards/gold_68_decreto_protecao.webp"
  },
  {
    "id": "gold_69_espada_vingadora",
    "name": "Vingadora Sagrada da Ordem",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Arma Sagrada",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Invoca uma Sentinela de Ferro (2/2) na Vanguarda."
      }
    ],
    "description": "Ao Entrar: +1/+1 a um aliado e invoca Sentinela (2/2). Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Apenas aqueles de juramento imaculado conseguem erguer seu punho de platina.",
    "imagePath": "/assets/cards/gold_69_espada_vingadora.webp"
  },
  {
    "id": "gold_70_maca_ruptura",
    "name": "Maça Solar da Ruptura",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Arma Sagrada",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano radiante a um inimigo."
      },
      {
        "trigger": "turn_end",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Fim do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano a um inimigo. Fim do Turno: Cura 2 no seu Soberano.",
    "flavorText": "Sua cabeça em forma de sol desfaz mortos-vivos em poeira luminosa.",
    "imagePath": "/assets/cards/gold_70_maca_ruptura.webp"
  },
  {
    "id": "gold_71_elmo_brilho",
    "name": "Coroa de Brilho Prismático",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Regalia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os seus aliados."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Início do Turno: Feixes solares causam 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Ao Entrar: Dá +1/+1 aos aliados. Início do Turno: Causa 1 de dano à Vanguarda rival.",
    "flavorText": "Trinta gemas solares brilham na fronte do rei, cegando os exércitos inimigos.",
    "imagePath": "/assets/cards/gold_71_elmo_brilho.webp"
  },
  {
    "id": "gold_72_talisma_bem",
    "name": "Talismã do Zênite Puro",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Artefato Sagrado",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Ao Entrar: Julgamento do Zênite causa 4 de dano a um inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 3,
        "secondaryValue": 4,
        "description": "Ao Entrar: Invoca uma Sentinela de Ferro (3/4) na Vanguarda."
      }
    ],
    "description": "Ao Entrar: Causa 4 a um inimigo e invoca Sentinela (3/4). Início do Turno: Dá +1/+1 a todos os aliados.",
    "flavorText": "Uma gota do primeiro sol solidificada em ouro eterno.",
    "imagePath": "/assets/cards/gold_72_talisma_bem.webp"
  },
  {
    "id": "neutral_31_automato_explorado",
    "name": "Batedor Mecânico de Corda",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Batedor",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Blindagem leve (2/1/2). Ao Entrar: Compra 1 carta.",
    "flavorText": "Tique-taque, tique-taque: ele mapeia as armadilhas antes que a infantaria avance.",
    "imagePath": "/assets/cards/neutral_31_automato_explorado.webp"
  },
  {
    "id": "neutral_32_cacador_recompensas",
    "name": "Balisteiro Mercenário",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humanoide • Mercenário",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [],
    "description": "Alcance. Ataca qualquer fileira inimiga sem sofrer contra-ataque.",
    "flavorText": "Não importa a cor do seu estandarte, desde que o ouro seja verdadeiro.",
    "imagePath": "/assets/cards/neutral_32_cacador_recompensas.webp"
  },
  {
    "id": "neutral_33_gargula_runica",
    "name": "Sentinela de Alabastro",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Guardião",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião"
    ],
    "effects": [],
    "description": "Voo, Guardião. Protege a Vanguarda com asas de pedra rúnica.",
    "flavorText": "Passou trezentos anos imóvel no telhado da catedral até que o pacto foi quebrado.",
    "imagePath": "/assets/cards/neutral_33_gargula_runica.webp"
  },
  {
    "id": "neutral_34_cavaleiro_planar",
    "name": "Cavaleiro do Horizonte Estelar",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Criatura • Astral • Guerreiro",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1 de Essência adicional."
      }
    ],
    "description": "Escudo Divino. Ao Entrar: Gera +1⚡ de Essência adicional.",
    "flavorText": "Ele caminha entre os mundos como quem atravessa uma ponte de prata.",
    "imagePath": "/assets/cards/neutral_34_cavaleiro_planar.webp"
  },
  {
    "id": "neutral_35_colosso_adamantina",
    "name": "Titã Forjado em Adamantina",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Titã",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 0,
    "atk": 7,
    "armor": 3,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os seus aliados."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 3 (7/3/8). Ao Entrar: Concede Escudo Divino a todos os seus aliados.",
    "flavorText": "Forjado a partir do núcleo de uma estrela caída; nenhuma lâmina mortal o arranha.",
    "imagePath": "/assets/cards/neutral_35_colosso_adamantina.webp"
  },
  {
    "id": "neutral_36_pulso_etereo",
    "name": "Canalização do Vórtex Planar",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Éter",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência adicional."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Gera +1⚡ de Essência adicional e compra 1 carta.",
    "flavorText": "O éter bruto assume a cor da vontade de quem o invoca.",
    "imagePath": "/assets/cards/neutral_36_pulso_etereo.webp"
  },
  {
    "id": "neutral_37_bolsa_conjurar",
    "name": "Alforje Astral de Maravilhas",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Item Maravilhoso",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Invoca um Constructo Etéreo (1/2)."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência adicional."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta e invoca Constructo (1/2). Início do Turno: Gera +1⚡ de Essência.",
    "flavorText": "Pesa meio quilo por fora, mas guarda o arsenal de um exército por dentro.",
    "imagePath": "/assets/cards/neutral_37_bolsa_conjurar.webp"
  },
  {
    "id": "neutral_38_anel_estrelas",
    "name": "Anel dos Cometas Cadentes",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Anel Mágico",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "turn_end",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Fim do Turno: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano a um inimigo. Fim do Turno: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Cravejado com meteoritos que nunca deixaram de queimar.",
    "imagePath": "/assets/cards/neutral_38_anel_estrelas.webp"
  },
  {
    "id": "neutral_39_cubo_forca",
    "name": "Monólito da Barreira Rúnica",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Artefato",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 3,
        "description": "Ao Entrar: Invoca um Constructo Etéreo (2/3)."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA em todos os seus aliados."
      }
    ],
    "description": "Ao Entrar: Invoca Constructo (2/3) e cura 3 no Soberano. Início do Turno: Cura 2 em todos os aliados.",
    "flavorText": "Seis faces de marfim e ouro: cada face ergue uma muralha impenetrável.",
    "imagePath": "/assets/cards/neutral_39_cubo_forca.webp"
  },
  {
    "id": "neutral_40_cajado_magi",
    "name": "Cajado Supremo do Arquimago",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Cajado Lendário",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Pulso arcano causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Lançar Feitiço: Causa 2 de dano a um inimigo."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Lançar Feitiço: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Compra 2 cartas e causa 2 à Vanguarda rival. Ao Lançar Feitiço: Causa 2 a um inimigo e 2 ao Soberano rival.",
    "flavorText": "O ápice da arte arcana, capaz de dobrar todas as escolas de magia.",
    "imagePath": "/assets/cards/neutral_40_cajado_magi.webp"
  },
  {
    "id": "blue_73_novico_ampulheta",
    "name": "Iniciado do Relógio Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Cronomante",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Ao Entrar: Gera +1⚡ de Essência extra neste turno.",
    "flavorText": "A primeira lição da Ordem é roubar um segundo do amanhã para usar hoje.",
    "imagePath": "/assets/cards/blue_73_novico_ampulheta.webp"
  },
  {
    "id": "blue_74_tecelao_segundos",
    "name": "Cronomante do Fluxo Breve",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Cronomante",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Mestre da Era Contínua",
      "newAtk": 5,
      "newArmor": 0,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "on_attack",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Atacar: Desacelera e Congela 1 inimigo."
      }
    ],
    "description": "Alcance. Ao Atacar: Congela 1 inimigo. Ascensão (4⚡): Mestre da Era Contínua (5/0/6, Alcance, Escudo Divino).",
    "flavorText": "Para ele, a flecha inimiga leva uma década inteira para atravessar a sala.",
    "imagePath": "/assets/cards/blue_74_tecelao_segundos.webp"
  },
  {
    "id": "blue_75_oraculo_zodiaco",
    "name": "Vidente das Doze Casas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Oráculo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Lê o zodíaco e compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta.",
    "flavorText": "Doze signos giram na roda celeste; cada um revela o próximo passo do inimigo.",
    "imagePath": "/assets/cards/blue_75_oraculo_zodiaco.webp"
  },
  {
    "id": "blue_76_anomalia_viva",
    "name": "Anomalia Temporal Desgarrada",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Paradoxo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo • Ímpeto. Ao Entrar: Compra 1 carta.",
    "flavorText": "Um eco de uma batalha que ainda acontecerá daqui a trezentos anos.",
    "imagePath": "/assets/cards/blue_76_anomalia_viva.webp"
  },
  {
    "id": "blue_77_viajante_eras",
    "name": "Andarilho da Era Arcana (-3351 C.V.)",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Cronomante",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Arquimago de -3351 C.V.",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Voo"
      ]
    },
    "effects": [
      {
        "trigger": "on_attack",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Atacar: Pesquisa ancestral compra 1 carta."
      }
    ],
    "description": "Alcance. Ao Atacar: Compra 1 carta. Ascensão (4⚡): Arquimago de -3351 C.V. (5/1/6, Alcance, Voo).",
    "flavorText": "Ele caminhou pelas bibliotecas da primeira era antes que afundassem no mar.",
    "imagePath": "/assets/cards/blue_77_viajante_eras.webp"
  },
  {
    "id": "blue_78_espectro_paradoxo",
    "name": "Caçador de Paradoxos",
    "domain": "blue",
    "type": "creature",
    "subtype": "Astral • Caçador",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Voo. Ao Entrar: Causa 2 de dano a um inimigo e o Congela.",
    "flavorText": "Ninguém escapa quando o caçador sabe onde você estará no próximo minuto.",
    "imagePath": "/assets/cards/blue_78_espectro_paradoxo.webp"
  },
  {
    "id": "blue_79_semblante_atemporal",
    "name": "Miragem do Relógio Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Ilusão • Cronomante",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Escudo Divino",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a um aliado."
      }
    ],
    "description": "Escudo Divino, Alcance. Ao Entrar: Concede +2/+2 a um aliado.",
    "flavorText": "O eu do passado e o eu do futuro lutam lado a lado no mesmo segundo.",
    "imagePath": "/assets/cards/blue_79_semblante_atemporal.webp"
  },
  {
    "id": "blue_80_senhor_tempo",
    "name": "Thaddeus, Senhor do Tempo",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Senhor do Tempo",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Escudo Divino",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Para o tempo congelando toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      }
    ],
    "description": "Escudo Divino, Alcance. Ao Entrar: Congela a Vanguarda inimiga e compra 2 cartas.",
    "flavorText": "Passado, presente e futuro são apenas páginas abertas sobre a minha mesa.",
    "imagePath": "/assets/cards/blue_80_senhor_tempo.webp"
  },
  {
    "id": "blue_81_arconte_cronos",
    "name": "Chronos, Guardião do Eixo Eterno",
    "domain": "blue",
    "type": "creature",
    "subtype": "Primordial • Titã do Tempo",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Início do Turno: Rebobina ferimentos curando 2 de VIDA em todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta."
      }
    ],
    "description": "Voo, Guardião. Sopro Temporal 3. Início do Turno: Cura 2 em todos os aliados e compra 1 carta.",
    "flavorText": "Antes que os deuses acendessem a primeira estrela, o pêndulo dele já batia.",
    "imagePath": "/assets/cards/blue_81_arconte_cronos.webp"
  },
  {
    "id": "blue_82_raio_era",
    "name": "Raio de Era Contínua",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano temporal a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela o inimigo."
      }
    ],
    "description": "Causa 2 de dano a um inimigo e o Congela.",
    "flavorText": "Um feixe de luz azul que rouba o impulso cinético do alvo.",
    "imagePath": "/assets/cards/blue_82_raio_era.webp"
  },
  {
    "id": "blue_83_reverter_feridas",
    "name": "Retroceder o Pêndulo",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Rebobina o tempo curando 4 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Cura 4 de VIDA no seu Soberano e compra 1 carta.",
    "flavorText": "O sangue volta às veias e o aço partido se recompõe como se o golpe jamais tivesse ocorrido.",
    "imagePath": "/assets/cards/blue_83_reverter_feridas.webp"
  },
  {
    "id": "blue_84_esfera_tempo",
    "name": "Esfera de Distorção Temporal",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      }
    ],
    "description": "Causa 3 de dano à Vanguarda inimiga e Congela 1 inimigo.",
    "flavorText": "Dentro da esfera, cada segundo dura uma hora de pressão esmagadora.",
    "imagePath": "/assets/cards/blue_84_esfera_tempo.webp"
  },
  {
    "id": "blue_85_bomba_tempo",
    "name": "Bomba Explosiva de Atraso Temporal",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 4 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Causa 4 de dano à Vanguarda inimiga e 3 de dano ao Soberano rival.",
    "flavorText": "Tique... taque... quando o ponteiro chega ao doze, o próprio espaço se estilhaça.",
    "imagePath": "/assets/cards/blue_85_bomba_tempo.webp"
  },
  {
    "id": "blue_86_mudanca_quantica",
    "name": "Deslocamento do Paradoxo",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2/+2 a todos os seus aliados."
      }
    ],
    "description": "Causa 4 de dano a um inimigo, Congela a Vanguarda rival e concede +2/+2 a todos os seus aliados.",
    "flavorText": "Saltamos para a linha do tempo onde a vitória já nos pertence.",
    "imagePath": "/assets/cards/blue_86_mudanca_quantica.webp"
  },
  {
    "id": "blue_87_desacelerar_golpe",
    "name": "Desacelerar o Impacto",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Cronomancia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela o atacante inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Armadilha Oculta: Congela o atacante inimigo e cura 3 de VIDA no seu Soberano.",
    "flavorText": "A espada desce tão devagar que o mago tem tempo de dar um passo para o lado.",
    "imagePath": "/assets/cards/blue_87_desacelerar_golpe.webp"
  },
  {
    "id": "blue_88_restabelecer_linha",
    "name": "Restabelecer Linha do Tempo",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Cronomancia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 4,
        "description": "Concede +2 ATQ e +4 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Armadilha Oculta: Concede +2/+4 a um aliado e compra 1 carta.",
    "flavorText": "Não aceito este desfecho; vamos tentar este segundo mais uma vez.",
    "imagePath": "/assets/cards/blue_88_restabelecer_linha.webp"
  },
  {
    "id": "blue_89_roda_tempo",
    "name": "Astrolábio das Eras Eternas",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Horologia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Invoca um Elemental de Geada (2/2)."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência adicional."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta e invoca Elemental (2/2). Início do Turno: Gera +1⚡ de Essência.",
    "flavorText": "Acelerar os aliados, desacelerar os inimigos: tudo gira em torno do eixo eterno.",
    "imagePath": "/assets/cards/blue_89_roda_tempo.webp"
  },
  {
    "id": "blue_90_orbe_quebrada",
    "name": "Orbe do Tempo Fragmentada",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Fragmento Temporal",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Onda de choque temporal causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Lançar Feitiço: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano à Vanguarda rival. Ao Lançar Feitiço: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Quando a orbe se partiu, os fragmentos espalharam-se por todas as eras da criação.",
    "imagePath": "/assets/cards/blue_90_orbe_quebrada.webp"
  },
  {
    "id": "gold_73_aprendiz_relojoeiro",
    "name": "Artífice de Rodas Dentadas",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Horologista",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Ao Entrar: Ajusta as engrenagens curando 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Blindagem leve (2/1/2). Ao Entrar: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Uma mola bem ajustada vale mais que um encantamento mal pronunciado.",
    "imagePath": "/assets/cards/gold_73_aprendiz_relojoeiro.webp"
  },
  {
    "id": "gold_74_guerreiro_horologista",
    "name": "Guerreiro Horologista (253 C.V.)",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Horologista",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [],
    "ascension": {
      "cost": 4,
      "newName": "Mestre da Lâmina Temporal",
      "newAtk": 5,
      "newArmor": 2,
      "newMaxHp": 6,
      "addedKeywords": [
        "Guardião",
        "Escudo Divino"
      ]
    },
    "effects": [],
    "description": "Guerreiro de 253 C.V. (3/1/3). Ascensão (4⚡): Mestre da Lâmina Temporal (5/2/6, Guardião, Escudo Divino).",
    "flavorText": "Na era de 253 C.V., os espadachins aprenderam a golpear entre dois batimentos cardíacos.",
    "imagePath": "/assets/cards/gold_74_guerreiro_horologista.webp"
  },
  {
    "id": "gold_75_atirador_1877",
    "name": "Mosqueteiro Temporal (1877 C.V.)",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Balístico",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [],
    "description": "Alcance. Dispara projéteis balísticos rúnicos a partir da Retaguarda.",
    "flavorText": "Trouxe da era de 1877 C.V. uma invenção que torna escudos medievais obsoletos.",
    "imagePath": "/assets/cards/gold_75_atirador_1877.webp"
  },
  {
    "id": "gold_76_monge_relogio",
    "name": "Punho do Relógio de Mão",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Monge",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião, Escudo Divino. Ao Entrar: Cura 2 de VIDA do seu Soberano.",
    "flavorText": "Seu pulso gira como um pêndulo; nenhum golpe o encontra onde ele estava.",
    "imagePath": "/assets/cards/gold_76_monge_relogio.webp"
  },
  {
    "id": "gold_77_franco_atirador_fenda",
    "name": "Atirador de Fenda Temporal",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Balístico",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Executor de Fogo Rápido",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Bala ricocheteia no tempo causando 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Alcance. Ao Atacar: Causa 1 ao Soberano rival. Ascensão (4⚡): Executor de Fogo Rápido (6/1/6, Alcance, Escudo Divino).",
    "flavorText": "A bala entra em uma fenda diante do cano e sai atrás do escudo do general.",
    "imagePath": "/assets/cards/gold_77_franco_atirador_fenda.webp"
  },
  {
    "id": "gold_78_cavaleiro_ambrosia",
    "name": "Templário da Muralha de Ambrosia",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Paladino",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Blindagem dupla de Ambrosia (4/2/4).",
    "flavorText": "As muralhas de Ambrosia resistiram a quatrocentos anos de cerco sem ceder uma polegada.",
    "imagePath": "/assets/cards/gold_78_cavaleiro_ambrosia.webp"
  },
  {
    "id": "gold_79_automato_aeternus",
    "name": "Colosso Mecânico do Zênite",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Horológico",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a um aliado."
      }
    ],
    "description": "Guardião (4/2/5). Ao Entrar: Concede +1/+2 a um aliado.",
    "flavorText": "Sua corda foi dada no dia da fundação do império e jamais parou de girar.",
    "imagePath": "/assets/cards/gold_79_automato_aeternus.webp"
  },
  {
    "id": "gold_80_paladino_destino",
    "name": "Justicar da Aurora Eterna",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Paladino",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Escudo Divino. Ao Entrar: Cura 4 de VIDA no seu Soberano.",
    "flavorText": "Quando a ampulheta do rei está prestes a esvaziar, o Justicar a vira novamente.",
    "imagePath": "/assets/cards/gold_80_paladino_destino.webp"
  },
  {
    "id": "gold_81_colosso_engrenagem",
    "name": "Titã do Pêndulo Dourado",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Inevitável",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Atacar: Badalada do juízo causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Guardião (6/2/6). Ao Atacar: Causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Ninguém foge da hora marcada.",
    "imagePath": "/assets/cards/gold_81_colosso_engrenagem.webp"
  },
  {
    "id": "gold_82_arcanjo_cronos",
    "name": "Serafim da Décima Segunda Hora",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Arcanjo",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a todos os seus aliados."
      }
    ],
    "description": "Voo, Escudo Divino. Ao Entrar: Concede +1/+2 a todos os seus aliados.",
    "flavorText": "Quando o relógio da catedral bate meia-noite, suas seis asas iluminam o céu.",
    "imagePath": "/assets/cards/gold_82_arcanjo_cronos.webp"
  },
  {
    "id": "gold_83_forjado_ancestral",
    "name": "Aeternus, O Primeiro Forjado de Guerra",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Comandante",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os seus aliados."
      }
    ],
    "description": "Guardião, Escudo Divino. Ao Entrar: Causa 3 de dano à Vanguarda rival e concede +2/+2 aos aliados.",
    "flavorText": "Quatro séculos de guerra passaram por sua armadura, e ele permaneceu de pé.",
    "imagePath": "/assets/cards/gold_83_forjado_ancestral.webp"
  },
  {
    "id": "gold_84_tiro_perdicao",
    "name": "Disparo do Julgamento Solar",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Balístico",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 a um aliado."
      }
    ],
    "description": "Causa 4 de dano a um inimigo e concede +1/+1 a um aliado.",
    "flavorText": "Um projétil gravado com o nome do alvo e o minuto exato de sua queda.",
    "imagePath": "/assets/cards/gold_84_tiro_perdicao.webp"
  },
  {
    "id": "gold_85_acelerar_falange",
    "name": "Acelerar a Falange",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2/+2 a todos os seus aliados."
      }
    ],
    "description": "Concede +2/+2 a todos os seus aliados.",
    "flavorText": "Enquanto o inimigo ergue o escudo, a falange dourada já golpeou três vezes.",
    "imagePath": "/assets/cards/gold_85_acelerar_falange.webp"
  },
  {
    "id": "gold_86_reacao_dividida",
    "name": "Reflexo da Guarda Dourada",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Horologia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1/+2 a um aliado."
      }
    ],
    "description": "Armadilha Oculta: Causa 3 de dano ao atacante inimigo e concede +1/+2 a um aliado.",
    "flavorText": "Dividir um segundo ao meio é tudo o que um duelista precisa para contra-atacar.",
    "imagePath": "/assets/cards/gold_86_reacao_dividida.webp"
  },
  {
    "id": "gold_87_relogio_bolso_real",
    "name": "Cronômetro Dourado de Bolso",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Horologia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta e concede Escudo Divino aos aliados. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Forjado em ouro real, suas engrenagens marcam o compasso da vitória.",
    "imagePath": "/assets/cards/gold_87_relogio_bolso_real.webp"
  },
  {
    "id": "gold_88_forja_1877",
    "name": "Arsenal Balístico de 1877 C.V.",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Artilharia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Disparo de canhão causa 3 de dano a um inimigo."
      },
      {
        "trigger": "turn_end",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Fim do Turno: Bombardeio causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano a um inimigo. Fim do Turno: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Canhões de bronze movidos a vapor e runas de precisão.",
    "imagePath": "/assets/cards/gold_88_forja_1877.webp"
  },
  {
    "id": "gold_89_pendulo_justica",
    "name": "Pêndulo Inflexível de Ambrosia",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Monumento",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 3,
        "description": "Ao Entrar: Invoca uma Sentinela de Ferro (2/3)."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Congela 1 inimigo e invoca Sentinela (2/3). Início do Turno: Cura 2 no Soberano.",
    "flavorText": "No centro da praça de Ambrosia, o grande pêndulo julga o tempo de todos.",
    "imagePath": "/assets/cards/gold_89_pendulo_justica.webp"
  },
  {
    "id": "gold_90_trono_horas",
    "name": "Santuário do Relógio da Eternidade",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Santuário Lendário",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1⚡ de Essência."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA em todos os aliados."
      }
    ],
    "description": "Ao Entrar: Dá +1/+2 aos aliados. Início do Turno: Gera +1⚡ e cura 2 nos aliados.",
    "flavorText": "Enquanto os ponteiros dourados girarem neste altar, nosso exército será eterno.",
    "imagePath": "/assets/cards/gold_90_trono_horas.webp"
  },
  {
    "id": "purple_73_espectro_ampulheta",
    "name": "Sombra das Horas Mortas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Sombra",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Dreno de Vida. Rouba os anos restantes da vítima a cada golpe.",
    "flavorText": "Cada grão de areia negra que cai de suas mãos é um batimento cardíaco a menos.",
    "imagePath": "/assets/cards/purple_73_espectro_ampulheta.webp"
  },
  {
    "id": "purple_74_ceifador_osseo",
    "name": "Duelista da Espada Óssea",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Duelista",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Lorde da Lâmina de Marfim",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 5,
      "addedKeywords": [
        "Toque Letal",
        "Dreno de Vida"
      ]
    },
    "effects": [],
    "description": "Toque Letal. Ascensão (4⚡): Lorde da Lâmina de Marfim (5/1/5, Toque Letal, Dreno de Vida).",
    "flavorText": "Uma lâmina esculpida em osso antigo que corta tanto a carne quanto o tempo.",
    "imagePath": "/assets/cards/purple_74_ceifador_osseo.webp"
  },
  {
    "id": "purple_75_vidente_pesadelos",
    "name": "Mártir das Mil Mortes",
    "domain": "purple",
    "type": "creature",
    "subtype": "Humanoide • Maldito",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Renascer"
    ],
    "effects": [],
    "description": "Renascer. Já viu a própria morte tantas vezes que aprendeu a voltar dela.",
    "flavorText": "Esta é a morte número novecentos e oitenta e três. Ainda não é a última.",
    "imagePath": "/assets/cards/purple_75_vidente_pesadelos.webp"
  },
  {
    "id": "purple_76_arauto_enigma",
    "name": "Canalizador do Enigma Alienígena",
    "domain": "purple",
    "type": "creature",
    "subtype": "Aberração • Bruxo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Sussurro do Enigma causa 2 de dano a um inimigo."
      }
    ],
    "description": "Alcance. Ao Entrar: Causa 2 de dano a um inimigo.",
    "flavorText": "Ele fez uma pergunta ao Vazio, e a resposta quebrou a mente de seus inimigos.",
    "imagePath": "/assets/cards/purple_76_arauto_enigma.webp"
  },
  {
    "id": "purple_77_devorador_anos",
    "name": "Ladrão de Juventude",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Entropia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Arconte da Decrepitude",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Dreno de Vida",
        "Voo"
      ]
    },
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Drena 1 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Dreno de Vida. Ao Atacar: Causa 1 ao Soberano rival. Ascensão (4⚡): Arconte da Decrepitude (6/1/6, Voo).",
    "flavorText": "Jovens guerreiros entram em sua sombra; velhos de cabelos brancos caem de joelhos.",
    "imagePath": "/assets/cards/purple_77_devorador_anos.webp"
  },
  {
    "id": "purple_78_espreitador_fenda",
    "name": "Aberração do Entre-Eras",
    "domain": "purple",
    "type": "creature",
    "subtype": "Aberração • Vazio",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo"
    ],
    "effects": [],
    "description": "Voo. Desliza pelas fendas entre os segundos para emboscar pelo alto.",
    "flavorText": "Ele vive nos lugares onde os relógios param de funcionar.",
    "imagePath": "/assets/cards/purple_78_espreitador_fenda.webp"
  },
  {
    "id": "purple_79_assassino_lamento",
    "name": "Ceifador da Adaga Chorosa",
    "domain": "purple",
    "type": "creature",
    "subtype": "Humanoide • Assassino",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Ímpeto, Toque Letal. Ataca no mesmo turno com veneno de entropia letal.",
    "flavorText": "A ferida não sangra: ela apenas apaga a existência de quem foi tocado.",
    "imagePath": "/assets/cards/purple_79_assassino_lamento.webp"
  },
  {
    "id": "purple_80_necromante_entropia",
    "name": "Lich da Entropia Temporal",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Lich",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Rebobina a morte reanimando 1 aliado da Cripta."
      }
    ],
    "description": "Alcance. Ao Entrar: Reanima 1 aliado da sua Cripta.",
    "flavorText": "A necromancia nada mais é do que cronomancia aplicada aos mortos.",
    "imagePath": "/assets/cards/purple_80_necromante_entropia.webp"
  },
  {
    "id": "purple_81_aberracao_relogio",
    "name": "Astrolábio Vivo do Eclipse",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Constructo • Horológico",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Olhar do relógio Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Congela 1 inimigo e causa 2 de dano ao Soberano rival.",
    "flavorText": "Cada badalada de seu pêndulo sombrio rouba um batimento do coração adversário.",
    "imagePath": "/assets/cards/purple_81_aberracao_relogio.webp"
  },
  {
    "id": "purple_82_senhor_malogro",
    "name": "Nihil-Vael, Devorador de Linhas do Tempo",
    "domain": "purple",
    "type": "creature",
    "subtype": "Dragão • Entropia",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Singularidade causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Dreno de Vida. Ao Entrar: Causa 3 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "Onde suas asas batem, séculos de história são engolidos pelo esquecimento.",
    "imagePath": "/assets/cards/purple_82_senhor_malogro.webp"
  },
  {
    "id": "purple_83_arquidemonio_tempo",
    "name": "Mephistar, O Demônio do Pacto Eterno",
    "domain": "purple",
    "type": "creature",
    "subtype": "Abissal • Arquidemônio",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima 1 aliado da Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cobra o pacto causando 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Voo, Dreno de Vida, Renascer. Ao Entrar: Reanima 1 aliado da Cripta e causa 3 de dano ao Soberano rival.",
    "flavorText": "Eu lhe dei cem anos de glória, mortal. O relógio acaba de bater a última badalada.",
    "imagePath": "/assets/cards/purple_83_arquidemonio_tempo.webp"
  },
  {
    "id": "purple_84_espada_ossea",
    "name": "Lâmina Forjada em Ossos",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 3,
        "secondaryValue": 2,
        "description": "Concede +3 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Concede +3/+2 a um aliado.",
    "flavorText": "O osso endurece sob a magia temporal até ficar mais afiado que o aço.",
    "imagePath": "/assets/cards/purple_84_espada_ossea.webp"
  },
  {
    "id": "purple_85_enigma_extraplanar",
    "name": "Enigma do Intelecto Abissal",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Psíquico",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano psíquico a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Paralisa (Congela) o inimigo."
      }
    ],
    "description": "Causa 3 de dano a um inimigo e o Congela.",
    "flavorText": "Uma visão de geometrias impossíveis que trava a mente do guerreiro.",
    "imagePath": "/assets/cards/purple_85_enigma_extraplanar.webp"
  },
  {
    "id": "purple_86_enervacao_temporal",
    "name": "Enervação de Força Vital",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano necrótico a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Causa 4 de dano a um inimigo e cura 3 de VIDA no seu Soberano.",
    "flavorText": "Um fio de escuridão liga o coração da vítima à mão do conjurador.",
    "imagePath": "/assets/cards/purple_86_enervacao_temporal.webp"
  },
  {
    "id": "purple_87_evaporacao_abi",
    "name": "Desintegração nas Sombras",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo Necrótico",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 4 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Causa 4 de dano a todos os inimigos na Vanguarda e cura 3 de VIDA no seu Soberano.",
    "flavorText": "Em um único segundo, séculos de seca caem sobre o exército inimigo.",
    "imagePath": "/assets/cards/purple_87_evaporacao_abi.webp"
  },
  {
    "id": "purple_88_punhal_lamentacao",
    "name": "Estocada do Lamento Eterno",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Sombra",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Armadilha Oculta: Causa 3 de dano ao atacante inimigo e 1 de dano ao Soberano rival.",
    "flavorText": "O lamento da lâmina ecoa antes mesmo que a ferida se abra.",
    "imagePath": "/assets/cards/purple_88_punhal_lamentacao.webp"
  },
  {
    "id": "purple_89_ampulheta_sangue",
    "name": "Ampulheta das Mil Mortes",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Ampulheta",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      },
      {
        "trigger": "turn_end",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Fim do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Causa 2 ao Soberano rival. Fim do Turno: Cura 2 no seu Soberano.",
    "flavorText": "Não é areia que escorre pelo gargalo de vidro, mas rubis de sangue vivo.",
    "imagePath": "/assets/cards/purple_89_ampulheta_sangue.webp"
  },
  {
    "id": "purple_90_recipiente_arcano",
    "name": "Recipiente de Almas Aprisionadas",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Filactério",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima 1 aliado da Cripta."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Início do Turno: Pulso anímico causa 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Ao Entrar: Reanima 1 aliado da Cripta. Início do Turno: Causa 1 de dano à Vanguarda rival.",
    "flavorText": "Dentro do cristal lapidado, a alma aguarda um novo corpo para habitar.",
    "imagePath": "/assets/cards/purple_90_recipiente_arcano.webp"
  },
  {
    "id": "red_73_fagulha_taquion",
    "name": "Elemental de Centelha de Táquion",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Táquion",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Atinge o inimigo antes que a luz de sua própria chama chegue.",
    "flavorText": "Uma faísca que viaja de trás para a frente no tempo.",
    "imagePath": "/assets/cards/red_73_fagulha_taquion.webp"
  },
  {
    "id": "red_74_corredor_brasas",
    "name": "Corredor do Relâmpago Rubro",
    "domain": "red",
    "type": "creature",
    "subtype": "Humanoide • Guerreiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Avatar do Tempo Duplo",
      "newAtk": 6,
      "newArmor": 0,
      "newMaxHp": 5,
      "addedKeywords": [
        "Ímpeto",
        "Fúria Crescente"
      ]
    },
    "effects": [],
    "description": "Ímpeto. Ascensão (4⚡): Avatar do Tempo Duplo (6/0/5, Ímpeto, Fúria Crescente).",
    "flavorText": "O atrito de sua corrida com o ar incendeia o chão por onde passa.",
    "imagePath": "/assets/cards/red_74_corredor_brasas.webp"
  },
  {
    "id": "red_75_kobold_cronobomba",
    "name": "Sabotador Escamado de Roda Dentada",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Réptil • Sabotador",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_death",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Último Suspiro: O relógio detona causando 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Último Suspiro: Causa 2 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "Ele não sabe ler as horas, mas sabe muito bem o que acontece quando o ponteiro para.",
    "imagePath": "/assets/cards/red_75_kobold_cronobomba.webp"
  },
  {
    "id": "red_76_salamandra_vapor",
    "name": "Serpente de Vapor Superaquecido",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Vapor",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Jato de vapor causa 1 de dano a um inimigo."
      }
    ],
    "description": "Alcance • Pele Incandescente. Armadura 1. Ao Entrar: Causa 1 de dano a um inimigo.",
    "flavorText": "O vapor sob pressão corta a carne e cozinha o guerreiro dentro da própria armadura.",
    "imagePath": "/assets/cards/red_76_salamandra_vapor.webp"
  },
  {
    "id": "red_77_piromante_fenda",
    "name": "Evocador da Fenda Ardente",
    "domain": "red",
    "type": "creature",
    "subtype": "Humanoide • Piromante",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Senhor da Rajada Violenta",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Pele Incandescente"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Alcance. Ao Entrar: Causa 2 ao Soberano rival. Ascensão (4⚡): Senhor da Rajada Violenta (5/1/6).",
    "flavorText": "Um fragmento quebrado da Orbe do Tempo queima como uma estrela em seu cajado.",
    "imagePath": "/assets/cards/red_77_piromante_fenda.webp"
  },
  {
    "id": "red_78_minotauro_forja",
    "name": "Minotauro de Chifres em Brasa",
    "domain": "red",
    "type": "creature",
    "subtype": "Monstruosidade • Minotauro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Ímpeto, Atropelar. Investe imediatamente atropelando a linha de frente.",
    "flavorText": "Nenhuma parede do labirinto fica de pé quando ele decide abrir um atalho.",
    "imagePath": "/assets/cards/red_78_minotauro_forja.webp"
  },
  {
    "id": "red_79_draco_meteoro",
    "name": "Draco de Impacto Meteórico",
    "domain": "red",
    "type": "creature",
    "subtype": "Dracônico • Alado",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Voo, Ímpeto, Atropelar. Armadura 1. Sopro 2: Cai do céu como um meteoro incendiando a fileira inimiga.",
    "flavorText": "Olhe para cima: aquela estrela cadente tem garras e dentes.",
    "imagePath": "/assets/cards/red_79_draco_meteoro.webp",
    "breathDamage": 2
  },
  {
    "id": "red_80_gigante_caldeira",
    "name": "Forjador Real de Surtur",
    "domain": "red",
    "type": "creature",
    "subtype": "Gigante • Forjador",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao Entrar: Tempera as armas concedendo +2/+1 a um aliado."
      }
    ],
    "description": "Guardião, Pele Incandescente. Ao Entrar: Concede +2/+1 a um aliado.",
    "flavorText": "Cada martelada em sua bigorna forja uma espada capaz de cortar montanhas.",
    "imagePath": "/assets/cards/red_80_gigante_caldeira.webp"
  },
  {
    "id": "red_81_efreeti_sultao",
    "name": "Sultão da Cidadela de Bronze",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Elemental • Soberano Ígneo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Cimitarra solar causa 3 de dano a um inimigo."
      }
    ],
    "description": "Voo. Ao Entrar: Causa 3 de dano a um inimigo.",
    "flavorText": "Seus salões de bronze flutuam sobre uma caldeira onde o fogo jamais dorme.",
    "imagePath": "/assets/cards/red_81_efreeti_sultao.webp"
  },
  {
    "id": "red_82_fenix_taquion",
    "name": "Ignis-Aeterna, A Fênix do Tempo Emprestado",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Fênix",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Renascer"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Onda de táquions causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Ímpeto, Renascer. Sopro 2. Ao Entrar: Causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Para uma ave que vive fora do tempo, a morte é apenas uma faísca entre dois voos.",
    "imagePath": "/assets/cards/red_82_fenix_taquion.webp"
  },
  {
    "id": "red_83_dragao_cataclismo",
    "name": "Pyraxis, Soberano da Ruína Solar",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Ancião",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Voo, Atropelar. Sopro 3. Ao Entrar: Causa 3 de dano ao Soberano rival.",
    "flavorText": "Onde seu coração batia, hoje arde uma estrela aprisionada em escamas rubras.",
    "imagePath": "/assets/cards/red_83_dragao_cataclismo.webp"
  },
  {
    "id": "red_84_meteoros_momentaneos",
    "name": "Chuva de Cometas Fugazes",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Causa 2 de dano a um inimigo e 2 de dano ao Soberano rival.",
    "flavorText": "Seis pequenos sóis orbitam os punhos do mago, prontos para serem disparados.",
    "imagePath": "/assets/cards/red_84_meteoros_momentaneos.webp"
  },
  {
    "id": "red_85_tempo_emprestado",
    "name": "Fúria da Ampulheta Rubra",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia Ígnea",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 3,
        "secondaryValue": 1,
        "description": "Concede +3 ATQ e +1 VIDA a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência neste turno."
      }
    ],
    "description": "Concede +3/+1 a um aliado e gera +1⚡ de Essência neste turno.",
    "flavorText": "Queime o amanhã inteiro para vencer a batalha de hoje.",
    "imagePath": "/assets/cards/red_85_tempo_emprestado.webp"
  },
  {
    "id": "red_86_destruicao_elemental",
    "name": "Colapso da Fornalha Elemental",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 4 de dano a todos os inimigos na Vanguarda."
      }
    ],
    "description": "Causa 4 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "O fogo primordial não distingue escudo de carne.",
    "imagePath": "/assets/cards/red_86_destruicao_elemental.webp"
  },
  {
    "id": "red_87_rajada_prismatica_fogo",
    "name": "Sobrecarga de Fragmento Quebrado",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 5,
        "description": "Causa 5 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Causa 5 de dano a um inimigo e 3 de dano ao Soberano rival.",
    "flavorText": "Quando o cristal se rompe por completo, libera a fúria acumulada de mil anos.",
    "imagePath": "/assets/cards/red_87_rajada_prismatica_fogo.webp"
  },
  {
    "id": "red_88_pulso_impacto_fogo",
    "name": "Onda de Choque Vulcânica",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Táquion",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante inimigo."
      }
    ],
    "description": "Armadilha Oculta: Causa 3 de dano ao atacante inimigo.",
    "flavorText": "Toda força aplicada retorna multiplicada em chamas.",
    "imagePath": "/assets/cards/red_88_pulso_impacto_fogo.webp"
  },
  {
    "id": "red_89_ponto_centelha",
    "name": "Centelha da Ignição Suprema",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Ignição",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2/+1 a todos os seus aliados."
      }
    ],
    "description": "Armadilha Oculta: Concede +2/+1 a todos os seus aliados.",
    "flavorText": "Basta uma única centelha no momento exato para incendiar o campo inteiro.",
    "imagePath": "/assets/cards/red_89_ponto_centelha.webp"
  },
  {
    "id": "red_90_nucleo_fragmento_rubro",
    "name": "Cristal de Táquion Incandescente",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Fragmento",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Causa 2 ao Soberano rival. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Vibra em uma frequência tão alta que o ar ao redor brilha em vermelho vivo.",
    "imagePath": "/assets/cards/red_90_nucleo_fragmento_rubro.webp"
  },
  {
    "id": "green_73_raptor_era_antiga",
    "name": "Velocirraptor da Fenda Pré-Histórica",
    "domain": "green",
    "type": "creature",
    "subtype": "Dinossauro • Predador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Salta da fenda temporal atacando imediatamente.",
    "flavorText": "Caçadores de três milhões de anos atrás que nunca perderam o instinto.",
    "imagePath": "/assets/cards/green_73_raptor_era_antiga.webp"
  },
  {
    "id": "green_74_coelho_branco_arauto",
    "name": "Lebre Astral do Tempo Perdido",
    "domain": "green",
    "type": "creature",
    "subtype": "Fada • Mensageiro",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1 de Essência extra neste turno."
      }
    ],
    "description": "Ao Entrar: Gera +1⚡ de Essência extra neste turno.",
    "flavorText": "Sempre apressada, ela abre atalhos entre as raízes do mundo.",
    "imagePath": "/assets/cards/green_74_coelho_branco_arauto.webp"
  },
  {
    "id": "green_75_druida_ciclos",
    "name": "Guardião das Quatro Estações",
    "domain": "green",
    "type": "creature",
    "subtype": "Elfo • Druida",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Arquidruida do Ciclo Eterno",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Guardião"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_attack",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Atacar: Cura 2 de VIDA no seu Soberano."
      }
    ],
    "description": "Alcance. Armadura 1, Regeneração 1. Ao Entrar: Cura 2 nos aliados. Ao Atacar: Cura 2 no Soberano. Ascensão (4⚡): Arquidruida do Ciclo Eterno (5/1/6, Guardião).",
    "flavorText": "Primavera, verão, outono e inverno giram na ponta de seu cajado.",
    "imagePath": "/assets/cards/green_75_druida_ciclos.webp",
    "regeneration": 1
  },
  {
    "id": "green_76_louva_deus_gigante",
    "name": "Louva-a-Deus Ceifador da Selva",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Inseto",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [],
    "description": "Toque Letal. Suas foices serrilhadas decepam qualquer armadura.",
    "flavorText": "Imóvel como um galho verde até o milésimo de segundo em que ataca.",
    "imagePath": "/assets/cards/green_76_louva_deus_gigante.webp"
  },
  {
    "id": "green_77_alossauro_cacador",
    "name": "Alossauro Alfa de -3351 C.V.",
    "domain": "green",
    "type": "creature",
    "subtype": "Dinossauro • Predador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Ímpeto, Atropelar. Corre em velocidade máxima e atropela defensores.",
    "flavorText": "Vindo da era mais selvagem do planeta, ele desconhece o medo.",
    "imagePath": "/assets/cards/green_77_alossauro_cacador.webp"
  },
  {
    "id": "green_78_quimera_silvestre",
    "name": "Fera-Espinho Mutante",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Silvestre",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Behemoth de Espinhos Venenosos",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Toque Letal"
      ]
    },
    "effects": [],
    "description": "Alcance. Ascensão (4⚡): Behemoth de Espinhos (6/1/6, Alcance, Toque Letal).",
    "flavorText": "Cada espinho de seu dorso carrega a seiva paralisante da selva profunda.",
    "imagePath": "/assets/cards/green_78_quimera_silvestre.webp"
  },
  {
    "id": "green_79_anquilossauro_ferro",
    "name": "Anquilossauro de Cauda-Clava",
    "domain": "green",
    "type": "creature",
    "subtype": "Dinossauro • Guardião",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Carapaça pré-histórica de 2🛡️ de Armadura.",
    "flavorText": "Uma fortaleza viva que caminha sobre quatro patas e derruba muralhas com a cauda.",
    "imagePath": "/assets/cards/green_79_anquilossauro_ferro.webp"
  },
  {
    "id": "green_80_cobra_constritora_rei",
    "name": "Jiboia Titânica do Pântano",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Serpente",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Enrola-se no alvo imobilizando (Congelando) 1 inimigo."
      }
    ],
    "description": "Regeneração 2. Ao Entrar: Imobiliza (Congela) 1 inimigo.",
    "flavorText": "Quando seus anéis se fecham, nem um gigante consegue respirar.",
    "imagePath": "/assets/cards/green_80_cobra_constritora_rei.webp"
  },
  {
    "id": "green_81_pteranodonte_tempestade",
    "name": "Quetzalcoatlus das Nuvens Antigas",
    "domain": "green",
    "type": "creature",
    "subtype": "Dinossauro • Alado",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Domina os céus primordiais com doze metros de envergadura.",
    "flavorText": "Sua sombra cobre a clareira inteira um segundo antes do mergulho.",
    "imagePath": "/assets/cards/green_81_pteranodonte_tempestade.webp"
  },
  {
    "id": "green_82_estegossauro_anciao",
    "name": "Estegossauro de Placas Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Dinossauro • Guardião",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Guardião, Regeneração 2. Suas placas dorsais brilham com energia vital.",
    "flavorText": "As quatro lanças em sua cauda mantêm até os tiranossauros à distância.",
    "imagePath": "/assets/cards/green_82_estegossauro_anciao.webp"
  },
  {
    "id": "green_83_troll_duas_cabecas",
    "name": "Troll Dire de Sangue Eterno",
    "domain": "green",
    "type": "creature",
    "subtype": "Gigante • Troll",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 6,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Regeneração 2, Fúria Crescente (+2 ATQ sempre que sobrevive a dano).",
    "flavorText": "Decepe um braço e dois outros crescerão ainda mais fortes no lugar.",
    "imagePath": "/assets/cards/green_83_troll_duas_cabecas.webp"
  },
  {
    "id": "green_84_brontossauro_colosso",
    "name": "Brontossauro Trovejante (-3351 C.V.)",
    "domain": "green",
    "type": "creature",
    "subtype": "Dinossauro • Titã",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a todos os seus aliados."
      }
    ],
    "description": "Guardião, Atropelar. Ao Entrar: Concede +1/+2 a todos os seus aliados.",
    "flavorText": "Mais alto que as torres de vigia, seu passo é o próprio trovão da terra.",
    "imagePath": "/assets/cards/green_84_brontossauro_colosso.webp"
  },
  {
    "id": "green_85_fenrir_primordial",
    "name": "Fenris-Vael, O Lobo do Fim das Eras",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Lendária",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Ímpeto, Atropelar, Fúria Crescente.",
    "flavorText": "Quando suas correntes se partirem, ele engolirá a própria roda das estações.",
    "imagePath": "/assets/cards/green_85_fenrir_primordial.webp"
  },
  {
    "id": "green_86_tarrasque_desperto",
    "name": "Kragmorth, O Devorador de Eras",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Titã • Primordial",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 9,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Titã primordial encouraçado de eras esquecidas que desperta das profundezas da terra para esmagar reinos inteiros.",
    "flavorText": "Ele dorme sob os continentes por milênios; quando desperta, uma era inteira chega ao fim.",
    "imagePath": "/assets/cards/green_86_tarrasque_desperto.webp"
  },
  {
    "id": "green_87_tempo_cura_feridas",
    "name": "Renovação das Quatro Estações",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Regeneração",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Cura 3 de VIDA em todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA no seu Soberano."
      }
    ],
    "description": "Cura 3 de VIDA em todos os seus aliados e 3 de VIDA no seu Soberano.",
    "flavorText": "Meses de cicatrização natural condensados em um único suspiro verdejante.",
    "imagePath": "/assets/cards/green_87_tempo_cura_feridas.webp"
  },
  {
    "id": "green_88_reencarnacao_ancestral",
    "name": "Reencarnação Primordial",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Ciclo Vital",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Reanima 1 aliado da sua Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1/+2 a todos os seus aliados."
      }
    ],
    "description": "Reanima 1 aliado da sua Cripta e concede +1/+2 a todos os seus aliados.",
    "flavorText": "O espírito nunca morre; ele apenas veste uma nova pele mais feroz.",
    "imagePath": "/assets/cards/green_88_reencarnacao_ancestral.webp"
  },
  {
    "id": "green_89_corpo_atemporal",
    "name": "Vitalidade da Seiva Eterna",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Vigor",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 3,
        "description": "Concede +2 ATQ e +3 VIDA a um aliado."
      }
    ],
    "description": "Armadilha Oculta: Concede +2/+3 a um aliado.",
    "flavorText": "Os séculos passam como vento pelas folhas, mas o tronco permanece inabalável.",
    "imagePath": "/assets/cards/green_89_corpo_atemporal.webp"
  },
  {
    "id": "green_90_relogio_solar_druida",
    "name": "Monólito do Solstício Eterno",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Relógio Solar",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Cura 3 no Soberano. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Alinhado com o sol do primeiro dia do mundo, sua sombra aponta o caminho da força.",
    "imagePath": "/assets/cards/green_90_relogio_solar_druida.webp"
  },
  {
    "id": "neutral_41_familiar_engrenagem",
    "name": "Coruja Mecânica de Bolso",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Familiar",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Ao Entrar: Cura 1 de VIDA no seu Soberano."
      }
    ],
    "description": "Voo. Ao Entrar: Cura 1 de VIDA no seu Soberano.",
    "flavorText": "Cabe na palma da mão e nunca atrasa um único segundo.",
    "imagePath": "/assets/cards/neutral_41_familiar_engrenagem.webp"
  },
  {
    "id": "neutral_42_cronista_eterno",
    "name": "Sábio da Linguística Eterna",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humanoide • Sábio",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Decifra os códices e compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta.",
    "flavorText": "Nenhuma inscrição é antiga demais para quem domina a Linguística Eterna.",
    "imagePath": "/assets/cards/neutral_42_cronista_eterno.webp"
  },
  {
    "id": "neutral_43_guardiao_fragmento",
    "name": "Sentinela do Fragmento do Tempo",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Sentinela",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Guardião, Escudo Divino. Protege a Vanguarda com blindagem temporal.",
    "flavorText": "Moldado em quartzo e prata para guardar os fragmentos através dos milênios.",
    "imagePath": "/assets/cards/neutral_43_guardiao_fragmento.webp"
  },
  {
    "id": "neutral_44_dragao_relogio",
    "name": "Draco Horológico de Aeternus",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Dragão • Constructo",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 0,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1 de Essência extra."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo, Guardião. Ao Entrar: Gera +1⚡ de Essência e compra 1 carta.",
    "flavorText": "Milhares de engrenagens de ouro e adamantina batem como um único coração dracônico.",
    "imagePath": "/assets/cards/neutral_44_dragao_relogio.webp"
  },
  {
    "id": "neutral_45_jogue_com_tempo",
    "name": "Jogar com os Dados do Destino",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Destino",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Compra 2 cartas e cura 2 de VIDA no seu Soberano.",
    "flavorText": "Quando você controla o tempo, os dados sempre caem na face escolhida.",
    "imagePath": "/assets/cards/neutral_45_jogue_com_tempo.webp"
  },
  {
    "id": "neutral_46_pausar_pensar",
    "name": "Pausar e Pensar um Segundo",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Cronomancia",
    "rarity": "uncommon",
    "cost": 1,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência adicional."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Armadilha Oculta: Gera +1⚡ de Essência e compra 1 carta.",
    "flavorText": "Congelar o mundo por três respirações muda qualquer estratégia.",
    "imagePath": "/assets/cards/neutral_46_pausar_pensar.webp"
  },
  {
    "id": "neutral_47_dados_destino",
    "name": "Relicário dos Dados do Destino",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Foco Temporal",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Vinte faces de cristal encantado que reescrevem o acaso.",
    "imagePath": "/assets/cards/neutral_47_dados_destino.webp"
  },
  {
    "id": "neutral_48_receptaculo_eternidade",
    "name": "Ânfora do Tempo Infinito",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Receptáculo",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Cura 4 no Soberano. Início do Turno: Cura 2 no seu Soberano.",
    "flavorText": "Um cálice de quartzo onde a juventude permanece intocada pela passagem dos anos.",
    "imagePath": "/assets/cards/neutral_48_receptaculo_eternidade.webp"
  },
  {
    "id": "neutral_49_fragmento_mental",
    "name": "Diadema do Fragmento Mental",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Diadema",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Lançar Feitiço: Causa 2 de dano a um inimigo."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Ao Lançar Feitiço: Causa 2 de dano a um inimigo.",
    "flavorText": "Aumenta a velocidade do pensamento até que cada magia dispare um eco letal.",
    "imagePath": "/assets/cards/neutral_49_fragmento_mental.webp"
  },
  {
    "id": "neutral_50_relogio_eternidade",
    "name": "O Grande Relógio da Eternidade",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Artefato Supremo",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela a Vanguarda rival."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1⚡ de Essência."
      },
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Ao Entrar: Congela a Vanguarda rival e compra 1 carta. Início do Turno: Gera +1⚡ e dá +1/+1 aos aliados.",
    "flavorText": "Doze badaladas que ecoam desde o primeiro segundo da criação até o último suspiro das estrelas.",
    "imagePath": "/assets/cards/neutral_50_relogio_eternidade.webp"
  },
  {
    "id": "red_91_batedor_salamandra",
    "name": "Batedor Salamandra das Fendas",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Batedor",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Ímpeto, Pele Incandescente. Desliza pelas fendas de lava para golpear no primeiro turno.",
    "flavorText": "Onde suas escamas tocam a relva, restam apenas trilhas de brasas.",
    "imagePath": "/assets/cards/red_91_batedor_salamandra.webp"
  },
  {
    "id": "red_92_artilheiro_magma",
    "name": "Artilheiro de Magma da Cratera",
    "domain": "red",
    "type": "creature",
    "subtype": "Anão • Artilheiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Dispara um morteiro vulcânico causando 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Alcance. Ao Entrar: Causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Calibrado para atingir o trono adversário por cima de qualquer muralha.",
    "imagePath": "/assets/cards/red_92_artilheiro_magma.webp"
  },
  {
    "id": "red_93_caocao_cinzas",
    "name": "Sabujo de Cinzas e Enxofre",
    "domain": "red",
    "type": "creature",
    "subtype": "Fera • Elemental",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Atacar: Espalha fagulhas que causam 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto. Ao Atacar: Causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Seu latido soa como o estalar de lenha seca na fornalha.",
    "imagePath": "/assets/cards/red_93_caocao_cinzas.webp"
  },
  {
    "id": "red_94_berserker_draconico",
    "name": "Berserker de Escama Carmesim",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Guerreiro • Dracônico",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente",
      "Ímpeto"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Senhor da Guerra Escama-Rubra",
      "newAtk": 7,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Fúria Crescente",
        "Ímpeto",
        "Atropelar",
        "Voo"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a um inimigo."
      }
    ],
    "description": "Fúria Crescente, Ímpeto. Armadura 1. Ao Entrar: Causa 2 de dano a um inimigo. Ascensão (3): Senhor da Guerra Escama-Rubra (7/6, ARM 1, Atropelar, Voo).",
    "flavorText": "Cada cicatriz em seu peito ferve com o sangue dos primeiros dragões.",
    "imagePath": "/assets/cards/red_94_berserker_draconico.webp"
  },
  {
    "id": "red_95_forjador_obsidiana",
    "name": "Mestre Forjador de Obsidiana",
    "domain": "red",
    "type": "creature",
    "subtype": "Gigante • Ferreiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Tempera as lâminas aliadas concedendo +1/+1 a todos os aliados."
      }
    ],
    "description": "Pele Incandescente. Armadura 1. Ao Entrar: Concede +1/+1 a todos os seus aliados.",
    "flavorText": "O aço comum derrete em sua bigorna; apenas o vidro vulcânico suporta seu martelo.",
    "imagePath": "/assets/cards/red_95_forjador_obsidiana.webp"
  },
  {
    "id": "red_96_serpente_piroclastica",
    "name": "Serpente Piroclástica Alada",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Serpente",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "breathDamage": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Entrar: Varre a linha de frente inimiga causando 2 de dano."
      }
    ],
    "description": "Voo, Alcance. Sopro 1. Ao Entrar: Causa 2 de dano a toda a Vanguarda inimiga.",
    "flavorText": "Nuvens de cinza fervente anunciam seu mergulho rasante.",
    "imagePath": "/assets/cards/red_96_serpente_piroclastica.webp"
  },
  {
    "id": "red_97_lancador_chamas",
    "name": "Piromante Lança-Chamas",
    "domain": "red",
    "type": "creature",
    "subtype": "Humano • Piromante",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Arconte da Chama Solar",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Voo",
        "Pele Incandescente"
      ]
    },
    "effects": [
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Lançar Feitiço: Dispara uma lança ígnea que causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Alcance. Ao Lançar Feitiço: Causa 2 de dano ao Soberano inimigo. Ascensão (4): Arconte da Chama Solar (6/6, ARM 1, Voo).",
    "flavorText": "Para ele, cada palavra arcana é um barril de pólvora prestes a explodir.",
    "imagePath": "/assets/cards/red_97_lancador_chamas.webp"
  },
  {
    "id": "red_98_colosso_escoria",
    "name": "Colosso de Escória e Brasa",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Colosso",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Morrer: Explode em lava, causando 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Atropelar, Pele Incandescente. Armadura 1. Ao Morrer: Causa 3 de dano à Vanguarda inimiga.",
    "flavorText": "Derrubá-lo é apenas abrir a comporta de um vulcão em erupção.",
    "imagePath": "/assets/cards/red_98_colosso_escoria.webp"
  },
  {
    "id": "red_99_senhor_balor_fogo",
    "name": "Bael-Khor, General do Chicote Ígneo",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • General",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 2,
    "atk": 7,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Sua tempestade de fogo causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Atropelar, Pele Incandescente. Armadura 1. Ao Entrar: Causa 2 de dano a todas as unidades.",
    "flavorText": "Seu chicote de múltiplos raios parte muralhas e escudos em um único estalo.",
    "imagePath": "/assets/cards/red_99_senhor_balor_fogo.webp"
  },
  {
    "id": "red_100_dragao_vulcanico_anciao",
    "name": "Khorvath, O Dragão Vulcânico Ancião",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Ancião",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Atropelar"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 4,
        "description": "Ao Entrar: Causa 4 de dano direto ao Soberano inimigo."
      }
    ],
    "description": "Voo, Alcance, Atropelar. Armadura 1. Sopro 3. Ao Entrar: Causa 4 de dano ao Soberano inimigo.",
    "flavorText": "As montanhas não entram em erupção; é Khorvath que respira sob elas.",
    "imagePath": "/assets/cards/red_100_dragao_vulcanico_anciao.webp"
  },
  {
    "id": "red_101_bombardeio_orbital",
    "name": "Bombardeio de Meteoritos",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Artilharia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 3 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: Fragmentos incandescentes caem do céu, causando 3 de dano à fileira inimiga e 2 ao Soberano rival.",
    "flavorText": "Quando os magos da cratera olham para as estrelas, as estrelas caem sobre seus inimigos.",
    "imagePath": "/assets/cards/red_101_bombardeio_orbital.webp"
  },
  {
    "id": "red_102_sangue_incandescente",
    "name": "Fervor do Sangue Incandescente",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Guerra",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 3,
        "secondaryValue": 1,
        "description": "Concede +3 ATQ e +1 VIDA a um aliado."
      }
    ],
    "description": "Feitiço: Incendeia as veias de um campeão aliado, concedendo +3 de ATQ e +1 de VIDA.",
    "flavorText": "A dor desaparece quando o coração bate na temperatura do ferro fundido.",
    "imagePath": "/assets/cards/red_102_sangue_incandescente.webp"
  },
  {
    "id": "red_103_fissura_tectonica",
    "name": "Fissura Tectônica de Enxofre",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Magma",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 5,
        "description": "Causa 5 de dano a um inimigo."
      }
    ],
    "description": "Feitiço: Abre o solo sob um defensor inimigo, causando 5 de dano vulcânico.",
    "flavorText": "Nenhuma armadura protege quem despenca no manto da terra.",
    "imagePath": "/assets/cards/red_103_fissura_tectonica.webp"
  },
  {
    "id": "red_104_tempestade_cinzas",
    "name": "Tempestade Piroclástica de Cinzas",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Sufoca a fileira inimiga com 2 de dano em área e compra 1 carta.",
    "flavorText": "O vento sopra cinzas tão quentes que transformam escudos em brasa.",
    "imagePath": "/assets/cards/red_104_tempestade_cinzas.webp"
  },
  {
    "id": "red_105_ritual_imolacao",
    "name": "Ritual da Pira Primordial",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Ritual",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +2 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: Alimenta a fornalha arcana para gerar +2⚡ de Essência neste turno e causar 2 de dano ao Soberano rival.",
    "flavorText": "O fogo devolve em dobro tudo o que lhe é ofertado.",
    "imagePath": "/assets/cards/red_105_ritual_imolacao.webp"
  },
  {
    "id": "red_106_escudo_magmatico",
    "name": "Contra-Erupção do Escudo Magmático",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Ígnea",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano ao atacante inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1/+2 a um defensor aliado."
      }
    ],
    "description": "Armadilha Oculta: Explode em magma ao ser atacado, causando 4 de dano a um inimigo e concedendo +1/+2 a um aliado.",
    "flavorText": "Golpear este escudo é como mergulhar a espada em um vulcão ativo.",
    "imagePath": "/assets/cards/red_106_escudo_magmatico.webp"
  },
  {
    "id": "red_107_fornalha_draconica",
    "name": "Fornalha das Escamas Rubras",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Fornalha",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Lançar Feitiço: Dispara uma brasa que causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano ao Soberano rival. Ao Lançar Feitiço: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Cada feitiço conjurado sopra o fole da grande fornalha dracônica.",
    "imagePath": "/assets/cards/red_107_fornalha_draconica.webp"
  },
  {
    "id": "red_108_trono_chama_primordial",
    "name": "Trono da Chama Primordial",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Trono",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 0,
        "description": "Início do Turno: Concede +1 de ATQ a todos os seus aliados."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano à Vanguarda rival. Início do Turno: Concede +1 ATQ a todos os aliados.",
    "flavorText": "Apenas aqueles cujo espírito é feito de fogo ousam sentar-se em seus degraus de basalto.",
    "imagePath": "/assets/cards/red_108_trono_chama_primordial.webp"
  },
  {
    "id": "blue_91_iniciado_runico",
    "name": "Iniciado Rúnico da Torre",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humano • Mago",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Sábio das Sete Esferas",
      "newAtk": 4,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Alcance",
        "Voo",
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Alcance. Ao Entrar: Compra 1 carta. Ascensão (3): Sábio das Sete Esferas (4/6, ARM 1, Voo, Escudo Divino).",
    "flavorText": "A primeira runa abre a mente; a sétima abre o próprio firmamento.",
    "imagePath": "/assets/cards/blue_91_iniciado_runico.webp"
  },
  {
    "id": "blue_92_espectro_geada",
    "name": "Aparição da Geada Boreal",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elemental • Gelo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 unidade inimiga."
      }
    ],
    "description": "Voo. Ao Entrar: Congela 1 unidade inimiga.",
    "flavorText": "Seu toque transforma o suor da batalha em estalactites de cristal.",
    "imagePath": "/assets/cards/blue_92_espectro_geada.webp"
  },
  {
    "id": "blue_93_cronomante_astral",
    "name": "Cronomante do Astrolábio",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elfo • Cronomante",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Oráculo Supremo do Continuum",
      "newAtk": 6,
      "newArmor": 1,
      "newMaxHp": 7,
      "addedKeywords": [
        "Alcance",
        "Voo",
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1⚡ de Essência."
      }
    ],
    "description": "Alcance. Ao Entrar: Gera +1⚡ de Essência. Ascensão (4): Oráculo Supremo do Continuum (6/7, ARM 1, Voo, Escudo Divino).",
    "flavorText": "Ele enxerga o fim do duelo antes mesmo da primeira espada deixar a bainha.",
    "imagePath": "/assets/cards/blue_93_cronomante_astral.webp"
  },
  {
    "id": "blue_94_sentinela_safira",
    "name": "Golem Sentinela de Safira",
    "domain": "blue",
    "type": "creature",
    "subtype": "Constructo • Guardião",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Guardião, Escudo Divino. Armadura 1. Reflete o primeiro golpe e protege os conjuradores da Retaguarda.",
    "flavorText": "Lapidado para suportar tanto o aço dos gigantes quanto o fogo dos dragões.",
    "imagePath": "/assets/cards/blue_94_sentinela_safira.webp"
  },
  {
    "id": "blue_95_leviata_abissal",
    "name": "Serpente Leviatã das Fendas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Marinho",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Onda glacial que Congela toda a Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 1. Ao Entrar: Congela toda a Vanguarda inimiga.",
    "flavorText": "Quando emerge das fossas oceânicas, o próprio mar congela de pavor.",
    "imagePath": "/assets/cards/blue_95_leviata_abissal.webp"
  },
  {
    "id": "blue_96_arquimago_tempestade",
    "name": "Arquimago da Cidadela Flutuante",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humano • Arquimago",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "spell_cast",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Lançar Feitiço: Dispara um raio que causa 2 de dano a um inimigo."
      }
    ],
    "description": "Voo, Alcance. Ao Lançar Feitiço: Causa 2 de dano a um inimigo.",
    "flavorText": "Cada encantamento que pronuncia invoca um trovão para selar a sentença.",
    "imagePath": "/assets/cards/blue_96_arquimago_tempestade.webp"
  },
  {
    "id": "blue_97_draco_relampago",
    "name": "Zephyros, O Dragão da Tempestade Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Tempestade",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 2 cartas."
      }
    ],
    "description": "Voo, Alcance, Escudo Divino. Armadura 1. Sopro 2. Ao Entrar: Compra 2 cartas.",
    "flavorText": "Suas asas carregam a eletricidade de cem furacões.",
    "imagePath": "/assets/cards/blue_97_draco_relampago.webp"
  },
  {
    "id": "blue_98_soberano_mares",
    "name": "Aegirion, Soberano das Fendas Abissais",
    "domain": "blue",
    "type": "creature",
    "subtype": "Titã • Marinho",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Maremoto astral causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Alcance. Armadura 1. Ao Entrar: Congela toda a Vanguarda inimiga e causa 3 de dano a ela.",
    "flavorText": "Tronos e continentes inteiros repousam submersos em seu domínio.",
    "imagePath": "/assets/cards/blue_98_soberano_mares.webp"
  },
  {
    "id": "blue_99_congelar_tempo",
    "name": "Congelar o Instante",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Cristaliza o tempo ao redor de 1 unidade inimiga (Congela) e compra 1 carta.",
    "flavorText": "Um segundo congelado é tudo o que um estrategista precisa.",
    "imagePath": "/assets/cards/blue_99_congelar_tempo.webp"
  },
  {
    "id": "blue_100_cadeia_voltaica",
    "name": "Descarga Voltaica Convergente",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Tempestade",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      }
    ],
    "description": "Feitiço: Um arco voltaico concentrado atinge um inimigo causando 4 de dano.",
    "flavorText": "O trovão é apenas o aplauso tardio do relâmpago.",
    "imagePath": "/assets/cards/blue_100_cadeia_voltaica.webp"
  },
  {
    "id": "blue_101_vortice_dimensional",
    "name": "Vórtice de Banimento Astral",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Espaço-Tempo",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve 1 unidade inimiga para a mão do dono."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Abre uma fenda dimensional que devolve 1 inimigo para a mão do oponente e compra 1 carta.",
    "flavorText": "Por que lutar contra um colosso hoje se você pode enviá-lo para a próxima semana?",
    "imagePath": "/assets/cards/blue_101_vortice_dimensional.webp"
  },
  {
    "id": "blue_102_biblioteca_proibida",
    "name": "Revelação dos Arquivos de Safira",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Sabedoria",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência neste turno."
      }
    ],
    "description": "Feitiço: Consulta os pergaminhos proibidos para comprar 2 cartas e gerar +1⚡ de Essência.",
    "flavorText": "Conhecimento é a única arma que nunca perde o fio.",
    "imagePath": "/assets/cards/blue_102_biblioteca_proibida.webp"
  },
  {
    "id": "blue_103_diluvio_arcano",
    "name": "Maremoto da Estrela Guia",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Oceano",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela a Vanguarda inimiga."
      }
    ],
    "description": "Feitiço: Uma onda glacial varre a linha de frente inimiga, causando 2 de dano e Congelando todos os sobreviventes.",
    "flavorText": "A maré sobe sob o comando da lua de safira.",
    "imagePath": "/assets/cards/blue_103_diluvio_arcano.webp"
  },
  {
    "id": "blue_104_fracao_temporal",
    "name": "Fração de Segundo Infinita",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "rare",
    "cost": 2,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +2 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Dilata um único segundo para gerar +2⚡ de Essência imediata e comprar 1 carta.",
    "flavorText": "Entre um batimento cardíaco e o seguinte, o cronomante tece três feitiços.",
    "imagePath": "/assets/cards/blue_104_fracao_temporal.webp"
  },
  {
    "id": "blue_105_reflexo_ilusorio",
    "name": "Miragem do Espelho D’Água",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Ilusão",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 atacante inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      }
    ],
    "description": "Armadilha Oculta: Desvia o golpe para uma ilusão, Congelando 1 inimigo e concedendo Escudo Divino aos seus aliados.",
    "flavorText": "A lâmina atravessou apenas o reflexo da lua na água.",
    "imagePath": "/assets/cards/blue_105_reflexo_ilusorio.webp"
  },
  {
    "id": "blue_106_contra_feitico_supremo",
    "name": "Revogação do Conclave Arcano",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve 1 atacante inimigo para a mão do dono."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela outro inimigo."
      }
    ],
    "description": "Armadilha Oculta: Desfaz a investida rival devolvendo 1 inimigo à mão do dono e Congelando outro.",
    "flavorText": "Sua permissão para atacar foi revogada pelo Conclave.",
    "imagePath": "/assets/cards/blue_106_contra_feitico_supremo.webp"
  },
  {
    "id": "blue_107_bussola_astral",
    "name": "Bússola das Marés Astrais",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Instrumento",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Início do Turno: Congela 1 unidade inimiga."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Início do Turno: Congela 1 unidade inimiga.",
    "flavorText": "Sua agulha de diamante aponta sempre para o ponto fraco na linha inimiga.",
    "imagePath": "/assets/cards/blue_107_bussola_astral.webp"
  },
  {
    "id": "blue_108_coroa_tempestades",
    "name": "Diadema do Olho do Furacão",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Coroa",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Lançar Feitiço: Causa 1 de dano a toda a Vanguarda inimiga."
      }
    ],
    "description": "Ao Entrar: Congela 1 inimigo. Ao Lançar Feitiço: Causa 1 de dano à Vanguarda rival.",
    "flavorText": "No centro do ciclone reina o silêncio; nas bordas, a destruição absoluta.",
    "imagePath": "/assets/cards/blue_108_coroa_tempestades.webp"
  },
  {
    "id": "purple_91_cultista_sangue",
    "name": "Iniciado do Cálice Carmesim",
    "domain": "purple",
    "type": "creature",
    "subtype": "Humano • Cultista",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Exarca do Eclipse Carmesim",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 5,
      "addedKeywords": [
        "Dreno de Vida",
        "Voo",
        "Renascer"
      ]
    },
    "effects": [],
    "description": "Dreno de Vida. Ascensão (3): Desperta como Exarca do Eclipse Carmesim (5/5, ARM 1, Voo, Renascer).",
    "flavorText": "Ele oferece uma gota hoje para reclamar um oceano amanhã.",
    "imagePath": "/assets/cards/purple_91_cultista_sangue.webp"
  },
  {
    "id": "purple_92_espectro_agonia",
    "name": "Banshee do Lamento Umbral",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Espírito",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "Quem ouve sua canção esquece como erguer a própria espada.",
    "imagePath": "/assets/cards/purple_92_espectro_agonia.webp"
  },
  {
    "id": "purple_93_verme_necrotico",
    "name": "Larva Devoradora de Criptas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Aberração • Necrófago",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Renascer"
    ],
    "effects": [],
    "description": "Toque Letal, Renascer. Mesmo esmagada, ergue-se mais uma vez para abater gigantes.",
    "flavorText": "Nas catacumbas mais fundas, nada é desperdiçado.",
    "imagePath": "/assets/cards/purple_93_verme_necrotico.webp"
  },
  {
    "id": "purple_94_ceifador_abissal",
    "name": "Ceifador da Foice Silenciosa",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Ceifador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Dreno de Vida"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Azrael-Vael, O Ceifador de Tronos",
      "newAtk": 7,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Toque Letal",
        "Dreno de Vida",
        "Voo",
        "Renascer"
      ]
    },
    "effects": [],
    "description": "Toque Letal, Dreno de Vida. Ascensão (4): Azrael-Vael, O Ceifador de Tronos (7/6, ARM 1, Voo, Renascer).",
    "flavorText": "A ampulheta virou; a colheita começou.",
    "imagePath": "/assets/cards/purple_94_ceifador_abissal.webp"
  },
  {
    "id": "purple_95_inquisidor_vazio",
    "name": "Inquisidor da Estrela Morta",
    "domain": "purple",
    "type": "creature",
    "subtype": "Humano • Inquisidor",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Guardião, Dreno de Vida. Armadura 1. Sustenta a Vanguarda enquanto restaura a vida do seu Soberano.",
    "flavorText": "Sua fé não morreu; ela apenas encontrou um deus mais faminto.",
    "imagePath": "/assets/cards/purple_95_inquisidor_vazio.webp"
  },
  {
    "id": "purple_96_abominacao_costurada",
    "name": "Colosso de Carne Costurada",
    "domain": "purple",
    "type": "creature",
    "subtype": "Constructo • Morto-Vivo",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Renascer"
    ],
    "effects": [],
    "description": "Guardião, Atropelar, Renascer. Armadura 1. Erguido com as partes dos mais fortes guerreiros caídos.",
    "flavorText": "Costurado com fios de prata negra e despertado por um raio profano.",
    "imagePath": "/assets/cards/purple_96_abominacao_costurada.webp"
  },
  {
    "id": "purple_97_arquidemonio_sombras",
    "name": "Malphas, O Arquidemônio das Sombras",
    "domain": "purple",
    "type": "creature",
    "subtype": "Corruptor • Demônio",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Dreno de Vida"
    ],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a um inimigo."
      }
    ],
    "description": "Voo, Ímpeto, Dreno de Vida. Armadura 1. Sobrecarga +1. Ao Entrar: Causa 3 de dano a um inimigo.",
    "flavorText": "Suas asas de corvo eclipsam as tochas antes do golpe fatal.",
    "imagePath": "/assets/cards/purple_97_arquidemonio_sombras.webp"
  },
  {
    "id": "purple_98_cavaleiro_apocalipse",
    "name": "Cavaleiro Pálido da Ruína",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Cavaleiro",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima 1 aliado da sua Cripta."
      }
    ],
    "description": "Atropelar, Toque Letal. Armadura 1. Ao Entrar: Reanima 1 criatura da sua Cripta.",
    "flavorText": "Atrás de seu corcel pálido marcha todo o cemitério.",
    "imagePath": "/assets/cards/purple_98_cavaleiro_apocalipse.webp"
  },
  {
    "id": "purple_99_lorde_vampiro_anciao",
    "name": "Vladislaus, O Patriarca de Sangue",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Soberano",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Atacar: Drena 2 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Voo, Dreno de Vida, Renascer. Armadura 1. Ao Atacar: Causa 2 de dano direto ao Soberano inimigo.",
    "flavorText": "Impérios nascem e caem; a sede do Patriarca permanece eterna.",
    "imagePath": "/assets/cards/purple_99_lorde_vampiro_anciao.webp"
  },
  {
    "id": "purple_100_dragao_necrotico",
    "name": "Morgath, O Dragão da Chama Necrótica",
    "domain": "purple",
    "type": "creature",
    "subtype": "Dragão • Morto-Vivo",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Renascer"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima um campeão da sua Cripta."
      }
    ],
    "description": "Voo, Dreno de Vida, Renascer. Armadura 1. Sopro 3. Ao Entrar: Reanima 1 criatura da sua Cripta.",
    "flavorText": "Seu sopro não queima a carne; ele arranca a alma e ergue o esqueleto.",
    "imagePath": "/assets/cards/purple_100_dragao_necrotico.webp"
  },
  {
    "id": "purple_101_maledicao_eterna",
    "name": "Maldição da Fraqueza Eterna",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Maldição",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Reduz em -2 o ATQ da Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Corrói a força da Vanguarda inimiga em -2 de ATQ e compra 1 carta.",
    "flavorText": "As espadas pesam como chumbo quando os mortos sussurram seu nome.",
    "imagePath": "/assets/cards/purple_101_maledicao_eterna.webp"
  },
  {
    "id": "purple_102_exumar_legiao",
    "name": "Despertar da Legião Eterna",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Reanima 1 criatura da sua Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 a todos os seus aliados."
      }
    ],
    "description": "Feitiço: Abre os túmulos ancestrais para reanimar 1 criatura da Cripta e conceder +1/+1 a todos os seus aliados.",
    "flavorText": "A morte é apenas o quartel onde o verdadeiro exército descansa.",
    "imagePath": "/assets/cards/purple_102_exumar_legiao.webp"
  },
  {
    "id": "purple_103_drenar_existencia",
    "name": "Sifão da Própria Existência",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Sombra",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço (Sobrecarga +1): Absorve a força vital de um inimigo causando 4 de dano e curando 4 de VIDA no seu Soberano.",
    "flavorText": "O que era sangue no peito do inimigo torna-se vinho na taça do Soberano.",
    "imagePath": "/assets/cards/purple_103_drenar_existencia.webp"
  },
  {
    "id": "purple_104_pacto_demoniaco",
    "name": "Centelha Umbral",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Pacto",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +2 de Essência neste turno."
      }
    ],
    "description": "Feitiço (Sobrecarga +1): Canaliza energia vital concentrada para gerar +2⚡ de Essência imediata neste turno.",
    "flavorText": "O poder nunca é negado a quem aceita o preço das sombras.",
    "imagePath": "/assets/cards/purple_104_pacto_demoniaco.webp"
  },
  {
    "id": "purple_105_emboscada_umbral",
    "name": "Golpe pelas Costas Umbral",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Assassinato",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      }
    ],
    "description": "Armadilha Oculta: Lâminas emergem da própria sombra do atacante, causando 4 de dano letal.",
    "flavorText": "Você nunca está sozinho enquanto projetar uma sombra no chão.",
    "imagePath": "/assets/cards/purple_105_emboscada_umbral.webp"
  },
  {
    "id": "purple_106_prisao_almas",
    "name": "Relicário das Almas Cativas",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Necromancia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Armadilha Oculta: Aprisiona o espírito do agressor, causando 3 de dano e curando 3 de VIDA no seu Soberano.",
    "flavorText": "As grades são feitas de remorso e trancadas com esquecimento.",
    "imagePath": "/assets/cards/purple_106_prisao_almas.webp"
  },
  {
    "id": "purple_107_grimorio_necromante",
    "name": "Necronomicon de Couro Negro",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Grimório",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Lançar Feitiço: Causa 1 de dano ao Soberano inimigo."
      },
      {
        "trigger": "spell_cast",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Ao Lançar Feitiço: Cura 1 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Ao Lançar Feitiço: Drena 1 de VIDA do Soberano rival para o seu.",
    "flavorText": "Suas páginas viram sozinhas sempre que alguém morre por perto.",
    "imagePath": "/assets/cards/purple_107_grimorio_necromante.webp"
  },
  {
    "id": "purple_108_obelisco_vazio",
    "name": "Monólito do Eclipse Abissal",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Monólito",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Ao Entrar: Reduz em -2 o ATQ da Vanguarda inimiga."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Início do Turno: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Reduz em -2 o ATQ da Vanguarda rival. Início do Turno: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Sua sombra fria estende-se até o trono inimigo, sugando a coragem e o calor.",
    "imagePath": "/assets/cards/purple_108_obelisco_vazio.webp"
  },
  {
    "id": "green_91_rastreador_feral",
    "name": "Rastreador Feral da Copa",
    "domain": "green",
    "type": "creature",
    "subtype": "Elfo • Patrulheiro",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Senhor da Caçada Primordial",
      "newAtk": 5,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Ímpeto",
        "Alcance",
        "Atropelar"
      ]
    },
    "effects": [],
    "description": "Ímpeto. Ascensão (3): Desperta como Senhor da Caçada Primordial (5/6, ARM 1, Alcance, Atropelar).",
    "flavorText": "Ele conhece cada galho, cada toca e cada batimento cardíaco na mata.",
    "imagePath": "/assets/cards/green_91_rastreador_feral.webp"
  },
  {
    "id": "green_92_lobo_espinheiro",
    "name": "Lobo dos Espinheiros Verdes",
    "domain": "green",
    "type": "creature",
    "subtype": "Planta • Fera",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "regeneration": 1,
    "effects": [],
    "description": "Ímpeto. Regeneração 1. Sua pelagem de espinhos regenera-se a cada alvorada.",
    "flavorText": "Metade predador, metade roseira brava.",
    "imagePath": "/assets/cards/green_92_lobo_espinheiro.webp"
  },
  {
    "id": "green_93_vespa_cacadora",
    "name": "Vespa Caçadora de Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Inseto",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 1,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Voo, Toque Letal. Seu ferrão perfura a couraça do maior dos dragões.",
    "flavorText": "Uma única ferroada basta para derrubar um mamute de guerra.",
    "imagePath": "/assets/cards/green_93_vespa_cacadora.webp"
  },
  {
    "id": "green_94_urso_runico",
    "name": "Urso Rúnico da Caverna Antiga",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Guardião",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "regeneration": 1,
    "ascension": {
      "cost": 4,
      "newName": "Ursok, O Titã da Montanha Verde",
      "newAtk": 7,
      "newArmor": 2,
      "newMaxHp": 8,
      "addedKeywords": [
        "Guardião",
        "Atropelar",
        "Fúria Crescente"
      ]
    },
    "effects": [],
    "description": "Guardião. Armadura 1. Regeneração 1. Ascensão (4): Ursok, O Titã da Montanha Verde (7/8, ARM 2, Atropelar, Fúria Crescente).",
    "flavorText": "As runas druídicas gravadas em seus ombros brilham quando a floresta é ameaçada.",
    "imagePath": "/assets/cards/green_94_urso_runico.webp"
  },
  {
    "id": "green_95_xama_esporos",
    "name": "Xamã do Círculo dos Esporos",
    "domain": "green",
    "type": "creature",
    "subtype": "Humanoide • Druida",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Esporos vitais concedem +1/+1 a todos os seus aliados."
      }
    ],
    "description": "Alcance. Ao Entrar: Concede +1/+1 a todos os seus aliados.",
    "flavorText": "Da madeira caída brota o cogumelo que alimenta toda a alcateia.",
    "imagePath": "/assets/cards/green_95_xama_esporos.webp"
  },
  {
    "id": "green_96_gorila_esmeralda",
    "name": "Costas-de-Prata do Vale Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Primata",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Atropelar, Fúria Crescente. Quanto mais a batalha se prolonga, mais devastadores são seus punhos.",
    "flavorText": "Seu tamborilar no peito faz cair as folhas de três colinas ao redor.",
    "imagePath": "/assets/cards/green_96_gorila_esmeralda.webp"
  },
  {
    "id": "green_97_serpente_constritora",
    "name": "Jiboia Titânica do Mangue",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Réptil",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Enrosca-se em 1 inimigo, Congelando-o."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Enlaça e Congela 1 unidade inimiga.",
    "flavorText": "Ninguém escapa do abraço silencioso do manguezal.",
    "imagePath": "/assets/cards/green_97_serpente_constritora.webp"
  },
  {
    "id": "green_98_mamute_primordial",
    "name": "Mamute Lanoso da Tundra Verde",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Colosso",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião"
    ],
    "effects": [],
    "description": "Atropelar, Guardião. Armadura 1. Uma muralha viva de presas de marfim e couro espesso.",
    "flavorText": "Suas presas curvas erguem carruagens inteiras como se fossem gravetos.",
    "imagePath": "/assets/cards/green_98_mamute_primordial.webp"
  },
  {
    "id": "green_99_guardiao_sequoia",
    "name": "Ancião da Sequoia Milenar",
    "domain": "green",
    "type": "creature",
    "subtype": "Planta • Titã",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA em todos os aliados."
      }
    ],
    "description": "Guardião. Armadura 2. Regeneração 2. Ao Entrar: Cura 2 de VIDA em todos os seus aliados.",
    "flavorText": "Mil anos crescendo em silêncio; um único minuto para esmagar os invasores.",
    "imagePath": "/assets/cards/green_99_guardiao_sequoia.webp"
  },
  {
    "id": "green_100_quimera_selvagem",
    "name": "Quimera Alfa de Três Presas",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Quimera",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Atropelar"
    ],
    "breathDamage": 1,
    "effects": [],
    "description": "Voo, Ímpeto, Atropelar. Sopro 1. Ataca no mesmo turno em que desce dos céus.",
    "flavorText": "Rugido de leão, investida de bode e peçonha de dragão em um só corpo.",
    "imagePath": "/assets/cards/green_100_quimera_selvagem.webp"
  },
  {
    "id": "green_101_tiranossauro_alfa",
    "name": "Rex Primordial da Cratera Verde",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Dinossauro",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os seus aliados."
      }
    ],
    "description": "Atropelar, Fúria Crescente. Armadura 1. Ao Entrar: Concede +1/+1 a todos os seus aliados.",
    "flavorText": "O rei indiscutível da primeira era do mundo.",
    "imagePath": "/assets/cards/green_101_tiranossauro_alfa.webp"
  },
  {
    "id": "green_102_hidra_venenosa",
    "name": "Polydra, A Hidra de Nove Cabeças",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Lendária",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Toque Letal",
      "Fúria Crescente"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Atropelar, Toque Letal, Fúria Crescente. Armadura 1. Regeneração 2.",
    "flavorText": "Corte uma cabeça e duas mais venenosas despertarão no mesmo instante.",
    "imagePath": "/assets/cards/green_102_hidra_venenosa.webp"
  },
  {
    "id": "green_103_dragao_floresta_anciao",
    "name": "Silvathor, O Dragão-Floresta Ancião",
    "domain": "green",
    "type": "creature",
    "subtype": "Dragão • Primordial",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Atropelar"
    ],
    "regeneration": 2,
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os seus aliados."
      }
    ],
    "description": "Voo, Guardião, Atropelar. Armadura 1. Regeneração 2. Sopro 2. Ao Entrar: Concede +2/+2 a todos os seus aliados.",
    "flavorText": "Florestas inteiras nascem onde suas escamas de esmeralda tocam o solo.",
    "imagePath": "/assets/cards/green_103_dragao_floresta_anciao.webp"
  },
  {
    "id": "green_104_levante_selva",
    "name": "Levante da Selva Indomável",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Manada",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2 ATQ e +2 VIDA a todos os aliados."
      }
    ],
    "description": "Feitiço: O chamado ancestral desperta a fúria da mata, concedendo +2/+2 a todas as suas unidades.",
    "flavorText": "Quando a selva inteira avança, as muralhas de pedra viram pó.",
    "imagePath": "/assets/cards/green_104_levante_selva.webp"
  },
  {
    "id": "green_105_instinto_predador",
    "name": "Faro do Predador Alfa",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Caçada",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2/+2 a um aliado."
      }
    ],
    "description": "Feitiço: Aguça os sentidos de uma criatura aliada, concedendo +2 de ATQ e +2 de VIDA.",
    "flavorText": "O cheiro do medo inimigo é o melhor guia na escuridão.",
    "imagePath": "/assets/cards/green_105_instinto_predador.webp"
  },
  {
    "id": "green_106_emboscada_espinhos",
    "name": "Laço de Vinhas Estranguladoras",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Floresta",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela (enraíza) 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1/+2 a um aliado."
      }
    ],
    "description": "Armadilha Oculta: Raízes espinhosas prendem 1 atacante inimigo (Congela) e concedem +1/+2 a um aliado.",
    "flavorText": "O próprio chão da floresta luta ao lado dos seus guardiões.",
    "imagePath": "/assets/cards/green_106_emboscada_espinhos.webp"
  },
  {
    "id": "green_107_altar_fera_antiga",
    "name": "Totem das Presas Primordiais",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Totem",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Concede +2/+2 a um aliado. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Esculpido no tronco da primeira árvore e coroado com o crânio do grande urso.",
    "imagePath": "/assets/cards/green_107_altar_fera_antiga.webp"
  },
  {
    "id": "green_108_semente_mundo",
    "name": "Corazón da Árvore-Mundo",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Semente",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA em todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1⚡ de Essência."
      }
    ],
    "description": "Ao Entrar: Cura 2 em todos os aliados. Início do Turno: Gera +1⚡ de Essência.",
    "flavorText": "Dentro desta semente dourada dormem todas as florestas do amanhã.",
    "imagePath": "/assets/cards/green_108_semente_mundo.webp"
  },
  {
    "id": "gold_91_lanceiro_alvorada",
    "name": "Lanceiro da Guarda da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humano • Soldado",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Centurião da Lança Radiante",
      "newAtk": 4,
      "newArmor": 2,
      "newMaxHp": 6,
      "addedKeywords": [
        "Guardião",
        "Escudo Divino"
      ]
    },
    "effects": [],
    "description": "Guardião. Armadura 1. Ascensão (3): Centurião da Lança Radiante (4/6, ARM 2, Escudo Divino).",
    "flavorText": "Um único escudo é uma defesa; três escudos juntos no mesmo slot são uma muralha.",
    "imagePath": "/assets/cards/gold_91_lanceiro_alvorada.webp"
  },
  {
    "id": "gold_92_clerigo_escudo",
    "name": "Capelão da Égide Dourada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humano • Clérigo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_target_ally",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA em um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Alcance. Armadura 1. Ao Entrar: Cura 3 de VIDA em um aliado.",
    "flavorText": "Suas preces fecham feridas mais rápido do que as espadas inimigas podem abri-las.",
    "imagePath": "/assets/cards/gold_92_clerigo_escudo.webp"
  },
  {
    "id": "gold_93_automato_bronze",
    "name": "Autômato Escudeiro de Bronze",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Soldado",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Guardião, Escudo Divino. Armadura 1. Incansável e imune ao medo na linha de frente.",
    "flavorText": "Forjado em série nas fundições imperiais para nunca recuar um passo.",
    "imagePath": "/assets/cards/gold_93_automato_bronze.webp"
  },
  {
    "id": "gold_94_justicar_implacavel",
    "name": "Justicar do Martelo Radiante",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humano • Paladino",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Grão-Lorde do Veredito Solar",
      "newAtk": 6,
      "newArmor": 2,
      "newMaxHp": 7,
      "addedKeywords": [
        "Guardião",
        "Escudo Divino",
        "Voo"
      ]
    },
    "effects": [],
    "description": "Escudo Divino. Armadura 1. Ascensão (4): Grão-Lorde do Veredito Solar (6/7, ARM 2, Guardião, Voo).",
    "flavorText": "O culpado treme antes mesmo que o martelo toque o chão.",
    "imagePath": "/assets/cards/gold_94_justicar_implacavel.webp"
  },
  {
    "id": "gold_95_cavaleiro_pegaso",
    "name": "Valkíria do Pégaso Real",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Cavaleiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Inspira um aliado com +1/+2."
      }
    ],
    "description": "Voo, Ímpeto. Armadura 1. Ao Entrar: Concede +1/+2 a um aliado.",
    "flavorText": "Das nuvens douradas desce a lança que rompe o cerco.",
    "imagePath": "/assets/cards/gold_95_cavaleiro_pegaso.webp"
  },
  {
    "id": "gold_96_mestre_forja_solar",
    "name": "Artífice da Forja de Hélios",
    "domain": "gold",
    "type": "creature",
    "subtype": "Anão • Artífice",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Tempera as armaduras concedendo +1/+1 aos aliados."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Concede +1/+1 a todos os seus aliados.",
    "flavorText": "Cada golpe de seu martelo abençoa um escudo na linha de frente.",
    "imagePath": "/assets/cards/gold_96_mestre_forja_solar.webp"
  },
  {
    "id": "gold_97_colosso_celestial",
    "name": "Colosso de Mármore e Ouro",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Celestial",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a todos os seus aliados."
      }
    ],
    "description": "Guardião, Escudo Divino. Armadura 2. Ao Entrar: Concede +1/+2 a todos os seus aliados.",
    "flavorText": "Esculpido na própria montanha sagrada para guardar os portões do sol.",
    "imagePath": "/assets/cards/gold_97_colosso_celestial.webp"
  },
  {
    "id": "gold_98_arconte_julgamento",
    "name": "Raziel, Arconte da Espada Flamejante",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Arconte",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Ao Entrar: Julga um inimigo causando 4 de dano."
      }
    ],
    "description": "Voo, Escudo Divino. Armadura 1. Ao Entrar: Causa 4 de dano a uma unidade inimiga.",
    "flavorText": "Onde sua lâmina desce, nenhuma mentira ou maldição sobrevive.",
    "imagePath": "/assets/cards/gold_98_arconte_julgamento.webp"
  },
  {
    "id": "gold_99_serafim_coroado",
    "name": "Seraphiel, A Imperatriz das Seis Asas",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Serafim",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      }
    ],
    "description": "Voo, Guardião, Escudo Divino. Armadura 2. Ao Entrar: Cura 4 no Soberano e concede Escudo Divino aos aliados.",
    "flavorText": "Seis asas de ouro líquido que apagam a escuridão de todo o campo de batalha.",
    "imagePath": "/assets/cards/gold_99_serafim_coroado.webp"
  },
  {
    "id": "gold_100_dragao_imperial_ouro",
    "name": "Aurion-Sol, O Dragão Imperial do Zênite",
    "domain": "gold",
    "type": "creature",
    "subtype": "Dragão • Soberano",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os seus aliados."
      }
    ],
    "description": "Voo, Guardião, Escudo Divino. Armadura 2. Sopro 2. Ao Entrar: Concede +2/+2 a todos os seus aliados.",
    "flavorText": "Seu sopro é o próprio sol nascente; suas escamas são o escudo do império.",
    "imagePath": "/assets/cards/gold_100_dragao_imperial_ouro.webp"
  },
  {
    "id": "gold_101_julgamento_radiante",
    "name": "Sentença da Lança Solar",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Julgamento",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Um pilar de luz solar atinge um inimigo causando 4 de dano e curando 2 de VIDA no seu Soberano.",
    "flavorText": "A mesma luz que aquece os justos incinera os tiranos.",
    "imagePath": "/assets/cards/gold_101_julgamento_radiante.webp"
  },
  {
    "id": "gold_102_formacao_falange",
    "name": "Formação dos Mil Escudos",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Tática",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1 ATQ e +2 VIDA a todos os aliados."
      }
    ],
    "description": "Feitiço: Une os escudos de todas as fileiras, concedendo +1 de ATQ e +2 de VIDA a todos os seus aliados.",
    "flavorText": "Quando a falange fecha fileiras, nem o vento passa entre os escudos.",
    "imagePath": "/assets/cards/gold_102_formacao_falange.webp"
  },
  {
    "id": "gold_103_egide_inquebravel",
    "name": "Égide da Intervenção Solar",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Proteção",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Armadilha Oculta: Ergue uma cúpula dourada que concede Escudo Divino a todos os aliados e cura 2 no Soberano.",
    "flavorText": "A fé verdadeira não desvia do golpe; ela o transforma em faíscas inofensivas.",
    "imagePath": "/assets/cards/gold_103_egide_inquebravel.webp"
  },
  {
    "id": "gold_104_martelo_consagrado",
    "name": "Altar do Martelo Consagrado",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Armamento",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano a um inimigo. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Repousando sobre o pedestal de mármore, o martelo vibra a cada manhã.",
    "imagePath": "/assets/cards/gold_104_martelo_consagrado.webp"
  },
  {
    "id": "gold_105_coroa_imperador",
    "name": "Coroa Imperial de Solis",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Regalia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Início do Turno: Gera +1⚡ de Essência.",
    "flavorText": "Doze pontas de ouro puro que canalizam o tributo de todo o império.",
    "imagePath": "/assets/cards/gold_105_coroa_imperador.webp"
  },
  {
    "id": "gold_106_bastiao_eterno",
    "name": "Obelisco do Bastião Inexpugnável",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Fortaleza",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 2,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA em todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA no seu Soberano."
      }
    ],
    "description": "Ao Entrar: Cura 2 em todos os aliados. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Enquanto esta torre permanecer de pé, o trono jamais cairá.",
    "imagePath": "/assets/cards/gold_106_bastiao_eterno.webp"
  },
  {
    "id": "gold_107_reliquia_alvorada",
    "name": "Cálice Sagrado da Alvorada",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Cálice",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "turn_end",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Fim do Turno: Concede +1/+2 a um aliado."
      }
    ],
    "description": "Ao Entrar: Concede Escudo Divino aos aliados. Fim do Turno: Concede +1/+2 a um aliado.",
    "flavorText": "Transborda com o orvalho colhido no primeiro amanhecer do mundo.",
    "imagePath": "/assets/cards/gold_107_reliquia_alvorada.webp"
  },
  {
    "id": "gold_108_trono_ordem_suprema",
    "name": "Santuário da Ordem Suprema",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Santuário",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a todos os seus aliados."
      }
    ],
    "description": "Ao Entrar e no Início do Turno: Concede +1/+1 a todos os seus aliados.",
    "flavorText": "A lei suprema escrita em ouro: a ordem sempre triunfa sobre o caos.",
    "imagePath": "/assets/cards/gold_108_trono_ordem_suprema.webp"
  },
  {
    "id": "neutral_51_androide_runico",
    "name": "Autômato Rúnico de Cristal",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Peregrino",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Armadura 1. Defensor versátil que se adapta a qualquer pacto cromático.",
    "flavorText": "Seu núcleo de quartzo ressoa com qualquer cor de essência.",
    "imagePath": "/assets/cards/neutral_51_androide_runico.webp"
  },
  {
    "id": "neutral_52_mercenario_planar",
    "name": "Mercenário das Lâminas Planais",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humanoide • Mercenário",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1 de Essência neste turno."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Gera +1⚡ de Essência neste turno.",
    "flavorText": "Ele luta por quem pagar em essência pura, não importa a cor do estandarte.",
    "imagePath": "/assets/cards/neutral_52_mercenario_planar.webp"
  },
  {
    "id": "neutral_53_colosso_prismantico",
    "name": "Colosso de Vidro Prismático",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Colosso",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião, Escudo Divino. Armadura 1. Ao Entrar: Cura 3 de VIDA no seu Soberano.",
    "flavorText": "A luz de cinco domínios refrata em seu peito de diamante.",
    "imagePath": "/assets/cards/neutral_53_colosso_prismantico.webp"
  },
  {
    "id": "neutral_54_dragao_etereo",
    "name": "Aetherion, O Dragão do Vácuo Astral",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Dragão • Astral",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 0,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +2 de Essência."
      }
    ],
    "description": "Voo, Alcance, Escudo Divino. Armadura 1. Sopro 2. Ao Entrar: Gera +2⚡ de Essência.",
    "flavorText": "Nascido antes da divisão do prisma nos cinco domínios.",
    "imagePath": "/assets/cards/neutral_54_dragao_etereo.webp"
  },
  {
    "id": "neutral_55_ruptura_planar",
    "name": "Convergência dos Cinco Pactos",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Arcano • Convergência",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +2 de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Alinha os Cinco Pactos Cromáticos para gerar +2⚡ de Essência imediata e comprar 1 carta.",
    "flavorText": "Quando os cinco sóis se alinham, o impossível torna-se trivial.",
    "imagePath": "/assets/cards/neutral_55_ruptura_planar.webp"
  },
  {
    "id": "neutral_56_barreira_prismatica",
    "name": "Muralha do Prisma Pentacromático",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Prisma",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano ao atacante."
      }
    ],
    "description": "Armadilha Oculta: Refrata o ataque inimigo concedendo Escudo Divino aos aliados e causando 2 de dano a um inimigo.",
    "flavorText": "Sete camadas de luz sólida que nenhuma lâmina mortal pode atravessar.",
    "imagePath": "/assets/cards/neutral_56_barreira_prismatica.webp"
  },
  {
    "id": "neutral_57_orbe_dominacao",
    "name": "Orbe da Convergência Cromática",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Orbe",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência."
      }
    ],
    "description": "Ao Entrar e no Início do Turno: Gera +1⚡ de Essência.",
    "flavorText": "Cinco chamas elementais giram em harmonia perpétua dentro do cristal.",
    "imagePath": "/assets/cards/neutral_57_orbe_dominacao.webp"
  },
  {
    "id": "neutral_58_espada_planos",
    "name": "Lâmina da Fenda Dimensional",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Armamento",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 0,
        "description": "Início do Turno: Concede +2 de ATQ a um aliado."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano a um inimigo. Início do Turno: Concede +2 ATQ a um aliado.",
    "flavorText": "Seu fio corta não apenas o aço, mas o próprio espaço entre os mundos.",
    "imagePath": "/assets/cards/neutral_58_espada_planos.webp"
  },
  {
    "id": "neutral_59_armadura_invulneravel",
    "name": "Égide de Adamantina Planar",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Armadura",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Concede Escudo Divino aos aliados. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Forjada no núcleo de um meteoro caído, nenhuma lâmina jamais a riscou.",
    "imagePath": "/assets/cards/neutral_59_armadura_invulneravel.webp"
  },
  {
    "id": "neutral_60_calice_infinito",
    "name": "Graal do Prisma Infinito",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Artefato Supremo",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Ao Entrar: Gera +2⚡ de Essência."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Gera +2⚡ e cura 3 no Soberano. Início do Turno: Dá +1/+1 aos aliados e compra 1 carta.",
    "flavorText": "Quem bebe do Graal Prismático comanda as cinco forças da criação como uma só.",
    "imagePath": "/assets/cards/neutral_60_calice_infinito.webp"
  },
  {
    "id": "red_109_diabrete_fornalha",
    "name": "Diabrete da Fornalha",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Diabrete",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Causa 1 de dano ao Soberano inimigo.",
    "flavorText": "Nascido das fagulhas que saltam da bigorna do tirano.",
    "imagePath": "/assets/cards/red_109_diabrete_fornalha.webp"
  },
  {
    "id": "red_110_funda_magma_kobold",
    "name": "Fundeiro de Magma Escamado",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Réptil • Atirador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano a um inimigo."
      }
    ],
    "description": "Alcance. Ao Entrar: Dispara um projétil incandescente causando 1 de dano a um inimigo.",
    "flavorText": "Pedras quentes nunca faltam no fundo da cratera.",
    "imagePath": "/assets/cards/red_110_funda_magma_kobold.webp"
  },
  {
    "id": "red_111_predador_piroclastico",
    "name": "Pantera Piroclástica",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Felino",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto, Fúria Crescente. Ao Atacar: Causa 1 de dano ao Soberano inimigo.",
    "flavorText": "Seus passos deixam pegadas de vidro derretido na rocha.",
    "imagePath": "/assets/cards/red_111_predador_piroclastico.webp"
  },
  {
    "id": "red_112_gladiador_caldeira",
    "name": "Gladiador da Caldeira",
    "domain": "red",
    "type": "creature",
    "subtype": "Humanoide • Gladiador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Fúria Crescente. Armadura 1. Ao Atacar: Causa 1 de dano ao Soberano inimigo.",
    "flavorText": "Na arena de cinzas, a plateia exige que o calor chegue até os camarotes reais.",
    "imagePath": "/assets/cards/red_112_gladiador_caldeira.webp"
  },
  {
    "id": "red_113_xama_cinzas",
    "name": "Xamã da Tempestade de Cinzas",
    "domain": "red",
    "type": "creature",
    "subtype": "Humanoide • Xamã",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Ao Entrar: Concede +1 ATQ a todos os seus aliados."
      }
    ],
    "description": "Alcance. Ao Entrar: Desperta o furor das brasas, concedendo +1/+0 a todos os aliados.",
    "flavorText": "Ele lê o destino da batalha nas colunas de fumaça negra.",
    "imagePath": "/assets/cards/red_113_xama_cinzas.webp"
  },
  {
    "id": "red_114_draco_escoria",
    "name": "Draco de Escória Vulcânica",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Draco",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Concede +1⚡ Essência neste turno."
      }
    ],
    "description": "Voo, Guardião. Armadura 2. Sopro 2. Ao Entrar: Concede +1⚡ Essência neste turno.",
    "flavorText": "Suas escamas são feitas de ferro fundido resfriado às pressas.",
    "imagePath": "/assets/cards/red_114_draco_escoria.webp"
  }
];

const ALL_CARDS_PART_2: CardDefinition[] = [
  {
    "id": "red_115_centuriao_obsidiana",
    "name": "Centurião de Obsidiana",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Soldado",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Guardião, Fúria Crescente. Armadura 1. Cada golpe contra seu escudo alimenta sua fornalha interna.",
    "flavorText": "A falange da cratera não conhece a palavra recuar.",
    "imagePath": "/assets/cards/red_115_centuriao_obsidiana.webp"
  },
  {
    "id": "red_116_hidra_vulcanica",
    "name": "Hidra de Magma Vulcânica",
    "domain": "red",
    "type": "creature",
    "subtype": "Monstruosidade • Hidra",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "breathDamage": 1,
    "effects": [],
    "description": "Atropelar, Fúria Crescente. Sopro 1. Suas múltiplas gargantas cospem lava em arco.",
    "flavorText": "Onde uma cabeça é decepada, um gêiser de magma se ergue no lugar.",
    "imagePath": "/assets/cards/red_116_hidra_vulcanica.webp"
  },
  {
    "id": "red_117_arauto_erupcao",
    "name": "Arauto Demoníaco da Erupção",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Demônio",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Ímpeto. Armadura 1. Ao Entrar: Causa 2 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "Sua descida dos céus anuncia o despertar do vulcão.",
    "imagePath": "/assets/cards/red_117_arauto_erupcao.webp"
  },
  {
    "id": "red_118_tita_basalto",
    "name": "Titã do Núcleo de Basalto",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Titã",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a todos os inimigos na fileira frontal."
      }
    ],
    "description": "Atropelar, Guardião. Armadura 2. Ao Entrar: Provoca um tremor vulcânico que causa 2 de dano à fileira inimiga.",
    "flavorText": "Ele carrega o peso de uma cordilheira inteira em seus ombros incandescentes.",
    "imagePath": "/assets/cards/red_118_tita_basalto.webp"
  },
  {
    "id": "red_119_soberano_piroclasma",
    "name": "Pyroclasmos, Imperador das Chamas",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Soberano Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Incinera todos os inimigos na fileira com 3 de dano."
      }
    ],
    "description": "Voo, Ímpeto. Armadura 1. Sopro 2. Ao Entrar: Causa 3 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "Perante Pyroclasmos, até mesmo os sóis parecem brasas frias.",
    "imagePath": "/assets/cards/red_119_soberano_piroclasma.webp"
  },
  {
    "id": "red_120_lanca_magmatica",
    "name": "Lança Magmática",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Piroclastia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço: Arremessa uma lança de rocha derretida que causa 4 de dano a um inimigo e 1 de dano ao Soberano rival.",
    "flavorText": "Atravessa o escudo e ainda queima o estandarte atrás dele.",
    "imagePath": "/assets/cards/red_120_lanca_magmatica.webp"
  },
  {
    "id": "red_121_furia_vulcao",
    "name": "Fúria do Vulcão Desperto",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Erupção",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 0,
        "description": "Concede +2 ATQ a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Feitiço: Concede +2/+0 a todos os seus aliados e causa 2 de dano à fileira inimiga.",
    "flavorText": "Quando a montanha ruge, seus filhos avançam em chamas.",
    "imagePath": "/assets/cards/red_121_furia_vulcao.webp"
  },
  {
    "id": "red_122_onda_calor_letal",
    "name": "Onda de Calor Letal",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Chama",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano a todos os inimigos na fileira."
      }
    ],
    "description": "Feitiço: Uma parede de ar superaquecido varre o campo, causando 3 de dano a todos os inimigos.",
    "flavorText": "O aço amolece antes mesmo que as chamas o toquem.",
    "imagePath": "/assets/cards/red_122_onda_calor_letal.webp"
  },
  {
    "id": "red_123_cataclismo_solar",
    "name": "Detonação do Sol Carmesim",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 5,
        "description": "Causa 5 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Feitiço Lendário: Um pequeno sol despenca sobre o campo, causando 5 de dano a todos os inimigos e 3 de dano ao Soberano rival.",
    "flavorText": "O fim de um império escrito em letras de fogo no firmamento.",
    "imagePath": "/assets/cards/red_123_cataclismo_solar.webp"
  },
  {
    "id": "red_124_contra_explosao",
    "name": "Contra-Explosão Rubra",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Piroclastia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      }
    ],
    "description": "Armadilha Oculta: Quando um aliado é atacado, explode em chamas causando 3 de dano ao agressor e erguendo Escudo Divino.",
    "flavorText": "Tocar a brasa viva é pedir para queimar a própria mão.",
    "imagePath": "/assets/cards/red_124_contra_explosao.webp"
  },
  {
    "id": "red_125_armadilha_piroclastica",
    "name": "Armadilha Piroclástica",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Armadilha Oculta: Detona runas de magma sob a fileira inimiga, causando 3 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "O chão inteiro já estava minado antes mesmo da marcha começar.",
    "imagePath": "/assets/cards/red_125_armadilha_piroclastica.webp"
  },
  {
    "id": "red_126_bigorna_draconica",
    "name": "Bigorna Dracônica da Cratera",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Forja",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Ao Entrar: Concede +1 ATQ a todos os seus aliados."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Início do Turno: Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Concede +1/+0 aos aliados. Início do Turno: Causa 1 de dano ao Soberano inimigo.",
    "flavorText": "Cada martelada ressoa como o rugido de um dragão ancestral.",
    "imagePath": "/assets/cards/red_126_bigorna_draconica.webp"
  },
  {
    "id": "blue_109_estudante_astral",
    "name": "Aprendiz do Prisma Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Mago",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Alcance. Ao Entrar: Inspeciona as linhas ley e compra 1 carta.",
    "flavorText": "A primeira lição do Conclave é enxergar três turnos à frente.",
    "imagePath": "/assets/cards/blue_109_estudante_astral.webp"
  },
  {
    "id": "blue_110_enguia_voltaica",
    "name": "Enguia Voltaica Abissal",
    "domain": "blue",
    "type": "creature",
    "subtype": "Fera • Aquático",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Paralisa e Congela 1 inimigo."
      }
    ],
    "description": "Voo. Ao Entrar: Descarrega um choque glacial que Congela 1 unidade inimiga.",
    "flavorText": "Flutua nas correntes de ar tempestuoso como se fossem águas profundas.",
    "imagePath": "/assets/cards/blue_110_enguia_voltaica.webp"
  },
  {
    "id": "blue_111_tecelao_geada",
    "name": "Tecelão de Geada Rúnica",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elfo • Criomante",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Alcance. Ao Entrar: Tece correntes de gelo rúnico que Congelam 1 unidade inimiga.",
    "flavorText": "Um único gesto de seus dedos transforma o suor do inimigo em estátua.",
    "imagePath": "/assets/cards/blue_111_tecelao_geada.webp"
  },
  {
    "id": "blue_112_golem_gelo_runico",
    "name": "Golem de Gelo Rúnico",
    "domain": "blue",
    "type": "creature",
    "subtype": "Constructo • Golem",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Atacar: Congela 1 inimigo."
      }
    ],
    "description": "Guardião. Armadura 2. Ao Atacar: Seu punho glacial Congela 1 unidade inimiga.",
    "flavorText": "Esculpido na geleira mais antiga do norte, seu coração de cristal jamais derrete.",
    "imagePath": "/assets/cards/blue_112_golem_gelo_runico.webp"
  },
  {
    "id": "blue_113_navegador_fenda",
    "name": "Navegador da Fenda Planar",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Cronomante",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      }
    ],
    "description": "Alcance. Ao Entrar: Abre um atalho entre as estrelas e compra 2 cartas.",
    "flavorText": "Todos os mapas terrestres são obsoletos quando se navega pelo éter.",
    "imagePath": "/assets/cards/blue_113_navegador_fenda.webp"
  },
  {
    "id": "blue_114_draco_nevasca",
    "name": "Draco da Nevasca Diamante",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Draco",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo"
    ],
    "breathDamage": 1,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Voo. Armadura 1. Sopro 1. Ao Entrar: Congela 1 unidade inimiga.",
    "flavorText": "Suas asas espalham granizo afiado como diamantes lapidados.",
    "imagePath": "/assets/cards/blue_114_draco_nevasca.webp"
  },
  {
    "id": "blue_115_oraculo_mar_profundo",
    "name": "Oráculo das Fossas Marinhas",
    "domain": "blue",
    "type": "creature",
    "subtype": "Tritão • Oráculo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta."
      }
    ],
    "description": "Alcance, Escudo Divino. Armadura 1. Início do Turno: Compra 1 carta adicional.",
    "flavorText": "As correntes profundas sussurram segredos que a superfície há muito esqueceu.",
    "imagePath": "/assets/cards/blue_115_oraculo_mar_profundo.webp"
  },
  {
    "id": "blue_116_kraken_tempestade",
    "name": "Kraken Couraçado da Tempestade",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Titã",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela toda a Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Atropelar. Armadura 2. Ao Entrar: Ergue um maremoto glacial que Congela toda a Vanguarda inimiga.",
    "flavorText": "Quando emerge do abismo oceânico, frotas inteiras desaparecem sob a espuma branca.",
    "imagePath": "/assets/cards/blue_116_kraken_tempestade.webp"
  },
  {
    "id": "blue_117_arconte_astral",
    "name": "Orion, Arconte da Tempestade Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Celestial • Arconte Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela toda a Vanguarda inimiga."
      }
    ],
    "description": "Voo, Escudo Divino, Alcance. Armadura 1. Ao Entrar: Causa 3 de dano e Congela toda a Vanguarda inimiga.",
    "flavorText": "Sua voz é o trovão que silencia os exércitos mortais.",
    "imagePath": "/assets/cards/blue_117_arconte_astral.webp"
  },
  {
    "id": "blue_118_lanca_glacial",
    "name": "Lança Glacial Perfurante",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Gelo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela o alvo."
      }
    ],
    "description": "Feitiço: Dispara uma estalactite rúnica que causa 3 de dano a um inimigo e o Congela.",
    "flavorText": "Fria o bastante para parar o coração antes de estilhaçar a armadura.",
    "imagePath": "/assets/cards/blue_118_lanca_glacial.webp"
  },
  {
    "id": "blue_119_convergencia_runica",
    "name": "Convergência Rúnica",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Runa",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1 de Essência neste turno."
      }
    ],
    "description": "Feitiço: Alinha os círculos de mana para comprar 2 cartas e gerar +1⚡ de Essência neste turno.",
    "flavorText": "Conhecimento é poder, e o poder flui para quem sabe ler as runas.",
    "imagePath": "/assets/cards/blue_119_convergencia_runica.webp"
  },
  {
    "id": "blue_120_prisao_zero_absoluto",
    "name": "Estase do Zero Absoluto",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Criomancia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Congela todas as unidades na Vanguarda inimiga e compra 1 carta.",
    "flavorText": "Até o próprio tempo congela quando a temperatura atinge o zero planar.",
    "imagePath": "/assets/cards/blue_120_prisao_zero_absoluto.webp"
  },
  {
    "id": "blue_121_tempestade_mental",
    "name": "Tempestade Psíquica",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Tempestade",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Relâmpagos astrais atingem a fileira inimiga causando 3 de dano e comprando 1 carta.",
    "flavorText": "O trovão ecoa não nos ouvidos, mas dentro da mente de cada inimigo.",
    "imagePath": "/assets/cards/blue_121_tempestade_mental.webp"
  },
  {
    "id": "blue_122_colapso_gravidade",
    "name": "Colapso Gravitacional",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cosmos Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 4 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela toda a Vanguarda inimiga."
      }
    ],
    "description": "Feitiço Lendário: Comprime o espaço sobre o exército rival, causando 4 de dano em área e Congelando toda a Vanguarda inimiga.",
    "flavorText": "Quando uma estrela colapsa, nem a luz escapa de seu abraço.",
    "imagePath": "/assets/cards/blue_122_colapso_gravidade.webp"
  },
  {
    "id": "blue_123_barreira_refrataria",
    "name": "Barreira Refratária de Gelo",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Gelo",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      }
    ],
    "description": "Armadilha Oculta: Ergue um espelho de gelo que concede Escudo Divino aos aliados e Congela o atacante.",
    "flavorText": "A lâmina que bate neste espelho fica presa nele.",
    "imagePath": "/assets/cards/blue_123_barreira_refrataria.webp"
  },
  {
    "id": "blue_124_dissipar_essencia",
    "name": "Dissipação Rúnica",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Armadilha Oculta: Desfaz o ímpeto inimigo em cristais de estase, Congelando a Vanguarda rival e comprando 1 carta.",
    "flavorText": "Sua magia foi desfeita antes mesmo da última sílaba deixar seus lábios.",
    "imagePath": "/assets/cards/blue_124_dissipar_essencia.webp"
  },
  {
    "id": "blue_125_astrolabio_infinito",
    "name": "Astrolábio do Infinito",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Cronomancia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1 de Essência."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Início do Turno: Gera +1⚡ de Essência.",
    "flavorText": "Seus anéis de safira giram no compasso exato das marés astrais.",
    "imagePath": "/assets/cards/blue_125_astrolabio_infinito.webp"
  },
  {
    "id": "blue_126_tomo_zero_absoluto",
    "name": "Grimório do Zero Absoluto",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Grimório",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Congela 1 inimigo. Início do Turno: Compra 1 carta.",
    "flavorText": "Encadernado em gelo eterno, só pode ser lido por quem não teme o inverno.",
    "imagePath": "/assets/cards/blue_126_tomo_zero_absoluto.webp"
  },
  {
    "id": "purple_109_servo_catacumba",
    "name": "Servo Esquelético da Catacumba",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Esqueleto",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Renascer"
    ],
    "effects": [],
    "description": "Renascer. Mesmo despedaçado, seus ossos voltam a se unir uma segunda vez.",
    "flavorText": "A morte não é dispensa do serviço militar na Cripta.",
    "imagePath": "/assets/cards/purple_109_servo_catacumba.webp"
  },
  {
    "id": "purple_110_morcego_sanguinario",
    "name": "Morcego Sanguinário Abissal",
    "domain": "purple",
    "type": "creature",
    "subtype": "Fera • Vampiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Dreno de Vida. Cada mordida transfere vitalidade diretamente ao seu Soberano.",
    "flavorText": "Silencioso como o veludo da meia-noite, faminto como o abismo.",
    "imagePath": "/assets/cards/purple_110_morcego_sanguinario.webp"
  },
  {
    "id": "purple_111_tecelao_maldicoes",
    "name": "Tecelão de Maldições Umbrais",
    "domain": "purple",
    "type": "creature",
    "subtype": "Humanoide • Bruxo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Drena 2 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Alcance. Ao Entrar: Drena 2 de VIDA do Soberano inimigo para o seu Soberano.",
    "flavorText": "Cada nó em seu fio negro aperta o coração de um rei distante.",
    "imagePath": "/assets/cards/purple_111_tecelao_maldicoes.webp"
  },
  {
    "id": "purple_112_carnical_cripta",
    "name": "Carniçal Devorador da Cripta",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Carniçal",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Renascer"
    ],
    "effects": [],
    "description": "Toque Letal, Renascer. Abate qualquer criatura que ferir e retorna da Cripta.",
    "flavorText": "Sua fome sobrevive até mesmo à própria destruição.",
    "imagePath": "/assets/cards/purple_112_carnical_cripta.webp"
  },
  {
    "id": "purple_113_dama_mortalha",
    "name": "Dama Espectral da Mortalha",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Espírito",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Dreno de Vida. Desliza furtivamente através das defesas como névoa fria.",
    "flavorText": "Seu lamento gela o sangue antes que seu toque roube a alma.",
    "imagePath": "/assets/cards/purple_113_dama_mortalha.webp"
  },
  {
    "id": "purple_114_cavaleiro_sangue_negro",
    "name": "Cavaleiro do Sangue Negro",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Cavaleiro",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Dreno de Vida, Fúria Crescente. Armadura 1. Fortalece-se a cada golpe enquanto restaura seu Soberano.",
    "flavorText": "Sua armadura negra bebe o sangue derramado no campo.",
    "imagePath": "/assets/cards/purple_114_cavaleiro_sangue_negro.webp"
  },
  {
    "id": "purple_115_golem_ossario",
    "name": "Golem do Ossário Profano",
    "domain": "purple",
    "type": "creature",
    "subtype": "Constructo • Morto-Vivo",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Renascer"
    ],
    "effects": [],
    "description": "Guardião, Renascer. Armadura 2. Uma muralha de crânios e ferro que se reconstrói após cair.",
    "flavorText": "Cem guerreiros caídos formam um único escudo intransponível.",
    "imagePath": "/assets/cards/purple_115_golem_ossario.webp"
  },
  {
    "id": "purple_116_devorador_mentes",
    "name": "Soberano da Coroa Psiônica",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Morto-Vivo • Rei-Lich Astral",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano psíquico a um inimigo."
      }
    ],
    "description": "Alcance, Dreno de Vida. Armadura 1. Ao Entrar: Desfere uma rajada astral que causa 3 de dano a um inimigo.",
    "flavorText": "Sob a coroa de cristais violetas, até os generais mais bravos ajoelham sem saber por quê.",
    "imagePath": "/assets/cards/purple_116_devorador_mentes.webp"
  },
  {
    "id": "purple_117_conde_nosferatu",
    "name": "Nosferatu, Monarca Carmesim",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Vampiro",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao Entrar: Drena 3 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Voo, Dreno de Vida, Renascer. Armadura 1. Ao Entrar: Drena 3 de VIDA do Soberano rival para o seu.",
    "flavorText": "Séculos passam como minutos para o senhor do castelo de sangue.",
    "imagePath": "/assets/cards/purple_117_conde_nosferatu.webp"
  },
  {
    "id": "purple_118_serafim_caido",
    "name": "Serafim Caído do Vazio",
    "domain": "purple",
    "type": "creature",
    "subtype": "Celestial • Caído",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Toque Letal",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Toque Letal, Dreno de Vida. Armadura 1. Suas seis asas negras anunciam o julgamento final.",
    "flavorText": "A luz que um dia carregou transformou-se na mais pura meia-noite.",
    "imagePath": "/assets/cards/purple_118_serafim_caido.webp"
  },
  {
    "id": "purple_119_soberano_entropia",
    "name": "Malakor, Imperador da Entropia",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Soberano Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Dreno de Vida, Renascer. Armadura 1. Ao Entrar: Causa 3 de dano a todos os inimigos e cura 3 no seu Soberano.",
    "flavorText": "Tudo o que nasce pertence, no fim, ao trono de Malakor.",
    "imagePath": "/assets/cards/purple_119_soberano_entropia.webp"
  },
  {
    "id": "purple_120_colheita_almas",
    "name": "Colheita de Almas",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Ceifa a força vital de um inimigo, causando 3 de dano e curando 3 de VIDA no seu Soberano.",
    "flavorText": "A foice espiritual nunca retorna de mãos vazias.",
    "imagePath": "/assets/cards/purple_120_colheita_almas.webp"
  },
  {
    "id": "purple_121_banquete_vampirico",
    "name": "Banquete Vampírico",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Sangue",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 4,
        "description": "Drena 4 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Cura 4 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Feitiço: Drena 4 de VIDA do Soberano inimigo para o seu Soberano e compra 1 carta.",
    "flavorText": "Um brinde carmesim à saúde eterna da corte sombria.",
    "imagePath": "/assets/cards/purple_121_banquete_vampirico.webp"
  },
  {
    "id": "purple_122_praga_necrotica",
    "name": "Praga Necrótica da Cripta",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Peste",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Uma névoa apodrecida varre o campo, causando 3 de dano a todos os inimigos e curando 2 no seu Soberano.",
    "flavorText": "Os vivos murcham; os senhores da Cripta florescem.",
    "imagePath": "/assets/cards/purple_122_praga_necrotica.webp"
  },
  {
    "id": "purple_123_eclipse_abissal",
    "name": "Eclipse do Sol Abissal",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Eclipse Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 4 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 4,
        "description": "Drena 4 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço Lendário: O Sol Negro engole o dia, causando 4 de dano a todos os inimigos e drenando 4 de VIDA do Soberano rival para o seu.",
    "flavorText": "Quando a coroa negra se fecha no céu, toda esperança se apaga.",
    "imagePath": "/assets/cards/purple_123_eclipse_abissal.webp"
  },
  {
    "id": "purple_124_espelho_agonia",
    "name": "Espelho da Agonia Eterna",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Maldição",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Armadilha Oculta: Reflete a dor do golpe, causando 3 de dano ao atacante e curando 2 de VIDA no seu Soberano.",
    "flavorText": "Ferir o reflexo é sangrar na própria carne.",
    "imagePath": "/assets/cards/purple_124_espelho_agonia.webp"
  },
  {
    "id": "purple_125_ataude_sangue",
    "name": "Ataúde de Sangue Real",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Sarcófago",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Drena 2 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Drena 2 de VIDA do Soberano rival. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Dentro do ouro negro repousa a sede imortal da dinastia.",
    "imagePath": "/assets/cards/purple_125_ataude_sangue.webp"
  },
  {
    "id": "purple_126_campanario_mortos",
    "name": "Campanário dos Mortos",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Monumento",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Início do Turno: Drena 2 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Concede +1/+1 aos aliados. Início do Turno: Drena 2 de VIDA do Soberano rival para o seu.",
    "flavorText": "Cada badalada convoca os caídos e anuncia o fim dos vivos.",
    "imagePath": "/assets/cards/purple_126_campanario_mortos.webp"
  },
  {
    "id": "green_109_lince_espinhos",
    "name": "Lince dos Espinhos",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Felino",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Embosca inimigos expostos entre os espinheiros de Veridia.",
    "flavorText": "Mais veloz que uma flecha disparada entre os galhos.",
    "imagePath": "/assets/cards/green_109_lince_espinhos.webp"
  },
  {
    "id": "green_110_javali_couraca_pedra",
    "name": "Javali Couraça-de-Pedra",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Javali",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [],
    "description": "Guardião, Atropelar. Armadura 1. Couraça mineral que resiste às investidas da Vanguarda.",
    "flavorText": "Ele não desvia de árvores nem de escudeiros.",
    "imagePath": "/assets/cards/green_110_javali_couraca_pedra.webp"
  },
  {
    "id": "green_111_arqueira_dossel",
    "name": "Arqueira do Dossel Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Elfo • Arqueiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Alcance • Toque Letal. Dispara flechas embebidas em seiva letal do alto do dossel.",
    "flavorText": "Do alto das copas, um único disparo basta.",
    "imagePath": "/assets/cards/green_111_arqueira_dossel.webp"
  },
  {
    "id": "green_112_escorpiao_jade",
    "name": "Escorpião de Carapaça de Jade",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Aracnídeo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Guardião, Toque Letal. Armadura 1. Tranca a coluna com suas pinças de jade e ferrão mortal.",
    "flavorText": "Nem o aço mais espesso impede seu veneno de ferver o sangue.",
    "imagePath": "/assets/cards/green_112_escorpiao_jade.webp"
  },
  {
    "id": "green_113_alce_coroa_solar",
    "name": "Grande Alce da Coroa Solar",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Espírito",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Ímpeto. Ao Entrar: A luz da clareira restaura 3 de VIDA no seu Soberano.",
    "flavorText": "Entre seus galhos dourados floresce a primavera eterna.",
    "imagePath": "/assets/cards/green_113_alce_coroa_solar.webp"
  },
  {
    "id": "green_114_crocodilo_pantano_rei",
    "name": "Rei Crocodilo do Pântano",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Réptil",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Atropelar, Fúria Crescente. Armadura 1. Suas mandíbulas esmagam escudos e crescem em ferocidade.",
    "flavorText": "O pântano inteiro silencia quando o rei das águas rasas abre os olhos.",
    "imagePath": "/assets/cards/green_114_crocodilo_pantano_rei.webp"
  },
  {
    "id": "green_115_carnotauro_chifre",
    "name": "Carnotauro Chifre-de-Ferro",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Dinossauro",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Ímpeto, Atropelar. Corre em velocidade máxima para esmagar a linha frontal no turno em que entra.",
    "flavorText": "Dois chifres de ferro vivo impulsionados por toneladas de músculo.",
    "imagePath": "/assets/cards/green_115_carnotauro_chifre.webp"
  },
  {
    "id": "green_116_ent_espinheiro_anciao",
    "name": "Ent Espinheiro Ancião",
    "domain": "green",
    "type": "creature",
    "subtype": "Planta • Guardião",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Raízes espinhosas concedem +1/+1 aos aliados."
      }
    ],
    "description": "Guardião, Alcance. Armadura 2. Ao Entrar: Raízes de seiva dourada curam 3 de VIDA e concedem +1/+1 a todos os seus aliados.",
    "flavorText": "Sob sua sombra protetora, nenhuma ferida permanece aberta.",
    "imagePath": "/assets/cards/green_116_ent_espinheiro_anciao.webp"
  },
  {
    "id": "green_117_mamute_esmeralda",
    "name": "Mamute de Presas Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Colosso",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião"
    ],
    "effects": [],
    "description": "Atropelar, Guardião. Armadura 1. Tanto muralha intransponível quanto aríete imparável.",
    "flavorText": "Suas presas de cristal verde partem muralhas de pedra ao meio.",
    "imagePath": "/assets/cards/green_117_mamute_esmeralda.webp"
  },
  {
    "id": "green_118_espinossauro_abissal",
    "name": "Espinossauro Alfa Primordial",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Dinossauro",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Atropelar, Fúria Crescente. Armadura 1. Domina rios e selvas com ferocidade inigualável.",
    "flavorText": "Sua vela dorsal brilha com o verde bioluminescente da era perdida.",
    "imagePath": "/assets/cards/green_118_espinossauro_abissal.webp"
  },
  {
    "id": "green_119_behemoth_cratera_verde",
    "name": "Behemoth da Cratera Verde",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Titã",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Atropelar, Guardião. Armadura 2. Ao Entrar: Seu rugido concede +1/+1 a todas as suas unidades.",
    "flavorText": "As montanhas são apenas os degraus por onde ele caminha.",
    "imagePath": "/assets/cards/green_119_behemoth_cratera_verde.webp"
  },
  {
    "id": "green_120_hidra_primordial_rei",
    "name": "Hidra-Rei de Sete Cabeças",
    "domain": "green",
    "type": "creature",
    "subtype": "Monstruosidade • Hidra",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Renascer"
    ],
    "breathDamage": 2,
    "effects": [],
    "description": "Atropelar, Renascer. Armadura 1. Sopro 2: Varre a fileira inimiga com jatos de peçonha ácida.",
    "flavorText": "Sete coroas de escamas, sete fomes que jamais dormem.",
    "imagePath": "/assets/cards/green_120_hidra_primordial_rei.webp"
  },
  {
    "id": "green_121_avatar_gaia",
    "name": "Tellurion, Avatar Primordial da Terra Viva",
    "domain": "green",
    "type": "creature",
    "subtype": "Elemental • Avatar Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Atropelar, Guardião. Armadura 2. Ao Entrar: Concede +2/+2 a todos os aliados e cura 4 de VIDA no seu Soberano.",
    "flavorText": "A própria floresta ergueu-se em forma titânica para reclamar o mundo.",
    "imagePath": "/assets/cards/green_121_avatar_gaia.webp"
  },
  {
    "id": "green_122_furia_matilha_alfa",
    "name": "Rugido da Matilha Alfa",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Matilha",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2 ATQ e +1 VIDA a todos os seus aliados."
      }
    ],
    "description": "Feitiço: O uivo alfa ecoa pela mata, concedendo +2/+1 a todas as suas unidades.",
    "flavorText": "Um lobo caça por fome; a alcateia inteira caça por domínio.",
    "imagePath": "/assets/cards/green_122_furia_matilha_alfa.webp"
  },
  {
    "id": "green_123_crescimento_titanico",
    "name": "Crescimento Titânico da Floresta",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Natureza",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2/+2 a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Concede +2/+2 a todos os seus aliados e restaura 3 de VIDA no seu Soberano.",
    "flavorText": "Em segundos, mudas tornam-se sequoias e feras tornam-se titãs.",
    "imagePath": "/assets/cards/green_123_crescimento_titanico.webp"
  },
  {
    "id": "green_124_casulo_espinhos",
    "name": "Casulo de Espinhos Venenosos",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Espinhos",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano ao atacante."
      }
    ],
    "description": "Armadilha Oculta: Envolve seus aliados em Escudo Divino de madeira viva e causa 2 de dano ao atacante.",
    "flavorText": "A roseira protege o ninho com mil agulhas envenenadas.",
    "imagePath": "/assets/cards/green_124_casulo_espinhos.webp"
  },
  {
    "id": "green_125_totem_predador_alfa",
    "name": "Totem do Predador Alfa",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Totem",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: Concede +1/+1 a todos os aliados. Início do Turno: Concede +1/+1 a um aliado.",
    "flavorText": "Esculpido no carvalho mais antigo e consagrado com garras de urso-rei.",
    "imagePath": "/assets/cards/green_125_totem_predador_alfa.webp"
  },
  {
    "id": "green_126_coracao_selva_viva",
    "name": "Coração da Selva Viva",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Santuário",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA em todos os aliados."
      }
    ],
    "description": "Ao Entrar: Cura 3 de VIDA no seu Soberano. Início do Turno: Cura 2 de VIDA em todos os aliados.",
    "flavorText": "Seu pulso esmeralda faz brotar vida até mesmo na pedra nua.",
    "imagePath": "/assets/cards/green_126_coracao_selva_viva.webp"
  },
  {
    "id": "gold_109_escudeiro_cidadela",
    "name": "Escudeiro da Cidadela Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Soldado",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 1,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Guardião, Escudo Divino. Armadura 1. Segura a primeira investida inimiga sem recuar um passo.",
    "flavorText": "O escudo é mais pesado que o jovem que o empunha, mas sua fé é maior.",
    "imagePath": "/assets/cards/gold_109_escudeiro_cidadela.webp"
  },
  {
    "id": "gold_110_besteiro_sol_nascente",
    "name": "Besteiro do Sol Nascente",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Atirador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Alcance, Escudo Divino. Dispara virotes consagrados protegido por uma redoma de luz.",
    "flavorText": "Cada virote é gravado com uma oração de precisão infalível.",
    "imagePath": "/assets/cards/gold_110_besteiro_sol_nascente.webp"
  },
  {
    "id": "gold_111_templario_martelo",
    "name": "Templário do Martelo Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Paladino",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Escudo Divino. Armadura 1. Ao Entrar: Restaura 2 de VIDA no seu Soberano.",
    "flavorText": "Seu martelo forja a paz no calor da batalha.",
    "imagePath": "/assets/cards/gold_111_templario_martelo.webp"
  },
  {
    "id": "gold_112_golem_marmore_real",
    "name": "Golem de Mármore e Ouro Real",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Golem",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Armadura 2. Colosso de mármore consagrado que ancora a Vanguarda imperial.",
    "flavorText": "As estátuas do palácio descem de seus pedestais quando o trono chama.",
    "imagePath": "/assets/cards/gold_112_golem_marmore_real.webp"
  },
  {
    "id": "gold_113_valquiria_alvorada",
    "name": "Valquíria da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Valquíria",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Voo, Ímpeto, Escudo Divino. Armadura 1. Desce em mergulho solar no mesmo turno em que é invocada.",
    "flavorText": "Suas asas brilham como o primeiro raio de sol após a tempestade.",
    "imagePath": "/assets/cards/gold_113_valquiria_alvorada.webp"
  },
  {
    "id": "gold_114_inquisidor_chama_solar",
    "name": "Inquisidor da Chama Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Inquisidor",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano radiante a um inimigo."
      }
    ],
    "description": "Alcance. Armadura 1. Ao Entrar: Julga um inimigo com fogo sagrado, causando 3 de dano.",
    "flavorText": "Nenhuma sombra se esconde sob o sol do meio-dia.",
    "imagePath": "/assets/cards/gold_114_inquisidor_chama_solar.webp"
  },
  {
    "id": "gold_115_leao_celestial_rei",
    "name": "Leão-Rei Celestial",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Fera",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Guardião, Escudo Divino. Armadura 1. Ao Entrar: Seu rugido real concede +1/+1 a todos os seus aliados.",
    "flavorText": "Sua juba é tecida com fios de luz solar pura.",
    "imagePath": "/assets/cards/gold_115_leao_celestial_rei.webp"
  },
  {
    "id": "gold_116_centuriao_forja_dourada",
    "name": "Centurião da Forja Dourada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Centurião",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Guardião, Dreno de Vida. Armadura 2. Sustenta a linha de frente enquanto restaura a vitalidade do Soberano.",
    "flavorText": "Forjado na disciplina e temperado na vitória.",
    "imagePath": "/assets/cards/gold_116_centuriao_forja_dourada.webp"
  },
  {
    "id": "gold_117_arcanjo_egide",
    "name": "Arcanjo da Égide Dourada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Arcanjo",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 5,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      }
    ],
    "description": "Voo, Guardião, Escudo Divino. Armadura 2. Ao Entrar: Estende suas asas para conceder Escudo Divino a todos os seus aliados.",
    "flavorText": "Enquanto suas asas cobrirem o céu, nenhum fiel cairá.",
    "imagePath": "/assets/cards/gold_117_arcanjo_egide.webp"
  },
  {
    "id": "gold_118_colosso_sol_invicto",
    "name": "Colosso do Sol Invicto",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Colosso",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Guardião, Atropelar, Escudo Divino. Armadura 2. Uma maravilha de bronze solar que marcha sobre os inimigos.",
    "flavorText": "Fundido com o bronze de mil armas inimigas rendidas.",
    "imagePath": "/assets/cards/gold_118_colosso_sol_invicto.webp"
  },
  {
    "id": "gold_119_soberano_ordem_eterna",
    "name": "Justinian, Soberano da Ordem Eterna",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Soberano Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os seus aliados."
      }
    ],
    "description": "Voo, Guardião, Escudo Divino. Armadura 2. Ao Entrar: Concede +2/+2 e Escudo Divino a todos os seus aliados.",
    "flavorText": "Quando Solarius desembainha a Alvorada, a vitória deixa de ser dúvida e torna-se lei.",
    "imagePath": "/assets/cards/gold_119_soberano_ordem_eterna.webp"
  },
  {
    "id": "gold_120_decreto_invencibilidade",
    "name": "Decreto de Invencibilidade",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Decreto",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Proclama proteção imperial, concedendo Escudo Divino a todos os aliados e curando 3 de VIDA no seu Soberano.",
    "flavorText": "Por ordem do Trono Solar, nenhuma lâmina transpassará esta fileira hoje.",
    "imagePath": "/assets/cards/gold_120_decreto_invencibilidade.webp"
  },
  {
    "id": "gold_121_lanca_julgamento_solar",
    "name": "Lança do Julgamento Solar",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Julgamento",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 5,
        "description": "Causa 5 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Feitiço: Uma lança de luz solar pura desce dos céus, causando 5 de dano a um inimigo e curando 3 no seu Soberano.",
    "flavorText": "A sentença desce na velocidade da luz.",
    "imagePath": "/assets/cards/gold_121_lanca_julgamento_solar.webp"
  },
  {
    "id": "gold_122_egide_reflexiva",
    "name": "Égide Solar Reflexiva",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Égide",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Armadilha Oculta: Quando atacado, manifesta Escudo Divino sobre seus aliados e restaura 2 de VIDA no seu Soberano.",
    "flavorText": "O golpe inimigo apenas faz o escudo brilhar mais forte.",
    "imagePath": "/assets/cards/gold_122_egide_reflexiva.webp"
  },
  {
    "id": "gold_123_altar_sol_eterno",
    "name": "Altar do Sol Eterno",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Altar",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Cura 3 de VIDA no seu Soberano. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Sua chama dourada nunca se apaga, nem sob a mais densa tempestade.",
    "imagePath": "/assets/cards/gold_123_altar_sol_eterno.webp"
  },
  {
    "id": "gold_124_estandarte_legiao_dourada",
    "name": "Estandarte da Legião Dourada",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Estandarte",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Ao Entrar e no Início do Turno: Concede +1/+1 a todos os seus aliados.",
    "flavorText": "Onde o estandarte do sol é fincado, os soldados lutam como imortais.",
    "imagePath": "/assets/cards/gold_124_estandarte_legiao_dourada.webp"
  },
  {
    "id": "gold_125_fornalha_celestial",
    "name": "Fornalha Celestial de Armaduras",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Forja",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 2,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Início do Turno: Concede +1/+2 a um aliado."
      }
    ],
    "description": "Ao Entrar: Concede Escudo Divino aos aliados. Início do Turno: Concede +1/+2 a um aliado.",
    "flavorText": "O fogo sagrado molda placas de aurum que nenhuma garra abissal consegue rasgar.",
    "imagePath": "/assets/cards/gold_125_fornalha_celestial.webp"
  },
  {
    "id": "gold_126_coroa_imperador_solar",
    "name": "Coroa do Imperador Solar",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Artefato Lendário",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 2,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Ao Entrar: Concede Escudo Divino aos aliados e cura 3 no Soberano. Início do Turno: Concede +1/+1 a todos os aliados.",
    "flavorText": "Seus doze raios de diamante representam as doze leis eternas da Ordem.",
    "imagePath": "/assets/cards/gold_126_coroa_imperador_solar.webp"
  },
  {
    "id": "red_127_salamandra_faisca",
    "name": "Salamandra Cauda-de-Faísca",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Réptil",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Avança entre as brasas no mesmo turno em que é invocada.",
    "flavorText": "Onde sua cauda toca a madeira, nasce um incêndio.",
    "imagePath": "/assets/cards/red_127_salamandra_faisca.webp"
  },
  {
    "id": "red_128_sapador_piroclastico",
    "name": "Sapador Piroclástico Goblin",
    "domain": "red",
    "type": "creature",
    "subtype": "Goblin • Artilheiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Arremessa um barril de enxofre que causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Pavio curto, risada alta e explosão garantida.",
    "imagePath": "/assets/cards/red_128_sapador_piroclastico.webp"
  },
  {
    "id": "red_129_cao_cinzas_alfa",
    "name": "Cão das Cinzas de Três Cabeças",
    "domain": "red",
    "type": "creature",
    "subtype": "Fera • Infernal",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Uivo das Cinzas concede +1/+1 a um aliado."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Uivo das Cinzas concede +1/+1 a um aliado.",
    "flavorText": "Cada cabeça fareja um medo diferente na linha inimiga.",
    "imagePath": "/assets/cards/red_129_cao_cinzas_alfa.webp"
  },
  {
    "id": "red_130_lanceiro_cratera",
    "name": "Lanceiro de Escama da Cratera",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Guerreiro • Dracônico",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto, Atropelar. Armadura 1. Ao Entrar: Causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Forjada no coração do vulcão, sua ponta nunca esfria.",
    "imagePath": "/assets/cards/red_130_lanceiro_cratera.webp"
  },
  {
    "id": "red_131_forjador_magma_anao",
    "name": "Forjador Rúnico de Magma",
    "domain": "red",
    "type": "creature",
    "subtype": "Anão • Artífice",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Tempera as armas aliadas concedendo +1/+1 a todos os aliados."
      }
    ],
    "description": "Alcance. Ao Entrar: Concede +1/+1 a todos os seus aliados.",
    "flavorText": "Cada martelada na bigorna ecoa como um trovão rubro.",
    "imagePath": "/assets/cards/red_131_forjador_magma_anao.webp"
  },
  {
    "id": "red_132_wyvern_escoria",
    "name": "Wyvern Cauda-de-Escória",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Alado",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a um inimigo."
      }
    ],
    "description": "Voo, Ímpeto. Ao Entrar: Seu ferrão incandescente causa 2 de dano a um inimigo.",
    "flavorText": "Mergulha das nuvens de cinza antes que o alvo possa erguer o escudo.",
    "imagePath": "/assets/cards/red_132_wyvern_escoria.webp"
  },
  {
    "id": "red_133_juggernaut_fornalha",
    "name": "Juggernaut de Ferro da Fornalha",
    "domain": "red",
    "type": "creature",
    "subtype": "Constructo • Cerco",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Atropelar, Fúria Crescente. Máquina de guerra movida a carvão incandescente.",
    "flavorText": "Muralhas são apenas combustível para seus rolos de ferro.",
    "imagePath": "/assets/cards/red_133_juggernaut_fornalha.webp"
  },
  {
    "id": "red_134_senhor_guerra_rubro",
    "name": "General Senhor da Guerra Rubro",
    "domain": "red",
    "type": "creature",
    "subtype": "Humanoide • Comandante",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 0,
        "description": "Ao Entrar: Concede +2 de ATQ a todos os seus aliados."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Seu grito de guerra concede +2 ATQ a todos os seus aliados.",
    "flavorText": "A Legião da Cratera só conhece uma ordem: avançar.",
    "imagePath": "/assets/cards/red_134_senhor_guerra_rubro.webp"
  },
  {
    "id": "red_135_behemoth_piroclastico",
    "name": "Behemoth dos Gêiseres de Fogo",
    "domain": "red",
    "type": "creature",
    "subtype": "Monstruosidade • Vulcânico",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Atropelar. Sopro 2. Suas costas vulcânicas expelem jatos de magma sobre a fileira rival.",
    "flavorText": "Um vulcão ambulante que respira enxofre.",
    "imagePath": "/assets/cards/red_135_behemoth_piroclastico.webp",
    "breathDamage": 2
  },
  {
    "id": "red_136_arquidemonio_brasas",
    "name": "Arquidemônio das Correntes Solares",
    "domain": "red",
    "type": "creature",
    "subtype": "Corruptor • Arquidemônio",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Fúria Crescente. Ao Entrar: Suas correntes incandescentes causam 3 de dano à Vanguarda inimiga.",
    "flavorText": "Nem o aço sagrado resiste ao calor de suas correntes.",
    "imagePath": "/assets/cards/red_136_arquidemonio_brasas.webp"
  },
  {
    "id": "red_137_dragao_cometa_rubro",
    "name": "Dragão do Cometa Carmesim",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Ancião",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Sopro 2. Cai como um meteoro vivo varrendo a linha de frente.",
    "flavorText": "Quando cruza o céu noturno, os astrólogos anunciam o fim de um império.",
    "imagePath": "/assets/cards/red_137_dragao_cometa_rubro.webp",
    "breathDamage": 2
  },
  {
    "id": "red_138_colosso_vulcano_primordial",
    "name": "Vulcanor, Colosso da Caldeira Primordial",
    "domain": "red",
    "type": "creature",
    "subtype": "Elemental • Titã Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 3,
        "description": "Ao Entrar: Erupção Primordial causa 3 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Atropelar. Sopro 2. Ao Entrar: Causa 3 de dano a todos os inimigos e 2 ao Soberano rival.",
    "flavorText": "Ele não habita a cratera ardente — ele é a própria cratera.",
    "imagePath": "/assets/cards/red_138_colosso_vulcano_primordial.webp",
    "breathDamage": 2
  },
  {
    "id": "red_139_rajada_escoria",
    "name": "Rajada de Lanças de Escória",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Causa 2 de dano a todos os inimigos na Vanguarda e 1 de dano ao Soberano rival.",
    "flavorText": "Uma chuva de ferro derretido que não deixa onde se abrigar.",
    "imagePath": "/assets/cards/red_139_rajada_escoria.webp"
  },
  {
    "id": "red_140_explosao_fornalha",
    "name": "Detonação do Núcleo da Fornalha",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Piroclasma",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Concede +1 de ATQ a todos os seus aliados."
      }
    ],
    "description": "Causa 4 de dano a um inimigo e concede +1 ATQ a todos os seus aliados.",
    "flavorText": "A pressão acumulada explode em fúria para toda a legião.",
    "imagePath": "/assets/cards/red_140_explosao_fornalha.webp"
  },
  {
    "id": "red_141_sangue_fervente",
    "name": "Ritual do Sangue Fervente",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Transmutação",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2/+1 a todos os seus aliados."
      }
    ],
    "description": "Concede +2 de ATQ e +1 de VIDA a todas as suas unidades em campo.",
    "flavorText": "O sangue dracônico ferve nas veias de cada soldado.",
    "imagePath": "/assets/cards/red_141_sangue_fervente.webp"
  },
  {
    "id": "red_142_tormenta_meteoros_rubros",
    "name": "Tormenta de Meteoros Rubros",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 4,
        "description": "Causa 4 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Causa 4 de dano a todas as unidades inimigas e 2 de dano ao Soberano rival.",
    "flavorText": "Os céus se rasgam em rocha fundida e chamas.",
    "imagePath": "/assets/cards/red_142_tormenta_meteoros_rubros.webp"
  },
  {
    "id": "red_143_julgamento_vulcanico",
    "name": "Fissura do Julgamento Vulcânico",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 5,
        "description": "Causa 5 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 0,
        "description": "Concede +2 de ATQ a todos os seus aliados."
      }
    ],
    "description": "Causa 5 de dano a todos os inimigos e concede +2 ATQ a todos os seus aliados.",
    "flavorText": "Quando a terra se abre em magma, apenas os filhos do fogo permanecem de pé.",
    "imagePath": "/assets/cards/red_143_julgamento_vulcanico.webp"
  },
  {
    "id": "red_144_escudo_magma_reativo",
    "name": "Escudo de Magma Reativo",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Emboscada",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Gatilho: Aliado Atacado. Concede Escudo Divino a um aliado e causa 2 de dano ao Soberano rival.",
    "flavorText": "Golpear este escudo é como martelar a boca de um vulcão.",
    "imagePath": "/assets/cards/red_144_escudo_magma_reativo.webp"
  },
  {
    "id": "red_145_emboscada_geiser",
    "name": "Emboscada do Gêiser Piroclástico",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Causa 1 de dano ao Soberano inimigo."
      }
    ],
    "description": "Gatilho: Inimigo Invocado. Causa 4 de dano a um inimigo e 1 de dano ao Soberano rival.",
    "flavorText": "O solo parecia firme até o vapor superaquecido explodir.",
    "imagePath": "/assets/cards/red_145_emboscada_geiser.webp"
  },
  {
    "id": "red_146_coroa_chama_eterna",
    "name": "Coroa da Caldeira Eterna",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Regalia Dracônica",
    "rarity": "legendary",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Início do Turno: Concede +1 de ATQ a todos os aliados."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga. Início do Turno: +1 ATQ aos aliados.",
    "flavorText": "Forjada com os chifres do primeiro dragão vermelho e rubis de fogo vivo.",
    "imagePath": "/assets/cards/red_146_coroa_chama_eterna.webp"
  },
  {
    "id": "blue_127_familiar_gelo_astral",
    "name": "Familiar de Cristal Glacial",
    "domain": "blue",
    "type": "creature",
    "subtype": "Fada • Elemental",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Voo, Alcance. Ao Entrar: Congela 1 unidade inimiga.",
    "flavorText": "Pequeno como um floco de neve, frio como o vácuo entre as estrelas.",
    "imagePath": "/assets/cards/blue_127_familiar_gelo_astral.webp"
  },
  {
    "id": "blue_128_sentinela_mare",
    "name": "Sentinela Tritão da Maré",
    "domain": "blue",
    "type": "creature",
    "subtype": "Tritão • Guardião",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Seu escudo de água rodopiante absorve o impacto das investidas.",
    "flavorText": "Inabalável como a maré alta contra os rochedos.",
    "imagePath": "/assets/cards/blue_128_sentinela_mare.webp"
  },
  {
    "id": "blue_129_cronomante_ampulheta",
    "name": "Cronomante da Ampulheta Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Mago",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Alcance. Ao Entrar: Compra 1 carta do seu Grimório.",
    "flavorText": "Cada grão de areia que cai revela o próximo movimento do inimigo.",
    "imagePath": "/assets/cards/blue_129_cronomante_ampulheta.webp"
  },
  {
    "id": "blue_130_arraia_tempestade",
    "name": "Arraia-Celeste da Tempestade",
    "domain": "blue",
    "type": "creature",
    "subtype": "Fera • Elemental",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Voo, Ímpeto. Desliza pelas correntes elétricas para atacar de imediato.",
    "flavorText": "Nada nas nuvens de tempestade como se fossem oceanos profundos.",
    "imagePath": "/assets/cards/blue_130_arraia_tempestade.webp"
  },
  {
    "id": "blue_131_cavaleiro_geada_real",
    "name": "Cavaleiro Real da Geada",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Cavaleiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Guardião. Ao Entrar: Sua lança de diamante glacial congela 1 inimigo.",
    "flavorText": "A cavalaria do Conclave avança em silêncio absoluto.",
    "imagePath": "/assets/cards/blue_131_cavaleiro_geada_real.webp"
  },
  {
    "id": "blue_132_esfinge_nebulosa",
    "name": "Esfinge da Nebulosa Safira",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Astral",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo, Escudo Divino. Ao Entrar: Compra 1 carta.",
    "flavorText": "Seus enigmas são escritos com constelações inteiras.",
    "imagePath": "/assets/cards/blue_132_esfinge_nebulosa.webp"
  },
  {
    "id": "blue_133_serpente_fenda_marinha",
    "name": "Serpente da Fossa Abissal",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Leviatã",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Atropelar. Ao Entrar: Congela 1 unidade inimiga.",
    "flavorText": "Quando emerge das fossas marinhas, até os navios de guerra viram estátuas de gelo.",
    "imagePath": "/assets/cards/blue_133_serpente_fenda_marinha.webp"
  },
  {
    "id": "blue_134_arquimago_singularidade",
    "name": "Arquimago da Singularidade",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humanoide • Arquimago",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Alcance, Escudo Divino. Ao Entrar: Causa 2 de dano à Vanguarda inimiga e compra 1 carta.",
    "flavorText": "Domina a gravidade e o relâmpago com um único gesto.",
    "imagePath": "/assets/cards/blue_134_arquimago_singularidade.webp"
  },
  {
    "id": "blue_135_dragao_glaciar_eterno",
    "name": "Dragão do Glaciar Eterno",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Ancião",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela (imobiliza por 1 turno) toda a Vanguarda inimiga."
      }
    ],
    "description": "Voo • Pele Incandescente. Ao Entrar: Congela (imobiliza por 1 turno) toda a Vanguarda inimiga.",
    "flavorText": "Suas asas carregam o inverno de eras esquecidas.",
    "imagePath": "/assets/cards/blue_135_dragao_glaciar_eterno.webp"
  },
  {
    "id": "blue_136_leviata_cronos",
    "name": "Chronoleviatã, Soberano do Tempo",
    "domain": "blue",
    "type": "creature",
    "subtype": "Monstruosidade • Titã Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      }
    ],
    "description": "Voo, Escudo Divino. Ao Entrar: Congela todos os inimigos e compra 2 cartas.",
    "flavorText": "Rompe o próprio relógio do cosmos para paralisar exércitos inteiros.",
    "imagePath": "/assets/cards/blue_136_leviata_cronos.webp"
  },
  {
    "id": "blue_137_estilhaco_cometa",
    "name": "Chuva de Estilhaços de Cometa",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Evocação",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      }
    ],
    "description": "Causa 2 de dano à Vanguarda inimiga e congela 1 inimigo.",
    "flavorText": "Fragmentos de gelo estelar que cortam como diamante.",
    "imagePath": "/assets/cards/blue_137_estilhaco_cometa.webp"
  },
  {
    "id": "blue_138_correntes_geada",
    "name": "Correntes do Glaciar",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Controle",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Congela 1 unidade inimiga e compra 1 carta.",
    "flavorText": "Elos de gelo rúnico que prendem até titãs.",
    "imagePath": "/assets/cards/blue_138_correntes_geada.webp"
  },
  {
    "id": "blue_139_visao_onisciente",
    "name": "Visão do Olho Onisciente",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Adivinhação",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Compra 2 cartas e restaura 2 de VIDA ao seu Soberano.",
    "flavorText": "Enxergar todos os futuros possíveis é a maior das defesas.",
    "imagePath": "/assets/cards/blue_139_visao_onisciente.webp"
  },
  {
    "id": "blue_140_vortice_polar",
    "name": "Vórtice do Ciclone Polar",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Tempestade",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela os inimigos."
      }
    ],
    "description": "Causa 3 de dano à Vanguarda inimiga e congela os inimigos.",
    "flavorText": "No olho do furacão glacial, o próprio ar se solidifica.",
    "imagePath": "/assets/cards/blue_140_vortice_polar.webp"
  },
  {
    "id": "blue_141_ruptura_temporal",
    "name": "Ruptura do Relógio Astral",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Ganha +2⚡ de Essência neste turno."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Congela os inimigos, concede +2⚡ de Essência neste turno e compra 1 carta.",
    "flavorText": "Um segundo para o Conclave equivale a uma eternidade para o adversário.",
    "imagePath": "/assets/cards/blue_141_ruptura_temporal.webp"
  },
  {
    "id": "blue_142_diluvio_astral",
    "name": "Dilúvio da Fenda Cósmica",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 4,
        "description": "Causa 4 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Causa 4 de dano a todos os inimigos, congela as tropas rivais e compra 1 carta.",
    "flavorText": "O oceano das estrelas desaba sobre o campo de batalha.",
    "imagePath": "/assets/cards/blue_142_diluvio_astral.webp"
  },
  {
    "id": "blue_143_contra_feitico_runico",
    "name": "Contra-Feitiço Hexagonal",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Gatilho: Feitiço Inimigo. Concede Escudo Divino aos aliados e compra 1 carta.",
    "flavorText": "A magia rival se desfaz em pura sabedoria rúnica.",
    "imagePath": "/assets/cards/blue_143_contra_feitico_runico.webp"
  },
  {
    "id": "blue_144_espelho_geada",
    "name": "Espelho Congelante",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Crio-Barreira",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a um aliado."
      }
    ],
    "description": "Gatilho: Aliado Atacado. Congela um inimigo e concede Escudo Divino a um aliado.",
    "flavorText": "Quem golpeia o espelho de gelo vê sua própria lâmina congelar.",
    "imagePath": "/assets/cards/blue_144_espelho_geada.webp"
  },
  {
    "id": "blue_145_bussola_planos",
    "name": "Bússola Navegadora dos Planos",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Instrumento Astral",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 1,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Aponta sempre para a linha temporal da vitória.",
    "imagePath": "/assets/cards/blue_145_bussola_planos.webp"
  },
  {
    "id": "blue_146_trono_inverno_eterno",
    "name": "Trono do Inverno Eterno",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Trono Glacial",
    "rarity": "legendary",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela os inimigos."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Congela os inimigos. Início do Turno: Compra 1 carta.",
    "flavorText": "Esculpido no primeiro iceberg do mundo, onde o tempo jamais corre.",
    "imagePath": "/assets/cards/blue_146_trono_inverno_eterno.webp"
  },
  {
    "id": "purple_127_rastejador_ossario",
    "name": "Rastejador de Foice do Ossário",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Constructo",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [],
    "description": "Toque Letal. Qualquer dano que causar em combate destrói a criatura inimiga.",
    "flavorText": "Feito de ossos afiados e rancor antigo.",
    "imagePath": "/assets/cards/purple_127_rastejador_ossario.webp"
  },
  {
    "id": "purple_128_acolito_eclipse",
    "name": "Acólito da Adaga do Eclipse",
    "domain": "purple",
    "type": "creature",
    "subtype": "Humanoide • Cultista",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Drena 1 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Vínculo Vital. Ao Entrar: Drena 1 de VIDA do Soberano inimigo.",
    "flavorText": "Cada gota oferecida ao Sol Negro retorna em dobro.",
    "imagePath": "/assets/cards/purple_128_acolito_eclipse.webp"
  },
  {
    "id": "purple_129_espectro_correntes",
    "name": "Espectro das Correntes de Agonia",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Espírito",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Dreno de Vida. Atravessa paredes e armaduras arrastando grilhões espectrais.",
    "flavorText": "O tilintar de suas correntes anuncia que a noite chegou.",
    "imagePath": "/assets/cards/purple_129_espectro_correntes.webp"
  },
  {
    "id": "purple_130_verme_necrotico",
    "name": "Verme Couraçado da Necrópole",
    "domain": "purple",
    "type": "creature",
    "subtype": "Monstruosidade • Morto-Vivo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Toque Mortífero. Escava sob as lápides para devorar defensores blindados.",
    "flavorText": "Seu miasma corrói até escudos de ouro maciço.",
    "imagePath": "/assets/cards/purple_130_verme_necrotico.webp"
  },
  {
    "id": "purple_131_inquisidor_sangue",
    "name": "Inquisidor da Lâmina Sanguínea",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Vampiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Ímpeto, Vínculo Vital. Estoca com velocidade sobrenatural e cura seu Soberano.",
    "flavorText": "A nobreza da Cripta julga seus inimigos pelo sabor do sangue.",
    "imagePath": "/assets/cards/purple_131_inquisidor_sangue.webp"
  },
  {
    "id": "purple_132_quimera_costurada",
    "name": "Quimera Costurada das Catacumbas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Aberração",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Renascer"
    ],
    "effects": [],
    "description": "Voo, Renascimento. Quando abatida pela primeira vez, suas suturas arcanas a reerguem.",
    "flavorText": "Três feras caídas unidas por uma única fome.",
    "imagePath": "/assets/cards/purple_132_quimera_costurada.webp"
  },
  {
    "id": "purple_133_ceifador_tumular",
    "name": "Ceifador Executor Tumular",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Cavaleiro",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Toque Letal",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Toque Mortífero, Vínculo Vital. Abate qualquer titã e drena sua força vital.",
    "flavorText": "Sua foice dupla nunca erra a colheita.",
    "imagePath": "/assets/cards/purple_133_ceifador_tumular.webp"
  },
  {
    "id": "purple_134_matriarca_noite_eterna",
    "name": "Matriarca da Noite Eterna",
    "domain": "purple",
    "type": "creature",
    "subtype": "Morto-Vivo • Soberana Vampira",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao Entrar: Drena 2 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Voo, Alcance, Vínculo Vital. Ao Entrar: Drena 2 de VIDA do Soberano rival.",
    "flavorText": "Um brinde de seu cálice sela o destino de reinos inteiros.",
    "imagePath": "/assets/cards/purple_134_matriarca_noite_eterna.webp"
  },
  {
    "id": "purple_135_colosso_catacumba",
    "name": "Colosso Gótico da Catacumba",
    "domain": "purple",
    "type": "creature",
    "subtype": "Constructo • Morto-Vivo",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Renascer"
    ],
    "effects": [],
    "description": "Guardião, Renascimento. Fortaleza ambulante erguida com arcos de catedral e lápides.",
    "flavorText": "O próprio cemitério se levanta para bloquear a passagem.",
    "imagePath": "/assets/cards/purple_135_colosso_catacumba.webp"
  },
  {
    "id": "purple_136_dragao_espectral_abismo",
    "name": "Dragão Espectral do Abismo",
    "domain": "purple",
    "type": "creature",
    "subtype": "Dragão • Espectro",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Pele Incandescente",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Voo, Dreno de Vida. Sopro 2. Seu sopro sombrio varre a fileira inimiga e drena vida.",
    "flavorText": "Dentro de suas costelas translúcidas gira uma galáxia de almas.",
    "imagePath": "/assets/cards/purple_136_dragao_espectral_abismo.webp",
    "breathDamage": 2
  },
  {
    "id": "purple_137_arauto_sol_negro",
    "name": "Arauto Supremo do Sol Negro",
    "domain": "purple",
    "type": "creature",
    "subtype": "Anjo Caído • Avatar",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Voo, Vínculo Vital. Ao Entrar: Causa 3 de dano a todos os inimigos na Vanguarda.",
    "flavorText": "Seis asas de sombra sustentam o eclipse que apaga a esperança.",
    "imagePath": "/assets/cards/purple_137_arauto_sol_negro.webp"
  },
  {
    "id": "purple_138_soberano_carnica",
    "name": "Necrothor, Monarca do Trono de Ossos",
    "domain": "purple",
    "type": "creature",
    "subtype": "Dragão • Lich Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao Entrar: Drena 3 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Voo, Vínculo Vital, Renascimento. Ao Entrar: Causa 3 de dano a todos os inimigos e drena 3 do Soberano rival.",
    "flavorText": "A morte não é o fim — é apenas o começo do seu reinado.",
    "imagePath": "/assets/cards/purple_138_soberano_carnica.webp"
  },
  {
    "id": "purple_139_lanca_sombra_letal",
    "name": "Lança da Sombra Perfurante",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 5,
        "description": "Causa 4 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Causa 4 de dano a um inimigo e restaura 2 de VIDA ao seu Soberano.",
    "flavorText": "Atravessa a armadura para roubar o calor da alma.",
    "imagePath": "/assets/cards/purple_139_lanca_sombra_letal.webp"
  },
  {
    "id": "purple_140_pacto_sepulcral",
    "name": "Contrato do Sepulcro",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Pacto",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Drena 2 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Compra 2 cartas e drena 2 de VIDA do Soberano adversário.",
    "flavorText": "Assinado em pedra tumular e selado com fogo violeta.",
    "imagePath": "/assets/cards/purple_140_pacto_sepulcral.webp"
  },
  {
    "id": "purple_141_onda_morte_cinzenta",
    "name": "Onda da Morte Cinzenta",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Maldição",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Drena 2 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Causa 3 de dano à Vanguarda inimiga e drena 2 de VIDA do Soberano rival.",
    "flavorText": "Onde a onda passa, o aço enferruja e a carne desfalece.",
    "imagePath": "/assets/cards/purple_141_onda_morte_cinzenta.webp"
  },
  {
    "id": "purple_142_apocalipse_umbral",
    "name": "Apocalipse da Fenda Umbral",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Cataclismo Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 5,
        "description": "Causa 5 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Causa 5 de dano a todos os inimigos e restaura 4 de VIDA ao seu Soberano.",
    "flavorText": "O Abismo se abre para reclamar todos os vivos.",
    "imagePath": "/assets/cards/purple_142_apocalipse_umbral.webp"
  },
  {
    "id": "purple_143_mortalha_espinhos_negros",
    "name": "Mortalha de Espinhos Negros",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Maldição",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Gatilho: Aliado Atacado. Causa 3 de dano a um inimigo e cura 2 de VIDA no seu Soberano.",
    "flavorText": "Os espinhos da mortalha bebem o sangue de quem ousa feri-la.",
    "imagePath": "/assets/cards/purple_143_mortalha_espinhos_negros.webp"
  },
  {
    "id": "purple_144_retorno_profano",
    "name": "Retorno Profano do Túmulo",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Necromancia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Drena 2 de VIDA do Soberano inimigo."
      }
    ],
    "description": "Gatilho: Morte Aliada. Concede +1/+1 aos seus aliados e drena 2 de VIDA do Soberano rival.",
    "flavorText": "Cada guerreiro que tomba fortalece o coro dos mortos.",
    "imagePath": "/assets/cards/purple_144_retorno_profano.webp"
  },
  {
    "id": "purple_145_orgao_catedrais_negras",
    "name": "Órgão Fantasma da Catedral Negra",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Instrumento Profano",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Drena 2 de VIDA do Soberano inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Início do Turno: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Drena 2 do Soberano rival. Início do Turno: Causa 2 de dano ao Soberano rival.",
    "flavorText": "Seus acordes fúnebres ressoam diretamente na alma do adversário.",
    "imagePath": "/assets/cards/purple_145_orgao_catedrais_negras.webp"
  },
  {
    "id": "purple_146_coroa_rei_cadaver",
    "name": "Coroa do Rei-Cadáver",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Regalia Necromântica",
    "rarity": "legendary",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: +1/+1 aos aliados. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "O diamante negro em sua fronte pulsa com mil anos de imortalidade.",
    "imagePath": "/assets/cards/purple_146_coroa_rei_cadaver.webp"
  },
  {
    "id": "green_127_raposa_espinheiro",
    "name": "Raposa Veloz do Espinheiro",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Silvestre",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Ímpeto. Salta entre as raízes para golpear no primeiro instante.",
    "flavorText": "Rápida como o vento nas folhas de outono.",
    "imagePath": "/assets/cards/green_127_raposa_espinheiro.webp"
  },
  {
    "id": "green_128_batedor_lupino",
    "name": "Batedor Feral Lupino",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Licantropo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Ímpeto, Fúria Crescente. Caçador da alcatéia que se fortalece a cada embate.",
    "flavorText": "Suas machadinhas de osso esmeralda nunca perdem o rastro.",
    "imagePath": "/assets/cards/green_128_batedor_lupino.webp"
  },
  {
    "id": "green_129_louva_deus_lamina",
    "name": "Louva-a-Deus Lâmina de Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Inseto Gigante",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [],
    "description": "Toque Mortífero. Suas foices cristalinas decepam qualquer armadura.",
    "flavorText": "Camuflado no dossel até o instante fatal do bote.",
    "imagePath": "/assets/cards/green_129_louva_deus_lamina.webp"
  },
  {
    "id": "green_130_urso_runico_anciao",
    "name": "Urso Rúnico Ancião",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Guardião",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [],
    "description": "Guardião, Atropelar. Protege a clareira com ombros blindados em pedra druídica.",
    "flavorText": "As runas em seu pelo brilham quando a floresta é ameaçada.",
    "imagePath": "/assets/cards/green_130_urso_runico_anciao.webp"
  },
  {
    "id": "green_131_xama_raizes_vivas",
    "name": "Xamã Centauro das Raízes Vivas",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Druida",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os seus aliados."
      }
    ],
    "description": "Alcance. Ao Entrar: Desperta a seiva ancestral concedendo +1/+1 a todos os aliados.",
    "flavorText": "Onde seus cascos tocam, a floresta floresce em armas.",
    "imagePath": "/assets/cards/green_131_xama_raizes_vivas.webp"
  },
  {
    "id": "green_132_tigre_esmeralda_alfa",
    "name": "Tigre Dentes-de-Sabre Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Predador Alfa",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [],
    "description": "Ímpeto, Atropelar. Predador supremo que estraçalha bloqueadores no mesmo turno.",
    "flavorText": "Seu rugido faz até os dragões olharem para baixo.",
    "imagePath": "/assets/cards/green_132_tigre_esmeralda_alfa.webp"
  },
  {
    "id": "green_133_gorila_costa_prateada_rei",
    "name": "Rei Gorila Punho-de-Granito",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Primata Titã",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Guardião"
    ],
    "effects": [],
    "description": "Atropelar, Guardião. Manoplas naturais de granito e musgo que esmagam colunas inteiras.",
    "flavorText": "Rei incontestável das montanhas cobertas pela selva.",
    "imagePath": "/assets/cards/green_133_gorila_costa_prateada_rei.webp"
  },
  {
    "id": "green_134_anquilossauro_fortaleza",
    "name": "Anquilossauro Fortaleza de Cristal",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Dinossauro",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [],
    "description": "Guardião, Atropelar. Carapaça impenetrável de cristal esmeralda com clava caudal.",
    "flavorText": "Nenhuma lança jamais atravessou sua couraça pré-histórica.",
    "imagePath": "/assets/cards/green_134_anquilossauro_fortaleza.webp"
  },
  {
    "id": "green_135_serpente_emplumada_selva",
    "name": "Serpente Emplumada do Dossel",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Alada",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Toque Letal"
    ],
    "effects": [],
    "description": "Voo, Toque Mortífero. Domina os céus da floresta com peçonha letal.",
    "flavorText": "Suas penas brilham como ouro e esmeralda antes do bote.",
    "imagePath": "/assets/cards/green_135_serpente_emplumada_selva.webp"
  },
  {
    "id": "green_136_rinoceronte_monolito",
    "name": "Rinoceronte Chifre-de-Monólito",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Colosso",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [],
    "description": "Ímpeto, Atropelar. Investida imparável que derruba qualquer barreira.",
    "flavorText": "Seu chifre é um monólito rúnico inteiro.",
    "imagePath": "/assets/cards/green_136_rinoceronte_monolito.webp"
  },
  {
    "id": "green_137_lorde_treant_espinhos",
    "name": "Lorde Treant de Pau-Ferro",
    "domain": "green",
    "type": "creature",
    "subtype": "Planta • Guardião Ancião",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA em todos os aliados."
      }
    ],
    "description": "Guardião. Ao Entrar: Restaura 2 de VIDA a todas as suas unidades.",
    "flavorText": "Suas raízes bebem nas fontes mais profundas de Gaia.",
    "imagePath": "/assets/cards/green_137_lorde_treant_espinhos.webp"
  },
  {
    "id": "green_138_giganotossauro_apex",
    "name": "Giganotossauro Predador Ápex",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Dinossauro Titã",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Atropelar, Fúria Crescente. O maior predador terrestre da cratera primordial.",
    "flavorText": "Quando ele caça, toda a cadeia alimentar recua.",
    "imagePath": "/assets/cards/green_138_giganotossauro_apex.webp"
  },
  {
    "id": "green_139_dragao_floresta_antiga",
    "name": "Dragão da Floresta Primordial",
    "domain": "green",
    "type": "creature",
    "subtype": "Dragão • Ancião",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Pele Incandescente",
      "Atropelar"
    ],
    "effects": [],
    "description": "Voo, Atropelar. Sopro 2. Coroado com galhadas de carvalho vivo e sopro esmeralda.",
    "flavorText": "Mais antigo que as próprias árvores-mãe.",
    "imagePath": "/assets/cards/green_139_dragao_floresta_antiga.webp",
    "breathDamage": 2
  },
  {
    "id": "green_140_colosso_pangeia",
    "name": "Tartaruga-Titã de Pangeia",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Titã Continental",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 5,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Ao Entrar: Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião, Atropelar. Ao Entrar: Restaura 4 de VIDA ao seu Soberano.",
    "flavorText": "Carrega uma montanha e uma floresta inteira sobre o casco.",
    "imagePath": "/assets/cards/green_140_colosso_pangeia.webp"
  },
  {
    "id": "green_141_soberano_fera_primordial",
    "name": "Fenris-Gorgon, Imperador das Feras",
    "domain": "green",
    "type": "creature",
    "subtype": "Fera • Titã Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 8,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +2/+1 a todos os seus aliados."
      }
    ],
    "description": "Ímpeto, Atropelar, Fúria Crescente. Ao Entrar: Concede +2/+1 a todos os seus aliados.",
    "flavorText": "Metade lobo primordial, metade dragão da selva — a própria fúria encarnada.",
    "imagePath": "/assets/cards/green_141_soberano_fera_primordial.webp"
  },
  {
    "id": "green_142_patriarca_selva_eterna",
    "name": "Sylvanhorn, Patriarca da Selva Eterna",
    "domain": "green",
    "type": "creature",
    "subtype": "Celestial • Espírito Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA em todos os aliados."
      }
    ],
    "description": "Guardião, Atropelar. Ao Entrar: Concede +2/+2 e restaura 3 de VIDA a todos os aliados.",
    "flavorText": "Guardião imortal do Coração da Selva Primordial.",
    "imagePath": "/assets/cards/green_142_patriarca_selva_eterna.webp"
  },
  {
    "id": "green_143_investida_pre_historica",
    "name": "Investida da Manada Pré-Histórica",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Instinto",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Concede +2/+1 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Causa 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Concede +2/+1 a todos os seus aliados e causa 1 de dano à Vanguarda inimiga.",
    "flavorText": "O chão treme antes mesmo da manada aparecer no horizonte.",
    "imagePath": "/assets/cards/green_143_investida_pre_historica.webp"
  },
  {
    "id": "green_144_bencao_arvore_mundo",
    "name": "Bênção da Árvore-do-Mundo",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Restauração",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Cura 3 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Cura 4 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Restaura 3 de VIDA aos aliados, 4 de VIDA ao seu Soberano e compra 1 carta.",
    "flavorText": "A seiva dourada do Carvalho Primordial fecha feridas e devolve o fôlego aos caídos.",
    "imagePath": "/assets/cards/green_144_bencao_arvore_mundo.webp"
  },
  {
    "id": "green_145_emboscada_cipos",
    "name": "Emboscada de Cipós Carnívoros",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Armadilha Natural",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Gatilho: Inimigo Invocado. Causa 3 de dano a um inimigo e restaura 2 de VIDA ao seu Soberano.",
    "flavorText": "Na selva primordial, até as flores têm presas.",
    "imagePath": "/assets/cards/green_145_emboscada_cipos.webp"
  },
  {
    "id": "green_146_altar_presas_ancestrais",
    "name": "Altar das Presas Ancestrais",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Monólito Druídico",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: +1/+1 aos aliados. Início do Turno: Cura 2 de VIDA no seu Soberano.",
    "flavorText": "Erguido com as presas dos primeiros titãs que caminharam sobre a terra.",
    "imagePath": "/assets/cards/green_146_altar_presas_ancestrais.webp"
  },
  {
    "id": "gold_127_lanceiro_alvorada",
    "name": "Lanceiro da Guarda da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Soldado",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 1,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Primeiro escudo da falange imperial dourada.",
    "flavorText": "Sua alabarda reflete o primeiro raio da manhã.",
    "imagePath": "/assets/cards/gold_127_lanceiro_alvorada.webp"
  },
  {
    "id": "gold_128_cleriga_sol_invicto",
    "name": "Clériga do Sol Invicto",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Clérigo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Alcance. Ao Entrar: Restaura 3 de VIDA ao seu Soberano.",
    "flavorText": "Seu turíbulo irradia a luz que expulsa toda sombra.",
    "imagePath": "/assets/cards/gold_128_cleriga_sol_invicto.webp"
  },
  {
    "id": "gold_129_grifo_couracado_real",
    "name": "Grifo Couraçado Imperial",
    "domain": "gold",
    "type": "creature",
    "subtype": "Monstruosidade • Alado",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Voo, Escudo Divino. Patrulha os céus da Cidadela com armadura de ouro.",
    "flavorText": "Garras de ouro temperado e olhos que enxergam a léguas.",
    "imagePath": "/assets/cards/gold_129_grifo_couracado_real.webp"
  },
  {
    "id": "gold_130_justicar_espada_solar",
    "name": "Justicar da Espada Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humanoide • Paladino",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Guardião, Vínculo Vital. Julga os agressores com sua montante de luz.",
    "flavorText": "A justiça da Aurora é cega, mas sua lâmina jamais hesita.",
    "imagePath": "/assets/cards/gold_130_justicar_espada_solar.webp"
  },
  {
    "id": "gold_131_cavaleiro_pegaso_solar",
    "name": "Cavaleiro de Pégaso Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Cavaleiro",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Voo, Ímpeto, Escudo Divino. Investida aérea reluzente da ordem suprema.",
    "flavorText": "Desce das nuvens douradas como uma estrela cadente.",
    "imagePath": "/assets/cards/gold_131_cavaleiro_pegaso_solar.webp"
  },
  {
    "id": "gold_132_automato_custodio",
    "name": "Autômato Custódio Dourado",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Sentinela",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Guardião. Sentinela mecânica de precisão infalível e blindagem dupla.",
    "flavorText": "Programado há mil anos para nunca recuar um único passo.",
    "imagePath": "/assets/cards/gold_132_automato_custodio.webp"
  },
  {
    "id": "gold_133_mestre_forja_imperial",
    "name": "Mestre-Ferreiro da Forja Imperial",
    "domain": "gold",
    "type": "creature",
    "subtype": "Anão • Artífice Real",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino aos aliados."
      }
    ],
    "description": "Alcance. Ao Entrar: Forja barreiras sagradas concedendo Escudo Divino aos aliados.",
    "flavorText": "Suas armaduras são abençoadas no próprio fogo da aurora.",
    "imagePath": "/assets/cards/gold_133_mestre_forja_imperial.webp"
  },
  {
    "id": "gold_134_esfinge_sentenca_real",
    "name": "Esfinge da Sentença Real",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Esfinge",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Voo, Guardião, Escudo Divino. Guardiã suprema dos portões do Tribunal.",
    "flavorText": "Quem falha em seu julgamento é reduzido a pó dourado.",
    "imagePath": "/assets/cards/gold_134_esfinge_sentenca_real.webp"
  },
  {
    "id": "gold_135_serafim_seis_asas",
    "name": "Serafim de Seis Asas do Zênite",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Serafim",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Voo, Vínculo Vital, Escudo Divino. Campeão angélico que restaura a vida do Soberano.",
    "flavorText": "Seis asas de fogo sagrado que ofuscam o próprio meio-dia.",
    "imagePath": "/assets/cards/gold_135_serafim_seis_asas.webp"
  },
  {
    "id": "gold_136_dragao_platina_celeste",
    "name": "Dragão Celestial de Platina e Ouro",
    "domain": "gold",
    "type": "creature",
    "subtype": "Dragão • Celestial",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Pele Incandescente",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Voo, Escudo Divino. Sopro 2. Seu sopro de luz purificadora varre a Vanguarda rival.",
    "flavorText": "Suas escamas de platina refletem a glória eterna da Cidadela.",
    "imagePath": "/assets/cards/gold_136_dragao_platina_celeste.webp",
    "breathDamage": 2
  },
  {
    "id": "gold_137_colosso_cidadela_eterna",
    "name": "Colosso da Cidadela Viva",
    "domain": "gold",
    "type": "creature",
    "subtype": "Constructo • Titã",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a todos os aliados."
      }
    ],
    "description": "Guardião, Escudo Divino. Ao Entrar: Concede +1/+2 a todas as suas unidades.",
    "flavorText": "Quando a guerra chega ao limite, a própria catedral marcha para a frente.",
    "imagePath": "/assets/cards/gold_137_colosso_cidadela_eterna.webp"
  },
  {
    "id": "gold_138_imperador_sol_supremo",
    "name": "Hyperion, Deus-Imperador da Aurora",
    "domain": "gold",
    "type": "creature",
    "subtype": "Celestial • Monarca Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os aliados."
      }
    ],
    "description": "Voo, Guardião, Escudo Divino. Ao Entrar: Concede Escudo Divino e +2/+2 a todos os seus aliados.",
    "flavorText": "Doze espadas solares orbitam sua coroa como os ponteiros do meio-dia eterno.",
    "imagePath": "/assets/cards/gold_138_imperador_sol_supremo.webp"
  },
  {
    "id": "gold_139_consagracao_imperial",
    "name": "Consagração da Rosa Solar",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Bênção",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1/+2 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Concede +1/+2 a todos os seus aliados e restaura 3 de VIDA ao seu Soberano.",
    "flavorText": "A luz que atravessa a rosácea imperial transforma soldados em imortais.",
    "imagePath": "/assets/cards/gold_139_consagracao_imperial.webp"
  },
  {
    "id": "gold_140_ira_firmamento_dourado",
    "name": "Ira do Firmamento Dourado",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Julgamento Lendário",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 4,
        "description": "Causa 4 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      }
    ],
    "description": "Causa 4 de dano a todos os inimigos e concede Escudo Divino às suas unidades.",
    "flavorText": "Pilares de luz solar julgam os ímpios e blindam os justos.",
    "imagePath": "/assets/cards/gold_140_ira_firmamento_dourado.webp"
  },
  {
    "id": "gold_141_intervencao_angelical",
    "name": "Intervenção da Égide Angelical",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Milagre",
    "rarity": "rare",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Concede +1/+1 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante."
      }
    ],
    "description": "Gatilho: Aliado Atacado. Concede Escudo Divino e +1/+1 aos aliados, e causa 3 de dano a um inimigo.",
    "flavorText": "Asas de ouro se abrem no exato instante do golpe fatal.",
    "imagePath": "/assets/cards/gold_141_intervencao_angelical.webp"
  },
  {
    "id": "gold_142_calice_alvorada_real",
    "name": "Cálice Real da Alvorada",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Graal Solar",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Ao Entrar: Cura 3 de VIDA no Soberano e compra 1 carta. Início do Turno: Concede +1/+1 a todos os aliados.",
    "flavorText": "Transborda com a luz líquida da primeira manhã do mundo.",
    "imagePath": "/assets/cards/gold_142_calice_alvorada_real.webp"
  },
  {
    "id": "gold_143_bigorna_sol_invicto",
    "name": "Bigorna Sagrada do Sol Invicto",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Forja Sagrada",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Ao Entrar: +2/+2 a um aliado. Início do Turno: +1/+1 a um aliado.",
    "flavorText": "O martelo levita sozinho, forjando vitórias turno após turno.",
    "imagePath": "/assets/cards/gold_143_bigorna_sol_invicto.webp"
  },
  {
    "id": "gold_144_obelisk_lei_suprema",
    "name": "Obelisco da Lei Suprema",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Monumento",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 2,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 1,
        "description": "Início do Turno: Cura 1 de VIDA em todos os aliados."
      }
    ],
    "description": "Ao Entrar: Escudo Divino a um aliado. Início do Turno: Cura 1 em todos os aliados.",
    "flavorText": "Seus editos dourados mantêm a ordem inabalável na linha de frente.",
    "imagePath": "/assets/cards/gold_144_obelisk_lei_suprema.webp"
  },
  {
    "id": "gold_145_relicario_asas_douradas",
    "name": "Relicário das Asas de Serafim",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Arca Celestial",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Escudo Divino aos aliados. Início do Turno: Cura 2 no seu Soberano.",
    "flavorText": "Guarda um fragmento do próprio sol entre duas asas esculpidas.",
    "imagePath": "/assets/cards/gold_145_relicario_asas_douradas.webp"
  },
  {
    "id": "gold_146_trono_imperador_eterno",
    "name": "Trono Supremo do Imperador Eterno",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Trono Imperial Lendário",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 2,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +1/+2 a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino aos aliados."
      },
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Ao Entrar: +1/+2 e Escudo Divino aos aliados. Início do Turno: +1/+1 aos aliados.",
    "flavorText": "Do alto deste trono, nenhuma falange dourada jamais conheceu a derrota.",
    "imagePath": "/assets/cards/gold_146_trono_imperador_eterno.webp"
  },
  {
    "id": "red_147_salamandra_vapor_rubro",
    "name": "Guerreiro Forjado em Brasas",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Elemental • Guerreiro",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Elemental forjado em armadura de bronze enegrecido que ataca com cimitarras gêmeas de chama viva no turno em que entra.",
    "flavorText": "Nas Forjas de Pyros, sua armadura é soldada diretamente sobre a chama viva.",
    "imagePath": "/assets/cards/red_147_salamandra_vapor_rubro.webp"
  },
  {
    "id": "red_148_sapador_enxofre",
    "name": "Mastim de Obsidiana e Enxofre",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Corruptor • Fera",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano de fogo ao inimigo à frente."
      }
    ],
    "description": "Sopro Dracônico 1. Ao Entrar: Causa 1 de dano de fogo ao inimigo à frente.",
    "flavorText": "Fareja o aço inimigo a léguas de distância e deixa pegadas de enxofre em brasa.",
    "imagePath": "/assets/cards/red_148_sapador_enxofre.webp",
    "breathDamage": 1
  },
  {
    "id": "red_149_mastim_piroclastico",
    "name": "Conjurador do Vórtice Rubro",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Humanoide • Mago",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Conjura uma espiral vulcânica que causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Ao Entrar: Conjura uma espiral vulcânica que causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Com um giro de seu cajado de basalto, transforma o ar da trincheira em um redemoinho de labaredas.",
    "imagePath": "/assets/cards/red_149_mastim_piroclastico.webp"
  },
  {
    "id": "red_150_lanceiro_obsidiana",
    "name": "Colosso Fornalha de Basalto",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Constructo • Guardião",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 2,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Armadura 2. Constructo de basalto e ferro com núcleo de fornalha rúnica que protege sua coluna.",
    "flavorText": "Nenhum ariete atravessa o portão onde a Fornalha Caminhante firma seus pés de ferro.",
    "imagePath": "/assets/cards/red_150_lanceiro_obsidiana.webp"
  },
  {
    "id": "red_151_artificie_caldeira",
    "name": "Serpente-Nobre da Caldeira",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Elemental • Réptil",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Pele Incandescente",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Ao Entrar: Concede +1 ATQ aos aliados na Vanguarda."
      }
    ],
    "description": "Armadura 1. Ao Entrar: Seu tridente incandescente concede +1 ATQ aos aliados na Vanguarda.",
    "flavorText": "Reina sobre os rios de escória da Caldeira, onde seu tridente dita a lei do fogo.",
    "imagePath": "/assets/cards/red_151_artificie_caldeira.webp"
  },
  {
    "id": "red_152_draco_cinzas_rubras",
    "name": "Colosso dos Escudos de Magma",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Gigante • Encouraçado",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [],
    "description": "Armadura 2. Avança com dois escudos-torre de ferro incandescente esmagando a linha de frente inimiga.",
    "flavorText": "Carrega dois portões de forja como escudos e avança como uma avalanche de ferro rubro.",
    "imagePath": "/assets/cards/red_152_draco_cinzas_rubras.webp"
  },
  {
    "id": "red_153_elemental_fornalha_viva",
    "name": "Quimera da Cratera Ardente",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Monstruosidade • Quimera",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Fúria Crescente"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Titã da Fornalha Solar",
      "newAtk": 7,
      "newArmor": 2,
      "newMaxHp": 8,
      "addedKeywords": [
        "Ímpeto"
      ]
    },
    "effects": [],
    "description": "Sopro Dracônico 2. Fera de três cabeças (dragão rubro, leão de magma e carneiro de ferro) que varre a fileira rival.",
    "flavorText": "Três gargantas famintas nascidas na mesma erupção da Cratera de Pyros.",
    "imagePath": "/assets/cards/red_153_elemental_fornalha_viva.webp",
    "breathDamage": 2
  },
  {
    "id": "red_154_juggernaut_escoria",
    "name": "Sultão das Lâminas de Brasa",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Elemental • Gênio",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 6,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Pele Incandescente",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Armadura 1. Ao Entrar: Causa 2 de dano à Vanguarda inimiga. Soberano elemental do deserto de cinzas.",
    "flavorText": "Dos terraços da Cidadela de Bronze, sua cimitarra corta o vento em arcos de fogo branco.",
    "imagePath": "/assets/cards/red_154_juggernaut_escoria.webp"
  },
  {
    "id": "red_155_senhor_efreeti_chama",
    "name": "Dragão Tectônico de Lava",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Dragão • Ancião",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a toda a fileira inimiga."
      }
    ],
    "description": "Sopro Dracônico 3. Armadura 1. Ao Entrar: Causa 2 de dano a toda a fileira inimiga com jato de lava líquida.",
    "flavorText": "Quando suas asas varrem a cordilheira de Pyros, a própria rocha derrete em cascata.",
    "imagePath": "/assets/cards/red_155_senhor_efreeti_chama.webp",
    "breathDamage": 3
  },
  {
    "id": "red_156_fenix_coroa_solar",
    "name": "Pyrokor, Monarca do Fogo Vivo",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Elemental • Príncipe Primordial",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Pele Incandescente",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Último Suspiro: Causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Sopro Dracônico 2. Armadura 1. Último Suspiro: Explode em supernova vulcânica causando 3 de dano à Vanguarda inimiga.",
    "flavorText": "Ele não comanda o incêndio; ele é a própria febre que habita o coração das montanhas.",
    "imagePath": "/assets/cards/red_156_fenix_coroa_solar.webp",
    "breathDamage": 2
  },
  {
    "id": "red_157_dragao_tiamat_carmesim",
    "name": "Vulcanis, Titã da Bigorna Primordial",
    "domain": "red",
    "type": "creature",
    "subtype": "Criatura • Gigante • Titã Ancestral",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Pele Incandescente"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Sopro Vulcânico 3. Armadura 2. Ao Entrar: Seu martelo parte montanhas, causando 3 de dano à Vanguarda e ao Soberano inimigo.",
    "flavorText": "Cada golpe de Vulcanis na Bigorna Primordial abre uma nova fenda no continente.",
    "imagePath": "/assets/cards/red_157_dragao_tiamat_carmesim.webp"
  },
  {
    "id": "red_158_labareda_perfurante",
    "name": "Esfera Piroclástica Latente",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Piroclasma",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a uma unidade inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Causa 1 de dano ao Soberano rival."
      }
    ],
    "description": "Causa 3 de dano a uma unidade inimiga e 1 de dano ao Soberano rival.",
    "flavorText": "Suspensa no ar como um segundo sol, aguarda apenas o estalar de dedos do piromante.",
    "imagePath": "/assets/cards/red_158_labareda_perfurante.webp"
  },
  {
    "id": "red_159_bombardeio_vulcanico",
    "name": "Pilar de Cinzas Incandescentes",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Chamas",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano a todas as unidades na Vanguarda inimiga."
      }
    ],
    "description": "Causa 2 de dano a todas as unidades na Vanguarda inimiga.",
    "flavorText": "Não resta escudo nem estandarte quando a coluna de cinzas sobe aos céus.",
    "imagePath": "/assets/cards/red_159_bombardeio_vulcanico.webp"
  },
  {
    "id": "red_160_furia_sangue_draconico",
    "name": "Galope das Brasas Vivas",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Transmutação • Fúria",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 0,
        "description": "Concede +2 ATQ a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Concede +2 ATQ a todos os seus aliados neste turno e compra 1 carta.",
    "flavorText": "O galope da vanguarda de Pyros incendeia a relva antes mesmo do choque das lanças.",
    "imagePath": "/assets/cards/red_160_furia_sangue_draconico.webp"
  },
  {
    "id": "red_161_erupcao_piroclastica",
    "name": "Cataclismo da Fenda de Magma",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Cataclismo",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano a toda a fileira inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Causa 2 de dano ao Soberano rival."
      }
    ],
    "description": "Causa 3 de dano a toda a fileira inimiga e 2 de dano ao Soberano rival.",
    "flavorText": "A crosta terrestre se parte para lembrar aos mortais quem governa o subsolo.",
    "imagePath": "/assets/cards/red_161_erupcao_piroclastica.webp"
  },
  {
    "id": "red_162_cataclismo_estrela_rubra",
    "name": "Cortina de Fogo Abissal",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Chama Infernal",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 4,
        "description": "Causa 4 de dano a todas as unidades na Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano ao Soberano rival."
      }
    ],
    "description": "Causa 4 de dano a todas as unidades na Vanguarda inimiga e 3 de dano ao Soberano rival.",
    "flavorText": "Uma muralha de labaredas negras onde nenhum covarde ousa dar um passo à frente.",
    "imagePath": "/assets/cards/red_162_cataclismo_estrela_rubra.webp"
  },
  {
    "id": "red_163_contra_ataque_incandescente",
    "name": "Broquel de Estilhaços Vulcânicos",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Emboscada • Piroclasma",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante."
      }
    ],
    "description": "Emboscada: Quando um inimigo atacar, seu broquel de obsidiana repele o golpe causando 3 de dano ao atacante.",
    "flavorText": "O broquel de obsidiana devolve a força do golpe multiplicada em estilhaços de brasa.",
    "imagePath": "/assets/cards/red_163_contra_ataque_incandescente.webp"
  },
  {
    "id": "red_164_armadilha_fissura_magma",
    "name": "Mandíbula da Fenda Tectônica",
    "domain": "red",
    "type": "reaction",
    "subtype": "Reação • Emboscada • Tectônica",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano a toda a Vanguarda inimiga."
      }
    ],
    "description": "Emboscada: Quando o inimigo invocar ou atacar na Vanguarda, causa 2 de dano a toda a Vanguarda inimiga.",
    "flavorText": "O chão parece firme até o exato instante em que a crosta cede sob a marcha inimiga.",
    "imagePath": "/assets/cards/red_164_armadilha_fissura_magma.webp"
  },
  {
    "id": "red_165_bigorna_fogo_primordial",
    "name": "Bigorna da Chama Primordial",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Forja Vulcânica",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Início do Turno: Concede +1 ATQ aos seus aliados na Vanguarda."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, concede +1 ATQ aos seus aliados na Vanguarda.",
    "flavorText": "Sobre esta bigorna de basalto foram batidas as primeiras coroas do Pacto Rubro.",
    "imagePath": "/assets/cards/red_165_bigorna_fogo_primordial.webp"
  },
  {
    "id": "red_166_coroa_imperador_vulcao",
    "name": "Orbe do Sol Aprisionado",
    "domain": "red",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Elemental",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 2,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Início do Turno: Causa 2 de dano ao Soberano inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Início do Turno: Causa 1 de dano à Vanguarda rival."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, causa 2 de dano ao Soberano inimigo e 1 de dano à Vanguarda rival.",
    "flavorText": "Dentro do vidro vulcânico pulsa uma tempestade solar pronta para romper a jaula.",
    "imagePath": "/assets/cards/red_166_coroa_imperador_vulcao.webp"
  },
  {
    "id": "blue_147_iniciado_astrolabio",
    "name": "Guardião de Coral da Maré",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Elemental • Guerreiro",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 1,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Armadura 1. Ao Entrar: Compra 1 carta. Guerreiro elemental em armadura de prata e coral com tridente de geada.",
    "flavorText": "Moldado a partir da espuma abissal e revestido em placas de coral prateado.",
    "imagePath": "/assets/cards/blue_147_iniciado_astrolabio.webp"
  },
  {
    "id": "blue_148_espectro_nevoeiro_algido",
    "name": "Dançarino dos Chakrams de Raio",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Elemental • Guerreiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Ao Entrar: Seus discos de relâmpago congelam uma unidade inimiga por 1 turno.",
    "flavorText": "Seus discos de safira cortam o vendaval deixando rastros de geada elétrica.",
    "imagePath": "/assets/cards/blue_148_espectro_nevoeiro_algido.webp"
  },
  {
    "id": "blue_149_cronomante_ampulheta",
    "name": "Arquimago do Trono de Safira",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Humanoide • Arquimago",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo com runas astrais."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Congela um inimigo com runas astrais e compra 1 carta.",
    "flavorText": "Do Trono de Safira, lê cada movimento adversário três turnos antes de acontecer.",
    "imagePath": "/assets/cards/blue_149_cronomante_ampulheta.webp"
  },
  {
    "id": "blue_150_guardiao_runa_safira",
    "name": "Corcel-Dragão dos Ventos Celestes",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Celestial • Soberano",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 2,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino",
      "Guardião"
    ],
    "effects": [],
    "description": "Armadura 1. Guardião místico dos ventos astrais com escamas de safira e chifre de relâmpago.",
    "flavorText": "Galopa sobre as nuvens de Vórtex com cascos de relâmpago e crina de geada.",
    "imagePath": "/assets/cards/blue_150_guardiao_runa_safira.webp"
  },
  {
    "id": "blue_151_draco_tempestade_astral",
    "name": "Gigante Oráculo do Trovão",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Gigante • Tempestade",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Alcance"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 inimigo."
      }
    ],
    "description": "Sopro de Raios 2. Armadura 1. Ao Entrar: Congela o inimigo mais forte na Vanguarda.",
    "flavorText": "Do topo das geleiras de Vórtex, enxerga o destino escrito nas correntes de vento.",
    "imagePath": "/assets/cards/blue_151_draco_tempestade_astral.webp"
  },
  {
    "id": "blue_152_arquimago_vortice",
    "name": "Hydrissa, Soberana do Redemoinho",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Elemental • Princesa Primordial",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "spell_cast",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Lançar Feitiço: Compra 1 carta."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Lançar Feitiço: Causa 1 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Armadura 2. Sempre que você conjurar um Feitiço, compra 1 carta e causa 1 de dano à Vanguarda inimiga.",
    "flavorText": "Onde Hydrissa ergue a mão, os oceanos se levantam como muralhas de safira.",
    "imagePath": "/assets/cards/blue_152_arquimago_vortice.webp"
  },
  {
    "id": "blue_153_leviata_fenda_abissal",
    "name": "Zephyrus, Monarca do Ciclone",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Elemental • Príncipe Primordial",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Ao Entrar: Devolve 1 unidade inimiga para a mão do dono."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela 1 unidade inimiga."
      }
    ],
    "description": "Voo, Alcance, Guardião. Armadura 1. Ao Entrar: Devolve uma unidade inimiga para a mão do dono e congela outra.",
    "flavorText": "Respira furacões e exala o silêncio gelado das grandes altitudes.",
    "imagePath": "/assets/cards/blue_153_leviata_fenda_abissal.webp"
  },
  {
    "id": "blue_154_dragao_safira_soberano",
    "name": "Dragão de Safira Sônico",
    "domain": "blue",
    "type": "creature",
    "subtype": "Criatura • Dragão • Ancião",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao Entrar: Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      }
    ],
    "description": "Sopro Sônico 3. Armadura 2. Ao Entrar: Congela toda a Vanguarda inimiga e compra 2 cartas.",
    "flavorText": "O estrondo de suas asas ressoa como cristais se partindo sob a tempestade.",
    "imagePath": "/assets/cards/blue_154_dragao_safira_soberano.webp"
  },
  {
    "id": "blue_155_seta_gelo_etereo",
    "name": "Vagalhão de Gelo Abissal",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Maré",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano a um inimigo."
      }
    ],
    "description": "Congela uma unidade inimiga e causa 2 de dano a ela.",
    "flavorText": "A maré do norte não pede passagem; ela engole trincheiras e congela o aço.",
    "imagePath": "/assets/cards/blue_155_seta_gelo_etereo.webp"
  },
  {
    "id": "blue_156_prisao_cristal_algido",
    "name": "Diadema dos Sete Cometas",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Astral",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 2,
        "description": "Congela até 2 inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Dispara meteoros estelares que congelam até 2 inimigos e compram 1 carta.",
    "flavorText": "Sete fragmentos de cometa orbitam a fronte do arquimago aguardando o comando de disparo.",
    "imagePath": "/assets/cards/blue_156_prisao_cristal_algido.webp"
  },
  {
    "id": "blue_157_visao_observador_astral",
    "name": "Rajada das Lâminas de Vento",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Conjuração • Vendaval",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Concede +1⚡ de Essência neste turno."
      }
    ],
    "description": "Lâminas espectrais cortam o vento: compra 2 cartas e concede +1⚡ de Essência neste turno.",
    "flavorText": "Antes que a primeira gota de chuva toque o chão, quatro lâminas de vento já cruzaram a arena.",
    "imagePath": "/assets/cards/blue_157_visao_observador_astral.webp"
  },
  {
    "id": "blue_158_relampago_encadeado",
    "name": "Orbe da Maré Aprisionadora",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Conjuração • Maré",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano a todas as unidades na Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela os sobreviventes da Vanguarda inimiga."
      }
    ],
    "description": "Causa 2 de dano a todas as unidades na Vanguarda inimiga e congela os sobreviventes.",
    "flavorText": "A água obedece ao selo de Vórtex, fechando-se como uma esfera sem ar.",
    "imagePath": "/assets/cards/blue_158_relampago_encadeado.webp"
  },
  {
    "id": "blue_159_paradoxo_ampulheta",
    "name": "Ruptura do Astrolábio Eterno",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia • Tempo",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve 1 inimigo à mão."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      }
    ],
    "description": "Devolve uma unidade inimiga para a mão do oponente e compra 2 cartas.",
    "flavorText": "No Observatório de Safira, o tempo é apenas mais uma corrente que pode ser invertida.",
    "imagePath": "/assets/cards/blue_159_paradoxo_ampulheta.webp"
  },
  {
    "id": "blue_160_nevasca_soberana",
    "name": "Ciclone de Poeira de Diamante",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Criomancia",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Congela toda a Vanguarda inimiga e causa 3 de dano a cada unidade atingida.",
    "flavorText": "Cada floco de neve no olho do ciclone corta tão fundo quanto um bisturi de cristal.",
    "imagePath": "/assets/cards/blue_160_nevasca_soberana.webp"
  },
  {
    "id": "blue_161_singularidade_temporal",
    "name": "Pilares da Geada Eterna",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Criomancia • Estase",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela todos os inimigos em campo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano aos inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      }
    ],
    "description": "Congela todos os inimigos em campo, causa 2 de dano a eles e compra 2 cartas.",
    "flavorText": "Colunas de gelo milenar brotam do ladrilho, encerrando a batalha em silêncio absoluto.",
    "imagePath": "/assets/cards/blue_161_singularidade_temporal.webp"
  },
  {
    "id": "blue_162_negacao_runica",
    "name": "Quebra-Feitiço de Safira",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração • Runa",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela 1 inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Emboscada: Quando o inimigo atacar ou conjurar, congela o atacante e compra 1 carta.",
    "flavorText": "A palavra arcana se desfaz no ar como névoa diante do glifo do Conclave.",
    "imagePath": "/assets/cards/blue_162_negacao_runica.webp"
  },
  {
    "id": "blue_163_espelho_congelante",
    "name": "Salto pela Fenda de Cristal",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Conjuração • Teletransporte",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela o agressor."
      }
    ],
    "description": "Emboscada: Quando um aliado for atacado, concede Escudo Divino a ele e congela o agressor.",
    "flavorText": "Onde a espada inimiga desce, resta apenas uma silhueta de geada e um passo no vazio.",
    "imagePath": "/assets/cards/blue_163_espelho_congelante.webp"
  },
  {
    "id": "blue_164_desvio_dimensional",
    "name": "Cúpula Defletora do Vendaval",
    "domain": "blue",
    "type": "reaction",
    "subtype": "Reação • Abjuração • Ciclone",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve o atacante inimigo para a mão do oponente."
      }
    ],
    "description": "Emboscada: Devolve o atacante inimigo para a mão do oponente antes do golpe conectar.",
    "flavorText": "O próprio vendaval se curva em escudo, devolvendo o agressor ao ponto de partida.",
    "imagePath": "/assets/cards/blue_164_desvio_dimensional.webp"
  },
  {
    "id": "blue_165_planetario_horologico",
    "name": "Visagem da Tempestade Safira",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Dracônico",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta extra."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, compra 1 carta extra.",
    "flavorText": "Suas luas de safira giram em silêncio, calculando a maré exata da vitória.",
    "imagePath": "/assets/cards/blue_165_planetario_horologico.webp"
  },
  {
    "id": "blue_166_trono_oniciencia_astral",
    "name": "Cetro do Arquimago Astral",
    "domain": "blue",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Arcano",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 2,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Início do Turno: Congela 1 inimigo."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Concede +1⚡ de Essência."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, congela um inimigo aleatório e concede +1⚡ de Essência.",
    "flavorText": "No topo de seu cajado repousa a primeira estrela capturada pelos fundadores de Vórtex.",
    "imagePath": "/assets/cards/blue_166_trono_oniciencia_astral.webp"
  },
  {
    "id": "purple_147_acolito_sangue_profano",
    "name": "Sabujo Devorador de Almas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Corruptor • Metamorfo",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Fera lupina abissal envolta em fumaça necrótica que drena a vitalidade da presa.",
    "flavorText": "Solto nos corredores da Cripta do Eclipse, caça pelo rastro da pulsação mortal.",
    "imagePath": "/assets/cards/purple_147_acolito_sangue_profano.webp"
  },
  {
    "id": "purple_148_carnical_catacumba",
    "name": "Centauro-Escorpião das Sombras",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Monstruosidade • Caçador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Renascer"
    ],
    "effects": [],
    "description": "Caçador quitinoso das cavernas abissais cujo ferrão carrega veneno mortal instantâneo.",
    "flavorText": "Metade carapaça de quitina negra, metade lâmina envenenada das galerias profundas.",
    "imagePath": "/assets/cards/purple_148_carnical_catacumba.webp"
  },
  {
    "id": "purple_149_espectro_sussurro_letal",
    "name": "Colosso-Sapo de Sombra Costurada",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Monstruosidade • Abissal",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Armadura 1. Colosso anfíbio costurado a partir de sombras vivas para engolir invasores.",
    "flavorText": "Costurado com sombras condensadas nos pântanos cinzentos ao redor da Catedral Negra.",
    "imagePath": "/assets/cards/purple_149_espectro_sussurro_letal.webp"
  },
  {
    "id": "purple_150_ceifador_correntes",
    "name": "Abominação de Quatro Garras",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Corruptor • Demônio",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Fera demoníaca de quatro braços e chamas violetas que dilacera a linha de frente.",
    "flavorText": "Quatro braços forjados para abrir caminho através de qualquer parede de escudos.",
    "imagePath": "/assets/cards/purple_150_ceifador_correntes.webp"
  },
  {
    "id": "purple_151_inquisidor_umbral",
    "name": "Arcanista das Correntes Umbrosas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Humanoide • Feiticeiro Umbral",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao Entrar: Drena 2 de Vida do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA no seu Soberano."
      }
    ],
    "description": "Ao Entrar: Dispara grilhões astrais que drenam 2 de Vida do Soberano inimigo.",
    "flavorText": "Sob a máscara de obsidiana chifruda, suas correntes conhecem o peso de cada culpa.",
    "imagePath": "/assets/cards/purple_151_inquisidor_umbral.webp"
  },
  {
    "id": "purple_152_abominacao_carne_negra",
    "name": "General Caído da Lâmina de Almas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Morto-Vivo • Campeão",
    "rarity": "uncommon",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Último Suspiro: Causa 2 de dano ao Soberano inimigo."
      }
    ],
    "description": "Guardião, Renascer. Armadura 1. Último Suspiro: Causa 2 de dano ao Soberano inimigo.",
    "flavorText": "Mesmo após a queda de seu império, sua montante negra continua cumprindo a ordem de execução.",
    "imagePath": "/assets/cards/purple_152_abominacao_carne_negra.webp"
  },
  {
    "id": "purple_153_arquidemonio_malogro",
    "name": "Arquidemônio do Miasma Eterno",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Corruptor • Arquidemônio",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Alcance",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Armadura 1. Ao Entrar: Seu miasma abissal causa 2 de dano a toda a Vanguarda inimiga.",
    "flavorText": "Quando abre suas seis asas sobre a trincheira, até a luz das tochas míngua em violeta.",
    "imagePath": "/assets/cards/purple_153_arquidemonio_malogro.webp"
  },
  {
    "id": "purple_154_cavaleiro_morte_eterna",
    "name": "Behemoth Ossário das Catacumbas",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Morto-Vivo • Behemoth Ossário",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Toque Letal",
      "Dreno de Vida"
    ],
    "effects": [],
    "description": "Sopro Necrótico 2. Armadura 1. Colosso esquelético fundido com ferro negro que dissolve esquadrões inteiros.",
    "flavorText": "Mil crânios antigos fundidos num único colosso que marcha ao toque dos sinos da cripta.",
    "imagePath": "/assets/cards/purple_154_cavaleiro_morte_eterna.webp",
    "breathDamage": 2
  },
  {
    "id": "purple_155_lorde_vampiro_soberano",
    "name": "Ceifador Gigante do Eclipse",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Morto-Vivo • Terror Umbral",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Dreno de Vida",
      "Toque Letal",
      "Renascer"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Patriarca Imortal da Noite",
      "newAtk": 9,
      "newArmor": 2,
      "newMaxHp": 9,
      "addedKeywords": [
        "Renascer"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao Entrar: Drena 3 de Vida do Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA no seu Soberano."
      }
    ],
    "description": "Armadura 1. Ao Entrar: Sua foice de sombra pura drena 3 de Vida do Soberano inimigo.",
    "flavorText": "Caminha entre os estandartes rasgados colhendo o último fôlego dos caídos.",
    "imagePath": "/assets/cards/purple_155_lorde_vampiro_soberano.webp"
  },
  {
    "id": "purple_156_lich_coroa_entropia",
    "name": "Dragão Umbral do Eclipse",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Dragão • Sombra",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 3,
    "atk": 5,
    "armor": 1,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Dreno de Vida",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao Entrar: Reanima 1 criatura da sua Cripta."
      }
    ],
    "description": "Sopro Necrótico 3. Armadura 1. Ao Entrar: Reanima 1 criatura da sua Cripta.",
    "flavorText": "Suas escamas absorvem a claridade do dia e devolvem apenas o frio do ossário.",
    "imagePath": "/assets/cards/purple_156_lich_coroa_entropia.webp",
    "breathDamage": 3
  },
  {
    "id": "purple_157_dragao_sombra_abissal",
    "name": "Monarca dos Três Crânios",
    "domain": "purple",
    "type": "creature",
    "subtype": "Criatura • Morto-Vivo • Soberano",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Renascer",
      "Alcance"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "destroy_enemy",
        "value": 1,
        "description": "Ao Entrar: Destrói 1 unidade inimiga."
      }
    ],
    "description": "Renascer, Alcance. Sopro de Morte 2. Armadura 1. Ao Entrar: Destrói 1 unidade inimiga.",
    "flavorText": "Três coroas antigas, três vozes em uníssono comandando a marcha dos imortais.",
    "imagePath": "/assets/cards/purple_157_dragao_sombra_abissal.webp"
  },
  {
    "id": "purple_158_toque_apodrecimento",
    "name": "Marionete das Cordas Umbrosas",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Encantamento • Maldição",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano a um inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA no seu Soberano."
      }
    ],
    "description": "Cordas espectrais de marionete drenam 2 de Vida de uma unidade inimiga e curam 2 de Vida do seu Soberano.",
    "flavorText": "Quando os fios violetas tocam a armadura, o guerreiro passa a lutar contra o próprio corpo.",
    "imagePath": "/assets/cards/purple_158_toque_apodrecimento.webp"
  },
  {
    "id": "purple_159_banquete_parasitario",
    "name": "Garra Sifão de Almas",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia • Dreno",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano ao Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA no seu Soberano."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Drena 3 de Vida do Soberano inimigo, cura 3 de Vida do seu Soberano e compra 1 carta.",
    "flavorText": "A vitalidade roubada na linha de frente alimenta o trono sombrio na retaguarda.",
    "imagePath": "/assets/cards/purple_159_banquete_parasitario.webp"
  },
  {
    "id": "purple_160_exumacao_proibida",
    "name": "Uivo Despedaçador de Mentes",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Psionismo • Agonia",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Reanima 1 criatura da sua Cripta."
      },
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 0,
        "description": "Concede +1 ATQ a um aliado."
      }
    ],
    "description": "Ondas de choque mental reanimam uma criatura da sua Cripta e concedem +1 ATQ a ela.",
    "flavorText": "Um único acorde do sino fúnebre basta para que os túmulos devolvam seus campeões.",
    "imagePath": "/assets/cards/purple_160_exumacao_proibida.webp"
  },
  {
    "id": "purple_161_pacto_agonia_eterna",
    "name": "Sudário das Chamas Negras",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia • Sombra",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano a todos os inimigos."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Chamas necróticas causam 2 de dano a todos os inimigos e curam 3 de Vida do seu Soberano.",
    "flavorText": "As chamas negras não queimam a madeira; queimam a coragem de quem as contempla.",
    "imagePath": "/assets/cards/purple_161_pacto_agonia_eterna.webp"
  },
  {
    "id": "purple_162_apocalipse_necrotico",
    "name": "Colheita do Cálice de Obsidiana",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Necromancia • Cataclismo",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "destroy_enemy",
        "value": 1,
        "description": "Destrói a unidade inimiga mais forte."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano ao Soberano rival."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "A foice abissal destrói a unidade inimiga mais forte e drena 3 de Vida do Soberano rival.",
    "flavorText": "A foice do Eclipse não escolhe entre o peão e o general quando chega a hora da colheita.",
    "imagePath": "/assets/cards/purple_162_apocalipse_necrotico.webp"
  },
  {
    "id": "purple_163_emboscada_laminas_sombra",
    "name": "Espelho da Maldição Umbral",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Emboscada • Maldição",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Emboscada: Quando um inimigo atacar, o espelho amaldiçoado reflete 3 de dano ao atacante e cura 2 de Vida.",
    "flavorText": "No cristal trincado do espelho umbral, todo golpe desferido fere o próprio autor.",
    "imagePath": "/assets/cards/purple_163_emboscada_laminas_sombra.webp"
  },
  {
    "id": "purple_164_sentenca_tumulo",
    "name": "Emboscada do Casulo Venenoso",
    "domain": "purple",
    "type": "reaction",
    "subtype": "Reação • Emboscada • Teia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano ao atacante."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Emboscada: Quando um aliado morrer em combate, teias venenosas causam 2 de dano ao atacante e compram 1 carta.",
    "flavorText": "Os fios de seda negra fecham a passagem antes que o grito de alerta alcance a retaguarda.",
    "imagePath": "/assets/cards/purple_164_sentenca_tumulo.webp"
  },
  {
    "id": "purple_165_calice_sangue_imortal",
    "name": "Cálice de Obsidiana do Sangue Imortal",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Vampírico",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Início do Turno: Drena 1 de Vida do Soberano rival."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Início do Turno: Cura 1 de Vida do seu Soberano."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, drena 1 de Vida do Soberano rival e cura 1 de Vida do seu Soberano.",
    "flavorText": "Forjado em obsidiana e prata negra para selar o pacto eterno da Corte Carmesim.",
    "imagePath": "/assets/cards/purple_165_calice_sangue_imortal.webp"
  },
  {
    "id": "purple_166_altar_ceifador_supremo",
    "name": "Visagem do Dragão da Peste",
    "domain": "purple",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Dracônico",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 2,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Início do Turno: Causa 2 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, causa 2 de dano à Vanguarda inimiga e compra 1 carta.",
    "flavorText": "Diante deste relicário de pedra negra, toda baixa no campo converte-se em tributo.",
    "imagePath": "/assets/cards/purple_166_altar_ceifador_supremo.webp"
  },
  {
    "id": "green_147_batedor_folha_viva",
    "name": "Hiena-Cervo Quebra-Ossos",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Monstruosidade • Predador",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [],
    "description": "Predador veloz com galhada de musgo e mandíbulas esmagadoras que ataca no turno em que entra.",
    "flavorText": "Corre mais rápido que o vento entre os troncos de Veridia e parte ferro com o maxilar.",
    "imagePath": "/assets/cards/green_147_batedor_folha_viva.webp"
  },
  {
    "id": "green_148_lobo_espinho_venenoso",
    "name": "Guardião de Granito e Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Elemental • Guerreiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Armadura 1. Guerreiro elemental revestido em placas de granito e cristal esmeralda com malho sísmico.",
    "flavorText": "Rocha viva e cristal de jade erguidos pelo juramento antigo dos druidas.",
    "imagePath": "/assets/cards/green_148_lobo_espinho_venenoso.webp"
  },
  {
    "id": "green_149_vespa_rainha_feral",
    "name": "Gorila-Titã de Couraça de Rocha",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Primata Alfa",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Primata colossal revestido de placas de granito e musgo que estraçalha bloqueadores na Vanguarda.",
    "flavorText": "Quando seus dois punhos de granito golpeiam o solo, toda a clareira salta.",
    "imagePath": "/assets/cards/green_149_vespa_rainha_feral.webp"
  },
  {
    "id": "green_150_xama_raizes_antigas",
    "name": "Pterossauro Imperial da Selva",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Dinossauro",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Ao Entrar: Concede +1 ATQ aos aliados."
      }
    ],
    "description": "Pterossauro gigante de plumagem esmeralda que mergulha dos céus concedendo +1 ATQ aos aliados na coluna.",
    "flavorText": "Domina as correntes térmicas acima do dossel de Veridia com envergadura real.",
    "imagePath": "/assets/cards/green_150_xama_raizes_antigas.webp"
  },
  {
    "id": "green_151_urso_couraca_musgo",
    "name": "Colosso de Geodo e Musgo",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Elemental • Rocha Viva",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "regeneration": 1,
    "effects": [],
    "description": "Armadura 2. Regeneração 1. Elemental de rocha viva gravado com runas druídicas e geodos de cristal.",
    "flavorText": "Sob a barba de musgo e líquen brilham geodos de esmeralda mais duros que o diamante.",
    "imagePath": "/assets/cards/green_151_urso_couraca_musgo.webp"
  },
  {
    "id": "green_152_raptor_cacador_alfa",
    "name": "Sentinela de Pau-Ferro Vivo",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Planta • Guardião Silvestre",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Allossauro Rei da Caçada",
      "newAtk": 7,
      "newArmor": 1,
      "newMaxHp": 6,
      "addedKeywords": [
        "Atropelar"
      ]
    },
    "effects": [],
    "description": "Armadura 1. Regeneração 2. Sentinela imortal de madeira-ferro viva com coração de semente esmeralda.",
    "flavorText": "Esculpido em pau-ferro milenar, guarda uma semente viva no centro do peito.",
    "imagePath": "/assets/cards/green_152_raptor_cacador_alfa.webp",
    "regeneration": 2
  },
  {
    "id": "green_153_gorila_punho_rocha",
    "name": "Estegossauro de Placas de Jade",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Dinossauro",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 2,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [],
    "description": "Armadura 2. Dinossauro encouraçado com placas dorsais de jade e cauda cravada de espinhos de ferro.",
    "flavorText": "Suas placas dorsais de jade desviam lanças enquanto a cauda espinhosa varre a vanguarda.",
    "imagePath": "/assets/cards/green_153_gorila_punho_rocha.webp"
  },
  {
    "id": "green_154_serpente_abismo_verde",
    "name": "Alossauro Alfa da Matilha",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Dinossauro",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [],
    "description": "Predador dinossauro alfa coberto de escamas espinhosas que lidera a investida da matilha.",
    "flavorText": "Nenhuma presa escapa quando o líder de escamas verdes inicia a corrida na mata fechada.",
    "imagePath": "/assets/cards/green_154_serpente_abismo_verde.webp"
  },
  {
    "id": "green_155_ente_carvalho_anciao",
    "name": "Crocodilo-Monólito do Pântano",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Behemoth Anfíbio",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA em todos os aliados."
      }
    ],
    "description": "Armadura 1. Regeneração 2. Ao Entrar: Cura 2 de VIDA em todos os aliados. Predador pré-histórico encouraçado em pedra rúnica.",
    "flavorText": "Dormiu por três séculos no fundo do pântano até que suas costas virassem rocha e carvalho.",
    "imagePath": "/assets/cards/green_155_ente_carvalho_anciao.webp"
  },
  {
    "id": "green_156_mamute_brasa_selvagem",
    "name": "Arquidruida da Coroa de Galhada",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Humanoide • Arquidruida",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1 ATQ / +1 VID aos seus aliados."
      }
    ],
    "description": "Regeneração 2. Ao Entrar: Invoca espíritos da floresta concedendo +1 ATQ / +1 VID aos seus aliados.",
    "flavorText": "Sua coroa de galhada viva floresce a cada estação e convoca a fúria do bosque.",
    "imagePath": "/assets/cards/green_156_mamute_brasa_selvagem.webp",
    "regeneration": 2
  },
  {
    "id": "green_157_quimera_tres_presas",
    "name": "Tiranossauro Soberano da Selva",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Dinossauro Alfa",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "Armadura 1. Predador supremo das selvas primordiais cujas mandíbulas partem qualquer formação defensiva.",
    "flavorText": "O chão de Veridia estremece muito antes de sua coroa de escamas surgir entre as árvores.",
    "imagePath": "/assets/cards/green_157_quimera_tres_presas.webp"
  },
  {
    "id": "green_158_hidra_pantano_ancestral",
    "name": "Brontossauro do Santuário Vivo",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Fera • Dinossauro Colosso",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "regeneration": 2,
    "effects": [],
    "description": "Armadura 2. Regeneração 2. Colosso saurópode que carrega um santuário druídico de pedra no dorso.",
    "flavorText": "Em seu dorso caminha um altar inteiro dos antigos círculos de pedra.",
    "imagePath": "/assets/cards/green_158_hidra_pantano_ancestral.webp"
  },
  {
    "id": "green_159_tiranossauro_imperador",
    "name": "Hidra de Peçonha Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Monstruosidade • Hidra",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 1,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Toque Letal",
      "Fúria Crescente"
    ],
    "regeneration": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a todos os aliados."
      }
    ],
    "description": "Sopro Venenoso 2. Armadura 1. Regeneração 3. Ao Entrar: Concede +1/+1 a todos os aliados.",
    "flavorText": "Cortar uma de suas cabeças apenas dobra o veneno que escorre sobre a relva.",
    "imagePath": "/assets/cards/green_159_tiranossauro_imperador.webp",
    "breathDamage": 2
  },
  {
    "id": "green_160_behemoth_cratera_viva",
    "name": "Terrakhor, Monarca da Rocha Eterna",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Elemental • Príncipe Primordial",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 3,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "regeneration": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2 ATQ / +2 VID aos seus aliados."
      }
    ],
    "description": "Armadura 3. Regeneração 2. Titã de granito e cristais tectônicos que concede +2 ATQ / +2 VID aos seus aliados.",
    "flavorText": "Terrakhor é a própria montanha que decidiu marchar em defesa da floresta.",
    "imagePath": "/assets/cards/green_160_behemoth_cratera_viva.webp"
  },
  {
    "id": "green_161_dragao_esmeralda_primordial",
    "name": "Dragão Esmeralda de Galhada Viva",
    "domain": "green",
    "type": "creature",
    "subtype": "Criatura • Dragão • Ancião",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 8,
    "armor": 2,
    "hp": 10,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar"
    ],
    "regeneration": 2,
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2/+2 a todos os aliados."
      }
    ],
    "description": "Sopro de Espinhos 3. Armadura 2. Regeneração 2. Ao Entrar: Concede +2/+2 a todos os aliados.",
    "flavorText": "De seu sopro nascem espinheiros gigantes que engolem muralhas e catapultas.",
    "imagePath": "/assets/cards/green_161_dragao_esmeralda_primordial.webp"
  },
  {
    "id": "green_162_furia_matilha_selvagem",
    "name": "Ruptura de Raízes e Monólitos",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Transmutação • Sísmico",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2 ATQ e +2 VID a todos os seus aliados na Vanguarda."
      }
    ],
    "description": "Espinhos de pedra e raízes gigantes concedem +2 ATQ e +2 VID a todos os seus aliados na Vanguarda.",
    "flavorText": "As raízes da floresta rompem o calçamento para armar seus defensores com pedra e seiva.",
    "imagePath": "/assets/cards/green_162_furia_matilha_selvagem.webp"
  },
  {
    "id": "green_163_despertar_colosso_floresta",
    "name": "Investida do Espírito Urso",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Espírito Feral",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2 ATQ / +2 VID a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 4,
        "description": "Cura 4 de VIDA do seu Soberano."
      }
    ],
    "description": "O espírito do urso ancestral desperta: concede +2 ATQ / +2 VID a todos os seus aliados e cura 4 de Vida do seu Soberano.",
    "flavorText": "O rugido ancestral ecoa pelos vales de Veridia, fechando feridas e dobrando a força da matilha.",
    "imagePath": "/assets/cards/green_163_despertar_colosso_floresta.webp"
  },
  {
    "id": "green_164_emboscada_raizes_espinhos",
    "name": "Mandíbula da Planta Carnívora",
    "domain": "green",
    "type": "reaction",
    "subtype": "Reação • Emboscada • Carnívora",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante."
      }
    ],
    "description": "Emboscada: Quando um inimigo atacar, mandíbulas de planta carnívora causam 3 de dano ao atacante.",
    "flavorText": "Sob o tapete de folhas verdes aguardam mandíbulas de espinho capazes de partir aço.",
    "imagePath": "/assets/cards/green_164_emboscada_raizes_espinhos.webp"
  },
  {
    "id": "green_165_totem_presa_ancestral",
    "name": "Visagem do Dragão da Floresta",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Dracônico",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1 ATQ / +1 VID a um aliado na Vanguarda."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, concede +1 ATQ / +1 VID a um aliado na Vanguarda.",
    "flavorText": "Entalhado na presa de um colosso primordial e banhado na seiva sagrada do bosque.",
    "imagePath": "/assets/cards/green_165_totem_presa_ancestral.webp"
  },
  {
    "id": "green_166_coracao_arvore_mundo",
    "name": "Totem do Espírito Urso Ancestral",
    "domain": "green",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Totem Xamânico",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 2,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA de todos os seus aliados."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, cura 2 de Vida de todos os seus aliados e do seu Soberano.",
    "flavorText": "Enquanto o totem do Grande Urso permanecer erguido, a mata jamais recuará.",
    "imagePath": "/assets/cards/green_166_coracao_arvore_mundo.webp"
  },
  {
    "id": "gold_147_escudeiro_alvorada_real",
    "name": "Paladino do Brasão Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Humanoide • Paladino",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 1,
    "atk": 1,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [],
    "description": "Armadura 1. Campeão juramentado da Coroa em armadura de ouro branco e escudo radiante.",
    "flavorText": "Seu escudo de ouro branco reflete a primeira luz da manhã sobre a linha de batalha.",
    "imagePath": "/assets/cards/gold_147_escudeiro_alvorada_real.webp"
  },
  {
    "id": "gold_148_clerigo_chama_sagrada",
    "name": "Sentinela de Engrenagens Reais",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Constructo • Autômato",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 2,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Cura 2 de VIDA no seu Soberano."
      }
    ],
    "description": "Armadura 2. Ao Entrar: Cura 2 de VIDA no seu Soberano. Cavaleiro mecânico forjado em prata real.",
    "flavorText": "Forjado pelos relojoeiros reais de Solária para guardar os salões do trono sem descanso.",
    "imagePath": "/assets/cards/gold_148_clerigo_chama_sagrada.webp"
  },
  {
    "id": "gold_149_sentinela_relogio_solar",
    "name": "Cavaleiro de Grifo da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Humanoide • Cavaleiro",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [],
    "description": "Armadura 1. Mergulha dos céus montado em um grifo real com lança solar em chamas.",
    "flavorText": "Mergulha das torres de mármore de Solária com a lança acesa pelo fogo da aurora.",
    "imagePath": "/assets/cards/gold_149_sentinela_relogio_solar.webp"
  },
  {
    "id": "gold_150_paladino_juramento_eterno",
    "name": "Anjo Mensageiro da Maça Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Celestial • Anjo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "ascension": {
      "cost": 3,
      "newName": "Campeão Supremo da Alvorada",
      "newAtk": 6,
      "newArmor": 2,
      "newMaxHp": 7,
      "addedKeywords": [
        "Dreno de Vida"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Armadura 1. Ao Entrar: Sua maça de luz da alvorada cura 3 de Vida do seu Soberano.",
    "flavorText": "Desce entre as nuvens douradas trazendo alívio aos feridos e sentença aos invasores.",
    "imagePath": "/assets/cards/gold_150_paladino_juramento_eterno.webp"
  },
  {
    "id": "gold_151_cavaleiro_grifo_imperial",
    "name": "Colosso da Barreira Hexagonal",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Constructo • Colosso",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1/+1 a um aliado."
      }
    ],
    "description": "Guardião, Escudo Divino. Armadura 1. Ao Entrar: Concede +1/+1 a um aliado.",
    "flavorText": "Ergue uma abóbada de luz dourada onde nenhuma flecha ou maldição consegue penetrar.",
    "imagePath": "/assets/cards/gold_151_cavaleiro_grifo_imperial.webp"
  },
  {
    "id": "gold_152_mestre_forja_celestial",
    "name": "Arconte da Trombeta Dourada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Celestial • Arconte",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 0,
        "description": "Ao Entrar: Concede +1 ATQ a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a um aliado."
      }
    ],
    "description": "Armadura 1. Ao Entrar: O som da trombeta dourada concede +1 ATQ e Escudo Divino a um aliado.",
    "flavorText": "Quando sua trombeta ressoa nas muralhas de Solária, até os exaustos recobram o vigor.",
    "imagePath": "/assets/cards/gold_152_mestre_forja_celestial.webp"
  },
  {
    "id": "gold_153_inquisidor_balanca_ouro",
    "name": "Golem de Ouro e Adamante",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Constructo • Golem",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 3,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "description": "Armadura 3. Muralha viva de adamantina e runas solares imune a investidas comuns.",
    "flavorText": "Três toneladas de adamantina e ouro consagrado marchando em silêncio absoluto.",
    "imagePath": "/assets/cards/gold_153_inquisidor_balanca_ouro.webp"
  },
  {
    "id": "gold_154_colosso_marmore_sagrado",
    "name": "Leão Sagrado de Juba Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Celestial • Fera Sagrada",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Ao Entrar: Concede +1 ATQ aos seus aliados na Vanguarda."
      }
    ],
    "description": "Armadura 1. Ao Entrar: Seu rugido radiante concede +1 ATQ aos seus aliados na Vanguarda.",
    "flavorText": "Sua juba arde como chamas solares quando lidera a carga da cavalaria sagrada.",
    "imagePath": "/assets/cards/gold_154_colosso_marmore_sagrado.webp"
  },
  {
    "id": "gold_155_arconte_lanca_solar",
    "name": "General Angelical da Espada Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Celestial • General Angelical",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a um inimigo."
      }
    ],
    "description": "Armadura 2. Ao Entrar: Causa 3 de dano a um inimigo. General angelical de seis asas douradas.",
    "flavorText": "Empunha a lâmina da verdade com a serenidade de quem nunca conheceu a derrota.",
    "imagePath": "/assets/cards/gold_155_arconte_lanca_solar.webp"
  },
  {
    "id": "gold_156_serafim_coroa_radiante",
    "name": "Arcanjo Supremo das Seis Asas",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Celestial • Arcanjo",
    "rarity": "rare",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      }
    ],
    "description": "Armadura 2. Ao Entrar: Suas seis asas de ouro líquido concedem Escudo Divino a todos os seus aliados.",
    "flavorText": "Quando abre suas seis asas sobre o Bastião, a noite se converte em meio-dia.",
    "imagePath": "/assets/cards/gold_156_serafim_coroa_radiante.webp"
  },
  {
    "id": "gold_157_dragao_soberano_alvorada",
    "name": "Aurelius, Soberano Dragão da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Criatura • Dragão • Soberano Solar",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino",
      "Guardião"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA em todos os aliados."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Sopro Solar 3. Armadura 2. Ao Entrar: Suas asas de luz divina concedem Escudo Divino aos aliados e curam 3 de Vida.",
    "flavorText": "Aurelius paira acima da Catedral dos Sete Sóis, banhando as legiões em luz invencível.",
    "imagePath": "/assets/cards/gold_157_dragao_soberano_alvorada.webp"
  },
  {
    "id": "gold_158_bencao_falange_invicta",
    "name": "Baluarte dos Escudos de Luz",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Luz Sagrada",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 0,
        "description": "Concede +1 ATQ a todos os seus aliados na Vanguarda."
      }
    ],
    "description": "Escudos flutuantes de luz concedem Escudo Divino e +1 ATQ a todos os seus aliados na Vanguarda.",
    "flavorText": "Fileira após fileira, os escudos de luz se encaixam num único muro intransponível.",
    "imagePath": "/assets/cards/gold_158_bencao_falange_invicta.webp"
  },
  {
    "id": "gold_159_julgamento_espada_solar",
    "name": "Julgamento dos Sete Sóis",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Evocação • Cataclismo Solar",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Sete halos solares chovem lanças de fogo divino: causa 3 de dano à Vanguarda inimiga e cura 3 de Vida do seu Soberano.",
    "flavorText": "Sete colunas de fogo dourado descem do zênite para purificar o campo de batalha.",
    "imagePath": "/assets/cards/gold_159_julgamento_espada_solar.webp"
  },
  {
    "id": "gold_160_decreto_invulnerabilidade",
    "name": "Cúpula das Asas Seráficas",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Abjuração • Égide Suprema",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todos os seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      }
    ],
    "description": "Cúpula de asas seráficas concede Escudo Divino a todos os seus aliados e compra 2 cartas.",
    "flavorText": "Por decreto do Trono Solar, nenhuma lâmina tocará os defensores da cidadela hoje.",
    "imagePath": "/assets/cards/gold_160_decreto_invulnerabilidade.webp"
  },
  {
    "id": "gold_161_egide_reflexao_divina",
    "name": "Escudo-Espelho de Retribuição",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Abjuração • Reflexão",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano ao atacante."
      }
    ],
    "description": "Emboscada: Quando um aliado for atacado, o escudo-espelho concede Escudo Divino a ele e causa 2 de dano ao atacante.",
    "flavorText": "A superfície espelhada do escudo devolve a malícia do agressor em pura luz.",
    "imagePath": "/assets/cards/gold_161_egide_reflexao_divina.webp"
  },
  {
    "id": "gold_162_veredito_inquisidor",
    "name": "Correntes Sagradas da Catedral",
    "domain": "gold",
    "type": "reaction",
    "subtype": "Reação • Abjuração • Proteção Divina",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano ao atacante inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Cura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Emboscada: Correntes douradas da lei causam 3 de dano ao atacante inimigo e curam 3 de Vida do seu Soberano.",
    "flavorText": "As correntes de ouro da catedral prendem o culpado antes que o golpe se complete.",
    "imagePath": "/assets/cards/gold_162_veredito_inquisidor.webp"
  },
  {
    "id": "gold_163_estandarte_legiao_dourada",
    "name": "Visagem Real das Cinco Coroas",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Dracônico",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 1,
    "atk": 0,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 0,
        "description": "Início do Turno: Concede +1 ATQ a um aliado na Vanguarda."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 1,
        "description": "Início do Turno: Cura 1 de VIDA do seu Soberano."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, concede +1 ATQ a um aliado na Vanguarda e cura 1 de Vida do seu Soberano.",
    "flavorText": "As cinco pontas da coroa reluzem como faróis para toda a guarda imperial.",
    "imagePath": "/assets/cards/gold_163_estandarte_legiao_dourada.webp"
  },
  {
    "id": "gold_164_forja_armas_sagradas",
    "name": "Machado Real da Bigorna Solar",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Forja Real",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Início do Turno: Concede +1 ATQ / +1 VID a um aliado na Vanguarda."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, concede +1 ATQ / +1 VID a um aliado na Vanguarda.",
    "flavorText": "Abençoado na bigorna da catedral, corta a escuridão tão facilmente quanto o ferro.",
    "imagePath": "/assets/cards/gold_164_forja_armas_sagradas.webp"
  },
  {
    "id": "gold_165_arca_lei_celestial",
    "name": "Escritura das Asas de Pérola",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Tomo Celestial",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 2,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "Início do Turno: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Cura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, compra 1 carta e cura 2 de Vida do seu Soberano.",
    "flavorText": "Em suas páginas de pergaminho dourado estão inscritos os nomes dos guardiões da alvorada.",
    "imagePath": "/assets/cards/gold_165_arca_lei_celestial.webp"
  },
  {
    "id": "gold_166_trono_soberano_sol",
    "name": "Diadema dos Cristais Orbitais",
    "domain": "gold",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Astral",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 0,
    "armor": 2,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Início do Turno: Concede Escudo Divino a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Concede +1⚡ de Essência."
      }
    ],
    "description": "Relíquia Contínua: No início do seu turno, concede Escudo Divino a um aliado e +1⚡ de Essência.",
    "flavorText": "Cristais solares orbitam a fronte do soberano, mantendo acesa a vigília eterna.",
    "imagePath": "/assets/cards/gold_166_trono_soberano_sol.webp"
  },
  {
    "id": "neutral_61_fragmento_coroa_prisma",
    "name": "Efígie do Coroa-Prisma",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Prisma Axial",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 2,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Cristaliza a luz branca concedendo Escudo Divino a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: A quietude do Monte Axial restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Concede Escudo Divino a um aliado. Início do Turno: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Mesmo uma lasca fria daquele sol imóvel ainda impõe silêncio às feridas do tempo.",
    "imagePath": "/assets/cards/neutral_61_fragmento_coroa_prisma.webp"
  },
  {
    "id": "neutral_62_espadachim_corsario",
    "name": "Espadachim da Maré Cinzenta",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Espadachim",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "Duas lâminas, nenhum senhor e o dobro do soldo.",
    "imagePath": "/assets/cards/neutral_62_espadachim_corsario.webp"
  },
  {
    "id": "neutral_63_abjurador_errante",
    "name": "Abjurador do Selo Cinzento",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Mago",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a uma unidade inimiga."
      }
    ],
    "description": "Escudo Divino. Armadura 1. Ao Entrar: Causa 2 de dano a uma unidade inimiga.",
    "flavorText": "Nenhuma seta atravessa a geometria perfeita.",
    "imagePath": "/assets/cards/neutral_63_abjurador_errante.webp"
  },
  {
    "id": "neutral_64_adivinho_astrolabio",
    "name": "Vidente do Astrolábio",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Oráculo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 1,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Alcance. Ao Entrar: Compra 1 carta.",
    "flavorText": "Eu já vi sua derrota três turnos atrás.",
    "imagePath": "/assets/cards/neutral_64_adivinho_astrolabio.webp"
  },
  {
    "id": "neutral_65_adepto_punho_ferro",
    "name": "Adepto do Punho de Cinza",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Monge",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "O aço dobra; o osso temperado na cinza não.",
    "imagePath": "/assets/cards/neutral_65_adepto_punho_ferro.webp"
  },
  {
    "id": "neutral_66_bardo_cronicas_ferro",
    "name": "Menestrel das Lâminas Cantantes",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Meio-Elfo • Bardo",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a um aliado.",
        "secondaryValue": 1
      }
    ],
    "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a um aliado.",
    "flavorText": "Uma estrofe pelo ouro, outra pelo sangue.",
    "imagePath": "/assets/cards/neutral_66_bardo_cronicas_ferro.webp"
  },
  {
    "id": "neutral_67_arqueiro_companhia_livre",
    "name": "Besteiro de Repetição da Fronteira",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Atirador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Alcance. Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo.",
    "flavorText": "Seis virotes antes do primeiro grito cair.",
    "imagePath": "/assets/cards/neutral_67_arqueiro_companhia_livre.webp"
  },
  {
    "id": "neutral_68_piqueiro_escudo_negro",
    "name": "Piqueiro da Falange Cinzenta",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Soldado",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 1,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Último Suspiro: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião. Último Suspiro: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "A lança para o cavalo; o escudo para o cavaleiro.",
    "imagePath": "/assets/cards/neutral_68_piqueiro_escudo_negro.webp"
  },
  {
    "id": "neutral_69_funda_chumbo_xvart",
    "name": "Saqueador Subterrâneo das Cavernas",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humanoide • Saqueador",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Alcance. Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "Pequeno no tamanho, grande na ganância.",
    "imagePath": "/assets/cards/neutral_69_funda_chumbo_xvart.webp"
  },
  {
    "id": "neutral_70_batedor_tabaxi",
    "name": "Rastreador Felino das Ruínas",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Fera Humanoide • Batedor",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano a uma unidade inimiga."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Causa 1 de dano a uma unidade inimiga.",
    "flavorText": "A curiosidade mata apenas quem é lento.",
    "imagePath": "/assets/cards/neutral_70_batedor_tabaxi.webp"
  },
  {
    "id": "neutral_71_imitador_kenku",
    "name": "Falsário Corvino dos Becos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humanoide • Ladino",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a um aliado."
      }
    ],
    "description": "Toque Letal. Ao Entrar: Concede +1 ATQ e +1 VIDA a um aliado.",
    "flavorText": "Ele fala com a voz do último homem que matou.",
    "imagePath": "/assets/cards/neutral_71_imitador_kenku.webp"
  },
  {
    "id": "neutral_72_quebra_ossos_golias",
    "name": "Vanguarda Golias dos Picos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Gigante • Guerreiro",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião. Ao Entrar: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "A montanha não recua diante do vento.",
    "imagePath": "/assets/cards/neutral_72_quebra_ossos_golias.webp"
  },
  {
    "id": "neutral_73_mineiro_svirfneblin",
    "name": "Sapador Gnomo das Profundezas",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Gnomo • Engenheiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a uma unidade inimiga."
      }
    ],
    "description": "Guardião. Armadura 1. Ao Entrar: Causa 2 de dano a uma unidade inimiga.",
    "flavorText": "Toda rocha tem uma veia fraca; toda armadura também.",
    "imagePath": "/assets/cards/neutral_73_mineiro_svirfneblin.webp"
  },
  {
    "id": "neutral_74_sentinela_duergar",
    "name": "Infante Encouraçado Cinzento",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Anão • Soldado",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Guardião. Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo.",
    "flavorText": "Forjados sem sol, temperados sem piedade.",
    "imagePath": "/assets/cards/neutral_74_sentinela_duergar.webp"
  },
  {
    "id": "neutral_75_batedor_derro",
    "name": "Espreitador Pálido das Fendas",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humanoide • Assassino",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Último Suspiro: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ímpeto. Último Suspiro: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Nos túneis sem eco, o riso vem depois do golpe.",
    "imagePath": "/assets/cards/neutral_75_batedor_derro.webp"
  },
  {
    "id": "neutral_76_gato_escarpas_norte",
    "name": "Predador das Escarpas Brancas",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Fera • Predador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Ímpeto. Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "Seu rugido imita um grito humano na nevasca.",
    "imagePath": "/assets/cards/neutral_76_gato_escarpas_norte.webp"
  },
  {
    "id": "neutral_77_familiar_tressym",
    "name": "Gato Alado Vigia das Torres",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Fera • Alado",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 1,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo. Ao Entrar: Compra 1 carta.",
    "flavorText": "Quatro patas silenciosas e duas asas atentas.",
    "imagePath": "/assets/cards/neutral_77_familiar_tressym.webp"
  },
  {
    "id": "neutral_78_cacador_uthgardt",
    "name": "Lanceiro Tribal do Norte",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Bárbaro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a um aliado."
      }
    ],
    "description": "Fúria Crescente. Ao Entrar: Concede +1 ATQ e +1 VIDA a um aliado.",
    "flavorText": "O sangue aquece mais que qualquer manto.",
    "imagePath": "/assets/cards/neutral_78_cacador_uthgardt.webp"
  },
  {
    "id": "neutral_79_dragonete_guarda_neutro",
    "name": "Dragonete de Guarda Escamado",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Dragão • Guarda",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião. Ao Entrar: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Não voa nem cospe fogo, mas suas mandíbulas nunca soltam.",
    "imagePath": "/assets/cards/neutral_79_dragonete_guarda_neutro.webp"
  },
  {
    "id": "neutral_80_dragonete_emboscada",
    "name": "Dragonete Corredor de Emboscada",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Dragão • Predador",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Voo, Ímpeto. Armadura 1. Ao Entrar: Compra 1 carta.",
    "flavorText": "Mais rápido que um cavalo e mais silencioso que um lobo.",
    "imagePath": "/assets/cards/neutral_80_dragonete_emboscada.webp"
  },
  {
    "id": "neutral_81_operario_relojoeiro",
    "name": "Operário de Corda de Ferro",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Autômato",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Guardião, Ímpeto. Armadura 1. Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo.",
    "flavorText": "Um giro da chave no peito vale por um dia de batalha.",
    "imagePath": "/assets/cards/neutral_81_operario_relojoeiro.webp"
  },
  {
    "id": "neutral_82_artilheiro_polvora_cinza",
    "name": "Mosqueteiro da Liga Cinzenta",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Artilheiro",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Último Suspiro: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Alcance. Último Suspiro: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Contra chumbo quente, nenhum brasão protege.",
    "imagePath": "/assets/cards/neutral_82_artilheiro_polvora_cinza.webp"
  },
  {
    "id": "neutral_83_medico_peste_fronteira",
    "name": "Alquimista de Campo Cinzento",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Alquimista",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 1,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_target_ally",
        "value": 3,
        "description": "Ao Entrar: Restaura 3 de VIDA de um aliado."
      }
    ],
    "description": "Ao Entrar: Restaura 3 de VIDA de um aliado.",
    "flavorText": "Vai arder mais que a espada, mas você continuará de pé.",
    "imagePath": "/assets/cards/neutral_83_medico_peste_fronteira.webp"
  },
  {
    "id": "neutral_84_cao_guerra_encouracado",
    "name": "Mastim de Ferro da Caravana",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Fera • Guardião",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano a uma unidade inimiga."
      }
    ],
    "description": "Guardião, Ímpeto. Armadura 1. Ao Entrar: Causa 1 de dano a uma unidade inimiga.",
    "flavorText": "Dorme sobre os sacos de ouro com um olho aberto.",
    "imagePath": "/assets/cards/neutral_84_cao_guerra_encouracado.webp"
  },
  {
    "id": "neutral_85_carregador_tocha_masmorra",
    "name": "Desbravador de Catacumba",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Explorador",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta.",
    "flavorText": "Nunca pise na pedra mais limpa do corredor.",
    "imagePath": "/assets/cards/neutral_85_carregador_tocha_masmorra.webp"
  },
  {
    "id": "neutral_86_gargula_sentinela_ponte",
    "name": "Gárgula da Ponte dos Selos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elemental • Constructo",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 0,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião • Voo. Ao Entrar: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Séculos de chuva apenas afiaram suas garras de pedra.",
    "imagePath": "/assets/cards/neutral_86_gargula_sentinela_ponte.webp"
  },
  {
    "id": "neutral_87_armadura_animada_vigia",
    "name": "Couraça Animada do Arsenal",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Guardião",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 2,
    "armor": 2,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Guardião. Ao Entrar: Compra 1 carta.",
    "flavorText": "Vazia por dentro, mas inabalável na linha de frente.",
    "imagePath": "/assets/cards/neutral_87_armadura_animada_vigia.webp"
  },
  {
    "id": "neutral_88_espada_voadora_runica",
    "name": "Gládio Levitante do Salão",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Lâmina",
    "rarity": "common",
    "cost": 1,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Voo • Ímpeto. Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo.",
    "flavorText": "Sem braço que canse, sem pulso que trema.",
    "imagePath": "/assets/cards/neutral_88_espada_voadora_runica.webp"
  },
  {
    "id": "neutral_89_tapete_estrangulador",
    "name": "Tapeçaria Constrictora Real",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Armadilha",
    "rarity": "common",
    "cost": 2,
    "affinityReq": 0,
    "atk": 1,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela (imobiliza por 1 turno) 1 unidade inimiga."
      }
    ],
    "description": "Guardião. Ao Entrar: Congela (imobiliza por 1 turno) 1 unidade inimiga.",
    "flavorText": "O tapete mais caro do palácio é o último que você pisa.",
    "imagePath": "/assets/cards/neutral_89_tapete_estrangulador.webp"
  },
  {
    "id": "neutral_90_mimico_bau_ferro",
    "name": "Mímico do Cofre de Ferro",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Monstruosidade • Metamorfo",
    "rarity": "common",
    "cost": 3,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Toque Letal. Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "A fechadura tem dentes; a tampa tem língua.",
    "imagePath": "/assets/cards/neutral_90_mimico_bau_ferro.webp"
  },
  {
    "id": "neutral_91_campeao_arena_livre",
    "name": "Campeão Invicto do Coliseu",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Campeão",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a uma unidade inimiga."
      }
    ],
    "description": "Guardião • Fúria Crescente. Ao Entrar: Causa 2 de dano a uma unidade inimiga.",
    "flavorText": "A multidão ruge; o aço decide.",
    "imagePath": "/assets/cards/neutral_91_campeao_arena_livre.webp"
  },
  {
    "id": "neutral_92_senhor_guerra_fronteira",
    "name": "Marechal Mercenário da Fronteira",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Comandante",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a todos os aliados.",
        "secondaryValue": 1
      }
    ],
    "description": "Guardião. Ao Entrar: Concede +1 ATQ e +1 VIDA a todos os aliados.",
    "flavorText": "Mantenham os escudos unidos ou morram sozinhos!",
    "imagePath": "/assets/cards/neutral_92_senhor_guerra_fronteira.webp"
  },
  {
    "id": "neutral_93_ladrao_mestre_mascara",
    "name": "Mestre-Ladrão da Guilda Cinza",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Assassino",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Atacar: Compra 1 carta."
      }
    ],
    "description": "Ímpeto • Toque Letal. Armadura 1. Ao Atacar: Compra 1 carta.",
    "flavorText": "Trancas existem apenas para manter os honestos do lado de fora.",
    "imagePath": "/assets/cards/neutral_93_ladrao_mestre_mascara.webp"
  },
  {
    "id": "neutral_94_arqueiro_zenite",
    "name": "Arqueiro Mestre do Zênite",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elfo • Atirador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a uma unidade inimiga."
      }
    ],
    "description": "Alcance. Ao Entrar: Causa 2 de dano a uma unidade inimiga.",
    "flavorText": "Eu não miro no peito; miro no olho.",
    "imagePath": "/assets/cards/neutral_94_arqueiro_zenite.webp"
  },
  {
    "id": "neutral_95_transmutador_alquimico",
    "name": "Transmutador da Pedra Cinzenta",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Mago",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "description": "Ao Entrar: Concede +2 ATQ e +2 VIDA a um aliado.",
        "secondaryValue": 2
      }
    ],
    "description": "Alcance. Ao Entrar: Concede +2 ATQ e +2 VIDA a um aliado.",
    "flavorText": "Toda matéria obedece a quem conhece sua cifra.",
    "imagePath": "/assets/cards/neutral_95_transmutador_alquimico.webp"
  },
  {
    "id": "neutral_96_conjurador_circulo_neutro",
    "name": "Conjurador dos Portais Cinzentos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Conjurador",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao Entrar: Invoca um Campeão/Guarda 2/2 na Vanguarda.",
        "secondaryValue": 2
      }
    ],
    "description": "Ao Entrar: Invoca um Campeão/Guarda 2/2 na Vanguarda.",
    "flavorText": "Por que lutar sozinho quando o multiverso está cheio de servos?",
    "imagePath": "/assets/cards/neutral_96_conjurador_circulo_neutro.webp"
  },
  {
    "id": "neutral_97_caracol_mangual_prisma",
    "name": "Caracol-Mangual de Casco Prismático",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elemental • Monstruosidade",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 3,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Ao Entrar: Reduz em -2 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Guardião • Escudo Divino. Ao Entrar: Reduz em -2 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "Seu casco vale uma fortuna — para quem sobreviver aos cinco manguais.",
    "imagePath": "/assets/cards/neutral_97_caracol_mangual_prisma.webp"
  },
  {
    "id": "neutral_98_banderhobb_cacador",
    "name": "Papo-Negro Engolidor de Alvos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Monstruosidade • Caçador",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela (imobiliza por 1 turno) 1 unidade inimiga."
      }
    ],
    "description": "Atropelar. Ao Entrar: Congela (imobiliza por 1 turno) 1 unidade inimiga.",
    "flavorText": "Enquanto houver um fio de cabelo da presa, ele não parará.",
    "imagePath": "/assets/cards/neutral_98_banderhobb_cacador.webp"
  },
  {
    "id": "neutral_99_tlincalli_ferrao_aco",
    "name": "Caçador-Escorpião do Deserto Cinza",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Monstruosidade • Escorpião",
    "rarity": "uncommon",
    "cost": 4,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao Entrar: Concede +2 ATQ e +2 VIDA a um aliado."
      }
    ],
    "description": "Toque Letal. Ao Entrar: Concede +2 ATQ e +2 VIDA a um aliado.",
    "flavorText": "Nas dunas de cinza, o ferrão desce antes da sombra.",
    "imagePath": "/assets/cards/neutral_99_tlincalli_ferrao_aco.webp"
  },
  {
    "id": "neutral_100_morkoth_ilha_errante",
    "name": "Espectro Abissal Colecionador de Relíquias",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Aberração • Colecionador",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "steal_small_enemy",
        "value": 2,
        "description": "Ao Entrar: Assume o controle de um inimigo com ATQ <= 2."
      }
    ],
    "description": "Alcance. Ao Entrar: Assume o controle de um inimigo com ATQ <= 2.",
    "flavorText": "Tudo o que brilha ou pensa acabará na minha coleção.",
    "imagePath": "/assets/cards/neutral_100_morkoth_ilha_errante.webp"
  },
  {
    "id": "neutral_101_neogi_mercador_escravista",
    "name": "Mercador Astral Aracnoide",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Aberração • Mercador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Dreno de Vida. Ao Entrar: Compra 1 carta.",
    "flavorText": "Na contabilidade do Mercador Astral, não existem aliados, apenas propriedades.",
    "imagePath": "/assets/cards/neutral_101_neogi_mercador_escravista.webp"
  },
  {
    "id": "neutral_102_cavaleiro_dragao_purpura",
    "name": "Comandante do Dragão Púrpura",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Cavaleiro",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todas as unidades aliadas."
      }
    ],
    "description": "Guardião. Ao Entrar: Concede Escudo Divino a todas as unidades aliadas.",
    "flavorText": "Pela coroa ou pelo contrato, ninguém recua um passo!",
    "imagePath": "/assets/cards/neutral_102_cavaleiro_dragao_purpura.webp"
  },
  {
    "id": "neutral_103_lamina_cantante_cinza",
    "name": "Mestre da Lâmina Cantante",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elfo • Duelista Arcano",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 5,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Último Suspiro: Restaura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Ímpeto • Escudo Divino. Último Suspiro: Restaura 3 de VIDA do seu Soberano.",
    "flavorText": "O som do aço cortando o ar é o único cântico necessário.",
    "imagePath": "/assets/cards/neutral_103_lamina_cantante_cinza.webp"
  },
  {
    "id": "neutral_104_mago_guerra_bastiao",
    "name": "Mago de Guerra do Bastião",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Arcanista",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano a todas as unidades na Vanguarda inimiga."
      }
    ],
    "description": "Alcance. Ao Entrar: Causa 1 de dano a todas as unidades na Vanguarda inimiga.",
    "flavorText": "A artilharia arcana não precisa de catapultas.",
    "imagePath": "/assets/cards/neutral_104_mago_guerra_bastiao.webp"
  },
  {
    "id": "neutral_105_cacador_sangue_mutageno",
    "name": "Caçador de Monstros Alquímico",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Caçador",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Ao Entrar: Causa 1 de dano a uma unidade inimiga."
      }
    ],
    "description": "Toque Letal • Fúria Crescente. Ao Entrar: Causa 1 de dano a uma unidade inimiga.",
    "flavorText": "Para matar o monstro, aceite metade do veneno dele.",
    "imagePath": "/assets/cards/neutral_105_cacador_sangue_mutageno.webp"
  },
  {
    "id": "neutral_106_reen_assassino_relojoeiro",
    "name": "Reen, Ceifador de Engrenagens",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Assassino",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "description": "Ao Entrar: Concede +2/+2 a um aliado."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Lâminas giratórias causam 2 de dano a um inimigo."
      }
    ],
    "description": "Voo • Ímpeto • Escudo Divino. Armadura 1. Ao Entrar: Concede +2/+2 a um aliado e causa 2 de dano a um inimigo.",
    "flavorText": "Quando ouvir o zumbido de suas engrenagens, sua cabeça já rolou.",
    "imagePath": "/assets/cards/neutral_106_reen_assassino_relojoeiro.webp"
  },
  {
    "id": "neutral_107_colosso_forja_vapor",
    "name": "Juggernaut de Caldeira e Bronze",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Colosso",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao Entrar: Restaura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Guardião • Atropelar. Ao Entrar: Restaura 3 de VIDA do seu Soberano.",
    "flavorText": "Pressão máxima nas válvulas; caminho livre à frente.",
    "imagePath": "/assets/cards/neutral_107_colosso_forja_vapor.webp"
  },
  {
    "id": "neutral_108_inquisidor_cinzento",
    "name": "Juiz-Caçador da Fronteira",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Inquisidor",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Ao Entrar: Reduz em -2 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Ao Entrar: Reduz em -2 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "A prata fria queima apenas quem esconde um pacto.",
    "imagePath": "/assets/cards/neutral_108_inquisidor_cinzento.webp"
  },
  {
    "id": "neutral_109_aranha_pedra_steeder",
    "name": "Aranha-Montaria das Profundezas",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Fera • Aracnídeo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Ímpeto. Ao Atacar: Causa 1 de dano diretamente ao Soberano inimigo.",
    "flavorText": "Salta trinta metros de um pilar de estalactite ao outro.",
    "imagePath": "/assets/cards/neutral_109_aranha_pedra_steeder.webp"
  },
  {
    "id": "neutral_110_mercador_lago_escuro",
    "name": "Contrabandista do Lago Escuro",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humanoide • Mercador",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Ao Entrar: Gera +1⚡ de Essência extra neste turno.",
    "flavorText": "Ouro da superfície ou pérola do abismo, tudo pesa igual na balança.",
    "imagePath": "/assets/cards/neutral_110_mercador_lago_escuro.webp"
  },
  {
    "id": "neutral_111_gargula_areia_iymrith",
    "name": "Gárgula Petrificada do Deserto",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elemental • Constructo",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 2,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Guardião • Voo. Ao Entrar: Reduz em -1 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "Onde parece haver apenas uma estátua, há uma emboscada.",
    "imagePath": "/assets/cards/neutral_111_gargula_areia_iymrith.webp"
  },
  {
    "id": "neutral_112_caranguejo_colossal_costa",
    "name": "Caranguejo-Bastião das Rochas",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Fera • Colosso",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 3,
    "armor": 3,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a uma unidade inimiga."
      }
    ],
    "description": "Guardião. Ao Entrar: Causa 2 de dano a uma unidade inimiga.",
    "flavorText": "Confundido com um recife até o momento em que as pinças se fecham.",
    "imagePath": "/assets/cards/neutral_112_caranguejo_colossal_costa.webp"
  },
  {
    "id": "neutral_113_gigante_pedra_entalhador",
    "name": "Gigante Entalhador de Monólitos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Gigante • Escultor",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Ao Entrar: Causa 4 de dano a uma unidade inimiga."
      }
    ],
    "description": "Guardião • Alcance. Armadura 2. Ao Entrar: Causa 4 de dano a uma unidade inimiga.",
    "flavorText": "Cada rocha arremessada carrega o peso de uma montanha.",
    "imagePath": "/assets/cards/neutral_113_gigante_pedra_entalhador.webp"
  },
  {
    "id": "neutral_114_emissario_conselho_aguas",
    "name": "Emissário Real do Conselho",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Diplomata",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      }
    ],
    "description": "Guardião, Escudo Divino. Armadura 1. Ao Entrar: Compra 2 cartas.",
    "flavorText": "Quando o céu pega fogo, até inimigos mortais assinam o mesmo pergaminho.",
    "imagePath": "/assets/cards/neutral_114_emissario_conselho_aguas.webp"
  },
  {
    "id": "neutral_115_golem_ferro_fornalha_neutra",
    "name": "Colosso de Ferro da Cidadela",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Colosso",
    "rarity": "rare",
    "cost": 6,
    "affinityReq": 0,
    "atk": 6,
    "armor": 3,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      }
    ],
    "description": "Guardião • Atropelar. Ao Entrar: Compra 2 cartas.",
    "flavorText": "Nem magia nem aço comum deixam sequer um risco em seu peito.",
    "imagePath": "/assets/cards/neutral_115_golem_ferro_fornalha_neutra.webp"
  },
  {
    "id": "neutral_116_harshnag_machado_inverno",
    "name": "Skrym-Khor, O Gigante Quebra-Tronos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Gigante • Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 0,
    "atk": 6,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a todas as unidades na Vanguarda inimiga."
      }
    ],
    "description": "Guardião • Atropelar. Ao Entrar: Causa 2 de dano a todas as unidades na Vanguarda inimiga.",
    "flavorText": "Até os gigantes se curvam quando seu machado de guerra desce.",
    "imagePath": "/assets/cards/neutral_116_harshnag_machado_inverno.webp"
  },
  {
    "id": "neutral_117_elminster_sabio_cinzento",
    "name": "Valerius, Arquimago dos Sete Selos",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Arquimago Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Alcance • Escudo Divino. Ao Entrar: Compra 2 cartas. Início do Turno: Gera +1⚡ de Essência extra neste turno.",
    "flavorText": "Conheço o nome verdadeiro de cada demônio e o preço de cada rei.",
    "imagePath": "/assets/cards/neutral_117_elminster_sabio_cinzento.webp"
  },
  {
    "id": "neutral_118_volothamp_cronista_mundos",
    "name": "Aldous, Grande Cronista do Bestiário",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Humano • Cronista Lendário",
    "rarity": "legendary",
    "cost": 4,
    "affinityReq": 0,
    "atk": 2,
    "armor": 0,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 3,
        "description": "Ao Entrar: Compra 3 cartas."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "description": "Início do Turno: Concede +1 ATQ e +1 VIDA a um aliado.",
        "secondaryValue": 1
      }
    ],
    "description": "Escudo Divino. Ao Entrar: Compra 3 cartas. Início do Turno: Concede +1 ATQ e +1 VIDA a um aliado.",
    "flavorText": "Primeiro de tudo, um aviso: há monstros aqui — e eu anotei como vencê-los!",
    "imagePath": "/assets/cards/neutral_118_volothamp_cronista_mundos.webp"
  },
  {
    "id": "neutral_119_colosso_vonindod_fragmento",
    "name": "Titã Ferrostor, O Devastador de Dragões",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Titã Lendário",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 0,
    "atk": 8,
    "armor": 3,
    "hp": 9,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a todas as unidades em campo."
      }
    ],
    "description": "Guardião • Atropelar • Escudo Divino. Ao Entrar: Causa 2 de dano a todas as unidades em campo.",
    "flavorText": "Quando seus passos ressoam, até os dragões anciãos buscam abrigo nas cavernas.",
    "imagePath": "/assets/cards/neutral_119_colosso_vonindod_fragmento.webp"
  },
  {
    "id": "neutral_120_xanathar_senhor_crime",
    "name": "Oculus-Vex, O Olho Mecânico do Submundo",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Olho Mecânico",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 0,
    "atk": 6,
    "armor": 1,
    "hp": 8,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "destroy_enemy",
        "value": 1,
        "description": "Ao Entrar: Destrói 1 unidade inimiga imediatamente."
      },
      {
        "trigger": "on_attack",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Atacar: Compra 1 carta."
      }
    ],
    "description": "Voo • Alcance. Ao Entrar: Destrói 1 unidade inimiga imediatamente. Ao Atacar: Compra 1 carta.",
    "flavorText": "Nenhuma moeda troca de mãos nas galerias subterrâneas sem que suas lentes de cristal registrem o acordo.",
    "imagePath": "/assets/cards/neutral_120_xanathar_senhor_crime.webp"
  },
  {
    "id": "neutral_121_vizeran_arquimago_exilado",
    "name": "Malphas, O Tecelão do Ritual Abissal",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elfo • Arquimago Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 0,
    "atk": 5,
    "armor": 1,
    "hp": 7,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a todas as unidades na Vanguarda inimiga."
      }
    ],
    "description": "Alcance • Dreno de Vida. Ao Entrar: Causa 3 de dano a todas as unidades na Vanguarda inimiga.",
    "flavorText": "Deixe que os monstros destruam uns aos outros; nós recolhemos as cinzas.",
    "imagePath": "/assets/cards/neutral_121_vizeran_arquimago_exilado.webp"
  },
  {
    "id": "neutral_122_rei_hekaton_neutro_arbitro",
    "name": "Atlas-Khor, O Regente do Ordenamento",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Gigante • Monarca Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 0,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "description": "Ao Entrar: Concede +2 ATQ e +2 VIDA a todos os aliados.",
        "secondaryValue": 2
      }
    ],
    "description": "Guardião • Alcance. Ao Entrar: Concede +2 ATQ e +2 VIDA a todos os aliados.",
    "flavorText": "Quando o Ordenamento é mantido, cada montanha e cada mar conhece o seu lugar.",
    "imagePath": "/assets/cards/neutral_122_rei_hekaton_neutro_arbitro.webp"
  },
  {
    "id": "neutral_123_emissario_relojoeiro_supremo",
    "name": "Deus-Máquina de Aeternus",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Constructo • Divindade Mecânica",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 0,
    "atk": 6,
    "armor": 3,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Início do Turno: Concede Escudo Divino a todas as unidades aliadas."
      }
    ],
    "description": "Guardião • Renascer. Início do Turno: Concede Escudo Divino a todas as unidades aliadas.",
    "flavorText": "Carne apodrece e juramentos quebram; a engrenagem primordial jamais falha.",
    "imagePath": "/assets/cards/neutral_123_emissario_relojoeiro_supremo.webp"
  },
  {
    "id": "neutral_124_tarrasque_despertar_neutro",
    "name": "Gorgonoth, O Devorador de Continentes",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Monstruosidade • Titã Primordial",
    "rarity": "legendary",
    "cost": 9,
    "affinityReq": 0,
    "atk": 10,
    "armor": 3,
    "hp": 10,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Atropelar",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a todas as unidades em campo."
      }
    ],
    "description": "Guardião • Atropelar • Pele Incandescente. Ao Entrar: Causa 3 de dano a todas as unidades em campo.",
    "flavorText": "Ele não serve ao Fogo, nem ao Gelo, nem à Luz: ele é o fim de todos os tronos.",
    "imagePath": "/assets/cards/neutral_124_tarrasque_despertar_neutro.webp"
  },
  {
    "id": "neutral_125_estandarte_runa_krig",
    "name": "Estandarte da Runa Krig (Guerra)",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Estandarte • Runa Gigante",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a todos os aliados.",
        "secondaryValue": 1
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "description": "Início do Turno: Concede +1 ATQ e +1 VIDA a um aliado.",
        "secondaryValue": 1
      }
    ],
    "description": "Ao Entrar: Concede +1 ATQ e +1 VIDA a todos os aliados. Início do Turno: Concede +1 ATQ e +1 VIDA a um aliado.",
    "flavorText": "Onde a runa Krig tremula, nenhum guerreiro sente o peso do medo.",
    "imagePath": "/assets/cards/neutral_125_estandarte_runa_krig.webp"
  },
  {
    "id": "neutral_126_concha_runa_uvar",
    "name": "Concha do Teleporte Uvar",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Instrumento • Runa Gigante",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Ao Entrar: Devolve 1 unidade inimiga para a mão do oponente."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      }
    ],
    "description": "Ao Entrar: Devolve 1 unidade inimiga para a mão do oponente. Ao Entrar: Compra 1 carta.",
    "flavorText": "Seu som ecoa a cem léguas de distância e abre o caminho entre os tronos.",
    "imagePath": "/assets/cards/neutral_126_concha_runa_uvar.webp"
  },
  {
    "id": "neutral_127_cetro_regente_shanatar",
    "name": "Cetro Regente das Sete Minas",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Cetro • Anão",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todas as unidades aliadas."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Ao Entrar: Concede Escudo Divino a todas as unidades aliadas. Início do Turno: Gera +1⚡ de Essência extra neste turno.",
    "flavorText": "Nove tronos sob a montanha, nove cetros para governar a pedra.",
    "imagePath": "/assets/cards/neutral_127_cetro_regente_shanatar.webp"
  },
  {
    "id": "neutral_128_trono_cranio_dragao",
    "name": "Trono do Crânio Dracônico",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Trono • Ancestral",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "description": "Ao Entrar: Concede +2 ATQ e +2 VIDA a todos os aliados.",
        "secondaryValue": 2
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Início do Turno: Causa 2 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Concede +2 ATQ e +2 VIDA a todos os aliados. Início do Turno: Causa 2 de dano diretamente ao Soberano inimigo.",
    "flavorText": "Apenas quem possui sangue de titã suporta sentar-se entre suas presas.",
    "imagePath": "/assets/cards/neutral_128_trono_cranio_dragao.webp"
  },
  {
    "id": "neutral_129_mascara_rainha_pentacromatica",
    "name": "A Grande Máscara Pentacromática",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Dracônico",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a todas as unidades na Vanguarda inimiga."
      },
      {
        "trigger": "turn_start",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Início do Turno: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano a todas as unidades na Vanguarda inimiga. Início do Turno: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Cinco vozes, cinco sopros, uma única soberania.",
    "imagePath": "/assets/cards/neutral_129_mascara_rainha_pentacromatica.webp"
  },
  {
    "id": "neutral_130_orbe_runa_stein",
    "name": "Orbe Monolítico da Runa Stein",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Orbe • Runa Gigante",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "description": "Ao Entrar: Concede +1 ATQ e +3 VIDA a um aliado.",
        "secondaryValue": 3
      }
    ],
    "description": "Ao Entrar: Concede +1 ATQ e +3 VIDA a um aliado.",
    "flavorText": "Quem carrega a runa Stein tem raízes na própria montanha.",
    "imagePath": "/assets/cards/neutral_130_orbe_runa_stein.webp"
  },
  {
    "id": "neutral_131_manto_deslocamento_ilusorio",
    "name": "Manto da Pantera Espectral",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Equipamento • Ilusão",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao Entrar: Concede Escudo Divino a todas as unidades aliadas."
      }
    ],
    "description": "Ao Entrar: Concede Escudo Divino a todas as unidades aliadas.",
    "flavorText": "Você sempre acerta a sombra; o dono do manto já está atrás de você.",
    "imagePath": "/assets/cards/neutral_131_manto_deslocamento_ilusorio.webp"
  },
  {
    "id": "neutral_132_espada_vingadora_runica",
    "name": "Gládio Juramentado da Fronteira",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Armamento • Lâmina",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 3,
        "secondaryValue": 3,
        "description": "Ao Entrar: Concede +3 ATQ e +3 VIDA a um aliado."
      },
      {
        "trigger": "turn_start",
        "type": "damage_single_enemy",
        "value": 1,
        "description": "Início do Turno: Causa 1 de dano a uma unidade inimiga."
      }
    ],
    "description": "Ao Entrar: Concede +3 ATQ e +3 VIDA a um aliado. Início do Turno: Causa 1 de dano a uma unidade inimiga.",
    "flavorText": "Basta o primeiro corte para que a lâmina exija o duelo até o fim.",
    "imagePath": "/assets/cards/neutral_132_espada_vingadora_runica.webp"
  },
  {
    "id": "neutral_133_escudo_sentinela_olho",
    "name": "Escudo Sentinela Sempre-Atento",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Equipamento • Escudo",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 3,
        "description": "Ao Entrar: Concede +1 ATQ e +3 VIDA a um aliado."
      }
    ],
    "description": "Armadura 1. Ao Entrar: Compra 1 carta e concede +1 ATQ e +3 VIDA a um aliado.",
    "flavorText": "O portador pode fechar os olhos; o escudo nunca dorme.",
    "imagePath": "/assets/cards/neutral_133_escudo_sentinela_olho.webp"
  },
  {
    "id": "neutral_134_baralho_muitas_coisas",
    "name": "O Baralho das Muitas Sortes",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Destino",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Início do Turno: Gera +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Ao Entrar: Compra 2 cartas. Início do Turno: Gera +1⚡ de Essência extra neste turno.",
    "flavorText": "Puxe uma carta se tiver coragem: o Trono ou o Vazio.",
    "imagePath": "/assets/cards/neutral_134_baralho_muitas_coisas.webp"
  },
  {
    "id": "neutral_135_elmo_compreensao_brilhante",
    "name": "Elmo das Mil Joias",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Regalia • Elmo",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao Entrar: Causa 2 de dano a todas as unidades na Vanguarda inimiga."
      }
    ],
    "description": "Ao Entrar: Causa 2 de dano a todas as unidades na Vanguarda inimiga.",
    "flavorText": "Cada gema da coroa guarda uma tempestade diferente.",
    "imagePath": "/assets/cards/neutral_135_elmo_compreensao_brilhante.webp"
  },
  {
    "id": "neutral_136_cinto_forca_gigante",
    "name": "Cinturão de Força de Titã",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Equipamento • Força",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 3,
        "description": "Ao Entrar: Concede +3 ATQ e +2 VIDA a um aliado.",
        "secondaryValue": 2
      }
    ],
    "description": "Ao Entrar: Concede +3 ATQ e +2 VIDA a um aliado.",
    "flavorText": "Com esta fivela na cintura, uma espada de duas mãos pesa como um graveto.",
    "imagePath": "/assets/cards/neutral_136_cinto_forca_gigante.webp"
  },
  {
    "id": "neutral_137_botas_velocidade_mercurio",
    "name": "Grevas da Velocidade Relâmpago",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Equipamento • Agilidade",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "description": "Ao Entrar: Concede +2 ATQ e +1 VIDA a um aliado.",
        "secondaryValue": 1
      }
    ],
    "description": "Ao Entrar: Concede +2 ATQ e +1 VIDA a um aliado.",
    "flavorText": "Bata os calcanhares e atravesse o campo antes que a flecha caia.",
    "imagePath": "/assets/cards/neutral_137_botas_velocidade_mercurio.webp"
  },
  {
    "id": "neutral_138_anel_ariete_forca",
    "name": "Anel do Aríete de Ferro",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Anel • Impacto",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao Entrar: Causa 3 de dano a uma unidade inimiga."
      }
    ],
    "description": "Ao Entrar: Causa 3 de dano a uma unidade inimiga.",
    "flavorText": "Um soco no ar a dez passos derruba uma porta de carvalho.",
    "imagePath": "/assets/cards/neutral_138_anel_ariete_forca.webp"
  },
  {
    "id": "neutral_139_amuleto_planos_astrolabio",
    "name": "Amuleto dos Planos Exteriores",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Amuleto • Planar",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Ao Entrar: Compra 2 cartas."
      }
    ],
    "description": "Ao Entrar: Compra 2 cartas.",
    "flavorText": "Gire o disco interno e escolha em qual mundo deseja pisar.",
    "imagePath": "/assets/cards/neutral_139_amuleto_planos_astrolabio.webp"
  },
  {
    "id": "neutral_140_urna_cerebral_preservada",
    "name": "Urna Cerebral de Salmoura Arcana",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Recipiente • Psíquico",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "turn_start",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Início do Turno: Causa 1 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Início do Turno: Causa 1 de dano diretamente ao Soberano inimigo.",
    "flavorText": "O corpo morreu há séculos; a mente dentro do vidro ainda planeja.",
    "imagePath": "/assets/cards/neutral_140_urna_cerebral_preservada.webp"
  },
  {
    "id": "neutral_141_lanterna_revelacao_veraz",
    "name": "Lanterna da Revelação Veraz",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Instrumento • Luz",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao Entrar: Compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao Entrar: Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Ao Entrar: Compra 1 carta. Ao Entrar: Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Sob este facho, nenhuma sombra mente.",
    "imagePath": "/assets/cards/neutral_141_lanterna_revelacao_veraz.webp"
  },
  {
    "id": "neutral_142_trombeta_valhalla_ferro",
    "name": "Trombeta de Ferro dos Berserkers",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Instrumento • Guerra",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 3,
        "description": "Ao Entrar: Invoca um Campeão/Guarda 3/3 na Vanguarda.",
        "secondaryValue": 3
      }
    ],
    "description": "Ao Entrar: Invoca um Campeão/Guarda 3/3 na Vanguarda.",
    "flavorText": "Um único sopro desperta os heróis que caíram antes da Fratura.",
    "imagePath": "/assets/cards/neutral_142_trombeta_valhalla_ferro.webp"
  },
  {
    "id": "neutral_143_espelho_aprisionar_almas",
    "name": "Espelho do Aprisionamento Planar",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Artefato • Prisão",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao Entrar: Congela (imobiliza por 1 turno) 1 unidade inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Ao Entrar: Devolve 1 unidade inimiga para a mão do oponente."
      }
    ],
    "description": "Ao Entrar: Congela (imobiliza por 1 turno) 1 unidade inimiga. Ao Entrar: Devolve 1 unidade inimiga para a mão do oponente.",
    "flavorText": "Olhe para o seu reflexo e descubra que é ele quem está do lado de fora.",
    "imagePath": "/assets/cards/neutral_143_espelho_aprisionar_almas.webp"
  },
  {
    "id": "neutral_144_nucleo_relojoeiro_aeternus",
    "name": "Coração de Mola Perpétua",
    "domain": "neutral",
    "type": "relic",
    "subtype": "Relíquia • Núcleo • Mecânico",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao Entrar: Gera +1⚡ de Essência extra neste turno."
      },
      {
        "trigger": "turn_start",
        "type": "buff_target_ally",
        "value": 1,
        "description": "Início do Turno: Concede +1 ATQ e +1 VIDA a um aliado.",
        "secondaryValue": 1
      }
    ],
    "description": "Ao Entrar: Gera +1⚡ de Essência extra neste turno. Início do Turno: Concede +1 ATQ e +1 VIDA a um aliado.",
    "flavorText": "O motor que não conhece ferrugem nem cansaço.",
    "imagePath": "/assets/cards/neutral_144_nucleo_relojoeiro_aeternus.webp"
  },
  {
    "id": "neutral_145_oleo_afiacao_eterea",
    "name": "Óleo de Afiação Etérea",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Alquimia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 2,
        "secondaryValue": 2,
        "description": "Concede +2 ATQ e +2 VIDA a todos os aliados."
      }
    ],
    "description": "Concede +2 ATQ e +2 VIDA a todos os aliados.",
    "flavorText": "Três gotas no fio da espada e nenhuma couraça resiste.",
    "imagePath": "/assets/cards/neutral_145_oleo_afiacao_eterea.webp"
  },
  {
    "id": "neutral_146_bomba_tempo_relojoeira",
    "name": "Bomba do Tempo de Engrenagem",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano a todas as unidades na Vanguarda inimiga."
      }
    ],
    "description": "Causa 3 de dano a todas as unidades na Vanguarda inimiga.",
    "flavorText": "O tique-taque para; a linha de frente inimiga desaparece.",
    "imagePath": "/assets/cards/neutral_146_bomba_tempo_relojoeira.webp"
  },
  {
    "id": "neutral_147_esfera_tempo_estase",
    "name": "Esfera Temporal de Estase",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela (imobiliza por 1 turno) toda a Vanguarda inimiga."
      }
    ],
    "description": "Congela (imobiliza por 1 turno) toda a Vanguarda inimiga.",
    "flavorText": "Dentro do domo cinzento, um minuto dura uma eternidade.",
    "imagePath": "/assets/cards/neutral_147_esfera_tempo_estase.webp"
  },
  {
    "id": "neutral_148_destino_renovado_crono",
    "name": "Destino Renovado pelo Relógio",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Cronomancia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Restaura 3 de VIDA de todas as unidades aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Restaura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Restaura 3 de VIDA de todas as unidades aliadas. Restaura 3 de VIDA do seu Soberano.",
    "flavorText": "A ferida nunca existiu se o segundo em que foi aberta for apagado.",
    "imagePath": "/assets/cards/neutral_148_destino_renovado_crono.webp"
  },
  {
    "id": "neutral_149_contrato_companhia_dourada",
    "name": "Contrato de Sangue e Soldo",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Tático",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Gera +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Compra 2 cartas. Gera +1⚡ de Essência extra neste turno.",
    "flavorText": "Assine embaixo; os reforços já estão marchando no portão.",
    "imagePath": "/assets/cards/neutral_149_contrato_companhia_dourada.webp"
  },
  {
    "id": "neutral_150_fogo_alquimico_concentrado",
    "name": "Bombardeio de Fogo Alquímico",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Alquimia",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a uma unidade inimiga."
      }
    ],
    "description": "Causa 4 de dano a uma unidade inimiga.",
    "flavorText": "Não apaga com água, nem com reza.",
    "imagePath": "/assets/cards/neutral_150_fogo_alquimico_concentrado.webp"
  },
  {
    "id": "neutral_151_transmutar_rocha_lama",
    "name": "Colapso de Pedra Transmutada",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Transmutação",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano a todas as unidades na Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela (imobiliza por 1 turno) toda a Vanguarda inimiga."
      }
    ],
    "description": "Causa 2 de dano a todas as unidades na Vanguarda inimiga. Congela (imobiliza por 1 turno) toda a Vanguarda inimiga.",
    "flavorText": "Primeiro afundam até os joelhos; depois viram estátuas.",
    "imagePath": "/assets/cards/neutral_151_transmutar_rocha_lama.webp"
  },
  {
    "id": "neutral_152_portal_dimensional_cinza",
    "name": "Travessia pelo Portal Astral",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Planar",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 4,
        "description": "Invoca um Campeão/Guarda 4/4 na Vanguarda.",
        "secondaryValue": 4
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Invoca um Campeão/Guarda 4/4 na Vanguarda. Compra 1 carta.",
    "flavorText": "Quando os portões da cidadela estão longe, trazemos a cidadela até aqui.",
    "imagePath": "/assets/cards/neutral_152_portal_dimensional_cinza.webp"
  },
  {
    "id": "neutral_153_dissipar_magia_absoluta",
    "name": "Ruptura Arcana Universal",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Abjuração",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 3,
        "description": "Reduz em -3 o ATQ de toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Reduz em -3 o ATQ de toda a Vanguarda inimiga. Compra 1 carta.",
    "flavorText": "Cinco cores entram no prisma; apenas o silêncio cinzento sai.",
    "imagePath": "/assets/cards/neutral_153_dissipar_magia_absoluta.webp"
  },
  {
    "id": "neutral_154_elixir_pedra_ferro",
    "name": "Elixir de Pele de Adamantina",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Alquimia",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todas as unidades aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Concede +1 ATQ e +2 VIDA a todos os aliados."
      }
    ],
    "description": "Concede Escudo Divino, +1 ATQ e +2 VIDA a todas as unidades aliadas.",
    "flavorText": "Por três minutos, flechas ricocheteiam na pele nua.",
    "imagePath": "/assets/cards/neutral_154_elixir_pedra_ferro.webp"
  },
  {
    "id": "neutral_155_chamado_armas_fronteira",
    "name": "Mobilização da Torre dos Cinco Selos",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Comando",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 3,
        "description": "Invoca um Campeão/Guarda 3/3 na Vanguarda.",
        "secondaryValue": 3
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "description": "Concede +1 ATQ e +1 VIDA a todos os aliados.",
        "secondaryValue": 1
      }
    ],
    "description": "Invoca um Campeão/Guarda 3/3 na Vanguarda. Concede +1 ATQ e +1 VIDA a todos os aliados.",
    "flavorText": "Nenhum domínio reina sozinho enquanto a Torre estiver de pé.",
    "imagePath": "/assets/cards/neutral_155_chamado_armas_fronteira.webp"
  },
  {
    "id": "neutral_156_cataclismo_gravidade_reversa",
    "name": "Inversão Gravitacional Planar",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Transmutação",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_all_units",
        "value": 3,
        "description": "Causa 3 de dano a todas as unidades em campo."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Causa 3 de dano diretamente ao Soberano inimigo."
      }
    ],
    "description": "Causa 3 de dano a todas as unidades em campo. Causa 3 de dano diretamente ao Soberano inimigo.",
    "flavorText": "O céu torna-se um abismo; o chão, uma bigorna.",
    "imagePath": "/assets/cards/neutral_156_cataclismo_gravidade_reversa.webp"
  },
  {
    "id": "neutral_157_armadilha_esfera_rolante",
    "name": "Esfera Esmagadora do Corredor",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Causa 2 de dano a todas as unidades na Vanguarda inimiga."
      }
    ],
    "description": "Causa 2 de dano a todas as unidades na Vanguarda inimiga.",
    "flavorText": "Quando ouvir o estrondo da pedra, já não há para onde correr.",
    "imagePath": "/assets/cards/neutral_157_armadilha_esfera_rolante.webp"
  },
  {
    "id": "neutral_158_armadilha_dardos_envenenados",
    "name": "Saraivada de Agulhas Ocultas",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Causa 3 de dano a uma unidade inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 1,
        "description": "Reduz em -1 o ATQ de toda a Vanguarda inimiga."
      }
    ],
    "description": "Causa 3 de dano a uma unidade inimiga. Reduz em -1 o ATQ de toda a Vanguarda inimiga.",
    "flavorText": "Um clique sob a bota; trinta agulhas no peito.",
    "imagePath": "/assets/cards/neutral_158_armadilha_dardos_envenenados.webp"
  },
  {
    "id": "neutral_159_fosso_estacas_ferro",
    "name": "Alçapão do Fosso de Estacas",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Congela (imobiliza por 1 turno) 1 unidade inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano a uma unidade inimiga."
      }
    ],
    "description": "Congela (imobiliza por 1 turno) 1 unidade inimiga. Causa 2 de dano a uma unidade inimiga.",
    "flavorText": "A pressa do atacante é a melhor amiga do engenheiro.",
    "imagePath": "/assets/cards/neutral_159_fosso_estacas_ferro.webp"
  },
  {
    "id": "neutral_160_defesa_ativa_aparar",
    "name": "Riposta de Aço Temperado",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Marcial",
    "rarity": "uncommon",
    "cost": 1,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todas as unidades aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Causa 2 de dano a uma unidade inimiga."
      }
    ],
    "description": "Concede Escudo Divino a todas as unidades aliadas. Causa 2 de dano a uma unidade inimiga.",
    "flavorText": "A melhor defesa termina no pescoço do atacante.",
    "imagePath": "/assets/cards/neutral_160_defesa_ativa_aparar.webp"
  },
  {
    "id": "neutral_161_rede_ferro_gladiador",
    "name": "Rede de Chumbo e Farpas",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Captura",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela (imobiliza por 1 turno) toda a Vanguarda inimiga."
      }
    ],
    "description": "Congela (imobiliza por 1 turno) toda a Vanguarda inimiga.",
    "flavorText": "Quanto mais o gigante se debate, mais fundo os ganchos entram.",
    "imagePath": "/assets/cards/neutral_161_rede_ferro_gladiador.webp"
  },
  {
    "id": "neutral_162_bomba_fumaca_alquimica",
    "name": "Cortina de Fumaça de Mercúrio",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Evasão",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Devolve 1 unidade inimiga para a mão do oponente."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Compra 1 carta."
      }
    ],
    "description": "Devolve 1 unidade inimiga para a mão do oponente. Compra 1 carta.",
    "flavorText": "Quando a fumaça baixa, o alvo mudou de lugar.",
    "imagePath": "/assets/cards/neutral_162_bomba_fumaca_alquimica.webp"
  },
  {
    "id": "neutral_163_lamina_pendulo_masmorra",
    "name": "Pêndulo Ceifador doTeto",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Armadilha",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Causa 3 de dano a todas as unidades na Vanguarda inimiga."
      }
    ],
    "description": "Causa 3 de dano a todas as unidades na Vanguarda inimiga.",
    "flavorText": "O pêndulo marca o fim do turno para quem avançou demais.",
    "imagePath": "/assets/cards/neutral_163_lamina_pendulo_masmorra.webp"
  },
  {
    "id": "neutral_164_estatua_sopro_oleo",
    "name": "Cilada do Bastião de Ferro",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Estratagema",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Causa 4 de dano a uma unidade inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Restaura 2 de VIDA do seu Soberano."
      }
    ],
    "description": "Causa 4 de dano a uma unidade inimiga. Restaura 2 de VIDA do seu Soberano.",
    "flavorText": "Cada pilar do salão guarda uma surpresa mortal.",
    "imagePath": "/assets/cards/neutral_164_estatua_sopro_oleo.webp"
  },
  {
    "id": "neutral_165_quebra_feiticaria_runica",
    "name": "Selo de Anulação Instantânea",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Abjuração",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 3,
        "description": "Reduz em -3 o ATQ de toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Concede Escudo Divino a todas as unidades aliadas."
      }
    ],
    "description": "Reduz em -3 o ATQ de toda a Vanguarda inimiga. Concede Escudo Divino a todas as unidades aliadas.",
    "flavorText": "Sua fúria bate contra o selo e se transforma em nossa armadura.",
    "imagePath": "/assets/cards/neutral_165_quebra_feiticaria_runica.webp"
  },
  {
    "id": "neutral_166_protocolo_torre_axial",
    "name": "Decreto de Paz Armada da Torre",
    "domain": "neutral",
    "type": "reaction",
    "subtype": "Reação • Decreto",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Congela (imobiliza por 1 turno) toda a Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 2,
        "description": "Compra 2 cartas."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Restaura 3 de VIDA do seu Soberano."
      }
    ],
    "description": "Congela (imobiliza por 1 turno) toda a Vanguarda inimiga. Compra 2 cartas. Restaura 3 de VIDA do seu Soberano.",
    "flavorText": "Perante o Selo Axial, toda espada deve baixar ou quebrar.",
    "imagePath": "/assets/cards/neutral_166_protocolo_torre_axial.webp"
  },
  {
    "id": "neutral_167_arauto_prisma_matriz",
    "name": "Matriz do Prisma Primordial",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Avatar • Prisma",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 0,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao entrar, compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao entrar, concede +1 de Essência extra neste turno."
      }
    ],
    "description": "Voo, Guardião, Escudo Divino. Armadura 2. Ao entrar, compra 1 carta e concede +1⚡ de Essência extra neste turno.",
    "flavorText": "Antes de a luz escolher um juramento, todas as cores dormiam no mesmo coração de cristal.",
    "imagePath": "/assets/cards/neutral_167_arauto_prisma_matriz.webp"
  },
  {
    "id": "purple_167_arauto_prisma_abismo",
    "name": "Arauto do Eclipse Prismático",
    "domain": "purple",
    "type": "creature",
    "subtype": "Avatar • Prisma",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 1,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "debuff_enemy_vanguard_atk",
        "value": 2,
        "description": "Ao entrar, reduz em -2 o Ataque das criaturas inimigas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao entrar, refrata +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Voo, Dreno de Vida. Armadura 1. Ao entrar, reduz em -2 o Ataque inimigo e concede +1⚡ de Essência neste turno.",
    "flavorText": "Onde o Prisma dobrou para a sombra, nasceu a fome silenciosa entre as estrelas.",
    "imagePath": "/assets/cards/purple_167_arauto_prisma_abismo.webp"
  },
  {
    "id": "red_167_arauto_prisma_chama",
    "name": "Arauto da Supernova Prismática",
    "domain": "red",
    "type": "creature",
    "subtype": "Avatar • Prisma",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 1,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao entrar, causa 2 de dano a todas as criaturas na Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao entrar, refrata +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Voo, Ímpeto. Armadura 1. Ao entrar, causa 2 de dano à Vanguarda inimiga e concede +1⚡ de Essência neste turno.",
    "flavorText": "A faceta rubra do Prisma jamais ilumina sem incendiar o horizonte inteiro.",
    "imagePath": "/assets/cards/red_167_arauto_prisma_chama.webp"
  },
  {
    "id": "blue_167_arauto_prisma_gelo",
    "name": "Arauto do Zero Prismático",
    "domain": "blue",
    "type": "creature",
    "subtype": "Avatar • Prisma",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao entrar, congela todas as criaturas na Vanguarda inimiga por 1 rodada."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao entrar, refrata +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Voo, Alcance, Escudo Divino. Armadura 1. Ao entrar, congela a Vanguarda inimiga e concede +1⚡ de Essência neste turno.",
    "flavorText": "Na refração azul do Prisma, até o próprio instante congela em geometria perfeita.",
    "imagePath": "/assets/cards/blue_167_arauto_prisma_gelo.webp"
  },
  {
    "id": "green_167_arauto_prisma_selva",
    "name": "Arauto da Raiz Prismática",
    "domain": "green",
    "type": "creature",
    "subtype": "Avatar • Prisma",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 1,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "regeneration": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao entrar, concede +1/+2 de Ataque e Vida a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao entrar, refrata +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Atropelar, Fúria Crescente. Regeneração 2. Ao entrar, concede +1/+2 aos aliados e +1⚡ de Essência neste turno.",
    "flavorText": "Quando o raio esmeralda tocou o solo, a pedra brotou como floresta ancestral.",
    "imagePath": "/assets/cards/green_167_arauto_prisma_selva.webp"
  },
  {
    "id": "gold_167_arauto_prisma_sol",
    "name": "Arauto do Zênite Prismático",
    "domain": "gold",
    "type": "creature",
    "subtype": "Avatar • Prisma",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 1,
    "atk": 4,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao entrar, concede Escudo Divino a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao entrar, refrata +1⚡ de Essência extra neste turno."
      }
    ],
    "description": "Guardião, Voo, Escudo Divino. Armadura 2. Ao entrar, concede Escudo Divino aos aliados e +1⚡ de Essência neste turno.",
    "flavorText": "Do feixe dourado do Prisma ergueu-se a lei que nenhum abismo ousa profanar.",
    "imagePath": "/assets/cards/gold_167_arauto_prisma_sol.webp"
  },
  {
    "id": "neutral_168_tecelao_feixe_matriz",
    "name": "Tecelão do Feixe Primordial",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Entidade • Prisma",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 0,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Guardião",
      "Alcance",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao entrar, compra 1 carta."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao entrar, concede +1⚡ de Essência neste turno."
      }
    ],
    "description": "Guardião, Alcance, Escudo Divino. Armadura 1. Ao entrar, compra 1 carta e concede +1⚡ de Essência neste turno.",
    "flavorText": "Com um toque nos fios brancos do éter, ele decide qual cor despertará primeiro.",
    "imagePath": "/assets/cards/neutral_168_tecelao_feixe_matriz.webp"
  },
  {
    "id": "purple_168_tecelao_feixe_abismo",
    "name": "Tecelão do Feixe Umbral",
    "domain": "purple",
    "type": "creature",
    "subtype": "Entidade • Prisma",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Toque Letal"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao entrar, causa 2 de dano direto ao Soberano inimigo."
      },
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao entrar, restaura 2 de Vida do seu Soberano."
      }
    ],
    "description": "Ao entrar, causa 2 de dano direto ao Soberano inimigo e restaura 2 de Vida do seu Soberano.",
    "flavorText": "Ele dedilha a fenda violeta como quem arranca o último suspiro de um astro.",
    "imagePath": "/assets/cards/purple_168_tecelao_feixe_abismo.webp"
  },
  {
    "id": "red_168_tecelao_feixe_chama",
    "name": "Tecelão do Feixe Ígneo",
    "domain": "red",
    "type": "creature",
    "subtype": "Entidade • Prisma",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Pele Incandescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 3,
        "description": "Ao entrar, causa 3 de dano a 1 criatura inimiga à sua escolha."
      }
    ],
    "description": "Ao entrar, causa 3 de dano a 1 criatura inimiga à sua escolha.",
    "flavorText": "Basta curvar um único raio de brasa para transformar escudos em cinza.",
    "imagePath": "/assets/cards/red_168_tecelao_feixe_chama.webp"
  },
  {
    "id": "blue_168_tecelao_feixe_gelo",
    "name": "Tecelão do Feixe Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Entidade • Prisma",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao entrar, congela 1 criatura inimiga por 1 rodada."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 2,
        "description": "Ao entrar, feixe astral causa 2 de dano a 1 inimigo."
      }
    ],
    "description": "Alcance, Voo, Escudo Divino. Armadura 1. Ao entrar, causa 2 de dano e congela 1 criatura inimiga por 1 rodada.",
    "flavorText": "Onde seus dedos tocam a corrente estelar, o movimento cristaliza em silêncio.",
    "imagePath": "/assets/cards/blue_168_tecelao_feixe_gelo.webp"
  },
  {
    "id": "green_168_tecelao_feixe_selva",
    "name": "Tecelão do Feixe Silvestre",
    "domain": "green",
    "type": "creature",
    "subtype": "Entidade • Prisma",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 5,
    "regeneration": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_target_ally",
        "value": 2,
        "secondaryValue": 2,
        "description": "Ao entrar, concede +2/+2 de Ataque e Vida a 1 criatura aliada à sua escolha."
      }
    ],
    "description": "Ao entrar, concede +2/+2 de Ataque e Vida a 1 criatura aliada à sua escolha. No início do seu turno, regenera 1 de Vida.",
    "flavorText": "Ele desvia a seiva luminosa do mundo antigo direto para o coração da alcateia.",
    "imagePath": "/assets/cards/green_168_tecelao_feixe_selva.webp"
  },
  {
    "id": "gold_168_tecelao_feixe_sol",
    "name": "Tecelão do Feixe Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Entidade • Prisma",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_target_ally",
        "value": 3,
        "description": "Ao entrar, restaura 3 de Vida de 1 criatura aliada à sua escolha."
      }
    ],
    "description": "Ao entrar, restaura 3 de Vida de 1 criatura aliada à sua escolha.",
    "flavorText": "Mesmo envolto na noite eterna, suas mãos guiam a alvorada até os feridos.",
    "imagePath": "/assets/cards/gold_168_tecelao_feixe_sol.webp"
  },
  {
    "id": "neutral_169_pressagio_revoada_matriz",
    "name": "Presságio da Revoada Primordial",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Espectro • Revoada • Prisma",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda."
      }
    ],
    "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda.",
    "flavorText": "De seu manto desfazem-se asas de mercúrio que ocupam a linha de frente antes do primeiro golpe.",
    "imagePath": "/assets/cards/neutral_169_pressagio_revoada_matriz.webp"
  },
  {
    "id": "purple_169_pressagio_revoada_abismo",
    "name": "Presságio da Revoada Umbral",
    "domain": "purple",
    "type": "creature",
    "subtype": "Espectro • Revoada • Prisma",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "revive_from_crypt",
        "value": 5,
        "description": "Ao morrer, reanima da sua Cripta a criatura aliada mais forte de custo até 5."
      }
    ],
    "description": "Ao morrer, reanima da sua Cripta a criatura aliada mais forte de custo até 5.",
    "flavorText": "Cada corvo que se desprende de sua mortalha carrega de volta um nome arrancado da Cripta.",
    "imagePath": "/assets/cards/purple_169_pressagio_revoada_abismo.webp"
  },
  {
    "id": "red_169_pressagio_revoada_chama",
    "name": "Presságio da Revoada Cinzenta",
    "domain": "red",
    "type": "creature",
    "subtype": "Espectro • Revoada • Prisma",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 5,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Ímpeto"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao entrar, causa 1 de dano a todas as criaturas na Vanguarda inimiga."
      },
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao atacar, causa 2 de dano direto ao Soberano inimigo."
      }
    ],
    "description": "Ao entrar, causa 1 de dano a todas as criaturas na Vanguarda inimiga. Ao atacar, causa 2 de dano direto ao Soberano inimigo.",
    "flavorText": "Não são cinzas que sobem da fornalha, mas asas famintas por estandartes.",
    "imagePath": "/assets/cards/red_169_pressagio_revoada_chama.webp"
  },
  {
    "id": "blue_169_pressagio_revoada_gelo",
    "name": "Presságio da Revoada Glacial",
    "domain": "blue",
    "type": "creature",
    "subtype": "Espectro • Revoada • Prisma",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 3,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Voo",
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Ao entrar, devolve 1 criatura inimiga à sua escolha para a mão do oponente."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao entrar, compra 1 carta."
      }
    ],
    "description": "Ao entrar, devolve 1 criatura inimiga à sua escolha para a mão do oponente e compra 1 carta.",
    "flavorText": "O redemoinho de geada apaga os passos do invasor como tinta lavada pelo mar astral.",
    "imagePath": "/assets/cards/blue_169_pressagio_revoada_gelo.webp"
  },
  {
    "id": "green_169_pressagio_revoada_selva",
    "name": "Presságio da Revoada Espinhosa",
    "domain": "green",
    "type": "creature",
    "subtype": "Espectro • Revoada • Prisma",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "regeneration": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda."
      }
    ],
    "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda. No início do seu turno, regenera 1 de Vida.",
    "flavorText": "Dos cipós retorcidos erguem-se gaviões de esporos que defendem a mata viva.",
    "imagePath": "/assets/cards/green_169_pressagio_revoada_selva.webp"
  },
  {
    "id": "gold_169_pressagio_revoada_sol",
    "name": "Presságio da Revoada Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Espectro • Revoada • Prisma",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 2,
        "description": "Ao entrar, restaura 2 de Vida de todas as suas criaturas aliadas e do seu Soberano."
      }
    ],
    "description": "Ao entrar, restaura 2 de Vida de todas as suas criaturas aliadas e do seu Soberano.",
    "flavorText": "Quando o decreto dourado se desfaz em asas, toda ferida justa encontra alívio.",
    "imagePath": "/assets/cards/gold_169_pressagio_revoada_sol.webp"
  },
  {
    "id": "neutral_170_flagelo_cornudo_matriz",
    "name": "Flagelo Cornudo Primordial",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Bruto • Cornudo • Prisma",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [],
    "ascension": {
      "cost": 4,
      "newName": "Colosso Cornudo do Prisma",
      "newAtk": 5,
      "newArmor": 2,
      "newMaxHp": 6,
      "addedKeywords": [
        "Escudo Divino"
      ]
    },
    "description": "Ascensão 4: evolui para Colosso Cornudo do Prisma 5/6.",
    "flavorText": "Nem os grilhões da Primeira Era contiveram a força bruta adormecida no cristal.",
    "imagePath": "/assets/cards/neutral_170_flagelo_cornudo_matriz.webp"
  },
  {
    "id": "purple_170_flagelo_cornudo_abismo",
    "name": "Flagelo Cornudo do Abismo",
    "domain": "purple",
    "type": "creature",
    "subtype": "Bruto • Cornudo • Prisma",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Toque Letal",
      "Renascer"
    ],
    "effects": [
      {
        "trigger": "on_death",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao morrer, causa 2 de dano direto ao Soberano inimigo."
      }
    ],
    "description": "Ao morrer, causa 2 de dano direto ao Soberano inimigo.",
    "flavorText": "Suas correntes partidas ainda arrastam o eco faminto das masmorras do Vazio.",
    "imagePath": "/assets/cards/purple_170_flagelo_cornudo_abismo.webp"
  },
  {
    "id": "red_170_flagelo_cornudo_chama",
    "name": "Flagelo Cornudo da Fornalha",
    "domain": "red",
    "type": "creature",
    "subtype": "Bruto • Cornudo • Prisma",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": [
      "Ímpeto",
      "Atropelar"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 1,
        "description": "Ao atacar, causa 1 de dano direto ao Soberano inimigo."
      }
    ],
    "description": "Ao atacar, causa 1 de dano direto ao Soberano inimigo.",
    "flavorText": "Quando os cascos tocam a pedra, o ferro dos grilhões derrete antes da vontade dele.",
    "imagePath": "/assets/cards/red_170_flagelo_cornudo_chama.webp"
  },
  {
    "id": "blue_170_flagelo_cornudo_gelo",
    "name": "Flagelo Cornudo da Geada",
    "domain": "blue",
    "type": "creature",
    "subtype": "Bruto • Cornudo • Prisma",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao atacar, congela a criatura atacada por 1 rodada."
      }
    ],
    "description": "Ao atacar, congela a criatura atacada por 1 rodada.",
    "flavorText": "O inverno eterno forjou chifres de safira capazes de parar um aríete em pleno impacto.",
    "imagePath": "/assets/cards/blue_170_flagelo_cornudo_gelo.webp"
  },
  {
    "id": "green_170_flagelo_cornudo_selva",
    "name": "Flagelo Cornudo da Mata",
    "domain": "green",
    "type": "creature",
    "subtype": "Bruto • Cornudo • Prisma",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 5,
    "regeneration": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [],
    "description": "No início do seu turno, regenera 1 de Vida.",
    "flavorText": "Cada golpe contra seu couro de madeira-ferro desperta uma fúria mais antiga que os muros.",
    "imagePath": "/assets/cards/green_170_flagelo_cornudo_selva.webp"
  },
  {
    "id": "gold_170_flagelo_cornudo_sol",
    "name": "Flagelo Cornudo da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Bruto • Cornudo • Prisma",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 1,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": [
      "Guardião",
      "Escudo Divino"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao entrar, restaura 2 de Vida do seu Soberano."
      }
    ],
    "description": "Ao entrar, restaura 2 de Vida do seu Soberano.",
    "flavorText": "Redimido pelo juramento solar, transformou os próprios grilhões em baluarte dos justos.",
    "imagePath": "/assets/cards/gold_170_flagelo_cornudo_sol.webp"
  },
  {
    "id": "neutral_171_pactuario_elemental_matriz",
    "name": "Pactuário do Éter Primordial",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Mago • Pactuário • Elemental",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 0,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 3,
        "description": "Ao entrar, invoca 1 criatura aliada 2/3 na sua Vanguarda."
      },
      {
        "trigger": "spell_cast",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao lançar um feitiço, concede +1 de Essência extra neste turno."
      }
    ],
    "description": "Ao entrar, invoca 1 criatura aliada 2/3 na sua Vanguarda. Ao lançar um feitiço, concede +1 de Essência extra neste turno.",
    "flavorText": "O arcanista sussurra a fórmula; atrás dele, a montanha de mercúrio e cristal respira.",
    "imagePath": "/assets/cards/neutral_171_pactuario_elemental_matriz.webp"
  },
  {
    "id": "purple_171_pactuario_elemental_abismo",
    "name": "Pactuário do Espírito Umbral",
    "domain": "purple",
    "type": "creature",
    "subtype": "Mago • Pactuário • Elemental",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 3,
        "secondaryValue": 2,
        "description": "Ao entrar, invoca 1 criatura aliada 3/2 na sua Vanguarda."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_sovereign",
        "value": 2,
        "description": "Ao lançar um feitiço, causa 2 de dano direto ao Soberano inimigo."
      }
    ],
    "description": "Ao entrar, invoca 1 criatura aliada 3/2 na sua Vanguarda. Ao lançar um feitiço, causa 2 de dano direto ao Soberano inimigo.",
    "flavorText": "Ela cedeu a própria sombra ao Vazio, e a sombra cresceu dentes para guardá-la.",
    "imagePath": "/assets/cards/purple_171_pactuario_elemental_abismo.webp"
  },
  {
    "id": "red_171_pactuario_elemental_chama",
    "name": "Pactuário do Espírito Magmático",
    "domain": "red",
    "type": "creature",
    "subtype": "Mago • Pactuário • Elemental",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 3,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 3,
        "secondaryValue": 2,
        "description": "Ao entrar, invoca 1 criatura aliada 3/2 na sua Vanguarda."
      },
      {
        "trigger": "spell_cast",
        "type": "damage_enemy_row",
        "value": 1,
        "description": "Ao lançar um feitiço, causa 1 de dano a todas as criaturas na Vanguarda inimiga."
      }
    ],
    "description": "Ao entrar, invoca 1 criatura aliada 3/2 na sua Vanguarda. Ao lançar um feitiço, causa 1 de dano a todas as criaturas na Vanguarda inimiga.",
    "flavorText": "Cada sílaba piromântica desperta a fornalha viva que caminha às suas costas.",
    "imagePath": "/assets/cards/red_171_pactuario_elemental_chama.webp"
  },
  {
    "id": "blue_171_pactuario_elemental_gelo",
    "name": "Pactuário do Espírito Glacial",
    "domain": "blue",
    "type": "creature",
    "subtype": "Mago • Pactuário • Elemental",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 1,
    "atk": 4,
    "armor": 1,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance",
      "Guardião"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 3,
        "description": "Ao entrar, invoca 1 criatura aliada 2/3 na sua Vanguarda."
      },
      {
        "trigger": "spell_cast",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao lançar um feitiço, congela a criatura inimiga de maior Ataque por 1 rodada."
      }
    ],
    "description": "Alcance, Guardião. Armadura 1. Ao entrar, invoca 1 aliado 2/3 na Vanguarda. Ao lançar feitiço, congela a maior ameaça inimiga por 1 rodada.",
    "flavorText": "O inverno jurou obedecer à sua voz contanto que jamais lhe faltasse geada.",
    "imagePath": "/assets/cards/blue_171_pactuario_elemental_gelo.webp"
  },
  {
    "id": "green_171_pactuario_elemental_selva",
    "name": "Pactuário do Espírito Silvestre",
    "domain": "green",
    "type": "creature",
    "subtype": "Mago • Pactuário • Elemental",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 2,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 3,
        "secondaryValue": 3,
        "description": "Ao entrar, invoca 1 criatura aliada 3/3 na sua Vanguarda."
      },
      {
        "trigger": "spell_cast",
        "type": "buff_target_ally",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao lançar um feitiço, concede +1/+2 de Ataque e Vida à sua criatura aliada mais forte."
      }
    ],
    "description": "Ao entrar, invoca 1 criatura aliada 3/3 na sua Vanguarda. Ao lançar um feitiço, concede +1/+2 de Ataque e Vida à sua criatura aliada mais forte.",
    "flavorText": "Onde a xamã pisa em paz, toda a fúria da mata ancestral se curva como escudo.",
    "imagePath": "/assets/cards/green_171_pactuario_elemental_selva.webp"
  },
  {
    "id": "gold_171_pactuario_elemental_sol",
    "name": "Pactuário do Espírito Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Mago • Pactuário • Elemental",
    "rarity": "rare",
    "cost": 5,
    "affinityReq": 2,
    "atk": 2,
    "armor": 1,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": [
      "Alcance"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "secondaryValue": 3,
        "description": "Ao entrar, invoca 1 criatura aliada 2/3 na sua Vanguarda."
      },
      {
        "trigger": "spell_cast",
        "type": "shield_all_allies",
        "value": 1,
        "description": "Ao lançar um feitiço, concede Escudo Divino a um aliado."
      }
    ],
    "description": "Ao entrar, invoca 1 criatura aliada 2/3 na sua Vanguarda. Ao lançar um feitiço, concede Escudo Divino à sua criatura aliada mais forte.",
    "flavorText": "Nenhum golpe alcança o teurgo enquanto o guardião de bronze solar vigiar seu voto.",
    "imagePath": "/assets/cards/gold_171_pactuario_elemental_sol.webp"
  },
  {
    "id": "neutral_172_armada_draconica_matriz",
    "name": "Armada Dracônica do Prisma",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Dragão • Armada • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 0,
    "atk": 7,
    "armor": 2,
    "hp": 8,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Alcance",
      "Escudo Divino"
    ],
    "breathDamage": 2,
    "ascension": {
      "cost": 4,
      "newName": "Esquadra Suprema do Prisma",
      "newAtk": 9,
      "newArmor": 2,
      "newMaxHp": 10,
      "addedKeywords": [
        "Escudo Divino"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao entrar, causa 2 de dano a todas as criaturas na Vanguarda inimiga."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda."
      },
      {
        "trigger": "on_attack",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Ao atacar, concede +2 de Essência extra neste turno."
      }
    ],
    "description": "Voo, Atropelar, Alcance, Escudo Divino. Armadura 2. Ao entrar, causa 2 de dano à Vanguarda inimiga e invoca 2 aliados 2/2. Ao atacar, concede +2⚡ de Essência. Ascensão 4: Esquadra Suprema do Prisma 9/10.",
    "flavorText": "Quando o Prisma fende o firmamento, não desce um único soberano alado, mas toda a revoada primordial.",
    "imagePath": "/assets/cards/neutral_172_armada_draconica_matriz.webp"
  },
  {
    "id": "purple_172_armada_draconica_abismo",
    "name": "Legião Dracônica do Eclipse",
    "domain": "purple",
    "type": "creature",
    "subtype": "Dragão • Armada • Lendário",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 6,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Toque Letal",
      "Renascer"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda."
      },
      {
        "trigger": "on_attack",
        "type": "revive_from_crypt",
        "value": 1,
        "description": "Ao atacar, reanima da sua Cripta a criatura aliada mais forte."
      }
    ],
    "description": "Ao entrar, causa 2 de dano a todas as criaturas na Vanguarda inimiga e invoca 2 criaturas aliadas 2/2 na sua Vanguarda. Ao atacar, reanima da sua Cripta a criatura aliada mais forte.",
    "flavorText": "Suas asas apagam o sol; seu sopro drena os vivos para que os ossos da Cripta voltem a voar.",
    "imagePath": "/assets/cards/purple_172_armada_draconica_abismo.webp"
  },
  {
    "id": "red_172_armada_draconica_chama",
    "name": "Hoste Dracônica da Cratera",
    "domain": "red",
    "type": "creature",
    "subtype": "Dragão • Armada • Lendário",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 7,
    "armor": 0,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Ímpeto",
      "Pele Incandescente"
    ],
    "breathDamage": 3,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda."
      },
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao atacar, causa 3 de dano direto ao Soberano inimigo."
      }
    ],
    "description": "Ao entrar, causa 3 de dano a todas as criaturas na Vanguarda inimiga e invoca 2 criaturas aliadas 2/2 na sua Vanguarda. Ao atacar, causa 3 de dano direto ao Soberano inimigo.",
    "flavorText": "Não anunciam o ataque com trombetas: o céu simplesmente racha em lava e cem gargantas rugem.",
    "imagePath": "/assets/cards/red_172_armada_draconica_chama.webp"
  },
  {
    "id": "blue_172_armada_draconica_gelo",
    "name": "Esquadra Dracônica da Nevasca",
    "domain": "blue",
    "type": "creature",
    "subtype": "Dragão • Armada • Lendário",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 5,
    "armor": 1,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Alcance"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao entrar, congela todas as criaturas na Vanguarda inimiga por 1 rodada."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda."
      },
      {
        "trigger": "on_attack",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao atacar, compra 1 carta."
      }
    ],
    "description": "Ao entrar, causa 2 de dano a todas as criaturas na Vanguarda inimiga, as congela por 1 rodada e invoca 2 criaturas aliadas 2/2 na sua Vanguarda. Ao atacar, compra 1 carta.",
    "flavorText": "Antes que a primeira garra toque o solo, todo o exército adversário já virou estátua de geada.",
    "imagePath": "/assets/cards/blue_172_armada_draconica_gelo.webp"
  },
  {
    "id": "green_172_armada_draconica_selva",
    "name": "Enxame Dracônico Ancestral",
    "domain": "green",
    "type": "creature",
    "subtype": "Dragão • Armada • Lendário",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 8,
    "regeneration": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Fúria Crescente"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda."
      },
      {
        "trigger": "on_attack",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao atacar, concede +1/+2 de Ataque e Vida a todas as suas criaturas aliadas."
      }
    ],
    "description": "Ao entrar, causa 2 de dano a todas as criaturas na Vanguarda inimiga e invoca 2 criaturas aliadas 2/2 na sua Vanguarda. No início do seu turno, regenera 2 de Vida. Ao atacar, concede +1/+2 de Ataque e Vida a todas as suas criaturas aliadas.",
    "flavorText": "A copa inteira da selva ergueu voo, faminta e indomável como no primeiro dia do mundo.",
    "imagePath": "/assets/cards/green_172_armada_draconica_selva.webp"
  },
  {
    "id": "gold_172_armada_draconica_sol",
    "name": "Armada Dracônica do Zênite",
    "domain": "gold",
    "type": "creature",
    "subtype": "Dragão • Armada • Lendário",
    "rarity": "legendary",
    "cost": 8,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": [
      "Voo",
      "Atropelar",
      "Escudo Divino",
      "Guardião"
    ],
    "breathDamage": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 criaturas aliadas 2/2 na sua Vanguarda."
      },
      {
        "trigger": "on_attack",
        "type": "shield_all_allies",
        "value": 2,
        "description": "Ao atacar, concede Escudo Divino a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_attack",
        "type": "heal_sovereign",
        "value": 3,
        "description": "Ao atacar, restaura 3 de Vida do seu Soberano."
      }
    ],
    "description": "Ao entrar, causa 2 de dano a todas as criaturas na Vanguarda inimiga e invoca 2 criaturas aliadas 2/2 na sua Vanguarda. Ao atacar, concede Escudo Divino a todas as suas criaturas aliadas e restaura 3 de Vida do seu Soberano.",
    "flavorText": "Descem em cunha dourada desde o zênite, julgando tiranos sob um firmamento de escudos solares.",
    "imagePath": "/assets/cards/gold_172_armada_draconica_sol.webp"
  },
  {
    "id": "neutral_173_general_roda_matriz",
    "name": "Vaelkor, General da Roda Prismática",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Arconte • General • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 0,
    "atk": 5,
    "armor": 2,
    "hp": 7,
    "regeneration": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino",
      "Guardião",
      "Fúria Crescente"
    ],
    "ascension": {
      "cost": 4,
      "newName": "Vaelkor, Roda da Perfeição",
      "newAtk": 8,
      "newArmor": 3,
      "newMaxHp": 10,
      "addedKeywords": [
        "Voo",
        "Atropelar"
      ]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "break_domain_expansion",
        "value": 1,
        "description": "Ao entrar, quebra Expansões de Domínio inimigas."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 2,
        "description": "Ao entrar, concede Escudo Divino a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 2,
        "description": "Ao entrar, concede +2 de Essência extra neste turno."
      }
    ],
    "description": "Ao entrar, quebra Expansões de Domínio inimigas, concede Escudo Divino a todas as suas criaturas aliadas e +2 de Essência extra neste turno. No início do seu turno, regenera 1 de Vida. Ascensão 4: evolui para Vaelkor, Roda da Perfeição 8/10.",
    "flavorText": "Quando o oitavo prisma gira às suas costas, nenhuma cúpula soberana resiste à lei nua do éter.",
    "imagePath": "/assets/cards/neutral_173_general_roda_matriz.webp"
  },
  {
    "id": "purple_173_general_roda_abismo",
    "name": "Nyxaroth, General da Roda Fúnebre",
    "domain": "purple",
    "type": "creature",
    "subtype": "Arconte • General • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "regeneration": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino",
      "Toque Letal",
      "Renascer",
      "Dreno de Vida"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "break_domain_expansion",
        "value": 1,
        "description": "Ao entrar, quebra Expansões de Domínio inimigas."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 2,
        "description": "Ao entrar, concede Escudo Divino a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_attack",
        "type": "destroy_enemy",
        "value": 1,
        "description": "Ao atacar, destrói a criatura inimiga mais forte, ignorando Escudo Divino e Armadura."
      }
    ],
    "description": "Ao entrar, quebra Expansões de Domínio inimigas e concede Escudo Divino a todas as suas criaturas aliadas. No início do seu turno, regenera 1 de Vida. Ao atacar, destrói a criatura inimiga mais forte, ignorando Escudo Divino e Armadura.",
    "flavorText": "Cada crânio aceso em sua roda guarda a sentença de um santuário que julgou ser eterno.",
    "imagePath": "/assets/cards/purple_173_general_roda_abismo.webp"
  },
  {
    "id": "red_173_general_roda_chama",
    "name": "Pyrrakon, General da Roda Vulcânica",
    "domain": "red",
    "type": "creature",
    "subtype": "Arconte • General • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 1,
    "hp": 6,
    "regeneration": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino",
      "Ímpeto",
      "Atropelar",
      "Pele Incandescente",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "break_domain_expansion",
        "value": 1,
        "description": "Ao entrar, quebra Expansões de Domínio inimigas."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 2,
        "description": "Ao entrar, concede Escudo Divino a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_attack",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao atacar, causa 2 de dano a todas as criaturas na Vanguarda inimiga."
      }
    ],
    "description": "Ao entrar, quebra Expansões de Domínio inimigas e concede Escudo Divino a todas as suas criaturas aliadas. No início do seu turno, regenera 1 de Vida. Ao atacar, causa 2 de dano a todas as criaturas na Vanguarda inimiga.",
    "flavorText": "Os oito cadinhos de sua roda fervem com o fogo que derrete tronos, muralhas e domínios inteiros.",
    "imagePath": "/assets/cards/red_173_general_roda_chama.webp"
  },
  {
    "id": "blue_173_general_roda_gelo",
    "name": "Cryonax, General da Roda Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Arconte • General • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 4,
    "armor": 2,
    "hp": 7,
    "regeneration": 1,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino",
      "Guardião",
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "break_domain_expansion",
        "value": 1,
        "description": "Ao entrar, quebra Expansões de Domínio inimigas."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 2,
        "description": "Ao entrar, concede Escudo Divino a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao entrar, congela todas as criaturas na Vanguarda inimiga por 1 rodada."
      },
      {
        "trigger": "on_attack",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao atacar, compra 1 carta."
      }
    ],
    "description": "Ao entrar, quebra Expansões de Domínio inimigas, concede Escudo Divino a todas as suas criaturas aliadas e congela todas as criaturas na Vanguarda inimiga por 1 rodada. No início do seu turno, regenera 1 de Vida. Ao atacar, compra 1 carta.",
    "flavorText": "Um único estalo de seu astrolábio glacial decifra o feitiço rival e estilhaça sua barreira como vidro.",
    "imagePath": "/assets/cards/blue_173_general_roda_gelo.webp"
  },
  {
    "id": "green_173_general_roda_selva",
    "name": "Sylvarok, General da Roda Primeva",
    "domain": "green",
    "type": "creature",
    "subtype": "Arconte • General • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 5,
    "armor": 1,
    "hp": 8,
    "regeneration": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino",
      "Atropelar",
      "Fúria Crescente"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "break_domain_expansion",
        "value": 1,
        "description": "Ao entrar, quebra Expansões de Domínio inimigas."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 2,
        "description": "Ao entrar, concede Escudo Divino a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 2,
        "description": "Ao entrar, concede +1/+2 de Ataque e Vida a todas as suas criaturas aliadas."
      }
    ],
    "description": "Ao entrar, quebra Expansões de Domínio inimigas e concede +1/+2 de Ataque e Vida e Escudo Divino a todas as suas criaturas aliadas. No início do seu turno, regenera 2 de Vida.",
    "flavorText": "Suas raízes arrombam qualquer santuário artificial; a selva primeira desconhece fronteiras impostas.",
    "imagePath": "/assets/cards/green_173_general_roda_selva.webp"
  },
  {
    "id": "gold_173_general_roda_sol",
    "name": "Heliokar, General da Roda Celeste",
    "domain": "gold",
    "type": "creature",
    "subtype": "Arconte • General • Lendário",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 5,
    "armor": 2,
    "hp": 7,
    "regeneration": 2,
    "preferredRow": "vanguard",
    "keywords": [
      "Escudo Divino",
      "Guardião",
      "Voo"
    ],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "break_domain_expansion",
        "value": 1,
        "description": "Ao entrar, quebra Expansões de Domínio inimigas."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao entrar, concede Escudo Divino e +1 de Armadura a todas as suas criaturas aliadas."
      },
      {
        "trigger": "on_enter",
        "type": "heal_all_allies",
        "value": 3,
        "description": "Ao entrar, restaura 3 de Vida de todas as suas criaturas aliadas e do seu Soberano."
      }
    ],
    "description": "Ao entrar, quebra Expansões de Domínio inimigas, concede Escudo Divino e +1 de Armadura a todas as suas criaturas aliadas e restaura 3 de Vida delas e do seu Soberano. No início do seu turno, regenera 2 de Vida.",
    "flavorText": "Sob o giro dos oito sóis de bronze, todo falso firmamento se desfaz em poeira luminosa.",
    "imagePath": "/assets/cards/gold_173_general_roda_sol.webp"
  },
  {
    "id": "red_174_subduccao_magmatica",
    "name": "Subducção Magmática",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Tectônico",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "magmatic_subduction",
        "value": 3,
        "secondaryValue": 2,
        "description": "Zera a Armadura na coluna alvo, causa 3 de dano à Vanguarda e a empurra para a Retaguarda (+2 de dano se já ocupada)."
      }
    ],
    "description": "Zera a Armadura inimiga na coluna alvo, causa 3 de dano à Vanguarda e empurra os sobreviventes para a Retaguarda. Se a Retaguarda já estava ocupada, toda a coluna sofre +2 de dano.",
    "flavorText": "Quando as placas de Pyros cedem, nem o aço temperado nem a segunda linha escapam da fornalha.",
    "imagePath": "/assets/cards/red_174_subduccao_magmatica.webp"
  },
  {
    "id": "red_175_marcha_bigorna_rubra",
    "name": "Marcha da Bigorna Rubra",
    "domain": "red",
    "type": "spell",
    "subtype": "Feitiço • Comando Lendário",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "crimson_anvil_march",
        "value": 2,
        "secondaryValue": 2,
        "description": "Seus aliados ganham +2 de Ataque neste turno e golpeiam sua coluna imediatamente, ou causam 2 de dano ao Soberano rival."
      }
    ],
    "description": "Coloca seus aliados em Ataque com +2 de Ataque neste turno. Cada um golpeia o inimigo à frente sem gastar o ataque do turno, ou causa 2 de dano ao Soberano rival se a coluna estiver livre.",
    "flavorText": "Ao soar do malho celeste, cada guerreiro golpeia duas vezes antes que a cinza toque o chão.",
    "imagePath": "/assets/cards/red_175_marcha_bigorna_rubra.webp"
  },
  {
    "id": "blue_174_inversao_coordenadas",
    "name": "Inversão de Coordenadas",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Geometria Astral",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "coordinate_inversion",
        "value": 1,
        "description": "Troca Vanguarda e Retaguarda na coluna inimiga alvo, congela quem recuar e compra 1 carta."
      }
    ],
    "description": "Troca Vanguarda e Retaguarda na coluna inimiga escolhida, congela por 1 rodada quem foi para a Retaguarda e compra 1 carta.",
    "flavorText": "No Vórtex, 'frente' e 'retaguarda' são apenas convenções à espera de uma equação superior.",
    "imagePath": "/assets/cards/blue_174_inversao_coordenadas.webp"
  },
  {
    "id": "blue_175_singularidade_horizonte",
    "name": "Singularidade do Horizonte",
    "domain": "blue",
    "type": "spell",
    "subtype": "Feitiço • Gravidade Lendária",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "horizon_singularity",
        "value": 3,
        "secondaryValue": 1,
        "description": "Puxa a Vanguarda inimiga ao centro, causa 3 de dano e a congela; excedentes voltam à mão custando +1."
      }
    ],
    "description": "Puxa toda a Vanguarda inimiga para a coluna central, causando 3 de dano e congelando a pilha por 1 rodada. Excedentes voltam à mão do oponente custando +1 de Essência.",
    "flavorText": "Toda linha de batalha converge para um único ponto quando o próprio espaço se curva.",
    "imagePath": "/assets/cards/blue_175_singularidade_horizonte.webp"
  },
  {
    "id": "purple_174_elo_sombra_partilhada",
    "name": "Elo da Sombra Partilhada",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Vínculo Umbral",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "shared_shadow_link",
        "value": 1,
        "description": "Vincula 1 inimigo ao seu aliado de maior Vida neste turno: o dano sofrido pelo aliado também atinge o alvo."
      }
    ],
    "description": "Vincula o inimigo alvo ao seu aliado de maior Vida até o fim do turno: todo dano ou Sacrifício Vital sofrido por esse aliado também atinge o alvo, até a Vida máxima do aliado.",
    "flavorText": "Duas sombras costuradas pelo crepúsculo partilham o mesmo fôlego e a mesma ruína.",
    "imagePath": "/assets/cards/purple_174_elo_sombra_partilhada.webp"
  },
  {
    "id": "purple_175_procissao_crepusculo",
    "name": "Procissão do Crepúsculo",
    "domain": "purple",
    "type": "spell",
    "subtype": "Feitiço • Memória Lendária",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "corruptionCost": 2,
    "effects": [
      {
        "trigger": "on_enter",
        "type": "twilight_procession",
        "value": 3,
        "secondaryValue": 1,
        "description": "Sobrecarga +2. Invoca até 3 criaturas da Cripta com Ímpeto e Dreno de Vida neste turno; cada ataque dá +1/+1 aos aliados."
      }
    ],
    "description": "Sobrecarga +2. Invoca até 3 criaturas distintas da Cripta com Ímpeto e Dreno de Vida até o fim do turno. Ao voltarem à Cripta, concedem +1/+1 permanente aos demais aliados por cada uma que atacou.",
    "flavorText": "Os heróis adormecidos atendem a um último chamado antes que a estrela vespertina se apague.",
    "imagePath": "/assets/cards/purple_175_procissao_crepusculo.webp"
  },
  {
    "id": "green_174_lei_cadeia_alimentar",
    "name": "Lei da Cadeia Alimentar",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Predação",
    "rarity": "rare",
    "cost": 3,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "food_chain_law",
        "value": 3,
        "description": "Seu aliado de maior Ataque golpeia 1 inimigo; se o abater, herda suas palavras-chave e cura 3 de Vida."
      }
    ],
    "description": "Seu aliado de maior Ataque golpeia o inimigo escolhido (sem contra-ataque se tiver maior Vida máxima). Se o abater, herda suas palavras-chave e cura 3 de Vida.",
    "flavorText": "Na mata primordial de Verídia, o topo do dossel pertence a quem devora o predador anterior.",
    "imagePath": "/assets/cards/green_174_lei_cadeia_alimentar.webp"
  },
  {
    "id": "green_175_apice_evolucao_primordial",
    "name": "Ápice da Evolução Primordial",
    "domain": "green",
    "type": "spell",
    "subtype": "Feitiço • Metamorfose Lendária",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "primordial_evolution_apex",
        "value": 3,
        "secondaryValue": 2,
        "description": "Evolui de graça seus aliados com Ascensão; os demais ganham +3/+3, Atropelar e +2 de Regeneração."
      }
    ],
    "description": "Ativa sem custo a Ascensão de todos os seus aliados elegíveis, curando toda a sua Vida. Seus demais aliados ganham permanentemente +3/+3, Atropelar e +2 de Regeneração.",
    "flavorText": "Milênios de seleção selvagem condensados num único pulsar da Árvore-Mundo.",
    "imagePath": "/assets/cards/green_175_apice_evolucao_primordial.webp"
  },
  {
    "id": "gold_174_falange_lancas_solares",
    "name": "Falange de Lanças Solares",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Tática Imperial",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "solar_spear_phalanx",
        "value": 2,
        "description": "Iguala a Armadura da Vanguarda à maior Armadura aliada (mínimo 2); colunas vizinhas retaliam em 2 de dano até o próximo turno."
      }
    ],
    "description": "Eleva a Armadura da sua Vanguarda até a maior Armadura aliada (mínimo 2). Até o seu próximo turno, quando sua Vanguarda for atacada, aliados nas colunas vizinhas causam 2 de dano ao atacante.",
    "flavorText": "Nenhum escudo de Solária luta sozinho; golpear um é despertar duas lanças de luz.",
    "imagePath": "/assets/cards/gold_174_falange_lancas_solares.webp"
  },
  {
    "id": "gold_175_juramento_campeao_invicto",
    "name": "Juramento do Campeão Invicto",
    "domain": "gold",
    "type": "spell",
    "subtype": "Feitiço • Investidura Lendária",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "unconquered_champion_oath",
        "value": 2,
        "secondaryValue": 4,
        "description": "Dá a 1 aliado +2/+4, +3 de Armadura, Guardião e Escudo Divino; enquanto viver, ele absorve o dano ao seu Soberano."
      }
    ],
    "description": "Concede a 1 aliado +2/+4, +3 de Armadura, Guardião e Escudo Divino. Enquanto permanecer vivo, ele recebe em seu lugar todo dano inimigo que atingiria o seu Soberano.",
    "flavorText": "Enquanto minha égide respirar, nenhuma flecha ou chama alcançará os degraus do trono.",
    "imagePath": "/assets/cards/gold_175_juramento_campeao_invicto.webp"
  },
  {
    "id": "neutral_174_convergencia_prisma_real",
    "name": "Convergência do Prisma Real",
    "domain": "neutral",
    "type": "spell",
    "subtype": "Feitiço • Harmonia Pentacromática",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 0,
    "atk": 0,
    "armor": 0,
    "hp": 0,
    "preferredRow": "rearguard",
    "keywords": [],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "royal_prism_convergence",
        "value": 3,
        "description": "Ativa 1 efeito por cor distinta nos seus Terrenos: 3 dano, Congelar+Compra, Drenar 3, +2/+2 ou Escudo Divino."
      }
    ],
    "description": "Ativa o efeito de cada cor nos seus Terrenos canalizados: Vermelho causa 3 de dano à Vanguarda inimiga; Azul congela 2 inimigos e compra 1 carta; Roxo drena 3 de Vida do Soberano rival; Verde dá +2/+2 e Regeneração 1 aos aliados; Dourado dá Escudo Divino à Vanguarda.",
    "flavorText": "Separadas, as cinco coroas guerreiam; reunidas no Prisma, o próprio mundo se ajoelha.",
    "imagePath": "/assets/cards/neutral_174_convergencia_prisma_real.webp"
  },
  {
    "id": "gold_176_arauto_louros_alvorada",
    "name": "Arauto de Louros da Alvorada",
    "domain": "gold",
    "type": "creature",
    "subtype": "Elfo • Arqueiro Solar",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 2,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": ["Alcance", "Escudo Divino"],
    "ascension": {
      "cost": 4,
      "newName": "Guardião de Louros Solares",
      "newAtk": 4,
      "newArmor": 2,
      "newMaxHp": 5,
      "addedKeywords": ["Guardião"]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "heal_sovereign",
        "value": 2,
        "description": "Ao entrar, cura 2 de Vida do seu Soberano."
      }
    ],
    "description": "Alcance, Escudo Divino, Armadura 1. Ao entrar, cura 2 de Vida do seu Soberano. Ascensão 4: torna-se 4/5 com 2 de Armadura e Guardião.",
    "flavorText": "Cada folha de ouro em sua fronte foi forjada no primeiro raio de Aethelgard.",
    "imagePath": "/assets/cards/gold_176_arauto_louros_alvorada.webp"
  },
  {
    "id": "gold_177_lanca_cantora_coro_solar",
    "name": "Lança-Cantora do Coro Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Elfo • Cantora de Égide",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": ["Alcance", "Escudo Divino"],
    "effects": [
      {
        "trigger": "turn_start",
        "type": "lanca_cantora_ward",
        "value": 1,
        "description": "No início do seu turno, dá +1 de Armadura e cura 1 de Vida do aliado mais ferido na Vanguarda."
      }
    ],
    "description": "Alcance, Escudo Divino. No início do seu turno, concede +1 de Armadura e restaura 1 de Vida ao aliado mais ferido na Vanguarda.",
    "flavorText": "Seu hino endurece o aço dos escudos antes mesmo que a primeira seta toque o chão.",
    "imagePath": "/assets/cards/gold_177_lanca_cantora_coro_solar.webp"
  },
  {
    "id": "gold_178_aelion_hierofante_coroa_aurea",
    "name": "Aelion, Hierofante da Coroa Áurea",
    "domain": "gold",
    "type": "creature",
    "subtype": "Elfo • Hierofante Solar",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 4,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": ["Alcance", "Escudo Divino"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "aelion_solar_edict",
        "value": 2,
        "description": "Ao entrar ou lançar feitiço, dá Escudo Divino a 1 aliado sem escudo. Aliados com Escudo Divino têm +2 de Ataque."
      },
      {
        "trigger": "spell_cast",
        "type": "aelion_solar_edict",
        "value": 2,
        "description": "Ao lançar feitiço, dá Escudo Divino a 1 aliado sem escudo."
      }
    ],
    "description": "Alcance, Escudo Divino, Armadura 1. Ao entrar ou lançar feitiço, concede Escudo Divino a 1 aliado sem escudo. Seus aliados com Escudo Divino têm +2 de Ataque.",
    "flavorText": "Onde repousa sua bênção dourada, nenhuma lâmina profana encontra carne.",
    "imagePath": "/assets/cards/gold_178_aelion_hierofante_coroa_aurea.webp"
  },
  {
    "id": "purple_176_tecela_lagrimas_negras",
    "name": "Tecelã de Lágrimas Negras",
    "domain": "purple",
    "type": "creature",
    "subtype": "Elfo • Tecelã Astral",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "corruptionCost": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "rearguard",
    "keywords": ["Alcance", "Dreno de Vida"],
    "effects": [
      {
        "trigger": "on_death",
        "type": "drain_enemy_sovereign",
        "value": 2,
        "description": "Ao morrer, drena 2 de Vida do Soberano rival para o seu Soberano."
      }
    ],
    "description": "Alcance, Dreno de Vida, Sobrecarga +1. Ao morrer, drena 2 de Vida do Soberano rival para o seu Soberano.",
    "flavorText": "Fios de obsidiana estelar costuram o destino dos reis que ousam encará-la.",
    "imagePath": "/assets/cards/purple_176_tecela_lagrimas_negras.webp"
  },
  {
    "id": "purple_177_inquisidor_obsidiana_astral",
    "name": "Inquisidor de Obsidiana Astral",
    "domain": "purple",
    "type": "creature",
    "subtype": "Elfo • Inquisidor do Eclipse",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "corruptionCost": 2,
    "atk": 4,
    "armor": 0,
    "hp": 4,
    "preferredRow": "vanguard",
    "keywords": ["Alcance", "Toque Letal", "Renascer"],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "astral_obsidian_strike",
        "value": 2,
        "description": "Ao atacar com 5+ de Sobrecarga, causa 2 de dano ao alvo antes do combate."
      }
    ],
    "description": "Alcance, Toque Letal, Renascer, Sobrecarga +2. Ao atacar com 5+ de Sobrecarga, causa 2 de dano direto ao alvo antes do combate.",
    "flavorText": "Forjado sob o eclipse negro, seu arco dispara estilhaços de estrelas mortas.",
    "imagePath": "/assets/cards/purple_177_inquisidor_obsidiana_astral.webp"
  },
  {
    "id": "purple_178_vaelen_oraculo_choro_dourado",
    "name": "Vaelen, Oráculo do Choro Dourado",
    "domain": "purple",
    "type": "creature",
    "subtype": "Elfo • Oráculo do Abismo",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "corruptionCost": 2,
    "atk": 4,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": ["Alcance", "Dreno de Vida"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "vaelen_astral_stigma",
        "value": 2,
        "secondaryValue": 4,
        "description": "Dá -2 de Ataque a 1 inimigo; abatê-lo reanima da Cripta 1 aliado de custo até 4 com 1 de Vida. Sobrecarga ou Sacrifício Vital causa 2 de dano ao rival."
      }
    ],
    "description": "Alcance, Dreno de Vida, Sobrecarga +2. Ao entrar, dá -2 de Ataque a 1 inimigo; quando ele morrer, reanima da Cripta 1 criatura de custo até 4 com 1 de Vida. Ganhar Sobrecarga ou usar Sacrifício Vital causa 2 de dano ao Soberano rival.",
    "flavorText": "Chora ouro líquido pelos impérios que ainda não sabem que já caíram.",
    "imagePath": "/assets/cards/purple_178_vaelen_oraculo_choro_dourado.webp"
  },
  {
    "id": "blue_176_sentinela_capuz_estelar",
    "name": "Sentinela do Capuz Estelar",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elfo • Vigia Astral",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 2,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": ["Alcance"],
    "ascension": {
      "cost": 4,
      "newName": "Vigia do Prisma Boreal",
      "newAtk": 4,
      "newArmor": 0,
      "newMaxHp": 6,
      "addedKeywords": ["Alcance"]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao entrar, congela 1 inimigo por 1 rodada."
      }
    ],
    "description": "Alcance. Ao entrar, congela 1 inimigo por 1 rodada. Ascensão 4: torna-se 4/6 e compra 1 carta ao atacar alvos congelados.",
    "flavorText": "Sob seu capuz bordado de constelações, o próprio vento esquece como soprar.",
    "imagePath": "/assets/cards/blue_176_sentinela_capuz_estelar.webp"
  },
  {
    "id": "blue_177_cronomante_terceiro_prisma",
    "name": "Cronomante do Terceiro Prisma",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elfo • Cronomante",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 3,
    "armor": 0,
    "hp": 5,
    "preferredRow": "rearguard",
    "keywords": ["Alcance"],
    "effects": [
      {
        "trigger": "spell_cast",
        "type": "chrono_prism_volley",
        "value": 2,
        "secondaryValue": 4,
        "description": "1x por turno, ao lançar feitiço, causa 2 de dano a 1 inimigo, ou 4 de dano e compra 1 carta se congelado."
      }
    ],
    "description": "Alcance. 1x por turno, ao lançar feitiço, causa 2 de dano a 1 inimigo — ou 4 de dano e compra 1 carta se o alvo estiver congelado.",
    "flavorText": "Três segundos bastam para que o gelo eterno devore um exército inteiro.",
    "imagePath": "/assets/cards/blue_177_cronomante_terceiro_prisma.webp"
  },
  {
    "id": "blue_178_lyriel_vidente_zero_astral",
    "name": "Lyriel, Vidente do Zero Astral",
    "domain": "blue",
    "type": "creature",
    "subtype": "Elfo • Vidente Boreal",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 4,
    "armor": 0,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": ["Alcance", "Voo"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "lyriel_astral_zero",
        "value": 2,
        "description": "Congela até 2 inimigos e puxa o mais fraco da Retaguarda à Vanguarda. Inimigos congelados perdem Guardião e sofrem +2 de dano seu."
      }
    ],
    "description": "Alcance, Voo. Ao entrar, congela até 2 inimigos e puxa o de menor Ataque da Retaguarda para a Vanguarda. Inimigos congelados perdem Guardião e sofrem +2 de dano das suas cartas.",
    "flavorText": "No instante zero entre duas estrelas, todo escudo é vidro prestes a estilhaçar.",
    "imagePath": "/assets/cards/blue_178_lyriel_vidente_zero_astral.webp"
  },
  {
    "id": "green_176_sussurrador_seiva_lunar",
    "name": "Sussurrador da Seiva Lunar",
    "domain": "green",
    "type": "creature",
    "subtype": "Elfo • Druida Lunar",
    "rarity": "uncommon",
    "cost": 2,
    "affinityReq": 1,
    "atk": 1,
    "armor": 0,
    "hp": 4,
    "regeneration": 2,
    "preferredRow": "rearguard",
    "keywords": ["Alcance"],
    "ascension": {
      "cost": 4,
      "newName": "Arauto do Dossel Lunar",
      "newAtk": 3,
      "newArmor": 0,
      "newMaxHp": 6,
      "addedKeywords": ["Alcance"]
    },
    "effects": [
      {
        "trigger": "on_enter",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "Ao entrar, ganha +1 de Essência neste turno."
      }
    ],
    "description": "Alcance, Regeneração 2. Ao entrar, ganha +1 de Essência neste turno. Ascensão 4: torna-se 3/6 e dá +1/+1 aos outros Elfos e aliados Verdes.",
    "flavorText": "As raízes antigas respondem ao luar antes mesmo de ouvirem a voz dos druidas.",
    "imagePath": "/assets/cards/green_176_sussurrador_seiva_lunar.webp"
  },
  {
    "id": "green_177_cacador_galhada_esmeralda",
    "name": "Caçador de Galhada Esmeralda",
    "domain": "green",
    "type": "creature",
    "subtype": "Elfo • Patrulheiro do Dossel",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 5,
    "regeneration": 2,
    "preferredRow": "vanguard",
    "keywords": ["Alcance", "Ímpeto", "Atropelar"],
    "effects": [
      {
        "trigger": "on_attack",
        "type": "emerald_antler_hunt",
        "value": 1,
        "secondaryValue": 3,
        "description": "Ao atacar, ganha +1/+1 para cada outro Elfo ou aliado com Regeneração em campo, até +3/+3."
      }
    ],
    "description": "Alcance, Ímpeto, Atropelar, Regeneração 2. Ao atacar, ganha +1/+1 permanente para cada outro Elfo ou aliado com Regeneração em campo, até +3/+3.",
    "flavorText": "Nenhum invasor escapa quando toda a floresta respira no ritmo da sua corda.",
    "imagePath": "/assets/cards/green_177_cacador_galhada_esmeralda.webp"
  },
  {
    "id": "green_178_sylvaris_arquidruida_plenilunio",
    "name": "Sylvaris, Arquidruida do Plenilúnio",
    "domain": "green",
    "type": "creature",
    "subtype": "Elfo • Arquidruida Lunar",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 5,
    "armor": 0,
    "hp": 7,
    "regeneration": 3,
    "preferredRow": "rearguard",
    "keywords": ["Alcance"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "sylvaris_fullmoon_bloom",
        "value": 2,
        "description": "Dá +2/+2 e +2 de Regeneração à Vanguarda e ascende de graça 1 aliado elegível."
      },
      {
        "trigger": "turn_start",
        "type": "grant_bonus_essence",
        "value": 1,
        "description": "No início do seu turno, gera +1 de Essência extra."
      }
    ],
    "description": "Alcance, Regeneração 3. Ao entrar, dá +2/+2 e +2 de Regeneração à Vanguarda e ascende de graça 1 aliado elegível. No início do turno, gera +1 de Essência.",
    "flavorText": "Quando a lua cheia coroa Verídia, brotos tornam-se titãs em um único suspiro.",
    "imagePath": "/assets/cards/green_178_sylvaris_arquidruida_plenilunio.webp"
  },
  {
    "id": "red_176_dancarino_plumas_brasa",
    "name": "Dançarino de Plumas em Brasa",
    "domain": "red",
    "type": "creature",
    "subtype": "Elfo • Dançarino de Fênix",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 1,
    "atk": 3,
    "armor": 0,
    "hp": 2,
    "preferredRow": "vanguard",
    "keywords": ["Alcance", "Voo", "Ímpeto", "Pele Incandescente"],
    "ascension": {
      "cost": 4,
      "newName": "Lâmina-Fênix Escarlate",
      "newAtk": 5,
      "newArmor": 0,
      "newMaxHp": 4,
      "addedKeywords": ["Renascer"]
    },
    "effects": [],
    "description": "Alcance, Voo, Ímpeto, Pele Incandescente. Ascensão 4: torna-se 5/4 e ganha Renascer.",
    "flavorText": "Suas plumas cortam o ar como fagulhas vivas dançando sobre a cratera rubra.",
    "imagePath": "/assets/cards/red_176_dancarino_plumas_brasa.webp"
  },
  {
    "id": "red_177_arqueiro_solar_cinza_viva",
    "name": "Arqueiro Solar da Cinza Viva",
    "domain": "red",
    "type": "creature",
    "subtype": "Elfo • Arqueiro de Fênix",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 2,
    "atk": 4,
    "armor": 0,
    "hp": 3,
    "breathDamage": 1,
    "preferredRow": "rearguard",
    "keywords": ["Alcance", "Fúria Crescente"],
    "effects": [
      {
        "trigger": "spell_cast",
        "type": "living_ash_arrow",
        "value": 2,
        "description": "Ao lançar feitiço, causa 2 de dano ignorando Armadura a 1 inimigo na Vanguarda."
      }
    ],
    "description": "Alcance, Fúria Crescente. Ao entrar, causa 1 de dano à Vanguarda inimiga. Ao lançar feitiço, causa 2 de dano ignorando Armadura a 1 inimigo.",
    "flavorText": "Cada encantamento entoado acende uma nova seta em sua aljava de brasa.",
    "imagePath": "/assets/cards/red_177_arqueiro_solar_cinza_viva.webp"
  },
  {
    "id": "red_178_kaelith_principe_asas_fenix",
    "name": "Kaelith, Príncipe das Asas de Fênix",
    "domain": "red",
    "type": "creature",
    "subtype": "Elfo • Príncipe Fênix",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 0,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": ["Alcance", "Voo", "Ímpeto", "Renascer"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "kaelith_phoenix_nova",
        "value": 3,
        "secondaryValue": 1,
        "description": "Ao entrar ou ativar Renascer, causa 3 de dano à Vanguarda inimiga e dá +1 de Ataque aos outros aliados neste turno."
      }
    ],
    "description": "Alcance, Voo, Ímpeto, Renascer. Ao entrar ou ativar Renascer, causa 3 de dano à Vanguarda inimiga e concede +1 de Ataque neste turno aos seus outros aliados.",
    "flavorText": "Abatê-lo uma vez é apenas convidar o próprio sol carmesim a descer sobre a arena.",
    "imagePath": "/assets/cards/red_178_kaelith_principe_asas_fenix.webp"
  },
  {
    "id": "neutral_175_emissario_lamina_espelho",
    "name": "Emissário de Lâmina-Espelho",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elfo • Emissário Real",
    "rarity": "uncommon",
    "cost": 3,
    "affinityReq": 0,
    "atk": 3,
    "armor": 1,
    "hp": 3,
    "preferredRow": "vanguard",
    "keywords": ["Alcance"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "mirror_blade_envoy",
        "value": 1,
        "description": "Ao entrar, compra 1 carta se você controlar outro Elfo ou aliados de 2+ cores."
      }
    ],
    "description": "Alcance, Armadura 1. Ao entrar, compra 1 carta se você controlar outro Elfo ou aliados de 2 ou mais cores distintas.",
    "flavorText": "Suas adagas espelhadas refletem os pactos selados entre todas as cortes.",
    "imagePath": "/assets/cards/neutral_175_emissario_lamina_espelho.webp"
  },
  {
    "id": "neutral_176_mestre_arqueiro_guarda_cristalina",
    "name": "Mestre-Arqueiro da Guarda Cristalina",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elfo • Mestre-Arqueiro Real",
    "rarity": "rare",
    "cost": 4,
    "affinityReq": 0,
    "atk": 3,
    "armor": 0,
    "hp": 4,
    "preferredRow": "rearguard",
    "keywords": ["Alcance"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "crystal_guard_resonance",
        "value": 1,
        "description": "Ao entrar, dá +1/+1 aos outros Elfos aliados; se houver 2+, ganha +1 de Ataque e Escudo Divino."
      }
    ],
    "description": "Alcance. Ao entrar, concede +1/+1 aos outros Elfos aliados; se houver 2 ou mais, ganha +1 de Ataque e Escudo Divino.",
    "flavorText": "Setas lapidadas em cristal axial voam em uníssono quando o Concílio marcha.",
    "imagePath": "/assets/cards/neutral_176_mestre_arqueiro_guarda_cristalina.webp"
  },
  {
    "id": "neutral_177_thalassion_alto_rei_concilio_elfico",
    "name": "Thalassion, Alto-Rei do Concílio Élfico",
    "domain": "neutral",
    "type": "creature",
    "subtype": "Elfo • Alto-Rei do Concílio",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 0,
    "atk": 5,
    "armor": 1,
    "hp": 6,
    "preferredRow": "rearguard",
    "keywords": ["Alcance", "Escudo Divino"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "thalassion_council_decree",
        "value": 1,
        "description": "Dá +1/+1 aos seus Elfos e busca 1 Elfo do Grimório. Seus outros Elfos têm +1 de Armadura."
      }
    ],
    "description": "Alcance, Escudo Divino, Armadura 1. Ao entrar, concede +1/+1 aos seus Elfos e busca 1 Elfo do Grimório para a mão. Seus outros Elfos têm +1 de Armadura.",
    "flavorText": "Cinco joias na coroa prateada, uma só voz soberana ecoando através das eras.",
    "imagePath": "/assets/cards/neutral_177_thalassion_alto_rei_concilio_elfico.webp"
  },
  {
    "id": "gold_179_leoric_grao_marechal_leao_solar",
    "name": "Leoric, Grão-Marechal do Leão Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humano • General Imperial",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 5,
    "armor": 3,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": ["Guardião", "Escudo Divino", "Atropelar"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "shield_all_allies",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao entrar, concede Escudo Divino e +1 de Armadura aos seus aliados."
      }
    ],
    "description": "Guardião, Escudo Divino, Atropelar, Armadura 3. Ao entrar, dá +1/+1, +1 de Armadura e Escudo Divino a todos os seus aliados.",
    "flavorText": "Quando o Leão de Solária apoia a montante no ombro, nenhuma muralha inimiga permanece de pé.",
    "imagePath": "/assets/cards/gold_179_leoric_grao_marechal_leao_solar.webp"
  },
  {
    "id": "gold_180_valerius_comandante_aguia_imperial",
    "name": "Valerius, Comandante da Águia Imperial",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humano • General Estrategista",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 4,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": ["Guardião", "Escudo Divino"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "summon_token",
        "value": 2,
        "description": "Ao entrar, invoca 2 Guardas Solares 2/2 na Vanguarda."
      },
      {
        "trigger": "turn_start",
        "type": "heal_all_allies",
        "value": 2,
        "description": "No início do seu turno, restaura 2 de Vida dos seus aliados e do seu Soberano."
      }
    ],
    "description": "Guardião, Escudo Divino, Armadura 2. Ao entrar, dá +1/+1 aos seus aliados e invoca 2 Guardas 2/2. No início do turno, cura 2 de Vida dos aliados.",
    "flavorText": "Sob o capuz alvo da Águia Imperial, cada ordem transforma recrutas em bastiões.",
    "imagePath": "/assets/cards/gold_180_valerius_comandante_aguia_imperial.webp"
  },
  {
    "id": "gold_181_wolfgang_marechal_escama_solar",
    "name": "Wolfgang, Marechal da Escama Solar",
    "domain": "gold",
    "type": "creature",
    "subtype": "Humano • General Dracônico",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": ["Guardião", "Ímpeto", "Escudo Divino"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Ao entrar, causa 4 de dano a 1 inimigo."
      },
      {
        "trigger": "on_attack",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao atacar, causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Ímpeto, Escudo Divino, Armadura 2. Ao entrar, dá +1/+1 aos seus aliados e causa 4 de dano a 1 inimigo. Ao atacar, causa 2 de dano à Vanguarda inimiga.",
    "flavorText": "Forjada em escamas de dragão solar e safira astral, sua couraça avança como um cometa em terra.",
    "imagePath": "/assets/cards/gold_181_wolfgang_marechal_escama_solar.webp"
  },
  {
    "id": "red_179_khorvus_tirano_mascara_auricrania",
    "name": "Khorvus, Tirano da Máscara Auricrânia",
    "domain": "red",
    "type": "creature",
    "subtype": "Humano • General Tirano",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 5,
    "armor": 1,
    "hp": 5,
    "preferredRow": "vanguard",
    "keywords": ["Ímpeto", "Fúria Crescente", "Atropelar"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "crimson_anvil_march",
        "value": 2,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +2 de Ataque, +1 de Armadura e Ímpeto à sua Vanguarda."
      }
    ],
    "description": "Ímpeto, Fúria Crescente, Atropelar, Armadura 1. Ao entrar, dá +1/+1 aos seus aliados e concede +2 de Ataque, +1 de Armadura e Ímpeto à sua Vanguarda.",
    "flavorText": "Por trás do sorriso de ouro fundido, sua ordem de ataque é um decreto de aniquilação.",
    "imagePath": "/assets/cards/red_179_khorvus_tirano_mascara_auricrania.webp"
  },
  {
    "id": "red_180_malakor_general_lamina_colossal",
    "name": "Malakor, General da Lâmina Colossal",
    "domain": "red",
    "type": "creature",
    "subtype": "Humano • General Berserker",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 6,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": ["Ímpeto", "Atropelar", "Fúria Crescente"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_single_enemy",
        "value": 4,
        "description": "Ao entrar, causa 4 de dano a 1 inimigo."
      },
      {
        "trigger": "on_attack",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao atacar, concede +1/+1 aos seus aliados."
      }
    ],
    "description": "Ímpeto, Atropelar, Fúria Crescente, Armadura 2. Ao entrar, dá +1/+1 aos seus aliados e causa 4 de dano a 1 inimigo. Ao atacar, dá +1/+1 aos aliados.",
    "flavorText": "Sua montante de ferro negro pesa tanto quanto um aríete — e parte muralhas com a mesma facilidade.",
    "imagePath": "/assets/cards/red_180_malakor_general_lamina_colossal.webp"
  },
  {
    "id": "red_181_ignis_marechal_coroa_cinzas",
    "name": "Ignis, Marechal da Coroa de Cinzas",
    "domain": "red",
    "type": "creature",
    "subtype": "Humano • General Vulcânico",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 7,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": ["Guardião", "Ímpeto", "Pele Incandescente"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "damage_enemy_row",
        "value": 3,
        "description": "Ao entrar, causa 3 de dano à Vanguarda inimiga."
      },
      {
        "trigger": "on_attack",
        "type": "damage_enemy_sovereign",
        "value": 3,
        "description": "Ao atacar, causa 3 de dano ao Soberano inimigo."
      }
    ],
    "description": "Guardião, Ímpeto, Pele Incandescente, Armadura 2. Ao entrar, dá +1/+1 aos seus aliados e causa 3 de dano à Vanguarda inimiga. Ao atacar, causa 3 ao Soberano.",
    "flavorText": "Onde a ponta incandescente de sua espada toca a pedra, nascem vulcões.",
    "imagePath": "/assets/cards/red_181_ignis_marechal_coroa_cinzas.webp"
  },
  {
    "id": "blue_179_arcturus_rei_juiz_coroa_safira",
    "name": "Arcturus, Rei-Juiz da Coroa de Safira",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humano • General Juiz",
    "rarity": "legendary",
    "cost": 6,
    "affinityReq": 3,
    "atk": 5,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": ["Guardião", "Escudo Divino"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy_vanguard",
        "value": 1,
        "description": "Ao entrar, Congela a Vanguarda inimiga."
      },
      {
        "trigger": "on_attack",
        "type": "damage_enemy_row",
        "value": 2,
        "description": "Ao atacar, causa 2 de dano à Vanguarda inimiga."
      }
    ],
    "description": "Guardião, Escudo Divino, Armadura 2. Ao entrar, dá +1/+1 aos seus aliados e congela a Vanguarda inimiga. Ao atacar, causa 2 à Vanguarda.",
    "flavorText": "Sua sentença desce como o inverno astral: estática, irrevogável e absoluta.",
    "imagePath": "/assets/cards/blue_179_arcturus_rei_juiz_coroa_safira.webp"
  },
  {
    "id": "blue_180_leona_marechal_leao_branco_inverno",
    "name": "Leona, Marechal do Leão Branco de Inverno",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humano • General Glacial",
    "rarity": "legendary",
    "cost": 5,
    "affinityReq": 3,
    "atk": 4,
    "armor": 2,
    "hp": 6,
    "preferredRow": "vanguard",
    "keywords": ["Guardião", "Escudo Divino", "Ímpeto"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "freeze_enemy",
        "value": 1,
        "description": "Ao entrar, Congela 1 inimigo por 1 rodada."
      },
      {
        "trigger": "on_enter",
        "type": "draw_cards",
        "value": 1,
        "description": "Ao entrar, compra 1 carta."
      }
    ],
    "description": "Guardião, Escudo Divino, Ímpeto, Armadura 2. Ao entrar, dá +1/+1 aos seus aliados, congela 1 inimigo por 1 rodada e compra 1 carta.",
    "flavorText": "Sob a juba alva do Leão Boreal, a nevasca marcha em formação cerrada.",
    "imagePath": "/assets/cards/blue_180_leona_marechal_leao_branco_inverno.webp"
  },
  {
    "id": "blue_181_selene_estrategista_egide_lunar",
    "name": "Selene, Estrategista da Égide Lunar",
    "domain": "blue",
    "type": "creature",
    "subtype": "Humano • General Estrategista",
    "rarity": "legendary",
    "cost": 7,
    "affinityReq": 3,
    "atk": 5,
    "armor": 2,
    "hp": 7,
    "preferredRow": "vanguard",
    "keywords": ["Guardião", "Alcance", "Escudo Divino"],
    "effects": [
      {
        "trigger": "on_enter",
        "type": "buff_all_allies",
        "value": 1,
        "secondaryValue": 1,
        "description": "Ao entrar, concede +1/+1 aos seus aliados."
      },
      {
        "trigger": "on_enter",
        "type": "bounce_enemy",
        "value": 1,
        "description": "Ao entrar, devolve 1 criatura inimiga para a mão do oponente."
      },
      {
        "trigger": "turn_start",
        "type": "draw_cards",
        "value": 1,
        "description": "No início do seu turno, compra 1 carta."
      }
    ],
    "description": "Guardião, Alcance, Escudo Divino, Armadura 2. Ao entrar, dá +1/+1 aos seus aliados e devolve 1 inimigo à mão. No início do turno, compra 1 carta.",
    "flavorText": "Cada fase do seu escudo crescente redesenha as linhas de batalha antes do primeiro choque.",
    "imagePath": "/assets/cards/blue_181_selene_estrategista_egide_lunar.webp"
  }
];

export const ALL_CARDS: CardDefinition[] = [...ALL_CARDS_PART_1, ...ALL_CARDS_PART_2];

export const CARD_MAP: Record<string, CardDefinition> = Object.fromEntries(
  ALL_CARDS.map(card => [card.id, card])
);

export const CARDS_BY_ID: Record<string, CardDefinition> = CARD_MAP;
