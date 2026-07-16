// Presentation-only prerequisite loader with an explicit readiness handoff.
(function(){
  'use strict';

  const VERSION='ranking-data-patches-20260715j-photo-missing-opt-out';
  const PHOTO_BUILD='20260715j-photo-missing-opt-out';
  let readyResolved=false;
  let finalPhotoSyncCount=0;
  let lastPhotoSignature='';
  let resolveReady;
  const readyPromise=new Promise(resolve=>{resolveReady=resolve;});
  window.UFC_RANKING_DATA_PATCHES_READY=readyPromise;

  const SLUG_OVERRIDES={
    'B.J. Penn':'bj-penn','BJ Penn':'bj-penn','Georges St-Pierre':'georges-st-pierre',
    'T.J. Dillashaw':'tj-dillashaw','TJ Dillashaw':'tj-dillashaw','Junior dos Santos':'junior-dos-santos',
    "Sean O'Malley":'sean-omalley','Julianna Peña':'julianna-pena','Julianna Pena':'julianna-pena'
  };
  const VERIFIED_PHOTOS=Object.freeze({
    'Cris Cyborg':Object.freeze({photoUrl:'assets/fighters/cris-cyborg.webp',thumbUrl:'assets/fighters/cris-cyborg-thumb.webp'}),
    'Royce Gracie':Object.freeze({photoUrl:'assets/fighters/royce-gracie.webp',thumbUrl:'assets/fighters/royce-gracie-thumb.webp'})
  });

  function displayOverrides(){
    if(typeof DISPLAY_OVERRIDES!=='undefined')return DISPLAY_OVERRIDES;
    return window.DISPLAY_OVERRIDES||{};
  }
  function slugFor(name){
    return SLUG_OVERRIDES[name]||String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/['’]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }
  function versionPhotoUrl(url){
    const value=String(url||'').trim();
    if(!value)return'';
    const [withoutHash,hash='']=value.split('#',2);
    const cleaned=withoutHash.replace(/([?&])photoBuild=[^&#]*(&?)/,(_,lead,tail)=>tail?lead:'').replace(/[?&]$/,'');
    return `${cleaned}${cleaned.includes('?')?'&':'?'}photoBuild=${PHOTO_BUILD}${hash?`#${hash}`:''}`;
  }
  function initials(name){return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';}
  function fighterNames(){
    const names=[];
    const push=row=>{const name=typeof row==='string'?row:row?.fighter;if(name&&!names.includes(name))names.push(name);};
    (window.RANKING_DATA?.fighters||[]).forEach(push);
    (window.RANKING_DATA?.men||[]).forEach(push);
    (window.RANKING_DATA?.women||[]).forEach(push);
    return names;
  }
  function applyPhotoPathDefaults(){
    const overrides=displayOverrides();
    const mapped=[];
    fighterNames().forEach(fighter=>{
      const current=overrides[fighter]||{};
      if(current.photoUnavailable===true||current.photoStatus==='missing'){
        overrides[fighter]={...current,photoUrl:'',thumbUrl:''};
        mapped.push({fighter,photoUrl:'',thumbUrl:'',status:'missing'});
        return;
      }
      const slug=slugFor(fighter);
      if(!slug)return;
      const verified=VERIFIED_PHOTOS[fighter]||{};
      const basePhoto=current.photoUrl||verified.photoUrl||`assets/fighters/${slug}.webp`;
      const baseThumb=current.thumbUrl||verified.thumbUrl||`assets/fighters/${slug}-thumb.webp`;
      overrides[fighter]={
        ...current,
        photoUrl:versionPhotoUrl(basePhoto),
        thumbUrl:versionPhotoUrl(baseThumb)
      };
      mapped.push({fighter,photoUrl:overrides[fighter].photoUrl,thumbUrl:overrides[fighter].thumbUrl,status:'mapped'});
    });
    window.UFC_PHOTO_PATH_DEFAULTS={version:VERSION,photoBuild:PHOTO_BUILD,mapped};
    return mapped;
  }

  function fallbackImage(img){
    if(!img||img.dataset.ufcPhotoFallbackApplied)return;
    const src=img.getAttribute('src')||'';
    if(!src.includes('assets/fighters/'))return;
    img.dataset.ufcPhotoFallbackApplied='true';
    const name=String(img.getAttribute('alt')||'').replace(/\s+profile photo$/i,'').replace(/\s+thumbnail$/i,'').trim();
    const parent=img.closest('.row-photo,.fighter-photo,.ov-card-photo');
    if(!parent)return;
    img.remove();
    if(parent.classList.contains('row-photo')||parent.classList.contains('ov-card-photo')){parent.textContent=initials(name);return;}
    parent.classList.remove('has-photo');
    if(!parent.querySelector('.photo-initials')){
      const fallback=document.createElement('div');
      fallback.className='photo-initials';
      fallback.textContent=initials(name);
      parent.prepend(fallback);
    }
  }
  function installImageFallback(){
    if(window.__UFC_PHOTO_FALLBACK_INSTALLED)return;
    window.__UFC_PHOTO_FALLBACK_INSTALLED=true;
    document.addEventListener('error',event=>{if(event.target?.tagName==='IMG')fallbackImage(event.target);},true);
  }
  function scanBrokenImages(){document.querySelectorAll('img[src*="assets/fighters/"]').forEach(img=>{if(img.complete&&img.naturalWidth===0)fallbackImage(img);});}

  function packetManifest(){
    const rows=window.UFC_FIGHTER_PACKET_MANIFEST?.packets;
    if(!Array.isArray(rows))return[];
    return rows.map(row=>Array.isArray(row)?{slug:row[0],version:row[1]}:row).filter(row=>row?.slug&&row?.version);
  }
  function existingPhotoPaths(){
    return Object.entries(displayOverrides()).filter(([,override])=>override?.photoUrl||override?.thumbUrl).map(([fighter,override])=>({fighter,photoUrl:override.photoUrl||null,thumbUrl:override.thumbUrl||null}));
  }

  function status(){
    installImageFallback();
    const photoDefaults=applyPhotoPathDefaults();
    setTimeout(scanBrokenImages,250);
    const manifestPackets=packetManifest();
    const state={
      version:VERSION,
      mode:'presentation-prerequisite-loader',
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false,
      syncsManualProfileStats:false,
      inventsPhotoPaths:false,
      mapsDeterministicPhotoPaths:true,
      supportsMissingPhotoOptOut:true,
      photoBuild:PHOTO_BUILD,
      photoDefaults,
      fighterPacketManifest:manifestPackets.length>0,
      fighterPacketManifestVersion:window.UFC_FIGHTER_PACKET_MANIFEST?.version||null,
      fighterPacketManifestCount:manifestPackets.length,
      fighterPacketSchema:Boolean(window.UFC_FIGHTER_PACKET_SCHEMA),
      fighterPackets:Boolean(window.UFC_FIGHTER_PACKET_SYSTEM),
      compareProfiles:Boolean(window.COMPARE_PROFILES),
      compareFightLedger:Boolean(window.COMPARE_FIGHT_LEDGER),
      compareNarrative:Boolean(window.UFC_COMPARE_NARRATIVE_SYSTEM),
      watchMoments:Boolean(window.UFC_WATCH_MOMENTS),
      profileTemplate:Boolean(window.UFC_PROFILE_TEMPLATE_SYSTEM),
      divisionRankings:Boolean(window.UFC_DIVISION_RANKINGS),
      photoPaths:existingPhotoPaths(),
      appliedAt:new Date().toISOString()
    };
    window.UFC_PHASE2_DATA_STATUS=state;
    document.documentElement.setAttribute('data-phase2-data-patch',VERSION);
    return state;
  }
  function completeLoad(){
    const state=status();
    if(!readyResolved){
      readyResolved=true;
      resolveReady(state);
      window.dispatchEvent(new CustomEvent('ufc-ranking-data-patches-ready',{detail:state}));
    }
  }
  function syncCalculatedRosterPhotos(options={}){
    const photoDefaults=applyPhotoPathDefaults();
    const fighterCount=fighterNames().length;
    const signature=`${fighterCount}:${photoDefaults.length}:${PHOTO_BUILD}`;
    const changed=signature!==lastPhotoSignature;
    lastPhotoSignature=signature;
    finalPhotoSyncCount+=1;
    const state={
      version:VERSION,
      photoBuild:PHOTO_BUILD,
      fighterCount,
      mappedCount:photoDefaults.length,
      missingCount:photoDefaults.filter(row=>row.status==='missing').length,
      run:finalPhotoSyncCount,
      changed,
      refreshed:false,
      source:options.source||'ufc-production-ranking-ready',
      appliedAt:new Date().toISOString()
    };
    window.UFC_CALCULATED_ROSTER_PHOTO_SYNC=state;
    document.documentElement.setAttribute('data-fighter-photo-sync',`${VERSION}-${state.mappedCount}`);
    if(options.refresh!==false&&changed&&typeof window.refresh==='function'){
      try{window.refresh();state.refreshed=true;}catch(error){console.warn(`[${VERSION}] photo refresh failed`,error);}
    }
    setTimeout(scanBrokenImages,250);
    return state;
  }

  function loadScriptOnce(src,attribute,done){
    const existing=document.querySelector(`script[${attribute}]`);
    if(existing){if(done)queueMicrotask(done);return;}
    const script=document.createElement('script');
    script.src=src;
    script.setAttribute(attribute,'true');
    let finished=false;
    const finish=()=>{if(finished)return;finished=true;script.dataset.loaded='true';if(done)done();};
    script.onload=finish;
    script.onerror=finish;
    document.body.appendChild(script);
  }
  function loadSequence(items,done){
    const next=index=>{if(index>=items.length){if(done)done();return;}const item=items[index];loadScriptOnce(item.src,item.attr,()=>next(index+1));};
    next(0);
  }
  function packet(slug,version){return{src:`assets/data/fighter-packets/${slug}.js?v=fighter-packet-${slug}-${version}-presentation-only`,attr:`data-fighter-packet-${slug}`};}

  function presentationCoreScripts(){
    const packets=packetManifest().map(row=>packet(row.slug,row.version));
    return[
      {src:'assets/js/refresh-safety.js?v=refresh-safety-20260710b-optional-container-errors',attr:'data-refresh-safety'},
      {src:'assets/data/fighter-packet-schema.js?v=fighter-packet-schema-20260703a',attr:'data-fighter-packet-schema'},
      {src:'assets/compare-data.js?v=compare-data-20260715a-presentation-only',attr:'data-compare-data'},
      {src:'assets/compare-coverage-pack-1.js?v=compare-coverage-pack-1-20260630a',attr:'data-compare-coverage-pack-1'},
      {src:'assets/compare-coverage-pack-2.js?v=compare-coverage-pack-2-20260630a',attr:'data-compare-coverage-pack-2'},
      {src:'assets/compare-phase2-yan.js?v=compare-phase2-yan-20260701b',attr:'data-compare-phase2-yan'},
      {src:'assets/data/fighter-packets.js?v=fighter-packets-20260702c',attr:'data-fighter-packets'},
      ...packets,
      {src:'assets/js/card-nicknames.js?v=card-nicknames-20260706n-robbie-lawler',attr:'data-card-nicknames'},
      {src:'assets/js/championship-label-polish.js?v=championship-label-polish-20260711d-label-only',attr:'data-championship-label-polish'},
      {src:'assets/js/profile-card-ui.js?v=profile-card-ui-20260711a-canonical',attr:'data-profile-card-ui'},
      {src:'assets/data/compare-matchups.js?v=compare-matchups-20260703a',attr:'data-compare-matchups'},
      {src:'assets/compare-mode.js?v=special-matchups-20260630l',attr:'data-compare-mode'},
      {src:'assets/compare-engine-v1-5.js?v=compare-engine-v1-5-20260630b',attr:'data-compare-engine-v1-5'},
      {src:'assets/compare-copy-fixes-v1.js?v=compare-copy-fixes-v1-20260630a',attr:'data-compare-copy-fixes-v1'},
      {src:'assets/data/plain-resume-copy-fixes.js?v=plain-resume-copy-fixes-20260706a',attr:'data-plain-resume-copy-fixes'}
    ];
  }

  function loadModules(){
    const loadCompareWatchdog=()=>loadScriptOnce('assets/js/compare-narrative-watchdog.js?v=compare-narrative-watchdog-20260702a','data-compare-narrative-watchdog',completeLoad);
    const loadCompareNarrative=()=>loadScriptOnce('assets/js/compare-narrative-system.js?v=compare-narrative-system-20260703g','data-compare-narrative-system',loadCompareWatchdog);
    const loadCompareCore=()=>loadSequence(presentationCoreScripts(),loadCompareNarrative);
    const loadPacketManifest=()=>loadScriptOnce('assets/data/fighter-packet-manifest.js?v=fighter-packet-manifest-20260710z-chuck-vitor-window','data-fighter-packet-manifest',loadCompareCore);
    const loadBranding=()=>loadScriptOnce('assets/js/app-branding.js?v=app-branding-20260702c','data-app-branding',loadPacketManifest);
    const loadDivisionRankings=()=>loadScriptOnce('assets/js/division-rankings.js?v=division-rankings-20260705e-clean-leaderboard','data-division-rankings',loadBranding);
    const loadHomePolish=()=>loadScriptOnce('assets/js/home-polish.js?v=home-polish-hybrid-preview-20260711c-tab-scroll-hint','data-home-polish',loadDivisionRankings);
    const loadWatchMoments=()=>loadScriptOnce('assets/js/watch-moments.js?v=watch-moments-20260711i-signature-fights-batch-seven','data-watch-moments',loadHomePolish);
    const loadProfileTemplate=()=>loadScriptOnce('assets/js/profile-template-system.js?v=profile-template-system-20260715b-peak-apex','data-profile-template-system',loadWatchMoments);
    if(window.UFC_PROFILE_TEMPLATE_SYSTEM)loadWatchMoments();else loadProfileTemplate();
  }

  window.UFC_RANKING_DATA_PATCHES_V1={
    meta:{purpose:'Presentation-only prerequisite loader',updated:'2026-07-15',version:VERSION},
    apply:status,
    ready:readyPromise,
    slugFor,
    packetManifest,
    syncPacketProfileStats:()=>[],
    applyPhotoPathDefaults,
    syncCalculatedRosterPhotos
  };

  installImageFallback();
  applyPhotoPathDefaults();
  window.addEventListener('ufc-production-ranking-ready',()=>syncCalculatedRosterPhotos());
  if(document.documentElement.getAttribute('data-scoring-pipeline')==='ready')queueMicrotask(()=>syncCalculatedRosterPhotos());
  loadModules();
  window.OCTAGON_VERDICT_GPT_URL='https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  loadScriptOnce('assets/js/octagon-verdict-compare-launcher.js?v=octagon-verdict-compare-launcher-20260711b-canonical-cards','data-octagon-verdict-compare-launcher',status);
  window.UFC_PHASE2_DATA_REFRESH=status;
})();