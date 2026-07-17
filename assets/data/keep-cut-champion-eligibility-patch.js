(function(){
  'use strict';

  const VERSION='keep-cut-champion-eligibility-20260717a';

  function apply(){
    const play=window.UFC_PLAY_DATA;
    if(!play)return false;
    (play.allFighters||[]).forEach(fighter=>{
      const tags=new Set(fighter.tags||[]);
      if(!tags.has('current-champion')&&!tags.has('champion'))return;
      // Legacy Keep Cut eligibility treats this as a recognized-champion alias.
      tags.add('former-champion');
      fighter.tags=[...tags];
    });
    document.documentElement.setAttribute('data-keep-cut-champion-eligibility',VERSION);
    return true;
  }

  function wrap(){
    const play=window.UFC_PLAY_DATA;
    if(!play||play.__keepCutChampionEligibilityWrapped)return;
    const native=play.rebuild?.bind(play);
    play.rebuild=function(){
      const result=native?.();
      apply();
      return result||play;
    };
    play.__keepCutChampionEligibilityWrapped=true;
  }

  apply();
  wrap();
  window.addEventListener('ufc-play-data-ready',apply);
  window.UFC_KEEP_CUT_CHAMPION_ELIGIBILITY={version:VERSION,apply};
})();
