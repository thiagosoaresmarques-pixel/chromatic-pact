import { AiSkillTier, Domain } from '../types/game';
import type { UnifiedChampionId } from './aiUnifiedTournamentData';
import { CARDS_BY_ID } from './cards';
import { LEGENDARY_CREATURE_BIOGRAPHIES } from './legendaryCreaturesLore';

/**
 * Vínculo Canônico 1-para-1 entre cada um dos 44 Arquétipos Campeões (Tier V)
 * e sua própria Carta Lendária de Criatura exclusiva (presente em seu tierDecks[5]).
 * Garante zero duplicidade de avatarCardId e imagePath em todo o Ranking Geral,
 * Oráculo de Guerra e Crisol dos Cinco Selos.
 */
export const CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE: Record<UnifiedChampionId, string> = {
  tri_red_blue_gold: 'gold_173_general_roda_sol',
  dual_red_neutral: 'red_173_general_roda_chama',
  tri_red_purple_green: 'purple_138_soberano_carnica',
  tri_red_purple_gold: 'red_119_soberano_piroclasma',
  dual_red_gold: 'red_100_dragao_vulcanico_anciao',
  dual_green_neutral: 'neutral_54_dragao_etereo',
  tri_purple_green_gold: 'gold_138_imperador_sol_supremo',
  penta_prismatic_crater: 'neutral_167_arauto_prisma_matriz',
  dual_red_green: 'red_46_tirano_carmesim',
  tri_red_blue_green: 'red_47_arquiduque_ferro',
  dual_blue_green: 'blue_173_general_roda_gelo',
  tri_red_green_gold: 'green_67_tiranossauro_alfa',
  dual_blue_gold: 'gold_157_dragao_soberano_alvorada',
  dual_gold_neutral: 'neutral_118_volothamp_cronista_mundos',
  penta_wheel_convergence: 'neutral_173_general_roda_matriz',
  dual_purple_gold: 'purple_173_general_roda_abismo',
  penta_free_city_sovereign: 'neutral_10_valkyra_pentacromatica',
  tri_blue_green_gold: 'gold_100_dragao_imperial_ouro',
  dual_blue_neutral: 'blue_81_arconte_cronos',
  tri_blue_purple_gold: 'blue_97_draco_relampago',
  dual_green_gold: 'green_50_avatar_gaia',
  dual_red_blue: 'red_99_senhor_balor_fogo',
  dual_red_purple: 'purple_23_dracolich',
  dual_purple_green: 'green_49_dragao_esmeralda',
  dual_blue_purple: 'blue_80_senhor_tempo',
  tri_red_blue_purple: 'blue_98_soberano_mares',
  tri_blue_purple_green: 'purple_83_arquidemonio_tempo',
  mono_red_blitz: 'red_157_dragao_tiamat_carmesim',
  mono_blue_chrono: 'blue_45_oraculo_abissal',
  mono_blue_frost: 'blue_136_leviata_cronos',
  dual_purple_neutral: 'purple_47_avatar_escuridao',
  mono_neutral_axial: 'neutral_117_elminster_sabio_cinzento',
  mono_gold_phalanx: 'gold_83_forjado_ancestral',
  mono_gold_celestial: 'gold_99_serafim_coroado',
  mono_red_dragon: 'red_08_dragao_vermelho',
  mono_green_swarm: 'green_141_soberano_fera_primordial',
  mono_purple_umbral: 'purple_65_principe_mortos',
  mono_purple_crypt: 'purple_99_lorde_vampiro_anciao',
  mono_gold_judgment: 'gold_119_soberano_ordem_eterna',
  mono_blue_abyssal: 'blue_06_dragao_azul',
  mono_green_colossus: 'green_173_general_roda_selva',
  mono_red_pyroclasm: 'red_138_colosso_vulcano_primordial',
  mono_purple_blood: 'purple_46_noiva_vampira',
  mono_green_roots: 'green_86_tarrasque_desperto',
};

export const REALM_ORIGIN_BY_ARCHETYPE: Record<UnifiedChampionId, string> = {
  mono_green_swarm: 'Veridia',
  mono_green_colossus: 'Veridia',
  mono_green_roots: 'Veridia',
  mono_red_blitz: 'Pyros',
  mono_red_pyroclasm: 'Pyros',
  mono_red_dragon: 'Pyros',
  mono_blue_frost: 'Vórtex',
  mono_blue_chrono: 'Vórtex',
  mono_blue_abyssal: 'Vórtex',
  mono_purple_crypt: 'Eclipse',
  mono_purple_blood: 'Eclipse',
  mono_purple_umbral: 'Eclipse',
  mono_gold_phalanx: 'Solária',
  mono_gold_celestial: 'Solária',
  mono_gold_judgment: 'Solária',
  mono_neutral_axial: 'Cidade Franca Axial',
  dual_red_gold: 'Aliança Pyros-Solária',
  dual_blue_purple: 'Aliança Vórtex-Eclipse',
  dual_red_green: 'Aliança Pyros-Veridia',
  dual_blue_gold: 'Aliança Vórtex-Solária',
  dual_purple_green: 'Aliança Eclipse-Veridia',
  dual_red_purple: 'Aliança Pyros-Eclipse',
  dual_blue_green: 'Aliança Vórtex-Veridia',
  dual_green_gold: 'Aliança Veridia-Solária',
  dual_purple_gold: 'Aliança Eclipse-Solária',
  dual_red_blue: 'Aliança Pyros-Vórtex',
  dual_green_neutral: 'Pacto Veridia-Axial',
  dual_red_neutral: 'Pacto Pyros-Axial',
  dual_blue_neutral: 'Pacto Vórtex-Axial',
  dual_purple_neutral: 'Pacto Eclipse-Axial',
  dual_gold_neutral: 'Pacto Solária-Axial',
  tri_red_blue_purple: 'Tríade Pyros-Vórtex-Eclipse',
  tri_red_green_gold: 'Tríade Pyros-Veridia-Solária',
  tri_blue_purple_gold: 'Tríade Vórtex-Eclipse-Solária',
  tri_red_purple_green: 'Tríade Pyros-Eclipse-Veridia',
  tri_blue_green_gold: 'Tríade Vórtex-Veridia-Solária',
  tri_blue_purple_green: 'Tríade Vórtex-Eclipse-Veridia',
  tri_red_purple_gold: 'Tríade Pyros-Eclipse-Solária',
  tri_purple_green_gold: 'Tríade Eclipse-Veridia-Solária',
  tri_red_blue_green: 'Tríade Pyros-Vórtex-Veridia',
  tri_red_blue_gold: 'Tríade Pyros-Vórtex-Solária',
  penta_prismatic_crater: 'Cratera Prismática',
  penta_free_city_sovereign: 'Cidade Franca Axial',
  penta_wheel_convergence: 'Ápice da Roda',
};

const COMMANDER_TIER_ROLE_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Sentinela de Fronteira (Tier I)',
  2: 'Capitão Regular da Ordem (Tier II)',
  3: 'Comandante Regional (Tier III)',
  4: 'Arconte Tático do Conselho (Tier IV)',
};

const HEROIC_CREATURE_REGEX =
  /\b(General|Arconte|Soberano|Monarca|Senhor|Rei|Rainha|Conde|Lorde|Príncipe|Jarl|Khan|Arquimago|Justicar|Paladino|Arcanjo|Dragão|Draco|Leviatã|Esfinge|Fênix|Ceifador|Inquisidor|Arcanista|Clérigo|Gladiador|Berserker|Oráculo|Guardião|Sentinela|Titã|Behemoth|Colosso)\b/i;

const BEAST_PENALTY_REGEX =
  /\b(Papo-Negro|Mímico|Sapo|Fogo-Fátuo|Zumbi|Pixie|Sabujo|Mastim|Operário)\b/i;

/**
 * Resolve a identidade canônica de um Grão-Soberano (Tier V) diretamente a partir
 * da sua própria Carta Lendária de Criatura em ALL_CARDS + LEGENDARY_CREATURE_BIOGRAPHIES.
 */
export function resolveCanonicalGrandSovereignIdentity(
  archetypeId: UnifiedChampionId,
  deckCardIdsTier5?: string[]
): {
  avatarCardId: string;
  sovereignName: string;
  sovereignTitle: string;
  realmOrigin: string;
} {
  let avatarCardId = CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE[archetypeId];
  if (
    deckCardIdsTier5 &&
    deckCardIdsTier5.length > 0 &&
    !deckCardIdsTier5.includes(avatarCardId)
  ) {
    const fallbackLeg = deckCardIdsTier5.find(
      (cid) => CARDS_BY_ID[cid]?.type === 'creature' && CARDS_BY_ID[cid]?.rarity === 'legendary'
    );
    if (fallbackLeg) avatarCardId = fallbackLeg;
  }

  const card = CARDS_BY_ID[avatarCardId];
  const bio = LEGENDARY_CREATURE_BIOGRAPHIES[avatarCardId];
  const realmOrigin = REALM_ORIGIN_BY_ARCHETYPE[archetypeId] ?? 'Vaeloria';
  const sovereignName = bio?.properTitle ?? card?.name ?? avatarCardId;
  const seatLabel = bio?.locationLabel ?? realmOrigin;

  return {
    avatarCardId,
    sovereignName,
    sovereignTitle: `Grão-Soberano • ${seatLabel}`,
    realmOrigin,
  };
}

/**
 * Seleciona uma Criatura 100% exclusiva do grimório real de um Comandante Regional (Tier I–IV),
 * disjunta de todos os 44 Grão-Soberanos e dos demais Comandantes já alocados.
 */
export function resolveUniqueRegionalCommanderIdentity(params: {
  archetypeId: UnifiedChampionId;
  skillTier: 1 | 2 | 3 | 4;
  domains: Domain[];
  deckCardIds: string[];
  usedCardIds: Set<string>;
}): {
  avatarCardId: string;
  sovereignName: string;
  sovereignTitle: string;
  realmOrigin: string;
} {
  const { archetypeId, skillTier, domains, deckCardIds, usedCardIds } = params;
  const rarityScore = (r: string) =>
    r === 'legendary' ? 4 : r === 'rare' ? 3 : r === 'uncommon' ? 2 : 1;
  const targetRarity =
    skillTier === 4 ? 3.2 : skillTier === 3 ? 3.0 : skillTier === 2 ? 2.4 : 2.0;

  let candidates = Array.from(
    new Set(deckCardIds.filter((id) => CARDS_BY_ID[id]?.type === 'creature' && !usedCardIds.has(id)))
  );

  if (candidates.length === 0) {
    // Fallback global para qualquer criatura do mesmo domínio ainda não utilizada
    candidates = Object.keys(CARDS_BY_ID).filter((id) => {
      const c = CARDS_BY_ID[id];
      return c?.type === 'creature' && domains.includes(c.domain) && !usedCardIds.has(id);
    });
  }

  candidates.sort((a, b) => {
    const ca = CARDS_BY_ID[a]!;
    const cb = CARDS_BY_ID[b]!;
    const pa = BEAST_PENALTY_REGEX.test(ca.name) ? 1 : 0;
    const pb = BEAST_PENALTY_REGEX.test(cb.name) ? 1 : 0;
    if (pa !== pb) return pa - pb;

    const domMatchA = domains.includes(ca.domain) && ca.domain !== 'neutral' ? 1 : 0;
    const domMatchB = domains.includes(cb.domain) && cb.domain !== 'neutral' ? 1 : 0;
    if (domMatchA !== domMatchB) return domMatchB - domMatchA;

    const ha = HEROIC_CREATURE_REGEX.test(ca.name) ? 1 : 0;
    const hb = HEROIC_CREATURE_REGEX.test(cb.name) ? 1 : 0;
    if (ha !== hb) return hb - ha;

    const da = Math.abs(rarityScore(ca.rarity) - targetRarity);
    const db = Math.abs(rarityScore(cb.rarity) - targetRarity);
    if (da !== db) return da - db;
    return cb.cost - ca.cost;
  });

  const avatarCardId = candidates[0] ?? CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE[archetypeId];
  usedCardIds.add(avatarCardId);

  const card = CARDS_BY_ID[avatarCardId];
  const realmOrigin = REALM_ORIGIN_BY_ARCHETYPE[archetypeId] ?? 'Vaeloria';
  const roleLabel = COMMANDER_TIER_ROLE_LABELS[skillTier];

  return {
    avatarCardId,
    sovereignName: card?.name ?? avatarCardId,
    sovereignTitle: `${roleLabel} • ${realmOrigin}`,
    realmOrigin,
  };
}

export function getCanonicalCoverCardForArchetype(
  archetypeId: UnifiedChampionId,
  _skillTier?: AiSkillTier
): string {
  return CANONICAL_SOVEREIGN_CARD_BY_ARCHETYPE[archetypeId];
}
