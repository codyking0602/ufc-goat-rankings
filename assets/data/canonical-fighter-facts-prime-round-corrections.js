// Approved canonical round-control corrections exposed by shared Era Ledger expansions.
// Evidence-only on draft PR #39. Patches fight facts; never writes category scores, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='canonical-fighter-facts-prime-round-corrections-20260714a-fourteen';
  const API=window.UFC_CANONICAL_FIGHTER_FACTS;
  if(!API?.get||!API?.replace){
    window.UFC_CANONICAL_FIGHTER_FACTS_PRIME_ROUND_CORRECTIONS={version:VERSION,applied:false,error:'Missing canonical fighter facts API.',mutatesRankingData:false};
    return;
  }

  const CORRECTIONS={
    'Randy Couture':{
      '1997-05-30-tony-halme':{won:1,lost:0,drawn:0,note:'First-round submission win; the finishing round belongs to Couture.'},
      '1997-05-30-steven-graham':{won:1,lost:0,drawn:0,note:'First-round TKO tournament win; the finishing round belongs to Couture.'},
      '1997-10-17-vitor-belfort':{won:1,lost:0,drawn:0,note:'First-round TKO upset win over Belfort; the finishing round belongs to Couture.'},
      '1997-12-21-maurice-smith':{won:1,lost:0,drawn:0,note:'Single-period UFC Japan championship decision won by Couture.'},
      '2000-11-17-kevin-randleman':{won:1,lost:2,drawn:0,note:'Randleman controlled the first two rounds with takedowns; Couture won the third-round finishing frame.'},
      '2001-05-04-pedro-rizzo':{won:3,lost:2,drawn:0,note:'Five-round unanimous decision. Couture later described himself as winning three of the five rounds.'},
      '2001-11-02-pedro-rizzo':{won:3,lost:0,drawn:0,note:'More decisive rematch: Couture controlled both completed rounds and the third-round finishing frame.'},
      '2002-03-22-josh-barnett':{won:1,lost:1,drawn:0,note:'Couture controlled round one; Barnett won the second-round finishing frame.'},
      '2002-09-27-ricco-rodriguez':{won:3,lost:2,drawn:0,note:'Couture controlled the first three rounds before Rodriguez took rounds four and the fifth-round finish.'}
    },
    'Tito Ortiz':{
      '2007-07-07-rashad-evans':{won:2,lost:1,drawn:0,note:'The official 28-28 draw came from Ortiz winning two rounds to one before a one-point fence-grab deduction.'},
      '2008-05-24-lyoto-machida':{won:0,lost:3,drawn:0,note:'Machida won all three rounds; all official scorecards were 30-27.'}
    },
    'Miesha Tate':{
      '2013-12-28-ronda-rousey':{won:0,lost:3,drawn:0,note:'Rousey controlled all three frames and submitted Tate in round three; mirrored from the locked Rousey audit.'},
      '2014-04-19-liz-carmouche':{won:2,lost:1,drawn:0,note:'Tate won the competitive three-round decision two rounds to one.'},
      '2014-09-20-rin-nakai':{won:3,lost:0,drawn:0,note:'Tate controlled the full three-round unanimous decision.'}
    }
  };

  const applied=[];
  const missing=[];
  Object.entries(CORRECTIONS).forEach(([fighter,byFightId])=>{
    const record=API.get(fighter);
    if(!record){missing.push({fighter,reason:'missing-fighter'});return;}
    Object.entries(byFightId).forEach(([fightId,rounds])=>{
      const fight=record.fights.find(row=>row.id===fightId);
      if(!fight){missing.push({fighter,fightId,reason:'missing-fight'});return;}
      fight.rounds={status:'audited',won:rounds.won,lost:rounds.lost,drawn:rounds.drawn,reviewStatus:'locked',note:rounds.note,provenance:'Cody-approved shared-window Prime Dominance dependency audit'};
      applied.push({fighter,fightId,won:rounds.won,lost:rounds.lost,drawn:rounds.drawn,note:rounds.note});
    });
    API.replace(record,`Apply ${VERSION} round-control corrections exposed by approved shared Era Ledger changes.`);
  });

  window.UFC_CANONICAL_FIGHTER_FACTS_PRIME_ROUND_CORRECTIONS={
    version:VERSION,
    applied:missing.length===0,
    correctionCount:applied.length,
    expectedCorrectionCount:14,
    fighters:Object.keys(CORRECTIONS),
    corrections:applied,
    missing,
    mutatesFightFacts:applied.length>0,
    mutatesRankingData:false,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };
  if(typeof document!=='undefined'&&document?.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-canonical-fighter-facts-prime-round-corrections',`${VERSION}-${applied.length}-${missing.length}`);
  }
})();
