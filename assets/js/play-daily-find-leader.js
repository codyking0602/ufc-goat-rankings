(function(){
  'use strict';

  const VERSION='play-daily-find-leader-20260717a';
  const DAILY={
    id:'find-leader',
    gameType:'find-leader',
    gameVersion:'find-leader-daily-v1',
    maxScore:10,
    scored:true,
    title:'Find the Leader',
    description:'Eliminate nine fighters without removing today\'s verified stat leader.',
    details:['DAILY VERIFIED STAT','10 FIGHTERS','OFFICIAL LEADERBOARD'],
    visual:'leader'
  };
  let opening=false;
  let refreshTimer=0;
  let pointerStart=null;
  let setupCache=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function centralDay(){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return new Date().toISOString().slice(0,10);}
  }

  function dateLabel(day){
    try{return new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(new Date(`${day}T12:00:00-05:00`)).toUpperCase();}
    catch(_error){return String(day||'');}
  }

  function dayNumber(day){
    const [year,month,date]=String(day||centralDay()).split('-').map(Number);
    return Math.floor(Date.UTC(year,month-1,date)/86400000);
  }

  function dayFromNumber(number){return new Date(number*86400000).toISOString().slice(0,10);}

  function patchFindLeaderSchedule(){
    const game=window.UFC_FIND_LEADER;
    const bank=window.UFC_FIND_LEADER_QUESTION_BANK;
    if(!game||!bank?.daily)return false;
    game.dailySetup=context=>{
      const actualDay=String(context?.challenge_day||centralDay());
      const anchor=String(bank.dailyRules?.anchor||'2026-07-16');
      const gap=Math.max(1,Number(bank.dailyRules?.gameGapDays)||1);
      const offset=Math.max(0,dayNumber(actualDay)-dayNumber(anchor));
      const scheduleDay=dayFromNumber(dayNumber(anchor)+(offset*gap));
      return bank.daily({...context,challenge_day:scheduleDay});
    };
    game.everydayDailyVersion=VERSION;
    document.documentElement.setAttribute('data-find-leader-daily-schedule',`${bank.version}-everyday`);
    return true;
  }

  function waitFor(check,timeout=16000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{
        const value=check();
        if(value){resolve(value);return;}
        if(Date.now()-started>timeout){reject(new Error('Find the Leader tools did not finish loading.'));return;}
        setTimeout(tick,80);
      };
      tick();
    });
  }

  async function contextForCurrent(){
    const shared=await waitFor(()=>window.UFC_PLAY_SHARED?.dailyContext?window.UFC_PLAY_SHARED:null);
    const context=await shared.dailyContext(DAILY.gameType,DAILY.gameVersion,DAILY.maxScore);
    return {shared,daily:{...DAILY},context};
  }

  async function setupFor(context){
    const day=String(context?.challenge_day||centralDay());
    const key=`${day}|${context?.seed||context?.challenge_key||''}`;
    if(setupCache?.key===key)return setupCache.setup;
    const game=await waitFor(()=>window.UFC_FIND_LEADER?.dailySetup?window.UFC_FIND_LEADER:null);
    patchFindLeaderSchedule();
    const setup=game.dailySetup(context);
    if(!setup)throw new Error('Today\'s Find the Leader board could not be built.');
    setupCache={key,setup};
    return setup;
  }

  function categoryLabel(setup){
    return String(setup?.statLabel||setup?.shortLabel||'Verified UFC stat');
  }

  function patchApi(){
    patchFindLeaderSchedule();
    const api=window.UFC_PLAY_DAILY_ROTATION;
    if(!api)return false;
    api.version=VERSION;
    api.dailyFor=()=>({...DAILY});
    api.rotation=[{...DAILY}];
    api.contextForCurrent=contextForCurrent;
    api.openDaily=openDaily;
    api.updateDailyCard=(context)=>refreshCard(context);
    document.documentElement.setAttribute('data-play-daily-rotation',VERSION);
    document.documentElement.setAttribute('data-daily-game',DAILY.gameType);
    return true;
  }

  function updateCard(context,setup){
    const card=document.querySelector('#playHub .play-daily-card');
    if(!card)return false;
    const day=String(context?.challenge_day||centralDay());
    card.classList.add('play-daily-find-leader-compact');
    card.dataset.dailyGame=DAILY.gameType;
    card.dataset.dailyRotationCard='true';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label',`Play today's Find the Leader. Today's category is ${categoryLabel(setup)}. Swipe for today's leaderboard.`);

    const date=card.querySelector('#playDailyDate');
    const title=card.querySelector('#playDailyTitle');
    const copy=card.querySelector('.play-daily-copy>p');
    const details=card.querySelector('.play-daily-details');
    const visual=card.querySelector('.play-daily-visual');
    if(date)date.textContent=dateLabel(day);
    if(title)title.textContent=DAILY.title;
    if(copy)copy.textContent=DAILY.description;
    if(details){
      details.classList.add('play-daily-category');
      details.innerHTML=`<span>TODAY'S CATEGORY</span><strong>${esc(categoryLabel(setup))}</strong>`;
    }
    if(visual)visual.innerHTML='<span class="play-daily-fighter">10</span><strong>→</strong><span class="play-daily-fighter">1</span><small>LEAVE THE LEADER</small>';
    card.querySelectorAll('.play-daily-button,.play-daily-actions').forEach(node=>node.remove());
    let hint=card.querySelector('.play-daily-swipe-hint');
    if(!hint){hint=document.createElement('span');hint.className='play-daily-swipe-hint';card.appendChild(hint);}
    hint.textContent='TAP TO PLAY · SWIPE FOR LEADERBOARD →';
    return true;
  }

  async function refreshCard(context=null){
    if(!patchApi())return false;
    try{
      const resolved=context?{context}:{...(await contextForCurrent())};
      const setup=await setupFor(resolved.context);
      updateCard(resolved.context,setup);
      window.UFC_DAILY_LEADERBOARD?.refresh?.();
      return true;
    }catch(error){
      console.error(error);
      updateCard(context||{challenge_day:centralDay()},null);
      return false;
    }
  }

  function scheduleRefresh(delay=80){
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(()=>refreshCard(),delay);
  }

  async function openDaily(){
    if(opening)return;
    opening=true;
    try{
      patchApi();
      const {context}=await contextForCurrent();
      const setup=await setupFor(context);
      const game=await waitFor(()=>window.UFC_FIND_LEADER?.open?window.UFC_FIND_LEADER:null);
      const play=document.getElementById('play');
      const hub=document.getElementById('playHub');
      const shell=play?.querySelector('.play-shell');
      const nav=document.getElementById('playGameNav');
      if(!play||!hub||!shell||!nav)return;

      hub.hidden=true;
      shell.hidden=false;
      nav.hidden=false;
      play.classList.add('play-game-active');
      window.UFC_BETTER_THAN?.close?.();
      window.UFC_BLIND_RANK?.close?.();
      window.UFC_KEEP_CUT?.close?.();
      document.getElementById('playTop10Panel')?.setAttribute('hidden','');
      document.getElementById('playBlindPanel')?.setAttribute('hidden','');
      game.open({daily:true,setup,context});

      const eyebrow=document.getElementById('playGameEyebrow');
      const title=document.getElementById('playGameTitle');
      const subtitle=document.querySelector('#play .section-title p');
      if(eyebrow)eyebrow.textContent="TODAY'S CHALLENGE";
      if(title)title.textContent='Daily Find the Leader';
      if(subtitle)subtitle.textContent=`Today's verified category: ${categoryLabel(setup)}.`;
      document.documentElement.setAttribute('data-play-screen','daily-find-leader');
      nav.scrollIntoView({block:'start'});
    }catch(error){
      const notice=document.getElementById('playHubNotice');
      if(notice){notice.textContent=String(error?.message||'Today\'s Challenge could not open.');notice.hidden=false;}
    }finally{opening=false;}
  }

  function injectStyles(){
    if(document.getElementById('play-daily-find-leader-css'))return;
    const style=document.createElement('style');
    style.id='play-daily-find-leader-css';
    style.textContent=`
      #play .play-daily-card.play-daily-find-leader-compact{grid-template-columns:minmax(0,1fr) 180px;min-height:220px;gap:18px;padding:20px 22px 24px}
      #play .play-daily-find-leader-compact .play-daily-kicker{margin-bottom:10px}
      #play .play-daily-find-leader-compact .play-daily-copy h3{font-size:clamp(32px,4vw,48px);line-height:.95}
      #play .play-daily-find-leader-compact .play-daily-copy>p{max-width:620px;margin-top:9px;font-size:13px;line-height:1.4}
      #play .play-daily-find-leader-compact .play-daily-details.play-daily-category{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:8px;margin-top:13px}
      #play .play-daily-find-leader-compact .play-daily-category span{border:0;background:transparent;padding:0;color:#fbbf24;font-size:8px;letter-spacing:.11em}
      #play .play-daily-find-leader-compact .play-daily-category strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;font-size:12px;line-height:1.2}
      #play .play-daily-find-leader-compact .play-daily-visual{min-height:132px;padding:12px;border-radius:18px}
      #play .play-daily-find-leader-compact .play-daily-fighter{width:54px;height:68px;border-radius:13px;font-size:30px}
      #play .play-daily-find-leader-compact .play-daily-visual strong{font-size:18px}
      #play .play-daily-find-leader-compact .play-daily-visual small{font-size:8px}
      #play .play-daily-find-leader-compact .play-daily-button{display:none!important}
      @media(max-width:900px){
        #play .play-daily-card.play-daily-find-leader-compact{grid-template-columns:minmax(0,1fr) 150px}
      }
      @media(max-width:620px){
        #play .play-daily-card.play-daily-find-leader-compact{grid-template-columns:1fr;min-height:0;gap:9px;padding:15px 13px 24px}
        #play .play-daily-find-leader-compact .play-daily-kicker{margin-bottom:8px}
        #play .play-daily-find-leader-compact .play-daily-copy h3{font-size:31px}
        #play .play-daily-find-leader-compact .play-daily-copy>p{margin-top:7px;font-size:11px;line-height:1.35}
        #play .play-daily-find-leader-compact .play-daily-details.play-daily-category{margin-top:9px}
        #play .play-daily-find-leader-compact .play-daily-category strong{font-size:10px}
        #play .play-daily-find-leader-compact .play-daily-visual{min-height:62px;padding:7px 14px;border-radius:14px}
        #play .play-daily-find-leader-compact .play-daily-fighter{width:38px;height:44px;border-radius:9px;font-size:22px}
        #play .play-daily-find-leader-compact .play-daily-visual strong{font-size:14px}
        #play .play-daily-find-leader-compact .play-daily-visual small{font-size:7px}
      }
    `;
    document.head.appendChild(style);
  }

  function bind(){
    injectStyles();
    document.addEventListener('pointerdown',event=>{
      if(!event.target.closest?.('.play-daily-card'))return;
      pointerStart={x:event.clientX,y:event.clientY};
    },true);
    document.addEventListener('pointercancel',()=>{pointerStart=null;},true);
    document.addEventListener('pointerup',event=>{
      const card=event.target.closest?.('.play-daily-card');
      if(!card||!pointerStart)return;
      const distance=Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y);
      pointerStart=null;
      if(distance>10)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDaily();
    },true);
    document.addEventListener('keydown',event=>{
      if((event.key!=='Enter'&&event.key!==' ')||!event.target.closest?.('.play-daily-card'))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDaily();
    },true);

    const observer=new MutationObserver(()=>{
      const card=document.querySelector('#playHub .play-daily-card');
      const title=card?.querySelector('#playDailyTitle')?.textContent.trim();
      if(card&&(!card.classList.contains('play-daily-find-leader-compact')||title!==DAILY.title))scheduleRefresh(20);
    });
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});

    window.addEventListener('ufc-play-hub-ready',()=>scheduleRefresh(40));
    window.addEventListener('ufc-play-daily-rotation-ready',()=>scheduleRefresh(40));
    window.addEventListener('ufc-scoring-pipeline-ready',()=>scheduleRefresh(80));
    [0,220,800,1800].forEach(delay=>setTimeout(()=>scheduleRefresh(0),delay));
    document.documentElement.setAttribute('data-play-daily-find-leader',VERSION);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
