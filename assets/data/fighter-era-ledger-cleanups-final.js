// Final Fighter Era Ledger Cleanup Patch.
// Applies Cody-approved canonical prime-window locks before any dependent adapters run.
(function(){
  const VERSION='fighter-era-ledger-cleanups-final-20260710c-roster-window-lock';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;
  if(!ledgers){
    window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS_FINAL={version:VERSION,error:'Missing UFC_FIGHTER_ERA_LEDGERS',mutatesScores:false};
    return;
  }

  function patchLossContext(fighter,lossContextPatch){
    const row=ledgers[fighter];
    if(!row)return;
    row.lossContext={...(row.lossContext||{}),...lossContextPatch};
  }

  function patchWindow(fighter,windowPatch,decision={}){
    const row=ledgers[fighter];
    if(!row)return;
    if(decision.status)row.status=decision.status;
    row.window={...(row.window||{}),...windowPatch};
    row.windowDecision={
      approved:true,
      approvedBy:'Cody',
      decision:decision.decision||'adjusted-and-locked',
      rationale:decision.rationale||'',
      version:VERSION,
      dependentRebuildRequired:decision.dependentRebuildRequired!==false
    };
    if(decision.lossContext)patchLossContext(fighter,decision.lossContext);
    if(row.longevity&&decision.dependentRebuildRequired!==false){
      row.longevity={...row.longevity,windowLockedPendingRecalculation:true};
    }
  }

  patchLossContext('Tito Ortiz',{postPrimeLosses:[
    {label:'Chuck Liddell II',date:'2006-12-30',phase:'post-prime elite finish loss'},
    {label:'Lyoto Machida',date:'2008-05-24',phase:'post-prime elite decision loss'},
    {label:'Matt Hamill',date:'2010-10-23',phase:'post-prime decision loss'},
    {label:'Rashad Evans II',date:'2011-08-06',phase:'post-prime elite finish loss'},
    {label:'Antonio Rogerio Nogueira',date:'2011-12-10',phase:'post-prime finish loss'},
    {label:'Forrest Griffin III',date:'2012-07-07',phase:'post-prime decision loss'}
  ]});

  const frankie=ledgers['Frankie Edgar'];
  if(frankie){
    const recovered=Array.isArray(frankie.lossContext?.recoveredLosses)?frankie.lossContext.recoveredLosses.slice():[];
    if(!recovered.some(event=>String(event?.label||'').includes('Gray Maynard I'))){
      recovered.unshift({
        label:'Gray Maynard I',
        date:'2008-04-02',
        phase:'pre-prime non-elite decision loss',
        recovery:'Rebounded into the Sean Sherk win and UFC lightweight title run.'
      });
    }
    patchLossContext('Frankie Edgar',{recoveredLosses:recovered});
  }

  patchWindow('Dustin Poirier',{start:'2018-04-14',startLabel:'Justin Gaethje I'},{
    rationale:'Gaethje I begins the sustained elite-lightweight run.'
  });
  patchWindow('Justin Gaethje',{start:'2018-08-25',startLabel:'James Vick'},{
    rationale:'Vick begins the connected elite contender run through the Holloway endpoint.'
  });
  patchWindow('Israel Adesanya',{start:'2019-04-13',startLabel:'Kelvin Gastelum'},{
    rationale:'The interim-title win is the first undeniable championship-level proof.'
  });
  patchWindow('Ronda Rousey',{start:'2013-02-23',startLabel:'Liz Carmouche'},{
    rationale:'Her first UFC title defense belongs inside the UFC elite-prime window.'
  });
  patchWindow('Randy Couture',{start:'1997-05-30',startLabel:'Vitor Belfort I'},{
    rationale:'The full UFC championship arc stays connected; long absences are handled by the 18-month gap cap.'
  });
  patchWindow('T.J. Dillashaw',{
    end:'2022-10-22',
    endLabel:'Aljamain Sterling',
    endType:'unrecovered_elite_loss',
    endReason:'The Sandhagen win re-proved elite form after the suspension; the Sterling title loss is the endpoint.'
  },{
    rationale:'Sterling, not Cejudo, closes the shared prime after TJ re-proved elite form.',
    lossContext:{
      unrecoveredLoss:{label:'Aljamain Sterling',date:'2022-10-22',type:'late-prime elite title finish/injury loss'},
      recoveredLosses:[
        {label:'Dominick Cruz',date:'2016-01-17',recovery:'Recovered with Garbrandt title wins.'},
        {label:'Henry Cejudo',date:'2019-01-19',recovery:'Returned from suspension and re-proved elite form against Cory Sandhagen.'}
      ],
      postPrimeLosses:[]
    }
  });
  patchWindow('Aljamain Sterling',{
    start:'2019-06-08',
    startLabel:'Pedro Munhoz',
    end:null,
    endLabel:'Current elite form',
    endType:'open_current_elite',
    endReason:'The O’Malley loss did not close the window because Sterling re-proved elite featherweight form.'
  },{
    status:'locked-current',
    rationale:'Munhoz begins the elite run and the window remains open/current.',
    lossContext:{
      unrecoveredLoss:null,
      weirdResults:['Petr Yan I DQ title win handled with context.'],
      recoveredLosses:[
        {label:'Sean O’Malley',date:'2023-08-19',phase:'prime elite title finish loss',recovery:'Featherweight elite form kept the window open.'}
      ],
      postPrimeLosses:[]
    }
  });
  patchWindow('Sean Strickland',{start:'2021-07-31',startLabel:'Uriah Hall'},{
    rationale:'Hall begins the sustained contender run that produced the UFC title.'
  });
  patchWindow('Robert Whittaker',{start:'2016-11-27',startLabel:'Derek Brunson'},{
    rationale:'Brunson is the elite breakthrough at the start of the connected middleweight run.'
  });
  patchWindow('Dan Henderson',{start:'2009-01-17',startLabel:'Rich Franklin'},{
    rationale:'The former-champion win begins Henderson’s late UFC elite window.'
  });

  const matt=ledgers['Matt Hughes'];
  if(matt){
    matt.window={...(matt.window||{}),startLabel:'Carlos Newton I'};
    if(matt.longevity){
      matt.longevity={
        ...matt.longevity,
        adjustmentNote:String(matt.longevity.adjustmentNote||'').replace(/Newton II/g,'Newton I')
      };
    }
    matt.windowDecision={approved:true,approvedBy:'Cody',decision:'label-corrected-and-locked',rationale:'The 2001-11-02 date is Carlos Newton I, not Newton II.',version:VERSION,dependentRebuildRequired:false};
  }

  const changedWindowFighters=['Dustin Poirier','Justin Gaethje','Israel Adesanya','Ronda Rousey','Randy Couture','T.J. Dillashaw','Aljamain Sterling','Sean Strickland','Robert Whittaker','Dan Henderson'];
  const labelOnlyFighters=['Matt Hughes'];
  const roster=Object.keys(ledgers);
  roster.forEach(fighter=>{
    const row=ledgers[fighter];
    row.window={...(row.window||{}),canonical:true,locked:true,lockVersion:VERSION};
    if(!row.windowDecision){
      row.windowDecision={approved:true,approvedBy:'Cody',decision:'confirmed-and-locked',rationale:'Existing Fighter Era Ledger boundary confirmed.',version:VERSION,dependentRebuildRequired:false};
    }
  });

  era.cleanupFinalVersion=VERSION;
  era.canonicalWindowLock={
    version:VERSION,
    approved:true,
    fighterCount:roster.length,
    fighters:roster,
    changedWindowFighters,
    labelOnlyFighters,
    gapCapMonths:era.rules?.gapCapMonthsDefault||18,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_FIGHTER_ERA_WINDOW_LOCK=era.canonicalWindowLock;
  window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS_FINAL={
    version:VERSION,
    patched:true,
    fighters:['Tito Ortiz','Frankie Edgar',...changedWindowFighters,...labelOnlyFighters],
    changedWindowFighters,
    labelOnlyFighters,
    canonicalWindowCount:roster.length,
    mutatesWindows:true,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-fighter-era-ledger-cleanups-final',VERSION);
})();
