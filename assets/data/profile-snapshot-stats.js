// Dedicated profile/snapshot stat blocks.
// Separates visible profile facts from category formulas and scoring fields.
(function(){
  const VERSION='profile-snapshot-stats-20260707a';
  const MAX={titleFightWins:25,eliteTopFiveWins:25,activeEliteYears:25,timesFinishedPrime:20};
  const FIELD_ORDER=['ufcRecord','titleFightWins','eliteTopFiveWins','primeRecord','finishRatePct','roundsWonPct','activeEliteYears','timesFinishedPrime'];
  const MANUAL_OVERRIDES={
    'Merab Dvalishvili':{ufcRecord:'14-3',titleFightWins:3,eliteTopFiveWins:null,primeRecord:null,finishRatePct:12.5,roundsWonPct:null,activeEliteYears:3.3,timesFinishedPrime:0,review:'Needs Quality Wins direct-input pass for exact elite/top-5 wins and prime record.'}
  };
  function num(v){if(v===null||v===undefined||v==='')return null;const n=Number(v);if(Number.isFinite(n))return n;const m=String(v).match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):null;}
  function round1(v){const n=num(v);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*10)/10:null;}
  function cleanRecord(v){const s=String(v||'').trim();return /^\d+\s*-\s*\d+(?:\s*-\s*\d+)?(?:\s*,\s*\d+\s*NC)?$/i.test(s)?s.replace(/\s+/g,' '):null;}
  function cleanPrimeRecord(v){const s=String(v||'').trim();return /^\d+\s*-\s*\d+(?:\s*-\s*\d+)?$/i.test(s)?s.replace(/\s+/g,' '):null;}
  function cleanPct(v){const n=num(v);return Number.isFinite(n)&&n>=0&&n<=100?round1(n):null;}
  function cleanInt(v,max){const n=num(v);return Number.isInteger(n)&&n>=0&&n<=max?n:null;}
  function cleanYears(v){const n=num(v);return Number.isFinite(n)&&n>=0&&n<=MAX.activeEliteYears?round1(n):null;}
  function cleanOpponentName(name){return String(name||'').replace(/\s+(?:I{1,3}|IV|V)$/i,'').replace(/\s+\d+$/,'').trim();}
  function titleFightWins(f){
    const direct=cleanInt(f?.titleFightWins??f?.ufcTitleFightWins??f?.resume?.titleFightWins??f?.snapshot?.titleFightWins,MAX.titleFightWins);
    if(direct!==null)return direct;
    const t=f?.title||{};
    const total=['normalTitleWins','interimTitleWins','vacantUndisputedWins','secondDivisionUndisputedWins','vacantSecondDivisionWins'].reduce((sum,k)=>sum+(num(t[k])||0),0);
    if(total>0&&total<=MAX.titleFightWins)return Math.round(total);
    const m=String(t.notes||'').match(/title[-\s]?fight wins\s*=\s*([0-9.]+)/i);
    const fromNotes=m?cleanInt(m[1],MAX.titleFightWins):null;
    return fromNotes;
  }
  function opponentDerivedEliteWins(f){
    const wins=Array.isArray(f?.qualityWins)?f.qualityWins:(Array.isArray(f?.opponents)?f.opponents:[]);
    const names=new Set();
    wins.forEach(o=>{
      const credit=num(o?.credit??o?.value)??0;
      const context=String([o?.context,o?.type,o?.notes,o?.note].filter(Boolean).join(' ')).toLowerCase();
      if(credit>=0.75||/champion|top\s*-?\s*5|top-five|elite|p4p/.test(context)){
        const n=cleanOpponentName(o?.opponent);
        if(n)names.add(n);
      }
    });
    return names.size&&names.size<=MAX.eliteTopFiveWins?names.size:null;
  }
  function eliteTopFiveWins(f){
    const direct=cleanInt(f?.eliteTopFiveWins??f?.eliteWins??f?.topFiveWins??f?.resume?.eliteTopFiveWins??f?.snapshot?.eliteTopFiveWins,MAX.eliteTopFiveWins);
    if(direct!==null)return direct;
    return opponentDerivedEliteWins(f);
  }
  function roundsWonPct(f){
    const direct=cleanPct(f?.roundsWonPct??f?.roundsWonPercentage??f?.roundWinPct??f?.resume?.roundsWonPct??f?.snapshot?.roundsWonPct);
    if(direct!==null)return direct;
    const rows=Array.isArray(f?.rounds)?f.rounds:[];
    const counted=rows.reduce((sum,r)=>sum+(num(r?.roundsCounted)||0),0);
    const won=rows.reduce((sum,r)=>sum+(num(r?.roundsWon)||0),0);
    if(counted>0&&won>=0&&won<=counted)return round1((won/counted)*100);
    return null;
  }
  function primeRecord(f){
    const direct=cleanPrimeRecord(f?.primeRecord??f?.primeUfcRecord??f?.prime_record??f?.resume?.primeRecord??f?.snapshot?.primeRecord);
    if(direct)return direct;
    const wins=cleanInt(f?.primeWins??f?.resume?.primeWins,50);
    const losses=cleanInt(f?.primeLosses??f?.resume?.primeLosses,50);
    return wins!==null&&losses!==null?`${wins}-${losses}`:null;
  }
  function build(f){
    const base={
      ufcRecord:cleanRecord(f?.ufcRecord??f?.record??f?.resume?.ufcRecord??f?.snapshot?.ufcRecord),
      titleFightWins:titleFightWins(f),
      eliteTopFiveWins:eliteTopFiveWins(f),
      primeRecord:primeRecord(f),
      finishRatePct:cleanPct(f?.finishRatePct??f?.finishPct??f?.resume?.finishRatePct??f?.snapshot?.finishRatePct),
      roundsWonPct:roundsWonPct(f),
      activeEliteYears:cleanYears(f?.activeEliteYears??f?.eliteYears??f?.resume?.activeEliteYears??f?.snapshot?.activeEliteYears),
      timesFinishedPrime:cleanInt(f?.timesFinishedPrime??f?.finishedInPrime??f?.primeFinishedLosses??f?.resume?.timesFinishedPrime??f?.snapshot?.timesFinishedPrime,MAX.timesFinishedPrime)
    };
    const manual=MANUAL_OVERRIDES[f.fighter]||{};
    const merged={...base,...manual};
    merged.source='dedicated-profile-snapshot-stats';
    merged.version=VERSION;
    merged.needsDirectInput=FIELD_ORDER.filter(k=>merged[k]===null||merged[k]===undefined);
    return merged;
  }
  function syncBoardRow(name,stats){
    const boards=[window.RANKING_DATA?.men,window.RANKING_DATA?.women].filter(Array.isArray);
    boards.forEach(board=>{const row=board.find(f=>f?.fighter===name);if(row){row.profileStats={...stats};row.snapshotStats={...stats};}});
  }
  function apply(){
    const rows=Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];
    const applied=[];
    rows.forEach(f=>{
      if(!f?.fighter)return;
      const stats=build(f);
      f.profileStats={...stats};
      f.snapshotStats={...stats};
      syncBoardRow(f.fighter,stats);
      applied.push({fighter:f.fighter,needsDirectInput:stats.needsDirectInput});
    });
    window.UFC_PROFILE_SNAPSHOT_STATS={version:VERSION,count:applied.length,applied,manualOverrides:MANUAL_OVERRIDES,fields:FIELD_ORDER};
    document.documentElement.setAttribute('data-profile-snapshot-stats',VERSION);
    if(window.UFC_PROFILE_SNAPSHOT_SANITY?.refresh)window.UFC_PROFILE_SNAPSHOT_SANITY.refresh();
    return applied;
  }
  apply();
  window.UFC_PROFILE_SNAPSHOT_STATS_APPLY=apply;
})();
