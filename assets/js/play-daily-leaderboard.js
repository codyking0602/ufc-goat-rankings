(function(){
  'use strict';

  const VERSION='play-daily-leaderboard-20260716c-swipe-carousel';
  let loading=false;
  let loadedKey='';
  let lastContext=null;
  let lastDaily=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function waitFor(check,timeout=15000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{
        const value=check();
        if(value){resolve(value);return;}
        if(Date.now()-started>timeout){reject(new Error('Daily leaderboard did not finish loading.'));return;}
        setTimeout(tick,80);
      };
      tick();
    });
  }

  function dateLabel(day){
    try{return new Intl.DateTimeFormat(undefined,{weekday:'long',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(new Date(`${day}T12:00:00-05:00`));}
    catch(_error){return day||'Today';}
  }

  function currentDaily(){
    const rotation=window.UFC_PLAY_DAILY_ROTATION;
    return rotation?.dailyFor?.()||{id:'blind',gameType:'blind-resume',gameVersion:'blind-resume-daily-v2',maxScore:5,title:'Blind Resume'};
  }

  function injectStyles(){
    document.getElementById('play-daily-leaderboard-css')?.remove();
    const style=document.createElement('style');
    style.id='play-daily-leaderboard-css';
    style.textContent=`
      #play .play-daily-carousel{min-width:0;display:grid;gap:8px}
      #play .play-daily-track{display:flex;gap:12px;min-width:0;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none}
      #play .play-daily-track::-webkit-scrollbar{display:none}
      #play .play-daily-slide{flex:0 0 100%;min-width:0;scroll-snap-align:start;scroll-snap-stop:always}
      #play .play-daily-card{cursor:pointer;user-select:none;-webkit-user-select:none}
      #play .play-daily-card:focus-visible{outline:3px solid rgba(249,115,22,.55);outline-offset:3px}
      #play .play-daily-swipe-hint{position:absolute;right:18px;bottom:12px;z-index:2;color:#fde68a;font:950 8px/1 system-ui;letter-spacing:.1em}
      #play .play-daily-dots{display:flex;justify-content:center;gap:7px}
      #play .play-daily-dot{width:28px;height:5px;border:0;border-radius:999px;background:#94a3b8;opacity:.38;padding:0;cursor:pointer;transition:.16s ease}
      #play .play-daily-dot.active{background:#f97316;opacity:1}
      #playDailyLeaderboard{margin:0;min-height:310px;border:1px solid rgba(250,204,21,.62);border-radius:26px;background:radial-gradient(circle at 12% 15%,rgba(249,115,22,.16),transparent 35%),linear-gradient(145deg,#253247,#172033 62%,#101522);box-shadow:0 20px 50px rgba(2,6,23,.28);padding:24px;color:#f8fafc}
      #playDailyLeaderboard .daily-board-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
      #playDailyLeaderboard .daily-board-head span{display:block;color:#f97316;font:950 9px/1 system-ui;letter-spacing:.13em}
      #playDailyLeaderboard .daily-board-head h3{margin:6px 0 0;color:#fff;font:950 27px/1 system-ui}
      #playDailyLeaderboard .daily-board-head p{margin:7px 0 0;color:#94a3b8;font:650 11px/1.4 system-ui}
      #playDailyLeaderboard .daily-board-controls{display:flex;gap:6px}
      #playDailyLeaderboard .daily-board-controls button{min-height:34px;border:1px solid #526786;border-radius:10px;background:#101725;color:#fff;padding:0 10px;font:900 9px/1 system-ui;cursor:pointer}
      #playDailyLeaderboard .daily-board-status{margin-top:14px;border:1px dashed #526786;border-radius:14px;padding:30px 18px;text-align:center;color:#cbd5e1;font:750 11px/1.4 system-ui}
      #playDailyLeaderboard .daily-board-list{display:grid;gap:6px;margin-top:14px;max-height:430px;overflow:auto;padding-right:2px}
      #playDailyLeaderboard .daily-board-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto auto;gap:8px;align-items:center;border:1px solid #334155;border-radius:12px;background:#101725;padding:9px}
      #playDailyLeaderboard .daily-board-row.you{border-color:#f97316;box-shadow:inset 3px 0 0 #f97316}
      #playDailyLeaderboard .daily-board-row.perfect{border-color:rgba(34,197,94,.62)}
      #playDailyLeaderboard .daily-board-row>b{color:#facc15;font-size:15px;text-align:center}
      #playDailyLeaderboard .daily-board-row strong{color:#fff;font-size:11px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #playDailyLeaderboard .daily-board-row span{color:#fde68a;font-size:10px;font-weight:900}
      #playDailyLeaderboard .daily-board-row small{color:#94a3b8;font-size:8px;text-align:right}
      #playDailyLeaderboard .daily-perfect{margin-left:5px;border-radius:999px;background:rgba(34,197,94,.16);padding:3px 5px;color:#86efac;font-size:7px;font-style:normal;font-weight:950;letter-spacing:.04em}
      #playDailyLeaderboard .daily-board-note{margin:10px 0 0;color:#94a3b8;font-size:9px;line-height:1.4;text-align:center}
      @media(max-width:650px){
        #play .play-daily-track{gap:9px}
        #play .play-daily-swipe-hint{right:12px;bottom:8px;font-size:7px}
        #playDailyLeaderboard{min-height:0;padding:16px 13px;border-radius:21px}
        #playDailyLeaderboard .daily-board-head{display:grid}
        #playDailyLeaderboard .daily-board-controls{width:100%}
        #playDailyLeaderboard .daily-board-controls button{width:100%}
        #playDailyLeaderboard .daily-board-row{grid-template-columns:34px minmax(0,1fr) auto}
        #playDailyLeaderboard .daily-board-row small{display:none}
      }
    `;
    document.head.appendChild(style);
  }

  function panel(){
    const hub=document.getElementById('playHub');
    if(!hub)return null;
    let node=document.getElementById('playDailyLeaderboard');
    if(!node){
      node=document.createElement('section');
      node.id='playDailyLeaderboard';
    }
    node.hidden=false;
    return node;
  }

  function updateDots(index){
    document.querySelectorAll('#playDailyCarousel .play-daily-dot').forEach((dot,dotIndex)=>dot.classList.toggle('active',dotIndex===index));
  }

  function scrollToSlide(index,behavior='smooth'){
    const track=document.querySelector('#playDailyCarousel .play-daily-track');
    const slide=track?.children?.[index];
    if(slide)track.scrollTo({left:slide.offsetLeft,behavior});
    updateDots(index);
  }

  function ensureCarousel(){
    const hub=document.getElementById('playHub');
    const card=hub?.querySelector('.play-daily-card');
    const board=panel();
    if(!hub||!card||!board)return null;
    let carousel=document.getElementById('playDailyCarousel');
    let track=carousel?.querySelector('.play-daily-track');
    if(!carousel){
      carousel=document.createElement('section');
      carousel.id='playDailyCarousel';
      carousel.className='play-daily-carousel';
      carousel.setAttribute('aria-label',"Today's challenge and leaderboard");
      track=document.createElement('div');
      track.className='play-daily-track';
      const dots=document.createElement('div');
      dots.className='play-daily-dots';
      dots.innerHTML='<button type="button" class="play-daily-dot active" data-daily-slide="0" aria-label="Show today\'s challenge"></button><button type="button" class="play-daily-dot" data-daily-slide="1" aria-label="Show today\'s leaderboard"></button>';
      card.parentNode.insertBefore(carousel,card);
      carousel.append(track,dots);
    }
    card.classList.add('play-daily-slide');
    board.classList.add('play-daily-slide');
    if(card.parentNode!==track)track.appendChild(card);
    if(board.parentNode!==track)track.appendChild(board);
    if(track.dataset.swipeBound!==VERSION){
      track.dataset.swipeBound=VERSION;
      let ticking=false;
      track.addEventListener('scroll',()=>{
        if(ticking)return;
        ticking=true;
        requestAnimationFrame(()=>{
          ticking=false;
          const width=Math.max(1,track.clientWidth);
          updateDots(Math.round(track.scrollLeft/width));
        });
      },{passive:true});
    }
    return {carousel,track,card,board};
  }

  function loadingMarkup(daily){
    return `<div class="daily-board-head"><div><span>TODAY'S CHALLENGE</span><h3>${esc(daily.title)} Leaderboard</h3><p>Loading official first-attempt scores…</p></div></div><div class="daily-board-status">Checking today's results…</div>`;
  }

  function errorMarkup(message,daily){
    return `<div class="daily-board-head"><div><span>TODAY'S CHALLENGE</span><h3>${esc(daily.title)} Leaderboard</h3><p>${esc(message)}</p></div><div class="daily-board-controls"><button type="button" data-daily-board-refresh>TRY AGAIN</button></div></div>`;
  }

  function boardMarkup(board,identity,daily){
    const rows=Array.isArray(board?.rows)?board.rows:[];
    const name=String(identity?.member?.display_name||'').trim().toLowerCase();
    const max=Number(board?.max_score)||Number(daily.maxScore)||5;
    const playerCount=Number(board?.player_count)||rows.length||0;
    const head=`<div class="daily-board-head"><div><span>${esc(dateLabel(board?.challenge_day).toUpperCase())}</span><h3>${esc(daily.title)} Leaderboard</h3><p>${playerCount} player${playerCount===1?'':'s'} completed today's challenge.</p></div><div class="daily-board-controls"><button type="button" data-daily-board-refresh>REFRESH</button></div></div>`;
    if(!rows.length)return `${head}<div class="daily-board-status">No completed scores yet. Be the first on the board.</div><p class="daily-board-note">The first completed attempt is official. Replays update only the best score and attempt count.</p>`;
    return `${head}<div class="daily-board-list">${rows.slice(0,50).map(row=>{
      const isYou=name&&String(row.display_name||'').trim().toLowerCase()===name;
      const rowMax=Number(row.max_score)||max;
      const official=Number(row.official_score)||0;
      const perfect=official===rowMax;
      return `<div class="daily-board-row${isYou?' you':''}${perfect?' perfect':''}"><b>#${Number(row.rank)||'—'}</b><strong>${esc(row.display_name)}${isYou?' · YOU':''}${perfect?'<em class="daily-perfect">PERFECT</em>':''}</strong><span>${official}/${rowMax}</span><small>Best ${Number(row.best_score)||0}/${rowMax} · ${Number(row.attempt_count)||1}x</small></div>`;
    }).join('')}</div><p class="daily-board-note">Official first-attempt scores determine place. Equal scores share the same place. There is no speed tiebreaker.</p>`;
  }

  async function fetchBoard(){
    const shared=window.UFC_PLAY_SHARED;
    if(!shared?.client)throw new Error('The shared leaderboard is not connected.');
    const daily=currentDaily();
    const context=await shared.dailyContext(daily.gameType,daily.gameVersion,daily.maxScore);
    lastContext=context;
    lastDaily=daily;
    const {data,error}=await shared.client.rpc('play_daily_leaderboard',{p_game_type:daily.gameType,p_challenge_day:context.challenge_day,p_limit:50});
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Leaderboard could not load.');
    let identity=null;
    try{identity=await shared.resolveIdentity?.();}catch(_error){}
    return {board:data,identity,daily,context};
  }

  async function refreshBoard(options={}){
    if(loading)return;
    const carousel=ensureCarousel();
    const node=carousel?.board;
    if(!node)return;
    const daily=currentDaily();
    loading=true;
    node.innerHTML=loadingMarkup(daily);
    if(options.show)scrollToSlide(1);
    try{
      const result=await fetchBoard();
      loadedKey=`${result.daily.gameType}|${result.context.challenge_day}`;
      node.innerHTML=boardMarkup(result.board,result.identity,result.daily);
    }catch(error){node.innerHTML=errorMarkup(String(error?.message||'Leaderboard could not load.'),daily);}
    finally{loading=false;}
  }

  function refreshIfNeeded(){
    const rotation=window.UFC_PLAY_DAILY_ROTATION;
    const daily=currentDaily();
    const day=rotation?.centralDay?.()||'';
    const key=`${daily.gameType}|${day}`;
    if(key!==loadedKey)refreshBoard();
  }

  async function install(){
    try{
      await waitFor(()=>window.UFC_PLAY_SHARED?.dailyContext&&window.UFC_PLAY_DAILY_ROTATION?.dailyFor&&document.querySelector('#playHub .play-daily-card'));
      injectStyles();
      ensureCarousel();
      refreshIfNeeded();
      document.addEventListener('click',event=>{
        const dot=event.target.closest?.('[data-daily-slide]');
        if(dot){event.preventDefault();scrollToSlide(Number(dot.dataset.dailySlide)||0);return;}
        if(event.target.closest?.('[data-daily-board-refresh]')){event.preventDefault();event.stopImmediatePropagation();refreshBoard({show:true});}
      },true);
      window.addEventListener('ufc-play-hub-ready',()=>{ensureCarousel();refreshIfNeeded();});
      window.addEventListener('ufc-play-daily-rotation-ready',()=>{ensureCarousel();scrollToSlide(0,'auto');loadedKey='';refreshIfNeeded();});
      window.UFC_DAILY_LEADERBOARD={version:VERSION,refresh:options=>refreshBoard(options||{}),show:()=>{ensureCarousel();scrollToSlide(1);refreshIfNeeded();},showChallenge:()=>scrollToSlide(0),get context(){return lastContext;},get daily(){return lastDaily;}};
      document.documentElement.setAttribute('data-play-daily-leaderboard',VERSION);
    }catch(error){console.error(error);}
  }

  install();
})();