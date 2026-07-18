(function(){
  'use strict';

  const VERSION='picks-season-loop-20260718b-phase-2c-consolidated';
  const GROUP_CODE='GOAT26';
  const GROUP_TOKEN_KEY=`ufc-picks:group:${GROUP_CODE}`;
  const GROUP_ADMIN_KEY=`ufc-picks:group-admin:${GROUP_CODE}`;
  const state={loading:null,data:null,identity:null,social:null,bound:false,groupObserver:null,groupTarget:null,recapObserver:null,recapTarget:null,timer:0};
  const config=window.UFC_SUPABASE_CONFIG||{};
  const ownClient=config.url&&config.anonKey&&window.supabase?.createClient?window.supabase.createClient(config.url,config.anonKey):null;

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const normalize=value=>text(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const get=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const api=()=>window.UFC_PLAY_PROFILE?.client||ownClient;
  const currentYear=()=>Number(new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric'}).format(new Date()));

  function installStyles(){
    if(document.getElementById('picksSeasonLoopCss'))return;
    const style=document.createElement('style');
    style.id='picksSeasonLoopCss';
    style.textContent=`
      #picksSeasonHub,#picksProfileShell,.picks-home-profile{display:none!important}
      .picks-home-compact:not([data-season-ready="true"]) .picks-group-member>span:first-child{visibility:hidden}
      .picks-season-summary{margin:0;padding:16px;border:1px solid #33445f;border-radius:20px;background:linear-gradient(135deg,#17243a,#101827);color:#fff}
      .picks-season-summary-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .picks-season-summary-head span,.picks-season-summary-head strong,.picks-season-summary-head small{display:block}
      .picks-season-summary-head span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.13em}
      .picks-season-summary-head strong{margin-top:6px;font:950 21px/1 system-ui}
      .picks-season-summary-head small{margin-top:7px;color:#cbd5e1;font:750 10px/1.35 system-ui}
      .picks-season-summary-rank{min-width:78px;padding:10px 12px;border:1px solid rgba(249,115,22,.5);border-radius:14px;background:rgba(249,115,22,.1);text-align:center}
      .picks-season-summary-rank b{display:block;font:950 22px/1 system-ui}
      .picks-season-summary-rank em{display:block;margin-top:5px;color:#fdba74;font:850 7px/1 system-ui;letter-spacing:.08em;font-style:normal}
      .picks-season-summary-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:13px}
      .picks-season-summary-grid div{min-width:0;padding:11px;border:1px solid #30415b;border-radius:12px;background:#0b1220}
      .picks-season-summary-grid span,.picks-season-summary-grid strong,.picks-season-summary-grid small{display:block}
      .picks-season-summary-grid span{color:#94a3b8;font:850 7px/1 system-ui;letter-spacing:.08em}
      .picks-season-summary-grid strong{margin-top:6px;font:950 17px/1 system-ui}
      .picks-season-summary-grid small{margin-top:4px;color:#94a3b8;font:700 8px/1.25 system-ui}
      .picks-season-reminder{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:14px;margin:0 0 12px;padding:13px 15px;border:1px solid rgba(249,115,22,.5);border-radius:17px;background:linear-gradient(115deg,#17233a,#101827);color:#fff}
      .picks-season-reminder span,.picks-season-reminder strong,.picks-season-reminder small{display:block}
      .picks-season-reminder span{color:#fb923c;font:950 8px/1 system-ui;letter-spacing:.12em}
      .picks-season-reminder strong{margin-top:6px;font:950 14px/1.2 system-ui}
      .picks-season-reminder small{margin-top:5px;color:#cbd5e1;font:700 9px/1.35 system-ui}
      .picks-season-reminder-actions{display:flex;align-items:center;gap:8px}
      .picks-season-reminder label,.picks-season-reminder button{min-height:42px;border-radius:12px;padding:0 12px;font:950 9px/1 system-ui;cursor:pointer;white-space:nowrap}
      .picks-season-reminder label{display:flex;align-items:center;gap:8px;border:1px solid #526786;background:#0b1220}
      .picks-season-reminder input{accent-color:#f97316}
      .picks-season-reminder button{border:1px solid #f97316;background:#f97316;color:#111827}
      .picks-season-personal-recap{margin:0 0 14px;padding:15px;border:1px solid rgba(249,115,22,.58);border-radius:17px;background:linear-gradient(115deg,rgba(249,115,22,.14),rgba(15,23,42,.92));color:#fff}
      .picks-season-personal-recap>span{color:#fb923c;font:950 8px/1 system-ui;letter-spacing:.13em}
      .picks-season-personal-recap h4{margin:7px 0 0;font:950 21px/1 system-ui}
      .picks-season-personal-recap p{margin:8px 0 0;color:#cbd5e1;font:700 10px/1.4}
      .picks-season-personal-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:11px}
      .picks-season-personal-grid div{padding:9px;border:1px solid #394b66;border-radius:11px;background:#0b1220}
      .picks-season-personal-grid span,.picks-season-personal-grid strong{display:block}
      .picks-season-personal-grid span{color:#94a3b8;font:850 7px/1 system-ui;letter-spacing:.08em}
      .picks-season-personal-grid strong{margin-top:5px;font:950 14px/1 system-ui}
      .profile-picks-season-action{width:100%;min-height:40px;margin-top:12px;border:1px solid #f97316;border-radius:11px;background:rgba(249,115,22,.12);color:#fed7aa;font:950 9px/1 system-ui;cursor:pointer}
      @media(max-width:700px){.picks-season-summary-grid,.picks-season-personal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.picks-season-reminder{grid-template-columns:1fr}.picks-season-reminder-actions{display:grid;grid-template-columns:1fr 1fr}.picks-season-reminder label,.picks-season-reminder button{width:100%;justify-content:center}}
    `;
    document.head.appendChild(style);
  }

  function toast(message){const node=document.getElementById('picksToast');if(!node)return;node.textContent=message;node.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove('show'),1800);}
  function completeEvent(event){if(!event)return false;if(event.status==='complete')return true;const fights=Array.isArray(event.fights)?event.fights:[];return fights.length>0&&fights.every(fight=>fight.resultStatus&&fight.resultStatus!=='scheduled');}
  function eventDate(event){return event?.eventDate||event?.event_date||'';}
  function formatDate(value,withTime=false){if(!value)return'';try{return new Intl.DateTimeFormat('en-US',withTime?{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}:{month:'short',day:'numeric',year:'numeric'}).format(new Date(value));}catch(_error){return'';}}
  function gradedFights(event){return(Array.isArray(event?.fights)?event.fights:[]).filter(fight=>fight.resultStatus==='complete'&&fight.winner);}
  function fightPick(member,fightId){return(Array.isArray(member?.visible_picks)?member.visible_picks:[]).find(pick=>pick.fight_id===fightId)||null;}
  function pickOdds(fight,name){if(text(name)===text(fight?.red))return num(fight?.redOdds);if(text(name)===text(fight?.blue))return num(fight?.blueOdds);return 0;}
  function mainFight(event){const fights=gradedFights(event);return fights.find(fight=>normalize(fight.cardSection)==='main event')||fights.at(-1)||null;}
  function sortedRoomMembers(snapshot){return[...(snapshot?.members||[])].sort((a,b)=>num(b.score)-num(a.score)||num(b.correct)-num(a.correct)||text(a.display_name).localeCompare(text(b.display_name)));}
  function identityMember(snapshot,identity){const members=snapshot?.members||[];const id=identity?.member?.id||snapshot?.me?.id;const name=normalize(identity?.member?.display_name||snapshot?.me?.display_name);return members.find(member=>id&&member.id===id)||members.find(member=>normalize(member.display_name)===name)||snapshot?.me||null;}
  function tieKey(member){return[num(member?.points??member?.score),num(member?.correct),num(member?.picks_made??member?.picks_count),num(member?.event_wins)].join('|');}
  function tieLabel(members,index){const key=tieKey(members[index]);const first=members.findIndex(member=>tieKey(member)===key);const count=members.filter(member=>tieKey(member)===key).length;return`${count>1?'T-':'#'}${first+1}`;}
  function eventTieLabel(members,member){const key=[num(member?.score),num(member?.correct)].join('|');const first=members.findIndex(row=>[num(row?.score),num(row?.correct)].join('|')===key);const count=members.filter(row=>[num(row?.score),num(row?.correct)].join('|')===key).length;return`${count>1?'T-':'#'}${first+1}`;}

  function eventRecord(event,snapshot,identity){
    const members=sortedRoomMembers(snapshot);const me=identityMember(snapshot,identity);if(!me)return null;
    const graded=gradedFights(event);let made=0,correct=0,underdogHits=0,lockHits=0;
    graded.forEach(fight=>{const pick=fightPick(me,fight.id);if(!pick)return;made+=1;const hit=text(pick.fighter_name)===text(fight.winner);if(!hit)return;correct+=1;if(pickOdds(fight,pick.fighter_name)>0)underdogHits+=1;if(pick.is_underdog_lock)lockHits+=1;});
    const main=mainFight(event);const mainPick=main?fightPick(me,main.id):null;
    return{eventId:event.id,event,roomCode:snapshot?.room?.code||'',me,members,made,correct,losses:Math.max(0,made-correct),accuracy:made?Math.round(correct/made*100):0,points:num(me.score),place:eventTieLabel(members,me),won:members.length>0&&num(me.score)===num(members[0].score),mainMade:Boolean(mainPick),mainCorrect:Boolean(mainPick&&text(mainPick.fighter_name)===text(main.winner)),underdogHits,lockHits,date:eventDate(event)};
  }

  async function resolveIdentity(){if(state.identity)return state.identity;state.identity=await window.UFC_APP_PROFILE?.resolve?.().catch(()=>null)||await window.UFC_PLAY_PROFILE?.resolve?.().catch(()=>null)||null;return state.identity;}
  function canonicalMe(group,identity){const members=group?.members||[];const id=identity?.member?.id||group?.me?.id;const name=normalize(identity?.member?.display_name||group?.me?.display_name);return members.find(member=>id&&member.id===id)||members.find(member=>normalize(member.display_name)===name)||group?.me||null;}
  function canonicalRank(group,member){const members=group?.members||[];const index=members.findIndex(row=>row.id===member?.id||normalize(row.display_name)===normalize(member?.display_name));return index>=0?tieLabel(members,index):'—';}
  function seasonMainRecord(records){const made=records.filter(row=>row.mainMade).length;const correct=records.filter(row=>row.mainCorrect).length;return{made,correct,losses:Math.max(0,made-correct)};}

  async function loadData(force=false){
    if(state.loading&&!force)return state.loading;
    state.loading=(async()=>{
      const client=api();const identity=await resolveIdentity();const token=get(GROUP_TOKEN_KEY)||identity?.memberToken||identity?.member_token||'';if(!client||!identity||!token)return null;
      const admin=get(GROUP_ADMIN_KEY)||null;
      const [{data:group,error:groupError},{data:events,error:eventError},social]=await Promise.all([
        client.rpc('picks_group_snapshot',{p_group_code:GROUP_CODE,p_member_token:token,p_admin_token:admin}),
        client.rpc('picks_public_events'),
        client.rpc('picks_social_snapshot',{p_group_code:GROUP_CODE,p_member_token:token}).catch(()=>({data:null,error:true}))
      ]);
      if(groupError||eventError||!group?.group||!Array.isArray(events))return null;
      const eventMap=new Map(events.map(event=>[event.id,event]));
      const completed=(group.events||[]).filter(row=>{const event=eventMap.get(row.event_id);return row.room_code&&event&&completeEvent(event);});
      const roomRows=await Promise.all(completed.map(async row=>{const {data,error}=await client.rpc('picks_room_snapshot',{p_room_code:row.room_code,p_member_token:token});return error||!data?.room?null:{event:eventMap.get(row.event_id),snapshot:data};}));
      const records=roomRows.filter(Boolean).map(item=>eventRecord(item.event,item.snapshot,identity)).filter(Boolean).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const me=canonicalMe(group,identity);const main=seasonMainRecord(records);
      const upcoming=events.filter(event=>!completeEvent(event)&&new Date(eventDate(event)).getTime()>=Date.now()-3600000).sort((a,b)=>new Date(eventDate(a))-new Date(eventDate(b)))[0]||null;
      state.social=social?.data?.group?social.data:null;
      state.data={identity,group,me,rank:canonicalRank(group,me),records,main,upcoming,year:currentYear()};
      renderAll();window.dispatchEvent(new CustomEvent('ufc-picks-season-updated',{detail:state.data}));return state.data;
    })().finally(()=>{state.loading=null;});
    return state.loading;
  }

  function bestFinish(records){if(!records.length)return'—';const values=records.map(row=>Number(String(row.place).replace(/\D/g,''))).filter(Boolean);if(!values.length)return'—';const best=Math.min(...values);return records.some(row=>row.place===`T-${best}`)?`T-${best}`:`#${best}`;}
  function summaryMarkup(data){const me=data.me||{};const made=num(me.picks_made);const correct=num(me.correct);const losses=Math.max(0,made-correct);const accuracy=Number.isFinite(Number(me.accuracy))?num(me.accuracy):(made?Math.round(correct/made*100):0);return`<section id="picksSeasonSummary" class="picks-season-summary"><header class="picks-season-summary-head"><div><span>${data.year} PICKS SEASON</span><strong>Your season</strong><small>${num(me.points)} points · ${num(me.event_wins)} event win${num(me.event_wins)===1?'':'s'} · Best finish ${bestFinish(data.records)}</small></div><div class="picks-season-summary-rank"><b>${esc(data.rank)}</b><em>GOAT26 RANK</em></div></header><div class="picks-season-summary-grid"><div><span>SEASON RECORD</span><strong>${correct}-${losses}</strong><small>${made} graded picks</small></div><div><span>ACCURACY</span><strong>${accuracy}%</strong><small>${correct}/${made} correct</small></div><div><span>MAIN EVENTS</span><strong>${data.main.correct}-${data.main.losses}</strong><small>${data.main.made} graded</small></div><div><span>UNDERDOG HITS</span><strong>${data.records.reduce((sum,row)=>sum+row.underdogHits,0)}</strong><small>${data.records.reduce((sum,row)=>sum+row.lockHits,0)} lock bonus hit${data.records.reduce((sum,row)=>sum+row.lockHits,0)===1?'':'s'}</small></div></div></section>`;}
  function scoringCopy(data){const points=num(data.group?.season?.correct_points)||4;return`Current events use ${points} points per correct pick, plus the Underdog Lock bonus. UFC 329 used the previous scoring format. The same group continues every event.`;}

  function patchCanonicalHome(data){
    document.getElementById('picksSeasonHub')?.remove();document.querySelector('#picksHomeCompact .picks-home-profile')?.remove();document.getElementById('picksProfileShell')?.setAttribute('hidden','');
    const members=data.group?.members||[];const rows=[...document.querySelectorAll('#picksHomeCompact .picks-group-member,#picksGroupContent .picks-group-member')];
    rows.forEach((row,index)=>{const label=members[index]?tieLabel(members,index):'';const rank=row.querySelector(':scope > span');if(rank&&label&&rank.textContent!==label)rank.textContent=label;row.classList.toggle('leader',Boolean(label&&label.endsWith('1')));});
    const topKey=members[0]?tieKey(members[0]):'';const leaders=members.filter(member=>tieKey(member)===topKey).map(member=>member.display_name);
    const summary=document.querySelector('#picksGroupCard > summary b');const summaryText=`${data.group?.season?.name||'Season'} · ${leaders.length?`${leaders.join(' & ')} lead`:'No leader yet'}`;if(summary&&summary.textContent!==summaryText)summary.textContent=summaryText;
    const copy=scoringCopy(data);const homeCopy=document.querySelector('#picksHomeCompact .picks-home-leaderboard > p');const sourceCopy=document.querySelector('#picksGroupContent .picks-group-top p');if(homeCopy&&homeCopy.textContent!==copy)homeCopy.textContent=copy;if(sourceCopy&&sourceCopy.textContent!==copy)sourceCopy.textContent=copy;
    document.getElementById('picksHomeCompact')?.setAttribute('data-season-ready','true');
  }

  function ensureSummary(){const data=state.data;if(!data)return;const compact=document.getElementById('picksHomeCompact');const home=document.getElementById('picksHomeContent');if(!compact&&!home)return;document.getElementById('picksSeasonSummary')?.remove();const holder=document.createElement('div');holder.innerHTML=summaryMarkup(data);const node=holder.firstElementChild;const leaderboard=compact?.querySelector('.picks-home-leaderboard');if(leaderboard)leaderboard.insertAdjacentElement('beforebegin',node);else(home||compact).prepend(node);patchCanonicalHome(data);}
  function visibleFights(event){const fights=Array.isArray(event?.fights)?event.fights:[];if(normalize(event?.cardRule)==='main card only')return fights.filter(fight=>['main card','co main event','main event'].includes(normalize(fight.cardSection)));return fights;}
  function nextLock(event){return visibleFights(event).filter(fight=>new Date(fight.lockAt).getTime()>Date.now()).sort((a,b)=>new Date(a.lockAt)-new Date(b.lockAt))[0]||null;}
  function remainingLabel(value){const left=Math.max(0,new Date(value).getTime()-Date.now());const h=Math.floor(left/3600000);const m=Math.floor((left%3600000)/60000);return h?`${h}h ${String(m).padStart(2,'0')}m`:`${m}m`;}
  function reminderMarkup(data){const event=data.upcoming;if(!event)return'';const lock=nextLock(event);const enabled=Boolean(state.social?.me?.reminder_opt_in);return`<section id="picksSeasonReminder" class="picks-season-reminder"><div><span>UPCOMING LOCK</span><strong>${esc(event.name)}${lock?` · ${esc(lock.red)} vs. ${esc(lock.blue)}`:''}</strong><small>${lock?`Locks ${esc(formatDate(lock.lockAt,true))} · ${remainingLabel(lock.lockAt)} remaining`:`Card starts ${esc(formatDate(eventDate(event),true))}`}</small></div><div class="picks-season-reminder-actions"><label><input type="checkbox" data-picks-season-reminder ${enabled?'checked':''}> REMIND ME</label><button type="button" data-picks-season-calendar>ADD TO PHONE</button></div></section>`;}
  function ensureReminder(){const data=state.data;const eventContent=document.getElementById('picksEventContent');const picker=document.getElementById('picksEventPicker');if(!data||!eventContent)return;document.getElementById('picksSeasonReminder')?.remove();const holder=document.createElement('div');holder.innerHTML=reminderMarkup(data);const node=holder.firstElementChild;if(!node)return;if(picker&&picker.parentElement===eventContent)picker.insertAdjacentElement('beforebegin',node);else eventContent.prepend(node);}

  function currentRecord(){const data=state.data;if(!data)return null;const eventId=new URL(location.href).searchParams.get('event');const room=text(new URL(location.href).searchParams.get('room')).toUpperCase();return data.records.find(row=>eventId&&row.eventId===eventId)||data.records.find(row=>room&&row.roomCode===room)||null;}
  function ensurePersonalRecap(){const recap=document.getElementById('picksEventRecap');const row=currentRecord();if(!recap||recap.hidden||!row)return;let node=recap.querySelector('[data-picks-season-personal-recap]');if(!node){node=document.createElement('section');node.className='picks-season-personal-recap';node.dataset.picksSeasonPersonalRecap='true';recap.prepend(node);}const signature=[row.eventId,row.place,row.points,row.correct,row.made,row.mainCorrect,row.underdogHits,row.lockHits,state.data.rank].join('|');if(node.dataset.signature===signature)return;node.dataset.signature=signature;node.innerHTML=`<span>YOUR EVENT</span><h4>${esc(row.place)} · ${row.points} points</h4><p>${row.correct}/${row.made} correct · ${row.accuracy}% accuracy · Season rank ${esc(state.data.rank)}</p><div class="picks-season-personal-grid"><div><span>FINISH</span><strong>${esc(row.place)}</strong></div><div><span>MAIN EVENT</span><strong>${row.mainMade?(row.mainCorrect?'HIT':'MISS'):'—'}</strong></div><div><span>UNDERDOGS</span><strong>${row.underdogHits}</strong></div><div><span>LOCK BONUS</span><strong>${row.lockHits}</strong></div></div>`;}
  function ensureProfileAction(){const overlay=document.querySelector('.profile-activity-overlay');if(!overlay||!state.data)return;const card=[...overlay.querySelectorAll('.profile-activity-card')].find(node=>node.querySelector('.profile-activity-card-head strong')?.textContent.trim()==='Season Activity');if(!card)return;let button=card.querySelector('[data-open-picks-season]');if(!button){button=document.createElement('button');button.type='button';button.className='profile-picks-season-action';button.dataset.openPicksSeason='true';button.textContent='OPEN PICKS SEASON';card.appendChild(button);}const metric=card.querySelector('.profile-activity-card-head small');if(metric)metric.textContent=`${state.data.rank} in GOAT26 · ${state.data.main.correct}-${state.data.main.losses} main events`;}
  function renderAll(){installStyles();watchTargets();if(!state.data)return;patchCanonicalHome(state.data);ensureSummary();ensureReminder();ensurePersonalRecap();ensureProfileAction();updateCountdown();}
  function updateCountdown(){const node=document.querySelector('#picksSeasonReminder small');if(!state.data?.upcoming||!node)return;const lock=nextLock(state.data.upcoming);node.textContent=lock?`Locks ${formatDate(lock.lockAt,true)} · ${remainingLabel(lock.lockAt)} remaining`:`Card starts ${formatDate(eventDate(state.data.upcoming),true)}`;}

  function escapeIcs(value){return String(value||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
  function icsDate(date){return new Date(date).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');}
  function addCalendar(event){if(!event)return;const start=new Date(eventDate(event));const end=new Date(start.getTime()+6*3600000);const url=new URL(location.href);url.searchParams.set('group',GROUP_CODE);url.searchParams.set('picksView','event');url.hash='picks';const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Octagon HQ Picks//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${escapeIcs(event.id)}@octagon-hq`,`DTSTAMP:${icsDate(new Date())}`,`DTSTART:${icsDate(start)}`,`DTEND:${icsDate(end)}`,`SUMMARY:${escapeIcs(`${event.name} — Make Picks`)}`,`DESCRIPTION:${escapeIcs(`Lock in your UFC picks: ${url}`)}`,`URL:${escapeIcs(url)}`,'BEGIN:VALARM','TRIGGER:-PT8H','ACTION:DISPLAY',`DESCRIPTION:${escapeIcs(`${event.name} is today. Lock in your picks.`)}`,'END:VALARM','BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY',`DESCRIPTION:${escapeIcs(`${event.name} starts in one hour.`)}`,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');const blob=new Blob([content],{type:'text/calendar;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`${event.id||'ufc-picks'}.ics`;document.body.appendChild(link);link.click();const href=link.href;link.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);toast('Phone reminders added');}
  async function toggleReminder(input){const client=api();const token=get(GROUP_TOKEN_KEY)||state.data?.identity?.memberToken||'';if(!client||!token){input.checked=!input.checked;toast('Open your shared profile first');return;}if(input.checked&&'Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission();}catch(_error){}}const avatar=state.social?.me?.avatar_key||'gloves';const {error}=await client.rpc('picks_social_update_profile',{p_group_code:GROUP_CODE,p_member_token:token,p_avatar_key:avatar,p_reminder_opt_in:Boolean(input.checked)});if(error){input.checked=!input.checked;toast(error.message||'Reminder preference was not saved');return;}if(state.social?.me)state.social.me.reminder_opt_in=Boolean(input.checked);toast(input.checked?'Picks reminders enabled':'Picks reminders disabled');}
  function openSeason(){window.UFC_APP_SHELL?.activateDestination?.('picks')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('picks');setTimeout(()=>{window.UFCPicksNavigation?.setRoute?.('home',{updateUrl:true,scroll:false});setTimeout(()=>document.getElementById('picksSeasonSummary')?.scrollIntoView({behavior:'smooth',block:'center'}),120);},140);}

  function bind(){
    if(state.bound)return;state.bound=true;
    window.addEventListener('octagon-hq:view-change',event=>{if(event.detail?.destination==='picks')loadData();});
    window.addEventListener('picks:routechange',event=>{if(!state.data)loadData();else if(event.detail?.route==='home'||event.detail?.route==='event')setTimeout(renderAll,40);});
    ['ufc-play-profile-ready','ufc-app-profile-updated'].forEach(name=>window.addEventListener(name,event=>{state.identity=event.detail?.identity||event.detail||state.identity;loadData(true);}));
    document.addEventListener('click',event=>{if(event.target.closest?.('.app-profile-chip')){setTimeout(()=>state.data?ensureProfileAction():loadData(),220);return;}if(event.target.closest?.('[data-picks-season-calendar]')){addCalendar(state.data?.upcoming);return;}if(event.target.closest?.('[data-open-picks-season]')){openSeason();return;}});
    document.addEventListener('change',event=>{const input=event.target.closest?.('[data-picks-season-reminder]');if(input)toggleReminder(input);});
    state.timer=setInterval(updateCountdown,30000);
  }
  function watchTargets(){
    const group=document.getElementById('picksGroupContent');
    if(group&&group!==state.groupTarget){state.groupObserver?.disconnect();state.groupTarget=group;state.groupObserver=new MutationObserver(()=>{clearTimeout(watchTargets.groupTimer);watchTargets.groupTimer=setTimeout(()=>{if(state.data)renderAll();},70);});state.groupObserver.observe(group,{childList:true,subtree:true});}
    const recap=document.getElementById('picksEventRecap');
    if(recap&&recap!==state.recapTarget){state.recapObserver?.disconnect();state.recapTarget=recap;state.recapObserver=new MutationObserver(()=>{clearTimeout(watchTargets.recapTimer);watchTargets.recapTimer=setTimeout(()=>{if(state.data)ensurePersonalRecap();},70);});state.recapObserver.observe(recap,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});}
  }
  function start(){installStyles();bind();document.getElementById('picksSeasonHub')?.remove();watchTargets();[120,500,1200].forEach(delay=>setTimeout(watchTargets,delay));if(document.getElementById('picks')?.classList.contains('active-view'))loadData();}

  window.UFC_PICKS_SEASON_LOOP={version:VERSION,refresh:()=>loadData(true),open:openSeason,get data(){return state.data;}};
  document.documentElement.setAttribute('data-picks-season-loop',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();