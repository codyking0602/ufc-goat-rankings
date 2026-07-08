// Division board photo bridge: use the same rowPhoto renderer as the working tabs.
(function(){
  const VERSION = 'division-photo-fix-20260707a-shared-rowphoto';
  let wrapped = false;

  function initials(name){
    return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(x => x[0]).join('').toUpperCase() || 'UFC';
  }

  function slugFor(name){
    const overrides = {
      'B.J. Penn':'bj-penn','BJ Penn':'bj-penn','Georges St-Pierre':'georges-st-pierre',
      'T.J. Dillashaw':'tj-dillashaw','TJ Dillashaw':'tj-dillashaw','Junior dos Santos':'junior-dos-santos',
      "Sean O'Malley":'sean-omalley','Julianna Peña':'julianna-pena','Julianna Pena':'julianna-pena'
    };
    return overrides[name] || String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/&/g,' and ')
      .replace(/['’]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }

  function fighterFor(name){
    return window.UFC_APP_STATE?.fullRowsByName?.get?.(name)
      || (window.RANKING_DATA?.fighters || []).find(f => f.fighter === name)
      || (window.RANKING_DATA?.men || []).find(f => f.fighter === name)
      || { fighter:name };
  }

  function fallbackPhotoHtml(name){
    const slug = slugFor(name);
    if(!slug) return `<div class="row-photo">${initials(name)}</div>`;
    const src = `assets/fighters/${slug}-thumb.webp`;
    return `<div class="row-photo"><img src="${src}" alt="${name} profile photo" loading="lazy" decoding="async" onerror="this.remove();this.parentElement.textContent='${initials(name)}'"></div>`;
  }

  function sharedPhotoHtml(name){
    const f = fighterFor(name);
    if(typeof window.UFC_PHOTO_DEFAULTS_APPLY === 'function') window.UFC_PHOTO_DEFAULTS_APPLY();
    if(typeof window.rowPhoto === 'function') return window.rowPhoto(f);
    try { if(typeof rowPhoto === 'function') return rowPhoto(f); } catch(e) {}
    return fallbackPhotoHtml(name);
  }

  function hydrateDivisionPhotos(){
    document.querySelectorAll('#division .division-row[data-fighter]').forEach(row => {
      const name = row.getAttribute('data-fighter');
      const current = row.querySelector('.row-photo');
      if(!name || !current) return;
      current.outerHTML = sharedPhotoHtml(name);
    });
  }

  function wrapRenderDivision(){
    if(wrapped || typeof window.renderDivision !== 'function') return false;
    const original = window.renderDivision;
    if(original.__divisionPhotoFixed) return true;
    window.renderDivision = function(){
      const result = original.apply(this, arguments);
      hydrateDivisionPhotos();
      return result;
    };
    window.renderDivision.__divisionPhotoFixed = true;
    wrapped = true;
    hydrateDivisionPhotos();
    window.UFC_DIVISION_PHOTO_FIX = { version:VERSION, mode:'shared-rowPhoto', appliedAt:new Date().toISOString() };
    document.documentElement.setAttribute('data-division-photo-fix', VERSION);
    return true;
  }

  let attempts = 0;
  function tryWrap(){
    attempts += 1;
    if(wrapRenderDivision()) return;
    if(attempts < 40) window.setTimeout(tryWrap, 100);
  }

  document.addEventListener('click', event => {
    if(event.target.closest?.('[data-division-pick], .tab[data-view="division"]')){
      window.setTimeout(hydrateDivisionPhotos, 0);
    }
  }, true);

  document.addEventListener('change', event => {
    if(event.target?.id === 'divisionFilter') window.setTimeout(hydrateDivisionPhotos, 0);
  }, true);

  tryWrap();
})();
