// Lightweight post-load status hook. No runtime module loading.
(function(){
  const VERSION='ranking-data-patches-20260707aa-stability-cleanup';
  const SLUG_OVERRIDES={'B.J. Penn':'bj-penn','BJ Penn':'bj-penn','Georges St-Pierre':'georges-st-pierre','T.J. Dillashaw':'tj-dillashaw','TJ Dillashaw':'tj-dillashaw','Junior dos Santos':'junior-dos-santos',"Sean O'Malley":'sean-omalley','Julianna Peña':'julianna-pena','Julianna Pena':'julianna-pena'};

  function slugFor(name){
    return SLUG_OVERRIDES[name]||String(name||'')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/&/g,' and ')
      .replace(/['’]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }
  function initials(name){return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'UFC';}
  function fighterRows(){
    const rows=[];
    const seen=new Set();
    const push=f=>{
      const n=typeof f==='string'?f:f?.fighter;
      if(!n||seen.has(n))return;
      seen.add(n);
      rows.push(typeof f==='string'?{fighter:n}:f);
    };
    (window.RANKING_DATA?.fighters||[]).forEach(push);
    (window.RANKING_DATA?.men||[]).forEach(push);
    (window.RANKING_DATA?.women||[]).forEach(push);
    return rows;
  }
  function ensureDisplayOverrides(){if(!window.DISPLAY_OVERRIDES)window.DISPLAY_OVERRIDES={};return window.DISPLAY_OVERRIDES;}
  function applyPhotoPathDefaults(){
    const overrides=ensureDisplayOverrides();
    const mapped=[];
    fighterRows().forEach(f=>{
      const name=f.fighter;
      const slug=slugFor(name);
      if(!slug)return;
      const embedded=f.display||{};
      const current=overrides[name]||{};
      const defaultPhoto=`assets/fighters/${slug}.webp`;
      const defaultThumb=`assets/fighters/${slug}-thumb.webp`;
      const photoUrl=current.photoUrl||embedded.photoUrl||f.photoUrl||embedded.profileUrl||f.profileUrl||defaultPhoto;
      const thumbUrl=current.thumbUrl||embedded.thumbUrl||f.thumbUrl||embedded.thumbnailUrl||f.thumbnailUrl||embedded.cardPhotoUrl||f.cardPhotoUrl||defaultThumb;
      overrides[name]={...current,photoUrl,thumbUrl};
      mapped.push({fighter:name,photoUrl:overrides[name].photoUrl,thumbUrl:overrides[name].thumbUrl});
    });
    window.UFC_PHOTO_PATH_DEFAULTS={version:VERSION,mapped};
    return mapped;
  }
  function fallbackImage(img){
    if(!img||img.dataset.ufcPhotoFallbackApplied)return;
    const src=img.getAttribute('src')||'';
    if(!src.includes('assets/fighters/'))return;
    img.dataset.ufcPhotoFallbackApplied='true';
    const name=String(img.getAttribute('alt')||'').replace(/\s+profile photo$/i,'').replace(/\s+thumbnail$/i,'').trim();
    const parent=img.closest('.row-photo,.fighter-photo,.ov-card-photo');
    if(!parent)return;
    img.remove();
    if(parent.classList.contains('row-photo')||parent.classList.contains('ov-card-photo')){
      parent.textContent=initials(name);
      return;
    }
    parent.classList.remove('has-photo');
    if(!parent.querySelector('.photo-initials')){
      const fallback=document.createElement('div');
      fallback.className='photo-initials';
      fallback.textContent=initials(name);
      parent.prepend(fallback);
    }
  }
  function installImageFallback(){
    if(window.__UFC_PHOTO_FALLBACK_INSTALLED)return;
    window.__UFC_PHOTO_FALLBACK_INSTALLED=true;
    document.addEventListener('error',event=>{if(event.target?.tagName==='IMG')fallbackImage(event.target);},true);
  }
  function scanBrokenImages(){document.querySelectorAll('img[src*="assets/fighters/"]').forEach(img=>{if(img.complete&&img.naturalWidth===0)fallbackImage(img);});}
  function syncPacketProfileStats(){
    const overrides=window.DISPLAY_OVERRIDES||{};
    const synced=[];
    Object.entries(overrides).forEach(([fighter,override])=>{
      if(!override?.packetProfileStats)return;
      override.snapshotStats={...(override.snapshotStats||{}),...(override.packetProfileStats||{})};
      synced.push(fighter);
    });
    window.UFC_PACKET_PROFILE_STAT_BRIDGE={version:VERSION,synced,appliedAt:new Date().toISOString()};
    return synced;
  }
  function status(){
    installImageFallback();
    const photoDefaults=applyPhotoPathDefaults();
    const packetProfileStatsSynced=syncPacketProfileStats();
    setTimeout(scanBrokenImages,250);
    window.UFC_PHASE2_DATA_STATUS={
      version:VERSION,
      mode:'lightweight-status-hook',
      fighterCount:fighterRows().length,
      photoDefaults,
      packetProfileStatsSynced,
      appState:!!window.UFC_APP_STATE,
      renderedViews:window.UFC_APP_STATE?.renderedViews||null,
      appliedAt:new Date().toISOString()
    };
    document.documentElement.setAttribute('data-phase2-data-patch',VERSION);
    return window.UFC_PHASE2_DATA_STATUS;
  }

  window.UFC_RANKING_DATA_PATCHES_V1={meta:{purpose:'Lightweight status hook',updated:'2026-07-07',version:VERSION},apply:status,slugFor,syncPacketProfileStats};
  installImageFallback();
  applyPhotoPathDefaults();
  syncPacketProfileStats();
  if(window.UFC_PHOTO_DEFAULTS_APPLY)window.UFC_PHOTO_DEFAULTS_APPLY();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',status,{once:true});else status();
  window.UFC_PHASE2_DATA_REFRESH=status;
})();
