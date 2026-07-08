// Championship Resume shadow formula. Live scores are untouched.
(function(){
  const VERSION='championship-resume-shadow-20260707a';
  const BASE={normal:1,interim:.75,vacantUndisputed:.9,secondDivisionUndisputed:1.25,vacantSecondDivision:1.15};
  const BUCKETS=[['normalTitleWins','normal'],['interimTitleWins','interim'],['vacantUndisputedWins','vacantUndisputed'],['secondDivisionUndisputedWins','secondDivisionUndisputed'],['vacantSecondDivisionWins','vacantSecondDivision']];
  const BENCHMARK=15.8, MAX=30;
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function r(v){return Math.round((n(v)+Number.EPSILON)*100)/100;}
  function clamp01(v){return Math.min(1,Math.max(0,n(v,1)));}
  function fighters(){return Array.isArray(window.RANKING_DATA&&window.RANKING_DATA.fighters)?window.RANKING_DATA.fighters:[];}
  function boards(){return ((window.RANKING_DATA&&window.RANKING_DATA.men)||[]).concat((window.RANKING_DATA&&window.RANKING_DATA.women)||[]);}
  function typeOf(v){const s=String(v||'normal').replace(/[-_\s]+/g,'').toLowerCase();if(s==='interim')return'interim';if(s==='vacant'||s==='vacantundisputed')return'vacantUndisputed';if(s==='seconddivisionundisputed'||s==='secondbelt')return'secondDivisionUndisputed';if(s==='vacantseconddivision'||s==='vacantsecondbelt')return'vacantSecondDivision';return'normal';}
  function fallback(f){const t=f.title||{},out=[];BUCKETS.forEach(pair=>{const count=Math.max(0,Math.round(n(t[pair[0]])));for(let i=0;i<count;i++)out.push({opponent:'TBD',titleType:pair[1],strength:1,source:'titleBucketFallback'});});return out;}
  function winsFor(f){if(Array.isArray(f.championshipWins)&&f.championshipWins.length)return f.championshipWins;if(f.championshipInputs&&Array.isArray(f.championshipInputs.wins)&&f.championshipInputs.wins.length)return f.championshipInputs.wins;return fallback(f);}
  function calculate(f){const direct=Array.isArray(f.championshipWins)&&f.championshipWins.length;const wins=winsFor(f).map((w,i)=>{const t=typeOf(w.titleType||w.type);const base=BASE[t]||1;const strength=clamp01(w.strength||w.multiplier||w.opponentDiscount||w.discount||1);return{index:i+1,opponent:w.opponent||'TBD',titleType:t,baseValue:base,strength,adjustedCredit:r(base*strength),source:w.source||(direct?'directLedger':'titleBucketFallback'),notes:w.notes||''};});const credit=r(wins.reduce((sum,w)=>sum+w.adjustedCredit,0));const formulaScore=r(Math.min(MAX,Math.max(0,(credit/BENCHMARK)*MAX)));const currentScore=r(n(f.championship||(f.scoring&&f.scoring.championship)));return{fighter:f.fighter,status:direct?'direct-ledger':'fallback-title-buckets',titleFightWins:wins.length,adjustedTitleCredit:credit,formulaScore,currentScore,delta:r(formulaScore-currentScore),wins};}
  function apply(){const report=fighters().map(f=>{const audit=calculate(f);f.championshipResumeAudit=audit;f.championshipFormulaDriven=false;boards().filter(row=>row&&row.fighter===f.fighter).forEach(row=>{row.championshipResumeAudit=audit;row.championshipFormulaDriven=false;});return{fighter:audit.fighter,status:audit.status,titleFightWins:audit.titleFightWins,adjustedTitleCredit:audit.adjustedTitleCredit,currentScore:audit.currentScore,formulaScore:audit.formulaScore,delta:audit.delta};});window.UFC_CHAMPIONSHIP_RESUME_SHADOW={version:VERSION,mode:'shadow',baseValues:BASE,benchmarkCredit:BENCHMARK,report,calculate};document.documentElement.setAttribute('data-championship-resume-shadow',VERSION);return report;}
  apply();window.UFC_CHAMPIONSHIP_RESUME_SHADOW_APPLY=apply;
})();
