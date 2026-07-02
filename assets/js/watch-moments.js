// Watch Moment links for fighter cards and profiles.
// Keep links here as app-facing content, separate from scoring.
(function(){
  const VERSION = 'watch-moments-20260701a';
  if(typeof DISPLAY_OVERRIDES === 'undefined') return;

  const WATCH_MOMENTS = {
    'Jon Jones': 'https://youtube.com/shorts/yG-D2r6HVp4?is=fstX4Wc_rvCITSw0',
    'Georges St-Pierre': 'https://youtube.com/shorts/Gb0lJf0-lZU?is=ViJReSsAfOjWw1xf'
  };

  Object.entries(WATCH_MOMENTS).forEach(([fighter, url]) => {
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter].watchUrl = url;
    DISPLAY_OVERRIDES[fighter].watchLabel = 'Watch Moment';
  });

  function injectCss(){
    if(document.getElementById('watch-moments-css')) return;
    const style = document.createElement('style');
    style.id = 'watch-moments-css';
    style.textContent = `
      .watch-moment-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;margin-top:7px;border:1px solid rgba(248,113,113,.35);background:rgba(248,113,113,.1);color:#fecaca;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;text-decoration:none;max-width:max-content}
      .watch-moment-link:hover{border-color:rgba(248,113,113,.75);background:rgba(248,113,113,.18);color:#fff}
      .profile-watch-moment{margin-top:14px;padding:9px 12px;font-size:12px;border-color:rgba(248,113,113,.45);background:rgba(248,113,113,.12)}
      .profile-watch-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
    `;
    document.head.appendChild(style);
  }

  function watchUrlFor(fighter){
    return DISPLAY_OVERRIDES[fighter]?.watchUrl || WATCH_MOMENTS[fighter] || '';
  }

  function addCardButtons(){
    document.querySelectorAll('.fighter-row[data-fighter]').forEach(row => {
      const fighter = row.dataset.fighter;
      const url = watchUrlFor(fighter);
      if(!url || row.querySelector('.watch-moment-link')) return;
      const target = row.querySelector('.row-main');
      if(!target) return;
      const a = document.createElement('a');
      a.className = 'watch-moment-link';
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = '▶ Watch Moment';
      a.addEventListener('click', e => e.stopPropagation());
      target.appendChild(a);
    });
  }

  function addProfileButton(){
    const detail = document.getElementById('fighterDetail');
    if(!detail || detail.querySelector('.profile-watch-moment')) return;
    const name = detail.querySelector('.profile-summary h2')?.textContent?.trim();
    const url = watchUrlFor(name);
    if(!name || !url) return;
    const summary = detail.querySelector('.profile-summary');
    if(!summary) return;
    const row = document.createElement('div');
    row.className = 'profile-watch-row';
    const a = document.createElement('a');
    a.className = 'watch-moment-link profile-watch-moment';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = '▶ Watch Signature Moment';
    a.addEventListener('click', e => e.stopPropagation());
    row.appendChild(a);
    summary.appendChild(row);
  }

  function apply(){
    injectCss();
    addCardButtons();
    addProfileButton();
    window.UFC_WATCH_MOMENTS = { version: VERSION, fighters: Object.keys(WATCH_MOMENTS) };
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });
  apply();
})();
