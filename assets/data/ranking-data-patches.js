// Lightweight post-load status hook.
(function(){
  const VERSION = 'ranking-data-patches-20260702bb-justin-gaethje-watch';
  const SLUG_OVERRIDES = {
    'B.J. Penn':'bj-penn','BJ Penn':'bj-penn','Georges St-Pierre':'georges-st-pierre','T.J. Dillashaw':'tj-dillashaw','TJ Dillashaw':'tj-dillashaw','Junior dos Santos':'junior-dos-santos','Mauricio Rua':'mauricio-rua','Maurício Rua':'mauricio-rua','Zabit Magomedsharipov':'zabit-magomedsharipov'
  };
  let fallbackInstalled = false;

  const DYNAMIC_FIGHTERS = [
    {
      boardRow: {
        rank: 22,
        fighter: 'Justin Gaethje',
        totalScore: 36.3,
        championship: 7.0,
        opponentQuality: 13.2,
        primeDominance: 18.0,
        longevity: 8.1,
        penalty: -10.0,
        leaderboard: 'men',
        gender: 'Men',
        ufcRecord: '12-5',
        primaryDivision: 'Lightweight',
        secondaryDivision: '',
        finishRatePct: 75.0,
        activeEliteYears: 7.0,
        timesFinishedPrime: 5,
        primeRecord: '9-5 in title/elite window',
        roundsWonPct: 58.5,
        notes: 'Runtime test add. Gaethje now gets undisputed lightweight title value, modern lightweight strength, and the locked -10 loss-penalty cap.'
      },
      profile: {
        id: 'JG001',
        fighter: 'Justin Gaethje',
        gender: 'Men',
        primaryDivision: 'Lightweight',
        secondaryDivision: '',
        scope: 'UFC',
        ufcRecord: '12-5',
        ufcWins: 12,
        ufcLosses: 5,
        scoredUfcFights: 17,
        finishWins: 9,
        finishRatePct: 75.0,
        timesFinishedPrime: 5,
        lossPenalty: -10.0,
        activeEliteYears: 7.0,
        primeStart: 'Tony Ferguson 2020',
        primeEnd: 'active/title-level window',
        notes: 'UFC-only. WSOF title is historical context only and is not scored. Loss penalty is capped at -10.',
        rank: 22,
        totalScore: 36.3,
        championship: 7.0,
        opponentQuality: 13.2,
        primeDominance: 18.0,
        longevity: 8.1,
        penalty: -10.0,
        leaderboard: 'men',
        title: {
          normalTitleWins: 1.0,
          interimTitleWins: 2.0,
          vacantUndisputedWins: 0.0,
          secondDivisionUndisputedWins: 0.0,
          vacantSecondDivisionWins: 0.0,
          adjustedTitleWins: 2.5,
          notes: 'Undisputed lightweight title win plus two interim/title-level wins. Total title fight wins = 3.'
        },
        opponents: [
          { opponent: 'Ilia Topuria', date: '2026-06-14', division: 'Lightweight', context: 'Undisputed lightweight title win over reigning champion', credit: 1.2, type: 'Full' },
          { opponent: 'Tony Ferguson', date: '2020-05-09', division: 'Lightweight', context: 'Interim lightweight title win over elite contender', credit: 1.0, type: 'Full' },
          { opponent: 'Dustin Poirier', date: '2023-07-29', division: 'Lightweight', context: 'Elite lightweight rematch win and BMF title moment', credit: 1.0, type: 'Full' },
          { opponent: 'Paddy Pimblett', date: '2026-01-24', division: 'Lightweight', context: 'Interim lightweight title win', credit: 0.8, type: 'Partial' },
          { opponent: 'Michael Chandler', date: '2021-11-06', division: 'Lightweight', context: 'Ranked lightweight war against elite action fighter', credit: 0.8, type: 'Partial' },
          { opponent: 'Rafael Fiziev', date: '2023-03-18', division: 'Lightweight', context: 'Modern ranked lightweight win', credit: 0.75, type: 'Partial' },
          { opponent: 'Edson Barboza', date: '2019-03-30', division: 'Lightweight', context: 'Ranked lightweight knockout win', credit: 0.7, type: 'Partial' },
          { opponent: 'Donald Cerrone', date: '2019-09-14', division: 'Lightweight', context: 'Veteran ranked-name UFC win', credit: 0.55, type: 'Partial' },
          { opponent: 'Michael Johnson', date: '2017-07-07', division: 'Lightweight', context: 'Explosive UFC debut win', credit: 0.45, type: 'Partial' }
        ],
        rounds: [
          { opponent: 'Ilia Topuria', method: 'KO win', roundsWon: 2, roundsCounted: 2 },
          { opponent: 'Tony Ferguson', method: 'TKO win', roundsWon: 4, roundsCounted: 5 },
          { opponent: 'Dustin Poirier 2', method: 'KO win', roundsWon: 1, roundsCounted: 2 },
          { opponent: 'Michael Chandler', method: 'Decision win', roundsWon: 2, roundsCounted: 3 },
          { opponent: 'Rafael Fiziev', method: 'Decision win', roundsWon: 2, roundsCounted: 3 },
          { opponent: 'Khabib Nurmagomedov', method: 'Submission loss', roundsWon: 0, roundsCounted: 2 },
          { opponent: 'Charles Oliveira', method: 'Submission loss', roundsWon: 0, roundsCounted: 1 },
          { opponent: 'Max Holloway', method: 'KO loss', roundsWon: 1, roundsCounted: 5 }
        ]
      }
    }
  ];

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
  function upsertByFighter(rows,row){
    if(!Array.isArray(rows) || !row?.fighter) return;
    const index=rows.findIndex(x=>x?.fighter===row.fighter);
    if(index>=0){ rows[index]={...rows[index],...row}; return; }
    rows.push(row);
  }
  function addCompareOption(name){
    ['fighterA','fighterB'].forEach(id=>{
      const select=document.getElementById(id);
      if(!select || Array.from(select.options).some(o=>o.value===name)) return;
      const option=document.createElement('option');
      option.value=name;
      option.textContent=name;
      select.appendChild(option);
    });
  }
  function applyDynamicFighterRows(){
    if(!window.RANKING_DATA) return [];
    const added=[];
    DYNAMIC_FIGHTERS.forEach(item=>{
      upsertByFighter(window.RANKING_DATA.men,item.boardRow);
      upsertByFighter(window.RANKING_DATA.fighters,item.profile);
      addCompareOption(item.boardRow.fighter);
      added.push(item.boardRow.fighter);
    });
    window.RANKING_DATA.men.sort((a,b)=>Number(a.rank||999)-Number(b.rank||999) || Number(b.totalScore||0)-Number(a.totalScore||0));
    window.UFC_DYNAMIC_FIGHTER_ROWS={version:VERSION,fighters:added,appliedAt:new Date().toISOString()};
    return added;
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
    const dynamicFighters=applyDynamicFighterRows();
    const photoDefaults=applyPhotoPathDefaults();
    const packetProfileStatsSynced=syncPacketProfileStats();
    refreshApp();
    window.UFC_PHASE2_DATA_STATUS={version:VERSION,mode:'lightweight-status-hook',profileTemplateSystem:!!window.UFC_PROFILE_TEMPLATE_SYSTEM,fighterProfilePackages:!!window.UFC_FIGHTER_PROFILE_PACKAGES,fighterPackets:!!window.UFC_FIGHTER_PACKET_SYSTEM,watchMoments:!!window.UFC_WATCH_MOMENTS,homePolish:!!window.UFC_HOME_POLISH,divisionRankings:!!window.UFC_DIVISION_RANKINGS,appBranding:!!window.UFC_APP_BRANDING,compareNarrative:!!window.UFC_COMPARE_NARRATIVE_SYSTEM,compareVerdictClarity:!!window.UFC_COMPARE_VERDICT_CLARITY,compareNarrativeWatchdog:!!window.UFC_COMPARE_NARRATIVE_WATCHDOG,compareProfiles:typeof COMPARE_PROFILES!=='undefined',compareLedger:typeof COMPARE_FIGHT_LEDGER!=='undefined',dynamicFighters,packagedFighters:window.UFC_FIGHTER_PROFILE_PACKAGES?.fighters||[],packetFighters:window.UFC_FIGHTER_PACKET_SYSTEM?.fighters||[],watchMomentFighters:window.UFC_WATCH_MOMENTS?.fighters||[],packetProfileStatsSynced,photoDefaults,appliedAt:new Date().toISOString()};
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
      {src:'assets/data/fighter-packets.js?v=fighter-packets-20260702a',attr:'data-fighter-packets'},
      {src:'assets/data/fighter-packets/demetrious-johnson.js?v=fighter-packet-demetrious-johnson-20260702a',attr:'data-fighter-packet-demetrious-johnson'},
      {src:'assets/data/fighter-packets/anderson-silva.js?v=fighter-packet-anderson-silva-20260702a',attr:'data-fighter-packet-anderson-silva'},
      {src:'assets/data/fighter-packets/khabib-nurmagomedov.js?v=fighter-packet-khabib-nurmagomedov-20260702a',attr:'data-fighter-packet-khabib-nurmagomedov'},
      {src:'assets/data/fighter-packets/islam-makhachev.js?v=fighter-packet-islam-makhachev-20260702a',attr:'data-fighter-packet-islam-makhachev'},
      {src:'assets/data/fighter-packets/alexander-volkanovski.js?v=fighter-packet-alexander-volkanovski-20260702a',attr:'data-fighter-packet-alexander-volkanovski'},
      {src:'assets/data/fighter-packets/randy-couture.js?v=fighter-packet-randy-couture-20260702a',attr:'data-fighter-packet-randy-couture'},
      {src:'assets/data/fighter-packets/max-holloway.js?v=fighter-packet-max-holloway-20260702a',attr:'data-fighter-packet-max-holloway'},
      {src:'assets/data/fighter-packets/kamaru-usman.js?v=fighter-packet-kamaru-usman-20260702a',attr:'data-fighter-packet-kamaru-usman'},
      {src:'assets/data/fighter-packets/jose-aldo.js?v=fighter-packet-jose-aldo-20260702a',attr:'data-fighter-packet-jose-aldo'},
      {src:'assets/data/fighter-packets/matt-hughes.js?v=fighter-packet-matt-hughes-20260702a',attr:'data-fighter-packet-matt-hughes'},
      {src:'assets/data/fighter-packets/daniel-cormier.js?v=fighter-packet-daniel-cormier-20260702a',attr:'data-fighter-packet-daniel-cormier'},
      {src:'assets/data/fighter-packets/stipe-miocic.js?v=fighter-packet-stipe-miocic-20260702a',attr:'data-fighter-packet-stipe-miocic'},
      {src:'assets/data/fighter-packets/ilia-topuria.js?v=fighter-packet-ilia-topuria-20260702a',attr:'data-fighter-packet-ilia-topuria'},
      {src:'assets/data/fighter-packets/israel-adesanya.js?v=fighter-packet-israel-adesanya-20260702a',attr:'data-fighter-packet-israel-adesanya'},
      {src:'assets/data/fighter-packets/petr-yan.js?v=fighter-packet-petr-yan-20260702b',attr:'data-fighter-packet-petr-yan'},
      {src:'assets/data/fighter-packets/cain-velasquez.js?v=fighter-packet-cain-velasquez-20260702b',attr:'data-fighter-packet-cain-velasquez'},
      {src:'assets/data/fighter-packets/merab-dvalishvili.js?v=fighter-packet-merab-dvalishvili-20260702b',attr:'data-fighter-packet-merab-dvalishvili'},
      {src:'assets/data/fighter-packets/bj-penn.js?v=fighter-packet-bj-penn-20260702b',attr:'data-fighter-packet-bj-penn'},
      {src:'assets/data/fighter-packets/alex-pereira.js?v=fighter-packet-alex-pereira-20260702c',attr:'data-fighter-packet-alex-pereira'},
      {src:'assets/data/fighter-packets/chuck-liddell.js?v=fighter-packet-chuck-liddell-20260702a',attr:'data-fighter-packet-chuck-liddell'},
      {src:'assets/data/fighter-packets/dominick-cruz.js?v=fighter-packet-dominick-cruz-20260702a',attr:'data-fighter-packet-dominick-cruz'},
      {src:'assets/data/fighter-packets/francis-ngannou.js?v=fighter-packet-francis-ngannou-20260702a',attr:'data-fighter-packet-francis-ngannou'},
      {src:'assets/data/fighter-packets/charles-oliveira.js?v=fighter-packet-charles-oliveira-20260702a',attr:'data-fighter-packet-charles-oliveira'},
      {src:'assets/data/fighter-packets/henry-cejudo.js?v=fighter-packet-henry-cejudo-20260702a',attr:'data-fighter-packet-henry-cejudo'},
      {src:'assets/data/fighter-packets/conor-mcgregor.js?v=fighter-packet-conor-mcgregor-20260702a',attr:'data-fighter-packet-conor-mcgregor'},
      {src:'assets/data/fighter-packets/justin-gaethje.js?v=fighter-packet-justin-gaethje-20260702c',attr:'data-fighter-packet-justin-gaethje'},
      {src:'assets/data/fighter-packets/amanda-nunes.js?v=fighter-packet-amanda-nunes-20260702a',attr:'data-fighter-packet-amanda-nunes'},
      {src:'assets/data/fighter-packets/valentina-shevchenko.js?v=fighter-packet-valentina-shevchenko-20260702a',attr:'data-fighter-packet-valentina-shevchenko'},
      {src:'assets/data/fighter-packets/joanna-jedrzejczyk.js?v=fighter-packet-joanna-jedrzejczyk-20260702b',attr:'data-fighter-packet-joanna-jedrzejczyk'},
      {src:'assets/data/fighter-packets/ronda-rousey.js?v=fighter-packet-ronda-rousey-20260702b',attr:'data-fighter-packet-ronda-rousey'},
      {src:'assets/compare-mode.js?v=special-matchups-20260630l',attr:'data-compare-mode'},
      {src:'assets/compare-engine-v1-5.js?v=compare-engine-v1-5-20260630b',attr:'data-compare-engine-v1-5'},
      {src:'assets/compare-copy-fixes-v1.js?v=compare-copy-fixes-v1-20260630a',attr:'data-compare-copy-fixes-v1'}
    ];
    const loadCompareWatchdog=()=>loadScriptOnce('assets/js/compare-narrative-watchdog.js?v=compare-narrative-watchdog-20260702a','data-compare-narrative-watchdog',status);
    const loadCompareClarity=()=>loadScriptOnce('assets/js/compare-verdict-clarity.js?v=compare-verdict-clarity-20260702a','data-compare-verdict-clarity',loadCompareWatchdog);
    const loadCompareNarrative=()=>loadScriptOnce('assets/js/compare-narrative-system.js?v=compare-narrative-system-20260702k','data-compare-narrative-system',loadCompareClarity);
    const loadCompareCore=()=>loadSequence(compareCoreScripts,loadCompareNarrative);
    const loadBranding=()=>loadScriptOnce('assets/js/app-branding.js?v=app-branding-20260702c','data-app-branding',loadCompareCore);
    const loadDivisionRankings=()=>loadScriptOnce('assets/js/division-rankings.js?v=division-rankings-20260702f','data-division-rankings',loadBranding);
    const loadHomePolish=()=>loadScriptOnce('assets/js/home-polish.js?v=home-polish-hybrid-preview-20260702a','data-home-polish',loadDivisionRankings);
    const loadWatchMoments=()=>loadScriptOnce('assets/js/watch-moments.js?v=watch-moments-20260702c','data-watch-moments',loadHomePolish);
    const loadPackages=()=>loadScriptOnce('assets/js/fighter-profile-packages.js?v=fighter-profile-packages-20260702a','data-fighter-profile-packages',loadWatchMoments);
    if(window.UFC_PROFILE_TEMPLATE_SYSTEM){ loadPackages(); return; }
    loadScriptOnce('assets/js/profile-template-system.js?v=profile-template-system-20260701a','data-profile-template-system',loadPackages);
  }
  window.UFC_RANKING_DATA_PATCHES_V1={meta:{purpose:'Status hook, module loader, default fighter photo paths, compare verdict clarity loader, fighter packet loader, fighter packet stat bridge, and temporary new-fighter runtime add-on',updated:'2026-07-02',version:VERSION},apply:status,slugFor,syncPacketProfileStats,applyDynamicFighterRows};
  installImageFallback();
  applyDynamicFighterRows();
  applyPhotoPathDefaults();
  syncPacketProfileStats();
  loadModules();
  window.UFC_PHASE2_DATA_REFRESH=status;
})();