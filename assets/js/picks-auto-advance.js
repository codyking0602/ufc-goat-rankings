(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  const OPEN_EVENT_STATUSES=new Set(['upcoming','live']);
  const STALE_EVENT_GRACE_MS=6*60*60*1000;
  const client=window.supabase.createClient(config.url,config.anonKey);
  let timer=0;
  let running=false;

  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);

  function storageKeys(){
    try{ return Object.keys(localStorage); }
    catch(_error){ return []; }
  }

  function groupCodes(){
    return storageKeys()
      .filter(key=>key.startsWith(GROUP_TOKEN_PREFIX))
      .map(key=>normalize(key.slice(GROUP_TOKEN_PREFIX.length)))
      .filter(Boolean);
  }

  function legacyAdminTokens(){
    const values=storageKeys()
      .filter(key=>key.startsWith(ROOM_ADMIN_PREFIX) || key.startsWith(GROUP_ADMIN_PREFIX))
      .map(key=>localStorage.getItem(key))
      .filter(Boolean);
    return [...new Set(values)];
  }

  async function recoverLastRoomGroup(){
    const room=normalize(localStorage.getItem('ufc-picks:last-room'));
    const memberToken=room ? localStorage.getItem(`${ROOM_TOKEN_PREFIX}${room}`) : null;
    if(!room || !memberToken) return null;

    const candidates=[localStorage.getItem(`${ROOM_ADMIN_PREFIX}${room}`),...legacyAdminTokens()].filter(Boolean);
    if(!candidates.length) candidates.push(null);

    for(const adminToken of [...new Set(candidates)]){
      const {data,error}=await client.rpc('picks_group_for_room',{
        p_room_code:room,
        p_member_token:memberToken,
        p_admin_token:adminToken || null
      });
      if(error || !data?.group_code) continue;
      const code=normalize(data.group_code);
      if(!code) continue;
      localStorage.setItem(`${GROUP_TOKEN_PREFIX}${code}`,memberToken);
      if(data.is_admin && adminToken) localStorage.setItem(`${GROUP_ADMIN_PREFIX}${code}`,adminToken);
      return code;
    }
    return null;
  }

  function eventIsStillOpen(event){
    if(!event || !OPEN_EVENT_STATUSES.has(String(event.status || '').toLowerCase())) return false;
    if(String(event.status || '').toLowerCase()==='live') return true;
    const time=new Date(event.event_date || event.eventDate || 0).getTime();
    return Number.isFinite(time) && time>=Date.now()-STALE_EVENT_GRACE_MS;
  }

  function nextOpenEvent(snapshot){
    const byId=new Map();
    [...(snapshot?.events || []),...(snapshot?.available_events || [])].forEach(event=>{
      const id=event?.event_id || event?.id;
      if(!id || !eventIsStillOpen(event)) return;
      const date=event.event_date || event.eventDate;
      byId.set(id,{...event,id,event_date:date});
    });
    return [...byId.values()].sort((left,right)=>new Date(left.event_date)-new Date(right.event_date))[0] || null;
  }

  function picksIsOpen(){
    const url=new URL(location.href);
    return document.getElementById('picks')?.classList.contains('active-view')
      || url.hash==='#picks'
      || Boolean(url.searchParams.get('room'));
  }

  function openRoom(groupCode,roomCode,eventId,memberToken,adminToken){
    try{
      localStorage.setItem(`${ROOM_TOKEN_PREFIX}${roomCode}`,memberToken);
      localStorage.setItem(`${ROOM_ADMIN_PREFIX}${roomCode}`,adminToken);
      localStorage.setItem(`${GROUP_ADMIN_PREFIX}${groupCode}`,adminToken);
      localStorage.setItem('ufc-picks:last-room',roomCode);
    }catch(_error){}
    if(!picksIsOpen()) return;
    const url=new URL(location.href);
    url.searchParams.set('group',groupCode);
    url.searchParams.set('room',roomCode);
    url.searchParams.set('event',eventId);
    url.searchParams.delete('archive');
    url.hash='picks';
    location.replace(url.toString());
  }

  async function loadOwnerSnapshot(code,memberToken){
    const direct=localStorage.getItem(`${GROUP_ADMIN_PREFIX}${code}`);
    const candidates=[direct,...legacyAdminTokens()].filter(Boolean);
    for(const adminToken of [...new Set(candidates)]){
      const {data,error}=await client.rpc('picks_group_snapshot',{
        p_group_code:code,
        p_member_token:memberToken,
        p_admin_token:adminToken
      });
      if(error || !data) continue;
      if(data.group?.is_admin){
        localStorage.setItem(`${GROUP_ADMIN_PREFIX}${code}`,adminToken);
        return {snapshot:data,adminToken};
      }
    }
    return null;
  }

  async function advance(){
    if(running) return;
    running=true;
    try{
      await recoverLastRoomGroup();
      for(const code of [...new Set(groupCodes())]){
        const memberToken=localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`);
        if(!memberToken) continue;
        const owner=await loadOwnerSnapshot(code,memberToken);
        if(!owner) continue;

        const {snapshot,adminToken}=owner;
        const active=(snapshot.events || []).find(event=>event.is_active);
        if(eventIsStillOpen(active)) continue;
        const target=nextOpenEvent(snapshot);
        if(!target || target.id===active?.event_id) continue;

        const {data,error}=await client.rpc('picks_group_add_event',{
          p_group_code:code,
          p_admin_token:adminToken,
          p_event_id:target.id
        });
        if(error || !data?.room_code) continue;

        window.dispatchEvent(new CustomEvent('ufc-picks-group-auto-advanced',{
          detail:{groupCode:code,eventId:data.event_id,roomCode:data.room_code}
        }));
        openRoom(code,data.room_code,data.event_id,memberToken,adminToken);
      }
    }catch(_error){}
    finally{ running=false; }
  }

  function schedule(delay=0){
    clearTimeout(timer);
    timer=setTimeout(advance,delay);
  }

  if(document.readyState==='complete') schedule(50);
  else window.addEventListener('load',()=>schedule(50),{once:true});
  window.addEventListener('ufc-picks-season-updated',()=>schedule(100));
})();