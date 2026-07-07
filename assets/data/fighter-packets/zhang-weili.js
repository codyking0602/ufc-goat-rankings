// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Zhang Weili fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-zhang-weili-20260706a';
  const fighter = 'Zhang Weili';

  const rounds = [
    { opponent:'Danielle Taylor', date:'2018-08-04', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:3, basis:'UFC debut decision row', confidence:'Medium', notes:'Low-impact UFC debut win.' },
    { opponent:'Jessica Aguilar', date:'2018-11-24', method:'R1 submission win', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Supporting UFC finish row', confidence:'High', notes:'Supporting win.' },
    { opponent:'Tecia Torres', date:'2019-03-02', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:3, basis:'Ranked-quality strawweight win', confidence:'Medium', notes:'Useful early UFC ranked-quality win.' },
    { opponent:'Jessica Andrade', date:'2019-08-31', method:'Title win', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Clean UFC strawweight title win', confidence:'High', notes:'Rare 1.25 Quality Win exception as a reigning-champ title win.' },
    { opponent:'Joanna Jedrzejczyk I', date:'2020-03-07', method:'Title defense', roundEnded:5, roundsCounted:5, roundsWon:3, basis:'Classic elite title defense, close fight', confidence:'Medium', notes:'Full defense credit; close but not discounted as controversy.' },
    { opponent:'Rose Namajunas I', date:'2021-04-24', method:'Title loss', roundEnded:1, roundsCounted:1, roundsWon:0, basis:'Prime loss to elite champ/top-5, finished', confidence:'High', notes:'-2.25 counted loss penalty.' },
    { opponent:'Rose Namajunas II', date:'2021-11-06', method:'Decision title loss', roundEnded:5, roundsCounted:5, roundsWon:2, basis:'Prime loss to elite champ/top-5, decision', confidence:'Medium', notes:'-1.50 counted loss penalty.' },
    { opponent:'Joanna Jedrzejczyk II', date:'2022-06-12', method:'R2 KO win', roundEnded:2, roundsCounted:2, roundsWon:2, basis:'Elite-name rematch finish with timing discount', confidence:'High', notes:'Major comeback win, but Joanna timing/inactivity discount applies.' },
    { opponent:'Carla Esparza', date:'2022-11-12', method:'Title win', roundEnded:2, roundsCounted:2, roundsWon:2, basis:'Regained UFC strawweight title', confidence:'High', notes:'Full adjusted title-win credit.' },
    { opponent:'Amanda Lemos', date:'2023-08-19', method:'Title defense', roundEnded:5, roundsCounted:5, roundsWon:5, basis:'Dominant title-defense control row', confidence:'High', notes:'Dominant control win over dangerous contender.' },
    { opponent:'Yan Xiaonan', date:'2024-04-13', method:'Title defense', roundEnded:5, roundsCounted:5, roundsWon:4, basis:'Five-round title defense', confidence:'Medium', notes:'Strong ranked/title-challenger win.' },
    { opponent:'Tatiana Suarez', date:'2025-02-08', method:'Title defense', roundEnded:5, roundsCounted:5, roundsWon:5, basis:'Dominant defense over unbeaten elite challenger', confidence:'Medium', notes:'Full 1.00 Quality Win credit; strong prime dominance proof.' },
    { opponent:'Valentina Shevchenko', date:'2025-11-15', method:'Flyweight title loss', roundEnded:5, roundsCounted:5, roundsWon:0, basis:'Prime upward-division title loss to elite champion', confidence:'Medium', notes:'Reduced upward-division elite-loss penalty only.' }
  ];

  const boardRow = {
    fighter, totalScore:60.85, championship:21.50, opponentQuality:10.45, primeDominance:23.00, longevity:8.70, apexPeak:4.85, penalty:-4.50,
    leaderboard:'women', gender:'Women', ufcRecord:'10-3', primaryDivision:'Strawweight', secondaryDivision:'Flyweight', finishRatePct:40.0, activeEliteYears:6.0, timesFinishedPrime:1, primeRecord:'8-3 in UFC strawweight title/elite window', roundsWonPct:72.1,
    notes:'Permanent fighter-packet add. Two-time UFC strawweight champion with six title-fight wins, four defenses, a dominant second reign, and reduced upward-division treatment for the Valentina loss.'
  };

  const profile = {
    id:'ZW001', fighter, gender:'Women', primaryDivision:'Strawweight', secondaryDivision:'Flyweight', scope:'UFC', ufcRecord:'10-3', ufcWins:10, ufcLosses:3, scoredUfcFights:13, finishWins:4, finishRatePct:40.0, timesFinishedPrime:1, lossPenalty:-4.50, activeEliteYears:6.0, primeStart:'Jessica Andrade 2019', primeEnd:'Tatiana Suarez 2025 / Valentina Shevchenko upward-division edge', totalScore:60.85, championship:21.50, opponentQuality:10.45, primeDominance:23.00, longevity:8.70, apexPeak:4.85, penalty:-4.50, leaderboard:'women', rounds,
    title:{ normalTitleWins:6, adjustedTitleWins:6.00, notes:'Two-time UFC strawweight champion. Andrade title win, Joanna defense, Esparza title win, Lemos defense, Yan defense, and Suarez defense each receive 1.00 adjusted title-win credit. Total title fight wins = 6. Adjusted title wins = 6.00.' },
    opponents:[
      { opponent:'Jessica Andrade', date:'2019-08-31', division:'Strawweight', context:'UFC strawweight title win over reigning champion', credit:1.25, type:'Rare title-win exception' },
      { opponent:'Joanna Jedrzejczyk I', date:'2020-03-07', division:'Strawweight', context:'Classic elite title defense over former champion', credit:1.00, type:'Full' },
      { opponent:'Carla Esparza', date:'2022-11-12', division:'Strawweight', context:'Regained UFC strawweight title from reigning champion', credit:1.00, type:'Full' },
      { opponent:'Tatiana Suarez', date:'2025-02-08', division:'Strawweight', context:'Dominant title defense over unbeaten elite challenger', credit:1.00, type:'Full' },
      { opponent:'Amanda Lemos', date:'2023-08-19', division:'Strawweight', context:'Dominant title-defense control win over dangerous contender', credit:0.85, type:'Partial' },
      { opponent:'Yan Xiaonan', date:'2024-04-13', division:'Strawweight', context:'Five-round title defense over ranked challenger', credit:0.80, type:'Partial' },
      { opponent:'Joanna Jedrzejczyk II', date:'2022-06-12', division:'Strawweight', context:'Elite-name rematch finish with timing/inactivity discount', credit:0.75, type:'Partial' },
      { opponent:'Tecia Torres', date:'2019-03-02', division:'Strawweight', context:'Ranked-quality early UFC win', credit:0.55, type:'Partial' },
      { opponent:'Jessica Aguilar', date:'2018-11-24', division:'Strawweight', context:'Supporting UFC win', credit:0.20, type:'Partial' },
      { opponent:'Danielle Taylor', date:'2018-08-04', division:'Strawweight', context:'Low-impact UFC debut win', credit:0.05, type:'Partial' }
    ],
    notes:'UFC-only women’s champion case: elite strawweight title volume, dominant second reign, strong Joanna/Andrade/Esparza/Suarez value, capped by the Rose losses and failed flyweight title challenge.'
  };

  const packet = {
    status:{ stage:'complete first-pass packet; strawweight title case, win ledger, loss context, round-control rows, compare seasoning, ledger, and Watch Moment included', lastUpdated:'2026-07-06', nextFix:'Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild.' },
    repoLocations:{ scoreSource:'assets/data/fighter-packets/zhang-weili.js', centralPacket:'assets/data/fighter-packets/zhang-weili.js', watchMoment:'assets/js/watch-moments.js', tracker:'docs/fighter-status.md', photos:'No real photo files loaded yet; app should use initials fallback.' },
    photos:{},
    rounds,
    boardRow,
    profile,
    display:{
      overallOvr:90, divisionLabel:'SW / FLW', resumeTag:'Strawweight two-reign force',
      oneLiner:'A two-time UFC strawweight champion with six title-fight wins, a dominant second reign, elite Joanna/Andrade/Suarez proof, and Rose as the clear ceiling on the case.',
      categories:{ championship:{ovr:92}, opponentQuality:{ovr:88}, primeDominance:{ovr:92}, longevity:{ovr:86}, apexPeak:{ovr:90}, penalty:{ovr:86} },
      snapshot:[ ['UFC Record','10-3'], ['UFC Title-Fight Wins','6 official / 6.00 adjusted'], ['Apex Peak','+4.85'], ['Quality Wins','Andrade, Joanna, Esparza, Suarez'], ['Prime Record','8-3 Title/Elite Window'], ['Prime Dominance','23.00 / 30'], ['Rounds Won','72.1% best-effort'], ['Loss Context','-4.50'] ],
      whyRankedHere:'Zhang belongs in the elite women’s UFC tier because the title resume is serious: two strawweight reigns, six title-fight wins, four defenses, a dominant second reign, and direct wins over Joanna.',
      whyNotHigher:'She does not pass the top women’s benchmarks because Rose beat her twice in the heart of her title years, and the Valentina challenge did not create a two-division UFC title case. The second reign is elite, but the loss column keeps the ceiling clear.',
      bigAssumptions:[ ['Adjusted title wins','All six title-fight wins receive 1.00 adjusted credit; no single win is inflated above 1.00.'], ['Quality Wins cap','Andrade is the only 1.25 Quality Win because it is a reigning-champ title-win exception. Suarez and Joanna I are full 1.00, not above-cap bumps.'], ['Prime start','Prime starts with the Andrade title win. Earlier UFC wins support the resume but do not define the elite window.'], ['Valentina loss','Reduced upward-division elite-loss treatment applies because Zhang moved up to challenge an elite flyweight champion.'], ['Rose losses','Both Rose losses are counted prime damage and are the main ceiling on the case.'] ],
      keyJudgmentCalls:[ ['Second reign','The Esparza/Lemos/Yan/Suarez stretch is the core of her high-end ranking.'], ['Joanna rivalry','Zhang owns the UFC series 2-0, with one classic defense and one violent rematch finish.'], ['Rose ceiling','Two in-prime title losses to Rose prevent a clean top-women claim.'], ['Valentina context','The flyweight title loss hurts lightly, not like a same-division title loss.'], ['Strawweight context','Strong women’s division context, especially compared with thinner women’s title divisions.'] ],
      apexPeakSummary:{ score:4.85, window:'Esparza title reclaim through Suarez defense', components:{ peakStatus:1.30, eliteOpponentProof:1.15, separationDominance:1.05, divisionStrength:0.65, cleanApexAura:0.70 }, notes:'Clear best-strawweight claim during the second reign, capped from max by the Rose losses.' },
      primeDominanceSummary:{ score:23.00, components:{ primeRecord:5.25, primeRoundsWon:5.75, titleDefenseDominance:4.00, finishStoppageDominance:3.25, lossSafetyDurability:3.00, divisionStrength:1.75 }, notes:'Strong five-round control and improved grappling during the second reign, with Rose losses preventing a spotless dominance case.' },
      finalTakeaway:'Zhang is a high-end women’s UFC GOAT candidate: two reigns, six title-fight wins, real strawweight dominance, and enough loss context to sit below the Nunes/Valentina benchmark tier.'
    },
    profileStats:{ ufcRecord:'10-3', titleFightWins:6, adjustedTitleWins:6.00, eliteWins:6, primeRecord:'8-3 in UFC strawweight title/elite window', primeDominance:23.00, finishRatePct:40.0, roundsWonPct:72.1, activeEliteYears:6.0, apexPeak:4.85, timesFinishedPrime:1, divisionStrengthContext:'Strawweight is treated as one of the stronger women’s UFC divisions, especially across Zhang’s title windows.', lossContext:'Rose I and Rose II are the counted prime damage. Valentina is reduced because it was an upward-division elite title challenge.' },
    compareSeasoning:{
      shortCase:'Zhang is the two-reign strawweight force: six UFC title-fight wins, direct Joanna separation, a dominant second reign, and strong Andrade/Esparza/Suarez proof.',
      peak:'At her best, Zhang was pace, strength, striking danger, clinch physicality, improved wrestling, and five-round control. The second reign showed the complete version.',
      resume:'Her UFC resume is built on strawweight title volume and elite divisional wins. Rose is the ceiling, but Zhang’s comeback reign is one of the strongest women’s UFC arcs.',
      championship:'Two strawweight title reigns, four defenses, and six title-fight wins give Zhang a real high-end women’s championship case.',
      opponentQuality:'Andrade, Joanna twice, Esparza, Suarez, Lemos, Yan, and Tecia give Zhang a strong women’s strawweight win ledger.',
      longevity:'Her elite UFC clock centers on the 2019-2025 strawweight title window, with enough second-reign proof to beat most shorter title cases.',
      counter:'The counterargument is Rose. Losing the belt and the rematch in-prime prevents Zhang from claiming the cleanest women’s UFC case.',
      edge:'Zhang wins comparisons when two-reign title value, strawweight dominance, and direct Joanna separation matter more than longer but less explosive resumes.',
      eliteCounter:true,
      signatureWins:'Jessica Andrade, Joanna Jedrzejczyk twice, Carla Esparza, Tatiana Suarez, Amanda Lemos, Yan Xiaonan, and Tecia Torres.',
      weakness:'Two Rose losses and the failed Valentina flyweight title challenge cap the overall case.',
      titleSummary:'Two-time UFC strawweight champion with six official and adjusted title-fight wins.',
      primeSummary:'Dominant second reign with elite control, improved grappling, and strong title-defense proof.',
      bestArgument:'The best argument is that Zhang combined elite title volume with a higher peak than most women’s champions below the Nunes/Valentina tier.',
      titleStyle:'Two-Reign Strawweight Champion', primeStyle:'Complete Second-Reign Prime',
      legacyStats:{ ufcRecord:'10-3', titleFightWins:6, adjustedTitleWins:6.00, beltsWon:1, titleDefenses:4, activeEliteYearsLabel:'roughly 6 active elite years', primeNote:'Andrade-through-Suarez strawweight title/elite window with Valentina as an upward-division title challenge' }
    },
    fightLedger:{
      'joanna jedrzejczyk|zhang weili':{ fighters:['Joanna Jedrzejczyk','Zhang Weili'], fights:2, winner:'Zhang Weili', importance:'major', summary:'Zhang went 2-0 against Joanna in UFC fights: one all-time classic title defense and one violent rematch finish. It is direct strawweight separation.' },
      'rose namajunas|zhang weili':{ fighters:['Rose Namajunas','Zhang Weili'], fights:2, winner:'Rose Namajunas', importance:'major', summary:'Rose beat Zhang twice in UFC strawweight title fights, including one finish. This is the clearest ceiling on Zhang’s all-time case.' },
      'valentina shevchenko|zhang weili':{ fighters:['Valentina Shevchenko','Zhang Weili'], fights:1, winner:'Valentina Shevchenko', importance:'major', summary:'Valentina beat Zhang in an upward-division flyweight title challenge. It matters, but carries reduced loss-context damage compared with a same-division title loss.' },
      'jessica andrade|zhang weili':{ fighters:['Jessica Andrade','Zhang Weili'], fights:1, winner:'Zhang Weili', importance:'major', summary:'Zhang stopped Andrade to win the UFC strawweight title, one of her highest-value quality wins.' },
      'carla esparza|zhang weili':{ fighters:['Carla Esparza','Zhang Weili'], fights:1, winner:'Zhang Weili', importance:'major', summary:'Zhang submitted Esparza to regain the UFC strawweight title and start her second reign.' }
    },
    watchMoment:{ url:'https://youtube.com/shorts/ZhdI2_I58YQ?is=TuRcxor17qZxSwUC', label:'Watch Moment' }
  };

  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function upsert(rows,row){ if(!Array.isArray(rows)||!row?.fighter) return; const index=rows.findIndex(x=>x?.fighter===row.fighter); if(index>=0) rows[index]={...rows[index],...row}; else rows.push(row); }
  function patchData(){ if(!window.RANKING_DATA) return; upsert(window.RANKING_DATA.women, boardRow); upsert(window.RANKING_DATA.fighters, profile); [...(window.RANKING_DATA.women||[]),...(window.RANKING_DATA.fighters||[])].forEach(row=>{ if(row?.fighter!==fighter) return; row.rounds=rounds; row.apexPeakAudit=packet.display.apexPeakSummary; }); if(Array.isArray(window.RANKING_DATA.women)) window.RANKING_DATA.women.sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0)); }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES==='undefined') return; DISPLAY_OVERRIDES[fighter]={...(DISPLAY_OVERRIDES[fighter]||{}),...(packet.display||{})}; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl=packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel=packet.watchMoment.label||'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats={...(DISPLAY_OVERRIDES[fighter].packetProfileStats||{}),...(packet.profileStats||{})}; DISPLAY_OVERRIDES[fighter].packetStatus=packet.status||{}; DISPLAY_OVERRIDES[fighter].repoLocations=packet.repoLocations||{}; }
  function applyCompare(){ if(packet.compareSeasoning){ window.COMPARE_PROFILES=window.COMPARE_PROFILES||{}; window.COMPARE_PROFILES[fighter]=mergeCompareProfile(window.COMPARE_PROFILES[fighter],packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES!=='undefined'){ DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{}; DISPLAY_OVERRIDES[fighter].compareProfile=mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile,window.COMPARE_PROFILES[fighter]); } } if(packet.fightLedger){ window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{}; Object.entries(packet.fightLedger).forEach(([key,value])=>{ window.COMPARE_FIGHT_LEDGER[key]={...(window.COMPARE_FIGHT_LEDGER[key]||{}),...value}; }); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS=window.UFC_FIGHTER_PACKETS||{}; window.UFC_FIGHTER_PACKETS[fighter]=packet; const current=window.UFC_FIGHTER_PACKET_SYSTEM||{}; const fighters=Array.from(new Set([...(current.fighters||[]),fighter])); const packetExtensions=Array.from(new Set([...(current.packetExtensions||[]),VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM={...current,version:current.version||VERSION,purpose:current.purpose||'Central source for fighter-facing app content during migration.',fighters,packetExtensions,appliedAt:new Date().toISOString()}; }
  patchData(); applyDisplay(); applyCompare(); registerPacket();
})();