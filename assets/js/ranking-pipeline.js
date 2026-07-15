// Permanent calculated ranking projection.
// Consumes approved fight-level category calculations and owns weighted totals, board ranks,
// fixed-anchor OVRs, visible stats, and the app-facing RANKING_DATA projection.
(function(){
  'use strict';

  const VERSION='ranking-pipeline-20260714b-direct-category-total-rank-ovr';
  const CATEGORY_MAX=30;
  const WEIGHTS=Object.freeze({championship:35,opponentQuality:25,primeDominance:30,longevity:10});
  const OVR_FLOOR=82;
  const OVR_CEILING=99;
  const OVR_CURVE=.85;
  const LEADER_ONLY_99=true;
  const OVR_ANCHORS=Object.freeze({
    men:Object.freeze({floorScore:18.68,ceilingScore:101.92}),
    women:Object.freeze({floorScore:25.78,ceilingScore:80.79})
  });
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
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));

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
    const categories=window.UFC_CATEGORY_CALCULATORS;
    const categoryAudit=categories?.audit?.()||null;
    const data=window.RANKING_DATA;
    const missing=[];
    if(!facts?.list||!facts?.deriveFor)missing.push('UFC_CANONICAL_FIGHTER_FACTS');
    if(!categories?.list||!categories?.entryFor)missing.push('UFC_CATEGORY_CALCULATORS');
    if(categories&&categoryAudit?.passed!==true)missing.push('complete seven-category calculation audit');
    if(!data)missing.push('RANKING_DATA');
    if(missing.length)throw new Error(`[${VERSION}] Missing production inputs: ${missing.join(', ')}`);
    return {facts,categories,categoryAudit,data};
  }

  function indexes(data){
    const board=new Map([...(data.men||[]),...(data.women||[])].filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
    const profiles=new Map((data.fighters||[]).filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
    return {board,profiles};
  }

  function weightedTotal(scores){
    const weighted={
      championship:round2((Number(scores.championship||0)/CATEGORY_MAX)*WEIGHTS.championship),
      opponentQuality:round2((Number(scores.opponentQuality||0)/CATEGORY_MAX)*WEIGHTS.opponentQuality),
      primeDominance:round2((Number(scores.primeDominance||0)/CATEGORY_MAX)*WEIGHTS.primeDominance),
      longevity:round2((Number(scores.longevity||0)/CATEGORY_MAX)*WEIGHTS.longevity)
    };
    weighted.baseScore=round2(weighted.championship+weighted.opponentQuality+weighted.primeDominance+weighted.longevity);
    weighted.apex=round2(scores.apex);
    weighted.penalty=round2(scores.penalty);
    weighted.eraDepth=round2(scores.eraDepth);
    weighted.preEraDepthTotalScore=round2(weighted.baseScore+weighted.apex+weighted.penalty);
    weighted.modifierScore=round2(weighted.apex+weighted.penalty+weighted.eraDepth);
    weighted.totalScore=round2(weighted.baseScore+weighted.modifierScore);
    return weighted;
  }

  function assignRanks(rows){
    const ranked=rows.slice().sort((a,b)=>
      b.totalScore-a.totalScore||
      b.scores.championship-a.scores.championship||
      b.scores.opponentQuality-a.scores.opponentQuality||
      a.fighter.localeCompare(b.fighter)
    );
    ranked.forEach((row,index)=>{row.calculatedRank=index+1;});
    return ranked;
  }

  function calculateOvr(totalScore,board,rank){
    const anchors=OVR_ANCHORS[board]||OVR_ANCHORS.men;
    const range=Number(anchors.ceilingScore)-Number(anchors.floorScore);
    if(range<=0)return OVR_FLOOR;
    const normalized=clamp((Number(totalScore)-Number(anchors.floorScore))/range,0,1);
    const curved=Math.pow(normalized,OVR_CURVE);
    let ovr=clamp(Math.round(OVR_FLOOR+(curved*(OVR_CEILING-OVR_FLOOR))),OVR_FLOOR,OVR_CEILING);
    if(LEADER_ONLY_99&&Number(rank)>1&&ovr===OVR_CEILING)ovr=OVR_CEILING-1;
    return ovr;
  }

  function calculatedRows(state){
    const categoryRows=state.categories.list();
    const blocked=categoryRows.filter(row=>row.status!=='complete');
    if(blocked.length)throw new Error(`[${VERSION}] Blocked category rows: ${blocked.map(row=>row.fighter).join(', ')}`);
    const prepared=categoryRows.map(row=>{
      const scores={
        championship:round2(row.championship),
        opponentQuality:round2(row.opponentQuality),
        primeDominance:round2(row.primeDominance),
        longevity:round2(row.longevity),
        apex:round2(row.apex),
        penalty:round2(row.penalty),
        eraDepth:round2(row.eraDepth)
      };
      const weighted=weightedTotal(scores);
      return {
        fighter:row.fighter,
        board:row.board,
        scores,
        weighted,
        totalScore:weighted.totalScore,
        calculatedRank:null,
        calculatedOvr:null,
        categoryTrace:row.traces
      };
    });
    const men=assignRanks(prepared.filter(row=>row.board==='men'));
    const women=assignRanks(prepared.filter(row=>row.board==='women'));
    [...men,...women].forEach(row=>{row.calculatedOvr=calculateOvr(row.totalScore,row.board,row.calculatedRank);});
    return {rows:[...men,...women],men,women};
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
    if(!record||!derived)throw new Error(`[${VERSION}] Missing canonical fact projection for ${source.fighter}.`);

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
      championship:source.scores.championship,
      opponentQuality:source.scores.opponentQuality,
      primeDominance:source.scores.primeDominance,
      longevity:source.scores.longevity,
      apexPeak:source.scores.apex,
      apexPeakBonus:source.scores.apex,
      penalty:source.scores.penalty,
      lossPenalty:source.scores.penalty,
      lossContext:source.scores.penalty,
      eraDepthAdjustment:source.scores.eraDepth,
      baseScore:weighted.baseScore,
      preEraDepthTotalScore:weighted.preEraDepthTotalScore,
      weightedScoreBreakdown:clone(weighted),
      totalScore:source.totalScore,
      rawScore:source.totalScore,
      overallOvr:Number(source.calculatedOvr),
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
      scoreInputOwner:'category-calculators.js',
      scoreInputVersion:state.categories.version,
      scoreInputSource:'canonical fighter facts + approved judgment inputs',
      overallScoreOwner:'ranking-pipeline.js',
      finalScoreEngineVersion:VERSION
    };
  }

  function buildProjection(){
    const state=sourceState();
    const existing=indexes(state.data);
    const calculated=calculatedRows(state);
    const rows=calculated.rows.map(source=>projectionRow(source,state,existing));
    const men=rows.filter(row=>row.leaderboard==='men').sort((a,b)=>a.rank-b.rank||b.totalScore-a.totalScore||a.fighter.localeCompare(b.fighter));
    const women=rows.filter(row=>row.leaderboard==='women').sort((a,b)=>a.rank-b.rank||b.totalScore-a.totalScore||a.fighter.localeCompare(b.fighter));
    const byKey=new Map(rows.map(row=>[key(row.fighter),row]));
    return {
      version:VERSION,
      sourceFactsVersion:state.facts.version,
      sourceCategoryVersion:state.categories.version,
      categoryAudit:clone(state.categoryAudit),
      weights:clone(WEIGHTS),
      categoryMax:CATEGORY_MAX,
      ovr:{floor:OVR_FLOOR,ceiling:OVR_CEILING,curve:OVR_CURVE,leaderOnly99:LEADER_ONLY_99,anchors:clone(OVR_ANCHORS)},
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
    const nextMen=projection.men.map(clone);
    const nextWomen=projection.women.map(clone);
    const nextProfiles=projection.rows.map(row=>({
      ...stripCalculated(previousProfiles.get(key(row.fighter))),
      ...clone(row)
    }));
    if(Array.isArray(state.data.men))state.data.men.splice(0,state.data.men.length,...nextMen);else state.data.men=nextMen;
    if(Array.isArray(state.data.women))state.data.women.splice(0,state.data.women.length,...nextWomen);else state.data.women=nextWomen;
    if(Array.isArray(state.data.fighters))state.data.fighters.splice(0,state.data.fighters.length,...nextProfiles);else state.data.fighters=nextProfiles;
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
      categories:projection.sourceCategoryVersion,
      weights:clone(WEIGHTS),
      ovr:clone(projection.ovr),
      ownership:{
        facts:'canonical-fighter-facts.js',
        judgmentInputs:'approved canonical judgment inputs',
        categories:'category-calculators.js',
        totalRankOvr:'ranking-pipeline.js',
        runtimeProjection:'RANKING_DATA',
        presentation:'display/compare copy only'
      },
      frozenExpectedOutputsUsedAsAuthority:false,
      shadowFinalOrOvrReportsUsedAsAuthority:false,
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
    weights:clone(WEIGHTS),
    categoryMax:CATEGORY_MAX,
    ovr:{floor:OVR_FLOOR,ceiling:OVR_CEILING,curve:OVR_CURVE,leaderOnly99:LEADER_ONLY_99,anchors:clone(OVR_ANCHORS)},
    mutatesCanonicalFacts:false,
    readsFrozenExpectedOutputsAsAuthority:false,
    readsShadowFinalOrOvrReportsAsAuthority:false,
    calculatedFields:Array.from(CALCULATED_FIELDS),
    weightedTotal,
    calculateOvr,
    buildProjection,
    apply,
    latest:null
  };

  window.UFC_RANKING_PIPELINE=API;
  if(typeof document!=='undefined'&&document.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-ranking-pipeline-ready',VERSION);
  }
})();
