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
  'assets/data/canonical-fighter-facts-prime-round-corrections.js',
  'assets/data/canonical-scoring-records.js',
  'assets/data/fighter-era-ledgers.js',
  'assets/data/fighter-era-ledger-approved-longevity-resolutions.js',
  'assets/data/fighter-era-ledger-approved-loss-context-resolutions.js',
  'assets/data/championship-resume-ledgers.js',
  'assets/data/championship-resume-ledger-rule-locks.js',
  'assets/data/canonical-championship-reconstruction.js',
  'assets/data/canonical-championship-approved-resolutions.js',
  'assets/data/opponent-quality-ledgers.js',
  'assets/data/opponent-quality-ledger-batch-four.js',
  'assets/data/opponent-quality-ledger-batch-five.js',
  'assets/data/opponent-quality-ledger-batch-six.js',
  'assets/data/opponent-quality-ledger-batch-seven.js',
  'assets/data/opponent-quality-ledger-batch-eight.js',
  'assets/data/opponent-quality-ledger-batch-nine.js',
  'assets/data/canonical-opponent-quality-approved-judgments.js',
  'assets/data/canonical-opponent-quality-reconstruction.js',
  'assets/data/prime-windows.js',
  'assets/data/prime-round-control-audit.js',
  'assets/data/prime-dominance-ledgers.js',
  'assets/data/prime-dominance-shadow-model.js',
  'assets/data/canonical-prime-dominance-reconstruction.js',
  'assets/data/longevity-shadow-scorer.js',
  'assets/data/canonical-longevity-reconstruction.js',
  'assets/data/canonical-longevity-approved-resolutions.js',
  'assets/data/canonical-loss-context-approved-resolutions.js',
  'assets/data/canonical-loss-context-reconstruction.js',
  'assets/data/canonical-apex-approved-judgments.js',
  'assets/data/canonical-apex-approved-judgments-batch-two.js',
  'assets/data/canonical-apex-approved-judgments-batch-three.js',
  'assets/data/canonical-apex-approved-judgments-batch-four.js'
];

class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const document={body:null,documentElement:{setAttribute(){}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={dispatchEvent(){return true;}};
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const runtimeSnapshot=JSON.parse(await fs.readFile('docs/runtime-scoring-snapshot.json','utf8'));
assert.equal(runtimeSnapshot?.summary?.status,'clean');
window.RANKING_DATA.fighters=window.RANKING_DATA.fighters||[];
const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
for(const snapshotRow of runtimeSnapshot.fighters){
  const existing=[...(window.RANKING_DATA.men||[]),...(window.RANKING_DATA.women||[]),...(window.RANKING_DATA.fighters||[])].find(row=>key(row?.fighter)===key(snapshotRow?.fighter));
  if(existing)existing.apexPeakAudit=JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit));
  else window.RANKING_DATA.fighters.push({fighter:snapshotRow.fighter,apexPeakAudit:JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit))});
}
vm.runInContext(await fs.readFile('assets/data/canonical-apex-reconstruction.js','utf8'),context,{filename:'assets/data/canonical-apex-reconstruction.js'});
for(const file of ['assets/data/division-era-depth-shadow.js','assets/data/canonical-division-era-depth-approved-resolutions.js','assets/data/canonical-division-era-depth-reconstruction.js','assets/data/canonical-leon-final-category-completions.js','assets/data/canonical-final-score-reconstruction.js']){
  vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
}

const before=JSON.stringify(window.RANKING_DATA);
vm.runInContext(await fs.readFile('assets/data/canonical-ovr-reconstruction.js','utf8'),context,{filename:'assets/data/canonical-ovr-reconstruction.js'});
const report=window.UFC_CANONICAL_OVR_RECONSTRUCTION;

assert.equal(report?.applied,true);
assert.equal(report.fighterCount,73);
assert.equal(report.floor,82);
assert.equal(report.ceiling,99);
assert.equal(report.curve,.85);
assert.equal(report.leaderOnly99,true);
assert.deepEqual(JSON.parse(JSON.stringify(report.anchors)),{men:{floorScore:18.68,ceilingScore:101.92},women:{floorScore:25.78,ceilingScore:80.79}});
assert.equal(report.manualFighterOverrides,false);
assert.equal(report.allBoardsPassed,true);
assert.equal(report.boards.men.monotonicViolations.length,0);
assert.equal(report.boards.women.monotonicViolations.length,0);
assert.equal(report.boards.men.nonLeaderNinetyNines.length,0);
assert.equal(report.boards.women.nonLeaderNinetyNines.length,0);
assert.equal(report.liveDataUnchanged,true);
assert.equal(JSON.stringify(window.RANKING_DATA),before);
assert.equal(report.mutatesRankingData,false);
assert.equal(report.mutatesScores,false);
assert.equal(report.mutatesRanks,false);
assert.equal(report.mutatesOvr,false);

const expectOvr=(fighter,ovr)=>assert.equal(report.entryFor(fighter)?.calculatedOvr,ovr,`${fighter} OVR`);
expectOvr('Jon Jones',99);
expectOvr('Georges St-Pierre',96);
expectOvr('Anderson Silva',95);
expectOvr('Demetrious Johnson',95);
expectOvr('Islam Makhachev',93);
expectOvr('Khabib Nurmagomedov',92);
expectOvr('Matt Hughes',92);
expectOvr('Henry Cejudo',89);
expectOvr('Royce Gracie',88);
expectOvr('Chael Sonnen',84);
expectOvr('Amanda Nunes',99);
expectOvr('Valentina Shevchenko',98);
expectOvr('Zhang Weili',92);
expectOvr('Cris Cyborg',87);
expectOvr('Kayla Harrison',86);
expectOvr('Holly Holm',82);

const clean=value=>JSON.parse(JSON.stringify(value,(nestedKey,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-ovr-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
await fs.writeFile('docs/canonical-ovr-reconstruction.md',[
  '# Canonical OVR Reconstruction — 73-Fighter Certification','',
  '- OVR range: **82–99**',
  '- Curve: **0.85**',
  '- Separate fixed men’s and women’s anchors: **Yes**',
  '- Fighter-specific OVR overrides: **No**',
  '- Only each board leader may receive 99: **Yes**',
  `- Fighters reconstructed: **${report.fighterCount}**`,
  `- Men’s monotonic violations: **${report.boards.men.monotonicViolations.length}**`,
  `- Women’s monotonic violations: **${report.boards.women.monotonicViolations.length}**`,
  `- Exact frozen OVR matches: **${report.exactFrozenOvrMatchCount}/${report.controlledComparisonCount}**`,
  `- Changed OVRs: **${report.changedOvrCount}**`,
  '- Live ranking payload changed: **No**','',
  '## Men’s top 15','',
  ...report.boards.men.topFifteen.map(row=>`${row.rank}. ${row.fighter} — ${row.calculatedOvr} OVR (${row.totalScore.toFixed(2)})`),
  '',
  '## Women’s board','',
  ...report.boards.women.rows.map(row=>`${row.rank}. ${row.fighter} — ${row.calculatedOvr} OVR (${row.totalScore.toFixed(2)})`),
  ''
].join('\n'),'utf8');

console.log('CANONICAL_OVR_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  formula:report.formula,
  fighterCount:report.fighterCount,
  exactFrozenOvrMatchCount:report.exactFrozenOvrMatchCount,
  controlledComparisonCount:report.controlledComparisonCount,
  changedOvrCount:report.changedOvrCount,
  menTopFifteen:report.boards.men.topFifteen,
  women:report.boards.women.rows,
  biggestChanges:report.biggestChanges.slice(0,20),
  allBoardsPassed:report.allBoardsPassed,
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
