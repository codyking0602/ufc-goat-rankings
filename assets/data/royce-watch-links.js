// App-facing Royce links/stats plus the synchronous late-registry bridge.
(function(){
  'use strict';
  const VERSION='royce-app-links-stats-20260712c-batch-eight-loader';
  if(typeof DISPLAY_OVERRIDES==='undefined') return;

  const fighter='Royce Gracie';
  const qualityStats={
    eliteWins:2,
    elitePlusWins:2,
    topFivePlusWins:2,
    rankedQualityWins:7
  };
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
    if(compare) compare.legacyStats={...(compare.legacyStats||{}),eliteWins:2,elitePlusWins:2,topFivePlusWins:2};
    return qualityStats;
  }

  function loadBatchEightRegistry(){
    if(window.UFC_BATCH_EIGHT_FIGHTER_REGISTRY) return;
    const dataSrc='assets/data/canonical-fighter-registry-batch-eight-data.js?v=canonical-fighter-registry-batch-eight-data-20260712a';
    const registrySrc='assets/data/canonical-fighter-registry-batch-eight.js?v=canonical-fighter-registry-batch-eight-20260712a';
    if(document.readyState==='loading'&&document.currentScript){
      document.write(`<script src="${dataSrc}" data-batch-eight-fighter-data="true"><\/script>`);
      document.write(`<script src="${registrySrc}" data-batch-eight-fighter-registry="true"><\/script>`);
      return;
    }
    if(document.querySelector('script[data-batch-eight-fighter-registry]')) return;
    const dataScript=document.createElement('script');
    dataScript.src=dataSrc;
    dataScript.async=false;
    dataScript.setAttribute('data-batch-eight-fighter-data','true');
    dataScript.onload=()=>{
      const registryScript=document.createElement('script');
      registryScript.src=registrySrc;
      registryScript.async=false;
      registryScript.setAttribute('data-batch-eight-fighter-registry','true');
      document.head.appendChild(registryScript);
    };
    document.head.appendChild(dataScript);
  }

  applyQualityStats();
  loadBatchEightRegistry();
  window.addEventListener('ufc-scoring-pipeline-ready',applyQualityStats,{once:true});

  window.UFC_ROYCE_WATCH_LINKS={
    version:VERSION,
    fighter,
    watchUrl:override.watchUrl,
    signatureFightUrl:override.signatureFightUrl,
    qualityStats,
    batchEightRegistryLoader:true,
    applied:true
  };
  document.documentElement.setAttribute('data-royce-watch-links',VERSION);
})();
