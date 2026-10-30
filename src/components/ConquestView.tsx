import React, { useState, useEffect, useMemo } from 'react';
import { CampaignBoss, CardDefinition, ConquestBattleModifiers } from '../types/game';
import { CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { playSfx } from '../utils/soundEngine';
import { CardInspectModal, DOMAIN_META } from './CardView';
import { CustomSavedDeck } from './BattleArena';
import { ActiveInvasionVector, ConquestMegamap } from './ConquestMegamap';
import {
  CONQUEST_CRISES,
  CONQUEST_FACTION_ORDER,
  CONQUEST_FACTIONS,
  CONQUEST_PROVINCES,
  CONQUEST_PROVINCES_BY_ID,
  ConquestFactionId,
  ConquestProvinceDef,
  buildConquestBattleModifiers,
  buildConquestBossForProvince,
} from '../data/vaeloriaConquestData';

const CONQUEST_STORAGE_KEY = 'chromatic_pact_conquest_v1';
const BASTION_BUILD_COST = 65;
const TRUCE_DIPLOMACY_COST = 90;

export interface ConquestBattleOutcome {
  outcomeId: string;
  provinceId: string;
  isDefensive: boolean;
  attackerFactionId?: ConquestFactionId;
  didWin: boolean;
}

export interface ConquestRunState {
  phase: 'select_faction' | 'war_room';
  playerFactionId: ConquestFactionId;
  selectedDeckId: string;
  season: number;
  supplies: number;
  hasSiegedThisSeason: boolean;
  provinceOwners: Record<string, ConquestFactionId>;
  fortifications: Record<string, number>;
  truces: Record<string, number>;
  warLog: string[];
  pendingDefenseAlarm: ActiveInvasionVector | null;
  processedOutcomeIds: string[];
  hegemonyClaimed: boolean;
  dominationClaimed: boolean;
}

function createFreshConquestState(
  factionId: ConquestFactionId = 'pyros',
  deckId = ''
): ConquestRunState {
  const owners: Record<string, ConquestFactionId> = {};
  const forts: Record<string, number> = {};
  for (const prov of CONQUEST_PROVINCES) {
    owners[prov.id] = prov.initialOwner;
    if (prov.isCapital) {
      forts[prov.id] = 1;
    }
  }
  const f = CONQUEST_FACTIONS[factionId];
  return {
    phase: 'select_faction',
    playerFactionId: factionId,
    selectedDeckId: deckId,
    season: 1,
    supplies: 150,
    hasSiegedThisSeason: false,
    provinceOwners: owners,
    fortifications: forts,
    truces: {},
    warLog: [
      `Estação 1: ${f.icon} ${f.name} ergue seus estandartes em Vaeloria. Unifique a Torre dos Cinco Selos e as Capitais Rurais!`,
    ],
    pendingDefenseAlarm: null,
    processedOutcomeIds: [],
    hegemonyClaimed: false,
    dominationClaimed: false,
  };
}

export interface ConquestViewProps {
  customDecks: CustomSavedDeck[];
  isGuest?: boolean;
  onRequireAccount?: () => void;
  onRequireDeckSetup?: () => void;
  onStartConquestBattle: (params: {
    boss: CampaignBoss;
    playerDeckCardIds: string[];
    modifiers: ConquestBattleModifiers;
    provinceId: string;
    isDefensive: boolean;
    attackerFactionId?: ConquestFactionId;
  }) => void;
  onRewardGold: (amount: number, reason?: string) => void;
  lastConquestOutcome?: ConquestBattleOutcome | null;
}

export const ConquestView: React.FC<ConquestViewProps> = ({
  customDecks,
  isGuest = false,
  onRequireAccount,
  onRequireDeckSetup,
  onStartConquestBattle,
  onRewardGold,
  lastConquestOutcome,
}) => {
  const [runState, setRunState] = useState<ConquestRunState>(() => {
    try {
      const raw = localStorage.getItem(CONQUEST_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConquestRunState;
        if (parsed && parsed.provinceOwners && parsed.playerFactionId) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse error
    }
    return createFreshConquestState('pyros', customDecks[0]?.id ?? PREBUILT_DECKS[0]?.id ?? '');
  });

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(() => {
    return CONQUEST_FACTIONS[runState.playerFactionId]?.capitalProvinceId ?? CONQUEST_PROVINCES[0].id;
  });
  const [inspectCard, setInspectCard] = useState<CardDefinition | null>(null);
  const [bannerToast, setBannerToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CONQUEST_STORAGE_KEY, JSON.stringify(runState));
    } catch {
      // Ignore storage error
    }
  }, [runState]);

  const showToast = (msg: string) => {
    setBannerToast(msg);
    window.setTimeout(() => setBannerToast(null), 3800);
  };

  // Resolve Battle Outcome returning from BattleArena
  useEffect(() => {
    if (!lastConquestOutcome) return;
    setRunState((prev) => {
      if (prev.processedOutcomeIds.includes(lastConquestOutcome.outcomeId)) {
        return prev;
      }
      const prov = CONQUEST_PROVINCES_BY_ID[lastConquestOutcome.provinceId];
      if (!prov) return prev;

      const nextOwners = { ...prev.provinceOwners };
      const nextForts = { ...prev.fortifications };
      const nextLog = [...prev.warLog];
      let nextSupplies = prev.supplies;
      let nextAlarm = prev.pendingDefenseAlarm;

      if (lastConquestOutcome.isDefensive) {
        nextAlarm = null;
        if (lastConquestOutcome.didWin) {
          nextSupplies += 45;
          nextLog.unshift(
            `🛡️ Estação ${prev.season}: Defesa heroica em [${prov.name}]! O invasor recuou (+45⚙️ Suprimentos).`
          );
        } else if (lastConquestOutcome.attackerFactionId) {
          const atkF = CONQUEST_FACTIONS[lastConquestOutcome.attackerFactionId];
          nextOwners[prov.id] = lastConquestOutcome.attackerFactionId;
          nextForts[prov.id] = 0;
          nextLog.unshift(
            `🔥 Estação ${prev.season}: [${prov.name}] caiu diante da invasão de ${atkF.icon} ${atkF.shortName}.`
          );
        }
      } else {
        if (lastConquestOutcome.didWin) {
          const oldOwner = CONQUEST_FACTIONS[prev.provinceOwners[prov.id]];
          nextOwners[prov.id] = prev.playerFactionId;
          nextForts[prov.id] = Math.max(0, (nextForts[prov.id] ?? 0) - 1);
          const spoils = prov.isCapital ? 90 : 45;
          nextSupplies += spoils;
          nextLog.unshift(
            `⚔️ Estação ${prev.season}: Conquistamos [${prov.name}] de ${oldOwner.icon} ${oldOwner.shortName}! (+${spoils}⚙️ Espólios)`
          );
        } else {
          nextLog.unshift(
            `⚠️ Estação ${prev.season}: Nosso cerco a [${prov.name}] foi repelido pelas defesas locais.`
          );
        }
      }

      // Check Imperial Milestones (Hegemony & Total Domination)
      const ownedList = CONQUEST_PROVINCES.filter((p) => nextOwners[p.id] === prev.playerFactionId);
      const ownedCapitals = ownedList.filter((p) => p.isCapital).length;
      const holdsAxial = nextOwners['prov_matrix_five_seals'] === prev.playerFactionId;

      let nextHegemony = prev.hegemonyClaimed;
      let nextDomination = prev.dominationClaimed;

      if (!nextHegemony && holdsAxial && ownedCapitals >= 3 && ownedList.length >= 16) {
        nextHegemony = true;
        onRewardGold(150, 'Hegemonia Axial na Conquista de Vaeloria');
        nextLog.unshift(
          `👑 HEGEMONIA AXIAL ALCANÇADA! Você controla a Torre dos Cinco Selos, ${ownedCapitals} Capitais e ${ownedList.length} Províncias (+150 Ouro)!`
        );
      }

      if (!nextDomination && ownedList.length >= CONQUEST_PROVINCES.length) {
        nextDomination = true;
        onRewardGold(300, 'Dominação Absoluta de Vaeloria (30/30 Províncias)');
        nextLog.unshift(
          `🌍 UNIFICAÇÃO SUPREMA! Todas as 30 províncias de Vaeloria curvaram-se ao seu estandarte (+300 Ouro)!`
        );
      }

      return {
        ...prev,
        provinceOwners: nextOwners,
        fortifications: nextForts,
        supplies: nextSupplies,
        hasSiegedThisSeason: lastConquestOutcome.isDefensive ? prev.hasSiegedThisSeason : true,
        pendingDefenseAlarm: nextAlarm,
        warLog: nextLog.slice(0, 28),
        processedOutcomeIds: [...prev.processedOutcomeIds.slice(-20), lastConquestOutcome.outcomeId],
        hegemonyClaimed: nextHegemony,
        dominationClaimed: nextDomination,
      };
    });
  }, [lastConquestOutcome, onRewardGold]);

  const activeCrisis = useMemo(
    () => CONQUEST_CRISES[(runState.season - 1) % CONQUEST_CRISES.length],
    [runState.season]
  );

  const playerFaction = CONQUEST_FACTIONS[runState.playerFactionId];

  const ownedProvinceIds = useMemo(
    () =>
      CONQUEST_PROVINCES.filter(
        (p) => runState.provinceOwners[p.id] === runState.playerFactionId
      ).map((p) => p.id),
    [runState.provinceOwners, runState.playerFactionId]
  );

  const ownedCapitalsCount = useMemo(
    () =>
      CONQUEST_PROVINCES.filter(
        (p) => p.isCapital && runState.provinceOwners[p.id] === runState.playerFactionId
      ).length,
    [runState.provinceOwners, runState.playerFactionId]
  );

  // Compute all enemy provinces adjacent to at least one player-owned province (respecting active Truces)
  const attackableProvinceIds = useMemo(() => {
    const set = new Set<string>();
    const ownedSet = new Set(ownedProvinceIds);
    const hasSkyCorridor = ownedSet.has('prov_pyros_sky_corridor');

    for (const pid of ownedProvinceIds) {
      const p = CONQUEST_PROVINCES_BY_ID[pid];
      if (!p) continue;
      for (const nid of p.neighbors) {
        if (ownedSet.has(nid)) continue;
        const ownerFaction = runState.provinceOwners[nid];
        if ((runState.truces[ownerFaction] ?? 0) > 0) continue;
        set.add(nid);
      }
    }

    // Special Geographic Power: holding Corredor Aéreo das Armadas opens air-assault on coastal/ring provinces!
    if (hasSkyCorridor) {
      for (const p of CONQUEST_PROVINCES) {
        if (ownedSet.has(p.id)) continue;
        if (p.terrainKind === 'port' || p.terrainKind === 'skyway') {
          const ownerFaction = runState.provinceOwners[p.id];
          if ((runState.truces[ownerFaction] ?? 0) <= 0) {
            set.add(p.id);
          }
        }
      }
    }

    return set;
  }, [ownedProvinceIds, runState.provinceOwners, runState.truces]);

  const seasonalIncomePreview = useMemo(() => {
    let sum = 0;
    for (const pid of ownedProvinceIds) {
      const p = CONQUEST_PROVINCES_BY_ID[pid];
      if (!p) continue;
      sum += p.supplyIncome;
      if (activeCrisis.effectType === 'open_seas' && p.terrainKind === 'port') {
        sum += 15;
      }
      if (activeCrisis.effectType === 'axial_judgment' && p.initialOwner === 'matrix') {
        sum += 20;
      }
    }
    return sum;
  }, [ownedProvinceIds, activeCrisis]);

  const resolveSelectedDeckCards = (): { cardIds: string[]; avatarId?: string } => {
    const custom =
      customDecks.find((cd) => cd.id === runState.selectedDeckId) ?? customDecks[0];
    const fallbackPrebuilt =
      PREBUILT_DECKS.find((d) => d.id === playerFaction.defaultDeckId) ?? PREBUILT_DECKS[0];
    const cardIds = custom?.cardIds ?? fallbackPrebuilt?.cardIds ?? [];
    let bestAvatar: string | undefined;
    let bestScore = -1;
    for (const cid of cardIds) {
      const c = CARDS_BY_ID[cid];
      if (!c?.imagePath) continue;
      const sc = (c.rarity === 'legendary' ? 100 : 0) + c.cost;
      if (sc > bestScore) {
        bestScore = sc;
        bestAvatar = c.id;
      }
    }
    return { cardIds, avatarId: bestAvatar ?? playerFaction.avatarCardId };
  };

  const deckMeta = useMemo(
    () => resolveSelectedDeckCards(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customDecks, runState.selectedDeckId, playerFaction]
  );

  const handleBeginCampaignWithFaction = (factionId: ConquestFactionId) => {
    if (isGuest) {
      onRequireAccount?.();
      return;
    }
    if (customDecks.length === 0) {
      onRequireDeckSetup?.();
      return;
    }
    playSfx('ascend');
    const fresh = createFreshConquestState(
      factionId,
      runState.selectedDeckId || customDecks[0]?.id || ''
    );
    fresh.phase = 'war_room';
    setRunState(fresh);
    setSelectedProvinceId(CONQUEST_FACTIONS[factionId].capitalProvinceId);
  };

  const handleLaunchOffensiveSiege = (prov: ConquestProvinceDef) => {
    if (isGuest) {
      onRequireAccount?.();
      return;
    }
    if (customDecks.length === 0) {
      onRequireDeckSetup?.();
      return;
    }
    if (runState.hasSiegedThisSeason) {
      showToast('⏳ Seu Exército já realizou um Cerco nesta estação. Encerre a Estação para marchar novamente!');
      return;
    }
    if (!attackableProvinceIds.has(prov.id)) {
      showToast('📍 Esta província não faz fronteira direta com o seu território (ou possui Trégua ativa).');
      return;
    }

    const defenderFactionId = runState.provinceOwners[prov.id];
    const fortLvl = runState.fortifications[prov.id] ?? 0;
    const boss = buildConquestBossForProvince(prov, defenderFactionId, fortLvl, runState.season);
    const modifiers = buildConquestBattleModifiers({
      targetProvince: prov,
      ownedProvinceIds,
      fortifications: runState.fortifications,
      isDefensiveSiege: false,
      activeCrisis,
    });

    playSfx('summon');
    onStartConquestBattle({
      boss,
      playerDeckCardIds: deckMeta.cardIds,
      modifiers,
      provinceId: prov.id,
      isDefensive: false,
    });
  };

  const handleFightDefensiveSiege = () => {
    const alarm = runState.pendingDefenseAlarm;
    if (!alarm) return;
    const prov = CONQUEST_PROVINCES_BY_ID[alarm.toProvinceId];
    const fromProv = CONQUEST_PROVINCES_BY_ID[alarm.fromProvinceId];
    if (!prov || !fromProv) return;

    const boss = buildConquestBossForProvince(
      fromProv,
      alarm.attackerFactionId,
      0,
      runState.season
    );
    boss.name = `Força Invasora de ${CONQUEST_FACTIONS[alarm.attackerFactionId].shortName}`;
    boss.title = `Cerco contra ${prov.name}`;

    const modifiers = buildConquestBattleModifiers({
      targetProvince: prov,
      ownedProvinceIds,
      fortifications: runState.fortifications,
      isDefensiveSiege: true,
      activeCrisis,
    });

    playSfx('summon');
    onStartConquestBattle({
      boss,
      playerDeckCardIds: deckMeta.cardIds,
      modifiers,
      provinceId: prov.id,
      isDefensive: true,
      attackerFactionId: alarm.attackerFactionId,
    });
  };

  const handleAutoResolveDefenseGarrison = () => {
    const alarm = runState.pendingDefenseAlarm;
    if (!alarm) return;
    const prov = CONQUEST_PROVINCES_BY_ID[alarm.toProvinceId];
    if (!prov) return;

    const fortLvl = runState.fortifications[prov.id] ?? 0;
    const holdChance = Math.min(
      0.88,
      0.42 + fortLvl * 0.22 + (prov.isCapital ? 0.16 : 0) + (activeCrisis.effectType === 'polar_winter' ? 0.08 : 0)
    );
    const held = Math.random() < holdChance;

    setRunState((prev) => {
      const nextOwners = { ...prev.provinceOwners };
      const nextForts = { ...prev.fortifications };
      const nextLog = [...prev.warLog];
      const atkF = CONQUEST_FACTIONS[alarm.attackerFactionId];

      if (held) {
        playSfx('victory');
        if (fortLvl > 0 && Math.random() < 0.45) {
          nextForts[prov.id] = fortLvl - 1;
        }
        nextLog.unshift(
          `🛡️ Guarnição de [${prov.name}] resistiu ao assalto de ${atkF.icon} ${atkF.shortName}!`
        );
        showToast(`🛡️ A Guarnição de ${prov.name} segurou as muralhas!`);
      } else {
        playSfx('defeat');
        nextOwners[prov.id] = alarm.attackerFactionId;
        nextForts[prov.id] = 0;
        nextLog.unshift(
          `🔥 A Guarnição de [${prov.name}] foi sobrepujada por ${atkF.icon} ${atkF.shortName}.`
        );
        showToast(`⚠️ ${prov.name} foi tomada por ${atkF.shortName}!`);
      }

      return {
        ...prev,
        provinceOwners: nextOwners,
        fortifications: nextForts,
        pendingDefenseAlarm: null,
        warLog: nextLog.slice(0, 28),
      };
    });
  };

  const handleFortifyProvince = (prov: ConquestProvinceDef) => {
    const currentFort = runState.fortifications[prov.id] ?? 0;
    if (currentFort >= 2) {
      showToast('🛡️ Esta província já possui Bastião Nível Máximo (Nv.2).');
      return;
    }
    if (runState.supplies < BASTION_BUILD_COST) {
      showToast(`⚙️ Suprimentos insuficientes (${BASTION_BUILD_COST}⚙️ necessários).`);
      return;
    }
    playSfx('channel');
    setRunState((prev) => ({
      ...prev,
      supplies: prev.supplies - BASTION_BUILD_COST,
      fortifications: {
        ...prev.fortifications,
        [prov.id]: currentFort + 1,
      },
      warLog: [
        `🛡️ Estação ${prev.season}: Bastião Nv.${currentFort + 1} erguido em [${prov.name}] (-${BASTION_BUILD_COST}⚙️).`,
        ...prev.warLog,
      ].slice(0, 28),
    }));
    showToast(`🛡️ Bastião Nv.${currentFort + 1} construído em ${prov.name}!`);
  };

  const handleSignTruce = (targetFactionId: ConquestFactionId) => {
    if (targetFactionId === runState.playerFactionId) return;
    if ((runState.truces[targetFactionId] ?? 0) > 0) {
      showToast('🕊️ Já existe uma Trégua ativa com este Reino.');
      return;
    }
    if (runState.supplies < TRUCE_DIPLOMACY_COST) {
      showToast(`⚙️ Suprimentos insuficientes para o Tributo Diplomático (${TRUCE_DIPLOMACY_COST}⚙️).`);
      return;
    }
    playSfx('ascend');
    const f = CONQUEST_FACTIONS[targetFactionId];
    setRunState((prev) => ({
      ...prev,
      supplies: prev.supplies - TRUCE_DIPLOMACY_COST,
      truces: {
        ...prev.truces,
        [targetFactionId]: 2,
      },
      warLog: [
        `🕊️ Estação ${prev.season}: Pacto de Não-Agressão (2 Estações) firmado com ${f.icon} ${f.shortName}.`,
        ...prev.warLog,
      ].slice(0, 28),
    }));
    showToast(`🕊️ Trégua de 2 estações firmada com ${f.shortName}!`);
  };

  const handleEndSeason = () => {
    if (runState.pendingDefenseAlarm) {
      showToast('🚨 Resolva primeiro o Cerco Defensivo ativo na sua fronteira!');
      return;
    }

    playSfx('draw');
    setRunState((prev) => {
      const nextSeason = prev.season + 1;
      const nextOwners = { ...prev.provinceOwners };
      const nextForts = { ...prev.fortifications };
      const nextLog = [...prev.warLog];

      // 1. Collect Seasonal Supply Income
      let income = 0;
      for (const p of CONQUEST_PROVINCES) {
        if (nextOwners[p.id] === prev.playerFactionId) {
          income += p.supplyIncome;
          if (activeCrisis.effectType === 'open_seas' && p.terrainKind === 'port') income += 15;
          if (activeCrisis.effectType === 'axial_judgment' && p.initialOwner === 'matrix') income += 20;
        }
      }

      // 2. Tick down Truces (after AI checks current season truces)
      const activeTrucesNow = { ...prev.truces };

      // 3. Simulate the 5 Rival AI Factions moving across Vaeloria
      let triggeredPlayerAlarm: ActiveInvasionVector | null = null;
      const aiOrder = CONQUEST_FACTION_ORDER.filter((fid) => fid !== prev.playerFactionId).sort(
        () => Math.random() - 0.5
      );

      for (const aiFid of aiOrder) {
        const aiOwned = CONQUEST_PROVINCES.filter((p) => nextOwners[p.id] === aiFid);
        if (aiOwned.length === 0) continue; // Eliminated faction

        // Gather border candidates
        const borderMoves: { from: ConquestProvinceDef; to: ConquestProvinceDef }[] = [];
        for (const src of aiOwned) {
          for (const nid of src.neighbors) {
            const dst = CONQUEST_PROVINCES_BY_ID[nid];
            if (!dst || nextOwners[dst.id] === aiFid) continue;
            const dstOwner = nextOwners[dst.id];
            if (dstOwner === prev.playerFactionId && (activeTrucesNow[aiFid] ?? 0) > 0) {
              continue; // Respect diplomatic truce!
            }
            borderMoves.push({ from: src, to: dst });
          }
        }

        if (borderMoves.length === 0) continue;
        // 55% chance each AI faction launches a border offensive this season
        if (Math.random() > 0.55) continue;

        const chosen = borderMoves[Math.floor(Math.random() * borderMoves.length)];
        const dstOwner = nextOwners[chosen.to.id];

        if (dstOwner === prev.playerFactionId) {
          // Trigger at most 1 live defensive siege per season so gameplay stays crisp & fair
          if (!triggeredPlayerAlarm && Math.random() < 0.62) {
            triggeredPlayerAlarm = {
              fromProvinceId: chosen.from.id,
              toProvinceId: chosen.to.id,
              attackerFactionId: aiFid,
            };
            const atkF = CONQUEST_FACTIONS[aiFid];
            nextLog.unshift(
              `🚨 ALARME DE FRONTEIRA: ${atkF.icon} ${atkF.shortName} marchou de [${chosen.from.name}] contra [${chosen.to.name}]!`
            );
          }
        } else {
          // AI vs AI war resolution
          const defFort = nextForts[chosen.to.id] ?? 0;
          const winProb = chosen.to.isCapital ? 0.25 : Math.max(0.28, 0.56 - defFort * 0.16);
          if (Math.random() < winProb) {
            const atkF = CONQUEST_FACTIONS[aiFid];
            const defF = CONQUEST_FACTIONS[dstOwner];
            nextOwners[chosen.to.id] = aiFid;
            nextForts[chosen.to.id] = 0;
            nextLog.unshift(
              `⚔️ Guerra Continental: ${atkF.icon} ${atkF.shortName} conquistou [${chosen.to.name}] de ${defF.icon} ${defF.shortName}.`
            );
          }
        }
      }

      const nextTruces: Record<string, number> = {};
      for (const [fid, rem] of Object.entries(activeTrucesNow)) {
        if (rem - 1 > 0) nextTruces[fid] = rem - 1;
      }

      nextLog.unshift(
        `⏳ Estação ${nextSeason} iniciada (+${income}⚙️ Suprimentos recolhidos das suas províncias).`
      );

      return {
        ...prev,
        season: nextSeason,
        supplies: prev.supplies + income,
        hasSiegedThisSeason: false,
        provinceOwners: nextOwners,
        fortifications: nextForts,
        truces: nextTruces,
        pendingDefenseAlarm: triggeredPlayerAlarm,
        warLog: nextLog.slice(0, 28),
      };
    });
  };

  const selectedProvince =
    CONQUEST_PROVINCES_BY_ID[selectedProvinceId] ?? CONQUEST_PROVINCES[0];
  const selectedOwnerId =
    runState.provinceOwners[selectedProvince.id] ?? selectedProvince.initialOwner;
  const selectedOwnerFaction = CONQUEST_FACTIONS[selectedOwnerId];
  const selectedFortLvl = runState.fortifications[selectedProvince.id] ?? 0;
  const isSelectedPlayerOwned = selectedOwnerId === runState.playerFactionId;
  const isSelectedAttackable = attackableProvinceIds.has(selectedProvince.id);
  const selectedCommanderCard =
    CARDS_BY_ID[
      selectedProvince.isCapital
        ? selectedOwnerFaction.avatarCardId
        : selectedProvince.garrisonAvatarCardId
    ];

  return (
    <div className="aaa-page-shell">
      {bannerToast && <div className="aaa-toast-banner">{bannerToast}</div>}

      {/* =====================================================================
          PHASE 1: FACTION SELECTION SCREEN (CHOOSE 1 OF 6 THRONES OF VAELORIA)
          ===================================================================== */}
      {runState.phase === 'select_faction' && (
        <div className="conquest-setup-shell">
          <div className="conquest-setup-header">
            <div>
              <span className="vwm-territory-kicker">GUERRA CONTINENTAL • 30 PROVÍNCIAS • 6 TRONOS</span>
              <h2 className="font-cinzel gold-gradient-text" style={{ margin: '2px 0 4px', fontSize: '1.35rem' }}>
                Escolha o Trono que Unificará Vaeloria
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>
                Lidere um dos 6 Reinos em nosso Megamapa Geopolítico com Zoom em 3 Níveis. Conquiste a{' '}
                <strong>Torre dos Cinco Selos</strong> e <strong>3 Capitais</strong> para proclamar Hegemonia (+150 Ouro) ou domine todas as 30 províncias (+300 Ouro)!
              </p>
            </div>

            {!isGuest && customDecks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>
                  SEU GRIMÓRIO DE GUERRA:
                </span>
                <select
                  value={runState.selectedDeckId}
                  onChange={(e) =>
                    setRunState((prev) => ({ ...prev, selectedDeckId: e.target.value }))
                  }
                  className="aaa-select"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  {customDecks.map((cd) => (
                    <option key={cd.id} value={cd.id}>
                      ★ {cd.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="exp-blessings-grid">
            {CONQUEST_FACTION_ORDER.map((fid) => {
              const f = CONQUEST_FACTIONS[fid];
              const cap = CONQUEST_PROVINCES_BY_ID[f.capitalProvinceId];
              const avatar = CARDS_BY_ID[f.avatarCardId];
              return (
                <div
                  key={f.id}
                  className="exp-blessing-card conquest-faction-card"
                  style={{ borderColor: `${f.color}55` }}
                  onClick={() => handleBeginCampaignWithFaction(f.id)}
                >
                  <div className="conquest-faction-card-top">
                    {avatar?.imagePath && (
                      <img src={avatar.imagePath} alt={f.rulerName} className="conquest-faction-avatar" />
                    )}
                    <div>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          color: f.color,
                        }}
                      >
                        {f.icon} CAPITAL: {cap?.name.toUpperCase()}
                      </span>
                      <h3 className="font-cinzel" style={{ margin: '2px 0', fontSize: '1rem', color: '#f8fafc' }}>
                        {f.name}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{f.rulerName}</div>
                    </div>
                  </div>

                  <div className="conquest-doctrine-box">
                    <strong style={{ color: '#fef08a', fontSize: '0.72rem' }}>
                      ✦ {f.imperialDoctrineName}
                    </strong>
                    <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.38 }}>
                      {f.imperialDoctrineDesc}
                    </p>
                  </div>

                  <button type="button" className="aaa-btn aaa-btn-primary" style={{ marginTop: 'auto' }}>
                    ⚔️ Erguer Estandarte de {f.shortName}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          PHASE 2: CONTINENTAL WAR ROOM + MULTI-LOD MEGAMAP
          ===================================================================== */}
      {runState.phase === 'war_room' && (
        <>
          {/* Top Imperial Command Bar */}
          <div className="conquest-top-bar">
            <div className="conquest-empire-summary">
              <span className="conquest-empire-badge" style={{ borderColor: playerFaction.color }}>
                <span>{playerFaction.icon}</span>
                <strong style={{ color: playerFaction.color }}>{playerFaction.shortName}</strong>
              </span>
              <span className="conquest-stat-chip">
                ⏳ Estação <strong>{runState.season}</strong>
              </span>
              <span className="conquest-stat-chip">
                🏰 Províncias: <strong>{ownedProvinceIds.length}/30</strong>
              </span>
              <span className="conquest-stat-chip">
                👑 Capitais: <strong>{ownedCapitalsCount}/6</strong>
              </span>
              <span className="conquest-stat-chip gold">
                ⚙️ Suprimentos: <strong>{runState.supplies}</strong>{' '}
                <small>(+{seasonalIncomePreview}/est.)</small>
              </span>
              <span
                className="conquest-crisis-chip"
                style={{ borderColor: `${activeCrisis.accent}66` }}
                title={activeCrisis.description}
              >
                {activeCrisis.icon} {activeCrisis.name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {!isGuest && customDecks.length > 0 && (
                <select
                  value={runState.selectedDeckId}
                  onChange={(e) =>
                    setRunState((prev) => ({ ...prev, selectedDeckId: e.target.value }))
                  }
                  className="aaa-select"
                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                >
                  {customDecks.map((cd) => (
                    <option key={cd.id} value={cd.id}>
                      ★ {cd.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                onClick={handleEndSeason}
              >
                ⏭️ Encerrar Estação {runState.season}
              </button>

              <button
                type="button"
                className="btn-fantasy btn-fantasy-danger"
                style={{ padding: '5px 10px', fontSize: '0.7rem' }}
                onClick={() =>
                  setRunState(createFreshConquestState(runState.playerFactionId, runState.selectedDeckId))
                }
              >
                Nova Guerra
              </button>
            </div>
          </div>

          {/* Defensive Siege Alarm Banner (if a rival faction invaded a player border!) */}
          {runState.pendingDefenseAlarm && (
            <div className="conquest-defense-alarm">
              <div className="cda-copy">
                <span className="cda-kicker">🚨 ALARME DE INVASÃO NA FRONTEIRA!</span>
                <strong>
                  {CONQUEST_FACTIONS[runState.pendingDefenseAlarm.attackerFactionId].icon}{' '}
                  {CONQUEST_FACTIONS[runState.pendingDefenseAlarm.attackerFactionId].name} está cercando{' '}
                  [{CONQUEST_PROVINCES_BY_ID[runState.pendingDefenseAlarm.toProvinceId]?.name}]!
                </strong>
                <span>
                  Lute pessoalmente na Arena com os bônus de Bastião da sua província ou delegue a defesa à Guarnição local.
                </span>
              </div>
              <div className="cda-actions">
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary"
                  onClick={handleFightDefensiveSiege}
                >
                  ⚔️ Defender na Arena
                </button>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-secondary"
                  onClick={handleAutoResolveDefenseGarrison}
                >
                  🛡️ Delegar à Guarnição
                </button>
              </div>
            </div>
          )}

          {/* Split Workspace: Multi-LOD Megamap + Province War Room Dossier */}
          <div className="aaa-campaign-workspace is-map-mode conquest-workspace">
            <ConquestMegamap
              playerFactionId={runState.playerFactionId}
              provinceOwners={runState.provinceOwners}
              fortifications={runState.fortifications}
              truces={runState.truces}
              selectedProvinceId={selectedProvince.id}
              attackableProvinceIds={attackableProvinceIds}
              activeInvasion={runState.pendingDefenseAlarm}
              sovereignAvatarCardId={deckMeta.avatarId}
              hasActedThisSeason={runState.hasSiegedThisSeason}
              onSelectProvince={(prov) => setSelectedProvinceId(prov.id)}
              onLaunchSiege={handleLaunchOffensiveSiege}
            />

            {/* Right Sidebar: Selected Province Tactical Dossier + Empire War Log */}
            <section
              className="aaa-boss-dossier conquest-dossier"
              style={
                {
                  '--boss-accent': selectedOwnerFaction.color,
                } as React.CSSProperties
              }
            >
              <div className="aaa-dossier-visual" style={{ maxHeight: 165 }}>
                {selectedCommanderCard?.imagePath && (
                  <img
                    src={selectedCommanderCard.imagePath}
                    alt={selectedProvince.name}
                    className="aaa-dossier-portrait"
                    onClick={() => setInspectCard(selectedCommanderCard)}
                  />
                )}
                <div className="aaa-dossier-vignette" />
              </div>

              <div className="aaa-dossier-content" style={{ padding: '1rem 1.2rem' }}>
                <div className="aaa-dossier-meta-row">
                  <span
                    className="aaa-dossier-stage-pill"
                    style={{ borderColor: selectedOwnerFaction.color, color: selectedOwnerFaction.color }}
                  >
                    {selectedOwnerFaction.icon} {selectedOwnerFaction.shortName.toUpperCase()}
                    {selectedProvince.isCapital ? ' • CAPITAL REAL' : ''}
                  </span>
                  <span className="aaa-domain-tag" style={{ borderColor: DOMAIN_META[selectedProvince.domain].color }}>
                    {selectedProvince.terrainLabel}
                  </span>
                </div>

                <h2 className="font-cinzel aaa-dossier-title" style={{ fontSize: '1.22rem' }}>
                  {selectedProvince.name}
                </h2>
                <div className="aaa-dossier-subtitle">{selectedProvince.regionLabel}</div>

                <blockquote className="aaa-dossier-quote">{selectedProvince.loreSnippet}</blockquote>

                <div className="aaa-dossier-metrics">
                  <div className="aaa-metric-box">
                    <span className="aaa-metric-lbl">TRIBUTO</span>
                    <span className="aaa-metric-val gold-text">+{selectedProvince.supplyIncome}⚙️</span>
                  </div>
                  <div className="aaa-metric-box">
                    <span className="aaa-metric-lbl">GUARNIÇÃO</span>
                    <span className="aaa-metric-val">
                      {selectedProvince.baseGarrisonHp + selectedFortLvl * 8} PV
                    </span>
                  </div>
                  <div className="aaa-metric-box">
                    <span className="aaa-metric-lbl">BASTIÃO</span>
                    <span className="aaa-metric-val">
                      {selectedFortLvl > 0 ? `🛡️ Nv.${selectedFortLvl}` : 'Sem Muralha'}
                    </span>
                  </div>
                </div>

                <div className="aaa-dossier-passive-panel">
                  <div className="aaa-passive-kicker">
                    VALOR ESTRATÉGICO • {selectedProvince.strategicBonusTitle.toUpperCase()}
                  </div>
                  <p className="aaa-passive-desc">{selectedProvince.strategicBonusDesc}</p>
                </div>

                {/* Context-Sensitive Strategic Orders */}
                <div className="aaa-dossier-actions" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  {!isSelectedPlayerOwned ? (
                    <>
                      <button
                        type="button"
                        className="aaa-btn aaa-btn-primary"
                        disabled={!isSelectedAttackable || runState.hasSiegedThisSeason}
                        onClick={() => handleLaunchOffensiveSiege(selectedProvince)}
                      >
                        {runState.hasSiegedThisSeason
                          ? '⏳ Exército já marchou nesta Estação'
                          : isSelectedAttackable
                          ? `⚔️ Cercar ${selectedProvince.isCapital ? 'Capital' : 'Província'}`
                          : '🔒 Sem Fronteira Conectada'}
                      </button>

                      <button
                        type="button"
                        className="aaa-btn aaa-btn-secondary"
                        disabled={(runState.truces[selectedOwnerId] ?? 0) > 0}
                        onClick={() => handleSignTruce(selectedOwnerId)}
                      >
                        {(runState.truces[selectedOwnerId] ?? 0) > 0
                          ? `🕊️ Trégua (${runState.truces[selectedOwnerId]} est.)`
                          : `🕊️ Trégua (${TRUCE_DIPLOMACY_COST}⚙️)`}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-primary"
                      disabled={selectedFortLvl >= 2}
                      onClick={() => handleFortifyProvince(selectedProvince)}
                    >
                      {selectedFortLvl >= 2
                        ? '🛡️ Bastião Máximo (Nv.2)'
                        : `🛡️ Erguer Bastião Nv.${selectedFortLvl + 1} (${BASTION_BUILD_COST}⚙️)`}
                    </button>
                  )}

                  {selectedCommanderCard && (
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-ghost"
                      onClick={() => setInspectCard(selectedCommanderCard)}
                    >
                      Comandante
                    </button>
                  )}
                </div>

                {/* Live Continental War Chronicle */}
                <div className="conquest-warlog-box">
                  <div className="conquest-warlog-title">📜 CRÔNICA DE GUERRA CONTINENTAL</div>
                  <div className="conquest-warlog-scroll">
                    {runState.warLog.map((entry, idx) => (
                      <div key={idx} className="conquest-warlog-item">
                        {entry}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {inspectCard && (
        <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} />
      )}
    </div>
  );
};
