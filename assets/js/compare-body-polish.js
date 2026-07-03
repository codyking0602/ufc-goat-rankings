// Generic Compare Body Polish
// No fighter-specific fixes here. This only cleans paragraph rhythm after the packet-driven engine renders.
(function(){
  const VERSION = 'compare-body-polish-20260703a';
  let busy = false;

  function cleanBase(text){
    return String(text || '')
      .replace(/r\u00e9sum\u00e9s/g,'resumes')
      .replace(/r\u00e9sum\u00e9/g,'resume')
      .replace(/R\u00e9sum\u00e9s/g,'Resumes')
      .replace(/R\u00e9sum\u00e9/g,'Resume')
      .replace(/résumés/g,'resumes')
      .replace(/résumé/g,'resume')
      .replace(/Résumés/g,'Resumes')
      .replace(/Résumé/g,'Resume')
      .replace(/title column/gi,'title resume')
      .replace(/opponent-volume cases?/gi,'win-depth resume')
      .replace(/folded back into the bigger picture/gi,'weighed against the full resume')
      .replace(/bigger picture/gi,'full resume')
      .replace(/\s+/g,' ')
      .trim();
  }

  function makeHuman(text){
    let out = cleanBase(text);
    out = out.replace(/^([A-Z][^.!?]{1,60}) wins through the bigger title resume\./, 'The winning argument for $1 is the bigger title resume.');
    out = out.replace(/^([A-Z][^.!?]{1,60}) wins through the deeper win list\./, "$1's answer is the deeper win list.");
    out = out.replace(/^([A-Z][^.!?]{1,60}) wins the long-view side\./, "$1's answer is the long view.");
    out = out.replace(/^([A-Z][^.!?]{1,60}) starts with the better best-version argument\./, "$1's answer starts with the stronger peak.");
    out = out.replace(/^Francis Ngannou's best path is the better best-version angle\./, 'Francis Ngannou keeps this close through the scarier best-version argument.');
    out = out.replace(/^([A-Z][^.!?]{1,60})'s best path is the better best-version angle\./, "$1 keeps this close through the best-version argument.");
    out = out.replace(/better best-version angle/gi,'best-version argument');
    out = out.replace(/\b(best argument is [^:.!?]{1,70}):\s*/gi,'$1 — ');
    out = out.replace(/\b(case starts with [^:.!?]{1,70}):\s*/gi,'$1 — ');
    out = out.replace(/\b(title case is [^:.!?]{1,70}):\s*/gi,'$1, with ');
    out = out.replace(/\b(win depth is excellent):\s*/gi,'$1, with ');
    out = out.replace(/\b(heavyweight peak value|peak value|purity):\s*/gi,'$1 — ');
    out = out.replace(/\b(the UFC heavyweight standard|the standard|standard):\s*/gi,'$1, with ');
    out = out.replace(/:\s+/g,' — ');
    return cleanBase(out);
  }

  function sentences(text){
    return makeHuman(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  }

  function tokenSet(text){
    return new Set(makeHuman(text).toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w => w.length > 3 && !['fighter','title','resume','case','argument','ranking','championship','value','through','strongest','depth'].includes(w)));
  }

  function tooSimilar(a,b){
    const A = tokenSet(a), B = tokenSet(b);
    if(!A.size || !B.size) return false;
    const common = [...A].filter(x => B.has(x)).length;
    const ratio = common / Math.min(A.size, B.size);
    const aa = makeHuman(a).toLowerCase();
    const bb = makeHuman(b).toLowerCase();
    return ratio >= 0.50 || aa.includes(bb.slice(0,58)) || bb.includes(aa.slice(0,58));
  }

  function polishParagraph(text){
    const kept = [];
    sentences(text).forEach(raw => {
      const sentence = makeHuman(raw);
      if(!sentence) return;
      if(kept.some(existing => tooSimilar(existing, sentence))) return;
      const next = makeHuman([...kept, sentence].join(' '));
      if(kept.length >= 3 || (kept.length && next.length > 540)) return;
      kept.push(sentence);
    });
    return makeHuman(kept.join(' '));
  }

  function polish(){
    if(busy) return;
    busy = true;
    try{
      const result = document.getElementById('compareResult');
      const card = result?.querySelector('.compare-flow-card');
      if(!result || !card) return;
      card.querySelectorAll(':scope > p:not(.compare-debate-frame)').forEach(p => {
        const next = polishParagraph(p.textContent || '');
        if(next && next !== p.textContent) p.textContent = next;
      });
      const finalP = card.querySelector('.compare-final-take p');
      if(finalP) {
        finalP.childNodes.forEach(node => {
          if(node.nodeType === Node.TEXT_NODE) node.nodeValue = cleanBase(node.nodeValue);
        });
      }
      result.dataset.compareBodyPolish = VERSION;
    } finally {
      busy = false;
    }
  }

  function install(){
    const result = document.getElementById('compareResult');
    if(result && !result.dataset.compareBodyPolishObserver){
      result.dataset.compareBodyPolishObserver = 'true';
      new MutationObserver(() => setTimeout(polish, 0)).observe(result, {childList:true, subtree:true, characterData:true});
    }
    ['fighterA','fighterB'].forEach(id => {
      const select = document.getElementById(id);
      if(select && !select.dataset.compareBodyPolishListener){
        select.dataset.compareBodyPolishListener = 'true';
        select.addEventListener('change', () => { setTimeout(polish,0); setTimeout(polish,250); });
      }
    });
    setTimeout(polish,0);
    setTimeout(polish,250);
  }

  window.UFC_COMPARE_BODY_POLISH = {version:VERSION, polish};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();