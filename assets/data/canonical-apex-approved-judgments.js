// Cody-approved Apex Peak judgment inputs.
// Shadow-only: this layer does not write live category scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-apex-approved-judgments-20260714a-batch-one';
  const WINDOW='Best two UFC wins within 24 months';
  const rows=[
    {
      fighter:'Glover Teixeira',
      classification:'recovered-judgment',
      correctionTypes:['factual-correction','recovered-judgment'],
      decision:'Thiago Santos and Jan Błachowicz remain the peak pair. Jan spelling/matching is corrected; Best-Fighter Claim and Aura are intentionally conservative.',
      audit:{
        version:VERSION,
        window:'Thiago Santos (2020-11-07) + Jan Błachowicz (2021-10-30)',
        modelWindow:WINDOW,
        score:4.25,
        performances:[
          {fightId:'2020-11-07-thiago-santos',label:'Thiago Santos',date:'2020-11-07',rating:9.0},
          {fightId:'2021-10-30-jan-b-achowicz',label:'Jan Błachowicz',date:'2021-10-30',rating:9.5}
        ],
        components:{twoPerformanceStrength:1.85,proof:1.30,bestFighterClaim:0.60,aura:0.50},
        classification:'recovered-judgment',
        approvalStatus:'cody-approved',
        notes:'Elite late-career title run with strong proof, but not a serious best-fighter-alive claim and only moderate Apex aura.',
        provenance:'Cody-approved canonical Apex judgment batch one'
      }
    },
    {
      fighter:'Royce Gracie',
      classification:'factual-correction',
      correctionTypes:['factual-correction'],
      decision:'Replace the invalid UFC 1 tournament aggregate with the Ken Shamrock and Dan Severn wins. Best-Fighter Claim is maxed for the foundational peak case.',
      audit:{
        version:VERSION,
        window:'Ken Shamrock (1993-11-12) + Dan Severn (1994-12-16)',
        modelWindow:WINDOW,
        score:5.30,
        performances:[
          {fightId:'1993-11-12-ken-shamrock',label:'Ken Shamrock',date:'1993-11-12',rating:9.2},
          {fightId:'1994-12-16-dan-severn',label:'Dan Severn',date:'1994-12-16',rating:9.3}
        ],
        components:{twoPerformanceStrength:1.85,proof:1.20,bestFighterClaim:1.25,aura:1.00},
        classification:'factual-correction',
        approvalStatus:'cody-approved',
        notes:'The two real wins support a maximum Best-Fighter Claim and maximum Aura without using an aggregate tournament result.',
        provenance:'Cody-approved canonical Apex judgment batch one'
      }
    },
    {
      fighter:'Deiveson Figueiredo',
      classification:'factual-correction',
      correctionTypes:['factual-correction'],
      decision:'Replace the Brandon Moreno draw with the second Joseph Benavidez win and Alex Perez.',
      audit:{
        version:VERSION,
        window:'Joseph Benavidez II (2020-07-19) + Alex Perez (2020-11-21)',
        modelWindow:WINDOW,
        score:4.38,
        performances:[
          {fightId:'2020-07-19-joseph-benavidez-ii',label:'Joseph Benavidez',date:'2020-07-19',rating:9.5},
          {fightId:'2020-11-21-alex-perez',label:'Alex Perez',date:'2020-11-21',rating:8.8}
        ],
        components:{twoPerformanceStrength:1.83,proof:1.15,bestFighterClaim:0.75,aura:0.65},
        classification:'factual-correction',
        approvalStatus:'cody-approved',
        notes:'A compliant two-win championship peak replaces the non-winning Moreno selection with no final score change.',
        provenance:'Cody-approved canonical Apex judgment batch one'
      }
    },
    {
      fighter:'Frank Shamrock',
      classification:'recovered-judgment',
      correctionTypes:['recovered-judgment'],
      decision:'Keep Kevin Jackson and Tito Ortiz and make every judgment component explicit.',
      audit:{
        version:VERSION,
        window:'Kevin Jackson (1997-12-21) + Tito Ortiz (1999-09-24)',
        modelWindow:WINDOW,
        score:5.39,
        performances:[
          {fightId:'1997-12-21-kevin-jackson',label:'Kevin Jackson',date:'1997-12-21',rating:8.8},
          {fightId:'1999-09-24-tito-ortiz',label:'Tito Ortiz',date:'1999-09-24',rating:9.6}
        ],
        components:{twoPerformanceStrength:1.84,proof:1.45,bestFighterClaim:1.15,aura:0.95},
        classification:'recovered-judgment',
        approvalStatus:'cody-approved',
        notes:'The inaugural title win and dominant Tito defense create an elite early-era Apex with explicit, formula-reconciling components.',
        provenance:'Cody-approved canonical Apex judgment batch one'
      }
    },
    {
      fighter:'Benson Henderson',
      classification:'recovered-judgment',
      correctionTypes:['recovered-judgment'],
      decision:'Keep Frankie Edgar I and Nate Diaz and make every judgment component explicit.',
      audit:{
        version:VERSION,
        window:'Frankie Edgar I (2012-02-26) + Nate Diaz (2012-12-08)',
        modelWindow:WINDOW,
        score:4.58,
        performances:[
          {fightId:'2012-02-26-frankie-edgar-i',label:'Frankie Edgar',date:'2012-02-26',rating:9.2},
          {fightId:'2012-12-08-nate-diaz',label:'Nate Diaz',date:'2012-12-08',rating:9.1}
        ],
        components:{twoPerformanceStrength:1.83,proof:1.35,bestFighterClaim:0.80,aura:0.60},
        classification:'recovered-judgment',
        approvalStatus:'cody-approved',
        notes:'A championship-winning peak with strong proof and separation, but below the highest all-time best-fighter and aura tier.',
        provenance:'Cody-approved canonical Apex judgment batch one'
      }
    },
    {
      fighter:'Fabricio Werdum',
      classification:'recovered-judgment',
      correctionTypes:['recovered-judgment'],
      decision:'Keep Mark Hunt and Cain Velasquez and make every judgment component explicit.',
      audit:{
        version:VERSION,
        window:'Mark Hunt (2014-11-15) + Cain Velasquez (2015-06-13)',
        modelWindow:WINDOW,
        score:5.17,
        performances:[
          {fightId:'2014-11-15-mark-hunt',label:'Mark Hunt',date:'2014-11-15',rating:8.9},
          {fightId:'2015-06-13-cain-velasquez',label:'Cain Velasquez',date:'2015-06-13',rating:9.8}
        ],
        components:{twoPerformanceStrength:1.87,proof:1.45,bestFighterClaim:1.00,aura:0.85},
        classification:'recovered-judgment',
        approvalStatus:'cody-approved',
        notes:'The Cain upset supplies elite proof and a real best-heavyweight claim, supported by the interim-title Hunt finish.',
        provenance:'Cody-approved canonical Apex judgment batch one'
      }
    }
  ];

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const byKey=new Map(rows.map(row=>[key(row.fighter),Object.freeze(row)]));
  window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS=Object.freeze({
    version:VERSION,
    rows:Object.freeze(rows.slice()),
    entryFor:fighter=>byKey.get(key(fighter))||null,
    fighterCount:rows.length,
    approvalStatus:'cody-approved',
    mutatesRankingData:false,
    mutatesScores:false
  });
})();
