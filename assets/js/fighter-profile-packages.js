// Durable fighter profile stat packages.
// Add each locked fighter snapshot and opponent display priority here.
(function(){
  const DATA = window.RANKING_DATA;
  const VERSION = 'fighter-profile-packages-20260710a-canonical-prime-record';
  if(!DATA || typeof DISPLAY_OVERRIDES === 'undefined') return;

  const PROFILE_PACKAGES = {
    'Georges St-Pierre': {
      stats: {
        ufcRecord: '20-2',
        titleFightWins: 13,
        eliteWins: 14,

        finishRatePct: 36.4,
        roundsWonPct: 85.9,
        activeEliteYears: 9.15,
        timesFinishedPrime: 1
      },
      photoPosition: 'center top',
      priority: {
        'Matt Hughes': 1,
        'B.J. Penn': 2,
        'Michael Bisping': 3,
        'Johny Hendricks': 4,
        'Jon Fitch': 5,
        'Carlos Condit': 6,
        'Jake Shields': 7,
        'Thiago Alves': 8,
        'Nick Diaz': 9,
        'Josh Koscheck': 10,
        'Matt Serra': 11,
        'Dan Hardy': 12,
        'Sean Sherk': 13,
        'Frank Trigg': 14,
        'Karo Parisyan': 15,
        'Jason Miller': 16,
        'Jay Hieron': 17
      }
    },

    'Demetrious Johnson': {
      stats: {
        ufcRecord: '15-2-1',
        titleFightWins: 12,
        eliteWins: 8,

        finishRatePct: 43.8,
        roundsWonPct: 73.9,
        activeEliteYears: 6.84,
        timesFinishedPrime: 0
      },
      photoPosition: 'center top',
      priority: {
        'Dominick Cruz': 1,
        'Henry Cejudo': 2,
        'Joseph Benavidez': 3,
        'John Dodson': 4,
        'Kyoji Horiguchi': 5,
        'Miguel Torres': 6,
        'Ian McCall': 7,
        'Ray Borg': 8,
        'Ali Bagautinov': 9,
        'Wilson Reis': 10,
        'John Moraga': 11,
        'Tim Elliott': 12,
        'Chris Cariaso': 13,
        'Kid Yamamoto': 14
      }
    },

    'Anderson Silva': {
      stats: {
        ufcRecord: '17-7, 1 NC',
        titleFightWins: 11,
        eliteWins: 7,

        finishRatePct: 77.8,
        roundsWonPct: 69.2,
        activeEliteYears: 7.21,
        timesFinishedPrime: 2
      },
      photoPosition: 'center top',
      priority: {
        'Dan Henderson': 1,
        'Rich Franklin': 2,
        'Forrest Griffin': 3,
        'Chael Sonnen': 4,
        'Vitor Belfort': 5,
        'Yushin Okami': 6,
        'Demian Maia': 7,
        'Nate Marquardt': 8,
        'Chris Weidman': 9,
        'Derek Brunson': 10,
        'Thales Leites': 11,
        'Patrick Cote': 12,
        'Travis Lutter': 13,
        'Stephan Bonnar': 14,
        'James Irvin': 15,
        'Chris Leben': 16
      }
    },

    'Islam Makhachev': {
      stats: {
        ufcRecord: '17-1',
        titleFightWins: 6,
        eliteWins: 7,

        finishRatePct: 75.0,
        roundsWonPct: 85.7,
        activeEliteYears: 4.7,
        timesFinishedPrime: 0
      },
      photoPosition: 'center top',
      priority: {
        'Alexander Volkanovski': 1,
        'Charles Oliveira': 2,
        'Jack Della Maddalena': 3,
        'Dustin Poirier': 4,
        'Arman Tsarukyan': 5,
        'Dan Hooker': 6,
        'Renato Moicano': 7,
        'King Green': 8,
        'Bobby Green': 8
      }
    },

    'Khabib Nurmagomedov': {
      stats: {
        ufcRecord: '13-0',
        titleFightWins: 4,
        eliteWins: 5,

        finishRatePct: 62.5,
        roundsWonPct: 94.7,
        activeEliteYears: 6.02,
        timesFinishedPrime: 0
      },
      photoPosition: 'center top',
      priority: {
        'Dustin Poirier': 1,
        'Justin Gaethje': 2,
        'Conor McGregor': 3,
        'Rafael dos Anjos': 4,
        'Edson Barboza': 5,
        'Al Iaquinta': 6,
        'Michael Johnson': 7,
        'Pat Healy': 8,
        'Gleison Tibau': 9,
        'Abel Trujillo': 10
      }
    },

    'Alexander Volkanovski': {
      stats: {
        ufcRecord: '15-3',
        titleFightWins: 7,
        eliteWins: 9,

        finishRatePct: 53.3,
        roundsWonPct: 76.5,
        activeEliteYears: 5.72,
        timesFinishedPrime: 2
      },
      photoPosition: 'center top',
      priority: {
        'Max Holloway': 1,
        'Jose Aldo': 2,
        'Islam Makhachev': 3,
        'Brian Ortega': 4,
        'Yair Rodriguez': 5,
        'Chad Mendes': 6,
        'Chan Sung Jung': 7,
        'Ilia Topuria': 8,
        'Diego Lopes': 9
      }
    },

    'Randy Couture': {
      stats: {
        ufcRecord: '16-8',
        titleFightWins: 8,
        eliteWins: 8,

        finishRatePct: 43.8,
        roundsWonPct: 66.7,
        activeEliteYears: 8.54,
        timesFinishedPrime: 2
      },
      photoPosition: 'center top',
      priority: {
        'Chuck Liddell': 1,
        'Tito Ortiz': 2,
        'Tim Sylvia': 3,
        'Vitor Belfort': 4,
        'Pedro Rizzo': 5,
        'Kevin Randleman': 6,
        'Gabriel Gonzaga': 7,
        'Maurice Smith': 8,
        'Brandon Vera': 9,
        'Brock Lesnar': 10
      }
    },

    'Max Holloway': {
      stats: {
        ufcRecord: '23-9',
        titleFightWins: 5,
        eliteWins: 9,

        finishRatePct: 52.2,
        roundsWonPct: 72.8,
        activeEliteYears: 8.31,
        timesFinishedPrime: 1
      },
      photoPosition: 'center top',
      priority: {
        'Alexander Volkanovski': 1,
        'Jose Aldo': 2,
        'Dustin Poirier': 3,
        'Justin Gaethje': 4,
        'Brian Ortega': 5,
        'Frankie Edgar': 6,
        'Yair Rodriguez': 7,
        'Anthony Pettis': 8,
        'Calvin Kattar': 9,
        'Chan Sung Jung': 10
      }
    },

    'Kamaru Usman': {
      stats: {
        ufcRecord: '16-3',
        titleFightWins: 6,
        eliteWins: 8,

        finishRatePct: 56.3,
        roundsWonPct: 78.1,
        activeEliteYears: 6.04,
        timesFinishedPrime: 1
      },
      photoPosition: 'center top',
      priority: {
        'Leon Edwards': 1,
        'Colby Covington': 2,
        'Tyron Woodley': 3,
        'Gilbert Burns': 4,
        'Jorge Masvidal': 5,
        'Rafael dos Anjos': 6,
        'Demian Maia': 7,
        'Sean Strickland': 8,
        'Emil Meek': 9
      }
    },

    'Jose Aldo': {
      stats: {
        ufcRecord: '14-9',
        titleFightWins: 5,
        eliteWins: 8,

        finishRatePct: 50.0,
        roundsWonPct: 64.8,
        activeEliteYears: 9.43,
        timesFinishedPrime: 1
      },
      photoPosition: 'center top',
      priority: {
        'Max Holloway': 1,
        'Alexander Volkanovski': 2,
        'Chad Mendes': 3,
        'Frankie Edgar': 4,
        'Chan Sung Jung': 5,
        'Marlon Vera': 6,
        'Rob Font': 7,
        'Pedro Munhoz': 8,
        'Renato Moicano': 9,
        'Jeremy Stephens': 10
      }
    },

    'Matt Hughes': {
      stats: {
        ufcRecord: '18-7',
        titleFightWins: 9,
        eliteWins: 9,

        finishRatePct: 61.1,
        roundsWonPct: 70.6,
        activeEliteYears: 8.36,
        timesFinishedPrime: 2
      },
      photoPosition: 'center top',
      priority: {
        'Georges St-Pierre': 1,
        'B.J. Penn': 2,
        'Frank Trigg': 3,
        'Sean Sherk': 4,
        'Carlos Newton': 5,
        'Matt Serra': 6,
        'Joe Riggs': 7,
        'Royce Gracie': 8,
        'Chris Lytle': 9,
        'Thiago Alves': 10
      }
    },

    'Daniel Cormier': {
      stats: {
        ufcRecord: '15-3, 1 NC',
        titleFightWins: 6,
        eliteWins: 9,

        finishRatePct: 53.3,
        roundsWonPct: 74.6,
        activeEliteYears: 7.05,
        timesFinishedPrime: 2
      },
      photoPosition: 'center top',
      priority: {
        'Jon Jones': 1,
        'Stipe Miocic': 2,
        'Anthony Johnson': 3,
        'Alexander Gustafsson': 4,
        'Anderson Silva': 5,
        'Derrick Lewis': 6,
        'Volkan Oezdemir': 7,
        'Dan Henderson': 8,
        'Frank Mir': 9,
        'Patrick Cummins': 10
      }
    },

    'Stipe Miocic': {
      stats: {
        ufcRecord: '15-5',
        titleFightWins: 6,
        eliteWins: 9,

        finishRatePct: 80.0,
        roundsWonPct: 68.4,
        activeEliteYears: 7.62,
        timesFinishedPrime: 2
      },
      photoPosition: 'center top',
      priority: {
        'Daniel Cormier': 1,
        'Francis Ngannou': 2,
        'Fabricio Werdum': 3,
        'Junior dos Santos': 4,
        'Alistair Overeem': 5,
        'Mark Hunt': 6,
        'Andrei Arlovski': 7,
        'Roy Nelson': 8,
        'Gabriel Gonzaga': 9,
        'Stefan Struve': 10
      }
    },

    'Ilia Topuria': {
      stats: {
        ufcRecord: '9-0',
        titleFightWins: 2,
        eliteWins: 4,

        finishRatePct: 66.7,
        roundsWonPct: 83.3,
        activeEliteYears: 3.18,
        timesFinishedPrime: 0
      },
      photoPosition: 'center top',
      priority: {
        'Alexander Volkanovski': 1,
        'Max Holloway': 2,
        'Josh Emmett': 3,
        'Bryce Mitchell': 4,
        'Dan Ige': 5,
        'Jai Herbert': 6,
        'Ryan Hall': 7,
        'Damon Jackson': 8,
        'Youssef Zalal': 9
      }
    },

    'Israel Adesanya': {
      stats: {
        ufcRecord: '14-5',
        titleFightWins: 7,
        eliteWins: 10,

        finishRatePct: 42.9,
        roundsWonPct: 72.9,
        activeEliteYears: 6.54,
        timesFinishedPrime: 2
      },
      photoPosition: 'center top',
      priority: {
        'Alex Pereira': 1,
        'Robert Whittaker': 2,
        'Dricus Du Plessis': 3,
        'Sean Strickland': 4,
        'Marvin Vettori': 5,
        'Paulo Costa': 6,
        'Jared Cannonier': 7,
        'Yoel Romero': 8,
        'Kelvin Gastelum': 9,
        'Anderson Silva': 10
      }
    }
  };

  function cleanName(name){
    return String(name || '').replace(/\s+\d+$/, '').trim();
  }
  function pctText(n){
    return n === null || n === undefined || n === '' || !Number.isFinite(Number(n)) ? '—' : `${Number(n).toFixed(1)}%`;
  }
  function fmtText(n){
    if(n === null || n === undefined || n === '') return '—';
    return Number.isFinite(Number(n)) ? String(Number(Number(n).toFixed(2))) : String(n);
  }
  function applyPackage(name, pack){
    const fighter = DATA.fighters?.find(f => f.fighter === name);
    const stats = pack.stats || {};
    if(fighter){
      fighter.snapshotStats = {...stats};
      
      fighter.roundsWonPct = stats.roundsWonPct;
      fighter.eliteWins = stats.eliteWins;
      fighter.timesFinishedPrime = stats.timesFinishedPrime;
      fighter.opponents?.forEach(row => {
        const priority = pack.priority?.[cleanName(row.opponent)];
        if(priority){
          row.displayPriority = priority;
          row.opponentStrengthScore = 101 - priority;
        }
      });
      fighter.rounds?.forEach(row => {
        const priority = pack.priority?.[cleanName(row.opponent)];
        if(priority){
          row.displayPriority = priority;
          row.opponentStrengthScore = 101 - priority;
        }
      });
    }

    const override = DISPLAY_OVERRIDES[name];
    if(override){
      override.snapshotStats = {...stats};
      if(pack.photoPosition) override.photoPosition = override.photoPosition || pack.photoPosition;
      override.snapshot = [
        ['UFC Record', stats.ufcRecord || '—'],
        ['UFC Title-Fight Wins', String(stats.titleFightWins ?? '—')],
        ['Elite / Top-5 Wins', String(stats.eliteWins ?? '—')],

        ['Finish Rate', pctText(stats.finishRatePct)],
        ['Rounds Won', pctText(stats.roundsWonPct)],
        ['Active Elite Years', fmtText(stats.activeEliteYears)],
        ['Times Finished in Prime', String(stats.timesFinishedPrime ?? '—')]
      ];
    }
  }

  Object.entries(PROFILE_PACKAGES).forEach(([name, pack]) => applyPackage(name, pack));
  window.UFC_FIGHTER_PROFILE_PACKAGES = { version: VERSION, fighters: Object.keys(PROFILE_PACKAGES) };
  if(typeof refresh === 'function') refresh();
})();
