(function(){
  'use strict';

  const VERSION='blind-rank-polish-20260716i-simulation-audit';
  const PACK_KEY='ufc-goat-blind-rank-pack-v2';
  const GAME_KEY='ufc-goat-blind-rank-v1';
  const HISTORY_KEY='ufc-goat-blind-rank-history-v1';
  const MAX_RECENT_REVEALS=15;
  const RELAX_WINDOWS=[15,10,5,0];
  const MIN_SIMULATIONS=1;
  const MAX_SIMULATIONS=100000;
  const DEFAULT_SIMULATIONS=10000;
  const STRIKERS=[
    'Anderson Silva','Israel Adesanya','Alex Pereira','Conor McGregor','Max Holloway','Jose Aldo','Ilia Topuria','Stephen Thompson','Edson Barboza','Anthony Pettis','Joanna Jedrzejczyk','Valentina Shevchenko','Zhang Weili','Dustin Poirier','Justin Gaethje','Chuck Liddell','Lyoto Machida','Robbie Lawler','Sean O’Malley','Michel Pereira','Darren Till','Kevin Holland','Holly Holm','Donald Cerrone','Chan Sung Jung','Cub Swanson','Derrick Lewis','Francis Ngannou','Mike Perry','Tai Tuivasa','Paulo Costa'
  ];
  const GRAPPLERS=[
    'Khabib Nurmagomedov','Islam Makhachev','Georges St-Pierre','Jon Jones','Demetrious Johnson','Charles Oliveira','B.J. Penn','Matt Hughes','Randy Couture','Daniel Cormier','Henry Cejudo','Dominick Cruz','Aljamain Sterling','Merab Dvalishvili','Kamaru Usman','Cain Velasquez','Royce Gracie','Frank Shamrock','Ken Shamrock','Mark Coleman','Urijah Faber','Colby Covington','Yoel Romero','Tony Ferguson','Diego Sanchez','Clay Guida','Khamzat Chimaev','Alexandre Pantoja','Mackenzie Dern','Kayla Harrison','Julianna Peña','Carla Esparza','Ronda Rousey'
  ];
  const PACKS=[
    {id:'ufc-careers',name:'UFC Careers',prompt:'Rank their UFC careers',intro:'You see one fighter at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men'},scoreMode:'overall-rank',rankingSource:'Men’s UFC GOAT board'},
    {id:'all-careers',name:'All UFC Careers',prompt:'Rank their UFC careers',intro:'You see one fighter at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{},scoreMode:'overall-score',rankingSource:'Calculated UFC GOAT score across both boards'},
    {id:'womens-careers',name:'Women’s UFC Careers',prompt:'Rank their UFC careers',intro:'You see one fighter at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'women'},scoreMode:'women-rank',rankingSource:'Women’s UFC GOAT board'},
    {id:'lightweight',name:'Lightweight Careers',prompt:'Rank their UFC careers',intro:'You see one lightweight at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men',division:'Lightweight'},scoreMode:'division',division:'Lightweight',rankingSource:'Calculated Lightweight résumé board'},
    {id:'welterweight',name:'Welterweight Careers',prompt:'Rank their UFC careers',intro:'You see one welterweight at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men',division:'Welterweight'},scoreMode:'division',division:'Welterweight',rankingSource:'Calculated Welterweight résumé board'},
    {id:'heavyweight',name:'Heavyweight Careers',prompt:'Rank their UFC careers',intro:'You see one heavyweight at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men',division:'Heavyweight'},scoreMode:'division',division:'Heavyweight',rankingSource:'Calculated Heavyweight résumé board'},
    {id:'striking',name:'Striking',prompt:'Rank their striking',intro:'You see one fighter at a time. Rank only their UFC striking from #1 to #5 before the next reveal.',names:STRIKERS,scoreMode:'curated',order:STRIKERS,rankingSource:'Curated UFC striking order'},
    {id:'wrestling-grappling',name:'Wrestling & Grappling',prompt:'Rank their wrestling and grappling',intro:'You see one fighter at a time. Rank their UFC wrestling and grappling from #1 to #5 before the next reveal.',names:GRAPPLERS,scoreMode:'curated',order:GRAPPLERS,rankingSource:'Curated UFC wrestling and grappling order'},
    {id:'early-ufc',name:'Early UFC Careers',prompt:'Rank their UFC careers',intro:'You see one early-era fighter at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men'},eras:['tournament','survival','zuffa-rebuild'],scoreMode:'overall-score',rankingSource:'Calculated UFC GOAT score inside the early-era pool'}
  ];
  const ALIASES={'men-chaos':'ufc-careers','all-chaos':'all-careers','women-chaos':'womens-careers'};
  const BUCKET_CONFIG=[
    {id:'elite',weight:0.15,cutoff:0.15},
    {id:'great',weight:0.20,cutoff:0.35},
    {id:'good',weight:0.25,cutoff:0.60},
    {id:'average',weight:0.20,cutoff:0.80},
    {id:'below-average',weight:0.15,cutoff:0.95},
    {id:'bad',weight:0.05,cutoff:1}
  ];
  const BUCKET_ORDER=BUCKET_CONFIG.map(bucket=>bucket.id);
  const LINEUP_TEMPLATES=[
    {id:'balanced',name:'Balanced',weight:0.65,targets:()=>['elite','great','good','average',weightedChoice([
      ['great',0.15],['good',0.35],['average',0.30],['below-average',0.15],['bad',0.05]
    ])]},
    {id:'stacked',name:'Stacked',weight:0.25,targets:()=>['elite','great','good','good','average']},
    {id:'chaos',name:'Chaos',weight:0.10,targets:()=>['great','good','average','below-average','bad']}
  ];
  const LEGACY_TIER_SCORE={legend:5000,elite:4000,contender:3000,recognizable:2000,wildcard:1000};
  let patching=false;
  let historyState=loadHistory();

  function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function api(){return window.UFC_BLIND_RANK;}
  function data(){return window.UFC_PLAY_DATA;}
  function packFor(id){const key=ALIASES[id]||id;return PACKS.find(pack=>pack.id===key)||PACKS[0];}
  function savedPack(){try{return packFor(localStorage.getItem(PACK_KEY)||api()?.state?.packId).id;}catch(_error){return packFor(api()?.state?.packId).id;}}
  function shuffle(items){const copy=[...items];for(let index=copy.length-1;index>0;index-=1){const swap=Math.floor(Math.random()*(index+1));[copy[index],copy[swap]]=[copy[swap],copy[index]];}return copy;}
  function finite(value){return value!==null&&value!==''&&Number.isFinite(Number(value));}
  function round(value,digits=2){const factor=10**digits;return Math.round((Number(value)||0)*factor)/factor;}
  function percent(value,total,digits=2){return total?round((value/total)*100,digits):0;}
  function weightedChoice(rows){let roll=Math.random();for(const [value,weight] of rows){roll-=weight;if(roll<=0)return value;}return rows.at(-1)?.[0]||null;}
  function chooseTemplate(){const id=weightedChoice(LINEUP_TEMPLATES.map(template=>[template.id,template.weight]));return LINEUP_TEMPLATES.find(template=>template.id===id)||LINEUP_TEMPLATES[0];}
  function fighterIds(values){return (values||[]).map(value=>typeof value==='string'?value:value?.id).filter(Boolean);}
  function lineupSignature(values){return fighterIds(values).slice().sort().join('|');}
  function increment(object,key,amount=1){object[key]=(object[key]||0)+amount;}

  function loadHistory(){
    try{
      const parsed=JSON.parse(localStorage.getItem(HISTORY_KEY)||'null');
      return parsed&&typeof parsed==='object'&&parsed.packs&&typeof parsed.packs==='object'?parsed:{version:1,packs:{}};
    }catch(_error){return {version:1,packs:{}};}
  }

  function saveHistory(){
    try{localStorage.setItem(HISTORY_KEY,JSON.stringify(historyState));}catch(_error){}
  }

  function packHistory(packId){
    const id=packFor(packId).id;
    const current=historyState.packs[id]||{};
    const record={
      recent:Array.isArray(current.recent)?current.recent.filter(Boolean).slice(-MAX_RECENT_REVEALS):[],
      lastLineup:Array.isArray(current.lastLineup)?current.lastLineup.filter(Boolean).slice(0,5):[],
      session:current.session&&typeof current.session==='object'?{
        signature:String(current.session.signature||''),
        revealedIndexes:Array.isArray(current.session.revealedIndexes)?current.session.revealedIndexes.map(Number).filter(index=>Number.isInteger(index)&&index>=0&&index<5):[]
      }:null
    };
    historyState.packs[id]=record;
    return record;
  }

  function clearHistory(packId){
    if(packId)delete historyState.packs[packFor(packId).id];
    else historyState={version:1,packs:{}};
    saveHistory();
    return packId?historySnapshot(packId):{cleared:true};
  }

  function historySnapshot(packId){
    const record=packHistory(packId);
    return {
      packId:packFor(packId).id,
      recent:record.recent.slice(),
      recentCount:record.recent.length,
      lastLineup:record.lastLineup.slice(),
      activeSession:record.session?{signature:record.session.signature,revealedIndexes:record.session.revealedIndexes.slice()}:null
    };
  }

  function beginHistorySession(packId,fighters){
    const record=packHistory(packId);
    const ids=fighterIds(fighters);
    record.lastLineup=ids.slice(0,5);
    record.session={signature:lineupSignature(ids),revealedIndexes:[]};
    saveHistory();
    syncCurrentReveal();
  }

  function syncCurrentReveal(){
    const game=api();
    const state=game?.state;
    if(!state||state.shared||!Array.isArray(state.lineup)||!state.lineup.length)return;
    const packId=packFor(state.packId).id;
    const ids=fighterIds(state.lineup);
    const signature=lineupSignature(ids);
    const record=packHistory(packId);
    let dirty=false;
    if(!record.session||record.session.signature!==signature){
      record.session={signature,revealedIndexes:[]};
      record.lastLineup=ids.slice(0,5);
      dirty=true;
    }
    const highest=Math.min(Math.max(Number(state.currentIndex)||0,0),ids.length-1);
    for(let index=0;index<=highest;index+=1){
      if(record.session.revealedIndexes.includes(index))continue;
      record.session.revealedIndexes.push(index);
      record.recent.push(ids[index]);
      record.recent=record.recent.slice(-MAX_RECENT_REVEALS);
      dirty=true;
    }
    if(dirty)saveHistory();
  }

  function legacyRankingScore(fighter){
    const rank=Number(fighter?.modelRank);
    if(Number.isFinite(rank))return 100000-(rank*100)+(Number(fighter?.modelScore)||0);
    return (LEGACY_TIER_SCORE[fighter?.selectionTier]||0)+(Number(fighter?.modelScore)||0);
  }

  function overallScore(fighter){
    if(finite(fighter?.modelScore))return 100000+(Number(fighter.modelScore)*100)-(finite(fighter?.modelRank)?Number(fighter.modelRank)/100:0);
    return (LEGACY_TIER_SCORE[fighter?.selectionTier]||0)+(Number(fighter?.modelScore)||0);
  }

  function divisionBoard(pack){
    const rankingApi=window.UFC_DIVISION_RANKINGS||window.UFC_DIVISION_RANKING_PIPELINE;
    let rows=[];
    try{rows=rankingApi?.boardFor?.(pack.division)||[];}catch(_error){rows=[];}
    if(!rows.length)rows=window.UFC_DIVISION_RANKING_REPORT?.boards?.[pack.division]||[];
    return rows.filter(row=>row?.fighter&&finite(row?.divisionScore)&&row?.rankEligible!==false);
  }

  function rankingContext(pack){
    const source=data();
    if(pack.scoreMode==='curated'){
      const orderById=new Map();
      (pack.order||[]).forEach((name,index)=>{const fighter=source?.resolve?.(name);if(fighter&&!orderById.has(fighter.id))orderById.set(fighter.id,index);});
      return {mode:'curated',ready:orderById.size>=5,orderById};
    }
    if(pack.scoreMode==='division'){
      const board=divisionBoard(pack);
      const divisionById=new Map();
      board.forEach(row=>{const fighter=source?.resolve?.(row.fighter);if(fighter)divisionById.set(fighter.id,row);});
      return {mode:'division',ready:divisionById.size>=5,board,divisionById};
    }
    return {mode:pack.scoreMode||'overall-rank',ready:true};
  }

  function scoreForPack(pack,fighter,context=rankingContext(pack)){
    if(context.mode==='curated'){
      const index=context.orderById.get(fighter.id);
      return Number.isInteger(index)?1000000-(index*1000):-Infinity;
    }
    if(context.mode==='division'){
      const row=context.divisionById.get(fighter.id);
      return row?(Number(row.divisionScore)*1000)+(1000-(Number(row.rank)||999)):-Infinity;
    }
    if(context.mode==='overall-score')return overallScore(fighter);
    return legacyRankingScore(fighter);
  }

  function bucketedPool(pack,rows,context=rankingContext(pack)){
    const ranked=[...(rows||[])].sort((a,b)=>scoreForPack(pack,b,context)-scoreForPack(pack,a,context)||a.name.localeCompare(b.name));
    const buckets=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,[]]));
    const bucketById={};
    ranked.forEach((fighter,index)=>{
      const percentile=(index+0.5)/ranked.length;
      const bucket=BUCKET_CONFIG.find(row=>percentile<=row.cutoff)?.id||'bad';
      buckets[bucket].push(fighter);
      bucketById[fighter.id]=bucket;
    });
    const counts=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,buckets[bucket].length]));
    const percentages=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,ranked.length?round((buckets[bucket].length/ranked.length)*100,1):0]));
    return {ranked,buckets,bucketById,counts,percentages};
  }

  function nearestAvailableBucket(target,working){
    const targetIndex=BUCKET_ORDER.indexOf(target);
    return BUCKET_ORDER
      .map((bucket,index)=>({bucket,distance:Math.abs(index-targetIndex)}))
      .sort((a,b)=>a.distance-b.distance||BUCKET_ORDER.indexOf(a.bucket)-BUCKET_ORDER.indexOf(b.bucket))
      .map(row=>row.bucket)
      .find(bucket=>working[bucket]?.length);
  }

  function pool(pack,context=rankingContext(pack)){
    const source=data();
    if(!source||!context.ready)return[];
    let rows=source.poolFor('blind-rank',pack.filters||{});
    if(pack.names){const ids=new Set(pack.names.map(name=>source.resolve(name)?.id).filter(Boolean));rows=rows.filter(row=>ids.has(row.id));}
    if(pack.eras)rows=rows.filter(row=>row.eras?.some(era=>pack.eras.includes(era)));
    if(context.mode==='curated')rows=rows.filter(row=>context.orderById.has(row.id));
    if(context.mode==='division')rows=rows.filter(row=>context.divisionById.has(row.id));
    return rows;
  }

  function buildCandidate(rows,audit,excluded,template=chooseTemplate()){
    const working=Object.fromEntries(BUCKET_ORDER.map(bucket=>[
      bucket,
      shuffle(audit.buckets[bucket].filter(fighter=>!excluded.has(fighter.id)))
    ]));
    const targets=template.targets();
    const picked=[];
    const actual=[];

    targets.forEach(target=>{
      const source=working[target]?.length?target:nearestAvailableBucket(target,working);
      const fighter=source?working[source].pop():null;
      if(!fighter)return;
      picked.push(fighter);
      actual.push(source);
    });

    if(picked.length<5){
      const used=new Set(picked.map(fighter=>fighter.id));
      shuffle(rows.filter(fighter=>!excluded.has(fighter.id)&&!used.has(fighter.id))).slice(0,5-picked.length).forEach(fighter=>{
        picked.push(fighter);
        actual.push('fallback');
      });
    }
    return picked.length===5?{fighters:shuffle(picked),template,targets,actual}:null;
  }

  function generateLineup(pack,history,prepared={}){
    const context=prepared.context||rankingContext(pack);
    const rows=prepared.rows||pool(pack,context);
    if(rows.length<5)return {fighters:[],meta:{packId:pack.id,broken:true,reason:'pool-under-five',poolSize:rows.length}};
    const audit=prepared.audit||bucketedPool(pack,rows,context);
    const previousSignature=lineupSignature(history?.lastLineup);
    const template=chooseTemplate();
    let selected=null;
    let usedWindow=0;
    let attempts=0;
    let blockedImmediateRepeat=false;

    for(const windowSize of RELAX_WINDOWS){
      const excluded=new Set(windowSize?(history?.recent||[]).slice(-windowSize):[]);
      if(rows.length-excluded.size<5)continue;
      const attemptLimit=windowSize===0?48:20;
      for(let attempt=0;attempt<attemptLimit;attempt+=1){
        attempts+=1;
        const candidate=buildCandidate(rows,audit,excluded,template);
        if(!candidate)continue;
        const signature=lineupSignature(candidate.fighters);
        if(previousSignature&&signature===previousSignature){blockedImmediateRepeat=true;continue;}
        selected=candidate;
        usedWindow=windowSize;
        break;
      }
      if(selected)break;
    }

    if(!selected){
      selected=buildCandidate(rows,audit,new Set(),template);
      usedWindow=0;
    }
    if(!selected)return {fighters:[],meta:{packId:pack.id,broken:true,reason:'candidate-build-failed',poolSize:rows.length}};

    if(previousSignature&&lineupSignature(selected.fighters)===previousSignature){
      const previousIds=new Set(history?.lastLineup||[]);
      const selectedIds=new Set(selected.fighters.map(fighter=>fighter.id));
      const replacement=rows.find(fighter=>!previousIds.has(fighter.id)&&!selectedIds.has(fighter.id));
      if(replacement){
        selected.fighters[selected.fighters.length-1]=replacement;
        selected.actual[selected.actual.length-1]='repeat-break';
        selected.fighters=shuffle(selected.fighters);
        blockedImmediateRepeat=true;
      }
    }

    const fighterBuckets=selected.fighters.map(fighter=>audit.bucketById[fighter.id]||'unknown');
    return {
      fighters:selected.fighters,
      meta:{
        packId:pack.id,
        scoreMode:pack.scoreMode,
        rankingSource:pack.rankingSource,
        lineupType:selected.template.id,
        lineupTypeName:selected.template.name,
        poolSize:rows.length,
        counts:audit.counts,
        percentages:audit.percentages,
        targets:selected.targets,
        actual:selected.actual,
        fighterBuckets,
        repeatProtection:{
          configuredWindow:MAX_RECENT_REVEALS,
          usedWindow,
          relaxed:usedWindow<MAX_RECENT_REVEALS,
          recentCount:(history?.recent||[]).length,
          excludedCount:usedWindow?new Set((history?.recent||[]).slice(-usedWindow)).size:0,
          immediateRepeatBlocked:blockedImmediateRepeat,
          attempts
        }
      }
    };
  }

  function lineup(pack){
    const generated=generateLineup(pack,packHistory(pack.id));
    const game=api();
    if(game)game.state.bucketAudit=generated.meta;
    return generated.fighters;
  }

  function auditPack(packId){
    const pack=packFor(packId);
    const context=rankingContext(pack);
    const rows=pool(pack,context);
    const audit=bucketedPool(pack,rows,context);
    const history=historySnapshot(pack.id);
    const rankRows=values=>values.map(fighter=>({id:fighter.id,name:fighter.name,score:round(scoreForPack(pack,fighter,context),2),bucket:audit.bucketById[fighter.id]}));
    const issues=[];
    if(!context.ready)issues.push('ranking-source-not-ready');
    if(rows.length<5)issues.push('pool-under-five');
    else if(rows.length<15)issues.push('pool-under-recommended-minimum');
    else if(rows.length<24)issues.push('limited-repeat-protection');
    return {
      packId:pack.id,
      scoreMode:pack.scoreMode,
      rankingSource:pack.rankingSource,
      ready:context.ready&&rows.length>=5,
      status:issues.length?'warning':'ready',
      issues,
      poolSize:rows.length,
      poolGuidance:{minimum:5,recommended:24,ideal:'30-40'},
      counts:audit.counts,
      percentages:audit.percentages,
      lineupTemplates:LINEUP_TEMPLATES.map(template=>({id:template.id,name:template.name,weight:template.weight})),
      repeatProtection:{maxRecentReveals:MAX_RECENT_REVEALS,relaxWindows:RELAX_WINDOWS.slice(),...history},
      topFive:rankRows(audit.ranked.slice(0,5)),
      bottomFive:rankRows(audit.ranked.slice(-5))
    };
  }

  function simulationCount(value){
    const parsed=Math.floor(Number(value)||DEFAULT_SIMULATIONS);
    return Math.max(MIN_SIMULATIONS,Math.min(MAX_SIMULATIONS,parsed));
  }

  function simulate(packId,gameCount=DEFAULT_SIMULATIONS){
    const pack=packFor(packId);
    const gamesRequested=simulationCount(gameCount);
    const context=rankingContext(pack);
    const rows=pool(pack,context);
    const audit=bucketedPool(pack,rows,context);
    const startedAt=Date.now();
    const templateCounts={};
    const targetBucketCounts={};
    const actualBucketCounts={};
    const fighterCounts={};
    const relaxationCounts={};
    const signatureCounts={};
    const simulatedHistory={recent:[],lastLineup:[],session:null};
    let completedGames=0;
    let brokenGames=0;
    let duplicateFighterGames=0;
    let immediateDuplicateLineups=0;
    let repeatedLineupSets=0;
    let nearestBucketSelections=0;
    let rawFallbackSelections=0;
    let repeatBreakSelections=0;
    let immediateRepeatBlocks=0;
    let previousSignature='';

    if(!context.ready||rows.length<5){
      return {
        version:VERSION,
        packId:pack.id,
        status:'blocked',
        passed:false,
        reason:!context.ready?'ranking-source-not-ready':'pool-under-five',
        gamesRequested,
        gamesCompleted:0,
        poolSize:rows.length,
        durationMs:Date.now()-startedAt
      };
    }

    const prepared={context,rows,audit};
    for(let gameIndex=0;gameIndex<gamesRequested;gameIndex+=1){
      const generated=generateLineup(pack,simulatedHistory,prepared);
      const fighters=generated.fighters||[];
      const meta=generated.meta||{};
      if(fighters.length!==5){brokenGames+=1;continue;}
      completedGames+=1;
      const ids=fighterIds(fighters);
      const signature=lineupSignature(ids);
      if(new Set(ids).size!==5)duplicateFighterGames+=1;
      if(previousSignature&&signature===previousSignature)immediateDuplicateLineups+=1;
      if(signatureCounts[signature])repeatedLineupSets+=1;
      increment(signatureCounts,signature);
      previousSignature=signature;
      increment(templateCounts,meta.lineupType||'unknown');
      increment(relaxationCounts,String(meta.repeatProtection?.usedWindow??'unknown'));
      if(meta.repeatProtection?.immediateRepeatBlocked)immediateRepeatBlocks+=1;

      (meta.targets||[]).forEach(target=>increment(targetBucketCounts,target));
      (meta.actual||[]).forEach((actual,index)=>{
        if(actual==='fallback')rawFallbackSelections+=1;
        else if(actual==='repeat-break')repeatBreakSelections+=1;
        else if(actual!==(meta.targets||[])[index])nearestBucketSelections+=1;
      });
      fighters.forEach(fighter=>{
        increment(fighterCounts,fighter.id);
        increment(actualBucketCounts,audit.bucketById[fighter.id]||'unknown');
      });

      simulatedHistory.lastLineup=ids.slice();
      simulatedHistory.recent.push(...ids);
      simulatedHistory.recent=simulatedHistory.recent.slice(-MAX_RECENT_REVEALS);
    }

    const totalSelections=completedGames*5;
    const templateRates=Object.fromEntries(LINEUP_TEMPLATES.map(template=>[
      template.id,
      {targetPct:round(template.weight*100,2),games:templateCounts[template.id]||0,actualPct:percent(templateCounts[template.id]||0,completedGames,2),deviationPts:round(percent(templateCounts[template.id]||0,completedGames,2)-(template.weight*100),2)}
    ]));
    const bucketRates=Object.fromEntries(BUCKET_ORDER.map(bucket=>[
      bucket,
      {poolCount:audit.counts[bucket]||0,poolPct:audit.percentages[bucket]||0,selections:actualBucketCounts[bucket]||0,selectionPct:percent(actualBucketCounts[bucket]||0,totalSelections,2),targetSelections:targetBucketCounts[bucket]||0,targetPct:percent(targetBucketCounts[bucket]||0,totalSelections,2)}
    ]));
    const fighterAppearanceRates=rows.map(fighter=>{
      const bucket=audit.bucketById[fighter.id]||'unknown';
      const bucketSize=audit.counts[bucket]||1;
      const bucketSelections=actualBucketCounts[bucket]||0;
      const bucketAverage=bucketSelections/bucketSize;
      const appearances=fighterCounts[fighter.id]||0;
      return {
        id:fighter.id,
        name:fighter.name,
        bucket,
        appearances,
        appearanceRatePct:percent(appearances,completedGames,2),
        bucketAverageAppearances:round(bucketAverage,2),
        bucketAverageRatePct:percent(bucketAverage,completedGames,2),
        exposureIndex:bucketAverage?round(appearances/bucketAverage,3):0
      };
    }).sort((a,b)=>b.appearances-a.appearances||a.name.localeCompare(b.name));
    const overexposed=fighterAppearanceRates.filter(row=>row.exposureIndex>1.25).slice(0,10);
    const underexposed=fighterAppearanceRates.filter(row=>row.exposureIndex>0&&row.exposureIndex<0.75).sort((a,b)=>a.exposureIndex-b.exposureIndex).slice(0,10);
    const fallbackSelections=nearestBucketSelections+rawFallbackSelections+repeatBreakSelections;
    const warnings=[];
    if(rows.length<15)warnings.push('Pool is too small for reliable five-fighter matchmaking.');
    else if(rows.length<24)warnings.push('Pool is below the preferred 24-fighter replay threshold.');
    Object.values(templateRates).forEach(row=>{if(Math.abs(row.deviationPts)>2)warnings.push('A lineup template missed its target rate by more than two percentage points.');});
    if(brokenGames)warnings.push(`${brokenGames} simulated games failed to produce five fighters.`);
    if(duplicateFighterGames)warnings.push(`${duplicateFighterGames} simulated games contained a duplicate fighter.`);
    if(immediateDuplicateLineups)warnings.push(`${immediateDuplicateLineups} immediate lineup repeats were generated.`);
    if(percent(fallbackSelections,totalSelections,2)>10)warnings.push('More than 10% of selections required a bucket fallback.');
    if(percent(relaxationCounts['0']||0,completedGames,2)>10)warnings.push('More than 10% of games exhausted repeat protection completely.');
    if(overexposed.length)warnings.push(`${overexposed.length} fighters exceeded 1.25× their bucket-average appearance rate.`);
    const passed=brokenGames===0&&duplicateFighterGames===0&&immediateDuplicateLineups===0&&warnings.every(message=>!message.includes('failed')&&!message.includes('duplicate fighter')&&!message.includes('immediate lineup'));

    return {
      version:VERSION,
      packId:pack.id,
      packName:pack.name,
      scoreMode:pack.scoreMode,
      rankingSource:pack.rankingSource,
      status:passed?(warnings.length?'warning':'passed'):'failed',
      passed,
      gamesRequested,
      gamesCompleted:completedGames,
      poolSize:rows.length,
      durationMs:Date.now()-startedAt,
      templateRates,
      bucketRates,
      repeatProtection:{
        configuredWindow:MAX_RECENT_REVEALS,
        relaxWindows:RELAX_WINDOWS.slice(),
        gamesByUsedWindow:Object.fromEntries(RELAX_WINDOWS.map(windowSize=>[String(windowSize),{games:relaxationCounts[String(windowSize)]||0,pct:percent(relaxationCounts[String(windowSize)]||0,completedGames,2)}])),
        immediateRepeatBlocks,
        immediateDuplicateLineups
      },
      fallbackBehavior:{
        nearestBucketSelections,
        rawFallbackSelections,
        repeatBreakSelections,
        totalFallbackSelections:fallbackSelections,
        fallbackSelectionPct:percent(fallbackSelections,totalSelections,2)
      },
      lineupUniqueness:{
        uniqueLineups:Object.keys(signatureCounts).length,
        repeatedLineupSets,
        repeatedLineupPct:percent(repeatedLineupSets,completedGames,2),
        duplicateFighterGames,
        brokenGames
      },
      fighterExposure:{
        averageAppearances:round(totalSelections/rows.length,2),
        highest:fighterAppearanceRates.slice(0,10),
        lowest:fighterAppearanceRates.slice().sort((a,b)=>a.appearances-b.appearances||a.name.localeCompare(b.name)).slice(0,10),
        overexposed,
        underexposed,
        all:fighterAppearanceRates
      },
      warnings
    };
  }

  function simulateAll(gameCount=2000){
    const count=simulationCount(gameCount);
    return PACKS.map(pack=>simulate(pack.id,count));
  }

  function save(packId){
    const game=api();
    if(!game)return;
    try{
      localStorage.setItem(PACK_KEY,packId);
      localStorage.setItem(GAME_KEY,JSON.stringify({
        packId,
        lineup:game.state.lineup.map(fighter=>fighter.id),
        placements:game.state.placements.map(fighter=>fighter?.id||null),
        currentIndex:game.state.currentIndex,
        completed:game.state.completed
      }));
    }catch(_error){}
  }

  function start(packId,sharedLineup=null,shared=false){
    const game=api();
    const pack=packFor(packId);
    const fighters=sharedLineup||lineup(pack);
    if(!game||fighters.length!==5)return;
    game.startGame({packId:'men-chaos',lineup:fighters,shared});
    game.state.packId=pack.id;
    game.state.shared=Boolean(shared);
    if(!shared)beginHistorySession(pack.id,fighters);
    save(pack.id);
    patch();
  }

  function patchSelect(pack){
    const select=document.getElementById('blindRankPack');
    if(!select)return;
    if(select.dataset.refined!==VERSION){
      select.innerHTML=PACKS.map(item=>`<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('');
      select.dataset.refined=VERSION;
    }
    select.value=pack.id;
  }

  function patchFinish(){
    const finish=document.querySelector('#playBlindRankPanel .br-finish');
    if(!finish)return;
    finish.querySelector('.br-finish-hero')?.remove();
    const results=finish.querySelector('.br-results');
    if(results&&!finish.querySelector('.br-results-title'))results.insertAdjacentHTML('beforebegin','<div class="br-results-title">YOUR FINAL RANKING</div>');
    const actions=finish.querySelector('.br-actions');
    if(actions&&actions.dataset.refined!==VERSION){
      actions.innerHTML='<button type="button" class="primary" data-br-challenge>CHALLENGE A FRIEND</button><button type="button" class="secondary" data-br-replay>NEW LINEUP</button>';
      actions.dataset.refined=VERSION;
    }
  }

  function patch(){
    if(patching||!api())return;
    patching=true;
    try{
      const state=api().state;
      const pack=packFor(state.packId||savedPack());
      state.packId=pack.id;
      patchSelect(pack);
      const heading=document.querySelector('#playBlindRankPanel .br-intro h3');
      const intro=document.querySelector('#playBlindRankPanel .br-intro p');
      const progress=document.querySelector('#playBlindRankPanel .br-progress span');
      const title=document.getElementById('playGameTitle');
      if(heading)heading.textContent=pack.prompt;
      if(intro)intro.textContent=pack.intro;
      if(progress)progress.textContent=pack.name;
      if(title&&!state.shared)title.textContent=pack.prompt.replace(/^./,letter=>letter.toUpperCase());
      syncCurrentReveal();
      patchFinish();
      document.documentElement.setAttribute('data-blind-rank-refinements',VERSION);
    }finally{patching=false;}
  }

  function injectStyles(){
    if(document.getElementById('blind-rank-refinement-css'))return;
    const style=document.createElement('style');
    style.id='blind-rank-refinement-css';
    style.textContent=`
      #play .br-current-meta,#play .br-result-row em{display:none!important}
      #play .br-result-row{grid-template-columns:42px 48px minmax(0,1fr)!important}
      #play .br-results-title{color:#facc15;font-size:9px;font-weight:950;letter-spacing:.12em}
      #play .br-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      @media(max-width:700px){#play .br-result-row{grid-template-columns:34px 42px minmax(0,1fr)!important}#play .br-actions{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(style);
  }

  function sharedChallenge(){
    const url=new URL(window.location.href);
    if(url.searchParams.get('game')!=='blind-rank')return null;
    const ids=(url.searchParams.get('brlineup')||'').split(',').map(value=>value.trim()).filter(Boolean);
    if(ids.length!==5||new Set(ids).size!==5||!data())return null;
    const fighters=ids.map(id=>data().resolve(id));
    if(fighters.some(fighter=>!fighter))return null;
    return {fighters,packId:packFor(url.searchParams.get('brpack')).id};
  }

  function installApi(){
    const game=api();
    if(!game)return;
    game.bucketConfig=BUCKET_CONFIG.map(bucket=>({...bucket}));
    game.lineupTemplates=LINEUP_TEMPLATES.map(template=>({id:template.id,name:template.name,weight:template.weight}));
    game.repeatProtection={historyKey:HISTORY_KEY,maxRecentReveals:MAX_RECENT_REVEALS,relaxWindows:RELAX_WINDOWS.slice()};
    game.simulationConfig={defaultGames:DEFAULT_SIMULATIONS,maxGames:MAX_SIMULATIONS,nonDestructive:true};
    game.packScoring=PACKS.map(pack=>({id:pack.id,scoreMode:pack.scoreMode,rankingSource:pack.rankingSource,division:pack.division||null}));
    game.scoreForPack=(packId,fighter)=>{const pack=packFor(packId);return scoreForPack(pack,fighter,rankingContext(pack));};
    game.bucketedPool=packId=>{const pack=packFor(packId);const context=rankingContext(pack);return bucketedPool(pack,pool(pack,context),context);};
    game.recentHistory=historySnapshot;
    game.clearRecentHistory=clearHistory;
    game.auditBuckets=auditPack;
    game.auditPacks=()=>PACKS.map(pack=>auditPack(pack.id));
    game.simulate=simulate;
    game.simulateAll=simulateAll;
  }

  function init(){
    if(!api()||!data())return;
    injectStyles();
    api().state.packId=savedPack();
    installApi();
    patch();

    document.addEventListener('change',event=>{
      const select=event.target.closest?.('#blindRankPack');
      if(!select)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      start(select.value);
    },true);

    document.addEventListener('click',event=>{
      const open=event.target.closest?.('[data-open-game="blind-rank"]');
      if(open){
        event.preventDefault();
        event.stopImmediatePropagation();
        api().open();
        api().state.packId=savedPack();
        patch();
        return;
      }
      if(!event.target.closest?.('#playBlindRankPanel'))return;
      if(event.target.closest('[data-br-new],[data-br-replay]')){
        event.preventDefault();
        event.stopImmediatePropagation();
        start(document.getElementById('blindRankPack')?.value||savedPack());
      }
    },true);

    const observer=new MutationObserver(()=>window.requestAnimationFrame(patch));
    observer.observe(document.getElementById('playBlindRankPanel')||document.body,{childList:true,subtree:true});
    window.addEventListener('ufc-production-ranking-ready',()=>{installApi();patch();});

    const shared=sharedChallenge();
    if(shared)window.setTimeout(()=>{
      document.querySelector('.tab[data-view="play"]')?.click();
      api().open();
      start(shared.packId,shared.fighters,true);
    },180);
  }

  if(api()&&data())init();
  else window.addEventListener('ufc-blind-rank-ready',init,{once:true});
})();
