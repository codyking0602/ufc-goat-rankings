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
const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
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
for(const file of ['assets/data/division-era-depth-shadow.js','assets/data/canonical-division-era-depth-approved-resolutions.js','assets/data/canonical-division-era-depth-reconstruction.js','assets/data/canonical-leon-final-category-completions.js']){
  vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
}

const liveBefore=JSON.stringify(window.RANKING_DATA);
vm.runInContext(await fs.readFile('assets/data/canonical-final-score-reconstruction.js','utf8'),context,{filename:'assets/data/canonical-final-score-reconstruction.js'});
const report=window.UFC_CANONICAL_FINAL_SCORE_RECONSTRUCTION;

assert.equal(report?.applied,true);
assert.equal(report.fighterCount,73);
assert.equal(report.completeCategoryInputCount,73);
assert.equal(report.blockedFighterCount,0);
assert.equal(report.frozenFormulaParityCount,72);
assert.equal(report.frozenFormulaMismatchCount,0);
assert.equal(report.approvedCandidate,'approvedFinalEngine');
assert.deepEqual(JSON.parse(JSON.stringify(report.approvedWeights)),{championship:35,opponentQuality:25,primeDominance:30,longevity:10});
assert.equal(report.finalWeightDecisionRequired,false);
assert.equal(report.finalWeightsApproved,true);
assert.equal(report.ovrCalculationDeferred,true);
assert.equal(report.rankingPromotionBlocked,true);
assert.equal(report.liveDataUnchanged,true);
assert.equal(JSON.stringify(window.RANKING_DATA),liveBefore);
assert.equal(report.mutatesRankingData,false);
assert.equal(report.mutatesScores,false);
assert.equal(report.mutatesRanks,false);
assert.equal(report.mutatesOvr,false);

for(const candidate of Object.values(report.candidateReports)){
  assert.equal(candidate.completeFighterCount,73);
  assert.equal(candidate.blockedFighterCount,0);
  assert.equal(candidate.controlledComparisonCount,72);
  assert.equal(candidate.menTopFifteen.length,15);
  assert.equal(candidate.womenTopTen.length,10);
}
assert.equal(report.candidateReports.approvedFinalEngine.approved,true);
assert.equal(report.approvedReport.approved,true);

const find=(candidate,fighter)=>report.candidateReports[candidate].rows.find(row=>row.fighter===fighter);
const historicalLeon=find('historicalFinalEngine','Leon Edwards');
const approvedLeon=find('approvedFinalEngine','Leon Edwards');
const cejudo=find('approvedFinalEngine','Henry Cejudo');
const royce=find('approvedFinalEngine','Royce Gracie');
const hughes=find('approvedFinalEngine','Matt Hughes');
const khabib=find('approvedFinalEngine','Khabib Nurmagomedov');
assert.equal(historicalLeon.totalScore,48.15);
assert.equal(approvedLeon.totalScore,47.77);
assert.equal(cejudo.scores.primeDominance,22.52);
assert.equal(cejudo.scores.longevity,4.77);
assert.equal(cejudo.scores.penalty,-1.69);
assert.equal(royce.scores.primeDominance,25.12);
assert.equal(royce.scores.opponentQuality,9.55);
assert.equal(royce.totalScore,42.17);
assert.equal(royce.calculatedRank,50);
assert.equal(hughes.scores.opponentQuality,18.51);
assert.equal(hughes.scores.apex,4.20);
assert.equal(hughes.totalScore,63.70);
assert.equal(hughes.calculatedRank,8);
assert.ok(khabib.calculatedRank<=7);

const clean=value=>JSON.parse(JSON.stringify(value,(nestedKey,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-final-score-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
await fs.writeFile('docs/canonical-final-score-reconstruction.md',[
  '# Canonical Final Score Reconstruction — Approved 73-Fighter Audit','',
  `- Approved weights: **35 / 25 / 30 / 10**`,
  `- Frozen formula parity: **${report.frozenFormulaParityCount}/${report.frozenFormulaControlCount}**`,
  `- Approved mean absolute total delta: **${report.approvedReport.meanAbsoluteTotalDelta.toFixed(2)}**`,
  `- Approved exact frozen-rank matches: **${report.approvedReport.exactFrozenRankMatchCount}/${report.approvedReport.controlledComparisonCount}**`,
  `- Cejudo: Prime **${cejudo.scores.primeDominance.toFixed(2)}**, rank **#${cejudo.calculatedRank}**`,
  `- Royce: OQ **${royce.scores.opponentQuality.toFixed(2)}**, Prime **${royce.scores.primeDominance.toFixed(2)}**, rank **#${royce.calculatedRank}**`,
  `- Hughes: OQ **${hughes.scores.opponentQuality.toFixed(2)}**, Apex **${hughes.scores.apex.toFixed(2)}**, rank **#${hughes.calculatedRank}**`,
  `- Khabib: rank **#${khabib.calculatedRank}**`,
  `- Leon: total **${approvedLeon.totalScore.toFixed(2)}**, rank **#${approvedLeon.calculatedRank}**`,
  '- Final weights approved; OVR reconstruction remains pending.',
  '- Live score, rank, OVR, profile, and Compare Mode data unchanged.',''
].join('\n'),'utf8');

console.log('CANONICAL_FINAL_SCORE_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  approvedCandidate:report.approvedCandidate,
  approvedWeights:report.approvedWeights,
  meanAbsoluteTotalDelta:report.approvedReport.meanAbsoluteTotalDelta,
  exactFrozenRankMatchCount:report.approvedReport.exactFrozenRankMatchCount,
  menTopFifteen:report.approvedReport.menTopFifteen,
  womenTopTen:report.approvedReport.womenTopTen,
  biggestRankMovers:report.approvedReport.biggestRankMovers.slice(0,15),
  spotlight:{
    cejudo:{primeDominance:cejudo.scores.primeDominance,totalScore:cejudo.totalScore,rank:cejudo.calculatedRank},
    royce:{opponentQuality:royce.scores.opponentQuality,primeDominance:royce.scores.primeDominance,totalScore:royce.totalScore,rank:royce.calculatedRank},
    hughes:{opponentQuality:hughes.scores.opponentQuality,apex:hughes.scores.apex,totalScore:hughes.totalScore,rank:hughes.calculatedRank},
    khabib:{totalScore:khabib.totalScore,rank:khabib.calculatedRank},
    leon:{totalScore:approvedLeon.totalScore,rank:approvedLeon.calculatedRank}
  },
  liveDataUnchanged:report.liveDataUnchanged
},null,2));
