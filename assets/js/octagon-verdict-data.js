// Builds the Octagon Verdict dataset directly from the permanent calculated ranking pipeline.
(function(){
  'use strict';
  const VERSION='octagon-verdict-data-20260715a-live-pipeline';
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const rows=()=>[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])];
  function fighterPayload(row){
    const override=window.DISPLAY_OVERRIDES?.[row.fighter]||{};
    const compare=window.COMPARE_PROFILES?.[row.fighter]||{};
    return {
      fighter:row.fighter,board:row.leaderboard||row.board,rank:row.rank,overallOvr:row.overallOvr,totalScore:row.totalScore,
      divisions:[row.primaryDivision,row.secondaryDivision].filter(Boolean),ufcRecord:row.ufcRecord,
      categories:{championship:row.championship,opponentQuality:row.opponentQuality,primeDominance:row.primeDominance,longevity:row.longevity,apexPeak:row.apexPeak,lossPenalty:row.penalty,divisionEraDepth:row.eraDepthAdjustment},
      resume:{titleFightWins:row.titleFightWins,adjustedTitleWins:row.adjustedTitleWins,topFiveWins:row.topFiveWins,rankedWins:row.rankedWins,finishRatePct:row.finishRatePct,primeRecord:row.primeRecord,roundsWonPct:row.roundsWonPct,activeEliteYears:row.activeEliteYears,timesFinishedPrime:row.timesFinishedPrime},
      divisionResume:window.UFC_DIVISION_RANKINGS?.ledgerFor?.(row.fighter)||null,
      presentation:{oneLiner:override.oneLiner||compare.shortCase||null,whyRankedHere:override.whyRankedHere||null,whyNotHigher:override.whyNotHigher||null,keyJudgmentCalls:clone(override.keyJudgmentCalls||null)},
      source:{scores:'ranking-pipeline.js',facts:'canonical-fighter-facts.js',judgments:'canonical-scoring-judgments.js'}
    };
  }
  function build(){
    const fighters=rows().map(fighterPayload).sort((a,b)=>String(a.board).localeCompare(String(b.board))||Number(a.rank)-Number(b.rank));
    const data={schemaVersion:1,version:VERSION,generatedAt:new Date().toISOString(),modelAsOf:window.UFC_CANONICAL_FIGHTER_FACTS?.modelAsOfDate||null,formula:{championship:35,opponentQuality:25,primeDominance:30,longevity:10,modifiers:['apexPeak','lossPenalty','divisionEraDepth']},fighterCount:fighters.length,fighters};
    window.OCTAGON_VERDICT_DATA=data;window.OCTAGON_VERDICT_DATA_JSON=JSON.stringify(data,null,2);window.dispatchEvent(new CustomEvent('octagon-verdict-data-ready',{detail:{version:VERSION,fighterCount:fighters.length}}));return data;
  }
  function matchup(a,b){const data=window.OCTAGON_VERDICT_DATA||build();const wanted=new Set([a,b]);return{schemaVersion:data.schemaVersion,version:data.version,generatedAt:data.generatedAt,formula:data.formula,fighters:data.fighters.filter(f=>wanted.has(f.fighter))};}
  function download(){const data=window.OCTAGON_VERDICT_DATA||build();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='octagon-verdict-data.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),0);}
  window.UFC_OCTAGON_VERDICT_DATA={version:VERSION,build,matchup,download};
  window.addEventListener?.('ufc-scoring-pipeline-ready',build);
  window.addEventListener?.('ufc-ranking-data-patches-ready',()=>{if(document.documentElement.getAttribute('data-scoring-pipeline')==='ready')build();});
  if(document.documentElement.getAttribute('data-scoring-pipeline')==='ready')build();
})();
