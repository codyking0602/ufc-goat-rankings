(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  let lastSignature='';
  let loading=false;
  let inviteGroup=null;

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);

  function urlParam(name){
    return normalize(new URL(window.location.href).searchParams.get(name));
  }

  function roomCode(){
    return urlParam('room') || normalize(document.querySelector('#picksRoomBanner .picks-code')?.textContent);
  }

  function groupCode(){
    return urlParam('group');
  }

  function groupToken(code){ return code ? localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`) : null; }
  function groupAdmin(code){ return code ? localStorage.getItem(`${GROUP_ADMIN_PREFIX}${code}`) : null; }
  function roomToken(code){ return code ? localStorage.getItem(`${ROOM_TOKEN_PREFIX}${code}`) : null; }
  function roomAdmin(code){ return code ? localStorage.getItem(`${ROOM_ADMIN_PREFIX}${code}`) : null; }

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    window.clearTimeout(toast.timer);
    toast.timer=window.setTimeout(()=>node.classList.remove('show'),1700);
  }

  function groupUrl(code){
    const url=new URL(window.location.href);
    url.searchParams.delete('room');
    url.searchParams.set('group',code);
    url.hash='picks';
    return url.toString();
  }

  function openRoom(group,room,eventId){
    if(!group || !room) return;
    const token=groupToken(group);
    const admin=groupAdmin(group);
    if(token) localStorage.setItem(`${ROOM_TOKEN_PREFIX}${room}`,token);
    if(admin) localStorage.setItem(`${ROOM_ADMIN_PREFIX}${room}`,admin);
    localStorage.setItem('ufc-picks:last-room',room);
    localStorage.removeItem('ufc-picks:auto-restore-disabled');
    const url=new URL(window.location.href);
    url.searchParams.set('group',group);
    url.searchParams.set('room',room);
    if(eventId) url.searchParams.set('event',eventId);
    url.hash='picks';
    window.location.assign(url.toString());
  }

  function ensureCard(){
    if(document.getElementById('picksGroupCard')) return;
    const shell=document.querySelector('#picks .picks-shell');
    if(!shell) return;
    const card=document.createElement('details');
    card.id='picksGroupCard';
    card.className='picks-group-card';
    card.hidden=true;
    card.innerHTML='<summary><div><span>UFC PICKS GROUP</span><strong>Season Standings</strong></div><b>Loading…</b></summary><div id="picksGroupContent" class="picks-group-content"></div>';
    const recap=document.getElementById('picksEventRecap');
    const banner=document.getElementById('picksRoomBanner');
    if(recap) recap.insertAdjacentElement('afterend',card);
    else if(banner) banner.insertAdjacentElement('afterend',card);
    else shell.prepend(card);
  }

  function memberRows(members,meId){
    return members.map((member,index)=>`<div class="picks-group-member${index===0?' leader':''}">
      <span>#${index+1}</span>
      <div><strong>${safe(member.display_name)}${member.id===meId?' <em>YOU</em>':''}</strong><small>${member.correct}/${member.picks_made} correct · ${member.accuracy}% · ${member.event_wins} event win${member.event_wins===1?'':'s'}</small></div>
      <b>${member.points}<small>PTS</small></b>
    </div>`).join('');
  }

  function eventRows(events,code){
    return events.map(event=>`<div class="picks-group-event${event.is_active?' active':''}">
      <div><span>${safe(event.status)}</span><strong>${safe(event.name)}</strong><small>${safe(event.subtitle || '')}</small></div>
      <button type="button" data-group-room="${safe(event.room_code)}" data-group-event="${safe(event.event_id)}">${event.is_active?'Open current':'Open recap'}</button>
    </div>`).join('');
  }

  function render(snapshot){
    ensureCard();
    const card=document.getElementById('picksGroupCard');
    const target=document.getElementById('picksGroupContent');
    if(!card || !target || !snapshot?.group) return;

    const members=snapshot.members || [];
    const events=snapshot.events || [];
    const available=snapshot.available_events || [];
    const leader=members[0];
    card.hidden=false;
    card.querySelector('summary strong').textContent=snapshot.group.name;
    card.querySelector('summary b').textContent=`${events.length} event${events.length===1?'':'s'} · ${leader ? `${leader.display_name} leads` : 'No leader yet'}`;

    const options=available.map(event=>`<option value="${safe(event.id)}">${safe(event.name)}${event.subtitle?` · ${safe(event.subtitle)}`:''}</option>`).join('');
    target.innerHTML=`
      <div class="picks-group-top">
        <div><span>PERMANENT GROUP</span><h3>Season Leaderboard</h3><p>The same members, one share link, and cumulative standings across every UFC event.</p></div>
        <button id="picksShareGroup" type="button">Share group</button>
      </div>
      <div class="picks-group-members">${memberRows(members,snapshot.me?.id)}</div>
      <div class="picks-group-section-head"><span>EVENTS</span><b>${events.length} played</b></div>
      <div class="picks-group-events">${eventRows(events,snapshot.group.code)}</div>
      ${snapshot.group.is_admin ? `<div class="picks-group-owner">
        <div><span>GROUP OWNER</span><strong>Add the next UFC event</strong><small>Everyone stays in the group automatically.</small></div>
        ${available.length ? `<select id="picksGroupEventSelect">${options}</select><button id="picksGroupAddEvent" type="button">Add event</button>` : '<p>No new upcoming event has been loaded yet.</p>'}
      </div>` : ''}`;

    document.getElementById('picksShareGroup')?.addEventListener('click',()=>shareGroup(snapshot.group));
    target.querySelectorAll('[data-group-room]').forEach(button=>button.addEventListener('click',()=>openRoom(snapshot.group.code,button.dataset.groupRoom,button.dataset.groupEvent)));
    document.getElementById('picksGroupAddEvent')?.addEventListener('click',()=>addEvent(snapshot.group.code));
  }

  async function shareGroup(group){
    const url=groupUrl(group.code);
    const payload={title:group.name,text:`Join ${group.name}. This link works for every UFC event.`,url};
    try{
      if(navigator.share) await navigator.share(payload);
      else{ await navigator.clipboard.writeText(url); toast('Permanent group link copied'); }
    }catch(_error){}
  }

  async function addEvent(code){
    const select=document.getElementById('picksGroupEventSelect');
    const eventId=select?.value;
    const admin=groupAdmin(code);
    if(!eventId || !admin) return;
    const button=document.getElementById('picksGroupAddEvent');
    if(button){ button.disabled=true; button.textContent='Adding…'; }
    const {data,error}=await client.rpc('picks_group_add_event',{p_group_code:code,p_admin_token:admin,p_event_id:eventId});
    if(error){
      if(button){ button.disabled=false; button.textContent='Add event'; }
      toast(error.message || 'Event was not added');
      return;
    }
    toast('Next event added');
    openRoom(code,data.room_code,data.event_id);
  }

  async function loadSnapshot(code,token,admin){
    const {data,error}=await client.rpc('picks_group_snapshot',{p_group_code:code,p_member_token:token,p_admin_token:admin || null});
    if(error) return null;
    return data;
  }

  async function resolveCurrentRoom(){
    const room=roomCode();
    const token=roomToken(room);
    if(!room || !token) return false;
    const admin=roomAdmin(room);
    const {data,error}=await client.rpc('picks_group_for_room',{p_room_code:room,p_member_token:token,p_admin_token:admin || null});
    if(error || !data?.group_code) return false;

    const code=normalize(data.group_code);
    localStorage.setItem(`${GROUP_TOKEN_PREFIX}${code}`,token);
    if(admin) localStorage.setItem(`${GROUP_ADMIN_PREFIX}${code}`,admin);

    const url=new URL(window.location.href);
    if(url.searchParams.get('group')!==code){
      url.searchParams.set('group',code);
      history.replaceState(null,'',url.toString());
    }

    const snapshot=await loadSnapshot(code,token,admin);
    if(snapshot) render(snapshot);
    return true;
  }

  function configureInvite(group){
    inviteGroup=group;
    const setup=document.getElementById('picksRoomSetup');
    if(!setup) return;
    setup.hidden=false;
    document.querySelector('.picks-mode-switch')?.setAttribute('hidden','');
    document.getElementById('picksJoinFields')?.setAttribute('hidden','');
    const intro=document.getElementById('picksRoomIntro');
    if(intro) intro.textContent=`Join ${group.name}. Your name is all you need, and you will stay in for future UFC events.`;
    const action=document.getElementById('picksRoomAction');
    if(action) action.textContent='Join Permanent Group';
    const status=document.getElementById('picksStatus');
    if(status) status.textContent=`${group.member_count || 0} member${group.member_count===1?'':'s'} · ${group.event_name || 'Next event coming soon'}`;
  }

  async function joinInvite(event){
    if(!inviteGroup) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const name=document.getElementById('picksDisplayName')?.value.trim();
    if(!name){ toast('Enter your name first'); return; }
    const button=document.getElementById('picksRoomAction');
    if(button){ button.disabled=true; button.textContent='Joining…'; }
    const {data,error}=await client.rpc('picks_join_group',{p_group_code:inviteGroup.code,p_display_name:name});
    if(error){
      if(button){ button.disabled=false; button.textContent='Join Permanent Group'; }
      toast(error.message || 'Could not join group');
      return;
    }
    const code=normalize(data.group.code);
    const token=data.member_token;
    localStorage.setItem(`${GROUP_TOKEN_PREFIX}${code}`,token);
    localStorage.setItem('ufc-picks:display-name',name);
    if(data.active_room?.code){
      localStorage.setItem(`${ROOM_TOKEN_PREFIX}${data.active_room.code}`,token);
      openRoom(code,data.active_room.code,data.active_room.event_id);
    }else{
      toast('You joined. The next event has not been added yet.');
    }
  }

  async function resolveGroupLink(){
    const code=groupCode();
    if(!code || roomCode()) return false;
    const {data:publicGroup,error}=await client.rpc('picks_group_public',{p_group_code:code});
    if(error || !publicGroup?.code) return false;

    const token=groupToken(code);
    if(!token){ configureInvite(publicGroup); return true; }

    const snapshot=await loadSnapshot(code,token,groupAdmin(code));
    if(!snapshot){ configureInvite(publicGroup); return true; }
    if(snapshot.active_room?.code){
      openRoom(code,snapshot.active_room.code,snapshot.active_room.event_id);
      return true;
    }
    render(snapshot);
    return true;
  }

  async function refresh(){
    if(loading) return;
    loading=true;
    try{
      const handledGroup=await resolveGroupLink();
      if(handledGroup && !roomCode()) return;
      await resolveCurrentRoom();
    }finally{
      loading=false;
    }
  }

  function start(){
    ensureCard();
    document.getElementById('picksRoomAction')?.addEventListener('click',joinInvite,true);
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