// Canonical final scoring engine.
// This is the only module allowed to own overall totals, ranks, weighted breakdowns, and score-derived OVR.
(function(){
  'use strict';
  const VERSION='final-score-engine-20260712b-era-shadow-fallback';
  const DATA=window.RANKING_DATA;
  const WEIGHTS={championship:35,opponentQuality:27.5,primeDominance:27.5,longevity:10};
  const MAX={championship:30,opponentQuality:30,primeDominance:30,longevity:30};
  const LEGACY_LONGEVITY_MAX=15;
  const OVERALL_FLOOR=82;
  const OVERALL_CEILING=99;
  const OVERALL_CURVE=0.85;
  const OVERALL_ANCHORS={
    men:{floorScore:18.68,ceilingScore:101.92},
    women:{floorScore:25.78,ceilingScore:80.79}
  };
  const CATEGORY_FLOOR=75;
  const CATEGORY_CEILING=99;
  const FORMULA='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty + eraDepthAdjustment';
  let applying=false;

  function num(value){const n=Number(value??0);return Number.isFinite(n)?n:0;}
  function round2(value){return Math.round((num(value)+Number.EPSILON)*100)/100;}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  const ERA_DEPTH_BY_FIGHTER=new Map((window.UFC_DIVISION_ERA_DEPTH_SHADOW?.fighters||[]).map(row=>[key(row?.fighter),row]));
  function eraDepthAdjustmentFor(row){
    const direct=row?.eraDepthAdjustment;
    if(direct!==undefined&&direct!==null&&direct!==''&&Number.isFinite(Number(direct)))return Number(direct);
    return num(ERA_DEPTH_BY_FIGHTER.get(key(row?.fighter))?.curvedAdjustment);
  }
  function boardRows(){return [...(DATA?.men||[]),...(DATA?.women||[])].filter(row=>row&&row.fighter);}
  function allRows(){return [...boardRows(),...(DATA?.fighters||[])].filter(row=>row&&row.fighter);}
  function categoryScore(row,category){
    const raw=num(row?.[category]);
    if(category!=='longevity') return raw;
    if(row?.longevityThirtyPoint===true||raw>LEGACY_LONGEVITY_MAX) return raw;
    return (raw/LEGACY_LONGEVITY_MAX)*MAX.longevity;
  }
  function scoreBreakdown(row){
    const championship=(categoryScore(row,'championship')/MAX.championship)*WEIGHTS.championship;
    const opponentQuality=(categoryScore(row,'opponentQuality')/MAX.opponentQuality)*WEIGHTS.opponentQuality;
    const primeDominance=(categoryScore(row,'primeDominance')/MAX.primeDominance)*WEIGHTS.primeDominance;
    const longevity=(categoryScore(row,'longevity')/MAX.longevity)*WEIGHTS.longevity;
    const apexPeak=num(row?.apexPeak);
    const penalty=num(row?.penalty);
    const eraDepthAdjustment=eraDepthAdjustmentFor(row);
    const baseScore=championship+opponentQuality+primeDominance+longevity;
    const preEraDepthTotalScore=baseScore+apexPeak+penalty;
    const modifierScore=apexPeak+penalty+eraDepthAdjustment;
    const totalScore=baseScore+modifierScore;
    return {
      championship:round2(championship),
      opponentQuality:round2(opponentQuality),
      primeDominance:round2(primeDominance),
      longevity:round2(longevity),
      baseScore:round2(baseScore),
      positiveScore:round2(baseScore),
      apexPeak:round2(apexPeak),
      apexPeakBonus:round2(apexPeak),
      penalty:round2(penalty),
      eraDepthAdjustment:round2(eraDepthAdjustment),
      preEraDepthTotalScore:round2(preEraDepthTotalScore),
      modifierScore:round2(modifierScore),
      totalScore:round2(totalScore)
    };
  }
  function patchScore(row){
    if(!row) return;
    const breakdown=scoreBreakdown(row);
    row.weightedScoreBreakdown=breakdown;
    row.eraDepthAdjustment=breakdown.eraDepthAdjustment;
    row.preEraDepthTotalScore=breakdown.preEraDepthTotalScore;
    row.rawScore=breakdown.totalScore;
    row.totalScore=breakdown.totalScore;
    row.finalScoreEngineVersion=VERSION;
    row.overallScoreOwner='final-score-engine.js';
  }
  function sortBoard(board){
    if(!Array.isArray(board)) return;
    board.sort((a,b)=>num(b.totalScore)-num(a.totalScore)||String(a.fighter).localeCompare(String(b.fighter)));
    board.forEach((row,index)=>{row.rank=index+1;});
  }
  function boardFor(row){
    if(row?.leaderboard==='women') return DATA?.women||[];
    const fighterKey=key(row?.fighter);
    return (DATA?.women||[]).some(item=>key(item.fighter)===fighterKey)?(DATA.women||[]):(DATA?.men||[]);
  }
  function boardTypeFor(row){
    return boardFor(row)===(DATA?.women||[])?'women':'men';
  }
  function overallOvrFor(row){
    const boardType=boardTypeFor(row);
    const anchors=OVERALL_ANCHORS[boardType]||OVERALL_ANCHORS.men;
    const range=anchors.ceilingScore-anchors.floorScore;
    if(range<=0) return OVERALL_FLOOR;
    const normalized=clamp((num(row?.totalScore)-anchors.floorScore)/range,0,1);
    const curved=Math.pow(normalized,OVERALL_CURVE);
    return clamp(Math.round(OVERALL_FLOOR+curved*(OVERALL_CEILING-OVERALL_FLOOR)),OVERALL_FLOOR,OVERALL_CEILING);
  }
  function categoryRankFor(row,category){
    const board=boardFor(row);
    const value=categoryScore(row,category);
    return 1+board.filter(item=>categoryScore(item,category)>value).length;
  }
  function categoryOvrFor(row,category){
    const board=boardFor(row);
    if(board.length<=1) return CATEGORY_CEILING;
    const rank=categoryRankFor(row,category);
    const progress=1-((rank-1)/Math.max(board.length-1,1));
    const curve=board.length<=5?0.65:2;
    return clamp(Math.round(CATEGORY_FLOOR+Math.pow(Math.max(progress,0),curve)*(CATEGORY_CEILING-CATEGORY_FLOOR)),CATEGORY_FLOOR,CATEGORY_CEILING);
  }
  function syncProfiles(){
    const byFighter=new Map(boardRows().map(row=>[key(row.fighter),row]));
    (DATA?.fighters||[]).forEach(profile=>{
      const live=byFighter.get(key(profile.fighter));
      if(!live) return;
      profile.rank=live.rank;
      profile.rawScore=live.rawScore;
      profile.totalScore=live.totalScore;
      profile.weightedScoreBreakdown=live.weightedScoreBreakdown;
      profile.overallOvr=live.overallOvr;
      profile.finalScoreEngineVersion=VERSION;
      profile.overallScoreOwner='final-score-engine.js';
    });
  }
  function applyOverallOvr(){boardRows().forEach(row=>{row.overallOvr=overallOvrFor(row);});}
  function stripScoreDerivedOverrides(){
    if(typeof window.DISPLAY_OVERRIDES==='undefined'&&typeof DISPLAY_OVERRIDES==='undefined') return 0;
    const overrides=window.DISPLAY_OVERRIDES||DISPLAY_OVERRIDES;
    let stripped=0;
    Object.values(overrides||{}).forEach(override=>{
      if(!override||typeof override!=='object') return;
      ['overallOvr','allTimeRank','totalScore','rawScore','rank'].forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(override,field)){delete override[field];stripped+=1;}
      });
      if(override.categories&&typeof override.categories==='object'){
        Object.values(override.categories).forEach(category=>{
          if(!category||typeof category!=='object') return;
          ['ovr','rank','score','value'].forEach(field=>{
            if(Object.prototype.hasOwnProperty.call(category,field)){delete category[field];stripped+=1;}
          });
        });
      }
    });
    return stripped;
  }

  const API={
    version:VERSION,
    overallOwner:'final-score-engine.js',
    mode:'explicit-single-pass',
    formula:FORMULA,
    weights:WEIGHTS,
    max:MAX,
    overallFloor:OVERALL_FLOOR,
    overallCeiling:OVERALL_CEILING,
    overallCurve:OVERALL_CURVE,
    overallAnchors:OVERALL_ANCHORS,
    applyCount:0,
    scoreBreakdown,
    overallOvrFor,
    categoryRankFor,
    categoryOvrFor,
    apply
  };

  function apply(reason='manual'){
    if(applying) return API.latest||null;
    if(!DATA){
      API.latest={version:VERSION,applied:false,error:'Missing RANKING_DATA',reason,appliedAt:new Date().toISOString()};
      return API.latest;
    }
    applying=true;
    try{
      allRows().forEach(patchScore);
      sortBoard(DATA.men);
      sortBoard(DATA.women);
      applyOverallOvr();
      syncProfiles();
      const strippedScoreOverrides=stripScoreDerivedOverrides();
      API.applyCount+=1;
      if(DATA.meta){
        DATA.meta.finalScoreEngine={version:VERSION,owner:'final-score-engine.js',mode:'explicit-single-pass',formula:FORMULA,weights:WEIGHTS,max:MAX,overallFloor:OVERALL_FLOOR,overallCeiling:OVERALL_CEILING,overallCurve:OVERALL_CURVE,overallAnchors:OVERALL_ANCHORS,applyCount:API.applyCount,appliedAt:new Date().toISOString()};
      }
      DATA.finalScoreEngineVersion=VERSION;
      DATA.liveScoreMode='unified-final-score-engine';
      window.overallOvr=overallOvrFor;
      window.categoryRank=categoryRankFor;
      window.categoryOvr=categoryOvrFor;
      API.latest={
        version:VERSION,
        applied:true,
        reason,
        applyCount:API.applyCount,
        formula:FORMULA,
        fighterCount:boardRows().length,
        strippedScoreOverrides,
        overallFloor:OVERALL_FLOOR,
        overallCeiling:OVERALL_CEILING,
        overallCurve:OVERALL_CURVE,
        overallAnchors:OVERALL_ANCHORS,
        menTopFive:(DATA.men||[]).slice(0,5).map(row=>({fighter:row.fighter,rank:row.rank,totalScore:row.totalScore,overallOvr:row.overallOvr})),
        womenTopFive:(DATA.women||[]).slice(0,5).map(row=>({fighter:row.fighter,rank:row.rank,totalScore:row.totalScore,overallOvr:row.overallOvr})),
        appliedAt:new Date().toISOString()
      };
      document.documentElement.setAttribute('data-final-score-engine',VERSION);
      return API.latest;
    }finally{
      applying=false;
    }
  }

  window.UFC_FINAL_SCORE_ENGINE=API;
  document.documentElement.setAttribute('data-final-score-engine-ready',VERSION);
})();
