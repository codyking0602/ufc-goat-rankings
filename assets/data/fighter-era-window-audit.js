// Roster-wide canonical Prime source and dependent-category mismatch audit.
// Review only: reports disagreements without changing category scores.
(function(){
  'use strict';
  const VERSION='fighter-era-window-audit-20260710b-record-dependencies';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const DATA=window.RANKING_DATA||{};
  const canonicalRecords=window.UFC_CANONICAL_PRIME_RECORDS;
  const primeLedgers=window.UFC_PRIME_DOMINANCE_LEDGERS;
  const roundAudit=window.UFC_PRIME_ROUND_CONTROL_AUDIT;
  const longevity=window.UFC_LONGEVITY_SHADOW_SCORER;
  const lossAdapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;
  const lossLive=window.UFC_LOSS_CONTEXT_LIVE_PROMOTER;

  if(!era?.entryFor){
    window.UFC_FIGHTER_ERA_WINDOW_AUDIT={version:VERSION,error:'Missing UFC_FIGHTER_ERA_LEDGERS',mutatesScores:false};
    return;
  }

  const STOPWORDS=new Set([
    'active','current','championship','champion','title','level','form','elite','prime','run','included','ufc','through','the','and','to','at','of','win','loss','fight','fights','i','ii','iii','iv'
  ]);
  const ALIASES={
    gsp:'st pierre',rda:'dos anjos',rampage:'jackson',jacare:'souza',
    'korean zombie':'jung','mighty mouse':'johnson'
  };

  function normalize(value){
    let text=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    Object.entries(ALIASES).forEach(([from,to])=>{text=text.replace(new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'g'),to);});
    return text.replace(/[’']/g,'').replace(/\b(19|20)\d{2}\b/g,' ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
  }
  function normalizeRecord(value){return String(value||'').toUpperCase().replace(/\s+/g,'').replace(/,/g,'');}
  function tokens(value){return normalize(value).split(' ').filter(token=>token&&token.length>2&&!STOPWORDS.has(token));}
  function isOpen(value){const text=normalize(value);return !text||/(active|current|open)/.test(text);}
  function anchorsMatch(canonical,source){
    const a=tokens(canonical),b=tokens(source);
    if(!a.length||!b.length)return false;
    return a.some(token=>b.includes(token));
  }
  function parseWindowText(value){
    const text=String(value||'').trim();
    if(!text)return {text:'',start:'',end:''};
    const parts=text.split(/\s*(?:→|->|—>|\bthrough\b)\s*/i);
    return {text,start:parts[0]||'',end:parts.slice(1).join(' ')||''};
  }
  function primeEntryFor(fighter){
    return primeLedgers?.entryFor?.(fighter)
      ||primeLedgers?.report?.find?.(entry=>entry.fighter===fighter)
      ||window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report?.find?.(entry=>entry.fighter===fighter)
      ||null;
  }
  function sourceWindowFor(fighter,primeEntry){
    const structured=primeEntry?.primeWindow;
    if(structured&&typeof structured==='object'){
      const start=structured.startLabel||structured.start||'';
      const end=structured.endLabel||structured.end||'';
      return {text:`${start} → ${end||'current'}`,start,end,source:'primeEntry.primeWindow',structured:true};
    }
    if(typeof structured==='string'&&structured.trim())return {...parseWindowText(structured),source:'primeEntry.primeWindow',structured:false};
    const candidates=[
      [primeEntry?.roundControlAudit?.window,'primeEntry.roundControlAudit.window'],
      [roundAudit?.entryFor?.(fighter)?.window,'prime-round-control-audit'],
      [DATA.primeRecords?.[fighter]?.context,'RANKING_DATA.primeRecords.context']
    ];
    const found=candidates.find(([value])=>String(value||'').trim());
    return found?{...parseWindowText(found[0]),source:found[1],structured:false}:{text:'',start:'',end:'',source:null,structured:false};
  }
  function canonicalText(windowRow){return `${windowRow?.startLabel||windowRow?.start||'—'} → ${windowRow?.endLabel||windowRow?.end||'Current'}`;}
  function windowStatus(canonical,source){
    if(!source?.text)return {status:'missing-prime-window',startAligned:false,endAligned:false};
    const startAligned=anchorsMatch(canonical?.startLabel||canonical?.start,source.start);
    const canonicalOpen=!canonical?.end;
    const endAligned=canonicalOpen?isOpen(source.end):anchorsMatch(canonical?.endLabel||canonical?.end,source.end);
    return {status:startAligned&&endAligned?'aligned':'conflict',startAligned,endAligned};
  }
  function lossWindowFor(fighter){
    const entry=lossAdapter?.entryFor?.(fighter);
    const w=entry?.window;
    if(!w)return null;
    if(typeof w==='string')return w;
    return canonicalText(w);
  }

  const rosterNames=[...new Set([
    ...(era.names?era.names():Object.keys(era.ledgers||{})),
    ...(DATA.men||[]).map(row=>row.fighter),
    ...(DATA.women||[]).map(row=>row.fighter)
  ].filter(Boolean))];

  const rows=rosterNames.map(fighter=>{
    const ledger=era.entryFor(fighter);
    const canonical=ledger?.window||null;
    const canonicalRecord=canonicalRecords?.entryFor?.(fighter)||DATA.primeRecords?.[fighter]||null;
    const primeEntry=primeEntryFor(fighter);
    const sourceWindow=sourceWindowFor(fighter,primeEntry);
    const comparison=windowStatus(canonical,sourceWindow);
    const primeRecord=primeEntry?.primeRecord||null;
    const recordAligned=!!canonicalRecord?.record&&!!primeRecord&&normalizeRecord(canonicalRecord.record)===normalizeRecord(primeRecord);
    const longevityEntry=longevity?.entryFor?.(fighter)||null;
    const longevityPending=!!ledger?.longevity?.windowLockedPendingRecalculation;
    const lossWindow=lossWindowFor(fighter);
    const lossComparison=lossWindow?windowStatus(canonical,{...parseWindowText(lossWindow)}):{status:'missing-loss-window',startAligned:false,endAligned:false};
    const lossWindowAligned=lossComparison.status==='aligned';
    return {
      fighter,
      canonicalWindow:canonicalText(canonical),
      canonicalStart:canonical?.start||null,
      canonicalStartLabel:canonical?.startLabel||null,
      canonicalEnd:canonical?.end||null,
      canonicalEndLabel:canonical?.endLabel||null,
      canonicalOpen:!canonical?.end,
      canonicalLocked:!!canonical?.locked,
      canonicalLockVersion:canonical?.lockVersion||null,
      canonicalPrimeRecord:canonicalRecord?.record||null,
      canonicalPrimeRecordSource:canonicalRecord?.source||DATA.primeRecords?.[fighter]?.source||null,
      primeDominancePrimeRecord:primeRecord,
      primeRecordAligned:recordAligned,
      primeRecordStatus:!canonicalRecord?.record?'missing-canonical-record':!primeRecord?'missing-prime-dominance-record':recordAligned?'aligned':'conflict',
      primeWindow:sourceWindow.text||null,
      primeWindowSource:sourceWindow.source,
      primeWindowStructured:sourceWindow.structured,
      startAligned:comparison.startAligned,
      endAligned:comparison.endAligned,
      status:comparison.status,
      primeEntryPresent:!!primeEntry,
      primeDominanceScoreRebuildRequired:!recordAligned||comparison.status!=='aligned'||!!canonicalRecord?.scoreRebuildRequired,
      longevityWindow:longevityEntry?.rawWindowLabel||null,
      longevityInputStatus:longevityPending?'pending-window-recalculation':longevityEntry?'era-ledger-aligned':'missing-longevity-entry',
      longevityPending,
      lossContextWindow:lossWindow,
      lossContextWindowAligned:lossWindowAligned,
      lossContextWindowStatus:lossComparison.status,
      lossContextPenaltySource:lossLive?.launchMode==='locked-current-value'?'manual-locked-not-derived':'ledger-derived-or-missing',
      lossContextRebuildRequired:lossLive?.launchMode==='locked-current-value'||!lossWindowAligned,
      dependentRebuildRequired:!!ledger?.windowDecision?.dependentRebuildRequired,
      windowDecision:ledger?.windowDecision?.decision||null
    };
  });

  const counts=rows.reduce((acc,row)=>{acc[row.status]=(acc[row.status]||0)+1;return acc;},{});
  const conflicts=rows.filter(row=>row.status==='conflict');
  const incomplete=rows.filter(row=>row.status==='missing-prime-window');
  const primeRecordConflicts=rows.filter(row=>row.primeRecordStatus==='conflict');
  const missingPrimeRecords=rows.filter(row=>row.primeRecordStatus.startsWith('missing-'));
  const primeDominanceRebuild=rows.filter(row=>row.primeDominanceScoreRebuildRequired);
  const longevityPending=rows.filter(row=>row.longevityPending||row.longevityInputStatus==='missing-longevity-entry');
  const lossContextRebuild=rows.filter(row=>row.lossContextRebuildRequired);
  const unlocked=rows.filter(row=>!row.canonicalLocked);
  const dependentRebuildNames=[...new Set([
    ...primeDominanceRebuild.map(row=>row.fighter),
    ...longevityPending.map(row=>row.fighter),
    ...lossContextRebuild.map(row=>row.fighter)
  ])];

  function entryFor(fighter){return rows.find(row=>row.fighter===fighter)||null;}
  function report(){return rows.map(row=>({...row}));}

  window.UFC_FIGHTER_ERA_WINDOW_AUDIT={
    version:VERSION,
    sourceEraLedgerVersion:era.version,
    sourceWindowLockVersion:window.UFC_FIGHTER_ERA_WINDOW_LOCK?.version||null,
    sourceCanonicalPrimeRecordVersion:canonicalRecords?.version||null,
    fighterCount:rows.length,
    counts,
    rows,
    conflicts,
    incomplete,
    primeRecordConflicts,
    missingPrimeRecords,
    primeDominanceRebuild,
    longevityPending,
    lossContextRebuild,
    dependentRebuildNames,
    unlocked,
    allCanonicalWindowsLocked:unlocked.length===0&&rows.length===Number(window.UFC_FIGHTER_ERA_WINDOW_LOCK?.fighterCount||rows.length),
    allCanonicalPrimeRecordsPresent:missingPrimeRecords.length===0,
    mutatesScores:false,
    mutatesWindows:false,
    entryFor,
    report,
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-fighter-era-window-audit',`${VERSION}-${conflicts.length}-window-${primeRecordConflicts.length}-record-${longevityPending.length}-longevity`);
  if(conflicts.length||incomplete.length||primeRecordConflicts.length||missingPrimeRecords.length){
    console.warn('[UFC canonical Prime dependency audit]',{
      windowConflicts:conflicts.map(row=>row.fighter),
      missingPrimeWindows:incomplete.map(row=>row.fighter),
      primeRecordConflicts:primeRecordConflicts.map(row=>row.fighter),
      missingPrimeRecords:missingPrimeRecords.map(row=>row.fighter),
      longevityPending:longevityPending.map(row=>row.fighter),
      lossContextRebuildCount:lossContextRebuild.length
    });
  }
})();
