// Home screen polish: light mode preview across all tabs and profiles.
(function(){
  const VERSION = 'home-polish-light-preview-20260702a';

  function injectCss(){
    const existing = document.getElementById('home-polish-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'home-polish-css';
    style.textContent = `
      :root{
        --bg:#eef3f8;
        --panel:#ffffff;
        --panel2:#f8fafc;
        --text:#111827;
        --muted:#64748b;
        --line:#cbd5e1;
        --accent:#f97316;
        --accent2:#b45309;
      }
      body{
        background:
          radial-gradient(circle at 16% 0%, rgba(249,115,22,.14), transparent 28%),
          radial-gradient(circle at 86% 10%, rgba(37,99,235,.10), transparent 28%),
          linear-gradient(180deg,#f8fafc 0%,#eef3f8 42%,#e7eef7 100%) !important;
        color:#111827 !important;
      }
      .hero{
        position:relative;
        padding:24px clamp(20px,5vw,72px) 20px !important;
        background:linear-gradient(135deg,rgba(255,255,255,.94),rgba(243,246,251,.90)) !important;
        border-bottom-color:#cbd5e1 !important;
        overflow:hidden;
      }
      .hero::before{
        content:"";
        position:absolute;
        inset:-96px -92px auto auto;
        width:300px;
        height:300px;
        background:radial-gradient(circle,rgba(249,115,22,.16),transparent 68%);
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
      input,select,.row,.card,.kpi,.category-card,.category-explainer,.category-explainer-item,.snapshot-item,.profile-summary,.fighter-photo{border-color:#cbd5e1 !important}
      input,select{background:#ffffff !important;color:#111827 !important;box-shadow:0 8px 20px rgba(15,23,42,.04)}
      input::placeholder{color:#94a3b8 !important}
      .row,.card,.kpi{background:linear-gradient(180deg,#ffffff,#f8fafc) !important;box-shadow:0 10px 28px rgba(15,23,42,.07)}
      .row:hover{border-color:rgba(249,115,22,.72) !important;box-shadow:0 14px 36px rgba(15,23,42,.11)}
      .rank{color:#ea580c !important}
      .name,.section-title h2,.profile-summary h2,.card h3,.category-label,.category-explainer-item strong,.snapshot-item strong{color:#111827 !important}
      .score strong,.profile-ovr{color:#111827 !important}
      .section-title p,.meta,.kpi small,.category-card small,.category-explainer p,.category-explainer-item small,.snapshot-item small,.profile-copy,.judgment-list{color:#64748b !important}
      .row-photo{background:#e2e8f0 !important;color:#1f2937 !important}
      .resume-tag{background:#fffbeb !important;border-color:#facc15 !important;color:#92400e !important}
      .watch-moment-link{background:#fff1f2 !important;border-color:#fb7185 !important;color:#9f1239 !important}
      .watch-moment-link:hover{background:#ffe4e6 !important;color:#881337 !important}
      .kpis{display:none !important}
      .drawer{background:rgba(15,23,42,.32) !important}
      .drawer-panel{background:#f8fafc !important;border-left-color:#cbd5e1 !important;color:#111827 !important}
      .close{color:#111827 !important}
      .fighter-photo{background:radial-gradient(circle at 50% 18%,rgba(249,115,22,.14),transparent 34%),linear-gradient(180deg,#ffffff,#e2e8f0) !important;box-shadow:0 10px 28px rgba(15,23,42,.08)}
      .fighter-photo::before{background:linear-gradient(180deg,transparent 42%,rgba(15,23,42,.46)) !important}
      .photo-note{color:#ffffff !important}
      .profile-summary{background:linear-gradient(180deg,#ffffff,#f8fafc) !important;box-shadow:0 10px 28px rgba(15,23,42,.07)}
      .profile-pill{background:#ffffff !important;border-color:#cbd5e1 !important;color:#475569 !important}
      .profile-pill.gold{background:#f97316 !important;border-color:#f97316 !important;color:#111827 !important}
      .profile-pill.tier-overall{background:#ecfdf5 !important;border-color:#86efac !important;color:#166534 !important}
      .tier-pill{background:color-mix(in srgb,var(--tier-color,var(--accent)) 12%,#ffffff) !important}
      .category-card{background:#ffffff !important;box-shadow:0 8px 20px rgba(15,23,42,.05)}
      .category-bar{background:#e2e8f0 !important}
      .category-explainer{background:linear-gradient(180deg,#ffffff,#f8fafc) !important;box-shadow:0 8px 20px rgba(15,23,42,.05)}
      .category-explainer-item,.snapshot-item{background:#f8fafc !important}
      .table th{color:#b45309 !important}
      .table td,.table th{border-bottom-color:#e2e8f0 !important;color:#111827}
      .notice{background:#fffbeb !important;border-color:#facc15 !important;color:#92400e !important}
      .winner{color:#15803d !important}
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
    window.UFC_HOME_POLISH = { version: VERSION, mode: 'light-preview' };
  }

  apply();
})();
