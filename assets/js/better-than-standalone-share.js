(function(){
  'use strict';

  const VERSION='better-than-standalone-share-20260716c-find-leader-nav';
  let creating=false;

  function loadFindLeaderAssets(){
    if(!document.querySelector('link[data-find-leader-style]')){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href='assets/css/find-leader.css?v=find-leader-css-20260716a-local-audited-stats';
      link.dataset.findLeaderStyle='true';
      document.head.appendChild(link);
    }
    if(window.UFC_FIND_LEADER||document.querySelector('script[data-find-leader-script]'))return;
    const script=document.createElement('script');
    script.src='assets/js/find-leader.js?v=find-leader-20260716a-local-audited-stats';
    script.dataset.findLeaderScript='true';
    document.head.appendChild(script);
  }

  function toast(message,type=''){
    let node=document.getElementById('betterThanShareToast');
    if(!node){
      node=document.createElement('div');
      node.id='betterThanShareToast';
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
    const url=new URL('better-than-challenge.html',window.location.href);
    url.searchParams.set('code',String(code||'').trim().toUpperCase());
    url.searchParams.set('v','1');
    return url.toString();
  }

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
    const exported=window.UFC_BETTER_THAN?.exportChallenge?.();
    if(!exported){toast('Lock your exact Better Than claim first.');return;}
    const profile=window.UFC_PLAY_PROFILE;
    const client=profile?.client;
    if(!client){toast('Challenge sharing is not connected.');return;}
    creating=true;
    const original=trigger?.textContent||'CHALLENGE A FRIEND';
    if(trigger){trigger.disabled=true;trigger.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({
        title:'Create the Better Than challenge',
        description:'Use your existing Picks profile. Your claim setup, number, and exact fighter list will stay hidden until your friend submits.'
      });
      if(!identity)return;
      if(trigger)trigger.textContent='CREATING LINK…';
      const {data,error}=await client.rpc('play_create_challenge',{
        p_game_type:'better-than',
        p_game_version:'better-than-subjective-v1',
        p_group_code:identity.groupCode,
        p_member_token:identity.memberToken,
        p_setup:exported.setup,
        p_result:exported.result,
        p_metadata:{comparison:'better-than-subjective-claim',route:'standalone',client:VERSION},
        p_expires_days:365
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge link could not be created.');
      const outcome=await shareOneLink(standaloneUrl(data.code));
      if(outcome==='copied')toast('Challenge link copied. Send it to your friend.','success');
      else if(outcome==='cancelled')toast('Challenge created. Tap Challenge a Friend again when you are ready to share.','ready');
      else toast('Challenge link ready.','success');
    }catch(error){toast(String(error?.message||'Challenge link could not be created.'),'error');}
    finally{creating=false;if(trigger){trigger.disabled=false;trigger.textContent=original;}}
  }

  document.addEventListener('click',event=>{
    const findLeaderHome=event.target.closest?.('#playFindLeaderPanel [data-play-home]');
    if(findLeaderHome){
      event.preventDefault();
      window.UFC_PLAY_HUB?.showHub?.();
      return;
    }
    const trigger=event.target.closest?.('[data-better-than-challenge]');
    if(!trigger)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    createChallenge(trigger);
  },true);

  loadFindLeaderAssets();
  document.documentElement.setAttribute('data-better-than-standalone-share',VERSION);
})();