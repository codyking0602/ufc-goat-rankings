(function(){
  'use strict';

  const eventsFallback = Array.isArray(window.UFC_PICKS_EVENTS) ? window.UFC_PICKS_EVENTS : [];
  const config = window.UFC_SUPABASE_CONFIG || {};
  const supabaseReady = Boolean(config.url && config.anonKey && window.supabase?.createClient);
  const client = supabaseReady ? window.supabase.createClient(config.url, config.anonKey) : null;
  const state = {
    events: eventsFallback,
    event: eventsFallback[0] || null,
    room: null,
    me: null,
    members: [],
    picks: {},
    memberToken: null,
    saving: new Set()
  };

  const $ = id => document.getElementById(id);
  const storageKey = suffix => `ufc-picks:${state.event?.id || 'none'}:${suffix}`;
  const safe = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function isLocked(fight){
    return Boolean(fight.winner) || Date.now() >= new Date(fight.lockAt).getTime();
  }

  function formatDate(value){
    if(!value) return 'Date TBD';
    return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
  }

  function toast(message){
    const node = $('picksToast');
    if(!node) return;
    node.textContent = message;
    node.classList.add('show');
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(()=>node.classList.remove('show'),1500);
  }

  function status(message,type=''){
    const node = $('picksStatus');
    if(!node) return;
    node.textContent = message;
    node.className = `picks-status ${type}`.trim();
  }

  function loadLocalPicks(){
    if(!state.event) return;
    try{ state.picks = JSON.parse(localStorage.getItem(storageKey('local-picks')) || '{}'); }
    catch(_error){ state.picks = {}; }
  }

  function saveLocalPicks(){
    localStorage.setItem(storageKey('local-picks'),JSON.stringify(state.picks));
  }

  function selectedCount(){
    return state.event?.fights.filter(fight => state.picks[fight.id]).length || 0;
  }

  function renderEventSelector(){
    const select = $('picksEventSelect');
    if(!select) return;
    select.innerHTML = state.events.map(event => `<option value="${safe(event.id)}">${safe(event.name)}${event.subtitle ? `: ${safe(event.subtitle)}` : ''}</option>`).join('');
    if(state.event) select.value = state.event.id;
  }

  function renderHero(){
    const event = state.event;
    const target = $('picksEventHero');
    if(!target) return;
    if(!event){ target.innerHTML = '<div class="picks-empty">No upcoming UFC event has been loaded.</div>'; return; }
    target.innerHTML = `<div class="picks-event-kicker">Upcoming ${event.eventType === 'numbered' ? 'numbered event' : 'fight night'}</div>
      <h3>${safe(event.name)}</h3>
      <div class="name">${safe(event.subtitle || '')}</div>
      <div class="picks-event-meta">
        <span class="picks-pill">${safe(formatDate(event.eventDate))}</span>
        <span class="picks-pill">${safe(event.location || 'Location TBD')}</span>
        <span class="picks-pill">${safe(event.cardRule || '')}</span>
        <span class="picks-pill">${event.fights.length} fights</span>
      </div>`;
  }

  function renderRoom(){
    const banner = $('picksRoomBanner');
    const createButton = $('picksCreateRoom');
    const joinButton = $('picksJoinRoom');
    if(createButton) createButton.disabled = !supabaseReady || !state.event;
    if(joinButton) joinButton.disabled = !supabaseReady || !state.event;
    if(!banner) return;
    if(!state.room){ banner.classList.remove('active'); banner.innerHTML=''; return; }
    banner.classList.add('active');
    banner.innerHTML = `<div><strong>${safe(state.room.name || 'Fight Picks')}</strong><small>Room code: ${safe(state.room.code)}</small></div><button id="picksShareRoom" class="picks-secondary" type="button">Share Room</button>`;
    $('picksShareRoom')?.addEventListener('click',shareRoom);
  }

  function renderFights(){
    const target = $('picksFightList');
    const event = state.event;
    if(!target) return;
    if(!event){ target.innerHTML='<div class="picks-empty">Add an event to start picking.</div>'; return; }
    target.innerHTML = [...event.fights].sort((a,b)=>a.order-b.order).map(fight => {
      const selected = state.picks[fight.id];
      const locked = isLocked(fight);
      const redClass = selected === fight.red ? ' selected' : '';
      const blueClass = selected === fight.blue ? ' selected' : '';
      const resultRed = fight.winner ? (fight.winner === fight.red ? ' correct' : ' wrong') : '';
      const resultBlue = fight.winner ? (fight.winner === fight.blue ? ' correct' : ' wrong') : '';
      return `<article class="pick-fight" data-fight="${safe(fight.id)}">
        <div class="pick-fight-head"><strong>${safe(fight.cardSection)} · ${safe(fight.weightClass)}</strong><span>${locked ? 'Locked' : `Estimated lock ${safe(formatDate(fight.lockAt))}`}</span></div>
        <div class="pick-matchup">
          <button class="pick-fighter${redClass}${resultRed}" type="button" data-fight="${safe(fight.id)}" data-pick="${safe(fight.red)}" ${locked ? 'disabled' : ''}>${safe(fight.red)}</button>
          <div class="pick-vs">VS</div>
          <button class="pick-fighter${blueClass}${resultBlue}" type="button" data-fight="${safe(fight.id)}" data-pick="${safe(fight.blue)}" ${locked ? 'disabled' : ''}>${safe(fight.blue)}</button>
        </div>
        <div class="pick-lock${locked ? ' locked' : ''}">${fight.winner ? `Winner: ${safe(fight.winner)}` : locked ? 'This fight is locked.' : 'Tap one fighter. Your pick saves automatically.'}</div>
      </article>`;
    }).join('');
    target.querySelectorAll('.pick-fighter').forEach(button => button.addEventListener('click',()=>choose(button.dataset.fight,button.dataset.pick)));
    const progress = $('picksProgress');
    if(progress) progress.innerHTML = `<strong>${selectedCount()} / ${event.fights.length}</strong><span class="meta">picks made</span>`;
  }

  function renderStandings(){
    const target = $('picksStandings');
    if(!target) return;
    if(!state.room){ target.innerHTML='<div class="picks-empty">Create or join a room to see your friend standings.</div>'; return; }
    const members = [...state.members].sort((a,b)=>(b.score||0)-(a.score||0) || String(a.display_name).localeCompare(String(b.display_name)));
    target.innerHTML = members.map((member,index)=>`<div class="picks-standing-row"><div class="picks-standing-rank">#${index+1}</div><div><strong>${safe(member.display_name)}${member.id === state.me?.id ? ' (You)' : ''}</strong><div class="meta">${member.picks_made || 0} picks made</div></div><strong>${member.score || 0}</strong></div>`).join('') || '<div class="picks-empty">No room members yet.</div>';
  }

  function render(){
    renderEventSelector();
    renderHero();
    renderRoom();
    renderFights();
    renderStandings();
    const note = $('picksSetupNote');
    if(note) note.hidden = supabaseReady;
  }

  async function choose(fightId,fighter){
    const fight = state.event?.fights.find(item=>item.id===fightId);
    if(!fight || isLocked(fight) || state.saving.has(fightId)) return;
    state.picks[fightId] = fighter;
    saveLocalPicks();
    renderFights();
    if(!state.room || !client || !state.memberToken){ toast('Pick saved on this device'); return; }
    state.saving.add(fightId);
    const {error} = await client.rpc('picks_save_pick',{p_room_code:state.room.code,p_member_token:state.memberToken,p_fight_id:fightId,p_fighter_name:fighter});
    state.saving.delete(fightId);
    if(error){ status(error.message || 'Could not save that pick.','bad'); toast('Pick not saved'); return; }
    status('Your picks save automatically.','good');
    toast('Pick saved');
    await refreshRoom();
  }

  function roomUrl(code){
    const url = new URL(window.location.href);
    url.searchParams.set('room',code);
    url.hash = 'picks';
    return url.toString();
  }

  async function shareRoom(){
    if(!state.room) return;
    const payload = {title:`${state.room.name || 'UFC Picks'} — ${state.room.code}`,text:`Join my UFC picks room: ${state.room.code}`,url:roomUrl(state.room.code)};
    try{
      if(navigator.share) await navigator.share(payload);
      else{ await navigator.clipboard.writeText(payload.url); toast('Room link copied'); }
    }catch(_error){}
  }

  async function createRoom(){
    const displayName = $('picksDisplayName')?.value.trim();
    const roomName = $('picksRoomName')?.value.trim() || `${displayName || 'My'}'s Fight Picks`;
    if(!displayName){ status('Enter your name first.','bad'); return; }
    status('Creating room…');
    const {data,error} = await client.rpc('picks_create_room',{p_event_id:state.event.id,p_display_name:displayName,p_room_name:roomName});
    if(error){ status(error.message || 'Could not create room.','bad'); return; }
    state.room = data.room;
    state.me = data.member;
    localStorage.setItem('ufc-picks:display-name',displayName);
    state.memberToken = data.member_token;
    localStorage.setItem(`ufc-picks:room:${state.room.code}`,state.memberToken);
    history.replaceState(null,'',roomUrl(state.room.code));
    status('Room created. Share the link with your friends.','good');
    await refreshRoom();
  }

  async function joinRoom(){
    const displayName = $('picksDisplayName')?.value.trim();
    const code = $('picksRoomCode')?.value.trim().toUpperCase();
    if(!displayName || !code){ status('Enter your name and room code.','bad'); return; }
    status('Joining room…');
    const {data,error} = await client.rpc('picks_join_room',{p_room_code:code,p_display_name:displayName});
    if(error){ status(error.message || 'Could not join room.','bad'); return; }
    state.room = data.room;
    state.me = data.member;
    localStorage.setItem('ufc-picks:display-name',displayName);
    state.memberToken = data.member_token;
    localStorage.setItem(`ufc-picks:room:${state.room.code}`,state.memberToken);
    history.replaceState(null,'',roomUrl(state.room.code));
    status('You are in. Tap your winners.','good');
    await refreshRoom();
  }

  async function refreshRoom(){
    if(!client || !state.room || !state.memberToken) return;
    const {data,error} = await client.rpc('picks_room_snapshot',{p_room_code:state.room.code,p_member_token:state.memberToken});
    if(error){ status(error.message || 'Could not refresh room.','bad'); return; }
    state.room = data.room;
    const roomEvent = state.events.find(event=>event.id===state.room.event_id);
    if(roomEvent && roomEvent.id !== state.event?.id){ state.event=roomEvent; loadLocalPicks(); }
    state.me = data.me;
    state.members = data.members || [];
    if(data.my_picks) state.picks = Object.fromEntries(data.my_picks.map(pick=>[pick.fight_id,pick.fighter_name]));
    render();
  }

  async function loadBackendEvents(){
    if(!client) return;
    const {data,error} = await client.rpc('picks_public_events');
    if(error || !Array.isArray(data) || !data.length) return;
    state.events = data;
    const current = state.event?.id;
    state.event = state.events.find(event=>event.id===current) || state.events[0];
    loadLocalPicks();
  }

  async function resumeRoomFromUrl(){
    if(!client) return;
    const code = new URL(window.location.href).searchParams.get('room')?.trim().toUpperCase();
    if(!code) return;
    if($('picksRoomCode')) $('picksRoomCode').value=code;
    const token = localStorage.getItem(`ufc-picks:room:${code}`);
    if(!token){ status(`Enter your name to join room ${code}.`); return; }
    state.room = {code};
    state.memberToken = token;
    await refreshRoom();
  }

  function bind(){
    $('picksEventSelect')?.addEventListener('change',event=>{
      state.event = state.events.find(item=>item.id===event.target.value) || state.events[0] || null;
      state.room=null; state.me=null; state.members=[]; state.memberToken=null;
      loadLocalPicks(); render();
    });
    $('picksCreateRoom')?.addEventListener('click',createRoom);
    $('picksJoinRoom')?.addEventListener('click',joinRoom);
  }

  async function init(){
    if(!$('picks')) return;
    const roomCode = new URL(window.location.href).searchParams.get('room');
    if(window.location.hash === '#picks' || roomCode){ document.querySelector('.tab[data-view="picks"]')?.click(); }
    const savedName = localStorage.getItem('ufc-picks:display-name');
    if(savedName && $('picksDisplayName')) $('picksDisplayName').value=savedName;
    loadLocalPicks();
    bind();
    render();
    await loadBackendEvents();
    render();
    await resumeRoomFromUrl();
    window.setInterval(()=>{ if(state.room) refreshRoom(); else renderFights(); },30000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
