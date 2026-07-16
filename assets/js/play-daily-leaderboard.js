(function(){
  'use strict';

  const VERSION='play-daily-leaderboard-20260715a';
  const GAME_TYPE='blind-resume';
  const GAME_VERSION='blind-resume-daily-v2';
  const MAX_SCORE=5;
  let loading=false;
  let lastContext=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function waitFor(check,timeout=12000){
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
    try{
      return new Intl.DateTimeFormat(undefined,{weekday:'long',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(new Date(`${day}T12:00:00-05:00`));
    }catch(_error){return day||'Today';}
  }

  function injectStyles(){
    if(document.getElementById('play-daily-leaderboard-css'))return;
    const style=document.createElement('style');
    style.id='play-daily-leaderboard-css';
    style.textContent=`
      #play .play-daily-actions{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,.85fr);gap:8px;margin-top:14px}#play .play-daily-actions .play-daily-button{margin:0}#play .play-daily-board-button{min-height:46px;border:1px solid #64748b;border-radius:13px;background:#101725;color:#f8fafc;padding:0 12px;font:950 10px/1 system-ui;letter-spacing:.045em;cursor:pointer}
      #playDailyLeaderboard{margin-top:12px;border:1px solid rgba(250,204,21,.52);border-radius:20px;background:linear-gradient(145deg,rgba(250,204,21,.08),rgba(249,115,22,.05)),#101725;padding:14px;color:#f8fafc}#playDailyLeaderboard[hidden]{display:none!important}
      #playDailyLeaderboard .daily-board-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}#playDailyLeaderboard .daily-board-head span{display:block;color:#f97316;font:950 9px/1 system-ui;letter-spacing:.13em}#playDailyLeaderboard .daily-board-head h3{margin:5px 0 0;color:#fff;font:950 24px/1 system-ui}#playDailyLeaderboard .daily-board-head p{margin:6px 0 0;color:#94a3b8;font:650 10px/1.35 system-ui}#playDailyLeaderboard .daily-board-controls{display:flex;gap:6px}#playDailyLeaderboard .daily-board-controls button{min-height:34px;border:1px solid #526786;border-radius:10px;background:#172033;color:#fff;padding:0 9px;font:900 9px/1 system-ui;cursor:pointer}
      #playDailyLeaderboard .daily-board-status{margin-top:12px;border:1px dashed #526786;border-radius:14px;padding:18px;text-align:center;color:#cbd5e1;font:750 11px/1.4 system-ui}#playDailyLeaderboard .daily-board-list{display:grid;gap:6px;margin-top:12px}#playDailyLeaderboard .daily-board-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto auto;gap:8px;align-items:center;border:1px solid #334155;border-radius:12px;background:#172033;padding:9px}#playDailyLeaderboard .daily-board-row.you{border-color:#f97316;box-shadow:inset 3px 0 0 #f97316}#playDailyLeaderboard .daily-board-row>b{color:#facc15;font-size:15px;text-align:center}#playDailyLeaderboard .daily-board-row strong{color:#fff;font-size:11px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#playDailyLeaderboard .daily-board-row span{color:#fde68a;font-size:10px;font-weight:900}#playDailyLeaderboard .daily-board-row small{color:#94a3b8;font-size:8px;text-align:right}#playDailyLeaderboard .daily-board-note{margin:10px 0 0;color:#94a3b8;font-size:9px;line-height:1.4;text-align:center}
      @media(max-width:650px){#play .play-daily-actions{grid-template-columns:1fr}#playDailyLeaderboard .daily-board-head{display:grid}#playDailyLeaderboard .daily-board-controls{width:100%}#playDailyLeaderboard .daily-board-controls button{flex:1}#playDailyLeaderboard .daily-board-row{grid-template-columns:34px minmax(0,1fr) auto}#playDailyLeaderboard .daily-board-row small{display:none}}
    `;
    document.head.appendChild(style);
  }

  function installButton(){
    const card=document.querySelector('#playHub .play-daily-card');
    const playButton=card?.querySelector('.play-daily-button');
    if(!card||!playButton)return false;
    let actions=card.querySelector('.play-daily-actions');
    if(!actions){
      actions=document.createElement('div');
      actions.className='play-daily-actions';
      playButton.parentElement.insertBefore(actions,playButton);
      actions.appendChild(playButton);
    }
    if(!actions.querySelector('[data-daily-board-open]')){
      const button=document.createElement('button');
      button.type='button';
      button.className='play-daily-board-button';
      button.dataset.dailyBoardOpen='true';
      button.textContent='VIEW LEADERBOARD';
      actions.appendChild(button);
    }
    return true;
  }

  function panel(){
    const hub=document.getElementById('playHub');
    const card=hub?.querySelector('.play-daily-card');
    if(!hub||!card)return null;
    let node=document.getElementById('playDailyLeaderboard');
    if(!node){
      node=document.createElement('section');
      node.id='playDailyLeaderboard';
      node.hidden=true;
      card.insertAdjacentElement('afterend',node);
    }
    return node;
  }

  function loadingMarkup(){
    return `<div class="daily-board-head"><div><span>TODAY'S CHALLENGE</span><h3>Daily Leaderboard</h3><p>Loading official first-attempt scores…</p></div></div><div class="daily-board-status">Checking today's results…</div>`;
  }

  function errorMarkup(message){
    return `<div class="daily-board-head"><div><span>TODAY'S CHALLENGE</span><h3>Daily Leaderboard</h3><p>${esc(message)}</p></div><div class="daily-board-controls"><button type="button" data-daily-board-refresh>TRY AGAIN</button><button type="button" data-daily-board-close>CLOSE</button></div></div>`;
  }

  function boardMarkup(board,identity){
    const rows=Array.isArray(board?.rows)?board.rows:[];
    const name=String(identity?.member?.display_name||'').trim().toLowerCase();
    const max=Number(board?.max_score)||MAX_SCORE;
    const head=`<div class="daily-board-head"><div><span>${esc(dateLabel(board?.challenge_day).toUpperCase())}</span><h3>Daily Leaderboard</h3><p>${Number(board?.player_count)||0} player${Number(board?.player_count)===1?'':'s'} completed today's Blind Resume.</p></div><div class="daily-board-controls"><button type="button" data-daily-board-refresh>REFRESH</button><button type="button" data-daily-board-close>CLOSE</button></div></div>`;
    if(!rows.length)return `${head}<div class="daily-board-status">No completed scores yet. Be the first on the board.</div><p class="daily-board-note">The first completed attempt is the official score. Replays update only the best score and attempt count.</p>`;
    return `${head}<div class="daily-board-list">${rows.slice(0,25).map(row=>{
      const isYou=name&&String(row.display_name||'').trim().toLowerCase()===name;
      return `<div class="daily-board-row${isYou?' you':''}"><b>#${Number(row.rank)||'—'}</b><strong>${esc(row.display_name)}${isYou?' · YOU':''}</strong><span>${Number(row.official_score)||0}/${Number(row.max_score)||max}</span><small>Best ${Number(row.best_score)||0}/${Number(row.max_score)||max} · ${Number(row.attempt_count)||1}x</small></div>`;
    }).join('')}</div><p class="daily-board-note">Rankings use official first-attempt scores with shared ties. Replays do not change the official score.</p>`;
  }

  async function fetchBoard(){
    const shared=window.UFC_PLAY_SHARED;
    if(!shared?.client)throw new Error('The shared leaderboard is not connected.');
    const context=await shared.dailyContext(GAME_TYPE,GAME_VERSION,MAX_SCORE);
    lastContext=context;
    const {data,error}=await shared.client.rpc('play_daily_leaderboard',{
      p_game_type:GAME_TYPE,
      p_challenge_day:context.challenge_day,
      p_limit:50
    });
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Leaderboard could not load.');
    let identity=null;
    try{identity=await shared.resolveIdentity?.();}catch(_error){}
    return {board:data,identity};
  }

  async function refreshBoard(){
    if(loading)return;
    const node=panel();
    if(!node)return;
    loading=true;
    node.hidden=false;
    node.innerHTML=loadingMarkup();
    node.scrollIntoView({behavior:'smooth',block:'start'});
    try{
      const {board,identity}=await fetchBoard();
      node.innerHTML=boardMarkup(board,identity);
    }catch(error){
      node.innerHTML=errorMarkup(String(error?.message||'Leaderboard could not load.'));
    }finally{loading=false;}
  }

  function closeBoard(){
    const node=panel();
    if(node)node.hidden=true;
  }

  async function install(){
    try{
      await waitFor(()=>window.UFC_PLAY_SHARED?.dailyContext&&document.querySelector('#playHub .play-daily-card'));
      injectStyles();
      installButton();
      document.addEventListener('click',event=>{
        if(event.target.closest?.('[data-daily-board-open]')){event.preventDefault();refreshBoard();return;}
        if(event.target.closest?.('[data-daily-board-refresh]')){event.preventDefault();refreshBoard();return;}
        if(event.target.closest?.('[data-daily-board-close]')){event.preventDefault();closeBoard();}
      });
      window.addEventListener('ufc-play-hub-ready',installButton);
      window.UFC_DAILY_LEADERBOARD={version:VERSION,refresh:refreshBoard,close:closeBoard,get context(){return lastContext;}};
      document.documentElement.setAttribute('data-play-daily-leaderboard',VERSION);
    }catch(error){console.error(error);}
  }

  install();
})();