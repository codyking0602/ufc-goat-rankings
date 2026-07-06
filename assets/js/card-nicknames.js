// Card-facing nicknames for fighters who are clearly known by one.
// Data-only override: no DOM mutation, no observers, no refresh calls.
(function(){
  const VERSION = 'card-nicknames-20260706d-data-only';
  if(typeof DISPLAY_OVERRIDES === 'undefined') return;

  const CARD_NICKNAMES = {
    'Dricus du Plessis': 'Stillknocks',
    'Tyron Woodley': 'The Chosen One',
    'Sean Strickland': 'Tarzan',
    'Robert Whittaker': 'The Reaper',
    "Sean O'Malley": 'Sugar',
    'Lyoto Machida': 'The Dragon',
    'Khamzat Chimaev': 'Borz',
    'Deiveson Figueiredo': 'Deus da Guerra',
    'Tito Ortiz': 'The Huntington Beach Bad Boy',
    'Junior dos Santos': 'Cigano',
    'Zhang Weili': 'Magnum'
  };

  Object.entries(CARD_NICKNAMES).forEach(([fighter, nickname]) => {
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter].nickname = nickname;
    DISPLAY_OVERRIDES[fighter].resumeTag = `“${nickname}”`;
  });

  window.UFC_CARD_NICKNAMES = {
    version: VERSION,
    fighters: Object.keys(CARD_NICKNAMES),
    nicknames: CARD_NICKNAMES,
    scope: 'card-data-only'
  };
})();
