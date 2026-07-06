// Apex Peak bonus corrections.
// Adds a controlled 0-to-6 best-night / best-year modifier before final score weighting.
(function(){
  const VERSION = 'apex-peak-score-corrections-20260705a';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const RUBRIC = {
    peakStatus: 1.50,
    eliteOpponentProof: 1.50,
    separationDominance: 1.25,
    divisionStrength: 1.00,
    cleanApexAura: 0.75
  };

  const corrections = {
    'Jon Jones': {
      apexPeak: 6.00,
      window: 'Shogun 2011 through Daniel Cormier 2015',
      components: { peakStatus: 1.50, eliteOpponentProof: 1.50, separationDominance: 1.25, divisionStrength: 1.00, cleanApexAura: 0.75 },
      notes: 'Mythic UFC apex: youngest champion, destroyed Shogun, then stacked elite LHW title wins with no real competitive loss in the apex window.'
    },
    'Khabib Nurmagomedov': {
      apexPeak: 6.00,
      window: 'Conor 2018 through Gaethje 2020',
      components: { peakStatus: 1.50, eliteOpponentProof: 1.50, separationDominance: 1.25, divisionStrength: 1.00, cleanApexAura: 0.75 },
      notes: 'Mythic lightweight apex: erased elite/title-level opponents in the toughest division with almost no visible vulnerability.'
    },
    'Anderson Silva': {
      apexPeak: 5.50,
      window: 'Rich Franklin 2006 through Vitor Belfort 2011',
      components: { peakStatus: 1.50, eliteOpponentProof: 1.25, separationDominance: 1.25, divisionStrength: 0.75, cleanApexAura: 0.75 },
      notes: 'All-time aura apex with historic finishing separation. Middleweight strength is not maxed, but the best-night case is still one of UFC\'s loudest.'
    },
    'Georges St-Pierre': {
      apexPeak: 5.25,
      window: 'Matt Hughes II 2006 through Johny Hendricks 2013',
      components: { peakStatus: 1.25, eliteOpponentProof: 1.50, separationDominance: 1.00, divisionStrength: 0.75, cleanApexAura: 0.75 },
      notes: 'Elite complete-fighter apex: less destructive than Khabib/Jones/Anderson, but absurd control against a deep welterweight field.'
    },
    'Islam Makhachev': {
      apexPeak: 5.25,
      window: 'Oliveira 2022 through active lightweight/welterweight title window',
      components: { peakStatus: 1.25, eliteOpponentProof: 1.50, separationDominance: 1.00, divisionStrength: 1.00, cleanApexAura: 0.50 },
      notes: 'Modern lightweight apex case is already elite: Oliveira, Volkanovski/Poirier-level proof and current-table title value, but still building versus the mythic completed peaks.'
    },
    'Demetrious Johnson': {
      apexPeak: 4.75,
      window: 'Benavidez II 2013 through Cejudo I 2016',
      components: { peakStatus: 1.25, eliteOpponentProof: 1.25, separationDominance: 1.25, divisionStrength: 0.25, cleanApexAura: 0.75 },
      notes: 'Skill apex is legendary and separation was real. Flyweight depth keeps the apex bonus below the deepest-division mythic cases.'
    },
    'Alexander Volkanovski': {
      apexPeak: 4.75,
      window: 'Aldo 2019 through Holloway III 2022',
      components: { peakStatus: 1.25, eliteOpponentProof: 1.25, separationDominance: 1.00, divisionStrength: 0.75, cleanApexAura: 0.50 },
      notes: 'Modern featherweight apex with Aldo/Max proof and strong technical separation; Islam/Topuria context keeps it below the mythic tier.'
    },
    'Max Holloway': {
      apexPeak: 3.75,
      window: 'Aldo 2017 through Ortega 2018',
      components: { peakStatus: 0.75, eliteOpponentProof: 1.25, separationDominance: 0.75, divisionStrength: 0.75, cleanApexAura: 0.25 },
      notes: 'Excellent UFC apex with Aldo/Ortega proof, but not a clear best-fighter-alive case once Volk and lightweight title limits enter the picture.'
    },
    'Jose Aldo': {
      apexPeak: 2.75,
      window: 'Frankie Edgar II 2016 through Jeremy Stephens 2018',
      components: { peakStatus: 0.75, eliteOpponentProof: 0.75, separationDominance: 0.50, divisionStrength: 0.50, cleanApexAura: 0.25 },
      notes: 'UFC-only treatment. Historically Aldo\'s true apex is higher with WEC included, but this modifier only scores UFC proof.'
    },
    'Randy Couture': {
      apexPeak: 1.25,
      window: 'Tim Sylvia 2007 through Gabriel Gonzaga 2007',
      components: { peakStatus: 0.25, eliteOpponentProof: 0.25, separationDominance: 0.25, divisionStrength: 0.25, cleanApexAura: 0.25 },
      notes: 'Great UFC title moments and old-era résumé value, but not a strong best-fighter-alive apex case under the modern UFC-only rubric.'
    }
  };

  function round2(value){
    return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  }
  function sumComponents(components){
    return round2(Object.values(components || {}).reduce((sum,value) => sum + Number(value || 0), 0));
  }
  function patchRow(row){
    if(!row || !corrections[row.fighter]) return;
    const c = corrections[row.fighter];
    const componentTotal = sumComponents(c.components);
    row.apexPeak = round2(c.apexPeak);
    row.apexPeakAudit = {
      score: row.apexPeak,
      window: c.window,
      components: c.components,
      componentTotal,
      notes: c.notes,
      rubric: RUBRIC,
      source: 'Apex Peak Batch 1 rubric',
      version: VERSION
    };
  }

  [...(DATA.men || []), ...(DATA.women || []), ...(DATA.fighters || [])].forEach(patchRow);

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    Object.entries(corrections).forEach(([fighter,c]) => {
      if(!DISPLAY_OVERRIDES[fighter]) return;
      DISPLAY_OVERRIDES[fighter].apexPeakAudit = {
        score: c.apexPeak,
        window: c.window,
        components: c.components,
        notes: c.notes,
        version: VERSION
      };
    });
  }

  window.UFC_APEX_PEAK_SCORE_CORRECTIONS = {
    version: VERSION,
    rubric: RUBRIC,
    fighters: Object.keys(corrections),
    corrections,
    appliedAt: new Date().toISOString()
  };
})();
