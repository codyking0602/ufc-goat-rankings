// Opponent Quality shadow ledger structure. No live scores changed.
(function(){
  const VERSION='opponent-quality-ledgers-20260708a-structure';

  const CREDIT_SCALE=[
    [1.25,'Champion-level win'],
    [1.00,'True top-5 win'],
    [0.85,'Strong top-10 win'],
    [0.65,'Ranked / quality win'],
    [0.45,'Solid resume win'],
    [0.25,'Name-value / faded / unproven'],
    [0.10,'Minimal UFC quality credit'],
    [0.00,'No meaningful quality credit']
  ];

  const RETURNS=[
    [1,6,1.00],
    [7,12,0.75],
    [13,18,0.50],
    [19,999,0.25]
  ];

  // Raw row shape:
  // [opponentLabel, credit, tierLabel, contextNote, reviewStatus]
  // Credit is final. No finish bonus, performance bonus, or separate division multiplier.
  const RAW={};

  function num(v){const n=Number(v||0);return Number.isFinite(n)?n:0;}
  function round2(v){return Math.round((num(v)+Number.EPSILON)*100)/100;}
  function clampCredit(v){return Math.max(0,Math.min(1.25,num(v)));}
  function status(v){const s=String(v||'review').toLowerCase();if(s.includes('lock'))return'locked';if(s.includes('high'))return'high-risk review';return'review';}
  function tierForCredit(v){const c=clampCredit(v);for(const [credit,label] of CREDIT_SCALE){if(c>=credit)return label;}return CREDIT_SCALE[CREDIT_SCALE.length-1][1];}
  function rateForSlot(slot){const b=RETURNS.find(([from,to])=>slot>=from&&slot<=to);return b?b[2]:0.25;}
  function normalize(row,index){const credit=clampCredit(row[1]);return{slot:index+1,opponent:row[0]||'TBD',credit,tierLabel:row[2]||tierForCredit(credit),context:row[3]||'',reviewStatus:status(row[4])};}
  function rowsFor(fighter){return (RAW[fighter]||[]).map(normalize).sort((a,b)=>b.credit-a.credit||String(a.opponent).localeCompare(String(b.opponent))).map((row,i)=>{const slot=i+1;const countedRate=rateForSlot(slot);return{...row,slot,countedRate,countedCredit:round2(row.credit*countedRate)};});}
  function summarize(fighter){const rows=rowsFor(fighter);return{fighter,rawCredit:round2(rows.reduce((s,r)=>s+r.credit,0)),diminishedCredit:round2(rows.reduce((s,r)=>s+r.countedCredit,0)),eliteWins:rows.filter(r=>r.credit>=1.25).length,topFiveWins:rows.filter(r=>r.credit>=1).length,rankedQualityWins:rows.filter(r=>r.credit>=0.65).length,bestWins:rows.slice(0,6).map(r=>r.opponent),reviewRows:rows.filter(r=>r.reviewStatus!=='locked'),rows};}
  function allSummaries(){return Object.keys(RAW).map(summarize).sort((a,b)=>b.diminishedCredit-a.diminishedCredit||b.rawCredit-a.rawCredit||String(a.fighter).localeCompare(String(b.fighter)));}

  window.UFC_OPPONENT_QUALITY_LEDGERS={version:VERSION,mode:'shadow-ledger-structure',formula:'Sorted UFC win credits. Best 6 count 100%, wins 7-12 count 75%, wins 13-18 count 50%, wins 19+ count 25%.',creditScale:CREDIT_SCALE,diminishingReturns:RETURNS,raw:RAW,rowsFor,summarize,allSummaries,tierForCredit};
  document.documentElement.setAttribute('data-opponent-quality-ledgers',VERSION);
})();