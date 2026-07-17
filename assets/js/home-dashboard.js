(function(){
  'use strict';

  const VERSION='home-dashboard-20260717a';
  const home=document.getElementById('home');
  if(!home)return;

  let refreshTimer=0;
  let boardLoading=false;
  let lastMarkup='';

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const readJson=(key,fallback={})=>{
    try{
      const value=JSON.parse(localStorage.getItem(key)||'null');
      return value&&typeof value==='object'?value:fallback;
    }catch(_error){return fallback;}
  };
  const writeJson=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch(_error){}};

  function centralDateKey(date=new Date()){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return date.toISOString().slice(0,10);}
  }

  function formatEventDate(value){
    if(!value)return'Date TBD';
    try{
      return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
    }catch(_error){return'Date TBD';}
  }

  function navigate(destination){
    const api=window.UFC_PRODUCT_ARCHITECTURE;
    if(api?.activateDestination){api.activateDestination(destination);return true;}
    document.querySelector(`[data-destination="${destination}"]`)?.click();
    return true;
  }

  function dailyKey(){
    return text(window.UFC_PLAY_HUB?.dailyKey)||`blind-resume:${centralDateKey()}`;
  }

  function dailyStorageKey(){return `ufc-home:daily:${dailyKey()}`;}

  function captureDailyCompletion(){
    const state=window.UFC_BLIND_MATCHMAKING?.state;
    const dailyScreen=document.documentElement.getAttribute('data-play-screen')==='daily-blind';
    if(!dailyScreen||!state?.finalVisible)return false;
    const result={
      completed:true,
      score:Number(state.score)||0,
      total:Number(window.UFC_BLIND_MATCHMAKING?.totalRounds)||5,
      completedAt:new Date().toISOString()
    };
    writeJson(dailyStorageKey(),result);
    return true;
  }

  function dailyState(){
    captureDailyCompletion();
    return readJson(dailyStorageKey(),{});
  }

  function preferredEvent(){
    const events=Array.isArray(window.UFC_PICKS_EVENTS)?window.UFC_PICKS_EVENTS:[];
    if(!events.length)return null;
    const now=Date.now();
    const live=events.find(event=>event?.status==='live');
    if(live)return live;
    const upcoming=events
      .filter(event=>event?.status==='upcoming'||new Date(event?.eventDate).getTime()>=now)
      .sort((a,b)=>new Date(a.eventDate).getTime()-new Date(b.eventDate).getTime());
    return upcoming[0]||events[0]||null;
  }

  function eventState(){
    const event=preferredEvent();
    if(!event)return{event:null,fights:[],picks:{},picked:0,total:0,main:null};
    const fights=Array.isArray(event.fights)?event.fights:[];
    const picks=readJson(`ufc-picks:${event.id}:local-picks`,{});
    const picked=fights.filter(fight=>text(picks[fight.id])).length;
    const main=fights.find(fight=>/main event/i.test(text(fight.cardSection)))||fights[fights.length-1]||null;
    return{event,fights,picks,picked,total:fights.length,main};
  }

  function fighterRecord(row){
    return text(row?.visibleStats?.ufcRecord||row?.ufcRecord);
  }

  function fighterDivision(row){
    return text(row?.primaryDivision||window.DISPLAY_OVERRIDES?.[row?.fighter]?.divisionLabel);
  }

  function fighterOvr(row){
    const override=window.DISPLAY_OVERRIDES?.[row?.fighter]||{};
    const values=[row?.ovr,row?.overallOvr,row?.frontEndOvr,override.ovr,override.overallOvr,override.frontEndOvr];
    const value=values.map(Number).find(Number.isFinite);
    if(Number.isFinite(value))return Math.round(value);
    try{
      const calculated=window.overallOvr?.(row);
      return Number.isFinite(Number(calculated))?Math.round(Number(calculated)):null;
    }catch(_error){return null;}
  }

  function spotlightFighter(){
    const data=window.RANKING_DATA||{};
    const rows=[...(Array.isArray(data.men)?data.men:[]),...(Array.isArray(data.women)?data.women:[])].filter(row=>text(row?.fighter));
    if(!rows.length)return null;
    const key=centralDateKey();
    let seed=0;
    for(const char of key)seed=(seed*31+char.charCodeAt(0))>>>0;
    const row=rows[seed%rows.length];
    const override=window.DISPLAY_OVERRIDES?.[row.fighter]||{};
    return{
      ...row,
      photo:text(override.thumbUrl||override.photoUrl),
      oneLiner:text(override.oneLiner),
      ovr:fighterOvr(row)
    };
  }

  function initials(value){
    return text(value).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';
  }

  function fighterAvatarFor(member){
    const slug=text(member?.fighter_avatar_slug);
    const fighter=slug?(window.UFC_PLAY_DATA?.byId?.[slug.toLowerCase()]||window.UFC_PLAY_DATA?.resolve?.(slug)):null;
    const photo=text(fighter?.thumbUrl||fighter?.profileUrl||window.DISPLAY_OVERRIDES?.[fighter?.name]?.thumbUrl||window.DISPLAY_OVERRIDES?.[fighter?.name]?.photoUrl);
    return{photo,label:text(fighter?.name||member?.display_name),initials:initials(member?.display_name)};
  }

  function recentWarRoomMembers(){
    const messages=Array.isArray(window.UFC_OCTAGON_BOARD?.snapshot?.messages)?window.UFC_OCTAGON_BOARD.snapshot.messages:[];
    const seen=new Set();
    const members=[];
    [...messages].sort((a,b)=>new Date(b?.created_at).getTime()-new Date(a?.created_at).getTime()).forEach(message=>{
      const author=message?.author||{};
      const key=text(author.id||author.display_name).toLowerCase();
      if(!key||seen.has(key)||members.length>=2)return;
      seen.add(key);
      members.push(author);
    });
    return members;
  }

  function avatarMarkup(member,index){
    if(!member)return`<span class="home-war-avatar" aria-hidden="true"><span>${index===0?'U':'FC'}</span></span>`;
    const avatar=fighterAvatarFor(member);
    return`<span class="home-war-avatar" title="${esc(avatar.label||member.display_name||'War Room member')}">${avatar.photo?`<img src="${esc(avatar.photo)}" alt="">`:`<span>${esc(avatar.initials)}</span>`}</span>`;
  }

  function dailyMarkup(){
    const result=dailyState();
    const completed=Boolean(result.completed);
    const status=completed?`COMPLETED · ${Number(result.score)||0}/${Number(result.total)||5}`:'NOT PLAYED';
    return`<section class="home-dashboard-card home-daily">
      <div class="home-daily-copy">
        <div class="home-dashboard-kicker"><span>TODAY'S CHALLENGE</span><span>${esc(centralDateKey())}</span></div>
        <h2>Blind Resume</h2>
        <p>Five anonymous UFC careers. Pick the stronger resume each round and finish with one score.</p>
        <div class="home-daily-meta"><span class="home-daily-pill${completed?' complete':''}">${esc(status)}</span><span class="home-daily-pill">5 MATCHUPS</span><span class="home-daily-pill">SAME LINEUP TODAY</span></div>
        <button type="button" class="home-dashboard-action" data-home-action="daily">${completed?'PLAY AGAIN':'PLAY NOW'} →</button>
      </div>
      <div class="home-daily-visual" aria-hidden="true"><div class="home-daily-versus"><span class="home-daily-fighter">A</span><strong>VS</strong><span class="home-daily-fighter">B</span></div><small>WHO RANKS HIGHER?</small></div>
    </section>`;
  }

  function eventMarkup(){
    const state=eventState();
    if(!state.event)return`<section class="home-dashboard-card home-event"><div class="home-dashboard-kicker"><span>NEXT UFC EVENT</span></div><div class="home-dashboard-empty">No upcoming event is loaded.</div></section>`;
    const percent=state.total?Math.round((state.picked/state.total)*100):0;
    const action=state.picked>=state.total&&state.total?'REVIEW PICKS':state.picked?'FINISH PICKS':'MAKE PICKS';
    return`<section class="home-dashboard-card home-event">
      <div class="home-dashboard-kicker"><span>NEXT UFC EVENT</span><span>${esc(state.event.status==='live'?'LIVE':'UPCOMING')}</span></div>
      <h3>${esc(state.event.name)}</h3>
      <div class="home-event-matchup">${esc(state.event.subtitle||'')}</div>
      <div class="home-event-date">${esc(formatEventDate(state.event.eventDate))}</div>
      ${state.main?`<div class="home-event-main"><span>MAIN EVENT</span><strong>${esc(state.main.red)} vs. ${esc(state.main.blue)}</strong></div>`:''}
      <div class="home-event-progress"><div class="home-event-progress-head"><span>YOUR PICKS</span><strong>${state.picked} OF ${state.total}</strong></div><div class="home-event-track"><i style="width:${percent}%"></i></div></div>
      <button type="button" class="home-dashboard-action secondary" data-home-action="picks">${action} →</button>
    </section>`;
  }

  function warRoomMarkup(){
    const members=recentWarRoomMembers();
    const unread=Math.max(0,Number(window.UFC_OCTAGON_NOTIFICATIONS?.unread)||0);
    const button=document.querySelector('[data-destination="war-room"]');
    const disabled=Boolean(button?.disabled||button?.getAttribute('aria-disabled')==='true');
    return`<section class="home-dashboard-card home-war-room">
      <div class="home-dashboard-kicker"><span>THE WAR ROOM</span></div>
      <div class="home-war-room-body"><div class="home-war-avatars">${avatarMarkup(members[0],0)}${avatarMarkup(members[1],1)}</div><div class="home-war-count"><strong>${unread}</strong><span>notification${unread===1?'':'s'}</span></div></div>
      <button type="button" class="home-dashboard-action" data-home-action="war-room" ${disabled?'disabled':''}>JOIN CONVERSATION →</button>
    </section>`;
  }

  function spotlightMarkup(){
    const fighter=spotlightFighter();
    if(!fighter)return`<section class="home-dashboard-card home-spotlight"><div class="home-dashboard-empty">Ranking spotlight is loading.</div></section>`;
    const rank=Number(fighter.rank);
    const meta=[Number.isFinite(rank)&&rank>0?`#${rank} ALL-TIME`:'',fighterDivision(fighter),fighterRecord(fighter),fighter.ovr?`${fighter.ovr} OVR`:''].filter(Boolean);
    return`<section class="home-dashboard-card home-spotlight">
      <div class="home-spotlight-photo">${fighter.photo?`<img src="${esc(fighter.photo)}" alt="${esc(fighter.fighter)}">`:`<span>${esc(initials(fighter.fighter))}</span>`}</div>
      <div class="home-spotlight-copy"><div class="home-dashboard-kicker"><span>RANKING SPOTLIGHT</span></div><h3>${esc(fighter.fighter)}</h3><div class="home-spotlight-meta">${meta.map(item=>`<span>${esc(item)}</span>`).join('<span>·</span>')}</div>${fighter.oneLiner?`<p>${esc(fighter.oneLiner)}</p>`:''}</div>
      <button type="button" class="home-dashboard-action secondary" data-home-action="spotlight" data-fighter="${esc(fighter.fighter)}">VIEW PROFILE →</button>
    </section>`;
  }

  function render(){
    const markup=`<div class="home-dashboard">${dailyMarkup()}${eventMarkup()}${warRoomMarkup()}${spotlightMarkup()}</div>`;
    if(markup===lastMarkup)return;
    lastMarkup=markup;
    home.classList.remove('architecture-home');
    home.innerHTML=markup;
  }

  async function refreshWarRoom(){
    if(boardLoading)return;
    const button=document.querySelector('[data-destination="war-room"]');
    if(button?.disabled||button?.getAttribute('aria-disabled')==='true'){render();return;}
    boardLoading=true;
    try{
      await window.UFC_OCTAGON_NOTIFICATIONS?.refreshStatus?.();
      if(!window.UFC_OCTAGON_BOARD?.snapshot)await window.UFC_OCTAGON_BOARD?.load?.(null,{silent:true});
    }catch(_error){}
    finally{boardLoading=false;render();}
  }

  function scheduleRender(delay=60){
    window.clearTimeout(refreshTimer);
    refreshTimer=window.setTimeout(()=>{captureDailyCompletion();render();},delay);
  }

  home.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-home-action]');
    if(!button||button.disabled)return;
    const action=button.dataset.homeAction;
    if(action==='daily'){
      navigate('play');
      window.setTimeout(()=>window.UFC_PLAY_HUB?.openGame?.('blind',{daily:true}),80);
    }else if(action==='picks')navigate('picks');
    else if(action==='war-room')navigate('war-room');
    else if(action==='spotlight'){
      const fighter=button.dataset.fighter;
      navigate('rankings');
      window.setTimeout(()=>{
        if(typeof window.openFighter==='function'){window.openFighter(fighter);return;}
        const row=[...document.querySelectorAll('[data-fighter]')].find(item=>item.dataset.fighter===fighter);
        row?.click();
      },100);
    }
  });

  window.addEventListener('octagon-hq:view-change',event=>{
    captureDailyCompletion();
    if(event.detail?.destination==='home'){
      render();
      refreshWarRoom();
    }
  });
  ['ufc-play-hub-ready','ufc-scoring-pipeline-ready','ufc-play-profile-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>window.addEventListener(name,()=>scheduleRender(80)));
  window.addEventListener('storage',()=>scheduleRender(50));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleRender(80);});
  window.setInterval(()=>{
    captureDailyCompletion();
    if(home.classList.contains('active-view')){
      render();
      refreshWarRoom();
    }
  },12000);

  render();
  if(home.classList.contains('active-view'))refreshWarRoom();
  window.UFC_HOME_DASHBOARD={version:VERSION,render,refreshWarRoom,captureDailyCompletion};
  document.documentElement.setAttribute('data-home-dashboard',VERSION);
})();
