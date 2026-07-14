// Phase 1 batch seven: ten complete audited UFC-only fight ledgers.
// Evidence only. Never mutates live scores, totals, rank, OVR, snapshots, profiles, or Compare Mode.
(function(){
'use strict';
const VERSION='canonical-fighter-facts-batch-seven-20260713a-ten-fighters-199';
const API=window.UFC_CANONICAL_FIGHTER_FACTS;
const fail=(error,details=[])=>{window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_SEVEN={version:VERSION,applied:false,error:String(error||'Unknown batch error.'),details,mutatesRankingData:false};throw new Error(`[${VERSION}] ${error}`);};
if(!API)fail('UFC_CANONICAL_FIGHTER_FACTS is not loaded.');
const RESULT={W:['win','count-win'],L:['loss','count-loss'],D:['draw','count-draw'],N:['no-contest','excluded-no-contest']};
const METHOD={D:'decision',K:'ko-tko',S:'submission',T:'doctor-stoppage',X:'draw',N:'no-contest',Q:'dq',O:'other'};
const QUALITY={E:'champion-level',F:'top-five',T:'top-ten',R:'ranked',S:'solid',N:'name-value',M:'minimal','0':'none'};
const TITLE={'0':'none',N:'normal',I:'interim',V:'vacant-undisputed',S:'second-division-undisputed',W:'vacant-second-division',T:'tournament',D:'retention-draw'};
const CHAMP={R:'reigning-champion',I:'interim-champion',F:'former-champion',T:'title-challenger',C:'contender',U:'unranked','?':'unknown'};
const DIVISION={Y:'Flyweight',B:'Bantamweight',F:'Featherweight',G:'Lightweight',W:'Welterweight',M:'Middleweight',L:'Light Heavyweight',H:'Heavyweight',C:'Catchweight'};
const slug=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const DATA=window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_SEVEN_DATA||[];
function parseFlags(text){
  const out={};
  String(text||'').split(';').filter(Boolean).forEach(token=>{
    if(/^s\d+$/.test(token))out.s=Number(token.slice(1));
    else if(token.startsWith('d'))out.d=DIVISION[token.slice(1)]||token.slice(1);
    else if(token.startsWith('c'))out.c=CHAMP[token.slice(1)]||token.slice(1);
    else if(token==='vH')out.v='high-risk-review';
    else if(token.startsWith('l')){const [division,competitive,override]=token.slice(1).split(':');out.l=[division,competitive!=='0',override||null];}
  });
  return out;
}
function buildFight(row,primaryDivision){
  const [date,opponent,event,resultCode,methodCode,methodRound,qualityCode,roundText,titleText,flagText,note]=row;
  const [officialResult,scoringDisposition]=RESULT[resultCode]||[];
  const methodCategory=METHOD[methodCode];
  if(!officialResult||!methodCategory)fail(`Invalid fight code for ${opponent}.`);
  const options=parseFlags(flagText);
  const reviewStatus=options.v||'locked';
  const titleParts=String(titleText||'').split(':');
  const championshipContext=titleText?{type:TITLE[titleParts[0]],manualCredit:Number(titleParts[1]),fighterEligible:titleParts[2]!=='0',reviewStatus}:{type:'none'};
  const roundParts=roundText?roundText.split(',').map(Number):null;
  const fight={
    id:`${date}-${slug(opponent)}`,date,opponent,event,
    division:options.d||primaryDivision,scheduledRounds:Number(options.s||3),
    officialResult,scoringDisposition,method:{category:methodCategory,round:Number(methodRound)},
    rounds:roundParts?{status:'audited',won:roundParts[0],lost:roundParts[1],drawn:roundParts[2]||0,reviewStatus,note:'Reviewed fight-by-fight round allocation.'}:{status:'not-audited'},
    opponentContext:{qualityTier:QUALITY[qualityCode],championStatus:options.c||'contender',reviewStatus},
    championshipContext
  };
  if(note)fight.notes=note;
  if(officialResult==='loss'){
    const loss=options.l||['home',true,null];
    fight.lossClassification={divisionContext:loss[0]||'home',competitive:loss[1]!==false,reviewStatus,overrideRule:loss[2]||null,note:note||'Counted UFC loss.'};
  }
  return fight;
}
function buildRecord(entry){
  const [fighter,primaryDivision,secondaryDivisions,aliases,startFightId,endFightId,open,statusMultiplier,divisionKey,coverageNote]=entry.meta;
  return {fighter,board:'men',status:'audited',identity:{primaryDivision,secondaryDivisions,aliases},
    coverage:{complete:true,verifiedThrough:'2026-07-13',ufcOnly:true,note:coverageNote},
    primeWindow:{startFightId,endFightId:open?null:endFightId,open:Boolean(open),reviewStatus:'locked',note:'Reviewed locked UFC-only prime window.'},
    longevityContext:{gapCapMonths:18,statusMultiplier:Number(statusMultiplier),reviewStatus:'locked',note:'Universal 18-month gap cap.'},
    divisionStrength:{defaultKey:divisionKey,reviewStatus:'locked',segments:[]},
    fights:entry.rows.map(row=>buildFight(row,primaryDivision))};
}
const records=DATA.map(buildRecord);
const expected=['Tony Ferguson','T.J. Dillashaw','Tito Ortiz','Junior dos Santos','Brock Lesnar','Dricus du Plessis','Tyron Woodley','Aljamain Sterling','Robert Whittaker','Lyoto Machida'];
if(JSON.stringify(records.map(record=>record.fighter))!==JSON.stringify(expected))fail('Batch-seven fighter order or identity mismatch.',records.map(record=>record.fighter));
const duplicate=records.find(record=>API.has(record.fighter));if(duplicate)fail(`Canonical record already exists: ${duplicate.fighter}`);
const invalid=records.map(record=>({fighter:record.fighter,...API.validate(record)})).filter(row=>!row.valid);if(invalid.length)fail('One or more batch-seven records failed validation.',invalid);
records.forEach(record=>API.register(record));
const fighters=records.map(record=>record.fighter);
const fightCount=records.reduce((sum,record)=>sum+record.fights.length,0);
if(fighters.length!==10||fightCount!==199)fail(`Expected 10 fighters and 199 fights; received ${fighters.length} fighters and ${fightCount} fights.`);
window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_SEVEN={version:VERSION,applied:true,recordCount:fighters.length,fightCount,fighters,derived:Object.fromEntries(fighters.map(fighter=>[fighter,API.deriveFor(fighter)])),mutatesRankingData:false};
document.documentElement.setAttribute('data-canonical-fighter-facts-batch-seven',VERSION);
})();
