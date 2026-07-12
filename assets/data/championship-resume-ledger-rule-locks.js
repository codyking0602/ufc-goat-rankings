// Championship Resume rule locks. Shadow mode only; mutates ledger audit data after ledger load.
(function(){
  const VERSION='championship-resume-ledger-rule-locks-20260712a-couture-calibration';
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
    ['Ronda Rousey','Bethe Correia',0.75,'high-risk review','Clearly soft title opponent floor.'],
    ['Randy Couture','Maurice Smith',0.75,'review','Historic title win, but shallow early-era title field receives a material opponent-strength discount.'],
    ['Randy Couture','Kevin Randleman',0.85,'review','Legitimate champion win with old-era heavyweight depth calibration.'],
    ['Randy Couture','Pedro Rizzo',0.85,'review','Strong title challenger, but below full modern elite-title value.'],
    ['Randy Couture','Pedro Rizzo II',0.80,'review','Repeat title win with old-era and repeat-opponent calibration.'],
    ['Randy Couture','Tito Ortiz',0.90,'review','Second-division title win remains highly valuable, with old-era depth calibration.'],
    ['Randy Couture','Vitor Belfort',0.80,'review','Weird cut-loss rematch and old-era title context reduce the credit.'],
    ['Randy Couture','Tim Sylvia',0.85,'review','Heavyweight title win remains strong, with softer-era opponent calibration.'],
    ['Randy Couture','Gabriel Gonzaga',0.90,'locked','Strong heavyweight title defense over a dangerous contender.']
  ];
  const ADDITIONS=[
    ['Justin Gaethje','Paddy Pimblett','interim',0.85,'review','Recent-event add: UFC 324 interim lightweight title win. Counts as interim title credit only.'],
    ['Justin Gaethje','Ilia Topuria','normal',1.00,'review','Recent-event add: UFC Freedom 250 undisputed lightweight title win over elite two-division champion.'],
    ['Sean Strickland','Khamzat Chimaev','normal',1.00,'review','Recent-event add: UFC 328 middleweight title win by split decision.'],
    ['Petr Yan','Merab Dvalishvili','normal',1.00,'review','Recent-event add: UFC 323 bantamweight title reclaim over elite champion.'],
    ['Mackenzie Dern','Virna Jandiroba','vacantUndisputed',0.95,'review','Recent-event add: UFC 321 vacant strawweight title win over strong contender.']
  ];
  const RECENT_CONTEXT={
    'Ilia Topuria':'Recent-event context: UFC Freedom 250 title loss to Justin Gaethje should be treated as a prime elite title loss, not a non-elite penalty. Championship credit for Oliveira remains; Gaethje loss affects penalty/current context only.',
    'Khamzat Chimaev':'Recent-event context: UFC 319 Dricus title win stays. UFC 328 title loss to Sean Strickland should be treated as a prime elite/top-5 title loss by split decision with no finished add-on.',
    'Merab Dvalishvili':'Recent-event context: 2025 title defenses remain credited. UFC 323 title loss to Petr Yan should be treated as a prime elite/title loss by decision with no finished add-on.',
    'Dricus du Plessis':'Recent-event context: UFC 319 title loss to Khamzat Chimaev should be treated as a prime elite/title loss by decision with no finished add-on. Prior Strickland/Adesanya title wins stay credited.',
    'Islam Makhachev':'Recent-event context: Jack Della Maddalena welterweight title win stays. Ian Machado Garry is scheduled for UFC 330 on Aug. 15, 2026 and is not counted yet.'
  };
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function r(v){return Math.round((n(v)+Number.EPSILON)*100)/100;}
  function typeOf(v){const s=String(v||'normal').replace(/[-_ ]+/g,'').toLowerCase();if(s==='interim')return'interim';if(s==='vacant'||s==='vacantundisputed')return'vacantUndisputed';if(s==='seconddivisionundisputed'||s==='secondbelt')return'secondDivisionUndisputed';if(s==='vacantseconddivision'||s==='vacantsecondbelt')return'vacantSecondDivision';return'normal';}
  function credit(titleType,strength){const t=typeOf(titleType);return r((BASE[t]||1)*n(strength,1));}
  function allRowsFor(fighter){const rows=[];const push=row=>{if(row&&row.fighter===fighter)rows.push(row);};(window.RANKING_DATA?.fighters||[]).forEach(push);(window.RANKING_DATA?.men||[]).forEach(push);(window.RANKING_DATA?.women||[]).forEach(push);return rows;}
  function annotateContext(){Object.entries(RECENT_CONTEXT).forEach(([fighter,note])=>{allRowsFor(fighter).forEach(row=>{row.recentEventsAudit=note;});});}
  function ensureLedger(store,fighter){if(!store.ledgers[fighter])store.ledgers[fighter]={fighter,championshipWins:[]};if(!Array.isArray(store.ledgers[fighter].championshipWins))store.ledgers[fighter].championshipWins=[];return store.ledgers[fighter].championshipWins;}
  function apply(){const store=window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;if(!store||!store.ledgers)return null;const applied=[];const added=[];UPDATES.forEach(([fighter,opponent,strength,reviewStatus,notes])=>{const rows=store.ledgers[fighter]?.championshipWins;if(!Array.isArray(rows))return;const row=rows.find(w=>w.opponent===opponent);if(!row)return;row.strength=strength;row.reviewStatus=reviewStatus;row.notes=notes;row.adjustedCredit=credit(row.titleType,strength);applied.push({fighter,opponent,strength,reviewStatus,adjustedCredit:row.adjustedCredit});});ADDITIONS.forEach(([fighter,opponent,titleType,strength,reviewStatus,notes])=>{const rows=ensureLedger(store,fighter);let row=rows.find(w=>w.opponent===opponent&&typeOf(w.titleType)===typeOf(titleType));if(!row){row={opponent,titleType:typeOf(titleType)};rows.push(row);added.push({fighter,opponent,titleType:typeOf(titleType)});}row.titleType=typeOf(titleType);row.strength=strength;row.reviewStatus=reviewStatus;row.notes=notes;row.adjustedCredit=credit(titleType,strength);applied.push({fighter,opponent,strength,reviewStatus,adjustedCredit:row.adjustedCredit});});annotateContext();if(typeof store.summarize==='function'){store.reviewRows=Object.keys(store.ledgers).map(store.summarize).filter(row=>row.reviewStatus!=='locked');}store.version=VERSION;window.UFC_CHAMPIONSHIP_RESUME_LEDGER_RULE_LOCKS={version:VERSION,mode:'shadow-rule-locks',applied,added,recentContext:RECENT_CONTEXT,notCounted:[{fighter:'Islam Makhachev',opponent:'Ian Machado Garry',reason:'Scheduled for UFC 330 on 2026-08-15; not counted until completed.'}]};document.documentElement.setAttribute('data-championship-resume-ledger-rule-locks',VERSION);return applied;}
  apply();
})();