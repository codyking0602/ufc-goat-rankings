// Lightweight post-load status hook and module loader.
(function(){
  const VERSION='ranking-data-patches-20260709a-prime-dominance-core';
  const SLUG_OVERRIDES={'B.J. Penn':'bj-penn','BJ Penn':'bj-penn','Georges St-Pierre':'georges-st-pierre','T.J. Dillashaw':'tj-dillashaw','TJ Dillashaw':'tj-dillashaw','Junior dos Santos':'junior-dos-santos',"Sean O'Malley":'sean-omalley','Julianna Peña':'julianna-pena','Julianna Pena':'julianna-pena'};
  function slugFor(name){return SLUG_OVERRIDES[name]||String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/['’]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
  function initials(name){return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'UFC';}
  function fighterNames(){const names=[];const push=f=>{const n=typeof f==='string'?f:f?.fighter;if(n&&!names.includes(n))names.push(n);};(window.RANKING_DATA?.fighters||[]).forEach(push);(window.RANKING_DATA?.men||[]).forEach(push);(window.RANKING_DATA?.women||[]).forEach(push);return names;}
  function applyPhotoPathDefaults(){if(typeof DISPLAY_OVERRIDES==='undefined')return[];const mapped=[];fighterNames().forEach(name=>{const slug=slugFor(name);if(!slug)return;const current=DISPLAY_OVERRIDES[name]||{};DISPLAY_OVERRIDES[name]={...current,photoUrl:current.photoUrl||`assets/fighters/${slug}.webp`,thumbUrl:current.thumbUrl||`assets/fighters/${slug}-thumb.webp`};mapped.push({fighter:name,photoUrl:DISPLAY_OVERRIDES[name].photoUrl,thumbUrl:DISPLAY_OVERRIDES[name].thumbUrl});});window.UFC_PHOTO_PATH_DEFAULTS={version:VERSION,mapped};return mapped;}
  function syncPacketProfileStats(){if(typeof DISPLAY_OVERRIDES==='undefined')return[];const synced=[];Object.entries(DISPLAY_OVERRIDES).forEach(([fighter,override])=>{if(!override?.packetProfileStats)return;override.snapshotStats={...(override.snapshotStats||{}),...(override.packetProfileStats||{})};synced.push(fighter);});window.UFC_PACKET_PROFILE_STAT_BRIDGE={version:VERSION,synced,appliedAt:new Date().toISOString()};return synced;}
  function fallbackImage(img){if(!img||img.dataset.ufcPhotoFallbackApplied)return;const src=img.getAttribute('src')||'';if(!src.includes('assets/fighters/'))return;img.dataset.ufcPhotoFallbackApplied='true';const name=String(img.getAttribute('alt')||'').replace(/\s+profile photo$/i,'').replace(/\s+thumbnail$/i,'').trim();const parent=img.closest('.row-photo,.fighter-photo,.ov-card-photo');if(!parent)return;img.remove();if(parent.classList.contains('row-photo')||parent.classList.contains('ov-card-photo')){parent.textContent=initials(name);return;}parent.classList.remove('has-photo');if(!parent.querySelector('.photo-initials')){const fallback=document.createElement('div');fallback.className='photo-initials';fallback.textContent=initials(name);parent.prepend(fallback);}}
  function installImageFallback(){if(window.__UFC_PHOTO_FALLBACK_INSTALLED)return;window.__UFC_PHOTO_FALLBACK_INSTALLED=true;document.addEventListener('error',event=>{if(event.target?.tagName==='IMG')fallbackImage(event.target);},true);}
  function scanBrokenImages(){document.querySelectorAll('img[src*="assets/fighters/"]').forEach(img=>{if(img.complete&&img.naturalWidth===0)fallbackImage(img);});}
  function status(){installImageFallback();const photoDefaults=applyPhotoPathDefaults();const packetProfileStatsSynced=syncPacketProfileStats();if(window.UFC_PRIME_WINDOWS?.apply)window.UFC_PRIME_WINDOWS.apply();if(window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER?.apply)window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER.apply();if(window.UFC_DYNAMIC_RANKS?.apply)window.UFC_DYNAMIC_RANKS.apply();if(typeof refresh==='function'){try{refresh();}catch(e){}}if(window.UFC_HOME_POLISH?.refreshHero)window.UFC_HOME_POLISH.refreshHero();if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render)window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render();if(window.UFC_CATEGORY_LEADERS?.render)window.UFC_CATEGORY_LEADERS.render();if(window.UFC_CATEGORY_LEADERS_PRIME_ROW_POLISH?.polish)window.UFC_CATEGORY_LEADERS_PRIME_ROW_POLISH.polish();setTimeout(scanBrokenImages,250);window.UFC_PHASE2_DATA_STATUS={version:VERSION,mode:'prime-dominance-core-loader',primeDominanceShadow:window.UFC_PRIME_DOMINANCE_SHADOW_MODEL||null,primeDominanceLive:window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER||null,primeDominanceLegacyCorrections:window.UFC_PRIME_DOMINANCE_SCORE_CORRECTIONS||null,championshipResumeLive:window.UFC_CHAMPIONSHIP_RESUME_LIVE||null,opponentQualityLive:window.UFC_OPPONENT_QUALITY_LIVE||null,categoryPercentileTiers:window.UFC_CATEGORY_PERCENTILE_TIERS||null,photoDefaults,packetProfileStatsSynced,appliedAt:new Date().toISOString()};document.documentElement.setAttribute('data-phase2-data-patch',VERSION);}
  function loadScriptOnce(src,attr,done){if(document.querySelector(`script[${attr}]`)){if(done)done();return;}const script=document.createElement('script');script.src=src;script.setAttribute(attr,'true');script.onload=()=>{if(done)done();};script.onerror=()=>{if(done)done();};document.body.appendChild(script);}
  function loadSequence(items,done){const next=i=>{if(i>=items.length){if(done)done();return;}loadScriptOnce(items[i].src,items[i].attr,()=>next(i+1));};next(0);}
  function coreScripts(){return[
    {src:'assets/data/fighter-packet-schema.js?v=fighter-packet-schema-20260703a',attr:'data-fighter-packet-schema'},
    {src:'assets/compare-data.js?v=compare-data-20260630a',attr:'data-compare-data'},
    {src:'assets/compare-coverage-pack-1.js?v=compare-coverage-pack-1-20260630a',attr:'data-compare-coverage-pack-1'},
    {src:'assets/compare-coverage-pack-2.js?v=compare-coverage-pack-2-20260630a',attr:'data-compare-coverage-pack-2'},
    {src:'assets/compare-phase2-yan.js?v=compare-phase2-yan-20260701b',attr:'data-compare-phase2-yan'},
    {src:'assets/js/card-nicknames.js?v=card-nicknames-20260706n-robbie-lawler',attr:'data-card-nicknames'},
    {src:'assets/js/rank-fluidity-fixes.js?v=rank-fluidity-fixes-20260706b',attr:'data-rank-fluidity-fixes'},
    {src:'assets/data/prime-round-row-fixes.js?v=prime-round-row-fixes-20260704a',attr:'data-prime-round-row-fixes'},
    {src:'assets/data/championship-score-corrections.js?v=championship-score-corrections-20260706d-women-display-ranks',attr:'data-championship-score-corrections'},
    {src:'assets/data/opponent-quality-score-corrections.js?v=opponent-quality-score-corrections-20260705c-dricus-oq',attr:'data-opponent-quality-score-corrections'},
    {src:'assets/data/longevity-score-corrections.js?v=longevity-score-corrections-20260705b',attr:'data-longevity-score-corrections'},
    {src:'assets/data/penalty-score-corrections.js?v=penalty-score-corrections-20260705a',attr:'data-penalty-score-corrections'},
    {src:'assets/data/apex-peak-score-corrections.js?v=apex-peak-score-corrections-20260706a-sean-whittaker',attr:'data-apex-peak-score-corrections'},
    {src:'assets/data/score-weighting.js?v=score-weighting-20260708c-prime-dominance-shadow-loader',attr:'data-score-weighting'},
    {src:'assets/js/score-derived-ovr.js?v=score-derived-ovr-20260707b-82-99-score-scale',attr:'data-score-derived-ovr'},
    {src:'assets/js/apex-peak-category-card.js?v=apex-peak-category-card-20260708b-prime-row-polish',attr:'data-apex-peak-category-card'},
    {src:'assets/js/category-percentile-tiers.js?v=category-percentile-tiers-20260708b-live-prime-dominance-final',attr:'data-category-percentile-tiers'},
    {src:'assets/data/championship-resume-ledgers.js?v=championship-resume-ledgers-20260707a',attr:'data-championship-resume-ledgers'},
    {src:'assets/data/championship-resume-ledger-rule-locks.js?v=championship-resume-ledger-rule-locks-20260707b',attr:'data-championship-resume-ledger-rule-locks'},
    {src:'assets/js/championship-resume-shadow.js?v=championship-resume-shadow-20260707e',attr:'data-championship-resume-shadow'},
    {src:'assets/js/championship-resume-live.js?v=championship-resume-live-20260708f',attr:'data-championship-resume-live'},
    {src:'assets/js/championship-label-polish.js?v=championship-label-polish-20260703a',attr:'data-championship-label-polish'},
    {src:'assets/data/compare-matchups.js?v=compare-matchups-20260703a',attr:'data-compare-matchups'},
    {src:'assets/compare-mode.js?v=special-matchups-20260630l',attr:'data-compare-mode'},
    {src:'assets/compare-engine-v1-5.js?v=compare-engine-v1-5-20260630b',attr:'data-compare-engine-v1-5'},
    {src:'assets/compare-copy-fixes-v1.js?v=compare-copy-fixes-v1-20260630a',attr:'data-compare-copy-fixes-v1'},
    {src:'assets/js/division-rankings.js?v=division-rankings-20260705e-clean-leaderboard',attr:'data-division-rankings'},
    {src:'assets/js/home-polish.js?v=home-polish-hybrid-preview-20260705b',attr:'data-home-polish'},
    {src:'assets/js/watch-moments.js?v=watch-moments-20260706t-robbie-lawler',attr:'data-watch-moments'},
    {src:'assets/js/octagon-verdict-compare-launcher.js?v=octagon-verdict-compare-launcher-20260707a',attr:'data-octagon-verdict-compare-launcher'},
    {src:'assets/js/compare-narrative-system.js?v=compare-narrative-system-20260703g',attr:'data-compare-narrative-system'},
    {src:'assets/js/compare-narrative-watchdog.js?v=compare-narrative-watchdog-20260702a',attr:'data-compare-narrative-watchdog'}
  ];}
  function loadModules(){loadSequence(coreScripts(),status);}
  window.UFC_RANKING_DATA_PATCHES_V1={meta:{purpose:'Prime Dominance core loader',updated:'2026-07-09',version:VERSION},apply:status,slugFor,syncPacketProfileStats};
  installImageFallback();applyPhotoPathDefaults();syncPacketProfileStats();loadModules();window.OCTAGON_VERDICT_GPT_URL='https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';window.UFC_PHASE2_DATA_REFRESH=status;
})();
