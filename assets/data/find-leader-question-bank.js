(function(){
  'use strict';

  const VERSION='find-leader-question-bank-20260716d-twenty-challenges';
  const CANDIDATE_COUNT=10;
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  const CHAMPION_OPPONENT_STATUSES=new Set(['reigning-champion','interim-champion','former-champion']);

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
    },
    {
      id:'title-fight-finishes-since-2010',
      question:'Who has the most UFC title-fight finishes since 2010?',
      context:'Official UFC title-fight victories by knockout, submission, or doctor stoppage on or after January 1, 2010.',
      statLabel:'UFC title-fight finishes since 2010',
      shortLabel:'TITLE FINISHES',
      since:'2010-01-01',
      metric:'title-fight-finishes'
    },
    {
      id:'ufc-wins-since-2013',
      question:'Who has the most UFC wins since 2013?',
      context:'Counted UFC victories on or after January 1, 2013.',
      statLabel:'UFC wins since 2013',
      shortLabel:'UFC WINS',
      since:'2013-01-01',
      metric:'wins'
    },
    {
      id:'longest-ufc-winning-streak',
      question:'Who has the longest UFC winning streak?',
      context:'Longest run of consecutive counted UFC victories in the complete UFC fight ledger.',
      statLabel:'consecutive UFC wins',
      shortLabel:'WIN STREAK',
      since:'1993-11-12',
      metric:'longest-win-streak'
    },
    {
      id:'first-round-finishes-since-2015',
      question:'Who has the most first-round UFC finishes since 2015?',
      context:'Counted UFC wins by knockout, submission, or doctor stoppage in Round 1 on or after January 1, 2015.',
      statLabel:'first-round UFC finishes since 2015',
      shortLabel:'ROUND 1 FINISHES',
      since:'2015-01-01',
      metric:'first-round-finishes'
    },
    {
      id:'wins-over-ufc-champions',
      question:'Who has the most UFC wins over UFC champions?',
      context:'Counted UFC victories over opponents classified in the canonical ledger as reigning, interim, or former UFC champions.',
      statLabel:'UFC wins over UFC champions',
      shortLabel:'CHAMPION WINS',
      since:'1993-11-12',
      metric:'champion-wins'
    },
    {
      id:'ufc-wins-unfinished-since-2015',
      question:'Who has the most UFC wins since 2015 without being finished?',
      context:'Counted UFC victories on or after January 1, 2015, limited to fighters with no counted knockout, submission, or doctor-stoppage loss in that span.',
      statLabel:'UFC wins since 2015 without a finish loss',
      shortLabel:'UNFINISHED WINS',
      since:'2015-01-01',
      metric:'wins-unfinished'
    },
    {
      id:'ufc-wins-all-time',
      question:'Who has the most UFC wins of all time?',
      context:'Every counted UFC victory in the complete UFC fight ledger.',
      statLabel:'all-time UFC wins',
      shortLabel:'UFC WINS',
      since:'1993-11-12',
      metric:'wins'
    },
    {
      id:'ufc-finishes-all-time',
      question:'Who has the most UFC finishes of all time?',
      context:'Every counted UFC victory by knockout, submission, or doctor stoppage.',
      statLabel:'all-time UFC finishes',
      shortLabel:'FINISHES',
      since:'1993-11-12',
      metric:'finishes'
    },
    {
      id:'title-fight-wins-all-time',
      question:'Who has the most UFC title-fight wins of all time?',
      context:'Every official UFC title-fight victory in the complete UFC fight ledger.',
      statLabel:'all-time UFC title-fight wins',
      shortLabel:'TITLE WINS',
      since:'1993-11-12',
      metric:'title-fight-wins'
    },
    {
      id:'first-round-finishes-all-time',
      question:'Who has the most first-round UFC finishes of all time?',
      context:'Every counted UFC victory by knockout, submission, or doctor stoppage in Round 1.',
      statLabel:'all-time first-round UFC finishes',
      shortLabel:'ROUND 1 FINISHES',
      since:'1993-11-12',
      metric:'first-round-finishes'
    },
    {
      id:'decision-wins-all-time',
      question:'Who has the most UFC decision wins of all time?',
      context:'Every counted UFC victory recorded as a decision.',
      statLabel:'all-time UFC decision wins',
      shortLabel:'DECISION WINS',
      since:'1993-11-12',
      metric:'decision-wins'
    },
    {
      id:'five-round-scheduled-wins-all-time',
      question:'Who has the most UFC wins in fights scheduled for five rounds?',
      context:'Counted UFC victories in bouts officially scheduled for five rounds.',
      statLabel:'UFC wins in five-round scheduled fights',
      shortLabel:'FIVE-ROUND WINS',
      since:'1993-11-12',
      metric:'five-round-scheduled-wins'
    },
    {
      id:'ufc-wins-2005-2012',
      question:'Who had the most UFC wins from 2005 through 2012?',
      context:'Counted UFC victories from January 1, 2005 through December 31, 2012.',
      statLabel:'UFC wins from 2005 through 2012',
      shortLabel:'ERA WINS',
      since:'2005-01-01',
      through:'2012-12-31',
      metric:'wins'
    },
    {
      id:'ufc-wins-2013-2019',
      question:'Who had the most UFC wins from 2013 through 2019?',
      context:'Counted UFC victories from January 1, 2013 through December 31, 2019.',
      statLabel:'UFC wins from 2013 through 2019',
      shortLabel:'ERA WINS',
      since:'2013-01-01',
      through:'2019-12-31',
      metric:'wins'
    },
    {
      id:'ufc-wins-since-2022',
      question:'Who has the most UFC wins since 2022?',
      context:'Counted UFC victories on or after January 1, 2022.',
      statLabel:'UFC wins since 2022',
      shortLabel:'UFC WINS',
      since:'2022-01-01',
      metric:'wins'
    }
  ];

  const normal=value=>String(value||'').trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const round=value=>Math.round(Number(value)||0);
  const clone=value=>JSON.parse(JSON.stringify(value));
  const inWindow=(fight,definition)=>{
    if(!fight)return false;
    const date=String(fight.date||'');
    if(definition?.since&&date<definition.since)return false;
    if(definition?.through&&date>definition.through)return false;
    return true;
  };
  const isFinish=fight=>FINISH_METHODS.has(fight?.method?.category);

  function isTitleFight(fight){
    const types=window.UFC_CANONICAL_FIGHTER_FACTS?.rules?.championshipTypes||{};
    return Boolean(types?.[fight?.championshipContext?.type]?.officialTitleFight)&&fight?.championshipContext?.fighterEligible!==false;
  }

  function countsFight(fight,definition){
    if(!inWindow(fight,definition)||fight.scoringDisposition!=='count-win')return false;
    if(definition.metric==='wins')return true;
    if(definition.metric==='title-fight-wins')return isTitleFight(fight);
    if(definition.metric==='finishes')return isFinish(fight);
    if(definition.metric==='submissions')return fight?.method?.category==='submission';
    if(definition.metric==='knockouts')return fight?.method?.category==='ko-tko';
    if(definition.metric==='title-fight-finishes')return isTitleFight(fight)&&isFinish(fight);
    if(definition.metric==='first-round-finishes')return isFinish(fight)&&Number(fight?.method?.round)===1;
    if(definition.metric==='decision-wins')return fight?.method?.category==='decision';
    if(definition.metric==='five-round-scheduled-wins')return Number(fight?.scheduledRounds)===5;
    if(definition.metric==='champion-wins')return CHAMPION_OPPONENT_STATUSES.has(fight?.opponentContext?.championStatus);
    if(definition.metric==='wins-unfinished')return true;
    return false;
  }

  function longestWinningStreak(record,definition){
    let current=0;
    let longest=0;
    (Array.isArray(record?.fights)?record.fights:[]).forEach(fight=>{
      if(!inWindow(fight,definition))return;
      if(fight.scoringDisposition==='count-win'){
        current+=1;
        longest=Math.max(longest,current);
      }else current=0;
    });
    return longest;
  }

  function valueFor(record,definition){
    const fights=Array.isArray(record?.fights)?record.fights:[];
    if(definition.metric==='longest-win-streak')return longestWinningStreak(record,definition);
    if(definition.metric==='wins-unfinished'){
      const relevant=fights.filter(fight=>inWindow(fight,definition));
      const finishLoss=relevant.some(fight=>fight.scoringDisposition==='count-loss'&&isFinish(fight));
      return finishLoss?0:relevant.filter(fight=>fight.scoringDisposition==='count-win').length;
    }
    return fights.filter(fight=>countsFight(fight,definition)).length;
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
        through:definition.through||null,
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
      definitionCount:DEFINITIONS.length,
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
    definitionCount:DEFINITIONS.length,
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