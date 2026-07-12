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

  function ensureCard(){
    if(document.getElementById('picksSocialCard')) return;
    const shell=document.querySelector('#picks .picks-shell');
    if(!shell) return;
    const card=document.createElement('details');
    card.id='picksSocialCard';
    card.className='picks-social-card';
    card.hidden=true;
    card.innerHTML='<summary><div><span>GROUP SOCIAL</span><strong>Social Hub</strong></div><b id="picksSocialSummary">Awards & activity</b></summary><div id="picksSocialContent" class="picks-social-content"></div>';
    const commissioner=document.getElementById('picksCommissionerCard');
    const manager=document.getElementById('picksEventManagerCard');
    const group=document.getElementById('picksGroupCard');
    if(commissioner) commissioner.insertAdjacentElement('beforebegin',card);
    else if(manager) manager.insertAdjacentElement('afterend',card);
    else if(group) group.insertAdjacentElement('afterend',card);
    else shell.prepend(card);
  }

  function formatDate(value,withTime=false){
    if(!value) return '';
    const options=withTime
      ? {weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}
      : {month:'short',day:'numeric',year:'numeric'};
    return new Intl.DateTimeFormat('en-US',options).format(new Date(value));
  }

  function relativeTime(value){
    const then=new Date(value).getTime();
    const seconds=Math.max(1,Math.round((Date.now()-then)/1000));
    if(seconds<60) return 'just now';
    const minutes=Math.round(seconds/60);
    if(minutes<60) return `${minutes}m ago`;
    const hours=Math.round(minutes/60);
    if(hours<24) return `${hours}h ago`;
    const days=Math.round(hours/24);
    return days<8 ? `${days}d ago` : formatDate(value);
  }

  function topBy(members,compare,eligible=()=>true){
    return [...members].filter(eligible).sort(compare)[0] || null;
  }

  function awardData(snapshot){
    const members=snapshot.members || [];
    const hot=topBy(members,(a,b)=>(b.current_streak||0)-(a.current_streak||0) || (b.points||0)-(a.points||0),member=>(member.current_streak||0)>0);
    const upset=topBy(members,(a,b)=>(b.biggest_upset_odds||0)-(a.biggest_upset_odds||0) || (b.upset_hits||0)-(a.upset_hits||0),member=>(member.biggest_upset_odds||0)>0);
    const lock=topBy(members,(a,b)=>(b.lock_pct||0)-(a.lock_pct||0) || (b.lock_hits||0)-(a.lock_hits||0) || (b.lock_attempts||0)-(a.lock_attempts||0),member=>(member.lock_attempts||0)>0);
    const eventAce=topBy(members,(a,b)=>(b.event_wins||0)-(a.event_wins||0) || (b.points||0)-(a.points||0),member=>(member.event_wins||0)>0);
    return {hot,upset,lock,eventAce};
  }

  function avatarMarkup(member,className=''){
    return `<span class="social-avatar ${safe(className)}" title="${safe(member?.display_name || '')}">${safe(emoji(member?.avatar_key))}</span>`;
  }

  function awardCard(kicker,member,headline,detail){
    return `<article class="social-award-card">
      ${member ? avatarMarkup(member,'award-avatar') : '<span class="social-award-empty">—</span>'}
      <div><span>${safe(kicker)}</span><strong>${safe(headline)}</strong><small>${safe(detail)}</small></div>
    </article>`;
  }

  function awardsSection(snapshot){
    const awards=awardData(snapshot);
    const hot=awards.hot
      ? awardCard('HOT HAND',awards.hot,awards.hot.display_name,`${awards.hot.current_streak} correct picks in a row`)
      : awardCard('HOT HAND',null,'Streak starts next event','No active correct-pick streak yet');
    const upset=awards.upset
      ? awardCard('UPSET HUNTER',awards.upset,awards.upset.display_name,`${awards.upset.upset_hits} upset hit${awards.upset.upset_hits===1?'':'s'} · biggest +${awards.upset.biggest_upset_odds}`)
      : awardCard('UPSET HUNTER',null,'Still up for grabs','No plus-money winner has landed yet');
    const lock=awards.lock
      ? awardCard('LOCK MASTER',awards.lock,awards.lock.display_name,`${awards.lock.lock_hits}/${awards.lock.lock_attempts} hit · ${awards.lock.lock_pct}%`)
      : awardCard('LOCK MASTER',null,'Still up for grabs','No graded Underdog Locks yet');
    const ace=awards.eventAce
      ? awardCard('EVENT WINS',awards.eventAce,awards.eventAce.display_name,`${awards.eventAce.event_wins} event win${awards.eventAce.event_wins===1?'':'s'}`)
      : awardCard('EVENT WINS',null,'First trophy waiting','No completed event winner yet');
    return `<section class="social-section">
      <div class="social-section-head"><div><span>SEASON AWARDS</span><h3>Who owns what?</h3></div><button id="picksShareSeasonCard" type="button">Share season card</button></div>
      <div class="social-awards-grid">${hot}${upset}${lock}${ace}</div>
    </section>`;
  }

  function latestWinnerSection(snapshot){
    const latest=snapshot.latest_completed_event;
    if(!latest || !Array.isArray(latest.champions) || !latest.champions.length) return '';
    const names=latest.champions.map(champion=>champion.display_name).join(' & ');
    return `<section class="social-latest-winner">
      <div class="social-trophy">🏆</div>
      <div><span>LATEST EVENT CHAMPION${latest.champions.length>1?'S':''}</span><h3>${safe(names)}</h3><p>${safe(latest.name)} · ${safe(latest.top_score)} points</p></div>
      <button id="picksShareWinnerCard" type="button">Share winner graphic</button>
    </section>`;
  }

  function standingsSection(snapshot){
    const members=(snapshot.members || []).slice(0,5);
    if(!members.length) return '';
    return `<section class="social-section">
      <div class="social-section-head"><div><span>${safe((snapshot.season?.name || 'SEASON').toUpperCase())}</span><h3>Trophy Race</h3></div><b>${members[0]?.points || 0} pts leads</b></div>
      <div class="social-standings">${members.map((member,index)=>`<div class="social-standing-row${index===0?' leader':''}">
        <span class="social-place">${index===0?'🏆':`#${index+1}`}</span>${avatarMarkup(member)}
        <div><strong>${safe(member.display_name)}${member.id===snapshot.me?.id?' <em>YOU</em>':''}</strong><small>${member.correct}/${member.picks_made} correct · ${member.current_streak || 0} current streak</small></div>
        <b>${member.points}<small>PTS</small></b>
      </div>`).join('')}</div>
    </section>`;
  }

  function pastChampionsSection(snapshot){
    const seasons=snapshot.past_champions || [];
    if(!seasons.length) return '';
    return `<section class="social-section social-past-champions">
      <div class="social-section-head"><div><span>TROPHY CASE</span><h3>Past Season Champions</h3></div><b>${seasons.length}</b></div>
      <div>${seasons.map(season=>`<article><span>🏆</span><div><strong>${safe(season.champions.map(champion=>champion.display_name).join(' & '))}</strong><small>${safe(season.name)} · ${safe(season.top_score)} points · ended ${safe(formatDate(season.ended_at))}</small></div></article>`).join('')}</div>
    </section>`;
  }

  function activityIcon(type){
    if(type==='fight_result') return '✓';
    if(type==='event_complete') return '🏆';
    if(type==='event_live') return '●';
    if(type==='member_joined') return '+';
    if(type==='season_started') return '⚡';
    if(type==='commissioner_changed') return '👑';
    return '•';
  }

  function activitySection(snapshot){
    const activity=snapshot.activity || [];
    return `<section class="social-section social-activity">
      <div class="social-section-head"><div><span>GROUP FEED</span><h3>Recent Activity</h3></div><b>${activity.length}</b></div>
      <div class="social-feed">${activity.length ? activity.map(item=>`<article>
        <span class="social-feed-icon">${safe(activityIcon(item.type))}</span>
        <div><strong>${safe(item.headline)}</strong><small>${safe(item.detail || item.event_name || '')}</small></div>
        <time>${safe(relativeTime(item.created_at))}</time>
      </article>`).join('') : '<div class="social-empty">The next pick, result, or member update will appear here.</div>'}</div>
    </section>`;
  }

  function profileSection(snapshot){
    const me=snapshot.me || {};
    const event=snapshot.upcoming_event;
    return `<section class="social-section social-profile">
      <div class="social-section-head"><div><span>YOUR PROFILE</span><h3>${safe(me.display_name || 'Player')}</h3></div>${avatarMarkup(me,'profile-avatar')}</div>
      <div class="social-avatar-picker" role="group" aria-label="Choose avatar">${Object.entries(AVATARS).map(([key,value])=>`<button type="button" data-social-avatar="${safe(key)}" class="${me.avatar_key===key?'active':''}" aria-label="${safe(key)} avatar">${safe(value)}</button>`).join('')}</div>
      <div class="social-reminder-row">
        <label><input id="picksSocialReminder" type="checkbox" ${me.reminder_opt_in?'checked':''}><span><strong>Event reminder</strong><small>Show a browser reminder when you open the app near event time.</small></span></label>
        ${event ? `<button id="picksAddCalendar" type="button">Add ${safe(event.name)} to calendar</button>` : '<span class="social-no-event">No upcoming event yet</span>'}
      </div>
    </section>`;
  }

  function render(snapshot){
    ensureCard();
    const card=document.getElementById('picksSocialCard');
    const content=document.getElementById('picksSocialContent');
    const summary=document.getElementById('picksSocialSummary');
    if(!card || !content || !summary) return;
    const leader=snapshot.members?.[0];
    card.hidden=false;
    summary.textContent=leader ? `${leader.display_name} leads · ${leader.current_streak || 0} streak` : 'Awards & activity';
    content.innerHTML=`
      ${latestWinnerSection(snapshot)}
      ${standingsSection(snapshot)}
      ${awardsSection(snapshot)}
      ${pastChampionsSection(snapshot)}
      ${activitySection(snapshot)}
      ${profileSection(snapshot)}`;
    bind(snapshot);
    decorateExistingRows(snapshot);
    maybeNotify(snapshot);
  }

  function decorateExistingRows(snapshot){
    const members=snapshot.members || [];
    document.querySelectorAll('.picks-group-member strong,.picks-standing-row strong,.picks-recap-row strong').forEach(node=>{
      if(node.querySelector('.social-inline-avatar')) return;
      const text=node.textContent.trim();
      const member=members.find(item=>text.startsWith(item.display_name));
      if(!member) return;
      node.insertAdjacentHTML('afterbegin',`<span class="social-inline-avatar">${safe(emoji(member.avatar_key))}</span>`);
    });
  }

  function bind(snapshot){
    document.querySelectorAll('[data-social-avatar]').forEach(button=>button.addEventListener('click',()=>saveProfile(button.dataset.socialAvatar,Boolean(document.getElementById('picksSocialReminder')?.checked),button)));
    document.getElementById('picksSocialReminder')?.addEventListener('change',event=>toggleReminder(event.target));
    document.getElementById('picksAddCalendar')?.addEventListener('click',()=>addToCalendar(snapshot.upcoming_event));
    document.getElementById('picksShareWinnerCard')?.addEventListener('click',()=>shareGraphic('event',snapshot));
    document.getElementById('picksShareSeasonCard')?.addEventListener('click',()=>shareGraphic('season',snapshot));
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
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(link.href),1000);
    toast('Calendar reminder created');
  }

  function wrappedLines(context,text,maxWidth){
    const words=String(text || '').split(/\s+/);
    const lines=[];
    let line='';
    words.forEach(word=>{
      const test=line ? `${line} ${word}` : word;
      if(context.measureText(test).width>maxWidth && line){ lines.push(line); line=word; }
      else line=test;
    });
    if(line) lines.push(line);
    return lines;
  }

  function drawWrapped(context,text,x,y,maxWidth,lineHeight,maxLines=3){
    const lines=wrappedLines(context,text,maxWidth).slice(0,maxLines);
    lines.forEach((line,index)=>context.fillText(line,x,y+index*lineHeight));
    return y+lines.length*lineHeight;
  }

  function buildCanvas(kind,snapshot){
    const canvas=document.createElement('canvas');
    canvas.width=1080;
    canvas.height=1350;
    const ctx=canvas.getContext('2d');
    const gradient=ctx.createLinearGradient(0,0,1080,1350);
    gradient.addColorStop(0,'#090b10');
    gradient.addColorStop(1,'#171b24');
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,1080,1350);
    ctx.fillStyle='#f36b21';
    ctx.fillRect(0,0,1080,34);
    ctx.fillRect(72,1130,936,4);

    ctx.fillStyle='#f36b21';
    ctx.font='700 34px Arial';
    ctx.fillText('UFC PICKS',72,105);
    ctx.fillStyle='#ffffff';
    ctx.font='900 74px Arial';

    if(kind==='event'){
      const event=snapshot.latest_completed_event;
      const champions=event?.champions || [];
      const names=champions.map(item=>item.display_name).join(' & ') || 'Room Champion';
      drawWrapped(ctx,event?.name || 'Event Final',72,220,900,82,2);
      ctx.fillStyle='#f36b21';
      ctx.font='800 32px Arial';
      ctx.fillText(champions.length>1?'CO-CHAMPIONS':'ROOM CHAMPION',72,430);
      ctx.fillStyle='#ffffff';
      ctx.font='900 86px Arial';
      const nameBottom=drawWrapped(ctx,names,72,535,900,96,3);
      ctx.fillStyle='#d7dbe5';
      ctx.font='700 42px Arial';
      ctx.fillText(`${event?.top_score || 0} POINTS`,72,nameBottom+45);
      ctx.font='400 32px Arial';
      ctx.fillText(`${event?.players || 0} players · ${snapshot.group.name}`,72,nameBottom+102);
      ctx.font='160px Arial';
      ctx.fillText('🏆',760,1030);
    }else{
      const leader=snapshot.members?.[0];
      const awards=awardData(snapshot);
      drawWrapped(ctx,snapshot.season?.name || 'Season Standings',72,220,900,82,2);
      ctx.fillStyle='#f36b21';
      ctx.font='800 32px Arial';
      ctx.fillText('CURRENT LEADER',72,430);
      ctx.fillStyle='#ffffff';
      ctx.font='900 88px Arial';
      const bottom=drawWrapped(ctx,leader?.display_name || 'No leader yet',72,540,900,98,3);
      ctx.fillStyle='#d7dbe5';
      ctx.font='700 42px Arial';
      ctx.fillText(`${leader?.points || 0} POINTS · ${leader?.current_streak || 0} PICK STREAK`,72,bottom+48);
      ctx.font='500 30px Arial';
      ctx.fillText(`Upset Hunter: ${awards.upset?.display_name || 'Open'}`,72,bottom+126);
      ctx.fillText(`Lock Master: ${awards.lock?.display_name || 'Open'}`,72,bottom+176);
      ctx.fillText(`Event Wins Leader: ${awards.eventAce?.display_name || 'Open'}`,72,bottom+226);
      ctx.font='160px Arial';
      ctx.fillText('🏆',760,1030);
    }

    ctx.fillStyle='#ffffff';
    ctx.font='700 30px Arial';
    ctx.fillText(snapshot.group.name,72,1205);
    ctx.fillStyle='#9299a8';
    ctx.font='400 25px Arial';
    ctx.fillText('UFC GOAT RANKINGS · PICKS',72,1255);
    return canvas;
  }

  async function shareGraphic(kind,snapshot){
    const canvas=buildCanvas(kind,snapshot);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png',0.94));
    if(!blob) return;
    const latest=snapshot.latest_completed_event;
    const title=kind==='event' ? `${latest?.name || 'UFC'} Picks Winner` : `${snapshot.season?.name || 'UFC Picks'} Standings`;
    const file=new File([blob],`${kind==='event'?'event-winner':'season-standings'}.png`,{type:'image/png'});
    try{
      if(navigator.share && navigator.canShare?.({files:[file]})){
        await navigator.share({title,text:`${title} — ${snapshot.group.name}`,files:[file]});
        return;
      }
    }catch(_error){ return; }
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download=file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(link.href),1000);
    toast('Share graphic created');
  }

  async function refresh(force=false){
    if(state.loading) return;
    ensureCard();
    const next=context();
    if(!next.code || !next.token) return;
    state.code=next.code;
    state.token=next.token;
    state.loading=true;
    try{
      const {data,error}=await client.rpc('picks_social_snapshot',{p_group_code:state.code,p_member_token:state.token});
      if(error || !data?.group) return;
      const signature=JSON.stringify(data);
      state.snapshot=data;
      if(force || signature!==state.lastSignature){ state.lastSignature=signature; render(data); }
      else decorateExistingRows(data);
    }finally{
      state.loading=false;
    }
  }

  function start(){
    ensureCard();
    refresh();
    const observer=new MutationObserver(()=>{
      ensureCard();
      clearTimeout(start.timer);
      start.timer=setTimeout(()=>refresh(),260);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
    window.setInterval(()=>refresh(),30000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
