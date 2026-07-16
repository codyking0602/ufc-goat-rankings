(function(){
  'use strict';

  const VERSION='keep-cut-standalone-share-20260716c-blind-resume-loader';
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  let creating=false;

  function toast(message){
    let node=document.getElementById('keepCutShareToast');
    if(!node){
      node=document.createElement('div');
      node.id='keepCutShareToast';
      node.setAttribute('role','status');
      node.style.cssText='position:fixed;left:50%;bottom:22px;z-index:4500;transform:translateX(-50%);max-width:calc(100% - 32px);border:1px solid rgba(249,115,22,.72);border-radius:999px;background:#101725;color:#fed7aa;padding:10px 14px;font:850 12px/1.25 system-ui;text-align:center;box-shadow:0 14px 42px rgba(0,0,0,.38)';
      document.body.appendChild(node);
    }
    node.textContent=message;
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.remove(),3000);
  }

  function challengeCodeFromUrl(){
    const url=new URL(window.location.href);
    return String(url.searchParams.get('challenge')||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  }

  function redirectIncomingLegacyLink(){
    const code=challengeCodeFromUrl();
    if(!code)return false;
    const target=new URL('challenge.html',window.location.href);
    target.searchParams.set('code',code);
    target.searchParams.set('v','1');
    window.location.replace(target.toString());
    return true;
  }

  function decisionArray(state){
    if(!state?.completed||!Array.isArray(state.decisions)||state.decisions.length!==8)return null;
    const result=Array(8).fill('');
    state.decisions.forEach(row=>{
      const index=Number(row?.revealIndex);
      if(index<0||index>7)return;
      result[index]=row.choice==='keep'?'K':row.choice==='cut'?'C':'';
    });
    return result.every(Boolean)?result:null;
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
    const state=window.UFC_KEEP_CUT?.state;
    const decisions=decisionArray(state);
    if(!decisions||!Array.isArray(state?.lineup)||state.lineup.length!==8)return null;
    const fighters=state.lineup.map(fighterSnapshot);
    return {
      setup:{packId:state.packId||'ufc-careers',lineup:fighters.map(fighter=>fighter.id),fighterNames:fighters.map(fighter=>fighter.name),fighters},
      result:{decisions}
    };
  }

  function standaloneUrl(code){
    const url=new URL('challenge.html',window.location.href);
    url.searchParams.set('code',String(code||'').trim().toUpperCase());
    url.searchParams.set('v','1');
    return url.toString();
  }

  async function createChallenge(trigger){
    if(creating)return;
    const exported=exportChallenge();
    if(!exported){toast('Finish all eight Keep/Cut decisions first.');return;}
    if(!client){toast('Challenge sharing is not connected.');return;}
    creating=true;
    const original=trigger?.textContent||'CHALLENGE A FRIEND';
    if(trigger){trigger.disabled=true;trigger.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({title:'Create the Keep/Cut challenge',description:'Use your existing Picks profile. Your exact eight fighters and completed decisions will be saved for the friend link.'});
      if(!identity)return;
      if(trigger)trigger.textContent='CREATING LINK…';
      const {data,error}=await client.rpc('play_create_challenge',{
        p_game_type:'keep-cut',p_game_version:'keep-cut-standalone-v1',p_group_code:identity.groupCode,p_member_token:identity.memberToken,
        p_setup:exported.setup,p_result:exported.result,p_metadata:{comparison:'keep-cut-decisions',route:'standalone',client:VERSION},p_expires_days:365
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge link could not be created.');
      const url=standaloneUrl(data.code);
      const text='Keep four and cut four from my exact UFC lineup. Every decision locks.';
      try{
        if(navigator.share)await navigator.share({title:'UFC Keep 4, Cut 4 Challenge',text,url});
        else{await navigator.clipboard.writeText(`${text}\n\n${url}`);toast('Challenge link copied.');}
      }catch(error){
        if(error?.name==='AbortError')return;
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        toast('Challenge link copied.');
      }
    }catch(error){toast(String(error?.message||'Challenge link could not be created.'));}
    finally{creating=false;if(trigger){trigger.disabled=false;trigger.textContent=original;}}
  }

  function loadBlindRankSharing(){
    if(document.querySelector('script[data-blind-rank-standalone-share]'))return;
    const script=document.createElement('script');
    script.src='assets/js/blind-rank-standalone-share.js?v=blind-rank-standalone-share-20260716a';
    script.dataset.blindRankStandaloneShare='true';
    document.head.appendChild(script);
  }

  function loadBlindResumeSharing(){
    if(document.querySelector('script[data-blind-resume-standalone-share]'))return;
    const script=document.createElement('script');
    script.src='assets/js/blind-resume-standalone-share.js?v=blind-resume-standalone-share-20260716a';
    script.dataset.blindResumeStandaloneShare='true';
    document.head.appendChild(script);
  }

  function install(){
    if(redirectIncomingLegacyLink())return;
    loadBlindRankSharing();
    loadBlindResumeSharing();
    document.addEventListener('click',event=>{
      const keepCut=event.target.closest?.('[data-kc-challenge]');
      if(keepCut){event.preventDefault();event.stopImmediatePropagation();createChallenge(keepCut);}
    },true);
    document.documentElement.setAttribute('data-keep-cut-standalone-share',VERSION);
  }

  install();
})();
