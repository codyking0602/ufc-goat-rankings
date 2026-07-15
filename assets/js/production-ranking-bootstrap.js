// Promotes the calculated UFC GOAT pipeline into the existing app after canonical data is ready.
(function(){
  'use strict';

  const VERSION='production-ranking-bootstrap-20260715c-automatic-derived-outputs';
  const CALCULATED_STAT_FIELDS=new Set([
    'ufcRecord','titleFightWins','adjustedTitleWins','topFiveWins','top5Wins','rankedWins',
    'finishRatePct','primeRecord','roundsWonPct','activeEliteYears','timesFinishedPrime','throughPrimeUfcFights',
    'rank','allTimeRank','overallOvr','totalScore','rawScore','championship','opponentQuality',
    'primeDominance','longevity','apexPeak','penalty','lossPenalty','lossContext','eraDepthAdjustment'
  ]);
  const cleanScripts=[
    ['assets/data/canonical-fighter-facts.js?v=production-clean-canonical-fighter-facts-20260713c','data-production-clean-facts-base'],
    ['assets/data/canonical-fighter-facts-batch-one.js?v=production-clean-canonical-fighter-facts-batch-one','data-production-clean-facts-batch-one'],
    ['assets/data/canonical-fighter-facts-batch-two.js?v=production-clean-canonical-fighter-facts-batch-two','data-production-clean-facts-batch-two'],
    ['assets/data/canonical-fighter-facts-batch-three.js?v=production-clean-canonical-fighter-facts-batch-three','data-production-clean-facts-batch-three'],
    ['assets/data/canonical-fighter-facts-batch-four.js?v=production-clean-canonical-fighter-facts-batch-four','data-production-clean-facts-batch-four'],
    ['assets/data/canonical-fighter-facts-batch-five.js?v=production-clean-canonical-fighter-facts-batch-five','data-production-clean-facts-batch-five'],
    ['assets/data/canonical-fighter-facts-batch-six.js?v=production-clean-canonical-fighter-facts-batch-six','data-production-clean-facts-batch-six'],
    ['assets/data/canonical-fighter-facts-batch-seven-data-a.js?v=production-clean-canonical-fighter-facts-batch-seven-data-a','data-production-clean-facts-batch-seven-data-a'],
    ['assets/data/canonical-fighter-facts-batch-seven-data-b.js?v=production-clean-canonical-fighter-facts-batch-seven-data-b','data-production-clean-facts-batch-seven-data-b'],
    ['assets/data/canonical-fighter-facts-batch-seven.js?v=production-clean-canonical-fighter-facts-batch-seven','data-production-clean-facts-batch-seven'],
    ['assets/data/canonical-fighter-facts-batch-eight-data-a.js?v=production-clean-canonical-fighter-facts-batch-eight-data-a','data-production-clean-facts-batch-eight-data-a'],
    ['assets/data/canonical-fighter-facts-batch-eight-data-b.js?v=production-clean-canonical-fighter-facts-batch-eight-data-b','data-production-clean-facts-batch-eight-data-b'],
    ['assets/data/canonical-fighter-facts-batch-eight.js?v=production-clean-canonical-fighter-facts-batch-eight','data-production-clean-facts-batch-eight'],
    ['assets/data/canonical-fighter-facts-batch-nine-data-a.js?v=production-clean-canonical-fighter-facts-batch-nine-data-a','data-production-clean-facts-batch-nine-data-a'],
    ['assets/data/canonical-fighter-facts-batch-nine-data-b.js?v=production-clean-canonical-fighter-facts-batch-nine-data-b','data-production-clean-facts-batch-nine-data-b'],
    ['assets/data/canonical-fighter-facts-batch-nine-data-c.js?v=production-clean-canonical-fighter-facts-batch-nine-data-c','data-production-clean-facts-batch-nine-data-c'],
    ['assets/data/canonical-fighter-facts-batch-nine.js?v=production-clean-canonical-fighter-facts-batch-nine','data-production-clean-facts-batch-nine'],
    ['assets/data/canonical-fighter-facts-approved-corrections.js?v=production-clean-canonical-fighter-facts-approved-corrections','data-production-clean-facts-approved-corrections'],
    ['assets/data/canonical-fighter-facts-opponent-quality-corrections.js?v=production-clean-canonical-fighter-facts-opponent-quality-corrections','data-production-clean-facts-opponent-quality-corrections'],
    ['assets/data/canonical-fighter-facts-prime-round-corrections.js?v=production-clean-canonical-fighter-facts-prime-round-corrections','data-production-clean-facts-prime-round-corrections'],
    ['assets/data/fighter-era-ledgers.js?v=production-clean-fighter-era-ledgers-20260714h','data-production-clean-era-ledgers'],
    ['assets/data/fighter-era-ledger-approved-longevity-resolutions.js?v=production-clean-fighter-era-ledger-approved-longevity-resolutions','data-production-clean-era-longevity-resolutions'],
    ['assets/data/fighter-era-ledger-approved-loss-context-resolutions.js?v=production-clean-fighter-era-ledger-approved-loss-context-resolutions','data-production-clean-era-loss-resolutions'],
    ['assets/data/division-era-depth-shadow.js?v=production-clean-division-era-depth-shadow','data-production-clean-era-depth-shadow'],
    ['assets/data/canonical-division-era-depth-approved-resolutions.js?v=production-clean-canonical-division-era-depth-approved-resolutions','data-production-clean-era-depth-resolutions'],
    ['assets/data/canonical-scoring-judgments.js?v=production-clean-canonical-scoring-judgments','data-production-clean-scoring-judgments'],
    ['assets/js/category-calculators.js?v=production-clean-category-calculators-20260714c','data-production-clean-category-calculators'],
    ['assets/js/ranking-pipeline.js?v=production-clean-ranking-pipeline-20260714c','data-production-clean-ranking-pipeline'],
    ['assets/js/calculated-profile-runtime.js?v=production-clean-calculated-profile-runtime-20260714a','data-production-clean-calculated-profile-runtime'],
    ['assets/js/division-ranking-pipeline.js?v=division-ranking-pipeline-20260715a-canonical-allocation','data-production-clean-division-ranking-pipeline'],
    ['assets/js/division-ranking-reconciliation.js?v=division-ranking-reconciliation-20260715a','data-production-clean-division-ranking-reconciliation']
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
      const primeNote=profile.primeNote||profile.legacyStats?.primeNote||null;
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

  function assertApprovedInputs(){
    const missing=[];
    if(window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()!==73)missing.push('73 clean canonical fighter records');
    if(window.UFC_FIGHTER_ERA_LEDGERS?.fighters?.length!==73)missing.push('73 clean fighter era ledgers');
    if(window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount!==73)missing.push('73-fighter scoring judgments');
    const audit=window.UFC_CATEGORY_CALCULATOR_AUDIT;
    if(audit?.passed!==true||audit?.completeFighterCount!==73)missing.push('complete seven-category calculation audit');
    if(!window.UFC_CALCULATED_PROFILE_RUNTIME)missing.push('calculated profile runtime');
    if(!window.UFC_DIVISION_RANKING_PIPELINE?.rebuild)missing.push('automatic division ranking pipeline');
    if(!window.UFC_DIVISION_RANKING_RECONCILIATION)missing.push('division allocation reconciliation');
    if(missing.length)throw new Error(`Missing calculated ranking inputs: ${missing.join(', ')}`);
  }

  function publishReady(report,divisionReport){
    window.UFC_SCORING_PIPELINE={
      version:VERSION,
      status:'ready',
      owner:'ranking-pipeline.js',
      inputIsolation:'clean-canonical-rebuild',
      fighterCount:report.fighterCount,
      divisionRankingVersion:divisionReport?.version||null,
      report
    };
    document.documentElement.setAttribute('data-scoring-pipeline','ready');
    document.documentElement.setAttribute('data-production-ranking-bootstrap',`${VERSION}-ready-${report.fighterCount}`);
    if(typeof window.refresh==='function')window.refresh();
    window.UFC_CATEGORY_LEADERS?.render?.();
    window.UFC_DIVISION_RANKINGS?.render?.();
    window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render?.();
    window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-ready',{detail:{report,divisionReport}}));
    window.dispatchEvent(new CustomEvent('ufc-production-ranking-ready',{detail:{report,divisionReport}}));
  }

  async function apply(){
    try{
      if(window.UFC_RANKING_DATA_PATCHES_READY)await window.UFC_RANKING_DATA_PATCHES_READY;
      for(const [src,attribute] of cleanScripts)await loadScript(src,attribute);
      assertApprovedInputs();
      const pipeline=window.UFC_RANKING_PIPELINE;
      if(!pipeline?.apply)throw new Error('Calculated ranking pipeline did not load.');
      const report=pipeline.apply();
      stripPresentationScoreOwnership();
      syncComparePresentation();
      const divisionReport=window.UFC_DIVISION_RANKING_PIPELINE.rebuild();
      if(divisionReport?.passed!==true){
        const detail=JSON.stringify({invalid:divisionReport?.invalid||[],conservation:divisionReport?.conservation||[],allocationWarnings:divisionReport?.allocationWarnings||[]});
        throw new Error(`Automatic division rankings are ${divisionReport?.status||'blocked'}: ${detail}`);
      }
      publishReady(report,divisionReport);
      window.UFC_PRODUCTION_RANKING_BOOTSTRAP={version:VERSION,status:'ready',inputIsolation:'clean-canonical-rebuild',report,divisionReport,stripPresentationScoreOwnership,syncComparePresentation};
    }catch(error){
      document.documentElement.setAttribute('data-production-ranking-bootstrap',`${VERSION}-error`);
      window.UFC_PRODUCTION_RANKING_BOOTSTRAP={version:VERSION,status:'error',error:String(error?.message||error)};
      console.error(`[${VERSION}]`,error);
    }
  }

  apply();
})();
