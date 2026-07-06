// Display-name nicknames for fighters who are clearly known by one.
// Keeps data keys unchanged. Does not touch resume-tag pills.
(function(){
  const VERSION = 'card-nicknames-20260706f-display-name';
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
    'Zhang Weili': 'Zhang “Magnum” Weili'
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
    'Zhang Weili': 'Two-reign strawweight force'
  };

  Object.entries(DISPLAY_NAMES).forEach(([fighter, displayName]) => {
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter].displayName = displayName;
    if(RESUME_TAG_RESTORE[fighter]) DISPLAY_OVERRIDES[fighter].resumeTag = RESUME_TAG_RESTORE[fighter];
  });

  function displayNameFor(name){ return DISPLAY_NAMES[name] || name; }

  function applyRowDisplayNames(root){
    const scope = root || document;
    scope.querySelectorAll('.fighter-row[data-fighter]').forEach(row => {
      const fighter = row.dataset.fighter;
      const displayName = displayNameFor(fighter);
      const nameEl = row.querySelector('.row-main .name');
      if(nameEl && displayName !== fighter) nameEl.textContent = displayName;
      row.querySelectorAll('.card-nickname-line').forEach(el => el.remove());
    });
  }

  function applyProfileDisplayName(){
    const detail = document.getElementById('fighterDetail');
    if(!detail) return;
    const h2 = detail.querySelector('.profile-summary h2');
    if(!h2) return;
    const baseName = Object.keys(DISPLAY_NAMES).find(name => h2.textContent.trim() === name || h2.textContent.trim() === DISPLAY_NAMES[name]);
    if(baseName) h2.textContent = DISPLAY_NAMES[baseName];
  }

  const originalRenderList = window.renderList;
  if(typeof originalRenderList === 'function' && !originalRenderList.__displayNameWrapped){
    const wrappedRenderList = function(containerId, rows){
      const result = originalRenderList.apply(this, arguments);
      const container = document.getElementById(containerId);
      if(container) applyRowDisplayNames(container);
      return result;
    };
    wrappedRenderList.__displayNameWrapped = true;
    window.renderList = wrappedRenderList;
    try { renderList = wrappedRenderList; } catch(e) {}
  }

  const originalRenderDivision = window.renderDivision;
  if(typeof originalRenderDivision === 'function' && !originalRenderDivision.__displayNameWrapped){
    const wrappedRenderDivision = function(){
      const result = originalRenderDivision.apply(this, arguments);
      const container = document.getElementById('divisionList');
      if(container) applyRowDisplayNames(container);
      return result;
    };
    wrappedRenderDivision.__displayNameWrapped = true;
    window.renderDivision = wrappedRenderDivision;
    try { renderDivision = wrappedRenderDivision; } catch(e) {}
  }

  const originalOpenFighter = window.openFighter;
  if(typeof originalOpenFighter === 'function' && !originalOpenFighter.__displayNameWrapped){
    const wrappedOpenFighter = function(name){
      const result = originalOpenFighter.apply(this, arguments);
      applyProfileDisplayName();
      return result;
    };
    wrappedOpenFighter.__displayNameWrapped = true;
    window.openFighter = wrappedOpenFighter;
    try { openFighter = wrappedOpenFighter; } catch(e) {}
  }

  applyRowDisplayNames(document);
  applyProfileDisplayName();

  window.UFC_CARD_NICKNAMES = {
    version: VERSION,
    fighters: Object.keys(DISPLAY_NAMES),
    displayNames: DISPLAY_NAMES,
    scope: 'display-name-not-pill'
  };
})();
