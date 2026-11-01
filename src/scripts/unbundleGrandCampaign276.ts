import fs from 'node:fs';
import path from 'node:path';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { LEGENDARY_CREATURE_BIOGRAPHIES } from '../data/legendaryCreaturesLore';
import { UNIFIED_CHAMPION_STANDINGS, UnifiedChampionId } from '../data/aiUnifiedTournamentData';
import { VAELORIA_REGIONAL_MAPS, VaeloriaRealmId } from '../data/vaeloriaMultimapData';
import {
  GRAND_CAMPAIGN_NODES,
  GRAND_CAMPAIGN_SUBMAP_GRAPHS,
  GrandCampaignEncounterNode,
  GrandCampaignSubmapGraph,
} from '../data/vaeloriaGrandCampaign';
import type { Domain } from '../types/game';

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const OUTPOST_PREFIXES = ['Vanguarda', 'Reduto', 'Atalaia', 'Baluarte'];

function pickBonusSupportCard(domain: Domain, seedKey: string, slot: number): string {
  const pool = ALL_CARDS.filter(
    (c) =>
      c.domain === domain &&
      (c.type !== 'creature' || c.rarity === 'uncommon') &&
      (c.rarity === 'uncommon' || c.rarity === 'rare')
  );
  if (pool.length === 0) return ALL_CARDS[0].id;
  const idx = (hashStr(`${seedKey}#${slot}`) + slot * 17) % pool.length;
  return pool[idx].id;
}

function pickCompanionArchetype(
  submapDomain: Domain,
  tier: 1 | 2 | 3 | 4 | 5,
  parentArch: UnifiedChampionId,
  seedKey: string
): UnifiedChampionId {
  // Prefer monocolor in Tier 1, mono/bicolor in Tier 2-3, mono/bi/tri in Tier 4+ that contain submapDomain
  const candidates = UNIFIED_CHAMPION_STANDINGS.filter((st) => {
    if (!st.domains.includes(submapDomain)) return false;
    if (tier === 1) return st.domains.length === 1;
    if (tier === 2) return st.domains.length <= 2;
    if (tier === 3) return st.domains.length <= 2;
    return st.domains.length <= 3;
  }).map((st) => st.archetypeId);

  const distinct = candidates.filter((id) => id !== parentArch);
  const pool = distinct.length > 0 ? distinct : candidates;
  if (pool.length === 0) return parentArch;
  return pool[hashStr(seedKey) % pool.length];
}

function main() {
  const srcPath = path.resolve(process.cwd(), 'src/data/vaeloriaGrandCampaign.ts');
  const rawSrc = fs.readFileSync(srcPath, 'utf8');

  const graphStartMarker = 'export const GRAND_CAMPAIGN_SUBMAP_GRAPHS: Record<VaeloriaRealmId, GrandCampaignSubmapGraph> = ';
  const postNodesMarker = '// Hydrate all ';
  const idxHeaderEnd = rawSrc.indexOf(graphStartMarker);
  const idxHydrate = rawSrc.indexOf('export const GRAND_CAMPAIGN_NODES_BY_ID');
  if (idxHeaderEnd < 0 || idxHydrate < 0) {
    throw new Error('Markers not found in vaeloriaGrandCampaign.ts');
  }
  void postNodesMarker;

  let headerBlock = rawSrc
    .slice(0, idxHeaderEnd)
    .replace(
      /\/\/ 190 Confrontos.*/,
      '// 276 Confrontos Individuais 1x1 (100 Soberanos Lendários + 176 Comandantes Raros = 276 Criaturas)'
    )
    .replace(
      'resolveCampaignBossGraduatedSetup,\n} from \'./aiMonocolorMastery\';',
      'buildIndividualSovereignSignatureDeck,\n  resolveCampaignBossGraduatedSetup,\n} from \'./aiMonocolorMastery\';'
    )
    .replace(
      'resolveCampaignBossGraduatedSetup,\r\n} from \'./aiMonocolorMastery\';',
      'buildIndividualSovereignSignatureDeck,\r\n  resolveCampaignBossGraduatedSetup,\r\n} from \'./aiMonocolorMastery\';'
    );

  const tailBlock = rawSrc.slice(idxHydrate);

  const newSubmapGraphs: Record<string, GrandCampaignSubmapGraph> = {};
  const newNodes: GrandCampaignEncounterNode[] = [];

  // Process submap by submap in existing order
  const submapOrderList = Object.keys(GRAND_CAMPAIGN_SUBMAP_GRAPHS) as VaeloriaRealmId[];
  let globalStage = 0;

  for (const rid of submapOrderList) {
    const oldG = GRAND_CAMPAIGN_SUBMAP_GRAPHS[rid];
    const rdef = VAELORIA_REGIONAL_MAPS[rid];
    const origNodes = oldG.nodeIds
      .map((nid) => GRAND_CAMPAIGN_NODES.find((n) => n.id === nid)!)
      .filter(Boolean)
      .sort((a, b) => a.submapOrder - b.submapOrder);

    const origOrderById = new Map<string, number>();
    const origNodeById = new Map<string, GrandCampaignEncounterNode>();
    for (const n of origNodes) {
      origOrderById.set(n.id, n.submapOrder);
      origNodeById.set(n.id, n);
    }

    // Adjacency in original graph
    const forwardNeighbors = new Map<string, GrandCampaignEncounterNode[]>();
    const allNeighbors = new Map<string, GrandCampaignEncounterNode[]>();
    for (const n of origNodes) {
      forwardNeighbors.set(n.id, []);
      allNeighbors.set(n.id, []);
    }
    for (const [u, v] of oldG.edges) {
      const nu = origNodeById.get(u);
      const nv = origNodeById.get(v);
      if (!nu || !nv) continue;
      allNeighbors.get(u)!.push(nv);
      allNeighbors.get(v)!.push(nu);
      if (nu.submapOrder < nv.submapOrder) {
        forwardNeighbors.get(u)!.push(nv);
      } else if (nv.submapOrder < nu.submapOrder) {
        forwardNeighbors.get(v)!.push(nu);
      }
    }

    const splitCompanionIdMap = new Map<string, string>(); // origId -> `${origId}_b`
    const submapExpandedNodes: GrandCampaignEncounterNode[] = [];
    const fixedOrigIds = new Set<string>();

    for (const orig of origNodes) {
      fixedOrigIds.add(orig.id);
      const parentArch = (orig.boss.archetypeId || 'mono_neutral_axial') as UnifiedChampionId;
      const compId = orig.boss.companionCardId;

      if (!compId) {
        // Already solo node! Keep intact (with empty static customDeckCardIds hydrated at load)
        const cleanClone: GrandCampaignEncounterNode = {
          ...orig,
          boss: {
            ...orig.boss,
            startingHp: 40,
            archetypeId: parentArch,
            deckId: parentArch,
            customDeckCardIds: [],
          },
        };
        delete cleanClone.boss.companionCardId;
        submapExpandedNodes.push(cleanClone);
        continue;
      }

      // Paired rare_garrison -> unbundle into N1 (keeps orig.id) and N2 (`${orig.id}_b`)
      const avCard = CARDS_BY_ID[orig.boss.avatarCardId]!;
      const compCard = CARDS_BY_ID[compId]!;
      const avBio = LEGENDARY_CREATURE_BIOGRAPHIES[avCard.id];
      const compBio = LEGENDARY_CREATURE_BIOGRAPHIES[compCard.id];
      const avName = avBio?.properTitle ?? avCard.name;
      const compName = compBio?.properTitle ?? compCard.name;

      const splitId = `${orig.id}_b`;
      splitCompanionIdMap.set(orig.id, splitId);

      // Compute initial position for N2 along road toward forward neighbors
      const fwd = forwardNeighbors.get(orig.id)!;
      const refNeighbors = fwd.length > 0 ? fwd : allNeighbors.get(orig.id)!;
      let targetX = orig.rx + 5;
      let targetY = orig.ry - 4;
      if (refNeighbors.length > 0) {
        const avgX = refNeighbors.reduce((s, x) => s + x.rx, 0) / refNeighbors.length;
        const avgY = refNeighbors.reduce((s, x) => s + x.ry, 0) / refNeighbors.length;
        const dx = avgX - orig.rx;
        const dy = avgY - orig.ry;
        const len = Math.hypot(dx, dy) || 1;
        const sign = hashStr(splitId) % 2 === 0 ? 1 : -1;
        const perpX = (-dy / len) * 3.4 * sign;
        const perpY = (dx / len) * 3.4 * sign;
        targetX = orig.rx + dx * 0.44 + perpX;
        targetY = orig.ry + dy * 0.44 + perpY;
      }
      targetX = Math.max(10, Math.min(90, Math.round(targetX * 10) / 10));
      targetY = Math.max(12, Math.min(88, Math.round(targetY * 10) / 10));

      const prefix = OUTPOST_PREFIXES[hashStr(splitId) % OUTPOST_PREFIXES.length];
      const splitLandmark = `${prefix} — ${orig.landmarkName}`;
      const compArch = pickCompanionArchetype(rdef.domain, orig.tier, parentArch, splitId);

      const n1Rewards = [
        avCard.id,
        pickBonusSupportCard(rdef.domain, orig.id, 0),
      ];
      const n2Rewards = [
        compCard.id,
        pickBonusSupportCard(rdef.domain, splitId, 1),
      ];

      const n1: GrandCampaignEncounterNode = {
        ...orig,
        unlocksSubmaps: [],
        boss: {
          ...orig.boss,
          name: avName,
          title: `Guardião de Fronteira • ${orig.landmarkName}`,
          avatarCardId: avCard.id,
          startingHp: 40,
          rewardCardIds: n1Rewards,
          loreIntro: `${avName} mantém vigília soberana sobre ${orig.landmarkName} (${rdef.name}), vedando a passagem pelas estradas desta fronteira.`,
          archetypeId: parentArch,
          deckId: parentArch,
          customDeckCardIds: [],
        },
      };
      delete n1.boss.companionCardId;

      const n2: GrandCampaignEncounterNode = {
        ...orig,
        id: splitId,
        rx: targetX,
        ry: targetY,
        landmarkName: splitLandmark,
        isEntryNode: false,
        isThroneNode: false,
        unlocksSubmaps: [...orig.unlocksSubmaps],
        boss: {
          ...orig.boss,
          id: splitId,
          name: compName,
          title: `Comandante Regional • ${splitLandmark}`,
          avatarCardId: compCard.id,
          startingHp: 40,
          rewardCardIds: n2Rewards,
          loreIntro: `${compName} lidera o posto avançado em ${splitLandmark} (${rdef.name}). Vença o duelo para prosseguir pela estrada.`,
          archetypeId: compArch,
          deckId: compArch,
          landmarkName: splitLandmark,
          customDeckCardIds: [],
        },
      };
      delete n2.boss.companionCardId;

      submapExpandedNodes.push(n1, n2);
    }

    // Gentle repulsion on newly created split nodes so no two markers on the submap overlap (< 5.2% dist)
    const MIN_DIST = 5.4;
    for (let iter = 0; iter < 60; iter++) {
      for (let i = 0; i < submapExpandedNodes.length; i++) {
        const a = submapExpandedNodes[i];
        if (fixedOrigIds.has(a.id)) continue; // keep original 190 landmarks anchored!
        for (let j = 0; j < submapExpandedNodes.length; j++) {
          if (i === j) continue;
          const b = submapExpandedNodes[j];
          let dx = a.rx - b.rx;
          let dy = a.ry - b.ry;
          let d = Math.hypot(dx, dy);
          if (d < MIN_DIST) {
            if (d < 0.01) {
              dx = 1;
              dy = 0.5;
              d = Math.hypot(dx, dy);
            }
            const push = (MIN_DIST - d) * 0.65;
            a.rx = Math.max(9.5, Math.min(90.5, a.rx + (dx / d) * push));
            a.ry = Math.max(11.5, Math.min(88.5, a.ry + (dy / d) * push));
          }
        }
      }
    }
    for (const n of submapExpandedNodes) {
      n.rx = Math.round(n.rx * 10) / 10;
      n.ry = Math.round(n.ry * 10) / 10;
    }

    // Renumber submapOrder (1..K) and global stage (1..276)
    submapExpandedNodes.forEach((n, idx) => {
      globalStage += 1;
      n.submapOrder = idx + 1;
      n.stage = globalStage;
      n.boss.stage = globalStage;
      newNodes.push(n);
    });

    // Rebuild planar edges via topological path subdivision:
    // entry(X) = X, exit(X) = splitCompanionIdMap.get(X) ?? X
    const entryOf = (id: string) => id;
    const exitOf = (id: string) => splitCompanionIdMap.get(id) ?? id;

    const newEdges: Array<[string, string]> = [];
    const seenEdge = new Set<string>();
    const pushEdge = (a: string, b: string) => {
      if (a === b) return;
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seenEdge.has(key)) return;
      seenEdge.add(key);
      newEdges.push([a, b]);
    };

    for (const [origId, compNodeId] of splitCompanionIdMap.entries()) {
      pushEdge(origId, compNodeId);
    }

    for (const [u, v] of oldG.edges) {
      const ou = origOrderById.get(u) ?? 0;
      const ov = origOrderById.get(v) ?? 0;
      if (ou <= ov) {
        pushEdge(exitOf(u), entryOf(v));
      } else {
        pushEdge(exitOf(v), entryOf(u));
      }
    }

    // Portal gatekeepers: keep entry nodes on origId (preserves early border portals for existing saves),
    // and move deep/non-entry split gatekeepers to exitOf(gateId)
    const nextGatekeepers: Record<string, string> = {};
    for (const [targetRealm, gateId] of Object.entries(oldG.portalGatekeepers)) {
      const origGate = origNodeById.get(gateId);
      nextGatekeepers[targetRealm] = origGate?.isEntryNode ? gateId : exitOf(gateId);
    }

    newSubmapGraphs[rid] = {
      ...oldG,
      nodeIds: submapExpandedNodes.map((n) => n.id),
      edges: newEdges,
      portalGatekeepers: nextGatekeepers,
    };
  }

  const hydrationSection = `function resolveDomainsForAssignedChampion(
  primarySubmapDomain: Domain,
  champId: UnifiedChampionId,
  fallbackDomains: Domain[]
): Domain[] {
  let rawDomains: Domain[] = fallbackDomains;
  const mono = MONOCOLOR_ARCHETYPE_MASTERY[champId as MonocolorArchetypeId];
  const bi = BICOLOR_ARCHETYPE_MASTERY[champId as BicolorArchetypeId];
  const poly = POLYCOLOR_ARCHETYPE_MASTERY[champId as PolycolorArchetypeId];
  if (mono) {
    rawDomains = [mono.domain];
  } else if (bi) {
    rawDomains = [...bi.domains];
  } else if (poly) {
    rawDomains = [...poly.domains];
  }

  if (rawDomains.includes(primarySubmapDomain)) {
    return [
      primarySubmapDomain,
      ...rawDomains.filter((d) => d !== primarySubmapDomain),
    ];
  }
  return rawDomains;
}

// Hydrate all 276 Solo Grand Campaign encounters with their individual 100-card Signature Grimoires & symmetric 40 PV
for (const node of GRAND_CAMPAIGN_NODES) {
  node.boss.startingHp = 40;
  node.boss.difficultyTier = node.tier;
  const submapDom = VAELORIA_REGIONAL_MAPS[node.submapId]?.domain ?? node.boss.domains[0] ?? 'neutral';
  const assignedChamp = (node.boss.archetypeId as UnifiedChampionId | undefined) ?? undefined;
  if (assignedChamp) {
    node.boss.domains = resolveDomainsForAssignedChampion(
      submapDom,
      assignedChamp,
      node.boss.domains
    );
  }
  const graduated = resolveCampaignBossGraduatedSetup(node.boss);
  node.boss.deckId = graduated.archetypeId;
  node.boss.archetypeId = graduated.archetypeId;
  node.boss.archetypeTitle = graduated.archetypeTitle;
  node.boss.customDeckCardIds = buildIndividualSovereignSignatureDeck(
    node.boss.avatarCardId,
    graduated.archetypeId,
    node.tier
  );
}

`;

  const finalFile =
    headerBlock +
    `export const GRAND_CAMPAIGN_SUBMAP_GRAPHS: Record<VaeloriaRealmId, GrandCampaignSubmapGraph> = ${JSON.stringify(
      newSubmapGraphs,
      null,
      2
    )};\n\n` +
    `export const GRAND_CAMPAIGN_NODES: GrandCampaignEncounterNode[] = ${JSON.stringify(
      newNodes,
      null,
      2
    )};\n\n` +
    hydrationSection +
    tailBlock;

  fs.writeFileSync(srcPath, finalFile, 'utf8');
  console.log(
    `Successfully unbundled Grand Campaign: ${newNodes.length} solo 1x1 encounters across ${submapOrderList.length} submaps!`
  );
}

main();
