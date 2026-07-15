// Final cross-tab roster integration for Alexandre Pantoja.
// Canonical addition is preferred; this guard keeps every app surface complete if a late 73-fighter rebuild lands afterward.
(function(){
  'use strict';

  const VERSION='pantoja-final-roster-guard-20260715b-cross-tab';
  const NAME='Alexandre Pantoja';
  const normalize=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const isPantoja=value=>normalize(value?.fighter||value)===normalize(NAME);
  const number=value=>Number.isFinite(Number(value))?Number(value):0;

  const row={
    fighter:NAME,leaderboard:'men',board:'men',gender:'Men',primaryDivision:'Flyweight',secondaryDivision:'',scope:'UFC',
    ufcRecord:'14-4',ufcWins:14,ufcLosses:4,ufcDraws:0,ufcNoContests:0,scoredUfcFights:18,
    titleFightWins:5,adjustedTitleWins:4.4,topFiveWins:5,top5Wins:5,rankedWins:10,
    finishWins:8,finishRatePct:57.14,primeRecord:'8-1',primeWins:8,primeLosses:1,primeDraws:0,primeFights:9,primeFinishes:4,
    roundsWonPct:77.78,activeEliteYears:4.84,timesFinishedPrime:0,throughPrimeUfcFights:18,longestUfcWinStreak:8,longestWinStreak:8,
    championship:9.08,opponentQuality:10.55,primeDominance:23.19,longevity:12.42,apexPeak:4.4,apexPeakBonus:4.4,
    penalty:-2.08,lossPenalty:-2.08,lossContext:-2.08,eraDepthAdjustment:-0.75,totalScore:48.28,rawScore:48.28,overallOvr:89,
    visibleStats:{
      ufcRecord:'14-4',titleFightWins:5,adjustedTitleWins:4.4,topFiveWins:5,rankedWins:10,finishRatePct:57.14,
      primeRecord:'8-1',roundsWonPct:77.78,activeEliteYears:4.84,timesFinishedPrime:0,throughPrimeUfcFights:18,
      longestUfcWinStreak:8,longestWinStreak:8
    },
    title:{titleFightWins:5,adjustedTitleWins:4.4,notes:'Won the UFC flyweight title from Brandon Moreno and defended it four times.'},
    notes:'UFC-only Pantoja row. TUF exhibitions excluded; Joshua Van injury loss counts without a finish add-on.'
  };

  const profile={id:'APAN001',...row};
  const display={
    displayName:NAME,divisionLabel:'FLW',photoUrl:'assets/fighters/alex-pantoja.webp',thumbUrl:'assets/fighters/alex-pantoja-thumb.webp',overallOvr:89,
    watchUrl:'https://youtube.com/shorts/SWNsHqqKulw?is=dOqXog5XPpyNVzKO',watchLabel:'Watch Moment',
    signatureFightUrl:'https://youtu.be/7sj-snC5qWk?is=_DkasmmAc4OA-IDR',signatureFightLabel:'Watch Signature Fight',
    oneLiner:'A relentless four-defense flyweight champion who built the strongest UFC resume in the division outside Demetrious Johnson.',
    snapshot:[
      ['UFC Record','14-4'],['UFC Title-Fight Wins','5'],['Top-5 Wins','5'],['Prime UFC Record','8-1'],
      ['Finish Rate','57.1%'],['Rounds Won','77.8%'],['Active Elite Years','4.8'],['Longest UFC Win Streak','8']
    ],
    whyRankedHere:'Four successful defenses turn Pantoja from a strong champion into a real all-time case. He won the belt from Brandon Moreno, beat Brandon Royval twice, and finished Kai Asakura and Kai Kara-France during an eight-fight UFC winning streak.',
    whyNotHigher:'His championship run is excellent but still far shorter than Demetrious Johnson’s historic reign. Modern flyweight also receives a modest depth discount, while four UFC losses leave less separation than the very top GOAT resumes.',
    compareProfile:{
      shortCase:'Pantoja owns the strongest UFC flyweight championship case after Demetrious Johnson: five title-fight wins, four defenses, and an eight-fight winning streak through the modern division.',
      peak:'At his best, Pantoja combined constant pressure, durability, back-taking, and submission danger without fading over five rounds.',
      resume:'His case is built on the title win over Brandon Moreno, two wins over Brandon Royval, and defenses against Steve Erceg, Kai Asakura, and Kai Kara-France.',
      championship:'Five UFC title-fight wins and four successful defenses give him real historical championship volume.',
      opponentQuality:'Moreno, Royval twice, Kara-France, Perez, and Kape form a strong modern flyweight ledger, though the division receives a modest depth discount.',
      longevity:'The elite window runs from Manel Kape in 2021 through the Joshua Van title loss in 2025: strong championship longevity, but not an all-time marathon reign.',
      counter:'His strongest argument is direct modern flyweight proof: he repeatedly beat the contenders who defined the post-DJ division.',
      edge:'Pantoja beats shorter or thinner champion cases because four defenses are backed by repeated elite wins, not one isolated title moment.',
      signatureWins:'Brandon Moreno, Brandon Royval twice, Alex Perez, Kai Asakura, and Kai Kara-France define the resume.',
      weakness:'Demetrious Johnson owns far more title volume, and flyweight depth limits how highly Pantoja’s opponent list can score against the deepest UFC divisions.',
      titleSummary:'Won the flyweight title from Moreno and defended it four times before the Joshua Van injury loss.',
      primeSummary:'An 8-1 prime run from Kape through Van, including an eight-fight UFC winning streak and no normal competitive stoppage loss.',
      legacyStats:{ufcRecord:'14-4',titleFightWins:5,adjustedTitleWins:4.4,topFiveWins:5,rankedWins:10,primeRecord:'8-1',roundsWonPct:77.78,finishRatePct:57.14,activeEliteYears:4.84,activeEliteYearsLabel:'4.8 active elite years',overallOvr:89,longestUfcWinStreak:8}
    }
  };

  const fightLedgers={
    'alexandre pantoja|brandon moreno':{fighters:[NAME,'Brandon Moreno'],fights:2,winner:NAME,importance:'major',summary:'Pantoja beat Moreno twice in official UFC bouts, including the 2023 title fight. Their TUF exhibition is context only and is not scored.'},
    'alexandre pantoja|brandon royval':{fighters:[NAME,'Brandon Royval'],fights:2,winner:NAME,importance:'major',summary:'Pantoja submitted Royval in 2021 and then beat him across five rounds in his first title defense.'},
    'alexandre pantoja|joshua van':{fighters:[NAME,'Joshua Van'],fights:1,winner:'Joshua Van',importance:'major',summary:'Van won the title when Pantoja suffered a freak elbow injury 26 seconds into the fight. It counts as an official loss, but not as a normal competitive knockout.'}
  };

  let applying=false;
  let playRefreshSent=false;
  let canonicalRequested=false;

  function upsert(list,value){
    if(!Array.isArray(list))return false;
    const existing=list.find(isPantoja);
    if(existing){Object.assign(existing,value);return false;}
    list.push({...value});
    return true;
  }

  function ensureRankingData(){
    const data=window.RANKING_DATA;
    if(!data||!Array.isArray(data.men)||!Array.isArray(data.fighters))return false;
    const changed=upsert(data.men,row)|upsert(data.fighters,profile);
    data.primeRecords=data.primeRecords||{};
    data.primeRecords[NAME]={record:'8-1',context:'Manel Kape through the Joshua Van injury title loss.',startFightId:'2021-02-06-manel-kape',endFightId:'2025-12-06-joshua-van',open:false};
    data.men.sort((a,b)=>number(b?.totalScore)-number(a?.totalScore)||String(a?.fighter||'').localeCompare(String(b?.fighter||'')));
    data.men.forEach((fighter,index)=>{fighter.rank=index+1;fighter.allTimeRank=index+1;});
    return Boolean(changed);
  }

  function ensureDisplayAndCompare(){
    window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
    window.DISPLAY_OVERRIDES[NAME]={...(window.DISPLAY_OVERRIDES[NAME]||{}),...display,compareProfile:{...(window.DISPLAY_OVERRIDES[NAME]?.compareProfile||{}),...display.compareProfile}};
    window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
    window.COMPARE_PROFILES[NAME]={...(window.COMPARE_PROFILES[NAME]||{}),...display.compareProfile};
    window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
    Object.assign(window.COMPARE_FIGHT_LEDGER,fightLedgers);
  }

  function ensureEraMembership(){
    const eraData=window.UFC_ERA_FILTER_DATA;
    if(eraData?.curatedMembership){
      eraData.curatedMembership[NAME]={primary:'new-blood',secondary:'apex'};
      if(eraData.audit){
        eraData.audit.fighterCount=Object.keys(eraData.curatedMembership).length;
        eraData.audit.passed=Array.isArray(eraData.audit.errors)&&eraData.audit.errors.length===0;
      }
    }
    window.UFC_ERA_FILTER?.apply?.();
  }

  function syncCompareControls(){
    const names=(window.RANKING_DATA?.fighters||[]).map(item=>item?.fighter).filter(Boolean).sort((a,b)=>a.localeCompare(b));
    ['fighterA','fighterB'].forEach(id=>{
      const select=document.getElementById(id);
      if(!select)return;
      const current=select.value;
      if(![...select.options].some(option=>option.value===NAME)){
        select.innerHTML='';
        names.forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.appendChild(option);});
        select.value=names.includes(current)?current:(id==='fighterA'?'Jon Jones':'Georges St-Pierre');
      }
    });
  }

  function divisionFallbackRow(){
    const overall=(window.RANKING_DATA?.men||[]).find(isPantoja)||row;
    return{
      fighter:NAME,division:'Flyweight',divisionLabel:'Flyweight',role:'primary',rankEligible:true,rank:null,
      overallRank:number(overall.rank)||null,overallOvr:89,overallScore:48.28,divisionScore:48.28,resumeSharePct:100,
      components:{championship:9.08,opponentQuality:10.55,primeDominance:15.06,longevity:12.42,apex:4,penalty:-2.08,eraDepth:-.75},
      evidenceShares:{championship:100,opponentQuality:100,primeDominance:100,longevity:100,apex:100,penalty:100,eraDepth:100},
      stats:{ufcRecord:'14-4',ufcFightCount:18,ufcWins:14,ufcLosses:4,ufcDraws:0,ufcNoContests:0,titleFightWins:5,adjustedTitleWins:4.4,topFiveWins:5,rankedWins:10,finishRatePct:57.14,primeRecord:'8-1',roundsWonPct:77.78,activeEliteYears:4.84},
      source:'canonical Pantoja extension / cross-tab fallback'
    };
  }

  function ensureDivisionBoard(){
    const pipeline=window.UFC_DIVISION_RANKING_PIPELINE;
    let report=window.UFC_DIVISION_RANKING_REPORT;
    if((!report||report.status!=='ready')&&pipeline?.rebuild)report=pipeline.rebuild();
    if(!report||report.status!=='ready')return;
    report.rows=Array.isArray(report.rows)?report.rows:[];
    report.boards=report.boards||{};
    const fallback=divisionFallbackRow();
    const existingRow=report.rows.find(item=>isPantoja(item)&&item.division==='Flyweight');
    if(existingRow)Object.assign(existingRow,fallback);else report.rows.push(fallback);
    const board=Array.isArray(report.boards.Flyweight)?report.boards.Flyweight:[];
    const existingBoardRow=board.find(isPantoja);
    if(existingBoardRow)Object.assign(existingBoardRow,fallback);else board.push({...fallback});
    board.sort((a,b)=>number(b.divisionScore)-number(a.divisionScore)||number(b.overallScore)-number(a.overallScore)||String(a.fighter).localeCompare(String(b.fighter)));
    board.forEach((item,index)=>{item.rank=index+1;});
    report.boards.Flyweight=board;
    report.fighterCount=new Set(report.rows.map(item=>item.fighter)).size;
    report.rowCount=report.rows.length;
    report.rankedRowCount=Object.values(report.boards).reduce((sum,items)=>sum+(Array.isArray(items)?items.length:0),0);
    window.UFC_DIVISION_RANKING_REPORT=report;
    window.UFC_DIVISION_RANKINGS?.render?.();
  }

  function refreshSurfaces(changed){
    const data=window.RANKING_DATA;
    const count=document.getElementById('fighterCount');
    if(count)count.textContent=String(new Set((data?.fighters||[]).map(item=>normalize(item?.fighter))).size);
    if(changed&&typeof window.refresh==='function'){
      try{window.refresh();}catch(error){console.warn(`[${VERSION}] main refresh failed`,error);}
    }
    syncCompareControls();
    window.UFC_CATEGORY_LEADERS?.render?.();
    ensureDivisionBoard();
    ensureEraMembership();
    window.UFC_OCTAGON_VERDICT_DATA?.build?.();
    window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render?.();
    const playSearch=document.getElementById('playFighterSearch');
    if(playSearch)playSearch.dispatchEvent(new Event('input',{bubbles:true}));
    if(!playRefreshSent&&window.UFC_SCORING_PIPELINE?.status==='ready'){
      playRefreshSent=true;
      window.setTimeout(()=>window.dispatchEvent(new CustomEvent('ufc-division-era-depth-finalized',{detail:{source:VERSION,fighter:NAME}})),0);
    }
  }

  function requestCanonicalAddition(){
    if(canonicalRequested||window.UFC_CANONICAL_PANTOJA_FIGHTER_ADDITION?.passed)return;
    if(document.documentElement.getAttribute('data-scoring-pipeline')!=='ready'||!window.UFC_DIVISION_RANKING_PIPELINE?.rebuild)return;
    canonicalRequested=true;
    const script=document.createElement('script');
    script.src='assets/data/canonical-pantoja-fighter-addition.js?v=canonical-pantoja-fighter-addition-20260715e-cross-tab';
    script.setAttribute('data-canonical-pantoja-cross-tab','true');
    script.onerror=()=>{canonicalRequested=false;};
    document.body.appendChild(script);
  }

  function installInstalledAppRefreshFix(){
    if(document.documentElement.hasAttribute('data-installed-app-refresh-fix'))return;
    document.documentElement.setAttribute('data-installed-app-refresh-fix',VERSION);
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('#manualRefreshBtn');
      if(!button)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      button.classList.add('refreshing');
      button.setAttribute('aria-busy','true');
      try{sessionStorage.setItem('ufc-goat-manual-refresh-progress-v1','1');}catch(_error){}
      const cleanup=[];
      if('caches'in window)cleanup.push(caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key)))).catch(()=>undefined));
      if(navigator.serviceWorker?.getRegistrations)cleanup.push(navigator.serviceWorker.getRegistrations().then(items=>Promise.all(items.map(item=>item.unregister()))).catch(()=>undefined));
      Promise.allSettled(cleanup).finally(()=>{
        const url=new URL('index.html',window.location.href);
        url.searchParams.set('__manual_refresh',String(Date.now()));
        url.searchParams.set('__shell','network');
        window.location.replace(url.toString());
      });
    },true);
  }

  function audit(){
    const data=window.RANKING_DATA||{};
    const division=(window.UFC_DIVISION_RANKING_REPORT?.boards?.Flyweight||[]).some(isPantoja);
    const eras=window.UFC_ERA_FILTER_DATA?.eraIdsFor?.(NAME)||[];
    const compare=Boolean(window.COMPARE_PROFILES?.[NAME]);
    const selectors=['fighterA','fighterB'].every(id=>[...(document.getElementById(id)?.options||[])].some(option=>option.value===NAME));
    const checks={
      mainBoard:(data.men||[]).some(isPantoja),profile:(data.fighters||[]).some(isPantoja),
      categories:['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty'].every(field=>Number.isFinite(Number((data.men||[]).find(isPantoja)?.[field]))),
      division,compare,compareSelectors:selectors,play:(data.men||[]).some(isPantoja),
      newBlood:eras.includes('new-blood'),apexEra:eras.includes('apex'),longestWinStreak:Number((data.fighters||[]).find(isPantoja)?.longestUfcWinStreak)===8
    };
    const result={version:VERSION,fighter:NAME,checks,passed:Object.values(checks).every(Boolean),rank:(data.men||[]).find(isPantoja)?.rank||null,fighterCount:new Set((data.fighters||[]).map(item=>normalize(item?.fighter))).size};
    window.UFC_PANTOJA_CROSS_TAB_AUDIT=result;
    document.documentElement.setAttribute('data-pantoja-cross-tab-audit',`${VERSION}-${result.passed?'passed':'pending'}`);
    return result;
  }

  function apply(){
    if(applying)return false;
    applying=true;
    try{
      installInstalledAppRefreshFix();
      const changed=ensureRankingData();
      ensureDisplayAndCompare();
      refreshSurfaces(changed);
      requestCanonicalAddition();
      audit();
      document.documentElement.setAttribute('data-pantoja-final-roster-guard',`${VERSION}-${window.UFC_PANTOJA_CROSS_TAB_AUDIT?.fighterCount||74}`);
      return changed;
    }finally{
      applying=false;
    }
  }

  [0,100,350,800,1600,3200,6500,10000].forEach(delay=>window.setTimeout(apply,delay));
  ['ufc-production-ranking-ready','ufc-ranking-pipeline-applied','ufc-scoring-pipeline-ready','ufc-ranking-data-patches-ready','ufc-pantoja-fighter-added','ufc-woodley-audit-applied'].forEach(eventName=>window.addEventListener(eventName,()=>window.setTimeout(apply,0)));
  window.UFC_PANTOJA_FINAL_ROSTER_GUARD={version:VERSION,apply,audit,ensureDivisionBoard,requestCanonicalAddition};
})();