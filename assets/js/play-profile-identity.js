(function(){
  'use strict';

  const VERSION='play-profile-identity-20260715a';
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

  function candidateCodes(preferred=''){
    const codes=[normalizeCode(preferred),normalizeCode(get(ACTIVE_GROUP_KEY))];
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(GROUP_TOKEN_PREFIX)||!localStorage.getItem(key))continue;
        codes.push(normalizeCode(key.slice(GROUP_TOKEN_PREFIX.length)));
      }
    }catch(_error){}
    return [...new Set(codes.filter(Boolean))];
  }

  async function snapshot(code,token){
    if(!client)return null;
    const {data,error}=await client.rpc('play_identity_snapshot',{
      p_group_code:normalizeCode(code),
      p_member_token:token
    });
    if(error)throw error;
    if(!data?.ok)return null;
    return {...data,groupCode:normalizeCode(data.group?.code||code),memberToken:token};
  }

  async function resolve(preferred=''){
    if(cache&&get(`${GROUP_TOKEN_PREFIX}${cache.groupCode}`)===cache.memberToken)return cache;
    for(const code of candidateCodes(preferred)){
      const token=get(`${GROUP_TOKEN_PREFIX}${code}`);
      if(!token)continue;
      try{
        const identity=await snapshot(code,token);
        if(identity){
          cache=identity;
          set(ACTIVE_GROUP_KEY,identity.groupCode);
          window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:identity}));
          return identity;
        }
        remove(`${GROUP_TOKEN_PREFIX}${code}`);
      }catch(error){
        const message=String(error?.message||'');
        if(/schema cache|play_identity_snapshot|does not exist/i.test(message))throw error;
        remove(`${GROUP_TOKEN_PREFIX}${code}`);
      }
    }
    return null;
  }

  function storeLogin(data){
    const code=normalizeCode(data?.group?.code);
    const token=String(data?.member_token||'');
    const admin=String(data?.admin_token||'');
    if(!code||!token)return false;
    set(`${GROUP_TOKEN_PREFIX}${code}`,token);
    if(admin)set(`${GROUP_ADMIN_PREFIX}${code}`,admin);else remove(`${GROUP_ADMIN_PREFIX}${code}`);
    set(ACTIVE_GROUP_KEY,code);
    set(DISPLAY_NAME_KEY,String(data?.member?.display_name||''));
    (data?.rooms||[]).forEach(room=>{
      const roomCode=normalizeCode(room?.code);
      if(!roomCode)return;
      set(`${ROOM_TOKEN_PREFIX}${roomCode}`,token);
      if(admin)set(`${ROOM_ADMIN_PREFIX}${roomCode}`,admin);else remove(`${ROOM_ADMIN_PREFIX}${roomCode}`);
    });
    return true;
  }

  async function login(groupCode,displayName,pin){
    if(!client)throw new Error('Play profiles are not connected.');
    const {data,error}=await client.rpc('picks_member_login_pin',{
      p_group_code:normalizeCode(groupCode),
      p_display_name:String(displayName||'').trim(),
      p_pin:normalizePin(pin)
    });
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Those Picks sign-in details did not match.');
    if(!storeLogin(data))throw new Error('The profile login did not return valid access.');
    cache=await snapshot(data.group.code,data.member_token);
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:cache}));
    return cache;
  }

  function injectStyles(){
    if(document.getElementById('playProfileIdentityCss'))return;
    const style=document.createElement('style');
    style.id='playProfileIdentityCss';
    style.textContent=`
      body.play-profile-open{overflow:hidden}.play-profile-modal{position:fixed;inset:0;z-index:5000;display:grid;place-items:center;padding:18px;background:rgba(3,7,18,.84);backdrop-filter:blur(10px)}.play-profile-dialog{width:min(430px,100%);border:1px solid rgba(249,115,22,.72);border-radius:22px;background:linear-gradient(180deg,#22314a,#101725);box-shadow:0 28px 90px rgba(0,0,0,.58);padding:20px;color:#f8fafc}.play-profile-dialog>span{color:#fb923c;font:950 10px/1 system-ui;letter-spacing:.14em}.play-profile-dialog h2{margin:7px 0 0;font:950 26px/1.05 system-ui}.play-profile-dialog p{margin:9px 0 15px;color:#cbd5e1;font:600 13px/1.45 system-ui}.play-profile-dialog label{display:grid;gap:6px;margin-top:10px;color:#cbd5e1;font:900 10px/1 system-ui;letter-spacing:.05em}.play-profile-dialog input{min-height:46px;border:1px solid #526786;border-radius:13px;background:#0f1624;color:#fff;padding:0 12px;font:800 15px/1 system-ui}.play-profile-status{min-height:20px;margin-top:9px;color:#fdba74;font:750 11px/1.4 system-ui}.play-profile-actions{display:grid;grid-template-columns:.85fr 1.35fr;gap:9px;margin-top:8px}.play-profile-actions button{min-height:44px;border:1px solid #526786;border-radius:13px;background:#172033;color:#fff;font:950 11px/1 system-ui}.play-profile-actions .primary{border-color:#f97316;background:#f97316;color:#111827}.play-profile-dialog small{display:block;margin-top:10px;color:#94a3b8;font:600 10px/1.4 system-ui}@media(max-width:520px){.play-profile-actions{grid-template-columns:1fr}}
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
      const preferred=normalizeCode(options.preferredGroup)||normalizeCode(get(ACTIVE_GROUP_KEY));
      const savedName=get(DISPLAY_NAME_KEY);
      node.innerHTML=`<section class="play-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="playProfileTitle">
        <span>UFC APP PROFILE</span>
        <h2 id="playProfileTitle">${esc(options.title||'Sign in to continue')}</h2>
        <p>${esc(options.description||'Use the same group code, display name, and four-digit PIN from Picks.')}</p>
        <label>GROUP CODE<input id="playProfileGroup" maxlength="6" autocapitalize="characters" autocomplete="off" placeholder="ABC123" value="${esc(preferred)}"></label>
        <label>DISPLAY NAME<input id="playProfileName" maxlength="30" autocomplete="nickname" placeholder="Cody" value="${esc(savedName)}"></label>
        <label>4-DIGIT PIN<input id="playProfilePin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••"></label>
        <div id="playProfileStatus" class="play-profile-status" role="status"></div>
        <div class="play-profile-actions"><button type="button" data-profile-cancel>NOT NOW</button><button type="button" class="primary" data-profile-submit>SIGN IN</button></div>
        <small>This reconnects your existing Picks profile. It does not create a second account.</small>
      </section>`;
      document.body.appendChild(node);
      document.body.classList.add('play-profile-open');
      const submit=async()=>{
        const group=normalizeCode(document.getElementById('playProfileGroup')?.value);
        const name=document.getElementById('playProfileName')?.value.trim()||'';
        const pin=normalizePin(document.getElementById('playProfilePin')?.value);
        const status=document.getElementById('playProfileStatus');
        const button=node.querySelector('[data-profile-submit]');
        if(group.length!==6){status.textContent='Enter the six-character Picks group code.';return;}
        if(!name){status.textContent='Enter the exact display name from Picks.';return;}
        if(pin.length!==4){status.textContent='Enter your four-digit Picks PIN.';return;}
        button.disabled=true;
        button.textContent='SIGNING IN…';
        status.textContent='Checking your Picks profile…';
        try{closeModal(await login(group,name,pin));}
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
    const existing=await resolve(options.preferredGroup||'').catch(()=>null);
    return existing||modal(options);
  }

  window.UFC_PLAY_PROFILE={
    version:VERSION,
    client,
    resolve,
    require:requireIdentity,
    login,
    modal,
    normalizeCode,
    get identity(){return cache;}
  };
  document.documentElement.setAttribute('data-play-profile-identity',VERSION);
})();
