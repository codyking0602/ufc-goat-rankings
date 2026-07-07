// Polishes Category Leaders copy for formula-live Loss Context.
(function(){
  const VERSION = 'loss-context-category-copy-20260707a';
  const SUMMARY = '<strong>Loss Context · {board}</strong><br>Ranks loss damage by type: pre-prime, prime, post-prime, elite/upward-division, finish, and weird-result context. Showing {count} fighters.';
  function activeBoardLabel(){
    const select = document.getElementById('categoryLeaderBoard');
    return select?.value === 'women' ? 'Women' : 'Men';
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
    }
    window.UFC_LOSS_CONTEXT_CATEGORY_COPY = { version:VERSION, appliedAt:new Date().toISOString() };
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
  const start = () => { wrapRender(); apply(); setTimeout(apply, 300); };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
