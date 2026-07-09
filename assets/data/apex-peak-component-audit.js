// Apex Peak Component Audit Layer.
// Locked model: best two UFC wins within 24 months.
// Total = Two-Performance Strength + Proof + Best-Fighter Claim + Aura.
(function(){
  const VERSION='apex-peak-component-audit-20260709b-batch-one-24mo';
  const DATA=window.RANKING_DATA;
  if(!DATA) return;

  const RULES={
    window:'Best two UFC wins within 24 months',
    totalMax:6.00,
    performances:'Two selected UFC wins are rated individually as a data point; their average maps into the Two-Performance Strength component.',
    noContests:'No contests do not count as one of the two Apex performances.',
    losses:'Losses are not selected as Apex performances, but losses inside the window can cap Best-Fighter Claim or Aura.'
  };

  const RUBRIC={
    twoPerformanceStrength:{label:'Two-performance strength',max:2.00},
    proof:{label:'Proof',max:1.75},
    bestFighterClaim:{label:'Best-fighter claim',max:1.25},
    aura:{label:'Aura',max:1.00},
    total:{label:'Apex Peak bonus',max:6.00}
  };

  function round2(value){const n=Number(value||0);return Math.round((n+Number.EPSILON)*100)/100;}
  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function performanceAverage(performances){
    const ratings=(performances||[]).map(p=>Number(p.rating||0)).filter(n=>Number.isFinite(n));
    if(!ratings.length) return 0;
    return round2(ratings.reduce((sum,n)=>sum+n,0)/ratings.length);
  }
  function performanceStrength(performances){return round2((performanceAverage(performances)/10)*RUBRIC.twoPerformanceStrength.max);}
  function total(components){return round2(Object.values(components||{}).reduce((sum,value)=>sum+Number(value||0),0));}
  function entry(window,performances,scores,notes){
    const components={
      twoPerformanceStrength:performanceStrength(performances),
      proof:round2(scores.proof),
      bestFighterClaim:round2(scores.bestFighterClaim),
      aura:round2(scores.aura)
    };
    return {window,performances,performanceAverage:performanceAverage(performances),components,notes};
  }

  const componentOverrides={
    'Jon Jones':entry(
      'Shogun Rua 2011 + Lyoto Machida 2011',
      [
        {label:'Mauricio Rua',date:'2011-03-19',rating:10.0,note:'Title-winning destruction of the champion.'},
        {label:'Lyoto Machida',date:'2011-12-10',rating:10.0,note:'Elite former champion finished in a signature title defense.'}
      ],
      {proof:1.75,bestFighterClaim:1.25,aura:1.00},
      'Perfect Apex profile: two elite title wins, instant best-alive claim, and a frightening no-answer aura.'
    ),
    'Khabib Nurmagomedov':entry(
      'Dustin Poirier 2019 + Justin Gaethje 2020',
      [
        {label:'Dustin Poirier',date:'2019-09-07',rating:10.0,note:'Unified lightweight title proof against an elite interim champion.'},
        {label:'Justin Gaethje',date:'2020-10-24',rating:10.0,note:'Another elite interim champion erased with total grappling inevitability.'}
      ],
      {proof:1.75,bestFighterClaim:1.25,aura:1.00},
      'Perfect lightweight Apex: two elite title wins inside the deepest division context with maximum inevitability.'
    ),
    'Amanda Nunes':entry(
      'Ronda Rousey 2016 + Cris Cyborg 2018',
      [
        {label:'Ronda Rousey',date:'2016-12-30',rating:10.0,note:'Destroyed the original women’s UFC aura fighter.'},
        {label:'Cris Cyborg',date:'2018-12-29',rating:10.0,note:'Knocked out the most feared featherweight champion in under a minute.'}
      ],
      {proof:1.75,bestFighterClaim:1.20,aura:1.00},
      'Women’s UFC Apex benchmark. Two massive historical wins and violent separation; best-fighter claim is nearly maxed.'
    ),
    'Anderson Silva':entry(
      'Forrest Griffin 2009 + Vitor Belfort 2011',
      [
        {label:'Forrest Griffin',date:'2009-08-08',rating:10.0,note:'Moved up and embarrassed a former light heavyweight champion.'},
        {label:'Vitor Belfort',date:'2011-02-05',rating:10.0,note:'Front-kick knockout in a middleweight title fight.'}
      ],
      {proof:1.55,bestFighterClaim:1.25,aura:1.00},
      'Probably the loudest aura pair in UFC history. Proof is slightly below max only because one performance is up-division context rather than a middleweight title-defense pair.'
    ),
    'Georges St-Pierre':entry(
      'B.J. Penn II 2009 + Thiago Alves 2009',
      [
        {label:'B.J. Penn II',date:'2009-01-31',rating:9.6,note:'Overwhelmed an all-time lightweight great in a champion-vs-champion superfight.'},
        {label:'Thiago Alves',date:'2009-07-11',rating:9.2,note:'Dominant welterweight title defense against a dangerous top contender.'}
      ],
      {proof:1.65,bestFighterClaim:1.25,aura:0.78},
      'Elite complete-fighter Apex. The two wins are extremely strong, but the aura is more surgical control than mythic destruction.'
    ),
    'Conor McGregor':entry(
      'Jose Aldo 2015 + Eddie Alvarez 2016',
      [
        {label:'Jose Aldo',date:'2015-12-12',rating:10.0,note:'Thirteen-second knockout of the featherweight champion.'},
        {label:'Eddie Alvarez',date:'2016-11-12',rating:10.0,note:'Flawless two-division title performance against the lightweight champion.'}
      ],
      {proof:1.75,bestFighterClaim:1.05,aura:0.95},
      'One of the strongest two-performance Apex pairs ever. Diaz context caps the best-fighter claim, but the performances and aura are huge.'
    ),
    'Islam Makhachev':entry(
      'Charles Oliveira 2022 + Dustin Poirier 2024',
      [
        {label:'Charles Oliveira',date:'2022-10-22',rating:9.8,note:'Dominant title win over the hottest lightweight finisher in the world.'},
        {label:'Dustin Poirier',date:'2024-06-01',rating:9.4,note:'Elite title-defense proof against a proven lightweight great.'}
      ],
      {proof:1.70,bestFighterClaim:1.15,aura:0.86},
      'Modern lightweight Apex with elite proof and strong inevitability. Still a touch below the completed mythic Khabib/Jon tier.'
    ),
    'Alexander Volkanovski':entry(
      'Jose Aldo 2019 + Max Holloway I 2019',
      [
        {label:'Jose Aldo',date:'2019-05-11',rating:9.2,note:'Aldo win established elite featherweight title relevance.'},
        {label:'Max Holloway I',date:'2019-12-14',rating:9.5,note:'Title-winning proof against a dominant featherweight champion.'}
      ],
      {proof:1.55,bestFighterClaim:1.10,aura:0.82},
      'High-end modern featherweight Apex. Aldo plus Max gives real proof, though the scariest aura case is below the most destructive peaks.'
    ),
    'Demetrious Johnson':entry(
      'Kyoji Horiguchi 2015 + Henry Cejudo I 2016',
      [
        {label:'Kyoji Horiguchi',date:'2015-04-25',rating:9.3,note:'Late finish against a fast elite flyweight contender.'},
        {label:'Henry Cejudo I',date:'2016-04-23',rating:9.7,note:'Destroyed an Olympic-level challenger in one round.'}
      ],
      {proof:1.30,bestFighterClaim:1.15,aura:0.92},
      'Skill and separation were legendary. Flyweight opponent-proof discount keeps Proof below the deepest-division Apex leaders.'
    ),
    'Francis Ngannou':entry(
      'Stipe Miocic II 2021 + Ciryl Gane 2022',
      [
        {label:'Stipe Miocic II',date:'2021-03-27',rating:9.8,note:'Knocked out the best UFC heavyweight champion ever.'},
        {label:'Ciryl Gane',date:'2022-01-22',rating:8.7,note:'Showed evolved title-fight problem-solving against an unbeaten technician.'}
      ],
      {proof:1.45,bestFighterClaim:1.05,aura:0.98},
      'Terrifying heavyweight Apex. Stipe win is massive; Gane proof is strong but less dominant, keeping total below the mythic 6 group.'
    ),
    'Matt Hughes':entry(
      'Carlos Newton II 2002 + Frank Trigg II 2005',
      [
        {label:'Carlos Newton II',date:'2002-07-13',rating:7.3,note:'Strong title-level early welterweight proof.'},
        {label:'Frank Trigg II',date:'2005-04-16',rating:7.2,note:'Iconic comeback/submission title defense.'}
      ],
      {proof:0.85,bestFighterClaim:0.85,aura:0.65},
      'Calibration row from the original Apex discussion: best UFC welterweight claim before GSP separation, strong era aura, and early-WW context discount.'
    )
  };

  function findOverride(fighter){
    return componentOverrides[fighter] || Object.entries(componentOverrides).find(([name])=>key(name)===key(fighter))?.[1] || null;
  }

  function patchRow(row){
    if(!row?.fighter) return false;
    const override=findOverride(row.fighter);
    if(!override) return false;
    const score=total(override.components);
    row.apexPeak=score;
    row.apexPeakAudit={
      score,
      window:override.window,
      performances:override.performances,
      performanceAverage:override.performanceAverage,
      components:override.components,
      componentTotal:score,
      notes:override.notes,
      rubric:RUBRIC,
      rules:RULES,
      source:'Apex Peak locked 24-month two-performance model',
      version:VERSION
    };
    return true;
  }

  const patched=[];
  [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].forEach(row=>{if(patchRow(row))patched.push(row.fighter);});

  if(typeof DISPLAY_OVERRIDES!=='undefined'){
    Object.entries(componentOverrides).forEach(([fighter,override])=>{
      DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
      const score=total(override.components);
      DISPLAY_OVERRIDES[fighter].apexPeakAudit={
        score,
        window:override.window,
        performances:override.performances,
        performanceAverage:override.performanceAverage,
        components:override.components,
        componentTotal:score,
        notes:override.notes,
        rubric:RUBRIC,
        rules:RULES,
        version:VERSION
      };
    });
  }

  window.UFC_APEX_PEAK_COMPONENT_AUDIT={
    version:VERSION,
    rules:RULES,
    rubric:RUBRIC,
    componentOverrides,
    patched:[...new Set(patched)],
    batch:'batch-one-apex-leaders-plus-hughes-calibration',
    rule:'Apex Peak total must equal Two-Performance Strength + Proof + Best-Fighter Claim + Aura.',
    appliedAt:new Date().toISOString()
  };
})();
