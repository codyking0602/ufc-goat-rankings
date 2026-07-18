(function(){
  'use strict';

  const VERSION='native-app-shell-stability-20260718a';
  let observer=null;
  let timer=0;

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const pct=value=>Number.isFinite(Number(value))?`${Number(value).toFixed(1).replace(/\.0$/,'')}%`:'—';
  const years=value=>Number.isFinite(Number(value))?Number(value).toFixed(1):'—';

  function centralDay(){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return`${map.year}-${map.month}-${map.day}`;
    }catch(_error){return new Date().toISOString().slice(0,10);}
  }

  function fighterRows(){
    const data=window.RANKING_DATA||{};
    return[...(data.men||[]).map(row=>({...row,spotlightBoard:'men'})),...(data.women||[]).map(row=>({...row,spotlightBoard:'women'}))]
      .filter(row=>text(row?.fighter)&&Number.isFinite(Number(row?.rank)));
  }

  function profileFor(name){
    const target=text(name).toLowerCase();
    const data=window.RANKING_DATA||{};
    const board=[...(data.men||[]),...(data.women||[])].find(row=>text(row?.fighter).toLowerCase()===target)||{};
    const profile=(data.fighters||[]).find(row=>text(row?.fighter).toLowerCase()===target)||{};
    return{...profile,...board};
  }

  function titleFightWins(fighter){
    const visible=fighter.visibleStats||{};
    const direct=visible.titleFightWins??fighter.titleFightWins;
    if(direct!==undefined&&direct!==null&&direct!=='')return direct;
    const match=text(fighter.title?.notes).match(/Total title fight wins\s*=\s*([0-9.]+)/i);
    return match?match[1].replace(/\.0$/,''):'—';
  }

  function topFiveWins(fighter){
    const visible=fighter.visibleStats||{};
    const direct=visible.topFiveWins??visible.top5Wins??fighter.topFiveWins??fighter.top5Wins;
    if(direct!==undefined&&direct!==null&&direct!=='')return direct;
    const rows=Array.isArray(fighter.opponents)?fighter.opponents:[];
    return rows.length?rows.filter(row=>Number(row?.credit)>=1).length:'—';
  }

  function roundsWonPct(fighter){
    const visible=fighter.visibleStats||{};
    const direct=visible.roundsWonPct??visible.roundsWonPercentage??fighter.roundsWonPct??fighter.roundsWonPercentage;
    if(Number.isFinite(Number(direct)))return Number(direct);
    const rows=Array.isArray(fighter.rounds)?fighter.rounds:[];
    const won=rows.reduce((sum,row)=>sum+(Number(row?.roundsWon)||0),0);
    const counted=rows.reduce((sum,row)=>sum+(Number(row?.roundsCounted)||0),0);
    return counted?(won/counted)*100:null;
  }

  function canonicalFighterName(){
    const alt=text(document.querySelector('#fighterDetail img[alt$=" profile photo"]')?.alt).replace(/ profile photo$/i,'');
    if(alt)return alt;
    const heading=text(document.querySelector('#fighterDetail .profile-summary h2')?.textContent);
    if(!heading)return'';
    const data=window.RANKING_DATA||{};
    return(data.fighters||[]).find(row=>{
      const override=window.DISPLAY_OVERRIDES?.[row.fighter]||{};
      return[ row.fighter,override.profileDisplayName,override.fighterDisplayName ].some(value=>text(value).toLowerCase()===heading.toLowerCase());
    })?.fighter||heading;
  }

  function snapshotValues(fighter){
    const visible=fighter.visibleStats||{};
    const prime=visible.primeRecord||fighter.primeRecord||window.RANKING_DATA?.primeRecords?.[fighter.fighter]?.record||'—';
    const roundPct=roundsWonPct(fighter);
    return{
      'ufc record':visible.ufcRecord||fighter.ufcRecord||'—',
      'ufc title-fight wins':titleFightWins(fighter),
      'top-5 wins':topFiveWins(fighter),
      'prime ufc record':prime,
      'finish rate':pct(visible.finishRatePct??fighter.finishRatePct),
      'rounds won':pct(roundPct),
      'active elite years':years(visible.activeEliteYears??fighter.activeEliteYears),
      'prime stoppage losses':Number.isFinite(Number(visible.timesFinishedPrime??fighter.timesFinishedPrime))?Number(visible.timesFinishedPrime??fighter.timesFinishedPrime):'—'
    };
  }

  function repairSnapshot(){
    const drawer=document.getElementById('drawer');
    if(!drawer?.classList.contains('open'))return false;
    const name=canonicalFighterName();
    if(!name)return false;
    const fighter=profileFor(name);
    const values=snapshotValues(fighter);
    const cards=[...document.querySelectorAll('#fighterDetail .card')];
    const card=cards.find(node=>/^resume snapshot$/i.test(text(node.querySelector('h3')?.textContent)));
    if(!card)return false;
    card.querySelectorAll('.snapshot-item').forEach(item=>{
      const label=text(item.querySelector('small,span')?.textContent).toLowerCase();
      const value=values[label];
      if(value===undefined)return;
      const strong=item.querySelector('strong');
      if(strong)strong.textContent=String(value);
    });
    drawer.dataset.currentFighter=name;
    return true;
  }

  function seededIndex(value,length){
    let seed=2166136261;
    for(const char of String(value)){seed^=char.charCodeAt(0);seed=Math.imul(seed,16777619);}
    return length?Math.abs(seed>>>0)%length:0;
  }

  function repairSpotlight(){
    const placeholder=document.querySelector('#home .home-spotlight-loading');
    if(!placeholder)return false;
    const rows=fighterRows();
    if(!rows.length)return false;
    const day=centralDay();
    const key=`ufc-home:spotlight:${day}`;
    let saved='';
    try{saved=localStorage.getItem(key)||'';}catch(_error){}
    let row=rows.find(item=>item.fighter===saved)||rows[seededIndex(day,rows.length)];
    try{localStorage.setItem(key,row.fighter);}catch(_error){}
    const fighter={...profileFor(row.fighter),...row};
    const override=window.DISPLAY_OVERRIDES?.[fighter.fighter]||{};
    const photo=text(override.thumbUrl||override.photoUrl);
    const division=text(fighter.primaryDivision||fighter.secondaryDivision||override.divisionLabel);
    const record=text(fighter.visibleStats?.ufcRecord||fighter.ufcRecord);
    let ovr=Number(fighter.overallOvr);
    if(!Number.isFinite(ovr)){try{ovr=Number(window.overallOvr?.(fighter));}catch(_error){ovr=NaN;}}
    const rankLabel=fighter.spotlightBoard==='women'?`#${fighter.rank} WOMEN'S`:`#${fighter.rank} ALL-TIME`;
    const meta=[rankLabel,division,record,Number.isFinite(ovr)?`${Math.round(ovr)} OVR`:''].filter(Boolean);
    const initials=text(fighter.fighter).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
    placeholder.outerHTML=`<section class="home-dashboard-card home-spotlight"><div class="home-spotlight-photo">${photo?`<img src="${esc(photo)}" alt="${esc(fighter.fighter)}">`:`<span>${esc(initials)}</span>`}</div><div class="home-spotlight-copy"><div class="home-dashboard-kicker"><span>RANKING SPOTLIGHT</span></div><h3>${esc(fighter.fighter)}</h3><div class="home-spotlight-meta">${meta.map(item=>`<span>${esc(item)}</span>`).join('<span>·</span>')}</div>${override.oneLiner?`<p>${esc(override.oneLiner)}</p>`:''}</div><div class="home-spotlight-actions"><button type="button" class="home-dashboard-action secondary" data-home-action="spotlight" data-fighter="${esc(fighter.fighter)}">VIEW PROFILE →</button></div></section>`;
    return true;
  }

  function normalizeWhatsNew(){
    const button=document.getElementById('whatsNewBtn');
    if(!button)return false;
    const existing=button.querySelector('#whatsNewUnread');
    const count=/^\d+\+?$/.test(text(existing?.textContent))?text(existing.textContent):'';
    const hidden=existing?.hidden!==false||!count;
    const malformed=!button.querySelector('[data-whats-new-label]')||text(button.textContent).replace(/\s+/g,'').startsWith('NEWNEW');
    if(malformed){
      button.innerHTML='<span data-whats-new-label>NEW</span><span id="whatsNewUnread" role="status" aria-live="polite" hidden></span>';
      const badge=button.querySelector('#whatsNewUnread');
      if(count){badge.textContent=count;badge.hidden=hidden;}
      window.UFC_APP_UPDATE_WATCHER?.syncUnread?.();
    }
    return true;
  }

  function syncDrawerState(){
    const open=document.getElementById('drawer')?.classList.contains('open');
    document.body.classList.toggle('fighter-profile-open',Boolean(open));
    if(open)repairSnapshot();
  }

  function closeFighterProfile(){
    const drawer=document.getElementById('drawer');
    if(!drawer?.classList.contains('open'))return false;
    const close=document.getElementById('closeDrawer');
    if(close)close.click();
    else{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
    document.body.classList.remove('fighter-profile-open');
    return true;
  }

  function schedule(){
    window.clearTimeout(timer);
    timer=window.setTimeout(()=>{
      normalizeWhatsNew();
      syncDrawerState();
      repairSpotlight();
    },30);
  }

  function start(){
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-native-destination]'))closeFighterProfile();
      if(event.target.closest?.('#closeDrawer'))window.setTimeout(syncDrawerState,0);
    },true);
    observer=new MutationObserver(records=>{
      if(records.some(record=>record.target?.closest?.('#drawer,#home,#manualRefreshControl')||[...record.addedNodes].some(node=>node.nodeType===1&&node.matches?.('#drawer,.home-spotlight-loading,#whatsNewBtn,.snapshot-grid'))))schedule();
    });
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','aria-hidden']});
    ['ufc-scoring-pipeline-ready','ufc-production-ranking-ready','octagon-hq:view-change','octagon-hq:soft-refresh'].forEach(name=>window.addEventListener(name,schedule));
    [0,80,240,700,1600,3600].forEach(delay=>window.setTimeout(schedule,delay));
    document.documentElement.dataset.nativeAppShellStability=VERSION;
  }

  window.UFC_NATIVE_APP_SHELL_STABILITY={version:VERSION,schedule,repairSnapshot,repairSpotlight,normalizeWhatsNew,closeFighterProfile};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
