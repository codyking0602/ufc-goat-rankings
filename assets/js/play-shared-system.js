(function(){
  'use strict';

  const VERSION='play-shared-system-20260715a';
  const config=window.UFC_SUPABASE_CONFIG||{};
  const client=config.url&&config.anonKey&&window.supabase?.createClient
    ? window.supabase.createClient(config.url,config.anonKey)
    : null;
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  const ACTIVE_GROUP_KEY='ufc-player:group-code';
  const CHALLENGE_SESSION_KEY='ufc-play:active-challenge';

  let identityCache=null;
  let dailyContextCache=null;
  let activeChallenge=null;
  let challengeSubmitting=false;
  let dailySubmitting=false;
  let dailyRunId=0;
  let dailySubmittedRun=-1;
  let modalPromise=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const normalizeCode=value=>String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const normalizePin=value=>String(value||'').replace(/\D/g,'').slice(0,4);

  function toast(message){
    let node=document.getElementById('playSharedToast');
    if(!node){
      node=document.createElement('div');
      node.id='playSharedToast';
      node.className='play-shared-toast';
      node.setAttribute('role','status');
      node.setAttribute('aria-live','polite');
      document.body.appendChild(node);
    }
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),1900);
  }

  function backendMessage(error,fallback='That did not work.'){
    const message=String(error?.message||fallback);
    if(/play_identity_snapshot|play_create_keep_cut_challenge|play_get_challenge|play_submit_keep_cut_challenge|play_daily_context|play_submit_daily_attempt|play_daily_leaderboard|schema cache|could not find the function|does not exist/i.test(message)){
      return 'Play sharing needs the new Supabase Play migration.';
    }
    return message;
  }

  function storedGroupCodes(){
    const codes=[];
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(GROUP_TOKEN_PREFIX)||!localStorage.getItem(key))continue;
        const code=normalizeCode(key.slice(GROUP_TOKEN_PREFIX.length));
        if(code)codes.push(code);
      }
    }catch(_error){}
    return [...new Set(codes)];
  }

  function memberToken(code){
    try{return localStorage.getItem(`${GROUP_TOKEN_PREFIX}${normalizeCode(code)}`)||'';}catch(_error){return'';}
  }

  function candidateCodes(preferred=''){
    const url=new URL(window.location.href);
    const values=[
      normalizeCode(preferred),
      normalizeCode(url.searchParams.get('group')),
      normalizeCode(localStorage.getItem(ACTIVE_GROUP_KEY)),
      ...storedGroupCodes()
    ].filter(Boolean);
    return [...new Set(values)];
  }

  async function identitySnapshot(code,token){
    if(!client)return null;
    const {data,error}=await client.rpc('play_identity_snapshot',{
      p_group_code:normalizeCode(code),
      p_member_token:token
    });
    if(error)throw error;
    if(!data?.ok)return null;
    return {...data,groupCode:normalizeCode(data.group?.code||code),memberToken:token};
  }

  async function resolveIdentity(preferred=''){
    if(identityCache&&memberToken(identityCache.groupCode)===identityCache.memberToken)return identityCache;
    for(const code of candidateCodes(preferred)){
      const token=memberToken(code);
      if(!token)continue;
      try{
        const identity=await identitySnapshot(code,token);
        if(identity){
          identityCache=identity;
          localStorage.setItem(ACTIVE_GROUP_KEY,identity.groupCode);
          renderIdentityChip();
          return identity;
        }
      }catch(error){
        if(/play_identity_snapshot|schema cache|does not exist/i.test(String(error?.message||'')))throw error;
      }
    }
    return null;
  }

  function storePinAccess(data){
    const code=normalizeCode(data?.group?.code);
    const token=data?.member_token||'';
    const admin=data?.admin_token||'';
    if(!code||!token)return false;
    localStorage.setItem(`${GROUP_TOKEN_PREFIX}${code}`,token);
    if(admin)localStorage.setItem(`${GROUP_ADMIN_PREFIX}${code}`,admin);
    else localStorage.removeItem(`${GROUP_ADMIN_PREFIX}${code}`);
    localStorage.setItem(ACTIVE_GROUP_KEY,code);
    localStorage.setItem('ufc-picks:display-name',data.member?.display_name||'');
    (data.rooms||[]).forEach(room=>{
      const roomCode=normalizeCode(room.code);
      if(!roomCode)return;
      localStorage.setItem(`${ROOM_TOKEN_PREFIX}${roomCode}`,token);
      if(admin)localStorage.setItem(`${ROOM_ADMIN_PREFIX}${roomCode}`,admin);
      else localStorage.removeItem(`${ROOM_ADMIN_PREFIX}${roomCode}`);
    });
    return true;
  }

  async function loginWithPin(groupCode,displayName,pin){
    if(!client)throw new Error('Supabase is not connected.');
    const {data,error}=await client.rpc('picks_member_login_pin',{
      p_group_code:normalizeCode(groupCode),
      p_display_name:String(displayName||'').trim(),
      p_pin:normalizePin(pin)
    });
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Sign-in details did not match.');
    if(!storePinAccess(data))throw new Error('Profile access was returned without a valid token.');
    identityCache=await identitySnapshot(data.group.code,data.member_token);
    renderIdentityChip();
    return identityCache;
  }

  function closeIdentityModal(result=null){
    const modal=document.getElementById('playIdentityModal');
    modal?.remove();
    document.body.classList.remove('play-identity-open');
    const resolver=closeIdentityModal.resolve;
    closeIdentityModal.resolve=null;
    modalPromise=null;
    if(resolver)resolver(result);
  }

  function identityModal(options={}){
    if(modalPromise)return modalPromise;
    modalPromise=new Promise(resolve=>{
      closeIdentityModal.resolve=resolve;
      const modal=document.createElement('div');
      modal.id='playIdentityModal';
      modal.className='play-identity-modal';
      const preferred=normalizeCode(options.preferredGroup)||normalizeCode(localStorage.getItem(ACTIVE_GROUP_KEY))||candidateCodes()[0]||'';
      const savedName=localStorage.getItem('ufc-picks:display-name')||'';
      modal.innerHTML=`<div class="play-identity-dialog" role="dialog" aria-modal="true" aria-labelledby="playIdentityTitle">
        <span class="play-identity-kicker">UFC APP PROFILE</span>
        <h3 id="playIdentityTitle">${esc(options.title||'Sign in to continue')}</h3>
        <p>${esc(options.description||'Use the same group code, display name, and PIN from Picks. This reconnects Safari or another device to your profile.')}</p>
        <label>Group code<input id="playIdentityGroup" maxlength="6" autocapitalize="characters" autocomplete="off" placeholder="ABC123" value="${esc(preferred)}"></label>
        <label>Display name<input id="playIdentityName" maxlength="30" autocomplete="nickname" placeholder="Cody" value="${esc(savedName)}"></label>
        <label>4-digit PIN<input id="playIdentityPin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••"></label>
        <div id="playIdentityStatus" class="play-identity-status" role="status" aria-live="polite"></div>
        <div class="play-identity-actions">
          ${options.allowCancel===false?'':'<button type="button" data-play-identity-cancel>Not now</button>'}
          <button id="playIdentitySubmit" class="primary" type="button">Sign In</button>
        </div>
        <small>This is your existing Picks profile—not a separate Play account.</small>
      </div>`;
      document.body.appendChild(modal);
      document.body.classList.add('play-identity-open');
      const submit=async()=>{
        const group=normalizeCode(document.getElementById('playIdentityGroup')?.value);
        const name=document.getElementById('playIdentityName')?.value.trim()||'';
        const pin=normalizePin(document.getElementById('playIdentityPin')?.value);
        const status=document.getElementById('playIdentityStatus');
        const button=document.getElementById('playIdentitySubmit');
        if(group.length!==6){status.textContent='Enter the 6-character Picks group code.';return;}
        if(!name){status.textContent='Enter the exact display name from Picks.';return;}
        if(pin.length!==4){status.textContent='Enter your 4-digit Picks PIN.';return;}
        button.disabled=true;
        button.textContent='Signing In…';
        status.textContent='Checking your Picks profile…';
        try{
          const identity=await loginWithPin(group,name,pin);
          closeIdentityModal(identity);
        }catch(error){
          status.textContent=backendMessage(error,'Could not sign in.');
          button.disabled=false;
          button.textContent='Sign In';
        }
      };
      modal.querySelector('#playIdentitySubmit')?.addEventListener('click',submit);
      modal.querySelector('[data-play-identity-cancel]')?.addEventListener('click',()=>closeIdentityModal(null));
      modal.addEventListener('click',event=>{if(event.target===modal&&options.allowCancel!==false)closeIdentityModal(null);});
      modal.querySelectorAll('input').forEach(input=>input.addEventListener('keydown',event=>{if(event.key==='Enter')submit();}));
      modal.querySelector('#playIdentityPin')?.focus();
    });
    return modalPromise;
  }

  async function requireIdentity(options={}){
    try{
      const existing=await resolveIdentity(options.preferredGroup||'');
      if(existing)return existing;
    }catch(error){
      toast(backendMessage(error));
      return null;
    }
    return identityModal(options);
  }

  function renderIdentityChip(){
    const hub=document.getElementById('playHub');
    const heading=hub?.querySelector('.play-hub-heading');
    if(!heading)return;
    let chip=document.getElementById('playIdentityChip');
    if(!chip){
      chip=document.createElement('button');
      chip.id='playIdentityChip';
      chip.type='button';
      chip.className='play-identity-chip';
      chip.addEventListener('click',()=>identityModal({title:'Switch or reconnect profile'}));
      heading.appendChild(chip);
    }
    chip.innerHTML=identityCache
      ? `<span>PLAYING AS</span><strong>${esc(identityCache.member?.display_name||'Player')}</strong>`
      : '<span>CHALLENGES + LEADERBOARD</span><strong>SIGN IN</strong>';
  }

  function centralDay(){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return new Date().toISOString().slice(0,10);}
  }

  async function dailyContext(gameType='blind-resume'){
    if(dailyContextCache?.game_type===gameType)return dailyContextCache;
    if(client){
      const {data,error}=await client.rpc('play_daily_context',{p_game_type:gameType});
      if(!error&&data?.ok){dailyContextCache=data;return data;}
      if(error&&!/play_daily_context|schema cache|does not exist/i.test(String(error.message||'')))throw error;
    }
    const day=centralDay();
    dailyContextCache={
      ok:false,
      fallback:true,
      game_type:gameType,
      challenge_day:day,
      challenge_key:`${gameType}:${day}`,
      seed:`${gameType}|${day}|daily-v1`,
      timezone:'America/Chicago'
    };
    return dailyContextCache;
  }

  async function prepareDaily(gameType='blind-resume'){
    const context=await dailyContext(gameType);
    const identity=await requireIdentity({
      title:"Sign in for today's leaderboard",
      description:'Your first completed attempt becomes official. Replays update your best score and attempt count.',
      allowCancel:true
    });
    if(!identity)return null;
    dailyRunId+=1;
    dailySubmittedRun=-1;
    return {context,identity};
  }

  function markDailyReplay(){
    dailyRunId+=1;
    dailySubmittedRun=-1;
  }

  function keepCutResult(state){
    if(!state?.completed||!Array.isArray(state.decisions)||state.decisions.length!==8)return null;
    const result=Array(8).fill('');
    state.decisions.forEach(row=>{
      const index=Number(row.revealIndex);
      if(index>=0&&index<8)result[index]=row.choice==='keep'?'K':'C';
    });
    return result.every(Boolean)?result:null;
  }

  function cleanChallengeUrl(code){
    const url=new URL(window.location.href);
    ['game','kcpack','kclineup','kcchoices','kcv','brpack','brlineup','room'].forEach(key=>url.searchParams.delete(key));
    url.searchParams.set('challenge',code);
    url.hash='play';
    return url.toString();
  }

  async function createKeepCutChallenge(){
    const game=window.UFC_KEEP_CUT;
    const state=game?.state;
    const result=keepCutResult(state);
    if(!game||!state?.completed||!result){toast('Finish the game before challenging a friend.');return;}
    const identity=await requireIdentity({
      title:'Sign in to create the challenge',
      description:'The challenge will save the exact eight fighters, reveal order, and your Keep/Cut decisions.'
    });
    if(!identity)return;
    const {data,error}=await client.rpc('play_create_keep_cut_challenge',{
      p_group_code:identity.groupCode,
      p_member_token:identity.memberToken,
      p_pack_id:state.packId||'ufc-careers',
      p_lineup:state.lineup.map(fighter=>fighter.id),
      p_result:result
    });
    if(error||!data?.ok){toast(backendMessage(error||new Error(data?.error),'Challenge not created.'));return;}
    const url=cleanChallengeUrl(data.code);
    const text=`I made a UFC Keep 4, Cut 4 challenge. Play the exact same eight fighters, then compare your choices with mine.\n\n${url}`;
    try{
      if(navigator.share)await navigator.share({title:'UFC Keep 4, Cut 4 Challenge',text,url});
      else{await navigator.clipboard.writeText(text);toast('Challenge link copied');}
    }catch(error){
      if(error?.name==='AbortError')return;
      try{await navigator.clipboard.writeText(text);toast('Challenge link copied');}
      catch(_copyError){toast('Could not share the challenge.');}
    }
  }

  function challengeCodeFromUrl(){
    const url=new URL(window.location.href);
    const query=normalizeCode(url.searchParams.get('challenge'));
    if(query)return query;
    const match=String(url.hash||'').match(/(?:^#|[&#])challenge=([A-Z0-9]{4,10})/i);
    return normalizeCode(match?.[1]);
  }

  async function getChallenge(code){
    if(!client)throw new Error('Supabase is not connected.');
    const {data,error}=await client.rpc('play_get_challenge',{p_challenge_code:normalizeCode(code)});
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Challenge not found.');
    return data.challenge;
  }

  function saveActiveChallenge(challenge){
    activeChallenge=challenge;
    try{sessionStorage.setItem(CHALLENGE_SESSION_KEY,JSON.stringify(challenge));}catch(_error){}
  }

  function restoreActiveChallenge(){
    if(activeChallenge)return activeChallenge;
    try{
      const saved=JSON.parse(sessionStorage.getItem(CHALLENGE_SESSION_KEY)||'null');
      if(saved?.code&&Array.isArray(saved.lineup))activeChallenge=saved;
    }catch(_error){}
    return activeChallenge;
  }

  function waitFor(check,timeout=9000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{
        const value=check();
        if(value){resolve(value);return;}
        if(Date.now()-started>timeout){reject(new Error('The game did not finish loading.'));return;}
        setTimeout(tick,80);
      };
      tick();
    });
  }

  function renderChallengeBanner(challenge){
    const panel=document.getElementById('playKeepCutPanel');
    const wrap=panel?.querySelector('.kc-wrap');
    if(!wrap)return;
    let banner=document.getElementById('playChallengeBanner');
    if(!banner){
      banner=document.createElement('div');
      banner.id='playChallengeBanner';
      banner.className='play-challenge-banner';
      wrap.prepend(banner);
    }
    banner.innerHTML=`<span>FRIEND CHALLENGE</span><strong>${esc(challenge.creator_name)} sent you the same eight fighters.</strong><small>Your choices stay private until you finish.</small>`;
  }

  async function openChallenge(code){
    let challenge;
    try{challenge=await getChallenge(code);}
    catch(error){toast(backendMessage(error,'Challenge not found.'));return;}
    const identity=await requireIdentity({
      preferredGroup:challenge.creator_group_code,
      title:`Play ${challenge.creator_name}'s challenge`,
      description:'Sign in with your existing Picks profile so the final comparison belongs to you.'
    });
    if(!identity)return;
    try{
      const game=await waitFor(()=>window.UFC_KEEP_CUT);
      const playData=await waitFor(()=>window.UFC_PLAY_DATA);
      const lineup=challenge.lineup.map(id=>playData.resolve(id));
      if(lineup.some(fighter=>!fighter))throw new Error('One of the challenge fighters is no longer available.');
      saveActiveChallenge({...challenge,lineupIds:[...challenge.lineup]});
      document.querySelector('.tab[data-view="play"]')?.click();
      setTimeout(()=>{
        game.open({lineup,packId:challenge.pack_id,shared:true});
        renderChallengeBanner(challenge);
      },120);
    }catch(error){toast(backendMessage(error,'Challenge could not open.'));}
  }

  function fighterVisual(fighter){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    const initials=String(fighter?.name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
    return `<span class="play-compare-photo">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials)}</b>`}</span>`;
  }

  function compareGroup(title,choice,lineup,result){
    const fighters=lineup.filter((_fighter,index)=>result[index]===choice);
    return `<div class="play-compare-group ${choice==='K'?'keep':'cut'}"><span>${esc(title)}</span><strong>${choice==='K'?'KEPT':'CUT'}</strong><div>${fighters.map(fighter=>`<article>${fighterVisual(fighter)}<b>${esc(fighter.name)}</b></article>`).join('')}</div></div>`;
  }

  function renderChallengeComparison(data){
    const game=window.UFC_KEEP_CUT;
    const finish=document.querySelector('#playKeepCutPanel .kc-finish');
    if(!finish||finish.querySelector('.play-challenge-comparison'))return;
    const lineup=game.state.lineup;
    const mine=data.responder_result;
    const theirs=data.creator_result;
    const differences=lineup.map((fighter,index)=>({fighter,mine:mine[index],theirs:theirs[index]})).filter(row=>row.mine!==row.theirs);
    finish.querySelectorAll('.kc-final-group').forEach(node=>node.remove());
    const actions=finish.querySelector('.kc-actions');
    const markup=`<section class="play-challenge-comparison">
      <header><div><span>CHALLENGE RESULTS</span><strong>${data.matching_calls}/8 SAME CALLS</strong></div><small>${differences.length?`${differences.length} disagreement${differences.length===1?'':'s'}`:'Perfect match'}</small></header>
      <div class="play-compare-people">
        <section><h4>YOU · ${esc(data.responder_name)}</h4>${compareGroup('YOUR FOUR','K',lineup,mine)}${compareGroup('YOUR FOUR','C',lineup,mine)}</section>
        <section><h4>${esc(data.creator_name)}</h4>${compareGroup("CHALLENGER'S FOUR",'K',lineup,theirs)}${compareGroup("CHALLENGER'S FOUR",'C',lineup,theirs)}</section>
      </div>
      ${differences.length?`<div class="play-compare-splits"><span>WHERE YOU SPLIT</span>${differences.map(row=>`<p><strong>${esc(row.fighter.name)}</strong><small>You ${row.mine==='K'?'kept':'cut'} · ${esc(data.creator_name)} ${row.theirs==='K'?'kept':'cut'}</small></p>`).join('')}</div>`:''}
    </section>`;
    if(actions)actions.insertAdjacentHTML('beforebegin',markup);
    else finish.insertAdjacentHTML('beforeend',markup);
  }

  async function submitChallengeResult(){
    if(challengeSubmitting)return;
    const challenge=restoreActiveChallenge();
    const game=window.UFC_KEEP_CUT;
    const result=keepCutResult(game?.state);
    if(!challenge||!result||!game?.state?.completed)return;
    const same=game.state.lineup.map(fighter=>fighter.id).join('|')===challenge.lineupIds.join('|');
    if(!same)return;
    challengeSubmitting=true;
    const identity=await requireIdentity({preferredGroup:challenge.creator_group_code,title:'Sign in to see the comparison'});
    if(!identity){challengeSubmitting=false;return;}
    const {data,error}=await client.rpc('play_submit_keep_cut_challenge',{
      p_challenge_code:challenge.code,
      p_group_code:identity.groupCode,
      p_member_token:identity.memberToken,
      p_result:result
    });
    challengeSubmitting=false;
    if(error||!data?.ok){toast(backendMessage(error||new Error(data?.error),'Comparison could not load.'));return;}
    renderChallengeComparison(data);
  }

  function dailyResultPayload(state){
    return {
      score:Number(state?.score)||0,
      rounds:(state?.history||[]).map(row=>({
        round:row.round,
        fighterA:row.fighterA,
        fighterB:row.fighterB,
        picked:row.picked,
        winner:row.winner,
        correct:Boolean(row.correct)
      }))
    };
  }

  async function leaderboard(day){
    const {data,error}=await client.rpc('play_daily_leaderboard',{
      p_game_type:'blind-resume',
      p_challenge_day:day,
      p_limit:25
    });
    if(error)throw error;
    return data;
  }

  function renderDailyLeaderboard(attempt,board){
    const card=document.querySelector('#playBlindPanel .blind-final-card');
    const hero=card?.querySelector('.blind-final-hero');
    if(!card||!hero)return;
    card.querySelector('.play-daily-results')?.remove();
    const rows=(board?.rows||[]).slice(0,10);
    hero.insertAdjacentHTML('afterend',`<section class="play-daily-results">
      <header><div><span>TODAY'S LEADERBOARD</span><strong>Your rank: #${attempt.rank} of ${attempt.player_count}</strong></div><small>Official ${attempt.official_score}/5 · Best ${attempt.best_score}/5 · ${attempt.attempt_count} attempt${attempt.attempt_count===1?'':'s'}</small></header>
      <p>Your first completed attempt is official. Replays can improve only your best score.</p>
      <div class="play-daily-board">${rows.map(row=>`<div${row.display_name===attempt.player?.display_name?' class="you"':''}><b>#${row.rank}</b><strong>${esc(row.display_name)}</strong><span>Official ${row.official_score}/5</span><small>Best ${row.best_score}/5 · ${row.attempt_count}x</small></div>`).join('')}</div>
    </section>`);
  }

  async function submitDailyIfComplete(){
    if(dailySubmitting||dailySubmittedRun===dailyRunId)return;
    if(document.documentElement.getAttribute('data-play-screen')!=='daily-blind')return;
    const engine=window.UFC_BLIND_MATCHMAKING;
    const state=engine?.state;
    if(!state?.finalVisible||state.rounds!==5)return;
    dailySubmitting=true;
    const identity=await requireIdentity({title:"Sign in for today's leaderboard"});
    if(!identity){dailySubmitting=false;return;}
    const context=await dailyContext('blind-resume');
    const payload=dailyResultPayload(state);
    const {data,error}=await client.rpc('play_submit_daily_attempt',{
      p_game_type:'blind-resume',
      p_group_code:identity.groupCode,
      p_member_token:identity.memberToken,
      p_score:payload.score,
      p_result:payload
    });
    if(error||!data?.ok){dailySubmitting=false;toast(backendMessage(error||new Error(data?.error),'Score not saved.'));return;}
    dailySubmittedRun=dailyRunId;
    try{
      const board=await leaderboard(context.challenge_day);
      renderDailyLeaderboard(data,board);
    }catch(boardError){toast(backendMessage(boardError,'Score saved, but leaderboard did not load.'));}
    dailySubmitting=false;
  }

  function injectStyles(){
    if(document.getElementById('play-shared-system-css'))return;
    const style=document.createElement('style');
    style.id='play-shared-system-css';
    style.textContent=`
      .play-shared-toast{position:fixed;left:50%;bottom:22px;z-index:3000;transform:translate(-50%,14px);opacity:0;pointer-events:none;border:1px solid rgba(250,204,21,.5);border-radius:999px;background:#101725;padding:9px 13px;color:#fde68a;font:900 11px/1 system-ui;transition:.18s ease}.play-shared-toast.show{opacity:1;transform:translate(-50%,0)}
      body.play-identity-open{overflow:hidden}.play-identity-modal{position:fixed;inset:0;z-index:2900;display:grid;place-items:center;padding:16px;background:rgba(2,6,23,.78);backdrop-filter:blur(8px)}.play-identity-dialog{width:min(430px,100%);border:1px solid rgba(249,115,22,.62);border-radius:21px;background:linear-gradient(180deg,#202d43,#101725);box-shadow:0 24px 80px rgba(0,0,0,.52);padding:18px;color:#f8fafc}.play-identity-kicker{color:#facc15;font:950 9px/1 system-ui;letter-spacing:.13em}.play-identity-dialog h3{margin:6px 0 0;font:950 25px/1.05 system-ui}.play-identity-dialog p{margin:8px 0 14px;color:#cbd5e1;font:500 12px/1.45 system-ui}.play-identity-dialog label{display:grid;gap:5px;margin-top:9px;color:#cbd5e1;font:850 9px/1 system-ui;letter-spacing:.04em}.play-identity-dialog input{min-height:43px;border:1px solid #526786;border-radius:12px;background:#0f1624;color:#fff;padding:0 11px;font:800 14px/1 system-ui}.play-identity-status{min-height:18px;margin-top:8px;color:#fdba74;font:750 10px/1.4 system-ui}.play-identity-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:8px;margin-top:8px}.play-identity-actions button{min-height:42px;border:1px solid #526786;border-radius:12px;background:#172033;color:#fff;font:950 10px/1 system-ui;cursor:pointer}.play-identity-actions .primary{border-color:#f97316;background:#f97316;color:#111827}.play-identity-dialog>small{display:block;margin-top:9px;color:#94a3b8;font:500 9px/1.35 system-ui}
      #play .play-identity-chip{margin-left:auto;border:1px solid #526786;border-radius:999px;background:#101725;padding:7px 10px;color:#f8fafc;text-align:left;cursor:pointer}#play .play-identity-chip span,#play .play-identity-chip strong{display:block}#play .play-identity-chip span{color:#94a3b8;font-size:7px;font-weight:950;letter-spacing:.09em}#play .play-identity-chip strong{margin-top:2px;color:#fde68a;font-size:10px}
      #play .play-challenge-banner{border:1px solid rgba(250,204,21,.45);border-radius:15px;background:linear-gradient(135deg,rgba(250,204,21,.1),rgba(249,115,22,.06)),#101725;padding:11px;text-align:center}#play .play-challenge-banner span,#play .play-challenge-banner strong,#play .play-challenge-banner small{display:block}#play .play-challenge-banner span{color:#facc15;font-size:8px;font-weight:950;letter-spacing:.12em}#play .play-challenge-banner strong{margin-top:4px;color:#fff;font-size:14px}#play .play-challenge-banner small{margin-top:3px;color:#94a3b8;font-size:9px}
      #play .play-challenge-comparison{grid-column:1/-1;border:1px solid rgba(250,204,21,.48);border-radius:17px;background:linear-gradient(135deg,rgba(250,204,21,.08),rgba(249,115,22,.05)),#101725;padding:12px}#play .play-challenge-comparison>header{display:flex;justify-content:space-between;align-items:end;gap:10px;margin-bottom:10px}#play .play-challenge-comparison>header span,#play .play-compare-splits>span{display:block;color:#facc15;font-size:8px;font-weight:950;letter-spacing:.12em}#play .play-challenge-comparison>header strong{display:block;margin-top:3px;color:#fff;font-size:18px}#play .play-challenge-comparison>header small{color:#94a3b8;font-size:9px;font-weight:850}.play-compare-people{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.play-compare-people>section{border:1px solid #465a78;border-radius:14px;background:#172033;padding:9px}.play-compare-people h4{margin:0 0 8px;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.05em}.play-compare-group{border-top:1px solid #334155;padding-top:7px;margin-top:7px}.play-compare-group>span{color:#94a3b8;font-size:7px;font-weight:950;letter-spacing:.09em}.play-compare-group>strong{float:right;font-size:10px;letter-spacing:.06em}.play-compare-group.keep>strong{color:#4ade80}.play-compare-group.cut>strong{color:#fb7185}.play-compare-group>div{clear:both;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;padding-top:6px}.play-compare-group article{min-width:0;border:1px solid #334155;border-radius:10px;background:#101725;padding:5px;display:grid;grid-template-columns:30px minmax(0,1fr);gap:5px;align-items:center}.play-compare-group article>b{min-width:0;color:#fff;font-size:8px;line-height:1.05}.play-compare-photo{width:30px;height:30px;border-radius:7px;background:#26364e;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#e2e8f0;font-size:8px}.play-compare-photo img{width:100%;height:100%;object-fit:cover;object-position:center top}.play-compare-splits{margin-top:9px}.play-compare-splits p{display:inline-grid;margin:6px 5px 0 0;border:1px solid #334155;border-radius:9px;background:#172033;padding:6px}.play-compare-splits p strong,.play-compare-splits p small{display:block}.play-compare-splits p strong{color:#fff;font-size:9px}.play-compare-splits p small{margin-top:2px;color:#cbd5e1;font-size:7px}
      #play .play-daily-results{border:1px solid rgba(250,204,21,.45);border-radius:17px;background:#101725;padding:12px}#play .play-daily-results>header{display:flex;justify-content:space-between;align-items:end;gap:10px}#play .play-daily-results>header span{display:block;color:#facc15;font-size:8px;font-weight:950;letter-spacing:.12em}#play .play-daily-results>header strong{display:block;margin-top:3px;color:#fff;font-size:17px}#play .play-daily-results>header small{color:#cbd5e1;font-size:9px}#play .play-daily-results>p{margin:8px 0;color:#94a3b8;font-size:9px}.play-daily-board{display:grid;gap:5px}.play-daily-board>div{display:grid;grid-template-columns:34px minmax(0,1fr) auto auto;gap:7px;align-items:center;border:1px solid #334155;border-radius:10px;background:#172033;padding:7px}.play-daily-board>div.you{border-color:#f97316}.play-daily-board b{color:#facc15;font-size:11px}.play-daily-board strong{color:#fff;font-size:10px}.play-daily-board span,.play-daily-board small{color:#cbd5e1;font-size:8px}
      @media(max-width:700px){.play-identity-actions{grid-template-columns:1fr}.play-compare-people{grid-template-columns:1fr}.play-daily-board>div{grid-template-columns:30px minmax(0,1fr) auto}.play-daily-board small{display:none}#play .play-identity-chip{width:100%;margin:8px 0 0}.play-hub-heading{flex-wrap:wrap}}
    `;
    document.head.appendChild(style);
  }

  function bind(){
    injectStyles();
    resolveIdentity().catch(()=>undefined).finally(renderIdentityChip);
    window.addEventListener('ufc-play-hub-ready',renderIdentityChip);

    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-kc-challenge]')){
        event.preventDefault();
        event.stopImmediatePropagation();
        createKeepCutChallenge();
        return;
      }
      if(event.target.closest?.('[data-five-round-replay]')&&document.documentElement.getAttribute('data-play-screen')==='daily-blind'){
        markDailyReplay();
      }
    },true);

    const observer=new MutationObserver(()=>{
      requestAnimationFrame(()=>{
        submitChallengeResult();
        submitDailyIfComplete();
        if(activeChallenge)renderChallengeBanner(activeChallenge);
      });
    });
    observer.observe(document.getElementById('play')||document.body,{childList:true,subtree:true});

    const challengeCode=challengeCodeFromUrl();
    if(challengeCode)setTimeout(()=>openChallenge(challengeCode),220);

    window.UFC_PLAY_SHARED={
      version:VERSION,
      client,
      resolveIdentity,
      requireIdentity,
      loginWithPin,
      dailyContext,
      prepareDaily,
      markDailyReplay,
      createKeepCutChallenge,
      openChallenge,
      get identity(){return identityCache;},
      get activeChallenge(){return activeChallenge;}
    };
    document.documentElement.setAttribute('data-play-shared-system',VERSION);
    window.dispatchEvent(new CustomEvent('ufc-play-shared-ready',{detail:{version:VERSION}}));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();