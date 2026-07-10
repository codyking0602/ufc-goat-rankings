// Loss Context Live Promoter.
// Launch-safe promotion layer: preserves the current reviewed penalty values,
// attaches complete audit metadata, and keeps the event ledger available as QA context.
(function(){
  'use strict';
  const VERSION='loss-context-live-promoter-20260710a-locked-current-values';
  const DATA=window.RANKING_DATA;
  const adapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;
  const corrections=window.UFC_PENALTY_SCORE_CORRECTIONS;
  const RULES=corrections?.rules||'Locked loss penalty rules: pre-prime elite -0.75; pre-prime non-elite -1.25; prime elite -1.50; prime non-elite -4.00; counted finish extra -0.75; post-prime 0; upward-division elite -0.75; upward-division finish extra -0.50; cap -10.00.';

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*100)/100:null;}
  function boardRows(){return [...(DATA?.men||[]),...(DATA?.women||[])].filter(row=>row?.fighter);}
  function profileFor(name){const fighterKey=key(name);return (DATA?.fighters||[]).find(row=>key(row?.fighter)===fighterKey)||null;}

  function apply(){
    if(!DATA){
      const status={version:VERSION,applied:false,reason:'Missing RANKING_DATA.',mutatesScores:false,apply};
      window.UFC_LOSS_CONTEXT_LIVE_PROMOTER=status;
      return status;
    }

    const originalEntryFor=typeof adapter?.entryFor==='function'?adapter.entryFor.bind(adapter):null;
    const originalReport=typeof adapter?.report==='function'?adapter.report.bind(adapter):null;
    const eventRows=originalReport?originalReport():(adapter?.rows||[]).map(row=>({...row}));
    const launchRows=[];
    const missingPenalty=[];

    boardRows().forEach(row=>{
      const score=round2(row.penalty);
      if(score===null){missingPenalty.push(row.fighter);return;}
      const eventEntry=originalEntryFor?originalEntryFor(row.fighter):null;
      const correction=corrections?.corrections?.[row.fighter]||null;
      const notes=correction?.notes||row.penaltyAudit?.notes||row.penaltyNotes||'Current reviewed UFC Loss Context value retained for launch.';
      const source=correction?'Cody-approved penalty worksheet':(row.penaltyAudit?.source||'Canonical fighter ranking row');
      const audit={
        version:VERSION,
        score,
        rules:RULES,
        notes,
        source,
        launchMode:'locked-current-value',
        mutatesPenalty:false,
        eventLedgerRole:'supporting QA only',
        eventLedgerVersion:adapter?.version||null,
        eventEstimatedPenaltyTotal:round2(eventEntry?.estimatedPenaltyTotal),
        eventLedgerEventCount:Array.isArray(eventEntry?.events)?eventEntry.events.length:0,
        appliedAt:new Date().toISOString()
      };
      row.lossContextLive=true;
      row.lossContextAudit=audit;
      row.lossPenalty=score;

      const profile=profileFor(row.fighter);
      if(profile){
        profile.lossContextLive=true;
        profile.lossContextAudit={...audit};
        profile.lossPenalty=score;
      }

      launchRows.push({
        fighter:row.fighter,
        status:'locked-live',
        window:eventEntry?.window||null,
        events:Array.isArray(eventEntry?.events)?eventEntry.events:[],
        counts:eventEntry?.counts||null,
        eventEstimatedPenaltyTotal:round2(eventEntry?.estimatedPenaltyTotal),
        estimatedPenaltyTotal:score,
        lockedPenaltyTotal:score,
        source,
        notes,
        mutatesScores:false
      });
    });

    const launchByName=new Map(launchRows.map(row=>[key(row.fighter),row]));
    if(adapter){
      adapter.eventRows=eventRows;
      adapter.eventEntryFor=originalEntryFor;
      adapter.launchRows=launchRows;
      adapter.launchEntryFor=fighter=>launchByName.get(key(fighter))||null;
      adapter.entryFor=fighter=>launchByName.get(key(fighter))||(originalEntryFor?originalEntryFor(fighter):null);
      adapter.report=()=>launchRows.map(row=>({...row,events:[...(row.events||[])]}));
      adapter.mode='launch-locked-penalty-overlay';
      adapter.livePromoterVersion=VERSION;
    }

    const status={
      version:VERSION,
      applied:missingPenalty.length===0,
      reason:missingPenalty.length?'Some fighters are missing a finite current penalty.':'Current reviewed Loss Context values promoted without changing any penalty.',
      promotedCount:launchRows.length,
      missingPenalty,
      dataLoaded:true,
      adapterLoaded:!!adapter,
      adapterVersion:adapter?.version||null,
      eraLedgerVersion:adapter?.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
      rules:RULES,
      launchMode:'locked-current-value',
      mutatesScores:false,
      mutatesPenalty:false,
      apply,
      appliedAt:new Date().toISOString()
    };
    window.UFC_LOSS_CONTEXT_LIVE_PROMOTER=status;
    document.documentElement.setAttribute('data-loss-context-live-promoter',VERSION);
    return status;
  }

  apply();
})();