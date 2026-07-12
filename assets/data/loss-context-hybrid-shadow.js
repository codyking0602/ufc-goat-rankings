// Phase-one shadow model for the hybrid UFC Loss Context system.
// Scores the full UFC ranking board without mutating live penalties, totals, ranks, or OVR.
(function(){
  'use strict';

  const VERSION='loss-context-hybrid-shadow-20260711d-through-prime-exposure';
  const RULES={
    severityLossCount:2,
    severityMax:3.50,
    frequencyMax:2.50,
    frequencyScale:3.00,
    totalMax:6.00,
    divisionDiscountScale:1.50,
    divisionDiscountMax:0.15,
    divisionDiscountFloor:1.00,
    exposureSource:'dated UFC profile fight rows through the canonical prime endpoint',
    exposureRule:'Frequency uses every UFC fight before or during the prime window. Post-prime fights are excluded from both the numerator and denominator.',
    divisionRule:'Strong-division credit reduces the entire hybrid penalty; weak divisions receive no extra punishment.'
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value||0);return Math.round((n+Number.EPSILON)*100)/100;}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function iso(value){const text=String(value||'').trim();return /^\d{4}-\d{2}-\d{2}$/.test(text)?text:null;}
  function parseRecord(value){const match=String(value||'').match(/(\d+)\s*[-–]\s*(\d+)/);return match?{wins:Number(match[1]),losses:Number(match[2]),fights:Number(match[1])+Number(match[2])}:null;}
  function fightText(fight){return [fight?.opponent,fight?.method,fight?.basis,fight?.notes].filter(Boolean).join(' ').toLowerCase();}
  function isExcludedNoContest(fight){return /no contest|\bnc\b|overturned/.test(fightText(fight));}

  function build(){
    const DATA=window.RANKING_DATA;
    const ERA=window.UFC_FIGHTER_ERA_LEDGERS;
    const ADAPTER=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;
    if(!DATA||!ERA?.ledgers||!ADAPTER)return false;

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
    function profileFor(fighter){const target=key(fighter);return (DATA.fighters||[]).find(row=>key(row?.fighter)===target)||null;}
    function recordFor(row,profile){return [row?.ufcRecord,row?.record,row?.ufc_record,profile?.ufcRecord,profile?.record,profile?.ufc_record].map(parseRecord).find(Boolean)||null;}

    function exposureFor(fighter,ledger,profile,record){
      const endpoint=iso(ledger?.window?.end);
      const sourceRows=Array.isArray(profile?.rounds)?profile.rounds:[];
      const dated=sourceRows
        .map(fight=>({fight,date:iso(fight?.date)}))
        .filter(item=>item.date&&!isExcludedNoContest(item.fight));
      const uniqueByDate=new Map();
      dated.forEach(item=>{
        const id=`${item.date}|${key(item.fight?.opponent)}`;
        if(!uniqueByDate.has(id))uniqueByDate.set(id,item);
      });
      const allScoredFights=[...uniqueByDate.values()];
      const throughPrime=allScoredFights.filter(item=>!endpoint||item.date<=endpoint);
      const postPrime=allScoredFights.filter(item=>endpoint&&item.date>endpoint);
      const blockers=[];
      if(!profile)blockers.push('missing-profile-row');
      if(!sourceRows.length)blockers.push('missing-profile-fight-rows');
      if(!throughPrime.length&&Number(record?.fights||0)>0)blockers.push('no-dated-fights-through-prime');
      return {
        exposure:throughPrime.length,
        endpoint:endpoint||null,
        openWindow:!endpoint,
        profileFightRowCount:sourceRows.length,
        datedScoredFightCount:allScoredFights.length,
        excludedPostPrimeFightCount:postPrime.length,
        excludedPostPrimeFights:postPrime.map(item=>({opponent:item.fight?.opponent||null,date:item.date,method:item.fight?.method||null})),
        blockers
      };
    }

    function scoreFighter(row){
      const fighter=row.fighter;
      const ledger=ledgerFor(fighter);
      const profile=profileFor(fighter);
      const entry=ADAPTER.entryFor?.(fighter)||null;
      const record=recordFor(row,profile);
      const exposureAudit=exposureFor(fighter,ledger,profile,record);
      const blockers=[];
      if(!ledger)blockers.push('missing-era-ledger');
      if(!entry)blockers.push('missing-loss-adapter-entry');
      if(!record)blockers.push('missing-ufc-record');
      blockers.push(...exposureAudit.blockers);

      if(blockers.length){
        return {
          fighter,
          board:row.hybridBoard,
          status:'blocked',
          blockers:[...new Set(blockers)],
          currentPenalty:round2(row?.penalty||0),
          currentTotal:Number.isFinite(Number(row?.totalScore))?round2(row.totalScore):null,
          currentRank:Number.isFinite(Number(row?.rank))?Number(row.rank):null,
          exposureAudit,
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
      const exposure=Math.max(1,Number(exposureAudit.exposure||0));
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
        exposureWindowEnd:exposureAudit.endpoint,
        exposureOpenWindow:exposureAudit.openWindow,
        excludedPostPrimeFightCount:exposureAudit.excludedPostPrimeFightCount,
        excludedPostPrimeFights:exposureAudit.excludedPostPrimeFights,
        profileFightRowCount:exposureAudit.profileFightRowCount,
        datedScoredFightCount:exposureAudit.datedScoredFightCount,
        frequency,
        frequencyMax:RULES.frequencyMax,
        preDivision,
        divisionMultiplier:round2(divisionMultiplier),
        divisionDiscountPct,
        divisionPointsSaved:round2(preDivision-finalMagnitude),
        finalMagnitude,
        eventCount:lossEvents.length,
        record:`${record.wins}-${record.losses}`,
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
    const postPrimeExposureAudit=scored.filter(row=>row.excludedPostPrimeFightCount>0).sort((a,b)=>b.excludedPostPrimeFightCount-a.excludedPostPrimeFightCount||String(a.fighter).localeCompare(String(b.fighter)));

    const report={
      version:VERSION,
      applied:true,
      phase:1,
      mode:'shadow-full-roster-through-prime-exposure',
      expectedRosterCount:uniqueBoardRows.length,
      scoredCount:scored.length,
      blockedCount:blocked.length,
      coverageComplete:blocked.length===0&&scored.length===uniqueBoardRows.length,
      fighters:uniqueBoardRows.map(row=>row.fighter),
      rules:RULES,
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
    if(DATA.meta)DATA.meta.lossContextHybridShadow={version:VERSION,phase:1,expectedRosterCount:report.expectedRosterCount,scoredCount:report.scoredCount,blockedCount:report.blockedCount,coverageComplete:report.coverageComplete,exposureRule:RULES.exposureRule,mutatesScores:false,generatedAt:report.generatedAt};
    document.documentElement.setAttribute('data-loss-context-hybrid-shadow',`${VERSION}-${report.scoredCount}-${report.blockedCount}`);
    window.dispatchEvent(new CustomEvent('ufc-loss-context-hybrid-shadow-ready',{detail:report}));
    return true;
  }

  if(build())return;
  window.UFC_LOSS_CONTEXT_HYBRID_SHADOW={version:VERSION,applied:false,status:'waiting-for-canonical-loss-context',phase:1,mutatesScores:false,mutatesPenalty:false};
  window.addEventListener('ufc-loss-context-final-reconciliation-ready',()=>build(),{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',()=>build(),{once:true});
})();