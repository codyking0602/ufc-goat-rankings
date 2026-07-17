(function(root){
  'use strict';

  const VERSION='play-roster-batch-one-20260717c-current-audit';
  const FIGHTERS=Object.freeze([
    row('Ben Askren',['Funky'],'men',['Welterweight'],['superstar','apex'],'recognizable',['wrestler','personality','what-if','cult','never-undisputed-champion']),
    row('Cody Garbrandt',['No Love'],'men',['Bantamweight','Flyweight'],['superstar','apex'],'elite',['former-champion','knockout','action','what-if']),
    row('Anthony Johnson',['Rumble','Anthony Rumble Johnson'],'men',['Light Heavyweight','Middleweight','Welterweight'],['tuf-boom','golden-age','superstar'],'elite',['power','knockout','title-challenger','what-if','never-undisputed-champion']),
    row('Lyoto Machida',['The Dragon'],'men',['Light Heavyweight','Middleweight'],['tuf-boom','golden-age'],'elite',['former-champion','striker','technical','highlight']),
    row('Josh Koscheck',['Kos'],'men',['Welterweight'],['zuffa-rebuild','tuf-boom','golden-age'],'contender',['wrestler','title-challenger','tuf-original','never-undisputed-champion']),
    row('Gilbert Melendez',['El Niño','El Nino'],'men',['Lightweight'],['golden-age','superstar'],'contender',['title-challenger','action','what-if','never-undisputed-champion']),
    row('Rafael Fiziev',['Ataman'],'men',['Lightweight'],['apex','new-blood'],'contender',['striker','action','highlight','what-if']),
    row('Renato Moicano',['Money Moicano','Moicano'],'men',['Lightweight','Featherweight'],['superstar','apex','new-blood'],'elite',['grappler','submission','action','personality','title-challenger','never-undisputed-champion']),
    row('Mackenzie Dern',[],'women',['Strawweight'],['superstar','apex','new-blood'],'elite',['champion','former-champion','grappler','submission','star','finisher']),
    row('Germaine de Randamie',['The Iron Lady'],'women',['Bantamweight','Featherweight'],['golden-age','superstar','apex'],'elite',['former-champion','striker','title-challenger','what-if']),
    row('Jessica Eye',['Evil'],'women',['Flyweight','Bantamweight'],['golden-age','superstar','apex'],'recognizable',['title-challenger','veteran']),
    row('Bethe Correia',['Pitbull'],'women',['Bantamweight'],['golden-age','superstar'],'wildcard',['title-challenger','personality','lower-tier'])
  ]);

  const RATINGS=Object.freeze({
    'Ben Askren':rating(40,{Welterweight:42},58,55,50,42,72,76,88,88),
    'Cody Garbrandt':rating(76,{Bantamweight:80,Flyweight:55},91,90,79,90,92,84,94,78),
    'Anthony Johnson':rating(80,{'Light Heavyweight':86,Middleweight:68,Welterweight:62},90,91,76,97,93,83,90,72),
    'Lyoto Machida':rating(84,{'Light Heavyweight':89,Middleweight:82},92,93,89,83,78,85,78,76),
    'Josh Koscheck':rating(70,{Welterweight:74},80,78,78,68,75,70,60,62),
    'Gilbert Melendez':rating(48,{Lightweight:52},78,76,82,55,92,72,94,78),
    'Rafael Fiziev':rating(70,{Lightweight:74},84,82,76,89,93,75,82,66),
    'Renato Moicano':rating(76,{Lightweight:80,Featherweight:74},85,82,84,89,86,82,80,86),
    'Mackenzie Dern':rating(88,{Strawweight:93},92,90,85,88,86,86,72,74),
    'Germaine de Randamie':rating(78,{Bantamweight:82,Featherweight:86},89,88,74,82,76,76,90,62),
    'Jessica Eye':rating(54,{Flyweight:60,Bantamweight:52},70,67,62,34,62,64,52,56),
    'Bethe Correia':rating(42,{Bantamweight:45},58,56,48,38,58,62,50,65)
  });

  const BANDS=[['elite',92,100],['great',82,91],['good',70,81],['average',55,69],['below-average',35,54],['bad',0,34]];
  const VALID=new Set(['legend','elite','contender','recognizable','wildcard']);
  let lastSignature='';
  let injecting=false;

  function row(name,aliases,gender,divisions,eras,selectionTier,tags){
    return Object.freeze({name,aliases:Object.freeze(aliases),gender,divisions:Object.freeze(divisions),eras:Object.freeze(eras),selectionTier,tags:Object.freeze(tags)});
  }
  function rating(career,divisions,bestPrime,hardestAtPeak,mostComplete,bestFinisher,actionFighter,starPower,biggestWhatIf,cultChaos){
    return Object.freeze({
      ratings:Object.freeze({ufcCareer:career,allCareers:career,bestPrime,hardestAtPeak,mostComplete,bestFinisher,actionFighter,starPower,biggestWhatIf,cultChaos}),
      divisions:Object.freeze(divisions)
    });
  }
  const text=value=>String(value??'').trim();
  const normal=value=>text(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();
  const slug=value=>normal(value).replace(/\s+/g,'-');
  const unique=values=>[...new Set((values||[]).map(text).filter(Boolean))];
  const tier=value=>{
    const number=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
    return BANDS.find(([,min,max])=>number>=min&&number<=max)?.[0]||'bad';
  };

  function record(fighter){
    const base={
      id:slug(fighter.name),
      name:fighter.name,
      aliases:unique(fighter.aliases),
      gender:fighter.gender,
      primaryDivision:fighter.divisions[0]||'',
      divisions:unique(fighter.divisions),
      eras:unique(fighter.eras),
      selectionTier:VALID.has(fighter.selectionTier)?fighter.selectionTier:'recognizable',
      tags:unique(['play-only','batch-one',fighter.gender,...fighter.tags,...fighter.divisions.map(slug)]),
      source:'play-only-batch-one',
      modelRanked:false,
      modelRank:null,
      modelScore:null,
      thumbUrl:'',
      profileUrl:'',
      eligibility:{blindRank:true,keepCut:true,betterThan:false,findLeader:false}
    };
    return root.UFC_FIGHTER_PHOTOS?.apply?.(base)||{
      ...base,
      photoExplicit:false,
      photoConvention:true,
      photoCandidates:[]
    };
  }

  function auditPlay(api){
    const rows=api.allFighters;
    const errors=[];
    const ids=new Set();
    const names=new Set();
    rows.forEach(fighter=>{
      if(!fighter.id||ids.has(fighter.id))errors.push(`Duplicate fighter id: ${fighter.id||fighter.name}`);
      ids.add(fighter.id);
      const name=normal(fighter.name);
      if(!name||names.has(name))errors.push(`Duplicate fighter name: ${fighter.name}`);
      names.add(name);
      if(!['men','women'].includes(fighter.gender))errors.push(`${fighter.name} invalid gender`);
      if(!VALID.has(fighter.selectionTier))errors.push(`${fighter.name} invalid tier`);
      if(!fighter.divisions?.length)errors.push(`${fighter.name} missing division`);
    });
    api.audit={
      ...(api.audit||{}),
      passed:errors.length===0,
      errors,
      total:rows.length,
      modelRanked:rows.filter(fighter=>fighter.modelRanked).length,
      playOnly:rows.filter(fighter=>!fighter.modelRanked).length,
      photoReady:rows.filter(fighter=>fighter.photoExplicit).length,
      photoConvention:rows.filter(fighter=>fighter.photoConvention).length,
      eligibilityCounts:Object.fromEntries(['blindRank','keepCut','betterThan','findLeader'].map(key=>[
        key,rows.filter(fighter=>fighter.eligibility?.[key]).length
      ]))
    };
    root.document?.documentElement?.setAttribute('data-play-roster-size',String(rows.length));
    root.document?.documentElement?.setAttribute('data-play-data-audit',api.audit.passed?'passed':'failed');
  }

  function inject(silent=false){
    const api=root.UFC_PLAY_DATA;
    if(!api||injecting)return false;
    injecting=true;
    try{
      FIGHTERS.forEach(fighter=>{
        const id=slug(fighter.name);
        const extra=record(fighter);
        const existing=api.allFighters.find(row=>row.id===id||normal(row.name)===normal(fighter.name));
        if(!existing){
          api.allFighters.push(extra);
        }else{
          existing.aliases=unique([...(existing.aliases||[]),...extra.aliases]);
          existing.divisions=unique([...(existing.divisions||[]),...extra.divisions]);
          existing.eras=unique([...(existing.eras||[]),...extra.eras]);
          existing.tags=unique([...(existing.tags||[]),...extra.tags]);
          existing.primaryDivision=existing.primaryDivision||extra.primaryDivision;
          existing.selectionTier=existing.modelRanked?existing.selectionTier:fighter.selectionTier;
          existing.eligibility={...(existing.eligibility||{}),blindRank:true,keepCut:true};
        }
        if(!api.extras.some(row=>normal(row.name)===normal(fighter.name))){
          api.extras.push({
            name:fighter.name,
            aliases:[...fighter.aliases],
            gender:fighter.gender,
            divisions:[...fighter.divisions],
            eras:[...fighter.eras],
            selectionTier:fighter.selectionTier,
            tags:[...fighter.tags]
          });
        }
      });

      api.allFighters.sort((a,b)=>{
        if(a.modelRanked!==b.modelRanked)return a.modelRanked?-1:1;
        if(a.modelRanked&&b.modelRanked)return (a.modelRank||999)-(b.modelRank||999);
        return a.name.localeCompare(b.name);
      });
      api.modelRanked.splice(0,api.modelRanked.length,...api.allFighters.filter(fighter=>fighter.modelRanked));
      api.playOnly.splice(0,api.playOnly.length,...api.allFighters.filter(fighter=>!fighter.modelRanked));
      api.byId=Object.fromEntries(api.allFighters.map(fighter=>[fighter.id,fighter]));
      api.byName=Object.fromEntries(api.allFighters.map(fighter=>[normal(fighter.name),fighter]));
      auditPlay(api);

      const signature=`${api.audit.total}|${api.audit.playOnly}|${api.audit.passed}|${FIGHTERS.every(fighter=>api.byId[slug(fighter.name)])}`;
      if(!silent&&signature!==lastSignature){
        lastSignature=signature;
        root.dispatchEvent?.(new CustomEvent('ufc-play-data-ready',{detail:{version:VERSION,audit:api.audit,batch:'one'}}));
      }
      return true;
    }finally{
      injecting=false;
    }
  }

  function wrapPlay(){
    const api=root.UFC_PLAY_DATA;
    if(!api||api.__batchOnePlayWrapped)return;
    const native=api.rebuild?.bind(api);
    api.rebuild=function(){
      const output=native?.();
      inject(true);
      return output||api;
    };
    api.__batchOnePlayWrapped=true;
  }

  function refreshLedger(ledger){
    const rows=ledger.entries;
    const categories=ledger.categoryIds||Object.keys(ledger.categories||{});
    const errors=[];
    const roster=root.UFC_PLAY_DATA?.allFighters||[];
    const ids=new Set(rows.map(entry=>entry.id));
    const missing=roster.filter(fighter=>!ids.has(fighter.id)).map(fighter=>fighter.name);
    if(missing.length)errors.push(`Missing roster fighters: ${missing.join(', ')}`);
    categories.forEach(category=>{
      if(rows.some(entry=>!Number.isFinite(Number(entry.ratings?.[category]))))errors.push(`${category} missing rating`);
      if(rows.some(entry=>Number(entry.ratings?.[category])<0||Number(entry.ratings?.[category])>100))errors.push(`${category} invalid rating`);
    });
    rows.forEach(entry=>(entry.divisions||[]).forEach(division=>{
      if(!Number.isFinite(Number(entry.divisionRatings?.[division])))errors.push(`${entry.name} missing ${division} rating`);
    }));
    ledger.audit={
      ...(ledger.audit||{}),
      passed:errors.length===0,
      errors,
      rosterTotal:roster.length,
      ledgerTotal:rows.length,
      modelRanked:rows.filter(entry=>entry.modelRanked).length,
      playOnly:rows.filter(entry=>!entry.modelRanked).length,
      ready:rows.filter(entry=>entry.overallReviewStatus==='ready').length,
      provisional:rows.filter(entry=>entry.overallReviewStatus==='provisional').length
    };
    root.document?.documentElement?.setAttribute('data-keep-cut-rating-ledger-size',String(rows.length));
    root.document?.documentElement?.setAttribute('data-keep-cut-rating-ledger-audit',ledger.audit.passed?'passed':'failed');
  }

  function applyRatings(){
    const ledger=root.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(!ledger)return false;
    Object.entries(RATINGS).forEach(([name,data])=>{
      const entry=ledger.resolve(name);
      if(!entry)return;
      Object.entries(data.ratings).forEach(([category,value])=>{
        entry.ratings[category]=value;
        entry.tiers[category]=tier(value);
        entry.ratingSources[category]='manual-batch-one';
        entry.reviewStatus[category]='approved';
      });
      Object.entries(data.divisions).forEach(([division,value])=>{
        entry.divisionRatings[division]=value;
        entry.divisionTiers[division]=tier(value);
        entry.divisionSources[division]='manual-batch-one';
        entry.divisionReviewStatus[division]='approved';
        entry.eligibility.divisions[division]=true;
      });
      entry.rosterSource='play-only-batch-one';
      entry.overallReviewStatus='ready';
    });
    refreshLedger(ledger);
    root.document?.documentElement?.setAttribute('data-keep-cut-fighter-batch-count',String(FIGHTERS.length));
    return FIGHTERS.every(fighter=>Boolean(ledger.resolve(fighter.name)));
  }

  function hookLedger(){
    const ledger=root.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(!ledger)return;
    if(!ledger.__batchOneLedgerWrapped){
      const native=ledger.rebuild?.bind(ledger);
      ledger.rebuild=function(){
        const output=native?.();
        applyRatings();
        return output||ledger;
      };
      ledger.__batchOneLedgerWrapped=true;
    }
    applyRatings();
  }

  inject();
  wrapPlay();
  root.addEventListener?.('ufc-keep-cut-ratings-ready',hookLedger);
  if(root.UFC_KEEP_CUT_CATEGORY_RATINGS)hookLedger();

  root.UFC_PLAY_ROSTER_BATCH_ONE={
    version:VERSION,
    fighters:FIGHTERS.map(fighter=>({...fighter,aliases:[...fighter.aliases],divisions:[...fighter.divisions],eras:[...fighter.eras],tags:[...fighter.tags]})),
    ratings:RATINGS,
    inject,
    applyRatings,
    audit:()=>({
      rosterPresent:FIGHTERS.every(fighter=>Boolean(root.UFC_PLAY_DATA?.resolve(fighter.name))),
      ratingsPresent:Object.keys(RATINGS).every(name=>Boolean(root.UFC_KEEP_CUT_CATEGORY_RATINGS?.resolve(name))),
      rosterTotal:root.UFC_PLAY_DATA?.audit?.total||0,
      ledgerTotal:root.UFC_KEEP_CUT_CATEGORY_RATINGS?.audit?.ledgerTotal||0,
      fighterCount:FIGHTERS.length
    })
  };
  root.document?.documentElement?.setAttribute('data-play-roster-batch-one',VERSION);
})(typeof window!=='undefined'?window:globalThis);
