// Compare Narrative Watchdog - keeps the new Compare article renderer on top of older renderers.
(function(){
  const VERSION = 'compare-narrative-watchdog-20260702a';
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
  function install(){
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

    const interval = setInterval(() => {
      tries += 1;
      run();
      if(tries >= 12) clearInterval(interval);
    }, 350);
  }

  window.UFC_COMPARE_NARRATIVE_WATCHDOG = {version: VERSION, run};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
