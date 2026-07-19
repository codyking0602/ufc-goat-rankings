(function(){
  'use strict';

  const VERSION='game-challenges-20260719b-immediate-buttons';
  const ROOT='https://codyking0602.github.io/ufc-goat-rankings/';
  const ORDER=['find-leader','top10','blind','blind-rank','keep-cut','better-than'];
  const TARGETS=[18,27,31,35,43,47,50,56,60,62,65,67,70,72,75,77,79,82,84,85,88,91];
  const META={
    'find-leader':['Find the Leader','find-leader-profile-challenge-v2',10],
    wavelength:['Wavelength','wavelength-profile-challenge-v1',100],
    blind:['Blind Resume','blind-resume-profile-challenge-v1',5],
    'blind-rank':['Blind Rank 5','blind-rank-profile-challenge-v1',0],
    'keep-cut':['Keep 4, Cut 4','keep-cut-profile-challenge-v1',0],
    'better-than':['Better Than','better-than-profile-challenge-v2',0]
  };
  const SELECTORS={
    'find-leader':'[data-find-leader-challenge-someone]',
    wavelength:'[data-wavelength-share]',
    blind:'[data-five-round-share]',
    'blind-rank':'[data-br-challenge]',
    'keep-cut':'[data-kc-challenge]',
    'better-than':'[data-better-than-challenge]'
  };
  const SOURCE_ATTRIBUTES=[
    'data-find-leader-challenge-someone','data-wavelength-share','data-five-round-share',
    'data-br-challenge','data-kc-challenge','data-better-than-challenge'
  ];
  const state={modal:null,payload:null,identity:null,recipient:'',busy:false,active:null,submitting:false,routed:'',patched:false,scheduled:false};

  const text=value=>String(value??'').trim();
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const tokenFor=value=>text(value?.memberToken||value?.member_token);
  const client=()=>window.UFC_PLAY_PROFILE?.client||null;
  const titleFor=game=>(META[game]||['UFC Game'])[0];
  const typeFor=value=>text(value?.game_type||value?.gameType||value?.type);

  function installStyles(){
    if(document.getElementById('allGameChallengeCss'))return;
    const style=document.createElement('style');
    style.id='allGameChallengeCss';
    style.textContent=`
      #playHub .play-game-card.is-new .play-game-card-top em{border-color:rgba(250,204,21,.72);background:rgba(250,204,21,.14);color:#fde68a}
      body.game-challenge-open{overflow:hidden}
      .game-challenge-overlay{position:fixed;inset:0;z-index:15000;display:grid;place-items:center;padding:18px;background:rgba(2,6,23,.9);backdrop-filter:blur(12px)}
      .game-challenge-panel{width:min(600px,100%);max-height:94vh;overflow:auto;border:1px solid rgba(249,115,22,.68);border-radius:24px;background:linear-gradient(180deg,#1c293d,#0d1421);color:#f8fafc;box-shadow:0 22px 70px rgba(0,0,0,.5)}
      .game-challenge-head{display:flex;justify-content:space-between;gap:14px;padding:18px;border-bottom:1px solid #33445f}.game-challenge-head span,.game-challenge-head strong,.game-challenge-head small{display:block}.game-challenge-head span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.14em}.game-challenge-head strong{margin-top:7px;font:950 26px/1 system-ui}.game-challenge-head small{margin-top:7px;color:#94a3b8;font:700 11px/1.4 system-ui}
      .game-challenge-close{width:40px;height:40px;border:1px solid #475569;border-radius:12px;background:#111827;color:#fff;font-size:22px;cursor:pointer}
      .game-challenge-body{padding:16px}.game-challenge-summary{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px;padding:13px;border:1px solid rgba(249,115,22,.34);border-radius:16px;background:rgba(249,115,22,.07)}.game-challenge-summary strong,.game-challenge-summary small{display:block}.game-challenge-summary small{margin-top:5px;color:#94a3b8;font:700 10px/1.35 system-ui}.game-challenge-summary b{font:950 28px/1 system-ui;white-space:nowrap}
      .game-challenge-members{display:grid;grid-template-columns:1fr 1fr;gap:8px}.game-challenge-member{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:9px;padding:9px;border:1px solid #33445f;border-radius:14px;background:#111827;color:#fff;text-align:left;cursor:pointer}.game-challenge-member.selected{border-color:#f97316;background:rgba(249,115,22,.12)}.game-challenge-member .app-profile-avatar{width:42px;height:42px;min-width:42px}.game-challenge-member strong,.game-challenge-member small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.game-challenge-member small{margin-top:4px;color:#94a3b8;font:750 8px/1 system-ui}.game-challenge-member i{width:18px;height:18px;border:1px solid #475569;border-radius:50%}.game-challenge-member.selected i{border:6px solid #f97316}
      .game-challenge-empty{padding:20px;border:1px dashed #475569;border-radius:14px;color:#94a3b8;text-align:center}.game-challenge-status{min-height:22px;padding:10px 16px 0;color:#fdba74;font:800 10px/1.4 system-ui}.game-challenge-actions{display:grid;grid-template-columns:1fr 1.3fr;gap:8px;padding:12px 16px 16px}.game-challenge-actions button{min-height:46px;border:1px solid #475569;border-radius:13px;background:#172033;color:#fff;font:950 11px/1 system-ui;cursor:pointer}.game-challenge-actions .primary{border-color:#f97316;background:#f97316;color:#111827}.game-challenge-actions button:disabled{opacity:.45}
      .game-challenge-toast{position:fixed;left:50%;bottom:max(18px,calc(10px + env(safe-area-inset-bottom)));z-index:16000;max-width:min(380px,calc(100vw - 28px));transform:translate(-50%,14px);padding:10px 13px;border:1px solid rgba(249,115,22,.55);border-radius:999px;background:rgba(8,14,24,.97);color:#fff;opacity:0;pointer-events:none;font:850 11px/1.25 system-ui;text-align:center;transition:.16s}.game-challenge-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:600px){.game-challenge-overlay{padding:0;align-items:end}.game-challenge-panel{border-radius:24px 24px 0 0}.game-challenge-members,.game-challenge-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function toast(message){
    let node=document.getElementById('allGameChallengeToast');
    if(!node){
      node=document.createElement('div');
      node.id='allGameChallengeToast';
      node.className='game-challenge-toast';
      node.setAttribute('role','status');
      node.setAttribute('aria-live','polite');
      document.body.appendChild(node);
    }
    clearTimeout(toast.timer);
    node.textContent=message;
    node.classList.add('show');
    toast.timer=setTimeout(()=>node.classList.remove('show'),2200);
  }

  async function resolveIdentity(){
    let value=state.identity||window.UFC_APP_PROFILE?.identity||window.UFC_PLAY_PROFILE?.identity;
    if(!value)value=await window.UFC_APP_PROFILE?.resolve?.().catch(()=>null);
    if(!value)value=await window.UFC_PLAY_PROFILE?.require?.({title:'Challenge someone',description:'Choose an Octagon HQ profile or share the challenge by text.'});
    state.identity=value||null;
    return state.identity;
  }

  async function groupSnapshot(identity){
    let group=window.UFC_APP_PROFILE?.group;
    if(!group?.members?.length)group=await window.UFC_APP_PROFILE?.groupSnapshot?.(identity).catch(()=>null);
    return group||{members:[],me:identity?.member};
  }

  function avatar(member){
    return window.UFC_APP_PROFILE?.avatarMarkup?.(member,'friend')||`<span class="app-profile-avatar friend"><span>${esc(text(member?.display_name).slice(0,2).toUpperCase()||'UFC')}</span></span>`;
  }

  function scoreLabel(payload){
    if(payload.max&&Number.isFinite(Number(payload.score)))return`${payload.score}/${payload.max}`;
    if(payload.gameType==='blind-rank')return'5 fighters';
    if(payload.gameType==='keep-cut')return'8 decisions';
    if(payload.gameType==='better-than')return`${payload.result.claimCount} names`;
    return'Challenge';
  }

  function payloadFor(game){
    let exported,current,result;
    if(game==='find-leader'){
      exported=window.UFC_FIND_LEADER?.sharePayload?.();
      if(exported)result={setup:clone(exported.setup),result:clone(exported.result),score:Number(exported.result?.score)||0};
    }
    if(game==='wavelength'){
      current=window.UFC_WAVELENGTH?.state;
      if(current?.complete&&current.guesses?.length===4){
        const target=Number(current.round.target),guess=Number(current.guesses[3]),score=Math.max(0,100-Math.abs(guess-target));
        result={setup:{target},result:{score,target,finalGuess:guess,guesses:[...current.guesses],clues:clone(current.round.clues||[])},score};
      }
    }
    if(game==='blind'){
      current=window.UFC_BLIND_MATCHMAKING?.state;
      if(current?.finalVisible&&current.rounds===5)result={setup:{mode:'fresh-five-rounds'},result:{score:Number(current.score)||0,history:clone(current.history||[])},score:Number(current.score)||0};
    }
    if(game==='blind-rank'){
      current=window.UFC_BLIND_RANK?.state;
      if(current?.completed)result={setup:{packId:current.packId,lineupIds:current.lineup.map(row=>row.id)},result:{placements:current.placements.map(row=>row?.id||null)},score:0};
    }
    if(game==='keep-cut'){
      current=window.UFC_KEEP_CUT?.state;
      if(current?.completed)result={setup:{packId:current.packId,lineupIds:current.lineup.map(row=>row.id)},result:{decisions:current.decisions.map(row=>({fighterId:row.fighter?.id,choice:row.choice,revealIndex:row.revealIndex}))},score:0};
    }
    if(game==='better-than'){
      exported=window.UFC_BETTER_THAN?.exportChallenge?.();
      if(exported)result={setup:clone(exported.setup),result:clone(exported.result),score:Number(exported.result?.claimCount)||0};
    }
    if(!result)return null;
    const meta=META[game];
    return{gameType:game,gameVersion:meta[1],title:meta[0],max:meta[2],...result};
  }

  function closeModal(){
    state.modal?.remove();
    state.modal=null;
    state.payload=null;
    state.recipient='';
    document.body.classList.remove('game-challenge-open');
  }

  function setStatus(message){
    const node=state.modal?.querySelector('[data-gc-status]');
    if(node)node.textContent=message||'';
  }

  function challengeUrl(code){
    const url=new URL('share.html',ROOT);
    url.searchParams.set('share','play-challenge');
    url.searchParams.set('challenge',text(code).toUpperCase());
    url.hash='play';
    return url.toString();
  }

  async function openModal(game){
    const payload=payloadFor(game);
    if(!payload){toast(`Finish ${titleFor(game)} before sending the challenge.`);return false;}
    const identity=await resolveIdentity();
    if(!identity){toast('Open your Octagon HQ profile to send a challenge.');return false;}
    const group=await groupSnapshot(identity);
    const me=group.me?.id||identity.member?.id;
    const members=(group.members||[]).filter(member=>member.id!==me);
    closeModal();
    state.payload=payload;

    const overlay=document.createElement('div');
    overlay.className='game-challenge-overlay';
    overlay.innerHTML=`<section class="game-challenge-panel" role="dialog" aria-modal="true" aria-labelledby="gameChallengeTitle"><header class="game-challenge-head"><div><span>GAME CHALLENGE</span><strong id="gameChallengeTitle">Challenge Someone</strong><small>Send ${esc(payload.title)} to a profile or share the same challenge by text.</small></div><button type="button" class="game-challenge-close" data-gc-close aria-label="Close">×</button></header><div class="game-challenge-body"><div class="game-challenge-summary"><div><strong>${esc(payload.title)}</strong><small>Your result stays hidden until they finish.</small></div><b>${esc(scoreLabel(payload))}</b></div>${members.length?`<div class="game-challenge-members">${members.map(member=>`<button type="button" class="game-challenge-member" data-gc-member="${esc(member.id)}">${avatar(member)}<span><strong>${esc(member.display_name)}</strong><small>OCTAGON HQ PROFILE</small></span><i></i></button>`).join('')}</div>`:'<div class="game-challenge-empty">No other active profiles yet. Use Text / Share Link.</div>'}</div><div class="game-challenge-status" data-gc-status>${members.length?'Choose a profile, or share by text.':'Share the challenge outside the app.'}</div><footer class="game-challenge-actions"><button type="button" data-gc-link>TEXT / SHARE LINK</button><button type="button" class="primary" data-gc-send disabled>SEND TO PROFILE</button></footer></section>`;
    document.body.appendChild(overlay);
    document.body.classList.add('game-challenge-open');
    state.modal=overlay;

    overlay.querySelector('[data-gc-close]')?.addEventListener('click',closeModal);
    overlay.addEventListener('click',event=>{if(event.target===overlay)closeModal();});
    overlay.querySelector('[data-gc-link]')?.addEventListener('click',createShareLink);
    overlay.querySelector('[data-gc-send]')?.addEventListener('click',sendToProfile);
    overlay.querySelectorAll('[data-gc-member]').forEach(button=>button.addEventListener('click',()=>{
      state.recipient=button.dataset.gcMember;
      overlay.querySelectorAll('[data-gc-member]').forEach(row=>row.classList.toggle('selected',row===button));
      overlay.querySelector('[data-gc-send]').disabled=false;
      setStatus(`${button.querySelector('strong')?.textContent||'Profile'} selected.`);
    }));
    return true;
  }

  async function createShareLink(){
    if(state.busy||!state.modal||!state.payload)return;
    state.busy=true;
    const payload=state.payload,button=state.modal.querySelector('[data-gc-link]');
    button.disabled=true;
    button.textContent='CREATING…';
    try{
      const rpc=client();
      if(!rpc)throw new Error('Challenge sharing is not connected.');
      const {data,error}=await rpc.rpc('play_create_challenge',{p_game_type:payload.gameType,p_game_version:payload.gameVersion,p_group_code:state.identity.groupCode||'GOAT26',p_member_token:tokenFor(state.identity),p_setup:payload.setup,p_result:payload.result,p_metadata:{delivery:'link',title:payload.title,client:VERSION},p_expires_days:30});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Could not create challenge.');
      const url=challengeUrl(data.code),message=`I challenged you in ${payload.title}. Can you beat my result?`;
      if(navigator.share){
        try{await navigator.share({title:`${payload.title} Challenge`,text:message,url});setStatus('Challenge ready to send.');return;}
        catch(error){if(error?.name==='AbortError'){setStatus('Share cancelled.');return;}}
      }
      await navigator.clipboard.writeText(`${message}\n\n${url}`);
      setStatus('Challenge link copied.');
    }catch(error){setStatus(text(error?.message)||'Could not create challenge.');}
    finally{state.busy=false;button.disabled=false;button.textContent='TEXT / SHARE LINK';}
  }

  async function sendToProfile(){
    if(state.busy||!state.recipient||!state.modal||!state.payload)return;
    state.busy=true;
    const payload=state.payload,button=state.modal.querySelector('[data-gc-send]');
    button.disabled=true;
    button.textContent='SENDING…';
    try{
      const rpc=client();
      if(!rpc)throw new Error('Profile challenges are not connected.');
      const {data,error}=await rpc.rpc('play_send_profile_challenge',{p_member_token:tokenFor(state.identity),p_recipient_member_id:state.recipient,p_game_type:payload.gameType,p_game_version:payload.gameVersion,p_setup:payload.setup,p_result:payload.result,p_metadata:{sender_score:payload.score,title:payload.title,client:VERSION},p_expires_days:30});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Could not send challenge.');
      setStatus(`Sent to ${data.recipient?.display_name||'their profile'}.`);
      window.dispatchEvent(new CustomEvent('ufc-profile-challenge-sent',{detail:data}));
      setTimeout(closeModal,650);
    }catch(error){
      setStatus(text(error?.message)||'Could not send challenge.');
      button.disabled=false;
      button.textContent='SEND TO PROFILE';
    }finally{state.busy=false;}
  }

  function reorderGames(){
    const grid=document.querySelector('#playHub .play-game-grid');
    if(!grid)return;
    const map=new Map();
    grid.querySelectorAll('.play-game-card').forEach(card=>{
      const id=card.dataset.openGame||({'Blind Rank 5':'blind-rank','Keep 4, Cut 4':'keep-cut'}[card.dataset.comingGame]);
      if(id)map.set(id,card);
    });
    const wanted=ORDER.map(id=>map.get(id)).filter(Boolean);
    const current=[...grid.children].filter(node=>node.classList?.contains('play-game-card'));
    if(wanted.some((card,index)=>current[index]!==card))wanted.forEach(card=>grid.appendChild(card));
    const wavelength=map.get('top10');
    if(wavelength){
      wavelength.classList.add('is-new');
      const status=wavelength.querySelector('.play-game-card-top em');
      if(status)status.textContent='NEW';
    }
    const games=window.UFC_PLAY_HUB?.games;
    if(Array.isArray(games)){
      const ordered=ORDER.map(id=>games.find(game=>game.id===id)).filter(Boolean);
      if(ordered.length===games.length&&ordered.some((game,index)=>games[index]!==game))games.splice(0,games.length,...ordered);
    }
  }

  function decorateButton(button,game){
    if(!button||!META[game])return;
    SOURCE_ATTRIBUTES.forEach(attribute=>button.removeAttribute(attribute));
    button.dataset.gameChallenge=game;
    button.dataset.gameChallengeReady='true';
    if(button.textContent.trim()!=='CHALLENGE SOMEONE')button.textContent='CHALLENGE SOMEONE';
    button.setAttribute('aria-label',`Challenge someone in ${titleFor(game)}`);
  }

  function decorateButtons(root=document){
    Object.entries(SELECTORS).forEach(([game,selector])=>{
      if(root.matches?.(selector))decorateButton(root,game);
      root.querySelectorAll?.(selector).forEach(button=>decorateButton(button,game));
    });
    if(root.matches?.('[data-game-challenge]'))decorateButton(root,root.dataset.gameChallenge);
    root.querySelectorAll?.('[data-game-challenge]').forEach(button=>decorateButton(button,button.dataset.gameChallenge));
  }

  function rows(){return window.UFC_PROFILE_CHALLENGES?.rows||[];}

  function decorateInbox(){
    const byCode=new Map(rows().map(row=>[text(row.code).toUpperCase(),row]));
    document.querySelectorAll('[data-open-profile-challenge]').forEach(button=>{
      const row=byCode.get(text(button.dataset.openProfileChallenge).toUpperCase());
      const label=button.closest('.profile-challenge-inbox-row')?.querySelector('.profile-challenge-inbox-copy strong');
      if(row&&label)label.textContent=`${row.creator_name||'A friend'} sent ${titleFor(typeFor(row))}`;
    });
  }

  function waitFor(check,timeout=12000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{let value;try{value=check();}catch(_error){}if(value)return resolve(value);if(Date.now()-started>timeout)return reject(new Error('Challenge game did not load.'));setTimeout(tick,80);};
      tick();
    });
  }

  async function fetchChallenge(code,identity,directOnly=false){
    const rpc=client(),token=tokenFor(identity);
    if(!rpc)throw new Error('Challenge service is not connected.');
    if(token){
      const direct=await rpc.rpc('play_open_profile_challenge',{p_member_token:token,p_challenge_code:code});
      if(!direct.error&&direct.data?.ok)return{...direct.data.challenge,direct:true};
      if(directOnly)throw direct.error||new Error(direct.data?.error||'Challenge unavailable.');
    }
    if(directOnly)throw new Error('Challenge unavailable.');
    const open=await rpc.rpc('play_get_challenge',{p_challenge_code:code});
    if(open.error)throw open.error;
    if(!open.data?.ok)throw new Error(open.data?.error||'Challenge not found.');
    return{...open.data.challenge,direct:false};
  }

  function resetBlind(){
    const value=window.UFC_BLIND_MATCHMAKING?.state;
    if(!value)return;
    value.pair=null;value.choice=null;value.currentResult=null;value.score=0;value.rounds=0;value.history=[];value.seenPairs=new Set();value.usedNames=new Set();value.lastNames=new Set();value.appearances=new Map();value.genderHistory=[];value.waitingForModel=false;value.finalVisible=false;
    const reveal=document.getElementById('blindReveal');
    if(reveal){reveal.hidden=true;reveal.innerHTML='';}
  }

  function startWavelength(target){
    const api=window.UFC_WAVELENGTH,wanted=Number(target);
    if(!api?.newRound||!TARGETS.includes(wanted))return false;
    const previous=TARGETS.find(value=>value!==wanted),options=TARGETS.filter(value=>value!==previous),index=options.indexOf(wanted),nativeRandom=Math.random;
    try{
      localStorage.setItem('ufc-wavelength-last-target',previous);
      let first=true;
      Math.random=()=>{if(first){first=false;return(index+.2)/options.length;}return nativeRandom();};
      api.newRound();
      return api.state.round.target===wanted;
    }finally{Math.random=nativeRandom;}
  }

  async function launchChallenge(challenge){
    const game=typeFor(challenge),setup=challenge.setup||{};
    window.UFC_APP_SHELL?.activateDestination?.('play')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('play');
    const hub=await waitFor(()=>window.UFC_PLAY_HUB?.openGame&&window.UFC_PLAY_HUB);
    if(game==='wavelength'){
      await hub.openGame('top10');
      const api=await waitFor(()=>window.UFC_WAVELENGTH?.newRound&&window.UFC_WAVELENGTH);
      if(!startWavelength(setup.target))api.newRound();
      return;
    }
    if(game==='blind'){
      await waitFor(()=>window.UFC_BLIND_MATCHMAKING?.state);
      resetBlind();
      await hub.openGame('blind');
      return;
    }
    if(game==='blind-rank'){
      const api=await waitFor(()=>window.UFC_BLIND_RANK?.open&&window.UFC_BLIND_RANK);
      const lineup=(setup.lineupIds||[]).map(id=>window.UFC_PLAY_DATA?.resolve?.(id));
      if(lineup.length!==5||lineup.some(value=>!value))throw new Error('Blind Rank lineup unavailable.');
      api.open({lineup,packId:setup.packId,shared:true});
      return;
    }
    if(game==='keep-cut'){
      const api=await waitFor(()=>window.UFC_KEEP_CUT?.open&&window.UFC_KEEP_CUT);
      const lineup=(setup.lineupIds||[]).map(id=>window.UFC_PLAY_DATA?.resolve?.(id));
      if(lineup.length!==8||lineup.some(value=>!value))throw new Error('Keep 4, Cut 4 lineup unavailable.');
      api.open({lineup,packId:setup.packId,shared:true});
      return;
    }
    if(game==='better-than'){
      await hub.openGame('better-than');
      const api=await waitFor(()=>window.UFC_BETTER_THAN?.open&&window.UFC_BETTER_THAN),value=api.state;
      value.targetId=setup.target?.id||value.targetId;value.lensId=setup.lens?.id||value.lensId;value.poolId=setup.pool?.id||value.poolId;value.claimCount=Math.max(1,Number(setup.challengerCount)||1);value.selected=new Set();value.query='';value.locked=false;
      api.open();
      return;
    }
    throw new Error('Challenge game unsupported.');
  }

  async function openChallenge(rawCode,directOnly=false){
    const code=text(rawCode).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10),identity=await resolveIdentity();
    if(!identity||!code)return false;
    const challenge=await fetchChallenge(code,identity,directOnly);
    if(typeFor(challenge)==='find-leader')return false;
    await launchChallenge(challenge);
    state.active={code,direct:challenge.direct,gameType:typeFor(challenge),identity,creator:challenge.creator_name||'A friend'};
    toast(`${state.active.creator} challenged you in ${titleFor(state.active.gameType)}.`);
    return true;
  }

  function resultFor(game){return payloadFor(game)?.result||null;}

  async function submitResult(){
    if(state.submitting||!state.active)return;
    const result=resultFor(state.active.gameType);
    if(!result)return;
    state.submitting=true;
    const active=state.active,rpc=client();
    const score=active.gameType==='wavelength'||active.gameType==='blind'?Number(result.score)||0:active.gameType==='better-than'?Number(result.claimCount)||0:0;
    try{
      const args=active.direct?{p_member_token:tokenFor(active.identity),p_challenge_code:active.code,p_result:result,p_score:score,p_metadata:{delivery:'profile',title:titleFor(active.gameType),client:VERSION}}:{p_challenge_code:active.code,p_group_code:active.identity.groupCode||'GOAT26',p_member_token:tokenFor(active.identity),p_result:result,p_score:score,p_metadata:{delivery:'link',title:titleFor(active.gameType),client:VERSION}};
      const response=await rpc.rpc(active.direct?'play_submit_profile_challenge':'play_submit_challenge',args);
      if(response.error)throw response.error;
      state.active=null;
      toast('Challenge complete — result submitted.');
      window.UFC_PROFILE_CHALLENGES?.loadInbox?.();
    }catch(error){console.error(error);toast('Result submission failed.');}
    finally{state.submitting=false;}
  }

  async function routeCurrent(){
    const code=new URL(location.href).searchParams.get('challenge');
    if(!code||state.routed===code)return false;
    state.routed=code;
    try{return await openChallenge(code);}catch(error){console.error(error);return false;}
  }

  function patchProfileRouter(){
    const api=window.UFC_PROFILE_CHALLENGES;
    if(!api||state.patched)return;
    const native=api.routeCurrent?.bind(api);
    api.routeCurrent=async()=>{
      const code=new URL(location.href).searchParams.get('challenge');
      if(!code)return native?.()||false;
      try{
        const identity=await resolveIdentity(),challenge=await fetchChallenge(text(code).toUpperCase(),identity);
        if(typeFor(challenge)==='find-leader')return native?.()||false;
        if(state.routed===code)return true;
        state.routed=code;
        await launchChallenge(challenge);
        state.active={code:text(code).toUpperCase(),direct:challenge.direct,gameType:typeFor(challenge),identity,creator:challenge.creator_name||'A friend'};
        toast(`${state.active.creator} challenged you in ${titleFor(state.active.gameType)}.`);
        return true;
      }catch(error){console.error(error);return false;}
    };
    state.patched=true;
  }

  function runGlobalDecorators(){
    state.scheduled=false;
    reorderGames();
    decorateButtons(document);
    decorateInbox();
    patchProfileRouter();
  }

  function scheduleDecorators(){
    if(state.scheduled)return;
    state.scheduled=true;
    requestAnimationFrame(runGlobalDecorators);
  }

  function start(){
    installStyles();
    runGlobalDecorators();
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-game-challenge]');
      if(!button)return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      openModal(button.dataset.gameChallenge);
    },true);
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-open-profile-challenge]');
      if(!button)return;
      const row=rows().find(value=>text(value.code).toUpperCase()===text(button.dataset.openProfileChallenge).toUpperCase());
      if(!row||typeFor(row)==='find-leader')return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      window.UFC_PROFILE_ACTIVITY?.close?.();
      openChallenge(button.dataset.openProfileChallenge,true).catch(error=>toast(text(error?.message)||'Challenge unavailable.'));
    },true);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.modal)closeModal();});
    window.addEventListener('ufc-play-hub-ready',runGlobalDecorators);
    window.addEventListener('ufc-profile-challenges-updated',decorateInbox);
    new MutationObserver(records=>{
      records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)decorateButtons(node);}));
      scheduleDecorators();
      submitResult();
    }).observe(document.body,{childList:true,subtree:true});
    setInterval(()=>{submitResult();patchProfileRouter();decorateInbox();},700);
    [0,80,250,700,1500].forEach(delay=>setTimeout(runGlobalDecorators,delay));
    setTimeout(routeCurrent,500);
  }

  window.UFC_GAME_CHALLENGES={version:VERSION,order:[...ORDER],openModal,openChallenge,route:routeCurrent,payload:payloadFor,decorate:runGlobalDecorators};
  document.documentElement.setAttribute('data-game-challenges',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();