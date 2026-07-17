(function(){
  'use strict';

  const VERSION='find-leader-question-bank-20260717b-forty-four-record-book';
  const CANDIDATE_COUNT=10;
  const DECOY_POOL_SIZE=20;
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  const CHAMPION_OPPONENT_STATUSES=new Set(['reigning-champion','interim-champion','former-champion']);

  const define=(id,question,context,statLabel,shortLabel,since,metric,family,extra={})=>({
    id,question,context,statLabel,shortLabel,since,metric,family,...extra
  });
  const recordBook=(id,question,context,statLabel,shortLabel,metric)=>define(
    id,question,context,statLabel,shortLabel,null,metric,'record-book',
    {source:'official-record-book',recordBookMetric:metric}
  );

  const DEFINITIONS=[
    define('title-fight-wins-since-2018','Who has the most UFC title-fight wins since 2018?','Official UFC title-fight victories on or after January 1, 2018.','UFC title-fight wins since 2018','TITLE WINS','2018-01-01','title-fight-wins','championship'),
    define('ufc-wins-since-2020','Who has the most UFC wins since 2020?','Counted UFC victories on or after January 1, 2020.','UFC wins since 2020','UFC WINS','2020-01-01','wins','wins'),
    define('ufc-finishes-since-2019','Who has the most UFC finishes since 2019?','Counted UFC wins by knockout, submission, or doctor stoppage on or after January 1, 2019.','UFC finishes since 2019','FINISHES','2019-01-01','finishes','finishes'),
    define('submission-wins-since-2015','Who has the most UFC submission wins since 2015?','Counted UFC submission victories on or after January 1, 2015.','UFC submission wins since 2015','SUBMISSIONS','2015-01-01','submissions','finishes'),
    define('ko-wins-since-2015','Who has the most UFC knockout wins since 2015?','Counted UFC KO/TKO victories on or after January 1, 2015.','UFC KO/TKO wins since 2015','KNOCKOUTS','2015-01-01','knockouts','finishes'),
    define('title-fight-finishes-since-2010','Who has the most UFC title-fight finishes since 2010?','Official UFC title-fight victories by knockout, submission, or doctor stoppage on or after January 1, 2010.','UFC title-fight finishes since 2010','TITLE FINISHES','2010-01-01','title-fight-finishes','championship'),
    define('ufc-wins-since-2013','Who has the most UFC wins since 2013?','Counted UFC victories on or after January 1, 2013.','UFC wins since 2013','UFC WINS','2013-01-01','wins','wins'),
    define('longest-ufc-winning-streak','Who has the longest UFC winning streak?','Longest run of consecutive counted UFC victories in the complete UFC fight ledger.','consecutive UFC wins','WIN STREAK','1993-11-12','longest-win-streak','streaks'),
    define('first-round-finishes-since-2015','Who has the most first-round UFC finishes since 2015?','Counted UFC wins by knockout, submission, or doctor stoppage in Round 1 on or after January 1, 2015.','first-round UFC finishes since 2015','ROUND 1 FINISHES','2015-01-01','first-round-finishes','finishes'),
    define('wins-over-ufc-champions','Who has the most UFC wins over UFC champions?','Counted UFC victories over opponents classified in the canonical ledger as reigning, interim, or former UFC champions.','UFC wins over UFC champions','CHAMPION WINS','1993-11-12','champion-wins','quality'),
    define('ufc-wins-unfinished-since-2015','Who has the most UFC wins since 2015 without being finished?','Counted UFC victories on or after January 1, 2015, limited to fighters with no counted knockout, submission, or doctor-stoppage loss in that span.','UFC wins since 2015 without a finish loss','UNFINISHED WINS','2015-01-01','wins-unfinished','durability'),

    define('ufc-wins-all-time','Who has the most UFC wins of all time?','Every counted UFC victory in the complete UFC fight ledger.','all-time UFC wins','UFC WINS','1993-11-12','wins','wins'),
    define('ufc-finishes-all-time','Who has the most UFC finishes of all time?','Every counted UFC victory by knockout, submission, or doctor stoppage.','all-time UFC finishes','FINISHES','1993-11-12','finishes','finishes'),
    define('title-fight-wins-all-time','Who has the most UFC title-fight wins of all time?','Every official UFC title-fight victory in the complete UFC fight ledger.','all-time UFC title-fight wins','TITLE WINS','1993-11-12','title-fight-wins','championship'),
    define('first-round-finishes-all-time','Who has the most first-round UFC finishes of all time?','Every counted UFC victory by knockout, submission, or doctor stoppage in Round 1.','all-time first-round UFC finishes','ROUND 1 FINISHES','1993-11-12','first-round-finishes','finishes'),
    define('decision-wins-all-time','Who has the most UFC decision wins of all time?','Every counted UFC victory recorded as a decision.','all-time UFC decision wins','DECISION WINS','1993-11-12','decision-wins','wins'),
    define('five-round-scheduled-wins-all-time','Who has the most UFC wins in fights scheduled for five rounds?','Counted UFC victories in bouts officially scheduled for five rounds.','UFC wins in five-round scheduled fights','FIVE-ROUND WINS','1993-11-12','five-round-scheduled-wins','championship'),

    define('ufc-wins-2005-2012','Who had the most UFC wins from 2005 through 2012?','Counted UFC victories from January 1, 2005 through December 31, 2012.','UFC wins from 2005 through 2012','ERA WINS','2005-01-01','wins','era',{through:'2012-12-31'}),
    define('ufc-wins-2013-2019','Who had the most UFC wins from 2013 through 2019?','Counted UFC victories from January 1, 2013 through December 31, 2019.','UFC wins from 2013 through 2019','ERA WINS','2013-01-01','wins','era',{through:'2019-12-31'}),
    define('ufc-wins-since-2022','Who has the most UFC wins since 2022?','Counted UFC victories on or after January 1, 2022.','UFC wins since 2022','UFC WINS','2022-01-01','wins','wins'),

    define('ko-wins-all-time','Who has the most UFC knockout wins of all time?','Every counted UFC KO/TKO victory in the complete UFC fight ledger.','all-time UFC KO/TKO wins','KNOCKOUTS','1993-11-12','knockouts','finishes'),
    define('submission-wins-all-time','Who has the most UFC submission wins of all time?','Every counted UFC submission victory in the complete UFC fight ledger.','all-time UFC submission wins','SUBMISSIONS','1993-11-12','submissions','finishes'),
    define('ufc-wins-1993-2004','Who had the most UFC wins from 1993 through 2004?','Counted UFC victories from UFC 1 through December 31, 2004.','UFC wins from 1993 through 2004','ERA WINS','1993-11-12','wins','era',{through:'2004-12-31'}),
    define('ufc-finishes-1993-2004','Who had the most UFC finishes from 1993 through 2004?','Counted UFC knockout, submission, or doctor-stoppage victories from UFC 1 through December 31, 2004.','UFC finishes from 1993 through 2004','ERA FINISHES','1993-11-12','finishes','era',{through:'2004-12-31'}),
    define('ufc-finishes-2005-2012','Who had the most UFC finishes from 2005 through 2012?','Counted UFC knockout, submission, or doctor-stoppage victories from January 1, 2005 through December 31, 2012.','UFC finishes from 2005 through 2012','ERA FINISHES','2005-01-01','finishes','era',{through:'2012-12-31'}),
    define('ufc-finishes-2013-2019','Who had the most UFC finishes from 2013 through 2019?','Counted UFC knockout, submission, or doctor-stoppage victories from January 1, 2013 through December 31, 2019.','UFC finishes from 2013 through 2019','ERA FINISHES','2013-01-01','finishes','era',{through:'2019-12-31'}),
    define('ufc-finishes-2020-present','Who has the most UFC finishes from 2020 to the present?','Counted UFC knockout, submission, or doctor-stoppage victories on or after January 1, 2020.','UFC finishes from 2020 to present','ERA FINISHES','2020-01-01','finishes','era'),

    define('women-ufc-wins-all-time','Which woman has the most UFC wins of all time?','Women-only board using every counted UFC victory in the complete fight ledger.','women’s all-time UFC wins','WOMEN’S WINS','1993-11-12','wins','filtered',{scope:{board:'women',label:'Women only'}}),
    define('champions-ufc-wins-all-time','Which UFC champion has the most UFC wins of all time?','Champions-only board. A fighter qualifies by earning at least one official UFC title-fight victory.','UFC wins by a UFC champion','CHAMPION WINS','1993-11-12','wins','filtered',{scope:{championsOnly:true,label:'UFC champions only'}}),
    define('lightweight-ufc-wins-all-time','Who has the most UFC wins among primary lightweights?','Primary-lightweight board using every counted UFC victory, including UFC fights contested in other divisions.','UFC wins by a primary lightweight','LIGHTWEIGHT WINS','1993-11-12','wins','filtered',{scope:{primaryDivision:'Lightweight',label:'Primary lightweights'}}),
    define('heavyweight-ufc-finishes-all-time','Who has the most UFC finishes among primary heavyweights?','Primary-heavyweight board using every counted UFC knockout, submission, or doctor-stoppage victory.','UFC finishes by a primary heavyweight','HEAVYWEIGHT FINISHES','1993-11-12','finishes','filtered',{scope:{primaryDivision:'Heavyweight',label:'Primary heavyweights'}}),

    define('most-consecutive-ufc-finishes','Who has the longest streak of consecutive UFC finishes?','Longest sequence of UFC appearances won by knockout, submission, or doctor stoppage without another result interrupting the run.','consecutive UFC finishes','FINISH STREAK','1993-11-12','longest-finish-streak','streaks'),
    define('ufc-wins-before-first-loss','Who earned the most UFC wins before their first UFC loss?','Counted UFC victories accumulated before the fighter’s first counted UFC loss. Draws and no contests do not end the run.','UFC wins before first loss','PRE-LOSS WINS','1993-11-12','wins-before-first-loss','streaks'),
    define('longest-ufc-win-span','Who has the longest span between their first and most recent UFC win?','Calendar months between a fighter’s first and most recent counted UFC victory.','months between first and latest UFC win','WIN SPAN','1993-11-12','win-span-months','longevity',{minimumWins:2}),
    define('highest-ufc-finish-rate-15-wins','Who has the highest UFC finish percentage with at least 15 UFC wins?','Percentage of counted UFC wins earned by knockout, submission, or doctor stoppage. Minimum 15 UFC victories.','UFC finish percentage','FINISH RATE','1993-11-12','finish-rate-pct','rates',{minimumWins:15}),

    recordBook('record-book-total-fights','Who has the most total UFC fights?','Official UFC Record Book career table, updated July 12, 2026.','total UFC fights','TOTAL FIGHTS','total-fights'),
    recordBook('record-book-fight-night-bonuses','Who has earned the most UFC Fight Night bonuses?','Official UFC Record Book career bonus table, updated July 12, 2026.','UFC Fight Night bonuses','BONUSES','fight-night-bonuses'),
    recordBook('record-book-knockdowns-landed','Who has landed the most knockdowns in UFC history?','Official UFC Record Book career knockdown table, updated July 12, 2026.','UFC knockdowns landed','KNOCKDOWNS','knockdowns-landed'),
    recordBook('record-book-significant-strikes-landed','Who has landed the most significant strikes in UFC history?','Official UFC Record Book career striking table, updated July 12, 2026.','UFC significant strikes landed','SIG. STRIKES','significant-strikes-landed'),
    recordBook('record-book-total-strikes-landed','Who has landed the most total strikes in UFC history?','Official UFC Record Book career striking table, updated July 12, 2026.','UFC total strikes landed','TOTAL STRIKES','total-strikes-landed'),
    recordBook('record-book-takedowns-landed','Who has landed the most takedowns in UFC history?','Official UFC Record Book career grappling table, updated July 12, 2026.','UFC takedowns landed','TAKEDOWNS','takedowns-landed'),
    recordBook('record-book-submission-attempts','Who has attempted the most submissions in UFC history?','Official UFC Record Book career grappling table, updated July 12, 2026.','UFC submission attempts','SUB ATTEMPTS','submission-attempts'),
    recordBook('record-book-control-time','Who has recorded the most UFC control time?','Official UFC Record Book career control-time table, converted to rounded minutes and updated July 12, 2026.','minutes of UFC control time','CONTROL TIME','control-time-minutes'),
    recordBook('record-book-fight-time','Who has accumulated the most total UFC fight time?','Official UFC Record Book career fight-time table, converted to rounded minutes and updated July 12, 2026.','minutes of UFC fight time','FIGHT TIME','fight-time-minutes')
  ];

  const normal=value=>String(value||'').trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const round=value=>Math.round(Number(value)||0);
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const inWindow=(fight,definition)=>{
    if(!fight)return false;
    const date=String(fight.date||'');
    if(definition?.since&&date<definition.since)return false;
    if(definition?.through&&date>definition.through)return false;
    return true;
  };
  const isFinish=fight=>FINISH_METHODS.has(fight?.method?.category);
  const countedWin=fight=>fight?.scoringDisposition==='count-win';
  const countedLoss=fight=>fight?.scoringDisposition==='count-loss';
  const countedDraw=fight=>fight?.scoringDisposition==='count-draw';

  function isTitleFight(fight){
    const types=window.UFC_CANONICAL_FIGHTER_FACTS?.rules?.championshipTypes||{};
    return Boolean(types?.[fight?.championshipContext?.type]?.officialTitleFight)&&fight?.championshipContext?.fighterEligible!==false;
  }

  function hasUfcTitleWin(record){
    return (Array.isArray(record?.fights)?record.fights:[]).some(fight=>countedWin(fight)&&isTitleFight(fight));
  }

  function matchesScope(record,definition){
    const scope=definition?.scope||{};
    if(scope.board&&record?.board!==scope.board)return false;
    if(scope.primaryDivision&&normal(record?.identity?.primaryDivision)!==normal(scope.primaryDivision))return false;
    if(scope.championsOnly&&!hasUfcTitleWin(record))return false;
    return true;
  }

  function relevantFights(record,definition){
    return (Array.isArray(record?.fights)?record.fights:[]).filter(fight=>inWindow(fight,definition));
  }

  function countsFight(fight,definition){
    if(!inWindow(fight,definition)||!countedWin(fight))return false;
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
    relevantFights(record,definition).forEach(fight=>{
      if(countedWin(fight)){
        current+=1;
        longest=Math.max(longest,current);
      }else current=0;
    });
    return longest;
  }

  function longestFinishStreak(record,definition){
    let current=0;
    let longest=0;
    relevantFights(record,definition).forEach(fight=>{
      if(countedWin(fight)&&isFinish(fight)){
        current+=1;
        longest=Math.max(longest,current);
      }else current=0;
    });
    return longest;
  }

  function winsBeforeFirstLoss(record,definition){
    let wins=0;
    for(const fight of relevantFights(record,definition)){
      if(countedLoss(fight))break;
      if(countedWin(fight))wins+=1;
    }
    return wins;
  }

  function winSpanMonths(record,definition){
    const dates=relevantFights(record,definition).filter(countedWin).map(fight=>String(fight.date||'')).filter(Boolean).sort();
    if(dates.length<2)return 0;
    const first=Date.parse(`${dates[0]}T00:00:00Z`);
    const last=Date.parse(`${dates[dates.length-1]}T00:00:00Z`);
    if(!Number.isFinite(first)||!Number.isFinite(last)||last<=first)return 0;
    return Math.round((last-first)/(1000*60*60*24*30.4375));
  }

  function basicCounts(record,definition){
    const fights=relevantFights(record,definition);
    const wins=fights.filter(countedWin).length;
    const losses=fights.filter(countedLoss).length;
    const draws=fights.filter(countedDraw).length;
    const finishes=fights.filter(fight=>countedWin(fight)&&isFinish(fight)).length;
    return {fights,wins,losses,draws,finishes};
  }

  function valueFor(record,definition){
    const counts=basicCounts(record,definition);
    if(Number(definition?.minimumWins||0)>counts.wins)return null;
    if(Number(definition?.minimumFights||0)>(counts.wins+counts.losses+counts.draws))return null;
    if(definition.metric==='longest-win-streak')return longestWinningStreak(record,definition);
    if(definition.metric==='longest-finish-streak')return longestFinishStreak(record,definition);
    if(definition.metric==='wins-before-first-loss')return winsBeforeFirstLoss(record,definition);
    if(definition.metric==='win-span-months')return winSpanMonths(record,definition);
    if(definition.metric==='finish-rate-pct')return counts.wins?round((counts.finishes/counts.wins)*100):0;
    if(definition.metric==='wins-unfinished'){
      const finishLoss=counts.fights.some(fight=>countedLoss(fight)&&isFinish(fight));
      return finishLoss?0:counts.wins;
    }
    return counts.fights.filter(fight=>countsFight(fight,definition)).length;
  }

  function resolvedPlayFighter(names){
    const resolver=window.UFC_PLAY_DATA?.resolve;
    if(typeof resolver!=='function')return null;
    for(const name of names.filter(Boolean)){
      const resolved=resolver(name);
      if(resolved)return resolved;
    }
    return null;
  }

  function fighterSnapshot(record,value,index,statRank){
    const resolved=resolvedPlayFighter([record?.fighter]);
    return {
      id:String(resolved?.id||normal(record?.fighter)||`fighter-${index+1}`),
      name:String(resolved?.name||record?.fighter||`Fighter ${index+1}`),
      gender:resolved?.gender==='women'||record?.board==='women'?'women':'men',
      primaryDivision:String(resolved?.primaryDivision||resolved?.divisions?.[0]||record?.identity?.primaryDivision||''),
      divisions:Array.isArray(resolved?.divisions)?resolved.divisions:[],
      thumbUrl:String(resolved?.thumbUrl||''),
      profileUrl:String(resolved?.profileUrl||''),
      value:round(value),
      statRank:Number(statRank||index+1)
    };
  }

  function recordBookSnapshot(row,index,statRank){
    const names=[row?.appName,row?.name,...(Array.isArray(row?.aliases)?row.aliases:[])];
    const resolved=resolvedPlayFighter(names);
    const displayName=resolved?.name||row?.appName||row?.name||`Fighter ${index+1}`;
    const women=String(row?.primaryDivision||'').startsWith("Women's");
    return {
      id:String(resolved?.id||normal(displayName)||`record-book-${index+1}`),
      name:String(displayName),
      gender:resolved?.gender==='women'||women?'women':'men',
      primaryDivision:String(resolved?.primaryDivision||resolved?.divisions?.[0]||row?.primaryDivision||''),
      divisions:Array.isArray(resolved?.divisions)?resolved.divisions:[],
      thumbUrl:String(resolved?.thumbUrl||''),
      profileUrl:String(resolved?.profileUrl||''),
      value:round(row?.value),
      statRank:Number(statRank||index+1)
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

  function takeRandom(rows,count,random){
    return shuffle(rows,random).slice(0,Math.max(0,count));
  }

  function candidateRows(scored,random=Math.random){
    const positive=scored.filter(row=>row.value>0).slice(0,DECOY_POOL_SIZE);
    if(positive.length<CANDIDATE_COUNT)return null;
    const leader=positive[0];
    const topTenTier=positive.slice(1,10);
    const secondTenTier=positive.slice(10,DECOY_POOL_SIZE);
    const targetTopTenTotal=4+Math.floor(random()*3);
    const selected=[leader,...takeRandom(topTenTier,targetTopTenTotal-1,random)];
    const selectedIndexes=new Set(selected.map(row=>row.index));
    const lowerNeeded=CANDIDATE_COUNT-selected.length;
    takeRandom(secondTenTier,lowerNeeded,random).forEach(row=>{
      if(!selectedIndexes.has(row.index)){
        selected.push(row);
        selectedIndexes.add(row.index);
      }
    });
    if(selected.length<CANDIDATE_COUNT){
      takeRandom(positive.filter(row=>!selectedIndexes.has(row.index)),CANDIDATE_COUNT-selected.length,random).forEach(row=>{
        if(!selectedIndexes.has(row.index)){
          selected.push(row);
          selectedIndexes.add(row.index);
        }
      });
    }
    return selected.length===CANDIDATE_COUNT?selected:null;
  }

  function buildLedgerDefinition(definition,random=Math.random){
    const api=window.UFC_CANONICAL_FIGHTER_FACTS;
    if(!api?.list||api.count?.()<CANDIDATE_COUNT)return {valid:false,reason:'canonical-ledger-not-ready',definition};
    window.UFC_PLAY_DATA?.rebuild?.();
    const scored=api.list()
      .filter(record=>record?.coverage?.complete===true&&Array.isArray(record?.fights)&&matchesScope(record,definition))
      .map((record,index)=>({record,value:valueFor(record,definition),index}))
      .filter(row=>Number.isFinite(Number(row.value)))
      .sort((a,b)=>b.value-a.value||String(a.record?.fighter||'').localeCompare(String(b.record?.fighter||'')))
      .map((row,index)=>({...row,statRank:index+1}));
    if(scored.length<CANDIDATE_COUNT)return {valid:false,reason:'not-enough-eligible-fighters',definition};
    const leaderValue=scored[0].value;
    const globalLeaders=scored.filter(row=>row.value===leaderValue);
    if(leaderValue<=0)return {valid:false,reason:'leader-value-not-positive',definition};
    if(globalLeaders.length!==1)return {valid:false,reason:`leader-tie-${globalLeaders.length}`,definition};
    const selected=candidateRows(scored,random);
    if(!selected)return {valid:false,reason:'not-enough-positive-top-twenty-performers',definition};
    const candidates=selected.map((row,index)=>fighterSnapshot(row.record,row.value,index,row.statRank));
    const ids=new Set(candidates.map(row=>row.id));
    if(ids.size!==CANDIDATE_COUNT)return {valid:false,reason:'duplicate-candidate-id',definition};
    const leaderName=String(globalLeaders[0].record?.fighter||'');
    const leader=candidates.find(row=>normal(row.name)===normal(leaderName))||candidates.find(row=>row.id===normal(leaderName));
    if(!leader)return {valid:false,reason:'leader-missing-from-hard-board',definition};
    return {
      valid:true,
      setup:{
        bankVersion:VERSION,gameVersion:'find-leader-elimination-v1',sourceType:'canonical-ledger',
        questionId:definition.id,question:definition.question,context:definition.context,
        statLabel:definition.statLabel,shortLabel:definition.shortLabel,family:definition.family||'other',
        scope:clone(definition.scope||null),since:definition.since,through:definition.through||null,
        candidateCount:CANDIDATE_COUNT,decoyPoolSize:Math.min(DECOY_POOL_SIZE,scored.filter(row=>row.value>0).length),
        leaderId:leader.id,leaderValue,candidates:shuffle(candidates,random)
      }
    };
  }

  function buildRecordBookDefinition(definition,random=Math.random){
    const book=window.UFC_FIND_LEADER_RECORD_BOOK;
    const metric=book?.metrics?.[definition.recordBookMetric];
    const rows=Array.isArray(metric?.rows)?metric.rows:[];
    if(rows.length<CANDIDATE_COUNT)return {valid:false,reason:'record-book-metric-not-ready',definition};
    window.UFC_PLAY_DATA?.rebuild?.();
    const scored=rows
      .map((row,index)=>({row,value:Number(row?.value),index,statRank:index+1}))
      .filter(item=>Number.isFinite(item.value)&&item.value>0)
      .sort((a,b)=>b.value-a.value||String(a.row?.name||'').localeCompare(String(b.row?.name||'')))
      .map((item,index)=>({...item,statRank:index+1}));
    if(scored.length<CANDIDATE_COUNT)return {valid:false,reason:'record-book-not-enough-candidates',definition};
    const leaderValue=scored[0].value;
    const leaders=scored.filter(item=>item.value===leaderValue);
    if(leaders.length!==1)return {valid:false,reason:`record-book-leader-tie-${leaders.length}`,definition};
    const leader=leaders[0];
    const decoys=takeRandom(scored.filter(item=>item!==leader),CANDIDATE_COUNT-1,random);
    const selected=[leader,...decoys];
    if(selected.length!==CANDIDATE_COUNT)return {valid:false,reason:'record-book-board-incomplete',definition};
    const candidates=selected.map((item,index)=>recordBookSnapshot(item.row,index,item.statRank));
    const ids=new Set(candidates.map(row=>row.id));
    if(ids.size!==CANDIDATE_COUNT)return {valid:false,reason:'record-book-duplicate-candidate-id',definition};
    const leaderSnapshot=candidates[0];
    return {
      valid:true,
      setup:{
        bankVersion:VERSION,gameVersion:'find-leader-elimination-v1',sourceType:'official-record-book',
        source:clone(book.source),questionId:definition.id,question:definition.question,context:definition.context,
        statLabel:definition.statLabel,shortLabel:definition.shortLabel,family:definition.family,
        scope:null,since:null,through:null,candidateCount:CANDIDATE_COUNT,decoyPoolSize:scored.length,
        leaderId:leaderSnapshot.id,leaderValue,candidates:shuffle(candidates,random)
      }
    };
  }

  function buildDefinition(definition,random=Math.random){
    return definition?.source==='official-record-book'
      ?buildRecordBookDefinition(definition,random)
      :buildLedgerDefinition(definition,random);
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
    version:VERSION,candidateCount:CANDIDATE_COUNT,decoyPoolSize:DECOY_POOL_SIZE,
    definitionCount:DEFINITIONS.length,definitions:DEFINITIONS.map(clone),
    valueFor,buildDefinition,audit,available,create,random
  };
  document.documentElement.setAttribute('data-find-leader-question-bank',VERSION);
})();