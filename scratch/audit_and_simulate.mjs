import fs from 'fs';
import path from 'path';
import ts from 'file:///c:/Users/thiag/OneDrive/Documentos/D&D/chromatic-pact/node_modules/typescript/lib/typescript.js';

const rootDir = 'c:/Users/thiag/OneDrive/Documentos/D&D/chromatic-pact/src';

const cache = {};
function loadTsModule(relPath) {
  const fullPath = path.resolve(rootDir, relPath);
  if (cache[fullPath]) return cache[fullPath].exports;

  const code = fs.readFileSync(fullPath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const mod = { exports: {} };
  cache[fullPath] = mod;

  const dirname = path.dirname(fullPath);
  const customRequire = (reqPath) => {
    if (reqPath.startsWith('.')) {
      let target = path.resolve(dirname, reqPath);
      if (!fs.existsSync(target) && fs.existsSync(target + '.ts')) {
        target = target + '.ts';
      }
      return loadTsModule(path.relative(rootDir, target));
    }
    throw new Error('External require not supported: ' + reqPath);
  };

  const fn = new Function('exports', 'require', 'module', transpiled);
  fn(mod.exports, customRequire, mod);
  return mod.exports;
}

const { ALL_CARDS, CARDS_BY_ID } = loadTsModule('data/cards.ts');
const { PREBUILT_DECKS, CAMPAIGN_BOSSES } = loadTsModule('data/decks.ts');
const gameEngine = loadTsModule('engine/gameEngine.ts');
const aiEngine = loadTsModule('engine/aiEngine.ts');

console.log(`=== 1. AUDITORIA DE CARTAS POR ELEMENTO (${ALL_CARDS.length} CARTAS) ===`);
const domains = ['red', 'blue', 'purple', 'green', 'gold', 'neutral'];
for (const dom of domains) {
  const cards = ALL_CARDS.filter((c) => c.domain === dom);
  const byType = { creature: 0, spell: 0, reaction: 0, relic: 0 };
  const byRarity = { common: 0, uncommon: 0, rare: 0, legendary: 0 };
  const byAff = { 0: 0, 1: 0, 2: 0, 3: 0 };
  let totalCost = 0;
  let creatureCount = 0;
  let totalStatEff = 0;
  let ascCount = 0;

  for (const c of cards) {
    byType[c.type] = (byType[c.type] || 0) + 1;
    byRarity[c.rarity] = (byRarity[c.rarity] || 0) + 1;
    byAff[c.affinityReq] = (byAff[c.affinityReq] || 0) + 1;
    totalCost += c.cost;
    if (c.ascension) ascCount++;
    if (c.type === 'creature') {
      creatureCount++;
      const statVal = c.atk + c.hp + (c.armor || 0) * 1.5 + (c.keywords?.length || 0) * 0.8;
      totalStatEff += statVal / Math.max(1, c.cost);
    }
  }

  console.log(
    `Domain [${dom.toUpperCase()}]: Total=${cards.length} | Types=${JSON.stringify(byType)} | Rarity=${JSON.stringify(byRarity)} | AffReq=${JSON.stringify(byAff)} | AvgCost=${(totalCost / cards.length).toFixed(2)} | AvgCreatureEff=${(totalStatEff / Math.max(1, creatureCount)).toFixed(2)} | Ascensions=${ascCount}`
  );
}
