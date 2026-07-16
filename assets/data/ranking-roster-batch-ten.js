// Shared static roster identities for canonical batch ten.
// Scores, category values, ranks, OVRs, and calculated profile stats remain owned by ranking-pipeline.js.
(function(){
  'use strict';

  const VERSION='ranking-roster-batch-ten-20260715a';
  const rows=[
    {id:'APAN001',fighter:'Alexandre Pantoja',gender:'Men',primaryDivision:'Flyweight',secondaryDivision:'',scope:'UFC',leaderboard:'men'},
    {id:'PPIM001',fighter:'Paddy Pimblett',gender:'Men',primaryDivision:'Lightweight',secondaryDivision:'',scope:'UFC',leaderboard:'men'},
    {id:'CWEI001',fighter:'Chris Weidman',gender:'Men',primaryDivision:'Middleweight',secondaryDivision:'Light Heavyweight',scope:'UFC',leaderboard:'men'}
  ];
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const data=window.RANKING_DATA;
  if(!data||!Array.isArray(data.men)||!Array.isArray(data.fighters))throw new Error(`[${VERSION}] RANKING_DATA roster arrays are unavailable.`);

  const menKeys=new Set(data.men.map(row=>key(row?.fighter)));
  const profileKeys=new Set(data.fighters.map(row=>key(row?.fighter)));
  rows.forEach(row=>{
    const fighterKey=key(row.fighter);
    if(menKeys.has(fighterKey)||profileKeys.has(fighterKey))throw new Error(`[${VERSION}] Duplicate shared roster identity: ${row.fighter}`);
    data.men.push({fighter:row.fighter,leaderboard:row.leaderboard});
    data.fighters.push({...row});
    menKeys.add(fighterKey);
    profileKeys.add(fighterKey);
  });

  data.meta=data.meta||{};
  data.meta.sharedRosterBatches=[...(data.meta.sharedRosterBatches||[]),{version:VERSION,fighters:rows.map(row=>row.fighter)}];
  window.UFC_RANKING_ROSTER_BATCH_TEN={version:VERSION,fighterCount:rows.length,fighters:rows.map(row=>row.fighter),passed:true};
  document.documentElement.setAttribute('data-ranking-roster-batch-ten',`${VERSION}-clean-${rows.length}`);
})();