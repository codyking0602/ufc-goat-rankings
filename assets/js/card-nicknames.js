// Profile-card display nicknames for fighters who are clearly known by one.
// Keeps list/board rows clean and keeps data keys unchanged. Does not touch resume-tag pills.
(function(){
  'use strict';

  const VERSION = 'card-nicknames-20260716c-shogun-profile-link';
  if(typeof DISPLAY_OVERRIDES === 'undefined') return;

  const SHOGUN_DISPLAY = 'Mauricio “Shogun” Rua';
  const SHOGUN_ALIASES = [
    'Mauricio "Shogun" Rua',
    'Maurício "Shogun" Rua',
    'Mauricio Rua',
    'Maurício Rua'
  ];
  const SHOGUN_LINKS = {
    signatureFightUrl:'https://youtu.be/08YmP1EM2ms?is=gQIDS9i91zPsk3kX',
    signatureFightLabel:'Watch Signature Fight',
    watchUrl:'https://youtube.com/shorts/F6K-CKBntck?is=heruCDLgIBMrWtQc',
    watchLabel:'Watch Moment'
  };

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
    'Alexandre Pantoja': 'Alexandre “The Cannibal” Pantoja',
    'Chris Weidman': 'Chris “The All-American” Weidman',
    'Mauricio "Shogun" Rua': SHOGUN_DISPLAY,
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

  function normalizeName(value){
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[“”"'’‘`´]/g,' ')
      .replace(/\bshogun\b/gi,' ')
      .replace(/[^a-z0-9]+/gi,' ')
      .replace(/\s+/g,' ')
      .trim()
      .toLowerCase();
  }

  function isShogunName(value){
    const normalized = normalizeName(value);
    return normalized === 'mauricio' || normalized === 'mauricio rua';
  }

  function rosterNames(){
    const data = window.RANKING_DATA || {};
    return [...(data.men || []), ...(data.women || []), ...(data.fighters || [])]
      .map(row => row?.fighter)
      .filter(Boolean);
  }

  function canonicalShogunName(){
    return rosterNames().find(isShogunName) || SHOGUN_ALIASES[0];
  }

  function syncShogunOverrides(){
    const canonical = canonicalShogunName();
    const names = Array.from(new Set([...SHOGUN_ALIASES, canonical]));
    names.forEach(name => {
      const override = DISPLAY_OVERRIDES[name] = DISPLAY_OVERRIDES[name] || {};
      override.displayName = SHOGUN_DISPLAY;
      override.profileDisplayName = SHOGUN_DISPLAY;
      Object.assign(override, SHOGUN_LINKS);
    });
    return canonical;
  }

  Object.entries(DISPLAY_NAMES).forEach(([fighter, displayName]) => {
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter].displayName = displayName;
    DISPLAY_OVERRIDES[fighter].profileDisplayName = displayName;
    if(RESUME_TAG_RESTORE[fighter]) DISPLAY_OVERRIDES[fighter].resumeTag = RESUME_TAG_RESTORE[fighter];
  });

  function applyProfileDisplayName(){
    const detail = document.getElementById('fighterDetail');
    if(!detail) return;
    const h2 = detail.querySelector('.profile-summary h2');
    if(!h2) return;
    if(isShogunName(h2.textContent)){
      if(h2.textContent !== SHOGUN_DISPLAY) h2.textContent = SHOGUN_DISPLAY;
      return;
    }
    const baseName = Object.keys(DISPLAY_NAMES).find(name => h2.textContent.trim() === name || h2.textContent.trim() === DISPLAY_NAMES[name]);
    if(baseName && h2.textContent !== DISPLAY_NAMES[baseName]) h2.textContent = DISPLAY_NAMES[baseName];
  }

  function repairShogunRows(){
    const canonical = canonicalShogunName();
    document.querySelectorAll('[data-fighter]').forEach(node => {
      const visibleName = node.querySelector?.('.name')?.textContent
        || node.querySelector?.('td:nth-child(2)')?.textContent
        || node.getAttribute('data-fighter')
        || '';
      if(!isShogunName(visibleName) && !isShogunName(node.getAttribute('data-fighter'))) return;
      if(node.dataset.fighter !== canonical) node.dataset.fighter = canonical;
    });
  }

  function installOpenFighterWrapper(){
    const originalOpenFighter = window.openFighter;
    if(typeof originalOpenFighter !== 'function' || originalOpenFighter.__shogunProfileWrapped) return;
    const wrappedOpenFighter = function(name){
      const args = Array.from(arguments);
      if(isShogunName(name)) args[0] = canonicalShogunName();
      const result = originalOpenFighter.apply(this, args);
      syncShogunOverrides();
      applyProfileDisplayName();
      repairShogunRows();
      return result;
    };
    wrappedOpenFighter.__shogunProfileWrapped = true;
    wrappedOpenFighter.__profileDisplayNameWrapped = true;
    window.openFighter = wrappedOpenFighter;
    try { openFighter = wrappedOpenFighter; } catch(e) {}
  }

  function apply(){
    syncShogunOverrides();
    repairShogunRows();
    installOpenFighterWrapper();
    applyProfileDisplayName();
  }

  let queued = false;
  function queueApply(){
    if(queued) return;
    queued = true;
    Promise.resolve().then(() => {
      queued = false;
      apply();
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();

  ['ufc-ranking-data-patches-ready','ufc-scoring-pipeline-ready','ufc-production-ranking-ready'].forEach(eventName => {
    window.addEventListener(eventName, () => window.setTimeout(apply, 0));
  });
  [100,500,1500,3500].forEach(delay => window.setTimeout(apply, delay));

  const observer = new MutationObserver(queueApply);
  if(document.body) observer.observe(document.body, {childList:true, subtree:true});
  else document.addEventListener('DOMContentLoaded', () => observer.observe(document.body, {childList:true, subtree:true}), {once:true});

  window.UFC_CARD_NICKNAMES = {
    version: VERSION,
    fighters: Object.keys(DISPLAY_NAMES),
    displayNames: DISPLAY_NAMES,
    shogunAliases: SHOGUN_ALIASES,
    shogunLinks: SHOGUN_LINKS,
    scope: 'profile-display-name-only-with-shogun-key-compatibility'
  };
})();