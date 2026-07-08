// Direct fighter photo defaults. Keep photos independent of patch-loader timing.
(function(){
  const VERSION = 'photo-defaults-20260707a';
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

  function initials(name){
    return String(name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0,2)
      .map(x => x[0])
      .join('')
      .toUpperCase() || 'UFC';
  }

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

  function defaultPhoto(name){
    const slug = slugFor(name);
    return slug ? `assets/fighters/${slug}.webp` : '';
  }

  function defaultThumb(name){
    const slug = slugFor(name);
    return slug ? `assets/fighters/${slug}-thumb.webp` : '';
  }

  function ensureOverrides(){
    if(!window.DISPLAY_OVERRIDES) window.DISPLAY_OVERRIDES = {};
    return window.DISPLAY_OVERRIDES;
  }

  function applyPhotoDefaults(){
    const overrides = ensureOverrides();
    const mapped = [];
    fighterRows().forEach(f => {
      const name = f.fighter;
      if(!name) return;
      const embedded = f.display || {};
      const current = overrides[name] || {};
      const photoUrl = current.photoUrl || embedded.photoUrl || f.photoUrl || defaultPhoto(name);
      const thumbUrl = current.thumbUrl || embedded.thumbUrl || f.thumbUrl || defaultThumb(name);
      overrides[name] = { ...current, photoUrl, thumbUrl };
      mapped.push({ fighter:name, photoUrl, thumbUrl });
    });
    window.UFC_PHOTO_DEFAULTS = { version:VERSION, mapped };
    document.documentElement.setAttribute('data-photo-defaults', VERSION);
    return mapped;
  }

  function fallbackImage(img, name){
    const parent = img?.closest?.('.row-photo,.fighter-photo,.ov-card-photo');
    if(!parent) return;
    img.remove();
    if(parent.classList.contains('row-photo') || parent.classList.contains('ov-card-photo')){
      parent.textContent = initials(name);
      return;
    }
    parent.classList.remove('has-photo');
    if(!parent.querySelector('.photo-initials')){
      const div = document.createElement('div');
      div.className = 'photo-initials';
      div.textContent = initials(name);
      parent.prepend(div);
    }
  }

  function hydrateVisibleRowPhotos(){
    const overrides = ensureOverrides();
    document.querySelectorAll('.fighter-row[data-fighter]').forEach(row => {
      const name = row.getAttribute('data-fighter');
      const holder = row.querySelector('.row-photo');
      if(!name || !holder) return;
      const url = overrides[name]?.thumbUrl || defaultThumb(name);
      if(!url) return;
      const current = holder.querySelector('img');
      if(current && current.getAttribute('src') === url) return;
      holder.textContent = '';
      const img = document.createElement('img');
      img.src = url;
      img.alt = `${name} profile photo`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => fallbackImage(img, name);
      holder.appendChild(img);
    });
  }

  function refreshActiveRows(){
    applyPhotoDefaults();
    hydrateVisibleRowPhotos();
    if(window.UFC_MARK_LISTS_DIRTY && window.UFC_RENDER_ACTIVE_VIEW){
      try{
        window.UFC_MARK_LISTS_DIRTY();
        window.UFC_RENDER_ACTIVE_VIEW();
      }catch(e){}
    }
    hydrateVisibleRowPhotos();
    setTimeout(hydrateVisibleRowPhotos, 100);
    setTimeout(hydrateVisibleRowPhotos, 400);
  }

  window.UFC_PHOTO_DEFAULTS_APPLY = refreshActiveRows;
  applyPhotoDefaults();
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshActiveRows, { once:true });
  else refreshActiveRows();
})();
