// Division Rankings: UFC-only division boards derived automatically from canonical fight ledgers.
(function(){
  'use strict';
  const DATA=window.RANKING_DATA;
  const VERSION='division-rankings-20260715a-canonical-ledger-auto';
  if(!DATA||typeof DISPLAY_OVERRIDES==='undefined')return;

  const DIVISION_ORDER=['Heavyweight','Light Heavyweight','Middleweight','Welterweight','Lightweight','Featherweight','Bantamweight','Flyweight'];
  const CANONICAL_DIVISIONS={
    'heavyweight':'Heavyweight','light heavyweight':'Light Heavyweight','middleweight':'Middleweight','welterweight':'Welterweight','lightweight':'Lightweight','featherweight':'Featherweight','bantamweight':'Bantamweight','flyweight':'Flyweight',
    'lhw':'Light Heavyweight','hw':'Heavyweight','mw':'Middleweight','ww':'Welterweight','lw':'Lightweight','fw':'Featherweight','bw':'Bantamweight','flw':'Flyweight'
  };
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n||0)));
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const clean=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const canonicalDivisionName=value=>CANONICAL_DIVISIONS[clean(value)]||String(value||'').trim();
  const el=id=>document.getElementById(id);

  function injectCss(){
    const existing=document.getElementById('division-rankings-css');if(existing)existing.remove();
    const style=document.createElement('style');style.id='division-rankings-css';style.textContent=`
      .division-leader-shell{display:grid;gap:14px;margin-bottom:18px}.division-leader-controls{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:center}.division-leader-pill{border:1px solid var(--line);background:var(--panel);color:var(--text);padding:10px 12px;border-radius:999px;cursor:pointer;font-weight:850;line-height:1.1;min-height:42px;text-align:center}.division-leader-pill.active{background:var(--accent2);border-color:var(--accent2);color:#111827}.division-leader-summary{border:1px solid rgba(250,204,21,.28);background:rgba(18,23,34,.94);border-radius:16px;padding:12px 14px;color:var(--text);line-height:1.38}.division-leader-summary strong{color:var(--accent2)}.division-row{grid-template-columns:54px 64px minmax(0,1fr)!important}.division-row .resume-tag,.division-row .score,.division-row .division-score,.division-row .watch-moment-link{display:none!important}.division-context{margin-top:6px;color:var(--muted);font-size:12px;line-height:1.35}@media(max-width:1100px){.division-leader-controls{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:900px){.division-leader-controls{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.division-leader-pill{width:100%;min-width:0;min-height:40px;padding:9px 10px;font-size:12px}.division-leader-summary{font-size:13px;padding:11px 12px}.division-row{grid-template-columns:34px 58px minmax(0,1fr)!important}}`;
    document.head.appendChild(style);
  }
  function full(row){if(typeof fullRow==='function')return fullRow(row);const profile=(DATA.fighters||[]).find(f=>f.fighter===row.fighter)||{};return{...profile,...row};}
  function allRows(){return (DATA.men||[]).map(full).filter(f=>f.gender!=='Women');}
  function recordFor(fighter){return window.UFC_CANONICAL_FIGHTER_FACTS?.get?.(fighter)||null;}
  function phaseFor(record,index){const fights=record?.fights||[];const start=fights.findIndex(f=>f.id===record?.primeWindow?.startFightId);const end=record?.primeWindow?.open?fights.length-1:fights.findIndex(f=>f.id===record?.primeWindow?.endFightId);if(start<0)return'pre-prime';if(index<start)return'pre-prime';if(end>=start&&index>end)return'post-prime';return'prime';}
  function fightWeight(fight,phase){
    if(!fight||fight.officialResult==='no-contest'||fight.scoringDisposition==='excluded-no-contest')return 0;
    const quality={none:0,minimal:.1,'name-value':.25,solid:.45,ranked:.65,'top-ten':.85,'top-five':1,'champion-level':1.25}[fight.opponentContext?.qualityTier]||0;
    const title=fight.championshipContext?.type&&fight.championshipContext.type!=='none'?1.5:0;
    const win=fight.scoringDisposition==='count-win'?0.35:0;
    const prime=phase==='prime'?0.5:phase==='post-prime'?-0.15:0;
    return Math.max(.35,1+(quality*1.5)+title+win+prime);
  }
  function divisionLedger(fighter){
    const record=recordFor(fighter);const totals={};let totalWeight=0;let totalFights=0;
    (record?.fights||[]).forEach((fight,index)=>{const division=canonicalDivisionName(fight.division);if(!DIVISION_ORDER.includes(division))return;const weight=fightWeight(fight,phaseFor(record,index));if(weight<=0)return;totals[division]||(totals[division]={division,weight:0,fights:0,wins:0,titleFights:0});const row=totals[division];row.weight+=weight;row.fights+=1;row.wins+=fight.scoringDisposition==='count-win'?1:0;row.titleFights+=fight.championshipContext?.type&&fight.championshipContext.type!=='none'?1:0;totalWeight+=weight;totalFights+=1;});
    Object.values(totals).forEach(row=>{row.share=totalWeight?row.weight/totalWeight:0;});
    return{fighter,totalWeight,totalFights,divisions:totals};
  }
  function divisionEntry(fighter,division){return divisionLedger(fighter).divisions[canonicalDivisionName(division)]||null;}
  function divisionScoreParts(f,division){const entry=divisionEntry(f.fighter,division);const share=entry?.share||0;const overall=num(f.totalScore);const sampleConfidence=entry?clamp(entry.fights/5,.35,1):0;const score=overall*share*(.82+(.18*sampleConfidence));return{score,share,sampleConfidence,fights:entry?.fights||0,wins:entry?.wins||0,titleFights:entry?.titleFights||0,weight:entry?.weight||0,owner:'canonical-fight-ledger'};}
  function divisionRows(division){const target=canonicalDivisionName(division);return allRows().filter(f=>divisionEntry(f.fighter,target)).sort((a,b)=>divisionScoreParts(b,target).score-divisionScoreParts(a,target).score||num(b.totalScore)-num(a.totalScore));}
  function availableDivisions(){return DIVISION_ORDER.filter(d=>divisionRows(d).length);}
  function divisionRank(f,division){return divisionRows(division).findIndex(row=>row.fighter===f.fighter)+1;}
  function thumb(f){const url=DISPLAY_OVERRIDES[f.fighter]?.thumbUrl||DISPLAY_OVERRIDES[f.fighter]?.photoUrl||'';const initials=String(f.fighter||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();return `<div class="row-photo">${url?`<img src="${url}" alt="${f.fighter} thumbnail" loading="lazy">`:initials}</div>`;}
  function roleTag(f,division){const p=divisionScoreParts(f,division);const share=Math.round(p.share*100);const title=p.titleFights?` · ${p.titleFights} title fight${p.titleFights===1?'':'s'}`:'';return `${p.fights} UFC fight${p.fights===1?'':'s'} here · ${share}% of scored résumé${title}`;}
  function rowHtml(f,division){const divisions=`${f.primaryDivision||''}${f.secondaryDivision?' / '+f.secondaryDivision:''}`;return `<article class="row fighter-row division-row" data-fighter="${f.fighter}"><div class="rank">#${divisionRank(f,division)}</div>${thumb(f)}<div class="row-main"><div class="name">${f.fighter}</div><div class="meta">Overall #${f.rank||'—'} · ${f.ufcRecord||''}${divisions?' · '+divisions:''}</div><div class="division-context">${roleTag(f,division)}</div></div></article>`;}
  function normalizeDivisionSelect(){const select=el('divisionFilter');if(!select)return;const divisions=availableDivisions();const signature=`${VERSION}|${divisions.join('|')}|${allRows().length}`;if(select.dataset.menDivisionOrder===signature)return;const current=select.value;select.innerHTML='<option value="All">All divisions</option>';divisions.forEach(d=>{const option=document.createElement('option');option.value=d;option.textContent=d;select.appendChild(option);});select.value=divisions.includes(current)?current:'All';select.dataset.menDivisionOrder=signature;}
  function controls(active){return `<div class="division-leader-controls">${availableDivisions().map(d=>`<button type="button" class="division-leader-pill ${d===active?'active':''}" data-division-pick="${d}">${d}</button>`).join('')}</div>`;}
  function setHeading(title,copy){const section=document.querySelector('#division .section-title');if(!section)return;const h2=section.querySelector('h2');const p=section.querySelector('p');if(h2)h2.textContent=title;if(p)p.textContent=copy||'';}
  function renderShell(active,inner=''){const selected=active==='All'?'':active;const rows=selected?divisionRows(selected):[];const summary=selected?`<strong>${selected} · Men</strong><br>Automatically ranked from each fighter’s canonical UFC fights in this division. Showing ${rows.length} fighters.`:'<strong>Pick a division</strong><br>Division membership and résumé share update automatically from the UFC fight ledger.';el('divisionList').innerHTML=`<div class="division-leader-shell">${controls(selected)}<div class="division-leader-summary">${summary}</div>${inner}</div>`;document.querySelectorAll('[data-division-pick]').forEach(button=>button.addEventListener('click',()=>{el('divisionFilter').value=button.dataset.divisionPick;window.renderDivision();}));}
  window.renderDivision=function(){injectCss();normalizeDivisionSelect();const division=el('divisionFilter')?.value||'All';if(division==='All'){setHeading('Division Boards','See the top fighters by division.');renderShell('All');return;}const rows=divisionRows(division);setHeading(`${division} Rankings`,'Calculated automatically from UFC fight-level division history.');renderShell(division,`<div class="leaderboard">${rows.map(row=>rowHtml(row,division)).join('')||'<div class="notice">No fighters are loaded for this division yet.</div>'}</div>`);document.querySelectorAll('#divisionList .fighter-row').forEach(row=>row.addEventListener('click',()=>openFighter(row.dataset.fighter)));};
  window.UFC_DIVISION_RANKINGS={version:VERSION,mode:'canonical-ledger-automatic',divisionOrder:DIVISION_ORDER,ledgerFor:divisionLedger,entryFor:divisionEntry,rowsFor:divisionRows,scoreParts:divisionScoreParts,render:window.renderDivision};
  window.addEventListener?.('ufc-scoring-pipeline-ready',()=>window.renderDivision());
  window.renderDivision();
})();
