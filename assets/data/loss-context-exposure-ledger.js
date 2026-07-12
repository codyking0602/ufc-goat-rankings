// Canonical UFC fight-exposure source for the hybrid Loss Context model.
// Open prime windows use the full current UFC record. Closed windows use an audited
// count of UFC fights through the canonical prime endpoint. No contests are excluded.
(function(){
  'use strict';

  const VERSION='loss-context-exposure-ledger-20260711a-full-roster';
  const DATA=window.RANKING_DATA;

  const CLOSED_WINDOW_COUNTS={
    'Jon Jones':{throughPrimeUfcFights:22,endpoint:'Ciryl Gane — 2023-03-04'},
    'Georges St-Pierre':{throughPrimeUfcFights:24,endpoint:'Michael Bisping — 2017-11-04'},
    'Anderson Silva':{throughPrimeUfcFights:18,endpoint:'Chris Weidman II — 2013-12-28'},
    'Demetrious Johnson':{throughPrimeUfcFights:18,endpoint:'Henry Cejudo II — 2018-08-04',notes:'Includes the Ian McCall draw; no contests excluded.'},
    'Khabib Nurmagomedov':{throughPrimeUfcFights:13,endpoint:'Justin Gaethje — 2020-10-24'},
    'Jose Aldo':{throughPrimeUfcFights:20,endpoint:'Merab Dvalishvili — 2022-08-20'},
    'Dominick Cruz':{throughPrimeUfcFights:7,endpoint:'Henry Cejudo — 2020-05-09'},
    'Kamaru Usman':{throughPrimeUfcFights:17,endpoint:'Leon Edwards III — 2023-03-18'},
    'Daniel Cormier':{throughPrimeUfcFights:14,endpoint:'Stipe Miocic III — 2020-08-15',notes:'Jon Jones II no contest excluded.'},
    'Stipe Miocic':{throughPrimeUfcFights:18,endpoint:'Francis Ngannou II — 2021-03-27'},
    'Dustin Poirier':{throughPrimeUfcFights:30,endpoint:'Islam Makhachev — 2024-06-01',notes:'Eddie Alvarez I no contest excluded.'},
    'Justin Gaethje':{throughPrimeUfcFights:13,endpoint:'Max Holloway — 2024-04-13'},
    'Israel Adesanya':{throughPrimeUfcFights:16,endpoint:'Dricus du Plessis — 2024-08-17'},
    'Conor McGregor':{throughPrimeUfcFights:11,endpoint:'Khabib Nurmagomedov — 2018-10-06'},
    'Henry Cejudo':{throughPrimeUfcFights:12,endpoint:'Aljamain Sterling — 2023-05-06'},
    'Amanda Nunes':{throughPrimeUfcFights:18,endpoint:'Irene Aldana — 2023-06-10'},
    'Ronda Rousey':{throughPrimeUfcFights:8,endpoint:'Amanda Nunes — 2016-12-30'},
    'Joanna Jedrzejczyk':{throughPrimeUfcFights:14,endpoint:'Zhang Weili I — 2020-03-07'},
    'Matt Hughes':{throughPrimeUfcFights:19,endpoint:'Georges St-Pierre III — 2007-12-29'},
    'Randy Couture':{throughPrimeUfcFights:19,endpoint:'Brock Lesnar — 2008-11-15'},
    'B.J. Penn':{throughPrimeUfcFights:18,endpoint:'Frankie Edgar II — 2010-08-28',notes:'Includes scored draws through the endpoint.'},
    'Chuck Liddell':{throughPrimeUfcFights:18,endpoint:'Quinton Jackson II — 2007-05-26'},
    'Tito Ortiz':{throughPrimeUfcFights:15,endpoint:'Chuck Liddell I — 2004-04-02'},
    'Cain Velasquez':{throughPrimeUfcFights:13,endpoint:'Fabricio Werdum — 2015-06-13'},
    'Francis Ngannou':{throughPrimeUfcFights:14,endpoint:'Ciryl Gane — 2022-01-22'},
    'Junior dos Santos':{throughPrimeUfcFights:12,endpoint:'Cain Velasquez III — 2013-10-19'},
    'Lyoto Machida':{throughPrimeUfcFights:18,endpoint:'Chris Weidman — 2014-07-05'},
    'Robbie Lawler':{throughPrimeUfcFights:17,endpoint:'Tyron Woodley — 2016-07-30'},
    'Michael Bisping':{throughPrimeUfcFights:28,endpoint:'Georges St-Pierre — 2017-11-04'},
    'Tony Ferguson':{throughPrimeUfcFights:16,endpoint:'Justin Gaethje — 2020-05-09'},
    'Brock Lesnar':{throughPrimeUfcFights:6,endpoint:'Cain Velasquez — 2010-10-23',notes:'Mark Hunt no contest occurred later and is excluded.'},
    'Chael Sonnen':{throughPrimeUfcFights:13,endpoint:'Jon Jones — 2013-04-27'},
    'Frankie Edgar':{throughPrimeUfcFights:25,endpoint:'Max Holloway — 2019-07-27'},
    'T.J. Dillashaw':{throughPrimeUfcFights:16,endpoint:'Henry Cejudo — 2019-01-19'},
    'Aljamain Sterling':{throughPrimeUfcFights:17,endpoint:'Sean O’Malley — 2023-08-19'},
    'Deiveson Figueiredo':{throughPrimeUfcFights:15,endpoint:'Petr Yan — 2024-11-23',notes:'Includes the Brandon Moreno draw.'},
    'Tyron Woodley':{throughPrimeUfcFights:13,endpoint:'Kamaru Usman — 2019-03-02',notes:'Includes the Stephen Thompson draw.'},
    'Robert Whittaker':{throughPrimeUfcFights:23,endpoint:'Khamzat Chimaev — 2024-10-26'},
    'Dan Henderson':{throughPrimeUfcFights:12,endpoint:'Daniel Cormier — 2014-05-24',notes:'Aligned to the app’s locked 8-9 UFC-only record treatment.'},
    'Rose Namajunas':{throughPrimeUfcFights:12,endpoint:'Carla Esparza II — 2022-05-07'},
    'Miesha Tate':{throughPrimeUfcFights:7,endpoint:'Amanda Nunes — 2016-07-09'},
    'Jessica Andrade':{throughPrimeUfcFights:19,endpoint:'Erin Blanchfield — 2023-02-18'},
    'Carla Esparza':{throughPrimeUfcFights:14,endpoint:'Zhang Weili — 2022-11-12'},
    'Holly Holm':{throughPrimeUfcFights:10,endpoint:'Amanda Nunes — 2019-07-06'},
    'Cris Cyborg':{throughPrimeUfcFights:7,endpoint:'Felicia Spencer — 2019-07-27'}
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function parseRecord(value){
    const text=String(value||'').trim();
    const main=text.replace(/\([^)]*NC[^)]*\)/ig,'').replace(/,?\s*\d+\s*NC/ig,'').trim();
    const nums=(main.match(/\d+/g)||[]).map(Number);
    if(nums.length<2)return null;
    return {wins:nums[0],losses:nums[1],draws:nums[2]||0,scoredFights:nums[0]+nums[1]+(nums[2]||0)};
  }
  function allRows(){return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>row?.fighter);}
  function boardRows(){return [...(DATA?.men||[]),...(DATA?.women||[])].filter(row=>row?.fighter);}
  function rowFor(fighter){const target=key(fighter);return allRows().find(row=>key(row.fighter)===target)||null;}
  function recordFor(fighter){
    const row=rowFor(fighter);
    const target=key(fighter);
    const packet=Object.entries(window.UFC_FIGHTER_PACKETS||{}).find(([name])=>key(name)===target)?.[1];
    const override=typeof DISPLAY_OVERRIDES!=='undefined'?Object.entries(DISPLAY_OVERRIDES||{}).find(([name])=>key(name)===target)?.[1]:null;
    const candidates=[row?.ufcRecord,row?.record,row?.ufc_record,packet?.profileStats?.ufcRecord,packet?.boardRow?.ufcRecord,packet?.profile?.ufcRecord,override?.packetProfileStats?.ufcRecord,override?.snapshotStats?.ufcRecord];
    const value=candidates.find(item=>parseRecord(item));
    return value?{text:String(value),...parseRecord(value)}:null;
  }

  function build(){
    const ERA=window.UFC_FIGHTER_ERA_LEDGERS;
    if(!DATA||!ERA?.ledgers)return false;
    const rows=[];
    const missing=[];
    const invalid=[];
    const names=[...new Set(boardRows().map(row=>row.fighter))];

    names.forEach(fighter=>{
      const era=Object.entries(ERA.ledgers||{}).find(([name])=>key(name)===key(fighter))?.[1]||null;
      const record=recordFor(fighter);
      const openWindow=!era?.window?.end;
      const explicit=Object.entries(CLOSED_WINDOW_COUNTS).find(([name])=>key(name)===key(fighter))?.[1]||null;
      let exposure=null;
      let source=null;
      let endpoint=era?.window?.end||null;
      let notes=null;

      if(openWindow&&record){
        exposure=record.scoredFights;
        source='dynamic-full-ufc-record-open-window';
        notes='Prime window is open, so every scored UFC fight is pre-prime or prime exposure.';
      }else if(explicit){
        exposure=Number(explicit.throughPrimeUfcFights);
        source='audited-closed-window-count';
        notes=explicit.notes||null;
      }

      const issues=[];
      if(!era)issues.push('missing-era-ledger');
      if(!record)issues.push('missing-ufc-record');
      if(!Number.isFinite(exposure)||exposure<1)issues.push('missing-through-prime-exposure');
      if(record&&Number.isFinite(exposure)&&exposure>record.scoredFights)issues.push('exposure-exceeds-current-scored-record');
      if(!openWindow&&!explicit)issues.push('missing-closed-window-count');
      const status=issues.length?'blocked':'ready';
      const entry={fighter,status,openWindow,throughPrimeUfcFights:exposure,currentScoredUfcFights:record?.scoredFights??null,currentUfcRecord:record?.text||null,endpoint,endpointLabel:explicit?.endpoint||era?.window?.endLabel||null,source,notes,issues,postPrimeFightCount:record&&Number.isFinite(exposure)?Math.max(0,record.scoredFights-exposure):null};
      rows.push(entry);
      if(!era||!record||(!openWindow&&!explicit))missing.push(entry);
      if(issues.length)invalid.push(entry);
    });

    const byKey=new Map(rows.map(entry=>[key(entry.fighter),entry]));
    const report={
      version:VERSION,
      applied:true,
      expectedRosterCount:names.length,
      coveredCount:rows.filter(row=>row.status==='ready').length,
      blockedCount:invalid.length,
      coverageComplete:invalid.length===0&&rows.length===names.length,
      closedWindowCount:rows.filter(row=>!row.openWindow).length,
      openWindowCount:rows.filter(row=>row.openWindow).length,
      closedWindowCounts:CLOSED_WINDOW_COUNTS,
      rows,
      missing,
      invalid,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesScores:false,
      mutatesPenalty:false,
      generatedAt:new Date().toISOString()
    };
    window.UFC_LOSS_CONTEXT_EXPOSURE_LEDGER=report;
    if(DATA.meta)DATA.meta.lossContextExposureLedger={version:VERSION,expectedRosterCount:report.expectedRosterCount,coveredCount:report.coveredCount,blockedCount:report.blockedCount,coverageComplete:report.coverageComplete,generatedAt:report.generatedAt};
    document.documentElement.setAttribute('data-loss-context-exposure-ledger',`${VERSION}-${report.coveredCount}-${report.blockedCount}`);
    window.dispatchEvent(new CustomEvent('ufc-loss-context-exposure-ledger-ready',{detail:report}));
    return true;
  }

  if(build())return;
  window.UFC_LOSS_CONTEXT_EXPOSURE_LEDGER={version:VERSION,applied:false,status:'waiting-for-era-ledgers',mutatesScores:false,mutatesPenalty:false};
  window.addEventListener('ufc-loss-context-final-reconciliation-ready',()=>build(),{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',()=>build(),{once:true});
})();