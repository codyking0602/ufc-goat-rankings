// Longevity score corrections for active 37 fighters.
// Applies Cody-approved revised Longevity formula after Prime Dominance corrections and before score-derived OVR.
(function(){
  const VERSION = 'longevity-score-corrections-20260705a';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const FORMULA = 'Active Elite Years / 9 + Elite Relevance Spread / 3 + Late Elite Continuity / 2 + UFC Career Staying Power / 1';

  const corrections = {
    'Max Holloway': { longevity: 15.00, active: 9.00, spread: 3.00, late: 2.00, career: 1.00, notes: 'Huge UFC fight count plus long elite/post-title relevance.' },
    'Frankie Edgar': { longevity: 15.00, active: 9.00, spread: 3.00, late: 2.00, career: 1.00, notes: 'Maxed because he has elite proof plus huge UFC fight count.' },
    'Jose Aldo': { longevity: 14.36, active: 8.61, spread: 3.00, late: 2.00, career: 0.75, notes: 'WEC excluded, but UFC-only FW/BW relevance stays long.' },
    'Jon Jones': { longevity: 14.25, active: 9.00, spread: 3.00, late: 1.50, career: 0.75, notes: 'HW relevance counts per Cody, but not as a full second chapter.' },
    'Dustin Poirier': { longevity: 13.99, active: 7.99, spread: 3.00, late: 2.00, career: 1.00, notes: 'Staying-power tweak helps Dustin exactly as intended.' },
    'Randy Couture': { longevity: 13.77, active: 8.02, spread: 3.00, late: 2.00, career: 0.75, notes: 'Era-spanning UFC title relevance and long career.' },
    'Georges St-Pierre': { longevity: 13.67, active: 8.42, spread: 3.00, late: 1.50, career: 0.75, notes: 'Bisping counts, but retirement gap is not active elite time.' },
    'Matt Hughes': { longevity: 13.39, active: 7.89, spread: 3.00, late: 1.50, career: 1.00, notes: 'Long early-WW title control, many UFC fights, and years as the division standard.' },
    'Valentina Shevchenko': { longevity: 13.15, active: 7.65, spread: 3.00, late: 2.00, career: 0.50, notes: 'Long elite women\'s UFC title relevance with solid career length.' },
    'Amanda Nunes': { longevity: 12.48, active: 6.98, spread: 3.00, late: 2.00, career: 0.50, notes: 'Pena revenge keeps late continuity high; career count is solid, not huge.' },
    'Stipe Miocic': { longevity: 12.15, active: 7.40, spread: 2.50, late: 1.50, career: 0.75, notes: 'Jones late fight excluded per Cody. Career bonus rewards 20 UFC fights.' },
    'Justin Gaethje': { longevity: 11.98, active: 6.98, spread: 2.50, late: 2.00, career: 0.50, notes: 'Current-table title value keeps late score high; career count is solid.' },
    'Demetrious Johnson': { longevity: 11.87, active: 6.87, spread: 3.00, late: 1.50, career: 0.50, notes: 'UFC-only; ONE does not extend score.' },
    'Aljamain Sterling': { longevity: 11.73, active: 6.98, spread: 2.50, late: 1.50, career: 0.75, notes: 'BW title run plus FW extension and long UFC fight count.' },
    'Anderson Silva': { longevity: 11.62, active: 7.12, spread: 3.00, late: 0.50, career: 1.00, notes: 'Huge UFC fight count gets career credit, but post-title proof remains limited.' },
    'Daniel Cormier': { longevity: 11.51, active: 7.01, spread: 2.50, late: 1.50, career: 0.50, notes: 'Compact UFC window, but strong two-division title relevance.' },
    'Israel Adesanya': { longevity: 11.16, active: 6.66, spread: 2.50, late: 1.50, career: 0.50, notes: 'Strong active title-heavy middleweight window and real Pereira title-regain proof point.' },
    'B.J. Penn': { longevity: 10.80, active: 6.30, spread: 2.50, late: 1.00, career: 1.00, notes: 'Long UFC career gets credit, but late collapse is not elite relevance.' },
    'Cain Velasquez': { longevity: 10.79, active: 7.29, spread: 2.50, late: 0.50, career: 0.50, notes: 'Strong active elite span, but injuries and back-end losses limit late continuity.' },
    'T.J. Dillashaw': { longevity: 10.64, active: 6.64, spread: 2.50, late: 1.00, career: 0.50, notes: 'Sandhagen helps late continuity; EPO/suspension gap caps it.' },
    'Alexander Volkanovski': { longevity: 10.28, active: 6.78, spread: 2.50, late: 0.50, career: 0.50, notes: 'Strong FW title window, but not a long post-title winning chapter.' },
    'Petr Yan': { longevity: 10.28, active: 6.28, spread: 2.50, late: 1.00, career: 0.50, notes: 'Solid but compact modern BW window.' },
    'Joanna Jedrzejczyk': { longevity: 9.85, active: 5.85, spread: 2.50, late: 1.00, career: 0.50, notes: 'Title relevance after belt loss, but no full late winning chapter.' },
    'Kamaru Usman': { longevity: 9.83, active: 6.33, spread: 2.50, late: 0.50, career: 0.50, notes: 'Strong compact WW title window; post-title proof limited.' },
    'Chuck Liddell': { longevity: 9.60, active: 5.85, spread: 2.50, late: 0.50, career: 0.75, notes: 'Career bonus helps Chuck\'s long UFC presence, but late KO losses are not elite value.' },
    'Dan Henderson': { longevity: 9.30, active: 6.30, spread: 2.00, late: 0.50, career: 0.50, notes: 'UFC-only Hendo gets long presence credit, but non-UFC greatness is excluded and no UFC undisputed title win caps the case.' },
    'Francis Ngannou': { longevity: 9.20, active: 4.95, spread: 2.50, late: 1.50, career: 0.25, notes: 'Strong HW title-era spread and real late improvement chapter; UFC exit caps career staying power.' },
    'Dominick Cruz': { longevity: 9.15, active: 5.40, spread: 2.00, late: 1.50, career: 0.25, notes: 'Dillashaw comeback matters, but low UFC fight count and WEC exclusion cap it.' },
    'Merab Dvalishvili': { longevity: 8.90, active: 5.40, spread: 2.00, late: 1.00, career: 0.50, notes: 'Useful active elite years and modern BW depth, but title run is still building.' },
    'Islam Makhachev': { longevity: 8.63, active: 5.13, spread: 2.00, late: 1.00, career: 0.50, notes: 'Solid UFC career bonus, but elite window is still building.' },
    'Khabib Nurmagomedov': { longevity: 8.57, active: 6.32, spread: 2.00, late: 0.00, career: 0.25, notes: 'Normal UFC run bonus, but still not a Longevity case.' },
    'Charles Oliveira': { longevity: 8.50, active: 4.50, spread: 2.00, late: 1.00, career: 1.00, notes: 'Long UFC career gets respect without overstating elite years.' },
    'Alex Pereira': { longevity: 7.79, active: 4.04, spread: 2.00, late: 1.50, career: 0.25, notes: 'Real two-division late-continuity credit, but short UFC elite window and normal career count.' },
    'Henry Cejudo': { longevity: 7.25, active: 4.50, spread: 2.00, late: 0.50, career: 0.25, notes: 'Loud achievements, compact active elite window.' },
    'Conor McGregor': { longevity: 5.13, active: 3.38, spread: 1.50, late: 0.00, career: 0.25, notes: 'Star power is profile context, not Longevity. Normal UFC run bonus only.' },
    'Ilia Topuria': { longevity: 5.08, active: 3.58, spread: 1.50, late: 0.00, career: 0.00, notes: 'Peak and quality wins are loud, but UFC elite window and fight count are still short.' },
    'Ronda Rousey': { longevity: 4.88, active: 3.38, spread: 1.50, late: 0.00, career: 0.00, notes: 'Massive UFC impact, but short UFC fight count and short elite window.' }
  };

  function round2(value){
    return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  }

  function recalcTotal(row){
    return round2(
      Number(row.championship || 0) +
      Number(row.opponentQuality || 0) +
      Number(row.primeDominance || 0) +
      Number(row.longevity || 0) +
      Number(row.penalty || 0)
    );
  }

  function patchRow(row){
    if(!row || !corrections[row.fighter]) return;
    const c = corrections[row.fighter];
    row.longevity = c.longevity;
    row.totalScore = recalcTotal(row);
    row.longevityNotes = c.notes;
    row.longevityAudit = {
      score: c.longevity,
      formula: FORMULA,
      components: {
        activeEliteYears: c.active,
        eliteRelevanceSpread: c.spread,
        lateEliteContinuity: c.late,
        ufcCareerStayingPower: c.career
      },
      notes: c.notes,
      source: 'Longevity active-37 revised worksheet',
      version: VERSION
    };
  }

  [...(DATA.men || []), ...(DATA.women || []), ...(DATA.fighters || [])].forEach(patchRow);

  function sortBoard(board){
    if(!Array.isArray(board)) return;
    board.sort((a,b) => Number(b.totalScore || 0) - Number(a.totalScore || 0));
    board.forEach((row,index) => { row.rank = index + 1; });
  }

  sortBoard(DATA.men);
  sortBoard(DATA.women);

  const boardRows = [...(DATA.men || []), ...(DATA.women || [])];
  const rankByFighter = new Map(boardRows.map(row => [row.fighter, row.rank]));
  const scoreByFighter = new Map(boardRows.map(row => [row.fighter, row.totalScore]));
  const longevityByFighter = new Map(boardRows.map(row => [row.fighter, row.longevity]));

  (DATA.fighters || []).forEach(profile => {
    if(rankByFighter.has(profile.fighter)) profile.rank = rankByFighter.get(profile.fighter);
    if(scoreByFighter.has(profile.fighter)) profile.totalScore = scoreByFighter.get(profile.fighter);
    if(longevityByFighter.has(profile.fighter)) profile.longevity = longevityByFighter.get(profile.fighter);
  });

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    rankByFighter.forEach((rank,fighter) => {
      if(!DISPLAY_OVERRIDES[fighter]) return;
      DISPLAY_OVERRIDES[fighter].allTimeRank = rank;
      if(DISPLAY_OVERRIDES[fighter].categories?.longevity){
        delete DISPLAY_OVERRIDES[fighter].categories.longevity;
      }
      DISPLAY_OVERRIDES[fighter].longevityAudit = corrections[fighter] || DISPLAY_OVERRIDES[fighter].longevityAudit;
    });
  }

  window.UFC_LONGEVITY_SCORE_CORRECTIONS = {
    version: VERSION,
    fighters: Object.keys(corrections),
    formula: FORMULA,
    corrections,
    appliedAt: new Date().toISOString()
  };
})();
