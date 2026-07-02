// Home screen polish: compact hero, brighter dark theme, and cleaner header copy.
(function(){
  const VERSION = 'home-polish-20260702a';

  function injectCss(){
    if(document.getElementById('home-polish-css')) return;
    const style = document.createElement('style');
    style.id = 'home-polish-css';
    style.textContent = `
      :root{
        --bg:#111827;
        --panel:#151c2a;
        --panel2:#1b2536;
        --text:#f3f6ff;
        --muted:#aeb8c8;
        --line:#334158;
      }
      body{
        background:
          radial-gradient(circle at 18% 0%, rgba(249,115,22,.18), transparent 28%),
          radial-gradient(circle at 85% 12%, rgba(59,130,246,.12), transparent 30%),
          linear-gradient(180deg,#182131 0%, #111827 38%, #0f1724 100%) !important;
      }
      .hero{
        position:relative;
        padding:28px clamp(20px,5vw,72px) 24px !important;
        background:linear-gradient(180deg,rgba(27,37,54,.48),rgba(17,24,39,.16));
        overflow:hidden;
      }
      .hero::before{
        content:"";
        position:absolute;
        inset:-80px -80px auto auto;
        width:260px;
        height:260px;
        background:radial-gradient(circle,rgba(249,115,22,.22),transparent 66%);
        pointer-events:none;
      }
      .hero > *{position:relative;z-index:1}
      .eyebrow{color:#facc15 !important;letter-spacing:.18em !important;font-size:12px !important;margin-bottom:7px !important}
      h1{font-size:clamp(38px,5.4vw,64px) !important;letter-spacing:-.045em !important;line-height:.96 !important}
      .subtitle{max-width:720px !important;color:#b8c2d3 !important;line-height:1.42 !important;margin:14px 0 0 !important;font-size:clamp(16px,2.3vw,21px)}
      .hero-card{
        min-width:142px !important;
        padding:14px 18px !important;
        border-color:rgba(249,115,22,.32) !important;
        background:linear-gradient(135deg,rgba(249,115,22,.20),rgba(250,204,21,.06),rgba(30,41,59,.86)) !important;
        border-radius:18px !important;
        box-shadow:0 16px 46px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.04) !important;
      }
      .hero-card span{font-size:34px !important;line-height:1 !important;letter-spacing:-.04em !important}
      .hero-card small{display:block;color:#b8c2d3 !important;font-weight:750;text-transform:uppercase;letter-spacing:.08em;font-size:11px;margin-top:5px}
      .tabs{background:rgba(13,18,29,.88) !important;border-bottom-color:#334158 !important}
      .shell{background:linear-gradient(180deg,rgba(17,24,39,.24),rgba(15,23,36,0));}
      input,select,.tab,.ghost,.row,.kpi,.card{border-color:#334158 !important}
      input,select,.tab,.ghost{background:#151c2a !important}
      .row,.kpi,.card{background:linear-gradient(180deg,rgba(27,37,54,.96),rgba(19,27,41,.96)) !important}
      .row:hover{border-color:rgba(249,115,22,.72) !important;box-shadow:0 14px 40px rgba(0,0,0,.18)}
      @media(max-width:900px){
        .hero{padding:20px 16px 18px !important;gap:12px !important}
        h1{font-size:38px !important;line-height:.98 !important}
        .subtitle{font-size:17px !important;line-height:1.36 !important;margin-top:10px !important}
        .hero-card{width:auto !important;min-width:128px !important;padding:12px 16px !important;align-self:flex-start !important}
        .hero-card span{font-size:31px !important}
        .tabs{padding-top:10px !important;padding-bottom:10px !important}
        .shell{padding-top:14px !important}
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
