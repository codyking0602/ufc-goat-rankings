// Final live-roster guard for Alexandre Pantoja.
// Runs after all ranking/bootstrap modules and restores the fighter only when a later rebuild removes him.
(function(){
  const VERSION='pantoja-final-roster-guard-20260715a';
  const NAME='Alexandre Pantoja';
  const normalize=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const isPantoja=row=>normalize(row?.fighter)===normalize(NAME);
  const row={
    fighter:NAME,leaderboard:'men',board:'men',gender:'Men',primaryDivision:'Flyweight',secondaryDivision:'',scope:'UFC',
    ufcRecord:'14-4',ufcWins:14,ufcLosses:4,ufcDraws:0,ufcNoContests:0,
    titleFightWins:5,adjustedTitleWins:4.4,topFiveWins:5,top5Wins:5,rankedWins:10,
    finishWins:8,finishRatePct:57.14,primeRecord:'8-1',primeWins:8,primeLosses:1,primeDraws:0,primeFights:9,primeFinishes:4,
    roundsWonPct:77.78,activeEliteYears:4.84,timesFinishedPrime:0,throughPrimeUfcFights:18,
    championship:9.08,opponentQuality:10.55,primeDominance:23.19,longevity:12.42,apexPeak:4.4,apexPeakBonus:4.4,
    penalty:-2.08,lossPenalty:-2.08,lossContext:-2.08,eraDepthAdjustment:-0.75,totalScore:48.28,rawScore:48.28,overallOvr:89,
    visibleStats:{ufcRecord:'14-4',titleFightWins:5,adjustedTitleWins:4.4,topFiveWins:5,rankedWins:10,finishRatePct:57.14,primeRecord:'8-1',roundsWonPct:77.78,activeEliteYears:4.84,timesFinishedPrime:0,throughPrimeUfcFights:18},
    title:{titleFightWins:5,adjustedTitleWins:4.4,notes:'Won the UFC flyweight title from Brandon Moreno and defended it four times.'},
    notes:'UFC-only Pantoja row. TUF exhibitions excluded; Joshua Van injury loss counts without a finish add-on.'
  };
  const profile={id:'APAN001',...row};
  let applying=false;

  function apply(){
    if(applying)return false;
    const data=window.RANKING_DATA;
    if(!data||!Array.isArray(data.men)||!Array.isArray(data.fighters))return false;
    applying=true;
    let changed=false;
    try{
      let menRow=data.men.find(isPantoja);
      if(!menRow){data.men.push({...row});changed=true;}
      else if(!Number.isFinite(Number(menRow.totalScore))){Object.assign(menRow,row);changed=true;}

      let profileRow=data.fighters.find(isPantoja);
      if(!profileRow){data.fighters.push({...profile});changed=true;}
      else if(!Number.isFinite(Number(profileRow.totalScore))){Object.assign(profileRow,profile);changed=true;}

      data.primeRecords=data.primeRecords||{};
      data.primeRecords[NAME]={record:'8-1',context:'Manel Kape through the Joshua Van injury title loss.',startFightId:'2021-02-06-manel-kape',endFightId:'2025-12-06-joshua-van',open:false};

      data.men.sort((a,b)=>Number(b?.totalScore||-999)-Number(a?.totalScore||-999)||String(a?.fighter||'').localeCompare(String(b?.fighter||'')));
      data.men.forEach((fighter,index)=>{fighter.rank=index+1;fighter.allTimeRank=index+1;});

      window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
      window.DISPLAY_OVERRIDES[NAME]={
        ...(window.DISPLAY_OVERRIDES[NAME]||{}),
        displayName:NAME,divisionLabel:'FLW',photoUrl:'assets/fighters/alex-pantoja.webp',thumbUrl:'assets/fighters/alex-pantoja-thumb.webp',overallOvr:89,
        watchUrl:'https://youtube.com/shorts/SWNsHqqKulw?is=dOqXog5XPpyNVzKO',watchLabel:'Watch Moment',
        signatureFightUrl:'https://youtu.be/7sj-snC5qWk?is=_DkasmmAc4OA-IDR',signatureFightLabel:'Watch Signature Fight',
        oneLiner:'A relentless four-defense UFC flyweight champion with the best UFC flyweight resume outside Demetrious Johnson.',
        whyRankedHere:'Five UFC title-fight wins, four successful defenses, and repeated wins over the modern flyweight elite.',
        whyNotHigher:'A shorter reign than Demetrious Johnson, a modest flyweight depth discount, and four counted UFC losses cap the case.'
      };

      const count=document.getElementById('fighterCount');
      if(count)count.textContent=String(data.fighters.length);
      document.documentElement.setAttribute('data-pantoja-final-roster-guard',`${VERSION}-${data.fighters.length}`);

      if(changed&&typeof window.refresh==='function'){
        try{window.refresh();}catch(error){console.warn(`[${VERSION}] refresh failed`,error);}
      }
      return changed;
    }finally{
      applying=false;
    }
  }

  [0,100,300,700,1500,3000,6000,10000].forEach(delay=>window.setTimeout(apply,delay));
  ['ufc-production-ranking-ready','ufc-ranking-pipeline-applied','ufc-scoring-pipeline-ready','ufc-ranking-data-patches-ready'].forEach(eventName=>window.addEventListener(eventName,()=>window.setTimeout(apply,0)));
  window.setInterval(apply,2500);
  window.UFC_PANTOJA_FINAL_ROSTER_GUARD={version:VERSION,apply};
})();
