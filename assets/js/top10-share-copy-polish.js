(function(){
  'use strict';

  const SITE_URL = 'https://codyking0602.github.io/ufc-goat-rankings/';

  function compactDisagreement(value){
    const text = String(value || '').trim();
    const match = text.match(/^(.*?)(\s(?:[+-]\d+|even))$/i);
    if(!match) return text;
    const surname = match[1].trim().split(/\s+/).pop();
    return `${surname}${match[2]}`;
  }

  function polishedShareText(text){
    const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
    const agreement = lines.find(line => /model agreement/i.test(line)) || '';
    const disagreementLine = lines.find(line => /^biggest disagreement:/i.test(line)) || '';
    const disagreement = disagreementLine.replace(/^biggest disagreement:\s*/i,'');
    return [
      agreement,
      `Biggest disagreement: ${compactDisagreement(disagreement)}`,
      'Think your Top 10 is better?',
      SITE_URL
    ].filter(Boolean).join('\n');
  }

  const nativeFillText = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function(text,...args){
    const nextText = text === 'ACTIVE FIGHTERS' ? 'ALL-TIME PICKS' : text;
    return nativeFillText.call(this,nextText,...args);
  };

  const nativeShare = navigator.share;
  if(typeof nativeShare === 'function'){
    const polishedShare = function(data){
      if(data?.title !== 'My UFC GOAT Top 10') return nativeShare.call(this,data);
      return nativeShare.call(this,{ ...data, text:polishedShareText(data.text) });
    };
    try {
      Object.defineProperty(navigator,'share',{configurable:true,value:polishedShare});
    } catch(_error){
      try { Object.getPrototypeOf(navigator).share = polishedShare; } catch(_ignored){}
    }
  }
})();