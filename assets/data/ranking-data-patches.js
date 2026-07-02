// Lightweight post-load status hook.
(function(){
  const VERSION = 'ranking-data-patches-20260702ae-compare-post-polish-b';
  const SLUG_OVERRIDES = {
    'B.J. Penn':'bj-penn','BJ Penn':'bj-penn','Georges St-Pierre':'georges-st-pierre','T.J. Dillashaw':'tj-dillashaw','TJ Dillashaw':'tj-dillashaw','Junior dos Santos':'junior-dos-santos','Mauricio Rua':'mauricio-rua','Maurício Rua':'mauricio-rua','Zabit Magomedsharipov':'zabit-magomedsharipov'
  };
  let fallbackInstalled = false;

  function slugFor(name){
    if(SLUG_OVERRIDES[name]) return SLUG_OVERRIDES[name];
    return String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/['’]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }
  function initials(name){ return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'UFC'; }
  function fighterNames(){
    const names=[];
    const push=f=>{ const name=typeof f==='string'?f:f?.fighter; if(name && !names.includes(name)) names.push(name); };
    (window.RANKING_DATA?.fighters||[]).forEach(push);
    (window.RANKING_DATA?.men||[]).forEach(push);
    (window.RANKING_DATA?.women||[]).forEach(push);
    return names;
  }
  function applyPhotoPathDefaults(){
    if(typeof DISPLAY_OVERRIDES==='undefined') return [];
    const mapped=[];
    fighterNames().forEach(name=>{
      const slug=slugFor(name); if(!slug) return;
      const current=DISPLAY_OVERRIDES[name]||{};
      DISPLAY_OVERRIDES[name]={...current,photoUrl:current.photoUrl||`assets/fighters/${slug}.webp`,thumbUrl:current.thumbUrl||`assets/fighters/${slug}-thumb.webp`};
      mapped.push({fighter:name,photoUrl:DISPLAY_OVERRIDES[name].photoUrl,thumbUrl:DISPLAY_OVERRIDES[name].thumbUrl});
    });
    window.UFC_PHOTO_PATH_DEFAULTS={version:VERSION,mapped};
    return mapped;
  }
  function fallbackImage(img){
    if(!img || img.dataset.ufcPhotoFallbackApplied) return;
    const src=img.getAttribute('src')||''; if(!src.includes('assets/fighters/')) return;
    img.dataset.ufcPhotoFallbackApplied='true';
    const name=String(img.getAttribute('alt')||'').replace(/\s+profile photo$/i,'').trim();
    const parent=img.closest('.row-photo,.fighter-photo'); if(!parent) return;
    img.remove();
    if(parent.classList.contains('row-photo')){ parent.textContent=initials(name); return; }
    parent.classList.remove('has-photo');
    if(!parent.querySelector('.photo-initials')){ const fallback=document.createElement('div'); fallback.className='photo-initials'; fallback.textContent=initials(name); parent.prepend(fallback); }
  }
  function installImageFallback(){
    if(fallbackInstalled) return; fallbackInstalled=true;
    document.addEventListener('error',event=>{ if(event.target?.tagName==='IMG') fallbackImage(event.target); },true);
  }
  function scanBrokenImages(){ document.querySelectorAll('img[src*="assets/fighters/"]').forEach(img=>{ if(img.complete && img.naturalWidth===0) fallbackImage(img); }); }
  function refreshApp(){ if(typeof refresh==='function'){ try{ refresh(); }catch(e){} } setTimeout(scanBrokenImages,250); }
  function status(){
    installImageFallback();
    const photoDefaults=applyPhotoPathDefaults();
    refreshApp();
    window.UFC_PHASE2_DATA_STATUS={version:VERSION,mode:'lightweight-status-hook',profileTemplateSystem:!!window.UFC_PROFILE_TEMPLATE_SYSTEM,fighterProfilePackages:!!window.UFC_FIGHTER_PROFILE_PACKAGES,watchMoments:!!window.UFC_WATCH_MOMENTS,homePolish:!!window.UFC_HOME_POLISH,divisionRankings:!!window.UFC_DIVISION_RANKINGS,appBranding:!!window.UFC_APP_BRANDING,compareNarrative:!!window.UFC_COMPARE_NARRATIVE_SYSTEM,compareNarrativePostPolish:!!window.UFC_COMPARE_NARRATIVE_POST_POLISH,compareNarrativeWatchdog:!!window.UFC_COMPARE_NARRATIVE_WATCHDOG,compareProfiles:typeof COMPARE_PROFILES!=='undefined',compareLedger:typeof COMPARE_FIGHT_LEDGER!=='undefined',packagedFighters:window.UFC_FIGHTER_PROFILE_PACKAGES?.fighters||[],watchMomentFighters:window.UFC_WATCH_MOMENTS?.fighters||[],photoDefaults,appliedAt:new Date().toISOString()};
    document.documentElement.setAttribute('data-phase2-data-patch',VERSION);
  }
  function loadScriptOnce(src,attr,done){
    if(document.querySelector(`script[${attr}]`)){ if(done) done(); return; }
    const script=document.createElement('script'); script.src=src; script.setAttribute(attr,'true'); script.onload=()=>{ if(done) done(); }; script.onerror=()=>{ if(done) done(); }; document.body.appendChild(script);
  }
  function loadSequence(items,done){ const next=i=>{ if(i>=items.length){ if(done) done(); return; } loadScriptOnce(items[i].src,items[i].attr,()=>next(i+1)); }; next(0); }
  function loadModules(){
    const compareCoreScripts=[
      {src:'assets/compare-data.js?v=compare-data-20260630a',attr:'data-compare-data'},
      {src:'assets/compare-coverage-pack-1.js?v=compare-coverage-pack-1-20260630a',attr:'data-compare-coverage-pack-1'},
      {src:'assets/compare-coverage-pack-2.js?v=compare-coverage-pack-2-20260630a',attr:'data-compare-coverage-pack-2'},
      {src:'assets/compare-phase2-yan.js?v=compare-phase2-yan-20260701b',attr:'data-compare-phase2-yan'},
      {src:'assets/compare-mode.js?v=special-matchups-20260630l',attr:'data-compare-mode'},
      {src:'assets/compare-engine-v1-5.js?v=compare-engine-v1-5-20260630b',attr:'data-compare-engine-v1-5'},
      {src:'assets/compare-copy-fixes-v1.js?v=compare-copy-fixes-v1-20260630a',attr:'data-compare-copy-fixes-v1'}
    ];
    const loadCompareWatchdog=()=>loadScriptOnce('assets/js/compare-narrative-watchdog.js?v=compare-narrative-watchdog-20260702a','data-compare-narrative-watchdog',status);
    const loadComparePostPolish=()=>loadScriptOnce('assets/js/compare-narrative-post-polish.js?v=compare-narrative-post-polish-20260702b','data-compare-narrative-post-polish',loadCompareWatchdog);
    const loadCompareNarrative=()=>loadScriptOnce('assets/js/compare-narrative-system.js?v=compare-narrative-system-20260702h','data-compare-narrative-system',loadComparePostPolish);
    const loadCompareCore=()=>loadSequence(compareCoreScripts,loadCompareNarrative);
    const loadBranding=()=>loadScriptOnce('assets/js/app-branding.js?v=app-branding-20260702c','data-app-branding',loadCompareCore);
    const loadDivisionRankings=()=>loadScriptOnce('assets/js/division-rankings.js?v=division-rankings-20260702f','data-division-rankings',loadBranding);
    const loadHomePolish=()=>loadScriptOnce('assets/js/home-polish.js?v=home-polish-hybrid-preview-20260702a','data-home-polish',loadDivisionRankings);
    const loadWatchMoments=()=>loadScriptOnce('assets/js/watch-moments.js?v=watch-moments-20260702a','data-watch-moments',loadHomePolish);
    const loadPackages=()=>loadScriptOnce('assets/js/fighter-profile-packages.js?v=fighter-profile-packages-20260702a','data-fighter-profile-packages',loadWatchMoments);
    if(window.UFC_PROFILE_TEMPLATE_SYSTEM){ loadPackages(); return; }
    loadScriptOnce('assets/js/profile-template-system.js?v=profile-template-system-20260701a','data-profile-template-system',loadPackages);
  }
  window.UFC_RANKING_DATA_PATCHES_V1={meta:{purpose:'Status hook, module loader, default fighter photo paths, and compare post-polish loader',updated:'2026-07-02',version:VERSION},apply:status,slugFor};
  installImageFallback();
  applyPhotoPathDefaults();
  loadModules();
  window.UFC_PHASE2_DATA_REFRESH=status;
})();