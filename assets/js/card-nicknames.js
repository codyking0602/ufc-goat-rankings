// Profile-card display nicknames for fighters who are clearly known by one.
// Keeps list/board rows clean and keeps data keys unchanged. Does not touch resume-tag pills.
(function(){
  const VERSION = 'card-nicknames-20260707c-merab-yan-loader';
  if(typeof DISPLAY_OVERRIDES === 'undefined') return;

  const DISPLAY_NAMES = {
    'Dricus du Plessis': 'Dricus “Stillknocks” du Plessis',
    'Tyron Woodley': 'Tyron “The Chosen One” Woodley',
    'Sean Strickland': 'Sean “Tarzan” Strickland',
    'Robert Whittaker': 'Robert “The Reaper” Whittaker',
    "Sean O'Malley": '“Sugar” Sean O’Malley',
    'Lyoto Machida': 'Lyoto “The Dragon” Machida',
    'Khamzat Chimaev': 'Khamzat “Borz” Chimaev',
    'Deiveson Figueiredo': 'Deiveson “Deus da Guerra” Figueiredo',
    'Tito Ortiz': 'Tito “The Huntington Beach Bad Boy” Ortiz',
    'Junior dos Santos': 'Junior “Cigano” dos Santos',
    'Michael Bisping': 'Michael “The Count” Bisping',
    'Tony Ferguson': 'Tony “El Cucuy” Ferguson',
    'Brock Lesnar': 'Brock “The Beast Incarnate” Lesnar',
    'Chael Sonnen': 'Chael “The American Gangster” Sonnen',
    'Robbie Lawler': 'Robbie “Ruthless” Lawler',
    'Zhang Weili': 'Zhang “Magnum” Weili',
    'Rose Namajunas': '“Thug” Rose Namajunas',
    'Miesha Tate': 'Miesha “Cupcake” Tate'
  };

  const RESUME_TAG_RESTORE = {
    'Dricus du Plessis': 'Two-division title threat',
    'Tyron Woodley': 'Welterweight title enforcer',
    'Sean Strickland': 'Awkward title spoiler',
    'Robert Whittaker': 'Middleweight elite mainstay',
    "Sean O'Malley": 'Bantamweight star champion',
    'Lyoto Machida': 'Karate-era LHW champion',
    'Khamzat Chimaev': 'Explosive short-window title case',
    'Deiveson Figueiredo': 'Flyweight chaos champion',
    'Tito Ortiz': 'Early UFC title-reign anchor',
    'Junior dos Santos': 'Heavyweight win-streak destroyer',
    'Michael Bisping': 'Middleweight title shocker',
    'Tony Ferguson': 'Uncrowned lightweight terror',
    'Brock Lesnar': 'Short-window heavyweight champ',
    'Chael Sonnen': 'Middleweight title agitator',
    'Robbie Lawler': 'Ruthless title-war champion',
    'Zhang Weili': 'Two-reign strawweight force',
    'Rose Namajunas': 'Two-reign strawweight giant killer',
    'Miesha Tate': 'Bantamweight title comeback'
  };

  Object.entries(DISPLAY_NAMES).forEach(([fighter, displayName]) => {
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter].displayName = displayName;
    if(RESUME_TAG_RESTORE[fighter]) DISPLAY_OVERRIDES[fighter].resumeTag = RESUME_TAG_RESTORE[fighter];
  });

  function applyProfileDisplayName(){
    const detail = document.getElementById('fighterDetail');
    if(!detail) return;
    const h2 = detail.querySelector('.profile-summary h2');
    if(!h2) return;
    const baseName = Object.keys(DISPLAY_NAMES).find(name => h2.textContent.trim() === name || h2.textContent.trim() === DISPLAY_NAMES[name]);
    if(baseName) h2.textContent = DISPLAY_NAMES[baseName];
  }

  const originalOpenFighter = window.openFighter;
  if(typeof originalOpenFighter === 'function' && !originalOpenFighter.__profileDisplayNameWrapped){
    const wrappedOpenFighter = function(name){
      const result = originalOpenFighter.apply(this, arguments);
      applyProfileDisplayName();
      return result;
    };
    wrappedOpenFighter.__profileDisplayNameWrapped = true;
    window.openFighter = wrappedOpenFighter;
    try { openFighter = wrappedOpenFighter; } catch(e) {}
  }

  applyProfileDisplayName();

  window.UFC_CARD_NICKNAMES = {
    version: VERSION,
    fighters: Object.keys(DISPLAY_NAMES),
    displayNames: DISPLAY_NAMES,
    scope: 'profile-display-name-only'
  };
})();

(function(){
  function loadOnce(src, attr){
    if(document.querySelector(`script[${attr}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute(attr,'true');
    document.body.appendChild(script);
  }
  loadOnce('assets/data/final-batch-scores.js?v=final-batch-scores-20260707a','data-final-batch-scores-loader');
  loadOnce('assets/data/merab-yan-loss-context.js?v=merab-yan-loss-context-20260707a','data-merab-yan-loss-context-loader');
})();
