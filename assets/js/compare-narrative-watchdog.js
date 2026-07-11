// Compare Narrative Watchdog - keeps the Compare renderer stable and syncs the full live roster.
(function(){
  'use strict';
  const VERSION = 'compare-narrative-watchdog-20260711b-full-roster';
  let timer = null;
  let tries = 0;

  function result(){ return document.getElementById('compareResult'); }
  function hasNarrative(){
    const r = result();
    return !!(r && r.classList.contains('compare-article-mode') && r.querySelector('.compare-face-card'));
  }
  function run(){
    const r = result();
    const system = window.UFC_COMPARE_NARRATIVE_SYSTEM;
    if(!r || !system || typeof system.render !== 'function') return;
    if(!hasNarrative()) system.render();
  }
  function schedule(delay=40){
    clearTimeout(timer);
    timer = setTimeout(run, delay);
  }

  function rosterNames(){
    const data = window.RANKING_DATA || {};
    const names = new Set();
    const add = row => {
      const name = typeof row === 'string' ? row : row?.fighter;
      if(name) names.add(name);
    };
    (data.men || []).forEach(add);
    (data.women || []).forEach(add);
    (data.fighters || []).forEach(add);
    return [...names].sort((a,b)=>a.localeCompare(b));
  }

  function syncSelect(id,names,defaultName){
    const select = document.getElementById(id);
    if(!select) return false;
    const current = select.value;
    const existing = [...select.options].map(option=>option.value);
    const alreadySynced = existing.length === names.length && existing.every((name,index)=>name===names[index]);
    if(!alreadySynced){
      const fragment = document.createDocumentFragment();
      names.forEach(name=>{
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        fragment.appendChild(option);
      });
      select.replaceChildren(fragment);
    }
    select.value = names.includes(current) ? current : (names.includes(defaultName) ? defaultName : names[0] || '');
    return !alreadySynced;
  }

  function syncRoster(){
    const names = rosterNames();
    if(!names.length) return {fighterCount:0,changed:false};
    const changedA = syncSelect('fighterA',names,'Jon Jones');
    const changedB = syncSelect('fighterB',names,'Georges St-Pierre');
    const count = document.getElementById('fighterCount');
    if(count) count.textContent = names.length;
    if(typeof window.renderCompare === 'function'){
      try{ window.renderCompare(); }catch(error){}
    }
    if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render){
      try{ window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render(); }catch(error){}
    }
    const detail={version:VERSION,fighterCount:names.length,changed:changedA||changedB,names,syncedAt:new Date().toISOString()};
    window.UFC_COMPARE_ROSTER_SYNC=detail;
    document.documentElement.setAttribute('data-compare-roster-count',String(names.length));
    return detail;
  }

  function install(){
    syncRoster();
    schedule(0);
    schedule(120);

    ['fighterA','fighterB'].forEach(id => {
      const sel = document.getElementById(id);
      if(sel && !sel.dataset.compareNarrativeWatchdog){
        sel.dataset.compareNarrativeWatchdog = 'true';
        sel.addEventListener('change', () => {
          schedule(40);
          setTimeout(run, 180);
        });
      }
    });

    document.querySelectorAll('.tab').forEach(tab => {
      if(!tab.dataset.compareNarrativeWatchdog){
        tab.dataset.compareNarrativeWatchdog = 'true';
        tab.addEventListener('click', () => {
          syncRoster();
          schedule(60);
          setTimeout(run, 220);
        });
      }
    });

    const r = result();
    if(r && !r.dataset.compareNarrativeWatchdogObserver){
      r.dataset.compareNarrativeWatchdogObserver = 'true';
      const obs = new MutationObserver(() => {
        if(!hasNarrative()) schedule(30);
      });
      obs.observe(r, {childList:true, subtree:false});
    }

    window.addEventListener('ufc-scoring-pipeline-ready',()=>{
      syncRoster();
      schedule(30);
    });
    if(window.UFC_SCORING_PIPELINE_READY?.then){
      window.UFC_SCORING_PIPELINE_READY.then(()=>{
        syncRoster();
        schedule(30);
      }).catch(()=>{});
    }

    const interval = setInterval(() => {
      tries += 1;
      syncRoster();
      run();
      if(tries >= 12) clearInterval(interval);
    }, 350);
  }

  window.UFC_COMPARE_NARRATIVE_WATCHDOG = {version:VERSION,run,syncRoster,rosterNames};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
