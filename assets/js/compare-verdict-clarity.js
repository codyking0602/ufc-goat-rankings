// Compare Verdict Clarity Layer
(function(){
  const VERSION = 'compare-verdict-clarity-20260702a';
  let busy = false;

  function currentKey(){
    const a = document.getElementById('fighterA')?.value || '';
    const b = document.getElementById('fighterB')?.value || '';
    return [a.toLowerCase(), b.toLowerCase()].sort().join('|');
  }

  function cleanResume(root){
    if(!root) return;
    root.innerHTML = root.innerHTML
      .replace(/résumés/g, 'resumes')
      .replace(/résumé/g, 'resume')
      .replace(/Résumés/g, 'Resumes')
      .replace(/Résumé/g, 'Resume');
  }

  function setFinal(card, text){
    const p = card.querySelector('.compare-final-take p');
    if(p) p.innerHTML = '<strong>The call:</strong> ' + text;
  }

  function applyCopy(card, key){
    const h3 = card.querySelector('h3');
    const ps = Array.from(card.querySelectorAll(':scope > p'));
    const set = arr => arr.forEach((text,i) => { if(ps[i]) ps[i].textContent = text; });

    if(key === 'islam makhachev|khabib nurmagomedov'){
      if(h3) h3.textContent = 'Islam Makhachev edges it, but Khabib Nurmagomedov keeps it uncomfortable.';
      set([
        'Cleaner peak: Khabib Nurmagomedov. Bigger title resume: Islam Makhachev.',
        'Khabib keeps this uncomfortable through peak purity. He has 4 title-fight wins and a compact, high-quality lightweight run, but this is not a volume argument.',
        'Islam is ahead because the title resume is bigger now. He has 6 title-fight wins and the modern lightweight names to back it up: Oliveira, Volkanovski, Poirier, Tsarukyan, and Hooker. Islam’s run is not closed yet.',
        'So if the question is cleanest peak, Khabib still has the answer. If the question is the larger title resume, Islam has passed him.'
      ]);
      setFinal(card, 'Islam Makhachev, narrowly. Khabib owns the cleaner peak, but Islam’s title work and high-end lightweight names give him the larger resume, with room to stretch the gap.');
      return;
    }

    if(key === 'francis ngannou|stipe miocic'){
      if(h3) h3.textContent = 'Stipe Miocic wins, but the direct series keeps it uncomfortable.';
      set([
        'Scarier best version: Francis Ngannou. Bigger heavyweight resume: Stipe Miocic.',
        'Ngannou keeps this close through the better best-version angle. He has 2 title-fight wins and the rematch went his way, but the direct series is split instead of one-way traffic.',
        'Stipe gets the nod because the broader heavyweight resume is bigger. He has 6 title-fight wins, more years at the top, and more title-level heavyweight depth.',
        'The split series keeps this honest. Once that is acknowledged, the call goes back to the bigger heavyweight resume.'
      ]);
      setFinal(card, 'Stipe Miocic wins. Ngannou has the scarier peak, but the split series sends the debate back to Stipe’s deeper heavyweight resume.');
      return;
    }

    if(key === 'alexander volkanovski|max holloway'){
      set([
        'Longer volume resume: Max Holloway. Shared-era featherweight answer: Alexander Volkanovski.',
        'Max keeps this close by pulling it toward volume and longevity. He has 4 title-fight wins, about 11 active elite years, and a huge list of useful wins across multiple eras.',
        'Volk wins because this is not just a volume contest. He took the belt from Max, went 3-0 in their series, and built the cleaner featherweight title run in their shared era.',
        'So if the question is long-term volume, Max has a real answer. If the question is shared-era featherweight separation, the trilogy makes Volk the pick.'
      ]);
      setFinal(card, 'Alexander Volkanovski wins. Max has the longer volume resume, but Volk’s trilogy edge and championship separation make the shared-era answer cleaner.');
    }
  }

  function polish(){
    if(busy) return;
    busy = true;
    try{
      const result = document.getElementById('compareResult');
      const card = result?.querySelector('.compare-flow-card');
      if(!result || !card) return;
      applyCopy(card, currentKey());
      cleanResume(result);
      result.dataset.compareVerdictClarity = VERSION;
    } finally { busy = false; }
  }

  function install(){
    const result = document.getElementById('compareResult');
    if(result && !result.dataset.compareVerdictClarityObserver){
      result.dataset.compareVerdictClarityObserver = 'true';
      new MutationObserver(() => setTimeout(polish, 0)).observe(result, {childList:true, subtree:true, characterData:true});
    }
    ['fighterA','fighterB'].forEach(id => {
      const sel = document.getElementById(id);
      if(sel && !sel.dataset.compareVerdictClarityListener){
        sel.dataset.compareVerdictClarityListener = 'true';
        sel.addEventListener('change', () => { setTimeout(polish,0); setTimeout(polish,200); });
      }
    });
    setTimeout(polish, 0);
    setTimeout(polish, 200);
  }

  window.UFC_COMPARE_VERDICT_CLARITY = {version:VERSION, polish};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();