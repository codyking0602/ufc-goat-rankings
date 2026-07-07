// First-pass loss context ledgers.
// Shadow/scoring-input module: attaches structured losses before the scoring engine calculates audits.
(function(){
  const VERSION = 'loss-context-ledgers-v1-20260707a-clean-batch';

  const L = {
    normal: 'normal',
    reduced: 'reducedInjury',
    none: 'none'
  };

  const LEDGERS = {
    'Jon Jones': [
      { opponent:'Matt Hamill', date:'2009-12-05', result:'DQ', phase:'prePrime', opponentTier:'nonElite', upwardDivision:false, finished:false, finishTreatment:L.none, counted:false, penaltyOverride:0, notes:'Technical DQ; not treated as a real competitive loss.' }
    ],
    'Khabib Nurmagomedov': [],
    'Islam Makhachev': [
      { opponent:'Adriano Martins', date:'2015-10-03', result:'KO/TKO', phase:'prePrime', opponentTier:'nonElite', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Pre-prime UFC loss before the Drew Dober/elite lightweight prime window.' }
    ],
    'Georges St-Pierre': [
      { opponent:'Matt Hughes', date:'2004-10-22', result:'Submission', phase:'prePrime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Pre-prime title loss to the sitting elite welterweight champion.' },
      { opponent:'Matt Serra', date:'2007-04-07', result:'KO/TKO', phase:'prime', opponentTier:'nonElite', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Locked as prime non-elite upset loss.' }
    ],
    'Demetrious Johnson': [
      { opponent:'Dominick Cruz', date:'2011-10-01', result:'Decision', phase:'prePrime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Pre-prime elite bantamweight title loss before the UFC flyweight prime.' },
      { opponent:'Henry Cejudo', date:'2018-08-04', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Prime elite split-decision title loss.' }
    ],
    'Anderson Silva': [
      { opponent:'Chris Weidman', date:'2013-07-06', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime elite title loss.' },
      { opponent:'Chris Weidman', date:'2013-12-28', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.reduced, counted:true, notes:'Prime elite title loss with reduced injury/technical finish treatment for leg break.' },
      { opponent:'Michael Bisping', date:'2016-02-27', result:'Decision', phase:'postPrime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Post-prime under locked Anderson line after Weidman II.' },
      { opponent:'Daniel Cormier', date:'2016-07-09', result:'Decision', phase:'postPrime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:L.none, counted:true, notes:'Post-prime short-notice upward-division context; score impact 0.' },
      { opponent:'Jared Cannonier', date:'2019-05-11', result:'KO/TKO', phase:'postPrime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.reduced, counted:true, notes:'Post-prime injury stoppage; score impact 0.' },
      { opponent:'Uriah Hall', date:'2020-10-31', result:'KO/TKO', phase:'postPrime', opponentTier:'nonElite', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Post-prime late-career loss; score impact 0.' }
    ],
    'Alexander Volkanovski': [
      { opponent:'Islam Makhachev', date:'2023-02-12', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:L.none, counted:true, notes:'Upward-division elite title challenge; reduced penalty.' },
      { opponent:'Islam Makhachev', date:'2023-10-21', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:true, finishTreatment:L.normal, counted:true, notes:'Upward-division elite short-notice title challenge; short notice noted only.' },
      { opponent:'Ilia Topuria', date:'2024-02-17', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Same-division elite featherweight title loss; counted.' }
    ],
    'Kamaru Usman': [
      { opponent:'Leon Edwards', date:'2022-08-20', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime elite title loss.' },
      { opponent:'Leon Edwards', date:'2023-03-18', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Prime elite title rematch loss.' },
      { opponent:'Khamzat Chimaev', date:'2023-10-21', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:L.none, counted:true, notes:'Upward-division short-notice elite loss; reduced by upward rule.' }
    ],
    'Daniel Cormier': [
      { opponent:'Jon Jones', date:'2015-01-03', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Prime elite title loss.' },
      { opponent:'Jon Jones', date:'2017-07-29', result:'NC', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:false, penaltyOverride:0, notes:'Overturned to no contest; excluded from loss penalty.' },
      { opponent:'Stipe Miocic', date:'2019-08-17', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime heavyweight title loss.' },
      { opponent:'Stipe Miocic', date:'2020-08-15', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Late-prime heavyweight title loss; still counted.' }
    ],
    'Stipe Miocic': [
      { opponent:'Stefan Struve', date:'2012-09-29', result:'KO/TKO', phase:'prePrime', opponentTier:'nonElite', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Pre-prime non-elite finish loss.' },
      { opponent:'Junior dos Santos', date:'2014-12-13', result:'Decision', phase:'prePrime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Pre-prime elite heavyweight loss before title prime.' },
      { opponent:'Daniel Cormier', date:'2018-07-07', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime elite heavyweight title loss.' },
      { opponent:'Francis Ngannou', date:'2021-03-27', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime/late-prime elite heavyweight title loss.' },
      { opponent:'Jon Jones', date:'2024-11-16', result:'KO/TKO', phase:'postPrime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Post-prime/inactive older Stipe; score impact 0.' }
    ],
    'Zhang Weili': [
      { opponent:'Rose Namajunas', date:'2021-04-24', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime strawweight title loss to elite opponent.' },
      { opponent:'Rose Namajunas', date:'2021-11-06', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Prime elite title rematch loss.' },
      { opponent:'Valentina Shevchenko', date:'2025-11-15', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:L.none, counted:true, notes:'Upward-division flyweight title loss; reduced penalty.' }
    ],
    'Amanda Nunes': [
      { opponent:'Cat Zingano', date:'2014-09-27', result:'KO/TKO', phase:'prePrime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Pre-prime elite bantamweight loss.' },
      { opponent:'Julianna Peña', date:'2021-12-11', result:'Submission', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime elite title upset, locked as elite/top-5 rather than non-elite.' }
    ],
    'Valentina Shevchenko': [
      { opponent:'Amanda Nunes', date:'2016-03-05', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:L.none, counted:true, notes:'Bantamweight loss above best UFC division; reduced upward rule.' },
      { opponent:'Amanda Nunes', date:'2017-09-09', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:L.none, counted:true, notes:'Bantamweight title loss above best UFC division; reduced upward rule.' },
      { opponent:'Alexa Grasso', date:'2023-03-04', result:'Submission', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime flyweight title loss.' }
    ],
    'Joanna Jedrzejczyk': [
      { opponent:'Rose Namajunas', date:'2017-11-04', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime strawweight title loss.' },
      { opponent:'Rose Namajunas', date:'2018-04-07', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:false, finishTreatment:L.none, counted:true, notes:'Prime elite title rematch loss.' },
      { opponent:'Valentina Shevchenko', date:'2018-12-08', result:'Decision', phase:'prime', opponentTier:'championTop5', upwardDivision:true, finished:false, finishTreatment:L.none, counted:true, notes:'Upward flyweight title loss; reduced penalty.' },
      { opponent:'Zhang Weili', date:'2022-06-12', result:'KO/TKO', phase:'postPrime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Post-prime/inactive return; score impact 0.' }
    ],
    'Ronda Rousey': [
      { opponent:'Holly Holm', date:'2015-11-15', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime elite bantamweight title loss.' },
      { opponent:'Amanda Nunes', date:'2016-12-30', result:'KO/TKO', phase:'prime', opponentTier:'championTop5', upwardDivision:false, finished:true, finishTreatment:L.normal, counted:true, notes:'Prime/late-prime elite bantamweight title loss.' }
    ]
  };

  const NO_LOSS_CONFIRMED = new Set(['Khabib Nurmagomedov']);
  function applyLedgers(){
    const rows = Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : [];
    const applied = [];
    rows.forEach(f => {
      if(!f?.fighter) return;
      if(Object.prototype.hasOwnProperty.call(LEDGERS, f.fighter)){
        f.losses = LEDGERS[f.fighter].map(row => ({...row}));
        f.lossContextLedgerVersion = VERSION;
        if(NO_LOSS_CONFIRMED.has(f.fighter)) f.lossContextNoLosses = true;
        applied.push(f.fighter);
      }
    });
    window.UFC_LOSS_CONTEXT_LEDGERS_V1 = { version: VERSION, applied, ledgers: LEDGERS };
    document.documentElement.setAttribute('data-loss-context-ledgers', VERSION);
  }

  applyLedgers();
})();
