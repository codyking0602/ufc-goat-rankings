// Canonical final scoring engine.
// This is the only module intended to own overall totals, ranks, weighted breakdowns, and score-derived OVR.
(function(){
  const VERSION='final-score-engine-20260710a';
  const DATA=window.RANKING_DATA;
  const WEIGHTS={championship:35,opponentQuality:27.5,primeDominance:27.5,longevity:10};
  const MAX={championship:30,opponentQuality:30,primeDominance:30,longevity:30};
  const LEGACY_LONGEVITY_MAX=15;
  const OVERALL_FLOOR=82;
  const OVERALL_CEILING=99;
  const CATEGORY_FLOOR=75;
  const CATEGORY_CEILING=99;
  const FORMULA='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty';
  let applying=false;

  function num(value){
    const n=Number(value ?? 0);
    return Number.isFinite(n)?n:0;
  }
  function round2(value){
    return Math.round((num(value)+Number.EPSILON)*100)/100;
  }
  function clamp(value,min,max){
    return Math.max(min,Math.min(max,value));
  }
  function key(name){
    return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  }
  function boardRows(){
    return [...(DATA?.men||[]),...(DATA?.women||[])].filter(row=>row&&row.fighter);
  }
  function allRows(){
    return [...boardRows(),...(DATA?.fighters||[])].filter(row=>row&&row.fighter);
  }
  function categoryScore(row,category){
    const raw=num(row?.[category]);
    if(category!=='longevity') return raw;
    if(row?.longevityThirtyPoint===true || raw>LEGACY_LONGEVITY_MAX) return raw;
    return (raw/LEGACY_LONGEVITY_MAX)*MAX.longevity;
  }
  function scoreBreakdown(row){
    const championship=(categoryScore(row,'championship')/MAX.championship)*WEIGHTS.championship;
    const opponentQuality=(categoryScore(row,'opponentQuality')/MAX.opponentQuality)*WEIGHTS.opponentQuality;
    const primeDominance=(categoryScore(row,'primeDominance')/MAX.primeDominance)*WEIGHTS.primeDominance;
    const longevity=(categoryScore(row,'longevity')/MAX.longevity)*WEIGHTS.longevity;
    const apexPeak=num(row?.apexPeak);
    const penalty=num(row?.penalty);
    const baseScore=championship+opponentQuality+primeDominance+longevity;
    const modifierScore=apexPeak+penalty;
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
      modifierScore:round2(modifierScore),
      totalScore:round2(totalScore)
    };
  }
  function patchScore(row){
    if(!row) return;
    const breakdown=scoreBreakdown(row);
    row.weightedScoreBreakdown=breakdown;
    row.rawScore=breakdown.totalScore;
    row.totalScore=breakdown.totalScore;
    row.finalScoreEngineVersion=VERSION;
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
  function overallOvrFor(row){
    const board=boardFor(row);
    const values=board.map(item=>num(item.totalScore));
    if(!values.length) return OVERALL_FLOOR;
    const min=Math.min(...values);
    const max=Math.max(...values);
    if(max===min) return OVERALL_CEILING;
    const normalized=(num(row?.totalScore)-min)/(max-min);
    return clamp(Math.round(OVERALL_FLOOR+normalized*(OVERALL_CEILING-OVERALL_FLOOR)),OVERALL_FLOOR,OVERALL_CEILING);
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
    const boards=boardRows();
    const byFighter=new Map(boards.map(row=>[key(row.fighter),row]));
    (DATA?.fighters||[]).forEach(profile=>{
      const live=byFighter.get(key(profile.fighter));
      if(!live) return;
      profile.rank=live.rank;
      profile.rawScore=live.rawScore;
      profile.totalScore=live.totalScore;
      profile.weightedScoreBreakdown=live.weightedScoreBreakdown;
      profile.overallOvr=live.overallOvr;
      profile.finalScoreEngineVersion=VERSION;
    });
  }
  function applyOverallOvr(){
    boardRows().forEach(row=>{row.overallOvr=overallOvrFor(row);});
  }
  function stripScoreDerivedOverrides(){
    if(typeof window.DISPLAY_OVERRIDES==='undefined' && typeof DISPLAY_OVERRIDES==='undefined') return 0;
    const overrides=window.DISPLAY_OVERRIDES||DISPLAY_OVERRIDES;
    let stripped=0;
    Object.values(overrides||{}).forEach(override=>{
      if(!override||typeof override!=='object') return;
      ['overallOvr','allTimeRank','totalScore','rawScore','rank'].forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(override,field)){
          delete override[field];
          stripped+=1;
        }
      });
      if(override.categories&&typeof override.categories==='object'){
        Object.values(override.categories).forEach(category=>{
          if(!category||typeof category!=='object') return;
          ['ovr','rank','score','value'].forEach(field=>{
            if(Object.prototype.hasOwnProperty.call(category,field)){
              delete category[field];
              stripped+=1;
            }
          });
        });
      }
    });
    return stripped;
  }

  const API={
    version:VERSION,
    formula:FORMULA,
    weights:WEIGHTS,
    max:MAX,
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
      if(DATA.meta){
        DATA.meta.finalScoreEngine={version:VERSION,formula:FORMULA,weights:WEIGHTS,max:MAX,appliedAt:new Date().toISOString()};
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
        formula:FORMULA,
        fighterCount:boardRows().length,
        strippedScoreOverrides,
        menTopFive:(DATA.men||[]).slice(0,5).map(row=>({fighter:row.fighter,rank:row.rank,totalScore:row.totalScore,overallOvr:row.overallOvr})),
        womenTopFive:(DATA.women||[]).slice(0,5).map(row=>({fighter:row.fighter,rank:row.rank,totalScore:row.totalScore,overallOvr:row.overallOvr})),
        appliedAt:new Date().toISOString()
      };
      document.documentElement.setAttribute('data-final-score-engine',VERSION);
      return API.latest;
    } finally {
      applying=false;
    }
  }

  function installRefreshWrapper(){
    if(typeof window.refresh!=='function'||window.refresh.__finalScoreEngineWrapped) return;
    const originalRefresh=window.refresh;
    const wrapped=function(){
      apply('refresh');
      return originalRefresh.apply(this,arguments);
    };
    wrapped.__finalScoreEngineWrapped=true;
    wrapped.__finalScoreEngineOriginal=originalRefresh;
    window.refresh=wrapped;
  }

  window.UFC_FINAL_SCORE_ENGINE=API;
  apply('initial-load');
  installRefreshWrapper();
})();
