(function(){
  'use strict';

  let syncing=false;
  const mobileLabels={men:'P4P',women:'Women',division:'Divisions',categories:'Categories',compare:'Compare',picks:'Picks',rules:'Rules'};

  function initials(name){
    return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  }

  function fighterSlug(name){
    return String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }

  function expectedPhotoUrl(name){
    const slug=fighterSlug(name);
    return slug ? `assets/fighters/${slug}-thumb.webp` : '';
  }

  function failedUrls(photo){
    return new Set(String(photo.dataset.polishPhotoFailed || '').split('|').filter(Boolean));
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
    if(!fallback.textContent.trim()) fallback.textContent=initials(name);
    return fallback;
  }

  function bindImage(photo,img,name){
    if(img.dataset.polishPhotoBound) return;
    img.dataset.polishPhotoBound='true';
    const fallback=ensureFallback(photo,name);
    const raw=img.getAttribute('src') || '';
    const expected=expectedPhotoUrl(name);

    const showPhoto=()=>{
      fallback.hidden=true;
      photo.classList.remove('photo-missing');
    };
    const showFallback=()=>{
      rememberFailure(photo,raw);
      img.remove();
      fallback.hidden=false;
      photo.classList.add('photo-missing');
      if(expected && expected!==raw) tryDefaultPhoto(photo,name,expected);
    };

    img.addEventListener('load',showPhoto,{once:true});
    img.addEventListener('error',showFallback,{once:true});
    if(img.complete){
      if(img.naturalWidth>0) showPhoto();
      else showFallback();
    }
  }

  function tryDefaultPhoto(photo,name,url){
    if(!url || failedUrls(photo).has(url) || photo.querySelector('img')) return;
    const fallback=ensureFallback(photo,name);
    const img=document.createElement('img');
    img.src=url;
    img.alt='';
    img.loading='lazy';
    img.decoding='async';
    img.dataset.polishPhotoBound='true';
    fallback.hidden=false;
    photo.insertBefore(img,fallback);
    img.addEventListener('load',()=>{
      fallback.hidden=true;
      photo.classList.remove('photo-missing');
    },{once:true});
    img.addEventListener('error',()=>{
      rememberFailure(photo,url);
      img.remove();
      fallback.hidden=false;
      photo.classList.add('photo-missing');
    },{once:true});
  }

  function wireFightPhotos(){
    document.querySelectorAll('#picksFightList .pick-fighter').forEach(button=>{
      const name=button.querySelector('.pick-fighter-name')?.textContent?.trim() || button.dataset.pick || '';
      const photo=button.querySelector('.pick-fighter-photo');
      if(!name || !photo) return;
      ensureFallback(photo,name);
      const img=photo.querySelector('img');
      if(img) bindImage(photo,img,name);
      else tryDefaultPhoto(photo,name,expectedPhotoUrl(name));
    });
  }

  function formatRemaining(minutes){
    const total=Math.max(0,Math.round(Number(minutes) || 0));
    if(total<=1) return 'Locks in under a minute';
    if(total>=1440){
      const days=Math.floor(total/1440);
      const hours=Math.floor((total%1440)/60);
      return `Locks in ${days} day${days===1?'':'s'}${hours ? `, ${hours} hour${hours===1?'':'s'}` : ''}`;
    }
    if(total>=60){
      const hours=Math.floor(total/60);
      const mins=total%60;
      return `Locks in ${hours} hour${hours===1?'':'s'}${mins ? `, ${mins} minute${mins===1?'':'s'}` : ''}`;
    }
    return `Locks in ${total} minutes`;
  }

  function polishCountdown(){
    const detail=document.querySelector('#picksLivePanel .picks-live-copy small');
    if(!detail) return;
    const match=detail.textContent.trim().match(/^Locks in about\s+(\d+)\s+minutes$/i);
    if(!match) return;
    const next=formatRemaining(Number(match[1]));
    if(detail.textContent!==next) detail.textContent=next;
  }

  function compactRoomBanner(){
    const banner=document.getElementById('picksRoomBanner');
    if(!banner?.classList.contains('active')) return;
    banner.classList.add('picks-room-banner-compact');
    const actions=banner.querySelector('.picks-room-actions');
    const leave=banner.querySelector('#picksSwitchRoom');
    if(!actions || !leave || leave.closest('.picks-room-more')) return;

    const more=document.createElement('details');
    more.className='picks-room-more';
    more.innerHTML='<summary aria-label="More room actions">•••</summary><div class="picks-room-more-menu"></div>';
    more.querySelector('.picks-room-more-menu')?.appendChild(leave);
    leave.textContent='Leave room';
    actions.appendChild(more);
  }

  function applyMobileLabels(){
    const mobile=window.matchMedia('(max-width:900px)').matches;
    document.querySelectorAll('.tabs .tab').forEach(button=>{
      if(!button.dataset.desktopLabel) button.dataset.desktopLabel=button.textContent.trim();
      const next=mobile ? (mobileLabels[button.dataset.view] || button.dataset.desktopLabel) : button.dataset.desktopLabel;
      if(button.textContent!==next) button.textContent=next;
      button.setAttribute('aria-label',button.dataset.desktopLabel);
      if(!button.dataset.mobileCenterBound){
        button.dataset.mobileCenterBound='true';
        button.addEventListener('click',()=>{
          if(!window.matchMedia('(max-width:900px)').matches) return;
          window.setTimeout(()=>button.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}),30);
        });
      }
    });
  }

  function sync(){
    if(syncing) return;
    syncing=true;
    try{
      compactRoomBanner();
      polishCountdown();
      wireFightPhotos();
      applyMobileLabels();
    }finally{
      syncing=false;
    }
  }

  function start(){
    sync();
    const picks=document.getElementById('picks') || document.body;
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(sync,70);
    });
    observer.observe(picks,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','hidden','src']});
    window.addEventListener('resize',()=>{
      clearTimeout(start.resizeTimer);
      start.resizeTimer=setTimeout(applyMobileLabels,120);
    });
    window.addEventListener('picks:routechange',()=>setTimeout(sync,30));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
