// Opponent Quality shadow ledger structure. No live scores changed.
(function(){
  const VERSION='opponent-quality-ledgers-20260708b-gsp-jones';

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

  const RETURNS=[[1,6,1.00],[7,12,0.75],[13,18,0.50],[19,999,0.25]];

  // Raw row shape:
  // [opponentLabel, credit, tierLabel, contextNote, reviewStatus]
  // Credit is final. No finish bonus, performance bonus, or separate division multiplier.
  const RAW={
    'Georges St-Pierre':[
      ['Matt Hughes II',1.25,'Champion-level win','Beat an all-time welterweight champion while Hughes was still elite.','locked'],
      ['B.J. Penn II',1.25,'Champion-level win','Prime elite champion-level opponent. Smaller fighter context exists, but Penn was an elite UFC champion.','locked'],
      ['Jon Fitch',1.25,'Champion-level win','Long-streak elite welterweight title challenger and champion-type contender.','locked'],
      ['Carlos Condit',1.25,'Champion-level win','Interim UFC welterweight champion and elite prime contender.','locked'],
      ['Johny Hendricks',1.25,'Champion-level win','Peak title-caliber welterweight. Controversial decision context is review-only, not a performance modifier.','high-risk review'],
      ['Jake Shields',1.00,'True top-5 win','Elite grappler and top welterweight contender, with major non-UFC context not directly scored.','review'],
      ['Thiago Alves',1.00,'True top-5 win','Prime top welterweight contender during a strong GSP-era division.','locked'],
      ['Josh Koscheck II',1.00,'True top-5 win','Top welterweight contender and proven elite wrestler.','locked'],
      ['B.J. Penn I',1.00,'True top-5 win','Elite champion-level fighter, with size/division context keeping it below max credit.','review'],
      ['Michael Bisping',1.00,'True top-5 win','Current UFC middleweight champion, but older and softer champion context.','review'],
      ['Matt Serra II',0.85,'Strong top-10 win','Official UFC champion rematch win, but Serra is not treated as a champion-level opponent-quality case.','review'],
      ['Nick Diaz',0.85,'Strong top-10 win','Big-name elite veteran with timing and activity context.','review'],
      ['Sean Sherk',0.85,'Strong top-10 win','Strong ranked-quality win over a future UFC champion.','locked'],
      ['Frank Trigg',0.85,'Strong top-10 win','Relevant ranked welterweight contender at the time.','locked'],
      ['Karo Parisyan',0.65,'Ranked / quality win','Early meaningful win over a quality UFC welterweight.','review'],
      ['Dan Hardy',0.65,'Ranked / quality win','Title challenger, but weaker top-contender quality than GSP’s best wins.','review'],
      ['Jason Miller',0.45,'Solid resume win','Useful UFC win, not a high-end opponent-quality driver.','locked'],
      ['Jay Hieron',0.45,'Solid resume win','Solid early UFC win.','locked']
    ],
    'Jon Jones':[
      ['Daniel Cormier I',1.25,'Champion-level win','Prime elite champion-level opponent and all-time great light heavyweight/heavyweight.','locked'],
      ['Daniel Cormier II',1.25,'Champion-level win','No-contest context kept in review, but the opponent-quality value is elite.','high-risk review'],
      ['Alexander Gustafsson I',1.25,'Champion-level win','Peak champion-type title challenger in a strong light heavyweight era.','locked'],
      ['Mauricio Rua',1.25,'Champion-level win','UFC light heavyweight champion and elite title-level opponent.','locked'],
      ['Lyoto Machida',1.25,'Champion-level win','Former UFC champion and elite light heavyweight at the time.','locked'],
      ['Rashad Evans',1.25,'Champion-level win','Former UFC champion and still elite top light heavyweight.','locked'],
      ['Glover Teixeira',1.00,'True top-5 win','Elite top contender and future UFC champion, but not quite max at the time.','locked'],
      ['Quinton Jackson',1.00,'True top-5 win','Former UFC champion and still a real top light heavyweight contender.','review'],
      ['Dominick Reyes',1.00,'True top-5 win','Prime top title challenger. Close-decision context is review-only.','high-risk review'],
      ['Thiago Santos',1.00,'True top-5 win','Top light heavyweight title challenger, with injury/weird fight context noted.','high-risk review'],
      ['Ciryl Gane',1.00,'True top-5 win','Elite heavyweight contender and recent interim champion.','review'],
      ['Ryan Bader',0.85,'Strong top-10 win','Undefeated strong contender and quality ranked win.','locked'],
      ['Vitor Belfort',0.85,'Strong top-10 win','Dangerous former champion name, but undersized/middleweight context keeps it discounted.','review'],
      ['Anthony Smith',0.85,'Strong top-10 win','Ranked title challenger, but softer than Jones’ best title opponents.','review'],
      ['Ovince Saint Preux',0.65,'Ranked / quality win','Ranked short-notice/interim-title context, useful but discounted.','review'],
      ['Stipe Miocic',0.65,'Ranked / quality win','All-time heavyweight name, but aged/long-layoff timing heavily limits opponent-quality value.','high-risk review'],
      ['Chael Sonnen',0.25,'Name-value / faded / unproven','Big name, but weak/undersized light heavyweight title context.','high-risk review'],
      ['Vladimir Matyushenko',0.45,'Solid resume win','Solid veteran UFC win.','locked'],
      ['Brandon Vera',0.45,'Solid resume win','Useful name win before Jones’ title run.','locked'],
      ['Stephan Bonnar',0.45,'Solid resume win','Good early UFC résumé win.','locked'],
      ['Jake O’Brien',0.25,'Name-value / faded / unproven','Low-end early UFC résumé value.','locked'],
      ['Andre Gusmao',0.10,'Minimal UFC quality credit','Minimal opponent-quality value.','locked']
    ]
  };

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

  window.UFC_OPPONENT_QUALITY_LEDGERS={version:VERSION,mode:'shadow-ledger-batch-one',formula:'Sorted UFC win credits. Best 6 count 100%, wins 7-12 count 75%, wins 13-18 count 50%, wins 19+ count 25%.',creditScale:CREDIT_SCALE,diminishingReturns:RETURNS,raw:RAW,rowsFor,summarize,allSummaries,tierForCredit};
  document.documentElement.setAttribute('data-opponent-quality-ledgers',VERSION);
})();