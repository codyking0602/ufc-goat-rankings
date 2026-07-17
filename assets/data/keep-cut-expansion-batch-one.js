(function(root){
  'use strict';

  const VERSION='keep-cut-expansion-20260717a-fighter-batch-one';
  const CATEGORIES=['ufcCareer','allCareers','bestPrime','hardestAtPeak','mostComplete','bestFinisher','actionFighter','starPower','biggestWhatIf','cultChaos'];
  const TIER_BANDS=[
    {id:'elite',min:92,max:100},{id:'great',min:82,max:91},{id:'good',min:70,max:81},
    {id:'average',min:55,max:69},{id:'below-average',min:35,max:54},{id:'bad',min:0,max:34}
  ];

  const BATCH=Object.freeze([
    fighter('Ben Askren','men',['Welterweight'],['superstar','apex'],'recognizable',['Funky'],['wrestler','grappler','personality','what-if','cult','lower-tier'],{
      career:40,divisions:{Welterweight:42},striking:22,grappling:92,peak:58,hardest:55,finishing:42,complete:50,action:72,starPower:76,whatIf:88,cultChaos:88
    },profile(
      'A world-class wrestling specialist whose tiny UFC sample became equal parts controversy, disaster, and unforgettable chaos.',
      'Askren’s UFC-only résumé is short and poor, but his grappling reputation, Lawler escape, Masvidal knockout, and Maia fight make him a perfect category trap.',
      'At his UFC best, Askren’s chain wrestling and positional instincts were still dangerous; the striking and athletic decline were impossible to hide.',
      'The UFC career never approached his pre-UFC reputation: one disputed win followed by two decisive losses.',
      'No UFC championship wins. His value is specialist skill and what-if context, not title accomplishment.',
      'Robbie Lawler is the lone UFC win; the Masvidal and Maia losses define the other side of the case.',
      'His UFC window lasted less than a year, so longevity is a clear weakness.',
      'The counterargument is simple: UFC-only scope strips away almost everything that made Askren important before he arrived.',
      'He wins category debates only when elite wrestling, fame, what-if value, or cult chaos matter more than UFC résumé.',
      'Robbie Lawler',
      0,0,0
    )),
    fighter('Cody Garbrandt','men',['Bantamweight','Flyweight'],['superstar','apex'],'elite',['No Love'],['former-champion','striker','knockout','action','star','what-if'],{
      career:76,divisions:{Bantamweight:80,Flyweight:55},striking:92,grappling:65,peak:91,hardest:90,finishing:90,complete:79,action:92,starPower:84,whatIf:94,cultChaos:78
    },profile(
      'A former bantamweight champion with one of the division’s greatest single performances and one of its most volatile post-title careers.',
      'Garbrandt’s UFC case is built around the Cruz masterpiece, elite hand speed, knockout power, and the brutal inconsistency that followed.',
      'His championship-night peak combined footwork, counters, combinations, defense, and composure at an elite level.',
      'The résumé has a real title win and several explosive finishes, but repeated stoppage losses prevent a long-reign case.',
      'He beat Dominick Cruz for undisputed bantamweight gold but never successfully defended it.',
      'Cruz, Almeida, Mizugaki, Assunção, and Kelleher headline the UFC win list.',
      'He remained relevant for years, but the elite portion of the career was brief and interrupted by losses.',
      'The losing argument is durability and sustained consistency: too many prime stoppage losses after the title peak.',
      'He wins debates when championship peak, striking brilliance, and finishing danger outweigh career stability.',
      'Dominick Cruz, Thomas Almeida, Takeya Mizugaki, Raphael Assunção',
      1,1,0
    )),
    fighter('Anthony Johnson','men',['Light Heavyweight','Middleweight','Welterweight'],['tuf-boom','golden-age','superstar'],'elite',['Rumble'],['striker','knockout','power','title-challenger','action','what-if'],{
      career:80,divisions:{'Light Heavyweight':86,Middleweight:68,Welterweight:62},striking:95,grappling:65,peak:90,hardest:91,finishing:97,complete:76,action:93,starPower:83,whatIf:90,cultChaos:72
    },profile(
      'One of the most frightening knockout artists in UFC history, with elite light-heavyweight wins but no undisputed title.',
      'Johnson’s UFC résumé is a destruction-heavy contender case: huge wins, two title shots, and a clear stylistic ceiling against Daniel Cormier.',
      'At his peak, Rumble’s speed, power, takedown defense, and counter timing made every exchange feel immediately dangerous.',
      'The career is stronger than a typical non-champion résumé, but the two Cormier losses block the championship argument.',
      'He challenged twice for the light-heavyweight title and lost both fights to Cormier.',
      'Gustafsson, Teixeira, Davis, Manuwa, Bader, and Nogueira give him excellent contender depth.',
      'The elite light-heavyweight run was powerful but relatively compact.',
      'He never solved elite championship grappling and retired while still capable of adding to the résumé.',
      'He wins comparisons through finishing threat, peak fear factor, and high-end contender wins.',
      'Alexander Gustafsson, Glover Teixeira, Phil Davis, Jimi Manuwa, Ryan Bader',
      0,0,0
    )),
    fighter('Lyoto Machida','men',['Light Heavyweight','Middleweight'],['tuf-boom','golden-age'],'elite',['The Dragon'],['former-champion','striker','technical','star','title-challenger'],{
      career:84,divisions:{'Light Heavyweight':89,Middleweight:82},striking:96,grappling:82,peak:92,hardest:93,finishing:83,complete:89,action:78,starPower:85,whatIf:78,cultChaos:76
    },profile(
      'A UFC champion whose elusive karate style briefly looked unsolvable and permanently changed how elite MMA striking was discussed.',
      'Machida owns a real championship résumé, major wins across two divisions, and an unusually distinctive peak.',
      'At his best, distance control, counters, timing, takedown defense, trips, and composure made him one of the hardest fighters of his era to read.',
      'The résumé includes light-heavyweight gold and a middleweight title challenge, but later losses reduce the all-time separation.',
      'He won and defended the UFC light-heavyweight title before losing the rematch to Shogun Rua.',
      'Evans, Shogun, Couture, Henderson, Bader, Mousasi, and Franklin headline the UFC case.',
      'Machida stayed relevant across two divisions for a long period, though the prime championship window was shorter.',
      'The argument against him is sustained title control: the style peak was higher than the length of the reign.',
      'He wins comparisons through peak difficulty, technical completeness, and championship proof.',
      'Rashad Evans, Mauricio Rua, Randy Couture, Dan Henderson, Ryan Bader, Gegard Mousasi',
      2,1,1
    )),
    fighter('Josh Koscheck','men',['Welterweight'],['zuffa-rebuild','tuf-boom','golden-age'],'contender',[],['wrestler','title-challenger','tuf-original','veteran'],{
      career:70,divisions:{Welterweight:74},striking:68,grappling:90,peak:80,hardest:78,finishing:68,complete:78,action:75,starPower:70,whatIf:60,cultChaos:62
    },profile(
      'A foundational TUF-era welterweight contender with elite wrestling, real power, and a long UFC run beneath the championship tier.',
      'Koscheck’s résumé is deep and durable, but the GSP losses define the ceiling.',
      'His best version mixed collegiate wrestling, improved boxing, athleticism, and enough power to threaten elite welterweights.',
      'He beat many recognizable contenders and earned a title shot, without capturing UFC gold.',
      'He challenged Georges St-Pierre for the welterweight title and lost.',
      'Hughes, Daley, Trigg, Sanchez, Johnson, and Lytle anchor the win list.',
      'Longevity is a strength; he remained a relevant UFC welterweight across multiple phases of the division.',
      'He lacks a signature win over the division’s true champion tier.',
      'He wins comparisons through wrestling quality, contender depth, and sustained UFC relevance.',
      'Matt Hughes, Paul Daley, Frank Trigg, Diego Sanchez, Anthony Johnson, Chris Lytle',
      0,0,0
    )),
    fighter('Gilbert Melendez','men',['Lightweight'],['golden-age','superstar'],'contender',['El Niño'],['title-challenger','action','what-if','veteran'],{
      career:48,divisions:{Lightweight:52},striking:84,grappling:82,peak:78,hardest:76,finishing:55,complete:82,action:92,starPower:72,whatIf:94,cultChaos:78
    },profile(
      'An elite lightweight who arrived in the UFC late, nearly won the title immediately, and finished with a misleading UFC-only record.',
      'Melendez is one of the clearest UFC-only scope traps: his skill and historical reputation were much better than his 1–6 UFC record.',
      'His best UFC performance pushed Benson Henderson to a split decision through pressure, combinations, wrestling, and veteran craft.',
      'The UFC résumé is thin: one memorable win and several competitive or damaging losses.',
      'He challenged for the lightweight title in his UFC debut and later fought for another title opportunity against Anthony Pettis.',
      'Diego Sanchez is the only official UFC win, while close performances supply most of the positive context.',
      'His UFC tenure was long enough to matter but began after much of his best work had already occurred elsewhere.',
      'Non-UFC greatness cannot be scored into this app’s main résumé categories.',
      'He wins skill, action, and what-if debates more often than UFC-career debates.',
      'Diego Sanchez',
      0,0,0
    )),
    fighter('Rafael Fiziev','men',['Lightweight'],['apex','new-blood'],'contender',['Ataman'],['striker','knockout','action','contender'],{
      career:70,divisions:{Lightweight:74},striking:96,grappling:62,peak:84,hardest:82,finishing:89,complete:76,action:93,starPower:75,whatIf:82,cultChaos:66
    },profile(
      'An elite pure striker with violent body work, speed, and highlight finishes, balanced by a résumé that has not reached title level.',
      'Fiziev’s UFC case is a high-level lightweight contender résumé centered on striking quality and action value.',
      'At his best, his Muay Thai layers, defensive reactions, combinations, and finishing bursts can overwhelm excellent strikers.',
      'The résumé has strong ranked wins but no championship accomplishment.',
      'He has not won a UFC title fight.',
      'Rafael dos Anjos, Brad Riddell, Bobby Green, and Renato Moicano anchor the UFC win list.',
      'His relevant UFC run is substantial but still developing.',
      'The grappling sample and absence of title-level wins keep him below the complete elite lightweights.',
      'He wins debates built around striking, finishing threat, action, and unrealized upside.',
      'Rafael dos Anjos, Brad Riddell, Bobby Green, Renato Moicano',
      0,0,0
    )),
    fighter('Renato Moicano','men',['Lightweight','Featherweight'],['superstar','apex','new-blood'],'elite',['Money Moicano'],['grappler','submission','action','personality','title-challenger','never-undisputed-champion'],{
      career:76,divisions:{Lightweight:80,Featherweight:74},striking:78,grappling:92,peak:85,hardest:82,finishing:89,complete:84,action:86,starPower:82,whatIf:80,cultChaos:86
    },profile(
      'A high-level two-division veteran whose submission game, improved striking, and late-career personality turned him into a dangerous fan favorite.',
      'Moicano’s UFC résumé combines featherweight contender wins, a strong lightweight run, and a short-notice title opportunity.',
      'His peak version pressures intelligently, attacks the back, finishes submissions, and survives difficult momentum swings.',
      'The résumé is good and increasingly deep, but the title loss and other elite defeats limit the championship case.',
      'He challenged for the lightweight title on short notice but did not win it.',
      'Saint Denis, Turner, Dober, Riddell, Kattar, and Stephens form a strong win group.',
      'Longevity is a real strength across featherweight and lightweight.',
      'He has not produced the signature championship win required for a top-tier résumé.',
      'He wins debates through grappling, finishing variety, toughness, and long-form UFC relevance.',
      'Benoît Saint Denis, Jalin Turner, Drew Dober, Brad Riddell, Calvin Kattar, Jeremy Stephens',
      0,0,0
    )),
    fighter('Mackenzie Dern','women',['Strawweight'],['superstar','apex','new-blood'],'elite',[],['champion','former-champion','grappler','submission','star','finisher'],{
      career:88,divisions:{Strawweight:93},striking:68,grappling:100,peak:92,hardest:90,finishing:88,complete:85,action:86,starPower:86,whatIf:72,cultChaos:74
    },profile(
      'A UFC strawweight champion and generational jiu-jitsu specialist whose improving MMA game finally converted elite grappling into championship proof.',
      'Dern’s UFC résumé now includes a title win, strong contender depth, and one of the division’s most dangerous submission threats.',
      'At her best, every scramble can become a finish; improved pressure and striking make the grappling harder to avoid.',
      'The résumé has championship value but still needs defenses and greater separation for an all-time divisional case.',
      'She won the UFC strawweight title and entered the next phase of her career as champion.',
      'Jandiroba, Ribas, Godinez, Hill, Torres, and Nina Nunes anchor the win list.',
      'Her elite run has developed over several years and remains active.',
      'The takedown-entry and defensive striking limitations have produced multiple decision losses.',
      'She wins comparisons through championship proof, unmatched grappling, and submission danger.',
      'Virna Jandiroba, Amanda Ribas, Loopy Godinez, Angela Hill, Tecia Torres, Nina Nunes',
      1,1,0
    )),
    fighter('Germaine de Randamie','women',['Bantamweight','Featherweight'],['golden-age','superstar','apex'],'elite',['The Iron Lady'],['former-champion','striker','title-challenger','what-if'],{
      career:78,divisions:{Bantamweight:82,Featherweight:86},striking:97,grappling:58,peak:89,hardest:88,finishing:82,complete:74,action:76,starPower:76,whatIf:90,cultChaos:62
    },profile(
      'A former UFC featherweight champion and elite kickboxer whose inactivity and grappling limitations left a larger career unrealized.',
      'De Randamie’s UFC résumé has real championship proof and excellent striking wins, but not the activity or defenses of the top women’s cases.',
      'At her best, distance management, clinch knees, accuracy, and composure made her one of the best pure strikers in women’s MMA.',
      'She won UFC gold and remained a high-level bantamweight, though the reign ended without a defense.',
      'She won the inaugural UFC women’s featherweight title and later challenged Amanda Nunes at bantamweight.',
      'Holm, Pennington, Ladd, Peña, and Budd headline the UFC win list.',
      'Long inactivity gaps significantly limit active elite-year value.',
      'Elite grapplers and the lack of title defenses cap the résumé.',
      'She wins comparisons through striking quality, championship proof, and what-if value.',
      'Holly Holm, Raquel Pennington, Aspen Ladd, Julianna Peña, Julia Budd',
      1,1,0
    )),
    fighter('Jessica Eye','women',['Flyweight','Bantamweight'],['golden-age','superstar','apex'],'recognizable',['Evil'],['title-challenger','veteran','striker'],{
      career:54,divisions:{Flyweight:60,Bantamweight:52},striking:70,grappling:55,peak:70,hardest:67,finishing:34,complete:62,action:62,starPower:64,whatIf:52,cultChaos:56
    },profile(
      'A durable two-division veteran who earned a flyweight title shot but lacked the finishing and elite separation of the division’s best.',
      'Eye’s UFC résumé is a recognizable contender case with a difficult record and one genuine title opportunity.',
      'Her best form relied on boxing volume, toughness, and the ability to bank competitive rounds.',
      'She reached a title fight but did not build a championship-level win ledger.',
      'She challenged Valentina Shevchenko for the flyweight title and lost.',
      'Chookagian, Clark, Faria, and Smith are the main UFC wins.',
      'She accumulated meaningful UFC tenure across bantamweight and flyweight.',
      'Low finishing threat and losses to elite opposition keep the rating modest.',
      'She is useful as an average-to-below-average résumé and finishing trap.',
      'Katlyn Chookagian, Jessica-Rose Clark, Kalindra Faria, Leslie Smith',
      0,0,0
    )),
    fighter('Bethe Correia','women',['Bantamweight'],['golden-age','superstar'],'wildcard',['Pitbull'],['title-challenger','lower-tier','personality'],{
      career:42,divisions:{Bantamweight:45},striking:58,grappling:42,peak:58,hardest:56,finishing:38,complete:48,action:58,starPower:62,whatIf:50,cultChaos:65
    },profile(
      'A recognizable bantamweight title challenger whose personality and Rousey buildup exceeded the depth of her UFC résumé.',
      'Correia adds valuable lower-tier variety: a real title shot, a few solid wins, and clear competitive limitations.',
      'Her best version was durable, aggressive, and willing to exchange, without an elite specialty.',
      'The résumé includes a title opportunity but no high-end championship win.',
      'She challenged Ronda Rousey for the bantamweight title and was stopped.',
      'Baszler, Duke, and Kedzie are the primary UFC wins.',
      'She remained in the division for several years without sustained contender success.',
      'Limited athleticism, grappling, and finishing threat create a low ceiling.',
      'She wins only narrow fame, personality, or chaos arguments against stronger competitors.',
      'Shayna Baszler, Jessamyn Duke, Julie Kedzie',
      0,0,0
    ))
  ]);

  const FIGHT_LEDGER=Object.freeze([
    fight('Ben Askren','Jorge Masvidal',1,'Jorge Masvidal','major','Masvidal knocked Askren out in five seconds, creating one of the clearest and most famous direct-result separators in UFC history.'),
    fight('Cody Garbrandt','Dominick Cruz',1,'Cody Garbrandt','major','Garbrandt outpointed Cruz to win the bantamweight title in the defining performance of Cody’s career.'),
    fight('Anthony Johnson','Daniel Cormier',2,'Daniel Cormier','major','Cormier submitted Johnson in two light-heavyweight title fights, establishing the championship ceiling on Rumble’s résumé.'),
    fight('Jon Jones','Lyoto Machida',1,'Jon Jones','major','Jones submitted Machida in a light-heavyweight title fight after Machida gave him one of the sharper early striking tests of his reign.'),
    fight('Georges St-Pierre','Josh Koscheck',2,'Georges St-Pierre','major','St-Pierre beat Koscheck twice, including a dominant title defense, creating clean direct separation.'),
    fight('Anthony Pettis','Gilbert Melendez',1,'Anthony Pettis','major','Pettis submitted Melendez in a lightweight title fight, closing Gilbert’s second UFC championship opportunity.'),
    fight('Rafael Fiziev','Renato Moicano',1,'Rafael Fiziev','contextual','Fiziev knocked out Moicano early in both fighters’ UFC development; it matters directly but does not erase Moicano’s later lightweight growth.'),
    fight('Jessica Andrade','Mackenzie Dern',1,'Jessica Andrade','contextual','Andrade stopped Dern before Dern’s later championship rise, making it an important developmental loss rather than complete career separation.'),
    fight('Amanda Nunes','Germaine de Randamie',2,'Amanda Nunes','major','Nunes beat de Randamie twice, including a bantamweight title fight, establishing clear direct separation.'),
    fight('Jessica Eye','Valentina Shevchenko',1,'Valentina Shevchenko','major','Shevchenko knocked out Eye in a flyweight title fight, one of the clearest championship-level separators in the division.'),
    fight('Bethe Correia','Ronda Rousey',1,'Ronda Rousey','major','Rousey stopped Correia in their bantamweight title fight, defining the ceiling of Bethe’s contender run.')
  ]);

  const api={
    version:VERSION,
    batch:BATCH,
    names:BATCH.map(row=>row.name),
    apply:applyAll,
    patchPlayData,
    patchKeepCutRatings,
    patchBlindRankRatings,
    profileFor(value){const target=normal(typeof value==='object'?(value.name||value.id):value);return BATCH.find(row=>normal(row.name)===target||row.id===slug(target))?.profile||null;}
  };
  root.UFC_KEEP_CUT_EXPANSION_BATCH_ONE=api;
  root.document?.documentElement?.setAttribute('data-keep-cut-fighter-batch',VERSION);

  function fighter(name,gender,divisions,eras,selectionTier,aliases,tags,ratings,profileData){
    return Object.freeze({
      id:slug(name),name,gender,divisions:Object.freeze(divisions),eras:Object.freeze(eras),selectionTier,
      aliases:Object.freeze(aliases),tags:Object.freeze(tags),ratings:Object.freeze({...ratings,divisions:Object.freeze({...ratings.divisions})}),
      profile:Object.freeze(profileData)
    });
  }
  function profile(oneLiner,shortCase,peak,resume,championship,opponentQuality,longevity,counter,edge,signatureWins,titleFightWins,beltsWon,titleDefenses){
    return {
      oneLiner,shortCase,peak,resume,championship,opponentQuality,longevity,counter,edge,
      eliteCounter:false,signatureWins,
      titleSummary:championship,
      primeSummary:peak,
      legacyStats:{titleFightWins,beltsWon,titleDefenses,activeEliteYearsLabel:'UFC-only active elite window',primeNote:peak}
    };
  }
  function fight(a,b,fights,winner,importance,summary){
    return Object.freeze({fighters:[a,b],fights,winner,importance,summary});
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
      hardestAtPeak:row.ratings.hardest,
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
      selectionTier:row.selectionTier,tags:unique(['play-only','keep-cut-expansion',row.gender,...row.tags,...row.divisions.map(slug)]),
      source:'play-only-keep-cut-expansion',modelRanked:false,modelRank:null,modelScore:null,thumbUrl:'',profileUrl:'',
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
    const audit=play.audit||{errors:[]};
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
          primaryDivision:existing.primaryDivision||extra.primaryDivision,
          selectionTier:existing.modelRanked?existing.selectionTier:row.selectionTier,
          eligibility:{...(existing.eligibility||{}),blindRank:true,keepCut:true}
        }:extra);
      });
      const records=sortPlay([...map.values()]);
      play.allFighters.splice(0,play.allFighters.length,...records);
      play.modelRanked.splice(0,play.modelRanked.length,...records.filter(row=>row.modelRanked));
      play.playOnly.splice(0,play.playOnly.length,...records.filter(row=>!row.modelRanked));
      play.byId=Object.fromEntries(records.map(row=>[row.id,row]));
      play.byName=Object.fromEntries(records.map(row=>[normal(row.name),row]));
      BATCH.forEach(row=>{
        if(!play.extras.some(extra=>normal(extra.name)===normal(row.name))){
          play.extras.push({name:row.name,aliases:[...row.aliases],gender:row.gender,divisions:[...row.divisions],eras:[...row.eras],selectionTier:row.selectionTier,tags:[...row.tags]});
        }
      });
      refreshPlayAudit(play);
      const signature=`${play.audit.total}|${BATCH.map(row=>row.id).every(id=>play.byId[id])}`;
      if(signature!==playSignature){
        playSignature=signature;
        root.dispatchEvent?.(new CustomEvent('ufc-play-data-ready',{detail:{version:VERSION,audit:play.audit,keepCutExpansion:true}}));
      }
      return true;
    }finally{applyingPlay=false;}
  }
  function wrapPlayRebuild(){
    const play=root.UFC_PLAY_DATA;
    if(!play||play.__keepCutExpansionBatchOneWrapped)return;
    const native=play.rebuild?.bind(play);
    play.rebuild=function(){const result=native?.();patchPlayData();return result||play;};
    play.__keepCutExpansionBatchOneWrapped=true;
  }

  function refreshKeepCutAudit(source){
    if(!source?.audit)return;
    source.audit.rosterTotal=root.UFC_PLAY_DATA?.allFighters?.length||source.entries.length;
    source.audit.ledgerTotal=source.entries.length;
    source.audit.modelRanked=source.entries.filter(entry=>entry.modelRanked).length;
    source.audit.playOnly=source.entries.length-source.audit.modelRanked;
    source.audit.ready=source.entries.filter(entry=>entry.overallReviewStatus==='ready').length;
    source.audit.provisional=source.entries.length-source.audit.ready;
    source.audit.missingFighters=[];
    source.audit.orphanedEntries=[];
    source.audit.tierCounts=Object.fromEntries(CATEGORIES.map(category=>[category,Object.fromEntries(TIER_BANDS.map(tier=>[tier.id,source.entries.filter(entry=>entry.tiers?.[category]===tier.id).length]))]));
    source.audit.sourceCounts=Object.fromEntries(CATEGORIES.map(category=>[category,source.entries.reduce((counts,entry)=>{const key=entry.ratingSources?.[category]||'missing';counts[key]=(counts[key]||0)+1;return counts;},{})]));
    source.audit.statusCounts=Object.fromEntries(CATEGORIES.map(category=>[category,source.entries.reduce((counts,entry)=>{const key=entry.reviewStatus?.[category]||'missing';counts[key]=(counts[key]||0)+1;return counts;},{})]));
    source.audit.passed=!(source.audit.errors||[]).length;
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
      entry.ratingSources={...entry.ratingSources,...Object.fromEntries(CATEGORIES.map(key=>[key,'fighter-batch-manual']))};
      entry.reviewStatus={...entry.reviewStatus,...Object.fromEntries(CATEGORIES.map(key=>[key,'approved']))};
      entry.divisionRatings={...entry.divisionRatings,...row.ratings.divisions};
      entry.divisionTiers={...entry.divisionTiers,...Object.fromEntries(Object.entries(row.ratings.divisions).map(([division,value])=>[division,tierFor(value)]))};
      entry.divisionSources={...entry.divisionSources,...Object.fromEntries(Object.keys(row.ratings.divisions).map(division=>[division,'fighter-batch-manual']))};
      entry.divisionReviewStatus={...entry.divisionReviewStatus,...Object.fromEntries(Object.keys(row.ratings.divisions).map(division=>[division,'approved']))};
      entry.overallReviewStatus='ready';
    });
    source.byId=Object.fromEntries(source.entries.map(entry=>[entry.id,entry]));
    source.byName=Object.fromEntries(source.entries.map(entry=>[normal(entry.name),entry]));
    refreshKeepCutAudit(source);
    root.document?.documentElement?.setAttribute('data-keep-cut-rating-ledger-size',String(source.entries.length));
    root.document?.documentElement?.setAttribute('data-keep-cut-fighter-batch-count',String(BATCH.length));
    return BATCH.every(row=>source.resolve(row.name));
  }
  function wrapKeepCutRebuild(){
    const source=root.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(!source||source.__keepCutExpansionBatchOneWrapped)return;
    const native=source.rebuild?.bind(source);
    source.rebuild=function(){const result=native?.();patchKeepCutRatings();return result||source;};
    source.__keepCutExpansionBatchOneWrapped=true;
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
    ledger.audit.approvedSkillAnchors={
      striking:ledger.entries.filter(entry=>entry.reviewStatus?.striking==='approved').length,
      grappling:ledger.entries.filter(entry=>entry.reviewStatus?.grappling==='approved').length
    };
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
      const ratings={
        career:{overall:row.ratings.career,divisions:{...row.ratings.divisions}},
        striking:row.ratings.striking,grappling:row.ratings.grappling,peak:row.ratings.peak,
        finishing:row.ratings.finishing,complete:row.ratings.complete,action:row.ratings.action,starPower:row.ratings.starPower
      };
      entry.ratings=ratings;
      entry.tiers={
        'career.overall':tierFor(ratings.career.overall),striking:tierFor(ratings.striking),grappling:tierFor(ratings.grappling),
        peak:tierFor(ratings.peak),finishing:tierFor(ratings.finishing),complete:tierFor(ratings.complete),
        action:tierFor(ratings.action),starPower:tierFor(ratings.starPower),
        ...Object.fromEntries(Object.entries(ratings.career.divisions).map(([division,value])=>[`career.divisions.${slug(division)}`,tierFor(value)]))
      };
      entry.ratingSources={
        ...Object.fromEntries(['career.overall','striking','grappling','peak','finishing','complete','action','starPower'].map(path=>[path,'fighter-batch-manual'])),
        ...Object.fromEntries(Object.keys(ratings.career.divisions).map(division=>[`career.divisions.${slug(division)}`,'fighter-batch-manual']))
      };
      entry.reviewStatus={
        ...Object.fromEntries(['career.overall','striking','grappling','peak','finishing','complete','action','starPower'].map(path=>[path,'approved'])),
        ...Object.fromEntries(Object.keys(ratings.career.divisions).map(division=>[`career.divisions.${slug(division)}`,'approved']))
      };
      entry.overallReviewStatus='ready';
    });
    ledger.byId=Object.fromEntries(ledger.entries.map(entry=>[entry.fighterId,entry]));
    ledger.byName=Object.fromEntries(ledger.entries.map(entry=>[normal(entry.fighterName),entry]));
    refreshBlindAudit(ledger);
    root.document?.documentElement?.setAttribute('data-blind-rank-rating-ledger-size',String(ledger.entries.length));
    root.UFC_BLIND_RANK_POOL_AUDIT?.rebuild?.();
    return true;
  }
  function wrapBlindRebuild(){
    const ledger=root.UFC_BLIND_RANK_CATEGORY_RATINGS;
    if(!ledger||ledger.__keepCutExpansionBatchOneWrapped)return;
    const native=ledger.rebuild?.bind(ledger);
    ledger.rebuild=function(){const result=native?.();patchBlindRankRatings();return result||ledger;};
    ledger.__keepCutExpansionBatchOneWrapped=true;
  }

  function applyProfiles(){
    root.COMPARE_PROFILES=root.COMPARE_PROFILES||{};
    root.DISPLAY_OVERRIDES=root.DISPLAY_OVERRIDES||{};
    BATCH.forEach(row=>{
      root.COMPARE_PROFILES[row.name]={
        ...(root.COMPARE_PROFILES[row.name]||{}),
        ...row.profile,
        legacyStats:{
          ...((root.COMPARE_PROFILES[row.name]||{}).legacyStats||{}),
          ...(row.profile.legacyStats||{})
        }
      };
      root.DISPLAY_OVERRIDES[row.name]={
        ...(root.DISPLAY_OVERRIDES[row.name]||{}),
        oneLiner:root.DISPLAY_OVERRIDES[row.name]?.oneLiner||row.profile.oneLiner,
        compareProfile:{
          ...(root.DISPLAY_OVERRIDES[row.name]?.compareProfile||{}),
          ...root.COMPARE_PROFILES[row.name]
        }
      };
    });
    root.COMPARE_FIGHT_LEDGER=root.COMPARE_FIGHT_LEDGER||{};
    FIGHT_LEDGER.forEach(row=>{
      const key=row.fighters.map(normal).sort().join('|');
      root.COMPARE_FIGHT_LEDGER[key]={...row,fighters:[...row.fighters]};
    });
  }

  function applyAll(){
    applyProfiles();
    wrapPlayRebuild();
    patchPlayData();
    if(root.UFC_KEEP_CUT_CATEGORY_RATINGS){wrapKeepCutRebuild();patchKeepCutRatings();}
    if(root.UFC_BLIND_RANK_CATEGORY_RATINGS){wrapBlindRebuild();patchBlindRankRatings();}
    return api;
  }

  root.addEventListener?.('ufc-play-data-ready',()=>patchPlayData());
  root.addEventListener?.('ufc-keep-cut-ratings-ready',()=>{
    wrapKeepCutRebuild();
    const passed=patchKeepCutRatings();
    if(passed)root.dispatchEvent?.(new CustomEvent('ufc-keep-cut-expansion-ready',{detail:{version:VERSION,count:BATCH.length,names:api.names}}));
  });
  root.addEventListener?.('ufc-blind-rank-category-ratings-ready',()=>{wrapBlindRebuild();patchBlindRankRatings();});
  applyAll();
})(typeof window!=='undefined'?window:globalThis);
