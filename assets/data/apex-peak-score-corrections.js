// Apex Peak bonus corrections.
// Adds a controlled 0-to-6 best-night / best-year modifier before final score weighting.
(function(){
  const VERSION = 'apex-peak-score-corrections-20260705e';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const RUBRIC = {
    peakStatus: 1.50,
    eliteOpponentProof: 1.50,
    separationDominance: 1.25,
    divisionStrength: 1.00,
    cleanApexAura: 0.75
  };

  function c(apexPeak, window, peakStatus, eliteOpponentProof, separationDominance, divisionStrength, cleanApexAura, notes){
    return {
      apexPeak,
      window,
      components: { peakStatus, eliteOpponentProof, separationDominance, divisionStrength, cleanApexAura },
      notes
    };
  }

  const corrections = {
    'Jon Jones': c(6.00, 'Shogun 2011 through Daniel Cormier 2015', 1.50, 1.50, 1.25, 1.00, 0.75, 'Mythic UFC apex: youngest champion, destroyed Shogun, then stacked elite LHW title wins with no real competitive loss in the apex window.'),
    'Khabib Nurmagomedov': c(6.00, 'Conor 2018 through Gaethje 2020', 1.50, 1.50, 1.25, 1.00, 0.75, 'Mythic lightweight apex: erased elite/title-level opponents in the toughest division with almost no visible vulnerability.'),
    'Anderson Silva': c(5.50, 'Rich Franklin 2006 through Vitor Belfort 2011', 1.50, 1.25, 1.25, 0.75, 0.75, "All-time aura apex with historic finishing separation. Middleweight strength is not maxed, but the best-night case is still one of UFC's loudest."),
    'Georges St-Pierre': c(5.25, 'Matt Hughes II 2006 through Johny Hendricks 2013', 1.25, 1.50, 1.00, 0.75, 0.75, 'Elite complete-fighter apex: less destructive than Khabib/Jones/Anderson, but absurd control against a deep welterweight field.'),
    'Islam Makhachev': c(5.25, 'Oliveira 2022 through active lightweight/welterweight title window', 1.25, 1.50, 1.00, 1.00, 0.50, 'Modern lightweight apex case is already elite: Oliveira, Volkanovski/Poirier-level proof and current-table title value, but still building versus the mythic completed peaks.'),
    'Demetrious Johnson': c(4.50, 'Benavidez II 2013 through Cejudo I 2016', 1.25, 1.25, 1.25, 0.25, 0.50, 'Skill apex is legendary and separation was real. Flyweight depth and slightly reduced aura keep the apex bonus below the deepest-division mythic cases.'),
    'Alexander Volkanovski': c(4.75, 'Aldo 2019 through Holloway III 2022', 1.25, 1.25, 1.00, 0.75, 0.50, 'Modern featherweight apex with Aldo/Max proof and strong technical separation; Islam/Topuria context keeps it below the mythic tier.'),
    'Max Holloway': c(3.75, 'Aldo 2017 through Ortega 2018', 0.75, 1.25, 0.75, 0.75, 0.25, 'Excellent UFC apex with Aldo/Ortega proof, but not a clear best-fighter-alive case once Volk and lightweight title limits enter the picture.'),
    'Jose Aldo': c(2.75, 'Frankie Edgar II 2016 through Jeremy Stephens 2018', 0.75, 0.75, 0.50, 0.50, 0.25, "UFC-only treatment. Historically Aldo's true apex is higher with WEC included, but this modifier only scores UFC proof."),
    'Randy Couture': c(1.25, 'Tim Sylvia 2007 through Gabriel Gonzaga 2007', 0.25, 0.25, 0.25, 0.25, 0.25, 'Great UFC title moments and old-era résumé value, but not a strong best-fighter-alive apex case under the modern UFC-only rubric.'),
    'Conor McGregor': c(4.75, 'Jose Aldo 2015 through Eddie Alvarez 2016', 1.25, 1.25, 1.25, 0.75, 0.25, 'Explosive two-division apex: Aldo and Alvarez are massive one-night proof points. Diaz context keeps the clean-aura score from matching the mythic unbeaten peaks.'),
    'Alex Pereira': c(4.75, 'Jiri Prochazka 2023 through Jiri Prochazka II 2024', 1.00, 1.25, 1.25, 0.75, 0.50, 'Rare two-division title/finishing apex with terrifying one-night danger. Shorter UFC sample and mixed round-control profile keep it below the completed mythic peaks.'),
    'Kamaru Usman': c(4.50, 'Tyron Woodley 2019 through Jorge Masvidal II 2021', 1.25, 1.25, 1.00, 0.75, 0.25, 'Strong welterweight title apex with Woodley/Covington/Masvidal proof and real control. Later Edwards finish and less mythic aura keep him below GSP-style apex.'),
    'Daniel Cormier': c(4.25, 'Anthony Johnson 2015 through Stipe Miocic I 2018', 1.00, 1.25, 0.75, 0.75, 0.50, 'Double-champ apex and elite LHW/HW proof. Jones rivalry caps best-alive claim and separation versus the absolute apex tier.'),
    'Charles Oliveira': c(4.00, 'Michael Chandler 2021 through Justin Gaethje 2022', 0.75, 1.25, 0.75, 1.00, 0.25, 'Modern lightweight apex with Chandler/Poirier/Gaethje proof and real finishing danger. Chaotic vulnerability keeps the aura/separation below cleaner peak cases.'),
    'Israel Adesanya': c(4.00, 'Robert Whittaker 2019 through Paulo Costa 2020', 1.00, 1.00, 1.00, 0.50, 0.50, 'Elite middleweight apex with Whittaker/Costa proof and clean striking separation. Middleweight depth and later matchup cracks keep it below the highest apex tier.'),
    'Henry Cejudo': c(4.00, 'Demetrious Johnson II 2018 through Dominick Cruz 2020', 1.00, 1.25, 0.75, 0.75, 0.25, 'Champ-champ apex with DJ, Dillashaw, Moraes, and Cruz title proof. Compact run and less clean dominance keep it from the mythic tier.'),
    'Stipe Miocic': c(3.75, 'Fabricio Werdum 2016 through Francis Ngannou I 2018', 0.75, 1.25, 0.75, 0.50, 0.50, 'Heavyweight apex with Werdum, Overeem, JDS, and Ngannou proof. Heavyweight volatility and later DC/Ngannou context keep the bonus moderate.'),
    'Matt Hughes': c(3.75, 'Carlos Newton II 2002 through Frank Trigg II 2005', 1.00, 1.00, 1.00, 0.25, 0.50, 'Old-era welterweight apex with real dominance and title control. Era/depth limits keep it below modern deep-division apex cases.'),
    'Dominick Cruz': c(3.25, 'Takeya Mizugaki 2014 through T.J. Dillashaw 2016', 0.75, 0.75, 0.75, 0.50, 0.50, 'UFC-only Cruz apex is the comeback/technical control version, not the full WEC-inclusive peak. Strong but capped by UFC-only volume and finish profile.'),
    'Ilia Topuria': c(5.00, 'Alexander Volkanovski 2024 through current lightweight title window', 1.25, 1.25, 1.25, 0.75, 0.50, 'Current-table monster apex: Volkanovski plus title-level lightweight proof creates a huge best-night case. Short sample keeps him below the completed mythic peaks for now.'),
    'Francis Ngannou': c(4.75, 'Jairzinho Rozenstruik 2020 through Ciryl Gane 2022', 1.25, 1.00, 1.25, 0.50, 0.75, 'Terrifying heavyweight apex with unmatched one-shot danger, improved title-fight proof, and a true no-answer aura at his best. Heavyweight volatility keeps him just below the mythic completed peaks.'),
    'Cain Velasquez': c(4.00, 'Brock Lesnar 2010 through Junior dos Santos III 2013', 1.00, 1.25, 1.00, 0.50, 0.25, 'High-level heavyweight apex with pace, pressure, and elite title proof. Injuries, heavyweight volatility, and limited clean longevity cap the aura score.'),
    'T.J. Dillashaw': c(4.00, 'Renan Barao 2014 through Cody Garbrandt II 2018', 1.00, 1.00, 1.25, 0.50, 0.25, 'Barao/Garbrandt apex was technically brilliant and violent. EPO context and later shoulder/injury end keep the clean-aura score low.'),
    'Petr Yan': c(3.75, 'Jose Aldo 2020 through Aljamain Sterling I 2021', 0.75, 1.00, 0.75, 0.75, 0.50, 'High-skill bantamweight apex with elite technical separation. Sterling rivalry and narrow later losses keep him from a higher best-alive score.'),
    'Aljamain Sterling': c(3.75, 'Petr Yan II 2022 through Henry Cejudo 2023', 0.75, 1.25, 0.50, 0.75, 0.50, 'Modern bantamweight title apex with Yan/Cejudo proof. Style, DQ/title context, and narrow scorecards limit separation but not opponent proof.'),
    'Dustin Poirier': c(3.50, 'Justin Gaethje 2018 through Conor McGregor II 2021', 0.50, 1.25, 0.50, 1.00, 0.25, 'Excellent lightweight apex résumé with Gaethje, Holloway, and McGregor proof. Title-fight losses and chaotic damage profile keep the best-alive/aura score modest.'),
    'B.J. Penn': c(3.50, 'Joe Stevenson 2008 through Diego Sanchez 2009', 1.00, 0.75, 0.75, 0.50, 0.50, 'UFC lightweight apex had real aura and dominance, but UFC-only opponent proof and the GSP welterweight ceiling keep it below the deepest modern peaks.'),
    'Chuck Liddell': c(3.50, 'Randy Couture II 2005 through Tito Ortiz II 2006', 0.75, 1.00, 0.75, 0.50, 0.50, 'Star-era light heavyweight apex with major title proof and knockout aura. Era/depth and later durability collapse cap the bonus.'),
    'Justin Gaethje': c(3.25, 'Tony Ferguson 2020 through Dustin Poirier II 2023', 0.50, 1.00, 0.50, 1.00, 0.25, 'Violent lightweight apex with Ferguson and Poirier proof in a brutal division. Khabib/Oliveira/Topuria title-level losses keep best-alive and aura scores limited.'),
    'Frankie Edgar': c(3.25, 'B.J. Penn 2010 through Gray Maynard III 2011', 0.75, 1.00, 0.50, 0.50, 0.50, 'Lightweight title apex with Penn/Maynard proof and great resilience. Close fights and limited one-night separation keep the apex moderate.'),
    'Dan Henderson': c(2.50, 'Michael Bisping 2009 through Mauricio Rua 2011', 0.25, 0.75, 0.75, 0.50, 0.25, 'UFC-only apex is built around violent signature moments, not a clean best-fighter-alive case. Pride/Strikeforce context remains outside the main scoring.'),
    'Amanda Nunes': c(5.25, 'Ronda Rousey 2016 through Cris Cyborg 2018', 1.25, 1.50, 1.25, 0.50, 0.75, 'Women’s UFC apex benchmark: Rousey, Shevchenko, and Cyborg-level proof with violent separation. Division depth keeps the bonus just below the mythic men’s deepest-division peaks.'),
    'Valentina Shevchenko': c(4.50, 'Joanna Jedrzejczyk 2018 through Jessica Andrade 2021', 1.25, 1.00, 1.25, 0.25, 0.75, 'Elite flyweight apex with long stretch dominance and real no-answer aura. Women’s flyweight depth limits the division-strength component.'),
    'Joanna Jedrzejczyk': c(4.00, 'Carla Esparza 2015 through Jessica Andrade 2017', 1.00, 1.00, 1.25, 0.50, 0.25, 'Strawweight striking apex with major separation and title-control proof. Lower finishing threat and later Rose/Zhang context cap the clean-aura score.'),
    'Ronda Rousey': c(4.75, 'Miesha Tate II 2013 through Cat Zingano 2015', 1.50, 0.75, 1.25, 0.50, 0.75, 'Historic women’s bantamweight aura apex with unmatched speed-of-finish separation and a true best-alive claim for the women’s UFC field. Early division depth still caps elite-opponent proof.'),
    'Merab Dvalishvili': c(4.00, 'Petr Yan 2023 through current bantamweight title window', 0.75, 1.25, 0.75, 0.75, 0.50, 'Modern bantamweight pressure apex with elite opponent proof. Division strength is strong but not maxed, and limited finishing threat keeps separation below the violent apex cases.')
  };

  function round2(value){
    return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  }
  function sumComponents(components){
    return round2(Object.values(components || {}).reduce((sum,value) => sum + Number(value || 0), 0));
  }
  function patchRow(row){
    if(!row || !corrections[row.fighter]) return;
    const fighterCorrection = corrections[row.fighter];
    const componentTotal = sumComponents(fighterCorrection.components);
    row.apexPeak = round2(fighterCorrection.apexPeak);
    row.apexPeakAudit = {
      score: row.apexPeak,
      window: fighterCorrection.window,
      components: fighterCorrection.components,
      componentTotal,
      notes: fighterCorrection.notes,
      rubric: RUBRIC,
      source: 'Apex Peak Batches 1-4 rubric',
      version: VERSION
    };
  }

  [...(DATA.men || []), ...(DATA.women || []), ...(DATA.fighters || [])].forEach(patchRow);

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    Object.entries(corrections).forEach(([fighter,fighterCorrection]) => {
      if(!DISPLAY_OVERRIDES[fighter]) return;
      DISPLAY_OVERRIDES[fighter].apexPeakAudit = {
        score: fighterCorrection.apexPeak,
        window: fighterCorrection.window,
        components: fighterCorrection.components,
        notes: fighterCorrection.notes,
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
