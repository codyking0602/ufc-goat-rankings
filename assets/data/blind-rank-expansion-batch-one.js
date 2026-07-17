(function(root){
  'use strict';

  const VERSION='blind-rank-expansion-20260717b-recursion-fix';
  const DISABLED=new URLSearchParams(root.location?.search||'').get('blindRankExpansion')==='off';
  const CATEGORIES=['ufcCareer','allCareers','bestPrime','hardestAtPeak','mostComplete','bestFinisher','actionFighter','starPower','biggestWhatIf','cultChaos'];
  const TIER_BANDS=[
    {id:'elite',min:92,max:100},{id:'great',min:82,max:91},{id:'good',min:70,max:81},
    {id:'average',min:55,max:69},{id:'below-average',min:35,max:54},{id:'bad',min:0,max:34}
  ];

  const BATCH=Object.freeze([
    fighter('Alistair Overeem','men',['Heavyweight'],['golden-age','superstar','apex'],'elite',['The Reem'],['striker','submission','power','veteran','title-challenger','action'],{
      career:76,divisions:{Heavyweight:78},striking:88,grappling:76,peak:86,finishing:91,complete:83,action:86,starPower:82,whatIf:80,cultChaos:72
    },'Elite finishing specialist with one of the deepest striking arsenals in heavyweight history.'),
    fighter('Mark Hunt','men',['Heavyweight'],['golden-age','superstar'],'recognizable',['The Super Samoan'],['striker','knockout','power','veteran','fan-favorite','action'],{
      career:60,divisions:{Heavyweight:63},striking:86,grappling:45,peak:78,finishing:88,complete:52,action:90,starPower:78,whatIf:60,cultChaos:88
    },'A terrifying knockout threat whose striking and action value tower over his overall résumé.'),
    fighter('Greg Hardy','men',['Heavyweight'],['apex','new-blood'],'wildcard',[],['power','knockout','wildcard','lower-tier'],{
      career:38,divisions:{Heavyweight:42},striking:62,grappling:24,peak:58,finishing:72,complete:42,action:60,starPower:65,whatIf:55,cultChaos:70
    },'Recognizable power and athleticism, but a shallow UFC résumé and major skill limitations.'),

    fighter('Jim Miller','men',['Lightweight'],['tuf-boom','golden-age','superstar','apex'],'elite',['A-10'],['submission','grappler','veteran','action','fan-favorite'],{
      career:78,divisions:{Lightweight:80},striking:66,grappling:86,peak:78,finishing:86,complete:78,action:90,starPower:70,whatIf:55,cultChaos:75
    },'Historic UFC longevity, dangerous submissions, and reliable action without a championship peak.'),
    fighter('Gray Maynard','men',['Lightweight'],['tuf-boom','golden-age'],'contender',['The Bully'],['wrestler','title-challenger','technical'],{
      career:72,divisions:{Lightweight:76},striking:60,grappling:85,peak:84,finishing:42,complete:75,action:60,starPower:62,whatIf:75,cultChaos:55
    },'A powerful wrestling-based contender whose peak far exceeded his finishing and entertainment value.'),
    fighter('Melvin Guillard','men',['Lightweight'],['tuf-boom','golden-age'],'recognizable',['The Young Assassin'],['striker','knockout','power','action','wildcard'],{
      career:48,divisions:{Lightweight:52},striking:77,grappling:45,peak:72,finishing:84,complete:48,action:88,starPower:62,whatIf:80,cultChaos:72
    },'Explosive speed and finishing talent packaged inside one of lightweight’s clearest what-if careers.'),

    fighter('Demian Maia','men',['Welterweight','Middleweight'],['tuf-boom','golden-age','superstar'],'elite',[],['submission','grappler','title-challenger','veteran','specialist'],{
      career:78,divisions:{Welterweight:76,Middleweight:74},striking:40,grappling:98,peak:86,finishing:76,complete:76,action:62,starPower:74,whatIf:62,cultChaos:65
    },'One of the best pure grapplers in UFC history and an ideal category-specific specialist.'),
    fighter('Jake Shields','men',['Welterweight','Middleweight'],['golden-age'],'contender',[],['wrestler','grappler','title-challenger','specialist'],{
      career:72,divisions:{Welterweight:74,Middleweight:70},striking:25,grappling:96,peak:84,finishing:48,complete:74,action:45,starPower:65,whatIf:68,cultChaos:52
    },'Elite grappling paired with poor striking, creating one of the game’s strongest category contrasts.'),
    fighter('Matt Serra','men',['Welterweight'],['zuffa-rebuild','tuf-boom'],'contender',['The Terror'],['former-champion','submission','tuf-winner','upset'],{
      career:60,divisions:{Welterweight:64},striking:60,grappling:78,peak:74,finishing:62,complete:72,action:72,starPower:72,whatIf:75,cultChaos:75
    },'A short championship résumé elevated forever by the greatest title upset in UFC history.'),

    fighter('Jessica Andrade','women',['Strawweight','Flyweight','Bantamweight'],['golden-age','superstar','apex'],'elite',['Bate Estaca'],['former-champion','power','grappler','action','finisher'],{
      career:84,divisions:{Strawweight:86,Flyweight:82,Bantamweight:75},striking:84,grappling:78,peak:88,finishing:88,complete:84,action:90,starPower:78,whatIf:65,cultChaos:68
    },'A three-division force with championship proof, rare power, and elite action value.'),
    fighter('Bethe Correia','women',['Bantamweight'],['golden-age','superstar'],'wildcard',['Pitbull'],['title-challenger','lower-tier','personality'],{
      career:42,divisions:{Bantamweight:45},striking:58,grappling:42,peak:58,finishing:38,complete:48,action:58,starPower:62,whatIf:50,cultChaos:65
    },'A recognizable title challenger who adds needed lower-tier variety to the women’s career pool.'),
    fighter('Tecia Torres','women',['Strawweight'],['golden-age','superstar','apex'],'recognizable',['The Tiny Tornado'],['striker','technical','veteran'],{
      career:62,divisions:{Strawweight:65},striking:76,grappling:62,peak:72,finishing:28,complete:74,action:62,starPower:58,whatIf:45,cultChaos:45
    },'A technically sound, complete strawweight whose extremely low finishing threat creates a useful trap.')
  ]);

  const api={
    version:VERSION,
    phase:5,
    enabled:!DISABLED,
    batch:BATCH,
    names:BATCH.map(row=>row.name),
    apply:applyAll,
    patchPlayData,
    patchKeepCutRatings,
    patchBlindRankRatings,
    profileFor(value){const key=normal(typeof value==='object'?(value.name||value.id):value);return BATCH.find(row=>normal(row.name)===key||slug(row.name)===slug(key))?.profile||null;}
  };
  root.UFC_BLIND_RANK_EXPANSION_BATCH_ONE=api;
  root.document?.documentElement?.setAttribute('data-blind-rank-expansion',DISABLED?'disabled':VERSION);
  if(DISABLED)return;

  function fighter(name,gender,divisions,eras,selectionTier,aliases,tags,ratings,summary){
    return Object.freeze({
      id:slug(name),name,gender,divisions:Object.freeze(divisions),eras:Object.freeze(eras),selectionTier,
      aliases:Object.freeze(aliases),tags:Object.freeze(tags),ratings:Object.freeze({...ratings,divisions:Object.freeze({...ratings.divisions})}),
      profile:Object.freeze({oneLiner:summary,summary,photoStatus:'pending-real-files'})
    });
  }
  function text(value){return String(value??'').trim();}
  function normal(value){return text(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();}
  function slug(value){return normal(value).replace(/\s+/g,'-');}
  function unique(values){return [...new Set((values||[]).map(text).filter(Boolean))];}
  function tierFor(value){const score=Math.max(0,Math.min(100,Number(value)||0));return TIER_BANDS.find(tier=>score>=tier.min&&score<=tier.max)?.id||'bad';}
  function ratingRecord(row){
    return {
      ufcCareer:row.ratings.career,
      allCareers:row.ratings.career,
      bestPrime:row.ratings.peak,
      hardestAtPeak:row.ratings.peak,
      mostComplete:row.ratings.complete,
      bestFinisher:row.ratings.finishing,
      actionFighter:row.ratings.action,
      starPower:row.ratings.starPower,
      biggestWhatIf:row.ratings.whatIf,
      cultChaos:row.ratings.cultChaos
    };
  }
  function playRecord(row){
    const base={
      id:row.id,name:row.name,aliases:[...row.aliases],gender:row.gender,primaryDivision:row.divisions[0]||'',divisions:[...row.divisions],eras:[...row.eras],
      selectionTier:row.selectionTier,tags:unique(['play-only','phase-five-expansion',row.gender,...row.tags,...row.divisions.map(slug)]),
      source:'play-only-phase-five',modelRanked:false,modelRank:null,modelScore:null,thumbUrl:'',profileUrl:'',
      eligibility:{blindRank:true,keepCut:true,betterThan:false,findLeader:false}
    };
    return root.UFC_FIGHTER_PHOTOS?.apply?.(base)||base;
  }
  function sortPlay(records){
    return records.sort((a,b)=>{
      if(a.modelRanked!==b.modelRanked)return a.modelRanked?-1:1;
      if(a.modelRanked&&b.modelRanked)return (a.modelRank||999)-(b.modelRank||999);
      return String(a.name).localeCompare(String(b.name));
    });
  }
  function refreshPlayAudit(play){
    const audit=play.audit||{};
    audit.total=play.allFighters.length;
    audit.modelRanked=play.allFighters.filter(row=>row.modelRanked).length;
    audit.playOnly=play.allFighters.length-audit.modelRanked;
    audit.photoReady=play.allFighters.filter(row=>row.photoExplicit).length;
    audit.photoConvention=play.allFighters.filter(row=>row.photoConvention).length;
    audit.eligibilityCounts=Object.fromEntries(['blindRank','keepCut','betterThan','findLeader'].map(key=>[key,play.allFighters.filter(row=>row.eligibility?.[key]).length]));
    audit.passed=!(audit.errors||[]).length;
    play.audit=audit;
    root.document?.documentElement?.setAttribute('data-play-roster-size',String(audit.total));
    root.document?.documentElement?.setAttribute('data-play-data-audit',audit.passed?'passed':'failed');
  }
  let applyingPlay=false;
  let playSignature='';
  function patchPlayData(){
    const play=root.UFC_PLAY_DATA;
    if(!play||applyingPlay)return false;
    applyingPlay=true;
    try{
      const map=new Map((play.allFighters||[]).map(row=>[row.id,row]));
      BATCH.forEach(row=>{
        const extra=playRecord(row);
        const existing=map.get(row.id);
        map.set(row.id,existing?{
          ...existing,
          aliases:unique([...(existing.aliases||[]),...extra.aliases]),
          divisions:unique([...(existing.divisions||[]),...extra.divisions]),
          eras:unique([...(existing.eras||[]),...extra.eras]),
          tags:unique([...(existing.tags||[]),...extra.tags]),
          eligibility:{...(existing.eligibility||{}),blindRank:true,keepCut:true}
        }:extra);
      });
      const records=sortPlay([...map.values()]);
      play.allFighters.splice(0,play.allFighters.length,...records);
      play.modelRanked.splice(0,play.modelRanked.length,...records.filter(row=>row.modelRanked));
      play.playOnly.splice(0,play.playOnly.length,...records.filter(row=>!row.modelRanked));
      play.byId=Object.fromEntries(records.map(row=>[row.id,row]));
      play.byName=Object.fromEntries(records.map(row=>[normal(row.name),row]));
      BATCH.forEach(row=>{if(!play.extras.some(extra=>normal(extra.name)===normal(row.name)))play.extras.push({name:row.name,aliases:[...row.aliases],gender:row.gender,divisions:[...row.divisions],eras:[...row.eras],selectionTier:row.selectionTier,tags:[...row.tags]});});
      refreshPlayAudit(play);
      const signature=`${play.audit.total}|${BATCH.map(row=>row.id).every(id=>play.byId[id])}`;
      if(signature!==playSignature){
        playSignature=signature;
        root.dispatchEvent?.(new CustomEvent('ufc-play-data-ready',{detail:{version:VERSION,audit:play.audit,expansion:true}}));
      }
      return true;
    }finally{applyingPlay=false;}
  }
  function wrapPlayRebuild(){
    const play=root.UFC_PLAY_DATA;
    if(!play||play.__blindRankExpansionWrapped)return;
    const native=play.rebuild?.bind(play);
    play.rebuild=function(){const result=native?.();patchPlayData();return result||play;};
    play.__blindRankExpansionWrapped=true;
  }

  function refreshKeepCutAudit(source){
    if(!source?.audit)return;
    source.audit.rosterTotal=root.UFC_PLAY_DATA?.allFighters?.length||source.entries.length;
    source.audit.ledgerTotal=source.entries.length;
    source.audit.modelRanked=source.entries.filter(entry=>entry.modelRanked).length;
    source.audit.playOnly=source.entries.length-source.audit.modelRanked;
    source.audit.ready=source.entries.filter(entry=>entry.overallReviewStatus==='ready').length;
    source.audit.provisional=source.entries.length-source.audit.ready;
    source.audit.tierCounts=Object.fromEntries(CATEGORIES.map(category=>[category,Object.fromEntries(TIER_BANDS.map(tier=>[tier.id,source.entries.filter(entry=>entry.tiers?.[category]===tier.id).length]))]));
    source.audit.sourceCounts=Object.fromEntries(CATEGORIES.map(category=>[category,source.entries.reduce((counts,entry)=>{const key=entry.ratingSources?.[category]||'missing';counts[key]=(counts[key]||0)+1;return counts;},{})]));
    source.audit.statusCounts=Object.fromEntries(CATEGORIES.map(category=>[category,source.entries.reduce((counts,entry)=>{const key=entry.reviewStatus?.[category]||'missing';counts[key]=(counts[key]||0)+1;return counts;},{})]));
  }
  function patchKeepCutRatings(){
    const source=root.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(!source)return false;
    BATCH.forEach(row=>{
      const entry=source.resolve(row.name);
      if(!entry)return;
      const ratings=ratingRecord(row);
      entry.ratings={...entry.ratings,...ratings};
      entry.tiers={...entry.tiers,...Object.fromEntries(Object.entries(ratings).map(([key,value])=>[key,tierFor(value)]))};
      entry.ratingSources={...entry.ratingSources,...Object.fromEntries(CATEGORIES.map(key=>[key,'phase-five-manual']))};
      entry.reviewStatus={...entry.reviewStatus,...Object.fromEntries(CATEGORIES.map(key=>[key,'approved']))};
      entry.divisionRatings={...entry.divisionRatings,...row.ratings.divisions};
      entry.divisionTiers={...entry.divisionTiers,...Object.fromEntries(Object.entries(row.ratings.divisions).map(([division,value])=>[division,tierFor(value)]))};
      entry.divisionSources={...entry.divisionSources,...Object.fromEntries(Object.keys(row.ratings.divisions).map(division=>[division,'phase-five-manual']))};
      entry.divisionReviewStatus={...entry.divisionReviewStatus,...Object.fromEntries(Object.keys(row.ratings.divisions).map(division=>[division,'approved']))};
      entry.overallReviewStatus='ready';
    });
    source.byId=Object.fromEntries(source.entries.map(entry=>[entry.id,entry]));
    source.byName=Object.fromEntries(source.entries.map(entry=>[normal(entry.name),entry]));
    refreshKeepCutAudit(source);
    root.document?.documentElement?.setAttribute('data-keep-cut-rating-ledger-size',String(source.entries.length));
    return true;
  }
  function wrapKeepCutRebuild(){
    const source=root.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(!source||source.__blindRankExpansionWrapped)return;
    const native=source.rebuild?.bind(source);
    source.rebuild=function(){const result=native?.();patchKeepCutRatings();return result||source;};
    source.__blindRankExpansionWrapped=true;
  }

  function refreshBlindAudit(ledger){
    if(!ledger?.audit)return;
    const architecture=root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE;
    const paths=['career.overall','striking','grappling','peak','finishing','complete','action','starPower'];
    ledger.audit.rosterTotal=root.UFC_PLAY_DATA?.poolFor?.('blind-rank')?.length||ledger.entries.length;
    ledger.audit.ledgerTotal=ledger.entries.length;
    ledger.audit.modelRanked=ledger.entries.filter(entry=>entry.modelRanked).length;
    ledger.audit.playOnly=ledger.entries.length-ledger.audit.modelRanked;
    ledger.audit.ready=ledger.entries.filter(entry=>entry.overallReviewStatus==='ready').length;
    ledger.audit.provisional=ledger.entries.length-ledger.audit.ready;
    ledger.audit.approvedSkillAnchors={striking:ledger.entries.filter(entry=>entry.reviewStatus?.striking==='approved').length,grappling:ledger.entries.filter(entry=>entry.reviewStatus?.grappling==='approved').length};
    ledger.audit.tierCounts=Object.fromEntries(paths.map(path=>[path,Object.fromEntries((architecture?.tiers||TIER_BANDS).map(tier=>[tier.id,ledger.entries.filter(entry=>entry.tiers?.[path]===tier.id).length]))]));
    ledger.audit.statusCounts=Object.fromEntries(paths.map(path=>[path,ledger.entries.reduce((counts,entry)=>{const key=entry.reviewStatus?.[path]||'missing';counts[key]=(counts[key]||0)+1;return counts;},{})]));
    ledger.audit.sourceCounts=Object.fromEntries(paths.map(path=>[path,ledger.entries.reduce((counts,entry)=>{const key=entry.ratingSources?.[path]||'missing';counts[key]=(counts[key]||0)+1;return counts;},{})]));
  }
  function patchBlindRankRatings(){
    const ledger=root.UFC_BLIND_RANK_CATEGORY_RATINGS;
    const architecture=root.UFC_BLIND_RANK_CATEGORY_ARCHITECTURE;
    if(!ledger||!architecture)return false;
    BATCH.forEach(row=>{
      const entry=ledger.resolve(row.name);
      if(!entry)return;
      const ratings={career:{overall:row.ratings.career,divisions:{...row.ratings.divisions}},striking:row.ratings.striking,grappling:row.ratings.grappling,peak:row.ratings.peak,finishing:row.ratings.finishing,complete:row.ratings.complete,action:row.ratings.action,starPower:row.ratings.starPower};
      entry.ratings=ratings;
      entry.tiers={
        'career.overall':tierFor(ratings.career.overall),striking:tierFor(ratings.striking),grappling:tierFor(ratings.grappling),peak:tierFor(ratings.peak),finishing:tierFor(ratings.finishing),complete:tierFor(ratings.complete),action:tierFor(ratings.action),starPower:tierFor(ratings.starPower),
        ...Object.fromEntries(Object.entries(ratings.career.divisions).map(([division,value])=>[`career.divisions.${slug(division)}`,tierFor(value)]))
      };
      entry.ratingSources={...Object.fromEntries(['career.overall','striking','grappling','peak','finishing','complete','action','starPower'].map(path=>[path,'phase-five-manual'])),...Object.fromEntries(Object.keys(ratings.career.divisions).map(division=>[`career.divisions.${slug(division)}`,'phase-five-manual']))};
      entry.reviewStatus={...Object.fromEntries(['career.overall','striking','grappling','peak','finishing','complete','action','starPower'].map(path=>[path,'approved'])),...Object.fromEntries(Object.keys(ratings.career.divisions).map(division=>[`career.divisions.${slug(division)}`,'approved']))};
      entry.overallReviewStatus='ready';
    });
    ledger.byId=Object.fromEntries(ledger.entries.map(entry=>[entry.fighterId,entry]));
    ledger.byName=Object.fromEntries(ledger.entries.map(entry=>[normal(entry.fighterName),entry]));
    refreshBlindAudit(ledger);
    root.document?.documentElement?.setAttribute('data-blind-rank-rating-ledger-size',String(ledger.entries.length));
    return true;
  }
  function wrapBlindRebuild(){
    const ledger=root.UFC_BLIND_RANK_CATEGORY_RATINGS;
    if(!ledger||ledger.__blindRankExpansionWrapped)return;
    const native=ledger.rebuild?.bind(ledger);
    ledger.rebuild=function(){const result=native?.();patchBlindRankRatings();return result||ledger;};
    ledger.__blindRankExpansionWrapped=true;
  }

  function applyAll(){
    wrapPlayRebuild();patchPlayData();
    if(root.UFC_KEEP_CUT_CATEGORY_RATINGS){wrapKeepCutRebuild();patchKeepCutRatings();}
    if(root.UFC_BLIND_RANK_CATEGORY_RATINGS){wrapBlindRebuild();patchBlindRankRatings();}
    return api;
  }

  root.addEventListener?.('ufc-play-data-ready',()=>patchPlayData());
  root.addEventListener?.('ufc-keep-cut-ratings-ready',()=>{wrapKeepCutRebuild();patchKeepCutRatings();});
  root.addEventListener?.('ufc-blind-rank-category-ratings-ready',()=>{wrapBlindRebuild();patchBlindRankRatings();root.dispatchEvent?.(new CustomEvent('ufc-blind-rank-expansion-ready',{detail:{version:VERSION,count:BATCH.length}}));});
  applyAll();
})(typeof window!=='undefined'?window:globalThis);