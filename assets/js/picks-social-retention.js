(function(){
  'use strict';

  const VERSION='picks-social-retention-20260718f-shared-profile';
  const config=window.UFC_SUPABASE_CONFIG||{};
  if(!config.url||!config.anonKey||!window.supabase?.createClient)return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const state={code:'',token:'',snapshot:null,loading:false,lastSignature:''};

  const safe=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize=value=>String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const initials=value=>String(value||'').trim().split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';

  function installStyles(){
    if(document.getElementById('picksSharedProfileCss'))return;
    const style=document.createElement('style');
    style.id='picksSharedProfileCss';
    style.textContent=`
      .picks-shared-avatar{width:38px!important;height:38px!important;min-width:38px!important;border-radius:50%!important;vertical-align:middle;margin-right:8px}.picks-shared-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%}.social-inline-avatar.picks-shared-avatar{display:inline-flex!important;align-items:center;justify-content:center}.social-profile .picks-profile-identity-row{display:grid;grid-template-columns:56px minmax(0,1fr) auto;align-items:center;gap:12px;margin:12px 0 16px;padding:12px;border:1px solid #34445d;border-radius:16px;background:#111827}.social-profile .picks-profile-identity-row .app-profile-avatar{width:56px;height:56px;min-width:56px}.social-profile .picks-profile-identity-row strong,.social-profile .picks-profile-identity-row small{display:block}.social-profile .picks-profile-identity-row strong{font:950 16px/1 system-ui}.social-profile .picks-profile-identity-row small{margin-top:5px;color:#94a3b8;font:700 10px/1.3 system-ui}.social-profile .picks-profile-identity-row button{min-height:42px;border:1px solid #f97316;border-radius:12px;background:#f97316;color:#111827;padding:0 12px;font:950 10px/1 system-ui}@media(max-width:520px){.social-profile .picks-profile-identity-row{grid-template-columns:52px minmax(0,1fr)}.social-profile .picks-profile-identity-row button{grid-column:1/-1;width:100%}}
    `;
    document.head.appendChild(style);
  }

  function toast(message){
    const node=document.getElementById('picksToast');if(!node)return;
    node.textContent=message;node.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove('show'),1900);
  }

  function storedGroupCode(){
    const codes=[];
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';if(!key.startsWith(GROUP_TOKEN_PREFIX))continue;
        const code=normalize(key.slice(GROUP_TOKEN_PREFIX.length));if(code&&localStorage.getItem(key))codes.push(code);
      }
    }catch(_error){}
    return codes.length===1?codes[0]:'';
  }

  function context(){
    const url=new URL(window.location.href);const code=normalize(url.searchParams.get('group'))||storedGroupCode();
    return {code,token:code?localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`)||'':''};
  }

  function ensureProfileShell(){
    let shell=document.getElementById('picksProfileShell');if(shell)return shell;
    const picksShell=document.querySelector('#picks .picks-shell');if(!picksShell)return null;
    shell=document.createElement('section');shell.id='picksProfileShell';shell.className='picks-profile-shell';shell.hidden=true;picksShell.appendChild(shell);return shell;
  }

  function formatDate(value,withTime=false){
    if(!value)return'';
    const options=withTime?{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}:{month:'short',day:'numeric',year:'numeric'};
    return new Intl.DateTimeFormat('en-US',options).format(new Date(value));
  }

  function sharedGroup(){return window.UFC_APP_PROFILE?.group||null;}
  function sharedMemberFor(member){
    const members=sharedGroup()?.members||[];
    const id=String(member?.id||'');const name=String(member?.display_name||'').trim().toLowerCase();
    return members.find(row=>id&&String(row?.id||'')===id)||members.find(row=>String(row?.display_name||'').trim().toLowerCase()===name)||null;
  }
  function sharedMe(){return sharedGroup()?.me||sharedMemberFor(state.snapshot?.me)||null;}
  function isAdmin(){return Boolean(sharedMe()?.is_admin);}

  function avatarSignature(member){
    const shared=sharedMemberFor(member)||member||{};
    return [shared.id||'',shared.profile_updated_at||'',shared.fighter_avatar_slug||'',String(shared.profile_photo_data||'').length].join('|');
  }

  function avatarHtml(member,className='picks-shared-avatar'){
    const shared=sharedMemberFor(member)||member||{};
    if(window.UFC_APP_PROFILE?.avatarMarkup)return window.UFC_APP_PROFILE.avatarMarkup(shared,className);
    return `<span class="app-profile-avatar ${safe(className)}"><span>${safe(initials(shared.display_name))}</span></span>`;
  }

  function profileMarkup(snapshot){
    const me=snapshot.me||{};const event=snapshot.upcoming_event;const shared=sharedMe()||me;
    return `<section class="social-section social-profile"><div class="social-section-head"><div><span>ADMIN SETTINGS</span><h3>Profile & Reminders</h3></div></div><div class="picks-profile-identity-row" data-member-name="${safe(shared.display_name||me.display_name)}">${avatarHtml(shared)}<div><strong>${safe(shared.display_name||me.display_name||'Player')}</strong><small>Your shared Octagon HQ profile is used in Picks, Play, and The War Room.</small></div><button type="button" data-edit-shared-profile>EDIT PROFILE</button></div><div class="social-reminder-row"><label><input id="picksSocialReminder" type="checkbox" ${me.reminder_opt_in?'checked':''}><span><strong>In-app reminder</strong><small>Only works when the app is open near event time.</small></span></label>${event?'<button id="picksAddCalendar" type="button">Add Phone Reminders</button>':'<span class="social-no-event">No upcoming event yet</span>'}</div><p class="picks-reminder-reliability">Add Phone Reminders creates a calendar event with alerts eight hours and one hour before the card starts.</p></section>`;
  }

  function render(snapshot){
    const shell=ensureProfileShell();if(!shell)return;
    shell.hidden=!isAdmin();
    if(isAdmin()){shell.innerHTML=profileMarkup(snapshot);bind(snapshot);}
    decorateExistingRows(snapshot);maybeNotify(snapshot);
    window.dispatchEvent(new CustomEvent('picks:profileupdated',{detail:{member:sharedMe(),reminder:Boolean(snapshot.me?.reminder_opt_in),isAdmin:isAdmin()}}));
  }

  function decorateExistingRows(snapshot=state.snapshot){
    if(!snapshot)return;
    const members=snapshot.members||[];
    document.querySelectorAll('.picks-group-member strong,.picks-standing-row strong,.picks-recap-row strong').forEach(node=>{
      const existing=node.querySelector('.social-inline-avatar,.picks-shared-avatar');
      const fullText=String(node.textContent||'').trim();
      const nameText=existing?fullText.replace(String(existing.textContent||'').trim(),'').trim():fullText;
      const member=members.find(item=>nameText.startsWith(String(item.display_name||'')));
      if(!member){existing?.remove();return;}
      const signature=avatarSignature(member);
      if(existing?.dataset?.profileSignature===signature)return;
      const wrapper=document.createElement('span');wrapper.innerHTML=avatarHtml(member,'social-inline-avatar picks-shared-avatar');
      const avatar=wrapper.firstElementChild;
      avatar.dataset.profileSignature=signature;
      if(existing)existing.replaceWith(avatar);else node.prepend(avatar);
    });
  }

  function bind(snapshot){
    document.querySelector('[data-edit-shared-profile]')?.addEventListener('click',()=>window.UFC_APP_PROFILE?.open?.());
    document.getElementById('picksSocialReminder')?.addEventListener('change',event=>toggleReminder(event.target));
    document.getElementById('picksAddCalendar')?.addEventListener('click',()=>addToCalendar(snapshot.upcoming_event));
  }

  async function toggleReminder(input){
    const currentAvatar=state.snapshot?.me?.avatar_key||'gloves';
    if(input.checked&&'Notification' in window&&Notification.permission==='default'){
      try{const permission=await Notification.requestPermission();if(permission==='denied')toast('Browser notifications are blocked; phone reminders still work');}catch(_error){}
    }
    const {error}=await client.rpc('picks_social_update_profile',{p_group_code:state.code,p_member_token:state.token,p_avatar_key:currentAvatar,p_reminder_opt_in:Boolean(input.checked)});
    if(error){input.checked=!input.checked;toast(error.message||'Reminder preference was not saved');return;}
    toast(input.checked?'In-app reminder enabled':'In-app reminder disabled');await refresh(true);
  }

  function maybeNotify(snapshot){
    const event=snapshot.upcoming_event;if(!snapshot.me?.reminder_opt_in||!event||event.status==='live')return;
    const start=new Date(event.event_date).getTime();const remaining=start-Date.now();if(remaining<=0||remaining>24*60*60*1000)return;
    const key=`ufc-picks:notified:${event.event_id}`;if(localStorage.getItem(key))return;
    if('Notification' in window&&Notification.permission==='granted'){
      try{new Notification(`${event.name} picks`,{body:`Card starts ${formatDate(event.event_date,true)}. Lock in your picks.`,tag:event.event_id});localStorage.setItem(key,'1');}catch(_error){}
    }
  }

  function escapeIcs(value){return String(value||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
  function icsDate(date){return new Date(date).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');}
  function addToCalendar(event){
    if(!event)return;const start=new Date(event.event_date);const end=new Date(start.getTime()+6*60*60*1000);const startLabel=formatDate(event.event_date,true);const url=new URL(window.location.href);url.searchParams.set('group',state.code);url.searchParams.set('picksView','event');url.hash='picks';
    const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UFC Picks//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${escapeIcs(event.event_id)}@ufc-picks`,`DTSTAMP:${icsDate(new Date())}`,`DTSTART:${icsDate(start)}`,`DTEND:${icsDate(end)}`,`SUMMARY:${escapeIcs(`${event.name} — Make Picks`)}`,`DESCRIPTION:${escapeIcs(`Lock in your UFC picks: ${url.toString()}`)}`,`URL:${escapeIcs(url.toString())}`,'BEGIN:VALARM','TRIGGER:-PT8H','ACTION:DISPLAY',`DESCRIPTION:${escapeIcs(`${event.name} is today. Make your UFC picks before ${startLabel}.`)}`,'END:VALARM','BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY',`DESCRIPTION:${escapeIcs(`${event.name} starts in one hour. Finalize your UFC picks now.`)}`,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
    const blob=new Blob([content],{type:'text/calendar;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`${event.event_id||'ufc-picks'}.ics`;document.body.appendChild(link);link.click();const href=link.href;link.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);toast('Phone reminders added');
  }

  async function refresh(force=false){
    if(state.loading)return;const shell=ensureProfileShell();const next=context();if(!next.code||!next.token){if(shell)shell.hidden=true;return;}
    state.code=next.code;state.token=next.token;state.loading=true;
    try{
      const {data,error}=await client.rpc('picks_social_snapshot',{p_group_code:state.code,p_member_token:state.token});if(error||!data?.group){if(shell)shell.hidden=true;return;}
      const signature=JSON.stringify({me:data.me,upcoming_event:data.upcoming_event,members:(data.members||[]).map(member=>[member.id,member.display_name])});state.snapshot=data;
      if(force||signature!==state.lastSignature){state.lastSignature=signature;render(data);}else decorateExistingRows(data);
    }finally{state.loading=false;}
  }

  function syncSharedProfile(){
    if(state.snapshot)render(state.snapshot);
    else refresh(true);
  }

  function start(){
    installStyles();ensureProfileShell();refresh();
    const observer=new MutationObserver(()=>{ensureProfileShell();if(state.snapshot)decorateExistingRows(state.snapshot);});
    observer.observe(document.getElementById('picks')||document.body,{childList:true,subtree:true});
    ['ufc-app-profile-updated','ufc-play-profile-ready','ufc-play-data-ready'].forEach(name=>window.addEventListener(name,()=>setTimeout(syncSharedProfile,0)));
    window.setInterval(()=>refresh(),30000);
  }

  window.UFC_PICKS_SHARED_PROFILE={version:VERSION,refresh,decorateExistingRows,isAdmin};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();