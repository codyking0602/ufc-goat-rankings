// Lightweight post-load status hook and module loader.
(function(){
  const VERSION='ranking-data-patches-20260705z-dricus-prime-195';
  const SLUG_OVERRIDES={'B.J. Penn':'bj-penn','BJ Penn':'bj-penn','Georges St-Pierre':'georges-st-pierre','T.J. Dillashaw':'tj-dillashaw','TJ Dillashaw':'tj-dillashaw','Junior dos Santos':'junior-dos-santos','Mauricio Rua':'mauricio-rua','Maurício Rua':'mauricio-rua','Zabit Magomedsharipov':'zabit-magomedsharipov'};
  const FALLBACK_PACKET_MANIFEST=[
    {slug:'demetrious-johnson',version:'20260702a'},
    {slug:'anderson-silva',version:'20260702a'},
    {slug:'khabib-nurmagomedov',version:'20260702a'},
    {slug:'islam-makhachev',version:'20260702a'},
    {slug:'alexander-volkanovski',version:'20260703b'},
    {slug:'randy-couture',version:'20260702a'},
    {slug:'max-holloway',version:'20260703b'},
    {slug:'kamaru-usman',version:'20260702a'},
    {slug:'jose-aldo',version:'20260705b'},
    {slug:'matt-hughes',version:'20260702a'},
    {slug:'daniel-cormier',version:'20260702a'},
    {slug:'stipe-miocic',version:'20260702a'},
    {slug:'dricus-du-plessis',version:'20260705e-prime-195'},
    {slug:'ilia-topuria',version:'20260705a'},
    {slug:'israel-adesanya',version:'20260702a'},
    {slug:'aljamain-sterling',version:'20260703a'},
    {slug:'petr-yan',version:'20260702b'},
    {slug:'cain-velasquez',version:'20260702b'},
    {slug:'merab-dvalishvili',version:'20260702b'},
    {slug:'bj-penn',version:'20260702b'},
    {slug:'dustin-poirier',version:'20260703a'},
    {slug:'tj-dillashaw',version:'20260703a'},
    {slug:'alex-pereira',version:'20260702c'},
    {slug:'chuck-liddell',version:'20260702a'},
    {slug:'dominick-cruz',version:'20260702a'},
    {slug:'francis-ngannou',version:'20260702a'},
    {slug:'charles-oliveira',version:'20260702a'},
    {slug:'henry-cejudo',version:'20260702a'},
    {slug:'conor-mcgregor',version:'20260702a'},
    {slug:'justin-gaethje',version:'20260702d'},
    {slug:'frankie-edgar',version:'20260703b'},
    {slug:'dan-henderson',version:'20260703a'},
    {slug:'amanda-nunes',version:'20260702a'},
    {slug:'valentina-shevchenko',version:'20260702a'},
    {slug:'joanna-jedrzejczyk',version:'20260702b'},
    {slug:'ronda-rousey',version:'20260702b'}
  ];
  let fallbackInstalled=false;

  function slugFor(name){
    if(SLUG_OVERRIDES[name]) return SLUG_OVERRIDES[name];
    return String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/['’]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }
  function initials(name){return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'UFC';}
  function fighterNames(){
    const names=[];
    const push=f=>{const n=typeof f==='string'?f:f?.fighter;if(n&&!names.includes(n))names.push(n);};
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
  function syncPacketProfileStats(){
    if(typeof DISPLAY_OVERRIDES==='undefined') return [];
    const synced=[];
    Object.entries(DISPLAY_OVERRIDES).forEach(([fighter,override])=>{
      if(!override?.packetProfileStats) return;
      override.snapshotStats={...(override.snapshotStats||{}),...(override.packetProfileStats||{})};
      synced.push(fighter);
    });
    window.UFC_PACKET_PROFILE_STAT_BRIDGE={version:VERSION,synced,appliedAt:new Date().toISOString()};
    return synced;
  }
  function fallbackImage(img){
    if(!img||img.dataset.ufcPhotoFallbackApplied) return;
    const src=img.getAttribute('src')||'';
    if(!src.includes('assets/fighters/')) return;
    img.dataset.ufcPhotoFallbackApplied='true';
    const name=String(img.getAttribute('alt')||'').replace(/\s+profile photo$/i,'').replace(/\s+thumbnail$/i,'').trim();
    const parent=img.closest('.row-photo,.fighter-photo');
    if(!parent) return;
    img.remove();
    if(parent.classList.contains('row-photo')){parent.textContent=initials(name);return;}
    parent.classList.remove('has-photo');
    if(!parent.querySelector('.photo-initials')){
      const fallback=document.createElement('div');
      fallback.className='photo-initials';
      fallback.textContent=initials(name);
      parent.prepend(fallback);
    }
  }
  function installImageFallback(){
    if(fallbackInstalled) return;
    fallbackInstalled=true;
    document.addEventListener('error',event=>{if(event.target?.tagName==='IMG')fallbackImage(event.target);},true);
  }
  function scanBrokenImages(){document.querySelectorAll('img[src*="assets/fighters/"]').forEach(img=>{if(img.complete&&img.naturalWidth===0)fallbackImage(img);});}
  function refreshApp(){if(typeof refresh==='function'){try{refresh();}catch(e){}}setTimeout(scanBrokenImages,250);}
  function packetManifest(){
    const rows=Array.isArray(window.UFC_FIGHTER_PACKET_MANIFEST?.packets)&&window.UFC_FIGHTER_PACKET_MANIFEST.packets.length?window.UFC_FIGHTER_PACKET_MANIFEST.packets:FALLBACK_PACKET_MANIFEST;
    return rows.map(row=>Array.isArray(row)?{slug:row[0],version:row[1]}:row).filter(row=>row?.slug&&row?.version);
  }
  function status(){
    installImageFallback();
    const photoDefaults=applyPhotoPathDefaults();
    const packetProfileStatsSynced=syncPacketProfileStats();
    refreshApp();
    if(window.UFC_HOME_POLISH?.refreshHero) window.UFC_HOME_POLISH.refreshHero();
    const packetAudit=window.UFC_FIGHTER_PACKET_SCHEMA?.auditPackets?window.UFC_FIGHTER_PACKET_SCHEMA.auditPackets():null;
    const manifestPackets=packetManifest();
    window.UFC_PHASE2_DATA_STATUS={version:VERSION,mode:'lightweight-status-hook',fighterPacketManifest:!!window.UFC_FIGHTER_PACKET_MANIFEST,fighterPacketManifestVersion:window.UFC_FIGHTER_PACKET_MANIFEST?.version||'fallback',fighterPacketManifestCount:manifestPackets.length,fighterPacketSchema:!!window.UFC_FIGHTER_PACKET_SCHEMA,rankingDataAdditions:!!window.UFC_RANKING_DATA_ADDITIONS,championshipScoreCorrections:!!window.UFC_CHAMPIONSHIP_SCORE_CORRECTIONS,opponentQualityScoreCorrections:!!window.UFC_OPPONENT_QUALITY_SCORE_CORRECTIONS,primeRoundRowFixes:!!window.UFC_PRIME_ROUND_ROW_FIXES,primeDominanceScoreCorrections:!!window.UFC_PRIME_DOMINANCE_SCORE_CORRECTIONS,longevityScoreCorrections:!!window.UFC_LONGEVITY_SCORE_CORRECTIONS,penaltyScoreCorrections:!!window.UFC_PENALTY_SCORE_CORRECTIONS,apexPeakScoreCorrections:!!window.UFC_APEX_PEAK_SCORE_CORRECTIONS,apexPeakCategoryCard:!!window.UFC_APEX_PEAK_CATEGORY_CARD,categoryLeaders:!!window.UFC_CATEGORY_LEADERS,scoreWeighting:!!window.UFC_SCORE_WEIGHTING,scoreDerivedOvr:!!window.UFC_SCORE_DERIVED_OVR,profileTemplateSystem:!!window.UFC_PROFILE_TEMPLATE_SYSTEM,fighterPackets:!!window.UFC_FIGHTER_PACKET_SYSTEM,watchMoments:!!window.UFC_WATCH_MOMENTS,homePolish:!!window.UFC_HOME_POLISH,divisionRankings:!!window.UFC_DIVISION_RANKINGS,appBranding:!!window.UFC_APP_BRANDING,compareNarrative:!!window.UFC_COMPARE_NARRATIVE_SYSTEM,compareMatchups:!!window.UFC_COMPARE_MATCHUPS,compareNarrativeWatchdog:!!window.UFC_COMPARE_NARRATIVE_WATCHDOG,compareProfiles:typeof COMPARE_PROFILES!=='undefined',compareLedger:typeof COMPARE_FIGHT_LEDGER!=='undefined',rankingAdditionFighters:window.UFC_RANKING_DATA_ADDITIONS?.fighters||[],championshipCorrectedFighters:window.UFC_CHAMPIONSHIP_SCORE_CORRECTIONS?.fighters||[],opponentQualityCorrectedFighters:window.UFC_OPPONENT_QUALITY_SCORE_CORRECTIONS?.fighters||[],primeDominanceCorrectedFighters:window.UFC_PRIME_DOMINANCE_SCORE_CORRECTIONS?.fighters||[],longevityCorrectedFighters:window.UFC_LONGEVITY_SCORE_CORRECTIONS?.fighters||[],penaltyCorrectedFighters:window.UFC_PENALTY_SCORE_CORRECTIONS?.fighters||[],apexPeakCorrectedFighters:window.UFC_APEX_PEAK_SCORE_CORRECTIONS?.fighters||[],scoreWeights:window.UFC_SCORE_WEIGHTING?.weights||null,primeRoundRowFixesDetail:window.UFC_PRIME_ROUND_ROW_FIXES||null,packetFighters:window.UFC_FIGHTER_PACKET_SYSTEM?.fighters||[],watchMomentFighters:window.UFC_WATCH_MOMENTS?.fighters||[],packetProfileStatsSynced,packetAudit,photoDefaults,appliedAt:new Date().toISOString()};
    document.documentElement.setAttribute('data-phase2-data-patch',VERSION);
  }
  function loadScriptOnce(src,attr,done){
    if(document.querySelector(`script[${attr}]`)){if(done)done();return;}
    const script=document.createElement('script');
    script.src=src;
    script.setAttribute(attr,'true');
    script.onload=()=>{if(done)done();};
    script.onerror=()=>{if(done)done();};
    document.body.appendChild(script);
  }
  function loadSequence(items,done){const next=i=>{if(i>=items.length){if(done)done();return;}loadScriptOnce(items[i].src,items[i].attr,()=>next(i+1));};next(0);}
  function packet(slug,v){return{src:`assets/data/fighter-packets/${slug}.js?v=fighter-packet-${slug}-${v}`,attr:`data-fighter-packet-${slug}`};}
  function compareCoreScripts(){
    const packets=packetManifest().map(row=>packet(row.slug,row.version));
    return [
      {src:'assets/data/ranking-data-additions.js?v=ranking-data-additions-20260705f-dricus-oq-apex',attr:'data-ranking-data-additions'},
      {src:'assets/data/fighter-packet-schema.js?v=fighter-packet-schema-20260703a',attr:'data-fighter-packet-schema'},
      {src:'assets/compare-data.js?v=compare-data-20260630a',attr:'data-compare-data'},
      {src:'assets/compare-coverage-pack-1.js?v=compare-coverage-pack-1-20260630a',attr:'data-compare-coverage-pack-1'},
      {src:'assets/compare-coverage-pack-2.js?v=compare-coverage-pack-2-20260630a',attr:'data-compare-coverage-pack-2'},
      {src:'assets/compare-phase2-yan.js?v=compare-phase2-yan-20260701b',attr:'data-compare-phase2-yan'},
      {src:'assets/data/fighter-packets.js?v=fighter-packets-20260702c',attr:'data-fighter-packets'},
      ...packets,
      {src:'assets/data/prime-round-row-fixes.js?v=prime-round-row-fixes-20260704a',attr:'data-prime-round-row-fixes'},
      {src:'assets/data/championship-score-corrections.js?v=championship-score-corrections-20260703b',attr:'data-championship-score-corrections'},
      {src:'assets/data/opponent-quality-score-corrections.js?v=opponent-quality-score-corrections-20260705c-dricus-oq',attr:'data-opponent-quality-score-corrections'},
      {src:'assets/data/prime-dominance-score-corrections.js?v=prime-dominance-score-corrections-20260705c-dricus-195',attr:'data-prime-dominance-score-corrections'},
      {src:'assets/data/longevity-score-corrections.js?v=longevity-score-corrections-20260705b',attr:'data-longevity-score-corrections'},
      {src:'assets/data/penalty-score-corrections.js?v=penalty-score-corrections-20260705a',attr:'data-penalty-score-corrections'},
      {src:'assets/data/apex-peak-score-corrections.js?v=apex-peak-score-corrections-20260705g-dricus-apex-adjust',attr:'data-apex-peak-score-corrections'},
      {src:'assets/data/score-weighting.js?v=score-weighting-20260705b',attr:'data-score-weighting'},
      {src:'assets/js/score-derived-ovr.js?v=score-derived-ovr-20260703d',attr:'data-score-derived-ovr'},
      {src:'assets/js/apex-peak-category-card.js?v=apex-peak-category-card-20260705f',attr:'data-apex-peak-category-card'},
      {src:'assets/js/championship-label-polish.js?v=championship-label-polish-20260703a',attr:'data-championship-label-polish'},
      {src:'assets/data/compare-matchups.js?v=compare-matchups-20260703a',attr:'data-compare-matchups'},
      {src:'assets/compare-mode.js?v=special-matchups-20260630l',attr:'data-compare-mode'},
      {src:'assets/compare-engine-v1-5.js?v=compare-engine-v1-5-20260630b',attr:'data-compare-engine-v1-5'},
      {src:'assets/compare-copy-fixes-v1.js?v=compare-copy-fixes-v1-20260630a',attr:'data-compare-copy-fixes-v1'}
    ];
  }
  function loadModules(){
    const loadCompareWatchdog=()=>loadScriptOnce('assets/js/compare-narrative-watchdog.js?v=compare-narrative-watchdog-20260702a','data-compare-narrative-watchdog',status);
    const loadCompareNarrative=()=>loadScriptOnce('assets/js/compare-narrative-system.js?v=compare-narrative-system-20260703g','data-compare-narrative-system',loadCompareWatchdog);
    const loadCompareCore=()=>loadSequence(compareCoreScripts(),loadCompareNarrative);
    const loadPacketManifest=()=>loadScriptOnce('assets/data/fighter-packet-manifest.js?v=fighter-packet-manifest-20260705f-dricus-prime-195','data-fighter-packet-manifest',loadCompareCore);
    const loadBranding=()=>loadScriptOnce('assets/js/app-branding.js?v=app-branding-20260702c','data-app-branding',loadPacketManifest);
    const loadDivisionRankings=()=>loadScriptOnce('assets/js/division-rankings.js?v=division-rankings-20260705d-fluid-apex','data-division-rankings',loadBranding);
    const loadHomePolish=()=>loadScriptOnce('assets/js/home-polish.js?v=home-polish-hybrid-preview-20260705b','data-home-polish',loadDivisionRankings);
    const loadWatchMoments=()=>loadScriptOnce('assets/js/watch-moments.js?v=watch-moments-20260705b-dricus','data-watch-moments',loadHomePolish);
    const loadPackages=()=>loadScriptOnce('assets/js/fighter-profile-packages.js?v=fighter-profile-packages-20260702a','data-fighter-profile-packages',loadWatchMoments);
    if(window.UFC_PROFILE_TEMPLATE_SYSTEM){loadPackages();return;}
    loadScriptOnce('assets/js/profile-template-system.js?v=profile-template-system-20260702b','data-profile-template-system',loadPackages);
  }

  window.UFC_RANKING_DATA_PATCHES_V1={meta:{purpose:'Status hook and module loader with Dricus Prime Dominance 19.5, Quality Wins/Apex adjustment, round-control rows, Watch Moment, and score weighting',updated:'2026-07-05',version:VERSION},apply:status,slugFor,syncPacketProfileStats,packetManifest};
  installImageFallback();
  applyPhotoPathDefaults();
  syncPacketProfileStats();
  loadModules();
  window.UFC_PHASE2_DATA_REFRESH=status;
})();
