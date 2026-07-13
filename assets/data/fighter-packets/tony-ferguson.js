// Tony Ferguson fighter packet extension.
(function(){
  const VERSION='fighter-packet-tony-ferguson-20260706b';
  const fighter='Tony Ferguson';

  const rounds=[
    {opponent:'Michael Johnson',date:'2012-05-05',method:'Decision loss',roundsCounted:3,roundsWon:1,basis:'Early UFC loss to solid fighter',confidence:'Medium',notes:'Early-career setback.'},
    {opponent:'Mike Rio',date:'2013-10-19',method:'Submission win R1',roundsCounted:1,roundsWon:1,basis:'Supporting finish',confidence:'High',notes:'Support win.'},
    {opponent:'Katsunori Kikuno',date:'2014-05-24',method:'KO win R1',roundsCounted:1,roundsWon:1,basis:'Supporting finish',confidence:'High',notes:'Support win.'},
    {opponent:'Danny Castillo',date:'2014-08-30',method:'Decision win',roundsCounted:3,roundsWon:2,basis:'Supporting lightweight win',confidence:'Medium',notes:'Close support win.'},
    {opponent:'Abel Trujillo',date:'2014-12-06',method:'Submission win R2',roundsCounted:2,roundsWon:1,basis:'Supporting action-era lightweight win',confidence:'Medium',notes:'Support win in streak.'},
    {opponent:'Gleison Tibau',date:'2015-02-28',method:'Submission win R1',roundsCounted:1,roundsWon:1,basis:'Veteran lightweight win',confidence:'High',notes:'Prime stretch begins around the Tibau/Josh Thomson run.'},
    {opponent:'Josh Thomson',date:'2015-07-15',method:'Decision win',roundsCounted:3,roundsWon:3,basis:'Strong veteran contender win',confidence:'Medium',notes:'Important lightweight streak win.'},
    {opponent:'Edson Barboza',date:'2015-12-11',method:'Submission win R2',roundsCounted:2,roundsWon:2,basis:'Elite lightweight win, finish',confidence:'High',notes:'Major prime proof.'},
    {opponent:'Lando Vannata',date:'2016-07-13',method:'Submission win R2',roundsCounted:2,roundsWon:1,basis:'Chaotic short-notice survival/finish',confidence:'Medium',notes:'Useful streak support.'},
    {opponent:'Rafael dos Anjos',date:'2016-11-05',method:'Decision win',roundsCounted:5,roundsWon:4,basis:'Elite former champion five-round win',confidence:'Medium',notes:'Best non-title quality win.'},
    {opponent:'Kevin Lee',date:'2017-10-07',method:'Interim title win submission R3',roundsCounted:3,roundsWon:2,basis:'UFC interim lightweight title win',confidence:'High',notes:'Real interim-title achievement.'},
    {opponent:'Anthony Pettis',date:'2018-10-06',method:'TKO/corner stoppage win R2',roundsCounted:2,roundsWon:2,basis:'Former champion action win',confidence:'High',notes:'High-value prime win.'},
    {opponent:'Donald Cerrone',date:'2019-06-08',method:'TKO/doctor stoppage win R2',roundsCounted:2,roundsWon:2,basis:'Strong name/ranked lightweight win',confidence:'High',notes:'Timing-discounted but valuable.'},
    {opponent:'Justin Gaethje',date:'2020-05-09',method:'Interim title loss TKO R5',roundsCounted:5,roundsWon:1,basis:'Prime-ending title-level loss, finished',confidence:'High',notes:'This is the title-level fight that ends Tony’s prime stretch.'},
    {opponent:'Charles Oliveira',date:'2020-12-12',method:'Decision loss',roundsCounted:3,roundsWon:0,basis:'Post-prime elite loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Beneil Dariush',date:'2021-05-15',method:'Decision loss',roundsCounted:3,roundsWon:0,basis:'Post-prime contender loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Michael Chandler',date:'2022-05-07',method:'KO loss R2',roundsCounted:2,roundsWon:1,basis:'Post-prime finished loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Nate Diaz',date:'2022-09-10',method:'Submission loss R4',roundsCounted:4,roundsWon:1,basis:'Post-prime short-notice/exit loss',confidence:'Medium',notes:'Decline-stage result.'},
    {opponent:'Bobby Green',date:'2023-07-29',method:'Submission loss R3',roundsCounted:3,roundsWon:0,basis:'Post-prime loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Paddy Pimblett',date:'2023-12-16',method:'Decision loss',roundsCounted:3,roundsWon:0,basis:'Post-prime loss',confidence:'Medium',notes:'Decline-stage result.'},
    {opponent:'Michael Chiesa',date:'2024-08-03',method:'Submission loss R1',roundsCounted:1,roundsWon:0,basis:'Post-prime loss',confidence:'High',notes:'Decline-stage result.'}
  ];

  const boardRow={
    fighter,totalScore:33.81,championship:1.75,opponentQuality:10.15,primeDominance:20.85,longevity:8.85,apexPeak:4.85,penalty:-6.51,
    leaderboard:'men',gender:'Men',ufcRecord:'15-9',primaryDivision:'Lightweight',secondaryDivision:'Welterweight',finishRatePct:66.7,activeEliteYears:8.85,timesFinishedPrime:1,roundsWonPct:58.5,
    notes:'Permanent fighter-packet add. Interim UFC lightweight champion and 12-fight-streak terror; prime runs through the Gaethje title-level loss, while Oliveira and later losses are decline-stage results.'
  };

  const profile={
    id:'TF001',fighter,gender:'Men',primaryDivision:'Lightweight',secondaryDivision:'Welterweight',scope:'UFC',ufcRecord:'15-9',ufcWins:15,ufcLosses:9,scoredUfcFights:24,finishWins:10,finishRatePct:66.7,timesFinishedPrime:1,lossPenalty:-6.51,activeEliteYears:8.85,primeStart:'Gleison Tibau / Josh Thomson 2015',primeEnd:'Justin Gaethje 2020 title-level loss',totalScore:33.81,championship:1.75,opponentQuality:10.15,primeDominance:20.85,longevity:8.85,apexPeak:4.85,penalty:-6.51,leaderboard:'men',rounds,
    title:{normalTitleWins:0,interimTitleWins:1,adjustedTitleWins:0.75,notes:'Tony won the interim UFC lightweight title against Kevin Lee. He never captured the undisputed UFC lightweight title.'},
    opponents:[
      {opponent:'Rafael dos Anjos',date:'2016-11-05',division:'Lightweight',context:'Former UFC lightweight champion, elite five-round win',credit:1.05,type:'Elite former champ'},
      {opponent:'Edson Barboza',date:'2015-12-11',division:'Lightweight',context:'Elite lightweight win, finish, violent prime proof',credit:0.95,type:'Full'},
      {opponent:'Kevin Lee',date:'2017-10-07',division:'Lightweight',context:'Interim title win over top contender',credit:0.85,type:'Partial'},
      {opponent:'Donald Cerrone',date:'2019-06-08',division:'Lightweight',context:'Strong name/ranked win, timing-discounted',credit:0.75,type:'Partial'},
      {opponent:'Anthony Pettis',date:'2018-10-06',division:'Lightweight',context:'Former champion, wild high-value win',credit:0.75,type:'Partial'},
      {opponent:'Josh Thomson',date:'2015-07-15',division:'Lightweight',context:'Strong veteran contender win',credit:0.65,type:'Partial'},
      {opponent:'Gleison Tibau',date:'2015-02-28',division:'Lightweight',context:'Durable lightweight veteran win',credit:0.55,type:'Partial'},
      {opponent:'Abel Trujillo',date:'2014-12-06',division:'Lightweight',context:'Supporting action-era lightweight win',credit:0.45,type:'Partial'},
      {opponent:'Lando Vannata',date:'2016-07-13',division:'Lightweight',context:'Chaotic short-notice fight, survival/finish value',credit:0.45,type:'Partial'},
      {opponent:'Katsunori Kikuno',date:'2014-05-24',division:'Lightweight',context:'Supporting finish',credit:0.30,type:'Partial'},
      {opponent:'Danny Castillo',date:'2014-08-30',division:'Lightweight',context:'Supporting win',credit:0.30,type:'Partial'},
      {opponent:'Mike Rio',date:'2013-10-19',division:'Lightweight',context:'Supporting finish',credit:0.20,type:'Partial'},
      {opponent:'Brock Jardine / Aaron Riley / Ramsey Nijem',date:'career',division:'UFC',context:'Early UFC volume support',credit:0.95,type:'Combined support'}
    ],
    notes:'UFC-only uncrowned lightweight case: elite prime dominance and lightweight strength, but no undisputed UFC title or defenses.'
  };

  const packet={
    status:{stage:'complete first-pass packet; prime runs through Gaethje, interim-title logic, quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included',lastUpdated:'2026-07-06',nextFix:'Add real photos after source images are uploaded; audit exact round-control rows next rebuild.'},
    repoLocations:{scoreSource:'assets/data/fighter-packets/tony-ferguson.js',centralPacket:'assets/data/fighter-packets/tony-ferguson.js',watchMoment:'assets/js/watch-moments.js',nickname:'assets/js/card-nicknames.js',tracker:'docs/fighter-status.md',photos:'No real photo files loaded yet; app should use initials fallback.'},
    photos:{},rounds,boardRow,profile,
    display:{
      divisionLabel:'LW / WW',resumeTag:'Uncrowned lightweight terror',
      oneLiner:'A 12-fight-streak lightweight nightmare with interim-title value and elite prime dominance, capped by no undisputed belt and a brutal late-career collapse.',
      snapshot:[['UFC Record','15-9'],['UFC Title-Fight Wins','1 interim title win'],['Apex Peak','+4.85'],['Quality Wins','RDA, Barboza, Lee, Pettis'],['Prime Window','Tibau/Thomson 2015 → Gaethje 2020'],['Prime Dominance','20.85 / 30'],['Loss Context','-6.51']],
      whyRankedHere:'Ferguson lands here because the 12-fight UFC win streak, interim title, and brutal lightweight schedule make his prime impossible to ignore.',
      whyNotHigher:'He does not rank higher because he never won the undisputed UFC lightweight title, never defended a UFC belt, and the Gaethje fight ended his run toward the top of the division.',
      bigAssumptions:[['Interim title','Tony gets real credit for beating Kevin Lee for the interim belt, but it is not treated the same as winning the undisputed championship.'],['Prime window','His prime runs through the Justin Gaethje fight because that was the title-level moment where the streak finally broke.'],['Late-career skid','The Oliveira fight and everything after are treated as decline-stage results, so the late skid does not erase the 12-fight-streak version of Tony.'],['Lightweight era','The strength of the lightweight division gives extra weight to the RDA, Barboza, Lee, Pettis, and Cerrone run.']],
      keyJudgmentCalls:[['Title ceiling','The interim belt matters, but the missing undisputed title keeps his championship résumé capped.'],['Gaethje fight','The Gaethje loss counts because it happened at the end of Tony’s real title push.'],['Late skid','The losing streak hurts the story, but it is not treated like peak Tony losing eight straight.'],['Peak danger','At his best, Tony’s pace, elbows, scrambles, cardio, and submission threat made him one of lightweight’s scariest matchups.']],
      apexPeakSummary:{score:4.85,window:'12-fight streak through interim title / Gaethje fight',components:{peakStatus:1.20,eliteOpponentProof:1.05,separationDominance:1.05,divisionStrength:1.00,cleanApexAura:0.55},notes:'Tony was not undisputed champion, but his peak lightweight danger, pace, durability, and streak created real uncrowned-champ aura.'},
      primeDominanceSummary:{score:20.85,components:{primeRecord:6.10,primeRoundsWon:4.35,titleDefenseDominance:0.75,finishStoppageDominance:4.50,lossSafetyDurability:3.55,divisionStrength:1.60},notes:'Prime runs through Gaethje, so the title-level loss is included, but the core streak still grades as elite.'},
      finalTakeaway:'Tony is the classic uncrowned-champion case: terrifying prime, elite lightweight streak, real interim-title value, but thin official championship hardware.'
    },
    profileStats:{ufcRecord:'15-9',titleFightWins:1,adjustedTitleWins:0.75,eliteWins:3,primeDominance:20.85,finishRatePct:66.7,roundsWonPct:58.5,activeEliteYears:8.85,apexPeak:4.85,timesFinishedPrime:1,divisionStrengthContext:'Lightweight murderers’ row gives Tony’s streak and top wins extra weight.',lossContext:'Gaethje is the counted prime/title-level collapse point. Oliveira and later losses are decline-stage results.'},
    compareSeasoning:{shortCase:'Tony is the uncrowned lightweight terror case: 12-fight UFC win streak, interim title, elite lightweight wins, and a prime that felt like chaos no one wanted.',peak:'At his apex, Tony was pace, elbows, scrambles, cardio, submissions, cuts, and impossible momentum.',resume:'The résumé is great by lightweight contender standards but thin by title-reign standards.',championship:'One interim UFC lightweight title win and no undisputed title wins.',opponentQuality:'RDA, Barboza, Lee, Pettis, Cerrone, Thomson, and Tibau carry the quality ledger.',longevity:'Long relevant UFC run, but late losses do not inflate elite longevity.',counter:'The counter is official hardware: no undisputed title, no defenses, and Gaethje broke the title case.',edge:'Tony wins comparisons when prime danger, streak value, and lightweight division strength matter more than official title volume.',eliteCounter:false,signatureWins:'Rafael dos Anjos, Edson Barboza, Kevin Lee, Anthony Pettis, Donald Cerrone, Josh Thomson, Gleison Tibau.',weakness:'No undisputed UFC title and a brutal post-prime skid.',titleSummary:'Interim UFC lightweight champion; no undisputed UFC title wins.',primeSummary:'Prime runs from Tibau/Josh Thomson through the Gaethje title-level loss.',bestArgument:'Few non-undisputed champions ever felt more champion-level during their best UFC stretch.',titleStyle:'Uncrowned Lightweight Terror',primeStyle:'12-Fight-Streak Chaos Prime'},
    fightLedger:{
      'justin gaethje|tony ferguson':{fighters:['Justin Gaethje','Tony Ferguson'],fights:1,winner:'Justin Gaethje',importance:'major',summary:'Gaethje stopped Tony in the interim/title-level fight that ended Tony’s prime title case.'},
      'charles oliveira|tony ferguson':{fighters:['Charles Oliveira','Tony Ferguson'],fights:1,winner:'Charles Oliveira',importance:'notable',summary:'Oliveira dominated post-prime Tony, a major Charles proof point but not peak-Tony scoring.'},
      'michael chandler|tony ferguson':{fighters:['Michael Chandler','Tony Ferguson'],fights:1,winner:'Michael Chandler',importance:'notable',summary:'Chandler’s front-kick KO came during Tony’s late-career skid.'},
      'nate diaz|tony ferguson':{fighters:['Nate Diaz','Tony Ferguson'],fights:1,winner:'Nate Diaz',importance:'notable',summary:'Diaz submitted Tony in a short-notice late-career fight; useful rivalry/name context but not peak Tony scoring.'}
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