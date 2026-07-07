// App-facing category label polish.
// Keeps the underlying category key as `championship` but shows the clearer label users see.
(function(){
  const VERSION = 'championship-label-polish-20260707c-current-loss-ledgers-batch3';
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

// Current-result and batch loss ledgers loaded here because this module runs before scoring-engine.
(function(){
  const VERSION = 'loss-context-ledgers-v3-20260707a-expanded-batch';
  const NORMAL = 'normal';
  const NONE = 'none';
  const REDUCED = 'reducedInjury';
  const LEDGERS = {
    'Ilia Topuria': [
      { opponent:'Justin Gaethje', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true, notes:'Recent lightweight title loss; prime same-division elite finish.' }
    ],
    'Khamzat Chimaev': [
      { opponent:'Sean Strickland', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true, notes:'Recent middleweight title loss; prime elite decision.' }
    ],
    'Dricus du Plessis': [
      { opponent:'Khamzat Chimaev', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true, notes:'Middleweight title loss; prime elite decision.' }
    ],
    'Kayla Harrison': [],
    'Rose Namajunas': [
      { opponent:'Carla Esparza', phase:'prePrime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Karolina Kowalkiewicz', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Jessica Andrade', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Carla Esparza', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Manon Fiorot', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Natalia Silva', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true, notes:'Counted as established flyweight loss.' }
    ],
    'Mackenzie Dern': [
      { opponent:'Amanda Ribas', phase:'prePrime', opponentTier:'nonElite', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Marina Rodriguez', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Yan Xiaonan', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Jessica Andrade', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Amanda Lemos', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true }
    ],
    'Julianna Peña': [
      { opponent:'Valentina Shevchenko', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Germaine de Randamie', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Amanda Nunes', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Kayla Harrison', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true, notes:'Title loss to UFC champion.' }
    ],
    'Julianna Pena': [
      { opponent:'Valentina Shevchenko', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Germaine de Randamie', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Amanda Nunes', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Kayla Harrison', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true, notes:'Title loss to UFC champion.' }
    ],
    'Alexa Grasso': [
      { opponent:'Felice Herrig', phase:'prePrime', opponentTier:'nonElite', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Tatiana Suarez', phase:'prePrime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Carla Esparza', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Valentina Shevchenko', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Natalia Silva', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true }
    ],
    "Sean O'Malley": [
      { opponent:'Marlon Vera', phase:'prime', opponentTier:'nonElite', finished:true, finishTreatment:REDUCED, counted:true, penaltyOverride:-2.00, notes:'Weird injury loss; locked reduced treatment.' },
      { opponent:'Merab Dvalishvili', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true }
    ],
    'Aljamain Sterling': [
      { opponent:'Marlon Moraes', phase:'prePrime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:"Sean O'Malley", phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Movsar Evloev', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:NONE, counted:true }
    ],
    'Petr Yan': [
      { opponent:'Aljamain Sterling', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true, penaltyOverride:-0.75, notes:'DQ reduced treatment.' },
      { opponent:'Aljamain Sterling', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:"Sean O'Malley", phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Merab Dvalishvili', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true }
    ],
    'Henry Cejudo': [
      { opponent:'Demetrious Johnson', phase:'prePrime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Joseph Benavidez', phase:'prePrime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Aljamain Sterling', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Merab Dvalishvili', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true }
    ],
    'Dominick Cruz': [
      { opponent:'Cody Garbrandt', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Henry Cejudo', phase:'prime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true },
      { opponent:'Marlon Vera', phase:'postPrime', opponentTier:'championTop5', finished:true, finishTreatment:NORMAL, counted:true }
    ],
    'Francis Ngannou': [
      { opponent:'Stipe Miocic', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true },
      { opponent:'Derrick Lewis', phase:'prime', opponentTier:'championTop5', finished:false, finishTreatment:NONE, counted:true }
    ]
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
