(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const state={code:'',token:'',snapshot:null,loading:false,lastSignature:''};
  const AVATARS={
    gloves:'🥊',crown:'👑',belt:'🏆',fire:'🔥',lightning:'⚡',wolf:'🐺',
    eagle:'🦅',lion:'🦁',shark:'🦈',skull:'💀',star:'⭐',target:'🎯'
  };

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const emoji=key=>AVATARS[key] || AVATARS.gloves;

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),1900);
  }

  function storedGroupCode(){
    const codes=[];
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index) || '';
      if(!key.startsWith(GROUP_TOKEN_PREFIX)) continue;
      const code=normalize(key.slice(GROUP_TOKEN_PREFIX.length));
      if(code && localStorage.getItem(key)) codes.push(code);
    }
    return codes.length===1 ? codes[0] : '';
  }

  function context(){
    const url=new URL(window.location.href);
    const code=normalize(url.searchParams.get('group')) || storedGroupCode();
    return {code,token:code ? localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`) || '' : ''};
  }

  function ensureProfileShell(){
    let shell=document.getElementById('picksProfileShell');
    if(shell) return shell;
    const host=document.getElementById('picksSettingsContent') || document.querySelector('#picks .picks-shell');
    if(!host) return null;
    shell=document.createElement('section');
    shell.id='picksProfileShell';
    shell.className='picks-profile-shell';
    shell.hidden=true;
    host.appendChild(shell);
    return shell;
  }

  function formatDate(value,withTime=false){
    if(!value) return '';
    const options=withTime
      ? {weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}
      : {month:'short',day:'numeric',year:'numeric'};
    return new Intl.DateTimeFormat('en-US',options).format(new Date(value));
  }

  function profileMarkup(snapshot){
    const me=snapshot.me || {};
    const event=snapshot.upcoming_event;
    return `<section class="social-section social-profile">
      <div class="social-section-head"><div><span>YOUR PROFILE</span><h3>${safe(me.display_name || 'Player')}</h3></div><span class="social-avatar profile-avatar" title="${safe(me.display_name || '')}">${safe(emoji(me.avatar_key))}</span></div>
      <div class="social-avatar-picker" role="group" aria-label="Choose avatar">${Object.entries(AVATARS).map(([key,value])=>`<button type="button" data-social-avatar="${safe(key)}" class="${me.avatar_key===key?'active':''}" aria-label="${safe(key)} avatar">${safe(value)}</button>`).join('')}</div>
      <div class="social-reminder-row">
        <label><input id="picksSocialReminder" type="checkbox" ${me.reminder_opt_in?'checked':''}><span><strong>Event reminder</strong><small>Show a browser reminder when you open the app near event time.</small></span></label>
        ${event ? `<button id="picksAddCalendar" type="button">Add ${safe(event.name)} to calendar</button>` : '<span class="social-no-event">No upcoming event yet</span>'}
      </div>
    </section>`;
  }

  function render(snapshot){
    const shell=ensureProfileShell();
    if(!shell) return;
    shell.hidden=false;
    shell.innerHTML=profileMarkup(snapshot);
    bind(snapshot);
    decorateExistingRows(snapshot);
    maybeNotify(snapshot);
    window.dispatchEvent(new CustomEvent('picks:profileupdated',{detail:{avatar_key:snapshot.me?.avatar_key || 'gloves',reminder_opt_in:Boolean(snapshot.me?.reminder_opt_in)}}));
  }

  function decorateExistingRows(snapshot){
    const members=snapshot.members || [];
    document.querySelectorAll('.picks-group-member strong,.picks-standing-row strong,.picks-recap-row strong').forEach(node=>{
      const text=node.textContent.trim();
      const member=members.find(item=>text.startsWith(item.display_name));
      const existing=node.querySelector('.social-inline-avatar');
      if(!member){ existing?.remove(); return; }
      const icon=emoji(member.avatar_key);
      if(existing){ existing.textContent=icon; return; }
      node.insertAdjacentHTML('afterbegin',`<span class="social-inline-avatar">${safe(icon)}</span>`);
    });
  }

  function bind(snapshot){
    document.querySelectorAll('[data-social-avatar]').forEach(button=>button.addEventListener('click',()=>saveProfile(button.dataset.socialAvatar,Boolean(document.getElementById('picksSocialReminder')?.checked),button)));
    document.getElementById('picksSocialReminder')?.addEventListener('change',event=>toggleReminder(event.target));
    document.getElementById('picksAddCalendar')?.addEventListener('click',()=>addToCalendar(snapshot.upcoming_event));
  }

  async function saveProfile(avatarKey,reminder,button){
    if(!state.code || !state.token) return;
    button?.setAttribute('disabled','');
    const {error}=await client.rpc('picks_social_update_profile',{p_group_code:state.code,p_member_token:state.token,p_avatar_key:avatarKey,p_reminder_opt_in:reminder});
    button?.removeAttribute('disabled');
    if(error){ toast(error.message || 'Profile was not saved'); return; }
    toast('Avatar updated');
    await refresh(true);
  }

  async function toggleReminder(input){
    const avatar=state.snapshot?.me?.avatar_key || 'gloves';
    if(input.checked && 'Notification' in window && Notification.permission==='default'){
      try{
        const permission=await Notification.requestPermission();
        if(permission==='denied') toast('Browser notifications are blocked; calendar reminders still work');
      }catch(_error){}
    }
    const {error}=await client.rpc('picks_social_update_profile',{p_group_code:state.code,p_member_token:state.token,p_avatar_key:avatar,p_reminder_opt_in:Boolean(input.checked)});
    if(error){ input.checked=!input.checked; toast(error.message || 'Reminder preference was not saved'); return; }
    toast(input.checked ? 'Event reminder enabled' : 'Event reminder disabled');
    await refresh(true);
  }

  function maybeNotify(snapshot){
    const event=snapshot.upcoming_event;
    if(!snapshot.me?.reminder_opt_in || !event || event.status==='live') return;
    const start=new Date(event.event_date).getTime();
    const remaining=start-Date.now();
    if(remaining<=0 || remaining>24*60*60*1000) return;
    const key=`ufc-picks:notified:${event.event_id}`;
    if(localStorage.getItem(key)) return;
    if('Notification' in window && Notification.permission==='granted'){
      try{
        new Notification(`${event.name} picks`,{body:`Card starts ${formatDate(event.event_date,true)}. Lock in your picks.`,tag:event.event_id});
        localStorage.setItem(key,'1');
      }catch(_error){}
    }
  }

  function escapeIcs(value){
    return String(value || '').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  }

  function icsDate(date){
    return new Date(date).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  }

  function addToCalendar(event){
    if(!event) return;
    const start=new Date(event.event_date);
    const end=new Date(start.getTime()+6*60*60*1000);
    const url=new URL(window.location.href);
    url.searchParams.set('group',state.code);
    url.searchParams.delete('room');
    url.searchParams.set('picksView','home');
    url.hash='picks';
    const content=[
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UFC Picks//EN','BEGIN:VEVENT',
      `UID:${escapeIcs(event.event_id)}@ufc-picks`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:${escapeIcs(`${event.name} Picks`)}`,
      `DESCRIPTION:${escapeIcs(`Lock in your UFC picks: ${url.toString()}`)}`,
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob=new Blob([content],{type:'text/calendar;charset=utf-8'});
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download=`${event.event_id || 'ufc-picks'}.ics`;
    document.body.appendChild(link);
    link.click();
    const objectUrl=link.href;
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
    toast('Calendar reminder created');
  }

  async function refresh(force=false){
    if(state.loading) return;
    const next=context();
    if(!next.code || !next.token){
      const shell=document.getElementById('picksProfileShell');
      if(shell) shell.hidden=true;
      return;
    }
    state.code=next.code;
    state.token=next.token;
    state.loading=true;
    try{
      const {data,error}=await client.rpc('picks_social_snapshot',{p_group_code:state.code,p_member_token:state.token});
      if(error || !data?.group) return;
      const signature=JSON.stringify({me:data.me,members:(data.members || []).map(member=>[member.id,member.display_name,member.avatar_key]),upcoming_event:data.upcoming_event});
      state.snapshot=data;
      if(force || signature!==state.lastSignature){ state.lastSignature=signature; render(data); }
      else decorateExistingRows(data);
    }finally{
      state.loading=false;
    }
  }

  function start(){
    ensureProfileShell();
    refresh();
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(()=>refresh(),220);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
    window.addEventListener('picks:routechange',()=>setTimeout(()=>refresh(),60));
    window.setInterval(()=>refresh(),30000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();