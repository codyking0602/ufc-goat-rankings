(function(){
  'use strict';

  const VERSION='blind-daily-startup-fix-20260715a';
  let attempts=0;
  let timer=null;

  function usableRows(rows){
    return (rows||[]).filter(row=>{
      const rank=Number(row?.rank);
      const score=Number(row?.totalScore ?? row?.rawScore);
      return Boolean(row?.fighter)&&Number.isFinite(rank)&&rank>0&&Number.isFinite(score);
    });
  }

  function modelDataIsUsable(){
    const data=window.RANKING_DATA||{};
    return usableRows(data.men).length>=2;
  }

  function blindNeedsKick(){
    const game=window.UFC_BLIND_MATCHMAKING;
    const panel=document.getElementById('playBlindPanel');
    return Boolean(game?.state?.waitingForModel&&panel&&!panel.hidden);
  }

  function kickBlindGame(){
    if(!blindNeedsKick()||!modelDataIsUsable())return false;
    document.documentElement.setAttribute('data-scoring-pipeline','ready');
    window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-ready',{detail:{source:VERSION,fallback:true}}));
    document.documentElement.setAttribute('data-blind-daily-startup-fix',VERSION);
    return true;
  }

  function check(){
    attempts+=1;
    if(kickBlindGame()||attempts>=40){
      if(timer)window.clearInterval(timer);
      timer=null;
    }
  }

  window.addEventListener('ufc-production-ranking-ready',check);
  window.addEventListener('ufc-scoring-pipeline-ready',()=>{
    if(window.UFC_SCORING_PIPELINE?.status==='ready')document.documentElement.setAttribute('data-scoring-pipeline','ready');
  });
  document.addEventListener('click',event=>{
    if(event.target.closest?.('[data-open-game="blind"],[data-play-mode="blind"]'))window.setTimeout(check,80);
  },true);

  timer=window.setInterval(check,250);
  window.setTimeout(check,0);
})();
