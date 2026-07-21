(function(){
  'use strict';

  if(window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__)return;
  window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__=true;

  const VERSION='native-app-shell-stability-20260721b-spotlight-owner';
  let observer=null;
  let timer=0;

  const text=value=>String(value??'').trim();
  const pct=value=>Number.isFinite(Number(value))?`${Number(value).toFixed(1).replace(/\.0$/,'')}%`:'—';
  const years=value=>Number.isFinite(Number(value))?Number(value).toFixed(1):'—';

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
    },30);
  }

  function start(){
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-native-destination]'))closeFighterProfile();
      if(event.target.closest?.('#closeDrawer'))window.setTimeout(syncDrawerState,0);
    },true);
    observer=new MutationObserver(records=>{
      if(records.some(record=>record.target?.closest?.('#drawer,#manualRefreshControl')||[...record.addedNodes].some(node=>node.nodeType===1&&node.matches?.('#drawer,#whatsNewBtn,.snapshot-grid'))))schedule();
    });
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','aria-hidden']});
    ['octagon-hq:view-change','octagon-hq:soft-refresh'].forEach(name=>window.addEventListener(name,schedule));
    [0,80,240,700,1600,3600].forEach(delay=>window.setTimeout(schedule,delay));
    document.documentElement.dataset.nativeAppShellStability=VERSION;
  }

  window.UFC_NATIVE_APP_SHELL_STABILITY={version:VERSION,schedule,repairSnapshot,normalizeWhatsNew,closeFighterProfile};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
