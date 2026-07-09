// Fighter Era Ledger Cleanup Pass.
// Splits grouped loss/context rows into individual dated rows before shadow adapters read the ledger.
// No live score mutation by itself; it only improves ledger event readability for QA/adapters.
(function(){
  const VERSION='fighter-era-ledger-cleanups-20260709a-split-grouped-losses';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;
  if(!ledgers){
    window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS={version:VERSION,error:'Missing UFC_FIGHTER_ERA_LEDGERS',mutatesScores:false};
    return;
  }

  function patch(fighter,lossContextPatch){
    const row=ledgers[fighter];
    if(!row)return;
    row.lossContext={...(row.lossContext||{}),...lossContextPatch};
  }

  patch('Anderson Silva',{postPrimeLosses:[
    {label:'Michael Bisping',date:'2016-02-27',phase:'post-prime elite decision loss'},
    {label:'Daniel Cormier',date:'2016-07-09',phase:'post-prime upward elite decision loss'},
    {label:'Jared Cannonier',date:'2019-05-11',phase:'post-prime injury/finish loss'},
    {label:'Uriah Hall',date:'2020-10-31',phase:'post-prime finish loss'}
  ],weirdResults:['Nick Diaz no contest is not a scored loss.']});

  patch('Jose Aldo',{recoveredLosses:[
    {label:'Conor McGregor',date:'2015-12-12',phase:'prime elite finish loss',recovery:'Recovered with elite contender/title-relevant form.'},
    {label:'Max Holloway I',date:'2017-06-03',phase:'prime elite finish loss',recovery:'Later bantamweight run re-proved elite relevance.'},
    {label:'Max Holloway II',date:'2017-12-02',phase:'prime elite finish loss',recovery:'Later bantamweight run re-proved elite relevance.'},
    {label:'Alexander Volkanovski',date:'2019-05-11',phase:'late-prime elite decision loss',recovery:'Bantamweight run re-proved elite contender form.'},
    {label:'Petr Yan',date:'2020-07-12',phase:'elite-prime title loss',recovery:'Munhoz/Font wins kept him elite-relevant.'}
  ]});

  patch('Max Holloway',{recoveredLosses:[
    {label:'Dustin Poirier II',date:'2019-04-13',phase:'prime upward/lightweight elite loss',recovery:'Returned to elite featherweight form.'},
    {label:'Alexander Volkanovski I',date:'2019-12-14',phase:'prime elite title decision loss',recovery:'Continued proving title-level form.'},
    {label:'Alexander Volkanovski II',date:'2020-07-12',phase:'prime elite title decision loss',recovery:'Continued proving title-level form.'},
    {label:'Alexander Volkanovski III',date:'2022-07-02',phase:'prime elite title decision loss',recovery:'Continued proving title-level form.'}
  ]});

  patch('Conor McGregor',{postPrimeLosses:[
    {label:'Dustin Poirier II',date:'2021-01-24',phase:'post-prime finish loss'},
    {label:'Dustin Poirier III',date:'2021-07-10',phase:'post-prime injury/finish loss'}
  ]});

  patch('Joanna Jedrzejczyk',{recoveredLosses:[
    {label:'Rose Namajunas I',date:'2017-11-04',phase:'prime elite finish loss',recovery:'Immediate rematch and continued elite title-level form.'},
    {label:'Rose Namajunas II',date:'2018-04-07',phase:'prime elite decision loss',recovery:'Returned to elite title-level form before Zhang I.'}
  ]});

  patch('Matt Hughes',{postPrimeLosses:[
    {label:'Thiago Alves',date:'2008-06-07',phase:'post-prime elite finish loss'},
    {label:'B.J. Penn III',date:'2010-11-20',phase:'post-prime finish loss'},
    {label:'Josh Koscheck',date:'2011-09-24',phase:'post-prime finish loss'}
  ]});

  patch('Randy Couture',{recoveredLosses:[
    {label:'Chuck Liddell II',date:'2005-04-16',phase:'prime elite finish loss',recovery:'Recovered by returning to heavyweight and winning the UFC title.'},
    {label:'Chuck Liddell III',date:'2006-02-04',phase:'prime elite finish loss',recovery:'Recovered by returning to heavyweight and winning the UFC title.'}
  ]});

  patch('Chuck Liddell',{recoveredLosses:[
    {label:'Randy Couture I',date:'2003-06-06',phase:'pre-window elite finish loss',recovery:'Recovered in rivalry/title run.'}
  ],postPrimeLosses:[
    {label:'Keith Jardine',date:'2007-09-22',phase:'post-prime decision loss'},
    {label:'Rashad Evans',date:'2008-09-06',phase:'post-prime finish loss'},
    {label:'Mauricio Rua',date:'2009-04-18',phase:'post-prime finish loss'},
    {label:'Rich Franklin',date:'2010-06-12',phase:'post-prime finish loss'}
  ]});

  patch('Tony Ferguson',{postPrimeLosses:[
    {label:'Charles Oliveira',date:'2020-12-12',phase:'post-prime elite decision loss'},
    {label:'Beneil Dariush',date:'2021-05-15',phase:'post-prime decision loss'},
    {label:'Michael Chandler',date:'2022-05-07',phase:'post-prime finish loss'},
    {label:'Nate Diaz',date:'2022-09-10',phase:'post-prime finish loss'},
    {label:'Bobby Green',date:'2023-07-29',phase:'post-prime finish loss'},
    {label:'Paddy Pimblett',date:'2023-12-16',phase:'post-prime decision loss'},
    {label:'Michael Chiesa',date:'2024-08-03',phase:'post-prime finish loss'}
  ]});

  patch('Chael Sonnen',{recoveredLosses:[
    {label:'Anderson Silva I',date:'2010-08-07',phase:'prime elite title finish loss',recovery:'Stayed title-level and earned another title fight.'},
    {label:'Anderson Silva II',date:'2012-07-07',phase:'prime elite title finish loss',recovery:'Moved up into Jones title fight.'}
  ]});

  patch('Frankie Edgar',{recoveredLosses:[
    {label:'Benson Henderson I',date:'2012-02-26',phase:'prime elite title decision loss',recovery:'Re-entered featherweight title contention.'},
    {label:'Benson Henderson II',date:'2012-08-11',phase:'prime elite title decision loss',recovery:'Re-entered featherweight title contention.'},
    {label:'Jose Aldo I',date:'2013-02-02',phase:'prime elite featherweight title decision loss',recovery:'Kept earning elite/title-level fights.'},
    {label:'Jose Aldo II',date:'2016-07-09',phase:'prime elite featherweight title decision loss',recovery:'Kept earning elite/title-level fights.'},
    {label:'Brian Ortega',date:'2018-03-03',phase:'late-prime elite finish loss',recovery:'Still reached Holloway title fight.'}
  ],postPrimeLosses:[
    {label:'Pedro Munhoz',date:'2020-08-22',phase:'post-prime bantamweight decision loss'},
    {label:'Cory Sandhagen',date:'2021-02-06',phase:'post-prime bantamweight finish loss'},
    {label:'Marlon Vera',date:'2021-11-06',phase:'post-prime bantamweight finish loss'},
    {label:'Chris Gutierrez',date:'2022-11-12',phase:'post-prime bantamweight finish loss'}
  ]});

  patch('Petr Yan',{recoveredLosses:[
    {label:'Aljamain Sterling II',date:'2022-04-09',phase:'prime elite title decision loss',recovery:'Stayed elite and continued taking elite bantamweight fights.'},
    {label:'Sean O’Malley',date:'2022-10-22',phase:'prime elite close decision loss',recovery:'Stayed elite after the close contender loss.'},
    {label:'Merab Dvalishvili',date:'2023-03-11',phase:'prime elite decision loss',recovery:'Cody call: Yan remains elite/current after later Merab recovery.'}
  ]});

  patch('Merab Dvalishvili',{recoveredLosses:[
    {label:'Frankie Saenz',date:'2017-12-09',phase:'pre-prime decision loss'},
    {label:'Ricky Simon',date:'2018-04-21',phase:'pre-prime technical finish loss'}
  ]});

  patch('Deiveson Figueiredo',{recoveredLosses:[
    {label:'Brandon Moreno II',date:'2021-06-12',phase:'prime elite title finish loss',recovery:'Recovered by winning Moreno III.'},
    {label:'Brandon Moreno IV',date:'2023-01-21',phase:'prime elite title finish loss',recovery:'Bantamweight run re-proved elite relevance.'}
  ]});

  patch('Tyron Woodley',{postPrimeLosses:[
    {label:'Gilbert Burns',date:'2020-05-30',phase:'post-prime elite decision loss'},
    {label:'Colby Covington',date:'2020-09-19',phase:'post-prime elite finish loss'},
    {label:'Vicente Luque',date:'2021-03-27',phase:'post-prime finish loss'}
  ]});

  patch('Robert Whittaker',{recoveredLosses:[
    {label:'Israel Adesanya I',date:'2019-10-06',phase:'prime elite title finish loss',recovery:'Continued as elite middleweight contender.'},
    {label:'Israel Adesanya II',date:'2022-02-12',phase:'prime elite title decision loss',recovery:'Continued as elite middleweight contender.'},
    {label:'Dricus du Plessis',date:'2023-07-08',phase:'prime elite finish loss',recovery:'Returned with elite middleweight relevance.'}
  ]});

  patch('Zhang Weili',{recoveredLosses:[
    {label:'Rose Namajunas I',date:'2021-04-24',phase:'prime elite title finish loss',recovery:'Recovered with Joanna II and Esparza title win.'},
    {label:'Rose Namajunas II',date:'2021-11-06',phase:'prime elite title decision loss',recovery:'Recovered with Joanna II and Esparza title win.'}
  ]});

  patch('Mackenzie Dern',{recoveredLosses:[
    {label:'Marina Rodriguez',date:'2021-10-09',phase:'prime contender decision loss',recovery:'Later re-proved championship form by Cody call.'},
    {label:'Yan Xiaonan',date:'2022-10-01',phase:'prime contender decision loss',recovery:'Later re-proved championship form by Cody call.'},
    {label:'Jessica Andrade',date:'2023-11-11',phase:'prime contender finish loss',recovery:'Later re-proved championship form by Cody call.'},
    {label:'Amanda Lemos',date:'2024-02-17',phase:'prime contender decision loss',recovery:'Later re-proved championship form by Cody call.'}
  ]});

  patch('Jessica Andrade',{postPrimeLosses:[
    {label:'Tatiana Suarez',date:'2023-08-05',phase:'post-prime finish loss'},
    {label:'Mackenzie Dern',date:'2023-11-11',phase:'post-prime finish loss'}
  ]});

  patch('Holly Holm',{recoveredLosses:[
    {label:'Miesha Tate',date:'2016-03-05',phase:'prime elite title finish loss',recovery:'Returned to title-level featherweight/bantamweight fights.'},
    {label:'Germaine de Randamie',date:'2017-02-11',phase:'prime elite featherweight title decision loss',recovery:'Stayed title-relevant afterward.'},
    {label:'Cris Cyborg',date:'2017-12-30',phase:'prime elite featherweight title decision loss',recovery:'Stayed title-relevant afterward.'}
  ],postPrimeLosses:[
    {label:'Ketlen Vieira',date:'2022-05-21',phase:'post-prime decision loss'},
    {label:'Kayla Harrison',date:'2024-04-13',phase:'post-prime finish loss'}
  ]});

  if(era.names)era.fighters=era.names();
  era.cleanupVersion=VERSION;
  window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS={version:VERSION,patched:true,mutatesScores:false,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-fighter-era-ledger-cleanups',VERSION);
})();
