// Presentation-only helpers for calculated category ranks, Apex Peak, and category boards.
(function(){
  'use strict';
  if(!window.RANKING_DATA)return;

  const VERSION='calculated-score-ui-20260714a-presentation-only';
  const DATA=window.RANKING_DATA;
  const APEX_MAX=6;
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function apexAuditFor(fighter){
    return fighter?.apexPeakAudit||window.DISPLAY_OVERRIDES?.[fighter?.fighter]?.apexPeakAudit||null;
  }
  function apexValue(fighter){return num(fighter?.apexPeak??fighter?.apexPeakBonus);}
  function apexWinsText(fighter){
    const audit=apexAuditFor(fighter);
    const wins=(audit?.performances||[]).map(performance=>`${performance.label}${performance.date?' '+String(performance.date).slice(0,4):''}`);
    return wins.length?wins.join(' + '):(audit?.window||'Peak performances calculated from the canonical model');
  }
  function apexWhatItProved(fighter){
    const audit=apexAuditFor(fighter);
    return audit?.front?.proved||audit?.notes||'The strongest two-performance snapshot of this fighter at UFC level.';
  }
  function apexHowItFelt(fighter){
    const audit=apexAuditFor(fighter);
    if(audit?.front?.felt)return audit.front.felt;
    const aura=num(audit?.components?.aura??audit?.components?.cleanApexAura);
    const claim=num(audit?.components?.bestFighterClaim??audit?.components?.peakStatus);
    if(aura>=.70)return'Felt scary, iconic, and almost impossible to solve.';
    if(claim>=1.10)return'Felt like a real best-in-the-world peak.';
    if(aura>=.45)return'Felt dangerous, memorable, and clearly title-level.';
    return'Felt like a strong peak without the cleanest all-time aura.';
  }

  function ensureApexCategory(){
    if(typeof CATEGORY_INFO==='undefined'||!Array.isArray(CATEGORY_INFO))return;
    const entry=['apexPeak','Apex Peak','Best two-performance UFC peak, applied as a positive bonus after the weighted base'];
    const existing=CATEGORY_INFO.find(item=>item[0]==='apexPeak');
    if(existing){existing[1]=entry[1];existing[2]=entry[2];return;}
    const penaltyIndex=CATEGORY_INFO.findIndex(item=>item[0]==='penalty');
    if(penaltyIndex>=0)CATEGORY_INFO.splice(penaltyIndex,0,entry);else CATEGORY_INFO.push(entry);
  }

  if(typeof categoryChipGrid==='function'){
    categoryChipGrid=function(fighter){
      return `<div class="category-chips">
        ${categoryChip(fighter,'championship')}
        ${categoryChip(fighter,'opponentQuality')}
        ${categoryChip(fighter,'primeDominance')}
        ${categoryChip(fighter,'longevity')}
        ${categoryChip(fighter,'apexPeak')}
        ${categoryChip(fighter,'penalty')}
      </div>`;
    };
  }

  const baseCategoryLogicSentence=typeof categoryLogicSentence==='function'?categoryLogicSentence:null;
  if(baseCategoryLogicSentence){
    categoryLogicSentence=function(fighter,key){
      if(key==='apexPeak')return'Apex Peak rewards the fighter’s strongest two-performance UFC snapshot: performance quality, proof, best-fighter claim, and aura.';
      return baseCategoryLogicSentence(fighter,key);
    };
  }

  const baseCategoryEvidenceItems=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;
  if(baseCategoryEvidenceItems){
    categoryEvidenceItems=function(fighter,key){
      if(key==='apexPeak')return[
        ['Apex bonus',`+${apexValue(fighter).toFixed(2)}`],
        ['Apex wins',apexWinsText(fighter)],
        ['What it proved',apexWhatItProved(fighter)],
        ['How it felt',apexHowItFelt(fighter)]
      ];
      return baseCategoryEvidenceItems(fighter,key);
    };
  }

  function categoryOptions(){return typeof CATEGORY_INFO!=='undefined'&&Array.isArray(CATEGORY_INFO)?CATEGORY_INFO:[];}
  function selectedCategory(){return document.getElementById('categoryBoardSelect')?.value||'apexPeak';}
  function categoryRows(rows,key){
    return rows.map(fullRow).sort((a,b)=>categoryValueForRank(b,key)-categoryValueForRank(a,key)||num(b.totalScore)-num(a.totalScore)||String(a.fighter).localeCompare(String(b.fighter)));
  }
  function categoryBoard(title,rows,key){
    const info=categoryOptions().find(([category])=>category===key)||[key,key,''];
    const label=info[1];
    const ranked=categoryRows(rows,key);
    if(key==='apexPeak'){
      return `<div class="card"><h3>${label} · ${title}</h3><p class="meta">Positive peak bonus calculated by the permanent scoring pipeline.</p><div class="leaderboard">${ranked.map((fighter,index)=>`<article class="row fighter-row category-board-card" data-fighter="${fighter.fighter}"><div class="rank">#${index+1}</div>${rowPhoto(fighter)}<div class="row-main"><div class="name">${fighter.fighter}</div><div class="meta">Overall #${fighter.rank||'—'} · GOAT ${num(fighter.totalScore).toFixed(2)} · Apex +${apexValue(fighter).toFixed(2)}</div><div class="resume-tag">${apexWinsText(fighter)}</div></div><div class="score"><strong>${categoryOvr(fighter,key)}</strong><span class="meta">PCTL</span></div></article>`).join('')}</div></div>`;
    }
    return `<div class="card"><h3>${title} · ${label}</h3><table class="table"><thead><tr><th>Rank</th><th>Fighter</th><th>Raw</th><th>PCTL</th><th>GOAT Score</th></tr></thead><tbody>${ranked.map((fighter,index)=>`<tr class="category-board-row" data-fighter="${fighter.fighter}"><td>#${index+1}</td><td>${fighter.fighter}</td><td>${num(categoryValueForRank(fighter,key)).toFixed(2)}</td><td>${categoryOvr(fighter,key)}</td><td>${num(fighter.totalScore).toFixed(2)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  window.renderCategories=function renderCategories(){
    ensureApexCategory();
    const target=document.getElementById('categoryBoardList');
    const select=document.getElementById('categoryBoardSelect');
    if(!target||!select)return;
    const key=selectedCategory();
    const info=categoryOptions().find(([category])=>category===key)||[key,key,''];
    const intro=key==='apexPeak'
      ?'Apex Peak is a calculated positive bonus after the weighted base score.'
      :`Sorted by ${info[1]}. Raw score is the model input; PCTL is the app-facing category grade.`;
    target.innerHTML=`<div class="notice">${intro}</div>${categoryBoard('Men',DATA.men||[],key)}${categoryBoard('Women',DATA.women||[],key)}`;
    target.querySelectorAll('[data-fighter]').forEach(row=>row.addEventListener('click',()=>openFighter(row.dataset.fighter)));
  };

  function initCategoryBoard(){
    const select=document.getElementById('categoryBoardSelect');
    if(!select)return;
    if(select.dataset.ready!=='true'){
      select.innerHTML='';
      categoryOptions().forEach(([key,label])=>{
        const option=document.createElement('option');option.value=key;option.textContent=label;select.appendChild(option);
      });
      select.dataset.ready='true';
      select.addEventListener('change',window.renderCategories);
    }
    if(!select.value)select.value='apexPeak';
  }

  if(typeof openFighter==='function'){
    const baseOpenFighter=openFighter;
    openFighter=function(name){
      const result=baseOpenFighter(name);
      if(document.getElementById('apexPeakProfileCard'))return result;
      const fighter=fullRow((DATA.men||[]).find(row=>row.fighter===name)||(DATA.women||[]).find(row=>row.fighter===name)||{fighter:name});
      const firstCard=document.querySelector('#fighterDetail .card');
      if(!firstCard)return result;
      const card=document.createElement('div');
      card.className='card';card.id='apexPeakProfileCard';
      card.innerHTML=`<h3>Apex Peak</h3><p><strong>What it means:</strong> The best two-performance UFC peak, calculated as a positive bonus after the weighted base.</p>${snapshotGrid([
        ['Apex bonus','+'+apexValue(fighter).toFixed(2)],
        ['Apex wins',apexWinsText(fighter)],
        ['What it proved',apexWhatItProved(fighter)],
        ['How it felt',apexHowItFelt(fighter)]
      ])}`;
      firstCard.parentNode.insertBefore(card,firstCard);
      return result;
    };
  }

  if(typeof renderRules==='function'){
    const baseRenderRules=renderRules;
    renderRules=function(){
      baseRenderRules();
      const table=document.querySelector('#rulesContent .card table tbody');
      if(table&&!table.querySelector('[data-apex-peak-rule]'))table.insertAdjacentHTML('beforeend','<tr data-apex-peak-rule="true"><td><strong>Apex Peak</strong></td><td>Positive bonus after the weighted base score.</td></tr>');
      if(table&&!table.querySelector('[data-production-formula]'))table.insertAdjacentHTML('beforeend','<tr data-production-formula="true"><td><strong>Overall Formula</strong></td><td>Championship 35% + Quality Wins 25% + Prime Dominance 30% + Longevity 10%, then Apex Peak, Loss Context, and Division-Era Depth.</td></tr>');
    };
  }

  if(typeof refresh==='function'){
    const baseRefresh=refresh;
    refresh=function(){
      ensureApexCategory();
      baseRefresh();
      initCategoryBoard();
      window.renderCategories();
    };
  }

  ensureApexCategory();
  initCategoryBoard();
  if(typeof refresh==='function')refresh();else window.renderCategories();
  window.UFC_SIX_CATEGORY_SCORE_MODEL={version:VERSION,weights:{championship:35,opponentQuality:25,primeDominance:30,longevity:10},apexPeakMax:APEX_MAX,mutatesScores:false,owner:'ranking-pipeline.js'};
  window.UFC_CATEGORY_LEADERS={version:VERSION,render:window.renderCategories,mutatesScores:false};
  document.documentElement.setAttribute('data-six-category-score','calculated-presentation-only');
})();
