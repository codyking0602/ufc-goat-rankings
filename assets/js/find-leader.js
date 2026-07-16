(function(){
  'use strict';

  const VERSION='find-leader-20260716a-local-audited-stats';
  const ROUND_MAX=100;
  const WRONG_COST=10;
  const ROUND_MIN=10;
  const ROUND_LIMIT=5;
  const shell=document.querySelector('#play .play-shell');
  if(!shell)return;

  const STAT_DEFINITIONS=[
    {id:'title-fight-wins',field:'titleFightWins',label:'UFC TITLE-FIGHT WINS',prompt:'Who has the most UFC title-fight wins?',context:'Official UFC title-fight victories only.',format:value=>String(Math.round(value))},
    {id:'top-five-wins',field:'topFiveWins',label:'TOP-5 WINS',prompt:'Who has the most Top-5 wins?',context:'Uses the app’s verified UFC-only Top-5 win ledger.',format:value=>String(Math.round(value))},
    {id:'finish-rate',field:'finishRatePct',label:'FINISH PERCENTAGE',prompt:'Who has the highest UFC finish percentage?',context:'Percentage of UFC wins earned by finish.',format:value=>`${Number(value).toFixed(1)}%`},
    {id:'rounds-won',field:'roundsWonPct',label:'ROUNDS-WON PERCENTAGE',prompt:'Who has the highest rounds-won percentage?',context:'Uses the verified rounds-won percentage in the live model.',format:value=>`${Number(value).toFixed(1)}%`},
    {id:'elite-years',field:'activeEliteYears',label:'ACTIVE ELITE YEARS',prompt:'Who has the most active elite years?',context:'Only connected UFC elite years count.',format:value=>`${Number(value).toFixed(1)} yrs`}
  ];

  const state={roster:[],stats:[],rounds:[],roundIndex:0,totalScore:0,history:[],wrong:new Set(),query:'',feedback:'',phase:'loading'};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normal=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const round2=value=>Math.round((Number(value)+Number.EPSILON)*100)/100;

  const panel=document.createElement('section');
  panel.id='playFindLeaderPanel';
  panel.className='find-leader-panel play-panel';
  panel.hidden=true;
  shell.appendChild(panel);

  function visual(fighter,className='find-leader-photo'){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }

  function sourceRow(name){
    const projection=window.UFC_CALCULATED_RANKING_PROJECTION?.entryFor?.(name);
    if(projection)return projection;
    const data=window.RANKING_DATA||{};
    const target=normal(name);
    return [...(data.men||[]),...(data.women||[]),...(data.fighters||[])].find(row=>normal(row?.fighter)===target)||null;
  }

  function buildRoster(){
    const data=window.UFC_PLAY_DATA;
    data?.rebuild?.();
    const fighters=(data?.modelRanked||[]).filter(fighter=>fighter?.id&&fighter?.name);
    if(fighters.length<60)return false;
    state.roster=fighters.map(fighter=>({
      id:String(fighter.id),name:String(fighter.name),gender:fighter.gender==='women'?'women':'men',
      primaryDivision:String(fighter.primaryDivision||fighter.divisions?.[0]||''),divisions:Array.isArray(fighter.divisions)?fighter.divisions:[],
      thumbUrl:String(fighter.thumbUrl||''),profileUrl:String(fighter.profileUrl||''),stats:sourceRow(fighter.name)||{}
    })).sort((a,b)=>a.name.localeCompare(b.name));
    state.stats=STAT_DEFINITIONS.filter(definition=>{
      const values=state.roster.map(fighter=>Number(fighter.stats?.[definition.field]));
      return values.every(Number.isFinite)&&new Set(values.map(round2)).size>1&&Math.max(...values)>0;
    });
    return state.stats.length>=3;
  }

  function shuffle(values){
    const rows=[...values];
    for(let index=rows.length-1;index>0;index-=1){
      const next=Math.floor(Math.random()*(index+1));
      [rows[index],rows[next]]=[rows[next],rows[index]];
    }
    return rows;
  }

  function startGame(){
    if(!buildRoster()){
      state.phase='loading';
      renderLoading();
      return false;
    }
    state.rounds=shuffle(state.stats).slice(0,ROUND_LIMIT);
    state.roundIndex=0;
    state.totalScore=0;
    state.history=[];
    state.wrong=new Set();
    state.query='';
    state.feedback='';
    state.phase='round';
    renderRound();
    return true;
  }

  function currentStat(){return state.rounds[state.roundIndex]||null;}
  function valueFor(fighter,definition=currentStat()){return Number(fighter?.stats?.[definition?.field]);}
  function leaderValue(definition=currentStat()){return Math.max(...state.roster.map(fighter=>valueFor(fighter,definition)));}
  function leaders(definition=currentStat()){
    const top=leaderValue(definition);
    return state.roster.filter(fighter=>Math.abs(valueFor(fighter,definition)-top)<0.005);
  }
  function topFive(definition=currentStat()){
    return [...state.roster].sort((a,b)=>valueFor(b,definition)-valueFor(a,definition)||a.name.localeCompare(b.name)).slice(0,5);
  }
  function roundScore(){return Math.max(ROUND_MIN,ROUND_MAX-(state.wrong.size*WRONG_COST));}
  function maxScore(){return state.rounds.length*ROUND_MAX;}
  function fighterMeta(fighter){return fighter.primaryDivision||fighter.divisions?.[0]||'UFC fighter';}

  function filteredRoster(){
    const query=normal(state.query);
    return state.roster.filter(fighter=>!query||normal([fighter.name,fighterMeta(fighter)].join(' ')).includes(query));
  }

  function fighterCard(fighter){
    const definition=currentStat();
    const wrong=state.wrong.has(fighter.id);
    return `<button type="button" class="find-leader-fighter${wrong?' is-wrong':''}" data-find-leader-pick="${esc(fighter.id)}" ${wrong?'disabled':''}>
      ${visual(fighter)}
      <span><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></span>
      <em>${wrong?esc(definition.format(valueFor(fighter,definition))):'PICK'}</em>
    </button>`;
  }

  function renderBoard(){
    const grid=panel.querySelector('[data-find-leader-grid]');
    const count=panel.querySelector('[data-find-leader-count]');
    if(!grid)return;
    const rows=filteredRoster();
    if(count)count.textContent=`${rows.length} shown · ${state.roster.length} eligible`;
    grid.innerHTML=rows.length?rows.map(fighterCard).join(''):'<div class="find-leader-empty">No fighters match this search.</div>';
  }

  function renderRound(){
    const definition=currentStat();
    if(!definition){renderFinal();return;}
    const score=roundScore();
    panel.innerHTML=`
      <section class="find-leader-hero">
        <div><span>OBJECTIVE UFC STAT GAME</span><h2>Find the Leader</h2><p>${esc(definition.context)} Every wrong guess reveals that fighter’s value and costs ${WRONG_COST} points.</p></div>
        <aside><span>ROUND</span><strong>${state.roundIndex+1}/${state.rounds.length}</strong><small>TOTAL ${state.totalScore}/${maxScore()}</small></aside>
      </section>
      <section class="find-leader-question">
        <span>${esc(definition.label)}</span><h3>${esc(definition.prompt)}</h3><div class="find-leader-round-score"><b>${score}</b><small>points still available</small></div>
      </section>
      <section class="find-leader-board">
        <header><div><span>FULL RANKED ROSTER</span><strong>Tap one fighter</strong></div><b data-find-leader-count></b></header>
        <input type="search" data-find-leader-search placeholder="Search fighter or division" value="${esc(state.query)}" autocomplete="off">
        <p class="find-leader-feedback${state.feedback?' active':''}" data-find-leader-feedback>${esc(state.feedback||'Values stay hidden until you guess.')}</p>
        <div class="find-leader-grid" data-find-leader-grid></div>
      </section>`;
    renderBoard();
  }

  function chooseFighter(id){
    if(state.phase!=='round'||state.wrong.has(id))return;
    const fighter=state.roster.find(row=>row.id===id);
    const definition=currentStat();
    if(!fighter||!definition)return;
    const value=valueFor(fighter,definition);
    const top=leaderValue(definition);
    if(Math.abs(value-top)<0.005){
      const score=roundScore();
      const leaderRows=leaders(definition);
      state.totalScore+=score;
      state.history.push({statId:definition.id,label:definition.label,prompt:definition.prompt,score,wrongGuesses:state.wrong.size,leaders:leaderRows.map(row=>row.name),value:top});
      state.phase='reveal';
      renderReveal(fighter,score);
      return;
    }
    state.wrong.add(id);
    state.feedback=`${fighter.name}: ${definition.format(value)}. The leader is higher. Keep hunting.`;
    const scoreNode=panel.querySelector('.find-leader-round-score b');
    if(scoreNode)scoreNode.textContent=String(roundScore());
    const feedback=panel.querySelector('[data-find-leader-feedback]');
    if(feedback){feedback.textContent=state.feedback;feedback.classList.add('active');}
    renderBoard();
  }

  function renderReveal(picked,score){
    const definition=currentStat();
    const leaderRows=leaders(definition);
    const topRows=topFive(definition);
    panel.innerHTML=`
      <section class="find-leader-reveal-hero">
        <div><span>LEADER FOUND</span><strong>${score}</strong><small>round points</small></div>
        <article>${visual(picked,'find-leader-reveal-photo')}<div><span>${leaderRows.length>1?'TIED LEADER':'STAT LEADER'}</span><strong>${esc(picked.name)}</strong><small>${esc(definition.format(valueFor(picked,definition)))}</small></div></article>
      </section>
      <section class="find-leader-reveal-card">
        <header><div><span>${esc(definition.label)}</span><strong>${esc(definition.prompt)}</strong></div><b>${state.wrong.size} wrong guess${state.wrong.size===1?'':'es'}</b></header>
        ${leaderRows.length>1?`<p class="find-leader-tie">Accepted leaders: ${leaderRows.map(row=>esc(row.name)).join(' · ')}</p>`:''}
        <div class="find-leader-top-five">${topRows.map((fighter,index)=>`<article>${visual(fighter,'find-leader-mini-photo')}<b>#${index+1}</b><span><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></span><em>${esc(definition.format(valueFor(fighter,definition)))}</em></article>`).join('')}</div>
        <button type="button" class="find-leader-primary" data-find-leader-next>${state.roundIndex+1<state.rounds.length?'NEXT STAT':'VIEW FINAL SCORE'}</button>
      </section>`;
  }

  function nextRound(){
    if(state.phase!=='reveal')return;
    state.roundIndex+=1;
    state.wrong=new Set();
    state.query='';
    state.feedback='';
    if(state.roundIndex>=state.rounds.length){renderFinal();return;}
    state.phase='round';
    renderRound();
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderFinal(){
    state.phase='final';
    const percent=maxScore()?Math.round((state.totalScore/maxScore())*100):0;
    panel.innerHTML=`
      <section class="find-leader-final-hero"><span>FINAL SCORE</span><strong>${state.totalScore}/${maxScore()}</strong><small>${percent}% of available points</small></section>
      <section class="find-leader-final-card">
        <header><span>ROUND BREAKDOWN</span><strong>${state.history.length} verified stat leaders</strong></header>
        <div>${state.history.map((round,index)=>`<article><b>${index+1}</b><span><strong>${esc(round.label)}</strong><small>${esc(round.leaders.join(' · '))} · ${round.wrongGuesses} wrong</small></span><em>${round.score}</em></article>`).join('')}</div>
        <div class="find-leader-actions"><button type="button" class="find-leader-primary" data-find-leader-replay>PLAY AGAIN</button><button type="button" class="find-leader-secondary" data-play-home>ALL GAMES</button></div>
      </section>`;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderLoading(){
    panel.innerHTML='<section class="find-leader-loading"><span>VERIFYING LIVE STATS</span><h2>Building the leader board…</h2><p>Only complete categories from the current UFC-only model will be used.</p></section>';
  }

  function open(){
    shell.querySelectorAll('.play-panel').forEach(node=>{if(node!==panel)node.hidden=true;});
    panel.hidden=false;
    startGame();
  }
  function close(){panel.hidden=true;}

  panel.addEventListener('input',event=>{
    if(event.target.matches?.('[data-find-leader-search]')){state.query=event.target.value;renderBoard();}
  });
  panel.addEventListener('click',event=>{
    const pick=event.target.closest?.('[data-find-leader-pick]');
    if(pick){chooseFighter(pick.dataset.findLeaderPick);return;}
    if(event.target.closest?.('[data-find-leader-next]')){nextRound();return;}
    if(event.target.closest?.('[data-find-leader-replay]'))startGame();
  });

  const refreshIfOpen=()=>{if(!panel.hidden&&(state.phase==='loading'||state.phase==='final'))startGame();};
  window.addEventListener('ufc-scoring-pipeline-ready',refreshIfOpen);
  window.addEventListener('ufc-production-ranking-ready',refreshIfOpen);
  window.UFC_FIND_LEADER={version:VERSION,open,close,startGame,get state(){return state;}};
  document.documentElement.setAttribute('data-find-leader',VERSION);
})();