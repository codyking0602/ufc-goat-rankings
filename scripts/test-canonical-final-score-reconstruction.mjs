import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const common=[
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
  'assets/data/fighter-era-ledger-approved-loss-context-resolutions.js'
];
const championship=[
  'assets/data/championship-resume-ledgers.js',
  'assets/data/championship-resume-ledger-rule-locks.js',
  'assets/data/canonical-championship-reconstruction.js',
  'assets/data/canonical-championship-approved-resolutions.js'
];
const opponentQuality=[
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
const prime=[
  'assets/data/prime-windows.js',
  'assets/data/prime-round-control-audit.js',
  'assets/data/prime-dominance-ledgers.js',
  'assets/data/prime-dominance-shadow-model.js',
  'assets/data/canonical-prime-dominance-reconstruction.js'
];
const longevity=[
  'assets/data/longevity-shadow-scorer.js',
  'assets/data/canonical-longevity-reconstruction.js',
  'assets/data/canonical-longevity-approved-resolutions.js'
];
const loss=[
  'assets/data/canonical-loss-context-approved-resolutions.js',
  'assets/data/canonical-loss-context-reconstruction.js'
];
const apexApproved=[
  'assets/data/canonical-apex-approved-judgments.js',
  'assets/data/canonical-apex-approved-judgments-batch-two.js',
  'assets/data/canonical-apex-approved-judgments-batch-three.js',
  'assets/data/canonical-apex-approved-judgments-batch-four.js'
];
const eraDepth=[
  'assets/data/division-era-depth-shadow.js',
  'assets/data/canonical-division-era-depth-approved-resolutions.js',
  'assets/data/canonical-division-era-depth-reconstruction.js'
];

class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={dispatchEvent(){return true;}};
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
const load=async file=>vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
for(const file of [...common,...championship,...opponentQuality,...prime,...longevity,...loss,...apexApproved])await load(file);

const runtimeSnapshot=JSON.parse(await fs.readFile('docs/runtime-scoring-snapshot.json','utf8'));
assert.equal(runtimeSnapshot?.summary?.status,'clean');
context.window.RANKING_DATA.fighters=context.window.RANKING_DATA.fighters||[];
const normalized=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
for(const snapshotRow of runtimeSnapshot.fighters){
  const existing=[...(context.window.RANKING_DATA.men||[]),...(context.window.RANKING_DATA.women||[]),...(context.window.RANKING_DATA.fighters||[])].find(row=>normalized(row?.fighter)===normalized(snapshotRow?.fighter));
  if(existing)existing.apexPeakAudit=JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit));
  else context.window.RANKING_DATA.fighters.push({fighter:snapshotRow.fighter,apexPeakAudit:JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit))});
}
await load('assets/data/canonical-apex-reconstruction.js');
for(const file of eraDepth)await load(file);

const liveBefore=JSON.stringify(context.window.RANKING_DATA);
await load('assets/data/canonical-final-score-reconstruction.js');
const report=context.window.UFC_CANONICAL_FINAL_SCORE_RECONSTRUCTION;

assert.equal(report?.applied,true,'Final-score reconstruction should calculate');
assert.equal(report.fighterCount,73);
assert.equal(report.completeCategoryInputCount,72);
assert.equal(report.blockedFighterCount,1);
assert.deepEqual(JSON.parse(JSON.stringify(report.blockedFighters)),[{fighter:'Leon Edwards',missingInputs:['championship','opponentQuality','primeDominance']}]);
assert.equal(report.frozenFormulaControlCount,72);
assert.equal(report.frozenFormulaMismatchCount,0,'The frozen total must be reproduced by the historical 35/27.5/27.5/10 formula plus Apex, Loss Penalty, and Era Depth');
assert.equal(report.frozenFormulaParityCount,72);
assert.equal(report.finalWeightDecisionRequired,true);
assert.equal(report.ovrCalculationDeferred,true);
assert.equal(report.rankingPromotionBlocked,true);
assert.equal(report.liveDataUnchanged,true);
assert.equal(JSON.stringify(context.window.RANKING_DATA),liveBefore,'Final-score audit must not mutate live ranking data');
assert.equal(report.mutatesRankingData,false);
assert.equal(report.mutatesScores,false);
assert.equal(report.mutatesRanks,false);
assert.equal(report.mutatesOvr,false);

for(const candidate of Object.values(report.candidateReports)){
  assert.equal(candidate.completeFighterCount,72);
  assert.equal(candidate.blockedFighterCount,1);
  assert.equal(candidate.controlledComparisonCount,72);
  assert.equal(candidate.menTopFifteen.length,15);
  assert.ok(candidate.womenTopTen.length>=4);
}

const leon=report.entryFor('Leon Edwards');
assert.equal(leon.scores.longevity!==null,true);
assert.equal(leon.scores.apex!==null,true);
assert.equal(leon.scores.penalty!==null,true);
assert.equal(leon.scores.eraDepth,0.06);
assert.equal(leon.scores.championship,null);
assert.equal(leon.scores.opponentQuality,null);
assert.equal(leon.scores.primeDominance,null);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-final-score-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');

const candidateSections=Object.entries(report.candidateReports).flatMap(([name,candidate])=>[
  `## ${name}`,'',
  `- Weights: Championship **${candidate.weights.championship}**, Opponent Quality **${candidate.weights.opponentQuality}**, Prime Dominance **${candidate.weights.primeDominance}**, Longevity **${candidate.weights.longevity}**`,
  `- Mean absolute delta from frozen total: **${candidate.meanAbsoluteTotalDelta.toFixed(2)}**`,
  `- Exact frozen-rank matches: **${candidate.exactFrozenRankMatchCount}/${candidate.controlledComparisonCount}**`,'',
  '| Rank | Fighter | Calculated | Frozen | Delta |',
  '|---:|---|---:|---:|---:|',
  ...candidate.menTopFifteen.map(row=>`| ${row.rank} | ${row.fighter} | ${row.totalScore.toFixed(2)} | ${row.currentTotal===null?'—':row.currentTotal.toFixed(2)} | ${row.totalDelta===null?'—':`${row.totalDelta>0?'+':''}${row.totalDelta.toFixed(2)}`} |`),
  ''
]);
const markdown=[
  '# Canonical Final Score Reconstruction — Initial Audit','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Complete locked-category inputs: **${report.completeCategoryInputCount}**`,
  `- Blocked fighters: **${report.blockedFighterCount}**`,
  `- Frozen total formula parity: **${report.frozenFormulaParityCount}/${report.frozenFormulaControlCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Recovered frozen total formula','',
  `**${report.frozenFormula}**`,'',
  'This proves how the current frozen control total was generated. It includes Apex, Loss Penalty, and Division-Era Depth and serves as the migration baseline—not automatic approval of the final post-refactor weighting choice.','',
  '## Blocking category gaps','',
  ...report.blockedFighters.map(row=>`- **${row.fighter}:** ${row.missingInputs.join(', ')}`),'',
  ...candidateSections,
  '## Promotion status','',
  '- Final weight decision: **required**',
  '- OVR reconstruction: **deferred until total formula approval**',
  '- Rank/OVR/live promotion: **blocked**',
  '- No live score, rank, OVR, profile, or Compare Mode value was changed.',''
].join('\n');
await fs.writeFile('docs/canonical-final-score-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_FINAL_SCORE_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  completeCategoryInputCount:report.completeCategoryInputCount,
  blockedFighters:report.blockedFighters,
  frozenFormulaParityCount:report.frozenFormulaParityCount,
  frozenFormulaControlCount:report.frozenFormulaControlCount,
  candidates:Object.fromEntries(Object.entries(report.candidateReports).map(([name,row])=>[name,{weights:row.weights,meanAbsoluteTotalDelta:row.meanAbsoluteTotalDelta,exactFrozenRankMatchCount:row.exactFrozenRankMatchCount,menTopFifteen:row.menTopFifteen,womenTopTen:row.womenTopTen,biggestRankMovers:row.biggestRankMovers.slice(0,10)}])),
  leon:{scores:leon.scores,missingInputs:leon.missingInputs},
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
