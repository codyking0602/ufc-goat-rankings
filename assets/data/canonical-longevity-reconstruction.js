// Canonical Longevity reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: the shared Fighter Era Ledger owns every phase boundary; this file never mutates live scores.
(function(){
  'use strict';

  const VERSION='canonical-longevity-reconstruction-20260714a-era-ledger-only';
  const CATEGORY_MAX=30;
  const FULL_CREDIT_MONTHS=144;
  const GAP_CAP_MONTHS=18;
  const DAYS_PER_MONTH=365.25/12;
  const MEANINGFUL_DELTA=.25;

  // Recovered from longevity-canonical-recalculation.js. Comparison evidence only.
  // These rows explain historical/frozen scores but are never allowed to control a window or score here.
  const LEGACY_PATCH_EVIDENCE=Object.freeze({
    'Dustin Poirier':Object.freeze({gapAdjustedMonths:73.6,window:'Justin Gaethje I → Islam Makhachev'}),
    'Justin Gaethje':Object.freeze({gapAdjustedMonths:67.6,window:'James Vick → Max Holloway'}),
    'Israel Adesanya':Object.freeze({gapAdjustedMonths:64.2,window:'Kelvin Gastelum → Dricus du Plessis'}),
    'Ronda Rousey':Object.freeze({gapAdjustedMonths:46.2,window:'Liz Carmouche → Amanda Nunes'}),
    'Randy Couture':Object.freeze({gapAdjustedMonths:128.7,statusMultiplier:1,window:'Vitor Belfort I → Brock Lesnar'}),
    'Chuck Liddell':Object.freeze({gapAdjustedMonths:59.1,window:'Vitor Belfort → Quinton Jackson II'}),
    'T.J. Dillashaw':Object.freeze({gapAdjustedMonths:88.8,window:'Renan Barao I → Aljamain Sterling'}),
    'Aljamain Sterling':Object.freeze({gapAdjustedMonths:85.1,window:'Pedro Munhoz → Current elite form'}),
    'Sean Strickland':Object.freeze({gapAdjustedMonths:59.3,window:'Uriah Hall → Current elite form'}),
    'Robert Whittaker':Object.freeze({gapAdjustedMonths:94.9,window:'Derek Brunson → Khamzat Chimaev'}),
    'Dan Henderson':Object.freeze({gapAdjustedMonths:64.2,window:'Rich Franklin → Daniel Cormier'})
  });

  const round1=value=>Math.round((Number(value||0)+Number.EPSILON)*10)/10;
  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));
  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''))&&!Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
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
    if(!validDate(date))return -1;
    const target=Date.parse(`${date}T00:00:00Z`);
    let best={index:-1,distance:Infinity};
    fights.forEach((fight,index)=>{
      if(!validDate(fight?.date))return;
      const distance=Math.abs(Date.parse(`${fight.date}T00:00:00Z`)-target);
      if(distance<best.distance)best={index,distance};
    });
    return best.distance<=86400000?best.index:-1;
  }

  function labelCandidates(label){
    const text=String(label||'').replace(/\([^)]*\)/g,' ').trim();
    if(!text)return [];
    return text.split('/').map(part=>clean(part)
      .replace(/\b(current|championship|champion|title|run|form|elite|level|active|retirement|retired|through)\b/g,' ')
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

  function modelAsOfDate(){
    const value=window.UFC_CANONICAL_FIGHTER_FACTS?.modelAsOfDate;
    return validDate(value)?value:null;
  }

  function phaseBounds(record){
    const fights=Array.isArray(record?.fights)?record.fights:[];
    const era=eraEntryFor(record?.fighter);
    const asOf=modelAsOfDate();
    if(!era?.window||!asOf)return {start:-1,end:-1,era:null,asOf};

    const startDate=era.window.start||null;
    const endDate=era.window.end||null;
    let start=fights.findIndex(fight=>fight?.date===startDate);
    if(start<0)start=nearestDateIndex(fights,startDate);
    if(start<0)start=labelIndex(fights,era.window.startLabel,false);

    let end=-1;
    if(!endDate){
      for(let index=fights.length-1;index>=0;index-=1){
        if(validDate(fights[index]?.date)&&fights[index].date<=asOf){end=index;break;}
      }
    }else{
      end=fights.findIndex(fight=>fight?.date===endDate);
      if(end<0)end=nearestDateIndex(fights,endDate);
      if(end<0)end=labelIndex(fights,era.window.endLabel,true);
    }
    return {start,end,era,asOf};
  }

  function canonicalFactWindow(record){
    const fights=Array.isArray(record?.fights)?record.fights:[];
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

  function scoreFromMonths(months){
    return round2(clamp((Number(months||0)/FULL_CREDIT_MONTHS)*CATEGORY_MAX,0,CATEGORY_MAX));
  }

  function intervalAudit(fights,open,asOf){
    const intervals=[];
    let countedDays=0;
    let rawDays=0;
    const capDays=GAP_CAP_MONTHS*DAYS_PER_MONTH;
    for(let index=1;index<fights.length;index+=1){
      const from=fights[index-1];
      const to=fights[index];
      if(!validDate(from?.date)||!validDate(to?.date))continue;
      const days=Math.max(0,(Date.parse(`${to.date}T00:00:00Z`)-Date.parse(`${from.date}T00:00:00Z`))/86400000);
      const credited=Math.min(days,capDays);
      rawDays+=days;
      countedDays+=credited;
      intervals.push({
        type:'between-ufc-fights',
        fromFightId:from.id||null,
        fromOpponent:from.opponent||null,
        fromDate:from.date,
        toFightId:to.id||null,
        toOpponent:to.opponent||null,
        toDate:to.date,
        rawMonths:round2(days/DAYS_PER_MONTH),
        countedMonths:round2(credited/DAYS_PER_MONTH),
        capped:days>capDays+.0001
      });
    }

    if(open&&fights.length&&validDate(asOf)){
      const from=fights.at(-1);
      if(validDate(from?.date)&&from.date<asOf){
        const days=Math.max(0,(Date.parse(`${asOf}T00:00:00Z`)-Date.parse(`${from.date}T00:00:00Z`))/86400000);
        const credited=Math.min(days,capDays);
        rawDays+=days;
        countedDays+=credited;
        intervals.push({
          type:'open-window-tail',
          fromFightId:from.id||null,
          fromOpponent:from.opponent||null,
          fromDate:from.date,
          toFightId:null,
          toOpponent:'Model as-of date',
          toDate:asOf,
          rawMonths:round2(days/DAYS_PER_MONTH),
          countedMonths:round2(credited/DAYS_PER_MONTH),
          capped:days>capDays+.0001
        });
      }
    }

    return {
      intervals,
      rawCalendarMonths:round1(rawDays/DAYS_PER_MONTH),
      gapAdjustedMonths:round1(countedDays/DAYS_PER_MONTH),
      cappedGapCount:intervals.filter(row=>row.capped).length,
      openTailMonths:round2(intervals.filter(row=>row.type==='open-window-tail').reduce((sum,row)=>sum+row.countedMonths,0))
    };
  }

  function legacyPatchScoreFor(fighter,statusMultiplier,divisionMultiplier){
    const patch=LEGACY_PATCH_EVIDENCE[fighter];
    if(!patch)return null;
    const status=Number.isFinite(Number(patch.statusMultiplier))?Number(patch.statusMultiplier):statusMultiplier;
    const countedEliteMonths=round2(Number(patch.gapAdjustedMonths||0)*status*divisionMultiplier);
    return {
      ...clone(patch),
      statusMultiplier:round2(status),
      divisionMultiplier:round2(divisionMultiplier),
      countedEliteMonths,
      score:scoreFromMonths(countedEliteMonths),
      source:'longevity-canonical-recalculation.js comparison evidence only',
      controlsScore:false
    };
  }

  function calculateLongevity(record){
    const fights=Array.isArray(record?.fights)?record.fights:[];
    const {start,end,era,asOf}=phaseBounds(record);
    const windowValid=Boolean(era)&&start>=0&&end>=start;
    const windowFights=windowValid?fights.slice(start,end+1).filter(fight=>validDate(fight?.date)&&fight.date<=asOf):[];
    const open=Boolean(era&&!era.window?.end);
    const time=windowValid?intervalAudit(windowFights,open,asOf):{intervals:[],rawCalendarMonths:0,gapAdjustedMonths:0,cappedGapCount:0,openTailMonths:0};
    const longevity=era?.longevity||{};
    const statusMultiplier=Number(longevity.statusMultiplier||1);
    const divisionMultiplier=Number(longevity.divisionMultiplier||1);
    const multiplierInputsValid=Number.isFinite(statusMultiplier)&&statusMultiplier>0&&Number.isFinite(divisionMultiplier)&&divisionMultiplier>0;
    const countedEliteMonths=windowValid&&multiplierInputsValid?round2(time.gapAdjustedMonths*statusMultiplier*divisionMultiplier):null;
    const score=Number.isFinite(countedEliteMonths)?scoreFromMonths(countedEliteMonths):null;
    const storedGapAdjustedMonths=Number.isFinite(Number(longevity.gapAdjustedMonths))?round1(longevity.gapAdjustedMonths):null;
    const storedCountedEliteMonths=storedGapAdjustedMonths!==null&&multiplierInputsValid?round2(storedGapAdjustedMonths*statusMultiplier*divisionMultiplier):null;
    const storedScore=Number.isFinite(storedCountedEliteMonths)?scoreFromMonths(storedCountedEliteMonths):null;
    const factWindow=canonicalFactWindow(record);
    const eraOpen=Boolean(era&&!era.window?.end);
    const eraLedgerDrift=Boolean(era)&&(
      factWindow.startDate!==(era.window?.start||null)||
      factWindow.endDate!==(era.window?.end||null)||
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
      eraEndReason:era?.window?.endReason||null,
      open,
      modelAsOfDate:asOf,
      canonicalFactWindow:factWindow,
      eraLedgerDrift,
      categoryLocalPrimeWindowUsed:false,
      categoryLocalLongevityContextUsed:false,
      fightCount:windowFights.length,
      activityAnchorCount:windowFights.length,
      activityIncludesNoContestAnchors:true,
      gapCapMonths:GAP_CAP_MONTHS,
      rawCalendarMonths:time.rawCalendarMonths,
      gapAdjustedMonths:time.gapAdjustedMonths,
      activeEliteYears:round2(time.gapAdjustedMonths/12),
      cappedGapCount:time.cappedGapCount,
      openTailMonths:time.openTailMonths,
      intervals:time.intervals,
      statusMultiplier:round2(statusMultiplier),
      divisionMultiplier:round2(divisionMultiplier),
      multiplierInputsValid,
      countedEliteMonths,
      score,
      storedEraLongevity:{
        gapCapMonths:Number(longevity.gapCapMonths||0)||null,
        gapAdjustedMonths:storedGapAdjustedMonths,
        activeEliteYears:Number.isFinite(Number(longevity.activeEliteYears))?round2(longevity.activeEliteYears):null,
        statusMultiplier:Number.isFinite(Number(longevity.statusMultiplier))?round2(longevity.statusMultiplier):null,
        divisionMultiplier:Number.isFinite(Number(longevity.divisionMultiplier))?round2(longevity.divisionMultiplier):null,
        adjustmentNote:longevity.adjustmentNote||null,
        note:longevity.note||null
      },
      storedCountedEliteMonths,
      storedScore,
      storedMonthDelta:storedGapAdjustedMonths===null?null:round1(time.gapAdjustedMonths-storedGapAdjustedMonths),
      legacyPatchEvidence:legacyPatchScoreFor(record?.fighter,statusMultiplier,divisionMultiplier),
      localLongevityContext:clone(record?.longevityContext||{}),
      localDerivedLongevity:window.UFC_CANONICAL_FIGHTER_FACTS?.derive?clone(window.UFC_CANONICAL_FIGHTER_FACTS.derive(record)?.longevity||null):null,
      judgmentInputs:{
        statusMultiplier:{value:round2(statusMultiplier),source:'fighter-era-ledgers.longevity.statusMultiplier',classification:'recovered judgment'},
        divisionMultiplier:{value:round2(divisionMultiplier),source:'fighter-era-ledgers.longevity.divisionMultiplier',classification:'recovered judgment'},
        adjustmentNote:{value:longevity.adjustmentNote||longevity.note||null,source:'fighter-era-ledgers.longevity',classification:'recovered judgment'},
        manualNumericAdjustment:{value:0,source:'none',classification:'no hidden manual adjustment used'}
      }
    };
  }

  function frozenScoreFor(fighter){
    const control=window.UFC_CANONICAL_SCORING_RECORDS?.entryFor?.(fighter);
    if(control&&Number.isFinite(Number(control.longevity)))return round2(control.longevity);
    const rows=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[]),...(window.RANKING_DATA?.fighters||[])];
    const row=rows.find(candidate=>clean(candidate?.fighter)===clean(fighter));
    return Number.isFinite(Number(row?.longevity))?round2(row.longevity):null;
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    const eras=window.UFC_FIGHTER_ERA_LEDGERS;
    if(!facts||facts.count?.()!==73||!controls||!eras){
      return {version:VERSION,applied:false,error:'Canonical Longevity prerequisites are incomplete.',mutatesRankingData:false};
    }

    const fighters=facts.list().map(record=>{
      const stats=calculateLongevity(record);
      const currentScore=frozenScoreFor(record.fighter);
      const difference=Number.isFinite(stats.score)&&Number.isFinite(currentScore)?round2(stats.score-currentScore):null;
      const storedDifference=Number.isFinite(stats.storedScore)&&Number.isFinite(currentScore)?round2(stats.storedScore-currentScore):null;
      const patchDifference=Number.isFinite(stats.legacyPatchEvidence?.score)&&Number.isFinite(currentScore)?round2(stats.legacyPatchEvidence.score-currentScore):null;
      const issues=[];
      const missingJudgmentInputs=[];

      if(!eraEntryFor(record.fighter)){
        missingJudgmentInputs.push('Shared Fighter Era Ledger entry');
        issues.push({classification:'factual correction',reason:'No shared Fighter Era Ledger entry exists, so Longevity cannot be phase-resolved without an approved window.'});
      }else if(!stats.windowValid){
        missingJudgmentInputs.push('Resolvable Fighter Era Ledger start/end anchors');
        issues.push({classification:'factual correction',reason:'The shared Fighter Era Ledger window could not be resolved to the canonical UFC fight ledger.'});
      }
      if(!stats.multiplierInputsValid){
        missingJudgmentInputs.push('Valid status and division multipliers');
        issues.push({classification:'recovered judgment',reason:'The approved model requires explicit positive status and division multipliers.'});
      }
      if(stats.eraLedgerDrift){
        issues.push({classification:'factual correction',reason:'The fighter-local canonical primeWindow differs from the shared Fighter Era Ledger. The shared ledger controls Longevity.'});
      }
      if(Number.isFinite(stats.storedMonthDelta)&&Math.abs(stats.storedMonthDelta)>=.15){
        issues.push({classification:'factual correction',reason:`The Era Ledger's precomputed ${stats.storedEraLongevity.gapAdjustedMonths.toFixed(1)} active months do not match the ${stats.gapAdjustedMonths.toFixed(1)} months recalculated from its own shared window (${stats.storedMonthDelta>0?'+':''}${stats.storedMonthDelta.toFixed(1)} months).`});
      }
      if(Number(stats.storedEraLongevity.gapCapMonths||GAP_CAP_MONTHS)!==GAP_CAP_MONTHS){
        issues.push({classification:'proposed model change requiring Cody approval',reason:`A ${stats.storedEraLongevity.gapCapMonths}-month fighter-specific cap exists, but the approved universal cap is ${GAP_CAP_MONTHS} months and remains controlling.`});
      }
      if(Number.isFinite(difference)&&Math.abs(difference)>.01){
        const patchExplains=Number.isFinite(patchDifference)&&Math.abs(patchDifference)<=.02;
        issues.push({
          classification:patchExplains?'factual correction':'missing/recovered judgment review',
          reason:patchExplains
            ?`The frozen ${currentScore.toFixed(2)}/30 score is reproduced by the legacy ${stats.legacyPatchEvidence.window} month override, while the shared Era Ledger window produces ${stats.score.toFixed(2)}/30 (${difference>0?'+':''}${difference.toFixed(2)}). The old patch is comparison evidence only.`
            :`The shared-window reconstruction produces ${stats.score.toFixed(2)}/30 versus the frozen ${currentScore.toFixed(2)}/30 control (${difference>0?'+':''}${difference.toFixed(2)}). Review the traced months and recovered multipliers before any live promotion.`
        });
        if(!patchExplains&&(!Number.isFinite(storedDifference)||Math.abs(storedDifference)>.02))missingJudgmentInputs.push('Explanation for frozen Longevity score delta');
      }

      return {
        fighter:record.fighter,
        board:record.board,
        currentScore,
        reconstructedScore:stats.score,
        difference,
        storedEraScore:stats.storedScore,
        storedEraDifference:storedDifference,
        legacyPatchScore:stats.legacyPatchEvidence?.score??null,
        legacyPatchDifference:patchDifference,
        classification:Number.isFinite(difference)&&Math.abs(difference)>.01?'reconstruction delta requires classified review':'approved formula parity or unresolved input',
        currentControlSource:'canonical-scoring-records',
        phaseSource:'fighter-era-ledgers',
        formulaSource:'recovered longevity-shadow-scorer 144-month model',
        missingJudgmentInputs:[...new Set(missingJudgmentInputs)],
        issues,
        stats
      };
    }).sort((a,b)=>{
      const aScore=Number.isFinite(a.reconstructedScore)?a.reconstructedScore:-Infinity;
      const bScore=Number.isFinite(b.reconstructedScore)?b.reconstructedScore:-Infinity;
      return bScore-aScore||a.fighter.localeCompare(b.fighter);
    });

    const after=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    const byKey=new Map(fighters.map(row=>[clean(row.fighter),row]));
    const resolved=fighters.filter(row=>Number.isFinite(row.reconstructedScore));
    const exact=fighters.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)<=.01);
    const meaningful=fighters.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)>=MEANINGFUL_DELTA)
      .sort((a,b)=>Math.abs(b.difference)-Math.abs(a.difference)||a.fighter.localeCompare(b.fighter));
    const missingJudgments=fighters.filter(row=>row.missingJudgmentInputs.length).map(row=>({fighter:row.fighter,inputs:row.missingJudgmentInputs}));
    const frozenLeaders=[...fighters].filter(row=>Number.isFinite(row.currentScore)).sort((a,b)=>b.currentScore-a.currentScore||a.fighter.localeCompare(b.fighter)).slice(0,15)
      .map(row=>({fighter:row.fighter,score:row.currentScore}));
    const reconstructedLeaders=resolved.slice(0,15).map(row=>({fighter:row.fighter,score:row.reconstructedScore}));

    const report={
      version:VERSION,
      status:'shadow-reconstruction-approved-formula-shared-era-window-not-live',
      applied:true,
      mode:'diagnostic-only-no-live-promotion',
      fighterCount:fighters.length,
      scoredFighterCount:resolved.length,
      controlCoverage:fighters.filter(row=>Number.isFinite(row.currentScore)).length,
      phaseSource:'fighter-era-ledgers',
      eraLedgerVersion:eras.version||null,
      eraLedgerCoverage:fighters.filter(row=>row.stats.windowValid).length,
      missingEraLedgerFighters:fighters.filter(row=>!eraEntryFor(row.fighter)).map(row=>row.fighter),
      categoryLocalPrimeWindowControlsScore:false,
      categoryLocalLongevityContextControlsScore:false,
      modelAsOfDate:modelAsOfDate(),
      gapCapMonths:GAP_CAP_MONTHS,
      fullCreditMonths:FULL_CREDIT_MONTHS,
      fullCreditYears:FULL_CREDIT_MONTHS/12,
      categoryMax:CATEGORY_MAX,
      meaningfulDeltaThreshold:MEANINGFUL_DELTA,
      exactFrozenControlParityCount:exact.length,
      meaningfulDeltaCount:meaningful.length,
      meaningfulDeltas:meaningful.map(row=>({fighter:row.fighter,currentScore:row.currentScore,reconstructedScore:row.reconstructedScore,difference:row.difference,issues:row.issues})),
      storedEraFormulaParityCount:fighters.filter(row=>Number.isFinite(row.storedEraDifference)&&Math.abs(row.storedEraDifference)<=.01).length,
      legacyPatchExplainedFrozenCount:fighters.filter(row=>Number.isFinite(row.legacyPatchDifference)&&Math.abs(row.legacyPatchDifference)<=.02).length,
      missingJudgmentInputCount:missingJudgments.length,
      missingJudgmentInputs:missingJudgments,
      categoryLocalWindowDriftCount:fighters.filter(row=>row.stats.eraLedgerDrift).length,
      cappedGapCount:fighters.reduce((sum,row)=>sum+Number(row.stats.cappedGapCount||0),0),
      openWindowCount:fighters.filter(row=>row.stats.open&&row.stats.windowValid).length,
      nonNeutralStatusMultiplierCount:fighters.filter(row=>row.stats.windowValid&&Math.abs(Number(row.stats.statusMultiplier||1)-1)>.0001).length,
      nonNeutralDivisionMultiplierCount:fighters.filter(row=>row.stats.windowValid&&Math.abs(Number(row.stats.divisionMultiplier||1)-1)>.0001).length,
      formula:'score = min(30, ((gap-capped active UFC elite months × status multiplier × division multiplier) / 144) × 30)',
      methodology:{
        activeEliteYear:'Twelve credited active elite months. Credited months are built from consecutive UFC fight dates inside the shared Fighter Era Ledger window; each inactivity gap is capped at 18 months.',
        phaseBoundary:'Fighter Era Ledger start/end dates are the sole phase source. Fighter-local primeWindow and longevityContext values are drift evidence only.',
        closedWindow:'Credit stops at the shared Era Ledger endpoint.',
        openWindow:'After the latest UFC fight inside an open shared window, time accrues to the canonical model as-of date, capped at 18 months.',
        retirementAndComebackGaps:'Every gap, including retirement, injury, suspension, and comeback gaps, uses the same 18-month cap unless Cody separately approves an explicit exception.',
        noContests:'No-contest UFC appearances do not earn result credit, but they remain activity anchors for Longevity because the category measures active elite relevance.',
        statusMultiplier:'Recovered approved judgment input stored explicitly in fighter-era-ledgers.longevity.statusMultiplier.',
        divisionMultiplier:'Recovered approved judgment input stored explicitly in fighter-era-ledgers.longevity.divisionMultiplier. Removing it or moving division strength outside Longevity is a proposed model change.',
        ceiling:'144 multiplier-adjusted active elite months (12 years) earns 30/30.',
        hiddenAdjustment:'No fighter-level manual numeric adjustment is used by this calculator.'
      },
      sourceAudit:[
        {role:'live category authority',source:'canonical-scoring-records.js → scoring-engine.js',controlsThisReconstruction:false},
        {role:'approved formula evidence',source:'longevity-shadow-scorer.js',controlsThisReconstruction:false},
        {role:'phase and recovered judgment inputs',source:'fighter-era-ledgers.js',controlsThisReconstruction:true},
        {role:'legacy mutation evidence',source:'longevity-canonical-recalculation.js',controlsThisReconstruction:false},
        {role:'rejected Phase Two prototype',source:'canonical-fighter-facts.js derive().longevity → canonical-phase-two-shadow.js',controlsThisReconstruction:false}
      ],
      unresolvedModelQuestions:[
        'Status multipliers are preserved because the frozen approved model uses them; removing or redefining them requires Cody approval.',
        'Division multipliers are preserved because the frozen approved model applies them inside Longevity; moving division strength outside the category requires Cody approval.',
        'Any frozen-score delta not explained by a traced legacy patch, stored Era input, or shared-window factual correction remains a missing judgment input and cannot be promoted live.'
      ],
      frozenLeaders,
      reconstructedLeaders,
      liveDataUnchanged:before===after,
      mutatesRankingData:false,
      fighters,
      entryFor:fighter=>byKey.get(clean(fighter))||null,
      calculateLongevity,
      legacyPatchEvidence:clone(LEGACY_PATCH_EVIDENCE)
    };

    window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION=report;
    document.documentElement.setAttribute('data-canonical-longevity-reconstruction',VERSION);
    return report;
  }

  const report=build();
  if(!report?.applied)window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION=report;
})();
