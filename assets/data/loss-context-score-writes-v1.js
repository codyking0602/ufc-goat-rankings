// First approved loss-context score writes.
// Applies only the confirmed Batch 1 penalty mismatches while keeping formula details auditable.
(function(){
  const VERSION = 'loss-context-score-writes-v1-20260707a-gsp-anderson';
  const WRITES = {
    'Georges St-Pierre': {
      penalty: -6.25,
      lossPenalty: -6.25,
      totalScore: 82.15,
      reason: 'Loss Context calculator write: Hughes 2004 pre-prime elite finish (-1.50) + Serra 2007 prime non-elite finish (-4.75).',
      source: 'docs/loss-context-batch1-shadow-review-20260707.md'
    },
    'Anderson Silva': {
      penalty: -4.25,
      lossPenalty: -4.25,
      totalScore: 71.94,
      reason: 'Loss Context calculator write: Weidman I normal elite finish (-2.25) + Weidman II reduced injury/technical finish (-2.00); later losses post-prime.',
      source: 'docs/loss-context-batch1-shadow-review-20260707.md'
    }
  };

  function num(value, fallback=0){
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  function round2(value){ return Math.round((num(value) + Number.EPSILON) * 100) / 100; }
  function applyWrite(f, write){
    const previous = {
      totalScore: f.totalScore,
      penalty: f.penalty,
      lossPenalty: f.lossPenalty,
      scoringPenalty: f.scoring?.penalty,
      weightedPenalty: f.weightedScoreBreakdown?.penalty,
      weightedTotalScore: f.weightedScoreBreakdown?.totalScore
    };
    f.penalty = write.penalty;
    f.lossPenalty = write.lossPenalty;
    f.totalScore = write.totalScore;
    f.lossContextScoreWriteVersion = VERSION;
    f.lossContextScoreWrite = { reason: write.reason, source: write.source, previous };
    if(f.scoring) f.scoring.penalty = write.penalty;
    if(f.weightedScoreBreakdown){
      f.weightedScoreBreakdown.penalty = write.penalty;
      if(Number.isFinite(num(f.weightedScoreBreakdown.positiveScore, NaN))){
        f.weightedScoreBreakdown.totalScore = round2(num(f.weightedScoreBreakdown.positiveScore) + write.penalty);
      } else {
        f.weightedScoreBreakdown.totalScore = write.totalScore;
      }
    }
    if(f.display?.scoreSummary){
      f.display.scoreSummary.lossContext = write.penalty;
      f.display.scoreSummary.totalScore = write.totalScore;
    }
    return { fighter: f.fighter, previous, next: { totalScore: f.totalScore, penalty: f.penalty, lossPenalty: f.lossPenalty } };
  }
  function apply(){
    const rows = Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : [];
    const applied = [];
    rows.forEach(f => {
      const write = WRITES[f?.fighter];
      if(!write) return;
      applied.push(applyWrite(f, write));
    });
    window.UFC_LOSS_CONTEXT_SCORE_WRITES_V1 = { version: VERSION, applied, writes: WRITES };
    document.documentElement.setAttribute('data-loss-context-score-writes', VERSION);
  }
  apply();
})();
