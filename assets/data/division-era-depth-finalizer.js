// Final post-pipeline application of the approved Division-Era Depth adjustment.
(function(){
  'use strict';

  const VERSION='division-era-depth-finalizer-20260712a';
  const EXPECTED_SHADOW='division-era-depth-shadow-20260712d-current-wfw-safe';
  const EXPECTED_AUDIT='division-era-depth-judgment-review-20260712b-live-approved';
  const OVR_MIN=82;
  const OVR_MAX=99;
  let finalized=false;

  const key=name=>String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function rerank(rows){
    rows.sort((a,b)=>num(b.totalScore)-num(a.totalScore)||num(b.championship)-num(a.championship)||String(a.fighter||'').localeCompare(String(b.fighter||'')));
    rows.forEach((row,index)=>{row.rank=index+1;});
  }

  function syncProfiles(data,boards){
    const byKey=new Map(boards.map(row=>[key(row.fighter),row]));
    (data.fighters||[]).forEach(profile=>{
      const board=byKey.get(key(profile?.fighter));
      if(!board)return;
      ['eraDepthAdjustment','divisionEraDepth','preEraDepthTotalScore','rawScore','totalScore','rank','scoreFormula','overallOvr'].forEach(field=>{
        if(board[field]!==undefined)profile[field]=board[field];
      });
    });
  }

  function assignOvrs(data,boardName){
    const rows=data[boardName]||[];
    if(!rows.length)return;
    const scores=rows.map(row=>num(row.totalScore));
    const high=Math.max(...scores);
    const low=Math.min(...scores);
    const span=Math.max(high-low,0.01);
    rows.forEach(row=>{
      row.overallOvr=clamp(Math.round(OVR_MIN+(num(row.totalScore)-low)/span*(OVR_MAX-OVR_MIN)),OVR_MIN,OVR_MAX);
      window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
      const override=window.DISPLAY_OVERRIDES[row.fighter]=window.DISPLAY_OVERRIDES[row.fighter]||{};
      override.overallOvr=row.overallOvr;
      override.allTimeRank=row.rank;
      override.rankLabel=`${boardName==='women'?'Women':'Men'} #${row.rank}`;
      override.eraDepthAdjustment=row.eraDepthAdjustment;
      override.divisionEraDepth=row.divisionEraDepth;
    });
  }

  function installOvrResolver(data){
    const resolver=f=>{
      const target=key(f?.fighter);
      const board=[...(data.men||[]),...(data.women||[])].find(row=>key(row?.fighter)===target);
      return num(board?.overallOvr??window.DISPLAY_OVERRIDES?.[f?.fighter]?.overallOvr??f?.overallOvr??OVR_MIN);
    };
    window.overallOvr=resolver;
    try{overallOvr=resolver;}catch(_){/* Global binding may be read-only. */}
  }

  function apply(){
    if(finalized)return true;
    const data=window.RANKING_DATA;
    const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    const audit=window.UFC_DIVISION_ERA_DEPTH_AUDIT;
    if(window.UFC_SCORING_PIPELINE?.status!=='ready'||!data||shadow?.version!==EXPECTED_SHADOW||audit?.version!==EXPECTED_AUDIT)return false;
    if(audit.readyForLivePromotion!==true||audit.judgmentApproved!==true||shadow.promotionContract?.readyForJudgmentFinalization!==true)return false;

    const expected=new Map((shadow.fighters||[]).map(result=>[key(result.fighter),result]));
    const boards=[...(data.men||[]),...(data.women||[])];
    if(boards.length!==63||expected.size!==63||boards.some(row=>!expected.has(key(row?.fighter))))return false;

    boards.forEach(row=>{
      const result=expected.get(key(row.fighter));
      const base=round2(result.currentTotal);
      const adjustment=round2(result.curvedAdjustment);
      row.preEraDepthTotalScore=base;
      row.eraDepthAdjustment=adjustment;
      row.totalScore=round2(base+adjustment);
      row.rawScore=row.totalScore;
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
      row.scoreFormula=formula.includes('divisionEraDepth')?formula:`${formula} + divisionEraDepth`;
    });

    rerank(data.men||[]);
    rerank(data.women||[]);
    syncProfiles(data,[...(data.men||[]),...(data.women||[])]);
    assignOvrs(data,'men');
    assignOvrs(data,'women');
    syncProfiles(data,[...(data.men||[]),...(data.women||[])]);
    installOvrResolver(data);

    const liveRows=[...(data.men||[]),...(data.women||[])];
    const mismatches=liveRows.filter(row=>{
      const result=expected.get(key(row.fighter));
      return Math.abs(num(row.eraDepthAdjustment)-num(result?.curvedAdjustment))>0.001
        || Math.abs(num(row.totalScore)-(num(result?.currentTotal)+num(result?.curvedAdjustment)))>0.001;
    }).map(row=>row.fighter);

    const previous=window.UFC_DIVISION_ERA_DEPTH_LIVE||{};
    const report={
      ...previous,
      version:previous.version||'division-era-depth-live-20260712a',
      applied:mismatches.length===0,
      finalizedAfterPipeline:true,
      finalizerVersion:VERSION,
      promotedCount:liveRows.length,
      mismatchCount:mismatches.length,
      mismatches,
      results:liveRows.map(row=>({fighter:row.fighter,board:(data.women||[]).includes(row)?'women':'men',rank:row.rank,totalScore:row.totalScore,eraDepthAdjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr,divisionEraDepth:row.divisionEraDepth})),
      finalizedAt:new Date().toISOString()
    };
    window.UFC_DIVISION_ERA_DEPTH_LIVE=report;
    data.meta=data.meta||{};
    data.meta.divisionEraDepthLive={...(data.meta.divisionEraDepthLive||{}),version:report.version,finalizerVersion:VERSION,sourceDatasetEnd:shadow.source?.datasetEnd,rosterCount:63,promotedCount:63,mismatchCount:report.mismatchCount,applied:report.applied,finalizedAfterPipeline:true,appliedAt:report.finalizedAt};
    document.documentElement.setAttribute('data-division-era-depth-live',`${report.version}-final-63-${report.mismatchCount}`);
    if(typeof window.refresh==='function')window.refresh();
    if(typeof window.renderCategories==='function')window.renderCategories();
    if(window.UFC_HOME_POLISH?.refreshHero)window.UFC_HOME_POLISH.refreshHero();
    if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render)window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render();
    finalized=report.applied;
    window.dispatchEvent(new CustomEvent('ufc-division-era-depth-finalized',{detail:report}));
    return finalized;
  }

  window.UFC_DIVISION_ERA_DEPTH_FINALIZER={version:VERSION,applied:false,status:'waiting-for-scoring-pipeline'};
  window.addEventListener('ufc-scoring-pipeline-ready',()=>{
    const applied=apply();
    window.UFC_DIVISION_ERA_DEPTH_FINALIZER={version:VERSION,applied,status:applied?'ready':'blocked',live:window.UFC_DIVISION_ERA_DEPTH_LIVE||null,appliedAt:new Date().toISOString()};
  },{once:true});
  if(window.UFC_SCORING_PIPELINE?.status==='ready'){
    const applied=apply();
    window.UFC_DIVISION_ERA_DEPTH_FINALIZER={version:VERSION,applied,status:applied?'ready':'blocked',live:window.UFC_DIVISION_ERA_DEPTH_LIVE||null,appliedAt:new Date().toISOString()};
  }
})();
