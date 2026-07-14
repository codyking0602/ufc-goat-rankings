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
  'assets/data/canonical-scoring-records.js',
  'assets/data/championship-resume-ledgers.js',
  'assets/data/championship-resume-ledger-rule-locks.js',
  'assets/data/canonical-championship-reconstruction.js',
  'assets/data/canonical-championship-approved-resolutions.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION;
const resolutions=context.window.UFC_CANONICAL_CHAMPIONSHIP_APPROVED_RESOLUTIONS;
const facts=context.window.UFC_CANONICAL_FIGHTER_FACTS;
assert.equal(report?.applied,true,'Championship reconstruction should calculate successfully');
assert.equal(resolutions?.applied,true,'Approved resolutions should apply successfully');
assert.equal(report.fighterCount,72,'Leon Edwards is excluded from the Championship audit');
assert.deepEqual(report.excludedFighters,['Leon Edwards']);
assert.equal(report.entryFor('Leon Edwards'),null,'Leon must not appear in the Championship audit');
assert.equal(report.canonicalControlCoverage,72);
assert.equal(report.exactParityCount,72);
assert.equal(report.controlledDifferenceCount,0);
assert.equal(report.unresolvedControlCount,0);
assert.equal(report.approvedScoreCorrectionCount,3);
assert.equal(report.pendingCanonicalJudgmentCount,0);
assert.equal(report.unmatchedLegacyRowCount,0);
assert.equal(report.titleTypeConflictCount,0);
assert.equal(report.remainingConflictCount,0);
assert.equal(report.allApprovedConflictsResolved,true);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);

const randyFact=facts.get('Randy Couture').fights.find(row=>row.id==='2003-09-26-tito-ortiz');
const pennFact=facts.get('B.J. Penn').fights.find(row=>row.id==='2008-01-19-joe-stevenson');
assert.equal(randyFact.championshipContext.type,'second-division-undisputed');
assert.equal(pennFact.championshipContext.type,'vacant-second-division');

const whittaker=report.entryFor('Robert Whittaker');
const romero=whittaker.inputs.find(row=>row.titleType==='missed-weight-championship-context');
assert.equal(whittaker.currentScore,3.01);
assert.equal(whittaker.reconstructedScore,3.01);
assert.equal(whittaker.titleFightWins,1,'Romero II is not an official UFC title-fight win');
assert.equal(whittaker.championshipAccomplishmentRows,2);
assert.equal(romero.finalAdjustedCredit,.75);
assert.equal(romero.officialTitleFight,false);
assert.equal(romero.fightId!==null,true);

const israel=report.entryFor('Israel Adesanya');
const gastelum=israel.inputs.find(row=>row.opponent==='Kelvin Gastelum');
assert.equal(israel.originalControlScore,13.31);
assert.equal(israel.currentScore,14.98);
assert.equal(israel.reconstructedScore,14.98);
assert.equal(israel.adjustedTitleCredit,7.26);
assert.equal(gastelum.titleType,'interim');
assert.equal(gastelum.finalAdjustedCredit,.71);

const max=report.entryFor('Max Holloway');
const frankie=max.inputs.find(row=>row.opponent==='Frankie Edgar');
assert.equal(max.originalControlScore,7.10);
assert.equal(max.currentScore,8.95);
assert.equal(max.reconstructedScore,8.95);
assert.equal(max.adjustedTitleCredit,4.34);
assert.equal(frankie.finalAdjustedCredit,.90);

const zhang=report.entryFor('Zhang Weili');
const suarez=zhang.inputs.find(row=>row.opponent==='Tatiana Suarez');
assert.equal(zhang.originalControlScore,9.70);
assert.equal(zhang.currentScore,11.66);
assert.equal(zhang.reconstructedScore,11.66);
assert.equal(zhang.adjustedTitleCredit,5.65);
assert.equal(suarez.finalAdjustedCredit,.95);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-championship-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
const markdown=[
  '# Canonical Championship Reconstruction — Approved Review Complete','',
  `- Fighters in Championship audit: **${report.fighterCount}**`,
  `- Excluded from this audit: **${report.excludedFighters.join(', ')}**`,
  `- Exact approved-score parity: **${report.exactParityCount}/${report.canonicalControlCoverage}**`,
  `- Remaining Championship conflicts: **${report.remainingConflictCount}**`,
  `- Pending title judgments: **${report.pendingCanonicalJudgmentCount}**`,
  `- Unmatched legacy rows: **${report.unmatchedLegacyRowCount}**`,
  `- Title-type conflicts: **${report.titleTypeConflictCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Final approved decisions','',
  '| Fighter | Decision | Championship score |',
  '|---|---|---:|',
  '| Robert Whittaker | Romero II: 0.75 special-context credit; not an official title-fight win | 3.01 |',
  '| Israel Adesanya | Gastelum interim win: 0.71 credit | 14.98 |',
  '| Max Holloway | Frankie Edgar defense: 0.90 credit | 8.95 |',
  '| Zhang Weili | Tatiana Suarez defense: 0.95 credit | 11.66 |','',
  'All eight reviewed Championship conflicts are resolved. The ten aggregate-recovery notices are provenance notes, not unresolved scoring conflicts.',''
].join('\n');
await fs.writeFile('docs/canonical-championship-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_CHAMPIONSHIP_FINAL_RESOLUTIONS');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  excludedFighters:report.excludedFighters,
  exactParityCount:report.exactParityCount,
  remainingConflictCount:report.remainingConflictCount,
  pendingCanonicalJudgmentCount:report.pendingCanonicalJudgmentCount,
  unmatchedLegacyRowCount:report.unmatchedLegacyRowCount,
  titleTypeConflictCount:report.titleTypeConflictCount,
  scores:{whittaker:whittaker.currentScore,israel:israel.currentScore,max:max.currentScore,zhang:zhang.currentScore},
  liveDataUnchanged:report.liveDataUnchanged
},null,2));