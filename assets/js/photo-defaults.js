// Direct fighter photo defaults. One-pass photo hydration plus latest runtime fix loader.
(function(){
  const VERSION = 'photo-defaults-20260707g-profile-stats-loader';
  const SLUG_OVERRIDES = {
    'B.J. Penn':'bj-penn',
    'BJ Penn':'bj-penn',
    'Georges St-Pierre':'georges-st-pierre',
    'T.J. Dillashaw':'tj-dillashaw',
    'TJ Dillashaw':'tj-dillashaw',
    'Junior dos Santos':'junior-dos-santos',
    "Sean O'Malley":'sean-omalley',
    'Julianna Peña':'julianna-pena',
    'Julianna Pena':'julianna-pena'
  };

  function slugFor(name){
    return SLUG_OVERRIDES[name] || String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/&/g,' and ')
      .replace(/['’]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }

  function rows(){
    const out = [];
    const seen = new Set();
    const push = f => {
      const name = typeof f === 'string' ? f : f?.fighter;
      if(!name || seen.has(name)) return;
      seen.add(name);
      out.push(typeof f === 'string' ? { fighter:name } : f);
    };
    (window.RANKING_DATA?.fighters || []).forEach(push);
    (window.RANKING_DATA?.men || []).forEach(push);
    (window.RANKING_DATA?.women || []).forEach(push);
    return out;
  }

  function ensureOverrides(){
    if(!window.DISPLAY_OVERRIDES) window.DISPLAY_OVERRIDES = {};
    return window.DISPLAY_OVERRIDES;
  }

  function apply(){
    const overrides = ensureOverrides();
    const mapped = [];
    rows().forEach(f => {
      const name = f.fighter;
      const slug = slugFor(name);
      if(!slug) return;
      const current = overrides[name] || {};
      const embedded = f.display || {};
      const photoUrl = current.photoUrl || embedded.photoUrl || f.photoUrl || `assets/fighters/${slug}.webp`;
      const thumbUrl = current.thumbUrl || embedded.thumbUrl || f.thumbUrl || `assets/fighters/${slug}-thumb.webp`;
      overrides[name] = { ...current, photoUrl, thumbUrl };
      mapped.push({ fighter:name, photoUrl, thumbUrl });
    });
    window.UFC_PHOTO_DEFAULTS = { version:VERSION, mapped };
    document.documentElement.setAttribute('data-photo-defaults', VERSION);
    return mapped;
  }

  function initials(name){ return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(x => x[0]).join('').toUpperCase() || 'UFC'; }
  function hydrateExistingRows(){
    const overrides = ensureOverrides();
    document.querySelectorAll('.fighter-row[data-fighter], .row[data-fighter]').forEach(row => {
      const name = row.getAttribute('data-fighter');
      const holder = row.querySelector('.row-photo');
      if(!name || !holder) return;
      const url = overrides[name]?.thumbUrl;
      if(!url) return;
      let img = holder.querySelector('img');
      if(!img){
        holder.textContent = '';
        img = document.createElement('img');
        holder.appendChild(img);
      }
      img.src = url;
      img.alt = `${name} profile photo`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => { img.remove(); holder.textContent = initials(name); };
    });
  }

  function loadScript(src, attr){
    if(document.querySelector(`script[${attr}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute(attr,'true');
    document.body.appendChild(script);
  }

  function loadDivisionPhotoBridge(){
    loadScript('assets/js/division-photo-fix.js?v=division-photo-fix-20260707a-shared-rowphoto','data-division-photo-fix');
  }

  function loadLatestRuntimeFixes(){
    loadScript('assets/js/card-nicknames.js?v=card-nicknames-20260707f-snapshot-sanity-loader','data-card-nicknames-livefix');
    loadScript('assets/data/profile-snapshot-stats.js?v=profile-snapshot-stats-20260707a','data-profile-snapshot-stats-livefix');
    loadScript('assets/js/loss-context-category-copy.js?v=loss-context-category-copy-20260707b-loss-profile-tags','data-loss-context-category-copy-livefix');
    loadScript('assets/js/profile-snapshot-sanity.js?v=profile-snapshot-sanity-20260707a','data-profile-snapshot-sanity-livefix');
  }

  apply();
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => { hydrateExistingRows(); loadDivisionPhotoBridge(); setTimeout(loadLatestRuntimeFixes, 900); setTimeout(loadLatestRuntimeFixes, 1800); }, { once:true });
  } else {
    hydrateExistingRows();
    loadDivisionPhotoBridge();
    setTimeout(loadLatestRuntimeFixes, 900);
    setTimeout(loadLatestRuntimeFixes, 1800);
  }

  window.UFC_PHOTO_DEFAULTS_APPLY = function(){ apply(); hydrateExistingRows(); };
})();
