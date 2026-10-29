import { CardDefinition, CardEffect, Keyword } from '../types/game';

function formatStatBonus(atkGain: number, hpGain: number): string {
  if (atkGain > 0 && hpGain > 0) {
    return `+${atkGain} de Ataque e +${hpGain} de Vida`;
  }
  if (atkGain > 0) {
    return `+${atkGain} de Ataque`;
  }
  if (hpGain > 0) {
    return `+${hpGain} de Vida`;
  }
  return '+1 de Ataque e +1 de Vida';
}

function getTriggerPrefix(
  card: CardDefinition,
  trigger: CardEffect['trigger'],
  detailed: boolean
): string {
  if (card.type === 'spell') {
    if (trigger === 'on_enter' || trigger === 'spell_cast') {
      return detailed ? 'Ao lançar este feitiço, ' : 'Ao lançar, ';
    }
  }
  if (card.type === 'reaction') {
    if (trigger === 'on_enter' || trigger === 'spell_cast') {
      return detailed
        ? 'Ao ser acionada (lançada da mão ou ativada como Emboscada na Retaguarda), '
        : 'Quando acionada, ';
    }
  }
  switch (trigger) {
    case 'on_enter':
    case 'spell_cast':
      return 'Ao entrar em campo, ';
    case 'on_death':
      return card.type === 'relic' ? 'Ao ser destruída, ' : 'Ao morrer, ';
    case 'on_attack':
      return 'Sempre que ataca, ';
    case 'turn_start':
      return detailed
        ? 'No início de cada um dos seus turnos, '
        : 'No início do seu turno, ';
    case 'turn_end':
      return detailed
        ? 'No final de cada um dos seus turnos, '
        : 'No final do seu turno, ';
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
    (effect.trigger === 'on_enter' || effect.trigger === 'spell_cast') &&
    card.type !== 'reaction';
  const isReactionPlay =
    (effect.trigger === 'on_enter' || effect.trigger === 'spell_cast') &&
    card.type === 'reaction';

  switch (effect.type) {
    case 'damage_enemy_row': {
      if (!detailed) {
        return `causa ${v} de dano a todas as criaturas inimigas na Vanguarda (ou na Retaguarda, se a Vanguarda estiver vazia)`;
      }
      if (canChoose) {
        return `causa ${v} de dano a todas as criaturas inimigas de uma fileira — atinge a Vanguarda inimiga por padrão (ou a Retaguarda, se a Vanguarda estiver vazia), mas você também pode clicar em uma criatura inimiga específica ao jogar a carta para atingir toda a fileira dela (não causa dano ao Soberano)`;
      }
      return `causa ${v} de dano a todas as criaturas inimigas na Vanguarda (ou na Retaguarda, caso a Vanguarda esteja vazia; não causa dano ao Soberano)`;
    }

    case 'damage_single_enemy': {
      if (!detailed) {
        if (canChoose) {
          return `causa ${v} de dano a 1 criatura inimiga à sua escolha (se não escolher, atinge a de maior Ataque; se não houver criaturas inimigas, atinge o Soberano inimigo)`;
        }
        return `causa ${v} de dano à criatura inimiga de maior Ataque (ou ao Soberano inimigo, se não houver criaturas inimigas em campo)`;
      }
      if (canChoose) {
        return `causa ${v} de dano a 1 criatura inimiga que você escolher em campo (se você não selecionar um alvo ao jogar a carta, ela atinge automaticamente a criatura inimiga de maior Ataque; caso não exista nenhuma criatura inimiga em campo, o dano é causado diretamente ao Soberano inimigo)`;
      }
      if (isReactionPlay) {
        return `causa ${v} de dano a 1 criatura inimiga (se lançada da mão, você pode escolher o alvo; se ativada como Emboscada ou sem alvo selecionado, atinge automaticamente a criatura inimiga de maior Ataque, ou o Soberano inimigo caso não haja criaturas inimigas em campo)`;
      }
      return `causa ${v} de dano automaticamente à criatura inimiga de maior Ataque em campo (ou diretamente ao Soberano inimigo, caso não haja criaturas inimigas em campo)`;
    }

    case 'damage_all_units': {
      if (!detailed) {
        return `causa ${v} de dano a todas as demais criaturas em campo, tanto aliadas quanto inimigas (não atinge os Soberanos)`;
      }
      return `causa ${v} de dano a todas as demais criaturas presentes no campo de batalha, atingindo tanto unidades aliadas quanto inimigas (não causa dano aos Soberanos)`;
    }

    case 'damage_enemy_sovereign': {
      if (!detailed) {
        return `causa ${v} de dano diretamente ao Soberano inimigo`;
      }
      return `causa ${v} de dano diretamente ao Soberano inimigo, ignorando quaisquer criaturas no campo de batalha`;
    }

    case 'heal_sovereign': {
      return `restaura ${v} de Vida diretamente no seu Soberano`;
    }

    case 'heal_all_allies': {
      if (!detailed) {
        return `restaura ${v} de Vida em todas as suas criaturas aliadas em campo e no seu Soberano`;
      }
      return `restaura ${v} de Vida em todas as suas criaturas aliadas presentes em campo e também no seu Soberano`;
    }

    case 'heal_target_ally': {
      if (!detailed) {
        if (canChoose) {
          return `restaura ${v} de Vida em 1 criatura aliada ferida à sua escolha (se não escolher, cura a mais ferida; se nenhuma estiver ferida, cura o seu Soberano)`;
        }
        return `restaura ${v} de Vida na sua criatura aliada mais ferida (ou no seu Soberano, se nenhuma criatura aliada estiver ferida)`;
      }
      if (canChoose) {
        return `restaura ${v} de Vida em 1 criatura aliada ferida que você escolher em campo (se você não selecionar um alvo, cura automaticamente a criatura aliada mais ferida; caso nenhuma criatura aliada esteja ferida, restaura essa Vida diretamente no seu Soberano)`;
      }
      return `restaura ${v} de Vida automaticamente na sua criatura aliada mais ferida em campo (ou diretamente no seu Soberano, caso nenhuma criatura aliada esteja ferida)`;
    }

    case 'draw_cards': {
      if (!detailed) {
        return `compra ${v} ${v === 1 ? 'carta' : 'cartas'} do seu Grimório`;
      }
      return `você compra ${v} ${v === 1 ? 'carta' : 'cartas'} do seu Grimório para a sua mão`;
    }

    case 'freeze_enemy': {
      const preferVanguard = /Vanguarda/i.test(
        `${effect.description || ''} ${card.description || ''}`
      );
      if (!detailed) {
        if (canChoose) {
          return `congela 1 criatura inimiga à sua escolha por 1 rodada (se não escolher, congela a de maior Ataque${preferVanguard ? ' na Vanguarda' : ''})`;
        }
        return `congela automaticamente a criatura inimiga de maior Ataque${preferVanguard ? ' na Vanguarda' : ''} por 1 rodada`;
      }
      if (canChoose) {
        return `congela 1 criatura inimiga que você escolher em campo por 1 rodada, impedindo-a de atacar no próximo turno (se você não selecionar um alvo, congela automaticamente a criatura inimiga não congelada de maior Ataque${preferVanguard ? ', priorizando a Vanguarda' : ''})`;
      }
      if (isReactionPlay) {
        return `congela 1 criatura inimiga por 1 rodada, impedindo-a de atacar no próximo turno (se lançada da mão, você pode escolher o alvo; se ativada como Emboscada, congela automaticamente a criatura inimiga de maior Ataque)`;
      }
      return `congela automaticamente a criatura inimiga não congelada de maior Ataque${preferVanguard ? ' (priorizando a Vanguarda)' : ''} por 1 rodada, impedindo-a de atacar no próximo turno`;
    }

    case 'freeze_enemy_vanguard': {
      const combinedDesc = `${effect.description || ''} ${card.description || ''}`;
      const freezeAllBoard = /todos os inimigos/i.test(combinedDesc);
      const limitMatch = combinedDesc.match(/até\s+(\d+)/i);
      const maxTargets = limitMatch ? parseInt(limitMatch[1], 10) : null;

      if (freezeAllBoard) {
        return detailed
          ? 'congela todas as criaturas inimigas em campo (tanto na Vanguarda quanto na Retaguarda) por 1 rodada, impedindo-as de atacar no próximo turno'
          : 'congela todas as criaturas inimigas em campo (Vanguarda e Retaguarda) por 1 rodada';
      }
      if (maxTargets && maxTargets > 0) {
        return detailed
          ? `congela automaticamente até ${maxTargets} criaturas inimigas na Vanguarda (ou na Retaguarda, caso a Vanguarda esteja vazia) por 1 rodada, impedindo-as de atacar no próximo turno`
          : `congela até ${maxTargets} criaturas inimigas na Vanguarda (ou na Retaguarda, se a Vanguarda estiver vazia) por 1 rodada`;
      }
      return detailed
        ? 'congela todas as criaturas inimigas na Vanguarda por 1 rodada (ou na Retaguarda, caso a Vanguarda esteja vazia), impedindo-as de atacar no próximo turno'
        : 'congela todas as criaturas inimigas na Vanguarda por 1 rodada';
    }

    case 'bounce_enemy': {
      if (!detailed) {
        if (canChoose) {
          return 'devolve 1 criatura inimiga à sua escolha do campo para a mão do oponente (se não escolher, devolve a de maior custo e Ataque)';
        }
        return 'devolve automaticamente a criatura inimiga de maior custo e Ataque para a mão do oponente';
      }
      if (canChoose) {
        return 'devolve 1 criatura inimiga que você escolher do campo para a mão do oponente (se você não selecionar um alvo, devolve automaticamente a criatura inimiga de maior custo e Ataque; se a mão do oponente estiver cheia com 10 cartas, a criatura é destruída)';
      }
      return 'devolve automaticamente a criatura inimiga de maior custo e Ataque do campo para a mão do oponente (se a mão do oponente estiver cheia com 10 cartas, a criatura é destruída)';
    }

    case 'destroy_enemy': {
      if (!detailed) {
        if (canChoose) {
          return 'destrói imediatamente 1 criatura inimiga à sua escolha, ignorando Escudo Divino e Armadura (se não escolher, destrói a mais forte)';
        }
        return 'destrói imediatamente a criatura inimiga mais forte em campo, ignorando Escudo Divino e Armadura';
      }
      if (canChoose) {
        return 'destrói imediatamente 1 criatura inimiga que você escolher em campo, ignorando Escudo Divino e Armadura (se você não selecionar um alvo, destrói automaticamente a criatura inimiga com a maior soma de Ataque e Vida)';
      }
      if (isReactionPlay) {
        return 'destrói imediatamente 1 criatura inimiga, ignorando Escudo Divino e Armadura (se lançada da mão, você pode escolher o alvo; se ativada como Emboscada, destrói automaticamente a criatura inimiga mais forte)';
      }
      return 'destrói imediatamente a criatura inimiga mais forte em campo (maior soma de Ataque e Vida), ignorando Escudo Divino e Armadura';
    }

    case 'revive_from_crypt': {
      if (v >= 5) {
        return detailed
          ? `reanima automaticamente da sua Cripta (cemitério) a criatura aliada mais forte com custo de Essência de até ${v}, colocando-a diretamente em campo`
          : `reanima da sua Cripta para o campo a criatura aliada mais forte de custo até ${v}`;
      }
      if (v <= 1) {
        return detailed
          ? 'reanima automaticamente da sua Cripta (cemitério) a criatura aliada mais forte que já foi destruída, colocando-a diretamente em campo'
          : 'reanima da sua Cripta para o campo a sua criatura aliada mais forte já destruída';
      }
      return detailed
        ? `reanima automaticamente da sua Cripta (cemitério) as ${v} criaturas aliadas mais fortes que já foram destruídas, colocando-as diretamente em campo`
        : `reanima da sua Cripta para o campo as ${v} criaturas aliadas mais fortes já destruídas`;
    }

    case 'buff_target_ally': {
      const atkGain = v;
      const hpGain = effect.secondaryValue !== undefined ? effect.secondaryValue : v;
      const statBonus = formatStatBonus(atkGain, hpGain);
      const preferVanguard = /Vanguarda/i.test(
        `${effect.description || ''} ${card.description || ''}`
      );
      if (!detailed) {
        if (canChoose) {
          return `concede permanentemente ${statBonus} a 1 criatura aliada à sua escolha (se não escolher, fortalece a mais forte)`;
        }
        return `concede permanentemente ${statBonus} à sua criatura aliada mais forte${preferVanguard ? ' na Vanguarda' : ''}`;
      }
      if (canChoose) {
        return `concede permanentemente ${statBonus} a 1 criatura aliada que você escolher em campo (se você não selecionar um alvo, fortalece automaticamente a sua criatura aliada mais forte disponível${preferVanguard ? ', priorizando a Vanguarda' : ''})`;
      }
      return `concede permanentemente ${statBonus} automaticamente à sua criatura aliada mais forte em campo${preferVanguard ? ' (priorizando a Vanguarda)' : ''}`;
    }

    case 'buff_all_allies': {
      const atkGain = v;
      const hpGain = effect.secondaryValue !== undefined ? effect.secondaryValue : v;
      const statBonus = formatStatBonus(atkGain, hpGain);
      const onlyVanguard = /na Vanguarda/i.test(effect.description || '');
      if (!detailed) {
        return `concede permanentemente ${statBonus} a todas as suas criaturas aliadas ${onlyVanguard ? 'na Vanguarda' : 'em campo'}`;
      }
      return `concede permanentemente ${statBonus} a todas as suas criaturas aliadas presentes ${onlyVanguard ? 'na Vanguarda' : 'no campo de batalha (Vanguarda e Retaguarda)'}`;
    }

    case 'debuff_enemy_vanguard_atk': {
      if (!detailed) {
        return `reduz permanentemente em -${v} o Ataque de todas as criaturas inimigas em campo`;
      }
      return `reduz permanentemente em -${v} o Ataque de todas as criaturas inimigas presentes em campo (até o mínimo de 0 de Ataque)`;
    }

    case 'grant_bonus_essence': {
      const perm = effect.secondaryValue ?? 0;
      if (perm > 0) {
        return detailed
          ? `concede +${v} de Essência extra neste turno e aumenta permanentemente a sua Essência máxima em +${perm}`
          : `concede +${v} de Essência neste turno e +${perm} de Essência máxima permanente`;
      }
      return detailed
        ? `concede +${v} de Essência temporária extra para o seu Soberano utilizar ainda neste turno`
        : `concede +${v} de Essência extra para você usar neste turno`;
    }

    case 'summon_token': {
      const hasExplicitHp =
        effect.secondaryValue !== undefined && effect.secondaryValue > 0;
      const tokenCount = hasExplicitHp ? 1 : v <= 2 ? Math.max(1, v) : 1;
      const atk = v;
      const hp = hasExplicitHp ? effect.secondaryValue! : v;
      if (!detailed) {
        return `invoca ${tokenCount} ${tokenCount === 1 ? 'criatura aliada' : 'criaturas aliadas'} (${atk} de Ataque / ${hp} de Vida) na sua Vanguarda`;
      }
      return `invoca automaticamente ${tokenCount} ${tokenCount === 1 ? 'criatura aliada' : 'criaturas aliadas'} com ${atk} de Ataque e ${hp} de Vida na sua Vanguarda (ou na Retaguarda, caso a Vanguarda esteja cheia)`;
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
            ? `concede Escudo Divino${armorClause} a 1 criatura aliada à sua escolha (se não escolher, protege a mais forte sem escudo)`
            : `concede Escudo Divino${armorClause} automaticamente à sua criatura aliada mais forte sem escudo`;
        }
        return canChoose
          ? `concede Escudo Divino${armorClause} a 1 criatura aliada que você escolher em campo, anulando o próximo dano que ela sofreria (se não selecionar um alvo, protege automaticamente a sua criatura aliada mais forte que ainda não possua Escudo Divino)`
          : `concede Escudo Divino${armorClause} automaticamente à sua criatura aliada mais forte que ainda não possua Escudo Divino, anulando o próximo dano que ela sofreria`;
      }

      if (!detailed) {
        return `concede Escudo Divino${armorClause} a todas as suas criaturas aliadas em campo`;
      }
      return `concede Escudo Divino${armorClause} a todas as suas criaturas aliadas presentes em campo, fazendo com que cada uma anule completamente a primeira instância de dano que sofreria`;
    }

    case 'steal_small_enemy': {
      const maxAtk = v > 0 ? v : 3;
      if (!detailed) {
        return canChoose
          ? `toma o controle permanente de 1 criatura inimiga com Ataque atual de até ${maxAtk} à sua escolha (se não escolher, captura a mais forte elegível)`
          : `toma o controle permanente da criatura inimiga mais forte com Ataque atual de até ${maxAtk}`;
      }
      return canChoose
        ? `toma o controle permanente de 1 criatura inimiga com Ataque atual de até ${maxAtk} que você escolher em campo, trazendo-a para o seu lado do tabuleiro (se não selecionar um alvo, captura automaticamente a criatura inimiga mais forte dentro desse limite de Ataque)`
        : `toma o controle permanente da criatura inimiga mais forte com Ataque atual de até ${maxAtk}, trazendo-a para o seu lado do tabuleiro`;
    }

    default:
      return effect.description || '';
  }
}

function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Generates a concise, natural Portuguese sentence description for the card face (.card-ability-desc)
 * directly from the underlying card parameters without mutating CardDefinition.
 */
export function formatCardFaceDescription(
  card: CardDefinition,
  activeKeywords: Keyword[] = card.keywords
): string {
  const sentences: string[] = [];

  if (card.breathDamage && card.breathDamage > 0) {
    sentences.push(
      `Ao entrar em campo, seu Sopro Elemental causa ${card.breathDamage} de dano a todas as criaturas inimigas na Vanguarda (ou na Retaguarda, se a Vanguarda estiver vazia).`
    );
  }

  if (card.regeneration && card.regeneration > 0) {
    sentences.push(
      `No início do seu turno, regenera ${card.regeneration} de Vida.`
    );
  }

  if (card.effects && card.effects.length > 0) {
    // Group effects by trigger in order of appearance
    const grouped = new Map<CardEffect['trigger'], string[]>();
    for (const eff of card.effects) {
      const clause = formatEffectActionClause(card, eff, false);
      if (!clause) continue;
      const list = grouped.get(eff.trigger) ?? [];
      list.push(clause);
      grouped.set(eff.trigger, list);
    }

    for (const [trigger, clauses] of grouped.entries()) {
      const prefix = getTriggerPrefix(card, trigger, false);
      if (clauses.length === 1) {
        sentences.push(`${prefix}${clauses[0]}.`);
      } else {
        const joined =
          clauses.slice(0, -1).join(', ') +
          ' e também ' +
          clauses[clauses.length - 1];
        sentences.push(`${prefix}${joined}.`);
      }
    }
  }

  if (card.ascension) {
    sentences.push(
      `Ascensão (${card.ascension.cost} Essência): evolui em campo para ${card.ascension.newName} (${card.ascension.newAtk} ATQ / ${card.ascension.newArmor} ARM / ${card.ascension.newMaxHp} VIDA).`
    );
  }

  if (sentences.length > 0) {
    return sentences.join(' ');
  }

  // Fallback for vanilla / keyword-only creatures: strip redundant keyword prefixes and return a natural combat sentence
  let fallback = card.description || '';
  activeKeywords.forEach((kw) => {
    const regex = new RegExp(`^${kw}\\s*(,|\\.|•)\\s*`, 'i');
    fallback = fallback.replace(regex, '');
  });
  activeKeywords.forEach((kw) => {
    const regex = new RegExp(`^${kw}\\s*(,|\\.|•)\\s*`, 'i');
    fallback = fallback.replace(regex, '');
  });
  fallback = fallback.replace(/^Armadura\s+\d+\.\s*/i, '').trim();

  if (fallback) {
    return capitalizeFirst(fallback);
  }

  if (activeKeywords.length > 0) {
    return `Unidade de combate equipada com ${activeKeywords.join(', ')}.`;
  }

  return card.description || 'Unidade de combate tático.';
}

/**
 * Generates full, explicit, natural-language sentences in Portuguese for the Inspect view and Modal
 * ("EFEITOS & HABILIDADES DE COMBATE"), explaining every passive trait, trigger, target type, and target selection rule.
 */
export function formatCardDetailedRules(card: CardDefinition): string[] {
  const paragraphs: string[] = [];

  // 1. Passive combat traits summary (Armor, Regeneration, Relic durability, Corruption)
  const passiveParts: string[] = [];
  if (card.type === 'relic') {
    passiveParts.push(
      `Relíquia Contínua posicionada na Retaguarda com ${card.hp} de Durabilidade (Vida)`
    );
  }
  if (card.armor > 0) {
    passiveParts.push(
      `possui ${card.armor} de Armadura (reduz em ${card.armor} o dano sofrido a cada golpe em combate)`
    );
  }
  if (card.regeneration && card.regeneration > 0) {
    passiveParts.push(
      `regenera automaticamente ${card.regeneration} de Vida no início de cada um dos seus turnos`
    );
  }
  if (card.corruptionCost && card.corruptionCost > 0) {
    passiveParts.push(
      `ao ser jogada, adiciona +${card.corruptionCost} de Corrupção ao seu Soberano`
    );
  }
  if (passiveParts.length > 0) {
    paragraphs.push(capitalizeFirst(passiveParts.join('; ')) + '.');
  }

  // 2. Elemental Breath (if present)
  if (card.breathDamage && card.breathDamage > 0) {
    paragraphs.push(
      `Sopro Elemental (${card.breathDamage} de dano): Ao entrar em campo, varre automaticamente a Vanguarda inimiga (ou a Retaguarda inimiga, caso a Vanguarda esteja vazia), causando ${card.breathDamage} de dano a todas as criaturas inimigas daquela fileira.`
    );
  }

  // 3. Triggered effects
  if (card.effects && card.effects.length > 0) {
    const grouped = new Map<CardEffect['trigger'], string[]>();
    for (const eff of card.effects) {
      const clause = formatEffectActionClause(card, eff, true);
      if (!clause) continue;
      const list = grouped.get(eff.trigger) ?? [];
      list.push(clause);
      grouped.set(eff.trigger, list);
    }

    for (const [trigger, clauses] of grouped.entries()) {
      const prefix = getTriggerPrefix(card, trigger, true);
      clauses.forEach((clause, idx) => {
        if (idx === 0) {
          paragraphs.push(`${prefix}${clause}.`);
        } else {
          paragraphs.push(`Além disso, no mesmo momento, ${clause}.`);
        }
      });
    }
  }

  // 4. Fallback if the card has no effects, breath, or passive parts
  if (paragraphs.length === 0) {
    paragraphs.push(formatCardFaceDescription(card, card.keywords));
  }

  return paragraphs;
}
