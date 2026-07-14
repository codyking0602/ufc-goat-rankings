// Canonical Prime Dominance reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: the shared Fighter Era Ledger owns every prime boundary; this file never mutates live scores.
(function(){
  'use strict';

  const VERSION='canonical-prime-dominance-reconstruction-20260714c-full-score-sample-lock';
  const EXCLUDED_FIGHTERS=new Set(['Leon Edwards']);
  const CATEGORY_MAX=30;
  const COMPONENT_MAX=Object.freeze({
    primeRecord:9,
    roundControl:9,
    finishPressure:5,
    eliteLevelValidation:7
  });
  const ELITE_VALIDATION_MAX=Object.freeze({
    volume:3,
    performance:4,
    result:2,
    roundControl:1.5,
    finishPressure:.5
  });
  const ELITE_VOLUME_FULL_SAMPLE=8;
  const PRIME_SAMPLE_MIN=.70;
  const PRIME_SAMPLE_STEP=.05;
  const PRIME_SAMPLE_FULL_FIGHTS=7;
  const ELITE_QUALITY_TIERS=new Set(['champion-level','top-five']);
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

  function eraEntryFor(fighter){
    const source=window.UFC_FIGHTER_ERA_LEDGERS;
    if(!source)return null;
    const direct=source.entryFor?.(fighter);
    if(direct)return direct;
    const matched=source.names?.().find(name=>clean(name)===clean(fighter));
    return matched?source.entryFor?.(matched)||null:null;
  }

  function nearestDateIndex(fights,date){
    if(!date)return -1;
    const target=Date.parse(`${date}T00:00:00Z`);
    if(!Number.isFinite(target))return -1;
    let best={index:-1,distance:Infinity};
    fights.forEach((fight,index)=>{
      const value=Date.parse(`${fight?.date||''}T00:00:00Z`);
      if(!Number.isFinite(value))return;
      const distance=Math.abs(value-target);
      if(distance<best.distance)best={index,distance};
    });
    return best.distance<=86400000?best.index:-1;
  }

  function labelCandidates(label){
    const text=String(label||'').replace(/\([^)]*\)/g,' ').trim();
    if(!text)return [];
    return text.split('/').map(part=>clean(part)
      .replace(/\b(current|championship|champion|title|run|form|elite|level|active|retirement|retired)\b/g,' ')
      .replace(/\b(i|ii|iii|iv|v)\b$/,' ')
      .replace(/\s+/g,' ')
      .trim()).filter(Boolean);
  }

  function labelIndex(fights,label,preferLast=false){
    const candidates=labelCandidates(label);
    if(!candidates.length)return -1;
    const matches=[];
    fights.forEach((fight,index)=>{
      const opponent=clean(fight?.opponent);
      if(candidates.some(candidate=>opponent===candidate||opponent.includes(candidate)||candidate.includes(opponent)))matches.push(index);
    });
    if(!matches.length)return -1;
    return preferLast?matches.at(-1):matches[0];
  }

  function phaseBounds(record){
    const fights=record?.fights||[];
    const era=eraEntryFor(record?.fighter);
    if(!era?.window)return {start:-1,end:-1,era:null};
    const startDate=era.window.start||null;
    const endDate=era.window.end||null;
    let start=fights.findIndex(fight=>fight?.date===startDate);
    if(start<0)start=nearestDateIndex(fights,startDate);
    if(start<0)start=labelIndex(fights,era.window.startLabel,false);
    let end;
    if(!endDate)end=fights.length-1;
    else{
      end=fights.findIndex(fight=>fight?.date===endDate);
      if(end<0)end=nearestDateIndex(fights,endDate);
      if(end<0)end=labelIndex(fights,era.window.endLabel,true);
    }
    return {start,end,era};
  }

  function finishPressureScore(rate){
    const normalized=clamp(rate,0,1);
    return round2((FINISH_SCALE.find(row=>normalized>=row.min)||FINISH_SCALE.at(-1)).score);
  }

  function primeSampleMultiplier(scoredFightCount){
    const fights=Math.max(0,Number(scoredFightCount||0));
    if(!fights)return 0;
    return round2(clamp(PRIME_SAMPLE_MIN+((fights-1)*PRIME_SAMPLE_STEP),PRIME_SAMPLE_MIN,1));
  }

  function isEliteStageFight(fight){
    const titleType=fight?.championshipContext?.type||'none';
    const qualityTier=fight?.opponentContext?.qualityTier||'none';
    return titleType!=='none'||ELITE_QUALITY_TIERS.has(qualityTier);
  }

  function roundTotalsFor(fights){
    return fights.reduce((totals,fight)=>{
      if(fight?.rounds?.status!=='audited'){
        totals.missing.push({fightId:fight?.id||null,opponent:fight?.opponent||null});
        return totals;
      }
      totals.won+=Number(fight.rounds.won||0);
      totals.lost+=Number(fight.rounds.lost||0);
      totals.drawn+=Number(fight.rounds.drawn||0);
      return totals;
    },{won:0,lost:0,drawn:0,missing:[]});
  }

  function roundControlRate(totals){
    const counted=Number(totals?.won||0)+Number(totals?.lost||0)+Number(totals?.drawn||0);
    return counted?(Number(totals?.won||0)+(Number(totals?.drawn||0)*.5))/counted:0;
  }

  function eliteValidation(scoredPrimeFights){
    const fights=scoredPrimeFights.filter(isEliteStageFight);
    const wins=fights.filter(fight=>fight.scoringDisposition==='count-win');
    const draws=fights.filter(fight=>fight.scoringDisposition==='count-draw');
    const count=fights.length;
    const resultRate=count?(wins.length+(draws.length*.5))/count:0;
    const rounds=roundTotalsFor(fights);
    const roundRate=roundControlRate(rounds);
    const finishWins=wins.filter(fight=>FINISH_METHODS.has(fight?.method?.category)).length;
    const finishRate=count?finishWins/count:0;
    const volume=round2(clamp((count/ELITE_VOLUME_FULL_SAMPLE)*ELITE_VALIDATION_MAX.volume,0,ELITE_VALIDATION_MAX.volume));
    const resultScore=round2(resultRate*ELITE_VALIDATION_MAX.result);
    const roundScore=round2(roundRate*ELITE_VALIDATION_MAX.roundControl);
    const finishScore=round2(finishRate*ELITE_VALIDATION_MAX.finishPressure);
    const performance=round2(clamp(resultScore+roundScore+finishScore,0,ELITE_VALIDATION_MAX.performance));
    const score=round2(clamp(volume+performance,0,COMPONENT_MAX.eliteLevelValidation));
    return {
      fightCount:count,
      wins:wins.length,
      losses:fights.filter(fight=>fight.scoringDisposition==='count-loss').length,
      draws:draws.length,
      resultRate:round2(resultRate*100),
      roundsWon:round2(rounds.won),
      roundsLost:round2(rounds.lost),
      roundsDrawn:round2(rounds.drawn),
      roundControlRate:round2(roundRate*100),
      finishWins,
      finishRate:round2(finishRate*100),
      missingRoundRows:rounds.missing,
      volumeScore:volume,
      performanceScore:performance,
      performanceBreakdown:{result:resultScore,roundControl:roundScore,finishPressure:finishScore},
      score,
      fights:fights.map(fight=>({
        fightId:fight.id,
        date:fight.date,
        opponent:fight.opponent,
        result:fight.scoringDisposition,
        qualityTier:fight?.opponentContext?.qualityTier||null,
        championshipType:fight?.championshipContext?.type||'none'
      }))
    };
  }

  function canonicalFactWindow(record){
    const fights=record?.fights||[];
    const start=fights.find(fight=>fight.id===record?.primeWindow?.startFightId)||null;
    const end=record?.primeWindow?.open?null:(fights.find(fight=>fight.id===record?.primeWindow?.endFightId)||null);
    return {
      startFightId:record?.primeWindow?.startFightId||null,
      endFightId:record?.primeWindow?.open?null:(record?.primeWindow?.endFightId||null),
      open:Boolean(record?.primeWindow?.open),
      startDate:start?.date||null,
      endDate:end?.date||null
    };
  }

  function canonicalPrimeStats(record){
    const fights=record?.fights||[];
    const {start,end,era}=phaseBounds(record);
    const windowValid=Boolean(era)&&start>=0&&end>=start;
    const primeFights=windowValid?fights.slice(start,end+1):[];
    const scored=primeFights.filter(fight=>scoredDisposition.has(fight?.scoringDisposition));
    const excludedNoContests=primeFights.filter(fight=>fight?.scoringDisposition==='excluded-no-contest');
    const excludedTechnical=primeFights.filter(fight=>fight?.scoringDisposition==='technical-exception');
    const wins=scored.filter(fight=>fight.scoringDisposition==='count-win');
    const losses=scored.filter(fight=>fight.scoringDisposition==='count-loss');
    const draws=scored.filter(fight=>fight.scoringDisposition==='count-draw');
    const scoredFightCount=scored.length;
    const recordPct=scoredFightCount?(wins.length+(draws.length*.5))/scoredFightCount:0;

    const roundTotals=roundTotalsFor(scored);
    const roundsCounted=roundTotals.won+roundTotals.lost+roundTotals.drawn;
    const effectiveRoundsWon=roundTotals.won+(roundTotals.drawn*.5);
    const roundControlPct=roundControlRate(roundTotals);

    const finishWins=wins.filter(fight=>FINISH_METHODS.has(fight?.method?.category)).length;
    const stoppageLosses=losses.filter(fight=>FINISH_METHODS.has(fight?.method?.category)).length;
    const finishPressureRate=scoredFightCount?finishWins/scoredFightCount:0;
    const elite=eliteValidation(scored);

    const components={
      primeRecord:round2(recordPct*COMPONENT_MAX.primeRecord),
      roundControl:round2(roundControlPct*COMPONENT_MAX.roundControl),
      finishPressure:finishPressureScore(finishPressureRate),
      eliteLevelValidation:elite.score
    };
    const rawScore=round2(clamp(Object.values(components).reduce((sum,value)=>sum+Number(value||0),0),0,CATEGORY_MAX));
    const sampleMultiplier=primeSampleMultiplier(scoredFightCount);
    const score=round2(clamp(rawScore*sampleMultiplier,0,CATEGORY_MAX));
    const factWindow=canonicalFactWindow(record);
    const eraOpen=!era?.window?.end;
    const eraDrift=Boolean(era)&&(
      factWindow.startDate!==era.window.start||
      factWindow.endDate!==(era.window.end||null)||
      factWindow.open!==eraOpen
    );

    return {
      windowValid,
      windowSource:'fighter-era-ledgers',
      eraLedgerVersion:window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
      eraLedgerStatus:era?.status||null,
      eraStartDate:era?.window?.start||null,
      eraStartLabel:era?.window?.startLabel||null,
      eraEndDate:era?.window?.end||null,
      eraEndLabel:era?.window?.endLabel||null,
      eraEndType:era?.window?.endType||null,
      open:eraOpen,
      canonicalFactWindow:factWindow,
      eraLedgerDrift:eraDrift,
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
      eliteLevelValidation:elite,
      components,
      rawScore,
      sampleMultiplier,
      samplePercent:round2(sampleMultiplier*100),
      score,
      primeFights:primeFights.map(fight=>({
        fightId:fight.id,
        date:fight.date,
        opponent:fight.opponent,
        result:fight.scoringDisposition,
        method:fight?.method?.category||null,
        qualityTier:fight?.opponentContext?.qualityTier||null,
        championshipType:fight?.championshipContext?.type||'none',
        eliteStage:isEliteStageFight(fight),
        rounds:fight?.rounds?.status==='audited'?{
          won:Number(fight.rounds.won||0),
          lost:Number(fight.rounds.lost||0),
          drawn:Number(fight.rounds.drawn||0)
        }:null
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
      (stats.recordPct/100*9)+
      (stats.roundControlPct/100*8)+
      stats.components.finishPressure+
      elite,
      0,CATEGORY_MAX
    ));
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    const eras=window.UFC_FIGHTER_ERA_LEDGERS;
    if(!facts||facts.count?.()!==73||!controls||!eras){
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

      if(!stats.windowValid)issues.push({classification:'factual correction',reason:'Shared Fighter Era Ledger window could not be resolved to the canonical fight ledger.'});
      if(stats.eraLedgerDrift)issues.push({classification:'factual correction',reason:'The fighter-local canonical prime window differs from the shared Fighter Era Ledger. The shared ledger controls this reconstruction.'});
      stats.missingRoundRows.forEach(row=>issues.push({classification:'factual correction',reason:`Prime round audit is missing for ${row.opponent||row.fightId}.`}));
      stats.eliteLevelValidation.missingRoundRows.forEach(row=>issues.push({classification:'factual correction',reason:`Elite-stage round audit is missing for ${row.opponent||row.fightId}.`}));
      if(!legacy)issues.push({classification:'recovered judgment',reason:'No direct legacy Prime Dominance component ledger exists; the frozen category score is retained only as the comparison control.'});
      if(legacy&&Number.isFinite(legacyDifference)&&Math.abs(legacyDifference)>.01){
        issues.push({classification:'factual correction',reason:`Shared-era inputs reproduce ${legacyCanonical.toFixed(2)}/30 under the former 8-point elite-stakes formula versus the frozen ${currentScore.toFixed(2)}/30 control (${legacyDifference>0?'+':''}${legacyDifference.toFixed(2)}).`});
      }
      if(Number.isFinite(difference)&&Math.abs(difference)>.01){
        issues.push({
          classification:'Cody-approved model change; shadow only',
          reason:`The approved 9/9/5/7 Prime Dominance formula produces a ${stats.rawScore.toFixed(2)}/30 raw score, then applies the locked ${stats.samplePercent.toFixed(0)}% prime-sample multiplier for ${stats.scoredFightCount} counted prime fights, resulting in ${stats.score.toFixed(2)}/30 versus the frozen ${currentScore.toFixed(2)}/30 control (${difference>0?'+':''}${difference.toFixed(2)}).`
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
        classification:'Cody-approved model formula and sample lock; shadow only',
        currentControlSource:'canonical-scoring-records',
        primeWindowSource:'fighter-era-ledgers',
        legacyJudgmentSource:legacy?'prime-dominance-ledgers + prime-dominance-shadow-model':'frozen score only',
        formerLegacyEliteStakes:legacy?{
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
      status:'shadow-reconstruction-cody-approved-formula-and-sample-lock-not-live',
      applied:true,
      mode:'diagnostic-only-no-live-promotion',
      fighterCount:fighters.length,
      controlCoverage:fighters.filter(row=>Number.isFinite(row.currentScore)).length,
      excludedFighters:Array.from(EXCLUDED_FIGHTERS),
      primeWindowSource:'fighter-era-ledgers',
      eraLedgerVersion:eras.version||null,
      eraLedgerCoverage:fighters.filter(row=>row.stats.windowValid).length,
      eraLedgerDriftCount:fighters.filter(row=>row.stats.eraLedgerDrift).length,
      scoredPrimeFightCount:fighters.reduce((sum,row)=>sum+row.stats.scoredFightCount,0),
      primeRoundRowCount:fighters.reduce((sum,row)=>sum+row.stats.primeFights.filter(fight=>fight.result==='count-win'||fight.result==='count-loss'||fight.result==='count-draw').length,0),
      missingPrimeRoundRowCount:fighters.reduce((sum,row)=>sum+row.stats.missingRoundRows.length,0),
      eliteStageFightCount:fighters.reduce((sum,row)=>sum+row.stats.eliteLevelValidation.fightCount,0),
      missingEliteStageRoundRowCount:fighters.reduce((sum,row)=>sum+row.stats.eliteLevelValidation.missingRoundRows.length,0),
      exactFrozenControlParityCount:exact.length,
      meaningfulDeltaCount:meaningful.length,
      legacyComponentCoverage:fighters.filter(row=>row.formerLegacyEliteStakes).length,
      legacyComponentMissingCount:fighters.filter(row=>!row.formerLegacyEliteStakes).length,
      issueFighterCount:fighters.filter(row=>row.issues.length).length,
      issueCount:fighters.reduce((sum,row)=>sum+row.issues.length,0),
      componentMaxima:COMPONENT_MAX,
      eliteValidationMaxima:ELITE_VALIDATION_MAX,
      primeSampleRule:{minimum:PRIME_SAMPLE_MIN,stepPerFight:PRIME_SAMPLE_STEP,fullAtFights:PRIME_SAMPLE_FULL_FIGHTS},
      sampleDiscountedFighterCount:fighters.filter(row=>row.stats.sampleMultiplier<1).length,
      categoryMax:CATEGORY_MAX,
      formula:'[Prime Record (9) + Round Control (9) + Finish Pressure (5) + Elite-Level Validation (7)] × Prime Sample Percentage',
      methodology:{
        primeRecord:'(prime wins + 0.5 × prime draws) ÷ scored prime fights × 9',
        roundControl:'(rounds won + 0.5 × drawn rounds) ÷ audited counted prime rounds × 9',
        finishPressure:'tiered finish wins ÷ scored prime fights, worth 0.5–5 points',
        eliteStageDefinition:'A counted prime fight is elite-stage when it is a UFC title fight or the opponent is already tagged champion-level/Top-5 in the canonical opponent ledger.',
        eliteStageVolume:'elite-stage counted prime fights ÷ 8 × 3, capped at 3; result-neutral so elite losses still add validation',
        eliteStagePerformance:'up to 4 points: elite result rate × 2, elite round-control rate × 1.5, elite finish rate × 0.5',
        primeSamplePercentage:'70% at one counted prime fight, plus 5 percentage points per additional counted prime fight, capped at 100% from seven fights onward; applied to the full 30-point raw score',
        primeWindow:'Fighter Era Ledger start/end dates are the sole phase source. Fighter-local category windows are audit comparisons only.'
      },
      controlledOverlap:'Elite-Level Validation uses existing title and opponent-tier tags only to identify the level of the test. Championship and Opponent Quality still own accomplishment and win-quality resume credit.',
      excludedInputs:['subjective competitive-separation tags','durability bonus','division-strength multiplier','fighter-level hidden adjustment'],
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
