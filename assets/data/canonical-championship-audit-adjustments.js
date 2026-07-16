// Cody-approved fight-level Championship adjustments from fighter audits.
// Approved inputs remain the score authority. This layer also aligns the visible adjusted-title-credit
// projection with those same approved inputs; it never writes category totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-championship-audit-adjustments-20260716d-division-title-credit-alignment';
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
    }),
    Object.freeze({
      fighter:'Justin Gaethje',
      fightId:'2026-01-24-paddy-pimblett',
      opponent:'Paddy Pimblett',
      baseCredit:.75,
      opponentStrength:1,
      eraTitleContextAdjustment:1,
      finalAdjustedCredit:.75,
      note:'Cody-approved fighter audit: Paddy Pimblett receives full 1.00 opponent-strength treatment within Gaethje’s 0.75 interim-title base credit.'
    })
  ]);

  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
  const round2=value=>{const rounded=Math.round((Number(value||0)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const api=window.UFC_CANONICAL_SCORING_JUDGMENTS||null;
  const originalEntryFor=api?.entryFor?.bind(api)||null;
  const facts=window.UFC_CANONICAL_FIGHTER_FACTS||null;
  const originalDeriveFor=facts?.deriveFor?.bind(facts)||null;

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
    validation={applied:[],missing:[]};
    [...new Set(ADJUSTMENTS.map(row=>row.fighter))].forEach(fighter=>{
      const result=applyToRow(fighter,originalEntryFor('championship',fighter));
      validation.applied.push(...result.applied);
      validation.missing.push(...result.missing);
    });
    api.entryFor=function(category,fighter){
      const row=originalEntryFor(category,fighter);
      if(category!=='championship')return row;
      return applyToRow(fighter,row).row;
    };
  }

  function scoreFacingChampionshipProjection(fighter){
    const row=api?.entryFor?.('championship',fighter);
    if(!Array.isArray(row?.inputs))return null;
    if(row.inputs.some(input=>!Number.isFinite(Number(input?.finalAdjustedCredit))))return null;
    return {
      adjustedTitleWins:round2(row.inputs.reduce((sum,input)=>sum+Number(input.finalAdjustedCredit),0)),
      inputs:clone(row.inputs)
    };
  }

  let visibleProjectionAlignment={applied:false,reason:'Missing canonical deriveFor or scoring judgments'};
  if(originalDeriveFor&&api?.entryFor){
    facts.deriveFor=function(fighter){
      const derived=originalDeriveFor(fighter);
      const projection=scoreFacingChampionshipProjection(fighter);
      if(!derived||!projection)return derived;
      const next=clone(derived);
      const inputByFightId=new Map(projection.inputs.filter(input=>input?.fightId).map(input=>[input.fightId,input]));
      const alignedRows=(next?.championship?.rows||[]).map(row=>{
        const input=inputByFightId.get(row?.fightId);
        if(!input)return row;
        const adjustedCredit=round2(input.finalAdjustedCredit);
        return {...row,credit:adjustedCredit,adjustedCredit,finalAdjustedCredit:adjustedCredit};
      });
      next.championship={
        ...(next.championship||{}),
        adjustedTitleWins:projection.adjustedTitleWins,
        rows:alignedRows,
        adjustedTitleCreditSource:'approved Championship scoring inputs'
      };
      return next;
    };
    visibleProjectionAlignment={
      applied:true,
      source:'approved Championship scoring inputs',
      fields:['derived.championship.adjustedTitleWins','derived.championship.rows[].credit'],
      purpose:'Keep overall and division visible adjusted-title-credit totals equal to the inputs that produce the Championship score.'
    };
  }

  const report={
    version:VERSION,
    applied:Boolean(originalEntryFor)&&validation.missing.length===0,
    passed:Boolean(originalEntryFor)&&validation.missing.length===0&&validation.applied.length===ADJUSTMENTS.length&&visibleProjectionAlignment.applied,
    adjustmentCount:ADJUSTMENTS.length,
    appliedCount:validation.applied.length,
    missing:validation.missing,
    appliedAdjustments:validation.applied,
    visibleProjectionAlignment,
    source:'Cody-approved fighter audit',
    wrapsCanonicalJudgmentAccess:true,
    wrapsCanonicalVisibleProjection:true,
    mutatesOnlyChampionshipInputsAndVisibleAdjustedTitleCredit:true,
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_CHAMPIONSHIP_AUDIT_ADJUSTMENTS=report;
  document.documentElement.setAttribute('data-canonical-championship-audit-adjustments',`${VERSION}-${report.passed?'clean':'blocked'}`);
})();