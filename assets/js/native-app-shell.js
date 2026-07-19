(function(){
  'use strict';

  if(window.__UFC_NATIVE_APP_SHELL_STARTED__)return;
  window.__UFC_NATIVE_APP_SHELL_STARTED__=true;

  const VERSION='native-app-shell-20260718a-phase-4a';
  const MOBILE_QUERY='(max-width: 900px)';
  const REFRESH_THRESHOLD=74;
  const NAV_ITEMS=[
    {key:'home',label:'Home',icon:'home'},
    {key:'rankings',label:'Rankings',icon:'rankings'},
    {key:'play',label:'Play',icon:'play'},
    {key:'picks',label:'Picks',icon:'picks'},
    {key:'war-room',label:'War Room',icon:'war-room'}
  ];

  const state={
    started:false,
    pulling:false,
    refreshing:false,
    armed:false,
    startY:0,
    distance:0,
    observer:null,
    badgeTimer:0,
    transitionTimer:0,
    pullResetTimer:0
  };

  const text=value=>String(value??'').trim();
  const mobile=()=>window.matchMedia?.(MOBILE_QUERY).matches!==false;
  const shell=()=>window.UFC_APP_SHELL||window.UFC_PRODUCT_ARCHITECTURE||null;

  function icon(name){
    const paths={
      home:'<path d="M3.5 10.8 12 3.8l8.5 7v9.4a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8Z"/><path d="M9 22v-7h6v7"/>',
      rankings:'<path d="M8 4h8v4a4 4 0 0 1-8 0Z"/><path d="M6 5H3v2a4 4 0 0 0 4 4M18 5h3v2a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6"/>',
      play:'<path d="M8.5 5.8 19 12 8.5 18.2Z"/>',
      picks:'<path d="M6 3.5h12a2 2 0 0 1 2 2v15H4v-15a2 2 0 0 1 2-2Z"/><path d="m8 10 2.2 2.2L16 6.8M8 16h8"/>',
      'war-room':'<path d="M4 5.5h16v10H9l-5 4Z"/><path d="M8 9h8M8 12h5"/>',
      ask:'<path d="M12 3.5a7.5 7.5 0 1 0 4.9 13.2L21 20l-1.4-4.7A7.5 7.5 0 0 0 12 3.5Z"/><path d="M9.6 9.2a2.7 2.7 0 0 1 5.1 1.2c0 1.9-2.7 2-2.7 3.7M12 17.2h.01"/>',
      refresh:'<path d="M20 6v5h-5"/><path d="M19 11a7.5 7.5 0 1 0 .2 5"/>',
      check:'<path d="m5 12.5 4.2 4.2L19 7"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.play}</svg>`;
  }

  function ensureBottomNav(){
    let nav=document.querySelector('[data-native-bottom-nav]');
    if(nav)return nav;
    nav=document.createElement('nav');
    nav.className='native-bottom-nav';
    nav.dataset.nativeBottomNav='true';
    nav.setAttribute('aria-label','Primary app navigation');
    nav.innerHTML=NAV_ITEMS.map(item=>`<button type="button" class="native-nav-button" data-native-destination="${item.key}" aria-label="Open ${item.label}" aria-selected="false">${icon(item.icon)}<span>${item.label}</span><b class="native-nav-badge" data-native-badge="${item.key}" hidden></b></button>`).join('');
    document.body.appendChild(nav);
    nav.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-native-destination]');
      if(!button||button.getAttribute('aria-disabled')==='true')return;
      const key=button.dataset.nativeDestination;
      shell()?.activateDestination?.(key);
      if(key==='war-room')window.setTimeout(()=>window.UFC_OCTAGON_NOTIFICATIONS?.markSeen?.(),700);
    });
    return nav;
  }

  function ensureAskAction(){
    const hero=document.querySelector('.hero');
    if(!hero)return null;
    let tools=hero.querySelector('.product-header-tools');
    if(!tools){
      tools=document.createElement('div');
      tools.className='product-header-tools';
      tools.setAttribute('aria-label','App controls');
      hero.appendChild(tools);
    }
    let button=tools.querySelector('[data-native-ask]');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.className='native-ask-action';
      button.dataset.nativeAsk='true';
      button.setAttribute('aria-label','Ask Octagon Verdict');
      button.innerHTML=`${icon('ask')}<span>Ask</span>`;
      button.addEventListener('click',()=>shell()?.activateDestination?.('intelligence'));
      tools.prepend(button);
    }
    return button;
  }

  function ensurePullIndicator(){
    let node=document.querySelector('[data-native-pull-refresh]');
    if(node)return node;
    node=document.createElement('div');
    node.className='native-pull-refresh';
    node.dataset.nativePullRefresh='true';
    node.setAttribute('role','status');
    node.setAttribute('aria-live','polite');
    node.innerHTML=`<i class="native-pull-icon">${icon('refresh')}</i><span>Pull to refresh</span>`;
    document.body.appendChild(node);
    return node;
  }

  function currentDestination(){
    const api=shell();
    if(api?.currentDestination)return api.currentDestination;
    const view=document.querySelector('main.shell>.view.active-view')?.id||'home';
    if(['men','women','division','categories'].includes(view))return'rankings';
    if(view==='octagon')return'war-room';
    if(view==='compare')return'intelligence';
    return view;
  }

  function syncActive(destination=currentDestination()){
    const nav=ensureBottomNav();
    const warSource=document.querySelector('nav.tabs [data-destination="war-room"]');
    nav.querySelectorAll('[data-native-destination]').forEach(button=>{
      const active=button.dataset.nativeDestination===destination;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
      if(button.dataset.nativeDestination==='war-room'){
        const disabled=Boolean(warSource?.disabled)||warSource?.getAttribute('aria-disabled')==='true';
        button.setAttribute('aria-disabled',String(disabled));
        button.disabled=disabled;
      }
    });
  }

  function parsePicksMissing(){
    const value=text(document.querySelector('#picksProgress .picks-progress-top strong')?.textContent);
    const match=value.match(/(\d+)\s*\/\s*(\d+)/);
    if(!match)return 0;
    return Math.max(0,Number(match[2])-Number(match[1]));
  }

  function badgeValue(key){
    if(key==='play')return Math.max(0,Number(window.UFC_PROFILE_CHALLENGES?.unreadCount)||0);
    if(key==='picks')return parsePicksMissing();
    if(key==='war-room')return Math.max(0,Number(window.UFC_OCTAGON_NOTIFICATIONS?.unread)||0);
    return 0;
  }

  function setBadge(key,count){
    const badge=document.querySelector(`[data-native-badge="${key}"]`);
    if(!badge)return;
    const value=Math.max(0,Number(count)||0);
    badge.hidden=value<1;
    badge.textContent=value>99?'99+':String(value);
    badge.setAttribute('aria-label',`${value} ${key} item${value===1?'':'s'} requiring attention`);
  }

  function syncAppBadge(total){
    if(!('setAppBadge' in navigator))return;
    try{
      if(total>0)navigator.setAppBadge(total);
      else navigator.clearAppBadge?.();
    }catch(_error){}
  }

  function syncBadges(){
    window.clearTimeout(state.badgeTimer);
    state.badgeTimer=window.setTimeout(()=>{
      ensureBottomNav();
      const counts={play:badgeValue('play'),picks:badgeValue('picks'),'war-room':badgeValue('war-room')};
      Object.entries(counts).forEach(([key,count])=>setBadge(key,count));
      syncAppBadge(counts.play+counts.picks+counts['war-room']);
    },30);
  }

  function animateActiveView(){
    const view=document.querySelector('main.shell>.view.active-view');
    if(!view)return;
    view.classList.remove('native-view-enter');
    void view.offsetWidth;
    view.classList.add('native-view-enter');
    window.clearTimeout(state.transitionTimer);
    state.transitionTimer=window.setTimeout(()=>view.classList.remove('native-view-enter'),260);
  }

  function haptic(duration=7){
    try{navigator.vibrate?.(duration);}catch(_error){}
  }

  function pullBlocked(target){
    if(!mobile()||state.refreshing||window.scrollY>0||document.documentElement.scrollTop>0)return true;
    if(document.body.classList.contains('profile-challenge-open'))return true;
    return Boolean(target?.closest?.('input,textarea,select,[contenteditable="true"],.drawer-panel,.profile-activity-panel,.profile-challenge-panel,.what-changed-panel'));
  }

  function setPullVisual(distance,armed=false){
    const node=ensurePullIndicator();
    const visual=Math.min(106,Math.max(0,distance));
    const rotation=Math.min(180,(visual/REFRESH_THRESHOLD)*180);
    node.style.setProperty('--native-pull-distance',`${visual}px`);
    node.style.setProperty('--native-pull-rotation',`${rotation}deg`);
    node.classList.toggle('visible',visual>2);
    node.classList.toggle('armed',armed);
    node.classList.remove('settling','complete');
    const label=node.querySelector('span');
    if(label)label.textContent=armed?'Release to refresh':'Pull to refresh';
  }

  function resetPull(delay=0){
    window.clearTimeout(state.pullResetTimer);
    state.pullResetTimer=window.setTimeout(()=>{
      const node=ensurePullIndicator();
      node.classList.add('settling');
      node.classList.remove('visible','armed','refreshing','complete');
      node.style.setProperty('--native-pull-distance','0px');
      node.style.setProperty('--native-pull-rotation','0deg');
      state.pulling=false;
      state.armed=false;
      state.distance=0;
      window.setTimeout(()=>node.classList.remove('settling'),240);
    },delay);
  }

  async function fallbackQuickSync(){
    const tasks=[];
    const add=value=>{if(value&&typeof value.then==='function')tasks.push(value);};
    try{add(window.UFC_PLAY_DAILY_SERVICE?.recoverCurrentDay?.());}catch(_error){}
    try{add(window.UFC_DAILY_LEADERBOARD_LIVE?.check?.({force:true}));}catch(_error){}
    try{add(window.UFC_PROFILE_CHALLENGES?.loadInbox?.());}catch(_error){}
    try{add(window.UFC_APP_NOTIFICATIONS?.loadSettings?.(true));}catch(_error){}
    try{add(window.UFC_OCTAGON_NOTIFICATIONS?.refreshStatus?.());}catch(_error){}
    try{if(currentDestination()==='war-room')add(window.UFC_OCTAGON_BOARD?.load?.(null,{silent:true}));}catch(_error){}
    try{window.UFC_HOME_DASHBOARD?.render?.();}catch(_error){}
    window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh',{detail:{source:'pull-to-refresh',destination:currentDestination()}}));
    await Promise.race([Promise.allSettled(tasks),new Promise(resolve=>window.setTimeout(resolve,2200))]);
  }

  async function refresh(){
    if(state.refreshing)return;
    state.refreshing=true;
    const node=ensurePullIndicator();
    const label=node.querySelector('span');
    const iconNode=node.querySelector('.native-pull-icon');
    node.classList.add('visible','refreshing');
    node.classList.remove('armed','complete');
    if(label)label.textContent='Refreshing Octagon HQ';
    document.documentElement.dataset.nativeRefreshing='true';
    try{
      const task=window.UFC_APP_UPDATE_WATCHER?.quickSync?.()||fallbackQuickSync();
      await Promise.race([Promise.resolve(task),new Promise(resolve=>window.setTimeout(resolve,2400))]);
      await Promise.resolve(window.UFC_OCTAGON_NOTIFICATIONS?.refreshStatus?.()).catch(()=>null);
      syncBadges();
      node.classList.remove('refreshing');
      node.classList.add('complete');
      if(iconNode)iconNode.innerHTML=icon('check');
      if(label)label.textContent='Updated just now';
      haptic(8);
      resetPull(650);
    }catch(_error){
      node.classList.remove('refreshing');
      if(label)label.textContent='Could not refresh';
      resetPull(900);
    }finally{
      state.refreshing=false;
      delete document.documentElement.dataset.nativeRefreshing;
      window.setTimeout(()=>{if(iconNode)iconNode.innerHTML=icon('refresh');},950);
    }
  }

  function bindPullToRefresh(){
    document.addEventListener('touchstart',event=>{
      if(event.touches.length!==1||pullBlocked(event.target))return;
      state.startY=event.touches[0].clientY;
      state.pulling=true;
      state.armed=false;
      state.distance=0;
    },{passive:true});

    document.addEventListener('touchmove',event=>{
      if(!state.pulling||event.touches.length!==1)return;
      if(window.scrollY>0||document.documentElement.scrollTop>0){resetPull();return;}
      const delta=event.touches[0].clientY-state.startY;
      if(delta<=0){setPullVisual(0,false);return;}
      if(delta>8)event.preventDefault();
      const distance=Math.min(106,delta*.62);
      const armed=distance>=REFRESH_THRESHOLD;
      if(armed&&!state.armed)haptic(6);
      state.armed=armed;
      state.distance=distance;
      setPullVisual(distance,armed);
    },{passive:false});

    const finish=()=>{
      if(!state.pulling)return;
      const armed=state.armed;
      state.pulling=false;
      if(armed)void refresh();
      else resetPull();
    };
    document.addEventListener('touchend',finish,{passive:true});
    document.addEventListener('touchcancel',()=>resetPull(),{passive:true});
  }

  function observe(){
    if(state.observer)return;
    state.observer=new MutationObserver(records=>{
      let relevant=false;
      for(const record of records){
        const target=record.target;
        if(target?.closest?.('#picksProgress,.app-profile-chip,[data-octagon-unread-badge],[data-profile-challenge-inbox],main.shell')||[...record.addedNodes].some(node=>node.nodeType===1&&node.matches?.('.picks-progress-top,[data-octagon-unread-badge],[data-profile-challenge-inbox]'))){relevant=true;break;}
      }
      if(relevant){syncBadges();syncActive();ensureAskAction();}
    });
    state.observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  }

  function bindEvents(){
    window.addEventListener('octagon-hq:view-change',event=>{
      syncActive(event.detail?.destination||currentDestination());
      animateActiveView();
      syncBadges();
    });
    ['ufc-profile-challenges-updated','ufc-profile-challenge-sent','ufc-play-profile-ready','ufc-app-profile-updated','octagon-hq:soft-refresh','octagon-hq:notification-device-change'].forEach(name=>window.addEventListener(name,syncBadges));
    window.addEventListener('resize',()=>{ensureAskAction();syncActive();},{passive:true});
    window.addEventListener('orientationchange',()=>window.setTimeout(()=>{ensureAskAction();syncActive();},120),{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncBadges();syncActive();}});
  }

  function start(){
    if(state.started)return;
    state.started=true;
    ensureBottomNav();
    ensureAskAction();
    ensurePullIndicator();
    syncActive();
    syncBadges();
    bindPullToRefresh();
    bindEvents();
    observe();
    [80,260,800,1800,4200].forEach(delay=>window.setTimeout(()=>{ensureAskAction();syncActive();syncBadges();},delay));
    window.setInterval(()=>{if(!document.hidden)syncBadges();},10000);
    document.documentElement.dataset.nativeAppShell=VERSION;
  }

  window.UFC_NATIVE_APP_SHELL={version:VERSION,start,syncActive,syncBadges,refresh,ensureAskAction};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
