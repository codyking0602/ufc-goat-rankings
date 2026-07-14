// Canonical Prime Dominance reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: uses the complete canonical UFC prime windows and does not mutate live scores.
(function(){
  'use strict';

  const VERSION='canonical-prime-dominance-reconstruction-20260714a';
  const EXCLUDED_FIGHTERS=new Set(['Leon Edwards']);
  const CATEGORY_MAX=30;
  const COMPONENT_MAX=Object.freeze({
    primeRecord:9,
    roundControl:8,
    finishPressure:5,
    competitiveSeparation:5,
    durability:3
  });
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  const FINISH_SCALE=Object.freeze([
    {min:.90,score:5},
    {min:.75,score:4.5},
    {min:.60,score:4},
    {min:.45,score:3},
    {min:.30,score:2},
    {min:.15,score:1},
    {min:0,score:.5}
  ]);

  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));
  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const scoredDisposition=new Set(['count-win','count-loss','count-draw']);
  const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;

  function phaseBounds(record){
    const fights=record?.fights||[];
    const start=fights.findIndex(fight=>fight.id===record?.primeWindow?.startFightId);
    const end=record?.primeWindow?.open?fights.length-1:fights.findIndex(fight=>fight.id===record?.primeWindow?.endFightId);
    return {start,end};
  }

  function finishPressureScore(rate){
    const normalized=clamp(rate,0,1);
    return round2((FINISH_SCALE.find(row=>normalized>=row.min)||FINISH_SCALE.at(-1)).score);
  }

  function durabilityScore(stoppageLosses,scoredFightCount){
    const exposure=Math.max(1,Number(scoredFightCount||0));
    const durabilityRate=clamp(1-(Math.max(0,Number(stoppageLosses||0))/exposure),0,1);
    return round2(durabilityRate*COMPONENT_MAX.durability);
  }

  function sampleConfidence(scoredFightCount){
    return round2(clamp(.70+(Math.max(0,Number(scoredFightCount||0))*.04),.78,1));
  }

  function dominantWin(fight){
    if(fight?.scoringDisposition!=='count-win')return false;
    if(fight?.method?.category==='dq')return false;
    if(FINISH_METHODS.has(fight?.method?.category))return true;
    const rounds=fight?.rounds;
    if(rounds?.status!=='audited')return false;
    const won=Number(rounds.won||0);
    const lost=Number(rounds.lost||0);
    const drawn=Number(rounds.drawn||0);
    const total=won+lost+drawn;
    if(!total)return false;
    const effectiveShare=(won+(drawn*.5))/total;
    return effectiveShare>=(2/3)||won-lost>=2;
  }

  function canonicalPrimeStats(record){
    const fights=record?.fights||[];
    const {start,end}=phaseBounds(record);
    const windowValid=start>=0&&end>=start;
    const primeFights=windowValid?fights.slice(start,end+1):[];
    const scored=primeFights.filter(fight=>scoredDisposition.has(fight?.scoringDisposition));
    const excludedNoContests=primeFights.filter(fight=>fight?.scoringDisposition==='excluded-no-contest');
    const excludedTechnical=primeFights.filter(fight=>fight?.scoringDisposition==='technical-exception');
    const wins=scored.filter(fight=>fight.scoringDisposition==='count-win');
    const losses=scored.filter(fight=>fight.scoringDisposition==='count-loss');
    const draws=scored.filter(fight=>fight.scoringDisposition==='count-draw');
    const scoredFightCount=scored.length;
    const recordPct=scoredFightCount?(wins.length+(draws.length*.5))/scoredFightCount:0;

    const roundTotals=scored.reduce((totals,fight)=>{
      if(fight?.rounds?.status!=='audited'){
        totals.missing.push({fightId:fight?.id||null,opponent:fight?.opponent||null});
        return totals;
      }
      totals.won+=Number(fight.rounds.won||0);
      totals.lost+=Number(fight.rounds.lost||0);
      totals.drawn+=Number(fight.rounds.drawn||0);
      return totals;
    },{won:0,lost:0,drawn:0,missing:[]});
    const roundsCounted=roundTotals.won+roundTotals.lost+roundTotals.drawn;
    const effectiveRoundsWon=roundTotals.won+(roundTotals.drawn*.5);
    const roundControlPct=roundsCounted?effectiveRoundsWon/roundsCounted:0;

    const finishWins=wins.filter(fight=>FINISH_METHODS.has(fight?.method?.category)).length;
    const stoppageLosses=losses.filter(fight=>FINISH_METHODS.has(fight?.method?.category)).length;
    const finishPressureRate=scoredFightCount?finishWins/scoredFightCount:0;
    const dominantWins=wins.filter(dominantWin).length;
    const separationRate=scoredFightCount?dominantWins/scoredFightCount:0;

    const components={
      primeRecord:round2(recordPct*COMPONENT_MAX.primeRecord),
      roundControl:round2(roundControlPct*COMPONENT_MAX.roundControl),
      finishPressure:finishPressureScore(finishPressureRate),
      competitiveSeparation:round2(separationRate*COMPONENT_MAX.competitiveSeparation),
      durability:durabilityScore(stoppageLosses,scoredFightCount)
    };
    const rawScore=round2(clamp(Object.values(components).reduce((sum,value)=>sum+Number(value||0),0),0,CATEGORY_MAX));
    const confidence=sampleConfidence(scoredFightCount);
    const score=round2(clamp(rawScore*confidence,0,CATEGORY_MAX));

    return {
      windowValid,
      startFightId:record?.primeWindow?.startFightId||null,
      endFightId:record?.primeWindow?.open?null:(record?.primeWindow?.endFightId||null),
      open:Boolean(record?.primeWindow?.open),
      reviewStatus:record?.primeWindow?.reviewStatus||null,
      primeFightCount:primeFights.length,
      scoredFightCount,
      wins:wins.length,
      losses:losses.length,
      draws:draws.length,
      noContests:excludedNoContests.length,
      technicalExceptions:excludedTechnical.length,
      recordText:`${wins.length}-${losses.length}${draws.length?`-${draws.length}`:''}${excludedNoContests.length?`, ${excludedNoContests.length} NC`:''}`,
      recordPct:round2(recordPct*100),
      roundsWon:round2(roundTotals.won),
      roundsLost:round2(roundTotals.lost),
      roundsDrawn:round2(roundTotals.drawn),
      effectiveRoundsWon:round2(effectiveRoundsWon),
      roundsCounted:round2(roundsCounted),
      roundControlPct:round2(roundControlPct*100),
      missingRoundRows:roundTotals.missing,
      finishWins,
      finishPressurePct:round2(finishPressureRate*100),
      stoppageLosses,
      dominantWins,
      separationPct:round2(separationRate*100),
      components,
      rawScore,
      sampleConfidence:confidence,
      score,
      primeFights:primeFights.map(fight=>({
        fightId:fight.id,
        date:fight.date,
        opponent:fight.opponent,
        result:fight.scoringDisposition,
        method:fight?.method?.category||null,
        rounds:fight?.rounds?.status==='audited'?{
          won:Number(fight.rounds.won||0),
          lost:Number(fight.rounds.lost||0),
          drawn:Number(fight.rounds.drawn||0)
        }:null,
        dominantWin:dominantWin(fight)
      }))
    };
  }

  function snapshotScoreFor(fighter){
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    const control=controls?.entryFor?.(fighter);
    if(control&&Number.isFinite(Number(control.primeDominance)))return round2(control.primeDominance);
    const rows=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[]),...(window.RANKING_DATA?.fighters||[])];
    const row=rows.find(candidate=>clean(candidate?.fighter)===clean(fighter));
    return Number.isFinite(Number(row?.primeDominance))?round2(row.primeDominance):null;
  }

  function oldEntryMap(){
    const rows=window.UFC_PRIME_DOMINANCE_LEDGERS?.report||window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report||[];
    return new Map(rows.map(row=>[clean(row.fighter),row]));
  }

  function legacyCanonicalScore(stats,legacy){
    if(!legacy)return null;
    const elite=Number(legacy.eliteStakesScore);
    if(!Number.isFinite(elite))return null;
    return round2(clamp(
      stats.components.primeRecord+
      stats.components.roundControl+
      stats.components.finishPressure+
      elite,
      0,CATEGORY_MAX
    ));
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    if(!facts||facts.count?.()!==73||!controls){
      return {version:VERSION,applied:false,error:'Canonical Prime Dominance prerequisites are incomplete.',mutatesRankingData:false};
    }
    const oldEntries=oldEntryMap();
    const fighters=facts.list().filter(record=>!EXCLUDED_FIGHTERS.has(record.fighter)).map(record=>{
      const stats=canonicalPrimeStats(record);
      const currentScore=snapshotScoreFor(record.fighter);
      const legacy=oldEntries.get(clean(record.fighter))||null;
      const legacyCanonical=legacyCanonicalScore(stats,legacy);
      const difference=Number.isFinite(currentScore)?round2(stats.score-currentScore):null;
      const legacyDifference=Number.isFinite(currentScore)&&Number.isFinite(legacyCanonical)?round2(legacyCanonical-currentScore):null;
      const issues=[];

      if(!stats.windowValid)issues.push({classification:'factual correction',reason:'Canonical prime window could not be resolved to fight IDs.'});
      stats.missingRoundRows.forEach(row=>issues.push({classification:'factual correction',reason:`Prime round audit is missing for ${row.opponent||row.fightId}.`}));
      if(!legacy)issues.push({classification:'recovered judgment',reason:'No direct legacy Prime Dominance component ledger exists; the frozen category score is retained only as the comparison control.'});
      if(legacy&&Number.isFinite(legacyDifference)&&Math.abs(legacyDifference)>.01){
        issues.push({classification:'factual correction',reason:`Canonical prime record/round/finish inputs reproduce ${legacyCanonical.toFixed(2)}/30 under the former elite-stakes component versus the frozen ${currentScore.toFixed(2)}/30 control (${legacyDifference>0?'+':''}${legacyDifference.toFixed(2)}).`});
      }
      if(Number.isFinite(difference)&&Math.abs(difference)>.01){
        issues.push({
          classification:'cody-approved-model-change',
          reason:`The approved clean Prime Dominance formula calculates ${stats.score.toFixed(2)}/30 versus the frozen ${currentScore.toFixed(2)}/30 control (${difference>0?'+':''}${difference.toFixed(2)}). The former 8-point elite-stakes block is removed to avoid Championship, Opponent Quality, and Division-Era Depth double counting; competitive separation and durability replace it.`
        });
      }

      return {
        fighter:record.fighter,
        board:record.board,
        currentScore,
        reconstructedScore:stats.score,
        difference,
        legacyCanonicalScore:legacyCanonical,
        legacyDifference,
        classification:'cody-approved-model-change',
        currentControlSource:'canonical-scoring-records',
        legacyJudgmentSource:legacy?'prime-dominance-ledgers + prime-dominance-shadow-model':'frozen score only',
        removedLegacyEliteStakes:legacy?{
          rawScore:Number(legacy.eliteStakesRawScore||0),
          weightedScore:Number(legacy.eliteStakesScore||0),
          breakdown:legacy.eliteStakesBreakdown||null
        }:null,
        stats,
        issues
      };
    }).sort((a,b)=>Number(b.reconstructedScore||0)-Number(a.reconstructedScore||0)||a.fighter.localeCompare(b.fighter));

    const after=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    const byKey=new Map(fighters.map(row=>[clean(row.fighter),row]));
    const exact=fighters.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)<=.01);
    const meaningful=fighters.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)>=.25);
    const report={
      version:VERSION,
      status:'shadow-reconstruction-cody-approved-clean-formula',
      applied:true,
      mode:'diagnostic-only-no-live-promotion',
      fighterCount:fighters.length,
      controlCoverage:fighters.filter(row=>Number.isFinite(row.currentScore)).length,
      excludedFighters:Array.from(EXCLUDED_FIGHTERS),
      primeWindowCoverage:fighters.filter(row=>row.stats.windowValid).length,
      scoredPrimeFightCount:fighters.reduce((sum,row)=>sum+row.stats.scoredFightCount,0),
      primeRoundRowCount:fighters.reduce((sum,row)=>sum+row.stats.primeFights.filter(fight=>fight.result==='count-win'||fight.result==='count-loss'||fight.result==='count-draw').length,0),
      missingPrimeRoundRowCount:fighters.reduce((sum,row)=>sum+row.stats.missingRoundRows.length,0),
      exactFrozenControlParityCount:exact.length,
      meaningfulDeltaCount:meaningful.length,
      legacyComponentCoverage:fighters.filter(row=>row.removedLegacyEliteStakes).length,
      legacyComponentMissingCount:fighters.filter(row=>!row.removedLegacyEliteStakes).length,
      issueFighterCount:fighters.filter(row=>row.issues.length).length,
      issueCount:fighters.reduce((sum,row)=>sum+row.issues.length,0),
      componentMaxima:COMPONENT_MAX,
      categoryMax:CATEGORY_MAX,
      formula:'[Prime Record (9) + Round Control (8) + Finish Pressure (5) + Competitive Separation (5) + Durability (3)] × prime-sample confidence',
      methodology:{
        primeRecord:'(prime wins + 0.5 × prime draws) ÷ scored prime fights × 9',
        roundControl:'(rounds won + 0.5 × drawn rounds) ÷ audited counted prime rounds × 8',
        finishPressure:'tiered finish wins ÷ scored prime fights, worth 0.5–5 points',
        competitiveSeparation:'dominant prime wins ÷ scored prime fights × 5; a dominant win is a finish or a clear audited decision, while DQ wins do not qualify',
        durability:'share of scored prime fights without a stoppage loss × 3',
        sampleConfidence:'0.70 + 0.04 × scored prime fights, floored at 0.78 and capped at 1.00; full confidence begins at eight fights'
      },
      excludedInputs:['opponent-quality tier','top-five win count','champion-name count','title-fight volume','division-strength multiplier','fighter-level hidden adjustment'],
      noContestsExcluded:true,
      technicalExceptionsExcluded:true,
      liveDataUnchanged:before===after,
      mutatesRankingData:false,
      fighters,
      entryFor:fighter=>byKey.get(clean(fighter))||null,
      calculatePrimeDominance:canonicalPrimeStats
    };
    window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION=report;
    document.documentElement.setAttribute('data-canonical-prime-dominance-reconstruction',VERSION);
    return report;
  }

  const report=build();
  if(!report?.applied)window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION=report;
})();
