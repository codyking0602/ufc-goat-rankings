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
  'assets/data/canonical-phase-two-shadow.js'
];

const attributes={};
const document={
  body:null,
  documentElement:{setAttribute(name,value){attributes[name]=value;}},
  querySelector(){return null;}
};
const listeners={};
const window={
  addEventListener(name,handler){(listeners[name]??=[]).push(handler);},
  dispatchEvent(){return true;}
};
class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});

for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_PHASE_TWO_SHADOW;
assert.equal(report?.applied,true,'Phase 2 shadow should calculate successfully');
assert.equal(report.status,'shadow-ready');
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

const jones=report.entryFor('Jon Jones');
const gsp=report.entryFor('Georges St-Pierre');
const khabib=report.entryFor('Khabib Nurmagomedov');
const volk=report.entryFor('Alexander Volkanovski');
const nunes=report.entryFor('Amanda Nunes');
const cyborg=report.entryFor('Cris Cyborg');
assert.equal(jones.rank,1,'Jon Jones remains the UFC-only benchmark in the calculated shadow board');
assert.equal(jones.overallOvr,99);
assert.equal(jones.profileStats.titleFightWins,16);
assert.equal(jones.loss.penalty,0);
assert.equal(gsp.rank<=3,true,'GSP remains in the top three');
assert.equal(khabib.loss.penalty,0);
assert.equal(volk.loss.rows.filter(row=>row.rule==='prime-upward-elite').length>=2,true,'Volk Islam losses use upward-division elite context');
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
  });
}

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
const serializable=clean(report);
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-phase-two-shadow.json',`${JSON.stringify(serializable,null,2)}\n`,'utf8');

const top=(rows,count=15)=>rows.slice(0,count).map(row=>`| ${row.rank} | ${row.fighter} | ${row.totalScore.toFixed(2)} | ${row.overallOvr} | ${row.categories.championship.toFixed(2)} | ${row.categories.opponentQuality.toFixed(2)} | ${row.categories.primeDominance.toFixed(2)} | ${row.categories.longevity.toFixed(2)} | ${row.apexPeak.toFixed(2)} | ${row.loss.penalty.toFixed(2)} |`);
const movers=report.legacyScoreComparison.biggestRankMovers.slice(0,20).map(row=>`| ${row.fighter} | ${row.currentRank} | ${row.calculatedRank} | ${row.rankMovement>0?'+':''}${row.rankMovement} | ${row.currentTotal.toFixed(2)} | ${row.calculatedTotal.toFixed(2)} | ${row.totalDelta>0?'+':''}${row.totalDelta.toFixed(2)} |`);
const markdown=[
  '# Canonical Phase 2 Shadow Report','',
  `- Version: \`${report.version}\``,
  `- Canonical fighters: **${report.fighterCount}**`,
  `- Canonical UFC fight rows: **${report.fightCount}**`,
  `- Men: **${report.menCount}**`,
  `- Women: **${report.womenCount}**`,
  `- Live data unchanged: **${report.liveDataUnchanged}**`,
  `- Expected rank/total/OVR locks used as score inputs: **No**`,
  `- Legacy snapshot comparison coverage: **${report.legacyScoreComparison.coveredCount}**`,
  `- Measurable current-profile conflicts: **${report.measurableComparison.conflictCount}**`,'',
  '## Calculated men’s top 15','',
  '| Rank | Fighter | Score | OVR | Championship | Opponent Quality | Prime Dominance | Longevity | Apex | Penalty |',
  '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...top(report.boards.men,15),'',
  '## Calculated women’s top 10','',
  '| Rank | Fighter | Score | OVR | Championship | Opponent Quality | Prime Dominance | Longevity | Apex | Penalty |',
  '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...top(report.boards.women,10),'',
  '## Biggest rank changes versus the current parity snapshot','',
  '| Fighter | Current | Calculated | Movement | Current Score | Calculated Score | Delta |',
  '|---|---:|---:|---:|---:|---:|---:|',
  ...(movers.length?movers:['| None | — | — | — | — | — | — |']),'',
  '## Interpretation','',
  '- All scores are calculated from the audited UFC-only ledgers and reviewed classifications.',
  '- The current parity snapshot is comparison-only and does not control any calculated output.',
  '- This report is shadow-only. It does not change the live leaderboard, OVRs, profiles, snapshots, or Compare Mode.',''
].join('\n');
await fs.writeFile('docs/canonical-phase-two-shadow.md',markdown,'utf8');

console.log('CANONICAL_PHASE_TWO_SHADOW_TEST');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  fightCount:report.fightCount,
  topTenMen:report.topTenMen,
  topWomen:report.topWomen,
  biggestRankMovers:report.legacyScoreComparison.biggestRankMovers.slice(0,10),
  measurableConflictCount:report.measurableComparison.conflictCount,
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
