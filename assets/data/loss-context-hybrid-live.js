// Live promoter for the judgment-approved hybrid UFC Loss Context model.
// Owns only the live Loss Context modifier and its audit detail.
(function(){
  'use strict';

  const VERSION='loss-context-hybrid-live-dynamic-roster-20260712a';
  const DETAIL_VERSION='dynamic-roster-scoring-repair-20260712a';
  const LOCK='loss-context-hybrid-judgment-lock-20260711a';
  let finalized=false;

  const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;

  function rows(data){return [...(data?.men||[]),...(data?.women||[])].filter(row=>row?.fighter);}

  function promoteRow(row,result){
    if(row.preHybridLossContextPenalty===undefined)row.preHybridLossContextPenalty=num(row.penalty);
    row.penalty=round2(result.recommendedPenalty);
    row.lossPenalty=row.penalty;
    row.lossContext=row.penalty;
    row.lossContextHybrid={
      version:DETAIL_VERSION,
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
      finalPenalty:result.recommendedPenalty,
      worstLosses:result.worstLosses||[]
    };
  }

  function syncProfiles(data,boardRows){
    const byKey=new Map(boardRows.map(row=>[key(row.fighter),row]));
    (data.fighters||[]).forEach(profile=>{
      const board=byKey.get(key(profile?.fighter));
      if(!board)return;
      ['penalty','lossPenalty','lossContext','lossContextHybrid','preHybridLossContextPenalty'].forEach(field=>{
        if(board[field]!==undefined)profile[field]=board[field];
      });
    });
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
    if(finalized)return true;
    const data=window.RANKING_DATA;
    const shadow=window.UFC_LOSS_CONTEXT_HYBRID_SHADOW;
    const audit=window.UFC_LOSS_CONTEXT_HYBRID_AUDIT;
    if(!data||!shadow?.applied||!audit?.applied)return false;
    if(audit.readyForLivePromotion!==true||audit.judgmentApproved!==true||audit.judgmentLockVersion!==LOCK)return false;
    if(!shadow.coverageComplete||Number(shadow.blockedCount)!==0)return false;

    const boardRows=rows(data);
    const expected=new Map((shadow.scored||[]).map(result=>[key(result.fighter),result]));
    if(!boardRows.length||expected.size!==boardRows.length||boardRows.some(row=>!expected.has(key(row.fighter))))return false;

    boardRows.forEach(row=>promoteRow(row,expected.get(key(row.fighter))));
    syncProfiles(data,boardRows);
    installCopyHooks();

    const mismatches=boardRows.filter(row=>Math.abs(num(row.penalty)-num(expected.get(key(row.fighter))?.recommendedPenalty))>0.001).map(row=>row.fighter);
    const byKey=new Map(boardRows.map(row=>[key(row.fighter),row]));
    const report={
      version:VERSION,
      applied:mismatches.length===0,
      mode:'live-loss-context-modifier-only',
      sourceShadowVersion:shadow.version,
      sourceAuditVersion:audit.version,
      judgmentLockVersion:LOCK,
      rosterCount:boardRows.length,
      promotedCount:boardRows.length,
      blockedCount:0,
      mismatchCount:mismatches.length,
      mismatches,
      rules:shadow.rules,
      results:boardRows.map(row=>({fighter:row.fighter,board:(data.women||[]).includes(row)?'women':'men',penalty:row.penalty,lossContextHybrid:row.lossContextHybrid})),
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesPenalty:true,
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false,
      appliedAt:new Date().toISOString()
    };

    window.UFC_LOSS_CONTEXT_HYBRID_LIVE=report;
    data.meta=data.meta||{};
    data.meta.lossContextHybridLive={version:VERSION,judgmentLockVersion:LOCK,rosterCount:boardRows.length,promotedCount:boardRows.length,mismatchCount:report.mismatchCount,applied:report.applied,owner:'loss-context-hybrid-live.js',mutatesScores:false,appliedAt:report.appliedAt};
    document.documentElement.setAttribute('data-loss-context-hybrid-live',`${VERSION}-${boardRows.length}-${report.mismatchCount}`);
    finalized=report.applied;
    window.dispatchEvent(new CustomEvent('ufc-loss-context-hybrid-live-ready',{detail:report}));
    return finalized;
  }

  function attempt(){
    if(apply())return;
    window.UFC_LOSS_CONTEXT_HYBRID_LIVE={version:VERSION,applied:false,status:'waiting-for-approved-hybrid-audit',judgmentLockVersion:LOCK,mutatesPenalty:true,mutatesScores:false};
  }

  window.UFC_LOSS_CONTEXT_HYBRID_LIVE={version:VERSION,applied:false,status:'waiting-for-approved-hybrid-audit',judgmentLockVersion:LOCK,mutatesPenalty:true,mutatesScores:false};
  ['ufc-loss-context-hybrid-audit-ready','ufc-loss-context-hybrid-shadow-ready','ufc-ranking-data-patches-ready','ufc-loss-context-final-reconciliation-ready'].forEach(eventName=>window.addEventListener(eventName,attempt));
  attempt();
})();
