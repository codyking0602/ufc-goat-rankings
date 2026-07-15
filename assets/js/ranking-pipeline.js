// Permanent calculated ranking projection.
// Consumes approved fight-level category reconstruction outputs and projects them into
// leaderboard, profile, Compare Mode, and game-facing RANKING_DATA fields.
(function(){
  'use strict';

  const VERSION='ranking-pipeline-20260714a-approved-calculated-projection';
  const CALCULATED_FIELDS=new Set([
    'rank','allTimeRank','totalScore','rawScore','overallOvr','baseScore','preEraDepthTotalScore',
    'championship','opponentQuality','primeDominance','longevity','apexPeak','apexPeakBonus',
    'penalty','lossPenalty','lossContext','eraDepthAdjustment','weightedScoreBreakdown',
    'ufcRecord','ufcWins','ufcLosses','ufcDraws','ufcNoContests','finishWins','finishRatePct',
    'titleFightWins','adjustedTitleWins','eliteWins','topFiveWins','top5Wins','rankedWins',
    'primeRecord','primeWins','primeLosses','primeDraws','primeNoContests','primeFights','primeFinishes',
    'roundsWonPct','activeEliteYears','timesFinishedPrime','throughPrimeUfcFights','visibleStats',
    'scoreInputOwner','scoreInputVersion','scoreInputSource','overallScoreOwner','finalScoreEngineVersion',
    'canonicalExpectedRank','canonicalExpectedOverallOvr'
  ]);
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const round2=value=>{const rounded=Math.round((Number(value||0)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};

  function stripCalculated(source){
    const output={};
    if(!source||typeof source!=='object')return output;
    Object.entries(source).forEach(([field,value])=>{
      if(!CALCULATED_FIELDS.has(field))output[field]=clone(value);
    });
    return output;
  }

  function sourceState(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const finalScore=window.UFC_CANONICAL_FINAL_SCORE_RECONSTRUCTION;
    const ovr=window.UFC_CANONICAL_OVR_RECONSTRUCTION;
    const data=window.RANKING_DATA;
    const missing=[];
    if(!facts?.list||!facts?.deriveFor)missing.push('UFC_CANONICAL_FIGHTER_FACTS');
    if(!finalScore?.applied||!finalScore?.approvedReport?.rows)missing.push('UFC_CANONICAL_FINAL_SCORE_RECONSTRUCTION');
    if(!ovr?.applied||!ovr?.entryFor)missing.push('UFC_CANONICAL_OVR_RECONSTRUCTION');
    if(!data)missing.push('RANKING_DATA');
    if(missing.length)throw new Error(`[${VERSION}] Missing production inputs: ${missing.join(', ')}`);
    return {facts,finalScore,ovr,data};
  }

  function indexes(data){
    const board=new Map([...(data.men||[]),...(data.women||[])].filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
    const profiles=new Map((data.fighters||[]).filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
    return {board,profiles};
  }

  function opponentRows(record,derived){
    const fightById=new Map((record?.fights||[]).map(fight=>[fight.id,fight]));
    return (derived?.opponentQuality?.rows||[]).map(row=>{
      const fight=fightById.get(row.fightId)||{};
      return {
        fightId:row.fightId,
        opponent:row.opponent,
        tier:row.tier,
        credit:round2(row.credit),
        context:fight?.opponentContext?.note||fight?.event||'UFC win'
      };
    });
  }

  function titleProjection(base,derived){
    const existing=stripCalculated(base?.title||{});
    return {
      ...existing,
      titleFightWins:Number(derived?.championship?.titleFightWins||0),
      adjustedTitleWins:round2(derived?.championship?.adjustedTitleWins||0),
      rows:clone(derived?.championship?.rows||[])
    };
  }

  function projectionRow(source,state,existing){
    const record=state.facts.get(source.fighter);
    const derived=state.facts.deriveFor(source.fighter);
    const ovrRow=state.ovr.entryFor(source.fighter);
    if(!record||!derived)throw new Error(`[${VERSION}] Missing canonical fact projection for ${source.fighter}.`);
    if(!ovrRow)throw new Error(`[${VERSION}] Missing calculated OVR for ${source.fighter}.`);

    const profile=existing.profiles.get(key(source.fighter));
    const board=existing.board.get(key(source.fighter));
    const base={...stripCalculated(profile),...stripCalculated(board)};
    const official=derived.officialUfcRecord||{};
    const prime=derived.prime||{};
    const quality=derived.opponentQuality||{};
    const championship=derived.championship||{};
    const longevity=derived.longevity||{};
    const weighted=source.weighted||{};
    const secondaryDivisions=record?.identity?.secondaryDivisions||[];
    const primaryDivision=base.primaryDivision||record?.identity?.primaryDivision||'';
    const secondaryDivision=base.secondaryDivision||secondaryDivisions.join(' / ');
    const timesFinishedPrime=Number(prime.stoppageLosses||0);
    const visibleStats={
      ufcRecord:official.text||'0-0',
      titleFightWins:Number(championship.titleFightWins||0),
      adjustedTitleWins:round2(championship.adjustedTitleWins||0),
      topFiveWins:Number(quality.topFiveWins||0),
      rankedWins:Number(quality.rankedWins||0),
      finishRatePct:round2(derived.finishRatePct||0),
      primeRecord:prime.recordText||'0-0',
      roundsWonPct:round2(prime.roundsWonPct||0),
      activeEliteYears:round2(longevity.activeEliteYears||0),
      timesFinishedPrime,
      throughPrimeUfcFights:Number(derived?.lossExposure?.throughPrimeUfcFights||0)
    };

    return {
      ...base,
      fighter:source.fighter,
      leaderboard:source.board,
      board:source.board,
      primaryDivision,
      secondaryDivision,
      rank:Number(source.calculatedRank),
      allTimeRank:Number(source.calculatedRank),
      championship:round2(source.scores.championship),
      opponentQuality:round2(source.scores.opponentQuality),
      primeDominance:round2(source.scores.primeDominance),
      longevity:round2(source.scores.longevity),
      apexPeak:round2(source.scores.apex),
      apexPeakBonus:round2(source.scores.apex),
      penalty:round2(source.scores.penalty),
      lossPenalty:round2(source.scores.penalty),
      lossContext:round2(source.scores.penalty),
      eraDepthAdjustment:round2(source.scores.eraDepth),
      baseScore:round2(weighted.baseScore),
      preEraDepthTotalScore:round2(Number(weighted.baseScore||0)+Number(weighted.apex||0)+Number(weighted.penalty||0)),
      weightedScoreBreakdown:clone(weighted),
      totalScore:round2(source.totalScore),
      rawScore:round2(source.totalScore),
      overallOvr:Number(ovrRow.calculatedOvr),
      ufcRecord:visibleStats.ufcRecord,
      ufcWins:Number(official.wins||0),
      ufcLosses:Number(official.losses||0),
      ufcDraws:Number(official.draws||0),
      ufcNoContests:Number(official.noContests||0),
      finishWins:Number(derived.finishWins||0),
      finishRatePct:visibleStats.finishRatePct,
      titleFightWins:visibleStats.titleFightWins,
      adjustedTitleWins:visibleStats.adjustedTitleWins,
      eliteWins:Number(quality.eliteWins||0),
      topFiveWins:visibleStats.topFiveWins,
      top5Wins:visibleStats.topFiveWins,
      rankedWins:visibleStats.rankedWins,
      primeRecord:visibleStats.primeRecord,
      primeWins:Number(prime.wins||0),
      primeLosses:Number(prime.losses||0),
      primeDraws:Number(prime.draws||0),
      primeNoContests:Number(prime.noContests||0),
      primeFights:Number(prime.scoredFights||0),
      primeFinishes:Number(prime.finishWins||0),
      roundsWonPct:visibleStats.roundsWonPct,
      activeEliteYears:visibleStats.activeEliteYears,
      timesFinishedPrime,
      throughPrimeUfcFights:visibleStats.throughPrimeUfcFights,
      title:titleProjection(base,derived),
      opponents:opponentRows(record,derived),
      visibleStats,
      scoreInputOwner:'canonical-category-calculators',
      scoreInputVersion:state.finalScore.version,
      scoreInputSource:'canonical fighter facts + approved judgment inputs',
      overallScoreOwner:'ranking-pipeline.js',
      finalScoreEngineVersion:VERSION
    };
  }

  function buildProjection(){
    const state=sourceState();
    const existing=indexes(state.data);
    const complete=state.finalScore.approvedReport.rows.filter(row=>row.status==='complete');
    const rows=complete.map(source=>projectionRow(source,state,existing));
    const men=rows.filter(row=>row.leaderboard==='men').sort((a,b)=>a.rank-b.rank||b.totalScore-a.totalScore||a.fighter.localeCompare(b.fighter));
    const women=rows.filter(row=>row.leaderboard==='women').sort((a,b)=>a.rank-b.rank||b.totalScore-a.totalScore||a.fighter.localeCompare(b.fighter));
    const byKey=new Map(rows.map(row=>[key(row.fighter),row]));
    return {
      version:VERSION,
      sourceFinalScoreVersion:state.finalScore.version,
      sourceOvrVersion:state.ovr.version,
      sourceFactsVersion:state.facts.version,
      rows,
      men,
      women,
      entryFor:fighter=>clone(byKey.get(key(fighter))||null)
    };
  }

  function apply(){
    const state=sourceState();
    const projection=buildProjection();
    const previousProfiles=new Map((state.data.fighters||[]).filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
    state.data.men=projection.men.map(clone);
    state.data.women=projection.women.map(clone);
    state.data.fighters=projection.rows.map(row=>({
      ...stripCalculated(previousProfiles.get(key(row.fighter))),
      ...clone(row)
    }));
    state.data.primeRecords=state.data.primeRecords||{};
    projection.rows.forEach(row=>{
      const record=state.facts.get(row.fighter);
      state.data.primeRecords[row.fighter]={
        record:row.primeRecord,
        context:record?.primeWindow?.note||'',
        startFightId:record?.primeWindow?.startFightId||null,
        endFightId:record?.primeWindow?.open?null:(record?.primeWindow?.endFightId||null),
        open:Boolean(record?.primeWindow?.open)
      };
    });
    state.data.meta=state.data.meta||{};
    state.data.meta.calculatedRankingPipeline={
      version:VERSION,
      status:'applied',
      fighterCount:projection.rows.length,
      menCount:projection.men.length,
      womenCount:projection.women.length,
      facts:projection.sourceFactsVersion,
      categoriesAndTotals:projection.sourceFinalScoreVersion,
      ovr:projection.sourceOvrVersion,
      ownership:{
        facts:'canonical-fighter-facts.js',
        judgmentInputs:'approved canonical judgment inputs',
        categories:'canonical category calculators',
        totalRankOvr:'ranking-pipeline.js',
        runtimeProjection:'RANKING_DATA',
        presentation:'display/compare copy only'
      },
      frozenExpectedOutputsUsedAsAuthority:false,
      appliedAt:new Date().toISOString()
    };
    state.data.liveScoreMode='fight-level-calculated-single-owner';
    window.UFC_CALCULATED_RANKING_PROJECTION=projection;
    const report={
      ...state.data.meta.calculatedRankingPipeline,
      applied:true,
      menTopTen:projection.men.slice(0,10).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr})),
      womenTopTen:projection.women.slice(0,10).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr}))
    };
    API.latest=report;
    if(typeof document!=='undefined'&&document.documentElement?.setAttribute){
      document.documentElement.setAttribute('data-ranking-pipeline',`${VERSION}-applied-${projection.rows.length}`);
    }
    if(typeof window.dispatchEvent==='function'&&typeof CustomEvent!=='undefined'){
      window.dispatchEvent(new CustomEvent('ufc-ranking-pipeline-applied',{detail:report}));
    }
    return report;
  }

  const API={
    version:VERSION,
    role:'single production owner of calculated totals, ranks, OVRs, visible stats, and app projection',
    mutatesCanonicalFacts:false,
    readsFrozenExpectedOutputsAsAuthority:false,
    calculatedFields:Array.from(CALCULATED_FIELDS),
    buildProjection,
    apply,
    latest:null
  };

  window.UFC_RANKING_PIPELINE=API;
  if(typeof document!=='undefined'&&document.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-ranking-pipeline-ready',VERSION);
  }
})();
