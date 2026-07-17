(function(){
  'use strict';

  const VERSION='app-canonical-group-20260717b';
  const CANONICAL_CODE='GOAT26';
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  const ACTIVE_GROUP_KEY='ufc-player:group-code';
  const DISPLAY_NAME_KEY='ufc-picks:display-name';
  const RELOAD_KEY='ufc-app:goat26-adoption-reload';
  const config=window.UFC_SUPABASE_CONFIG || {};
  const client=config.url&&config.anonKey&&window.supabase?.createClient
    ? window.supabase.createClient(config.url,config.anonKey)
    : null;

  const normalize=value=>String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const get=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const set=(key,value)=>{try{localStorage.setItem(key,value);}catch(_error){}};

  function candidates(){
    const found=[];
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(GROUP_TOKEN_PREFIX))continue;
        const code=normalize(key.slice(GROUP_TOKEN_PREFIX.length));
        const token=get(key);
        if(code&&token)found.push({code,token});
      }
    }catch(_error){}
    found.sort((a,b)=>Number(b.code===CANONICAL_CODE)-Number(a.code===CANONICAL_CODE));
    return found.filter((item,index,list)=>list.findIndex(other=>other.token===item.token)===index);
  }

  function canonicalizeUrl(force=false){
    const url=new URL(window.location.href);
    const current=normalize(url.searchParams.get('group'));
    if(current===CANONICAL_CODE)return false;
    if(!force&&!current)return false;
    url.searchParams.set('group',CANONICAL_CODE);
    window.history.replaceState(null,'',url.toString());
    return true;
  }

  function storeCanonical(candidate,identity){
    set(`${GROUP_TOKEN_PREFIX}${CANONICAL_CODE}`,candidate.token);
    const admin=get(`${GROUP_ADMIN_PREFIX}${candidate.code}`);
    if(admin)set(`${GROUP_ADMIN_PREFIX}${CANONICAL_CODE}`,admin);
    set(ACTIVE_GROUP_KEY,CANONICAL_CODE);
    if(identity?.member?.display_name)set(DISPLAY_NAME_KEY,identity.member.display_name);

    (identity?.rooms||[]).forEach(room=>{
      const roomCode=normalize(room?.code);
      if(!roomCode)return;
      set(`${ROOM_TOKEN_PREFIX}${roomCode}`,candidate.token);
      if(admin)set(`${ROOM_ADMIN_PREFIX}${roomCode}`,admin);
    });
  }

  async function resolveCandidate(candidate){
    let response=await client.rpc('app_profile_resolve',{p_member_token:candidate.token});
    if(!response.error&&response.data?.ok)return response.data;

    response=await client.rpc('play_identity_snapshot',{
      p_group_code:CANONICAL_CODE,
      p_member_token:candidate.token
    });
    return !response.error&&response.data?.ok ? response.data : null;
  }

  async function adopt(){
    if(!client)return null;
    for(const candidate of candidates()){
      try{
        const identity=await resolveCandidate(candidate);
        if(!identity)continue;

        storeCanonical(candidate,identity);
        const urlChanged=canonicalizeUrl(true);
        const migrated=candidate.code!==CANONICAL_CODE;
        const reloadMarker=`${candidate.code}:${candidate.token.slice(0,8)}`;
        const alreadyReloaded=sessionStorage.getItem(RELOAD_KEY)===reloadMarker;

        window.dispatchEvent(new CustomEvent('ufc-canonical-group-ready',{detail:{...identity,canonicalCode:CANONICAL_CODE}}));

        if((migrated||urlChanged)&&!alreadyReloaded){
          sessionStorage.setItem(RELOAD_KEY,reloadMarker);
          window.location.reload();
          return identity;
        }

        sessionStorage.removeItem(RELOAD_KEY);
        return identity;
      }catch(_error){}
    }
    return null;
  }

  function lockCanonicalFields(){
    ['picksPinGroupCode','playProfileGroup'].forEach(id=>{
      const input=document.getElementById(id);
      if(!input)return;
      input.value=CANONICAL_CODE;
      input.readOnly=true;
      input.setAttribute('aria-readonly','true');
      input.setAttribute('title','This app uses one permanent private group.');
    });
  }

  function wireSingleGroupEntry(){
    lockCanonicalFields();
    const picksTab=document.querySelector('[data-view="picks"]');
    if(picksTab&&!picksTab.dataset.goat26Wired){
      picksTab.dataset.goat26Wired='true';
      picksTab.addEventListener('click',event=>{
        const url=new URL(window.location.href);
        if(normalize(url.searchParams.get('group'))===CANONICAL_CODE)return;
        event.preventDefault();
        event.stopImmediatePropagation();
        url.searchParams.set('group',CANONICAL_CODE);
        url.hash='picks';
        window.location.assign(url.toString());
      },true);
    }
  }

  if(normalize(new URL(window.location.href).searchParams.get('group')))canonicalizeUrl(true);

  const ready=adopt();
  window.UFC_APP_IDENTITY_CONFIG={
    version:VERSION,
    canonicalGroupCode:CANONICAL_CODE,
    canonicalGroupName:'UFC Picks',
    oneGroupMode:true,
    ready,
    adopt
  };
  document.documentElement.setAttribute('data-canonical-group',CANONICAL_CODE);

  const start=()=>{
    wireSingleGroupEntry();
    const observer=new MutationObserver(lockCanonicalFields);
    observer.observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();