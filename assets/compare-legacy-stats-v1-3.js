(function () {
  const LEGACY_STATS = {
    "Jon Jones": {
      titleFightWins: 15,
      beltsWon: 2,
      titleDefenses: 11,
      activeEliteYearsLabel: "roughly 12 active elite years",
      primeNote: "multi-era elite run from young light heavyweight champion to later heavyweight title winner"
    },
    "Georges St-Pierre": {
      titleFightWins: 13,
      beltsWon: 2,
      titleDefenses: 9,
      activeEliteYearsLabel: "roughly 8 active elite years",
      primeNote: "long, clean welterweight control without much post-prime damage"
    },
    "Demetrious Johnson": {
      titleFightWins: 12,
      beltsWon: 1,
      titleDefenses: 11,
      activeEliteYearsLabel: "roughly 7 active elite years",
      primeNote: "long technical flyweight reign with very few ugly moments"
    },
    "Anderson Silva": {
      titleFightWins: 11,
      beltsWon: 1,
      titleDefenses: 10,
      activeEliteYearsLabel: "roughly 7 active elite years",
      primeNote: "long middleweight title aura before the Weidman losses damaged the back end"
    },
    "Khabib Nurmagomedov": {
      titleFightWins: 4,
      beltsWon: 1,
      titleDefenses: 3,
      activeEliteYearsLabel: "roughly 5 active elite years",
      primeNote: "shorter than the long-reign champions, but nearly flawless from RDA through Gaethje"
    },
    "Islam Makhachev": {
      titleFightWins: 6,
      beltsWon: 2,
      titleDefenses: 4,
      activeEliteYearsLabel: "roughly 5 active elite years",
      primeNote: "modern lightweight title run that later expanded into a second-division championship case"
    },
    "Alexander Volkanovski": {
      titleFightWins: 6,
      beltsWon: 1,
      titleDefenses: 5,
      activeEliteYearsLabel: "roughly 6 active elite years",
      primeNote: "clean modern featherweight prime built around Holloway trilogy separation"
    },
    "Max Holloway": {
      titleFightWins: 4,
      beltsWon: 1,
      titleDefenses: 1,
      activeEliteYearsLabel: "roughly 10 active elite years",
      primeNote: "one of the longest elite windows in the ranking, with major value before and after the belt"
    },
    "Kamaru Usman": {
      titleFightWins: 6,
      beltsWon: 1,
      titleDefenses: 5,
      activeEliteYearsLabel: "roughly 5 active elite years",
      primeNote: "dominant but focused welterweight title window rather than a decade-long elite run"
    },
    "Jose Aldo": {
      titleFightWins: 8,
      beltsWon: 1,
      titleDefenses: 7,
      activeEliteYearsLabel: "roughly 9 active elite years in the scored window",
      primeNote: "long broader featherweight prime, with UFC value continuing into his bantamweight run"
    },
    "Dominick Cruz": {
      titleFightWins: 3,
      beltsWon: 1,
      titleDefenses: 2,
      activeEliteYearsLabel: "roughly 5 active elite years",
      primeNote: "brilliant but injury-fragmented prime with long gaps between elite wins"
    },
    "Conor McGregor": {
      titleFightWins: 3,
      beltsWon: 2,
      titleDefenses: 0,
      activeEliteYearsLabel: "roughly 3 active elite years",
      primeNote: "short explosive prime built around the Aldo knockout and Alvarez double-champ moment"
    },
    "Matt Hughes": {
      titleFightWins: 9,
      beltsWon: 1,
      titleDefenses: 7,
      activeEliteYearsLabel: "roughly 6 active elite years",
      primeNote: "early-era welterweight title control with real reign volume"
    },
    "Henry Cejudo": {
      titleFightWins: 4,
      beltsWon: 2,
      titleDefenses: 2,
      activeEliteYearsLabel: "roughly 3 active elite years",
      primeNote: "compact achievement burst across flyweight and bantamweight"
    },
    "Charles Oliveira": {
      titleFightWins: 3,
      beltsWon: 1,
      titleDefenses: 1,
      activeEliteYearsLabel: "roughly 4 active elite years",
      primeNote: "late-blooming lightweight title peak with elite finishing value"
    },
    "Dustin Poirier": {
      titleFightWins: 1,
      beltsWon: 0,
      titleDefenses: 0,
      activeEliteYearsLabel: "roughly 7 active elite years",
      primeNote: "long elite lightweight run built more on contender depth than undisputed title reign"
    },
    "Leon Edwards": {
      titleFightWins: 3,
      beltsWon: 1,
      titleDefenses: 2,
      activeEliteYearsLabel: "roughly 4 active elite years",
      primeNote: "shorter title window, but the Usman rivalry gives it major championship weight"
    }
  };

  function install() {
    if (typeof DISPLAY_OVERRIDES === "undefined") return;
    Object.entries(LEGACY_STATS).forEach(([fighter, legacyStats]) => {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = DISPLAY_OVERRIDES[fighter].compareProfile || {};
      DISPLAY_OVERRIDES[fighter].compareProfile.legacyStats = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile.legacyStats || {}),
        ...legacyStats
      };
    });
  }

  install();
})();
