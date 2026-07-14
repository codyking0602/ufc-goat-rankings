// Cody-approved factual corrections discovered during Championship reconstruction.
// This layer updates canonical fight classifications only; it never writes scores, ranks, OVRs, or display data.
(function(){
  'use strict';

  const VERSION='canonical-fighter-facts-approved-corrections-20260714b-final-championship-review';
  const API=window.UFC_CANONICAL_FIGHTER_FACTS;
  const CORRECTIONS=[
    {
      fighter:'Randy Couture',
      fightId:'2003-09-26-tito-ortiz',
      championshipType:'second-division-undisputed',
      note:'Cody-approved factual correction: Couture had already been UFC heavyweight champion; the Tito Ortiz win made him undisputed champion in a second UFC division.'
    },
    {
      fighter:'B.J. Penn',
      fightId:'2008-01-19-joe-stevenson',
      championshipType:'vacant-second-division',
      note:'Cody-approved factual correction: the vacant lightweight title was Penn’s second UFC championship division after welterweight.'
    },
    {
      fighter:'Robert Whittaker',
      date:'2018-06-09',
      specialAccomplishmentType:'missed-weight-championship-context',
      note:'Cody-approved special context: Yoel Romero missed weight, so this is a Championship accomplishment but not an official UFC title-fight win.'
    }
  ];

  function fail(message,details=[]){
    const report={version:VERSION,applied:false,error:String(message||'Unknown correction error.'),details,mutatesRankingData:false};
    window.UFC_CANONICAL_FIGHTER_FACTS_APPROVED_CORRECTIONS=report;
    throw new Error(`[${VERSION}] ${report.error}`);
  }

  if(!API)fail('UFC_CANONICAL_FIGHTER_FACTS is not loaded.');
  if(API.count?.()!==73)fail(`Expected 73 canonical fighters before applying corrections; found ${API.count?.()||0}.`);

  const applied=[];
  CORRECTIONS.forEach(correction=>{
    const record=API.get(correction.fighter);
    if(!record)fail(`Missing canonical fighter: ${correction.fighter}`);
    const fight=(record.fights||[]).find(row=>correction.fightId?row.id===correction.fightId:row.date===correction.date);
    if(!fight)fail(`Missing canonical fight for ${correction.fighter}: ${correction.fightId||correction.date}`);
    const previousType=fight?.championshipContext?.type||'none';
    fight.championshipContext={
      ...(fight.championshipContext||{}),
      ...(correction.championshipType?{type:correction.championshipType}:{}),
      ...(correction.specialAccomplishmentType?{specialAccomplishmentType:correction.specialAccomplishmentType,officialTitleFight:false}:{}),
      reviewStatus:'locked',
      note:[fight?.championshipContext?.note,correction.note].filter(Boolean).join(' ')
    };
    API.replace(record,correction.note);
    applied.push({
      fighter:correction.fighter,
      fightId:fight.id,
      previousType,
      championshipType:correction.championshipType||previousType,
      specialAccomplishmentType:correction.specialAccomplishmentType||null
    });
  });

  const report={version:VERSION,applied:true,correctionCount:applied.length,applied,mutatesRankingData:false};
  window.UFC_CANONICAL_FIGHTER_FACTS_APPROVED_CORRECTIONS=report;
  document.documentElement.setAttribute('data-canonical-fighter-facts-approved-corrections',VERSION);
})();