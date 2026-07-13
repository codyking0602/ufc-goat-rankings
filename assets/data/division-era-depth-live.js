// Evidence publisher for the judgment-approved Division-Era Depth adjustment.
// The canonical scoring engine owns the adjustment value, totals, ranks, and OVR.
(function(){
  'use strict';

  const VERSION='division-era-depth-live-20260713c-evidence-only';
  const SHADOW_VERSION='division-era-depth-shadow-20260712e-roster-72';
  const AUDIT_VERSION='division-era-depth-judgment-review-20260712c-roster-72';
  let modulesReady=Boolean(window.UFC_PHASE2_DATA_STATUS);
  let finalized=false;

  const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;

  function boardRows(data){return [...(data?.men||[]),...(data?.women||[])].filter(row=>row?.fighter);}
  function allRowsFor(data,fighter){
    const target=key(fighter);
    return [...boardRows(data),...(data?.fighters||[])].filter(row=>key(row?.fighter)===target);
  }
  function evidenceFor(result){
    return {
      version:VERSION,
      sourceShadowVersion:SHADOW_VERSION,
      depthIndex:result.depthIndex,
      adjustment:round2(result.curvedAdjustment),
      componentRatios:result.componentRatios||{},
      matchedPrimeFightCount:result.matchedPrimeFightCount,
      sampledDivisions:result.sampledDivisions||[],
      primeStart:result.primeStart||null,
      primeEnd:result.primeEnd||null,
      openPrime:Boolean(result.openPrime),
      womenFeatherweightTreatment:result.womenFeatherweightTreatment||null
    };
  }
  function attachEvidence(data,result){
    const detail=evidenceFor(result);
    allRowsFor(data,result.fighter).forEach(row=>{row.divisionEraDepth=detail;});
    return detail;
  }
  function installRulesHook(){
    if(window.__UFC_ERA_DEPTH_RULES_HOOK)return;
    const previous=window.renderRules;
    if(typeof previous!=='function')return;
    window.__UFC_ERA_DEPTH_RULES_HOOK=true;
    window.renderRules=function(){
      previous();
      const target=document.getElementById('rulesContent');
      if(!target||target.querySelector('[data-era-depth-rule]'))return;
      target.insertAdjacentHTML('beforeend','<div class="card" data-era-depth-rule="true"><h3>Division-Era Depth</h3><p>A post-base adjustment measures how difficult it was to stay elite in that division at that time: 30% qualified active fighter pool, 50% strength of ranks 6–15, and 20% contender diversity. Every fight in the canonical UFC prime is sampled, with title fights weighted 1.5×. The curved adjustment ranges from −3.00 to +0.75. Women’s featherweight is excluded because it never maintained a viable ranks-6–15 baseline.</p></div>');
    };
  }

  function apply(){
    const data=window.RANKING_DATA;
    const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    const audit=window.UFC_DIVISION_ERA_DEPTH_AUDIT;
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS;
    if(!modulesReady||!data||!shadow||!audit?.applied||!canonical?.entryFor)return false;
    if(shadow.version!==SHADOW_VERSION||audit.version!==AUDIT_VERSION||audit.shadowVersion!==SHADOW_VERSION)return false;
    if(audit.readyForLivePromotion!==true||audit.judgmentApproved!==true||audit.sourceFresh!==true||audit.womenFeatherweightTreatmentApproved!==true)return false;
    if(shadow.promotionContract?.readyForJudgmentFinalization!==true||shadow.promotionContract?.sourceFresh!==true||shadow.promotionContract?.womenFeatherweightSafe!==true)return false;

    const rows=boardRows(data);
    const expected=new Map((shadow.fighters||[]).map(result=>[key(result.fighter),result]));
    if(!rows.length||expected.size!==rows.length||Number(audit.rosterCount)!==rows.length||rows.some(row=>!expected.has(key(row.fighter))))return false;

    const results=rows.map(row=>{
      const source=expected.get(key(row.fighter));
      const detail=attachEvidence(data,source);
      const canonicalEntry=canonical.entryFor(row.fighter);
      return {
        fighter:row.fighter,
        board:(data.women||[]).includes(row)?'women':'men',
        recommendedAdjustment:round2(source.curvedAdjustment),
        canonicalAdjustment:round2(canonicalEntry?.eraDepthAdjustment),
        divisionEraDepth:detail
      };
    });
    const mismatches=results.filter(result=>Math.abs(num(result.recommendedAdjustment)-num(result.canonicalAdjustment))>0.001);
    const byKey=new Map(results.map(result=>[key(result.fighter),result]));

    installRulesHook();
    const report={
      version:VERSION,
      applied:mismatches.length===0,
      mode:'evidence-only-division-era-depth',
      sourceShadowVersion:shadow.version,
      sourceAuditVersion:audit.version,
      sourceDatasetEnd:shadow.source?.datasetEnd,
      rosterCount:rows.length,
      promotedCount:results.length,
      mismatchCount:mismatches.length,
      mismatches,
      formula:shadow.methodology?.curvedCandidate,
      womenFeatherweightTreatment:shadow.methodology?.womenFeatherweightTreatment,
      results,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesAdjustment:false,
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false,
      scoreAuthority:'assets/js/scoring-engine.js',
      appliedAt:new Date().toISOString()
    };

    window.UFC_DIVISION_ERA_DEPTH_LIVE=report;
    data.meta=data.meta||{};
    data.meta.divisionEraDepthLive={
      version:VERSION,
      sourceShadowVersion:shadow.version,
      sourceAuditVersion:audit.version,
      sourceDatasetEnd:report.sourceDatasetEnd,
      rosterCount:rows.length,
      promotedCount:results.length,
      mismatchCount:report.mismatchCount,
      applied:report.applied,
      scoreAuthority:report.scoreAuthority,
      appliedAt:report.appliedAt
    };
    document.documentElement.setAttribute('data-division-era-depth-live',`${VERSION}-${rows.length}-${report.mismatchCount}`);
    window.dispatchEvent(new CustomEvent('ufc-division-era-depth-live-ready',{detail:report}));
    return report.applied;
  }

  function tryFinalize(){
    if(finalized)return;
    if(apply()){finalized=true;return;}
    window.UFC_DIVISION_ERA_DEPTH_LIVE={
      version:VERSION,
      applied:false,
      status:modulesReady?'waiting-for-full-roster-evidence':'waiting-for-final-module-handoff',
      mutatesAdjustment:false,
      mutatesScores:false
    };
  }

  window.UFC_DIVISION_ERA_DEPTH_LIVE={version:VERSION,applied:false,status:'waiting-for-evidence',mutatesAdjustment:false,mutatesScores:false};
  window.addEventListener('ufc-ranking-data-patches-ready',()=>{modulesReady=true;tryFinalize();},{once:true});
  window.addEventListener('ufc-division-era-depth-shadow-ready',tryFinalize,{once:true});
  window.addEventListener('ufc-division-era-depth-audit-ready',tryFinalize,{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',tryFinalize,{once:true});
  [0,250,1000,2500].forEach(delay=>setTimeout(tryFinalize,delay));
  tryFinalize();
})();
