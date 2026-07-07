// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
(function () {
  const PACK_PROFILES = {
    "Alex Pereira": {
      shortCase: "Pereira is the fast-climb, two-division knockout case: middleweight gold, light heavyweight gold, huge title moments, and one of the loudest short UFC primes ever.",
      peak: "At his best, Pereira was terrifying because every exchange carried fight-ending danger. The left hook, calf kicks, patience, size, and championship composure made him feel different from normal contenders.",
      resume: "Pereira's UFC case is short but extremely loud. He does not have the long active-elite window of the older legends, but the title value and finish impact are massive.",
      championship: "His championship case is the separator: he won UFC titles in two divisions and stacked high-profile light heavyweight title wins in a very short period.",
      opponentQuality: "Adesanya, Prochazka twice, Hill, Blachowicz, Strickland, and Rountree give Pereira a compact but high-impact UFC win list.",
      longevity: "Longevity is the limiter. Pereira rose fast and did a lot quickly, but he still trails the long-reign legends in active elite years.",
      counter: "The argument against Pereira is volume. The peak is huge, but the UFC sample is still shorter than the deepest all-time cases.",
      edge: "Pereira wins comparisons when two-division title value, knockout danger, and high-impact championship moments outweigh longer but less explosive resumes.",
      eliteCounter: true,
      signatureWins: "Adesanya, Prochazka twice, Hill, Blachowicz, Strickland, and Rountree give Pereira one of the loudest short-run win lists in the ranking.",
      titleSummary: "Pereira's title case is built on winning UFC gold at middleweight and light heavyweight, then adding major light heavyweight title wins almost immediately.",
      primeSummary: "His elite window is short compared with long-reign champions, but the damage done inside that window is enormous.",
      titleStyle: "fastTwoDivisionChampion",
      primeStyle: "shortKnockoutPrime",
      legacyStats: {
        titleFightWins: 5,
        beltsWon: 2,
        titleDefenses: 3,
        activeEliteYearsLabel: "roughly 3 active elite years",
        primeNote: "short explosive two-division title run built on knockout danger and fast championship volume"
      }
    },
    "Ilia Topuria": {
      shortCase: "Topuria is the new-era featherweight takeover case: unbeaten UFC run, wins over legends, title-level finishing power, and a resume that is already loud even while still building.",
      peak: "At his best, Topuria is boxing power, grappling threat, confidence, pressure, and finishing instincts. He does not just win; he changes the temperature of a division fast.",
      resume: "Topuria's UFC case is still young, but the high end is already enormous because the Volkanovski and Holloway wins hit directly against featherweight history.",
      championship: "The championship case is smaller than the long-reign champions, but the title wins carry massive name value and era-shift weight.",
      opponentQuality: "Volkanovski, Holloway, Emmett, Mitchell, Ryan Hall, and Jai Herbert give Topuria a fast-building quality-win case.",
      longevity: "Longevity is the obvious gap. Topuria's case is about peak and current title value, not years of proven elite volume yet.",
      counter: "The argument against Topuria is that he is still early. The top wins are huge, but he has not had time to build a long title reign.",
      edge: "Topuria wins comparisons when current peak value, unbeaten momentum, and direct wins over featherweight legends outweigh older fighters' longer volume.",
      eliteCounter: true,
      signatureWins: "Volkanovski, Holloway, Emmett, Mitchell, Ryan Hall, and Jai Herbert give Topuria a young but already serious featherweight resume.",
      titleSummary: "Topuria's title case is not long yet, but beating Volkanovski and Holloway gives it rare high-end featherweight value.",
      primeSummary: "His prime is still building, which makes the ceiling exciting but keeps the all-time case less proven than the long-reign champions.",
      titleStyle: "newEraTitleTakeover",
      primeStyle: "stillBuildingPeak",
      legacyStats: {
        titleFightWins: 2,
        beltsWon: 1,
        titleDefenses: 1,
        activeEliteYearsLabel: "roughly 3 active elite years",
        primeNote: "young but explosive title-level run built around direct wins over featherweight legends"
      }
    },
    "Francis Ngannou": {
      shortCase: "Ngannou is the heavyweight terror case: historic power, a title win over Stipe, a defense over Gane, and a prime that felt more dangerous than almost anyone's.",
      peak: "At his best, Ngannou was pure consequence. His power changed every fight, and the improved patience and wrestling defense later in his UFC run made him more complete than the early version.",
      resume: "Ngannou's UFC resume is strong but shorter than Stipe's. The high-end wins are massive, but the UFC exit capped the long-term title volume.",
      championship: "The championship case is real: he knocked out Stipe to win the heavyweight belt and defended it by beating Gane in a very different kind of fight.",
      opponentQuality: "Stipe, Gane, Blaydes twice, Rozenstruik, dos Santos, Cain, Overeem, Arlovski, and Velasquez-era context give Ngannou a scary heavyweight win list.",
      longevity: "Ngannou had a strong elite window, but heavyweight volatility and the early UFC exit limit the all-time volume compared with Stipe.",
      counter: "The argument against Ngannou is title volume. His peak danger is obvious, but he does not have the long UFC championship run of the top heavyweight resume case.",
      edge: "Ngannou wins comparisons when peak danger, heavyweight finishing power, and the Stipe title win matter more than long reign volume.",
      eliteCounter: true,
      signatureWins: "Stipe, Gane, Blaydes twice, Rozenstruik, dos Santos, Cain, Overeem, and Arlovski give Ngannou a dangerous heavyweight win list.",
      titleSummary: "Ngannou's title case is built on knocking out Stipe for the heavyweight belt and defending against Gane, though the UFC run ended before he could stack long-reign volume.",
      primeSummary: "His prime was terrifying and more complete by the end, but shorter than the deepest heavyweight championship cases.",
      titleStyle: "heavyweightPowerChampion",
      primeStyle: "terrifyingHeavyweightPeak",
      legacyStats: {
        titleFightWins: 2,
        beltsWon: 1,
        titleDefenses: 1,
        activeEliteYearsLabel: "roughly 4 active elite years",
        primeNote: "short heavyweight title peak with historic power and a capped UFC championship window"
      }
    },
    "Merab Dvalishvili": {
      shortCase: "Merab is the modern bantamweight pace-and-volume case: relentless pressure, elite wins across the division, and a title run that keeps gaining weight.",
      peak: "At his best, Merab is pace, wrestling pressure, cardio, scrambles, chain attacks, and mental exhaustion. He makes great fighters spend every second defending.",
      resume: "Merab's UFC case has grown from contender volume into real title value. The names are strong, and the division context is one of the toughest in the sport.",
      championship: "The championship case is still newer than the long-reign legends, but winning and defending the bantamweight title in this era carries serious weight.",
      opponentQuality: "O'Malley, Umar, Cejudo, Yan, Aldo, Moraes, Dodson, and Stamann give Merab one of the best modern bantamweight win lists.",
      longevity: "Merab's active elite years are building, and his pace-heavy style gives him a strong prime-dominance argument even without a decade-long reign yet.",
      counter: "The argument against Merab is that the title run is still young. The opponent quality is excellent, but the championship volume has to keep growing.",
      edge: "Merab wins comparisons when modern bantamweight strength, elite contender wins, and pace dominance matter more than old-school title volume.",
      eliteCounter: true,
      signatureWins: "O'Malley, Umar, Cejudo, Yan, Aldo, Moraes, Dodson, and Stamann give Merab an elite modern bantamweight resume.",
      titleSummary: "Merab's title case is newer, but winning and defending the bantamweight belt in this era gives it real modern-division value.",
      primeSummary: "His prime is built on relentless pace and a run through elite bantamweights rather than one massive long reign so far.",
      titleStyle: "modernBantamweightChampion",
      primeStyle: "paceVolumePrime",
      legacyStats: {
        titleFightWins: 3,
        beltsWon: 1,
        titleDefenses: 2,
        activeEliteYearsLabel: "roughly 5 active elite years",
        primeNote: "modern bantamweight pace prime with elite contender wins and a growing title run"
      }
    },
    "Amanda Nunes": {
      shortCase: "Nunes is the women's GOAT standard: two-division champion, massive title-fight volume, legendary finishes, and wins over nearly every major name from her era.",
      peak: "At her best, Nunes was power, athleticism, takedown defense, jiu-jitsu, confidence, and finishing danger. She could erase great fighters quickly or beat them over five rounds.",
      resume: "Nunes has the strongest women's UFC resume: bantamweight reign, featherweight title value, Shevchenko rivalry, Cyborg knockout, Rousey finish, and years of title control.",
      championship: "Her championship case is the clearest among women. She won belts in two divisions, defended repeatedly, avenged the Pena loss, and retired with the resume still intact.",
      opponentQuality: "Shevchenko twice, Cyborg, Rousey, Holm, Tate, de Randamie, Pena, Aldana, Spencer, and Anderson give Nunes the deepest women's win list.",
      longevity: "Nunes stayed elite across a long title window and did it in two divisions, which gives her a separation point over shorter peak cases.",
      counter: "The only real argument against Nunes is the Pena upset and the fact that women's featherweight depth was thin. It matters, but it does not erase the whole case.",
      edge: "Nunes wins women's comparisons when total title weight, two-division value, and elite-name wins are the deciding factors.",
      eliteCounter: true,
      signatureWins: "Shevchenko twice, Cyborg, Rousey, Holm, Tate, de Randamie, Pena, Aldana, Spencer, and Megan Anderson give Nunes the deepest women's UFC win list.",
      titleSummary: "Nunes has the strongest women's UFC title case: two belts, repeated defenses, a Cyborg knockout, and the Pena revenge win.",
      primeSummary: "Her elite window was long, violent, and title-heavy, with enough two-division value to separate her from every other women's case.",
      titleStyle: "womenGoatTwoDivisionChampion",
      primeStyle: "longViolentTitlePrime",
      legacyStats: {
        titleFightWins: 11,
        beltsWon: 2,
        titleDefenses: 7,
        activeEliteYearsLabel: "roughly 7 active elite years",
        primeNote: "long two-division title prime with the deepest women's UFC win list"
      }
    },
    "Valentina Shevchenko": {
      shortCase: "Valentina is the clean technical champion case: long flyweight reign, elite skill, high opponent quality, and a resume that only trails Nunes because of direct rivalry and two-division title value.",
      peak: "At her best, Valentina was balance, timing, counters, clinch control, kicks, grappling, and five-round composure. She made championship fights feel controlled and technical.",
      resume: "Valentina's UFC resume is built on flyweight dominance plus high-level bantamweight context. The Nunes losses matter, but they also show she was competitive with the women's GOAT standard.",
      championship: "Her championship case is excellent: long flyweight title reign, repeated defenses, and a later title regain that keeps the story from ending with the Grasso loss.",
      opponentQuality: "Joanna, Andrade, Holm, Pena, Chookagian, Murphy, Carmouche, Maia, Santos, Grasso, and Eye give Valentina a strong cross-division UFC win list.",
      longevity: "Valentina stayed elite for years, across bantamweight and flyweight, with one of the longest high-level windows in women's UFC history.",
      counter: "The argument against Valentina is Nunes. She came close, but Nunes owns the direct edge and the stronger two-division championship case.",
      edge: "Valentina wins comparisons when technical dominance, long flyweight control, and active elite years outweigh bigger but shorter peak cases.",
      eliteCounter: true,
      signatureWins: "Joanna, Andrade, Holm, Pena, Chookagian, Murphy, Carmouche, Maia, Santos, Grasso, and Eye give Valentina a deep women's UFC resume.",
      titleSummary: "Valentina's title case is a long flyweight reign with repeated defenses and a title regain, but it does not have Nunes' two-division separation.",
      primeSummary: "Her elite window was long and technical, with years of title-level control across bantamweight and flyweight.",
      titleStyle: "technicalFlyweightStandard",
      primeStyle: "longTechnicalPrime",
      legacyStats: {
        titleFightWins: 9,
        beltsWon: 1,
        titleDefenses: 7,
        activeEliteYearsLabel: "roughly 8 active elite years",
        primeNote: "long technical flyweight title prime with strong bantamweight context"
      }
    }
  };

  const PACK_LEDGER = {
    "alex pereira|israel adesanya": {
      fighters: ["Alex Pereira", "Israel Adesanya"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "Pereira stopped Adesanya to win the middleweight title, then Adesanya knocked Pereira out in the rematch to regain it. In UFC terms, the rivalry is split."
    },
    "alex pereira|jiri prochazka": {
      fighters: ["Alex Pereira", "Jiri Prochazka"],
      fights: 2,
      winner: "Alex Pereira",
      importance: "major",
      summary: "Pereira beat Prochazka twice in light heavyweight title fights, giving Alex a clean rivalry edge over one of the division's most dangerous champions."
    },
    "alex pereira|jan blachowicz": {
      fighters: ["Alex Pereira", "Jan Blachowicz"],
      fights: 1,
      winner: "Alex Pereira",
      importance: "contextual",
      summary: "Pereira beat Blachowicz in his light heavyweight debut, a key bridge win before Alex became champion in the division."
    },
    "alex pereira|jamahal hill": {
      fighters: ["Alex Pereira", "Jamahal Hill"],
      fights: 1,
      winner: "Alex Pereira",
      importance: "major",
      summary: "Pereira knocked out Hill in a light heavyweight title fight, adding a former champion to his short but loud title resume."
    },
    "alexander volkanovski|ilia topuria": {
      fighters: ["Alexander Volkanovski", "Ilia Topuria"],
      fights: 1,
      winner: "Ilia Topuria",
      importance: "major",
      summary: "Topuria knocked out Volkanovski to win the featherweight title, giving Ilia a direct era-shifting win over one of the division's greatest champions."
    },
    "ilia topuria|max holloway": {
      fighters: ["Ilia Topuria", "Max Holloway"],
      fights: 1,
      winner: "Ilia Topuria",
      importance: "major",
      summary: "Topuria beat Holloway in a major featherweight legacy fight. Max still owns the longer all-time resume, but Ilia owns the direct result."
    },
    "francis ngannou|stipe miocic": {
      fighters: ["Francis Ngannou", "Stipe Miocic"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "Stipe controlled Ngannou in their first title fight, then Ngannou knocked him out in the rematch. The split keeps both heavyweight cases connected."
    },
    "ciryl gane|francis ngannou": {
      fighters: ["Ciryl Gane", "Francis Ngannou"],
      fights: 1,
      winner: "Francis Ngannou",
      importance: "major",
      summary: "Ngannou beat Gane in a heavyweight title defense, showing a more patient and wrestling-aware version of his championship game."
    },
    "curtis blaydes|francis ngannou": {
      fighters: ["Curtis Blaydes", "Francis Ngannou"],
      fights: 2,
      winner: "Francis Ngannou",
      importance: "contextual",
      summary: "Ngannou beat Blaydes twice, both by stoppage, which is important because Blaydes was one of the division's toughest wrestling tests."
    },
    "jose aldo|merab dvalishvili": {
      fighters: ["Jose Aldo", "Merab Dvalishvili"],
      fights: 1,
      winner: "Merab Dvalishvili",
      importance: "major",
      summary: "Merab beat Aldo in a key bantamweight contender fight, giving him a direct win over a featherweight legend during Aldo's late elite run."
    },
    "henry cejudo|merab dvalishvili": {
      fighters: ["Henry Cejudo", "Merab Dvalishvili"],
      fights: 1,
      winner: "Merab Dvalishvili",
      importance: "major",
      summary: "Merab beat Cejudo, adding a two-division champion to his modern bantamweight resume."
    },
    "merab dvalishvili|petr yan": {
      fighters: ["Merab Dvalishvili", "Petr Yan"],
      fights: 1,
      winner: "Merab Dvalishvili",
      importance: "major",
      summary: "Merab overwhelmed Yan with pace and wrestling pressure, one of the clearest statement wins in his rise toward the title."
    },
    "merab dvalishvili|sean o'malley": {
      fighters: ["Merab Dvalishvili", "Sean O'Malley"],
      fights: 2,
      winner: "Merab Dvalishvili",
      importance: "major",
      summary: "Merab beat O'Malley twice in title fights, giving him direct championship separation over one of the era's biggest bantamweight stars."
    },
    "merab dvalishvili|umar nurmagomedov": {
      fighters: ["Merab Dvalishvili", "Umar Nurmagomedov"],
      fights: 1,
      winner: "Merab Dvalishvili",
      importance: "major",
      summary: "Merab beat Umar in a high-level bantamweight title fight, adding major modern-division value to his championship case."
    },
    "amanda nunes|valentina shevchenko": {
      fighters: ["Amanda Nunes", "Valentina Shevchenko"],
      fights: 2,
      winner: "Amanda Nunes",
      importance: "major",
      summary: "Nunes beat Shevchenko twice, including a close title fight. Valentina's case stays elite, but Amanda owns the direct edge in the women's GOAT debate."
    },
    "amanda nunes|ronda rousey": {
      fighters: ["Amanda Nunes", "Ronda Rousey"],
      fights: 1,
      winner: "Amanda Nunes",
      importance: "major",
      summary: "Nunes finished Rousey quickly in a bantamweight title fight, a symbolic passing-of-the-torch moment in women's UFC history."
    },
    "amanda nunes|cris cyborg": {
      fighters: ["Amanda Nunes", "Cris Cyborg"],
      fights: 1,
      winner: "Amanda Nunes",
      importance: "major",
      summary: "Nunes knocked out Cyborg to win the featherweight title, one of the biggest wins in women's MMA history and a huge part of Amanda's two-division case."
    },
    "amanda nunes|julianna pena": {
      fighters: ["Amanda Nunes", "Julianna Pena"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "Pena upset Nunes in one of the biggest shocks in UFC title history, then Nunes dominated the rematch to take the belt back. The loss matters, but the revenge win stabilizes Amanda's case."
    },
    "joanna jedrzejczyk|valentina shevchenko": {
      fighters: ["Joanna Jedrzejczyk", "Valentina Shevchenko"],
      fights: 1,
      winner: "Valentina Shevchenko",
      importance: "major",
      summary: "Valentina beat Joanna to win the flyweight title, giving her a direct championship win over one of the great strawweight champions."
    },
    "alexa grasso|valentina shevchenko": {
      fighters: ["Alexa Grasso", "Valentina Shevchenko"],
      fights: 3,
      winner: "Split",
      importance: "major",
      summary: "Grasso submitted Valentina to end her reign, they fought to a draw in the rematch, and Valentina later regained the title. The series adds real late-career complexity to Valentina's case."
    }
  };

  function mergeProfile(fighter, profile) {
    window.COMPARE_PROFILES = window.COMPARE_PROFILES || {};
    window.COMPARE_PROFILES[fighter] = {
      ...(window.COMPARE_PROFILES[fighter] || {}),
      ...profile,
      legacyStats: {
        ...((window.COMPARE_PROFILES[fighter] || {}).legacyStats || {}),
        ...(profile.legacyStats || {})
      }
    };

    if (typeof DISPLAY_OVERRIDES !== "undefined") {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile || {}),
        ...window.COMPARE_PROFILES[fighter],
        legacyStats: {
          ...((DISPLAY_OVERRIDES[fighter].compareProfile || {}).legacyStats || {}),
          ...(window.COMPARE_PROFILES[fighter].legacyStats || {})
        }
      };
    }
  }

  Object.entries(PACK_PROFILES).forEach(([fighter, profile]) => mergeProfile(fighter, profile));
  window.COMPARE_FIGHT_LEDGER = {
    ...(window.COMPARE_FIGHT_LEDGER || {}),
    ...PACK_LEDGER
  };
})();
