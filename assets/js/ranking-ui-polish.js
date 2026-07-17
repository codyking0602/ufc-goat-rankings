// Fan-facing presentation polish for category leaders, division boards, and Octagon Verdict.
(function(){
  'use strict';
  if(!window.RANKING_DATA)return;

  const VERSION='ranking-ui-polish-20260717d-division-resume-min';
  const DATA=window.RANKING_DATA;
  const CATEGORY_ORDER=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty'];
  const CATEGORY_COPY={
    championship:{label:'Championship Resume',description:'UFC title-level accomplishment, weighted title wins, and championship control.'},
    opponentQuality:{label:'Opponent Quality Wins',description:'Quality of UFC wins, with extra weight on elite opponents and prime victories.'},
    primeDominance:{label:'Prime Dominance',description:'How strongly a fighter controlled their prime through wins, rounds, finishes, and separation.'},
    longevity:{label:'Elite Longevity',description:'How long a fighter stayed elite in the UFC at a high competitive level.'},
    apexPeak:{label:'Peak Apex',description:'How high a fighter’s best two-performance UFC peak reached.'},
    penalty:{label:'Loss Context',description:'How damaging UFC losses were based on timing, opponent quality, finish context, and circumstance.'}
  };
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const DIVISION_RESUME_SHARE_MIN=10;
  let selectedGender='men';
  let comparePolishQueued=false;

  function ensureCategoryCopy(){
    if(typeof CATEGORY_INFO==='undefined'||!Array.isArray(CATEGORY_INFO))return;
    CATEGORY_ORDER.forEach((key,index)=>{
      const copy=CATEGORY_COPY[key];
      const existing=CATEGORY_INFO.find(item=>item[0]===key);
      if(existing){existing[1]=copy.label;existing[2]=copy.description;return;}
      CATEGORY_INFO.splice(index,0,[key,copy.label,copy.description]);
    });
    CATEGORY_INFO.sort((a,b)=>CATEGORY_ORDER.indexOf(a[0])-CATEGORY_ORDER.indexOf(b[0]));
  }

  function selectedCategory(){
    const value=document.getElementById('categoryBoardSelect')?.value;
    return CATEGORY_ORDER.includes(value)?value:'championship';
  }
  function divisionLabelFor(fighter){
    return [fighter.primaryDivision,fighter.secondaryDivision].filter(Boolean).join(' / ')||fighter.division||'Division not listed';
  }
  function formatNumber(value,digits=1){return Number.isFinite(Number(value))?Number(value).toFixed(digits):'—';}
  function apexWinsText(fighter){
    const audit=fighter?.apexPeakAudit||window.DISPLAY_OVERRIDES?.[fighter?.fighter]?.apexPeakAudit||null;
    const wins=(audit?.performances||[]).map(performance=>`${performance.label}${performance.date?' '+String(performance.date).slice(0,4):''}`);
    return wins.length?wins.join(' + '):(audit?.window||'Best two-performance UFC peak');
  }
  function categoryEvidence(fighter,key){
    if(key==='championship')return `${fighter.titleFightWins??'—'} UFC title-fight wins · ${formatNumber(fighter.adjustedTitleWins,1)} adjusted title-win credit`;
    if(key==='opponentQuality')return `${fighter.topFiveWins??fighter.top5Wins??'—'} Top-5 wins · ${fighter.rankedWins??'—'} ranked wins`;
    if(key==='primeDominance')return `${fighter.primeRecord||'—'} prime UFC record · ${formatNumber(fighter.roundsWonPct,1)}% rounds won · ${formatNumber(fighter.finishRatePct,1)}% finish rate`;
    if(key==='longevity')return `${formatNumber(fighter.activeEliteYears,1)} active elite years · ${fighter.primeRecord||'—'} prime UFC record`;
    if(key==='apexPeak')return `Peak wins: ${apexWinsText(fighter)}`;
    const penalty=typeof lossPenaltyValue==='function'?lossPenaltyValue(fighter):num(fighter.penalty??fighter.lossPenalty);
    if(penalty===0)return'No meaningful UFC loss penalty in the model.';
    const finished=num(fighter.timesFinishedPrime);
    return `${fighter.ufcRecord||'UFC record loaded'} · ${finished} time${finished===1?'':'s'} finished during the counted prime`;
  }
  function filteredCategoryRows(rows,key){
    return rows.map(fullRow).sort((a,b)=>categoryValueForRank(b,key)-categoryValueForRank(a,key)||num(b.totalScore)-num(a.totalScore)||String(a.fighter).localeCompare(String(b.fighter)));
  }
  function categoryRowHtml(fighter,index,key){
    const rankLabel=selectedGender==='women'?`Women #${fighter.rank||'—'}`:`Overall #${fighter.rank||'—'}`;
    return `<article class="row fighter-row category-leader-row" data-fighter="${fighter.fighter}"><div class="rank">#${index+1}</div>${rowPhoto(fighter)}<div class="row-main"><div class="name">${fighter.fighter}</div><div class="meta">${rankLabel} · ${fighter.ufcRecord||'UFC record unavailable'} · ${divisionLabelFor(fighter)}</div><div class="category-leader-evidence">${categoryEvidence(fighter,key)}</div></div></article>`;
  }
  function categoryControls(key){
    return `<div class="category-pill-grid">${CATEGORY_ORDER.map(category=>`<button type="button" class="category-leader-pill ${category===key?'active':''}" data-category-pick="${category}">${CATEGORY_COPY[category].label}</button>`).join('')}</div><div class="category-sex-toggle" role="group" aria-label="Category leaderboard"><button type="button" class="${selectedGender==='men'?'active':''}" data-category-gender="men">Men</button><button type="button" class="${selectedGender==='women'?'active':''}" data-category-gender="women">Women</button></div>`;
  }

  function initCategorySelect(){
    const select=document.getElementById('categoryBoardSelect');
    if(!select)return;
    const current=CATEGORY_ORDER.includes(select.value)?select.value:'championship';
    select.innerHTML='';
    CATEGORY_ORDER.forEach(key=>{const option=document.createElement('option');option.value=key;option.textContent=CATEGORY_COPY[key].label;select.appendChild(option);});
    select.value=current;
    if(select.dataset.polishedCategoryReady!=='true'){
      select.dataset.polishedCategoryReady='true';
      select.addEventListener('change',renderCategoriesPolished);
    }
  }

  function renderCategoriesPolished(){
    ensureCategoryCopy();
    const target=document.getElementById('categoryBoardList');
    const select=document.getElementById('categoryBoardSelect');
    if(!target||!select)return;
    const key=selectedCategory();
    const copy=CATEGORY_COPY[key];
    const rows=filteredCategoryRows(selectedGender==='women'?(DATA.women||[]):(DATA.men||[]),key);
    const genderLabel=selectedGender==='women'?'Women':'Men';
    const section=document.querySelector('#categories .section-title');
    setText(section?.querySelector('h2'),'Category Leaders');
    setText(section?.querySelector('p'),'See who leads each scoring category.');
    target.innerHTML=`<div class="category-leader-shell">${categoryControls(key)}<div class="category-leader-summary"><strong>${copy.label} · ${genderLabel}</strong><br>${copy.description} Showing ${rows.length} fighters.</div><div class="leaderboard category-leader-list">${rows.map((fighter,index)=>categoryRowHtml(fighter,index,key)).join('')||'<div class="notice">No fighters available.</div>'}</div></div>`;
    target.querySelectorAll('[data-category-pick]').forEach(button=>button.addEventListener('click',()=>{select.value=button.dataset.categoryPick;renderCategoriesPolished();}));
    target.querySelectorAll('[data-category-gender]').forEach(button=>button.addEventListener('click',()=>{selectedGender=button.dataset.categoryGender;renderCategoriesPolished();}));
    target.querySelectorAll('[data-fighter]').forEach(row=>row.addEventListener('click',()=>openFighter(row.dataset.fighter)));
    normalizeResumeText(target);
  }

  function polishedDivisionRow(row,index){
    const override=window.DISPLAY_OVERRIDES?.[row.fighter]||{};
    const url=override.thumbUrl||override.photoUrl||'';
    const initials=String(row.fighter||'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
    const role=row.role==='primary'?'Primary UFC division':row.role==='secondary'?'Second-division resume':'Crossover resume';
    return `<article class="row fighter-row division-row division-row-polished" data-fighter="${row.fighter}"><div class="rank">#${index+1}</div><div class="row-photo">${url?`<img src="${url}" alt="${row.fighter} thumbnail" loading="lazy">`:initials}</div><div class="row-main"><div class="name">${row.fighter}</div><div class="meta">${row.stats.ufcRecord} UFC · Overall #${row.overallRank||'—'}</div><div class="division-context">${role} · ${Math.round(row.resumeSharePct)}% of UFC resume</div></div></article>`;
  }
  function divisionControls(report,active){
    const label=division=>window.UFC_DIVISION_RANKING_PIPELINE?.divisionLabel?.(division)||division;
    return `<div class="division-leader-controls">${Object.keys(report.boards||{}).map(division=>`<button type="button" class="division-leader-pill ${division===active?'active':''}" data-division-pick="${division}">${label(division)}</button>`).join('')}</div>`;
  }
  function renderDivisionPolished(){
    const pipeline=window.UFC_DIVISION_RANKING_PIPELINE;
    const report=pipeline?.latest?.status==='ready'?pipeline.latest:pipeline?.rebuild?.();
    const target=document.getElementById('divisionList');
    const select=document.getElementById('divisionFilter');
    if(!target||!select||!report?.passed)return report;
    const divisions=Object.keys(report.boards||{});
    if(!divisions.includes(select.value)&&select.value!=='All')select.value='All';
    const active=select.value;
    const section=document.querySelector('#division .section-title');
    if(active==='All'||!report.boards?.[active]){
      setText(section?.querySelector('h2'),'Division Rankings');
      setText(section?.querySelector('p'),'UFC-only rankings within each division.');
      target.innerHTML=`<div class="division-leader-shell">${divisionControls(report,'')}<div class="division-leader-summary"><strong>Pick a division</strong><br>Choose a weight class to see its UFC-only all-time ranking.</div></div>`;
    }else{
      const rows=report.boards[active].filter(row=>num(row.resumeSharePct)>=DIVISION_RESUME_SHARE_MIN);
      const label=pipeline.divisionLabel?.(active)||active;
      setText(section?.querySelector('h2'),`${label} Rankings`);
      setText(section?.querySelector('p'),'UFC-only divisional resume, ranked within the division.');
      target.innerHTML=`<div class="division-leader-shell">${divisionControls(report,active)}<div class="division-leader-summary"><strong>${label} · Men</strong><br>${rows.length} fighters qualified with at least ${DIVISION_RESUME_SHARE_MIN}% of their UFC resume in this division.</div><div class="leaderboard">${rows.map(polishedDivisionRow).join('')}</div></div>`;
    }
    target.querySelectorAll('[data-division-pick]').forEach(button=>button.addEventListener('click',()=>{select.value=button.dataset.divisionPick;renderDivisionPolished();}));
    target.querySelectorAll('[data-fighter]').forEach(node=>node.addEventListener('click',()=>openFighter(node.dataset.fighter)));
    normalizeResumeText(target);
    return report;
  }
  function installDivisionPolish(){
    if(!window.UFC_DIVISION_RANKING_PIPELINE||!window.UFC_DIVISION_RANKINGS)return false;
    const style=document.getElementById('ranking-ui-polish-css');
    if(style)document.head.appendChild(style);
    window.UFC_DIVISION_RANKINGS.render=renderDivisionPolished;
    window.renderDivision=renderDivisionPolished;
    renderDivisionPolished();
    return true;
  }

  function setText(node,value){if(node&&node.textContent!==value)node.textContent=value;}
  function polishCompare(){
    const section=document.querySelector('#compare .section-title');
    setText(section?.querySelector('h2'),'Octagon Verdict');
    setText(section?.querySelector('p'),'Compare two fighters across category edges, UFC resume strength, and the final verdict.');
    const launcher=document.getElementById('octagonVerdictLauncher');
    if(!launcher)return;
    launcher.querySelector('.ov-download-btn')?.remove();
    const copy=launcher.querySelector('.ov-copy-btn');
    const open=launcher.querySelector('.ov-open-btn');
    const row=launcher.querySelector('.ov-cta-row');
    setText(copy,'Copy Matchup');
    setText(open,'Open Octagon Verdict');
    if(copy){copy.style.setProperty('background','#fff','important');copy.style.setProperty('border-color','#e5e7eb','important');copy.style.setProperty('color','#111827','important');}
    if(open){open.style.setProperty('background','#f97316','important');open.style.setProperty('border-color','#f97316','important');open.style.setProperty('color','#111827','important');}
    if(row&&open&&copy&&(row.children[0]!==open||row.children[1]!==copy||row.children.length!==2))row.append(open,copy);
    setText(launcher.querySelector('.ov-action-card > .meta'),'Compare their UFC resumes, category edges, and final verdict.');
    normalizeResumeText(launcher);
  }
  function scheduleComparePolish(){
    if(comparePolishQueued)return;
    comparePolishQueued=true;
    window.requestAnimationFrame(()=>{comparePolishQueued=false;polishCompare();});
  }

  function syncToolbarPolish(){
    const view=document.querySelector('.tab.active')?.dataset.view||'men';
    const toolbar=document.querySelector('.toolbar');
    const search=document.getElementById('search');
    const era=document.getElementById('eraFilter');
    const division=document.getElementById('divisionFilter');
    const showToolbar=view==='men'||view==='women';
    if(toolbar)toolbar.style.display=showToolbar?'':'none';
    if(search)search.style.display=showToolbar?'':'none';
    if(era)era.style.display=showToolbar?'':'none';
    if(division)division.style.display='none';
  }

  function normalizeResumeText(root){
    if(!root)return;
    const replace=value=>String(value||'').replace(/résumé/g,'resume').replace(/Résumé/g,'Resume').replace(/RÉSUMÉ/g,'RESUME');
    if(root.nodeType===Node.TEXT_NODE){root.nodeValue=replace(root.nodeValue);return;}
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){const next=replace(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;}
    root.querySelectorAll?.('[aria-label],[title],[placeholder]').forEach(element=>['aria-label','title','placeholder'].forEach(attribute=>{if(element.hasAttribute(attribute))element.setAttribute(attribute,replace(element.getAttribute(attribute)));}));
  }

  function installStyles(){
    if(document.getElementById('ranking-ui-polish-css'))return;
    const style=document.createElement('style');
    style.id='ranking-ui-polish-css';
    style.textContent=`#categories>.compare-controls{display:none!important}#categoryBoardList.rules-grid{display:block!important}.category-leader-shell{display:grid;gap:14px;padding-bottom:28px}.category-pill-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.category-leader-pill,.category-sex-toggle button{min-height:48px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--text);font-weight:900;cursor:pointer;padding:10px 14px}.category-leader-pill.active,.category-sex-toggle button.active{background:var(--accent2);border-color:var(--accent2);color:#111827}.category-sex-toggle{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.category-leader-summary,.division-leader-summary{border:1px solid rgba(250,204,21,.42)!important;background:rgba(18,23,34,.94)!important;border-radius:18px!important;padding:14px 16px!important;color:var(--text)!important;line-height:1.42}.category-leader-summary strong,.division-leader-summary strong{color:#fde047;font-size:1.02rem}.category-leader-row{grid-template-columns:54px 72px minmax(0,1fr)!important;align-items:center}.category-leader-row .row-main,.division-row-polished .row-main{min-width:0}.category-leader-evidence,.division-context{margin-top:6px;color:var(--muted);font-size:13px;line-height:1.35}.division-row-polished{grid-template-columns:54px 72px minmax(0,1fr)!important;align-items:center}.division-row-polished .canonical-division-score,.division-row-polished .score{display:none!important}.ov-cta-row .ov-open-btn{background:#f97316!important;border-color:#f97316!important;color:#111827!important}.ov-cta-row .ov-copy-btn{background:#fff!important;border-color:#e5e7eb!important;color:#111827!important}@media(max-width:900px){.category-pill-grid{gap:8px}.category-leader-pill{min-height:54px;padding:9px 10px;font-size:.9rem;line-height:1.15}.category-leader-row,.division-row-polished{grid-template-columns:42px 64px minmax(0,1fr)!important}.category-leader-evidence,.division-context{font-size:12px}}`;
    document.head.appendChild(style);
  }

  function install(){
    installStyles();
    ensureCategoryCopy();
    initCategorySelect();
    window.renderCategories=renderCategoriesPolished;
    if(window.UFC_CATEGORY_LEADERS)window.UFC_CATEGORY_LEADERS.render=renderCategoriesPolished;
    renderCategoriesPolished();
    normalizeResumeText(document.body);
    syncToolbarPolish();
    scheduleComparePolish();
    document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>window.setTimeout(()=>{
      syncToolbarPolish();
      if(button.dataset.view==='categories')renderCategoriesPolished();
      if(button.dataset.view==='division')renderDivisionPolished();
      if(button.dataset.view==='compare')scheduleComparePolish();
      normalizeResumeText(document.body);
    },0)));
    const observer=new MutationObserver(mutations=>{mutations.forEach(mutation=>mutation.addedNodes.forEach(node=>normalizeResumeText(node)));scheduleComparePolish();});
    observer.observe(document.body,{childList:true,subtree:true});
  }

  window.addEventListener?.('ufc-scoring-pipeline-ready',()=>window.setTimeout(()=>{installDivisionPolish();renderCategoriesPolished();scheduleComparePolish();},0));
  window.addEventListener?.('ufc-production-ranking-ready',()=>window.setTimeout(()=>{installDivisionPolish();renderCategoriesPolished();scheduleComparePolish();normalizeResumeText(document.body);},0));

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.UFC_RANKING_UI_POLISH={version:VERSION,renderCategories:renderCategoriesPolished,renderDivision:renderDivisionPolished,polishCompare,normalizeResumeText};
})();
