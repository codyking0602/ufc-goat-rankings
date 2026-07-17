(function(){
  'use strict';

  const VERSION='app-canonical-group-20260717a';
  const CANONICAL_CODE='GOAT26';
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
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

  function canonicalizeUrl(){
    const url=new URL(window.location.href);
    const current=normalize(url.searchParams.get('group'));
    if(!current||current===CANONICAL_CODE)return false;
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
  }

  async function adopt(){
    if(!client)return null;
    for(const candidate of candidates()){
      try{
        const {data,error}=await client.rpc('play_identity_snapshot',{
          p_group_code:CANONICAL_CODE,
          p_member_token:candidate.token
        });
        if(error||!data?.ok)continue;

        storeCanonical(candidate,data);
        const urlChanged=canonicalizeUrl();
        const migrated=candidate.code!==CANONICAL_CODE;
        const reloadMarker=`${candidate.code}:${candidate.token.slice(0,8)}`;
        const alreadyReloaded=sessionStorage.getItem(RELOAD_KEY)===reloadMarker;

        window.dispatchEvent(new CustomEvent('ufc-canonical-group-ready',{detail:{...data,canonicalCode:CANONICAL_CODE}}));

        if((migrated||urlChanged)&&!alreadyReloaded){
          sessionStorage.setItem(RELOAD_KEY,reloadMarker);
          window.location.reload();
          return data;
        }

        sessionStorage.removeItem(RELOAD_KEY);
        return data;
      }catch(_error){}
    }
    return null;
  }

  const ready=adopt();
  window.UFC_APP_IDENTITY_CONFIG={
    version:VERSION,
    canonicalGroupCode:CANONICAL_CODE,
    ready,
    adopt
  };
  document.documentElement.setAttribute('data-canonical-group',CANONICAL_CODE);
})();
