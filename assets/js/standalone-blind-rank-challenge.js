(function(){
  'use strict';

  const VERSION='standalone-blind-rank-challenge-20260716a';
  const pageUrl=new URL(window.location.href);
  const code=String(pageUrl.searchParams.get('code')||pageUrl.searchParams.get('challenge')||'')
    .trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  const host=document.getElementById('challengeApp');
  const statusNode=document.getElementById('challengeStatus');
  const profileNode=document.getElementById('challengeProfile');
  const state={challenge:null,lineup:[],placements:Array(5).fill(null),index:0,submitting:false};

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const normalizeJson=value=>{if(typeof value!=='string')return value;try{return JSON.parse(value);}catch(_error){return value;}};
  const saveKey=()=>`ufc-standalone-blind-rank:${code}`;

  function setStatus(message,type=''){
    if(!statusNode)return;
    statusNode.textContent=message;
    statusNode.dataset.type=type;
  }

  function showProfile(identity){
    if(!profileNode)return;
    profileNode.innerHTML=identity
      ? `<span>PLAYING AS</span><strong>${esc(identity.member?.display_name||'Player')}</strong>`
      : '<span>PROFILE</span><strong>SIGN IN AT FINISH</strong>';
  }

  function visual(fighter,className){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }

  function fighterMeta(fighter){
    return [fighter?.primaryDivision||fighter?.divisions?.[0],fighter?.eraLabel].filter(Boolean).join(' · ')||'UFC career';
  }

  function resolveFighter(entry,index,setup){
    const names=Array.isArray(setup?.fighterNames)?setup.fighterNames:Array.isArray(setup?.names)?setup.names:[];
    const raw=typeof entry==='string'?{id:entry,name:names[index]||''}:entry||{};
    const resolved=window.UFC_PLAY_DATA?.resolve?.(raw.id||raw.name)||window.UFC_PLAY_DATA?.resolve?.(raw.name||raw.id)||null;
    return {
      ...(resolved||{}),...raw,
      id:String(raw.id||resolved?.id||raw.name||`fighter-${index+1}`),
      name:String(raw.name||resolved?.name||names[index]||raw.id||`Fighter ${index+1}`),
      primaryDivision:raw.primaryDivision||resolved?.primaryDivision||resolved?.divisions?.[0]||'',
      divisions:Array.isArray(raw.divisions)?raw.divisions:(resolved?.divisions||[]),
      thumbUrl:raw.thumbUrl||resolved?.thumbUrl||'',
      profileUrl:raw.profileUrl||resolved?.profileUrl||''
    };
  }

  function lineupFromSetup(rawSetup){
    const setup=normalizeJson(rawSetup)||{};
    const rows=Array.isArray(setup.fighters)?setup.fighters:Array.isArray(setup.lineup)?setup.lineup:Array.isArray(setup)?setup:[];
    return rows.map((entry,index)=>resolveFighter(entry,index,setup));
  }

  function normalizedRanking(result){
    const value=normalizeJson(result)||{};
    const rows=Array.isArray(value)?value:Array.isArray(value.ranking)?value.ranking:Array.isArray(value.placements)?value.placements:[];
    return rows.map(item=>typeof item==='string'?item:item?.id||item?.fighterId||'').filter(Boolean);
  }

  function saveProgress(){
    try{sessionStorage.setItem(saveKey(),JSON.stringify({placements:state.placements.map(f=>f?.id||null),index:state.index}));}catch(_error){}
  }

  function restoreProgress(){
    try{
      const saved=JSON.parse(sessionStorage.getItem(saveKey())||'null');
      if(!saved||!Array.isArray(saved.placements)||saved.placements.length!==5)return;
      const placements=saved.placements.map(id=>id?state.lineup.find(f=>f.id===id)||null:null);
      const placed=placements.filter(Boolean);
      if(new Set(placed.map(f=>f.id)).size!==placed.length)return;
      state.placements=placements;
      state.index=Math.min(placed.length,5);
    }catch(_error){}
  }

  function renderSlots(){
    return state.placements.map((fighter,index)=>fighter
      ? `<button class="rank-slot" type="button" disabled><span class="rank-slot-number">${index+1}</span><span class="slot-fighter">${visual(fighter,'slot-photo')}<strong>${esc(fighter.name)}</strong></span></button>`
      : `<button class="rank-slot empty open" type="button" data-slot="${index}"><span class="rank-slot-number">${index+1}</span><span>PLACE HERE</span></button>`).join('');
  }

  function renderGame(){
    const fighter=state.lineup[state.index];
    host.innerHTML=`
      <section class="challenge-intro"><span>FRIEND CHALLENGE</span><h1>${esc(state.challenge.creator_name)} sent you the same five fighters.</h1><p>Rank them from #1 to #5. Every placement locks before the next reveal.</p></section>
      <section class="game-card">
        <header class="game-progress"><div><span>BLIND RANK 5</span><strong>FIGHTER ${state.index+1} OF 5</strong></div><small>${esc(state.challenge.metadata?.packName||'UFC Careers')}</small></header>
        <div class="rank-slots">${renderSlots()}</div>
        <article class="current-fighter">${visual(fighter,'current-photo')}<div class="current-copy"><span>REVEAL ${state.index+1} OF 5</span><h2>${esc(fighter.name)}</h2><p>${esc(fighterMeta(fighter))}</p><small class="instruction">Choose an open slot. Once placed, it is locked.</small></div></article>
      </section>`;
    setStatus('Challenge loaded. Your ranking stays private until all five placements are locked.');
  }

  function rankingList(ranking){
    return ranking.map((fighter,index)=>`<article class="result-row"><div class="result-rank">#${index+1}</div>${visual(fighter,'result-photo')}<div class="result-copy"><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></div></article>`).join('');
  }

  function renderFinish(){
    const ranking=state.placements.filter(Boolean);
    host.innerHTML=`<section class="challenge-intro"><span>COMPLETE</span><h1>Your ranking is locked.</h1><p>Sign in with your Picks profile to reveal ${esc(state.challenge.creator_name)}’s list.</p></section><section class="finish-card"><div class="result-list">${rankingList(ranking)}</div><button type="button" class="primary-action" data-submit>SUBMIT & COMPARE</button><a class="secondary-action" href="index.html#play">BACK TO ALL GAMES</a></section>`;
    setStatus('All five placements are locked. Submit to compare.','ready');
  }

  function comparisonRows(ranking,otherPositions){
    return ranking.map((fighter,index)=>{
      const other=otherPositions.get(fighter.id);
      const movement=Number.isFinite(other)?other-(index+1):0;
      return `<article class="comparison-row"><div class="comparison-rank">#${index+1}</div>${visual(fighter,'result-photo')}<strong>${esc(fighter.name)}</strong><em>${movement===0?'SAME':movement>0?`+${movement}`:movement}</em></article>`;
    }).join('');
  }

  function renderComparison(data){
    const myIds=normalizedRanking(data?.responder_result);
    const theirIds=normalizedRanking(data?.creator_result);
    const byId=new Map(state.lineup.map(f=>[f.id,f]));
    const mine=myIds.map(id=>byId.get(id)).filter(Boolean);
    const theirs=theirIds.map(id=>byId.get(id)).filter(Boolean);
    if(mine.length!==5||theirs.length!==5){renderFinish();setStatus('Your ranking saved, but the original list could not be compared.','error');return;}
    const theirPositions=new Map(theirs.map((f,i)=>[f.id,i+1]));
    const myPositions=new Map(mine.map((f,i)=>[f.id,i+1]));
    const movement=mine.map((fighter,index)=>({fighter,you:index+1,them:theirPositions.get(fighter.id),diff:Math.abs((index+1)-theirPositions.get(fighter.id))})).filter(row=>row.diff>0).sort((a,b)=>b.diff-a.diff);
    const exact=5-movement.length;
    host.innerHTML=`
      <section class="challenge-intro"><span>CHALLENGE RESULTS</span><h1>${exact}/5 exact placements.</h1><p>${movement.length?`${movement.length} fighter${movement.length===1?'':'s'} landed in different slots.`:`You matched ${esc(data.creator_name)} exactly.`}</p></section>
      <section class="comparison-card">
        <div class="comparison-grid">
          <section class="player-panel you"><div class="player-head"><b>YOUR RANKING</b><span>${esc(data.responder_name||'PLAYER')}</span></div>${comparisonRows(mine,theirPositions)}</section>
          <section class="player-panel them"><div class="player-head"><b>CHALLENGER</b><span>${esc(data.creator_name)}</span></div>${comparisonRows(theirs,myPositions)}</section>
        </div>
        ${movement.length?`<section class="movement-card"><span>BIGGEST DIFFERENCES</span><div>${movement.map(row=>`<article><strong>${esc(row.fighter.name)}</strong><small>You #${row.you} · ${esc(data.creator_name)} #${row.them}</small></article>`).join('')}</div></section>`:''}
        <a class="primary-action" href="index.html#play">PLAY ANOTHER GAME</a>
      </section>`;
    setStatus('Comparison complete.','success');
    try{sessionStorage.removeItem(saveKey());}catch(_error){}
  }

  async function submitAndCompare(){
    if(state.submitting||state.placements.some(item=>!item))return;
    state.submitting=true;
    const button=host.querySelector('[data-submit]');
    if(button){button.disabled=true;button.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({title:'Reveal the Blind Rank results',description:'Use your existing Picks group code, display name, and PIN. Your five placements are already locked.'});
      if(!identity){state.submitting=false;if(button){button.disabled=false;button.textContent='SUBMIT & COMPARE';}return;}
      showProfile(identity);
      if(button)button.textContent='SAVING RANKING…';
      const {data,error}=await client.rpc('play_submit_challenge',{
        p_challenge_code:code,p_group_code:identity.groupCode,p_member_token:identity.memberToken,
        p_result:{ranking:state.placements.map(f=>f.id)},p_score:null,p_metadata:{client:VERSION}
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The challenge ranking could not be saved.');
      renderComparison(data);
    }catch(error){state.submitting=false;if(button){button.disabled=false;button.textContent='TRY SUBMIT AGAIN';}setStatus(String(error?.message||'The ranking could not be submitted.'),'error');}
  }

  function place(slotIndex){
    if(state.index>=5||state.placements[slotIndex])return;
    state.placements[slotIndex]=state.lineup[state.index];
    state.index+=1;
    saveProgress();
    if(state.index>=5){renderFinish();setTimeout(submitAndCompare,120);}else renderGame();
  }

  async function load(){
    document.documentElement.setAttribute('data-standalone-blind-rank',VERSION);
    if(!host||!client){setStatus('The challenge page could not connect.','error');return;}
    if(code.length<4){setStatus('This challenge link is missing its code.','error');host.innerHTML='<section class="error-card"><h1>Challenge link incomplete</h1><p>Ask your friend to send a new Blind Rank link.</p><a href="index.html#play">BACK TO ALL GAMES</a></section>';return;}
    profile.resolve().then(showProfile).catch(()=>showProfile(null));
    try{
      const {data,error}=await client.rpc('play_get_challenge',{p_challenge_code:code});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge not found.');
      const challenge=data.challenge;
      if(challenge.game_type!=='blind-rank')throw new Error('This page supports Blind Rank 5 challenges only.');
      const lineup=lineupFromSetup(challenge.setup);
      if(lineup.length!==5)throw new Error('This challenge is missing fighter data. Ask your friend to create a new link.');
      state.challenge=challenge;state.lineup=lineup;restoreProgress();
      if(state.index>=5)renderFinish();else renderGame();
    }catch(error){setStatus(String(error?.message||'Challenge could not load.'),'error');host.innerHTML=`<section class="error-card"><span>CHALLENGE ERROR</span><h1>Could not open this challenge.</h1><p>${esc(error?.message||'The link may have expired.')}</p><a href="index.html#play">BACK TO ALL GAMES</a></section>`;}
  }

  document.addEventListener('click',event=>{
    const slot=event.target.closest?.('[data-slot]');
    if(slot)place(Number(slot.dataset.slot));
    if(event.target.closest?.('[data-submit]'))submitAndCompare();
    if(event.target.closest?.('#challengeProfile'))profile.modal({title:'Switch or reconnect profile'}).then(identity=>identity&&showProfile(identity));
  });
  load();
})();