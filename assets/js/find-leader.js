(function(){
  'use strict';

  const VERSION='find-leader-20260718a-phase-2e-shared-results';
  const DAILY_VERSION='find-leader-daily-v1';
  const PERFECT_SCORE=10;
  const shell=document.querySelector('#play .play-shell');
  if(!shell)return;

  const state={setup:null,eliminationOrder:[],safeIds:[],fatalId:null,score:null,perfect:false,feedback:'',phase:'loading',daily:false,dailyContext:null};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

  const panel=document.createElement('section');
  panel.id='playFindLeaderPanel';
  panel.className='find-leader-panel play-panel';
  panel.hidden=true;
  shell.appendChild(panel);

  function hashSeed(value){
    let hash=2166136261;
    for(let index=0;index<String(value).length;index+=1){hash^=String(value).charCodeAt(index);hash=Math.imul(hash,16777619);}
    return hash>>>0;
  }

  function mulberry32(seed){
    let value=seed>>>0;
    return function(){
      value+=0x6D2B79F5;
      let next=value;
      next=Math.imul(next^(next>>>15),next|1);
      next^=next+Math.imul(next^(next>>>7),next|61);
      return((next^(next>>>14))>>>0)/4294967296;
    };
  }

  function candidates(){return Array.isArray(state.setup?.candidates)?state.setup.candidates:[];}
  function candidate(id){return candidates().find(row=>row.id===id)||null;}
  function leader(){return candidate(state.setup?.leaderId);}
  function currentRound(){return Math.min(PERFECT_SCORE,state.eliminationOrder.length+1);}
  function remaining(){const eliminated=new Set(state.eliminationOrder);return candidates().filter(row=>!eliminated.has(row.id));}
  function valueText(fighter){return `${Number(fighter?.value||0)} ${state.setup?.statLabel||'verified stat'}`;}
  function fighterMeta(fighter){return fighter?.primaryDivision||fighter?.divisions?.[0]||'UFC fighter';}

  function visual(fighter,className='find-leader-photo'){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }

  function validateSetup(setup){
    const rows=Array.isArray(setup?.candidates)?setup.candidates:[];
    if(rows.length!==PERFECT_SCORE)return false;
    if(new Set(rows.map(row=>row?.id)).size!==PERFECT_SCORE)return false;
    if(!rows.every(row=>row?.id&&row?.name&&Number.isFinite(Number(row.value))))return false;
    const top=Math.max(...rows.map(row=>Number(row.value)));
    const leaders=rows.filter(row=>Number(row.value)===top);
    return leaders.length===1&&leaders[0].id===setup.leaderId;
  }

  function result(){
    if(state.phase!=='complete'||!Number.isFinite(Number(state.score)))return null;
    return {
      score:Number(state.score),
      perfect:Boolean(state.perfect),
      eliminationOrder:[...state.eliminationOrder],
      safeIds:[...state.safeIds],
      fatalId:state.fatalId||null,
      questionId:String(state.setup?.questionId||''),
      leaderId:String(state.setup?.leaderId||''),
      candidateIds:candidates().map(row=>row.id)
    };
  }

  function exportChallenge(){
    const completed=result();
    if(!completed||!validateSetup(state.setup))return null;
    const setup=clone(state.setup);
    setup.challengerScore=completed.score;
    setup.challengerPerfect=completed.perfect;
    return {setup,result:completed};
  }

  function compactCandidate(row){
    return {
      id:String(row?.id||''),
      name:String(row?.name||''),
      value:Number(row?.value),
      primaryDivision:row?.primaryDivision||row?.divisions?.[0]||'',
      thumbUrl:row?.thumbUrl||''
    };
  }

  function sharePayload(){
    const completed=result();
    if(!completed||!validateSetup(state.setup))return null;
    const setup={
      questionId:String(state.setup.questionId||''),
      question:String(state.setup.question||''),
      context:String(state.setup.context||''),
      statLabel:String(state.setup.statLabel||''),
      shortLabel:String(state.setup.shortLabel||''),
      leaderId:String(state.setup.leaderId||''),
      candidateCount:PERFECT_SCORE,
      candidates:candidates().map(compactCandidate)
    };
    return {setup,result:{score:completed.score,perfect:completed.perfect,eliminationOrder:[...completed.eliminationOrder]}};
  }

  function openSharedResult(payload={}){
    const setup=clone(payload?.setup);
    const completed=payload?.result||{};
    if(!validateSetup(setup))return false;
    const ids=new Set(setup.candidates.map(row=>row.id));
    const order=[];
    (Array.isArray(completed.eliminationOrder)?completed.eliminationOrder:[]).forEach(id=>{if(ids.has(id)&&!order.includes(id))order.push(id);});
    const leaderIndex=order.indexOf(setup.leaderId);
    const perfect=Boolean(completed.perfect)&&leaderIndex===-1&&order.length===PERFECT_SCORE-1;
    if(!perfect&&leaderIndex<0)return false;
    const safe=perfect?order:order.slice(0,leaderIndex);
    if(safe.some(id=>id===setup.leaderId)||safe.length>(PERFECT_SCORE-1))return false;
    const score=perfect?PERFECT_SCORE:leaderIndex+1;
    state.setup=setup;
    state.eliminationOrder=perfect?order:[...safe,setup.leaderId];
    state.safeIds=safe;
    state.fatalId=perfect?null:setup.leaderId;
    state.score=score;
    state.perfect=perfect;
    state.feedback='';
    state.phase='complete';
    state.daily=Boolean(payload.daily);
    state.dailyContext=payload.dailyContext?clone(payload.dailyContext):null;
    panel.hidden=false;
    renderFinish();
    return true;
  }

  function dailySetup(context){
    const seed=String(context?.seed||context?.challenge_key||`find-leader|${context?.challenge_day||''}|${DAILY_VERSION}`);
    return window.UFC_FIND_LEADER_QUESTION_BANK?.random?.(mulberry32(hashSeed(seed)))||null;
  }

  function normalizeStartOptions(input){
    if(typeof input==='string')return {questionId:input};
    return input&&typeof input==='object'?input:{};
  }

  function startGame(input={}){
    const options=normalizeStartOptions(input);
    const bank=window.UFC_FIND_LEADER_QUESTION_BANK;
    let setup=null;
    if(validateSetup(options.setup))setup=clone(options.setup);
    else if(options.daily&&options.context)setup=dailySetup(options.context);
    else setup=options.questionId?bank?.create?.(options.questionId):bank?.random?.();
    if(!validateSetup(setup)){
      state.phase='loading';
      state.setup=null;
      renderLoading();
      return false;
    }
    state.setup=setup;
    state.eliminationOrder=[];
    state.safeIds=[];
    state.fatalId=null;
    state.score=null;
    state.perfect=false;
    state.feedback='';
    state.phase='playing';
    state.daily=Boolean(options.daily);
    state.dailyContext=options.context?clone(options.context):null;
    renderGame();
    return true;
  }

  function statusFor(fighter){
    if(state.fatalId===fighter.id)return 'fatal';
    if(state.safeIds.includes(fighter.id))return 'safe';
    if(state.phase==='complete'&&fighter.id===state.setup?.leaderId)return 'leader';
    return 'active';
  }

  function card(fighter,index){
    const status=statusFor(fighter);
    const eliminated=status==='safe'||status==='fatal';
    const disabled=state.phase!=='playing'||eliminated;
    const roundIndex=state.eliminationOrder.indexOf(fighter.id);
    let label='ELIMINATE';
    if(status==='safe')label=`SAFE · ${Number(fighter.value)}`;
    if(status==='fatal')label=`LEADER · ${Number(fighter.value)}`;
    if(status==='leader')label=`LEADER · ${Number(fighter.value)}`;
    return `<button type="button" class="find-leader-tile ${status}" data-find-leader-pick="${esc(fighter.id)}" ${disabled?'disabled':''} aria-label="${esc(fighter.name)}">
      <span class="find-leader-card-number">${index+1}</span>
      ${visual(fighter)}
      <span class="find-leader-name"><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></span>
      <em>${esc(label)}</em>
      ${roundIndex>=0?`<b class="find-leader-elimination-round">R${roundIndex+1}</b>`:''}
    </button>`;
  }

  function renderGame(){
    const round=currentRound();
    panel.innerHTML=`
      <section class="find-leader-hero">
        <div><span>${state.daily?"TODAY'S CHALLENGE":'ELIMINATION GAME'}</span><h2>${esc(state.setup.question)}</h2><p>${esc(state.setup.context)} Eliminate one fighter who is <strong>not</strong> the leader. Pick the leader and your run ends.</p></div>
        <aside><span>CURRENT ROUND</span><strong>${round}</strong><small>${remaining().length} fighters standing</small></aside>
      </section>
      <section class="find-leader-pressure">
        <div><span>YOUR MISSION</span><strong>Leave the leader standing</strong></div>
        <b>${state.safeIds.length}/9 SAFE</b>
      </section>
      <p class="find-leader-feedback${state.feedback?' active':''}">${esc(state.feedback||'All values are hidden. Tap one fighter to eliminate them.')}</p>
      <section class="find-leader-grid">${candidates().map(card).join('')}</section>`;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function finish({perfect,fatalId=null,score}){
    state.perfect=Boolean(perfect);
    state.fatalId=fatalId;
    state.score=Number(score);
    state.phase='complete';
    renderFinish();
    window.dispatchEvent(new CustomEvent('ufc-play-game-complete',{detail:{gameType:'find-leader',daily:state.daily,score:state.score,maxScore:PERFECT_SCORE,result:result()}}));
  }

  function eliminate(id){
    if(state.phase!=='playing'||state.eliminationOrder.includes(id))return;
    const fighter=candidate(id);
    if(!fighter)return;
    const round=currentRound();
    state.eliminationOrder.push(id);
    if(id===state.setup.leaderId){finish({perfect:false,fatalId:id,score:round});return;}
    state.safeIds.push(id);
    state.feedback=`Safe elimination: ${fighter.name} had ${valueText(fighter)}.`;
    if(state.safeIds.length===9){finish({perfect:true,score:PERFECT_SCORE});return;}
    renderGame();
  }

  function resultHeadline(){
    if(state.perfect)return {eyebrow:'PERFECT RUN',title:'PERFECT 10',copy:`You eliminated all nine non-leaders and left ${leader()?.name||'the leader'} standing.`};
    return {eyebrow:'RUN ENDED',title:`ROUND ${state.score}`,copy:`You eliminated the leader, ${leader()?.name||'the leader'}, on Round ${state.score}. That is your challenge score.`};
  }

  function revealCard(fighter,index){
    const status=statusFor(fighter);
    const order=state.eliminationOrder.indexOf(fighter.id);
    const badge=status==='leader'?'LEFT STANDING':status==='fatal'?'FATAL PICK':status==='safe'?'SAFE ELIMINATION':'NOT PICKED';
    return `<article class="find-leader-reveal-tile ${status}">${visual(fighter,'find-leader-reveal-photo')}<span><b>#${index+1}</b><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></span><em>${Number(fighter.value)}<small>${esc(state.setup.shortLabel||'VALUE')}</small></em><i>${esc(badge)}${order>=0?` · R${order+1}`:''}</i></article>`;
  }

  function renderFinish(){
    const headline=resultHeadline();
    const sorted=[...candidates()].sort((a,b)=>Number(b.value)-Number(a.value)||a.name.localeCompare(b.name));
    panel.innerHTML=`
      <section class="find-leader-result-hero ${state.perfect?'perfect':'failed'}">
        <div><span>${headline.eyebrow}</span><strong>${headline.title}</strong><p>${esc(headline.copy)}</p></div>
        <article>${visual(leader(),'find-leader-result-photo')}<div><span>STAT LEADER</span><strong>${esc(leader()?.name||'—')}</strong><small>${esc(valueText(leader()))}</small></div></article>
      </section>
      <section class="find-leader-results">
        <header><div><span>FULL STAT REVEAL</span><strong>${esc(state.setup.question)}</strong></div><b>${state.score}/10</b></header>
        <div class="find-leader-reveal-grid">${sorted.map(revealCard).join('')}</div>
        <div class="find-leader-actions"><button type="button" class="find-leader-primary" data-find-leader-share-result>SHARE RESULT</button><button type="button" class="find-leader-secondary" data-find-leader-challenge>CHALLENGE A FRIEND</button><button type="button" class="find-leader-secondary" data-find-leader-replay>${state.daily?'REPLAY TODAY\'S BOARD':'PLAY AGAIN'}</button><button type="button" class="find-leader-secondary" data-find-leader-home>ALL GAMES</button></div>
      </section>`;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderLoading(){
    panel.innerHTML='<section class="find-leader-loading"><span>VERIFYING QUESTION BANK</span><h2>Building the elimination board…</h2><p>The game will only open when a ten-fighter question has one verified leader in the complete UFC fight ledger.</p></section>';
  }

  function open(options={}){
    shell.querySelectorAll('.play-panel').forEach(node=>{if(node!==panel)node.hidden=true;});
    panel.hidden=false;
    startGame(options);
  }
  function close(){panel.hidden=true;}

  function replay(){
    if(state.daily){
      window.UFC_PLAY_SHARED?.markDailyReplay?.('find-leader');
      startGame({daily:true,setup:clone(state.setup),context:clone(state.dailyContext)});
      return;
    }
    startGame();
  }

  function shareResult(){
    const payload=sharePayload();
    if(!payload)return false;
    if(window.UFC_SHARE_LINKS?.shareFindLeader){window.UFC_SHARE_LINKS.shareFindLeader(payload);return true;}
    return false;
  }

  function installDailyAdapter(){
    const shared=window.UFC_PLAY_SHARED;
    if(!shared?.registerAdapter)return false;
    const existing=shared.adapterFor?.('find-leader');
    if(existing?.daily?.version===DAILY_VERSION)return true;
    shared.registerAdapter({
      id:'find-leader',version:'find-leader-elimination-v1',title:'Find the Leader',
      isComplete:()=>state.phase==='complete',
      exportResult:()=>result(),
      daily:{
        version:DAILY_VERSION,maxScore:PERFECT_SCORE,
        isActive:()=>state.daily&&document.documentElement.getAttribute('data-play-screen')==='daily-find-leader',
        exportResult:()=>result(),score:()=>Number(state.score),
        resultHost:()=>panel,resultAnchor:()=>panel.querySelector('.find-leader-result-hero')
      }
    });
    return true;
  }

  panel.addEventListener('click',event=>{
    const pick=event.target.closest?.('[data-find-leader-pick]');
    if(pick){eliminate(pick.dataset.findLeaderPick);return;}
    if(event.target.closest?.('[data-find-leader-share-result]')){shareResult();return;}
    if(event.target.closest?.('[data-find-leader-replay]')){replay();return;}
    if(event.target.closest?.('[data-find-leader-home]'))window.UFC_PLAY_HUB?.showHub?.();
  });

  const refreshIfWaiting=()=>{if(!panel.hidden&&state.phase==='loading')startGame(state.daily?{daily:true,context:state.dailyContext}:{});};
  window.addEventListener('ufc-scoring-pipeline-ready',refreshIfWaiting);
  window.addEventListener('ufc-production-ranking-ready',refreshIfWaiting);
  window.addEventListener('ufc-play-shared-ready',installDailyAdapter);
  installDailyAdapter();
  window.UFC_FIND_LEADER={version:VERSION,dailyVersion:DAILY_VERSION,open,close,startGame,dailySetup,exportChallenge,sharePayload,openSharedResult,get state(){return state;}};
  document.documentElement.setAttribute('data-find-leader',VERSION);
})();
