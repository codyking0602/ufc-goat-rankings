// Permanent production-facing API for the seven approved UFC GOAT category calculators.
// No frozen category totals, total scores, ranks, or OVRs are read here.
(function(){
  'use strict';

  const VERSION='category-calculators-20260714b-permanent-judgment-inputs';
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
  const ELITE_TIERS=new Set(['champion-level','top-five']);
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[“”\"]/g,'').replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const round2=value=>{const rounded=Math.round((Number(value||0)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};
  const round6=value=>Math.round((Number(value||0)+Number.EPSILON)*1_000_000)/1_000_000;
  const finite=value=>Number.isFinite(Number(value));
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''));

  function facts(){return window.UFC_CANONICAL_FIGHTER_FACTS||null;}
  function judgments(){return window.UFC_CANONICAL_SCORING_JUDGMENTS||null;}
  function recordFor(fighter){return facts()?.get?.(fighter)||facts()?.list?.().find(record=>key(record.fighter)===key(fighter))||null;}
  function judgmentFor(category,fighter){return judgments()?.entryFor?.(category,fighter)||null;}

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

  function eraLedgerFor(fighter){
    const source=window.UFC_FIGHTER_ERA_LEDGERS;
    if(!source)return null;
    const direct=source.entryFor?.(fighter);
    if(direct)return direct;
    const name=source.names?.().find(candidate=>key(candidate)===key(fighter));
    return name?source.entryFor?.(name)||null:null;
  }

  function lossPhase(ledger,fight){
    const date=String(fight?.date||'');
    const start=String(ledger?.window?.start||'');
    const end=String(ledger?.window?.end||'');
    if(!validDate(date)||!validDate(start))return'unknown';
    if(date<start)return'pre-prime';
    if(validDate(end)&&date>end)return'post-prime';
    return'prime';
  }

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
    const record=recordFor(fighter);
    const ledger=eraLedgerFor(fighter);
    if(!record||!ledger||!validDate(ledger?.window?.start))return null;
    const events=(record.fights||[]).filter(fight=>fight?.officialResult==='loss'||fight?.scoringDisposition==='technical-exception').map(fight=>{
      const classification=fight?.lossClassification||{};
      const methodCategory=fight?.method?.category||'other';
      const competitive=classification.competitive!==false;
      const technicalException=fight?.scoringDisposition==='technical-exception'||methodCategory==='dq';
      const event={
        fightId:fight.id,date:fight.date,opponent:fight.opponent,phase:lossPhase(ledger,fight),
        qualityTier:fight?.opponentContext?.qualityTier||'none',elite:ELITE_TIERS.has(fight?.opponentContext?.qualityTier||'none'),
        finished:FINISH_METHODS.has(methodCategory),upwardDivision:classification.divisionContext==='upward',
        competitive,technicalException,penaltyEligible:fight?.officialResult==='loss'&&competitive&&!technicalException,
        methodCategory,divisionContext:classification.divisionContext||'home',overrideRule:classification.overrideRule||null
      };
      return {...event,...Object.fromEntries(Object.entries(rawLossPenalty(event)).map(([name,value])=>[name==='total'?'rawPenalty':name,value]))};
    });
    if(events.some(event=>event.phase==='unknown'||event.rawPenalty===null))return null;
    const counted=events.filter(event=>Number(event.rawPenalty)<0);
    const worst=counted.slice().sort((a,b)=>Math.abs(Number(b.rawPenalty))-Math.abs(Number(a.rawPenalty))||String(a.date).localeCompare(String(b.date))).slice(0,LOSS_RULES.severityLossCount);
    const severityRaw=worst.length?worst.reduce((sum,event)=>sum+Math.abs(Number(event.rawPenalty)),0)/worst.length:0;
    const severity=round2(Math.min(LOSS_RULES.severityMax,severityRaw));
    const rawLossBurden=round2(counted.reduce((sum,event)=>sum+Math.abs(Number(event.rawPenalty)),0));
    const end=String(ledger?.window?.end||'');
    const open=!validDate(end);
    const exposure=(record.fights||[]).filter(fight=>fight?.officialResult!=='no-contest'&&validDate(fight?.date)&&(open||fight.date<=end)).length;
    const frequency=round2(Math.min(LOSS_RULES.frequencyMax,(rawLossBurden/Math.max(1,exposure))*LOSS_RULES.frequencyScale));
    const hybridBase=round2(severity+frequency);
    const primeLosses=counted.filter(event=>event.phase==='prime');
    const primeFinishes=primeLosses.filter(event=>event.finished);
    const primeVolumeFloor=round2(Math.min(LOSS_RULES.primeVolumeFloorMax,(primeLosses.length*LOSS_RULES.primeLossFloorPerLoss)+(primeFinishes.length*LOSS_RULES.primeFinishFloorExtra)));
    const preDivision=round2(Math.min(LOSS_RULES.totalMax,Math.max(hybridBase,primeVolumeFloor)));
    const divisionMultiplier=Number(ledger?.longevity?.divisionMultiplier||1);
    const divisionDiscountPct=round2(clamp((divisionMultiplier-LOSS_RULES.divisionDiscountFloor)*LOSS_RULES.divisionDiscountScale,0,LOSS_RULES.divisionDiscountMax));
    const finalMagnitude=round2(preDivision*(1-divisionDiscountPct));
    return {fighter,reconstructedPenalty:round2(-finalMagnitude),events,exposure,severity,frequency,primeVolumeFloor,preDivision,divisionMultiplier:round2(divisionMultiplier),divisionDiscountPct,source:'canonical-fighter-facts + fighter-era-ledgers + locked loss rules'};
  }

  function eraDepthSourceFor(fighter){
    const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    const direct=(shadow?.fighters||[]).find(row=>key(row.fighter)===key(fighter))||null;
    const resolution=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS?.entryFor?.(fighter)||null;
    return {source:direct||resolution?.sourceRow||null,resolution};
  }

  function eraCurve(depthIndex){
    if(!finite(depthIndex))return null;
    const value=Number(depthIndex);
    if(value>=1)return round2(Math.min((value-1)*20,.75));
    return round2(Math.max(-3,-3*Math.pow((1-value)/.25,1.5)));
  }

  function calculateEraDepth(fighter){
    const {source,resolution}=eraDepthSourceFor(fighter);
    const approved=finite(resolution?.approvedAdjustment)?round2(resolution.approvedAdjustment):null;
    const recomputed=source&&finite(source.depthIndex)?eraCurve(source.depthIndex):null;
    const canonicalAdjustment=approved??recomputed;
    if(!finite(canonicalAdjustment))return null;
    return {fighter,canonicalAdjustment:round2(canonicalAdjustment),depthIndex:source&&finite(source.depthIndex)?round2(source.depthIndex):null,recomputedAdjustment:recomputed,resolutionApplied:Boolean(resolution),source:resolution?'approved era-depth factual completion':'empirical era-depth row + locked curve'};
  }

  function migrationRow(globalName,fighter){return window[globalName]?.entryFor?.(fighter)||null;}
  function calculatePrimeDominance(fighter){
    const row=migrationRow('UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION',fighter);
    return row&&finite(row.reconstructedScore)?{...clone(row),reconstructedScore:round2(row.reconstructedScore)}:null;
  }
  function calculateLongevity(fighter){
    const row=migrationRow('UFC_CANONICAL_LONGEVITY_RECONSTRUCTION',fighter);
    return row&&finite(row.reconstructedScore)?{...clone(row),reconstructedScore:round2(row.reconstructedScore)}:null;
  }

  const CALCULATORS=Object.freeze({
    championship:Object.freeze({field:'reconstructedScore',calculate:calculateChampionship,owner:'category-calculators.js + canonical-scoring-judgments.js'}),
    opponentQuality:Object.freeze({field:'reconstructedScore',calculate:calculateOpponentQuality,owner:'category-calculators.js + canonical-scoring-judgments.js'}),
    primeDominance:Object.freeze({field:'reconstructedScore',calculate:calculatePrimeDominance,owner:'canonical-prime-dominance-reconstruction.js (temporary clean source)'}),
    longevity:Object.freeze({field:'reconstructedScore',calculate:calculateLongevity,owner:'canonical-longevity-reconstruction.js (temporary clean source)'}),
    penalty:Object.freeze({field:'reconstructedPenalty',calculate:calculateLossContext,owner:'category-calculators.js + canonical facts/era ledgers'}),
    apex:Object.freeze({field:'reconstructedScore',calculate:calculateApex,owner:'category-calculators.js + canonical-scoring-judgments.js'}),
    eraDepth:Object.freeze({field:'canonicalAdjustment',calculate:calculateEraDepth,owner:'category-calculators.js + empirical era-depth inputs'})
  });

  function rowFor(category,fighter){return CALCULATORS[category]?.calculate?.(fighter)||null;}
  function entryFor(fighter){
    const scores={};
    const traces={};
    const missing=[];
    Object.entries(CALCULATORS).forEach(([category,definition])=>{
      const row=definition.calculate(fighter);
      const value=row?.[definition.field];
      if(!row||!finite(value))missing.push(category);
      else scores[category]=round2(value);
      traces[category]=row?clone(row):null;
    });
    if(missing.length)return{fighter,status:'blocked',missing,scores,traces};
    return{fighter,status:'complete',missing:[],championship:scores.championship,opponentQuality:scores.opponentQuality,primeDominance:scores.primeDominance,longevity:scores.longevity,penalty:scores.penalty,apex:scores.apex,eraDepth:scores.eraDepth,scores,traces};
  }

  function list(){return facts()?.list?.().map(record=>({...entryFor(record.fighter),board:record.board}))||[];}
  function audit(){
    const rows=list();
    const blocked=rows.filter(row=>row.status!=='complete');
    const sourceStatus={
      facts:Boolean(facts()?.list&&facts()?.get),
      judgments:Boolean(judgments()?.entryFor&&judgments()?.fighterCount===EXPECTED_FIGHTERS),
      primeDominance:Boolean(window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION?.entryFor),
      longevity:Boolean(window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION?.entryFor),
      fighterEraLedgers:Boolean(window.UFC_FIGHTER_ERA_LEDGERS),
      eraDepthInputs:Boolean(window.UFC_DIVISION_ERA_DEPTH_SHADOW)
    };
    return{version:VERSION,expectedFighterCount:EXPECTED_FIGHTERS,fighterCount:rows.length,completeFighterCount:rows.length-blocked.length,blockedFighterCount:blocked.length,blockedFighters:blocked.map(row=>({fighter:row.fighter,missing:row.missing})),sources:sourceStatus,readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,mutatesRankingData:false,passed:rows.length===EXPECTED_FIGHTERS&&blocked.length===0&&Object.values(sourceStatus).every(Boolean),rows};
  }

  const API={version:VERSION,role:'single calculation API for seven approved UFC GOAT categories',expectedFighterCount:EXPECTED_FIGHTERS,calculatorOwners:Object.fromEntries(Object.entries(CALCULATORS).map(([category,definition])=>[category,definition.owner])),readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,mutatesRankingData:false,rowFor,entryFor,list,audit};
  window.UFC_CATEGORY_CALCULATORS=API;
  const report=audit();
  window.UFC_CATEGORY_CALCULATOR_AUDIT=report;
  if(typeof document!=='undefined'&&document.documentElement?.setAttribute){document.documentElement.setAttribute('data-category-calculators',`${VERSION}-${report.passed?'clean':'blocked'}-${report.completeFighterCount}`);}
})();
