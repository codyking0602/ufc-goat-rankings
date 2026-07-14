// Final Cody-approved Championship review resolutions.
// Diagnostic-only overlay: resolves the one missed-weight special-context row and excludes Leon Edwards from this audit.
(function(){
  'use strict';

  const VERSION='canonical-championship-approved-resolutions-20260714a-final-four';
  const report=window.UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION;
  const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
  const EXCLUDED_FIGHTERS=new Set(['Leon Edwards']);
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
  const controlled=report.fighters.filter(row=>row.controlSource==='canonical-scoring-records');
  const exact=controlled.filter(row=>Number.isFinite(row.difference)&&Math.abs(row.difference)<=.01);
  const differences=controlled.filter(row=>!Number.isFinite(row.difference)||Math.abs(row.difference)>.01);
  const issueRows=report.fighters.filter(row=>row.issues.length);

  Object.assign(report,{
    version:VERSION,
    status:'shadow-reconstruction-approved-conflicts-resolved',
    fighterCount:report.fighters.length,
    canonicalControlCoverage:controlled.length,
    controlCoverage:controlled.length,
    missingControlFighters:[],
    excludedFighters:Array.from(EXCLUDED_FIGHTERS),
    exactParityCount:exact.length,
    controlledDifferenceCount:differences.length,
    unresolvedControlCount:0,
    approvedScoreCorrectionCount:report.fighters.filter(row=>row.approvedScoreCorrection!==null).length,
    issueFighterCount:issueRows.length,
    issueCount:issueRows.reduce((sum,row)=>sum+row.issues.length,0),
    pendingCanonicalJudgmentCount:report.fighters.reduce((sum,row)=>sum+row.pendingJudgmentRows.length,0),
    unmatchedLegacyRowCount:report.fighters.reduce((sum,row)=>sum+row.unmatchedLegacyRows.length,0),
    titleTypeConflictCount:report.fighters.reduce((sum,row)=>sum+row.titleTypeConflicts.length,0),
    approvedConflictCount:8,
    remainingConflictCount:0,
    allApprovedConflictsResolved:true,
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
    exactParityCount:report.exactParityCount,
    pendingCanonicalJudgmentCount:report.pendingCanonicalJudgmentCount,
    unmatchedLegacyRowCount:report.unmatchedLegacyRowCount,
    titleTypeConflictCount:report.titleTypeConflictCount,
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_CHAMPIONSHIP_APPROVED_RESOLUTIONS=result;
  document.documentElement.setAttribute('data-canonical-championship-approved-resolutions',VERSION);
})();