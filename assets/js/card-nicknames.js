// Card-facing nicknames for fighters who are clearly known by one.
// Leaves the resume-tag pill alone. Adds nickname as a separate row-card line only.
(function(){
  const VERSION = 'card-nicknames-20260706e-card-text';
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
  });

  function injectCss(){
    if(document.getElementById('card-nicknames-css')) return;
    const style = document.createElement('style');
    style.id = 'card-nicknames-css';
    style.textContent = `
      .card-nickname-line{margin-top:2px;color:#facc15;font-size:12px;font-weight:900;letter-spacing:.02em;line-height:1.15}
    `;
    document.head.appendChild(style);
  }

  function applyCardNicknameText(root){
    injectCss();
    const scope = root || document;
    scope.querySelectorAll('.fighter-row[data-fighter]').forEach(row => {
      const fighter = row.dataset.fighter;
      const nickname = CARD_NICKNAMES[fighter];
      if(!nickname) return;
      const main = row.querySelector('.row-main');
      const name = main?.querySelector('.name');
      if(!main || !name || main.querySelector('.card-nickname-line')) return;
      const line = document.createElement('div');
      line.className = 'card-nickname-line';
      line.textContent = `“${nickname}”`;
      name.insertAdjacentElement('afterend', line);
    });
  }

  const originalRenderList = window.renderList;
  if(typeof originalRenderList === 'function' && !originalRenderList.__nicknameWrapped){
    const wrappedRenderList = function(containerId, rows){
      const result = originalRenderList.apply(this, arguments);
      const container = document.getElementById(containerId);
      if(container) applyCardNicknameText(container);
      return result;
    };
    wrappedRenderList.__nicknameWrapped = true;
    window.renderList = wrappedRenderList;
    try { renderList = wrappedRenderList; } catch(e) {}
  }

  const originalRenderDivision = window.renderDivision;
  if(typeof originalRenderDivision === 'function' && !originalRenderDivision.__nicknameWrapped){
    const wrappedRenderDivision = function(){
      const result = originalRenderDivision.apply(this, arguments);
      const container = document.getElementById('divisionList');
      if(container) applyCardNicknameText(container);
      return result;
    };
    wrappedRenderDivision.__nicknameWrapped = true;
    window.renderDivision = wrappedRenderDivision;
    try { renderDivision = wrappedRenderDivision; } catch(e) {}
  }

  applyCardNicknameText(document);

  window.UFC_CARD_NICKNAMES = {
    version: VERSION,
    fighters: Object.keys(CARD_NICKNAMES),
    nicknames: CARD_NICKNAMES,
    scope: 'card-text-not-pill'
  };
})();
