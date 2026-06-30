(function () {
  const TITLE_PRIME = {
    "Jon Jones": {
      titleSummary: "Jones has the clearest championship-volume case in the ranking: a long light heavyweight title reign, repeated title-fight wins, and later heavyweight title value.",
      primeSummary: "His elite window stretched across multiple versions of light heavyweight, with gaps and messy context but unmatched time near the top.",
      titleStyle: "longReignBenchmark",
      primeStyle: "multiEraDominance"
    },
    "Georges St-Pierre": {
      titleSummary: "GSP's title case is built on a long welterweight reign, repeated title-fight wins, and a later middleweight belt that adds bonus value.",
      primeSummary: "His prime lasted across multiple welterweight eras, and he left before piling up ugly post-prime damage.",
      titleStyle: "longReignCleanChampion",
      primeStyle: "cleanLongPrime"
    },
    "Demetrious Johnson": {
      titleSummary: "DJ's title case is historic at flyweight: long reign, repeated defenses, and clean separation from the division, with division-strength context applied.",
      primeSummary: "His UFC prime was long, technical, consistent, and rarely chaotic; he controlled fights without many ugly dips.",
      titleStyle: "longReignDivisionStandard",
      primeStyle: "technicalConsistency"
    },
    "Anderson Silva": {
      titleSummary: "Anderson's title case is a long middleweight reign built on repeated defenses, spectacular finishes, and one of the most iconic champion runs ever.",
      primeSummary: "His prime aura lasted for years, but the Weidman losses create drag because they land before the model fully shifts him into post-prime protection.",
      titleStyle: "longReignAuraChampion",
      primeStyle: "iconicAuraPeak"
    },
    "Khabib Nurmagomedov": {
      titleSummary: "Khabib's title resume is compact, but his defenses came against elite lightweights and he retired unbeaten on top.",
      primeSummary: "His prime run from RDA through Gaethje was one of the cleanest dominance stretches ever: short compared with long-reign champions, but almost flawless.",
      titleStyle: "perfectCompactReign",
      primeStyle: "unbeatenPeak"
    },
    "Islam Makhachev": {
      titleSummary: "Islam's title case has grown into a deeper modern lightweight reign, with more championship volume than a short peak-only case.",
      primeSummary: "His prime began later than Khabib's scoring window but has already stacked elite years against modern lightweight and pound-for-pound level opponents.",
      titleStyle: "modernLightweightReign",
      primeStyle: "stillBuildingElitePrime"
    },
    "Alexander Volkanovski": {
      titleSummary: "Volk's title case is a clean modern featherweight reign built around Holloway trilogy separation and repeated contender defenses.",
      primeSummary: "His prime was not as long as Holloway's total run, but at his best he was the defining featherweight of the era.",
      titleStyle: "cleanDivisionSeparation",
      primeStyle: "eliteModernPrime"
    },
    "Max Holloway": {
      titleSummary: "Holloway's title case is strong, but his all-time case is even more about volume, elite wins, and relevance before and after the belt.",
      primeSummary: "Max's prime/relevance window is unusually long: he stayed elite through multiple phases, even after losing the featherweight title.",
      titleStyle: "championVolumeCase",
      primeStyle: "longEliteVolume"
    },
    "Kamaru Usman": {
      titleSummary: "Usman's title case is a strong modern welterweight reign with repeated defenses and real champion authority, even if the ending got damaged by Edwards.",
      primeSummary: "His prime was excellent but tighter than GSP's or Holloway's: a dominant title window rather than a decade-long all-time run.",
      titleStyle: "modernTitleAuthority",
      primeStyle: "dominantFocusedPrime"
    },
    "Jose Aldo": {
      titleSummary: "Aldo's UFC title case is strong but incomplete without historical context because part of his legendary reign happened in WEC before the scored UFC window.",
      primeSummary: "Aldo's broader prime was long and legendary, while the scored UFC portion still shows elite featherweight title value and later bantamweight relevance.",
      titleStyle: "scopeAffectedLegend",
      primeStyle: "longHistoricalPrime"
    },
    "Dominick Cruz": {
      titleSummary: "Cruz's UFC title case has real shine, especially the Dillashaw comeback, but injuries and gaps limit the total scored title volume.",
      primeSummary: "His prime is fragmented: brilliant at his best, but interrupted by long layoffs that cap active elite years.",
      titleStyle: "fragmentedChampionCase",
      primeStyle: "injuryInterruptedPrime"
    },
    "Conor McGregor": {
      titleSummary: "Conor's title case is historically important because of the two-division achievement, but he lacks the title-defense volume of the deeper champions.",
      primeSummary: "His prime was electric but short: a fast rise from featherweight contender to double champ, followed by inactivity and uneven later results.",
      titleStyle: "compactDoubleChampStar",
      primeStyle: "shortExplosivePrime"
    },
    "Matt Hughes": {
      titleSummary: "Hughes has major early-welterweight championship volume and spent years as the face of the UFC welterweight title picture.",
      primeSummary: "His prime was longer and more title-heavy than many compact-resume fighters, even with era-strength context.",
      titleStyle: "earlyEraLongReign",
      primeStyle: "physicalEraPrime"
    },
    "Henry Cejudo": {
      titleSummary: "Cejudo won UFC gold in two divisions, but the title window was short and does not have long-reign defense volume.",
      primeSummary: "His best UFC work came in a compact burst from the DJ rematch through the Dillashaw and Moraes wins.",
      titleStyle: "compactDoubleChamp",
      primeStyle: "shortAchievementBurst"
    }
  };

  function install() {
    if (typeof DISPLAY_OVERRIDES === "undefined") return;
    Object.entries(TITLE_PRIME).forEach(([fighter, compareProfile]) => {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile || {}),
        ...compareProfile
      };
    });
  }

  install();
})();
