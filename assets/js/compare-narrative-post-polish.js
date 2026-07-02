// Compare Narrative Post-Polish
// Lightweight cleanup layer after the main narrative renderer.
(function(){
  const VERSION = 'compare-narrative-post-polish-20260702a';

  function textCleanups(text){
    let out = String(text || '');

    // Restore natural possessive fighter phrasing in voice-bank copy.
    [
      'Usman','Khabib','Volk','Holloway','Aldo','DC','Cormier','Stipe','Pereira','Adesanya','Izzy','Nunes','Valentina','Johnson','Silva','GSP'
    ].forEach(name => {
      const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp(`\\b${safeName} (case|title run|championship case|best version|elite window|UFC list|UFC ledger|UFC run|peak|high end)`, 'g'), `${name}'s $1`);
    });

    // Prefer the fighter-voice sentence when the generic sentence says the same thing.
    out = out.replace(/Aldo twice, Ortega, Kattar, Yair, Korean Zombie, and Gaethje give Holloway one of the best opponent-volume cases in the ranking\.\s+/g, '');
    out = out.replace(/Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give Usman a strong modern welterweight ledger\.\s+Usman's case starts/g, "Usman's case starts");
    out = out.replace(/RDA, Barboza, McGregor, Poirier, and Gaethje give Khabib a compact but extremely high-quality lightweight resume\.\s+Khabib's case/g, "Khabib's case");
    out = out.replace(/Oliveira, Volkanovski, Poirier, Tsarukyan, and Hooker give Islam a modern lightweight ledger with real championship weight\.\s+Islam now/g, 'Islam now');

    return out;
  }

  function polish(){
    const result = document.getElementById('compareResult');
    if(!result || !result.classList.contains('compare-article-mode')) return;
    result.querySelectorAll('.compare-flow-card p').forEach(p => {
      const cleaned = textCleanups(p.textContent);
      if(cleaned !== p.textContent) p.textContent = cleaned;
    });
    result.dataset.comparePostPolish = VERSION;
  }

  function install(){
    const system = window.UFC_COMPARE_NARRATIVE_SYSTEM;
    if(system && typeof system.render === 'function' && !system.postPolishWrapped){
      const original = system.render.bind(system);
      system.render = function(){
        const value = original();
        setTimeout(polish, 0);
        return value;
      };
      system.postPolishWrapped = VERSION;
    }
    setTimeout(polish, 0);
    ['fighterA','fighterB'].forEach(id => {
      const sel = document.getElementById(id);
      if(sel && !sel.dataset.comparePostPolishListener){
        sel.dataset.comparePostPolishListener = 'true';
        sel.addEventListener('change', () => setTimeout(polish, 20));
      }
    });
    document.querySelectorAll('.tab').forEach(tab => {
      if(!tab.dataset.comparePostPolishTabListener){
        tab.dataset.comparePostPolishTabListener = 'true';
        tab.addEventListener('click', () => setTimeout(polish, 20));
      }
    });
  }

  window.UFC_COMPARE_NARRATIVE_POST_POLISH = {version: VERSION, polish};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();