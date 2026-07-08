// Enforce locked main category weights: Championship 35%, Quality Wins 27.5%, Prime Dominance 27.5%, Longevity 10%.
// Apex Peak remains an extra assigned points category on top of the 100% main resume model.
(function(){
  const VERSION = 'scoring-weight-model-fix-20260707b-apex-extra';
  const LOSS_PENALTY_FLOOR = -10;
  const WEIGHTS = {
    championship: 35 / 30,
    opponentQuality: 27.5 / 30,
    primeDominance: 27.5 / 30,
    longevity: 10 / 15,
    apexPeak: 1
  };
  const MODEL = {
    championshipPct: 35,
    opponentQualityPct: 27.5,
    primeDominancePct: 27.5,
    longevityPct: 10,
    apexPeakPct: 'extra',
    note: 'Main resume score is 35/27.5/27.5/10. Apex Peak is extra assigned points. Loss Context is a negative adjustment.'
  };
  function num(value, fallback=0){ const n = Number(value); return Number.isFinite(n) ? n : fallback; }
  function round2(value){ return Math.round((num(value) + Number.EPSILON) * 100) / 100; }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function fighters(){ return Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : []; }
  function categoryRaw(f,key){ return num(f?.[key] ?? f?.scoring?.[key] ?? 0); }
  function capLossPenalty(value){ return Math.max(LOSS_PENALTY_FLOOR, round2(num(value))); }
  function storedPenalty(f){ return capLossPenalty(f?.penalty ?? f?.lossPenalty ?? f?.scoring?.penalty ?? 0); }
  function scoreValue(f){ const v = Number(f?.totalScore ?? 0); return Number.isFinite(v) ? v : 0; }
  function calculateScore(f){
    const raw = {
      championship: categoryRaw(f,'championship'),
      opponentQuality: categoryRaw(f,'opponentQuality'),
      primeDominance: categoryRaw(f,'primeDominance'),
      longevity: categoryRaw(f,'longevity'),
      apexPeak: categoryRaw(f,'apexPeak')
    };
    const championship = round2(raw.championship * WEIGHTS.championship);
    const opponentQuality = round2(raw.opponentQuality * WEIGHTS.opponentQuality);
    const primeDominance = round2(raw.primeDominance * WEIGHTS.primeDominance);
    const longevity = round2(raw.longevity * WEIGHTS.longevity);
    const apexPeak = round2(raw.apexPeak * WEIGHTS.apexPeak);
    const penalty = storedPenalty(f);
    const positiveScore = round2(championship + opponentQuality + primeDominance + longevity + apexPeak);
    const totalScore = round2(positiveScore + penalty);
    const lossContextAudit = window.UFC_SCORING_ENGINE?.calculateLossContext ? window.UFC_SCORING_ENGINE.calculateLossContext(f) : f?.lossContextAudit || null;
    return {
      categories: { ...raw, penalty },
      weightedScoreBreakdown: { championship, opponentQuality, primeDominance, longevity, apexPeak, positiveScore, penalty, totalScore, model: MODEL },
      totalScore,
      storedTotalScore: num(f?.totalScore ?? 0),
      delta: round2(totalScore - num(f?.totalScore ?? 0)),
      lossContextAudit,
      calculatedLossPenalty: lossContextAudit?.score ?? null,
      rawCalculatedLossPenalty: lossContextAudit?.rawScore ?? null,
      storedLossPenalty: lossContextAudit?.storedPenalty ?? penalty,
      lossPenaltyDelta: lossContextAudit?.delta ?? null,
      lossContextStatus: lossContextAudit?.status ?? 'not-audited'
    };
  }
  function rebuildOverallOvrs(rows){
    const scores = rows.map(scoreValue);
    const maxScore = Math.max(...scores, 0);
    const minScore = Math.min(...scores, maxScore);
    return Object.fromEntries(rows.map(f => {
      const normalized = maxScore === minScore ? 1 : (scoreValue(f) - minScore) / (maxScore - minScore);
      return [f.fighter, clamp(Math.round(82 + normalized * 17), 82, 99)];
    }));
  }
  function apply(){
    const rows = fighters();
    const report = rows.map(f => {
      const calc = calculateScore(f);
      f.totalScore = calc.totalScore;
      f.calculatedScore = calc;
      f.modelScore = calc;
      f.weightedScoreBreakdown = calc.weightedScoreBreakdown;
      if(f.scoring) f.scoring.weightedModel = MODEL;
      if(f.display?.scoreSummary){
        f.display.scoreSummary.championship = calc.weightedScoreBreakdown.championship;
        f.display.scoreSummary.opponentQuality = calc.weightedScoreBreakdown.opponentQuality;
        f.display.scoreSummary.primeDominance = calc.weightedScoreBreakdown.primeDominance;
        f.display.scoreSummary.longevity = calc.weightedScoreBreakdown.longevity;
        f.display.scoreSummary.apexPeak = calc.weightedScoreBreakdown.apexPeak;
        f.display.scoreSummary.lossContext = calc.weightedScoreBreakdown.penalty;
        f.display.scoreSummary.totalScore = calc.totalScore;
      }
      return { fighter:f.fighter, calculatedTotalScore:calc.totalScore, positiveScore:calc.weightedScoreBreakdown.positiveScore, penalty:calc.weightedScoreBreakdown.penalty, weights:MODEL };
    });
    const app = window.UFC_APP_STATE;
    if(app?.rowsByLeaderboard){
      ['men','women'].forEach(board => {
        if(Array.isArray(app.rowsByLeaderboard[board])) app.rowsByLeaderboard[board].sort((a,b) => scoreValue(b) - scoreValue(a));
      });
      if(Array.isArray(app.menRows)) app.menRows.sort((a,b) => scoreValue(b) - scoreValue(a));
      if(Array.isArray(app.womenRows)) app.womenRows.sort((a,b) => scoreValue(b) - scoreValue(a));
      const all = [...(app.rowsByLeaderboard.men || []), ...(app.rowsByLeaderboard.women || [])];
      app.overallOvrs = rebuildOverallOvrs(all);
    }
    window.UFC_SCORING_WEIGHT_MODEL_FIX = { version:VERSION, weights:WEIGHTS, model:MODEL, report, appliedAt:new Date().toISOString(), calculateScore };
    if(window.UFC_SCORING_ENGINE){
      window.UFC_SCORING_ENGINE.weights = WEIGHTS;
      window.UFC_SCORING_ENGINE.weightModel = MODEL;
      window.UFC_SCORING_ENGINE.calculateScore = calculateScore;
      window.UFC_SCORING_ENGINE.report = report;
    }
    if(typeof window.UFC_MARK_DIRTY === 'function'){
      window.UFC_MARK_DIRTY('men');
      window.UFC_MARK_DIRTY('women');
      window.UFC_MARK_DIRTY('division');
    }
    if(typeof window.UFC_MARK_COMPARE_DIRTY === 'function') window.UFC_MARK_COMPARE_DIRTY();
    if(window.UFC_DYNAMIC_RANKS?.apply) window.UFC_DYNAMIC_RANKS.apply();
    if(typeof refresh === 'function'){ try{ refresh(); }catch(e){} }
    if(window.UFC_RENDER_ACTIVE_VIEW){ try{ window.UFC_RENDER_ACTIVE_VIEW(); }catch(e){} }
    document.documentElement.setAttribute('data-scoring-weight-model-fix', VERSION);
  }
  apply();
  setTimeout(apply, 100);
  setTimeout(apply, 500);
})();
