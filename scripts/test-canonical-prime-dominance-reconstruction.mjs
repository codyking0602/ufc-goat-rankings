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
  'assets/data/prime-windows.js',
  'assets/data/prime-round-control-audit.js',
  'assets/data/prime-dominance-ledgers.js',
  'assets/data/prime-dominance-shadow-model.js',
  'assets/data/canonical-prime-dominance-reconstruction.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION;
assert.equal(report?.applied,true,'Prime Dominance reconstruction should calculate successfully');
assert.equal(report.fighterCount,72,'Leon Edwards is excluded from the approved-category audit');
assert.deepEqual(report.excludedFighters,['Leon Edwards']);
assert.equal(report.controlCoverage,72);
assert.equal(report.primeWindowCoverage,72);
assert.equal(report.missingPrimeRoundRowCount,0,'Every scored prime fight must have audited round data');
assert.equal(report.primeRoundRowCount,report.scoredPrimeFightCount);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);
assert.equal(report.categoryMax,30);
assert.equal(report.componentMaxima.primeRecord,9);
assert.equal(report.componentMaxima.roundControl,8);
assert.equal(report.componentMaxima.finishPressure,5);
assert.equal(report.componentMaxima.competitiveSeparation,5);
assert.equal(report.componentMaxima.durability,3);
assert.equal(Object.values(report.componentMaxima).reduce((sum,value)=>sum+value,0),30);
assert.equal(JSON.stringify(Array.from(report.excludedInputs)),JSON.stringify([
  'opponent-quality tier',
  'top-five win count',
  'champion-name count',
  'title-fight volume',
  'division-strength multiplier',
  'fighter-level hidden adjustment'
]));

const jones=report.entryFor('Jon Jones');
assert.equal(jones.stats.noContests,1,'Cormier II no contest remains stored but excluded');
assert.equal(jones.stats.scoredFightCount,jones.stats.primeFightCount-1,'No contest must not enter Prime Dominance scoring');
assert.equal(jones.stats.components.durability,3);
assert.equal(jones.stats.sampleConfidence,1);
assert.equal(jones.stats.missingRoundRows.length,0);

const khabib=report.entryFor('Khabib Nurmagomedov');
assert.equal(khabib.stats.losses,0);
assert.equal(khabib.stats.draws,0);
assert.equal(khabib.stats.components.primeRecord,9);
assert.equal(khabib.stats.components.durability,3);
assert.equal(khabib.stats.sampleConfidence,1);
assert.ok(khabib.reconstructedScore>=27&&khabib.reconstructedScore<=30,'Khabib should remain an elite Prime Dominance benchmark');

const frank=report.entryFor('Frank Shamrock');
const kayla=report.entryFor('Kayla Harrison');
assert.equal(frank.stats.sampleConfidence,.9,'Five-fight prime receives a visible sample-confidence discount');
assert.equal(kayla.stats.sampleConfidence,.82,'Three-fight prime receives a visible sample-confidence discount');
assert.ok(kayla.reconstructedScore<khabib.reconstructedScore,'Tiny perfect samples must not automatically outrank a complete elite prime');

const ronda=report.entryFor('Ronda Rousey');
assert.equal(ronda.stats.losses,2,'The Cody-approved full Rousey prime includes Holm and Nunes');
assert.equal(ronda.stats.stoppageLosses,2);

const aljo=report.entryFor('Aljamain Sterling');
const yanDq=aljo.stats.primeFights.find(row=>row.opponent==='Petr Yan'&&row.method==='dq');
assert.ok(yanDq,'Sterling vs Yan I should be present');
assert.equal(yanDq.dominantWin,false,'A DQ win is not competitive separation');

assert.equal(report.fighters.some(row=>row.removedLegacyEliteStakes?.breakdown?.divisionStrengthContext),true,'The audit should expose the removed legacy division-strength input');
assert.equal(report.fighters.every(row=>Number.isFinite(row.reconstructedScore)),true);
assert.equal(report.fighters.every(row=>row.reconstructedScore>=0&&row.reconstructedScore<=30),true);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-prime-dominance-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');

const deltas=report.fighters
  .filter(row=>Number.isFinite(row.difference))
  .sort((a,b)=>Math.abs(b.difference)-Math.abs(a.difference)||a.fighter.localeCompare(b.fighter));
const leaders=[...report.fighters].sort((a,b)=>b.reconstructedScore-a.reconstructedScore||a.fighter.localeCompare(b.fighter)).slice(0,15);
const markdown=[
  '# Canonical Prime Dominance Reconstruction — Shadow Audit','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Excluded: **${report.excludedFighters.join(', ')}**`,
  `- Canonical scored prime fights: **${report.scoredPrimeFightCount}**`,
  `- Prime windows resolved: **${report.primeWindowCoverage}/${report.fighterCount}**`,
  `- Missing prime round rows: **${report.missingPrimeRoundRowCount}**`,
  `- Exact frozen-score parity: **${report.exactFrozenControlParityCount}/${report.controlCoverage}**`,
  `- Meaningful deltas (≥ 0.25): **${report.meaningfulDeltaCount}**`,
  `- Legacy elite-stakes component coverage: **${report.legacyComponentCoverage}/${report.fighterCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Approved clean formula','',
  `**${report.formula}**`,'',
  '- Prime Record: 9 points',
  '- Round Control: 8 points',
  '- Finish Pressure: 5 points',
  '- Competitive Separation: 5 points',
  '- Durability: 3 points',
  '- Prime-sample confidence: 0.78–1.00 multiplier; full confidence at eight scored prime fights','',
  'The former 8-point Elite-Stakes Validation block is retained in the audit as provenance but removed from the clean score. Championship, opponent quality, title-stage volume, and division depth remain owned by their respective categories.','',
  '## Reconstructed leaders','',
  '| Rank | Fighter | Prime Dominance | Raw | Confidence | Prime record | Rounds won | Finish pressure | Separation | Durability |',
  '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.stats.rawScore.toFixed(2)} | ${row.stats.sampleConfidence.toFixed(2)} | ${row.stats.components.primeRecord.toFixed(2)} | ${row.stats.components.roundControl.toFixed(2)} | ${row.stats.components.finishPressure.toFixed(2)} | ${row.stats.components.competitiveSeparation.toFixed(2)} | ${row.stats.components.durability.toFixed(2)} |`),
  '',
  '## Largest changes versus frozen control','',
  '| Fighter | Frozen | Reconstructed | Delta |',
  '|---|---:|---:|---:|',
  ...deltas.slice(0,30).map(row=>`| ${row.fighter} | ${row.currentScore.toFixed(2)} | ${row.reconstructedScore.toFixed(2)} | ${row.difference>0?'+':''}${row.difference.toFixed(2)} |`),
  '',
  'This report is diagnostic only. It does not write category scores, totals, ranks, OVRs, profile values, or Compare Mode values into the live app.',''
].join('\n');
await fs.writeFile('docs/canonical-prime-dominance-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  scoredPrimeFightCount:report.scoredPrimeFightCount,
  primeWindowCoverage:report.primeWindowCoverage,
  missingPrimeRoundRowCount:report.missingPrimeRoundRowCount,
  exactFrozenControlParityCount:report.exactFrozenControlParityCount,
  meaningfulDeltaCount:report.meaningfulDeltaCount,
  legacyComponentCoverage:report.legacyComponentCoverage,
  leaders:leaders.slice(0,10).map(row=>({fighter:row.fighter,score:row.reconstructedScore,delta:row.difference})),
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
