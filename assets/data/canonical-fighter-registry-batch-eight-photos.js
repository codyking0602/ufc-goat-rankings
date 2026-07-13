// Real uploaded WebP paths for available fighters in the eight-fighter batch.
(function(){
  'use strict';
  const VERSION='batch-eight-photos-20260712b';
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
  window.UFC_BATCH_EIGHT_PHOTOS={version:VERSION,fighters:Object.keys(photos),photos,applied:true};
  document.documentElement.setAttribute('data-batch-eight-photos-ready',VERSION);
})();
