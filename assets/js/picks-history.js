(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const LAST_ROOM_KEY='ufc-picks:last-room';
  let loading=false;
  let lastSignature='';

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function normalizeCode(value){
    return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  }

  function storedRooms(){
    const rooms=[];
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index) || '';
      if(!key.startsWith(ROOM_TOKEN_PREFIX)) continue;
      const code=normalizeCode(key.slice(ROOM_TOKEN_PREFIX.length));
      const token=localStorage.getItem(key);
      if(code && token) rooms.push({code,token});
    }
    return rooms;
  }

  function isComplete(event){
    if(!event) return false;
    if(event.status==='complete') return true;
    const fights=event.fights || [];
    return fights.length>0 && fights.every(fight=>fight.resultStatus && fight.resultStatus!=='scheduled');
  }

  function formatDate(value){
    if(!value) return '';
    return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(value));
  }

  function sortedMembers(snapshot){
    return [...(snapshot.members || [])].sort((a,b)=>(b.score||0)-(a.score||0) || (b.correct||0)-(a.correct||0) || String(a.display_name).localeCompare(String(b.display_name)));
  }

  function historyData(event,snapshot){
    const members=sortedMembers(snapshot);
    const topScore=members.length ? Math.max(...members.map(member=>member.score||0)) : 0;
    const champions=members.filter(member=>(member.score||0)===topScore);
    const meIndex=members.findIndex(member=>member.id===snapshot.me?.id);
    const me=meIndex>=0 ? members[meIndex] : snapshot.me;
    return {
      code:snapshot.room.code,
      roomName:snapshot.room.name,
      event,
      members,
      champions,
      topScore,
      me,
      myPlace:meIndex>=0 ? meIndex+1 : null
    };
  }

  function ensureCard(){
    if(document.getElementById('picksHistoryCard')) return;
    const shell=document.querySelector('#picks .picks-shell');
    const hero=document.getElementById('picksEventHero');
    if(!shell || !hero) return;
    const card=document.createElement('details');
    card.id='picksHistoryCard';
    card.className='picks-history-card';
    card.hidden=true;
    card.innerHTML='<summary><div><span>YOUR ARCHIVE</span><strong>Past Events</strong></div><b id="picksHistoryCount">0 saved</b></summary><div id="picksHistoryList" class="picks-history-list"></div>';
    hero.insertAdjacentElement('afterend',card);
  }

  function openRoom(code){
    const normalized=normalizeCode(code);
    if(!normalized) return;
    localStorage.setItem(LAST_ROOM_KEY,normalized);
    localStorage.removeItem('ufc-picks:auto-restore-disabled');
    const url=new URL(window.location.href);
    url.searchParams.set('room',normalized);
    url.hash='picks';
    window.location.assign(url.toString());
  }

  function render(items){
    ensureCard();
    const card=document.getElementById('picksHistoryCard');
    const target=document.getElementById('picksHistoryList');
    const count=document.getElementById('picksHistoryCount');
    if(!card || !target || !count) return;

    card.hidden=!items.length;
    count.textContent=`${items.length} saved`;
    if(!items.length){ target.innerHTML=''; return; }

    const currentCode=normalizeCode(new URL(window.location.href).searchParams.get('room'));
    target.innerHTML=items.map(item=>{
      const championNames=item.champions.map(member=>member.display_name).join(' & ') || 'No winner';
      const myLine=item.myPlace
        ? `You finished #${item.myPlace} · ${item.me?.score||0} pts · ${item.me?.correct||0} correct`
        : 'Your result is available in the room';
      const viewing=item.code===currentCode;
      return `<article class="picks-history-row${viewing?' current':''}">
        <div class="picks-history-main">
          <span>${safe(formatDate(item.event.eventDate))}</span>
          <strong>${safe(item.event.name)}</strong>
          <small>${safe(item.event.subtitle || item.roomName || '')}</small>
        </div>
        <div class="picks-history-result">
          <span>${item.champions.length>1?'CO-CHAMPIONS':'ROOM CHAMPION'}</span>
          <strong>${safe(championNames)}</strong>
          <small>${safe(myLine)}</small>
        </div>
        <button type="button" data-history-room="${safe(item.code)}" ${viewing?'disabled':''}>${viewing?'Viewing':'Open recap'}</button>
      </article>`;
    }).join('');

    target.querySelectorAll('[data-history-room]').forEach(button=>button.addEventListener('click',()=>openRoom(button.dataset.historyRoom)));
  }

  async function refresh(){
    if(loading) return;
    ensureCard();
    const rooms=storedRooms();
    if(!rooms.length){ render([]); return; }

    loading=true;
    try{
      const {data:events,error:eventError}=await client.rpc('picks_public_events');
      if(eventError || !Array.isArray(events)) return;
      const eventMap=new Map(events.map(event=>[event.id,event]));

      const snapshots=await Promise.all(rooms.map(async room=>{
        const {data,error}=await client.rpc('picks_room_snapshot',{p_room_code:room.code,p_member_token:room.token});
        return error || !data?.room ? null : data;
      }));

      const items=snapshots
        .filter(Boolean)
        .map(snapshot=>{
          const event=eventMap.get(snapshot.room.event_id);
          return event && isComplete(event) ? historyData(event,snapshot) : null;
        })
        .filter(Boolean)
        .sort((a,b)=>new Date(b.event.eventDate)-new Date(a.event.eventDate));

      const signature=JSON.stringify(items.map(item=>[item.code,item.event.status,item.topScore,item.members.map(member=>[member.id,member.score,member.correct])]));
      if(signature===lastSignature && document.getElementById('picksHistoryList')?.children.length) return;
      lastSignature=signature;
      render(items);
    }finally{
      loading=false;
    }
  }

  function start(){
    ensureCard();
    refresh();
    const observer=new MutationObserver(()=>{
      ensureCard();
      window.clearTimeout(start.timer);
      start.timer=window.setTimeout(refresh,180);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
    window.setInterval(refresh,45000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();