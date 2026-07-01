window.ILIA_TOPURIA_AUDIT_V1 = {
  meta: {
    title: "Ilia Topuria Audit V1",
    status: "Scoring inputs locked; compare profile not done.",
    updated: "2026-06-30",
    scope: "UFC-only GOAT ranking audit"
  },
  scoringCard: {
    currentRank: "About #14, between Stipe Miocic and Israel Adesanya",
    ufcRecord: "9-1",
    adjustedTitleWins: 3.15,
    divisionAdjustedOpponentQuality: 13.10,
    primeRoundsWon: "9 / 15 = 60.0%",
    primeFinishRate: "3 / 5 = 60.0%",
    timesFinishedInPrime: 1,
    activeEliteYears: 2.97,
    lossPenalty: -2.25,
    finalScore: 43.44
  },
  lockedInputs: {
    primeStart: "Josh Emmett",
    primeEnd: "Justin Gaethje",
    gaethjeLossPenalty: -2.25,
    gaethjeLossTreatment: "Strict default prime loss to champion/top-5 plus finish/corner-stoppage add-on. No upward-division relief because Ilia had already become lightweight champion.",
    adjustedTitleWins: 3.15,
    titleCreditTreatment: "Volkanovski title win 1.00; Holloway title defense 1.00; vacant second-division lightweight title win over Charles Oliveira 1.15.",
    finalScore: 43.44
  },
  divisionStrengthUsed: [
    { divisionEra: "Modern featherweight title run", multiplier: 1.05 },
    { divisionEra: "Modern lightweight title run", multiplier: 1.10 },
    { divisionEra: "Gaethje lightweight title loss", multiplier: "1.10 context; no win credit" }
  ],
  bigAssumptions: [
    "Prime starts with Josh Emmett because that is the first clear five-round elite/top-contender statement win.",
    "Prime runs through Justin Gaethje because Topuria was the UFC lightweight champion entering that fight.",
    "Opponent-quality credit includes Alexander Volkanovski, Max Holloway, Charles Oliveira, Josh Emmett, Bryce Mitchell, with smaller earlier credit where appropriate.",
    "Gaethje loss penalty uses strict default: -1.50 champion/top-five prime loss plus -0.75 finish/corner-stoppage add-on.",
    "No upward-division relief is applied to Gaethje because Ilia had already become lightweight champion."
  ],
  whyNotRankedHigher: [
    { issue: "Short UFC elite window", reason: "The peak is huge, but the active elite sample is still under three years with this prime start." },
    { issue: "Only 10 UFC fights", reason: "The wins are high-end, but he does not have the résumé volume of older all-time names." },
    { issue: "First title-loss damage", reason: "The Gaethje loss adds a real ceiling check because it was a title fight and a stoppage." },
    { issue: "No long reign yet", reason: "He has two-division title achievement, but not long control of either division." },
    { issue: "Active volatility", reason: "One more elite win or loss can move him a lot because the sample is still small." }
  ],
  remaining: [
    "Write compare profile after scoring card is locked.",
    "Add matchup blurbs."
  ],
  readyForAppUpdate: false
};
