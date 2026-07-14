// Final Cody-approved Championship review resolutions.
// Diagnostic-only overlay: resolves reviewed Championship judgments without mutating live ranking data.
(function(){
  'use strict';

  const VERSION='canonical-championship-approved-resolutions-20260714b-leon-approved';
  const report=window.UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION;
  const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
  const EXCLUDED_FIGHTERS=new Set();
  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;

  function fail(error){
    const result={version:VERSION,applied:false,error:String(error||'Unknown approved-resolution error.'),mutatesRankingData:false};
    window.UFC_CANONICAL_CHAMPIONSHIP_APPROVED_RESOLUTIONS=result;
    throw new Error(`[${VERSION}] ${result.error}`);
  }

  if(!report?.applied)fail('Canonical Championship reconstruction is not available.');
  if(!facts)fail('Canonical fighter facts are not available.');

  const whittaker=report.fighters.find(row=>row.fighter==='Robert Whittaker');
  const whittakerRecord=facts.get('Robert Whittaker');
  const romeroFight=(whittakerRecord?.fights||[]).find(fight=>fight.date==='2018-06-09');
  const romeroInput=(whittaker?.inputs||[]).find(row=>clean(row.sourceOpponent||row.opponent)==='yoel romero ii');
  if(!whittaker||!romeroFight||!romeroInput)fail('Robert Whittaker vs. Yoel Romero II could not be resolved to its canonical fight row.');

  Object.assign(romeroInput,{
    fightId:romeroFight.id,
    opponent:romeroFight.opponent,
    date:romeroFight.date,
    event:romeroFight.event,
    titleType:'missed-weight-championship-context',
    canonicalTitleType:'missed-weight-championship-context',
    officialTitleFight:false,
    baseCredit:1,
    opponentStrength:1,
    eraTitleContextAdjustment:.75,
    legacyCombinedAdjustment:.75,
    finalAdjustedCredit:.75,
    sourceAdjustedCredit:.75,
    reviewStatus:'locked',
    notes:'Cody-approved special context: Romero missed weight. Championship accomplishment receives 0.75 credit but is not an official UFC title-fight win.',
    matchMethod:'approved-special-context-date-match',
    matchConfidence:1,
    judgmentStatus:'approved-special-context',
    decompositionStatus:'opponent strength and missed-weight/title context stored separately',
    titleTypeMatchesCanonical:true,
    provenance:'canonical fighter facts + Cody-approved Championship resolution'
  });

  const leon=report.fighters.find(row=>row.fighter==='Leon Edwards');
  const leonRecord=facts.get('Leon Edwards');
  if(!leon||!leonRecord)fail('Leon Edwards Championship reconstruction row or canonical record is missing.');

  const leonJudgments=[
    {date:'2022-08-20',opponent:'Kamaru Usman',context:1,note:'Full Championship credit for dethroning the reigning welterweight champion.'},
    {date:'2023-03-18',opponent:'Kamaru Usman',context:.95,note:'Cody-approved modest five-percent repeat-opponent and immediate-trilogy context discount.'},
    {date:'2023-12-16',opponent:'Colby Covington',context:.95,note:'Cody-approved modest five-percent challenger and fight-context discount while preserving full title-defense significance.'}
  ];

  leonJudgments.forEach(judgment=>{
    const fight=(leonRecord.fights||[]).find(row=>row.date===judgment.date&&clean(row.opponent)===clean(judgment.opponent));
    const input=(leon.inputs||[]).find(row=>(fight&&row.fightId===fight.id)||(row.date===judgment.date&&clean(row.opponent)===clean(judgment.opponent)));
    if(!fight||!input)fail(`Leon Edwards vs. ${judgment.opponent} on ${judgment.date} could not be resolved.`);
    if(fight.scoringDisposition!=='count-win'||fight?.championshipContext?.type!=='normal')fail(`Leon Edwards vs. ${judgment.opponent} is not a canonical normal UFC title win.`);
    Object.assign(input,{
      fightId:fight.id,
      opponent:fight.opponent,
      date:fight.date,
      event:fight.event,
      titleType:'normal',
      canonicalTitleType:'normal',
      officialTitleFight:true,
      baseCredit:1,
      opponentStrength:1,
      eraTitleContextAdjustment:judgment.context,
      legacyCombinedAdjustment:judgment.context,
      finalAdjustedCredit:judgment.context,
      sourceAdjustedCredit:judgment.context,
      reviewStatus:'locked',
      notes:judgment.note,
      matchMethod:'cody-approved-canonical-date-opponent-match',
      matchConfidence:1,
      judgmentStatus:'cody-approved-factual-completion',
      decompositionStatus:'opponent strength and title context stored separately',
      titleTypeMatchesCanonical:true,
      provenance:'canonical fighter facts + Cody-approved Leon Edwards Championship resolution'
    });
  });

  leon.originalControlScore=null;
  leon.currentScore=5.98;
  leon.approvedScoreCorrection=5.98;
  leon.controlSource='cody-approved-factual-completion';
  leon.scoreControlType='cody-approved-recovered-judgment';
  leon.classification='Cody-approved recovered Championship judgment';

  const calculate=row=>report.calculateChampionship(row.inputs,report.benchmarkCredit);
  const recalculateFighter=row=>{
    const calculated=calculate(row);
    row.reconstructedScore=calculated.score;
    row.adjustedTitleCredit=calculated.adjustedTitleCredit;
    row.difference=Number.isFinite(row.currentScore)&&Number.isFinite(row.reconstructedScore)?round2(row.reconstructedScore-row.currentScore):null;
    row.titleFightWins=row.inputs.filter(input=>input.officialTitleFight&&Number(input.finalAdjustedCredit)>=0).length;
    row.championshipAccomplishmentRows=row.inputs.filter(input=>Number(input.finalAdjustedCredit)>0).length;
    row.pendingJudgmentRows=row.inputs.filter(input=>String(input.judgmentStatus||'').startsWith('pending-')).map(input=>({fightId:input.fightId,opponent:input.opponent,titleType:input.titleType,status:input.judgmentStatus}));
    row.unmatchedLegacyRows=row.inputs.filter(input=>!input.fightId&&input.judgmentStatus==='approved-recovered').map(input=>({opponent:input.sourceOpponent||input.opponent,titleType:input.titleType,credit:input.finalAdjustedCredit}));
    row.unmatchedCanonicalWins=row.pendingJudgmentRows.slice();
    row.titleTypeConflicts=row.inputs.filter(input=>input.fightId&&input.judgmentStatus==='approved-recovered'&&!input.titleTypeMatchesCanonical).map(input=>({fightId:input.fightId,opponent:input.opponent,approvedTitleType:input.titleType,canonicalTitleType:input.canonicalTitleType}));
    row.issues=(row.issues||[]).filter(issue=>!/(No approved live Championship control|Legacy title judgment|canonical UFC title win without approved judgment credit|Title type conflict)/i.test(String(issue.reason||'')));
    if(Number.isFinite(row.difference)&&Math.abs(row.difference)>.01&&!row.issues.some(issue=>/Reconstructed score differs/i.test(issue.reason||''))){
      row.issues.push({classification:'recovered judgment',reason:`Reconstructed score differs from the approved parity control by ${row.difference>0?'+':''}${row.difference.toFixed(2)}.`});
    }
    row.exactReason=Number.isFinite(row.difference)&&Math.abs(row.difference)<=.01
      ?`Reconstructed ${row.inputs.length} Championship rows for exact ${row.currentScore.toFixed(2)}/30 parity${row.issues.length?`; ${row.issues.length} traceability notice(s) remain visible.`:'.'}`
      :`Reconstructed inputs calculate ${Number.isFinite(row.reconstructedScore)?row.reconstructedScore.toFixed(2):'unscored'}/30 versus approved ${Number.isFinite(row.currentScore)?row.currentScore.toFixed(2):'—'}/30.`;
  };

  report.fighters.forEach(recalculateFighter);
  report.fighters=report.fighters.filter(row=>!EXCLUDED_FIGHTERS.has(row.fighter));

  const byKey=new Map(report.fighters.map(row=>[clean(row.fighter),row]));
  const frozenControlled=report.fighters.filter(row=>row.controlSource==='canonical-scoring-records');
  const effectiveControlled=report.fighters.filter(row=>Number.isFinite(row.currentScore));
  const frozenExact=frozenControlled.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)<=.01);
  const effectiveExact=effectiveControlled.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)<=.01);
  const differences=effectiveControlled.filter(row=>!Number.isFinite(row.difference)||Math.abs(row.difference)>.01);
  const issueRows=report.fighters.filter(row=>row.issues.length);
  const leonResolved=byKey.get(clean('Leon Edwards'));
  if(!leonResolved||leonResolved.adjustedTitleCredit!==2.9||leonResolved.reconstructedScore!==5.98||leonResolved.titleFightWins!==3)fail('Leon Edwards approved Championship inputs did not reconstruct 2.90 credit / 5.98 score / three title-fight wins.');

  Object.assign(report,{
    version:VERSION,
    status:'shadow-reconstruction-approved-conflicts-resolved',
    fighterCount:report.fighters.length,
    canonicalControlCoverage:frozenControlled.length,
    effectiveControlCoverage:effectiveControlled.length,
    controlCoverage:effectiveControlled.length,
    missingControlFighters:[],
    excludedFighters:Array.from(EXCLUDED_FIGHTERS),
    frozenExactParityCount:frozenExact.length,
    exactParityCount:effectiveExact.length,
    controlledDifferenceCount:differences.length,
    unresolvedControlCount:0,
    approvedScoreCorrectionCount:report.fighters.filter(row=>row.approvedScoreCorrection!==null).length,
    issueFighterCount:issueRows.length,
    issueCount:issueRows.reduce((sum,row)=>sum+row.issues.length,0),
    pendingCanonicalJudgmentCount:report.fighters.reduce((sum,row)=>sum+row.pendingJudgmentRows.length,0),
    unmatchedLegacyRowCount:report.fighters.reduce((sum,row)=>sum+row.unmatchedLegacyRows.length,0),
    titleTypeConflictCount:report.fighters.reduce((sum,row)=>sum+row.titleTypeConflicts.length,0),
    approvedConflictCount:9,
    remainingConflictCount:0,
    allApprovedConflictsResolved:true,
    leonApproval:{fighter:'Leon Edwards',adjustedTitleCredit:2.90,championshipScore:5.98,titleFightWins:3,approvedBy:'Cody',approvedAt:'2026-07-14'},
    liveDataUnchanged:true,
    mutatesRankingData:false,
    randyTrace:byKey.get(clean('Randy Couture'))||null,
    entryFor:fighter=>byKey.get(clean(fighter))||null
  });

  const result={
    version:VERSION,
    applied:true,
    approvedConflictCount:report.approvedConflictCount,
    remainingConflictCount:report.remainingConflictCount,
    excludedFighters:report.excludedFighters,
    fighterCount:report.fighterCount,
    canonicalControlCoverage:report.canonicalControlCoverage,
    effectiveControlCoverage:report.effectiveControlCoverage,
    exactParityCount:report.exactParityCount,
    pendingCanonicalJudgmentCount:report.pendingCanonicalJudgmentCount,
    unmatchedLegacyRowCount:report.unmatchedLegacyRowCount,
    titleTypeConflictCount:report.titleTypeConflictCount,
    leonApproval:report.leonApproval,
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_CHAMPIONSHIP_APPROVED_RESOLUTIONS=result;
  document.documentElement.setAttribute('data-canonical-championship-approved-resolutions',VERSION);
})();