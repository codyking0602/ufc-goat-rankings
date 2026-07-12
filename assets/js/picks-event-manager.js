(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  const state={groupCode:'',adminToken:'',events:[],selectedId:'',editingFightId:'',creating:false,loading:false};

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    window.clearTimeout(toast.timer);
    toast.timer=window.setTimeout(()=>node.classList.remove('show'),1800);
  }

  function resolveOwner(){
    const urlCode=normalize(new URL(window.location.href).searchParams.get('group'));
    if(urlCode){
      const token=localStorage.getItem(`${GROUP_ADMIN_PREFIX}${urlCode}`);
      if(token) return {code:urlCode,token};
    }

    const matches=[];
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index) || '';
      if(!key.startsWith(GROUP_ADMIN_PREFIX)) continue;
      const code=normalize(key.slice(GROUP_ADMIN_PREFIX.length));
      const token=localStorage.getItem(key);
      if(code && token) matches.push({code,token});
    }
    return matches.length===1 ? matches[0] : null;
  }

  function ensureCard(){
    if(document.getElementById('picksEventManagerCard')) return;
    const shell=document.querySelector('#picks .picks-shell');
    if(!shell) return;
    const card=document.createElement('details');
    card.id='picksEventManagerCard';
    card.className='picks-event-manager-card';
    card.hidden=true;
    card.innerHTML='<summary><div><span>GROUP OWNER</span><strong>Event Manager</strong></div><b id="picksEventManagerSummary">Build the next card</b></summary><div id="picksEventManagerContent" class="picks-event-manager-content"></div>';
    const groupCard=document.getElementById('picksGroupCard');
    const admin=document.getElementById('picksAdminPanel');
    if(groupCard) groupCard.insertAdjacentElement('afterend',card);
    else if(admin) admin.insertAdjacentElement('afterend',card);
    else shell.prepend(card);
  }

  function localValue(value){
    if(!value) return '';
    const date=new Date(value);
    if(Number.isNaN(date.getTime())) return '';
    const local=new Date(date.getTime()-date.getTimezoneOffset()*60000);
    return local.toISOString().slice(0,16);
  }

  function isoValue(value){
    if(!value) return null;
    const date=new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  function defaultDate(){
    const date=new Date();
    date.setDate(date.getDate()+7);
    date.setHours(17,0,0,0);
    return localValue(date.toISOString());
  }

  function formatDate(value){
    if(!value) return 'Date TBD';
    return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
  }

  function odds(value){
    const number=Number(value);
    if(!Number.isFinite(number) || number===0) return '—';
    return number>0 ? `+${number}` : String(number);
  }

  function selectedEvent(){
    return state.events.find(event=>event.id===state.selectedId) || state.events[0] || null;
  }

  function statusLabel(status){
    return status==='hidden' ? 'Draft' : status.charAt(0).toUpperCase()+status.slice(1);
  }

  function eventOptions(){
    return state.events.map(event=>`<option value="${safe(event.id)}" ${event.id===state.selectedId?'selected':''}>${safe(event.name)} · ${safe(statusLabel(event.status))}</option>`).join('');
  }

  function createForm(){
    return `<section class="event-manager-create">
      <div class="event-manager-section-head"><div><span>NEW UFC EVENT</span><h3>Create the card</h3></div>${state.events.length?'<button id="eventManagerCancelCreate" type="button">Cancel</button>':''}</div>
      <div class="event-manager-grid">
        <label>Event name<input id="eventManagerName" placeholder="UFC 330" maxlength="80"></label>
        <label>Headline matchup<input id="eventManagerSubtitle" placeholder="Fighter vs. Fighter" maxlength="120"></label>
        <label>Event type<select id="eventManagerType"><option value="numbered">Numbered event · full card</option><option value="fight-night">Fight Night · main card only</option></select></label>
        <label>Date and card start<input id="eventManagerDate" type="datetime-local" value="${defaultDate()}"></label>
        <label class="wide">Location<input id="eventManagerLocation" placeholder="Las Vegas, Nevada"></label>
      </div>
      <button id="eventManagerCreate" class="event-manager-primary" type="button">Create Draft Event</button>
    </section>`;
  }

  function eventDetails(event){
    const editable=['hidden','upcoming'].includes(event.status);
    return `<section class="event-manager-details">
      <div class="event-manager-section-head">
        <div><span>EVENT DETAILS</span><h3>${safe(event.name)}</h3></div>
        <div class="event-manager-status ${safe(event.status)}">${safe(statusLabel(event.status))}</div>
      </div>
      <div class="event-manager-grid">
        <label>Event name<input id="eventManagerEditName" value="${safe(event.name)}" maxlength="80" ${editable?'':'disabled'}></label>
        <label>Headline matchup<input id="eventManagerEditSubtitle" value="${safe(event.subtitle || '')}" maxlength="120" ${editable?'':'disabled'}></label>
        <label>Event type<select id="eventManagerEditType" ${editable?'':'disabled'}><option value="numbered" ${event.event_type==='numbered'?'selected':''}>Numbered event · full card</option><option value="fight-night" ${event.event_type==='fight-night'?'selected':''}>Fight Night · main card only</option></select></label>
        <label>Date and card start<input id="eventManagerEditDate" type="datetime-local" value="${localValue(event.event_date)}" ${editable?'':'disabled'}></label>
        <label class="wide">Location<input id="eventManagerEditLocation" value="${safe(event.location || '')}" ${editable?'':'disabled'}></label>
      </div>
      <div class="event-manager-detail-actions">
        ${editable?'<button id="eventManagerSaveDetails" type="button">Save Details</button>':''}
        ${event.room_code?'<button id="eventManagerOpenRoom" type="button">Open Event Room</button>':''}
        ${event.status==='hidden'?'<button id="eventManagerDeleteDraft" class="danger" type="button">Delete Draft</button>':''}
      </div>
    </section>`;
  }

  function fightRows(event){
    if(!event.fights?.length) return '<div class="event-manager-empty">No fights yet. Add the first matchup below.</div>';
    return `<div class="event-manager-fight-list">${event.fights.map(fight=>`<article class="event-manager-fight-row">
      <span class="event-manager-order">${String(fight.order).padStart(2,'0')}</span>
      <div class="event-manager-matchup"><strong>${safe(fight.red)} <em>vs.</em> ${safe(fight.blue)}</strong><small>${safe(fight.card_section)} · ${safe(fight.weight_class)} · Locks ${safe(formatDate(fight.lock_at))}</small></div>
      <div class="event-manager-odds"><span>${safe(odds(fight.red_odds))}</span><span>${safe(odds(fight.blue_odds))}</span></div>
      <div class="event-manager-row-actions"><button type="button" data-edit-fight="${safe(fight.id)}">Edit</button><button type="button" class="danger" data-delete-fight="${safe(fight.id)}">Delete</button></div>
    </article>`).join('')}</div>`;
  }

  function defaultFightLock(event,order){
    const start=new Date(event.event_date);
    if(Number.isNaN(start.getTime())) return '';
    start.setMinutes(start.getMinutes()+Math.max(0,(Number(order)||1)-1)*30);
    return localValue(start.toISOString());
  }

  function fightForm(event){
    const editable=['hidden','upcoming'].includes(event.status);
    if(!editable) return '';
    const fight=event.fights?.find(item=>item.id===state.editingFightId) || null;
    const order=fight?.order || (event.fights?.length || 0)+1;
    const section=fight?.card_section || (event.event_type==='fight-night' ? 'Main Card' : 'Early Prelims');
    return `<section class="event-manager-fight-form">
      <div class="event-manager-section-head"><div><span>${fight?'EDIT FIGHT':'ADD FIGHT'}</span><h3>${fight?safe(`${fight.red} vs. ${fight.blue}`):'Build the card'}</h3></div>${fight?'<button id="eventManagerCancelFight" type="button">Cancel edit</button>':''}</div>
      <div class="event-manager-fight-grid">
        <label>Bout order<input id="eventManagerFightOrder" type="number" min="1" value="${safe(order)}"></label>
        <label>Card section<select id="eventManagerFightSection"><option ${section==='Main Event'?'selected':''}>Main Event</option><option ${section==='Co-Main Event'?'selected':''}>Co-Main Event</option><option ${section==='Main Card'?'selected':''}>Main Card</option><option ${section==='Prelims'?'selected':''}>Prelims</option><option ${section==='Early Prelims'?'selected':''}>Early Prelims</option></select></label>
        <label>Weight class<input id="eventManagerFightWeight" list="eventManagerWeightClasses" value="${safe(fight?.weight_class || '')}" placeholder="Lightweight"></label>
        <label>Lock time<input id="eventManagerFightLock" type="datetime-local" value="${fight?localValue(fight.lock_at):defaultFightLock(event,order)}"></label>
        <label>Red corner<input id="eventManagerFightRed" value="${safe(fight?.red || '')}" placeholder="Fighter name"></label>
        <label>Red odds<input id="eventManagerFightRedOdds" type="number" value="${fight?.red_odds ?? ''}" placeholder="-150"></label>
        <label>Blue corner<input id="eventManagerFightBlue" value="${safe(fight?.blue || '')}" placeholder="Fighter name"></label>
        <label>Blue odds<input id="eventManagerFightBlueOdds" type="number" value="${fight?.blue_odds ?? ''}" placeholder="+130"></label>
      </div>
      <datalist id="eventManagerWeightClasses"><option value="Flyweight"><option value="Bantamweight"><option value="Featherweight"><option value="Lightweight"><option value="Welterweight"><option value="Middleweight"><option value="Light Heavyweight"><option value="Heavyweight"><option value="Women's Strawweight"><option value="Women's Flyweight"><option value="Women's Bantamweight"></datalist>
      <button id="eventManagerSaveFight" class="event-manager-primary" type="button">${fight?'Save Fight':'Add Fight'}</button>
    </section>`;
  }

  function publishBlock(event){
    if(event.status==='hidden') return `<section class="event-manager-publish"><div><span>READY TO GO?</span><strong>Publish and open picks</strong><small>This creates the next room, carries every group member forward, and makes the event visible.</small></div><button id="eventManagerPublish" type="button" ${event.fights?.length?'':'disabled'}>Publish Event</button></section>`;
    if(event.status==='upcoming') return `<section class="event-manager-publish published"><div><span>UPCOMING</span><strong>This event is live for picks</strong><small>${event.room_code?'The permanent group has already been carried into this event.':'Attach it to the group from Season Standings.'}</small></div>${event.room_code?'<button id="eventManagerOpenPublished" type="button">Open Room</button>':''}</section>`;
    return '';
  }

  function render(){
    ensureCard();
    const card=document.getElementById('picksEventManagerCard');
    const target=document.getElementById('picksEventManagerContent');
    const summary=document.getElementById('picksEventManagerSummary');
    if(!card || !target || !summary) return;
    card.hidden=false;
    const drafts=state.events.filter(event=>event.status==='hidden').length;
    summary.textContent=drafts ? `${drafts} draft${drafts===1?'':'s'} · ${state.events.length} total` : `${state.events.length} managed event${state.events.length===1?'':'s'}`;

    if(state.creating || !state.events.length){
      target.innerHTML=createForm();
      bindCreate();
      return;
    }

    const event=selectedEvent();
    if(!event){ target.innerHTML=createForm(); bindCreate(); return; }
    target.innerHTML=`
      <div class="event-manager-toolbar"><label>Managed event<select id="eventManagerSelect">${eventOptions()}</select></label><button id="eventManagerNew" type="button">+ New Event</button></div>
      ${eventDetails(event)}
      <section class="event-manager-card-builder"><div class="event-manager-section-head"><div><span>FIGHT CARD</span><h3>${event.fights?.length || 0} fight${event.fights?.length===1?'':'s'}</h3></div></div>${fightRows(event)}</section>
      ${fightForm(event)}
      ${publishBlock(event)}`;
    bindEvent(event);
  }

  function bindCreate(){
    document.getElementById('eventManagerCancelCreate')?.addEventListener('click',()=>{ state.creating=false; render(); });
    document.getElementById('eventManagerCreate')?.addEventListener('click',createEvent);
  }

  function bindEvent(event){
    document.getElementById('eventManagerSelect')?.addEventListener('change',change=>{ state.selectedId=change.target.value; state.editingFightId=''; render(); });
    document.getElementById('eventManagerNew')?.addEventListener('click',()=>{ state.creating=true; render(); });
    document.getElementById('eventManagerSaveDetails')?.addEventListener('click',()=>saveDetails(event));
    document.getElementById('eventManagerDeleteDraft')?.addEventListener('click',()=>deleteDraft(event));
    document.getElementById('eventManagerOpenRoom')?.addEventListener('click',()=>openRoom(event));
    document.getElementById('eventManagerOpenPublished')?.addEventListener('click',()=>openRoom(event));
    document.getElementById('eventManagerCancelFight')?.addEventListener('click',()=>{ state.editingFightId=''; render(); });
    document.getElementById('eventManagerSaveFight')?.addEventListener('click',()=>saveFight(event));
    document.getElementById('eventManagerPublish')?.addEventListener('click',()=>publishEvent(event));
    document.querySelectorAll('[data-edit-fight]').forEach(button=>button.addEventListener('click',()=>{ state.editingFightId=button.dataset.editFight; render(); document.querySelector('.event-manager-fight-form')?.scrollIntoView({behavior:'smooth',block:'start'}); }));
    document.querySelectorAll('[data-delete-fight]').forEach(button=>button.addEventListener('click',()=>deleteFight(event,button.dataset.deleteFight)));
  }

  async function createEvent(){
    const name=document.getElementById('eventManagerName')?.value.trim();
    const subtitle=document.getElementById('eventManagerSubtitle')?.value.trim();
    const type=document.getElementById('eventManagerType')?.value;
    const date=isoValue(document.getElementById('eventManagerDate')?.value);
    const location=document.getElementById('eventManagerLocation')?.value.trim();
    const button=document.getElementById('eventManagerCreate');
    if(!name || !date){ toast('Enter the event name and date'); return; }
    if(button){ button.disabled=true; button.textContent='Creating…'; }
    const {data,error}=await client.rpc('picks_admin_create_event',{p_group_code:state.groupCode,p_admin_token:state.adminToken,p_name:name,p_subtitle:subtitle || null,p_event_type:type,p_event_date:date,p_location:location || null});
    if(error){ if(button){button.disabled=false;button.textContent='Create Draft Event';} toast(error.message || 'Event was not created'); return; }
    state.selectedId=data.event_id;
    state.creating=false;
    await refresh(true);
    toast('Draft event created');
  }

  async function saveDetails(event){
    const button=document.getElementById('eventManagerSaveDetails');
    if(button){button.disabled=true;button.textContent='Saving…';}
    const {error}=await client.rpc('picks_admin_update_event',{
      p_group_code:state.groupCode,p_admin_token:state.adminToken,p_event_id:event.id,
      p_name:document.getElementById('eventManagerEditName')?.value.trim(),
      p_subtitle:document.getElementById('eventManagerEditSubtitle')?.value.trim() || null,
      p_event_type:document.getElementById('eventManagerEditType')?.value,
      p_event_date:isoValue(document.getElementById('eventManagerEditDate')?.value),
      p_location:document.getElementById('eventManagerEditLocation')?.value.trim() || null
    });
    if(error){ if(button){button.disabled=false;button.textContent='Save Details';} toast(error.message || 'Details were not saved'); return; }
    await refresh(true);
    toast('Event details saved');
  }

  function nullableNumber(id){
    const raw=document.getElementById(id)?.value;
    if(raw==='' || raw==null) return null;
    const value=Number(raw);
    return Number.isFinite(value) ? value : null;
  }

  async function saveFight(event){
    const button=document.getElementById('eventManagerSaveFight');
    const lock=isoValue(document.getElementById('eventManagerFightLock')?.value);
    const red=document.getElementById('eventManagerFightRed')?.value.trim();
    const blue=document.getElementById('eventManagerFightBlue')?.value.trim();
    const weight=document.getElementById('eventManagerFightWeight')?.value.trim();
    if(!lock || !red || !blue || !weight){ toast('Enter both fighters, weight class, and lock time'); return; }
    if(button){button.disabled=true;button.textContent='Saving…';}
    const {error}=await client.rpc('picks_admin_upsert_fight',{
      p_group_code:state.groupCode,p_admin_token:state.adminToken,p_event_id:event.id,p_fight_id:state.editingFightId || null,
      p_bout_order:Number(document.getElementById('eventManagerFightOrder')?.value || 0),
      p_card_section:document.getElementById('eventManagerFightSection')?.value,
      p_weight_class:weight,p_red_name:red,p_blue_name:blue,p_lock_at:lock,
      p_red_odds:nullableNumber('eventManagerFightRedOdds'),p_blue_odds:nullableNumber('eventManagerFightBlueOdds')
    });
    if(error){ if(button){button.disabled=false;button.textContent=state.editingFightId?'Save Fight':'Add Fight';} toast(error.message || 'Fight was not saved'); return; }
    state.editingFightId='';
    await refresh(true);
    toast('Fight saved');
  }

  async function deleteFight(event,fightId){
    if(!window.confirm('Delete this fight from the card?')) return;
    const {error}=await client.rpc('picks_admin_delete_fight',{p_group_code:state.groupCode,p_admin_token:state.adminToken,p_event_id:event.id,p_fight_id:fightId});
    if(error){ toast(error.message || 'Fight was not deleted'); return; }
    if(state.editingFightId===fightId) state.editingFightId='';
    await refresh(true);
    toast('Fight deleted');
  }

  async function deleteDraft(event){
    if(!window.confirm(`Delete the ${event.name} draft and every fight on it?`)) return;
    const {error}=await client.rpc('picks_admin_delete_draft_event',{p_group_code:state.groupCode,p_admin_token:state.adminToken,p_event_id:event.id});
    if(error){ toast(error.message || 'Draft was not deleted'); return; }
    state.selectedId='';
    await refresh(true);
    toast('Draft deleted');
  }

  async function publishEvent(event){
    if(!window.confirm(`Publish ${event.name} and carry your permanent group into it?`)) return;
    const button=document.getElementById('eventManagerPublish');
    if(button){button.disabled=true;button.textContent='Publishing…';}
    const {data,error}=await client.rpc('picks_admin_publish_event',{p_group_code:state.groupCode,p_admin_token:state.adminToken,p_event_id:event.id});
    if(error){ if(button){button.disabled=false;button.textContent='Publish Event';} toast(error.message || 'Event was not published'); return; }
    toast('Event published');
    if(data?.room_code){
      const memberToken=localStorage.getItem(`${GROUP_TOKEN_PREFIX}${state.groupCode}`);
      if(memberToken) localStorage.setItem(`${ROOM_TOKEN_PREFIX}${data.room_code}`,memberToken);
      localStorage.setItem(`${ROOM_ADMIN_PREFIX}${data.room_code}`,state.adminToken);
      openRoom({...event,room_code:data.room_code,id:data.event_id || event.id});
      return;
    }
    await refresh(true);
  }

  function openRoom(event){
    if(!event?.room_code) return;
    const memberToken=localStorage.getItem(`${GROUP_TOKEN_PREFIX}${state.groupCode}`);
    if(memberToken) localStorage.setItem(`${ROOM_TOKEN_PREFIX}${event.room_code}`,memberToken);
    localStorage.setItem(`${ROOM_ADMIN_PREFIX}${event.room_code}`,state.adminToken);
    localStorage.setItem('ufc-picks:last-room',event.room_code);
    localStorage.removeItem('ufc-picks:auto-restore-disabled');
    const url=new URL(window.location.href);
    url.searchParams.set('group',state.groupCode);
    url.searchParams.set('room',event.room_code);
    url.searchParams.set('event',event.id);
    url.hash='picks';
    window.location.assign(url.toString());
  }

  async function refresh(force=false){
    if(state.loading) return;
    const owner=resolveOwner();
    if(!owner) return;
    state.groupCode=owner.code;
    state.adminToken=owner.token;
    state.loading=true;
    try{
      const {data,error}=await client.rpc('picks_admin_event_manager_snapshot',{p_group_code:state.groupCode,p_admin_token:state.adminToken});
      if(error || !data?.group) return;
      state.events=data.events || [];
      if(!state.selectedId || !state.events.some(event=>event.id===state.selectedId)){
        state.selectedId=state.events.find(event=>event.status==='hidden')?.id || state.events.find(event=>event.status==='upcoming')?.id || state.events[0]?.id || '';
      }
      if(force || document.getElementById('picksEventManagerCard')?.hidden || !document.getElementById('picksEventManagerContent')?.children.length) render();
      else render();
    }finally{
      state.loading=false;
    }
  }

  function start(){
    ensureCard();
    refresh();
    const observer=new MutationObserver(()=>{
      ensureCard();
      window.clearTimeout(start.timer);
      start.timer=window.setTimeout(refresh,250);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
    window.setInterval(refresh,60000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
