(function(){
  'use strict';
  const VERSION='compare-profiles-batch-one-current-audit-20260717a';
  const ONE_LINERS={
  "Ben Askren": "Elite wrestling reputation, disastrous UFC sample, perfect category trap.",
  "Cody Garbrandt": "A brilliant championship peak wrapped inside a wildly unstable career.",
  "Anthony Johnson": "Terrifying knockout power with two title losses defining the ceiling.",
  "Lyoto Machida": "The elusive karate champion who briefly looked impossible to solve.",
  "Josh Koscheck": "A durable TUF-era wrestler who lived just below championship level.",
  "Gilbert Melendez": "A major UFC-only scope casualty whose best work happened before arrival.",
  "Rafael Fiziev": "Elite Muay Thai violence with renewed lightweight momentum and unfinished upside.",
  "Renato Moicano": "Submission craft, late-career growth, and personality across two divisions.",
  "Mackenzie Dern": "UFC strawweight champion and the roster’s clearest elite grappling specialist.",
  "Germaine de Randamie": "Championship-level kickboxing with an underfilled, inactivity-limited résumé.",
  "Jessica Eye": "A real title challenger who adds honest lower-tier career and finishing traps.",
  "Bethe Correia": "Personality, recognition, and a title shot without elite résumé depth."
};
  const PROFILE_OVERRIDES={
  "Rafael Fiziev": {
    "shortCase": "Fiziev is the action-striker contender: elite kicking offense, speed, combinations, and renewed momentum in a deep lightweight era.",
    "peak": "Layered Muay Thai, body work, counters, balance, and sudden finishing combinations define his best performances.",
    "resume": "Strong lightweight wins and highlight finishes are balanced by losses before sustained title-level separation.",
    "championship": "No UFC title fights.",
    "opponentQuality": "Rafael dos Anjos, Bobby Green, Renato Moicano, Brad Riddell, Marc Diakiese, and his later comeback wins.",
    "longevity": "His contender window has been meaningful, with injury interruptions and a later return to winning form.",
    "counter": "He still lacks championship fights and deep top-five win volume.",
    "edge": "He wins striking, action, finishing-threat, and What-If debates.",
    "signatureWins": "Rafael dos Anjos, Bobby Green, Renato Moicano, Brad Riddell, Marc Diakiese, and his later comeback wins.",
    "titleSummary": "No UFC title-fight wins.",
    "primeSummary": "A dangerous modern lightweight striking peak with renewed momentum after injury interruptions.",
    "legacyStats": {
      "titleFightWins": 0,
      "beltsWon": 0,
      "titleDefenses": 0,
      "activeEliteYearsLabel": "roughly 4 active elite years",
      "primeNote": "high-level Muay Thai contender run with major action value and incomplete title proof"
    }
  },
  "Renato Moicano": {
    "shortCase": "Moicano is the adaptable grappling veteran: elite back-taking, improved pressure boxing, two-division relevance, and a late lightweight surge that reached a title opportunity.",
    "peak": "Long-range combinations, reactive takedowns, back control, submissions, cardio, and veteran adjustments form a complete style.",
    "resume": "The UFC résumé now includes useful depth across featherweight and lightweight, a short-notice title challenge, and continued relevance afterward.",
    "championship": "He challenged Islam Makhachev for the lightweight title on short notice but did not win it.",
    "opponentQuality": "Benoît Saint Denis, Jalin Turner, Drew Dober, Brad Riddell, Calvin Kattar, Jeremy Stephens, and Chris Duncan.",
    "longevity": "Longevity is a strength because he remained relevant through a division move and multiple career phases.",
    "counter": "The best opponents have often beaten him, and there is no championship win.",
    "edge": "He wins versatility, grappling, longevity, personality, and solid-win-depth debates.",
    "signatureWins": "Benoît Saint Denis, Jalin Turner, Drew Dober, Brad Riddell, Calvin Kattar, Jeremy Stephens, and Chris Duncan.",
    "titleSummary": "One UFC lightweight title loss and no title-fight wins.",
    "primeSummary": "A late-developing two-division prime built around submissions, improved pressure striking, and veteran composure.",
    "legacyStats": {
      "titleFightWins": 0,
      "beltsWon": 0,
      "titleDefenses": 0,
      "activeEliteYearsLabel": "roughly 7 active elite years",
      "primeNote": "two-division veteran prime with elite grappling, a late lightweight surge, and one short-notice title opportunity"
    }
  },
  "Mackenzie Dern": {
    "shortCase": "Dern is the UFC strawweight champion and elite-submission specialist: world-class grappling, improving striking, and championship proof.",
    "peak": "Scrambles, guard exchanges, back takes, opportunistic submissions, and improved pressure create constant danger.",
    "resume": "The UFC résumé now includes a championship win, several ranked-level victories, and enough adversity to show meaningful development.",
    "championship": "She won the UFC strawweight title in 2025 and entered 2026 as champion.",
    "opponentQuality": "Virna Jandiroba, Amanda Ribas, Loopy Godinez, Angela Hill, Tecia Torres, Nina Nunes, Hannah Cifers, and Randa Markos.",
    "longevity": "She has maintained relevance for years and remains in an active championship window.",
    "counter": "Striking defense and inconsistent takedown entries remain the clearest weaknesses.",
    "edge": "She wins grappling, submission-threat, championship, and specialist-versus-complete debates.",
    "signatureWins": "Virna Jandiroba, Amanda Ribas, Loopy Godinez, Angela Hill, Tecia Torres, Nina Nunes, Hannah Cifers, and Randa Markos.",
    "titleSummary": "One UFC strawweight title win with no completed defense yet.",
    "primeSummary": "A championship-level specialist prime whose grappling ceiling remains among the best in the sport.",
    "legacyStats": {
      "titleFightWins": 1,
      "beltsWon": 1,
      "titleDefenses": 0,
      "activeEliteYearsLabel": "roughly 6 active elite years",
      "primeNote": "elite submission threat that converted improving MMA skills into a UFC championship"
    }
  }
};
  window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  Object.entries(ONE_LINERS).forEach(([name,oneLiner])=>{
    window.DISPLAY_OVERRIDES[name]={...(window.DISPLAY_OVERRIDES[name]||{}),oneLiner};
  });
  Object.entries(PROFILE_OVERRIDES).forEach(([name,profile])=>{
    window.COMPARE_PROFILES[name]={
      ...(window.COMPARE_PROFILES[name]||{}),
      ...profile,
      legacyStats:{...((window.COMPARE_PROFILES[name]||{}).legacyStats||{}),...(profile.legacyStats||{})}
    };
    window.DISPLAY_OVERRIDES[name]={
      ...(window.DISPLAY_OVERRIDES[name]||{}),
      compareProfile:{
        ...(window.DISPLAY_OVERRIDES[name]?.compareProfile||{}),
        ...window.COMPARE_PROFILES[name],
        legacyStats:{...((window.DISPLAY_OVERRIDES[name]?.compareProfile||{}).legacyStats||{}),...(window.COMPARE_PROFILES[name].legacyStats||{})}
      }
    };
  });
  window.COMPARE_FIGHT_LEDGER={
    ...(window.COMPARE_FIGHT_LEDGER||{}),
    'jessica andrade|mackenzie dern':{
      fighters:['Jessica Andrade','Mackenzie Dern'],fights:1,winner:'Jessica Andrade',importance:'contextual',
      summary:'Andrade stopped Dern before Dern’s later championship rise, making it an important developmental loss rather than complete career separation.'
    }
  };
  document.documentElement.setAttribute('data-compare-profiles-batch-one-current-audit',VERSION);
})();
