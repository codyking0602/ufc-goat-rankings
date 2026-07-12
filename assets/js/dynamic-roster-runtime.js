// Keeps late-registered fighters in sync across profiles, controls, photos, and rendered app surfaces.
(function(){
  'use strict';

  const VERSION='dynamic-roster-runtime-20260712a';
  const DATA=window.RANKING_DATA;
  if(!DATA) return;

  function key(value){
    return String(value||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  }

  function dynamicProfileFor(row){
    const target=key(row?.fighter);
    return (DATA.fighters||[]).find(profile=>key(profile?.fighter)===target)||{};
  }

  // app.js originally snapshots its profile lookup before post-refactor fighters register.
  // Replacing these global functions keeps drawers and Compare Mode tied to the live roster.
  window.profileFor=dynamicProfileFor;
  window.fullRow=row=>({...dynamicProfileFor(row),...(row||{})});

  function syncFighterCount(){
    const count=document.getElementById('fighterCount');
    if(count) count.textContent=String((DATA.fighters||[]).length);
  }

  function syncDivisionFilter(){
    const select=document.getElementById('divisionFilter');
    if(!select) return;
    const existing=new Set(Array.from(select.options).map(option=>key(option.value)));
    const divisions=new Set(DATA.divisions||[]);
    [...(DATA.men||[]),...(DATA.women||[])].forEach(row=>{
      if(row?.primaryDivision) divisions.add(row.primaryDivision);
      if(row?.secondaryDivision) divisions.add(row.secondaryDivision);
    });
    Array.from(divisions).filter(Boolean).sort().forEach(division=>{
      if(existing.has(key(division))) return;
      const option=document.createElement('option');
      option.value=division;
      option.textContent=division;
      select.appendChild(option);
      existing.add(key(division));
    });
  }

  function syncCompareSelect(id){
    const select=document.getElementById(id);
    if(!select) return;
    const selected=select.value;
    const existing=new Set(Array.from(select.options).map(option=>key(option.value)));
    (DATA.fighters||[]).map(profile=>profile?.fighter).filter(Boolean).sort().forEach(name=>{
      if(existing.has(key(name))) return;
      const option=document.createElement('option');
      option.value=name;
      option.textContent=name;
      select.appendChild(option);
      existing.add(key(name));
    });
    if(selected&&Array.from(select.options).some(option=>option.value===selected)) select.value=selected;
  }

  function syncPhotoDefaults(){
    try{
      if(typeof window.UFC_RANKING_DATA_PATCHES_V1?.apply==='function'){
        window.UFC_RANKING_DATA_PATCHES_V1.apply();
      }
    }catch(error){
      window.UFC_DYNAMIC_ROSTER_PHOTO_SYNC_ERROR=String(error?.message||error);
    }
  }

  function sync(reason='manual'){
    syncFighterCount();
    syncDivisionFilter();
    syncCompareSelect('fighterA');
    syncCompareSelect('fighterB');
    syncPhotoDefaults();
    if(typeof window.refresh==='function'){
      try{window.refresh();}catch(error){window.UFC_DYNAMIC_ROSTER_RENDER_ERROR=String(error?.message||error);}
    }
    const state={
      version:VERSION,reason,fighterCount:(DATA.fighters||[]).length,
      menCount:(DATA.men||[]).length,womenCount:(DATA.women||[]).length,
      syncedAt:new Date().toISOString()
    };
    window.UFC_DYNAMIC_ROSTER_RUNTIME.latest=state;
    document.documentElement.setAttribute('data-dynamic-roster-runtime',`${VERSION}-${state.fighterCount}`);
    return state;
  }

  const API={version:VERSION,sync,latest:null};
  window.UFC_DYNAMIC_ROSTER_RUNTIME=API;

  window.addEventListener('ufc-scoring-pipeline-ready',()=>sync('scoring-pipeline-ready'),{once:true});
  if(document.documentElement.getAttribute('data-scoring-pipeline')==='ready') sync('already-ready');
})();