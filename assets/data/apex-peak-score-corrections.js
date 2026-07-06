// Apex Peak bonus corrections.
// Adds a controlled 0-to-6 best-night / best-year modifier before final score weighting.
(function(){
  const VERSION = 'apex-peak-score-corrections-20260705c';
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
      apexPeak: 4.50,
      window: 'Benavidez II 2013 through Cejudo I 2016',
      components: { peakStatus: 1.25, eliteOpponentProof: 1.25, separationDominance: 1.25, divisionStrength: 0.25, cleanApexAura: 0.50 },
      notes: 'Skill apex is legendary and separation was real. Flyweight depth and slightly reduced aura keep the apex bonus below the deepest-division mythic cases.'
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
    },
    'Conor McGregor': {
      apexPeak: 4.75,
      window: 'Jose Aldo 2015 through Eddie Alvarez 2016',
      components: { peakStatus: 1.25, eliteOpponentProof: 1.25, separationDominance: 1.25, divisionStrength: 0.75, cleanApexAura: 0.25 },
      notes: 'Explosive two-division apex: Aldo and Alvarez are massive one-night proof points. Diaz context keeps the clean-aura score from matching the mythic unbeaten peaks.'
    },
    'Alex Pereira': {
      apexPeak: 4.75,
      window: 'Jiri Prochazka 2023 through Jiri Prochazka II 2024',
      components: { peakStatus: 1.00, eliteOpponentProof: 1.25, separationDominance: 1.25, divisionStrength: 0.75, cleanApexAura: 0.50 },
      notes: 'Rare two-division title/finishing apex with terrifying one-night danger. Shorter UFC sample and mixed round-control profile keep it below the completed mythic peaks.'
    },
    'Kamaru Usman': {
      apexPeak: 4.50,
      window: 'Tyron Woodley 2019 through Jorge Masvidal II 2021',
      components: { peakStatus: 1.25, eliteOpponentProof: 1.25, separationDominance: 1.00, divisionStrength: 0.75, cleanApexAura: 0.25 },
      notes: 'Strong welterweight title apex with Woodley/Covington/Masvidal proof and real control. Later Edwards finish and less mythic aura keep him below GSP-style apex.'
    },
    'Daniel Cormier': {
      apexPeak: 4.25,
      window: 'Anthony Johnson 2015 through Stipe Miocic I 2018',
      components: { peakStatus: 1.00, eliteOpponentProof: 1.25, separationDominance: 0.75, divisionStrength: 0.75, cleanApexAura: 0.50 },
      notes: 'Double-champ apex and elite LHW/HW proof. Jones rivalry caps best-alive claim and separation versus the absolute apex tier.'
    },
    'Charles Oliveira': {
      apexPeak: 4.00,
      window: 'Michael Chandler 2021 through Justin Gaethje 2022',
      components: { peakStatus: 0.75, eliteOpponentProof: 1.25, separationDominance: 0.75, divisionStrength: 1.00, cleanApexAura: 0.25 },
      notes: 'Modern lightweight apex with Chandler/Poirier/Gaethje proof and real finishing danger. Chaotic vulnerability keeps the aura/separation below cleaner peak cases.'
    },
    'Israel Adesanya': {
      apexPeak: 4.00,
      window: 'Robert Whittaker 2019 through Paulo Costa 2020',
      components: { peakStatus: 1.00, eliteOpponentProof: 1.00, separationDominance: 1.00, divisionStrength: 0.50, cleanApexAura: 0.50 },
      notes: 'Elite middleweight apex with Whittaker/Costa proof and clean striking separation. Middleweight depth and later matchup cracks keep it below the highest apex tier.'
    },
    'Henry Cejudo': {
      apexPeak: 4.00,
      window: 'Demetrious Johnson II 2018 through Dominick Cruz 2020',
      components: { peakStatus: 1.00, eliteOpponentProof: 1.25, separationDominance: 0.75, divisionStrength: 0.75, cleanApexAura: 0.25 },
      notes: 'Champ-champ apex with DJ, Dillashaw, Moraes, and Cruz title proof. Compact run and less clean dominance keep it from the mythic tier.'
    },
    'Stipe Miocic': {
      apexPeak: 3.75,
      window: 'Fabricio Werdum 2016 through Francis Ngannou I 2018',
      components: { peakStatus: 0.75, eliteOpponentProof: 1.25, separationDominance: 0.75, divisionStrength: 0.50, cleanApexAura: 0.50 },
      notes: 'Heavyweight apex with Werdum, Overeem, JDS, and Ngannou proof. Heavyweight volatility and later DC/Ngannou context keep the bonus moderate.'
    },
    'Matt Hughes': {
      apexPeak: 3.75,
      window: 'Carlos Newton II 2002 through Frank Trigg II 2005',
      components: { peakStatus: 1.00, eliteOpponentProof: 1.00, separationDominance: 1.00, divisionStrength: 0.25, cleanApexAura: 0.50 },
      notes: 'Old-era welterweight apex with real dominance and title control. Era/depth limits keep it below modern deep-division apex cases.'
    },
    'Dominick Cruz': {
      apexPeak: 3.25,
      window: 'Takeya Mizugaki 2014 through T.J. Dillashaw 2016',
      components: { peakStatus: 0.75, eliteOpponentProof: 0.75, separationDominance: 0.75, divisionStrength: 0.50, cleanApexAura: 0.50 },
      notes: 'UFC-only Cruz apex is the comeback/technical control version, not the full WEC-inclusive peak. Strong but capped by UFC-only volume and finish profile.'
    },
    'Ilia Topuria': {
      apexPeak: 5.00,
      window: 'Alexander Volkanovski 2024 through current lightweight title window',
      components: { peakStatus: 1.25, eliteOpponentProof: 1.25, separationDominance: 1.25, divisionStrength: 0.75, cleanApexAura: 0.50 },
      notes: 'Current-table monster apex: Volkanovski plus title-level lightweight proof creates a huge best-night case. Short sample keeps him below the completed mythic peaks for now.'
    },
    'Francis Ngannou': {
      apexPeak: 4.25,
      window: 'Jairzinho Rozenstruik 2020 through Ciryl Gane 2022',
      components: { peakStatus: 1.00, eliteOpponentProof: 1.00, separationDominance: 1.25, divisionStrength: 0.50, cleanApexAura: 0.50 },
      notes: 'Terrifying heavyweight apex with unmatched one-shot danger and improved title-fight proof. Heavyweight volatility and UFC exit/context keep it below the top apex tier.'
    },
    'Cain Velasquez': {
      apexPeak: 4.00,
      window: 'Brock Lesnar 2010 through Junior dos Santos III 2013',
      components: { peakStatus: 1.00, eliteOpponentProof: 1.25, separationDominance: 1.00, divisionStrength: 0.50, cleanApexAura: 0.25 },
      notes: 'High-level heavyweight apex with pace, pressure, and elite title proof. Injuries, heavyweight volatility, and limited clean longevity cap the aura score.'
    },
    'T.J. Dillashaw': {
      apexPeak: 4.00,
      window: 'Renan Barao 2014 through Cody Garbrandt II 2018',
      components: { peakStatus: 1.00, eliteOpponentProof: 1.00, separationDominance: 1.25, divisionStrength: 0.50, cleanApexAura: 0.25 },
      notes: 'Barao/Garbrandt apex was technically brilliant and violent. EPO context and later shoulder/injury end keep the clean-aura score low.'
    },
    'Petr Yan': {
      apexPeak: 3.75,
      window: 'Jose Aldo 2020 through Aljamain Sterling I 2021',
      components: { peakStatus: 0.75, eliteOpponentProof: 1.00, separationDominance: 0.75, divisionStrength: 0.75, cleanApexAura: 0.50 },
      notes: 'High-skill bantamweight apex with elite technical separation. Sterling rivalry and narrow later losses keep him from a higher best-alive score.'
    },
    'Aljamain Sterling': {
      apexPeak: 3.75,
      window: 'Petr Yan II 2022 through Henry Cejudo 2023',
      components: { peakStatus: 0.75, eliteOpponentProof: 1.25, separationDominance: 0.50, divisionStrength: 0.75, cleanApexAura: 0.50 },
      notes: 'Modern bantamweight title apex with Yan/Cejudo proof. Style, DQ/title context, and narrow scorecards limit separation but not opponent proof.'
    },
    'Dustin Poirier': {
      apexPeak: 3.50,
      window: 'Justin Gaethje 2018 through Conor McGregor II 2021',
      components: { peakStatus: 0.50, eliteOpponentProof: 1.25, separationDominance: 0.50, divisionStrength: 1.00, cleanApexAura: 0.25 },
      notes: 'Excellent lightweight apex résumé with Gaethje, Holloway, and McGregor proof. Title-fight losses and chaotic damage profile keep the best-alive/aura score modest.'
    },
    'B.J. Penn': {
      apexPeak: 3.50,
      window: 'Joe Stevenson 2008 through Diego Sanchez 2009',
      components: { peakStatus: 1.00, eliteOpponentProof: 0.75, separationDominance: 0.75, divisionStrength: 0.50, cleanApexAura: 0.50 },
      notes: 'UFC lightweight apex had real aura and dominance, but UFC-only opponent proof and the GSP welterweight ceiling keep it below the deepest modern peaks.'
    },
    'Chuck Liddell': {
      apexPeak: 3.50,
      window: 'Randy Couture II 2005 through Tito Ortiz II 2006',
      components: { peakStatus: 0.75, eliteOpponentProof: 1.00, separationDominance: 0.75, divisionStrength: 0.50, cleanApexAura: 0.50 },
      notes: 'Star-era light heavyweight apex with major title proof and knockout aura. Era/depth and later durability collapse cap the bonus.'
    },
    'Justin Gaethje': {
      apexPeak: 3.25,
      window: 'Tony Ferguson 2020 through Dustin Poirier II 2023',
      components: { peakStatus: 0.50, eliteOpponentProof: 1.00, separationDominance: 0.50, divisionStrength: 1.00, cleanApexAura: 0.25 },
      notes: 'Violent lightweight apex with Ferguson and Poirier proof in a brutal division. Khabib/Oliveira/Topuria title-level losses keep best-alive and aura scores limited.'
    },
    'Frankie Edgar': {
      apexPeak: 3.25,
      window: 'B.J. Penn 2010 through Gray Maynard III 2011',
      components: { peakStatus: 0.75, eliteOpponentProof: 1.00, separationDominance: 0.50, divisionStrength: 0.50, cleanApexAura: 0.50 },
      notes: 'Lightweight title apex with Penn/Maynard proof and great resilience. Close fights and limited one-night separation keep the apex moderate.'
    },
    'Dan Henderson': {
      apexPeak: 2.50,
      window: 'Michael Bisping 2009 through Mauricio Rua 2011',
      components: { peakStatus: 0.25, eliteOpponentProof: 0.75, separationDominance: 0.75, divisionStrength: 0.50, cleanApexAura: 0.25 },
      notes: 'UFC-only apex is built around violent signature moments, not a clean best-fighter-alive case. Pride/Strikeforce context remains outside the main scoring.'
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
      source: 'Apex Peak Batches 1-3 rubric',
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
