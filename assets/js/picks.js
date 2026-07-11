(function(){
  'use strict';

  const eventsFallback = Array.isArray(window.UFC_PICKS_EVENTS) ? window.UFC_PICKS_EVENTS : [];
  const config = window.UFC_SUPABASE_CONFIG || {};
  const supabaseReady = Boolean(config.url && config.anonKey && window.supabase?.createClient);
  const client = supabaseReady ? window.supabase.createClient(config.url,config.anonKey) : null;
  const state = {
    events:eventsFallback,
    event:eventsFallback[0] || null,
    room:null,
    me:null,
    members:[],
    picks:{},
    underdogLockFightId:null,
    memberToken:null,
    adminToken:null,
    roomMode:'create',
    saving:new Set()
  };

  const $ = id => document.getElementById(id);
  const safe = value => String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const eventStorageKey = suffix => `ufc-picks:${state.event?.id || 'none'}:${suffix}`;
  const roomStorageKey = (code,suffix) => `ufc-picks:${suffix}:${code}`;

  function isLocked(fight){
    return Boolean(fight.winner) || (fight.resultStatus && fight.resultStatus !== 'scheduled') || Date.now() >= new Date(fight.lockAt).getTime();
  }

  function formatDate(value){
    if(!value) return 'Date TBD';
    return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
  }

  function formatLock(value){
    if(!value) return 'TBD';
    return new Intl.DateTimeFormat('en-US',{weekday:'short',hour:'numeric',minute:'2-digit'}).format(new Date(value));
  }

  function formatOdds(value){
    const odds = Number(value);
    if(!Number.isFinite(odds) || odds === 0) return '';
    return odds > 0 ? `+${odds}` : String(odds);
  }

  function eventKicker(event){
    if(event.status === 'live') return 'Live UFC event';
    if(event.status === 'complete') return 'Completed UFC event';
    const day = new Date(event.eventDate);
    if(day.toDateString() === new Date().toDateString()) return 'Tonight';
    return `Upcoming ${event.eventType === 'numbered' ? 'numbered event' : 'fight night'}`;
  }

  function fighterInitials(name){
    return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  }

  function fighterPhotoUrl(name,fight,side){
    const eventPhoto = side === 'red' ? fight.redPhoto : fight.bluePhoto;
    const pickPhoto = window.UFC_PICKS_PHOTOS?.[name];
    const roster = window.DISPLAY_OVERRIDES?.[name];
    return eventPhoto || pickPhoto || roster?.thumbUrl || roster?.photoUrl || '';
  }

  function fighterVisual(name,fight,side){
    const url = fighterPhotoUrl(name,fight,side);
    return `<span class="pick-fighter-photo">${url ? `<img src="${safe(url)}" alt="" loading="lazy">` : `<span>${safe(fighterInitials(name))}</span>`}</span>`;
  }

  function oddsFor(fight,side){
    const value = side === 'red' ? fight.redOdds : fight.blueOdds;
    return Number.isFinite(Number(value)) ? Number(value) : null;
  }

  function impliedProbability(odds){
    const n = Number(odds);
    if(!Number.isFinite(n) || n === 0) return 0;
    return n < 0 ? (-n)/((-n)+100) : 100/(n+100);
  }

  function favoriteSide(fight){
    const red = oddsFor(fight,'red');
    const blue = oddsFor(fight,'blue');
    if(red === null || blue === null || red === blue) return null;
    return impliedProbability(red) > impliedProbability(blue) ? 'red' : 'blue';
  }

  function isUnderdogSelection(fight,fighter){
    if(!fight || !fighter) return false;
    if(fighter === fight.red) return Number(fight.redOdds) > 0;
    if(fighter === fight.blue) return Number(fight.blueOdds) > 0;
    return false;
  }

  function toast(message){
    const node = $('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),1700);
  }

  function status(message,type=''){
    const node=$('picksStatus');
    if(!node) return;
    node.textContent=message;
    node.className=`picks-status ${type}`.trim();
  }

  function loadLocalPicks(){
    if(!state.event) return;
    try{ state.picks=JSON.parse(localStorage.getItem(eventStorageKey('local-picks')) || '{}'); }
    catch(_error){ state.picks={}; }
    state.underdogLockFightId=localStorage.getItem(eventStorageKey('underdog-lock')) || null;
  }

  function saveLocalPicks(){
    localStorage.setItem(eventStorageKey('local-picks'),JSON.stringify(state.picks));
    if(state.underdogLockFightId) localStorage.setItem(eventStorageKey('underdog-lock'),state.underdogLockFightId);
    else localStorage.removeItem(eventStorageKey('underdog-lock'));
  }

  function preferredEvent(events,currentId){
    return events.find(event=>event.id===currentId)
      || events.find(event=>event.status==='live')
      || events.find(event=>event.status==='upcoming')
      || events[0]
      || null;
  }

  function renderEventSelector(){
    const select=$('picksEventSelect');
    const wrap=$('picksEventPicker');
    if(!select) return;
    select.innerHTML=state.events.map(event=>`<option value="${safe(event.id)}">${safe(event.name)}${event.subtitle ? `: ${safe(event.subtitle)}` : ''}</option>`).join('');
    if(state.event) select.value=state.event.id;
    if(wrap) wrap.hidden=state.events.length<=1;
  }

  function eventOddsMeta(event){
    const fight=event?.fights?.find(item=>item.oddsSource || item.oddsUpdatedAt);
    if(!fight) return '';
    const parts=[];
    if(fight.oddsSource) parts.push(fight.oddsSource);
    if(fight.oddsUpdatedAt){
      parts.push(`updated ${new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(fight.oddsUpdatedAt))}`);
    }
    return parts.join(' · ');
  }

  function renderHero(){
    const target=$('picksEventHero');
    const event=state.event;
    if(!target) return;
    if(!event){ target.innerHTML='<div class="picks-empty">No UFC event is loaded.</div>'; return; }
    const live=event.status==='live';
    target.classList.toggle('is-live',live);
    const oddsMeta=eventOddsMeta(event);
    target.innerHTML=`
      <div class="picks-event-kicker${live ? ' live' : ''}">${safe(eventKicker(event))}</div>
      <h3>${safe(event.name)}</h3>
      <div class="picks-event-matchup">${safe(event.subtitle || '')}</div>
      <div class="picks-event-meta">
        <span class="picks-pill">${safe(formatDate(event.eventDate))}</span>
        <span class="picks-pill">${safe(event.location || 'Location TBD')}</span>
        <span class="picks-pill">${safe(event.cardRule || '')}</span>
        <span class="picks-pill">${event.fights.length} fights</span>
      </div>
      ${oddsMeta ? `<div class="picks-odds-source">Odds snapshot: ${safe(oddsMeta)} · for context only</div>` : ''}`;
  }

  function setRoomMode(mode){
    state.roomMode=mode==='join' ? 'join' : 'create';
    $('picksCreateMode')?.classList.toggle('active',state.roomMode==='create');
    $('picksJoinMode')?.classList.toggle('active',state.roomMode==='join');
    if($('picksJoinFields')) $('picksJoinFields').hidden=state.roomMode!=='join';
    if($('picksRoomAction')) $('picksRoomAction').textContent=state.roomMode==='create' ? 'Start Picks Room' : 'Join Picks Room';
    if($('picksRoomIntro')) $('picksRoomIntro').textContent=state.roomMode==='create'
      ? 'Start a room, then send one link to the group.'
      : 'Enter the code from your friend, or open their shared link.';
  }

  function copyRoomCode(){
    if(!state.room) return;
    navigator.clipboard?.writeText(state.room.code).then(()=>toast('Room code copied')).catch(()=>toast(state.room.code));
  }

  function roomUrl(code){
    const url=new URL(window.location.href);
    url.searchParams.set('room',code);
    url.hash='picks';
    return url.toString();
  }

  async function shareRoom(){
    if(!state.room) return;
    const payload={title:`${state.room.name || 'UFC Picks'} — ${state.room.code}`,text:`Join my UFC picks room. Code: ${state.room.code}`,url:roomUrl(state.room.code)};
    try{
      if(navigator.share) await navigator.share(payload);
      else{ await navigator.clipboard.writeText(payload.url); toast('Room link copied'); }
    }catch(_error){}
  }

  function scrollToRoomPicks(){
    $('picksRoomPicksCard')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function openAdmin(){
    const panel=$('picksAdminPanel');
    if(!panel) return;
    panel.hidden=false;
    panel.open=true;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function switchRoom(){
    state.room=null;
    state.me=null;
    state.members=[];
    state.memberToken=null;
    state.adminToken=null;
    const url=new URL(window.location.href);
    url.searchParams.delete('room');
    history.replaceState(null,'',url.toString());
    setRoomMode('create');
    status('Start a room or join your friends.');
    render();
  }

  function renderRoom(){
    const banner=$('picksRoomBanner');
    const setup=$('picksRoomSetup');
    if(setup) setup.hidden=Boolean(state.room);
    if(!banner) return;
    if(!state.room){ banner.classList.remove('active'); banner.innerHTML=''; return; }
    const playerCount=Math.max(state.members.length,1);
    banner.classList.add('active');
    banner.innerHTML=`
      <div class="picks-room-copy">
        <span class="picks-room-live">Room active</span>
        <strong>${safe(state.room.name || 'UFC Picks')}</strong>
        <div class="picks-room-meta">
          <button id="picksCopyCode" class="picks-code" type="button">${safe(state.room.code)}</button>
          <span>${playerCount} player${playerCount===1 ? '' : 's'} joined</span>
        </div>
      </div>
      <div class="picks-room-actions">
        <button id="picksShareRoom" class="picks-primary compact" type="button">Share</button>
        <button id="picksViewRoomPicks" class="picks-secondary compact" type="button">Room Picks</button>
        ${state.adminToken ? '<button id="picksOpenAdmin" class="picks-secondary compact" type="button">Results</button>' : ''}
        <button id="picksSwitchRoom" class="picks-secondary compact" type="button">Leave</button>
      </div>`;
    $('picksShareRoom')?.addEventListener('click',shareRoom);
    $('picksCopyCode')?.addEventListener('click',copyRoomCode);
    $('picksViewRoomPicks')?.addEventListener('click',scrollToRoomPicks);
    $('picksOpenAdmin')?.addEventListener('click',openAdmin);
    $('picksSwitchRoom')?.addEventListener('click',switchRoom);
  }

  function normalizedSection(section){
    const value=String(section || '').toLowerCase();
    if(value.includes('main')) return 'Main Card';
    if(value.includes('prelim') && !value.includes('early')) return 'Prelims';
    return 'Early Prelims';
  }

  function sectionSlug(section){
    return normalizedSection(section).toLowerCase().replace(/[^a-z0-9]+/g,'-');
  }

  function renderFighterButton(fight,side,selected,locked){
    const name=side==='red' ? fight.red : fight.blue;
    const odds=oddsFor(fight,side);
    const favorite=favoriteSide(fight)===side;
    const resultClass=fight.winner ? (fight.winner===name ? ' correct' : ' wrong') : '';
    const selectedClass=selected===name ? ' selected' : '';
    const lockClass=state.underdogLockFightId===fight.id && selected===name ? ' underdog-locked' : '';
    return `<button class="pick-fighter${selectedClass}${resultClass}${lockClass}" type="button" data-fight="${safe(fight.id)}" data-pick="${safe(name)}" aria-pressed="${selected===name}" ${locked ? 'disabled' : ''}>
      ${fighterVisual(name,fight,side)}
      <span class="pick-fighter-name">${safe(name)}</span>
      ${odds!==null ? `<span class="pick-fighter-odds">${safe(formatOdds(odds))}${favorite ? ' <b>FAV</b>' : ''}</span>` : ''}
      <span class="pick-selected-mark" aria-hidden="true">✓</span>
      ${lockClass ? '<span class="pick-lock-badge">LOCK</span>' : ''}
    </button>`;
  }

  function visiblePickFor(member,fightId){
    return (member.visible_picks || []).find(pick=>pick.fight_id===fightId) || null;
  }

  function groupData(fight){
    const red=[];
    const blue=[];
    const missed=[];
    state.members.forEach(member=>{
      const pick=visiblePickFor(member,fight.id);
      const label=`${member.display_name}${pick?.is_underdog_lock ? ' ★' : ''}`;
      if(!pick) missed.push(member.display_name);
      else if(pick.fighter_name===fight.red) red.push(label);
      else if(pick.fighter_name===fight.blue) blue.push(label);
      else missed.push(member.display_name);
    });
    return {red,blue,missed};
  }

  function renderGroupReveal(fight){
    if(!isLocked(fight) || !state.room) return '';
    const data=groupData(fight);
    const side=(name,names)=>`<div class="pick-reveal-side"><strong>${safe(name)} <span>${names.length}</span></strong><small>${names.length ? names.map(safe).join(', ') : 'No picks'}</small></div>`;
    return `<div class="pick-reveal">
      <div class="pick-reveal-title">Room picks revealed</div>
      <div class="pick-reveal-grid">${side(fight.red,data.red)}${side(fight.blue,data.blue)}</div>
      ${data.missed.length ? `<div class="pick-reveal-missed">No pick: ${data.missed.map(safe).join(', ')}</div>` : ''}
    </div>`;
  }

  function renderRoomPicks(){
    const card=$('picksRoomPicksCard');
    const target=$('picksRoomPicks');
    if(!card || !target) return;
    card.hidden=!state.room;
    if(!state.room) return;
    const locked=[...(state.event?.fights || [])].filter(isLocked).sort((a,b)=>new Date(b.lockAt)-new Date(a.lockAt));
    $('picksRoomPicksCount').textContent=locked.length ? `${locked.length} revealed` : 'Waiting for first lock';
    if(!locked.length){
      target.innerHTML='<div class="picks-empty">Everyone’s picks appear here as soon as each fight locks.</div>';
      return;
    }
    target.innerHTML=locked.map(fight=>{
      const data=groupData(fight);
      const winner=fight.winner ? `Winner: ${fight.winner}` : fight.resultStatus && fight.resultStatus!=='scheduled' ? fight.resultStatus.replace('-',' ') : 'Locked';
      return `<div class="room-picks-fight">
        <div class="room-picks-head"><strong>${safe(fight.red)} vs. ${safe(fight.blue)}</strong><span>${safe(winner)}</span></div>
        <div class="room-picks-grid">
          <div><b>${safe(fight.red)} · ${data.red.length}</b><small>${data.red.length ? data.red.map(safe).join(', ') : 'No picks'}</small></div>
          <div><b>${safe(fight.blue)} · ${data.blue.length}</b><small>${data.blue.length ? data.blue.map(safe).join(', ') : 'No picks'}</small></div>
        </div>
        ${data.missed.length ? `<div class="room-picks-missed">No pick: ${data.missed.map(safe).join(', ')}</div>` : ''}
      </div>`;
    }).join('');
  }

  function renderUnderdogControl(fight,selected,locked){
    if(locked || !selected || !isUnderdogSelection(fight,selected)) return '';
    const active=state.underdogLockFightId===fight.id;
    return `<button class="pick-underdog-action${active ? ' active' : ''}" type="button" data-underdog-lock="${safe(fight.id)}">${active ? '★ Underdog Lock active · +1 if correct' : state.underdogLockFightId ? 'Move Underdog Lock here' : 'Make this my Underdog Lock'}</button>`;
  }

  function openFightStats(){
    const fights=state.event?.fights || [];
    const open=fights.filter(fight=>!isLocked(fight));
    const picked=open.filter(fight=>state.picks[fight.id]).length;
    return {open,picked,locked:fights.length-open.length};
  }

  function renderProgress(){
    const progress=$('picksProgress');
    if(!progress || !state.event) return;
    const stats=openFightStats();
    const pct=stats.open.length ? Math.round((stats.picked/stats.open.length)*100) : 100;
    const names=stats.open.map(fight=>state.picks[fight.id]).filter(Boolean);
    const visible=names.slice(0,4);
    const more=names.length-visible.length;
    const lockFight=state.event.fights.find(fight=>fight.id===state.underdogLockFightId);
    const lockName=lockFight ? state.picks[lockFight.id] : null;
    progress.innerHTML=`
      <div class="picks-progress-top"><div><strong>${stats.picked}/${stats.open.length}</strong><span>open fights picked</span></div><b>${stats.locked} locked</b></div>
      <div class="picks-progress-bar"><i style="width:${pct}%"></i></div>
      <div class="picks-progress-footer">
        <div class="picks-summary-chips">${visible.map(name=>`<span>${safe(name)}</span>`).join('')}${more>0 ? `<span>+${more} more</span>` : ''}</div>
        <div class="picks-lock-summary">${lockName ? `★ Underdog Lock: ${safe(lockName)}` : '★ Underdog Lock available'}</div>
      </div>`;
  }

  function renderFightCard(fight,nextFightId){
    const selected=state.picks[fight.id];
    const locked=isLocked(fight);
    const next=!locked && fight.id===nextFightId;
    const footer=fight.winner ? `Winner: ${safe(fight.winner)}` : locked ? (fight.resultStatus==='cancelled' ? 'Fight cancelled · no points' : 'This fight is locked.') : selected ? `Your pick: ${safe(selected)} · saved automatically` : 'Pick one winner. Saves automatically.';
    return `<article class="pick-fight section-${sectionSlug(fight.cardSection)}${normalizedSection(fight.cardSection)==='Main Card' ? ' main-card-fight' : ''}${fight.cardSection==='Main Event' ? ' featured' : ''}${next ? ' next-to-lock' : ''}" data-fight="${safe(fight.id)}">
      <div class="pick-fight-head"><div><span class="pick-fight-number">${String(fight.order || '').padStart(2,'0')}</span><strong>${safe(fight.cardSection)} · ${safe(fight.weightClass)}</strong>${next ? '<em>NEXT TO LOCK</em>' : ''}</div><span class="${locked ? 'locked' : ''}">${locked ? (fight.winner ? 'Final' : 'Locked') : `Locks ${safe(formatLock(fight.lockAt))}`}</span></div>
      <div class="pick-matchup">${renderFighterButton(fight,'red',selected,locked)}<div class="pick-vs">VS</div>${renderFighterButton(fight,'blue',selected,locked)}</div>
      <div class="pick-lock${locked ? ' locked' : ''}${selected ? ' has-pick' : ''}">${footer}</div>
      ${renderUnderdogControl(fight,selected,locked)}
      ${renderGroupReveal(fight)}
    </article>`;
  }

  function renderOpenFights(open,nextFightId){
    if(!open.length) return '<div class="picks-empty">All fights are locked. Follow room picks and results above.</div>';
    let lastSection='';
    return open.map(fight=>{
      const section=normalizedSection(fight.cardSection);
      const header=section!==lastSection ? `<div class="picks-section-heading"><span>${safe(section)}</span><b>${open.filter(item=>normalizedSection(item.cardSection)===section).length} open</b></div>` : '';
      lastSection=section;
      return header+renderFightCard(fight,nextFightId);
    }).join('');
  }

  function renderLockedFights(locked,nextFightId){
    if(!locked.length) return '';
    return `<details class="picks-locked-section"><summary><span>Locked fights</span><b>${locked.length}</b></summary><div class="picks-locked-list">${locked.map(fight=>renderFightCard(fight,nextFightId)).join('')}</div></details>`;
  }

  function renderFights(){
    const target=$('picksFightList');
    if(!target) return;
    if(!state.event){ target.innerHTML='<div class="picks-empty">Add an event to start picking.</div>'; return; }
    const sorted=[...state.event.fights].sort((a,b)=>new Date(a.lockAt)-new Date(b.lockAt) || (a.order||0)-(b.order||0));
    const open=sorted.filter(fight=>!isLocked(fight));
    const locked=sorted.filter(isLocked);
    const nextFightId=open[0]?.id || null;
    target.innerHTML=`<div class="picks-open-list">${renderOpenFights(open,nextFightId)}</div>${renderLockedFights(locked,nextFightId)}`;
    target.querySelectorAll('.pick-fighter').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.fight,button.dataset.pick)));
    target.querySelectorAll('[data-underdog-lock]').forEach(button=>button.addEventListener('click',()=>setUnderdogLock(button.dataset.underdogLock)));
    renderProgress();
  }

  function renderStandings(){
    const card=$('picksStandingsCard');
    const target=$('picksStandings');
    if(!target) return;
    if(card) card.hidden=!state.room;
    if(!state.room){ target.innerHTML=''; return; }
    const members=[...state.members].sort((a,b)=>(b.score||0)-(a.score||0) || (b.correct||0)-(a.correct||0) || (b.picks_made||0)-(a.picks_made||0) || String(a.display_name).localeCompare(String(b.display_name)));
    target.innerHTML=members.map((member,index)=>`<div class="picks-standing-row"><div class="picks-standing-rank">#${index+1}</div><div><strong>${safe(member.display_name)}${member.id===state.me?.id ? ' <span class="picks-you">You</span>' : ''}</strong><div class="meta">${member.correct||0} correct · ${member.picks_made||0} picks${member.upset_bonus ? ' · +1 lock bonus' : ''}</div></div><div class="picks-standing-score"><strong>${member.score||0}</strong><small>PTS</small></div></div>`).join('') || '<div class="picks-empty">No room members yet.</div>';
  }

  function renderAdmin(){
    const panel=$('picksAdminPanel');
    const target=$('picksAdminContent');
    if(!panel || !target) return;
    panel.hidden=!state.adminToken || !state.room;
    if(panel.hidden) return;
    const event=state.event;
    target.innerHTML=`
      <div class="picks-admin-note">Only the room creator sees this. Tap a result and the room standings update immediately.</div>
      <div class="picks-admin-fights">${[...(event?.fights || [])].sort((a,b)=>(a.order||0)-(b.order||0)).map(fight=>{
        const current=fight.winner ? `Winner: ${fight.winner}` : fight.resultStatus && fight.resultStatus!=='scheduled' ? fight.resultStatus.replace('-',' ') : 'Awaiting result';
        return `<div class="picks-admin-fight">
          <div class="picks-admin-fight-head"><strong>${String(fight.order||'').padStart(2,'0')} · ${safe(fight.red)} vs. ${safe(fight.blue)}</strong><span>${safe(current)}</span></div>
          <div class="picks-admin-actions">
            <button data-admin-fight="${safe(fight.id)}" data-admin-status="complete" data-admin-winner="${safe(fight.red)}">${safe(fight.red)}</button>
            <button data-admin-fight="${safe(fight.id)}" data-admin-status="complete" data-admin-winner="${safe(fight.blue)}">${safe(fight.blue)}</button>
            <button data-admin-fight="${safe(fight.id)}" data-admin-status="draw">Draw</button>
            <button data-admin-fight="${safe(fight.id)}" data-admin-status="no-contest">NC</button>
            <button data-admin-fight="${safe(fight.id)}" data-admin-status="cancelled">Cancel</button>
            <button data-admin-fight="${safe(fight.id)}" data-admin-status="scheduled">Reopen 15m</button>
          </div>
        </div>`;
      }).join('')}</div>
      <div class="picks-admin-event-actions">
        <button id="picksMarkEventLive" class="picks-secondary" type="button">Mark Event Live</button>
        <button id="picksCompleteEvent" class="picks-primary" type="button">Complete Event</button>
      </div>`;
    target.querySelectorAll('[data-admin-fight]').forEach(button=>button.addEventListener('click',()=>setFightResult(button)));
    $('picksMarkEventLive')?.addEventListener('click',()=>setEventStatus('live'));
    $('picksCompleteEvent')?.addEventListener('click',()=>setEventStatus('complete'));
  }

  function render(){
    renderEventSelector();
    renderHero();
    renderRoom();
    renderRoomPicks();
    renderFights();
    renderStandings();
    renderAdmin();
    setRoomMode(state.roomMode);
    const note=$('picksSetupNote');
    if(note) note.hidden=supabaseReady;
  }

  async function choose(fightId,fighter){
    const fight=state.event?.fights.find(item=>item.id===fightId);
    if(!fight || isLocked(fight) || state.saving.has(fightId)) return;
    const previous=state.picks[fightId];
    state.picks[fightId]=fighter;
    if(previous && previous!==fighter && state.underdogLockFightId===fightId) state.underdogLockFightId=null;
    saveLocalPicks();
    renderFights();
    if(!state.room || !client || !state.memberToken){ toast('Pick saved on this device'); return; }
    state.saving.add(fightId);
    const {error}=await client.rpc('picks_save_pick',{p_room_code:state.room.code,p_member_token:state.memberToken,p_fight_id:fightId,p_fighter_name:fighter});
    state.saving.delete(fightId);
    if(error){ status(error.message || 'Could not save that pick.','bad'); toast('Pick not saved'); return; }
    status('Your picks save automatically.','good');
    toast(`${fighter} selected`);
    await refreshRoom();
  }

  async function setUnderdogLock(fightId){
    const fight=state.event?.fights.find(item=>item.id===fightId);
    const fighter=state.picks[fightId];
    if(!fight || isLocked(fight) || !isUnderdogSelection(fight,fighter)) return;
    state.underdogLockFightId=fightId;
    saveLocalPicks();
    renderFights();
    if(!state.room || !client || !state.memberToken){ toast('Underdog Lock saved on this device'); return; }
    const {error}=await client.rpc('picks_set_underdog_lock',{p_room_code:state.room.code,p_member_token:state.memberToken,p_fight_id:fightId,p_fighter_name:fighter});
    if(error){ status(error.message || 'Could not save the Underdog Lock.','bad'); toast('Lock not saved'); return; }
    status('Underdog Lock saved. It is worth +1 if correct.','good');
    toast(`${fighter} is your Underdog Lock`);
    await refreshRoom();
  }

  async function createRoom(){
    const displayName=$('picksDisplayName')?.value.trim();
    if(!displayName){ status('Enter your name first.','bad'); return; }
    status('Starting your room…');
    const roomName=`${displayName}'s ${state.event?.name || 'UFC'} Picks`;
    const {data,error}=await client.rpc('picks_create_room',{p_event_id:state.event.id,p_display_name:displayName,p_room_name:roomName});
    if(error){ status(error.message || 'Could not create room.','bad'); return; }
    state.room=data.room;
    state.me=data.member;
    state.memberToken=data.member_token;
    state.adminToken=data.admin_token || null;
    localStorage.setItem('ufc-picks:display-name',displayName);
    localStorage.setItem(roomStorageKey(state.room.code,'room'),state.memberToken);
    if(state.adminToken) localStorage.setItem(roomStorageKey(state.room.code,'admin'),state.adminToken);
    history.replaceState(null,'',roomUrl(state.room.code));
    status('Room ready. Tap Share and send the link.','good');
    await refreshRoom();
    $('picksRoomBanner')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  async function joinRoom(){
    const displayName=$('picksDisplayName')?.value.trim();
    const code=$('picksRoomCode')?.value.trim().toUpperCase();
    if(!displayName || !code){ status('Enter your name and the room code.','bad'); return; }
    status('Joining room…');
    const {data,error}=await client.rpc('picks_join_room',{p_room_code:code,p_display_name:displayName});
    if(error){ status(error.message || 'Could not join room.','bad'); return; }
    state.room=data.room;
    state.me=data.member;
    state.memberToken=data.member_token;
    state.adminToken=null;
    localStorage.setItem('ufc-picks:display-name',displayName);
    localStorage.setItem(roomStorageKey(state.room.code,'room'),state.memberToken);
    history.replaceState(null,'',roomUrl(state.room.code));
    status('You are in. Tap your winners.','good');
    await refreshRoom();
  }

  async function handleRoomAction(){
    if(!client || !state.event){ status('Picks are not connected yet.','bad'); return; }
    if(state.roomMode==='join') await joinRoom();
    else await createRoom();
  }

  async function setFightResult(button){
    if(!client || !state.room || !state.adminToken) return;
    const statusValue=button.dataset.adminStatus;
    const winner=button.dataset.adminWinner || null;
    const original=button.textContent;
    button.disabled=true;
    button.textContent='Saving…';
    const {error}=await client.rpc('picks_admin_set_fight_result',{
      p_room_code:state.room.code,
      p_admin_token:state.adminToken,
      p_fight_id:button.dataset.adminFight,
      p_result_status:statusValue,
      p_winner_name:winner,
      p_reopen_minutes:15
    });
    button.disabled=false;
    button.textContent=original;
    if(error){ toast(error.message || 'Result not saved'); return; }
    toast(statusValue==='complete' ? `${winner} posted as winner` : 'Fight status updated');
    await loadBackendEvents(true);
    await refreshRoom();
    const panel=$('picksAdminPanel');
    if(panel){ panel.hidden=false; panel.open=true; }
  }

  async function setEventStatus(nextStatus){
    if(!client || !state.room || !state.adminToken) return;
    const {error}=await client.rpc('picks_admin_set_event_status',{p_room_code:state.room.code,p_admin_token:state.adminToken,p_event_status:nextStatus});
    if(error){ toast(error.message || 'Event status not saved'); return; }
    toast(nextStatus==='complete' ? 'Event completed' : 'Event marked live');
    await loadBackendEvents(true);
    await refreshRoom();
  }

  async function refreshRoom(){
    if(!client || !state.room || !state.memberToken) return;
    const {data,error}=await client.rpc('picks_room_snapshot',{p_room_code:state.room.code,p_member_token:state.memberToken});
    if(error){ status(error.message || 'Could not refresh room.','bad'); return; }
    state.room=data.room;
    const roomEvent=state.events.find(event=>event.id===state.room.event_id);
    if(roomEvent) state.event=roomEvent;
    state.me=data.me;
    state.members=data.members || [];
    if(data.my_picks){
      state.picks=Object.fromEntries(data.my_picks.map(pick=>[pick.fight_id,pick.fighter_name]));
      state.underdogLockFightId=data.my_picks.find(pick=>pick.is_underdog_lock)?.fight_id || null;
      saveLocalPicks();
    }
    render();
  }

  async function loadBackendEvents(preserveEvent=false){
    if(!client) return;
    const {data,error}=await client.rpc('picks_public_events');
    if(error || !Array.isArray(data) || !data.length) return;
    const current=state.event?.id;
    state.events=data;
    state.event=preferredEvent(state.events,current);
    if(!preserveEvent) loadLocalPicks();
  }

  async function resumeRoomFromUrl(){
    if(!client) return;
    const code=new URL(window.location.href).searchParams.get('room')?.trim().toUpperCase();
    if(!code) return;
    if($('picksRoomCode')) $('picksRoomCode').value=code;
    const token=localStorage.getItem(roomStorageKey(code,'room'));
    const adminToken=localStorage.getItem(roomStorageKey(code,'admin'));
    if(!token){
      setRoomMode('join');
      status(`Enter your name to join room ${code}.`);
      return;
    }
    state.room={code};
    state.memberToken=token;
    state.adminToken=adminToken;
    await refreshRoom();
  }

  function bind(){
    $('picksEventSelect')?.addEventListener('change',event=>{
      state.event=state.events.find(item=>item.id===event.target.value) || state.events[0] || null;
      state.room=null;
      state.me=null;
      state.members=[];
      state.memberToken=null;
      state.adminToken=null;
      loadLocalPicks();
      render();
    });
    $('picksCreateMode')?.addEventListener('click',()=>setRoomMode('create'));
    $('picksJoinMode')?.addEventListener('click',()=>setRoomMode('join'));
    $('picksRoomAction')?.addEventListener('click',handleRoomAction);
  }

  async function init(){
    if(!$('picks')) return;
    const roomCode=new URL(window.location.href).searchParams.get('room');
    if(window.location.hash==='#picks' || roomCode) document.querySelector('.tab[data-view="picks"]')?.click();
    const savedName=localStorage.getItem('ufc-picks:display-name');
    if(savedName && $('picksDisplayName')) $('picksDisplayName').value=savedName;
    if(roomCode){
      setRoomMode('join');
      if($('picksRoomCode')) $('picksRoomCode').value=roomCode.toUpperCase();
    }
    loadLocalPicks();
    bind();
    render();
    await loadBackendEvents();
    render();
    await resumeRoomFromUrl();
    setInterval(async()=>{
      if(state.room){ await loadBackendEvents(true); await refreshRoom(); }
      else renderFights();
    },30000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
