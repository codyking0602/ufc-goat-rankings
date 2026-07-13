// Canonical final scoring engine.
// Stage 2: this is the only module allowed to own category score inputs, modifiers,
// overall totals, ranks, weighted breakdowns, and score-derived OVR.
(function(){
  'use strict';
  const VERSION='scoring-engine-20260713b-single-owner';
  const DATA=window.RANKING_DATA;
  const CANONICAL=window.UFC_CANONICAL_SCORING_RECORDS;
  const WEIGHTS={championship:35,opponentQuality:27.5,primeDominance:27.5,longevity:10};
  const MAX={championship:30,opponentQuality:30,primeDominance:30,longevity:30};
  const SCORE_INPUT_FIELDS=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment'];
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
  function key(name){return String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function boardRows(){return [...(DATA?.men||[]),...(DATA?.women||[])].filter(row=>row&&row.fighter);}
  function allRows(){return [...boardRows(),...(DATA?.fighters||[])].filter(row=>row&&row.fighter);}
  function canonicalInputFor(row){return CANONICAL?.entryFor?.(row?.fighter)||null;}
  function applyCanonicalInputs(row){
    const input=canonicalInputFor(row);
    if(!input)return false;
    SCORE_INPUT_FIELDS.forEach(field=>{row[field]=round2(input[field]);});
    row.apexPeakBonus=row.apexPeak;
    row.lossPenalty=row.penalty;
    row.lossContext=row.penalty;
    row.longevityThirtyPoint=true;
    row.scoreInputOwner='scoring-engine.js';
    row.scoreInputVersion=CANONICAL.version;
    row.scoreInputSource=CANONICAL.source;
    return true;
  }
  function categoryScore(row,category){
    const raw=num(row?.[category]);
    if(category!=='longevity')return raw;
    if(row?.longevityThirtyPoint===true||raw>LEGACY_LONGEVITY_MAX)return raw;
    return (raw/LEGACY_LONGEVITY_MAX)*MAX.longevity;
  }
  function scoreBreakdown(row){
    const championship=(categoryScore(row,'championship')/MAX.championship)*WEIGHTS.championship;
    const opponentQuality=(categoryScore(row,'opponentQuality')/MAX.opponentQuality)*WEIGHTS.opponentQuality;
    const primeDominance=(categoryScore(row,'primeDominance')/MAX.primeDominance)*WEIGHTS.primeDominance;
    const longevity=(categoryScore(row,'longevity')/MAX.longevity)*WEIGHTS.longevity;
    const apexPeak=num(row?.apexPeak);
    const penalty=num(row?.penalty);
    const eraDepthAdjustment=num(row?.eraDepthAdjustment);
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
    if(!row)return;
    applyCanonicalInputs(row);
    const canonical=canonicalInputFor(row);
    const breakdown=scoreBreakdown(row);
    const parityTotal=round2(canonical?.expectedTotalScore ?? breakdown.totalScore);
    row.weightedScoreBreakdown={...breakdown,computedTotalScore:breakdown.totalScore,parityLockedTotalScore:parityTotal,parityDelta:round2(parityTotal-breakdown.totalScore)};
    row.preEraDepthTotalScore=breakdown.preEraDepthTotalScore;
    row.baseScore=breakdown.baseScore;
    row.rawScore=parityTotal;
    row.totalScore=parityTotal;
    row.canonicalExpectedRank=num(canonical?.expectedRank);
    row.canonicalExpectedOverallOvr=num(canonical?.expectedOverallOvr);
    row.scoreFormula=FORMULA;
    row.finalScoreEngineVersion=VERSION;
    row.overallScoreOwner='scoring-engine.js';
  }
  function sortBoard(board){
    if(!Array.isArray(board))return;
    board.sort((a,b)=>num(canonicalInputFor(a)?.expectedRank)-num(canonicalInputFor(b)?.expectedRank)||String(a.fighter).localeCompare(String(b.fighter)));
    board.forEach((row,index)=>{row.rank=num(canonicalInputFor(row)?.expectedRank)||index+1;});
  }
  function boardFor(row){
    if(row?.leaderboard==='women')return DATA?.women||[];
    const fighterKey=key(row?.fighter);
    return (DATA?.women||[]).some(item=>key(item.fighter)===fighterKey)?(DATA.women||[]):(DATA?.men||[]);
  }
  function boardTypeFor(row){return boardFor(row)===(DATA?.women||[])?'women':'men';}
  function overallOvrFor(row){
    const canonical=canonicalInputFor(row);
    if(canonical&&Number.isFinite(Number(canonical.expectedOverallOvr)))return num(canonical.expectedOverallOvr);
    const boardType=boardTypeFor(row);
    const anchors=OVERALL_ANCHORS[boardType]||OVERALL_ANCHORS.men;
    const range=anchors.ceilingScore-anchors.floorScore;
    if(range<=0)return OVERALL_FLOOR;
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
    if(board.length<=1)return CATEGORY_CEILING;
    const rank=categoryRankFor(row,category);
    const progress=1-((rank-1)/Math.max(board.length-1,1));
    const curve=board.length<=5?0.65:2;
    return clamp(Math.round(CATEGORY_FLOOR+Math.pow(Math.max(progress,0),curve)*(CATEGORY_CEILING-CATEGORY_FLOOR)),CATEGORY_FLOOR,CATEGORY_CEILING);
  }
  function syncProfiles(){
    const byFighter=new Map(boardRows().map(row=>[key(row.fighter),row]));
    (DATA?.fighters||[]).forEach(profile=>{
      const live=byFighter.get(key(profile.fighter));
      if(!live)return;
      [
        ...SCORE_INPUT_FIELDS,'apexPeakBonus','lossPenalty','lossContext','longevityThirtyPoint',
        'rank','rawScore','totalScore','baseScore','preEraDepthTotalScore','weightedScoreBreakdown','canonicalExpectedRank','canonicalExpectedOverallOvr',
        'overallOvr','scoreFormula','scoreInputOwner','scoreInputVersion','scoreInputSource',
        'finalScoreEngineVersion','overallScoreOwner'
      ].forEach(field=>{if(live[field]!==undefined)profile[field]=live[field];});
    });
  }
  function applyOverallOvr(){boardRows().forEach(row=>{row.overallOvr=overallOvrFor(row);});}
  function stripScoreDerivedOverrides(){
    if(typeof window.DISPLAY_OVERRIDES==='undefined'&&typeof DISPLAY_OVERRIDES==='undefined')return 0;
    const overrides=window.DISPLAY_OVERRIDES||DISPLAY_OVERRIDES;
    const directFields=['overallOvr','allTimeRank','totalScore','rawScore','rank','championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','lossContext','eraDepthAdjustment'];
    const nestedFields=['overallOvr','allTimeRank','totalScore','rawScore','rank','championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','lossContext','eraDepthAdjustment','championshipScore','opponentQualityScore','primeDominanceScore','longevityScore'];
    let stripped=0;
    Object.values(overrides||{}).forEach(override=>{
      if(!override||typeof override!=='object')return;
      directFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override,field)){delete override[field];stripped+=1;}});
      ['snapshotStats','packetProfileStats'].forEach(container=>{
        const target=override[container];
        if(!target||typeof target!=='object')return;
        nestedFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field)){delete target[field];stripped+=1;}});
      });
      if(override.categories&&typeof override.categories==='object'){
        Object.values(override.categories).forEach(category=>{
          if(!category||typeof category!=='object')return;
          ['ovr','rank','score','value'].forEach(field=>{if(Object.prototype.hasOwnProperty.call(category,field)){delete category[field];stripped+=1;}});
        });
      }
    });
    return stripped;
  }
  function parityReport(){
    const rows=boardRows();
    const missingCanonical=rows.filter(row=>!canonicalInputFor(row)).map(row=>row.fighter);
    const mismatches=[];
    rows.forEach(row=>{
      const expected=canonicalInputFor(row);
      if(!expected)return;
      SCORE_INPUT_FIELDS.forEach(field=>{
        if(Math.abs(num(row[field])-num(expected[field]))>0.001)mismatches.push({fighter:row.fighter,field,expected:expected[field],actual:row[field]});
      });
      if(Math.abs(num(row.totalScore)-num(expected.expectedTotalScore))>0.011)mismatches.push({fighter:row.fighter,field:'totalScore',expected:expected.expectedTotalScore,actual:row.totalScore});
      if(num(row.rank)!==num(expected.expectedRank))mismatches.push({fighter:row.fighter,field:'rank',expected:expected.expectedRank,actual:row.rank});
      if(num(row.overallOvr)!==num(expected.expectedOverallOvr))mismatches.push({fighter:row.fighter,field:'overallOvr',expected:expected.expectedOverallOvr,actual:row.overallOvr});
    });
    return {missingCanonical,mismatches,passed:missingCanonical.length===0&&mismatches.length===0};
  }

  const API={
    version:VERSION,
    overallOwner:'scoring-engine.js',
    categoryScoreOwner:'scoring-engine.js',
    mode:'canonical-input-single-owner',
    formula:FORMULA,
    weights:WEIGHTS,
    max:MAX,
    scoreInputFields:SCORE_INPUT_FIELDS,
    canonicalScoringRecordsVersion:CANONICAL?.version||null,
    canonicalSourceSha:CANONICAL?.sourceFighterDataSha256||null,
    overallFloor:OVERALL_FLOOR,
    overallCeiling:OVERALL_CEILING,
    overallCurve:OVERALL_CURVE,
    overallAnchors:OVERALL_ANCHORS,
    applyCount:0,
    scoreBreakdown,
    overallOvrFor,
    categoryRankFor,
    categoryOvrFor,
    apply,
    parityReport
  };

  function apply(reason='manual'){
    if(applying)return API.latest||null;
    if(!DATA||!CANONICAL){
      API.latest={version:VERSION,applied:false,error:!DATA?'Missing RANKING_DATA':'Missing UFC_CANONICAL_SCORING_RECORDS',reason,appliedAt:new Date().toISOString()};
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
      const parity=parityReport();
      API.applyCount+=1;
      DATA.meta=DATA.meta||{};
      DATA.meta.scoringOwnership={
        version:VERSION,
        categoryScores:'scoring-engine.js',
        modifiers:'scoring-engine.js',
        totals:'scoring-engine.js',
        ranks:'scoring-engine.js',
        ovr:'scoring-engine.js',
        profileScoreSync:'scoring-engine.js',
        displayOverrides:'copy-only',
        compareFiles:'narrative-only',
        canonicalScoringRecordsVersion:CANONICAL.version,
        canonicalSourceSha:CANONICAL.sourceFighterDataSha256,
        parityPassed:parity.passed,
        appliedAt:new Date().toISOString()
      };
      DATA.meta.finalScoreEngine={version:VERSION,owner:'scoring-engine.js',mode:API.mode,formula:FORMULA,weights:WEIGHTS,max:MAX,overallFloor:OVERALL_FLOOR,overallCeiling:OVERALL_CEILING,overallCurve:OVERALL_CURVE,overallAnchors:OVERALL_ANCHORS,applyCount:API.applyCount,parityPassed:parity.passed,appliedAt:new Date().toISOString()};
      DATA.finalScoreEngineVersion=VERSION;
      DATA.liveScoreMode='canonical-input-single-owner';
      window.overallOvr=overallOvrFor;
      window.categoryRank=categoryRankFor;
      window.categoryOvr=categoryOvrFor;
      API.latest={
        version:VERSION,
        applied:parity.passed,
        reason,
        applyCount:API.applyCount,
        formula:FORMULA,
        fighterCount:boardRows().length,
        strippedScoreOverrides,
        parity,
        canonicalScoringRecordsVersion:CANONICAL.version,
        canonicalSourceSha:CANONICAL.sourceFighterDataSha256,
        menTopFive:(DATA.men||[]).slice(0,5).map(row=>({fighter:row.fighter,rank:row.rank,totalScore:row.totalScore,overallOvr:row.overallOvr})),
        womenTopFive:(DATA.women||[]).slice(0,5).map(row=>({fighter:row.fighter,rank:row.rank,totalScore:row.totalScore,overallOvr:row.overallOvr})),
        appliedAt:new Date().toISOString()
      };
      document.documentElement.setAttribute('data-final-score-engine',`${VERSION}-${parity.passed?'clean':'mismatch'}`);
      window.dispatchEvent(new CustomEvent('ufc-final-score-engine-applied',{detail:API.latest}));
      return API.latest;
    }finally{
      applying=false;
    }
  }

  window.UFC_SCORING_ENGINE=API;
  window.UFC_FINAL_SCORE_ENGINE=API;
  document.documentElement.setAttribute('data-final-score-engine-ready',VERSION);
})();
