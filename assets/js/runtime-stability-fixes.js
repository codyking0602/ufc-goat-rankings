// Runtime stability fixes for photos and division tab.
(function(){
  const VERSION = 'runtime-stability-fixes-20260707a';
  const SLUG_OVERRIDES = {
    'B.J. Penn':'bj-penn','BJ Penn':'bj-penn','Georges St-Pierre':'georges-st-pierre',
    'T.J. Dillashaw':'tj-dillashaw','TJ Dillashaw':'tj-dillashaw','Junior dos Santos':'junior-dos-santos',
    "Sean O'Malley":'sean-omalley','Julianna Peña':'julianna-pena','Julianna Pena':'julianna-pena'
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
  function initials(name){ return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(x => x[0]).join('').toUpperCase() || 'UFC'; }
  function thumbPath(name){ const slug = slugFor(name); return slug ? `assets/fighters/${slug}-thumb.webp` : ''; }
  function photoPath(name){ const slug = slugFor(name); return slug ? `assets/fighters/${slug}.webp` : ''; }
  function fighterRows(){
    const rows = [];
    const seen = new Set();
    const push = f => {
      const name = typeof f === 'string' ? f : f?.fighter;
      if(!name || seen.has(name)) return;
      seen.add(name);
      rows.push(typeof f === 'string' ? { fighter:name } : f);
    };
    (window.RANKING_DATA?.fighters || []).forEach(push);
    (window.RANKING_DATA?.men || []).forEach(push);
    (window.RANKING_DATA?.women || []).forEach(push);
    (window.UFC_APP_STATE?.fighters || []).forEach(push);
    (window.UFC_APP_STATE?.menRows || []).forEach(push);
    (window.UFC_APP_STATE?.womenRows || []).forEach(push);
    return rows;
  }
  function ensureOverrides(){ if(!window.DISPLAY_OVERRIDES) window.DISPLAY_OVERRIDES = {}; return window.DISPLAY_OVERRIDES; }
  function applyPhotoPaths(){
    const overrides = ensureOverrides();
    const mapped = [];
    fighterRows().forEach(f => {
      const name = f.fighter;
      if(!name) return;
      const current = overrides[name] || {};
      const embedded = f.display || {};
      const photoUrl = current.photoUrl || embedded.photoUrl || f.photoUrl || photoPath(name);
      const thumbUrl = current.thumbUrl || embedded.thumbUrl || f.thumbUrl || thumbPath(name);
      overrides[name] = { ...current, photoUrl, thumbUrl };
      mapped.push({ fighter:name, photoUrl, thumbUrl });
    });
    window.UFC_RUNTIME_PHOTO_PATHS = { version:VERSION, mapped };
    return mapped;
  }

  function patchPhotoFunctions(){
    applyPhotoPaths();
    try {
      window.photoUrlFor = photoUrlFor = function(f){
        const name = f?.fighter || '';
        const override = ensureOverrides()[name] || {};
        return override.photoUrl || f?.display?.photoUrl || f?.photoUrl || photoPath(name);
      };
      window.thumbUrlFor = thumbUrlFor = function(f){
        const name = f?.fighter || '';
        const override = ensureOverrides()[name] || {};
        return override.thumbUrl || f?.display?.thumbUrl || f?.thumbUrl || override.photoUrl || photoPath(name) || thumbPath(name);
      };
      window.rowPhoto = rowPhoto = function(f){
        const name = f?.fighter || '';
        const url = thumbUrlFor(f) || thumbPath(name);
        return `<div class="row-photo">${url ? `<img src="${url}" alt="${name} profile photo" loading="lazy" decoding="async" onerror="this.remove();this.parentElement.textContent='${initials(name)}'">` : initials(name)}</div>`;
      };
    } catch(e) {}
  }

  function hydrateRowPhotos(){
    applyPhotoPaths();
    document.querySelectorAll('.fighter-row[data-fighter], .row[data-fighter]').forEach(row => {
      const name = row.getAttribute('data-fighter');
      const holder = row.querySelector('.row-photo');
      if(!name || !holder) return;
      const url = (ensureOverrides()[name] || {}).thumbUrl || thumbPath(name);
      if(!url) return;
      const existing = holder.querySelector('img');
      if(existing && existing.getAttribute('src') === url) return;
      holder.textContent = '';
      const img = document.createElement('img');
      img.src = url;
      img.alt = `${name} profile photo`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => { img.remove(); holder.textContent = initials(name); };
      holder.appendChild(img);
    });
  }

  function forceListRerender(){
    patchPhotoFunctions();
    if(window.UFC_MARK_LISTS_DIRTY && window.UFC_RENDER_ACTIVE_VIEW){
      try { window.UFC_MARK_LISTS_DIRTY(); window.UFC_RENDER_ACTIVE_VIEW(); } catch(e) {}
    }
    hydrateRowPhotos();
  }

  function activeView(){ return document.querySelector('.tab.active')?.dataset.view || 'men'; }
  function ensureDivisionBoard(){
    if(activeView() !== 'division') return;
    const render = () => {
      if(typeof window.renderDivision === 'function'){
        try { window.renderDivision(); } catch(e) {}
        hydrateRowPhotos();
      }
    };
    if(window.UFC_DIVISION_RANKINGS){ render(); return; }
    if(!document.querySelector('script[data-division-rankings]')){
      const script = document.createElement('script');
      script.src = 'assets/js/division-rankings.js?v=division-rankings-20260707i-runtime-stable';
      script.setAttribute('data-division-rankings','true');
      script.onload = render;
      document.body.appendChild(script);
    } else {
      setTimeout(render, 80);
    }
  }

  function scheduleHydration(){
    patchPhotoFunctions();
    hydrateRowPhotos();
    setTimeout(hydrateRowPhotos, 80);
    setTimeout(hydrateRowPhotos, 250);
    setTimeout(hydrateRowPhotos, 700);
    ensureDivisionBoard();
  }

  document.addEventListener('click', event => {
    if(event.target.closest?.('.tab')) setTimeout(scheduleHydration, 0);
    if(event.target.closest?.('[data-division-pick]')) setTimeout(scheduleHydration, 0);
  }, true);
  document.addEventListener('change', event => {
    if(event.target?.id === 'divisionFilter') setTimeout(scheduleHydration, 0);
  }, true);

  patchPhotoFunctions();
  forceListRerender();
  scheduleHydration();
  let ticks = 0;
  const timer = setInterval(() => {
    ticks += 1;
    scheduleHydration();
    if(ticks >= 12) clearInterval(timer);
  }, 500);

  window.UFC_RUNTIME_STABILITY_FIXES = { version:VERSION, slugFor, applyPhotoPaths, hydrateRowPhotos, ensureDivisionBoard };
  document.documentElement.setAttribute('data-runtime-stability-fixes', VERSION);
})();
