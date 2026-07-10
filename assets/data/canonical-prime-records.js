// Canonical Prime Record source bound to the locked Fighter Era Ledger.
// Rebuilds roster-facing Prime Record context without changing category scores.
(function(){
  'use strict';
  const VERSION='canonical-prime-records-20260710a-era-window-source';
  const DATA=window.RANKING_DATA;
  const era=window.UFC_FIGHTER_ERA_LEDGERS;

  if(!DATA||!era?.entryFor){
    window.UFC_CANONICAL_PRIME_RECORDS={version:VERSION,error:'Missing RANKING_DATA or UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  // Records changed directly by Cody-approved boundary decisions.
  // Other roster records retain the reviewed RANKING_DATA.primeRecords value and receive the locked Era context.
  const APPROVED_RECORD_OVERRIDES={
    'Dustin Poirier':{record:'7-4, 1 NC',reason:'Justin Gaethje I through Islam Makhachev, inclusive.'},
    'Justin Gaethje':{record:'7-3',reason:'James Vick through Max Holloway, inclusive.'},
    'Israel Adesanya':{record:'8-4',reason:'Kelvin Gastelum through Dricus du Plessis, inclusive.'},
    'Ronda Rousey':{record:'6-2',reason:'Liz Carmouche through Amanda Nunes, inclusive.'},
    'Randy Couture':{record:'12-6',reason:'Vitor Belfort I through Brock Lesnar, inclusive.'}
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function rosterNames(){
    return [...new Set([
      ...(era.names?era.names():Object.keys(era.ledgers||{})),
      ...(DATA.men||[]).map(row=>row?.fighter),
      ...(DATA.women||[]).map(row=>row?.fighter),
      ...(DATA.fighters||[]).map(row=>row?.fighter)
    ].filter(Boolean))];
  }
  function allRowsFor(name){
    const target=key(name),rows=[];
    const push=row=>{if(row&&key(row.fighter)===target)rows.push(row);};
    (DATA.men||[]).forEach(push);
    (DATA.women||[]).forEach(push);
    (DATA.fighters||[]).forEach(push);
    return rows;
  }
  function windowText(ledger){
    const w=ledger?.window||{};
    return `${w.startLabel||w.start||'Start'} → ${w.endLabel||w.end||'Current'}`;
  }
  function parseRecord(record){
    const text=String(record||'').trim();
    const ncMatch=text.match(/(\d+)\s*NC/i);
    const main=text.replace(/,?\s*\d+\s*NC/i,'').trim();
    const nums=(main.match(/\d+/g)||[]).map(Number);
    return {
      wins:nums[0]??null,
      losses:nums[1]??null,
      draws:nums[2]??0,
      ncs:ncMatch?Number(ncMatch[1]):0,
      parsed:nums.length>=2
    };
  }
  function sourceRecordFor(fighter){
    const approved=APPROVED_RECORD_OVERRIDES[fighter];
    if(approved)return {...approved,source:'Cody-approved Era boundary recount'};
    const existing=DATA.primeRecords?.[fighter];
    if(existing?.record)return {record:existing.record,reason:'Existing reviewed Prime Record retained under locked Era context.',source:'RANKING_DATA.primeRecords reviewed value'};
    const row=allRowsFor(fighter).find(item=>item?.primeRecord);
    if(row?.primeRecord)return {record:row.primeRecord,reason:'Roster row fallback retained pending fight-ledger audit.',source:'Roster row fallback'};
    return {record:null,reason:'No Prime Record found.',source:'missing'};
  }

  DATA.primeRecords=DATA.primeRecords||{};
  const entries=rosterNames().map(fighter=>{
    const ledger=era.entryFor(fighter);
    const chosen=sourceRecordFor(fighter);
    const context=windowText(ledger);
    const counts=parseRecord(chosen.record);
    const entry={
      fighter,
      record:chosen.record,
      context,
      counts,
      source:chosen.source,
      reason:chosen.reason,
      eraWindow:{...(ledger?.window||{})},
      windowLocked:!!ledger?.window?.locked,
      recordOverridden:!!APPROVED_RECORD_OVERRIDES[fighter],
      scoreRebuildRequired:!!APPROVED_RECORD_OVERRIDES[fighter],
      version:VERSION
    };

    DATA.primeRecords[fighter]={
      ...(DATA.primeRecords[fighter]||{}),
      record:entry.record,
      context:entry.context,
      wins:counts.wins,
      losses:counts.losses,
      draws:counts.draws,
      ncs:counts.ncs,
      source:entry.source,
      sourceVersion:VERSION,
      eraWindowLocked:entry.windowLocked
    };

    allRowsFor(fighter).forEach(row=>{
      row.primeRecord=entry.record;
      row.primeRecordContext=entry.context;
      row.canonicalPrimeRecordAudit=entry;
      if(entry.scoreRebuildRequired)row.primeDominanceRebuildRequired=true;
    });

    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
      const override=DISPLAY_OVERRIDES[fighter];
      override.snapshotStats={
        ...(override.snapshotStats||{}),
        primeRecord:entry.record,
        primeRecordContext:entry.context,
        canonicalPrimeRecordSource:entry.source
      };
    }
    return entry;
  });

  const byName=new Map(entries.map(entry=>[key(entry.fighter),entry]));
  function entryFor(fighter){return byName.get(key(fighter))||null;}
  function report(){return entries.map(entry=>({...entry,counts:{...entry.counts},eraWindow:{...entry.eraWindow}}));}

  window.UFC_CANONICAL_PRIME_RECORDS={
    version:VERSION,
    source:'Locked Fighter Era Ledger window + reviewed RANKING_DATA Prime Record count',
    fighterCount:entries.length,
    entries,
    entryFor,
    report,
    approvedRecordOverrides:APPROVED_RECORD_OVERRIDES,
    changedRecordFighters:Object.keys(APPROVED_RECORD_OVERRIDES),
    allWindowsLocked:entries.every(entry=>entry.windowLocked),
    mutatesScores:false,
    mutatesPrimeRecordDisplay:true,
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-canonical-prime-records',`${VERSION}-${entries.length}`);
})();
