// Cody-approved fight-level Opponent Quality adjustments from fighter audits.
// Inputs only: never writes category scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-opponent-quality-audit-adjustments-20260715b-merab';
  const ADJUSTMENTS=Object.freeze([
    Object.freeze({
      fighter:'Merab Dvalishvili',
      opponent:'Henry Cejudo',
      occurrence:1,
      baseTier:'top-five',
      baseCredit:1,
      finalCredit:.85,
      adjustmentType:'age-layoff-comeback-timing',
      adjustmentValue:-.15,
      note:'Elite former two-division champion, discounted for age, long layoff, and comeback timing.'
    }),
    Object.freeze({
      fighter:'Merab Dvalishvili',
      opponent:"Sean O'Malley",
      occurrence:2,
      baseTier:'top-five',
      baseCredit:1,
      finalCredit:.90,
      adjustmentType:'repeat-opponent',
      adjustmentValue:-.10,
      note:'Elite championship rematch win with a modest repeat-opponent discount.'
    }),
    Object.freeze({
      fighter:'Merab Dvalishvili',
      opponent:'Marlon Moraes',
      occurrence:1,
      baseTier:'top-ten',
      baseCredit:.85,
      finalCredit:.70,
      adjustmentType:'late-career-timing',
      adjustmentValue:-.15,
      note:'Former title challenger, discounted for the clear late-career decline entering the fight.'
    })
  ]);

  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
  const api=window.UFC_CANONICAL_SCORING_JUDGMENTS||null;
  const originalEntryFor=api?.entryFor?.bind(api)||null;
  const originalList=api?.list?.bind(api)||null;

  function adjustmentsFor(fighter){
    const target=clean(fighter);
    return ADJUSTMENTS.filter(row=>clean(row.fighter)===target);
  }

  function applyToRow(fighter,row){
    if(!row||!Array.isArray(row.inputs))return {row,applied:[],missing:adjustmentsFor(fighter).map(adjustment=>({fighter:adjustment.fighter,opponent:adjustment.opponent,occurrence:adjustment.occurrence}))};
    const applied=[];
    const missing=[];
    adjustmentsFor(fighter).forEach(adjustment=>{
      const candidates=row.inputs.filter(input=>clean(input?.opponent)===clean(adjustment.opponent));
      const target=candidates.find(input=>Number(input?.occurrence||1)===Number(adjustment.occurrence))||
        (adjustment.occurrence===1?candidates[0]:null);
      if(!target){
        missing.push({fighter:adjustment.fighter,opponent:adjustment.opponent,occurrence:adjustment.occurrence});
        return;
      }
      const previousCredit=Number(target.finalCredit||0);
      target.baseTier=adjustment.baseTier;
      target.baseCredit=adjustment.baseCredit;
      target.adjustments=[{type:adjustment.adjustmentType,value:adjustment.adjustmentValue,note:adjustment.note}];
      target.finalCredit=adjustment.finalCredit;
      target.judgmentSource='cody-approved-fighter-audit';
      target.judgmentStatus='cody-approved';
      target.reviewStatus='locked';
      target.note=adjustment.note;
      target.provenance='canonical UFC fight fact + Cody-approved fighter audit judgment';
      applied.push({
        fighter:adjustment.fighter,
        opponent:adjustment.opponent,
        occurrence:adjustment.occurrence,
        previousCredit,
        finalCredit:adjustment.finalCredit
      });
    });
    return {row,applied,missing};
  }

  let validation={applied:[],missing:ADJUSTMENTS.map(row=>({fighter:row.fighter,opponent:row.opponent,occurrence:row.occurrence}))};
  if(originalEntryFor){
    const merab=originalEntryFor('opponentQuality','Merab Dvalishvili');
    validation=applyToRow('Merab Dvalishvili',merab);
    api.entryFor=function(category,fighter){
      const row=originalEntryFor(category,fighter);
      if(category!=='opponentQuality')return row;
      return applyToRow(fighter,row).row;
    };
    if(originalList){
      api.list=function(category){
        const rows=originalList(category);
        if(category!=='opponentQuality')return rows;
        return rows.map(row=>{
          const fighter=row?.inputs?.[0]?.fighter||row?.fighter||row?.normalized||'';
          return applyToRow(fighter,row).row;
        });
      };
    }
  }

  const report={
    version:VERSION,
    applied:Boolean(originalEntryFor)&&validation.missing.length===0,
    passed:Boolean(originalEntryFor)&&validation.missing.length===0&&validation.applied.length===ADJUSTMENTS.length,
    adjustmentCount:ADJUSTMENTS.length,
    appliedCount:validation.applied.length,
    missing:validation.missing,
    appliedAdjustments:validation.applied,
    source:'Cody-approved fighter audit',
    wrapsCanonicalJudgmentAccess:true,
    mutatesOnlyOpponentQualityInputs:true,
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_OPPONENT_QUALITY_AUDIT_ADJUSTMENTS=report;
  document.documentElement.setAttribute('data-canonical-opponent-quality-audit-adjustments',`${VERSION}-${report.passed?'clean':'blocked'}`);
})();
