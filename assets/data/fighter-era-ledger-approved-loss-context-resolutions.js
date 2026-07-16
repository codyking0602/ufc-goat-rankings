// Cody-approved shared Fighter Era Ledger phase corrections from the canonical Loss Context audit.
// Shadow-only on PR #39. These windows feed category reconstruction but do not write live scores.
(function(){
  'use strict';
  const VERSION='fighter-era-ledger-approved-loss-context-resolutions-20260716c-gaethje-current';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;
  if(!ledgers){
    window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LOSS_CONTEXT_RESOLUTIONS={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS',mutatesScores:false};
    return;
  }

  const approvedBy='Cody';
  const approvedAt='2026-07-16';
  const windowChanges=[];
  const primeWindowChanges=[];

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

  const cejudo=ledgers['Henry Cejudo'];
  if(cejudo){
    const decision='Keep the shared prime start at Demetrious Johnson II and close it on the Dominick Cruz retirement win. The three-year retirement ends the original elite-prime window; Aljamain Sterling and all later fights are post-prime comeback activity.';
    cejudo.status='locked';
    cejudo.window={
      ...(cejudo.window||{}),
      start:'2018-08-04',
      startLabel:'Demetrious Johnson II',
      end:'2020-05-09',
      endLabel:'Dominick Cruz',
      endType:'retirement_win',
      endReason:'Cejudo retired after the Cruz title-defense win. The three-year retirement creates a clean phase break before the Sterling comeback.'
    };
    cejudo.lossContext={
      ...(cejudo.lossContext||{}),
      unrecoveredLoss:null,
      recoveredLosses:[{label:'Demetrious Johnson I / Joseph Benavidez',date:'2016',phase:'pre-prime elite losses',recovery:'Cejudo later beat Demetrious Johnson and entered his two-division championship prime.'}],
      postPrimeLosses:[
        {label:'Aljamain Sterling',date:'2023-05-06',phase:'post-prime comeback title loss'},
        {label:'Merab Dvalishvili',date:'2024-02-17',phase:'post-prime comeback elite loss'},
        {label:'Song Yadong',date:'2025-02-22',phase:'post-prime comeback elite loss'},
        {label:'Payton Talbott',date:'2025-12-06',phase:'post-prime comeback loss'}
      ]
    };
    cejudo.longevity={
      ...(cejudo.longevity||{}),
      gapAdjustedMonths:21.2,
      activeEliteYears:1.77,
      adjustmentNote:'Demetrious Johnson II through Dominick Cruz; no retirement-gap credit.',
      note:'Huge two-division peak, but the original UFC elite-prime run ends at retirement after the Cruz win.'
    };
    cejudo.notes=[cejudo.notes,decision].filter(Boolean).join(' ');
    cejudo.approvedPrimeEndpointResolution={approved:true,approvedBy,approvedAt,decision,version:VERSION};
    primeWindowChanges.push('Henry Cejudo');
  }

  const gaethje=ledgers['Justin Gaethje'];
  if(gaethje){
    const decision='Keep Justin Gaethje’s shared UFC elite-prime window open through current championship form. The Max Holloway loss was recovered by the Rafael Fiziev rematch win, the Paddy Pimblett interim-title win, and the Ilia Topuria undisputed-title win.';
    gaethje.status='locked-current';
    gaethje.window={
      ...(gaethje.window||{}),
      start:'2020-05-09',
      startLabel:'Tony Ferguson',
      end:null,
      endLabel:'Current championship form',
      endType:'open_current_champion',
      endReason:'Holloway did not close the window because Gaethje subsequently re-proved elite form and won both interim and undisputed UFC lightweight title fights.'
    };
    gaethje.lossContext={
      ...(gaethje.lossContext||{}),
      unrecoveredLoss:null,
      weirdResults:[],
      recoveredLosses:[
        {label:'Khabib Nurmagomedov',date:'2020-10-24',recovery:'Recovered with elite contender wins.'},
        {label:'Charles Oliveira',date:'2022-05-07',recovery:'Recovered with Fiziev and Poirier elite wins.'},
        {label:'Max Holloway',date:'2024-04-13',phase:'prime elite finish loss',recovery:'Recovered with Rafael Fiziev II, an interim-title win over Paddy Pimblett, and the undisputed-title win over Ilia Topuria.'}
      ],
      postPrimeLosses:[]
    };
    gaethje.longevity={
      ...(gaethje.longevity||{}),
      gapAdjustedMonths:null,
      activeEliteYears:null,
      adjustmentNote:'Tony Ferguson through current championship form; every inactivity gap remains capped at 18 months.',
      note:'Current undisputed lightweight champion with an open elite-prime window.'
    };
    gaethje.notes=[gaethje.notes,decision].filter(Boolean).join(' ');
    gaethje.approvedPrimeEndpointResolution={approved:true,approvedBy,approvedAt,decision,version:VERSION};
    primeWindowChanges.push('Justin Gaethje');
  }

  era.fighters=Object.keys(ledgers);
  era.approvedLossContextPhaseResolutions={version:VERSION,approvedBy,approvedAt,windowChanges:[...windowChanges],primeWindowChanges:[...primeWindowChanges],mutatesScores:false};
  window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LOSS_CONTEXT_RESOLUTIONS={version:VERSION,applied:true,approvedBy,approvedAt,windowChanges:[...windowChanges],primeWindowChanges:[...primeWindowChanges],fighterCount:Object.keys(ledgers).length,mutatesScores:false,appliedAt:new Date().toISOString()};
  if(typeof document!=='undefined'&&document?.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-fighter-era-ledger-approved-loss-context-resolutions',VERSION);
  }
})();