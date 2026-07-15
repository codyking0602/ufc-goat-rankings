// Fighter-card personality copy and durable app-facing Watch Moment corrections.
(function(){
  'use strict';

  const VERSION='fighter-card-personality-20260715a';
  const CHARLES_WATCH_URL='https://youtube.com/shorts/zHUAvACSUk4?is=VYzwsuIvxV85k8zH';
  const GENERIC_TAG_PATTERN=/\b(?:ufc|resume|résumé)\b/i;

  const PERSONAL_TAGLINES=Object.freeze({
    'Jon Jones':'The measuring stick',
    'Georges St-Pierre':'The complete champion',
    'Demetrious Johnson':'Precision in motion',
    'Anderson Silva':'The aura was different',
    'Islam Makhachev':'Control with bad intentions',
    'Khabib Nurmagomedov':'Nobody could stop the ride',
    'Alexander Volkanovski':'Five-round problem solver',
    'Randy Couture':'The ageless title thief',
    'Max Holloway':'Volume turned into violence',
    'Kamaru Usman':'Pressure that never blinked',
    'Jose Aldo':'Fast, mean, built to last',
    'Matt Hughes':'Farm strength with a belt',
    'Daniel Cormier':'Clinch bully, double champ',
    'Stipe Miocic':'Firefighter, record setter',
    'Dricus du Plessis':'Chaos that keeps working',
    'Tyron Woodley':'Right hand, red alert',
    'Ilia Topuria':'Calm before the knockout',
    'Israel Adesanya':'Feints, reads, receipts',
    'Aljamain Sterling':'Backpack with a belt',
    'Petr Yan':'Slow start, savage finish',
    'Cain Velasquez':'Pace no heavyweight wanted',
    'Brock Lesnar':'Freak athlete, instant threat',
    'Merab Dvalishvili':'A cardio avalanche',
    'B.J. Penn':'The Prodigy for a reason',
    'BJ Penn':'The Prodigy for a reason',
    'Dustin Poirier':'Diamond under pressure',
    'Tony Ferguson':'Beautiful, violent chaos',
    'T.J. Dillashaw':'Angles, pace, bad intentions',
    'TJ Dillashaw':'Angles, pace, bad intentions',
    'Alex Pereira':'Left hook from hell',
    'Chuck Liddell':'Sprawl, brawl, lights out',
    'Tito Ortiz':'Ground-and-pound pioneer',
    'Junior dos Santos':'Cigano’s boxing clinic',
    'Dominick Cruz':'Footwork nobody could copy',
    'Francis Ngannou':'One touch changed everything',
    'Charles Oliveira':'Knock him down, wake him up',
    'Henry Cejudo':'Gold medals and gold belts',
    'Conor McGregor':'Precision made him famous',
    'Justin Gaethje':'Violence with championship pace',
    'Frankie Edgar':'Never out of the fight',
    'Deiveson Figueiredo':'Flyweight with heavyweight menace',
    'Khamzat Chimaev':'Smash first, ask later',
    'Lyoto Machida':'The Dragon made distance dangerous',
    'Sean Strickland':'Jab, pressure, zero fear',
    'Robert Whittaker':'Blitzes, balance, class',
    "Sean O'Malley":'Sniper with superstar timing',
    'Michael Bisping':'One eye, one perfect night',
    'Dan Henderson':'The H-Bomb always mattered',
    'Chael Sonnen':'Talked big, wrestled bigger',
    'Robbie Lawler':'Violence with a poker face',
    'Leon Edwards':'Headshot, dead quiet confidence',
    'Frank Shamrock':'The first complete champion',
    'Royce Gracie':'The original proof of concept',
    'Benson Henderson':'Toothpick, scrambles, five-round grit',
    'Glover Teixeira':'Late-career title fairy tale',
    'Mauricio Rua':'Chute Boxe violence, championship gold',
    'Maurício Rua':'Chute Boxe violence, championship gold',
    'Forrest Griffin':'Heart turned into history',
    'Rashad Evans':'Speed, wrestling, one clean shot',
    'Vitor Belfort':'Fast hands, faster endings',
    'Fabricio Werdum':'Smiling while setting traps',
    'Ken Shamrock':'The World’s Most Dangerous pioneer',
    'Amanda Nunes':'The Lioness ate legends',
    'Valentina Shevchenko':'Surgical from every range',
    'Zhang Weili':'Power, pace, complete game',
    'Rose Namajunas':'Thug Rose at her sharpest',
    'Miesha Tate':'Survived, scrambled, stole the belt',
    'Mackenzie Dern':'One scramble from danger',
    'Kayla Harrison':'Olympic pressure, championship force',
    'Jessica Andrade':'A compact wrecking ball',
    'Alexa Grasso':'Calm hands, championship nerve',
    'Julianna Peña':'Believed before anyone else',
    'Julianna Pena':'Believed before anyone else',
    'Carla Esparza':'Wrestling that won two eras',
    'Holly Holm':'One kick changed everything',
    'Joanna Jedrzejczyk':'Pace, volume, championship fire',
    'Ronda Rousey':'Armbar before you settled in',
    'Cris Cyborg':'Pressure that felt inevitable'
  });

  const FALLBACKS=Object.freeze({
    championship:Object.freeze(['Built for championship nights','At home under the bright lights','Five-round confidence']),
    quality:Object.freeze(['Always found the hard fight','Big-name problem','Danger rose with the opponent']),
    finishing:Object.freeze(['One opening from the ending','Never far from a finish','Bad news once the opening appeared']),
    control:Object.freeze(['Won the minutes that mattered','Made every round uncomfortable','Control that wore people down']),
    longevity:Object.freeze(['Built to survive every era','Stayed dangerous longer than expected','Never gave the division a break']),
    clean:Object.freeze(['Harder to beat than the record says','Made winning look routine','Very few clean answers against this style']),
    general:Object.freeze(['Never an easy night','A style nobody enjoyed','Made the hard fights memorable'])
  });

  function hashName(name){
    return [...String(name||'')].reduce((hash,char)=>((hash*31)+char.charCodeAt(0))>>>0,7);
  }

  function pick(bucket,name){
    const choices=FALLBACKS[bucket]||FALLBACKS.general;
    return choices[hashName(name)%choices.length];
  }

  function fullRowFor(input){
    if(input&&typeof input==='object'&&input.fighter){
      const name=input.fighter;
      const profile=(window.RANKING_DATA?.fighters||[]).find(row=>row?.fighter===name)||{};
      const board=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])].find(row=>row?.fighter===name)||{};
      return {...profile,...board,...input,fighter:name};
    }
    const name=String(input||'').trim();
    const profile=(window.RANKING_DATA?.fighters||[]).find(row=>row?.fighter===name)||{};
    const board=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])].find(row=>row?.fighter===name)||{};
    return {...profile,...board,fighter:name};
  }

  function fallbackTagline(input){
    const fighter=fullRowFor(input);
    const visible=fighter.visibleStats||{};
    const name=fighter.fighter||'This fighter';
    const titleWins=Number(visible.titleFightWins??fighter.titleFightWins??0);
    const topFiveWins=Number(visible.topFiveWins??fighter.topFiveWins??fighter.top5Wins??0);
    const finishRate=Number(visible.finishRatePct??fighter.finishRatePct??0);
    const roundsWon=Number(visible.roundsWonPct??fighter.roundsWonPct??0);
    const eliteYears=Number(visible.activeEliteYears??fighter.activeEliteYears??0);
    const penalty=Number(fighter.penalty??fighter.lossPenalty??-99);
    if(titleWins>=4)return pick('championship',name);
    if(topFiveWins>=5)return pick('quality',name);
    if(finishRate>=55)return pick('finishing',name);
    if(roundsWon>=65)return pick('control',name);
    if(eliteYears>=7)return pick('longevity',name);
    if(penalty>=-1.5)return pick('clean',name);
    return pick('general',name);
  }

  function taglineFor(input){
    const fighter=fullRowFor(input);
    const name=fighter.fighter;
    if(PERSONAL_TAGLINES[name])return PERSONAL_TAGLINES[name];
    const override=window.DISPLAY_OVERRIDES?.[name]?.resumeTag;
    if(override&&!GENERIC_TAG_PATTERN.test(String(override)))return String(override).trim();
    return fallbackTagline(fighter);
  }

  function installTaglineOwner(){
    window.resumeTagFor=taglineFor;
  }

  function applyTaglines(){
    document.querySelectorAll('#menList .fighter-row[data-fighter],#womenList .fighter-row[data-fighter],#divisionList .fighter-row[data-fighter]').forEach(row=>{
      const target=row.querySelector('.resume-tag');
      if(!target)return;
      const tagline=taglineFor(row.dataset.fighter);
      if(target.textContent.trim()!==tagline)target.textContent=tagline;
    });
  }

  function applyCharlesWatchMoment(){
    const overrides=window.DISPLAY_OVERRIDES||(window.DISPLAY_OVERRIDES={});
    overrides['Charles Oliveira']={...(overrides['Charles Oliveira']||{}),watchUrl:CHARLES_WATCH_URL,watchLabel:'Watch Moment'};
    document.querySelectorAll('.fighter-row[data-fighter="Charles Oliveira"] .watch-moment-link').forEach(link=>{
      if(link.getAttribute('href')!==CHARLES_WATCH_URL)link.setAttribute('href',CHARLES_WATCH_URL);
    });
  }

  function publish(){
    window.UFC_FIGHTER_CARD_PERSONALITY={
      version:VERSION,
      curatedCount:Object.keys(PERSONAL_TAGLINES).length,
      charlesWatchUrl:CHARLES_WATCH_URL,
      genericTagPattern:GENERIC_TAG_PATTERN.source,
      taglineFor,
      fallbackTagline,
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false
    };
    document.documentElement.setAttribute('data-fighter-card-personality',VERSION);
  }

  let queued=false;
  function apply(){
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{
      queued=false;
      installTaglineOwner();
      applyTaglines();
      applyCharlesWatchMoment();
      publish();
    });
  }

  const observer=new MutationObserver(apply);
  observer.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('ufc-scoring-pipeline-ready',apply);
  window.addEventListener('ufc-ranking-data-patches-ready',apply);
  window.addEventListener('ufc-production-ranking-ready',apply);
  apply();
})();
