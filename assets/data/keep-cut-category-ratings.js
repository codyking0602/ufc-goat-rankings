(function(){
  'use strict';

  const VERSION='keep-cut-category-ratings-20260717a-phase-one';
  const PLAY_DATA=window.UFC_PLAY_DATA;
  if(!PLAY_DATA)return;

  const CATEGORY_DEFINITIONS={
    ufcCareer:{label:'UFC Career',scope:'men',description:'UFC-only career value.'},
    allCareers:{label:'All UFC Careers',scope:'all',description:'UFC-only career value across men and women.'},
    bestPrime:{label:'Best Prime',scope:'all',description:'Prime dominance plus apex-level proof.'},
    hardestAtPeak:{label:'Hardest at Peak',scope:'all',description:'How difficult the fighter was to beat at their UFC peak.'},
    mostComplete:{label:'Most Complete',scope:'all',description:'Striking, wrestling, grappling, defense, cardio, and adaptability.'},
    bestFinisher:{label:'Best Finisher',scope:'all',description:'Finishing threat adjusted for UFC volume and stakes.'},
    actionFighter:{label:'Action Fighter',scope:'all',description:'Pace, violence, drama, and entertainment reliability.'},
    starPower:{label:'UFC Star Power',scope:'all',description:'UFC-specific fame, drawing power, and cultural reach.'},
    biggestWhatIf:{label:'Biggest UFC What-If',scope:'all',description:'Unrealized UFC upside caused by injuries, timing, choices, or a short run.'},
    cultChaos:{label:'Cult & Chaos',scope:'all',description:'Personality, novelty, unpredictability, and cult appeal.'}
  };

  const CATEGORY_IDS=Object.freeze(Object.keys(CATEGORY_DEFINITIONS));
  const TIER_BANDS=Object.freeze([
    {id:'elite',label:'Elite',min:92,max:100},
    {id:'great',label:'Great',min:82,max:91},
    {id:'good',label:'Good',min:70,max:81},
    {id:'average',label:'Average',min:55,max:69},
    {id:'below-average',label:'Below Average',min:35,max:54},
    {id:'bad',label:'Bad',min:0,max:34}
  ]);

  const MANUAL_RATINGS={
  "CM Punk": {
    "ufcCareer": 5,
    "allCareers": 5,
    "bestPrime": 5,
    "hardestAtPeak": 5,
    "mostComplete": 8,
    "bestFinisher": 5,
    "actionFighter": 15,
    "starPower": 60,
    "biggestWhatIf": 35,
    "cultChaos": 95
  },
  "Kevin Holland": {
    "ufcCareer": 58,
    "allCareers": 58,
    "bestPrime": 68,
    "hardestAtPeak": 65,
    "mostComplete": 72,
    "bestFinisher": 78,
    "actionFighter": 88,
    "starPower": 72,
    "biggestWhatIf": 58,
    "cultChaos": 72
  },
  "Tai Tuivasa": {
    "ufcCareer": 48,
    "allCareers": 48,
    "bestPrime": 65,
    "hardestAtPeak": 61,
    "mostComplete": 48,
    "bestFinisher": 82,
    "actionFighter": 88,
    "starPower": 72,
    "biggestWhatIf": 55,
    "cultChaos": 75
  },
  "Clay Guida": {
    "ufcCareer": 62,
    "allCareers": 62,
    "bestPrime": 65,
    "hardestAtPeak": 62,
    "mostComplete": 70,
    "bestFinisher": 50,
    "actionFighter": 86,
    "starPower": 60,
    "biggestWhatIf": 42,
    "cultChaos": 78
  },
  "Diego Sanchez": {
    "ufcCareer": 60,
    "allCareers": 60,
    "bestPrime": 67,
    "hardestAtPeak": 63,
    "mostComplete": 66,
    "bestFinisher": 58,
    "actionFighter": 90,
    "starPower": 70,
    "biggestWhatIf": 52,
    "cultChaos": 88
  },
  "Jorge Masvidal": {
    "ufcCareer": 76,
    "allCareers": 76,
    "bestPrime": 84,
    "hardestAtPeak": 80,
    "mostComplete": 78,
    "bestFinisher": 82,
    "actionFighter": 90,
    "starPower": 92,
    "biggestWhatIf": 80,
    "cultChaos": 84
  },
  "Nate Diaz": {
    "ufcCareer": 72,
    "allCareers": 72,
    "bestPrime": 78,
    "hardestAtPeak": 75,
    "mostComplete": 72,
    "bestFinisher": 65,
    "actionFighter": 94,
    "starPower": 94,
    "biggestWhatIf": 75,
    "cultChaos": 95
  },
  "Nick Diaz": {
    "ufcCareer": 68,
    "allCareers": 68,
    "bestPrime": 82,
    "hardestAtPeak": 79,
    "mostComplete": 74,
    "bestFinisher": 75,
    "actionFighter": 90,
    "starPower": 85,
    "biggestWhatIf": 84,
    "cultChaos": 94
  },
  "Carlos Condit": {
    "ufcCareer": 80,
    "allCareers": 80,
    "bestPrime": 86,
    "hardestAtPeak": 83,
    "mostComplete": 80,
    "bestFinisher": 88,
    "actionFighter": 94,
    "starPower": 73,
    "biggestWhatIf": 78,
    "cultChaos": 76
  },
  "Alexander Gustafsson": {
    "ufcCareer": 82,
    "allCareers": 82,
    "bestPrime": 89,
    "hardestAtPeak": 88,
    "mostComplete": 82,
    "bestFinisher": 78,
    "actionFighter": 88,
    "starPower": 78,
    "biggestWhatIf": 88,
    "cultChaos": 65
  },
  "Donald Cerrone": {
    "ufcCareer": 78,
    "allCareers": 78,
    "bestPrime": 82,
    "hardestAtPeak": 78,
    "mostComplete": 80,
    "bestFinisher": 86,
    "actionFighter": 96,
    "starPower": 85,
    "biggestWhatIf": 72,
    "cultChaos": 88
  },
  "Derrick Lewis": {
    "ufcCareer": 70,
    "allCareers": 70,
    "bestPrime": 80,
    "hardestAtPeak": 75,
    "mostComplete": 55,
    "bestFinisher": 95,
    "actionFighter": 88,
    "starPower": 82,
    "biggestWhatIf": 62,
    "cultChaos": 90
  },
  "Dan Hooker": {
    "ufcCareer": 67,
    "allCareers": 67,
    "bestPrime": 76,
    "hardestAtPeak": 73,
    "mostComplete": 72,
    "bestFinisher": 75,
    "actionFighter": 93,
    "starPower": 73,
    "biggestWhatIf": 64,
    "cultChaos": 72
  },
  "Michael Chandler": {
    "ufcCareer": 65,
    "allCareers": 65,
    "bestPrime": 80,
    "hardestAtPeak": 78,
    "mostComplete": 78,
    "bestFinisher": 90,
    "actionFighter": 96,
    "starPower": 86,
    "biggestWhatIf": 82,
    "cultChaos": 78
  },
  "Paulo Costa": {
    "ufcCareer": 58,
    "allCareers": 58,
    "bestPrime": 78,
    "hardestAtPeak": 76,
    "mostComplete": 65,
    "bestFinisher": 85,
    "actionFighter": 82,
    "starPower": 78,
    "biggestWhatIf": 72,
    "cultChaos": 72
  },
  "Yoel Romero": {
    "ufcCareer": 72,
    "allCareers": 72,
    "bestPrime": 90,
    "hardestAtPeak": 91,
    "mostComplete": 82,
    "bestFinisher": 84,
    "actionFighter": 84,
    "starPower": 80,
    "biggestWhatIf": 92,
    "cultChaos": 78
  },
  "Anthony Pettis": {
    "ufcCareer": 74,
    "allCareers": 74,
    "bestPrime": 86,
    "hardestAtPeak": 83,
    "mostComplete": 78,
    "bestFinisher": 88,
    "actionFighter": 92,
    "starPower": 84,
    "biggestWhatIf": 82,
    "cultChaos": 74
  },
  "Rory MacDonald": {
    "ufcCareer": 68,
    "allCareers": 68,
    "bestPrime": 84,
    "hardestAtPeak": 81,
    "mostComplete": 82,
    "bestFinisher": 70,
    "actionFighter": 82,
    "starPower": 68,
    "biggestWhatIf": 88,
    "cultChaos": 55
  },
  "Colby Covington": {
    "ufcCareer": 78,
    "allCareers": 78,
    "bestPrime": 85,
    "hardestAtPeak": 85,
    "mostComplete": 78,
    "bestFinisher": 45,
    "actionFighter": 72,
    "starPower": 84,
    "biggestWhatIf": 74,
    "cultChaos": 82
  },
  "Stephen Thompson": {
    "ufcCareer": 74,
    "allCareers": 74,
    "bestPrime": 84,
    "hardestAtPeak": 83,
    "mostComplete": 75,
    "bestFinisher": 62,
    "actionFighter": 78,
    "starPower": 79,
    "biggestWhatIf": 82,
    "cultChaos": 68
  },
  "Cub Swanson": {
    "ufcCareer": 66,
    "allCareers": 66,
    "bestPrime": 75,
    "hardestAtPeak": 72,
    "mostComplete": 70,
    "bestFinisher": 78,
    "actionFighter": 92,
    "starPower": 64,
    "biggestWhatIf": 55,
    "cultChaos": 74
  },
  "Chan Sung Jung": {
    "ufcCareer": 69,
    "allCareers": 69,
    "bestPrime": 80,
    "hardestAtPeak": 77,
    "mostComplete": 72,
    "bestFinisher": 90,
    "actionFighter": 97,
    "starPower": 78,
    "biggestWhatIf": 68,
    "cultChaos": 89
  },
  "Urijah Faber": {
    "ufcCareer": 70,
    "allCareers": 70,
    "bestPrime": 80,
    "hardestAtPeak": 78,
    "mostComplete": 82,
    "bestFinisher": 72,
    "actionFighter": 80,
    "starPower": 76,
    "biggestWhatIf": 86,
    "cultChaos": 68
  },
  "Kevin Lee": {
    "ufcCareer": 55,
    "allCareers": 55,
    "bestPrime": 76,
    "hardestAtPeak": 74,
    "mostComplete": 75,
    "bestFinisher": 70,
    "actionFighter": 78,
    "starPower": 65,
    "biggestWhatIf": 86,
    "cultChaos": 60
  },
  "Sage Northcutt": {
    "ufcCareer": 38,
    "allCareers": 38,
    "bestPrime": 55,
    "hardestAtPeak": 50,
    "mostComplete": 58,
    "bestFinisher": 58,
    "actionFighter": 64,
    "starPower": 68,
    "biggestWhatIf": 78,
    "cultChaos": 76
  },
  "Kimbo Slice": {
    "ufcCareer": 25,
    "allCareers": 25,
    "bestPrime": 48,
    "hardestAtPeak": 45,
    "mostComplete": 30,
    "bestFinisher": 80,
    "actionFighter": 78,
    "starPower": 88,
    "biggestWhatIf": 70,
    "cultChaos": 96
  },
  "Matt Brown": {
    "ufcCareer": 63,
    "allCareers": 63,
    "bestPrime": 74,
    "hardestAtPeak": 70,
    "mostComplete": 65,
    "bestFinisher": 88,
    "actionFighter": 96,
    "starPower": 66,
    "biggestWhatIf": 50,
    "cultChaos": 78
  },
  "Joe Lauzon": {
    "ufcCareer": 60,
    "allCareers": 60,
    "bestPrime": 70,
    "hardestAtPeak": 67,
    "mostComplete": 69,
    "bestFinisher": 88,
    "actionFighter": 94,
    "starPower": 60,
    "biggestWhatIf": 45,
    "cultChaos": 76
  },
  "Chris Leben": {
    "ufcCareer": 52,
    "allCareers": 52,
    "bestPrime": 68,
    "hardestAtPeak": 64,
    "mostComplete": 50,
    "bestFinisher": 82,
    "actionFighter": 90,
    "starPower": 67,
    "biggestWhatIf": 55,
    "cultChaos": 88
  },
  "Houston Alexander": {
    "ufcCareer": 22,
    "allCareers": 22,
    "bestPrime": 58,
    "hardestAtPeak": 55,
    "mostComplete": 35,
    "bestFinisher": 88,
    "actionFighter": 75,
    "starPower": 58,
    "biggestWhatIf": 62,
    "cultChaos": 89
  },
  "Edson Barboza": {
    "ufcCareer": 72,
    "allCareers": 72,
    "bestPrime": 82,
    "hardestAtPeak": 79,
    "mostComplete": 72,
    "bestFinisher": 86,
    "actionFighter": 94,
    "starPower": 76,
    "biggestWhatIf": 70,
    "cultChaos": 72
  },
  "Mike Perry": {
    "ufcCareer": 48,
    "allCareers": 48,
    "bestPrime": 66,
    "hardestAtPeak": 61,
    "mostComplete": 55,
    "bestFinisher": 78,
    "actionFighter": 92,
    "starPower": 76,
    "biggestWhatIf": 58,
    "cultChaos": 94
  },
  "Darren Till": {
    "ufcCareer": 55,
    "allCareers": 55,
    "bestPrime": 78,
    "hardestAtPeak": 75,
    "mostComplete": 68,
    "bestFinisher": 65,
    "actionFighter": 70,
    "starPower": 80,
    "biggestWhatIf": 88,
    "cultChaos": 70
  },
  "Sam Alvey": {
    "ufcCareer": 35,
    "allCareers": 35,
    "bestPrime": 55,
    "hardestAtPeak": 50,
    "mostComplete": 48,
    "bestFinisher": 65,
    "actionFighter": 50,
    "starPower": 40,
    "biggestWhatIf": 40,
    "cultChaos": 84
  },
  "Artem Lobov": {
    "ufcCareer": 20,
    "allCareers": 20,
    "bestPrime": 45,
    "hardestAtPeak": 42,
    "mostComplete": 42,
    "bestFinisher": 40,
    "actionFighter": 68,
    "starPower": 60,
    "biggestWhatIf": 50,
    "cultChaos": 98
  },
  "Michel Pereira": {
    "ufcCareer": 50,
    "allCareers": 50,
    "bestPrime": 72,
    "hardestAtPeak": 68,
    "mostComplete": 70,
    "bestFinisher": 78,
    "actionFighter": 92,
    "starPower": 68,
    "biggestWhatIf": 70,
    "cultChaos": 86
  },
  "Paige VanZant": {
    "ufcCareer": 42,
    "allCareers": 42,
    "bestPrime": 60,
    "hardestAtPeak": 55,
    "mostComplete": 58,
    "bestFinisher": 50,
    "actionFighter": 68,
    "starPower": 88,
    "biggestWhatIf": 78,
    "cultChaos": 80
  },
  "Michelle Waterson-Gomez": {
    "ufcCareer": 55,
    "allCareers": 55,
    "bestPrime": 72,
    "hardestAtPeak": 68,
    "mostComplete": 75,
    "bestFinisher": 55,
    "actionFighter": 72,
    "starPower": 72,
    "biggestWhatIf": 64,
    "cultChaos": 55
  },
  "Angela Hill": {
    "ufcCareer": 58,
    "allCareers": 58,
    "bestPrime": 70,
    "hardestAtPeak": 68,
    "mostComplete": 74,
    "bestFinisher": 45,
    "actionFighter": 82,
    "starPower": 60,
    "biggestWhatIf": 55,
    "cultChaos": 62
  },
  "Maycee Barber": {
    "ufcCareer": 58,
    "allCareers": 58,
    "bestPrime": 76,
    "hardestAtPeak": 74,
    "mostComplete": 68,
    "bestFinisher": 78,
    "actionFighter": 78,
    "starPower": 68,
    "biggestWhatIf": 72,
    "cultChaos": 50
  },
  "Molly McCann": {
    "ufcCareer": 44,
    "allCareers": 44,
    "bestPrime": 62,
    "hardestAtPeak": 58,
    "mostComplete": 55,
    "bestFinisher": 72,
    "actionFighter": 88,
    "starPower": 78,
    "biggestWhatIf": 55,
    "cultChaos": 88
  },
  "Karolina Kowalkiewicz": {
    "ufcCareer": 60,
    "allCareers": 60,
    "bestPrime": 74,
    "hardestAtPeak": 71,
    "mostComplete": 72,
    "bestFinisher": 45,
    "actionFighter": 74,
    "starPower": 62,
    "biggestWhatIf": 60,
    "cultChaos": 55
  }
};
  const SUBJECTIVE_OVERRIDES={
  "Georges St-Pierre": {
    "mostComplete": 99,
    "actionFighter": 72,
    "starPower": 95,
    "biggestWhatIf": 40,
    "cultChaos": 35
  },
  "Jon Jones": {
    "mostComplete": 98,
    "actionFighter": 82,
    "starPower": 96,
    "biggestWhatIf": 65,
    "cultChaos": 78
  },
  "Demetrious Johnson": {
    "mostComplete": 99,
    "actionFighter": 78,
    "starPower": 80,
    "biggestWhatIf": 45,
    "cultChaos": 35
  },
  "Anderson Silva": {
    "mostComplete": 92,
    "actionFighter": 90,
    "starPower": 95,
    "biggestWhatIf": 55,
    "cultChaos": 75
  },
  "Khabib Nurmagomedov": {
    "mostComplete": 91,
    "actionFighter": 83,
    "starPower": 96,
    "biggestWhatIf": 95,
    "cultChaos": 80
  },
  "Alexander Volkanovski": {
    "mostComplete": 97,
    "actionFighter": 88,
    "starPower": 86,
    "biggestWhatIf": 72,
    "cultChaos": 45
  },
  "Islam Makhachev": {
    "mostComplete": 96,
    "actionFighter": 76,
    "starPower": 88,
    "biggestWhatIf": 70,
    "cultChaos": 45
  },
  "Amanda Nunes": {
    "mostComplete": 96,
    "actionFighter": 86,
    "starPower": 90,
    "biggestWhatIf": 55,
    "cultChaos": 50
  },
  "Valentina Shevchenko": {
    "mostComplete": 95,
    "actionFighter": 74,
    "starPower": 85,
    "biggestWhatIf": 55,
    "cultChaos": 42
  },
  "Max Holloway": {
    "mostComplete": 91,
    "actionFighter": 99,
    "starPower": 90,
    "biggestWhatIf": 70,
    "cultChaos": 70
  },
  "Jose Aldo": {
    "mostComplete": 94,
    "actionFighter": 88,
    "starPower": 86,
    "biggestWhatIf": 70,
    "cultChaos": 50
  },
  "Kamaru Usman": {
    "mostComplete": 92,
    "actionFighter": 76,
    "starPower": 86,
    "biggestWhatIf": 60,
    "cultChaos": 45
  },
  "Daniel Cormier": {
    "mostComplete": 93,
    "actionFighter": 84,
    "starPower": 88,
    "biggestWhatIf": 75,
    "cultChaos": 70
  },
  "Conor McGregor": {
    "mostComplete": 86,
    "actionFighter": 91,
    "starPower": 100,
    "biggestWhatIf": 96,
    "cultChaos": 96
  },
  "Ronda Rousey": {
    "mostComplete": 75,
    "actionFighter": 93,
    "starPower": 100,
    "biggestWhatIf": 94,
    "cultChaos": 90
  },
  "Alex Pereira": {
    "mostComplete": 82,
    "actionFighter": 95,
    "starPower": 96,
    "biggestWhatIf": 86,
    "cultChaos": 88
  },
  "Israel Adesanya": {
    "mostComplete": 88,
    "actionFighter": 82,
    "starPower": 94,
    "biggestWhatIf": 72,
    "cultChaos": 78
  },
  "Charles Oliveira": {
    "mostComplete": 88,
    "actionFighter": 99,
    "starPower": 91,
    "biggestWhatIf": 82,
    "cultChaos": 78
  },
  "Justin Gaethje": {
    "mostComplete": 72,
    "actionFighter": 100,
    "starPower": 88,
    "biggestWhatIf": 68,
    "cultChaos": 82
  },
  "Dustin Poirier": {
    "mostComplete": 84,
    "actionFighter": 98,
    "starPower": 90,
    "biggestWhatIf": 90,
    "cultChaos": 78
  },
  "Dominick Cruz": {
    "mostComplete": 92,
    "actionFighter": 76,
    "starPower": 80,
    "biggestWhatIf": 97,
    "cultChaos": 60
  },
  "Cain Velasquez": {
    "mostComplete": 88,
    "actionFighter": 87,
    "starPower": 82,
    "biggestWhatIf": 100,
    "cultChaos": 60
  },
  "Brock Lesnar": {
    "mostComplete": 60,
    "actionFighter": 88,
    "starPower": 99,
    "biggestWhatIf": 96,
    "cultChaos": 90
  },
  "Chris Weidman": {
    "mostComplete": 84,
    "actionFighter": 82,
    "starPower": 80,
    "biggestWhatIf": 94,
    "cultChaos": 55
  },
  "T.J. Dillashaw": {
    "mostComplete": 91,
    "actionFighter": 86,
    "starPower": 78,
    "biggestWhatIf": 92,
    "cultChaos": 72
  },
  "Petr Yan": {
    "mostComplete": 91,
    "actionFighter": 88,
    "starPower": 78,
    "biggestWhatIf": 90,
    "cultChaos": 55
  },
  "Francis Ngannou": {
    "mostComplete": 68,
    "actionFighter": 90,
    "starPower": 92,
    "biggestWhatIf": 90,
    "cultChaos": 75
  },
  "Henry Cejudo": {
    "mostComplete": 94,
    "actionFighter": 78,
    "starPower": 84,
    "biggestWhatIf": 88,
    "cultChaos": 70
  },
  "B.J. Penn": {
    "mostComplete": 90,
    "actionFighter": 90,
    "starPower": 87,
    "biggestWhatIf": 85,
    "cultChaos": 84
  },
  "Robbie Lawler": {
    "mostComplete": 70,
    "actionFighter": 98,
    "starPower": 82,
    "biggestWhatIf": 62,
    "cultChaos": 85
  },
  "Tony Ferguson": {
    "mostComplete": 78,
    "actionFighter": 99,
    "starPower": 86,
    "biggestWhatIf": 98,
    "cultChaos": 92
  },
  "Chael Sonnen": {
    "mostComplete": 62,
    "actionFighter": 82,
    "starPower": 88,
    "biggestWhatIf": 91,
    "cultChaos": 100
  },
  "Sean O’Malley": {
    "mostComplete": 82,
    "actionFighter": 90,
    "starPower": 92,
    "biggestWhatIf": 74,
    "cultChaos": 80
  },
  "Ilia Topuria": {
    "mostComplete": 91,
    "actionFighter": 92,
    "starPower": 88,
    "biggestWhatIf": 78,
    "cultChaos": 65
  },
  "Alexandre Pantoja": {
    "mostComplete": 92,
    "actionFighter": 88,
    "starPower": 78,
    "biggestWhatIf": 60,
    "cultChaos": 55
  }
};

  const api={
    version:VERSION,
    categories:CATEGORY_DEFINITIONS,
    categoryIds:CATEGORY_IDS,
    tierBands:TIER_BANDS,
    entries:[],
    byId:{},
    byName:{},
    audit:null,
    rebuild,
    resolve(value){
      const target=normal(value);
      if(!target)return null;
      return api.byId[slug(value)]||api.byName[target]||null;
    },
    ratingFor(value,category){
      return api.resolve(value)?.ratings?.[category]??null;
    },
    tierFor(value,category){
      return api.resolve(value)?.tiers?.[category]??null;
    },
    eligibleFor(value,category){
      return Boolean(api.resolve(value)?.eligibility?.[category]);
    },
    poolFor(category,filters={}){
      return api.entries.filter(entry=>entry.eligibility?.[category]&&matches(entry,filters));
    }
  };

  function text(value){return String(value??'').trim();}
  function normal(value){
    return text(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();
  }
  function slug(value){return normal(value).replace(/\s+/g,'-');}
  function clamp(value,min=0,max=100){return Math.max(min,Math.min(max,Number(value)||0));}
  function rounded(value){return Math.round(clamp(value));}
  function number(...values){
    const found=values.find(value=>Number.isFinite(Number(value)));
    return found===undefined?null:Number(found);
  }
  function rowFor(name){
    const target=normal(name);
    const data=window.RANKING_DATA||{};
    return [...(data.fighters||[]),...(data.men||[]),...(data.women||[])].find(row=>normal(row?.fighter)===target)||null;
  }
  function tierForRating(value){
    const rating=rounded(value);
    return TIER_BANDS.find(tier=>rating>=tier.min&&rating<=tier.max)?.id||'bad';
  }
  function primeLosses(row){
    const match=text(row?.primeRecord).match(/(\d+)\s*-\s*(\d+)/);
    return match?Number(match[2]):0;
  }
  function tagSet(fighter){return new Set(fighter?.tags||[]);}

  function careerRating(fighter,row){
    const rank=number(fighter?.modelRank,row?.rank);
    const total=number(fighter?.modelScore,row?.totalScore,row?.rawScore);
    const rankRating=rank===null?null:100-((rank-1)*0.58);
    const scoreRating=total===null?null:42+(total*0.58);
    if(rankRating===null&&scoreRating===null)return null;
    return rounded(Math.max(rankRating??0,scoreRating??0,35));
  }

  function bestPrimeRating(row){
    const dominance=number(row?.primeDominance);
    const rounds=number(row?.roundsWonPct);
    if(dominance===null||rounds===null)return null;
    const apex=number(row?.apexPeak)||0;
    const finish=number(row?.finishRatePct)||0;
    const finished=number(row?.timesFinishedPrime)||0;
    return rounded(45+(dominance*1.5)+apex+(rounds*0.08)+(finish*0.03)-(primeLosses(row)*3)-(finished*2));
  }

  function hardestPeakRating(row){
    const dominance=number(row?.primeDominance);
    const rounds=number(row?.roundsWonPct);
    if(dominance===null||rounds===null)return null;
    const apex=number(row?.apexPeak)||0;
    const finish=number(row?.finishRatePct)||0;
    const finished=number(row?.timesFinishedPrime)||0;
    return rounded(42+(dominance*1.35)+(apex*1.2)+(rounds*0.12)+(finish*0.025)-(primeLosses(row)*4)-(finished*3));
  }

  function finisherRating(row){
    const finish=number(row?.finishRatePct);
    const wins=number(row?.ufcWins);
    if(finish===null||wins===null)return null;
    const topFive=number(row?.topFiveWins,row?.top5Wins)||0;
    const titleWins=number(row?.titleFightWins,row?.ufcTitleFightWins)||0;
    const apex=number(row?.apexPeak)||0;
    return rounded(20+(finish*0.58)+Math.min(18,wins*1.1)+Math.min(12,topFive*1.4)+Math.min(10,titleWins*1.2)+(apex*0.35));
  }

  function defaultComplete(career,prime){
    return rounded(20+((career??50)*0.28)+((prime??50)*0.45));
  }

  function defaultAction(fighter,row,career){
    const tags=tagSet(fighter);
    const finish=number(row?.finishRatePct)||40;
    const fights=number(row?.ufcFightCount)||Math.max(4,(career??50)/8);
    let value=30+(finish*0.32)+Math.min(22,fights*0.8);
    if(tags.has('action'))value+=12;
    if(tags.has('highlight'))value+=8;
    if(tags.has('fan-favorite'))value+=4;
    return rounded(value);
  }

  function defaultStar(fighter,row,career){
    const tags=tagSet(fighter);
    const titleWins=number(row?.titleFightWins,row?.ufcTitleFightWins)||0;
    let value=25+((career??50)*0.55)+Math.min(15,titleWins*2.5);
    if(tags.has('star'))value+=10;
    if(tags.has('celebrity'))value+=18;
    if(tags.has('personality'))value+=5;
    return rounded(value);
  }

  function defaultWhatIf(fighter,career,prime){
    const tags=tagSet(fighter);
    let value=32+Math.max(0,(prime??50)-(career??50))*1.1;
    if(tags.has('prospect'))value+=14;
    if(tags.has('title-challenger'))value+=6;
    if(tags.has('interim-title-challenger'))value+=8;
    return rounded(value);
  }

  function defaultCult(fighter){
    const tags=tagSet(fighter);
    let value=20;
    if(tags.has('cult'))value+=45;
    if(tags.has('personality'))value+=24;
    if(tags.has('wildcard'))value+=20;
    if(tags.has('celebrity'))value+=15;
    if(tags.has('fan-favorite'))value+=8;
    return rounded(value);
  }

  function divisionRating(fighter,division,career){
    const entries=window.UFC_DIVISION_RANKING_PIPELINE?.entryFor?.(fighter?.name);
    const match=Array.isArray(entries)?entries.find(entry=>entry?.division===division):null;
    const raw=number(match?.divisionScore);
    if(raw!==null)return {rating:rounded(42+(raw*0.58)),source:'model-derived',status:'derived'};
    const primary=normal(fighter?.primaryDivision)===normal(division);
    return {rating:rounded((career??50)-(primary?0:6)),source:fighter?.modelRanked?'model-fallback':'manual-fallback',status:'provisional'};
  }

  function ratingSources(fighter,row,ratings,manualRatings,subjective){
    const sources={};
    const statuses={};
    CATEGORY_IDS.forEach(category=>{
      if(manualRatings&&Number.isFinite(Number(manualRatings[category]))){
        sources[category]='manual';
        statuses[category]='approved';
        return;
      }
      if(subjective&&Number.isFinite(Number(subjective[category]))){
        sources[category]='manual-override';
        statuses[category]='approved';
        return;
      }
      if(['ufcCareer','allCareers','bestPrime','hardestAtPeak','bestFinisher'].includes(category)&&fighter.modelRanked){
        sources[category]='model-derived';
        statuses[category]='derived';
        return;
      }
      sources[category]='heuristic';
      statuses[category]='provisional';
    });
    return {sources,statuses};
  }

  function buildEntry(fighter){
    const row=rowFor(fighter.name);
    const manualRatings=MANUAL_RATINGS[fighter.name]||null;
    const subjective=SUBJECTIVE_OVERRIDES[fighter.name]||null;

    let career=careerRating(fighter,row);
    let prime=bestPrimeRating(row);
    let hardest=hardestPeakRating(row);
    let finisher=finisherRating(row);

    if(manualRatings){
      career=manualRatings.ufcCareer;
      prime=manualRatings.bestPrime;
      hardest=manualRatings.hardestAtPeak;
      finisher=manualRatings.bestFinisher;
    }

    const ratings={
      ufcCareer:rounded(career??45),
      allCareers:rounded(career??45),
      bestPrime:rounded(prime??Math.max(35,(career??45)-2)),
      hardestAtPeak:rounded(hardest??Math.max(35,(prime??career??45)-3)),
      mostComplete:rounded(defaultComplete(career,prime)),
      bestFinisher:rounded(finisher??Math.max(30,(career??45)-4)),
      actionFighter:rounded(defaultAction(fighter,row,career)),
      starPower:rounded(defaultStar(fighter,row,career)),
      biggestWhatIf:rounded(defaultWhatIf(fighter,career,prime)),
      cultChaos:rounded(defaultCult(fighter))
    };

    if(manualRatings)Object.assign(ratings,manualRatings);
    if(subjective)Object.assign(ratings,subjective);
    CATEGORY_IDS.forEach(category=>ratings[category]=rounded(ratings[category]));

    const {sources,statuses}=ratingSources(fighter,row,ratings,manualRatings,subjective);
    const divisionRatings={};
    const divisionSources={};
    const divisionStatuses={};
    (fighter.divisions||[]).forEach(division=>{
      const result=divisionRating(fighter,division,ratings.ufcCareer);
      divisionRatings[division]=result.rating;
      divisionSources[division]=result.source;
      divisionStatuses[division]=result.status;
    });

    const eligibility={
      ufcCareer:fighter.gender==='men',
      allCareers:true,
      bestPrime:true,
      hardestAtPeak:true,
      mostComplete:true,
      bestFinisher:true,
      actionFighter:true,
      starPower:true,
      biggestWhatIf:true,
      cultChaos:true,
      divisions:Object.fromEntries((fighter.divisions||[]).map(division=>[division,true]))
    };

    return {
      id:fighter.id,
      name:fighter.name,
      gender:fighter.gender,
      divisions:[...(fighter.divisions||[])],
      primaryDivision:fighter.primaryDivision||fighter.divisions?.[0]||'',
      modelRanked:Boolean(fighter.modelRanked),
      rosterSource:fighter.source||'unknown',
      ratings,
      tiers:Object.fromEntries(CATEGORY_IDS.map(category=>[category,tierForRating(ratings[category])])),
      ratingSources:sources,
      reviewStatus:statuses,
      divisionRatings,
      divisionTiers:Object.fromEntries(Object.entries(divisionRatings).map(([division,rating])=>[division,tierForRating(rating)])),
      divisionSources,
      divisionReviewStatus:divisionStatuses,
      eligibility,
      overallReviewStatus:Object.values(statuses).includes('provisional')||Object.values(divisionStatuses).includes('provisional')?'provisional':'ready'
    };
  }

  function matches(entry,filters={}){
    if(filters.gender&&filters.gender!=='all'&&entry.gender!==filters.gender)return false;
    if(filters.division&&filters.division!=='all'&&!entry.divisions.some(division=>normal(division)===normal(filters.division)))return false;
    if(filters.tier&&filters.tier!=='all'&&entry.tiers?.[filters.category]!==filters.tier)return false;
    if(filters.reviewStatus&&filters.reviewStatus!=='all'&&entry.overallReviewStatus!==filters.reviewStatus)return false;
    return true;
  }

  function buildAudit(entries){
    const errors=[];
    const rosterIds=new Set(PLAY_DATA.allFighters.map(fighter=>fighter.id));
    const entryIds=new Set(entries.map(entry=>entry.id));
    const missingFighters=PLAY_DATA.allFighters.filter(fighter=>!entryIds.has(fighter.id)).map(fighter=>fighter.name);
    const orphanedEntries=entries.filter(entry=>!rosterIds.has(entry.id)).map(entry=>entry.name);
    const missingRatings={};
    const invalidRatings={};
    const tierCounts={};
    const sourceCounts={};
    const statusCounts={};

    CATEGORY_IDS.forEach(category=>{
      missingRatings[category]=entries.filter(entry=>!Number.isFinite(Number(entry.ratings?.[category]))).map(entry=>entry.name);
      invalidRatings[category]=entries.filter(entry=>Number(entry.ratings?.[category])<0||Number(entry.ratings?.[category])>100).map(entry=>entry.name);
      tierCounts[category]=Object.fromEntries(TIER_BANDS.map(tier=>[tier.id,entries.filter(entry=>entry.tiers?.[category]===tier.id).length]));
      sourceCounts[category]=entries.reduce((counts,entry)=>{
        const source=entry.ratingSources?.[category]||'missing';
        counts[source]=(counts[source]||0)+1;
        return counts;
      },{});
      statusCounts[category]=entries.reduce((counts,entry)=>{
        const status=entry.reviewStatus?.[category]||'missing';
        counts[status]=(counts[status]||0)+1;
        return counts;
      },{});
    });

    entries.forEach(entry=>{
      if(!entry.divisions.length)errors.push(`${entry.name} has no division eligibility.`);
      entry.divisions.forEach(division=>{
        if(!Number.isFinite(Number(entry.divisionRatings?.[division])))errors.push(`${entry.name} is missing a ${division} rating.`);
      });
    });

    if(missingFighters.length)errors.push(`Missing roster fighters: ${missingFighters.join(', ')}`);
    if(orphanedEntries.length)errors.push(`Orphaned rating entries: ${orphanedEntries.join(', ')}`);
    CATEGORY_IDS.forEach(category=>{
      if(missingRatings[category].length)errors.push(`${category} missing ${missingRatings[category].length} ratings.`);
      if(invalidRatings[category].length)errors.push(`${category} has ${invalidRatings[category].length} invalid ratings.`);
    });

    return {
      passed:errors.length===0,
      errors,
      rosterTotal:PLAY_DATA.allFighters.length,
      ledgerTotal:entries.length,
      modelRanked:entries.filter(entry=>entry.modelRanked).length,
      playOnly:entries.filter(entry=>!entry.modelRanked).length,
      ready:entries.filter(entry=>entry.overallReviewStatus==='ready').length,
      provisional:entries.filter(entry=>entry.overallReviewStatus==='provisional').length,
      missingFighters,
      orphanedEntries,
      missingRatings,
      invalidRatings,
      tierCounts,
      sourceCounts,
      statusCounts
    };
  }

  let lastSignature='';
  function rebuild(){
    PLAY_DATA.rebuild?.();
    const entries=PLAY_DATA.poolFor('keep-cut').map(buildEntry);
    api.entries.splice(0,api.entries.length,...entries);
    api.byId=Object.fromEntries(entries.map(entry=>[entry.id,entry]));
    api.byName=Object.fromEntries(entries.map(entry=>[normal(entry.name),entry]));
    api.audit=buildAudit(entries);

    const signature=`${api.audit.rosterTotal}|${api.audit.ledgerTotal}|${api.audit.ready}|${api.audit.provisional}|${api.audit.passed}`;
    document.documentElement.setAttribute('data-keep-cut-rating-ledger',VERSION);
    document.documentElement.setAttribute('data-keep-cut-rating-ledger-size',String(api.audit.ledgerTotal));
    document.documentElement.setAttribute('data-keep-cut-rating-ledger-audit',api.audit.passed?'passed':'failed');

    if(signature!==lastSignature){
      lastSignature=signature;
      window.dispatchEvent(new CustomEvent('ufc-keep-cut-ratings-ready',{detail:{version:VERSION,audit:api.audit}}));
    }
    return api;
  }

  window.UFC_KEEP_CUT_CATEGORY_RATINGS=api;
  rebuild();
  window.addEventListener('ufc-play-data-ready',rebuild);
  window.addEventListener('ufc-scoring-pipeline-ready',rebuild);
  window.addEventListener('ufc-division-era-depth-finalized',rebuild);
})();
