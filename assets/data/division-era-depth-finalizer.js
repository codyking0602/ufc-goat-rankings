// Final post-pipeline verification and synchronization for the approved Division-Era Depth adjustment.
(function(){
  'use strict';

  const VERSION='division-era-depth-finalizer-20260712b-canonical-engine';
  const EXPECTED_SHADOW='division-era-depth-shadow-20260712d-current-wfw-safe';
  const EXPECTED_AUDIT='division-era-depth-judgment-review-20260712b-live-approved';
  let finalized=false;

  const key=name=>String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;

  function attachDepth(row,result){
    const adjustment=round2(result.curvedAdjustment);
    row.eraDepthAdjustment=adjustment;
    row.divisionEraDepth={
      version:VERSION,
      sourceShadowVersion:EXPECTED_SHADOW,
      depthIndex:result.depthIndex,
      adjustment,
      componentRatios:result.componentRatios||{},
      matchedPrimeFightCount:result.matchedPrimeFightCount,
      sampledDivisions:result.sampledDivisions||[],
      primeStart:result.primeStart||null,
      primeEnd:result.primeEnd||null,
      openPrime:Boolean(result.openPrime),
      womenFeatherweightTreatment:result.womenFeatherweightTreatment||null
    };
    const formula=String(row.scoreFormula||'championship + opponentQuality + primeDominance + longevity + apexPeak + lossContext');
    row.scoreFormula=formula.includes('eraDepthAdjustment')?formula:`${formula} + eraDepthAdjustment`;
  }

  function syncProfiles(data,boards){
    const byKey=new Map(boards.map(row=>[key(row.fighter),row]));
    (data.fighters||[]).forEach(profile=>{
      const board=byKey.get(key(profile?.fighter));
      if(!board)return;
      [
        'eraDepthAdjustment','divisionEraDepth','preEraDepthTotalScore','weightedScoreBreakdown',
        'rawScore','totalScore','rank','scoreFormula','overallOvr','finalScoreEngineVersion','overallScoreOwner'
      ].forEach(field=>{
        if(board[field]!==undefined)profile[field]=board[field];
      });
    });
  }

  function syncOverrides(data){
    window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
    for(const [boardName,rows] of [['men',data.men||[]],['women',data.women||[]]]){
      rows.forEach(row=>{
        const override=window.DISPLAY_OVERRIDES[row.fighter]=window.DISPLAY_OVERRIDES[row.fighter]||{};
        override.overallOvr=row.overallOvr;
        override.allTimeRank=row.rank;
        override.rankLabel=`${boardName==='women'?'Women':'Men'} #${row.rank}`;
        override.eraDepthAdjustment=row.eraDepthAdjustment;
        override.divisionEraDepth=row.divisionEraDepth;
      });
    }
  }

  function apply(){
    if(finalized)return true;
    const data=window.RANKING_DATA;
    const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    const audit=window.UFC_DIVISION_ERA_DEPTH_AUDIT;
    const engine=window.UFC_FINAL_SCORE_ENGINE;
    if(window.UFC_SCORING_PIPELINE?.status!=='ready'||!data||!engine?.apply)return false;
    if(shadow?.version!==EXPECTED_SHADOW||audit?.version!==EXPECTED_AUDIT)return false;
    if(audit.readyForLivePromotion!==true||audit.judgmentApproved!==true||shadow.promotionContract?.readyForJudgmentFinalization!==true)return false;

    const expected=new Map((shadow.fighters||[]).map(result=>[key(result.fighter),result]));
    const boards=[...(data.men||[]),...(data.women||[])];
    if(boards.length!==63||expected.size!==63||boards.some(row=>!expected.has(key(row?.fighter))))return false;

    boards.forEach(row=>attachDepth(row,expected.get(key(row.fighter))));
    (data.fighters||[]).forEach(profile=>{
      const result=expected.get(key(profile?.fighter));
      if(result)attachDepth(profile,result);
    });

    const engineResult=engine.apply('division-era-depth-finalizer');
    if(!engineResult?.applied)return false;
    syncProfiles(data,[...(data.men||[]),...(data.women||[])]);
    syncOverrides(data);

    if(typeof window.refresh==='function')window.refresh();
    if(typeof window.renderCategories==='function')window.renderCategories();

    // The live UI scorer is allowed to rerender totals, but it must preserve the same canonical formula.
    const postUiEngineResult=engine.apply('division-era-depth-finalizer-post-ui');
    if(!postUiEngineResult?.applied)return false;
    syncProfiles(data,[...(data.men||[]),...(data.women||[])]);
    syncOverrides(data);

    const liveRows=[...(data.men||[]),...(data.women||[])];
    const mismatches=liveRows.filter(row=>{
      const result=expected.get(key(row.fighter));
      return Math.abs(num(row.eraDepthAdjustment)-num(result?.curvedAdjustment))>0.001
        || Math.abs(num(row.totalScore)-(num(row.preEraDepthTotalScore)+num(result?.curvedAdjustment)))>0.001;
    }).map(row=>row.fighter);

    const previous=window.UFC_DIVISION_ERA_DEPTH_LIVE||{};
    const report={
      ...previous,
      version:previous.version||'division-era-depth-live-20260712a',
      applied:mismatches.length===0,
      finalizedAfterPipeline:true,
      finalizerVersion:VERSION,
      finalScoreEngineVersion:engine.version||null,
      finalScoreEngineApplyCount:engine.applyCount||null,
      promotedCount:liveRows.length,
      mismatchCount:mismatches.length,
      mismatches,
      results:liveRows.map(row=>({
        fighter:row.fighter,
        board:(data.women||[]).includes(row)?'women':'men',
        rank:row.rank,
        preEraDepthTotalScore:row.preEraDepthTotalScore,
        totalScore:row.totalScore,
        eraDepthAdjustment:row.eraDepthAdjustment,
        overallOvr:row.overallOvr,
        divisionEraDepth:row.divisionEraDepth
      })),
      finalizedAt:new Date().toISOString()
    };
    window.UFC_DIVISION_ERA_DEPTH_LIVE=report;
    data.meta=data.meta||{};
    data.meta.divisionEraDepthLive={
      ...(data.meta.divisionEraDepthLive||{}),
      version:report.version,
      finalizerVersion:VERSION,
      finalScoreEngineVersion:report.finalScoreEngineVersion,
      sourceDatasetEnd:shadow.source?.datasetEnd,
      rosterCount:63,
      promotedCount:63,
      mismatchCount:report.mismatchCount,
      applied:report.applied,
      finalizedAfterPipeline:true,
      appliedAt:report.finalizedAt
    };
    document.documentElement.setAttribute('data-division-era-depth-live',`${report.version}-canonical-63-${report.mismatchCount}`);
    if(window.UFC_HOME_POLISH?.refreshHero)window.UFC_HOME_POLISH.refreshHero();
    if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render)window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render();
    finalized=report.applied;
    window.dispatchEvent(new CustomEvent('ufc-division-era-depth-finalized',{detail:report}));
    return finalized;
  }

  function finalizeState(){
    const applied=apply();
    window.UFC_DIVISION_ERA_DEPTH_FINALIZER={
      version:VERSION,
      applied,
      status:applied?'ready':'blocked',
      live:window.UFC_DIVISION_ERA_DEPTH_LIVE||null,
      appliedAt:new Date().toISOString()
    };
  }

  window.UFC_DIVISION_ERA_DEPTH_FINALIZER={version:VERSION,applied:false,status:'waiting-for-scoring-pipeline'};
  window.addEventListener('ufc-scoring-pipeline-ready',finalizeState,{once:true});
  if(window.UFC_SCORING_PIPELINE?.status==='ready')finalizeState();
})();
