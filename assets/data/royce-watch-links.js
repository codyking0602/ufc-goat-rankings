// App-facing Royce links/stats plus the canonical late-registry bridge.
(function(){
  'use strict';
  const VERSION='royce-app-links-stats-20260712i-batch-eight-canonical';
  if(typeof DISPLAY_OVERRIDES==='undefined') return;

  const fighter='Royce Gracie';
  const qualityStats={eliteWins:2,elitePlusWins:2,topFiveWins:2,topFivePlusWins:2,rankedQualityWins:7};
  const override=DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
  override.watchUrl='https://youtube.com/shorts/OQlVzoAnM9M?is=p7sB7tAt3oEAzJSL';
  override.watchLabel='Watch Moment';
  override.signatureFightUrl='https://youtu.be/-y2SEefVNtE?is=NN1arJDFgj8_a7F9';
  override.signatureFightLabel='Watch Signature Fight';
  override.snapshotStats={...(override.snapshotStats||{}),...qualityStats};
  override.packetProfileStats={...(override.packetProfileStats||{}),...qualityStats};

  function applyQualityStats(){
    const data=window.RANKING_DATA||{};
    [...(data.men||[]),...(data.fighters||[])].forEach(row=>{
      if(row?.fighter!==fighter) return;
      Object.assign(row,qualityStats);
      row.snapshotStats={...(row.snapshotStats||{}),...qualityStats};
    });
    const compare=window.COMPARE_PROFILES?.[fighter];
    if(compare) compare.legacyStats={...(compare.legacyStats||{}),...qualityStats};
    return qualityStats;
  }
  function writeScript(src,attribute){
    if(document.querySelector(`script[${attribute}]`)) return;
    document.write(`<script src="${src}" ${attribute}="true"><\/script>`);
  }
  function appendScript(src,attribute){
    return new Promise(resolve=>{
      if(document.querySelector(`script[${attribute}]`)){resolve();return;}
      const script=document.createElement('script');
      script.src=src;script.async=false;script.setAttribute(attribute,'true');
      script.onload=resolve;script.onerror=resolve;document.head.appendChild(script);
    });
  }
  function loadBatchEightRegistry(){
    const dataSrc='assets/data/canonical-fighter-registry-batch-eight-data.js?v=canonical-fighter-registry-batch-eight-data-20260712c';
    const registrySrc='assets/data/canonical-fighter-registry-batch-eight.js?v=canonical-fighter-registry-batch-eight-20260712c-canonical-audit';
    const photoSrc='assets/data/canonical-fighter-registry-batch-eight-photos.js?v=batch-eight-photos-20260712b';
    if(document.readyState==='loading'&&document.currentScript){
      if(!window.UFC_BATCH_EIGHT_FIGHTER_REGISTRY){writeScript(dataSrc,'data-batch-eight-fighter-data');writeScript(registrySrc,'data-batch-eight-fighter-registry');}
      writeScript(photoSrc,'data-batch-eight-photos');
      return;
    }
    (async()=>{
      if(!window.UFC_BATCH_EIGHT_FIGHTER_REGISTRY){await appendScript(dataSrc,'data-batch-eight-fighter-data');await appendScript(registrySrc,'data-batch-eight-fighter-registry');}
      await appendScript(photoSrc,'data-batch-eight-photos');
    })();
  }

  applyQualityStats();
  loadBatchEightRegistry();
  window.addEventListener('ufc-scoring-pipeline-ready',applyQualityStats,{once:true});
  window.UFC_ROYCE_WATCH_LINKS={version:VERSION,fighter,watchUrl:override.watchUrl,signatureFightUrl:override.signatureFightUrl,qualityStats,batchEightCanonicalRegistryLoader:true,batchEightPhotoLoader:true,applied:true};
  document.documentElement.setAttribute('data-royce-watch-links',VERSION);
})();