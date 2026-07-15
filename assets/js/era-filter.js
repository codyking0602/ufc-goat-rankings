(function(){
  'use strict';

  const DATA=window.UFC_ERA_FILTER_DATA;
  const select=document.getElementById('eraFilter');
  const search=document.getElementById('search');
  const reset=document.getElementById('resetBtn');
  if(!DATA||!select)return;

  const currentYear=new Date().getFullYear();
  let applyTimer=0;

  function activeView(){
    return document.querySelector('.tab.active')?.dataset.view||'men';
  }

  function selectedEra(){
    return DATA.byId[select.value]||null;
  }

  function populate(){
    select.innerHTML='<option value="All">All eras</option>'+DATA.eras.map(era=>`<option value="${era.id}">${era.name} · ${era.years}</option>`).join('');
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
    const start=Number(String(ledger?.window?.start||'').slice(0,4));
    const end=ledger?.window?.end?Number(String(ledger.window.end).slice(0,4)):currentYear;
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

  function updateKpis(view,visibleRows){
    const target=document.getElementById(view==='women'?'womenStats':'menStats');
    if(!target)return;
    if(!selectedEra())return;
    const avg=visibleRows.length?Math.round(visibleRows.reduce((sum,row)=>sum+parseOvr(row),0)/visibleRows.length):0;
    const top=visibleRows[0]?.dataset.fighter||'—';
    target.innerHTML=`
      <div class="kpi"><span>${visibleRows.length}</span><small>fighters shown</small></div>
      <div class="kpi"><span>${top}</span><small>highest all-time rank</small></div>
      <div class="kpi"><span>${visibleRows.length?avg:'—'}</span><small>average OVR</small></div>
    `;
  }

  function renderContext(view,era,count,isLoading){
    const target=document.getElementById(view==='women'?'womenEraContext':'menEraContext');
    if(!target)return;
    if(!era){
      target.hidden=true;
      target.innerHTML='';
      return;
    }
    const fight=view==='men'?`
      <div class="era-context-fight">
        <span>Defining fight</span>
        <strong>${era.definingFight}</strong>
        ${era.fightUrl?`<a href="${era.fightUrl}" target="_blank" rel="noopener">Watch Fight</a>`:'<small>Watch link coming later</small>'}
      </div>`:'';
    target.classList.toggle('women-era-context',view==='women');
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
  }

  function apply(){
    const view=activeView();
    syncControlVisibility();
    if(view!=='men'&&view!=='women')return;
    const era=selectedEra();
    const list=document.getElementById(view==='women'?'womenList':'menList');
    if(!list)return;

    list.querySelector('.era-empty-notice')?.remove();
    const rows=[...list.querySelectorAll('.fighter-row')];
    const loading=Boolean(era)&&!historyReady();
    const visible=[];

    rows.forEach(row=>{
      const show=!era||(!loading&&belongsToEra(row.dataset.fighter,era));
      row.hidden=!show;
      row.classList.toggle('era-filtered-out',!show);
      if(show)visible.push(row);
    });

    if(era&&visible.length===0){
      const notice=document.createElement('div');
      notice.className='notice era-empty-notice';
      notice.textContent=loading?'Era history is still loading. Try again in a moment.':'No ranked fighters match this era and search.';
      list.appendChild(notice);
    }

    renderContext(view,era,visible.length,loading);
    updateKpis(view,visible);
  }

  function scheduleApply(){
    window.clearTimeout(applyTimer);
    window.requestAnimationFrame(apply);
    applyTimer=window.setTimeout(apply,120);
  }

  function syncControlVisibility(){
    const view=activeView();
    select.style.display=(view==='men'||view==='women')?'':'none';
  }

  populate();
  syncControlVisibility();
  scheduleApply();

  select.addEventListener('change',()=>{
    if(typeof window.refresh==='function')window.refresh();
    scheduleApply();
  });
  search?.addEventListener('input',scheduleApply);
  reset?.addEventListener('click',()=>{
    select.value='All';
    scheduleApply();
  });
  document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',scheduleApply));
  window.addEventListener('ufc-scoring-pipeline-ready',scheduleApply);
  window.addEventListener('ufc-production-ranking-ready',scheduleApply);

  window.UFC_ERA_FILTER={
    version:'era-filter-20260715a',
    apply,
    belongsToEra,
    selectedEra
  };
})();
