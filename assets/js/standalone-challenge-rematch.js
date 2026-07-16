(function(){
  'use strict';

  const VERSION='standalone-challenge-rematch-20260716a';
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  const statusNode=document.getElementById('challengeStatus');
  let creating=false;
  let createdUrl='';
  let contextKey='';

  function setStatus(message,type=''){
    if(!statusNode)return;
    statusNode.textContent=message;
    statusNode.dataset.type=type;
  }

  function cleanCode(value){
    return String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  }

  function context(){
    const value=window.UFC_STANDALONE_REMATCH_CONTEXT;
    if(!value||!value.gameType||!value.page||!value.setup||!value.result)return null;
    return value;
  }

  function keyFor(value){
    return [value.gameType,value.originalCode||'',JSON.stringify(value.result)].join('|');
  }

  function challengeUrl(page,code){
    const url=new URL(page,window.location.href);
    url.searchParams.set('code',cleanCode(code));
    url.searchParams.set('v','1');
    return url.toString();
  }

  async function shareOneLink(url){
    if(navigator.share){
      try{
        await navigator.share({url});
        return 'shared';
      }catch(error){
        if(error?.name==='AbortError')return 'cancelled';
        throw error;
      }
    }
    await navigator.clipboard.writeText(url);
    return 'copied';
  }

  async function challengeBack(button){
    if(creating)return;
    const rematch=context();
    if(!rematch){setStatus('The rematch card is not ready yet.','error');return;}
    if(!client){setStatus('Challenge sharing is not connected.','error');return;}

    const nextKey=keyFor(rematch);
    if(nextKey!==contextKey){
      contextKey=nextKey;
      createdUrl='';
    }

    creating=true;
    const original=button?.textContent||'CHALLENGE BACK';
    if(button){button.disabled=true;button.textContent=createdUrl?'OPENING SHARE…':'CONNECTING PROFILE…';}

    try{
      if(!createdUrl){
        const identity=await profile.require({
          title:'Run the challenge back',
          description:'Use your existing Picks profile. Your completed result becomes the new challenger card with the exact same fighters and reveal order.'
        });
        if(!identity)return;
        if(button)button.textContent='CREATING REMATCH…';

        const metadata={
          ...(rematch.metadata||{}),
          route:'standalone',
          rematchOf:cleanCode(rematch.originalCode),
          client:VERSION
        };
        const {data,error}=await client.rpc('play_create_challenge',{
          p_game_type:rematch.gameType,
          p_game_version:rematch.gameVersion||`${rematch.gameType}-standalone-v1`,
          p_group_code:identity.groupCode,
          p_member_token:identity.memberToken,
          p_setup:rematch.setup,
          p_result:rematch.result,
          p_metadata:metadata,
          p_expires_days:365
        });
        if(error)throw error;
        if(!data?.ok)throw new Error(data?.error||'The challenge-back link could not be created.');
        createdUrl=challengeUrl(rematch.page,data.code);
      }

      if(button)button.textContent='SHARING LINK…';
      const outcome=await shareOneLink(createdUrl);
      if(outcome==='copied')setStatus('Challenge-back link copied. Send it to your friend.','success');
      else if(outcome==='cancelled')setStatus('Rematch link is ready. Tap Challenge Back whenever you are ready to share it.','ready');
      else setStatus('Challenge-back link ready.','success');
    }catch(error){
      setStatus(String(error?.message||'The challenge-back link could not be created.'),'error');
    }finally{
      creating=false;
      if(button){button.disabled=false;button.textContent=original;}
    }
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-challenge-back]');
    if(!button)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    challengeBack(button);
  },true);

  document.documentElement.setAttribute('data-standalone-rematch',VERSION);
})();
