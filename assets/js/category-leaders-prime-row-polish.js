// Normalizes Prime Dominance row text in Category Leaders.
(function(){
  const VERSION = 'category-leaders-prime-row-polish-20260708a';

  function rowFor(name){
    const DATA = window.RANKING_DATA || {};
    return [...(DATA.men || []), ...(DATA.women || [])].find(row => row.fighter === name) || null;
  }
  function entryFor(name){
    const row = rowFor(name) || {};
    return row.primeDominanceLiveAudit
      || row.primeDominanceShadowAudit
      || window.UFC_PRIME_DOMINANCE_LEDGERS?.entryFor?.(name)
      || window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report?.find(entry => entry.fighter === name)
      || null;
  }
  function pct(v){
    const n = Number(v);
    return Number.isFinite(n) ? `${n.toFixed(1)}%` : null;
  }
  function recordText(entry, row){
    if(entry && entry.primeWins !== undefined && entry.primeLosses !== undefined){
      let text = `${entry.primeWins}-${entry.primeLosses}`;
      if(Number(entry.primeDraws || 0)) text += `-${entry.primeDraws}`;
      if(Number(entry.primeNCs || 0)) text += `, ${entry.primeNCs} NC`;
      return text;
    }
    const raw = entry?.primeRecord || row?.primeRecord || '';
    if(/^\d/.test(String(raw))) return String(raw).replace(/\s*(prime run|title-level prime window|title\/elite window|in title\/elite window).*$/i, '').trim();
    return raw || null;
  }
  function roundsText(entry, row){
    const audit = entry?.roundControlAudit;
    if(audit?.roundsWon !== undefined && audit?.roundsCounted !== undefined){
      return `${audit.roundsWon}/${audit.roundsCounted} rounds won`;
    }
    const pctValue = pct(entry?.roundControlPct ?? row?.roundsWonPct);
    return pctValue ? `${pctValue} rounds won` : null;
  }
  function finishText(entry, row){
    const rate = pct(entry?.primeFinishRate ?? row?.primeFinishRatePct);
    return rate ? `${rate} prime finish rate` : null;
  }
  function textFor(name){
    const row = rowFor(name) || {};
    const entry = entryFor(name);
    const pieces = [recordText(entry, row), finishText(entry, row), roundsText(entry, row)].filter(Boolean);
    return pieces.join(' · ');
  }
  function polish(){
    const active = document.querySelector('[data-category-leader="primeDominance"].active');
    if(!active) return;
    document.querySelectorAll('.category-leader-row[data-fighter]').forEach(card => {
      const target = card.querySelector('.category-leader-context');
      if(!target) return;
      const text = textFor(card.dataset.fighter);
      if(text) target.textContent = text;
    });
  }
  function install(){
    if(window.UFC_CATEGORY_LEADERS?.render && !window.UFC_CATEGORY_LEADERS.render.__primeRowPolished){
      const oldRender = window.UFC_CATEGORY_LEADERS.render;
      const wrapped = function(){
        const result = oldRender.apply(this, arguments);
        setTimeout(polish, 0);
        return result;
      };
      wrapped.__primeRowPolished = true;
      window.UFC_CATEGORY_LEADERS.render = wrapped;
    }
    document.addEventListener('click', () => setTimeout(polish, 0));
    document.addEventListener('change', () => setTimeout(polish, 0));
    polish();
  }
  window.UFC_CATEGORY_LEADERS_PRIME_ROW_POLISH = {version: VERSION, polish};
  setTimeout(install, 0);
  setTimeout(polish, 250);
})();
