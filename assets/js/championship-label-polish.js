// App-facing category label and shared fighter-profile polish.
// Keeps the underlying category key as `championship` while hardening the public profile shell.
(function(){
  const VERSION = 'championship-label-polish-20260711b-profile-edge-qa';
  const FROM = 'Title Reign';
  const TO = 'Championship Resume';
  const DESC_FROM = 'Championship resume: title-fight wins, reign strength, and control of the division';
  const DESC_TO = 'Championship resume: UFC title-fight wins, adjusted title credit, and second-division title value';
  const REPRESENTATIVE_FIGHTERS = [
    'Jon Jones',
    'Tyron Woodley',
    'Khabib Nurmagomedov',
    'Jose Aldo',
    'Zhang Weili',
    'Chael Sonnen',
    'Demetrious Johnson',
    'Israel Adesanya'
  ];

  function replaceTextNode(node){
    if(!node || node.nodeType !== Node.TEXT_NODE) return;
    if(node.nodeValue.includes(FROM)) node.nodeValue = node.nodeValue.replaceAll(FROM, TO);
    if(node.nodeValue.includes(DESC_FROM)) node.nodeValue = node.nodeValue.replaceAll(DESC_FROM, DESC_TO);
  }

  function polishAttributes(el){
    ['aria-label','title'].forEach(attr => {
      const val = el.getAttribute?.(attr);
      if(!val) return;
      const next = val.replaceAll(FROM, TO).replaceAll(DESC_FROM, DESC_TO);
      if(next !== val) el.setAttribute(attr, next);
    });
  }

  function walk(root){
    if(!root) return;
    if(root.nodeType === Node.TEXT_NODE){ replaceTextNode(root); return; }
    if(root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if(root.nodeType === Node.ELEMENT_NODE) polishAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node;
    while((node = walker.nextNode())){
      if(node.nodeType === Node.TEXT_NODE) replaceTextNode(node);
      else if(node.nodeType === Node.ELEMENT_NODE) polishAttributes(node);
    }
  }

  function installProfileCss(){
    if(document.getElementById('ufc-profile-edge-case-css')) return;
    const style = document.createElement('style');
    style.id = 'ufc-profile-edge-case-css';
    style.textContent = `
      .profile-summary h2{overflow-wrap:anywhere;word-break:normal;text-wrap:balance}
      .snapshot-item{min-width:0}
      .category-card{display:flex;flex-direction:column;min-width:0}
      .category-card .category-label{min-height:2.35em}
      .category-card .tier-pill{align-self:flex-start}
      .category-card .category-bar{width:100%;margin-top:auto}
      .close{width:44px;height:44px;display:grid;place-items:center;line-height:1;border:1px solid var(--line);border-radius:999px;background:rgba(15,20,32,.92);position:sticky;top:8px;z-index:12}
      @media(max-width:900px){
        .profile-summary h2{font-size:clamp(28px,8.5vw,34px);line-height:1}
        .category-card{min-height:176px}
        .category-card .category-label{min-height:2.4em}
      }
    `;
    document.head.appendChild(style);
  }

  function polishProfileUi(){
    const close = document.getElementById('closeDrawer');
    if(close){
      close.setAttribute('aria-label','Close fighter profile');
      close.setAttribute('title','Close fighter profile');
    }
    const explanation = document.getElementById('categoryExplanation');
    if(explanation){
      explanation.setAttribute('role','region');
      explanation.setAttribute('aria-live','polite');
      explanation.setAttribute('aria-label','Category breakdown');
    }
    document.querySelectorAll('#fighterDetail .category-card').forEach(card => {
      if(!card.hasAttribute('aria-expanded')) card.setAttribute('aria-expanded','false');
    });
  }

  function apply(){
    installProfileCss();
    walk(document.body);
    polishProfileUi();
  }

  function findFighter(name){
    const data = window.RANKING_DATA || {};
    const profile = (data.fighters || []).find(row => row?.fighter === name) || {};
    const board = (data.men || []).find(row => row?.fighter === name) || (data.women || []).find(row => row?.fighter === name) || {};
    return { ...profile, ...board, fighter:name };
  }

  function auditFighter(name){
    const row = findFighter(name);
    const override = window.DISPLAY_OVERRIDES?.[name] || {};
    const issues = [];
    if(!row.rank && !override.allTimeRank) issues.push('missing rank');
    if(typeof window.overallOvr === 'function' && !Number.isFinite(Number(window.overallOvr(row)))) issues.push('invalid OVR');
    if(!override.oneLiner) issues.push('missing hero summary');
    if(!override.whyRankedHere) issues.push('missing why-ranked copy');
    if(name === 'Jon Jones'){
      if(!override.whyNotLower) issues.push('missing why-not-lower copy');
    }else if(!override.whyNotHigher){
      issues.push('missing why-not-higher copy');
    }
    if(!override.photoUrl) issues.push('missing profile photo path');
    if(typeof window.categoryOvr === 'function'){
      ['championship','opponentQuality','primeDominance','longevity','penalty'].forEach(key => {
        if(!Number.isFinite(Number(window.categoryOvr(row,key)))) issues.push(`invalid ${key} rating`);
      });
    }
    return { fighter:name, passed:issues.length === 0, issues };
  }

  function runRepresentativeAudit(){
    const results = REPRESENTATIVE_FIGHTERS.map(auditFighter);
    const state = {
      version: VERSION,
      fighters: REPRESENTATIVE_FIGHTERS,
      results,
      passed: results.every(result => result.passed),
      mutatesScores: false,
      checkedAt: new Date().toISOString()
    };
    window.UFC_PROFILE_REPRESENTATIVE_QA = state;
    return state;
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();

  document.addEventListener('click', event => {
    const card = event.target.closest?.('#fighterDetail .category-card');
    if(!card) return;
    document.querySelectorAll('#fighterDetail .category-card').forEach(item => item.setAttribute('aria-expanded', item === card ? 'true' : 'false'));
  });

  const observer = new MutationObserver(mutations => {
    for(const mutation of mutations){
      mutation.addedNodes.forEach(walk);
      if(mutation.type === 'characterData') replaceTextNode(mutation.target);
    }
    polishProfileUi();
  });
  observer.observe(document.documentElement, { childList:true, subtree:true, characterData:true });

  setTimeout(runRepresentativeAudit, 0);
  window.UFC_CHAMPIONSHIP_LABEL_POLISH = {
    version: VERSION,
    from: FROM,
    to: TO,
    representativeFighters: REPRESENTATIVE_FIGHTERS,
    runRepresentativeAudit,
    appliedAt: new Date().toISOString()
  };
})();
