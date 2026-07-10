// Miesha Tate fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-miesha-tate-20260706a';
  const fighter = 'Miesha Tate';

  const rounds = [
    { opponent:'Cat Zingano', date:'2013-04-13', method:'R3 TKO loss', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Pre-prime elite/top contender loss, finished', confidence:'Medium', notes:'Pre-prime loss to elite/top contender; finished.' },
    { opponent:'Ronda Rousey', date:'2013-12-28', method:'R3 submission loss', roundEnded:3, roundsCounted:3, roundsWon:0, basis:'Pre-prime UFC title loss to champion/top-5, finished', confidence:'High', notes:'Pre-prime title loss; finished.' },
    { opponent:'Liz Carmouche', date:'2014-04-19', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Prime-start decision row', confidence:'Medium', notes:'Former UFC title challenger win; prime starts here.' },
    { opponent:'Rin Nakai', date:'2014-09-20', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Decision win row', confidence:'Medium', notes:'Supporting UFC win.' },
    { opponent:'Sara McMann', date:'2015-01-31', method:'Majority decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Ranked contender decision row', confidence:'Medium', notes:'Strong contender win during title climb.' },
    { opponent:'Jessica Eye', date:'2015-07-25', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:3, basis:'Contender decision row', confidence:'Medium', notes:'Solid contender win.' },
    { opponent:'Holly Holm', date:'2016-03-05', method:'Title win R5 submission', roundEnded:5, roundsCounted:5, roundsWon:1, basis:'UFC bantamweight title win', confidence:'High', notes:'Rare 1.25 Quality Win title-winning champion exception; signature peak moment.' },
    { opponent:'Amanda Nunes', date:'2016-07-09', method:'Title loss R1 submission', roundEnded:1, roundsCounted:1, roundsWon:0, basis:'Prime title loss to champion/top-5, finished', confidence:'High', notes:'Prime window ends here; counted finish-loss damage.' },
    { opponent:'Raquel Pennington', date:'2016-11-12', method:'Decision loss', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Post-prime retirement/exit fight', confidence:'Medium', notes:'Post-prime/exit loss; 0 loss-context penalty.' },
    { opponent:'Marion Reneau', date:'2021-07-17', method:'R3 TKO win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Comeback stoppage win row', confidence:'Medium', notes:'Comeback relevance win, not prime-core proof.' },
    { opponent:'Ketlen Vieira', date:'2021-11-20', method:'Decision loss', roundEnded:5, roundsCounted:5, roundsWon:2, basis:'Post-prime comeback loss', confidence:'Medium', notes:'Post-prime loss; 0 loss-context penalty.' },
    { opponent:'Lauren Murphy', date:'2022-07-16', method:'Decision loss', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Post-prime flyweight/upward-division loss', confidence:'Medium', notes:'Post-prime flyweight loss; 0 loss-context penalty.' },
    { opponent:'Julia Avila', date:'2023-12-02', method:'R3 submission win', roundEnded:3, roundsCounted:3, roundsWon:3, basis:'Late-career submission win row', confidence:'Medium', notes:'Useful late-career win, not prime-core proof.' },
    { opponent:'Yana Santos', date:'2025-05-03', method:'Decision loss', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Post-prime late-career loss', confidence:'Medium', notes:'Post-prime late-career loss; 0 loss-context penalty.' }
  ];

  const boardRow = {
    fighter, totalScore:28.20, championship:8.50, opponentQuality:3.85, primeDominance:14.80, longevity:6.00, apexPeak:3.35, penalty:-5.25,
    leaderboard:'women', gender:'Women', ufcRecord:'7-7', primaryDivision:'Bantamweight', secondaryDivision:'Flyweight', finishRatePct:42.9, activeEliteYears:6.00, timesFinishedPrime:1,  roundsWonPct:48.8,
    notes:'Permanent fighter-packet add. Former UFC bantamweight champion with a legendary Holm title win, solid contender climb, short reign, and post-prime comeback losses carrying 0 loss-context penalty.'
  };

  const profile = {
    id:'MT001', fighter, gender:'Women', primaryDivision:'Bantamweight', secondaryDivision:'Flyweight', scope:'UFC', ufcRecord:'7-7', ufcWins:7, ufcLosses:7, scoredUfcFights:14, finishWins:3, finishRatePct:42.9, timesFinishedPrime:1, lossPenalty:-5.25, activeEliteYears:6.00, primeStart:'Liz Carmouche 2014', primeEnd:'Amanda Nunes 2016', totalScore:28.20, championship:8.50, opponentQuality:3.85, primeDominance:14.80, longevity:6.00, apexPeak:3.35, penalty:-5.25, leaderboard:'women', rounds,
    title:{ normalTitleWins:1, adjustedTitleWins:1.00, notes:'Won the UFC bantamweight title from Holly Holm. Holm title win = 1.00 adjusted title win. Ronda Rousey and Amanda Nunes are title losses and add no Championship credit.' },
    opponents:[
      { opponent:'Holly Holm', date:'2016-03-05', division:'Bantamweight', context:'Won UFC bantamweight title from reigning champion with fifth-round submission', credit:1.25, type:'Rare title-win exception' },
      { opponent:'Sara McMann', date:'2015-01-31', division:'Bantamweight', context:'Strong ranked contender win during title climb', credit:0.75, type:'Partial' },
      { opponent:'Liz Carmouche', date:'2014-04-19', division:'Bantamweight', context:'Former UFC title challenger win and prime-start marker', credit:0.55, type:'Partial' },
      { opponent:'Jessica Eye', date:'2015-07-25', division:'Bantamweight', context:'Solid contender win', credit:0.50, type:'Partial' },
      { opponent:'Marion Reneau', date:'2021-07-17', division:'Bantamweight', context:'Comeback stoppage win', credit:0.30, type:'Partial' },
      { opponent:'Julia Avila', date:'2023-12-02', division:'Bantamweight', context:'Late-career submission win', credit:0.30, type:'Partial' },
      { opponent:'Rin Nakai', date:'2014-09-20', division:'Bantamweight', context:'Supporting UFC win', credit:0.20, type:'Partial' }
    ],
    notes:'UFC-only women’s champion case: legendary Holm title win and gritty contender run, capped by no defenses, limited UFC win depth, and counted finish losses to elite opponents.'
  };

  const packet = {
    status:{ stage:'complete first-pass packet; UFC bantamweight title case, win ledger, loss context, round-control rows, compare seasoning, fight ledger, and Watch Moment included', lastUpdated:'2026-07-06', nextFix:'Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild.' },
    repoLocations:{ scoreSource:'assets/data/fighter-packets/miesha-tate.js', centralPacket:'assets/data/fighter-packets/miesha-tate.js', watchMoment:'assets/js/watch-moments.js', tracker:'docs/fighter-status.md', photos:'No real photo files loaded yet; app should use initials fallback.' },
    photos:{},
    rounds,
    boardRow,
    profile,
    display:{
      overallOvr:78, divisionLabel:'WBW / WFLW', resumeTag:'Bantamweight title comeback',
      oneLiner:'A former UFC bantamweight champion whose UFC-only case is built on the legendary Holm comeback, a solid contender climb, and a short reign with no defenses.',
      categories:{ championship:{ovr:74}, opponentQuality:{ovr:68}, primeDominance:{ovr:77}, longevity:{ovr:70}, apexPeak:{ovr:78}, penalty:{ovr:73} },
      snapshot:[ ['UFC Record','7-7'], ['UFC Title-Fight Wins','1 official / 1.00 adjusted'], ['Apex Peak','+3.35'], ['Quality Wins','Holm, McMann, Carmouche, Eye'],  ['Prime Dominance','14.80 / 30'], ['Rounds Won','48.8% best-effort'], ['Loss Context','-5.25'] ],
      whyRankedHere:'Tate scores as a legitimate UFC champion because the Holm win was a real title-winning peak moment, and the Carmouche/McMann/Eye run gives the title climb enough support.',
      whyNotHigher:'The UFC-only case is thin after the Holm win. She has one title-fight win, zero defenses, limited elite UFC win depth, and three counted finish losses before the post-prime cutoff.',
      bigAssumptions:[ ['Adjusted title wins','Holm title win is 1.00. No title result gets boosted above 1.00.'], ['Quality Wins cap','Holm gets the rare 1.25 title-winning champion exception; every other win stays below 1.00.'], ['Prime start','Prime starts at Liz Carmouche in 2014, not the Cat/Rousey losses.'], ['Prime end','Prime ends with the Amanda Nunes title loss. Pennington and later comeback losses are post-prime.'], ['Strikeforce context','Strikeforce title and broader Rousey rivalry matter historically but are not scored in UFC-only rankings.'], ['Photos','No photo paths until real files exist in assets/fighters/.'] ],
      keyJudgmentCalls:[ ['Holm win','The Holm comeback carries the case and gets the rare 1.25 Quality Win credit.'], ['Pennington cutoff','Pennington is treated as post-prime/retirement-exit, not a full prime non-elite loss.'], ['Comeback phase','Reneau and Avila help record volume, but Vieira, Murphy, and Santos are post-prime losses with 0 penalty.'], ['Women’s bantamweight context','Historically important division, but uneven depth compared with later women’s strawweight/flyweight peaks.'] ],
      apexPeakSummary:{ score:3.35, window:'Holm title-winning comeback', components:{ peakStatus:0.75, eliteOpponentProof:0.85, separationDominance:0.45, divisionStrength:0.55, cleanApexAura:0.75 }, notes:'The Holm finish maxes the apex-aura piece, but the overall Apex score is capped because the title reign ended immediately and Tate was not a sustained dominant champion.' },
      primeDominanceSummary:{ score:14.80, components:{ primeRecord:5.60, primeRoundsWon:3.45, titleDefenseDominance:0.00, finishStoppageDominance:1.85, lossSafetyDurability:2.30, divisionStrength:1.60 }, notes:'A 5-1 prime title climb gets real credit, but the round-control profile and no-defense reign keep dominance moderate.' },
      finalTakeaway:'Tate is a historically important women’s MMA figure, but in UFC-only scoring she is a one-great-title-win champion case rather than a deep-reign GOAT case.'
    },
    profileStats:{ ufcRecord:'7-7', titleFightWins:1, adjustedTitleWins:1.00, eliteWins:1,  primeDominance:14.80, finishRatePct:42.9, roundsWonPct:48.8, activeEliteYears:6.00, apexPeak:3.35, timesFinishedPrime:1, divisionStrengthContext:'Women’s bantamweight was historically important during Tate’s UFC title climb, but the division depth is not treated as max-strength.', lossContext:'Cat Zingano and Ronda Rousey are pre-prime finished losses. Amanda Nunes is the counted prime title finish loss. Pennington, Vieira, Murphy, and Santos are post-prime/exit/comeback losses with 0 penalty.' },
    compareSeasoning:{
      shortCase:'Tate is the gritty UFC bantamweight champion case: one legendary Holm comeback title win, a real contender climb, and major historical importance around early women’s UFC.',
      peak:'At her best, Tate combined wrestling, toughness, late-fight grappling danger, and title-fight survival into one unforgettable Holm comeback.',
      resume:'Her UFC resume is not deep, but the Holm title win gives her a real champion case. The model rewards that moment without importing Strikeforce value into the score.',
      championship:'One UFC bantamweight title win, no defenses, and two UFC title-fight losses.',
      opponentQuality:'Holm is the anchor. McMann, Carmouche, Eye, Reneau, and Avila are supporting wins rather than elite-win depth.',
      longevity:'Her elite UFC window centers on 2014-2016. The comeback phase adds relevance and activity, not prime-loss damage.',
      counter:'The counterargument is thin UFC-only depth: one title-fight win, no defenses, a 7-7 UFC record, and limited elite wins outside Holm.',
      edge:'Tate wins comparisons when a real undisputed title win and signature championship comeback matter more than clean record volume.',
      eliteCounter:false,
      signatureWins:'Holly Holm, Sara McMann, Liz Carmouche, Jessica Eye, Marion Reneau, Julia Avila.',
      weakness:'No UFC title defenses and limited elite UFC win depth after Holm.',
      titleSummary:'One-time UFC women’s bantamweight champion with one official and adjusted title-fight win.',
      primeSummary:'5-1 prime from Carmouche through Nunes, capped by the Nunes title loss.',
      bestArgument:'The best argument is that beating Holm for the belt is a legitimate top-end UFC championship moment.',
      titleStyle:'Bantamweight Title Comeback', primeStyle:'Gritty Champion Climb',
      legacyStats:{ ufcRecord:'7-7', titleFightWins:1, adjustedTitleWins:1.00, beltsWon:1, titleDefenses:0, activeEliteYearsLabel:'roughly 6 active elite years', primeNote:'Carmouche-through-Nunes bantamweight title/elite window; comeback phase counts as post-prime relevance' }
    },
    fightLedger:{
      'holly holm|miesha tate':{ fighters:['Holly Holm','Miesha Tate'], fights:1, winner:'Miesha Tate', importance:'major', summary:'Tate submitted Holm in the fifth round to win the UFC bantamweight title. This is Tate’s signature UFC-only GOAT argument.' },
      'miesha tate|ronda rousey':{ fighters:['Miesha Tate','Ronda Rousey'], fights:1, winner:'Ronda Rousey', importance:'major', summary:'Rousey submitted Tate in their UFC title fight. The broader Strikeforce rivalry is historically important, but only the UFC fight counts in this ranking.' },
      'amanda nunes|miesha tate':{ fighters:['Amanda Nunes','Miesha Tate'], fights:1, winner:'Amanda Nunes', importance:'major', summary:'Nunes submitted Tate at UFC 200 to take the bantamweight title, ending Tate’s prime championship window.' }
    }
  };

  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function upsert(rows,row){ if(!Array.isArray(rows)||!row?.fighter) return; const index=rows.findIndex(x=>x?.fighter===row.fighter); if(index>=0) rows[index]={...rows[index],...row}; else rows.push(row); }
  function patchData(){ if(!window.RANKING_DATA) return; upsert(window.RANKING_DATA.women, boardRow); upsert(window.RANKING_DATA.fighters, profile); [...(window.RANKING_DATA.women||[]),...(window.RANKING_DATA.fighters||[])].forEach(row=>{ if(row?.fighter!==fighter) return; row.rounds=rounds; row.apexPeakAudit=packet.display.apexPeakSummary; }); if(Array.isArray(window.RANKING_DATA.women)) window.RANKING_DATA.women.sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0)); }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES==='undefined') return; DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})}; DISPLAY_OVERRIDES[fighter].packetProfileStats={...(DISPLAY_OVERRIDES[fighter].packetProfileStats||{}),...(packet.profileStats||{})}; DISPLAY_OVERRIDES[fighter].packetStatus=packet.status||{}; DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations||{}; }
  function applyCompare(){ if(packet.compareSeasoning){ window.COMPARE_PROFILES=window.COMPARE_PROFILES||{}; window.COMPARE_PROFILES[fighter]=mergeCompareProfile(window.COMPARE_PROFILES[fighter],packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES!=='undefined'){ DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{}; DISPLAY_OVERRIDES[fighter].compareProfile=mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile,window.COMPARE_PROFILES[fighter]); } } if(packet.fightLedger){ window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{}; Object.entries(packet.fightLedger).forEach(([key,value])=>{ window.COMPARE_FIGHT_LEDGER[key]={...(window.COMPARE_FIGHT_LEDGER[key]||{}),...value}; }); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{}; window.UFC_FIGHTER_PACKETS[fighter]=packet; const current=window.UFC_FIGHTER_PACKET_SYSTEM||{}; const fighters=Array.from(new Set([...(current.fighters||[]),fighter])); const packetExtensions=Array.from(new Set([...(current.packetExtensions||[]),VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM={...current,version:current.version||VERSION,purpose:current.purpose||'Central source for fighter-facing app content during migration.',fighters,packetExtensions,appliedAt:new Date().toISOString()}; }
  patchData(); applyDisplay(); applyCompare(); registerPacket();
})();
