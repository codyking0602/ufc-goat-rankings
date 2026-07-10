// Loss Context ledger completion batch one.
// Adds machine-readable UFC loss events for two high-confidence flagged fighters.
// Does not change live penalties, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='loss-context-ledger-completion-batch-one-20260710a-whittaker-strickland';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  if(!ledgers){
    window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_ONE={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  const BATCH={
    'Robert Whittaker':{
      recoveredLosses:[
        {label:'Court McGee',date:'2013-08-28',type:'pre-prime non-elite decision loss',method:'Split decision',notes:'Corrected historical fight date; loss occurred before the Derek Brunson prime start.'},
        {label:'Stephen Thompson',date:'2014-02-22',type:'pre-prime elite finish loss',method:'TKO',notes:'Pre-prime loss to an elite/championship-level opponent.'},
        {label:'Israel Adesanya I',date:'2019-10-06',type:'prime elite title finish loss',method:'KO',recovery:'Whittaker returned to elite contender form and earned the title rematch.'},
        {label:'Israel Adesanya II',date:'2022-02-12',type:'prime elite title decision loss',method:'Decision',recovery:'Whittaker remained an elite middleweight contender afterward.'},
        {label:'Dricus du Plessis',date:'2023-07-08',type:'prime elite contender finish loss',method:'TKO',recovery:'Whittaker re-proved elite relevance with wins over Paulo Costa and Ikram Aliskerov.'}
      ],
      unrecoveredLoss:{label:'Khamzat Chimaev',date:'2024-10-26',type:'prime elite finish loss',method:'Submission',notes:'Canonical unrecovered endpoint.'},
      postPrimeLosses:[
        {label:'Reinier de Ridder',date:'2025-07-26',type:'post-prime elite decision loss',method:'Decision',notes:'Current-table late-career loss after the Khamzat endpoint; penalty value is zero.'}
      ]
    },
    'Sean Strickland':{
      recoveredLosses:[
        {label:'Santiago Ponzinibbio',date:'2015-02-22',type:'pre-prime non-elite decision loss',method:'Decision',notes:'Pre-prime loss before the Uriah Hall elite-window start.'},
        {label:'Kamaru Usman',date:'2017-04-08',type:'pre-prime elite decision loss',method:'Decision',notes:'Pre-prime loss to a future champion/elite opponent.'},
        {label:'Elizeu Zaleski dos Santos',date:'2018-05-12',type:'pre-prime non-elite finish loss',method:'KO',notes:'Finished pre-prime non-elite loss.'},
        {label:'Alex Pereira',date:'2022-07-02',type:'prime elite finish loss',method:'KO',recovery:'Strickland later won the UFC middleweight title.'},
        {label:'Jared Cannonier',date:'2022-12-17',type:'prime elite decision loss',method:'Split decision',recovery:'Strickland remained in the elite title picture.'},
        {label:'Dricus du Plessis I',date:'2024-01-20',type:'prime elite title decision loss',method:'Split decision',recovery:'Strickland remained title-level and the canonical window stayed open.'},
        {label:'Dricus du Plessis II',date:'2025-02-09',type:'prime elite title decision loss',method:'Decision',recovery:'Current-table elite results keep the canonical window open.'}
      ],
      unrecoveredLoss:null,
      postPrimeLosses:[]
    }
  };

  function norm(value){return String(value||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function eventKey(event){return `${norm(event?.label)}|${String(event?.date||'')}`;}
  function mergeEvents(existing,additions){
    const out=Array.isArray(existing)?existing.map(event=>typeof event==='string'?{label:event}:event):[];
    const index=new Map(out.map((event,i)=>[eventKey(event),i]));
    (additions||[]).forEach(event=>{
      const key=eventKey(event);
      if(index.has(key))out[index.get(key)]={...out[index.get(key)],...event};
      else{index.set(key,out.length);out.push({...event});}
    });
    return out;
  }

  const applied=[];
  const missing=[];
  Object.entries(BATCH).forEach(([fighter,patch])=>{
    const ledger=ledgers[fighter];
    if(!ledger){missing.push(fighter);return;}
    const current=ledger.lossContext||{};
    const recoveredLosses=mergeEvents(current.recoveredLosses,patch.recoveredLosses);
    const postPrimeLosses=mergeEvents(current.postPrimeLosses,patch.postPrimeLosses);
    let unrecoveredLoss=current.unrecoveredLoss||null;
    if(patch.unrecoveredLoss){
      unrecoveredLoss=unrecoveredLoss&&eventKey(unrecoveredLoss)===eventKey(patch.unrecoveredLoss)
        ?{...unrecoveredLoss,...patch.unrecoveredLoss}
        :{...patch.unrecoveredLoss};
    }else if(patch.unrecoveredLoss===null){
      unrecoveredLoss=null;
    }
    ledger.lossContext={
      ...current,
      unrecoveredLoss,
      recoveredLosses,
      postPrimeLosses,
      upwardDivisionLosses:Array.isArray(current.upwardDivisionLosses)?current.upwardDivisionLosses:[],
      weirdResults:Array.isArray(current.weirdResults)?current.weirdResults:[]
    };
    ledger.lossContextCompletion={
      ...(ledger.lossContextCompletion||{}),
      version:VERSION,
      batch:1,
      machineReadable:true,
      source:'fighter packet audit plus canonical Era window review',
      completedAt:new Date().toISOString()
    };
    applied.push({fighter,recoveredLosses:recoveredLosses.length,postPrimeLosses:postPrimeLosses.length,unrecoveredLoss:unrecoveredLoss?.label||null});
  });

  const report={
    version:VERSION,
    batch:1,
    fighters:Object.keys(BATCH),
    applied,
    appliedCount:applied.length,
    missing,
    correctedDates:[{fighter:'Robert Whittaker',opponent:'Court McGee',date:'2013-08-28'}],
    mutatesEraLossEvents:true,
    mutatesScores:false,
    mutatesPenalty:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_ONE=report;
  if(era)era.lossContextCompletionBatchOne=report;
  document.documentElement.setAttribute('data-loss-context-completion-batch-one',`${VERSION}-${applied.length}`);
})();