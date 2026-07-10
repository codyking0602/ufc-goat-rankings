// Opponent Quality shadow ledger batch nine: canonical Julianna Peña audit.
// UFC wins only. This layer replaces the partial non-canonical `Julianna Pena` row.
(function(){
  const VERSION='opponent-quality-ledger-batch-nine-20260710a-julianna-pena';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store||!store.raw)return;
  const RAW=store.raw;

  delete RAW['Julianna Pena'];
  RAW['Julianna Peña']=[
    ['Amanda Nunes I',1.25,'Champion-level win','Submitted the dominant reigning UFC two-division champion to win the bantamweight title.','locked'],
    ['Raquel Pennington',0.85,'Strong top-10 win','Won the UFC bantamweight title by disputed split decision; title value is respected but capped below full top-five credit.','review'],
    ['Cat Zingano',0.85,'Strong top-10 win','Strong contender win over a former UFC title challenger.','locked'],
    ['Sara McMann',0.65,'Ranked / quality win','Olympic medalist and ranked bantamweight veteran in Peña’s title climb.','locked'],
    ['Jessica Eye',0.65,'Ranked / quality win','Ranked bantamweight/flyweight contender and useful early UFC win.','review'],
    ['Nicco Montaño',0.45,'Solid resume win','Former UFC flyweight champion name, capped for inactivity, division movement, and limited sustained elite proof.','review'],
    ['Milana Dudieva',0.25,'Name-value / faded / unproven','Supporting UFC finish with limited opponent-quality value.','locked'],
    ['Jessica Rakoczy',0.10,'Minimal UFC quality credit','TUF finale support win with minimal long-term opponent-quality value.','locked']
  ];

  store.version=VERSION;
  store.mode='shadow-ledger-batch-nine';
  store.batchNineFighters=['Julianna Peña'];
  document.documentElement.setAttribute('data-opponent-quality-ledger-batch-nine',VERSION);
})();
