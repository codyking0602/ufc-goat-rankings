// Card/profile-facing nicknames for fighters who are clearly known by one.
// Runs after fighter packets so packet resume labels do not overwrite the visible card pill.
(function(){
  const VERSION = 'card-nicknames-20260706b-profile-hero';
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

  function applyOverrides(){
    Object.entries(CARD_NICKNAMES).forEach(([fighter, nickname]) => {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].nickname = nickname;
      DISPLAY_OVERRIDES[fighter].resumeTag = `“${nickname}”`;
    });
    window.UFC_CARD_NICKNAMES = { version: VERSION, fighters: Object.keys(CARD_NICKNAMES), nicknames: CARD_NICKNAMES };
  }

  function applyProfileHeroNickname(){
    const detail = document.getElementById('fighterDetail');
    if(!detail) return;
    const name = detail.querySelector('.profile-summary h2')?.textContent?.trim();
    const nickname = name ? CARD_NICKNAMES[name] : '';
    const topline = detail.querySelector('.profile-topline');
    if(!topline || !nickname) return;
    const existing = topline.querySelector('.profile-pill.nickname-pill');
    if(existing){
      existing.textContent = `“${nickname}”`;
      return;
    }
    const pill = document.createElement('span');
    pill.className = 'profile-pill nickname-pill';
    pill.textContent = `“${nickname}”`;
    topline.appendChild(pill);
  }

  function apply(){
    applyOverrides();
    applyProfileHeroNickname();
  }

  apply();
  if(typeof refresh === 'function' && !apply.__refreshing){
    apply.__refreshing = true;
    try{ refresh(); }catch(e){}
    apply.__refreshing = false;
  }

  const observer = new MutationObserver(applyProfileHeroNickname);
  observer.observe(document.body, { childList: true, subtree: true });
})();
