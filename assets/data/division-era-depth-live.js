// Live promoter for the judgment-approved Division-Era Depth adjustment.
// Owns only the live Era Depth modifier and its audit detail.
(function(){
  'use strict';

  const VERSION='division-era-depth-live-dynamic-roster-20260712a';
  const DETAIL_VERSION='dynamic-roster-scoring-repair-20260712a';
  const SHADOW_VERSION='division-era-depth-shadow-20260712e-roster-72';
  const AUDIT_VERSION='division-era-depth-judgment-review-20260712c-roster-72';
  let finalized=false;

  const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;

  function rows(data){return [...(data?.men||[]),...(data?.women||[])].filter(row=>row?.fighter);}

  function promoteRow(row,result){
    const adjustment=round2(result.curvedAdjustment);
    row.eraDepthAdjustment=adjustment;
    row.divisionEraDepth={
      version:DETAIL_VERSION,
      sourceShadowVersion:SHADOW_VERSION,
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
  }

  function syncProfiles(data,boardRows){
    const byKey=new Map(boardRows.map(row=>[key(row.fighter),row]));
    (data.fighters||[]).forEach(profile=>{
      const board=byKey.get(key(profile?.fighter));
      if(!board)return;
      ['eraDepthAdjustment','divisionEraDepth'].forEach(field=>{
        if(board[field]!==undefined)profile[field]=board[field];
      });
    });
  }

  function depthLabel(value){
    const adjustment=num(value);
    if(adjustment>0.05)return 'Modern-depth credit';
    if(adjustment<-0.05)return 'Era-depth adjustment';
    return 'Era-depth neutral';
  }

  function profileCard(row){
    const audit=row?.divisionEraDepth;
    if(!audit)return'';
    const adjustment=num(audit.adjustment);
    const signed=`${adjustment>0?'+':''}${adjustment.toFixed(2)}`;
    const components=audit.componentRatios||{};
    const wfw=audit.womenFeatherweightTreatment?.treatment==='pure-wfw-zero-adjustment'
      ? ' Women’s featherweight has no viable depth baseline, so this model stays neutral.'
      : audit.womenFeatherweightTreatment
        ? ' Women’s featherweight samples are excluded; only the fighter’s other division is used.'
        : '';
    return `<div class="card" data-era-depth-profile="true"><h3>${depthLabel(adjustment)}</h3><p><strong>${signed} points</strong> from a ${Number(audit.depthIndex).toFixed(4)} division-era depth index across the fighter’s UFC prime.${wfw}</p><p class="meta">Qualified active pool ${Number(components.qualifiedActivePool||0).toFixed(2)}× · ranks 6–15 strength ${Number(components.ranksSixToFifteenElo||0).toFixed(2)}× · contender diversity ${Number(components.contenderDiversity||0).toFixed(2)}×</p></div>`;
  }

  function installProfileHook(data){
    if(window.__UFC_ERA_DEPTH_PROFILE_HOOK)return;
    const previous=window.openFighter;
    if(typeof previous!=='function')return;
    window.__UFC_ERA_DEPTH_PROFILE_HOOK=true;
    window.openFighter=function(name){
      const result=previous(name);
      const row=rows(data).find(item=>key(item?.fighter)===key(name));
      const detail=document.getElementById('fighterDetail');
      if(detail&&row&&!detail.querySelector('[data-era-depth-profile]')){
        const snapshot=[...detail.querySelectorAll('.card')].find(card=>card.querySelector('h3')?.textContent?.trim()==='Resume Snapshot');
        if(snapshot)snapshot.insertAdjacentHTML('afterend',profileCard(row));
        else detail.insertAdjacentHTML('beforeend',profileCard(row));
      }
      return result;
    };
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
    if(finalized)return true;
    const data=window.RANKING_DATA;
    const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    const audit=window.UFC_DIVISION_ERA_DEPTH_AUDIT;
    if(!data||!shadow||!audit?.applied)return false;
    if(shadow.version!==SHADOW_VERSION||audit.version!==AUDIT_VERSION||audit.shadowVersion!==SHADOW_VERSION)return false;
    if(audit.readyForLivePromotion!==true||audit.judgmentApproved!==true||audit.sourceFresh!==true||audit.womenFeatherweightTreatmentApproved!==true)return false;
    if(shadow.promotionContract?.readyForJudgmentFinalization!==true||shadow.promotionContract?.sourceFresh!==true||shadow.promotionContract?.womenFeatherweightSafe!==true)return false;

    const boardRows=rows(data);
    const expected=new Map((shadow.fighters||[]).map(result=>[key(result.fighter),result]));
    if(!boardRows.length||expected.size!==boardRows.length||Number(audit.rosterCount)!==boardRows.length||boardRows.some(row=>!expected.has(key(row.fighter))))return false;

    boardRows.forEach(row=>promoteRow(row,expected.get(key(row.fighter))));
    syncProfiles(data,boardRows);
    installProfileHook(data);
    installRulesHook();

    const mismatches=boardRows.filter(row=>Math.abs(num(row.eraDepthAdjustment)-num(expected.get(key(row.fighter))?.curvedAdjustment))>0.001).map(row=>row.fighter);
    const report={
      version:VERSION,
      applied:mismatches.length===0,
      mode:'live-era-depth-modifier-only',
      sourceShadowVersion:shadow.version,
      sourceAuditVersion:audit.version,
      sourceDatasetEnd:shadow.source?.datasetEnd,
      rosterCount:boardRows.length,
      promotedCount:boardRows.length,
      mismatchCount:mismatches.length,
      mismatches,
      formula:shadow.methodology?.curvedCandidate,
      womenFeatherweightTreatment:shadow.methodology?.womenFeatherweightTreatment,
      results:boardRows.map(row=>({fighter:row.fighter,board:(data.women||[]).includes(row)?'women':'men',eraDepthAdjustment:row.eraDepthAdjustment,divisionEraDepth:row.divisionEraDepth})),
      mutatesAdjustment:true,
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false,
      appliedAt:new Date().toISOString()
    };

    window.UFC_DIVISION_ERA_DEPTH_LIVE=report;
    data.meta=data.meta||{};
    data.meta.divisionEraDepthLive={version:VERSION,sourceShadowVersion:shadow.version,sourceAuditVersion:audit.version,sourceDatasetEnd:report.sourceDatasetEnd,rosterCount:boardRows.length,promotedCount:boardRows.length,mismatchCount:report.mismatchCount,applied:report.applied,owner:'division-era-depth-live.js',mutatesScores:false,appliedAt:report.appliedAt};
    document.documentElement.setAttribute('data-division-era-depth-live',`${VERSION}-${boardRows.length}-${report.mismatchCount}`);
    finalized=report.applied;
    window.dispatchEvent(new CustomEvent('ufc-division-era-depth-live-ready',{detail:report}));
    return finalized;
  }

  function attempt(){
    if(apply())return;
    window.UFC_DIVISION_ERA_DEPTH_LIVE={version:VERSION,applied:false,status:'waiting-for-current-approved-depth-model',mutatesAdjustment:true,mutatesScores:false};
  }

  window.UFC_DIVISION_ERA_DEPTH_LIVE={version:VERSION,applied:false,status:'waiting-for-current-approved-depth-model',mutatesAdjustment:true,mutatesScores:false};
  ['ufc-division-era-depth-shadow-ready','ufc-division-era-depth-audit-ready','ufc-loss-context-hybrid-live-ready','ufc-ranking-data-patches-ready'].forEach(eventName=>window.addEventListener(eventName,attempt));
  attempt();
})();
