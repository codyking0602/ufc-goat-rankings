// Canonical Division-Era Depth reconstruction under the locked scoring-refactor doctrine.
// Shadow-only: audits the empirical era-depth adjustment without mutating live scores, totals, ranks, or OVR.
(function(){
  'use strict';

  const VERSION='canonical-division-era-depth-reconstruction-20260714b-signed-zero-normalized';
  const SHADOW_VERSION='division-era-depth-shadow-20260712e-roster-72';
  const RULES=Object.freeze({
    purpose:'Measure competitive depth within each UFC division over time without duplicating the separate division-strength treatment.',
    range:{min:-3.00,max:0.75},
    negativeFormula:'-3 × ((1.00 - depthIndex) / 0.25)^1.5, capped at -3.00',
    positiveFormula:'(depthIndex - 1.00) × 20, capped at +0.75',
    componentWeights:Object.freeze({qualifiedActivePool:0.30,ranksSixToFifteenElo:0.50,contenderDiversity:0.20}),
    womenFeatherweight:'Exclude WFW samples because the division lacks a viable ranks-6–15 baseline; use non-WFW samples for mixed careers and zero for pure WFW careers.',
    divisionStrengthSeparation:'Canonical divisionStrength.defaultKey is context only and is never multiplied into the era-depth adjustment.'
  });

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[“”\"]/g,'').replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const num=value=>Number.isFinite(Number(value))?Number(value):null;
  const round2=value=>{const rounded=Math.round((Number(value||0)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};
  const meaningful=(left,right,tolerance=.01)=>left!==null&&right!==null&&Math.abs(left-right)>tolerance;

  function calculateCurve(depthIndex){
    const value=num(depthIndex);
    if(value===null)return null;
    if(value>=1)return round2(Math.min((value-1)*20,RULES.range.max));
    return round2(Math.max(-3,-3*Math.pow((1-value)/0.25,1.5)));
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS;
    const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    if(!facts?.list||!shadow?.fighters||!canonical?.entryFor){
      return {version:VERSION,applied:false,error:'Missing canonical fighter facts, Division-Era Depth shadow, or canonical scoring controls.',mutatesRankingData:false,mutatesScores:false};
    }

    const shadowMap=new Map(shadow.fighters.map(row=>[key(row.fighter),row]));
    const fighters=facts.list().map(record=>{
      const source=shadowMap.get(key(record.fighter))||null;
      const control=canonical.entryFor(record.fighter)||null;
      const depthIndex=source?num(source.depthIndex):null;
      const shadowAdjustment=source?num(source.curvedAdjustment):null;
      const recomputedAdjustment=calculateCurve(depthIndex);
      const canonicalAdjustment=control&&control.eraDepthAdjustment!==undefined&&control.eraDepthAdjustment!==null?round2(control.eraDepthAdjustment):null;
      const issues=[];
      if(!source)issues.push('missing empirical era-depth row');
      if(source&&depthIndex===null)issues.push('missing numeric depth index');
      if(source&&shadowAdjustment===null)issues.push('missing numeric curved adjustment');
      if(meaningful(shadowAdjustment,recomputedAdjustment))issues.push(`shadow adjustment ${round2(shadowAdjustment).toFixed(2)} does not match curve ${round2(recomputedAdjustment).toFixed(2)}`);
      if(canonicalAdjustment===null)issues.push('missing frozen canonical era-depth control');
      else if(shadowAdjustment!==null&&meaningful(canonicalAdjustment,round2(shadowAdjustment),.001))issues.push(`canonical control ${canonicalAdjustment.toFixed(2)} does not match shadow ${round2(shadowAdjustment).toFixed(2)}`);
      if(source?.womenFeatherweightTreatment?.status==='pure-wfw-zero'&&round2(shadowAdjustment)!==0)issues.push('pure women featherweight treatment must be zero');
      const status=!source?'missing-shadow':issues.length?'review-required':'clean';
      return {
        fighter:record.fighter,
        board:record.board,
        status,
        depthIndex:depthIndex===null?null:round2(depthIndex),
        shadowAdjustment:shadowAdjustment===null?null:round2(shadowAdjustment),
        recomputedAdjustment,
        canonicalAdjustment,
        divisionStrengthKey:record.divisionStrength?.defaultKey||null,
        sampledDivisions:source?.sampledDivisions||[],
        matchedPrimeFightCount:Number(source?.matchedPrimeFightCount||0),
        componentRatios:source?.componentRatios||null,
        womenFeatherweightTreatment:source?.womenFeatherweightTreatment||null,
        primeStart:source?.primeStart||record.primeWindow?.startFightId||null,
        primeEnd:source?.primeEnd||record.primeWindow?.endFightId||null,
        openPrime:Boolean(source?.openPrime??record.primeWindow?.open),
        issues,
        mutatesScores:false
      };
    }).sort((a,b)=>(b.shadowAdjustment??-99)-(a.shadowAdjustment??-99)||String(a.fighter).localeCompare(String(b.fighter)));

    const missingShadow=fighters.filter(row=>row.status==='missing-shadow');
    const formulaIssues=fighters.filter(row=>row.issues.some(issue=>/does not match curve|numeric depth|numeric curved/i.test(issue)));
    const controlIssues=fighters.filter(row=>row.issues.some(issue=>/canonical/i.test(issue)));
    const reviewQueue=fighters.filter(row=>row.status!=='clean');
    const byKey=new Map(fighters.map(row=>[key(row.fighter),row]));
    const after=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;

    return {
      version:VERSION,
      applied:true,
      mode:'shadow-only-canonical-division-era-depth-reconstruction',
      sourceShadowVersion:shadow.version,
      sourceDataset:shadow.source||null,
      rules:RULES,
      formula:`30% qualified active pool + 50% ranks 6–15 Elo + 20% contender diversity; curved to ${RULES.range.min.toFixed(2)} through +${RULES.range.max.toFixed(2)}.`,
      fighterCount:fighters.length,
      shadowCoverageCount:fighters.filter(row=>row.shadowAdjustment!==null).length,
      canonicalControlCoverageCount:fighters.filter(row=>row.canonicalAdjustment!==null).length,
      cleanCount:fighters.filter(row=>row.status==='clean').length,
      missingShadowCount:missingShadow.length,
      formulaIssueCount:formulaIssues.length,
      controlIssueCount:controlIssues.length,
      reviewQueueCount:reviewQueue.length,
      positiveCount:fighters.filter(row=>(row.shadowAdjustment??0)>0).length,
      negativeCount:fighters.filter(row=>(row.shadowAdjustment??0)<0).length,
      neutralCount:fighters.filter(row=>row.shadowAdjustment===0).length,
      fighters,
      missingShadow,
      formulaIssues,
      controlIssues,
      reviewQueue,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      liveDataUnchanged:before===after,
      mutatesRankingData:false,
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false
    };
  }

  const report=build();
  window.UFC_CANONICAL_DIVISION_ERA_DEPTH_RECONSTRUCTION=report;
  if(typeof document!=='undefined'&&document.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-canonical-division-era-depth-reconstruction',`${VERSION}-${report.reviewQueueCount??'error'}`);
  }
  if(typeof window.dispatchEvent==='function'&&typeof CustomEvent==='function'){
    window.dispatchEvent(new CustomEvent('ufc-canonical-division-era-depth-reconstruction-ready',{detail:report}));
  }
})();
