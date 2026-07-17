(function(){
  'use strict';

  const VERSION='octagon-hq-shell-20260717a';
  const CANONICAL_CODE='GOAT26';
  const PROFILE_CACHE_KEY='ufc-app:profile-cache:goat26';
  const MEMBER_TOKEN_KEY=`ufc-picks:group:${CANONICAL_CODE}`;
  const DISPLAY_NAME_KEY='ufc-picks:display-name';
  let rendering=false;

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const initials=value=>text(value).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';
  const get=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const set=(key,value)=>{try{localStorage.setItem(key,value);}catch(_error){}};

  function readCache(){
    try{
      const value=JSON.parse(get(PROFILE_CACHE_KEY)||'null');
      return value&&text(value.display_name)?value:null;
    }catch(_error){return null;}
  }

  function cacheMember(member){
    if(!member||!text(member.display_name))return null;
    const value={
      id:text(member.id),
      display_name:text(member.display_name),
      fighter_avatar_slug:text(member.fighter_avatar_slug),
      is_admin:Boolean(member.is_admin||member.is_app_admin),
      updated_at:new Date().toISOString()
    };
    set(PROFILE_CACHE_KEY,JSON.stringify(value));
    set(DISPLAY_NAME_KEY,value.display_name);
    return value;
  }

  function fighterFor(slug){
    const clean=text(slug).toLowerCase();
    if(!clean)return null;
    return window.UFC_PLAY_DATA?.byId?.[clean]
      || window.UFC_PLAY_DATA?.resolve?.(clean)
      || null;
  }

  function photoFor(member){
    const fighter=fighterFor(member?.fighter_avatar_slug);
    if(!fighter)return{fighter:null,src:''};
    const candidates=window.UFC_PLAY_PHOTO_AUTHORITY?.candidatesFor?.(fighter);
    return{
      fighter,
      src:text(fighter.thumbUrl||candidates?.thumbs?.[0]||fighter.profileUrl||candidates?.profiles?.[0])
    };
  }

  function profileMarkup(member){
    const {fighter,src}=photoFor(member);
    const label=fighter?.name||member?.display_name||'UFC profile';
    const avatar=src
      ? `<span class="app-profile-avatar"><img src="${esc(src)}" alt="${esc(label)}" data-fighter-photo="true" data-fighter-name="${esc(fighter?.name||'')}"></span>`
      : `<span class="app-profile-avatar"><span>${esc(initials(member?.display_name))}</span></span>`;
    return `${avatar}<span class="app-profile-chip-copy"><small>OCTAGON HQ PROFILE</small><strong>${esc(member.display_name)}</strong></span><span class="app-profile-chip-badge">${member.is_admin?'ADMIN':CANONICAL_CODE}</span>`;
  }

  function renderMember(member){
    const chip=document.querySelector('.app-profile-chip');
    if(!chip||!member||!text(member.display_name))return false;
    rendering=true;
    chip.innerHTML=profileMarkup(member);
    chip.dataset.profileResolved='true';
    chip.setAttribute('aria-label',`Open ${member.display_name}'s Octagon HQ profile`);
    rendering=false;
    return true;
  }

  function renderLoading(){
    const chip=document.querySelector('.app-profile-chip');
    if(!chip||!get(MEMBER_TOKEN_KEY))return false;
    rendering=true;
    chip.innerHTML=`<span class="app-profile-avatar"><span>…</span></span><span class="app-profile-chip-copy"><small>OCTAGON HQ PROFILE</small><strong>Loading profile…</strong></span><span class="app-profile-chip-badge">${CANONICAL_CODE}</span>`;
    chip.dataset.profileResolved='loading';
    rendering=false;
    return true;
  }

  async function hydrateProfile(){
    const api=window.UFC_PLAY_PROFILE;
    const client=api?.client;
    let identity=null;
    try{identity=await api?.resolve?.();}catch(_error){}
    const token=text(identity?.memberToken||identity?.member_token||get(MEMBER_TOKEN_KEY));
    if(!client||!token)return null;

    try{
      const {data,error}=await client.rpc('app_profile_group_snapshot',{p_member_token:token});
      if(error)throw error;
      if(!data?.ok||!data?.me)return null;
      const member=cacheMember(data.me);
      if(identity?.member)Object.assign(identity.member,data.me);
      if(window.UFC_PLAY_PROFILE?.identity?.member)Object.assign(window.UFC_PLAY_PROFILE.identity.member,data.me);
      renderMember(member);
      return data;
    }catch(_error){
      const cached=readCache();
      if(cached)renderMember(cached);
      return null;
    }
  }

  function installBrand(){
    document.title='Octagon HQ';
    const hero=document.querySelector('.hero');
    if(!hero)return;
    const brand=hero.firstElementChild;
    if(brand){
      const eyebrow=brand.querySelector('.eyebrow');
      const title=brand.querySelector('h1');
      const subtitle=brand.querySelector('.subtitle');
      if(eyebrow)eyebrow.textContent='UFC RANKINGS · GAMES · PICKS · COMMUNITY';
      if(title)title.textContent='Octagon HQ';
      if(subtitle)subtitle.textContent='Your UFC home for rankings, daily games, event picks, and conversation.';

      const count=document.getElementById('fighterCount');
      if(count){
        let countLine=brand.querySelector('.octagon-hq-count');
        if(!countLine){
          countLine=document.createElement('p');
          countLine.className='octagon-hq-count';
          countLine.append(count,document.createTextNode(' fighters ranked'));
          brand.appendChild(countLine);
        }
      }
    }
    hero.querySelector('.hero-card')?.setAttribute('aria-hidden','true');

    const whatsNewTitle=document.getElementById('whatsNewTitle');
    const whatsNewDescription=document.getElementById('whatsNewDescription');
    if(whatsNewTitle)whatsNewTitle.textContent='Octagon HQ Just Got Bigger';
    if(whatsNewDescription)whatsNewDescription.textContent='Rankings, games, picks, profiles, and UFC conversation now live under one roof.';
  }

  function installStyles(){
    if(document.getElementById('octagonHqShellCss'))return;
    const style=document.createElement('style');
    style.id='octagonHqShellCss';
    style.textContent=`
      .hero{position:relative;align-items:center!important}.hero>div:first-child{min-width:0}.hero h1{letter-spacing:-.045em}.hero .subtitle{max-width:680px;margin-bottom:0}.octagon-hq-count{margin:8px 0 0;color:var(--text,#111827);font-weight:950;font-size:14px;line-height:1.1}.octagon-hq-count #fighterCount{font-size:inherit;font-weight:inherit}.hero .hero-card[aria-hidden="true"]{display:none!important}.app-profile-tools{min-width:230px!important;width:min(300px,100%)!important;display:block!important}.app-profile-chip{min-height:50px!important;border-radius:16px!important;padding:6px 9px!important;grid-template-columns:38px minmax(0,1fr) auto!important;gap:9px!important;box-shadow:0 10px 26px rgba(0,0,0,.18)!important}.app-profile-chip .app-profile-avatar{width:38px!important;height:38px!important;min-width:38px!important;border-radius:12px!important}.app-profile-chip-copy small{font-size:8px!important}.app-profile-chip-copy strong{font-size:13px!important}.app-profile-chip-badge{font-size:8px!important}.tabs{gap:8px!important}.tab{padding:9px 13px!important}
      #manualRefreshControl{min-width:0!important;width:auto!important;align-self:start!important}#manualRefreshActions{gap:7px!important}#manualRefreshBtn,#whatsNewBtn{min-height:36px!important;padding:8px 12px!important;font-size:.72rem!important;box-shadow:none!important}#manualRefreshBtn{border-color:transparent!important;background:transparent!important;color:inherit!important;opacity:.72}#manualRefreshBtn:hover{opacity:1;background:rgba(127,127,127,.08)!important}#whatsNewBtn{background:rgba(17,24,39,.92)!important}
      @media(min-width:901px){.hero{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(230px,300px)!important;column-gap:24px!important;row-gap:10px!important}.hero>div:first-child{grid-column:1;grid-row:1/3}.app-profile-tools{grid-column:2;grid-row:2}.hero #manualRefreshControl{grid-column:2;grid-row:1;justify-self:end}.hero h1{font-size:clamp(42px,5vw,68px)!important}}
      @media(max-width:900px){.hero{padding:16px 16px 14px!important;gap:10px!important}.hero>div:first-child{width:100%}.hero .eyebrow{margin:1px 0 7px!important;font-size:10px!important;letter-spacing:.13em!important}.hero h1{font-size:clamp(38px,11vw,48px)!important;line-height:.92!important}.hero .subtitle{margin:9px 0 0!important;font-size:17px!important;line-height:1.35!important}.octagon-hq-count{margin-top:7px;font-size:13px}.app-profile-tools{width:100%!important;min-width:0!important}.app-profile-chip{width:100%!important;min-height:48px!important}.hero #manualRefreshControl{order:-1!important;width:100%!important;align-self:stretch!important}.hero #manualRefreshActions{justify-content:flex-end!important}.tabs{padding:10px 14px!important;gap:7px!important}.tab{padding:8px 12px!important;font-size:12px!important}.shell{padding-top:14px!important}}
      @media(max-width:430px){.hero{padding-top:12px!important}.hero #manualRefreshActions{justify-content:space-between!important}#manualRefreshBtn{padding-left:4px!important;padding-right:4px!important}#whatsNewBtn{padding-left:12px!important;padding-right:12px!important}.hero h1{font-size:40px!important}.hero .subtitle{font-size:15px!important}.app-profile-chip{grid-template-columns:36px minmax(0,1fr) auto!important}.app-profile-chip .app-profile-avatar{width:36px!important;height:36px!important;min-width:36px!important}.tabs{padding-top:8px!important;padding-bottom:8px!important}}
    `;
    document.head.appendChild(style);
  }

  function protectResolvedProfile(){
    const hero=document.querySelector('.hero');
    if(!hero)return;
    const observer=new MutationObserver(()=>{
      if(rendering)return;
      const chip=hero.querySelector('.app-profile-chip');
      if(!chip)return;
      const cached=readCache();
      const hasToken=Boolean(get(MEMBER_TOKEN_KEY));
      const incorrectlySignedOut=hasToken&&/sign in/i.test(chip.textContent||'');
      if(cached&&(incorrectlySignedOut||chip.dataset.profileResolved!=='true'))renderMember(cached);
      else if(incorrectlySignedOut)renderLoading();
    });
    observer.observe(hero,{childList:true,subtree:true,characterData:true});
  }

  function start(){
    installStyles();
    installBrand();
    const cached=readCache();
    if(cached)renderMember(cached);
    else if(get(MEMBER_TOKEN_KEY))renderLoading();
    protectResolvedProfile();
    [0,220,850,2200].forEach(delay=>window.setTimeout(hydrateProfile,delay));
    window.setTimeout(installBrand,50);
  }

  window.addEventListener('ufc-app-profile-updated',event=>{
    const member=cacheMember(event.detail?.member);
    if(member)renderMember(member);
  });
  window.addEventListener('ufc-play-profile-ready',event=>{
    const member=cacheMember(event.detail?.member);
    if(member)renderMember(member);
    window.setTimeout(hydrateProfile,0);
  });
  window.addEventListener('ufc-canonical-group-ready',event=>{
    const member=cacheMember(event.detail?.member);
    if(member)renderMember(member);
    window.setTimeout(hydrateProfile,0);
  });
  window.addEventListener('ufc-play-data-ready',()=>{
    const cached=readCache();
    if(cached)renderMember(cached);
  });
  window.addEventListener('storage',event=>{
    if(event.key===PROFILE_CACHE_KEY||event.key===MEMBER_TOKEN_KEY)start();
  });

  window.UFC_OCTAGON_HQ_SHELL={version:VERSION,hydrateProfile,renderMember,readCache};
  document.documentElement.setAttribute('data-octagon-hq-shell',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();