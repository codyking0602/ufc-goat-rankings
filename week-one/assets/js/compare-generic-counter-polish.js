// Generic Compare Counter + Initials Polish
// Fixes initial-name sentence splitting and thin generic loser counters without hardcoding matchups.
(function(){
  const VERSION = 'compare-generic-counter-polish-20260703a';
  let busy = false;

  function clean(text){
    return String(text || '')
      .replace(/B\.\s+J\./g, 'B.J.')
      .replace(/T\.\s+J\./g, 'T.J.')
      .replace(/r\u00e9sum\u00e9s|résumés/g, 'resumes')
      .replace(/r\u00e9sum\u00e9|résumé/g, 'resume')
      .replace(/R\u00e9sum\u00e9s|Résumés/g, 'Resumes')
      .replace(/R\u00e9sum\u00e9|Résumé/g, 'Resume')
      .replace(/better best-version angle/gi, 'best-version argument')
      .replace(/title column/gi, 'title resume')
      .replace(/folded back into the bigger picture/gi, 'weighed against the full resume')
      .replace(/bigger picture/gi, 'full resume')
      .replace(/quality wins carries/gi, 'quality wins carry')
      .replace(/prime control and quality wins carries/gi, 'prime control and quality wins carry')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function protect(text){
    const saved = [];
    const value = clean(text).replace(/\b(?:[A-Z]\.){2,}(?=\s|$)/g, m => {
      const token = `INITSAFE${saved.length}`;
      saved.push(m);
      return token;
    });
    return {value, saved};
  }

  function restore(text, saved){
    let out = String(text || '');
    saved.forEach((value, i) => { out = out.split(`INITSAFE${i}`).join(value); });
    return clean(out);
  }

  function sentences(text){
    const p = protect(text);
    return (p.value.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map(x => restore(x, p.saved));
  }

  function words(text){
    return new Set(clean(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['title','resume','case','argument','ranking','championship','through','value','depth','strongest','better','overall'].includes(w)));
  }

  function similar(a,b){
    const A = words(a), B = words(b);
    if(!A.size || !B.size) return false;
    const common = [...A].filter(x => B.has(x)).length;
    return common / Math.min(A.size, B.size) >= 0.5;
  }

  function compact(text, maxChars){
    const kept = [];
    sentences(text).forEach(s => {
      const line = clean(s);
      if(!line || /^(B\.J\.|T\.J\.)$/i.test(line)) return;
      if(kept.some(x => similar(x, line))) return;
      const next = clean([...kept, line].join(' '));
      if(kept.length >= 3 || (kept.length && next.length > maxChars)) return;
      kept.push(line);
    });
    return clean(kept.join(' '));
  }

  function currentNames(){
    const a = document.getElementById('fighterA')?.value || '';
    const b = document.getElementById('fighterB')?.value || '';
    return [a,b].filter(Boolean);
  }

  function row(name){
    const data = window.RANKING_DATA || {};
    const base = [...(data.men || []), ...(data.women || [])].find(x => x.fighter === name) || {fighter:name};
    if(typeof window.fullRow === 'function') return window.fullRow(base);
    const profile = (data.fighters || []).find(x => x.fighter === name) || {};
    return {...profile, ...base};
  }

  function score(name){
    const r = row(name);
    return Number(r.totalScore) || (typeof window.overallOvr === 'function' ? Number(window.overallOvr(r)) : 0) || 0;
  }

  function winnerLoser(){
    const [a,b] = currentNames();
    if(!a || !b) return {};
    return score(a) >= score(b) ? {winner:a, loser:b} : {winner:b, loser:a};
  }

  function profile(name){
    return (window.COMPARE_PROFILES && window.COMPARE_PROFILES[name]) || window.DISPLAY_OVERRIDES?.[name]?.compareProfile || {};
  }

  function makeCounter(loser, winner){
    const p = profile(loser);
    const candidates = [p.counter, p.titleSummary, p.championship, p.shortCase, p.bestArgument, p.peak, p.resume].filter(Boolean).map(clean);
    let line = candidates.find(x => x.length > 70) || '';
    if(!line) return '';
    line = compact(line, 350);
    const weakness = clean(p.weakness || '');
    if(weakness && !similar(line, weakness) && line.length < 390) line = clean(`${line} ${compact(weakness, 190)}`);
    if(line.length < 430) line = clean(`${line} The problem is that ${winner} still has the stronger overall case.`);
    return compact(line, 500);
  }

  function polishBodyParagraphs(card){
    const body = Array.from(card.querySelectorAll(':scope > p:not(.compare-debate-frame)'));
    body.forEach(p => {
      let text = clean(p.textContent || '');
      if(/^better\s+.+\s+(angle|resume)\s+[—:-]/i.test(text)) { p.remove(); return; }
      text = text
        .replace(/:\s+/g, ' — ')
        .replace(/^(.+?) wins through the bigger title resume\./, 'The winning argument for $1 is the bigger title resume.')
        .replace(/^(.+?) wins through the deeper win list\./, "$1's answer is the deeper win list.")
        .replace(/^(.+?) wins the long-view side\./, "$1's answer is the long view.")
        .replace(/^(.+?) starts with the better best-version argument\./, "$1's answer starts with the stronger peak.");
      const next = compact(text, 540);
      if(next) p.textContent = next; else p.remove();
    });
  }

  function strengthenLoser(card){
    const {winner, loser} = winnerLoser();
    if(!winner || !loser) return;
    const first = card.querySelector(':scope > p:not(.compare-debate-frame)');
    if(!first) return;
    const current = clean(first.textContent || '');
    const thin = current.length < 145 || /keeps this close through (championship value|win depth|longevity)\.?$/i.test(current);
    if(!thin) return;
    const extra = makeCounter(loser, winner);
    if(!extra) return;
    first.textContent = compact(`${current} ${extra}`, 520);
  }

  function fixFinal(card){
    const finalP = card.querySelector('.compare-final-take p');
    if(!finalP) return;
    const strong = finalP.querySelector('strong');
    if(strong && strong.nextSibling && strong.nextSibling.nodeType === Node.TEXT_NODE && !/^\s/.test(strong.nextSibling.nodeValue || '')) {
      strong.nextSibling.nodeValue = ' ' + strong.nextSibling.nodeValue;
    }
    finalP.childNodes.forEach(node => {
      if(node.nodeType === Node.TEXT_NODE) node.nodeValue = clean(node.nodeValue);
    });
  }

  function polish(){
    if(busy) return;
    busy = true;
    try{
      const result = document.getElementById('compareResult');
      const card = result?.querySelector('.compare-flow-card');
      if(!result || !card) return;
      polishBodyParagraphs(card);
      strengthenLoser(card);
      fixFinal(card);
      result.dataset.compareGenericCounterPolish = VERSION;
    } finally {
      busy = false;
    }
  }

  function install(){
    const result = document.getElementById('compareResult');
    if(result && !result.dataset.compareGenericCounterObserver){
      result.dataset.compareGenericCounterObserver = 'true';
      new MutationObserver(() => setTimeout(polish, 0)).observe(result, {childList:true, subtree:true, characterData:true});
    }
    ['fighterA','fighterB'].forEach(id => {
      const sel = document.getElementById(id);
      if(sel && !sel.dataset.compareGenericCounterListener){
        sel.dataset.compareGenericCounterListener = 'true';
        sel.addEventListener('change', () => { setTimeout(polish,0); setTimeout(polish,250); });
      }
    });
    setTimeout(polish, 0);
    setTimeout(polish, 250);
  }

  window.UFC_COMPARE_GENERIC_COUNTER_POLISH = {version: VERSION, polish};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();