// Dedicated profile/snapshot stat blocks.
// Separates visible profile facts from category formulas while keeping them tied to the right category input layer.
(function(){
  const VERSION='profile-snapshot-stats-20260707b-source-aware';
  const MAX={titleFightWins:25,eliteTopFiveWins:25,activeEliteYears:25,timesFinishedPrime:20};
  const FIELD_ORDER=['ufcRecord','titleFightWins','eliteTopFiveWins','primeRecord','finishRatePct','roundsWonPct','activeEliteYears','timesFinishedPrime'];
  const FIELD_SOURCES={
    ufcRecord:'directRecord',
    titleFightWins:'championshipInputs',
    eliteTopFiveWins:'qualityWinsLedger',
    primeRecord:'primeInputs',
    finishRatePct:'directFinishInputs',
    roundsWonPct:'roundsLedger',
    activeEliteYears:'longevityInputs',
    timesFinishedPrime:'lossContextInputs'
  };
  const FIELD_LABELS={
    ufcRecord:'UFC Record',
    titleFightWins:'UFC Title-Fight Wins',
    eliteTopFiveWins:'Elite / Top-5 Wins',
    primeRecord:'Prime Record',
    finishRatePct:'Finish Rate',
    roundsWonPct:'Rounds Won',
    activeEliteYears:'Active Elite Years',
    timesFinishedPrime:'Times Finished in Prime'
  };
  const MANUAL_OVERRIDES={
    'Merab Dvalishvili':{
      ufcRecord:{value:'14-3',source:'directRecord',confidence:'high'},
      titleFightWins:{value:3,source:'championshipInputs',confidence:'review'},
      eliteTopFiveWins:{value:null,source:'qualityWinsLedger',confidence:'needs-direct-input'},
      primeRecord:{value:null,source:'primeInputs',confidence:'needs-direct-input'},
      finishRatePct:{value:12.5,source:'directFinishInputs',confidence:'review'},
      roundsWonPct:{value:null,source:'roundsLedger',confidence:'needs-direct-input'},
      activeEliteYears:{value:3.3,source:'longevityInputs',confidence:'review'},
      timesFinishedPrime:{value:0,source:'lossContextInputs',confidence:'high'},
      review:'Needs Quality Wins and Prime direct-input pass for exact elite/top-5 wins, prime record, and rounds-won percent.'
    }
  };
  function unwrap(v){return v&&typeof v==='object'&&Object.prototype.hasOwnProperty.call(v,'value')?v.value:v;}
  function num(v){v=unwrap(v);if(v===null||v===undefined||v==='')return null;const n=Number(v);if(Number.isFinite(n))return n;const m=String(v).match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):null;}
  function round1(v){const n=num(v);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*10)/10:null;}
  function cleanRecord(v){v=unwrap(v);const s=String(v||'').trim();return /^\d+\s*-\s*\d+(?:\s*-\s*\d+)?(?:\s*,\s*\d+\s*NC)?$/i.test(s)?s.replace(/\s+/g,' '):null;}
  function cleanPrimeRecord(v){v=unwrap(v);const s=String(v||'').trim();return /^\d+\s*-\s*\d+(?:\s*-\s*\d+)?$/i.test(s)?s.replace(/\s+/g,' '):null;}
  function cleanPct(v){const n=num(v);return Number.isFinite(n)&&n>=0&&n<=100?round1(n):null;}
  function cleanInt(v,max){const n=num(v);return Number.isInteger(n)&&n>=0&&n<=max?n:null;}
  function cleanYears(v){const n=num(v);return Number.isFinite(n)&&n>=0&&n<=MAX.activeEliteYears?round1(n):null;}
  function stat(value,source,confidence='derived',notes=''){return {value:value??null,source,confidence,notes};}
  function valueOnly(stats){const out={};FIELD_ORDER.forEach(k=>{out[k]=stats[k]?.value??null;});out.source='profile-snapshot-values';out.version=VERSION;out.needsDirectInput=FIELD_ORDER.filter(k=>out[k]===null||out[k]===undefined);return out;}
  function cleanOpponentName(name){return String(name||'').replace(/\s+(?:I{1,3}|IV|V)$/i,'').replace(/\s+\d+$/,'').trim();}
  function directFrom(f,keys,cleaner){
    const pools=[f?.profileStats,f?.snapshotStats,f?.snapshotStatValues,f?.snapshot,f?.resume,f];
    for(const pool of pools){
      if(!pool)continue;
      for(const key of keys){
        if(pool[key]===undefined||pool[key]===null||pool[key]==='')continue;
        const cleaned=cleaner(pool[key]);
        if(cleaned!==null&&cleaned!==undefined)return cleaned;
      }
    }
    return null;
  }
  function titleFightWins(f){
    const direct=directFrom(f,['titleFightWins','ufcTitleFightWins'],v=>cleanInt(v,MAX.titleFightWins));
    if(direct!==null)return stat(direct,'championshipInputs','direct','Direct title-fight wins input.');
    const t=f?.title||{};
    const total=['normalTitleWins','interimTitleWins','vacantUndisputedWins','secondDivisionUndisputedWins','vacantSecondDivisionWins'].reduce((sum,k)=>sum+(num(t[k])||0),0);
    if(total>0&&total<=MAX.titleFightWins)return stat(Math.round(total),'championshipInputs','derived','Derived from title credit input buckets.');
    const m=String(t.notes||'').match(/title[-\s]?fight wins\s*=\s*([0-9.]+)/i);
    const fromNotes=m?cleanInt(m[1],MAX.titleFightWins):null;
    return stat(fromNotes,'championshipInputs',fromNotes===null?'needs-direct-input':'derived','Parsed from championship notes when no direct field exists.');
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
    const direct=directFrom(f,['eliteTopFiveWins','eliteWins','topFiveWins'],v=>cleanInt(v,MAX.eliteTopFiveWins));
    if(direct!==null)return stat(direct,'qualityWinsLedger','direct','Direct elite/top-5 wins input.');
    const derived=opponentDerivedEliteWins(f);
    return stat(derived,'qualityWinsLedger',derived===null?'needs-direct-input':'derived','Derived from quality wins/opponent ledger, never from opponent-quality score.');
  }
  function roundsWonPct(f){
    const direct=directFrom(f,['roundsWonPct','roundsWonPercentage','roundWinPct'],cleanPct);
    if(direct!==null)return stat(direct,'roundsLedger','direct','Direct rounds-won percent input.');
    const rows=Array.isArray(f?.rounds)?f.rounds:[];
    const counted=rows.reduce((sum,r)=>sum+(num(r?.roundsCounted)||0),0);
    const won=rows.reduce((sum,r)=>sum+(num(r?.roundsWon)||0),0);
    if(counted>0&&won>=0&&won<=counted)return stat(round1((won/counted)*100),'roundsLedger','derived','Derived from round-by-round ledger.');
    return stat(null,'roundsLedger','needs-direct-input','Needs rounds ledger or direct rounds-won input.');
  }
  function primeRecord(f){
    const direct=directFrom(f,['primeRecord','primeUfcRecord','prime_record'],cleanPrimeRecord);
    if(direct)return stat(direct,'primeInputs','direct','Direct prime record input.');
    const wins=directFrom(f,['primeWins'],v=>cleanInt(v,50));
    const losses=directFrom(f,['primeLosses'],v=>cleanInt(v,50));
    const value=wins!==null&&losses!==null?`${wins}-${losses}`:null;
    return stat(value,'primeInputs',value===null?'needs-direct-input':'derived','Derived from prime wins/losses inputs.');
  }
  function lossContextTimesFinished(f){
    const direct=directFrom(f,['timesFinishedPrime','finishedInPrime','primeFinishedLosses'],v=>cleanInt(v,MAX.timesFinishedPrime));
    if(direct!==null)return stat(direct,'lossContextInputs','direct','Direct times-finished-in-prime input.');
    const losses=Array.isArray(f?.losses)?f.losses:[];
    const count=losses.filter(l=>l?.counted!==false&&String(l?.phase||'').toLowerCase().includes('prime')&&!String(l?.phase||'').toLowerCase().includes('pre')&&!String(l?.phase||'').toLowerCase().includes('post')&&l?.finished===true).length;
    if(count>0)return stat(count,'lossContextInputs','derived','Derived from Loss Context ledger.');
    return stat(direct,'lossContextInputs',direct===null?'needs-direct-input':'direct','Loss Context input.');
  }
  function buildSourceAware(f){
    const stats={
      ufcRecord:stat(directFrom(f,['ufcRecord','record'],cleanRecord),'directRecord','direct','Direct UFC record input.'),
      titleFightWins:titleFightWins(f),
      eliteTopFiveWins:eliteTopFiveWins(f),
      primeRecord:primeRecord(f),
      finishRatePct:stat(directFrom(f,['finishRatePct','finishPct'],cleanPct),'directFinishInputs','direct','Direct finish-rate input used by Prime Dominance display.'),
      roundsWonPct:roundsWonPct(f),
      activeEliteYears:stat(directFrom(f,['activeEliteYears','eliteYears'],cleanYears),'longevityInputs','direct','Active elite years input used by Longevity.'),
      timesFinishedPrime:lossContextTimesFinished(f)
    };
    const manual=MANUAL_OVERRIDES[f.fighter]||{};
    FIELD_ORDER.forEach(k=>{if(manual[k]&&typeof manual[k]==='object'&&Object.prototype.hasOwnProperty.call(manual[k],'value'))stats[k]={...stats[k],...manual[k]};});
    const values=valueOnly(stats);
    const needsDirectInput=FIELD_ORDER.filter(k=>stats[k].value===null||stats[k].value===undefined);
    return { sourceAware:stats, values:{...values,review:manual.review||'',needsDirectInput}, needsDirectInput, review:manual.review||'' };
  }
  function syncBoardRow(name,sourceAware,values){
    const boards=[window.RANKING_DATA?.men,window.RANKING_DATA?.women].filter(Array.isArray);
    boards.forEach(board=>{const row=board.find(f=>f?.fighter===name);if(row){row.profileStats={...values};row.snapshotStats={...sourceAware};row.snapshotStatValues={...values};}});
  }
  function apply(){
    const rows=Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];
    const applied=[];
    rows.forEach(f=>{
      if(!f?.fighter)return;
      const built=buildSourceAware(f);
      f.profileStats={...built.values};
      f.snapshotStats={...built.sourceAware};
      f.snapshotStatValues={...built.values};
      syncBoardRow(f.fighter,built.sourceAware,built.values);
      applied.push({fighter:f.fighter,needsDirectInput:built.needsDirectInput,sources:Object.fromEntries(FIELD_ORDER.map(k=>[k,built.sourceAware[k]?.source])),confidence:Object.fromEntries(FIELD_ORDER.map(k=>[k,built.sourceAware[k]?.confidence]))});
    });
    window.UFC_PROFILE_SNAPSHOT_STATS={version:VERSION,count:applied.length,applied,manualOverrides:MANUAL_OVERRIDES,fields:FIELD_ORDER,fieldSources:FIELD_SOURCES,fieldLabels:FIELD_LABELS,rule:'Snapshot values come from direct/category input ledgers, never category scores.'};
    document.documentElement.setAttribute('data-profile-snapshot-stats',VERSION);
    if(window.UFC_PROFILE_SNAPSHOT_SANITY?.refresh)window.UFC_PROFILE_SNAPSHOT_SANITY.refresh();
    return applied;
  }
  apply();
  window.UFC_PROFILE_SNAPSHOT_STATS_APPLY=apply;
})();
