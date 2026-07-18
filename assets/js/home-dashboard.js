(function(){
  'use strict';

  const VERSION='home-dashboard-20260718a-single-renderer';
  const DAILY={
    gameType:'find-leader',
    gameVersion:'find-leader-daily-v1',
    title:'Find the Leader',
    description:'Ten UFC fighters. Eliminate nine without accidentally eliminating the verified stat leader.',
    details:['10 FIGHTERS','ONE VERIFIED LEADER','OFFICIAL LEADERBOARD'],
    maxScore:10
  };

  let renderTimer=0;
  let boardLoading=false;
  let officialLoading=false;
  let officialSyncedDay='';
  let lastMarkup='';
  let spotlightCache=null;
  let spotlightDay='';
  let bound=false;

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

  function ensureMount(){
    document.querySelectorAll('.critical-home-fallback,.architecture-home-shell,.boot-home').forEach(node=>node.remove());
    const shell=document.querySelector('main.shell');
    if(!shell)return null;
    const homes=[...shell.querySelectorAll(':scope > #home')];
    homes.slice(1).forEach(node=>node.remove());
    let home=homes[0];
    if(!home){
      home=document.createElement('section');
      home.id='home';
      home.className='view';
      shell.prepend(home);
    }
    let mount=home.querySelector('#homeDashboardMount');
    if(!mount){
      home.innerHTML='<div id="homeDashboardMount" aria-live="polite"></div>';
      mount=home.firstElementChild;
      lastMarkup='';
    }
    mount.querySelectorAll('.critical-home-fallback,.architecture-home-shell').forEach(node=>node.remove());
    return mount;
  }

  function injectStyles(){
    if(document.getElementById('homeDashboardEnhancementStyles'))return;
    const style=document.createElement('style');
    style.id='homeDashboardEnhancementStyles';
    style.textContent=`
      .home-event-breakdown{width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:14px;padding:13px 15px;border:1px solid rgba(249,115,22,.58);border-radius:14px;background:linear-gradient(105deg,rgba(180,55,39,.92),rgba(16,24,40,.98));color:#fff;text-align:left;cursor:pointer;box-shadow:0 10px 24px rgba(15,23,42,.12)}
      .home-event-breakdown span{display:grid;gap:4px}.home-event-breakdown b{color:#fed7aa;font:950 9px/1 system-ui;letter-spacing:.14em}.home-event-breakdown strong{color:#fff;font:900 13px/1.15 system-ui}.home-event-breakdown i{color:#fed7aa;font:400 29px/1 system-ui;font-style:normal}.home-event-breakdown:active{transform:translateY(1px)}
      @media(max-width:760px){.home-event-breakdown{padding:12px 14px}.home-event-breakdown strong{font-size:12px}}
    `;
    document.head.appendChild(style);
  }

  function centralDay(date=new Date()){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return date.toISOString().slice(0,10);}
  }

  function dailyDateLabel(day){
    try{return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(new Date(`${day}T12:00:00-05:00`)).toUpperCase();}
    catch(_error){return day;}
  }

  function eventDateLabel(value){
    if(!value)return'Date TBD';
    try{return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));}
    catch(_error){return'Date TBD';}
  }

  function navigate(destination){
    if(window.UFC_APP_SHELL?.activateDestination)return window.UFC_APP_SHELL.activateDestination(destination);
    if(window.UFC_PRODUCT_ARCHITECTURE?.activateDestination)return window.UFC_PRODUCT_ARCHITECTURE.activateDestination(destination);
    document.querySelector(`[data-destination="${destination}"]`)?.click();
    return true;
  }

  function challenge(){
    const day=centralDay();
    const hub=window.UFC_PLAY_HUB?.dailyChallenge;
    return{day:text(hub?.challengeDay)||day,key:text(hub?.challengeKey)||`find-leader:${day}`};
  }

  function dailyStorageKey(day=challenge().day){return`ufc-play:daily-completion:find-leader:${day}`;}
  function legacyStorageKey(key=challenge().key){return`ufc-home:daily:${key}`;}

  function storeDaily(result={},day=challenge().day){
    if(!result.completed)return false;
    writeJson(dailyStorageKey(day),{
      completed:true,
      gameType:'find-leader',
      score:Number.isFinite(Number(result.score))?Number(result.score):0,
      total:Number(result.total)||DAILY.maxScore,
      completedAt:result.completedAt||new Date().toISOString()
    });
    return true;
  }

  function captureDaily(){
    const current=challenge();
    const hub=window.UFC_PLAY_HUB?.dailyResult;
    if(hub?.completed)return storeDaily(hub,current.day);
    const state=window.UFC_FIND_LEADER?.state;
    if(state?.daily&&state.phase==='complete')return storeDaily({completed:true,score:state.score,total:DAILY.maxScore},current.day);
    return false;
  }

  function dailyState(){
    captureDaily();
    const current=challenge();
    const saved=readJson(dailyStorageKey(current.day),null);
    if(saved?.completed)return saved;
    const legacy=readJson(legacyStorageKey(current.key),null);
    if(legacy?.completed){storeDaily(legacy,current.day);return legacy;}
    return{};
  }

  async function syncOfficialDaily(force=false){
    const current=challenge();
    if(!force&&(officialLoading||officialSyncedDay===current.day||dailyState().completed))return false;
    const shared=window.UFC_PLAY_SHARED;
    if(!shared?.client||!shared?.dailyContext)return false;
    officialLoading=true;
    try{
      const context=await shared.dailyContext(DAILY.gameType,DAILY.gameVersion,DAILY.maxScore);
      const identity=await shared.resolveIdentity?.().catch(()=>null);
      const name=text(identity?.member?.display_name).toLowerCase();
      if(!name)return false;
      const {data,error}=await shared.client.rpc('play_daily_leaderboard',{
        p_game_type:DAILY.gameType,
        p_challenge_day:context?.challenge_day||current.day,
        p_limit:100
      });
      if(error||!data?.ok)return false;
      const row=(Array.isArray(data.rows)?data.rows:[]).find(item=>text(item?.display_name).toLowerCase()===name);
      if(!row)return false;
      const day=text(context?.challenge_day)||current.day;
      storeDaily({completed:true,score:Number(row.official_score)||0,total:Number(row.max_score)||DAILY.maxScore,completedAt:row.completed_at||row.updated_at},day);
      officialSyncedDay=current.day;
      scheduleRender(0);
      return true;
    }catch(_error){return false;}
    finally{officialLoading=false;}
  }

  function preferredEvent(){
    const events=Array.isArray(window.UFC_PICKS_EVENTS)?window.UFC_PICKS_EVENTS:[];
    if(!events.length)return null;
    const now=Date.now();
    return events.find(event=>event?.status==='live')
      ||events.filter(event=>event?.status==='upcoming'||new Date(event?.eventDate).getTime()>=now).sort((a,b)=>new Date(a.eventDate)-new Date(b.eventDate))[0]
      ||events[0];
  }

  function eventState(){
    const event=preferredEvent();
    if(!event)return{event:null,fights:[],picks:{},picked:0,total:0,main:null,hasBreakdown:false};
    const fights=Array.isArray(event.fights)?event.fights:[];
    const picks=readJson(`ufc-picks:${event.id}:local-picks`,{});
    const picked=fights.filter(fight=>text(picks[fight.id])).length;
    const normalize=value=>text(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    const main=fights.find(fight=>normalize(fight.cardSection)==='main event')||fights[fights.length-1]||null;
    const hasBreakdown=Boolean(main?.id&&window.UFC_PICKS_MATCHUP_SPOTLIGHT?.has?.(main.id));
    return{event,fights,picks,picked,total:fights.length,main,hasBreakdown};
  }

  function productionReady(){
    return window.UFC_SCORING_PIPELINE?.status==='ready'||document.documentElement.getAttribute('data-scoring-pipeline')==='ready';
  }

  function profileFor(name){
    const target=text(name).toLowerCase();
    return(window.RANKING_DATA?.fighters||[]).find(row=>text(row?.fighter).toLowerCase()===target)||{};
  }

  function spotlightRows(){
    const data=window.RANKING_DATA||{};
    return[
      ...(Array.isArray(data.men)?data.men:[]).map(row=>({...row,spotlightBoard:'men'})),
      ...(Array.isArray(data.women)?data.women:[]).map(row=>({...row,spotlightBoard:'women'}))
    ].filter(row=>text(row?.fighter)&&Number.isFinite(Number(row?.rank)));
  }

  function seededIndex(value,length){
    let seed=2166136261;
    for(const char of String(value)){seed^=char.charCodeAt(0);seed=Math.imul(seed,16777619);}
    return length?Math.abs(seed>>>0)%length:0;
  }

  function watchData(name){
    const override=window.DISPLAY_OVERRIDES?.[name]||{};
    const registry=window.UFC_ROYCE_WATCH_LINKS?.watchLinks?.[name]||{};
    const play=window.UFC_PLAY_DATA?.resolve?.(name)||{};
    const url=text(override.watchUrl||registry.watchUrl||play.watchUrl||override.signatureFightUrl||registry.signatureFightUrl||play.signatureFightUrl);
    if(!url)return null;
    return{url,label:text(override.watchLabel||registry.watchLabel||override.signatureFightLabel||registry.signatureFightLabel||'Watch Moment')||'Watch Moment'};
  }

  function spotlight(){
    if(!productionReady())return null;
    const day=centralDay();
    if(spotlightCache&&spotlightDay===day)return spotlightCache;
    const rows=spotlightRows().sort((a,b)=>a.spotlightBoard.localeCompare(b.spotlightBoard)||Number(a.rank)-Number(b.rank)||a.fighter.localeCompare(b.fighter));
    if(!rows.length)return null;
    const key=`ufc-home:spotlight:${day}`;
    let row=rows.find(item=>item.fighter===getLocal(key));
    if(!row){row=rows[seededIndex(day,rows.length)];setLocal(key,row.fighter);}
    const profile=profileFor(row.fighter);
    const override=window.DISPLAY_OVERRIDES?.[row.fighter]||{};
    let ovr=Number(row.overallOvr);
    if(!Number.isFinite(ovr)){
      try{ovr=Number(window.overallOvr?.({...profile,...row}));}catch(_error){ovr=NaN;}
    }
    spotlightDay=day;
    spotlightCache={
      ...profile,...row,
      photo:text(override.thumbUrl||override.photoUrl),
      oneLiner:text(override.oneLiner),
      division:text(row.primaryDivision||profile.primaryDivision||override.divisionLabel),
      record:text(row.visibleStats?.ufcRecord||row.ufcRecord||profile.ufcRecord),
      ovr:Number.isFinite(ovr)?Math.round(ovr):null,
      watch:watchData(row.fighter)
    };
    return spotlightCache;
  }

  function initials(value){return text(value).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';}

  function recentWarMembers(){
    const messages=Array.isArray(window.UFC_OCTAGON_BOARD?.snapshot?.messages)?window.UFC_OCTAGON_BOARD.snapshot.messages:[];
    const seen=new Set();
    const members=[];
    [...messages].sort((a,b)=>new Date(b?.created_at)-new Date(a?.created_at)).forEach(message=>{
      const author=message?.author||{};
      const key=text(author.id||author.display_name).toLowerCase();
      if(!key||seen.has(key)||members.length>=2)return;
      seen.add(key);members.push(author);
    });
    return members;
  }

  function memberAvatar(member,index){
    if(!member)return`<span class="home-war-avatar" aria-hidden="true"><span>${index===0?'U':'FC'}</span></span>`;
    const slug=text(member.fighter_avatar_slug).toLowerCase();
    const fighter=slug?(window.UFC_PLAY_DATA?.byId?.[slug]||window.UFC_PLAY_DATA?.resolve?.(slug)):null;
    const photo=text(fighter?.thumbUrl||fighter?.profileUrl||window.DISPLAY_OVERRIDES?.[fighter?.name]?.thumbUrl||window.DISPLAY_OVERRIDES?.[fighter?.name]?.photoUrl);
    return`<span class="home-war-avatar" title="${esc(fighter?.name||member.display_name||'War Room member')}">${photo?`<img src="${esc(photo)}" alt="">`:`<span>${esc(initials(member.display_name))}</span>`}</span>`;
  }

  function dailyMarkup(){
    const current=challenge();
    const result=dailyState();
    const completed=Boolean(result.completed);
    const total=Number(result.total)||DAILY.maxScore;
    const status=completed?`COMPLETED · ${Number(result.score)||0}/${total}`:'NOT PLAYED';
    return`<section class="home-dashboard-card home-daily">
      <div class="home-daily-copy">
        <div class="home-dashboard-kicker"><span>TODAY'S CHALLENGE</span><span>${esc(dailyDateLabel(current.day))}</span></div>
        <h2>${DAILY.title}</h2><p>${DAILY.description}</p>
        <div class="home-daily-meta"><span class="home-daily-pill${completed?' complete':''}">${esc(status)}</span>${DAILY.details.map(item=>`<span class="home-daily-pill">${item}</span>`).join('')}</div>
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
      <h3>${esc(state.event.name)}</h3><div class="home-event-matchup">${esc(state.event.subtitle||'')}</div><div class="home-event-date">${esc(eventDateLabel(state.event.eventDate))}</div>
      ${state.main?`<div class="home-event-main"><span>MAIN EVENT</span><strong>${esc(state.main.red)} vs. ${esc(state.main.blue)}</strong></div>`:''}
      ${state.hasBreakdown?`<button type="button" class="home-event-breakdown" data-home-action="matchup" data-fight-id="${esc(state.main.id)}"><span><b>FIGHT SPOTLIGHT</b><strong>View matchup breakdown</strong></span><i aria-hidden="true">›</i></button>`:''}
      <div class="home-event-progress"><div class="home-event-progress-head"><span>YOUR PICKS</span><strong>${state.picked} OF ${state.total}</strong></div><div class="home-event-track"><i style="width:${percent}%"></i></div></div>
      <button type="button" class="home-dashboard-action secondary" data-home-action="picks">${action} →</button>
    </section>`;
  }

  function warMarkup(){
    const members=recentWarMembers();
    const unread=Math.max(0,Number(window.UFC_OCTAGON_NOTIFICATIONS?.unread)||0);
    const button=document.querySelector('[data-destination="war-room"]');
    const disabled=Boolean(button?.disabled||button?.getAttribute('aria-disabled')==='true');
    return`<section class="home-dashboard-card home-war-room"><div class="home-dashboard-kicker"><span>THE WAR ROOM</span></div><div class="home-war-room-body"><div class="home-war-avatars">${memberAvatar(members[0],0)}${memberAvatar(members[1],1)}</div><div class="home-war-count"><strong>${unread}</strong><span>notification${unread===1?'':'s'}</span></div></div><button type="button" class="home-dashboard-action" data-home-action="war-room" ${disabled?'disabled':''}>JOIN CONVERSATION →</button></section>`;
  }

  function spotlightMarkup(){
    const fighter=spotlight();
    if(!fighter)return`<section class="home-dashboard-card home-spotlight home-spotlight-loading"><div class="home-dashboard-empty">Finalizing today’s ranking spotlight.</div></section>`;
    const rank=Number(fighter.rank);
    const rankLabel=fighter.spotlightBoard==='women'?`#${rank} WOMEN'S`:`#${rank} ALL-TIME`;
    const meta=[rankLabel,fighter.division,fighter.record,fighter.ovr?`${fighter.ovr} OVR`:''].filter(Boolean);
    return`<section class="home-dashboard-card home-spotlight"><div class="home-spotlight-photo">${fighter.photo?`<img src="${esc(fighter.photo)}" alt="${esc(fighter.fighter)}">`:`<span>${esc(initials(fighter.fighter))}</span>`}</div><div class="home-spotlight-copy"><div class="home-dashboard-kicker"><span>RANKING SPOTLIGHT</span></div><h3>${esc(fighter.fighter)}</h3><div class="home-spotlight-meta">${meta.map(item=>`<span>${esc(item)}</span>`).join('<span>·</span>')}</div>${fighter.oneLiner?`<p>${esc(fighter.oneLiner)}</p>`:''}</div><div class="home-spotlight-actions">${fighter.watch?`<a class="home-dashboard-action home-watch-action" href="${esc(fighter.watch.url)}" target="_blank" rel="noopener noreferrer">${esc(fighter.watch.label).toUpperCase()} →</a>`:''}<button type="button" class="home-dashboard-action secondary" data-home-action="spotlight" data-fighter="${esc(fighter.fighter)}">VIEW PROFILE →</button></div></section>`;
  }

  function render(){
    const mount=ensureMount();
    if(!mount)return;
    const markup=`<div class="home-dashboard">${dailyMarkup()}${eventMarkup()}${warMarkup()}${spotlightMarkup()}</div>`;
    if(markup===lastMarkup&&mount.firstElementChild?.classList.contains('home-dashboard'))return;
    lastMarkup=markup;
    mount.innerHTML=markup;
    document.documentElement.setAttribute('data-home-dashboard',VERSION);
  }

  function scheduleRender(delay=50){
    clearTimeout(renderTimer);
    renderTimer=setTimeout(()=>requestAnimationFrame(render),delay);
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
    finally{boardLoading=false;scheduleRender(0);}
  }

  function openProfile(name){
    if(typeof window.openFighter==='function'){window.openFighter(name);return;}
    const target=text(name).toLowerCase();
    [...document.querySelectorAll('[data-fighter]')].find(node=>text(node.dataset.fighter).toLowerCase()===target)?.click();
  }

  function bind(){
    if(bound)return;
    bound=true;
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('#home [data-home-action]');
      if(!button||button.disabled)return;
      const action=button.dataset.homeAction;
      if(action==='daily'){
        navigate('play');
        setTimeout(()=>window.UFC_PLAY_HUB?.openDailyChallenge?.(),80);
      }else if(action==='picks')navigate('picks');
      else if(action==='war-room')navigate('war-room');
      else if(action==='matchup')window.UFC_PICKS_MATCHUP_SPOTLIGHT?.open?.(button.dataset.fightId,button);
      else if(action==='spotlight')openProfile(button.dataset.fighter);
    });

    window.addEventListener('ufc-play-game-complete',event=>{
      const detail=event.detail||{};
      if(detail.daily&&detail.gameType==='find-leader'){
        storeDaily({completed:true,score:detail.score,total:detail.maxScore||DAILY.maxScore});
        scheduleRender(0);
      }
    });
    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination==='home'){
        scheduleRender(0);
        setTimeout(()=>syncOfficialDaily(),40);
        setTimeout(()=>refreshWarRoom(),100);
      }
    });
    ['ufc-play-hub-ready','ufc-play-shared-ready','ufc-play-profile-ready','ufc-picks-matchup-spotlight-ready','ufc-scoring-pipeline-ready','ufc-production-ranking-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>window.addEventListener(name,()=>{
      scheduleRender(30);
      if(name==='ufc-play-shared-ready'||name==='ufc-play-profile-ready')setTimeout(()=>syncOfficialDaily(true),50);
    }));
    window.addEventListener('storage',()=>scheduleRender(30));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){scheduleRender(30);setTimeout(()=>syncOfficialDaily(),70);}});
  }

  injectStyles();
  bind();
  render();
  setTimeout(()=>syncOfficialDaily(),150);
  setTimeout(()=>refreshWarRoom(),220);

  window.UFC_HOME_DASHBOARD={
    version:VERSION,
    render,
    refreshWarRoom,
    captureDaily,
    syncOfficialDaily,
    get daily(){return challenge();},
    get spotlight(){return spotlightCache;}
  };
})();