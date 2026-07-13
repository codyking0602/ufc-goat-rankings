(function(){
  'use strict';

  const CHECK_INTERVAL_MS = 30000;
  const RESTORE_KEY = 'ufc-goat-update-restore-v1';
  const PROTECTED_VIEWS = new Set(['play','picks']);

  const currentBuild = document.querySelector('meta[name="app-build"]')?.getAttribute('content') || '';
  let pendingBuild = '';
  let updatePending = false;
  let checking = false;
  let reloading = false;

  function activeView(){
    return document.querySelector('.tab.active')?.dataset.view || 'men';
  }

  function isProtectedView(view=activeView()){
    return PROTECTED_VIEWS.has(view);
  }

  function buildFromDocument(doc){
    return doc.querySelector('meta[name="app-build"]')?.getAttribute('content') || '';
  }

  function installNotice(){
    if(document.getElementById('ufcUpdateNotice')) return;
    const style = document.createElement('style');
    style.textContent = `
      #ufcUpdateNotice{position:fixed;z-index:100000;left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));bottom:max(12px,calc(env(safe-area-inset-bottom) + 10px));max-width:560px;margin:0 auto;padding:13px 15px;border:1px solid rgba(249,115,22,.72);border-radius:15px;background:rgba(10,13,19,.96);box-shadow:0 18px 55px rgba(0,0,0,.45);color:#fff;display:flex;align-items:center;gap:12px;transform:translateY(145%);opacity:0;pointer-events:none;transition:transform .22s ease,opacity .22s ease;font-family:inherit;backdrop-filter:blur(14px)}
      #ufcUpdateNotice.show{transform:translateY(0);opacity:1}
      #ufcUpdateNotice .update-dot{width:10px;height:10px;border-radius:999px;background:#f97316;box-shadow:0 0 0 5px rgba(249,115,22,.14);flex:0 0 auto}
      #ufcUpdateNotice.updating .update-dot{animation:ufcUpdatePulse .9s ease-in-out infinite alternate}
      #ufcUpdateNotice strong{display:block;font-size:.9rem;line-height:1.15;letter-spacing:.02em}
      #ufcUpdateNotice span{display:block;margin-top:3px;color:#cbd5e1;font-size:.78rem;line-height:1.3}
      @keyframes ufcUpdatePulse{to{transform:scale(1.45);opacity:.58}}
    `;
    document.head.appendChild(style);

    const notice = document.createElement('div');
    notice.id = 'ufcUpdateNotice';
    notice.setAttribute('role','status');
    notice.setAttribute('aria-live','polite');
    notice.innerHTML = '<i class="update-dot"></i><div><strong>Update ready</strong><span>Your game is safe. The app will refresh when you finish.</span></div>';
    document.body.appendChild(notice);
  }

  function showNotice(mode,view=activeView()){
    installNotice();
    const notice = document.getElementById('ufcUpdateNotice');
    const title = notice.querySelector('strong');
    const copy = notice.querySelector('span');
    notice.classList.toggle('updating',mode === 'updating');

    if(mode === 'updating'){
      title.textContent = 'Updating app…';
      copy.textContent = 'Loading the newest rankings and features.';
    } else {
      const viewLabel = view === 'picks' ? 'Picks' : 'Play';
      title.textContent = 'Update ready';
      copy.textContent = `Your ${viewLabel} session is safe. The app will refresh when you leave this tab.`;
    }
    requestAnimationFrame(() => notice.classList.add('show'));
  }

  function captureRestoreState(viewOverride=''){
    const drawer = document.getElementById('drawer');
    const state = {
      activeView: viewOverride || activeView(),
      search: document.getElementById('search')?.value || '',
      division: document.getElementById('divisionFilter')?.value || 'All',
      fighterA: document.getElementById('fighterA')?.value || '',
      fighterB: document.getElementById('fighterB')?.value || '',
      category: document.getElementById('categoryBoardSelect')?.value || '',
      drawerFighter: drawer?.classList.contains('open') ? document.querySelector('#fighterDetail h2')?.textContent?.trim() || '' : '',
      scrollY: window.scrollY || 0
    };
    try { sessionStorage.setItem(RESTORE_KEY,JSON.stringify(state)); }
    catch(_error){}
  }

  function restoreState(){
    let state = null;
    try {
      state = JSON.parse(sessionStorage.getItem(RESTORE_KEY) || 'null');
      sessionStorage.removeItem(RESTORE_KEY);
    } catch(_error){}
    if(!state) return;

    const setValue = (id,value) => {
      const node = document.getElementById(id);
      if(node && value !== undefined && value !== null && [...(node.options || [])].some(option => option.value === value)) node.value = value;
      else if(node && !node.options) node.value = value || '';
    };

    setValue('search',state.search);
    setValue('divisionFilter',state.division);
    setValue('fighterA',state.fighterA);
    setValue('fighterB',state.fighterB);
    setValue('categoryBoardSelect',state.category);

    if(typeof window.refresh === 'function'){
      try { window.refresh(); } catch(_error){}
    }

    const safeView = isProtectedView(state.activeView) ? 'men' : (state.activeView || 'men');
    const tab = document.querySelector(`.tab[data-view="${safeView}"]`);
    if(tab) tab.click();

    if(state.category){
      document.getElementById('categoryBoardSelect')?.dispatchEvent(new Event('change',{bubbles:true}));
    }
    if(state.drawerFighter && typeof window.openFighter === 'function'){
      try { window.openFighter(state.drawerFighter); } catch(_error){}
    }
    window.setTimeout(() => window.scrollTo({top:Number(state.scrollY) || 0,left:0,behavior:'auto'}),120);
  }

  function cleanUpdateParameter(){
    const url = new URL(window.location.href);
    if(!url.searchParams.has('__app_update')) return;
    url.searchParams.delete('__app_update');
    const clean = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state,'',clean);
  }

  function forceReload(){
    const url = new URL(window.location.href);
    url.searchParams.set('__app_update',String(Date.now()));
    window.location.replace(url.toString());
  }

  function applyUpdate(viewOverride=''){
    const targetView = viewOverride || activeView();
    if(reloading || !updatePending || isProtectedView(targetView) || document.visibilityState === 'hidden') return;
    reloading = true;
    captureRestoreState(targetView);
    showNotice('updating',targetView);
    window.setTimeout(forceReload,350);
  }

  function queueUpdate(build){
    if(!build || build === currentBuild) return;
    pendingBuild = build;
    updatePending = true;
    const view = activeView();
    if(isProtectedView(view)) showNotice('deferred',view);
    else applyUpdate(view);
  }

  async function checkForUpdate(){
    if(checking || reloading || document.visibilityState === 'hidden' || !navigator.onLine) return;
    checking = true;
    try {
      const url = new URL('index.html',window.location.href);
      url.searchParams.set('__update_check',String(Date.now()));
      const response = await fetch(url.toString(),{
        cache:'no-store',
        credentials:'same-origin',
        headers:{'Cache-Control':'no-cache'}
      });
      if(!response.ok) return;
      const html = await response.text();
      const remote = new DOMParser().parseFromString(html,'text/html');
      queueUpdate(buildFromDocument(remote));
    } catch(_error){
      // Quietly retry on the next interval or foreground event.
    } finally {
      checking = false;
    }
  }

  function handleSafeBoundary(viewOverride=''){
    if(!updatePending) return;
    const targetView = viewOverride || activeView();
    if(isProtectedView(targetView)) showNotice('deferred',targetView);
    else applyUpdate(targetView);
  }

  cleanUpdateParameter();
  installNotice();
  restoreState();

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click',() => window.setTimeout(() => handleSafeBoundary(tab.dataset.view || ''),0));
  });
  document.addEventListener('visibilitychange',() => {
    if(document.visibilityState !== 'visible') return;
    handleSafeBoundary();
    checkForUpdate();
  });
  window.addEventListener('focus',() => {
    handleSafeBoundary();
    checkForUpdate();
  });
  window.addEventListener('online',checkForUpdate);
  window.setInterval(checkForUpdate,CHECK_INTERVAL_MS);
  window.setTimeout(checkForUpdate,2500);
})();
