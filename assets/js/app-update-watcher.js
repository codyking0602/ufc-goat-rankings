(function(){
  'use strict';

  const VERSION='app-update-watcher-20260716m-whats-new-launch';
  const RESTORE_KEY='ufc-goat-manual-refresh-v1';
  const PROGRESS_KEY='ufc-goat-manual-refresh-progress-v1';
  const WHATS_NEW_KEY='ufc-whats-new-20260716';
  const LEGACY_KEYS=['ufc-goat-update-restore-v1','ufc-goat-update-target-v1'];
  let progressTimers=[];
  let whatsNewReturnFocus=null;

  function activeView(){return document.querySelector('.tab.active')?.dataset.view||'men';}
  function activePlayMode(){return document.querySelector('[data-play-mode].active')?.dataset.playMode||'top10';}

  function cleanRefreshParameter(){
    const url=new URL(window.location.href);
    let changed=false;
    ['__manual_refresh','__shell'].forEach(key=>{if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true;}});
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
    try{state=JSON.parse(sessionStorage.getItem(RESTORE_KEY)||'null');sessionStorage.removeItem(RESTORE_KEY);}catch(_error){}
    if(!state)return;
    setControlValue('search',state.search);
    setControlValue('eraFilter',state.era);
    setControlValue('divisionFilter',state.division);
    setControlValue('fighterA',state.fighterA);
    setControlValue('fighterB',state.fighterB);
    setControlValue('categoryBoardSelect',state.category);
    if(typeof window.refresh==='function'){try{window.refresh();}catch(_error){}}
    const tab=document.querySelector(`.tab[data-view="${state.activeView||'men'}"]`);
    if(tab)tab.click();
    if(state.activeView==='play'){
      const mode=document.querySelector(`[data-play-mode="${state.playMode||'top10'}"]`);
      if(mode)mode.click();
    }
    if(state.era)document.getElementById('eraFilter')?.dispatchEvent(new Event('change',{bubbles:true}));
    if(state.category)document.getElementById('categoryBoardSelect')?.dispatchEvent(new Event('change',{bubbles:true}));
    window.setTimeout(()=>window.scrollTo({top:Number(state.scrollY)||0,left:0,behavior:'auto'}),150);
  }

  function clearProgressTimers(){progressTimers.forEach(timer=>window.clearTimeout(timer));progressTimers=[];}
  function setProgress(percent,visible=true){
    const track=document.getElementById('manualRefreshProgress');
    const fill=document.getElementById('manualRefreshProgressFill');
    if(!track||!fill)return;
    track.classList.toggle('visible',visible);
    fill.style.width=`${Math.max(0,Math.min(100,percent))}%`;
  }
  function beginProgress(){
    clearProgressTimers();
    setProgress(8,true);
    progressTimers.push(window.setTimeout(()=>setProgress(38,true),90));
    progressTimers.push(window.setTimeout(()=>setProgress(62,true),260));
    progressTimers.push(window.setTimeout(()=>setProgress(76,true),520));
  }
  function finishProgress(){
    clearProgressTimers();
    setProgress(100,true);
    const button=document.getElementById('manualRefreshBtn');
    if(button){button.classList.remove('refreshing');button.removeAttribute('aria-busy');}
    try{sessionStorage.removeItem(PROGRESS_KEY);}catch(_error){}
    progressTimers.push(window.setTimeout(()=>document.getElementById('manualRefreshProgress')?.classList.remove('visible'),320));
    progressTimers.push(window.setTimeout(()=>setProgress(0,false),620));
  }

  function waitForPageReady(){
    if(document.readyState==='complete')return Promise.resolve();
    return new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));
  }
  function waitForModelReady(){
    if(window.UFC_SCORING_PIPELINE?.status==='ready'||document.documentElement.getAttribute('data-scoring-pipeline')==='ready')return Promise.resolve();
    if(window.UFC_SCORING_PIPELINE_READY&&typeof window.UFC_SCORING_PIPELINE_READY.then==='function')return Promise.resolve(window.UFC_SCORING_PIPELINE_READY).catch(()=>undefined);
    return new Promise(resolve=>{
      let settled=false;
      const done=()=>{
        if(settled)return;
        settled=true;
        window.removeEventListener('ufc-scoring-pipeline-ready',done);
        window.removeEventListener('ufc-scoring-pipeline-error',done);
        resolve();
      };
      window.addEventListener('ufc-scoring-pipeline-ready',done,{once:true});
      window.addEventListener('ufc-scoring-pipeline-error',done,{once:true});
      window.setTimeout(done,8000);
    });
  }

  function resumeProgressIfNeeded(){
    let shouldResume=false;
    try{shouldResume=sessionStorage.getItem(PROGRESS_KEY)==='1';}catch(_error){}
    if(!shouldResume)return;
    const button=document.getElementById('manualRefreshBtn');
    if(button){button.classList.add('refreshing');button.setAttribute('aria-busy','true');}
    setProgress(74,true);
    progressTimers.push(window.setTimeout(()=>setProgress(88,true),240));
    progressTimers.push(window.setTimeout(()=>setProgress(94,true),850));
    Promise.allSettled([waitForPageReady(),waitForModelReady()]).then(finishProgress);
  }

  async function clearWebCaches(){
    const jobs=[];
    if('caches'in window)jobs.push(caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key)))).catch(()=>undefined));
    if(navigator.serviceWorker?.getRegistrations)jobs.push(navigator.serviceWorker.getRegistrations().then(items=>Promise.all(items.map(item=>item.unregister()))).catch(()=>undefined));
    await Promise.allSettled(jobs);
  }

  async function networkRefresh(button){
    saveState();
    try{sessionStorage.setItem(PROGRESS_KEY,'1');}catch(_error){}
    button.classList.add('refreshing');
    button.setAttribute('aria-busy','true');
    beginProgress();
    await clearWebCaches();
    const url=new URL('index.html',window.location.href);
    url.searchParams.set('__manual_refresh',String(Date.now()));
    url.searchParams.set('__shell','network');
    window.setTimeout(()=>window.location.replace(url.toString()),80);
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
    if(target&&typeof target.focus==='function')target.focus();
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
    const playTab=document.querySelector('.tab[data-view="play"]');
    if(playTab)playTab.click();
    window.setTimeout(()=>window.scrollTo({top:0,left:0,behavior:'smooth'}),60);
  }

  function installWhatsNew(){
    if(document.getElementById('whatsNewOverlay'))return;
    const style=document.createElement('style');
    style.textContent=`
      body.whats-new-open{overflow:hidden}
      #manualRefreshControl{display:flex;flex:0 0 auto;align-self:flex-start;flex-direction:column;align-items:stretch;gap:4px;min-width:206px}
      #manualRefreshActions{display:flex;align-items:center;justify-content:flex-end;gap:7px}
      #manualRefreshBtn,#whatsNewBtn{position:static;z-index:1;min-height:40px;padding:9px 13px;border:1px solid rgba(249,115,22,.72);border-radius:999px;background:rgba(10,13,19,.9);box-shadow:0 10px 30px rgba(0,0,0,.24);color:#fed7aa;font:800 .78rem/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.02em;white-space:nowrap;cursor:pointer}
      #whatsNewBtn{border-color:rgba(255,255,255,.2);color:#f8fafc}
      #manualRefreshBtn:active,#whatsNewBtn:active{transform:translateY(1px) scale(.98)}
      #manualRefreshBtn.refreshing{opacity:.82;pointer-events:none}
      #manualRefreshProgress{height:2px;width:calc(100% - 14px);margin:0 7px;border-radius:999px;overflow:hidden;background:rgba(249,115,22,.16);opacity:0;transition:opacity .16s ease}
      #manualRefreshProgress.visible{opacity:1}
      #manualRefreshProgressFill{display:block;height:100%;width:0;border-radius:inherit;background:#f97316;box-shadow:0 0 5px rgba(249,115,22,.7);transition:width .28s ease}
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
      .whats-new-card-wide{grid-column:1/-1}
      .whats-new-label{display:flex;align-items:center;gap:9px;margin:0 0 8px;color:#fb923c;font:900 .75rem/1.2 system-ui;letter-spacing:.1em;text-transform:uppercase}
      .whats-new-label i{display:grid;place-items:center;width:25px;height:25px;border-radius:8px;background:rgba(249,115,22,.14);font-style:normal;letter-spacing:0}
      .whats-new-card h3{margin:0;color:#fff;font:850 1.08rem/1.2 system-ui}
      .whats-new-card p{margin:7px 0 0;color:#cbd5e1;font:500 .92rem/1.48 system-ui}
      .whats-new-fighters{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
      .whats-new-fighters span{padding:7px 10px;border:1px solid rgba(249,115,22,.24);border-radius:999px;background:rgba(249,115,22,.08);color:#ffedd5;font:750 .79rem/1.1 system-ui}
      .whats-new-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:24px}
      #whatsNewExplore{min-height:48px;padding:13px 20px;border:0;border-radius:12px;background:#f97316;color:#1b0c03;font:950 .86rem/1 system-ui;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
      .whats-new-once{color:#94a3b8;font:650 .76rem/1.35 system-ui;text-align:right}
      @media (max-width:900px){#manualRefreshControl{order:-1;align-self:flex-end;min-width:196px}#manualRefreshBtn,#whatsNewBtn{min-height:38px;padding:8px 11px;font-size:.72rem}}
      @media (max-width:620px){#whatsNewOverlay{padding:10px;place-items:start center}#whatsNewDialog{max-height:none;margin:10px 0;border-radius:19px}#whatsNewContent{padding:29px 18px 21px}.whats-new-grid{grid-template-columns:1fr}.whats-new-card-wide{grid-column:auto}.whats-new-actions{align-items:stretch;flex-direction:column}#whatsNewExplore{width:100%}.whats-new-once{text-align:center}.whats-new-title{padding-right:34px}}
      @media (max-width:430px){#manualRefreshControl{min-width:0;width:100%}#manualRefreshActions{justify-content:stretch}#manualRefreshBtn,#whatsNewBtn{flex:1;padding-left:8px;padding-right:8px}}
    `;
    document.head.appendChild(style);

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
            <article class="whats-new-card">
              <p class="whats-new-label"><i>🎮</i> Game tab rebuilt</p>
              <h3>More ways to settle the debate</h3>
              <p>Play rebuilt UFC games including Blind Rank, Keep 4 Cut 4, Find the Leader, Blind Resume, and more.</p>
            </article>
            <article class="whats-new-card">
              <p class="whats-new-label"><i>🧠</i> Intelligence rebuilt</p>
              <h3>Ask anything about the rankings</h3>
              <p>Use Octagon Verdict for fighter scores, comparisons, category results, judgment calls, and future GOAT scenarios.</p>
            </article>
            <article class="whats-new-card">
              <p class="whats-new-label"><i>🥊</i> Picks card updated</p>
              <h3>The live card reflects the change</h3>
              <p>The dropped fight was removed and its replacement matchup was added to the current Picks card.</p>
            </article>
            <article class="whats-new-card">
              <p class="whats-new-label"><i>➕</i> New fighters added</p>
              <h3>Five more names enter the rankings</h3>
              <div class="whats-new-fighters" aria-label="New fighters">
                <span>Alexandre Pantoja</span><span>Paddy Pimblett</span><span>Chris Weidman</span><span>Tom Aspinall</span><span>Quinton “Rampage” Jackson</span>
              </div>
            </article>
          </div>
          <div class="whats-new-actions">
            <button id="whatsNewExplore" type="button">Explore the Update</button>
            <span class="whats-new-once">Shown once per major update.<br>Reopen anytime from What’s New.</span>
          </div>
        </div>
      </section>
    `;
    document.body.appendChild(overlay);

    document.getElementById('whatsNewClose')?.addEventListener('click',closeWhatsNew);
    document.getElementById('whatsNewExplore')?.addEventListener('click',exploreUpdate);
    overlay.addEventListener('click',event=>{if(event.target===overlay)closeWhatsNew();});
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!overlay.hidden)closeWhatsNew();
    });
  }

  function installButton(){
    const hero=document.querySelector('.hero');
    if(!hero||document.getElementById('manualRefreshBtn'))return;
    installWhatsNew();
    const control=document.createElement('div');
    control.id='manualRefreshControl';
    const actions=document.createElement('div');
    actions.id='manualRefreshActions';
    const button=document.createElement('button');
    button.id='manualRefreshBtn';
    button.type='button';
    button.textContent='↻ Refresh';
    button.setAttribute('aria-label','Refresh app for the latest updates');
    const whatsNew=document.createElement('button');
    whatsNew.id='whatsNewBtn';
    whatsNew.type='button';
    whatsNew.textContent='What’s New';
    whatsNew.setAttribute('aria-label','Open the latest update announcement');
    const progress=document.createElement('div');
    progress.id='manualRefreshProgress';
    progress.setAttribute('aria-hidden','true');
    progress.innerHTML='<i id="manualRefreshProgressFill"></i>';
    button.addEventListener('click',()=>networkRefresh(button));
    whatsNew.addEventListener('click',()=>openWhatsNew(whatsNew));
    actions.append(button,whatsNew);
    control.append(actions,progress);
    hero.appendChild(control);
  }

  function loadScriptOnce(selector,src,datasetKey){
    if(document.querySelector(selector))return;
    const script=document.createElement('script');
    script.src=src;
    script.dataset[datasetKey]='true';
    document.head.appendChild(script);
  }

  function loadChallengeCompatibility(){
    loadScriptOnce('script[src*="play-challenge-compat.js"]','assets/js/play-challenge-compat.js?v=play-challenge-compat-20260715b-full-ready-identity','playChallengeCompat');
  }

  function loadBlindDailyStartupFix(){
    loadScriptOnce('script[src*="blind-daily-startup-fix.js"]','assets/js/blind-daily-startup-fix.js?v=blind-daily-startup-fix-20260715a','blindDailyStartupFix');
  }

  function loadDailyLeaderboard(){
    loadScriptOnce('script[src*="play-daily-leaderboard.js"]','assets/js/play-daily-leaderboard.js?v=play-daily-leaderboard-20260715a','playDailyLeaderboard');
  }

  function showWhatsNewOnce(){
    if(hasSeenWhatsNew())return;
    window.setTimeout(()=>openWhatsNew(),650);
  }

  LEGACY_KEYS.forEach(key=>{try{sessionStorage.removeItem(key);}catch(_error){}});
  cleanRefreshParameter();
  installButton();
  loadChallengeCompatibility();
  loadBlindDailyStartupFix();
  loadDailyLeaderboard();
  resumeProgressIfNeeded();
  window.setTimeout(restoreState,250);
  showWhatsNewOnce();
  window.UFC_APP_UPDATE_WATCHER={version:VERSION,networkRefresh,clearWebCaches,openWhatsNew};
})();
