(function(){
  'use strict';

  const VERSION='play-daily-rotation-20260716c-card-order-swipe';
  const ORDER=['find-leader','keep-cut','better-than','blind','blind-rank','top10'];
  const ROTATION=[
    {
      id:'find-leader',gameType:'find-leader',gameVersion:'find-leader-daily-v1',maxScore:10,
      title:'Find the Leader',description:'Eliminate nine fighters without removing the verified stat leader. One fatal pick ends the run.',
      details:['10 FIGHTERS','ONE VERIFIED LEADER','OFFICIAL LEADERBOARD'],visual:'leader'
    },
    {
      id:'blind',gameType:'blind-resume',gameVersion:'blind-resume-daily-v2',maxScore:5,
      title:'Blind Resume',description:'Five anonymous UFC careers. Pick the stronger resume each round and finish with one official score.',
      details:['5 MATCHUPS','SAME LINEUP TODAY','OFFICIAL LEADERBOARD'],visual:'blind'
    }
  ];
  let opening=false;
  let currentContext=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function centralDay(date=new Date()){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return date.toISOString().slice(0,10);}
  }

  function dayNumber(day){
    const [year,month,date]=String(day||centralDay()).split('-').map(Number);
    return Math.floor(Date.UTC(year,month-1,date)/86400000);
  }

  function dailyFor(day=centralDay()){
    return ROTATION[Math.abs(dayNumber(day))%ROTATION.length];
  }

  function dateLabel(day){
    try{return new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(new Date(`${day}T12:00:00-05:00`)).toUpperCase();}
    catch(_error){return day;}
  }

  function waitFor(check,timeout=18000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{
        const value=check();
        if(value){resolve(value);return;}
        if(Date.now()-started>timeout){reject(new Error('Daily Challenge tools did not finish loading.'));return;}
        setTimeout(tick,80);
      };
      tick();
    });
  }

  function titleFor(id){
    return ({'find-leader':'Find the Leader','keep-cut':'Keep 4, Cut 4','better-than':'Better Than…','blind':'Blind Resume','blind-rank':'Blind Rank 5','top10':'Build Your Top 10'})[id]||'';
  }

  function cardFor(id){
    const hub=document.getElementById('playHub');
    if(!hub)return null;
    return hub.querySelector(`.play-game-card[data-open-game="${id}"]`)
      || [...hub.querySelectorAll('.play-game-card')].find(card=>card.querySelector('.play-game-copy strong')?.textContent.trim()===titleFor(id))
      || null;
  }

  function repairDailyCard(){
    const hub=document.getElementById('playHub');
    const card=hub?.querySelector('.play-daily-card');
    if(!hub||!card)return;
    hub.querySelectorAll('.play-daily-button,[data-daily-board-open]').forEach(node=>node.remove());
    hub.querySelectorAll('.play-daily-actions').forEach(node=>{if(!node.children.length)node.remove();});
  }

  function makeLive(card,id){
    if(!card)return;
    card.classList.remove('is-coming');
    card.classList.add('is-live');
    card.removeAttribute('data-coming-game');
    card.dataset.openGame=id;
    const status=card.querySelector('.play-game-card-top em');
    const action=card.querySelector('.play-game-action');
    if(status)status.textContent='PLAY NOW';
    if(action)action.textContent='OPEN GAME →';
  }

  function reorderGames(){
    repairDailyCard();
    const grid=document.querySelector('#playHub .play-game-grid');
    if(!grid)return false;
    ORDER.forEach(id=>{
      const card=cardFor(id);
      makeLive(card,id);
      if(card)grid.appendChild(card);
    });
    [...grid.children].forEach(child=>{if(!child.classList?.contains('play-game-card'))child.remove();});
    const api=window.UFC_PLAY_HUB;
    if(Array.isArray(api?.games)){
      const rows=new Map(api.games.map(game=>[game.id,game]));
      const ordered=ORDER.map(id=>rows.get(id)).filter(Boolean);
      api.games.splice(0,api.games.length,...ordered);
    }
    document.documentElement.setAttribute('data-play-game-order',ORDER.join('|'));
    return true;
  }

  function dailyVisual(daily){
    if(daily.visual==='leader')return '<span class="play-daily-fighter">10</span><strong>→</strong><span class="play-daily-fighter">1</span><small>LEAVE THE LEADER</small>';
    return '<span class="play-daily-fighter">A</span><strong>VS</strong><span class="play-daily-fighter">B</span><small>WHO RANKS HIGHER?</small>';
  }

  function updateDailyCard(context=null){
    const day=String(context?.challenge_day||centralDay());
    const daily=dailyFor(day);
    currentContext=context&&context.game_type===daily.gameType?context:null;
    const card=document.querySelector('#playHub .play-daily-card');
    if(!card)return false;
    repairDailyCard();
    const date=card.querySelector('#playDailyDate');
    const title=card.querySelector('#playDailyTitle');
    const copy=card.querySelector('.play-daily-copy>p');
    const details=card.querySelector('.play-daily-details');
    const visual=card.querySelector('.play-daily-visual');
    if(date)date.textContent=dateLabel(day);
    if(title)title.textContent=daily.title;
    if(copy)copy.textContent=daily.description;
    if(details)details.innerHTML=daily.details.map(item=>`<span>${esc(item)}</span>`).join('');
    if(visual)visual.innerHTML=dailyVisual(daily);
    let hint=card.querySelector('.play-daily-swipe-hint');
    if(!hint){
      hint=document.createElement('span');
      hint.className='play-daily-swipe-hint';
      card.appendChild(hint);
    }
    hint.textContent='TAP TO PLAY · SWIPE FOR LEADERBOARD →';
    card.dataset.dailyGame=daily.gameType;
    card.dataset.dailyRotationCard='true';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label',`Play today's ${daily.title}. Swipe right for today's leaderboard.`);
    document.documentElement.setAttribute('data-daily-game',daily.gameType);
    bindDailyCard(card);
    window.dispatchEvent(new CustomEvent('ufc-play-daily-rotation-ready',{detail:{day,daily,context:currentContext}}));
    return true;
  }

  async function contextForCurrent(){
    const shared=await waitFor(()=>window.UFC_PLAY_SHARED?.dailyContext?window.UFC_PLAY_SHARED:null);
    const daily=dailyFor();
    const context=await shared.dailyContext(daily.gameType,daily.gameVersion,daily.maxScore);
    currentContext=context;
    updateDailyCard(context);
    return {shared,daily,context};
  }

  function openFindLeaderDaily(setup,context){
    const play=document.getElementById('play');
    const hub=document.getElementById('playHub');
    const shell=play?.querySelector('.play-shell');
    const nav=document.getElementById('playGameNav');
    if(!play||!hub||!shell||!nav)return false;
    hub.hidden=true;
    shell.hidden=false;
    nav.hidden=false;
    play.classList.add('play-game-active');
    const eyebrow=document.getElementById('playGameEyebrow');
    const title=document.getElementById('playGameTitle');
    const subtitle=play.querySelector('.section-title p');
    if(eyebrow)eyebrow.textContent="TODAY'S CHALLENGE";
    if(title)title.textContent='Daily Find the Leader';
    if(subtitle)subtitle.textContent='Everyone gets the same verified question, ten fighters, and tile order today.';
    window.UFC_BETTER_THAN?.close?.();
    window.UFC_BLIND_RANK?.close?.();
    window.UFC_KEEP_CUT?.close?.();
    document.getElementById('playTop10Panel')?.setAttribute('hidden','');
    document.getElementById('playBlindPanel')?.setAttribute('hidden','');
    window.UFC_FIND_LEADER.open({daily:true,setup,context});
    document.documentElement.setAttribute('data-play-screen','daily-find-leader');
    nav.scrollIntoView({block:'start'});
    return true;
  }

  async function openDaily(){
    if(opening)return;
    opening=true;
    try{
      const {daily,context}=await contextForCurrent();
      if(daily.id==='find-leader'){
        const game=await waitFor(()=>window.UFC_FIND_LEADER?.dailySetup?window.UFC_FIND_LEADER:null);
        const setup=game.dailySetup(context);
        if(!setup)throw new Error('Today’s Find the Leader board could not be built.');
        openFindLeaderDaily(setup,context);
        return;
      }
      window.UFC_PLAY_HUB?.openGame?.('blind',{daily:true});
    }catch(error){
      const notice=document.getElementById('playHubNotice');
      if(notice){notice.textContent=String(error?.message||'Today’s Challenge could not open.');notice.hidden=false;}
    }finally{opening=false;}
  }

  function bindDailyCard(card){
    if(!card||card.dataset.dailyTapBound===VERSION)return;
    card.dataset.dailyTapBound=VERSION;
    let start=null;
    card.addEventListener('pointerdown',event=>{start={x:event.clientX,y:event.clientY};});
    card.addEventListener('pointercancel',()=>{start=null;});
    card.addEventListener('pointerup',event=>{
      if(!start)return;
      const distance=Math.hypot(event.clientX-start.x,event.clientY-start.y);
      start=null;
      if(distance<=10)openDaily();
    });
    card.addEventListener('keydown',event=>{
      if(event.key!=='Enter'&&event.key!==' ')return;
      event.preventDefault();
      openDaily();
    });
  }

  async function install(){
    try{
      await waitFor(()=>document.querySelector('#playHub .play-game-grid')&&window.UFC_PLAY_HUB);
      reorderGames();
      updateDailyCard();
      contextForCurrent().catch(()=>undefined);
      window.addEventListener('ufc-play-hub-ready',()=>{reorderGames();updateDailyCard(currentContext);});
      window.UFC_PLAY_DAILY_ROTATION={version:VERSION,order:[...ORDER],rotation:ROTATION.map(row=>({...row})),centralDay,dailyFor,get currentContext(){return currentContext;},contextForCurrent,openDaily,reorderGames,updateDailyCard};
      document.documentElement.setAttribute('data-play-daily-rotation',VERSION);
    }catch(error){console.error(error);}
  }

  install();
})();