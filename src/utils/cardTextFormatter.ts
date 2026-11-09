import { CardDefinition, CardEffect, Keyword } from '../types/game';

const KEYWORD_COMBAT_CLAUSES: Record<Keyword, string> = {
  Guardião:
    'na Vanguarda obriga atacantes terrestres de qualquer coluna e unidades com Alcance a atacarem esta unidade primeiro',
  Voo: 'voa sobre defensores sem Voo em qualquer coluna, sendo bloqueada apenas por Guardião com Voo',
  Alcance: 'ataca alvos terrestres ou voadores em qualquer coluna e não sofre contra-ataque ao disparar da Retaguarda',
  Ímpeto: 'ataca no mesmo turno em que entra e golpeia primeiro na Onda de Iniciativa',
  Atropelar:
    'varre cartas empilhadas no slot e causa o dano excedente ao Soberano inimigo ao destruir o defensor',
  'Toque Letal':
    'executa criaturas ao causar dano real corpo a corpo ou aplica 1 de veneno extra à distância',
  'Escudo Divino': 'anula o primeiro dano que sofreria',
  'Dreno de Vida':
    'restaura 2 de Vida do seu Soberano ao atingir o Soberano rival ou 1 de Vida ao ferir criaturas',
  Renascer: 'retorna uma vez ao campo com 1 de Vida ao morrer',
  'Pele Incandescente':
    'causa 1 de dano de fogo de retorno a quem a ataca corpo a corpo',
  'Fúria Crescente': 'ganha +2 de Ataque sempre que sobrevive a dano',
};

function formatStatBonus(
  atkGain: number,
  hpGain: number,
  detailed: boolean
): string {
  if (atkGain > 0 && hpGain > 0) {
    return detailed
      ? `+${atkGain} de Ataque e +${hpGain} de Vida`
      : `+${atkGain}/+${hpGain} de Ataque e Vida`;
  }
  if (atkGain > 0) {
    return `+${atkGain} de Ataque`;
  }
  if (hpGain > 0) {
    return `+${hpGain} de Vida`;
  }
  return '+1/+1 de Ataque e Vida';
}

function isImmediatePlayTrigger(
  card: CardDefinition,
  trigger: CardEffect['trigger']
): boolean {
  if (trigger === 'on_enter') return true;
  if (
    trigger === 'spell_cast' &&
    (card.type === 'spell' || card.type === 'reaction')
  ) {
    return true;
  }
  return false;
}

function getTriggerPrefix(
  card: CardDefinition,
  trigger: CardEffect['trigger'],
  detailed = false
): string {
  if (card.type === 'spell') {
    if (trigger === 'on_enter' || trigger === 'spell_cast') {
      return 'Ao lançar, ';
    }
  }
  if (card.type === 'reaction') {
    if (trigger === 'on_enter' || trigger === 'spell_cast') {
      return 'Quando acionada, ';
    }
  }
  switch (trigger) {
    case 'on_enter':
      return 'Ao entrar, ';
    case 'spell_cast':
      return detailed
        ? 'Sempre que você lança um feitiço, '
        : 'Ao lançar um feitiço, ';
    case 'on_death':
      return card.type === 'relic' ? 'Ao ser destruída, ' : 'Ao morrer, ';
    case 'on_attack':
      return 'Ao atacar, ';
    case 'turn_start':
      return 'No início do seu turno, ';
    case 'turn_end':
      return 'No fim do seu turno, ';
    default:
      return 'Ao ativar, ';
  }
}

export function formatEffectActionClause(
  card: CardDefinition,
  effect: CardEffect,
  detailed: boolean
): string {
  const v = effect.value;
  const canChoose =
    isImmediatePlayTrigger(card, effect.trigger) && card.type !== 'reaction';

  switch (effect.type) {
    case 'damage_enemy_row': {
      if (!detailed) {
        return `causa ${v} de dano a todas as criaturas na Vanguarda inimiga`;
      }
      return canChoose
        ? `causa ${v} de dano a todas as criaturas inimigas na Vanguarda, ou na Retaguarda se você clicar em uma criatura de lá ou se a Vanguarda estiver vazia`
        : `causa ${v} de dano a todas as criaturas inimigas na Vanguarda, ou na Retaguarda se a Vanguarda estiver vazia`;
    }

    case 'damage_single_enemy': {
      if (card.type === 'reaction') {
        return detailed
          ? `causa ${v} de dano à criatura atacante, ou à inimiga de maior Ataque se lançada diretamente`
          : `causa ${v} de dano à criatura atacante`;
      }
      if (!detailed) {
        return canChoose
          ? `causa ${v} de dano a 1 criatura inimiga à sua escolha`
          : `causa ${v} de dano à criatura inimiga de maior Ataque`;
      }
      return canChoose
        ? `causa ${v} de dano a 1 criatura inimiga à sua escolha, atingindo a de maior Ataque se você não escolher ou o Soberano inimigo se o campo estiver vazio`
        : `causa ${v} de dano automaticamente à criatura inimiga de maior Ataque, ou diretamente ao Soberano inimigo se o campo estiver vazio`;
    }

    case 'damage_all_units': {
      const isBoardUnit = card.type === 'creature' || card.type === 'relic';
      return isBoardUnit
        ? `causa ${v} de dano a todas as outras criaturas em campo`
        : `causa ${v} de dano a todas as criaturas em campo`;
    }

    case 'damage_enemy_sovereign': {
      return `causa ${v} de dano direto ao Soberano inimigo`;
    }

    case 'heal_sovereign': {
      return `restaura ${v} de Vida do seu Soberano`;
    }

    case 'heal_all_allies': {
      return `restaura ${v} de Vida de todas as suas criaturas aliadas e do seu Soberano`;
    }

    case 'heal_target_ally': {
      if (!detailed) {
        return canChoose
          ? `restaura ${v} de Vida de 1 criatura aliada à sua escolha`
          : `restaura ${v} de Vida da criatura aliada mais ferida`;
      }
      return canChoose
        ? `restaura ${v} de Vida de 1 criatura aliada ferida à sua escolha, curando a mais ferida se você não escolher ou o seu Soberano se nenhuma estiver ferida`
        : `restaura ${v} de Vida automaticamente da sua criatura aliada mais ferida, ou do seu Soberano se nenhuma estiver ferida`;
    }

    case 'draw_cards': {
      return detailed
        ? `compra ${v} ${v === 1 ? 'carta' : 'cartas'} do seu Grimório`
        : `compra ${v} ${v === 1 ? 'carta' : 'cartas'}`;
    }

    case 'freeze_enemy': {
      if (card.type === 'reaction') {
        return detailed
          ? 'congela a criatura atacante por 1 rodada, ou a inimiga de maior Ataque se lançada diretamente'
          : 'congela a criatura atacante por 1 rodada';
      }
      if (effect.trigger === 'on_attack') {
        return detailed
          ? 'congela a criatura inimiga atacada por 1 rodada, ou a de maior Ataque se atacar o Soberano'
          : 'congela a criatura atacada por 1 rodada';
      }
      const preferVanguard = /Vanguarda/i.test(
        `${effect.description || ''} ${card.description || ''}`
      );
      if (!detailed) {
        return canChoose
          ? `congela 1 criatura inimiga à sua escolha por 1 rodada`
          : `congela a criatura inimiga de maior Ataque${preferVanguard ? ' na Vanguarda' : ''} por 1 rodada`;
      }
      return canChoose
        ? `congela 1 criatura inimiga à sua escolha por 1 rodada, ou a de maior Ataque${preferVanguard ? ' na Vanguarda' : ''} se você não escolher`
        : `congela automaticamente a criatura inimiga de maior Ataque${preferVanguard ? ' na Vanguarda' : ''} por 1 rodada`;
    }

    case 'freeze_enemy_vanguard': {
      const combinedDesc = `${effect.description || ''} ${card.description || ''}`;
      const freezeAllBoard = /todos os inimigos/i.test(combinedDesc);
      const limitMatch = combinedDesc.match(/até\s+(\d+)/i);
      const maxTargets = limitMatch ? parseInt(limitMatch[1], 10) : null;

      if (freezeAllBoard) {
        return 'congela todas as criaturas inimigas em campo por 1 rodada';
      }
      if (maxTargets && maxTargets > 0) {
        return `congela até ${maxTargets} criaturas na Vanguarda inimiga por 1 rodada`;
      }
      return 'congela todas as criaturas na Vanguarda inimiga por 1 rodada';
    }

    case 'bounce_enemy': {
      if (card.type === 'reaction') {
        return detailed
          ? 'devolve a criatura atacante para a mão do oponente, ou a inimiga de maior custo se lançada diretamente'
          : 'devolve a criatura atacante para a mão do oponente';
      }
      if (!detailed) {
        return canChoose
          ? 'devolve 1 criatura inimiga à sua escolha para a mão do oponente'
          : 'devolve a criatura inimiga de maior custo para a mão do oponente';
      }
      return canChoose
        ? 'devolve 1 criatura inimiga à sua escolha do campo para a mão do oponente, ou a de maior custo e Ataque se você não escolher'
        : 'devolve automaticamente a criatura inimiga de maior custo e Ataque para a mão do oponente';
    }

    case 'destroy_enemy': {
      if (card.type === 'reaction') {
        return detailed
          ? 'destrói imediatamente a criatura atacante, ignorando Escudo Divino e Armadura'
          : 'destrói a criatura atacante, ignorando Escudo Divino e Armadura';
      }
      if (!detailed) {
        return canChoose
          ? 'destrói 1 criatura inimiga à sua escolha, ignorando Escudo Divino e Armadura'
          : 'destrói a criatura inimiga mais forte, ignorando Escudo Divino e Armadura';
      }
      return canChoose
        ? 'destrói imediatamente 1 criatura inimiga à sua escolha, ignorando Escudo Divino e Armadura, ou a mais forte se você não escolher'
        : 'destrói imediatamente a criatura inimiga mais forte em campo, ignorando Escudo Divino e Armadura';
    }

    case 'revive_from_crypt': {
      if (v >= 5) {
        return `reanima da sua Cripta a criatura aliada mais forte de custo até ${v}`;
      }
      if (v <= 1) {
        return 'reanima da sua Cripta a criatura aliada mais forte';
      }
      return `reanima da sua Cripta as ${v} criaturas aliadas mais fortes`;
    }

    case 'buff_target_ally': {
      const atkGain = v;
      const hpGain = effect.secondaryValue !== undefined ? effect.secondaryValue : v;
      const statBonus = formatStatBonus(atkGain, hpGain, detailed);
      const preferVanguard = /Vanguarda/i.test(
        `${effect.description || ''} ${card.description || ''}`
      );
      if (!detailed) {
        return canChoose
          ? `concede ${statBonus} a 1 criatura aliada à sua escolha`
          : `concede ${statBonus} à sua criatura aliada mais forte${preferVanguard ? ' na Vanguarda' : ''}`;
      }
      return canChoose
        ? `concede permanentemente ${statBonus} a 1 criatura aliada à sua escolha, ou à mais forte${preferVanguard ? ' na Vanguarda' : ''} se você não escolher`
        : `concede permanentemente ${statBonus} automaticamente à sua criatura aliada mais forte${preferVanguard ? ' na Vanguarda' : ''}`;
    }

    case 'buff_all_allies': {
      const atkGain = v;
      const hpGain = effect.secondaryValue !== undefined ? effect.secondaryValue : v;
      const statBonus = formatStatBonus(atkGain, hpGain, detailed);
      const onlyVanguard = /na Vanguarda/i.test(effect.description || '');
      return `concede ${statBonus} a todas as suas criaturas aliadas${onlyVanguard ? ' na Vanguarda' : ''}`;
    }

    case 'debuff_enemy_vanguard_atk': {
      return `reduz em -${v} o Ataque de todas as criaturas inimigas em campo`;
    }

    case 'grant_bonus_essence': {
      const perm = effect.secondaryValue ?? 0;
      const isTurnBoundary =
        effect.trigger === 'turn_start' || effect.trigger === 'turn_end';
      const turnSuffix = isTurnBoundary ? '' : ' neste turno';
      if (perm > 0) {
        return `concede +${v} de Essência${turnSuffix} e +${perm} de Essência máxima`;
      }
      return `concede +${v} de Essência extra${turnSuffix}`;
    }

    case 'summon_token': {
      const hasExplicitHp =
        effect.secondaryValue !== undefined && effect.secondaryValue > 0;
      const tokenCount = hasExplicitHp ? 1 : v <= 2 ? Math.max(1, v) : 1;
      const atk = v;
      const hp = hasExplicitHp ? effect.secondaryValue! : v;
      return `invoca ${tokenCount} ${tokenCount === 1 ? 'criatura aliada' : 'criaturas aliadas'} ${atk}/${hp} na sua Vanguarda`;
    }

    case 'shield_all_allies': {
      const isSingleTarget =
        /a um aliado|a ele/i.test(
          `${effect.description || ''} ${card.description || ''}`
        ) && v <= 1;
      const bonusArmor = effect.secondaryValue ?? 0;
      const armorClause = bonusArmor > 0 ? ` e +${bonusArmor} de Armadura` : '';

      if (isSingleTarget) {
        if (!detailed) {
          return canChoose
            ? `concede Escudo Divino${armorClause} a 1 criatura aliada à sua escolha`
            : `concede Escudo Divino${armorClause} à sua criatura aliada mais forte`;
        }
        return canChoose
          ? `concede Escudo Divino${armorClause} a 1 criatura aliada à sua escolha, ou à mais forte sem escudo se você não escolher`
          : `concede Escudo Divino${armorClause} automaticamente à sua criatura aliada mais forte sem escudo`;
      }

      return `concede Escudo Divino${armorClause} a todas as suas criaturas aliadas`;
    }

    case 'steal_small_enemy': {
      const maxAtk = v > 0 ? v : 3;
      if (!detailed) {
        return canChoose
          ? `toma o controle de 1 criatura inimiga à sua escolha com Ataque até ${maxAtk}`
          : `toma o controle da criatura inimiga mais forte com Ataque até ${maxAtk}`;
      }
      return canChoose
        ? `toma o controle permanente de 1 criatura inimiga à sua escolha com Ataque atual até ${maxAtk}, ou da mais forte elegível se você não escolher`
        : `toma o controle permanente da criatura inimiga mais forte com Ataque atual até ${maxAtk}`;
    }

    case 'break_domain_expansion': {
      if (!detailed) {
        return 'quebra Expansões de Domínio inimigas';
      }
      return 'quebra imediatamente qualquer Expansão de Domínio inimiga ativa, inclusive ao atacar, e impõe 2 rodadas de exaustão de barreira ao oponente';
    }

    case 'magmatic_subduction': {
      const colDmg = effect.secondaryValue ?? 2;
      if (!detailed) {
        return `zera a Armadura na coluna alvo, causa ${v} de dano à Vanguarda e a recua, causando +${colDmg} se houver Retaguarda`;
      }
      return `remove a Armadura inimiga na coluna escolhida, causa ${v} de dano à Vanguarda e empurra os sobreviventes para a Retaguarda — causando +${colDmg} de dano a toda a coluna se a Retaguarda já estava ocupada`;
    }

    case 'crimson_anvil_march': {
      const siege = effect.secondaryValue ?? 2;
      if (!detailed) {
        return `dá +${v} de Ataque aos seus aliados neste turno para golpearem sua coluna ou causarem ${siege} ao Soberano rival`;
      }
      return `coloca seus aliados em postura de Ataque com +${v} de Ataque neste turno para golpearem o inimigo à frente sem gastar o ataque do turno, ou causarem ${siege} de dano ao Soberano rival se a coluna estiver livre`;
    }

    case 'coordinate_inversion': {
      if (!detailed) {
        return 'troca Vanguarda e Retaguarda na coluna inimiga alvo, congela quem recuar e compra 1 carta';
      }
      return 'inverte as unidades entre Vanguarda e Retaguarda na coluna inimiga escolhida, congela por 1 rodada quem foi para a Retaguarda e compra 1 carta';
    }

    case 'horizon_singularity': {
      if (!detailed) {
        return `puxa a Vanguarda inimiga ao centro, causa ${v} de dano e a congela; excedentes voltam à mão custando +1`;
      }
      return `puxa toda a Vanguarda inimiga para a coluna central, causando ${v} de dano e congelando a pilha por 1 rodada; unidades acima do limite voltam à mão do dono custando +1 de Essência`;
    }

    case 'shared_shadow_link': {
      if (!detailed) {
        return 'vincula 1 inimigo ao seu aliado de maior Vida neste turno: o dano sofrido pelo aliado atinge o alvo';
      }
      return 'vincula o inimigo escolhido ao seu aliado de maior Vida até o fim do turno: todo dano ou Sacrifício Vital sofrido por esse aliado também atinge o alvo, até a Vida máxima do aliado';
    }

    case 'twilight_procession': {
      if (!detailed) {
        return `invoca até ${v} criaturas da Cripta com Ímpeto e Dreno de Vida neste turno; cada ataque dá +1/+1 aos aliados`;
      }
      return `invoca até ${v} criaturas distintas da sua Cripta com Ímpeto e Dreno de Vida até o fim do turno; ao voltarem à Cripta, concedem +1/+1 permanente aos demais aliados por cada uma que atacou`;
    }

    case 'food_chain_law': {
      const heal = effect.secondaryValue ?? 3;
      if (!detailed) {
        return `seu aliado de maior Ataque golpeia 1 inimigo; se o abater, herda suas habilidades e cura ${heal} de Vida`;
      }
      return `faz seu aliado de maior Ataque golpear o inimigo escolhido em qualquer fileira, sem contra-ataque se tiver maior Vida máxima; se o abater, herda suas palavras-chave e cura ${heal} de Vida`;
    }

    case 'primordial_evolution_apex': {
      const regen = effect.secondaryValue ?? 2;
      if (!detailed) {
        return `evolui de graça seus aliados com Ascensão; os demais ganham +${v}/+${v}, Atropelar e +${regen} de Regeneração`;
      }
      return `ativa sem custo a Ascensão de todos os seus aliados elegíveis curando toda a sua Vida, enquanto os demais aliados ganham permanentemente +${v}/+${v}, Atropelar e +${regen} de Regeneração`;
    }

    case 'solar_spear_phalanx': {
      const minArm = effect.secondaryValue ?? 2;
      if (!detailed) {
        return `iguala a Armadura da Vanguarda à maior Armadura aliada, mínimo ${minArm}; colunas vizinhas retaliam em ${v}`;
      }
      return `eleva a Armadura da sua Vanguarda até a maior Armadura aliada, no mínimo ${minArm}; até o seu próximo turno, aliados nas colunas vizinhas causam ${v} de dano a quem atacar sua Vanguarda`;
    }

    case 'unconquered_champion_oath': {
      const hpBonus = effect.secondaryValue ?? 4;
      if (!detailed) {
        return `dá a 1 aliado +${v}/+${hpBonus}, +3 de Armadura, Guardião e Escudo Divino; vivo, ele absorve o dano ao seu Soberano`;
      }
      return `concede a 1 aliado +${v} de Ataque, +${hpBonus} de Vida, +3 de Armadura, Guardião e Escudo Divino; enquanto permanecer vivo, ele recebe em seu lugar todo dano inimigo ao seu Soberano`;
    }

    case 'royal_prism_convergence': {
      if (!detailed) {
        return 'ativa 1 efeito por cor distinta nos seus Terrenos: 3 dano, Congelar+Compra, Drenar 3, +2/+2 ou Escudo';
      }
      return 'ativa o efeito de cada cor presente nos seus Terrenos canalizados: Vermelho causa 3 de dano à Vanguarda inimiga; Azul congela 2 inimigos e compra 1 carta; Roxo drena 3 de Vida do Soberano rival; Verde dá +2/+2 e +1 de Regeneração aos aliados; Dourado dá Escudo Divino à sua Vanguarda';
    }

    case 'lanca_cantora_ward': {
      if (!detailed) {
        return `dá +${v} de Armadura e cura ${v} de Vida do aliado mais ferido na Vanguarda`;
      }
      return `concede +${v} de Armadura permanente e restaura ${v} de Vida ao aliado mais ferido na sua Vanguarda`;
    }

    case 'aelion_solar_edict': {
      if (!detailed) {
        return effect.trigger === 'on_enter'
          ? `dá Escudo Divino a 1 aliado; aliados com Escudo Divino têm +${v} de Ataque`
          : 'dá Escudo Divino a 1 aliado';
      }
      return effect.trigger === 'on_enter'
        ? `concede Escudo Divino a 1 aliado sem escudo; enquanto Aelion estiver em campo, seus aliados com Escudo Divino têm +${v} de Ataque`
        : 'concede Escudo Divino a 1 aliado sem escudo';
    }

    case 'drain_enemy_sovereign': {
      if (!detailed) {
        return `drena ${v} de Vida do Soberano rival para o seu Soberano`;
      }
      return `causa ${v} de dano ao Soberano rival e restaura ${v} de Vida do seu Soberano`;
    }

    case 'astral_obsidian_strike': {
      if (!detailed) {
        return `com 5+ de Sobrecarga, causa ${v} de dano ao alvo antes do combate`;
      }
      return `com 5 ou mais de Sobrecarga, causa ${v} de dano direto ao alvo antes do combate`;
    }

    case 'vaelen_astral_stigma': {
      const cap = effect.secondaryValue ?? 4;
      if (!detailed) {
        return `dá -${v} de Ataque a 1 inimigo; abatê-lo reanima 1 aliado de custo até ${cap} com 1 de Vida`;
      }
      return `reduz em ${v} o Ataque de 1 inimigo; quando ele morrer, reanima da Cripta 1 criatura de custo até ${cap} com 1 de Vida, priorizando Elfos`;
    }

    case 'chrono_prism_volley': {
      const frzDmg = effect.secondaryValue ?? 4;
      if (!detailed) {
        return `1x por turno, causa ${v} de dano a 1 inimigo, ou ${frzDmg} de dano e compra 1 carta se congelado`;
      }
      return `uma vez por turno, causa ${v} de dano a 1 inimigo — ou ${frzDmg} de dano e compra 1 carta se o alvo estiver congelado`;
    }

    case 'lyriel_astral_zero': {
      if (!detailed) {
        return `congela até ${v} inimigos e puxa o mais fraco da Retaguarda à frente; congelados perdem Guardião e sofrem +2 de dano seu`;
      }
      return `congela até ${v} inimigos por 1 rodada e puxa o de menor Ataque da Retaguarda para a Vanguarda`;
    }

    case 'emerald_antler_hunt': {
      const cap = effect.secondaryValue ?? 3;
      if (!detailed) {
        return `ganha +${v}/+${v} para cada outro Elfo ou aliado com Regeneração em campo, até +${cap}/+${cap}`;
      }
      return `recebe permanentemente +${v}/+${v} para cada outro Elfo ou aliado com Regeneração em campo, até +${cap}/+${cap} por ataque`;
    }

    case 'sylvaris_fullmoon_bloom': {
      if (!detailed) {
        return `dá +${v}/+${v} e +${v} de Regeneração à Vanguarda e ascende de graça 1 aliado`;
      }
      return `concede +${v}/+${v} e +${v} de Regeneração à sua Vanguarda e ativa sem custo a Ascensão de 1 aliado elegível, curando toda a sua Vida`;
    }

    case 'living_ash_arrow': {
      if (!detailed) {
        return `causa ${v} de dano ignorando Armadura a 1 inimigo`;
      }
      return `causa ${v} de dano ignorando Armadura a 1 inimigo na Vanguarda, ou na Retaguarda se a Vanguarda estiver vazia`;
    }

    case 'kaelith_phoenix_nova': {
      const atkGain = effect.secondaryValue ?? 1;
      if (!detailed) {
        return `causa ${v} de dano à Vanguarda inimiga e dá +${atkGain} de Ataque aos outros aliados neste turno`;
      }
      return `causa ${v} de dano a todas as criaturas na Vanguarda inimiga e concede +${atkGain} de Ataque neste turno aos seus outros aliados`;
    }

    case 'mirror_blade_envoy': {
      if (!detailed) {
        return `compra ${v} ${v === 1 ? 'carta' : 'cartas'} se você controlar outro Elfo ou aliados de 2+ cores`;
      }
      return `compra ${v} ${v === 1 ? 'carta' : 'cartas'} se você controlar outro Elfo ou aliados de pelo menos 2 cores distintas`;
    }

    case 'crystal_guard_resonance': {
      if (!detailed) {
        return `dá +${v}/+${v} aos outros Elfos aliados; se houver 2 ou mais, ganha +1 de Ataque e Escudo Divino`;
      }
      return `concede +${v}/+${v} permanente aos seus outros Elfos; se houver 2 ou mais outros Elfos, ganha também +1 de Ataque e Escudo Divino`;
    }

    case 'thalassion_council_decree': {
      if (!detailed) {
        return `dá +${v}/+${v} aos seus Elfos e busca 1 Elfo do Grimório; seus outros Elfos têm +1 de Armadura`;
      }
      return `concede +${v}/+${v} permanente a todos os seus Elfos em campo e busca 1 Elfo do Grimório para a mão`;
    }

    default:
      return (effect.description || '').replace(/[()]/g, '');
  }
}

function buildKeywordsCombatSentence(keywords: Keyword[]): string {
  const parts: string[] = [];
  for (const kw of keywords) {
    const clause = KEYWORD_COMBAT_CLAUSES[kw];
    if (clause) {
      parts.push(clause);
    }
  }
  if (parts.length === 0) {
    return 'Unidade de combate que ataca inimigos na mesma Coluna.';
  }
  if (parts.length === 1) {
    return `Em combate, ${parts[0]}.`;
  }
  const joined = parts.slice(0, -1).join(', ') + ' e ' + parts[parts.length - 1];
  return `Em combate, ${joined}.`;
}

/**
 * Normalizes a list of effects sharing a single trigger (plus optional breathDamage on on_enter),
 * merging duplicate effect types so the target is ALWAYS stated immediately after the verb
 * and never repeated awkwardly.
 */
function joinTriggerClauses(
  card: CardDefinition,
  rawEffects: CardEffect[],
  detailed: boolean,
  includeBreathDmg = 0
): string {
  // Clone and deduplicate identical effect types on the same trigger by summing values
  const effects: CardEffect[] = [];
  for (const eff of rawEffects) {
    const existing = effects.find(
      (e) => e.type === eff.type && e.secondaryValue === eff.secondaryValue
    );
    if (existing) {
      existing.value += eff.value;
    } else {
      effects.push({ ...eff });
    }
  }

  if (includeBreathDmg > 0) {
    const existingRowDmg = effects.find((e) => e.type === 'damage_enemy_row');
    if (existingRowDmg) {
      existingRowDmg.value += includeBreathDmg;
    } else {
      effects.unshift({
        trigger: 'on_enter',
        type: 'damage_enemy_row',
        value: includeBreathDmg,
      });
    }
  }

  const isSingleShield = (e: CardEffect) =>
    e.type === 'shield_all_allies' &&
    /a um aliado|a ele/i.test(`${e.description || ''} ${card.description || ''}`) &&
    e.value <= 1;

  // Merge shield_all_allies (when all allies) + buff_all_allies on the same trigger
  const shieldAllIdx = effects.findIndex(
    (e) => e.type === 'shield_all_allies' && !isSingleShield(e)
  );
  const buffAllIdx = effects.findIndex((e) => e.type === 'buff_all_allies');
  const buffAllOnlyVanguard =
    buffAllIdx !== -1 && /na Vanguarda/i.test(effects[buffAllIdx].description || '');
  const canMergeBuffAndShieldAll =
    shieldAllIdx !== -1 && buffAllIdx !== -1 && !buffAllOnlyVanguard;
  const canLinkShieldAllAndBuffVanguard =
    shieldAllIdx !== -1 && buffAllIdx !== -1 && buffAllOnlyVanguard;

  // Merge buff_target_ally + single-target shield_all_allies on the same trigger
  const buffTargetIdx = effects.findIndex((e) => e.type === 'buff_target_ally');
  const shieldSingleIdx = effects.findIndex((e) => isSingleShield(e));
  const canMergeBuffAndShieldSingle = buffTargetIdx !== -1 && shieldSingleIdx !== -1;

  // Check if all-allies target is already mentioned by buff_all_allies or shield_all_allies
  const hasOtherAllAlliesClause = shieldAllIdx !== -1 || buffAllIdx !== -1;

  // Merge heal_all_allies + heal_sovereign when both appear on the same trigger
  const healAllIdx = effects.findIndex((e) => e.type === 'heal_all_allies');
  const healSovIdx = effects.findIndex((e) => e.type === 'heal_sovereign');
  const dmgSovIdx = effects.findIndex((e) => e.type === 'damage_enemy_sovereign');
  const canMergeSovDrain =
    dmgSovIdx !== -1 && healSovIdx !== -1 && healAllIdx === -1;

  // Ensure buff_all_allies / shield_all_allies appear before heal_all_allies so "delas" refers back cleanly
  if (
    healAllIdx !== -1 &&
    hasOtherAllAlliesClause &&
    ((shieldAllIdx !== -1 && healAllIdx < shieldAllIdx) ||
      (buffAllIdx !== -1 && healAllIdx < buffAllIdx))
  ) {
    // We will emit heal_all_allies after the buff/shield clause
  }

  // Merge damage_enemy_row + freeze_enemy_vanguard when both appear on the same trigger
  const rowDmgIdx = effects.findIndex((e) => e.type === 'damage_enemy_row');
  const freezeVanIdx = effects.findIndex((e) => e.type === 'freeze_enemy_vanguard');
  const canMergeRowDmgAndFreeze = rowDmgIdx !== -1 && freezeVanIdx !== -1;

  // Merge damage_single_enemy + freeze_enemy when both appear on the same trigger
  const singleDmgIdx = effects.findIndex((e) => e.type === 'damage_single_enemy');
  const freezeSingleIdx = effects.findIndex((e) => e.type === 'freeze_enemy');
  const bounceSingleIdx = effects.findIndex((e) => e.type === 'bounce_enemy');
  const canMergeSingleDmgAndFreeze = singleDmgIdx !== -1 && freezeSingleIdx !== -1;
  const canMergeBounceAndFreeze =
    !canMergeSingleDmgAndFreeze && bounceSingleIdx !== -1 && freezeSingleIdx !== -1;

  const consumedIndices = new Set<number>();
  const clauses: string[] = [];
  let deferredHealClause: string | null = null;

  const buildHealAllClause = (usePronoun: boolean): string => {
    const allVal = effects[healAllIdx].value;
    const sovVal = healSovIdx !== -1 ? allVal + effects[healSovIdx].value : allVal;
    const alliesTarget = usePronoun ? 'delas' : 'de todas as suas criaturas aliadas';
    if (sovVal !== allVal) {
      return `restaura ${allVal} de Vida ${alliesTarget} e ${sovVal} de Vida do seu Soberano`;
    }
    return `restaura ${allVal} de Vida ${alliesTarget} e do seu Soberano`;
  };

  let allAlliesMentionedSoFar = false;

  for (let i = 0; i < effects.length; i++) {
    if (consumedIndices.has(i)) continue;

    if (canMergeBuffAndShieldAll && (i === shieldAllIdx || i === buffAllIdx)) {
      consumedIndices.add(shieldAllIdx);
      consumedIndices.add(buffAllIdx);
      const buffEff = effects[buffAllIdx];
      const shieldEff = effects[shieldAllIdx];
      const atkGain = buffEff.value;
      const hpGain =
        buffEff.secondaryValue !== undefined ? buffEff.secondaryValue : buffEff.value;
      const statBonus = formatStatBonus(atkGain, hpGain, detailed);
      const bonusArmor = shieldEff.secondaryValue ?? 0;
      const armorClause = bonusArmor > 0 ? ` e +${bonusArmor} de Armadura` : '';
      clauses.push(
        `concede ${statBonus} e Escudo Divino${armorClause} a todas as suas criaturas aliadas`
      );
      allAlliesMentionedSoFar = true;
      continue;
    }

    if (canLinkShieldAllAndBuffVanguard && (i === shieldAllIdx || i === buffAllIdx)) {
      consumedIndices.add(shieldAllIdx);
      consumedIndices.add(buffAllIdx);
      const buffEff = effects[buffAllIdx];
      const shieldEff = effects[shieldAllIdx];
      const atkGain = buffEff.value;
      const hpGain =
        buffEff.secondaryValue !== undefined ? buffEff.secondaryValue : buffEff.value;
      const statBonus = formatStatBonus(atkGain, hpGain, detailed);
      const bonusArmor = shieldEff.secondaryValue ?? 0;
      const armorClause = bonusArmor > 0 ? ` e +${bonusArmor} de Armadura` : '';
      clauses.push(
        `concede Escudo Divino${armorClause} a todas as suas criaturas aliadas e ${statBonus} às que estão na Vanguarda`
      );
      allAlliesMentionedSoFar = true;
      continue;
    }

    if (canMergeBuffAndShieldSingle && (i === buffTargetIdx || i === shieldSingleIdx)) {
      consumedIndices.add(buffTargetIdx);
      consumedIndices.add(shieldSingleIdx);
      const buffEff = effects[buffTargetIdx];
      const shieldEff = effects[shieldSingleIdx];
      const atkGain = buffEff.value;
      const hpGain =
        buffEff.secondaryValue !== undefined ? buffEff.secondaryValue : buffEff.value;
      const statBonus = formatStatBonus(atkGain, hpGain, detailed);
      const bonusArmor = shieldEff.secondaryValue ?? 0;
      const armorClause = bonusArmor > 0 ? ` e +${bonusArmor} de Armadura` : '';
      const canChoose =
        isImmediatePlayTrigger(card, buffEff.trigger) && card.type !== 'reaction';
      clauses.push(
        canChoose
          ? `concede ${statBonus} e Escudo Divino${armorClause} a 1 criatura aliada à sua escolha`
          : `concede ${statBonus} e Escudo Divino${armorClause} à sua criatura aliada mais forte`
      );
      continue;
    }

    if (canMergeRowDmgAndFreeze && (i === rowDmgIdx || i === freezeVanIdx)) {
      consumedIndices.add(rowDmgIdx);
      consumedIndices.add(freezeVanIdx);
      const dmgVal = effects[rowDmgIdx].value;
      const freezeEff = effects[freezeVanIdx];
      const combinedDesc = `${freezeEff.description || ''} ${card.description || ''}`;
      const freezeAllBoard = /todos os inimigos/i.test(combinedDesc);
      const limitMatch = combinedDesc.match(/até\s+(\d+)/i);
      const maxTargets = limitMatch ? parseInt(limitMatch[1], 10) : null;

      if (freezeAllBoard) {
        clauses.push(
          `causa ${dmgVal} de dano na Vanguarda inimiga e congela todas as criaturas inimigas em campo por 1 rodada`
        );
      } else if (maxTargets && maxTargets > 0) {
        clauses.push(
          `causa ${dmgVal} de dano a todas as criaturas na Vanguarda inimiga e congela até ${maxTargets} delas por 1 rodada`
        );
      } else {
        clauses.push(
          `causa ${dmgVal} de dano a todas as criaturas na Vanguarda inimiga e as congela por 1 rodada`
        );
      }
      continue;
    }

    if (canMergeSingleDmgAndFreeze && (i === singleDmgIdx || i === freezeSingleIdx)) {
      consumedIndices.add(singleDmgIdx);
      consumedIndices.add(freezeSingleIdx);
      const dmgEff = effects[singleDmgIdx];
      if (card.type === 'reaction') {
        clauses.push(
          `causa ${dmgEff.value} de dano à criatura atacante e a congela por 1 rodada`
        );
      } else {
        const canChoose = isImmediatePlayTrigger(card, dmgEff.trigger);
        clauses.push(
          canChoose
            ? `causa ${dmgEff.value} de dano a 1 criatura inimiga à sua escolha e a congela por 1 rodada`
            : `causa ${dmgEff.value} de dano à criatura inimiga de maior Ataque e a congela por 1 rodada`
        );
      }
      continue;
    }

    if (canMergeBounceAndFreeze && (i === bounceSingleIdx || i === freezeSingleIdx)) {
      consumedIndices.add(bounceSingleIdx);
      consumedIndices.add(freezeSingleIdx);
      const bounceEff = effects[bounceSingleIdx];
      if (card.type === 'reaction') {
        clauses.push(
          'devolve a criatura atacante para a mão do oponente e congela outra criatura inimiga por 1 rodada'
        );
      } else {
        const canChoose = isImmediatePlayTrigger(card, bounceEff.trigger);
        clauses.push(
          canChoose
            ? 'devolve 1 criatura inimiga à sua escolha para a mão do oponente e congela outra por 1 rodada'
            : 'devolve a criatura inimiga de maior custo para a mão do oponente e congela a de maior Ataque por 1 rodada'
        );
      }
      continue;
    }

    if (canMergeSovDrain && (i === dmgSovIdx || i === healSovIdx)) {
      consumedIndices.add(dmgSovIdx);
      consumedIndices.add(healSovIdx);
      const dmgVal = effects[dmgSovIdx].value;
      const healVal = effects[healSovIdx].value;
      clauses.push(
        `causa ${dmgVal} de dano direto ao Soberano inimigo e restaura ${healVal} de Vida do seu`
      );
      continue;
    }

    if (healAllIdx !== -1 && (i === healAllIdx || i === healSovIdx)) {
      consumedIndices.add(healAllIdx);
      if (healSovIdx !== -1) consumedIndices.add(healSovIdx);
      if (hasOtherAllAlliesClause && !allAlliesMentionedSoFar) {
        deferredHealClause = buildHealAllClause(true);
      } else {
        clauses.push(buildHealAllClause(allAlliesMentionedSoFar));
        allAlliesMentionedSoFar = true;
      }
      continue;
    }

    consumedIndices.add(i);
    if (i === shieldAllIdx || i === buffAllIdx) {
      allAlliesMentionedSoFar = true;
    }
    const c = formatEffectActionClause(card, effects[i], detailed);
    if (c) clauses.push(c);
    if (deferredHealClause && allAlliesMentionedSoFar) {
      clauses.push(deferredHealClause);
      deferredHealClause = null;
    }
  }

  if (deferredHealClause) {
    clauses.push(deferredHealClause);
  }

  if (clauses.length === 0) return '';
  if (clauses.length === 1) return clauses[0];

  // If a compound clause containing internal " e " is part of a multi-clause sentence,
  // split its internal " e " into two clauses so the final sentence uses "A, B e C" cleanly.
  const expandedClauses: string[] = [];
  for (let i = 0; i < clauses.length; i++) {
    const c = clauses[i];
    const isLast = i === clauses.length - 1;
    if (!isLast && c.includes(' e as congela por 1 rodada')) {
      const [part1, part2] = c.split(' e as congela por 1 rodada');
      expandedClauses.push(part1, `as congela por 1 rodada${part2}`);
    } else if (!isLast && c.includes(' e congela ')) {
      const [part1, part2] = c.split(' e congela ');
      expandedClauses.push(part1, `congela ${part2}`);
    } else if (
      clauses.length >= 2 &&
      c.startsWith('causa ') &&
      c.includes(' de dano direto ao Soberano inimigo e restaura ')
    ) {
      const [part1, part2] = c.split(' e restaura ');
      expandedClauses.push(part1, `restaura ${part2}`);
    } else {
      expandedClauses.push(c);
    }
  }

  // If a clause with "de todas as suas criaturas aliadas e do seu Soberano" is not last, move short utility clauses (like "compra X carta") before it
  if (expandedClauses.length >= 2) {
    const compoundHealIdx = expandedClauses.findIndex(
      (c, idx) =>
        idx < expandedClauses.length - 1 &&
        c.startsWith('restaura ') &&
        c.includes(' e ') &&
        c.endsWith('do seu Soberano')
    );
    if (compoundHealIdx !== -1) {
      const [healClause] = expandedClauses.splice(compoundHealIdx, 1);
      expandedClauses.push(healClause);
    }
  }

  // Avoid repeating leading verb ("causa ", "concede ", "restaura ") in consecutive clauses
  const cleanedClauses: string[] = [expandedClauses[0]];
  let prevVerb = expandedClauses[0].split(' ')[0];
  for (let i = 1; i < expandedClauses.length; i++) {
    const curr = expandedClauses[i];
    const currVerb = curr.split(' ')[0];
    if (
      (currVerb === 'causa' || currVerb === 'concede' || currVerb === 'restaura') &&
      currVerb === prevVerb
    ) {
      cleanedClauses.push(curr.slice(currVerb.length + 1));
    } else {
      cleanedClauses.push(curr);
      prevVerb = currVerb;
    }
  }

  return (
    cleanedClauses.slice(0, -1).join(', ') +
    ' e ' +
    cleanedClauses[cleanedClauses.length - 1]
  );
}

interface BespokeCardTextEntry {
  face: string;
  ascendedFace?: string;
  detailed: string[];
  ascensionBonusNote?: string;
}

const BESPOKE_RECENT_CARD_RULES: Record<string, BespokeCardTextEntry> = {
  // === 11 Feitiços Raros & Lendários de Assinatura ===
  red_174_subduccao_magmatica: {
    face: 'Zera a Armadura na coluna alvo, causa 3 de dano à Vanguarda e a recua, causando +2 se houver Retaguarda.',
    detailed: [
      'Remove a Armadura inimiga na coluna escolhida, causa 3 de dano à Vanguarda e empurra os sobreviventes para a Retaguarda.',
      'Se a Retaguarda dessa coluna já estava ocupada, todas as unidades da coluna sofrem +2 de dano.',
    ],
  },
  red_175_marcha_bigorna_rubra: {
    face: 'Seus aliados ganham +2 de Ataque neste turno e golpeiam sua coluna, ou causam 2 ao Soberano rival.',
    detailed: [
      'Coloca seus aliados em postura de Ataque com +2 de Ataque neste turno.',
      'Cada aliado golpeia o inimigo à frente sem gastar o ataque do turno, ou causa 2 de dano ao Soberano rival se a coluna estiver livre.',
    ],
  },
  blue_174_inversao_coordenadas: {
    face: 'Troca Vanguarda e Retaguarda na coluna inimiga alvo, congela quem recuar e compra 1 carta.',
    detailed: [
      'Inverte as unidades entre Vanguarda e Retaguarda na coluna inimiga escolhida, congela por 1 rodada quem foi para a Retaguarda e compra 1 carta.',
    ],
  },
  blue_175_singularidade_horizonte: {
    face: 'Puxa a Vanguarda inimiga ao centro, causa 3 de dano e a congela; excedentes voltam à mão custando +1.',
    detailed: [
      'Puxa toda a Vanguarda inimiga para a coluna central, causando 3 de dano e congelando a pilha por 1 rodada.',
      'Unidades acima do limite da coluna voltam à mão do dono custando +1 de Essência.',
    ],
  },
  purple_174_elo_sombra_partilhada: {
    face: 'Vincula 1 inimigo ao seu aliado de maior Vida neste turno: o dano sofrido pelo aliado atinge o alvo.',
    detailed: [
      'Vincula o inimigo escolhido ao seu aliado de maior Vida até o fim do turno.',
      'Todo dano ou Sacrifício Vital sofrido por esse aliado também atinge o alvo, até o limite da Vida máxima do aliado.',
    ],
  },
  purple_175_procissao_crepusculo: {
    face: 'Invoca até 3 criaturas da Cripta com Ímpeto e Dreno de Vida neste turno; cada ataque dá +1/+1 aos aliados.',
    detailed: [
      'Custo adicional: adiciona +2 de Sobrecarga ao seu Soberano.',
      'Invoca até 3 criaturas distintas da sua Cripta com Ímpeto e Dreno de Vida até o fim do turno.',
      'No fim do turno, elas voltam à Cripta e concedem +1/+1 permanente aos demais aliados por cada uma que atacou.',
    ],
  },
  green_174_lei_cadeia_alimentar: {
    face: 'Seu aliado de maior Ataque golpeia 1 inimigo; se o abater, herda suas habilidades e cura 3 de Vida.',
    detailed: [
      'Seu aliado de maior Ataque golpeia o inimigo escolhido em qualquer fileira, sem contra-ataque se tiver maior Vida máxima.',
      'Se abater o alvo, herda permanentemente suas palavras-chave e restaura 3 de Vida.',
    ],
  },
  green_175_apice_evolucao_primordial: {
    face: 'Evolui de graça seus aliados com Ascensão; os demais ganham +3/+3, Atropelar e +2 de Regeneração.',
    detailed: [
      'Ativa sem custo a Ascensão de todos os seus aliados elegíveis, curando toda a sua Vida.',
      'Seus demais aliados recebem permanentemente +3/+3, Atropelar e +2 de Regeneração.',
    ],
  },
  gold_174_falange_lancas_solares: {
    face: 'Iguala a Armadura da Vanguarda à maior Armadura aliada, mínimo 2; colunas vizinhas retaliam em 2.',
    detailed: [
      'Eleva a Armadura da sua Vanguarda até a maior Armadura aliada, no mínimo 2.',
      'Até o seu próximo turno, quando sua Vanguarda for atacada, aliados nas colunas vizinhas causam 2 de dano ao atacante.',
    ],
  },
  gold_175_juramento_campeao_invicto: {
    face: 'Dá a 1 aliado +2/+4, +3 de Armadura, Guardião e Escudo Divino; vivo, ele absorve o dano ao seu Soberano.',
    detailed: [
      'Concede a 1 aliado +2 de Ataque, +4 de Vida, +3 de Armadura, Guardião e Escudo Divino.',
      'Enquanto permanecer vivo, ele recebe em seu lugar todo dano inimigo que atingiria o seu Soberano.',
    ],
  },
  neutral_174_convergencia_prisma_real: {
    face: 'Ativa 1 efeito por cor distinta nos seus Terrenos: 3 dano, Congelar+Compra, Drenar 3, +2/+2 ou Escudo.',
    detailed: [
      'Ativa o efeito de cada cor presente nos seus Terrenos canalizados:',
      '• Vermelho: 3 de dano à Vanguarda inimiga. • Azul: congela 2 inimigos e compra 1 carta. • Roxo: drena 3 de Vida do Soberano rival. • Verde: +2/+2 e +1 de Regeneração aos aliados. • Dourado: Escudo Divino à sua Vanguarda.',
    ],
  },

  // === 18 Elfos das Seis Cortes ===
  gold_176_arauto_louros_alvorada: {
    face: 'Ao entrar, cura 2 de Vida do seu Soberano. Ascensão 4: torna-se 4/5 com 2 de Armadura e Guardião.',
    ascendedFace: 'Ao entrar, cura 2 de Vida do seu Soberano.',
    detailed: [
      'Possui 1 de Armadura: absorve ataques de até 1 e reduz em 1 os maiores.',
      'Ao entrar, restaura 2 de Vida do seu Soberano.',
    ],
  },
  gold_177_lanca_cantora_coro_solar: {
    face: 'No início do seu turno, dá +1 de Armadura e cura 1 de Vida do aliado mais ferido na Vanguarda.',
    detailed: [
      'No início do seu turno, concede +1 de Armadura permanente e restaura 1 de Vida ao aliado mais ferido na sua Vanguarda.',
    ],
  },
  gold_178_aelion_hierofante_coroa_aurea: {
    face: 'Ao entrar ou lançar feitiço, dá Escudo Divino a 1 aliado. Aliados com Escudo Divino têm +2 de Ataque.',
    detailed: [
      'Possui 1 de Armadura: absorve ataques de até 1 e reduz em 1 os maiores.',
      'Ao entrar ou ao lançar um feitiço, concede Escudo Divino a 1 aliado sem escudo, priorizando Elfos e Guardiões.',
      'Aura: enquanto Aelion estiver em campo, seus aliados com Escudo Divino têm +2 de Ataque.',
    ],
  },
  purple_176_tecela_lagrimas_negras: {
    face: 'Ao morrer, drena 2 de Vida do Soberano rival para o seu Soberano.',
    detailed: [
      'Custo adicional: adiciona +1 de Sobrecarga ao seu Soberano.',
      'Ao morrer, causa 2 de dano ao Soberano rival e restaura 2 de Vida do seu Soberano.',
    ],
  },
  purple_177_inquisidor_obsidiana_astral: {
    face: 'Ao atacar com 5+ de Sobrecarga, causa 2 de dano ao alvo antes do combate.',
    detailed: [
      'Custo adicional: adiciona +2 de Sobrecarga ao seu Soberano.',
      'Ao atacar com 5 ou mais de Sobrecarga, causa 2 de dano direto ao alvo antes do choque de combate.',
    ],
  },
  purple_178_vaelen_oraculo_choro_dourado: {
    face: 'Ao entrar, dá -2 de Ataque a 1 inimigo; abatê-lo reanima 1 aliado de custo até 4 com 1 de Vida. Sobrecarga ou Sacrifício causa 2 ao rival.',
    detailed: [
      'Custo adicional: adiciona +2 de Sobrecarga ao seu Soberano.',
      'Ao entrar, reduz em 2 o Ataque de 1 inimigo; quando ele morrer, reanima da Cripta 1 criatura de custo até 4 com 1 de Vida, priorizando Elfos.',
      'Aura: enquanto Vaelen estiver em campo, ganhar Sobrecarga ou usar Sacrifício Vital causa 2 de dano ao Soberano rival.',
    ],
  },
  blue_176_sentinela_capuz_estelar: {
    face: 'Ao entrar, congela 1 inimigo por 1 rodada. Ascensão 4: torna-se 4/6 e compra 1 carta ao atacar congelados.',
    ascendedFace: 'Ao atacar um inimigo congelado, compra 1 carta.',
    ascensionBonusNote: 'Ao atacar inimigos congelados, compra 1 carta.',
    detailed: [
      'Ao entrar, congela 1 criatura inimiga por 1 rodada.',
    ],
  },
  blue_177_cronomante_terceiro_prisma: {
    face: '1x por turno, ao lançar feitiço, causa 2 de dano a 1 inimigo, ou 4 de dano e compra 1 carta se congelado.',
    detailed: [
      'Uma vez por turno, ao lançar um feitiço, causa 2 de dano a 1 inimigo — ou 4 de dano e compra 1 carta se o alvo estiver congelado.',
    ],
  },
  blue_178_lyriel_vidente_zero_astral: {
    face: 'Ao entrar, congela até 2 inimigos e puxa o mais fraco da Retaguarda à frente. Congelados perdem Guardião e sofrem +2 de dano seu.',
    detailed: [
      'Ao entrar, congela até 2 inimigos por 1 rodada e puxa o de menor Ataque da Retaguarda para a Vanguarda.',
      'Aura: enquanto Lyriel estiver em campo, inimigos congelados perdem Guardião e sofrem +2 de dano das suas cartas.',
    ],
  },
  green_176_sussurrador_seiva_lunar: {
    face: 'Regeneração 2. Ao entrar, ganha +1 de Essência neste turno. Ascensão 4: torna-se 3/6 e dá +1/+1 aos Elfos e Verdes.',
    ascendedFace: 'Regeneração 2. Ao entrar, ganha +1 de Essência neste turno.',
    ascensionBonusNote: 'Ao ascender, concede +1/+1 aos outros Elfos e aliados Verdes.',
    detailed: [
      'Regenera 2 de Vida no início do seu turno.',
      'Ao entrar, concede +1 de Essência extra neste turno.',
    ],
  },
  green_177_cacador_galhada_esmeralda: {
    face: 'Regeneração 2. Ao atacar, ganha +1/+1 para cada outro Elfo ou aliado com Regeneração, até +3/+3.',
    detailed: [
      'Regenera 2 de Vida no início do seu turno.',
      'Ao atacar, recebe permanentemente +1/+1 para cada outro Elfo ou aliado com Regeneração em campo, até +3/+3 por ataque.',
    ],
  },
  green_178_sylvaris_arquidruida_plenilunio: {
    face: 'Ao entrar, dá +2/+2 e +2 de Regeneração à Vanguarda e ascende 1 aliado. No início do turno, regenera 3 de Vida e gera +1 de Essência.',
    detailed: [
      'Ao entrar, concede +2/+2 e +2 de Regeneração à sua Vanguarda e ativa sem custo a Ascensão de 1 aliado elegível, curando toda a sua Vida.',
      'No início do seu turno, regenera 3 de Vida e concede +1 de Essência extra.',
    ],
  },
  red_176_dancarino_plumas_brasa: {
    face: 'Ascensão 4: torna-se 5/4 e ganha a habilidade Renascer.',
    ascendedFace: 'Assaltante aéreo veloz com Alcance, Voo, Ímpeto, Pele Incandescente e Renascer.',
    detailed: [
      'Unidade de assalto aéreo veloz que evolui em campo por Ascensão, ganhando Renascer.',
    ],
  },
  red_177_arqueiro_solar_cinza_viva: {
    face: 'Ao entrar, causa 1 de dano à Vanguarda inimiga. Ao lançar feitiço, causa 2 de dano ignorando Armadura a 1 inimigo.',
    detailed: [
      'Ao entrar, causa 1 de dano às criaturas na Vanguarda inimiga — ou na Retaguarda, se você escolher um alvo de lá.',
      'Sempre que você lança um feitiço, causa 2 de dano ignorando Armadura a 1 inimigo na Vanguarda, ou na Retaguarda se a Vanguarda estiver vazia.',
    ],
  },
  red_178_kaelith_principe_asas_fenix: {
    face: 'Ao entrar ou ativar Renascer, causa 3 de dano à Vanguarda inimiga e dá +1 de Ataque aos outros aliados neste turno.',
    detailed: [
      'Ao entrar ou ativar Renascer, causa 3 de dano a todas as criaturas na Vanguarda inimiga e concede +1 de Ataque neste turno aos seus outros aliados.',
    ],
  },
  neutral_175_emissario_lamina_espelho: {
    face: 'Ao entrar, compra 1 carta se você controlar outro Elfo ou aliados de 2+ cores.',
    detailed: [
      'Possui 1 de Armadura: absorve ataques de até 1 e reduz em 1 os maiores.',
      'Ao entrar, compra 1 carta se você controlar outro Elfo ou aliados de pelo menos 2 cores distintas.',
    ],
  },
  neutral_176_mestre_arqueiro_guarda_cristalina: {
    face: 'Ao entrar, dá +1/+1 aos outros Elfos aliados; se houver 2 ou mais, ganha +1 de Ataque e Escudo Divino.',
    detailed: [
      'Ao entrar, concede +1/+1 permanente aos seus outros Elfos. Se você controlar 2 ou mais outros Elfos, ganha também +1 de Ataque e Escudo Divino.',
    ],
  },
  neutral_177_thalassion_alto_rei_concilio_elfico: {
    face: 'Ao entrar, dá +1/+1 aos seus Elfos e busca 1 Elfo do Grimório. Seus outros Elfos têm +1 de Armadura.',
    detailed: [
      'Possui 1 de Armadura: absorve ataques de até 1 e reduz em 1 os maiores.',
      'Ao entrar, concede +1/+1 permanente a todos os seus Elfos em campo e busca 1 Elfo do Grimório para a mão.',
      'Aura: enquanto Thalassion estiver em campo, seus outros Elfos têm +1 de Armadura.',
    ],
  },
  gold_179_leoric_grao_marechal_leao_solar: {
    face: 'Ao entrar, dá +1/+1, +1 de Armadura e Escudo Divino a todos os seus aliados.',
    detailed: [
      'Possui 3 de Armadura: absorve ataques de até 3 e reduz em 3 os maiores.',
      'Ao entrar, concede +1/+1 permanente, +1 de Armadura e Escudo Divino a todas as suas criaturas aliadas.',
    ],
  },
  gold_180_valerius_comandante_aguia_imperial: {
    face: 'Ao entrar, dá +1/+1 aos seus aliados e invoca 2 Guardas 2/2. No início do turno, cura 2 de Vida dos aliados.',
    detailed: [
      'Possui 2 de Armadura: absorve ataques de até 2 e reduz em 2 os maiores.',
      'Ao entrar, concede +1/+1 permanente aos seus aliados e invoca 2 Guardas Solares 2/2 na sua Vanguarda.',
      'No início do seu turno, restaura 2 de Vida de todas as suas criaturas aliadas e do seu Soberano.',
    ],
  },
  gold_181_wolfgang_marechal_escama_solar: {
    face: 'Ao entrar, dá +1/+1 aos seus aliados e causa 4 de dano a 1 inimigo. Ao atacar, causa 2 à Vanguarda inimiga.',
    detailed: [
      'Possui 2 de Armadura: absorve ataques de até 2 e reduz em 2 os maiores.',
      'Ao entrar, concede +1/+1 permanente aos seus aliados e causa 4 de dano a 1 criatura inimiga.',
      'Ao atacar, dispara uma onda solar que causa 2 de dano a todas as criaturas na Vanguarda inimiga.',
    ],
  },
  red_179_khorvus_tirano_mascara_auricrania: {
    face: 'Ao entrar, dá +1/+1 aos seus aliados e concede +2 de Ataque, +1 de Armadura e Ímpeto à sua Vanguarda.',
    detailed: [
      'Possui 1 de Armadura: absorve ataques de 1 e reduz em 1 os maiores.',
      'Ao entrar, concede +1/+1 permanente a todos os seus aliados e outorga +2 de Ataque, +1 de Armadura e Ímpeto às suas criaturas na Vanguarda.',
    ],
  },
  red_180_malakor_general_lamina_colossal: {
    face: 'Ao entrar, dá +1/+1 aos seus aliados e causa 4 de dano a 1 inimigo. Ao atacar, dá +1/+1 aos aliados.',
    detailed: [
      'Possui 2 de Armadura: absorve ataques de até 2 e reduz em 2 os maiores.',
      'Ao entrar, concede +1/+1 permanente aos seus aliados e causa 4 de dano a 1 criatura inimiga.',
      'Sempre que ataca, concede mais +1/+1 permanente a todas as suas criaturas aliadas.',
    ],
  },
  red_181_ignis_marechal_coroa_cinzas: {
    face: 'Ao entrar, dá +1/+1 aos seus aliados e causa 3 de dano à Vanguarda inimiga. Ao atacar, causa 3 ao Soberano.',
    detailed: [
      'Possui 2 de Armadura: absorve ataques de até 2 e reduz em 2 os maiores.',
      'Ao entrar, concede +1/+1 permanente aos seus aliados e causa 3 de dano a todas as criaturas na Vanguarda inimiga.',
      'Ao atacar, causa 3 de dano direto ao Soberano inimigo.',
    ],
  },
};

export function getAscensionBonusNote(cardId: string): string | null {
  return BESPOKE_RECENT_CARD_RULES[cardId]?.ascensionBonusNote ?? null;
}

/**
 * Generates a synthetic, parenthesis-free Portuguese sentence description that fits cleanly
 * inside the card's text box (.card-ability-desc) without mutating CardDefinition.
 */
export function formatCardFaceDescription(
  card: CardDefinition,
  activeKeywords: Keyword[] = card.keywords,
  isAscended = false
): string {
  const bespoke = BESPOKE_RECENT_CARD_RULES[card.id];
  if (bespoke) {
    return isAscended && bespoke.ascendedFace ? bespoke.ascendedFace : bespoke.face;
  }

  const sentences: string[] = [];
  const hasBreath = Boolean(card.breathDamage && card.breathDamage > 0);
  const onEnterEffects = (card.effects || []).filter((e) =>
    isImmediatePlayTrigger(card, e.trigger)
  );
  const otherEffects = (card.effects || []).filter(
    (e) => !isImmediatePlayTrigger(card, e.trigger)
  );

  if (hasBreath || onEnterEffects.length > 0) {
    const prefix = getTriggerPrefix(
      card,
      onEnterEffects[0]?.trigger ?? 'on_enter',
      false
    );
    const body = joinTriggerClauses(
      card,
      onEnterEffects,
      false,
      hasBreath ? card.breathDamage! : 0
    );
    if (body) {
      sentences.push(`${prefix}${body}.`);
    }
  }

  if (card.regeneration && card.regeneration > 0) {
    sentences.push(
      `No início do seu turno, regenera ${card.regeneration} de Vida.`
    );
  }

  if (otherEffects.length > 0) {
    const grouped = new Map<CardEffect['trigger'], CardEffect[]>();
    for (const eff of otherEffects) {
      const list = grouped.get(eff.trigger) ?? [];
      list.push(eff);
      grouped.set(eff.trigger, list);
    }

    for (const [trigger, effList] of grouped.entries()) {
      const prefix = getTriggerPrefix(card, trigger, false);
      const body = joinTriggerClauses(card, effList, false, 0);
      if (body) {
        sentences.push(`${prefix}${body}.`);
      }
    }
  }

  if (card.ascension && !isAscended) {
    sentences.push(
      `Ascensão ${card.ascension.cost}: evolui para ${card.ascension.newName} ${card.ascension.newAtk}/${card.ascension.newMaxHp}.`
    );
  }

  if (sentences.length > 0) {
    return sentences.join(' ');
  }

  return buildKeywordsCombatSentence(activeKeywords);
}

/**
 * Generates synthetic, parenthesis-free Portuguese sentences for the Inspect Modal
 * ("EFEITOS & HABILIDADES DE COMBATE").
 */
export function formatCardDetailedRules(card: CardDefinition): string[] {
  const bespoke = BESPOKE_RECENT_CARD_RULES[card.id];
  if (bespoke) {
    return bespoke.detailed;
  }

  const paragraphs: string[] = [];

  const passiveParts: string[] = [];
  if (card.type === 'relic') {
    passiveParts.push(
      `Relíquia Contínua na Retaguarda com ${card.hp} de Durabilidade`
    );
  }
  if (card.armor > 0) {
    passiveParts.push(
      `possui ${card.armor} de Armadura, absorvendo totalmente ataques de valor ${card.armor} ou menor e reduzindo em ${card.armor} os ataques maiores`
    );
  }
  if (card.regeneration && card.regeneration > 0) {
    passiveParts.push(
      `regenera ${card.regeneration} de Vida no início de cada um dos seus turnos`
    );
  }
  if (card.corruptionCost && card.corruptionCost > 0) {
    passiveParts.push(
      `adiciona +${card.corruptionCost} de Sobrecarga ao seu Soberano ao ser jogada`
    );
  }
  if (passiveParts.length > 0) {
    const text = passiveParts.join('; ');
    paragraphs.push(text.charAt(0).toUpperCase() + text.slice(1) + '.');
  }

  const hasBreath = Boolean(card.breathDamage && card.breathDamage > 0);
  const onEnterEffects = (card.effects || []).filter((e) =>
    isImmediatePlayTrigger(card, e.trigger)
  );
  const otherEffects = (card.effects || []).filter(
    (e) => !isImmediatePlayTrigger(card, e.trigger)
  );

  if (hasBreath || onEnterEffects.length > 0) {
    const prefix = getTriggerPrefix(
      card,
      onEnterEffects[0]?.trigger ?? 'on_enter',
      true
    );
    const body = joinTriggerClauses(
      card,
      onEnterEffects,
      true,
      hasBreath ? card.breathDamage! : 0
    );
    if (body) {
      paragraphs.push(`${prefix}${body}.`);
    }
  }

  if (otherEffects.length > 0) {
    const grouped = new Map<CardEffect['trigger'], CardEffect[]>();
    for (const eff of otherEffects) {
      const list = grouped.get(eff.trigger) ?? [];
      list.push(eff);
      grouped.set(eff.trigger, list);
    }

    for (const [trigger, effList] of grouped.entries()) {
      const prefix = getTriggerPrefix(card, trigger, true);
      const body = joinTriggerClauses(card, effList, true, 0);
      if (body) {
        paragraphs.push(`${prefix}${body}.`);
      }
    }
  }

  if (!hasBreath && (!card.effects || card.effects.length === 0)) {
    paragraphs.push(buildKeywordsCombatSentence(card.keywords));
  }

  return paragraphs;
}
