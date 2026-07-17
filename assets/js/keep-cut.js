(function(){
  'use strict';

  const VERSION='keep-cut-bootstrap-20260717n-hub-open-fix';
  const BATCH_SRC='assets/data/play-roster-batch-one.js?v=play-roster-batch-one-20260717c-current-audit';
  const BATCH_VERSION='play-roster-batch-one-20260717c-current-audit';
  const COMPARE_SRCS=[
    'assets/data/compare-profiles-batch-one-a.js?v=compare-profiles-batch-one-a-20260717b',
    'assets/data/compare-profiles-batch-one-b.js?v=compare-profiles-batch-one-b-20260717b',
    'assets/data/compare-profiles-batch-one-c.js?v=compare-profiles-batch-one-c-20260717b'
  ];
  const DISPLAY_SRC='assets/data/display-overrides-batch-one.js?v=display-overrides-batch-one-20260717a';
  const CURRENT_PATCH_SRC='assets/data/play-roster-batch-one-current-patch.js?v=play-roster-batch-one-current-patch-20260717b';
  const CHAMPION_ELIGIBILITY_SRC='assets/data/keep-cut-champion-eligibility-patch.js?v=keep-cut-champion-eligibility-20260717a';
  const LEDGER_SRC='assets/data/keep-cut-category-ratings.js?v=keep-cut-category-ratings-20260717a-phase-one';
  const ENGINE_SRC='assets/js/keep-cut-v2.js?v=keep-cut-20260717e-full-roster-ledger';
  const PHASE_THREE_SRC='assets/js/keep-cut-phase3.js?v=keep-cut-20260717f-absolute-role-engine';
  const PHASE_THREE_VERSION='keep-cut-20260717f-absolute-role-engine';
  const PHASE_FOUR_SRC='assets/js/keep-cut-phase4.js?v=keep-cut-20260717h-category-lineup';
  const PHASE_FOUR_VERSION='keep-cut-20260717h-category-lineup';
  let waitingForOpen=false;

  function loadScript(src,marker,onload){
    const existing=document.querySelector(`script[${marker}]`);
    if(existing){
      if(existing.dataset.loaded==='true'||existing.readyState==='complete')onload?.();
      else existing.addEventListener('load',()=>{existing.dataset.loaded='true';onload?.();},{once:true});
      return;
    }
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    script.setAttribute(marker,'true');
    script.addEventListener('load',()=>{script.dataset.loaded='true';onload?.();},{once:true});
    script.addEventListener('error',()=>document.documentElement.setAttribute('data-keep-cut','dependency-load-error'),{once:true});
    document.head.appendChild(script);
  }

  function keepCutCard(){
    return document.querySelector('#playHub [data-open-game="keep-cut"], #playHub [data-coming-game="Keep 4, Cut 4"]');
  }

  function markCardLive(){
    const card=keepCutCard();
    if(!card)return null;
    card.classList.remove('is-coming');
    card.classList.add('is-live');
    card.removeAttribute('data-coming-game');
    card.dataset.openGame='keep-cut';
    const status=card.querySelector('.play-game-card-top em');
    const action=card.querySelector('.play-game-action');
    if(status)status.textContent='PLAY NOW';
    if(action)action.textContent='OPEN GAME →';
    return card;
  }

  function openKeepCut(){
    const game=window.UFC_KEEP_CUT;
    if(game?.open){
      waitingForOpen=false;
      game.open();
      return true;
    }
    if(waitingForOpen)return false;
    waitingForOpen=true;
    const card=markCardLive();
    const status=card?.querySelector('.play-game-card-top em');
    if(status)status.textContent='LOADING…';
    window.addEventListener('ufc-keep-cut-ready',()=>{
      waitingForOpen=false;
      markCardLive();
      window.UFC_KEEP_CUT?.open?.();
    },{once:true});
    return false;
  }

  function installHubBridge(){
    const card=markCardLive();
    if(!card||card.dataset.keepCutHubBridge==='true')return;
    card.dataset.keepCutHubBridge='true';
    card.addEventListener('click',event=>{
      event.preventDefault();
      event.stopImmediatePropagation();
      openKeepCut();
    },true);
  }

  function loadPhaseFour(){
    if(window.UFC_KEEP_CUT?.version===PHASE_FOUR_VERSION){installHubBridge();return;}
    if(document.querySelector('script[data-keep-cut-phase-four-loader]'))return;
    loadScript(PHASE_FOUR_SRC,'data-keep-cut-phase-four-loader',installHubBridge);
  }

  function loadPhaseThree(){
    const version=window.UFC_KEEP_CUT?.version;
    if(version===PHASE_FOUR_VERSION){installHubBridge();return;}
    if(version===PHASE_THREE_VERSION){loadPhaseFour();return;}
    loadScript(PHASE_THREE_SRC,'data-keep-cut-phase-three-loader',loadPhaseFour);
  }

  function loadEngine(){
    if(window.UFC_KEEP_CUT){loadPhaseThree();return;}
    loadScript(ENGINE_SRC,'data-keep-cut-v2-loader',loadPhaseThree);
  }

  function loadLedger(){
    if(window.UFC_KEEP_CUT_CATEGORY_RATINGS){loadEngine();return;}
    window.addEventListener('ufc-keep-cut-ratings-ready',loadEngine,{once:true});
    if(document.querySelector('script[data-keep-cut-category-ratings-loader]'))return;
    loadScript(LEDGER_SRC,'data-keep-cut-category-ratings-loader',()=>{});
  }

  function loadChampionEligibility(){
    loadScript(CHAMPION_ELIGIBILITY_SRC,'data-keep-cut-champion-eligibility-loader',loadLedger);
  }

  function loadCurrentPatch(){
    loadScript(CURRENT_PATCH_SRC,'data-keep-cut-batch-one-current-patch',loadChampionEligibility);
  }

  function loadDisplayOverrides(){
    loadScript(DISPLAY_SRC,'data-keep-cut-batch-one-display-overrides',loadCurrentPatch);
  }

  function loadCompare(index=0){
    if(index>=COMPARE_SRCS.length){loadDisplayOverrides();return;}
    const marker=`data-keep-cut-batch-one-compare-${index+1}`;
    loadScript(COMPARE_SRCS[index],marker,()=>loadCompare(index+1));
  }

  function loadBatch(){
    if(window.UFC_PLAY_ROSTER_BATCH_ONE?.version===BATCH_VERSION){loadCompare();return;}
    loadScript(BATCH_SRC,'data-keep-cut-roster-batch-one-loader',loadCompare);
  }

  document.documentElement.setAttribute('data-keep-cut-bootstrap',VERSION);
  installHubBridge();
  window.addEventListener('ufc-play-hub-ready',installHubBridge);
  window.addEventListener('ufc-keep-cut-ready',installHubBridge);
  [100,400,1000,2000].forEach(delay=>setTimeout(installHubBridge,delay));
  loadBatch();
})();