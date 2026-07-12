// Live promoter for the judgment-approved hybrid UFC Loss Context model.
// Finalizes only after both the scoring audit and complete app module handoff are ready.
(function(){
  'use strict';

  const VERSION='loss-context-hybrid-live-20260711f-surface-ovr-sync';
  const LOCK='loss-context-hybrid-judgment-lock-20260711a';
  const OVR_MIN=82;
  const OVR_MAX=99;
  let modulesReady=Boolean(window.UFC_PHASE2_DATA_STATUS);
  let finalized=false;

  const key=name=>String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function apex(row){
    const override=window.DISPLAY_OVERRIDES?.[row?.fighter]||{};
    return num(row?.apexPeak ?? row?.apexPeakBonus ?? row?.apexPeakAudit?.score ?? override?.apexPeakAudit?.score);
  }
  function base(row){
    return round2(num(row?.championship)/30*35+num(row?.opponentQuality)/30*27.5+num(row?.primeDominance)/30*27.5+num(row?.longevity)/30*10);
  }
  function total(row){return round2(base(row)+apex(row)+num(row?.penalty));}

  function promoteRow(row,result){
    if(row.preHybridLossContextPenalty===undefined)row.preHybridLossContextPenalty=num(row.penalty);
    if(row.preHybridTotalScore===undefined)row.preHybridTotalScore=num(row.totalScore);
    row.penalty=round2(result.recommendedPenalty);
    row.lossPenalty=row.penalty;
    row.lossContext=row.penalty;
    row.lossContextHybrid={
      version:VERSION,
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
    row.baseScore=base(row);
    row.apexPeak=apex(row);
    row.apexPeakBonus=row.apexPeak;
    row.rawScore=total(row);
    row.totalScore=row.rawScore;
    row.scoreFormula='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + hybridLossContext';
  }

  function rerank(rows){
    rows.sort((a,b)=>num(b.totalScore)-num(a.totalScore)||num(b.championship)-num(a.championship)||String(a.fighter||'').localeCompare(String(b.fighter||'')));
    rows.forEach((row,index)=>{row.rank=index+1;});
  }

  function syncProfiles(DATA,boardRows){
    const boardByKey=new Map(boardRows.map(row=>[key(row.fighter),row]));
    (DATA.fighters||[]).forEach(profile=>{
      const board=boardByKey.get(key(profile?.fighter));
      if(!board)return;
      ['penalty','lossPenalty','lossContext','lossContextHybrid','baseScore','apexPeak','apexPeakBonus','rawScore','totalScore','rank','scoreFormula','overallOvr'].forEach(field=>{
        if(board[field]!==undefined)profile[field]=board[field];
      });
    });
  }

  function assignOvrs(DATA,boardName){
    const rows=DATA[boardName]||[];
    if(!rows.length)return [];
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
      return {fighter:row.fighter,board:boardName,rank:row.rank,totalScore:row.totalScore,overallOvr:row.overallOvr};
    });
  }

  function installOverallOvrResolver(DATA){
    const resolver=function(f){
      const fighterKey=key(f?.fighter);
      const board=[...(DATA.men||[]),...(DATA.women||[])].find(row=>key(row?.fighter)===fighterKey);
      return num(board?.overallOvr ?? window.DISPLAY_OVERRIDES?.[f?.fighter]?.overallOvr ?? f?.overallOvr ?? OVR_MIN);
    };
    window.overallOvr=resolver;
    try{overallOvr=resolver;}catch(_){/* window assignment is enough when the binding is not writable. */}
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
    const DATA=window.RANKING_DATA;
    const SHADOW=window.UFC_LOSS_CONTEXT_HYBRID_SHADOW;
    const AUDIT=window.UFC_LOSS_CONTEXT_HYBRID_AUDIT;
    if(!modulesReady||!DATA||!SHADOW?.applied||!AUDIT?.applied)return false;
    if(AUDIT.readyForLivePromotion!==true||AUDIT.judgmentApproved!==true||AUDIT.judgmentLockVersion!==LOCK)return false;
    if(!SHADOW.coverageComplete||Number(SHADOW.scoredCount)!==63||Number(SHADOW.blockedCount)!==0)return false;

    const expected=new Map((SHADOW.scored||[]).map(result=>[key(result.fighter),result]));
    const rows=[...(DATA.men||[]),...(DATA.women||[])];
    if(rows.length!==63||rows.some(row=>!expected.has(key(row?.fighter))))return false;

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
    installCopyHooks();

    const liveRows=[...(DATA.men||[]),...(DATA.women||[])];
    const mismatches=liveRows.filter(row=>{
      const result=expected.get(key(row.fighter));
      return Math.abs(num(row.penalty)-num(result?.recommendedPenalty))>0.001||Math.abs(num(row.totalScore)-total(row))>0.001;
    }).map(row=>row.fighter);
    const byKey=new Map(liveRows.map(row=>[key(row.fighter),row]));

    const report={
      version:VERSION,
      applied:mismatches.length===0,
      mode:'live-canonical-hybrid-loss-context',
      sourceShadowVersion:SHADOW.version,
      sourceAuditVersion:AUDIT.version,
      judgmentLockVersion:LOCK,
      rosterCount:liveRows.length,
      promotedCount:liveRows.length,
      mismatchCount:mismatches.length,
      mismatches,
      rules:SHADOW.rules,
      ovrScale:{min:OVR_MIN,max:OVR_MAX,method:'board min-max score normalization'},
      ovrRows,
      anchors:{
        jonJones:{rank:byKey.get(key('Jon Jones'))?.rank,penalty:byKey.get(key('Jon Jones'))?.penalty,ovr:byKey.get(key('Jon Jones'))?.overallOvr},
        georgesStPierre:{rank:byKey.get(key('Georges St-Pierre'))?.rank,penalty:byKey.get(key('Georges St-Pierre'))?.penalty,ovr:byKey.get(key('Georges St-Pierre'))?.overallOvr},
        demetriousJohnson:{rank:byKey.get(key('Demetrious Johnson'))?.rank,penalty:byKey.get(key('Demetrious Johnson'))?.penalty,ovr:byKey.get(key('Demetrious Johnson'))?.overallOvr},
        andersonSilva:{rank:byKey.get(key('Anderson Silva'))?.rank,penalty:byKey.get(key('Anderson Silva'))?.penalty,ovr:byKey.get(key('Anderson Silva'))?.overallOvr},
        khabibNurmagomedov:{rank:byKey.get(key('Khabib Nurmagomedov'))?.rank,penalty:byKey.get(key('Khabib Nurmagomedov'))?.penalty,ovr:byKey.get(key('Khabib Nurmagomedov'))?.overallOvr},
        alexanderVolkanovski:{rank:byKey.get(key('Alexander Volkanovski'))?.rank,penalty:byKey.get(key('Alexander Volkanovski'))?.penalty,ovr:byKey.get(key('Alexander Volkanovski'))?.overallOvr},
        joseAldo:{rank:byKey.get(key('Jose Aldo'))?.rank,penalty:byKey.get(key('Jose Aldo'))?.penalty,ovr:byKey.get(key('Jose Aldo'))?.overallOvr},
        justinGaethje:{rank:byKey.get(key('Justin Gaethje'))?.rank,penalty:byKey.get(key('Justin Gaethje'))?.penalty,ovr:byKey.get(key('Justin Gaethje'))?.overallOvr},
        dricusDuPlessis:{rank:byKey.get(key('Dricus du Plessis'))?.rank,penalty:byKey.get(key('Dricus du Plessis'))?.penalty,ovr:byKey.get(key('Dricus du Plessis'))?.overallOvr}
      },
      results:liveRows.map(row=>({fighter:row.fighter,board:(DATA.women||[]).includes(row)?'women':'men',rank:row.rank,totalScore:row.totalScore,penalty:row.penalty,overallOvr:row.overallOvr,lossContextHybrid:row.lossContextHybrid})),
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesPenalty:true,
      mutatesScores:true,
      mutatesRanks:true,
      mutatesOvr:true,
      appliedAt:new Date().toISOString()
    };

    window.UFC_LOSS_CONTEXT_HYBRID_LIVE=report;
    DATA.meta=DATA.meta||{};
    DATA.meta.lossContextHybridLive={version:VERSION,judgmentLockVersion:LOCK,rosterCount:63,promotedCount:63,mismatchCount:report.mismatchCount,applied:report.applied,appliedAt:report.appliedAt};
    document.documentElement.setAttribute('data-loss-context-hybrid-live',`${VERSION}-63-${report.mismatchCount}`);
    if(typeof window.refresh==='function')window.refresh();
    if(typeof window.renderCategories==='function')window.renderCategories();
    if(window.UFC_HOME_POLISH?.refreshHero)window.UFC_HOME_POLISH.refreshHero();
    if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render)window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render();
    window.dispatchEvent(new CustomEvent('ufc-loss-context-hybrid-live-ready',{detail:report}));
    return report.applied;
  }

  function tryFinalize(){
    if(finalized)return;
    if(apply()){finalized=true;return;}
    window.UFC_LOSS_CONTEXT_HYBRID_LIVE={version:VERSION,applied:false,status:modulesReady?'waiting-for-judgment-approved-audit':'waiting-for-final-module-handoff',judgmentLockVersion:LOCK};
  }

  window.UFC_LOSS_CONTEXT_HYBRID_LIVE={version:VERSION,applied:false,status:'waiting-for-both-ready-signals',judgmentLockVersion:LOCK};
  window.addEventListener('ufc-ranking-data-patches-ready',()=>{modulesReady=true;tryFinalize();},{once:true});
  window.addEventListener('ufc-loss-context-hybrid-audit-ready',tryFinalize,{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',tryFinalize,{once:true});
  tryFinalize();
})();