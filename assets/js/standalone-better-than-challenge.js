(function(){
  'use strict';

  const VERSION='standalone-better-than-challenge-20260716a-subjective-claim';
  const pageUrl=new URL(window.location.href);
  const code=String(pageUrl.searchParams.get('code')||pageUrl.searchParams.get('challenge')||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const profile=window.UFC_PLAY_PROFILE;
  const client=profile?.client;
  const host=document.getElementById('challengeApp');
  const statusNode=document.getElementById('challengeStatus');
  const profileNode=document.getElementById('challengeProfile');
  const state={challenge:null,target:null,eligible:[],lens:null,pool:null,maxClaim:15,creatorCount:1,claimCount:1,selected:new Set(),query:'',locked:false,submitting:false};

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normal=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const normalizeJson=value=>{if(typeof value!=='string')return value;try{return JSON.parse(value);}catch(_error){return value;}};
  const saveKey=()=>`ufc-standalone-better-than:${code}`;

  function setStatus(message,type=''){
    if(!statusNode)return;
    statusNode.textContent=message;
    statusNode.dataset.type=type;
  }

  function showProfile(identity){
    if(!profileNode)return;
    profileNode.innerHTML=identity?`<span>PLAYING AS</span><strong>${esc(identity.member?.display_name||'Player')}</strong>`:'<span>PROFILE</span><strong>SIGN IN AT FINISH</strong>';
  }

  function divisionsFor(fighter){return Array.isArray(fighter?.divisions)&&fighter.divisions.length?fighter.divisions:[fighter?.primaryDivision].filter(Boolean);}
  function fighterMeta(fighter){return divisionsFor(fighter).join(' · ')||'UFC career';}

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
      gender:raw.gender==='women'||resolved?.gender==='women'?'women':'men',
      primaryDivision:raw.primaryDivision||resolved?.primaryDivision||resolved?.divisions?.[0]||'',
      divisions:Array.isArray(raw.divisions)?raw.divisions:(resolved?.divisions||[]),
      thumbUrl:raw.thumbUrl||resolved?.thumbUrl||'',profileUrl:raw.profileUrl||resolved?.profileUrl||''
    };
  }

  function setupFrom(rawSetup){
    const setup=normalizeJson(rawSetup)||{};
    const eligible=(Array.isArray(setup.eligible)?setup.eligible:[]).map(resolveFighter);
    const target=resolveFighter(setup.target||{},eligible.length);
    const max=Math.max(1,Math.min(15,Number(setup.maxClaim)||15,eligible.length));
    const creatorCount=Math.max(1,Math.min(max,Number(setup.challengerCount)||1));
    return {
      setup,target,eligible,
      lens:{id:String(setup.lens?.id||'overall'),label:String(setup.lens?.label||'Overall fighter'),phrase:String(setup.lens?.phrase||'overall')},
      pool:{id:String(setup.pool?.id||'all'),label:String(setup.pool?.label||'Full UFC pool'),phrase:String(setup.pool?.phrase||'from the full UFC pool')},
      maxClaim:max,creatorCount
    };
  }

  function normalizeClaim(result){
    const value=normalizeJson(result)||{};
    const selections=(Array.isArray(value.selections)?value.selections:[]).map(id=>String(id||'')).filter(Boolean);
    const unique=[...new Set(selections)];
    const count=Math.max(1,Number(value.claimCount)||unique.length||1);
    return {claimCount:count,selections:unique};
  }

  function statement(count,subject){return `${subject} can name ${count} fighter${count===1?'':'s'} better than ${state.target.name} ${state.lens.phrase} ${state.pool.phrase}.`;}

  function saveProgress(){
    try{sessionStorage.setItem(saveKey(),JSON.stringify({claimCount:state.claimCount,selections:[...state.selected]}));}catch(_error){}
  }

  function restoreProgress(){
    try{
      const saved=JSON.parse(sessionStorage.getItem(saveKey())||'null');
      if(!saved)return;
      const valid=new Set(state.eligible.map(fighter=>fighter.id));
      state.claimCount=Math.max(1,Math.min(state.maxClaim,Number(saved.claimCount)||state.creatorCount));
      state.selected=new Set((Array.isArray(saved.selections)?saved.selections:[]).filter(id=>valid.has(id)).slice(0,state.maxClaim));
    }catch(_error){}
  }

  function selectedFighters(ids=[...state.selected]){
    const byId=new Map(state.eligible.map(fighter=>[fighter.id,fighter]));
    return ids.map(id=>byId.get(id)).filter(Boolean);
  }

  function candidateCard(fighter){
    const selected=state.selected.has(fighter.id);
    const full=state.selected.size>=state.claimCount&&!selected;
    return `<button type="button" class="claim-candidate${selected?' selected':''}" data-candidate="${esc(fighter.id)}" aria-pressed="${selected}" ${full?'disabled':''}>${visual(fighter,'candidate-photo')}<span><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></span><em>${selected?'IN MY CLAIM':full?'CLAIM FULL':'ADD'}</em></button>`;
  }

  function filtered(){
    const query=normal(state.query);
    return state.eligible.filter(fighter=>!query||normal([fighter.name,...divisionsFor(fighter)].join(' ')).includes(query));
  }

  function renderGrid(){
    const grid=host.querySelector('[data-grid]');
    const count=host.querySelector('[data-pool-count]');
    if(!grid)return;
    const rows=filtered();
    if(count)count.textContent=`${rows.length} shown · ${state.eligible.length} eligible`;
    grid.innerHTML=rows.length?rows.map(candidateCard).join(''):'<div class="empty-state">No fighters match this search.</div>';
  }

  function renderSelected(){
    const node=host.querySelector('[data-selected]');
    if(!node)return;
    const rows=selectedFighters();
    node.innerHTML=rows.length?rows.map(fighter=>`<button type="button" data-remove="${esc(fighter.id)}">${visual(fighter,'chip-photo')}<span>${esc(fighter.name)}</span><b>×</b></button>`).join(''):'<p>Your list is empty. Tap fighters below.</p>';
  }

  function refreshGame(){
    const selected=state.selected.size;
    const needed=state.claimCount-selected;
    const progress=host.querySelector('[data-progress]');
    const ownStatement=host.querySelector('[data-own-statement]');
    const count=host.querySelector('[data-count]');
    const minus=host.querySelector('[data-count-minus]');
    const plus=host.querySelector('[data-count-plus]');
    const lock=host.querySelector('[data-lock]');
    if(progress)progress.textContent=needed>0?`${selected}/${state.claimCount} selected · choose ${needed} more`:selected>state.claimCount?`Remove ${selected-state.claimCount}`:`${selected}/${state.claimCount} selected · ready`;
    if(ownStatement)ownStatement.textContent=statement(state.claimCount,'You');
    if(count)count.textContent=String(state.claimCount);
    if(minus)minus.disabled=state.claimCount<=1;
    if(plus)plus.disabled=state.claimCount>=state.maxClaim;
    if(lock)lock.disabled=selected!==state.claimCount;
    renderSelected();renderGrid();saveProgress();
  }

  function renderGame(){
    state.locked=false;
    host.innerHTML=`
      <section class="challenge-intro"><span>FRIEND CHALLENGE</span><h1>${esc(state.challenge.creator_name)} made a UFC claim.</h1><p>${esc(statement(state.creatorCount,state.challenge.creator_name))}</p></section>
      <section class="claim-setup-card">
        <article class="target-card">${visual(state.target,'target-photo')}<div><span>CHALLENGE FIGHTER</span><strong>${esc(state.target.name)}</strong><small>${esc(fighterMeta(state.target))}</small></div></article>
        <div class="claim-facts"><div><span>BETTER AT</span><strong>${esc(state.lens.label)}</strong></div><div><span>ELIGIBLE POOL</span><strong>${esc(state.pool.label)}</strong></div><div><span>${esc(String(state.challenge.creator_name||'CHALLENGER').toUpperCase())}'S NUMBER</span><strong>${state.creatorCount}</strong></div></div>
      </section>
      <section class="claim-builder-card">
        <header><div><span>YOUR COUNTERCLAIM</span><strong data-own-statement>${esc(statement(state.claimCount,'You'))}</strong></div><div class="count-control"><button type="button" data-count-minus>−</button><b data-count>${state.claimCount}</b><button type="button" data-count-plus>+</button></div></header>
        <div class="selected-list"><div><span>YOUR EXACT LIST</span><strong data-progress></strong></div><section data-selected></section></div>
        <input type="search" data-search placeholder="Search the frozen fighter pool" value="${esc(state.query)}" autocomplete="off">
        <div class="pool-head"><span>FIGHTER POOL</span><b data-pool-count></b></div>
        <div class="candidate-grid" data-grid></div>
        <div class="sticky-actions"><button type="button" class="primary-action" data-lock>LOCK MY CLAIM</button></div>
      </section>`;
    refreshGame();
    setStatus(`${state.challenge.creator_name}'s fighter list stays hidden until you submit.`,'ready');
  }

  function renderFinish(){
    const rows=selectedFighters();
    state.locked=true;
    host.innerHTML=`
      <section class="challenge-intro"><span>CLAIM LOCKED</span><h1>${esc(statement(state.claimCount,'You'))}</h1><p>Your choices are ready. Sign in only when you want to reveal ${esc(state.challenge.creator_name)}’s list and compare.</p></section>
      <section class="finish-card"><div class="claim-lineup">${rows.map(fighter=>`<article>${visual(fighter,'result-photo')}<strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></article>`).join('')}</div><button type="button" class="primary-action" data-submit>SUBMIT & COMPARE</button><button type="button" class="secondary-action" data-edit>EDIT MY CLAIM</button><a class="secondary-action link-action" href="index.html#play">BACK TO ALL GAMES</a></section>`;
    setStatus('Your claim is locked locally. Submit to compare.','ready');
  }

  function listRows(fighters,className){
    return fighters.length?fighters.map(fighter=>`<article class="comparison-fighter ${className}">${visual(fighter,'comparison-photo')}<div><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></div></article>`).join(''):'<div class="empty-state compact">No fighters in this group.</div>';
  }

  function renderComparison(data){
    const mine=normalizeClaim(data?.responder_result);
    const theirs=normalizeClaim(data?.creator_result);
    const valid=new Set(state.eligible.map(fighter=>fighter.id));
    mine.selections=mine.selections.filter(id=>valid.has(id));
    theirs.selections=theirs.selections.filter(id=>valid.has(id));
    if(mine.selections.length!==mine.claimCount||theirs.selections.length!==theirs.claimCount){renderFinish();setStatus('The claims saved, but one exact fighter list could not be compared.','error');return;}
    const mineSet=new Set(mine.selections);
    const theirSet=new Set(theirs.selections);
    const sharedIds=mine.selections.filter(id=>theirSet.has(id));
    const mineOnlyIds=mine.selections.filter(id=>!theirSet.has(id));
    const theirOnlyIds=theirs.selections.filter(id=>!mineSet.has(id));
    const union=new Set([...mine.selections,...theirs.selections]);
    const overlap=union.size?Math.round((sharedIds.length/union.size)*100):100;
    const shared=selectedFighters(sharedIds);
    const mineOnly=selectedFighters(mineOnlyIds);
    const theirOnly=selectedFighters(theirOnlyIds);
    const mineRows=selectedFighters(mine.selections);
    const theirRows=selectedFighters(theirs.selections);
    const narrower=mine.claimCount===theirs.claimCount?'You made claims of the same size.':mine.claimCount<theirs.claimCount?`You made the narrower claim by ${theirs.claimCount-mine.claimCount}.`:`${data.creator_name} made the narrower claim by ${mine.claimCount-theirs.claimCount}.`;

    window.UFC_STANDALONE_REMATCH_CONTEXT={
      gameType:'better-than',gameVersion:state.challenge?.game_version||'better-than-subjective-v1',page:'better-than-challenge.html',originalCode:code,
      setup:normalizeJson(state.challenge?.setup)||{},result:{claimCount:mine.claimCount,selections:[...mine.selections]},metadata:{comparison:'better-than-subjective-claim'}
    };

    host.innerHTML=`
      <section class="challenge-intro"><span>CLAIMS REVEALED</span><h1>${shared.length} shared name${shared.length===1?'':'s'} · ${overlap}% list overlap.</h1><p>${esc(narrower)} Smaller does not mean officially correct—the disagreement is the game.</p></section>
      <section class="comparison-card">
        <div class="claim-duel"><section class="player-claim responder"><span>YOUR CLAIM</span><strong>${mine.claimCount}</strong><small>${esc(data.responder_name||'PLAYER')}</small></section><div><b>VS</b><span>NO OFFICIAL WINNER</span></div><section class="player-claim challenger"><span>CHALLENGER CLAIM</span><strong>${theirs.claimCount}</strong><small>${esc(data.creator_name)}</small></section></div>
        <div class="comparison-columns"><section class="claim-column responder"><header><span>YOUR LIST</span><strong>${mine.claimCount} fighters</strong></header>${listRows(mineRows,'responder')}</section><section class="claim-column challenger"><header><span>${esc(String(data.creator_name||'CHALLENGER').toUpperCase())}'S LIST</span><strong>${theirs.claimCount} fighters</strong></header>${listRows(theirRows,'challenger')}</section></div>
        <section class="agreement-card"><header><span>WHERE YOU AGREED</span><strong>${shared.length} shared</strong></header><div>${listRows(shared,'shared')}</div></section>
        <div class="split-grid"><section><header><span>ONLY YOU PICKED</span><strong>${mineOnly.length}</strong></header>${listRows(mineOnly,'responder')}</section><section><header><span>ONLY ${esc(String(data.creator_name||'CHALLENGER').toUpperCase())} PICKED</span><strong>${theirOnly.length}</strong></header>${listRows(theirOnly,'challenger')}</section></div>
        <button type="button" class="primary-action" data-challenge-back>CHALLENGE BACK</button><a class="secondary-action link-action" href="index.html#play">PLAY A NEW GAME</a>
      </section>`;
    setStatus(`Comparison complete. ${shared.length} shared fighters and ${union.size-shared.length} disagreements.`,'success');
    try{sessionStorage.removeItem(saveKey());}catch(_error){}
  }

  async function submitAndCompare(){
    if(state.submitting||!state.locked||state.selected.size!==state.claimCount)return;
    state.submitting=true;
    const button=host.querySelector('[data-submit]');
    if(button){button.disabled=true;button.textContent='CONNECTING PROFILE…';}
    try{
      const identity=await profile.require({title:'Reveal both Better Than claims',description:'Use your existing Picks profile. Your number and exact fighter list are already locked.'});
      if(!identity){state.submitting=false;if(button){button.disabled=false;button.textContent='SUBMIT & COMPARE';}return;}
      showProfile(identity);
      if(button)button.textContent='SAVING CLAIM…';
      const {data,error}=await client.rpc('play_submit_challenge',{
        p_challenge_code:code,p_group_code:identity.groupCode,p_member_token:identity.memberToken,
        p_result:{claimCount:state.claimCount,selections:[...state.selected]},p_score:null,p_metadata:{client:VERSION}
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The claim could not be saved.');
      renderComparison(data);
    }catch(error){state.submitting=false;if(button){button.disabled=false;button.textContent='TRY SUBMIT AGAIN';}setStatus(String(error?.message||'The claim could not be submitted.'),'error');}
  }

  async function load(){
    document.documentElement.setAttribute('data-standalone-better-than',VERSION);
    if(!host||!client){setStatus('The challenge page could not connect.','error');return;}
    if(code.length<4){setStatus('This challenge link is missing its code.','error');host.innerHTML='<section class="error-card"><h1>Challenge link incomplete</h1><p>Ask your friend to send a new Better Than link.</p><a href="index.html#play">BACK TO ALL GAMES</a></section>';return;}
    profile.resolve().then(showProfile).catch(()=>showProfile(null));
    try{
      const {data,error}=await client.rpc('play_get_challenge',{p_challenge_code:code});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge not found.');
      const challenge=data.challenge;
      if(challenge.game_type!=='better-than')throw new Error('This page supports Better Than challenges only.');
      const parsed=setupFrom(challenge.setup);
      if(!parsed.target?.name||parsed.eligible.length<1)throw new Error('This challenge is missing its frozen fighter pool. Ask your friend to create a new link.');
      state.challenge=challenge;state.target=parsed.target;state.eligible=parsed.eligible;state.lens=parsed.lens;state.pool=parsed.pool;state.maxClaim=parsed.maxClaim;state.creatorCount=parsed.creatorCount;state.claimCount=parsed.creatorCount;
      restoreProgress();renderGame();
    }catch(error){setStatus(String(error?.message||'Challenge could not load.'),'error');host.innerHTML=`<section class="error-card"><span>CHALLENGE ERROR</span><h1>Could not open this challenge.</h1><p>${esc(error?.message||'The link may have expired.')}</p><a href="index.html#play">BACK TO ALL GAMES</a></section>`;}
  }

  document.addEventListener('input',event=>{if(event.target.matches?.('[data-search]')){state.query=event.target.value;renderGrid();}});
  document.addEventListener('click',event=>{
    const candidate=event.target.closest?.('[data-candidate]');
    if(candidate&&!state.locked){const id=candidate.dataset.candidate;if(state.selected.has(id))state.selected.delete(id);else if(state.selected.size<state.claimCount)state.selected.add(id);refreshGame();return;}
    const remove=event.target.closest?.('[data-remove]');
    if(remove&&!state.locked){state.selected.delete(remove.dataset.remove);refreshGame();return;}
    if(event.target.closest?.('[data-count-minus]')&&!state.locked){state.claimCount=Math.max(1,state.claimCount-1);refreshGame();return;}
    if(event.target.closest?.('[data-count-plus]')&&!state.locked){state.claimCount=Math.min(state.maxClaim,state.claimCount+1);refreshGame();return;}
    if(event.target.closest?.('[data-lock]')&&!state.locked&&state.selected.size===state.claimCount){renderFinish();return;}
    if(event.target.closest?.('[data-edit]')){renderGame();return;}
    if(event.target.closest?.('[data-submit]'))submitAndCompare();
    if(event.target.closest?.('#challengeProfile'))profile.modal({title:'Switch or reconnect profile'}).then(identity=>identity&&showProfile(identity));
  });

  load();
})();