// App-facing category label polish.
// Keeps the underlying category key as `championship` but shows the clearer label users see.
(function(){
  const VERSION = 'championship-label-polish-20260707b-current-loss-ledgers';
  const FROM = 'Title Reign';
  const TO = 'Championship Resume';
  const DESC_FROM = 'Championship resume: title-fight wins, reign strength, and control of the division';
  const DESC_TO = 'Championship resume: UFC title-fight wins, adjusted title credit, and second-division title value';

  function replaceTextNode(node){
    if(!node || node.nodeType !== Node.TEXT_NODE) return;
    if(node.nodeValue.includes(FROM)) node.nodeValue = node.nodeValue.replaceAll(FROM, TO);
    if(node.nodeValue.includes(DESC_FROM)) node.nodeValue = node.nodeValue.replaceAll(DESC_FROM, DESC_TO);
  }

  function polishAttributes(el){
    ['aria-label','title'].forEach(attr => {
      const val = el.getAttribute?.(attr);
      if(!val) return;
      let next = val.replaceAll(FROM, TO).replaceAll(DESC_FROM, DESC_TO);
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

  function apply(){ walk(document.body); }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();

  const observer = new MutationObserver(mutations => {
    for(const mutation of mutations){
      mutation.addedNodes.forEach(walk);
      if(mutation.type === 'characterData') replaceTextNode(mutation.target);
    }
  });
  observer.observe(document.documentElement, { childList:true, subtree:true, characterData:true });

  window.UFC_CHAMPIONSHIP_LABEL_POLISH = { version: VERSION, from: FROM, to: TO, appliedAt: new Date().toISOString() };
})();

// Current-result loss ledgers loaded here because this module runs before scoring-engine.
(function(){
  const VERSION = 'loss-context-ledgers-v2-20260707a-current-results';
  const LEDGERS = {
    'Ilia Topuria': [
      { opponent:'Justin Gaethje', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:'normal', counted:true, notes:'Recent lightweight title loss; prime same-division elite finish.' }
    ],
    'Khamzat Chimaev': [
      { opponent:'Sean Strickland', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:'none', counted:true, notes:'Recent middleweight title loss; prime elite decision.' }
    ],
    'Dricus du Plessis': [
      { opponent:'Khamzat Chimaev', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:'none', counted:true, notes:'Middleweight title loss; prime elite decision.' }
    ],
    'Kayla Harrison': []
  };
  function applyLedgers(){
    const rows = Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : [];
    const applied = [];
    rows.forEach(f => {
      if(!f?.fighter) return;
      if(Object.prototype.hasOwnProperty.call(LEDGERS, f.fighter)){
        f.losses = LEDGERS[f.fighter].map(row => ({...row}));
        f.lossContextLedgerVersion = VERSION;
        if(f.fighter === 'Kayla Harrison') f.lossContextNoLosses = true;
        applied.push(f.fighter);
      }
    });
    window.UFC_LOSS_CONTEXT_LEDGERS_V2 = { version: VERSION, applied, ledgers: LEDGERS };
    document.documentElement.setAttribute('data-loss-context-ledgers-v2', VERSION);
  }
  applyLedgers();
})();
