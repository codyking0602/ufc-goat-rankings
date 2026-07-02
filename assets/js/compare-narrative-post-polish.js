// Compare Narrative Post-Polish
// Persistent cleanup layer after the main narrative renderer.
(function(){
  const VERSION = 'compare-narrative-post-polish-20260702b';
  let polishing = false;

  function textCleanups(text){
    let out = String(text || '');

    // Restore natural possessive fighter phrasing in voice-bank copy.
    [
      'Usman','Khabib','Volk','Holloway','Aldo','DC','Cormier','Stipe','Pereira','Adesanya','Izzy','Nunes','Valentina','Johnson','Silva','GSP','Islam'
    ].forEach(name => {
      const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp(`\\b${safeName} (case|title run|championship case|best version|elite window|UFC list|UFC ledger|UFC run|peak|high end|opponent ledger)`, 'g'), `${name}'s $1`);
    });

    // Prefer the fighter-voice sentence when the generic sentence says the same thing.
    out = out.replace(/Aldo twice, Ortega, Kattar, Yair, Korean Zombie, and Gaethje give Holloway one of the best opponent-volume cases in the ranking\.\s+/g, '');
    out = out.replace(/Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give Usman a strong modern welterweight ledger\.\s+/g, '');
    out = out.replace(/RDA, Barboza, McGregor, Poirier, and Gaethje give Khabib a compact but extremely high-quality lightweight resume\.\s+/g, '');
    out = out.replace(/Oliveira, Volkanovski, Poirier, Tsarukyan, and Hooker give Islam a modern lightweight ledger with real championship weight\.\s+/g, '');
    out = out.replace(/Aldo, Holloway three times, Ortega, Korean Zombie, and Yair give Volk one of the cleanest modern featherweight title resumes\.\s+/g, '');

    // Clean a few repeated template openers into more natural argument phrasing.
    out = out.replace('The best version of the Kamaru Usman argument starts with title-fight value and peak control.', "Usman's counterargument is the cleaner champion-peak case.");
    out = out.replace('Max Holloway creates separation through elite-win depth and completed elite years.', 'Holloway wins the long-game argument.');
    out = out.replace('Islam Makhachev creates separation through title-fight value and elite-win depth.', 'Islam creates separation through the bigger completed lightweight title resume.');
    out = out.replace('The best version of the Khabib Nurmagomedov argument starts with peak control and cleaner loss profile.', "Khabib's counterargument is peak purity.");

    // Remove double spaces created by deleted sentences.
    out = out.replace(/\s{2,}/g, ' ').trim();
    return out;
  }

  function polish(){
    if(polishing) return;
    polishing = true;
    try{
      const result = document.getElementById('compareResult');
      if(!result || !result.classList.contains('compare-article-mode')) return;
      result.querySelectorAll('.compare-flow-card p').forEach(p => {
        const cleaned = textCleanups(p.textContent);
        if(cleaned !== p.textContent) p.textContent = cleaned;
      });
      result.dataset.comparePostPolish = VERSION;
    } finally {
      polishing = false;
    }
  }

  function install(){
    const system = window.UFC_COMPARE_NARRATIVE_SYSTEM;
    if(system && typeof system.render === 'function' && !system.postPolishWrapped){
      const original = system.render.bind(system);
      system.render = function(){
        const value = original();
        setTimeout(polish, 0);
        setTimeout(polish, 50);
        setTimeout(polish, 250);
        return value;
      };
      system.postPolishWrapped = VERSION;
    }

    const result = document.getElementById('compareResult');
    if(result && !result.dataset.comparePostPolishObserver){
      result.dataset.comparePostPolishObserver = 'true';
      const observer = new MutationObserver(() => setTimeout(polish, 0));
      observer.observe(result, {childList:true, subtree:true, characterData:true});
    }

    setTimeout(polish, 0);
    setTimeout(polish, 250);
    setTimeout(polish, 1000);

    ['fighterA','fighterB'].forEach(id => {
      const sel = document.getElementById(id);
      if(sel && !sel.dataset.comparePostPolishListener){
        sel.dataset.comparePostPolishListener = 'true';
        sel.addEventListener('change', () => {
          setTimeout(polish, 20);
          setTimeout(polish, 250);
        });
      }
    });

    document.querySelectorAll('.tab').forEach(tab => {
      if(!tab.dataset.comparePostPolishTabListener){
        tab.dataset.comparePostPolishTabListener = 'true';
        tab.addEventListener('click', () => setTimeout(polish, 250));
      }
    });
  }

  window.UFC_COMPARE_NARRATIVE_POST_POLISH = {version: VERSION, polish};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();