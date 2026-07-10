// Rose Namajunas fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-rose-namajunas-20260706a';
  const fighter = 'Rose Namajunas';

  const rounds = [
    { opponent:'Carla Esparza I', date:'2014-12-12', method:'Submission loss R3', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Pre-prime title loss; best-effort round row', confidence:'Medium', notes:'Pre-prime loss to champion/top-5, finished.' },
    { opponent:'Angela Hill', date:'2015-10-03', method:'R1 submission win', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Finish row', confidence:'High', notes:'Supporting UFC win.' },
    { opponent:'Paige VanZant', date:'2015-12-10', method:'R5 submission win', roundEnded:5, roundsCounted:5, roundsWon:5, basis:'Dominant finish row', confidence:'High', notes:'Strong early UFC statement win.' },
    { opponent:'Tecia Torres', date:'2016-04-16', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Official decision / best effort', confidence:'Medium', notes:'Ranked-quality strawweight win.' },
    { opponent:'Karolina Kowalkiewicz', date:'2016-07-30', method:'Decision loss', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Pre-prime elite loss row', confidence:'Medium', notes:'Pre-prime contender loss.' },
    { opponent:'Michelle Waterson', date:'2017-04-15', method:'R2 submission win', roundEnded:2, roundsCounted:2, roundsWon:2, basis:'Prime-start finish row', confidence:'High', notes:'Prime-start marker.' },
    { opponent:'Joanna Jedrzejczyk I', date:'2017-11-04', method:'Title win KO R1', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Clean UFC strawweight title win', confidence:'High', notes:'Rare 1.25 Quality Win title-winning champion exception.' },
    { opponent:'Joanna Jedrzejczyk II', date:'2018-04-07', method:'Title defense decision', roundEnded:5, roundsCounted:5, roundsWon:4, basis:'Official decision / best effort', confidence:'Medium', notes:'Successful title defense and second Joanna win.' },
    { opponent:'Jessica Andrade I', date:'2019-05-11', method:'Title loss KO R2', roundEnded:2, roundsCounted:2, roundsWon:1, basis:'Prime title loss, finished', confidence:'High', notes:'Prime loss to champion/top-5, finished.' },
    { opponent:'Jessica Andrade II', date:'2020-07-11', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Official split decision / best effort', confidence:'Medium', notes:'High-value former champion rematch win.' },
    { opponent:'Zhang Weili I', date:'2021-04-24', method:'Title win KO R1', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Clean UFC strawweight title win', confidence:'High', notes:'Rare 1.25 Quality Win title-winning champion exception.' },
    { opponent:'Zhang Weili II', date:'2021-11-06', method:'Title defense decision', roundEnded:5, roundsCounted:5, roundsWon:3, basis:'Official split decision / best effort', confidence:'Medium', notes:'Successful title defense and second Zhang win.' },
    { opponent:'Carla Esparza II', date:'2022-05-07', method:'Title loss decision', roundEnded:5, roundsCounted:5, roundsWon:2, basis:'Prime title loss, decision', confidence:'Medium', notes:'Prime window ends here; loss penalty stops after this fight.' },
    { opponent:'Manon Fiorot', date:'2023-09-02', method:'Decision loss', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Post-prime flyweight phase', confidence:'Medium', notes:'Post-prime/upward-division loss; 0 penalty.' },
    { opponent:'Amanda Ribas', date:'2024-03-23', method:'Decision win', roundEnded:5, roundsCounted:5, roundsWon:4, basis:'Flyweight relevance win', confidence:'Medium', notes:'Longevity/relevance credit, not prime-core proof.' },
    { opponent:'Tracy Cortez', date:'2024-07-13', method:'Decision win', roundEnded:5, roundsCounted:5, roundsWon:4, basis:'Flyweight relevance win', confidence:'Medium', notes:'Longevity/relevance credit.' },
    { opponent:'Erin Blanchfield', date:'2024-11-02', method:'Decision loss', roundEnded:5, roundsCounted:5, roundsWon:2, basis:'Post-prime flyweight phase', confidence:'Medium', notes:'Post-prime/upward-division loss; 0 penalty.' },
    { opponent:'Miranda Maverick', date:'2025-06-14', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Flyweight relevance win', confidence:'Medium', notes:'Longevity/relevance credit.' },
    { opponent:'Natália Silva', date:'2026-01-24', method:'Decision loss', roundEnded:3, roundsCounted:3, roundsWon:1, basis:'Post-prime flyweight phase with injury/eye-poke context', confidence:'Medium', notes:'Post-prime/upward-division loss; 0 penalty.' }
  ];

  const boardRow = {
    fighter, totalScore:41.25, championship:10.40, opponentQuality:8.90, primeDominance:18.75, longevity:8.60, apexPeak:4.85, penalty:-6.00,
    leaderboard:'women', gender:'Women', ufcRecord:'12-7', primaryDivision:'Strawweight', secondaryDivision:'Flyweight', finishRatePct:33.3, activeEliteYears:6.3, timesFinishedPrime:1,  roundsWonPct:63.0,
    notes:'Permanent fighter-packet add. Two-time UFC strawweight champion with four title-fight wins, elite Joanna/Zhang quality wins, a 6-2 prime, and post-prime flyweight losses carrying 0 loss-context penalty.'
  };

  const profile = {
    id:'RN001', fighter, gender:'Women', primaryDivision:'Strawweight', secondaryDivision:'Flyweight', scope:'UFC', ufcRecord:'12-7', ufcWins:12, ufcLosses:7, scoredUfcFights:19, finishWins:4, finishRatePct:33.3, timesFinishedPrime:1, lossPenalty:-6.00, activeEliteYears:6.3, primeStart:'Michelle Waterson 2017', primeEnd:'Carla Esparza II 2022', totalScore:41.25, championship:10.40, opponentQuality:8.90, primeDominance:18.75, longevity:8.60, apexPeak:4.85, penalty:-6.00, leaderboard:'women', rounds,
    title:{ normalTitleWins:4, adjustedTitleWins:4.00, notes:'UFC title-fight wins = 4: Joanna title win, Joanna defense, Zhang title win, Zhang defense. Adjusted title wins = 4.00. Carla Esparza I, Andrade I, and Carla Esparza II are title losses and add no Championship credit.' },
    opponents:[
      { opponent:'Joanna Jedrzejczyk I', date:'2017-11-04', division:'Strawweight', context:'Won UFC strawweight title from dominant reigning champion', credit:1.25, type:'Rare title-win exception' },
      { opponent:'Zhang Weili I', date:'2021-04-24', division:'Strawweight', context:'Won UFC strawweight title from reigning champion', credit:1.25, type:'Rare title-win exception' },
      { opponent:'Joanna Jedrzejczyk II', date:'2018-04-07', division:'Strawweight', context:'Successful title defense over all-time strawweight champion', credit:1.00, type:'Full' },
      { opponent:'Zhang Weili II', date:'2021-11-06', division:'Strawweight', context:'Successful title defense over elite former champion', credit:1.00, type:'Full' },
      { opponent:'Jessica Andrade II', date:'2020-07-11', division:'Strawweight', context:'Former champion rematch win', credit:1.00, type:'Full' },
      { opponent:'Michelle Waterson', date:'2017-04-15', division:'Strawweight', context:'Prime-start ranked contender finish', credit:0.75, type:'Partial' },
      { opponent:'Tecia Torres', date:'2016-04-16', division:'Strawweight', context:'Ranked-quality strawweight win', credit:0.55, type:'Partial' },
      { opponent:'Amanda Ribas', date:'2024-03-23', division:'Flyweight', context:'Post-prime flyweight relevance win', credit:0.55, type:'Partial' },
      { opponent:'Tracy Cortez', date:'2024-07-13', division:'Flyweight', context:'Post-prime flyweight relevance win', credit:0.50, type:'Partial' },
      { opponent:'Paige VanZant', date:'2015-12-10', division:'Strawweight', context:'Strong early UFC finish', credit:0.40, type:'Partial' },
      { opponent:'Miranda Maverick', date:'2025-06-14', division:'Flyweight', context:'Post-prime flyweight relevance win', credit:0.40, type:'Partial' },
      { opponent:'Angela Hill', date:'2015-10-03', division:'Strawweight', context:'Supporting UFC win', credit:0.25, type:'Partial' }
    ],
    notes:'UFC-only women’s champion case: massive elite-win value over Joanna and Zhang, a two-reign strawweight title profile, but short reigns and prime Andrade/Esparza losses cap the case.'
  };

  const packet = {
    status:{ stage:'complete first-pass packet; two-reign strawweight case, win ledger, loss context, round-control rows, compare seasoning, and fight ledger included', lastUpdated:'2026-07-06', nextFix:'Add real photos after source images are uploaded; add Watch Moment only if URL is provided; audit exact round-control rows during next full scoring-table rebuild.' },
    repoLocations:{ scoreSource:'assets/data/fighter-packets/rose-namajunas.js', centralPacket:'assets/data/fighter-packets/rose-namajunas.js', tracker:'docs/fighter-status.md', photos:'No real photo files loaded yet; app should use initials fallback.' },
    photos:{},
    rounds,
    boardRow,
    profile,
    display:{
      overallOvr:86, divisionLabel:'SW / FLW', resumeTag:'Two-reign strawweight giant killer',
      oneLiner:'A volatile but elite UFC-only case: two strawweight reigns, four title-fight wins, Joanna twice, Zhang twice, and a 6-2 prime capped by Andrade and Esparza damage.',
      categories:{ championship:{ovr:86}, opponentQuality:{ovr:88}, primeDominance:{ovr:85}, longevity:{ovr:85}, apexPeak:{ovr:90}, penalty:{ovr:82} },
      snapshot:[ ['UFC Record','12-7'], ['UFC Title-Fight Wins','4 official / 4.00 adjusted'], ['Apex Peak','+4.85'], ['Quality Wins','Joanna x2, Zhang x2, Andrade'],  ['Prime Dominance','18.75 / 30'], ['Rounds Won','63.0% best-effort'], ['Loss Context','-6.00'] ],
      whyRankedHere:'Rose belongs in the high-end women’s UFC champion tier because the quality wins are enormous: Joanna twice, Zhang twice, Andrade, and two separate strawweight title wins.',
      whyNotHigher:'The case is capped by short title reigns and volatility. Four title-fight wins is strong, but not Amanda, Valentina, or Zhang title volume, and the Andrade finish plus Esparza rematch loss keep the prime from looking clean.',
      bigAssumptions:[ ['Prime record','Prime is 6-2: Waterson, Joanna I, Joanna II, Andrade II, Zhang I, Zhang II, with losses to Andrade I and Esparza II.'], ['Loss cutoff','Loss penalties stop after Carla Esparza II because the later flyweight losses are post-prime/upward-division phase.'], ['Quality Wins cap','Joanna I and Zhang I get rare 1.25 title-win exception credit. Joanna II, Zhang II, and Andrade II are full 1.00 wins, not above-cap bumps.'], ['Championship volume','Four adjusted title wins is strong but not long-reign volume.'], ['Photos','No photo paths until real files exist in assets/fighters/.'] ],
      keyJudgmentCalls:[ ['Prime cutoff','Esparza II ends the prime-loss window.'], ['Flyweight phase','Counts for longevity/relevance, not prime-loss damage.'], ['Head-to-head value','Wins over Joanna and Zhang carry major Quality Wins and Apex value.'], ['Volatility','Rose gets huge peak value, but short reigns and bad-looking title losses matter.'], ['Strawweight context','Modern strawweight is treated as a strong women’s UFC division.'] ],
      apexPeakSummary:{ score:4.85, window:'Joanna title breakthrough through Zhang rematch defense', components:{ peakStatus:1.30, eliteOpponentProof:1.40, separationDominance:0.75, divisionStrength:0.70, cleanApexAura:0.70 }, notes:'Elite opponent proof is the core: Joanna twice and Zhang twice. Not maxed because the reigns were short and the dominance was uneven.' },
      primeDominanceSummary:{ score:18.75, components:{ primeRecord:5.00, primeRoundsWon:4.15, titleDefenseDominance:2.50, finishStoppageDominance:3.00, lossSafetyDurability:2.25, divisionStrength:1.85 }, notes:'A 6-2 prime with huge wins, but not a round-control machine and finished by Andrade during the core window.' },
      finalTakeaway:'Rose is one of the highest-variance women’s UFC GOAT cases: legendary quality wins and real title moments, balanced by short reigns and meaningful prime losses.'
    },
    profileStats:{ ufcRecord:'12-7', titleFightWins:4, adjustedTitleWins:4.00, eliteWins:5,  primeDominance:18.75, finishRatePct:33.3, roundsWonPct:63.0, activeEliteYears:6.3, apexPeak:4.85, timesFinishedPrime:1, divisionStrengthContext:'Women’s strawweight is treated as one of the stronger women’s UFC divisions across Rose’s prime.', lossContext:'Carla Esparza I and Karolina are pre-prime damage. Andrade I and Carla Esparza II are prime damage. Fiorot, Blanchfield, and Silva are post-prime/upward-division and receive 0 loss-context penalty.' },
    compareSeasoning:{
      shortCase:'Rose is the giant-killer strawweight case: two title reigns, Joanna twice, Zhang twice, and one of the best women’s UFC quality-win clusters ever.',
      peak:'At her best, Rose had timing, movement, sudden finishing danger, and title-fight poise against historically great strawweights.',
      resume:'Her UFC resume is not the cleanest, but the top-end wins are massive. The model rewards the wins while still charging the volatility.',
      championship:'Two UFC strawweight reigns and four title-fight wins give Rose a real championship case, but not long-reign volume.',
      opponentQuality:'Joanna twice, Zhang twice, and Andrade are the backbone of her case.',
      longevity:'Her elite window centers on 2017-2022, with the flyweight phase adding relevance but not prime-loss damage.',
      counter:'The counterargument is consistency: short reigns, the Andrade finish, the Esparza rematch, and several post-prime flyweight losses.',
      edge:'Rose wins comparisons when elite-win quality and head-to-head strawweight proof matter more than clean long-reign control.',
      eliteCounter:true,
      signatureWins:'Joanna Jedrzejczyk twice, Zhang Weili twice, Jessica Andrade, Michelle Waterson, Tecia Torres, Amanda Ribas, Tracy Cortez.',
      weakness:'Short title reigns and volatile prime-loss context.',
      titleSummary:'Two-time UFC strawweight champion with four official and adjusted title-fight wins.',
      primeSummary:'6-2 prime from Waterson through Esparza II.',
      bestArgument:'The best argument is that very few women have a better top-five win cluster than Rose’s Joanna/Zhang run.',
      titleStyle:'Two-Reign Strawweight Giant Killer', primeStyle:'High-Variance Elite Peak',
      legacyStats:{ ufcRecord:'12-7', titleFightWins:4, adjustedTitleWins:4.00, beltsWon:1, titleDefenses:2, activeEliteYearsLabel:'roughly 6 active elite years', primeNote:'Waterson-through-Esparza II strawweight title/elite window; flyweight phase counts as post-prime relevance' }
    },
    fightLedger:{
      'joanna jedrzejczyk|rose namajunas':{ fighters:['Joanna Jedrzejczyk','Rose Namajunas'], fights:2, winner:'Rose Namajunas', importance:'major', summary:'Rose went 2-0 against Joanna in UFC strawweight title fights: one title-winning finish and one five-round title defense.' },
      'rose namajunas|zhang weili':{ fighters:['Rose Namajunas','Zhang Weili'], fights:2, winner:'Rose Namajunas', importance:'major', summary:'Rose beat Zhang twice in UFC strawweight title fights, including one finish. This is Rose’s strongest head-to-head GOAT argument and Zhang’s clearest ceiling.' },
      'jessica andrade|rose namajunas':{ fighters:['Jessica Andrade','Rose Namajunas'], fights:2, winner:'Split 1-1', importance:'major', summary:'Andrade knocked Rose out to win the title, then Rose won the rematch by decision. The split captures Rose’s volatility: elite skill, real danger, and a prime finish loss.' },
      'carla esparza|rose namajunas':{ fighters:['Carla Esparza','Rose Namajunas'], fights:2, winner:'Carla Esparza', importance:'major', summary:'Esparza beat Rose twice in UFC title fights: the first pre-prime and the second ending Rose’s prime-loss window.' }
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