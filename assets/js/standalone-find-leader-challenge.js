(function(){
  'use strict';

  const VERSION='standalone-find-leader-challenge-20260716a-elimination';
  const PERFECT_SCORE=10;
  const pageUrl=new URL(window.location.href);
  const code=String(pageUrl.searchParams.get('code')||pageUrl.searchParams.get('challenge')||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  const host=document.getElementById('challengeApp');
  const statusNode=document.getElementById('challengeStatus');
  const profileNode=document.getElementById('challengeProfile');
  const state={challenge:null,setup:null,eliminationOrder:[],safeIds:[],fatalId:null,score:null,perfect:false,phase:'playing',submitting:false};

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const normalizeJson=value=>{if(typeof value!=='string')return value;try{return JSON.parse(value);}catch(_error){return value;}};
  const saveKey=()=>`ufc-standalone-find-leader:${code}`;

  function setStatus(message,type=''){
    if(!statusNode)return;
    statusNode.textContent=message;
    statusNode.dataset.type=type;
  }
  function showProfile(identity){
    if(!profileNode)return;
    profileNode.innerHTML=identity?`<span>PLAYING AS</span><strong>${esc(identity.member?.display_name||'Player')}</strong>`:'<span>PROFILE</span><strong>SIGN IN AT FINISH</strong>';
  }
  function visual(fighter,className='fighter-photo'){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }
  function fighterMeta(fighter){return fighter?.primaryDivision||fighter?.divisions?.[0]||'UFC fighter';}

  function resolveFighter(entry,index){
    const raw=typeof entry==='string'?{id:entry,name:entry}:entry||{};
    const resolved=window.UFC_PLAY_DATA?.resolve?.(raw.id||raw.name)||window.UFC_PLAY_DATA?.resolve?.(raw.name||raw.id)||null;
    return {
      ...(resolved||{}),...raw,
      id:String(raw.id||resolved?.id||raw.name||`fighter-${index+1}`),
      name:String(raw.name||resolved?.name||raw.id||`Fighter ${index+1}`),
      primaryDivision:String(raw.primaryDivision||resolved?.primaryDivision||resolved?.divisions?.[0]||''),
      divisions:Array.isArray(raw.divisions)?raw.divisions:(resolved?.divisions||[]),
      thumbUrl:String(raw.thumbUrl||resolved?.thumbUrl||''),
      profileUrl:String(raw.profileUrl||resolved?.profileUrl||''),
      value:Number(raw.value)
    };
  }

  function parseSetup(rawSetup){
    const raw=normalizeJson(rawSetup)||{};
    const candidates=(Array.isArray(raw.candidates)?raw.candidates:[]).map(resolveFighter);
    return {
      bankVersion:String(raw.bankVersion||''),gameVersion:String(raw.gameVersion||'find-leader-elimination-v1'),
      questionId:String(raw.questionId||''),question:String(raw.question||'Who is the stat leader?'),context:String(raw.context||''),
      statLabel:String(raw.statLabel||'verified stat'),shortLabel:String(raw.shortLabel||'VALUE'),since:String(raw.since||''),
      candidateCount:Number(raw.candidateCount)||candidates.length,leaderId:String(raw.leaderId||''),leaderValue:Number(raw.leaderValue),
      challengerScore:Math.max(1,Math.min(PERFECT_SCORE,Number(raw.challengerScore)||1)),challengerPerfect:Boolean(raw.challengerPerfect),candidates
    };
  }

  function validateSetup(setup){
    const rows=setup?.candidates||[];
    if(rows.length!==PERFECT_SCORE||setup.candidateCount!==PERFECT_SCORE)return false;
    if(new Set(rows.map(row=>row.id)).size!==PERFECT_SCORE)return false;
    if(!rows.every(row=>row.id&&row.name&&Number.isFinite(row.value)))return false;
    const top=Math.max(...rows.map(row=>row.value));
    const leaders=rows.filter(row=>row.value===top);
    return leaders.length===1&&leaders[0].id===setup.leaderId;
  }

  function normalizeResult(rawResult){
    const raw=normalizeJson(rawResult)||{};
    const order=[...new Set((Array.isArray(raw.eliminationOrder)?raw.eliminationOrder:[]).map(String))].slice(0,9);
    const safe=[...new Set((Array.isArray(raw.safeIds)?raw.safeIds:[]).map(String))].slice(0,9);
    const score=Math.max(1,Math.min(PERFECT_SCORE,Number(raw.score)||1));
    return {score,perfect:Boolean(raw.perfect)||score===PERFECT_SCORE,fatalId:raw.fatalId?String(raw.fatalId):null,eliminationOrder:order,safeIds:safe};
  }

  function result(){return {score:Number(state.score),perfect:Boolean(state.perfect),fatalId:state.fatalId||null,eliminationOrder:[...state.eliminationOrder],safeIds:[...state.safeIds]};}
  function candidates(){return state.setup?.candidates||[];}
  function candidate(id){return candidates().find(row=>row.id===id)||null;}
  function leader(){return candidate(state.setup?.leaderId);}
  function currentRound(){return Math.min(PERFECT_SCORE,state.eliminationOrder.length+1);}
  function valueText(fighter){return `${Number(fighter?.value||0)} ${state.setup?.statLabel||'verified stat'}`;}

  function saveProgress(){
    try{sessionStorage.setItem(saveKey(),JSON.stringify(result()));}catch(_error){}
  }
  function restoreProgress(){
    try{
      const raw=JSON.parse(sessionStorage.getItem(saveKey())||'null');
      if(!raw)return;
      const saved=normalizeResult(raw);
      if(!saved.eliminationOrder.length)return;
      const ids=new Set(candidates().map(row=>row.id));
      state.eliminationOrder=saved.eliminationOrder.filter(id=>ids.has(id));
      state.safeIds=saved.safeIds.filter(id=>ids.has(id)&&id!==state.setup.leaderId);
      state.fatalId=saved.fatalId&&ids.has(saved.fatalId)?saved.fatalId:null;
      state.score=saved.score;
      state.perfect=saved.perfect;
      if(state.fatalId||state.perfect||state.safeIds.length===9)state.phase='complete';
    }catch(_error){}
  }

  function card(fighter,index){
    const order=state.eliminationOrder.indexOf(fighter.id);
    const fatal=state.fatalId===fighter.id;
    const safe=state.safeIds.includes(fighter.id);
    const leaderStanding=state.phase==='complete'&&state.perfect&&fighter.id===state.setup.leaderId;
    const status=fatal?'fatal':safe?'safe':leaderStanding?'leader':'active';
    const disabled=state.phase!=='playing'||safe||fatal;
    let label='ELIMINATE';
    if(safe)label=`SAFE · ${fighter.value}`;
    if(fatal)label=`LEADER · ${fighter.value}`;
    if(leaderStanding)label=`LEADER · ${fighter.value}`;
    return `<button type="button" class="elimination-tile ${status}" data-pick="${esc(fighter.id)}" ${disabled?'disabled':''}>${visual(fighter)}<span class="tile-number">${index+1}</span><span class="fighter-copy"><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></span><em>${esc(label)}</em>${order>=0?`<b>R${order+1}</b>`:''}</button>`;
  }

  function renderGame(){
    state.phase='playing';
    host.innerHTML=`
      <section class="challenge-intro"><span>FRIEND CHALLENGE</span><h1>${esc(state.challenge.creator_name)} reached ${state.setup.challengerScore}/10.</h1><p>${esc(state.setup.question)} Eliminate one fighter who is not the leader. The challenger’s path stays hidden until you finish.</p></section>
      <section class="game-card">
        <header><div><span>FIND THE LEADER</span><strong>ROUND ${currentRound()}</strong></div><b>${state.safeIds.length}/9 SAFE</b></header>
        <p class="question-context">${esc(state.setup.context)}</p>
        <div class="elimination-grid">${candidates().map(card).join('')}</div>
      </section>`;
    setStatus(`${state.challenge.creator_name}'s elimination order is hidden. Round ${currentRound()} is ready.`,'ready');
  }

  function finish({perfect,fatalId=null,score}){
    state.perfect=Boolean(perfect);
    state.fatalId=fatalId;
    state.score=Number(score);
    state.phase='complete';
    saveProgress();
    renderFinish();
  }

  function eliminate(id){
    if(state.phase!=='playing'||state.eliminationOrder.includes(id))return;
    const fighter=candidate(id);
    if(!fighter)return;
    const round=currentRound();
    state.eliminationOrder.push(id);
    if(id===state.setup.leaderId){finish({perfect:false,fatalId:id,score:round});return;}
    state.safeIds.push(id);
    saveProgress();
    if(state.safeIds.length===9){finish({perfect:true,score:PERFECT_SCORE});return;}
    renderGame();
  }

  function revealRows(){
    return [...candidates()].sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name)).map((fighter,index)=>{
      const fatal=state.fatalId===fighter.id;
      const standing=state.perfect&&fighter.id===state.setup.leaderId;
      const safe=state.safeIds.includes(fighter.id);
      const status=fatal?'fatal':standing?'leader':safe?'safe':'active';
      const order=state.eliminationOrder.indexOf(fighter.id);
      return `<article class="reveal-row ${status}">${visual(fighter,'reveal-photo')}<b>#${index+1}</b><span><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></span><em>${fighter.value}<small>${esc(state.setup.shortLabel)}</small></em><i>${fatal?'FATAL PICK':standing?'LEFT STANDING':safe?'SAFE':''}${order>=0?` · R${order+1}`:''}</i></article>`;
    }).join('');
  }

  function renderFinish(){
    const headline=state.perfect?'PERFECT 10':`ROUND ${state.score}`;
    const copy=state.perfect?`You left ${leader()?.name} standing.`:`You eliminated the leader, ${leader()?.name}, on Round ${state.score}.`;
    host.innerHTML=`
      <section class="challenge-intro"><span>RUN COMPLETE</span><h1>${headline}</h1><p>${esc(copy)} Sign in only when you are ready to reveal ${esc(state.challenge.creator_name)}’s run.</p></section>
      <section class="finish-card"><div class="leader-spotlight">${visual(leader(),'leader-photo')}<div><span>STAT LEADER</span><strong>${esc(leader()?.name)}</strong><small>${esc(valueText(leader()))}</small></div></div><div class="reveal-list">${revealRows()}</div><button type="button" class="primary-action" data-submit>SUBMIT & COMPARE</button><button type="button" class="secondary-action" data-replay>REPLAY THIS BOARD</button><a class="secondary-action link-action" href="index.html#play">BACK TO ALL GAMES</a></section>`;
    setStatus(`Your score is ${state.score}/10. Submit to reveal the challenge result.`,'ready');
  }

  function fighterName(id){return candidate(id)?.name||'—';}
  function orderCell(playerResult,index,className){
    const id=playerResult.eliminationOrder[index];
    if(!id)return `<span class="order-cell ${className} empty">—</span>`;
    const fatal=id===playerResult.fatalId;
    return `<span class="order-cell ${className} ${fatal?'fatal':'safe'}"><b>R${index+1}</b>${esc(fighterName(id))}<small>${fatal?'FATAL':'SAFE'}</small></span>`;
  }

  function renderComparison(data){
    const mine=normalizeResult(data?.responder_result);
    const theirs=normalizeResult(data?.creator_result);
    const myScore=mine.score;
    const theirScore=theirs.score;
    const winner=myScore===theirScore?'TIE — NO SPEED TIEBREAKER':myScore>theirScore?`${data.responder_name||'YOU'} WON`:`${data.creator_name} WON`;
    const maxRounds=Math.max(mine.eliminationOrder.length,theirs.eliminationOrder.length,1);
    let divergence=-1;
    for(let index=0;index<maxRounds;index+=1){if(mine.eliminationOrder[index]!==theirs.eliminationOrder[index]){divergence=index;break;}}
    const sharedSafe=mine.safeIds.filter(id=>theirs.safeIds.includes(id));

    window.UFC_STANDALONE_REMATCH_CONTEXT={
      gameType:'find-leader',gameVersion:state.challenge?.game_version||'find-leader-elimination-v1',page:'find-leader-challenge.html',originalCode:code,
      setup:normalizeJson(state.challenge?.setup)||{},result:mine,metadata:{comparison:'find-leader-elimination'}
    };

    host.innerHTML=`
      <section class="challenge-intro"><span>CHALLENGE RESULTS</span><h1>${esc(winner)}</h1><p>${myScore===theirScore?`Both runs ended on Round ${myScore}. The tie stands.`:`Higher round wins. ${Math.abs(myScore-theirScore)} round${Math.abs(myScore-theirScore)===1?'':'s'} separated the runs.`}</p></section>
      <section class="comparison-card">
        <div class="score-duel"><section class="player-score responder"><span>YOUR SCORE</span><strong>${myScore}</strong><small>${esc(data.responder_name||'PLAYER')}</small></section><div><b>VS</b><span>NO SPEED TIEBREAKER</span></div><section class="player-score challenger"><span>CHALLENGER SCORE</span><strong>${theirScore}</strong><small>${esc(data.creator_name)}</small></section></div>
        <section class="comparison-summary"><div><span>SHARED SAFE ELIMINATIONS</span><strong>${sharedSafe.length}</strong></div><div><span>FIRST DIFFERENT ROUND</span><strong>${divergence<0?'NONE':divergence+1}</strong></div><div><span>STAT LEADER</span><strong>${esc(leader()?.name)}</strong></div></section>
        <section class="order-comparison"><header><span>ELIMINATION ORDER</span><strong>Where the runs split</strong></header>${Array.from({length:maxRounds},(_,index)=>`<div class="order-round"><b>R${index+1}</b>${orderCell(mine,index,'responder')}${orderCell(theirs,index,'challenger')}</div>`).join('')}</section>
        <section class="fatal-comparison"><article class="responder"><span>YOUR FATAL PICK</span><strong>${mine.perfect?'NONE — PERFECT':esc(fighterName(mine.fatalId))}</strong></article><article class="challenger"><span>${esc(String(data.creator_name||'CHALLENGER').toUpperCase())}'S FATAL PICK</span><strong>${theirs.perfect?'NONE — PERFECT':esc(fighterName(theirs.fatalId))}</strong></article></section>
        <section class="all-values"><header><span>FULL STAT REVEAL</span><strong>${esc(state.setup.question)}</strong></header><div>${revealRows()}</div></section>
        <button type="button" class="primary-action" data-challenge-back>CHALLENGE BACK</button><a class="secondary-action link-action" href="index.html#play">PLAY A NEW GAME</a>
      </section>`;
    setStatus(`Comparison complete. ${winner}.`,'success');
    try{sessionStorage.removeItem(saveKey());}catch(_error){}
  }

  async function submitAndCompare(){
    if(state.submitting||state.phase!=='complete')return;
    state.submitting=true;
    const button=host.querySelector('[data-submit]');
    if(button){button.disabled=true;button.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({title:'Reveal the Find the Leader results',description:'Use your existing Picks profile. Your elimination run is already locked.'});
      if(!identity){state.submitting=false;if(button){button.disabled=false;button.textContent='SUBMIT & COMPARE';}return;}
      showProfile(identity);
      if(button)button.textContent='SAVING SCORE…';
      const completed=result();
      const {data,error}=await client.rpc('play_submit_challenge',{
        p_challenge_code:code,p_group_code:identity.groupCode,p_member_token:identity.memberToken,p_result:completed,p_score:completed.score,p_metadata:{client:VERSION}
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The elimination run could not be saved.');
      renderComparison(data);
    }catch(error){state.submitting=false;if(button){button.disabled=false;button.textContent='TRY SUBMIT AGAIN';}setStatus(String(error?.message||'The score could not be submitted.'),'error');}
  }

  async function load(){
    document.documentElement.setAttribute('data-standalone-find-leader',VERSION);
    if(!host||!client){setStatus('The challenge page could not connect.','error');return;}
    if(code.length<4){setStatus('This challenge link is missing its code.','error');host.innerHTML='<section class="error-card"><h1>Challenge link incomplete</h1><p>Ask your friend to send a new Find the Leader link.</p><a href="index.html#play">BACK TO ALL GAMES</a></section>';return;}
    profile.resolve().then(showProfile).catch(()=>showProfile(null));
    try{
      const {data,error}=await client.rpc('play_get_challenge',{p_challenge_code:code});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge not found.');
      const challenge=data.challenge;
      if(challenge.game_type!=='find-leader')throw new Error('This page supports Find the Leader challenges only.');
      const setup=parseSetup(challenge.setup);
      if(!validateSetup(setup))throw new Error('This challenge is missing a valid ten-fighter elimination board. Ask your friend to create a new link.');
      state.challenge=challenge;state.setup=setup;state.phase='playing';
      restoreProgress();
      if(state.phase==='complete')renderFinish();else renderGame();
    }catch(error){setStatus(String(error?.message||'Challenge could not load.'),'error');host.innerHTML=`<section class="error-card"><span>CHALLENGE ERROR</span><h1>Could not open this challenge.</h1><p>${esc(error?.message||'The link may have expired.')}</p><a href="index.html#play">BACK TO ALL GAMES</a></section>`;}
  }

  document.addEventListener('click',event=>{
    const pick=event.target.closest?.('[data-pick]');
    if(pick){eliminate(pick.dataset.pick);return;}
    if(event.target.closest?.('[data-submit]')){submitAndCompare();return;}
    if(event.target.closest?.('[data-replay]')){state.eliminationOrder=[];state.safeIds=[];state.fatalId=null;state.score=null;state.perfect=false;state.phase='playing';saveProgress();renderGame();return;}
    if(event.target.closest?.('#challengeProfile'))profile.modal({title:'Switch or reconnect profile'}).then(identity=>identity&&showProfile(identity));
  });

  load();
})();
