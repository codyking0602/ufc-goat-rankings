// App-facing category label polish.
// Keeps the underlying category key as `championship` but shows the clearer label users see.
(function(){
  const VERSION = 'championship-label-polish-20260703a';
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
