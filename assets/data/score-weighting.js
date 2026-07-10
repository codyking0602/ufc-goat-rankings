// Legacy score-weighting compatibility layer.
// Exposes the locked weights, formula, pure breakdown helper, and Rules-page copy.
// Overall scoring, ranks, profiles, and OVR are owned exclusively by final-score-engine.js.
(function(){
  const VERSION='score-weighting-20260710a-compatibility-only';
  const DATA=window.RANKING_DATA;
  const WEIGHTS={
    championship:35,
    opponentQuality:27.5,
    primeDominance:27.5,
    longevity:10
  };
  const BASE_MAX={
    championship:30,
    opponentQuality:30,
    primeDominance:30,
    longevity:30
  };
  const LEGACY_LONGEVITY_MAX=15;
  const MODIFIER_MODE='Apex Peak is a positive bonus modifier after the 100-point positive category score. Loss Context remains a separate negative modifier after the same base score.';
  const FORMULA='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty';

  function num(value){
    const n=Number(value??0);
    return Number.isFinite(n)?n:0;
  }
  function round2(value){
    return Math.round((num(value)+Number.EPSILON)*100)/100;
  }
  function categoryScore(row,key){
    if(key==='longevity'){
      const raw=num(row?.longevity);
      if(row?.longevityThirtyPoint===true||raw>LEGACY_LONGEVITY_MAX)return raw;
      return (raw/LEGACY_LONGEVITY_MAX)*BASE_MAX.longevity;
    }
    return num(row?.[key]);
  }
  function weightedComponent(row,key){
    return (categoryScore(row,key)/BASE_MAX[key])*WEIGHTS[key];
  }
  function scoreBreakdown(row){
    if(window.UFC_FINAL_SCORE_ENGINE?.scoreBreakdown){
      return window.UFC_FINAL_SCORE_ENGINE.scoreBreakdown(row);
    }
    const championship=weightedComponent(row,'championship');
    const opponentQuality=weightedComponent(row,'opponentQuality');
    const primeDominance=weightedComponent(row,'primeDominance');
    const longevity=weightedComponent(row,'longevity');
    const apexPeak=num(row?.apexPeak);
    const penalty=num(row?.penalty);
    const baseScore=championship+opponentQuality+primeDominance+longevity;
    const modifierScore=apexPeak+penalty;
    return {
      championship:round2(championship),
      opponentQuality:round2(opponentQuality),
      primeDominance:round2(primeDominance),
      longevity:round2(longevity),
      baseScore:round2(baseScore),
      positiveScore:round2(baseScore),
      apexPeak:round2(apexPeak),
      apexPeakBonus:round2(apexPeak),
      penalty:round2(penalty),
      modifierScore:round2(modifierScore),
      totalScore:round2(baseScore+modifierScore)
    };
  }
  function apply(reason='compatibility-check'){
    return {
      version:VERSION,
      applied:true,
      mode:'compatibility-only',
      reason,
      mutatesScores:false,
      overallOwner:window.UFC_FINAL_SCORE_ENGINE?.version||'final-score-engine.js',
      appliedAt:new Date().toISOString()
    };
  }
  function installRulesWeightNote(){
    if(typeof renderRules!=='function')return;
    const originalRenderRules=renderRules;
    if(originalRenderRules.__scoreWeightingCompatibilityWrapped)return;
    const wrapped=function(){
      originalRenderRules();
      const target=document.getElementById('rulesContent');
      if(!target||target.dataset.scoreWeightingVersion===VERSION)return;
      target.dataset.scoreWeightingVersion=VERSION;
      target.insertAdjacentHTML('beforeend',`
        <div class="card"><h3>Overall Weighting</h3><table class="table"><tbody>
          <tr><td><strong>Championship Resume</strong></td><td>35%</td></tr>
          <tr><td><strong>Quality Wins</strong></td><td>27.5%</td></tr>
          <tr><td><strong>Prime Dominance</strong></td><td>27.5%</td></tr>
          <tr><td><strong>Elite Longevity</strong></td><td>10%</td></tr>
          <tr><td><strong>Apex Peak</strong></td><td>Positive bonus modifier after the 100-point base.</td></tr>
          <tr><td><strong>Loss Context</strong></td><td>Negative modifier after the 100-point base.</td></tr>
        </tbody></table><p class="meta">Each main category is treated as a 30-point score, then multiplied by its category weight. Apex Peak adds bonus points after the 100-point base. Loss Context subtracts points after the same base.</p></div>
      `);
    };
    wrapped.__scoreWeightingCompatibilityWrapped=true;
    wrapped.__scoreWeightingCompatibilityOriginal=originalRenderRules;
    renderRules=wrapped;
  }

  const API={
    version:VERSION,
    mode:'compatibility-only',
    weights:WEIGHTS,
    baseMax:BASE_MAX,
    legacyLongevityMax:LEGACY_LONGEVITY_MAX,
    modifierMode:MODIFIER_MODE,
    formula:FORMULA,
    scoreBreakdown,
    categoryScore,
    weightedComponent,
    apply,
    mutatesScores:false,
    primeWindowsLoader:false,
    primeDominanceShadowLoader:false,
    apexPeakBonusLive:true,
    overallOwner:'final-score-engine.js',
    appliedAt:new Date().toISOString()
  };

  window.UFC_SCORE_WEIGHTING=API;
  if(DATA?.meta){
    DATA.meta.scoringWeights={
      version:VERSION,
      weights:WEIGHTS,
      baseMax:BASE_MAX,
      legacyLongevityMax:LEGACY_LONGEVITY_MAX,
      modifierMode:MODIFIER_MODE,
      formula:FORMULA,
      mode:'compatibility-only',
      overallOwner:'final-score-engine.js'
    };
  }
  document.documentElement.setAttribute('data-score-weighting',VERSION);
  installRulesWeightNote();
})();