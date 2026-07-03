// Fighter-specific Compare Mode seasoning for Jon Jones.
// This is reusable debate DNA, not matchup-specific copy.
(function () {
  const VERSION = "compare-seasoning-jon-20260702a";

  const JON_COMPARE_SEASONING = {
    shortCase: "The UFC-only GOAT benchmark: unmatched title-fight volume, elite opponent depth, two-division champion status, and no true competitive UFC loss.",
    peak: "At his peak, Jon was a matchup nightmare: length, wrestling, clinch damage, creativity, fight IQ, durability, and defensive composure all stacked together. He did not just beat elite light heavyweights; he usually made their strengths look unusable.",
    resume: "Jon's resume is built on repeated championship wins over elite names across multiple eras, then capped by moving up and winning the heavyweight title. In a UFC-only comparison, his volume of title-level success is the standard everyone else is chasing.",
    championship: "His championship case is the strongest in the ranking: long light heavyweight reign, repeated UFC title-fight wins, and a second UFC belt at heavyweight.",
    opponentQuality: "Jon's opponent list is loaded with former champions, future Hall of Fame names, and elite contenders. The strength of his case is not one signature win; it is how many high-level names he stacked.",
    longevity: "Jon stayed elite for an unusually long time, from his early light heavyweight title run through his heavyweight title win. Even when the dominance faded late, he was still winning at the highest level.",
    counter: "The case against Jon is cleanliness: late-career performances were less dominant, Gustafsson and Reyes created real debate, the heavyweight sample is thin, and some fans will always hold the official Hamill DQ, no contest, or outside-the-cage issues against the resume.",
    edge: "Jon's edge is championship volume plus opponent depth. Other fighters may have cleaner stories, prettier peaks, or fewer caveats, but Jon's UFC-only resume has the most total weight.",
    signatureWins: "Cormier, Gustafsson, Shogun, Machida, Rashad, Rampage, Glover, Belfort, and Gane give Jon a title-level win stack that almost nobody can match.",
    weakness: "Late-prime dominance dipped, Reyes and Gustafsson created real debate, the heavyweight resume is short, and the Hamill DQ needs context even though this model does not treat it as a true competitive loss.",
    titleSummary: "UFC light heavyweight champion, UFC heavyweight champion, and the strongest UFC title-fight resume in the system.",
    primeSummary: "Long prime built around elite control, adaptability, durability, and the ability to beat championship-level opponents in different styles of fights.",
    titleStyle: "Championship Volume King",
    primeStyle: "Matchup Nightmare",
    bestArgument: "Jon's best argument is total UFC-only weight: the deepest title-fight resume, elite opponent depth across eras, two-division champion value, and no true competitive UFC loss.",
    hamillContext: "The Matt Hamill DQ is official, but this ranking does not treat it as a true competitive loss.",
    cleanResumeCounter: "GSP, Khabib, and DJ can argue cleaner resumes in different ways; Jon's answer is that his championship volume and opponent depth still carry more total UFC-only weight.",
    betterFighterVsGoat: "Skill-for-skill debates can get closer, but the UFC-only GOAT resume benchmark remains Jon because of title volume, opponent depth, and multi-era championship success.",
    eliteCounter: true,
    legacyStats: {
      ufcRecord: "22-1, 1 NC",
      trueCompetitiveUfcLosses: 0,
      titleFightWins: 16,
      beltsWon: 2,
      titleDefenses: 11,
      divisions: "LHW / HW",
      neverFinishedInUfc: true,
      activeEliteYearsLabel: "roughly 12 active elite years",
      primeNote: "multi-era elite run from young light heavyweight champion to later heavyweight title winner, with late-career close-fight context but no true competitive UFC loss"
    }
  };

  function mergeLegacyStats(existingStats, seasoningStats) {
    return {
      ...(existingStats || {}),
      ...(seasoningStats || {})
    };
  }

  function mergeProfile(existing, seasoning) {
    return {
      ...(existing || {}),
      ...seasoning,
      legacyStats: mergeLegacyStats((existing || {}).legacyStats, seasoning.legacyStats)
    };
  }

  function installJonSeasoning() {
    window.COMPARE_PROFILES = window.COMPARE_PROFILES || {};
    const mergedProfile = mergeProfile(window.COMPARE_PROFILES["Jon Jones"], JON_COMPARE_SEASONING);
    window.COMPARE_PROFILES["Jon Jones"] = mergedProfile;

    if (typeof DISPLAY_OVERRIDES !== "undefined") {
      DISPLAY_OVERRIDES["Jon Jones"] = DISPLAY_OVERRIDES["Jon Jones"] || {};
      DISPLAY_OVERRIDES["Jon Jones"].compareProfile = mergeProfile(
        DISPLAY_OVERRIDES["Jon Jones"].compareProfile,
        mergedProfile
      );
    }

    window.UFC_JON_COMPARE_SEASONING = {
      version: VERSION,
      fighter: "Jon Jones",
      requiredFields: [
        "shortCase",
        "peak",
        "resume",
        "championship",
        "opponentQuality",
        "longevity",
        "counter",
        "edge",
        "signatureWins",
        "weakness",
        "titleSummary",
        "primeSummary",
        "titleStyle",
        "primeStyle",
        "legacyStats"
      ],
      applied: true,
      profile: mergedProfile
    };
  }

  installJonSeasoning();
})();
