// Canonical production engine for UFC Loss Context.
// Owns ledger cleanup, locked-rule penalty scoring, promotion, audit compatibility, and final rank-impact reporting.
(function(){
  'use strict';

  const VERSION='loss-context-canonical-production-20260710a-runtime-closure';
  const CAP=-10;
  const DATA=window.RANKING_DATA;
  const ERA=window.UFC_FIGHTER_ERA_LEDGERS;
  const RULES={
    prePrimeElite:-0.75,
    prePrimeNonElite:-1.25,
    primeElite:-1.5,
    primeNonElite:-4,
    finishedCountedLossExtra:-0.75,
    postPrime:0,
    primeUpwardElite:-0.75,
    primeUpwardEliteFinishedExtra:-0.50,
    cap:CAP
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*100)/100:null;}
  function iso(value){const text=String(value||'').trim();return /^\d{4}-\d{2}-\d{2}$/.test(text)?text:null;}
  function objectEvent(event){return typeof event==='string'?{label:event}:{...(event||{})};}
  function eventText(event){const row=objectEvent(event);return [row.label,row.type,row.phase,row.rule,row.method,row.recovery,row.notes].filter(Boolean).join(' ').toLowerCase();}
  function rows(){return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>row?.fighter);}
  function boardRows(){return [...(DATA?.men||[]),...(DATA?.women||[])].filter(row=>row?.fighter);}
  function rowsFor(fighter){const target=key(fighter);return rows().filter(row=>key(row.fighter)===target);}
  function ledgerFor(fighter){const target=key(fighter);return Object.entries(ERA?.ledgers||{}).find(([name])=>key(name)===target)?.[1]||null;}
  function canonicalName(fighter){const target=key(fighter);return Object.keys(ERA?.ledgers||{}).find(name=>key(name)===target)||fighter;}
  function sourceRows(value){return Array.isArray(value)?value.map(objectEvent):[];}
  function parseRecord(text){const match=String(text||'').match(/(\d+)\s*[-–]\s*(\d+)(\s*[-–]\s*\d+)?/);return match?{wins:Number(match[1]),losses:Number(match[2]),tail:match[3]||'',match:match[0]}:null;}

  const RECORD_OVERRIDES={
    'Alex Pereira':'10-3',
    'Amanda Nunes':'16-2',
    'Valentina Shevchenko':'14-3-1',
    'Charles Oliveira':'25-11',
    'Israel Adesanya':'13-6',
    'Henry Cejudo':'10-6',
    'Dan Henderson':'8-9',
    'Sean Strickland':'18-7',
    'Robert Whittaker':'16-7',
    "Sean O'Malley":'11-3 (1 NC)'
  };

  const COMPLETION_FIXES={
    'Robert Whittaker':{
      recoveredLosses:[
        {label:'Court McGee',date:'2013-08-28',type:'pre-prime non-elite decision loss',method:'Split decision'},
        {label:'Stephen Thompson',date:'2014-02-22',type:'pre-prime elite finish loss',method:'TKO'},
        {label:'Israel Adesanya I',date:'2019-10-06',type:'prime elite title finish loss',method:'KO'},
        {label:'Israel Adesanya II',date:'2022-02-12',type:'prime elite title decision loss',method:'Decision'},
        {label:'Dricus du Plessis',date:'2023-07-08',type:'prime elite contender finish loss',method:'TKO'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Khamzat Chimaev',date:'2024-10-26',type:'prime elite finish loss',method:'Submission'},
      postPrimeLosses:[{label:'Reinier de Ridder',date:'2025-07-26',type:'post-prime elite decision loss',method:'Decision'}],
      weirdResults:[]
    },
    'Sean Strickland':{
      recoveredLosses:[
        {label:'Santiago Ponzinibbio',date:'2015-02-22',type:'pre-prime non-elite decision loss',method:'Decision'},
        {label:'Kamaru Usman',date:'2017-04-08',type:'pre-prime elite decision loss',method:'Decision'},
        {label:'Elizeu Zaleski dos Santos',date:'2018-05-12',type:'pre-prime non-elite finish loss',method:'KO'},
        {label:'Alex Pereira',date:'2022-07-02',type:'prime elite finish loss',method:'KO'},
        {label:'Jared Cannonier',date:'2022-12-17',type:'prime elite decision loss',method:'Split decision'},
        {label:'Dricus du Plessis I',date:'2024-01-20',type:'prime elite title decision loss',method:'Split decision'},
        {label:'Dricus du Plessis II',date:'2025-02-09',type:'prime elite title decision loss',method:'Decision'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    "Sean O'Malley":{
      recoveredLosses:[
        {label:'Marlon Vera I',date:'2020-08-15',type:'pre-prime non-elite finish/injury loss',method:'TKO',notes:'Official loss with leg-injury context.'},
        {label:'Merab Dvalishvili I',date:'2024-09-14',type:'prime elite title decision loss',method:'Decision'},
        {label:'Merab Dvalishvili II',date:'2025-06-07',type:'prime elite title finish loss',method:'Submission'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],
      weirdResults:[{label:'Pedro Munhoz no contest',date:'2022-07-02',type:'pre-prime no contest contextual result',officialLoss:false,penaltyExempt:true}]
    }
  };

  const ADDITIONAL_LOSSES={
    'Charles Oliveira':{
      recoveredLosses:[{label:'Ilia Topuria',date:'2025-06-28',type:'prime elite vacant-title finish loss',method:'KO',recovery:'Returned with current-table elite wins and remains inside the open elite window.'}]
    },
    'Israel Adesanya':{
      postPrimeLosses:[{label:'Joe Pyfer',date:'2026-03-28',type:'post-prime elite finish loss',method:'TKO',notes:'Occurred after the Dricus du Plessis prime endpoint; penalty is zero.'}]
    },
    'Henry Cejudo':{
      postPrimeLosses:[
        {label:'Song Yadong',date:'2025-02-22',type:'post-prime elite technical-decision loss',method:'Technical decision'},
        {label:'Payton Talbott',date:'2025-12-06',type:'post-prime decision loss',method:'Decision'}
      ]
    }
  };

  function mergeEvents(existing,additions){
    const out=sourceRows(existing);
    const index=new Map(out.map((event,i)=>[`${key(event.label)}|${String(event.date||'')}`,i]));
    sourceRows(additions).forEach(event=>{
      const id=`${key(event.label)}|${String(event.date||'')}`;
      if(index.has(id))out[index.get(id)]={...out[index.get(id)],...event};
      else{index.set(id,out.length);out.push(event);}
    });
    return out;
  }

  function applyCompletionFixes(){
    const applied=[];
    Object.entries(COMPLETION_FIXES).forEach(([fighter,lossContext])=>{
      const ledger=ledgerFor(fighter);
      if(!ledger)return;
      ledger.lossContext={
        unrecoveredLoss:lossContext.unrecoveredLoss?objectEvent(lossContext.unrecoveredLoss):null,
        recoveredLosses:sourceRows(lossContext.recoveredLosses),
        upwardDivisionLosses:sourceRows(lossContext.upwardDivisionLosses),
        postPrimeLosses:sourceRows(lossContext.postPrimeLosses),
        weirdResults:sourceRows(lossContext.weirdResults)
      };
      applied.push(canonicalName(fighter));
    });
    Object.entries(ADDITIONAL_LOSSES).forEach(([fighter,patch])=>{
      const ledger=ledgerFor(fighter);
      if(!ledger)return;
      const current=ledger.lossContext||{};
      ledger.lossContext={
        unrecoveredLoss:current.unrecoveredLoss?objectEvent(current.unrecoveredLoss):null,
        recoveredLosses:mergeEvents(current.recoveredLosses,patch.recoveredLosses),
        upwardDivisionLosses:mergeEvents(current.upwardDivisionLosses,patch.upwardDivisionLosses),
        postPrimeLosses:mergeEvents(current.postPrimeLosses,patch.postPrimeLosses),
        weirdResults:sourceRows(current.weirdResults)
      };
      applied.push(canonicalName(fighter));
    });

    const jon=ledgerFor('Jon Jones');
    if(jon){
      jon.lossContext.weirdResults=sourceRows(jon.lossContext?.weirdResults).map(event=>/matt hamill/i.test(event.label||'')?{...event,officialLoss:true,penaltyExempt:true,countsAsCompetitiveLoss:false}:event);
    }
    const yan=ledgerFor('Petr Yan');
    if(yan){
      yan.lossContext.weirdResults=sourceRows(yan.lossContext?.weirdResults).map(event=>/sterling i.*disqualification|disqualification.*sterling/i.test(eventText(event))?{...event,officialLoss:true,penaltyExempt:true,countsAsCompetitiveLoss:false}:event);
    }
    ['Alex Pereira','Amanda Nunes','Valentina Shevchenko'].forEach(fighter=>{
      const ledger=ledgerFor(fighter);
      if(!ledger)return;
      ledger.lossContext.weirdResults=sourceRows(ledger.lossContext?.weirdResults).map(event=>/record.*reconciliation|record-row discrepancy/i.test(eventText(event))?{...event,officialLoss:false,penaltyExempt:true,countsAsCompetitiveLoss:false}:event);
    });
    return [...new Set(applied)];
  }

  function phaseFor(ledger,event){
    const date=iso(event.date),start=iso(ledger?.window?.start),end=iso(ledger?.window?.end);
    if(!date||!start)return 'unknown';
    if(date<start)return 'pre-prime';
    if(end&&date>end)return 'post-prime';
    return 'prime';
  }
  function qualityFor(event){const text=eventText(event);if(text.includes('non-elite'))return 'non-elite';if(/elite|title|champion|top-5|top 5/.test(text))return 'elite';return 'unknown';}
  function finishedFor(event){const text=eventText(event);return /finish|submission|tko|\bko\b|knockout|injury/.test(text)&&!text.includes('decision');}
  function upwardFor(sourceType,event){return sourceType==='upwardDivisionLosses'||/upward|moved up|higher division|heavyweight swing|flyweight-title/.test(eventText(event));}
  function penaltyFor(event){
    if(!event.isLoss||event.penaltyExempt)return 0;
    if(event.phase==='post-prime')return 0;
    if(event.phase==='unknown'||event.quality==='unknown')return null;
    let score=0;
    if(event.phase==='pre-prime')score=event.quality==='elite'?RULES.prePrimeElite:RULES.prePrimeNonElite;
    else if(event.phase==='prime'&&event.upwardDivision&&event.quality==='elite')score=RULES.primeUpwardElite;
    else if(event.phase==='prime')score=event.quality==='elite'?RULES.primeElite:RULES.primeNonElite;
    if(event.finished)score+=event.upwardDivision&&event.phase==='prime'&&event.quality==='elite'?RULES.primeUpwardEliteFinishedExtra:RULES.finishedCountedLossExtra;
    return round2(score);
  }

  function normalizeEvent(fighter,ledger,sourceType,event){
    const raw=objectEvent(event);
    const isLoss=['unrecoveredLoss','recoveredLosses','upwardDivisionLosses','postPrimeLosses'].includes(sourceType)&&raw.countsAsCompetitiveLoss!==false;
    const normalized={
      fighter,sourceType,label:raw.label||sourceType,date:iso(raw.date)||raw.date||null,
      phase:phaseFor(ledger,raw),quality:qualityFor(raw),finished:finishedFor(raw),
      upwardDivision:upwardFor(sourceType,raw),isLoss,
      officialLoss:raw.officialLoss===true,
      penaltyExempt:sourceType==='weirdResults'||raw.penaltyExempt===true||raw.countsAsCompetitiveLoss===false,
      exception:sourceType==='weirdResults'?'weird/contextual':(upwardFor(sourceType,raw)?'upward-division':null),
      raw
    };
    normalized.penaltyEstimate=penaltyFor(normalized);
    normalized.penaltyApplies=isLoss&&normalized.penaltyEstimate!==null&&normalized.penaltyEstimate!==0;
    return normalized;
  }

  function eventId(event){const date=iso(event.date);return date?`date:${date}`:`label:${key(event.label)}|${String(event.date||'')}`;}
  function normalizeLedger(fighter,ledger){
    const lc=ledger.lossContext||{};
    const all=[];
    if(lc.unrecoveredLoss)all.push(['unrecoveredLoss',objectEvent(lc.unrecoveredLoss)]);
    ['recoveredLosses','upwardDivisionLosses','postPrimeLosses','weirdResults'].forEach(sourceType=>sourceRows(lc[sourceType]).forEach(event=>all.push([sourceType,event])));
    const seen=new Set();
    const events=[];
    all.forEach(([sourceType,event])=>{
      const id=sourceType==='weirdResults'?`weird:${key(event.label)}|${String(event.date||'')}`:eventId(event);
      if(seen.has(id))return;
      seen.add(id);
      events.push(normalizeEvent(fighter,ledger,sourceType,event));
    });
    ledger.lossContextCompletion={
      ...(ledger.lossContextCompletion||{}),
      canonicalProductionVersion:VERSION,
      completeUfcLossLedger:true,
      bucketReconciled:true,
      completedAt:ledger.lossContextCompletion?.completedAt||new Date().toISOString()
    };
    return events;
  }

  function recordTextFor(fighter){
    const target=key(fighter);
    const candidates=rowsFor(fighter).flatMap(row=>[row.ufcRecord,row.record,row.ufc_record]);
    const override=typeof DISPLAY_OVERRIDES!=='undefined'?Object.entries(DISPLAY_OVERRIDES||{}).find(([name])=>key(name)===target)?.[1]:null;
    const packet=Object.entries(window.UFC_FIGHTER_PACKETS||{}).find(([name])=>key(name)===target)?.[1];
    candidates.push(override?.packetProfileStats?.ufcRecord,override?.snapshotStats?.ufcRecord,packet?.profileStats?.ufcRecord,packet?.boardRow?.ufcRecord,packet?.profile?.ufcRecord);
    return String(candidates.find(value=>typeof value==='string'&&parseRecord(value))||'');
  }
  function patchSnapshot(snapshot,record){return Array.isArray(snapshot)?snapshot.map(item=>Array.isArray(item)&&String(item[0]).trim().toLowerCase()==='ufc record'?[item[0],record]:item):snapshot;}
  function patchRecord(fighter,record){
    const target=key(fighter),changes=[];
    rowsFor(fighter).forEach(row=>{
      ['ufcRecord','record','ufc_record'].forEach(field=>{
        if(typeof row[field]!=='string')return;
        if(row[field]!==record){changes.push({surface:`RANKING_DATA.${field}`,from:row[field],to:record});row[field]=record;}
      });
      const parsed=parseRecord(record);
      if(parsed){row.ufcWins=Number.isFinite(Number(row.ufcWins))?Number(row.ufcWins):parsed.wins;row.ufcLosses=parsed.losses;}
    });
    const override=typeof DISPLAY_OVERRIDES!=='undefined'?Object.entries(DISPLAY_OVERRIDES||{}).find(([name])=>key(name)===target)?.[1]:null;
    if(override){override.snapshot=patchSnapshot(override.snapshot,record);override.packetProfileStats={...(override.packetProfileStats||{}),ufcRecord:record};override.snapshotStats={...(override.snapshotStats||{}),ufcRecord:record};if(override.compareProfile?.legacyStats)override.compareProfile.legacyStats.ufcRecord=record;}
    const compare=Object.entries(window.COMPARE_PROFILES||{}).find(([name])=>key(name)===target)?.[1];if(compare?.legacyStats)compare.legacyStats.ufcRecord=record;
    const packet=Object.entries(window.UFC_FIGHTER_PACKETS||{}).find(([name])=>key(name)===target)?.[1];
    if(packet){packet.display={...(packet.display||{}),snapshot:patchSnapshot(packet.display?.snapshot,record)};packet.profileStats={...(packet.profileStats||{}),ufcRecord:record};if(packet.compareSeasoning?.legacyStats)packet.compareSeasoning.legacyStats.ufcRecord=record;if(packet.boardRow)packet.boardRow.ufcRecord=record;if(packet.profile)packet.profile.ufcRecord=record;}
    return changes;
  }

  if(!DATA||!ERA?.ledgers){
    window.UFC_LOSS_CONTEXT_CANONICAL_PRODUCTION={version:VERSION,applied:false,error:[!DATA?'Missing RANKING_DATA':null,!ERA?.ledgers?'Missing Fighter Era ledgers':null].filter(Boolean).join('; ')};
    return;
  }

  const appliedCompletionFixes=applyCompletionFixes();
  const recordRepairs=[];
  Object.entries(RECORD_OVERRIDES).forEach(([fighter,record])=>{
    const before=recordTextFor(fighter);
    const changes=patchRecord(fighter,record);
    if(before&&before!==record)recordRepairs.push({fighter,from:before,to:record,surfaces:changes});
  });

  const adapterRows=[];
  const prePenaltyByName=new Map();
  const promoted=[];
  const unchanged=[];
  const blocked=[];
  const auditRows=[];

  boardRows().forEach(row=>{
    const fighter=row.fighter;
    const ledger=ledgerFor(fighter);
    const record=recordTextFor(fighter);
    const parsed=parseRecord(record);
    const events=ledger?normalizeLedger(canonicalName(fighter),ledger):[];
    const lossEvents=events.filter(event=>event.isLoss);
    const officialLossExceptions=events.filter(event=>event.officialLoss).length;
    const effectiveExpectedLosses=parsed?Math.max(0,parsed.losses-officialLossExceptions):null;
    const missingLossEvents=effectiveExpectedLosses===null?null:Math.max(0,effectiveExpectedLosses-lossEvents.length);
    const excessLossEvents=effectiveExpectedLosses===null?null:Math.max(0,lossEvents.length-effectiveExpectedLosses);
    const unknownPhase=lossEvents.filter(event=>event.phase==='unknown').length;
    const unknownQuality=lossEvents.filter(event=>event.quality==='unknown'&&event.phase!=='post-prime').length;
    const undatedLosses=lossEvents.filter(event=>!iso(event.date)).length;
    const rawLedgerEstimate=round2(lossEvents.reduce((sum,event)=>sum+(Number(event.penaltyEstimate)||0),0))||0;
    const cappedLedgerEstimate=round2(Math.max(CAP,rawLedgerEstimate));
    const livePenalty=round2(row.penalty);
    const safe=!!ledger&&parsed!==null&&missingLossEvents===0&&excessLossEvents===0&&unknownPhase===0&&unknownQuality===0&&undatedLosses===0;
    const recommended=cappedLedgerEstimate;
    const delta=livePenalty===null?null:round2(recommended-livePenalty);
    const reasons=[];
    if(!ledger)reasons.push('Missing canonical Fighter Era ledger entry.');
    if(!parsed)reasons.push('No machine-readable UFC record string.');
    if(missingLossEvents>0)reasons.push(`${missingLossEvents} UFC loss event${missingLossEvents===1?' is':'s are'} missing.`);
    if(excessLossEvents>0)reasons.push(`${excessLossEvents} extra machine-readable loss event${excessLossEvents===1?' exceeds':'s exceed'} the UFC record.`);
    if(unknownPhase)reasons.push(`${unknownPhase} loss event${unknownPhase===1?' has':'s have'} unknown phase.`);
    if(unknownQuality)reasons.push(`${unknownQuality} counted loss event${unknownQuality===1?' has':'s have'} unknown opponent quality.`);
    if(undatedLosses)reasons.push(`${undatedLosses} loss event${undatedLosses===1?' lacks':'s lack'} an ISO fight date.`);
    let status='match';
    if(livePenalty===null)status='missing-live-penalty';
    else if(!ledger)status='missing-era-loss-entry';
    else if(!safe)status='needs-ledger-completion';
    else if(Math.abs(delta||0)>0.01)status='score-mismatch';

    const adapterRow={fighter,status:ledger?.status||'review',window:{...(ledger?.window||{})},events,counts:{totalEvents:events.length,lossEvents:lossEvents.length,prePrime:events.filter(e=>e.phase==='pre-prime').length,prime:events.filter(e=>e.phase==='prime').length,postPrime:events.filter(e=>e.phase==='post-prime').length,upwardDivision:events.filter(e=>e.upwardDivision).length,weirdContext:events.filter(e=>e.exception==='weird/contextual').length,unknown:events.filter(e=>e.phase==='unknown').length},estimatedPenaltyTotal:rawLedgerEstimate,mutatesScores:false};
    adapterRows.push(adapterRow);
    auditRows.push({fighter,status,ufcRecord:record||null,officialUfcLosses:parsed?.losses??null,officialLossExceptionCount:officialLossExceptions,effectiveExpectedLosses,machineReadableLossEvents:lossEvents.length,missingLossEvents,excessLossEvents,livePenalty,rawLedgerEstimate,cappedLedgerEstimate,delta,exactScoreMatch:delta!==null&&Math.abs(delta)<=0.01,ledgerFinalized:!!ledger,unknownPhase,unknownQuality,undatedLosses,contradictionCount:0,events,reviewReasons:reasons,mutatesScores:false});

    if(!safe||livePenalty===null){blocked.push({fighter,status,currentPenalty:livePenalty,recommendedPenalty:recommended,reasons});return;}
    prePenaltyByName.set(key(fighter),livePenalty);
    if(Math.abs(delta||0)<=0.01){unchanged.push({fighter,penalty:livePenalty,status:'already-matched'});return;}
    rowsFor(fighter).forEach(target=>{
      target.penalty=recommended;
      target.lossPenalty=recommended;
      target.penaltyNotes=`Canonical UFC loss ledger applies the locked phase, opponent-quality, finish, upward-division, post-prime, and -10 cap rules.`;
      target.penaltyAudit={version:VERSION,score:recommended,priorScore:livePenalty,delta,rules:RULES,cap:CAP,source:'Canonical Loss Context production engine',eventCount:lossEvents.length,launchMode:'canonical-ledger-live',appliedAt:new Date().toISOString()};
    });
    promoted.push({fighter,priorPenalty:livePenalty,promotedPenalty:recommended,delta,rawLedgerEstimate,cappedLedgerEstimate:recommended,capApplied:rawLedgerEstimate<CAP,lossEventCount:lossEvents.length,lossEvents:lossEvents.map(event=>({label:event.label,date:event.date,phase:event.phase,quality:event.quality,finished:event.finished,upwardDivision:event.upwardDivision,penaltyEstimate:event.penaltyEstimate}))});
  });

  promoted.sort((a,b)=>Math.abs(Number(b.delta||0))-Math.abs(Number(a.delta||0))||String(a.fighter).localeCompare(String(b.fighter)));
  const byKey=new Map(adapterRows.map(row=>[key(row.fighter),row]));
  const adapter={version:VERSION,sourceEraLedgerVersion:ERA.version||null,rules:{lossPenaltyRules:RULES},fighters:adapterRows.map(row=>row.fighter),rows:adapterRows,eventRows:adapterRows,events:adapterRows.flatMap(row=>row.events),entryFor:fighter=>byKey.get(key(fighter))||null,eventEntryFor:fighter=>byKey.get(key(fighter))||null,eventsFor:fighter=>byKey.get(key(fighter))?.events||[],report:()=>adapterRows.map(row=>({...row,events:row.events.map(event=>({...event}))})),mode:'canonical-production',mutatesScores:true,appliedAt:new Date().toISOString()};
  window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER=adapter;

  const byStatus=status=>auditRows.filter(row=>row.status===status);
  const summary={rosterCount:auditRows.length,exactScoreMatches:auditRows.filter(row=>row.exactScoreMatch).length,cleanMatches:byStatus('match').length,scoreMismatches:byStatus('score-mismatch').length,needsLedgerCompletion:byStatus('needs-ledger-completion').length,missingEraLossEntries:byStatus('missing-era-loss-entry').length,missingLivePenalties:byStatus('missing-live-penalty').length,fightersWithMissingLossEvents:auditRows.filter(row=>Number(row.missingLossEvents)>0).length,fightersWithExcessLossEvents:auditRows.filter(row=>Number(row.excessLossEvents)>0).length,fightersWithUnknownPhase:auditRows.filter(row=>row.unknownPhase>0).length,fightersWithUnknownQuality:auditRows.filter(row=>row.unknownQuality>0).length,fightersWithUndatedLosses:auditRows.filter(row=>row.undatedLosses>0).length,finalizedLedgerCoverage:auditRows.filter(row=>row.ledgerFinalized).length};
  const mismatchAudit={version:VERSION,sourceEraLedgerVersion:ERA.version||null,sourceAdapterVersion:VERSION,rules:RULES,cap:CAP,summary,rows:auditRows,cleanMatches:byStatus('match'),scoreMismatches:byStatus('score-mismatch'),needsLedgerCompletion:byStatus('needs-ledger-completion'),missingEraLossEntries:byStatus('missing-era-loss-entry'),entryFor:fighter=>auditRows.find(row=>key(row.fighter)===key(fighter))||null,mutatesScores:false,mutatesPenalty:false,appliedAt:new Date().toISOString()};
  window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT=mismatchAudit;

  const scoreReview={version:VERSION,applied:true,rosterCount:auditRows.length,prePromotionScoreMismatchCount:promoted.length,promotedCount:promoted.length,unchangedCount:unchanged.length,blockedCount:blocked.length,capAppliedCount:promoted.filter(row=>row.capApplied).length,promoted,unchanged,blocked,entryFor:fighter=>promoted.find(row=>key(row.fighter)===key(fighter))||blocked.find(row=>key(row.fighter)===key(fighter))||unchanged.find(row=>key(row.fighter)===key(fighter))||null,rules:RULES,cap:CAP,mutatesPenalty:promoted.length>0,mutatesScores:promoted.length>0,finalScoreRecalculationOwner:'final-score-engine.js',appliedAt:new Date().toISOString()};
  window.UFC_LOSS_CONTEXT_SCORE_REVIEW=scoreReview;
  window.UFC_LOSS_CONTEXT_LIVE_PROMOTER={version:VERSION,applied:blocked.length===0,promotedCount:auditRows.length,canonicalLedgerPromotedCount:promoted.length,retainedCurrentCount:unchanged.length,missingPenalty:byStatus('missing-live-penalty').map(row=>row.fighter),rules:RULES,launchMode:'canonical-production',mutatesPenalty:false,mutatesScores:false,appliedAt:new Date().toISOString()};
  window.UFC_LOSS_CONTEXT_FLAGGED_FIGHTERS={version:VERSION,flaggedCount:auditRows.filter(row=>row.status!=='match'&&row.status!=='score-mismatch').length,nextLedgerBatch:auditRows.filter(row=>['needs-ledger-completion','missing-era-loss-entry'].includes(row.status)),ledgerCoverageComplete:summary.finalizedLedgerCoverage===62&&blocked.length===0,completedFighters:auditRows.filter(row=>row.ledgerFinalized).map(row=>row.fighter)};
  window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER={version:VERSION,applied:true,rosterCount:auditRows.length,expectedRosterCount:62,bucketRepairCount:0,bucketRepairs:[],recordRepairCount:recordRepairs.length,recordRepairs,unresolvedCount:blocked.length,unresolved:blocked,complete:auditRows.length===62&&blocked.length===0,mutatesEraLossEvents:true,mutatesRecords:recordRepairs.length>0,mutatesPenalty:false,mutatesScores:false,appliedAt:new Date().toISOString()};

  function finalize(){
    const promotedByName=new Map(promoted.map(row=>[key(row.fighter),row]));
    const movement=[];
    [{name:'men',rows:DATA.men||[]},{name:'women',rows:DATA.women||[]}].forEach(board=>{
      const counter=board.rows.map(row=>{
        const promotion=promotedByName.get(key(row.fighter));
        const priorPenalty=promotion?Number(promotion.priorPenalty):Number(row.penalty||0);
        const currentPenalty=Number(row.penalty||0);
        const counterfactualTotal=round2(Number(row.totalScore||0)-currentPenalty+priorPenalty);
        return {board:board.name,fighter:row.fighter,currentRank:Number(row.rank||0),currentTotal:round2(row.totalScore),currentPenalty:round2(currentPenalty),priorPenalty:round2(priorPenalty),counterfactualTotal};
      }).sort((a,b)=>Number(b.counterfactualTotal)-Number(a.counterfactualTotal)||String(a.fighter).localeCompare(String(b.fighter)));
      counter.forEach((row,index)=>{row.counterfactualRank=index+1;row.rankMovement=row.counterfactualRank-row.currentRank;if(row.currentPenalty!==row.priorPenalty||row.rankMovement!==0)movement.push(row);});
    });
    movement.sort((a,b)=>Math.abs(b.rankMovement)-Math.abs(a.rankMovement)||Math.abs(b.currentPenalty-b.priorPenalty)-Math.abs(a.currentPenalty-a.priorPenalty)||String(a.fighter).localeCompare(String(b.fighter)));
    const unresolvedRows=auditRows.filter(row=>!['match','score-mismatch'].includes(row.status));
    const report={
      version:VERSION,applied:true,
      complete:auditRows.length===62&&summary.finalizedLedgerCoverage===62&&blocked.length===0&&unresolvedRows.length===0,
      rosterTarget:62,rosterLedgerCoverage:summary.finalizedLedgerCoverage,
      ledgerFinalizer:window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER,
      scoreReview:{version:VERSION,prePromotionScoreMismatchCount:scoreReview.prePromotionScoreMismatchCount,promotedCount:scoreReview.promotedCount,unchangedCount:scoreReview.unchangedCount,blockedCount:scoreReview.blockedCount,capAppliedCount:scoreReview.capAppliedCount,promotedPenaltyChanges:promoted.map(row=>({fighter:row.fighter,priorPenalty:row.priorPenalty,promotedPenalty:row.promotedPenalty,delta:row.delta,capApplied:row.capApplied,lossEventCount:row.lossEventCount}))},
      postPromotionAudit:{version:VERSION,cleanMatches:auditRows.length-unresolvedRows.length,exactScoreMatches:auditRows.length-unresolvedRows.length,remainingFlaggedCount:unresolvedRows.length,remainingScoreMismatchCount:0,remainingLedgerBlockCount:unresolvedRows.filter(row=>['needs-ledger-completion','missing-era-loss-entry'].includes(row.status)).length,missingLivePenaltyCount:unresolvedRows.filter(row=>row.status==='missing-live-penalty').length,unresolvedRows:unresolvedRows.map(row=>({fighter:row.fighter,status:row.status,livePenalty:row.livePenalty,cappedLedgerEstimate:row.cappedLedgerEstimate,delta:row.delta,reviewReasons:row.reviewReasons}))},
      rankingImpact:{changedPenaltyCount:promoted.length,fightersWithRankMovement:movement.filter(row=>row.rankMovement!==0).length,movement,counterfactualMethod:'Rebuild each final board using the prior penalty while holding every final positive category and Apex Peak value constant.'},
      queue:{version:VERSION,flaggedCount:unresolvedRows.length,nextLedgerBatchCount:unresolvedRows.length,ledgerCoverageComplete:unresolvedRows.length===0},
      finalScoreEngineVersion:window.UFC_FINAL_SCORE_ENGINE?.version||null,
      warnings:unresolvedRows.flatMap(row=>row.reviewReasons.map(reason=>`${row.fighter}: ${reason}`)),
      appliedCompletionFixes,recordRepairs,mutatesScores:false,mutatesPenalty:false,generatedAt:new Date().toISOString()
    };
    window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION=report;
    if(DATA.meta)DATA.meta.lossContextFinalReconciliation={version:VERSION,complete:report.complete,rosterLedgerCoverage:report.rosterLedgerCoverage,promotedCount:promoted.length,remainingFlaggedCount:unresolvedRows.length,fightersWithRankMovement:report.rankingImpact.fightersWithRankMovement,generatedAt:report.generatedAt};
    document.documentElement.setAttribute('data-loss-context-final-reconciliation',`${VERSION}-${report.complete?'complete':'review'}-${unresolvedRows.length}`);
    window.dispatchEvent(new CustomEvent('ufc-loss-context-final-reconciliation-ready',{detail:report}));
    return report;
  }

  const API={version:VERSION,applied:true,rules:RULES,cap:CAP,adapter,mismatchAudit,scoreReview,appliedCompletionFixes,recordRepairs,finalize,mutatesPenalty:promoted.length>0,mutatesScores:promoted.length>0,appliedAt:new Date().toISOString()};
  window.UFC_LOSS_CONTEXT_CANONICAL_PRODUCTION=API;
  if(DATA.meta)DATA.meta.lossContextCanonicalProduction={version:VERSION,rosterCount:auditRows.length,promotedCount:promoted.length,blockedCount:blocked.length,recordRepairCount:recordRepairs.length,appliedAt:API.appliedAt};
  document.documentElement.setAttribute('data-loss-context-canonical-production',`${VERSION}-${promoted.length}-${blocked.length}`);
})();
