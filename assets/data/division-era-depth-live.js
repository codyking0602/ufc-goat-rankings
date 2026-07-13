// Live promoter for the judgment-approved Division-Era Depth adjustment.
(function(){
  'use strict';

  const VERSION='division-era-depth-live-20260712b-roster-dynamic';
  const SHADOW_VERSION='division-era-depth-shadow-20260712e-roster-72';
  const AUDIT_VERSION='division-era-depth-judgment-review-20260712c-roster-72';
  const OVR_MIN=82;
  const OVR_MAX=99;
  let modulesReady=Boolean(window.UFC_PHASE2_DATA_STATUS);
  let finalized=false;

  const key=name=>String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function rerank(rows){
    rows.sort((a,b)=>num(b.totalScore)-num(a.totalScore)||num(b.championship)-num(a.championship)||String(a.fighter||'').localeCompare(String(b.fighter||'')));
    rows.forEach((row,index)=>{row.rank=index+1;});
  }

  function promoteRow(row,result){
    if(row.preEraDepthTotalScore===undefined)row.preEraDepthTotalScore=round2(num(row.totalScore)-num(row.eraDepthAdjustment));
    const adjustment=round2(result.curvedAdjustment);
    row.eraDepthAdjustment=adjustment;
    row.divisionEraDepth={
      version:VERSION,
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
    row.totalScore=round2(num(row.preEraDepthTotalScore)+adjustment);
    row.rawScore=row.totalScore;
    const baseFormula=String(row.scoreFormula||'championship + opponentQuality + primeDominance + longevity + apexPeak + lossContext');
    row.scoreFormula=baseFormula.includes('divisionEraDepth')?baseFormula:`${baseFormula} + divisionEraDepth`;
  }

  function syncProfiles(DATA,boardRows){
    const boardByKey=new Map(boardRows.map(row=>[key(row.fighter),row]));
    (DATA.fighters||[]).forEach(profile=>{
      const board=boardByKey.get(key(profile?.fighter));
      if(!board)return;
      ['eraDepthAdjustment','divisionEraDepth','preEraDepthTotalScore','rawScore','totalScore','rank','scoreFormula','overallOvr'].forEach(field=>{
        if(board[field]!==undefined)profile[field]=board[field];
      });
    });
  }

  function assignOvrs(DATA,boardName){
    const rows=DATA[boardName]||[];
    if(!rows.length)return[];
    const values=rows.map(row=>num(row.totalScore));
    const high=Math.max(...values);
    const low=Math.min(...values);
    const span=Math.max(high-low,0.01);
    return rows.map(row=>{
      row.overallOvr=clamp(Math.round(OVR_MIN+(num(row.totalScore)-low)/span*(OVR_MAX-OVR_MIN)),OVR_MIN,OVR_MAX);
      const profile=(DATA.fighters||[]).find(item=>key(item?.fighter)===key(row.fighter));
      if(profile)profile.overallOvr=row.overallOvr;
      window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
      const override=window.DISPLAY_OVERRIDES[row.fighter]=window.DISPLAY_OVERRIDES[row.fighter]||{};
      override.overallOvr=row.overallOvr;
      override.allTimeRank=row.rank;
      override.rankLabel=`${boardName==='women'?'Women':'Men'} #${row.rank}`;
      override.eraDepthAdjustment=row.eraDepthAdjustment;
      override.divisionEraDepth=row.divisionEraDepth;
      return {fighter:row.fighter,board:boardName,rank:row.rank,totalScore:row.totalScore,overallOvr:row.overallOvr,eraDepthAdjustment:row.eraDepthAdjustment};
    });
  }

  function installOverallOvrResolver(DATA){
    const resolver=function(f){
      const fighterKey=key(f?.fighter);
      const board=[...(DATA.men||[]),...(DATA.women||[])].find(row=>key(row?.fighter)===fighterKey);
      return num(board?.overallOvr ?? window.DISPLAY_OVERRIDES?.[f?.fighter]?.overallOvr ?? f?.overallOvr ?? OVR_MIN);
    };
    window.overallOvr=resolver;
    try{overallOvr=resolver;}catch(_){/* global binding may be read-only. */}
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

  function installProfileHook(DATA){
    if(window.__UFC_ERA_DEPTH_PROFILE_HOOK)return;
    const previous=window.openFighter;
    if(typeof previous!=='function')return;
    window.__UFC_ERA_DEPTH_PROFILE_HOOK=true;
    window.openFighter=function(name){
      const result=previous(name);
      const row=[...(DATA.men||[]),...(DATA.women||[])].find(item=>key(item?.fighter)===key(name));
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
    const DATA=window.RANKING_DATA;
    const SHADOW=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    const AUDIT=window.UFC_DIVISION_ERA_DEPTH_AUDIT;
    if(!modulesReady||!DATA||!SHADOW||!AUDIT?.applied)return false;
    if(SHADOW.version!==SHADOW_VERSION||AUDIT.version!==AUDIT_VERSION||AUDIT.shadowVersion!==SHADOW_VERSION)return false;
    if(AUDIT.readyForLivePromotion!==true||AUDIT.judgmentApproved!==true||AUDIT.sourceFresh!==true||AUDIT.womenFeatherweightTreatmentApproved!==true)return false;
    if(SHADOW.promotionContract?.readyForJudgmentFinalization!==true||SHADOW.promotionContract?.sourceFresh!==true||SHADOW.promotionContract?.womenFeatherweightSafe!==true)return false;

    const expected=new Map((SHADOW.fighters||[]).map(result=>[key(result.fighter),result]));
    const rows=[...(DATA.men||[]),...(DATA.women||[])];
    if(!rows.length||expected.size!==rows.length||Number(AUDIT.rosterCount)!==rows.length||rows.some(row=>!expected.has(key(row?.fighter))))return false;

    rows.forEach(row=>promoteRow(row,expected.get(key(row.fighter))));
    rerank(DATA.men||[]);
    rerank(DATA.women||[]);
    syncProfiles(DATA,[...(DATA.men||[]),...(DATA.women||[])]);
    if(window.UFC_DYNAMIC_RANKS?.apply)window.UFC_DYNAMIC_RANKS.apply();
    rerank(DATA.men||[]);
    rerank(DATA.women||[]);

    const ovrRows=[...assignOvrs(DATA,'men'),...assignOvrs(DATA,'women')];
    syncProfiles(DATA,[...(DATA.men||[]),...(DATA.women||[])]);
    installOverallOvrResolver(DATA);
    installProfileHook(DATA);
    installRulesHook();

    const liveRows=[...(DATA.men||[]),...(DATA.women||[])];
    const mismatches=liveRows.filter(row=>{
      const result=expected.get(key(row.fighter));
      return Math.abs(num(row.eraDepthAdjustment)-num(result?.curvedAdjustment))>0.001||Math.abs(num(row.totalScore)-(num(row.preEraDepthTotalScore)+num(result?.curvedAdjustment)))>0.001;
    }).map(row=>row.fighter);
    const byKey=new Map(liveRows.map(row=>[key(row.fighter),row]));
    const report={
      version:VERSION,
      applied:mismatches.length===0,
      mode:'live-canonical-division-era-depth',
      sourceShadowVersion:SHADOW.version,
      sourceAuditVersion:AUDIT.version,
      sourceDatasetEnd:SHADOW.source?.datasetEnd,
      rosterCount:liveRows.length,
      promotedCount:liveRows.length,
      mismatchCount:mismatches.length,
      mismatches,
      formula:SHADOW.methodology?.curvedCandidate,
      womenFeatherweightTreatment:SHADOW.methodology?.womenFeatherweightTreatment,
      ovrScale:{min:OVR_MIN,max:OVR_MAX,method:'board min-max score normalization'},
      ovrRows,
      anchors:{
        jonJones:{rank:byKey.get(key('Jon Jones'))?.rank,adjustment:byKey.get(key('Jon Jones'))?.eraDepthAdjustment,ovr:byKey.get(key('Jon Jones'))?.overallOvr},
        georgesStPierre:{rank:byKey.get(key('Georges St-Pierre'))?.rank,adjustment:byKey.get(key('Georges St-Pierre'))?.eraDepthAdjustment,ovr:byKey.get(key('Georges St-Pierre'))?.overallOvr},
        demetriousJohnson:{rank:byKey.get(key('Demetrious Johnson'))?.rank,adjustment:byKey.get(key('Demetrious Johnson'))?.eraDepthAdjustment,ovr:byKey.get(key('Demetrious Johnson'))?.overallOvr},
        andersonSilva:{rank:byKey.get(key('Anderson Silva'))?.rank,adjustment:byKey.get(key('Anderson Silva'))?.eraDepthAdjustment,ovr:byKey.get(key('Anderson Silva'))?.overallOvr},
        joseAldo:{rank:byKey.get(key('Jose Aldo'))?.rank,adjustment:byKey.get(key('Jose Aldo'))?.eraDepthAdjustment,ovr:byKey.get(key('Jose Aldo'))?.overallOvr},
        mattHughes:{rank:byKey.get(key('Matt Hughes'))?.rank,adjustment:byKey.get(key('Matt Hughes'))?.eraDepthAdjustment,ovr:byKey.get(key('Matt Hughes'))?.overallOvr},
        khabibNurmagomedov:{rank:byKey.get(key('Khabib Nurmagomedov'))?.rank,adjustment:byKey.get(key('Khabib Nurmagomedov'))?.eraDepthAdjustment,ovr:byKey.get(key('Khabib Nurmagomedov'))?.overallOvr},
        stipeMiocic:{rank:byKey.get(key('Stipe Miocic'))?.rank,adjustment:byKey.get(key('Stipe Miocic'))?.eraDepthAdjustment,ovr:byKey.get(key('Stipe Miocic'))?.overallOvr},
        amandaNunes:{rank:byKey.get(key('Amanda Nunes'))?.rank,adjustment:byKey.get(key('Amanda Nunes'))?.eraDepthAdjustment,ovr:byKey.get(key('Amanda Nunes'))?.overallOvr},
        crisCyborg:{rank:byKey.get(key('Cris Cyborg'))?.rank,adjustment:byKey.get(key('Cris Cyborg'))?.eraDepthAdjustment,ovr:byKey.get(key('Cris Cyborg'))?.overallOvr}
      },
      results:liveRows.map(row=>({fighter:row.fighter,board:(DATA.women||[]).includes(row)?'women':'men',rank:row.rank,totalScore:row.totalScore,eraDepthAdjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr,divisionEraDepth:row.divisionEraDepth})),
      mutatesScores:true,
      mutatesRanks:true,
      mutatesOvr:true,
      appliedAt:new Date().toISOString()
    };

    window.UFC_DIVISION_ERA_DEPTH_LIVE=report;
    DATA.meta=DATA.meta||{};
    DATA.meta.divisionEraDepthLive={version:VERSION,sourceShadowVersion:SHADOW.version,sourceAuditVersion:AUDIT.version,sourceDatasetEnd:report.sourceDatasetEnd,rosterCount:liveRows.length,promotedCount:liveRows.length,mismatchCount:report.mismatchCount,applied:report.applied,appliedAt:report.appliedAt};
    document.documentElement.setAttribute('data-division-era-depth-live',`${VERSION}-${liveRows.length}-${report.mismatchCount}`);
    if(typeof window.refresh==='function')window.refresh();
    if(typeof window.renderCategories==='function')window.renderCategories();
    if(window.UFC_HOME_POLISH?.refreshHero)window.UFC_HOME_POLISH.refreshHero();
    if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render)window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render();
    window.dispatchEvent(new CustomEvent('ufc-division-era-depth-live-ready',{detail:report}));
    return report.applied;
  }

  function tryFinalize(){
    if(finalized)return;
    if(apply()){finalized=true;return;}
    window.UFC_DIVISION_ERA_DEPTH_LIVE={version:VERSION,applied:false,status:modulesReady?'waiting-for-current-approved-depth-model':'waiting-for-final-module-handoff'};
  }

  window.UFC_DIVISION_ERA_DEPTH_LIVE={version:VERSION,applied:false,status:'waiting-for-source-audit-and-modules'};
  window.addEventListener('ufc-ranking-data-patches-ready',()=>{modulesReady=true;tryFinalize();},{once:true});
  window.addEventListener('ufc-division-era-depth-shadow-ready',tryFinalize,{once:true});
  window.addEventListener('ufc-division-era-depth-audit-ready',tryFinalize,{once:true});
  window.addEventListener('ufc-loss-context-hybrid-live-ready',tryFinalize,{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',tryFinalize,{once:true});
  tryFinalize();
})();
