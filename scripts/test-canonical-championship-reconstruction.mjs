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

const fighterRows=report.fighters.map(row=>`| ${row.fighter} | ${fmt(row.currentScore)} | ${fmt(row.reconstructedScore)} | ${signed(row.difference)} | ${row.titleFightWins} | ${fmt(row.adjustedTitleCredit)} | ${row.unmatchedLegacyRows.length} | ${row.unmatchedCanonicalWins.length} | ${row.titleTypeConflicts.length} | ${row.classification} |`);
const issueRows=report.fighters.flatMap(row=>row.issues.map(issue=>`| ${row.fighter} | ${issue.classification} | ${issue.reason.replace(/\|/g,'\\|')} |`));
const randy=report.randyTrace;
const randyRows=(randy?.inputs||[]).map(row=>`| ${row.opponent} | ${row.titleType} | ${fmt(row.baseCredit)} | ${fmt(row.opponentStrength)} | ${fmt(row.eraTitleContextAdjustment)} | ${fmt(row.finalAdjustedCredit)} | ${row.matchMethod} | ${row.decompositionStatus} |`);
const markdown=[
  '# Canonical Championship Reconstruction','',
  `- Version: \`${report.version}\``,
  `- Fighters: **${report.fighterCount}**`,
  `- Canonical parity controls: **${report.canonicalControlCoverage}/${report.fighterCount}**`,
  `- Missing canonical controls: **${report.missingControlFighters.join(', ')||'None'}**`,
  `- Exact score parity: **${report.exactParityCount}/${report.fighterCount}**`,
  `- Approved-score differences or missing controls: **${report.differenceCount}**`,
  `- Fighters with visible provenance/fact issues: **${report.issueFighterCount}**`,
  `- Unmatched legacy judgment rows: **${report.unmatchedLegacyRowCount}**`,
  `- Canonical title wins missing approved judgment rows: **${report.unmatchedCanonicalWinCount}**`,
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
  '| Fighter | Approved | Reconstructed | Difference | Title wins | Adjusted credit | Unmatched legacy | Missing judgment | Type conflicts | Classification |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|---|',
  ...fighterRows,'',
  '## Visible provenance and fact issues','',
  '| Fighter | Classification | Exact reason |',
  '|---|---|---|',
  ...(issueRows.length?issueRows:['| None | — | All recovered title inputs are connected and consistent. |']),'',
  '## Interpretation','',
  '- This is diagnostic only and does not mutate the published ranking data.',
  '- The approved score control is `UFC_CANONICAL_SCORING_RECORDS`, not the older static category values at the top of `ranking-data.js`.',
  '- Existing Championship judgment was recovered from the title ledgers plus the Couture/rule-lock adjustment layer.',
  '- No scoring philosophy, benchmark, title base value, or fighter score was changed.',
  '- Any true formula change remains blocked pending Cody’s explicit approval.',''
].join('\n');
await fs.writeFile('docs/canonical-championship-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_CHAMPIONSHIP_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  canonicalControlCoverage:report.canonicalControlCoverage,
  controlCoverage:report.controlCoverage,
  missingControlFighters:report.missingControlFighters,
  exactParityCount:report.exactParityCount,
  differenceCount:report.differenceCount,
  issueFighterCount:report.issueFighterCount,
  issueCount:report.issueCount,
  unmatchedLegacyRowCount:report.unmatchedLegacyRowCount,
  unmatchedCanonicalWinCount:report.unmatchedCanonicalWinCount,
  titleTypeConflictCount:report.titleTypeConflictCount,
  proposedModelChangeCount:report.proposedModelChangeCount,
  liveDataUnchanged:report.liveDataUnchanged,
  randy:{approved:randy?.currentScore,reconstructed:randy?.reconstructedScore,adjustedTitleCredit:randy?.adjustedTitleCredit,titleFightWins:randy?.titleFightWins,issues:randy?.issues},
  differences:report.fighters.filter(row=>!Number.isFinite(row.difference)||Math.abs(row.difference)>.01).map(row=>({fighter:row.fighter,controlSource:row.controlSource,currentScore:row.currentScore,reconstructedScore:row.reconstructedScore,difference:row.difference,issues:row.issues})),
  provenanceIssues:report.fighters.filter(row=>row.issues.length).map(row=>({fighter:row.fighter,issues:row.issues}))
},null,2));

assert.equal(report.fighterCount,73,'All 73 fighters must be reconstructed');
assert.equal(report.canonicalControlCoverage,73,'All 73 fighters must have an approved canonical Championship control');
assert.equal(report.controlCoverage,73,'All 73 fighters must have an approved Championship control');
assert.equal(report.exactParityCount,73,'The reconstruction must reproduce all 73 approved Championship scores');
assert.equal(report.differenceCount,0,'No approved Championship score may change silently');
assert.equal(report.proposedModelChangeCount,0,'No proposed model change belongs in this reconstruction');
assert.equal(report.liveDataUnchanged,true,'The reconstruction must not mutate RANKING_DATA');
assert.equal(randy.currentScore,15.85,'Randy approved Championship control');
assert.equal(randy.reconstructedScore,15.85,'Randy reconstructed Championship score');
assert.equal(randy.adjustedTitleCredit,7.68,'Randy adjusted title credit');
assert.equal(randy.titleFightWins,9,'Randy UFC title-fight wins represented');
