(function(){
  'use strict';

  const VERSION='play-shared-system-20260715b-generic-adapters';
  const config=window.UFC_SUPABASE_CONFIG||{};
  const client=config.url&&config.anonKey&&window.supabase?.createClient
    ? window.supabase.createClient(config.url,config.anonKey)
    : null;

  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  const ACTIVE_GROUP_KEY='ufc-player:group-code';
  const CHALLENGE_SESSION_KEY='ufc-play:active-challenge-v2';

  const adapters=new Map();
  const dailyContextCache=new Map();
  const dailyRuns=new Map();
  let identityCache=null;
  let activeChallenge=null;
  let pendingChallenge=null;
  let openingChallenge=false;
  let submittingChallenge=false;
  let dailySubmitting=false;
  let modalPromise=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const normalizeCode=value=>String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const normalizeGroupCode=value=>normalizeCode(value).slice(0,6);
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
    toast.timer=setTimeout(()=>node.classList.remove('show'),2100);
  }

  function backendMessage(error,fallback='That did not work.'){
    const message=String(error?.message||fallback);
    if(/play_identity_snapshot|play_create_challenge|play_get_challenge|play_submit_challenge|play_daily_context|play_submit_daily_attempt|play_daily_leaderboard|schema cache|could not find the function|does not exist/i.test(message)){
      return 'Play sharing needs the generic Supabase Play migration.';
    }
    return message;
  }

  function storedGroupCodes(){
    const codes=[];
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(GROUP_TOKEN_PREFIX)||!localStorage.getItem(key))continue;
        const code=normalizeGroupCode(key.slice(GROUP_TOKEN_PREFIX.length));
        if(code)codes.push(code);
      }
    }catch(_error){}
    return [...new Set(codes)];
  }

  function memberToken(code){
    try{return localStorage.getItem(`${GROUP_TOKEN_PREFIX}${normalizeGroupCode(code)}`)||'';}
    catch(_error){return'';}
  }

  function candidateCodes(preferred=''){
    const url=new URL(window.location.href);
    const values=[
      normalizeGroupCode(preferred),
      normalizeGroupCode(url.searchParams.get('group')),
      normalizeGroupCode(localStorage.getItem(ACTIVE_GROUP_KEY)),
      ...storedGroupCodes()
    ].filter(Boolean);
    return [...new Set(values)];
  }

  async function identitySnapshot(code,token){
    if(!client)return null;
    const {data,error}=await client.rpc('play_identity_snapshot',{
      p_group_code:normalizeGroupCode(code),
      p_member_token:token
    });
    if(error)throw error;
    if(!data?.ok)return null;
    return {...data,groupCode:normalizeGroupCode(data.group?.code||code),memberToken:token};
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
    const code=normalizeGroupCode(data?.group?.code);
    const token=data?.member_token||'';
    const admin=data?.admin_token||'';
    if(!code||!token)return false;
    localStorage.setItem(`${GROUP_TOKEN_PREFIX}${code}`,token);
    if(admin)localStorage.setItem(`${GROUP_ADMIN_PREFIX}${code}`,admin);
    else localStorage.removeItem(`${GROUP_ADMIN_PREFIX}${code}`);
    localStorage.setItem(ACTIVE_GROUP_KEY,code);
    localStorage.setItem('ufc-picks:display-name',data.member?.display_name||'');
    (data.rooms||[]).forEach(room=>{
      const roomCode=normalizeGroupCode(room.code);
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
      p_group_code:normalizeGroupCode(groupCode),
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
    document.getElementById('playIdentityModal')?.remove();
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
      const preferred=normalizeGroupCode(options.preferredGroup)||normalizeGroupCode(localStorage.getItem(ACTIVE_GROUP_KEY))||candidateCodes()[0]||'';
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
        const group=normalizeGroupCode(document.getElementById('playIdentityGroup')?.value);
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

  function cleanChallengeUrl(code){
    const url=new URL(window.location.href);
    ['game','kcpack','kclineup','kcchoices','kcv','brpack','brlineup','room'].forEach(key=>url.searchParams.delete(key));
    url.searchParams.set('challenge',normalizeCode(code));
    url.hash='play';
    return url.toString();
  }

  function challengeCodeFromUrl(){
    const url=new URL(window.location.href);
    const query=normalizeCode(url.searchParams.get('challenge'));
    if(query)return query;
    const match=String(url.hash||'').match(/(?:^#|[&#])challenge=([A-Z0-9]{4,10})/i);
    return normalizeCode(match?.[1]);
  }

  function adapterFor(id){return adapters.get(String(id||'').trim().toLowerCase())||null;}

  function registerAdapter(adapter){
    if(!adapter||!adapter.id)throw new Error('Play adapter requires an id.');
    const id=String(adapter.id).trim().toLowerCase();
    const normalized={version:'1',title:id,...adapter,id};
    adapters.set(id,normalized);
    try{normalized.bind?.(api);}catch(error){console.error('Play adapter bind failed',id,error);}
    try{normalized.decorate?.();}catch(_error){}
    if(pendingChallenge?.game_type===id)setTimeout(tryOpenPendingChallenge,0);
    window.dispatchEvent(new CustomEvent('ufc-play-adapter-ready',{detail:{id,version:normalized.version}}));
    return normalized;
  }

  async function createChallenge(gameType){
    const adapter=adapterFor(gameType);
    if(!adapter){toast('That game is not ready for challenges yet.');return;}
    if(adapter.canChallenge&& !adapter.canChallenge()){toast(adapter.incompleteMessage||'Finish the game before challenging a friend.');return;}
    let setup;
    let result;
    try{
      setup=adapter.exportSetup?.();
      result=adapter.exportResult?.();
    }catch(error){toast(error.message||'Could not prepare that challenge.');return;}
    if(!setup||!result){toast(adapter.incompleteMessage||'Finish the game before challenging a friend.');return;}
    const identity=await requireIdentity({
      title:'Sign in to create the challenge',
      description:`The exact ${adapter.title} setup and your completed result will be saved for your friend.`
    });
    if(!identity||!client)return;
    const {data,error}=await client.rpc('play_create_challenge',{
      p_game_type:adapter.id,
      p_game_version:String(adapter.version||'1'),
      p_group_code:identity.groupCode,
      p_member_token:identity.memberToken,
      p_setup:setup,
      p_result:result,
      p_metadata:adapter.exportMetadata?.()||{},
      p_expires_days:Number(adapter.expiresDays)||365
    });
    if(error||!data?.ok){toast(backendMessage(error||new Error(data?.error),'Challenge not created.'));return;}
    const url=cleanChallengeUrl(data.code);
    const text=adapter.shareText?.({url,code:data.code})||`I made a UFC ${adapter.title} challenge. Play the exact same setup, then compare your result with mine.\n\n${url}`;
    try{
      if(navigator.share)await navigator.share({title:`UFC ${adapter.title} Challenge`,text,url});
      else{await navigator.clipboard.writeText(text);toast('Challenge link copied');}
    }catch(error){
      if(error?.name==='AbortError')return;
      try{await navigator.clipboard.writeText(text);toast('Challenge link copied');}
      catch(_copyError){toast('Could not share the challenge.');}
    }
  }

  async function getChallenge(code){
    if(!client)throw new Error('Supabase is not connected.');
    const {data,error}=await client.rpc('play_get_challenge',{p_challenge_code:normalizeCode(code)});
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Challenge not found.');
    return data.challenge;
  }

  function saveActiveChallenge(challenge){
    activeChallenge={...challenge,submitted:false};
    try{sessionStorage.setItem(CHALLENGE_SESSION_KEY,JSON.stringify(activeChallenge));}catch(_error){}
  }

  function clearActiveChallenge(){
    activeChallenge=null;
    try{sessionStorage.removeItem(CHALLENGE_SESSION_KEY);}catch(_error){}
    document.getElementById('playChallengeBanner')?.remove();
  }

  function renderChallengeBanner(challenge,adapter){
    const host=adapter?.bannerHost?.()||document.querySelector('#play .play-panel:not([hidden])');
    if(!host)return;
    let banner=document.getElementById('playChallengeBanner');
    if(!banner){
      banner=document.createElement('div');
      banner.id='playChallengeBanner';
      banner.className='play-challenge-banner';
    }
    banner.innerHTML=`<span>FRIEND CHALLENGE</span><strong>${esc(challenge.creator_name)} sent you the same ${esc(adapter?.title||'game')} setup.</strong><small>Your result stays private until you finish.</small>`;
    if(banner.parentElement!==host)host.prepend(banner);
  }

  async function openChallenge(code){
    if(openingChallenge)return;
    openingChallenge=true;
    try{
      const challenge=await getChallenge(code);
      pendingChallenge=challenge;
      const identity=await requireIdentity({
        preferredGroup:challenge.creator_group_code,
        title:`Play ${challenge.creator_name}'s challenge`,
        description:'Sign in with your existing Picks profile so the final comparison belongs to you.'
      });
      if(!identity){pendingChallenge=null;return;}
      challenge.identity=identity;
      await tryOpenPendingChallenge();
    }catch(error){
      pendingChallenge=null;
      toast(backendMessage(error,'Challenge not found.'));
    }finally{
      openingChallenge=false;
    }
  }

  async function tryOpenPendingChallenge(){
    const challenge=pendingChallenge;
    if(!challenge)return false;
    const adapter=adapterFor(challenge.game_type);
    if(!adapter)return false;
    try{
      await adapter.openSetup?.(challenge.setup,challenge);
      saveActiveChallenge(challenge);
      pendingChallenge=null;
      setTimeout(()=>renderChallengeBanner(challenge,adapter),80);
      return true;
    }catch(error){
      pendingChallenge=null;
      toast(error.message||'Challenge could not open.');
      return false;
    }
  }

  async function submitActiveChallenge(){
    if(submittingChallenge||!activeChallenge||activeChallenge.submitted)return;
    const adapter=adapterFor(activeChallenge.game_type);
    if(!adapter||!adapter.isComplete?.())return;
    if(adapter.matchesSetup&& !adapter.matchesSetup(activeChallenge.setup))return;
    let result;
    try{result=adapter.exportResult?.();}
    catch(_error){return;}
    if(!result)return;
    submittingChallenge=true;
    const identity=await requireIdentity({preferredGroup:activeChallenge.creator_group_code,title:'Sign in to see the comparison'});
    if(!identity){submittingChallenge=false;return;}
    const score=adapter.exportScore?.();
    const {data,error}=await client.rpc('play_submit_challenge',{
      p_challenge_code:activeChallenge.code,
      p_group_code:identity.groupCode,
      p_member_token:identity.memberToken,
      p_result:result,
      p_score:Number.isFinite(Number(score))?Number(score):null,
      p_metadata:adapter.exportResponseMetadata?.()||{}
    });
    submittingChallenge=false;
    if(error||!data?.ok){toast(backendMessage(error||new Error(data?.error),'Comparison could not load.'));return;}
    activeChallenge.submitted=true;
    try{sessionStorage.setItem(CHALLENGE_SESSION_KEY,JSON.stringify(activeChallenge));}catch(_error){}
    try{adapter.renderComparison?.(data);}catch(renderError){console.error(renderError);toast('Result saved, but the comparison could not render.');}
  }

  function centralDay(){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return new Date().toISOString().slice(0,10);}
  }

  async function dailyContext(gameType='blind-resume',gameVersion='',maxScore=0){
    const adapter=adapterFor(gameType);
    const version=String(gameVersion||adapter?.daily?.version||adapter?.version||'1');
    const max=Math.max(1,Number(maxScore)||Number(adapter?.daily?.maxScore)||5);
    const cacheKey=`${gameType}|${version}`;
    if(dailyContextCache.has(cacheKey))return dailyContextCache.get(cacheKey);
    if(client){
      const {data,error}=await client.rpc('play_daily_context',{
        p_game_type:gameType,
        p_game_version:version,
        p_max_score:max
      });
      if(!error&&data?.ok){dailyContextCache.set(cacheKey,data);return data;}
      if(error&&!/play_daily_context|schema cache|does not exist/i.test(String(error.message||'')))throw error;
    }
    const day=centralDay();
    const fallback={
      ok:false,
      fallback:true,
      game_type:gameType,
      game_version:version,
      challenge_day:day,
      challenge_key:`${gameType}:${day}`,
      seed:`${gameType}|${day}|${version}|daily-v2`,
      max_score:max,
      timezone:'America/Chicago'
    };
    dailyContextCache.set(cacheKey,fallback);
    return fallback;
  }

  async function prepareDaily(gameType='blind-resume'){
    const adapter=adapterFor(gameType);
    const context=await dailyContext(gameType,adapter?.daily?.version,adapter?.daily?.maxScore);
    const identity=await requireIdentity({
      title:"Sign in for today's leaderboard",
      description:'Your first completed attempt becomes official. Replays update your best score and attempt count.',
      allowCancel:true
    });
    if(!identity)return null;
    const run=dailyRuns.get(gameType)||{id:0,submitted:-1};
    run.id+=1;
    run.submitted=-1;
    dailyRuns.set(gameType,run);
    return {context,identity};
  }

  function markDailyReplay(gameType='blind-resume'){
    const run=dailyRuns.get(gameType)||{id:0,submitted:-1};
    run.id+=1;
    run.submitted=-1;
    dailyRuns.set(gameType,run);
  }

  async function dailyLeaderboard(gameType,day){
    const {data,error}=await client.rpc('play_daily_leaderboard',{
      p_game_type:gameType,
      p_challenge_day:day,
      p_limit:50
    });
    if(error)throw error;
    return data;
  }

  function renderDefaultDailyLeaderboard(adapter,attempt,board){
    const host=adapter.daily?.resultHost?.();
    if(!host)return;
    host.querySelector('.play-daily-results')?.remove();
    const rows=(board?.rows||[]).slice(0,10);
    const max=attempt.max_score||board?.max_score||adapter.daily?.maxScore||5;
    const markup=`<section class="play-daily-results">
      <header><div><span>TODAY'S LEADERBOARD</span><strong>Your rank: #${attempt.rank} of ${attempt.player_count}</strong></div><small>Official ${attempt.official_score}/${max} · Best ${attempt.best_score}/${max} · ${attempt.attempt_count} attempt${attempt.attempt_count===1?'':'s'}</small></header>
      <p>Your first completed attempt is official. Replays can improve only your best score.</p>
      <div class="play-daily-board">${rows.map(row=>`<div${row.display_name===attempt.player?.display_name?' class="you"':''}><b>#${row.rank}</b><strong>${esc(row.display_name)}</strong><span>Official ${row.official_score}/${row.max_score||max}</span><small>Best ${row.best_score}/${row.max_score||max} · ${row.attempt_count}x</small></div>`).join('')}</div>
    </section>`;
    const anchor=adapter.daily?.resultAnchor?.()||host.firstElementChild;
    if(anchor)anchor.insertAdjacentHTML('afterend',markup);
    else host.insertAdjacentHTML('afterbegin',markup);
  }

  async function submitDailyIfComplete(){
    if(dailySubmitting||!client)return;
    const adapter=[...adapters.values()].find(item=>item.daily?.isActive?.()&&item.isComplete?.());
    if(!adapter)return;
    const run=dailyRuns.get(adapter.id)||{id:0,submitted:-1};
    if(run.submitted===run.id)return;
    dailySubmitting=true;
    const identity=await requireIdentity({title:"Sign in for today's leaderboard"});
    if(!identity){dailySubmitting=false;return;}
    let result;
    let score;
    try{
      result=adapter.daily.exportResult?.()||adapter.exportResult?.();
      score=adapter.daily.score?.();
    }catch(_error){dailySubmitting=false;return;}
    if(!result||!Number.isFinite(Number(score))){dailySubmitting=false;return;}
    const context=await dailyContext(adapter.id,adapter.daily.version,adapter.daily.maxScore);
    const {data,error}=await client.rpc('play_submit_daily_attempt',{
      p_game_type:adapter.id,
      p_game_version:String(adapter.daily.version||adapter.version||'1'),
      p_group_code:identity.groupCode,
      p_member_token:identity.memberToken,
      p_score:Number(score),
      p_result:result,
      p_max_score:Number(adapter.daily.maxScore)||5
    });
    if(error||!data?.ok){dailySubmitting=false;toast(backendMessage(error||new Error(data?.error),'Score not saved.'));return;}
    run.submitted=run.id;
    dailyRuns.set(adapter.id,run);
    try{
      const board=await dailyLeaderboard(adapter.id,context.challenge_day);
      if(adapter.daily.renderLeaderboard)adapter.daily.renderLeaderboard(data,board);
      else renderDefaultDailyLeaderboard(adapter,data,board);
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
      #play .play-generic-comparison{border:1px solid rgba(250,204,21,.48);border-radius:17px;background:linear-gradient(135deg,rgba(250,204,21,.08),rgba(249,115,22,.05)),#101725;padding:12px}#play .play-generic-comparison>header{display:flex;justify-content:space-between;align-items:end;gap:10px;margin-bottom:10px}#play .play-generic-comparison>header span{display:block;color:#facc15;font-size:8px;font-weight:950;letter-spacing:.12em}#play .play-generic-comparison>header strong{display:block;margin-top:3px;color:#fff;font-size:18px}#play .play-generic-comparison>header small{color:#94a3b8;font-size:9px;font-weight:850}
      #play .play-daily-results{border:1px solid rgba(250,204,21,.45);border-radius:17px;background:#101725;padding:12px}#play .play-daily-results>header{display:flex;justify-content:space-between;align-items:end;gap:10px}#play .play-daily-results>header span{display:block;color:#facc15;font-size:8px;font-weight:950;letter-spacing:.12em}#play .play-daily-results>header strong{display:block;margin-top:3px;color:#fff;font-size:17px}#play .play-daily-results>header small{color:#cbd5e1;font-size:9px}#play .play-daily-results>p{margin:8px 0;color:#94a3b8;font-size:9px}.play-daily-board{display:grid;gap:5px}.play-daily-board>div{display:grid;grid-template-columns:34px minmax(0,1fr) auto auto;gap:7px;align-items:center;border:1px solid #334155;border-radius:10px;background:#172033;padding:7px}.play-daily-board>div.you{border-color:#f97316}.play-daily-board b{color:#facc15;font-size:11px}.play-daily-board strong{color:#fff;font-size:10px}.play-daily-board span,.play-daily-board small{color:#cbd5e1;font-size:8px}
      @media(max-width:700px){.play-identity-actions{grid-template-columns:1fr}.play-daily-board>div{grid-template-columns:30px minmax(0,1fr) auto}.play-daily-board small{display:none}#play .play-identity-chip{width:100%;margin:8px 0 0}.play-hub-heading{flex-wrap:wrap}}
    `;
    document.head.appendChild(style);
  }

  function decorateAdapters(){
    adapters.forEach(adapter=>{try{adapter.decorate?.();}catch(_error){}});
  }

  function bind(){
    injectStyles();

    api.version=VERSION;
    api.client=client;
    api.registerAdapter=registerAdapter;
    api.adapterFor=adapterFor;
    api.createChallenge=createChallenge;
    api.openChallenge=openChallenge;
    api.resolveIdentity=resolveIdentity;
    api.requireIdentity=requireIdentity;
    api.loginWithPin=loginWithPin;
    api.dailyContext=dailyContext;
    api.prepareDaily=prepareDaily;
    api.markDailyReplay=markDailyReplay;
    api.clearActiveChallenge=clearActiveChallenge;

    resolveIdentity().catch(()=>undefined).finally(renderIdentityChip);
    window.addEventListener('ufc-play-hub-ready',renderIdentityChip);

    document.addEventListener('click',event=>{
      for(const adapter of adapters.values()){
        if(!adapter.challengeSelector)continue;
        const trigger=event.target.closest?.(adapter.challengeSelector);
        if(!trigger)continue;
        if(adapter.shouldHandleChallenge&& !adapter.shouldHandleChallenge(trigger,event))continue;
        event.preventDefault();
        event.stopImmediatePropagation();
        createChallenge(adapter.id);
        return;
      }
      if(event.target.closest?.('[data-five-round-replay]')&&document.documentElement.getAttribute('data-play-screen')==='daily-blind'){
        markDailyReplay('blind-resume');
      }
    },true);

    const observer=new MutationObserver(()=>{
      requestAnimationFrame(()=>{
        decorateAdapters();
        submitActiveChallenge();
        submitDailyIfComplete();
        if(activeChallenge&&!activeChallenge.submitted){
          const adapter=adapterFor(activeChallenge.game_type);
          if(adapter)renderChallengeBanner(activeChallenge,adapter);
        }
      });
    });
    observer.observe(document.getElementById('play')||document.body,{childList:true,subtree:true});

    const challengeCode=challengeCodeFromUrl();
    if(challengeCode)setTimeout(()=>openChallenge(challengeCode),220);

    document.documentElement.setAttribute('data-play-shared-system',VERSION);
    window.dispatchEvent(new CustomEvent('ufc-play-shared-ready',{detail:{version:VERSION}}));
  }

  const api=window.UFC_PLAY_SHARED||{};
  window.UFC_PLAY_SHARED=api;

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();