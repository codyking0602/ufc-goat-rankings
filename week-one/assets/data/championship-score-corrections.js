// Championship audit score corrections.
// Applies locked Championship Index formula corrections after base data and additions load.
(function(){
  const VERSION = 'championship-score-corrections-20260706d-women-display-ranks';
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
      titleNotes: 'Championship audit: Tony Ferguson interim title = 0.75, Paddy Pimblett interim title = 0.75, Ilia Topuria undisputed lightweight title = 1.00. BMF bouts do not add Championship credit.'
    },
    'Dan Henderson': {
      championship: 0.95,
      totalScore: 25.65,
      adjustedTitleWins: 0.50,
      titleNotes: 'Championship audit: no UFC undisputed title wins. UFC 17 tournament gets small old-era tournament credit of 0.50, not modern title-win credit.'
    },
    'Zhang Weili': {
      championship: 15.60,
      totalScore: 53.97,
      adjustedTitleWins: 6.00,
      titleNotes: 'Championship audit: Zhang has six UFC strawweight title-fight wins and two reigns, which is clearly elite and above normal strawweight title cases. It should not outrank Amanda Nunes or Valentina Shevchenko, who each have 11 UFC title-fight wins and stronger long-reign championship volume.'
    }
  };

  const womenChampionshipDisplay = {
    'Amanda Nunes': { rank: 1, ovr: 99 },
    'Valentina Shevchenko': { rank: 2, ovr: 96 },
    'Zhang Weili': { rank: 3, ovr: 93 },
    'Joanna Jedrzejczyk': { rank: 4, ovr: 90 },
    'Ronda Rousey': { rank: 5, ovr: 88 },
    'Rose Namajunas': { rank: 6, ovr: 86 },
    'Julianna Peña': { rank: 7, ovr: 82 },
    'Carla Esparza': { rank: 8, ovr: 80 },
    'Alexa Grasso': { rank: 9, ovr: 78 },
    'Jessica Andrade': { rank: 10, ovr: 74 },
    'Kayla Harrison': { rank: 11, ovr: 73 },
    'Holly Holm': { rank: 12, ovr: 72 },
    'Miesha Tate': { rank: 13, ovr: 71 },
    'Mackenzie Dern': { rank: 14, ovr: 68 }
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

    Object.entries(womenChampionshipDisplay).forEach(([fighter, championship]) => {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].categories = DISPLAY_OVERRIDES[fighter].categories || {};
      DISPLAY_OVERRIDES[fighter].categories.championship = {
        ...championship,
        reason: 'Women’s Championship Resume display rank calibrated by UFC title-fight volume, adjusted title wins, defenses/reigns, and title-path context.'
      };
    });
  }

  window.UFC_CHAMPIONSHIP_SCORE_CORRECTIONS = {
    version: VERSION,
    fighters: Object.keys(corrections),
    corrections,
    womenChampionshipDisplay,
    appliedAt: new Date().toISOString()
  };
})();