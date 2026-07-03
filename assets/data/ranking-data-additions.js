// Permanent ranking/profile additions layered onto the base ranking payload.
(function(){
  const VERSION = 'ranking-data-additions-20260703a-frankie-edgar';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const ADDITIONS = [
    {
      boardRow: {
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
      },
      profile: {
        id: 'JG001', fighter: 'Justin Gaethje', gender: 'Men', primaryDivision: 'Lightweight', secondaryDivision: '', scope: 'UFC', ufcRecord: '12-5', ufcWins: 12, ufcLosses: 5, scoredUfcFights: 17, finishWins: 9, finishRatePct: 75.0, timesFinishedPrime: 5, lossPenalty: -10.0, activeEliteYears: 7.0, primeStart: 'Tony Ferguson 2020', primeEnd: 'active/title-level window', notes: 'UFC-only. WSOF context is not scored. Penalty is capped at -10.', rank: 22, totalScore: 36.3, championship: 7.0, opponentQuality: 13.2, primeDominance: 18.0, longevity: 8.1, penalty: -10.0, leaderboard: 'men',
        title: { normalTitleWins: 1.0, interimTitleWins: 2.0, vacantUndisputedWins: 0.0, secondDivisionUndisputedWins: 0.0, vacantSecondDivisionWins: 0.0, adjustedTitleWins: 2.5, notes: 'Undisputed lightweight title win plus two interim/title-level wins. Total title-fight wins = 3.' },
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
      }
    },
    {
      boardRow: {
        rank: 25,
        fighter: 'Frankie Edgar',
        totalScore: 34.95,
        championship: 6.8,
        opponentQuality: 12.7,
        primeDominance: 16.45,
        longevity: 9.0,
        penalty: -10.0,
        leaderboard: 'men',
        gender: 'Men',
        ufcRecord: '18-11-1',
        primaryDivision: 'Lightweight',
        secondaryDivision: 'Featherweight / Bantamweight',
        finishRatePct: 38.9,
        activeEliteYears: 10.0,
        timesFinishedPrime: 2,
        primeRecord: '9-6-1 in LW/FW title-level window',
        roundsWonPct: 56.0,
        notes: 'Permanent hand-added row. UFC-only lightweight champion and three-division elite longevity case; late losses capped by post-prime context and -10 max penalty.'
      },
      profile: {
        id: 'FE001',
        fighter: 'Frankie Edgar',
        gender: 'Men',
        primaryDivision: 'Lightweight',
        secondaryDivision: 'Featherweight / Bantamweight',
        scope: 'UFC',
        ufcRecord: '18-11-1',
        ufcWins: 18,
        ufcLosses: 11,
        ufcDraws: 1,
        scoredUfcFights: 30,
        finishWins: 7,
        finishRatePct: 38.9,
        timesFinishedPrime: 2,
        lossPenalty: -10.0,
        activeEliteYears: 10.0,
        primeStart: 'B.J. Penn 2010',
        primeEnd: 'Brian Ortega 2018',
        notes: 'UFC-only. Lightweight title reign and featherweight contender run are scored. Late bantamweight losses are treated as post-prime context.',
        rank: 25,
        totalScore: 34.95,
        championship: 6.8,
        opponentQuality: 12.7,
        primeDominance: 16.45,
        longevity: 9.0,
        penalty: -10.0,
        leaderboard: 'men',
        title: {
          normalTitleWins: 3.0,
          interimTitleWins: 0.0,
          vacantUndisputedWins: 0.0,
          secondDivisionUndisputedWins: 0.0,
          vacantSecondDivisionWins: 0.0,
          adjustedTitleWins: 3.0,
          notes: 'UFC lightweight title win over B.J. Penn, title defense over Penn, and title defense over Gray Maynard. The Maynard draw is context only, not a title win.'
        },
        opponents: [
          { opponent: 'B.J. Penn', date: '2010-04-10', division: 'Lightweight', context: 'Won UFC lightweight title from an all-time great', credit: 1.0, type: 'Full' },
          { opponent: 'B.J. Penn 2', date: '2010-08-28', division: 'Lightweight', context: 'Decisive UFC lightweight title defense', credit: 0.95, type: 'Full' },
          { opponent: 'Gray Maynard', date: '2011-10-08', division: 'Lightweight', context: 'UFC lightweight title defense and rivalry finish', credit: 0.9, type: 'Full' },
          { opponent: 'Chad Mendes', date: '2015-12-11', division: 'Featherweight', context: 'Elite featherweight knockout win', credit: 0.9, type: 'Full' },
          { opponent: 'Cub Swanson', date: '2014-11-22', division: 'Featherweight', context: 'Elite featherweight submission win', credit: 0.8, type: 'Full' },
          { opponent: 'Charles Oliveira', date: '2013-07-06', division: 'Featherweight', context: 'Quality win over future lightweight champion', credit: 0.75, type: 'Partial' },
          { opponent: 'Urijah Faber', date: '2015-05-16', division: 'Featherweight', context: 'High-level veteran name win', credit: 0.7, type: 'Partial' },
          { opponent: 'Sean Sherk', date: '2009-05-23', division: 'Lightweight', context: 'Former champion / ranked lightweight win', credit: 0.65, type: 'Partial' },
          { opponent: 'Jeremy Stephens', date: '2016-11-12', division: 'Featherweight', context: 'Ranked featherweight win', credit: 0.55, type: 'Partial' },
          { opponent: 'Tyson Griffin', date: '2007-02-03', division: 'Lightweight', context: 'Strong early UFC win', credit: 0.5, type: 'Partial' }
        ],
        rounds: [
          { opponent: 'B.J. Penn', method: 'Title win', roundsWon: 3, roundsCounted: 5 },
          { opponent: 'B.J. Penn 2', method: 'Title defense win', roundsWon: 5, roundsCounted: 5 },
          { opponent: 'Gray Maynard 2', method: 'Title draw', roundsWon: 2, roundsCounted: 5 },
          { opponent: 'Gray Maynard 3', method: 'Title defense win', roundsWon: 2, roundsCounted: 4 },
          { opponent: 'Benson Henderson', method: 'Title loss', roundsWon: 2, roundsCounted: 5 },
          { opponent: 'Jose Aldo', method: 'Title loss', roundsWon: 2, roundsCounted: 5 },
          { opponent: 'Chad Mendes', method: 'KO win', roundsWon: 1, roundsCounted: 1 },
          { opponent: 'Max Holloway', method: 'Title loss', roundsWon: 1, roundsCounted: 5 },
          { opponent: 'Brian Ortega', method: 'KO loss', roundsWon: 0, roundsCounted: 1 }
        ]
      }
    }
  ];

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
    const names = [];
    ADDITIONS.forEach(item => {
      upsertByFighter(DATA.men, item.boardRow);
      upsertByFighter(DATA.fighters, item.profile);
      names.push(item.boardRow.fighter);
    });
    if(Array.isArray(DATA.men)) DATA.men.sort((a,b)=>Number(a.rank||999)-Number(b.rank||999) || Number(b.totalScore||0)-Number(a.totalScore||0));
    DATA.meta = { ...(DATA.meta || {}), handAddedFighters: Array.from(new Set([...(DATA.meta?.handAddedFighters || []), ...names])) };
    refreshCompareOptions();
    if(typeof refresh === 'function') refresh();
    window.UFC_RANKING_DATA_ADDITIONS = { version: VERSION, fighters: names, appliedAt: new Date().toISOString() };
  }

  apply();
})();