(function(){
  'use strict';

  const VERSION='shanes-watchlist-20260719d-photo-loading-fix';
  const PHOTO_VERSION='35685870508245b9';
  const WATCHLIST=Object.freeze({
    version:VERSION,
    curator:'Shane',
    title:'Shane’s Fighters to Watch',
    subtitle:'Early prospect calls, tracked from the moment Shane picked them.',
    fighters:[
      {
        id:'fatima-kline',
        photoSlug:'fatima-kline',
        name:'Fatima Kline',
        nickname:'The Archangel',
        status:'Latest call',
        added:'July 2026',
        division:'Women’s Strawweight',
        age:26,
        country:'United States',
        proRecord:'10–1',
        ufcRecord:'4–1',
        winStreak:'4',
        finishes:'5',
        highlight:'Four straight UFC wins',
        scoutingNote:'Fighter to watch: The Archangel.',
        comparison:'',
        ufcUrl:'https://www.ufc.com/athlete/fatima-kline'
      },
      {
        id:'abdul-rakhman-yakhyaev',
        photoSlug:'abdul-rakhman-yakhyaev',
        name:'Abdul Rakhman Yakhyaev',
        nickname:'The Hunter',
        status:'On the rise',
        added:'July 2026',
        division:'Light Heavyweight',
        age:25,
        country:'Türkiye',
        proRecord:'10–0',
        ufcRecord:'3–0',
        winStreak:'10',
        finishes:'9',
        highlight:'8-second UFC knockout',
        scoutingNote:'This guy could be the real deal.',
        comparison:'Magomed Ankalaev',
        ufcUrl:'https://www.ufc.com/athlete/abdulrakhman-yakhyaev'
      },
      {
        id:'daniil-donchenko',
        photoSlug:'daniil-donchenko',
        name:'Daniil Donchenko',
        nickname:'',
        status:'Watching',
        added:'July 2026',
        division:'Welterweight',
        age:24,
        country:'Ukraine',
        proRecord:'15–2',
        ufcRecord:'3–0',
        winStreak:'8',
        finishes:'12',
        highlight:'10 knockouts · 2 submissions',
        scoutingNote:'A young welterweight with an unbeaten UFC start and real finishing momentum.',
        comparison:'',
        ufcUrl:'https://www.ufc.com/athlete/daniil-donchenko'
      }
    ]
  });

  window.SHANES_FIGHTERS_TO_WATCH=WATCHLIST;

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const initials=value=>text(value).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'FW';
  const display=value=>text(value)||'—';
  const photoPath=fighter=>`assets/fighters/${encodeURIComponent(text(fighter.photoSlug||fighter.id))}-thumb.webp?v=${PHOTO_VERSION}`;

  function fighterCard(fighter,index){
    const stats=[
      ['PRO RECORD',fighter.proRecord],
      ['UFC RECORD',fighter.ufcRecord],
      ['WIN STREAK',fighter.winStreak],
      ['FINISHES',fighter.finishes]
    ];
    const meta=[fighter.division,fighter.age?`Age ${fighter.age}`:'',fighter.country].filter(Boolean).join(' · ');
    const number=String(index+1).padStart(2,'0');
    return `<article class="home-shane-card${index===0?' is-latest':''}" data-shane-watch-fighter="${esc(fighter.id)}">
      <div class="home-shane-card-band"><span class="home-shane-card-number">${number}</span><span class="home-shane-status">${esc(display(fighter.status))}</span><time>${esc(display(fighter.added))}</time></div>
      <div class="home-shane-identity"><span class="home-shane-avatar"><img data-shane-photo src="${esc(photoPath(fighter))}" alt="${esc(fighter.name)} headshot" loading="eager" decoding="async"><b aria-hidden="true">${esc(initials(fighter.name))}</b></span><div><h4>${esc(display(fighter.name))}</h4>${fighter.nickname?`<p>“${esc(fighter.nickname)}”</p>`:''}</div></div>
      <div class="home-shane-meta">${esc(meta||'Details pending')}</div>
      <div class="home-shane-stats">${stats.map(([label,value])=>`<div><strong>${esc(display(value))}</strong><span>${label}</span></div>`).join('')}</div>
      <p class="home-shane-note">“${esc(display(fighter.scoutingNote))}”</p>
      <div class="home-shane-footer"><span>${fighter.comparison?`COMP: <strong>${esc(fighter.comparison)}</strong>`:'COMP: <strong>—</strong>'}</span><span>${esc(display(fighter.highlight))}</span></div>
      <a class="home-shane-ufc-link" href="${esc(fighter.ufcUrl)}" target="_blank" rel="noopener noreferrer">VIEW UFC PROFILE <span aria-hidden="true">↗</span></a>
    </article>`;
  }

  function markup(){
    return `<details class="home-shane-watchlist" data-watchlist-version="${VERSION}">
      <summary><span class="home-shane-summary-copy"><small>SCOUTING BOARD</small><strong>${esc(WATCHLIST.title)}</strong><em>${esc(WATCHLIST.subtitle)}</em></span><span class="home-shane-summary-count">${WATCHLIST.fighters.length} FIGHTERS</span></summary>
      <div class="home-shane-body"><div class="home-shane-grid">${WATCHLIST.fighters.map(fighterCard).join('')}</div></div>
    </details>`;
  }

  function wirePhotos(section){
    section.querySelectorAll('[data-shane-photo]').forEach(image=>{
      const avatar=image.closest('.home-shane-avatar');
      if(!avatar)return;
      const show=()=>{
        image.hidden=false;
        image.removeAttribute('hidden');
        avatar.classList.add('has-photo');
      };
      const hide=()=>{
        avatar.classList.remove('has-photo');
      };
      if(image.dataset.photoWired!=='true'){
        image.dataset.photoWired='true';
        image.addEventListener('load',show);
        image.addEventListener('error',hide);
      }
      if(image.complete&&image.naturalWidth>0)show();
    });
  }

  function injectStyles(){
    const old=document.getElementById('homeShaneWatchlistStyles');
    if(old)old.remove();
    const style=document.createElement('style');
    style.id='homeShaneWatchlistStyles';
    style.textContent=`
      #homeDashboardMount>.home-shane-watchlist{width:min(1180px,100%);margin:18px auto 0;border:1px solid rgba(148,163,184,.22);border-radius:18px;background:linear-gradient(145deg,rgba(30,41,59,.96),rgba(10,16,28,.99));box-shadow:0 14px 36px rgba(2,6,23,.22);overflow:hidden}
      .home-shane-watchlist>summary{list-style:none;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:17px 18px;color:#fff;cursor:pointer}
      .home-shane-watchlist>summary::-webkit-details-marker{display:none}.home-shane-watchlist>summary::after{content:'+';grid-column:3;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:rgba(249,115,22,.13);color:#fb923c;font-size:23px;font-weight:800}.home-shane-watchlist[open]>summary::after{content:'−'}
      .home-shane-summary-copy{display:grid;gap:3px;min-width:0}.home-shane-summary-copy small{color:#fb923c;font-size:9px;font-weight:950;letter-spacing:.16em}.home-shane-summary-copy strong{font-size:18px;font-weight:950;line-height:1.15}.home-shane-summary-copy em{overflow:hidden;color:#94a3b8;font-size:12px;font-style:normal;font-weight:650;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.home-shane-summary-count{padding:6px 9px;border:1px solid rgba(249,115,22,.35);border-radius:999px;color:#fdba74;font-size:9px;font-weight:950;letter-spacing:.1em;white-space:nowrap}
      .home-shane-body{padding:0 18px 18px;border-top:1px solid rgba(148,163,184,.16)}.home-shane-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;padding-top:18px}
      .home-shane-card{--shane-accent:#38bdf8;--shane-glow:56,189,248;position:relative;min-width:0;padding:0 15px 15px;border:1px solid rgba(var(--shane-glow),.3);border-radius:17px;background:linear-gradient(155deg,rgba(var(--shane-glow),.095),rgba(15,23,42,.97) 32%,rgba(8,14,26,.99));box-shadow:0 12px 28px rgba(2,6,23,.25),inset 0 1px 0 rgba(255,255,255,.04);overflow:hidden}
      .home-shane-card:nth-child(3n+1){--shane-accent:#fb923c;--shane-glow:249,115,22}.home-shane-card:nth-child(3n+2){--shane-accent:#38bdf8;--shane-glow:56,189,248}.home-shane-card:nth-child(3n){--shane-accent:#a78bfa;--shane-glow:167,139,250}.home-shane-card.is-latest{grid-column:1/-1}
      .home-shane-card-band{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:9px;align-items:center;margin:0 -15px 13px;padding:10px 15px;border-bottom:1px solid rgba(var(--shane-glow),.22);background:linear-gradient(90deg,rgba(var(--shane-glow),.2),rgba(var(--shane-glow),.045) 52%,transparent);color:var(--shane-accent);font-size:9px;font-weight:950;letter-spacing:.11em;text-transform:uppercase}.home-shane-card-band time{color:#94a3b8;font-weight:850;letter-spacing:0;text-transform:none}.home-shane-card-number{width:28px;height:28px;display:grid;place-items:center;border:1px solid rgba(var(--shane-glow),.45);border-radius:9px;background:rgba(var(--shane-glow),.12);color:#fff;font-size:10px}.home-shane-status{white-space:nowrap}
      .home-shane-identity{display:grid;grid-template-columns:58px minmax(0,1fr);gap:12px;align-items:center}.home-shane-avatar{position:relative;width:58px;height:58px;display:grid;place-items:center;overflow:hidden;border:1px solid rgba(var(--shane-glow),.42);border-radius:15px;background:linear-gradient(145deg,rgba(var(--shane-glow),.28),#172033 68%);color:#fff;font-size:14px;font-weight:950}.home-shane-avatar img{display:block;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .15s ease}.home-shane-avatar.has-photo img{opacity:1}.home-shane-avatar.has-photo b{opacity:0}.home-shane-avatar b{font:950 14px/1 system-ui;transition:opacity .15s ease}.home-shane-identity h4{margin:0;color:#fff;font-size:17px;font-weight:950;line-height:1.15}.home-shane-identity p{margin:3px 0 0;color:var(--shane-accent);font-size:11px;font-weight:850}.home-shane-meta{margin-top:11px;color:#b5c0d0;font-size:11px;font-weight:750}
      .home-shane-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:13px}.home-shane-stats div{min-width:0;padding:9px 4px;border:1px solid rgba(var(--shane-glow),.16);border-radius:11px;background:rgba(255,255,255,.035);text-align:center}.home-shane-stats strong{display:block;color:#fff;font-size:16px;font-weight:950;white-space:nowrap}.home-shane-stats span{display:block;margin-top:4px;color:#8491a5;font-size:7px;font-weight:900;letter-spacing:.05em;white-space:nowrap}
      .home-shane-note{margin:13px 0 0;padding:10px 11px;border-left:4px solid var(--shane-accent);border-radius:0 10px 10px 0;background:rgba(var(--shane-glow),.08);color:#e5e7eb;font-size:12px;font-weight:720;line-height:1.4}.home-shane-footer{display:flex;justify-content:space-between;gap:10px;margin-top:12px;padding-top:11px;border-top:1px solid rgba(var(--shane-glow),.16);color:#8f9bad;font-size:9px;font-weight:800;line-height:1.3}.home-shane-footer strong{color:#dbe3ef}.home-shane-footer span:last-child{text-align:right}.home-shane-ufc-link{display:flex;align-items:center;justify-content:space-between;margin-top:11px;padding:10px 11px;border:1px solid rgba(var(--shane-glow),.28);border-radius:11px;background:rgba(var(--shane-glow),.075);color:#fff;font-size:9px;font-weight:950;letter-spacing:.1em;text-decoration:none}.home-shane-ufc-link span{color:var(--shane-accent);font-size:15px}.home-shane-ufc-link:active{transform:translateY(1px)}
      @media(max-width:760px){#homeDashboardMount>.home-shane-watchlist{margin-top:14px}.home-shane-watchlist>summary{grid-template-columns:minmax(0,1fr) auto;padding:15px}.home-shane-watchlist>summary::after{grid-column:2;grid-row:1}.home-shane-summary-count{display:none}.home-shane-summary-copy em{white-space:normal}.home-shane-body{padding:0 14px 18px}.home-shane-grid{grid-template-columns:1fr;gap:22px;padding-top:18px}.home-shane-card.is-latest{grid-column:auto}.home-shane-card+.home-shane-card::after{content:'';position:absolute;left:18px;right:18px;top:-12px;height:2px;border-radius:99px;background:linear-gradient(90deg,transparent,rgba(var(--shane-glow),.55),transparent)}.home-shane-stats{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(max-width:410px){.home-shane-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.home-shane-footer{display:grid}.home-shane-footer span:last-child{text-align:left}}
    `;
    document.head.appendChild(style);
  }

  function buildSection(open=false){
    const template=document.createElement('template');
    template.innerHTML=markup().trim();
    const section=template.content.firstElementChild;
    section.open=open;
    return section;
  }

  function render(){
    injectStyles();
    const mount=document.getElementById('homeDashboardMount');
    if(!mount||!Array.isArray(WATCHLIST.fighters)||!WATCHLIST.fighters.length)return false;
    let section=mount.querySelector(':scope > .home-shane-watchlist');
    if(!section){
      section=buildSection(false);
      mount.appendChild(section);
    }else if(section.dataset.watchlistVersion!==VERSION){
      const replacement=buildSection(section.open);
      section.replaceWith(replacement);
      section=replacement;
    }else if(section!==mount.lastElementChild){
      mount.appendChild(section);
    }
    wirePhotos(section);
    document.documentElement.setAttribute('data-shanes-watchlist',VERSION);
    return true;
  }

  let mountObserver=null;
  function observeMount(){
    const mount=document.getElementById('homeDashboardMount');
    if(!mount)return false;
    mountObserver?.disconnect();
    mountObserver=new MutationObserver(()=>render());
    mountObserver.observe(mount,{childList:true});
    render();
    return true;
  }

  if(!observeMount()){
    const documentObserver=new MutationObserver(()=>{if(observeMount())documentObserver.disconnect();});
    documentObserver.observe(document.documentElement,{childList:true,subtree:true});
  }
  window.addEventListener?.('octagon-hq:view-change',event=>{if(event.detail?.destination==='home')requestAnimationFrame(render);});
  window.addEventListener?.('ufc-production-ranking-ready',()=>requestAnimationFrame(render));
  window.UFC_SHANES_WATCHLIST={version:VERSION,data:WATCHLIST,render};
})();