// Phase-one shadow model for the hybrid UFC Loss Context system.
// Scores Dricus du Plessis and Justin Gaethje without mutating live penalties, totals, ranks, or OVR.
(function(){
  'use strict';

  const VERSION='loss-context-hybrid-shadow-20260711b-phase-one';
  const TARGETS=['Dricus du Plessis','Justin Gaethje'];
  const RULES={
    severityLossCount:2,
    severityMax:3.50,
    frequencyMax:2.50,
    frequencyScale:3.00,
    totalMax:6.00,
    divisionDiscountScale:1.50,
    divisionDiscountMax:0.15,
    divisionDiscountFloor:1.00,
    exposureSource:'official UFC fights from UFC record',
    divisionRule:'Strong-division credit reduces the entire hybrid penalty; weak divisions receive no extra punishment.'
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value||0);return Math.round((n+Number.EPSILON)*100)/100;}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function parseRecord(value){const match=String(value||'').match(/(\d+)\s*[-–]\s*(\d+)/);return match?{wins:Number(match[1]),losses:Number(match[2]),fights:Number(match[1])+Number(match[2])}:null;}

  function build(){
    const DATA=window.RANKING_DATA;
    const ERA=window.UFC_FIGHTER_ERA_LEDGERS;
    const ADAPTER=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;
    if(!DATA||!ERA?.ledgers||!ADAPTER)return false;

    function allRows(){return [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].filter(row=>row?.fighter);}
    function boardRowFor(fighter){const target=key(fighter);return [...(DATA.men||[]),...(DATA.women||[])].find(row=>key(row?.fighter)===target)||allRows().find(row=>key(row?.fighter)===target)||null;}
    function ledgerFor(fighter){const target=key(fighter);return Object.entries(ERA.ledgers||{}).find(([name])=>key(name)===target)?.[1]||null;}
    function recordFor(row){return [row?.ufcRecord,row?.record,row?.ufc_record].map(parseRecord).find(Boolean)||null;}

    function scoreFighter(fighter){
      const row=boardRowFor(fighter);
      const ledger=ledgerFor(fighter);
      const entry=ADAPTER.entryFor?.(fighter)||null;
      const record=recordFor(row);
      const lossEvents=(entry?.events||[])
        .filter(event=>event?.isLoss&&Number(event?.penaltyEstimate)<0)
        .map(event=>({...event,penaltyMagnitude:Math.abs(Number(event.penaltyEstimate))}));

      const sorted=lossEvents.slice().sort((a,b)=>b.penaltyMagnitude-a.penaltyMagnitude||String(a.label).localeCompare(String(b.label)));
      const worstLosses=sorted.slice(0,RULES.severityLossCount);
      const severityRaw=worstLosses.length?worstLosses.reduce((sum,event)=>sum+event.penaltyMagnitude,0)/worstLosses.length:0;
      const severity=round2(Math.min(RULES.severityMax,severityRaw));
      const rawLossBurden=round2(lossEvents.reduce((sum,event)=>sum+event.penaltyMagnitude,0));
      const exposure=Math.max(1,Number(record?.fights||0));
      const frequency=round2(Math.min(RULES.frequencyMax,(rawLossBurden/exposure)*RULES.frequencyScale));
      const preDivision=round2(Math.min(RULES.totalMax,severity+frequency));

      const divisionMultiplier=Number(ledger?.longevity?.divisionMultiplier||1);
      const divisionDiscountPct=round2(clamp((divisionMultiplier-RULES.divisionDiscountFloor)*RULES.divisionDiscountScale,0,RULES.divisionDiscountMax));
      const divisionFactor=round2(1-divisionDiscountPct);
      const finalMagnitude=round2(preDivision*divisionFactor);
      const recommendedPenalty=round2(-finalMagnitude);
      const currentPenalty=round2(row?.penalty||0);
      const projectedDelta=round2(recommendedPenalty-currentPenalty);
      const currentTotal=Number(row?.totalScore);
      const projectedTotal=Number.isFinite(currentTotal)?round2(currentTotal-currentPenalty+recommendedPenalty):null;

      return {
        fighter,
        currentPenalty,
        recommendedPenalty,
        projectedDelta,
        currentTotal:Number.isFinite(currentTotal)?round2(currentTotal):null,
        projectedTotal,
        severity,
        severityMax:RULES.severityMax,
        worstLosses:worstLosses.map(event=>({label:event.label,date:event.date,phase:event.phase,quality:event.quality,finished:event.finished,penalty:event.penaltyEstimate})),
        rawLossBurden,
        exposure,
        frequency,
        frequencyMax:RULES.frequencyMax,
        preDivision,
        divisionMultiplier:round2(divisionMultiplier),
        divisionDiscountPct,
        divisionPointsSaved:round2(preDivision-finalMagnitude),
        finalMagnitude,
        eventCount:lossEvents.length,
        record:record?`${record.wins}-${record.losses}`:null,
        mutatesScores:false,
        mutatesPenalty:false
      };
    }

    const results=TARGETS.map(scoreFighter);
    const byKey=new Map(results.map(result=>[key(result.fighter),result]));
    const report={
      version:VERSION,
      applied:true,
      phase:1,
      mode:'shadow-two-fighter-calibration',
      fighters:TARGETS,
      rules:RULES,
      results,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesScores:false,
      mutatesPenalty:false,
      generatedAt:new Date().toISOString()
    };

    window.UFC_LOSS_CONTEXT_HYBRID_SHADOW=report;
    if(DATA.meta)DATA.meta.lossContextHybridShadow={version:VERSION,phase:1,fighters:TARGETS,mutatesScores:false,generatedAt:report.generatedAt};
    document.documentElement.setAttribute('data-loss-context-hybrid-shadow',`${VERSION}-${results.length}`);
    window.dispatchEvent(new CustomEvent('ufc-loss-context-hybrid-shadow-ready',{detail:report}));
    return true;
  }

  if(build())return;
  window.UFC_LOSS_CONTEXT_HYBRID_SHADOW={version:VERSION,applied:false,status:'waiting-for-canonical-loss-context',phase:1,mutatesScores:false,mutatesPenalty:false};
  window.addEventListener('ufc-loss-context-final-reconciliation-ready',()=>build(),{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',()=>build(),{once:true});
})();