// Cody-approved fight-level Opponent Quality adjustments from fighter audits.
// Inputs only: never writes category scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-opponent-quality-audit-adjustments-20260715a-merab';
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
  const source=window.UFC_CANONICAL_SCORING_JUDGMENTS?.opponentQuality||null;
  const applied=[];
  const missing=[];

  if(source){
    ADJUSTMENTS.forEach(adjustment=>{
      const record=source[adjustment.fighter];
      const candidates=(record?.inputs||[]).filter(row=>clean(row?.opponent)===clean(adjustment.opponent));
      const target=candidates.find(row=>Number(row?.occurrence||1)===Number(adjustment.occurrence))||
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
  }

  const report={
    version:VERSION,
    applied:Boolean(source)&&missing.length===0,
    passed:Boolean(source)&&missing.length===0&&applied.length===ADJUSTMENTS.length,
    adjustmentCount:ADJUSTMENTS.length,
    appliedCount:applied.length,
    missing,
    appliedAdjustments:applied,
    source:'Cody-approved fighter audit',
    mutatesOnlyOpponentQualityInputs:true,
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_OPPONENT_QUALITY_AUDIT_ADJUSTMENTS=report;
  document.documentElement.setAttribute('data-canonical-opponent-quality-audit-adjustments',`${VERSION}-${report.passed?'clean':'blocked'}`);
})();
