(function(){
  'use strict';

  const VERSION='play-challenge-compat-20260715b-full-ready-identity';
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const ACTIVE_GROUP_KEY='ufc-player:group-code';

  function waitFor(check,timeout=18000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{
        const value=check();
        if(value){resolve(value);return;}
        if(Date.now()-started>timeout){reject(new Error('Play challenge tools did not finish loading.'));return;}
        setTimeout(tick,80);
      };
      tick();
    });
  }

  function normalizeCode(value){return String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);}

  function normalizeSetup(setup){
    let value=setup;
    if(typeof value==='string'){
      try{value=JSON.parse(value);}catch(_error){value={};}
    }
    if(value&&typeof value==='object'&&value.setup&&typeof value.setup==='object')value=value.setup;
    return value&&typeof value==='object'?value:{};
  }

  function fighterEntries(setup){
    const value=normalizeSetup(setup);
    if(Array.isArray(value.fighters)){
      return value.fighters.map(entry=>typeof entry==='string'?{id:entry,name:entry}:{id:entry?.id||'',name:entry?.name||entry?.fighter||''});
    }
    const lineup=Array.isArray(value.lineup)?value.lineup:Array.isArray(value)?value:[];
    const names=Array.isArray(value.fighterNames)?value.fighterNames:Array.isArray(value.names)?value.names:[];
    return lineup.map((entry,index)=>typeof entry==='string'
      ? {id:entry,name:names[index]||''}
      : {id:entry?.id||'',name:entry?.name||entry?.fighter||names[index]||''});
  }

  function resolveLineup(data,setup,count){
    const entries=fighterEntries(setup);
    if(entries.length!==count)return [];
    const resolved=entries.map(entry=>data.resolve(entry.id)||data.resolve(entry.name));
    return resolved.some(fighter=>!fighter)?[]:resolved;
  }

  function fullPlayData(){
    const data=window.UFC_PLAY_DATA;
    const pipeline=window.UFC_SCORING_PIPELINE;
    const pipelineReady=pipeline?.status==='ready'||document.documentElement.getAttribute('data-scoring-pipeline')==='ready';
    const expected=Number(pipeline?.fighterCount)||Number(window.UFC_PRODUCTION_RANKING_BOOTSTRAP?.report?.fighterCount)||75;
    const ranked=Number(data?.audit?.modelRanked)||0;
    if(!pipelineReady||!data?.allFighters?.length||ranked<expected)return null;
    return data;
  }

  async function activatePlay(){
    document.querySelector('.tab[data-view="play"]')?.click();
    await new Promise(resolve=>setTimeout(resolve,50));
  }

  function shareCopy(message,url){
    return typeof navigator.share==='function'?message:`${message}\n\n${url}`;
  }

  function storedAccess(){
    const entries=[];
    try{
      const active=normalizeCode(localStorage.getItem(ACTIVE_GROUP_KEY));
      if(active){
        const token=localStorage.getItem(`${GROUP_TOKEN_PREFIX}${active}`)||'';
        if(token)entries.push({code:active,token});
      }
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(GROUP_TOKEN_PREFIX))continue;
        const code=normalizeCode(key.slice(GROUP_TOKEN_PREFIX.length));
        const token=localStorage.getItem(key)||'';
        if(code&&token&&!entries.some(row=>row.code===code))entries.push({code,token});
      }
    }catch(_error){}
    return entries;
  }

  function invalidateAccess(code){
    const normalized=normalizeCode(code);
    if(!normalized)return;
    try{
      localStorage.removeItem(`${GROUP_TOKEN_PREFIX}${normalized}`);
      if(normalizeCode(localStorage.getItem(ACTIVE_GROUP_KEY))===normalized)localStorage.removeItem(ACTIVE_GROUP_KEY);
    }catch(_error){}
  }

  async function validateStoredIdentity(shared){
    if(!shared?.client)return null;
    for(const access of storedAccess()){
      try{
        const {data,error}=await shared.client.rpc('play_identity_snapshot',{
          p_group_code:access.code,
          p_member_token:access.token
        });
        if(error)throw error;
        if(data?.ok)return {...data,groupCode:access.code,memberToken:access.token};
        invalidateAccess(access.code);
      }catch(error){
        const message=String(error?.message||'');
        if(/schema cache|play_identity_snapshot|does not exist/i.test(message))throw error;
        invalidateAccess(access.code);
      }
    }
    return null;
  }

  async function ensureFreshIdentity(shared,title){
    const valid=await validateStoredIdentity(shared).catch(()=>null);
    if(valid)return valid;
    return shared.requireIdentity?.({
      title:title||'Sign in with your Picks profile',
      description:'Use the same group code, display name, and PIN from Picks. This reconnects this browser to your profile.'
    });
  }

  function patchKeepCut(shared){
    const adapter=shared.adapterFor('keep-cut');
    if(!adapter||adapter.__compatPatched)return;

    adapter.version='keep-cut-v4';
    adapter.shareText=({url})=>shareCopy('Keep four and cut four from my exact UFC lineup. Every decision locks.',url);
    adapter.exportSetup=()=>{
      const state=window.UFC_KEEP_CUT?.state;
      if(!Array.isArray(state?.lineup)||state.lineup.length!==8)return null;
      const fighters=state.lineup.map(fighter=>({id:String(fighter?.id||''),name:String(fighter?.name||fighter?.fighter||'')}));
      if(fighters.some(fighter=>!fighter.id&&!fighter.name))return null;
      return {
        packId:state.packId||'ufc-careers',
        lineup:fighters.map(fighter=>fighter.id||fighter.name),
        fighterNames:fighters.map(fighter=>fighter.name),
        fighters
      };
    };
    adapter.openSetup=async setup=>{
      const game=await waitFor(()=>window.UFC_KEEP_CUT);
      const data=await waitFor(fullPlayData);
      const normalized=normalizeSetup(setup);
      const lineup=resolveLineup(data,normalized,8);
      if(lineup.length!==8)throw new Error('This Keep 4, Cut 4 link is missing fighter data. Create and send a new challenge link.');
      await activatePlay();
      game.open({lineup,packId:normalized.packId||normalized.pack_id||'ufc-careers',shared:true});
    };
    adapter.matchesSetup=setup=>{
      const data=fullPlayData();
      const current=window.UFC_KEEP_CUT?.state?.lineup||[];
      if(!data||current.length!==8)return false;
      const expected=resolveLineup(data,setup,8);
      return expected.length===8&&current.map(fighter=>fighter.id).join('|')===expected.map(fighter=>fighter.id).join('|');
    };
    adapter.__compatPatched=true;
  }

  function patchBlindRank(shared){
    const adapter=shared.adapterFor('blind-rank');
    if(!adapter||adapter.__compatPatched)return;

    adapter.version='blind-rank-v4';
    adapter.shareText=({url})=>shareCopy('Blind rank my exact five UFC fighters in the same reveal order, then compare our lists.',url);
    adapter.exportSetup=()=>{
      const state=window.UFC_BLIND_RANK?.state;
      if(!Array.isArray(state?.lineup)||state.lineup.length!==5)return null;
      const fighters=state.lineup.map(fighter=>({id:String(fighter?.id||''),name:String(fighter?.name||fighter?.fighter||'')}));
      return {
        packId:state.packId||'ufc-careers',
        lineup:fighters.map(fighter=>fighter.id||fighter.name),
        fighterNames:fighters.map(fighter=>fighter.name),
        fighters
      };
    };
    adapter.openSetup=async setup=>{
      const game=await waitFor(()=>window.UFC_BLIND_RANK);
      const data=await waitFor(fullPlayData);
      const normalized=normalizeSetup(setup);
      const lineup=resolveLineup(data,normalized,5);
      if(lineup.length!==5)throw new Error('This Blind Rank link is missing fighter data. Create and send a new challenge link.');
      await activatePlay();
      game.open({lineup,packId:normalized.packId||normalized.pack_id||'ufc-careers',shared:true});
    };
    adapter.matchesSetup=setup=>{
      const data=fullPlayData();
      const current=window.UFC_BLIND_RANK?.state?.lineup||[];
      if(!data||current.length!==5)return false;
      const expected=resolveLineup(data,setup,5);
      return expected.length===5&&current.map(fighter=>fighter.id).join('|')===expected.map(fighter=>fighter.id).join('|');
    };
    adapter.__compatPatched=true;
  }

  function ownChallengeClicks(shared){
    const entries=[
      {id:'keep-cut',selector:'[data-kc-challenge]'},
      {id:'blind-rank',selector:'[data-br-challenge]'},
      {id:'blind-resume',selector:'[data-five-round-share]'}
    ];

    entries.forEach(entry=>{
      const adapter=shared.adapterFor(entry.id);
      if(adapter)adapter.challengeSelector='';
    });

    document.addEventListener('click',async event=>{
      const entry=entries.find(row=>event.target.closest?.(row.selector));
      if(!entry)return;
      const adapter=shared.adapterFor(entry.id);
      if(!adapter)return;
      if(adapter.shouldHandleChallenge&&!adapter.shouldHandleChallenge(event.target,event))return;
      event.preventDefault();
      event.stopImmediatePropagation();

      if(adapter.canChallenge&&!adapter.canChallenge()){
        shared.createChallenge(entry.id);
        return;
      }

      const identity=await ensureFreshIdentity(shared,'Sign in to create the challenge');
      if(!identity)return;
      shared.createChallenge(entry.id);
    },true);
  }

  async function install(){
    try{
      const shared=await waitFor(()=>window.UFC_PLAY_SHARED?.adapterFor?window.UFC_PLAY_SHARED:null);
      await waitFor(()=>shared.adapterFor('keep-cut')&&shared.adapterFor('blind-rank')&&shared.adapterFor('blind-resume'));
      await validateStoredIdentity(shared).catch(()=>null);
      patchKeepCut(shared);
      patchBlindRank(shared);
      ownChallengeClicks(shared);
      document.documentElement.setAttribute('data-play-challenge-compat',VERSION);
    }catch(error){console.error(error);}
  }

  install();
})();