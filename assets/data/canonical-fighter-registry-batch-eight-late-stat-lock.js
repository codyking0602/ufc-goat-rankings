// Final public-stat lock for the eight-fighter batch after all scoring modules finish.
(function(){
  'use strict';
  const VERSION='batch-eight-late-stat-lock-20260712a';
  const F=window.UFC_BATCH_EIGHT_FIGHTER_DATA;
  const DATA=window.RANKING_DATA;
  if(!Array.isArray(F)||!DATA) return;

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const store=()=>window.DISPLAY_OVERRIDES||(typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES:null);

  function apply(reason='manual'){
    const all=[...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])];
    F.forEach(f=>{
      all.filter(row=>key(row?.fighter)===key(f.name)).forEach(row=>{
        row.timesFinishedPrime=f.stopped;
        row.primeStoppageLosses=f.stopped;
        row.ufcRecord=f.record;
        row.primeRecord=f.prime;
        row.finishRatePct=f.finish;
        row.roundsWonPct=f.rounds;
      });
      const override=store()?.[f.name];
      if(override){
        const stats={timesFinishedPrime:f.stopped,primeStoppageLosses:f.stopped,ufcRecord:f.record,primeRecord:f.prime,finishRatePct:f.finish,roundsWonPct:f.rounds};
        override.snapshotStats={...(override.snapshotStats||{}),...stats};
        override.packetProfileStats={...(override.packetProfileStats||{}),...stats};
        if(Array.isArray(override.snapshot)){
          override.snapshot=override.snapshot.map(row=>{
            if(!Array.isArray(row)) return row;
            if(row[0]==='Prime Stoppage Losses') return [row[0],String(f.stopped)];
            if(row[0]==='UFC Record') return [row[0],f.record];
            if(row[0]==='Prime Record') return [row[0],f.prime];
            if(row[0]==='Finish Rate') return [row[0],`${f.finish}%`];
            if(row[0]==='Rounds Won') return [row[0],`${f.rounds}%`];
            return row;
          });
        }
      }
      const compare=window.COMPARE_PROFILES?.[f.name];
      if(compare) compare.legacyStats={...(compare.legacyStats||{}),timesFinishedPrime:f.stopped,primeStoppageLosses:f.stopped,ufcRecord:f.record,primeNote:f.prime};
    });
    const state={version:VERSION,reason,fighters:F.length,appliedAt:new Date().toISOString()};
    window.UFC_BATCH_EIGHT_LATE_STAT_LOCK.latest=state;
    document.documentElement.setAttribute('data-batch-eight-late-stat-lock',`${VERSION}-${reason}`);
    return state;
  }

  window.UFC_BATCH_EIGHT_LATE_STAT_LOCK={version:VERSION,apply,latest:null};
  apply('script-load');
  window.addEventListener('ufc-scoring-pipeline-ready',()=>apply('scoring-pipeline-ready'));
  window.addEventListener('ufc-division-era-depth-finalized',()=>apply('era-depth-finalized'));
  setTimeout(()=>apply('post-load-250'),250);
  setTimeout(()=>apply('post-load-1200'),1200);
})();
