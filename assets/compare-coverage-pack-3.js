// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
(function () {
  const PACK_PROFILES = {
    "Max Holloway": {
      shortCase: "Holloway is the volume-and-quality-wins monster: a long elite featherweight run, huge win depth, absurd durability, and enough lightweight context to make him dangerous in almost any comparison.",
      peak: "At his best, Holloway was pace, boxing layers, cardio, chin, pressure, and round-by-round accumulation. He did not always erase opponents quickly, but he drowned elite fighters with volume and pace.",
      resume: "Holloway's UFC case is built less on pure belt volume and more on quality wins, elite longevity, and staying relevant against multiple generations of featherweights.",
      championship: "The championship case is strong but not top-tier all-time: interim title, undisputed featherweight title, and multiple defenses, but the Volkanovski trilogy limits his argument as the division's clean #1 champion.",
      opponentQuality: "Aldo twice, Ortega, Edgar, Korean Zombie, Yair, Kattar, Gaethje, Pettis, Lamas, and Swanson give Holloway one of the deepest UFC win lists in the ranking.",
      longevity: "Longevity is a major strength. Holloway stayed elite from his featherweight rise through championship years and later contender/BMF-level fights.",
      counter: "The case against Holloway is championship separation. Volkanovski beat him three times, and Max has more losses than the cleaner top-tier GOAT cases.",
      edge: "Holloway wins comparisons when quality-win depth, durability, activity, and active elite years matter more than a cleaner title-reign case.",
      eliteCounter: true,
      signatureWins: "Aldo twice, Ortega, Edgar, Korean Zombie, Yair, Kattar, Gaethje, Pettis, Lamas, and Swanson give Holloway an elite UFC-only win ledger.",
      titleSummary: "Holloway's title case includes interim and undisputed featherweight gold plus multiple defenses, but his overall argument leans more on win depth and longevity than title dominance.",
      primeSummary: "His prime is unusually long and durable, with elite performances before, during, and after his title reign.",
      titleStyle: "volumeFeatherweightChampion",
      primeStyle: "durablePressurePrime",
      legacyStats: {
        titleFightWins: 5,
        beltsWon: 1,
        titleDefenses: 3,
        activeEliteYearsLabel: "roughly 10 active elite years",
        primeNote: "long featherweight prime built on pace, durability, and one of the deepest quality-win ledgers in the ranking"
      }
    },
    "Conor McGregor": {
      shortCase: "McGregor is the peak-star two-division case: featherweight takeover, Aldo knockout, lightweight title win, and a short UFC prime that hit harder culturally than almost anyone's.",
      peak: "At his best, Conor was timing, counter left hand, pressure reads, range control, and rare big-fight composure. His featherweight climb was fast, violent, and historically important.",
      resume: "McGregor's UFC case is loud but short. The Aldo and Alvarez wins are enormous, but the lack of defenses and later losses keep the resume below the long-reign champions.",
      championship: "The championship case is unique: interim featherweight title, undisputed featherweight title, and lightweight title, but no UFC title defenses.",
      opponentQuality: "Aldo, Holloway, Mendes, Alvarez, Poirier, Diaz, Cerrone, and Brandao give McGregor a compact but high-impact UFC win list.",
      longevity: "Longevity is the limiter. His elite UFC run burned extremely bright, but it was not sustained like the best all-time resumes.",
      counter: "The argument against Conor is volume: no title defenses, short prime window, and later losses that make the resume feel incomplete compared with the long-control champions.",
      edge: "McGregor wins comparisons when peak impact, two-division title value, and the Aldo/Alvarez championship moments outweigh longer but less explosive resumes.",
      eliteCounter: true,
      signatureWins: "Aldo, Holloway, Mendes, Alvarez, Poirier, Diaz, Cerrone, and Brandao give McGregor a short but famous UFC-only win list.",
      titleSummary: "McGregor captured UFC gold at featherweight and lightweight, plus an interim featherweight belt, but never defended a UFC title.",
      primeSummary: "His prime was one of the loudest short peaks ever: fast featherweight rise, Aldo knockout, and two-division champion moment.",
      titleStyle: "twoDivisionStarPeak",
      primeStyle: "shortIconicPrime",
      legacyStats: {
        titleFightWins: 3,
        beltsWon: 2,
        titleDefenses: 0,
        activeEliteYearsLabel: "roughly 4 active elite years",
        primeNote: "short iconic featherweight/lightweight peak with massive championship moments but no title defenses"
      }
    },
    "Kamaru Usman": {
      shortCase: "Usman is the modern welterweight control case: dominant title reign, repeated wins over top contenders, strong round control, and only losing separation late against Leon Edwards.",
      peak: "At his best, Usman was wrestling pressure, clinch control, jab development, cardio, durability, and championship discipline. His prime version could win ugly or hurt elite contenders on the feet.",
      resume: "Usman's UFC case is one of the strongest welterweight resumes after GSP: title win over Woodley, multiple defenses, and repeated rivalry wins over Covington and Masvidal.",
      championship: "The championship case is excellent: undisputed welterweight title win and five successful defenses during a clear reign over the division.",
      opponentQuality: "Woodley, Covington twice, Masvidal twice, Burns, dos Anjos, Maia, Strickland, Edwards, and Muhammad-era context give Usman strong modern welterweight depth.",
      longevity: "Usman had a strong active elite window from contender rise through title reign, though the Edwards losses and Chimaev fight mark the decline phase.",
      counter: "The argument against Usman is that GSP still owns the deeper welterweight GOAT case, and the Leon Edwards rivalry damaged the ending of Usman's title story.",
      edge: "Usman wins comparisons when modern welterweight title control, repeated elite wins, and five-defense championship volume are the separator.",
      eliteCounter: true,
      signatureWins: "Woodley, Covington twice, Masvidal twice, Burns, dos Anjos, Maia, Strickland, and Edwards give Usman a strong modern welterweight win list.",
      titleSummary: "Usman won the welterweight title from Woodley and defended it five times, making him the clearest modern welterweight title case behind GSP.",
      primeSummary: "His prime was title-heavy and control-based, with enough striking growth to make the second half of the reign more dangerous.",
      titleStyle: "modernWelterweightReign",
      primeStyle: "controlPressurePrime",
      legacyStats: {
        titleFightWins: 6,
        beltsWon: 1,
        titleDefenses: 5,
        activeEliteYearsLabel: "roughly 5 active elite years",
        primeNote: "modern welterweight title prime built on wrestling control, improved striking, and repeated contender wins"
      }
    },
    "Dominick Cruz": {
      shortCase: "Cruz is the footwork-and-injury-context case: UFC bantamweight champion, elite movement, a title return after years away, and a resume that is hurt by UFC-only scope excluding WEC reign value.",
      peak: "At his best, Cruz was angles, footwork, feints, pace, defensive reads, and awkward timing. He made elite bantamweights miss and reset over and over.",
      resume: "Cruz's UFC case is strong but unusual because a major part of his historical greatness sits in WEC context, which is not scored directly in this UFC-only ranking.",
      championship: "The UFC championship case includes bantamweight title wins, defenses, and the Dillashaw comeback, but it is smaller than his full historical bantamweight case because WEC is excluded.",
      opponentQuality: "Dillashaw, Demetrious Johnson, Faber twice in UFC terms, Benavidez context, Mizugaki, and Casey Kenney give Cruz a meaningful but interrupted UFC win list.",
      longevity: "His active elite years are complicated by injuries. The model should credit elite returns, but it should not let long inactivity gaps inflate the longevity score.",
      counter: "The argument against Cruz in this ranking is UFC-only scope and injuries. His full historical bantamweight case is stronger than the UFC-only score can show.",
      edge: "Cruz wins comparisons when elite bantamweight skill, direct wins over Johnson/Dillashaw/Faber, and comeback value matter more than uninterrupted title volume.",
      eliteCounter: true,
      signatureWins: "Dillashaw, Demetrious Johnson, Faber twice in UFC terms, Mizugaki, and Casey Kenney give Cruz a compact but important UFC resume.",
      titleSummary: "Cruz held and regained UFC bantamweight gold, with the Dillashaw comeback win giving his championship case a special legacy bump.",
      primeSummary: "His prime is brilliant but fragmented, with injury gaps limiting active elite-year credit even though the skill case stays elite.",
      titleStyle: "injuryContextBantamweightChampion",
      primeStyle: "footworkDefensivePrime",
      legacyStats: {
        titleFightWins: 4,
        beltsWon: 1,
        titleDefenses: 3,
        activeEliteYearsLabel: "roughly 5 active elite years",
        primeNote: "elite bantamweight movement prime interrupted by major injury gaps; WEC reign is context only"
      }
    },
    "Henry Cejudo": {
      shortCase: "Cejudo is the compact two-division champion case: Olympic-level wrestling, wins over Demetrious Johnson, Dillashaw, Moraes, and Cruz, and a short UFC prime with huge title value.",
      peak: "At his best, Cejudo blended wrestling, clinch adjustments, improved boxing, pressure, and championship adaptability. He solved different styles quickly during his title surge.",
      resume: "Cejudo's UFC resume is compact but extremely high-value: flyweight title, bantamweight title, and direct wins over several champions or all-time names.",
      championship: "The championship case is strong because he won UFC titles at flyweight and bantamweight, defended flyweight, and defended bantamweight before retiring the first time.",
      opponentQuality: "Demetrious Johnson, Dillashaw, Moraes, Cruz, Sergio Pettis, Reis, Formiga, and Benavidez context give Cejudo a strong short-run win list.",
      longevity: "Longevity is the limiter. Cejudo's championship peak was excellent, but the active elite window is shorter than most long-reign GOAT candidates.",
      counter: "The argument against Cejudo is volume. The two-division peak is real, but he does not have the long title-control sample of the fighters above him.",
      edge: "Cejudo wins comparisons when compact two-division title value and direct elite wins outweigh longer but less historically dense resumes.",
      eliteCounter: true,
      signatureWins: "Demetrious Johnson, Dillashaw, Moraes, Cruz, Sergio Pettis, Reis, and Formiga give Cejudo a compact but high-impact UFC ledger.",
      titleSummary: "Cejudo won UFC titles at flyweight and bantamweight, with title-fight wins over Johnson, Dillashaw, Moraes, and Cruz anchoring the case.",
      primeSummary: "His prime was short but dense, with rapid skill growth and major title wins packed into a tight window.",
      titleStyle: "compactTwoDivisionChampion",
      primeStyle: "shortAdaptiveTitlePrime",
      legacyStats: {
        titleFightWins: 4,
        beltsWon: 2,
        titleDefenses: 2,
        activeEliteYearsLabel: "roughly 4 active elite years",
        primeNote: "short two-division title prime with high-value direct wins over all-time names"
      }
    },
    "Cain Velasquez": {
      shortCase: "Cain is the heavyweight peak-destruction case: brutal pace, wrestling, cardio, title wins, and a prime that looked terrifying before injuries shortened the resume.",
      peak: "At his best, Cain was pace, pressure, wrestling, boxing volume, cardio, and ground-and-pound. Heavyweights were not supposed to fight at that tempo.",
      resume: "Cain's UFC case is peak-heavy. The Lesnar and dos Santos wins are major, but injuries and the Werdum loss keep the total resume behind Stipe's heavyweight standard.",
      championship: "The championship case is strong but not long: UFC heavyweight title win, title regain, and defenses during one of the division's most violent eras.",
      opponentQuality: "Lesnar, Junior dos Santos twice, Bigfoot Silva twice, Nogueira, Rothwell, Kongo, and Travis Browne give Cain a strong heavyweight win list.",
      longevity: "Longevity is the limiter. Cain's active elite years are meaningful, but injuries repeatedly interrupted what could have been a much larger heavyweight case.",
      counter: "The argument against Cain is availability and volume. The peak was huge, but the resume does not have Stipe's depth or title-fight total.",
      edge: "Cain wins comparisons when heavyweight peak dominance, prime pace, and the dos Santos trilogy comeback matter more than longer title volume.",
      eliteCounter: true,
      signatureWins: "Lesnar, Junior dos Santos twice, Bigfoot Silva twice, Nogueira, Rothwell, Kongo, and Travis Browne give Cain a strong heavyweight UFC resume.",
      titleSummary: "Cain won and regained the UFC heavyweight title, with the Lesnar win and dos Santos rivalry defining most of his championship value.",
      primeSummary: "His prime was terrifying but injury-limited, which is why the peak feels higher than the full resume score.",
      titleStyle: "heavyweightPeakChampion",
      primeStyle: "pressureCardioHeavyweightPrime",
      legacyStats: {
        titleFightWins: 4,
        beltsWon: 1,
        titleDefenses: 2,
        activeEliteYearsLabel: "roughly 6 active elite years",
        primeNote: "heavyweight pressure peak with elite pace and violence, shortened by injuries and lower total volume"
      }
    }
  };

  const PACK_LEDGER = {
    "alexander volkanovski|max holloway": {
      fighters: ["Alexander Volkanovski", "Max Holloway"],
      fights: 3,
      winner: "Alexander Volkanovski",
      importance: "major",
      summary: "Volkanovski beat Holloway three times, creating clear direct separation in the featherweight GOAT debate even though Max still owns huge longevity and quality-win value."
    },
    "jose aldo|max holloway": {
      fighters: ["Jose Aldo", "Max Holloway"],
      fights: 2,
      winner: "Max Holloway",
      importance: "major",
      summary: "Holloway stopped Aldo twice in UFC featherweight title fights, giving Max two massive direct wins over a divisional legend."
    },
    "conor mcgregor|max holloway": {
      fighters: ["Conor McGregor", "Max Holloway"],
      fights: 1,
      winner: "Conor McGregor",
      importance: "contextual",
      summary: "McGregor beat Holloway early in both men's UFC runs. It matters as a direct result, but it should not override Holloway's much longer later featherweight resume."
    },
    "conor mcgregor|jose aldo": {
      fighters: ["Conor McGregor", "Jose Aldo"],
      fights: 1,
      winner: "Conor McGregor",
      importance: "major",
      summary: "McGregor knocked out Aldo to win the featherweight title, one of the biggest single legacy wins in UFC history and the center of Conor's peak case."
    },
    "conor mcgregor|khabib nurmagomedov": {
      fighters: ["Conor McGregor", "Khabib Nurmagomedov"],
      fights: 1,
      winner: "Khabib Nurmagomedov",
      importance: "major",
      summary: "Khabib submitted McGregor in their lightweight title fight, giving Khabib the direct rivalry edge in one of the biggest fights in UFC history."
    },
    "conor mcgregor|dustin poirier": {
      fighters: ["Conor McGregor", "Dustin Poirier"],
      fights: 3,
      winner: "Dustin Poirier",
      importance: "major",
      summary: "McGregor won the first UFC meeting, but Poirier won the next two and took the overall UFC rivalry edge. That late series hurts Conor's back-end resume."
    },
    "conor mcgregor|nate diaz": {
      fighters: ["Conor McGregor", "Nate Diaz"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "Diaz submitted McGregor first, then McGregor won the rematch by decision. The rivalry is split and mostly adds context to Conor's risk-taking at welterweight."
    },
    "colby covington|kamaru usman": {
      fighters: ["Colby Covington", "Kamaru Usman"],
      fights: 2,
      winner: "Kamaru Usman",
      importance: "major",
      summary: "Usman beat Covington twice in welterweight title fights, giving him clean rivalry separation over one of his strongest era rivals."
    },
    "kamaru usman|leon edwards": {
      fighters: ["Kamaru Usman", "Leon Edwards"],
      fights: 3,
      winner: "Leon Edwards",
      importance: "major",
      summary: "Usman beat Edwards early, but Edwards won the two title fights, including the head-kick comeback. That rivalry is the main ceiling on Usman's welterweight case."
    },
    "kamaru usman|tyron woodley": {
      fighters: ["Kamaru Usman", "Tyron Woodley"],
      fights: 1,
      winner: "Kamaru Usman",
      importance: "major",
      summary: "Usman dominated Woodley to win the welterweight title, a major passing-of-the-torch win in the modern 170-pound lineage."
    },
    "gilbert burns|kamaru usman": {
      fighters: ["Gilbert Burns", "Kamaru Usman"],
      fights: 1,
      winner: "Kamaru Usman",
      importance: "major",
      summary: "Usman stopped Burns in a welterweight title defense, adding a dangerous prime contender to his championship resume."
    },
    "kamaru usman|jorge masvidal": {
      fighters: ["Kamaru Usman", "Jorge Masvidal"],
      fights: 2,
      winner: "Kamaru Usman",
      importance: "contextual",
      summary: "Usman beat Masvidal twice in title fights, first over five rounds and then by knockout, strengthening the title-defense volume of his reign."
    },
    "demetrious johnson|dominick cruz": {
      fighters: ["Demetrious Johnson", "Dominick Cruz"],
      fights: 1,
      winner: "Dominick Cruz",
      importance: "major",
      summary: "Cruz beat Johnson in a UFC bantamweight title fight before Johnson became the flyweight standard. It gives Cruz a huge direct win, with division context attached."
    },
    "dominick cruz|henry cejudo": {
      fighters: ["Dominick Cruz", "Henry Cejudo"],
      fights: 1,
      winner: "Henry Cejudo",
      importance: "major",
      summary: "Cejudo stopped Cruz in a bantamweight title fight, giving Henry a direct win over an all-time bantamweight name, even with comeback/context questions around Cruz."
    },
    "dominick cruz|t.j. dillashaw": {
      fighters: ["Dominick Cruz", "T.J. Dillashaw"],
      fights: 1,
      winner: "Dominick Cruz",
      importance: "major",
      summary: "Cruz beat Dillashaw to regain the bantamweight title after years of injuries, one of the most important comeback wins in UFC championship history."
    },
    "dominick cruz|urijah faber": {
      fighters: ["Dominick Cruz", "Urijah Faber"],
      fights: 2,
      winner: "Dominick Cruz",
      importance: "major",
      summary: "In UFC-only terms, Cruz beat Faber twice, including a title fight. Their WEC meeting is historical context, but not scored in this UFC-only ledger."
    },
    "demetrious johnson|henry cejudo": {
      fighters: ["Demetrious Johnson", "Henry Cejudo"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "Johnson finished Cejudo first, then Cejudo won the close rematch to take the flyweight title. The split is central to both men's UFC cases."
    },
    "henry cejudo|t.j. dillashaw": {
      fighters: ["Henry Cejudo", "T.J. Dillashaw"],
      fights: 1,
      winner: "Henry Cejudo",
      importance: "major",
      summary: "Cejudo stopped Dillashaw in a flyweight title defense, adding a champion-versus-champion style win to Henry's compact title run."
    },
    "henry cejudo|marlon moraes": {
      fighters: ["Henry Cejudo", "Marlon Moraes"],
      fights: 1,
      winner: "Henry Cejudo",
      importance: "major",
      summary: "Cejudo beat Moraes to win the vacant bantamweight title, completing the two-division championship piece of his UFC case."
    },
    "brock lesnar|cain velasquez": {
      fighters: ["Brock Lesnar", "Cain Velasquez"],
      fights: 1,
      winner: "Cain Velasquez",
      importance: "major",
      summary: "Cain stopped Lesnar to win the heavyweight title, one of the defining wins of his peak-pressure case."
    },
    "cain velasquez|junior dos santos": {
      fighters: ["Cain Velasquez", "Junior dos Santos"],
      fights: 3,
      winner: "Cain Velasquez",
      importance: "major",
      summary: "Dos Santos knocked Cain out first, but Cain won the next two title fights in dominant fashion, taking clear trilogy separation."
    },
    "cain velasquez|fabricio werdum": {
      fighters: ["Cain Velasquez", "Fabricio Werdum"],
      fights: 1,
      winner: "Fabricio Werdum",
      importance: "major",
      summary: "Werdum submitted Cain to win the heavyweight title, a major ceiling fight on Cain's all-time heavyweight resume."
    },
    "cain velasquez|francis ngannou": {
      fighters: ["Cain Velasquez", "Francis Ngannou"],
      fights: 1,
      winner: "Francis Ngannou",
      importance: "contextual",
      summary: "Ngannou beat Cain late in Cain's injury-damaged career. It is a direct result, but it should be treated with post-prime context."
    },
    "antonio silva|cain velasquez": {
      fighters: ["Antonio Silva", "Cain Velasquez"],
      fights: 2,
      winner: "Cain Velasquez",
      importance: "contextual",
      summary: "Cain beat Bigfoot Silva twice, including a heavyweight title defense, showing the violent pressure style that defined his prime."
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