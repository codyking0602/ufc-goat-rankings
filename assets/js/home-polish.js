// Home screen polish: light background with dark card preview across all tabs and profiles.
(function(){
  const VERSION = 'home-polish-hybrid-preview-20260702b';

  function injectCss(){
    const existing = document.getElementById('home-polish-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'home-polish-css';
    style.textContent = `
      :root{
        --bg:#eef3f8;
        --panel:#172033;
        --panel2:#23324a;
        --text:#f8faff;
        --muted:#c7d2e2;
        --line:#40536f;
        --accent:#f97316;
        --accent2:#facc15;
      }
      body{
        background:
          radial-gradient(circle at 16% 0%, rgba(249,115,22,.12), transparent 28%),
          radial-gradient(circle at 86% 10%, rgba(37,99,235,.10), transparent 28%),
          linear-gradient(180deg,#f8fafc 0%,#eef3f8 42%,#e7eef7 100%) !important;
        color:#111827 !important;
      }
      .hero{
        position:relative;
        padding:24px clamp(20px,5vw,72px) 20px !important;
        background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(243,246,251,.92)) !important;
        border-bottom-color:#cbd5e1 !important;
        overflow:hidden;
      }
      .hero::before{
        content:"";
        position:absolute;
        inset:-96px -92px auto auto;
        width:300px;
        height:300px;
        background:radial-gradient(circle,rgba(249,115,22,.15),transparent 68%);
        pointer-events:none;
      }
      .hero > *{position:relative;z-index:1}
      .eyebrow{color:#c2410c !important;letter-spacing:.18em !important;font-size:12px !important;margin-bottom:7px !important}
      h1{font-size:clamp(38px,5.4vw,64px) !important;letter-spacing:-.045em !important;line-height:.96 !important;color:#111827 !important}
      .subtitle{max-width:720px !important;color:#475569 !important;line-height:1.42 !important;margin:13px 0 0 !important;font-size:clamp(16px,2.3vw,21px)}
      .hero-card{
        min-width:112px !important;
        width:auto !important;
        padding:9px 13px !important;
        border-color:rgba(249,115,22,.38) !important;
        background:linear-gradient(135deg,#fff7ed,#ffffff 62%,#eef2f7) !important;
        border-radius:14px !important;
        box-shadow:0 10px 28px rgba(15,23,42,.10), inset 0 1px 0 rgba(255,255,255,.85) !important;
      }
      .hero-card span{font-size:25px !important;line-height:.94 !important;letter-spacing:-.04em !important;color:#111827 !important}
      .hero-card small{display:block;color:#64748b !important;font-weight:850;text-transform:uppercase;letter-spacing:.12em;font-size:9px;margin-top:6px}
      .tabs{background:rgba(248,250,252,.94) !important;border-bottom-color:#cbd5e1 !important;box-shadow:0 1px 0 rgba(15,23,42,.04)}
      .tab,.ghost{background:#ffffff !important;border-color:#cbd5e1 !important;color:#1f2937 !important;box-shadow:0 4px 14px rgba(15,23,42,.04)}
      .tab.active{background:#f97316 !important;border-color:#f97316 !important;color:#111827 !important;box-shadow:0 10px 24px rgba(249,115,22,.22) !important}
      .shell{background:linear-gradient(180deg,rgba(226,232,240,.45),rgba(238,243,248,0));}
      input,select,.row,.card,.kpi,.category-card,.category-explainer,.category-explainer-item,.snapshot-item,.profile-summary,.fighter-photo{border-color:#40536f !important}
      input,select{background:#172033 !important;color:#f8faff !important;box-shadow:0 9px 22px rgba(15,23,42,.12)}
      input::placeholder{color:#9aa8bb !important}
      .row,.card,.kpi{background:linear-gradient(180deg,#23324a,#172033) !important;box-shadow:0 13px 32px rgba(15,23,42,.20)}
      .row:hover{border-color:rgba(249,115,22,.76) !important;box-shadow:0 16px 38px rgba(15,23,42,.26)}
      .rank{color:#facc15 !important}
      .name,.card h3,.category-label,.category-explainer-item strong,.snapshot-item strong{color:#f8faff !important}
      .section-title h2{color:#111827 !important}
      .score strong,.profile-ovr{color:#f8faff !important}
      .section-title p{color:#475569 !important}
      .meta,.kpi small,.category-card small,.category-explainer p,.category-explainer-item small,.snapshot-item small,.profile-copy,.judgment-list{color:#c7d2e2 !important}
      .card p,.card li,.profile-main-flow .card p,.profile-deep-cuts .card p,.profile-main-flow .card li,.profile-deep-cuts .card li,.evidence-empty{color:#c7d2e2 !important;line-height:1.5 !important}
      .card p strong,.card li strong{color:#f8faff !important}
      .profile-pill.tier-overall,.profile-ovr-wrap > .tier-pill{display:none !important}
      .row-photo{background:#111827 !important;color:#f8faff !important}
      .resume-tag{background:rgba(250,204,21,.12) !important;border-color:rgba(250,204,21,.36) !important;color:#fde68a !important}
      .watch-moment-link{background:rgba(248,113,113,.15) !important;border-color:rgba(248,113,113,.52) !important;color:#fecaca !important}
      .watch-moment-link:hover{background:rgba(248,113,113,.22) !important;color:#fff !important}
      .kpis{display:none !important}
      .drawer{background:rgba(15,23,42,.42) !important}
      .drawer-panel{background:#eef3f8 !important;border-left-color:#cbd5e1 !important;color:#111827 !important}
      .close{color:#111827 !important}
      .fighter-photo{background:radial-gradient(circle at 50% 18%,rgba(249,115,22,.22),transparent 34%),linear-gradient(180deg,#23324a,#111827) !important;box-shadow:0 12px 32px rgba(15,23,42,.20)}
      .fighter-photo::before{background:linear-gradient(180deg,transparent 38%,rgba(0,0,0,.72)) !important}
      .photo-note{color:#ffffff !important}
      .profile-summary{background:linear-gradient(180deg,#23324a,#172033) !important;box-shadow:0 13px 32px rgba(15,23,42,.20)}
      .profile-summary h2{color:#f8faff !important}
      .profile-pill{background:rgba(255,255,255,.05) !important;border-color:#40536f !important;color:#c7d2e2 !important}
      .profile-pill.gold{background:#f97316 !important;border-color:#f97316 !important;color:#111827 !important}
      .tier-pill{background:color-mix(in srgb,var(--tier-color,var(--accent)) 12%,transparent) !important}
      .category-card{background:linear-gradient(180deg,#23324a,#172033) !important;box-shadow:0 10px 24px rgba(15,23,42,.16)}
      .category-bar{background:#111827 !important}
      .category-explainer{background:linear-gradient(180deg,#23324a,#172033) !important;box-shadow:0 10px 24px rgba(15,23,42,.16)}
      .category-explainer h3{color:#f8faff !important}
      .category-explainer-item,.snapshot-item{background:rgba(15,23,42,.44) !important}
      .table th{color:#facc15 !important}
      .table td,.table th{border-bottom-color:#40536f !important;color:#f8faff}
      .notice{background:#fffbeb !important;border-color:#facc15 !important;color:#92400e !important}
      .winner{color:#86efac !important}
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
    window.UFC_HOME_POLISH = { version: VERSION, mode: 'hybrid-preview' };
  }

  apply();
})();