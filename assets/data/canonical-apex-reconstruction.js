// Canonical Apex Peak reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: validates the approved two-UFC-win / 24-month Apex model without mutating live scores.
(function(){
  'use strict';

  const VERSION='canonical-apex-reconstruction-20260714d-approved-batch-one';
  const RULES=Object.freeze({
    window:'Best two UFC wins within 24 months',
    totalMax:6.00,
    twoPerformanceStrengthMax:2.00,
    proofMax:1.75,
    bestFighterClaimMax:1.25,
    auraMax:1.00,
    noContests:'No contests cannot be selected as Apex performances.',
    losses:'Losses cannot be selected as Apex performances, but losses inside the window may cap Best-Fighter Claim or Aura.'
  });
  const MEANINGFUL_DELTA=.01;

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[“”\"]/g,'').replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''));
  const allRows=()=>[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[]),...(window.RANKING_DATA?.fighters||[])].filter(row=>row?.fighter);

  const ALIASES=new Map(Object.entries({
    'shogun rua':'mauricio rua',
    'mauricio shogun rua':'mauricio rua',
    'jacare souza':'ronaldo souza',
    'ronaldo jacare souza':'ronaldo souza',
    'bj penn':'b j penn',
    'rda':'rafael dos anjos'
  }));

  function opponentKey(value){
    let normalized=key(value)
      .replace(/\b(rematch)\b/g,' ')
      .replace(/\s+(i|ii|iii|iv|v)$/,'')
      .replace(/\s+/g,' ')
      .trim();
    return ALIASES.get(normalized)||normalized;
  }

  function sameOpponent(left,right){
    const a=opponentKey(left);
    const b=opponentKey(right);
    if(!a||!b)return false;
    if(a===b||a.includes(b)||b.includes(a))return true;
    const aParts=a.split(' ').filter(Boolean);
    const bParts=b.split(' ').filter(Boolean);
    const aLast=aParts.at(-1);
    const bLast=bParts.at(-1);
    return Boolean(aLast&&aLast===bLast&&aParts.some(part=>bParts.includes(part)));
  }

  function controlFor(fighter){
    return window.UFC_CANONICAL_SCORING_RECORDS?.entryFor?.(fighter)||null;
  }

  function approvedJudgmentFor(fighter){
    return window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS?.entryFor?.(fighter)||null;
  }

  function auditFor(fighter){
    const approved=approvedJudgmentFor(fighter);
    if(approved?.audit)return approved.audit;
    const target=key(fighter);
    const row=allRows().find(item=>key(item.fighter)===target&&item.apexPeakAudit)||null;
    return row?.apexPeakAudit||null;
  }

  function performanceYear(performance){
    const match=String(performance?.date||'').match(/(19|20)\d{2}/);
    return match?match[0]:null;
  }

  function matchPerformance(record,performance){
    const year=performanceYear(performance);
    const fights=record?.fights||[];
    const statedFightId=String(performance?.fightId||'').trim()||null;
    const idMatch=statedFightId?fights.find(fight=>fight?.id===statedFightId)||null:null;
    const opponentMatches=fights.filter(fight=>sameOpponent(fight?.opponent,performance?.label));
    const exactDateMatches=validDate(performance?.date)?opponentMatches.filter(fight=>fight?.date===performance.date):[];
    const yearMatches=year?opponentMatches.filter(fight=>String(fight?.date||'').startsWith(year)):opponentMatches;
    const candidates=idMatch?[idMatch]:exactDateMatches.length?exactDateMatches:yearMatches.length?yearMatches:opponentMatches;
    const win=candidates.find(fight=>fight?.officialResult==='win'&&fight?.scoringDisposition==='count-win')||null;
    const any=candidates[0]||null;
    const fight=win||any;
    const issues=[];
    if(statedFightId&&!idMatch)issues.push(`selected fight id does not match a canonical UFC fight (${statedFightId})`);
    if(!fight)issues.push('selected performance does not match a canonical UFC fight');
    else if(fight.officialResult!=='win'||fight.scoringDisposition!=='count-win')issues.push(`selected performance is not a counted UFC win (${fight.officialResult}/${fight.scoringDisposition})`);
    if(fight?.officialResult==='no-contest'||fight?.scoringDisposition==='excluded-no-contest')issues.push('selected performance is a no contest');
    return {
      label:performance?.label||null,
      statedFightId,
      statedDate:performance?.date||null,
      rating:Number.isFinite(Number(performance?.rating))?Number(performance.rating):null,
      matchedFightId:fight?.id||null,
      canonicalDate:fight?.date||null,
      canonicalOpponent:fight?.opponent||null,
      officialResult:fight?.officialResult||null,
      scoringDisposition:fight?.scoringDisposition||null,
      validUfcWin:Boolean(fight&&fight.officialResult==='win'&&fight.scoringDisposition==='count-win'),
      issues
    };
  }

  function withinTwentyFourMonths(firstDate,secondDate){
    if(!validDate(firstDate)||!validDate(secondDate))return null;
    const earlier=new Date(`${firstDate}T00:00:00Z`);
    const later=new Date(`${secondDate}T00:00:00Z`);
    const start=earlier<=later?earlier:later;
    const end=earlier<=later?later:earlier;
    const boundary=new Date(start.getTime());
    boundary.setUTCMonth(boundary.getUTCMonth()+24);
    return {passed:end<=boundary,days:Math.round((end-start)/86400000),start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10),boundary:boundary.toISOString().slice(0,10)};
  }

  function calculate(record,audit){
    const blockers=[];
    if(!record)blockers.push('missing canonical fighter record');
    if(!audit)blockers.push('missing locked Apex audit');
    if(blockers.length)return {score:null,blockers,performances:[],issues:[...blockers]};

    const performances=(audit.performances||[]).map(performance=>matchPerformance(record,performance));
    const issues=[];
    if(performances.length!==2)issues.push(`locked model requires exactly two performances; found ${performances.length}`);
    performances.forEach((performance,index)=>performance.issues.forEach(issue=>issues.push(`performance ${index+1}: ${issue}`)));

    const ratings=performances.map(performance=>performance.rating).filter(Number.isFinite);
    if(ratings.length!==2)issues.push('both selected performances require numeric ratings');
    const performanceAverage=ratings.length?round2(ratings.reduce((sum,value)=>sum+value,0)/ratings.length):0;
    const formulaTwoPerformanceStrength=round2((performanceAverage/10)*RULES.twoPerformanceStrengthMax);
    const components={
      twoPerformanceStrength:round2(audit?.components?.twoPerformanceStrength),
      proof:round2(audit?.components?.proof),
      bestFighterClaim:round2(audit?.components?.bestFighterClaim),
      aura:round2(audit?.components?.aura)
    };
    const componentScore=round2(Object.values(components).reduce((sum,value)=>sum+Number(value||0),0));
    const auditScore=round2(audit.score);
    const twoPerformanceDifference=round2(components.twoPerformanceStrength-formulaTwoPerformanceStrength);
    const componentDifference=round2(componentScore-auditScore);
    if(Math.abs(twoPerformanceDifference)>.01)issues.push(`two-performance component ${components.twoPerformanceStrength.toFixed(2)} does not equal ratings formula ${formulaTwoPerformanceStrength.toFixed(2)}`);
    if(Math.abs(componentDifference)>.01)issues.push(`component total ${componentScore.toFixed(2)} does not equal audit score ${auditScore.toFixed(2)}`);
    if(components.twoPerformanceStrength>RULES.twoPerformanceStrengthMax+.001)issues.push('two-performance strength exceeds maximum');
    if(components.proof>RULES.proofMax+.001)issues.push('proof exceeds maximum');
    if(components.bestFighterClaim>RULES.bestFighterClaimMax+.001)issues.push('best-fighter claim exceeds maximum');
    if(components.aura>RULES.auraMax+.001)issues.push('aura exceeds maximum');
    if(componentScore>RULES.totalMax+.001)issues.push('Apex score exceeds 6.00 maximum');

    const windowCheck=performances.length===2?withinTwentyFourMonths(performances[0].canonicalDate,performances[1].canonicalDate):null;
    if(windowCheck===null)issues.push('cannot verify 24-month window from canonical fight dates');
    else if(!windowCheck.passed)issues.push(`selected wins exceed 24 months (${windowCheck.start} to ${windowCheck.end}; boundary ${windowCheck.boundary})`);

    const factualIssues=issues.filter(issue=>/fight id|does not match|not a counted UFC win|no contest|exactly two|numeric ratings|24 months|cannot verify/i.test(issue));
    const formulaIssues=issues.filter(issue=>/component|maximum|exceeds/i.test(issue));
    return {
      score:auditScore,
      blockers,
      performances,
      performanceAverage,
      formulaTwoPerformanceStrength,
      components,
      componentScore,
      twoPerformanceDifference,
      componentDifference,
      windowCheck,
      issues,
      factualIssues,
      formulaIssues,
      explicitJudgmentInputs:{
        proof:components.proof,
        bestFighterClaim:components.bestFighterClaim,
        aura:components.aura,
        notes:audit.notes||null
      },
      manualNumericAdjustment:0,
      provenance:audit.provenance||'canonical UFC fight facts + locked Apex audit'
    };
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const controls=window.UFC_CANONICAL_SCORING_RECORDS;
    const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    if(!facts?.list||!controls?.entryFor)return {version:VERSION,applied:false,error:'Missing canonical fighter facts or frozen scoring controls.',mutatesRankingData:false};

    const fighters=facts.list().map(record=>{
      const audit=auditFor(record.fighter);
      const calculation=calculate(record,audit);
      const control=controlFor(record.fighter);
      const approved=approvedJudgmentFor(record.fighter);
      const currentScore=control?.apexPeak===null||control?.apexPeak===undefined?null:(Number.isFinite(Number(control.apexPeak))?round2(control.apexPeak):null);
      const reconstructedScore=calculation.score===null||calculation.score===undefined?null:(Number.isFinite(Number(calculation.score))?round2(calculation.score):null);
      const difference=currentScore===null||reconstructedScore===null?null:round2(reconstructedScore-currentScore);
      const status=calculation.blockers.length?'blocked':calculation.issues.length?'review-required':difference===null?'missing-control':Math.abs(difference)<=MEANINGFUL_DELTA?'exact-parity':'score-delta';
      return {
        fighter:record.fighter,
        board:record.board,
        status,
        currentScore,
        reconstructedScore,
        difference,
        exactParity:difference!==null&&Math.abs(difference)<=MEANINGFUL_DELTA,
        auditVersion:audit?.version||null,
        auditWindow:audit?.window||null,
        judgmentClassification:audit?.classification||approved?.classification||null,
        judgmentStatus:audit?.approvalStatus||approved?.audit?.approvalStatus||null,
        stats:calculation,
        mutatesScores:false
      };
    }).sort((a,b)=>(b.reconstructedScore??-1)-(a.reconstructedScore??-1)||String(a.fighter).localeCompare(String(b.fighter)));

    const byKey=new Map(fighters.map(row=>[key(row.fighter),row]));
    const audited=fighters.filter(row=>row.reconstructedScore!==null&&Number.isFinite(row.reconstructedScore));
    const controlsCovered=fighters.filter(row=>row.currentScore!==null);
    const selectionIssues=fighters.filter(row=>row.stats.factualIssues?.length);
    const formulaIssues=fighters.filter(row=>row.stats.formulaIssues?.length);
    const missingAudits=fighters.filter(row=>row.stats.blockers?.includes('missing locked Apex audit'));
    const missingControls=fighters.filter(row=>row.currentScore===null);
    const scoreDeltas=fighters.filter(row=>row.difference!==null&&Math.abs(row.difference)>MEANINGFUL_DELTA);
    const pending=fighters.filter(row=>row.status!=='exact-parity');

    return {
      version:VERSION,
      applied:true,
      mode:'shadow-only-locked-apex-reconstruction',
      formula:'Two-performance strength (ratings average / 10 × 2.00) + explicit Proof (max 1.75) + explicit Best-Fighter Claim (max 1.25) + explicit Aura (max 1.00), using exactly two counted UFC wins no more than 24 months apart.',
      rules:RULES,
      fighterCount:fighters.length,
      auditedFighterCount:audited.length,
      controlCoverage:controlsCovered.length,
      exactFrozenControlParityCount:controlsCovered.filter(row=>row.exactParity).length,
      scoreDeltaCount:scoreDeltas.length,
      missingAuditCount:missingAudits.length,
      missingControlCount:missingControls.length,
      selectionIssueFighterCount:selectionIssues.length,
      formulaIssueFighterCount:formulaIssues.length,
      twentyFourMonthViolationCount:fighters.filter(row=>row.stats.windowCheck&&!row.stats.windowCheck.passed).length,
      invalidSelectedPerformanceCount:fighters.reduce((sum,row)=>sum+(row.stats.performances||[]).filter(performance=>!performance.validUfcWin).length,0),
      pendingReviewCount:pending.length,
      fighters,
      missingAudits,
      missingControls,
      selectionIssues,
      formulaIssues,
      scoreDeltas,
      pendingReviewRows:pending,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      calculateApex:record=>calculate(record,auditFor(record?.fighter)),
      mutatesRankingData:false,
      mutatesScores:false,
      liveDataUnchanged:before===null||before===JSON.stringify(window.RANKING_DATA),
      generatedAt:new Date().toISOString()
    };
  }

  const report=build();
  window.UFC_CANONICAL_APEX_RECONSTRUCTION=report;
  if(typeof document!=='undefined'&&document?.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-canonical-apex-reconstruction',`${VERSION}-${report.auditedFighterCount||0}-${report.pendingReviewCount||0}`);
  }
})();
