(function(){
  'use strict';

  const VERSION='display-overrides-batch-one-20260717a';
  const ONE_LINERS={
    'Ben Askren':'Elite wrestling reputation, disastrous UFC sample, perfect category trap.',
    'Cody Garbrandt':'A brilliant championship peak wrapped inside a wildly unstable career.',
    'Anthony Johnson':'Terrifying knockout power with two title losses defining the ceiling.',
    'Lyoto Machida':'The elusive karate champion who briefly looked impossible to solve.',
    'Josh Koscheck':'A durable TUF-era wrestler who lived just below championship level.',
    'Gilbert Melendez':'A major UFC-only scope casualty whose best work happened before arrival.',
    'Rafael Fiziev':'Elite Muay Thai violence with renewed lightweight momentum and unfinished upside.',
    'Renato Moicano':'Submission craft, late-career growth, and personality across two divisions.',
    'Mackenzie Dern':'UFC strawweight champion and the roster’s clearest elite grappling specialist.',
    'Germaine de Randamie':'Championship-level kickboxing with an inactivity-limited résumé.',
    'Jessica Eye':'A real title challenger who adds honest lower-tier career and finishing traps.',
    'Bethe Correia':'Personality, recognition, and a title shot without elite résumé depth.'
  };

  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  Object.entries(ONE_LINERS).forEach(([name,oneLiner])=>{
    window.DISPLAY_OVERRIDES[name]={
      ...(window.DISPLAY_OVERRIDES[name]||{}),
      oneLiner,
      photoStatus:'pending-real-files'
    };
  });

  window.UFC_DISPLAY_OVERRIDES_BATCH_ONE={
    version:VERSION,
    fighters:Object.keys(ONE_LINERS),
    count:Object.keys(ONE_LINERS).length
  };
  document.documentElement.setAttribute('data-display-overrides-batch-one',VERSION);
})();
