// Adds Merab's Saenz + Petr Yan losses to Loss Context.
(function(){
  const VERSION='merab-yan-loss-context-20260707b-saenz';
  const TARGET='Merab Dvalishvili';
  const PATCH_LOSSES=[
    {opponent:'Frankie Saenz',phase:'prePrime',opponentTier:'nonElite',finished:false,finishTreatment:'none',counted:true,notes:'UFC debut loss before elite prime.'},
    {opponent:'Petr Yan',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:'none',counted:true,notes:'Title-level rematch loss by decision.'}
  ];
  const CAP=-10;
  function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d;}
  function round2(v){return Math.round((num(v)+Number.EPSILON)*100)/100;}
  function rows(){return Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];}
  function boardRow(){return (window.RANKING_DATA?.men||[]).find(f=>f?.fighter===TARGET)||null;}
  function currentPenalty(f){return num(f?.penalty??f?.lossPenalty??f?.scoring?.penalty??0);}
  function positiveScore(f){const p=num(f?.weightedScoreBreakdown?.positiveScore,NaN);return Number.isFinite(p)?p:round2(num(f?.totalScore)-currentPenalty(f));}
  function syncBoard(f,target,total){const b=boardRow();if(!b)return; b.losses=f.losses; b.penalty=target; b.lossPenalty=target; b.totalScore=total; if(b.scoring)b.scoring.penalty=target; if(b.weightedScoreBreakdown){b.weightedScoreBreakdown.penalty=target;b.weightedScoreBreakdown.totalScore=total;} b.lossContextLedgerVersion=VERSION; b.lossContextFormulaDriven=true;}
  function apply(){
    const f=rows().find(x=>x?.fighter===TARGET); if(!f)return false;
    f.losses=Array.isArray(f.losses)?f.losses.slice():[];
    PATCH_LOSSES.forEach(loss=>{if(!f.losses.some(x=>String(x?.opponent||'').toLowerCase()===loss.opponent.toLowerCase()))f.losses.push({...loss});});
    f.lossContextLedgerVersion=VERSION;
    let target=-4.75,raw=null;
    const engine=window.UFC_SCORING_ENGINE;
    if(engine?.calculateLossContext){const audit=engine.calculateLossContext(f); if(Number.isFinite(Number(audit?.score))){target=Math.max(CAP,round2(audit.score)); raw=audit.rawScore;}}
    const pos=positiveScore(f),total=round2(pos+target),previous={totalScore:f.totalScore,penalty:f.penalty,lossPenalty:f.lossPenalty};
    f.penalty=target;f.lossPenalty=target;f.totalScore=total; if(f.scoring)f.scoring.penalty=target; if(f.weightedScoreBreakdown){f.weightedScoreBreakdown.penalty=target;f.weightedScoreBreakdown.totalScore=total;} if(f.display?.scoreSummary){f.display.scoreSummary.lossContext=target;f.display.scoreSummary.totalScore=total;}
    f.lossContextFormulaDriven=true; f.lossContextFormulaVersion=VERSION; f.lossContextFormulaWrite={previous,positiveScore:pos,targetPenalty:target,rawPenalty:raw,source:'Merab Saenz + Yan loss context update'};
    syncBoard(f,target,total);
    if(engine?.calculateScore){const report=rows().map(row=>{const calc=engine.calculateScore(row); row.calculatedScore=calc; row.modelScore=calc; row.lossContextAudit=calc.lossContextAudit; return {fighter:row.fighter,storedTotalScore:calc.storedTotalScore,calculatedTotalScore:calc.totalScore,delta:calc.delta,storedLossPenalty:calc.storedLossPenalty,calculatedLossPenalty:calc.calculatedLossPenalty,rawCalculatedLossPenalty:calc.rawCalculatedLossPenalty,lossPenaltyDelta:calc.lossPenaltyDelta,lossContextStatus:calc.lossContextStatus,formulaDriven:row.lossContextFormulaDriven===true};}); window.UFC_SCORING_ENGINE_REPORT=report; window.UFC_LOSS_CONTEXT_REPORT=report.filter(r=>r.lossContextStatus!=='missing-ledger'||r.calculatedLossPenalty!==null); engine.report=window.UFC_SCORING_ENGINE_REPORT; engine.lossContextReport=window.UFC_LOSS_CONTEXT_REPORT;}
    if(window.UFC_DYNAMIC_RANKS?.apply)window.UFC_DYNAMIC_RANKS.apply(); if(typeof refresh==='function'){try{refresh();}catch(e){}}
    window.UFC_MERAB_YAN_LOSS_CONTEXT={version:VERSION,applied:true,targetPenalty:target,totalScore:total,losses:f.losses};
    document.documentElement.setAttribute('data-merab-yan-loss-context',VERSION);
    return true;
  }
  if(!apply())setTimeout(apply,300);
})();
