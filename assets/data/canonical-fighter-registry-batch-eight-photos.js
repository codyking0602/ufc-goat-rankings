// Real uploaded WebP paths and app-facing thumbnail normalization for the eight-fighter batch.
(function(){
  'use strict';
  const VERSION='batch-eight-photos-20260712c-unified-thumbs';
  const store=window.DISPLAY_OVERRIDES||(typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES:null);
  if(!store) return;
  const photos={
    'Benson Henderson':{thumbUrl:'assets/fighters/benson-henderson-thumb.webp',photoUrl:'assets/fighters/benson-henderson.webp'},
    'Fabricio Werdum':{thumbUrl:'assets/fighters/fabricio-werdum-thumb.webp',photoUrl:'assets/fighters/fabricio-werdum.webp'},
    'Glover Teixeira':{thumbUrl:'assets/fighters/glover-teixeira-thumb.webp',photoUrl:'assets/fighters/glover-teixeira.webp'},
    'Vitor Belfort':{thumbUrl:'assets/fighters/vitor-belfort-thumb.webp',photoUrl:'assets/fighters/vitor-belfort.webp'},
    'Forrest Griffin':{thumbUrl:'assets/fighters/forrest-griffin-thumb.webp',photoUrl:'assets/fighters/forrest-griffin.webp'},
    'Rashad Evans':{thumbUrl:'assets/fighters/rashad-evans-thumb.webp',photoUrl:'assets/fighters/rashad-evans.webp'},
    'Mauricio "Shogun" Rua':{thumbUrl:'assets/fighters/shogun-rua-thumb.webp',photoUrl:'assets/fighters/shogun-rua.webp'}
  };
  Object.entries(photos).forEach(([fighter,paths])=>{
    store[fighter]={...(store[fighter]||{}),...paths,photoNote:''};
  });

  // Werdum, Glover, and Vitor arrived with baked photo backgrounds rather than transparent cutouts.
  // Blend their edges into the same UFC-card treatment without altering or regenerating the fighters.
  if(!document.getElementById('batch-eight-thumb-normalization')){
    const style=document.createElement('style');
    style.id='batch-eight-thumb-normalization';
    style.textContent=`
      .row-photo{
        background:radial-gradient(circle at 50% 24%,#303b50 0%,#1a2334 48%,#0b101a 100%)!important;
      }
      .row-photo:has(img[src*="fabricio-werdum-thumb"]),
      .row-photo:has(img[src*="glover-teixeira-thumb"]),
      .row-photo:has(img[src*="vitor-belfort-thumb"]){
        isolation:isolate;
      }
      .row-photo img[src*="fabricio-werdum-thumb"],
      .row-photo img[src*="glover-teixeira-thumb"],
      .row-photo img[src*="vitor-belfort-thumb"]{
        transform:scale(1.06);
        filter:saturate(.9) contrast(1.05) brightness(.96);
      }
      .row-photo:has(img[src*="fabricio-werdum-thumb"])::after,
      .row-photo:has(img[src*="glover-teixeira-thumb"])::after,
      .row-photo:has(img[src*="vitor-belfort-thumb"])::after{
        content:"";
        position:absolute;
        inset:-1px;
        z-index:2;
        pointer-events:none;
        border-radius:inherit;
        background:radial-gradient(ellipse 68% 84% at 50% 43%,transparent 44%,rgba(20,28,43,.2) 67%,rgba(11,16,26,.94) 100%);
      }
    `;
    document.head.appendChild(style);
  }

  window.UFC_BATCH_EIGHT_PHOTOS={version:VERSION,fighters:Object.keys(photos),photos,normalizedBakedBackgrounds:['Fabricio Werdum','Glover Teixeira','Vitor Belfort'],applied:true};
  document.documentElement.setAttribute('data-batch-eight-photos-ready',VERSION);
})();
