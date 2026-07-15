(function(){
  'use strict';

  const ERAS=[
    {
      id:'tournament',
      name:'Tournament Era',
      years:'1993–1997',
      startYear:1993,
      endYear:1997,
      description:'Style-vs-style tournaments before modern divisions and rules.',
      definingFight:'Royce Gracie vs. Gerard Gordeau',
      alternateFight:'Mark Coleman vs. Dan Severn',
      fightUrl:''
    },
    {
      id:'survival',
      name:'Survival Era',
      years:'1998–2000',
      startYear:1998,
      endYear:2000,
      description:'The UFC nearly disappears while early champions keep the promotion alive.',
      definingFight:'Frank Shamrock vs. Tito Ortiz',
      alternateFight:'Tito Ortiz vs. Wanderlei Silva',
      fightUrl:''
    },
    {
      id:'zuffa-rebuild',
      name:'Zuffa Rebuild',
      years:'2001–2004',
      startYear:2001,
      endYear:2004,
      description:'New ownership, unified rules, and the foundation of the modern UFC.',
      definingFight:'Tito Ortiz vs. Ken Shamrock',
      alternateFight:'Randy Couture vs. Tito Ortiz',
      fightUrl:''
    },
    {
      id:'tuf-boom',
      name:'TUF Boom',
      years:'2005–2010',
      startYear:2005,
      endYear:2010,
      description:'The Ultimate Fighter, cable television, and the UFC breaking into the mainstream.',
      definingFight:'Forrest Griffin vs. Stephan Bonnar',
      alternateFight:'Brock Lesnar vs. Frank Mir II',
      fightUrl:''
    },
    {
      id:'golden-age',
      name:'Golden Age',
      years:'2011–2015',
      startYear:2011,
      endYear:2015,
      description:'A deep champion class, lighter divisions, women’s MMA, and global expansion.',
      definingFight:'Jon Jones vs. Alexander Gustafsson I',
      alternateFight:'Ronda Rousey vs. Holly Holm',
      fightUrl:''
    },
    {
      id:'superstar',
      name:'Superstar Era',
      years:'2016–2019',
      startYear:2016,
      endYear:2019,
      description:'The McGregor effect, champ-champs, and individual stars becoming global attractions.',
      definingFight:'Khabib Nurmagomedov vs. Conor McGregor',
      alternateFight:'Conor McGregor vs. Eddie Alvarez',
      fightUrl:''
    },
    {
      id:'apex',
      name:'Apex Era',
      years:'2020–2022',
      startYear:2020,
      endYear:2022,
      description:'Pandemic cards, the UFC Apex, Fight Island, and rapid contender turnover.',
      definingFight:'Justin Gaethje vs. Tony Ferguson',
      alternateFight:'Alexander Volkanovski vs. Max Holloway II',
      fightUrl:''
    },
    {
      id:'new-blood',
      name:'New Blood Era',
      years:'2023–Present',
      startYear:2023,
      endYear:null,
      description:'A new championship generation powered by an increasingly global talent pool.',
      definingFight:'Islam Makhachev vs. Alexander Volkanovski I',
      alternateFight:'Ilia Topuria vs. Alexander Volkanovski',
      fightUrl:''
    }
  ];

  const EXTRA_MEMBERSHIP={
    'Vitor Belfort':['tournament'],
    'Randy Couture':['tournament','survival'],
    'Ken Shamrock':['tournament','survival','zuffa-rebuild'],
    'Mark Coleman':['tournament','survival'],
    'Dan Severn':['tournament'],
    'Don Frye':['tournament'],
    'Bas Rutten':['survival'],
    'Kevin Randleman':['survival'],
    'Pat Miletich':['survival'],
    'Alexandre Pantoja':['apex','new-blood']
  };

  window.UFC_ERA_FILTER_DATA={
    version:'era-filter-data-20260715a',
    eras:ERAS,
    byId:Object.fromEntries(ERAS.map(era=>[era.id,era])),
    extraMembership:EXTRA_MEMBERSHIP
  };
})();
