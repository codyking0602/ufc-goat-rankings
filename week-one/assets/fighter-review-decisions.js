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
        "Charles matchup should stay on hold until Charles compare profile is written"
      ]
    },
    "Dustin Poirier": {
      status: "Scoring inputs locked; compare profile and first matchup blurbs drafted",
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
      compareProfile: {
        coreCase: "Dustin Poirier is a quality-wins and lightweight-depth résumé case. His argument comes from building one of the deepest modern UFC lightweight ledgers: Holloway, Gaethje, Alvarez, Pettis, Conor, Hooker, Chandler, Saint Denis, and a long run near the top of the toughest division in the sport.",
        bestArgument: "Dustin’s best argument is that he fought the strongest possible UFC schedule for years and kept stacking meaningful wins. Even without an undisputed belt, his win ledger is deeper than many champions around him, and the lightweight multiplier matters because those wins came in a brutal era.",
        holdsBack: "Dustin has elite contender credibility and an interim title, but not an undisputed UFC title win. The fights against Khabib, Oliveira, Islam, Gaethje 2, and Holloway 3 define the ceiling of the résumé: he was consistently at the highest level, but several of the fights that would have lifted him into the championship great tier went the other way.",
        comparisonTone: "Dustin’s case is about depth, schedule strength, and quality wins. The question is whether that deep lightweight résumé outweighs a cleaner title reign or a shorter, higher-peak championship case from the fighter across from him."
      },
      matchupBlurbs: {
        "Frankie Edgar": "Dustin Poirier wins narrowly. Frankie has the stronger belt argument because he became undisputed UFC lightweight champion. Dustin has the stronger modern lightweight quality-wins case, with deeper wins in one of the toughest UFC divisions. Frankie’s longevity is excellent, but Dustin’s opponent ledger gives him the edge.",
        "Robert Whittaker": "Dustin Poirier wins narrowly. Whittaker has the cleaner undisputed champion label and a strong middleweight résumé, but Dustin’s lightweight win ledger is deeper. Dustin has more elite wins across a harder division, while Whittaker has the stronger formal belt argument. This comes down to quality-win depth versus championship label, and Dustin edges it on total UFC résumé.",
        "Alex Pereira": "Alex Pereira wins narrowly if the comparison prioritizes championship impact. Dustin has the deeper UFC win ledger and longer lightweight résumé, but Pereira’s two-division title achievement gives him a cleaner high-end championship case. Dustin’s argument is depth; Pereira’s argument is peak title impact.",
        "Ilia Topuria": "Hold until Ilia is audited. Dustin has far more volume and lightweight depth. Ilia has the cleaner unbeaten/short-peak championship case. This matchup should wait until Ilia’s title wins, active status, and prime window are locked.",
        "Chuck Liddell": "Dustin Poirier wins on opponent-quality depth. Chuck has the stronger classic UFC title-reign identity, but Dustin’s modern lightweight ledger is deeper and came in a stronger division context. Chuck’s case is cleaner as a champion; Dustin’s case is stronger as a total win résumé.",
        "Deiveson Figueiredo": "Dustin Poirier wins narrowly. Figueiredo has a stronger divisional title-rivalry case, but Dustin’s lightweight opponent quality and longer elite schedule carry more weight. Deiveson has the better belt argument; Dustin has the better depth argument.",
        "Tito Ortiz": "Dustin Poirier wins. Tito has the early UFC title-reign headline, but Dustin fought a much deeper modern schedule and stacked better opponent-quality wins. Tito’s title volume keeps it competitive; Dustin’s quality-wins case is stronger.",
        "Conor McGregor": "Dustin Poirier wins on total UFC résumé. Conor has the higher peak headline with two belts and the Aldo/Alvarez wins. Dustin has the deeper lightweight body of work, better long-term divisional relevance, and the later head-to-head edge. Conor owns the bigger moment; Dustin owns the stronger complete résumé.",
        "Justin Gaethje": "Dustin Poirier wins narrowly. Gaethje has the direct head-to-head equalizer after the second fight and a strong elite lightweight case, but Dustin has more total UFC depth, the interim title, and a broader quality-wins ledger. Their cases are close because both are violence-era lightweight greats, but Dustin has more layers.",
        "Charles Oliveira": "Hold until Charles compare profile is written. Charles has the stronger undisputed title/finish-record case. Dustin has the cleaner quality-wins depth argument."
      },
      readyForAppUpdate: false,
      remaining: [
        "Optionally wire Dustin compare profile into compare pack after nearby fighters are finalized",
        "Charles matchup should stay on hold until Charles compare profile is written",
        "Ilia matchup should stay on hold until Ilia audit is complete"
      ]
    },
    "Charles Oliveira": {
      status: "Scoring inputs locked; compare profile not done",
      lockedInputs: {
        primeStart: "Kevin Lee",
        primeEnd: "Max Holloway 3",
        gaethjeTitleCredit: 0.90,
        adjustedTitleWins: 2.80,
        ufcRecord: "25-11, 1 NC",
        divisionAdjustedOpponentQuality: 17.85,
        primeRoundsWon: "22 / 31 = 71.0%",
        primeFinishRate: "6 / 12 = 50.0%",
        timesFinishedInPrime: 2,
        activeEliteYears: 5.99,
        lossPenalty: -10.00,
        finalScore: 40.13
      },
      scoringCard: {
        currentRank: "About #22, between T.J. Dillashaw and B.J. Penn",
        ufcRecord: "25-11, 1 NC",
        adjustedTitleWins: 2.80,
        divisionAdjustedOpponentQuality: 17.85,
        primeRoundsWon: "22 / 31 = 71.0%",
        primeFinishRate: "6 / 12 = 50.0%",
        timesFinishedInPrime: 2,
        activeEliteYears: 5.99,
        lossPenalty: -10.00,
        finalScore: 40.13
      },
      divisionStrengthUsed: [
        { divisionEra: "Early lightweight / featherweight development years", multiplier: 1.00 },
        { divisionEra: "Modern lightweight contender run", multiplier: 1.10 },
        { divisionEra: "Lightweight championship era", multiplier: 1.10 },
        { divisionEra: "BMF fights", multiplier: "Quality/opponent context only; no title credit" }
      ],
      bigAssumptions: [
        "Prime starts with Kevin Lee because that is the clean elite-lightweight breakthrough before the Ferguson/Chandler/Poirier/Gaethje title run.",
        "Prime runs through Max Holloway 3 under the current audit draft treatment.",
        "Gaethje is credited as 0.90 adjusted title-level win because Oliveira won the fight but missed championship weight and was not eligible to retain/win the belt.",
        "Opponent-quality credit includes Tony Ferguson, Michael Chandler x2, Dustin Poirier, Justin Gaethje, Beneil Dariush, Mateusz Gamrot, Max Holloway, Kevin Lee, with lighter credit for earlier quality names where appropriate.",
        "BMF belts do not count as championship credit, but the opponents still count for quality when they were elite.",
        "Loss penalty stays at -10.00 cap because counted losses include pre-prime UFC losses plus elite prime losses to Islam Makhachev, Arman Tsarukyan, and Ilia Topuria."
      ],
      remaining: [
        "Write compare profile after scoring card is locked",
        "Add matchup blurbs"
      ]
    }
  }
};
