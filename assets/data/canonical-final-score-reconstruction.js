// Canonical final-score reconstruction audit under the locked scoring-refactor doctrine.
// Shadow-only: compares known total formulas using approved category outputs without mutating live scores, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-final-score-reconstruction-20260714b-correct-control-formula';
  const CATEGORY_MAX=30;
  const CANDIDATES=Object.freeze({
    historicalFinalEngine:Object.freeze({championship:35,opponentQuality:27.5,primeDominance:27.5,longevity:10}),
    documentedPhaseTwo:Object.freeze({championship:30,opponentQuality:24,primeDominance:30,longevity:16})
  });
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const finite=value=>Number.isFinite(Number(value));
  const round2=value=>{const rounded=Math.round((Number(value||0)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

  function weightedCategoryTotal(scores,weights){
    const weighted={
      championship:round2((scores.championship/CATEGORY_MAX)*weights.championship),
      opponentQuality:round2((scores.opponentQuality/CATEGORY_MAX)*weights.opponentQuality),
      primeDominance:round2((scores.primeDominance/CATEGORY_MAX)*weights.primeDominance),
      longevity:round2((scores.longevity/CATEGORY_MAX)*weights.longevity)
    };
    weighted.baseScore=round2(weighted.championship+weighted.opponentQuality+weighted.primeDominance+weighted.longevity);
    return weighted;
  }

  function totalFromScores(scores,weights){
    const weighted=weightedCategoryTotal(scores,weights);
    weighted.apex=round2(scores.apex);
    weighted.penalty=round2(scores.penalty);
    weighted.eraDepth=round2(scores.eraDepth);
    weighted.totalScore=round2(weighted.baseScore+weighted.apex+weighted.penalty+weighted.eraDepth);
    return weighted;
  }

  function assignRanks(rows){
    const ranked=rows.filter(row=>row.status==='complete').slice().sort((a,b)=>b.totalScore-a.totalScore||b.scores.championship-a.scores.championship||b.scores.opponentQuality-a.scores.opponentQuality||a.fighter.localeCompare(b.fighter));
    ranked.forEach((row,index)=>{row.calculatedRank=index+1;});
    return ranked;
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    const championship=window.UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION;
    const opponentQuality=window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION;
    const primeDominance=window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION;
    const longevity=window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION;
    const loss=window.UFC_CANONICAL_LOSS_CONTEXT_RECONSTRUCTION;
    const apex=window.UFC_CANONICAL_APEX_RECONSTRUCTION;
    const eraDepth=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_RECONSTRUCTION;
    const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    const prerequisites={facts,controls,championship,opponentQuality,primeDominance,longevity,loss,apex,eraDepth};
    const missingPrerequisites=Object.entries(prerequisites).filter(([,value])=>!value).map(([name])=>name);
    if(missingPrerequisites.length||!facts?.list||!controls?.entryFor){
      return {version:VERSION,applied:false,error:`Missing final-score prerequisites: ${missingPrerequisites.join(', ')}`,mutatesRankingData:false,mutatesScores:false};
    }

    const rows=facts.list().map(record=>{
      const control=controls.entryFor(record.fighter)||null;
      const categoryRows={
        championship:championship.entryFor?.(record.fighter)||null,
        opponentQuality:opponentQuality.entryFor?.(record.fighter)||null,
        primeDominance:primeDominance.entryFor?.(record.fighter)||null,
        longevity:longevity.entryFor?.(record.fighter)||null,
        apex:apex.entryFor?.(record.fighter)||null,
        loss:loss.entryFor?.(record.fighter)||null,
        eraDepth:eraDepth.entryFor?.(record.fighter)||null
      };
      const scores={
        championship:finite(categoryRows.championship?.reconstructedScore)?round2(categoryRows.championship.reconstructedScore):null,
        opponentQuality:finite(categoryRows.opponentQuality?.reconstructedScore)?round2(categoryRows.opponentQuality.reconstructedScore):null,
        primeDominance:finite(categoryRows.primeDominance?.reconstructedScore)?round2(categoryRows.primeDominance.reconstructedScore):null,
        longevity:finite(categoryRows.longevity?.reconstructedScore)?round2(categoryRows.longevity.reconstructedScore):null,
        apex:finite(categoryRows.apex?.reconstructedScore)?round2(categoryRows.apex.reconstructedScore):null,
        penalty:finite(categoryRows.loss?.reconstructedPenalty)?round2(categoryRows.loss.reconstructedPenalty):null,
        eraDepth:finite(categoryRows.eraDepth?.canonicalAdjustment)?round2(categoryRows.eraDepth.canonicalAdjustment):null
      };
      const missingInputs=Object.entries(scores).filter(([,value])=>value===null).map(([name])=>name);
      const frozenControl=control?{
        championship:round2(control.championship),opponentQuality:round2(control.opponentQuality),primeDominance:round2(control.primeDominance),longevity:round2(control.longevity),penalty:round2(control.penalty),
        apex:finite(control.apexPeak)?round2(control.apexPeak):null,eraDepth:finite(control.eraDepthAdjustment)?round2(control.eraDepthAdjustment):null,
        expectedTotalScore:finite(control.expectedTotalScore)?round2(control.expectedTotalScore):null,expectedRank:finite(control.expectedRank)?Number(control.expectedRank):null,expectedOverallOvr:finite(control.expectedOverallOvr)?Number(control.expectedOverallOvr):null
      }:null;
      const frozenInputsComplete=frozenControl&&['championship','opponentQuality','primeDominance','longevity','apex','penalty','eraDepth'].every(name=>finite(frozenControl[name]));
      const frozenWeighted=frozenInputsComplete?totalFromScores(frozenControl,CANDIDATES.historicalFinalEngine):null;
      const frozenFormula=frozenWeighted?.totalScore??null;
      const expectedTotal=frozenControl?.expectedTotalScore??null;
      const frozenFormulaDifference=frozenFormula===null||expectedTotal===null?null:round2(frozenFormula-expectedTotal);
      return {
        fighter:record.fighter,
        board:record.board,
        status:missingInputs.length?'blocked-missing-category-inputs':'complete',
        missingInputs,
        scores,
        categoryRows,
        frozenControl,
        frozenWeighted,
        frozenFormula,
        frozenFormulaDifference,
        mutatesScores:false
      };
    });

    const candidateReports={};
    for(const [candidate,weights] of Object.entries(CANDIDATES)){
      const candidateRows=rows.map(source=>{
        const row=clone(source);
        if(row.status!=='complete')return {...row,totalScore:null,weighted:null,calculatedRank:null};
        const weighted=totalFromScores(row.scores,weights);
        return {...row,weighted,totalScore:weighted.totalScore,calculatedRank:null};
      });
      const men=assignRanks(candidateRows.filter(row=>row.board==='men'));
      const women=assignRanks(candidateRows.filter(row=>row.board==='women'));
      const ranked=[...men,...women];
      const controlled=ranked.filter(row=>finite(row.frozenControl?.expectedTotalScore));
      const totalDeltas=controlled.map(row=>({fighter:row.fighter,board:row.board,currentTotal:row.frozenControl.expectedTotalScore,calculatedTotal:row.totalScore,totalDelta:round2(row.totalScore-row.frozenControl.expectedTotalScore),currentRank:row.frozenControl.expectedRank,calculatedRank:row.calculatedRank,rankMovement:finite(row.frozenControl.expectedRank)?Number(row.frozenControl.expectedRank)-row.calculatedRank:null}));
      const absoluteTotalError=totalDeltas.reduce((sum,row)=>sum+Math.abs(row.totalDelta),0);
      const rankMatches=totalDeltas.filter(row=>finite(row.currentRank)&&row.currentRank===row.calculatedRank).length;
      candidateReports[candidate]={
        weights,
        modifierFormula:'weighted four-category base + locked Apex + locked Loss Penalty + locked Division-Era Depth',
        completeFighterCount:ranked.length,
        blockedFighterCount:candidateRows.filter(row=>row.status!=='complete').length,
        meanAbsoluteTotalDelta:totalDeltas.length?round2(absoluteTotalError/totalDeltas.length):null,
        exactFrozenRankMatchCount:rankMatches,
        controlledComparisonCount:totalDeltas.length,
        menTopFifteen:men.slice(0,15).map(row=>({rank:row.calculatedRank,fighter:row.fighter,totalScore:row.totalScore,currentRank:row.frozenControl?.expectedRank??null,currentTotal:row.frozenControl?.expectedTotalScore??null,totalDelta:finite(row.frozenControl?.expectedTotalScore)?round2(row.totalScore-row.frozenControl.expectedTotalScore):null})),
        womenTopTen:women.slice(0,10).map(row=>({rank:row.calculatedRank,fighter:row.fighter,totalScore:row.totalScore,currentRank:row.frozenControl?.expectedRank??null,currentTotal:row.frozenControl?.expectedTotalScore??null,totalDelta:finite(row.frozenControl?.expectedTotalScore)?round2(row.totalScore-row.frozenControl.expectedTotalScore):null})),
        biggestRankMovers:totalDeltas.filter(row=>row.rankMovement!==0).sort((a,b)=>Math.abs(b.rankMovement)-Math.abs(a.rankMovement)||Math.abs(b.totalDelta)-Math.abs(a.totalDelta)||a.fighter.localeCompare(b.fighter)).slice(0,20),
        biggestTotalDeltas:totalDeltas.slice().sort((a,b)=>Math.abs(b.totalDelta)-Math.abs(a.totalDelta)||a.fighter.localeCompare(b.fighter)).slice(0,20),
        rows:candidateRows
      };
    }

    const frozenControlled=rows.filter(row=>row.frozenFormulaDifference!==null);
    const frozenParity=frozenControlled.filter(row=>Math.abs(row.frozenFormulaDifference)<=.02);
    const blocked=rows.filter(row=>row.status!=='complete');
    const after=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    const byKey=new Map(rows.map(row=>[key(row.fighter),row]));
    return {
      version:VERSION,
      applied:true,
      mode:'shadow-only-final-score-formula-recovery-audit',
      status:'decision-required',
      doctrine:'Preserve existing category influence weights until Cody explicitly approves the final total formula.',
      categoryMax:CATEGORY_MAX,
      candidateWeightSets:CANDIDATES,
      fighterCount:rows.length,
      completeCategoryInputCount:rows.length-blocked.length,
      blockedFighterCount:blocked.length,
      blockedFighters:blocked.map(row=>({fighter:row.fighter,missingInputs:row.missingInputs})),
      frozenFormula:'35% Championship + 27.5% Opponent Quality + 27.5% Prime Dominance + 10% Longevity, normalized from 30-point category scores, then + Apex + Loss Penalty + Division-Era Depth',
      frozenFormulaControlCount:frozenControlled.length,
      frozenFormulaParityCount:frozenParity.length,
      frozenFormulaMismatchCount:frozenControlled.length-frozenParity.length,
      candidateReports,
      rows,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      finalWeightDecisionRequired:true,
      ovrCalculationDeferred:true,
      rankingPromotionBlocked:true,
      liveDataUnchanged:before===after,
      mutatesRankingData:false,
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false
    };
  }

  const report=build();
  window.UFC_CANONICAL_FINAL_SCORE_RECONSTRUCTION=report;
  if(typeof document!=='undefined'&&document.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-canonical-final-score-reconstruction',`${VERSION}-${report.blockedFighterCount??'error'}`);
  }
})();
