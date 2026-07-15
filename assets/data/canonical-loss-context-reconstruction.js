// Canonical Loss Context reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: canonical UFC losses + shared Fighter Era Ledger -> approved hybrid penalty.
(function(){
  'use strict';

  const VERSION='canonical-loss-context-reconstruction-20260714c-approved-ten';
  const JUDGMENT_LOCK_VERSION='loss-context-hybrid-judgment-lock-20260711a';
  const RULES=Object.freeze({
    prePrimeElite:-0.75,
    prePrimeNonElite:-1.25,
    primeElite:-1.50,
    primeNonElite:-4.00,
    finishedCountedLossExtra:-0.75,
    postPrime:0,
    primeUpwardElite:-0.75,
    primeUpwardEliteFinishedExtra:-0.50,
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
    divisionDiscountFloor:1.00
  });
  const ELITE_TIERS=new Set(['champion-level','top-five']);
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  const MEANINGFUL_DELTA=.25;

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const round6=value=>Math.round((Number(value||0)+Number.EPSILON)*1_000_000)/1_000_000;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''));

  function ledgerFor(fighter){
    const ledgers=window.UFC_FIGHTER_ERA_LEDGERS?.ledgers||{};
    const target=key(fighter);
    return Object.entries(ledgers).find(([name])=>key(name)===target)?.[1]||null;
  }

  function controlFor(fighter){
    return window.UFC_CANONICAL_SCORING_RECORDS?.entryFor?.(fighter)||null;
  }

  function resolutionFor(fighter){
    return window.UFC_CANONICAL_LOSS_CONTEXT_APPROVED_RESOLUTIONS?.entryFor?.(fighter)||null;
  }

  function phaseFor(ledger,fight){
    const date=String(fight?.date||'');
    const start=String(ledger?.window?.start||'');
    const end=String(ledger?.window?.end||'');
    if(!validDate(date)||!validDate(start))return 'unknown';
    if(date<start)return 'pre-prime';
    if(validDate(end)&&date>end)return 'post-prime';
    return 'prime';
  }

  function qualityClass(fight){
    const tier=fight?.opponentContext?.qualityTier||'none';
    return ELITE_TIERS.has(tier)?'elite':'non-elite';
  }

  function rawPenaltyFor(event){
    if(!event.penaltyEligible||event.phase==='post-prime')return {base:0,finishExtra:0,total:0};
    if(event.phase==='unknown')return {base:null,finishExtra:null,total:null};
    let base=0;
    if(event.phase==='pre-prime')base=event.qualityClass==='elite'?RULES.prePrimeElite:RULES.prePrimeNonElite;
    else if(event.phase==='prime'&&event.upwardDivision&&event.qualityClass==='elite')base=RULES.primeUpwardElite;
    else if(event.phase==='prime')base=event.qualityClass==='elite'?RULES.primeElite:RULES.primeNonElite;
    let finishExtra=0;
    if(event.finished){
      finishExtra=event.phase==='prime'&&event.upwardDivision&&event.qualityClass==='elite'
        ?RULES.primeUpwardEliteFinishedExtra
        :RULES.finishedCountedLossExtra;
    }
    return {base:round2(base),finishExtra:round2(finishExtra),total:round2(base+finishExtra)};
  }

  function lossEvent(record,ledger,fight){
    const classification=fight?.lossClassification||null;
    const phase=phaseFor(ledger,fight);
    const competitive=classification?.competitive!==false;
    const methodCategory=fight?.method?.category||'other';
    // The approved production model explicitly exempted official DQ losses such as
    // Jones-Hamill and Yan-Sterling from normal competitive loss scoring.
    const technicalException=fight?.scoringDisposition==='technical-exception'||methodCategory==='dq';
    const officialLoss=fight?.officialResult==='loss';
    const penaltyEligible=officialLoss&&competitive&&!technicalException;
    const event={
      fighter:record.fighter,
      fightId:fight.id,
      date:fight.date,
      opponent:fight.opponent,
      event:fight.event,
      division:fight.division,
      officialResult:fight.officialResult,
      scoringDisposition:fight.scoringDisposition,
      phase,
      qualityTier:fight?.opponentContext?.qualityTier||'none',
      qualityClass:qualityClass(fight),
      championStatus:fight?.opponentContext?.championStatus||'unknown',
      opponentReviewStatus:fight?.opponentContext?.reviewStatus||null,
      finished:FINISH_METHODS.has(methodCategory),
      methodCategory,
      methodDetail:fight?.method?.detail||null,
      divisionContext:classification?.divisionContext||'home',
      upwardDivision:classification?.divisionContext==='upward',
      competitive,
      technicalException,
      penaltyEligible,
      lossReviewStatus:classification?.reviewStatus||null,
      overrideRule:classification?.overrideRule||null,
      classificationNote:classification?.note||null,
      exemptionReason:!officialLoss?'not-an-official-loss':!competitive?'noncompetitive-technical-context':technicalException?'approved-dq-technical-exception':null,
      provenance:'canonical UFC fight fact + shared Fighter Era Ledger'
    };
    const penalty=rawPenaltyFor(event);
    return {...event,basePenalty:penalty.base,finishExtra:penalty.finishExtra,rawPenalty:penalty.total};
  }

  function exposureFor(record,ledger){
    const end=String(ledger?.window?.end||'');
    const open=!validDate(end);
    const appearances=(record?.fights||[]).filter(fight=>
      fight?.officialResult!=='no-contest'&&
      validDate(fight?.date)&&
      (open||fight.date<=end)
    );
    return {
      count:appearances.length,
      open,
      endpoint:open?null:end,
      fightIds:appearances.map(fight=>fight.id),
      rule:'Every official UFC win, loss, or draw before or during the shared elite-prime endpoint; no contests excluded.'
    };
  }

  function calculateLossContext(record){
    const ledger=ledgerFor(record?.fighter);
    const blockers=[];
    if(!record)blockers.push('missing-canonical-fighter-record');
    if(!ledger)blockers.push('missing-shared-era-ledger');
    if(ledger&&!validDate(ledger?.window?.start))blockers.push('missing-shared-era-start-date');
    if(blockers.length)return {score:null,blockers,events:[],exposure:null};

    const officialLossFights=(record.fights||[]).filter(fight=>fight?.officialResult==='loss'||fight?.scoringDisposition==='technical-exception');
    const events=officialLossFights.map(fight=>lossEvent(record,ledger,fight));
    events.forEach(event=>{
      if(!event.lossReviewStatus)blockers.push(`${event.fightId}: missing loss classification`);
      if(event.phase==='unknown')blockers.push(`${event.fightId}: unknown phase`);
    });
    const counted=events.filter(event=>Number(event.rawPenalty)<0);
    const sorted=counted.slice().sort((a,b)=>Math.abs(Number(b.rawPenalty))-Math.abs(Number(a.rawPenalty))||String(a.date).localeCompare(String(b.date)));
    const worstLosses=sorted.slice(0,RULES.severityLossCount);
    const severityRaw=worstLosses.length?worstLosses.reduce((sum,event)=>sum+Math.abs(Number(event.rawPenalty)),0)/worstLosses.length:0;
    const severity=round2(Math.min(RULES.severityMax,severityRaw));
    const rawLossBurden=round2(counted.reduce((sum,event)=>sum+Math.abs(Number(event.rawPenalty)),0));
    const exposure=exposureFor(record,ledger);
    if(!Number.isFinite(exposure.count)||exposure.count<1)blockers.push('invalid-through-prime-exposure');
    const frequency=round2(Math.min(RULES.frequencyMax,(rawLossBurden/Math.max(1,exposure.count))*RULES.frequencyScale));
    const hybridBase=round2(severity+frequency);
    const primeLosses=counted.filter(event=>event.phase==='prime');
    const primeFinishes=primeLosses.filter(event=>event.finished);
    const primeVolumeFloor=round2(Math.min(RULES.primeVolumeFloorMax,(primeLosses.length*RULES.primeLossFloorPerLoss)+(primeFinishes.length*RULES.primeFinishFloorExtra)));
    const primeVolumeFloorApplied=primeVolumeFloor>hybridBase+.01;
    const preDivision=round2(Math.min(RULES.totalMax,Math.max(hybridBase,primeVolumeFloor)));
    const divisionMultiplier=Number(ledger?.longevity?.divisionMultiplier||1);
    const divisionDiscountPct=round2(clamp((divisionMultiplier-RULES.divisionDiscountFloor)*RULES.divisionDiscountScale,0,RULES.divisionDiscountMax));
    const divisionFactor=round2(1-divisionDiscountPct);
    const finalMagnitude=round2(preDivision*divisionFactor);
    const score=round2(-finalMagnitude);
    const reviewEvents=events.filter(event=>event.lossReviewStatus!=='locked'||event.opponentReviewStatus!=='locked');
    const explicitExceptions=events.filter(event=>event.overrideRule||event.technicalException||event.competitive===false);

    return {
      score,
      blockers:[...new Set(blockers)],
      events,
      countedEvents:counted,
      worstLosses,
      exposure,
      severity,
      severityRaw:round6(severityRaw),
      rawLossBurden,
      frequency,
      hybridBase,
      primeLossCount:primeLosses.length,
      primeFinishCount:primeFinishes.length,
      primeVolumeFloor,
      primeVolumeFloorApplied,
      preDivision,
      divisionMultiplier:round2(divisionMultiplier),
      divisionDiscountPct,
      divisionPointsSaved:round2(preDivision-finalMagnitude),
      finalMagnitude,
      reviewEvents,
      explicitExceptions,
      phaseSource:'fighter-era-ledgers',
      categoryLocalPrimeWindowUsed:false,
      manualNumericAdjustment:0
    };
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    const approvals=window.UFC_CANONICAL_LOSS_CONTEXT_APPROVED_RESOLUTIONS;
    const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    if(!facts?.list||!controls?.entryFor||!approvals?.applied){
      return {version:VERSION,applied:false,error:'Canonical fighter facts, frozen scoring controls, or approved Loss Context resolutions are missing.',mutatesRankingData:false};
    }

    const fighters=facts.list().map(record=>{
      const calculation=calculateLossContext(record);
      const control=controlFor(record.fighter);
      const resolution=resolutionFor(record.fighter);
      const currentPenalty=Number.isFinite(Number(control?.penalty))?round2(control.penalty):null;
      const reconstructedPenalty=Number.isFinite(Number(calculation.score))?round2(calculation.score):null;
      const difference=currentPenalty===null||reconstructedPenalty===null?null:round2(reconstructedPenalty-currentPenalty);
      const approvedPenalty=Number.isFinite(Number(resolution?.approvedPenalty))?round2(resolution.approvedPenalty):null;
      const approvedDifference=approvedPenalty===null||reconstructedPenalty===null?null:round2(reconstructedPenalty-approvedPenalty);
      const approvalTolerance=Number.isFinite(Number(resolution?.tolerance))?Number(resolution.tolerance):.01;
      const resolvedByApproval=Boolean(resolution)&&approvedDifference!==null&&Math.abs(approvedDifference)<=approvalTolerance+.000001;
      const issues=[];
      calculation.blockers.forEach(reason=>issues.push({classification:'factual-blocker',reason}));
      if(currentPenalty===null&&!resolution)issues.push({classification:'missing-frozen-control',reason:'No frozen canonical Loss Context control exists.'});
      if(calculation.reviewEvents?.length)issues.push({classification:'reviewed-judgment-input',reason:`${calculation.reviewEvents.length} loss row(s) retain review/high-risk-review status.`});
      if(difference!==null&&Math.abs(difference)>=MEANINGFUL_DELTA&&!resolution)issues.push({classification:'meaningful-model-delta',reason:'Canonical fight-level reconstruction differs from the frozen approved hybrid penalty.'});
      if(resolution&&!resolvedByApproval)issues.push({classification:'approved-resolution-mismatch',reason:`Reconstructed ${reconstructedPenalty} differs from approved ${approvedPenalty} beyond tolerance ${approvalTolerance}.`});
      if(resolvedByApproval)issues.push({classification:resolution.classification,reason:resolution.decision});
      const status=calculation.blockers.length?'blocked'
        :resolution?(resolvedByApproval?'approved-resolved':'approved-resolution-mismatch')
        :currentPenalty===null?'missing-control'
        :Math.abs(difference)<=.01?'exact-parity'
        :Math.abs(difference)>=MEANINGFUL_DELTA?'meaningful-delta'
        :'rounding-delta';
      return {
        fighter:record.fighter,
        board:record.board,
        status,
        currentPenalty,
        reconstructedPenalty,
        difference,
        approvedPenalty,
        approvedDifference,
        approvalTolerance,
        resolvedByApproval,
        effectiveApprovedPenalty:approvedPenalty??currentPenalty,
        exactParity:difference!==null&&Math.abs(difference)<=.01,
        meaningfulDelta:difference!==null&&Math.abs(difference)>=MEANINGFUL_DELTA,
        resolution,
        issues,
        stats:calculation,
        mutatesScores:false
      };
    }).sort((a,b)=>Number(a.reconstructedPenalty)-Number(b.reconstructedPenalty)||String(a.fighter).localeCompare(String(b.fighter)));

    const byKey=new Map(fighters.map(row=>[key(row.fighter),row]));
    const controlled=fighters.filter(row=>row.currentPenalty!==null);
    const effectiveControlled=fighters.filter(row=>row.effectiveApprovedPenalty!==null);
    const scored=fighters.filter(row=>Number.isFinite(row.reconstructedPenalty));
    const meaningful=fighters.filter(row=>row.meaningfulDelta).sort((a,b)=>Math.abs(Number(b.difference))-Math.abs(Number(a.difference))||String(a.fighter).localeCompare(String(b.fighter)));
    const approvedRows=fighters.filter(row=>row.resolution);
    const approvalMismatches=approvedRows.filter(row=>!row.resolvedByApproval);
    const pending=fighters.filter(row=>row.status==='blocked'||row.status==='missing-control'||row.status==='meaningful-delta'||row.status==='approved-resolution-mismatch');
    return {
      version:VERSION,
      applied:true,
      mode:'shadow-only-approved-hybrid-loss-context-reconstruction',
      judgmentLockVersion:JUDGMENT_LOCK_VERSION,
      approvalVersion:approvals.version,
      formula:'Raw per-loss rules -> average of two worst losses + loss burden per UFC fight through prime -> repeated-prime-loss floor -> 6-point cap -> strong-division relief up to 15%.',
      rules:RULES,
      fighterCount:fighters.length,
      scoredFighterCount:scored.length,
      controlCoverage:controlled.length,
      effectiveControlCoverage:effectiveControlled.length,
      eraLedgerCoverage:fighters.filter(row=>!row.stats.blockers?.includes('missing-shared-era-ledger')).length,
      phaseSource:'fighter-era-ledgers',
      exposureSource:'canonical UFC fight facts through the shared Era Ledger endpoint; no contests excluded',
      exactFrozenControlParityCount:controlled.filter(row=>row.exactParity).length,
      meaningfulDeltaThreshold:MEANINGFUL_DELTA,
      meaningfulDeltaCount:meaningful.length,
      blockedCount:fighters.filter(row=>row.status==='blocked').length,
      missingControlCount:fighters.filter(row=>row.status==='missing-control').length,
      approvedResolutionCount:approvedRows.length,
      approvedResolutionMismatchCount:approvalMismatches.length,
      unresolvedDecisionCount:pending.length,
      reviewJudgmentFighterCount:fighters.filter(row=>row.stats.reviewEvents?.length).length,
      technicalExceptionCount:fighters.reduce((sum,row)=>sum+row.stats.events.filter(event=>event.technicalException).length,0),
      nonCompetitiveExemptionCount:fighters.reduce((sum,row)=>sum+row.stats.events.filter(event=>event.competitive===false).length,0),
      prePrimeCountedLossCount:fighters.reduce((sum,row)=>sum+row.stats.countedEvents.filter(event=>event.phase==='pre-prime').length,0),
      primeCountedLossCount:fighters.reduce((sum,row)=>sum+row.stats.countedEvents.filter(event=>event.phase==='prime').length,0),
      postPrimeOfficialLossCount:fighters.reduce((sum,row)=>sum+row.stats.events.filter(event=>event.phase==='post-prime').length,0),
      upwardEliteCountedLossCount:fighters.reduce((sum,row)=>sum+row.stats.countedEvents.filter(event=>event.upwardDivision&&event.qualityClass==='elite').length,0),
      primeVolumeFloorAppliedCount:fighters.filter(row=>row.stats.primeVolumeFloorApplied).length,
      totalCapAppliedCount:fighters.filter(row=>Number(row.stats.preDivision)>=RULES.totalMax-.01).length,
      fighters,
      meaningfulDeltas:meaningful,
      approvedResolutions:approvedRows,
      approvedResolutionMismatches:approvalMismatches,
      pendingReviewRows:pending,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      calculateLossContext,
      categoryLocalPrimeWindowControlsScore:false,
      mutatesRankingData:false,
      mutatesPenalty:false,
      mutatesScores:false,
      liveDataUnchanged:before===null||before===JSON.stringify(window.RANKING_DATA),
      generatedAt:new Date().toISOString()
    };
  }

  const report=build();
  window.UFC_CANONICAL_LOSS_CONTEXT_RECONSTRUCTION=report;
  if(typeof document!=='undefined'&&document?.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-canonical-loss-context-reconstruction',`${VERSION}-${report.scoredFighterCount||0}-${report.unresolvedDecisionCount||0}`);
  }
})();
