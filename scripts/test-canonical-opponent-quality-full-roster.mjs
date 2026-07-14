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
  'assets/data/canonical-scoring-records.js',
  'assets/data/opponent-quality-ledgers.js',
  'assets/data/opponent-quality-ledger-batch-four.js',
  'assets/data/opponent-quality-ledger-batch-five.js',
  'assets/data/opponent-quality-ledger-batch-six.js',
  'assets/data/opponent-quality-ledger-batch-seven.js',
  'assets/data/opponent-quality-ledger-batch-eight.js',
  'assets/data/opponent-quality-ledger-batch-nine.js',
  'assets/data/canonical-opponent-quality-approved-judgments.js',
  'assets/data/canonical-opponent-quality-reconstruction.js',
  'assets/data/canonical-leon-final-category-completions.js'
];

const document={body:null,documentElement:{setAttribute(){}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION;
const completion=context.window.UFC_CANONICAL_LEON_FINAL_CATEGORY_COMPLETIONS;
const before=JSON.stringify(context.window.RANKING_DATA);

assert.equal(report?.applied,true);
assert.equal(completion?.opponentQualityInstalled,true);
assert.equal(report.fighterCount,73);
assert.deepEqual(JSON.parse(JSON.stringify(report.excludedFighters)),[]);
assert.equal(report.canonicalControlCoverage,72);
assert.equal(report.effectiveControlCoverage,73);
assert.equal(report.factualCompletionCount,1);
assert.equal(report.canonicalWinCount,report.inputCount);
assert.equal(report.unresolvedConflictCount,0);
assert.equal(report.remainingConflictCount,0);
assert.equal(report.mutatesRankingData,false);

const leon=report.entryFor('Leon Edwards');
assert.ok(leon);
assert.equal(leon.reconstructedScore,21.01);
assert.equal(leon.rawCredit,11.4);
assert.equal(leon.diminishedCredit,9.875);
assert.equal(leon.topFiveWins,4);
assert.equal(leon.championLevelWins,2);
assert.equal(leon.rankedQualityWins,11);
assert.equal(leon.fighterAdjustment,0);
assert.equal(leon.canonicalWinCount,14);
assert.equal(leon.inputCount,14);
assert.equal(leon.inputs.every(row=>Boolean(row.fightId)),true);
assert.equal(JSON.stringify(context.window.RANKING_DATA),before);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-opponent-quality-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
await fs.writeFile('docs/canonical-opponent-quality-reconstruction.md',[
  '# Canonical Opponent Quality Reconstruction — 73-Fighter Certification','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Frozen controls: **${report.canonicalControlCoverage}**`,
  `- Effective coverage: **${report.effectiveControlCoverage}**`,
  `- Factual completions: **${report.factualCompletionCount} — Leon Edwards**`,
  `- Canonical official UFC wins scored: **${report.canonicalWinCount}**`,
  `- One-to-one fight input coverage: **${report.inputCount}/${report.canonicalWinCount}**`,
  `- Remaining conflicts: **${report.remainingConflictCount}**`,
  `- Leon Edwards Opponent Quality: **${leon.reconstructedScore.toFixed(2)}**`,
  '- Live ranking payload changed: **No**',''
].join('\n'),'utf8');

console.log('CANONICAL_OPPONENT_QUALITY_FULL_ROSTER');
console.log(JSON.stringify({fighterCount:report.fighterCount,effectiveControlCoverage:report.effectiveControlCoverage,canonicalWinCount:report.canonicalWinCount,inputCount:report.inputCount,leon:{score:leon.reconstructedScore,topFiveWins:leon.topFiveWins,championLevelWins:leon.championLevelWins,rankedQualityWins:leon.rankedQualityWins},liveDataUnchanged:JSON.stringify(context.window.RANKING_DATA)===before},null,2));