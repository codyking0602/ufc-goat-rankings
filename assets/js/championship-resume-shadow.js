// Championship Resume shadow formula. Live scores are untouched.
(function(){
  const VERSION='championship-resume-shadow-20260707b-batch-one';
  const BASE={normal:1,interim:.75,vacantUndisputed:.9,secondDivisionUndisputed:1.25,vacantSecondDivision:1.15};
  const BUCKETS=[['normalTitleWins','normal'],['interimTitleWins','interim'],['vacantUndisputedWins','vacantUndisputed'],['secondDivisionUndisputedWins','secondDivisionUndisputed'],['vacantSecondDivisionWins','vacantSecondDivision']];
  const BENCHMARK=15.8, MAX=30;
  const BATCH_ONE={
    'Jon Jones':[
      ['Mauricio Rua','normal',1],['Rampage Jackson','normal',.95],['Lyoto Machida','normal',.95],['Rashad Evans','normal',1],['Vitor Belfort','normal',.9],['Chael Sonnen','normal',.75],['Alexander Gustafsson','normal',1],['Glover Teixeira','normal',1],['Daniel Cormier','normal',1],['Ovince Saint Preux','interim',.8],['Alexander Gustafsson II','vacantUndisputed',.9],['Anthony Smith','normal',.85],['Thiago Santos','normal',.9],['Dominick Reyes','normal',.95],['Ciryl Gane','vacantSecondDivision',.9],['Stipe Miocic','normal',.75]
    ],
    'Georges St-Pierre':[
      ['Matt Hughes','normal',1],['Matt Hughes II','interim',.95],['Matt Serra','normal',.9],['Jon Fitch','normal',1],['B.J. Penn','normal',1],['Thiago Alves','normal',.95],['Dan Hardy','normal',.85],['Josh Koscheck','normal',.9],['Jake Shields','normal',.95],['Carlos Condit','normal',.95],['Nick Diaz','normal',.9],['Johny Hendricks','normal',1],['Michael Bisping','secondDivisionUndisputed',.85]
    ],
    'Demetrious Johnson':[
      ['Joseph Benavidez','vacantUndisputed',1],['John Dodson','normal',.95],['John Moraga','normal',.85],['Joseph Benavidez II','normal',1],['Ali Bagautinov','normal',.85],['Kyoji Horiguchi','normal',.95],['John Dodson II','normal',.9],['Henry Cejudo','normal',1],['Tim Elliott','normal',.8],['Wilson Reis','normal',.85],['Ray Borg','normal',.85]
    ],
    'Anderson Silva':[
      ['Rich Franklin','normal',1],['Nate Marquardt','normal',.95],['Rich Franklin II','normal',.95],['Dan Henderson','normal',1],['Patrick Cote','normal',.8],['Thales Leites','normal',.75],['Demian Maia','normal',.9],['Chael Sonnen','normal',1],['Vitor Belfort','normal',.95],['Yushin Okami','normal',.9],['Chael Sonnen II','normal',1]
    ],
    'Khabib Nurmagomedov':[
      ['Al Iaquinta','vacantUndisputed',.75],['Conor McGregor','normal',.95],['Dustin Poirier','normal',1],['Justin Gaethje','normal',1]
    ],
    'Alexander Volkanovski':[
      ['Max Holloway','normal',1],['Max Holloway II','normal',1],['Brian Ortega','normal',.9],['Korean Zombie','normal',.85],['Max Holloway III','normal',1],['Yair Rodriguez','normal',.95]
    ]
  };
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function r(v){return Math.round((n(v)+Number.EPSILON)*100)/100;}
  function clamp01(v){return Math.min(1,Math.max(0,n(v,1)));}
  function fighters(){return Array.isArray(window.RANKING_DATA&&window.RANKING_DATA.fighters)?window.RANKING_DATA.fighters:[];}
  function boards(){return ((window.RANKING_DATA&&window.RANKING_DATA.men)||[]).concat((window.RANKING_DATA&&window.RANKING_DATA.women)||[]);}
  function typeOf(v){const s=String(v||'normal').replace(/[-_\s]+/g,'').toLowerCase();if(s==='interim')return'interim';if(s==='vacant'||s==='vacantundisputed')return'vacantUndisputed';if(s==='seconddivisionundisputed'||s==='secondbelt')return'secondDivisionUndisputed';if(s==='vacantseconddivision'||s==='vacantsecondbelt')return'vacantSecondDivision';return'normal';}
  function directBatch(f){const rows=BATCH_ONE[f.fighter];return rows?rows.map(x=>({opponent:x[0],titleType:x[1],strength:x[2],source:'championshipBatchOne'})):null;}
  function fallback(f){const t=f.title||{},out=[];BUCKETS.forEach(pair=>{const count=Math.max(0,Math.round(n(t[pair[0]])));for(let i=0;i<count;i++)out.push({opponent:'TBD',titleType:pair[1],strength:1,source:'titleBucketFallback'});});return out;}
  function winsFor(f){const direct=directBatch(f);if(direct)return direct;if(Array.isArray(f.championshipWins)&&f.championshipWins.length)return f.championshipWins;if(f.championshipInputs&&Array.isArray(f.championshipInputs.wins)&&f.championshipInputs.wins.length)return f.championshipInputs.wins;return fallback(f);}
  function calculate(f){const direct=!!directBatch(f)||Array.isArray(f.championshipWins)&&f.championshipWins.length;const wins=winsFor(f).map((w,i)=>{const t=typeOf(w.titleType||w.type);const base=BASE[t]||1;const strength=clamp01(w.strength||w.multiplier||w.opponentDiscount||w.discount||1);return{index:i+1,opponent:w.opponent||'TBD',titleType:t,baseValue:base,strength,adjustedCredit:r(base*strength),source:w.source||(direct?'directLedger':'titleBucketFallback'),notes:w.notes||''};});const credit=r(wins.reduce((sum,w)=>sum+w.adjustedCredit,0));const formulaScore=r(Math.min(MAX,Math.max(0,(credit/BENCHMARK)*MAX)));const currentScore=r(n(f.championship||(f.scoring&&f.scoring.championship)));return{fighter:f.fighter,status:direct?'direct-ledger':'fallback-title-buckets',titleFightWins:wins.length,adjustedTitleCredit:credit,formulaScore,currentScore,delta:r(formulaScore-currentScore),wins};}
  function apply(){const report=fighters().map(f=>{const audit=calculate(f);if(BATCH_ONE[f.fighter])f.championshipWins=winsFor(f);f.championshipResumeAudit=audit;f.championshipFormulaDriven=false;boards().filter(row=>row&&row.fighter===f.fighter).forEach(row=>{if(BATCH_ONE[f.fighter])row.championshipWins=winsFor(f);row.championshipResumeAudit=audit;row.championshipFormulaDriven=false;});return{fighter:audit.fighter,status:audit.status,titleFightWins:audit.titleFightWins,adjustedTitleCredit:audit.adjustedTitleCredit,currentScore:audit.currentScore,formulaScore:audit.formulaScore,delta:audit.delta};});window.UFC_CHAMPIONSHIP_RESUME_SHADOW={version:VERSION,mode:'shadow',baseValues:BASE,batchOne:Object.keys(BATCH_ONE),benchmarkCredit:BENCHMARK,report,calculate};document.documentElement.setAttribute('data-championship-resume-shadow',VERSION);return report;}
  apply();window.UFC_CHAMPIONSHIP_RESUME_SHADOW_APPLY=apply;
})();
