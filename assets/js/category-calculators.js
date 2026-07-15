// Permanent production-facing API for the seven approved UFC GOAT category calculators.
// No frozen category totals, total scores, ranks, OVRs, or migration reconstruction reports are read here.
(function(){
  'use strict';

  const VERSION='category-calculators-20260714c-seven-direct-calculators';
  const EXPECTED_FIGHTERS=73;
  const CATEGORY_MAX=30;
  const OQ_RETURNS=Object.freeze([[1,6,1],[7,12,.75],[13,18,.50],[19,999,.25]]);
  const LOSS_RULES=Object.freeze({
    prePrimeElite:-.75,prePrimeNonElite:-1.25,primeElite:-1.5,primeNonElite:-4,
    finishedExtra:-.75,postPrime:0,primeUpwardElite:-.75,finishedUpwardEliteExtra:-.50,
    severityLossCount:2,severityMax:3.5,frequencyMax:2.5,frequencyScale:3,
    primeLossFloorPerLoss:.75,primeFinishFloorExtra:.25,primeVolumeFloorMax:5.25,
    totalMax:6,divisionDiscountScale:1.5,divisionDiscountMax:.15,divisionDiscountFloor:1
  });
  const PRIME_COMPONENT_MAX=Object.freeze({primeRecord:9,roundControl:9,finishPressure:5,eliteLevelValidation:7});
  const ELITE_VALIDATION_MAX=Object.freeze({volume:3,performance:4,result:2,roundControl:1.5,finishPressure:.5});
  const ELITE_VOLUME_FULL_SAMPLE=8;
  const PRIME_SAMPLE_MIN=.70;
  const PRIME_SAMPLE_STEP=.05;
  const ELITE_DENSITY_MIN_SAMPLES=4;
  const ELITE_DENSITY_SAMPLE_FLOOR=.90;
  const FINISH_SCALE=Object.freeze([{min:.90,score:5},{min:.75,score:4.5},{min:.60,score:4},{min:.45,score:3},{min:.30,score:2},{min:.15,score:1},{min:0,score:.5}]);
  const LONGEVITY_FULL_CREDIT_MONTHS=144;
  const LONGEVITY_GAP_CAP_MONTHS=18;
  const DAYS_PER_MONTH=365.25/12;
  const ELITE_TIERS=new Set(['champion-level','top-five']);
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  const SCORED_DISPOSITIONS=new Set(['count-win','count-loss','count-draw']);

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[“”\"]/g,'').replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const round1=value=>Math.round((Number(value||0)+Number.EPSILON)*10)/10;
  const round2=value=>{const rounded=Math.round((Number(value||0)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};
  const round6=value=>Math.round((Number(value||0)+Number.EPSILON)*1_000_000)/1_000_000;
  const finite=value=>Number.isFinite(Number(value));
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''))&&!Number.isNaN(Date.parse(`${value}T00:00:00Z`));

  function facts(){return window.UFC_CANONICAL_FIGHTER_FACTS||null;}
  function judgments(){return window.UFC_CANONICAL_SCORING_JUDGMENTS||null;}
  function recordFor(fighter){return facts()?.get?.(fighter)||facts()?.list?.().find(record=>key(record.fighter)===key(fighter))||null;}
  function judgmentFor(category,fighter){return judgments()?.entryFor?.(category,fighter)||null;}
  function eraLedgerFor(fighter){
    const source=window.UFC_FIGHTER_ERA_LEDGERS;
    if(!source)return null;
    const direct=source.entryFor?.(fighter);
    if(direct)return direct;
    const name=source.names?.().find(candidate=>key(candidate)===key(fighter));
    return name?source.entryFor?.(name)||null:null;
  }

  function calculateChampionship(fighter){
    const judgment=judgmentFor('championship',fighter);
    if(!judgment||!Array.isArray(judgment.inputs)||!finite(judgment.benchmarkCredit))return null;
    if(judgment.inputs.some(row=>row?.finalAdjustedCredit===null||row?.finalAdjustedCredit===undefined))return null;
    const adjustedTitleCredit=judgment.inputs.reduce((sum,row)=>sum+Number(row.finalAdjustedCredit||0),0);
    const reconstructedScore=round2(clamp((adjustedTitleCredit/Number(judgment.benchmarkCredit||1))*CATEGORY_MAX,0,CATEGORY_MAX));
    return {fighter,reconstructedScore,adjustedTitleCredit:round6(adjustedTitleCredit),benchmarkCredit:Number(judgment.benchmarkCredit),inputs:clone(judgment.inputs),source:'canonical-scoring-judgments'};
  }

  function oqRate(slot){return OQ_RETURNS.find(([from,to])=>slot>=from&&slot<=to)?.[2]??.25;}
  function calculateOpponentQuality(fighter){
    const judgment=judgmentFor('opponentQuality',fighter);
    if(!judgment||!Array.isArray(judgment.inputs)||!finite(judgment.benchmarkCredit))return null;
    const inputs=clone(judgment.inputs).sort((a,b)=>Number(b.finalCredit||0)-Number(a.finalCredit||0)||String(a.date||'').localeCompare(String(b.date||''))||String(a.opponent||'').localeCompare(String(b.opponent||''))).map((row,index)=>{
      const slot=index+1;
      const countedRate=oqRate(slot);
      return {...row,slot,countedRate:round6(countedRate),countedCredit:round6(Number(row.finalCredit||0)*countedRate)};
    });
    const rawCredit=inputs.reduce((sum,row)=>sum+Number(row.finalCredit||0),0);
    const preAdjustmentDiminishedCredit=inputs.reduce((sum,row)=>sum+Number(row.countedCredit||0),0);
    const fighterAdjustment=Number(judgment.fighterAdjustment||0);
    const diminishedCredit=Math.max(0,preAdjustmentDiminishedCredit+fighterAdjustment);
    const reconstructedScore=round2(clamp((diminishedCredit/Number(judgment.benchmarkCredit||1))*CATEGORY_MAX,0,CATEGORY_MAX));
    return {fighter,reconstructedScore,rawCredit:round6(rawCredit),preAdjustmentDiminishedCredit:round6(preAdjustmentDiminishedCredit),fighterAdjustment:round6(fighterAdjustment),diminishedCredit:round6(diminishedCredit),benchmarkCredit:Number(judgment.benchmarkCredit),inputs,source:'canonical-scoring-judgments'};
  }

  function calculateApex(fighter){
    const judgment=judgmentFor('apex',fighter);
    if(!judgment||!Array.isArray(judgment.performances)||judgment.performances.length!==2)return null;
    const record=recordFor(fighter);
    const fightIds=new Set((record?.fights||[]).filter(fight=>fight?.officialResult==='win'&&fight?.scoringDisposition==='count-win').map(fight=>fight.id));
    const invalidPerformances=judgment.performances.filter(performance=>!performance.fightId||!fightIds.has(performance.fightId)||!finite(performance.rating));
    if(invalidPerformances.length)return null;
    const components=judgment.components||{};
    const componentNames=['twoPerformanceStrength','proof','bestFighterClaim','aura'];
    if(componentNames.some(name=>!finite(components[name])))return null;
    const ratingsAverage=judgment.performances.reduce((sum,row)=>sum+Number(row.rating),0)/2;
    const formulaTwoPerformanceStrength=round2((ratingsAverage/10)*2);
    const reconstructedScore=round2(clamp(componentNames.reduce((sum,name)=>sum+Number(components[name]),0),0,6));
    return {fighter,reconstructedScore,performances:clone(judgment.performances),components:clone(components),ratingsAverage:round2(ratingsAverage),formulaTwoPerformanceStrength,twoPerformanceDifference:round2(Number(components.twoPerformanceStrength)-formulaTwoPerformanceStrength),notes:judgment.notes||null,source:'canonical-scoring-judgments'};
  }

  function nearestDateIndex(fights,date){
    if(!validDate(date))return-1;
    const target=Date.parse(`${date}T00:00:00Z`);
    let best={index:-1,distance:Infinity};
    fights.forEach((fight,index)=>{
      if(!validDate(fight?.date))return;
      const distance=Math.abs(Date.parse(`${fight.date}T00:00:00Z`)-target);
      if(distance<best.distance)best={index,distance};
    });
    return best.distance<=86400000?best.index:-1;
  }

  function labelCandidates(label,includeThrough=false){
    const text=String(label||'').replace(/\([^)]*\)/g,' ').trim();
    if(!text)return[];
    const words=includeThrough?'current|championship|champion|title|run|form|elite|level|active|retirement|retired|through':'current|championship|champion|title|run|form|elite|level|active|retirement|retired';
    const pattern=new RegExp(`\\b(${words})\\b`,'g');
    return text.split('/').map(part=>key(part).replace(pattern,' ').replace(/\b(i|ii|iii|iv|v)\b$/,' ').replace(/\s+/g,' ').trim()).filter(Boolean);
  }

  function labelIndex(fights,label,preferLast=false,includeThrough=false){
    const candidates=labelCandidates(label,includeThrough);
    if(!candidates.length)return-1;
    const matches=[];
    fights.forEach((fight,index)=>{
      const opponent=key(fight?.opponent);
      if(candidates.some(candidate=>opponent===candidate||opponent.includes(candidate)||candidate.includes(opponent)))matches.push(index);
    });
    if(!matches.length)return-1;
    return preferLast?matches.at(-1):matches[0];
  }

  function phaseBounds(record,{longevity=false}={}){
    const fights=Array.isArray(record?.fights)?record.fights:[];
    const era=eraLedgerFor(record?.fighter);
    const asOf=longevity&&validDate(facts()?.modelAsOfDate)?facts().modelAsOfDate:null;
    if(!era?.window||longevity&&!asOf)return{start:-1,end:-1,era:null,asOf};
    const startDate=era.window.start||null;
    const endDate=era.window.end||null;
    let start=fights.findIndex(fight=>fight?.date===startDate);
    if(start<0)start=nearestDateIndex(fights,startDate);
    if(start<0)start=labelIndex(fights,era.window.startLabel,false,longevity);
    let end=-1;
    if(!endDate){
      if(longevity){for(let index=fights.length-1;index>=0;index-=1){if(validDate(fights[index]?.date)&&fights[index].date<=asOf){end=index;break;}}}
      else end=fights.length-1;
    }else{
      end=fights.findIndex(fight=>fight?.date===endDate);
      if(end<0)end=nearestDateIndex(fights,endDate);
      if(end<0)end=labelIndex(fights,era.window.endLabel,true,longevity);
    }
    return{start,end,era,asOf};
  }

  function finishPressureScore(rate){
    const normalized=clamp(rate,0,1);
    return round2((FINISH_SCALE.find(row=>normalized>=row.min)||FINISH_SCALE.at(-1)).score);
  }
  function primeSampleMultiplier(effectiveSampleCount){
    const samples=Math.max(0,Number(effectiveSampleCount||0));
    if(!samples)return 0;
    return round2(clamp(PRIME_SAMPLE_MIN+((samples-1)*PRIME_SAMPLE_STEP),PRIME_SAMPLE_MIN,1));
  }
  function opponentIsElite(fight){return ELITE_TIERS.has(fight?.opponentContext?.qualityTier||'none');}
  function isEliteStageFight(fight){return(fight?.championshipContext?.type||'none')!=='none'||opponentIsElite(fight);}
  function isTournamentFight(fight){return(fight?.championshipContext?.type||'none')==='tournament';}
  function densityEliteFight(fight){const type=fight?.championshipContext?.type||'none';return(type!=='none'&&type!=='tournament')||opponentIsElite(fight);}
  function groupByDate(fights){
    const groups=[];const byDate=new Map();
    fights.forEach((fight,index)=>{const date=String(fight?.date||fight?.id||`fight-${index}`);let group=byDate.get(date);if(!group){group={date:fight?.date||null,fights:[]};byDate.set(date,group);groups.push(group);}group.fights.push(fight);});
    return groups;
  }
  function effectivePrimeSamples(scoredPrimeFights){
    const samples=[];
    groupByDate(scoredPrimeFights).forEach(group=>{const tournament=group.fights.some(isTournamentFight);if(tournament)samples.push({date:group.date,type:'tournament-event',tournament:true,fights:group.fights});else group.fights.forEach(fight=>samples.push({date:fight?.date||group.date,type:'single-fight',tournament:false,fights:[fight]}));});
    return samples;
  }
  function sampleProfile(scoredPrimeFights){
    const samples=effectivePrimeSamples(scoredPrimeFights).map(sample=>({...sample,densityElite:!sample.tournament&&sample.fights.some(densityEliteFight)}));
    let currentRun=0,longestEliteRun=0;
    samples.forEach(sample=>{currentRun=sample.densityElite?currentRun+1:0;longestEliteRun=Math.max(longestEliteRun,currentRun);});
    const baseMultiplier=primeSampleMultiplier(samples.length);
    const densityFloorEligible=longestEliteRun>=ELITE_DENSITY_MIN_SAMPLES;
    const multiplier=round2(densityFloorEligible?Math.max(baseMultiplier,ELITE_DENSITY_SAMPLE_FLOOR):baseMultiplier);
    return{samples,effectiveSampleCount:samples.length,tournamentEventCount:samples.filter(sample=>sample.tournament).length,tournamentBoutCount:samples.filter(sample=>sample.tournament).reduce((sum,sample)=>sum+sample.fights.length,0),compressedTournamentBoutCount:samples.filter(sample=>sample.tournament).reduce((sum,sample)=>sum+Math.max(0,sample.fights.length-1),0),longestConsecutiveEliteSamples:longestEliteRun,densityFloorEligible,densityFloorApplied:multiplier>baseMultiplier+.001,baseMultiplier,multiplier};
  }
  function roundTotalsFor(fights){
    return fights.reduce((totals,fight)=>{if(fight?.rounds?.status!=='audited'){totals.missing.push({fightId:fight?.id||null,opponent:fight?.opponent||null});return totals;}totals.won+=Number(fight.rounds.won||0);totals.lost+=Number(fight.rounds.lost||0);totals.drawn+=Number(fight.rounds.drawn||0);return totals;},{won:0,lost:0,drawn:0,missing:[]});
  }
  function weightedRoundTotals(entries){
    return entries.reduce((totals,entry)=>{const fight=entry.fight,credit=Number(entry.credit||0);if(fight?.rounds?.status!=='audited'){totals.missing.push({fightId:fight?.id||null,opponent:fight?.opponent||null});return totals;}totals.won+=Number(fight.rounds.won||0)*credit;totals.lost+=Number(fight.rounds.lost||0)*credit;totals.drawn+=Number(fight.rounds.drawn||0)*credit;return totals;},{won:0,lost:0,drawn:0,missing:[]});
  }
  function roundControlRate(totals){const counted=Number(totals?.won||0)+Number(totals?.lost||0)+Number(totals?.drawn||0);return counted?(Number(totals?.won||0)+(Number(totals?.drawn||0)*.5))/counted:0;}
  function tournamentValidationEntries(sample){
    const fights=sample.fights||[];
    if(fights.length<2){const fight=fights[0];return fight&&opponentIsElite(fight)?[{fight,credit:1,stage:'elite-single-tournament-bout',sampleDate:sample.date}]:[];}
    return[{fight:fights.at(-1),credit:1,stage:'tournament-final',sampleDate:sample.date},{fight:fights.at(-2),credit:.5,stage:'tournament-semifinal',sampleDate:sample.date}];
  }
  function eliteValidation(scoredPrimeFights,profile){
    const samples=profile?.samples||effectivePrimeSamples(scoredPrimeFights),entries=[];
    samples.forEach(sample=>{if(sample.tournament)entries.push(...tournamentValidationEntries(sample));else sample.fights.filter(isEliteStageFight).forEach(fight=>entries.push({fight,credit:1,stage:'standard-elite-stage',sampleDate:sample.date}));});
    const volumeUnits=entries.reduce((sum,entry)=>sum+Number(entry.credit||0),0);
    const weightedWins=entries.filter(entry=>entry.fight.scoringDisposition==='count-win').reduce((sum,entry)=>sum+entry.credit,0);
    const weightedDraws=entries.filter(entry=>entry.fight.scoringDisposition==='count-draw').reduce((sum,entry)=>sum+entry.credit,0);
    const resultRate=volumeUnits?(weightedWins+(weightedDraws*.5))/volumeUnits:0;
    const rounds=weightedRoundTotals(entries),roundRate=roundControlRate(rounds);
    const finishUnits=entries.filter(entry=>entry.fight.scoringDisposition==='count-win'&&FINISH_METHODS.has(entry.fight?.method?.category)).reduce((sum,entry)=>sum+entry.credit,0);
    const finishRate=volumeUnits?finishUnits/volumeUnits:0;
    const volume=round2(clamp((volumeUnits/ELITE_VOLUME_FULL_SAMPLE)*ELITE_VALIDATION_MAX.volume,0,ELITE_VALIDATION_MAX.volume));
    const resultScore=round2(resultRate*ELITE_VALIDATION_MAX.result),roundScore=round2(roundRate*ELITE_VALIDATION_MAX.roundControl),finishScore=round2(finishRate*ELITE_VALIDATION_MAX.finishPressure);
    const performance=round2(clamp(resultScore+roundScore+finishScore,0,ELITE_VALIDATION_MAX.performance));
    const score=round2(clamp(volume+performance,0,PRIME_COMPONENT_MAX.eliteLevelValidation));
    return{fightCount:entries.length,eventCount:new Set(entries.map(entry=>entry.sampleDate||entry.fight?.date||entry.fight?.id)).size,volumeUnits:round2(volumeUnits),wins:entries.filter(entry=>entry.fight.scoringDisposition==='count-win').length,losses:entries.filter(entry=>entry.fight.scoringDisposition==='count-loss').length,draws:entries.filter(entry=>entry.fight.scoringDisposition==='count-draw').length,weightedWins:round2(weightedWins),weightedDraws:round2(weightedDraws),resultRate:round2(resultRate*100),roundsWon:round2(rounds.won),roundsLost:round2(rounds.lost),roundsDrawn:round2(rounds.drawn),roundControlRate:round2(roundRate*100),finishUnits:round2(finishUnits),finishRate:round2(finishRate*100),missingRoundRows:rounds.missing,volumeScore:volume,performanceScore:performance,performanceBreakdown:{result:resultScore,roundControl:roundScore,finishPressure:finishScore},score,fights:entries.map(entry=>({fightId:entry.fight.id,date:entry.fight.date,opponent:entry.fight.opponent,result:entry.fight.scoringDisposition,qualityTier:entry.fight?.opponentContext?.qualityTier||null,championshipType:entry.fight?.championshipContext?.type||'none',validationCredit:entry.credit,validationStage:entry.stage}))};
  }

  function calculatePrimeDominance(fighter){
    const record=recordFor(fighter);
    if(!record)return null;
    const fights=record.fights||[],{start,end,era}=phaseBounds(record);
    const windowValid=Boolean(era)&&start>=0&&end>=start;
    if(!windowValid)return null;
    const primeFights=fights.slice(start,end+1),scored=primeFights.filter(fight=>SCORED_DISPOSITIONS.has(fight?.scoringDisposition));
    const wins=scored.filter(fight=>fight.scoringDisposition==='count-win'),losses=scored.filter(fight=>fight.scoringDisposition==='count-loss'),draws=scored.filter(fight=>fight.scoringDisposition==='count-draw');
    const scoredFightCount=scored.length,recordPct=scoredFightCount?(wins.length+(draws.length*.5))/scoredFightCount:0;
    const roundTotals=roundTotalsFor(scored),roundControlPct=roundControlRate(roundTotals);
    const finishWins=wins.filter(fight=>FINISH_METHODS.has(fight?.method?.category)).length,finishPressureRate=scoredFightCount?finishWins/scoredFightCount:0;
    const sample=sampleProfile(scored),elite=eliteValidation(scored,sample);
    const components={primeRecord:round2(recordPct*PRIME_COMPONENT_MAX.primeRecord),roundControl:round2(roundControlPct*PRIME_COMPONENT_MAX.roundControl),finishPressure:finishPressureScore(finishPressureRate),eliteLevelValidation:elite.score};
    const rawScore=round2(clamp(Object.values(components).reduce((sum,value)=>sum+Number(value||0),0),0,CATEGORY_MAX));
    const reconstructedScore=round2(clamp(rawScore*sample.multiplier,0,CATEGORY_MAX));
    return{fighter,reconstructedScore,stats:{windowValid,windowSource:'fighter-era-ledgers',eraStartDate:era?.window?.start||null,eraEndDate:era?.window?.end||null,open:!era?.window?.end,primeFightCount:primeFights.length,scoredFightCount,effectivePrimeSampleCount:sample.effectiveSampleCount,tournamentEventCount:sample.tournamentEventCount,tournamentBoutCount:sample.tournamentBoutCount,compressedTournamentBoutCount:sample.compressedTournamentBoutCount,wins:wins.length,losses:losses.length,draws:draws.length,noContests:primeFights.filter(fight=>fight?.scoringDisposition==='excluded-no-contest').length,technicalExceptions:primeFights.filter(fight=>fight?.scoringDisposition==='technical-exception').length,recordPct:round2(recordPct*100),roundsWon:round2(roundTotals.won),roundsLost:round2(roundTotals.lost),roundsDrawn:round2(roundTotals.drawn),roundControlPct:round2(roundControlPct*100),missingRoundRows:roundTotals.missing,finishWins,finishPressurePct:round2(finishPressureRate*100),eliteLevelValidation:elite,components,rawScore,baseSampleMultiplier:sample.baseMultiplier,sampleMultiplier:sample.multiplier,samplePercent:round2(sample.multiplier*100),longestConsecutiveEliteSamples:sample.longestConsecutiveEliteSamples,eliteDensityFloorApplied:sample.densityFloorApplied,score:reconstructedScore},source:'canonical-fighter-facts + fighter-era-ledgers + locked 9/9/5/7 prime formula'};
  }

  function intervalAudit(fights,open,asOf){
    const intervals=[];let countedDays=0,rawDays=0;const capDays=LONGEVITY_GAP_CAP_MONTHS*DAYS_PER_MONTH;
    for(let index=1;index<fights.length;index+=1){const from=fights[index-1],to=fights[index];if(!validDate(from?.date)||!validDate(to?.date))continue;const days=Math.max(0,(Date.parse(`${to.date}T00:00:00Z`)-Date.parse(`${from.date}T00:00:00Z`))/86400000),credited=Math.min(days,capDays);rawDays+=days;countedDays+=credited;intervals.push({type:'between-ufc-fights',fromFightId:from.id||null,toFightId:to.id||null,fromDate:from.date,toDate:to.date,rawMonths:round2(days/DAYS_PER_MONTH),countedMonths:round2(credited/DAYS_PER_MONTH),capped:days>capDays+.0001});}
    if(open&&fights.length&&validDate(asOf)){const from=fights.at(-1);if(validDate(from?.date)&&from.date<asOf){const days=Math.max(0,(Date.parse(`${asOf}T00:00:00Z`)-Date.parse(`${from.date}T00:00:00Z`))/86400000),credited=Math.min(days,capDays);rawDays+=days;countedDays+=credited;intervals.push({type:'open-window-tail',fromFightId:from.id||null,toFightId:null,fromDate:from.date,toDate:asOf,rawMonths:round2(days/DAYS_PER_MONTH),countedMonths:round2(credited/DAYS_PER_MONTH),capped:days>capDays+.0001});}}
    return{intervals,rawCalendarMonths:round1(rawDays/DAYS_PER_MONTH),gapAdjustedMonths:round1(countedDays/DAYS_PER_MONTH),cappedGapCount:intervals.filter(row=>row.capped).length,openTailMonths:round2(intervals.filter(row=>row.type==='open-window-tail').reduce((sum,row)=>sum+row.countedMonths,0))};
  }
  function longevityScoreFromMonths(months){return round2(clamp((Number(months||0)/LONGEVITY_FULL_CREDIT_MONTHS)*CATEGORY_MAX,0,CATEGORY_MAX));}
  function calculateLongevity(fighter){
    const record=recordFor(fighter);
    if(!record)return null;
    const fights=record.fights||[],{start,end,era,asOf}=phaseBounds(record,{longevity:true});
    const windowValid=Boolean(era)&&start>=0&&end>=start;
    if(!windowValid)return null;
    const windowFights=fights.slice(start,end+1).filter(fight=>validDate(fight?.date)&&fight.date<=asOf),open=Boolean(era&&!era.window?.end),time=intervalAudit(windowFights,open,asOf),longevity=era?.longevity||{};
    const statusMultiplier=Number(longevity.statusMultiplier||1),divisionMultiplier=Number(longevity.divisionMultiplier||1);
    if(!finite(statusMultiplier)||statusMultiplier<=0||!finite(divisionMultiplier)||divisionMultiplier<=0)return null;
    const countedEliteMonths=round2(time.gapAdjustedMonths*statusMultiplier*divisionMultiplier),reconstructedScore=longevityScoreFromMonths(countedEliteMonths);
    return{fighter,reconstructedScore,stats:{windowValid,windowSource:'fighter-era-ledgers',eraStartDate:era?.window?.start||null,eraEndDate:era?.window?.end||null,open,modelAsOfDate:asOf,fightCount:windowFights.length,activityAnchorCount:windowFights.length,activityIncludesNoContestAnchors:true,gapCapMonths:LONGEVITY_GAP_CAP_MONTHS,rawCalendarMonths:time.rawCalendarMonths,gapAdjustedMonths:time.gapAdjustedMonths,activeEliteYears:round2(time.gapAdjustedMonths/12),cappedGapCount:time.cappedGapCount,openTailMonths:time.openTailMonths,intervals:time.intervals,statusMultiplier:round2(statusMultiplier),divisionMultiplier:round2(divisionMultiplier),countedEliteMonths,score:reconstructedScore},source:'canonical-fighter-facts + fighter-era-ledgers + locked 144-month longevity formula'};
  }

  function lossPhase(ledger,fight){const date=String(fight?.date||''),start=String(ledger?.window?.start||''),end=String(ledger?.window?.end||'');if(!validDate(date)||!validDate(start))return'unknown';if(date<start)return'pre-prime';if(validDate(end)&&date>end)return'post-prime';return'prime';}
  function rawLossPenalty(event){
    if(!event.penaltyEligible||event.phase==='post-prime')return{base:0,finishExtra:0,total:0};
    if(event.phase==='unknown')return{base:null,finishExtra:null,total:null};
    let base=0;
    if(event.phase==='pre-prime')base=event.elite?LOSS_RULES.prePrimeElite:LOSS_RULES.prePrimeNonElite;
    else if(event.phase==='prime'&&event.upwardDivision&&event.elite)base=LOSS_RULES.primeUpwardElite;
    else if(event.phase==='prime')base=event.elite?LOSS_RULES.primeElite:LOSS_RULES.primeNonElite;
    const finishExtra=event.finished?(event.phase==='prime'&&event.upwardDivision&&event.elite?LOSS_RULES.finishedUpwardEliteExtra:LOSS_RULES.finishedExtra):0;
    return{base:round2(base),finishExtra:round2(finishExtra),total:round2(base+finishExtra)};
  }
  function calculateLossContext(fighter){
    const record=recordFor(fighter),ledger=eraLedgerFor(fighter);
    if(!record||!ledger||!validDate(ledger?.window?.start))return null;
    const events=(record.fights||[]).filter(fight=>fight?.officialResult==='loss'||fight?.scoringDisposition==='technical-exception').map(fight=>{
      const classification=fight?.lossClassification||{},methodCategory=fight?.method?.category||'other',competitive=classification.competitive!==false,technicalException=fight?.scoringDisposition==='technical-exception'||methodCategory==='dq';
      const event={fightId:fight.id,date:fight.date,opponent:fight.opponent,phase:lossPhase(ledger,fight),qualityTier:fight?.opponentContext?.qualityTier||'none',elite:ELITE_TIERS.has(fight?.opponentContext?.qualityTier||'none'),finished:FINISH_METHODS.has(methodCategory),upwardDivision:classification.divisionContext==='upward',competitive,technicalException,penaltyEligible:fight?.officialResult==='loss'&&competitive&&!technicalException,methodCategory,divisionContext:classification.divisionContext||'home',overrideRule:classification.overrideRule||null};
      return{...event,...Object.fromEntries(Object.entries(rawLossPenalty(event)).map(([name,value])=>[name==='total'?'rawPenalty':name,value]))};
    });
    if(events.some(event=>event.phase==='unknown'||event.rawPenalty===null))return null;
    const counted=events.filter(event=>Number(event.rawPenalty)<0),worst=counted.slice().sort((a,b)=>Math.abs(Number(b.rawPenalty))-Math.abs(Number(a.rawPenalty))||String(a.date).localeCompare(String(b.date))).slice(0,LOSS_RULES.severityLossCount);
    const severityRaw=worst.length?worst.reduce((sum,event)=>sum+Math.abs(Number(event.rawPenalty)),0)/worst.length:0,severity=round2(Math.min(LOSS_RULES.severityMax,severityRaw)),rawLossBurden=round2(counted.reduce((sum,event)=>sum+Math.abs(Number(event.rawPenalty)),0));
    const end=String(ledger?.window?.end||''),open=!validDate(end),exposure=(record.fights||[]).filter(fight=>fight?.officialResult!=='no-contest'&&validDate(fight?.date)&&(open||fight.date<=end)).length;
    const frequency=round2(Math.min(LOSS_RULES.frequencyMax,(rawLossBurden/Math.max(1,exposure))*LOSS_RULES.frequencyScale)),hybridBase=round2(severity+frequency),primeLosses=counted.filter(event=>event.phase==='prime'),primeFinishes=primeLosses.filter(event=>event.finished),primeVolumeFloor=round2(Math.min(LOSS_RULES.primeVolumeFloorMax,(primeLosses.length*LOSS_RULES.primeLossFloorPerLoss)+(primeFinishes.length*LOSS_RULES.primeFinishFloorExtra))),preDivision=round2(Math.min(LOSS_RULES.totalMax,Math.max(hybridBase,primeVolumeFloor))),divisionMultiplier=Number(ledger?.longevity?.divisionMultiplier||1),divisionDiscountPct=round2(clamp((divisionMultiplier-LOSS_RULES.divisionDiscountFloor)*LOSS_RULES.divisionDiscountScale,0,LOSS_RULES.divisionDiscountMax)),finalMagnitude=round2(preDivision*(1-divisionDiscountPct));
    return{fighter,reconstructedPenalty:round2(-finalMagnitude),events,exposure,severity,frequency,primeVolumeFloor,preDivision,divisionMultiplier:round2(divisionMultiplier),divisionDiscountPct,source:'canonical-fighter-facts + fighter-era-ledgers + locked loss rules'};
  }

  function eraDepthSourceFor(fighter){const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW,direct=(shadow?.fighters||[]).find(row=>key(row.fighter)===key(fighter))||null,resolution=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS?.entryFor?.(fighter)||null;return{source:direct||resolution?.sourceRow||null,resolution};}
  function eraCurve(depthIndex){if(!finite(depthIndex))return null;const value=Number(depthIndex);if(value>=1)return round2(Math.min((value-1)*20,.75));return round2(Math.max(-3,-3*Math.pow((1-value)/.25,1.5)));}
  function calculateEraDepth(fighter){const{source,resolution}=eraDepthSourceFor(fighter),approved=finite(resolution?.approvedAdjustment)?round2(resolution.approvedAdjustment):null,recomputed=source&&finite(source.depthIndex)?eraCurve(source.depthIndex):null,canonicalAdjustment=approved??recomputed;if(!finite(canonicalAdjustment))return null;return{fighter,canonicalAdjustment:round2(canonicalAdjustment),depthIndex:source&&finite(source.depthIndex)?round2(source.depthIndex):null,recomputedAdjustment:recomputed,resolutionApplied:Boolean(resolution),source:resolution?'approved era-depth factual completion':'empirical era-depth row + locked curve'};}

  const CALCULATORS=Object.freeze({
    championship:Object.freeze({field:'reconstructedScore',calculate:calculateChampionship,owner:'category-calculators.js + canonical-scoring-judgments.js'}),
    opponentQuality:Object.freeze({field:'reconstructedScore',calculate:calculateOpponentQuality,owner:'category-calculators.js + canonical-scoring-judgments.js'}),
    primeDominance:Object.freeze({field:'reconstructedScore',calculate:calculatePrimeDominance,owner:'category-calculators.js + canonical fighter facts/era ledgers'}),
    longevity:Object.freeze({field:'reconstructedScore',calculate:calculateLongevity,owner:'category-calculators.js + canonical fighter facts/era ledgers'}),
    penalty:Object.freeze({field:'reconstructedPenalty',calculate:calculateLossContext,owner:'category-calculators.js + canonical fighter facts/era ledgers'}),
    apex:Object.freeze({field:'reconstructedScore',calculate:calculateApex,owner:'category-calculators.js + canonical-scoring-judgments.js'}),
    eraDepth:Object.freeze({field:'canonicalAdjustment',calculate:calculateEraDepth,owner:'category-calculators.js + empirical era-depth inputs'})
  });

  function rowFor(category,fighter){return CALCULATORS[category]?.calculate?.(fighter)||null;}
  function entryFor(fighter){
    const scores={},traces={},missing=[];
    Object.entries(CALCULATORS).forEach(([category,definition])=>{const row=definition.calculate(fighter),value=row?.[definition.field];if(!row||!finite(value))missing.push(category);else scores[category]=round2(value);traces[category]=row?clone(row):null;});
    if(missing.length)return{fighter,status:'blocked',missing,scores,traces};
    return{fighter,status:'complete',missing:[],championship:scores.championship,opponentQuality:scores.opponentQuality,primeDominance:scores.primeDominance,longevity:scores.longevity,penalty:scores.penalty,apex:scores.apex,eraDepth:scores.eraDepth,scores,traces};
  }
  function list(){return facts()?.list?.().map(record=>({...entryFor(record.fighter),board:record.board}))||[];}
  function audit(){
    const rows=list(),blocked=rows.filter(row=>row.status!=='complete');
    const sourceStatus={facts:Boolean(facts()?.list&&facts()?.get),judgments:Boolean(judgments()?.entryFor&&judgments()?.fighterCount===EXPECTED_FIGHTERS),fighterEraLedgers:Boolean(window.UFC_FIGHTER_ERA_LEDGERS),eraDepthInputs:Boolean(window.UFC_DIVISION_ERA_DEPTH_SHADOW)};
    return{version:VERSION,expectedFighterCount:EXPECTED_FIGHTERS,fighterCount:rows.length,completeFighterCount:rows.length-blocked.length,blockedFighterCount:blocked.length,blockedFighters:blocked.map(row=>({fighter:row.fighter,missing:row.missing})),sources:sourceStatus,readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,readsMigrationReconstructionReports:false,mutatesRankingData:false,passed:rows.length===EXPECTED_FIGHTERS&&blocked.length===0&&Object.values(sourceStatus).every(Boolean),rows};
  }

  const API={version:VERSION,role:'single calculation owner for seven approved UFC GOAT categories',expectedFighterCount:EXPECTED_FIGHTERS,calculatorOwners:Object.fromEntries(Object.entries(CALCULATORS).map(([category,definition])=>[category,definition.owner])),readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,readsMigrationReconstructionReports:false,mutatesRankingData:false,rowFor,entryFor,list,audit};
  window.UFC_CATEGORY_CALCULATORS=API;
  const report=audit();
  window.UFC_CATEGORY_CALCULATOR_AUDIT=report;
  if(typeof document!=='undefined'&&document.documentElement?.setAttribute)document.documentElement.setAttribute('data-category-calculators',`${VERSION}-${report.passed?'clean':'blocked'}-${report.completeFighterCount}`);
})();