// Final Apex Peak audit: Dricus du Plessis.
// Loads after the 61-fighter locked Apex promoter and before the final score engine.
(function(){
  'use strict';
  const VERSION='apex-peak-audit-dricus-20260710a';
  const DATA=window.RANKING_DATA;
  if(!DATA)return;

  const RUBRIC={
    twoPerformanceStrength:{label:'Two-performance strength',max:2},
    proof:{label:'Proof',max:1.75},
    bestFighterClaim:{label:'Best-fighter claim',max:1.25},
    aura:{label:'Aura',max:1},
    total:{label:'Apex Peak bonus',max:6}
  };
  const RULES={
    window:'Best two UFC wins within 24 months',
    totalMax:6,
    performances:'Two selected UFC wins are rated individually; their average maps into Two-performance strength.',
    noContests:'No contests do not count as Apex performances.',
    losses:'Losses are not selected as Apex performances, but can cap Best-fighter claim or Aura.'
  };
  const audit={
    score:4.55,
    window:'Robert Whittaker 2023 + Israel Adesanya 2024',
    performances:[
      {label:'Robert Whittaker',date:'2023-07-08',rating:9.5,note:'Second-round finish of an elite former champion and established middleweight benchmark.'},
      {label:'Israel Adesanya',date:'2024-08-18',rating:9.5,note:'Submitted an all-time middleweight champion in a UFC title defense.'}
    ],
    performanceAverage:9.5,
    components:{twoPerformanceStrength:1.90,proof:1.50,bestFighterClaim:0.70,aura:0.45},
    componentTotal:4.55,
    notes:'Whittaker and Adesanya provide elite two-night proof. Close Strickland fights, a short reign, chaotic separation, and the Khamzat ceiling cap the best-fighter claim and aura.',
    front:{
      proved:'Finished Robert Whittaker and Israel Adesanya inside a 13-month championship rise.',
      felt:'Dangerous and championship-level, but never untouchable or inevitable.'
    },
    rubric:RUBRIC,
    rules:RULES,
    source:'Cody-approved locked Apex Peak audit',
    version:VERSION
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function allRows(){return [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].filter(row=>row&&row.fighter);}
  const patched=[];
  allRows().forEach(row=>{
    if(key(row.fighter)!=='dricus du plessis')return;
    row.apexPeak=audit.score;
    row.apexPeakAudit={...audit,performances:audit.performances.map(item=>({...item})),components:{...audit.components}};
    row.apexPeakBonusLive=true;
    row.apexPeakBonusVersion=VERSION;
    patched.push(row.fighter);
  });

  if(typeof DISPLAY_OVERRIDES!=='undefined'){
    DISPLAY_OVERRIDES['Dricus du Plessis']=DISPLAY_OVERRIDES['Dricus du Plessis']||{};
    DISPLAY_OVERRIDES['Dricus du Plessis'].apexPeakAudit={...audit,performances:audit.performances.map(item=>({...item})),components:{...audit.components}};
  }

  const lockedAudit=window.UFC_APEX_PEAK_LOCKED_AUDIT||window.UFC_PEAK_APEX_LOCKED_AUDIT;
  if(lockedAudit){
    lockedAudit.fighters=Array.from(new Set([...(lockedAudit.fighters||[]),'Dricus du Plessis']));
    lockedAudit.patched=Array.from(new Set([...(lockedAudit.patched||[]),...patched]));
    lockedAudit.version=VERSION;
    lockedAudit.appliedAt=new Date().toISOString();
    window.UFC_APEX_PEAK_LOCKED_AUDIT=lockedAudit;
    window.UFC_PEAK_APEX_LOCKED_AUDIT=lockedAudit;
  }

  const prior=window.UFC_APEX_PEAK_LIVE_BONUS||{};
  const boardRows=[...(DATA.men||[]),...(DATA.women||[])];
  window.UFC_APEX_PEAK_LIVE_BONUS={
    ...prior,
    version:VERSION,
    pending:[],
    lockedCount:Math.max(Number(prior.lockedCount||0)+1,62),
    dricusAudit:audit,
    apexLeaders:boardRows.slice().sort((a,b)=>Number(b.apexPeak||0)-Number(a.apexPeak||0)||String(a.fighter).localeCompare(String(b.fighter))).slice(0,10).map(row=>({fighter:row.fighter,apexPeak:row.apexPeak})),
    appliedAt:new Date().toISOString()
  };
  window.UFC_APEX_PEAK_DRICUS_AUDIT={version:VERSION,fighter:'Dricus du Plessis',audit,patched:[...new Set(patched)],appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-apex-peak-audit-dricus',VERSION);
})();
