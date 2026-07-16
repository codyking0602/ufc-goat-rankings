(function(){
  'use strict';

  const VERSION='find-leader-standalone-share-20260716a-elimination';
  let creating=false;
  let createdUrl='';
  let createdKey='';

  function toast(message,type=''){
    let node=document.getElementById('findLeaderShareToast');
    if(!node){
      node=document.createElement('div');
      node.id='findLeaderShareToast';
      node.setAttribute('role','status');
      node.style.cssText='position:fixed;left:50%;bottom:22px;z-index:4500;transform:translateX(-50%);max-width:calc(100% - 32px);border:1px solid rgba(249,115,22,.72);border-radius:999px;background:#101725;color:#fed7aa;padding:10px 14px;font:850 12px/1.25 system-ui;text-align:center;box-shadow:0 14px 42px rgba(0,0,0,.38)';
      document.body.appendChild(node);
    }
    node.textContent=message;
    node.dataset.type=type;
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.remove(),3400);
  }

  function standaloneUrl(code){
    const url=new URL('find-leader-challenge.html',window.location.href);
    url.searchParams.set('code',String(code||'').trim().toUpperCase());
    url.searchParams.set('v','1');
    return url.toString();
  }

  function keyFor(exported){return JSON.stringify([exported?.setup?.questionId,exported?.setup?.candidates?.map(row=>row.id),exported?.result]);}

  async function shareOneLink(url){
    if(navigator.share){
      try{await navigator.share({url});return 'shared';}
      catch(error){if(error?.name==='AbortError')return 'cancelled';throw error;}
    }
    await navigator.clipboard.writeText(url);
    return 'copied';
  }

  async function createChallenge(trigger){
    if(creating)return;
    const exported=window.UFC_FIND_LEADER?.exportChallenge?.();
    if(!exported){toast('Finish the Find the Leader board first.');return;}
    const profile=window.UFC_PLAY_PROFILE;
    const client=profile?.client;
    if(!client){toast('Challenge sharing is not connected.');return;}
    const key=keyFor(exported);
    if(key!==createdKey){createdKey=key;createdUrl='';}
    creating=true;
    const original=trigger?.textContent||'CHALLENGE A FRIEND';
    if(trigger){trigger.disabled=true;trigger.textContent=createdUrl?'OPENING SHARE…':'CONNECTING PROFILE…';}
    try{
      if(!createdUrl){
        const identity=await profile.require({
          title:'Create the Find the Leader challenge',
          description:'Use your existing Picks profile. Your exact question, ten fighters, tile order, and completed elimination run will be frozen for your friend.'
        });
        if(!identity)return;
        if(trigger)trigger.textContent='CREATING LINK…';
        const {data,error}=await client.rpc('play_create_challenge',{
          p_game_type:'find-leader',
          p_game_version:'find-leader-elimination-v1',
          p_group_code:identity.groupCode,
          p_member_token:identity.memberToken,
          p_setup:exported.setup,
          p_result:exported.result,
          p_metadata:{comparison:'find-leader-elimination',route:'standalone',score:exported.result.score,client:VERSION},
          p_expires_days:365
        });
        if(error)throw error;
        if(!data?.ok)throw new Error(data?.error||'Challenge link could not be created.');
        createdUrl=standaloneUrl(data.code);
      }
      if(trigger)trigger.textContent='SHARING LINK…';
      const outcome=await shareOneLink(createdUrl);
      if(outcome==='copied')toast('Challenge link copied. Send it to your friend.','success');
      else if(outcome==='cancelled')toast('Challenge created. Tap Challenge a Friend again when you are ready to share.','ready');
      else toast('Challenge link ready.','success');
    }catch(error){toast(String(error?.message||'Challenge link could not be created.'),'error');}
    finally{creating=false;if(trigger){trigger.disabled=false;trigger.textContent=original;}}
  }

  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('[data-find-leader-challenge]');
    if(!trigger)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    createChallenge(trigger);
  },true);

  document.documentElement.setAttribute('data-find-leader-standalone-share',VERSION);
})();
