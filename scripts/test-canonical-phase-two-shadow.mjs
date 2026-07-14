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

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;}};
const listeners={};
const window={addEventListener(name,handler){(listeners[name]??=[]).push(handler);},dispatchEvent(event){(listeners[event?.type]||[]).forEach(handler=>handler(event));return true;}};
class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_PHASE_TWO_SHADOW;
const calibration=context.window.UFC_CANONICAL_PHASE_TWO_CALIBRATION;
console.log('CALIBRATED_PHASE_TWO_TOP_15');
console.log(JSON.stringify(report?.boards?.men?.slice(0,15).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr,primeDominance:row.categories.primeDominance,apexPeak:row.apexPeak,penalty:row.loss.penalty,eraDepthAdjustment:row.eraDepthAdjustment})),null,2));
assert.equal(report?.applied,true,'Phase 2 shadow should calculate successfully');
assert.equal(report.status,'shadow-calibrated');
assert.equal(calibration?.applied,true,'Phase 2 calibration should apply');
assert.equal(report.calibrationVersion,calibration.version);
assert.equal(report.fighterCount,73);
assert.equal(report.menCount,58);
assert.equal(report.womenCount,15);
assert.equal(report.fightCount,1366);
assert.equal(report.canonicalAuditPassed,true);
assert.equal(report.liveDataUnchanged,true,'Phase 2 must not mutate RANKING_DATA');
assert.equal(report.mutatesRankingData,false);
assert.equal(report.usesExpectedRankLocks,false);
assert.equal(report.usesExpectedTotalLocks,false);
assert.equal(report.usesExpectedOvrLocks,false);
assert.equal(report.legacyScoreComparison.comparisonOnly,true);
assert.equal(report.legacyScoreComparison.controlsCalculatedScores,false);
assert.equal(report.formula.weights.championship,30);
assert.equal(report.formula.weights.opponentQuality,24);
assert.equal(report.formula.weights.primeDominance,30);
assert.equal(report.formula.weights.longevity,16);

const jones=report.entryFor('Jon Jones');
const gsp=report.entryFor('Georges St-Pierre');
const dj=report.entryFor('Demetrious Johnson');
const anderson=report.entryFor('Anderson Silva');
const islam=report.entryFor('Islam Makhachev');
const khabib=report.entryFor('Khabib Nurmagomedov');
const volk=report.entryFor('Alexander Volkanovski');
const aldo=report.entryFor('Jose Aldo');
const ilia=report.entryFor('Ilia Topuria');
const nunes=report.entryFor('Amanda Nunes');
const cyborg=report.entryFor('Cris Cyborg');
assert.equal(jones.rank,1,'Jon Jones remains the UFC-only benchmark');
assert.equal(jones.overallOvr,99);
assert.equal(jones.profileStats.titleFightWins,16);
assert.equal(jones.loss.penalty,0);
assert.equal(gsp.rank,2,'GSP remains #2');
assert.equal(dj.rank,3,'Demetrious Johnson remains in the #3 range');
assert.equal(anderson.rank,4,'Anderson Silva remains #4');
assert.equal(islam.rank>=5&&islam.rank<=7,true,'Islam remains in the top modern GOAT tier');
assert.equal(khabib.rank<=8,true,'Khabib remains in the top-eight diagnostic range');
assert.equal(khabib.loss.penalty,0);
assert.equal(volk.rank<=8,true,'Volkanovski remains in the top-eight diagnostic range');
assert.equal(volk.loss.rows.filter(row=>row.rule==='prime-upward-elite').length>=2,true,'Volk Islam losses use upward-division elite penalty context');
assert.equal(volk.prime.upwardEliteLossCount>=2,true,'Upward elite losses receive reduced Prime Dominance exposure');
assert.equal(aldo.rank>=8&&aldo.rank<=13,true,'Jose Aldo remains near the intended UFC-only tier during calibration');
assert.equal(ilia.overallOvr>=87,true,'Active elite fighters must not receive an embarrassing front-end OVR');
assert.equal(nunes.profileStats.ufcRecord,'16-2');
assert.equal(cyborg.profileStats.ufcRecord,'5-1');
assert.equal(cyborg.quality.rows.some(row=>/strikeforce|bellator|pfl/i.test(String(row.opponent))),false);

for(const board of [report.boards.men,report.boards.women]){
  board.forEach((row,index)=>{
    assert.equal(row.rank,index+1,`${row.fighter} calculated rank`);
    assert.equal(Number.isFinite(row.totalScore),true,`${row.fighter} total score`);
    assert.equal(Number.isFinite(row.overallOvr),true,`${row.fighter} OVR`);
    assert.equal(row.profileStats.ufcRecord.length>0,true,`${row.fighter} profile UFC record`);
    assert.equal(row.categories.championship>=0&&row.categories.championship<=30,true,`${row.fighter} Championship range`);
    assert.equal(row.categories.opponentQuality>=0&&row.categories.opponentQuality<=30,true,`${row.fighter} Opponent Quality range`);
    assert.equal(row.categories.primeDominance>=0&&row.categories.primeDominance<=30,true,`${row.fighter} Prime Dominance range`);
    assert.equal(row.categories.longevity>=0&&row.categories.longevity<=30,true,`${row.fighter} Longevity range`);
    assert.equal(row.apexPeak>=0&&row.apexPeak<=6,true,`${row.fighter} Apex range`);
    assert.equal(Number.isFinite(row.eraDepthAdjustment),true,`${row.fighter} era-depth evidence value`);
  });
}

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
const serializable=clean(report);
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-phase-two-shadow.json',`${JSON.stringify(serializable,null,2)}\n`,'utf8');
const top=(rows,count=15)=>rows.slice(0,count).map(row=>`| ${row.rank} | ${row.fighter} | ${row.totalScore.toFixed(2)} | ${row.overallOvr} | ${row.categories.championship.toFixed(2)} | ${row.categories.opponentQuality.toFixed(2)} | ${row.categories.primeDominance.toFixed(2)} | ${row.categories.longevity.toFixed(2)} | ${row.apexPeak.toFixed(2)} | ${row.loss.penalty.toFixed(2)} | ${row.eraDepthAdjustment.toFixed(2)} |`);
const movers=(report.legacyScoreComparison?.biggestRankMovers||[]).slice(0,20).map(row=>`| ${row.fighter} | ${row.currentRank} | ${row.calculatedRank} | ${row.rankMovement>0?'+':''}${row.rankMovement} | ${row.currentTotal.toFixed(2)} | ${row.calculatedTotal.toFixed(2)} | ${row.totalDelta>0?'+':''}${row.totalDelta.toFixed(2)} |`);
const markdown=[
  '# Canonical Phase 2 Shadow Report','',
  `- Version: \`${report.version}\``,
  `- Calibration: \`${report.calibrationVersion}\``,
  `- Canonical fighters: **${report.fighterCount}**`,
  `- Canonical UFC fight rows: **${report.fightCount}**`,
  `- Men: **${report.menCount}**`,
  `- Women: **${report.womenCount}**`,
  `- Live data unchanged: **${report.liveDataUnchanged}**`,
  `- Expected rank/total/OVR locks used as score inputs: **No**`,
  `- Division-era depth evidence coverage: **${report.eraDepthCoverageCount}/${report.fighterCount}**`,
  `- Measurable current-profile conflicts: **${report.measurableComparison.conflictCount}**`,'',
  '## Calculated men’s top 15','',
  '| Rank | Fighter | Score | OVR | Championship | Opponent Quality | Prime Dominance | Longevity | Apex | Penalty | Era Depth |',
  '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...top(report.boards.men,15),'',
  '## Calculated women’s top 10','',
  '| Rank | Fighter | Score | OVR | Championship | Opponent Quality | Prime Dominance | Longevity | Apex | Penalty | Era Depth |',
  '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...top(report.boards.women,10),'',
  '## Biggest rank changes versus the current parity snapshot','',
  '| Fighter | Current | Calculated | Movement | Current Score | Calculated Score | Delta |',
  '|---|---:|---:|---:|---:|---:|---:|',
  ...(movers.length?movers:['| Pending recalculation | — | — | — | — | — | — |']),'',
  '## Interpretation','',
  '- All scores are calculated from the audited UFC-only ledgers and reviewed classifications.',
  '- Upward-division elite losses receive reduced Prime Dominance exposure as well as the locked reduced loss penalty.',
  '- Open prime windows are not punished solely for having a smaller completed sample.',
  '- Division-era depth remains a hidden model modifier and is not restored to the profile card.',
  '- The current parity snapshot is comparison-only and does not control any calculated output.',
  '- This report is shadow-only. It does not change the live leaderboard, OVRs, profiles, snapshots, or Compare Mode.',''
].join('\n');
await fs.writeFile('docs/canonical-phase-two-shadow.md',markdown,'utf8');
console.log('CANONICAL_PHASE_TWO_SHADOW_TEST');
console.log(JSON.stringify({version:report.version,calibrationVersion:report.calibrationVersion,fighterCount:report.fighterCount,fightCount:report.fightCount,topTenMen:report.topTenMen,topWomen:report.topWomen,eraDepthCoverageCount:report.eraDepthCoverageCount,missingEraDepth:report.missingEraDepth,measurableConflictCount:report.measurableComparison.conflictCount,liveDataUnchanged:report.liveDataUnchanged},null,2));
