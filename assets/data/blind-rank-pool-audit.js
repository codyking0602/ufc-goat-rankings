(function(root){
  'use strict';

  const VERSION='blind-rank-pool-audit-20260717a-phase-three';
  const PHOTO_CACHE_KEY='ufc-blind-rank-photo-audit-v1';
  const TIER_IDS=['elite','great','good','average','below-average','bad'];
  const TIER_INDEX=Object.fromEntries(TIER_IDS.map((tier,index)=>[tier,index]));
  const THRESHOLDS={
    roster:{targetLow:160,targetHigh:180},
    pool:{
      broad:{minimum:80,preferred:100,ideal:120},
      women:{minimum:24,preferred:35,ideal:45},
      division:{minimum:24,preferred:30,ideal:40},
      era:{minimum:24,preferred:30,ideal:40}
    },
    tier:{
      minimum:{elite:5,great:5,good:5,average:5,'below-average':5,bad:5},
      preferred:{elite:8,great:10,good:12,average:12,'below-average':8,bad:5}
    },
    review:{maximumProvisionalPct:20},
    repeatProtection:{recentRevealWindow:15,lineupSize:5}
  };

  const EXPANSION_CANDIDATES=[
    candidate('Andrei Arlovski','men',['Heavyweight'],9,['division-depth','veteran'],{career:'good',striking:'good',grappling:'average',peak:'good',finishing:'good',complete:'good',action:'average'}),
    candidate('Alistair Overeem','men',['Heavyweight'],10,['division-depth','specialist','action'],{career:'good',striking:'great',grappling:'good',peak:'great',finishing:'great',complete:'great',action:'great'}),
    candidate('Mark Hunt','men',['Heavyweight'],10,['division-depth','specialist','action'],{career:'average',striking:'great',grappling:'below-average',peak:'good',finishing:'great',complete:'below-average',action:'great'}),
    candidate('Tim Sylvia','men',['Heavyweight'],8,['division-depth','lower-tier'],{career:'good',striking:'average',grappling:'below-average',peak:'good',finishing:'average',complete:'average',action:'below-average'}),
    candidate('Ciryl Gane','men',['Heavyweight'],9,['division-depth','specialist'],{career:'good',striking:'great',grappling:'average',peak:'great',finishing:'good',complete:'good',action:'average'}),
    candidate('Curtis Blaydes','men',['Heavyweight'],8,['division-depth','specialist'],{career:'good',striking:'average',grappling:'great',peak:'great',finishing:'good',complete:'great',action:'average'}),
    candidate('Alexander Volkov','men',['Heavyweight'],8,['division-depth'],{career:'good',striking:'great',grappling:'average',peak:'good',finishing:'good',complete:'good',action:'good'}),
    candidate('Roy Nelson','men',['Heavyweight'],9,['division-depth','action'],{career:'average',striking:'good',grappling:'good',peak:'average',finishing:'great',complete:'average',action:'great'}),
    candidate('Stefan Struve','men',['Heavyweight'],7,['division-depth','lower-tier'],{career:'average',striking:'average',grappling:'good',peak:'average',finishing:'good',complete:'average',action:'good'}),
    candidate('Greg Hardy','men',['Heavyweight'],7,['division-depth','lower-tier','contrast'],{career:'below-average',striking:'average',grappling:'bad',peak:'average',finishing:'good',complete:'below-average',action:'average'}),
    candidate('Jim Miller','men',['Lightweight'],10,['division-depth','veteran','action'],{career:'good',striking:'average',grappling:'great',peak:'good',finishing:'great',complete:'good',action:'great'}),
    candidate('Kenny Florian','men',['Lightweight','Featherweight'],9,['division-depth','specialist'],{career:'good',striking:'good',grappling:'good',peak:'great',finishing:'good',complete:'great',action:'good'}),
    candidate('Gray Maynard','men',['Lightweight'],8,['division-depth','specialist'],{career:'good',striking:'average',grappling:'great',peak:'great',finishing:'below-average',complete:'good',action:'average'}),
    candidate('Bobby Green','men',['Lightweight'],8,['division-depth','action'],{career:'average',striking:'good',grappling:'average',peak:'good',finishing:'below-average',complete:'good',action:'good'}),
    candidate('Paddy Pimblett','men',['Lightweight'],9,['division-depth','star','contrast'],{career:'average',striking:'average',grappling:'good',peak:'good',finishing:'good',complete:'good',action:'good'}),
    candidate('Melvin Guillard','men',['Lightweight'],8,['division-depth','lower-tier','contrast'],{career:'below-average',striking:'good',grappling:'below-average',peak:'good',finishing:'great',complete:'below-average',action:'great'}),
    candidate('Joe Stevenson','men',['Lightweight'],7,['division-depth'],{career:'average',striking:'average',grappling:'good',peak:'good',finishing:'good',complete:'average',action:'good'}),
    candidate('Gleison Tibau','men',['Lightweight'],7,['division-depth','specialist'],{career:'average',striking:'below-average',grappling:'good',peak:'good',finishing:'below-average',complete:'good',action:'average'}),
    candidate('Michael Johnson','men',['Lightweight'],8,['division-depth','contrast','action'],{career:'average',striking:'good',grappling:'below-average',peak:'good',finishing:'good',complete:'average',action:'great'}),
    candidate('Drew Dober','men',['Lightweight'],8,['division-depth','action'],{career:'average',striking:'good',grappling:'average',peak:'good',finishing:'great',complete:'good',action:'great'}),
    candidate('Neil Magny','men',['Welterweight'],8,['division-depth','veteran'],{career:'good',striking:'average',grappling:'average',peak:'good',finishing:'below-average',complete:'good',action:'average'}),
    candidate('Matt Serra','men',['Welterweight'],9,['division-depth','contrast'],{career:'average',striking:'average',grappling:'good',peak:'good',finishing:'average',complete:'good',action:'good'}),
    candidate('Josh Koscheck','men',['Welterweight'],8,['division-depth','specialist'],{career:'good',striking:'average',grappling:'great',peak:'great',finishing:'good',complete:'good',action:'good'}),
    candidate('Jake Shields','men',['Welterweight','Middleweight'],8,['division-depth','specialist','contrast'],{career:'good',striking:'bad',grappling:'elite',peak:'great',finishing:'below-average',complete:'good',action:'below-average'}),
    candidate('Thiago Alves','men',['Welterweight'],8,['division-depth','specialist'],{career:'average',striking:'great',grappling:'average',peak:'great',finishing:'good',complete:'good',action:'good'}),
    candidate('Vicente Luque','men',['Welterweight'],8,['division-depth','action'],{career:'good',striking:'good',grappling:'good',peak:'good',finishing:'great',complete:'good',action:'great'}),
    candidate('Gilbert Burns','men',['Welterweight','Lightweight'],9,['division-depth','specialist','action'],{career:'good',striking:'good',grappling:'great',peak:'great',finishing:'good',complete:'great',action:'great'}),
    candidate('Demian Maia','men',['Welterweight','Middleweight'],10,['division-depth','specialist','contrast'],{career:'good',striking:'below-average',grappling:'elite',peak:'great',finishing:'good',complete:'good',action:'average'}),
    candidate('Johny Hendricks','men',['Welterweight'],9,['division-depth','specialist'],{career:'great',striking:'great',grappling:'great',peak:'great',finishing:'good',complete:'great',action:'great'}),
    candidate('Jessica Andrade','women',['Strawweight','Flyweight','Bantamweight'],10,['women-depth','specialist','action'],{career:'great',striking:'great',grappling:'good',peak:'great',finishing:'great',complete:'great',action:'great'}),
    candidate('Claudia Gadelha','women',['Strawweight'],8,['women-depth','specialist'],{career:'good',striking:'good',grappling:'great',peak:'great',finishing:'average',complete:'great',action:'good'}),
    candidate('Cat Zingano','women',['Bantamweight','Featherweight'],8,['women-depth','contrast'],{career:'good',striking:'average',grappling:'good',peak:'great',finishing:'good',complete:'good',action:'great'}),
    candidate('Lauren Murphy','women',['Flyweight','Bantamweight'],7,['women-depth','lower-tier'],{career:'average',striking:'average',grappling:'average',peak:'good',finishing:'below-average',complete:'average',action:'average'}),
    candidate('Bethe Correia','women',['Bantamweight'],7,['women-depth','lower-tier'],{career:'below-average',striking:'average',grappling:'below-average',peak:'average',finishing:'below-average',complete:'below-average',action:'average'}),
    candidate('Tecia Torres','women',['Strawweight'],7,['women-depth'],{career:'average',striking:'good',grappling:'average',peak:'good',finishing:'bad',complete:'good',action:'average'}),
    candidate('Jennifer Maia','women',['Flyweight'],7,['women-depth'],{career:'average',striking:'average',grappling:'good',peak:'good',finishing:'average',complete:'good',action:'average'}),
    candidate('Chael Sonnen','men',['Middleweight','Light Heavyweight'],10,['specialist','contrast','star'],{career:'good',striking:'below-average',grappling:'great',peak:'great',finishing:'below-average',complete:'good',action:'good'}),
    candidate('Rich Franklin','men',['Middleweight','Light Heavyweight'],9,['specialist','veteran'],{career:'great',striking:'great',grappling:'good',peak:'great',finishing:'good',complete:'great',action:'good'}),
    candidate('Wanderlei Silva','men',['Middleweight','Light Heavyweight'],10,['specialist','action','star'],{career:'average',striking:'great',grappling:'average',peak:'great',finishing:'great',complete:'good',action:'elite'}),
    candidate('Forrest Griffin','men',['Light Heavyweight'],9,['action','contrast'],{career:'good',striking:'good',grappling:'average',peak:'good',finishing:'average',complete:'good',action:'great'}),
    candidate('Ovince Saint Preux','men',['Light Heavyweight'],7,['lower-tier','contrast'],{career:'average',striking:'average',grappling:'good',peak:'good',finishing:'good',complete:'average',action:'good'}),
    candidate('Derek Brunson','men',['Middleweight'],8,['specialist','contrast'],{career:'good',striking:'average',grappling:'great',peak:'good',finishing:'good',complete:'good',action:'good'}),
    candidate('Kelvin Gastelum','men',['Welterweight','Middleweight'],9,['action','contrast'],{career:'average',striking:'good',grappling:'good',peak:'great',finishing:'good',complete:'good',action:'great'})
  ];

  const api={
    version:VERSION,
    phase:3,
    thresholds:THRESHOLDS,
    expansionCandidates:EXPANSION_CANDIDATES,
    report:null,
    photoAudit:null,
    rebuild,
    pack(packId){return api.report?.packs?.find(pack=>pack.packId===packId)||null;},
    category(categoryId){return api.report?.categories?.find(category=>category.categoryId===categoryId)||null;},
    shortages(){return api.report?.shortages||[];},
    expansionQueue(limit=30){return (api.report?.expansionPlan?.queue||[]).slice(0,Math.max(1,Number(limit)||30));},
    verifyPhotos,
    consoleReport
  };

  function text(value){return String(value??'').trim();}
  function normal(value){return text(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();}
  function slug(value){return normal(value).replace(/\s+/g,'-');}
  function finite(value){return value!==null&&value!==''&&Number.isFinite(Number(value));}
  function round(value,digits=2){const factor=10**digits;return Math.round((Number(value)||0)*factor)/factor;}
  function percent(value,total,digits=1){return total?round((Number(value)||0)*100/total,digits):0;}
  function increment(object,key,amount=1){object[key]=(object[key]||0)+amount;}
  function candidate(name,gender,divisions,recognition,batches,tiers){return Object.freeze({id:slug(name),name,gender,divisions:Object.freeze(divisions),recognition,batches:Object.freeze(batches),tiers:Object.freeze(tiers),photoNeeded:true});}
  function matches(entry,filters={},eras=[]){
    if(filters.gender&&filters.gender!=='all'&&entry.gender!==filters.gender)return false;
    if(filters.division&&filters.division!=='all'&&!entry.divisions.some(value=>normal(value)===normal(filters.division)))return false;
    if(eras.length&&!entry.eras.some(value=>eras.includes(value)))return false;
    return true;
  }
  function poolType(pack){if(pack.filters?.division)return'division';if(pack.filters?.gender==='women')return'women';if(pack.eras?.length)return'era';return'broad';}
  function tierDemand(architecture){
    const totals=Object.fromEntries(TIER_IDS.map(tier=>[tier,0]));
    (architecture?.lineupRoles||[]).forEach(role=>Object.entries(role.weights||{}).forEach(([tier,weight])=>increment(totals,tier,Number(weight)||0)));
    return Object.fromEntries(TIER_IDS.map(tier=>[tier,{selectionsPerGame:round(totals[tier],3),selectionSharePct:percent(totals[tier],architecture?.lineupRules?.lineupSize||5,1),selectionsPer100Games:round(totals[tier]*100,1)}]));
  }
  function tierCounts(rows){const counts=Object.fromEntries(TIER_IDS.map(tier=>[tier,0]));rows.forEach(row=>increment(counts,row.tier));return counts;}
  function tierNames(rows){return Object.fromEntries(TIER_IDS.map(tier=>[tier,rows.filter(row=>row.tier===tier).map(row=>row.entry.fighterName)]));}
  function photoSummary(rows,playData){
    const fighters=rows.map(row=>playData?.byId?.[row.entry.fighterId]).filter(Boolean);
    return {
      total:fighters.length,
      explicit:fighters.filter(fighter=>fighter.photoExplicit).length,
      conventionOnly:fighters.filter(fighter=>!fighter.photoExplicit).length,
      missingDeclaredThumb:fighters.filter(fighter=>!text(fighter.thumbUrl)).map(fighter=>fighter.name),
      missingDeclaredProfile:fighters.filter(fighter=>!text(fighter.profileUrl)).map(fighter=>fighter.name),
      verification:'Run UFC_BLIND_RANK_POOL_AUDIT.verifyPhotos() for exact file checks.'
    };
  }
  function statusForPack(type,total,counts,missingRatings){
    const threshold=THRESHOLDS.pool[type];
    const minimumTierGaps=TIER_IDS.reduce((sum,tier)=>sum+Math.max(0,THRESHOLDS.tier.minimum[tier]-counts[tier]),0);
    const preferredTierGaps=TIER_IDS.reduce((sum,tier)=>sum+Math.max(0,THRESHOLDS.tier.preferred[tier]-counts[tier]),0);
    if(missingRatings||total<5)return'blocked';
    if(total<threshold.minimum||minimumTierGaps)return'needs-expansion';
    if(total<threshold.preferred||preferredTierGaps)return'playable-thin';
    return'healthy';
  }
  function packAudit(pack,entries,architecture,playData,demand){
    const eligible=entries.filter(entry=>matches(entry,pack.filters||{},pack.eras||[]));
    const rows=eligible.map(entry=>({entry,rating:architecture.ratingForPack(entry,pack.id)})).filter(row=>row.rating).map(row=>({...row,tier:row.rating.tier.id}));
    const counts=tierCounts(rows);
    const names=tierNames(rows);
    const type=poolType(pack);
    const threshold=THRESHOLDS.pool[type];
    const missingRatings=eligible.length-rows.length;
    const minimumTierGaps=Object.fromEntries(TIER_IDS.map(tier=>[tier,Math.max(0,THRESHOLDS.tier.minimum[tier]-counts[tier])]));
    const preferredTierGaps=Object.fromEntries(TIER_IDS.map(tier=>[tier,Math.max(0,THRESHOLDS.tier.preferred[tier]-counts[tier])]));
    const pressure=Object.fromEntries(TIER_IDS.map(tier=>[tier,{count:counts[tier],expectedAppearancesPerFighterPer100Games:counts[tier]?round(demand[tier].selectionsPer100Games/counts[tier],1):null,thinFighters:counts[tier]<THRESHOLDS.tier.minimum[tier]?names[tier]:[]} ]));
    const status=statusForPack(type,rows.length,counts,missingRatings);
    const provisional=rows.filter(row=>(row.entry.reviewStatus?.[row.rating.path]||row.entry.overallReviewStatus)==='provisional').length;
    const fallbackRatings=rows.filter(row=>row.rating.fallback).length;
    const poolGap=Math.max(0,threshold.minimum-rows.length);
    const preferredPoolGap=Math.max(0,threshold.preferred-rows.length);
    const minimumTierGapTotal=Object.values(minimumTierGaps).reduce((sum,value)=>sum+value,0);
    const preferredTierGapTotal=Object.values(preferredTierGaps).reduce((sum,value)=>sum+value,0);
    return {
      packId:pack.id,
      packName:pack.name,
      categoryId:pack.categoryId,
      packStatus:pack.status,
      poolType:type,
      status,
      eligible:eligible.length,
      rated:rows.length,
      missingRatings,
      thresholds:threshold,
      tierCounts:counts,
      tierFighters:names,
      tierPressure:pressure,
      minimumTierGaps,
      preferredTierGaps,
      provisionalRatings:provisional,
      provisionalPct:percent(provisional,rows.length,1),
      fallbackRatings,
      fallbackPct:percent(fallbackRatings,rows.length,1),
      repeatProtection:{fullWindowSupported:rows.length>=THRESHOLDS.repeatProtection.recentRevealWindow+THRESHOLDS.repeatProtection.lineupSize,fightersRemainingAfter15:Math.max(0,rows.length-THRESHOLDS.repeatProtection.recentRevealWindow)},
      recommendedAdds:{minimum:Math.max(poolGap,minimumTierGapTotal),preferred:Math.max(preferredPoolGap,preferredTierGapTotal)},
      photoReadiness:photoSummary(rows,playData)
    };
  }
  function categoryAudit(category,entries,architecture,demand){
    const rows=entries.map(entry=>{
      const value=String(category.ratingPath||'').split('.').reduce((current,key)=>current==null?undefined:current[key],entry.ratings);
      const tier=architecture.tierForScore(value)?.id;
      return finite(value)&&tier?{entry,value:Number(value),tier}:null;
    }).filter(Boolean);
    const counts=tierCounts(rows);
    return {categoryId:category.id,categoryName:category.name,status:category.status,eligible:entries.length,rated:rows.length,missing:entries.length-rows.length,tierCounts:counts,tierPressure:Object.fromEntries(TIER_IDS.map(tier=>[tier,{count:counts[tier],expectedAppearancesPerFighterPer100Games:counts[tier]?round(demand[tier].selectionsPer100Games/counts[tier],1):null}])),reviewStatus:entries.reduce((summary,entry)=>{increment(summary,entry.reviewStatus?.[category.ratingPath]||'missing');return summary;},{})};
  }
  function candidateTier(candidate,pack){return candidate.tiers[pack.categoryId]||candidate.tiers.career||null;}
  function candidateMatchesPack(candidate,pack){
    if(pack.filters?.gender&&pack.filters.gender!=='all'&&candidate.gender!==pack.filters.gender)return false;
    if(pack.filters?.division&&!candidate.divisions.some(value=>normal(value)===normal(pack.filters.division)))return false;
    if(pack.eras?.length)return false;
    return true;
  }
  function contrastScore(candidate){const indexes=Object.values(candidate.tiers).map(tier=>TIER_INDEX[tier]).filter(Number.isFinite);return indexes.length?Math.max(...indexes)-Math.min(...indexes):0;}
  function expansionPlan(report,architecture,entries){
    const current=new Set(entries.map(entry=>normal(entry.fighterName)));
    const packMap=Object.fromEntries(report.packs.map(pack=>[pack.packId,pack]));
    const candidates=EXPANSION_CANDIDATES.filter(candidate=>!current.has(normal(candidate.name))).map(candidate=>{
      let score=candidate.recognition*2;
      const fills=[];
      (architecture.packs||[]).forEach(pack=>{
        const audit=packMap[pack.id];
        if(!audit||!candidateMatchesPack(candidate,pack))return;
        const tier=candidateTier(candidate,pack);
        if(!tier)return;
        const minimumGap=audit.minimumTierGaps[tier]||0;
        const preferredGap=audit.preferredTierGaps[tier]||0;
        const poolGap=Math.max(0,audit.thresholds.minimum-audit.rated);
        const packMultiplier=pack.filters?.division?2.4:pack.filters?.gender==='women'?2.0:pack.status==='launch'?1.4:1;
        const tierBonus=tier==='bad'?8:tier==='below-average'?6:0;
        const points=((minimumGap*14)+(preferredGap*4)+(poolGap?4:0)+tierBonus)*packMultiplier;
        if(points>0){score+=points;fills.push({packId:pack.id,packName:pack.name,tier,minimumGap,preferredGap});}
      });
      score+=contrastScore(candidate)*5;
      if(candidate.batches.includes('division-depth'))score+=8;
      if(candidate.batches.includes('lower-tier'))score+=8;
      if(candidate.batches.includes('specialist'))score+=5;
      return {...candidate,score:round(score,1),fills:fills.sort((a,b)=>(b.minimumGap-a.minimumGap)||(b.preferredGap-a.preferredGap))};
    }).sort((a,b)=>b.score-a.score||b.recognition-a.recognition||a.name.localeCompare(b.name));
    const batch=(tag,limit)=>candidates.filter(candidate=>candidate.batches.includes(tag)).slice(0,limit).map(candidate=>({name:candidate.name,score:candidate.score,divisions:candidate.divisions,topFill:candidate.fills[0]||null}));
    return {currentRoster:entries.length,targetRange:[THRESHOLDS.roster.targetLow,THRESHOLDS.roster.targetHigh],additionsToTargetLow:Math.max(0,THRESHOLDS.roster.targetLow-entries.length),additionsToTargetHigh:Math.max(0,THRESHOLDS.roster.targetHigh-entries.length),queue:candidates,recommendedBatches:[{id:'division-depth',targetSize:12,candidates:batch('division-depth',12)},{id:'lower-tier-variety',targetSize:10,candidates:batch('lower-tier',10)},{id:'skill-specialists',targetSize:10,candidates:batch('specialist',10)},{id:'women-depth',targetSize:8,candidates:batch('women-depth',8)}]};
  }
  function buildShortages(packs){
    const shortages=[];
    packs.forEach(pack=>{if(pack.status==='healthy')return;const thinTiers=TIER_IDS.filter(tier=>pack.tierCounts[tier]<THRESHOLDS.tier.minimum[tier]);shortages.push({packId:pack.packId,packName:pack.packName,status:pack.status,poolGap:Math.max(0,pack.thresholds.minimum-pack.rated),thinTiers,minimumTierGaps:pack.minimumTierGaps,recommendedAdds:pack.recommendedAdds.minimum});});
    return shortages.sort((a,b)=>b.recommendedAdds-a.recommendedAdds||b.poolGap-a.poolGap||a.packName.localeCompare(b.packName));
  }
  function rebuild(){
    const architecture=root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE;
    const ratings=root.UFC_BLIND_RANK_CATEGORY_RATINGS;
    const playData=root.UFC_PLAY_DATA;
    if(!architecture||!ratings||!playData){api.report={version:VERSION,phase:3,pending:true,passed:false,errors:['Required Blind Rank data is not ready.']};return api;}
    ratings.rebuild?.();
    const entries=[...(ratings.entries||[])];
    const demand=tierDemand(architecture);
    const packs=(architecture.packs||[]).map(pack=>packAudit(pack,entries,architecture,playData,demand));
    const categories=(architecture.categories||[]).map(category=>categoryAudit(category,entries,architecture,demand));
    const errors=[];
    if(!ratings.audit?.passed)errors.push('Phase 2 rating ledger audit is not passing.');
    const blocked=packs.filter(pack=>pack.packStatus==='launch'&&pack.status==='blocked');
    if(blocked.length)errors.push(`${blocked.length} launch packs are blocked.`);
    const report={version:VERSION,phase:3,passed:errors.length===0,errors,roster:{total:entries.length,modelRanked:entries.filter(entry=>entry.modelRanked).length,playOnly:entries.filter(entry=>!entry.modelRanked).length,targetLow:THRESHOLDS.roster.targetLow,targetHigh:THRESHOLDS.roster.targetHigh},tierDemand:demand,categories,packs,packStatusCounts:packs.reduce((counts,pack)=>{increment(counts,pack.status);return counts;},{}),shortages:buildShortages(packs),provisionalRatings:{fighters:entries.filter(entry=>entry.overallReviewStatus==='provisional').map(entry=>entry.fighterName),count:entries.filter(entry=>entry.overallReviewStatus==='provisional').length},photoReadiness:{explicit:playData.allFighters.filter(fighter=>fighter.photoExplicit).length,conventionOnly:playData.allFighters.filter(fighter=>!fighter.photoExplicit).length,verified:api.photoAudit?.verified||false},expansionPlan:null};
    report.expansionPlan=expansionPlan(report,architecture,entries);
    api.report=report;
    root.document?.documentElement?.setAttribute('data-blind-rank-pool-audit',VERSION);
    root.document?.documentElement?.setAttribute('data-blind-rank-pool-audit-status',report.passed?'passed':'failed');
    root.document?.documentElement?.setAttribute('data-blind-rank-pool-audit-roster',String(entries.length));
    if(typeof root.dispatchEvent==='function'&&typeof root.CustomEvent==='function')root.dispatchEvent(new root.CustomEvent('ufc-blind-rank-pool-audit-ready',{detail:{version:VERSION,report}}));
    return api;
  }

  async function verifyUrl(url){
    if(!url)return false;
    try{const response=await root.fetch(url,{method:'HEAD',cache:'no-store'});if(response.ok)return true;if(response.status!==405)return false;}catch(_error){}
    try{const response=await root.fetch(url,{method:'GET',cache:'force-cache'});if(response.body?.cancel)response.body.cancel();return response.ok;}catch(_error){return false;}
  }
  async function mapLimit(rows,limit,worker){const results=new Array(rows.length);let cursor=0;async function run(){while(cursor<rows.length){const index=cursor++;results[index]=await worker(rows[index],index);}}await Promise.all(Array.from({length:Math.min(limit,rows.length)},run));return results;}
  async function verifyPhotos(options={}){
    const playData=root.UFC_PLAY_DATA;
    if(!playData)return null;
    const force=Boolean(options.force);
    if(!force){try{const cached=JSON.parse(root.sessionStorage?.getItem(PHOTO_CACHE_KEY)||'null');if(cached?.version===VERSION){api.photoAudit=cached;rebuild();return cached;}}catch(_error){}}
    const fighters=playData.poolFor('blind-rank');
    const results=await mapLimit(fighters,Math.max(1,Math.min(12,Number(options.concurrency)||8)),async fighter=>{const thumb=await verifyUrl(fighter.thumbUrl);const profile=await verifyUrl(fighter.profileUrl);return {fighterId:fighter.id,fighterName:fighter.name,thumbUrl:fighter.thumbUrl,profileUrl:fighter.profileUrl,thumb,profile,ready:thumb&&profile};});
    const audit={version:VERSION,verified:true,total:results.length,ready:results.filter(row=>row.ready).length,missingThumb:results.filter(row=>!row.thumb).map(row=>row.fighterName),missingProfile:results.filter(row=>!row.profile).map(row=>row.fighterName),results};
    api.photoAudit=audit;
    try{root.sessionStorage?.setItem(PHOTO_CACHE_KEY,JSON.stringify(audit));}catch(_error){}
    rebuild();
    return audit;
  }
  function consoleReport(){
    const report=api.report||rebuild().report;
    if(!root.console)return report;
    root.console.group?.('Blind Rank Phase 3 Pool Audit');
    root.console.log('Roster',report.roster);
    root.console.table?.(report.packs.map(pack=>({pack:pack.packName,status:pack.status,rated:pack.rated,elite:pack.tierCounts.elite,great:pack.tierCounts.great,good:pack.tierCounts.good,average:pack.tierCounts.average,below:pack.tierCounts['below-average'],bad:pack.tierCounts.bad,adds:pack.recommendedAdds.minimum})));
    root.console.table?.(report.expansionPlan.queue.slice(0,20).map(candidate=>({fighter:candidate.name,score:candidate.score,divisions:candidate.divisions.join(' / '),topNeed:candidate.fills[0]?.packName||candidate.batches.join(', '),projectedTier:candidate.fills[0]?.tier||''})));
    root.console.groupEnd?.();
    return report;
  }

  root.UFC_BLIND_RANK_POOL_AUDIT=api;
  rebuild();
  root.addEventListener?.('ufc-blind-rank-category-ratings-ready',rebuild);
  root.addEventListener?.('ufc-play-data-ready',rebuild);
  root.addEventListener?.('ufc-scoring-pipeline-ready',rebuild);
})(typeof window!=='undefined'?window:globalThis);
