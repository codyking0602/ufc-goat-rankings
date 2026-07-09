// Loss Context Era Bridge QA.
// Side-by-side review only. Does not mutate scores.
(function(){
  const VERSION='loss-context-era-bridge-20260709b-window-field-fix';
  const DATA=window.RANKING_DATA;
  const PENALTY=window.UFC_PENALTY_SCORE_CORRECTIONS;
  const ERA=window.UFC_FIGHTER_ERA_LEDGERS;
  const ADAPTER=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;
  const norm=name=>String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const round2=value=>{const n=Number(value);return Number.isFinite(n)?Math.round(n*100)/100:null;};
  const eraWindow=entry=>entry?.elitePrimeWindow||entry?.window||null;
  function uniqueRows(){const rows=[];const seen=new Set();const push=(row,source)=>{const fighter=row&&row.fighter;if(!fighter||seen.has(norm(fighter)))return;seen.add(norm(fighter));rows.push({...row,source});};(DATA?.fighters||[]).forEach(row=>push(row,'fighters'));(DATA?.men||[]).forEach(row=>push(row,'men'));(DATA?.women||[]).forEach(row=>push(row,'women'));return rows;}
  function correctionFor(fighter){const corrections=PENALTY?.corrections||{};return corrections[fighter]||Object.entries(corrections).find(([name])=>norm(name)===norm(fighter))?.[1]||null;}
  function eraFor(fighter){if(!ERA)return null;return (ERA.entryFor&&ERA.entryFor(fighter))||ERA.ledgers?.[fighter]||Object.entries(ERA.ledgers||{}).find(([name])=>norm(name)===norm(fighter))?.[1]||null;}
  function adapterFor(fighter){if(!ADAPTER)return null;return (ADAPTER.entryFor&&ADAPTER.entryFor(fighter))||(ADAPTER.rows||[]).find(row=>norm(row.fighter)===norm(fighter))||null;}
  function eraEvents(entry){const ctx=entry?.lossContext||{};const events=[];Object.entries(ctx).forEach(([bucket,value])=>{if(!Array.isArray(value))return;value.forEach(event=>{if(typeof event==='string')events.push({bucket,label:event,date:null,phase:null});else if(event&&typeof event==='object')events.push({bucket,label:event.label||event.opponent||bucket,date:event.date||null,phase:event.phase||event.type||event.rule||null,recovery:event.recovery||null});});});return events;}
  function notesFor(correction,row){return String(correction?.notes||row?.penaltyNotes||row?.penaltyAudit?.notes||'');}
  function hasPostPrimeText(text){return /post[- ]prime|later .*post-prime|treated post-prime/i.test(String(text||''));}
  function bridgeStatus(row,correction,entry,adapterRow){const flags=[];const current=round2(correction?.penalty??row.penalty);const adapterPenalty=round2(adapterRow?.estimatedPenaltyTotal);const win=eraWindow(entry);if(!correction)flags.push('No penalty correction/audit row found.');if(!entry)flags.push('No Era Ledger row found.');if(entry&&!win)flags.push('Era Ledger row found but no readable window field.');if(!adapterRow)flags.push('No era-adapter row available.');if(correction&&adapterRow&&current!==null&&adapterPenalty!==null){const delta=round2(adapterPenalty-current);if(Math.abs(delta)>1.01)flags.push(`Current Penalty and era-only adapter differ by ${delta}. Review cue only.`);}if(correction&&win?.end==null&&hasPostPrimeText(notesFor(correction,row)))flags.push('Penalty notes mention post-prime while Era Ledger is open/current. Verify intent.');return {status:flags.length?'review':'aligned',flags};}
  function buildRow(row){const correction=correctionFor(row.fighter);const entry=eraFor(row.fighter);const adapterRow=adapterFor(row.fighter);const status=bridgeStatus(row,correction,entry,adapterRow);const current=round2(correction?.penalty??row.penalty);const adapterPenalty=round2(adapterRow?.estimatedPenaltyTotal);return {fighter:row.fighter,source:row.source,status:status.status,flags:status.flags,currentPenalty:current,adapterPenalty,delta:current!==null&&adapterPenalty!==null?round2(adapterPenalty-current):null,penaltyNotes:notesFor(correction,row),hasPenaltyCorrection:!!correction,hasEraRow:!!entry,eraWindow:eraWindow(entry),eraLossEvents:eraEvents(entry),adapterEvents:adapterRow?.events||[],correctionVersion:PENALTY?.version||null,eraVersion:ERA?.version||null,adapterVersion:ADAPTER?.version||null};}
  const rows=uniqueRows().map(buildRow);
  const review=rows.filter(row=>row.status==='review');
  const aligned=rows.filter(row=>row.status==='aligned');
  const summary={total:rows.length,aligned:aligned.length,review:review.length,missingPenalty:rows.filter(row=>!row.hasPenaltyCorrection).length,missingEra:rows.filter(row=>!row.hasEraRow).length,missingEraWindow:rows.filter(row=>row.hasEraRow&&!row.eraWindow).length,largeDelta:rows.filter(row=>row.delta!==null&&Math.abs(row.delta)>1.01).length,penaltyVersion:PENALTY?.version||null,eraVersion:ERA?.version||null,adapterVersion:ADAPTER?.version||null,cleanupVersion:window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS?.version||null,cleanupFinalVersion:window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS_FINAL?.version||null};
  window.UFC_LOSS_CONTEXT_ERA_BRIDGE={version:VERSION,summary,rows,review,aligned,report:()=>rows,needsReview:()=>review,entryFor:fighter=>rows.find(row=>norm(row.fighter)===norm(fighter))||null,byStatus:status=>rows.filter(row=>row.status===status),mutatesScores:false,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-loss-context-era-bridge',VERSION);
})();
