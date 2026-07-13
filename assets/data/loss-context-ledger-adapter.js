// Loss Context Ledger Adapter.
// Shadow-only adapter that reads the shared Fighter Era Ledger and classifies loss/context events.
// Does not mutate rankings, fighter rows, display overrides, or total scores.
(function(){
  const VERSION='loss-context-ledger-adapter-20260712c-dynamic-roster';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;

  const RULES={
    source:'fighter-era-ledgers.js',
    primeWindow:'single shared elite-prime window',
    mutatesScores:false,
    lossPenaltyRules:{
      prePrimeElite:-0.75,
      prePrimeNonElite:-1.25,
      primeElite:-1.5,
      primeNonElite:-4.0,
      finishedCountedLossExtra:-0.75,
      postPrime:0,
      primeUpwardElite:-0.75,
      primeUpwardEliteFinishedExtra:-0.50
    },
    notes:[
      'This adapter classifies events from the Era Ledger only.',
      'It does not replace live penalty scoring yet.',
      'Penalty estimates are review helpers and should be compared to the existing penalty module before promotion.',
      'All unrecoveredLoss, recoveredLosses, upwardDivisionLosses, and postPrimeLosses rows are treated as losses unless explicitly marked draw/context.'
    ]
  };

  if(!era||!era.entryFor){
    window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER={
      version:VERSION,
      rules:RULES,
      error:'Missing UFC_FIGHTER_ERA_LEDGERS. Load fighter-era-ledgers.js before loss-context-ledger-adapter.js.',
      mutatesScores:false
    };
    return;
  }

  function key(name){return String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function parseIsoDate(value){
    const text=String(value||'').trim();
    const match=text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!match)return null;
    return text;
  }

  function compareIso(a,b){
    if(!a||!b)return null;
    if(a<b)return -1;
    if(a>b)return 1;
    return 0;
  }

  function textOf(event){
    if(!event)return '';
    if(typeof event==='string')return event;
    return [event.label,event.type,event.phase,event.rule,event.recovery,event.notes].filter(Boolean).join(' ');
  }

  function phaseFromDate(ledger,date){
    const start=parseIsoDate(ledger?.window?.start);
    const end=parseIsoDate(ledger?.window?.end);
    const d=parseIsoDate(date);
    if(!d||!start)return 'unknown';
    if(compareIso(d,start)<0)return 'pre-prime';
    if(end&&compareIso(d,end)>0)return 'post-prime';
    return 'prime';
  }

  function phaseFromText(text){
    const t=String(text||'').toLowerCase();
    if(t.includes('post-prime'))return 'post-prime';
    if(t.includes('pre-prime')||t.includes('pre-window')||t.includes('pre-apex'))return 'pre-prime';
    if(t.includes('prime')||t.includes('title')||t.includes('elite'))return 'prime';
    return 'unknown';
  }

  function qualityFromText(text){
    const t=String(text||'').toLowerCase();
    if(t.includes('non-elite'))return 'non-elite';
    if(t.includes('elite')||t.includes('title')||t.includes('champion')||t.includes('top-5')||t.includes('top 5'))return 'elite';
    return 'unknown';
  }

  function isFinishedLoss(text){
    const t=String(text||'').toLowerCase();
    return /finish|finished|submission|tko|ko\b|knockout|injury/.test(t)&&!/decision/.test(t);
  }

  function isLossLike(sourceType,event){
    const t=textOf(event).toLowerCase();
    if(sourceType==='weirdResults')return false;
    if(t.includes('draw')&&!t.includes('loss'))return false;
    if(/win context|retirement win|title fight win/.test(t)&&!t.includes('loss'))return false;
    if(['unrecoveredLoss','recoveredLosses','upwardDivisionLosses','postPrimeLosses'].includes(sourceType))return true;
    return t.includes('loss');
  }

  function exceptionType(sourceType,text){
    const t=String(text||'').toLowerCase();
    if(sourceType==='weirdResults')return 'weird/contextual';
    if(sourceType==='upwardDivisionLosses'||t.includes('upward'))return 'upward-division';
    if(t.includes('no contest')||t.includes('dq')||t.includes('contextual'))return 'weird/contextual';
    return null;
  }

  function penaltyEstimate({phase,quality,finished,upward,isLoss,exception}){
    if(!isLoss)return null;
    if(exception==='weird/contextual')return 0;
    if(phase==='post-prime')return 0;
    if(phase==='unknown')return null;

    const elite=quality==='elite'||quality==='unknown';
    let value=0;

    if(phase==='pre-prime'){
      value=elite?RULES.lossPenaltyRules.prePrimeElite:RULES.lossPenaltyRules.prePrimeNonElite;
      if(finished)value+=RULES.lossPenaltyRules.finishedCountedLossExtra;
      return Math.round(value*100)/100;
    }

    if(phase==='prime'){
      if(upward&&elite){
        value=RULES.lossPenaltyRules.primeUpwardElite;
        if(finished)value+=RULES.lossPenaltyRules.primeUpwardEliteFinishedExtra;
        return Math.round(value*100)/100;
      }
      value=elite?RULES.lossPenaltyRules.primeElite:RULES.lossPenaltyRules.primeNonElite;
      if(finished)value+=RULES.lossPenaltyRules.finishedCountedLossExtra;
      return Math.round(value*100)/100;
    }

    return null;
  }

  function normalizeEvent(fighter,ledger,sourceType,event){
    const object=typeof event==='string'?{label:event}:event||{};
    const label=object.label||String(event||sourceType);
    const date=parseIsoDate(object.date);
    const text=textOf(object);
    const exception=exceptionType(sourceType,text);
    const upward=exception==='upward-division';
    const phase=date?phaseFromDate(ledger,date):phaseFromText(text||sourceType);
    const quality=qualityFromText(text);
    const finished=isFinishedLoss(text);
    const isLoss=isLossLike(sourceType,object);
    const estimate=penaltyEstimate({phase,quality,finished,upward,isLoss,exception});

    return {
      fighter,
      sourceType,
      label,
      date:date||object.date||null,
      phase,
      quality,
      finished,
      upwardDivision:upward,
      exception,
      isLoss,
      penaltyEstimate:estimate,
      penaltyApplies:isLoss&&estimate!==0&&estimate!==null,
      rule:object.rule||null,
      recovery:object.recovery||null,
      raw:object
    };
  }

  function ledgerEvents(fighter,ledger){
    const lc=ledger?.lossContext||{};
    const events=[];
    if(lc.unrecoveredLoss)events.push(normalizeEvent(fighter,ledger,'unrecoveredLoss',lc.unrecoveredLoss));
    ['recoveredLosses','upwardDivisionLosses','postPrimeLosses','weirdResults'].forEach(sourceType=>{
      const rows=Array.isArray(lc[sourceType])?lc[sourceType]:[];
      rows.forEach(event=>events.push(normalizeEvent(fighter,ledger,sourceType,event)));
    });
    return events;
  }

  function buildRow(fighter){
    const ledger=era.entryFor(fighter);
    if(!ledger)return null;
    const events=ledgerEvents(fighter,ledger);
    const counts={
      totalEvents:events.length,
      lossEvents:events.filter(e=>e.isLoss).length,
      prePrime:events.filter(e=>e.phase==='pre-prime').length,
      prime:events.filter(e=>e.phase==='prime').length,
      postPrime:events.filter(e=>e.phase==='post-prime').length,
      upwardDivision:events.filter(e=>e.upwardDivision).length,
      weirdContext:events.filter(e=>e.exception==='weird/contextual').length,
      unknown:events.filter(e=>e.phase==='unknown').length
    };
    const estimatedPenaltyTotal=events.reduce((sum,event)=>sum+(Number(event.penaltyEstimate)||0),0);
    return {
      fighter,
      status:ledger.status||'review',
      window:{...(ledger.window||{})},
      events,
      counts,
      estimatedPenaltyTotal:Math.round(estimatedPenaltyTotal*100)/100,
      mutatesScores:false
    };
  }

  const fighters=era.names?era.names():Object.keys(era.ledgers||{});
  const rows=fighters.map(buildRow).filter(Boolean);
  const events=rows.flatMap(row=>row.events);

  function entryFor(fighter){
    const target=key(fighter);
    let row=rows.find(item=>key(item.fighter)===target)||null;
    if(row)return row;

    // Canonical fighter registries may extend the roster after this adapter first loads.
    // Build and cache the missing row on demand instead of freezing the original roster.
    row=buildRow(fighter);
    if(!row)return null;
    rows.push(row);
    events.push(...row.events);
    if(!fighters.some(name=>key(name)===target))fighters.push(row.fighter);
    return row;
  }

  function refresh(){
    const names=era.names?era.names():Object.keys(era.ledgers||{});
    names.forEach(entryFor);
    return {fighterCount:fighters.length,rowCount:rows.length,eventCount:events.length};
  }
  function eventsFor(fighter){return entryFor(fighter)?.events||[];}
  function phaseFor(fighter,date){const ledger=era.entryFor(fighter);return phaseFromDate(ledger,date);}
  function report(){refresh();return rows.map(row=>({...row,events:row.events.map(event=>({...event}))}));}

  window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER={
    version:VERSION,
    sourceEraLedgerVersion:era.version,
    rules:RULES,
    fighters,
    rows,
    events,
    entryFor,
    eventsFor,
    phaseFor,
    refresh,
    report,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };

  window.addEventListener('ufc-scoring-pipeline-ready',refresh);
  window.addEventListener('ufc-ranking-data-patches-ready',refresh);
  setTimeout(refresh,0);
  setTimeout(refresh,500);

  document.documentElement.setAttribute('data-loss-context-ledger-adapter',VERSION);
})();
