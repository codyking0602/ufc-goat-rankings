(function(){
  'use strict';

  const VERSION='blind-rank-standalone-share-20260716a';
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  let creating=false;

  function toast(message){
    let node=document.getElementById('blindRankStandaloneToast');
    if(!node){
      node=document.createElement('div');
      node.id='blindRankStandaloneToast';
      node.setAttribute('role','status');
      node.style.cssText='position:fixed;left:50%;bottom:22px;z-index:4500;transform:translateX(-50%);max-width:calc(100% - 32px);border:1px solid rgba(249,115,22,.72);border-radius:999px;background:#101725;color:#fed7aa;padding:10px 14px;font:850 12px/1.25 system-ui;text-align:center;box-shadow:0 14px 42px rgba(0,0,0,.38)';
      document.body.appendChild(node);
    }
    node.textContent=message;
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.remove(),3000);
  }

  function fighterSnapshot(fighter,index){
    return {
      id:String(fighter?.id||`fighter-${index+1}`),
      name:String(fighter?.name||fighter?.fighter||`Fighter ${index+1}`),
      primaryDivision:String(fighter?.primaryDivision||fighter?.divisions?.[0]||''),
      divisions:Array.isArray(fighter?.divisions)?fighter.divisions:[],
      thumbUrl:String(fighter?.thumbUrl||''),
      profileUrl:String(fighter?.profileUrl||'')
    };
  }

  function exportChallenge(){
    const state=window.UFC_BLIND_RANK?.state;
    if(!state?.completed||!Array.isArray(state.lineup)||state.lineup.length!==5||!Array.isArray(state.placements)||state.placements.some(item=>!item))return null;
    const fighters=state.lineup.map(fighterSnapshot);
    return {
      setup:{
        packId:state.packId||'men-chaos',
        lineup:fighters.map(f=>f.id),
        fighterNames:fighters.map(f=>f.name),
        fighters
      },
      result:{ranking:state.placements.map(f=>f.id)}
    };
  }

  function standaloneUrl(code){
    const url=new URL('blind-rank-challenge.html',window.location.href);
    url.searchParams.set('code',String(code||'').trim().toUpperCase());
    url.searchParams.set('v','1');
    return url.toString();
  }

  async function createChallenge(trigger){
    if(creating)return;
    const exported=exportChallenge();
    if(!exported){toast('Finish all five placements first.');return;}
    if(!client){toast('Challenge sharing is not connected.');return;}
    creating=true;
    const original=trigger?.textContent||'CHALLENGE A FRIEND';
    if(trigger){trigger.disabled=true;trigger.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({
        title:'Create the Blind Rank challenge',
        description:'Use your existing Picks profile. Your exact five fighters, reveal order, and completed ranking will be saved for the friend link.'
      });
      if(!identity)return;
      if(trigger)trigger.textContent='CREATING LINK…';
      const {data,error}=await client.rpc('play_create_challenge',{
        p_game_type:'blind-rank',
        p_game_version:'blind-rank-standalone-v1',
        p_group_code:identity.groupCode,
        p_member_token:identity.memberToken,
        p_setup:exported.setup,
        p_result:exported.result,
        p_metadata:{comparison:'blind-rank-placement',route:'standalone',client:VERSION},
        p_expires_days:365
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge link could not be created.');
      const url=standaloneUrl(data.code);
      const text='Blind rank my exact five UFC fighters in the same reveal order, then compare our lists.';
      try{
        if(navigator.share)await navigator.share({title:'UFC Blind Rank 5 Challenge',text,url});
        else{await navigator.clipboard.writeText(`${text}\n\n${url}`);toast('Challenge link copied.');}
      }catch(error){
        if(error?.name==='AbortError')return;
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        toast('Challenge link copied.');
      }
    }catch(error){toast(String(error?.message||'Challenge link could not be created.'));}
    finally{creating=false;if(trigger){trigger.disabled=false;trigger.textContent=original;}}
  }

  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('[data-br-challenge]');
    if(!trigger)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    createChallenge(trigger);
  },true);

  document.documentElement.setAttribute('data-blind-rank-standalone-share',VERSION);
})();