// Loss Context Live Promoter.
// Publishes the current live penalty values after canonical ledger score review.
(function(){
  'use strict';
  const VERSION='loss-context-live-promoter-20260710b-canonical-score-review';
  const DATA=window.RANKING_DATA;
  const adapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;
  const corrections=window.UFC_PENALTY_SCORE_CORRECTIONS;
  const scoreReview=window.UFC_LOSS_CONTEXT_SCORE_REVIEW;
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
      const eventEntry=typeof adapter?.eventEntryFor==='function'?adapter.eventEntryFor(row.fighter):(originalEntryFor?originalEntryFor(row.fighter):null);
      const correction=corrections?.corrections?.[row.fighter]||null;
      const reviewEntry=typeof scoreReview?.entryFor==='function'?scoreReview.entryFor(row.fighter):null;
      const promotedByReview=reviewEntry&&Number.isFinite(Number(reviewEntry.promotedPenalty));
      const reviewAudit=row.penaltyAudit?.source==='Canonical Loss Context ledger score review'?row.penaltyAudit:null;
      const notes=reviewAudit?.notes||correction?.notes||row.penaltyAudit?.notes||row.penaltyNotes||'Current reviewed UFC Loss Context value retained for launch.';
      const source=reviewAudit?.source||(correction?'Cody-approved penalty worksheet':(row.penaltyAudit?.source||'Canonical fighter ranking row'));
      const launchMode=promotedByReview?'canonical-ledger-promoted':'locked-current-value';
      const audit={
        version:VERSION,
        score,
        rules:RULES,
        notes,
        source,
        launchMode,
        mutatesPenalty:false,
        eventLedgerRole:promotedByReview?'canonical scoring source':'supporting QA only',
        scoreReviewVersion:scoreReview?.version||null,
        priorScore:promotedByReview?round2(reviewEntry.priorPenalty):score,
        scoreReviewDelta:promotedByReview?round2(reviewEntry.delta):0,
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
        status:promotedByReview?'canonical-ledger-live':'locked-live',
        window:eventEntry?.window||null,
        events:Array.isArray(eventEntry?.events)?eventEntry.events:[],
        counts:eventEntry?.counts||null,
        eventEstimatedPenaltyTotal:round2(eventEntry?.estimatedPenaltyTotal),
        estimatedPenaltyTotal:score,
        lockedPenaltyTotal:score,
        priorPenalty:promotedByReview?round2(reviewEntry.priorPenalty):score,
        delta:promotedByReview?round2(reviewEntry.delta):0,
        source,
        notes,
        mutatesScores:false
      });
    });

    const launchByName=new Map(launchRows.map(row=>[key(row.fighter),row]));
    if(adapter){
      adapter.eventRows=eventRows;
      adapter.eventEntryFor=typeof adapter.eventEntryFor==='function'?adapter.eventEntryFor:originalEntryFor;
      adapter.launchRows=launchRows;
      adapter.launchEntryFor=fighter=>launchByName.get(key(fighter))||null;
      adapter.entryFor=fighter=>launchByName.get(key(fighter))||(originalEntryFor?originalEntryFor(fighter):null);
      adapter.report=()=>launchRows.map(row=>({...row,events:[...(row.events||[])]}));
      adapter.mode='canonical-ledger-score-review-overlay';
      adapter.livePromoterVersion=VERSION;
    }

    const status={
      version:VERSION,
      applied:missingPenalty.length===0,
      reason:missingPenalty.length?'Some fighters are missing a finite current penalty.':'Reviewed Loss Context values promoted for launch.',
      promotedCount:launchRows.length,
      canonicalLedgerPromotedCount:launchRows.filter(row=>row.status==='canonical-ledger-live').length,
      retainedCurrentCount:launchRows.filter(row=>row.status==='locked-live').length,
      missingPenalty,
      dataLoaded:true,
      adapterLoaded:!!adapter,
      adapterVersion:adapter?.version||null,
      scoreReviewVersion:scoreReview?.version||null,
      eraLedgerVersion:adapter?.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
      rules:RULES,
      launchMode:'canonical-ledger-score-review-overlay',
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
