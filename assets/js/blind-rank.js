(function(){
  'use strict';

  const VERSION='blind-rank-20260716j-consolidated-engine';
  const STORAGE_KEY='ufc-goat-blind-rank-v1';
  const PACK_KEY='ufc-goat-blind-rank-pack-v2';
  const HISTORY_KEY='ufc-goat-blind-rank-history-v1';
  const SITE_TITLE='UFC Blind Rank 5';
  const MAX_RECENT_REVEALS=15;
  const RELAX_WINDOWS=[15,10,5,0];
  const MIN_SIMULATIONS=1;
  const MAX_SIMULATIONS=100000;
  const DEFAULT_SIMULATIONS=10000;
  const PLAY_DATA=window.UFC_PLAY_DATA;
  const play=document.getElementById('play');
  const shell=play?.querySelector('.play-shell');
  const hub=document.getElementById('playHub');
  const gameNav=document.getElementById('playGameNav');
  if(!PLAY_DATA||!play||!shell||!hub||!gameNav)return;

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
  const state={packId:savedPack(),lineup:[],placements:Array(5).fill(null),currentIndex:0,completed:false,shared:false,bucketAudit:null};
  let historyState=loadHistory();

  function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function initials(name){return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';}
  function packFor(id){const key=ALIASES[id]||id;return PACKS.find(pack=>pack.id===key)||PACKS[0];}
  function savedPack(){try{return packFor(localStorage.getItem(PACK_KEY)||'ufc-careers').id;}catch(_error){return'ufc-careers';}}
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
  function saveHistory(){try{localStorage.setItem(HISTORY_KEY,JSON.stringify(historyState));}catch(_error){}}
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
  function historySnapshot(packId){const record=packHistory(packId);return {packId:packFor(packId).id,recent:record.recent.slice(),recentCount:record.recent.length,lastLineup:record.lastLineup.slice(),activeSession:record.session?{signature:record.session.signature,revealedIndexes:record.session.revealedIndexes.slice()}:null};}
  function clearHistory(packId){if(packId)delete historyState.packs[packFor(packId).id];else historyState={version:1,packs:{}};saveHistory();return packId?historySnapshot(packId):{cleared:true};}
  function beginHistorySession(packId,fighters){const record=packHistory(packId);const ids=fighterIds(fighters);record.lastLineup=ids.slice(0,5);record.session={signature:lineupSignature(ids),revealedIndexes:[]};saveHistory();syncCurrentReveal();}
  function syncCurrentReveal(){
    if(state.shared||!Array.isArray(state.lineup)||!state.lineup.length)return;
    const ids=fighterIds(state.lineup);
    const signature=lineupSignature(ids);
    const record=packHistory(state.packId);
    let dirty=false;
    if(!record.session||record.session.signature!==signature){record.session={signature,revealedIndexes:[]};record.lastLineup=ids.slice(0,5);dirty=true;}
    const highest=Math.min(Math.max(Number(state.currentIndex)||0,0),ids.length-1);
    for(let index=0;index<=highest;index+=1){if(record.session.revealedIndexes.includes(index))continue;record.session.revealedIndexes.push(index);record.recent.push(ids[index]);record.recent=record.recent.slice(-MAX_RECENT_REVEALS);dirty=true;}
    if(dirty)saveHistory();
  }

  function legacyRankingScore(fighter){const rank=Number(fighter?.modelRank);if(Number.isFinite(rank))return 100000-(rank*100)+(Number(fighter?.modelScore)||0);return (LEGACY_TIER_SCORE[fighter?.selectionTier]||0)+(Number(fighter?.modelScore)||0);}
  function overallScore(fighter){if(finite(fighter?.modelScore))return 100000+(Number(fighter.modelScore)*100)-(finite(fighter?.modelRank)?Number(fighter.modelRank)/100:0);return (LEGACY_TIER_SCORE[fighter?.selectionTier]||0)+(Number(fighter?.modelScore)||0);}
  function divisionBoard(pack){
    const rankingApi=window.UFC_DIVISION_RANKINGS||window.UFC_DIVISION_RANKING_PIPELINE;
    let rows=[];
    try{rows=rankingApi?.boardFor?.(pack.division)||[];}catch(_error){rows=[];}
    if(!rows.length)rows=window.UFC_DIVISION_RANKING_REPORT?.boards?.[pack.division]||[];
    return rows.filter(row=>row?.fighter&&finite(row?.divisionScore)&&row?.rankEligible!==false);
  }
  function rankingContext(pack){
    if(pack.scoreMode==='curated'){
      const orderById=new Map();
      (pack.order||[]).forEach((name,index)=>{const fighter=PLAY_DATA.resolve?.(name);if(fighter&&!orderById.has(fighter.id))orderById.set(fighter.id,index);});
      return {mode:'curated',ready:orderById.size>=5,orderById};
    }
    if(pack.scoreMode==='division'){
      const board=divisionBoard(pack);
      const divisionById=new Map();
      board.forEach(row=>{const fighter=PLAY_DATA.resolve?.(row.fighter);if(fighter)divisionById.set(fighter.id,row);});
      return {mode:'division',ready:divisionById.size>=5,board,divisionById};
    }
    return {mode:pack.scoreMode||'overall-rank',ready:true};
  }
  function scoreForPack(pack,fighter,context=rankingContext(pack)){
    if(context.mode==='curated'){const index=context.orderById.get(fighter.id);return Number.isInteger(index)?1000000-(index*1000):-Infinity;}
    if(context.mode==='division'){const row=context.divisionById.get(fighter.id);return row?(Number(row.divisionScore)*1000)+(1000-(Number(row.rank)||999)):-Infinity;}
    if(context.mode==='overall-score')return overallScore(fighter);
    return legacyRankingScore(fighter);
  }
  function pool(pack,context=rankingContext(pack)){
    if(!context.ready)return[];
    let rows=PLAY_DATA.poolFor('blind-rank',pack.filters||{});
    if(pack.names){const ids=new Set(pack.names.map(name=>PLAY_DATA.resolve?.(name)?.id).filter(Boolean));rows=rows.filter(row=>ids.has(row.id));}
    if(pack.eras)rows=rows.filter(row=>row.eras?.some(era=>pack.eras.includes(era)));
    if(context.mode==='curated')rows=rows.filter(row=>context.orderById.has(row.id));
    if(context.mode==='division')rows=rows.filter(row=>context.divisionById.has(row.id));
    return rows;
  }
  function bucketedPool(pack,rows,context=rankingContext(pack)){
    const ranked=[...(rows||[])].sort((a,b)=>scoreForPack(pack,b,context)-scoreForPack(pack,a,context)||a.name.localeCompare(b.name));
    const buckets=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,[]]));
    const bucketById={};
    ranked.forEach((fighter,index)=>{const percentile=(index+0.5)/ranked.length;const bucket=BUCKET_CONFIG.find(row=>percentile<=row.cutoff)?.id||'bad';buckets[bucket].push(fighter);bucketById[fighter.id]=bucket;});
    const counts=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,buckets[bucket].length]));
    const percentages=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,ranked.length?round((buckets[bucket].length/ranked.length)*100,1):0]));
    return {ranked,buckets,bucketById,counts,percentages};
  }
  function nearestAvailableBucket(target,working){const targetIndex=BUCKET_ORDER.indexOf(target);return BUCKET_ORDER.map((bucket,index)=>({bucket,distance:Math.abs(index-targetIndex)})).sort((a,b)=>a.distance-b.distance||BUCKET_ORDER.indexOf(a.bucket)-BUCKET_ORDER.indexOf(b.bucket)).map(row=>row.bucket).find(bucket=>working[bucket]?.length);}
  function buildCandidate(rows,audit,excluded,template=chooseTemplate()){
    const working=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,shuffle(audit.buckets[bucket].filter(fighter=>!excluded.has(fighter.id)))]));
    const targets=template.targets();
    const picked=[];
    const actual=[];
    targets.forEach(target=>{const source=working[target]?.length?target:nearestAvailableBucket(target,working);const fighter=source?working[source].pop():null;if(!fighter)return;picked.push(fighter);actual.push(source);});
    if(picked.length<5){const used=new Set(picked.map(fighter=>fighter.id));shuffle(rows.filter(fighter=>!excluded.has(fighter.id)&&!used.has(fighter.id))).slice(0,5-picked.length).forEach(fighter=>{picked.push(fighter);actual.push('fallback');});}
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
      for(let attempt=0;attempt<attemptLimit;attempt+=1){attempts+=1;const candidate=buildCandidate(rows,audit,excluded,template);if(!candidate)continue;const signature=lineupSignature(candidate.fighters);if(previousSignature&&signature===previousSignature){blockedImmediateRepeat=true;continue;}selected=candidate;usedWindow=windowSize;break;}
      if(selected)break;
    }
    if(!selected){selected=buildCandidate(rows,audit,new Set(),template);usedWindow=0;}
    if(!selected)return {fighters:[],meta:{packId:pack.id,broken:true,reason:'candidate-build-failed',poolSize:rows.length}};
    if(previousSignature&&lineupSignature(selected.fighters)===previousSignature){
      const previousIds=new Set(history?.lastLineup||[]);
      const selectedIds=new Set(selected.fighters.map(fighter=>fighter.id));
      const replacement=rows.find(fighter=>!previousIds.has(fighter.id)&&!selectedIds.has(fighter.id));
      if(replacement){selected.fighters[selected.fighters.length-1]=replacement;selected.actual[selected.actual.length-1]='repeat-break';selected.fighters=shuffle(selected.fighters);blockedImmediateRepeat=true;}
    }
    return {fighters:selected.fighters,meta:{packId:pack.id,scoreMode:pack.scoreMode,rankingSource:pack.rankingSource,lineupType:selected.template.id,lineupTypeName:selected.template.name,poolSize:rows.length,counts:audit.counts,percentages:audit.percentages,targets:selected.targets,actual:selected.actual,fighterBuckets:selected.fighters.map(fighter=>audit.bucketById[fighter.id]||'unknown'),repeatProtection:{configuredWindow:MAX_RECENT_REVEALS,usedWindow,relaxed:usedWindow<MAX_RECENT_REVEALS,recentCount:(history?.recent||[]).length,excludedCount:usedWindow?new Set((history?.recent||[]).slice(-usedWindow)).size:0,immediateRepeatBlocked:blockedImmediateRepeat,attempts}}};
  }
  function lineup(pack){const generated=generateLineup(pack,packHistory(pack.id));state.bucketAudit=generated.meta;return generated.fighters;}

  function auditPack(packId){
    const pack=packFor(packId);const context=rankingContext(pack);const rows=pool(pack,context);const audit=bucketedPool(pack,rows,context);const history=historySnapshot(pack.id);const issues=[];
    if(!context.ready)issues.push('ranking-source-not-ready');
    if(rows.length<5)issues.push('pool-under-five');else if(rows.length<15)issues.push('pool-under-recommended-minimum');else if(rows.length<24)issues.push('limited-repeat-protection');
    const rankRows=values=>values.map(fighter=>({id:fighter.id,name:fighter.name,score:round(scoreForPack(pack,fighter,context),2),bucket:audit.bucketById[fighter.id]}));
    return {packId:pack.id,scoreMode:pack.scoreMode,rankingSource:pack.rankingSource,ready:context.ready&&rows.length>=5,status:issues.length?'warning':'ready',issues,poolSize:rows.length,poolGuidance:{minimum:5,recommended:24,ideal:'30-40'},counts:audit.counts,percentages:audit.percentages,lineupTemplates:LINEUP_TEMPLATES.map(template=>({id:template.id,name:template.name,weight:template.weight})),repeatProtection:{maxRecentReveals:MAX_RECENT_REVEALS,relaxWindows:RELAX_WINDOWS.slice(),...history},topFive:rankRows(audit.ranked.slice(0,5)),bottomFive:rankRows(audit.ranked.slice(-5))};
  }
  function simulationCount(value){const parsed=Math.floor(Number(value)||DEFAULT_SIMULATIONS);return Math.max(MIN_SIMULATIONS,Math.min(MAX_SIMULATIONS,parsed));}
  function simulate(packId,gameCount=DEFAULT_SIMULATIONS){
    const pack=packFor(packId);const gamesRequested=simulationCount(gameCount);const context=rankingContext(pack);const rows=pool(pack,context);const audit=bucketedPool(pack,rows,context);const startedAt=Date.now();
    if(!context.ready||rows.length<5)return {version:VERSION,packId:pack.id,status:'blocked',passed:false,reason:!context.ready?'ranking-source-not-ready':'pool-under-five',gamesRequested,gamesCompleted:0,poolSize:rows.length,durationMs:Date.now()-startedAt};
    const templateCounts={},targetBucketCounts={},actualBucketCounts={},fighterCounts={},relaxationCounts={},signatureCounts={};
    const simulatedHistory={recent:[],lastLineup:[],session:null};
    let completedGames=0,brokenGames=0,duplicateFighterGames=0,immediateDuplicateLineups=0,repeatedLineupSets=0,nearestBucketSelections=0,rawFallbackSelections=0,repeatBreakSelections=0,immediateRepeatBlocks=0,previousSignature='';
    const prepared={context,rows,audit};
    for(let gameIndex=0;gameIndex<gamesRequested;gameIndex+=1){
      const generated=generateLineup(pack,simulatedHistory,prepared);const fighters=generated.fighters||[];const meta=generated.meta||{};
      if(fighters.length!==5){brokenGames+=1;continue;}
      completedGames+=1;const ids=fighterIds(fighters);const signature=lineupSignature(ids);
      if(new Set(ids).size!==5)duplicateFighterGames+=1;if(previousSignature&&signature===previousSignature)immediateDuplicateLineups+=1;if(signatureCounts[signature])repeatedLineupSets+=1;increment(signatureCounts,signature);previousSignature=signature;
      increment(templateCounts,meta.lineupType||'unknown');increment(relaxationCounts,String(meta.repeatProtection?.usedWindow??'unknown'));if(meta.repeatProtection?.immediateRepeatBlocked)immediateRepeatBlocks+=1;
      (meta.targets||[]).forEach(target=>increment(targetBucketCounts,target));
      (meta.actual||[]).forEach((actual,index)=>{if(actual==='fallback')rawFallbackSelections+=1;else if(actual==='repeat-break')repeatBreakSelections+=1;else if(actual!==(meta.targets||[])[index])nearestBucketSelections+=1;});
      fighters.forEach(fighter=>{increment(fighterCounts,fighter.id);increment(actualBucketCounts,audit.bucketById[fighter.id]||'unknown');});
      simulatedHistory.lastLineup=ids.slice();simulatedHistory.recent.push(...ids);simulatedHistory.recent=simulatedHistory.recent.slice(-MAX_RECENT_REVEALS);
    }
    const totalSelections=completedGames*5;
    const templateRates=Object.fromEntries(LINEUP_TEMPLATES.map(template=>[template.id,{targetPct:round(template.weight*100,2),games:templateCounts[template.id]||0,actualPct:percent(templateCounts[template.id]||0,completedGames,2),deviationPts:round(percent(templateCounts[template.id]||0,completedGames,2)-(template.weight*100),2)}]));
    const bucketRates=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,{poolCount:audit.counts[bucket]||0,poolPct:audit.percentages[bucket]||0,selections:actualBucketCounts[bucket]||0,selectionPct:percent(actualBucketCounts[bucket]||0,totalSelections,2),targetSelections:targetBucketCounts[bucket]||0,targetPct:percent(targetBucketCounts[bucket]||0,totalSelections,2)}]));
    const fighterAppearanceRates=rows.map(fighter=>{const bucket=audit.bucketById[fighter.id]||'unknown';const bucketSize=audit.counts[bucket]||1;const bucketSelections=actualBucketCounts[bucket]||0;const bucketAverage=bucketSelections/bucketSize;const appearances=fighterCounts[fighter.id]||0;return {id:fighter.id,name:fighter.name,bucket,appearances,appearanceRatePct:percent(appearances,completedGames,2),bucketAverageAppearances:round(bucketAverage,2),bucketAverageRatePct:percent(bucketAverage,completedGames,2),exposureIndex:bucketAverage?round(appearances/bucketAverage,3):0};}).sort((a,b)=>b.appearances-a.appearances||a.name.localeCompare(b.name));
    const overexposed=fighterAppearanceRates.filter(row=>row.exposureIndex>1.25).slice(0,10);const underexposed=fighterAppearanceRates.filter(row=>row.exposureIndex>0&&row.exposureIndex<0.75).sort((a,b)=>a.exposureIndex-b.exposureIndex).slice(0,10);
    const fallbackSelections=nearestBucketSelections+rawFallbackSelections+repeatBreakSelections;const warnings=[];
    if(rows.length<15)warnings.push('Pool is too small for reliable five-fighter matchmaking.');else if(rows.length<24)warnings.push('Pool is below the preferred 24-fighter replay threshold.');
    Object.values(templateRates).forEach(row=>{if(Math.abs(row.deviationPts)>2)warnings.push('A lineup template missed its target rate by more than two percentage points.');});
    if(brokenGames)warnings.push(`${brokenGames} simulated games failed to produce five fighters.`);if(duplicateFighterGames)warnings.push(`${duplicateFighterGames} simulated games contained a duplicate fighter.`);if(immediateDuplicateLineups)warnings.push(`${immediateDuplicateLineups} immediate lineup repeats were generated.`);if(percent(fallbackSelections,totalSelections,2)>10)warnings.push('More than 10% of selections required a bucket fallback.');if(percent(relaxationCounts['0']||0,completedGames,2)>10)warnings.push('More than 10% of games exhausted repeat protection completely.');if(overexposed.length)warnings.push(`${overexposed.length} fighters exceeded 1.25× their bucket-average appearance rate.`);
    const passed=brokenGames===0&&duplicateFighterGames===0&&immediateDuplicateLineups===0;
    return {version:VERSION,packId:pack.id,packName:pack.name,scoreMode:pack.scoreMode,rankingSource:pack.rankingSource,status:passed?(warnings.length?'warning':'passed'):'failed',passed,gamesRequested,gamesCompleted:completedGames,poolSize:rows.length,durationMs:Date.now()-startedAt,templateRates,bucketRates,repeatProtection:{configuredWindow:MAX_RECENT_REVEALS,relaxWindows:RELAX_WINDOWS.slice(),gamesByUsedWindow:Object.fromEntries(RELAX_WINDOWS.map(windowSize=>[String(windowSize),{games:relaxationCounts[String(windowSize)]||0,pct:percent(relaxationCounts[String(windowSize)]||0,completedGames,2)}])),immediateRepeatBlocks,immediateDuplicateLineups},fallbackBehavior:{nearestBucketSelections,rawFallbackSelections,repeatBreakSelections,totalFallbackSelections:fallbackSelections,fallbackSelectionPct:percent(fallbackSelections,totalSelections,2)},lineupUniqueness:{uniqueLineups:Object.keys(signatureCounts).length,repeatedLineupSets,repeatedLineupPct:percent(repeatedLineupSets,completedGames,2),duplicateFighterGames,brokenGames},fighterExposure:{averageAppearances:round(totalSelections/rows.length,2),highest:fighterAppearanceRates.slice(0,10),lowest:fighterAppearanceRates.slice().sort((a,b)=>a.appearances-b.appearances||a.name.localeCompare(b.name)).slice(0,10),overexposed,underexposed,all:fighterAppearanceRates},warnings};
  }
  function simulateAll(gameCount=2000){const count=simulationCount(gameCount);return PACKS.map(pack=>simulate(pack.id,count));}

  function injectStyles(){
    if(document.getElementById('blind-rank-core-css'))return;
    const style=document.createElement('style');style.id='blind-rank-core-css';style.textContent=`
      #playBlindRankPanel[hidden]{display:none!important}
      #play .br-wrap{display:grid;gap:12px;color:#f8fafc}
      #play .br-intro{display:flex;justify-content:space-between;align-items:end;gap:18px;border:1px solid rgba(249,115,22,.55);border-radius:20px;background:linear-gradient(135deg,#29364b,#182236 62%,#101522);padding:17px}
      #play .br-kicker{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.13em}
      #play .br-intro h3{margin:5px 0 0;color:#fff;font-size:27px;line-height:1}
      #play .br-intro p{max-width:650px;margin:7px 0 0;color:#cbd5e1;font-size:12px;line-height:1.45}
      #play .br-pack-control{display:grid;grid-template-columns:minmax(180px,1fr) auto;gap:7px;min-width:330px}
      #play .br-pack-control select,#play .br-pack-control button{min-height:42px;border-radius:12px;font:850 11px/1 system-ui}
      #play .br-pack-control select{border:1px solid #526786;background:#101725;color:#f8fafc;padding:0 10px}
      #play .br-pack-control button{border:1px solid #f97316;background:#f97316;color:#111827;padding:0 12px;cursor:pointer}
      #play .br-game-card{display:grid;gap:13px;border:1px solid #4b5f7e;border-radius:21px;background:linear-gradient(180deg,#223047,#172033);padding:15px}
      #play .br-progress{display:flex;justify-content:space-between;gap:10px;align-items:center}
      #play .br-progress strong{color:#facc15;font-size:11px;letter-spacing:.08em}
      #play .br-progress span{color:#cbd5e1;font-size:11px}
      #play .br-slots{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}
      #play .br-slot{position:relative;min-height:116px;border:1px solid #526786;border-radius:15px;background:#101725;color:#f8fafc;padding:8px;text-align:left;cursor:pointer;overflow:hidden}
      #play .br-slot.empty:hover{border-color:#f97316;background:#172033;transform:translateY(-1px)}
      #play .br-slot:disabled{cursor:default}
      #play .br-slot-number{position:absolute;top:8px;left:9px;color:#facc15;font-size:18px;font-weight:950;z-index:2}
      #play .br-slot.empty{display:flex;align-items:center;justify-content:center;color:#64748b;font-size:10px;font-weight:900;letter-spacing:.08em}
      #play .br-slot-fighter{display:grid;justify-items:center;gap:6px;padding-top:17px;text-align:center}
      #play .br-slot-fighter strong{max-width:100%;color:#fff;font-size:11px;line-height:1.12;overflow:hidden;text-overflow:ellipsis}
      #play .br-mini-photo{width:52px;height:52px;border:1px solid #475569;border-radius:13px;overflow:hidden;background:#26364e;display:flex;align-items:center;justify-content:center;color:#e2e8f0;font-weight:950}
      #play .br-mini-photo img,#play .br-current-photo img,#play .br-result-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
      #play .br-current{display:grid;grid-template-columns:minmax(135px,.55fr) minmax(0,1.45fr);gap:15px;align-items:center;border:1px solid rgba(250,204,21,.42);border-radius:18px;background:radial-gradient(circle at 18% 25%,rgba(249,115,22,.18),transparent 42%),#0f1624;padding:15px}
      #play .br-current-photo{width:100%;max-width:220px;aspect-ratio:1/1;border:1px solid rgba(250,204,21,.45);border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#35445d,#172033);display:flex;align-items:center;justify-content:center;color:#f8fafc;font-size:48px;font-weight:950;margin:auto}
      #play .br-current-copy>span{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.11em}
      #play .br-current-copy h4{margin:6px 0 0;color:#fff;font-size:32px;line-height:.98}
      #play .br-current-copy p{margin:8px 0 0;color:#cbd5e1;font-size:12px;line-height:1.4}
      #play .br-current-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
      #play .br-current-meta b{border:1px solid #526786;border-radius:999px;background:#172033;padding:5px 8px;color:#dbe5f3;font-size:9px;letter-spacing:.04em}
      #play .br-current-instruction{margin-top:13px;color:#fdba74;font-size:11px;font-weight:900}
      #play .br-finish{display:grid;gap:12px}
      #play .br-results{display:grid;gap:6px}
      #play .br-result-row{display:grid;grid-template-columns:42px 48px minmax(0,1fr) auto;gap:9px;align-items:center;border:1px solid #465a78;border-radius:14px;background:#101725;padding:7px 9px}
      #play .br-result-rank{color:#facc15;font-size:20px;font-weight:950;text-align:center}
      #play .br-result-photo{width:48px;height:48px;border-radius:12px;overflow:hidden;background:#26364e;display:flex;align-items:center;justify-content:center;color:#e2e8f0;font-weight:950}
      #play .br-result-copy strong,#play .br-result-copy small{display:block}
      #play .br-result-copy strong{color:#fff;font-size:14px}
      #play .br-result-copy small{margin-top:3px;color:#94a3b8;font-size:10px}
      #play .br-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      #play .br-actions button{min-height:43px;border-radius:12px;font:950 10px/1 system-ui;letter-spacing:.04em;cursor:pointer}
      #play .br-actions .primary{border:1px solid #f97316;background:#f97316;color:#111827}
      #play .br-actions .secondary{border:1px solid #526786;background:#101725;color:#f8fafc}
      #play .br-toast{position:fixed;left:50%;bottom:22px;z-index:1000;transform:translate(-50%,14px);opacity:0;pointer-events:none;border:1px solid rgba(250,204,21,.5);border-radius:999px;background:#101725;padding:9px 13px;color:#fde68a;font-size:11px;font-weight:900;transition:.18s ease}
      #play .br-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:700px){#play .br-intro{display:grid;align-items:start;padding:14px}#play .br-intro h3{font-size:23px}#play .br-pack-control{min-width:0;grid-template-columns:1fr auto}#play .br-slots{grid-template-columns:repeat(5,minmax(57px,1fr));gap:4px;overflow-x:auto;padding-bottom:2px}#play .br-slot{min-height:91px;padding:5px}#play .br-slot-number{top:5px;left:6px;font-size:15px}#play .br-mini-photo{width:38px;height:38px;border-radius:9px}#play .br-slot-fighter{gap:4px;padding-top:15px}#play .br-slot-fighter strong{font-size:8px}#play .br-current{grid-template-columns:92px minmax(0,1fr);gap:11px;padding:12px}#play .br-current-photo{width:92px;border-radius:15px;font-size:34px}#play .br-current-copy h4{font-size:24px}#play .br-current-copy p{font-size:10px}#play .br-current-meta{margin-top:8px}#play .br-current-meta b{font-size:7px;padding:4px 6px}#play .br-current-instruction{margin-top:9px;font-size:9px}#play .br-actions{grid-template-columns:1fr}#play .br-result-row{grid-template-columns:34px 42px minmax(0,1fr)}#play .br-result-photo{width:42px;height:42px}}
    `;document.head.appendChild(style);
  }
  function visual(fighter,className){const url=fighter?.thumbUrl||fighter?.profileUrl||'';return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<span>${esc(initials(fighter?.name))}</span>`}</span>`;}
  function eraLabel(fighter){const id=fighter?.eras?.[0];return window.UFC_ERA_FILTER_DATA?.byId?.[id]?.name||'';}
  function fighterMeta(fighter){return [fighter.primaryDivision||fighter.divisions?.[0],eraLabel(fighter)].filter(Boolean).join(' · ')||'UFC Play roster';}
  function saveState(){try{localStorage.setItem(PACK_KEY,state.packId);localStorage.setItem(STORAGE_KEY,JSON.stringify({packId:state.packId,lineup:state.lineup.map(fighter=>fighter.id),placements:state.placements.map(fighter=>fighter?.id||null),currentIndex:state.currentIndex,completed:state.completed}));}catch(_error){}}
  function restoreState(){
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(!saved||!Array.isArray(saved.lineup)||saved.lineup.length!==5)return false;
      const restoredLineup=saved.lineup.map(id=>PLAY_DATA.resolve(id));if(restoredLineup.some(fighter=>!fighter)||new Set(restoredLineup.map(fighter=>fighter.id)).size!==5)return false;
      const placements=Array.isArray(saved.placements)?saved.placements.slice(0,5).map(id=>id?PLAY_DATA.resolve(id):null):Array(5).fill(null);while(placements.length<5)placements.push(null);
      state.packId=packFor(saved.packId).id;state.lineup=restoredLineup;state.placements=placements;state.currentIndex=Math.max(0,Math.min(5,Number(saved.currentIndex)||0));state.completed=Boolean(saved.completed&&state.currentIndex>=5&&placements.every(Boolean));state.shared=false;syncCurrentReveal();return true;
    }catch(_error){return false;}
  }
  function challengeUrl(){const url=new URL(window.location.href);url.searchParams.delete('room');url.searchParams.set('game','blind-rank');url.searchParams.set('brpack',state.packId);url.searchParams.set('brlineup',state.lineup.map(fighter=>fighter.id).join(','));url.hash='play';return url.toString();}
  function parseSharedLineup(){const url=new URL(window.location.href);if(url.searchParams.get('game')!=='blind-rank')return null;const ids=(url.searchParams.get('brlineup')||'').split(',').map(value=>value.trim()).filter(Boolean);if(ids.length!==5||new Set(ids).size!==5)return null;const sharedLineup=ids.map(id=>PLAY_DATA.resolve(id));if(sharedLineup.some(fighter=>!fighter))return null;return {lineup:sharedLineup,packId:packFor(url.searchParams.get('brpack')).id};}
  function startGame(options={}){
    const pack=packFor(options.packId||state.packId);
    const generated=Array.isArray(options.lineup)&&options.lineup.length===5?{fighters:options.lineup,meta:null}:generateLineup(pack,packHistory(pack.id));
    if(generated.fighters.length!==5)return;
    state.packId=pack.id;state.lineup=generated.fighters;state.placements=Array(5).fill(null);state.currentIndex=0;state.completed=false;state.shared=Boolean(options.shared);state.bucketAudit=generated.meta;
    if(!state.shared)beginHistorySession(pack.id,state.lineup);saveState();render();
  }
  function placeCurrent(slotIndex){if(state.completed||state.placements[slotIndex]||!state.lineup[state.currentIndex])return;state.placements[slotIndex]=state.lineup[state.currentIndex];state.currentIndex+=1;state.completed=state.currentIndex>=state.lineup.length;syncCurrentReveal();saveState();render();}
  function renderSlots(){return state.placements.map((fighter,index)=>fighter?`<button type="button" class="br-slot filled" disabled><span class="br-slot-number">${index+1}</span><span class="br-slot-fighter">${visual(fighter,'br-mini-photo')}<strong>${esc(fighter.name)}</strong></span></button>`:`<button type="button" class="br-slot empty" data-br-slot="${index}"><span class="br-slot-number">${index+1}</span><span>PLACE HERE</span></button>`).join('');}
  function renderCurrent(){const fighter=state.lineup[state.currentIndex];if(!fighter)return'';return `<div class="br-current">${visual(fighter,'br-current-photo')}<div class="br-current-copy"><span>FIGHTER ${state.currentIndex+1} OF 5</span><h4>${esc(fighter.name)}</h4><p>${esc(fighterMeta(fighter))}</p><div class="br-current-meta"><b>${fighter.modelRanked?'GOAT MODEL ROSTER':'PLAY-ONLY ROSTER'}</b></div><div class="br-current-instruction">Choose an open slot. Once placed, it is locked.</div></div></div>`;}
  function renderFinish(){return `<div class="br-finish"><div class="br-results-title">YOUR FINAL RANKING</div><div class="br-results">${state.placements.map((fighter,index)=>`<div class="br-result-row"><div class="br-result-rank">#${index+1}</div>${visual(fighter,'br-result-photo')}<div class="br-result-copy"><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></div></div>`).join('')}</div><div class="br-actions"><button type="button" class="primary" data-br-challenge>CHALLENGE A FRIEND</button><button type="button" class="secondary" data-br-replay>NEW LINEUP</button></div></div>`;}
  function render(){
    const panel=document.getElementById('playBlindRankPanel');const target=document.getElementById('blindRankGame');const select=document.getElementById('blindRankPack');if(!panel||!target)return;
    const pack=packFor(state.packId);if(select)select.value=pack.id;
    panel.querySelector('.br-intro h3').textContent=pack.prompt;panel.querySelector('.br-intro p').textContent=pack.intro;
    target.innerHTML=`<div class="br-game-card"><div class="br-progress"><strong>${state.completed?'COMPLETE':`LOCKED ${state.currentIndex} OF 5`}</strong><span>${esc(pack.name)}</span></div><div class="br-slots">${renderSlots()}</div>${state.completed?renderFinish():renderCurrent()}</div>`;
    document.dispatchEvent(new CustomEvent('ufc-blind-rank-rendered',{detail:{version:VERSION,packId:pack.id,completed:state.completed,shared:state.shared}}));
  }
  function showToast(message){const toast=document.getElementById('blindRankToast');if(!toast)return;toast.textContent=message;toast.classList.add('show');window.clearTimeout(showToast.timer);showToast.timer=window.setTimeout(()=>toast.classList.remove('show'),1500);}
  async function sharePayload(payload,success){try{if(navigator.share){await navigator.share(payload);return;}await navigator.clipboard.writeText([payload.text,payload.url].filter(Boolean).join('\n\n'));showToast(success||'Copied');}catch(error){if(error?.name!=='AbortError')showToast('Share failed');}}
  function resultText(){return `MY UFC BLIND RANK 5\n\n${state.placements.map((fighter,index)=>`${index+1}. ${fighter.name}`).join('\n')}\n\nThink you can handle the same lineup?`;}
  function shareResult(){return sharePayload({title:SITE_TITLE,text:resultText(),url:challengeUrl()},'Ranking copied');}
  function shareChallenge(){return sharePayload({title:'UFC Blind Rank Challenge',text:'Blind rank these same five UFC fighters. Every placement locks before the next reveal.',url:challengeUrl()},'Challenge link copied');}
  function ensurePanel(){
    let panel=document.getElementById('playBlindRankPanel');if(panel)return panel;
    panel=document.createElement('section');panel.id='playBlindRankPanel';panel.className='play-panel';panel.hidden=true;
    panel.innerHTML=`<div class="br-wrap"><div class="br-intro"><div><span class="br-kicker">BLIND RANK 5</span><h3>${esc(PACKS[0].prompt)}</h3><p>${esc(PACKS[0].intro)}</p></div><div class="br-pack-control"><select id="blindRankPack" aria-label="Blind Rank pack">${PACKS.map(pack=>`<option value="${esc(pack.id)}">${esc(pack.name)}</option>`).join('')}</select><button type="button" data-br-new>NEW LINEUP</button></div></div><div id="blindRankGame"></div><div id="blindRankToast" class="br-toast" role="status" aria-live="polite"></div></div>`;
    shell.appendChild(panel);
    panel.addEventListener('click',event=>{const slot=event.target.closest('[data-br-slot]');if(slot){placeCurrent(Number(slot.dataset.brSlot));return;}if(event.target.closest('[data-br-new],[data-br-replay]')){startGame({packId:document.getElementById('blindRankPack')?.value||state.packId});return;}if(event.target.closest('[data-br-share-result]')){shareResult();return;}if(event.target.closest('[data-br-challenge]'))shareChallenge();});
    panel.querySelector('#blindRankPack')?.addEventListener('change',event=>startGame({packId:event.target.value}));
    return panel;
  }
  function hideOtherPanels(){document.getElementById('playTop10Panel')?.setAttribute('hidden','');document.getElementById('playBlindPanel')?.setAttribute('hidden','');}
  function open(options={}){
    const panel=ensurePanel();hideOtherPanels();panel.hidden=false;hub.hidden=true;shell.hidden=false;gameNav.hidden=false;play.classList.add('play-game-active');
    const eyebrow=document.getElementById('playGameEyebrow');const title=document.getElementById('playGameTitle');if(eyebrow)eyebrow.textContent=options.shared?'FRIEND CHALLENGE':'BLIND RANK 5';if(title)title.textContent=options.shared?'Same Five. Your Ranking.':packFor(options.packId||state.packId).prompt.replace(/^./,letter=>letter.toUpperCase());
    document.documentElement.setAttribute('data-play-screen','blind-rank');
    if(options.lineup)startGame(options);else if(!state.lineup.length&&!restoreState())startGame({packId:state.packId});else render();gameNav.scrollIntoView({block:'start'});
  }
  function close(){const panel=document.getElementById('playBlindRankPanel');if(panel)panel.hidden=true;}
  function patchHub(){
    const card=[...hub.querySelectorAll('[data-coming-game]')].find(node=>node.dataset.comingGame==='Blind Rank 5');
    if(card){card.classList.remove('is-coming');card.classList.add('is-live');card.removeAttribute('data-coming-game');card.dataset.openGame='blind-rank';const status=card.querySelector('.play-game-card-top em');const action=card.querySelector('.play-game-action');if(status)status.textContent='PLAY NOW';if(action)action.textContent='OPEN GAME →';}
    hub.addEventListener('click',event=>{const trigger=event.target.closest('[data-open-game="blind-rank"]');if(!trigger)return;event.preventDefault();event.stopImmediatePropagation();open();},true);
    document.querySelectorAll('[data-play-mode="top10"],[data-play-mode="blind"]').forEach(button=>button.addEventListener('click',close));gameNav.addEventListener('click',event=>{if(event.target.closest('[data-play-home]'))close();},true);
    const api=window.UFC_PLAY_HUB;if(api&&!api.__blindRankPatched){const nativeOpen=api.openGame;const nativeHome=api.showHub;api.openGame=function(mode,options){if(mode==='blind-rank')return open(options||{});close();return nativeOpen.call(api,mode,options);};api.showHub=function(){close();return nativeHome.call(api);};api.__blindRankPatched=true;}
  }

  injectStyles();ensurePanel();patchHub();
  const publicApi={version:VERSION,packs:PACKS.map(pack=>({...pack})),state,open,startGame,challengeUrl,bucketConfig:BUCKET_CONFIG.map(bucket=>({...bucket})),lineupTemplates:LINEUP_TEMPLATES.map(template=>({id:template.id,name:template.name,weight:template.weight})),repeatProtection:{historyKey:HISTORY_KEY,maxRecentReveals:MAX_RECENT_REVEALS,relaxWindows:RELAX_WINDOWS.slice()},simulationConfig:{defaultGames:DEFAULT_SIMULATIONS,maxGames:MAX_SIMULATIONS,nonDestructive:true},packScoring:PACKS.map(pack=>({id:pack.id,scoreMode:pack.scoreMode,rankingSource:pack.rankingSource,division:pack.division||null})),scoreForPack:(packId,fighter)=>{const pack=packFor(packId);return scoreForPack(pack,fighter,rankingContext(pack));},bucketedPool:packId=>{const pack=packFor(packId);const context=rankingContext(pack);return bucketedPool(pack,pool(pack,context),context);},recentHistory:historySnapshot,clearRecentHistory:clearHistory,auditBuckets:auditPack,auditPacks:()=>PACKS.map(pack=>auditPack(pack.id)),simulate,simulateAll};
  window.UFC_BLIND_RANK=publicApi;
  document.documentElement.setAttribute('data-blind-rank',VERSION);
  window.dispatchEvent(new CustomEvent('ufc-blind-rank-ready',{detail:{version:VERSION}}));
  const shared=parseSharedLineup();if(shared)window.setTimeout(()=>{document.querySelector('.tab[data-view="play"]')?.click();open({...shared,shared:true});},80);
})();