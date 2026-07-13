// Brock Lesnar fighter packet extension.
(function(){
  const VERSION='fighter-packet-brock-lesnar-20260706a';
  const fighter='Brock Lesnar';

  const rounds=[
    {opponent:'Frank Mir I',date:'2008-02-02',method:'Submission loss R1',roundsCounted:1,roundsWon:0,basis:'Early UFC loss to former champion/submission specialist',confidence:'High',notes:'Early-career UFC loss before the title run.'},
    {opponent:'Heath Herring',date:'2008-08-09',method:'Decision win',roundsCounted:3,roundsWon:3,basis:'Solid heavyweight veteran win',confidence:'Medium',notes:'Set up the title shot.'},
    {opponent:'Randy Couture',date:'2008-11-15',method:'Title win TKO R2',roundsCounted:2,roundsWon:1,basis:'UFC heavyweight title win',confidence:'High',notes:'Real title win, but Couture was older and Brock’s title path was unusually short.'},
    {opponent:'Frank Mir II',date:'2009-07-11',method:'Title defense TKO R2',roundsCounted:2,roundsWon:2,basis:'Title defense/unification win',confidence:'High',notes:'Best clean UFC résumé win.'},
    {opponent:'Shane Carwin',date:'2010-07-03',method:'Title defense submission R2',roundsCounted:2,roundsWon:1,basis:'Title defense over interim champion',confidence:'High',notes:'Huge comeback defense, but not clean round-to-round dominance.'},
    {opponent:'Cain Velasquez',date:'2010-10-23',method:'Title loss TKO R1',roundsCounted:1,roundsWon:0,basis:'Prime title loss to elite heavyweight, finished',confidence:'High',notes:'Cain loss ends Brock’s title run.'},
    {opponent:'Alistair Overeem',date:'2011-12-30',method:'TKO loss R1',roundsCounted:1,roundsWon:0,basis:'Health-exit/decline-stage loss',confidence:'Medium',notes:'Not treated like another full prime title-run loss.'},
    {opponent:'Mark Hunt',date:'2016-07-09',method:'No contest',roundsCounted:0,roundsWon:0,basis:'No contest',confidence:'High',notes:'No win credit.'}
  ];

  const boardRow={
    fighter,totalScore:29.60,championship:9.25,opponentQuality:4.15,primeDominance:14.35,longevity:2.70,apexPeak:4.60,penalty:-3.75,
    leaderboard:'men',gender:'Men',ufcRecord:'4-3, 1 NC',primaryDivision:'Heavyweight',secondaryDivision:'',finishRatePct:75.0,activeEliteYears:2.70,timesFinishedPrime:1,roundsWonPct:56.0,
    notes:'Permanent fighter-packet add. Short-window UFC heavyweight champion with real title wins over Couture, Mir, and Carwin, capped by tiny sample size and the Cain title loss.'
  };

  const profile={
    id:'BL001',fighter,gender:'Men',primaryDivision:'Heavyweight',secondaryDivision:'',scope:'UFC',ufcRecord:'4-3, 1 NC',ufcWins:4,ufcLosses:3,scoredUfcFights:7,finishWins:3,finishRatePct:75.0,timesFinishedPrime:1,lossPenalty:-3.75,activeEliteYears:2.70,primeStart:'Randy Couture 2008',primeEnd:'Cain Velasquez 2010 title loss',totalScore:29.60,championship:9.25,opponentQuality:4.15,primeDominance:14.35,longevity:2.70,apexPeak:4.60,penalty:-3.75,leaderboard:'men',rounds,
    title:{normalTitleWins:3,adjustedTitleWins:2.40,notes:'Brock won the UFC heavyweight title from Randy Couture, defended/unified against Frank Mir, and defended against Shane Carwin. The short title path and short reign keep the championship score capped.'},
    opponents:[
      {opponent:'Frank Mir II',date:'2009-07-11',division:'Heavyweight',context:'Title defense/unification win and personal revenge',credit:0.95,type:'Full'},
      {opponent:'Randy Couture',date:'2008-11-15',division:'Heavyweight',context:'Won UFC heavyweight title from legend/champion, age-discounted',credit:0.90,type:'Full'},
      {opponent:'Shane Carwin',date:'2010-07-03',division:'Heavyweight',context:'Defended against undefeated interim champion',credit:0.85,type:'Partial'},
      {opponent:'Heath Herring',date:'2008-08-09',division:'Heavyweight',context:'Solid heavyweight veteran win',credit:0.45,type:'Partial'},
      {opponent:'Mark Hunt',date:'2016-07-09',division:'Heavyweight',context:'No contest, no win credit',credit:0.00,type:'No credit'}
    ],
    notes:'UFC-only short-window heavyweight champion case: real title achievement, enormous peak impact, but no long elite résumé.'
  };

  const packet={
    status:{stage:'complete first-pass packet; short-window title case, quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included',lastUpdated:'2026-07-06',nextFix:'Add real photos after source images are uploaded; audit exact round-control rows next rebuild.'},
    repoLocations:{scoreSource:'assets/data/fighter-packets/brock-lesnar.js',centralPacket:'assets/data/fighter-packets/brock-lesnar.js',watchMoment:'assets/js/watch-moments.js',nickname:'assets/js/card-nicknames.js',tracker:'docs/fighter-status.md',photos:'No real photo files loaded yet; app should use initials fallback.'},
    photos:{},rounds,boardRow,profile,
    display:{
      divisionLabel:'HW',resumeTag:'Short-window heavyweight champ',
      oneLiner:'A massive short-window UFC heavyweight champion whose title run was real, explosive, and historically important, but capped by tiny sample size and a brief elite window.',
      snapshot:[['UFC Record','4-3, 1 NC'],['UFC Title-Fight Wins','3'],['Apex Peak','+4.60'],['Quality Wins','Couture, Mir, Carwin'],['Prime Window','Couture 2008 → Cain 2010'],['Prime Dominance','14.35 / 30'],['Loss Context','-3.75']],
      whyRankedHere:'Lesnar lands here because his UFC heavyweight title run was real: he beat Couture, smashed Mir in the rematch, and survived Carwin to defend the belt.',
      whyNotHigher:'He does not rank higher because the elite UFC sample is tiny, the title reign was short, Cain ended the run quickly, and the later Overeem/Hunt chapter does not add résumé depth.',
      bigAssumptions:[['Title run','The Couture, Mir, and Carwin fights carry real heavyweight championship value, even with the short path and short reign.'],['Cain fight','Cain counts as the title-ending loss that exposes the limit of Brock’s short-window case.'],['Overeem fight','The Overeem loss is treated more like a health-exit/decline-stage fight than another clean title-run defeat.'],['Mark Hunt no contest','The Hunt fight adds no win credit.'],['Heavyweight context','The division was volatile, but heavyweight title wins still matter because the margin for error is brutal.']],
      keyJudgmentCalls:[['Short peak, real peak','Brock was not around long, but he absolutely reached a real UFC champion level.'],['Title value','Three UFC title-fight wins keep him from being treated like a novelty case.'],['Sample-size cap','The résumé cannot climb much higher with only a handful of UFC results.'],['Skill profile','His wrestling, size, and athleticism were overwhelming, but the Cain/Overeem fights showed the danger when he was forced backward.']],
      apexPeakSummary:{score:4.60,window:'Couture title win through Carwin defense',components:{peakStatus:1.15,eliteOpponentProof:0.85,separationDominance:0.90,divisionStrength:0.95,cleanApexAura:0.75},notes:'Winning the UFC heavyweight title that fast is a massive short-window peak, but the elite proof is capped by the thin résumé.'},
      primeDominanceSummary:{score:14.35,components:{primeRecord:3.10,primeRoundsWon:2.75,titleDefenseDominance:2.30,finishStoppageDominance:2.60,lossSafetyDurability:1.70,divisionStrength:1.90},notes:'Short, violent title run with real defenses, but not clean sustained dominance.'},
      finalTakeaway:'Brock is a real UFC heavyweight champion case, not just a star-power case — but the résumé is too short to push higher.'
    },
    profileStats:{ufcRecord:'4-3, 1 NC',titleFightWins:3,adjustedTitleWins:2.40,eliteWins:2,primeDominance:14.35,finishRatePct:75.0,roundsWonPct:56.0,activeEliteYears:2.70,apexPeak:4.60,timesFinishedPrime:1,divisionStrengthContext:'Heavyweight volatility lowers the cleanliness of the run, but UFC title wins over Couture, Mir, and Carwin still carry real value.',lossContext:'Mir I is early damage, Cain is the title-ending loss, Overeem is handled as health-exit/decline context, and Hunt is a no contest with no win credit.'},
    compareSeasoning:{shortCase:'Brock is the short-window heavyweight champion case: tiny sample, huge impact, real title wins, and one of the strangest fast rises in UFC history.',peak:'At his apex, Brock was an overwhelming size-and-wrestling problem who could turn heavyweight fights into a physical mismatch.',resume:'The résumé is real but short. Couture, Mir, and Carwin matter; the lack of volume is the cap.',championship:'UFC heavyweight champion with three title-fight wins and two defenses/unifications.',opponentQuality:'Couture, Mir, and Carwin are the core. Herring supports. Hunt is no contest.',longevity:'Extremely short elite UFC window.',counter:'The counter is obvious: tiny sample, Cain, Overeem, no long reign, and no broad contender run.',edge:'Brock wins comparisons when heavyweight title results and short-window peak impact matter more than career depth.',eliteCounter:false,signatureWins:'Randy Couture, Frank Mir, Shane Carwin, Heath Herring.',weakness:'Small UFC sample and major vulnerability when pressured backward.',titleSummary:'Former UFC heavyweight champion with three UFC title-fight wins.',primeSummary:'Prime runs from Couture through the Cain title loss.',bestArgument:'Few fighters ever reached real UFC heavyweight champion status faster.',titleStyle:'Short-Window Heavyweight Champ',primeStyle:'Physical Mismatch Title Run'},
    fightLedger:{
      'brock lesnar|frank mir':{fighters:['Brock Lesnar','Frank Mir'],fights:2,winner:'Split 1-1, Brock title-result edge',importance:'major',summary:'Mir submitted Brock in his UFC debut, then Brock destroyed Mir in the title unification rematch. The rivalry defines Brock’s early title proof.'},
      'brock lesnar|randy couture':{fighters:['Brock Lesnar','Randy Couture'],fights:1,winner:'Brock Lesnar',importance:'major',summary:'Brock beat Couture to win the UFC heavyweight title, the launch point of his short but real championship case.'},
      'brock lesnar|shane carwin':{fighters:['Brock Lesnar','Shane Carwin'],fights:1,winner:'Brock Lesnar',importance:'major',summary:'Brock survived Carwin’s first-round storm and submitted him to defend/unify the heavyweight title.'},
      'brock lesnar|cain velasquez':{fighters:['Brock Lesnar','Cain Velasquez'],fights:1,winner:'Cain Velasquez',importance:'major',summary:'Cain stopped Brock to win the heavyweight title, exposing the ceiling of Brock’s short-window reign.'},
      'brock lesnar|alistair overeem':{fighters:['Brock Lesnar','Alistair Overeem'],fights:1,winner:'Alistair Overeem',importance:'notable',summary:'Overeem stopped Brock in Brock’s health-exit/decline-stage fight; important context, but not treated like a second prime title-run collapse.'}
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