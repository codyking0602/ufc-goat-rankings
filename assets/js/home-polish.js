// Home screen polish: compact hero, brighter slate theme, and cleaner header copy.
(function(){
  const VERSION = 'home-polish-20260702c';

  function injectCss(){
    const existing = document.getElementById('home-polish-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'home-polish-css';
    style.textContent = `
      :root{
        --bg:#243044;
        --panel:#26354b;
        --panel2:#31425d;
        --text:#f8faff;
        --muted:#d0d7e4;
        --line:#596b88;
      }
      body{
        background:
          radial-gradient(circle at 15% 0%, rgba(249,115,22,.13), transparent 28%),
          radial-gradient(circle at 88% 5%, rgba(250,204,21,.06), transparent 24%),
          radial-gradient(circle at 75% 42%, rgba(96,165,250,.16), transparent 34%),
          linear-gradient(180deg,#30374b 0%, #293449 38%, #243044 100%) !important;
      }
      .hero{
        position:relative;
        padding:24px clamp(20px,5vw,72px) 20px !important;
        background:linear-gradient(135deg,rgba(55,61,80,.82),rgba(43,52,72,.72)) !important;
        overflow:hidden;
      }
      .hero::before{
        content:"";
        position:absolute;
        inset:-100px -96px auto auto;
        width:300px;
        height:300px;
        background:radial-gradient(circle,rgba(249,115,22,.16),transparent 68%);
        pointer-events:none;
      }
      .hero > *{position:relative;z-index:1}
      .eyebrow{color:#facc15 !important;letter-spacing:.18em !important;font-size:12px !important;margin-bottom:7px !important}
      h1{font-size:clamp(38px,5.4vw,64px) !important;letter-spacing:-.045em !important;line-height:.96 !important}
      .subtitle{max-width:720px !important;color:#d7deea !important;line-height:1.42 !important;margin:13px 0 0 !important;font-size:clamp(16px,2.3vw,21px)}
      .hero-card{
        min-width:112px !important;
        width:auto !important;
        padding:9px 13px !important;
        border-color:rgba(249,115,22,.42) !important;
        background:linear-gradient(135deg,rgba(249,115,22,.12),rgba(250,204,21,.035),rgba(54,68,92,.82)) !important;
        border-radius:14px !important;
        box-shadow:0 9px 24px rgba(0,0,0,.14), inset 0 1px 0 rgba(255,255,255,.06) !important;
      }
      .hero-card span{font-size:25px !important;line-height:.94 !important;letter-spacing:-.04em !important}
      .hero-card small{display:block;color:#d7deea !important;font-weight:850;text-transform:uppercase;letter-spacing:.12em;font-size:9px;margin-top:6px}
      .tabs{background:rgba(31,43,62,.94) !important;border-bottom-color:#596b88 !important}
      .tab,.ghost{background:#26354b !important;border-color:#596b88 !important;color:#f8faff !important}
      .tab.active{background:#f97316 !important;border-color:#f97316 !important;color:#111827 !important;box-shadow:0 0 0 1px rgba(249,115,22,.12),0 10px 26px rgba(249,115,22,.20) !important}
      .shell{background:linear-gradient(180deg,rgba(49,66,93,.45),rgba(36,48,68,0));}
      input,select,.row,.card{border-color:#596b88 !important}
      input,select{background:#27384f !important;color:#f8faff !important}
      input::placeholder{color:#c4cedd !important}
      .row,.card{background:linear-gradient(180deg,rgba(48,66,94,.99),rgba(38,53,76,.99)) !important}
      .resume-tag{background:rgba(250,204,21,.11) !important;border-color:rgba(250,204,21,.34) !important;color:#fff0a8 !important}
      .watch-moment-link{background:rgba(248,113,113,.14) !important;border-color:rgba(248,113,113,.48) !important;color:#ffd4d4 !important}
      .kpis{display:none !important}
      .section-title p,.meta{color:#d0d7e4 !important}
      .row:hover{border-color:rgba(249,115,22,.78) !important;box-shadow:0 14px 40px rgba(0,0,0,.14)}
      @media(max-width:900px){
        .hero{padding:20px 16px 17px !important;gap:10px !important}
        h1{font-size:37px !important;line-height:.98 !important}
        .subtitle{font-size:17px !important;line-height:1.35 !important;margin-top:10px !important}
        .hero-card{min-width:99px !important;padding:8px 11px !important;align-self:flex-start !important}
        .hero-card span{font-size:24px !important}
        .hero-card small{font-size:8.5px !important;margin-top:5px !important}
        .tabs{padding-top:10px !important;padding-bottom:10px !important}
        .shell{padding-top:14px !important}
        .section-title{margin-bottom:12px !important}
      }
    `;
    document.head.appendChild(style);
  }

  function applyCopy(){
    const subtitle = document.querySelector('.subtitle');
    if(subtitle) subtitle.textContent = 'Fighter profiles, OVR ratings, category ranks, and head-to-head comparisons.';
    const countLabel = document.querySelector('.hero-card small');
    if(countLabel) countLabel.textContent = 'Fighters';
  }

  function apply(){
    injectCss();
    applyCopy();
    window.UFC_HOME_POLISH = { version: VERSION };
  }

  apply();
})();
