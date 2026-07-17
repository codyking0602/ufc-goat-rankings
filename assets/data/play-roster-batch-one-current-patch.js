(function(){
  'use strict';

  const VERSION='play-roster-batch-one-current-patch-20260717a';
  const PATCHES={
    'Rafael Fiziev':{
      tags:['current-contender','striker','action','highlight'],
      ratings:{ufcCareer:70,allCareers:70,bestPrime:84,hardestAtPeak:82,mostComplete:76,bestFinisher:89,actionFighter:93,starPower:75,biggestWhatIf:82,cultChaos:66},
      divisions:{Lightweight:74},
      profile:{
        shortCase:'Fiziev is the action-striker contender: elite kicking offense, speed, combinations, and renewed momentum without championship proof yet.',
        peak:'Layered Muay Thai, body work, counters, balance, and sudden finishing combinations define his best performances.',
        resume:'His UFC résumé now includes a strong winning streak, ranked lightweight wins, and a 2026 knockout over Manuel Torres, but no title fight.',
        championship:'No UFC title fights.',
        opponentQuality:'Rafael dos Anjos, Bobby Green, Renato Moicano, Brad Riddell, Ignacio Bahamondes, and Manuel Torres form the core UFC win list.',
        longevity:'The contender window has become meaningful, though injuries interrupted the middle of the run.',
        counter:'He still lacks championship fights and deep top-five win volume.',
        edge:'He wins striking, action, finishing-threat, and What-If debates more often than career-résumé debates.',
        eliteCounter:false,
        signatureWins:'Rafael dos Anjos, Bobby Green, Renato Moicano, Brad Riddell, Ignacio Bahamondes, and Manuel Torres.',
        titleSummary:'No UFC title-fight wins.',
        primeSummary:'A dangerous modern lightweight striking peak that regained momentum with a 2026 knockout win.',
        titleStyle:'noTitleActionContender',
        primeStyle:'muayThaiContenderPrime',
        legacyStats:{titleFightWins:0,beltsWon:0,titleDefenses:0,activeEliteYearsLabel:'roughly 4 active elite years',primeNote:'high-level Muay Thai contender run with renewed 2026 momentum and no title-fight proof yet'}
      }
    },
    'Renato Moicano':{
      tags:['title-challenger','grappler','submission','action','personality'],
      ratings:{ufcCareer:76,allCareers:76,bestPrime:85,hardestAtPeak:82,mostComplete:84,bestFinisher:89,actionFighter:86,starPower:82,biggestWhatIf:80,cultChaos:86},
      divisions:{Lightweight:80,Featherweight:74},
      profile:{
        shortCase:'Moicano is the adaptable two-division veteran: elite back-taking, improved pressure boxing, a short-notice title challenge, and a strong 2026 return.',
        peak:'Long-range combinations, reactive takedowns, back control, submissions, cardio, and veteran adjustments form a complete style.',
        resume:'The UFC résumé has meaningful depth across featherweight and lightweight, a 2025 lightweight title challenge, and a 2026 submission win over Chris Duncan.',
        championship:'He challenged Islam Makhachev for the UFC lightweight title on short notice and lost by submission.',
        opponentQuality:'Benoît Saint Denis, Jalin Turner, Drew Dober, Brad Riddell, Calvin Kattar, Jeremy Stephens, and Chris Duncan give him strong depth.',
        longevity:'Longevity is a real strength because he remained relevant through a division move and multiple career phases.',
        counter:'The best opponents have often beaten him, and he has no UFC title-fight win.',
        edge:'He wins versatility, grappling, finishing variety, longevity, and solid-win-depth debates.',
        eliteCounter:false,
        signatureWins:'Benoît Saint Denis, Jalin Turner, Drew Dober, Brad Riddell, Calvin Kattar, Jeremy Stephens, and Chris Duncan.',
        titleSummary:'One UFC lightweight title challenge and zero title-fight wins.',
        primeSummary:'A late-developing two-division prime built around submissions, improved pressure striking, and sustained veteran relevance.',
        titleStyle:'shortNoticeTitleChallenger',
        primeStyle:'adaptiveGrapplingPrime',
        legacyStats:{titleFightWins:0,beltsWon:0,titleDefenses:0,activeEliteYearsLabel:'roughly 7 active elite years',primeNote:'two-division veteran prime with elite back-taking, a short-notice title challenge, and a 2026 submission return'}
      }
    },
    'Mackenzie Dern':{
      tags:['current-champion','champion','grappler','submission','star'],
      ratings:{ufcCareer:88,allCareers:88,bestPrime:92,hardestAtPeak:90,mostComplete:85,bestFinisher:88,actionFighter:86,starPower:86,biggestWhatIf:72,cultChaos:74},
      divisions:{Strawweight:93},
      profile:{
        shortCase:'Dern is the current UFC strawweight champion and elite-submission specialist: world-class grappling finally converted into championship proof.',
        peak:'Her best version pairs constant submission danger with improved striking, pace, composure, and five-round decision-making.',
        resume:'The UFC résumé now includes the strawweight title, two wins over Virna Jandiroba, a Ribas submission, and years of ranked-level depth.',
        championship:'She defeated Virna Jandiroba by unanimous decision at UFC 321 to win the vacant UFC strawweight title.',
        opponentQuality:'Virna Jandiroba twice, Amanda Ribas, Loopy Godinez, Angela Hill, Tecia Torres, Nina Nunes, and Randa Markos anchor the UFC win list.',
        longevity:'She has maintained ranked relevance since 2018 and converted a long development curve into championship success.',
        counter:'The striking defense, takedown-entry efficiency, and five career losses keep her below the cleanest dominant champion peaks.',
        edge:'She wins championship, grappling, submission-threat, star-power, and late-development comparisons.',
        eliteCounter:true,
        signatureWins:'Virna Jandiroba twice, Amanda Ribas, Loopy Godinez, Angela Hill, Tecia Torres, Nina Nunes, and Randa Markos.',
        titleSummary:'Current UFC strawweight champion with one title-fight win and no completed defense yet.',
        primeSummary:'A championship-level specialist prime with improved striking and enough composure to win a five-round title fight.',
        titleStyle:'currentStrawweightChampion',
        primeStyle:'championshipGrapplingPrime',
        legacyStats:{titleFightWins:1,beltsWon:1,titleDefenses:0,activeEliteYearsLabel:'roughly 6 active elite years',primeNote:'elite submission specialist who developed into the current UFC strawweight champion'}
      }
    }
  };

  const TIER_BANDS=[['elite',92,100],['great',82,91],['good',70,81],['average',55,69],['below-average',35,54],['bad',0,34]];
  const text=value=>String(value??'').trim();
  const normal=value=>text(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();
  const unique=values=>[...new Set((values||[]).map(text).filter(Boolean))];
  const tierFor=value=>{const rating=Math.max(0,Math.min(100,Math.round(Number(value)||0)));return TIER_BANDS.find(([,min,max])=>rating>=min&&rating<=max)?.[0]||'bad';};

  function applyRosterPatch(){
    const api=window.UFC_PLAY_DATA;
    if(!api)return false;
    Object.entries(PATCHES).forEach(([name,patch])=>{
      const fighter=api.resolve?.(name)||api.allFighters?.find(row=>normal(row.name)===normal(name));
      if(!fighter)return;
      fighter.tags=unique([...(fighter.tags||[]),...(patch.tags||[])]);
      fighter.eligibility={...(fighter.eligibility||{}),blindRank:true,keepCut:true};
    });
    document.documentElement.setAttribute('data-play-roster-batch-one-current',VERSION);
    return true;
  }

  function mergeProfile(name,profile){
    window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
    window.COMPARE_PROFILES[name]={
      ...(window.COMPARE_PROFILES[name]||{}),
      ...profile,
      legacyStats:{...((window.COMPARE_PROFILES[name]||{}).legacyStats||{}),...(profile.legacyStats||{})}
    };
    if(window.DISPLAY_OVERRIDES){
      window.DISPLAY_OVERRIDES[name]=window.DISPLAY_OVERRIDES[name]||{};
      window.DISPLAY_OVERRIDES[name].compareProfile={
        ...(window.DISPLAY_OVERRIDES[name].compareProfile||{}),
        ...window.COMPARE_PROFILES[name],
        legacyStats:{...((window.DISPLAY_OVERRIDES[name].compareProfile||{}).legacyStats||{}),...(window.COMPARE_PROFILES[name].legacyStats||{})}
      };
    }
  }

  function applyProfiles(){
    Object.entries(PATCHES).forEach(([name,patch])=>mergeProfile(name,patch.profile));
    document.documentElement.setAttribute('data-compare-profiles-batch-one-current',VERSION);
  }

  function applyLedgerPatch(){
    const ledger=window.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(!ledger)return false;
    Object.entries(PATCHES).forEach(([name,patch])=>{
      const entry=ledger.resolve?.(name);
      if(!entry)return;
      Object.entries(patch.ratings||{}).forEach(([category,value])=>{
        entry.ratings[category]=value;
        entry.tiers[category]=tierFor(value);
        entry.ratingSources[category]='manual-current-2026';
        entry.reviewStatus[category]='approved';
      });
      Object.entries(patch.divisions||{}).forEach(([division,value])=>{
        entry.divisionRatings[division]=value;
        entry.divisionTiers[division]=tierFor(value);
        entry.divisionSources[division]='manual-current-2026';
        entry.divisionReviewStatus[division]='approved';
        entry.eligibility.divisions[division]=true;
      });
      entry.overallReviewStatus='ready';
    });
    document.documentElement.setAttribute('data-keep-cut-rating-current-patch',VERSION);
    return true;
  }

  function wrapRebuilds(){
    const play=window.UFC_PLAY_DATA;
    if(play&&!play.__batchOneCurrentWrapped){
      const native=play.rebuild.bind(play);
      play.rebuild=function(){const result=native();applyRosterPatch();return result;};
      play.__batchOneCurrentWrapped=true;
    }
    const ledger=window.UFC_KEEP_CUT_CATEGORY_RATINGS;
    if(ledger&&!ledger.__batchOneCurrentWrapped){
      const native=ledger.rebuild.bind(ledger);
      ledger.rebuild=function(){const result=native();applyLedgerPatch();return result;};
      ledger.__batchOneCurrentWrapped=true;
    }
  }

  applyRosterPatch();
  applyProfiles();
  wrapRebuilds();
  applyLedgerPatch();
  window.addEventListener('ufc-play-data-ready',()=>applyRosterPatch());
  window.addEventListener('ufc-keep-cut-ratings-ready',()=>{wrapRebuilds();applyLedgerPatch();});

  window.UFC_PLAY_ROSTER_BATCH_ONE_CURRENT={
    version:VERSION,
    fighters:Object.keys(PATCHES),
    applyRosterPatch,
    applyLedgerPatch,
    audit(){
      const roster=window.UFC_PLAY_DATA;
      const ledger=window.UFC_KEEP_CUT_CATEGORY_RATINGS;
      return {
        rosterPresent:Object.keys(PATCHES).every(name=>Boolean(roster?.resolve?.(name))),
        ratingsPresent:Object.keys(PATCHES).every(name=>Boolean(ledger?.resolve?.(name))),
        profilesPresent:Object.keys(PATCHES).every(name=>Boolean(window.COMPARE_PROFILES?.[name])),
        dernChampion:Boolean(roster?.resolve?.('Mackenzie Dern')?.tags?.includes('current-champion')),
        rosterTotal:roster?.audit?.total||roster?.allFighters?.length||0,
        ledgerTotal:ledger?.audit?.ledgerTotal||ledger?.entries?.length||0
      };
    }
  };
})();
