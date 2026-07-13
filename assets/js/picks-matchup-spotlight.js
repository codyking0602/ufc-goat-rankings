(function(){
  'use strict';

  const SPOTLIGHTS={
    'okc-du-plessis-usman':{
      kicker:'MAIN EVENT · 5 ROUNDS · MIDDLEWEIGHT',
      preview:'A former middleweight champion meeting one of the greatest welterweights ever in a five-round fight. Du Plessis brings the size, pressure, and finishing danger; Usman brings the cleaner wrestling structure, jab, and championship experience.',
      red:{
        name:'Dricus Du Plessis',
        record:'9-1 UFC',
        photoUrl:'assets/fighters/dricus-du-plessis.webp',
        age:'32',
        height:'6\'1"',
        reach:'76"',
        stance:'Orthodox',
        edges:['Middleweight size','Pressure and physicality','Finishing danger']
      },
      blue:{
        name:'Kamaru Usman',
        record:'16-3 UFC',
        photoUrl:'assets/fighters/kamaru-usman.webp',
        age:'39',
        height:'6\'0"',
        reach:'76"',
        stance:'Switch',
        edges:['Wrestling control','Jab and fundamentals','Championship experience']
      },
      clipUrl:''
    }
  };

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  let lastFocus=null;

  function ensureStyles(){
    if(document.querySelector('link[data-picks-matchup-spotlight]')) return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/css/picks-matchup-spotlight.css?v=picks-matchup-spotlight-20260713a';
    link.dataset.picksMatchupSpotlight='true';
    document.head.appendChild(link);
  }

  function ensureModal(){
    let modal=document.getElementById('picksMatchupSpotlight');
    if(modal) return modal;
    modal=document.createElement('div');
    modal.id='picksMatchupSpotlight';
    modal.className='picks-spotlight-modal';
    modal.hidden=true;
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML='<div class="picks-spotlight-backdrop" data-spotlight-close></div><section class="picks-spotlight-panel" role="dialog" aria-modal="true" aria-labelledby="picksSpotlightTitle"><button class="picks-spotlight-close" type="button" aria-label="Close matchup breakdown" data-spotlight-close>×</button><div id="picksSpotlightContent"></div></section>';
    document.body.appendChild(modal);
    return modal;
  }

  function taleRow(label,red,blue){
    return `<div class="picks-spotlight-tale-row"><strong>${safe(red)}</strong><span>${safe(label)}</span><strong>${safe(blue)}</strong></div>`;
  }

  function fighterHero(side,corner){
    return `<div class="picks-spotlight-fighter ${corner}">
      <div class="picks-spotlight-photo"><img src="${safe(side.photoUrl)}" alt="${safe(side.name)}" loading="eager"></div>
      <div class="picks-spotlight-fighter-copy"><h3>${safe(side.name)}</h3><span>${safe(side.record)}</span></div>
    </div>`;
  }

  function edgeColumn(side,corner){
    return `<div class="picks-spotlight-edge-column ${corner}"><strong>${safe(side.name)}</strong><div>${side.edges.map(edge=>`<span>${safe(edge)}</span>`).join('')}</div></div>`;
  }

  function renderSpotlight(data){
    return `<div class="picks-spotlight-hero">
      <div class="picks-spotlight-kicker">${safe(data.kicker)}</div>
      <div class="picks-spotlight-fighters">${fighterHero(data.red,'red')}<div class="picks-spotlight-vs">VS</div>${fighterHero(data.blue,'blue')}</div>
    </div>
    <div class="picks-spotlight-body">
      <section class="picks-spotlight-preview"><span>FIGHT PREVIEW</span><p>${safe(data.preview)}</p>${data.clipUrl ? `<a href="${safe(data.clipUrl)}" target="_blank" rel="noopener noreferrer">Watch recent fight clip ↗</a>` : ''}</section>
      <section class="picks-spotlight-section"><div class="picks-spotlight-section-title"><span>TALE OF THE TAPE</span></div><div class="picks-spotlight-tale">
        ${taleRow('Age',data.red.age,data.blue.age)}
        ${taleRow('Height',data.red.height,data.blue.height)}
        ${taleRow('Reach',data.red.reach,data.blue.reach)}
        ${taleRow('Stance',data.red.stance,data.blue.stance)}
      </div></section>
      <section class="picks-spotlight-section"><div class="picks-spotlight-section-title"><span>MATCHUP EDGES</span></div><div class="picks-spotlight-edges">${edgeColumn(data.red,'red')}<div class="picks-spotlight-edge-divider"></div>${edgeColumn(data.blue,'blue')}</div></section>
    </div>`;
  }

  function openSpotlight(fightId,trigger){
    const data=SPOTLIGHTS[fightId];
    if(!data) return;
    const modal=ensureModal();
    const content=document.getElementById('picksSpotlightContent');
    if(!content) return;
    lastFocus=trigger || document.activeElement;
    content.innerHTML=renderSpotlight(data);
    modal.hidden=false;
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('picks-spotlight-open');
    requestAnimationFrame(()=>modal.classList.add('open'));
    modal.querySelector('.picks-spotlight-close')?.focus();
  }

  function closeSpotlight(){
    const modal=document.getElementById('picksMatchupSpotlight');
    if(!modal || modal.hidden) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('picks-spotlight-open');
    window.setTimeout(()=>{ modal.hidden=true; },180);
    lastFocus?.focus?.();
  }

  function enhanceCards(){
    Object.keys(SPOTLIGHTS).forEach(fightId=>{
      const card=document.querySelector(`#picksFightList .pick-fight[data-fight="${CSS.escape(fightId)}"]`);
      if(!card || card.querySelector('[data-matchup-spotlight]')) return;
      const matchup=card.querySelector('.pick-matchup');
      if(!matchup) return;
      const button=document.createElement('button');
      button.type='button';
      button.className='pick-matchup-spotlight-trigger';
      button.dataset.matchupSpotlight=fightId;
      button.innerHTML='<span><b>FIGHT SPOTLIGHT</b><strong>View matchup breakdown</strong></span><i aria-hidden="true">›</i>';
      matchup.insertAdjacentElement('afterend',button);
    });
  }

  function start(){
    ensureStyles();
    ensureModal();
    enhanceCards();
    const root=document.getElementById('picks') || document.body;
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(enhanceCards,40);
    });
    observer.observe(root,{childList:true,subtree:true});

    document.addEventListener('click',event=>{
      const trigger=event.target.closest('[data-matchup-spotlight]');
      if(trigger){ openSpotlight(trigger.dataset.matchupSpotlight,trigger); return; }
      if(event.target.closest('[data-spotlight-close]')) closeSpotlight();
    });
    document.addEventListener('keydown',event=>{ if(event.key==='Escape') closeSpotlight(); });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
