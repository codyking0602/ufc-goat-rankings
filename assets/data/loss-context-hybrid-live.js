// Live promoter for the judgment-approved hybrid UFC Loss Context model.
// Replaces canonical penalties, recalculates totals/ranks/OVRs, and refreshes every app surface.
(function(){
  'use strict';

  const VERSION='loss-context-hybrid-live-20260711c-profile-sync';
  const JUDGMENT_LOCK_VERSION='loss-context-hybrid-judgment-lock-20260711a';
  const OVR_MIN=82;
  const OVR_MAX=99;
  let lockedShadow=null;
  let lockedAudit=null;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function num(value){const n=Number(value);return Number.isFinite(n)?n:0;}
  function round2(value){return Math.round((num(value)+Number.EPSILON)*100)/100;}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function apexValue(row){
    const override=window.DISPLAY_OVERRIDES?.[row?.fighter]||{};
    return num(row?.apexPeak ?? row?.apexPeakBonus ?? row?.apexPeakAudit?.score ?? override?.apexPeakAudit?.score);
  }
  function baseScore(row){
    return round2(
      (num(row?.championship)/30)*35+
      (num(row?.opponentQuality)/30)*27.5+
      (num(row?.primeDominance)/30)*27.5+
      (num(row?.longevity)/30)*10
    );
  }
  function totalScore(row){return round2(baseScore(row)+apexValue(row)+num(row?.penalty));}

  function applyPenalty(row,result){
    if(!row||!result)return;
    if(row.preHybridLossContextPenalty===undefined)row.preHybridLossContextPenalty=num(row.penalty);
    if(row.preHybridTotalScore===undefined)row.preHybridTotalScore=num(row.totalScore);
    row.penalty=round2(result.recommendedPenalty);
    row.lossPenalty=row.penalty;
    row.lossContext=row.penalty;
    row.lossContextHybrid={
      version:VERSION,
      judgmentLockVersion:JUDGMENT_LOCK_VERSION,
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
    row.baseScore=baseScore(row);
    row.apexPeak=apexValue(row);
    row.apexPeakBonus=row.apexPeak;
    row.rawScore=totalScore(row);
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
      profile.penalty=board.penalty;
      profile.lossPenalty=board.penalty;
      profile.lossContext=board.penalty;
      profile.lossContextHybrid=board.lossContextHybrid;
      profile.baseScore=board.baseScore;
      profile.apexPeak=board.apexPeak;
      profile.apexPeakBonus=board.apexPeakBonus;
      profile.rawScore=board.rawScore;
      profile.totalScore=board.totalScore;
      profile.rank=board.rank;
      profile.scoreFormula=board.scoreFormula;
    });
  }

  function assignFluidOvrs(DATA,boardName){
    const rows=DATA[boardName]||[];
    if(!rows.length)return [];
    const scores=rows.map(row=>num(row.totalScore));
    const high=Math.max(...scores);
    const low=Math.min(...scores);
    const span=Math.max(high-low,0.01);
    return rows.map(row=>{
      const ratio=(num(row.totalScore)-low)/span;
      const ovr=clamp(Math.round(OVR_MIN+ratio*(OVR_MAX-OVR_MIN)),OVR_MIN,OVR_MAX);
      row.overallOvr=ovr;
      const profile=(DATA.fighters||[]).find(item=>key(item?.fighter)===key(row.fighter));
      if(profile)profile.overallOvr=ovr;
      if(window.DISPLAY_OVERRIDES){
        window.DISPLAY_OVERRIDES[row.fighter]=window.DISPLAY_OVERRIDES[row.fighter]||{};
        window.DISPLAY_OVERRIDES[row.fighter].overallOvr=ovr;
        window.DISPLAY_OVERRIDES[row.fighter].allTimeRank=row.rank;
        window.DISPLAY_OVERRIDES[row.fighter].rankLabel=`${boardName==='women'?'Women':'Men'} #${row.rank}`;
      }
      return {fighter:row.fighter,board:boardName,rank:row.rank,totalScore:row.totalScore,overallOvr:ovr};
    });
  }

  function removeStaleLossCopy(){
    if(!window.DISPLAY_OVERRIDES)return;
    Object.values(window.DISPLAY_OVERRIDES).forEach(override=>{
      if(!override)return;
      ['oneLiner','whyRankedHere','whyNotHigher','whyNotLower','finalTakeaway'].forEach(field=>{
        if(typeof override[field]!=='string')return;
        override[field]=override[field]
          .replace(/even with the -10 cap/gi,'after the context adjustment')
          .replace(/the -10 cap/gi,'the previous additive cap')
          .replace(/old -10 penalty/gi,'previous additive penalty')
          .replace(/at -10 under the old system/gi,'under the previous additive system');
      });
    });
  }

  function installLiveCopy(){
    removeStaleLossCopy();
    if(window.__UFC_HYBRID_LOSS_CONTEXT_COPY_INSTALLED)return;
    window.__UFC_HYBRID_LOSS_CONTEXT_COPY_INSTALLED=true;

    if(typeof window.categoryEvidenceItems==='function'){
      const baseEvidence=window.categoryEvidenceItems;
      window.categoryEvidenceItems=function(f,category){
        if(category!=='penalty')return baseEvidence(f,category);
        const audit=f?.lossContextHybrid||window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.entryFor?.(f?.fighter)?.lossContextHybrid;
        if(!audit)return baseEvidence(f,category);
        const reliefPct=Math.round(num(audit.divisionDiscountPct)*100);
        return [
          ['Final Loss Context', Number(audit.finalPenalty).toFixed(2)],
          ['Worst-loss severity', Number(audit.severity).toFixed(2)+' from the two worst counted losses'],
          ['Loss frequency', Number(audit.frequency).toFixed(2)+` across ${audit.throughPrimeUfcFights} UFC fights through prime`],
          ['Prime-loss floor', Number(audit.primeVolumeFloor).toFixed(2)+`${audit.primeVolumeFloorApplied?' · applied':' · not needed'}`],
          ['Division relief', reliefPct?`${reliefPct}% · ${Number(audit.divisionPointsSaved).toFixed(2)} points saved`:'No strong-division reduction'],
          ['Post-prime treatment', 'Post-prime fights and no contests are excluded.']
        ];
      };
    }

    if(typeof window.categoryLogicSentence==='function'){
      const baseLogic=window.categoryLogicSentence;
      window.categoryLogicSentence=function(f,category){
        if(category!=='penalty')return baseLogic(f,category);
        const audit=f?.lossContextHybrid;
        if(!audit)return baseLogic(f,category);
        return `${f.fighter}'s Loss Context combines worst-loss severity, total counted loss burden per UFC fight through prime, a minimum burden for repeated prime losses, and strong-division relief. The live penalty is ${Number(audit.finalPenalty).toFixed(2)}.`;
      };
    }

    if(typeof window.renderRules==='function'){
      const baseRules=window.renderRules;
      window.renderRules=function(){
        baseRules();
        const target=document.getElementById('rulesContent');
        if(!target||target.querySelector('[data-hybrid-loss-context-rule]'))return;
        target.insertAdjacentHTML('beforeend',`<div class="card" data-hybrid-loss-context-rule="true"><h3>Live Loss Context Formula</h3><p><strong>Severity</strong> averages the two worst counted losses. <strong>Frequency</strong> divides total counted loss burden by UFC fights through prime and multiplies by 3. A <strong>prime-loss floor</strong> prevents long careers from diluting repeated prime defeats. Strong divisions can reduce the completed penalty by up to 15%. Post-prime fights and no contests are excluded. Maximum penalty: 6.00 points.</p></div>`);
      };
    }
  }

  function apply(){
    const DATA=window.RANKING_DATA;
    const currentShadow=window.UFC_LOSS_CONTEXT_HYBRID_SHADOW;
    const currentAudit=window.UFC_LOSS_CONTEXT_HYBRID_AUDIT;
    const SHADOW=lockedShadow||currentShadow;
    const AUDIT=lockedAudit||currentAudit;
    if(!DATA||!SHADOW?.applied||!AUDIT?.applied)return false;
    if(AUDIT.readyForLivePromotion!==true||AUDIT.judgmentApproved!==true||AUDIT.judgmentLockVersion!==JUDGMENT_LOCK_VERSION)return false;
    if(!SHADOW.coverageComplete||Number(SHADOW.scoredCount)!==63||Number(SHADOW.blockedCount)!==0)return false;
    if(!lockedShadow){lockedShadow=SHADOW;lockedAudit=AUDIT;}

    const resultByKey=new Map((lockedShadow.scored||[]).map(result=>[key(result.fighter),result]));
    const boardRows=[...(DATA.men||[]),...(DATA.women||[])];
    const missing=boardRows.filter(row=>!resultByKey.has(key(row?.fighter))).map(row=>row?.fighter);
    if(missing.length)return false;

    boardRows.forEach(row=>applyPenalty(row,resultByKey.get(key(row.fighter))));
    rerank(DATA.men||[]);
    rerank(DATA.women||[]);
    syncProfiles(DATA,[...(DATA.men||[]),...(DATA.women||[])]);

    if(window.UFC_DYNAMIC_RANKS?.apply)window.UFC_DYNAMIC_RANKS.apply();
    rerank(DATA.men||[]);
    rerank(DATA.women||[]);
    syncProfiles(DATA,[...(DATA.men||[]),...(DATA.women||[])]);

    const ovrRows=[...assignFluidOvrs(DATA,'men'),...assignFluidOvrs(DATA,'women')];
    installLiveCopy();

    const liveRows=[...(DATA.men||[]),...(DATA.women||[])];
    const mismatches=liveRows.filter(row=>{
      const expected=resultByKey.get(key(row.fighter));
      return !expected||Math.abs(num(row.penalty)-num(expected.recommendedPenalty))>0.001||Math.abs(num(row.totalScore)-totalScore(row))>0.001;
    }).map(row=>({fighter:row.fighter,penalty:row.penalty,totalScore:row.totalScore,expectedPenalty:resultByKey.get(key(row.fighter))?.recommendedPenalty}));

    const byKey=new Map(liveRows.map(row=>[key(row.fighter),row]));
    const report={
      version:VERSION,
      applied:mismatches.length===0,
      mode:'live-canonical-hybrid-loss-context',
      sourceShadowVersion:lockedShadow.version,
      sourceAuditVersion:lockedAudit.version,
      judgmentLockVersion:JUDGMENT_LOCK_VERSION,
      rosterCount:liveRows.length,
      promotedCount:liveRows.length,
      mismatchCount:mismatches.length,
      mismatches,
      rules:lockedShadow.rules,
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
      results:liveRows.map(row=>({fighter:row.fighter,board:row.leaderboard||((DATA.women||[]).includes(row)?'women':'men'),rank:row.rank,totalScore:row.totalScore,penalty:row.penalty,overallOvr:row.overallOvr,lossContextHybrid:row.lossContextHybrid})),
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesPenalty:true,
      mutatesScores:true,
      mutatesRanks:true,
      mutatesOvr:true,
      appliedAt:new Date().toISOString()
    };

    window.UFC_LOSS_CONTEXT_HYBRID_SHADOW=lockedShadow;
    window.UFC_LOSS_CONTEXT_HYBRID_AUDIT=lockedAudit;
    window.UFC_LOSS_CONTEXT_HYBRID_LIVE=report;
    DATA.meta=DATA.meta||{};
    DATA.meta.lossContextHybridShadow={...(DATA.meta.lossContextHybridShadow||{}),version:lockedShadow.version,scoredCount:lockedShadow.scoredCount,blockedCount:lockedShadow.blockedCount,coverageComplete:lockedShadow.coverageComplete,mutatesScores:false};
    DATA.meta.lossContextHybridAudit={...(DATA.meta.lossContextHybridAudit||{}),version:lockedAudit.version,summary:lockedAudit.summary,judgmentApproved:true,judgmentLockVersion:JUDGMENT_LOCK_VERSION,readyForLivePromotion:true,requiresJudgmentReview:false,mutatesScores:false};
    DATA.meta.lossContextHybridLive={version:VERSION,judgmentLockVersion:JUDGMENT_LOCK_VERSION,rosterCount:report.rosterCount,promotedCount:report.promotedCount,mismatchCount:report.mismatchCount,applied:report.applied,appliedAt:report.appliedAt};
    document.documentElement.setAttribute('data-loss-context-hybrid-live',`${VERSION}-${report.promotedCount}-${report.mismatchCount}`);

    if(typeof window.refresh==='function')window.refresh();
    if(typeof window.renderCategories==='function')window.renderCategories();
    if(window.UFC_HOME_POLISH?.refreshHero)window.UFC_HOME_POLISH.refreshHero();
    if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render)window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render();
    window.dispatchEvent(new CustomEvent('ufc-loss-context-hybrid-live-ready',{detail:report}));
    return report.applied;
  }

  if(apply()){
    window.addEventListener('ufc-ranking-data-patches-ready',()=>apply(),{once:true});
    return;
  }
  window.UFC_LOSS_CONTEXT_HYBRID_LIVE={version:VERSION,applied:false,status:'waiting-for-judgment-approved-hybrid-audit',judgmentLockVersion:JUDGMENT_LOCK_VERSION,mutatesPenalty:true,mutatesScores:true,mutatesRanks:true,mutatesOvr:true};
  window.addEventListener('ufc-loss-context-hybrid-audit-ready',()=>apply(),{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',()=>apply(),{once:true});
  window.addEventListener('ufc-ranking-data-patches-ready',()=>apply(),{once:true});
})();