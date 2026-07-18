(function(){
  'use strict';

  const VERSION='app-update-watcher-20260717r-on-demand-play-support';
  const RESTORE_KEY='ufc-goat-manual-refresh-v1';
  const PROGRESS_KEY='ufc-goat-manual-refresh-progress-v1';
  const WHATS_NEW_KEY='ufc-whats-new-20260717-anthony-pettis';
  const LEGACY_KEYS=['ufc-goat-update-restore-v1','ufc-goat-update-target-v1'];
  let whatsNewReturnFocus=null;
  let playSupportScheduled=false;

  function activeView(){
    return document.querySelector('.tab.active')?.dataset.view
      || document.querySelector('.view.active-view')?.id
      || 'home';
  }

  function activePlayMode(){
    return document.querySelector('[data-play-mode].active')?.dataset.playMode||'top10';
  }

  function cleanRefreshState(){
    try{sessionStorage.removeItem(PROGRESS_KEY);}catch(_error){}
    const button=document.getElementById('manualRefreshBtn');
    button?.classList.remove('refreshing');
    button?.removeAttribute('aria-busy');
    if(button)delete button.dataset.refreshBusy;
    const track=document.getElementById('manualRefreshProgress');
    track?.classList.remove('visible');
    track?.setAttribute('aria-hidden','true');
    const fill=document.getElementById('manualRefreshProgressFill');
    if(fill)fill.style.width='0%';

    const url=new URL(window.location.href);
    let changed=false;
    ['__manual_refresh','__shell'].forEach(key=>{
      if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true;}
    });
    if(changed)window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);
  }

  function saveState(){
    const state={
      activeView:activeView(),
      playMode:activePlayMode(),
      search:document.getElementById('search')?.value||'',
      era:document.getElementById('eraFilter')?.value||'All',
      division:document.getElementById('divisionFilter')?.value||'All',
      fighterA:document.getElementById('fighterA')?.value||'',
      fighterB:document.getElementById('fighterB')?.value||'',
      category:document.getElementById('categoryBoardSelect')?.value||'',
      scrollY:window.scrollY||0
    };
    try{sessionStorage.setItem(RESTORE_KEY,JSON.stringify(state));}catch(_error){}
  }

  function setControlValue(id,value){
    const node=document.getElementById(id);
    if(!node)return;
    if(node.options){
      if([...node.options].some(option=>option.value===value))node.value=value;
      return;
    }
    node.value=value||'';
  }

  function restoreState(){
    let state=null;
    try{
      state=JSON.parse(sessionStorage.getItem(RESTORE_KEY)||'null');
      sessionStorage.removeItem(RESTORE_KEY);
    }catch(_error){}
    if(!state)return;

    setControlValue('search',state.search);
    setControlValue('eraFilter',state.era);
    setControlValue('divisionFilter',state.division);
    setControlValue('fighterA',state.fighterA);
    setControlValue('fighterB',state.fighterB);
    setControlValue('categoryBoardSelect',state.category);

    const rankingView=['men','women','division','categories'].includes(state.activeView);
    if(rankingView&&typeof window.refresh==='function'){
      try{window.refresh();}catch(_error){}
    }

    const target=document.querySelector(`.tab[data-view="${state.activeView||'home'}"]`);
    target?.click();
    if(state.activeView==='play'){
      schedulePlaySupport();
      document.querySelector(`[data-play-mode="${state.playMode||'top10'}"]`)?.click();
    }
    if(state.era)document.getElementById('eraFilter')?.dispatchEvent(new Event('change',{bubbles:true}));
    if(state.category)document.getElementById('categoryBoardSelect')?.dispatchEvent(new Event('change',{bubbles:true}));
    window.setTimeout(()=>window.scrollTo({top:Number(state.scrollY)||0,left:0,behavior:'auto'}),100);
  }

  function showQuickProgress(button){
    if(!button)return;
    button.classList.add('refreshing');
    button.setAttribute('aria-busy','true');
    const track=document.getElementById('manualRefreshProgress');
    const fill=document.getElementById('manualRefreshProgressFill');
    track?.classList.add('visible');
    track?.setAttribute('aria-hidden','false');
    if(fill){
      fill.style.width='28%';
      window.setTimeout(()=>{fill.style.width='88%';},20);
    }
  }

  function networkRefresh(button){
    if(button?.dataset.refreshBusy==='true')return;
    if(button)button.dataset.refreshBusy='true';
    saveState();
    showQuickProgress(button);
    const url=new URL('index.html',window.location.href);
    url.searchParams.set('__manual_refresh',String(Date.now()));
    url.searchParams.set('__shell','light');
    url.hash=window.location.hash;
    window.setTimeout(()=>window.location.replace(url.toString()),50);
  }

  function markWhatsNewSeen(){
    try{localStorage.setItem(WHATS_NEW_KEY,'1');}catch(_error){}
  }

  function hasSeenWhatsNew(){
    try{return localStorage.getItem(WHATS_NEW_KEY)==='1';}catch(_error){return false;}
  }

  function closeWhatsNew(){
    const overlay=document.getElementById('whatsNewOverlay');
    if(!overlay||overlay.hidden)return;
    markWhatsNewSeen();
    overlay.hidden=true;
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('whats-new-open');
    const target=whatsNewReturnFocus;
    whatsNewReturnFocus=null;
    target?.focus?.();
  }

  function openWhatsNew(trigger){
    const overlay=document.getElementById('whatsNewOverlay');
    if(!overlay)return;
    whatsNewReturnFocus=trigger||document.activeElement;
    overlay.hidden=false;
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('whats-new-open');
    window.setTimeout(()=>document.getElementById('whatsNewClose')?.focus(),30);
  }

  function exploreUpdate(){
    closeWhatsNew();
    window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('play')
      || document.querySelector('.tab[data-view="play"]')?.click();
    window.setTimeout(()=>window.scrollTo({top:0,left:0,behavior:'smooth'}),60);
  }

  function injectStyles(){
    if(document.getElementById('appUpdateWatcherStyles'))return;
    const style=document.createElement('style');
    style.id='appUpdateWatcherStyles';
    style.textContent=`
      body.whats-new-open{overflow:hidden}
      #manualRefreshControl{display:flex;flex:0 0 auto;align-self:flex-start;flex-direction:column;align-items:stretch;gap:4px;min-width:206px}
      #manualRefreshActions{display:flex;align-items:center;justify-content:flex-end;gap:7px}
      #manualRefreshBtn,#whatsNewBtn{position:static;z-index:1;min-height:40px;padding:9px 13px;border:1px solid rgba(249,115,22,.72);border-radius:999px;background:rgba(10,13,19,.9);box-shadow:0 10px 30px rgba(0,0,0,.24);color:#fed7aa;font:800 .78rem/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.02em;white-space:nowrap;cursor:pointer}
      #whatsNewBtn{border-color:rgba(255,255,255,.2);color:#f8fafc}
      #manualRefreshBtn:active,#whatsNewBtn:active{transform:translateY(1px) scale(.98)}
      #manualRefreshBtn.refreshing{opacity:.82;pointer-events:none}
      #manualRefreshProgress{height:2px;width:calc(100% - 14px);margin:0 7px;border-radius:999px;overflow:hidden;background:rgba(249,115,22,.16);opacity:0;transition:opacity .12s ease}
      #manualRefreshProgress.visible{opacity:1}
      #manualRefreshProgressFill{display:block;height:100%;width:0;border-radius:inherit;background:#f97316;box-shadow:0 0 5px rgba(249,115,22,.7);transition:width .12s ease}
      #whatsNewOverlay[hidden]{display:none!important}
      #whatsNewOverlay{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:rgba(2,4,8,.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);overflow-y:auto}
      #whatsNewDialog{position:relative;width:min(760px,100%);max-height:calc(100vh - 36px);overflow:auto;border:1px solid rgba(249,115,22,.5);border-radius:24px;background:linear-gradient(145deg,#161b24 0%,#0a0d13 58%,#090b10 100%);box-shadow:0 30px 90px rgba(0,0,0,.62);color:#f8fafc}
      #whatsNewDialog:before{content:"";position:absolute;inset:0 0 auto;height:5px;border-radius:24px 24px 0 0;background:linear-gradient(90deg,#f97316,#fb923c 56%,#f97316)}
      #whatsNewClose{position:absolute;top:15px;right:15px;width:40px;height:40px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(0,0,0,.28);color:#fff;font:500 1.45rem/1 system-ui;cursor:pointer}
      #whatsNewContent{padding:34px 34px 30px}
      .whats-new-kicker{margin:0 0 8px;color:#fb923c;font:900 .76rem/1.2 system-ui;letter-spacing:.16em;text-transform:uppercase}
      .whats-new-title{max-width:610px;margin:0;color:#fff;font:950 clamp(2rem,6vw,4.15rem)/.93 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.055em;text-transform:uppercase}
      .whats-new-deck{margin:16px 0 0;color:#cbd5e1;font:600 1rem/1.55 system-ui}
      .whats-new-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:24px}
      .whats-new-card{min-width:0;padding:18px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(255,255,255,.045)}
      .whats-new-label{display:flex;align-items:center;gap:9px;margin:0 0 8px;color:#fb923c;font:900 .75rem/1.2 system-ui;letter-spacing:.1em;text-transform:uppercase}
      .whats-new-label i{display:grid;place-items:center;width:25px;height:25px;border-radius:8px;background:rgba(249,115,22,.14);font-style:normal;letter-spacing:0}
      .whats-new-card h3{margin:0;color:#fff;font:850 1.08rem/1.2 system-ui}
      .whats-new-card p{margin:7px 0 0;color:#cbd5e1;font:500 .92rem/1.48 system-ui}
      .whats-new-fighters{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
      .whats-new-fighters span{padding:7px 10px;border:1px solid rgba(249,115,22,.24);border-radius:999px;background:rgba(249,115,22,.08);color:#ffedd5;font:750 .79rem/1.1 system-ui}
      .whats-new-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:24px}
      #whatsNewExplore{min-height:48px;padding:13px 20px;border:0;border-radius:12px;background:#f97316;color:#1b0c03;font:950 .86rem/1 system-ui;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
      .whats-new-once{color:#94a3b8;font:650 .76rem/1.35 system-ui;text-align:right}
      @media(max-width:900px){#manualRefreshControl{order:-1;align-self:flex-end;min-width:196px}#manualRefreshBtn,#whatsNewBtn{min-height:38px;padding:8px 11px;font-size:.72rem}}
      @media(max-width:620px){#whatsNewOverlay{padding:10px;place-items:start center}#whatsNewDialog{max-height:none;margin:10px 0;border-radius:19px}#whatsNewContent{padding:29px 18px 21px}.whats-new-grid{grid-template-columns:1fr}.whats-new-actions{align-items:stretch;flex-direction:column}#whatsNewExplore{width:100%}.whats-new-once{text-align:center}.whats-new-title{padding-right:34px}}
      @media(max-width:430px){#manualRefreshControl{min-width:0;width:100%}#manualRefreshActions{justify-content:stretch}#manualRefreshBtn,#whatsNewBtn{flex:1;padding-left:8px;padding-right:8px}}
    `;
    document.head.appendChild(style);
  }

  function installWhatsNew(){
    if(document.getElementById('whatsNewOverlay'))return;
    const overlay=document.createElement('div');
    overlay.id='whatsNewOverlay';
    overlay.hidden=true;
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML=`
      <section id="whatsNewDialog" role="dialog" aria-modal="true" aria-labelledby="whatsNewTitle" aria-describedby="whatsNewDescription">
        <button id="whatsNewClose" type="button" aria-label="Close update announcement">×</button>
        <div id="whatsNewContent">
          <p class="whats-new-kicker">Update complete</p>
          <h2 id="whatsNewTitle" class="whats-new-title">The Octagon Just Got Bigger</h2>
          <p id="whatsNewDescription" class="whats-new-deck">The biggest UFC GOAT Rankings update yet is live.</p>
          <div class="whats-new-grid">
            <article class="whats-new-card"><p class="whats-new-label"><i>🎮</i> Game tab rebuilt</p><h3>More ways to settle the debate</h3><p>Play Find the Leader every day, plus Blind Rank, Keep 4 Cut 4, Blind Resume, and more.</p></article>
            <article class="whats-new-card"><p class="whats-new-label"><i>🧠</i> Intelligence rebuilt</p><h3>Ask anything about the rankings</h3><p>Use Octagon Verdict for fighter scores, comparisons, category results, judgment calls, and future GOAT scenarios.</p></article>
            <article class="whats-new-card"><p class="whats-new-label"><i>🥊</i> Picks card updated</p><h3>The live card reflects the change</h3><p>The current Picks card includes the latest matchups, odds, standings, and main-event breakdown.</p></article>
            <article class="whats-new-card"><p class="whats-new-label"><i>➕</i> New fighters added</p><h3>Seven more names enter the rankings</h3><div class="whats-new-fighters"><span>Alexandre Pantoja</span><span>Paddy Pimblett</span><span>Chris Weidman</span><span>Tom Aspinall</span><span>Quinton “Rampage” Jackson</span><span>Brandon Moreno</span><span>Anthony Pettis</span></div></article>
          </div>
          <div class="whats-new-actions"><button id="whatsNewExplore" type="button">Explore the Update</button><span class="whats-new-once">Shown once per major update.<br>Reopen anytime from What’s New.</span></div>
        </div>
      </section>`;
    document.body.appendChild(overlay);
    document.getElementById('whatsNewClose')?.addEventListener('click',closeWhatsNew);
    document.getElementById('whatsNewExplore')?.addEventListener('click',exploreUpdate);
    overlay.addEventListener('click',event=>{if(event.target===overlay)closeWhatsNew();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!overlay.hidden)closeWhatsNew();});
  }

  function installButton(){
    const hero=document.querySelector('.hero');
    if(!hero)return;
    let control=document.getElementById('manualRefreshControl');
    if(!control){
      control=document.createElement('div');
      control.id='manualRefreshControl';
      control.innerHTML='<div id="manualRefreshActions"><button id="manualRefreshBtn" type="button" aria-label="Refresh app for the latest updates">↻ Refresh</button><button id="whatsNewBtn" type="button" aria-label="Open the latest update announcement">What’s New</button></div><div id="manualRefreshProgress" aria-hidden="true"><i id="manualRefreshProgressFill"></i></div>';
      hero.appendChild(control);
    }
    const refreshButton=document.getElementById('manualRefreshBtn');
    if(refreshButton&&!refreshButton.dataset.currentRefreshBound){
      refreshButton.dataset.currentRefreshBound='true';
      refreshButton.addEventListener('click',event=>networkRefresh(event.currentTarget));
    }
    const whatsNewButton=document.getElementById('whatsNewBtn');
    if(whatsNewButton&&!whatsNewButton.dataset.currentWhatsNewBound){
      whatsNewButton.dataset.currentWhatsNewBound='true';
      whatsNewButton.addEventListener('click',event=>openWhatsNew(event.currentTarget));
    }
  }

  function loadScript(id,src){
    if(document.getElementById(id))return;
    document.querySelectorAll(`script[data-deferred-guard="${id}"]`).forEach(node=>node.remove());
    const script=document.createElement('script');
    script.id=id;
    script.src=src;
    script.async=true;
    document.head.appendChild(script);
  }

  function loadPermanentDaily(){
    loadScript('playPermanentDailyController','assets/js/play-daily-rotation.js?v=play-daily-controller-20260717e-find-leader-permanent');
  }

  function loadDailyLeaderboard(){
    loadScript('playDailyLeaderboardCurrent','assets/js/play-daily-leaderboard.js?v=play-daily-leaderboard-20260717e-find-leader-only');
  }

  function loadChallengeCompat(){
    loadScript('playChallengeCompatCurrent','assets/js/play-challenge-compat.js?v=play-challenge-compat-20260717c-on-demand');
  }

  function loadBlindSupport(){
    loadScript('blindDailyStartupFixCurrent','assets/js/blind-daily-startup-fix.js?v=blind-daily-startup-fix-20260717f-on-demand');
  }

  function schedulePlaySupport(){
    if(playSupportScheduled)return;
    playSupportScheduled=true;
    requestAnimationFrame(()=>{
      loadPermanentDaily();
      const loadBoard=()=>loadDailyLeaderboard();
      if(typeof requestIdleCallback==='function')requestIdleCallback(loadBoard,{timeout:900});
      else window.setTimeout(loadBoard,250);
    });
  }

  function bindDeferredSupport(){
    if(document.documentElement.dataset.playSupportBinding===VERSION)return;
    document.documentElement.dataset.playSupportBinding=VERSION;
    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination==='play')schedulePlaySupport();
    });
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-open-game="blind"],[data-play-mode="blind"],[data-five-round-replay]'))loadBlindSupport();
      if(event.target.closest?.('[data-kc-challenge],[data-br-challenge],[data-five-round-share]'))loadChallengeCompat();
    },true);
  }

  LEGACY_KEYS.forEach(key=>{try{sessionStorage.removeItem(key);}catch(_error){}});
  cleanRefreshState();
  injectStyles();
  installWhatsNew();
  installButton();
  bindDeferredSupport();
  window.setTimeout(restoreState,160);
  if(!hasSeenWhatsNew())window.setTimeout(()=>openWhatsNew(),650);

  window.UFC_APP_UPDATE_WATCHER={
    version:VERSION,
    networkRefresh,
    openWhatsNew,
    restoreState,
    schedulePlaySupport,
    loadPermanentDaily,
    loadDailyLeaderboard,
    loadChallengeCompat,
    loadBlindSupport,
    mode:'lightweight-on-demand'
  };
  document.documentElement.setAttribute('data-app-update-watcher',VERSION);
})();