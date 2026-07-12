// Phase-one shadow model for the hybrid UFC Loss Context system.
// Scores the full UFC ranking board without mutating live penalties, totals, ranks, or OVR.
(function(){
  'use strict';

  const VERSION='loss-context-hybrid-shadow-20260711f-prime-volume-floor';
  const RULES={
    severityLossCount:2,
    severityMax:3.50,
    frequencyMax:2.50,
    frequencyScale:3.00,
    primeLossFloorPerLoss:0.75,
    primeFinishFloorExtra:0.25,
    primeVolumeFloorMax:5.25,
    totalMax:6.00,
    divisionDiscountScale:1.50,
    divisionDiscountMax:0.15,
    divisionDiscountFloor:1.00,
    exposureSource:'canonical Loss Context through-prime UFC exposure ledger',
    exposureRule:'Frequency uses every scored UFC fight before or during the canonical prime window. Post-prime fights and no contests are excluded.',
    primeVolumeRule:'Repeated prime losses create a minimum loss-context burden so a long career cannot fully dilute five or six prime losses. Prime finishes add extra floor weight.',
    divisionRule:'Strong-division credit reduces the entire hybrid penalty; weak divisions receive no extra punishment.'
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value||0);return Math.round((n+Number.EPSILON)*100)/100;}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

  function build(){
    const DATA=window.RANKING_DATA;
    const ERA=window.UFC_FIGHTER_ERA_LEDGERS;
    const ADAPTER=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;
    const EXPOSURE=window.UFC_LOSS_CONTEXT_EXPOSURE_LEDGER;
    if(!DATA||!ERA?.ledgers||!ADAPTER||!EXPOSURE?.applied)return false;

    const boardGroups=[
      {name:'men',rows:[...(DATA.men||[])]},
      {name:'women',rows:[...(DATA.women||[])]}
    ];
    const uniqueBoardRows=[];
    const seen=new Set();
    boardGroups.forEach(group=>group.rows.forEach(row=>{
      if(!row?.fighter)return;
      const id=key(row.fighter);
      if(seen.has(id))return;
      seen.add(id);
      uniqueBoardRows.push({...row,hybridBoard:group.name});
    }));

    function ledgerFor(fighter){const target=key(fighter);return Object.entries(ERA.ledgers||{}).find(([name])=>key(name)===target)?.[1]||null;}

    function scoreFighter(row){
      const fighter=row.fighter;
      const ledger=ledgerFor(fighter);
      const entry=ADAPTER.entryFor?.(fighter)||null;
      const exposureEntry=EXPOSURE.entryFor?.(fighter)||null;
      const blockers=[];
      if(!ledger)blockers.push('missing-era-ledger');
      if(!entry)blockers.push('missing-loss-adapter-entry');
      if(!exposureEntry)blockers.push('missing-exposure-ledger-entry');
      if(exposureEntry?.status!=='ready')blockers.push(...(exposureEntry?.issues||['invalid-exposure-ledger-entry']));

      if(blockers.length){
        return {
          fighter,
          board:row.hybridBoard,
          status:'blocked',
          blockers:[...new Set(blockers)],
          currentPenalty:round2(row?.penalty||0),
          currentTotal:Number.isFinite(Number(row?.totalScore))?round2(row.totalScore):null,
          currentRank:Number.isFinite(Number(row?.rank))?Number(row.rank):null,
          exposureAudit:exposureEntry,
          mutatesScores:false,
          mutatesPenalty:false
        };
      }

      const lossEvents=(entry.events||[])
        .filter(event=>event?.isLoss&&Number(event?.penaltyEstimate)<0)
        .map(event=>({...event,penaltyMagnitude:Math.abs(Number(event.penaltyEstimate))}));
      const sorted=lossEvents.slice().sort((a,b)=>b.penaltyMagnitude-a.penaltyMagnitude||String(a.label).localeCompare(String(b.label)));
      const worstLosses=sorted.slice(0,RULES.severityLossCount);
      const severityRaw=worstLosses.length?worstLosses.reduce((sum,event)=>sum+event.penaltyMagnitude,0)/worstLosses.length:0;
      const severity=round2(Math.min(RULES.severityMax,severityRaw));
      const rawLossBurden=round2(lossEvents.reduce((sum,event)=>sum+event.penaltyMagnitude,0));
      const exposure=Math.max(1,Number(exposureEntry.throughPrimeUfcFights||0));
      const frequency=round2(Math.min(RULES.frequencyMax,(rawLossBurden/exposure)*RULES.frequencyScale));
      const hybridBase=round2(severity+frequency);

      const primeLossEvents=lossEvents.filter(event=>String(event?.phase||'').toLowerCase()==='prime');
      const primeLossCount=primeLossEvents.length;
      const primeFinishCount=primeLossEvents.filter(event=>event?.finished===true).length;
      const primeVolumeFloor=round2(Math.min(
        RULES.primeVolumeFloorMax,
        (primeLossCount*RULES.primeLossFloorPerLoss)+(primeFinishCount*RULES.primeFinishFloorExtra)
      ));
      const primeVolumeFloorApplied=primeVolumeFloor>hybridBase+0.01;
      const preDivision=round2(Math.min(RULES.totalMax,Math.max(hybridBase,primeVolumeFloor)));

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
        board:row.hybridBoard,
        status:'scored',
        currentPenalty,
        recommendedPenalty,
        projectedDelta,
        currentTotal:Number.isFinite(currentTotal)?round2(currentTotal):null,
        projectedTotal,
        currentRank:Number.isFinite(Number(row?.rank))?Number(row.rank):null,
        severity,
        severityMax:RULES.severityMax,
        worstLosses:worstLosses.map(event=>({label:event.label,date:event.date,phase:event.phase,quality:event.quality,finished:event.finished,penalty:event.penaltyEstimate})),
        rawLossBurden,
        exposure,
        exposureSource:exposureEntry.source,
        exposureWindowEnd:exposureEntry.endpoint,
        exposureEndpointLabel:exposureEntry.endpointLabel,
        exposureOpenWindow:exposureEntry.openWindow,
        currentScoredUfcFights:exposureEntry.currentScoredUfcFights,
        excludedPostPrimeFightCount:exposureEntry.postPrimeFightCount,
        excludedPostPrimeFights:[],
        exposureAuditStatus:exposureEntry.status,
        exposureAuditIssues:exposureEntry.issues||[],
        frequency,
        frequencyMax:RULES.frequencyMax,
        hybridBase,
        primeLossCount,
        primeFinishCount,
        primeVolumeFloor,
        primeVolumeFloorApplied,
        preDivision,
        divisionMultiplier:round2(divisionMultiplier),
        divisionDiscountPct,
        divisionPointsSaved:round2(preDivision-finalMagnitude),
        finalMagnitude,
        eventCount:lossEvents.length,
        record:exposureEntry.currentUfcRecord,
        mutatesScores:false,
        mutatesPenalty:false
      };
    }

    const results=uniqueBoardRows.map(scoreFighter);
    const scored=results.filter(result=>result.status==='scored');
    const blocked=results.filter(result=>result.status!=='scored');
    const byKey=new Map(results.map(result=>[key(result.fighter),result]));

    boardGroups.forEach(group=>{
      const projected=group.rows
        .filter(row=>row?.fighter)
        .map(row=>{
          const result=byKey.get(key(row.fighter));
          return {fighter:row.fighter,total:result?.status==='scored'&&Number.isFinite(result.projectedTotal)?result.projectedTotal:round2(row.totalScore||0)};
        })
        .sort((a,b)=>Number(b.total)-Number(a.total)||String(a.fighter).localeCompare(String(b.fighter)));
      projected.forEach((item,index)=>{
        const result=byKey.get(key(item.fighter));
        if(!result||result.status!=='scored')return;
        result.projectedRank=index+1;
        result.rankMovement=Number.isFinite(result.currentRank)?result.currentRank-result.projectedRank:null;
      });
    });

    const largestRelief=scored.slice().sort((a,b)=>Number(b.projectedDelta)-Number(a.projectedDelta)||String(a.fighter).localeCompare(String(b.fighter))).slice(0,15);
    const harshestProjected=scored.slice().sort((a,b)=>Number(a.recommendedPenalty)-Number(b.recommendedPenalty)||String(a.fighter).localeCompare(String(b.fighter))).slice(0,15);
    const biggestRankMovers=scored.filter(row=>Number.isFinite(row.rankMovement)&&row.rankMovement!==0).sort((a,b)=>Math.abs(b.rankMovement)-Math.abs(a.rankMovement)||Number(b.projectedDelta)-Number(a.projectedDelta)||String(a.fighter).localeCompare(String(b.fighter))).slice(0,20);
    const postPrimeExposureAudit=scored.filter(row=>Number(row.excludedPostPrimeFightCount)>0).sort((a,b)=>b.excludedPostPrimeFightCount-a.excludedPostPrimeFightCount||String(a.fighter).localeCompare(String(b.fighter)));

    const report={
      version:VERSION,
      applied:true,
      phase:1,
      mode:'shadow-full-roster-canonical-through-prime-exposure-with-prime-volume-floor',
      sourceExposureLedgerVersion:EXPOSURE.version,
      expectedRosterCount:uniqueBoardRows.length,
      scoredCount:scored.length,
      blockedCount:blocked.length,
      coverageComplete:blocked.length===0&&scored.length===uniqueBoardRows.length&&EXPOSURE.coverageComplete===true,
      fighters:uniqueBoardRows.map(row=>row.fighter),
      rules:RULES,
      exposureLedger:{version:EXPOSURE.version,expectedRosterCount:EXPOSURE.expectedRosterCount,coveredCount:EXPOSURE.coveredCount,blockedCount:EXPOSURE.blockedCount,coverageComplete:EXPOSURE.coverageComplete},
      results,
      scored,
      blocked,
      largestRelief,
      harshestProjected,
      biggestRankMovers,
      postPrimeExposureAudit,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesScores:false,
      mutatesPenalty:false,
      generatedAt:new Date().toISOString()
    };

    window.UFC_LOSS_CONTEXT_HYBRID_SHADOW=report;
    if(DATA.meta)DATA.meta.lossContextHybridShadow={version:VERSION,phase:1,sourceExposureLedgerVersion:EXPOSURE.version,expectedRosterCount:report.expectedRosterCount,scoredCount:report.scoredCount,blockedCount:report.blockedCount,coverageComplete:report.coverageComplete,exposureRule:RULES.exposureRule,primeVolumeRule:RULES.primeVolumeRule,mutatesScores:false,generatedAt:report.generatedAt};
    document.documentElement.setAttribute('data-loss-context-hybrid-shadow',`${VERSION}-${report.scoredCount}-${report.blockedCount}`);
    window.dispatchEvent(new CustomEvent('ufc-loss-context-hybrid-shadow-ready',{detail:report}));
    return true;
  }

  if(build())return;
  window.UFC_LOSS_CONTEXT_HYBRID_SHADOW={version:VERSION,applied:false,status:'waiting-for-canonical-exposure-ledger',phase:1,mutatesScores:false,mutatesPenalty:false};
  window.addEventListener('ufc-loss-context-exposure-ledger-ready',()=>build(),{once:true});
  window.addEventListener('ufc-loss-context-final-reconciliation-ready',()=>build(),{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',()=>build(),{once:true});
})();