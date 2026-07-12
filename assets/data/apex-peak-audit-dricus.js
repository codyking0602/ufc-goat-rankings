// Final Apex Peak audit rows: Dricus du Plessis, Justin Gaethje, Merab Dvalishvili, and Zhang Weili.
// Loads after the locked Apex promoter and before the final score engine.
(function(){
  'use strict';
  const VERSION='apex-peak-audit-final-20260711a-gaethje-topuria';
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

  const audits={
    'Dricus du Plessis':{
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
      }
    },
    'Justin Gaethje':{
      score:4.95,
      window:'Paddy Pimblett 2026 + Ilia Topuria 2026',
      performances:[
        {label:'Paddy Pimblett',date:'2026-01-24',rating:8.5,note:'Won a five-round interim-title fight by unanimous decision, adding current title-level proof.'},
        {label:'Ilia Topuria',date:'2026-06-14',rating:10.0,note:'Forced a corner stoppage against an undefeated two-division champion and pound-for-pound benchmark to unify the lightweight title.'}
      ],
      performanceAverage:9.25,
      components:{twoPerformanceStrength:1.85,proof:1.60,bestFighterClaim:0.85,aura:0.65},
      componentTotal:4.95,
      notes:'Topuria is a maximum-level Apex win: an undefeated two-division champion and pound-for-pound benchmark broken in a title unification fight. Paddy adds legitimate interim-title proof, but his lower opponent standing and Gaethje’s historically hittable style keep this below the mythic six-point tier.',
      front:{
        proved:'Won interim gold over Paddy, then broke and stopped undefeated champion Ilia Topuria five months later.',
        felt:'Like the ultimate veteran breakthrough—violent, resilient, and capable of beating the best, though never untouchable.'
      }
    },
    'Merab Dvalishvili':{
      score:4.00,
      window:"Sean O'Malley 2024 + Umar Nurmagomedov 2025",
      performances:[
        {label:"Sean O'Malley",date:'2024-09-14',rating:9.2,note:'Won the UFC bantamweight title by imposing pace, wrestling volume, and control over the champion.'},
        {label:'Umar Nurmagomedov',date:'2025-01-18',rating:9.3,note:'Added elite modern-bantamweight title-defense proof against an unbeaten challenger.'}
      ],
      performanceAverage:9.25,
      components:{twoPerformanceStrength:1.85,proof:1.30,bestFighterClaim:0.50,aura:0.35},
      componentTotal:4.00,
      notes:'O’Malley and Umar give Merab strong modern bantamweight proof. Low finish pressure, a newer reign, and the later Yan rivalry cap the best-fighter claim and aura.',
      front:{
        proved:'Beat the bantamweight champion and an unbeaten elite challenger with relentless pace and control.',
        felt:'Exhausting and extremely difficult to solve, but not a mythic finishing-aura peak.'
      }
    },
    'Zhang Weili':{
      score:4.85,
      window:'Amanda Lemos 2023 + Tatiana Suarez 2025',
      performances:[
        {label:'Amanda Lemos',date:'2023-08-19',rating:9.5,note:'Dominant five-round title defense showing complete striking, wrestling, and control.'},
        {label:'Tatiana Suarez',date:'2025-02-08',rating:9.5,note:'Dominant defense over an unbeaten elite challenger and major grappling threat.'}
      ],
      performanceAverage:9.5,
      components:{twoPerformanceStrength:1.90,proof:1.45,bestFighterClaim:0.90,aura:0.60},
      componentTotal:4.85,
      notes:'Lemos and Suarez capture the complete second-reign version of Zhang. The Rose losses and failed upward-division title challenge cap the clean best-fighter claim and aura.',
      front:{
        proved:'Dominated two dangerous title challengers with complete five-round control during her second reign.',
        felt:'Like the clear best strawweight of the second reign, though not untouchable across her full title career.'
      }
    }
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function cloneAudit(audit){return {...audit,performances:audit.performances.map(item=>({...item})),components:{...audit.components},front:{...audit.front},rubric:RUBRIC,rules:RULES,source:'Cody-approved locked Apex Peak audit',version:VERSION};}
  function allRows(){return [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].filter(row=>row&&row.fighter);}

  const byKey=new Map(Object.entries(audits).map(([fighter,audit])=>[key(fighter),{fighter,audit}]));
  const patched=[];
  allRows().forEach(row=>{
    const found=byKey.get(key(row.fighter));
    if(!found)return;
    const audit=cloneAudit(found.audit);
    row.apexPeak=audit.score;
    row.apexPeakAudit=audit;
    row.apexPeakBonusLive=true;
    row.apexPeakBonusVersion=VERSION;
    patched.push(row.fighter);
  });

  if(typeof DISPLAY_OVERRIDES!=='undefined'){
    Object.entries(audits).forEach(([fighter,audit])=>{
      DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
      DISPLAY_OVERRIDES[fighter].apexPeakAudit=cloneAudit(audit);
    });
  }

  const lockedAudit=window.UFC_APEX_PEAK_LOCKED_AUDIT||window.UFC_PEAK_APEX_LOCKED_AUDIT;
  if(lockedAudit){
    lockedAudit.fighters=Array.from(new Set([...(lockedAudit.fighters||[]),...Object.keys(audits)]));
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
    lockedCount:62,
    finalAudits:Object.fromEntries(Object.entries(audits).map(([fighter,audit])=>[fighter,cloneAudit(audit)])),
    dricusAudit:cloneAudit(audits['Dricus du Plessis']),
    gaethjeAudit:cloneAudit(audits['Justin Gaethje']),
    apexLeaders:boardRows.slice().sort((a,b)=>Number(b.apexPeak||0)-Number(a.apexPeak||0)||String(a.fighter).localeCompare(String(b.fighter))).slice(0,10).map(row=>({fighter:row.fighter,apexPeak:row.apexPeak})),
    appliedAt:new Date().toISOString()
  };
  window.UFC_APEX_PEAK_FINAL_AUDIT={version:VERSION,audits:Object.fromEntries(Object.entries(audits).map(([fighter,audit])=>[fighter,cloneAudit(audit)])),patched:[...new Set(patched)],appliedAt:new Date().toISOString()};
  window.UFC_APEX_PEAK_DRICUS_AUDIT={version:VERSION,fighter:'Dricus du Plessis',audit:cloneAudit(audits['Dricus du Plessis']),patched:patched.filter(name=>name==='Dricus du Plessis'),appliedAt:new Date().toISOString()};
  window.UFC_APEX_PEAK_GAETHJE_AUDIT={version:VERSION,fighter:'Justin Gaethje',audit:cloneAudit(audits['Justin Gaethje']),patched:patched.filter(name=>name==='Justin Gaethje'),appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-apex-peak-audit-dricus',VERSION);
})();