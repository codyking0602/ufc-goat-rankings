(function(){
  'use strict';

  const VERSION='profile-challenges-20260718a-direct-inbox';
  const ROOT='https://codyking0602.github.io/ufc-goat-rankings/';
  const state={identity:null,inbox:{rows:[],unread_count:0},active:null,modal:null,payload:null,recipient:'',busy:false,routed:false};
  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token);
  const client=()=>window.UFC_PLAY_PROFILE?.client||null;
  const clone=value=>JSON.parse(JSON.stringify(value));

  function styles(){
    if(document.getElementById('profileChallengeCss'))return;
    const node=document.createElement('style');node.id='profileChallengeCss';node.textContent=`
      body.profile-challenge-open{overflow:hidden}.profile-challenge-overlay{position:fixed;inset:0;z-index:7200;display:grid;place-items:center;padding:18px;background:rgba(2,6,23,.9);backdrop-filter:blur(12px)}.profile-challenge-panel{width:min(600px,100%);max-height:94vh;overflow:auto;border:1px solid rgba(249,115,22,.68);border-radius:24px;background:linear-gradient(180deg,#1c293d,#0d1421);color:#f8fafc}.profile-challenge-head{display:flex;justify-content:space-between;gap:14px;padding:18px;border-bottom:1px solid #33445f}.profile-challenge-head span,.profile-challenge-head strong,.profile-challenge-head small{display:block}.profile-challenge-head span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.14em}.profile-challenge-head strong{margin-top:7px;font:950 26px/1 system-ui}.profile-challenge-head small{margin-top:7px;color:#94a3b8;font:700 11px/1.4 system-ui}.profile-challenge-close{width:40px;height:40px;border:1px solid #475569;border-radius:12px;background:#111827;color:#fff;font-size:22px}.profile-challenge-body{padding:16px}.profile-challenge-summary{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px;padding:13px;border:1px solid rgba(249,115,22,.34);border-radius:16px;background:rgba(249,115,22,.07)}.profile-challenge-summary strong,.profile-challenge-summary small{display:block}.profile-challenge-summary small{margin-top:5px;color:#94a3b8;font:700 10px/1.35 system-ui}.profile-challenge-summary b{font:950 28px/1 system-ui}.profile-challenge-members{display:grid;grid-template-columns:1fr 1fr;gap:8px}.profile-challenge-member{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:9px;padding:9px;border:1px solid #33445f;border-radius:14px;background:#111827;color:#fff;text-align:left}.profile-challenge-member.selected{border-color:#f97316;background:rgba(249,115,22,.12)}.profile-challenge-member .app-profile-avatar{width:42px;height:42px;min-width:42px}.profile-challenge-member strong,.profile-challenge-member small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.profile-challenge-member small{margin-top:4px;color:#94a3b8;font:750 8px/1 system-ui}.profile-challenge-member i{width:18px;height:18px;border:1px solid #475569;border-radius:50%}.profile-challenge-member.selected i{border:6px solid #f97316}.profile-challenge-status{min-height:22px;padding:10px 16px 0;color:#fdba74;font:800 10px/1.4 system-ui}.profile-challenge-actions{display:grid;grid-template-columns:1fr 1.3fr;gap:8px;padding:12px 16px 16px}.profile-challenge-actions button{min-height:46px;border:1px solid #475569;border-radius:13px;background:#172033;color:#fff;font:950 11px/1 system-ui}.profile-challenge-actions .primary{border-color:#f97316;background:#f97316;color:#111827}.profile-challenge-actions button:disabled{opacity:.45}.profile-challenge-empty{padding:20px;border:1px dashed #475569;border-radius:14px;color:#94a3b8;text-align:center}.play-profile-challenge-banner{margin-bottom:12px;padding:12px;border:1px solid rgba(249,115,22,.5);border-radius:15px;background:rgba(249,115,22,.09);text-align:center}.play-profile-challenge-banner span,.play-profile-challenge-banner strong,.play-profile-challenge-banner small{display:block}.play-profile-challenge-banner span{color:#fb923c;font:950 8px/1 system-ui;letter-spacing:.13em}.play-profile-challenge-banner strong{margin-top:5px}.play-profile-challenge-banner small{margin-top:5px;color:#94a3b8;font-size:9px}@media(max-width:600px){.profile-challenge-overlay{padding:0;align-items:end}.profile-challenge-panel{border-radius:24px 24px 0 0}.profile-challenge-members,.profile-challenge-actions{grid-template-columns:1fr}}
    `;document.head.appendChild(node);
  }

  async function identity(options={}){
    let value=state.identity||window.UFC_APP_PROFILE?.identity||window.UFC_PLAY_PROFILE?.identity;
    if(!value)value=await window.UFC_APP_PROFILE?.resolve?.().catch(()=>null);
    if(!value)value=await window.UFC_PLAY_PROFILE?.require?.({title:options.title||'Open your UFC App profile',description:options.description||'Use your GOAT26 display name and four-digit PIN.'});
    state.identity=value||null;return state.identity;
  }

  function validPayload(value){
    const setup=value?.setup,result=value?.result;
    if(!setup||!result||!Array.isArray(setup.candidates)||setup.candidates.length!==10)return null;
    return{gameType:'find-leader',gameVersion:'find-leader-profile-challenge-v1',setup:clone(setup),result:clone(result)};
  }

  function avatar(member){return window.UFC_APP_PROFILE?.avatarMarkup?.(member,'friend')||`<span class="app-profile-avatar friend"><span>${esc(text(member?.display_name).slice(0,2).toUpperCase())}</span></span>`;}
  function status(message){const node=state.modal?.querySelector('[data-challenge-status]');if(node)node.textContent=message||'';}
  function close(){state.modal?.remove();state.modal=null;state.payload=null;state.recipient='';document.body.classList.remove('profile-challenge-open');}

  function challengeUrl(code){const url=new URL('share.html',ROOT);url.searchParams.set('share','play-challenge');url.searchParams.set('challenge',text(code).toUpperCase());url.hash='play';return url.toString();}
  async function copy(value){try{await navigator.clipboard.writeText(value);return true;}catch(_error){return false;}}

  async function groupSnapshot(who){
    let group=window.UFC_APP_PROFILE?.group;
    if(!group?.members?.length)group=await window.UFC_APP_PROFILE?.groupSnapshot?.(who).catch(()=>null);
    return group||{members:[],me:who?.member};
  }

  async function createLink(){
    if(state.busy)return;state.busy=true;const who=state.identity,payload=state.payload,rpc=client();const button=state.modal?.querySelector('[data-challenge-copy]');
    if(button){button.disabled=true;button.textContent='CREATING…';}status('Creating a short challenge link…');
    try{
      const {data,error}=await rpc.rpc('play_create_challenge',{p_game_type:payload.gameType,p_game_version:payload.gameVersion,p_group_code:who.groupCode||'GOAT26',p_member_token:tokenFor(who),p_setup:payload.setup,p_result:payload.result,p_metadata:{delivery:'link'},p_expires_days:30});
      if(error)throw error;if(!data?.ok)throw new Error(data?.error||'Could not create the challenge.');
      const url=challengeUrl(data.code),message=`I scored ${Number(payload.result.score)||0}/10. Play my exact Find the Leader board.`;
      if(navigator.share){try{await navigator.share({title:'Find the Leader Challenge',text:message,url});status('Challenge ready to send.');return;}catch(error){if(error?.name==='AbortError'){status('Share cancelled.');return;}}}
      status(await copy(`${message}\n\n${url}`)?'Challenge link copied.':'Could not copy the link.');
    }catch(error){status(text(error?.message)||'Could not create the challenge.');}
    finally{state.busy=false;if(button){button.disabled=false;button.textContent='COPY LINK';}}
  }

  async function send(){
    if(state.busy||!state.recipient)return;state.busy=true;const payload=state.payload,rpc=client(),button=state.modal?.querySelector('[data-challenge-send]');
    if(button){button.disabled=true;button.textContent='SENDING…';}status('Sending challenge to their profile…');
    try{
      const {data,error}=await rpc.rpc('play_send_profile_challenge',{p_member_token:tokenFor(state.identity),p_recipient_member_id:state.recipient,p_game_type:payload.gameType,p_game_version:payload.gameVersion,p_setup:payload.setup,p_result:payload.result,p_metadata:{sender_score:Number(payload.result.score)||0},p_expires_days:30});
      if(error)throw error;if(!data?.ok)throw new Error(data?.error||'Challenge could not be sent.');
      status(`Sent to ${data.recipient?.display_name||'their profile'}.`);window.dispatchEvent(new CustomEvent('ufc-profile-challenge-sent',{detail:data}));setTimeout(close,700);
    }catch(error){status(text(error?.message)||'Challenge could not be sent.');if(button){button.disabled=false;button.textContent='SEND CHALLENGE';}}
    finally{state.busy=false;}
  }

  async function openSendModal(raw){
    styles();const payload=validPayload(raw);if(!payload)return false;const who=await identity({title:'Challenge someone',description:'Choose an Octagon HQ profile or copy a link.'});if(!who)return false;
    const group=await groupSnapshot(who),me=group.me?.id||who.member?.id,members=(group.members||[]).filter(member=>member.id!==me);
    close();state.payload=payload;const overlay=document.createElement('div');overlay.className='profile-challenge-overlay';overlay.innerHTML=`<section class="profile-challenge-panel" role="dialog" aria-modal="true" aria-labelledby="challengeTitle"><header class="profile-challenge-head"><div><span>DIRECT PROFILE CHALLENGE</span><strong id="challengeTitle">Challenge Someone</strong><small>They get this exact board in their Activity Profile. Your score stays hidden until they finish.</small></div><button class="profile-challenge-close" data-challenge-close>×</button></header><div class="profile-challenge-body"><div class="profile-challenge-summary"><div><strong>${esc(payload.setup.question||'Find the Leader')}</strong><small>Your completed board</small></div><b>${Number(payload.result.score)||0}/10</b></div>${members.length?`<div class="profile-challenge-members">${members.map(member=>`<button class="profile-challenge-member" type="button" data-challenge-member="${esc(member.id)}">${avatar(member)}<span><strong>${esc(member.display_name)}</strong><small>OCTAGON HQ PROFILE</small></span><i></i></button>`).join('')}</div>`:'<div class="profile-challenge-empty">No other active profiles yet. Use Copy Link instead.</div>'}</div><div class="profile-challenge-status" data-challenge-status>${members.length?'Choose a profile.':'Copy a link to send outside the app.'}</div><footer class="profile-challenge-actions"><button data-challenge-copy>COPY LINK</button><button class="primary" data-challenge-send disabled>SEND CHALLENGE</button></footer></section>`;
    document.body.appendChild(overlay);document.body.classList.add('profile-challenge-open');state.modal=overlay;
    overlay.querySelector('[data-challenge-close]')?.addEventListener('click',close);overlay.addEventListener('click',event=>{if(event.target===overlay)close();});overlay.querySelector('[data-challenge-copy]')?.addEventListener('click',createLink);overlay.querySelector('[data-challenge-send]')?.addEventListener('click',send);
    overlay.querySelectorAll('[data-challenge-member]').forEach(button=>button.addEventListener('click',()=>{state.recipient=button.dataset.challengeMember;overlay.querySelectorAll('[data-challenge-member]').forEach(row=>row.classList.toggle('selected',row===button));overlay.querySelector('[data-challenge-send]').disabled=false;status(`${button.querySelector('strong')?.textContent||'Profile'} selected.`);}));return true;
  }

  async function loadInbox(){
    const who=await identity().catch(()=>null),rpc=client();if(!who||!rpc)return state.inbox;
    try{const {data,error}=await rpc.rpc('play_profile_challenge_inbox',{p_member_token:tokenFor(who)});if(error||!data?.ok)throw error||new Error();state.inbox={rows:Array.isArray(data.rows)?data.rows:[],unread_count:Number(data.unread_count)||0};window.UFC_APP_PROFILE?.refreshChip?.();window.dispatchEvent(new CustomEvent('ufc-profile-challenges-updated',{detail:state.inbox}));}catch(_error){state.inbox={rows:[],unread_count:0};}return state.inbox;
  }

  function waitFor(check,timeout=12000){return new Promise((resolve,reject)=>{const start=Date.now();const tick=()=>{let value;try{value=check();}catch(_error){}if(value)return resolve(value);if(Date.now()-start>timeout)return reject(new Error('Challenge tools did not load.'));setTimeout(tick,80);};tick();});}
  function banner(){const panel=document.getElementById('playFindLeaderPanel');if(!panel||!state.active)return;panel.querySelector('.play-profile-challenge-banner')?.remove();const node=document.createElement('div');node.className='play-profile-challenge-banner';node.innerHTML=`<span>PROFILE CHALLENGE</span><strong>${esc(state.active.creatorName||'A friend')} sent this exact board.</strong><small>Finish to reveal both scores.</small>`;panel.prepend(node);}

  async function fetchChallenge(code,who){
    const rpc=client(),token=tokenFor(who);if(token){const direct=await rpc.rpc('play_open_profile_challenge',{p_member_token:token,p_challenge_code:code});if(!direct.error&&direct.data?.ok)return{...direct.data.challenge,direct:true};}
    const open=await rpc.rpc('play_get_challenge',{p_challenge_code:code});if(open.error)throw open.error;if(!open.data?.ok)throw new Error(open.data?.error||'Challenge not found.');return{...open.data.challenge,direct:false};
  }

  async function openChallenge(rawCode){
    const code=text(rawCode).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10),who=await identity({title:'Open the challenge',description:'Sign in so the result belongs to your profile.'});if(!code||!who)return false;
    const challenge=await fetchChallenge(code,who);if(challenge.game_type!=='find-leader')throw new Error('That game is not supported here yet.');
    window.UFC_APP_SHELL?.activateDestination?.('play');const hub=await waitFor(()=>window.UFC_PLAY_HUB?.openGame&&window.UFC_PLAY_HUB);await hub.openGame('find-leader',{daily:false});const game=await waitFor(()=>window.UFC_FIND_LEADER?.startGame&&window.UFC_FIND_LEADER);if(!game.startGame({setup:challenge.setup}))throw new Error('The exact board could not open.');
    state.active={code,direct:challenge.direct,creatorName:challenge.creator_name,setup:clone(challenge.setup),identity:who};banner();loadInbox();return true;
  }

  function matches(){const current=window.UFC_FIND_LEADER?.state?.setup,expected=state.active?.setup;return current&&expected&&(current.candidates||[]).map(row=>row.id).join('|')===(expected.candidates||[]).map(row=>row.id).join('|');}
  async function complete(detail){
    if(state.busy||!state.active||detail.gameType!=='find-leader'||!matches())return;state.busy=true;const who=state.active.identity,rpc=client(),result=window.UFC_FIND_LEADER?.sharePayload?.()?.result||detail.result;
    try{const args=state.active.direct?{p_member_token:tokenFor(who),p_challenge_code:state.active.code,p_result:result,p_score:Number(result.score)||0,p_metadata:{delivery:'profile'}}:{p_challenge_code:state.active.code,p_group_code:who.groupCode||'GOAT26',p_member_token:tokenFor(who),p_result:result,p_score:Number(result.score)||0,p_metadata:{delivery:'link'}};const response=await rpc.rpc(state.active.direct?'play_submit_profile_challenge':'play_submit_challenge',args);if(response.error)throw response.error;window.UFC_FIND_LEADER?.renderChallengeComparison?.(response.data);state.active=null;await loadInbox();}catch(error){console.error(error);}finally{state.busy=false;}
  }

  async function routeCurrent(){if(state.routed)return false;const params=new URL(location.href).searchParams,code=params.get('challenge');if(!code)return false;state.routed=true;try{return await openChallenge(code);}catch(error){console.error(error);return false;}}
  function start(){styles();window.addEventListener('ufc-play-game-complete',event=>complete(event.detail||{}));window.addEventListener('ufc-play-profile-ready',event=>{state.identity=event.detail||null;loadInbox();});window.addEventListener('ufc-app-profile-updated',event=>{state.identity=event.detail?.identity||state.identity;loadInbox();});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.modal)close();});setTimeout(()=>{loadInbox();routeCurrent();},200);}

  window.UFC_PROFILE_CHALLENGES={version:VERSION,openSendModal,openChallenge,loadInbox,routeCurrent,challengeUrl,get rows(){return state.inbox.rows;},get unreadCount(){return Number(state.inbox.unread_count)||0;}};
  document.documentElement.setAttribute('data-profile-challenges',VERSION);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
