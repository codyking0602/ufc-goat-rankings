import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
  'assets/data/ranking-data.js',
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js',
  'assets/data/canonical-fighter-facts-batch-four.js',
  'assets/data/canonical-fighter-facts-batch-five.js',
  'assets/data/canonical-fighter-facts-batch-six.js',
  'assets/data/canonical-fighter-facts-batch-seven-data-a.js',
  'assets/data/canonical-fighter-facts-batch-seven-data-b.js',
  'assets/data/canonical-fighter-facts-batch-seven.js',
  'assets/data/canonical-fighter-facts-batch-eight-data-a.js',
  'assets/data/canonical-fighter-facts-batch-eight-data-b.js',
  'assets/data/canonical-fighter-facts-batch-eight.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-a.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-b.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-c.js',
  'assets/data/canonical-fighter-facts-batch-nine.js',
  'assets/data/canonical-fighter-facts-approved-corrections.js',
  'assets/data/canonical-fighter-facts-opponent-quality-corrections.js',
  'assets/data/canonical-fighter-facts-prime-round-corrections.js',
  'assets/data/canonical-scoring-records.js',
  'assets/data/fighter-era-ledgers.js',
  'assets/data/fighter-era-ledger-approved-longevity-resolutions.js',
  'assets/data/fighter-era-ledger-approved-loss-context-resolutions.js',
  'assets/data/prime-windows.js',
  'assets/data/prime-round-control-audit.js',
  'assets/data/prime-dominance-ledgers.js',
  'assets/data/prime-dominance-shadow-model.js',
  'assets/data/canonical-prime-dominance-reconstruction.js',
  'assets/data/canonical-leon-final-category-completions.js'
];

const document={body:null,documentElement:{setAttribute(){}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const corrections=context.window.UFC_CANONICAL_FIGHTER_FACTS_PRIME_ROUND_CORRECTIONS;
const report=context.window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION;
const completion=context.window.UFC_CANONICAL_LEON_FINAL_CATEGORY_COMPLETIONS;
const before=JSON.stringify(context.window.RANKING_DATA);

assert.equal(corrections?.applied,true);
assert.equal(corrections.correctionCount,15);
assert.equal(corrections.expectedCorrectionCount,15);
assert.equal(corrections.missing.length,0);
assert.equal(report?.applied,true);
assert.equal(completion?.primeDominanceInstalled,true);
assert.equal(report.fighterCount,73);
assert.deepEqual(JSON.parse(JSON.stringify(report.excludedFighters)),[]);
assert.equal(report.controlCoverage,72);
assert.equal(report.effectiveControlCoverage,73);
assert.equal(report.factualCompletionCount,1);
assert.equal(report.eraLedgerCoverage,73);
assert.equal(report.missingPrimeRoundRowCount,0);
assert.equal(report.missingEliteStageRoundRowCount,0);
assert.equal(report.primeRoundRowCount,report.scoredPrimeFightCount);
assert.equal(report.mutatesRankingData,false);

const leon=report.entryFor('Leon Edwards');
assert.ok(leon);
assert.equal(leon.reconstructedScore,16.4);
assert.equal(leon.stats.recordText,'5-2, 1 NC');
assert.equal(leon.stats.roundControlPct,55.88);
assert.equal(leon.stats.missingRoundRows.length,0);
assert.equal(leon.stats.eliteLevelValidation.missingRoundRows.length,0);
assert.deepEqual(JSON.parse(JSON.stringify(leon.stats.components)),{primeRecord:6.43,roundControl:5.03,finishPressure:.5,eliteLevelValidation:4.44});
assert.equal(JSON.stringify(context.window.RANKING_DATA),before);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-prime-dominance-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
await fs.writeFile('docs/canonical-prime-dominance-reconstruction.md',[
  '# Canonical Prime Dominance Reconstruction — 73-Fighter Certification','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Frozen controls: **${report.controlCoverage}**`,
  `- Effective coverage: **${report.effectiveControlCoverage}**`,
  `- Factual completions: **${report.factualCompletionCount} — Leon Edwards**`,
  `- Shared Era Ledger coverage: **${report.eraLedgerCoverage}/${report.fighterCount}**`,
  `- Canonical round corrections: **${corrections.correctionCount}**`,
  `- Missing prime round rows: **${report.missingPrimeRoundRowCount}**`,
  `- Missing elite-stage round rows: **${report.missingEliteStageRoundRowCount}**`,
  `- Leon Edwards Prime Dominance: **${leon.reconstructedScore.toFixed(2)}**`,
  '- Live ranking payload changed: **No**',''
].join('\n'),'utf8');

console.log('CANONICAL_PRIME_DOMINANCE_FULL_ROSTER');
console.log(JSON.stringify({fighterCount:report.fighterCount,effectiveControlCoverage:report.effectiveControlCoverage,eraLedgerCoverage:report.eraLedgerCoverage,roundCorrections:corrections.correctionCount,leon:{score:leon.reconstructedScore,record:leon.stats.recordText,roundControlPct:leon.stats.roundControlPct},liveDataUnchanged:JSON.stringify(context.window.RANKING_DATA)===before},null,2));