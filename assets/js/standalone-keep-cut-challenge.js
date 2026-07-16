(function(){
  'use strict';

  const VERSION='standalone-keep-cut-challenge-20260715a';
  const pageUrl=new URL(window.location.href);
  const code=String(pageUrl.searchParams.get('code')||pageUrl.searchParams.get('challenge')||'')
    .trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  const host=document.getElementById('challengeApp');
  const statusNode=document.getElementById('challengeStatus');
  const profileNode=document.getElementById('challengeProfile');
  const state={challenge:null,lineup:[],decisions:[],index:0,submitting:false,comparison:null};

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const normalizeJson=value=>{
    if(typeof value!=='string')return value;
    try{return JSON.parse(value);}catch(_error){return value;}
  };
  const saveKey=()=>`ufc-standalone-keep-cut:${code}`;

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

  function visual(fighter,className='fighter-photo'){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }

  function fighterMeta(fighter){
    return [fighter?.primaryDivision||fighter?.division||fighter?.divisions?.[0],fighter?.eraLabel].filter(Boolean).join(' · ')||'UFC career';
  }

  function resolveFighter(entry,index,setup){
    const names=Array.isArray(setup?.fighterNames)?setup.fighterNames:Array.isArray(setup?.names)?setup.names:[];
    const raw=typeof entry==='string'?{id:entry,name:names[index]||''}:entry||{};
    const resolved=window.UFC_PLAY_DATA?.resolve?.(raw.id||raw.name)||window.UFC_PLAY_DATA?.resolve?.(raw.name||raw.id)||null;
    return {
      ...(resolved||{}),
      ...raw,
      id:String(raw.id||resolved?.id||raw.name||`fighter-${index+1}`),
      name:String(raw.name||resolved?.name||names[index]||raw.id||`Fighter ${index+1}`),
      primaryDivision:raw.primaryDivision||raw.division||resolved?.primaryDivision||resolved?.divisions?.[0]||'',
      divisions:Array.isArray(raw.divisions)?raw.divisions:(resolved?.divisions||[]),
      thumbUrl:raw.thumbUrl||resolved?.thumbUrl||'',
      profileUrl:raw.profileUrl||raw.photoUrl||resolved?.profileUrl||''
    };
  }

  function lineupFromSetup(rawSetup){
    const setup=normalizeJson(rawSetup)||{};
    let rows=[];
    if(Array.isArray(setup.fighters))rows=setup.fighters;
    else if(Array.isArray(setup.lineup))rows=setup.lineup;
    else if(Array.isArray(setup))rows=setup;
    return rows.map((entry,index)=>resolveFighter(entry,index,setup));
  }

  function normalizedDecisions(result){
    const value=normalizeJson(result)||{};
    const rows=Array.isArray(value)?value:Array.isArray(value.decisions)?value.decisions:[];
    return rows.map(choice=>{
      const clean=String(choice||'').trim().toUpperCase();
      return clean==='KEEP'||clean==='K'?'K':clean==='CUT'||clean==='C'?'C':'';
    });
  }

  function keptCount(){return state.decisions.filter(choice=>choice==='K').length;}
  function cutCount(){return state.decisions.filter(choice=>choice==='C').length;}

  function saveProgress(){
    try{sessionStorage.setItem(saveKey(),JSON.stringify({decisions:state.decisions,index:state.index}));}
    catch(_error){}
  }

  function restoreProgress(){
    try{
      const saved=JSON.parse(sessionStorage.getItem(saveKey())||'null');
      if(!saved||!Array.isArray(saved.decisions)||saved.decisions.length>8)return;
      const decisions=saved.decisions.map(value=>value==='K'?'K':value==='C'?'C':'').filter(Boolean);
      if(decisions.filter(value=>value==='K').length>4||decisions.filter(value=>value==='C').length>4)return;
      state.decisions=decisions;
      state.index=Math.min(decisions.length,8);
    }catch(_error){}
  }

  function decisionSlots(choice){
    const fighters=state.lineup.filter((_fighter,index)=>state.decisions[index]===choice);
    return Array.from({length:4},(_,index)=>{
      const fighter=fighters[index];
      return fighter
        ? `<div class="decision-slot filled">${visual(fighter,'slot-photo')}<strong>${esc(fighter.name)}</strong></div>`
        : `<div class="decision-slot empty"><span>${index+1}</span></div>`;
    }).join('');
  }

  function renderGame(){
    const challenge=state.challenge;
    const fighter=state.lineup[state.index];
    const keepFull=keptCount()>=4;
    const cutFull=cutCount()>=4;
    const forced=keepFull?'KEEP IS FULL — THIS FIGHTER MUST BE CUT':cutFull?'CUT IS FULL — THIS FIGHTER MUST BE KEPT':'MAKE THE CALL. IT LOCKS IMMEDIATELY.';
    host.innerHTML=`
      <section class="challenge-intro">
        <span>FRIEND CHALLENGE</span>
        <h1>${esc(challenge.creator_name)} sent you the same eight fighters.</h1>
        <p>Keep four. Cut four. Every decision locks before the next reveal.</p>
      </section>
      <section class="game-card">
        <header class="game-progress"><div><span>KEEP 4 · CUT 4</span><strong>FIGHTER ${Math.min(state.index+1,8)} OF 8</strong></div><div class="counts"><b>${keptCount()} KEPT</b><b>${cutCount()} CUT</b></div></header>
        <div class="decision-board">
          <section><header><span>YOUR FOUR</span><strong>KEEP</strong></header><div class="slot-grid">${decisionSlots('K')}</div></section>
          <section><header><span>YOUR FOUR</span><strong>CUT</strong></header><div class="slot-grid">${decisionSlots('C')}</div></section>
        </div>
        <article class="current-fighter">
          ${visual(fighter,'current-photo')}
          <div class="current-copy"><span>REVEAL ${state.index+1} OF 8</span><h2>${esc(fighter.name)}</h2><p>${esc(fighterMeta(fighter))}</p><small class="forced${keepFull||cutFull?' active':''}">${esc(forced)}</small><div class="choice-actions"><button type="button" data-choice="K" ${keepFull?'disabled':''}>KEEP</button><button type="button" data-choice="C" ${cutFull?'disabled':''}>CUT</button></div></div>
        </article>
      </section>`;
    setStatus('Challenge loaded. Your result stays private until all eight decisions are complete.');
  }

  function resultGroup(title,choice,decisions){
    const fighters=state.lineup.filter((_fighter,index)=>decisions[index]===choice);
    return `<section class="result-group ${choice==='K'?'keep':'cut'}"><header><span>${esc(title)}</span><strong>${choice==='K'?'KEPT':'CUT'}</strong></header><div>${fighters.map(fighter=>`<article>${visual(fighter,'result-photo')}<strong>${esc(fighter.name)}</strong></article>`).join('')}</div></section>`;
  }

  function renderFinish(){
    host.innerHTML=`
      <section class="challenge-intro"><span>COMPLETE</span><h1>Your Keep/Cut card is locked.</h1><p>Sign in with your Picks profile to reveal ${esc(state.challenge.creator_name)}’s decisions.</p></section>
      <section class="finish-card">
        ${resultGroup('YOUR FOUR','K',state.decisions)}
        ${resultGroup('YOUR FOUR','C',state.decisions)}
        <button type="button" class="primary-action" data-submit>SUBMIT & COMPARE</button>
        <a class="secondary-action" href="index.html#play">BACK TO ALL GAMES</a>
      </section>`;
    setStatus('All eight decisions are locked. Submit to compare.','ready');
  }

  function renderComparison(data){
    const mine=normalizedDecisions(data?.responder_result);
    const theirs=normalizedDecisions(data?.creator_result);
    if(mine.length!==8||theirs.length!==8){
      renderFinish();
      setStatus('Your result saved, but the original challenge result could not be compared.','error');
      return;
    }
    const differences=state.lineup.map((fighter,index)=>({fighter,mine:mine[index],theirs:theirs[index]})).filter(row=>row.mine!==row.theirs);
    const same=8-differences.length;
    host.innerHTML=`
      <section class="challenge-intro"><span>CHALLENGE RESULTS</span><h1>${same}/8 same calls.</h1><p>${differences.length?`${differences.length} disagreement${differences.length===1?'':'s'} between you and ${esc(data.creator_name)}.`:`You matched ${esc(data.creator_name)} on every fighter.`}</p></section>
      <section class="comparison-card">
        <div class="player-columns">
          <section><h2>YOU · ${esc(data.responder_name||'PLAYER')}</h2>${resultGroup('YOUR FOUR','K',mine)}${resultGroup('YOUR FOUR','C',mine)}</section>
          <section><h2>${esc(data.creator_name)}</h2>${resultGroup(`${data.creator_name}'S FOUR`,'K',theirs)}${resultGroup(`${data.creator_name}'S FOUR`,'C',theirs)}</section>
        </div>
        ${differences.length?`<section class="split-card"><span>WHERE YOU SPLIT</span><div>${differences.map(row=>`<article><strong>${esc(row.fighter.name)}</strong><small>You ${row.mine==='K'?'kept':'cut'} · ${esc(data.creator_name)} ${row.theirs==='K'?'kept':'cut'}</small></article>`).join('')}</div></section>`:''}
        <a class="primary-action link-action" href="index.html#play">PLAY ANOTHER GAME</a>
      </section>`;
    setStatus('Comparison complete.','success');
    try{sessionStorage.removeItem(saveKey());}catch(_error){}
  }

  async function submitAndCompare(){
    if(state.submitting||state.decisions.length!==8)return;
    state.submitting=true;
    const button=host.querySelector('[data-submit]');
    if(button){button.disabled=true;button.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({
        title:'Reveal the challenge results',
        description:'Use your existing Picks group code, display name, and PIN. Your eight decisions are already locked.'
      });
      if(!identity){
        state.submitting=false;
        if(button){button.disabled=false;button.textContent='SUBMIT & COMPARE';}
        return;
      }
      showProfile(identity);
      if(button)button.textContent='SAVING RESULT…';
      const {data,error}=await client.rpc('play_submit_challenge',{
        p_challenge_code:code,
        p_group_code:identity.groupCode,
        p_member_token:identity.memberToken,
        p_result:{decisions:state.decisions},
        p_score:null,
        p_metadata:{client:VERSION}
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The challenge result could not be saved.');
      state.comparison=data;
      renderComparison(data);
    }catch(error){
      state.submitting=false;
      if(button){button.disabled=false;button.textContent='TRY SUBMIT AGAIN';}
      setStatus(String(error?.message||'The result could not be submitted.'),'error');
    }
  }

  function decide(choice){
    if(state.index>=8||state.decisions.length>=8)return;
    if(choice==='K'&&keptCount()>=4)return;
    if(choice==='C'&&cutCount()>=4)return;
    state.decisions.push(choice);
    state.index=state.decisions.length;
    saveProgress();
    if(state.index>=8){renderFinish();setTimeout(submitAndCompare,120);}
    else renderGame();
  }

  async function load(){
    document.documentElement.setAttribute('data-standalone-keep-cut',VERSION);
    if(!host||!client){setStatus('The challenge page could not connect.','error');return;}
    if(code.length<4){
      setStatus('This challenge link is missing its code.','error');
      host.innerHTML='<section class="error-card"><h1>Challenge link incomplete</h1><p>Ask your friend to send a new Keep 4, Cut 4 link.</p><a href="index.html#play">BACK TO ALL GAMES</a></section>';
      return;
    }
    setStatus('Loading the exact eight-fighter challenge…');
    profile.resolve().then(showProfile).catch(()=>showProfile(null));
    try{
      const {data,error}=await client.rpc('play_get_challenge',{p_challenge_code:code});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge not found.');
      const challenge=data.challenge;
      if(challenge.game_type!=='keep-cut')throw new Error('This standalone page currently supports Keep 4, Cut 4 challenges only.');
      const lineup=lineupFromSetup(challenge.setup);
      if(lineup.length!==8)throw new Error('This challenge is missing fighter data. Ask your friend to create a new link.');
      state.challenge=challenge;
      state.lineup=lineup;
      restoreProgress();
      if(state.index>=8)renderFinish();else renderGame();
    }catch(error){
      setStatus(String(error?.message||'Challenge could not load.'),'error');
      host.innerHTML=`<section class="error-card"><span>CHALLENGE ERROR</span><h1>Could not open this challenge.</h1><p>${esc(error?.message||'The link may have expired.')}</p><a href="index.html#play">BACK TO ALL GAMES</a></section>`;
    }
  }

  document.addEventListener('click',event=>{
    const choice=event.target.closest?.('[data-choice]')?.dataset.choice;
    if(choice)decide(choice);
    if(event.target.closest?.('[data-submit]'))submitAndCompare();
    if(event.target.closest?.('#challengeProfile'))profile.modal({title:'Switch or reconnect profile'}).then(identity=>identity&&showProfile(identity));
  });

  load();
})();
