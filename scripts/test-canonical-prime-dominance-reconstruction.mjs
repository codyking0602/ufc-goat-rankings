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
  'assets/data/fighter-era-ledgers.js',
  'assets/data/fighter-era-ledger-approved-longevity-resolutions.js',
  'assets/data/fighter-era-ledger-approved-loss-context-resolutions.js',
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
assert.equal(report.primeWindowSource,'fighter-era-ledgers');
const unresolvedEraWindows=report.fighters.filter(row=>!row.stats.windowValid).map(row=>({fighter:row.fighter,era:window.UFC_FIGHTER_ERA_LEDGERS.entryFor(row.fighter)?.window||null}));
if(unresolvedEraWindows.length)console.log('UNRESOLVED_ERA_WINDOWS',JSON.stringify(unresolvedEraWindows,null,2));
assert.equal(report.eraLedgerCoverage,72,`Every fighter must resolve through the shared Fighter Era Ledger. Unresolved: ${unresolvedEraWindows.map(row=>row.fighter).join(', ')}`);
assert.equal(report.missingPrimeRoundRowCount,0,'Every scored prime fight must have audited round data');
assert.equal(report.missingEliteStageRoundRowCount,0,'Every elite-stage prime fight must have audited round data');
assert.equal(report.primeRoundRowCount,report.scoredPrimeFightCount);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);
assert.equal(report.categoryMax,30);
assert.equal(report.componentMaxima.primeRecord,9);
assert.equal(report.componentMaxima.roundControl,9);
assert.equal(report.componentMaxima.finishPressure,5);
assert.equal(report.componentMaxima.eliteLevelValidation,7);
assert.equal(Object.values(report.componentMaxima).reduce((sum,value)=>sum+value,0),30);
assert.equal(report.eliteValidationMaxima.volume,3);
assert.equal(report.eliteValidationMaxima.performance,4);
assert.deepEqual(JSON.parse(JSON.stringify(report.primeSampleRule)),{minimum:.70,stepPerFight:.05,fullAtFights:7});
assert.equal(JSON.stringify(Array.from(report.excludedInputs)),JSON.stringify([
  'subjective competitive-separation tags',
  'durability bonus',
  'division-strength multiplier',
  'fighter-level hidden adjustment'
]));

const jones=report.entryFor('Jon Jones');
assert.equal(jones.stats.noContests,1,'Cormier II no contest remains stored but excluded');
assert.equal(jones.stats.scoredFightCount,jones.stats.primeFightCount-1,'No contest must not enter Prime Dominance scoring');
assert.equal(jones.stats.windowSource,'fighter-era-ledgers');
assert.equal(jones.stats.eraStartDate,'2011-02-05');
assert.equal(jones.stats.eraEndDate,'2023-03-04');
assert.equal(jones.stats.missingRoundRows.length,0);

const khabib=report.entryFor('Khabib Nurmagomedov');
assert.equal(khabib.stats.losses,0);
assert.equal(khabib.stats.draws,0);
assert.equal(khabib.stats.components.primeRecord,9);
assert.ok(khabib.stats.components.eliteLevelValidation>0);
assert.ok(khabib.reconstructedScore>=25&&khabib.reconstructedScore<=30,'Khabib should remain an elite Prime Dominance benchmark');

const frank=report.entryFor('Frank Shamrock');
const kayla=report.entryFor('Kayla Harrison');
assert.ok(frank.stats.eliteLevelValidation.volumeScore<3,'Short elite samples should not max elite-stage volume');
assert.ok(kayla.stats.eliteLevelValidation.volumeScore<3,'Tiny UFC samples should not max elite-stage volume');
assert.ok(kayla.reconstructedScore<khabib.reconstructedScore,'Tiny perfect samples must not automatically outrank a complete elite prime');
assert.equal('sampleConfidence' in kayla.stats,false,'The retired confidence formula must stay removed');
assert.equal(kayla.stats.sampleMultiplier,.80,'Three counted prime fights receive 80% of the full score');
assert.equal(frank.stats.sampleMultiplier,.90,'Five counted prime fights receive 90% of the full score');
assert.equal(khabib.stats.sampleMultiplier,1,'Seven or more counted prime fights receive the full score');
assert.equal(kayla.stats.score,Math.round(kayla.stats.rawScore*.80*100)/100,'The multiplier applies to the entire 30-point raw score');

const aldo=report.entryFor('Jose Aldo');
assert.equal(aldo.stats.eraStartDate,'2011-04-30','Aldo must use the shared Hominick start');
assert.equal(aldo.stats.eraEndDate,'2022-08-20','Aldo must use the shared Merab endpoint');
assert.equal(aldo.stats.eraEndLabel,'Merab Dvalishvili');

const usman=report.entryFor('Kamaru Usman');
assert.equal(usman.stats.eraStartDate,'2018-05-19','Usman must use the shared Maia start');
assert.equal(usman.stats.eraEndDate,'2023-03-18','Usman must use the shared Edwards III endpoint');
assert.equal(usman.stats.eraEndLabel,'Leon Edwards III');
assert.equal(usman.stats.primeFights.some(fight=>fight.opponent==='Khamzat Chimaev'),false,'Khamzat is post-prime under the shared Era Ledger');

const ronda=report.entryFor('Ronda Rousey');
assert.ok(ronda.stats.losses>=1,'The shared Era Ledger, not a category-local peak slice, controls Rousey');

const randy=report.entryFor('Randy Couture');
assert.equal(randy.stats.eraStartDate,'1997-05-30');
assert.equal(randy.stats.eraStartLabel,'Vitor Belfort I');

const israel=report.entryFor('Israel Adesanya');
assert.equal(israel.stats.eraEndDate,'2024-08-18');
assert.equal(israel.stats.eraEndLabel,'Dricus du Plessis');
assert.ok(israel.stats.primeFights.some(fight=>fight.opponent==='Dricus du Plessis'&&fight.result==='count-loss'));

const sean=report.entryFor('Sean Strickland');
assert.equal(sean.stats.eraStartDate,'2021-07-31');
assert.equal(sean.stats.eraStartLabel,'Uriah Hall');
assert.ok(sean.stats.primeFights.some(fight=>fight.opponent==='Alex Pereira'&&fight.result==='count-loss'));

assert.equal(report.fighters.every(row=>Number.isFinite(row.reconstructedScore)),true);
assert.equal(report.fighters.every(row=>row.reconstructedScore>=0&&row.reconstructedScore<=30),true);
assert.equal(report.fighters.every(row=>row.stats.primeFights.filter(fight=>fight.result==='count-win'||fight.result==='count-loss'||fight.result==='count-draw').every(fight=>typeof fight.eliteStage==='boolean')),true);

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
  `- Shared Era Ledger windows resolved: **${report.eraLedgerCoverage}/${report.fighterCount}**`,
  `- Fighter-local window drift found: **${report.eraLedgerDriftCount}**`,
  `- Scored prime fights: **${report.scoredPrimeFightCount}**`,
  `- Elite-stage prime fights: **${report.eliteStageFightCount}**`,
  `- Missing prime round rows: **${report.missingPrimeRoundRowCount}**`,
  `- Missing elite-stage round rows: **${report.missingEliteStageRoundRowCount}**`,
  `- Exact frozen-score parity: **${report.exactFrozenControlParityCount}/${report.controlCoverage}**`,
  `- Meaningful deltas (≥ 0.25): **${report.meaningfulDeltaCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Cody-approved formula — shadow only','',
  `**${report.formula}**`,'',
  '- Prime Record: 9 points',
  '- Round Control: 9 points',
  '- Finish Pressure: 5 points',
  '- Elite-Level Validation: 7 points',
  '- Prime Sample Percentage: 70% at one counted prime fight, +5 percentage points per additional fight, full score at seven fights',
  '  - Elite-stage volume: 3 points; result-neutral, full credit at eight counted elite-stage prime fights',
  '  - Elite-stage performance: 4 points from result rate, round control, and finish pressure','',
  'An elite-stage fight is a counted prime fight that is either a UFC title fight or against a canonical champion-level/Top-5 opponent. A loss still adds volume credit and can earn performance credit through rounds won. No contests and technical exceptions remain excluded.','',
  'The complete 30-point raw score is multiplied by the locked prime-sample percentage. This is a uniform sample-size control, not a fighter-specific adjustment.','',
  'The Fighter Era Ledger, including Cody-approved Longevity and Loss Context phase corrections, is the sole prime-window source for Prime Dominance. Category-local prime windows are retained only as drift checks and cannot override it.','',
  '## Reconstructed leaders','',
  '| Rank | Fighter | Adjusted | Raw / 30 | Sample | Prime record | Rounds | Finish | Elite validation | Elite fights |',
  '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.stats.rawScore.toFixed(2)} | ${row.stats.samplePercent.toFixed(0)}% | ${row.stats.components.primeRecord.toFixed(2)} | ${row.stats.components.roundControl.toFixed(2)} | ${row.stats.components.finishPressure.toFixed(2)} | ${row.stats.components.eliteLevelValidation.toFixed(2)} | ${row.stats.eliteLevelValidation.fightCount} |`),
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
  eraLedgerCoverage:report.eraLedgerCoverage,
  eraLedgerDriftCount:report.eraLedgerDriftCount,
  scoredPrimeFightCount:report.scoredPrimeFightCount,
  eliteStageFightCount:report.eliteStageFightCount,
  missingPrimeRoundRowCount:report.missingPrimeRoundRowCount,
  missingEliteStageRoundRowCount:report.missingEliteStageRoundRowCount,
  exactFrozenControlParityCount:report.exactFrozenControlParityCount,
  meaningfulDeltaCount:report.meaningfulDeltaCount,
  sampleDiscountedFighterCount:report.sampleDiscountedFighterCount,
  leaders:leaders.slice(0,10).map(row=>({fighter:row.fighter,score:row.reconstructedScore,rawScore:row.stats.rawScore,samplePercent:row.stats.samplePercent,delta:row.difference,eliteFights:row.stats.eliteLevelValidation.fightCount})),
  aldo:{score:aldo.reconstructedScore,record:aldo.stats.recordText,window:`${aldo.stats.eraStartLabel} → ${aldo.stats.eraEndLabel}`},
  usman:{score:usman.reconstructedScore,record:usman.stats.recordText,window:`${usman.stats.eraStartLabel} → ${usman.stats.eraEndLabel}`},
  randy:{score:randy.reconstructedScore,record:randy.stats.recordText,window:`${randy.stats.eraStartLabel} → ${randy.stats.eraEndLabel}`},
  israel:{score:israel.reconstructedScore,record:israel.stats.recordText,window:`${israel.stats.eraStartLabel} → ${israel.stats.eraEndLabel}`},
  sean:{score:sean.reconstructedScore,record:sean.stats.recordText,window:`${sean.stats.eraStartLabel} → ${sean.stats.eraEndLabel}`},
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
