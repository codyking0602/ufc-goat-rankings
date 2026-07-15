// Promotes the calculated UFC GOAT pipeline into the existing app after canonical data is ready.
(function(){
  'use strict';

  const VERSION='production-ranking-bootstrap-20260714a';
  const CALCULATED_STAT_FIELDS=new Set([
    'ufcRecord','titleFightWins','adjustedTitleWins','topFiveWins','top5Wins','rankedWins',
    'finishRatePct','primeRecord','roundsWonPct','activeEliteYears','timesFinishedPrime','throughPrimeUfcFights',
    'rank','allTimeRank','overallOvr','totalScore','rawScore','championship','opponentQuality',
    'primeDominance','longevity','apexPeak','penalty','lossPenalty','eraDepthAdjustment'
  ]);
  const scripts=[
    ['assets/data/canonical-fighter-facts-approved-corrections.js?v=canonical-fighter-facts-approved-corrections-20260714','data-production-facts-approved-corrections'],
    ['assets/data/canonical-fighter-facts-opponent-quality-corrections.js?v=canonical-fighter-facts-opponent-quality-corrections-20260714','data-production-facts-opponent-quality-corrections'],
    ['assets/data/canonical-fighter-facts-prime-round-corrections.js?v=canonical-fighter-facts-prime-round-corrections-20260714','data-production-facts-prime-round-corrections'],
    ['assets/data/canonical-division-era-depth-approved-resolutions.js?v=canonical-division-era-depth-approved-resolutions-20260714','data-production-era-depth-resolutions'],
    ['assets/data/canonical-scoring-judgments.js?v=canonical-scoring-judgments-20260714b','data-production-scoring-judgments'],
    ['assets/js/category-calculators.js?v=category-calculators-20260714c','data-production-category-calculators'],
    ['assets/js/ranking-pipeline.js?v=ranking-pipeline-20260714c','data-production-ranking-pipeline']
  ];

  function loadScript(src,attribute){
    return new Promise(resolve=>{
      const existing=document.querySelector(`script[${attribute}]`);
      if(existing){
        if(existing.dataset.loaded==='true'||existing.readyState==='complete')resolve();
        else existing.addEventListener('load',resolve,{once:true});
        return;
      }
      const script=document.createElement('script');
      script.src=src;
      script.setAttribute(attribute,'true');
      script.onload=()=>{script.dataset.loaded='true';resolve();};
      script.onerror=()=>resolve();
      document.body.appendChild(script);
    });
  }

  function removeCalculatedKeys(object){
    if(!object||typeof object!=='object')return;
    CALCULATED_STAT_FIELDS.forEach(field=>{if(Object.prototype.hasOwnProperty.call(object,field))delete object[field];});
  }

  function stripPresentationScoreOwnership(){
    const overrides=window.DISPLAY_OVERRIDES||{};
    Object.values(overrides).forEach(override=>{
      if(!override||typeof override!=='object')return;
      delete override.overallOvr;
      delete override.allTimeRank;
      delete override.snapshot;
      removeCalculatedKeys(override.snapshotStats);
      removeCalculatedKeys(override.packetProfileStats);
      Object.values(override.categories||{}).forEach(category=>{
        if(!category||typeof category!=='object')return;
        ['rank','ovr','score','value','rawScore','percentile'].forEach(field=>delete category[field]);
      });
    });
  }

  function rowFor(name){
    const target=String(name||'').trim().toLowerCase();
    const data=window.RANKING_DATA||{};
    return [...(data.men||[]),...(data.women||[]),...(data.fighters||[])].find(row=>String(row?.fighter||'').trim().toLowerCase()===target)||null;
  }

  function syncComparePresentation(){
    const profiles=window.COMPARE_PROFILES||{};
    Object.entries(profiles).forEach(([fighter,profile])=>{
      const row=rowFor(fighter);
      if(!row||!profile)return;
      const primeNote=profile.legacyStats?.primeNote||null;
      profile.legacyStats={
        ...(primeNote?{primeNote}:{}),
        titleFightWins:Number(row.titleFightWins||0),
        adjustedTitleWins:Number(row.adjustedTitleWins||0),
        topFiveWins:Number(row.topFiveWins||0),
        rankedWins:Number(row.rankedWins||0),
        primeRecord:row.primeRecord||'—',
        roundsWonPct:Number(row.roundsWonPct||0),
        finishRatePct:Number(row.finishRatePct||0),
        activeEliteYears:Number(row.activeEliteYears||0),
        activeEliteYearsLabel:`${Number(row.activeEliteYears||0).toFixed(1)} active elite years`,
        overallOvr:Number(row.overallOvr||0),
        rank:Number(row.rank||0),
        source:'calculated-ranking-pipeline'
      };
      const override=window.DISPLAY_OVERRIDES?.[fighter]?.compareProfile;
      if(override)override.legacyStats={...profile.legacyStats};
    });
  }

  function publishReady(report){
    window.UFC_SCORING_PIPELINE={
      version:VERSION,
      status:'ready',
      owner:'ranking-pipeline.js',
      fighterCount:report.fighterCount,
      report
    };
    document.documentElement.setAttribute('data-scoring-pipeline','ready');
    document.documentElement.setAttribute('data-production-ranking-bootstrap',`${VERSION}-ready-${report.fighterCount}`);
    if(typeof window.refresh==='function')window.refresh();
    window.UFC_CATEGORY_LEADERS?.render?.();
    window.UFC_DIVISION_RANKINGS?.render?.();
    window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render?.();
    window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-ready',{detail:report}));
    window.dispatchEvent(new CustomEvent('ufc-production-ranking-ready',{detail:report}));
  }

  async function apply(){
    try{
      if(window.UFC_RANKING_DATA_PATCHES_READY)await window.UFC_RANKING_DATA_PATCHES_READY;
      for(const [src,attribute] of scripts)await loadScript(src,attribute);
      const pipeline=window.UFC_RANKING_PIPELINE;
      if(!pipeline?.apply)throw new Error('Calculated ranking pipeline did not load.');
      const report=pipeline.apply();
      stripPresentationScoreOwnership();
      syncComparePresentation();
      publishReady(report);
      window.UFC_PRODUCTION_RANKING_BOOTSTRAP={version:VERSION,status:'ready',report,stripPresentationScoreOwnership,syncComparePresentation};
    }catch(error){
      document.documentElement.setAttribute('data-production-ranking-bootstrap',`${VERSION}-error`);
      window.UFC_PRODUCTION_RANKING_BOOTSTRAP={version:VERSION,status:'error',error:String(error?.message||error)};
      console.error(`[${VERSION}]`,error);
    }
  }

  apply();
})();