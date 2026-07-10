// Promotes the audited Prime Dominance model into live category rows only.
// Overall totals, ranks, and OVR belong to final-score-engine.js.
(function(){
  const VERSION='prime-dominance-live-promoter-20260710c-frankie-canonical-window';
  let applying=false;

  function applyPrimeDominanceLive(){
    if(applying)return window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER?.latest||null;
    const DATA=window.RANKING_DATA;
    const base=window.UFC_PRIME_DOMINANCE_LEDGERS;
    const report=base?.report||window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report||[];
    if(!DATA||!report.length)return null;
    applying=true;

    function round(value){return Math.round((Number(value||0)+Number.EPSILON)*100)/100;}
    function profileFor(name){return (DATA.fighters||[]).find(f=>f.fighter===name);}
    function windowText(entry){return entry?.roundControlAudit?.window||entry?.primeWindow||'';}
    function roundsWonText(entry){const audit=entry?.roundControlAudit;if(audit?.roundsWon!==undefined&&audit?.roundsCounted!==undefined)return `${audit.roundsWon}/${audit.roundsCounted} (${entry.roundControlPct}%)`;if(entry?.roundControlPct!==undefined)return `${entry.roundControlPct}%`;return '—';}
    function finishRateText(entry){if(entry?.primeFinishes!==undefined&&entry?.primeFights)return `${entry.primeFinishRate}% (${entry.primeFinishes}/${entry.primeFights})`;if(entry?.primeFinishRate!==undefined)return `${entry.primeFinishRate}%`;return '—';}
    function upsertProfilePrime(row,entry){
      const profile=profileFor(row.fighter);if(!profile)return;
      profile.primeDominance=row.primeDominance;
      profile.primeDominanceLiveAudit=entry;
      profile.primeDominanceShadowAudit=entry;
      profile.primeRecord=entry.primeRecord||profile.primeRecord;
      profile.primeRecordContext=windowText(entry)||profile.primeRecordContext;
      profile.roundsWonPct=entry.roundControlPct??profile.roundsWonPct;
      profile.primeFinishRatePct=entry.primeFinishRate??profile.primeFinishRatePct;
      if(entry.roundControlAudit?.roundsWon!==undefined){profile.primeRoundsWon=entry.roundControlAudit.roundsWon;profile.primeRoundsCounted=entry.roundControlAudit.roundsCounted;}
      if(entry.primeFinishes!==undefined){profile.primeFinishes=entry.primeFinishes;profile.primeFights=entry.primeFights;}
    }
    function snapshotFor(row,entry){
      const profile=profileFor(row.fighter)||row;
      return [
        ['UFC Record',profile.ufcRecord||row.ufcRecord||'—'],
        ['Prime Record',entry.primeRecord||profile.primeRecord||'—'],
        ['Prime Dominance',`${Number(row.primeDominance||0).toFixed(2)} / 30`],
        ['Rounds Won',roundsWonText(entry)],
        ['Prime Finish Rate',finishRateText(entry)],
        ['Active Elite Years',row.activeEliteYears!==undefined?Number(row.activeEliteYears).toFixed(2):(profile.activeEliteYears!==undefined?Number(profile.activeEliteYears).toFixed(2):'—')]
      ];
    }

    try{
      const entriesByName=Object.fromEntries(report.map(entry=>[entry.fighter,entry]));
      const liveRows=[...(DATA.men||[]),...(DATA.women||[])];
      DATA.primeRecords=DATA.primeRecords||{};
      liveRows.forEach(row=>{
        const entry=entriesByName[row.fighter];if(!entry)return;
        row.primeDominance=round(entry.total);
        row.primeDominanceLiveAudit=entry;
        row.primeDominanceShadowAudit=entry;
        row.primeRecord=entry.primeRecord||row.primeRecord;
        row.primeRecordContext=windowText(entry)||row.primeRecordContext;
        row.roundsWonPct=entry.roundControlPct??row.roundsWonPct;
        row.primeFinishRatePct=entry.primeFinishRate??row.primeFinishRatePct;
        if(entry.primeRecord)DATA.primeRecords[row.fighter]={record:entry.primeRecord,context:windowText(entry)||''};
        upsertProfilePrime(row,entry);
        if(typeof DISPLAY_OVERRIDES!=='undefined'){
          DISPLAY_OVERRIDES[row.fighter]=DISPLAY_OVERRIDES[row.fighter]||{};
          const override=DISPLAY_OVERRIDES[row.fighter];
          override.snapshot=snapshotFor(row,entry);
          override.snapshotStats={...(override.snapshotStats||{}),primeRecord:entry.primeRecord,primeRecordContext:windowText(entry),primeDominance:row.primeDominance,primeDominanceLive:row.primeDominance,primeFinishRate:finishRateText(entry),roundControl:`${entry.roundControlPct}%`,roundsWon:roundsWonText(entry),dominanceProfile:entry.dominanceProfile};
        }
      });

      DATA.primeDominanceLiveVersion=VERSION;
      const status={version:VERSION,applied:true,promoted:Object.keys(entriesByName),promotedCount:Object.keys(entriesByName).length,canonicalPrimeRecords:true,mutatesCategoryOnly:true,mutatesTotals:false,mutatesRanks:false,mutatesOvr:false,appliedAt:new Date().toISOString()};
      window.UFC_LIVE_SCORE_PROMOTION=status;
      window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER.latest=status;
      document.documentElement.setAttribute('data-prime-dominance-live',VERSION);
      return status;
    }finally{applying=false;}
  }

  const API={version:VERSION,apply:applyPrimeDominanceLive,latest:null};
  window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER=API;
  applyPrimeDominanceLive();
  if(window.UFC_FINAL_SCORE_ENGINE?.apply)window.UFC_FINAL_SCORE_ENGINE.apply('prime-dominance-promoted');
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
})();
