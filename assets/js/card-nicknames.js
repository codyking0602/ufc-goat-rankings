// Card-facing nicknames for fighters who are clearly known by one.
// Runs after fighter packets so packet resume labels do not overwrite the visible list/card pill.
// This file should not mutate the profile hero or attach observers.
(function(){
  const VERSION = 'card-nicknames-20260706c-card-only';
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

  // Clean up any profile-hero nickname pill left from the previous overpatch.
  document.querySelectorAll('.profile-pill.nickname-pill').forEach(el => el.remove());

  window.UFC_CARD_NICKNAMES = {
    version: VERSION,
    fighters: Object.keys(CARD_NICKNAMES),
    nicknames: CARD_NICKNAMES,
    scope: 'card-only'
  };
})();
