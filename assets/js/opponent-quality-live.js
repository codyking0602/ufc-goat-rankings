// Opponent Quality live scoring layer.
// Makes the completed ledger the live category source, recalculates totals, and re-ranks boards.
(function(){
  const VERSION='opponent-quality-live-20260708a-total-score-apply';
  const DATA=window.RANKING_DATA;
  const AUDIT=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
  if(!DATA||!AUDIT||!Array.isArray(AUDIT.report))return;

  const WEIGHTS={championship:35,primeDominance:25,opponentQuality:25,longevity:10};
  const BASE_MAX={championship:30,primeDominance:30,opponentQuality:25,longevity:15};
  const DEFINITION='Opponent Quality rewards who you beat, when you beat them, and how strong the division was. Elite champions and true top contenders carry the most weight. Softer, faded, short-notice, or weird-context wins get capped.';

  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function r(v){return Math.round((n(v)+Number.EPSILON)*100)/100;}
  function boardRows(){return [...(DATA.men||[]),...(DATA.women||[])];}
  function allRowsFor(name){
    const rows=[];
    const push=row=>{if(row&&row.fighter===name)rows.push(row);};
    (DATA.men||[]).forEach(push);
    (DATA.women||[]).forEach(push);
    (DATA.fighters||[]).forEach(push);
    return rows;
  }
  function breakdown(row){
    const championship=(n(row.championship)/BASE_MAX.championship)*WEIGHTS.championship;
    const primeDominance=(n(row.primeDominance)/BASE_MAX.primeDominance)*WEIGHTS.primeDominance;
    const opponentQuality=(n(row.opponentQuality)/BASE_MAX.opponentQuality)*WEIGHTS.opponentQuality;
    const longevity=(n(row.longevity)/BASE_MAX.longevity)*WEIGHTS.longevity;
    const apexPeak=n(row.apexPeak);
    const penalty=n(row.penalty);
    const positiveScore=championship+primeDominance+opponentQuality+longevity+apexPeak;
    return {championship:r(championship),primeDominance:r(primeDominance),opponentQuality:r(opponentQuality),longevity:r(longevity),apexPeak:r(apexPeak),positiveScore:r(positiveScore),penalty:r(penalty),totalScore:r(positiveScore+penalty)};
  }
  function sortBoard(board){
    if(!Array.isArray(board))return;
    board.sort((a,b)=>n(b.totalScore)-n(a.totalScore));
    board.forEach((row,i)=>{row.rank=i+1;});
  }
  function percentileFor(rank,total){
    if(total<=1)return 99;
    return Math.max(55,Math.min(99,Math.round(99-((rank-1)/(total-1))*44)));
  }
  function updateSnapshot(snapshot,summary){
    const rows=Array.isArray(snapshot)?snapshot.slice():[];
    function upsert(label,value,tests){
      const idx=rows.findIndex(item=>Array.isArray(item)&&tests.some(re=>re.test(String(item[0]||''))));
      if(idx>=0)rows[idx]=[label,value];
      else rows.push([label,value]);
    }
    upsert('Elite+ / Top-5+ Wins',`${summary.elitePlusWins} / ${summary.topFivePlusWins}`,[/elite\s*wins/i,/quality\s*wins/i,/opponent\s*quality/i,/top[-\s]*5/i]);
    upsert('Win Profile',summary.winProfile||'Quality-wins profile loaded',[/win\s*profile/i,/resume\s*shape/i,/quality\s*type/i]);
    return rows;
  }
  function liveRankMaps(liveRows){
    const maps={men:new Map(),women:new Map()};
    ['men','women'].forEach(board=>{
      liveRows.filter(row=>row.board===board).sort((a,b)=>n(b.liveScore)-n(a.liveScore)||n(b.diminishedCredit)-n(a.diminishedCredit)||a.fighter.localeCompare(b.fighter)).forEach((row,i)=>maps[board].set(row.fighter,i+1));
    });
    return maps;
  }

  const benchmark=Math.max(...AUDIT.report.map(row=>n(row.diminishedCredit)),1);
  const liveRows=AUDIT.report.map(row=>{
    const liveScore=r(Math.min(25,Math.max(0,(n(row.diminishedCredit)/benchmark)*25)));
    return {...row,liveScore,categoryScore:liveScore,benchmarkCredit:benchmark};
  });
  const byName=new Map(liveRows.map(row=>[row.fighter,row]));
  const rankMaps=liveRankMaps(liveRows);
  const totals={men:liveRows.filter(row=>row.board==='men').length,women:liveRows.filter(row=>row.board==='women').length};

  liveRows.forEach(summary=>{
    const rank=rankMaps[summary.board]?.get(summary.fighter)||null;
    const ovr=rank?percentileFor(rank,totals[summary.board]):null;
    allRowsFor(summary.fighter).forEach(row=>{
      row.opponentQualityLegacy=row.opponentQualityLegacy??row.opponentQuality;
      row.opponentQuality=summary.liveScore;
      row.opponentQualityLive=true;
      row.opponentQualityLiveAudit={...summary,rank,ovr,sourceMode:'live'};
      row.opponentQualityShadowAudit={...summary,rank,ovr,sourceMode:'live-shadow-source'};
      row.elitePlusWins=summary.elitePlusWins;
      row.topFivePlusWins=summary.topFivePlusWins;
      row.rankedQualityWins=summary.rankedQualityWins;
      row.winProfile=summary.winProfile;
    });
    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      DISPLAY_OVERRIDES[summary.fighter]=DISPLAY_OVERRIDES[summary.fighter]||{};
      const o=DISPLAY_OVERRIDES[summary.fighter];
      o.snapshotStats={...(o.snapshotStats||{}),elitePlusWins:summary.elitePlusWins,topFivePlusWins:summary.topFivePlusWins,rankedQualityWins:summary.rankedQualityWins,bestQualityWins:(summary.bestWins||[]).slice(0,5).join(', '),winProfile:summary.winProfile,opponentQualityScore:summary.liveScore};
      o.categories={...(o.categories||{})};
      o.categories.opponentQuality={ovr,rank};
      o.snapshot=updateSnapshot(o.snapshot,summary);
    }
  });

  [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].forEach(row=>{
    if(!row)return;
    const b=breakdown(row);
    row.weightedScoreBreakdown=b;
    row.totalScore=b.totalScore;
    row.scoreWeightingVersion=VERSION;
  });
  sortBoard(DATA.men);
  sortBoard(DATA.women);

  const rankByFighter=new Map(boardRows().map(row=>[row.fighter,row.rank]));
  const totalByFighter=new Map(boardRows().map(row=>[row.fighter,row.totalScore]));
  const breakdownByFighter=new Map(boardRows().map(row=>[row.fighter,row.weightedScoreBreakdown]));
  (DATA.fighters||[]).forEach(profile=>{
    if(rankByFighter.has(profile.fighter))profile.rank=rankByFighter.get(profile.fighter);
    if(totalByFighter.has(profile.fighter))profile.totalScore=totalByFighter.get(profile.fighter);
    if(breakdownByFighter.has(profile.fighter))profile.weightedScoreBreakdown=breakdownByFighter.get(profile.fighter);
  });
  if(typeof DISPLAY_OVERRIDES!=='undefined'){
    rankByFighter.forEach((rank,name)=>{
      DISPLAY_OVERRIDES[name]=DISPLAY_OVERRIDES[name]||{};
      DISPLAY_OVERRIDES[name].allTimeRank=rank;
    });
  }

  function summaryFromFighter(f){return byName.get(f?.fighter)||AUDIT.summaryFor?.(f?.fighter)||{};}
  function evidenceItems(f){
    const s=summaryFromFighter(f);
    return [
      ['Elite+ wins',String(s.elitePlusWins||0)],
      ['Top-5+ wins',String(s.topFivePlusWins||0)],
      ['Best wins',(s.bestWins||[]).slice(0,5).join(', ')||'No UFC win ledger loaded'],
      ['Win profile',s.winProfile||'Quality-wins profile not loaded']
    ];
  }
  const previousEvidence=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;
  if(previousEvidence){
    categoryEvidenceItems=function(f,key){
      if(key==='opponentQuality')return evidenceItems(f);
      return previousEvidence(f,key);
    };
  }
  const previousLogic=typeof categoryLogicSentence==='function'?categoryLogicSentence:null;
  if(previousLogic){
    categoryLogicSentence=function(f,key){
      if(key==='opponentQuality')return DEFINITION;
      return previousLogic(f,key);
    };
  }

  DATA.meta=DATA.meta||{};
  DATA.meta.opponentQualityLive={version:VERSION,benchmarkCredit:benchmark,sourceVersion:AUDIT.version,appliedAt:new Date().toISOString()};
  window.UFC_OPPONENT_QUALITY_LIVE={
    version:VERSION,
    mode:'live-category-total-score-apply',
    benchmarkCredit:benchmark,
    sourceVersion:AUDIT.version,
    fighters:liveRows.length,
    formula:'Live category score = diminished opponent-quality credit normalized to 25, using the current leader as the benchmark. Total scores recalculated.',
    leaders:liveRows.slice().sort((a,b)=>n(b.liveScore)-n(a.liveScore)||n(b.diminishedCredit)-n(a.diminishedCredit)).slice(0,20).map(row=>({fighter:row.fighter,liveScore:row.liveScore,diminishedCredit:row.diminishedCredit,elitePlusWins:row.elitePlusWins,topFivePlusWins:row.topFivePlusWins,winProfile:row.winProfile})),
    report:liveRows,
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-opponent-quality-live',VERSION);
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
  if(window.UFC_CATEGORY_LEADERS?.render){try{window.UFC_CATEGORY_LEADERS.render();}catch(e){}}
})();