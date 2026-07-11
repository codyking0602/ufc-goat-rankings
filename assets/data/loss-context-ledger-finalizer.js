// Final Loss Context ledger cleanup before score reconciliation.
// Normalizes loss-event buckets and reconciles UFC record loss counts to the completed canonical ledgers.
(function(){
  'use strict';
  const VERSION='loss-context-ledger-finalizer-20260710a-record-bucket-reconciliation';
  const DATA=window.RANKING_DATA;
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function objectEvent(event){return typeof event==='string'?{label:event}:({...event});}
  function eventKey(event){const row=objectEvent(event);return `${key(row.label)}|${String(row.date||'')}`;}
  function iso(value){const text=String(value||'');return /^\d{4}-\d{2}-\d{2}$/.test(text)?text:null;}
  function eventText(event){const row=objectEvent(event);return [row.label,row.type,row.phase,row.rule,row.notes].filter(Boolean).join(' ').toLowerCase();}
  function upward(event){return /upward|moved up|higher division|heavyweight swing|flyweight-title/.test(eventText(event));}
  function officialWeirdLoss(event){
    const text=eventText(event);
    if(/no contest|\bnc\b|contextual win|disqualification win|dq win/.test(text))return false;
    return /official[^.]*loss|disqualification[^.]*loss|dq[^.]*loss|contextual loss/.test(text);
  }
  function phaseFor(ledger,event){
    const date=iso(objectEvent(event).date);
    const start=iso(ledger?.window?.start);
    const end=iso(ledger?.window?.end);
    if(!date||!start)return null;
    if(date<start)return 'pre-prime';
    if(end&&date>end)return 'post-prime';
    return 'prime';
  }
  function dedupe(rows,seen){
    const out=[];
    (rows||[]).map(objectEvent).forEach(event=>{
      const id=eventKey(event);
      if(seen.has(id))return;
      seen.add(id);
      out.push(event);
    });
    return out;
  }
  function lossEventCount(lossContext){
    return (lossContext?.unrecoveredLoss?1:0)
      +(lossContext?.recoveredLosses||[]).length
      +(lossContext?.upwardDivisionLosses||[]).length
      +(lossContext?.postPrimeLosses||[]).length;
  }
  function parseRecord(text){
    const match=String(text||'').match(/(\d+)\s*[-–]\s*(\d+)(\s*[-–]\s*\d+)?/);
    if(!match)return null;
    return {wins:Number(match[1]),losses:Number(match[2]),tail:match[3]||'',match:match[0]};
  }
  function replaceLossCount(text,losses){
    const parsed=parseRecord(text);
    if(!parsed)return text;
    return String(text).replace(parsed.match,`${parsed.wins}-${losses}${parsed.tail}`);
  }
  function allDataRows(){return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>row?.fighter);}
  function patchSnapshot(snapshot,record){
    if(!Array.isArray(snapshot))return snapshot;
    return snapshot.map(item=>Array.isArray(item)&&String(item[0]).trim().toLowerCase()==='ufc record'?[item[0],record]:item);
  }
  function patchRecordSurfaces(fighter,record,expectedLosses,reason){
    const target=key(fighter);
    const changed=[];
    allDataRows().forEach(row=>{
      if(key(row.fighter)!==target)return;
      ['ufcRecord','record','ufc_record'].forEach(field=>{
        if(typeof row[field]!=='string')return;
        const next=replaceLossCount(row[field],expectedLosses);
        if(next!==row[field]){changed.push({surface:`RANKING_DATA.${field}`,from:row[field],to:next});row[field]=next;}
      });
      if(Number.isFinite(Number(row.ufcLosses)))row.ufcLosses=expectedLosses;
      if(Number.isFinite(Number(row.ufcWins))){
        const parsed=parseRecord(row.ufcRecord||row.record||row.ufc_record||'');
        const draws=parsed?.tail?Number(String(parsed.tail).replace(/[^0-9]/g,''))||0:0;
        row.scoredUfcFights=Number(row.ufcWins)+expectedLosses+draws;
      }
      row.ufcRecordReconciliation={version:VERSION,record,expectedLosses,reason,appliedAt:new Date().toISOString()};
    });

    const override=typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES[fighter]:null;
    if(override){
      override.snapshot=patchSnapshot(override.snapshot,record);
      override.packetProfileStats={...(override.packetProfileStats||{}),ufcRecord:record};
      if(override.compareProfile?.legacyStats)override.compareProfile.legacyStats.ufcRecord=record;
      override.ufcRecordReconciliation={version:VERSION,record,expectedLosses,reason};
    }
    const compare=window.COMPARE_PROFILES?.[fighter];
    if(compare?.legacyStats)compare.legacyStats.ufcRecord=record;
    const packet=window.UFC_FIGHTER_PACKETS?.[fighter];
    if(packet){
      packet.display={...(packet.display||{}),snapshot:patchSnapshot(packet.display?.snapshot,record)};
      packet.profileStats={...(packet.profileStats||{}),ufcRecord:record};
      if(packet.compareSeasoning?.legacyStats)packet.compareSeasoning.legacyStats.ufcRecord=record;
      if(packet.boardRow){packet.boardRow.ufcRecord=record;packet.boardRow.ufcLosses=expectedLosses;}
      if(packet.profile){packet.profile.ufcRecord=record;packet.profile.ufcLosses=expectedLosses;}
    }
    return changed;
  }

  if(!DATA||!ledgers){
    window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER={version:VERSION,applied:false,error:[!DATA?'Missing RANKING_DATA':null,!ledgers?'Missing Fighter Era ledgers':null].filter(Boolean).join('; '),mutatesScores:false};
    return;
  }

  const bucketRepairs=[];
  const unresolved=[];
  const recordRepairs=[];
  const rosterNames=era.names?era.names():Object.keys(ledgers);

  rosterNames.forEach(fighter=>{
    const ledger=era.entryFor?.(fighter)||ledgers[fighter];
    if(!ledger)return;
    const current=ledger.lossContext||{};
    let unrecovered=current.unrecoveredLoss?objectEvent(current.unrecoveredLoss):null;
    let recovered=(current.recoveredLosses||[]).map(objectEvent);
    let upwardRows=(current.upwardDivisionLosses||[]).map(objectEvent);
    let post=(current.postPrimeLosses||[]).map(objectEvent);
    const weird=(current.weirdResults||[]).map(objectEvent);

    const repaired=[];
    const nextRecovered=[];
    const nextUpward=[];
    const nextPost=[];

    recovered.forEach(event=>{
      const phase=phaseFor(ledger,event);
      if(phase==='post-prime'){nextPost.push(event);repaired.push({event:event.label,from:'recoveredLosses',to:'postPrimeLosses'});}
      else nextRecovered.push(event);
    });
    upwardRows.forEach(event=>{
      const phase=phaseFor(ledger,event);
      if(phase==='post-prime'){nextPost.push(event);repaired.push({event:event.label,from:'upwardDivisionLosses',to:'postPrimeLosses'});}
      else nextUpward.push(event);
    });
    post.forEach(event=>{
      const phase=phaseFor(ledger,event);
      if(phase&&phase!=='post-prime'){
        if(upward(event)){nextUpward.push(event);repaired.push({event:event.label,from:'postPrimeLosses',to:'upwardDivisionLosses'});}
        else{nextRecovered.push(event);repaired.push({event:event.label,from:'postPrimeLosses',to:'recoveredLosses'});}
      }else nextPost.push(event);
    });
    if(unrecovered){
      const phase=phaseFor(ledger,unrecovered);
      if(phase==='post-prime'){
        nextPost.push(unrecovered);
        repaired.push({event:unrecovered.label,from:'unrecoveredLoss',to:'postPrimeLosses'});
        unrecovered=null;
      }
    }

    const seen=new Set();
    if(unrecovered)seen.add(eventKey(unrecovered));
    const cleanUpward=dedupe(nextUpward,seen);
    const cleanPost=dedupe(nextPost,seen);
    const cleanRecovered=dedupe(nextRecovered,seen);
    ledger.lossContext={
      unrecoveredLoss:unrecovered,
      recoveredLosses:cleanRecovered,
      upwardDivisionLosses:cleanUpward,
      postPrimeLosses:cleanPost,
      weirdResults:weird
    };
    ledger.lossContextCompletion={
      ...(ledger.lossContextCompletion||{}),
      finalizerVersion:VERSION,
      completeUfcLossLedger:true,
      bucketReconciled:true,
      completedAt:ledger.lossContextCompletion?.completedAt||new Date().toISOString()
    };
    if(repaired.length)bucketRepairs.push({fighter,repairs:repaired});

    const scoredLosses=lossEventCount(ledger.lossContext);
    const officialExceptions=weird.filter(officialWeirdLoss).length;
    const expectedOfficialLosses=scoredLosses+officialExceptions;
    ledger.lossContextCompletion.scoredLossEvents=scoredLosses;
    ledger.lossContextCompletion.officialLossExceptions=officialExceptions;
    ledger.lossContextCompletion.expectedOfficialUfcLosses=expectedOfficialLosses;

    const row=allDataRows().find(item=>key(item.fighter)===key(fighter));
    const recordText=[row?.ufcRecord,row?.record,row?.ufc_record].find(value=>typeof value==='string'&&parseRecord(value));
    if(!recordText){unresolved.push({fighter,reason:'No machine-readable UFC record string available.'});return;}
    const parsed=parseRecord(recordText);
    const canonicalRecord=replaceLossCount(recordText,expectedOfficialLosses);
    if(parsed.losses!==expectedOfficialLosses){
      const surfaces=patchRecordSurfaces(fighter,canonicalRecord,expectedOfficialLosses,'Completed canonical UFC loss ledger determines the official UFC loss count; contextual DQ losses remain in the official record but outside competitive penalty scoring.');
      recordRepairs.push({fighter,from:recordText,to:canonicalRecord,scoredLosses,officialLossExceptions:officialExceptions,surfaces});
    }
  });

  const report={
    version:VERSION,
    applied:true,
    rosterCount:rosterNames.length,
    expectedRosterCount:62,
    bucketRepairCount:bucketRepairs.length,
    bucketRepairs,
    recordRepairCount:recordRepairs.length,
    recordRepairs,
    unresolvedCount:unresolved.length,
    unresolved,
    complete:rosterNames.length===62&&unresolved.length===0,
    mutatesEraLossEvents:bucketRepairs.length>0,
    mutatesRecords:recordRepairs.length>0,
    mutatesPenalty:false,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER=report;
  era.lossContextLedgerFinalizer=report;
  if(DATA.meta)DATA.meta.lossContextLedgerFinalizer={version:VERSION,rosterCount:report.rosterCount,bucketRepairCount:report.bucketRepairCount,recordRepairCount:report.recordRepairCount,unresolvedCount:report.unresolvedCount,complete:report.complete,appliedAt:report.appliedAt};
  document.documentElement.setAttribute('data-loss-context-ledger-finalizer',`${VERSION}-${recordRepairs.length}-${unresolved.length}`);
})();