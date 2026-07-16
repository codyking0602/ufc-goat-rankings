// Paddy Pimblett fighter packet.
(function(){
  'use strict';

  const VERSION='fighter-packet-paddy-pimblett-20260715a';
  const fighter='Paddy Pimblett';
  const normalize=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const isPaddy=row=>normalize(row?.fighter||row)===normalize(fighter);

  const rankingRow={
    fighter,leaderboard:'men',board:'men',gender:'Men',primaryDivision:'Lightweight',secondaryDivision:'',scope:'UFC',
    ufcRecord:'8-1',ufcWins:8,ufcLosses:1,ufcDraws:0,ufcNoContests:0,scoredUfcFights:9,
    titleFightWins:0,adjustedTitleWins:0,topFiveWins:1,top5Wins:1,rankedWins:3,
    finishWins:6,finishRatePct:75,primeRecord:'3-1',primeWins:3,primeLosses:1,primeDraws:0,primeFights:4,primeFinishes:3,
    roundsWonPct:63.3,activeEliteYears:1.97,timesFinishedPrime:0,throughPrimeUfcFights:4,longestUfcWinStreak:7,longestWinStreak:7,
    championship:0,opponentQuality:3.4,primeDominance:17.2,longevity:2.7,apexPeak:3.16,apexPeakBonus:3.16,
    penalty:-1.5,lossPenalty:-1.5,lossContext:-1.5,eraDepthAdjustment:.75,totalScore:25.71,rawScore:25.71,overallOvr:84,
    visibleStats:{ufcRecord:'8-1',titleFightWins:0,adjustedTitleWins:0,topFiveWins:1,rankedWins:3,finishRatePct:75,primeRecord:'3-1',roundsWonPct:63.3,activeEliteYears:1.97,timesFinishedPrime:0,throughPrimeUfcFights:4,longestUfcWinStreak:7,longestWinStreak:7},
    notes:'Initial roster row from the Paddy Pimblett fighter packet; the canonical fight ledger owns final calculated category values.'
  };
  const profileRow={id:'PPIM001',...rankingRow};

  const compareProfile={
    shortCase:'Pimblett’s UFC case is built on an 8-1 record, six finishes, and a ranked run over King Green, Michael Chandler, and Benoit Saint Denis.',
    peak:'His best version pressures forward, survives danger, and turns scrambles into sudden submissions or ground-and-pound finishes.',
    resume:'The Saint Denis submission is the anchor, with Chandler and Green giving the contender run legitimate ranked depth.',
    championship:'He reached an interim-title fight but has no UFC title-fight win, so Championship remains the clear weakness.',
    opponentQuality:'Saint Denis is the best win. Chandler and Green add ranked value, while Gordon and late-career Ferguson receive little quality credit.',
    longevity:'The elite window begins with King Green in July 2024 and remains open after the Saint Denis rebound.',
    counter:'The strongest counterargument is momentum: his current form is better than the thin historical resume suggests.',
    edge:'He beats lower-level cases through UFC win volume, finishing rate, and modern lightweight strength—not championship achievement.',
    signatureWins:'Benoit Saint Denis, Michael Chandler, and King Green define the UFC resume.',
    weakness:'No championship win, only one clear top-five victory, and a short elite window limit the all-time case.',
    titleSummary:'Lost a competitive five-round interim-title fight to Justin Gaethje; no UFC title-fight wins.',
    primeSummary:'A 3-1 ranked-lightweight prime from King Green through Saint Denis, with three finishes and one elite decision loss.',
    legacyStats:{ufcRecord:'8-1',titleFightWins:0,adjustedTitleWins:0,topFiveWins:1,rankedWins:3,primeRecord:'3-1',roundsWonPct:63.3,finishRatePct:75,activeEliteYears:1.97,activeEliteYearsLabel:'2.0 active elite years',overallOvr:84,longestUfcWinStreak:7}
  };

  const directFightLedger={
    fighters:['Justin Gaethje',fighter],fights:1,winner:'Justin Gaethje',importance:'major',
    summary:'Gaethje beat Pimblett by unanimous decision across five rounds for the interim lightweight title at UFC 324.'
  };

  function upsert(list,value){
    if(!Array.isArray(list))return false;
    const existing=list.find(isPaddy);
    if(existing){
      if(!Number.isFinite(Number(existing.totalScore)))Object.assign(existing,value);
      return false;
    }
    list.push({...value});
    return true;
  }

  function ensureRankingRows(){
    const data=window.RANKING_DATA;
    if(!data)return false;
    const changed=Boolean(upsert(data.men,rankingRow)|upsert(data.fighters,profileRow));
    data.primeRecords=data.primeRecords||{};
    data.primeRecords[fighter]={record:'3-1',context:'King Green through current ranked lightweight form.',startFightId:'2024-07-27-king-green',endFightId:null,open:true};
    if(Array.isArray(data.men)){
      data.men.sort((a,b)=>Number(b?.totalScore||-999)-Number(a?.totalScore||-999)||String(a?.fighter||'').localeCompare(String(b?.fighter||'')));
      data.men.forEach((row,index)=>{row.rank=index+1;row.allTimeRank=index+1;});
    }
    return changed;
  }

  function ensurePresentation(){
    window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
    window.COMPARE_PROFILES[fighter]={...(window.COMPARE_PROFILES[fighter]||{}),...compareProfile};
    window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
    window.COMPARE_FIGHT_LEDGER['justin gaethje|paddy pimblett']=directFightLedger;
    if(window.DISPLAY_OVERRIDES?.[fighter]){
      window.DISPLAY_OVERRIDES[fighter].compareProfile={...(window.DISPLAY_OVERRIDES[fighter].compareProfile||{}),...compareProfile};
    }
    const eras=window.UFC_ERA_FILTER_DATA;
    if(eras?.curatedMembership)eras.curatedMembership[fighter]={primary:'new-blood',secondary:'apex'};
  }

  function syncControls(){
    const names=(window.RANKING_DATA?.fighters||[]).map(row=>row?.fighter).filter(Boolean).sort((a,b)=>a.localeCompare(b));
    ['fighterA','fighterB'].forEach(id=>{
      const select=document.getElementById(id);
      if(!select||[...select.options].some(option=>option.value===fighter))return;
      const current=select.value;
      select.innerHTML='';
      names.forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.appendChild(option);});
      select.value=names.includes(current)?current:(id==='fighterA'?'Jon Jones':'Georges St-Pierre');
    });
    const count=document.getElementById('fighterCount');
    if(count)count.textContent=String(new Set((window.RANKING_DATA?.fighters||[]).map(row=>normalize(row?.fighter))).size);
  }

  function registerPacket(){
    window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};
    window.UFC_FIGHTER_PACKETS[fighter]={version:VERSION,rankingRow,profileRow,compareProfile,directFightLedger,photos:{photoUrl:'assets/fighters/paddy-pimblett.webp',thumbUrl:'assets/fighters/paddy-pimblett-thumb.webp'}};
    const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};
    window.UFC_FIGHTER_PACKET_SYSTEM={...current,fighters:Array.from(new Set([...(current.fighters||[]),fighter])),packetExtensions:Array.from(new Set([...(current.packetExtensions||[]),VERSION])),appliedAt:new Date().toISOString()};
  }

  function refresh(changed){
    syncControls();
    if(changed&&typeof window.refresh==='function'){
      try{window.refresh();}catch(error){console.warn(`[${VERSION}] refresh failed`,error);}
    }
    window.UFC_CATEGORY_LEADERS?.render?.();
    window.UFC_DIVISION_RANKINGS?.render?.();
    window.UFC_ERA_FILTER?.apply?.();
    window.UFC_OCTAGON_VERDICT_DATA?.build?.();
    window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render?.();
  }

  function apply(){
    const changed=ensureRankingRows();
    ensurePresentation();
    registerPacket();
    refresh(changed);
    document.documentElement.setAttribute('data-fighter-packet-paddy-pimblett',`${VERSION}-${window.RANKING_DATA?.fighters?.length||0}`);
  }

  function loadCanonical(){
    if(window.UFC_CANONICAL_PADDY_PIMBLETT_ADDITION?.passed||document.querySelector('[data-canonical-paddy-pimblett-fighter-addition]'))return;
    const script=document.createElement('script');
    script.src='assets/data/canonical-paddy-pimblett-fighter-addition.js?v=canonical-paddy-pimblett-fighter-addition-20260715a';
    script.setAttribute('data-canonical-paddy-pimblett-fighter-addition','true');
    document.body.appendChild(script);
  }

  function afterBootstrap(){
    [0,120,450,1200,3000].forEach((delay,index)=>window.setTimeout(()=>{
      apply();
      if(index===1)loadCanonical();
    },delay));
  }

  apply();
  window.addEventListener('ufc-production-ranking-ready',afterBootstrap);
  window.addEventListener('ufc-pantoja-fighter-added',afterBootstrap);
  window.addEventListener('ufc-paddy-pimblett-added',()=>window.setTimeout(apply,0));
  if(document.documentElement.getAttribute('data-scoring-pipeline')==='ready')afterBootstrap();
})();