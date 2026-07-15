(function(){
  'use strict';

  const DATA=window.UFC_ERA_FILTER_DATA;
  const select=document.getElementById('eraFilter');
  const search=document.getElementById('search');
  const reset=document.getElementById('resetBtn');
  if(!DATA||!select)return;

  const currentYear=new Date().getFullYear();
  let applyTimer=0;
  let applying=false;

  function activeView(){
    return document.querySelector('.tab.active')?.dataset.view||'men';
  }

  function selectedEra(){
    return DATA.byId[select.value]||null;
  }

  function populate(){
    const current=select.value;
    select.innerHTML='<option value="All">All eras</option>'+DATA.eras.map(era=>`<option value="${era.id}">${era.name} · ${era.years}</option>`).join('');
    select.value=DATA.byId[current]?current:'All';
  }

  function ledgerFor(name){
    const source=window.UFC_FIGHTER_ERA_LEDGERS;
    return source?.entryFor?.(name)||source?.ledgers?.[name]||null;
  }

  function rowFor(name){
    const ranking=window.RANKING_DATA||{};
    return [...(ranking.men||[]),...(ranking.women||[]),...(ranking.fighters||[])].find(row=>row?.fighter===name)||null;
  }

  function explicitEraTags(name){
    const row=rowFor(name)||{};
    const fromRow=Array.isArray(row.eraTags)?row.eraTags:Array.isArray(row.eras)?row.eras:[];
    const extra=DATA.extraMembership?.[name]||[];
    return new Set([...fromRow,...extra]);
  }

  function belongsToEra(name,era){
    if(!era)return true;
    if(explicitEraTags(name).has(era.id))return true;
    const ledger=ledgerFor(name);
    const startText=String(ledger?.window?.start||'');
    if(!/^\d{4}/.test(startText))return false;
    const start=Number(startText.slice(0,4));
    const endText=String(ledger?.window?.end||'');
    const end=/^\d{4}/.test(endText)?Number(endText.slice(0,4)):currentYear;
    if(!Number.isFinite(start)||!Number.isFinite(end))return false;
    const eraEnd=era.endYear||currentYear;
    return start<=eraEnd&&end>=era.startYear;
  }

  function historyReady(){
    return Boolean(window.UFC_FIGHTER_ERA_LEDGERS?.fighters?.length);
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

  function renderContext(view,era,count,isLoading){
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
        ${era.fightUrl?`<a href="${era.fightUrl}" target="_blank" rel="noopener">Watch Fight</a>`:'<small>Watch link coming later</small>'}
      </div>`:'';
    target.className=`era-context${view==='women'?' women-era-context':''}`;
    target.innerHTML=`
      <div class="era-context-copy">
        <span class="era-context-kicker">UFC history filter</span>
        <div class="era-context-heading"><h3>${era.name}</h3><b>${era.years}</b></div>
        <p>${era.description}</p>
        <small>${isLoading?'Era history is loading…':`${count} ranked fighter${count===1?'':'s'} shown. All-time rank and OVR stay unchanged.`}</small>
      </div>
      ${fight}
    `;
    target.hidden=false;
    target.style.removeProperty('display');
  }

  function filterBoard(view,era,loading){
    const list=document.getElementById(view==='women'?'womenList':'menList');
    if(!list)return [];
    const existingNotice=list.querySelector('.era-empty-notice');
    const rows=[...list.querySelectorAll('.fighter-row')];
    const visible=[];

    rows.forEach(row=>{
      const show=!era||loading||belongsToEra(row.dataset.fighter,era);
      setRowVisible(row,show);
      if(show)visible.push(row);
    });

    if(era&&!loading&&visible.length===0){
      const notice=existingNotice||document.createElement('div');
      notice.className='notice era-empty-notice';
      notice.textContent='No ranked fighters match this era and search.';
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
      const era=selectedEra();
      const loading=Boolean(era)&&!historyReady();

      // Always update both boards so switching tabs cannot reveal stale era copy or stale rows.
      ['men','women'].forEach(view=>{
        const visible=filterBoard(view,era,loading);
        renderContext(view,era,visible.length,loading);
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

  populate();
  syncControlVisibility();
  scheduleApply();

  select.addEventListener('change',()=>{
    apply();
    scheduleApply(100);
  });
  search?.addEventListener('input',()=>scheduleApply(30));
  reset?.addEventListener('click',()=>{
    select.value='All';
    apply();
    scheduleApply(100);
  });
  document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>scheduleApply(30)));
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
    version:'era-filter-20260715c-stable',
    apply,
    belongsToEra,
    selectedEra
  };
})();
