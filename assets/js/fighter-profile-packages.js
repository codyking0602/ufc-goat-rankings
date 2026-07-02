// Durable fighter profile stat packages.
// Add each locked fighter snapshot and opponent display priority here.
(function(){
  const DATA = window.RANKING_DATA;
  const VERSION = 'fighter-profile-packages-20260701b';
  if(!DATA || typeof DISPLAY_OVERRIDES === 'undefined') return;

  const PROFILE_PACKAGES = {
    'Georges St-Pierre': {
      stats: {
        ufcRecord: '20-2',
        titleFightWins: 13,
        eliteWins: 14,
        primeRecord: '18-1',
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
        primeRecord: '13-2-1',
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
        primeRecord: '16-2',
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
      fighter.primeRecord = stats.primeRecord;
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
        ['Prime Record', stats.primeRecord || '—'],
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
