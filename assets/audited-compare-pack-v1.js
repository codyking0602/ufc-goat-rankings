(function () {
  function normalizeKey(a, b) {
    return [String(a || '').toLowerCase(), String(b || '').toLowerCase()].sort().join('|');
  }

  function mergeProfile(fighter, profile) {
    window.COMPARE_PROFILES = window.COMPARE_PROFILES || {};
    const existing = window.COMPARE_PROFILES[fighter] || {};
    window.COMPARE_PROFILES[fighter] = {
      ...existing,
      ...profile,
      legacyStats: {
        ...(existing.legacyStats || {}),
        ...(profile.legacyStats || {})
      }
    };
  }

  const PACK_PROFILES = {
    "Ilia Topuria": {
      shortCase: "Topuria is a short-sample, high-impact championship case: Volkanovski, Holloway, and Oliveira in a compact UFC run, with two-division title value already on the board.",
      peak: "At his best, Topuria is boxing power, grappling threat, pressure, and finish confidence. The peak is loud enough to beat legends quickly, but the sample is still young.",
      resume: "Ilia has one of the strongest peak-per-fight cases in the ranking, but he still lacks the long title reign and total UFC volume of the established all-time names.",
      championship: "The title case is huge for the sample: featherweight title win over Volkanovski, defense over Holloway, and lightweight title win over Oliveira under the locked audit.",
      opponentQuality: "Volkanovski, Holloway, Oliveira, Emmett, and Mitchell give Ilia a young but already elite high-end ledger.",
      longevity: "Longevity is the obvious limiter. The active elite window is under three years in the locked audit.",
      counter: "The case is still young. The elite sample is short, the fight count is small, and the Gaethje title loss keeps the current ceiling below the deep long-reign greats.",
      edge: "Topuria wins comparisons when compact peak quality, two-division title value, and direct wins over legends outweigh older fighters’ deeper volume.",
      eliteCounter: true,
      signatureWins: "Volkanovski, Holloway, Oliveira, Emmett, and Mitchell give Topuria a short but very loud UFC ledger.",
      titleSummary: "Topuria's title case is built on a featherweight takeover plus a lightweight title win over Charles Oliveira.",
      primeSummary: "His prime is a peak-versus-volume test: massive top-end wins, not long-reign volume yet.",
      titleStyle: "compactTwoDivisionPeak",
      primeStyle: "shortHighImpactPrime",
      legacyStats: { titleFightWins: 3, beltsWon: 2, titleDefenses: 1, activeEliteYearsLabel: "roughly 3 active elite years", primeNote: "short elite window with huge wins and one title-loss ceiling check" }
    },
    "Dustin Poirier": {
      shortCase: "Poirier is the modern lightweight quality-wins case: Holloway, Gaethje, Alvarez, Pettis, Conor, Hooker, Chandler, and Saint Denis without an undisputed title win.",
      peak: "At his best, Dustin was pressure boxing, durability, combinations, southpaw counters, and championship-level grit in the deepest lightweight era.",
      resume: "Dustin's UFC résumé is deeper than many champions around him, but the Khabib, Oliveira, Islam, Gaethje 2, and Holloway 3 fights define the ceiling.",
      championship: "The championship case is limited by no undisputed title, but the interim lightweight title over Holloway still carries meaningful title-level value.",
      opponentQuality: "Holloway twice, Gaethje, Alvarez, Pettis, Conor twice, Hooker, Chandler, Saint Denis, and Miller give Poirier one of the deepest lightweight ledgers.",
      longevity: "Dustin stayed relevant through a long modern lightweight window, with a prime start locked at Carlos Diego Ferreira.",
      counter: "The missing undisputed belt is the limiter. Dustin was consistently at the highest level, but several legacy-defining title fights went the other way.",
      edge: "Poirier wins comparisons when lightweight depth, quality wins, and elite schedule strength matter more than a cleaner but thinner title case.",
      eliteCounter: true,
      signatureWins: "Holloway twice, Gaethje, Alvarez, Pettis, Conor twice, Hooker, Chandler, Saint Denis, and Miller anchor Dustin’s lightweight résumé.",
      titleSummary: "Dustin owns interim lightweight title value, but no undisputed UFC title win.",
      primeSummary: "His prime is a long lightweight danger run built on quality wins and brutal schedule strength.",
      titleStyle: "interimLightweightQualityWins",
      primeStyle: "deepLightweightContenderPrime",
      legacyStats: { titleFightWins: 1, beltsWon: 0, titleDefenses: 0, activeEliteYearsLabel: "roughly 11 active elite years", primeNote: "long modern lightweight prime without undisputed title payoff" }
    },
    "Frankie Edgar": {
      shortCase: "Edgar is the long-form résumé case: lightweight champion, Maynard trilogy grit, and years of featherweight title relevance against elite opponents.",
      peak: "At his best, Frankie was pace, boxing entries, wrestling chains, recovery, cardio, and undersized toughness against elite opposition.",
      resume: "Frankie's record looks messy because he fought elite names for years, but the UFC-only résumé has title value and cross-division longevity.",
      championship: "The championship case is real: undisputed lightweight title win, title defenses/retention value, and later featherweight title relevance.",
      opponentQuality: "B.J. Penn, Maynard, Charles Oliveira, Cub Swanson, Faber, Mendes, Yair, Stephens, Aldo, Ortega, and Holloway shape a deep multi-era ledger.",
      longevity: "Frankie's active elite window is one of the stronger parts of the case, especially with the locked prime running through Holloway 2019.",
      counter: "Frankie has strong title credibility but not huge title-win volume. Several Aldo/Ortega/Holloway-level fights that could have pushed him higher went the other way.",
      edge: "Edgar wins comparisons when lightweight title value, cross-division relevance, elite schedule strength, and active longevity outweigh cleaner short peaks.",
      eliteCounter: true,
      signatureWins: "B.J. Penn, Maynard, Charles Oliveira, Cub Swanson, Faber, Mendes, Yair, and Stephens give Frankie a deep UFC-only ledger.",
      titleSummary: "Frankie's title case starts with winning the UFC lightweight title and staying title-relevant at featherweight.",
      primeSummary: "His prime is a long small-fighter-against-elite-opposition run, not a clean dominance reel.",
      titleStyle: "longFormLightweightChampion",
      primeStyle: "durableMultiDivisionPrime",
      legacyStats: { titleFightWins: 3, beltsWon: 1, titleDefenses: 2, activeEliteYearsLabel: "roughly 9 active elite years", primeNote: "long elite window through Holloway 2019 with capped loss penalty" }
    }
  };

  Object.entries(PACK_PROFILES).forEach(([fighter, profile]) => mergeProfile(fighter, profile));

  const PACK_LEDGER = {
    [normalizeKey("Frankie Edgar", "B.J. Penn")]: { fighters: ["Frankie Edgar", "B.J. Penn"], fights: 3, winner: "Frankie Edgar", importance: "major", summary: "Edgar beat Penn three times in UFC competition, including the lightweight title win and the rematch defense. Penn can still have the bigger total two-division legacy case, but Frankie owns the direct UFC series." },
    [normalizeKey("Frankie Edgar", "Max Holloway")]: { fighters: ["Frankie Edgar", "Max Holloway"], fights: 1, winner: "Max Holloway", importance: "major", summary: "Holloway beat Edgar in a featherweight title fight, one of the ceiling fights on Frankie’s late prime/title-relevance résumé." },
    [normalizeKey("Frankie Edgar", "Jose Aldo")]: { fighters: ["Frankie Edgar", "Jose Aldo"], fights: 2, winner: "Jose Aldo", importance: "major", summary: "Aldo beat Edgar twice in UFC featherweight title-level fights. Those losses are a major reason Frankie’s excellent résumé does not climb higher." },
    [normalizeKey("Dustin Poirier", "Conor McGregor")]: { fighters: ["Dustin Poirier", "Conor McGregor"], fights: 3, winner: "Dustin Poirier", importance: "major", summary: "McGregor won the first UFC meeting, but Poirier won the next two and took the overall UFC rivalry edge. That late series helps Dustin’s résumé and hurts Conor’s back-end case." },
    [normalizeKey("Dustin Poirier", "Charles Oliveira")]: { fighters: ["Dustin Poirier", "Charles Oliveira"], fights: 1, winner: "Charles Oliveira", importance: "major", summary: "Oliveira submitted Poirier in a lightweight title defense. Dustin owns more long-form lightweight depth; Charles owns the direct championship result." },
    [normalizeKey("Dustin Poirier", "Justin Gaethje")]: { fighters: ["Dustin Poirier", "Justin Gaethje"], fights: 2, winner: "Split", importance: "major", summary: "Poirier stopped Gaethje first, then Gaethje knocked out Poirier in the rematch. Their rivalry is split and central to both modern lightweight résumés." }
  };

  window.COMPARE_FIGHT_LEDGER = { ...(window.COMPARE_FIGHT_LEDGER || {}), ...PACK_LEDGER };
  window.AUDITED_COMPARE_PACK_V1_APPLIED = true;
})();
