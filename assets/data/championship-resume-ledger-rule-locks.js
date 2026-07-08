// Championship Resume rule locks. Shadow mode only; mutates ledger audit data after ledger load.
(function(){
  const VERSION='championship-resume-ledger-rule-locks-20260707a';
  const BASE={normal:1,interim:.75,vacantUndisputed:.9,secondDivisionUndisputed:1.25,vacantSecondDivision:1.15};
  const UPDATES=[
    ['Aljamain Sterling','Petr Yan',0.50,'high-risk review','DQ title win/weird title context; Cody locked DQ rule at 0.50.'],
    ['Jon Jones','Alexander Gustafsson II',1.00,'locked','Elite vacant-title opponent; full opponent strength.'],
    ['Islam Makhachev','Charles Oliveira',1.00,'locked','Elite vacant-title opponent; full opponent strength.'],
    ['Daniel Cormier','Anthony Johnson',1.00,'locked','Elite vacant-title opponent; full opponent strength.'],
    ['Petr Yan','Jose Aldo',1.00,'locked','Elite vacant-title opponent; full opponent strength.'],
    ['Israel Adesanya','Robert Whittaker',1.00,'locked','Elite vacant-title opponent; full opponent strength.'],
    ['Valentina Shevchenko','Joanna Jedrzejczyk',1.00,'locked','Elite vacant-title opponent; full opponent strength.'],
    ['Matt Hughes','Georges St-Pierre',1.00,'high-risk review','Vacant title vs early GSP; old-era context but full elite opponent strength.'],
    ['Deiveson Figueiredo','Joseph Benavidez II',1.00,'high-risk review','Elite vacant-title opponent at full strength; missed-weight first fight context remains high-risk.'],
    ['Robbie Lawler','Johny Hendricks',1.00,'review','Elite vacant-title opponent at full strength; close rivalry decision remains review.'],
    ['Demetrious Johnson','Chris Cariaso',0.75,'high-risk review','Clearly soft title opponent floor.'],
    ['Demetrious Johnson','Tim Elliott',0.75,'high-risk review','TUF/weird challenger context; soft/weird floor.'],
    ['Tito Ortiz','Elvis Sinosic',0.75,'high-risk review','Clearly softer title challenger floor.'],
    ['Ronda Rousey','Bethe Correia',0.75,'high-risk review','Clearly soft title opponent floor.']
  ];
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function r(v){return Math.round((n(v)+Number.EPSILON)*100)/100;}
  function typeOf(v){const s=String(v||'normal').replace(/[-_ ]+/g,'').toLowerCase();if(s==='interim')return'interim';if(s==='vacant'||s==='vacantundisputed')return'vacantUndisputed';if(s==='seconddivisionundisputed'||s==='secondbelt')return'secondDivisionUndisputed';if(s==='vacantseconddivision'||s==='vacantsecondbelt')return'vacantSecondDivision';return'normal';}
  function apply(){const store=window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;if(!store||!store.ledgers)return null;const applied=[];UPDATES.forEach(([fighter,opponent,strength,reviewStatus,notes])=>{const rows=store.ledgers[fighter]?.championshipWins;if(!Array.isArray(rows))return;const row=rows.find(w=>w.opponent===opponent);if(!row)return;row.strength=strength;row.reviewStatus=reviewStatus;row.notes=notes;const t=typeOf(row.titleType);row.adjustedCredit=r((BASE[t]||1)*strength);applied.push({fighter,opponent,strength,reviewStatus,adjustedCredit:row.adjustedCredit});});if(typeof store.summarize==='function'){store.reviewRows=Object.keys(store.ledgers).map(store.summarize).filter(row=>row.reviewStatus!=='locked');}store.version=VERSION;window.UFC_CHAMPIONSHIP_RESUME_LEDGER_RULE_LOCKS={version:VERSION,mode:'shadow-rule-locks',applied};document.documentElement.setAttribute('data-championship-resume-ledger-rule-locks',VERSION);return applied;}
  apply();
})();