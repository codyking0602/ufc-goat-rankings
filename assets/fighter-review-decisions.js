window.FIGHTER_REVIEW_DECISIONS = {
  meta: {
    title: "Fighter Review Decisions Log",
    status: "Audit decisions and compare copy locked during fighter-by-fighter review.",
    updated: "2026-06-30"
  },
  fighters: {
    "Petr Yan": {
      status: "Partial scoring input locked",
      lockedInputs: {
        lossPenaltyOption: "Option B",
        lossPenalty: -5.25,
        treatment: "Sterling DQ reduced to -0.75; Sterling 2, O'Malley, and Merab 1 remain prime elite losses at -1.50 each; no finish add-ons."
      },
      remaining: [
        "Complete exact scoring card in locked format",
        "Write compare profile after scoring card is locked",
        "Add matchup blurbs"
      ]
    },
    "Frankie Edgar": {
      status: "Scoring inputs locked; compare profile and first matchup blurbs drafted",
      lockedInputs: {
        primeWindow: "B.J. Penn 1 through Max Holloway 2019",
        postPrimeStarts: "After Max Holloway title fight on 2019-07-27",
        primeRoundsWon: "45 / 70 = 64.3%",
        primeFinishRate: "5 / 18 = 27.8%",
        timesFinishedInPrime: 1,
        activeEliteYears: 9.29,
        lossPenalty: -10.0,
        finalScore: 36.10
      },
      scoringCard: {
        currentRank: "#30, between Tito Ortiz and Dominick Cruz",
        ufcRecord: "18-11-1",
        adjustedTitleWins: 3.00,
        divisionAdjustedOpponentQuality: 12.20,
        primeRoundsWon: "45 / 70 = 64.3%",
        primeFinishRate: "5 / 18 = 27.8%",
        timesFinishedInPrime: 1,
        activeEliteYears: 9.29,
        lossPenalty: -10.00,
        finalScore: 36.10
      },
      divisionStrengthUsed: [
        { divisionEra: "Lightweight title era", multiplier: 1.00 },
        { divisionEra: "Featherweight elite era", multiplier: 1.05 },
        { divisionEra: "Bantamweight late-career period", multiplier: "Post-prime; no elite-year extension" }
      ],
      bigAssumptions: [
        "Prime starts with B.J. Penn 1 because that is the first UFC championship win.",
        "Prime runs through Max Holloway because Cody locked Option C and Holloway was a UFC title fight.",
        "Post-prime starts after Holloway 2019.",
        "Opponent-quality credit includes B.J. Penn x2, Gray Maynard, Charles Oliveira, Cub Swanson x2, Urijah Faber, Chad Mendes, Jeremy Stephens, Yair Rodriguez, with title-loss context against Benson Henderson, Jose Aldo, Brian Ortega, and Max Holloway.",
        "Loss penalty stays at -10.00 cap because counting through Holloway creates -10.50 before cap."
      ],
      compareProfile: {
        coreCase: "Frankie Edgar is a long-form résumé case. His argument comes from winning the UFC lightweight title, staying relevant through multiple elite eras, and remaining title-level after moving down to featherweight. His record looks messy on the surface, but most of the damage came because he kept fighting championship-level opponents deep into his career.",
        bestArgument: "Frankie has one of the best small-fighter-against-elite-opposition résumés in UFC history. He beat B.J. Penn for the lightweight title, held up through the Maynard trilogy, then stayed in the featherweight title picture against Aldo, Mendes, Cub, Yair, Ortega, and Holloway. Very few fighters have that kind of cross-era, multi-division relevance.",
        holdsBack: "Frankie has strong title credibility, but not huge title-win volume. He was often competitive with elite champions, but he also came up short in several of the fights that would have pushed him into a higher all-time tier. His case is deep and respected, but it is not as clean as fighters with longer title reigns or more dominant championship stretches.",
        comparisonTone: "Frankie’s résumé is stronger than the record looks. The question is whether you value his long title-level schedule more than a shorter, cleaner peak from the fighter across from him."
      },
      matchupBlurbs: {
        "Dominick Cruz": "Frankie Edgar wins narrowly. Cruz has the cleaner bantamweight champion argument and the more unique tactical peak, but Frankie’s UFC-only résumé has more usable volume. He won the lightweight title, stayed title-relevant at featherweight, and built a deeper multi-division UFC case. Cruz’s WEC greatness matters historically, but it does not carry the UFC-only score.",
        "Henry Cejudo": "Frankie Edgar wins on depth. Cejudo has the cleaner two-division title headline, and his best wins are extremely valuable. Frankie’s case is bigger across time: more elite years, more UFC fights against top-level opposition, and a longer stretch of title relevance. Cejudo’s case is more explosive; Frankie’s is more complete.",
        "B.J. Penn": "B.J. Penn wins. Frankie has the direct rivalry edge at lightweight, but B.J.’s overall UFC-only case still carries more championship weight and higher-end peak value. Frankie’s résumé is longer and steadier, but B.J.’s best UFC work gives him the stronger all-time case.",
        "Dustin Poirier": "Dustin Poirier wins narrowly. Frankie has the stronger belt argument because he became undisputed UFC lightweight champion. Dustin has the stronger modern lightweight quality-wins case, with deeper wins in one of the toughest UFC divisions. Frankie’s longevity is excellent, but Dustin’s opponent ledger gives him the edge.",
        "Tito Ortiz": "Frankie Edgar wins narrowly. Tito has the better raw title-reign headline from the early light heavyweight era. Frankie’s case is deeper across divisions and eras. He won the lightweight title, stayed elite at featherweight, and fought a stronger overall UFC schedule.",
        "Deiveson Figueiredo": "Frankie Edgar wins narrowly. Figueiredo has the stronger flyweight title-rivalry case and more finishing danger. Frankie has more cross-division relevance and a longer run against elite UFC opponents. This is close because Deiveson’s championship case is real, but Frankie’s résumé has more total layers.",
        "Conor McGregor": "Frankie Edgar wins on total résumé. Conor has the bigger peak headline: two UFC belts, the Aldo knockout, and the Alvarez performance. Frankie has the longer UFC-only case. He won the lightweight title, stayed elite for years, and kept fighting top-tier opponents across multiple divisions.",
        "Charles Oliveira": "Hold until Charles is audited. Frankie has the direct win and stronger multi-division longevity. Charles has the stronger lightweight finishing résumé, a UFC title win, and a much better late-prime championship surge."
      },
      readyForAppUpdate: false,
      remaining: [
        "Optionally wire Frankie compare profile into compare pack after nearby fighters are finalized",
        "Charles matchup should stay on hold until Charles audit"
      ]
    },
    "Dustin Poirier": {
      status: "Scoring inputs locked; compare profile not done",
      lockedInputs: {
        primeStartOption: "Option A",
        primeStart: "Carlos Diego Ferreira",
        primeEnd: "Max Holloway 3",
        primeWindowTreatment: "Full lightweight longevity counted; Michael Johnson loss remains inside counted window.",
        ufcRecord: "22-9, 1 NC",
        adjustedTitleWins: 0.75,
        divisionAdjustedOpponentQuality: 18.20,
        primeRoundsWon: "31 / 57 = 54.4%",
        primeFinishRate: "10 / 21 = 47.6%",
        timesFinishedInPrime: 4,
        activeEliteYears: 10.60,
        lossPenalty: -10.00,
        finalScore: 38.35
      },
      scoringCard: {
        currentRank: "#25, between Alex Pereira and Robert Whittaker",
        ufcRecord: "22-9, 1 NC",
        adjustedTitleWins: 0.75,
        divisionAdjustedOpponentQuality: 18.20,
        primeRoundsWon: "31 / 57 = 54.4%",
        primeFinishRate: "10 / 21 = 47.6%",
        timesFinishedInPrime: 4,
        activeEliteYears: 10.60,
        lossPenalty: -10.00,
        finalScore: 38.35
      },
      divisionStrengthUsed: [
        { divisionEra: "Featherweight early UFC period", multiplier: 1.00 },
        { divisionEra: "Lightweight prime contender era", multiplier: 1.10 },
        { divisionEra: "Lightweight title-contender era", multiplier: 1.10 },
        { divisionEra: "BMF fights", multiplier: "Quality/opponent context only; no title credit" }
      ],
      bigAssumptions: [
        "Prime/elite window starts with Carlos Diego Ferreira because Cody locked Option A.",
        "Prime/elite window runs through Max Holloway 3 because it was still a major ranked/lightweight/BMF-level fight and Dustin's retirement fight.",
        "Opponent-quality credit includes Max Holloway x2, Justin Gaethje, Eddie Alvarez, Anthony Pettis, Conor McGregor x2, Dan Hooker, Michael Chandler, Benoît Saint Denis, Jim Miller, plus smaller/early credit where appropriate.",
        "No undisputed-title win is credited. The interim lightweight title over Max Holloway is treated as 0.75 adjusted title wins.",
        "BMF belts do not count as championship credit, but the opponents still count for quality when they were elite.",
        "Loss penalty hits the -10.00 cap because counted losses include Khabib, Oliveira, Gaethje 2, Islam, Holloway 3, and Michael Johnson inside the Option A window."
      ],
      remaining: [
        "Write compare profile after scoring card is locked",
        "Add matchup blurbs"
      ]
    }
  }
};
