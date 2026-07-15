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
  'assets/data/division-era-depth-shadow.js',
  'assets/data/canonical-division-era-depth-approved-resolutions.js'
];

class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const attributes={};
const document={documentElement:{setAttribute(name,value){attributes[name]=value;}},body:null,querySelector(){return null;},querySelectorAll(){return[];}};
const window={dispatchEvent(){return true;}};
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const liveBefore=JSON.stringify(context.window.RANKING_DATA);
vm.runInContext(await fs.readFile('assets/data/canonical-division-era-depth-reconstruction.js','utf8'),context,{filename:'assets/data/canonical-division-era-depth-reconstruction.js'});
const report=context.window.UFC_CANONICAL_DIVISION_ERA_DEPTH_RECONSTRUCTION;

assert.equal(report?.applied,true,'Division-Era Depth reconstruction should calculate');
assert.equal(report.fighterCount,73,'All 73 canonical fighters must be audited');
assert.equal(report.sourceShadowVersion,'division-era-depth-shadow-20260712e-roster-72');
assert.equal(report.approvedResolutionVersion,'canonical-division-era-depth-approved-resolutions-20260714b-leon-shared-era');
assert.equal(report.shadowCoverageCount,73,'All 73 fighters must have empirical era-depth coverage');
assert.equal(report.canonicalControlCoverageCount,73,'All 73 fighters must have an approved control');
assert.equal(report.frozenControlCoverageCount,72,'The frozen runtime controls remain unchanged at 72');
assert.equal(report.approvedCompletionControlCount,1,'Leon is the only approved factual completion');
assert.equal(report.cleanCount,73,'All 73 fighters must reconstruct cleanly');
assert.equal(report.missingShadowCount,0);
assert.equal(report.formulaIssueCount,0);
assert.equal(report.controlIssueCount,0);
assert.equal(report.reviewQueueCount,0);
assert.equal(report.liveDataUnchanged,true);
assert.equal(JSON.stringify(context.window.RANKING_DATA),liveBefore,'Shadow reconstruction must not mutate live ranking data');
assert.equal(report.mutatesRankingData,false);
assert.equal(report.mutatesScores,false);
assert.equal(report.mutatesRanks,false);
assert.equal(report.mutatesOvr,false);
assert.equal(report.rules.range.min,-3);
assert.equal(report.rules.range.max,0.75);
assert.deepEqual(JSON.parse(JSON.stringify(report.rules.componentWeights)),{qualifiedActivePool:0.3,ranksSixToFifteenElo:0.5,contenderDiversity:0.2});
assert.match(report.rules.divisionStrengthSeparation,/never multiplied/i);
assert.match(report.rules.phaseSource,/shared Fighter Era Ledger/i);

for(const row of report.fighters.filter(row=>row.shadowAdjustment!==null)){
  assert.ok(row.shadowAdjustment>=-3&&row.shadowAdjustment<=0.75,`${row.fighter} adjustment must stay within range`);
  assert.equal(row.recomputedAdjustment,row.shadowAdjustment,`${row.fighter} curved formula must reproduce the approved value`);
  assert.ok(row.divisionStrengthKey,`${row.fighter} must retain separate division-strength context`);
}

const leon=report.entryFor('Leon Edwards');
assert.equal(leon?.status,'clean');
assert.equal(leon.depthIndexPrecise,1.0032);
assert.equal(leon.depthIndex,1);
assert.equal(leon.shadowAdjustment,0.06);
assert.equal(leon.recomputedAdjustment,0.06);
assert.equal(leon.canonicalAdjustment,0.06);
assert.equal(leon.controlProvenance,'approved-factual-completion');
assert.equal(leon.resolutionApplied,true);
assert.equal(leon.phaseSource,'fighter-era-ledgers');
assert.equal(leon.judgmentClassification,'factual-completion');
assert.equal(leon.approvalStatus,'cody-approved');
assert.deepEqual(JSON.parse(JSON.stringify(leon.sampledDivisions)),['WW']);
assert.equal(leon.matchedPrimeFightCount,8);
assert.equal(leon.scoredSampleCount,8);
assert.equal(leon.titleWeightedSampleCount,4);
assert.deepEqual(JSON.parse(JSON.stringify(leon.componentRatios)),{qualifiedActivePool:1.0071,ranksSixToFifteenElo:0.9952,contenderDiversity:1.0173});
assert.equal(leon.primeStart,'2019-07-20');
assert.equal(leon.primeEnd,'2025-03-22');
assert.equal(leon.openPrime,false);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-division-era-depth-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');

const positives=report.fighters.filter(row=>(row.shadowAdjustment??0)>0).slice(0,15);
const negatives=[...report.fighters].filter(row=>(row.shadowAdjustment??0)<0).sort((a,b)=>a.shadowAdjustment-b.shadowAdjustment).slice(0,20);
const markdown=[
  '# Canonical Division-Era Depth Reconstruction — Complete Audit','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Empirical/approved source coverage: **${report.shadowCoverageCount}/${report.fighterCount}**`,
  `- Frozen runtime controls preserved: **${report.frozenControlCoverageCount}**`,
  `- Approved factual completions: **${report.approvedCompletionControlCount}**`,
  `- Clean rows: **${report.cleanCount}**`,
  `- Missing empirical rows: **${report.missingShadowCount}**`,
  `- Curve/formula issues: **${report.formulaIssueCount}**`,
  `- Canonical-control issues: **${report.controlIssueCount}**`,
  `- Review queue: **${report.reviewQueueCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Leon Edwards factual completion','',
  `- Shared Fighter Era Ledger window: **${leon.primeStart} through ${leon.primeEnd}**`,
  `- Sampled UFC welterweight fights: **${leon.matchedPrimeFightCount}**`,
  `- Title-weighted samples: **${leon.titleWeightedSampleCount}**`,
  `- Depth index: **${leon.depthIndexPrecise.toFixed(4)}**`,
  `- Component ratios: pool **${leon.componentRatios.qualifiedActivePool.toFixed(4)}**, ranks 6–15 Elo **${leon.componentRatios.ranksSixToFifteenElo.toFixed(4)}**, contender diversity **${leon.componentRatios.contenderDiversity.toFixed(4)}**`,
  `- Approved curved adjustment: **+${leon.shadowAdjustment.toFixed(2)}**`,
  '- Classification: **factual completion**. The existing empirical model was applied with the approved shared phase window and without changing its source, weights, curve, or division-strength treatment.','',
  '## Locked mechanics','',
  `**${report.formula}**`,'',
  '- Era depth is normalized within each division and time period.',
  '- Canonical division-strength keys remain separate context and are not multiplied into this adjustment.',
  '- Approved factual completions use the shared Fighter Era Ledger as the phase source.',
  '- Women’s featherweight samples are excluded because the division lacks a viable ranks-6–15 baseline.','',
  '## Review queue','',
  report.reviewQueue.length?'| Fighter | Status | Issues |\n|---|---|---|\n'+report.reviewQueue.map(row=>`| ${row.fighter} | ${row.status} | ${row.issues.join('; ')} |`).join('\n'):'**None.**','',
  '## Largest positive adjustments','',
  '| Fighter | Adjustment | Depth index | Sampled divisions |',
  '|---|---:|---:|---|',
  ...positives.map(row=>`| ${row.fighter} | +${row.shadowAdjustment.toFixed(2)} | ${row.depthIndexPrecise.toFixed(4)} | ${(row.sampledDivisions||[]).join(', ')||'—'} |`),
  '',
  '## Largest negative adjustments','',
  '| Fighter | Adjustment | Depth index | Sampled divisions |',
  '|---|---:|---:|---|',
  ...negatives.map(row=>`| ${row.fighter} | ${row.shadowAdjustment.toFixed(2)} | ${row.depthIndexPrecise.toFixed(4)} | ${(row.sampledDivisions||[]).join(', ')||'—'} |`),
  '',
  'This remains shadow-only. No live category score, total, rank, OVR, profile, or Compare Mode value was changed.',''
].join('\n');
await fs.writeFile('docs/canonical-division-era-depth-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_DIVISION_ERA_DEPTH_RECONSTRUCTION_COMPLETE');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  shadowCoverageCount:report.shadowCoverageCount,
  canonicalControlCoverageCount:report.canonicalControlCoverageCount,
  frozenControlCoverageCount:report.frozenControlCoverageCount,
  approvedCompletionControlCount:report.approvedCompletionControlCount,
  cleanCount:report.cleanCount,
  missingShadowCount:report.missingShadowCount,
  formulaIssueCount:report.formulaIssueCount,
  controlIssueCount:report.controlIssueCount,
  reviewQueueCount:report.reviewQueueCount,
  leon:{depthIndex:leon.depthIndexPrecise,adjustment:leon.shadowAdjustment,matchedPrimeFightCount:leon.matchedPrimeFightCount,titleWeightedSampleCount:leon.titleWeightedSampleCount,componentRatios:leon.componentRatios},
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
