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
  'assets/data/apex-peak-score-corrections.js',
  'assets/data/apex-peak-component-audit.js',
  'assets/data/apex-peak-live-bonus.js',
  'assets/data/apex-peak-audit-dricus.js',
  'assets/data/canonical-apex-reconstruction.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_APEX_RECONSTRUCTION;
assert.equal(report?.applied,true,'Apex reconstruction should calculate successfully');
assert.equal(report.fighterCount,73,'All 73 canonical fighters must appear in the Apex audit');
assert.equal(report.auditedFighterCount,72,'The existing locked Apex system covers the 72 live-board fighters');
assert.equal(report.controlCoverage,72,'The frozen canonical snapshot covers the same 72 fighters');
assert.equal(report.exactFrozenControlParityCount,72,'Every recovered locked Apex score should reproduce its frozen control');
assert.equal(report.scoreDeltaCount,0,'Initial Apex reconstruction must not silently change approved scores');
assert.equal(report.missingAuditCount,1,'Leon Edwards should remain the only missing Apex audit');
assert.equal(report.missingControlCount,1,'Leon Edwards should remain the only missing frozen Apex control');
assert.deepEqual(JSON.parse(JSON.stringify(report.missingAudits.map(row=>row.fighter))),['Leon Edwards']);
assert.deepEqual(JSON.parse(JSON.stringify(report.missingControls.map(row=>row.fighter))),['Leon Edwards']);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);
assert.equal(report.mutatesScores,false);
assert.equal(report.rules.totalMax,6);
assert.equal(report.rules.twoPerformanceStrengthMax,2);
assert.equal(report.rules.proofMax,1.75);
assert.equal(report.rules.bestFighterClaimMax,1.25);
assert.equal(report.rules.auraMax,1);
assert.match(report.formula,/two counted UFC wins/i);
assert.match(report.formula,/24 months/i);

for(const row of report.fighters.filter(row=>Number.isFinite(row.reconstructedScore))){
  assert.ok(row.reconstructedScore>=0&&row.reconstructedScore<=6,`${row.fighter} Apex score must stay within 0–6`);
  assert.equal(row.stats.performances.length,2,`${row.fighter} should have two selected performances in the recovered audit`);
  assert.ok(Math.abs(row.stats.componentScore-row.reconstructedScore)<=.01,`${row.fighter} components should reproduce the score`);
  assert.equal(row.stats.manualNumericAdjustment,0);
}

const jones=report.entryFor('Jon Jones');
const khabib=report.entryFor('Khabib Nurmagomedov');
const amanda=report.entryFor('Amanda Nunes');
const gsp=report.entryFor('Georges St-Pierre');
const dj=report.entryFor('Demetrious Johnson');
const rose=report.entryFor('Rose Namajunas');
const carla=report.entryFor('Carla Esparza');
const figueiredo=report.entryFor('Deiveson Figueiredo');
const khamzat=report.entryFor('Khamzat Chimaev');
const leon=report.entryFor('Leon Edwards');

assert.equal(jones.reconstructedScore,6);
assert.equal(khabib.reconstructedScore,6);
assert.equal(amanda.reconstructedScore,6);
assert.ok([jones,khabib,amanda].every(row=>row.stats.windowCheck?.passed===true));
assert.ok([jones,khabib,amanda].every(row=>row.stats.performances.every(performance=>performance.validUfcWin)));
assert.equal(gsp.reconstructedScore,5.56);
assert.equal(dj.reconstructedScore,5.15);
assert.equal(leon.reconstructedScore,null);
assert.equal(leon.currentScore,null);

assert.equal(rose.stats.windowCheck?.passed,false,'Rose’s currently selected Joanna/Zhang pair exceeds the locked 24-month rule');
assert.equal(carla.stats.windowCheck?.passed,false,'Carla’s two Rose wins are years apart and require a compliant Apex pair');
assert.ok(figueiredo.stats.performances.some(performance=>performance.validUfcWin===false),'Figueiredo’s Moreno I draw cannot count as one of two selected UFC wins');
assert.ok(khamzat.stats.formulaIssues.some(issue=>/two-performance component/i.test(issue)),'Khamzat’s explicit two-performance override must be surfaced rather than hidden');
assert.ok(report.twentyFourMonthViolationCount>0,'The initial audit should identify noncompliant 24-month pairs');
assert.ok(report.invalidSelectedPerformanceCount>0,'The initial audit should identify selected performances that are not counted UFC wins');
assert.ok(report.formulaIssueFighterCount>0,'The initial audit should identify component-formula drift');
assert.ok(report.pendingReviewCount>0,'Apex requires a judgment review queue before promotion');

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-apex-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');

const leaders=report.fighters.filter(row=>Number.isFinite(row.reconstructedScore)).slice(0,15);
const selectionRows=report.selectionIssues.slice().sort((a,b)=>b.stats.factualIssues.length-a.stats.factualIssues.length||a.fighter.localeCompare(b.fighter));
const formulaRows=report.formulaIssues.slice().sort((a,b)=>b.stats.formulaIssues.length-a.stats.formulaIssues.length||a.fighter.localeCompare(b.fighter));
const markdown=[
  '# Canonical Apex Peak Reconstruction — Initial Shadow Audit','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Existing locked Apex audits recovered: **${report.auditedFighterCount}/${report.fighterCount}**`,
  `- Frozen controls available: **${report.controlCoverage}/${report.fighterCount}**`,
  `- Exact score parity: **${report.exactFrozenControlParityCount}/${report.controlCoverage}**`,
  `- Missing Apex audit/control: **${report.missingAudits.map(row=>row.fighter).join(', ')||'None'}**`,
  `- Fighters with selected-performance issues: **${report.selectionIssueFighterCount}**`,
  `- 24-month violations: **${report.twentyFourMonthViolationCount}**`,
  `- Invalid selected performances: **${report.invalidSelectedPerformanceCount}**`,
  `- Fighters with component-formula issues: **${report.formulaIssueFighterCount}**`,
  `- Pending review rows: **${report.pendingReviewCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Locked model','',
  `**${report.formula}**`,'',
  '- Two-performance strength is mechanical: average the two performance ratings, divide by 10, and multiply by 2.00.',
  '- Proof, Best-Fighter Claim, and Aura remain explicit reviewed judgment inputs.',
  '- Both selected performances must be counted UFC wins and must occur within one 24-month window.',
  '- No contests and losses cannot be used as the two Apex performances.',
  '- Losses inside the chosen window can still reduce Best-Fighter Claim or Aura.','',
  '## Recovered Apex leaders','',
  '| Rank | Fighter | Apex | Pair | Two-performance | Proof | Claim | Aura |',
  '|---:|---|---:|---|---:|---:|---:|---:|',
  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.auditWindow||'—'} | ${row.stats.components.twoPerformanceStrength.toFixed(2)} | ${row.stats.components.proof.toFixed(2)} | ${row.stats.components.bestFighterClaim.toFixed(2)} | ${row.stats.components.aura.toFixed(2)} |`),
  '',
  '## Selected-performance review queue','',
  ...(selectionRows.length?selectionRows.map(row=>`- **${row.fighter}:** ${row.stats.factualIssues.join('; ')}. Selected: ${(row.stats.performances||[]).map(performance=>`${performance.label} → ${performance.canonicalOpponent||'unmatched'} (${performance.canonicalDate||'no date'}, ${performance.officialResult||'no result'})`).join(' | ')}`):['- None']),
  '',
  '## Component-formula review queue','',
  ...(formulaRows.length?formulaRows.map(row=>`- **${row.fighter}:** ${row.stats.formulaIssues.join('; ')}`):['- None']),
  '',
  '## Missing fighter judgment','',
  '- **Leon Edwards:** needs a UFC-only two-win Apex pair and reviewed Proof / Best-Fighter Claim / Aura components.','',
  'This is a shadow reconstruction only. It does not write Apex scores, total scores, ranks, OVRs, profile values, or Compare Mode values into the live app.',''
].join('\n');
await fs.writeFile('docs/canonical-apex-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_APEX_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  auditedFighterCount:report.auditedFighterCount,
  controlCoverage:report.controlCoverage,
  exactFrozenControlParityCount:report.exactFrozenControlParityCount,
  scoreDeltaCount:report.scoreDeltaCount,
  missingAudits:report.missingAudits.map(row=>row.fighter),
  selectionIssueFighterCount:report.selectionIssueFighterCount,
  twentyFourMonthViolationCount:report.twentyFourMonthViolationCount,
  invalidSelectedPerformanceCount:report.invalidSelectedPerformanceCount,
  formulaIssueFighterCount:report.formulaIssueFighterCount,
  pendingReviewCount:report.pendingReviewCount,
  selectionReview:selectionRows.map(row=>({fighter:row.fighter,issues:row.stats.factualIssues,performances:row.stats.performances.map(performance=>({label:performance.label,date:performance.canonicalDate,result:performance.officialResult,validUfcWin:performance.validUfcWin}))})),
  formulaReview:formulaRows.map(row=>({fighter:row.fighter,issues:row.stats.formulaIssues})),
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
