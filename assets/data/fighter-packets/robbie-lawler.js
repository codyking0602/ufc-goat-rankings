// Robbie Lawler fighter packet extension.
(function(){
  const VERSION='fighter-packet-robbie-lawler-20260706a';
  const fighter='Robbie Lawler';

  const rounds=[
    {opponent:'Aaron Riley',date:'2002-05-10',method:'Decision win',roundsCounted:3,roundsWon:2,basis:'Early UFC action win',confidence:'Medium',notes:'Early UFC support win.'},
    {opponent:'Steve Berger',date:'2002-09-27',method:'TKO win R2',roundsCounted:2,roundsWon:2,basis:'Early UFC finish',confidence:'Medium',notes:'Early UFC support finish.'},
    {opponent:'Tiki Ghosn',date:'2002-11-22',method:'KO win R1',roundsCounted:1,roundsWon:1,basis:'Early UFC finish',confidence:'Medium',notes:'Early UFC support finish.'},
    {opponent:'Pete Spratt',date:'2003-04-25',method:'TKO loss R2',roundsCounted:2,roundsWon:0,basis:'Early UFC finished loss',confidence:'Medium',notes:'Early loss before championship-era Lawler.'},
    {opponent:'Chris Lytle',date:'2003-11-21',method:'Decision win',roundsCounted:3,roundsWon:2,basis:'Early UFC veteran win',confidence:'Medium',notes:'Early support win.'},
    {opponent:'Nick Diaz I',date:'2004-04-02',method:'KO loss R2',roundsCounted:2,roundsWon:1,basis:'Early UFC loss, finished',confidence:'High',notes:'Famous early loss before his comeback title run.'},
    {opponent:'Evan Tanner',date:'2004-10-22',method:'Submission loss R1',roundsCounted:1,roundsWon:0,basis:'Early middleweight loss, finished',confidence:'Medium',notes:'Early UFC loss outside his later welterweight prime.'},
    {opponent:'Josh Koscheck',date:'2013-02-23',method:'TKO win R1',roundsCounted:1,roundsWon:1,basis:'Comeback KO over known welterweight name',confidence:'High',notes:'Prime comeback run begins here.'},
    {opponent:'Bobby Voelker',date:'2013-07-27',method:'KO win R2',roundsCounted:2,roundsWon:2,basis:'Comeback support KO',confidence:'High',notes:'Supporting comeback finish.'},
    {opponent:'Rory MacDonald I',date:'2013-11-16',method:'Decision win',roundsCounted:3,roundsWon:2,basis:'Strong contender win before title run',confidence:'Medium',notes:'Key comeback contender win.'},
    {opponent:'Johny Hendricks I',date:'2014-03-15',method:'Vacant title loss decision',roundsCounted:5,roundsWon:2,basis:'Prime title loss to elite welterweight',confidence:'Medium',notes:'Close vacant-title loss.'},
    {opponent:'Jake Ellenberger',date:'2014-05-24',method:'TKO win R3',roundsCounted:3,roundsWon:2,basis:'Ranked/supporting contender win',confidence:'Medium',notes:'Useful contender win.'},
    {opponent:'Matt Brown',date:'2014-07-26',method:'Decision win',roundsCounted:5,roundsWon:4,basis:'Five-round contender win',confidence:'Medium',notes:'Title-shot eliminator type win.'},
    {opponent:'Johny Hendricks II',date:'2014-12-06',method:'UFC title win split decision',roundsCounted:5,roundsWon:3,basis:'Won UFC welterweight title',confidence:'Medium',notes:'Real title win, but close split decision.'},
    {opponent:'Rory MacDonald II',date:'2015-07-11',method:'Title defense TKO R5',roundsCounted:5,roundsWon:3,basis:'Legendary elite title defense finish',confidence:'High',notes:'Signature title-defense win.'},
    {opponent:'Carlos Condit',date:'2016-01-02',method:'Title defense split decision',roundsCounted:5,roundsWon:2,basis:'Official title defense over elite contender',confidence:'Low',notes:'Razor-close/controversial defense, discounted.'},
    {opponent:'Tyron Woodley',date:'2016-07-30',method:'Title loss KO R1',roundsCounted:1,roundsWon:0,basis:'Prime/title loss to elite champ, finished',confidence:'High',notes:'Woodley ended the reign violently.'},
    {opponent:'Donald Cerrone',date:'2017-07-29',method:'Decision win',roundsCounted:3,roundsWon:2,basis:'Post-title name win',confidence:'Medium',notes:'Useful post-title support win.'},
    {opponent:'Rafael dos Anjos',date:'2017-12-16',method:'Decision loss',roundsCounted:5,roundsWon:0,basis:'Post-title decline loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Ben Askren',date:'2019-03-02',method:'Technical submission loss R1',roundsCounted:1,roundsWon:0,basis:'Weird post-title stoppage/submission context',confidence:'Medium',notes:'Weird finish, not treated like prime title-run damage.'},
    {opponent:'Colby Covington',date:'2019-08-03',method:'Decision loss',roundsCounted:5,roundsWon:0,basis:'Post-prime elite loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Neil Magny',date:'2020-08-29',method:'Decision loss',roundsCounted:3,roundsWon:0,basis:'Post-prime loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Nick Diaz II',date:'2021-09-25',method:'TKO win R3',roundsCounted:3,roundsWon:2,basis:'Late-career name win',confidence:'Medium',notes:'Name value, heavily timing-discounted.'},
    {opponent:'Bryan Barberena',date:'2022-07-02',method:'TKO loss R2',roundsCounted:2,roundsWon:1,basis:'Post-prime loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Santiago Ponzinibbio',date:'2022-12-10',method:'TKO loss R3',roundsCounted:3,roundsWon:1,basis:'Post-prime loss',confidence:'High',notes:'Decline-stage result.'},
    {opponent:'Niko Price',date:'2023-07-08',method:'KO win R1',roundsCounted:1,roundsWon:1,basis:'Retirement-fight KO',confidence:'High',notes:'Fun support finish, not prime value.'}
  ];

  const boardRow={
    fighter,totalScore:32.40,championship:9.75,opponentQuality:7.15,primeDominance:15.95,longevity:7.80,apexPeak:4.00,penalty:-8.62,
    leaderboard:'men',gender:'Men',ufcRecord:'14-10, 1 NC',primaryDivision:'Welterweight',secondaryDivision:'Middleweight',finishRatePct:57.1,activeEliteYears:7.80,timesFinishedPrime:1,roundsWonPct:54.0,
    notes:'Permanent fighter-packet add. UFC welterweight champion with two title defenses and an all-time comeback title run, capped by close decisions and a short reign.'
  };

  const profile={
    id:'RL001',fighter,gender:'Men',primaryDivision:'Welterweight',secondaryDivision:'Middleweight',scope:'UFC',ufcRecord:'14-10, 1 NC',ufcWins:14,ufcLosses:10,scoredUfcFights:24,finishWins:8,finishRatePct:57.1,timesFinishedPrime:1,lossPenalty:-8.62,activeEliteYears:7.80,primeStart:'Josh Koscheck 2013',primeEnd:'Tyron Woodley 2016 title loss',totalScore:32.40,championship:9.75,opponentQuality:7.15,primeDominance:15.95,longevity:7.80,apexPeak:4.00,penalty:-8.62,leaderboard:'men',rounds,
    title:{normalTitleWins:3,adjustedTitleWins:2.55,notes:'Lawler won the UFC welterweight title from Johny Hendricks, defended against Rory MacDonald, and defended against Carlos Condit. The Hendricks and Condit fights count, but the razor-close nature keeps the reign from grading like a clean title run.'},
    opponents:[
      {opponent:'Rory MacDonald II',date:'2015-07-11',division:'Welterweight',context:'Elite title defense, finish, all-time fight',credit:1.10,type:'Elite title defense'},
      {opponent:'Johny Hendricks II',date:'2014-12-06',division:'Welterweight',context:'Won UFC title from elite welterweight, close decision',credit:0.95,type:'Full'},
      {opponent:'Carlos Condit',date:'2016-01-02',division:'Welterweight',context:'Official title defense over elite contender, controversy-discounted',credit:0.80,type:'Partial'},
      {opponent:'Rory MacDonald I',date:'2013-11-16',division:'Welterweight',context:'Strong contender win before title run',credit:0.80,type:'Full'},
      {opponent:'Matt Brown',date:'2014-07-26',division:'Welterweight',context:'Five-round contender win',credit:0.70,type:'Partial'},
      {opponent:'Josh Koscheck',date:'2013-02-23',division:'Welterweight',context:'Comeback KO over known welterweight name',credit:0.55,type:'Partial'},
      {opponent:'Jake Ellenberger',date:'2014-05-24',division:'Welterweight',context:'Ranked/supporting contender win',credit:0.45,type:'Partial'},
      {opponent:'Donald Cerrone',date:'2017-07-29',division:'Welterweight',context:'Post-title name win',credit:0.35,type:'Partial'},
      {opponent:'Bobby Voelker',date:'2013-07-27',division:'Welterweight',context:'Supporting comeback KO',credit:0.25,type:'Partial'},
      {opponent:'Nick Diaz II',date:'2021-09-25',division:'Middleweight',context:'Late-career name win, timing-discounted',credit:0.25,type:'Partial'},
      {opponent:'Niko Price',date:'2023-07-08',division:'Welterweight',context:'Retirement-fight KO, support value',credit:0.25,type:'Partial'},
      {opponent:'Early UFC support wins',date:'career',division:'UFC',context:'Riley, Berger, Tiki, and Lytle support the UFC volume case',credit:0.90,type:'Combined support'}
    ],
    notes:'UFC-only welterweight champion case: violent comeback title run, two defenses, and real title value, but not clean round-to-round dominance.'
  };

  const packet={
    status:{stage:'complete first-pass packet; title-run logic, revised apex peak, quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included',lastUpdated:'2026-07-06',nextFix:'Add real photos after source images are uploaded; audit exact round-control rows next rebuild.'},
    repoLocations:{scoreSource:'assets/data/fighter-packets/robbie-lawler.js',centralPacket:'assets/data/fighter-packets/robbie-lawler.js',watchMoment:'assets/js/watch-moments.js',nickname:'assets/js/card-nicknames.js',tracker:'docs/fighter-status.md',photos:'No real photo files loaded yet; app should use initials fallback.'},
    photos:{},rounds,boardRow,profile,
    display:{
      divisionLabel:'WW / MW',resumeTag:'Ruthless title-war champion',
      oneLiner:'A Hall of Fame welterweight champion whose comeback title run delivered all-time violence and real defenses, capped by close decisions and a short reign.',
      snapshot:[['UFC Record','14-10, 1 NC'],['UFC Title-Fight Wins','3'],['Apex Peak','+4.00'],['Quality Wins','Rory, Hendricks, Condit, Brown'],['Prime Window','Koscheck 2013 → Woodley 2016'],['Prime Dominance','15.95 / 30'],['Loss Context','-8.62']],
      whyRankedHere:'Lawler lands here because his UFC comeback title run was real: he beat Hendricks for the belt, finished Rory in an all-time defense, and officially defended again against Condit.',
      whyNotHigher:'He does not rank higher because the reign was short, several title fights were razor-close, and Woodley ended the champion run quickly and violently.',
      bigAssumptions:[['Title run','The Hendricks title win and Condit defense count, but their close-score nature keeps the championship case from looking cleaner than it was.'],['Rory rematch','The Rory defense is the signature win, but it was a war rather than a clean separation performance.'],['Apex Peak','Robbie gets strong peak respect, but his peak status and signature peak moment are capped because his title run was dramatic, not dominant.'],['Prime window','The main prime window is the comeback title run from Koscheck through Woodley.'],['Late-career skid','The RDA fight and everything after are treated as decline-stage results, so they do not erase the champion version of Lawler.']],
      keyJudgmentCalls:[['Violence vs dominance','Lawler’s title run was legendary, but he was not a clean round-to-round controller.'],['Condit defense','The Condit win stays on the résumé, but with controversy context.'],['Woodley loss','The Woodley KO is the hard cap on the reign.'],['UFC-only lens','Strikeforce and Pride context can explain the legend, but the ranking here is built on UFC results.']],
      apexPeakSummary:{score:4.00,window:'Hendricks title win through Rory/Condit defenses',components:{peakStatus:0.90,eliteOpponentProof:1.10,separationDominance:0.75,divisionStrength:1.00,cleanApexAura:0.25},notes:'Rory II is an all-time title fight, but Robbie’s peak was dramatic and violent rather than cleanly dominant.'},
      primeDominanceSummary:{score:15.95,components:{primeRecord:4.60,primeRoundsWon:3.45,titleDefenseDominance:2.65,finishStoppageDominance:2.55,lossSafetyDurability:1.60,divisionStrength:1.10},notes:'Two title defenses and elite violence, but not clean sustained control.'},
      finalTakeaway:'Robbie is a real UFC champion and Hall of Fame action legend, but his GOAT case is a title-war case, not a long-dominance case.'
    },
    profileStats:{ufcRecord:'14-10, 1 NC',titleFightWins:3,adjustedTitleWins:2.55,eliteWins:3,primeDominance:15.95,finishRatePct:57.1,roundsWonPct:54.0,activeEliteYears:7.80,apexPeak:4.00,timesFinishedPrime:1,divisionStrengthContext:'Strong welterweight title era with Hendricks, Rory, Condit, Woodley, and RDA around the title picture.',lossContext:'Early UFC finish losses count lightly, Woodley is the main title-run cap, and the later skid is decline-stage context.'},
    compareSeasoning:{shortCase:'Robbie is the ruthless title-war champion case: comeback UFC belt, two defenses, Rory II, and one of the most violent champion runs ever.',peak:'At his apex, Robbie was not cleanly dominant — he was dangerous late, durable, and willing to drag elite welterweights into deep water.',resume:'The title résumé is real, but the close Hendricks/Condit results and short reign keep it capped.',championship:'UFC welterweight champion with three title-fight wins and two defenses.',opponentQuality:'Rory, Hendricks, Condit, Brown, Koscheck, Ellenberger, and Cerrone support the ledger.',longevity:'Two UFC lives give him good relevance, but elite years are mostly the 2013-2016 comeback title run.',counter:'The counter is cleanliness: close title fights, Woodley KO, and too many losses to climb into cleaner champion tiers.',edge:'Robbie wins comparisons when title-war value, violence, and real defenses matter more than clean control.',eliteCounter:false,signatureWins:'Rory MacDonald, Johny Hendricks, Carlos Condit, Matt Brown, Josh Koscheck, Jake Ellenberger.',weakness:'Short reign, close decisions, and a heavy loss column.',titleSummary:'Former UFC welterweight champion with two title defenses.',primeSummary:'Prime runs from Koscheck through the Woodley title loss.',bestArgument:'Few comeback champions have a more memorable title run than Lawler’s welterweight violence era.',titleStyle:'Ruthless Title-War Champion',primeStyle:'Comeback Violence Prime'},
    fightLedger:{
      'johny hendricks|robbie lawler':{fighters:['Johny Hendricks','Robbie Lawler'],fights:2,winner:'Split 1-1, Lawler title-result edge',importance:'major',summary:'Hendricks beat Robbie for the vacant belt, then Robbie won the rematch to become UFC welterweight champion.'},
      'robbie lawler|rory macdonald':{fighters:['Robbie Lawler','Rory MacDonald'],fights:2,winner:'Robbie Lawler',importance:'major',summary:'Lawler beat Rory twice, including the legendary UFC 189 title defense that defines Robbie’s peak case.'},
      'carlos condit|robbie lawler':{fighters:['Carlos Condit','Robbie Lawler'],fights:1,winner:'Robbie Lawler',importance:'major',summary:'Lawler officially defended against Condit in a razor-close title fight; the win counts with controversy context.'},
      'robbie lawler|tyron woodley':{fighters:['Robbie Lawler','Tyron Woodley'],fights:1,winner:'Tyron Woodley',importance:'major',summary:'Woodley knocked out Lawler to win the welterweight title and end Robbie’s reign.'},
      'nick diaz|robbie lawler':{fighters:['Nick Diaz','Robbie Lawler'],fights:2,winner:'Split 1-1',importance:'notable',summary:'Diaz shocked young Robbie in their first UFC fight; Robbie won the late-career rematch.'}
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