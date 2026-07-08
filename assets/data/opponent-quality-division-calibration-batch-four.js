// Opponent Quality division calibration: batch-four group. Shadow-only.
// Reverts hard-division trims. Keeps only approved Cejudo/Whittaker trims and boosts Izzy's Pereira II win.
(function(){
  const VERSION='opponent-quality-division-calibration-batch-four-20260708j-load-live-30pt';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  const RAW=store?.raw;
  if(!RAW)return;
  const changes=[];
  const P=[
    ['Israel Adesanya','Alex Pereira II',1.25,'Champion-level win'],
    ['Henry Cejudo','T.J. Dillashaw',0.85,'Strong top-10 win'],
    ['Henry Cejudo','Dominick Cruz',0.65,'Ranked / quality win'],
    ['Robert Whittaker','Paulo Costa',0.85,'Strong top-10 win'],
    ['Robert Whittaker','Darren Till',0.65,'Ranked / quality win']
  ];
  function patch([fighter,opponent,credit,label]){
    const row=RAW[fighter]?.find(r=>Array.isArray(r)&&r[0]===opponent);
    if(!row)return;
    changes.push({fighter,opponent,from:row[1],to:credit});
    row[1]=credit; row[2]=label; row[3]=(row[3]||'')+' Approved division/timing calibration.'; row[4]='review';
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
  P.forEach(patch);
  store.version=VERSION;
  store.batchFourDivisionCalibration={version:VERSION,changes,appliedAt:new Date().toISOString(),note:'Only Cejudo and Whittaker trims remain; Izzy over Pereira II boosted to max credit. Batches five, six, seven, shadow audit, then 30-point live scoring load after this file.'};
  document.documentElement.setAttribute('data-opponent-quality-division-calibration-batch-four',VERSION);
  loadScriptOnce('assets/data/opponent-quality-ledger-batch-five.js?v=opponent-quality-ledger-batch-five-20260708b','data-opponent-quality-ledger-batch-five',()=>loadScriptOnce('assets/data/opponent-quality-ledger-batch-six.js?v=opponent-quality-ledger-batch-six-20260708a','data-opponent-quality-ledger-batch-six',()=>loadScriptOnce('assets/data/opponent-quality-ledger-batch-seven.js?v=opponent-quality-ledger-batch-seven-20260708a','data-opponent-quality-ledger-batch-seven',()=>loadScriptOnce('assets/js/opponent-quality-shadow-audit.js?v=opponent-quality-shadow-audit-20260708b','data-opponent-quality-shadow-audit',()=>loadScriptOnce('assets/js/opponent-quality-live.js?v=opponent-quality-live-20260708b','data-opponent-quality-live')))));
})();