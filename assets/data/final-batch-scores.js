(function(){
  const VERSION='final-batch-scores-20260707a';
  const CAP=-10;
  const WRITES=[
    ['Charles Oliveira',-10],['Frankie Edgar',-6],['Lyoto Machida',-10],['Conor McGregor',-6.75],
    ['Sean Strickland',-9.25],['Robert Whittaker',-10],['Dan Henderson',-3.75],['Brock Lesnar',-6],
    ['Tony Ferguson',-5],['Michael Bisping',-10],['Chael Sonnen',-8],['Robbie Lawler',-8.75],
    ['Miesha Tate',-6],['Holly Holm',-8.25],['Jessica Andrade',-10],['Carla Esparza',-9.75]
  ];
  const MAP=Object.fromEntries(WRITES);
  function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d;}
  function round2(v){return Math.round((num(v)+Number.EPSILON)*100)/100;}
  function oldPenalty(f){return num(f?.penalty??f?.lossPenalty??f?.scoring?.penalty??0);}
  function positive(f){const p=num(f?.weightedScoreBreakdown?.positiveScore,NaN);return Number.isFinite(p)?p:round2(num(f?.totalScore)-oldPenalty(f));}
  function write(f,val){
    const target=Math.max(CAP,round2(val));
    const prev={totalScore:f.totalScore,penalty:f.penalty,lossPenalty:f.lossPenalty};
    const pos=positive(f);
    const total=round2(pos+target);
    f.penalty=target;f.lossPenalty=target;f.totalScore=total;
    if(f.scoring)f.scoring.penalty=target;
    if(f.weightedScoreBreakdown){f.weightedScoreBreakdown.penalty=target;f.weightedScoreBreakdown.totalScore=total;}
    if(f.display?.scoreSummary){f.display.scoreSummary.lossContext=target;f.display.scoreSummary.totalScore=total;}
    f.lossContextScoreWriteVersion=VERSION;
    f.lossContextScoreWrite={previous:prev,positiveScore:pos,targetPenalty:target,source:'final batch'};
    return {fighter:f.fighter,previous:prev,next:{totalScore:total,penalty:target,lossPenalty:target}};
  }
  const rows=Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];
  const applied=[];
  rows.forEach(f=>{if(f?.fighter&&Object.prototype.hasOwnProperty.call(MAP,f.fighter))applied.push(write(f,MAP[f.fighter]));});
  window.UFC_FINAL_BATCH_SCORES={version:VERSION,cap:CAP,applied,writes:MAP};
  document.documentElement.setAttribute('data-final-batch-scores',VERSION);
})();
