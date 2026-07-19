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

  function ownedGroupCodes(){
    try{
      return Object.keys(localStorage)
        .filter(key=>key.startsWith(GROUP_TOKEN_PREFIX))
        .map(key=>key.slice(GROUP_TOKEN_PREFIX.length))
        .filter(code=>code && localStorage.getItem(`${GROUP_ADMIN_PREFIX}${code}`));
    }catch(_error){
      return [];
    }
  }

  function eventIsStillOpen(event){
    if(!event || !OPEN_EVENT_STATUSES.has(event.status)) return false;
    if(event.status==='live') return true;
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

  async function advance(){
    if(running) return;
    const codes=ownedGroupCodes();
    if(!codes.length) return;
    running=true;
    try{
      for(const code of codes){
        const memberToken=localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`);
        const adminToken=localStorage.getItem(`${GROUP_ADMIN_PREFIX}${code}`);
        if(!memberToken || !adminToken) continue;

        const {data:snapshot,error:snapshotError}=await client.rpc('picks_group_snapshot',{
          p_group_code:code,
          p_member_token:memberToken,
          p_admin_token:adminToken
        });
        if(snapshotError || !snapshot?.group?.is_admin) continue;

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
    finally{
      running=false;
    }
  }

  function schedule(delay=0){
    clearTimeout(timer);
    timer=setTimeout(advance,delay);
  }

  if(document.readyState==='complete') schedule(50);
  else window.addEventListener('load',()=>schedule(50),{once:true});
  window.addEventListener('ufc-picks-season-updated',()=>schedule(100));
})();
