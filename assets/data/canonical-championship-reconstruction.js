// Championship reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: recovers the approved Championship model from the legacy title ledgers,
// connects every recovered judgment row to canonical UFC fight facts where possible,
// and compares the result with the approved 73-fighter parity snapshot.
(function(){
  'use strict';

  const VERSION='canonical-championship-reconstruction-20260714a';
  const CATEGORY_MAX=30;
  const LOCKED_BENCHMARK_CREDIT=14.54;
  const BASE_CREDIT=Object.freeze({
    normal:1,
    interim:.75,
    'vacant-undisputed':.90,
    'second-division-undisputed':1.25,
    'vacant-second-division':1.15
  });
  const OFFICIAL_TITLE_TYPES=new Set(Object.keys(BASE_CREDIT));
  const CONTEXT_WORDS=/\b(aged|close|context|controversial|cut|depth|dq|era|historic|injur|interim|layoff|missed weight|old|questionable|repeat|replacement|short-notice|soft|timing|tuf|vacant|weird|weight-cut)\b/i;
  const OPPONENT_ALIASES=Object.freeze({
    'rampage jackson':'quinton jackson',
    'korean zombie':'chan sung jung',
    'ovince saint preux':'ovince st preux',
    'ovince st. preux':'ovince st preux',
    'jacare souza':'ronaldo souza',
    'shogun rua':'mauricio rua'
  });

  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));
  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
  const stripBoutSuffix=value=>clean(value).replace(/\s+(?:i{1,4}|v|[1-9])$/i,'').trim();
  const opponentKey=value=>OPPONENT_ALIASES[stripBoutSuffix(value)]||stripBoutSuffix(value);
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

  function titleType(value){
    const normalized=String(value||'normal').replace(/[-_ ]+/g,'').toLowerCase();
    if(normalized==='interim')return'interim';
    if(normalized==='vacant'||normalized==='vacantundisputed')return'vacant-undisputed';
    if(normalized==='seconddivisionundisputed'||normalized==='secondbelt')return'second-division-undisputed';
    if(normalized==='vacantseconddivision'||normalized==='vacantsecondbelt')return'vacant-second-division';
    return'normal';
  }

  function tokenSimilarity(left,right){
    const a=new Set(opponentKey(left).split(' ').filter(Boolean));
    const b=new Set(opponentKey(right).split(' ').filter(Boolean));
    if(!a.size||!b.size)return 0;
    let shared=0;
    a.forEach(token=>{if(b.has(token))shared+=1;});
    return shared/Math.max(a.size,b.size);
  }

  function canonicalTitleWins(record){
    return (record?.fights||[]).filter(fight=>
      fight?.scoringDisposition==='count-win'&&
      fight?.championshipContext?.fighterEligible!==false&&
      OFFICIAL_TITLE_TYPES.has(fight?.championshipContext?.type)
    );
  }

  function matchJudgments(record,sourceRows){
    const remaining=canonicalTitleWins(record).map((fight,index)=>({fight,index,used:false}));
    const matches=[];
    sourceRows.forEach((source,sourceIndex)=>{
      const sourceKey=opponentKey(source?.opponent);
      let candidate=remaining.find(row=>!row.used&&opponentKey(row.fight?.opponent)===sourceKey);
      let method='exact-opponent-order';
      let confidence=1;
      if(!candidate){
        const scored=remaining.filter(row=>!row.used).map(row=>({...row,similarity:tokenSimilarity(source?.opponent,row.fight?.opponent)})).sort((a,b)=>b.similarity-a.similarity||a.index-b.index);
        if(scored[0]?.similarity>=.67&&(scored.length===1||scored[0].similarity>scored[1].similarity)){
          candidate=scored[0];
          method='unique-token-match';
          confidence=round2(candidate.similarity);
        }
      }
      if(candidate)candidate.used=true;
      matches.push({source,sourceIndex,fight:candidate?.fight||null,matchMethod:candidate?method:'unmatched-legacy-row',matchConfidence:candidate?confidence:0});
    });
    return {matches,unmatchedCanonicalWins:remaining.filter(row=>!row.used).map(row=>row.fight)};
  }

  function recoveredInput(match){
    const source=match.source||{};
    const legacyTitleType=titleType(source.titleType||source.type);
    const canonicalType=match.fight?.championshipContext?.type||null;
    const baseCredit=Number(BASE_CREDIT[legacyTitleType]||1);
    const opponentStrength=clamp(source.strength??source.multiplier??1,0,1.5);
    const eraTitleContextAdjustment=1;
    const finalAdjustedCredit=round2(baseCredit*opponentStrength*eraTitleContextAdjustment);
    const note=String(source.notes||'').trim();
    const combinedContext=opponentStrength!==1&&CONTEXT_WORDS.test(note);
    return {
      fightId:match.fight?.id||null,
      opponent:match.fight?.opponent||source.opponent||'Unknown opponent',
      sourceOpponent:source.opponent||null,
      date:match.fight?.date||null,
      event:match.fight?.event||null,
      titleType:legacyTitleType,
      canonicalTitleType:canonicalType,
      baseCredit:round2(baseCredit),
      opponentStrength:round2(opponentStrength),
      eraTitleContextAdjustment:round2(eraTitleContextAdjustment),
      legacyCombinedAdjustment:round2(opponentStrength),
      finalAdjustedCredit,
      sourceAdjustedCredit:round2(source.adjustedCredit??finalAdjustedCredit),
      reviewStatus:source.reviewStatus||'locked',
      notes:note,
      matchMethod:match.matchMethod,
      matchConfidence:match.matchConfidence,
      decompositionStatus:combinedContext?'legacy multiplier combines opponent/era/context; split not separately recoverable':'opponent-strength field recovered directly',
      titleTypeMatchesCanonical:canonicalType===legacyTitleType,
      provenance:'championship-resume-ledgers + championship-resume-ledger-rule-locks'
    };
  }

  function calculateChampionship(inputs,benchmark=LOCKED_BENCHMARK_CREDIT){
    const rows=Array.isArray(inputs)?inputs:[];
    const adjustedTitleCredit=round2(rows.reduce((sum,row)=>sum+Number(row?.finalAdjustedCredit||0),0));
    const score=round2(clamp((adjustedTitleCredit/Number(benchmark||1))*CATEGORY_MAX,0,CATEGORY_MAX));
    return {adjustedTitleCredit,score,benchmarkCredit:Number(benchmark),categoryMax:CATEGORY_MAX};
  }

  function snapshotScoreFor(fighter){
    const rows=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[]),...(window.RANKING_DATA?.fighters||[])];
    const row=rows.find(candidate=>clean(candidate?.fighter)===clean(fighter));
    return Number.isFinite(Number(row?.championship))?round2(row.championship):null;
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    const legacy=window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;
    const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    if(!facts||facts.count?.()!==73||!controls||controls.rosterCount!==73||!legacy?.ledgers){
      return {version:VERSION,applied:false,error:'Championship reconstruction prerequisites are incomplete.',fighterCount:facts?.count?.()||0,controlCount:controls?.rosterCount||0,ledgerLoaded:Boolean(legacy?.ledgers),mutatesRankingData:false};
    }

    const fighters=facts.list().map(record=>{
      const sourceRows=clone(legacy.getLedger?.(record.fighter)?.championshipWins||legacy.ledgers?.[record.fighter]?.championshipWins||[]);
      const matched=matchJudgments(record,sourceRows);
      const inputs=matched.matches.map(recoveredInput);
      const calculated=calculateChampionship(inputs);
      const control=controls.entryFor(record.fighter);
      const currentScore=round2(control?.championship||0);
      const difference=round2(calculated.score-currentScore);
      const unmatchedLegacyRows=inputs.filter(row=>!row.fightId);
      const titleTypeConflicts=inputs.filter(row=>row.fightId&&!row.titleTypeMatchesCanonical);
      const arithmeticConflicts=inputs.filter(row=>Math.abs(row.finalAdjustedCredit-row.sourceAdjustedCredit)>.01);
      const issues=[];
      unmatchedLegacyRows.forEach(row=>issues.push({classification:'recovered judgment',reason:`Legacy title judgment for ${row.sourceOpponent||row.opponent} is not yet connected to a canonical fight ID.`}));
      matched.unmatchedCanonicalWins.forEach(fight=>issues.push({classification:'factual correction',reason:`Canonical title win over ${fight.opponent} has no recovered approved Championship judgment row.`}));
      titleTypeConflicts.forEach(row=>issues.push({classification:'factual correction',reason:`Title type conflict for ${row.opponent}: approved input=${row.titleType}, canonical fact=${row.canonicalTitleType}.`}));
      arithmeticConflicts.forEach(row=>issues.push({classification:'recovered judgment',reason:`Recovered credit arithmetic differs for ${row.opponent}: source=${row.sourceAdjustedCredit}, reconstructed=${row.finalAdjustedCredit}.`}));
      if(Math.abs(difference)>.01)issues.push({classification:'recovered judgment',reason:`Reconstructed score differs from the approved parity control by ${difference>0?'+':''}${difference.toFixed(2)}.`});
      const exactReason=Math.abs(difference)<=.01
        ?`Recovered ${inputs.length} approved title-win judgments for exact ${currentScore.toFixed(2)}/30 parity${issues.length?`; ${issues.length} provenance/fact issue(s) remain visible.`:'.'}`
        :`Recovered title inputs calculate ${calculated.score.toFixed(2)}/30 versus approved ${currentScore.toFixed(2)}/30; review the listed provenance/fact issues.`;
      return {
        fighter:record.fighter,
        board:record.board,
        currentScore,
        reconstructedScore:calculated.score,
        difference,
        classification:'recovered judgment',
        exactReason,
        staticPayloadScore:snapshotScoreFor(record.fighter),
        titleFightWins:inputs.length,
        adjustedTitleCredit:calculated.adjustedTitleCredit,
        benchmarkCredit:calculated.benchmarkCredit,
        inputs,
        unmatchedLegacyRows:unmatchedLegacyRows.map(row=>({opponent:row.sourceOpponent||row.opponent,titleType:row.titleType,credit:row.finalAdjustedCredit})),
        unmatchedCanonicalWins:matched.unmatchedCanonicalWins.map(fight=>({fightId:fight.id,opponent:fight.opponent,titleType:fight?.championshipContext?.type||null})),
        titleTypeConflicts:titleTypeConflicts.map(row=>({fightId:row.fightId,opponent:row.opponent,approvedTitleType:row.titleType,canonicalTitleType:row.canonicalTitleType})),
        issues
      };
    }).sort((a,b)=>b.currentScore-a.currentScore||a.fighter.localeCompare(b.fighter));

    const after=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    const byKey=new Map(fighters.map(row=>[clean(row.fighter),row]));
    const parityRows=fighters.filter(row=>Math.abs(row.difference)<=.01);
    const issueRows=fighters.filter(row=>row.issues.length);
    const randy=byKey.get(clean('Randy Couture'))||null;
    const report={
      version:VERSION,
      status:'shadow-reconstruction',
      applied:true,
      mode:'approved-model-reconstruction-diagnostic-only',
      fighterCount:fighters.length,
      controlCoverage:fighters.filter(row=>Number.isFinite(row.currentScore)).length,
      exactParityCount:parityRows.length,
      differenceCount:fighters.length-parityRows.length,
      issueFighterCount:issueRows.length,
      issueCount:issueRows.reduce((sum,row)=>sum+row.issues.length,0),
      unmatchedLegacyRowCount:fighters.reduce((sum,row)=>sum+row.unmatchedLegacyRows.length,0),
      unmatchedCanonicalWinCount:fighters.reduce((sum,row)=>sum+row.unmatchedCanonicalWins.length,0),
      titleTypeConflictCount:fighters.reduce((sum,row)=>sum+row.titleTypeConflicts.length,0),
      proposedModelChangeCount:0,
      benchmarkCredit:LOCKED_BENCHMARK_CREDIT,
      categoryMax:CATEGORY_MAX,
      formula:'sum(round2(baseCredit × opponentStrength × eraTitleContextAdjustment)) ÷ 14.54 × 30',
      inputSeparationNote:'The approved legacy strength field is recovered as opponentStrength with eraTitleContextAdjustment=1. Notes that combine opponent, era, and unusual context are explicitly flagged because the historical model did not store a trustworthy split.',
      liveDataUnchanged:before===after,
      mutatesRankingData:false,
      fighters,
      randyTrace:randy,
      entryFor:fighter=>byKey.get(clean(fighter))||null,
      calculateChampionship:(inputs,benchmark)=>calculateChampionship(inputs,benchmark)
    };
    window.UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION=report;
    document.documentElement.setAttribute('data-canonical-championship-reconstruction',VERSION);
    return report;
  }

  const report=build();
  if(!report?.applied)window.UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION=report;
})();
