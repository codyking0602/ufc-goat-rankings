// Personable leaderboard pill taglines for current and future fighters.
// Keeps short app-facing personality copy separate from scoring and ranking data.
(function(){
  'use strict';

  const VERSION='fighter-tagline-system-20260717a-brandon-moreno';
  const CHARLES_WATCH_URL='https://youtube.com/shorts/zHUAvACSUk4?is=VYzwsuIvxV85k8zH';
  const TAGLINES=Object.freeze({
    'Jon Jones':'The standard everyone chases',
    'Georges St-Pierre':'No weakness left unanswered',
    'Demetrious Johnson':'Precision at full speed',
    'Anderson Silva':'A highlight waiting to happen',
    'Islam Makhachev':'Control with a finishing switch',
    'Khabib Nurmagomedov':'Once he grabbed you, it was over',
    'Alexander Volkanovski':'Built for every kind of fight',
    'Randy Couture':'Championship grit in any division',
    'Max Holloway':'The pace never lets up',
    'Kamaru Usman':'Pressure that breaks people',
    'Leon Edwards':'Calm precision until the opening appears',
    'Jose Aldo':'Fast, violent, built to last',
    'Matt Hughes':'Old-school power and control',
    'Daniel Cormier':'Short reach, enormous problems',
    'Stipe Miocic':'Calm hands, heavyweight damage',
    'Ilia Topuria':'Confidence backed by knockout power',
    'Israel Adesanya':'Makes the cage feel like his stage',
    'Cain Velasquez':'Heavyweight pace nobody wanted',
    'Petr Yan':'Five-round problem solver',
    'Merab Dvalishvili':'The pace is the weapon',
    'B.J. Penn':'Natural talent with no fear',
    'BJ Penn':'Natural talent with no fear',
    'Alex Pereira':'One left hook changes everything',
    'Chuck Liddell':'The right hand everyone feared',
    'Dominick Cruz':'Angles nobody could copy',
    'Francis Ngannou':'One clean shot is enough',
    'Charles Oliveira':'Chaos, courage, and submissions',
    'Henry Cejudo':'Small frame, giant ambition',
    'Conor McGregor':'Precision, swagger, and timing',
    'Justin Gaethje':'Violence with elite fundamentals',
    'Frankie Edgar':'Never out of the fight',
    'Dustin Poirier':'Built for wars and late rounds',
    'Tony Ferguson':'Chaos nobody could prepare for',
    'T.J. Dillashaw':'Relentless movement and pressure',
    'TJ Dillashaw':'Relentless movement and pressure',
    'Aljamain Sterling':'Back control changes everything',
    'Dricus du Plessis':'Awkward, relentless, effective',
    'Tyron Woodley':'Explosive enough to end it instantly',
    'Brock Lesnar':'Pure athletic force',
    'Junior dos Santos':'Boxing built for heavyweights',
    'Tito Ortiz':'Ground-and-pound era setter',
    'Robbie Lawler':'The fight gets better when it gets ugly',
    'Chael Sonnen':'Pressure, pace, and nonstop talk',
    'Dan Henderson':'The right hand aged like granite',
    'Amanda Nunes':'Power that cleared two divisions',
    'Valentina Shevchenko':'Cold precision everywhere',
    'Joanna Jedrzejczyk':'Championship pace and combinations',
    'Ronda Rousey':'Armbar pressure before the bell',
    'Cris Cyborg':'Forward pressure with bad intentions',
    'Zhang Weili':'Explosive in every phase',
    'Rose Namajunas':'Calm, creative, dangerous',
    'Miesha Tate':'Heart that survives bad positions',
    'Mackenzie Dern':'One scramble from a submission',
    'Kayla Harrison':'Olympic pressure in the cage',
    'Jessica Andrade':'Compact power with no reverse gear',
    'Alexa Grasso':'Sharp boxing and perfect timing',
    'Julianna Peña':'Belief that never backs down',
    'Carla Esparza':'Wrestling that steals your rhythm',
    'Holly Holm':'Footwork, discipline, and the left kick',
    'Deiveson Figueiredo':'Flyweight power with bad intentions',
    'Alexandre Pantoja':'Pressure that never gives you space',
    'Brandon Moreno':'Heart, scrambles, and championship grit',
    'Lyoto Machida':'One opening, one clean counter',
    'Khamzat Chimaev':'Pressure from the opening second',
    'Sean Strickland':'Jab, defense, and pure stubbornness',
    'Robert Whittaker':'Footwork built for elite chaos',
    "Sean O'Malley":'Range, timing, and star power',
    'Michael Bisping':'Outworked doubt for a decade',
    'Royce Gracie':'The blueprint for early MMA',
    'Ken Shamrock':'The original dangerous grappler',
    'Frank Shamrock':'Ahead of his time everywhere',
    'Benson Henderson':'Scrambles, cardio, and close rounds',
    'Glover Teixeira':'Old-school grit, late-career gold',
    'Mauricio Rua':'Violence with championship history',
    'Maurício Rua':'Violence with championship history',
    'Mauricio "Shogun" Rua':'Violence with championship history',
    'Forrest Griffin':'Made chaos look like a plan',
    'Rashad Evans':'Speed, timing, and big-fight nerve',
    'Vitor Belfort':'Fast hands before anyone was ready',
    'Fabricio Werdum':'Heavyweight grappling with a grin',
    'Paddy Pimblett':'Chaos, confidence, and submissions',
    'Chris Weidman':'The upset that changed middleweight',
    'Tom Aspinall':'Heavyweight speed with no wasted motion',
    'Quinton Jackson':'Power, swagger, and big-fight violence'
  });

  const PHRASES=Object.freeze({
    championship:Object.freeze(['Built for championship nights','Comfortable under the brightest lights','A five-round problem']),
    opponentQuality:Object.freeze(['Never took the easy road','A career full of dangerous names','Always tested against the best']),
    primeDominance:Object.freeze(['Made elite opponents look ordinary','At his best, the cage felt small','Peak form was a nightmare']),
    longevity:Object.freeze(['Elite across generations','Still dangerous after the era changed','Built to last']),
    apexPeak:Object.freeze(['Peak form made every second matter','Big moments always found him','The highlight was never far away']),
    clean:Object.freeze(['Almost impossible to crack','Hard to solve, harder to finish','Rarely gave anyone a clean answer']),
    fallback:Object.freeze(['Always one moment from changing a fight','Dangerous wherever the fight goes','Never an easy night for anyone'])
  });

  function hashFor(name){
    return Array.from(String(name||'')).reduce((hash,char)=>((hash*31)+char.charCodeAt(0))>>>0,7);
  }
  function phraseFor(group,name){
    const choices=PHRASES[group]||PHRASES.fallback;
    return choices[hashFor(name)%choices.length];
  }
  function strongestCategory(fighter){
    if(typeof window.categoryOvr!=='function')return null;
    const categories=['championship','opponentQuality','primeDominance','longevity','apexPeak'];
    return categories.map(key=>({key,rating:Number(window.categoryOvr(fighter,key)||0)})).sort((a,b)=>b.rating-a.rating)[0]?.key||null;
  }
  function automaticTagline(fighter){
    const name=String(fighter?.fighter||'').trim();
    const penalty=Number(fighter?.penalty??fighter?.lossPenalty??0);
    if(penalty===0)return phraseFor('clean',name);
    const strongest=strongestCategory(fighter);
    return phraseFor(strongest||'fallback',name);
  }
  function taglineFor(fighter){
    const name=String(fighter?.fighter||'').trim();
    return TAGLINES[name]||automaticTagline(fighter);
  }
  function syncCharlesWatchMoment(){
    window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
    window.DISPLAY_OVERRIDES['Charles Oliveira']=window.DISPLAY_OVERRIDES['Charles Oliveira']||{};
    window.DISPLAY_OVERRIDES['Charles Oliveira'].watchUrl=CHARLES_WATCH_URL;
    document.querySelectorAll('.fighter-row[data-fighter="Charles Oliveira"] .watch-moment-link').forEach(link=>{link.href=CHARLES_WATCH_URL;});
  }
  function install(){
    window.resumeTagFor=taglineFor;
    window.UFC_FIGHTER_TAGLINE_SYSTEM={version:VERSION,taglines:TAGLINES,taglineFor,automaticTagline,mutatesScores:false};
    document.documentElement.setAttribute('data-fighter-tagline-system',VERSION);
    syncCharlesWatchMoment();
    window.addEventListener('ufc-ranking-data-patches-ready',syncCharlesWatchMoment);
    if(typeof window.refresh==='function')window.refresh();
  }

  install();
})();