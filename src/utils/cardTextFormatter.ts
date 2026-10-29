import { CardDefinition, CardEffect, Keyword } from '../types/game';

const KEYWORD_COMBAT_CLAUSES: Record<Keyword, string> = {
  Guardião:
    'obriga inimigos terrestres na mesma Coluna a atacarem esta unidade primeiro',
  Voo: 'voa sobre defensores terrestres na Vanguarda',
  Alcance: 'ataca à distância da Retaguarda sem sofrer contra-ataque',
  Ímpeto: 'pode atacar criaturas inimigas no mesmo turno em que entra',
  Atropelar:
    'causa o dano excedente ao Soberano inimigo ao destruir um defensor',
  'Toque Letal':
    'destrói qualquer criatura que sofrer dano de Vida desta unidade',
  'Escudo Divino': 'anula o primeiro dano que sofreria',
  'Dreno de Vida':
    'restaura 2 de Vida do seu Soberano sempre que causa dano',
  Renascer: 'retorna uma vez ao campo com 1 de Vida ao morrer',
  'Pele Incandescente':
    'causa 1 de dano de fogo a quem a ataca corpo-a-corpo',
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

function getTriggerPrefix(
  card: CardDefinition,
  trigger: CardEffect['trigger']
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
    case 'spell_cast':
      return 'Ao entrar, ';
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
    (effect.trigger === 'on_enter' || effect.trigger === 'spell_cast') &&
    card.type !== 'reaction';

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
      return `causa ${v} de dano a todas as demais criaturas em campo`;
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
        return 'reanima da sua Cripta a sua criatura aliada mais forte';
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
      if (perm > 0) {
        return `concede +${v} de Essência neste turno e +${perm} de Essência máxima`;
      }
      return `concede +${v} de Essência extra neste turno`;
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
  // Clone effects list and fold breathDamage directly into damage_enemy_row on on_enter
  const effects: CardEffect[] = rawEffects.map((e) => ({ ...e }));
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

  // Merge heal_all_allies + heal_sovereign when both appear on the same trigger
  const healAllIdx = effects.findIndex((e) => e.type === 'heal_all_allies');
  const healSovIdx = effects.findIndex((e) => e.type === 'heal_sovereign');
  let mergedHealClause: string | null = null;
  if (healAllIdx !== -1 && healSovIdx !== -1) {
    const allVal = effects[healAllIdx].value;
    const sovVal = allVal + effects[healSovIdx].value;
    mergedHealClause = `restaura ${allVal} de Vida de todas as suas criaturas aliadas e ${sovVal} de Vida do seu Soberano`;
  }

  // Merge shield_all_allies (when all allies) + buff_all_allies on the same trigger
  const shieldAllIdx = effects.findIndex(
    (e) =>
      e.type === 'shield_all_allies' &&
      !(
        /a um aliado|a ele/i.test(
          `${e.description || ''} ${card.description || ''}`
        ) && e.value <= 1
      )
  );
  const buffAllIdx = effects.findIndex(
    (e) => e.type === 'buff_all_allies' && !/na Vanguarda/i.test(e.description || '')
  );
  const canMergeBuffAndShieldAll = shieldAllIdx !== -1 && buffAllIdx !== -1;

  // Merge damage_enemy_row + freeze_enemy_vanguard when both appear on the same trigger
  const rowDmgIdx = effects.findIndex((e) => e.type === 'damage_enemy_row');
  const freezeVanIdx = effects.findIndex((e) => e.type === 'freeze_enemy_vanguard');
  const canMergeRowDmgAndFreeze =
    rowDmgIdx !== -1 &&
    freezeVanIdx !== -1 &&
    !/todos os inimigos|até\s+\d+/i.test(
      `${effects[freezeVanIdx].description || ''} ${card.description || ''}`
    );

  // Merge damage_single_enemy + freeze_enemy when both appear on the same trigger
  const singleDmgIdx = effects.findIndex((e) => e.type === 'damage_single_enemy');
  const freezeSingleIdx = effects.findIndex((e) => e.type === 'freeze_enemy');
  const canMergeSingleDmgAndFreeze = singleDmgIdx !== -1 && freezeSingleIdx !== -1;

  const consumedIndices = new Set<number>();
  const clauses: string[] = [];

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
      continue;
    }

    if (canMergeRowDmgAndFreeze && (i === rowDmgIdx || i === freezeVanIdx)) {
      consumedIndices.add(rowDmgIdx);
      consumedIndices.add(freezeVanIdx);
      const dmgVal = effects[rowDmgIdx].value;
      clauses.push(
        `causa ${dmgVal} de dano a todas as criaturas na Vanguarda inimiga e as congela por 1 rodada`
      );
      continue;
    }

    if (canMergeSingleDmgAndFreeze && (i === singleDmgIdx || i === freezeSingleIdx)) {
      consumedIndices.add(singleDmgIdx);
      consumedIndices.add(freezeSingleIdx);
      const dmgEff = effects[singleDmgIdx];
      const canChoose =
        (dmgEff.trigger === 'on_enter' || dmgEff.trigger === 'spell_cast') &&
        card.type !== 'reaction';
      clauses.push(
        canChoose
          ? `causa ${dmgEff.value} de dano a 1 criatura inimiga à sua escolha e a congela por 1 rodada`
          : `causa ${dmgEff.value} de dano à criatura inimiga de maior Ataque e a congela por 1 rodada`
      );
      continue;
    }

    if (mergedHealClause && (i === healAllIdx || i === healSovIdx)) {
      consumedIndices.add(healAllIdx);
      consumedIndices.add(healSovIdx);
      clauses.push(mergedHealClause);
      continue;
    }

    consumedIndices.add(i);
    const c = formatEffectActionClause(card, effects[i], detailed);
    if (c) clauses.push(c);
  }

  if (clauses.length === 0) return '';
  if (clauses.length === 1) return clauses[0];
  return clauses.slice(0, -1).join(', ') + ' e ' + clauses[clauses.length - 1];
}

/**
 * Generates a synthetic, parenthesis-free Portuguese sentence description that fits cleanly
 * inside the card's text box (.card-ability-desc) without mutating CardDefinition.
 */
export function formatCardFaceDescription(
  card: CardDefinition,
  activeKeywords: Keyword[] = card.keywords
): string {
  const sentences: string[] = [];
  const hasBreath = Boolean(card.breathDamage && card.breathDamage > 0);
  const onEnterEffects = (card.effects || []).filter(
    (e) => e.trigger === 'on_enter' || e.trigger === 'spell_cast'
  );
  const otherEffects = (card.effects || []).filter(
    (e) => e.trigger !== 'on_enter' && e.trigger !== 'spell_cast'
  );

  if (hasBreath || onEnterEffects.length > 0) {
    const prefix = getTriggerPrefix(
      card,
      onEnterEffects[0]?.trigger ?? 'on_enter'
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
      const prefix = getTriggerPrefix(card, trigger);
      const body = joinTriggerClauses(card, effList, false, 0);
      if (body) {
        sentences.push(`${prefix}${body}.`);
      }
    }
  }

  if (card.ascension) {
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
  const paragraphs: string[] = [];

  const passiveParts: string[] = [];
  if (card.type === 'relic') {
    passiveParts.push(
      `Relíquia Contínua na Retaguarda com ${card.hp} de Durabilidade`
    );
  }
  if (card.armor > 0) {
    passiveParts.push(
      `possui ${card.armor} de Armadura, reduzindo em ${card.armor} o dano sofrido em combate`
    );
  }
  if (card.regeneration && card.regeneration > 0) {
    passiveParts.push(
      `regenera ${card.regeneration} de Vida no início de cada um dos seus turnos`
    );
  }
  if (card.corruptionCost && card.corruptionCost > 0) {
    passiveParts.push(
      `adiciona +${card.corruptionCost} de Corrupção ao seu Soberano ao ser jogada`
    );
  }
  if (passiveParts.length > 0) {
    const text = passiveParts.join('; ');
    paragraphs.push(text.charAt(0).toUpperCase() + text.slice(1) + '.');
  }

  const hasBreath = Boolean(card.breathDamage && card.breathDamage > 0);
  const onEnterEffects = (card.effects || []).filter(
    (e) => e.trigger === 'on_enter' || e.trigger === 'spell_cast'
  );
  const otherEffects = (card.effects || []).filter(
    (e) => e.trigger !== 'on_enter' && e.trigger !== 'spell_cast'
  );

  if (hasBreath || onEnterEffects.length > 0) {
    const prefix = getTriggerPrefix(
      card,
      onEnterEffects[0]?.trigger ?? 'on_enter'
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
      const prefix = getTriggerPrefix(card, trigger);
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
