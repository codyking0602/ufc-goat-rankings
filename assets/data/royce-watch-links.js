// App-facing Watch Moment, Signature Fight, and public snapshot stats for Royce Gracie.
(function(){
  'use strict';
  const VERSION='royce-app-links-stats-20260712b';
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

  applyQualityStats();
  window.addEventListener('ufc-scoring-pipeline-ready',applyQualityStats,{once:true});

  window.UFC_ROYCE_WATCH_LINKS={
    version:VERSION,
    fighter,
    watchUrl:override.watchUrl,
    signatureFightUrl:override.signatureFightUrl,
    qualityStats,
    applied:true
  };
  document.documentElement.setAttribute('data-royce-watch-links',VERSION);
})();