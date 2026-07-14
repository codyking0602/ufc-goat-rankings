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
  'assets/data/canonical-scoring-records.js',
  'assets/data/championship-resume-ledgers.js',
  'assets/data/championship-resume-ledger-rule-locks.js',
  'assets/data/canonical-championship-reconstruction.js'
];

const attributes={};
const document={documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION;
if(!report?.applied)console.log('CHAMPIONSHIP_RECONSTRUCTION_PREREQUISITE_FAILURE',JSON.stringify(report,null,2));
assert.equal(report?.applied,true,'Championship reconstruction should calculate successfully');

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
const fmt=value=>Number.isFinite(Number(value))?Number(value).toFixed(2):'—';
const signed=value=>Number.isFinite(Number(value))?`${Number(value)>0?'+':''}${Number(value).toFixed(2)}`:'—';
const serializable=clean(report);
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-championship-reconstruction.json',`${JSON.stringify(serializable,null,2)}\n`,'utf8');

const fighterRows=report.fighters.map(row=>`| ${row.fighter} | ${fmt(row.currentScore)} | ${fmt(row.reconstructedScore)} | ${signed(row.difference)} | ${row.titleFightWins} | ${row.championshipAccomplishmentRows} | ${fmt(row.adjustedTitleCredit)} | ${row.pendingJudgmentRows.length} | ${row.titleTypeConflicts.length} | ${row.classification} |`);
const issueRows=report.fighters.flatMap(row=>row.issues.map(issue=>`| ${row.fighter} | ${issue.classification} | ${issue.reason.replace(/\|/g,'\\|')} |`));
const randy=report.randyTrace;
const randyRows=(randy?.inputs||[]).map(row=>`| ${row.opponent} | ${row.titleType} | ${fmt(row.baseCredit)} | ${fmt(row.opponentStrength)} | ${fmt(row.eraTitleContextAdjustment)} | ${fmt(row.finalAdjustedCredit)} | ${row.matchMethod} | ${row.decompositionStatus} |`);
const markdown=[
  '# Canonical Championship Reconstruction','',
  `- Version: \`${report.version}\``,
  `- Canonical fighters processed: **${report.fighterCount}**`,
  `- Approved live controls: **${report.canonicalControlCoverage}**`,
  `- Exact parity against approved controls: **${report.exactParityCount}/${report.canonicalControlCoverage}**`,
  `- Controlled score differences: **${report.controlledDifferenceCount}**`,
  `- Missing approved controls: **${report.missingControlFighters.join(', ')||'None'}**`,
  `- Aggregate judgments recovered from approved scores: **${report.aggregateRecoveryFighterCount} fighters**`,
  `- Canonical title wins pending judgment review: **${report.pendingCanonicalJudgmentCount}**`,
  `- Title-type conflicts: **${report.titleTypeConflictCount}**`,
  `- Proposed model changes: **${report.proposedModelChangeCount}**`,
  `- Live ranking payload unchanged: **${report.liveDataUnchanged}**`,
  `- Locked benchmark credit: **${fmt(report.benchmarkCredit)}**`,'',
  '## Recovered approved formula','',
  `\`${report.formula}\``,'',
  report.inputSeparationNote,'',
  '## Randy Couture traceability test','',
  `- Approved Championship score: **${fmt(randy?.currentScore)}/30**`,
  `- Reconstructed Championship score: **${fmt(randy?.reconstructedScore)}/30**`,
  `- Adjusted title credit: **${fmt(randy?.adjustedTitleCredit)}**`,
  `- UFC title-fight wins represented: **${randy?.titleFightWins}**`,'',
  '| Opponent | Title type | Base | Opponent strength | Era/title context | Final credit | Canonical match | Input status |',
  '|---|---|---:|---:|---:|---:|---|---|',
  ...randyRows,'',
  '## All 73 fighters','',
  '| Fighter | Approved | Reconstructed | Difference | Title-fight wins | Championship rows | Adjusted credit | Pending judgments | Type conflicts | Classification |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|---|',
  ...fighterRows,'',
  '## Visible provenance and fact issues','',
  '| Fighter | Classification | Exact reason |',
  '|---|---|---|',
  ...(issueRows.length?issueRows:['| None | — | All recovered title inputs are connected and consistent. |']),'',
  '## Interpretation','',
  '- This is diagnostic only and does not mutate the published ranking data.',
  '- The approved score control is the 72-fighter live runtime snapshot frozen in `UFC_CANONICAL_SCORING_RECORDS`.',
  '- Leon Edwards is the 73rd canonical fighter but has no live ranking row or approved Championship control; his Phase 2 score remains diagnostic and was not promoted.',
  '- Missing direct title ledgers were recovered to exact aggregate parity without changing any approved score.',
  '- Canonical title wins omitted by the approved control are displayed as zero-credit factual-correction rows pending Cody review.',
  '- Any true formula or score change remains blocked pending Cody’s explicit approval.',''
].join('\n');
await fs.writeFile('docs/canonical-championship-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_CHAMPIONSHIP_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  canonicalControlCoverage:report.canonicalControlCoverage,
  missingControlFighters:report.missingControlFighters,
  exactParityCount:report.exactParityCount,
  controlledDifferenceCount:report.controlledDifferenceCount,
  unresolvedControlCount:report.unresolvedControlCount,
  aggregateRecoveryFighterCount:report.aggregateRecoveryFighterCount,
  pendingCanonicalJudgmentCount:report.pendingCanonicalJudgmentCount,
  issueFighterCount:report.issueFighterCount,
  issueCount:report.issueCount,
  unmatchedLegacyRowCount:report.unmatchedLegacyRowCount,
  titleTypeConflictCount:report.titleTypeConflictCount,
  proposedModelChangeCount:report.proposedModelChangeCount,
  liveDataUnchanged:report.liveDataUnchanged,
  randy:{approved:randy?.currentScore,reconstructed:randy?.reconstructedScore,adjustedTitleCredit:randy?.adjustedTitleCredit,titleFightWins:randy?.titleFightWins,issues:randy?.issues},
  controlledDifferences:report.fighters.filter(row=>row.controlSource==='canonical-scoring-records'&&(!Number.isFinite(row.difference)||Math.abs(row.difference)>.01)).map(row=>({fighter:row.fighter,currentScore:row.currentScore,reconstructedScore:row.reconstructedScore,difference:row.difference,issues:row.issues})),
  unresolvedControls:report.fighters.filter(row=>row.controlSource!=='canonical-scoring-records').map(row=>({fighter:row.fighter,currentScore:row.currentScore,reconstructedScore:row.reconstructedScore,inputs:row.inputs,issues:row.issues})),
  reviewIssues:report.fighters.filter(row=>row.issues.length).map(row=>({fighter:row.fighter,issues:row.issues}))
},null,2));

assert.equal(report.fighterCount,73,'All 73 canonical fighters must be reconstructed or explicitly held unresolved');
assert.equal(report.canonicalControlCoverage,72,'The current approved live scoring snapshot contains 72 fighters');
assert.equal(report.controlCoverage,72,'No fallback may be mistaken for an approved live control');
assert.equal(report.exactParityCount,72,'All 72 approved live Championship scores must reproduce exactly');
assert.equal(report.controlledDifferenceCount,0,'No approved Championship score may change silently');
assert.equal(report.unresolvedControlCount,1,'Exactly one canonical fighter lacks an approved live control');
assert.equal(JSON.stringify(report.missingControlFighters),JSON.stringify(['Leon Edwards']),'Leon Edwards is the explicit live-control gap');
assert.equal(report.proposedModelChangeCount,0,'No proposed model change belongs in this reconstruction');
assert.equal(report.liveDataUnchanged,true,'The reconstruction must not mutate RANKING_DATA');
assert.equal(randy.currentScore,15.85,'Randy approved Championship control');
assert.equal(randy.reconstructedScore,15.85,'Randy reconstructed Championship score');
assert.equal(randy.adjustedTitleCredit,7.68,'Randy adjusted title credit');
assert.equal(randy.titleFightWins,9,'Randy UFC title-fight wins represented');
