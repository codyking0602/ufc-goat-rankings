// Phase 1 batch three: validate and register five complete UFC-only fighter ledgers.
// Evidence only. Never mutates live scores, totals, rank, OVR, snapshots, profiles, or Compare Mode.
(function(){
'use strict';
const VERSION='canonical-fighter-facts-batch-three-20260713a-five-retired-legends';
const API=window.UFC_CANONICAL_FIGHTER_FACTS;
const fail=(error,details=[])=>{window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_THREE={version:VERSION,applied:false,error:String(error||'Unknown batch error.'),details,mutatesRankingData:false};throw new Error(`[${VERSION}] ${error}`);};
if(!API)fail('UFC_CANONICAL_FIGHTER_FACTS is not loaded.');
const raw=window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_THREE_RAW||[];
const expected=['Fabricio Werdum','Glover Teixeira','Rashad Evans','Mauricio "Shogun" Rua','Forrest Griffin'];
if(raw.length!==expected.length)fail(`Expected ${expected.length} raw records, received ${raw.length}.`);
const expandFight=row=>{
 const [date,slug,opponent,event,division,scheduledRounds,officialResult,category,round,time,detail,qualityTier,championStatus,reviewStatus,roundData,championshipContext,lossClassification,qualityNote]=row;
 const fight={id:`${date}-${slug}`,date,opponent,event,division,scheduledRounds,officialResult,scoringDisposition:{win:'count-win',loss:'count-loss',draw:'count-draw','no-contest':'excluded-no-contest'}[officialResult],method:{category,round,time,detail},rounds:roundData?{status:'audited',won:roundData[0],lost:roundData[1],drawn:roundData[2],reviewStatus:roundData[3],note:roundData[4]}:{status:'not-audited'},opponentContext:{qualityTier,championStatus,reviewStatus},championshipContext};
 if(qualityNote)fight.opponentContext.note=qualityNote;
 if(lossClassification)fight.lossClassification=lossClassification;
 return fight;
};
const records=raw.map(({meta,rows})=>({...meta,fights:rows.map(expandFight)}));
const fighters=records.map(record=>record.fighter);
if(JSON.stringify(fighters)!==JSON.stringify(expected))fail('Raw fighter order or identity mismatch.',fighters);
const validation=records.map(record=>({fighter:record.fighter,...API.validate(record)}));
const invalid=validation.filter(row=>!row.valid);
if(invalid.length)fail('Batch validation failed before registration.',invalid);
records.forEach(record=>API.register(record));
const fightCount=records.reduce((sum,record)=>sum+record.fights.length,0);
window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_THREE={version:VERSION,applied:true,fighters,recordCount:records.length,fightCount,validation,mutatesRankingData:false};
document.documentElement.setAttribute('data-canonical-fighter-facts-batch-three',VERSION);
})();
