(function(){
  'use strict';

  const VERSION='app-update-watcher-20260715j-play-challenge-compat';
  const RESTORE_KEY='ufc-goat-manual-refresh-v1';
  const PROGRESS_KEY='ufc-goat-manual-refresh-progress-v1';
  const LEGACY_KEYS=['ufc-goat-update-restore-v1','ufc-goat-update-target-v1'];
  let progressTimers=[];

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

  function installButton(){
    const hero=document.querySelector('.hero');
    if(!hero||document.getElementById('manualRefreshBtn'))return;
    const style=document.createElement('style');
    style.textContent=`
      #manualRefreshControl{display:flex;flex:0 0 auto;align-self:flex-start;flex-direction:column;align-items:stretch;gap:4px;min-width:94px}
      #manualRefreshBtn{position:static;z-index:1;min-height:40px;padding:9px 13px;border:1px solid rgba(249,115,22,.72);border-radius:999px;background:rgba(10,13,19,.9);box-shadow:0 10px 30px rgba(0,0,0,.24);color:#fed7aa;font:800 .78rem/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.02em;white-space:nowrap;cursor:pointer}
      #manualRefreshBtn:active{transform:translateY(1px) scale(.98)}
      #manualRefreshBtn.refreshing{opacity:.82;pointer-events:none}
      #manualRefreshProgress{height:2px;width:calc(100% - 14px);margin:0 7px;border-radius:999px;overflow:hidden;background:rgba(249,115,22,.16);opacity:0;transition:opacity .16s ease}
      #manualRefreshProgress.visible{opacity:1}
      #manualRefreshProgressFill{display:block;height:100%;width:0;border-radius:inherit;background:#f97316;box-shadow:0 0 5px rgba(249,115,22,.7);transition:width .28s ease}
      @media (max-width:900px){#manualRefreshControl{order:-1;align-self:flex-end;min-width:88px}#manualRefreshBtn{min-height:38px;padding:8px 11px;font-size:.72rem}}
    `;
    document.head.appendChild(style);
    const control=document.createElement('div');
    control.id='manualRefreshControl';
    const button=document.createElement('button');
    button.id='manualRefreshBtn';
    button.type='button';
    button.textContent='↻ Refresh';
    button.setAttribute('aria-label','Refresh app for the latest updates');
    const progress=document.createElement('div');
    progress.id='manualRefreshProgress';
    progress.setAttribute('aria-hidden','true');
    progress.innerHTML='<i id="manualRefreshProgressFill"></i>';
    button.addEventListener('click',()=>networkRefresh(button));
    control.append(button,progress);
    hero.appendChild(control);
  }

  function loadChallengeCompatibility(){
    if(document.querySelector('script[data-play-challenge-compat]'))return;
    const script=document.createElement('script');
    script.src='assets/js/play-challenge-compat.js?v=play-challenge-compat-20260715a';
    script.dataset.playChallengeCompat='true';
    document.head.appendChild(script);
  }

  LEGACY_KEYS.forEach(key=>{try{sessionStorage.removeItem(key);}catch(_error){}});
  cleanRefreshParameter();
  installButton();
  loadChallengeCompatibility();
  resumeProgressIfNeeded();
  window.setTimeout(restoreState,250);
  window.UFC_APP_UPDATE_WATCHER={version:VERSION,networkRefresh,clearWebCaches};
})();