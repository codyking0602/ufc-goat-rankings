(function(){
  'use strict';

  const VERSION='play-community-picks-20260717b';
  const STORAGE_PREFIX='ufc-play:daily-keep-cut-picks:';
  const BOARD_GAME_TYPE='keep-cut-picks';
  const BOARD_GAME_VERSION='keep-cut-picks-v1';
  const BOARD_MAX_SCORE=255;
  let boardLoading=false;
  let submitLoading=false;
  let lineupCache=null;
  let renderTimer=0;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function currentDaily(){
    return window.UFC_PLAY_DAILY_ROTATION?.dailyFor?.()||null;
  }

  function isKeepCutDay(){
    const daily=currentDaily();
    return daily?.id==='keep-cut'||daily?.gameType==='keep-cut';
  }

  function dateLabel(day){
    try{return new Intl.DateTimeFormat(undefined,{weekday:'long',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(new Date(`${day}T12:00:00-05:00`));}
    catch(_error){return day||'Today';}
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
    try{return task(Math.random);}finally{Math.random=previous;}
  }

  async function dailySetup(){
    const shared=window.UFC_PLAY_SHARED;
    const game=window.UFC_KEEP_CUT;
    if(!shared?.dailyContext||!game?.buildLineup||!Array.isArray(game.packs)||!game.packs.length)return null;
    const context=await shared.dailyContext('keep-cut','keep-cut-daily-v1',1);
    const day=String(context?.challenge_day||window.UFC_PLAY_DAILY_ROTATION?.centralDay?.()||'');
    if(lineupCache?.day===day)return lineupCache;
    const lineup=withSeed(context.seed||context.challenge_key,random=>{
      const pack=game.packs[Math.floor(random()*game.packs.length)]||game.packs[0];
      return game.buildLineup(pack?.id||'ufc-careers');
    });
    if(!Array.isArray(lineup)||lineup.length!==8)return null;
    lineupCache={day,context,lineup};
    return lineupCache;
  }

  function decisionArray(state){
    if(!state?.completed||!Array.isArray(state.decisions)||state.decisions.length!==8)return null;
    const decisions=Array(8).fill('');
    state.decisions.forEach(row=>{
      const index=Number(row?.revealIndex);
      if(index>=0&&index<8)decisions[index]=row.choice==='keep'?'K':row.choice==='cut'?'C':'';
    });
    return decisions.filter(choice=>choice==='K').length===4&&decisions.filter(choice=>choice==='C').length===4?decisions:null;
  }

  function scoreFor(decisions){
    return decisions.reduce((score,choice,index)=>choice==='K'?score+(1<<index):score,0);
  }

  function popcount(value){
    let count=0;
    let current=Number(value)||0;
    while(current){count+=current&1;current>>=1;}
    return count;
  }

  function keptFor(score,lineup){
    const mask=Number(score);
    if(!Number.isInteger(mask)||mask<0||mask>BOARD_MAX_SCORE||popcount(mask)!==4)return[];
    return lineup.filter((_fighter,index)=>(mask&(1<<index))!==0);
  }

  function injectStyles(){
    if(document.getElementById('play-community-picks-css'))return;
    const style=document.createElement('style');
    style.id='play-community-picks-css';
    style.textContent=`
      #play .play-game-card{min-height:190px;padding:14px}
      #play .play-game-icon{min-width:48px;height:48px}
      #play .play-game-copy{margin-top:12px}
      #play .play-game-copy small{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
      #play .play-game-action{padding-top:12px}
      #playDailyLeaderboard[data-community-picks="true"]{min-height:0;padding:20px}
      #playDailyLeaderboard .daily-picks-list{display:grid;gap:7px;margin-top:14px}
      #playDailyLeaderboard .daily-picks-row{border:1px solid #334155;border-radius:13px;background:#101725;padding:10px 11px}
      #playDailyLeaderboard .daily-picks-row.you{border-color:#f97316;box-shadow:inset 3px 0 0 #f97316}
      #playDailyLeaderboard .daily-picks-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
      #playDailyLeaderboard .daily-picks-head strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;font-size:11px}
      #playDailyLeaderboard .daily-picks-head span{border-radius:999px;background:rgba(249,115,22,.15);padding:4px 6px;color:#fdba74;font-size:7px;font-weight:950;letter-spacing:.06em}
      #playDailyLeaderboard .daily-picks-fighters{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}
      #playDailyLeaderboard .daily-picks-fighters b{border:1px solid #465a78;border-radius:999px;background:#172033;padding:5px 7px;color:#e2e8f0;font-size:8px;line-height:1}
      #playDailyLeaderboard .daily-picks-note{margin:10px 0 0;color:#94a3b8;font-size:9px;line-height:1.4;text-align:center}
      @media(max-width:620px){
        #play .play-game-card{min-height:150px;padding:12px 13px}
        #play .play-game-card-top{min-height:42px}
        #play .play-game-icon{min-width:42px;height:42px;border-radius:12px;font-size:21px}
        #play .play-game-card-top em{padding:7px 8px;font-size:8px}
        #play .play-game-copy{margin-top:9px}
        #play .play-game-copy strong{font-size:18px}
        #play .play-game-copy small{margin-top:5px;font-size:10px;line-height:1.3}
        #play .play-game-action{padding-top:9px;font-size:9px}
        #playDailyLeaderboard[data-community-picks="true"]{padding:16px 13px}
      }
    `;
    document.head.appendChild(style);
  }

  function boardHead(day,playerCount){
    return `<div class="daily-board-head" data-community-picks-board><div><span>${esc(dateLabel(day).toUpperCase())}</span><h3>Today's Picks</h3><p>${playerCount} player${playerCount===1?'':'s'} completed Keep 4, Cut 4.</p></div><div class="daily-board-controls"><button type="button" data-community-picks-refresh>REFRESH</button></div></div>`;
  }

  async function renderBoard(){
    if(boardLoading||!isKeepCutDay())return;
    const node=document.getElementById('playDailyLeaderboard');
    const client=window.UFC_PLAY_PROFILE?.client||window.UFC_PLAY_SHARED?.client;
    if(!node||!client)return;
    boardLoading=true;
    node.dataset.communityPicks='true';
    node.innerHTML='<div class="daily-board-status">Loading today\'s picks…</div>';
    try{
      const setup=await dailySetup();
      if(!setup)throw new Error('Today’s fighter lineup is not ready yet.');
      const {data,error}=await client.rpc('play_daily_leaderboard',{
        p_game_type:BOARD_GAME_TYPE,
        p_challenge_day:setup.day,
        p_limit:50
      });
      if(error)throw error;
      const rows=(Array.isArray(data?.rows)?data.rows:[])
        .filter(row=>keptFor(row?.official_score,setup.lineup).length===4)
        .sort((a,b)=>String(a?.display_name||'').localeCompare(String(b?.display_name||'')));
      let identity=null;
      try{identity=await window.UFC_PLAY_PROFILE?.resolve?.();}catch(_error){}
      const yourName=String(identity?.member?.display_name||'').trim().toLowerCase();
      const head=boardHead(setup.day,rows.length);
      if(!rows.length){
        node.innerHTML=`${head}<div class="daily-board-status">No completed picks yet. Finish today's game to be first.</div>`;
      }else{
        node.innerHTML=`${head}<div class="daily-picks-list" data-community-picks-board>${rows.map(row=>{
          const name=String(row?.display_name||'Player');
          const isYou=yourName&&name.trim().toLowerCase()===yourName;
          const fighters=keptFor(row.official_score,setup.lineup);
          return `<article class="daily-picks-row${isYou?' you':''}"><div class="daily-picks-head"><strong>${esc(name)}${isYou?' · YOU':''}</strong><span>KEPT 4</span></div><div class="daily-picks-fighters">${fighters.map(fighter=>`<b>${esc(fighter?.name||fighter?.fighter||fighter?.id||'Fighter')}</b>`).join('')}</div></article>`;
        }).join('')}</div><p class="daily-picks-note">Same eight fighters. Compare everyone's final four.</p>`;
      }
      const hint=document.querySelector('#playHub .play-daily-swipe-hint');
      if(hint)hint.textContent='TAP TO PLAY · SWIPE FOR PICKS →';
      document.querySelector('#playDailyCarousel [data-daily-slide="1"]')?.setAttribute('aria-label',"Show today's picks");
    }catch(error){
      node.innerHTML=`${boardHead(window.UFC_PLAY_DAILY_ROTATION?.centralDay?.()||'',0)}<div class="daily-board-status">${esc(error?.message||'Today\'s picks could not load.')}</div>`;
    }finally{boardLoading=false;}
  }

  function scheduleBoard(){
    clearTimeout(renderTimer);
    renderTimer=setTimeout(renderBoard,120);
  }

  async function submitIfComplete(options={}){
    if(submitLoading||!isKeepCutDay())return;
    const state=window.UFC_KEEP_CUT?.state;
    const decisions=decisionArray(state);
    if(!decisions||!Array.isArray(state?.lineup)||state.lineup.length!==8)return;
    const profile=window.UFC_PLAY_PROFILE;
    const client=profile?.client;
    if(!profile||!client)return;
    submitLoading=true;
    try{
      const setup=await dailySetup();
      if(!setup)return;
      const stateIds=state.lineup.map(fighter=>fighter?.id).join('|');
      const dailyIds=setup.lineup.map(fighter=>fighter?.id).join('|');
      const dailyScreen=document.documentElement.getAttribute('data-play-screen')==='daily-keep-cut';
      if(!dailyScreen&&stateIds!==dailyIds)return;
      let identity=await profile.resolve?.();
      if(!identity&&options.prompt!==false)identity=await profile.require?.({
        title:"Add your picks to today's board",
        description:'Save your final four so everyone can compare their Keep 4, Cut 4 choices.'
      });
      if(!identity)return;
      const score=scoreFor(decisions);
      const storageKey=`${STORAGE_PREFIX}${setup.day}:${identity.groupCode}:${identity.member?.id||identity.member?.display_name||'player'}`;
      try{if(localStorage.getItem(storageKey)===String(score))return;}catch(_error){}
      const result={
        decisions,
        lineup:state.lineup.map(fighter=>fighter.id),
        kept:state.lineup.filter((_fighter,index)=>decisions[index]==='K').map(fighter=>fighter.id),
        packId:state.packId||'ufc-careers'
      };
      const {data,error}=await client.rpc('play_submit_daily_attempt',{
        p_game_type:BOARD_GAME_TYPE,
        p_game_version:BOARD_GAME_VERSION,
        p_group_code:identity.groupCode,
        p_member_token:identity.memberToken,
        p_score:score,
        p_result:result,
        p_max_score:BOARD_MAX_SCORE
      });
      if(error||!data?.ok)throw error||new Error(data?.error||'Picks were not saved.');
      try{localStorage.setItem(storageKey,String(score));}catch(_error){}
      window.dispatchEvent(new CustomEvent('ufc-community-picks-saved',{detail:{day:setup.day,score}}));
      scheduleBoard();
    }catch(error){console.error('Keep/Cut daily picks could not be saved.',error);}
    finally{submitLoading=false;}
  }

  function watchBoard(){
    const observer=new MutationObserver(()=>{
      if(!isKeepCutDay())return;
      const node=document.getElementById('playDailyLeaderboard');
      if(node&&!node.querySelector('[data-community-picks-board]')&&!boardLoading)scheduleBoard();
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function install(){
    injectStyles();
    watchBoard();
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-community-picks-refresh]')){
        event.preventDefault();
        event.stopImmediatePropagation();
        scheduleBoard();
        return;
      }
      if(event.target.closest?.('[data-kc-choice]'))setTimeout(()=>submitIfComplete({prompt:true}),180);
    },true);
    window.addEventListener('ufc-play-daily-rotation-ready',()=>setTimeout(scheduleBoard,80));
    window.addEventListener('ufc-play-hub-ready',()=>setTimeout(scheduleBoard,180));
    window.addEventListener('ufc-community-picks-saved',scheduleBoard);
    [250,800,1800].forEach(delay=>setTimeout(scheduleBoard,delay));
    [900,2000].forEach(delay=>setTimeout(()=>submitIfComplete({prompt:false}),delay));
    document.documentElement.setAttribute('data-play-community-picks',VERSION);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
