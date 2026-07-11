(function(){
  'use strict';

  const eventsFallback = Array.isArray(window.UFC_PICKS_EVENTS) ? window.UFC_PICKS_EVENTS : [];
  const config = window.UFC_SUPABASE_CONFIG || {};
  const supabaseReady = Boolean(config.url && config.anonKey && window.supabase?.createClient);
  const client = supabaseReady ? window.supabase.createClient(config.url, config.anonKey) : null;
  const roomParam = new URL(window.location.href).searchParams.get('room')?.trim().toUpperCase() || '';
  const state = {
    events: eventsFallback,
    event: eventsFallback[0] || null,
    room: null,
    me: null,
    members: [],
    picks: {},
    underdogLockFightId: null,
    memberToken: null,
    adminToken: null,
    setupMode: roomParam ? 'join' : 'create',
    saving: new Set()
  };

  const $ = id => document.getElementById(id);
  const storageKey = suffix => `ufc-picks:${state.event?.id || 'none'}:${suffix}`;
  const safe = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

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
    const n = Number(value);
    if(!Number.isFinite(n) || n === 0) return '';
    return n > 0 ? `+${n}` : String(n);
  }

  function eventKicker(event){
    if(event.status === 'complete') return 'Completed UFC event';
    if(event.status === 'live') return 'Live UFC event';
    const eventDay = new Date(event.eventDate);
    if(eventDay.toDateString() === new Date().toDateString()) return 'Tonight';
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

  function oddsFor(fight,side){
    const value = side === 'red' ? fight.redOdds : fight.blueOdds;
    return Number.isFinite(Number(value)) ? Number(value) : null;
  }

  function impliedProbability(americanOdds){
    const odds = Number(americanOdds);
    if(!Number.isFinite(odds) || odds === 0) return 0;
    return odds < 0 ? (-odds)/((-odds)+100) : 100/(odds+100);
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
    node.textContent = message;
    node.classList.add('show');
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(()=>node.classList.remove('show'),1700);
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
    state.underdogLockFightId = localStorage.getItem(storageKey('underdog-lock')) || null;
  }

  function saveLocalPicks(){
    localStorage.setItem(storageKey('local-picks'),JSON.stringify(state.picks));
    if(state.underdogLockFightId) localStorage.setItem(storageKey('underdog-lock'),state.underdogLockFightId);
    else localStorage.removeItem(storageKey('underdog-lock'));
  }

  function preferredEvent(events,currentId){
    return events.find(event=>event.id===currentId)
      || events.find(event=>event.status==='live')
      || events.find(event=>event.status==='upcoming')
      || events[0]
      || null;
  }

  function renderSetupMode(){
    const create = state.setupMode === 'create';
    $('picksModeCreate')?.classList.toggle('active',create);
    $('picksModeJoin')?.classList.toggle('active',!create);
    if($('picksRoomNameWrap')) $('picksRoomNameWrap').hidden = !create;
    if($('picksRoomCodeWrap')) $('picksRoomCodeWrap').hidden = create;
    if($('picksRoomSubmit')) $('picksRoomSubmit').textContent = create ? 'Create room' : 'Join room';
  }

  function setSetupMode(mode){
    state.setupMode = mode === 'join' ? 'join' : 'create';
    renderSetupMode();
    if(state.setupMode === 'join') $('picksRoomCode')?.focus();
  }

  function renderEventSelector(){
    const select = $('picksEventSelect');
    const wrap = $('picksEventPicker');
    if(!select) return;
    select.innerHTML = state.events.map(event => `<option value="${safe(event.id)}">${safe(event.name)}${event.subtitle ? `: ${safe(event.subtitle)}` : ''}</option>`).join('');
    if(state.event) select.value = state.event.id;
    if(wrap) wrap.hidden = state.events.length <= 1;
  }

  function eventOddsMeta(event){
    const fight = event?.fights?.find(item=>item.oddsSource || item.oddsUpdatedAt);
    if(!fight) return null;
    const parts = [];
    if(fight.oddsSource) parts.push(fight.oddsSource);
    if(fight.oddsUpdatedAt){
      const updated = new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(fight.oddsUpdatedAt));
      parts.push(`updated ${updated}`);
    }
    return parts.join(' · ');
  }

  function renderHero(){
    const event = state.event;
    const target = $('picksEventHero');
    if(!target) return;
    if(!event){ target.innerHTML = '<div class="picks-empty">No upcoming UFC event has been loaded.</div>'; return; }
    const live = event.status === 'live';
    const oddsMeta = eventOddsMeta(event);
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
      </div>
      ${oddsMeta ? `<div class="picks-odds-source">Odds snapshot: ${safe(oddsMeta)} · for context only</div>` : ''}`;
  }

  function roomUrl(code){
    const url = new URL(window.location.href);
    url.searchParams.set('room',code);
    url.hash = 'picks';
    return url.toString();
  }

  function copyRoomCode(){
    if(!state.room) return;
    navigator.clipboard?.writeText(state.room.code).then(()=>toast('Room code copied')).catch(()=>toast(state.room.code));
  }

  async function shareRoom(){
    if(!state.room) return;
    const payload = {title:`${state.room.name || 'UFC Picks'} — ${state.room.code}`,text:`Join my UFC picks room. Your room code is ${state.room.code}.`,url:roomUrl(state.room.code)};
    try{
      if(navigator.share) await navigator.share(payload);
      else{ await navigator.clipboard.writeText(payload.url); toast('Room link copied'); }
    }catch(_error){}
  }

  function switchRoom(){
    state.room = null;
    state.me = null;
    state.members = [];
    state.memberToken = null;
    state.adminToken = null;
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    history.replaceState(null,'',url.toString());
    setSetupMode('create');
    status('Start a new room or join your friends.');
    render();
  }

  function renderRoom(){
    const banner = $('picksRoomBanner');
    const setup = $('picksRoomSetup');
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
        <span class="picks-room-live">You are in</span>
        <strong>${safe(state.room.name || 'UFC Picks')}</strong>
        <div class="picks-room-meta">
          <button id="picksCopyCode" class="picks-code" type="button" aria-label="Copy room code">${safe(state.room.code)}</button>
          <span>${playerCount} player${playerCount === 1 ? '' : 's'} joined</span>
        </div>
      </div>
      <div class="picks-room-actions">
        <button id="picksViewLive" class="picks-secondary compact" type="button">Live Picks</button>
        <button id="picksShareRoom" class="picks-primary compact" type="button">Share</button>
        <button id="picksSwitchRoom" class="picks-secondary compact" type="button">Leave</button>
      </div>`;
    $('picksShareRoom')?.addEventListener('click',shareRoom);
    $('picksCopyCode')?.addEventListener('click',copyRoomCode);
    $('picksSwitchRoom')?.addEventListener('click',switchRoom);
    $('picksViewLive')?.addEventListener('click',()=>$('picksLiveBoardCard')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  function normalizedSection(section){
    const value = String(section || '').toLowerCase();
    if(value.includes('main')) return 'Main Card';
    if(value.includes('prelim') && !value.includes('early')) return 'Prelims';
    return 'Early Prelims';
  }

  function sectionSlug(section){
    return normalizedSection(section).toLowerCase().replace(/[^a-z0-9]+/g,'-');
  }

  function resultLabel(fight){
    if(fight.resultStatus === 'complete' && fight.winner) return `${fight.winner} won`;
    if(fight.resultStatus === 'draw') return 'Draw';
    if(fight.resultStatus === 'no-contest') return 'No contest';
    if(fight.resultStatus === 'cancelled') return 'Cancelled';
    return isLocked(fight) ? 'Locked' : `Locks ${formatLock(fight.lockAt)}`;
  }

  function renderFighterButton(fight,side,selected,locked){
    const name = side === 'red' ? fight.red : fight.blue;
    const odds = oddsFor(fight,side);
    const favorite = favoriteSide(fight) === side;
    const resultClass = fight.winner ? (fight.winner === name ? ' correct' : ' wrong') : '';
    const selectedClass = selected === name ? ' selected' : '';
    const lockClass = state.underdogLockFightId === fight.id && selected === name ? ' underdog-locked' : '';
    return `<button class="pick-fighter${selectedClass}${resultClass}${lockClass}" type="button"
      data-fight="${safe(fight.id)}" data-pick="${safe(name)}" aria-pressed="${selected === name ? 'true' : 'false'}" ${locked ? 'disabled' : ''}>
      ${fighterVisual(name,fight,side)}
      <span class="pick-fighter-name">${safe(name)}</span>
      ${odds !== null ? `<span class="pick-fighter-odds">${safe(formatOdds(odds))}${favorite ? ' <b>FAV</b>' : ''}</span>` : ''}
      <span class="pick-selected-mark" aria-hidden="true">✓</span>
      ${lockClass ? '<span class="pick-lock-badge">LOCK</span>' : ''}
    </button>`;
  }

  function visiblePickFor(member,fightId){
    return (member.visible_picks || []).find(pick=>pick.fight_id===fightId) || null;
  }

  function groupPicksForFight(fight){
    const red = [];
    const blue = [];
    const missed = [];
    state.members.forEach(member=>{
      const pick = visiblePickFor(member,fight.id);
      const label = `${member.display_name}${pick?.is_underdog_lock ? ' ★' : ''}`;
      if(!pick) missed.push(member.display_name);
      else if(pick.fighter_name === fight.red) red.push(label);
      else if(pick.fighter_name === fight.blue) blue.push(label);
      else missed.push(member.display_name);
    });
    return {red,blue,missed};
  }

  function renderGroupReveal(fight){
    if(!isLocked(fight) || !state.room) return '';
    const picks = groupPicksForFight(fight);
    const group = (name,names)=>`<div class="pick-reveal-side"><strong>${safe(name)} <span>${names.length}</span></strong><small>${names.length ? names.map(safe).join(', ') : 'No picks'}</small></div>`;
    return `<div class="pick-reveal">
      <div class="pick-reveal-title">Everyone's picks</div>
      <div class="pick-reveal-grid">${group(fight.red,picks.red)}${group(fight.blue,picks.blue)}</div>
      ${picks.missed.length ? `<div class="pick-reveal-missed">No pick: ${picks.missed.map(safe).join(', ')}</div>` : ''}
    </div>`;
  }

  function renderUnderdogControl(fight,selected,locked){
    if(locked || !selected || !isUnderdogSelection(fight,selected)) return '';
    const active = state.underdogLockFightId === fight.id;
    return `<button class="pick-underdog-action${active ? ' active' : ''}" type="button" data-underdog-lock="${safe(fight.id)}">
      ${active ? '★ Underdog Lock active · +1 if correct' : state.underdogLockFightId ? 'Move Underdog Lock here' : 'Make this my Underdog Lock'}
    </button>`;
  }

  function openFightStats(){
    const event = state.event;
    const open = event?.fights.filter(fight=>!isLocked(fight)) || [];
    const picked = open.filter(fight=>state.picks[fight.id]).length;
    return {open,picked,locked:(event?.fights.length || 0)-open.length};
  }

  function renderProgress(){
    const progress = $('picksProgress');
    const event = state.event;
    if(!progress || !event) return;
    const stats = openFightStats();
    const pct = stats.open.length ? Math.round((stats.picked/stats.open.length)*100) : 100;
    const selectedNames = stats.open.map(fight=>state.picks[fight.id]).filter(Boolean);
    const visibleNames = selectedNames.slice(0,4);
    const more = selectedNames.length-visibleNames.length;
    const lockFight = event.fights.find(fight=>fight.id===state.underdogLockFightId);
    const lockName = lockFight ? state.picks[lockFight.id] : null;
    progress.innerHTML = `
      <div class="picks-progress-top">
        <div><strong>${stats.picked}/${stats.open.length}</strong><span>open fights picked</span></div>
        <b>${stats.locked} locked</b>
      </div>
      <div class="picks-progress-bar"><i style="width:${pct}%"></i></div>
      <div class="picks-progress-footer">
        <div class="picks-summary-chips">${visibleNames.map(name=>`<span>${safe(name)}</span>`).join('')}${more>0?`<span>+${more} more</span>`:''}</div>
        <div class="picks-lock-summary">${lockName ? `★ Underdog Lock: ${safe(lockName)}` : '★ Underdog Lock available'}</div>
      </div>`;
  }

  function renderFightCard(fight,nextFightId){
    const selected = state.picks[fight.id];
    const locked = isLocked(fight);
    const next = !locked && fight.id === nextFightId;
    const sectionClass = sectionSlug(fight.cardSection);
    const footer = fight.resultStatus === 'complete' && fight.winner
      ? `Winner: ${safe(fight.winner)}`
      : fight.resultStatus === 'draw' ? 'Draw · no points awarded'
      : fight.resultStatus === 'no-contest' ? 'No contest · no points awarded'
      : fight.resultStatus === 'cancelled' ? 'Cancelled · no points awarded'
      : locked ? 'Picks are locked. Everyone’s choices are now visible.'
      : selected ? `Your pick: ${safe(selected)} · saved automatically`
      : 'Pick one winner. Saves automatically.';
    return `<article class="pick-fight section-${sectionClass}${normalizedSection(fight.cardSection) === 'Main Card' ? ' main-card-fight' : ''}${fight.cardSection === 'Main Event' ? ' featured' : ''}${next ? ' next-to-lock' : ''}" data-fight="${safe(fight.id)}">
      <div class="pick-fight-head">
        <div><span class="pick-fight-number">${String(fight.order || '').padStart(2,'0')}</span><strong>${safe(fight.cardSection)} · ${safe(fight.weightClass)}</strong>${next ? '<em>NEXT TO LOCK</em>' : ''}</div>
        <span class="${locked ? 'locked' : ''}">${safe(resultLabel(fight))}</span>
      </div>
      <div class="pick-matchup">
        ${renderFighterButton(fight,'red',selected,locked)}
        <div class="pick-vs">VS</div>
        ${renderFighterButton(fight,'blue',selected,locked)}
      </div>
      <div class="pick-lock${locked ? ' locked' : ''}${selected ? ' has-pick' : ''}">${footer}</div>
      ${renderUnderdogControl(fight,selected,locked)}
      ${renderGroupReveal(fight)}
    </article>`;
  }

  function renderOpenFights(open,nextFightId){
    if(!open.length) return '<div class="picks-empty">All fights are locked. Follow everyone’s picks and results in Live Picks above.</div>';
    let lastSection = '';
    return open.map(fight=>{
      const section = normalizedSection(fight.cardSection);
      const header = section !== lastSection ? `<div class="picks-section-heading"><span>${safe(section)}</span><b>${open.filter(item=>normalizedSection(item.cardSection)===section).length} open</b></div>` : '';
      lastSection = section;
      return header + renderFightCard(fight,nextFightId);
    }).join('');
  }

  function renderLockedFights(locked,nextFightId){
    if(!locked.length) return '';
    return `<details id="picksLockedDetails" class="picks-locked-section">
      <summary><span>Locked fights</span><b>${locked.length}</b></summary>
      <div class="picks-locked-list">${locked.map(fight=>renderFightCard(fight,nextFightId)).join('')}</div>
    </details>`;
  }

  function renderFights(){
    const target = $('picksFightList');
    const event = state.event;
    if(!target) return;
    if(!event){ target.innerHTML='<div class="picks-empty">Add an event to start picking.</div>'; return; }
    const sorted = [...event.fights].sort((a,b)=>new Date(a.lockAt)-new Date(b.lockAt) || (a.order||0)-(b.order||0));
    const open = sorted.filter(fight=>!isLocked(fight));
    const locked = sorted.filter(isLocked);
    const nextFightId = open[0]?.id || null;
    target.innerHTML = `<div class="picks-open-list">${renderOpenFights(open,nextFightId)}</div>${renderLockedFights(locked,nextFightId)}`;
    target.querySelectorAll('.pick-fighter').forEach(button => button.addEventListener('click',()=>choose(button.dataset.fight,button.dataset.pick)));
    target.querySelectorAll('[data-underdog-lock]').forEach(button=>button.addEventListener('click',()=>setUnderdogLock(button.dataset.underdogLock)));
    renderProgress();
  }

  function renderLiveBoard(){
    const card = $('picksLiveBoardCard');
    const target = $('picksLiveBoard');
    if(!card || !target) return;
    card.hidden = !state.room;
    if(!state.room) return;
    const locked = [...(state.event?.fights || [])].filter(isLocked).sort((a,b)=>new Date(b.lockAt)-new Date(a.lockAt));
    if(!locked.length){
      target.innerHTML = '<div class="picks-live-empty"><strong>No picks revealed yet</strong><span>Everyone’s exact choices appear here as soon as each fight locks.</span></div>';
      return;
    }
    target.innerHTML = locked.map(fight=>{
      const picks = groupPicksForFight(fight);
      const winner = fight.resultStatus === 'complete' && fight.winner ? `<b>${safe(fight.winner)} won</b>` : `<b>${safe(resultLabel(fight))}</b>`;
      return `<article class="picks-live-row">
        <div class="picks-live-head"><div><span>${String(fight.order || '').padStart(2,'0')}</span><strong>${safe(fight.red)} vs. ${safe(fight.blue)}</strong></div>${winner}</div>
        <div class="picks-live-sides">
          <div class="${fight.winner === fight.red ? 'winner' : ''}"><strong>${safe(fight.red)} <span>${picks.red.length}</span></strong><small>${picks.red.length ? picks.red.map(safe).join(', ') : 'No picks'}</small></div>
          <div class="${fight.winner === fight.blue ? 'winner' : ''}"><strong>${safe(fight.blue)} <span>${picks.blue.length}</span></strong><small>${picks.blue.length ? picks.blue.map(safe).join(', ') : 'No picks'}</small></div>
        </div>
        ${picks.missed.length ? `<div class="picks-live-missed">No pick: ${picks.missed.map(safe).join(', ')}</div>` : ''}
      </article>`;
    }).join('');
  }

  function renderStandings(){
    const target = $('picksStandings');
    const card = $('picksStandingsCard');
    if(!target) return;
    if(card) card.hidden = !state.room;
    if(!state.room){
      target.innerHTML='<div class="picks-empty">Join a room to see standings.</div>';
      return;
    }
    const members = [...state.members].sort((a,b)=>(b.score||0)-(a.score||0) || (b.correct||0)-(a.correct||0) || (b.picks_made||0)-(a.picks_made||0) || String(a.display_name).localeCompare(String(b.display_name)));
    target.innerHTML = members.map((member,index)=>`
      <div class="picks-standing-row">
        <div class="picks-standing-rank">#${index+1}</div>
        <div><strong>${safe(member.display_name)}${member.id === state.me?.id ? ' <span class="picks-you">You</span>' : ''}</strong><div class="meta">${member.correct || 0} correct · ${member.picks_made || 0} picks${member.upset_bonus ? ' · +1 lock bonus' : ''}</div></div>
        <div class="picks-standing-score"><strong>${member.score || 0}</strong><small>PTS</small></div>
      </div>`).join('') || '<div class="picks-empty">No room members yet.</div>';
  }

  function adminChoiceValue(fight){
    if(fight.resultStatus === 'complete' && fight.winner === fight.red) return 'red';
    if(fight.resultStatus === 'complete' && fight.winner === fight.blue) return 'blue';
    if(['draw','no-contest','cancelled'].includes(fight.resultStatus)) return fight.resultStatus;
    return 'scheduled';
  }

  function renderAdmin(){
    const card = $('picksAdminCard');
    const target = $('picksAdminPanel');
    if(!card || !target) return;
    const isOwner = Boolean(state.room && state.adminToken);
    card.hidden = !isOwner;
    if(!isOwner) return;
    const fights = [...(state.event?.fights || [])].sort((a,b)=>(a.order||0)-(b.order||0));
    target.innerHTML = `
      <div class="picks-admin-note">Only the device that created this room can see these controls.</div>
      <div class="picks-admin-event-actions">
        <span>Event status: <strong>${safe(state.event?.status || 'upcoming')}</strong></span>
        <button type="button" data-admin-event="live">Set live</button>
        <button type="button" data-admin-event="complete">Complete event</button>
      </div>
      <div class="picks-admin-fights">${fights.map(fight=>`
        <div class="picks-admin-row">
          <div><span>${String(fight.order || '').padStart(2,'0')}</span><strong>${safe(fight.red)} vs. ${safe(fight.blue)}</strong><small>${safe(resultLabel(fight))}</small></div>
          <select data-admin-fight="${safe(fight.id)}">
            <option value="scheduled" ${adminChoiceValue(fight)==='scheduled'?'selected':''}>Clear result</option>
            <option value="red" ${adminChoiceValue(fight)==='red'?'selected':''}>${safe(fight.red)} won</option>
            <option value="blue" ${adminChoiceValue(fight)==='blue'?'selected':''}>${safe(fight.blue)} won</option>
            <option value="draw" ${adminChoiceValue(fight)==='draw'?'selected':''}>Draw</option>
            <option value="no-contest" ${adminChoiceValue(fight)==='no-contest'?'selected':''}>No contest</option>
            <option value="cancelled" ${adminChoiceValue(fight)==='cancelled'?'selected':''}>Cancelled</option>
          </select>
          <button type="button" data-admin-save="${safe(fight.id)}">Save</button>
        </div>`).join('')}</div>`;
    target.querySelectorAll('[data-admin-save]').forEach(button=>button.addEventListener('click',()=>saveAdminFight(button.dataset.adminSave)));
    target.querySelectorAll('[data-admin-event]').forEach(button=>button.addEventListener('click',()=>saveAdminEvent(button.dataset.adminEvent)));
  }

  function render(){
    renderSetupMode();
    renderEventSelector();
    renderHero();
    renderRoom();
    renderFights();
    renderLiveBoard();
    renderStandings();
    renderAdmin();
    const note = $('picksSetupNote');
    if(note) note.hidden = supabaseReady;
  }

  async function choose(fightId,fighter){
    const fight = state.event?.fights.find(item=>item.id===fightId);
    if(!fight || isLocked(fight) || state.saving.has(fightId)) return;
    const previous = state.picks[fightId];
    state.picks[fightId] = fighter;
    if(previous && previous !== fighter && state.underdogLockFightId === fightId) state.underdogLockFightId = null;
    saveLocalPicks();
    renderFights();
    if(!state.room || !client || !state.memberToken){ toast('Pick saved on this device'); return; }
    state.saving.add(fightId);
    const {error} = await client.rpc('picks_save_pick',{p_room_code:state.room.code,p_member_token:state.memberToken,p_fight_id:fightId,p_fighter_name:fighter});
    state.saving.delete(fightId);
    if(error){ status(error.message || 'Could not save that pick.','bad'); toast('Pick not saved'); return; }
    toast(`${fighter} selected`);
    await refreshRoom();
  }

  async function setUnderdogLock(fightId){
    const fight = state.event?.fights.find(item=>item.id===fightId);
    const fighter = state.picks[fightId];
    if(!fight || isLocked(fight) || !isUnderdogSelection(fight,fighter)) return;
    state.underdogLockFightId = fightId;
    saveLocalPicks();
    renderFights();
    if(!state.room || !client || !state.memberToken){ toast('Underdog Lock saved on this device'); return; }
    const {error} = await client.rpc('picks_set_underdog_lock',{p_room_code:state.room.code,p_member_token:state.memberToken,p_fight_id:fightId,p_fighter_name:fighter});
    if(error){ status(error.message || 'Could not save the Underdog Lock.','bad'); toast('Lock not saved'); return; }
    toast(`${fighter} is your Underdog Lock`);
    await refreshRoom();
  }

  async function submitRoom(){
    if(state.setupMode === 'join') await joinRoom();
    else await createRoom();
  }

  async function createRoom(){
    const displayName = $('picksDisplayName')?.value.trim();
    const roomName = $('picksRoomName')?.value.trim() || `${displayName || 'My'}'s UFC Picks`;
    if(!displayName){ status('Enter your display name first.','bad'); return; }
    status('Creating your room…');
    const {data,error} = await client.rpc('picks_create_room',{p_event_id:state.event.id,p_display_name:displayName,p_room_name:roomName});
    if(error){ status(error.message || 'Could not create room.','bad'); return; }
    state.room = data.room;
    state.me = data.member;
    state.memberToken = data.member_token;
    state.adminToken = data.admin_token || null;
    localStorage.setItem('ufc-picks:display-name',displayName);
    localStorage.setItem(`ufc-picks:room:${state.room.code}`,state.memberToken);
    if(state.adminToken) localStorage.setItem(`ufc-picks:admin:${state.room.code}`,state.adminToken);
    history.replaceState(null,'',roomUrl(state.room.code));
    await refreshRoom();
    toast('Room created — share it with your friends');
    $('picksRoomBanner')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  async function joinRoom(){
    const displayName = $('picksDisplayName')?.value.trim();
    const code = $('picksRoomCode')?.value.trim().toUpperCase();
    if(!displayName){ status('Enter your display name first.','bad'); return; }
    if(!code){ status('Enter the six-character room code.','bad'); return; }
    status('Joining room…');
    const {data,error} = await client.rpc('picks_join_room',{p_room_code:code,p_display_name:displayName});
    if(error){ status(error.message || 'Could not join room.','bad'); return; }
    state.room = data.room;
    state.me = data.member;
    state.memberToken = data.member_token;
    state.adminToken = localStorage.getItem(`ufc-picks:admin:${state.room.code}`) || null;
    localStorage.setItem('ufc-picks:display-name',displayName);
    localStorage.setItem(`ufc-picks:room:${state.room.code}`,state.memberToken);
    history.replaceState(null,'',roomUrl(state.room.code));
    await refreshRoom();
    toast('You are in — make your picks');
  }

  async function saveAdminFight(fightId){
    if(!client || !state.room || !state.adminToken) return;
    const fight = state.event?.fights.find(item=>item.id===fightId);
    const select = document.querySelector(`[data-admin-fight="${CSS.escape(fightId)}"]`);
    const choice = select?.value || 'scheduled';
    let resultStatus = choice;
    let winnerName = null;
    if(choice === 'red'){ resultStatus='complete'; winnerName=fight.red; }
    if(choice === 'blue'){ resultStatus='complete'; winnerName=fight.blue; }
    toast('Saving result…');
    const {error} = await client.rpc('picks_admin_set_fight_result',{
      p_room_code:state.room.code,
      p_admin_token:state.adminToken,
      p_fight_id:fightId,
      p_result_status:resultStatus,
      p_winner_name:winnerName
    });
    if(error){ toast(error.message || 'Result not saved'); return; }
    await loadBackendEvents();
    await refreshRoom();
    toast('Result posted');
  }

  async function saveAdminEvent(eventStatus){
    if(!client || !state.room || !state.adminToken) return;
    const {error} = await client.rpc('picks_admin_set_event_status',{
      p_room_code:state.room.code,
      p_admin_token:state.adminToken,
      p_event_status:eventStatus
    });
    if(error){ toast(error.message || 'Event status not saved'); return; }
    await loadBackendEvents();
    await refreshRoom();
    toast(eventStatus === 'complete' ? 'Event completed' : 'Event set live');
  }

  async function refreshRoom(){
    if(!client || !state.room || !state.memberToken) return;
    const {data,error} = await client.rpc('picks_room_snapshot',{p_room_code:state.room.code,p_member_token:state.memberToken});
    if(error){ status(error.message || 'Could not refresh room.','bad'); return; }
    state.room = data.room;
    state.adminToken = state.adminToken || localStorage.getItem(`ufc-picks:admin:${state.room.code}`) || null;
    const roomEvent = state.events.find(event=>event.id===state.room.event_id);
    if(roomEvent){
      if(roomEvent.id !== state.event?.id){ state.event=roomEvent; loadLocalPicks(); }
      else state.event=roomEvent;
    }
    state.me = data.me;
    state.members = data.members || [];
    if(data.my_picks){
      state.picks = Object.fromEntries(data.my_picks.map(pick=>[pick.fight_id,pick.fighter_name]));
      state.underdogLockFightId = data.my_picks.find(pick=>pick.is_underdog_lock)?.fight_id || null;
      saveLocalPicks();
    }
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
    if(!client || !roomParam) return;
    if($('picksRoomCode')) $('picksRoomCode').value=roomParam;
    setSetupMode('join');
    const token = localStorage.getItem(`ufc-picks:room:${roomParam}`);
    if(!token){ status(`Enter your name and tap Join room. The code is already filled in.`); return; }
    state.room = {code:roomParam};
    state.memberToken = token;
    state.adminToken = localStorage.getItem(`ufc-picks:admin:${roomParam}`) || null;
    await refreshRoom();
  }

  function bind(){
    $('picksEventSelect')?.addEventListener('change',event=>{
      state.event = state.events.find(item=>item.id===event.target.value) || state.events[0] || null;
      state.room=null;
      state.me=null;
      state.members=[];
      state.memberToken=null;
      state.adminToken=null;
      loadLocalPicks();
      render();
    });
    $('picksModeCreate')?.addEventListener('click',()=>setSetupMode('create'));
    $('picksModeJoin')?.addEventListener('click',()=>setSetupMode('join'));
    $('picksRoomSubmit')?.addEventListener('click',submitRoom);
    $('picksRoomCode')?.addEventListener('input',event=>{ event.target.value=event.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6); });
  }

  async function init(){
    if(!$('picks')) return;
    if(window.location.hash === '#picks' || roomParam){ document.querySelector('.tab[data-view="picks"]')?.click(); }
    const savedName = localStorage.getItem('ufc-picks:display-name');
    if(savedName && $('picksDisplayName')) $('picksDisplayName').value=savedName;
    if(roomParam && $('picksRoomCode')) $('picksRoomCode').value=roomParam;
    loadLocalPicks();
    bind();
    render();
    await loadBackendEvents();
    render();
    await resumeRoomFromUrl();
    window.setInterval(()=>{ if(state.room) refreshRoom(); else renderFights(); },20000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();