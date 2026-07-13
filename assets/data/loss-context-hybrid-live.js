// Evidence publisher for the judgment-approved hybrid UFC Loss Context model.
// The canonical scoring engine owns the penalty value, totals, ranks, and OVR.
(function(){
  'use strict';

  const VERSION='loss-context-hybrid-live-20260713g-evidence-only';
  const LOCK='loss-context-hybrid-judgment-lock-20260711a';
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
      sourceShadowVersion:window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.version||null,
      judgmentLockVersion:LOCK,
      severity:result.severity,
      frequency:result.frequency,
      hybridBase:result.hybridBase,
      primeLossCount:result.primeLossCount,
      primeFinishCount:result.primeFinishCount,
      primeVolumeFloor:result.primeVolumeFloor,
      primeVolumeFloorApplied:result.primeVolumeFloorApplied,
      throughPrimeUfcFights:result.exposure,
      divisionMultiplier:result.divisionMultiplier,
      divisionDiscountPct:result.divisionDiscountPct,
      divisionPointsSaved:result.divisionPointsSaved,
      finalPenalty:round2(result.recommendedPenalty),
      worstLosses:result.worstLosses||[]
    };
  }
  function attachEvidence(data,result){
    const detail=evidenceFor(result);
    allRowsFor(data,result.fighter).forEach(row=>{row.lossContextHybrid=detail;});
    return detail;
  }
  function cleanCopy(){
    Object.values(window.DISPLAY_OVERRIDES||{}).forEach(override=>{
      ['oneLiner','whyRankedHere','whyNotHigher','whyNotLower','finalTakeaway'].forEach(field=>{
        if(typeof override?.[field]!=='string')return;
        override[field]=override[field]
          .replace(/even with the -10 cap/gi,'after the context adjustment')
          .replace(/the -10 cap/gi,'the previous additive cap')
          .replace(/old -10 penalty/gi,'previous additive penalty')
          .replace(/at -10 under the old system/gi,'under the previous additive system');
      });
    });
  }
  function installCopyHooks(){
    cleanCopy();
    if(window.__UFC_HYBRID_LOSS_CONTEXT_COPY_INSTALLED)return;
    window.__UFC_HYBRID_LOSS_CONTEXT_COPY_INSTALLED=true;

    if(typeof window.categoryEvidenceItems==='function'){
      const original=window.categoryEvidenceItems;
      window.categoryEvidenceItems=function(f,category){
        if(category!=='penalty')return original(f,category);
        const audit=f?.lossContextHybrid||window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.entryFor?.(f?.fighter)?.lossContextHybrid;
        if(!audit)return original(f,category);
        const relief=Math.round(num(audit.divisionDiscountPct)*100);
        return [
          ['Final Loss Context',Number(audit.finalPenalty).toFixed(2)],
          ['Worst-loss severity',`${Number(audit.severity).toFixed(2)} from the two worst counted losses`],
          ['Loss frequency',`${Number(audit.frequency).toFixed(2)} across ${audit.throughPrimeUfcFights} UFC fights through prime`],
          ['Prime-loss floor',`${Number(audit.primeVolumeFloor).toFixed(2)} · ${audit.primeVolumeFloorApplied?'applied':'not needed'}`],
          ['Division relief',relief?`${relief}% · ${Number(audit.divisionPointsSaved).toFixed(2)} points saved`:'No strong-division reduction'],
          ['Post-prime treatment','Post-prime fights and no contests are excluded.']
        ];
      };
    }

    if(typeof window.categoryLogicSentence==='function'){
      const original=window.categoryLogicSentence;
      window.categoryLogicSentence=function(f,category){
        if(category!=='penalty')return original(f,category);
        const audit=f?.lossContextHybrid;
        if(!audit)return original(f,category);
        return `${f.fighter}'s Loss Context combines worst-loss severity, counted loss burden per UFC fight through prime, a minimum burden for repeated prime losses, and strong-division relief. The live penalty is ${Number(audit.finalPenalty).toFixed(2)}.`;
      };
    }

    if(typeof window.renderRules==='function'){
      const original=window.renderRules;
      window.renderRules=function(){
        original();
        const target=document.getElementById('rulesContent');
        if(!target||target.querySelector('[data-hybrid-loss-context-rule]'))return;
        target.insertAdjacentHTML('beforeend','<div class="card" data-hybrid-loss-context-rule="true"><h3>Live Loss Context Formula</h3><p><strong>Severity</strong> averages the two worst counted losses. <strong>Frequency</strong> divides total counted loss burden by UFC fights through prime and multiplies by 3. A <strong>prime-loss floor</strong> prevents long careers from diluting repeated prime defeats. Strong divisions can reduce the completed penalty by up to 15%. Post-prime fights and no contests are excluded. Maximum penalty: 6.00 points.</p></div>');
      };
    }
  }

  function apply(){
    const data=window.RANKING_DATA;
    const shadow=window.UFC_LOSS_CONTEXT_HYBRID_SHADOW;
    const audit=window.UFC_LOSS_CONTEXT_HYBRID_AUDIT;
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS;
    if(!modulesReady||!data||!shadow?.applied||!audit?.applied||!canonical?.entryFor)return false;
    if(audit.readyForLivePromotion!==true||audit.judgmentApproved!==true||audit.judgmentLockVersion!==LOCK)return false;

    const rows=boardRows(data);
    const expected=new Map((shadow.scored||[]).map(result=>[key(result.fighter),result]));
    if(!rows.length||expected.size!==rows.length||rows.some(row=>!expected.has(key(row.fighter))))return false;

    const results=rows.map(row=>{
      const source=expected.get(key(row.fighter));
      const detail=attachEvidence(data,source);
      const canonicalEntry=canonical.entryFor(row.fighter);
      return {
        fighter:row.fighter,
        board:(data.women||[]).includes(row)?'women':'men',
        recommendedPenalty:round2(source.recommendedPenalty),
        canonicalPenalty:round2(canonicalEntry?.penalty),
        lossContextHybrid:detail
      };
    });
    const mismatches=results.filter(result=>Math.abs(num(result.recommendedPenalty)-num(result.canonicalPenalty))>0.001);
    const byKey=new Map(results.map(result=>[key(result.fighter),result]));

    installCopyHooks();
    const report={
      version:VERSION,
      applied:mismatches.length===0,
      mode:'evidence-only-hybrid-loss-context',
      sourceShadowVersion:shadow.version,
      sourceAuditVersion:audit.version,
      judgmentLockVersion:LOCK,
      rosterCount:rows.length,
      promotedCount:results.length,
      mismatchCount:mismatches.length,
      mismatches,
      rules:shadow.rules,
      results,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesPenalty:false,
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false,
      scoreAuthority:'assets/js/scoring-engine.js',
      appliedAt:new Date().toISOString()
    };

    window.UFC_LOSS_CONTEXT_HYBRID_LIVE=report;
    data.meta=data.meta||{};
    data.meta.lossContextHybridLive={
      version:VERSION,
      judgmentLockVersion:LOCK,
      rosterCount:rows.length,
      promotedCount:results.length,
      mismatchCount:report.mismatchCount,
      applied:report.applied,
      scoreAuthority:report.scoreAuthority,
      appliedAt:report.appliedAt
    };
    document.documentElement.setAttribute('data-loss-context-hybrid-live',`${VERSION}-${rows.length}-${report.mismatchCount}`);
    window.dispatchEvent(new CustomEvent('ufc-loss-context-hybrid-live-ready',{detail:report}));
    return report.applied;
  }

  function tryFinalize(){
    if(finalized)return;
    if(apply()){finalized=true;return;}
    window.UFC_LOSS_CONTEXT_HYBRID_LIVE={
      version:VERSION,
      applied:false,
      status:modulesReady?'waiting-for-full-roster-evidence':'waiting-for-final-module-handoff',
      judgmentLockVersion:LOCK,
      mutatesPenalty:false,
      mutatesScores:false
    };
  }

  window.UFC_LOSS_CONTEXT_HYBRID_LIVE={version:VERSION,applied:false,status:'waiting-for-evidence',judgmentLockVersion:LOCK,mutatesPenalty:false,mutatesScores:false};
  window.addEventListener('ufc-ranking-data-patches-ready',()=>{modulesReady=true;tryFinalize();},{once:true});
  window.addEventListener('ufc-loss-context-hybrid-audit-ready',tryFinalize,{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',tryFinalize,{once:true});
  [0,250,1000,2500].forEach(delay=>setTimeout(tryFinalize,delay));
  tryFinalize();
})();
