(function(){
  'use strict';

  const VERSION='play-challenges-paused-20260715a';
  const SELECTOR='[data-kc-challenge],[data-br-challenge],[data-five-round-share]';
  const url=new URL(window.location.href);
  const hasIncoming=Boolean(url.searchParams.get('challenge')||String(url.hash||'').match(/(?:^#|[&#])challenge=/i));

  function notice(message){
    let node=document.getElementById('playChallengesPausedToast');
    if(!node){
      node=document.createElement('div');
      node.id='playChallengesPausedToast';
      node.setAttribute('role','status');
      node.style.cssText='position:fixed;left:50%;bottom:22px;z-index:4000;transform:translateX(-50%);max-width:calc(100% - 32px);border:1px solid rgba(249,115,22,.7);border-radius:999px;background:#101725;color:#fed7aa;padding:10px 14px;font:800 12px/1.25 system-ui;text-align:center;box-shadow:0 14px 40px rgba(0,0,0,.35)';
      document.body.appendChild(node);
    }
    node.textContent=message;
    clearTimeout(notice.timer);
    notice.timer=setTimeout(()=>node.remove(),3200);
  }

  function showPausedBanner(){
    const host=document.getElementById('playHub')||document.querySelector('#play .play-shell');
    if(!host||document.getElementById('playChallengesPausedBanner'))return;
    const banner=document.createElement('div');
    banner.id='playChallengesPausedBanner';
    banner.style.cssText='margin:0 0 14px;border:1px solid rgba(249,115,22,.55);border-radius:16px;background:#101725;padding:13px;color:#f8fafc;text-align:center';
    banner.innerHTML='<strong style="display:block;color:#fdba74;font:900 13px/1.2 system-ui">FRIEND CHALLENGES TEMPORARILY PAUSED</strong><span style="display:block;margin-top:5px;color:#cbd5e1;font:600 11px/1.4 system-ui">The local games remain available while the link flow is rebuilt cleanly.</span>';
    host.prepend(banner);
  }

  function handleIncoming(){
    if(!hasIncoming)return;
    ['challenge','playbuild','group','room','event','archive','game','kcpack','kclineup','kcchoices','kcv','brpack','brlineup','__manual_refresh','__shell']
      .forEach(key=>url.searchParams.delete(key));
    url.hash='play';
    window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);

    const openPlay=()=>{
      const playTab=document.querySelector('.tab[data-view="play"]');
      if(playTab&&!playTab.classList.contains('active'))playTab.click();
      showPausedBanner();
      notice('Friend challenges are temporarily paused while the link flow is rebuilt.');
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',openPlay,{once:true});
    else openPlay();
  }

  document.addEventListener('click',event=>{
    if(!event.target.closest?.(SELECTOR))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    notice('Friend challenges are temporarily paused while the link flow is rebuilt.');
  },true);

  window.addEventListener('ufc-play-hub-ready',showPausedBanner);
  document.documentElement.setAttribute('data-play-challenges-paused',VERSION);
  handleIncoming();
})();
