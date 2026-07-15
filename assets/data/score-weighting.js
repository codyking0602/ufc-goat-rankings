// Read-only compatibility metadata for the permanent production scoring formula.
(function(){
  'use strict';
  const VERSION='score-weighting-20260714a-production-read-only';
  const WEIGHTS=Object.freeze({championship:35,opponentQuality:25,primeDominance:30,longevity:10});
  const BASE_MAX=Object.freeze({championship:30,opponentQuality:30,primeDominance:30,longevity:30});
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
  function scoreBreakdown(row){
    const championship=(num(row?.championship)/30)*WEIGHTS.championship;
    const opponentQuality=(num(row?.opponentQuality)/30)*WEIGHTS.opponentQuality;
    const primeDominance=(num(row?.primeDominance)/30)*WEIGHTS.primeDominance;
    const longevity=(num(row?.longevity)/30)*WEIGHTS.longevity;
    const baseScore=championship+opponentQuality+primeDominance+longevity;
    const apexPeak=num(row?.apexPeak);
    const penalty=num(row?.penalty);
    const eraDepth=num(row?.eraDepthAdjustment);
    return{
      championship:round2(championship),opponentQuality:round2(opponentQuality),primeDominance:round2(primeDominance),longevity:round2(longevity),
      baseScore:round2(baseScore),apexPeak:round2(apexPeak),penalty:round2(penalty),eraDepth:round2(eraDepth),totalScore:round2(baseScore+apexPeak+penalty+eraDepth)
    };
  }
  const API={
    version:VERSION,mode:'production-read-only',weights:WEIGHTS,baseMax:BASE_MAX,
    formula:'championship/30*35 + opponentQuality/30*25 + primeDominance/30*30 + longevity/30*10 + apexPeak + penalty + eraDepthAdjustment',
    scoreBreakdown,mutatesScores:false,overallOwner:'ranking-pipeline.js',apply(){return{version:VERSION,applied:true,mutatesScores:false,owner:'ranking-pipeline.js'};}
  };
  window.UFC_SCORE_WEIGHTING=API;
  if(window.RANKING_DATA?.meta)window.RANKING_DATA.meta.scoringWeights={version:VERSION,weights:{...WEIGHTS},mode:'production-read-only',overallOwner:'ranking-pipeline.js'};
  document.documentElement?.setAttribute?.('data-score-weighting',VERSION);
})();
