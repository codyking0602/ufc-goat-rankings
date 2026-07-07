// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Chael Sonnen fighter packet extension.
(function(){
  const VERSION='fighter-packet-chael-sonnen-20260706a';
  const fighter='Chael Sonnen';

  const rounds=[
    {opponent:'Renato Sobral',date:'2005-10-07',method:'Submission loss R2',roundsCounted:2,roundsWon:0,basis:'Early UFC LHW loss to strong opponent',confidence:'Medium',notes:'Early-career loss before his middleweight contender run.'},
    {opponent:'Trevor Prangley',date:'2006-04-06',method:'Decision win',roundsCounted:3,roundsWon:2,basis:'Early UFC support win',confidence:'Medium',notes:'Supporting win.'},
    {opponent:'Jeremy Horn',date:'2006-05-26',method:'Submission loss R2',roundsCounted:2,roundsWon:0,basis:'Early submission loss',confidence:'Medium',notes:'Early-career grappling loss.'},
    {opponent:'Demian Maia',date:'2009-02-21',method:'Submission loss R1',roundsCounted:1,roundsWon:0,basis:'Elite grappler loss, finished',confidence:'High',notes:'Important pre-contender setback.'},
    {opponent:'Dan Miller',date:'2009-05-23',method:'Decision win',roundsCounted:3,roundsWon:3,basis:'Prime-start middleweight win',confidence:'Medium',notes:'Start of the real UFC contender stretch.'},
    {opponent:'Yushin Okami',date:'2009-10-24',method:'Decision win',roundsCounted:3,roundsWon:3,basis:'Strong ranked middleweight win',confidence:'High',notes:'Major contender-run win.'},
    {opponent:'Nate Marquardt',date:'2010-02-06',method:'Decision win',roundsCounted:3,roundsWon:3,basis:'No. 1 contender-making win',confidence:'High',notes:'One of Chael’s best UFC wins.'},
    {opponent:'Anderson Silva I',date:'2010-08-07',method:'Title loss submission R5',roundsCounted:5,roundsWon:4,basis:'Legendary near-upset title loss',confidence:'High',notes:'Not a win, but a major round-control and peak-context performance.'},
    {opponent:'Brian Stann',date:'2011-10-08',method:'Submission win R2',roundsCounted:2,roundsWon:2,basis:'Strong finish over ranked/relevant contender',confidence:'High',notes:'Best finish win of his UFC run.'},
    {opponent:'Michael Bisping',date:'2012-01-28',method:'Decision win',roundsCounted:3,roundsWon:2,basis:'Elite contender win that aged well',confidence:'Medium',notes:'Key contender win before Anderson rematch.'},
    {opponent:'Anderson Silva II',date:'2012-07-07',method:'Title loss TKO R2',roundsCounted:2,roundsWon:1,basis:'Title loss to all-time champion',confidence:'High',notes:'Anderson losses are combined in loss context rather than treated as two separate full crashes.'},
    {opponent:'Jon Jones',date:'2013-04-27',method:'LHW title loss TKO R1',roundsCounted:1,roundsWon:0,basis:'Upward-division title loss to all-time champion',confidence:'High',notes:'Reduced upward-division title-loss context.'},
    {opponent:'Mauricio Rua',date:'2013-08-17',method:'Submission win R1',roundsCounted:1,roundsWon:1,basis:'Late-career LHW name win',confidence:'Medium',notes:'Useful post-middleweight name win, not main prime anchor.'},
    {opponent:'Rashad Evans',date:'2013-11-16',method:'TKO loss R1',roundsCounted:1,roundsWon:0,basis:'Post-prime LHW loss',confidence:'Medium',notes:'Post-prime UFC exit loss.'}
  ];

  const boardRow={
    fighter,totalScore:20.45,championship:0.00,opponentQuality:5.45,primeDominance:17.25,longevity:6.25,apexPeak:3.95,penalty:-7.50,
    leaderboard:'men',gender:'Men',ufcRecord:'6-7',primaryDivision:'Middleweight',secondaryDivision:'Light Heavyweight',finishRatePct:33.3,activeEliteYears:6.25,timesFinishedPrime:4,primeRecord:'5-2 middleweight contender window',roundsWonPct:60.0,
    notes:'Permanent fighter-packet add. Elite middleweight contender and legendary Anderson Silva rival, capped by zero UFC title wins and finished losses in major title spots.'
  };

  const profile={
    id:'CS001',fighter,gender:'Men',primaryDivision:'Middleweight',secondaryDivision:'Light Heavyweight',scope:'UFC',ufcRecord:'6-7',ufcWins:6,ufcLosses:7,scoredUfcFights:13,finishWins:2,finishRatePct:33.3,timesFinishedPrime:4,lossPenalty:-7.50,activeEliteYears:6.25,primeStart:'Dan Miller 2009',primeEnd:'Anderson Silva II 2012',totalScore:20.45,championship:0.00,opponentQuality:5.45,primeDominance:17.25,longevity:6.25,apexPeak:3.95,penalty:-7.50,leaderboard:'men',rounds,
    title:{normalTitleWins:0,adjustedTitleWins:0.00,notes:'Chael fought for the UFC title three times but never won a UFC belt. The Anderson rivalry boosts his peak and contender case, not his Championship Resume.'},
    opponents:[
      {opponent:'Michael Bisping',date:'2012-01-28',division:'Middleweight',context:'Elite contender win that aged into champion-level relevance',credit:0.95,type:'Full'},
      {opponent:'Nate Marquardt',date:'2010-02-06',division:'Middleweight',context:'No. 1 contender-making win',credit:0.90,type:'Full'},
      {opponent:'Yushin Okami',date:'2009-10-24',division:'Middleweight',context:'Strong ranked middleweight win',credit:0.85,type:'Full'},
      {opponent:'Brian Stann',date:'2011-10-08',division:'Middleweight',context:'Strong finish over ranked/relevant contender',credit:0.70,type:'Partial'},
      {opponent:'Mauricio Rua',date:'2013-08-17',division:'Light Heavyweight',context:'Late-career LHW name win',credit:0.65,type:'Partial'},
      {opponent:'Dan Miller',date:'2009-05-23',division:'Middleweight',context:'Solid contender-run win',credit:0.45,type:'Partial'},
      {opponent:'Trevor Prangley',date:'2006-04-06',division:'Middleweight',context:'Early UFC support win',credit:0.25,type:'Partial'},
      {opponent:'Title-fight / contender relevance support',date:'career',division:'UFC',context:'Strong performances and contender standing without title-win credit',credit:0.70,type:'Context support'}
    ],
    notes:'UFC-only elite contender case: strong middleweight run, legendary Anderson rivalry, but no UFC title wins.'
  };

  const packet={
    status:{stage:'complete first-pass packet; revised loss context, quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included',lastUpdated:'2026-07-06',nextFix:'Add real photos after source images are uploaded; audit exact round-control rows next rebuild.'},
    repoLocations:{scoreSource:'assets/data/fighter-packets/chael-sonnen.js',centralPacket:'assets/data/fighter-packets/chael-sonnen.js',watchMoment:'assets/js/watch-moments.js',nickname:'assets/js/card-nicknames.js',tracker:'docs/fighter-status.md',photos:'No real photo files loaded yet; app should use initials fallback.'},
    photos:{},rounds,boardRow,profile,
    display:{
      overallOvr:75,divisionLabel:'MW / LHW',resumeTag:'Middleweight title agitator',
      oneLiner:'A relentless UFC title challenger whose wrestling pressure and Anderson Silva rivalry made him unforgettable, but zero title wins cap the résumé hard.',
      categories:{championship:{ovr:45},opponentQuality:{ovr:71},primeDominance:{ovr:80},longevity:{ovr:69},apexPeak:{ovr:82},penalty:{ovr:65}},
      snapshot:[['UFC Record','6-7'],['UFC Title-Fight Wins','0'],['Apex Peak','+3.95'],['Quality Wins','Bisping, Marquardt, Okami, Stann'],['Prime Window','Dan Miller 2009 → Anderson II 2012'],['Prime Dominance','17.25 / 30'],['Prime Record','5-2 contender window'],['Loss Context','-7.50']],
      whyRankedHere:'Sonnen lands here because his middleweight contender run was real: Okami, Marquardt, Stann, and Bisping gave him one of the strongest no-belt cases in this tier.',
      whyNotHigher:'He does not rank higher because he never won a UFC title, lost all three UFC title fights, and the biggest moments of his UFC career still ended as losses.',
      bigAssumptions:[['Championship ceiling','The Anderson fights are legendary, but they are still title losses, so Chael gets no Championship Resume credit.'],['Anderson rivalry','The first Anderson fight boosts his peak and round-control case without being treated like a win.'],['Loss context','The two Anderson title losses are combined as one major title-rivalry penalty instead of two separate full penalties.'],['Jon Jones fight','The Jones loss is treated as an upward-division title challenge against an all-time champion.'],['Rashad fight','The Rashad loss is treated as a late/post-prime UFC exit fight.']],
      keyJudgmentCalls:[['Almost champion','Chael gets real respect for how close he came, but almost-title moments cannot replace title wins.'],['Round control','The Anderson I performance keeps his Prime Dominance respectable because he controlled most of an all-time champion fight.'],['Quality wins','Bisping, Marquardt, Okami, and Stann are the real résumé anchors.'],['Losses','The loss column is not ignored. Finished title losses are why he stays capped.']],
      apexPeakSummary:{score:3.95,window:'Anderson Silva I near-upset and middleweight contender run',components:{peakStatus:0.95,eliteOpponentProof:0.90,separationDominance:0.90,divisionStrength:0.75,cleanApexAura:0.45},notes:'Near-champion apex: unforgettable pressure and rivalry value, but not a champion peak.'},
      primeDominanceSummary:{score:17.25,components:{primeRecord:4.55,primeRoundsWon:5.15,titleDefenseDominance:0.00,finishStoppageDominance:1.85,lossSafetyDurability:4.00,divisionStrength:1.70},notes:'High round-control contender run, especially in the first Anderson fight, but no belt and no title defense dominance.'},
      finalTakeaway:'Chael is one of the strongest UFC no-belt personality/resume cases: memorable, dangerous, and elite — but clearly below true champion résumés.'
    },
    profileStats:{ufcRecord:'6-7',titleFightWins:0,adjustedTitleWins:0.00,eliteWins:2,primeRecord:'5-2 middleweight contender window',primeDominance:17.25,finishRatePct:33.3,roundsWonPct:60.0,activeEliteYears:6.25,apexPeak:3.95,timesFinishedPrime:4,divisionStrengthContext:'Strong middleweight contender era with Anderson as the champion ceiling.',lossContext:'Anderson I and II are combined as one major title-rivalry penalty; Jones is upward-division title context; Rashad is late/post-prime.'},
    compareSeasoning:{shortCase:'Chael is the elite no-belt agitator case: pressure wrestling, massive Anderson rivalry, and real wins over Bisping, Marquardt, Okami, and Stann.',peak:'At his apex, Chael nearly solved Anderson with pace, wrestling, and pressure before losing late.',resume:'The contender résumé is strong, but it is capped hard by zero UFC title wins.',championship:'No UFC title wins and three UFC title-fight losses.',opponentQuality:'Bisping, Marquardt, Okami, Stann, and Shogun support the case.',longevity:'Good UFC relevance, but the elite window is mostly 2009-2012.',counter:'The counter is simple: the biggest fights ended as losses.',edge:'Chael wins comparisons when contender strength, rivalry impact, and round-control pressure matter more than title hardware.',eliteCounter:false,signatureWins:'Michael Bisping, Nate Marquardt, Yushin Okami, Brian Stann, Mauricio Rua.',weakness:'Zero UFC title wins and finished losses in major title spots.',titleSummary:'Three-time UFC title challenger with no title-fight wins.',primeSummary:'Prime runs from Dan Miller through Anderson Silva II.',bestArgument:'He is one of the most memorable and dangerous no-belt contenders in UFC history.',titleStyle:'Middleweight Title Agitator',primeStyle:'Pressure-Wrestling Near-Champion'},
    fightLedger:{
      'anderson silva|chael sonnen':{fighters:['Anderson Silva','Chael Sonnen'],fights:2,winner:'Anderson Silva',importance:'major',summary:'Chael nearly pulled off the upset in the first fight, but Anderson finished him twice. This rivalry defines Chael’s peak and ceiling.'},
      'chael sonnen|michael bisping':{fighters:['Chael Sonnen','Michael Bisping'],fights:1,winner:'Chael Sonnen',importance:'notable',summary:'Chael edged Bisping in a key middleweight contender fight, one of Chael’s best wins and a useful Bisping loss-context point.'},
      'chael sonnen|jon jones':{fighters:['Chael Sonnen','Jon Jones'],fights:1,winner:'Jon Jones',importance:'major',summary:'Jones stopped Chael in a light heavyweight title fight; this is upward-division title-challenge context for Chael.'},
      'chael sonnen|rashad evans':{fighters:['Chael Sonnen','Rashad Evans'],fights:1,winner:'Rashad Evans',importance:'notable',summary:'Rashad stopped Chael late in Chael’s UFC run, treated as a post-prime/exit result.'}
    }
  };

  function mergeLegacyStats(a,b){return{...(a||{}),...(b||{})};}
  function mergeCompareProfile(a,b){return{...(a||{}),...(b||{}),legacyStats:mergeLegacyStats((a||{}).legacyStats,(b||{}).legacyStats)};}
  function upsert(rows,row){if(!Array.isArray(rows)||!row?.fighter)return;const index=rows.findIndex(x=>x?.fighter===row.fighter);if(index>=0)rows[index]={...rows[index],...row};else rows.push(row);}
  function patchData(){if(!window.RANKING_DATA)return;upsert(window.RANKING_DATA.men,boardRow);upsert(window.RANKING_DATA.fighters,profile);[...(window.RANKING_DATA.men||[]),...(window.RANKING_DATA.fighters||[])].forEach(row=>{if(row?.fighter!==fighter)return;row.rounds=rounds;row.apexPeakAudit=packet.display.apexPeakSummary;});if(Array.isArray(window.RANKING_DATA.men))window.RANKING_DATA.men.sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0));}
  function applyDisplay(){if(typeof DISPLAY_OVERRIDES==='undefined')return;DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})};DISPLAY_OVERRIDES[fighter].packetProfileStats={...(DISPLAY_OVERRIDES[fighter].packetProfileStats||{}),...(packet.profileStats||{})};DISPLAY_OVERRIDES[fighter].packetStatus=packet.status||{};DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations||{};}
  function applyCompare(){if(packet.compareSeasoning){window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};window.COMPARE_PROFILES[fighter]=mergeCompareProfile(window.COMPARE_PROFILES[fighter],packet.compareSeasoning);if(typeof DISPLAY_OVERRIDES!=='undefined'){DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};DISPLAY_OVERRIDES[fighter].compareProfile=mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile,window.COMPARE_PROFILES[fighter]);}}if(packet.fightLedger){window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};Object.entries(packet.fightLedger).forEach(([key,value])=>{window.COMPARE_FIGHT_LEDGER[key]={...(window.COMPARE_FIGHT_LEDGER[key]||{}),...value};});}}
  function registerPacket(){window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{};window.UFC_FIGHTER_PACKETS[fighter]=packet;const current=window.UFC_FIGHTER_PACKET_SYSTEM||{};const fighters=Array.from(new Set([...(current.fighters||[]),fighter]));const packetExtensions=Array.from(new Set([...(current.packetExtensions||[]),VERSION]));window.UFC_FIGHTER_PACKET_SYSTEM={...current,version:current.version||VERSION,purpose:current.purpose||'Central source for fighter-facing app content during migration.',fighters,packetExtensions,appliedAt:new Date().toISOString()};}
  patchData();applyDisplay();applyCompare();registerPacket();
})();