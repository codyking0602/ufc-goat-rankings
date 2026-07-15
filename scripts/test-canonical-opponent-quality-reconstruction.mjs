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
  'assets/data/canonical-opponent-quality-reconstruction.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION;
const judgments=context.window.UFC_CANONICAL_OPPONENT_QUALITY_APPROVED_JUDGMENTS;
const facts=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const factCorrections=context.window.UFC_CANONICAL_FIGHTER_FACTS_OPPONENT_QUALITY_CORRECTIONS;

assert.equal(report?.applied,true,'Opponent Quality reconstruction should calculate successfully');
assert.equal(judgments?.applied,true,'Approved Opponent Quality judgments should load');
assert.equal(factCorrections?.applied,true,'Approved Opponent Quality fact corrections should load');
assert.equal(report.fighterCount,72,'Leon Edwards is excluded from the Opponent Quality audit');
assert.deepEqual(report.excludedFighters,['Leon Edwards']);
assert.equal(report.entryFor('Leon Edwards'),null);
assert.equal(report.canonicalControlCoverage,72);
assert.equal(report.canonicalWinCount,report.inputCount,'Every canonical official UFC win must receive exactly one Opponent Quality input');
assert.equal(report.duplicateInputFightIds.length,0);
assert.equal(report.missingInputFightIds.length,0);
assert.equal(report.missingRequiredApprovedJudgments.length,0);
assert.equal(report.unresolvedConflictCount,0);
assert.equal(report.remainingConflictCount,0);
assert.equal(report.allApprovedConflictsResolved,true);
assert.equal(report.proposedModelChangeCount,0);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);
assert.equal(report.benchmarkCredit,14.1);
assert.equal(report.frontEndTerminology,'Top-5 Wins');

const pennFact=facts.get('B.J. Penn').fights.find(row=>row.id==='2003-04-25-duane-ludwig');
assert.ok(pennFact,'B.J. Penn vs. Duane Ludwig must be present in canonical facts');
assert.equal(pennFact.scoringDisposition,'count-win');
const penn=report.entryFor('B.J. Penn');
const ludwig=penn.inputs.find(row=>row.fightId==='2003-04-25-duane-ludwig');
assert.ok(ludwig);
assert.equal(ludwig.finalCredit,.45);

const jones=report.entryFor('Jon Jones');
assert.equal(jones.inputs.some(row=>/daniel cormier/i.test(row.opponent)&&row.date==='2017-07-29'),false,'Cormier II no contest must not score');
assert.equal(jones.inputs.some(row=>row.opponent==='Alexander Gustafsson'&&row.occurrence===2),true,'Gustafsson II must be included');
const islam=report.entryFor('Islam Makhachev');
assert.equal(islam.inputs.some(row=>row.opponent==='Beneil Dariush'),false,'Nonexistent Dariush fight must not score');
const zhang=report.entryFor('Zhang Weili');
assert.equal(zhang.inputs.some(row=>row.opponent==='Rose Namajunas'),false,'Zhang losses to Rose must not score as wins');
assert.equal(zhang.inputs.some(row=>row.opponent==='Tatiana Suarez'&&row.finalCredit===1),true);
const sterling=report.entryFor('Aljamain Sterling');
const yanDq=sterling.inputs.find(row=>row.opponent==='Petr Yan'&&row.occurrence===1);
assert.ok(yanDq,'Sterling vs. Yan I must be present');
assert.equal(yanDq.finalCredit,.65);
assert.equal(yanDq.resultContext,'official-dq-win');

const expectedExplicitRemovals=[
  ['Jon Jones','Daniel Cormier II'],
  ['Islam Makhachev','Beneil Dariush'],
  ['Zhang Weili','Rose Namajunas II'],
  ['Brock Lesnar','Min-Soo Kim'],
  ['Frankie Edgar','Jim Miller'],
  ['Randy Couture','Jeremy Horn'],
  ['Merab Dvalishvili','Pedro Munhoz'],
  ['Deiveson Figueiredo','Matt Schnell'],
  ['Kayla Harrison','Julia Avila'],
  ['Jessica Andrade','Claudia Gadelha II'],
  ['Alexa Grasso','Mizuki Inoue'],
  ['Carla Esparza','Tecia Torres'],
  ['Carla Esparza','Angela Hill'],
  ['Carla Esparza','Felice Herrig'],
  ['B.J. Penn','Takanori Gomi'],
  ['B.J. Penn','Renzo Gracie'],
  ['Dan Henderson','Wanderlei Silva'],
  ['Chael Sonnen','Paulo Filho'],
  ['Amanda Nunes','Tonya Evinger'],
  ['Valentina Shevchenko','Alexis Davis'],
  ['Holly Holm','Iasmin Lucindo']
];
for(const [fighter,opponent] of expectedExplicitRemovals){
  const found=report.removedLegacyRows.find(row=>row.fighter===fighter&&row.sourceOpponent===opponent);
  assert.ok(found,`Expected approved legacy removal: ${fighter} vs. ${opponent}`);
  assert.equal(found.explicitlyListed,true);
}

assert.equal(report.nineFormerHiddenOverrides.length,9);
for(const row of report.nineFormerHiddenOverrides){
  assert.equal(row.canonicalWinCount,row.inputCount,`${row.fighter} must use a complete official UFC win ledger`);
  assert.equal(row.fighterAdjustment,0,`${row.fighter} must not retain a hidden fighter-level Opponent Quality haircut`);
  assert.equal(row.scoreSource,'calculated-complete-ledger');
}
const royce=report.entryFor('Royce Gracie');
const hughes=report.entryFor('Matt Hughes');
assert.equal(royce.fighterAdjustment,0,'Royce must not receive the old hidden early-era compression');
assert.equal(royce.reconstructedScore,9.55,'Royce must land through explicit at-the-time opponent credits');
assert.equal(royce.diminishedCredit,4.4875);
assert.equal(royce.inputs.find(row=>row.opponent==='Ken Shamrock')?.finalCredit,1);
assert.equal(royce.inputs.find(row=>row.opponent==='Keith Hackney')?.finalCredit,.10);
assert.equal(hughes.reconstructedScore,18.51,'Hughes must retain elite wins while softer and faded wins are discounted');
assert.equal(hughes.diminishedCredit,8.70);
assert.equal(hughes.inputs.find(row=>row.opponent==='Georges St-Pierre')?.finalCredit,1);
assert.equal(hughes.inputs.find(row=>row.opponent==='Matt Serra')?.finalCredit,.45);
assert.equal(hughes.inputs.find(row=>row.opponent==='Royce Gracie')?.finalCredit,.10);

for(const fighter of report.fighters){
  assert.equal(fighter.canonicalWinCount,fighter.inputCount,`${fighter.fighter} has incomplete Opponent Quality coverage`);
  for(const row of fighter.inputs){
    assert.ok(row.fightId,`${fighter.fighter} has an Opponent Quality row without a canonical fight ID`);
    assert.ok(Object.prototype.hasOwnProperty.call(row,'baseTier'));
    assert.ok(Object.prototype.hasOwnProperty.call(row,'baseCredit'));
    assert.ok(Array.isArray(row.adjustments));
    assert.ok(Object.prototype.hasOwnProperty.call(row,'finalCredit'));
    assert.ok(Object.prototype.hasOwnProperty.call(row,'countedRate'));
    assert.ok(Object.prototype.hasOwnProperty.call(row,'countedCredit'));
  }
}

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-opponent-quality-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');

const differenceRows=report.scoreDifferences.slice().sort((a,b)=>Math.abs(Number(b.difference))-Math.abs(Number(a.difference))||a.fighter.localeCompare(b.fighter));
const nineRows=report.nineFormerHiddenOverrides;
const markdown=[
  '# Canonical Opponent Quality Reconstruction — Approved Review Complete','',
  `- Fighters in Opponent Quality audit: **${report.fighterCount}**`,
  `- Excluded from this audit: **${report.excludedFighters.join(', ')}**`,
  `- Canonical official UFC wins scored: **${report.canonicalWinCount}**`,
  `- One-to-one fight input coverage: **${report.inputCount}/${report.canonicalWinCount}**`,
  `- Exact frozen-control parity: **${report.exactParityCount}/${report.canonicalControlCoverage}**`,
  `- Approved recalculation deltas: **${report.calculatedDifferenceCount}**`,
  `- Removed noncanonical legacy rows: **${report.removedLegacyRowCount}**`,
  `- Remaining Opponent Quality conflicts: **${report.remainingConflictCount}**`,
  `- Hidden fighter-level adjustments: **${report.fighters.filter(row=>Math.abs(Number(row.fighterAdjustment))>.000001).length}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Approved formula','',
  report.formula,'',
  'Each scored row exposes the canonical fight ID, base tier, explicit adjustments, final credit, diminishing-return slot, and counted credit. Front-end terminology is **Top-5 Wins**.','',
  '## Former hidden-score fighters','',
  '| Fighter | Old control | Reconstructed | Delta | UFC wins scored | Hidden adjustment |',
  '|---|---:|---:|---:|---:|---:|',
  ...nineRows.map(row=>`| ${row.fighter} | ${row.currentScore.toFixed(2)} | ${row.reconstructedScore.toFixed(2)} | ${row.difference>=0?'+':''}${row.difference.toFixed(2)} | ${row.inputCount} | ${row.fighterAdjustment.toFixed(2)} |`),'',
  '## All approved score deltas','',
  '| Fighter | Old control | Reconstructed | Delta |',
  '|---|---:|---:|---:|',
  ...differenceRows.map(row=>`| ${row.fighter} | ${row.currentScore.toFixed(2)} | ${row.reconstructedScore.toFixed(2)} | ${row.difference>=0?'+':''}${row.difference.toFixed(2)} |`),'',
  'The reconstruction is shadow-only. It does not write category scores, totals, ranks, OVRs, profiles, or Compare Mode.',''
].join('\n');
await fs.writeFile('docs/canonical-opponent-quality-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  excludedFighters:report.excludedFighters,
  canonicalWinCount:report.canonicalWinCount,
  inputCount:report.inputCount,
  exactParityCount:report.exactParityCount,
  calculatedDifferenceCount:report.calculatedDifferenceCount,
  removedLegacyRowCount:report.removedLegacyRowCount,
  explicitApprovedJudgmentCount:report.explicitApprovedJudgmentCount,
  canonicalFallbackCount:report.canonicalFallbackCount,
  remainingConflictCount:report.remainingConflictCount,
  liveDataUnchanged:report.liveDataUnchanged,
  nineFormerHiddenOverrides:report.nineFormerHiddenOverrides
},null,2));
