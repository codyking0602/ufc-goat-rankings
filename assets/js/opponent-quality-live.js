// Opponent Quality live category writer.
// Applies audited Quality Wins values and presentation evidence only.
// Overall totals, ranks, and OVR are owned exclusively by final-score-engine.js.
(function(){
  const VERSION='opponent-quality-live-20260710c-fixed-benchmark';
  const LOCKED_BENCHMARK_CREDIT=14.10;
  const DATA=window.RANKING_DATA;
  const AUDIT=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
  if(!DATA||!AUDIT||!Array.isArray(AUDIT.report))return;

  const DEFINITION='Opponent Quality rewards who you beat, when you beat them, and how strong the division was. Elite champions and true top contenders carry the most weight. Softer, faded, short-notice, or weird-context wins get capped.';
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function r(v){return Math.round((n(v)+Number.EPSILON)*100)/100;}
  function allRowsFor(name){const rows=[];const push=row=>{if(row&&row.fighter===name)rows.push(row);};(DATA.men||[]).forEach(push);(DATA.women||[]).forEach(push);(DATA.fighters||[]).forEach(push);return rows;}
  function updateSnapshot(snapshot,summary){
    const rows=Array.isArray(snapshot)?snapshot.slice():[];
    function upsert(label,value,tests){
      const idx=rows.findIndex(item=>Array.isArray(item)&&tests.some(re=>re.test(String(item[0]||''))));
      if(idx>=0)rows[idx]=[label,value];else rows.push([label,value]);
    }
    upsert('Elite+ / Top-5+ Wins',`${summary.elitePlusWins} / ${summary.topFivePlusWins}`,[/elite\s*wins/i,/quality\s*wins/i,/opponent\s*quality/i,/top[-\s]*5/i]);
    upsert('Win Profile',summary.winProfile||'Quality-wins profile loaded',[/win\s*profile/i,/resume\s*shape/i,/quality\s*type/i]);
    return rows;
  }

  const sourceBenchmarkCredit=Math.max(...AUDIT.report.map(row=>n(row.diminishedCredit)),1);
  const benchmark=LOCKED_BENCHMARK_CREDIT;
  const liveRows=AUDIT.report.map(row=>{
    const liveScore=r(Math.min(30,Math.max(0,(n(row.diminishedCredit)/benchmark)*30)));
    return {...row,liveScore,categoryScore:liveScore,benchmarkCredit:benchmark,sourceBenchmarkCredit};
  });
  const byName=new Map(liveRows.map(row=>[row.fighter,row]));

  liveRows.forEach(summary=>{
    allRowsFor(summary.fighter).forEach(row=>{
      row.opponentQualityLegacy=row.opponentQualityLegacy??row.opponentQuality;
      row.opponentQuality=summary.liveScore;
      row.opponentQualityLive=true;
      row.opponentQualityLiveAudit={...summary,sourceMode:'live',writerMode:'category-only',version:VERSION};
      row.opponentQualityShadowAudit={...summary,sourceMode:'live-shadow-source',writerMode:'category-only',version:VERSION};
      row.elitePlusWins=summary.elitePlusWins;
      row.topFivePlusWins=summary.topFivePlusWins;
      row.rankedQualityWins=summary.rankedQualityWins;
      row.winProfile=summary.winProfile;
    });
    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      DISPLAY_OVERRIDES[summary.fighter]=DISPLAY_OVERRIDES[summary.fighter]||{};
      const o=DISPLAY_OVERRIDES[summary.fighter];
      o.snapshotStats={...(o.snapshotStats||{}),elitePlusWins:summary.elitePlusWins,topFivePlusWins:summary.topFivePlusWins,rankedQualityWins:summary.rankedQualityWins,bestQualityWins:(summary.bestWins||[]).slice(0,5).join(', '),winProfile:summary.winProfile,opponentQualityScore:summary.liveScore};
      if(o.categories?.opponentQuality)delete o.categories.opponentQuality;
      o.snapshot=updateSnapshot(o.snapshot,summary);
    }
  });

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
    categoryEvidenceItems=function(f,key){if(key==='opponentQuality')return evidenceItems(f);return previousEvidence(f,key);};
  }
  const previousLogic=typeof categoryLogicSentence==='function'?categoryLogicSentence:null;
  if(previousLogic){
    categoryLogicSentence=function(f,key){if(key==='opponentQuality')return DEFINITION;return previousLogic(f,key);};
  }

  DATA.meta=DATA.meta||{};
  DATA.meta.opponentQualityLive={version:VERSION,mode:'category-only',benchmarkCredit:benchmark,sourceBenchmarkCredit,benchmarkMode:'locked-constant',futureRosterStable:true,sourceVersion:AUDIT.version,appliedAt:new Date().toISOString()};
  window.UFC_OPPONENT_QUALITY_LIVE={
    version:VERSION,
    mode:'live-category-only',
    categoryOnly:true,
    mutatesOverall:false,
    benchmarkCredit:benchmark,
    sourceBenchmarkCredit,
    benchmarkMode:'locked-constant',
    futureRosterStable:true,
    sourceVersion:AUDIT.version,
    fighters:liveRows.length,
    formula:'Live Quality Wins score = diminished opponent-quality credit normalized to 30 using the locked 14.10-credit historical benchmark.',
    leaders:liveRows.slice().sort((a,b)=>n(b.liveScore)-n(a.liveScore)||n(b.diminishedCredit)-n(a.diminishedCredit)).slice(0,20).map(row=>({fighter:row.fighter,liveScore:row.liveScore,diminishedCredit:row.diminishedCredit,elitePlusWins:row.elitePlusWins,topFivePlusWins:row.topFivePlusWins,winProfile:row.winProfile})),
    report:liveRows,
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-opponent-quality-live',VERSION);
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
  if(window.UFC_CATEGORY_LEADERS?.render){try{window.UFC_CATEGORY_LEADERS.render();}catch(e){}}

  const readyDetail={version:VERSION,fighters:liveRows.length,benchmarkCredit:benchmark,sourceBenchmarkCredit,benchmarkMode:'locked-constant',futureRosterStable:true};
  if(typeof window.UFC_RESOLVE_OPPONENT_QUALITY_READY==='function')window.UFC_RESOLVE_OPPONENT_QUALITY_READY(readyDetail);
  window.dispatchEvent(new CustomEvent('ufc-opponent-quality-ready',{detail:readyDetail}));
})();
