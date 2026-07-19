(function(){
  'use strict';

  const VERSION='shanes-watchlist-20260719b-home-collapsed';
  const WATCHLIST=Object.freeze({
    version:VERSION,
    curator:'Shane',
    title:'Shane’s Fighters to Watch',
    subtitle:'Early prospect calls, tracked from the moment Shane picked them.',
    fighters:[
      {
        id:'abdul-rakhman-yakhyaev',
        name:'Abdul Rakhman Yakhyaev',
        nickname:'The Hunter',
        status:'Latest call',
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
        comparison:'Magomed Ankalaev'
      },
      {
        id:'daniil-donchenko',
        name:'Daniil Donchenko',
        nickname:'',
        status:'On the rise',
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
        comparison:''
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

  function fighterCard(fighter){
    const stats=[
      ['PRO RECORD',fighter.proRecord],
      ['UFC RECORD',fighter.ufcRecord],
      ['WIN STREAK',fighter.winStreak],
      ['FINISHES',fighter.finishes]
    ];
    const meta=[fighter.division,fighter.age?`Age ${fighter.age}`:'',fighter.country].filter(Boolean).join(' · ');
    return `<article class="home-shane-card" data-shane-watch-fighter="${esc(fighter.id)}">
      <div class="home-shane-card-top"><span>${esc(display(fighter.status))}</span><time>${esc(display(fighter.added))}</time></div>
      <div class="home-shane-identity"><span class="home-shane-avatar" aria-hidden="true">${esc(initials(fighter.name))}</span><div><h4>${esc(display(fighter.name))}</h4>${fighter.nickname?`<p>“${esc(fighter.nickname)}”</p>`:''}</div></div>
      <div class="home-shane-meta">${esc(meta||'Details pending')}</div>
      <div class="home-shane-stats">${stats.map(([label,value])=>`<div><strong>${esc(display(value))}</strong><span>${label}</span></div>`).join('')}</div>
      <p class="home-shane-note">“${esc(display(fighter.scoutingNote))}”</p>
      <div class="home-shane-footer"><span>${fighter.comparison?`COMP: <strong>${esc(fighter.comparison)}</strong>`:'COMP: <strong>—</strong>'}</span><span>${esc(display(fighter.highlight))}</span></div>
    </article>`;
  }

  function markup(){
    return `<details class="home-shane-watchlist">
      <summary><span class="home-shane-summary-copy"><small>SCOUTING BOARD</small><strong>${esc(WATCHLIST.title)}</strong><em>${esc(WATCHLIST.subtitle)}</em></span><span class="home-shane-summary-count">${WATCHLIST.fighters.length} FIGHTERS</span></summary>
      <div class="home-shane-body"><div class="home-shane-grid">${WATCHLIST.fighters.map(fighterCard).join('')}</div></div>
    </details>`;
  }

  function injectStyles(){
    if(document.getElementById('homeShaneWatchlistStyles'))return;
    const style=document.createElement('style');
    style.id='homeShaneWatchlistStyles';
    style.textContent=`
      #homeDashboardMount>.home-shane-watchlist{width:min(1180px,100%);margin:18px auto 0;border:1px solid rgba(148,163,184,.22);border-radius:18px;background:linear-gradient(145deg,rgba(30,41,59,.96),rgba(10,16,28,.99));box-shadow:0 14px 36px rgba(2,6,23,.22);overflow:hidden}
      .home-shane-watchlist>summary{list-style:none;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:17px 18px;color:#fff;cursor:pointer}
      .home-shane-watchlist>summary::-webkit-details-marker{display:none}.home-shane-watchlist>summary::after{content:'+';grid-column:3;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:rgba(249,115,22,.13);color:#fb923c;font-size:23px;font-weight:800}.home-shane-watchlist[open]>summary::after{content:'−'}
      .home-shane-summary-copy{display:grid;gap:3px;min-width:0}.home-shane-summary-copy small{color:#fb923c;font-size:9px;font-weight:950;letter-spacing:.16em}.home-shane-summary-copy strong{font-size:18px;font-weight:950;line-height:1.15}.home-shane-summary-copy em{overflow:hidden;color:#94a3b8;font-size:12px;font-style:normal;font-weight:650;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.home-shane-summary-count{padding:6px 9px;border:1px solid rgba(249,115,22,.35);border-radius:999px;color:#fdba74;font-size:9px;font-weight:950;letter-spacing:.1em;white-space:nowrap}
      .home-shane-body{padding:0 18px 18px;border-top:1px solid rgba(148,163,184,.16)}.home-shane-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding-top:14px}.home-shane-card{min-width:0;padding:14px;border:1px solid rgba(148,163,184,.18);border-radius:15px;background:rgba(15,23,42,.82)}
      .home-shane-card-top{display:flex;justify-content:space-between;gap:10px;color:#fb923c;font-size:9px;font-weight:950;letter-spacing:.1em;text-transform:uppercase}.home-shane-card-top time{color:#94a3b8;font-weight:800;letter-spacing:0;text-transform:none}.home-shane-identity{display:grid;grid-template-columns:48px minmax(0,1fr);gap:10px;align-items:center;margin-top:11px}.home-shane-avatar{width:48px;height:48px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.14);border-radius:13px;background:linear-gradient(145deg,#334155,#172033);color:#fff;font-size:14px;font-weight:950}.home-shane-identity h4{margin:0;color:#fff;font-size:16px;font-weight:950;line-height:1.15}.home-shane-identity p{margin:3px 0 0;color:#fdba74;font-size:11px;font-weight:850}.home-shane-meta{margin-top:10px;color:#aeb8c8;font-size:11px;font-weight:700}
      .home-shane-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:12px}.home-shane-stats div{min-width:0;padding:8px 4px;border:1px solid rgba(148,163,184,.13);border-radius:10px;background:rgba(255,255,255,.035);text-align:center}.home-shane-stats strong{display:block;color:#fff;font-size:15px;font-weight:950;white-space:nowrap}.home-shane-stats span{display:block;margin-top:4px;color:#7f8ca0;font-size:7px;font-weight:900;letter-spacing:.05em;white-space:nowrap}
      .home-shane-note{margin:12px 0 0;padding:9px 10px;border-left:3px solid #f97316;border-radius:0 9px 9px 0;background:rgba(249,115,22,.07);color:#e5e7eb;font-size:12px;font-weight:700;line-height:1.4}.home-shane-footer{display:flex;justify-content:space-between;gap:10px;margin-top:11px;padding-top:10px;border-top:1px solid rgba(148,163,184,.13);color:#8f9bad;font-size:9px;font-weight:800;line-height:1.3}.home-shane-footer strong{color:#dbe3ef}.home-shane-footer span:last-child{text-align:right}
      @media(max-width:760px){#homeDashboardMount>.home-shane-watchlist{margin-top:14px}.home-shane-watchlist>summary{grid-template-columns:minmax(0,1fr) auto;padding:15px}.home-shane-watchlist>summary::after{grid-column:2;grid-row:1}.home-shane-summary-count{display:none}.home-shane-summary-copy em{white-space:normal}.home-shane-body{padding:0 14px 14px}.home-shane-grid{grid-template-columns:1fr}.home-shane-stats{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(max-width:410px){.home-shane-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.home-shane-footer{display:grid}.home-shane-footer span:last-child{text-align:left}}
    `;
    document.head.appendChild(style);
  }

  function render(){
    injectStyles();
    const mount=document.getElementById('homeDashboardMount');
    if(!mount||!Array.isArray(WATCHLIST.fighters)||!WATCHLIST.fighters.length)return false;
    let section=mount.querySelector(':scope > .home-shane-watchlist');
    if(!section){
      const template=document.createElement('template');
      template.innerHTML=markup().trim();
      section=template.content.firstElementChild;
      mount.appendChild(section);
    }else if(section!==mount.lastElementChild){
      mount.appendChild(section);
    }
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