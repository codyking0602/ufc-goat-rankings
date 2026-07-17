(function(root){
  'use strict';

  const VERSION='blind-rank-category-ratings-20260717a-phase-two';
  const REQUIRED_PATHS=['career.overall','striking','grappling','peak','finishing','complete','action'];
  const SOURCE_CATEGORY={
    career:'allCareers',
    peak:'hardestAtPeak',
    finishing:'bestFinisher',
    complete:'mostComplete',
    action:'actionFighter',
    starPower:'starPower'
  };

  const STRIKING_ANCHORS=ratingMap([
    ['Anderson Silva',99],['Israel Adesanya',98],['Alex Pereira',97],['Jose Aldo',96],['Max Holloway',96],
    ['Joanna Jedrzejczyk',95],['Valentina Shevchenko',95],['Alexander Volkanovski',94],['Conor McGregor',94],
    ['Ilia Topuria',93],['Petr Yan',92],['Stephen Thompson',92],['Sean O’Malley',91],['Edson Barboza',91],
    ['Dustin Poirier',90],['Lyoto Machida',90],['Zhang Weili',89],['Amanda Nunes',89],['Justin Gaethje',88],
    ['Chuck Liddell',88],['Robert Whittaker',88],['Demetrious Johnson',88],['Jon Jones',87],['Anthony Pettis',87],
    ['Robbie Lawler',87],['Carlos Condit',86],['Quinton Jackson',86],['Georges St-Pierre',86],['Cody Garbrandt',86],
    ['Alexander Gustafsson',85],['Holly Holm',85],['Jorge Masvidal',84],['Donald Cerrone',84],['Junior dos Santos',84],
    ['Rose Namajunas',84],['T.J. Dillashaw',84],['Deiveson Figueiredo',83],['Brandon Moreno',83],['Cub Swanson',82],
    ['Chan Sung Jung',82],['Dan Hooker',82],['Michael Chandler',82],['Paulo Costa',82],['Darren Till',82],
    ['Angela Hill',82],['Charles Oliveira',81],['Stipe Miocic',81],['Francis Ngannou',81],['Tony Ferguson',81],
    ['Frankie Edgar',81],['Michel Pereira',80],['Islam Makhachev',80],['Matt Brown',80],['Nick Diaz',82],
    ['Nate Diaz',78],['Rory MacDonald',78],['Yoel Romero',78],['Michelle Waterson-Gomez',78],['Karolina Kowalkiewicz',78],
    ['Kevin Holland',78],['Michael Bisping',78],['Dricus du Plessis',78],['Leon Edwards',87],['Tyron Woodley',78],
    ['Chris Weidman',72],['Luke Rockhold',76],['Cain Velasquez',73],['Daniel Cormier',70],['Kamaru Usman',76],
    ['Henry Cejudo',77],['B.J. Penn',80],['Dominick Cruz',84],['Rafael dos Anjos',79],['Benson Henderson',77],
    ['Eddie Alvarez',79],['Alexandre Pantoja',78],['Aljamain Sterling',70],['Merab Dvalishvili',68],['Khabib Nurmagomedov',72],
    ['Matt Hughes',62],['Randy Couture',60],['Urijah Faber',70],['Colby Covington',65],['Kevin Lee',65],
    ['Clay Guida',55],['Diego Sanchez',60],['Joe Lauzon',62],['Sage Northcutt',62],['Chris Leben',72],
    ['Houston Alexander',65],['Mike Perry',75],['Sam Alvey',68],['Artem Lobov',60],['Tai Tuivasa',72],
    ['Derrick Lewis',70],['Brock Lesnar',45],['Fabricio Werdum',60],['Frank Mir',55],['Royce Gracie',25],
    ['Ken Shamrock',36],['Frank Shamrock',68],['Mark Coleman',35],['Tito Ortiz',58],['Rashad Evans',72],
    ['Glover Teixeira',66],['Mauricio Rua',82],['Ronda Rousey',52],['Miesha Tate',58],['Julianna Peña',57],
    ['Carla Esparza',48],['Alexa Grasso',82],['Kayla Harrison',58],['Mackenzie Dern',62],['Paige VanZant',58],
    ['Maycee Barber',70],['Molly McCann',68],['Kimbo Slice',45],['CM Punk',5],['Ben Askren',18]
  ]);

  const GRAPPLING_ANCHORS=ratingMap([
    ['Khabib Nurmagomedov',99],['Islam Makhachev',98],['Georges St-Pierre',97],['Demetrious Johnson',97],
    ['Jon Jones',96],['Charles Oliveira',96],['Fabricio Werdum',95],['Daniel Cormier',95],['Ronda Rousey',95],
    ['Matt Hughes',94],['Henry Cejudo',94],['Alexandre Pantoja',94],['Aljamain Sterling',93],['Merab Dvalishvili',92],
    ['B.J. Penn',91],['Cain Velasquez',91],['Urijah Faber',90],['Valentina Shevchenko',90],['Kamaru Usman',90],
    ['Colby Covington',89],['Yoel Romero',88],['Randy Couture',88],['Amanda Nunes',88],['Glover Teixeira',88],
    ['Chris Weidman',87],['Frank Mir',87],['T.J. Dillashaw',86],['Michael Chandler',85],['Kevin Lee',84],
    ['Benson Henderson',84],['Rafael dos Anjos',84],['Frankie Edgar',84],['Zhang Weili',83],['Rory MacDonald',82],
    ['Joe Lauzon',82],['Rose Namajunas',82],['Miesha Tate',82],['Deiveson Figueiredo',81],['Brandon Moreno',81],
    ['Nate Diaz',80],['Tony Ferguson',80],['Nick Diaz',77],['Clay Guida',78],['Donald Cerrone',78],
    ['Anthony Pettis',76],['Diego Sanchez',76],['Petr Yan',78],['Dominick Cruz',79],['Alexander Volkanovski',86],
    ['Jose Aldo',82],['Ilia Topuria',85],['Dustin Poirier',74],['Justin Gaethje',67],['Max Holloway',72],
    ['Anderson Silva',72],['Israel Adesanya',62],['Alex Pereira',57],['Conor McGregor',64],['Robert Whittaker',78],
    ['Stipe Miocic',76],['Francis Ngannou',66],['Junior dos Santos',62],['Brock Lesnar',86],['Tito Ortiz',86],
    ['Rashad Evans',84],['Frank Shamrock',88],['Ken Shamrock',84],['Royce Gracie',94],['Mark Coleman',88],
    ['Mauricio Rua',67],['Chuck Liddell',58],['Quinton Jackson',55],['Lyoto Machida',66],['Alexander Gustafsson',72],
    ['Robbie Lawler',60],['Tyron Woodley',78],['Leon Edwards',74],['Carlos Condit',65],['Jorge Masvidal',67],
    ['Matt Brown',62],['Dan Hooker',62],['Kevin Holland',72],['Michel Pereira',65],['Paulo Costa',52],
    ['Darren Till',50],['Stephen Thompson',48],['Edson Barboza',55],['Sean O’Malley',60],['Cody Garbrandt',62],
    ['Cub Swanson',70],['Chan Sung Jung',72],['Angela Hill',55],['Michelle Waterson-Gomez',70],['Holly Holm',62],
    ['Joanna Jedrzejczyk',70],['Alexa Grasso',72],['Julianna Peña',78],['Carla Esparza',86],['Kayla Harrison',96],
    ['Mackenzie Dern',95],['Maycee Barber',72],['Paige VanZant',62],['Molly McCann',55],['Karolina Kowalkiewicz',52],
    ['Derrick Lewis',38],['Tai Tuivasa',35],['Kimbo Slice',20],['Houston Alexander',25],['Chris Leben',45],
    ['Mike Perry',48],['Sam Alvey',40],['Artem Lobov',42],['Sage Northcutt',58],['CM Punk',8],['Ben Askren',94]
  ]);

  const api={
    version:VERSION,
    phase:2,
    entries:[],
    byId:{},
    byName:{},
    audit:null,
    anchors:{striking:STRIKING_ANCHORS,grappling:GRAPPLING_ANCHORS},
    rebuild,
    resolve(value){
      const target=normal(typeof value==='object'?(value.id||value.name):value);
      if(!target)return null;
      return api.byId[slug(target)]||api.byName[target]||null;
    },
    ratingFor(value,path){return getPath(api.resolve(value)?.ratings,path)??null;},
    tierFor(value,path){return api.resolve(value)?.tiers?.[path]||null;},
    ratingForPack(value,packId){
      const architecture=root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE;
      return architecture?.ratingForPack?.(api.resolve(value),packId)||null;
    },
    poolFor(packId,filters={}){
      const architecture=root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE;
      const pack=architecture?.packFor?.(packId);
      if(!pack)return[];
      return api.entries.filter(entry=>matches(entry,{...(pack.filters||{}),eras:pack.eras||[],...filters})&&architecture.ratingForPack(entry,pack.id));
    }
  };

  function ratingMap(rows){return Object.freeze(Object.fromEntries(rows.map(([name,rating])=>[normal(name),Number(rating)])));}
  function text(value){return String(value??'').trim();}
  function normal(value){return text(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();}
  function slug(value){return normal(value).replace(/\s+/g,'-');}
  function clamp(value,min=0,max=100){return Math.max(min,Math.min(max,Number(value)||0));}
  function rounded(value){return Math.round(clamp(value));}
  function getPath(object,path){return String(path||'').split('.').filter(Boolean).reduce((value,key)=>value==null?undefined:value[key],object);}
  function finite(value){return value!==null&&value!==''&&Number.isFinite(Number(value));}
  function tierId(score){return root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE?.tierForScore?.(score)?.id||null;}
  function tagSet(fighter){return new Set(fighter?.tags||[]);}

  function sourceRating(source,key,fallback=50){const value=source?.ratings?.[key];return finite(value)?Number(value):fallback;}
  function skillRating(fighter,source,category){
    const anchors=category==='striking'?STRIKING_ANCHORS:GRAPPLING_ANCHORS;
    const anchored=anchors[normal(fighter.name)];
    if(finite(anchored))return {score:Number(anchored),source:'approved-anchor',status:'approved'};

    const career=sourceRating(source,'allCareers',50);
    const peak=sourceRating(source,'hardestAtPeak',50);
    const complete=sourceRating(source,'mostComplete',50);
    const finishing=sourceRating(source,'bestFinisher',50);
    const tags=tagSet(fighter);
    let score;
    if(category==='striking'){
      score=16+(complete*0.42)+(finishing*0.28)+(peak*0.10)+(career*0.05);
      if(tags.has('striker'))score+=10;
      if(tags.has('knockout')||tags.has('power'))score+=5;
      if(tags.has('technical'))score+=4;
      if(tags.has('highlight'))score+=3;
    }else{
      score=15+(complete*0.56)+(peak*0.18)+(career*0.08)-(finishing*0.03);
      if(tags.has('wrestler'))score+=11;
      if(tags.has('submission'))score+=10;
      if(tags.has('grappler'))score+=10;
      if(tags.has('tuf-winner'))score+=2;
      if(tags.has('technical'))score+=2;
    }
    return {score:rounded(Math.min(89,score)),source:'derived-skill-baseline',status:'provisional'};
  }

  function divisionRatings(source){
    const ratings={};
    Object.entries(source?.divisionRatings||{}).forEach(([division,value])=>{
      if(finite(value))ratings[slug(division)]=Number(value);
    });
    return ratings;
  }

  function sourceMeta(source,key){
    return {
      source:source?.ratingSources?.[key]||'missing-source',
      status:source?.reviewStatus?.[key]||'provisional'
    };
  }

  function buildEntry(fighter,source){
    const striking=skillRating(fighter,source,'striking');
    const grappling=skillRating(fighter,source,'grappling');
    const careerMeta=sourceMeta(source,SOURCE_CATEGORY.career);
    const peakMeta=sourceMeta(source,SOURCE_CATEGORY.peak);
    const finishingMeta=sourceMeta(source,SOURCE_CATEGORY.finishing);
    const completeMeta=sourceMeta(source,SOURCE_CATEGORY.complete);
    const actionMeta=sourceMeta(source,SOURCE_CATEGORY.action);
    const starMeta=sourceMeta(source,SOURCE_CATEGORY.starPower);
    const ratings={
      career:{
        overall:rounded(sourceRating(source,SOURCE_CATEGORY.career,45)),
        divisions:divisionRatings(source)
      },
      striking:rounded(striking.score),
      grappling:rounded(grappling.score),
      peak:rounded(sourceRating(source,SOURCE_CATEGORY.peak,45)),
      finishing:rounded(sourceRating(source,SOURCE_CATEGORY.finishing,45)),
      complete:rounded(sourceRating(source,SOURCE_CATEGORY.complete,45)),
      action:rounded(sourceRating(source,SOURCE_CATEGORY.action,45)),
      starPower:rounded(sourceRating(source,SOURCE_CATEGORY.starPower,45))
    };
    const ratingSources={
      'career.overall':careerMeta.source,
      striking:striking.source,
      grappling:grappling.source,
      peak:peakMeta.source,
      finishing:finishingMeta.source,
      complete:completeMeta.source,
      action:actionMeta.source,
      starPower:starMeta.source
    };
    const reviewStatus={
      'career.overall':careerMeta.status,
      striking:striking.status,
      grappling:grappling.status,
      peak:peakMeta.status,
      finishing:finishingMeta.status,
      complete:completeMeta.status,
      action:actionMeta.status,
      starPower:starMeta.status
    };
    Object.entries(ratings.career.divisions).forEach(([division])=>{
      const original=Object.keys(source?.divisionRatings||{}).find(value=>slug(value)===division);
      ratingSources[`career.divisions.${division}`]=source?.divisionSources?.[original]||'division-source';
      reviewStatus[`career.divisions.${division}`]=source?.divisionReviewStatus?.[original]||'provisional';
    });
    const tiers={};
    REQUIRED_PATHS.concat('starPower').forEach(path=>{tiers[path]=tierId(getPath(ratings,path));});
    Object.entries(ratings.career.divisions).forEach(([division,value])=>{tiers[`career.divisions.${division}`]=tierId(value);});
    const requiredStatuses=REQUIRED_PATHS.map(path=>reviewStatus[path]);
    const overallReviewStatus=requiredStatuses.includes('provisional')?'provisional':requiredStatuses.includes('derived')?'derived':'ready';
    return {
      fighterId:fighter.id,
      fighterName:fighter.name,
      gender:fighter.gender,
      divisions:[...(fighter.divisions||[])],
      primaryDivision:fighter.primaryDivision||fighter.divisions?.[0]||'',
      eras:[...(fighter.eras||[])],
      tags:[...(fighter.tags||[])],
      modelRanked:Boolean(fighter.modelRanked),
      rosterSource:fighter.source||'unknown',
      ratings,
      tiers,
      ratingSources,
      reviewStatus,
      overallReviewStatus,
      ineligible:[]
    };
  }

  function matches(entry,filters={}){
    if(filters.gender&&filters.gender!=='all'&&entry.gender!==filters.gender)return false;
    if(filters.division&&filters.division!=='all'&&!entry.divisions.some(value=>normal(value)===normal(filters.division)))return false;
    if(Array.isArray(filters.eras)&&filters.eras.length&&!entry.eras.some(value=>filters.eras.includes(value)))return false;
    if(filters.reviewStatus&&filters.reviewStatus!=='all'&&entry.overallReviewStatus!==filters.reviewStatus)return false;
    return true;
  }

  function auditEntries(entries,roster,sourceEntries){
    const architecture=root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE;
    const errors=[];
    const warnings=[];
    const rosterIds=new Set(roster.map(fighter=>fighter.id));
    const entryIds=new Set(entries.map(entry=>entry.fighterId));
    const sourceIds=new Set(sourceEntries.map(entry=>entry.id));
    const missingFighters=roster.filter(fighter=>!entryIds.has(fighter.id)).map(fighter=>fighter.name);
    const missingSource=roster.filter(fighter=>!sourceIds.has(fighter.id)).map(fighter=>fighter.name);
    const orphanedEntries=entries.filter(entry=>!rosterIds.has(entry.fighterId)).map(entry=>entry.fighterName);
    const invalidRecords=[];
    const missingRatings={};
    const invalidRatings={};
    const tierCounts={};
    const statusCounts={};
    const sourceCounts={};

    entries.forEach(entry=>{
      const validation=architecture?.validateRatingRecord?.(entry);
      if(validation&&!validation.passed)invalidRecords.push({fighter:entry.fighterName,errors:validation.errors});
    });

    REQUIRED_PATHS.concat('starPower').forEach(path=>{
      missingRatings[path]=entries.filter(entry=>!finite(getPath(entry.ratings,path))).map(entry=>entry.fighterName);
      invalidRatings[path]=entries.filter(entry=>finite(getPath(entry.ratings,path))&&(Number(getPath(entry.ratings,path))<0||Number(getPath(entry.ratings,path))>100)).map(entry=>entry.fighterName);
      tierCounts[path]=Object.fromEntries((architecture?.tiers||[]).map(tier=>[tier.id,entries.filter(entry=>entry.tiers[path]===tier.id).length]));
      statusCounts[path]=entries.reduce((counts,entry)=>{const status=entry.reviewStatus[path]||'missing';counts[status]=(counts[status]||0)+1;return counts;},{});
      sourceCounts[path]=entries.reduce((counts,entry)=>{const source=entry.ratingSources[path]||'missing';counts[source]=(counts[source]||0)+1;return counts;},{});
    });

    const packCoverage=(architecture?.packs||[]).map(pack=>{
      const filtered=entries.filter(entry=>matches(entry,{...(pack.filters||{}),eras:pack.eras||[]}));
      const rated=filtered.filter(entry=>architecture.ratingForPack(entry,pack.id));
      const tiers=Object.fromEntries((architecture.tiers||[]).map(tier=>[tier.id,0]));
      rated.forEach(entry=>{const rating=architecture.ratingForPack(entry,pack.id);if(rating?.tier?.id)tiers[rating.tier.id]=(tiers[rating.tier.id]||0)+1;});
      return {packId:pack.id,status:pack.status,eligible:filtered.length,rated:rated.length,missing:filtered.length-rated.length,tierCounts:tiers};
    });

    if(missingFighters.length)errors.push(`Missing roster fighters: ${missingFighters.join(', ')}`);
    if(missingSource.length)errors.push(`Missing Keep/Cut source entries: ${missingSource.join(', ')}`);
    if(orphanedEntries.length)errors.push(`Orphaned Blind Rank entries: ${orphanedEntries.join(', ')}`);
    if(invalidRecords.length)errors.push(`${invalidRecords.length} records failed the Phase 1 contract.`);
    REQUIRED_PATHS.forEach(path=>{
      if(missingRatings[path].length)errors.push(`${path} is missing ${missingRatings[path].length} ratings.`);
      if(invalidRatings[path].length)errors.push(`${path} has ${invalidRatings[path].length} invalid ratings.`);
    });
    packCoverage.filter(pack=>pack.status==='launch'&&pack.missing).forEach(pack=>errors.push(`${pack.packId} is missing ${pack.missing} eligible ratings.`));
    const provisional=entries.filter(entry=>entry.overallReviewStatus==='provisional').length;
    if(provisional)warnings.push(`${provisional} fighters have at least one provisional launch-category rating.`);

    return {
      passed:errors.length===0,
      version:VERSION,
      errors,
      warnings,
      rosterTotal:roster.length,
      sourceTotal:sourceEntries.length,
      ledgerTotal:entries.length,
      modelRanked:entries.filter(entry=>entry.modelRanked).length,
      playOnly:entries.filter(entry=>!entry.modelRanked).length,
      ready:entries.filter(entry=>entry.overallReviewStatus==='ready').length,
      derived:entries.filter(entry=>entry.overallReviewStatus==='derived').length,
      provisional,
      approvedSkillAnchors:{
        striking:entries.filter(entry=>entry.reviewStatus.striking==='approved').length,
        grappling:entries.filter(entry=>entry.reviewStatus.grappling==='approved').length
      },
      missingFighters,
      missingSource,
      orphanedEntries,
      invalidRecords,
      missingRatings,
      invalidRatings,
      tierCounts,
      statusCounts,
      sourceCounts,
      packCoverage
    };
  }

  let lastSignature='';
  function rebuild(){
    const playData=root.UFC_PLAY_DATA;
    const sourceApi=root.UFC_KEEP_CUT_CATEGORY_RATINGS;
    const architecture=root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE;
    if(!playData||!sourceApi||!architecture){
      api.audit={passed:false,pending:true,version:VERSION,errors:['Required rating sources are not ready.'],warnings:[]};
      return api;
    }
    playData.rebuild?.();
    sourceApi.rebuild?.();
    const roster=playData.poolFor('blind-rank');
    const entries=roster.map(fighter=>buildEntry(fighter,sourceApi.resolve(fighter.id)));
    api.entries.splice(0,api.entries.length,...entries);
    api.byId=Object.fromEntries(entries.map(entry=>[entry.fighterId,entry]));
    api.byName=Object.fromEntries(entries.map(entry=>[normal(entry.fighterName),entry]));
    api.audit=auditEntries(entries,roster,sourceApi.entries||[]);
    const signature=`${api.audit.rosterTotal}|${api.audit.ledgerTotal}|${api.audit.ready}|${api.audit.derived}|${api.audit.provisional}|${api.audit.passed}`;
    root.document?.documentElement?.setAttribute('data-blind-rank-rating-ledger',VERSION);
    root.document?.documentElement?.setAttribute('data-blind-rank-rating-ledger-size',String(api.audit.ledgerTotal));
    root.document?.documentElement?.setAttribute('data-blind-rank-rating-ledger-audit',api.audit.passed?'passed':'failed');
    if(signature!==lastSignature&&typeof root.dispatchEvent==='function'&&typeof root.CustomEvent==='function'){
      lastSignature=signature;
      root.dispatchEvent(new root.CustomEvent('ufc-blind-rank-category-ratings-ready',{detail:{version:VERSION,audit:api.audit}}));
    }
    return api;
  }

  root.UFC_BLIND_RANK_CATEGORY_RATINGS=api;
  rebuild();
  root.addEventListener?.('ufc-play-data-ready',rebuild);
  root.addEventListener?.('ufc-keep-cut-ratings-ready',rebuild);
  root.addEventListener?.('ufc-blind-rank-category-architecture-ready',rebuild);
  root.addEventListener?.('ufc-scoring-pipeline-ready',rebuild);
})(typeof window!=='undefined'?window:globalThis);
