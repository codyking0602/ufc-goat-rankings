// Opponent Quality shadow audit/profile-card layer.
// Computes full-ledger audit data and profile-card evidence boxes. No live scores changed.
(function(){
  const VERSION='opponent-quality-shadow-audit-20260708a';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store||!store.raw)return;
  const RETURNS=store.diminishingReturns||[[1,6,1],[7,12,0.75],[13,18,0.5],[19,999,0.25]];
  const DEFINITION='Opponent Quality measures the value of a fighter’s UFC wins at the time they happened. It rewards champion-level wins, true top-5 wins, and deep ranked résumé strength, with division difficulty baked directly into each credit: harder divisions push borderline wins up, while softer, faded, short-notice, or weird-context wins are capped.';
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function round(v,dec=2){const p=Math.pow(10,dec);return Math.round((n(v)+Number.EPSILON)*p)/p;}
  function fmt(v,dec=2){return round(v,dec).toFixed(dec).replace(/\.00$/,'');}
  function rateForSlot(slot){const hit=RETURNS.find(([from,to])=>slot>=from&&slot<=to);return hit?n(hit[2],0.25):0.25;}
  function cleanName(name){return String(name||'').replace(/\s+I{1,3}$/,'').replace(/\s+\d+$/,'').trim();}
  function rawRowsFor(fighter){return Array.isArray(store.raw?.[fighter])?store.raw[fighter]:[];}
  function rowsFor(fighter){
    return rawRowsFor(fighter).map((row,index)=>({
      originalSlot:index+1,
      opponent:String(row[0]||'TBD'),
      credit:Math.max(0,Math.min(1.25,n(row[1]))),
      tierLabel:String(row[2]||''),
      context:String(row[3]||''),
      reviewStatus:String(row[4]||'review')
    })).sort((a,b)=>b.credit-a.credit||a.opponent.localeCompare(b.opponent)).map((row,index)=>{
      const slot=index+1;
      const countedRate=rateForSlot(slot);
      const exactCountedCredit=row.credit*countedRate;
      return {...row,slot,countedRate,exactCountedCredit,countedCredit:round(exactCountedCredit,2)};
    });
  }
  function summaryFor(fighter){
    const rows=rowsFor(fighter);
    const rawCredit=round(rows.reduce((s,r)=>s+r.credit,0),2);
    const diminishedCredit=round(rows.reduce((s,r)=>s+r.exactCountedCredit,0),2);
    const reviewRows=rows.filter(r=>!String(r.reviewStatus).toLowerCase().includes('lock'));
    const highRiskRows=rows.filter(r=>String(r.reviewStatus).toLowerCase().includes('high'));
    const bestWins=[];
    rows.forEach(r=>{const name=cleanName(r.opponent);if(name&&!bestWins.includes(name))bestWins.push(name);});
    return {
      fighter,
      rawCredit,
      diminishedCredit,
      maxCreditWins:rows.filter(r=>r.credit>=1.25).length,
      elitePlusWins:rows.filter(r=>r.credit>=1.15).length,
      topFivePlusWins:rows.filter(r=>r.credit>=1).length,
      rankedQualityWins:rows.filter(r=>r.credit>=0.65).length,
      bestWins:bestWins.slice(0,6),
      reviewRows,
      highRiskRows,
      rows
    };
  }
  function allSummaries(){return Object.keys(store.raw).map(summaryFor).sort((a,b)=>b.diminishedCredit-a.diminishedCredit||b.rawCredit-a.rawCredit||a.fighter.localeCompare(b.fighter));}
  const report=allSummaries();
  const byName=new Map(report.map(row=>[row.fighter,row]));
  function allDataRows(){
    const DATA=window.RANKING_DATA||{};
    return [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])];
  }
  allDataRows().forEach(row=>{
    if(!row?.fighter)return;
    const audit=byName.get(row.fighter);
    if(audit)row.opponentQualityShadowAudit=audit;
  });
  function summaryFromFighter(f){return byName.get(f?.fighter)||summaryFor(f?.fighter);}
  function contextNotes(summary){
    if(!summary||!summary.rows?.length)return'No UFC win ledger loaded yet.';
    const high=summary.highRiskRows?.slice(0,3).map(r=>cleanName(r.opponent));
    if(high?.length)return `Review flags: ${high.join(', ')}.`;
    const review=summary.reviewRows?.slice(0,3).map(r=>cleanName(r.opponent));
    if(review?.length)return `Review rows: ${review.join(', ')}.`;
    return 'Clean ledger with no major opponent-quality review flags.';
  }
  function evidenceItems(f){
    const s=summaryFromFighter(f);
    return [
      ['Elite+ wins', String(s.elitePlusWins||0)],
      ['Top-5+ wins', String(s.topFivePlusWins||0)],
      ['Best wins', (s.bestWins||[]).join(', ')||'No UFC win ledger loaded'],
      ['Context notes', contextNotes(s)]
    ];
  }
  const previousEvidence=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;
  if(previousEvidence){
    categoryEvidenceItems=function(f,key){
      if(key==='opponentQuality')return evidenceItems(f);
      return previousEvidence(f,key);
    };
  }
  const previousLogic=typeof categoryLogicSentence==='function'?categoryLogicSentence:null;
  if(previousLogic){
    categoryLogicSentence=function(f,key){
      if(key==='opponentQuality')return DEFINITION;
      return previousLogic(f,key);
    };
  }
  window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT={
    version:VERSION,
    mode:'shadow-audit-profile-card-only',
    formula:'Sorted UFC win credits. Best 6 count 100%, wins 7-12 count 75%, wins 13-18 count 50%, wins 19+ count 25%. Live scores unchanged.',
    fighters:report.length,
    report,
    leaders:report.slice(0,15).map(r=>({fighter:r.fighter,rawCredit:r.rawCredit,diminishedCredit:r.diminishedCredit,elitePlusWins:r.elitePlusWins,topFivePlusWins:r.topFivePlusWins,rankedQualityWins:r.rankedQualityWins})),
    summaryFor,
    rowsFor,
    definition:DEFINITION,
    boxes:['Elite+ wins','Top-5+ wins','Best wins','Context notes'],
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-opponent-quality-shadow-audit',VERSION);
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
})();