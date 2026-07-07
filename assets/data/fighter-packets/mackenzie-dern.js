// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Mackenzie Dern fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-mackenzie-dern-20260706a';
  const fighter = 'Mackenzie Dern';

  const rounds = [
    { opponent:'Ashley Yoder', date:'2018-03-03', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'UFC debut decision row', confidence:'Medium', notes:'Supporting early UFC win; pre-prime.' },
    { opponent:'Amanda Cooper', date:'2018-05-12', method:'R1 submission win', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Early UFC finish row with missed-weight context', confidence:'High', notes:'Supporting early win; missed-weight context keeps value low.' },
    { opponent:'Amanda Ribas I', date:'2019-10-12', method:'Decision loss', roundEnded:3, roundsCounted:3, roundsWon:0, basis:'Pre-prime loss to solid/non-elite opponent', confidence:'Medium', notes:'Pre-prime loss to solid opponent; no finish.' },
    { opponent:'Hannah Cifers', date:'2020-05-30', method:'R1 submission win', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Prime-start submission row', confidence:'High', notes:'Prime window starts here; supporting finish.' },
    { opponent:'Randa Markos', date:'2020-09-19', method:'R1 submission win', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Submission finish row', confidence:'High', notes:'Supporting submission win.' },
    { opponent:'Virna Jandiroba I', date:'2020-12-12', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Strong grappler decision win row', confidence:'Medium', notes:'Strong win that aged well.' },
    { opponent:'Nina Nunes', date:'2021-04-10', method:'R1 submission win', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Submission finish row', confidence:'High', notes:'Good submission win, timing-discounted.' },
    { opponent:'Marina Rodriguez', date:'2021-10-09', method:'Decision loss', roundEnded:5, roundsCounted:5, roundsWon:2, basis:'Prime loss to champion/top-5 type contender', confidence:'Medium', notes:'Prime contender loss; no finish.' },
    { opponent:'Tecia Torres', date:'2022-04-09', method:'Split decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Ranked strawweight decision row', confidence:'Medium', notes:'Solid ranked strawweight win.' },
    { opponent:'Yan Xiaonan', date:'2022-10-01', method:'Decision loss', roundEnded:5, roundsCounted:5, roundsWon:2, basis:'Prime loss to champion/top-5 type contender', confidence:'Medium', notes:'Prime contender loss; no finish.' },
    { opponent:'Angela Hill', date:'2023-05-20', method:'Decision win', roundEnded:5, roundsCounted:5, roundsWon:4, basis:'Five-round contender win row', confidence:'Medium', notes:'Strong five-round contender win.' },
    { opponent:'Jessica Andrade', date:'2023-11-11', method:'R2 TKO loss', roundEnded:2, roundsCounted:2, roundsWon:0, basis:'Prime loss to former champ/top-5, finished', confidence:'High', notes:'Counted prime finish-loss damage.' },
    { opponent:'Amanda Lemos', date:'2024-02-17', method:'Decision loss', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Prime loss to top-5 contender', confidence:'Medium', notes:'Prime contender loss; no finish.' },
    { opponent:'Loopy Godinez', date:'2024-08-03', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Ranked/relevance win row', confidence:'Medium', notes:'Useful ranked/relevance win.' },
    { opponent:'Amanda Ribas II', date:'2025-01-11', method:'R3 submission win', roundEnded:3, roundsCounted:3, roundsWon:3, basis:'Avenged-loss submission row', confidence:'High', notes:'Strong ranked win and revenge finish.' },
    { opponent:'Virna Jandiroba II', date:'2025-10-25', method:'Vacant title decision win', roundEnded:5, roundsCounted:5, roundsWon:3, basis:'Vacant UFC strawweight title win', confidence:'Medium', notes:'0.90 adjusted title win; elite contender win, not reigning-champion win.' }
  ];

  const boardRow = {
    fighter, totalScore:26.60, championship:8.00, opponentQuality:5.20, primeDominance:15.20, longevity:7.50, apexPeak:3.40, penalty:-9.00,
    leaderboard:'women', gender:'Women', ufcRecord:'11-5', primaryDivision:'Strawweight', secondaryDivision:'', finishRatePct:45.5, activeEliteYears:7.50, timesFinishedPrime:1, primeRecord:'9-4', roundsWonPct:53.5,
    notes:'Permanent fighter-packet add. Current UFC strawweight champion with elite submission value and a strong Jandiroba title win, capped by repeated prime contender losses and a vacant-title path.'
  };

  const profile = {
    id:'MD001', fighter, gender:'Women', primaryDivision:'Strawweight', secondaryDivision:'', scope:'UFC', ufcRecord:'11-5', ufcWins:11, ufcLosses:5, scoredUfcFights:16, finishWins:5, finishRatePct:45.5, timesFinishedPrime:1, lossPenalty:-9.00, activeEliteYears:7.50, primeStart:'Hannah Cifers 2020', primeEnd:'Virna Jandiroba II 2025 / current champ phase', totalScore:26.60, championship:8.00, opponentQuality:5.20, primeDominance:15.20, longevity:7.50, apexPeak:3.40, penalty:-9.00, leaderboard:'women', rounds,
    title:{ normalTitleWins:1, adjustedTitleWins:0.90, notes:'Won the vacant UFC strawweight title against Virna Jandiroba. Jandiroba II = 0.90 adjusted title win because it was a real title win over an elite contender, but not a reigning-champion win.' },
    opponents:[
      { opponent:'Virna Jandiroba II', date:'2025-10-25', division:'Strawweight', context:'Vacant UFC strawweight title win over elite contender', credit:1.00, type:'Full' },
      { opponent:'Virna Jandiroba I', date:'2020-12-12', division:'Strawweight', context:'Strong grappler win that aged well', credit:0.75, type:'Partial' },
      { opponent:'Amanda Ribas II', date:'2025-01-11', division:'Strawweight', context:'Avenged loss by submission against ranked opponent', credit:0.70, type:'Partial' },
      { opponent:'Tecia Torres', date:'2022-04-09', division:'Strawweight', context:'Solid ranked strawweight win', credit:0.55, type:'Partial' },
      { opponent:'Angela Hill', date:'2023-05-20', division:'Strawweight', context:'Strong five-round contender win', credit:0.50, type:'Partial' },
      { opponent:'Loopy Godinez', date:'2024-08-03', division:'Strawweight', context:'Useful ranked/relevance win', credit:0.45, type:'Partial' },
      { opponent:'Nina Nunes', date:'2021-04-10', division:'Strawweight', context:'Good submission win, timing-discounted', credit:0.40, type:'Partial' },
      { opponent:'Randa Markos', date:'2020-09-19', division:'Strawweight', context:'Supporting submission win', credit:0.30, type:'Partial' },
      { opponent:'Hannah Cifers', date:'2020-05-30', division:'Strawweight', context:'Prime-start supporting finish', credit:0.25, type:'Partial' },
      { opponent:'Amanda Cooper', date:'2018-05-12', division:'Strawweight', context:'Supporting early UFC win with missed-weight context', credit:0.20, type:'Partial' },
      { opponent:'Ashley Yoder', date:'2018-03-03', division:'Strawweight', context:'UFC debut support win', credit:0.10, type:'Partial' }
    ],
    notes:'UFC-only strawweight champion case: elite submission threat and real current-title value, but the case is capped by no defenses, no reigning-champion win, and multiple prime contender losses.'
  };

  const packet = {
    status:{ stage:'complete first-pass packet; vacant strawweight title case, win ledger, loss context, round-control rows, compare seasoning, fight ledger, and Watch Moment included', lastUpdated:'2026-07-06', nextFix:'Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild.' },
    repoLocations:{ scoreSource:'assets/data/fighter-packets/mackenzie-dern.js', centralPacket:'assets/data/fighter-packets/mackenzie-dern.js', watchMoment:'assets/js/watch-moments.js', tracker:'docs/fighter-status.md', photos:'No real photo files loaded yet; app should use initials fallback.' },
    photos:{},
    rounds,
    boardRow,
    profile,
    display:{
      overallOvr:78, divisionLabel:'SW', resumeTag:'Submission champ climb',
      oneLiner:'A current UFC strawweight champion with elite submission danger and real title value, but a volatile contender ledger keeps the UFC-only score grounded.',
      categories:{ championship:{ovr:73}, opponentQuality:{ovr:71}, primeDominance:{ovr:78}, longevity:{ovr:74}, apexPeak:{ovr:77}, penalty:{ovr:62} },
      snapshot:[ ['UFC Record','11-5'], ['UFC Title-Fight Wins','1 official / 0.90 adjusted'], ['Apex Peak','+3.40'], ['Quality Wins','Jandiroba x2, Ribas, Torres'], ['Prime Record','9-4'], ['Prime Dominance','15.20 / 30'], ['Rounds Won','53.5% best-effort'], ['Loss Context','-9.00'] ],
      whyRankedHere:'Dern scores as a legitimate UFC champion because the Jandiroba title win, submission threat, and long strawweight relevance give her a real UFC-only case.',
      whyNotHigher:'The score is capped by a vacant-title path, no defenses yet, no reigning-champion win, and repeated prime contender losses to Marina Rodriguez, Yan Xiaonan, Jessica Andrade, and Amanda Lemos.',
      bigAssumptions:[ ['Adjusted title wins','Jandiroba II is 0.90 because it was a vacant-title win over an elite contender, not a reigning-champion win.'], ['Apex aura','Apex aura is intentionally only 0.25 / 0.75 because the title moment matters, but it does not create long-reign aura yet.'], ['Prime start','Prime starts at Hannah Cifers in 2020, when the submission run begins.'], ['Prime status','Dern is still treated as current/in-prime, so all UFC losses remain eligible for scoring unless later changed.'], ['BJJ context','Elite grappling résumé matters as style context only; non-UFC grappling accomplishments are not scored.'], ['Photos','No photo paths until real files exist in assets/fighters/.'] ],
      keyJudgmentCalls:[ ['Vacant title credit','The belt is real, but adjusted title credit is below a reigning-champion title win.'], ['Losses stay live','No post-prime cutoff yet, so the Marina/Yan/Andrade/Lemos losses still matter.'], ['Submission dominance','Finish/stoppage dominance is the strongest Prime Dominance input.'], ['Strawweight context','Women’s strawweight is treated as a strong women’s UFC division.'] ],
      apexPeakSummary:{ score:3.40, window:'Jandiroba title breakthrough and submission-heavy contender climb', components:{ peakStatus:0.90, eliteOpponentProof:0.85, separationDominance:0.65, divisionStrength:0.75, cleanApexAura:0.25 }, notes:'Dern gets current-champion peak value and strong division context, but apex aura is deliberately low because the title came through a vacant path and there is no defense/reign stack yet.' },
      primeDominanceSummary:{ score:15.20, components:{ primeRecord:4.70, primeRoundsWon:3.35, titleDefenseDominance:0.00, finishStoppageDominance:3.45, lossSafetyDurability:1.95, divisionStrength:1.75 }, notes:'Submission danger is elite, but the 9-4 prime and contender-loss pattern prevent a clean dominance score.' },
      finalTakeaway:'Dern is a real UFC champion add, but the model should treat her as a volatile current-title case, not a settled long-reign GOAT case.'
    },
    profileStats:{ ufcRecord:'11-5', titleFightWins:1, adjustedTitleWins:0.90, eliteWins:2, primeRecord:'9-4', primeDominance:15.20, finishRatePct:45.5, roundsWonPct:53.5, activeEliteYears:7.50, apexPeak:3.40, timesFinishedPrime:1, divisionStrengthContext:'Women’s strawweight is treated as a strong women’s UFC division across Dern’s contender/title window.', lossContext:'Amanda Ribas I is pre-prime. Marina Rodriguez, Yan Xiaonan, Jessica Andrade, and Amanda Lemos are counted prime losses; Andrade adds finish-loss damage. No post-prime cutoff is applied yet.' },
    compareSeasoning:{
      shortCase:'Dern is the submission-specialist champion case: elite grappling danger, long strawweight relevance, and a vacant-title breakthrough over Jandiroba.',
      peak:'At her best, Dern brings immediate submission danger and enough improved striking/cardio to survive deep contender fights.',
      resume:'The UFC resume has volume and a belt, but the elite-win ceiling is still building. The model rewards the title without pretending the losses disappeared.',
      championship:'One UFC strawweight title win, no defenses yet, with adjusted title value discounted for the vacant-title path.',
      opponentQuality:'Jandiroba twice and Ribas revenge are the core. Torres, Hill, Godinez, and Nina are supporting wins.',
      longevity:'Her elite UFC window runs from 2020 through the current champ phase, with long strawweight relevance but uneven results.',
      counter:'The counterargument is volatility: five UFC losses, no defenses, and no reigning-champion win yet.',
      edge:'Dern wins comparisons when current-title value, submission threat, and long strawweight activity matter more than clean championship control.',
      eliteCounter:false,
      signatureWins:'Virna Jandiroba twice, Amanda Ribas, Tecia Torres, Angela Hill, Loopy Godinez, Nina Nunes.',
      weakness:'Repeated prime contender losses and no UFC title defenses yet.',
      titleSummary:'One-time UFC strawweight champion with one official title-fight win and 0.90 adjusted title wins.',
      primeSummary:'9-4 prime from Cifers through current champ phase.',
      bestArgument:'The best argument is that Dern is a current UFC champion with one of the strongest submission threats in women’s UFC history.',
      titleStyle:'Vacant-Title Strawweight Champion', primeStyle:'Submission-First Contender Climb',
      legacyStats:{ ufcRecord:'11-5', titleFightWins:1, adjustedTitleWins:0.90, beltsWon:1, titleDefenses:0, activeEliteYearsLabel:'roughly 7.5 active elite years', primeNote:'Cifers-through-current strawweight contender/title window; no post-prime cutoff yet' }
    },
    fightLedger:{
      'mackenzie dern|virna jandiroba':{ fighters:['Mackenzie Dern','Virna Jandiroba'], fights:2, winner:'Mackenzie Dern', importance:'major', summary:'Dern went 2-0 against Jandiroba, including the vacant UFC strawweight title win. This is the backbone of Dern’s UFC-only title case.' },
      'amanda ribas|mackenzie dern':{ fighters:['Amanda Ribas','Mackenzie Dern'], fights:2, winner:'Split 1-1', importance:'notable', summary:'Ribas beat Dern first, then Dern avenged the loss by submission. The split captures Dern’s growth and volatility.' },
      'jessica andrade|mackenzie dern':{ fighters:['Jessica Andrade','Mackenzie Dern'], fights:1, winner:'Jessica Andrade', importance:'notable', summary:'Andrade finished Dern in a counted prime loss, which is Dern’s clearest loss-context hit.' }
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
