// Championship Resume live category writer.
// Applies audited Championship Resume values and presentation evidence only.
// Overall totals, ranks, and OVR are owned exclusively by final-score-engine.js.
(function(){
  const VERSION='championship-resume-live-20260713a-category-only';
  const LOCKED_BENCHMARK_CREDIT=14.54;
  const DATA=window.RANKING_DATA;
  const SHADOW=window.UFC_CHAMPIONSHIP_RESUME_SHADOW;
  if(!DATA||!SHADOW||!Array.isArray(SHADOW.report))return;

  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function r(v){return Math.round((n(v)+Number.EPSILON)*100)/100;}
  function championshipScore(row){return r(Math.min(30,Math.max(0,(n(row.adjustedTitleCredit)/LOCKED_BENCHMARK_CREDIT)*30)));}
  function allRowsFor(name){const rows=[];const push=row=>{if(row&&row.fighter===name)rows.push(row);};(DATA.men||[]).forEach(push);(DATA.women||[]).forEach(push);(DATA.fighters||[]).forEach(push);return rows;}
  function titleNote(report,score){return `Total title fight wins = ${report.titleFightWins}. Adjusted title-win credit = ${n(report.adjustedTitleCredit).toFixed(2)}. Championship Resume score = ${score.toFixed(2)}/30. Formula uses adjusted UFC title-win credit against the locked 14.54-credit benchmark; title losses do not add or subtract in this category.`;}
  function ensureOverride(name){if(typeof DISPLAY_OVERRIDES==='undefined')return null;DISPLAY_OVERRIDES[name]=DISPLAY_OVERRIDES[name]||{};const override=DISPLAY_OVERRIDES[name];override.snapshotStats=override.snapshotStats||{};if(override.categories?.championship)delete override.categories.championship;return override;}
  function updateSnapshot(name,report,score){
    const o=ensureOverride(name);if(!o)return;
    o.snapshotStats.titleFightWins=report.titleFightWins;o.snapshotStats.adjustedTitleWins=r(report.adjustedTitleCredit);
    const titleWinsValue=String(report.titleFightWins),champValue=`${score.toFixed(2)}/30`,adjustedValue=n(report.adjustedTitleCredit).toFixed(2);
    const rows=Array.isArray(o.snapshot)?o.snapshot.slice():[];let sawTitle=false,sawChamp=false,sawAdjusted=false;
    const updated=rows.map(item=>{if(!Array.isArray(item)||item.length<2)return item;const label=String(item[0]||'');if(/title[-\s]*fight wins/i.test(label)){sawTitle=true;return[item[0],titleWinsValue];}if(/championship level|championship resume|title reign/i.test(label)){sawChamp=true;return[item[0],champValue];}if(/adjusted title/i.test(label)){sawAdjusted=true;return[item[0],adjustedValue];}return item;});
    if(!sawTitle)updated.push(['UFC Title-Fight Wins',titleWinsValue]);if(!sawChamp)updated.push(['Championship Resume',champValue]);if(!sawAdjusted)updated.push(['Adjusted Title Credit',adjustedValue]);o.snapshot=updated;
  }
  function loadProfilePolish(){if(document.querySelector('script[data-championship-resume-profile-card]'))return;const script=document.createElement('script');script.src='assets/js/championship-resume-profile-card.js?v=championship-resume-profile-card-20260707a';script.setAttribute('data-championship-resume-profile-card','true');document.body.appendChild(script);}
  function loadScriptOnce(src,attr,done){if(document.querySelector(`script[${attr}]`)){if(done)done();return;}const script=document.createElement('script');script.src=src;script.setAttribute(attr,'true');script.onload=()=>{if(done)done();};script.onerror=()=>{if(done)done();};document.body.appendChild(script);}
  function loadOpponentQualityShadow(){
    loadScriptOnce('assets/data/opponent-quality-ledgers.js?v=opponent-quality-ledgers-20260708d','data-opponent-quality-ledgers',()=>
      loadScriptOnce('assets/data/opponent-quality-ledger-batch-four.js?v=opponent-quality-ledger-batch-four-20260708a','data-opponent-quality-ledger-batch-four',()=>
        loadScriptOnce('assets/data/opponent-quality-dj-calibration.js?v=opponent-quality-dj-calibration-20260712a-old-era-chain','data-opponent-quality-dj-calibration')));
  }
  const liveRows=SHADOW.report.map(row=>({...row,championshipScore:championshipScore(row)}));
  const byName=new Map(liveRows.map(row=>[row.fighter,row]));
  liveRows.forEach(report=>{
    allRowsFor(report.fighter).forEach(row=>{
      row.championship=report.championshipScore;row.championshipResumeLive=true;
      row.championshipResumeAudit={...row.championshipResumeAudit,...report,formulaScore:report.championshipScore,mode:'live',writerMode:'category-only',benchmarkMode:'locked-constant',benchmarkCredit:LOCKED_BENCHMARK_CREDIT,sourceBenchmarkCredit:n(SHADOW.benchmarkCredit),version:VERSION};
      row.title={...(row.title||{}),titleFightWins:report.titleFightWins,adjustedTitleWins:r(report.adjustedTitleCredit),championshipScore:report.championshipScore,discountedWins:report.discountedWins,reviewStatus:report.reviewStatus,notes:titleNote(report,report.championshipScore)};
    });
    updateSnapshot(report.fighter,report,report.championshipScore);
  });

  DATA.meta=DATA.meta||{};
  DATA.meta.championshipResumeLive={version:VERSION,mode:'category-only',benchmarkMode:'locked-constant',benchmarkCredit:LOCKED_BENCHMARK_CREDIT,sourceBenchmarkCredit:n(SHADOW.benchmarkCredit),sourceVersion:SHADOW.version,ledgerVersion:SHADOW.ledgerVersion,appliedAt:new Date().toISOString()};
  window.UFC_CHAMPIONSHIP_RESUME_LIVE={
    version:VERSION,mode:'live-category-only',categoryOnly:true,mutatesOverall:false,benchmarkMode:'locked-constant',benchmarkCredit:LOCKED_BENCHMARK_CREDIT,sourceBenchmarkCredit:n(SHADOW.benchmarkCredit),futureRosterStable:true,sourceVersion:SHADOW.version,ledgerVersion:SHADOW.ledgerVersion,fighters:liveRows.length,
    leaders:{men:(DATA.men||[]).slice().sort((a,b)=>n(b.championship)-n(a.championship)).slice(0,10).map(row=>({fighter:row.fighter,championship:row.championship,titleFightWins:byName.get(row.fighter)?.titleFightWins,adjustedTitleCredit:byName.get(row.fighter)?.adjustedTitleCredit})),women:(DATA.women||[]).slice().sort((a,b)=>n(b.championship)-n(a.championship)).slice(0,10).map(row=>({fighter:row.fighter,championship:row.championship,titleFightWins:byName.get(row.fighter)?.titleFightWins,adjustedTitleCredit:byName.get(row.fighter)?.adjustedTitleCredit}))},
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-championship-resume-live',VERSION);
  loadProfilePolish();loadOpponentQualityShadow();
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
  if(window.UFC_CATEGORY_LEADERS?.render){try{window.UFC_CATEGORY_LEADERS.render();}catch(e){}}
})();