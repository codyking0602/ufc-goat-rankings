window.JONES_GSP_AUDIT_V1 = {
  meta: {
    title: "Jon Jones and Georges St-Pierre Audit V1",
    status: "Scoring inputs locked; compare profiles and key matchup blurbs drafted.",
    updated: "2026-06-30",
    scope: "UFC-only GOAT ranking audit",
    note: "GSP timesFinishedInPrime corrected to 1 in this audit log. Live board update can be batched into the next index.html release."
  },
  fighters: {
    "Jon Jones": {
      status: "Scoring locked; compare profile and key matchups drafted",
      scoringCard: {
        currentRank: "#1 benchmark fighter",
        ufcRecord: "22-1, 1 NC",
        adjustedTitleWins: 15.80,
        divisionAdjustedOpponentQuality: 16.92,
        primeRoundsWon: "66 / 73 = 90.4%",
        primeFinishRate: "12 / 23 = 52.2%",
        timesFinishedInPrime: 0,
        activeEliteYears: 10.82,
        lossPenalty: 0.00,
        finalScore: 88.70,
        ovr: 99
      },
      divisionStrengthUsed: [
        { divisionEra: "Early / prime light heavyweight", multiplier: 1.00 },
        { divisionEra: "Late light heavyweight", multiplier: "0.95-1.00 depending opponent" },
        { divisionEra: "Heavyweight move", multiplier: "0.95 where appropriate" }
      ],
      bigAssumptions: [
        "Jon Jones remains the UFC-only GOAT benchmark and 99 OVR standard.",
        "Matt Hamill DQ stays in the official record but receives 0 loss penalty because it is not treated as a real competitive loss.",
        "No contests are not excluded from record context, but the Daniel Cormier no contest does not become a scored win.",
        "Heavyweight wins over Ciryl Gane and Stipe Miocic count, but late-career heavyweight is not treated as a full second reign.",
        "Late light heavyweight close fights against Thiago Santos and Dominick Reyes remain context, not losses."
      ],
      whyNotRankedHigher: [
        { issue: "Already benchmark", reason: "There is no higher rank in the current UFC-only system." },
        { issue: "Late light heavyweight close fights", reason: "Santos and Reyes keep the résumé from looking perfectly clean, even though both are official wins." },
        { issue: "No contest / outside-cage context", reason: "This is visible context, but not part of the fight-result scoring unless Cody creates a separate non-fight reputation category." },
        { issue: "Small heavyweight sample", reason: "Gane and Stipe help the legacy, but this is not a full heavyweight reign." }
      ],
      compareProfile: {
        coreCase: "Jon Jones is the UFC-only benchmark case. His argument is built on unmatched title-fight volume, elite light heavyweight dominance, a heavyweight title chapter, and essentially no real competitive loss inside the scoring rules.",
        bestArgument: "Jones has the best combination of championship volume, elite wins, round control, durability, and longevity in this ranking. The Hamill DQ is official, but it is not a real competitive defeat. When the question is UFC-only résumé, Jones is the standard everyone else is measured against.",
        holdsBack: "The only real pushback is context, not placement: the Cormier no contest, outside-cage issues, the Santos/Reyes close fights, and the fact that heavyweight was a short chapter rather than a long second reign. None of that is enough to move him off #1 under the locked scoring rules.",
        comparisonTone: "Against Jones, the other fighter needs an overwhelming argument in cleanliness, dominance, or title control. Most comparisons become a question of whether the challenger can offset Jones' unmatched UFC title résumé."
      },
      matchupBlurbs: {
        "Georges St-Pierre": "Jon Jones wins. GSP has the cleaner sportsmanlike résumé and arguably the most complete no-drama champion case, but Jones has more title-fight volume, better raw championship weight, no real competitive loss penalty, and the heavyweight title chapter. GSP is the cleanest challenger; Jones is still the stronger UFC-only GOAT résumé.",
        "Demetrious Johnson": "Jon Jones wins. Demetrious Johnson has an incredible dominance case and the cleanest flyweight reign, but Jones has more division-adjusted championship weight and a stronger opponent-quality ceiling. DJ is skill-for-skill in the conversation; Jones has the better UFC-only GOAT résumé.",
        "Anderson Silva": "Jon Jones wins. Anderson has the aura and peak finishing run, but Jones has the cleaner loss context, broader title volume, and better sustained championship résumé. Anderson's peak matters, but Jones has the more complete UFC-only case.",
        "Khabib Nurmagomedov": "Jon Jones wins. Khabib has the cleanest undefeated lightweight case and better pure loss profile, but Jones has far more UFC title volume, longer elite longevity, and more total championship résumé. Khabib is cleaner; Jones is much bigger.",
        "Alexander Volkanovski": "Jon Jones wins. Volk has an elite modern featherweight case and strong up-division ambition, but Jones has more title wins, more years at the top, and a stronger all-time championship ceiling."
      }
    },
    "Georges St-Pierre": {
      status: "Scoring locked; compare profile and key matchups drafted",
      scoringCard: {
        currentRank: "#2, behind Jon Jones and ahead of Demetrious Johnson",
        ufcRecord: "20-2",
        adjustedTitleWins: 13.00,
        divisionAdjustedOpponentQuality: 25.00,
        primeRoundsWon: "61 / 71 = 85.9%",
        primeFinishRate: "8 / 22 = 36.4%",
        timesFinishedInPrime: 1,
        activeEliteYears: 9.15,
        lossPenalty: -6.25,
        finalScore: 79.26,
        ovr: 96
      },
      lockedInputs: {
        timesFinishedInPrime: 1,
        timesFinishedInPrimeTreatment: "Corrected from app display 0 to 1 because Matt Serra 2007 is locked as a prime finished loss. Score does not change because the loss penalty already included the finish add-on.",
        hughes2004LossPenalty: -1.50,
        serra2007LossPenalty: -4.75,
        finalScore: 79.26
      },
      divisionStrengthUsed: [
        { divisionEra: "GSP welterweight era", multiplier: 1.05 },
        { divisionEra: "Bisping middleweight title win", multiplier: "Champion bonus / second-division title credit, not full MW era boost" }
      ],
      bigAssumptions: [
        "Hughes 2004 is a pre-prime elite finished loss: -1.50 total.",
        "Serra 2007 is a prime non-elite finished loss: -4.75 total.",
        "Bisping win receives second-division undisputed title credit of 1.25.",
        "Hendricks stays an official win despite controversy.",
        "Opponent quality remains benchmark-level because GSP has the deepest top-5/title-contender win ledger in the current system."
      ],
      whyNotRankedHigher: [
        { issue: "Serra upset", reason: "This is the biggest single mark against any top-tier GOAT case." },
        { issue: "Lower finish rate", reason: "GSP dominated through round control more than finishes." },
        { issue: "Shorter active elite span than Jones", reason: "Excellent longevity, but not quite the Jones benchmark." },
        { issue: "Limited second-division sample", reason: "The Bisping win matters, but it is one middleweight fight, not a second reign." }
      ],
      compareProfile: {
        coreCase: "Georges St-Pierre is the cleanest complete-champion case in the UFC-only ranking. His argument comes from elite welterweight title control, unmatched opponent-quality depth, dominant round-winning, and a second-division title win over Michael Bisping.",
        bestArgument: "GSP has the best opponent-quality case in the current system. He repeatedly beat top welterweights, avenged both UFC losses, controlled rounds at an elite rate, and left with his résumé largely intact. If someone values clean professionalism, opponent depth, and complete MMA skill, GSP is the strongest challenger to Jones.",
        holdsBack: "The Serra upset is the major résumé damage. GSP also has a lower finish rate than some other GOAT candidates and did not build a long second-division reign after beating Bisping. Those are the reasons he sits behind Jones instead of being the benchmark.",
        comparisonTone: "GSP's case is the clean, complete résumé test. The question is whether the other fighter can match his opponent depth, title control, and round dominance without taking on worse loss context."
      },
      matchupBlurbs: {
        "Jon Jones": "Jon Jones wins. GSP has the cleaner sportsmanlike résumé and arguably the most complete no-drama champion case, but Jones has more title-fight volume, better raw championship weight, no real competitive loss penalty, and the heavyweight title chapter. GSP is the cleanest challenger; Jones is still the stronger UFC-only GOAT résumé.",
        "Demetrious Johnson": "Georges St-Pierre wins narrowly. DJ has the cleaner dominance streak and a better small-division title reign on paper, but GSP has stronger opponent-quality depth and a tougher division-strength context. DJ is the cleaner dominance case; GSP has the stronger total UFC-only résumé.",
        "Anderson Silva": "Georges St-Pierre wins. Anderson has the stronger aura/finish peak and a legendary middleweight reign, but GSP has better opponent-quality depth, cleaner late-career handling, and avenged both losses. Anderson's peak is scarier; GSP's résumé is cleaner and more complete.",
        "Khabib Nurmagomedov": "Georges St-Pierre wins. Khabib has the cleaner undefeated record and stronger pure dominance peak, but GSP has much more title-fight volume, more elite wins, and a second-division UFC title. Khabib is cleaner; GSP is deeper.",
        "Alexander Volkanovski": "Georges St-Pierre wins. Volk has a great modern featherweight reign and strong up-division context, but GSP has more championship volume, deeper opponent quality, and a stronger complete UFC-only résumé."
      }
    }
  },
  readyForAppUpdate: false,
  remaining: [
    "Batch live index.html update to change Georges St-Pierre timesFinishedPrime from 0 to 1.",
    "Wire Jones/GSP compare profiles into compare pack after top-tier audits are finalized."
  ]
};
