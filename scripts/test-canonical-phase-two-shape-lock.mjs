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
  'assets/data/division-era-depth-shadow.js',
  'assets/data/canonical-phase-two-shadow.js',
  'assets/data/canonical-phase-two-calibration.js'
];

const document={body:null,documentElement:{setAttribute(){}},querySelector(){return null;}};
const listeners={};
const window={addEventListener(name,handler){(listeners[name]??=[]).push(handler);},dispatchEvent(event){(listeners[event?.type]||[]).forEach(handler=>handler(event));return true;}};
class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_PHASE_TWO_SHADOW;
const entry=name=>report.entryFor(name);
assert.equal(report.status,'shadow-calibrated');
assert.equal(report.fighterCount,73);
assert.equal(report.fightCount,1366);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);
assert.equal(entry('Jon Jones').rank,1);
assert.equal(entry('Jon Jones').overallOvr,99);
assert.equal(entry('Georges St-Pierre').rank,2);
assert.equal(entry('Demetrious Johnson').rank,3);
assert.equal(entry('Anderson Silva').rank,4);
assert.equal(entry('Islam Makhachev').rank,5);
assert.equal(entry('Islam Makhachev').overallOvr,93);
assert.equal(entry('Khabib Nurmagomedov').rank,6);
assert.equal(entry('Alexander Volkanovski').rank,7);
assert.equal(entry('Jose Aldo').rank>=8&&entry('Jose Aldo').rank<=11,true);
assert.equal(entry('Amanda Nunes').rank,1);
assert.equal(entry('Valentina Shevchenko').rank,2);
assert.equal(entry('Kayla Harrison').rank,7);
assert.equal(entry('Kayla Harrison').prime.primeSampleConfidence<.90,true);
assert.equal(entry('Kayla Harrison').apexPeak<6,true);
assert.equal(entry('Frank Shamrock').rank>=28,true);
assert.equal(entry('Frank Shamrock').prime.resumeSampleStrength<.60,true);
assert.equal(entry('Frank Shamrock').apexPeak<6,true);
assert.equal(entry('Alexander Volkanovski').prime.upwardEliteLossCount,2);
assert.equal(entry('Alexander Volkanovski').loss.rows.filter(row=>row.rule==='prime-upward-elite').length,2);
assert.equal(entry('Khabib Nurmagomedov').loss.penalty,0);
assert.equal(entry('Ilia Topuria').overallOvr>=87,true);
assert.equal(report.formula.weights.championship,30);
assert.equal(report.formula.weights.opponentQuality,24);
assert.equal(report.formula.weights.primeDominance,30);
assert.equal(report.formula.weights.longevity,16);
assert.equal(report.formula.upwardElitePrimeWeight,.79);
assert.equal(report.formula.secondDivisionApexBonus.undisputed,.5);
assert.equal(report.formula.sampleConfidence.apexAppliedAfterCap,true);
assert.equal(report.formula.overallOvrCurve,.8);
assert.equal(report.eraDepthCoverageCount,72);
assert.deepEqual(JSON.parse(JSON.stringify(report.missingEraDepth)),['Leon Edwards']);
console.log('CANONICAL_PHASE_TWO_SHAPE_LOCK_TEST');
console.log(JSON.stringify({topTenMen:report.topTenMen,topWomen:report.topWomen,missingEraDepth:report.missingEraDepth},null,2));
