(function(){
  'use strict';

  const DATA=window.UFC_ERA_FILTER_DATA;
  const select=document.getElementById('eraFilter');
  const search=document.getElementById('search');
  const reset=document.getElementById('resetBtn');
  if(!DATA||!select)return;

  const ERA_COPY={
    tournament:{
      description:'The UFC begins as a style-vs-style experiment built around one-night tournaments and minimal rules. Royce Gracie’s jiu-jitsu success changes how American fans understand fighting and establishes the promotion’s original identity.'
    },
    survival:{
      description:'Political pressure, cable bans, and limited distribution nearly push the UFC out of existence. Smaller cards and early champions such as Frank Shamrock and Tito Ortiz keep it alive while the sport slowly moves toward modern rules.'
    },
    'zuffa-rebuild':{
      description:'Zuffa buys a struggling UFC and rebuilds it around unified rules, weight classes, athletic commissions, and stronger promotion. The company is still losing money, but the structure of the modern UFC is created here.',
      fightUrl:'https://youtu.be/7PBdRCKjYm0?is=NCoRl2UqojPQZycJ',
      fightNote:'Second fight in their trilogy.'
    },
    'tuf-boom':{
      description:'The Ultimate Fighter and Spike TV bring the UFC into millions of homes. Forrest Griffin vs. Stephan Bonnar provides the breakthrough moment, while a new wave of champions turns the promotion into a mainstream sport.'
    },
    'golden-age':{
      description:'The roster becomes deeper, more technical, and truly global. Lighter divisions arrive, women enter the UFC, and a loaded generation of dominant champions produces one of the promotion’s strongest competitive periods.'
    },
    superstar:{
      description:'Conor McGregor transforms the UFC’s commercial ceiling and makes individual fighters feel bigger than divisions. Champ-champ pursuits, enormous rivalries, and personality-driven promotion become central to how UFC greatness is discussed.'
    },
    apex:{
      description:'The UFC keeps operating through the pandemic with empty-arena cards, Fight Island, and the UFC Apex. A relentless schedule accelerates contender turnover while a new championship class takes control across the promotion.'
    },
    'new-blood':{
      description:'A new global generation takes control as younger champions replace many of the previous era’s defining names. Technical depth is extremely high, stars emerge quickly, and the identity of this era is still being written.'
    }
  };

  Object.entries(ERA_COPY).forEach(([id,copy])=>{
    if(DATA.byId?.[id])Object.assign(DATA.byId[id],copy);
  });

  const selectionByView={men:'All',women:'All'};
  let applyTimer=0;
  let applying=false;

  function activeView(){
    return document.querySelector('.tab.active')?.dataset.view||'men';
  }

  function erasForView(view){
    return view==='women'
      ? DATA.eras.filter(era=>Number(era.startYear)>=2011)
      : DATA.eras;
  }

  function eraForView(view){
    return DATA.byId[selectionByView[view]]||null;
  }

  function selectedEra(){
    return eraForView(activeView());
  }

  function populateForView(view=activeView()){
    if(view!=='men'&&view!=='women')return;
    const allowed=erasForView(view);
    const allowedIds=new Set(allowed.map(era=>era.id));
    const current=allowedIds.has(selectionByView[view])?selectionByView[view]:'All';
    selectionByView[view]=current;
    select.innerHTML='<option value="All">All eras</option>'+allowed.map(era=>`<option value="${era.id}">${era.name} · ${era.years}</option>`).join('');
    select.value=current;
  }

  function belongsToEra(name,era){
    if(!era)return true;
    return DATA.eraIdsFor?.(name)?.includes(era.id)===true;
  }

  function parseOvr(row){
    const match=String(row.querySelector('.score')?.textContent||'').match(/\d+/);
    return match?Number(match[0]):0;
  }

  function setRowVisible(row,show){
    row.hidden=!show;
    row.classList.toggle('era-filtered-out',!show);
    if(show)row.style.removeProperty('display');
    else row.style.setProperty('display','none','important');
  }

  function updateKpis(view,visibleRows,era){
    const target=document.getElementById(view==='women'?'womenStats':'menStats');
    if(!target)return;
    const avg=visibleRows.length?Math.round(visibleRows.reduce((sum,row)=>sum+parseOvr(row),0)/visibleRows.length):0;
    const top=visibleRows[0]?.dataset.fighter||'—';
    target.innerHTML=era?`
      <div class="kpi"><span>${visibleRows.length}</span><small>fighters shown</small></div>
      <div class="kpi"><span>${top}</span><small>highest all-time rank</small></div>
      <div class="kpi"><span>${visibleRows.length?avg:'—'}</span><small>average OVR</small></div>
    `:`
      <div class="kpi"><span>${visibleRows.length}</span><small>fighters</small></div>
      <div class="kpi"><span>${top}</span><small>current #1</small></div>
      <div class="kpi"><span>${visibleRows.length?avg:'—'}</span><small>average OVR</small></div>
    `;
  }

  function hideContext(target){
    if(!target)return;
    target.innerHTML='';
    target.hidden=true;
    target.style.setProperty('display','none','important');
  }

  function renderContext(view,era){
    const target=document.getElementById(view==='women'?'womenEraContext':'menEraContext');
    if(!target)return;
    if(!era){
      hideContext(target);
      return;
    }
    const fight=view==='men'?`
      <div class="era-context-fight">
        <span>Defining fight</span>
        <strong>${era.definingFight}</strong>
        ${era.fightNote?`<small class="era-context-fight-note">${era.fightNote}</small>`:''}
        <a href="${era.fightUrl}" target="_blank" rel="noopener">Watch Fight</a>
      </div>`:'';
    target.className=`era-context${view==='women'?' women-era-context':''}`;
    target.innerHTML=`
      <div class="era-context-copy">
        <span class="era-context-kicker">UFC history filter</span>
        <div class="era-context-heading"><h3>${era.name}</h3><b>${era.years}</b></div>
        <p>${era.description}</p>
      </div>
      ${fight}
    `;
    target.hidden=false;
    target.style.removeProperty('display');
  }

  function filterBoard(view,era){
    const list=document.getElementById(view==='women'?'womenList':'menList');
    if(!list)return [];
    const existingNotice=list.querySelector('.era-empty-notice');
    const rows=[...list.querySelectorAll('.fighter-row')];
    const visible=[];

    rows.forEach(row=>{
      const show=!era||belongsToEra(row.dataset.fighter,era);
      setRowVisible(row,show);
      if(show)visible.push(row);
    });

    if(era&&visible.length===0){
      const notice=existingNotice||document.createElement('div');
      notice.className='notice era-empty-notice';
      notice.textContent='No ranked fighters are assigned to this era.';
      if(!existingNotice)list.appendChild(notice);
    }else{
      existingNotice?.remove();
    }
    return visible;
  }

  function apply(){
    if(applying)return;
    applying=true;
    try{
      ['men','women'].forEach(view=>{
        const era=eraForView(view);
        const visible=filterBoard(view,era);
        renderContext(view,era);
        updateKpis(view,visible,era);
      });
      syncControlVisibility();
    }finally{
      applying=false;
    }
  }

  function scheduleApply(delay=0){
    window.clearTimeout(applyTimer);
    if(delay===0)window.requestAnimationFrame(apply);
    applyTimer=window.setTimeout(apply,delay||80);
  }

  function syncControlVisibility(){
    const view=activeView();
    select.style.display=(view==='men'||view==='women')?'':'none';
  }

  populateForView('men');
  syncControlVisibility();
  scheduleApply();

  select.addEventListener('change',()=>{
    const view=activeView();
    if(view==='men'||view==='women')selectionByView[view]=select.value;
    apply();
    scheduleApply(100);
  });

  search?.addEventListener('input',()=>scheduleApply(30));

  reset?.addEventListener('click',()=>{
    const view=activeView();
    if(view==='men'||view==='women')selectionByView[view]='All';
    populateForView(view);
    apply();
    scheduleApply(100);
  });

  document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
    window.requestAnimationFrame(()=>{
      populateForView(activeView());
      syncControlVisibility();
      apply();
    });
  }));

  window.addEventListener('ufc-scoring-pipeline-ready',()=>scheduleApply(0));
  window.addEventListener('ufc-production-ranking-ready',()=>scheduleApply(0));

  ['menList','womenList'].forEach(id=>{
    const list=document.getElementById(id);
    if(!list)return;
    new MutationObserver(mutations=>{
      if(applying)return;
      if(mutations.some(mutation=>mutation.type==='childList'))scheduleApply(20);
    }).observe(list,{childList:true});
  });

  window.UFC_ERA_FILTER={
    version:'era-filter-20260715f-expanded-copy',
    apply,
    belongsToEra,
    selectedEra,
    erasForView
  };
})();