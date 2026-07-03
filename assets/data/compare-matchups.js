// Compare matchup frames
// Only true marquee/direct-rivalry framing belongs here.
// Fighter personality stays in fighter packets. The narrative engine decides matchup type from scores.
(function(){
  const VERSION = 'compare-matchups-20260703a';

  const frames = {
    'kamaru usman|max holloway': 'Better champion peak: Kamaru Usman. Better total resume: Max Holloway, barely.',
    'islam makhachev|khabib nurmagomedov': 'Cleaner peak: Khabib Nurmagomedov. Bigger title resume: Islam Makhachev.',
    'alexander volkanovski|max holloway': 'Longer volume resume: Max Holloway. Shared-era featherweight answer: Alexander Volkanovski.',
    'francis ngannou|stipe miocic': 'Scarier best version: Francis Ngannou. Bigger heavyweight resume: Stipe Miocic.',
    'georges st-pierre|jon jones': 'Cleanest challenger profile: Georges St-Pierre. Highest benchmark profile: Jon Jones.',
    'anderson silva|demetrious johnson': 'Peak aura and finishing mythology: Anderson Silva. Cleaner title structure: Demetrious Johnson.',
    'dominick cruz|jose aldo': 'Style and comeback angle: Dominick Cruz. Deeper UFC-only volume: Jose Aldo.',
    'daniel cormier|stipe miocic': 'Two-division value: Daniel Cormier. Heavyweight trilogy and heavyweight resume: Stipe Miocic.',
    'alex pereira|israel adesanya': 'Explosive two-division impact: Alex Pereira. Longer middleweight reign: Israel Adesanya.',
    'amanda nunes|valentina shevchenko': 'Technical flyweight standard: Valentina Shevchenko. Women\'s two-division GOAT resume: Amanda Nunes.'
  };

  const swings = {
    'kamaru usman|max holloway': 'So if the question is better champion peak, it is probably Usman. If the question is better overall resume, Holloway gets it by a thin margin.',
    'islam makhachev|khabib nurmagomedov': 'So if the question is cleanest peak, Khabib still has the answer. If the question is the larger title resume, Islam has passed him.',
    'alexander volkanovski|max holloway': 'So if the question is long-term volume, Max has a real answer. If the question is shared-era featherweight separation, the trilogy makes Volk the pick.',
    'francis ngannou|stipe miocic': 'The split series keeps this honest. Ngannou took the rematch, but Stipe still owns the broader heavyweight resume.'
  };

  const finals = {
    'kamaru usman|max holloway': 'Max Holloway, barely. Usman wins the champion-peak debate, but Holloway\'s quality-win depth and staying power give him the stronger full resume.',
    'islam makhachev|khabib nurmagomedov': 'Islam Makhachev, narrowly. Khabib owns the cleaner peak, but Islam\'s title work and high-end lightweight wins give him the larger resume.',
    'alexander volkanovski|max holloway': 'Alexander Volkanovski wins. Max has the longer volume resume, but Volk\'s trilogy edge and championship separation make the shared-era answer cleaner.',
    'francis ngannou|stipe miocic': 'Stipe Miocic wins. Ngannou has the scarier peak, but the split series pushes the call back to Stipe\'s deeper heavyweight resume.'
  };

  const verdicts = {
    'francis ngannou|stipe miocic': 'Stipe Miocic wins, but the direct series keeps it uncomfortable.',
    'islam makhachev|khabib nurmagomedov': 'Islam Makhachev edges it, but Khabib Nurmagomedov keeps it uncomfortable.',
    'alexander volkanovski|max holloway': 'Alexander Volkanovski gets the edge, and this one comes with real direct-fight history.',
    'kamaru usman|max holloway': 'Max Holloway wins by a hair, but Kamaru Usman makes it uncomfortable.'
  };

  function key(a,b){
    return [String(a || '').toLowerCase(), String(b || '').toLowerCase()].sort().join('|');
  }

  function get(section, a, b){
    return (section || {})[key(a,b)] || null;
  }

  window.UFC_COMPARE_MATCHUPS = {
    version: VERSION,
    frames,
    swings,
    finals,
    verdicts,
    key,
    frameFor: (a,b) => get(frames,a,b),
    swingFor: (a,b) => get(swings,a,b),
    finalFor: (a,b) => get(finals,a,b),
    verdictFor: (a,b) => get(verdicts,a,b)
  };
})();