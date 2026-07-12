// Approved UFC-only Quality Wins audit for Dominick Cruz and Ilia Topuria.
(function(){
  'use strict';

  const VERSION='quality-wins-audit-cruz-ilia-20260712a';
  let applied=false;
  let attempts=0;

  const CORRECTIONS={
    'Dominick Cruz':[
      ['T.J. Dillashaw',1.25,'Champion-level win','Beat the reigning UFC bantamweight champion after a long injury layoff.','locked'],
      ['Demetrious Johnson',1.00,'True top-5 win','UFC bantamweight title win over an elite title challenger; later flyweight greatness is context, not back-credit.','locked'],
      ['Urijah Faber II',1.00,'True top-5 win','Elite UFC bantamweight title challenger in Cruz’s first UFC championship fight.','locked'],
      ['Takeya Mizugaki',1.00,'True top-5 win','Top-five bantamweight contender stopped immediately in Cruz’s return fight.','locked'],
      ['Urijah Faber III',0.85,'Strong top-10 win','Veteran elite bantamweight title challenger, discounted for age and repeat-opponent context.','locked'],
      ['Pedro Munhoz',0.85,'Strong top-10 win','Ranked bantamweight contender win late in Cruz’s UFC career.','locked'],
      ['Casey Kenney',0.65,'Ranked / quality win','Ranked-quality bantamweight comeback win.','locked']
    ],
    'Ilia Topuria':[
      ['Alexander Volkanovski',1.25,'Champion-level win','Stopped the reigning UFC featherweight champion and all-time great to win the title.','locked'],
      ['Max Holloway',1.25,'Champion-level win','Elite former UFC featherweight champion and divisional great.','locked'],
      ['Charles Oliveira',1.25,'Champion-level win','Elite former lightweight champion defeated in a five-round UFC title fight.','locked'],
      ['Josh Emmett',1.00,'True top-5 win','Five-round win over a prime top featherweight contender.','locked'],
      ['Bryce Mitchell',0.85,'Strong top-10 win','Undefeated ranked featherweight contender submitted during Topuria’s rise.','locked'],
      ['Jai Herbert',0.45,'Solid resume win','Useful UFC lightweight win with upward-division context.','locked'],
      ['Ryan Hall',0.45,'Solid resume win','Dangerous specialist and credible UFC featherweight win.','locked'],
      ['Damon Jackson',0.45,'Solid resume win','Solid UFC featherweight win.','locked'],
      ['Youssef Zalal',0.25,'Name-value / faded / unproven','Early UFC win before either fighter reached ranked contention.','locked']
    ]
  };

  function key(value){
    return String(value||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  }
  function round2(value){
    return Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  }
  function allRowsFor(name){
    const target=key(name);
    return [...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[]),...(window.RANKING_DATA?.fighters||[])]
      .filter(row=>row&&key(row.fighter)===target);
  }
  function patchReport(report,fighter,value){
    if(!Array.isArray(report))return;
    const existing=report.find(row=>row?.fighter===fighter);
    if(existing)Object.assign(existing,value);
    else report.push(value);
  }
  function upsert(rows,input){
    const [opponent,credit,tier,context,status]=input;
    const existing=rows.find(row=>Array.isArray(row)&&key(row[0])===key(opponent));
    if(existing){
      existing[0]=opponent;
      existing[1]=credit;
      existing[2]=tier;
      existing[3]=context;
      existing[4]=status;
      return 'updated';
    }
    rows.push([opponent,credit,tier,context,status]);
    return 'added';
  }
  function displayOverrides(){
    if(typeof window.DISPLAY_OVERRIDES!=='undefined')return window.DISPLAY_OVERRIDES;
    if(typeof DISPLAY_OVERRIDES!=='undefined')return DISPLAY_OVERRIDES;
    return null;
  }
  function patchDisplay(fighter,summary,liveScore){
    const overrides=displayOverrides();
    if(!overrides)return;
    overrides[fighter]=overrides[fighter]||{};
    const target=overrides[fighter];
    target.snapshotStats={
      ...(target.snapshotStats||{}),
      elitePlusWins:summary.elitePlusWins,
      topFivePlusWins:summary.topFivePlusWins,
      rankedQualityWins:summary.rankedQualityWins,
      bestQualityWins:(summary.bestWins||[]).slice(0,6).join(', '),
      winProfile:summary.winProfile,
      opponentQualityScore:liveScore
    };
    const packet=window.UFC_FIGHTER_PACKETS?.[fighter];
    if(packet){
      packet.profileStats={
        ...(packet.profileStats||{}),
        eliteWins:summary.elitePlusWins,
        elitePlusWins:summary.elitePlusWins,
        topFivePlusWins:summary.topFivePlusWins,
        rankedQualityWins:summary.rankedQualityWins
      };
    }
  }
  function updateSurface(fighter,shadow,live){
    const summary=shadow.summaryFor(fighter);
    const benchmark=Number(live.benchmarkCredit||14.1);
    const liveScore=round2(Math.min(30,Math.max(0,(Number(summary.diminishedCredit||0)/benchmark)*30)));
    const liveSummary={
      ...summary,
      liveScore,
      categoryScore:liveScore,
      benchmarkCredit:benchmark,
      sourceBenchmarkCredit:live.sourceBenchmarkCredit,
      approvedCorrectionVersion:VERSION
    };

    patchReport(shadow.report,fighter,{...summary,approvedCorrectionVersion:VERSION});
    patchReport(live.report,fighter,liveSummary);

    allRowsFor(fighter).forEach(row=>{
      row.opponentQualityLegacy=row.opponentQualityLegacy??row.opponentQuality;
      row.opponentQuality=liveScore;
      row.opponentQualityLive=true;
      row.opponentQualityLiveAudit={...liveSummary,sourceMode:'approved-quality-wins-audit',writerMode:'category-only',version:VERSION};
      row.opponentQualityShadowAudit={...summary,sourceMode:'approved-quality-wins-audit',version:VERSION};
      row.elitePlusWins=summary.elitePlusWins;
      row.topFivePlusWins=summary.topFivePlusWins;
      row.rankedQualityWins=summary.rankedQualityWins;
      row.winProfile=summary.winProfile;
    });
    patchDisplay(fighter,summary,liveScore);
    return {fighter,liveScore,rawCredit:summary.rawCredit,diminishedCredit:summary.diminishedCredit,bestWins:summary.bestWins||[]};
  }
  function syncRanksAndOverrides(){
    const overrides=displayOverrides();
    if(!overrides)return;
    [...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])].forEach(row=>{
      if(!row?.fighter)return;
      overrides[row.fighter]=overrides[row.fighter]||{};
      overrides[row.fighter].allTimeRank=row.rank;
      overrides[row.fighter].rank=row.rank;
      overrides[row.fighter].overallOvr=row.overallOvr;
      overrides[row.fighter].totalScore=row.totalScore;
      overrides[row.fighter].rawScore=row.rawScore;
    });
  }
  function apply(){
    if(applied)return window.UFC_QUALITY_WINS_AUDIT_CRUZ_ILIA;
    attempts+=1;
    const data=window.RANKING_DATA;
    const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
    const shadow=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
    const live=window.UFC_OPPONENT_QUALITY_LIVE;
    if(!data||!store?.raw||!shadow?.summaryFor||!live?.report){
      return {version:VERSION,applied:false,attempts,reason:'Quality Wins chain not ready.'};
    }

    const changes=[];
    Object.entries(CORRECTIONS).forEach(([fighter,rows])=>{
      store.raw[fighter]=Array.isArray(store.raw[fighter])?store.raw[fighter]:[];
      rows.forEach(input=>changes.push({fighter,opponent:input[0],credit:input[1],action:upsert(store.raw[fighter],input)}));
    });

    const results=Object.keys(CORRECTIONS).map(fighter=>updateSurface(fighter,shadow,live));
    shadow.report.sort((a,b)=>Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0)||Number(b.rawCredit||0)-Number(a.rawCredit||0)||String(a.fighter).localeCompare(String(b.fighter)));
    shadow.leaders=shadow.report.slice(0,15).map(row=>({fighter:row.fighter,rawCredit:row.rawCredit,diminishedCredit:row.diminishedCredit,elitePlusWins:row.elitePlusWins,topFivePlusWins:row.topFivePlusWins,rankedQualityWins:row.rankedQualityWins,winProfile:row.winProfile}));
    live.report.sort((a,b)=>Number(b.liveScore||0)-Number(a.liveScore||0)||Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0)||String(a.fighter).localeCompare(String(b.fighter)));
    live.leaders=live.report.slice(0,20).map(row=>({fighter:row.fighter,liveScore:row.liveScore,diminishedCredit:row.diminishedCredit,elitePlusWins:row.elitePlusWins,topFivePlusWins:row.topFivePlusWins,winProfile:row.winProfile}));
    live.approvedQualityWinsAuditVersion=VERSION;
    if(data.meta?.opponentQualityLive)data.meta.opponentQualityLive.approvedQualityWinsAuditVersion=VERSION;

    const finalScoreResult=window.UFC_FINAL_SCORE_ENGINE?.apply?.('quality-wins-audit-cruz-ilia')||null;
    syncRanksAndOverrides();
    if(typeof window.refresh==='function'){try{window.refresh();}catch(error){}}

    applied=true;
    const result={version:VERSION,applied:true,attempts,changes,results,finalScoreResult,appliedAt:new Date().toISOString()};
    window.UFC_QUALITY_WINS_AUDIT_CRUZ_ILIA=result;
    document.documentElement.setAttribute('data-quality-wins-audit-cruz-ilia',VERSION);
    return result;
  }
  function run(){
    const result=apply();
    if(!result?.applied&&attempts<40)setTimeout(run,100);
  }

  window.UFC_QUALITY_WINS_AUDIT_CRUZ_ILIA={version:VERSION,applied:false,attempts:0,apply};
  if(window.UFC_SCORING_PIPELINE?.status==='ready')setTimeout(run,0);
  else window.addEventListener('ufc-scoring-pipeline-ready',run,{once:true});
})();
