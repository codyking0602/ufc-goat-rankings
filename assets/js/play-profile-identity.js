(function(){
  'use strict';

  const VERSION='play-profile-identity-20260717b-goat26';
  const CANONICAL_CODE='GOAT26';
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  const ACTIVE_GROUP_KEY='ufc-player:group-code';
  const DISPLAY_NAME_KEY='ufc-picks:display-name';
  const config=window.UFC_PLAY_SUPABASE_CONFIG||window.UFC_SUPABASE_CONFIG||{};
  const client=config.url&&config.anonKey&&window.supabase?.createClient
    ? window.supabase.createClient(config.url,config.anonKey)
    : null;
  let cache=null;
  let modalPromise=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const normalizeCode=value=>String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const normalizePin=value=>String(value||'').replace(/\D/g,'').slice(0,4);
  const get=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const set=(key,value)=>{try{localStorage.setItem(key,value);}catch(_error){}};
  const remove=key=>{try{localStorage.removeItem(key);}catch(_error){}};

  async function waitForCanonicalBridge(){
    try{await window.UFC_APP_IDENTITY_CONFIG?.ready;}catch(_error){}
  }

  function candidateTokens(){
    const tokens=[];
    const canonical=get(`${GROUP_TOKEN_PREFIX}${CANONICAL_CODE}`);
    if(canonical)tokens.push(canonical);
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(GROUP_TOKEN_PREFIX))continue;
        const token=get(key);
        if(token)tokens.push(token);
      }
    }catch(_error){}
    return [...new Set(tokens)];
  }

  async function snapshot(token){
    if(!client||!token)return null;

    let response=await client.rpc('app_profile_resolve',{p_member_token:token});
    if(!response.error&&response.data?.ok){
      return {...response.data,groupCode:CANONICAL_CODE,memberToken:token};
    }

    response=await client.rpc('play_identity_snapshot',{
      p_group_code:CANONICAL_CODE,
      p_member_token:token
    });
    if(response.error)throw response.error;
    if(!response.data?.ok)return null;
    return {...response.data,groupCode:CANONICAL_CODE,memberToken:token};
  }

  function storeResolved(identity){
    const token=String(identity?.memberToken||identity?.member_token||'');
    if(!token)return false;
    set(`${GROUP_TOKEN_PREFIX}${CANONICAL_CODE}`,token);
    set(ACTIVE_GROUP_KEY,CANONICAL_CODE);
    if(identity?.member?.display_name)set(DISPLAY_NAME_KEY,String(identity.member.display_name));
    (identity?.rooms||[]).forEach(room=>{
      const roomCode=normalizeCode(room?.code);
      if(roomCode)set(`${ROOM_TOKEN_PREFIX}${roomCode}`,token);
    });
    return true;
  }

  async function resolve(){
    await waitForCanonicalBridge();
    if(cache&&get(`${GROUP_TOKEN_PREFIX}${CANONICAL_CODE}`)===cache.memberToken)return cache;

    for(const token of candidateTokens()){
      try{
        const identity=await snapshot(token);
        if(!identity)continue;
        cache=identity;
        storeResolved(identity);
        window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:identity}));
        return identity;
      }catch(error){
        const message=String(error?.message||'');
        if(/schema cache|app_profile_resolve|play_identity_snapshot|does not exist/i.test(message))continue;
      }
    }
    return null;
  }

  function storeLogin(data){
    const token=String(data?.member_token||'');
    const admin=String(data?.admin_token||'');
    if(!token)return false;
    set(`${GROUP_TOKEN_PREFIX}${CANONICAL_CODE}`,token);
    if(admin)set(`${GROUP_ADMIN_PREFIX}${CANONICAL_CODE}`,admin);else remove(`${GROUP_ADMIN_PREFIX}${CANONICAL_CODE}`);
    set(ACTIVE_GROUP_KEY,CANONICAL_CODE);
    set(DISPLAY_NAME_KEY,String(data?.member?.display_name||''));
    (data?.rooms||[]).forEach(room=>{
      const roomCode=normalizeCode(room?.code);
      if(!roomCode)return;
      set(`${ROOM_TOKEN_PREFIX}${roomCode}`,token);
      if(admin)set(`${ROOM_ADMIN_PREFIX}${roomCode}`,admin);else remove(`${ROOM_ADMIN_PREFIX}${roomCode}`);
    });
    return true;
  }

  async function login(_groupCode,displayName,pin){
    if(!client)throw new Error('UFC App profiles are not connected.');
    const args={
      p_display_name:String(displayName||'').trim(),
      p_pin:normalizePin(pin)
    };

    let response=await client.rpc('app_profile_login',args);
    if(response.error&&/app_profile_login|schema cache|does not exist/i.test(String(response.error.message||''))){
      response=await client.rpc('picks_member_login_pin',{
        p_group_code:CANONICAL_CODE,
        ...args
      });
    }

    const {data,error}=response;
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Those UFC App sign-in details did not match.');
    if(!storeLogin(data))throw new Error('The profile login did not return valid access.');
    cache=await snapshot(data.member_token);
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:cache}));
    return cache;
  }

  function injectStyles(){
    if(document.getElementById('playProfileIdentityCss'))return;
    const style=document.createElement('style');
    style.id='playProfileIdentityCss';
    style.textContent=`
      body.play-profile-open{overflow:hidden}.play-profile-modal{position:fixed;inset:0;z-index:5000;display:grid;place-items:center;padding:18px;background:rgba(3,7,18,.84);backdrop-filter:blur(10px)}.play-profile-dialog{width:min(430px,100%);border:1px solid rgba(249,115,22,.72);border-radius:22px;background:linear-gradient(180deg,#22314a,#101725);box-shadow:0 28px 90px rgba(0,0,0,.58);padding:20px;color:#f8fafc}.play-profile-dialog>span{color:#fb923c;font:950 10px/1 system-ui;letter-spacing:.14em}.play-profile-dialog h2{margin:7px 0 0;font:950 26px/1.05 system-ui}.play-profile-dialog p{margin:9px 0 15px;color:#cbd5e1;font:600 13px/1.45 system-ui}.play-profile-dialog label{display:grid;gap:6px;margin-top:10px;color:#cbd5e1;font:900 10px/1 system-ui;letter-spacing:.05em}.play-profile-dialog input{min-height:46px;border:1px solid #526786;border-radius:13px;background:#0f1624;color:#fff;padding:0 12px;font:800 15px/1 system-ui}.play-profile-group-lock{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:4px 0 12px;padding:11px 12px;border:1px solid #526786;border-radius:13px;background:#0f1624}.play-profile-group-lock span{color:#94a3b8;font:900 10px/1 system-ui;letter-spacing:.06em}.play-profile-group-lock strong{color:#fff;font:950 15px/1 system-ui}.play-profile-status{min-height:20px;margin-top:9px;color:#fdba74;font:750 11px/1.4 system-ui}.play-profile-actions{display:grid;grid-template-columns:.85fr 1.35fr;gap:9px;margin-top:8px}.play-profile-actions button{min-height:44px;border:1px solid #526786;border-radius:13px;background:#172033;color:#fff;font:950 11px/1 system-ui}.play-profile-actions .primary{border-color:#f97316;background:#f97316;color:#111827}.play-profile-dialog small{display:block;margin-top:10px;color:#94a3b8;font:600 10px/1.4 system-ui}@media(max-width:520px){.play-profile-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function closeModal(result=null){
    document.getElementById('playProfileModal')?.remove();
    document.body.classList.remove('play-profile-open');
    const done=closeModal.resolve;
    closeModal.resolve=null;
    modalPromise=null;
    done?.(result);
  }

  function modal(options={}){
    if(modalPromise)return modalPromise;
    injectStyles();
    modalPromise=new Promise(resolvePromise=>{
      closeModal.resolve=resolvePromise;
      const node=document.createElement('div');
      node.id='playProfileModal';
      node.className='play-profile-modal';
      const savedName=get(DISPLAY_NAME_KEY);
      node.innerHTML=`<section class="play-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="playProfileTitle">
        <span>UFC APP PROFILE</span>
        <h2 id="playProfileTitle">${esc(options.title||'Sign in to continue')}</h2>
        <p>${esc(options.description||'Use your existing display name and four-digit PIN. The same profile works across Picks, Play, and The Octagon.')}</p>
        <div class="play-profile-group-lock"><span>PRIVATE GROUP</span><strong>${CANONICAL_CODE}</strong></div>
        <label>DISPLAY NAME<input id="playProfileName" maxlength="30" autocomplete="nickname" placeholder="Cody" value="${esc(savedName)}"></label>
        <label>4-DIGIT PIN<input id="playProfilePin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••"></label>
        <div id="playProfileStatus" class="play-profile-status" role="status"></div>
        <div class="play-profile-actions"><button type="button" data-profile-cancel>NOT NOW</button><button type="button" class="primary" data-profile-submit>SIGN IN</button></div>
        <small>This reconnects your one UFC App profile. It does not create a second account.</small>
      </section>`;
      document.body.appendChild(node);
      document.body.classList.add('play-profile-open');
      const submit=async()=>{
        const name=document.getElementById('playProfileName')?.value.trim()||'';
        const pin=normalizePin(document.getElementById('playProfilePin')?.value);
        const status=document.getElementById('playProfileStatus');
        const button=node.querySelector('[data-profile-submit]');
        if(!name){status.textContent='Enter the exact display name from your UFC App profile.';return;}
        if(pin.length!==4){status.textContent='Enter your four-digit PIN.';return;}
        button.disabled=true;
        button.textContent='SIGNING IN…';
        status.textContent='Checking your UFC App profile…';
        try{closeModal(await login(CANONICAL_CODE,name,pin));}
        catch(error){status.textContent=String(error?.message||'Could not sign in.');button.disabled=false;button.textContent='SIGN IN';}
      };
      node.querySelector('[data-profile-submit]')?.addEventListener('click',submit);
      node.querySelector('[data-profile-cancel]')?.addEventListener('click',()=>closeModal(null));
      node.addEventListener('click',event=>{if(event.target===node)closeModal(null);});
      node.querySelectorAll('input').forEach(input=>input.addEventListener('keydown',event=>{if(event.key==='Enter')submit();}));
      node.querySelector('#playProfilePin')?.focus();
    });
    return modalPromise;
  }

  async function requireIdentity(options={}){
    const existing=await resolve().catch(()=>null);
    return existing||modal(options);
  }

  window.UFC_PLAY_PROFILE={
    version:VERSION,
    client,
    canonicalGroupCode:CANONICAL_CODE,
    resolve,
    require:requireIdentity,
    login,
    modal,
    normalizeCode,
    get identity(){return cache;}
  };
  document.documentElement.setAttribute('data-play-profile-identity',VERSION);
})();