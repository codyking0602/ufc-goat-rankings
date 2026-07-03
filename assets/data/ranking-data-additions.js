// Permanent ranking/profile additions layered onto the base ranking payload.
(function(){
  const VERSION = 'ranking-data-additions-20260702a-justin-gaethje';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const GAETHJE_BOARD_ROW = {
    rank: 22,
    fighter: 'Justin Gaethje',
    totalScore: 36.3,
    championship: 7.0,
    opponentQuality: 13.2,
    primeDominance: 18.0,
    longevity: 8.1,
    penalty: -10.0,
    leaderboard: 'men',
    gender: 'Men',
    ufcRecord: '12-5',
    primaryDivision: 'Lightweight',
    secondaryDivision: '',
    finishRatePct: 75.0,
    activeEliteYears: 7.0,
    timesFinishedPrime: 5,
    primeRecord: '9-5 in title/elite window',
    roundsWonPct: 58.5,
    notes: 'Permanent hand-added row. UFC-only lightweight title value, modern lightweight strength, and capped penalty context.'
  };

  const GAETHJE_PROFILE_ROW = {
    id: 'JG001',
    fighter: 'Justin Gaethje',
    gender: 'Men',
    primaryDivision: 'Lightweight',
    secondaryDivision: '',
    scope: 'UFC',
    ufcRecord: '12-5',
    ufcWins: 12,
    ufcLosses: 5,
    scoredUfcFights: 17,
    finishWins: 9,
    finishRatePct: 75.0,
    timesFinishedPrime: 5,
    lossPenalty: -10.0,
    activeEliteYears: 7.0,
    primeStart: 'Tony Ferguson 2020',
    primeEnd: 'active/title-level window',
    notes: 'UFC-only. WSOF context is not scored. Penalty is capped at -10.',
    rank: 22,
    totalScore: 36.3,
    championship: 7.0,
    opponentQuality: 13.2,
    primeDominance: 18.0,
    longevity: 8.1,
    penalty: -10.0,
    leaderboard: 'men',
    title: {
      normalTitleWins: 1.0,
      interimTitleWins: 2.0,
      vacantUndisputedWins: 0.0,
      secondDivisionUndisputedWins: 0.0,
      vacantSecondDivisionWins: 0.0,
      adjustedTitleWins: 2.5,
      notes: 'Undisputed lightweight title win plus two interim/title-level wins. Total title-fight wins = 3.'
    },
    opponents: [
      { opponent: 'Ilia Topuria', date: '2026-06-14', division: 'Lightweight', context: 'Undisputed lightweight title result', credit: 1.2, type: 'Full' },
      { opponent: 'Tony Ferguson', date: '2020-05-09', division: 'Lightweight', context: 'Interim lightweight title result', credit: 1.0, type: 'Full' },
      { opponent: 'Dustin Poirier', date: '2023-07-29', division: 'Lightweight', context: 'Elite lightweight rematch result', credit: 1.0, type: 'Full' },
      { opponent: 'Paddy Pimblett', date: '2026-01-24', division: 'Lightweight', context: 'Interim lightweight title result', credit: 0.8, type: 'Partial' },
      { opponent: 'Michael Chandler', date: '2021-11-06', division: 'Lightweight', context: 'Ranked lightweight result', credit: 0.8, type: 'Partial' },
      { opponent: 'Rafael Fiziev', date: '2023-03-18', division: 'Lightweight', context: 'Modern ranked lightweight result', credit: 0.75, type: 'Partial' },
      { opponent: 'Edson Barboza', date: '2019-03-30', division: 'Lightweight', context: 'Ranked lightweight result', credit: 0.7, type: 'Partial' },
      { opponent: 'Donald Cerrone', date: '2019-09-14', division: 'Lightweight', context: 'Veteran ranked-name UFC result', credit: 0.55, type: 'Partial' },
      { opponent: 'Michael Johnson', date: '2017-07-07', division: 'Lightweight', context: 'UFC debut result', credit: 0.45, type: 'Partial' }
    ],
    rounds: [
      { opponent: 'Ilia Topuria', method: 'Win', roundsWon: 2, roundsCounted: 2 },
      { opponent: 'Tony Ferguson', method: 'Win', roundsWon: 4, roundsCounted: 5 },
      { opponent: 'Dustin Poirier 2', method: 'Win', roundsWon: 1, roundsCounted: 2 },
      { opponent: 'Michael Chandler', method: 'Decision win', roundsWon: 2, roundsCounted: 3 },
      { opponent: 'Rafael Fiziev', method: 'Decision win', roundsWon: 2, roundsCounted: 3 },
      { opponent: 'Khabib Nurmagomedov', method: 'Loss', roundsWon: 0, roundsCounted: 2 },
      { opponent: 'Charles Oliveira', method: 'Loss', roundsWon: 0, roundsCounted: 1 },
      { opponent: 'Max Holloway', method: 'Loss', roundsWon: 1, roundsCounted: 5 }
    ]
  };

  function upsertByFighter(rows,row){
    if(!Array.isArray(rows) || !row?.fighter) return;
    const index = rows.findIndex(x => x?.fighter === row.fighter);
    if(index >= 0){ rows[index] = { ...rows[index], ...row }; return; }
    rows.push(row);
  }
  function refreshCompareOptions(){
    const names = [...(DATA.fighters || [])].map(f => f.fighter).filter(Boolean).sort((a,b) => a.localeCompare(b));
    ['fighterA','fighterB'].forEach(id => {
      const select = document.getElementById(id);
      if(!select) return;
      const current = select.value;
      select.innerHTML = '';
      names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
      select.value = names.includes(current) ? current : (id === 'fighterA' ? 'Jon Jones' : 'Georges St-Pierre');
    });
  }
  function apply(){
    upsertByFighter(DATA.men, GAETHJE_BOARD_ROW);
    upsertByFighter(DATA.fighters, GAETHJE_PROFILE_ROW);
    if(Array.isArray(DATA.men)) DATA.men.sort((a,b)=>Number(a.rank||999)-Number(b.rank||0) || Number(b.totalScore||0)-Number(a.totalScore||0));
    DATA.meta = { ...(DATA.meta || {}), handAddedFighters: Array.from(new Set([...(DATA.meta?.handAddedFighters || []), 'Justin Gaethje'])) };
    refreshCompareOptions();
    if(typeof refresh === 'function') refresh();
    window.UFC_RANKING_DATA_ADDITIONS = { version: VERSION, fighters: ['Justin Gaethje'], appliedAt: new Date().toISOString() };
  }

  apply();
})();