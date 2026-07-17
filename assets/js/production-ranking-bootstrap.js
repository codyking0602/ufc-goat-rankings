// Promotes the calculated UFC GOAT pipeline into the existing app after canonical data is ready.
(function(){
  'use strict';

  const VERSION='production-ranking-bootstrap-20260717c-anthony-pettis-80';
  const EXPECTED_FIGHTER_COUNT=80;
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
    ['assets/data/canonical-opponent-quality-audit-adjustments.js?v=canonical-opponent-quality-audit-adjustments-20260715b-merab','data-production-clean-opponent-quality-audit-adjustments'],
    ['assets/data/canonical-championship-audit-adjustments.js?v=canonical-championship-audit-adjustments-20260715a-conor-mendes','data-production-clean-championship-audit-adjustments'],
    ['assets/js/category-calculators.js?v=production-clean-category-calculators-20260714c','data-production-clean-category-calculators'],
    ['assets/data/canonical-roster-batch-ten.js?v=canonical-roster-batch-ten-20260715b-pantoja-paddy-weidman','data-production-clean-roster-batch-ten'],
    ['assets/data/canonical-roster-batch-eleven.js?v=canonical-roster-batch-eleven-20260716c-tom-aspinall-photos','data-production-clean-roster-batch-eleven'],
    ['assets/data/canonical-roster-batch-twelve.js?v=canonical-roster-batch-twelve-20260716b-quinton-jackson-photos','data-production-clean-roster-batch-twelve'],
    ['assets/data/canonical-roster-batch-thirteen.js?v=canonical-roster-batch-thirteen-20260717b-official-record','data-production-clean-roster-batch-thirteen'],
    ['assets/data/canonical-roster-batch-fourteen.js?v=canonical-roster-batch-fourteen-20260717b-anthony-pettis-videos','data-production-clean-roster-batch-fourteen'],
    ['assets/js/ranking-pipeline.js?v=production-clean-ranking-pipeline-20260714c','data-production-clean-ranking-pipeline'],
    ['assets/js/calculated-profile-runtime.js?v=production-clean-calculated-profile-runtime-20260715c-longest-win-streak','data-production-clean-calculated-profile-runtime'],
    ['assets/js/division-ranking-pipeline.js?v=division-ranking-pipeline-20260715b-openweight-win-qualified','data-production-clean-division-ranking-pipeline'],
    ['assets/js/division-ranking-reconciliation.js?v=division-ranking-reconciliation-20260715d-strict-openweight','data-production-clean-division-ranking-reconciliation'],
    ['assets/js/octagon-verdict-data.js?v=octagon-verdict-data-20260715b-live-pipeline','data-production-octagon-verdict-data'],
    ['assets/js/octagon-verdict-compare-launcher.js?v=octagon-verdict-compare-launcher-20260716b-intelligence-skip','data-production-octagon-verdict-launcher']
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
    if(window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()!==EXPECTED_FIGHTER_COUNT)missing.push(`${EXPECTED_FIGHTER_COUNT} clean canonical fighter records`);
    if(window.UFC_FIGHTER_ERA_LEDGERS?.fighters?.length!==EXPECTED_FIGHTER_COUNT)missing.push(`${EXPECTED_FIGHTER_COUNT} clean fighter era ledgers`);
    if(window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount!==EXPECTED_FIGHTER_COUNT)missing.push(`${EXPECTED_FIGHTER_COUNT}-fighter scoring judgments`);
    if(window.UFC_CANONICAL_ROSTER_BATCH_TEN?.passed!==true)missing.push('shared canonical roster batch ten');
    if(window.UFC_CANONICAL_ROSTER_BATCH_ELEVEN?.passed!==true)missing.push('shared canonical roster batch eleven');
    if(window.UFC_CANONICAL_ROSTER_BATCH_TWELVE?.passed!==true)missing.push('shared canonical roster batch twelve');
    if(window.UFC_CANONICAL_ROSTER_BATCH_THIRTEEN?.passed!==true)missing.push('shared canonical roster batch thirteen');
    if(window.UFC_CANONICAL_ROSTER_BATCH_FOURTEEN?.passed!==true)missing.push('shared canonical roster batch fourteen');
    if(window.UFC_CANONICAL_OPPONENT_QUALITY_AUDIT_ADJUSTMENTS?.passed!==true)missing.push('approved Opponent Quality fighter-audit adjustments');
    if(window.UFC_CANONICAL_CHAMPIONSHIP_AUDIT_ADJUSTMENTS?.passed!==true)missing.push('approved Championship fighter-audit adjustments');
    const audit=window.UFC_CATEGORY_CALCULATOR_AUDIT;
    if(audit?.passed!==true||audit?.completeFighterCount!==EXPECTED_FIGHTER_COUNT)missing.push('complete seven-category calculation audit');
    if(!window.UFC_CALCULATED_PROFILE_RUNTIME)missing.push('calculated profile runtime');
    if(!window.UFC_DIVISION_RANKING_PIPELINE?.rebuild)missing.push('automatic division ranking pipeline');
    if(!window.UFC_DIVISION_RANKING_RECONCILIATION)missing.push('division allocation reconciliation');
    if(!window.UFC_OCTAGON_VERDICT_DATA?.build)missing.push('automatic Octagon Verdict dataset');
    if(missing.length)throw new Error(`Missing calculated ranking inputs: ${missing.join(', ')}`);
  }

  function publishReady(report,divisionReport){
    window.UFC_SCORING_PIPELINE={
      version:VERSION,status:'ready',owner:'ranking-pipeline.js',inputIsolation:'clean-canonical-rebuild',
      fighterCount:report.fighterCount,divisionRankingVersion:divisionReport?.version||null,
      octagonVerdictVersion:window.UFC_OCTAGON_VERDICT_DATA?.version||null,
      opponentQualityAuditAdjustments:window.UFC_CANONICAL_OPPONENT_QUALITY_AUDIT_ADJUSTMENTS||null,
      championshipAuditAdjustments:window.UFC_CANONICAL_CHAMPIONSHIP_AUDIT_ADJUSTMENTS||null,report
    };
    document.documentElement.setAttribute('data-scoring-pipeline','ready');
    document.documentElement.setAttribute('data-production-ranking-bootstrap',`${VERSION}-ready-${report.fighterCount}`);
    if(typeof window.refresh==='function')window.refresh();
    window.UFC_CATEGORY_LEADERS?.render?.();
    window.UFC_DIVISION_RANKINGS?.render?.();
    window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-ready',{detail:{report,divisionReport}}));
    window.UFC_OCTAGON_VERDICT_DATA?.build?.();
    window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render?.();
    window.dispatchEvent(new CustomEvent('ufc-production-ranking-ready',{detail:{report,divisionReport,octagonVerdict:window.OCTAGON_VERDICT_DATA||null}}));
  }

  async function apply(){
    try{
      if(window.UFC_RANKING_DATA_PATCHES_READY)await window.UFC_RANKING_DATA_PATCHES_READY;
      for(const [src,attribute] of cleanScripts)await loadScript(src,attribute);
      assertApprovedInputs();
      const pipeline=window.UFC_RANKING_PIPELINE;
      if(!pipeline?.apply)throw new Error('Calculated ranking pipeline did not load.');
      const report=pipeline.apply();
      if(report?.fighterCount!==EXPECTED_FIGHTER_COUNT)throw new Error(`Calculated ranking pipeline returned ${report?.fighterCount||0} fighters instead of ${EXPECTED_FIGHTER_COUNT}.`);
      stripPresentationScoreOwnership();
      syncComparePresentation();
      const photoSync=window.UFC_RANKING_DATA_PATCHES_V1?.syncCalculatedRosterPhotos?.({refresh:false,source:'production-ranking-bootstrap-pre-render'})||null;
      if(photoSync&&photoSync.mappedCount!==report.fighterCount)throw new Error(`Final fighter photo mapping covered ${photoSync.mappedCount} of ${report.fighterCount} fighters.`);
      const divisionReport=window.UFC_DIVISION_RANKING_PIPELINE.rebuild();
      if(divisionReport?.passed!==true){
        const detail=JSON.stringify({invalid:divisionReport?.invalid||[],conservation:divisionReport?.conservation||[],allocationWarnings:divisionReport?.allocationWarnings||[]});
        throw new Error(`Automatic division rankings are ${divisionReport?.status||'blocked'}: ${detail}`);
      }
      publishReady(report,divisionReport);
      window.UFC_PRODUCTION_RANKING_BOOTSTRAP={version:VERSION,status:'ready',inputIsolation:'clean-canonical-rebuild',report,divisionReport,photoSync,rosterBatchTen:window.UFC_CANONICAL_ROSTER_BATCH_TEN,rosterBatchEleven:window.UFC_CANONICAL_ROSTER_BATCH_ELEVEN,rosterBatchTwelve:window.UFC_CANONICAL_ROSTER_BATCH_TWELVE,rosterBatchThirteen:window.UFC_CANONICAL_ROSTER_BATCH_THIRTEEN,rosterBatchFourteen:window.UFC_CANONICAL_ROSTER_BATCH_FOURTEEN,opponentQualityAuditAdjustments:window.UFC_CANONICAL_OPPONENT_QUALITY_AUDIT_ADJUSTMENTS||null,championshipAuditAdjustments:window.UFC_CANONICAL_CHAMPIONSHIP_AUDIT_ADJUSTMENTS||null,octagonVerdict:window.OCTAGON_VERDICT_DATA||null,stripPresentationScoreOwnership,syncComparePresentation};
    }catch(error){
      document.documentElement.setAttribute('data-production-ranking-bootstrap',`${VERSION}-error`);
      window.UFC_PRODUCTION_RANKING_BOOTSTRAP={version:VERSION,status:'error',error:String(error?.message||error)};
      console.error(`[${VERSION}]`,error);
    }
  }

  apply();
})();
