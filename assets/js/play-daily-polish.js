(function(){
  'use strict';

  const VERSION='play-daily-polish-20260716a';

  function injectStyles(){
    if(document.getElementById('play-daily-polish-css'))return;
    const style=document.createElement('style');
    style.id='play-daily-polish-css';
    style.textContent=`
      html[data-play-screen="daily-keep-cut"] #playKeepCutPanel .kc-pack-control,
      html[data-play-screen="daily-keep-cut"] #playKeepCutPanel [data-kc-new],
      html[data-play-screen="daily-keep-cut"] #playKeepCutPanel [data-kc-replay],
      html[data-play-screen="daily-blind-rank"] #playBlindRankPanel .br-pack-control,
      html[data-play-screen="daily-blind-rank"] #playBlindRankPanel [data-br-new],
      html[data-play-screen="daily-blind-rank"] #playBlindRankPanel [data-br-replay]{display:none!important}
      html[data-play-screen="daily-better-than"] #playBetterThanPanel select:disabled{opacity:.72;cursor:not-allowed}
    `;
    document.head.appendChild(style);
  }

  function repairDailyScreen(){
    const screen=document.documentElement.getAttribute('data-play-screen')||'';
    if(!screen.startsWith('daily-'))return;
    const play=document.getElementById('play');
    const hub=document.getElementById('playHub');
    const shell=play?.querySelector('.play-shell');
    const nav=document.getElementById('playGameNav');
    if(screen==='daily-better-than'){
      if(hub)hub.hidden=true;
      if(shell)shell.hidden=false;
      if(nav)nav.hidden=false;
      play?.classList.add('play-game-active');
      document.querySelectorAll('#playBetterThanPanel [data-better-than-target],#playBetterThanPanel [data-better-than-lens],#playBetterThanPanel [data-better-than-pool]').forEach(node=>node.disabled=true);
      nav?.scrollIntoView({block:'start'});
    }
  }

  function scheduleRepair(){
    [40,160,420,900].forEach(delay=>setTimeout(repairDailyScreen,delay));
  }

  injectStyles();
  document.addEventListener('pointerup',event=>{if(event.target.closest?.('.play-daily-card'))scheduleRepair();},true);
  document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.closest?.('.play-daily-card'))scheduleRepair();},true);
  window.addEventListener('ufc-play-state-changed',scheduleRepair);
  document.documentElement.setAttribute('data-play-daily-polish',VERSION);
})();