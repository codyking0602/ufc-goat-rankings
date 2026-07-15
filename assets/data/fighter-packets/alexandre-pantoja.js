// Alexandre Pantoja fighter packet extension.
(function(){
  'use strict';
  const VERSION='fighter-packet-alexandre-pantoja-20260715b-visible-fallback';
  const fighter='Alexandre Pantoja';
  const packet={
    status:{stage:'new fighter packet live; immediate calculated fallback plus canonical 74th-fighter rebuild',lastUpdated:'2026-07-15',nextFix:'Confirm the canonical rebuild replaces the fallback row on the live app.'},
    repoLocations:{scoreSource:'assets/data/canonical-pantoja-fighter-addition.js',centralPacket:'assets/data/fighter-packets/alexandre-pantoja.js',displayFallback:'assets/data/fighter-packets/alexandre-pantoja.js',compareFallback:'assets/data/fighter-packets/alexandre-pantoja.js',photos:'assets/fighters/alex-pantoja.webp and assets/fighters/alex-pantoja-thumb.webp'},
    photos:{photoUrl:'assets/fighters/alex-pantoja.webp',thumbUrl:'assets/fighters/alex-pantoja-thumb.webp'},
    display:{
      divisionLabel:'FLW',resumeTag:'Four-defense UFC flyweight champion',
      oneLiner:'A relentless flyweight champion whose five title-fight wins, elite grappling, and eight-fight run built the best UFC flyweight resume outside Demetrious Johnson.',
      snapshot:[['UFC Record','14-4'],['UFC Title-Fight Wins','5'],['Successful Defenses','4'],['Prime Record','8-1'],['Finish Rate','57% of UFC wins'],['Loss Context','Van injury loss counts without finish add-on']],
      whyRankedHere:'Pantoja combines a real championship reign with repeated wins over the modern flyweight elite. He beat Brandon Moreno for the belt, defeated Brandon Royval twice, and finished both Kai Asakura and Kai Kara-France during a four-defense reign.',
      whyNotHigher:'His reign is much shorter than Demetrious Johnson’s, the flyweight opponent pool receives a division-depth discount, and several title challengers lacked proven UFC elite resumes. The Dustin Ortiz, Deiveson Figueiredo, Askar Askarov, and Joshua Van losses also keep the case from becoming completely clean.',
      keyJudgmentCalls:[
        ['UFC-only scope','The Ultimate Fighter exhibition wins over Brandon Moreno and Kai Kara-France are context, not scored UFC wins.'],
        ['Prime window','Manel Kape in February 2021 through the Joshua Van title loss in December 2025.'],
        ['Van injury','Counts as a prime elite title loss, but the freak elbow injury does not receive the normal finished-at-peak add-on.'],
        ['Division strength','Modern flyweight is stronger than the earliest version of the division, but still receives a modest depth discount.']
      ],
      finalTakeaway:'Pantoja is the clear second-best UFC flyweight championship resume behind Demetrious Johnson: a rugged, high-pressure champion with real title volume and elite submission wins.'
    },
    profileStats:{ufcRecord:'14-4',titleFightWins:5,eliteWins:5,finishRatePct:57.14,roundsWonPct:77.78,activeEliteYears:4.84,timesFinishedPrime:0,divisionStrengthContext:'Modern flyweight receives a modest division-depth discount; stronger than the earliest flyweight era but below the deepest UFC divisions.',lossContext:'Dustin Ortiz is a pre-prime non-elite loss; Figueiredo and Askarov are pre-prime elite losses; Van is a prime elite injury loss without a finish add-on.'},
    compareSeasoning:{
      shortCase:'Pantoja owns the strongest UFC flyweight championship case after Demetrious Johnson: five title-fight wins, four defenses, and repeated wins over the division’s best modern names.',
      peak:'At his best, Pantoja weaponized pressure, durability, back-taking, and submission threats while remaining dangerous through five hard rounds.',
      resume:'His UFC-only resume is built on the title win over Brandon Moreno, two Royval victories, and defenses over Erceg, Asakura, and Kara-France.',
      championship:'Five UFC title-fight wins and four successful defenses give Pantoja real historical title volume.',
      opponentQuality:'Moreno, Royval twice, Kara-France, Perez, Kape, and other ranked flyweights create a strong modern ledger, though flyweight depth and a few thin title challengers limit the ceiling.',
      longevity:'His elite prime lasted from the Kape win in 2021 through the Van title loss in 2025—strong, but not long enough to rival the longest championship windows.',
      counter:'Pantoja’s best counterargument is direct modern flyweight proof: he repeatedly beat the same elite contenders who defined the post-DJ division.',
      edge:'Pantoja wins comparisons against shorter or thinner champions because he pairs four defenses with a deep collection of repeat elite wins.',
      eliteCounter:true,
      signatureWins:'Brandon Moreno, Brandon Royval twice, Alex Perez, Kai Asakura, and Kai Kara-France define the resume.',
      weakness:'The DJ comparison is not close on title volume, and flyweight depth prevents Pantoja’s opponent list from scoring like the strongest lightweight or welterweight eras.',
      titleSummary:'Won the flyweight title from Moreno and defended it four times before the freak-injury loss to Van.',
      primeSummary:'An 8-1 prime run from Kape through Van, with four finishes and no normal competitive stoppage loss.',
      titleStyle:'Modern Flyweight Reign',primeStyle:'Pressure Grappling Prime',
      legacyStats:{ufcRecord:'14-4',titleFightWins:5,beltsWon:1,titleDefenses:4,activeEliteYearsLabel:'roughly 5 active elite years',primeNote:'8-1 modern flyweight elite run from Manel Kape through the Joshua Van injury loss'}
    },
    watchMomentCandidates:{primary:'Brandon Moreno — UFC 290',alternate:'Kai Asakura — UFC 310'}
  };

  const fallbackRow={
    fighter,leaderboard:'men',board:'men',gender:'Men',primaryDivision:'Flyweight',secondaryDivision:'',scope:'UFC',
    ufcRecord:'14-4',ufcWins:14,ufcLosses:4,ufcDraws:0,ufcNoContests:0,
    titleFightWins:5,adjustedTitleWins:4.4,topFiveWins:5,top5Wins:5,rankedWins:10,
    finishWins:8,finishRatePct:57.14,primeRecord:'8-1',primeWins:8,primeLosses:1,primeDraws:0,primeFights:9,primeFinishes:4,
    roundsWonPct:77.78,activeEliteYears:4.84,timesFinishedPrime:0,throughPrimeUfcFights:18,
    championship:9.08,opponentQuality:10.55,primeDominance:23.19,longevity:12.42,apexPeak:4.4,apexPeakBonus:4.4,
    penalty:-2.08,lossPenalty:-2.08,lossContext:-2.08,eraDepthAdjustment:-.75,totalScore:48.28,rawScore:48.28,overallOvr:89,
    visibleStats:{ufcRecord:'14-4',titleFightWins:5,adjustedTitleWins:4.4,topFiveWins:5,rankedWins:10,finishRatePct:57.14,primeRecord:'8-1',roundsWonPct:77.78,activeEliteYears:4.84,timesFinishedPrime:0,throughPrimeUfcFights:18},
    title:{titleFightWins:5,adjustedTitleWins:4.4,notes:'Five UFC title-fight wins: won the flyweight title from Brandon Moreno and defended it four times.'},
    notes:'Calculated fallback from the same UFC-only inputs; replaced automatically when the canonical 74-fighter rebuild succeeds.',
    scoreInputOwner:'alexandre-pantoja-calculated-fallback',overallScoreOwner:'alexandre-pantoja-calculated-fallback'
  };

  const fallbackProfile={id:'APAN001',...fallbackRow};
  const ledgers={
    'alexandre pantoja|brandon moreno':{fighters:[fighter,'Brandon Moreno'],fights:2,winner:fighter,importance:'major',summary:'Pantoja beat Moreno twice in official UFC bouts, including the 2023 title fight. Their earlier TUF exhibition is context only and is not scored.'},
    'alexandre pantoja|brandon royval':{fighters:[fighter,'Brandon Royval'],fights:2,winner:fighter,importance:'major',summary:'Pantoja submitted Royval in 2021 and then beat him across five rounds in his first title defense.'},
    'alexandre pantoja|joshua van':{fighters:[fighter,'Joshua Van'],fights:1,winner:'Joshua Van',importance:'major',summary:'Van won the title when Pantoja suffered a freak elbow injury 26 seconds into the fight. It is a real official loss, but not treated like a normal competitive knockout.'}
  };

  function mergeLegacyStats(a,b){return{...(a||{}),...(b||{})};}
  function mergeCompareProfile(a,b){return{...(a||{}),...(b||{}),legacyStats:mergeLegacyStats((a||{}).legacyStats,(b||{}).legacyStats)};}
  function rankedSort(a,b){return Number(b?.totalScore||-999)-Number(a?.totalScore||-999)||Number(b?.championship||0)-Number(a?.championship||0)||String(a?.fighter||'').localeCompare(String(b?.fighter||''));}
  function ensureSeed(){
    const data=window.RANKING_DATA;
    if(!data)return;
    if(Array.isArray(data.men)){
      const existing=data.men.find(item=>item?.fighter===fighter);
      if(!existing) data.men.push({...fallbackRow});
      else if(!Number.isFinite(Number(existing.totalScore))) Object.assign(existing,fallbackRow);
      data.men.sort(rankedSort);
      data.men.forEach((row,index)=>{row.rank=index+1;row.allTimeRank=index+1;});
    }
    if(Array.isArray(data.fighters)){
      const existing=data.fighters.find(item=>item?.fighter===fighter);
      if(!existing) data.fighters.push({...fallbackProfile});
      else if(!Number.isFinite(Number(existing.totalScore))) Object.assign(existing,fallbackProfile);
    }
    data.primeRecords=data.primeRecords||{};
    data.primeRecords[fighter]={record:'8-1',context:'Manel Kape through the Joshua Van injury title loss.',startFightId:'2021-02-06-manel-kape',endFightId:'2025-12-06-joshua-van',open:false};
  }
  function applyDisplay(){
    if(typeof DISPLAY_OVERRIDES==='undefined')return;
    DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{}),...(packet.photos||{})};
    DISPLAY_OVERRIDES[fighter].packetProfileStats={...(DISPLAY_OVERRIDES[fighter].packetProfileStats||{}),...(packet.profileStats||{})};
    DISPLAY_OVERRIDES[fighter].packetStatus=packet.status||{};
    DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations||{};
    DISPLAY_OVERRIDES[fighter].watchMomentCandidates=packet.watchMomentCandidates||{};
  }
  function applyCompare(){
    window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
    window.COMPARE_PROFILES[fighter]=mergeCompareProfile(window.COMPARE_PROFILES[fighter],packet.compareSeasoning);
    window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
    Object.assign(window.COMPARE_FIGHT_LEDGER,ledgers);
    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
      DISPLAY_OVERRIDES[fighter].compareProfile=mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile,window.COMPARE_PROFILES[fighter]);
    }
  }
  function syncControls(){
    ['fighterA','fighterB'].forEach(id=>{
      const select=document.getElementById(id);
      if(!select||[...select.options].some(option=>option.value===fighter))return;
      const current=select.value;
      const names=(window.RANKING_DATA?.fighters||[]).map(row=>row.fighter).filter(Boolean).sort();
      select.innerHTML='';
      names.forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.appendChild(option);});
      select.value=names.includes(current)?current:(id==='fighterA'?'Jon Jones':'Georges St-Pierre');
    });
    const count=document.getElementById('fighterCount');
    if(count)count.textContent=String(window.RANKING_DATA?.fighters?.length||74);
  }
  function renderFallback(){
    syncControls();
    if(typeof window.refresh==='function')window.refresh();
    window.UFC_CATEGORY_LEADERS?.render?.();
    window.UFC_DIVISION_RANKINGS?.render?.();
    window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render?.();
    document.documentElement.setAttribute('data-pantoja-fallback-visible',VERSION);
  }
  function registerPacket(){
    window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};
    window.UFC_FIGHTER_PACKETS[fighter]=packet;
    const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};
    const fighters=Array.from(new Set([...(current.fighters||[]),fighter]));
    const packetExtensions=Array.from(new Set([...(current.packetExtensions||[]),VERSION]));
    window.UFC_FIGHTER_PACKET_SYSTEM={...current,version:current.version||VERSION,purpose:current.purpose||'Central source for fighter-facing app content during migration.',fighters,packetExtensions,appliedAt:new Date().toISOString()};
  }
  function loadCanonicalAddition(){
    if(document.querySelector('[data-canonical-pantoja-fighter-addition]'))return;
    const script=document.createElement('script');
    script.src='assets/data/canonical-pantoja-fighter-addition.js?v=canonical-pantoja-fighter-addition-20260715d-visible-fallback';
    script.setAttribute('data-canonical-pantoja-fighter-addition','true');
    document.body.appendChild(script);
  }

  ensureSeed();
  applyDisplay();
  applyCompare();
  registerPacket();
  renderFallback();
  window.addEventListener('ufc-production-ranking-ready',()=>setTimeout(loadCanonicalAddition,50),{once:true});
  if(document.documentElement.getAttribute('data-scoring-pipeline')==='ready')setTimeout(loadCanonicalAddition,50);
})();