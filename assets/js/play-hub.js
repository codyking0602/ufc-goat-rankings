(function(){
  'use strict';

  const VERSION='play-hub-20260715c-shared-daily';
  const play=document.getElementById('play');
  const shell=play?.querySelector('.play-shell');
  const sectionTitle=play?.querySelector('.section-title');
  const top10Button=play?.querySelector('[data-play-mode="top10"]');
  const blindButton=play?.querySelector('[data-play-mode="blind"]');
  if(!play||!shell||!sectionTitle||!top10Button||!blindButton)return;

  const nativeRandom=window.__UFC_NATIVE_RANDOM||Math.random.bind(Math);
  window.__UFC_NATIVE_RANDOM=nativeRandom;
  let blindContext=null;
  let dailySeed='';
  let dailyContext=null;
  let opening=false;

  function esc(value){
    return String(value??'').replace(/[&<>"']/g,char=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'
    }[char]));
  }

  function centralDateKey(date=new Date()){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return date.toISOString().slice(0,10);}
  }

  function dateLabelFromKey(key){
    try{
      const date=new Date(`${key}T12:00:00-05:00`);
      return new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(date).toUpperCase();
    }catch(_error){return key;}
  }

  function hashSeed(value){
    let hash=2166136261;
    for(let index=0;index<String(value).length;index+=1){
      hash^=String(value).charCodeAt(index);
      hash=Math.imul(hash,16777619);
    }
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

  function restoreNativeRandom(){
    Math.random=nativeRandom;
  }

  function activateDailyRandom(seed=dailySeed){
    dailySeed=String(seed||'');
    if(!dailySeed){restoreNativeRandom();return;}
    Math.random=mulberry32(hashSeed(dailySeed));
  }

  const fallbackDay=centralDateKey();
  const games=[
    {id:'blind-rank',icon:'1–5',title:'Blind Rank 5',description:'Place five UFC fighters one at a time. Every slot locks before you see who comes next.',status:'COMING NEXT',live:false},
    {id:'keep-cut',icon:'4/4',title:'Keep 4, Cut 4',description:'Make eight locked decisions without knowing which fighter is waiting at the end.',status:'COMING SOON',live:false},
    {id:'top10',icon:'10',title:'Build Your Top 10',description:'Create your UFC GOAT list, order it, and compare every placement with the model.',status:'PLAY NOW',live:true},
    {id:'blind',icon:'?',title:'Blind Resume',description:'Choose the stronger UFC-only career five times without seeing either fighter’s name.',status:'PLAY NOW',live:true},
    {id:'better-than',icon:'>',title:'Better Than…',description:'Name every fighter whose UFC career belongs above the challenge fighter.',status:'COMING SOON',live:false},
    {id:'find-leader',icon:'#1',title:'Find the Leader',description:'Pick through a full board until you find the fighter who owns the featured stat.',status:'COMING SOON',live:false}
  ];

  const hub=document.createElement('div');
  hub.id='playHub';
  hub.className='play-hub';
  hub.innerHTML=`
    <section class="play-daily-card" aria-labelledby="playDailyTitle">
      <div class="play-daily-copy">
        <div class="play-daily-kicker"><span>TODAY'S CHALLENGE</span><time id="playDailyDate">${esc(dateLabelFromKey(fallbackDay))}</time></div>
        <h3 id="playDailyTitle">Blind Resume</h3>
        <p>Five anonymous UFC careers. Pick the stronger resume each round and finish with one score.</p>
        <div class="play-daily-details"><span>5 MATCHUPS</span><span>SAME LINEUP TODAY</span><span>OFFICIAL LEADERBOARD</span></div>
        <button type="button" class="play-daily-button" data-open-game="blind" data-daily="true">PLAY TODAY'S CHALLENGE <b>→</b></button>
      </div>
      <div class="play-daily-visual" aria-hidden="true"><span class="play-daily-fighter">A</span><strong>VS</strong><span class="play-daily-fighter">B</span><small>WHO RANKS HIGHER?</small></div>
    </section>
    <div class="play-hub-heading"><div><span>ALL GAMES</span><h3>Pick your debate</h3></div><p>Quick games, blind tests, and rankings built to argue about.</p></div>
    <section class="play-game-grid" aria-label="UFC games">
      ${games.map(game=>`<button type="button" class="play-game-card${game.live?' is-live':' is-coming'}" ${game.live?`data-open-game="${esc(game.id)}"`:`data-coming-game="${esc(game.title)}"`}><span class="play-game-card-top"><b class="play-game-icon">${esc(game.icon)}</b><em>${esc(game.status)}</em></span><span class="play-game-copy"><strong>${esc(game.title)}</strong><small>${esc(game.description)}</small></span><span class="play-game-action">${game.live?'OPEN GAME →':'IN DEVELOPMENT'}</span></button>`).join('')}
    </section>
    <div id="playHubNotice" class="play-hub-notice" role="status" aria-live="polite" hidden></div>`;

  const gameNav=document.createElement('div');
  gameNav.id='playGameNav';
  gameNav.className='play-game-nav';
  gameNav.hidden=true;
  gameNav.innerHTML='<button type="button" class="play-game-back" data-play-home>← ALL GAMES</button><div><span id="playGameEyebrow">PLAY</span><strong id="playGameTitle">UFC Game</strong></div>';

  shell.parentNode.insertBefore(hub,shell);
  shell.insertBefore(gameNav,shell.firstChild);
  shell.hidden=true;

  const subtitle=sectionTitle.querySelector('p');
  if(subtitle)subtitle.textContent='Daily challenges, blind debates, and your own UFC rankings.';

  function updateDailyCard(context){
    if(!context)return;
    dailyContext=context;
    const date=document.getElementById('playDailyDate');
    if(date)date.textContent=dateLabelFromKey(context.challenge_day||fallbackDay);
  }

  function resetBlindState(){
    const state=window.UFC_BLIND_MATCHMAKING?.state;
    if(state){
      state.pair=null;
      state.choice=null;
      state.currentResult=null;
      state.score=0;
      state.rounds=0;
      state.history=[];
      state.seenPairs=new Set();
      state.usedNames=new Set();
      state.lastNames=new Set();
      state.appearances=new Map();
      state.genderHistory=[];
      state.waitingForModel=false;
      state.finalVisible=false;
    }
    const matchup=document.getElementById('blindMatchup');
    const reveal=document.getElementById('blindReveal');
    const score=document.getElementById('blindScore');
    const round=document.getElementById('blindRound');
    if(matchup){matchup.hidden=false;matchup.innerHTML='';}
    if(reveal){reveal.hidden=true;reveal.innerHTML='';}
    if(score)score.textContent='0-0';
    if(round)round.textContent='ROUND 1 OF 5';
  }

  function setGameHeading(mode,daily){
    const eyebrow=document.getElementById('playGameEyebrow');
    const title=document.getElementById('playGameTitle');
    if(mode==='top10'){
      if(eyebrow)eyebrow.textContent='YOUR RANKING';
      if(title)title.textContent='Build Your Top 10';
      if(subtitle)subtitle.textContent='Build your list first. The official model stays hidden until you compare.';
      return;
    }
    if(eyebrow)eyebrow.textContent=daily?"TODAY'S CHALLENGE":'BLIND RESUME';
    if(title)title.textContent=daily?'Daily Blind Resume':'Blind Resume';
    if(subtitle)subtitle.textContent=daily?'Everyone gets the same five-matchup sequence today.':'Five anonymous UFC resumes. Pick the stronger career each round.';
  }

  async function openGame(mode,options={}){
    if(opening)return;
    const daily=Boolean(options.daily);
    if(mode!=='top10'&&mode!=='blind')return;
    opening=true;
    try{
      if(mode==='blind'){
        const nextContext=daily?'daily':'quick';
        if(daily){
          let prepared=null;
          try{prepared=await window.UFC_PLAY_SHARED?.prepareDaily?.('blind-resume');}
          catch(_error){prepared=null;}
          if(!prepared)return;
          updateDailyCard(prepared.context);
          activateDailyRandom(prepared.context.seed||prepared.context.challenge_key);
        }else{
          restoreNativeRandom();
        }
        if(blindContext!==nextContext||daily){
          resetBlindState();
          blindContext=nextContext;
        }
      }else{
        restoreNativeRandom();
      }

      hub.hidden=true;
      shell.hidden=false;
      gameNav.hidden=false;
      play.classList.add('play-game-active');
      setGameHeading(mode,daily);
      const button=mode==='top10'?top10Button:blindButton;
      button.click();
      gameNav.scrollIntoView({block:'start'});
      document.documentElement.setAttribute('data-play-screen',daily?'daily-blind':mode);
    }finally{
      opening=false;
    }
  }

  function showHub(){
    restoreNativeRandom();
    hub.hidden=false;
    shell.hidden=true;
    gameNav.hidden=true;
    play.classList.remove('play-game-active');
    if(subtitle)subtitle.textContent='Daily challenges, blind debates, and your own UFC rankings.';
    document.documentElement.setAttribute('data-play-screen','hub');
    sectionTitle.scrollIntoView({block:'start'});
  }

  function showComingSoon(title){
    const notice=document.getElementById('playHubNotice');
    if(!notice)return;
    notice.textContent=`${title} is already mapped into the Play hub and is next in the build queue.`;
    notice.hidden=false;
    clearTimeout(showComingSoon.timer);
    showComingSoon.timer=setTimeout(()=>{notice.hidden=true;},3200);
  }

  hub.addEventListener('click',event=>{
    const open=event.target.closest('[data-open-game]');
    if(open){openGame(open.dataset.openGame,{daily:open.dataset.daily==='true'});return;}
    const coming=event.target.closest('[data-coming-game]');
    if(coming)showComingSoon(coming.dataset.comingGame);
  });

  gameNav.addEventListener('click',event=>{if(event.target.closest('[data-play-home]'))showHub();});

  document.addEventListener('click',event=>{
    if(event.target.closest('[data-five-round-replay]')&&document.documentElement.getAttribute('data-play-screen')==='daily-blind')activateDailyRandom();
    const open=event.target.closest('[data-open-game]');
    if(open&&!(open.dataset.openGame==='blind'&&open.dataset.daily==='true'))restoreNativeRandom();
    if(event.target.closest('[data-play-home]'))restoreNativeRandom();
  },true);

  document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.view!=='play')restoreNativeRandom();
  }));

  document.querySelectorAll('.tab[data-view="play"]').forEach(button=>button.addEventListener('click',()=>setTimeout(showHub,0)));

  window.UFC_PLAY_HUB={
    version:VERSION,
    games:games.map(game=>({...game})),
    get dailyKey(){return dailyContext?.challenge_key||`blind-resume:${fallbackDay}`;},
    openGame,
    showHub,
    activateDailyRandom,
    restoreNativeRandom
  };
  document.documentElement.setAttribute('data-play-hub',VERSION);
  document.documentElement.setAttribute('data-play-screen','hub');
  window.dispatchEvent(new CustomEvent('ufc-play-hub-ready',{detail:{version:VERSION,dailyKey:`blind-resume:${fallbackDay}`}}));

  const loadDailyContext=()=>window.UFC_PLAY_SHARED?.dailyContext?.('blind-resume').then(updateDailyCard).catch(()=>undefined);
  if(window.UFC_PLAY_SHARED)loadDailyContext();
  else window.addEventListener('ufc-play-shared-ready',loadDailyContext,{once:true});
})();