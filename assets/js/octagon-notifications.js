(function(){
  'use strict';

  const VERSION='octagon-notifications-20260717a';
  const CANONICAL_CODE='GOAT26';
  const TOKEN_KEY=`ufc-picks:group:${CANONICAL_CODE}`;
  const ACTIVITY_CHANNEL=`octagon-activity-${CANONICAL_CODE.toLowerCase()}`;
  const instanceId=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const state={
    me:null,
    canAccess:false,
    unread:0,
    vapidPublicKey:'',
    channel:null,
    realtimeClient:null,
    refreshTimer:0,
    opening:false,
    currentDeviceSubscribed:false,
    rpcClient:null,
    started:false
  };

  const text=value=>String(value??'').trim();
  const get=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token||get(TOKEN_KEY));
  const betaButton=()=>document.querySelector('[data-octagon-beta-tab]');
  const boardRoot=()=>document.querySelector('[data-octagon-board]');
  const boardActive=()=>Boolean(document.getElementById('octagon')?.classList.contains('active-view'))&&!document.hidden;

  function installStyles(){
    if(document.getElementById('octagonNotificationsCss'))return;
    const style=document.createElement('style');
    style.id='octagonNotificationsCss';
    style.textContent=`
      [data-octagon-beta-tab]{position:relative}.octagon-beta-badge{position:absolute;top:3px;right:4px;min-width:15px;height:15px;padding:0 4px;border:2px solid #0f1726;border-radius:999px;background:#f97316;color:#111827;display:inline-flex;align-items:center;justify-content:center;font:950 8px/1 system-ui;box-sizing:border-box;box-shadow:0 2px 7px rgba(249,115,22,.35)}.octagon-beta-badge[hidden]{display:none!important}
      .octagon-alerts-button{border-color:rgba(249,115,22,.42)!important;color:#fed7aa!important}.octagon-alerts-button.on{border-color:rgba(34,197,94,.46)!important;background:rgba(22,101,52,.16)!important;color:#86efac!important}.octagon-alerts-button[hidden]{display:none!important}
      .octagon-notification-status{border-left:1px solid #2b3a52;border-right:1px solid #2b3a52;background:#0b1220;padding:0 14px;color:#fdba74;font:750 10px/1.4 system-ui}.octagon-notification-status:not(:empty){padding-top:10px;padding-bottom:10px}.octagon-notification-status.error{color:#fca5a5}
      .octagon-return-banner{display:flex;align-items:center;justify-content:space-between;gap:12px;border-left:1px solid #2b3a52;border-right:1px solid #2b3a52;background:linear-gradient(90deg,rgba(249,115,22,.18),rgba(249,115,22,.04));padding:10px 14px;color:#fed7aa}.octagon-return-banner[hidden]{display:none!important}.octagon-return-banner strong{font:950 12px/1 system-ui}.octagon-return-banner span{color:#cbd5e1;font:750 10px/1.3 system-ui}
      @media(max-width:620px){.octagon-beta-badge{top:2px;right:3px}.octagon-return-banner{align-items:flex-start;flex-direction:column;gap:4px}}
    `;
    document.head.appendChild(style);
  }

  function ensureBadge(){
    const button=betaButton();
    if(!button)return null;
    let badge=button.querySelector('[data-octagon-unread-badge]');
    if(!badge){
      badge=document.createElement('span');
      badge.className='octagon-beta-badge';
      badge.dataset.octagonUnreadBadge='true';
      badge.hidden=true;
      badge.setAttribute('aria-hidden','true');
      button.appendChild(badge);
    }
    const count=Math.max(0,Number(state.unread)||0);
    badge.textContent=count>99?'99+':String(count);
    badge.hidden=!state.canAccess||count<1;
    const base=state.canAccess?'Open The Octagon':'Private Beta · Access not enabled';
    button.setAttribute('aria-label',count>0&&state.canAccess?`${base}, ${count} unread post${count===1?'':'s'}`:base);
    return badge;
  }

  function ensureBoardExtras(){
    const board=boardRoot();
    const header=board?.querySelector('.octagon-board-head');
    const actions=header?.querySelector('.octagon-board-head-actions');
    if(!board||!header||!actions)return false;

    let button=actions.querySelector('[data-octagon-alerts]');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.className='octagon-alerts-button';
      button.dataset.octagonAlerts='true';
      button.textContent='Alerts';
      const refresh=actions.querySelector('[data-octagon-refresh]');
      if(refresh)refresh.before(button);else actions.appendChild(button);
      button.addEventListener('click',togglePush);
    }
    button.hidden=!state.canAccess;
    button.classList.toggle('on',state.currentDeviceSubscribed);
    button.textContent=state.currentDeviceSubscribed?'Alerts On':'Alerts';
    button.title=state.currentDeviceSubscribed?'Push alerts are enabled on this device.':'Enable push alerts for new Octagon posts and replies.';

    let status=board.querySelector('[data-octagon-notification-status]');
    if(!status){
      status=document.createElement('div');
      status.className='octagon-notification-status';
      status.dataset.octagonNotificationStatus='true';
      status.setAttribute('role','status');
      header.after(status);
    }

    let banner=board.querySelector('[data-octagon-return-banner]');
    if(!banner){
      banner=document.createElement('div');
      banner.className='octagon-return-banner';
      banner.dataset.octagonReturnBanner='true';
      banner.hidden=true;
      banner.innerHTML='<strong></strong><span>since your last visit</span>';
      status.after(banner);
    }
    return true;
  }

  function notificationStatus(message='',kind=''){
    ensureBoardExtras();
    const node=boardRoot()?.querySelector('[data-octagon-notification-status]');
    if(!node)return;
    node.textContent=message;
    node.classList.toggle('error',kind==='error');
  }

  function showReturnBanner(count){
    ensureBoardExtras();
    const banner=boardRoot()?.querySelector('[data-octagon-return-banner]');
    if(!banner)return;
    const value=Math.max(0,Number(count)||0);
    banner.hidden=value<1;
    const strong=banner.querySelector('strong');
    if(strong)strong.textContent=`${value} new post${value===1?'':'s'}`;
  }

  async function context(){
    const profile=window.UFC_PLAY_PROFILE;
    const identity=await profile?.resolve?.().catch(()=>null);
    const client=profile?.client||null;
    if(client)wrapRpc(client);
    return{client,identity,token:tokenFor(identity)};
  }

  function wrapRpc(client){
    if(!client||client.__octagonNotificationRpcWrapped)return;
    const original=client.rpc.bind(client);
    client.rpc=async function(name,args,options){
      const result=await original(name,args,options);
      if(name==='octagon_post_message'&&result?.data?.ok&&result.data.message?.id){
        Promise.resolve().then(()=>messageCreated(result.data.message.id,result.data.message.parent_message_id?'reply':'post'));
      }else if(name==='octagon_delete_message'&&result?.data?.ok){
        Promise.resolve().then(()=>activityChanged('delete'));
      }
      return result;
    };
    client.__octagonNotificationRpcWrapped=true;
    state.rpcClient=client;
  }

  async function refreshStatus(options={}){
    const {client,token}=await context();
    if(!client||!token){
      state.me=null;
      state.canAccess=false;
      state.unread=0;
      ensureBadge();
      ensureBoardExtras();
      return null;
    }
    try{
      const {data,error}=await client.rpc('octagon_activity_status',{p_member_token:token});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Could not load Octagon activity.');
      state.me=data.member||null;
      state.canAccess=Boolean(data.can_access);
      state.unread=Number(data.unread_count)||0;
      state.vapidPublicKey=text(data.vapid_public_key);
      ensureBadge();
      ensureBoardExtras();
      await syncCurrentDeviceSubscription();
      await ensureActivityRealtime(client);
      if(options.opening&&state.unread>0)showReturnBanner(state.unread);
      return data;
    }catch(_error){
      ensureBadge();
      ensureBoardExtras();
      return null;
    }
  }

  async function markSeen(){
    if(!boardActive()||!state.canAccess)return null;
    const {client,token}=await context();
    if(!client||!token)return null;
    try{
      const {data,error}=await client.rpc('octagon_mark_seen',{p_member_token:token,p_seen_at:new Date().toISOString()});
      if(error)throw error;
      if(data?.ok){
        state.unread=0;
        ensureBadge();
      }
      return data;
    }catch(_error){return null;}
  }

  async function openingBoard(){
    if(state.opening)return;
    state.opening=true;
    try{
      const status=await refreshStatus({opening:true});
      if(status?.unread_count>0)showReturnBanner(status.unread_count);
      window.setTimeout(()=>markSeen(),700);
    }finally{
      window.setTimeout(()=>{state.opening=false;},900);
    }
  }

  function scheduleRefresh(delay=100){
    window.clearTimeout(state.refreshTimer);
    state.refreshTimer=window.setTimeout(async()=>{
      const status=await refreshStatus();
      if(boardActive()&&status?.can_access)window.setTimeout(markSeen,500);
    },delay);
  }

  async function stopActivityRealtime(){
    const channel=state.channel;
    const client=state.realtimeClient;
    state.channel=null;
    state.realtimeClient=null;
    if(!channel)return;
    try{
      if(client?.removeChannel)await client.removeChannel(channel);
      else await channel.unsubscribe?.();
    }catch(_error){}
  }

  async function ensureActivityRealtime(client=window.UFC_PLAY_PROFILE?.client){
    if(!state.canAccess||document.hidden||!client?.channel){
      if(state.channel)await stopActivityRealtime();
      return null;
    }
    if(state.channel&&state.realtimeClient===client)return state.channel;
    if(state.channel)await stopActivityRealtime();
    const channel=client.channel(ACTIVITY_CHANNEL,{config:{broadcast:{self:false,ack:true}}});
    channel.on('broadcast',{event:'activity-change'},event=>{
      if(event?.payload?.source===instanceId)return;
      scheduleRefresh(80);
    });
    state.channel=channel;
    state.realtimeClient=client;
    channel.subscribe();
    return channel;
  }

  async function broadcastActivity(kind,messageId=''){
    const {client}=await context();
    const channel=await ensureActivityRealtime(client);
    if(!channel)return;
    try{
      await channel.send({
        type:'broadcast',
        event:'activity-change',
        payload:{source:instanceId,kind:text(kind)||'change',message_id:text(messageId),at:new Date().toISOString()}
      });
    }catch(_error){}
  }

  async function messageCreated(messageId,kind){
    await broadcastActivity(kind,messageId);
    const {client,token}=await context();
    if(!client?.functions?.invoke||!token||!messageId)return;
    try{
      await client.functions.invoke('octagon-push',{body:{member_token:token,message_id:messageId}});
    }catch(_error){}
  }

  async function activityChanged(kind){
    await broadcastActivity(kind);
    scheduleRefresh(180);
  }

  function urlBase64ToUint8Array(value){
    const padding='='.repeat((4-value.length%4)%4);
    const base64=(value+padding).replace(/-/g,'+').replace(/_/g,'/');
    const raw=atob(base64);
    return Uint8Array.from([...raw].map(character=>character.charCodeAt(0)));
  }

  function pushSupported(){
    return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
  }

  function isIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;}
  function isStandalone(){return window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;}

  async function serviceWorkerRegistration(create=false){
    if(!('serviceWorker' in navigator))return null;
    let registration=await navigator.serviceWorker.getRegistration().catch(()=>null);
    if(!registration&&create){
      const url=new URL('sw.js',document.baseURI).href;
      registration=await navigator.serviceWorker.register(url,{scope:'./'});
      await navigator.serviceWorker.ready;
    }
    return registration;
  }

  async function syncCurrentDeviceSubscription(){
    if(!pushSupported()){
      state.currentDeviceSubscribed=false;
      ensureBoardExtras();
      return false;
    }
    const registration=await serviceWorkerRegistration(false);
    const subscription=await registration?.pushManager?.getSubscription?.().catch(()=>null);
    state.currentDeviceSubscribed=Boolean(subscription);
    ensureBoardExtras();
    return state.currentDeviceSubscribed;
  }

  async function enablePush(){
    if(!pushSupported()){
      notificationStatus('Push alerts are not supported in this browser.','error');
      return;
    }
    if(isIOS()&&!isStandalone()){
      notificationStatus('On iPhone, add Octagon HQ to your Home Screen, open it there, then tap Alerts again.','error');
      return;
    }
    notificationStatus('Setting up push alerts…');
    try{
      const permission=Notification.permission==='granted'?'granted':await Notification.requestPermission();
      if(permission!=='granted')throw new Error('Notification permission was not granted.');
      const status=await refreshStatus();
      const publicKey=text(status?.vapid_public_key||state.vapidPublicKey);
      if(!publicKey)throw new Error('Push alerts are not configured yet.');
      const registration=await serviceWorkerRegistration(true);
      let subscription=await registration.pushManager.getSubscription();
      if(!subscription){
        subscription=await registration.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey:urlBase64ToUint8Array(publicKey)
        });
      }
      const json=subscription.toJSON();
      const {client,token}=await context();
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
      state.currentDeviceSubscribed=true;
      ensureBoardExtras();
      notificationStatus('Push alerts are on for this device.');
    }catch(error){
      notificationStatus(text(error?.message)||'Push alerts could not be enabled.','error');
      await syncCurrentDeviceSubscription();
    }
  }

  async function disablePush(){
    notificationStatus('Turning off push alerts…');
    try{
      const registration=await serviceWorkerRegistration(false);
      const subscription=await registration?.pushManager?.getSubscription?.();
      if(subscription){
        const {client,token}=await context();
        const {data,error}=await client.rpc('octagon_remove_push_subscription',{
          p_member_token:token,
          p_endpoint:subscription.endpoint
        });
        if(error)throw error;
        if(!data?.ok)throw new Error(data?.error||'Push alerts could not be removed.');
        await subscription.unsubscribe();
      }
      state.currentDeviceSubscribed=false;
      ensureBoardExtras();
      notificationStatus('Push alerts are off for this device.');
    }catch(error){
      notificationStatus(text(error?.message)||'Push alerts could not be turned off.','error');
    }
  }

  async function togglePush(){
    await syncCurrentDeviceSubscription();
    if(state.currentDeviceSubscribed)await disablePush();
    else await enablePush();
  }

  function openRequestedBoard(){
    const url=new URL(window.location.href);
    if(url.searchParams.get('open')!=='octagon')return;
    let attempts=0;
    const timer=window.setInterval(async()=>{
      attempts+=1;
      await refreshStatus();
      const button=betaButton();
      if(button&&!button.disabled){
        window.clearInterval(timer);
        button.click();
        url.searchParams.delete('open');
        window.history.replaceState({},'',url.pathname+url.search+url.hash);
      }else if(attempts>=16){
        window.clearInterval(timer);
      }
    },350);
  }

  function bindEvents(){
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-octagon-beta-tab]');
      if(button&&!button.disabled)window.setTimeout(openingBoard,60);
    });
    ['ufc-play-profile-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>{
      window.addEventListener(name,()=>scheduleRefresh(70));
    });
    window.addEventListener('storage',event=>{if(event.key===TOKEN_KEY)scheduleRefresh(70);});
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden)stopActivityRealtime();
      else scheduleRefresh(80);
    });
    window.addEventListener('online',()=>scheduleRefresh(100));
    window.addEventListener('pagehide',()=>stopActivityRealtime(),{once:true});
  }

  function start(){
    if(state.started)return;
    state.started=true;
    installStyles();
    bindEvents();
    [0,180,700,1800,4200].forEach(delay=>window.setTimeout(async()=>{
      ensureBadge();
      ensureBoardExtras();
      await refreshStatus();
    },delay));
    window.setInterval(()=>{
      ensureBadge();
      ensureBoardExtras();
      if(!document.hidden)refreshStatus();
    },30000);
    window.setInterval(()=>{ensureBadge();ensureBoardExtras();},3000);
    openRequestedBoard();
  }

  window.UFC_OCTAGON_NOTIFICATIONS={
    version:VERSION,
    refreshStatus,
    markSeen,
    enablePush,
    disablePush,
    togglePush,
    messageCreated,
    activityChanged,
    get unread(){return state.unread;},
    get pushEnabled(){return state.currentDeviceSubscribed;}
  };
  document.documentElement.setAttribute('data-octagon-notifications',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
