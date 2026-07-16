(function(){
  'use strict';

  const VERSION='find-leader-20260716b-elimination-challenge';
  const PERFECT_SCORE=10;
  const shell=document.querySelector('#play .play-shell');
  if(!shell)return;

  const state={setup:null,eliminationOrder:[],safeIds:[],fatalId:null,score:null,perfect:false,feedback:'',phase:'loading'};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();

  const panel=document.createElement('section');
  panel.id='playFindLeaderPanel';
  panel.className='find-leader-panel play-panel';
  panel.hidden=true;
  shell.appendChild(panel);

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
      fatalId:state.fatalId||null
    };
  }

  function exportChallenge(){
    const completed=result();
    if(!completed||!validateSetup(state.setup))return null;
    const setup=JSON.parse(JSON.stringify(state.setup));
    setup.challengerScore=completed.score;
    setup.challengerPerfect=completed.perfect;
    return {setup,result:completed};
  }

  function startGame(questionId=''){
    const bank=window.UFC_FIND_LEADER_QUESTION_BANK;
    const setup=questionId?bank?.create?.(questionId):bank?.random?.();
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
        <div><span>ELIMINATION GAME</span><h2>${esc(state.setup.question)}</h2><p>${esc(state.setup.context)} Eliminate one fighter who is <strong>not</strong> the leader. Pick the leader and your run ends.</p></div>
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
  }

  function eliminate(id){
    if(state.phase!=='playing'||state.eliminationOrder.includes(id))return;
    const fighter=candidate(id);
    if(!fighter)return;
    const round=currentRound();
    state.eliminationOrder.push(id);
    if(id===state.setup.leaderId){
      finish({perfect:false,fatalId:id,score:round});
      return;
    }
    state.safeIds.push(id);
    state.feedback=`Safe elimination: ${fighter.name} had ${valueText(fighter)}.`;
    if(state.safeIds.length===9){
      finish({perfect:true,score:PERFECT_SCORE});
      return;
    }
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
        <div class="find-leader-actions"><button type="button" class="find-leader-primary" data-find-leader-challenge>CHALLENGE A FRIEND</button><button type="button" class="find-leader-secondary" data-find-leader-replay>PLAY AGAIN</button><button type="button" class="find-leader-secondary" data-find-leader-home>ALL GAMES</button></div>
      </section>`;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderLoading(){
    panel.innerHTML='<section class="find-leader-loading"><span>VERIFYING QUESTION BANK</span><h2>Building the elimination board…</h2><p>The game will only open when a ten-fighter question has one verified leader in the complete UFC fight ledger.</p></section>';
  }

  function open(){
    shell.querySelectorAll('.play-panel').forEach(node=>{if(node!==panel)node.hidden=true;});
    panel.hidden=false;
    startGame();
  }
  function close(){panel.hidden=true;}

  panel.addEventListener('click',event=>{
    const pick=event.target.closest?.('[data-find-leader-pick]');
    if(pick){eliminate(pick.dataset.findLeaderPick);return;}
    if(event.target.closest?.('[data-find-leader-replay]')){startGame();return;}
    if(event.target.closest?.('[data-find-leader-home]'))window.UFC_PLAY_HUB?.showHub?.();
  });

  const refreshIfWaiting=()=>{if(!panel.hidden&&state.phase==='loading')startGame();};
  window.addEventListener('ufc-scoring-pipeline-ready',refreshIfWaiting);
  window.addEventListener('ufc-production-ranking-ready',refreshIfWaiting);
  window.UFC_FIND_LEADER={version:VERSION,open,close,startGame,exportChallenge,get state(){return state;}};
  document.documentElement.setAttribute('data-find-leader',VERSION);
})();
