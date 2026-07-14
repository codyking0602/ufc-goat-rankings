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
  'assets/data/division-era-depth-shadow.js'
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

for(const row of report.fighters.filter(row=>row.shadowAdjustment!==null)){
  assert.ok(row.shadowAdjustment>=-3&&row.shadowAdjustment<=0.75,`${row.fighter} adjustment must stay within range`);
  assert.equal(row.recomputedAdjustment,row.shadowAdjustment,`${row.fighter} curved formula must reproduce the shadow value`);
  assert.ok(row.divisionStrengthKey,`${row.fighter} must retain separate division-strength context`);
}

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-division-era-depth-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');

const positives=report.fighters.filter(row=>(row.shadowAdjustment??0)>0).slice(0,15);
const negatives=[...report.fighters].filter(row=>(row.shadowAdjustment??0)<0).sort((a,b)=>a.shadowAdjustment-b.shadowAdjustment).slice(0,20);
const markdown=[
  '# Canonical Division-Era Depth Reconstruction — Initial Audit','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Existing empirical rows: **${report.shadowCoverageCount}/${report.fighterCount}**`,
  `- Frozen canonical controls: **${report.canonicalControlCoverageCount}/${report.fighterCount}**`,
  `- Clean rows: **${report.cleanCount}**`,
  `- Missing empirical rows: **${report.missingShadowCount}**`,
  `- Curve/formula issues: **${report.formulaIssueCount}**`,
  `- Canonical-control issues: **${report.controlIssueCount}**`,
  `- Review queue: **${report.reviewQueueCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Locked mechanics','',
  `**${report.formula}**`,'',
  '- Era depth is normalized within each division and time period.',
  '- Canonical division-strength keys remain separate context and are not multiplied into this adjustment.',
  '- Women’s featherweight samples are excluded because the division lacks a viable ranks-6–15 baseline.','',
  '## Review queue','',
  '| Fighter | Status | Depth index | Shadow | Canonical | Division-strength key | Issues |',
  '|---|---|---:|---:|---:|---|---|',
  ...report.reviewQueue.map(row=>`| ${row.fighter} | ${row.status} | ${row.depthIndex===null?'—':row.depthIndex.toFixed(2)} | ${row.shadowAdjustment===null?'—':row.shadowAdjustment.toFixed(2)} | ${row.canonicalAdjustment===null?'—':row.canonicalAdjustment.toFixed(2)} | ${row.divisionStrengthKey||'—'} | ${row.issues.join('; ')} |`),
  '',
  '## Largest positive adjustments','',
  '| Fighter | Adjustment | Depth index | Sampled divisions |',
  '|---|---:|---:|---|',
  ...positives.map(row=>`| ${row.fighter} | +${row.shadowAdjustment.toFixed(2)} | ${row.depthIndex.toFixed(2)} | ${(row.sampledDivisions||[]).join(', ')||'—'} |`),
  '',
  '## Largest negative adjustments','',
  '| Fighter | Adjustment | Depth index | Sampled divisions |',
  '|---|---:|---:|---|',
  ...negatives.map(row=>`| ${row.fighter} | ${row.shadowAdjustment.toFixed(2)} | ${row.depthIndex.toFixed(2)} | ${(row.sampledDivisions||[]).join(', ')||'—'} |`),
  '',
  'This remains shadow-only. No live category score, total, rank, OVR, profile, or Compare Mode value was changed.',''
].join('\n');
await fs.writeFile('docs/canonical-division-era-depth-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_DIVISION_ERA_DEPTH_RECONSTRUCTION_INITIAL_AUDIT');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  shadowCoverageCount:report.shadowCoverageCount,
  canonicalControlCoverageCount:report.canonicalControlCoverageCount,
  cleanCount:report.cleanCount,
  missingShadowCount:report.missingShadowCount,
  formulaIssueCount:report.formulaIssueCount,
  controlIssueCount:report.controlIssueCount,
  reviewQueueCount:report.reviewQueueCount,
  reviewQueue:report.reviewQueue.map(row=>({fighter:row.fighter,status:row.status,depthIndex:row.depthIndex,shadowAdjustment:row.shadowAdjustment,canonicalAdjustment:row.canonicalAdjustment,divisionStrengthKey:row.divisionStrengthKey,issues:row.issues})),
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
