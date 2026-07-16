(function(){
  'use strict';

  const VERSION='better-than-20260716a-charles-vertical-slice';
  const FEATURED_NAME='Charles Oliveira';
  const SIDE_SIZE=6;
  const shell=document.querySelector('#play .play-shell');
  if(!shell)return;

  const state={featured:null,baseCandidates:[],candidates:[],selected:new Set(),locked:false};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const rankOf=fighter=>Number.isFinite(Number(fighter?.modelRank))?Number(fighter.modelRank):999;
  const divisionOf=fighter=>fighter?.primaryDivision||fighter?.divisions?.[0]||'UFC career';

  const panel=document.createElement('section');
  panel.id='playBetterThanPanel';
  panel.className='better-than-panel play-panel';
  panel.hidden=true;
  shell.appendChild(panel);

  function visual(fighter,className='better-than-photo'){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }

  function shuffle(rows){
    const copy=[...rows];
    for(let index=copy.length-1;index>0;index-=1){
      const next=Math.floor(Math.random()*(index+1));
      [copy[index],copy[next]]=[copy[next],copy[index]];
    }
    return copy;
  }

  function currentRoster(){
    const data=window.UFC_PLAY_DATA;
    data?.rebuild?.();
    const featured=data?.resolve?.(FEATURED_NAME)||null;
    const pool=data?.poolFor?.('better-than',{gender:'men',modelRanked:true})||data?.modelRanked||[];
    return {featured,pool:pool.filter(fighter=>fighter?.name&&Number.isFinite(Number(fighter.modelRank)))};
  }

  function buildPool(){
    const {featured,pool}=currentRoster();
    const featuredRank=rankOf(featured);
    if(!featured||featuredRank===999)return false;
    const higher=pool
      .filter(fighter=>fighter.id!==featured.id&&rankOf(fighter)<featuredRank)
      .sort((a,b)=>rankOf(b)-rankOf(a)||a.name.localeCompare(b.name))
      .slice(0,SIDE_SIZE);
    const lower=pool
      .filter(fighter=>fighter.id!==featured.id&&rankOf(fighter)>featuredRank)
      .sort((a,b)=>rankOf(a)-rankOf(b)||a.name.localeCompare(b.name))
      .slice(0,SIDE_SIZE);
    if(higher.length!==SIDE_SIZE||lower.length!==SIDE_SIZE)return false;
    state.featured=featured;
    state.baseCandidates=[...higher,...lower];
    state.candidates=shuffle(state.baseCandidates);
    state.selected=new Set();
    state.locked=false;
    return true;
  }

  function candidateCard(fighter){
    const selected=state.selected.has(fighter.id);
    return `<button type="button" class="better-than-candidate${selected?' selected':''}" data-better-than-candidate="${esc(fighter.id)}" aria-pressed="${selected}">
      ${visual(fighter)}
      <span class="better-than-candidate-copy"><strong>${esc(fighter.name)}</strong><small>${esc(divisionOf(fighter))}</small></span>
      <em>${selected?'SELECTED':'TAP TO SELECT'}</em>
    </button>`;
  }

  function renderGame(){
    if(!state.featured||state.candidates.length!==SIDE_SIZE*2){
      panel.innerHTML='<section class="better-than-error"><span>MODEL DATA REQUIRED</span><h2>Better Than… is not ready.</h2><p>The current UFC ranking board could not produce a balanced Charles Oliveira pool.</p></section>';
      return;
    }
    panel.innerHTML=`
      <section class="better-than-hero">
        <div class="better-than-hero-copy"><span>LOCAL MVP · OBJECTIVE GAME</span><h2>Who ranks above Charles?</h2><p>Select every fighter whose <strong>UFC-only GOAT resume</strong> currently ranks higher than Charles Oliveira. All model ranks stay hidden until you lock the card.</p></div>
        <article class="better-than-featured">${visual(state.featured,'better-than-featured-photo')}<div><small>CHALLENGE FIGHTER</small><strong>${esc(state.featured.name)}</strong><span>${esc(divisionOf(state.featured))}</span></div><b>RANK HIDDEN</b></article>
      </section>
      <section class="better-than-board">
        <header><div><span>MAKE THE CUT</span><strong>Select everyone above him</strong></div><b><span data-selected-count>${state.selected.size}</span> / ${state.candidates.length} selected</b></header>
        <div class="better-than-grid">${state.candidates.map(candidateCard).join('')}</div>
        <div class="better-than-actions"><button type="button" class="better-than-lock" data-better-than-lock>LOCK PICKS</button><button type="button" class="better-than-clear" data-better-than-clear ${state.selected.size?'':'disabled'}>CLEAR</button></div>
        <p class="better-than-help">Each candidate is one point: select fighters above Charles and leave fighters below him unselected.</p>
      </section>`;
  }

  function resultLabel(row){
    if(row.correct&&row.selected)return 'CORRECT PICK';
    if(row.correct)return 'CORRECT PASS';
    if(row.selected)return 'WRONG PICK';
    return 'MISSED';
  }

  function resultClass(row){
    if(row.correct&&row.selected)return 'correct selected';
    if(row.correct)return 'correct pass';
    if(row.selected)return 'wrong selected';
    return 'missed';
  }

  function fighterNames(rows,empty){
    return rows.length?rows.map(row=>`<span>${esc(row.fighter.name)} <b>#${rankOf(row.fighter)}</b></span>`).join(''):`<span class="empty">${esc(empty)}</span>`;
  }

  function lockPicks(){
    if(state.locked||state.candidates.length!==SIDE_SIZE*2)return;
    state.locked=true;
    const featuredRank=rankOf(state.featured);
    const rows=state.candidates.map(fighter=>{
      const selected=state.selected.has(fighter.id);
      const above=rankOf(fighter)<featuredRank;
      return {fighter,selected,above,correct:selected===above};
    });
    const score=rows.filter(row=>row.correct).length;
    const correctSelections=rows.filter(row=>row.selected&&row.above);
    const incorrectSelections=rows.filter(row=>row.selected&&!row.above);
    const missed=rows.filter(row=>!row.selected&&row.above);
    const percent=Math.round((score/rows.length)*100);

    panel.innerHTML=`
      <section class="better-than-result-hero">
        <div><span>FINAL SCORE</span><strong>${score}/${rows.length}</strong><small>${percent}% accurate</small></div>
        <article>${visual(state.featured,'better-than-result-photo')}<div><span>THE CUTOFF</span><strong>${esc(state.featured.name)}</strong><small>Official model rank #${featuredRank}</small></div></article>
      </section>
      <section class="better-than-summary-grid">
        <article><span>CORRECT SELECTIONS</span><strong>${correctSelections.length}</strong><div>${fighterNames(correctSelections,'None')}</div></article>
        <article class="wrong"><span>INCORRECT SELECTIONS</span><strong>${incorrectSelections.length}</strong><div>${fighterNames(incorrectSelections,'None')}</div></article>
        <article class="missed"><span>FIGHTERS MISSED</span><strong>${missed.length}</strong><div>${fighterNames(missed,'None')}</div></article>
      </section>
      <section class="better-than-results">
        <header><span>FULL ANSWER KEY</span><strong>Every rank revealed</strong></header>
        <div>${rows.map(row=>`<article class="better-than-result-row ${resultClass(row)}">${visual(row.fighter,'better-than-result-row-photo')}<div><strong>${esc(row.fighter.name)}</strong><small>${row.above?'Ranks above':'Does not rank above'} Charles</small></div><b>#${rankOf(row.fighter)}</b><em>${resultLabel(row)}</em></article>`).join('')}</div>
        <div class="better-than-actions"><button type="button" class="better-than-lock" data-better-than-replay>PLAY AGAIN</button></div>
      </section>`;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function replay(){
    state.candidates=shuffle(state.baseCandidates);
    state.selected=new Set();
    state.locked=false;
    renderGame();
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function open(){
    document.getElementById('playTop10Panel')?.setAttribute('hidden','');
    document.getElementById('playBlindPanel')?.setAttribute('hidden','');
    panel.hidden=false;
    if(!buildPool())renderGame();
    else renderGame();
  }

  function close(){panel.hidden=true;}

  panel.addEventListener('click',event=>{
    const candidate=event.target.closest?.('[data-better-than-candidate]');
    if(candidate&&!state.locked){
      const id=candidate.dataset.betterThanCandidate;
      if(state.selected.has(id))state.selected.delete(id);else state.selected.add(id);
      renderGame();
      return;
    }
    if(event.target.closest?.('[data-better-than-clear]')&&!state.locked){state.selected.clear();renderGame();return;}
    if(event.target.closest?.('[data-better-than-lock]')){lockPicks();return;}
    if(event.target.closest?.('[data-better-than-replay]'))replay();
  });

  window.addEventListener('ufc-scoring-pipeline-ready',()=>{if(!panel.hidden&&!state.locked){buildPool();renderGame();}});
  window.UFC_BETTER_THAN={version:VERSION,featured:FEATURED_NAME,open,close,replay,get state(){return state;}};
  document.documentElement.setAttribute('data-better-than',VERSION);
})();
