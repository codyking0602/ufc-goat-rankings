// Michael Bisping fighter packet extension.
(function(){
  const VERSION='fighter-packet-michael-bisping-20260706a';
  const fighter='Michael Bisping';

  const rounds=[
    {opponent:'Rashad Evans',date:'2007-11-17',method:'Decision loss',roundsCounted:3,roundsWon:1,basis:'Pre-prime elite LHW loss',confidence:'Medium',notes:'Pre-prime elite/champ-level LHW loss.'},
    {opponent:'Chris Leben',date:'2008-10-18',method:'Decision win',roundsCounted:3,roundsWon:3,basis:'Supporting UFC name win',confidence:'Medium',notes:'Early middleweight support win.'},
    {opponent:'Dan Henderson I',date:'2009-07-11',method:'KO loss R2',roundsCounted:2,roundsWon:0,basis:'Near-prime elite loss, finished',confidence:'High',notes:'Counted finish-loss damage but treated before full title prime.'},
    {opponent:'Yoshihiro Akiyama',date:'2010-10-16',method:'Decision win',roundsCounted:3,roundsWon:3,basis:'Good name support win',confidence:'Medium',notes:'Useful contender-era win.'},
    {opponent:'Jason Miller',date:'2011-12-03',method:'TKO win R3',roundsCounted:3,roundsWon:3,basis:'Main-event finish',confidence:'Medium',notes:'Supporting main-event finish.'},
    {opponent:'Chael Sonnen',date:'2012-01-28',method:'Decision loss',roundsCounted:3,roundsWon:1,basis:'Prime-edge elite contender loss',confidence:'Medium',notes:'Counted contender loss; competitive.'},
    {opponent:'Brian Stann',date:'2012-09-22',method:'Decision win',roundsCounted:3,roundsWon:2,basis:'Prime-start ranked/relevant middleweight win',confidence:'Medium',notes:'Prime window starts here.'},
    {opponent:'Vitor Belfort',date:'2013-01-19',method:'TKO loss R2',roundsCounted:2,roundsWon:0,basis:'Prime elite contender loss, finished',confidence:'High',notes:'Counted finish-loss damage.'},
    {opponent:'Alan Belcher',date:'2013-04-27',method:'Technical decision win',roundsCounted:3,roundsWon:2,basis:'Solid divisional win',confidence:'Medium',notes:'Useful middleweight win.'},
    {opponent:'Tim Kennedy',date:'2014-04-16',method:'Decision loss',roundsCounted:5,roundsWon:2,basis:'Prime contender loss',confidence:'Medium',notes:'Counted prime contender loss.'},
    {opponent:'Cung Le',date:'2014-08-23',method:'TKO win R4',roundsCounted:4,roundsWon:3,basis:'Strong name/relevant contender win',confidence:'Medium',notes:'Useful finish win.'},
    {opponent:'Luke Rockhold I',date:'2014-11-08',method:'Submission loss R2',roundsCounted:2,roundsWon:0,basis:'Prime elite contender loss, finished',confidence:'High',notes:'Counted finish-loss damage.'},
    {opponent:'Thales Leites',date:'2015-07-18',method:'Decision win',roundsCounted:5,roundsWon:3,basis:'Good contender win',confidence:'Medium',notes:'Five-round contender win.'},
    {opponent:'Anderson Silva',date:'2016-02-27',method:'Decision win',roundsCounted:5,roundsWon:3,basis:'Former champion/GOAT-tier name win',confidence:'Medium',notes:'Huge name win, timing-discounted but still major.'},
    {opponent:'Luke Rockhold II',date:'2016-06-04',method:'Title win KO R1',roundsCounted:1,roundsWon:1,basis:'UFC middleweight title win over reigning champion',confidence:'High',notes:'Rare 1.25 Quality Win title-winning champion exception.'},
    {opponent:'Dan Henderson II',date:'2016-10-08',method:'Title defense decision',roundsCounted:5,roundsWon:3,basis:'Discounted title defense',confidence:'Medium',notes:'0.75 adjusted title credit; old/non-top-contender challenger and dangerous fight.'},
    {opponent:'Georges St-Pierre',date:'2017-11-04',method:'Title loss submission R3',roundsCounted:3,roundsWon:1,basis:'Prime/title-reign loss, finished',confidence:'High',notes:'Prime must run through this title fight; counted finish-loss damage.'},
    {opponent:'Kelvin Gastelum',date:'2017-11-25',method:'KO loss R1',roundsCounted:1,roundsWon:0,basis:'Post-prime short-turnaround exit loss',confidence:'High',notes:'Post-prime/short-turnaround; no full loss-context charge.'}
  ];

  const boardRow={
    fighter,totalScore:34.34,championship:10.25,opponentQuality:7.60,primeDominance:16.40,longevity:10.30,apexPeak:3.35,penalty:-9.10,
    leaderboard:'men',gender:'Men',ufcRecord:'20-9',primaryDivision:'Middleweight',secondaryDivision:'Light Heavyweight',finishRatePct:55.0,activeEliteYears:10.30,timesFinishedPrime:4,primeRecord:'title prime through GSP',roundsWonPct:55.5,
    notes:'Permanent fighter-packet add. Former UFC middleweight champion with the Rockhold title upset, Henderson defense, Anderson win, huge UFC volume, and GSP counted as a prime title loss.'
  };

  const profile={
    id:'MB001',fighter,gender:'Men',primaryDivision:'Middleweight',secondaryDivision:'Light Heavyweight',scope:'UFC',ufcRecord:'20-9',ufcWins:20,ufcLosses:9,scoredUfcFights:29,finishWins:11,finishRatePct:55.0,timesFinishedPrime:4,lossPenalty:-9.10,activeEliteYears:10.30,primeStart:'Brian Stann 2012',primeEnd:'Georges St-Pierre 2017 title loss',totalScore:34.34,championship:10.25,opponentQuality:7.60,primeDominance:16.40,longevity:10.30,apexPeak:3.35,penalty:-9.10,leaderboard:'men',rounds,
    title:{normalTitleWins:2,adjustedTitleWins:1.75,notes:'UFC title-fight wins = 2. Luke Rockhold title win = 1.00. Dan Henderson defense = 0.75 because Henderson was old/non-top-contender and Bisping was nearly finished. GSP title loss adds no Championship credit.'},
    opponents:[
      {opponent:'Luke Rockhold II',date:'2016-06-04',division:'Middleweight',context:'Won UFC middleweight title from reigning champion on short notice',credit:1.25,type:'Rare title-win exception'},
      {opponent:'Anderson Silva',date:'2016-02-27',division:'Middleweight',context:'Former GOAT-tier champion name win, timing-discounted but major',credit:1.00,type:'Full'},
      {opponent:'Dan Henderson II',date:'2016-10-08',division:'Middleweight',context:'Official title defense and rivalry revenge, age-discounted',credit:0.80,type:'Partial'},
      {opponent:'Cung Le',date:'2014-08-23',division:'Middleweight',context:'Strong name/relevant contender finish',credit:0.65,type:'Partial'},
      {opponent:'Brian Stann',date:'2012-09-22',division:'Middleweight',context:'Solid ranked/relevant middleweight win',credit:0.60,type:'Partial'},
      {opponent:'Thales Leites',date:'2015-07-18',division:'Middleweight',context:'Good five-round contender win',credit:0.55,type:'Partial'},
      {opponent:'Alan Belcher',date:'2013-04-27',division:'Middleweight',context:'Solid divisional win',credit:0.45,type:'Partial'},
      {opponent:'Yoshihiro Akiyama',date:'2010-10-16',division:'Middleweight',context:'Good name support win',credit:0.40,type:'Partial'},
      {opponent:'Jason Miller',date:'2011-12-03',division:'Middleweight',context:'Supporting main-event win',credit:0.30,type:'Partial'},
      {opponent:'Denis Kang',date:'2009-11-14',division:'Middleweight',context:'Supporting win',credit:0.25,type:'Partial'},
      {opponent:'Chris Leben',date:'2008-10-18',division:'Middleweight',context:'Supporting UFC name win',credit:0.25,type:'Partial'},
      {opponent:'Matt Hamill',date:'2007-09-08',division:'Light Heavyweight',context:'Early support win, controversial-ish',credit:0.20,type:'Partial'},
      {opponent:'Elvis Sinosic / Josh Haynes / misc. support',date:'career',division:'UFC',context:'Volume support only',credit:0.90,type:'Combined support'}
    ],
    notes:'UFC-only middleweight champion case: massive longevity and storybook title peak, but GSP is counted as a prime title loss and the reign was not dominant.'
  };

  const packet={
    status:{stage:'complete first-pass packet; adjusted apex, GSP counted in prime, title/quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included',lastUpdated:'2026-07-06',nextFix:'Add real photos after source images are uploaded; audit exact round-control rows next rebuild.'},
    repoLocations:{scoreSource:'assets/data/fighter-packets/michael-bisping.js',centralPacket:'assets/data/fighter-packets/michael-bisping.js',watchMoment:'assets/js/watch-moments.js',nickname:'assets/js/card-nicknames.js',tracker:'docs/fighter-status.md',photos:'No real photo files loaded yet; app should use initials fallback.'},
    photos:{},rounds,boardRow,profile,
    display:{
      overallOvr:82,divisionLabel:'MW / LHW',resumeTag:'Middleweight title shocker',
      oneLiner:'A grit-and-volume UFC legend whose Rockhold upset and long middleweight résumé make him a real champion case, even without a dominant reign.',
      categories:{championship:{ovr:78},opponentQuality:{ovr:76},primeDominance:{ovr:79},longevity:{ovr:85},apexPeak:{ovr:80},penalty:{ovr:61}},
      snapshot:[['UFC Record','20-9'],['UFC Title-Fight Wins','2 official / 1.75 adjusted'],['Apex Peak','+3.35'],['Quality Wins','Rockhold, Anderson, Hendo, Stann'],['Prime Window','Stann 2012 → GSP 2017'],['Prime Dominance','16.40 / 30'],['Rounds Won','55.5% best-effort'],['Loss Context','-9.10']],
      whyRankedHere:'Bisping scores as a real UFC champion case because he beat Rockhold for the belt, defended once, beat Anderson, and stacked one of the longest relevant middleweight runs in UFC history.',
      whyNotHigher:'He does not rank higher because the reign was short, the Henderson defense is discounted, he did not clear the Yoel/Jacare/Whittaker contender line, and the GSP title loss counts as a prime finish loss.',
      bigAssumptions:[['Adjusted title wins','Rockhold = 1.00; Henderson defense = 0.75; GSP loss = 0.00.'],['Apex Peak','Peak status 0.50, separation 0.60, aura 0.25 per approved adjustment.'],['Prime window','Prime/title window runs from Brian Stann through the GSP title fight.'],['Gastelum loss','Post-prime short-turnaround exit loss, not fully charged.'],['Nickname','Profile-card display should show Michael “The Count” Bisping only after opening the profile.'],['Photos','No photo paths until real files exist in assets/fighters/.']],
      keyJudgmentCalls:[['Rockhold upset','Huge title win, but not enough to imply he was clearly best middleweight alive.'],['GSP treatment','Because it was a literal title fight, it stays inside prime and gets counted.'],['Henderson defense','Official defense, but discounted because of challenger context and fight difficulty.'],['Longevity','His best category is UFC middleweight volume and relevance.']],
      apexPeakSummary:{score:3.35,window:'Rockhold title upset and short title reign',components:{peakStatus:0.50,eliteOpponentProof:1.10,separationDominance:0.60,divisionStrength:0.90,cleanApexAura:0.25},notes:'The Rockhold KO is legendary, but Bisping was not a dominant apex champion or clearly the best middleweight alive.'},
      primeDominanceSummary:{score:16.40,components:{primeRecord:4.30,primeRoundsWon:4.25,titleDefenseDominance:1.30,finishStoppageDominance:2.25,lossSafetyDurability:2.50,divisionStrength:1.80},notes:'Prime now runs through the GSP title loss, which lowers the dominance and durability profile.'},
      finalTakeaway:'Bisping is a necessary UFC-only add: huge volume, one legendary title moment, and real champion status, but not a dominant-reign GOAT case.'
    },
    profileStats:{ufcRecord:'20-9',titleFightWins:2,adjustedTitleWins:1.75,eliteWins:2,primeRecord:'Stann 2012 through GSP 2017 title reign',primeDominance:16.40,finishRatePct:55.0,roundsWonPct:55.5,activeEliteYears:10.30,apexPeak:3.35,timesFinishedPrime:4,divisionStrengthContext:'Middleweight was a strong division, but Bisping’s title path was unusual and not a dominant reign.',lossContext:'GSP is counted as a prime title loss because Bisping was defending champion. Gastelum is treated as post-prime/short-turnaround exit context.'},
    compareSeasoning:{shortCase:'Bisping is the grit-and-volume middleweight champion case: 20 UFC wins, Rockhold title upset, Anderson win, and one defense.',peak:'At his apex, Bisping authored a legendary short-notice title knockout, but the model does not treat him as a dominant best-alive champion.',resume:'The résumé is long and real, with a storybook title peak. The cap is that the reign was short and the elite losses stack up.',championship:'One UFC middleweight title win, one discounted defense, and a GSP title loss.',opponentQuality:'Rockhold and Anderson are the anchors; Henderson, Stann, Leites, Cung Le, and Belcher support.',longevity:'Bisping’s best argument is long UFC middleweight relevance and volume.',counter:'The counter is that he was never a dominant champion and did not clear the strongest post-title contender line.',edge:'Bisping wins comparisons when UFC volume, title-upset value, and historical middleweight relevance matter more than clean dominance.',eliteCounter:false,signatureWins:'Luke Rockhold, Anderson Silva, Dan Henderson, Brian Stann, Thales Leites, Cung Le, Alan Belcher.',weakness:'Short reign, discounted defense, and several prime/elite losses.',titleSummary:'UFC middleweight champion with 2 official title-fight wins and 1.75 adjusted title wins.',primeSummary:'Prime runs from Brian Stann through the GSP title loss.',bestArgument:'He turned a long contender career into one of the most memorable title wins in UFC history.',titleStyle:'Middleweight Title Shocker',primeStyle:'Grit-and-Volume Contender King'},
    fightLedger:{
      'luke rockhold|michael bisping':{fighters:['Luke Rockhold','Michael Bisping'],fights:2,winner:'Split 1-1, Bisping title-result edge',importance:'major',summary:'Rockhold submitted Bisping first, then Bisping knocked him out on short notice to win the UFC middleweight title. This rivalry defines Bisping’s championship ceiling.'},
      'georges st-pierre|michael bisping':{fighters:['Georges St-Pierre','Michael Bisping'],fights:1,winner:'Georges St-Pierre',importance:'major',summary:'GSP submitted Bisping to win the middleweight title. In this model, it counts as a prime title loss for Bisping because he was defending champion.'},
      'dan henderson|michael bisping':{fighters:['Dan Henderson','Michael Bisping'],fights:2,winner:'Split 1-1, Bisping UFC title-defense edge',importance:'major',summary:'Henderson scored the iconic KO first; Bisping later defended the middleweight title against him in a close, discounted defense.'},
      'anderson silva|michael bisping':{fighters:['Anderson Silva','Michael Bisping'],fights:1,winner:'Michael Bisping',importance:'notable',summary:'Bisping beat Anderson in a five-round fight, one of the biggest name wins of his UFC résumé.'}
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