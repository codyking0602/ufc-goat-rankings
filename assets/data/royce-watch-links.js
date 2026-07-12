// App-facing Watch Moment and Signature Fight links for Royce Gracie.
(function(){
  'use strict';
  const VERSION='royce-watch-links-20260712a';
  if(typeof DISPLAY_OVERRIDES==='undefined') return;

  const fighter='Royce Gracie';
  const override=DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
  override.watchUrl='https://youtube.com/shorts/OQlVzoAnM9M?is=p7sB7tAt3oEAzJSL';
  override.watchLabel='Watch Moment';
  override.signatureFightUrl='https://youtu.be/-y2SEefVNtE?is=NN1arJDFgj8_a7F9';
  override.signatureFightLabel='Watch Signature Fight';

  window.UFC_ROYCE_WATCH_LINKS={
    version:VERSION,
    fighter,
    watchUrl:override.watchUrl,
    signatureFightUrl:override.signatureFightUrl,
    applied:true
  };
  document.documentElement.setAttribute('data-royce-watch-links',VERSION);
})();
