// Polishes Category Leaders copy for formula-live Loss Context.
(function(){
  const VERSION = 'loss-context-category-copy-20260707b-loss-profile-tags';
  const SUMMARY = '<strong>Loss Context · {board}</strong><br>Ranks loss profiles by type: pre-prime, prime, post-prime, elite/upward-division, finish, and weird-result context. Showing {count} fighters.';
  const COPY_OVERRIDES = {
    'Jon Jones': 'Clean loss profile · Hamill DQ not treated as a real loss',
    'Khabib Nurmagomedov': 'Clean loss profile · No counted UFC losses',
    'Charles Oliveira': 'Heavy loss context · Early finishes + prime elite losses'
  };
  function activeBoardLabel(){
    const select = document.getElementById('categoryLeaderBoard');
    return select?.value === 'women' ? 'Women' : 'Men';
  }
  function norm(name){ return String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  function num(value){ const n = Number(value); return Number.isFinite(n) ? n : 0; }
  function fighterFor(name){
    const wanted = norm(name);
    return (window.RANKING_DATA?.fighters || []).find(f => norm(f.fighter) === wanted) || null;
  }
  function entryPhase(entry){ return String(entry?.phase || '').toLowerCase(); }
  function entryTier(entry){ return String(entry?.opponentTier || '').toLowerCase(); }
  function entryFinished(entry){ return entry?.finished === true || /ko|tko|sub|finish/.test(String(entry?.result || entry?.method || '').toLowerCase()); }
  function countedEntries(f){
    const auditEntries = Array.isArray(f?.lossContextAudit?.entries) ? f.lossContextAudit.entries : [];
    const source = auditEntries.length ? auditEntries : (Array.isArray(f?.losses) ? f.losses : []);
    return source.filter(e => e?.counted !== false);
  }
  function labelFor(f){
    if(!f) return 'Loss profile · Context not loaded yet';
    if(COPY_OVERRIDES[f.fighter]) return COPY_OVERRIDES[f.fighter];
    const penalty = num(f.penalty ?? f.lossPenalty ?? f.scoring?.penalty);
    const entries = countedEntries(f);
    const rawLosses = Array.isArray(f?.losses) ? f.losses : [];
    if(penalty === 0){
      if(rawLosses.some(e => e?.counted === false)) return 'Clean loss profile · Weird result not treated as real loss';
      if(f.lossContextNoLosses || !entries.length) return 'Clean loss profile · No counted UFC losses';
      return 'Clean loss profile · Post-prime losses ignored';
    }
    const hasPre = entries.some(e => entryPhase(e).includes('pre'));
    const hasPrime = entries.some(e => entryPhase(e) === 'prime' || entryPhase(e).includes('prime') && !entryPhase(e).includes('pre') && !entryPhase(e).includes('post'));
    const hasPost = entries.some(e => entryPhase(e).includes('post'));
    const hasFinish = entries.some(entryFinished);
    const hasUpward = entries.some(e => e?.upwardDivision === true);
    const hasNonElite = entries.some(e => entryTier(e).includes('non'));
    const primeEliteCount = entries.filter(e => hasPrime && entryTier(e).includes('champion')).length;
    if(penalty <= -9.75){
      if(hasPre && hasPrime && hasFinish) return 'Heavy loss context · Early finishes + prime elite losses';
      return 'Heavy loss context · Repeated counted losses across prime';
    }
    if(penalty <= -7){
      if(hasNonElite && hasFinish) return 'Heavy loss context · Upset finishes + elite losses';
      if(hasPrime && hasFinish) return 'Heavy loss context · Prime elite finishes';
      return 'Heavy loss context · Multiple elite losses';
    }
    if(penalty <= -4){
      if(hasPrime && hasNonElite && hasFinish) return 'Moderate loss context · Prime upset finish';
      if(hasUpward) return 'Moderate loss context · Upward-division + elite losses';
      if(hasPrime && hasFinish) return 'Moderate loss context · Prime elite finish loss';
      return 'Moderate loss context · Multiple counted elite losses';
    }
    if(hasUpward) return 'Light loss context · Upward-division elite loss';
    if(hasPre && !hasPrime) return hasFinish ? 'Light loss context · Early finish before prime' : 'Light loss context · Early loss before prime';
    if(hasPrime && !hasFinish) return entries.length > 1 ? 'Light loss context · Elite decision losses only' : 'Light loss context · Prime elite decision loss';
    if(hasPost && !hasPrime && !hasPre) return 'Light loss context · Mostly post-prime losses';
    return 'Light loss context · Loss has timing or opponent context';
  }
  function applyRowCopy(){
    const active = document.querySelector('[data-category-leader="penalty"].active');
    if(!active) return;
    document.querySelectorAll('#categoryLeaderList .category-leader-row').forEach(row => {
      const target = row.querySelector('.category-leader-context');
      if(!target) return;
      target.textContent = labelFor(fighterFor(row.dataset.fighter));
    });
  }
  function apply(){
    const active = document.querySelector('[data-category-leader="penalty"].active');
    const summary = document.getElementById('categoryLeaderSummary');
    const list = document.getElementById('categoryLeaderList');
    const pill = document.querySelector('[data-category-leader="penalty"]');
    if(pill){
      pill.textContent = 'Loss Context';
      pill.title = 'Loss types: pre-prime, prime, post-prime, elite/upward, finish, and weird-result context';
      pill.setAttribute('aria-label','Loss Context category leaders by loss type and timing');
    }
    if(active && summary){
      const count = list?.querySelectorAll('.category-leader-row').length || 0;
      summary.innerHTML = SUMMARY.replace('{board}', activeBoardLabel()).replace('{count}', String(count));
      applyRowCopy();
    }
    window.UFC_LOSS_CONTEXT_CATEGORY_COPY = { version:VERSION, appliedAt:new Date().toISOString(), charles:COPY_OVERRIDES['Charles Oliveira'] };
    document.documentElement.setAttribute('data-loss-context-category-copy', VERSION);
  }
  function wrapRender(){
    const api = window.UFC_CATEGORY_LEADERS;
    if(!api?.render || api.render.__lossContextCopyWrapped) return false;
    const original = api.render;
    api.render = function(){
      const result = original.apply(this, arguments);
      apply();
      return result;
    };
    api.render.__lossContextCopyWrapped = true;
    return true;
  }
  document.addEventListener('click', () => setTimeout(apply, 0), true);
  document.addEventListener('change', () => setTimeout(apply, 0), true);
  const start = () => { wrapRender(); apply(); setTimeout(apply, 300); setTimeout(apply, 900); };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
