// Canonical Merab Loss Context formula fix.
// Runs after the formula-live pass so the card, category leaders, and board rows all agree.
(function(){
  const VERSION='merab-loss-context-formula-fix-20260707a';
  const TARGET='Merab Dvalishvili';
  const CAP=-10;
  const LOSSES=[
    {opponent:'Ricky Simon',phase:'prePrime',opponentTier:'nonElite',finished:true,finishTreatment:'normal',counted:true,notes:'Early UFC loss before elite prime.'},
    {opponent:'Frankie Saenz',phase:'prePrime',opponentTier:'nonElite',finished:false,finishTreatment:'none',counted:true,notes:'UFC debut loss before elite prime.'},
    {opponent:'Petr Yan',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:'none',counted:true,notes:'Title-level rematch loss by decision.'}
  ];
  function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d;}
  function round2(v){return Math.round((num(v)+Number.EPSILON)*100)/100;}
  function allRows(){return [window.RANKING_DATA?.fighters,window.RANKING_DATA?.men,window.RANKING_DATA?.women].filter(Array.isArray).flat().filter(f=>f?.fighter===TARGET);}
  function storedPenalty(f){return num(f?.penalty??f?.lossPenalty??f?.scoring?.penalty??0);}
  function positiveScore(f){const direct=num(f?.weightedScoreBreakdown?.positiveScore,NaN);return Number.isFinite(direct)?direct:round2(num(f?.totalScore)-storedPenalty(f));}
  function calculatedPenalty(f){
    const engine=window.UFC_SCORING_ENGINE;
    if(engine?.calculateLossContext){
      const audit=engine.calculateLossContext({...f,losses:LOSSES});
      const score=num(audit?.score,NaN);
      if(Number.isFinite(score))return {target:Math.max(CAP,round2(score)),audit};
    }
    return {target:-4.75,audit:{score:-4.75,rawScore:-4.75,status:'fallback'}};
  }
  function writeRow(f,target,audit){
    const previous={totalScore:f.totalScore,penalty:f.penalty,lossPenalty:f.lossPenalty};
    const positive=positiveScore(f);
    const total=round2(positive+target);
    f.losses=LOSSES.map(x=>({...x}));
    f.lossContextLedgerVersion=VERSION;
    f.penalty=target;
    f.lossPenalty=target;
    f.totalScore=total;
    if(f.scoring)f.scoring.penalty=target;
    if(f.weightedScoreBreakdown){f.weightedScoreBreakdown.penalty=target;f.weightedScoreBreakdown.totalScore=total;}
    if(f.display?.scoreSummary){f.display.scoreSummary.lossContext=target;f.display.scoreSummary.totalScore=total;}
    f.lossContextFormulaDriven=true;
    f.lossContextFormulaVersion=VERSION;
    f.lossContextFormulaWrite={previous,positiveScore:positive,targetPenalty:target,rawPenalty:audit?.rawScore??target,source:'Merab canonical loss-context formula fix'};
    return {fighter:f.fighter,previous,next:{totalScore:total,penalty:target,lossPenalty:target},audit};
  }
  function refreshReports(){
    const engine=window.UFC_SCORING_ENGINE;
    const rows=Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];
    if(!engine?.calculateScore||!rows.length)return;
    const report=rows.map(row=>{
      const calc=engine.calculateScore(row);
      row.calculatedScore=calc;
      row.modelScore=calc;
      row.lossContextAudit=calc.lossContextAudit;
      return {fighter:row.fighter,storedTotalScore:calc.storedTotalScore,calculatedTotalScore:calc.totalScore,delta:calc.delta,storedLossPenalty:calc.storedLossPenalty,calculatedLossPenalty:calc.calculatedLossPenalty,rawCalculatedLossPenalty:calc.rawCalculatedLossPenalty,lossPenaltyDelta:calc.lossPenaltyDelta,lossContextStatus:calc.lossContextStatus,formulaDriven:row.lossContextFormulaDriven===true};
    });
    window.UFC_SCORING_ENGINE_REPORT=report;
    window.UFC_LOSS_CONTEXT_REPORT=report.filter(r=>r.lossContextStatus!=='missing-ledger'||r.calculatedLossPenalty!==null);
    engine.report=window.UFC_SCORING_ENGINE_REPORT;
    engine.lossContextReport=window.UFC_LOSS_CONTEXT_REPORT;
  }
  function rerender(){
    if(window.UFC_DYNAMIC_RANKS?.apply)window.UFC_DYNAMIC_RANKS.apply();
    if(window.UFC_MARK_DIRTY)window.UFC_MARK_DIRTY('men');
    if(window.UFC_RENDER_ACTIVE_VIEW){try{window.UFC_RENDER_ACTIVE_VIEW();}catch(e){}}
    if(typeof refresh==='function'){try{refresh();}catch(e){}}
    if(window.UFC_CATEGORY_LEADERS?.render){try{window.UFC_CATEGORY_LEADERS.render();}catch(e){}}
    const h=document.querySelector('#fighterDetail .profile-summary h2');
    if(h&&/merab/i.test(h.textContent||'')&&typeof window.openFighter==='function'){
      try{window.openFighter(TARGET);}catch(e){}
    }
  }
  function apply(){
    const rows=allRows();
    if(!rows.length)return false;
    const {target,audit}=calculatedPenalty(rows[0]);
    const applied=rows.map(f=>writeRow(f,target,audit));
    refreshReports();
    window.UFC_MERAB_LOSS_CONTEXT_FORMULA_FIX={version:VERSION,applied:true,targetPenalty:target,expectedPenalty:-4.75,losses:LOSSES,rows:applied,appliedAt:new Date().toISOString()};
    window.UFC_MERAB_YAN_LOSS_CONTEXT=window.UFC_MERAB_LOSS_CONTEXT_FORMULA_FIX;
    document.documentElement.setAttribute('data-merab-loss-context-formula-fix',VERSION);
    rerender();
    return true;
  }
  const run=()=>apply();
  run();
  setTimeout(run,300);
  setTimeout(run,900);
  setTimeout(run,1800);
})();
