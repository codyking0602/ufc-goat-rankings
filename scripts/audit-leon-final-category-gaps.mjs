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
  'assets/data/canonical-apex-approved-judgments-batch-four.js',
  'assets/data/division-era-depth-shadow.js',
  'assets/data/canonical-division-era-depth-approved-resolutions.js',
  'assets/data/canonical-division-era-depth-reconstruction.js'
];

const STANDARD_CREDITS=Object.freeze({'champion-level':1.25,'top-five':1,'top-ten':.85,ranked:.65,solid:.45,'name-value':.25,minimal:.10,none:0});
const HISTORICAL_WEIGHTS=Object.freeze({championship:35,opponentQuality:27.5,primeDominance:27.5,longevity:10});
const CATEGORY_MAX=30;
const CHAMPIONSHIP_BENCHMARK=14.54;
const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
const occurrenceRows=fights=>{const counts=new Map();return fights.map(fight=>{const opponent=key(fight.opponent);const occurrence=(counts.get(opponent)||0)+1;counts.set(opponent,occurrence);return {fight,occurrence};});};

class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={dispatchEvent(){return true;}};
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const runtimeSnapshot=JSON.parse(await fs.readFile('docs/runtime-scoring-snapshot.json','utf8'));
context.window.RANKING_DATA.fighters=context.window.RANKING_DATA.fighters||[];
for(const snapshotRow of runtimeSnapshot.fighters){
  const existing=[...(context.window.RANKING_DATA.men||[]),...(context.window.RANKING_DATA.women||[]),...(context.window.RANKING_DATA.fighters||[])].find(row=>key(row?.fighter)===key(snapshotRow?.fighter));
  if(existing)existing.apexPeakAudit=JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit));
  else context.window.RANKING_DATA.fighters.push({fighter:snapshotRow.fighter,apexPeakAudit:JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit))});
}
vm.runInContext(await fs.readFile('assets/data/canonical-apex-reconstruction.js','utf8'),context,{filename:'assets/data/canonical-apex-reconstruction.js'});

const facts=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const record=facts.get('Leon Edwards');
assert.ok(record,'Leon Edwards canonical facts are required');
const era=context.window.UFC_FIGHTER_ERA_LEDGERS.entryFor('Leon Edwards');
assert.equal(era.window.start,'2019-07-20');
assert.equal(era.window.end,'2025-03-22');

const countedWins=occurrenceRows(record.fights.filter(fight=>fight.scoringDisposition==='count-win'));
const oqInputs=countedWins.map(({fight,occurrence})=>{
  const tier=fight?.opponentContext?.qualityTier||'none';
  return {fightId:fight.id,fighter:'Leon Edwards',opponent:fight.opponent,date:fight.date,event:fight.event,division:fight.division,occurrence,baseTier:tier,baseCredit:Number(STANDARD_CREDITS[tier]||0),adjustments:[],finalCredit:Number(STANDARD_CREDITS[tier]||0),judgmentSource:'canonical-reviewed-quality-tier',judgmentStatus:'factual-completion',reviewStatus:fight?.opponentContext?.reviewStatus||'locked',note:fight?.opponentContext?.note||'',canonicalQualityTier:tier,championStatus:fight?.opponentContext?.championStatus||'unknown',resultContext:fight?.method?.category==='dq'?'official-dq-win':'normal-official-win',provenance:'canonical UFC fight fact and reviewed opponentContext quality tier'};
});
const oqReport=context.window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION;
const oq=oqReport.calculateOpponentQuality(oqInputs,0,oqReport.benchmarkCredit);

const primeReport=context.window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION;
const prime=primeReport.calculatePrimeDominance(record);
assert.equal(prime.windowSource,'fighter-era-ledgers');
assert.equal(prime.windowValid,true);
const primeRoundBlockers=[...prime.missingRoundRows.map(row=>({...row,scope:'prime-round-control'})),...prime.eliteLevelValidation.missingRoundRows.map(row=>({...row,scope:'elite-stage-round-control'}))];
assert.equal(primeRoundBlockers.length,0,'Leon Prime Dominance must have complete audited rounds');

const titleWins=record.fights.filter(fight=>fight.scoringDisposition==='count-win'&&fight?.championshipContext?.fighterEligible!==false&&['normal','interim','vacant-undisputed','second-division-undisputed','vacant-second-division'].includes(fight?.championshipContext?.type));
assert.equal(titleWins.length,3,'Leon must have three canonical UFC title-fight wins');
const championshipScenarios=[
  {
    name:'approved',classification:'cody-approved recovered judgment',decision:'Full credit for dethroning Kamaru Usman; modest five-percent context discounts on the immediate Usman trilogy defense and the Colby Covington defense.',
    rows:titleWins.map((fight,index)=>({fightId:fight.id,opponent:fight.opponent,date:fight.date,titleType:fight.championshipContext.type,baseCredit:1,opponentStrength:1,eraTitleContextAdjustment:index===0?1:.95,finalAdjustedCredit:index===0?1:.95}))
  },
  {
    name:'full-credit-alternative',classification:'unselected alternative judgment',decision:'Treat all three undisputed title wins as full-value normal title wins.',
    rows:titleWins.map(fight=>({fightId:fight.id,opponent:fight.opponent,date:fight.date,titleType:fight.championshipContext.type,baseCredit:1,opponentStrength:1,eraTitleContextAdjustment:1,finalAdjustedCredit:1}))
  }
].map(scenario=>{const adjustedTitleCredit=scenario.rows.reduce((sum,row)=>sum+row.finalAdjustedCredit,0);return {...scenario,adjustedTitleCredit:round2(adjustedTitleCredit),score:round2((adjustedTitleCredit/CHAMPIONSHIP_BENCHMARK)*CATEGORY_MAX)};});
assert.equal(championshipScenarios[0].adjustedTitleCredit,2.9);
assert.equal(championshipScenarios[0].score,5.98);

const longevity=context.window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION.entryFor('Leon Edwards');
const loss=context.window.UFC_CANONICAL_LOSS_CONTEXT_RECONSTRUCTION.entryFor('Leon Edwards');
const apex=context.window.UFC_CANONICAL_APEX_RECONSTRUCTION.entryFor('Leon Edwards');
const eraDepth=context.window.UFC_CANONICAL_DIVISION_ERA_DEPTH_RECONSTRUCTION.entryFor('Leon Edwards');
assert.ok(Number.isFinite(longevity.reconstructedScore));
assert.ok(Number.isFinite(loss.reconstructedPenalty));
assert.ok(Number.isFinite(apex.reconstructedScore));
assert.equal(eraDepth.canonicalAdjustment,.06);

function historicalTotal(championshipScore){
  return round2(championshipScore/CATEGORY_MAX*HISTORICAL_WEIGHTS.championship+oq.score/CATEGORY_MAX*HISTORICAL_WEIGHTS.opponentQuality+prime.score/CATEGORY_MAX*HISTORICAL_WEIGHTS.primeDominance+longevity.reconstructedScore/CATEGORY_MAX*HISTORICAL_WEIGHTS.longevity+apex.reconstructedScore+loss.reconstructedPenalty+eraDepth.canonicalAdjustment);
}

const report={
  version:'leon-final-category-gap-audit-20260714c-approved',fighter:'Leon Edwards',shadowOnly:true,phaseSource:'fighter-era-ledgers',approvalStatus:'cody-approved',approvedAt:'2026-07-14',
  sharedEra:{start:era.window.start,startLabel:era.window.startLabel,end:era.window.end,endLabel:era.window.endLabel,endType:era.window.endType},
  championship:{categoryMax:CATEGORY_MAX,benchmarkCredit:CHAMPIONSHIP_BENCHMARK,approvedScenario:'approved',approvedScore:5.98,canonicalTitleWins:titleWins.map(fight=>({fightId:fight.id,opponent:fight.opponent,date:fight.date,event:fight.event,type:fight.championshipContext.type,qualityTier:fight.opponentContext?.qualityTier||null,championStatus:fight.opponentContext?.championStatus||null})),scenarios:championshipScenarios},
  opponentQuality:{classification:'factual completion',benchmarkCredit:oq.benchmarkCredit,categoryMax:oq.categoryMax,rawCredit:oq.rawCredit,diminishedCredit:oq.diminishedCredit,score:oq.score,topFiveWins:oq.rows.filter(row=>row.finalCredit>=1).length,championLevelWins:oq.rows.filter(row=>row.finalCredit>=1.15).length,rankedQualityWins:oq.rows.filter(row=>row.finalCredit>=.65).length,wins:oq.rows},
  primeDominance:{classification:'factual completion under the approved formula',score:prime.score,rawScore:prime.rawScore,sampleMultiplier:prime.sampleMultiplier,samplePercent:prime.samplePercent,recordText:prime.recordText,recordPct:prime.recordPct,roundControlPct:prime.roundControlPct,finishPressurePct:prime.finishPressurePct,scoredFightCount:prime.scoredFightCount,components:prime.components,eliteLevelValidation:prime.eliteLevelValidation,primeFights:prime.primeFights,roundBlockers:[]},
  alreadyLocked:{longevity:longevity.reconstructedScore,apex:apex.reconstructedScore,penalty:loss.reconstructedPenalty,eraDepth:eraDepth.canonicalAdjustment},
  projectedHistoricalTotals:Object.fromEntries(championshipScenarios.map(scenario=>[scenario.name,historicalTotal(scenario.score)])),
  blockers:[],
  liveDataUnchanged:true,mutatesScores:false,mutatesRanks:false,mutatesOvr:false
};

await fs.writeFile('/tmp/leon-final-category-gap-audit.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
console.log('LEON_FINAL_CATEGORY_GAP_AUDIT_APPROVED');
console.log(JSON.stringify(report,null,2));