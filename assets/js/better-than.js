(function(){
  'use strict';

  const VERSION='better-than-20260716b-subjective-claim-builder';
  const DEFAULT_TARGET='Charles Oliveira';
  const HARD_MAX_CLAIM=15;
  const shell=document.querySelector('#play .play-shell');
  if(!shell)return;

  const LENSES=[
    {id:'overall',label:'Overall fighter',phrase:'overall'},
    {id:'striking',label:'Striking',phrase:'at striking'},
    {id:'boxing',label:'Boxing',phrase:'at boxing'},
    {id:'kickboxing',label:'Kickboxing',phrase:'at kickboxing'},
    {id:'wrestling',label:'Wrestling',phrase:'at wrestling'},
    {id:'grappling',label:'Grappling',phrase:'at grappling'},
    {id:'submissions',label:'Submissions',phrase:'at submissions'},
    {id:'cardio',label:'Cardio',phrase:'at cardio'},
    {id:'durability',label:'Durability',phrase:'at durability'},
    {id:'power',label:'Power',phrase:'at power'},
    {id:'ufc-resume',label:'UFC-only resume',phrase:'by UFC-only resume'}
  ];

  const DIVISIONS=['Heavyweight','Light Heavyweight','Middleweight','Welterweight','Lightweight','Featherweight','Bantamweight','Flyweight','Strawweight'];
  const state={
    roster:[],targetId:'charles-oliveira',lensId:'overall',poolId:'all',claimCount:5,
    selected:new Set(),query:'',locked:false,loading:true
  };

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normal=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const initials=name=>String(name||'UFC').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const divisionsFor=fighter=>Array.isArray(fighter?.divisions)&&fighter.divisions.length?fighter.divisions:[fighter?.primaryDivision].filter(Boolean);
  const lens=()=>LENSES.find(item=>item.id===state.lensId)||LENSES[0];
  const target=()=>state.roster.find(fighter=>fighter.id===state.targetId)||state.roster.find(fighter=>fighter.name===DEFAULT_TARGET)||state.roster[0]||null;

  const panel=document.createElement('section');
  panel.id='playBetterThanPanel';
  panel.className='better-than-panel play-panel';
  panel.hidden=true;
  shell.appendChild(panel);

  function snapshot(fighter,index=0){
    return {
      id:String(fighter?.id||`fighter-${index+1}`),name:String(fighter?.name||`Fighter ${index+1}`),
      gender:fighter?.gender==='women'?'women':'men',primaryDivision:String(fighter?.primaryDivision||divisionsFor(fighter)[0]||''),
      divisions:divisionsFor(fighter),thumbUrl:String(fighter?.thumbUrl||''),profileUrl:String(fighter?.profileUrl||'')
    };
  }

  function visual(fighter,className='better-than-photo'){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }

  function refreshRoster(){
    const data=window.UFC_PLAY_DATA;
    data?.rebuild?.();
    const rows=(data?.modelRanked||[]).filter(fighter=>fighter?.id&&fighter?.name);
    if(rows.length<60){state.loading=true;return false;}
    state.roster=rows.map(snapshot).sort((a,b)=>a.name.localeCompare(b.name));
    const preferred=state.roster.find(fighter=>fighter.name===DEFAULT_TARGET);
    if(!state.roster.some(fighter=>fighter.id===state.targetId))state.targetId=preferred?.id||state.roster[0]?.id||'';
    state.loading=false;
    return true;
  }

  function poolOptions(){
    return [
      {id:'all',label:`Full ${state.roster.length}-fighter pool`,phrase:'from the full UFC pool'},
      {id:'men',label:"Men's pool",phrase:"from the men's pool"},
      {id:'women',label:"Women's pool",phrase:"from the women's pool"},
      {id:'same-division',label:'Same division as target',phrase:'from the same UFC division pool'},
      {id:'205-plus',label:'205+ divisions',phrase:'among fighters who competed at Light Heavyweight or Heavyweight'},
      {id:'170-below',label:'170 lb divisions and below',phrase:'among fighters who competed at Welterweight or below'},
      ...DIVISIONS.map(division=>({id:`division:${division}`,label:division,phrase:`among fighters who competed at ${division}`}))
    ];
  }

  function pool(){return poolOptions().find(item=>item.id===state.poolId)||poolOptions()[0];}

  function matchesPool(fighter){
    const choice=state.poolId;
    if(choice==='all')return true;
    if(choice==='men'||choice==='women')return fighter.gender===choice;
    const fighterDivisions=divisionsFor(fighter);
    if(choice==='same-division'){
      const targetDivisions=new Set(divisionsFor(target()));
      return fighterDivisions.some(division=>targetDivisions.has(division));
    }
    if(choice==='205-plus')return fighterDivisions.some(division=>division==='Heavyweight'||division==='Light Heavyweight');
    if(choice==='170-below')return fighterDivisions.some(division=>['Welterweight','Lightweight','Featherweight','Bantamweight','Flyweight','Strawweight'].includes(division));
    if(choice.startsWith('division:'))return fighterDivisions.includes(choice.slice(9));
    return true;
  }

  function eligible(){
    const targetId=state.targetId;
    return state.roster.filter(fighter=>fighter.id!==targetId&&matchesPool(fighter));
  }

  function maxClaim(){return Math.max(1,Math.min(HARD_MAX_CLAIM,eligible().length));}

  function reconcile(){
    const valid=new Set(eligible().map(fighter=>fighter.id));
    state.selected=new Set([...state.selected].filter(id=>valid.has(id)));
    state.claimCount=Math.max(1,Math.min(Number(state.claimCount)||1,maxClaim()));
  }

  function statement(count=state.claimCount,subject='I'){
    const person=target();
    return `${subject} can name ${count} fighter${count===1?'':'s'} better than ${person?.name||'the challenge fighter'} ${lens().phrase} ${pool().phrase}.`;
  }

  function fighterMeta(fighter){return divisionsFor(fighter).join(' · ')||'UFC career';}

  function candidateCard(fighter){
    const selected=state.selected.has(fighter.id);
    const full=state.selected.size>=state.claimCount&&!selected;
    return `<button type="button" class="better-than-candidate${selected?' selected':''}" data-better-than-candidate="${esc(fighter.id)}" aria-pressed="${selected}" ${full?'disabled':''}>
      ${visual(fighter)}
      <span class="better-than-candidate-copy"><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></span>
      <em>${selected?'IN MY CLAIM':full?'CLAIM FULL':'ADD FIGHTER'}</em>
    </button>`;
  }

  function filteredRoster(){
    const query=normal(state.query);
    return eligible().filter(fighter=>!query||normal([fighter.name,...divisionsFor(fighter)].join(' ')).includes(query));
  }

  function renderGrid(){
    const grid=panel.querySelector('[data-better-than-grid]');
    const count=panel.querySelector('[data-better-than-pool-count]');
    if(!grid)return;
    const rows=filteredRoster();
    if(count)count.textContent=`${rows.length} shown · ${eligible().length} eligible`;
    grid.innerHTML=rows.length?rows.map(candidateCard).join(''):'<div class="better-than-empty">No fighters match this search and pool.</div>';
  }

  function renderSelected(){
    const targetNode=panel.querySelector('[data-better-than-selected]');
    if(!targetNode)return;
    const byId=new Map(state.roster.map(fighter=>[fighter.id,fighter]));
    const rows=[...state.selected].map(id=>byId.get(id)).filter(Boolean);
    targetNode.innerHTML=rows.length?rows.map(fighter=>`<button type="button" data-better-than-remove="${esc(fighter.id)}">${visual(fighter,'better-than-chip-photo')}<span>${esc(fighter.name)}</span><b>×</b></button>`).join(''):'<p>Your claim list is empty. Tap fighters below to add them.</p>';
  }

  function refreshBuilder(){
    const selected=state.selected.size;
    const needed=state.claimCount-selected;
    const statementNode=panel.querySelector('[data-better-than-statement]');
    const progressNode=panel.querySelector('[data-better-than-progress]');
    const lock=panel.querySelector('[data-better-than-lock]');
    const minus=panel.querySelector('[data-better-than-count-minus]');
    const plus=panel.querySelector('[data-better-than-count-plus]');
    const count=panel.querySelector('[data-better-than-count]');
    if(statementNode)statementNode.textContent=statement();
    if(progressNode)progressNode.textContent=needed>0?`${selected}/${state.claimCount} selected · choose ${needed} more`:selected>state.claimCount?`Remove ${selected-state.claimCount} fighter${selected-state.claimCount===1?'':'s'}`:`${selected}/${state.claimCount} selected · claim ready`;
    if(lock)lock.disabled=selected!==state.claimCount;
    if(minus)minus.disabled=state.claimCount<=1;
    if(plus)plus.disabled=state.claimCount>=maxClaim();
    if(count)count.textContent=String(state.claimCount);
    renderSelected();
    renderGrid();
  }

  function renderBuilder(){
    if(state.loading){
      panel.innerHTML='<section class="better-than-error"><span>LOADING FIGHTER POOL</span><h2>Building the claim board…</h2><p>The full ranked UFC roster will appear as soon as the live data pipeline is ready.</p></section>';
      return;
    }
    reconcile();
    const currentTarget=target();
    panel.innerHTML=`
      <section class="better-than-hero">
        <div class="better-than-hero-copy"><span>SUBJECTIVE CLAIM BUILDER</span><h2>Make a UFC argument.</h2><p>Choose the fighter, the debate lens, your eligible pool, and exactly how many names you can defend. There is no model answer.</p></div>
        <article class="better-than-featured">${visual(currentTarget,'better-than-featured-photo')}<div><small>CHALLENGE FIGHTER</small><strong>${esc(currentTarget?.name||'Choose a fighter')}</strong><span>${esc(fighterMeta(currentTarget))}</span></div><b>YOUR CALL</b></article>
      </section>
      <section class="better-than-builder">
        <div class="better-than-controls">
          <label><span>CHALLENGE FIGHTER</span><select data-better-than-target>${state.roster.map(fighter=>`<option value="${esc(fighter.id)}" ${fighter.id===state.targetId?'selected':''}>${esc(fighter.name)}</option>`).join('')}</select></label>
          <label><span>BETTER AT</span><select data-better-than-lens>${LENSES.map(item=>`<option value="${esc(item.id)}" ${item.id===state.lensId?'selected':''}>${esc(item.label)}</option>`).join('')}</select></label>
          <label><span>ELIGIBLE POOL</span><select data-better-than-pool>${poolOptions().map(item=>`<option value="${esc(item.id)}" ${item.id===state.poolId?'selected':''}>${esc(item.label)}</option>`).join('')}</select></label>
          <div class="better-than-count-control"><span>MY NUMBER</span><div><button type="button" data-better-than-count-minus aria-label="Decrease claim count">−</button><strong data-better-than-count>${state.claimCount}</strong><button type="button" data-better-than-count-plus aria-label="Increase claim count">+</button></div><small>1–${maxClaim()} allowed</small></div>
        </div>
        <div class="better-than-statement"><span>YOUR CLAIM</span><strong data-better-than-statement>${esc(statement())}</strong><small>Weight filters use verified UFC divisions, not estimated bodyweight.</small></div>
      </section>
      <section class="better-than-selected-card"><header><div><span>YOUR EXACT LIST</span><strong data-better-than-progress></strong></div><button type="button" data-better-than-clear>CLEAR</button></header><div data-better-than-selected></div></section>
      <section class="better-than-roster-card">
        <header><div><span>FIGHTER POOL</span><strong>Tap people onto your claim</strong></div><b data-better-than-pool-count></b></header>
        <input type="search" data-better-than-search placeholder="Search all eligible fighters" value="${esc(state.query)}" autocomplete="off">
        <div class="better-than-grid" data-better-than-grid></div>
        <div class="better-than-actions"><button type="button" class="better-than-lock" data-better-than-lock>LOCK MY CLAIM</button></div>
      </section>`;
    refreshBuilder();
  }

  function selectedFighters(){
    const byId=new Map(state.roster.map(fighter=>[fighter.id,fighter]));
    return [...state.selected].map(id=>byId.get(id)).filter(Boolean);
  }

  function renderResult(){
    const rows=selectedFighters();
    panel.innerHTML=`
      <section class="better-than-claim-result">
        <span>CLAIM LOCKED</span>
        <h2>${esc(statement())}</h2>
        <p>This is your argument—not an official model verdict. Send the exact setup to a friend and see whether they make a narrower claim or choose different names.</p>
        <div class="better-than-claim-lineup">${rows.map(fighter=>`<article>${visual(fighter,'better-than-result-photo')}<strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></article>`).join('')}</div>
        <div class="better-than-actions"><button type="button" class="better-than-lock" data-better-than-challenge>CHALLENGE A FRIEND</button><button type="button" class="better-than-clear" data-better-than-edit>EDIT CLAIM</button><button type="button" class="better-than-clear" data-better-than-new>BUILD ANOTHER</button></div>
      </section>`;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function lockClaim(){
    if(state.selected.size!==state.claimCount)return;
    state.locked=true;
    renderResult();
  }

  function exportChallenge(){
    if(!state.locked||state.selected.size!==state.claimCount)return null;
    const currentTarget=target();
    const poolChoice=pool();
    return {
      setup:{
        mode:'subjective-claim-v1',target:snapshot(currentTarget),lens:{...lens()},pool:{...poolChoice},
        eligible:eligible().map(snapshot),maxClaim:maxClaim(),challengerCount:state.claimCount,rosterCount:state.roster.length
      },
      result:{claimCount:state.claimCount,selections:[...state.selected]}
    };
  }

  function buildAnother(){
    state.selected=new Set();state.query='';state.locked=false;state.claimCount=Math.min(5,maxClaim());renderBuilder();panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function open(){
    document.getElementById('playTop10Panel')?.setAttribute('hidden','');
    document.getElementById('playBlindPanel')?.setAttribute('hidden','');
    panel.hidden=false;
    refreshRoster();
    renderBuilder();
  }

  function close(){panel.hidden=true;}

  panel.addEventListener('change',event=>{
    if(event.target.matches('[data-better-than-target]')){state.targetId=event.target.value;state.selected.clear();state.locked=false;renderBuilder();}
    if(event.target.matches('[data-better-than-lens]')){state.lensId=event.target.value;state.locked=false;refreshBuilder();}
    if(event.target.matches('[data-better-than-pool]')){state.poolId=event.target.value;state.selected.clear();state.locked=false;renderBuilder();}
  });

  panel.addEventListener('input',event=>{
    if(!event.target.matches('[data-better-than-search]'))return;
    state.query=event.target.value;
    renderGrid();
  });

  panel.addEventListener('click',event=>{
    const candidate=event.target.closest?.('[data-better-than-candidate]');
    if(candidate&&!state.locked){
      const id=candidate.dataset.betterThanCandidate;
      if(state.selected.has(id))state.selected.delete(id);
      else if(state.selected.size<state.claimCount)state.selected.add(id);
      refreshBuilder();return;
    }
    const remove=event.target.closest?.('[data-better-than-remove]');
    if(remove&&!state.locked){state.selected.delete(remove.dataset.betterThanRemove);refreshBuilder();return;}
    if(event.target.closest?.('[data-better-than-count-minus]')&&!state.locked){state.claimCount=Math.max(1,state.claimCount-1);refreshBuilder();return;}
    if(event.target.closest?.('[data-better-than-count-plus]')&&!state.locked){state.claimCount=Math.min(maxClaim(),state.claimCount+1);refreshBuilder();return;}
    if(event.target.closest?.('[data-better-than-clear]')&&!state.locked){state.selected.clear();refreshBuilder();return;}
    if(event.target.closest?.('[data-better-than-lock]')){lockClaim();return;}
    if(event.target.closest?.('[data-better-than-edit]')){state.locked=false;renderBuilder();return;}
    if(event.target.closest?.('[data-better-than-new]'))buildAnother();
  });

  window.addEventListener('ufc-scoring-pipeline-ready',()=>{
    const wasVisible=!panel.hidden;
    const selected=[...state.selected];
    if(refreshRoster()&&wasVisible&&!state.locked){state.selected=new Set(selected.filter(id=>state.roster.some(fighter=>fighter.id===id)));renderBuilder();}
  });

  window.UFC_BETTER_THAN={version:VERSION,open,close,buildAnother,exportChallenge,get state(){return state;}};
  document.documentElement.setAttribute('data-better-than',VERSION);
})();