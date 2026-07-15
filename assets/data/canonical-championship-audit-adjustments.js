// Cody-approved fight-level Championship adjustments from fighter audits.
// Inputs only: never writes category scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-championship-audit-adjustments-20260715a-conor-mendes';
  const ADJUSTMENTS=Object.freeze([
    Object.freeze({
      fighter:'Conor McGregor',
      fightId:'2015-07-11-chad-mendes',
      opponent:'Chad Mendes',
      baseCredit:.75,
      opponentStrength:1,
      eraTitleContextAdjustment:1,
      finalAdjustedCredit:.75,
      note:'Cody-approved fighter audit: full 0.75 interim-title credit for the Chad Mendes win.'
    })
  ]);

  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
  const api=window.UFC_CANONICAL_SCORING_JUDGMENTS||null;
  const originalEntryFor=api?.entryFor?.bind(api)||null;

  function adjustmentsFor(fighter){
    const target=clean(fighter);
    return ADJUSTMENTS.filter(row=>clean(row.fighter)===target);
  }

  function applyToRow(fighter,row){
    const requested=adjustmentsFor(fighter);
    if(!row||!Array.isArray(row.inputs)){
      return {row,applied:[],missing:requested.map(adjustment=>({fighter:adjustment.fighter,fightId:adjustment.fightId}))};
    }
    const applied=[];
    const missing=[];
    requested.forEach(adjustment=>{
      const target=row.inputs.find(input=>input?.fightId===adjustment.fightId)||
        row.inputs.find(input=>clean(input?.opponent)===clean(adjustment.opponent));
      if(!target){
        missing.push({fighter:adjustment.fighter,fightId:adjustment.fightId});
        return;
      }
      const previousCredit=Number(target.finalAdjustedCredit||0);
      target.baseCredit=adjustment.baseCredit;
      target.opponentStrength=adjustment.opponentStrength;
      target.eraTitleContextAdjustment=adjustment.eraTitleContextAdjustment;
      target.legacyCombinedAdjustment=1;
      target.finalAdjustedCredit=adjustment.finalAdjustedCredit;
      target.sourceAdjustedCredit=adjustment.finalAdjustedCredit;
      target.reviewStatus='locked';
      target.judgmentStatus='cody-approved';
      target.decompositionStatus='Cody-approved direct final title-credit resolution';
      target.notes=adjustment.note;
      target.provenance='canonical UFC fight fact + Cody-approved fighter audit judgment';
      applied.push({
        fighter:adjustment.fighter,
        fightId:target.fightId,
        opponent:target.opponent,
        previousCredit,
        finalAdjustedCredit:adjustment.finalAdjustedCredit
      });
    });
    return {row,applied,missing};
  }

  let validation={applied:[],missing:ADJUSTMENTS.map(row=>({fighter:row.fighter,fightId:row.fightId}))};
  if(originalEntryFor){
    validation=applyToRow('Conor McGregor',originalEntryFor('championship','Conor McGregor'));
    api.entryFor=function(category,fighter){
      const row=originalEntryFor(category,fighter);
      if(category!=='championship')return row;
      return applyToRow(fighter,row).row;
    };
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
    mutatesOnlyChampionshipInputs:true,
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_CHAMPIONSHIP_AUDIT_ADJUSTMENTS=report;
  document.documentElement.setAttribute('data-canonical-championship-audit-adjustments',`${VERSION}-${report.passed?'clean':'blocked'}`);
})();
