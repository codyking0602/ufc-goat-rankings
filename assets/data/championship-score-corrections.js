// Championship audit score corrections.
// Applies locked Championship Index formula corrections after base data and additions load.
(function(){
  const VERSION = 'championship-score-corrections-20260703a';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const corrections = {
    'Matt Hughes': {
      championship: 17.09,
      totalScore: 48.09,
      adjustedTitleWins: 9.00,
      titleNotes: 'Championship audit locked Hughes old-era title treatment as normal. Formula index = 9.00; Championship score = 17.09.'
    },
    'Charles Oliveira': {
      championship: 4.56,
      totalScore: 39.37,
      adjustedTitleWins: 2.40,
      titleNotes: 'Championship audit: Chandler vacant title = 0.90, Poirier defense = 1.00, Gaethje stripped-title context = 0.50. Total title-level credit = 2.40.'
    },
    'Aljamain Sterling': {
      championship: 6.65,
      totalScore: 41.50,
      adjustedTitleWins: 3.50,
      titleNotes: 'Championship audit: Yan DQ title win = 0.50; Yan rematch, T.J. Dillashaw defense, and Henry Cejudo defense = 1.00 each. Total title-fight wins = 4; adjusted title wins = 3.50.'
    },
    'T.J. Dillashaw': {
      championship: 9.49,
      totalScore: 38.99,
      adjustedTitleWins: 5.00,
      titleNotes: 'Championship audit: five UFC bantamweight title-fight wins count full in Championship. EPO/vacated-belt context is handled outside Championship.'
    },
    'Frankie Edgar': {
      championship: 5.70,
      totalScore: 33.85,
      adjustedTitleWins: 3.00,
      titleNotes: 'Championship audit: three normal UFC lightweight title-fight wins. Adjusted title wins = 3.00.'
    },
    'Dustin Poirier': {
      championship: 1.42,
      totalScore: 37.22,
      adjustedTitleWins: 0.75,
      titleNotes: 'Championship audit: interim UFC lightweight title win vs Max Holloway = 0.75. BMF bouts and title-challenge losses do not add Championship credit.'
    },
    'Justin Gaethje': {
      championship: 4.75,
      totalScore: 34.05,
      adjustedTitleWins: 2.50,
      titleNotes: 'Championship audit: locked working index remains 2.50 pending final title-count verification. BMF bouts do not add Championship credit.'
    }
  };

  function patchRow(row){
    if(!row || !corrections[row.fighter]) return;
    const c = corrections[row.fighter];
    row.championship = c.championship;
    row.totalScore = c.totalScore;
    if(row.title){
      row.title.adjustedTitleWins = c.adjustedTitleWins;
      row.title.notes = c.titleNotes;
    } else {
      row.title = { adjustedTitleWins: c.adjustedTitleWins, notes: c.titleNotes };
    }
  }

  [...(DATA.men || []), ...(DATA.women || []), ...(DATA.fighters || [])].forEach(patchRow);

  function sortBoard(board){
    if(!Array.isArray(board)) return;
    board.sort((a,b) => Number(b.totalScore || 0) - Number(a.totalScore || 0));
    board.forEach((row,index) => { row.rank = index + 1; });
  }

  sortBoard(DATA.men);
  sortBoard(DATA.women);

  const rankByFighter = new Map([...(DATA.men || []), ...(DATA.women || [])].map(row => [row.fighter, row.rank]));
  (DATA.fighters || []).forEach(profile => {
    if(rankByFighter.has(profile.fighter)) profile.rank = rankByFighter.get(profile.fighter);
  });

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    rankByFighter.forEach((rank,fighter) => {
      if(!DISPLAY_OVERRIDES[fighter]) return;
      DISPLAY_OVERRIDES[fighter].allTimeRank = rank;
      if(DISPLAY_OVERRIDES[fighter].categories?.championship){
        delete DISPLAY_OVERRIDES[fighter].categories.championship;
      }
    });
  }

  window.UFC_CHAMPIONSHIP_SCORE_CORRECTIONS = {
    version: VERSION,
    fighters: Object.keys(corrections),
    corrections,
    appliedAt: new Date().toISOString()
  };
})();
