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

  function formatLock(value){
    if(!value) return 'TBD';
    return new Intl.DateTimeFormat('en-US',{weekday:'short',hour:'numeric',minute:'2-digit'}).format(new Date(value));
  }

  function eventKicker(event){
    if(event.status === 'live') return 'Live UFC event';
    const eventDay = new Date(event.eventDate);
    const today = new Date();
    if(eventDay.toDateString() === today.toDateString()) return 'Tonight';
    return `Upcoming ${event.eventType === 'numbered' ? 'numbered event' : 'fight night'}`;
  }

  function fighterInitials(name){
    return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  }

  function fighterPhotoUrl(name,fight,side){
    const eventPhoto = side === 'red' ? fight.redPhoto : fight.bluePhoto;
    const pickPhoto = window.UFC_PICKS_PHOTOS?.[name];
    const rosterPhoto = window.DISPLAY_OVERRIDES?.[name]?.thumbUrl || window.DISPLAY_OVERRIDES?.[name]?.photoUrl;
    return eventPhoto || pickPhoto || rosterPhoto || '';
  }

  function fighterVisual(name,fight,side){
    const url = fighterPhotoUrl(name,fight,side);
    return `<span class="pick-fighter-photo">${url
      ? `<img src="${safe(url)}" alt="" loading="lazy">`
      : `<span>${safe(fighterInitials(name))}</span>`}</span>`;
  }

  function toast(message){
    const node = $('picksToast');
    if(!node) return;
    node.textContent = message;
    node.classList.add('show');
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(()=>node.classList.remove('show'),1600);
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

  function preferredEvent(events,currentId){
    return events.find(event=>event.id===currentId)
      || events.find(event=>event.status==='live')
      || events.find(event=>event.status==='upcoming')
      || events[0]
      || null;
  }

  function renderEventSelector(){
    const select = $('picksEventSelect');
    const wrap = $('picksEventPicker');
    if(!select) return;
    select.innerHTML = state.events.map(event => `<option value="${safe(event.id)}">${safe(event.name)}${event.subtitle ? `: ${safe(event.subtitle)}` : ''}</option>`).join('');
    if(state.event) select.value = state.event.id;
    if(wrap) wrap.hidden = state.events.length <= 1;
  }

  function renderHero(){
    const event = state.event;
    const target = $('picksEventHero');
    if(!target) return;
    if(!event){ target.innerHTML = '<div class="picks-empty">No upcoming UFC event has been loaded.</div>'; return; }
    const live = event.status === 'live';
    target.classList.toggle('is-live',live);
    target.innerHTML = `
      <div class="picks-event-kicker${live ? ' live' : ''}">${safe(eventKicker(event))}</div>
      <h3>${safe(event.name)}</h3>
      <div class="picks-event-matchup">${safe(event.subtitle || '')}</div>
      <div class="picks-event-meta">
        <span class="picks-pill">${safe(formatDate(event.eventDate))}</span>
        <span class="picks-pill">${safe(event.location || 'Location TBD')}</span>
        <span class="picks-pill">${safe(event.cardRule || '')}</span>
        <span class="picks-pill">${event.fights.length} fights</span>
      </div>`;
  }

  function copyRoomCode(){
    if(!state.room) return;
    navigator.clipboard?.writeText(state.room.code).then(()=>toast('Room code copied')).catch(()=>toast(state.room.code));
  }

  function switchRoom(){
    state.room = null;
    state.me = null;
    state.members = [];
    state.memberToken = null;
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    history.replaceState(null,'',url.toString());
    status('Enter a name to create or join a room.');
    render();
  }

  function renderRoom(){
    const banner = $('picksRoomBanner');
    const setup = $('picksRoomSetup');
    const createButton = $('picksCreateRoom');
    const joinButton = $('picksJoinRoom');
    if(createButton) createButton.disabled = !supabaseReady || !state.event;
    if(joinButton) joinButton.disabled = !supabaseReady || !state.event;
    if(setup) setup.hidden = Boolean(state.room);
    if(!banner) return;
    if(!state.room){
      banner.classList.remove('active');
      banner.innerHTML='';
      return;
    }
    const playerCount = Math.max(state.members.length,1);
    banner.classList.add('active');
    banner.innerHTML = `
      <div class="picks-room-copy">
        <span class="picks-room-live">Room active</span>
        <strong>${safe(state.room.name || 'Fight Picks')}</strong>
        <div class="picks-room-meta">
          <button id="picksCopyCode" class="picks-code" type="button" aria-label="Copy room code">${safe(state.room.code)}</button>
          <span>${playerCount} player${playerCount === 1 ? '' : 's'} joined</span>
        </div>
      </div>
      <div class="picks-room-actions">
        <button id="picksShareRoom" class="picks-primary compact" type="button">Share</button>
        <button id="picksSwitchRoom" class="picks-secondary compact" type="button">Switch</button>
      </div>`;
    $('picksShareRoom')?.addEventListener('click',shareRoom);
    $('picksCopyCode')?.addEventListener('click',copyRoomCode);
    $('picksSwitchRoom')?.addEventListener('click',switchRoom);
  }

  function fightSectionClass(section){
    return String(section || '').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  }

  function renderFighterButton(fight,side,selected,locked){
    const name = side === 'red' ? fight.red : fight.blue;
    const resultClass = fight.winner ? (fight.winner === name ? ' correct' : ' wrong') : '';
    const selectedClass = selected === name ? ' selected' : '';
    return `<button class="pick-fighter${selectedClass}${resultClass}" type="button"
      data-fight="${safe(fight.id)}" data-pick="${safe(name)}" aria-pressed="${selected === name ? 'true' : 'false'}" ${locked ? 'disabled' : ''}>
      ${fighterVisual(name,fight,side)}
      <span class="pick-fighter-name">${safe(name)}</span>
      <span class="pick-selected-mark" aria-hidden="true">✓</span>
    </button>`;
  }

  function renderProgress(){
    const progress = $('picksProgress');
    const event = state.event;
    if(!progress || !event) return;
    const count = selectedCount();
    const pct = event.fights.length ? Math.round((count/event.fights.length)*100) : 0;
    const selectedNames = event.fights.map(fight=>state.picks[fight.id]).filter(Boolean);
    const visibleNames = selectedNames.slice(0,4);
    const more = selectedNames.length-visibleNames.length;
    progress.innerHTML = `
      <div class="picks-progress-top">
        <div><strong>${count}/${event.fights.length}</strong><span>picks made</span></div>
        <b>${count === event.fights.length ? 'Card complete' : `${event.fights.length-count} remaining`}</b>
      </div>
      <div class="picks-progress-bar"><i style="width:${pct}%"></i></div>
      <div class="picks-summary-chips">${visibleNames.map(name=>`<span>${safe(name)}</span>`).join('')}${more>0?`<span>+${more} more</span>`:''}</div>`;
  }

  function renderFights(){
    const target = $('picksFightList');
    const event = state.event;
    if(!target) return;
    if(!event){ target.innerHTML='<div class="picks-empty">Add an event to start picking.</div>'; return; }
    target.innerHTML = [...event.fights].sort((a,b)=>a.order-b.order).map((fight,index) => {
      const selected = state.picks[fight.id];
      const locked = isLocked(fight);
      const sectionClass = fightSectionClass(fight.cardSection);
      const footer = fight.winner
        ? `Winner: ${safe(fight.winner)}`
        : locked
          ? 'This fight is locked.'
          : selected
            ? `Your pick: ${safe(selected)} · saved automatically`
            : 'Pick one winner. Saves automatically.';
      return `<article class="pick-fight section-${sectionClass}${fight.cardSection === 'Main Event' ? ' featured' : ''}" data-fight="${safe(fight.id)}">
        <div class="pick-fight-head">
          <div><span class="pick-fight-number">${String(index+1).padStart(2,'0')}</span><strong>${safe(fight.cardSection)} · ${safe(fight.weightClass)}</strong></div>
          <span class="${locked ? 'locked' : ''}">${locked ? 'Locked' : `Locks ${safe(formatLock(fight.lockAt))}`}</span>
        </div>
        <div class="pick-matchup">
          ${renderFighterButton(fight,'red',selected,locked)}
          <div class="pick-vs">VS</div>
          ${renderFighterButton(fight,'blue',selected,locked)}
        </div>
        <div class="pick-lock${locked ? ' locked' : ''}${selected ? ' has-pick' : ''}">${footer}</div>
      </article>`;
    }).join('');
    target.querySelectorAll('.pick-fighter').forEach(button => button.addEventListener('click',()=>choose(button.dataset.fight,button.dataset.pick)));
    renderProgress();
  }

  function renderStandings(){
    const target = $('picksStandings');
    const card = $('picksStandingsCard');
    if(!target) return;
    if(card) card.hidden = !state.room;
    if(!state.room){
      target.innerHTML='<div class="picks-empty">Create or join a room to see your friend standings.</div>';
      return;
    }
    const members = [...state.members].sort((a,b)=>(b.score||0)-(a.score||0) || (b.picks_made||0)-(a.picks_made||0) || String(a.display_name).localeCompare(String(b.display_name)));
    target.innerHTML = members.map((member,index)=>`
      <div class="picks-standing-row">
        <div class="picks-standing-rank">#${index+1}</div>
        <div><strong>${safe(member.display_name)}${member.id === state.me?.id ? ' <span class="picks-you">You</span>' : ''}</strong><div class="meta">${member.picks_made || 0}/${state.event?.fights.length || 0} picks made</div></div>
        <div class="picks-standing-score"><strong>${member.score || 0}</strong><small>PTS</small></div>
      </div>`).join('') || '<div class="picks-empty">No room members yet.</div>';
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
    toast(`${fighter} selected`);
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
    const payload = {title:`${state.room.name || 'UFC Picks'} — ${state.room.code}`,text:`Join my UFC picks room. Code: ${state.room.code}`,url:roomUrl(state.room.code)};
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
    status('Room created. Share it with your friends.','good');
    await refreshRoom();
    $('picksRoomBanner')?.scrollIntoView({behavior:'smooth',block:'nearest'});
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
    const current = state.event?.id;
    state.events = data;
    state.event = preferredEvent(state.events,current);
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
      state.room=null;
      state.me=null;
      state.members=[];
      state.memberToken=null;
      loadLocalPicks();
      render();
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
