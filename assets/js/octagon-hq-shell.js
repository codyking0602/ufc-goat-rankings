(function(){
  'use strict';

  const VERSION='octagon-hq-shell-20260717b';
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

  function isCodyAdmin(member){
    return Boolean(member?.is_admin)&&text(member?.display_name).toLowerCase()==='cody';
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

  function syncBetaAccess(member){
    const button=document.querySelector('[data-octagon-beta-tab]');
    if(!button)return;
    const allowed=isCodyAdmin(member);
    button.disabled=!allowed;
    button.setAttribute('aria-disabled',String(!allowed));
    button.dataset.betaAccess=allowed?'owner':'locked';
    button.title=allowed?'Open the private Octagon beta':'Private beta · Cody only';
    button.innerHTML=`<span>Octagon</span><small>BETA</small>${allowed?'':'<b aria-hidden="true">🔒</b>'}`;
  }

  function renderMember(member){
    const chip=document.querySelector('.app-profile-chip');
    if(!chip||!member||!text(member.display_name))return false;
    rendering=true;
    chip.innerHTML=profileMarkup(member);
    chip.dataset.profileResolved='true';
    chip.setAttribute('aria-label',`Open ${member.display_name}'s Octagon HQ profile`);
    rendering=false;
    syncBetaAccess(member);
    return true;
  }

  function renderLoading(){
    const chip=document.querySelector('.app-profile-chip');
    if(!chip||!get(MEMBER_TOKEN_KEY))return false;
    rendering=true;
    chip.innerHTML=`<span class="app-profile-avatar"><span>…</span></span><span class="app-profile-chip-copy"><small>OCTAGON HQ PROFILE</small><strong>Loading profile…</strong></span><span class="app-profile-chip-badge">${CANONICAL_CODE}</span>`;
    chip.dataset.profileResolved='loading';
    rendering=false;
    syncBetaAccess(null);
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
      if(subtitle)subtitle.textContent='Rankings, games, picks, and UFC conversation.';

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

  function activateOctagon(button){
    if(button.disabled||button.dataset.betaAccess!=='owner')return;
    document.querySelectorAll('.tab').forEach(item=>item.classList.remove('active'));
    document.querySelectorAll('.view').forEach(view=>view.classList.remove('active-view'));
    button.classList.add('active');
    document.getElementById('octagon')?.classList.add('active-view');
    const toolbar=document.querySelector('.toolbar');
    if(toolbar)toolbar.style.display='none';
  }

  function installBetaTab(){
    const nav=document.querySelector('.tabs');
    const main=document.querySelector('main.shell');
    if(!nav||!main)return;

    let button=nav.querySelector('[data-octagon-beta-tab]');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.className='tab octagon-beta-tab';
      button.dataset.view='octagon';
      button.dataset.octagonBetaTab='true';
      button.addEventListener('click',()=>activateOctagon(button));
      nav.appendChild(button);
    }

    if(!document.getElementById('octagon')){
      const section=document.createElement('section');
      section.id='octagon';
      section.className='view octagon-beta-view';
      section.innerHTML=`<div class="octagon-beta-shell"><div class="octagon-beta-kicker">PRIVATE BETA · CODY ONLY</div><h2>The Octagon</h2><p>One UFC conversation. A new board every Monday.</p><div class="octagon-beta-card"><span>FOUNDATION READY</span><strong>Your GOAT26 profile and fighter avatar are connected.</strong><small>The weekly message feed, replies, and like/dislike reactions are the next build.</small></div></div>`;
      const rules=document.getElementById('rules');
      if(rules)rules.before(section);else main.appendChild(section);
    }

    syncBetaAccess(readCache());
  }

  function installStyles(){
    if(document.getElementById('octagonHqShellCss'))return;
    const style=document.createElement('style');
    style.id='octagonHqShellCss';
    style.textContent=`
      .hero{position:relative;align-items:center!important}.hero>div:first-child{min-width:0}.hero h1{letter-spacing:-.045em}.hero .subtitle{max-width:680px;margin-bottom:0}.octagon-hq-count{margin:7px 0 0;color:var(--text,#111827);font-weight:950;font-size:14px;line-height:1.1}.octagon-hq-count #fighterCount{font-size:inherit;font-weight:inherit}.hero .hero-card[aria-hidden="true"]{display:none!important}.app-profile-tools{min-width:230px!important;width:min(300px,100%)!important;display:block!important}.app-profile-chip{min-height:44px!important;border-radius:14px!important;padding:5px 8px!important;grid-template-columns:34px minmax(0,1fr) auto!important;gap:8px!important;box-shadow:0 8px 22px rgba(0,0,0,.16)!important}.app-profile-chip .app-profile-avatar{width:34px!important;height:34px!important;min-width:34px!important;border-radius:10px!important}.app-profile-chip-copy small{font-size:7px!important}.app-profile-chip-copy strong{font-size:12px!important}.app-profile-chip-badge{font-size:8px!important}.tabs{gap:8px!important}.tab{padding:9px 13px!important}.octagon-beta-tab{display:inline-flex!important;align-items:center;justify-content:center;gap:6px}.octagon-beta-tab small{padding:3px 5px;border-radius:999px;background:rgba(249,115,22,.14);color:#f97316;font:950 7px/1 system-ui;letter-spacing:.08em}.octagon-beta-tab b{font-size:10px}.octagon-beta-tab:disabled{opacity:.52;cursor:not-allowed}.octagon-beta-tab[data-beta-access="owner"]{border-color:rgba(249,115,22,.62)}
      .octagon-beta-shell{max-width:760px;margin:0 auto;padding:24px;border:1px solid var(--line,#263244);border-radius:24px;background:linear-gradient(160deg,#172238,#0c1322);color:#f8fafc}.octagon-beta-kicker{color:#fb923c;font:950 10px/1 system-ui;letter-spacing:.14em}.octagon-beta-shell h2{margin:10px 0 5px;font-size:clamp(36px,8vw,64px);line-height:.95}.octagon-beta-shell>p{margin:0;color:#cbd5e1;font-size:17px}.octagon-beta-card{display:grid;gap:7px;margin-top:24px;padding:18px;border:1px solid rgba(249,115,22,.32);border-radius:18px;background:rgba(249,115,22,.07)}.octagon-beta-card span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.12em}.octagon-beta-card strong{font-size:17px}.octagon-beta-card small{color:#94a3b8;line-height:1.45}
      #manualRefreshControl{min-width:0!important;width:auto!important;align-self:start!important}#manualRefreshActions{gap:5px!important;justify-content:flex-end!important}#manualRefreshBtn,#whatsNewBtn{min-height:32px!important;padding:6px 10px!important;font-size:.68rem!important;box-shadow:none!important}#manualRefreshBtn{border-color:transparent!important;background:transparent!important;color:inherit!important;opacity:.68}#manualRefreshBtn:hover{opacity:1;background:rgba(127,127,127,.08)!important}#whatsNewBtn{background:rgba(17,24,39,.92)!important}
      @media(min-width:901px){.hero{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(230px,300px)!important;column-gap:24px!important;row-gap:8px!important}.hero>div:first-child{grid-column:1;grid-row:1/3}.app-profile-tools{grid-column:2;grid-row:2}.hero #manualRefreshControl{grid-column:2;grid-row:1;justify-self:end}.hero h1{font-size:clamp(42px,5vw,68px)!important}}
      @media(max-width:900px){.hero{padding:13px 16px 12px!important;gap:8px!important}.hero>div:first-child{width:100%}.hero .eyebrow{margin:1px 0 6px!important;font-size:10px!important;letter-spacing:.13em!important}.hero h1{font-size:clamp(38px,11vw,48px)!important;line-height:.92!important}.hero .subtitle{margin:7px 0 0!important;font-size:15px!important;line-height:1.3!important}.octagon-hq-count{margin-top:5px;font-size:13px}.app-profile-tools{width:100%!important;min-width:0!important}.app-profile-chip{width:100%!important;min-height:42px!important}.hero #manualRefreshControl{order:-1!important;width:auto!important;align-self:flex-end!important}.hero #manualRefreshActions{justify-content:flex-end!important}.tabs{padding:9px 14px!important;gap:7px!important}.tab{padding:8px 11px!important;font-size:12px!important}.shell{padding-top:12px!important}.toolbar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px}.toolbar #search,.toolbar #divisionFilter{grid-column:1/-1;grid-row:1}.toolbar #eraFilter{grid-column:1;grid-row:2;width:100%;min-width:0}.toolbar #resetBtn{grid-column:2;grid-row:2;width:auto;min-width:86px;padding-left:15px;padding-right:15px}.octagon-beta-shell{padding:20px}}
      @media(max-width:430px){.hero{padding-top:10px!important}.hero h1{font-size:39px!important}.app-profile-chip{grid-template-columns:32px minmax(0,1fr) auto!important}.app-profile-chip .app-profile-avatar{width:32px!important;height:32px!important;min-width:32px!important}.tabs{padding-top:7px!important;padding-bottom:7px!important}.octagon-beta-tab{gap:4px!important}}
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
    installBetaTab();
    const cached=readCache();
    if(cached)renderMember(cached);
    else if(get(MEMBER_TOKEN_KEY))renderLoading();
    else syncBetaAccess(null);
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

  window.UFC_OCTAGON_HQ_SHELL={version:VERSION,hydrateProfile,renderMember,readCache,syncBetaAccess};
  document.documentElement.setAttribute('data-octagon-hq-shell',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();