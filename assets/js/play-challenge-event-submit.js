(function(){
  'use strict';

  const VERSION='play-challenge-event-submit-20260715k';
  const SESSION_KEY='ufc-play:active-challenge-v2';
  let submitting=false;
  let lastFingerprint='';
  let checkTimers=[];

  const normalizeCode=value=>String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);

  function challengeCodeFromUrl(){
    const url=new URL(window.location.href);
    const query=normalizeCode(url.searchParams.get('challenge'));
    if(query)return query;
    const match=String(url.hash||'').match(/(?:^#|[&#])challenge=([A-Z0-9]{4,10})/i);
    return normalizeCode(match?.[1]);
  }

  const challengeCode=challengeCodeFromUrl();
  if(!challengeCode)return;

  function activeChallenge(){
    try{
      const value=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');
      return value&&normalizeCode(value.code)===challengeCode?value:null;
    }catch(_error){return null;}
  }

  function saveChallenge(challenge){
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(challenge));}catch(_error){}
  }

  function showStatus(message){
    let node=document.getElementById('playChallengeEventStatus');
    if(!node){
      node=document.createElement('div');
      node.id='playChallengeEventStatus';
      node.setAttribute('role','status');
      node.style.cssText='position:fixed;left:50%;bottom:22px;z-index:3200;transform:translateX(-50%);max-width:calc(100% - 32px);border:1px solid rgba(249,115,22,.7);border-radius:999px;background:#101725;color:#fed7aa;padding:9px 13px;font:800 11px/1.25 system-ui;text-align:center;box-shadow:0 12px 36px rgba(0,0,0,.35)';
      document.body.appendChild(node);
    }
    node.textContent=message;
    clearTimeout(showStatus.timer);
    showStatus.timer=setTimeout(()=>node.remove(),2600);
  }

  function releaseRouteWhenReady(){
    const shared=window.UFC_PLAY_SHARED;
    const challenge=activeChallenge();
    if(!shared?.adapterFor||!challenge)return false;
    const adapter=shared.adapterFor(challenge.game_type);
    if(!adapter)return false;
    let matches=true;
    try{if(adapter.matchesSetup)matches=Boolean(adapter.matchesSetup(challenge.setup));}
    catch(_error){matches=false;}
    if(!matches)return false;
    window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE=false;
    document.documentElement.setAttribute('data-play-challenge-open','true');
    return true;
  }

  async function submitIfComplete(){
    releaseRouteWhenReady();
    if(submitting)return;

    const shared=window.UFC_PLAY_SHARED;
    const challenge=activeChallenge();
    if(!shared?.client||!shared?.adapterFor||!challenge||challenge.submitted)return;

    const adapter=shared.adapterFor(challenge.game_type);
    if(!adapter)return;

    try{
      if(!adapter.isComplete?.())return;
      if(adapter.matchesSetup&&!adapter.matchesSetup(challenge.setup))return;
    }catch(_error){return;}

    let result;
    let score=null;
    try{
      result=adapter.exportResult?.();
      score=adapter.exportScore?.();
    }catch(_error){return;}
    if(!result)return;

    const fingerprint=JSON.stringify(result);
    if(!fingerprint||fingerprint===lastFingerprint)return;
    lastFingerprint=fingerprint;
    submitting=true;

    try{
      const identity=await shared.resolveIdentity?.(challenge.creator_group_code||'');
      if(!identity)throw new Error('Your Picks profile needs to be reconnected before the comparison can load.');

      const {data,error}=await shared.client.rpc('play_submit_challenge',{
        p_challenge_code:challenge.code,
        p_group_code:identity.groupCode,
        p_member_token:identity.memberToken,
        p_result:result,
        p_score:Number.isFinite(Number(score))?Number(score):null,
        p_metadata:adapter.exportResponseMetadata?.()||{}
      });
      if(error||!data?.ok)throw error||new Error(data?.error||'Comparison could not load.');

      challenge.submitted=true;
      saveChallenge(challenge);
      adapter.renderComparison?.(data);
      window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE=false;
      window.dispatchEvent(new CustomEvent('ufc-play-challenge-submitted',{detail:{code:challenge.code,gameType:challenge.game_type}}));
    }catch(error){
      lastFingerprint='';
      showStatus(String(error?.message||'Comparison could not load.'));
    }finally{
      submitting=false;
    }
  }

  function scheduleChecks(){
    checkTimers.forEach(timer=>clearTimeout(timer));
    checkTimers=[120,360,760].map(delay=>setTimeout(submitIfComplete,delay));
  }

  document.addEventListener('click',scheduleChecks,true);
  window.addEventListener('ufc-play-state-changed',scheduleChecks);
  window.addEventListener('ufc-play-game-complete',scheduleChecks);
  window.addEventListener('ufc-play-adapter-ready',scheduleChecks);
  window.addEventListener('ufc-play-shared-ready',scheduleChecks);
  setTimeout(scheduleChecks,250);
  setTimeout(scheduleChecks,1200);

  document.documentElement.setAttribute('data-play-challenge-event-submit',VERSION);
})();
