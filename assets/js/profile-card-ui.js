// Canonical public fighter-profile UI behavior.
// Owns compact category copy, profile interaction polish, and representative QA.
(function(){
  'use strict';

  const VERSION='profile-card-ui-20260711b-canonical';
  const STYLE_VERSION='profile-card-css-20260711a-canonical';
  const CATEGORY_CARD_COPY={
    championship:'Title wins, reign strength, division control',
    opponentQuality:'Who they beat, when, and division strength',
    primeDominance:'Rounds, finishes, separation, durability',
    longevity:'Active elite UFC years, not calendar padding',
    apexPeak:'Best two-win stretch: performance, proof, peak',
    penalty:'Losses adjusted for timing, opponent, finish, division'
  };
  const REPRESENTATIVE_FIGHTERS=[
    'Jon Jones',
    'Tyron Woodley',
    'Khabib Nurmagomedov',
    'Jose Aldo',
    'Zhang Weili',
    'Chael Sonnen',
    'Demetrious Johnson',
    'Israel Adesanya'
  ];

  function loadStyles(){
    if(document.querySelector('link[data-profile-card-css]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=`assets/css/profile-card.css?v=${STYLE_VERSION}`;
    link.setAttribute('data-profile-card-css','true');
    document.head.appendChild(link);
  }

  function compactCategoryCards(root=document){
    root.querySelectorAll?.('#fighterDetail .category-card').forEach(card=>{
      const copy=CATEGORY_CARD_COPY[card.dataset.category];
      const detail=card.querySelector('small');
      if(!copy||!detail)return;
      const match=detail.textContent.match(/#([^\s]+)\s+in category/i);
      const rank=match?.[1]||'—';
      const desired=`#${rank} in category · ${copy}`;
      if(detail.textContent.trim()!==desired)detail.textContent=desired;
      detail.classList.add('category-context');
    });
  }

  function bindCategoryState(){
    const cards=[...document.querySelectorAll('#fighterDetail .category-card')];
    cards.forEach(card=>{
      if(!card.hasAttribute('aria-expanded'))card.setAttribute('aria-expanded','false');
      if(card.dataset.profileUiBound==='true')return;
      card.dataset.profileUiBound='true';
      card.addEventListener('click',()=>{
        cards.forEach(item=>item.setAttribute('aria-expanded',item===card?'true':'false'));
      });
    });
  }

  function polishProfileUi(){
    compactCategoryCards(document);
    bindCategoryState();

    const close=document.getElementById('closeDrawer');
    if(close){
      close.setAttribute('aria-label','Close fighter profile');
      close.setAttribute('title','Close fighter profile');
    }

    const explanation=document.getElementById('categoryExplanation');
    if(explanation){
      explanation.setAttribute('role','region');
      explanation.setAttribute('aria-live','polite');
      explanation.setAttribute('aria-label','Category breakdown');
    }
  }

  function wrapCategoryCards(){
    if(window.__UFC_PROFILE_CARD_RENDERER_WRAPPED)return;
    const previous=window.categoryCards;
    if(typeof previous!=='function')return;
    window.__UFC_PROFILE_CARD_RENDERER_WRAPPED=true;
    window.categoryCards=function(fighter){
      const holder=document.createElement('div');
      holder.innerHTML=previous(fighter);
      holder.querySelectorAll('.category-card').forEach(card=>{
        const copy=CATEGORY_CARD_COPY[card.dataset.category];
        const detail=card.querySelector('small');
        if(!copy||!detail)return;
        const match=detail.textContent.match(/#([^\s]+)\s+in category/i);
        const rank=match?.[1]||'—';
        const desired=`#${rank} in category · ${copy}`;
        if(detail.textContent.trim()!==desired)detail.textContent=desired;
        detail.classList.add('category-context');
        card.setAttribute('aria-expanded','false');
      });
      return holder.innerHTML;
    };
  }

  function wrapOpenFighter(){
    if(window.__UFC_PROFILE_OPEN_WRAPPED)return;
    const previous=window.openFighter;
    if(typeof previous!=='function')return;
    window.__UFC_PROFILE_OPEN_WRAPPED=true;
    window.openFighter=function(name){
      const result=previous(name);
      polishProfileUi();
      return result;
    };
  }

  function findFighter(name){
    const data=window.RANKING_DATA||{};
    const profile=(data.fighters||[]).find(row=>row?.fighter===name)||{};
    const board=(data.men||[]).find(row=>row?.fighter===name)||(data.women||[]).find(row=>row?.fighter===name)||{};
    return {...profile,...board,fighter:name};
  }

  function auditFighter(name){
    const row=findFighter(name);
    const override=window.DISPLAY_OVERRIDES?.[name]||{};
    const issues=[];
    if(!row.rank&&!override.allTimeRank)issues.push('missing rank');
    if(typeof window.overallOvr==='function'&&!Number.isFinite(Number(window.overallOvr(row))))issues.push('invalid OVR');
    if(!override.oneLiner)issues.push('missing hero summary');
    if(!override.whyRankedHere)issues.push('missing why-ranked copy');
    if(name==='Jon Jones'){
      if(!override.whyNotLower)issues.push('missing why-not-lower copy');
    }else if(!override.whyNotHigher){
      issues.push('missing why-not-higher copy');
    }
    if(!override.photoUrl)issues.push('missing profile photo path');
    if(typeof window.categoryOvr==='function'){
      ['championship','opponentQuality','primeDominance','longevity','penalty'].forEach(key=>{
        if(!Number.isFinite(Number(window.categoryOvr(row,key))))issues.push(`invalid ${key} rating`);
      });
    }
    return{fighter:name,passed:issues.length===0,issues};
  }

  function runRepresentativeAudit(){
    const results=REPRESENTATIVE_FIGHTERS.map(auditFighter);
    const state={
      version:VERSION,
      fighters:REPRESENTATIVE_FIGHTERS,
      results,
      passed:results.every(result=>result.passed),
      mutatesScores:false,
      checkedAt:new Date().toISOString()
    };
    window.UFC_PROFILE_REPRESENTATIVE_QA=state;
    return state;
  }

  function apply(){
    loadStyles();
    wrapCategoryCards();
    wrapOpenFighter();
    polishProfileUi();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();

  const detail=document.getElementById('fighterDetail');
  if(detail){
    const observer=new MutationObserver(()=>polishProfileUi());
    observer.observe(detail,{childList:true,subtree:true});
  }

  window.addEventListener('ufc-scoring-pipeline-ready',()=>{
    apply();
    runRepresentativeAudit();
  },{once:true});
  setTimeout(runRepresentativeAudit,0);

  window.UFC_PROFILE_CARD_UI={
    version:VERSION,
    styleVersion:STYLE_VERSION,
    categoryCardCopy:CATEGORY_CARD_COPY,
    representativeFighters:REPRESENTATIVE_FIGHTERS,
    runRepresentativeAudit,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };
})();
