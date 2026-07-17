(function(){
  'use strict';

  const VERSION='play-community-picks-20260717c-finish-flow';
  const STORAGE_PREFIX='ufc-play:daily-keep-cut-picks-v2:';
  const LINEUP_PREFIX='ufc-play:daily-keep-cut-lineup-v2:';
  const BOARD_GAME_TYPE='keep-cut-picks-v2';
  const BOARD_GAME_VERSION='keep-cut-picks-v2';
  const BOARD_MAX_SCORE=255;
  let boardLoading=false;
  let submitLoading=false;
  let lineupCache=null;
  let renderTimer=0;
  let boardWanted=false;

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

  function isDailyGameScreen(){
    return document.documentElement.getAttribute('data-play-screen')==='daily-keep-cut';
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

  function resolvedLineup(ids){
    const data=window.UFC_PLAY_DATA;
    if(!data?.resolve||!Array.isArray(ids)||ids.length!==8)return null;
    const lineup=ids.map(id=>data.resolve(id));
    return lineup.some(fighter=>!fighter)||new Set(lineup.map(fighter=>fighter.id)).size!==8?null:lineup;
  }

  function storeLineup(day,lineup,packId){
    if(!day||!Array.isArray(lineup)||lineup.length!==8)return;
    const ids=lineup.map(fighter=>fighter?.id).filter(Boolean);
    if(ids.length!==8||new Set(ids).size!==8)return;
    try{localStorage.setItem(`${LINEUP_PREFIX}${day}`,JSON.stringify({ids,packId:packId||'ufc-careers'}));}catch(_error){}
  }

  function storedLineup(day){
    try{
      const saved=JSON.parse(localStorage.getItem(`${LINEUP_PREFIX}${day}`)||'null');
      const lineup=resolvedLineup(saved?.ids);
      return lineup?{lineup,packId:saved?.packId||'ufc-careers'}:null;
    }catch(_error){return null;}
  }

  function activeDailyLineup(day){
    const state=window.UFC_KEEP_CUT?.state;
    if(!isDailyGameScreen()||!Array.isArray(state?.lineup)||state.lineup.length!==8)return null;
    const ids=state.lineup.map(fighter=>fighter?.id).filter(Boolean);
    if(ids.length!==8||new Set(ids).size!==8)return null;
    storeLineup(day,state.lineup,state.packId);
    return {lineup:state.lineup.slice(),packId:state.packId||'ufc-careers'};
  }

  async function dailySetup(){
    const shared=window.UFC_PLAY_SHARED;
    const game=window.UFC_KEEP_CUT;
    if(!shared?.dailyContext||!game?.buildLineup||!Array.isArray(game.packs)||!game.packs.length)return null;
    const context=await shared.dailyContext('keep-cut','keep-cut-daily-v1',1);
    const day=String(context?.challenge_day||window.UFC_PLAY_DAILY_ROTATION?.centralDay?.()||'');
    const active=activeDailyLineup(day);
    if(active){
      lineupCache={day,context,...active};
      return lineupCache;
    }
    if(lineupCache?.day===day)return lineupCache;
    const saved=storedLineup(day);
    if(saved){
      lineupCache={day,context,...saved};
      return lineupCache;
    }
    let selectedPack=null;
    const lineup=withSeed(context.seed||context.challenge_key,random=>{
      selectedPack=game.packs[Math.floor(random()*game.packs.length)]||game.packs[0];
      return game.buildLineup(selectedPack?.id||'ufc-careers');
    });
    if(!Array.isArray(lineup)||lineup.length!==8)return null;
    storeLineup(day,lineup,selectedPack?.id);
    lineupCache={day,context,lineup,packId:selectedPack?.id||'ufc-careers'};
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
      html[data-play-screen="daily-keep-cut"] #playKeepCutPanel .kc-actions{grid-template-columns:1fr}
      html[data-play-screen="daily-keep-cut"] #playKeepCutPanel .kc-actions [data-community-picks-open]{order:-2;border-color:#ff6b0b;background:#ff6b0b;color:#0f172a}
      html[data-play-screen="daily-keep-cut"] #playKeepCutPanel .kc-actions [data-kc-challenge]{order:-1;border-color:#526786;background:#101725;color:#f8fafc}
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

  function showBoardSlide(behavior='smooth'){
    const api=window.UFC_DAILY_LEADERBOARD;
    if(api?.show){api.show();return;}
    const track=document.querySelector('#playDailyCarousel .play-daily-track');
    const slide=track?.children?.[1];
    if(slide)track.scrollTo({left:slide.offsetLeft,behavior});
  }

  async function renderBoard(options={}){
    if(boardLoading||!isKeepCutDay())return false;
    const node=document.getElementById('playDailyLeaderboard');
    const client=window.UFC_PLAY_PROFILE?.client||window.UFC_PLAY_SHARED?.client;
    if(!node||!client)return false;
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
      if(options.show||boardWanted)setTimeout(()=>showBoardSlide('auto'),40);
      return true;
    }catch(error){
      node.innerHTML=`${boardHead(window.UFC_PLAY_DAILY_ROTATION?.centralDay?.()||'',0)}<div class="daily-board-status">${esc(error?.message||'Today\'s picks could not load.')}</div>`;
      return false;
    }finally{boardLoading=false;}
  }

  function scheduleBoard(options={}){
    clearTimeout(renderTimer);
    renderTimer=setTimeout(()=>renderBoard(options),Number(options.delay)||120);
  }

  async function submitIfComplete(options={}){
    if(submitLoading||!isKeepCutDay())return false;
    const state=window.UFC_KEEP_CUT?.state;
    const decisions=decisionArray(state);
    if(!decisions||!Array.isArray(state?.lineup)||state.lineup.length!==8)return false;
    const profile=window.UFC_PLAY_PROFILE;
    const client=profile?.client;
    if(!profile||!client)return false;
    submitLoading=true;
    try{
      const setup=await dailySetup();
      if(!setup)return false;
      const stateIds=state.lineup.map(fighter=>fighter?.id).join('|');
      const dailyIds=setup.lineup.map(fighter=>fighter?.id).join('|');
      if(stateIds!==dailyIds){
        lineupCache={day:setup.day,context:setup.context,lineup:state.lineup.slice(),packId:state.packId||'ufc-careers'};
        storeLineup(setup.day,state.lineup,state.packId);
      }
      const authoritativeIds=(lineupCache?.lineup||setup.lineup).map(fighter=>fighter?.id).join('|');
      if(stateIds!==authoritativeIds)return false;
      let identity=await profile.resolve?.();
      if(!identity&&options.prompt!==false)identity=await profile.require?.({
        title:"Add your picks to today's board",
        description:'Save your final four so everyone can compare their Keep 4, Cut 4 choices.'
      });
      if(!identity)return false;
      const score=scoreFor(decisions);
      const storageKey=`${STORAGE_PREFIX}${setup.day}:${identity.groupCode}:${identity.member?.id||identity.member?.display_name||'player'}`;
      try{
        if(localStorage.getItem(storageKey)===String(score)){
          scheduleBoard({show:options.show});
          return true;
        }
      }catch(_error){}
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
      scheduleBoard({show:options.show});
      return true;
    }catch(error){
      console.error('Keep/Cut daily picks could not be saved.',error);
      return false;
    }finally{submitLoading=false;}
  }

  function decorateFinish(){
    if(!isKeepCutDay()||!isDailyGameScreen()||!window.UFC_KEEP_CUT?.state?.completed)return;
    const actions=document.querySelector('#playKeepCutPanel .kc-finish .kc-actions');
    if(!actions||actions.querySelector('[data-community-picks-open]'))return;
    const button=document.createElement('button');
    button.type='button';
    button.className='primary';
    button.dataset.communityPicksOpen='true';
    button.textContent="CONTINUE TO TODAY'S PICKS";
    actions.prepend(button);
  }

  async function openBoard(){
    boardWanted=true;
    const button=document.querySelector('[data-community-picks-open]');
    if(button){button.disabled=true;button.textContent='SAVING PICKS…';}
    await submitIfComplete({prompt:true,show:true});
    window.UFC_PLAY_HUB?.showHub?.();
    scheduleBoard({show:true,delay:20});
    [80,260,700,1400].forEach(delay=>setTimeout(()=>{
      renderBoard({show:true});
      showBoardSlide('auto');
    },delay));
  }

  function bindCarousel(){
    const track=document.querySelector('#playDailyCarousel .play-daily-track');
    if(!track||track.dataset.communityPicksBound===VERSION)return;
    track.dataset.communityPicksBound=VERSION;
    track.addEventListener('scroll',()=>{
      const index=Math.round(track.scrollLeft/Math.max(1,track.clientWidth));
      if(index===1)boardWanted=true;
    },{passive:true});
  }

  function watchBoard(){
    const observer=new MutationObserver(()=>{
      decorateFinish();
      bindCarousel();
      if(!isKeepCutDay())return;
      const node=document.getElementById('playDailyLeaderboard');
      if(node&&!node.querySelector('[data-community-picks-board]')&&!boardLoading)scheduleBoard({show:boardWanted});
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function install(){
    injectStyles();
    watchBoard();
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-community-picks-open]')){
        event.preventDefault();
        event.stopImmediatePropagation();
        openBoard();
        return;
      }
      if(event.target.closest?.('[data-community-picks-refresh]')){
        event.preventDefault();
        event.stopImmediatePropagation();
        boardWanted=true;
        scheduleBoard({show:true});
        return;
      }
      if(event.target.closest?.('#playDailyCarousel [data-daily-slide="1"]'))boardWanted=true;
      if(event.target.closest?.('#playDailyCarousel [data-daily-slide="0"],#playHub .play-daily-card'))boardWanted=false;
      if(event.target.closest?.('[data-kc-choice]'))setTimeout(()=>{
        decorateFinish();
        submitIfComplete({prompt:true});
      },220);
    },true);
    window.addEventListener('ufc-play-daily-rotation-ready',()=>{
      setTimeout(()=>scheduleBoard({show:boardWanted}),80);
      if(boardWanted)[140,480,1000].forEach(delay=>setTimeout(()=>showBoardSlide('auto'),delay));
    });
    window.addEventListener('ufc-play-hub-ready',()=>setTimeout(()=>{
      bindCarousel();
      scheduleBoard({show:boardWanted});
    },180));
    window.addEventListener('ufc-community-picks-saved',()=>scheduleBoard({show:boardWanted}));
    [250,800,1800].forEach(delay=>setTimeout(()=>{
      decorateFinish();
      bindCarousel();
      scheduleBoard({show:boardWanted});
    },delay));
    [900,2000].forEach(delay=>setTimeout(()=>submitIfComplete({prompt:false}),delay));
    window.UFC_COMMUNITY_PICKS={version:VERSION,render:renderBoard,submit:submitIfComplete,open:openBoard};
    document.documentElement.setAttribute('data-play-community-picks',VERSION);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();