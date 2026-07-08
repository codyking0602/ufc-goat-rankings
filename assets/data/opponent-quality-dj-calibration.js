// DJ Opponent Quality division calibration. Loads the full Opponent Quality live chain after DJ calibration.
(function(){
  const VERSION='opponent-quality-dj-calibration-20260708d-live-chain';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  const rows=store?.raw?.['Demetrious Johnson'];
  if(!Array.isArray(rows))return;
  const changes=[];
  function set(opponent,credit,label,note,status){
    const row=rows.find(r=>Array.isArray(r)&&r[0]===opponent);
    if(!row)return;
    changes.push({opponent,from:row[1],to:credit});
    row[1]=credit;
    row[2]=label;
    row[3]=note;
    row[4]=status||row[4]||'review';
  }
  function loadScriptOnce(src,attr,done){
    if(document.querySelector(`script[${attr}]`)){if(done)done();return;}
    const script=document.createElement('script');
    script.src=src;
    script.setAttribute(attr,'true');
    script.onload=()=>{if(done)done();};
    script.onerror=()=>{if(done)done();};
    document.body.appendChild(script);
  }
  set('Henry Cejudo I',1.00,'True top-5 win','Future two-division UFC champion, but this was an earlier/pre-title Cejudo in a softer flyweight era.','review');
  set('Joseph Benavidez II',1.15,'Elite divisional win','Elite flyweight title challenger and divisional great; below 1.25 because of division-strength calibration.','locked');
  set('Ray Borg',0.65,'Ranked / quality win','Ranked flyweight title challenger, but not elite enough for strong top-10 credit after division calibration.','review');
  set('Tim Elliott',0.65,'Ranked / quality win','Awkward ranked flyweight challenger, but softer division-depth context.','review');
  set('John Moraga',0.65,'Ranked / quality win','Ranked flyweight title challenger, calibrated down for softer division depth.','review');
  store.version=VERSION;
  store.mode='opponent-quality-live-chain-loader';
  store.djCalibration={version:VERSION,changes,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-opponent-quality-dj-calibration',VERSION);
  loadScriptOnce('assets/data/opponent-quality-division-calibration-base.js?v=opponent-quality-division-calibration-base-20260708b','data-opponent-quality-division-calibration-base',()=>loadScriptOnce('assets/data/opponent-quality-division-calibration-batch-four.js?v=opponent-quality-division-calibration-batch-four-20260708i','data-opponent-quality-division-calibration-batch-four'));
})();