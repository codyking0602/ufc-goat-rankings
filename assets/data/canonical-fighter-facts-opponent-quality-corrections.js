// Cody-approved factual correction discovered during Opponent Quality reconstruction.
// Shadow/audit-only: updates canonical fight facts in the reconstruction test chain and never writes live scores.
(function(){
  'use strict';

  const VERSION='canonical-fighter-facts-opponent-quality-corrections-20260714b';
  const API=window.UFC_CANONICAL_FIGHTER_FACTS;
  const roundStatus={status:'not-audited'};

  function fail(message,details=[]){
    const report={version:VERSION,applied:false,error:String(message||'Unknown Opponent Quality fact correction error.'),details,mutatesRankingData:false};
    window.UFC_CANONICAL_FIGHTER_FACTS_OPPONENT_QUALITY_CORRECTIONS=report;
    throw new Error(`[${VERSION}] ${report.error}`);
  }

  if(!API)fail('UFC_CANONICAL_FIGHTER_FACTS is not loaded.');
  if(API.count?.()!==73)fail(`Expected 73 canonical fighters before Opponent Quality fact corrections; found ${API.count?.()||0}.`);

  const record=API.get('B.J. Penn');
  if(!record)fail('Missing canonical fighter: B.J. Penn');
  const fightId='2003-04-25-duane-ludwig';
  const alreadyPresent=(record.fights||[]).find(fight=>fight.id===fightId||fight.opponent==='Duane Ludwig');
  const appliedCorrections=[];
  if(!alreadyPresent){
    const fight={
      id:fightId,
      date:'2003-04-25',
      opponent:'Duane Ludwig',
      event:'UFC 42',
      division:'Lightweight',
      scheduledRounds:3,
      officialResult:'win',
      scoringDisposition:'count-win',
      method:{category:'submission',round:1},
      rounds:roundStatus,
      opponentContext:{qualityTier:'solid',championStatus:'contender',reviewStatus:'locked',note:'Cody-approved factual correction: official UFC 42 win omitted from the canonical B.J. Penn ledger.'},
      championshipContext:{type:'none'}
    };
    record.fights.push(fight);
    record.fights.sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.id).localeCompare(String(b.id)));
    record.coverage={...(record.coverage||{}),note:[record.coverage?.note,'Opponent Quality audit added the omitted official UFC 42 win over Duane Ludwig.'].filter(Boolean).join(' ')};
    API.replace(record,'Cody-approved Opponent Quality factual correction: add B.J. Penn vs. Duane Ludwig at UFC 42.');
    appliedCorrections.push({fighter:'B.J. Penn',fightId,opponent:'Duane Ludwig',action:'added-official-ufc-win'});
  }else{
    appliedCorrections.push({fighter:'B.J. Penn',fightId:alreadyPresent.id,opponent:'Duane Ludwig',action:'already-present'});
  }

  // Three legacy rows initially suspected to be missing facts were rechecked against the canonical ledgers.
  // They are not UFC wins and must be removed from Opponent Quality rather than added as fight facts.
  const rejectedFalseFactAdditions=[
    {fighter:'Amanda Nunes',opponent:'Tonya Evinger',resolution:'No UFC fight occurred; Evinger fought Cris Cyborg at UFC 214.'},
    {fighter:'Valentina Shevchenko',opponent:'Alexis Davis',resolution:'No UFC fight occurred.'},
    {fighter:'Holly Holm',opponent:'Iasmin Lucindo',resolution:'No UFC fight occurred in the approved canonical timeline.'}
  ];

  const audit=API.audit();
  if(!audit.passed)fail('Canonical fighter facts failed validation after the Opponent Quality correction.',audit.invalid);
  const report={
    version:VERSION,
    applied:true,
    correctionCount:appliedCorrections.filter(row=>row.action==='added-official-ufc-win').length,
    appliedCorrections,
    rejectedFalseFactAdditions,
    canonicalFighterCount:API.count(),
    canonicalFightCount:audit.results.reduce((sum,row)=>sum+(API.get(row.fighter)?.fights?.length||0),0),
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_FIGHTER_FACTS_OPPONENT_QUALITY_CORRECTIONS=report;
  document.documentElement.setAttribute('data-canonical-fighter-facts-opponent-quality-corrections',VERSION);
})();
