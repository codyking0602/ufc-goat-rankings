// Apex Peak Live Bonus Promoter.
// Adds Apex Peak as a positive modifier after the 100-point base score.
// Formula: weighted positive base + apexPeak + loss penalty.
(function(){
  const VERSION='apex-peak-live-bonus-20260709a-positive-modifier';
  const DATA=window.RANKING_DATA;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function num(value){const n=Number(value||0);return Number.isFinite(n)?n:0;}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*100)/100:0;}
  function categoryScore(row,category){
    if(category==='longevity'){
      const raw=num(row.longevity);
      if(row.longevityThirtyPoint===true || raw>15) return raw;
      return (raw/15)*30;
    }
    return num(row[category]);
  }
  function weightedBreakdown(row){
    const championship=(categoryScore(row,'championship')/30)*35;
    const opponentQuality=(categoryScore(row,'opponentQuality')/30)*27.5;
    const primeDominance=(categoryScore(row,'primeDominance')/30)*27.5;
    const longevity=(categoryScore(row,'longevity')/30)*10;
    const apexPeak=num(row.apexPeak);
    const penalty=num(row.penalty);
    const positiveScore=championship+opponentQuality+primeDominance+longevity;
    const modifierScore=apexPeak+penalty;
    return {
      championship:round2(championship),
      opponentQuality:round2(opponentQuality),
      primeDominance:round2(primeDominance),
      longevity:round2(longevity),
      apexPeak:round2(apexPeak),
      apexPeakBonus:round2(apexPeak),
      positiveScore:round2(positiveScore),
      penalty:round2(penalty),
      modifierScore:round2(modifierScore),
      totalScore:round2(positiveScore+modifierScore)
    };
  }
  function boardRows(){return [...(DATA?.men||[]),...(DATA?.women||[])];}
  function allRows(){return [...boardRows(),...(DATA?.fighters||[])].filter(row=>row&&row.fighter);}
  function sortBoard(board){
    if(!Array.isArray(board))return;
    board.sort((a,b)=>num(b.totalScore)-num(a.totalScore)||String(a.fighter).localeCompare(String(b.fighter)));
    board.forEach((row,index)=>{row.rank=index+1;});
  }
  function apply(){
    if(!DATA){
      const status={version:VERSION,applied:false,error:'Missing RANKING_DATA',mutatesScores:true,apply};
      window.UFC_APEX_PEAK_LIVE_BONUS=status;
      return status;
    }
    const applied=[];
    allRows().forEach(row=>{
      const breakdown=weightedBreakdown(row);
      row.weightedScoreBreakdown=breakdown;
      row.totalScore=breakdown.totalScore;
      row.apexPeakBonusLive=true;
      row.apexPeakBonusVersion=VERSION;
      applied.push({fighter:row.fighter,apexPeak:breakdown.apexPeak,totalScore:breakdown.totalScore});
    });

    sortBoard(DATA.men);
    sortBoard(DATA.women);

    const boards=boardRows();
    const rankByName=new Map(boards.map(row=>[key(row.fighter),row.rank]));
    const totalByName=new Map(boards.map(row=>[key(row.fighter),row.totalScore]));
    const breakdownByName=new Map(boards.map(row=>[key(row.fighter),row.weightedScoreBreakdown]));

    (DATA.fighters||[]).forEach(profile=>{
      const k=key(profile.fighter);
      if(rankByName.has(k))profile.rank=rankByName.get(k);
      if(totalByName.has(k))profile.totalScore=totalByName.get(k);
      if(breakdownByName.has(k))profile.weightedScoreBreakdown=breakdownByName.get(k);
      profile.apexPeakBonusLive=true;
      profile.apexPeakBonusVersion=VERSION;
    });

    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      boards.forEach(row=>{
        const override=DISPLAY_OVERRIDES[row.fighter];
        if(!override)return;
        override.allTimeRank=row.rank;
        if(Object.prototype.hasOwnProperty.call(override,'overallOvr')) delete override.overallOvr;
      });
    }

    if(DATA.meta){
      DATA.meta.apexPeakBonusLive=true;
      DATA.meta.apexPeakBonusVersion=VERSION;
      DATA.meta.apexPeakBonusFormula='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty';
    }

    const unique=[];
    const seen=new Set();
    applied.forEach(item=>{const k=key(item.fighter);if(seen.has(k))return;seen.add(k);unique.push(item);});
    const status={
      version:VERSION,
      applied:true,
      appliedCount:unique.length,
      topMen:(DATA.men||[]).slice(0,10).map(row=>({fighter:row.fighter,totalScore:row.totalScore,apexPeak:row.apexPeak,rank:row.rank})),
      topWomen:(DATA.women||[]).slice(0,10).map(row=>({fighter:row.fighter,totalScore:row.totalScore,apexPeak:row.apexPeak,rank:row.rank})),
      formula:'weighted positive base + apexPeak + penalty',
      mutatesScores:true,
      apply,
      appliedAt:new Date().toISOString()
    };
    window.UFC_APEX_PEAK_LIVE_BONUS=status;
    document.documentElement.setAttribute('data-apex-peak-live-bonus',VERSION);
    if(typeof refresh==='function'){
      try{refresh();}catch(e){}
    }
    return status;
  }

  apply();
})();
