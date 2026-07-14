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
  'assets/data/longevity-shadow-scorer.js',
  'assets/data/canonical-longevity-reconstruction.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION;
assert.equal(report?.applied,true,'Longevity reconstruction should calculate successfully');
assert.equal(report.fighterCount,73,'All 73 canonical fighters must appear in the audit');
assert.equal(report.scoredFighterCount,72,'The current shared Era Ledger resolves 72 fighters');
assert.equal(report.controlCoverage,73,'Every canonical fighter should retain a frozen Longevity comparison control');
assert.equal(report.phaseSource,'fighter-era-ledgers');
assert.equal(report.eraLedgerCoverage,72);
assert.deepEqual(JSON.parse(JSON.stringify(report.missingEraLedgerFighters)),['Leon Edwards'],'Leon Edwards must be explicitly reported rather than silently excluded');
assert.equal(report.categoryLocalPrimeWindowControlsScore,false);
assert.equal(report.categoryLocalLongevityContextControlsScore,false);
assert.equal(report.gapCapMonths,18);
assert.equal(report.fullCreditMonths,144);
assert.equal(report.fullCreditYears,12);
assert.equal(report.categoryMax,30);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);
assert.match(report.formula,/gap-capped active UFC elite months/i);
assert.ok(report.cappedGapCount>0,'Long inactivity gaps should be capped and traced');
assert.ok(report.nonNeutralStatusMultiplierCount>0,'Recovered status judgments should remain explicit');
assert.ok(report.nonNeutralDivisionMultiplierCount>0,'Recovered division judgments should remain explicit');

const important=[
  'Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Jose Aldo','Khabib Nurmagomedov',
  'Alexander Volkanovski','Max Holloway','Kamaru Usman','Dominick Cruz','Stipe Miocic','Daniel Cormier',
  'Islam Makhachev','Charles Oliveira','Royce Gracie','Frank Shamrock','Kayla Harrison','Randy Couture'
];
for(const fighter of important){
  const row=report.entryFor(fighter);
  assert.ok(row,`${fighter} must be present in the full-roster audit`);
  assert.equal(row.stats.windowSource,'fighter-era-ledgers',`${fighter} must use the shared Era Ledger`);
  assert.equal(row.stats.categoryLocalPrimeWindowUsed,false);
  assert.equal(row.stats.categoryLocalLongevityContextUsed,false);
  assert.ok(Number.isFinite(row.reconstructedScore),`${fighter} should have a resolved Longevity score`);
  assert.ok(row.reconstructedScore>=0&&row.reconstructedScore<=30,`${fighter} score must stay within 0–30`);
  assert.equal(row.stats.gapCapMonths,18);
  assert.equal(row.stats.judgmentInputs.manualNumericAdjustment.value,0,'No hidden fighter-level numeric adjustment may be used');
}

const near=(actual,expected,tolerance=.2,message='')=>assert.ok(Math.abs(Number(actual)-Number(expected))<=tolerance,`${message} expected ${expected}, received ${actual}`);
const jones=report.entryFor('Jon Jones');
const gsp=report.entryFor('Georges St-Pierre');
const aldo=report.entryFor('Jose Aldo');
const usman=report.entryFor('Kamaru Usman');
const cruz=report.entryFor('Dominick Cruz');
const randy=report.entryFor('Randy Couture');
const justin=report.entryFor('Justin Gaethje');
const royce=report.entryFor('Royce Gracie');
const frank=report.entryFor('Frank Shamrock');
const khabib=report.entryFor('Khabib Nurmagomedov');
const kayla=report.entryFor('Kayla Harrison');
const islam=report.entryFor('Islam Makhachev');
const volk=report.entryFor('Alexander Volkanovski');
const charles=report.entryFor('Charles Oliveira');

assert.equal(jones.stats.eraStartDate,'2011-02-05');
assert.equal(jones.stats.eraEndDate,'2023-03-04');
near(jones.stats.gapAdjustedMonths,126.1,.2,'Jones gap-adjusted months');
assert.ok(jones.stats.cappedGapCount>=1,'Jones long gaps must be capped');

assert.equal(gsp.stats.eraStartDate,'2006-11-18');
assert.equal(gsp.stats.eraEndDate,'2017-11-04');
near(gsp.stats.gapAdjustedMonths,101.3,.2,'GSP gap-adjusted months');
assert.ok(gsp.stats.cappedGapCount>=1,'GSP retirement/comeback gap must be capped');

assert.equal(aldo.stats.eraStartDate,'2011-04-30','Aldo must start at Mark Hominick');
assert.equal(aldo.stats.eraStartLabel,'Mark Hominick');
assert.equal(aldo.stats.eraEndDate,'2022-08-20','Aldo must end at Merab Dvalishvili');
assert.equal(aldo.stats.eraEndLabel,'Merab Dvalishvili');
near(aldo.stats.gapAdjustedMonths,135.7,.2,'Aldo gap-adjusted months');

assert.equal(usman.stats.eraStartDate,'2018-05-19','Usman must start at Demian Maia');
assert.equal(usman.stats.eraStartLabel,'Demian Maia');
assert.equal(usman.stats.eraEndDate,'2023-03-18','Usman must end at Leon Edwards III');
assert.equal(usman.stats.eraEndLabel,'Leon Edwards III');
near(usman.stats.gapAdjustedMonths,58,.2,'Usman gap-adjusted months');

assert.ok(cruz.stats.cappedGapCount>=1,'Cruz injury gaps must be capped');
near(cruz.stats.gapAdjustedMonths,78,.2,'Cruz gap-adjusted months');

assert.equal(randy.stats.eraStartDate,'2004-08-21','Randy must use the shared Vitor Belfort II start, not the old 1997 patch window');
assert.equal(randy.stats.eraStartLabel,'Vitor Belfort II');
near(randy.stats.gapAdjustedMonths,50.8,.2,'Randy shared-window months');
near(randy.currentScore,25.74,.01,'Randy frozen score');
near(randy.legacyPatchScore,randy.currentScore,.02,'Randy legacy patch should explain the frozen score');
assert.ok(Math.abs(randy.difference)>=10,'Randy should expose the large factual window correction');
assert.equal(randy.stats.legacyPatchEvidence.controlsScore,false);

near(justin.stats.gapAdjustedMonths,47.2,.2,'Gaethje shared-window months');
near(justin.legacyPatchScore,justin.currentScore,.02,'Gaethje legacy Vick-window patch should explain the frozen score');
assert.equal(justin.stats.eraStartLabel,'Tony Ferguson');

near(royce.stats.gapAdjustedMonths,16.8,.2,'Royce short UFC-only window');
near(frank.stats.gapAdjustedMonths,21.1,.2,'Frank short UFC-only window');
assert.ok(royce.reconstructedScore<khabib.reconstructedScore,'A short foundational run should not receive excessive Longevity credit');
assert.ok(frank.reconstructedScore<khabib.reconstructedScore,'A short perfect title run should not receive excessive Longevity credit');
assert.ok(kayla.reconstructedScore<khabib.reconstructedScore,'A short open UFC sample should not receive excessive Longevity credit');

const openRows=[islam,volk,charles,kayla];
assert.ok(openRows.every(row=>row.stats.open),'Selected active fighters should use open shared windows');
assert.ok(openRows.some(row=>row.stats.openTailMonths>0),'Open windows must accrue time through the model as-of date');
assert.ok(openRows.every(row=>row.stats.openTailMonths<=18.01),'Open-window tails must be capped at 18 months');

// Category-local phase inputs are drift evidence only. Deliberately corrupt them and require identical results.
for(const fighter of ['Jose Aldo','Kamaru Usman','Jon Jones','Randy Couture']){
  const original=context.window.UFC_CANONICAL_FIGHTER_FACTS.get(fighter);
  const altered=JSON.parse(JSON.stringify(original));
  altered.primeWindow={startFightId:altered.fights.at(-1)?.id||null,endFightId:altered.fights.at(-1)?.id||null,open:false,reviewStatus:'locked'};
  altered.longevityContext={gapCapMonths:1,statusMultiplier:99,reviewStatus:'locked'};
  const recalculated=report.calculateLongevity(altered);
  const baseline=report.entryFor(fighter).stats;
  assert.equal(recalculated.score,baseline.score,`${fighter} score changed when category-local inputs were corrupted`);
  assert.equal(recalculated.gapAdjustedMonths,baseline.gapAdjustedMonths,`${fighter} months changed when category-local inputs were corrupted`);
  assert.equal(recalculated.windowSource,'fighter-era-ledgers');
  assert.equal(recalculated.categoryLocalPrimeWindowUsed,false);
  assert.equal(recalculated.categoryLocalLongevityContextUsed,false);
}

assert.equal(report.fighters.filter(row=>Number.isFinite(row.reconstructedScore)).every(row=>row.stats.intervals.every(interval=>interval.countedMonths<=18.01)),true,'No credited interval may exceed the universal cap');
assert.ok(report.meaningfulDeltaCount>0,'Shared-window factual corrections should produce a meaningful-delta report');
assert.ok(report.missingJudgmentInputs.some(row=>row.fighter==='Leon Edwards'),'Missing Era judgment inputs must be explicit');

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-longevity-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');

const deltas=report.fighters
  .filter(row=>Number.isFinite(row.difference))
  .sort((a,b)=>Math.abs(b.difference)-Math.abs(a.difference)||a.fighter.localeCompare(b.fighter));
const leaders=report.fighters.filter(row=>Number.isFinite(row.reconstructedScore)).slice(0,15);
const benchmarkRows=important.map(fighter=>report.entryFor(fighter));
const markdown=[
  '# Canonical Longevity Reconstruction — Shadow Audit','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Shared Era Ledger windows resolved: **${report.eraLedgerCoverage}/${report.fighterCount}**`,
  `- Missing Era Ledger fighters: **${report.missingEraLedgerFighters.join(', ')||'None'}**`,
  `- Frozen score controls available: **${report.controlCoverage}/${report.fighterCount}**`,
  `- Exact frozen-score parity from shared-window reconstruction: **${report.exactFrozenControlParityCount}/${report.controlCoverage}**`,
  `- Meaningful deltas (≥ ${report.meaningfulDeltaThreshold.toFixed(2)}): **${report.meaningfulDeltaCount}**`,
  `- Category-local window drift found: **${report.categoryLocalWindowDriftCount}**`,
  `- Capped inactivity gaps: **${report.cappedGapCount}**`,
  `- Open/current windows: **${report.openWindowCount}**`,
  `- Missing judgment-input rows: **${report.missingJudgmentInputCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Recovered approved formula — shadow only','',
  `**${report.formula}**`,'',
  '- One active elite year = 12 credited months built from UFC fight dates inside the shared Fighter Era Ledger window.',
  '- Every inactivity, retirement, injury, suspension, or comeback gap is capped at 18 months.',
  '- Open windows accrue from the latest UFC fight through the model as-of date, also capped at 18 months.',
  '- Status and division multipliers are preserved as explicit recovered judgment inputs because the frozen model uses them.',
  '- 144 multiplier-adjusted active elite months (12 years) earns 30/30.',
  '- Fighter-local `primeWindow` and `longevityContext` values are comparison evidence only and cannot control the score.','',
  '## Reconstructed leaders','',
  '| Rank | Fighter | Reconstructed | Frozen | Delta | Active years | Status | Division | Capped gaps |',
  '|---:|---|---:|---:|---:|---:|---:|---:|---:|',
  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${Number(row.currentScore).toFixed(2)} | ${row.difference>0?'+':''}${row.difference.toFixed(2)} | ${row.stats.activeEliteYears.toFixed(2)} | ${row.stats.statusMultiplier.toFixed(2)} | ${row.stats.divisionMultiplier.toFixed(2)} | ${row.stats.cappedGapCount} |`),
  '',
  '## Required benchmark fighters','',
  '| Fighter | Shared window | Months | Reconstructed | Frozen | Delta |',
  '|---|---|---:|---:|---:|---:|',
  ...benchmarkRows.map(row=>`| ${row.fighter} | ${row.stats.eraStartLabel||row.stats.eraStartDate||'Missing'} → ${row.stats.open?'Current':(row.stats.eraEndLabel||row.stats.eraEndDate||'Missing')} | ${row.stats.gapAdjustedMonths.toFixed(1)} | ${row.reconstructedScore.toFixed(2)} | ${Number(row.currentScore).toFixed(2)} | ${row.difference>0?'+':''}${row.difference.toFixed(2)} |`),
  '',
  '## Largest changes versus frozen control','',
  '| Fighter | Frozen | Reconstructed | Delta | Primary classification |',
  '|---|---:|---:|---:|---|',
  ...deltas.slice(0,30).map(row=>`| ${row.fighter} | ${row.currentScore.toFixed(2)} | ${row.reconstructedScore.toFixed(2)} | ${row.difference>0?'+':''}${row.difference.toFixed(2)} | ${(row.issues.at(-1)?.classification||'parity').replaceAll('|','/')} |`),
  '',
  '## Missing judgment inputs','',
  ...(report.missingJudgmentInputs.length?report.missingJudgmentInputs.map(row=>`- **${row.fighter}:** ${row.inputs.join('; ')}`):['- None']),
  '',
  'This report is diagnostic only. It does not write category scores, totals, ranks, OVRs, profile values, or Compare Mode values into the live app.',''
].join('\n');
await fs.writeFile('docs/canonical-longevity-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_LONGEVITY_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  scoredFighterCount:report.scoredFighterCount,
  eraLedgerCoverage:report.eraLedgerCoverage,
  missingEraLedgerFighters:report.missingEraLedgerFighters,
  exactFrozenControlParityCount:report.exactFrozenControlParityCount,
  meaningfulDeltaCount:report.meaningfulDeltaCount,
  categoryLocalWindowDriftCount:report.categoryLocalWindowDriftCount,
  cappedGapCount:report.cappedGapCount,
  openWindowCount:report.openWindowCount,
  storedEraFormulaParityCount:report.storedEraFormulaParityCount,
  legacyPatchExplainedFrozenCount:report.legacyPatchExplainedFrozenCount,
  leaders:leaders.slice(0,10).map(row=>({fighter:row.fighter,score:row.reconstructedScore,frozen:row.currentScore,delta:row.difference,months:row.stats.gapAdjustedMonths})),
  randy:{score:randy.reconstructedScore,frozen:randy.currentScore,legacyPatchScore:randy.legacyPatchScore,window:`${randy.stats.eraStartLabel} → ${randy.stats.eraEndLabel}`},
  aldo:{score:aldo.reconstructedScore,frozen:aldo.currentScore,window:`${aldo.stats.eraStartLabel} → ${aldo.stats.eraEndLabel}`},
  usman:{score:usman.reconstructedScore,frozen:usman.currentScore,window:`${usman.stats.eraStartLabel} → ${usman.stats.eraEndLabel}`},
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
