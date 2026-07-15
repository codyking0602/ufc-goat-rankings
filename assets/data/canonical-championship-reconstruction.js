// Championship reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: recovers the approved Championship model from legacy title ledgers,
// connects judgment inputs to canonical UFC fight facts, and exposes every gap.
(function(){
  'use strict';

  const VERSION='canonical-championship-reconstruction-20260714e-approved-conflicts';
  const CATEGORY_MAX=30;
  const LOCKED_BENCHMARK_CREDIT=14.54;
  const BASE_CREDIT=Object.freeze({
    normal:1,
    interim:.75,
    'vacant-undisputed':.90,
    'second-division-undisputed':1.25,
    'vacant-second-division':1.15,
    tournament:.85
  });
  const OFFICIAL_TITLE_TYPES=new Set(['normal','interim','vacant-undisputed','second-division-undisputed','vacant-second-division']);
  const CHAMPIONSHIP_WIN_TYPES=new Set([...OFFICIAL_TITLE_TYPES,'tournament']);
  const CONTEXT_WORDS=/\b(aged|close|context|controversial|cut|depth|dq|era|historic|injur|interim|layoff|missed weight|old|questionable|repeat|replacement|short-notice|soft|timing|tuf|vacant|weird|weight-cut)\b/i;
  const OPPONENT_ALIASES=Object.freeze({
    'rampage jackson':'quinton jackson',
    'korean zombie':'chan sung jung',
    'ovince saint preux':'ovince st preux',
    'ovince st. preux':'ovince st preux',
    'jacare souza':'ronaldo souza',
    'shogun rua':'mauricio rua'
  });

  // These fighters had approved live Championship scores but no direct legacy title ledger.
  // Seed credits recover the lost aggregate judgment shape; a visible uniform context factor
  // reconciles them exactly to the frozen approved score. Nothing here changes that score.
  const AGGREGATE_RECOVERY_SEEDS=Object.freeze({
    'Benson Henderson':[1,.95,.85,.85],
    'Frank Shamrock':[.70,.60,.60,.55,.55],
    // Canonical facts tag all 11 early tournament wins as tournament context. Only the
    // three tournament-clinching finals receive recovered Championship credit here.
    'Royce Gracie':[0,0,.85,0,0,0,.80,0,0,0,.70],
    'Cris Cyborg':[.75,.90,.675],
    'Fabricio Werdum':[.75,.90],
    'Vitor Belfort':[.25,.85],
    'Glover Teixeira':[1],
    'Forrest Griffin':[.95],
    'Mauricio "Shogun" Rua':[.95],
    'Rashad Evans':[.90]
  });

  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const round6=value=>Math.round((Number(value||0)+Number.EPSILON)*1_000_000)/1_000_000;
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
    if(normalized==='tournament')return'tournament';
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

  function canonicalChampionshipWins(record,includeTournaments=false){
    const allowed=includeTournaments?CHAMPIONSHIP_WIN_TYPES:OFFICIAL_TITLE_TYPES;
    return (record?.fights||[]).filter(fight=>
      fight?.scoringDisposition==='count-win'&&
      fight?.championshipContext?.fighterEligible!==false&&
      allowed.has(fight?.championshipContext?.type)
    );
  }

  function matchJudgments(record,sourceRows){
    const remaining=canonicalChampionshipWins(record,false).map((fight,index)=>({fight,index,used:false}));
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
    const opponentStrength=clamp(source.opponentStrength??source.strength??source.multiplier??1,0,1.5);
    const eraTitleContextAdjustment=clamp(source.eraTitleContextAdjustment??source.contextAdjustment??1,0,1.5);
    const finalAdjustedCredit=round2(baseCredit*opponentStrength*eraTitleContextAdjustment);
    const note=String(source.notes||'').trim();
    const explicitContext=eraTitleContextAdjustment!==1;
    const combinedContext=!explicitContext&&opponentStrength!==1&&CONTEXT_WORDS.test(note);
    return {
      fightId:match.fight?.id||null,
      opponent:match.fight?.opponent||source.opponent||'Unknown opponent',
      sourceOpponent:source.opponent||null,
      date:match.fight?.date||null,
      event:match.fight?.event||null,
      titleType:legacyTitleType,
      canonicalTitleType:canonicalType,
      officialTitleFight:OFFICIAL_TITLE_TYPES.has(canonicalType||legacyTitleType),
      baseCredit:round6(baseCredit),
      opponentStrength:round6(opponentStrength),
      eraTitleContextAdjustment:round6(eraTitleContextAdjustment),
      legacyCombinedAdjustment:round6(opponentStrength*eraTitleContextAdjustment),
      finalAdjustedCredit,
      sourceAdjustedCredit:round2(source.adjustedCredit??finalAdjustedCredit),
      reviewStatus:source.reviewStatus||'locked',
      notes:note,
      matchMethod:match.matchMethod,
      matchConfidence:match.matchConfidence,
      judgmentStatus:'approved-recovered',
      decompositionStatus:explicitContext?'opponent strength and era/title context stored separately':combinedContext?'legacy multiplier combines opponent/era/context; split not separately recoverable':'opponent-strength field recovered directly',
      titleTypeMatchesCanonical:canonicalType===legacyTitleType,
      provenance:'championship-resume-ledgers + championship-resume-ledger-rule-locks'
    };
  }

  function pendingCanonicalInput(fight,hasApprovedControl){
    const canonicalType=fight?.championshipContext?.type||'normal';
    const baseCredit=Number(BASE_CREDIT[canonicalType]||1);
    return {
      fightId:fight?.id||null,
      opponent:fight?.opponent||'Unknown opponent',
      sourceOpponent:null,
      date:fight?.date||null,
      event:fight?.event||null,
      titleType:canonicalType,
      canonicalTitleType:canonicalType,
      officialTitleFight:OFFICIAL_TITLE_TYPES.has(canonicalType),
      baseCredit:round6(baseCredit),
      opponentStrength:null,
      eraTitleContextAdjustment:null,
      legacyCombinedAdjustment:null,
      finalAdjustedCredit:hasApprovedControl?0:null,
      sourceAdjustedCredit:null,
      reviewStatus:'high-risk-review',
      notes:hasApprovedControl?'Canonical UFC title win is absent from the approved legacy Championship control. It is shown at zero pending Cody review so the approved score does not silently change.':'Canonical UFC title win has no approved live Championship score or judgment input.',
      matchMethod:'canonical-fact-without-approved-judgment',
      matchConfidence:1,
      judgmentStatus:hasApprovedControl?'pending-factual-correction-zero-credit':'pending-no-approved-control',
      decompositionStatus:'No approved judgment input exists.',
      titleTypeMatchesCanonical:true,
      provenance:'canonical fighter facts only'
    };
  }

  function aggregateRecoveredInputs(record,currentScore,seeds){
    const fights=canonicalChampionshipWins(record,true);
    if(!Array.isArray(seeds)||fights.length!==seeds.length)return {inputs:[],error:`Aggregate recovery expected ${seeds?.length||0} Championship-tagged wins but canonical facts contain ${fights.length}.`};
    const targetCredit=Number(currentScore)*LOCKED_BENCHMARK_CREDIT/CATEGORY_MAX;
    const seedTotal=seeds.reduce((sum,value)=>sum+Number(value||0),0);
    const contextFactor=seedTotal?targetCredit/seedTotal:0;
    const inputs=fights.map((fight,index)=>{
      const canonicalType=fight?.championshipContext?.type||'normal';
      const baseCredit=Number(BASE_CREDIT[canonicalType]||1);
      const seedCredit=Number(seeds[index]||0);
      const opponentStrength=baseCredit?seedCredit/baseCredit:0;
      const finalAdjustedCredit=seedCredit*contextFactor;
      return {
        fightId:fight.id,
        opponent:fight.opponent,
        sourceOpponent:fight.opponent,
        date:fight.date,
        event:fight.event,
        titleType:canonicalType,
        canonicalTitleType:canonicalType,
        officialTitleFight:OFFICIAL_TITLE_TYPES.has(canonicalType),
        baseCredit:round6(baseCredit),
        opponentStrength:round6(opponentStrength),
        eraTitleContextAdjustment:round6(contextFactor),
        legacyCombinedAdjustment:round6(opponentStrength*contextFactor),
        finalAdjustedCredit:round6(finalAdjustedCredit),
        sourceAdjustedCredit:null,
        reviewStatus:'review',
        notes:seedCredit>0?'Approved aggregate Championship score recovered from the live control; exact historical per-fight split was not stored.':'Tournament bout is canonical context but not a tournament-clinching Championship accomplishment; recovered credit is zero.',
        matchMethod:'aggregate-control-recovery',
        matchConfidence:1,
        judgmentStatus:seedCredit>0?'approved-aggregate-recovered-review':'approved-aggregate-context-zero',
        decompositionStatus:seedCredit>0?'Aggregate judgment recovered exactly; per-fight opponent/context split remains reviewable.':'Canonical tournament context retained with no Championship credit.',
        titleTypeMatchesCanonical:true,
        provenance:'approved canonical scoring control + canonical fighter facts + explicit recovery seed'
      };
    });
    return {inputs,error:null,targetCredit:round6(targetCredit),seedTotal:round6(seedTotal),contextFactor:round6(contextFactor),creditedRowCount:inputs.filter(row=>Number(row.finalAdjustedCredit)>0).length};
  }

  function calculateChampionship(inputs,benchmark=LOCKED_BENCHMARK_CREDIT){
    const rows=Array.isArray(inputs)?inputs:[];
    if(rows.some(row=>row?.finalAdjustedCredit===null||row?.finalAdjustedCredit===undefined))return {adjustedTitleCredit:null,score:null,benchmarkCredit:Number(benchmark),categoryMax:CATEGORY_MAX};
    const adjustedTitleCredit=rows.reduce((sum,row)=>sum+Number(row?.finalAdjustedCredit||0),0);
    const score=round2(clamp((adjustedTitleCredit/Number(benchmark||1))*CATEGORY_MAX,0,CATEGORY_MAX));
    return {adjustedTitleCredit:round6(adjustedTitleCredit),score,benchmarkCredit:Number(benchmark),categoryMax:CATEGORY_MAX};
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
    const ruleLocks=window.UFC_CHAMPIONSHIP_RESUME_LEDGER_RULE_LOCKS;
    const approvedScoreCorrections=ruleLocks?.approvedScoreCorrections||{};
    const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    if(!facts||facts.count?.()!==73||!controls||!legacy?.ledgers){
      return {version:VERSION,applied:false,error:'Championship reconstruction prerequisites are incomplete.',fighterCount:facts?.count?.()||0,controlCount:controls?.rosterCount||0,ledgerLoaded:Boolean(legacy?.ledgers),mutatesRankingData:false};
    }

    const fighters=facts.list().map(record=>{
      const control=controls.entryFor(record.fighter);
      const staticPayloadScore=snapshotScoreFor(record.fighter);
      const originalControlScore=control?round2(control.championship):staticPayloadScore;
      const approvedScoreCorrection=Number.isFinite(Number(approvedScoreCorrections[record.fighter]))?round2(approvedScoreCorrections[record.fighter]):null;
      const currentScore=approvedScoreCorrection===null?originalControlScore:approvedScoreCorrection;
      const controlSource=control?'canonical-scoring-records':'no-approved-live-control';
      const scoreControlType=approvedScoreCorrection===null?'frozen-live-snapshot':'cody-approved-factual-correction';
      const sourceRows=clone(legacy.getLedger?.(record.fighter)?.championshipWins||legacy.ledgers?.[record.fighter]?.championshipWins||[]);
      const seeds=AGGREGATE_RECOVERY_SEEDS[record.fighter];
      let inputs=[];
      let unmatchedCanonicalWins=[];
      let aggregateRecovery=null;
      let matching={matches:[],unmatchedCanonicalWins:[]};

      if(sourceRows.length){
        matching=matchJudgments(record,sourceRows);
        inputs=matching.matches.map(recoveredInput);
        unmatchedCanonicalWins=matching.unmatchedCanonicalWins;
        inputs.push(...unmatchedCanonicalWins.map(fight=>pendingCanonicalInput(fight,Boolean(control))));
      }else if(control&&Number(currentScore)>0&&seeds){
        aggregateRecovery=aggregateRecoveredInputs(record,currentScore,seeds);
        inputs=aggregateRecovery.inputs;
      }else{
        unmatchedCanonicalWins=canonicalChampionshipWins(record,false);
        inputs=unmatchedCanonicalWins.map(fight=>pendingCanonicalInput(fight,Boolean(control)));
      }

      const calculated=calculateChampionship(inputs);
      const difference=Number.isFinite(currentScore)&&Number.isFinite(calculated.score)?round2(calculated.score-currentScore):null;
      const unmatchedLegacyRows=inputs.filter(row=>!row.fightId&&row.judgmentStatus==='approved-recovered');
      const titleTypeConflicts=inputs.filter(row=>row.fightId&&row.judgmentStatus==='approved-recovered'&&!row.titleTypeMatchesCanonical);
      const arithmeticConflicts=inputs.filter(row=>row.sourceAdjustedCredit!==null&&Math.abs(Number(row.finalAdjustedCredit)-Number(row.sourceAdjustedCredit))>.01);
      const pendingRows=inputs.filter(row=>String(row.judgmentStatus||'').startsWith('pending-'));
      const creditedRows=inputs.filter(row=>Number(row.finalAdjustedCredit)>0);
      const issues=[];

      if(!control)issues.push({classification:'recovered judgment',reason:'No approved live Championship control exists. Leon Edwards is present in the 73-fighter canonical ledger but absent from the 72-fighter live scoring snapshot.'});
      if(aggregateRecovery?.error)issues.push({classification:'recovered judgment',reason:aggregateRecovery.error});
      if(aggregateRecovery&&!aggregateRecovery.error)issues.push({classification:'recovered judgment',reason:`Direct legacy title rows were missing. The approved ${currentScore.toFixed(2)}/30 aggregate was recovered across ${aggregateRecovery.creditedRowCount} credited Championship accomplishments (${inputs.length} canonical title/tournament-context rows) with a visible ${aggregateRecovery.contextFactor.toFixed(6)} context factor.`});
      unmatchedLegacyRows.forEach(row=>issues.push({classification:'recovered judgment',reason:`Legacy title judgment for ${row.sourceOpponent||row.opponent} is not connected to a canonical fight ID.`}));
      pendingRows.forEach(row=>issues.push({classification:'factual correction',reason:`${row.opponent} is a canonical UFC title win without approved judgment credit; row is ${row.finalAdjustedCredit===0?'held at zero to preserve the approved control':'unscored because no approved control exists'}.`}));
      titleTypeConflicts.forEach(row=>issues.push({classification:'factual correction',reason:`Title type conflict for ${row.opponent}: approved input=${row.titleType}, canonical fact=${row.canonicalTitleType}.`}));
      arithmeticConflicts.forEach(row=>issues.push({classification:'recovered judgment',reason:`Recovered credit arithmetic differs for ${row.opponent}: source=${row.sourceAdjustedCredit}, reconstructed=${row.finalAdjustedCredit}.`}));
      if(Number.isFinite(difference)&&Math.abs(difference)>.01)issues.push({classification:'recovered judgment',reason:`Reconstructed score differs from the approved parity control by ${difference>0?'+':''}${difference.toFixed(2)}.`});

      const exactReason=Number.isFinite(difference)&&Math.abs(difference)<=.01
        ?`Reconstructed ${inputs.length} Championship rows for exact ${currentScore.toFixed(2)}/30 parity${issues.length?`; ${issues.length} traceability/review issue(s) remain visible.`:'.'}`
        :Number.isFinite(currentScore)
          ?`Reconstructed inputs calculate ${Number.isFinite(calculated.score)?calculated.score.toFixed(2):'unscored'}/30 versus approved ${currentScore.toFixed(2)}/30; review the listed issues.`
          :'No approved live Championship score exists; canonical title wins are shown but remain unscored.';

      return {
        fighter:record.fighter,
        board:record.board,
        currentScore,
        originalControlScore,
        approvedScoreCorrection,
        controlSource,
        scoreControlType,
        reconstructedScore:calculated.score,
        difference,
        classification:'recovered judgment',
        exactReason,
        staticPayloadScore,
        titleFightWins:inputs.filter(row=>row.officialTitleFight).length,
        championshipAccomplishmentRows:creditedRows.length,
        canonicalChampionshipContextRows:inputs.length,
        adjustedTitleCredit:calculated.adjustedTitleCredit,
        benchmarkCredit:calculated.benchmarkCredit,
        aggregateRecovery:aggregateRecovery?{targetCredit:aggregateRecovery.targetCredit,seedTotal:aggregateRecovery.seedTotal,contextFactor:aggregateRecovery.contextFactor,creditedRowCount:aggregateRecovery.creditedRowCount,error:aggregateRecovery.error}:null,
        inputs,
        pendingJudgmentRows:pendingRows.map(row=>({fightId:row.fightId,opponent:row.opponent,titleType:row.titleType,status:row.judgmentStatus})),
        unmatchedLegacyRows:unmatchedLegacyRows.map(row=>({opponent:row.sourceOpponent||row.opponent,titleType:row.titleType,credit:row.finalAdjustedCredit})),
        unmatchedCanonicalWins:pendingRows.map(row=>({fightId:row.fightId,opponent:row.opponent,titleType:row.titleType,status:row.judgmentStatus})),
        titleTypeConflicts:titleTypeConflicts.map(row=>({fightId:row.fightId,opponent:row.opponent,approvedTitleType:row.titleType,canonicalTitleType:row.canonicalTitleType})),
        issues
      };
    }).sort((a,b)=>Number(b.currentScore||0)-Number(a.currentScore||0)||a.fighter.localeCompare(b.fighter));

    const after=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    const byKey=new Map(fighters.map(row=>[clean(row.fighter),row]));
    const controlled=fighters.filter(row=>row.controlSource==='canonical-scoring-records');
    const parityRows=controlled.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)<=.01);
    const controlledDifferences=controlled.filter(row=>!Number.isFinite(row.difference)||Math.abs(row.difference)>.01);
    const issueRows=fighters.filter(row=>row.issues.length);
    const missingControlFighters=fighters.filter(row=>row.controlSource!=='canonical-scoring-records').map(row=>row.fighter);
    const randy=byKey.get(clean('Randy Couture'))||null;
    const report={
      version:VERSION,
      status:'shadow-reconstruction',
      applied:true,
      mode:'approved-model-reconstruction-diagnostic-only',
      fighterCount:fighters.length,
      canonicalControlCoverage:controlled.length,
      controlCoverage:controlled.length,
      missingControlFighters,
      exactParityCount:parityRows.length,
      controlledDifferenceCount:controlledDifferences.length,
      unresolvedControlCount:missingControlFighters.length,
      approvedScoreCorrectionCount:fighters.filter(row=>row.approvedScoreCorrection!==null).length,
      issueFighterCount:issueRows.length,
      issueCount:issueRows.reduce((sum,row)=>sum+row.issues.length,0),
      aggregateRecoveryFighterCount:fighters.filter(row=>row.aggregateRecovery&&!row.aggregateRecovery.error).length,
      pendingCanonicalJudgmentCount:fighters.reduce((sum,row)=>sum+row.pendingJudgmentRows.length,0),
      unmatchedLegacyRowCount:fighters.reduce((sum,row)=>sum+row.unmatchedLegacyRows.length,0),
      titleTypeConflictCount:fighters.reduce((sum,row)=>sum+row.titleTypeConflicts.length,0),
      proposedModelChangeCount:0,
      benchmarkCredit:LOCKED_BENCHMARK_CREDIT,
      categoryMax:CATEGORY_MAX,
      formula:'sum(baseCredit × opponentStrength × eraTitleContextAdjustment) ÷ 14.54 × 30; round category score to 2 decimals',
      inputSeparationNote:'Direct rows now support separate opponent-strength and era/title-context inputs. Missing direct rows are recovered from the frozen aggregate score with a visible context factor; canonical title wins omitted by the approved control appear as zero-credit pending factual corrections rather than silently changing the score.',
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