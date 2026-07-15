(function(){
  'use strict';

  const VERSION='blind-rank-polish-20260715b';

  function injectStyles(){
    if(document.getElementById('blind-rank-polish-css')) return;
    const style=document.createElement('style');
    style.id='blind-rank-polish-css';
    style.textContent=`
      #play .br-current-meta,#play .br-result-row em{display:none!important}
      #play .br-result-row{grid-template-columns:42px 48px minmax(0,1fr)!important}
      @media(max-width:700px){#play .br-result-row{grid-template-columns:34px 42px minmax(0,1fr)!important}}
    `;
    document.head.appendChild(style);
  }

  function sharedChallenge(){
    const url=new URL(window.location.href);
    if(url.searchParams.get('game')!=='blind-rank') return null;
    const ids=(url.searchParams.get('brlineup')||'').split(',').map(value=>value.trim()).filter(Boolean);
    if(ids.length!==5||new Set(ids).size!==5) return null;
    const data=window.UFC_PLAY_DATA;
    const game=window.UFC_BLIND_RANK;
    if(!data||!game) return null;
    const lineup=ids.map(id=>data.resolve(id));
    if(lineup.some(fighter=>!fighter)) return null;
    return {lineup,packId:url.searchParams.get('brpack')||'men-chaos',shared:true};
  }

  function openSharedChallenge(){
    const challenge=sharedChallenge();
    if(!challenge) return;
    document.querySelector('.tab[data-view="play"]')?.click();
    window.setTimeout(()=>window.UFC_BLIND_RANK?.open(challenge),120);
  }

  injectStyles();
  window.setTimeout(openSharedChallenge,320);
  window.addEventListener('ufc-blind-rank-ready',()=>window.setTimeout(openSharedChallenge,160),{once:true});
  document.documentElement.setAttribute('data-blind-rank-polish',VERSION);
})();
