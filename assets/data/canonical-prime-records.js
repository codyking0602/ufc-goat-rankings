// Canonical Prime Record source bound to the locked Fighter Era Ledger.
// Rebuilds roster-facing Prime Record context without directly changing category scores.
(function(){
  'use strict';
  const VERSION='canonical-prime-records-20260713a-normalized-roster';
  const PRIME_REBUILD_VERSION='prime-dominance-shadow-model-20260710d-chuck-vitor-window';
  const DATA=window.RANKING_DATA;
  const era=window.UFC_FIGHTER_ERA_LEDGERS;

  if(!DATA||!era?.entryFor){
    window.UFC_CANONICAL_PRIME_RECORDS={version:VERSION,error:'Missing RANKING_DATA or UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  // Fight-by-fight recounts for the five Cody-approved boundary changes.
  const APPROVED_RECORD_OVERRIDES={
    'Dustin Poirier':{record:'8-4',reason:'Justin Gaethje I through Islam Makhachev, inclusive.'},
    'Justin Gaethje':{record:'7-3',reason:'James Vick through Max Holloway, inclusive.'},
    'Israel Adesanya':{record:'8-4',reason:'Kelvin Gastelum through Dricus du Plessis, inclusive.'},
    'Ronda Rousey':{record:'6-2',reason:'Liz Carmouche through Amanda Nunes, inclusive.'},
    'Randy Couture':{record:'11-6',reason:'Vitor Belfort I through Brock Lesnar, inclusive; UFC fights only.'},
    'Chuck Liddell':{record:'9-2',reason:'Vitor Belfort through Quinton Jackson II, inclusive; UFC fights only.'},
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function rosterNames(){
    const ordered=[
      ...(DATA.men||[]).map(row=>row?.fighter),
      ...(DATA.women||[]).map(row=>row?.fighter),
      ...(DATA.fighters||[]).map(row=>row?.fighter),
      ...(era.names?era.names():Object.keys(era.ledgers||{}))
    ].filter(Boolean);
    const seen=new Set();
    return ordered.filter(name=>{const id=key(name);if(!id||seen.has(id))return false;seen.add(id);return true;});
  }
  function normalizePrimeRecordAliases(names){
    const canonicalByKey=new Map(names.map(name=>[key(name),name]));
    Object.keys(DATA.primeRecords||{}).forEach(alias=>{
      const canonicalName=canonicalByKey.get(key(alias));
      if(!canonicalName||canonicalName===alias)return;
      const aliasEntry=DATA.primeRecords[alias]||{};
      const canonicalEntry=DATA.primeRecords[canonicalName]||{};
      const merged={...aliasEntry,...canonicalEntry};
      if(!canonicalEntry.record&&aliasEntry.record)merged.record=aliasEntry.record;
      DATA.primeRecords[canonicalName]=merged;
      delete DATA.primeRecords[alias];
    });
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
    return {wins:nums[0]??null,losses:nums[1]??null,draws:nums[2]??0,ncs:ncMatch?Number(ncMatch[1]):0,parsed:nums.length>=2};
  }
  function sourceRecordFor(fighter){
    const approved=APPROVED_RECORD_OVERRIDES[fighter];
    if(approved)return {...approved,source:'Canonical Era-window fight ledger recount'};
    const existing=DATA.primeRecords?.[fighter];
    if(existing?.record)return {record:existing.record,reason:'Existing reviewed Prime Record retained under locked Era context.',source:'RANKING_DATA.primeRecords reviewed value'};
    const row=allRowsFor(fighter).find(item=>item?.primeRecord);
    if(row?.primeRecord)return {record:row.primeRecord,reason:'Roster row fallback retained pending fight-ledger audit.',source:'Roster row fallback'};
    return {record:null,reason:'No Prime Record found.',source:'missing'};
  }

  DATA.primeRecords=DATA.primeRecords||{};
  const names=rosterNames();
  normalizePrimeRecordAliases(names);
  const entries=names.map(fighter=>{
    const ledger=era.entryFor(fighter);
    const chosen=sourceRecordFor(fighter);
    const context=windowText(ledger);
    const counts=parseRecord(chosen.record);
    const rebuilt=!!APPROVED_RECORD_OVERRIDES[fighter];
    const entry={
      fighter,record:chosen.record,context,counts,source:chosen.source,reason:chosen.reason,
      eraWindow:{...(ledger?.window||{})},windowLocked:!!ledger?.window?.locked,
      recordOverridden:rebuilt,scoreRebuildRequired:false,scoreRebuildCompleted:rebuilt,
      scoreRebuildVersion:rebuilt?PRIME_REBUILD_VERSION:null,version:VERSION
    };

    DATA.primeRecords[fighter]={
      ...(DATA.primeRecords[fighter]||{}),record:entry.record,context:entry.context,
      wins:counts.wins,losses:counts.losses,draws:counts.draws,ncs:counts.ncs,
      source:entry.source,sourceVersion:VERSION,eraWindowLocked:entry.windowLocked,
      primeDominanceRebuildVersion:entry.scoreRebuildVersion
    };

    allRowsFor(fighter).forEach(row=>{
      row.primeRecord=entry.record;
      row.primeRecordContext=entry.context;
      row.canonicalPrimeRecordAudit=entry;
      if(rebuilt){row.primeDominanceRebuildRequired=false;row.primeDominanceRebuildVersion=PRIME_REBUILD_VERSION;}
    });

    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
      const override=DISPLAY_OVERRIDES[fighter];
      override.snapshotStats={
        ...(override.snapshotStats||{}),primeRecord:entry.record,primeRecordContext:entry.context,
        canonicalPrimeRecordSource:entry.source,primeDominanceRebuildVersion:entry.scoreRebuildVersion
      };
    }
    return entry;
  });

  const byName=new Map(entries.map(entry=>[key(entry.fighter),entry]));
  function entryFor(fighter){return byName.get(key(fighter))||null;}
  function report(){return entries.map(entry=>({...entry,counts:{...entry.counts},eraWindow:{...entry.eraWindow}}));}

  window.UFC_CANONICAL_PRIME_RECORDS={
    version:VERSION,source:'Locked Fighter Era Ledger window + reviewed Prime Record count',fighterCount:entries.length,
    entries,entryFor,report,approvedRecordOverrides:APPROVED_RECORD_OVERRIDES,
    changedRecordFighters:Object.keys(APPROVED_RECORD_OVERRIDES),primeRebuildVersion:PRIME_REBUILD_VERSION,
    allWindowsLocked:entries.every(entry=>entry.windowLocked),mutatesScores:false,mutatesPrimeRecordDisplay:true,
    normalizedRosterKeys:true,appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-canonical-prime-records',`${VERSION}-${entries.length}`);
})();
