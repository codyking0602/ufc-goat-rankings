// Opponent Quality reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: canonical UFC wins + explicit opponent-quality judgments -> one approved calculator.
(function(){
  'use strict';

  const VERSION='canonical-opponent-quality-reconstruction-20260714b-royce-hughes-inputs';
  const CATEGORY_MAX=30;
  const LOCKED_BENCHMARK_CREDIT=14.10;
  const RETURNS=Object.freeze([[1,6,1],[7,12,.75],[13,18,.50],[19,999,.25]]);
  const STANDARD_CREDITS=Object.freeze({
    'champion-level':1.25,
    'top-five':1,
    'top-ten':.85,
    ranked:.65,
    solid:.45,
    'name-value':.25,
    minimal:.10,
    none:0
  });
  const OPPONENT_ALIASES=Object.freeze({
    'rampage jackson':'quinton jackson',
    'korean zombie':'chan sung jung',
    'ovince saint preux':'ovince st preux',
    'ovince st. preux':'ovince st preux',
    'jacare souza':'ronaldo souza',
    'shogun rua':'mauricio rua',
    'sean o malley':'sean o malley',
    'julianna pena':'julianna pena',
    'cris cyborg':'cris cyborg',
    'tonya evinger':'tonya evinger'
  });

  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const round6=value=>Math.round((Number(value||0)+Number.EPSILON)*1_000_000)/1_000_000;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
  const stripSuffix=value=>clean(value).replace(/\s+(?:i{1,5}|[1-9])$/i,'').trim();
  const opponentKey=value=>OPPONENT_ALIASES[stripSuffix(value)]||stripSuffix(value);
  const fighterKey=value=>clean(value);
  const rateForSlot=slot=>RETURNS.find(([from,to])=>slot>=from&&slot<=to)?.[2]??.25;

  function legacyTier(label,credit){
    const text=String(label||'').toLowerCase();
    if(text.includes('champion-level'))return'champion-level';
    if(text.includes('elite divisional'))return'champion-level';
    if(text.includes('top-5')||text.includes('top five'))return'top-five';
    if(text.includes('top-10')||text.includes('top ten'))return'top-ten';
    if(text.includes('ranked')||text.includes('quality win'))return'ranked';
    if(text.includes('solid'))return'solid';
    if(text.includes('name-value')||text.includes('faded')||text.includes('unproven'))return'name-value';
    if(text.includes('minimal'))return'minimal';
    if(text.includes('no ufc')||text.includes('no meaningful')||Number(credit)===0)return'none';
    const entries=Object.entries(STANDARD_CREDITS).sort((a,b)=>Math.abs(Number(a[1])-Number(credit))-Math.abs(Number(b[1])-Number(credit))||Number(b[1])-Number(a[1]));
    return entries[0]?.[0]||'none';
  }

  function normalizedLegacyRows(fighter,store){
    const raw=Array.isArray(store?.raw?.[fighter])?store.raw[fighter]:[];
    return raw.map((row,index)=>({
      sourceIndex:index,
      sourceOpponent:String(row?.[0]||''),
      opponentKey:opponentKey(row?.[0]),
      finalCredit:clamp(row?.[1],0,1.25),
      tierLabel:String(row?.[2]||''),
      context:String(row?.[3]||''),
      reviewStatus:String(row?.[4]||'review')
    }));
  }

  function groupCanonicalWins(record){
    const wins=(record?.fights||[]).filter(fight=>fight?.scoringDisposition==='count-win');
    const counts=new Map();
    return wins.map(fight=>{
      const key=opponentKey(fight.opponent);
      const occurrence=(counts.get(key)||0)+1;
      counts.set(key,occurrence);
      return {fight,key,occurrence};
    });
  }

  function matchLegacyRows(record,sourceRows){
    const canonical=groupCanonicalWins(record);
    const groups=new Map();
    canonical.forEach(row=>{
      if(!groups.has(row.key))groups.set(row.key,[]);
      groups.get(row.key).push({...row,used:false});
    });
    const matches=[];
    sourceRows.forEach(source=>{
      const candidates=groups.get(source.opponentKey)||[];
      const target=candidates.find(row=>!row.used)||null;
      if(target)target.used=true;
      matches.push({source,canonical:target,matched:Boolean(target)});
    });
    const byFightId=new Map();
    matches.filter(match=>match.matched).forEach(match=>byFightId.set(match.canonical.fight.id,match.source));
    return {
      byFightId,
      matches,
      unmatchedLegacyRows:matches.filter(match=>!match.matched).map(match=>match.source),
      unmatchedCanonicalWins:Array.from(groups.values()).flat().filter(row=>!row.used)
    };
  }

  function judgmentIndex(approved){
    const rows=approved?.judgments||[];
    const byFighter=new Map();
    rows.forEach((row,index)=>{
      const f=fighterKey(row.fighter);
      if(!byFighter.has(f))byFighter.set(f,[]);
      byFighter.get(f).push({...clone(row),index,used:false});
    });
    return byFighter;
  }

  function approvedJudgmentFor(record,fight,occurrence,index){
    const rows=index.get(fighterKey(record.fighter))||[];
    let row=rows.find(item=>!item.used&&item.fightId&&item.fightId===fight.id);
    if(!row){
      const key=opponentKey(fight.opponent);
      row=rows.find(item=>!item.used&&opponentKey(item.opponent)===key&&Number(item.occurrence||occurrence)===Number(occurrence));
      if(!row)row=rows.find(item=>!item.used&&opponentKey(item.opponent)===key&&!item.occurrence);
    }
    if(row)row.used=true;
    return row||null;
  }

  function explicitAdjustments(baseCredit,finalCredit,provided,note){
    const rows=Array.isArray(provided)?clone(provided):[];
    const delta=round6(Number(finalCredit)-Number(baseCredit));
    const providedTotal=round6(rows.reduce((sum,row)=>sum+Number(row?.value||0),0));
    if(Math.abs(delta-providedTotal)>.000001){
      rows.push({type:'approved-context-decomposition',value:round6(delta-providedTotal),note:note||'Final credit differs from the standard base tier; the difference is stored explicitly.'});
    }
    return rows;
  }

  function inputFromApproved(record,canonical,approved){
    const baseTier=approved.baseTier||canonical.fight?.opponentContext?.qualityTier||'none';
    const baseCredit=Number(STANDARD_CREDITS[baseTier]??approved.baseCredit??0);
    const finalCredit=clamp(approved.finalCredit??baseCredit,0,1.25);
    return {
      fightId:canonical.fight.id,
      fighter:record.fighter,
      opponent:canonical.fight.opponent,
      date:canonical.fight.date,
      event:canonical.fight.event,
      division:canonical.fight.division,
      occurrence:canonical.occurrence,
      baseTier,
      baseCredit:round6(baseCredit),
      adjustments:explicitAdjustments(baseCredit,finalCredit,approved.adjustments,approved.note),
      finalCredit:round6(finalCredit),
      judgmentSource:'cody-approved-explicit-judgment',
      judgmentStatus:approved.judgmentStatus||'cody-approved',
      reviewStatus:'locked',
      note:approved.note||'',
      canonicalQualityTier:canonical.fight?.opponentContext?.qualityTier||'none',
      championStatus:canonical.fight?.opponentContext?.championStatus||'unknown',
      resultContext:canonical.fight?.method?.category==='dq'?'official-dq-win':'normal-official-win',
      provenance:'canonical UFC fight fact + Cody-approved Opponent Quality resolution'
    };
  }

  function inputFromLegacy(record,canonical,legacy){
    const baseTier=legacyTier(legacy.tierLabel,legacy.finalCredit);
    const baseCredit=Number(STANDARD_CREDITS[baseTier]||0);
    const finalCredit=clamp(legacy.finalCredit,0,1.25);
    const delta=round6(finalCredit-baseCredit);
    return {
      fightId:canonical.fight.id,
      fighter:record.fighter,
      opponent:canonical.fight.opponent,
      sourceOpponent:legacy.sourceOpponent,
      date:canonical.fight.date,
      event:canonical.fight.event,
      division:canonical.fight.division,
      occurrence:canonical.occurrence,
      baseTier,
      baseCredit:round6(baseCredit),
      adjustments:Math.abs(delta)>.000001?[{type:'recovered-timing-division-result-context',value:delta,note:legacy.context||'Legacy nonstandard credit decomposed from the nearest approved base tier.'}]:[],
      finalCredit:round6(finalCredit),
      judgmentSource:'approved-legacy-ledger-recovered',
      judgmentStatus:'approved-recovered',
      reviewStatus:legacy.reviewStatus,
      note:legacy.context,
      canonicalQualityTier:canonical.fight?.opponentContext?.qualityTier||'none',
      championStatus:canonical.fight?.opponentContext?.championStatus||'unknown',
      resultContext:canonical.fight?.method?.category==='dq'?'official-dq-win':'normal-official-win',
      provenance:'canonical UFC fight fact + opponent-quality legacy ledger'
    };
  }

  function inputFromCanonical(record,canonical){
    const baseTier=canonical.fight?.opponentContext?.qualityTier||'none';
    const baseCredit=Number(STANDARD_CREDITS[baseTier]||0);
    return {
      fightId:canonical.fight.id,
      fighter:record.fighter,
      opponent:canonical.fight.opponent,
      date:canonical.fight.date,
      event:canonical.fight.event,
      division:canonical.fight.division,
      occurrence:canonical.occurrence,
      baseTier,
      baseCredit:round6(baseCredit),
      adjustments:[],
      finalCredit:round6(baseCredit),
      judgmentSource:'canonical-reviewed-quality-tier',
      judgmentStatus:'approved-canonical-recovered',
      reviewStatus:canonical.fight?.opponentContext?.reviewStatus||'locked',
      note:canonical.fight?.opponentContext?.note||'Canonical reviewed opponent-quality tier used because the legacy ledger omitted this official UFC win.',
      canonicalQualityTier:baseTier,
      championStatus:canonical.fight?.opponentContext?.championStatus||'unknown',
      resultContext:canonical.fight?.method?.category==='dq'?'official-dq-win':'normal-official-win',
      provenance:'canonical UFC fight fact and reviewed opponentContext quality tier'
    };
  }

  function calculateOpponentQuality(inputs,fighterAdjustment=0,benchmark=LOCKED_BENCHMARK_CREDIT){
    const sorted=(Array.isArray(inputs)?clone(inputs):[]).sort((a,b)=>Number(b.finalCredit)-Number(a.finalCredit)||String(a.date).localeCompare(String(b.date))||String(a.opponent).localeCompare(String(b.opponent))).map((row,index)=>{
      const slot=index+1;
      const countedRate=rateForSlot(slot);
      const countedCredit=Number(row.finalCredit||0)*countedRate;
      return {...row,slot,countedRate:round6(countedRate),countedCredit:round6(countedCredit)};
    });
    const rawCredit=sorted.reduce((sum,row)=>sum+Number(row.finalCredit||0),0);
    const preAdjustmentDiminishedCredit=sorted.reduce((sum,row)=>sum+Number(row.countedCredit||0),0);
    const diminishedCredit=Math.max(0,preAdjustmentDiminishedCredit+Number(fighterAdjustment||0));
    const score=round2(clamp((diminishedCredit/Number(benchmark||1))*CATEGORY_MAX,0,CATEGORY_MAX));
    return {
      rows:sorted,
      rawCredit:round6(rawCredit),
      preAdjustmentDiminishedCredit:round6(preAdjustmentDiminishedCredit),
      fighterAdjustment:round6(fighterAdjustment),
      diminishedCredit:round6(diminishedCredit),
      score,
      benchmarkCredit:Number(benchmark),
      categoryMax:CATEGORY_MAX
    };
  }

  function removalIndex(approved){
    const map=new Map();
    (approved?.legacyRowsToRemove||[]).forEach(row=>map.set(`${fighterKey(row.fighter)}|${opponentKey(row.opponent)}`,row));
    return map;
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    const legacy=window.UFC_OPPONENT_QUALITY_LEDGERS;
    const approved=window.UFC_CANONICAL_OPPONENT_QUALITY_APPROVED_JUDGMENTS;
    const factCorrections=window.UFC_CANONICAL_FIGHTER_FACTS_OPPONENT_QUALITY_CORRECTIONS;
    const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    if(!facts||facts.count?.()!==73||!controls||!legacy?.raw||!approved?.applied){
      return {version:VERSION,applied:false,error:'Opponent Quality reconstruction prerequisites are incomplete.',fighterCount:facts?.count?.()||0,controlCount:controls?.rosterCount||0,legacyLoaded:Boolean(legacy?.raw),approvedJudgmentsLoaded:Boolean(approved?.applied),mutatesRankingData:false};
    }

    const excluded=new Set(approved.excludedFighters||[]);
    const approvedIndex=judgmentIndex(approved);
    const approvedRemovalIndex=removalIndex(approved);
    const allRecords=facts.list();
    const fighters=[];
    const removedLegacyRows=[];

    allRecords.filter(record=>!excluded.has(record.fighter)).forEach(record=>{
      const control=controls.entryFor(record.fighter);
      const sourceRows=normalizedLegacyRows(record.fighter,legacy);
      const matching=matchLegacyRows(record,sourceRows);
      const canonicalWins=groupCanonicalWins(record);
      const inputs=canonicalWins.map(canonical=>{
        const explicit=approvedJudgmentFor(record,canonical.fight,canonical.occurrence,approvedIndex);
        if(explicit)return inputFromApproved(record,canonical,explicit);
        const legacyRow=matching.byFightId.get(canonical.fight.id);
        if(legacyRow)return inputFromLegacy(record,canonical,legacyRow);
        return inputFromCanonical(record,canonical);
      });

      const fighterAdjustment=Number(approved.fighterLevelAdjustments?.[record.fighter]||0);
      const calculated=calculateOpponentQuality(inputs,fighterAdjustment);
      const currentScore=Number.isFinite(Number(control?.opponentQuality))?round2(control.opponentQuality):null;
      const difference=Number.isFinite(currentScore)?round2(calculated.score-currentScore):null;
      const canonicalFightIds=new Set(canonicalWins.map(row=>row.fight.id));
      const duplicateInputFightIds=inputs.map(row=>row.fightId).filter((id,index,all)=>all.indexOf(id)!==index);
      const missingInputFightIds=Array.from(canonicalFightIds).filter(id=>!inputs.some(row=>row.fightId===id));

      const removedForFighter=matching.unmatchedLegacyRows.map(row=>{
        const approvedRemoval=approvedRemovalIndex.get(`${fighterKey(record.fighter)}|${row.opponentKey}`)||null;
        return {
          fighter:record.fighter,
          sourceOpponent:row.sourceOpponent,
          legacyCredit:row.finalCredit,
          legacyTier:row.tierLabel,
          reason:approvedRemoval?.reason||'Legacy row has no matching canonical official UFC win and is excluded under the approved UFC-only canonical-facts rule.',
          resolutionStatus:approvedRemoval?.status||'approved-canonical-exclusion',
          explicitlyListed:Boolean(approvedRemoval)
        };
      });
      removedLegacyRows.push(...removedForFighter);

      const notices=[];
      if(!sourceRows.length)notices.push({classification:'recovered judgment',reason:'No legacy Opponent Quality ledger was loaded; all official UFC wins were reconstructed from canonical reviewed quality tiers and explicit approved overrides.'});
      const canonicalFallbackCount=inputs.filter(row=>row.judgmentSource==='canonical-reviewed-quality-tier').length;
      if(canonicalFallbackCount)notices.push({classification:'recovered judgment',reason:`${canonicalFallbackCount} official UFC win(s) missing from the legacy Opponent Quality ledger were recovered from canonical reviewed quality tiers.`});
      if(removedForFighter.length)notices.push({classification:'factual correction',reason:`${removedForFighter.length} legacy row(s) were excluded because they do not match canonical official UFC wins.`});
      if(Number.isFinite(difference)&&Math.abs(difference)>.01)notices.push({classification:'approved factual correction / recovered judgment',reason:`The clean calculated score changes by ${difference>0?'+':''}${difference.toFixed(2)} from the frozen approved control after the Cody-approved complete-ledger reconstruction.`});

      fighters.push({
        fighter:record.fighter,
        board:record.board,
        currentScore,
        reconstructedScore:calculated.score,
        difference,
        scoreStatus:Number.isFinite(difference)&&Math.abs(difference)<=.01?'exact-approved-control-parity':'cody-approved-recalculation-delta',
        canonicalWinCount:canonicalWins.length,
        inputCount:inputs.length,
        legacyRowCount:sourceRows.length,
        canonicalFallbackCount,
        explicitApprovedJudgmentCount:inputs.filter(row=>row.judgmentSource==='cody-approved-explicit-judgment').length,
        recoveredLegacyJudgmentCount:inputs.filter(row=>row.judgmentSource==='approved-legacy-ledger-recovered').length,
        removedLegacyRowCount:removedForFighter.length,
        duplicateInputFightIds,
        missingInputFightIds,
        rawCredit:calculated.rawCredit,
        preAdjustmentDiminishedCredit:calculated.preAdjustmentDiminishedCredit,
        fighterAdjustment:calculated.fighterAdjustment,
        diminishedCredit:calculated.diminishedCredit,
        benchmarkCredit:calculated.benchmarkCredit,
        topFiveWins:calculated.rows.filter(row=>Number(row.finalCredit)>=1).length,
        championLevelWins:calculated.rows.filter(row=>Number(row.finalCredit)>=1.15).length,
        rankedQualityWins:calculated.rows.filter(row=>Number(row.finalCredit)>=.65).length,
        inputs:calculated.rows,
        removedLegacyRows:removedForFighter,
        notices
      });
    });

    const unusedApprovedJudgments=Array.from(approvedIndex.values()).flat().filter(row=>!row.used).map(row=>({fighter:row.fighter,opponent:row.opponent,occurrence:row.occurrence||null,fightId:row.fightId||null,required:row.required!==false,note:row.note||''}));
    const missingRequiredApprovedJudgments=unusedApprovedJudgments.filter(row=>row.required);
    const duplicateInputFightIds=fighters.flatMap(row=>row.duplicateInputFightIds.map(fightId=>({fighter:row.fighter,fightId})));
    const missingInputFightIds=fighters.flatMap(row=>row.missingInputFightIds.map(fightId=>({fighter:row.fighter,fightId})));
    const controlled=fighters.filter(row=>Number.isFinite(row.currentScore));
    const exact=controlled.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)<=.01);
    const differences=controlled.filter(row=>!Number.isFinite(row.difference)||Math.abs(row.difference)>.01);
    const after=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    const byKey=new Map(fighters.map(row=>[fighterKey(row.fighter),row]));
    const namedNine=['Benson Henderson','Fabricio Werdum','Glover Teixeira','Frank Shamrock','Rashad Evans','Vitor Belfort','Mauricio "Shogun" Rua','Forrest Griffin','Royce Gracie'].map(name=>byKey.get(fighterKey(name))).filter(Boolean);
    const report={
      version:VERSION,
      status:'shadow-reconstruction-approved-review-complete',
      applied:true,
      mode:'approved-model-reconstruction-shadow-only',
      fighterCount:fighters.length,
      excludedFighters:Array.from(excluded),
      canonicalControlCoverage:controlled.length,
      exactParityCount:exact.length,
      calculatedDifferenceCount:differences.length,
      canonicalWinCount:fighters.reduce((sum,row)=>sum+row.canonicalWinCount,0),
      inputCount:fighters.reduce((sum,row)=>sum+row.inputCount,0),
      legacyRowCount:fighters.reduce((sum,row)=>sum+row.legacyRowCount,0),
      removedLegacyRowCount:removedLegacyRows.length,
      explicitlyApprovedRemovalCount:removedLegacyRows.filter(row=>row.explicitlyListed).length,
      canonicalFallbackCount:fighters.reduce((sum,row)=>sum+row.canonicalFallbackCount,0),
      explicitApprovedJudgmentCount:fighters.reduce((sum,row)=>sum+row.explicitApprovedJudgmentCount,0),
      recoveredLegacyJudgmentCount:fighters.reduce((sum,row)=>sum+row.recoveredLegacyJudgmentCount,0),
      duplicateInputFightIds,
      missingInputFightIds,
      unusedApprovedJudgments,
      missingRequiredApprovedJudgments,
      unresolvedConflictCount:duplicateInputFightIds.length+missingInputFightIds.length+missingRequiredApprovedJudgments.length,
      remainingConflictCount:duplicateInputFightIds.length+missingInputFightIds.length+missingRequiredApprovedJudgments.length,
      proposedModelChangeCount:0,
      allApprovedConflictsResolved:duplicateInputFightIds.length===0&&missingInputFightIds.length===0&&missingRequiredApprovedJudgments.length===0,
      benchmarkCredit:LOCKED_BENCHMARK_CREDIT,
      categoryMax:CATEGORY_MAX,
      creditScale:clone(STANDARD_CREDITS),
      diminishingReturns:clone(RETURNS),
      formula:'Sort final UFC win credits high-to-low. Wins 1-6 count 100%, 7-12 count 75%, 13-18 count 50%, 19+ count 25%. (diminished credit + explicit fighter adjustment) / 14.10 * 30, capped at 30 and rounded to 2 decimals.',
      inputSeparationNote:'Every row exposes canonical fight fact, standard base tier, explicit adjustment list, final credit, diminishing-return slot, and counted credit. No finish bonus, performance bonus, blanket division multiplier, future-name back-credit, or hidden fighter haircut is applied.',
      frontEndTerminology:'Top-5 Wins',
      factCorrectionReport:factCorrections||null,
      liveDataUnchanged:before===after,
      mutatesRankingData:false,
      scoreDifferences:differences.map(row=>({fighter:row.fighter,currentScore:row.currentScore,reconstructedScore:row.reconstructedScore,difference:row.difference})),
      nineFormerHiddenOverrides:namedNine.map(row=>({fighter:row.fighter,currentScore:row.currentScore,reconstructedScore:row.reconstructedScore,difference:row.difference,canonicalWinCount:row.canonicalWinCount,inputCount:row.inputCount,fighterAdjustment:row.fighterAdjustment,scoreSource:'calculated-complete-ledger'})),
      removedLegacyRows,
      fighters,
      entryFor:fighter=>byKey.get(fighterKey(fighter))||null,
      calculateOpponentQuality:(inputs,fighterAdjustment,benchmark)=>calculateOpponentQuality(inputs,fighterAdjustment,benchmark)
    };
    window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION=report;
    document.documentElement.setAttribute('data-canonical-opponent-quality-reconstruction',VERSION);
    return report;
  }

  const report=build();
  if(!report?.applied)window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION=report;
})();
