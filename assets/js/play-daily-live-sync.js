(function(){
  'use strict';

  const VERSION='play-daily-live-sync-20260718a-phase-3';
  const state={started:false,busy:false,signature:'',timer:0};

  function playActive(){return Boolean(document.getElementById('play')?.classList.contains('active-view'))&&!document.hidden;}
  function signature(board){return JSON.stringify([Number(board?.player_count)||0,...(Array.isArray(board?.rows)?board.rows:[]).map(row=>[row.display_name,row.official_score,row.best_score,row.attempt_count,row.rank])]);}

  function waitFor(check,timeout=15000){return new Promise((resolve,reject)=>{const start=Date.now();const tick=()=>{let value=null;try{value=check();}catch(_error){}if(value)return resolve(value);if(Date.now()-start>timeout)return reject(new Error('Daily leaderboard live sync did not load.'));setTimeout(tick,100);};tick();});}

  async function check(options={}){
    if(state.busy||(!playActive()&&!options.force))return false;
    const api=window.UFC_DAILY_LEADERBOARD;
    const shared=window.UFC_PLAY_SHARED;
    const daily=api?.daily||window.UFC_PLAY_DAILY_ROTATION?.dailyFor?.();
    if(!api?.refresh||!shared?.client||!daily?.scored)return false;
    state.busy=true;
    try{
      const context=api.context||await shared.dailyContext(daily.gameType,daily.gameVersion,daily.maxScore);
      if(!context?.challenge_day)return false;
      const {data,error}=await shared.client.rpc('play_daily_leaderboard',{p_game_type:daily.gameType,p_challenge_day:context.challenge_day,p_limit:50});
      if(error||!data?.ok)return false;
      const next=signature(data);
      if(options.force||!state.signature||next!==state.signature){
        state.signature=next;
        await api.refresh({show:Boolean(options.show)});
        return true;
      }
      return false;
    }finally{state.busy=false;}
  }

  function schedule(delay=250,options={}){clearTimeout(state.timer);state.timer=setTimeout(()=>void check(options),delay);}

  async function start(){
    if(state.started)return;
    state.started=true;
    try{await waitFor(()=>window.UFC_DAILY_LEADERBOARD?.refresh&&window.UFC_PLAY_SHARED?.client);}catch(_error){return;}
    schedule(300,{force:true});
    setInterval(()=>void check(),10000);
    window.addEventListener('octagon-hq:view-change',event=>{if(event.detail?.destination==='play')schedule(250);});
    window.addEventListener('ufc-play-game-complete',event=>{if(event.detail?.daily) schedule(700,{force:true,show:true});});
    window.addEventListener('ufc-play-daily-submitted',()=>schedule(700,{force:true,show:true}));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(300);});
  }

  window.UFC_DAILY_LEADERBOARD_LIVE={version:VERSION,check,schedule};
  document.documentElement.setAttribute('data-play-daily-live-sync',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
