// Final Fighter Era Ledger Cleanup Patch.
// Fixes the last shadow QA edge cases without changing live scores.
(function(){
  const VERSION='fighter-era-ledger-cleanups-final-20260709a-tito-post-prime';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;
  if(!ledgers){
    window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS_FINAL={version:VERSION,error:'Missing UFC_FIGHTER_ERA_LEDGERS',mutatesScores:false};
    return;
  }

  function patch(fighter,lossContextPatch){
    const row=ledgers[fighter];
    if(!row)return;
    row.lossContext={...(row.lossContext||{}),...lossContextPatch};
  }

  patch('Tito Ortiz',{postPrimeLosses:[
    {label:'Chuck Liddell II',date:'2006-12-30',phase:'post-prime elite finish loss'},
    {label:'Lyoto Machida',date:'2008-05-24',phase:'post-prime elite decision loss'},
    {label:'Matt Hamill',date:'2010-10-23',phase:'post-prime decision loss'},
    {label:'Rashad Evans II',date:'2011-08-06',phase:'post-prime elite finish loss'},
    {label:'Antonio Rogerio Nogueira',date:'2011-12-10',phase:'post-prime finish loss'},
    {label:'Forrest Griffin III',date:'2012-07-07',phase:'post-prime decision loss'}
  ]});

  era.cleanupFinalVersion=VERSION;
  window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS_FINAL={version:VERSION,patched:true,mutatesScores:false,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-fighter-era-ledger-cleanups-final',VERSION);
})();
