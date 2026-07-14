// Cody-approved shared Fighter Era Ledger phase corrections from the canonical Loss Context audit.
// Shadow-only on PR #39. These windows feed category reconstruction but do not write live scores.
(function(){
  'use strict';
  const VERSION='fighter-era-ledger-approved-loss-context-resolutions-20260714a';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;
  if(!ledgers){
    window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LOSS_CONTEXT_RESOLUTIONS={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS',mutatesScores:false};
    return;
  }

  const approvedBy='Cody';
  const approvedAt='2026-07-14';
  const windowChanges=[];

  function approveWindow(fighter,windowPatch,decision){
    const ledger=ledgers[fighter];
    if(!ledger)return;
    ledger.status='locked';
    ledger.window={...(ledger.window||{}),...windowPatch};
    ledger.notes=[ledger.notes,decision].filter(Boolean).join(' ');
    ledger.approvedLossContextPhaseResolution={approved:true,approvedBy,approvedAt,decision,version:VERSION};
    windowChanges.push(fighter);
  }

  approveWindow('Randy Couture',{
    start:'1997-05-30',
    startLabel:'Vitor Belfort I',
    startReason:'Couture was already operating at UFC championship level. Barnett, Ricco Rodriguez, and Vitor Belfort II are therefore prime losses rather than pre-prime losses.'
  },'Start the shared UFC elite-prime window at Vitor Belfort I on May 30, 1997.');

  approveWindow('Israel Adesanya',{
    end:'2024-08-18',
    endLabel:'Dricus du Plessis',
    endType:'unrecovered_elite_loss',
    endReason:'Correct the shared endpoint to the canonical UFC 305 fight date. The Dricus du Plessis loss remains inside the prime window.'
  },'Correct the Dricus du Plessis endpoint from August 17 to August 18, 2024.');

  approveWindow('Sean Strickland',{
    start:'2021-07-31',
    startLabel:'Uriah Hall',
    startReason:'The Uriah Hall win established Strickland as an elite middleweight contender before the Pereira and Cannonier losses.'
  },'Start the shared UFC elite-prime window at Uriah Hall on July 31, 2021.');

  era.fighters=Object.keys(ledgers);
  era.approvedLossContextPhaseResolutions={version:VERSION,approvedBy,approvedAt,windowChanges:[...windowChanges],mutatesScores:false};
  window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LOSS_CONTEXT_RESOLUTIONS={version:VERSION,applied:true,approvedBy,approvedAt,windowChanges:[...windowChanges],fighterCount:Object.keys(ledgers).length,mutatesScores:false,appliedAt:new Date().toISOString()};
  if(typeof document!=='undefined'&&document?.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-fighter-era-ledger-approved-loss-context-resolutions',VERSION);
  }
})();
