(function(){
  'use strict';

  const VERSION='play-daily-service-20260718a-reliable-submit';
  const CANONICAL_CODE='GOAT26';
  const DEFAULT_GAME='find-leader';
  const DEFAULT_VERSION='find-leader-daily-v1';
  const DEFAULT_MAX=10;
  const DAILY_PREFIX='ufc-play:daily-completion:find-leader:';
  const PENDING_KEY='ufc-play:daily-pending-v2';
  const SENT_PREFIX='ufc-play:daily-sent-v2:';
  const adapters=new Map();
  const contextCache=new Map();
  const state={submitting:false,recovering:false,lastSignature:'',started:false};

  const config=window.UFC_PLAY_SUPABASE_CONFIG||window.UFC_SUPABASE_CONFIG||{};
  const fallbackClient=config.url&&config.anonKey&&window.supabase?.createClient
    ? window.supabase.createClient(config.url,config.anonKey)
    : null;

  const text=value=>String(value??'').trim();
  const readJson=(key,fallback=null)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch(_error){return fallback;}};
  const writeJson=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(_error){return false;}};
  const remove=key=>{try{localStorage.removeItem(key);}catch(_error){}};
  const client=()=>window.UFC_PLAY_PROFILE?.client||fallbackClient;
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token);

  function centralDay(date=new Date()){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return date.toISOString().slice(0,10);}
  }

  function hash(value){
    const source=typeof value==='string'?value:JSON.stringify(value||{});
    let output=2166136261;
    for(let index=0;index<source.length;index+=1){output^=source.charCodeAt(index);output=Math.imul(output,16777619);}
    return (output>>>0).toString(36);
  }

  function sentKey(day,identity,result){
    return `${SENT_PREFIX}${day}:${text(identity?.member?.id)||text(identity?.member?.display_name).toLowerCase()}:${hash(result)}`;
  }

  async function resolveIdentity(){
    return await window.UFC_PLAY_PROFILE?.resolve?.().catch(()=>null)||window.UFC_PLAY_PROFILE?.identity||null;
  }

  async function requireIdentity(options={}){
    const existing=await resolveIdentity();
    if(existing)return existing;
    return await window.UFC_PLAY_PROFILE?.require?.({
      title:options.title||"Sign in for today's leaderboard",
      description:options.description||'Your completed Find the Leader score will be saved to the shared leaderboard.'
    })||null;
  }

  async function dailyContext(gameType=DEFAULT_GAME,gameVersion=DEFAULT_VERSION,maxScore=DEFAULT_MAX){
    const game=text(gameType)||DEFAULT_GAME;
    const version=text(gameVersion)||DEFAULT_VERSION;
    const max=Math.max(1,Number(maxScore)||DEFAULT_MAX);
    const key=`${game}|${version}|${max}`;
    if(contextCache.has(key))return contextCache.get(key);
    const rpc=client();
    if(rpc){
      const {data,error}=await rpc.rpc('play_daily_context',{p_game_type:game,p_game_version:version,p_max_score:max});
      if(!error&&data?.ok){contextCache.set(key,data);return data;}
    }
    const day=centralDay();
    const fallback={ok:false,fallback:true,game_type:game,game_version:version,challenge_day:day,challenge_key:`${game}:${day}`,seed:`${game}|${day}|${version}|daily-v2`,max_score:max,timezone:'America/Chicago'};
    contextCache.set(key,fallback);
    return fallback;
  }

  async function prepareDaily(gameType=DEFAULT_GAME){
    const adapter=adapters.get(text(gameType).toLowerCase());
    const version=text(adapter?.daily?.version||adapter?.version)||DEFAULT_VERSION;
    const max=Number(adapter?.daily?.maxScore)||DEFAULT_MAX;
    const [context,identity]=await Promise.all([
      dailyContext(gameType,version,max),
      requireIdentity()
    ]);
    return identity?{context,identity}:null;
  }

  function registerAdapter(adapter){
    if(!adapter?.id)return null;
    const normalized={version:'1',...adapter,id:text(adapter.id).toLowerCase()};
    adapters.set(normalized.id,normalized);
    window.dispatchEvent(new CustomEvent('ufc-play-adapter-ready',{detail:{id:normalized.id,version:normalized.version}}));
    return normalized;
  }

  function adapterFor(id){return adapters.get(text(id).toLowerCase())||null;}
  function markDailyReplay(){return true;}

  async function dailyLeaderboard(gameType=DEFAULT_GAME,day=centralDay()){
    const rpc=client();
    if(!rpc)throw new Error('The shared leaderboard is not connected.');
    const {data,error}=await rpc.rpc('play_daily_leaderboard',{p_game_type:gameType,p_challenge_day:day,p_limit:100});
    if(error)throw error;
    return data;
  }

  function localCompletion(day=centralDay()){
    const saved=readJson(`${DAILY_PREFIX}${day}`,null);
    if(!saved?.completed)return null;
    const score=Number(saved.score);
    if(!Number.isFinite(score))return null;
    return{
      gameType:DEFAULT_GAME,
      gameVersion:DEFAULT_VERSION,
      day,
      score,
      maxScore:Number(saved.total)||DEFAULT_MAX,
      result:{score,recovered_from_device:true,completed_at:saved.completedAt||null},
      completedAt:saved.completedAt||null,
      recovered:true
    };
  }

  function pendingPayload(){const value=readJson(PENDING_KEY,null);return value&&value.gameType&&Number.isFinite(Number(value.score))?value:null;}
  function savePending(payload){writeJson(PENDING_KEY,payload);}

  async function alreadyOnBoard(identity,payload){
    try{
      const board=await dailyLeaderboard(payload.gameType,payload.day);
      const memberId=text(identity?.member?.id);
      const display=text(identity?.member?.display_name).toLowerCase();
      return (Array.isArray(board?.rows)?board.rows:[]).some(row=>
        (memberId&&text(row.member_id)===memberId)||
        (display&&text(row.display_name).toLowerCase()===display)
      );
    }catch(_error){return false;}
  }

  function notifySubmitted(data,payload){
    window.dispatchEvent(new CustomEvent('ufc-play-daily-submitted',{detail:{data,payload}}));
    window.UFC_DAILY_LEADERBOARD_LIVE?.schedule?.(180,{force:true,show:Boolean(payload.showBoard)});
    window.setTimeout(()=>window.UFC_DAILY_LEADERBOARD?.refresh?.({show:Boolean(payload.showBoard)}),220);
  }

  async function submit(payload,{checkExisting=false}={}){
    if(state.submitting)return false;
    const rpc=client();
    if(!rpc){savePending(payload);return false;}
    const identity=await resolveIdentity();
    if(!identity){savePending(payload);return false;}
    const marker=sentKey(payload.day,identity,payload.result);
    if(localStorage.getItem(marker))return true;
    if(checkExisting&&await alreadyOnBoard(identity,payload)){
      try{localStorage.setItem(marker,'existing');}catch(_error){}
      remove(PENDING_KEY);
      notifySubmitted(null,payload);
      return true;
    }

    state.submitting=true;
    try{
      const {data,error}=await rpc.rpc('play_submit_daily_attempt',{
        p_game_type:payload.gameType,
        p_game_version:payload.gameVersion,
        p_group_code:identity.groupCode||CANONICAL_CODE,
        p_member_token:tokenFor(identity),
        p_score:Number(payload.score),
        p_result:payload.result||{score:Number(payload.score)},
        p_max_score:Number(payload.maxScore)||DEFAULT_MAX
      });
      if(error||!data?.ok)throw error||new Error(data?.error||'Daily score was not saved.');
      try{localStorage.setItem(marker,new Date().toISOString());}catch(_error){}
      remove(PENDING_KEY);
      notifySubmitted(data,payload);
      return true;
    }catch(error){
      console.error('Daily score submission failed',error);
      savePending(payload);
      return false;
    }finally{state.submitting=false;}
  }

  async function recoverCurrentDay(){
    if(state.recovering)return false;
    state.recovering=true;
    try{
      const payload=pendingPayload()||localCompletion();
      if(!payload)return false;
      const identity=await resolveIdentity();
      if(!identity)return false;
      return await submit(payload,{checkExisting:true});
    }finally{state.recovering=false;}
  }

  function completionPayload(detail={}){
    if(!detail.daily||text(detail.gameType||detail.game_type)!==DEFAULT_GAME)return null;
    const day=text(window.UFC_PLAY_DAILY_ROTATION?.context?.challenge_day||window.UFC_PLAY_HUB?.dailyChallenge?.challengeDay)||centralDay();
    const score=Number(detail.score??detail.result?.score);
    if(!Number.isFinite(score))return null;
    return{
      gameType:DEFAULT_GAME,
      gameVersion:DEFAULT_VERSION,
      day,
      score,
      maxScore:Number(detail.maxScore??detail.max_score)||DEFAULT_MAX,
      result:detail.result||{score},
      completedAt:new Date().toISOString(),
      showBoard:true,
      recovered:false
    };
  }

  function onComplete(detail={}){
    const payload=completionPayload(detail);
    if(!payload)return;
    const signature=`${payload.day}|${payload.score}|${hash(payload.result)}`;
    if(state.lastSignature===signature)return;
    state.lastSignature=signature;
    savePending(payload);
    void submit(payload);
  }

  function start(){
    if(state.started)return;
    state.started=true;
    window.addEventListener('ufc-play-game-complete',event=>onComplete(event.detail||{}));
    window.addEventListener('ufc-play-profile-ready',()=>window.setTimeout(recoverCurrentDay,120));
    window.addEventListener('online',()=>void recoverCurrentDay());
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)void recoverCurrentDay();});
    [300,1400,5000].forEach(delay=>window.setTimeout(recoverCurrentDay,delay));
  }

  const api=window.UFC_PLAY_SHARED||{};
  Object.assign(api,{version:VERSION,client:client(),registerAdapter,adapterFor,resolveIdentity,requireIdentity,dailyContext,dailyLeaderboard,prepareDaily,markDailyReplay,checkCompletion:recoverCurrentDay,recoverCurrentDay,submitDaily:submit});
  window.UFC_PLAY_SHARED=api;
  window.UFC_PLAY_DAILY_SERVICE=api;
  document.documentElement.setAttribute('data-play-daily-service',VERSION);
  window.dispatchEvent(new CustomEvent('ufc-play-shared-ready',{detail:{version:VERSION,dailyOnly:true}}));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
