(function(){
  'use strict';

  const VERSION='play-daily-rotation-20260716d-all-six-games';
  const ORDER=['find-leader','keep-cut','better-than','blind','blind-rank','top10'];
  const ROTATION_ANCHOR='2026-07-16';
  const ROTATION=[
    {
      id:'find-leader',gameType:'find-leader',gameVersion:'find-leader-daily-v1',maxScore:10,scored:true,
      title:'Find the Leader',description:'Eliminate nine fighters without removing the verified stat leader. One fatal pick ends the run.',
      details:['10 FIGHTERS','ONE VERIFIED LEADER','OFFICIAL LEADERBOARD'],visual:'leader'
    },
    {
      id:'keep-cut',gameType:'keep-cut',gameVersion:'keep-cut-daily-v1',maxScore:1,scored:false,
      title:'Keep 4, Cut 4',description:'Everyone gets the same eight fighters and reveal order. Make four Keeps and four Cuts.',
      details:['SAME 8 FIGHTERS','LOCKED DECISIONS','COMMUNITY DEBATE'],visual:'keep-cut'
    },
    {
      id:'better-than',gameType:'better-than',gameVersion:'better-than-daily-v1',maxScore:1,scored:false,
      title:'Better Than…',description:'Everyone gets the same target fighter and debate lens. Choose your number and defend your exact list.',
      details:['SAME UFC CLAIM','YOUR NUMBER','COMMUNITY DEBATE'],visual:'better-than'
    },
    {
      id:'blind',gameType:'blind-resume',gameVersion:'blind-resume-daily-v2',maxScore:5,scored:true,
      title:'Blind Resume',description:'Five anonymous UFC careers. Pick the stronger resume each round and finish with one official score.',
      details:['5 MATCHUPS','SAME LINEUP TODAY','OFFICIAL LEADERBOARD'],visual:'blind'
    },
    {
      id:'blind-rank',gameType:'blind-rank',gameVersion:'blind-rank-daily-v1',maxScore:1,scored:false,
      title:'Blind Rank 5',description:'Everyone gets the same five fighters in the same reveal order. Every placement locks.',
      details:['SAME 5 FIGHTERS','LOCKED ORDER','COMMUNITY DEBATE'],visual:'blind-rank'
    },
    {
      id:'top10',gameType:'top10',gameVersion:'top10-daily-v1',maxScore:1,scored:false,
      title:'Build Your Top 10',description:'Build today’s UFC GOAT Top 10 from the same full ranked roster and compare it with the model.',
      details:['FULL UFC ROSTER','YOUR TOP 10','MODEL COMPARISON'],visual:'top10'
    }
  ];

  let opening=false;
  let currentContext=null;
  const nativeRandom=window.__UFC_NATIVE_RANDOM||Math.random.bind(Math);
  window.__UFC_NATIVE_RANDOM=nativeRandom;

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
    const offset=dayNumber(day)-dayNumber(ROTATION_ANCHOR);
    const index=((offset%ROTATION.length)+ROTATION.length)%ROTATION.length;
    return ROTATION[index];
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

  function hashSeed(value){
    let hash=2166136261;
    for(let index=0;index<String(value).length;index+=1){hash^=String(value).charCodeAt(index);hash=Math.imul(hash,16777619);}
    return hash>>>0;
  }

  function mulberry32(seed){
    let value=seed>>>0;
    return function(){
      value+=0x6D2B79F5;
      let next=value;
      next=Math.imul(next^(next>>>15),next|1);
      next^=next+Math.imul(next^(next>>>7),next|61);
      return((next^(next>>>14))>>>0)/4294967296;
    };
  }

  function withSeed(seed,task){
    const previous=Math.random;
    Math.random=mulberry32(hashSeed(seed));
    try{return task(Math.random);}finally{Math.random=previous||nativeRandom;}
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
      api.games.splice(0,api.games.length,...ORDER.map(id=>rows.get(id)).filter(Boolean));
    }
    document.documentElement.setAttribute('data-play-game-order',ORDER.join('|'));
    return true;
  }

  function dailyVisual(daily){
    const visuals={
      'leader':'<span class="play-daily-fighter">10</span><strong>→</strong><span class="play-daily-fighter">1</span><small>LEAVE THE LEADER</small>',
      'keep-cut':'<span class="play-daily-fighter">4</span><strong>/</strong><span class="play-daily-fighter">4</span><small>KEEP FOUR · CUT FOUR</small>',
      'better-than':'<span class="play-daily-fighter">?</span><strong>&gt;</strong><span class="play-daily-fighter">?</span><small>BUILD YOUR CLAIM</small>',
      'blind':'<span class="play-daily-fighter">A</span><strong>VS</strong><span class="play-daily-fighter">B</span><small>WHO RANKS HIGHER?</small>',
      'blind-rank':'<span class="play-daily-fighter">1</span><strong>→</strong><span class="play-daily-fighter">5</span><small>EVERY SLOT LOCKS</small>',
      'top10':'<span class="play-daily-fighter">1</span><strong>→</strong><span class="play-daily-fighter">10</span><small>BUILD YOUR LIST</small>'
    };
    return visuals[daily.visual]||visuals.blind;
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
    if(!hint){hint=document.createElement('span');hint.className='play-daily-swipe-hint';card.appendChild(hint);}
    hint.textContent=daily.scored?'TAP TO PLAY · SWIPE FOR LEADERBOARD →':'TAP TO PLAY · SWIPE FOR COMMUNITY →';
    card.dataset.dailyGame=daily.gameType;
    card.dataset.dailyRotationCard='true';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label',`Play today's ${daily.title}. Swipe for ${daily.scored?"today's leaderboard":"today's community view"}.`);
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

  function setDailyHeading(daily,subtitle){
    const eyebrow=document.getElementById('playGameEyebrow');
    const title=document.getElementById('playGameTitle');
    const copy=document.querySelector('#play .section-title p');
    if(eyebrow)eyebrow.textContent="TODAY'S CHALLENGE";
    if(title)title.textContent=`Daily ${daily.title}`;
    if(copy)copy.textContent=subtitle||'Everyone gets the same setup today.';
    document.documentElement.setAttribute('data-play-screen',`daily-${daily.id}`);
  }

  function openFindLeaderDaily(daily,setup,context){
    const play=document.getElementById('play');
    const hub=document.getElementById('playHub');
    const shell=play?.querySelector('.play-shell');
    const nav=document.getElementById('playGameNav');
    if(!play||!hub||!shell||!nav)return false;
    hub.hidden=true;shell.hidden=false;nav.hidden=false;play.classList.add('play-game-active');
    window.UFC_BETTER_THAN?.close?.();
    window.UFC_BLIND_RANK?.close?.();
    window.UFC_KEEP_CUT?.close?.();
    document.getElementById('playTop10Panel')?.setAttribute('hidden','');
    document.getElementById('playBlindPanel')?.setAttribute('hidden','');
    window.UFC_FIND_LEADER.open({daily:true,setup,context});
    setDailyHeading(daily,'Everyone gets the same verified question, ten fighters, and tile order today.');
    nav.scrollIntoView({block:'start'});
    return true;
  }

  async function openKeepCutDaily(daily,context){
    const game=await waitFor(()=>window.UFC_KEEP_CUT?.startGame?window.UFC_KEEP_CUT:null);
    withSeed(context.seed||context.challenge_key,random=>{
      const packs=game.packs||[];
      const pack=packs[Math.floor(random()*Math.max(1,packs.length))]||packs[0];
      game.startGame({packId:pack?.id||'ufc-careers'});
    });
    game.open();
    setDailyHeading(daily,'Everyone gets the same eight fighters, themed pack, and reveal order today.');
  }

  async function openBlindRankDaily(daily,context){
    const game=await waitFor(()=>window.UFC_BLIND_RANK?.startGame?window.UFC_BLIND_RANK:null);
    withSeed(context.seed||context.challenge_key,random=>{
      const packs=game.packs||[];
      const pack=packs[Math.floor(random()*Math.max(1,packs.length))]||packs[0];
      game.startGame({packId:pack?.id||'men-chaos'});
    });
    game.open();
    setDailyHeading(daily,'Everyone gets the same five fighters, themed pack, and reveal order today.');
  }

  async function openBetterThanDaily(daily,context){
    const game=await waitFor(()=>window.UFC_BETTER_THAN?.state?window.UFC_BETTER_THAN:null);
    game.open();
    const state=game.state;
    const ranked=(window.UFC_PLAY_DATA?.modelRanked||[]).filter(row=>row?.id).slice(0,40);
    const lenses=['overall','striking','boxing','kickboxing','wrestling','grappling','submissions','cardio','durability','power','ufc-resume'];
    withSeed(context.seed||context.challenge_key,random=>{
      const target=ranked[Math.floor(random()*Math.max(1,ranked.length))]||ranked[0];
      state.targetId=target?.id||state.targetId;
      state.lensId=lenses[Math.floor(random()*lenses.length)]||'overall';
    });
    state.poolId='all';
    state.claimCount=5;
    state.selected=new Set();
    state.query='';
    state.locked=false;
    game.open();
    document.querySelectorAll('#playBetterThanPanel [data-better-than-target],#playBetterThanPanel [data-better-than-lens],#playBetterThanPanel [data-better-than-pool]').forEach(node=>node.disabled=true);
    setDailyHeading(daily,'Everyone gets the same target fighter and debate lens. Your number and exact supporting list are still your call.');
  }

  async function openTop10Daily(daily){
    await window.UFC_PLAY_HUB?.openGame?.('top10');
    setDailyHeading(daily,'Everyone builds from the same complete UFC roster. Your saved list remains yours until you change it.');
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
        openFindLeaderDaily(daily,setup,context);
      }else if(daily.id==='blind'){
        await window.UFC_PLAY_HUB?.openGame?.('blind',{daily:true});
        setDailyHeading(daily,'Everyone gets the same five anonymous matchups and A/B order today.');
      }else if(daily.id==='keep-cut')await openKeepCutDaily(daily,context);
      else if(daily.id==='better-than')await openBetterThanDaily(daily,context);
      else if(daily.id==='blind-rank')await openBlindRankDaily(daily,context);
      else if(daily.id==='top10')await openTop10Daily(daily);
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

  function injectDailyStyles(){
    if(document.getElementById('play-daily-rotation-rules'))return;
    const style=document.createElement('style');
    style.id='play-daily-rotation-rules';
    style.textContent=`
      html[data-play-screen="daily-keep-cut"] #playKeepCutPanel .kc-pack-control,
      html[data-play-screen="daily-blind-rank"] #playBlindRankPanel .br-pack-control{display:none!important}
      html[data-play-screen="daily-better-than"] #playBetterThanPanel select:disabled{opacity:.72;cursor:not-allowed}
    `;
    document.head.appendChild(style);
  }

  async function install(){
    try{
      await waitFor(()=>document.querySelector('#playHub .play-game-grid')&&window.UFC_PLAY_HUB);
      injectDailyStyles();
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