(function(){
  'use strict';

  const VERSION='standalone-blind-resume-challenge-20260716a';
  const TOTAL_ROUNDS=5;
  const pageUrl=new URL(window.location.href);
  const code=String(pageUrl.searchParams.get('code')||pageUrl.searchParams.get('challenge')||'')
    .trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  const host=document.getElementById('challengeApp');
  const statusNode=document.getElementById('challengeStatus');
  const profileNode=document.getElementById('challengeProfile');
  const state={challenge:null,rounds:[],choices:[],index:0,submitting:false};

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const normalizeJson=value=>{if(typeof value!=='string')return value;try{return JSON.parse(value);}catch(_error){return value;}};
  const saveKey=()=>`ufc-standalone-blind-resume:${code}`;

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
  function resolveFighter(entry,index){
    const raw=typeof entry==='string'?{id:entry,name:entry}:entry||{};
    const resolved=window.UFC_PLAY_DATA?.resolve?.(raw.id||raw.name)||window.UFC_PLAY_DATA?.resolve?.(raw.name||raw.id)||null;
    return {
      ...(resolved||{}),...raw,
      id:String(raw.id||resolved?.id||raw.name||`fighter-${index+1}`),
      name:String(raw.name||resolved?.name||raw.id||`Fighter ${index+1}`),
      primaryDivision:raw.primaryDivision||resolved?.primaryDivision||resolved?.divisions?.[0]||'',
      divisions:Array.isArray(raw.divisions)?raw.divisions:(resolved?.divisions||[]),
      thumbUrl:raw.thumbUrl||resolved?.thumbUrl||'',
      profileUrl:raw.profileUrl||raw.photoUrl||resolved?.profileUrl||''
    };
  }
  function normalizeStats(value){
    const rows=Array.isArray(value)?value:[];
    return rows.map(row=>Array.isArray(row)?[String(row[0]||'Resume stat'),String(row[1]??'—')]:[String(row?.label||'Resume stat'),String(row?.value??'—')]).slice(0,8);
  }
  function normalizeRound(raw,index){
    const rankA=Number(raw?.rankA);
    const rankB=Number(raw?.rankB);
    let winnerSide=String(raw?.winnerSide||'').toUpperCase();
    if(winnerSide!=='A'&&winnerSide!=='B')winnerSide=Number.isFinite(rankA)&&Number.isFinite(rankB)&&rankB<rankA?'B':'A';
    return {
      round:index+1,
      fighterA:resolveFighter(raw?.fighterA,index*2),
      fighterB:resolveFighter(raw?.fighterB,index*2+1),
      statsA:normalizeStats(raw?.statsA),
      statsB:normalizeStats(raw?.statsB),
      rankA:Number.isFinite(rankA)?rankA:999,
      rankB:Number.isFinite(rankB)?rankB:999,
      winnerSide,
      gender:raw?.gender==='women'?'women':'men'
    };
  }
  function roundsFromSetup(rawSetup){
    const setup=normalizeJson(rawSetup)||{};
    const rows=Array.isArray(setup.rounds)?setup.rounds:[];
    return rows.map(normalizeRound);
  }
  function normalizedChoices(result){
    const value=normalizeJson(result)||{};
    const rows=Array.isArray(value)?value:Array.isArray(value.choices)?value.choices:Array.isArray(value.picks)?value.picks:[];
    return rows.map(choice=>String(choice||'').trim().toUpperCase()).filter(choice=>choice==='A'||choice==='B').slice(0,TOTAL_ROUNDS);
  }
  function chosenFighter(round,choice){return choice==='A'?round.fighterA:round.fighterB;}
  function correctFor(round,choice){return round.winnerSide===choice;}
  function scoreFor(choices){return choices.reduce((sum,choice,index)=>sum+(correctFor(state.rounds[index],choice)?1:0),0);}
  function boardLabel(round){return round.gender==='women'?"Women's UFC GOAT":"UFC GOAT";}
  function saveProgress(){
    try{sessionStorage.setItem(saveKey(),JSON.stringify({choices:state.choices}));}catch(_error){}
  }
  function restoreProgress(){
    try{
      const saved=JSON.parse(sessionStorage.getItem(saveKey())||'null');
      if(!saved||!Array.isArray(saved.choices))return;
      const choices=saved.choices.map(choice=>String(choice||'').toUpperCase()).filter(choice=>choice==='A'||choice==='B').slice(0,TOTAL_ROUNDS);
      state.choices=choices;
      state.index=choices.length;
    }catch(_error){}
  }
  function resumeRows(round){
    const labels=round.statsA.length?round.statsA:round.statsB;
    if(!labels.length)return '<div class="resume-empty">Resume details were not included in this challenge.</div>';
    return labels.map((row,index)=>`<div class="resume-row"><strong>${esc(round.statsA[index]?.[1]??'—')}</strong><span>${esc(row[0])}</span><strong>${esc(round.statsB[index]?.[1]??'—')}</strong></div>`).join('');
  }
  function renderGame(){
    const round=state.rounds[state.index];
    const score=scoreFor(state.choices);
    host.innerHTML=`
      <section class="challenge-intro"><span>FRIEND CHALLENGE</span><h1>${esc(state.challenge.creator_name)} sent five hidden resume matchups.</h1><p>Pick which UFC-only resume ranks higher. Names stay hidden until your choice locks.</p></section>
      <section class="game-card">
        <header class="game-progress"><div><span>BLIND RESUME</span><strong>ROUND ${state.index+1} OF ${TOTAL_ROUNDS}</strong></div><div class="live-score"><span>SCORE</span><strong>${score}-${state.index-score}</strong></div></header>
        <div class="resume-board">
          <div class="resume-head"><div><span>FIGHTER A</span><b>?</b></div><strong>UFC RESUME</strong><div><span>FIGHTER B</span><b>?</b></div></div>
          <div class="resume-rows">${resumeRows(round)}</div>
          <div class="choice-row"><button type="button" data-choice="A">PICK A</button><button type="button" data-choice="B">PICK B</button></div>
        </div>
      </section>`;
    setStatus(`Round ${state.index+1} loaded. Your pick locks before either name is revealed.`);
  }
  function revealFighter(round,side,choice){
    const fighter=side==='A'?round.fighterA:round.fighterB;
    const rank=side==='A'?round.rankA:round.rankB;
    const picked=choice===side;
    const winner=round.winnerSide===side;
    return `<article class="reveal-fighter ${picked?'picked':''} ${winner?'winner':''}">${visual(fighter,'reveal-photo')}<span>FIGHTER ${side}</span><strong>${esc(fighter.name)}</strong><small>${esc(boardLabel(round))} #${rank}</small><div class="badge-row">${winner?'<em class="winner-badge">MODEL WINNER</em>':''}${picked?'<em class="pick-badge">YOUR PICK</em>':''}</div></article>`;
  }
  function renderReveal(round,choice){
    const correct=correctFor(round,choice);
    const winner=chosenFighter(round,round.winnerSide);
    host.innerHTML=`
      <section class="challenge-intro"><span>PICK LOCKED</span><h1>${correct?'You got it right.':'The model disagrees.'}</h1><p>Both identities are revealed only after your decision is permanent.</p></section>
      <section class="reveal-card">
        <div class="verdict ${correct?'correct':'miss'}"><span>ROUND ${round.round}</span><strong>${esc(winner.name)} ranks higher</strong><small>${correct?'CORRECT PICK':'MISS'} · SCORE ${scoreFor(state.choices)}/${state.choices.length}</small></div>
        <div class="reveal-grid">${revealFighter(round,'A',choice)}${revealFighter(round,'B',choice)}</div>
        <button type="button" class="primary-action" data-next>${state.index>=TOTAL_ROUNDS?'SEE YOUR FINAL SCORE':'NEXT HIDDEN MATCHUP'}</button>
      </section>`;
    setStatus(`Round ${round.round} locked. ${correct?'Correct pick.':'Model disagreement.'}`,correct?'success':'');
  }
  function recapRows(choices,sideClass='responder'){
    return choices.map((choice,index)=>{
      const round=state.rounds[index];
      const fighter=chosenFighter(round,choice);
      return `<article class="recap-row ${sideClass}"><span>R${index+1}</span>${visual(fighter,'recap-photo')}<div><strong>${esc(fighter.name)}</strong><small>Fighter ${choice} · ${correctFor(round,choice)?'CORRECT':'MISS'}</small></div></article>`;
    }).join('');
  }
  function renderFinish(){
    const score=scoreFor(state.choices);
    host.innerHTML=`
      <section class="challenge-intro"><span>CARD COMPLETE</span><h1>You scored ${score}/${TOTAL_ROUNDS}.</h1><p>Sign in with your Picks profile to reveal ${esc(state.challenge.creator_name)}’s choices and compare every round.</p></section>
      <section class="finish-card"><div class="finish-score"><span>YOUR BLIND RESUME SCORE</span><strong>${score}/${TOTAL_ROUNDS}</strong></div><div class="recap-list">${recapRows(state.choices)}</div><button type="button" class="primary-action" data-submit>SUBMIT & COMPARE</button><a class="secondary-action" href="index.html#play">BACK TO ALL GAMES</a></section>`;
    setStatus('All five picks are locked. Submit to compare.','ready');
  }
  function playerScore(name,label,score,className){
    return `<section class="player-score ${className}"><span>${esc(label)}</span><strong>${score}/${TOTAL_ROUNDS}</strong><small>${esc(name||'PLAYER')}</small></section>`;
  }
  function comparisonPick(round,choice,name,label,className){
    const fighter=chosenFighter(round,choice);
    return `<section class="comparison-pick ${className}"><span>${esc(label)}</span><div>${visual(fighter,'comparison-photo')}<div><strong>${esc(fighter.name)}</strong><small>${esc(name||'PLAYER')} · FIGHTER ${choice} · ${correctFor(round,choice)?'CORRECT':'MISS'}</small></div></div></section>`;
  }
  function renderComparison(data){
    const mine=normalizedChoices(data?.responder_result);
    const theirs=normalizedChoices(data?.creator_result);
    if(mine.length!==TOTAL_ROUNDS||theirs.length!==TOTAL_ROUNDS){
      renderFinish();
      setStatus('Your picks saved, but the original card could not be compared.','error');
      return;
    }
    const myScore=scoreFor(mine);
    const theirScore=scoreFor(theirs);
    const matches=mine.filter((choice,index)=>choice===theirs[index]).length;
    const disagreements=TOTAL_ROUNDS-matches;
    host.innerHTML=`
      <section class="challenge-intro"><span>CHALLENGE RESULTS</span><h1>${matches}/5 matching picks.</h1><p>${disagreements?`${disagreements} disagreement${disagreements===1?'':'s'} across the exact same hidden matchups.`:`You matched ${esc(data.creator_name)} on every round.`}</p></section>
      <section class="comparison-card">
        <div class="score-duel">${playerScore(data.responder_name||'PLAYER','RESPONDER',myScore,'responder')}${playerScore(data.creator_name,'CHALLENGER',theirScore,'challenger')}</div>
        <div class="round-comparisons">${state.rounds.map((round,index)=>{
          const disagreement=mine[index]!==theirs[index];
          return `<article class="round-comparison ${disagreement?'disagreement':'match'}"><header><div><span>ROUND ${index+1}</span><strong>${esc(round.fighterA.name)} <em>vs</em> ${esc(round.fighterB.name)}</strong></div><b>${disagreement?'DISAGREEMENT':'MATCH'}</b></header><div class="comparison-picks">${comparisonPick(round,mine[index],data.responder_name,'YOUR PICK','responder')}${comparisonPick(round,theirs[index],data.creator_name,'CHALLENGER PICK','challenger')}</div></article>`;
        }).join('')}</div>
        <a class="primary-action" href="index.html#play">PLAY ANOTHER GAME</a>
      </section>`;
    setStatus(`Comparison complete. ${matches} matches and ${disagreements} disagreements.`,'success');
    try{sessionStorage.removeItem(saveKey());}catch(_error){}
  }
  async function submitAndCompare(){
    if(state.submitting||state.choices.length!==TOTAL_ROUNDS)return;
    state.submitting=true;
    const button=host.querySelector('[data-submit]');
    if(button){button.disabled=true;button.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({title:'Reveal the Blind Resume results',description:'Use your existing Picks group code, display name, and PIN. Your five choices are already locked.'});
      if(!identity){state.submitting=false;if(button){button.disabled=false;button.textContent='SUBMIT & COMPARE';}return;}
      showProfile(identity);
      if(button)button.textContent='SAVING PICKS…';
      const score=scoreFor(state.choices);
      const {data,error}=await client.rpc('play_submit_challenge',{
        p_challenge_code:code,
        p_group_code:identity.groupCode,
        p_member_token:identity.memberToken,
        p_result:{choices:state.choices},
        p_score:score,
        p_metadata:{client:VERSION}
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The challenge picks could not be saved.');
      renderComparison(data);
    }catch(error){
      state.submitting=false;
      if(button){button.disabled=false;button.textContent='TRY SUBMIT AGAIN';}
      setStatus(String(error?.message||'The picks could not be submitted.'),'error');
    }
  }
  function choose(choice){
    if(state.index>=TOTAL_ROUNDS||state.choices.length>=TOTAL_ROUNDS)return;
    const round=state.rounds[state.index];
    state.choices.push(choice);
    state.index=state.choices.length;
    saveProgress();
    renderReveal(round,choice);
  }
  function next(){
    if(state.index>=TOTAL_ROUNDS)renderFinish();
    else renderGame();
  }
  async function load(){
    document.documentElement.setAttribute('data-standalone-blind-resume',VERSION);
    if(!host||!client){setStatus('The challenge page could not connect.','error');return;}
    if(code.length<4){
      setStatus('This challenge link is missing its code.','error');
      host.innerHTML='<section class="error-card"><h1>Challenge link incomplete</h1><p>Ask your friend to send a new Blind Resume link.</p><a href="index.html#play">BACK TO ALL GAMES</a></section>';
      return;
    }
    profile.resolve().then(showProfile).catch(()=>showProfile(null));
    try{
      const {data,error}=await client.rpc('play_get_challenge',{p_challenge_code:code});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge not found.');
      const challenge=data.challenge;
      if(challenge.game_type!=='blind-resume')throw new Error('This page supports Blind Resume challenges only.');
      const rounds=roundsFromSetup(challenge.setup);
      if(rounds.length!==TOTAL_ROUNDS||rounds.some(round=>!round.fighterA?.name||!round.fighterB?.name))throw new Error('This challenge is missing matchup data. Ask your friend to create a new link.');
      state.challenge=challenge;
      state.rounds=rounds;
      restoreProgress();
      if(state.index>=TOTAL_ROUNDS)renderFinish();else renderGame();
    }catch(error){
      setStatus(String(error?.message||'Challenge could not load.'),'error');
      host.innerHTML=`<section class="error-card"><span>CHALLENGE ERROR</span><h1>Could not open this challenge.</h1><p>${esc(error?.message||'The link may have expired.')}</p><a href="index.html#play">BACK TO ALL GAMES</a></section>`;
    }
  }

  document.addEventListener('click',event=>{
    const choice=event.target.closest?.('[data-choice]');
    if(choice)choose(choice.dataset.choice);
    if(event.target.closest?.('[data-next]'))next();
    if(event.target.closest?.('[data-submit]'))submitAndCompare();
    if(event.target.closest?.('#challengeProfile'))profile.modal({title:'Switch or reconnect profile'}).then(identity=>identity&&showProfile(identity));
  });
  load();
})();
