(function(){
  'use strict';

  const VERSION='find-leader-question-bank-20260716b-elimination';
  const CANDIDATE_COUNT=10;
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);

  const DEFINITIONS=[
    {
      id:'title-fight-wins-since-2018',
      question:'Who has the most UFC title-fight wins since 2018?',
      context:'Official UFC title-fight victories on or after January 1, 2018.',
      statLabel:'UFC title-fight wins since 2018',
      shortLabel:'TITLE WINS',
      since:'2018-01-01',
      metric:'title-fight-wins'
    },
    {
      id:'ufc-wins-since-2020',
      question:'Who has the most UFC wins since 2020?',
      context:'Counted UFC victories on or after January 1, 2020.',
      statLabel:'UFC wins since 2020',
      shortLabel:'UFC WINS',
      since:'2020-01-01',
      metric:'wins'
    },
    {
      id:'ufc-finishes-since-2019',
      question:'Who has the most UFC finishes since 2019?',
      context:'Counted UFC wins by knockout, submission, or doctor stoppage on or after January 1, 2019.',
      statLabel:'UFC finishes since 2019',
      shortLabel:'FINISHES',
      since:'2019-01-01',
      metric:'finishes'
    },
    {
      id:'submission-wins-since-2015',
      question:'Who has the most UFC submission wins since 2015?',
      context:'Counted UFC submission victories on or after January 1, 2015.',
      statLabel:'UFC submission wins since 2015',
      shortLabel:'SUBMISSIONS',
      since:'2015-01-01',
      metric:'submissions'
    },
    {
      id:'ko-wins-since-2015',
      question:'Who has the most UFC knockout wins since 2015?',
      context:'Counted UFC KO/TKO victories on or after January 1, 2015.',
      statLabel:'UFC KO/TKO wins since 2015',
      shortLabel:'KNOCKOUTS',
      since:'2015-01-01',
      metric:'knockouts'
    }
  ];

  const normal=value=>String(value||'').trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const round=value=>Math.round(Number(value)||0);
  const clone=value=>JSON.parse(JSON.stringify(value));

  function isTitleFight(fight){
    const types=window.UFC_CANONICAL_FIGHTER_FACTS?.rules?.championshipTypes||{};
    return Boolean(types?.[fight?.championshipContext?.type]?.officialTitleFight)&&fight?.championshipContext?.fighterEligible!==false;
  }

  function countsFight(fight,definition){
    if(!fight||String(fight.date||'')<definition.since)return false;
    if(fight.scoringDisposition!=='count-win')return false;
    if(definition.metric==='wins')return true;
    if(definition.metric==='title-fight-wins')return isTitleFight(fight);
    if(definition.metric==='finishes')return FINISH_METHODS.has(fight?.method?.category);
    if(definition.metric==='submissions')return fight?.method?.category==='submission';
    if(definition.metric==='knockouts')return fight?.method?.category==='ko-tko';
    return false;
  }

  function valueFor(record,definition){
    return (Array.isArray(record?.fights)?record.fights:[]).filter(fight=>countsFight(fight,definition)).length;
  }

  function fighterSnapshot(record,value,index){
    const resolved=window.UFC_PLAY_DATA?.resolve?.(record?.fighter)||null;
    return {
      id:String(resolved?.id||normal(record?.fighter)||`fighter-${index+1}`),
      name:String(resolved?.name||record?.fighter||`Fighter ${index+1}`),
      gender:resolved?.gender==='women'||record?.board==='women'?'women':'men',
      primaryDivision:String(resolved?.primaryDivision||resolved?.divisions?.[0]||record?.identity?.primaryDivision||''),
      divisions:Array.isArray(resolved?.divisions)?resolved.divisions:[],
      thumbUrl:String(resolved?.thumbUrl||''),
      profileUrl:String(resolved?.profileUrl||''),
      value:round(value)
    };
  }

  function shuffle(rows,random=Math.random){
    const copy=[...rows];
    for(let index=copy.length-1;index>0;index-=1){
      const next=Math.floor(random()*(index+1));
      [copy[index],copy[next]]=[copy[next],copy[index]];
    }
    return copy;
  }

  function buildDefinition(definition,random=Math.random){
    const api=window.UFC_CANONICAL_FIGHTER_FACTS;
    if(!api?.list||api.count?.()<CANDIDATE_COUNT)return {valid:false,reason:'canonical-ledger-not-ready',definition};
    window.UFC_PLAY_DATA?.rebuild?.();
    const scored=api.list()
      .filter(record=>record?.coverage?.complete===true&&Array.isArray(record?.fights))
      .map((record,index)=>({record,value:valueFor(record,definition),index}))
      .sort((a,b)=>b.value-a.value||String(a.record?.fighter||'').localeCompare(String(b.record?.fighter||'')));
    if(scored.length<CANDIDATE_COUNT)return {valid:false,reason:'not-enough-complete-fighters',definition};
    const leaderValue=scored[0].value;
    const globalLeaders=scored.filter(row=>row.value===leaderValue);
    if(leaderValue<=0)return {valid:false,reason:'leader-value-not-positive',definition};
    if(globalLeaders.length!==1)return {valid:false,reason:`leader-tie-${globalLeaders.length}`,definition};
    const candidates=scored.slice(0,CANDIDATE_COUNT).map((row,index)=>fighterSnapshot(row.record,row.value,index));
    const ids=new Set(candidates.map(row=>row.id));
    if(ids.size!==CANDIDATE_COUNT)return {valid:false,reason:'duplicate-candidate-id',definition};
    const leaderName=String(globalLeaders[0].record?.fighter||'');
    const leader=candidates.find(row=>row.name===leaderName)||candidates.find(row=>row.id===normal(leaderName));
    if(!leader)return {valid:false,reason:'leader-missing-from-top-ten',definition};
    return {
      valid:true,
      setup:{
        bankVersion:VERSION,
        gameVersion:'find-leader-elimination-v1',
        questionId:definition.id,
        question:definition.question,
        context:definition.context,
        statLabel:definition.statLabel,
        shortLabel:definition.shortLabel,
        since:definition.since,
        candidateCount:CANDIDATE_COUNT,
        leaderId:leader.id,
        leaderValue,
        candidates:shuffle(candidates,random)
      }
    };
  }

  function audit(){
    const rows=DEFINITIONS.map(definition=>buildDefinition(definition,()=>0.5));
    return {
      version:VERSION,
      valid:rows.filter(row=>row.valid).map(row=>row.setup.questionId),
      excluded:rows.filter(row=>!row.valid).map(row=>({questionId:row.definition.id,reason:row.reason})),
      rows
    };
  }

  function available(){return audit().rows.filter(row=>row.valid).map(row=>clone(row.setup));}
  function create(questionId,random=Math.random){
    const definition=DEFINITIONS.find(row=>row.id===questionId);
    return definition?clone(buildDefinition(definition,random).setup||null):null;
  }
  function random(random=Math.random){
    const rows=DEFINITIONS.map(definition=>buildDefinition(definition,random)).filter(row=>row.valid);
    if(!rows.length)return null;
    return clone(rows[Math.floor(random()*rows.length)].setup);
  }

  window.UFC_FIND_LEADER_QUESTION_BANK={
    version:VERSION,
    candidateCount:CANDIDATE_COUNT,
    definitions:DEFINITIONS.map(clone),
    valueFor,
    buildDefinition,
    audit,
    available,
    create,
    random
  };
  document.documentElement.setAttribute('data-find-leader-question-bank',VERSION);
})();
