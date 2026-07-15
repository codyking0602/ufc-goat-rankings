// Cody-approved factual corrections discovered during category reconstruction.
// This layer updates canonical fight classifications only; it never writes scores, ranks, OVRs, or display data.
(function(){
  'use strict';

  const VERSION='canonical-fighter-facts-approved-corrections-20260714c-shared-era-round-audit';
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

  // Shared-Era-Ledger completion. Decision rows use official majority/consensus round scoring.
  // Stoppages count the finishing round for the winner; genuinely interpretive prior-round calls remain review status.
  const ROUND_CORRECTIONS=[
    {fighter:'Ilia Topuria',fightId:'2022-12-10-bryce-mitchell',won:2,lost:0,status:'locked',note:'Clear two-round submission win; Topuria controlled the opening round and receives the finishing round.'},
    {fighter:'Kamaru Usman',fightId:'2018-05-19-demian-maia',won:5,lost:0,status:'review',note:'Five-round decision audited as an Usman sweep under majority/consensus round scoring; two judges’ 49-46 totals are retained as scorecard context.'},
    {fighter:'Daniel Cormier',fightId:'2014-05-24-dan-henderson',won:3,lost:0,status:'locked',note:'Cormier controlled the fight through the third-round submission.'},
    {fighter:'Dricus du Plessis',fightId:'2023-03-04-derek-brunson',won:1,lost:1,status:'review',note:'Brunson receives the opening round; du Plessis receives the finishing second round.'},
    {fighter:'Tyron Woodley',fightId:'2014-03-15-carlos-condit',won:2,lost:0,status:'review',note:'Woodley receives the opening round and the second-round stoppage/injury frame.'},
    {fighter:'Tyron Woodley',fightId:'2014-06-14-rory-macdonald',won:0,lost:3,status:'locked',note:'MacDonald won all three rounds on the official decision.'},
    {fighter:'Tyron Woodley',fightId:'2014-08-23-dong-hyun-kim',won:1,lost:0,status:'locked',note:'First-round knockout win.'},
    {fighter:'Tyron Woodley',fightId:'2015-01-31-kelvin-gastelum',won:2,lost:1,status:'review',note:'Split decision audited as two Woodley rounds to one Gastelum round under official-majority round scoring.'},
    {fighter:'Randy Couture',fightId:'2008-11-15-brock-lesnar',won:0,lost:2,status:'review',note:'Lesnar receives the opening round and the second-round finishing frame.'},
    {fighter:'Jose Aldo',fightId:'2018-07-28-jeremy-stephens',won:1,lost:0,status:'locked',note:'First-round body-shot stoppage win.'},
    {fighter:'Jose Aldo',fightId:'2019-02-02-renato-moicano',won:1,lost:1,status:'review',note:'Moicano receives the opening round; Aldo receives the second-round finishing frame.'},
    {fighter:'Jose Aldo',fightId:'2019-05-11-alexander-volkanovski',won:0,lost:3,status:'locked',note:'Volkanovski won all three rounds on the official decision.'},
    {fighter:'Jose Aldo',fightId:'2019-12-14-marlon-moraes',won:1,lost:2,status:'review',note:'Split decision audited as one Aldo round to two Moraes rounds under official-majority round scoring.'},
    {fighter:'Jose Aldo',fightId:'2020-07-11-petr-yan',won:1,lost:4,status:'locked',note:'Aldo receives the opening round; Yan receives rounds two through four and the fifth-round finishing frame.'},
    {fighter:'Jose Aldo',fightId:'2020-12-19-marlon-vera',won:2,lost:1,status:'locked',note:'Official unanimous decision audited two rounds to one for Aldo.'},
    {fighter:'Jose Aldo',fightId:'2021-08-07-pedro-munhoz',won:3,lost:0,status:'locked',note:'Official unanimous decision sweep for Aldo.'},
    {fighter:'Jose Aldo',fightId:'2021-12-04-rob-font',won:5,lost:0,status:'review',note:'Audited as an Aldo five-round consensus sweep; one judge’s 49-46 total remains scorecard context.'},
    {fighter:'Jose Aldo',fightId:'2022-08-20-merab-dvalishvili',won:0,lost:3,status:'locked',note:'Dvalishvili won all three rounds on the official decision.'},
    {fighter:'Petr Yan',fightId:'2019-12-14-urijah-faber',won:3,lost:0,status:'locked',note:'Yan controlled the first two rounds and receives the third-round finishing frame.'},
    {fighter:'Jessica Andrade',fightId:'2017-09-23-claudia-gadelha',won:3,lost:0,status:'locked',note:'Official unanimous decision sweep for Andrade.'},
    {fighter:'Jessica Andrade',fightId:'2018-02-24-tecia-torres',won:2,lost:1,status:'review',note:'Official unanimous decision audited two rounds to one for Andrade.'},
    {fighter:'Carla Esparza',fightId:'2014-12-12-rose-namajunas',won:3,lost:0,status:'locked',note:'Esparza controlled the first two rounds and receives the third-round submission frame.'},
    {fighter:'Carla Esparza',fightId:'2015-03-14-joanna-jedrzejczyk',won:0,lost:2,status:'locked',note:'Jedrzejczyk controlled the opening round and receives the second-round finishing frame.'},
    {fighter:'Carla Esparza',fightId:'2016-04-23-juliana-lima',won:2,lost:1,status:'locked',note:'Official unanimous decision audited two rounds to one for Esparza.'},
    {fighter:'Carla Esparza',fightId:'2017-02-19-randa-markos',won:1,lost:2,status:'review',note:'Controversial split decision follows official-majority round scoring: one Esparza round, two Markos rounds.'},
    {fighter:'Carla Esparza',fightId:'2017-06-25-maryna-moroz',won:3,lost:0,status:'review',note:'Official unanimous decision audited as an Esparza consensus sweep.'},
    {fighter:'Carla Esparza',fightId:'2017-12-30-cynthia-calvillo',won:2,lost:1,status:'locked',note:'All three judges scored the decision 29-28 for Esparza.'},
    {fighter:'Carla Esparza',fightId:'2018-06-09-claudia-gadelha',won:1,lost:2,status:'review',note:'Split decision follows official-majority round scoring: one Esparza round, two Gadelha rounds.'},
    {fighter:'Carla Esparza',fightId:'2018-09-08-tatiana-suarez',won:0,lost:3,status:'locked',note:'Suarez controlled the first two rounds and receives the third-round finishing frame.'},
    {fighter:'Chael Sonnen',fightId:'2013-04-27-jon-jones',won:0,lost:1,status:'locked',note:'First-round stoppage loss to Jones.'},
    {fighter:'Dan Henderson',fightId:'2014-05-24-daniel-cormier',won:0,lost:3,status:'locked',note:'Cormier controlled the fight through the third-round submission.'}
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
      type:'championship-context',
      fighter:correction.fighter,
      fightId:fight.id,
      previousType,
      championshipType:correction.championshipType||previousType,
      specialAccomplishmentType:correction.specialAccomplishmentType||null
    });
  });

  ROUND_CORRECTIONS.forEach(correction=>{
    const record=API.get(correction.fighter);
    if(!record)fail(`Missing canonical fighter: ${correction.fighter}`);
    const fight=(record.fights||[]).find(row=>row.id===correction.fightId);
    if(!fight)fail(`Missing canonical fight for ${correction.fighter}: ${correction.fightId}`);
    const previousRounds=fight.rounds||null;
    fight.rounds={
      status:'audited',
      won:correction.won,
      lost:correction.lost,
      drawn:Number(correction.drawn||0),
      reviewStatus:correction.status,
      note:`Shared Fighter Era Ledger round-audit completion. ${correction.note}`
    };
    API.replace(record,correction.note);
    applied.push({
      type:'round-audit',
      fighter:correction.fighter,
      fightId:fight.id,
      previousStatus:previousRounds?.status||null,
      rounds:{won:correction.won,lost:correction.lost,drawn:Number(correction.drawn||0)},
      reviewStatus:correction.status
    });
  });

  const report={
    version:VERSION,
    applied:true,
    correctionCount:applied.length,
    championshipCorrectionCount:CORRECTIONS.length,
    roundCorrectionCount:ROUND_CORRECTIONS.length,
    lockedRoundCorrectionCount:ROUND_CORRECTIONS.filter(row=>row.status==='locked').length,
    reviewRoundCorrectionCount:ROUND_CORRECTIONS.filter(row=>row.status==='review').length,
    applied,
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_FIGHTER_FACTS_APPROVED_CORRECTIONS=report;
  document.documentElement.setAttribute('data-canonical-fighter-facts-approved-corrections',VERSION);
})();
