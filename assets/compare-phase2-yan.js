(function () {
  const PHASE2_COMPARE_PROFILES = {
    "Petr Yan": {
      shortCase: "Yan is a modern bantamweight title case: elite boxing, strong round control, real title-level wins, and loss context that needs more nuance than the record alone shows.",
      peak: "At his best, Yan was one of the cleanest technical pressure fighters in the UFC: sharp boxing, layered defense, pace, and the ability to take over rounds once reads settled in.",
      resume: "Yan's UFC resume has a compact but serious bantamweight title case. Aldo and Sandhagen anchor the title-race value, while the Sterling rivalry makes the loss column messier than a normal 0-2 read.",
      championship: "Yan won the UFC bantamweight title and later won an interim title-level fight. The championship case is real, but the title volume is not long enough to push him into the top-tier champion group.",
      opponentQuality: "Aldo, Sandhagen, Faber, Dodson, and later elite bantamweight context give Yan a useful quality-wins case inside a strong modern division.",
      longevity: "Yan's elite window is solid but not massive. He has enough high-level bantamweight years to belong, but not the long shelf life of the bigger all-time resumes.",
      counter: "Yan's best counterargument is context. The Sterling DQ should not be treated like a normal competitive title loss, the rematch was close, and several later losses came against elite bantamweights without him being finished.",
      edge: "Yan wins comparisons when clean skill, round control, and DQ/loss-context nuance matter more than raw title-defense volume.",
      eliteCounter: true,
      signatureWins: "Aldo, Sandhagen, Faber, and Dodson give Yan a compact but real UFC bantamweight win stack, with Aldo and Sandhagen carrying the title-race value.",
      weakness: "The ceiling is title volume. Yan has elite skill and strong context, but the official loss column and lack of a long reign keep him below deeper champion cases.",
      titleSummary: "Yan's title case is a real bantamweight champion profile, but it is compact: title win, interim title-level value, and no long defense run.",
      primeSummary: "His prime argument is built on round control and technical separation, with no prime finish losses in the current context assumptions.",
      titleStyle: "compactModernBantamweightChampion",
      primeStyle: "technicalRoundControl",
      legacyStats: { titleFightWins: 2, beltsWon: 1, titleDefenses: 0, activeEliteYearsLabel: "roughly 6 active elite years", primeNote: "modern bantamweight title window with strong round control and unusual DQ context" }
    },
    "Merab Dvalishvili": {
      shortCase: "Merab is the modern bantamweight pressure-and-longevity case: endless pace, elite control, a deep contender run, and a champion profile still being written.",
      peak: "At his best, Merab turns fights into a cardio and wrestling test almost nobody can keep up with. The pace, chain wrestling, and control volume are the whole problem.",
      resume: "Merab's resume is built on modern bantamweight depth. The Yan win, Cejudo win, Aldo win, and title-level run give him a serious current-era case.",
      championship: "The championship case is still building. He has the title-level wins and the belt context, but not yet the long defense volume of the established all-time champions.",
      opponentQuality: "Yan, Cejudo, Aldo, Moraes, and other ranked bantamweight wins give Merab a strong modern opponent-quality lane.",
      longevity: "Merab's useful elite window is strong and still active. He has stacked years of top-level bantamweight relevance without much decline yet.",
      counter: "Merab's argument is depth and pace. Even without huge finishing numbers, his control style and modern bantamweight schedule make his case stronger than a simple highlight test suggests.",
      edge: "Merab wins comparisons when modern division depth, pace, wrestling control, and active elite consistency matter most.",
      eliteCounter: true,
      signatureWins: "Yan, Cejudo, Aldo, Moraes, and ranked bantamweight wins give Merab one of the strongest modern 135-pound ledgers.",
      titleSummary: "Merab's title case is still active and building, so the score should be ready to move as defenses or new elite wins arrive.",
      primeSummary: "His prime is a pressure-control prime: less about finishes, more about making elite opponents fight his pace for five rounds.",
      titleStyle: "activeModernChampionCase",
      primeStyle: "pressureControlPrime",
      legacyStats: { titleFightWins: 1, beltsWon: 1, titleDefenses: 0, activeEliteYearsLabel: "roughly 5 active elite years", primeNote: "active modern bantamweight pressure-control prime with room to keep climbing" }
    },
    "Aljamain Sterling": {
      shortCase: "Sterling is a real bantamweight title-reign case: elite grappling, back-control danger, multiple title wins, and a rivalry with Yan that needs DQ/rematch context.",
      peak: "At his best, Sterling was a matchup trap: long, awkward, relentless with back takes, and dangerous once opponents gave him grappling entries.",
      resume: "Sterling's resume is built on bantamweight title volume and official results. The Yan rivalry, Dillashaw context, Cejudo win, and O'Malley finish all need explanation, but the reign still matters.",
      championship: "Sterling has one of the better UFC bantamweight championship resumes by title-fight volume, even if some of the path is debated by fans.",
      opponentQuality: "Yan, Cejudo, Sandhagen, Munhoz, and ranked bantamweight wins give Sterling a real quality-wins case in a strong modern division.",
      longevity: "Sterling stayed relevant through a deep modern bantamweight era and proved himself across contender and champion phases.",
      counter: "Sterling's best argument is official championship value. However messy the Yan DQ was, he still won the rematch, beat Cejudo, and stacked title-level work.",
      edge: "Sterling wins comparisons when official title results, grappling control, and championship volume matter more than eye-test cleanliness.",
      eliteCounter: true,
      signatureWins: "Yan, Cejudo, Sandhagen, Munhoz, and contender-era bantamweight wins give Sterling real title-run value.",
      weakness: "The resume needs context because the Yan DQ, compromised Dillashaw fight, and O'Malley finish all complicate how clean the reign feels.",
      titleSummary: "Sterling's title case is one of the bigger bantamweight title-volume cases, but it is also one of the most debated.",
      primeSummary: "His prime was grappling-first and matchup-specific: not always visually clean, but effective enough to build a real champion resume.",
      titleStyle: "debatedBantamweightTitleReign",
      primeStyle: "grapplingControlPrime",
      legacyStats: { titleFightWins: 4, beltsWon: 1, titleDefenses: 3, activeEliteYearsLabel: "roughly 5 active elite years", primeNote: "debated but meaningful bantamweight title run built around grappling control" }
    }
  };

  const PHASE2_FIGHT_LEDGER = {
    "aljamain sterling|petr yan": {
      fighters: ["Aljamain Sterling", "Petr Yan"],
      fights: 2,
      winner: "Aljamain Sterling",
      importance: "major",
      summary: "Sterling officially leads Yan 2-0, but the first title fight ended by DQ and the rematch was close enough that Yan needs special context instead of being treated like a normal 0-2 rivalry loss."
    },
    "merab dvalishvili|petr yan": {
      fighters: ["Merab Dvalishvili", "Petr Yan"],
      fights: 1,
      winner: "Merab Dvalishvili",
      importance: "major",
      summary: "Merab beat Yan over five rounds with pace, wrestling pressure, and control, giving Merab a clean direct edge inside the modern bantamweight comparison."
    }
  };

  function installProfile(fighter, compareProfile) {
    if (typeof DISPLAY_OVERRIDES !== "undefined") {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile || {}),
        ...compareProfile,
        legacyStats: {
          ...((DISPLAY_OVERRIDES[fighter].compareProfile || {}).legacyStats || {}),
          ...(compareProfile.legacyStats || {})
        }
      };
    }
  }

  window.COMPARE_PROFILES = {
    ...(window.COMPARE_PROFILES || {}),
    ...PHASE2_COMPARE_PROFILES
  };
  window.COMPARE_FIGHT_LEDGER = {
    ...(window.COMPARE_FIGHT_LEDGER || {}),
    ...PHASE2_FIGHT_LEDGER
  };

  Object.entries(PHASE2_COMPARE_PROFILES).forEach(([fighter, compareProfile]) => installProfile(fighter, compareProfile));

  window.COMPARE_PHASE2_YAN = {
    profiles: Object.keys(PHASE2_COMPARE_PROFILES),
    ledgerEntries: Object.keys(PHASE2_FIGHT_LEDGER),
    loaded: true
  };
})();
