(function(){
  'use strict';

  const VERSION='home-dashboard-20260717b-corrections';
  const home=document.getElementById('home');
  if(!home)return;

  let refreshTimer=0;
  let boardLoading=false;
  let lastMarkup='';
  let spotlightCache=null;
  let spotlightDay='';

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
  const getLocal=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const setLocal=(key,value)=>{try{localStorage.setItem(key,String(value));}catch(_error){}};

  function centralDateKey(date=new Date()){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return date.toISOString().slice(0,10);}
  }

  function formatDailyDate(key){
    try{
      const date=new Date(`${key}T12:00:00-05:00`);
      return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(date).toUpperCase();
    }catch(_error){return key;}
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

  function dailyChallenge(){
    const challenge=window.UFC_PLAY_HUB?.dailyChallenge;
    if(challenge?.id)return challenge;
    const day=centralDateKey();
    return{
      id:'find-leader',
      title:'Find the Leader',
      description:'Ten UFC fighters. Eliminate nine without accidentally eliminating the verified stat leader.',
      details:['10 FIGHTERS','SAME BOARD TODAY','OFFICIAL LEADERBOARD'],
      maxScore:10,
      challengeKey:`find-leader:${day}`,
      challengeDay:day
    };
  }

  function dailyStorageKey(){return `ufc-home:daily:${dailyChallenge().challengeKey}`;}

  function storeDailyResult(result={}){
    if(!result.completed)return false;
    writeJson(dailyStorageKey(),{
      completed:true,
      score:Number(result.score)||0,
      total:Number(result.total)||Number(dailyChallenge().maxScore)||10,
      completedAt:result.completedAt||new Date().toISOString()
    });
    return true;
  }

  function captureDailyCompletion(){
    const hubResult=window.UFC_PLAY_HUB?.dailyResult;
    if(hubResult?.completed)return storeDailyResult(hubResult);
    const challenge=dailyChallenge();
    if(challenge.id==='find-leader'){
      const state=window.UFC_FIND_LEADER?.state;
      if(state?.daily&&state.phase==='complete'){
        return storeDailyResult({completed:true,score:state.score,total:challenge.maxScore});
      }
    }
    return false;
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

  function normalizeCardSection(value){
    return text(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  }

  function eventState(){
    const event=preferredEvent();
    if(!event)return{event:null,fights:[],picks:{},picked:0,total:0,main:null};
    const fights=Array.isArray(event.fights)?event.fights:[];
    const picks=readJson(`ufc-picks:${event.id}:local-picks`,{});
    const picked=fights.filter(fight=>text(picks[fight.id])).length;
    const main=fights.find(fight=>normalizeCardSection(fight.cardSection)==='main event')||fights[fights.length-1]||null;
    return{event,fights,picks,picked,total:fights.length,main};
  }

  function productionReady(){
    return window.UFC_SCORING_PIPELINE?.status==='ready'||document.documentElement.getAttribute('data-scoring-pipeline')==='ready';
  }

  function officialRows(){
    const data=window.RANKING_DATA||{};
    const men=Array.isArray(data.men)?data.men:[];
    const women=Array.isArray(data.women)?data.women:[];
    return[
      ...men.map(row=>({...row,spotlightBoard:'men'})),
      ...women.map(row=>({...row,spotlightBoard:'women'}))
    ].filter(row=>text(row?.fighter)&&Number.isFinite(Number(row?.rank)));
  }

  function profileFor(name){
    const target=text(name).toLowerCase();
    return (window.RANKING_DATA?.fighters||[]).find(row=>text(row?.fighter).toLowerCase()===target)||null;
  }

  function fighterRecord(row){
    return text(row?.visibleStats?.ufcRecord||row?.ufcRecord||profileFor(row?.fighter)?.ufcRecord);
  }

  function fighterDivision(row){
    const profile=profileFor(row?.fighter)||{};
    return text(row?.primaryDivision||profile.primaryDivision||window.DISPLAY_OVERRIDES?.[row?.fighter]?.divisionLabel);
  }

  function fighterOvr(row){
    const value=Number(row?.overallOvr);
    if(Number.isFinite(value))return Math.round(value);
    try{
      const calculated=window.overallOvr?.({...profileFor(row?.fighter),...row});
      return Number.isFinite(Number(calculated))?Math.round(Number(calculated)):null;
    }catch(_error){return null;}
  }

  function seededIndex(value,length){
    let seed=2166136261;
    for(const char of String(value)){seed^=char.charCodeAt(0);seed=Math.imul(seed,16777619);}
    return length?Math.abs(seed>>>0)%length:0;
  }

  function watchDataFor(name){
    const override=window.DISPLAY_OVERRIDES?.[name]||{};
    const registry=window.UFC_ROYCE_WATCH_LINKS?.watchLinks?.[name]||{};
    const playRow=window.UFC_PLAY_DATA?.resolve?.(name)||null;
    const watchUrl=text(override.watchUrl||registry.watchUrl||playRow?.watchUrl);
    if(watchUrl)return{url:watchUrl,label:text(override.watchLabel||registry.watchLabel||'Watch Moment')||'Watch Moment'};
    const signatureUrl=text(override.signatureFightUrl||registry.signatureFightUrl||playRow?.signatureFightUrl);
    if(signatureUrl)return{url:signatureUrl,label:text(override.signatureFightLabel||registry.signatureFightLabel||'Watch Signature Fight')||'Watch Signature Fight'};
    return null;
  }

  function spotlightFighter(){
    if(!productionReady())return null;
    const day=centralDateKey();
    if(spotlightCache&&spotlightDay===day)return spotlightCache;
    const rows=officialRows().sort((a,b)=>a.spotlightBoard.localeCompare(b.spotlightBoard)||Number(a.rank)-Number(b.rank)||a.fighter.localeCompare(b.fighter));
    if(!rows.length)return null;
    const storageKey=`ufc-home:spotlight:${day}`;
    const storedName=getLocal(storageKey);
    let row=rows.find(item=>item.fighter===storedName)||null;
    if(!row){
      row=rows[seededIndex(day,rows.length)];
      setLocal(storageKey,row.fighter);
    }
    const profile=profileFor(row.fighter)||{};
    const override=window.DISPLAY_OVERRIDES?.[row.fighter]||{};
    spotlightDay=day;
    spotlightCache={
      ...profile,
      ...row,
      photo:text(override.thumbUrl||override.photoUrl),
      oneLiner:text(override.oneLiner),
      ovr:fighterOvr(row),
      watch:watchDataFor(row.fighter)
    };
    return spotlightCache;
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
    const challenge=dailyChallenge();
    const result=dailyState();
    const completed=Boolean(result.completed);
    const total=Number(result.total)||Number(challenge.maxScore)||10;
    const status=completed?`COMPLETED · ${Number(result.score)||0}/${total}`:'NOT PLAYED';
    const details=Array.isArray(challenge.details)&&challenge.details.length?challenge.details:['10 FIGHTERS','SAME BOARD TODAY','OFFICIAL LEADERBOARD'];
    return`<section class="home-dashboard-card home-daily">
      <div class="home-daily-copy">
        <div class="home-dashboard-kicker"><span>TODAY'S CHALLENGE</span><span>${esc(formatDailyDate(challenge.challengeDay||centralDateKey()))}</span></div>
        <h2>${esc(challenge.title||'Find the Leader')}</h2>
        <p>${esc(challenge.description||'Eliminate the non-leaders and leave the verified stat leader standing.')}</p>
        <div class="home-daily-meta"><span class="home-daily-pill${completed?' complete':''}">${esc(status)}</span>${details.map(item=>`<span class="home-daily-pill">${esc(item)}</span>`).join('')}</div>
        <button type="button" class="home-dashboard-action" data-home-action="daily">${completed?'PLAY AGAIN':'PLAY NOW'} →</button>
      </div>
      <div class="home-daily-visual" aria-hidden="true"><div class="home-daily-target"><span>#1</span><strong>?</strong><small>10 → 1</small></div><em>LEAVE THE LEADER STANDING</em></div>
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
    if(!fighter)return`<section class="home-dashboard-card home-spotlight home-spotlight-loading"><div class="home-dashboard-empty">Finalizing today’s ranking spotlight.</div></section>`;
    const rank=Number(fighter.rank);
    const rankLabel=fighter.spotlightBoard==='women'?`#${rank} WOMEN'S`:`#${rank} ALL-TIME`;
    const meta=[Number.isFinite(rank)&&rank>0?rankLabel:'',fighterDivision(fighter),fighterRecord(fighter),fighter.ovr?`${fighter.ovr} OVR`:''].filter(Boolean);
    return`<section class="home-dashboard-card home-spotlight">
      <div class="home-spotlight-photo">${fighter.photo?`<img src="${esc(fighter.photo)}" alt="${esc(fighter.fighter)}">`:`<span>${esc(initials(fighter.fighter))}</span>`}</div>
      <div class="home-spotlight-copy"><div class="home-dashboard-kicker"><span>RANKING SPOTLIGHT</span></div><h3>${esc(fighter.fighter)}</h3><div class="home-spotlight-meta">${meta.map(item=>`<span>${esc(item)}</span>`).join('<span>·</span>')}</div>${fighter.oneLiner?`<p>${esc(fighter.oneLiner)}</p>`:''}</div>
      <div class="home-spotlight-actions">${fighter.watch?`<a class="home-dashboard-action home-watch-action" href="${esc(fighter.watch.url)}" target="_blank" rel="noopener noreferrer">${esc(fighter.watch.label).toUpperCase()} →</a>`:''}<button type="button" class="home-dashboard-action secondary" data-home-action="spotlight" data-fighter="${esc(fighter.fighter)}">VIEW PROFILE →</button></div>
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

  function openProfileDirect(fighter){
    const drawer=document.getElementById('drawer');
    document.body.classList.add('home-profile-open');
    let opened=false;
    if(typeof window.openFighter==='function'){
      window.openFighter(fighter);
      opened=true;
    }else{
      const target=text(fighter).toLowerCase();
      const row=[...document.querySelectorAll('#menList [data-fighter],#womenList [data-fighter],#divisionList [data-fighter]')].find(item=>text(item.dataset.fighter).toLowerCase()===target);
      if(row){row.click();opened=true;}
    }
    window.setTimeout(()=>{
      if(!opened||!drawer?.classList.contains('open'))document.body.classList.remove('home-profile-open');
    },120);
  }

  home.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-home-action]');
    if(!button||button.disabled)return;
    const action=button.dataset.homeAction;
    if(action==='daily'){
      navigate('play');
      window.setTimeout(()=>{
        if(window.UFC_PLAY_HUB?.openDailyChallenge)window.UFC_PLAY_HUB.openDailyChallenge();
        else window.UFC_PLAY_HUB?.openGame?.(dailyChallenge().id,{daily:true});
      },80);
    }else if(action==='picks')navigate('picks');
    else if(action==='war-room')navigate('war-room');
    else if(action==='spotlight')openProfileDirect(button.dataset.fighter);
  });

  const drawer=document.getElementById('drawer');
  if(drawer){
    new MutationObserver(()=>{
      document.body.classList.toggle('home-profile-open',drawer.classList.contains('open'));
    }).observe(drawer,{attributes:true,attributeFilter:['class']});
  }

  window.addEventListener('ufc-play-game-complete',event=>{
    const detail=event.detail||{};
    const challenge=dailyChallenge();
    if(!detail.daily||detail.gameType!==challenge.id)return;
    storeDailyResult({completed:true,score:detail.score,total:detail.maxScore||challenge.maxScore});
    scheduleRender(0);
  });

  window.addEventListener('octagon-hq:view-change',event=>{
    captureDailyCompletion();
    if(event.detail?.destination==='home'){
      render();
      refreshWarRoom();
    }
  });
  ['ufc-play-hub-ready','ufc-play-daily-challenge-updated','ufc-scoring-pipeline-ready','ufc-production-ranking-ready','ufc-play-profile-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>window.addEventListener(name,()=>scheduleRender(80)));
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
  window.UFC_HOME_DASHBOARD={version:VERSION,render,refreshWarRoom,captureDailyCompletion,get spotlight(){return spotlightCache;}};
  document.documentElement.setAttribute('data-home-dashboard',VERSION);
})();