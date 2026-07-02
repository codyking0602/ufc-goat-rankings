// Home screen polish: compact hero, brighter dark theme, and cleaner header copy.
(function(){
  const VERSION = 'home-polish-20260702b';

  function injectCss(){
    const existing = document.getElementById('home-polish-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'home-polish-css';
    style.textContent = `
      :root{
        --bg:#1a2233;
        --panel:#1c2738;
        --panel2:#26334a;
        --text:#f5f7ff;
        --muted:#c0cad8;
        --line:#42536f;
      }
      body{
        background:
          radial-gradient(circle at 18% 0%, rgba(249,115,22,.26), transparent 30%),
          radial-gradient(circle at 86% 8%, rgba(250,204,21,.12), transparent 27%),
          radial-gradient(circle at 72% 42%, rgba(59,130,246,.13), transparent 34%),
          linear-gradient(180deg,#242b3d 0%, #1c2435 42%, #172033 100%) !important;
      }
      .hero{
        position:relative;
        padding:24px clamp(20px,5vw,72px) 20px !important;
        background:linear-gradient(135deg,rgba(42,47,67,.78),rgba(31,39,57,.58)) !important;
        overflow:hidden;
      }
      .hero::before{
        content:"";
        position:absolute;
        inset:-92px -88px auto auto;
        width:285px;
        height:285px;
        background:radial-gradient(circle,rgba(249,115,22,.32),transparent 67%);
        pointer-events:none;
      }
      .hero > *{position:relative;z-index:1}
      .eyebrow{color:#facc15 !important;letter-spacing:.18em !important;font-size:12px !important;margin-bottom:7px !important}
      h1{font-size:clamp(38px,5.4vw,64px) !important;letter-spacing:-.045em !important;line-height:.96 !important}
      .subtitle{max-width:720px !important;color:#c9d2e1 !important;line-height:1.42 !important;margin:13px 0 0 !important;font-size:clamp(16px,2.3vw,21px)}
      .hero-card{
        min-width:118px !important;
        width:auto !important;
        padding:10px 14px !important;
        border-color:rgba(249,115,22,.45) !important;
        background:linear-gradient(135deg,rgba(249,115,22,.18),rgba(250,204,21,.05),rgba(36,48,68,.78)) !important;
        border-radius:15px !important;
        box-shadow:0 10px 30px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.05) !important;
      }
      .hero-card span{font-size:27px !important;line-height:.95 !important;letter-spacing:-.04em !important}
      .hero-card small{display:block;color:#c9d2e1 !important;font-weight:850;text-transform:uppercase;letter-spacing:.12em;font-size:9.5px;margin-top:6px}
      .tabs{background:rgba(21,29,44,.92) !important;border-bottom-color:#42536f !important}
      .tab,.ghost{background:#1c2738 !important;border-color:#42536f !important;color:#f5f7ff !important}
      .tab.active{background:#f97316 !important;border-color:#f97316 !important;color:#111827 !important;box-shadow:0 0 0 1px rgba(249,115,22,.12),0 10px 26px rgba(249,115,22,.24) !important}
      .shell{background:linear-gradient(180deg,rgba(38,51,74,.42),rgba(25,34,51,0));}
      input,select,.row,.card{border-color:#42536f !important}
      input,select{background:#182335 !important;color:#f5f7ff !important}
      .row,.card{background:linear-gradient(180deg,rgba(35,48,70,.98),rgba(24,34,52,.98)) !important}
      .kpis{display:none !important}
      .row:hover{border-color:rgba(249,115,22,.76) !important;box-shadow:0 14px 40px rgba(0,0,0,.18)}
      @media(max-width:900px){
        .hero{padding:20px 16px 17px !important;gap:10px !important}
        h1{font-size:37px !important;line-height:.98 !important}
        .subtitle{font-size:17px !important;line-height:1.35 !important;margin-top:10px !important}
        .hero-card{min-width:104px !important;padding:9px 12px !important;align-self:flex-start !important}
        .hero-card span{font-size:25px !important}
        .hero-card small{font-size:9px !important;margin-top:5px !important}
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
