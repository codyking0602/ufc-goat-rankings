import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const sourceFiles=[
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
  'assets/data/canonical-apex-approved-judgments.js',
  'assets/data/canonical-apex-approved-judgments-batch-two.js',
  'assets/data/canonical-apex-approved-judgments-batch-three.js',
  'assets/data/canonical-apex-approved-judgments-batch-four.js'
];

class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const document={body:null,documentElement:{setAttribute(){}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={dispatchEvent(){return true;}};
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of sourceFiles)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

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

const championship=window.UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION;
const opponentQuality=window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION;
const apex=window.UFC_CANONICAL_APEX_RECONSTRUCTION;
assert.equal(championship?.applied,true);
assert.equal(opponentQuality?.applied,true);
assert.equal(apex?.applied,true);
assert.equal(championship.fighterCount,73);
assert.equal(opponentQuality.fighterCount,73);
assert.equal(apex.fighterCount,73);

const clean=value=>JSON.parse(JSON.stringify(value,(field,nested)=>typeof nested==='function'?undefined:nested));
const championshipInputs=Object.fromEntries(championship.fighters.map(row=>[row.fighter,{
  benchmarkCredit:row.benchmarkCredit,
  inputs:clean(row.inputs)
}]));
const opponentQualityInputs=Object.fromEntries(opponentQuality.fighters.map(row=>[row.fighter,{
  benchmarkCredit:row.benchmarkCredit,
  fighterAdjustment:row.fighterAdjustment,
  inputs:clean(row.inputs)
}]));
const apexInputs=Object.fromEntries(apex.fighters.map(row=>[row.fighter,{
  performances:(row.stats?.performances||[]).map(performance=>({
    fightId:performance.matchedFightId,
    opponent:performance.canonicalOpponent,
    date:performance.canonicalDate,
    rating:performance.rating
  })),
  components:clean(row.stats?.components||{}),
  notes:row.stats?.explicitJudgmentInputs?.notes||null,
  provenance:row.stats?.provenance||null,
  classification:row.judgmentClassification||null,
  approvalStatus:row.judgmentStatus||null
}]));

const payload={
  version:'canonical-scoring-judgments-20260714a-generated-approved-inputs',
  generatedFrom:{
    championship:championship.version,
    opponentQuality:opponentQuality.version,
    apex:apex.version,
    canonicalFacts:window.UFC_CANONICAL_FIGHTER_FACTS?.version||null
  },
  fighterCount:73,
  doctrine:'Permanent judgment inputs only. No category totals, total scores, ranks, or OVRs are stored here.',
  championship:championshipInputs,
  opponentQuality:opponentQualityInputs,
  apex:apexInputs
};

const output=`// Generated permanent approved scoring judgments.\n// Run scripts/generate-canonical-scoring-judgments.mjs only when approved fight-level judgments change.\n(function(){\n  'use strict';\n  const DATA=${JSON.stringify(payload)};\n  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[’‘\u0060´]/g,"'").replace(/\\s+/g,' ');\n  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));\n  const indexes=Object.fromEntries(['championship','opponentQuality','apex'].map(category=>[category,new Map(Object.entries(DATA[category]||{}).map(([fighter,value])=>[key(fighter),value]))]));\n  window.UFC_CANONICAL_SCORING_JUDGMENTS={\n    version:DATA.version,\n    generatedFrom:clone(DATA.generatedFrom),\n    fighterCount:DATA.fighterCount,\n    doctrine:DATA.doctrine,\n    ownsCalculatedScores:false,\n    ownsTotalsRanksOrOvr:false,\n    categories:['championship','opponentQuality','apex'],\n    entryFor(category,fighter){return clone(indexes[category]?.get(key(fighter))||null);},\n    list(category){return Array.from(indexes[category]?.entries()||[]).map(([normalized,value])=>({normalized,...clone(value)}));}\n  };\n  if(typeof document!=='undefined'&&document.documentElement?.setAttribute){\n    document.documentElement.setAttribute('data-canonical-scoring-judgments',DATA.version);\n  }\n})();\n`;
await fs.writeFile('assets/data/canonical-scoring-judgments.js',output,'utf8');
console.log(JSON.stringify({
  version:payload.version,
  championshipFighters:Object.keys(payload.championship).length,
  opponentQualityFighters:Object.keys(payload.opponentQuality).length,
  apexFighters:Object.keys(payload.apex).length,
  output:'assets/data/canonical-scoring-judgments.js'
},null,2));
