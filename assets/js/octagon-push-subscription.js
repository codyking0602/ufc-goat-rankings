(function(){
  'use strict';

  const VERSION='octagon-push-subscription-20260717b';
  const CANONICAL_CODE='GOAT26';
  const TOKEN_KEY=`ufc-picks:group:${CANONICAL_CODE}`;
  const state={busy:false,started:false};

  const text=value=>String(value??'').trim();
  const get=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token||get(TOKEN_KEY));
  const boardRoot=()=>document.querySelector('[data-octagon-board]');

  function installStyles(){
    if(document.getElementById('octagonPushSubscriptionCss'))return;
    const style=document.createElement('style');
    style.id='octagonPushSubscriptionCss';
    style.textContent=`
      .octagon-alerts-button.push-busy{opacity:.62!important;cursor:wait!important}
    `;
    document.head.appendChild(style);
  }

  function notificationStatus(message='',kind=''){
    const board=boardRoot();
    if(!board)return;
    let node=board.querySelector('[data-octagon-notification-status]');
    if(!node){
      const header=board.querySelector('.octagon-board-head');
      if(!header)return;
      node=document.createElement('div');
      node.className='octagon-notification-status';
      node.dataset.octagonNotificationStatus='true';
      node.setAttribute('role','status');
      header.after(node);
    }
    node.textContent=message;
    node.classList.toggle('error',kind==='error');
  }

  function updateButton(){
    const button=boardRoot()?.querySelector('[data-octagon-alerts]');
    if(!button)return;
    const enabled=Boolean(window.UFC_OCTAGON_NOTIFICATIONS?.pushEnabled);
    button.classList.toggle('push-busy',state.busy);
    button.classList.toggle('on',enabled);
    button.disabled=state.busy;
    button.textContent=state.busy?'SETTING UP…':enabled?'Alerts On':'Alerts';
  }

  async function context(){
    const profile=window.UFC_PLAY_PROFILE;
    const identity=await profile?.resolve?.().catch(()=>null);
    return{client:profile?.client||null,token:tokenFor(identity)};
  }

  function pushSupported(){
    return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
  }

  function isIOS(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  }

  function isStandalone(){
    return window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
  }

  function urlBase64ToUint8Array(value){
    const clean=text(value);
    const padding='='.repeat((4-clean.length%4)%4);
    const base64=(clean+padding).replace(/-/g,'+').replace(/_/g,'/');
    const raw=atob(base64);
    return Uint8Array.from([...raw].map(character=>character.charCodeAt(0)));
  }

  function validApplicationServerKey(value){
    const bytes=urlBase64ToUint8Array(value);
    if(bytes.length!==65||bytes[0]!==4){
      throw new Error('The push key update is not ready yet. Close Octagon HQ, reopen it, and tap Alerts again.');
    }
    return bytes;
  }

  function sameBytes(left,right){
    const a=left instanceof Uint8Array?left:new Uint8Array(left||0);
    const b=right instanceof Uint8Array?right:new Uint8Array(right||0);
    return a.length===b.length&&a.every((value,index)=>value===b[index]);
  }

  async function serviceWorkerRegistration(){
    const url=new URL('sw.js',document.baseURI).href;
    const registration=await navigator.serviceWorker.register(url,{scope:'./'});
    await navigator.serviceWorker.ready;
    return registration;
  }

  async function registerSubscription(subscription){
    const json=subscription.toJSON();
    const {client,token}=await context();
    if(!client||!token)throw new Error('Reconnect your GOAT26 profile and try again.');
    const {data,error}=await client.rpc('octagon_register_push_subscription',{
      p_member_token:token,
      p_endpoint:subscription.endpoint,
      p_p256dh:json.keys?.p256dh||'',
      p_auth:json.keys?.auth||'',
      p_expiration_time:subscription.expirationTime||null,
      p_user_agent:navigator.userAgent
    });
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Push alerts could not be registered.');
  }

  async function removeStoredSubscription(subscription){
    if(!subscription)return;
    try{
      const {client,token}=await context();
      if(client&&token){
        await client.rpc('octagon_remove_push_subscription',{
          p_member_token:token,
          p_endpoint:subscription.endpoint
        });
      }
    }catch(_error){}
    try{await subscription.unsubscribe();}catch(_error){}
  }

  async function enablePush(permissionPromise){
    state.busy=true;
    updateButton();
    try{
      const permission=await permissionPromise;
      if(permission!=='granted'){
        if(Notification.permission==='denied'){
          throw new Error('Notifications are blocked. Open iPhone Settings → Notifications → Octagon HQ and turn on Allow Notifications.');
        }
        throw new Error('Tap Alerts again and choose Allow when iPhone asks about notifications.');
      }

      notificationStatus('Finishing push-alert setup…');
      const {client,token}=await context();
      if(!client||!token)throw new Error('Reconnect your GOAT26 profile and try again.');
      const {data,error}=await client.rpc('octagon_activity_status',{p_member_token:token});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Could not load Octagon notification settings.');
      const applicationServerKey=validApplicationServerKey(data.vapid_public_key);

      const registration=await serviceWorkerRegistration();
      let subscription=await registration.pushManager.getSubscription();
      const existingKey=subscription?.options?.applicationServerKey;
      if(subscription&&existingKey&&!sameBytes(existingKey,applicationServerKey)){
        await removeStoredSubscription(subscription);
        subscription=null;
      }
      if(!subscription){
        subscription=await registration.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey
        });
      }
      await registerSubscription(subscription);
      await window.UFC_OCTAGON_NOTIFICATIONS?.refreshStatus?.();
      notificationStatus('Push alerts are on for this device.');
    }catch(error){
      notificationStatus(text(error?.message)||'Push alerts could not be enabled.','error');
    }finally{
      state.busy=false;
      updateButton();
    }
  }

  async function disablePush(){
    state.busy=true;
    updateButton();
    try{
      await window.UFC_OCTAGON_NOTIFICATIONS?.disablePush?.();
    }finally{
      state.busy=false;
      updateButton();
    }
  }

  function handleAlertsClick(event){
    event.preventDefault();
    event.stopPropagation();
    if(state.busy)return;

    if(window.UFC_OCTAGON_NOTIFICATIONS?.pushEnabled){
      void disablePush();
      return;
    }
    if(!pushSupported()){
      notificationStatus('Push alerts are not supported in this browser.','error');
      return;
    }
    if(isIOS()&&!isStandalone()){
      notificationStatus('On iPhone, add Octagon HQ to your Home Screen, open it there, then tap Alerts again.','error');
      return;
    }

    // Apple requires the permission request to happen directly from this tap,
    // before any awaited profile, network, or service-worker work.
    let permissionPromise;
    if(Notification.permission==='default'){
      notificationStatus('Choose Allow when iPhone asks about notifications.');
      permissionPromise=Notification.requestPermission();
    }else{
      permissionPromise=Promise.resolve(Notification.permission);
    }
    void enablePush(permissionPromise);
  }

  function bindAlertsButton(){
    const current=boardRoot()?.querySelector('[data-octagon-alerts]');
    if(!current)return false;
    if(current.dataset.octagonPushSubscription===VERSION){
      updateButton();
      return true;
    }

    // Clone once to remove the older async click listener while preserving
    // the existing visual state managed by the unread-notification module.
    const button=current.cloneNode(true);
    button.dataset.octagonPushSubscription=VERSION;
    button.addEventListener('click',handleAlertsClick);
    current.replaceWith(button);
    updateButton();
    return true;
  }

  function start(){
    if(state.started)return;
    state.started=true;
    installStyles();
    [0,120,400,1000,2400,5000].forEach(delay=>window.setTimeout(bindAlertsButton,delay));
    window.setInterval(bindAlertsButton,4000);
    ['ufc-play-profile-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>{
      window.addEventListener(name,()=>window.setTimeout(bindAlertsButton,80));
    });
  }

  window.UFC_OCTAGON_PUSH_SUBSCRIPTION={
    version:VERSION,
    bindAlertsButton,
    enablePush,
    disablePush
  };
  document.documentElement.setAttribute('data-octagon-push-subscription',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
