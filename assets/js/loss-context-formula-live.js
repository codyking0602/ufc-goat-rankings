// Makes Loss Context the first formula-driven live category.
// Uses loaded loss ledgers + scoring-engine calculator, then writes the capped result back to each fighter.
(function(){
  const VERSION = 'loss-context-formula-live-20260707a';
  const CAP = -10;
  function num(v,d=0){ const n=Number(v); return Number.isFinite(n)?n:d; }
  function round2(v){ return Math.round((num(v)+Number.EPSILON)*100)/100; }
  function currentPenalty(f){ return num(f?.penalty ?? f?.lossPenalty ?? f?.scoring?.penalty ?? 0); }
  function positiveScore(f){
    const direct = num(f?.weightedScoreBreakdown?.positiveScore, NaN);
    if(Number.isFinite(direct)) return direct;
    return round2(num(f?.totalScore) - currentPenalty(f));
  }
  function hasUsableLedger(f){
    return Array.isArray(f?.losses) || f?.lossContextNoLosses === true || f?.lossesVerified === true || f?.lossContext?.noCountedLosses === true;
  }
  function writeFormulaPenalty(f, audit){
    if(!audit || !Number.isFinite(Number(audit.score))) return null;
    const targetPenalty = Math.max(CAP, round2(audit.score));
    const previous = { totalScore:f.totalScore, penalty:f.penalty, lossPenalty:f.lossPenalty };
    const positive = positiveScore(f);
    const nextTotal = round2(positive + targetPenalty);
    f.penalty = targetPenalty;
    f.lossPenalty = targetPenalty;
    f.totalScore = nextTotal;
    if(f.scoring) f.scoring.penalty = targetPenalty;
    if(f.weightedScoreBreakdown){
      f.weightedScoreBreakdown.penalty = targetPenalty;
      f.weightedScoreBreakdown.totalScore = nextTotal;
    }
    if(f.display?.scoreSummary){
      f.display.scoreSummary.lossContext = targetPenalty;
      f.display.scoreSummary.totalScore = nextTotal;
    }
    f.lossContextFormulaVersion = VERSION;
    f.lossContextFormulaDriven = true;
    f.lossContextFormulaWrite = { previous, positiveScore:positive, targetPenalty, rawPenalty:audit.rawScore, capped:audit.capped === true };
    return { fighter:f.fighter, previous, next:{ totalScore:nextTotal, penalty:targetPenalty, lossPenalty:targetPenalty }, rawPenalty:audit.rawScore, capped:audit.capped === true };
  }
  function apply(){
    const engine = window.UFC_SCORING_ENGINE;
    const rows = Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : [];
    if(!engine?.calculateLossContext || !engine?.calculateScore || !rows.length){
      window.UFC_LOSS_CONTEXT_FORMULA_LIVE = { version:VERSION, applied:[], pending:true, reason:'engine-or-fighters-not-ready' };
      return false;
    }
    const applied = [];
    rows.forEach(f => {
      if(!f?.fighter || !hasUsableLedger(f)) return;
      const audit = engine.calculateLossContext(f);
      const write = writeFormulaPenalty(f, audit);
      if(write) applied.push(write);
    });
    const report = rows.map(f => {
      const calc = engine.calculateScore(f);
      f.calculatedScore = calc;
      f.modelScore = calc;
      f.lossContextAudit = calc.lossContextAudit;
      return {
        fighter:f.fighter,
        storedTotalScore:calc.storedTotalScore,
        calculatedTotalScore:calc.totalScore,
        delta:calc.delta,
        storedLossPenalty:calc.storedLossPenalty,
        calculatedLossPenalty:calc.calculatedLossPenalty,
        rawCalculatedLossPenalty:calc.rawCalculatedLossPenalty,
        lossPenaltyDelta:calc.lossPenaltyDelta,
        lossContextStatus:calc.lossContextStatus,
        formulaDriven:f.lossContextFormulaDriven === true
      };
    });
    window.UFC_SCORING_ENGINE_REPORT = report.sort((a,b)=>Math.abs(num(b.delta))-Math.abs(num(a.delta)));
    window.UFC_LOSS_CONTEXT_REPORT = report
      .filter(row => row.lossContextStatus !== 'missing-ledger' || row.calculatedLossPenalty !== null)
      .sort((a,b)=>Math.abs(num(b.lossPenaltyDelta))-Math.abs(num(a.lossPenaltyDelta)));
    engine.report = window.UFC_SCORING_ENGINE_REPORT;
    engine.lossContextReport = window.UFC_LOSS_CONTEXT_REPORT;
    window.UFC_LOSS_CONTEXT_FORMULA_LIVE = { version:VERSION, cap:CAP, applied, appliedCount:applied.length, pending:false };
    document.documentElement.setAttribute('data-loss-context-formula-live', VERSION);
    if(typeof refresh === 'function'){ try{ refresh(); }catch(e){} }
    if(window.UFC_DYNAMIC_RANKS?.apply) window.UFC_DYNAMIC_RANKS.apply();
    if(window.UFC_RENDER_ACTIVE_VIEW){ try{ window.UFC_RENDER_ACTIVE_VIEW(); }catch(e){} }
    return true;
  }
  if(!apply()) setTimeout(apply, 250);
})();
