// Kayla Harrison fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-kayla-harrison-20260706a';
  const fighter = 'Kayla Harrison';

  const rounds = [
    { opponent:'Holly Holm', date:'2024-04-13', method:'R2 submission win', roundEnded:2, roundsCounted:2, roundsWon:2, basis:'Dominant UFC debut submission row', confidence:'High', notes:'Former champion name, timing-discounted but still valuable.' },
    { opponent:'Ketlen Vieira', date:'2024-10-05', method:'Decision win', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Ranked bantamweight decision row', confidence:'Medium', notes:'Strong ranked bantamweight contender win.' },
    { opponent:'Julianna Peña', date:'2025-06-07', method:'Title win R2 submission', roundEnded:2, roundsCounted:2, roundsWon:2, basis:'Clean UFC bantamweight title win', confidence:'High', notes:'Full 1.00 adjusted title win over reigning champion.' }
  ];

  const boardRow = {
    fighter, totalScore:33.66, championship:9.25, opponentQuality:2.60, primeDominance:17.70, longevity:2.50, apexPeak:3.85, penalty:0.00,
    leaderboard:'women', gender:'Women', ufcRecord:'3-0', primaryDivision:'Bantamweight', secondaryDivision:'', finishRatePct:66.7, activeEliteYears:2.50, timesFinishedPrime:0,  roundsWonPct:85.7,
    notes:'Permanent fighter-packet add. Current UFC bantamweight champion with a perfect 3-0 UFC record, dominant grappling control, and a hard UFC-only volume cap.'
  };

  const profile = {
    id:'KH001', fighter, gender:'Women', primaryDivision:'Bantamweight', secondaryDivision:'', scope:'UFC', ufcRecord:'3-0', ufcWins:3, ufcLosses:0, scoredUfcFights:3, finishWins:2, finishRatePct:66.7, timesFinishedPrime:0, lossPenalty:0.00, activeEliteYears:2.50, primeStart:'Holly Holm 2024', primeEnd:'Julianna Peña 2025 / current champ phase', totalScore:33.66, championship:9.25, opponentQuality:2.60, primeDominance:17.70, longevity:2.50, apexPeak:3.85, penalty:0.00, leaderboard:'women', rounds,
    title:{ normalTitleWins:1, adjustedTitleWins:1.00, notes:'Won the UFC bantamweight title from Julianna Peña. Peña title win = 1.00 adjusted title win. No defenses yet.' },
    opponents:[
      { opponent:'Julianna Peña', date:'2025-06-07', division:'Bantamweight', context:'Won undisputed UFC bantamweight title from reigning champion', credit:1.00, type:'Full' },
      { opponent:'Ketlen Vieira', date:'2024-10-05', division:'Bantamweight', context:'Strong ranked bantamweight contender win', credit:0.80, type:'Partial' },
      { opponent:'Holly Holm', date:'2024-04-13', division:'Bantamweight', context:'Dominant UFC debut over former champion; timing-discounted but meaningful', credit:0.80, type:'Partial' }
    ],
    notes:'UFC-only bantamweight champion case: perfect UFC start, dominant control, and clean Peña title win, capped by only three UFC fights and zero defenses.'
  };

  const packet = {
    status:{ stage:'complete first-pass packet; UFC bantamweight title case, win ledger, loss context, round-control rows, compare seasoning, fight ledger, and Watch Moment included', lastUpdated:'2026-07-06', nextFix:'Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild.' },
    repoLocations:{ scoreSource:'assets/data/fighter-packets/kayla-harrison.js', centralPacket:'assets/data/fighter-packets/kayla-harrison.js', watchMoment:'assets/js/watch-moments.js', tracker:'docs/fighter-status.md', photos:'No real photo files loaded yet; app should use initials fallback.' },
    photos:{},
    rounds,
    boardRow,
    profile,
    display:{
      divisionLabel:'WBW', resumeTag:'Bantamweight title force',
      oneLiner:'A current UFC bantamweight champion with dominant grappling control and a perfect UFC record, but only three UFC fights keep the score capped.',
      snapshot:[ ['UFC Record','3-0'], ['UFC Title-Fight Wins','1 official / 1.00 adjusted'], ['Apex Peak','+3.85'], ['Quality Wins','Peña, Vieira, Holm'],  ['Prime Dominance','17.70 / 30'], ['Rounds Won','85.7% best-effort'], ['Loss Context','0.00'] ],
      whyRankedHere:'Harrison scores as a real UFC champion because she beat Peña for the belt, dominated Holm, beat Vieira, and has no UFC loss penalty.',
      whyNotHigher:'The cap is pure UFC volume. She has only three UFC fights, one title-fight win, and zero defenses. PFL and Olympic greatness are context only and cannot carry the UFC-only score.',
      bigAssumptions:[ ['Adjusted title wins','Peña title win is 1.00 because it was a clean undisputed title win over the reigning champion.'], ['Quality Wins cap','Peña is 1.00. Vieira and Holm are 0.80 each; Holm is timing-discounted.'], ['Prime window','Prime starts immediately at Holly Holm because the UFC debut was title-relevant.'], ['Non-UFC exclusion','Olympic gold medals, PFL title runs, and Pacheco loss are context only, not scored.'], ['Nunes fight','Amanda Nunes is not scored because the fight has not happened.'], ['Photos','No photo paths until real files exist in assets/fighters/.'] ],
      keyJudgmentCalls:[ ['Tiny UFC sample','Dominance is real, but Quality Wins and Longevity stay low because the UFC résumé is only three fights.'], ['Current WBW strength','Women’s bantamweight is historically important but not max-depth in this current window.'], ['Clean loss context','No UFC losses means no penalty.'], ['Dominance vs volume','She gets strong Prime Dominance, but the total score stays capped by UFC-only volume.'] ],
      apexPeakSummary:{ score:3.85, window:'Holm debut through Peña title win', components:{ peakStatus:1.05, eliteOpponentProof:0.90, separationDominance:0.95, divisionStrength:0.35, cleanApexAura:0.60 }, notes:'Harrison has a real current-champion peak claim and dominant control, but the UFC sample is too small and current bantamweight depth is not max strength.' },
      primeDominanceSummary:{ score:17.70, components:{ primeRecord:4.00, primeRoundsWon:4.75, titleDefenseDominance:0.00, finishStoppageDominance:3.60, lossSafetyDurability:4.00, divisionStrength:1.35 }, notes:'Perfect UFC record and strong control create a high dominance score, but no title-defense stack keeps it from getting into long-reign territory.' },
      finalTakeaway:'Kayla is a dangerous current-champion UFC-only case: dominant and clean, but still waiting on the title-defense volume that would push her higher.'
    },
    profileStats:{ ufcRecord:'3-0', titleFightWins:1, adjustedTitleWins:1.00, eliteWins:1,  primeDominance:17.70, finishRatePct:66.7, roundsWonPct:85.7, activeEliteYears:2.50, apexPeak:3.85, timesFinishedPrime:0, divisionStrengthContext:'Women’s bantamweight has historical importance, but the current UFC depth is not treated as max strength.', lossContext:'No UFC losses. Non-UFC losses and accomplishments are excluded from UFC-only scoring.' },
    compareSeasoning:{
      shortCase:'Harrison is the clean short-window champion case: dominant UFC grappling, a Peña title win, Holm/Vieira support, and no UFC losses.',
      peak:'At her best in the UFC, Harrison has looked physically overwhelming with top-control, judo entries, and submission threat.',
      resume:'The UFC resume is tiny but clean. The model rewards the title win and dominance while heavily capping non-UFC accomplishments.',
      championship:'One UFC bantamweight title win, no defenses yet, with a clean 1.00 adjusted title win over Peña.',
      opponentQuality:'Peña is the anchor. Vieira and Holm are useful support, but the win ledger is only three fights deep.',
      longevity:'Her UFC elite window starts in 2024. That is the main cap on the case.',
      counter:'The counterargument is simple: three UFC fights is not enough volume to compete with long-reign UFC champions yet.',
      edge:'Harrison wins comparisons when clean dominance, no UFC losses, and current-title value outweigh résumé volume.',
      eliteCounter:false,
      signatureWins:'Julianna Peña, Ketlen Vieira, Holly Holm.',
      weakness:'Only three UFC fights and zero title defenses.',
      titleSummary:'One-time UFC bantamweight champion with one official and adjusted title-fight win.',
      primeSummary:'3-0 UFC prime from Holm through Peña/current champ phase.',
      bestArgument:'The best argument is that every UFC data point so far points to elite champion-level dominance.',
      titleStyle:'Short-Window Bantamweight Champion', primeStyle:'Dominant Grappling Arrival',
      legacyStats:{ ufcRecord:'3-0', titleFightWins:1, adjustedTitleWins:1.00, beltsWon:1, titleDefenses:0, activeEliteYearsLabel:'roughly 2.5 active elite years', primeNote:'Holm-through-current UFC bantamweight champion window; non-UFC résumé excluded' }
    },
    fightLedger:{
      'julianna pena|kayla harrison':{ fighters:['Julianna Peña','Kayla Harrison'], fights:1, winner:'Kayla Harrison', importance:'major', summary:'Harrison submitted Peña to win the UFC bantamweight title. This is the anchor of Harrison’s UFC-only championship case.' },
      'holly holm|kayla harrison':{ fighters:['Holly Holm','Kayla Harrison'], fights:1, winner:'Kayla Harrison', importance:'notable', summary:'Harrison dominated and submitted Holm in her UFC debut, immediately proving she belonged in the title picture.' },
      'kayla harrison|ketlen vieira':{ fighters:['Kayla Harrison','Ketlen Vieira'], fights:1, winner:'Kayla Harrison', importance:'notable', summary:'Harrison beat Vieira as the ranked contender bridge between her UFC debut and title win.' }
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
