(function(){
  'use strict';

  if(window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__)return;
  window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__=true;

  const VERSION='native-app-shell-stability-20260721c-profile-owner';
  let observer=null;
  let timer=0;

  const text=value=>String(value??'').trim();

  function normalizeWhatsNew(){
    const button=document.getElementById('whatsNewBtn');
    if(!button)return false;
    const existing=button.querySelector('#whatsNewUnread');
    const count=/^\d+\+?$/.test(text(existing?.textContent))?text(existing.textContent):'';
    const hidden=existing?.hidden!==false||!count;
    const malformed=!button.querySelector('[data-whats-new-label]')||text(button.textContent).replace(/\s+/g,'').startsWith('NEWNEW');
    if(malformed){
      button.innerHTML='<span data-whats-new-label>NEW</span><span id="whatsNewUnread" role="status" aria-live="polite" hidden></span>';
      const badge=button.querySelector('#whatsNewUnread');
      if(count){badge.textContent=count;badge.hidden=hidden;}
      window.UFC_APP_UPDATE_WATCHER?.syncUnread?.();
    }
    return true;
  }

  function syncDrawerState(){
    const open=document.getElementById('drawer')?.classList.contains('open');
    document.body.classList.toggle('fighter-profile-open',Boolean(open));
  }

  function closeFighterProfile(){
    const drawer=document.getElementById('drawer');
    if(!drawer?.classList.contains('open'))return false;
    const close=document.getElementById('closeDrawer');
    if(close)close.click();
    else{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
    document.body.classList.remove('fighter-profile-open');
    return true;
  }

  function schedule(){
    window.clearTimeout(timer);
    timer=window.setTimeout(()=>{
      normalizeWhatsNew();
      syncDrawerState();
    },30);
  }

  function start(){
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-native-destination]'))closeFighterProfile();
      if(event.target.closest?.('#closeDrawer'))window.setTimeout(syncDrawerState,0);
    },true);
    observer=new MutationObserver(records=>{
      if(records.some(record=>record.target?.closest?.('#drawer,#manualRefreshControl')||[...record.addedNodes].some(node=>node.nodeType===1&&node.matches?.('#drawer,#whatsNewBtn'))))schedule();
    });
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','aria-hidden']});
    ['octagon-hq:view-change','octagon-hq:soft-refresh'].forEach(name=>window.addEventListener(name,schedule));
    [0,80,240,700,1600,3600].forEach(delay=>window.setTimeout(schedule,delay));
    document.documentElement.dataset.nativeAppShellStability=VERSION;
  }

  window.UFC_NATIVE_APP_SHELL_STABILITY={version:VERSION,schedule,normalizeWhatsNew,closeFighterProfile};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
