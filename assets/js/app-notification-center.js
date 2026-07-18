(function(){
  'use strict';

  const VERSION='app-notification-center-20260718b-phase-3-stable';
  const TOKEN_KEY='ufc-picks:group:GOAT26';
  const SW_URL='sw.js?v=octagon-hq-sw-20260718b-fast-refresh';
  const state={settings:null,identity:null,busy:false,observer:null,renderTimer:0,status:'',statusKind:'',loading:false};
  const text=value=>String(value??'').trim();
  const get=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token||get(TOKEN_KEY));
  const client=()=>window.UFC_PLAY_PROFILE?.client||null;

  function installStyles(){
    if(document.getElementById('appNotificationCenterCss'))return;
    const style=document.createElement('style');
    style.id='appNotificationCenterCss';
    style.textContent=`
      .app-notification-card{border-color:rgba(249,115,22,.46)!important}.app-notification-device{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border:1px solid #33445f;border-radius:15px;background:#0b1220}.app-notification-device strong,.app-notification-device small{display:block}.app-notification-device strong{font:900 12px/1.2 system-ui}.app-notification-device small{margin-top:5px;color:#94a3b8;font:700 9px/1.35 system-ui}.app-notification-device-actions{display:flex;gap:7px;flex:0 0 auto}.app-notification-device button{min-height:38px;border:1px solid #475569;border-radius:11px;background:#172033;color:#fff;padding:0 11px;cursor:pointer;font:950 9px/1 system-ui}.app-notification-device button.primary{border-color:#f97316;background:#f97316;color:#111827}.app-notification-device button:disabled{opacity:.48;cursor:wait}.app-notification-options{display:grid;gap:7px;margin-top:10px}.app-notification-option{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding:10px 12px;border:1px solid #2f3e56;border-radius:13px;background:#0b1220}.app-notification-option strong,.app-notification-option small{display:block}.app-notification-option strong{font:900 11px/1.2 system-ui}.app-notification-option small{margin-top:4px;color:#94a3b8;font:700 9px/1.3 system-ui}.app-notification-switch{position:relative;width:42px;height:24px}.app-notification-switch input{position:absolute;opacity:0;pointer-events:none}.app-notification-switch span{position:absolute;inset:0;border:1px solid #475569;border-radius:999px;background:#172033;transition:.15s ease}.app-notification-switch span:after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#94a3b8;transition:.15s ease}.app-notification-switch input:checked+span{border-color:#f97316;background:rgba(249,115,22,.26)}.app-notification-switch input:checked+span:after{left:21px;background:#fb923c}.app-notification-switch input:focus-visible+span{outline:2px solid #f97316;outline-offset:2px}.app-notification-status{min-height:18px;margin-top:9px;color:#fdba74;font:800 9px/1.35 system-ui}.app-notification-status.error{color:#fca5a5}
      @media(max-width:600px){.app-notification-device{align-items:flex-start;flex-direction:column}.app-notification-device-actions{display:grid;grid-template-columns:1fr 1fr;width:100%}.app-notification-device button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function pushSupported(){return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;}
  function isIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
  function isStandalone(){return window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;}
  function urlBase64ToUint8Array(value){const clean=text(value),padding='='.repeat((4-clean.length%4)%4),raw=atob((clean+padding).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...raw].map(char=>char.charCodeAt(0)));}

  async function registration(create=false){
    if(!('serviceWorker' in navigator))return null;
    let current=await navigator.serviceWorker.getRegistration().catch(()=>null);
    if(!current&&create){current=await navigator.serviceWorker.register(SW_URL,{scope:'./'});await navigator.serviceWorker.ready;}
    else if(current&&create){try{await current.update();}catch(_error){}}
    return current;
  }
  async function currentSubscription(){const worker=await registration(false);return worker?.pushManager?.getSubscription?.().catch(()=>null)||null;}
  async function identity(){
    let value=state.identity||window.UFC_APP_PROFILE?.identity||window.UFC_PLAY_PROFILE?.identity;
    if(!value)value=await window.UFC_APP_PROFILE?.resolve?.().catch(()=>null);
    if(!value)value=await window.UFC_PLAY_PROFILE?.resolve?.().catch(()=>null);
    state.identity=value||null;return state.identity;
  }

  function setStatus(message='',kind=''){state.status=message;state.statusKind=kind;scheduleRender();}
  async function registerStoredSubscription(subscription,who){
    if(!subscription||!who)return false;
    const rpc=client(),token=tokenFor(who);if(!rpc||!token)return false;
    const value=subscription.toJSON();
    const {data,error}=await rpc.rpc('app_register_push_subscription',{
      p_member_token:token,p_endpoint:subscription.endpoint,p_p256dh:value.keys?.p256dh||'',p_auth:value.keys?.auth||'',p_expiration_time:subscription.expirationTime||null,p_user_agent:navigator.userAgent
    });
    if(error)throw error;if(!data?.ok)throw new Error(data?.error||'This device could not be registered.');return true;
  }

  async function loadSettings(){
    if(state.loading)return state.settings;
    state.loading=true;
    try{
      const who=await identity(),rpc=client(),token=tokenFor(who);
      if(!who||!rpc||!token){state.settings=null;scheduleRender();return null;}
      const {data,error}=await rpc.rpc('app_notification_settings',{p_member_token:token});
      if(error)throw error;if(!data?.ok)throw new Error(data?.error||'Notification settings could not load.');
      const subscription=await currentSubscription();
      if(subscription){
        try{await registerStoredSubscription(subscription,who);data.push_enabled=true;}catch(_error){}
      }
      state.settings={...data,current_device_enabled:Boolean(subscription)};
      scheduleRender();return state.settings;
    }catch(error){setStatus(text(error?.message)||'Notification settings could not load.','error');return null;}
    finally{state.loading=false;}
  }

  async function enableDevice(permissionPromise){
    if(state.busy)return false;state.busy=true;setStatus('Finishing notification setup…');
    try{
      if(!pushSupported())throw new Error('Push notifications are not supported in this browser.');
      if(isIOS()&&!isStandalone())throw new Error('On iPhone, add Octagon HQ to your Home Screen and open the installed app first.');
      const permission=await permissionPromise;
      if(permission!=='granted')throw new Error(Notification.permission==='denied'?'Notifications are blocked in iPhone Settings.':'Notification permission was not granted.');
      const settings=state.settings||await loadSettings(),who=await identity();
      if(!settings||!who)throw new Error('Reconnect your Octagon HQ profile and try again.');
      const publicKey=text(settings.vapid_public_key);if(!publicKey)throw new Error('Push notification keys are not ready.');
      const worker=await registration(true);let subscription=await worker.pushManager.getSubscription();
      if(!subscription)subscription=await worker.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(publicKey)});
      await registerStoredSubscription(subscription,who);
      setStatus('Notifications are on for this device.');await loadSettings();
      window.dispatchEvent(new CustomEvent('octagon-hq:notification-device-change',{detail:{enabled:true}}));return true;
    }catch(error){setStatus(text(error?.message)||'Notifications could not be enabled.','error');return false;}
    finally{state.busy=false;scheduleRender();}
  }
  function enableFromClick(){
    if(!pushSupported()){setStatus('Push notifications are not supported in this browser.','error');return;}
    if(isIOS()&&!isStandalone()){setStatus('On iPhone, add Octagon HQ to your Home Screen and open it there first.','error');return;}
    const permissionPromise=Notification.permission==='default'?Notification.requestPermission():Promise.resolve(Notification.permission);
    void enableDevice(permissionPromise);
  }
  async function disableDevice(){
    if(state.busy)return false;state.busy=true;setStatus('Turning off notifications on this device…');
    try{
      const who=await identity(),rpc=client(),token=tokenFor(who),subscription=await currentSubscription();
      if(subscription&&rpc&&token){const {data,error}=await rpc.rpc('app_remove_push_subscription',{p_member_token:token,p_endpoint:subscription.endpoint});if(error)throw error;if(!data?.ok)throw new Error(data?.error||'The device subscription could not be removed.');await subscription.unsubscribe();}
      setStatus('Notifications are off for this device.');await loadSettings();window.dispatchEvent(new CustomEvent('octagon-hq:notification-device-change',{detail:{enabled:false}}));return true;
    }catch(error){setStatus(text(error?.message)||'Notifications could not be turned off.','error');return false;}
    finally{state.busy=false;scheduleRender();}
  }
  async function updatePreference(key,value){
    if(state.busy||!state.settings)return;
    const prefs={...state.settings.preferences,[key]:Boolean(value)};state.settings.preferences=prefs;scheduleRender();
    try{
      const who=await identity(),rpc=client(),token=tokenFor(who);
      const {data,error}=await rpc.rpc('app_notification_update_preferences',{p_member_token:token,p_direct_challenges:Boolean(prefs.direct_challenges),p_picks_reminders:Boolean(prefs.picks_reminders),p_war_room_messages:Boolean(prefs.war_room_messages)});
      if(error)throw error;if(!data?.ok)throw new Error(data?.error||'Notification preferences could not save.');state.settings.preferences=data.preferences||prefs;setStatus('Notification preferences saved.');
    }catch(error){setStatus(text(error?.message)||'Notification preferences could not save.','error');await loadSettings();}
  }
  async function sendTest(){
    if(state.busy)return;state.busy=true;setStatus('Queuing a test notification…');
    try{
      if(!state.settings?.current_device_enabled)throw new Error('Enable notifications on this device first.');
      const who=await identity(),rpc=client(),token=tokenFor(who);const {data,error}=await rpc.rpc('app_notification_send_test',{p_member_token:token});
      if(error)throw error;if(!data?.ok)throw new Error(data?.error||'The test notification could not be queued.');setStatus('Test queued. It should arrive within about one minute.');
    }catch(error){setStatus(text(error?.message)||'The test notification could not be queued.','error');}
    finally{state.busy=false;scheduleRender();}
  }

  function optionMarkup(key,title,copy,checked){return `<label class="app-notification-option"><span><strong>${title}</strong><small>${copy}</small></span><span class="app-notification-switch"><input type="checkbox" data-app-notification-pref="${key}" ${checked?'checked':''}><span></span></span></label>`;}
  function cardMarkup(){
    const settings=state.settings;
    if(!settings)return '<article class="profile-activity-card wide app-notification-card" data-app-notification-center data-signature="loading"><header class="profile-activity-card-head"><div><span>NOTIFICATIONS</span><strong>Smart alerts</strong></div><small>Loading…</small></header><div class="profile-activity-empty">Connecting notification settings to your Octagon HQ profile.</div></article>';
    const enabled=Boolean(settings.current_device_enabled),prefs=settings.preferences||{};
    const signature=[enabled,Boolean(prefs.direct_challenges),Boolean(prefs.picks_reminders),Boolean(prefs.war_room_messages),state.busy,text(state.status),state.statusKind].join('|');
    return `<article class="profile-activity-card wide app-notification-card" data-app-notification-center data-signature="${signature}">
      <header class="profile-activity-card-head"><div><span>NOTIFICATIONS</span><strong>Smart alerts</strong></div><small>${enabled?'On for this device':'Off on this device'}</small></header>
      <div class="app-notification-device"><div><strong>${enabled?'This device can receive alerts':'Enable alerts on this device'}</strong><small>Challenges, incomplete Picks, and War Room activity only.</small></div><div class="app-notification-device-actions">${enabled?`<button type="button" data-app-notification-test ${state.busy?'disabled':''}>SEND TEST</button><button type="button" data-app-notification-disable ${state.busy?'disabled':''}>TURN OFF</button>`:`<button type="button" class="primary" data-app-notification-enable ${state.busy?'disabled':''}>ENABLE</button>`}</div></div>
      <div class="app-notification-options">${optionMarkup('direct_challenges','DIRECT CHALLENGES','When another profile sends you an exact game board.',prefs.direct_challenges)}${optionMarkup('picks_reminders','PICKS CLOSING SOON','Only when your active event still has missing picks.',prefs.picks_reminders)}${optionMarkup('war_room_messages','WAR ROOM MESSAGES','New posts, plus replies in discussions you joined.',prefs.war_room_messages)}</div>
      <div class="app-notification-status${state.statusKind==='error'?' error':''}" role="status">${text(state.status)}</div>
    </article>`;
  }
  function render(){
    const grid=document.querySelector('.profile-activity-body .profile-activity-grid');if(!grid)return false;
    const existing=grid.querySelector('[data-app-notification-center]'),holder=document.createElement('div');holder.innerHTML=cardMarkup();const next=holder.firstElementChild;
    if(existing&&(existing.dataset.signature||'')===(next?.dataset.signature||''))return true;
    if(existing)existing.replaceWith(next);else grid.prepend(next);
    next?.querySelector('[data-app-notification-enable]')?.addEventListener('click',enableFromClick);
    next?.querySelector('[data-app-notification-disable]')?.addEventListener('click',()=>void disableDevice());
    next?.querySelector('[data-app-notification-test]')?.addEventListener('click',()=>void sendTest());
    next?.querySelectorAll('[data-app-notification-pref]').forEach(input=>input.addEventListener('change',()=>void updatePreference(input.dataset.appNotificationPref,input.checked)));
    return true;
  }
  function scheduleRender(){window.clearTimeout(state.renderTimer);state.renderTimer=window.setTimeout(render,60);}
  function start(){
    installStyles();void registration(true).catch(()=>undefined);
    state.observer=new MutationObserver(()=>{if(document.querySelector('.profile-activity-body .profile-activity-grid')){scheduleRender();if(!state.settings&&!state.loading)void loadSettings();}});
    state.observer.observe(document.body,{childList:true,subtree:true});
    ['ufc-play-profile-ready','ufc-app-profile-updated'].forEach(name=>window.addEventListener(name,event=>{state.identity=event.detail?.identity||event.detail||state.identity;void loadSettings();}));
    window.addEventListener('octagon-hq:notification-device-change',()=>void loadSettings());window.setTimeout(()=>void loadSettings(),300);
  }

  window.UFC_APP_NOTIFICATIONS={version:VERSION,loadSettings,enableFromClick,enableDevice,disableDevice,sendTest,updatePreference,get settings(){return state.settings;},get enabled(){return Boolean(state.settings?.current_device_enabled);}};
  document.documentElement.setAttribute('data-app-notification-center',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
