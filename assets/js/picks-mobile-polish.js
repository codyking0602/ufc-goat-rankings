(function(){
  'use strict';

  const VERSION='picks-mobile-polish-20260718f-event-art';
  const observers=new Map();
  let syncing=false;

  function currentVisual(){
    const eventId=document.getElementById('picksEventSelect')?.value||'';
    return {eventId,visual:window.UFC_PICKS_EVENT_VISUALS?.[eventId]||null};
  }

  function clearEventArtwork(hero){
    hero.querySelector(':scope > .picks-event-art')?.remove();
    hero.classList.remove('has-event-art');
    delete hero.dataset.eventArtId;
  }

  function showEventArtwork(hero,image,eventId){
    if(!image.isConnected||hero.dataset.eventArtId!==eventId)return;
    if(image.naturalWidth>0)hero.classList.add('has-event-art');
  }

  function bindArtworkImage(hero,image,eventId){
    if(image.dataset.eventArtBound==='true')return;
    image.dataset.eventArtBound='true';

    image.addEventListener('load',()=>showEventArtwork(hero,image,eventId),{once:true});
    image.addEventListener('error',()=>{
      if(image.isConnected)image.remove();
      if(hero.dataset.eventArtId===eventId){
        hero.classList.remove('has-event-art');
        delete hero.dataset.eventArtId;
      }
    },{once:true});

    if(image.complete){
      if(image.naturalWidth>0)showEventArtwork(hero,image,eventId);
      else image.dispatchEvent(new Event('error'));
    }
  }

  function applyEventArtwork(){
    const hero=document.getElementById('picksEventHero');
    if(!hero)return;

    const {eventId,visual}=currentVisual();
    let image=hero.querySelector(':scope > .picks-event-art');

    if(!visual?.hero){
      clearEventArtwork(hero);
      return;
    }

    if(image&&(
      hero.dataset.eventArtId!==eventId||
      image.getAttribute('src')!==visual.hero
    )){
      image.remove();
      image=null;
    }

    if(!image){
      hero.classList.remove('has-event-art');
      image=document.createElement('img');
      image.className='picks-event-art';
      image.src=visual.hero;
      image.alt=visual.alt||'';
      image.loading='eager';
      image.decoding='async';
      image.setAttribute('fetchpriority','high');
      hero.dataset.eventArtId=eventId;
      hero.prepend(image);
    }

    bindArtworkImage(hero,image,eventId);
  }

  function initials(name){
    return String(name||'')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0,2)
      .map(part=>part[0])
      .join('')
      .toUpperCase();
  }

  function fighterSlug(name){
    return String(name||'')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }

  function expectedPhotoUrl(name){
    const slug=fighterSlug(name);
    return slug?`assets/fighters/${slug}-thumb.webp`:'';
  }

  function failedUrls(photo){
    return new Set(
      String(photo.dataset.polishPhotoFailed||'')
        .split('|')
        .filter(Boolean)
    );
  }

  function rememberFailure(photo,url){
    const failed=failedUrls(photo);
    failed.add(url);
    photo.dataset.polishPhotoFailed=[...failed].join('|');
  }

  function ensureFallback(photo,name){
    let fallback=[...photo.children].find(node=>node.tagName!=='IMG');
    if(!fallback){
      fallback=document.createElement('span');
      fallback.textContent=initials(name);
      photo.appendChild(fallback);
    }
    fallback.classList.add('picks-photo-fallback');
    if(!fallback.textContent.trim())fallback.textContent=initials(name);
    return fallback;
  }

  function tryDefaultPhoto(photo,name,url){
    if(!url||failedUrls(photo).has(url)||photo.querySelector('img'))return;
    const fallback=ensureFallback(photo,name);
    const image=document.createElement('img');
    image.src=url;
    image.alt='';
    image.loading='lazy';
    image.decoding='async';
    image.dataset.polishPhotoBound='true';
    fallback.hidden=false;
    photo.insertBefore(image,fallback);

    image.addEventListener('load',()=>{
      fallback.hidden=true;
      photo.classList.remove('photo-missing');
    },{once:true});

    image.addEventListener('error',()=>{
      rememberFailure(photo,url);
      image.remove();
      fallback.hidden=false;
      photo.classList.add('photo-missing');
    },{once:true});
  }

  function bindFightImage(photo,image,name){
    if(image.dataset.polishPhotoBound==='true')return;
    image.dataset.polishPhotoBound='true';

    const fallback=ensureFallback(photo,name);
    const raw=image.getAttribute('src')||'';
    const expected=expectedPhotoUrl(name);

    const showPhoto=()=>{
      fallback.hidden=true;
      photo.classList.remove('photo-missing');
    };

    const showFallback=()=>{
      rememberFailure(photo,raw);
      image.remove();
      fallback.hidden=false;
      photo.classList.add('photo-missing');
      if(expected&&expected!==raw)tryDefaultPhoto(photo,name,expected);
    };

    image.addEventListener('load',showPhoto,{once:true});
    image.addEventListener('error',showFallback,{once:true});

    if(image.complete){
      if(image.naturalWidth>0)showPhoto();
      else showFallback();
    }
  }

  function wireFightPhotos(){
    document.querySelectorAll('#picksFightList .pick-fighter').forEach(button=>{
      const name=button.querySelector('.pick-fighter-name')?.textContent?.trim()
        ||button.dataset.pick
        ||'';
      const photo=button.querySelector('.pick-fighter-photo');
      if(!name||!photo)return;

      ensureFallback(photo,name);
      const image=photo.querySelector('img');
      if(image)bindFightImage(photo,image,name);
      else tryDefaultPhoto(photo,name,expectedPhotoUrl(name));
    });
  }

  function formatRemaining(minutes){
    const total=Math.max(0,Math.round(Number(minutes)||0));
    if(total<=1)return'Locks in under a minute';
    if(total>=1440){
      const days=Math.floor(total/1440);
      const hours=Math.floor((total%1440)/60);
      return `Locks in ${days} day${days===1?'':'s'}${hours?`, ${hours} hour${hours===1?'':'s'}`:''}`;
    }
    if(total>=60){
      const hours=Math.floor(total/60);
      const mins=total%60;
      return `Locks in ${hours} hour${hours===1?'':'s'}${mins?`, ${mins} minute${mins===1?'':'s'}`:''}`;
    }
    return `Locks in ${total} minutes`;
  }

  function polishCountdown(){
    const detail=document.querySelector('#picksLivePanel .picks-live-copy small');
    if(!detail)return;
    const match=detail.textContent.trim().match(/^Locks in about\s+(\d+)\s+minutes$/i);
    if(!match)return;
    const next=formatRemaining(Number(match[1]));
    if(detail.textContent!==next)detail.textContent=next;
  }

  function compactRoomBanner(){
    const banner=document.getElementById('picksRoomBanner');
    if(!banner?.classList.contains('active'))return;

    banner.classList.add('picks-room-banner-compact','picks-room-no-share');

    const share=banner.querySelector('#picksShareRoom');
    share?.remove();

    const actions=banner.querySelector('.picks-room-actions');
    const leave=banner.querySelector('#picksSwitchRoom');
    if(!actions)return;

    if(leave&&!leave.closest('.picks-room-more')){
      const more=document.createElement('details');
      more.className='picks-room-more';
      more.innerHTML=`
        <summary aria-label="More room actions">•••</summary>
        <div class="picks-room-more-menu"></div>
      `;
      more.querySelector('.picks-room-more-menu')?.appendChild(leave);
      leave.textContent='Leave room';
      actions.appendChild(more);
    }

    const visibleActions=[...actions.children].filter(node=>!node.classList.contains('picks-room-more'));
    actions.style.setProperty('--picks-room-action-count',String(Math.max(1,visibleActions.length)));
  }

  function sync(){
    if(syncing)return;
    syncing=true;
    try{
      applyEventArtwork();
      compactRoomBanner();
      polishCountdown();
      wireFightPhotos();
      installObservers();
    }finally{
      syncing=false;
    }
  }

  function scheduleSync(){
    clearTimeout(scheduleSync.timer);
    scheduleSync.timer=setTimeout(sync,35);
  }

  function observe(id,options){
    const node=document.getElementById(id);
    if(!node||observers.get(id)?.node===node)return;

    observers.get(id)?.observer.disconnect();
    const observer=new MutationObserver(scheduleSync);
    observer.observe(node,options);
    observers.set(id,{node,observer});
  }

  function installObservers(){
    observe('picksEventHero',{childList:true,subtree:false});
    observe('picksFightList',{childList:true,subtree:true});
    observe('picksRoomBanner',{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    observe('picksLivePanel',{childList:true,subtree:true,characterData:true});
  }

  function start(){
    sync();
    [80,260,700].forEach(delay=>setTimeout(sync,delay));

    document.getElementById('picksEventSelect')?.addEventListener('change',()=>{
      requestAnimationFrame(applyEventArtwork);
    });

    window.addEventListener('picks:routechange',event=>{
      if(event.detail?.route==='event')requestAnimationFrame(sync);
    });

    window.addEventListener('ufc-picks-season-updated',()=>requestAnimationFrame(sync));
    document.documentElement.setAttribute('data-picks-mobile-polish',VERSION);
  }

  window.UFC_PICKS_MOBILE_POLISH={version:VERSION,sync,applyEventArtwork};
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }
})();