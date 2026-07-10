// Built from the embedded source payload by tools/split-display-overrides.py.
// Long-term source target: edit this file directly once index.html is fully layout-only.
const DISPLAY_OVERRIDES = {
  "Jon Jones": {
    overallOvr: 99,
    allTimeRank: 1,
    divisionLabel: "LHW / HW",
    resumeTag: "UFC benchmark resume",
    photoUrl: "assets/fighters/jon-jones.webp",
    thumbUrl: "assets/fighters/jon-jones-thumb.webp",
    oneLiner: "The benchmark UFC resume: unmatched title-fight success, elite quality wins, long-term dominance, and no true competitive loss.",
    categories: {
      championship: { ovr: 99, rank: 1 },
      opponentQuality: { ovr: 98, rank: 1 },
      primeDominance: { ovr: 96, rank: 3 },
      longevity: { ovr: 98, rank: 1 }
    },
    snapshot: [
      ["UFC Record", "22-1, 1 NC"],
      ["UFC Title-Fight Wins", "16"],
      ["Championship Level", "All-Time Best"],
      ["Elite Wins", "All-Time Best Tier"],
      
      ["Active Elite Years", "Elite Longevity"],
      ["Loss Context", "No true competitive loss"]
    ],
    whyRankedHere: "Jones ranks #1 because he has the strongest UFC championship resume ever, the best title-fight win total, elite wins across multiple eras, and one of the longest elite runs in UFC history. His resume combines championship success, quality wins, prime dominance, and longevity better than anyone else.",
    whyNotLower: "The main arguments against Jones are close fights, inactivity gaps, late-career sample size at heavyweight, and outside-the-cage controversy. But as a UFC resume, his in-cage case still has the strongest overall combination of title success, elite opponents, dominance, and longevity.",
    keyJudgmentCalls: [
      ["Matt Hamill DQ", "not treated as a true competitive loss."],
      ["Daniel Cormier NC", "not counted as a win, but the broader Cormier rivalry still matters in context."],
      ["Heavyweight run", "boosts the resume, but does not carry the case by itself."],
      ["Close fights", "Santos/Reyes slightly affect dominance, but not enough to move him from #1."],
      ["Controversy", "acknowledged in context, while the profile stays focused on the UFC resume."]
    ],
    finalTakeaway: "Jones is the UFC benchmark: the deepest championship resume, elite quality wins, rare longevity, and no true competitive loss. He is the 99 OVR standard every other fighter is measured against."

  },
  "Georges St-Pierre": {
    overallOvr: 96,
    allTimeRank: 2,
    divisionLabel: "WW / MW",
    resumeTag: "Complete all-time resume",
    photoUrl: "assets/fighters/georges-st-pierre.webp",
    thumbUrl: "assets/fighters/georges-st-pierre-thumb.webp",
    oneLiner: "The complete UFC resume: a legendary welterweight reign, elite quality wins, and one of the cleanest prime runs in the sport.",
    categories: {
      championship: { ovr: 94, rank: 2 },
      opponentQuality: { ovr: 99, rank: 1 },
      primeDominance: { ovr: 93, rank: 5 },
      longevity: { ovr: 96, rank: 2 }
    },
    snapshot: [
      ["UFC Record", "20-2"],
      ["UFC Title-Fight Wins", "13"],
      ["Championship Level", "All-Time Great"],
      ["Elite Wins", "Best Quality Wins Case"],
      
      ["Active Elite Years", "Long Championship Window"],
      ["Loss Context", "Hughes and Serra losses were avenged decisively"]
    ],
    whyRankedHere: "St-Pierre ranks #2 because he combines an all-time welterweight title reign with the strongest quality-wins case in the UFC, elite consistency across his prime, and decisive revenge wins over the losses that matter most. His resume is one of the deepest, cleanest, and easiest to defend in the sport.",
    whyNotHigher: "Jon Jones still has the edge in championship volume and total time at the very top. St-Pierre's case is elite across the board, but the Serra upset and slightly lower title-fight total keep him just behind #1.",
    keyJudgmentCalls: [
      ["Matt Hughes 2004", "counts as a real early-career elite loss, but it was avenged twice."],
      ["Matt Serra 2007", "counts as a meaningful upset loss, but the rematch and title reclaim are central to his case."],
      ["Middleweight title win", "adds value, but his resume is built primarily on the welterweight reign."],
      ["Opponent quality wins", "is the clearest strength of the GSP case and the best in this ranking's current data."],
      ["Late-career sample", "is small, so the profile stays focused on the established welterweight prime."]
    ],
    finalTakeaway: "St-Pierre is the complete champion case: elite title success, the best quality-wins score in this ranking, long-term consistency, and decisive answers to the biggest questions on his resume."
  },
  "Demetrious Johnson": {
    overallOvr: 93,
    allTimeRank: 3,
    divisionLabel: "FLW",
    resumeTag: "Flyweight standard",
    photoUrl: "assets/fighters/demetrious-johnson.webp",
    thumbUrl: "assets/fighters/demetrious-johnson-thumb.webp",
    oneLiner: "The defining UFC flyweight champion: historic title control, elite technical dominance, and one of the cleanest prime skill sets in the sport.",
    categories: {
      championship: { ovr: 92, rank: 3 },
      opponentQuality: { ovr: 85, rank: 11 },
      primeDominance: { ovr: 94, rank: 4 },
      longevity: { ovr: 90, rank: 8 }
    },
    snapshot: [
      ["UFC Record", "15-2-1"],
      ["UFC Title-Fight Wins", "12"],
      ["Championship Level", "Historic Flyweight Reign"],
      ["Elite Wins", "Strong but Division-Adjusted"],
      
      ["Active Elite Years", "Elite Championship Window"],
      ["Loss Context", "Cruz and Cejudo losses add context, not collapse"]
    ],
    whyRankedHere: "Johnson ranks #3 because he built the UFC flyweight standard: a long title reign, elite technical control, strong prime dominance, and one of the best championship resumes in this ranking. His case is especially strong in title success and prime skill separation.",
    whyNotHigher: "Johnson trails Jones and St-Pierre because his quality-wins score and flyweight division-strength context are lower in the current scoring model. His later non-UFC success adds historical context, but this ranking is based on the UFC resume.",
    keyJudgmentCalls: [
      ["Flyweight context", "his dominance is respected, while the division-strength adjustment keeps the quality-wins score below the very top tier."],
      ["Dominick Cruz loss", "a real UFC loss at bantamweight, but not the core of his flyweight prime."],
      ["Henry Cejudo loss", "matters because it ended the UFC reign, but it was close enough that it does not erase the championship run."],
      ["Non-UFC success", "can be mentioned historically, but it is not scored in this ranking."],
      ["Skill vs resume", "his skill case may be even higher than his UFC resume score."]
    ],
    finalTakeaway: "Johnson is the UFC flyweight benchmark: historic title success, elite prime dominance, and a clean technical style that still grades near the top of the all-time list."
  },
  "Anderson Silva": {
    overallOvr: 91,
    allTimeRank: 4,
    divisionLabel: "MW",
    resumeTag: "Peak aura standard",
    photoUrl: "assets/fighters/anderson-silva.webp",
    thumbUrl: "assets/fighters/anderson-silva-thumb.webp",
    oneLiner: "The peak-aura case: historic middleweight title control, terrifying finishing dominance, and one of the most iconic prime runs in UFC history.",
    categories: {
      championship: { ovr: 90, rank: 4 },
      opponentQuality: { ovr: 84, rank: 13 },
      primeDominance: { ovr: 90, rank: 10 },
      longevity: { ovr: 91, rank: 6 }
    },
    snapshot: [
      ["UFC Record", "17-7, 1 NC"],
      ["UFC Title-Fight Wins", "11"],
      ["Championship Level", "Historic Middleweight Reign"],
      ["Elite Wins", "Strong but Division-Adjusted"],
      
      ["Active Elite Years", "Long Elite Window"],
      ["Loss Context", "Weidman losses count; later losses are treated as post-prime context"]
    ],
    whyRankedHere: "Silva ranks #4 because his peak remains one of the most dominant and iconic runs in UFC history. He paired a historic middleweight title reign with rare finishing threat, long-term aura, and a level of separation that still defines elite prime dominance.",
    whyNotHigher: "Silva does not pass the top three because the current scoring model gives Jones, St-Pierre, and Johnson stronger overall combinations of championship volume, opponent-quality wins, clean prime record, and loss context. The Weidman losses matter, and the middleweight division-strength adjustment keeps his quality-wins score below the very top tier.",
    keyJudgmentCalls: [
      ["Peak aura", "central to the Silva case and heavily reflected in the prime-dominance score."],
      ["Weidman losses", "count as in-prime losses and are real resume drag."],
      ["Later losses", "treated mostly as post-prime context rather than the core Silva case."],
      ["Middleweight context", "the division-strength adjustment keeps the quality-wins category below the top tier."],
      ["Finishing threat", "a major reason his prime still feels more dominant than a normal title reign."]
    ],
    finalTakeaway: "Silva is the UFC peak-aura legend: a historic champion, terrifying finisher, and one of the most influential dominant runs ever, with enough loss and opponent-strength context to keep him just behind the top three."
  },
  "Khabib Nurmagomedov": {
    overallOvr: 90,
    allTimeRank: 6,
    divisionLabel: "LW",
    resumeTag: "Prime dominance case",
    photoUrl: "assets/fighters/khabib-nurmagomedov.webp",
    thumbUrl: "assets/fighters/khabib-nurmagomedov-thumb.webp",
    oneLiner: "The cleanest prime run at lightweight: unbeaten in the UFC, overwhelming round control, and the strongest dominance case in this ranking.",
    categories: {
      championship: { ovr: 77, rank: 22 },
      opponentQuality: { ovr: 80, rank: 22 },
      primeDominance: { ovr: 99, rank: 1 },
      longevity: { ovr: 91, rank: 7 }
    },
    snapshot: [
      ["UFC Record", "13-0"],
      ["UFC Title-Fight Wins", "4"],
      ["Championship Level", "Short but Elite Title Run"],
      ["Quality Wins", "Lightweight Champion Tier"],
      
      ["Active Elite Years", "6.0 Elite Years"],
      ["Loss Context", "No UFC losses"]
    ],
    whyRankedHere: "Khabib ranks #6 because his prime-dominance score is the strongest in the current scoring model. He combined suffocating control, elite round winning, and a perfect UFC record, giving him one of the hardest peaks to challenge in this ranking.",
    whyNotHigher: "He does not climb higher because the current scoring model gives him less championship volume and fewer quality-wins layers than the fighters above him. His peak is elite enough to compete with anyone, but his total UFC resume is shorter.",
    keyJudgmentCalls: [
      ["Prime dominance", "the clearest strength of the Khabib case and the best score in this ranking."],
      ["No UFC losses", "helps keep the resume unusually clean."],
      ["Lightweight strength", "matters positively because his best work came in an elite division."],
      ["Short title run", "keeps the championship category lower than the all-time leaders."],
      ["Pre-prime wins", "still matter for record and context, but the core scoring window starts around Rafael dos Anjos."]
    ],
    finalTakeaway: "Khabib is the lightweight prime-dominance benchmark: unbeatable at his best, brutally efficient, and held back only by shorter championship volume than the names above him."
  },
  "Islam Makhachev": {
    overallOvr: 90,
    allTimeRank: 5,
    divisionLabel: "LW / WW",
    resumeTag: "Modern lightweight standard",
    photoUrl: "assets/fighters/islam-makhachev.webp",
    thumbUrl: "assets/fighters/islam-makhachev-thumb.webp",
    oneLiner: "The modern lightweight control case: elite finishing efficiency, high-end prime dominance, and a title run that keeps getting stronger.",
    categories: {
      championship: { ovr: 81, rank: 10 },
      opponentQuality: { ovr: 81, rank: 18 },
      primeDominance: { ovr: 98, rank: 2 },
      longevity: { ovr: 88, rank: 11 }
    },
    snapshot: [
      ["UFC Record", "17-1"],
      ["UFC Title-Fight Wins", "6"],
      ["Championship Level", "Fast-Rising Champion Resume"],
      ["Quality Wins", "Modern Lightweight Elite"],
      
      ["Active Elite Years", "4.7 Elite Years"],
      ["Loss Context", "Only UFC loss came pre-prime"]
    ],
    whyRankedHere: "Islam ranks #5 because the current scoring model sees a rare combination of elite prime dominance and a rapidly growing championship resume. His skill, control, and finishing threat already put him near the very top tier.",
    whyNotHigher: "He is still chasing the total volume of the fighters above him. The current scoring model also carries his pre-prime Martins loss and gives him fewer total elite-year reps than the older all-time resumes above him.",
    keyJudgmentCalls: [
      ["Prime start", "the main scoring window begins with Drew Dober in 2021."],
      ["Volkanovski wins", "receive top-level quality-wins credit in this ranking."],
      ["Pre-prime loss", "the Martins loss counts, but only lightly because it came before his prime."],
      ["Prime dominance", "is second-best in this ranking and the strongest part of his case outside the belt run."],
      ["Second division", "the welterweight piece helps the profile, but lightweight remains the center of his resume."]
    ],
    finalTakeaway: "Islam is the modern lightweight benchmark: elite control, elite finishing, and a championship case that is already strong enough to sit in the all-time top five."
  },
  "Alexander Volkanovski": {
    overallOvr: 89,
    allTimeRank: 7,
    divisionLabel: "FW / LW",
    resumeTag: "All-around featherweight case",
    photoUrl: "assets/fighters/alexander-volkanovski.webp",
    thumbUrl: "assets/fighters/alexander-volkanovski-thumb.webp",
    oneLiner: "The complete featherweight champion case: title consistency, strong quality wins, and one of the deepest modern resumes in the sport.",
    categories: {
      championship: { ovr: 84, rank: 7 },
      opponentQuality: { ovr: 87, rank: 4 },
      primeDominance: { ovr: 87, rank: 22 },
      longevity: { ovr: 88, rank: 12 }
    },
    snapshot: [
      ["UFC Record", "15-3"],
      ["UFC Title-Fight Wins", "8"],
      ["Championship Level", "Modern Featherweight Standard"],
      ["Quality Wins", "Top-End Featherweight Case"],
      
      ["Active Elite Years", "6.7 Elite Years"],
      ["Loss Context", "Islam losses get reduced up-division treatment"]
    ],
    whyRankedHere: "Volkanovski ranks #7 because he checks every important box well: championship success, quality wins, consistency, and a long elite stretch at featherweight. He may not have the single highest peak score, but his overall balance is extremely strong.",
    whyNotHigher: "The current scoring model hits him for the Topuria loss and keeps his prime-dominance score below the names with more overwhelming peaks. The up-division Islam losses are handled more lightly, but they still do not boost the resume the way a win would have.",
    keyJudgmentCalls: [
      ["Jose Aldo win", "marks the beginning of the prime scoring window."],
      ["Islam losses", "receive reduced penalties because they were elite up-division title fights."],
      ["Topuria loss", "counts as a meaningful main-division prime finished loss."],
      ["Quality wins", "are a major strength of the Volk case and grade near the top of this ranking."],
      ["Balanced resume", "is the core reason he stays near the top seven even without a #1 category score."]
    ],
    finalTakeaway: "Volkanovski is the all-around featherweight standard: deep title work, strong quality wins, and a balanced resume with very few weak points."
  },
  "Jose Aldo": {
    overallOvr: 88,
    allTimeRank: 11,
    divisionLabel: "FW / BW",
    resumeTag: "Longevity legend",
    photoUrl: "assets/fighters/jose-aldo.webp",
    thumbUrl: "assets/fighters/jose-aldo-thumb.webp",
    oneLiner: "The longevity legend: an elite featherweight reign plus a late-career bantamweight resurgence that keeps his UFC case alive across eras.",
    categories: {
      championship: { ovr: 84, rank: 8 },
      opponentQuality: { ovr: 86, rank: 9 },
      primeDominance: { ovr: 85, rank: 26 },
      longevity: { ovr: 94, rank: 4 }
    },
    snapshot: [
      ["UFC Record", "14-9"],
      ["UFC Title-Fight Wins", "8"],
      ["Championship Level", "Historic Featherweight Champion"],
      ["Quality Wins", "Deep Across Two Eras"],
      
      ["Active Elite Years", "11.3 Elite Years"],
      ["Loss Context", "Later losses mostly sit outside the core prime case"]
    ],
    whyRankedHere: "Aldo ranks #11 because the current scoring model rewards his long elite shelf life, strong title work, and years of quality wins. His resume stays relevant because he held up across multiple generations of contenders.",
    whyNotHigher: "The current scoring model is UFC-only, so his WEC era is not carrying him here. His later UFC losses and a lower prime-dominance score than the names above him keep him just outside the top ten.",
    keyJudgmentCalls: [
      ["UFC-only scope", "means the all-time WEC case is context only, not scored directly."],
      ["Longevity", "is the clear strength of the Aldo profile and one of the best scores in this ranking."],
      ["Interim title", "the UFC 200 interim win adds partial championship credit."],
      ["Post-prime stretch", "the bantamweight resurgence helps longevity even though late losses are less damaging."],
      ["Prime dominance", "sits lower than fans may expect, which is why his total rank lands outside the top ten here."]
    ],
    finalTakeaway: "Aldo is the longevity legend of this ranking: a great champion with a long shelf life, strong quality wins, and a UFC-only profile that still holds up near the top ten."
  },
  "Max Holloway": {
    overallOvr: 88,
    allTimeRank: 9,
    divisionLabel: "FW / LW",
    resumeTag: "Volume and quality wins",
    photoUrl: "assets/fighters/max-holloway.webp",
    thumbUrl: "assets/fighters/max-holloway-thumb.webp",
    oneLiner: "The volume case: relentless pace, elite quality wins, and one of the longest useful elite windows in the featherweight era.",
    categories: {
      championship: { ovr: 79, rank: 17 },
      opponentQuality: { ovr: 93, rank: 2 },
      primeDominance: { ovr: 88, rank: 17 },
      longevity: { ovr: 95, rank: 3 }
    },
    snapshot: [
      ["UFC Record", "23-9"],
      ["UFC Title-Fight Wins", "5"],
      ["Championship Level", "Great but Not Massive Belt Volume"],
      ["Quality Wins", "Second-Best Score in This Ranking"],
      
      ["Active Elite Years", "10.9 Elite Years"],
      ["Loss Context", "Many losses came to elite names and across long volume"]
    ],
    whyRankedHere: "Holloway ranks #9 because his quality-wins score and longevity score are both elite. Few fighters in this ranking have stacked as many meaningful UFC wins over as long a stretch.",
    whyNotHigher: "He sits below the very top names because the current scoring model gives him less championship control and more resume drag from total losses. The volume is impressive, but the belt dominance is not on the level of the names above him.",
    keyJudgmentCalls: [
      ["Quality wins", "are the clearest strength of the Holloway case and rank #2 in this scoring model."],
      ["Longevity", "is another major positive because he stayed elite for such a long period."],
      ["BMF belt", "is not counted as UFC championship credit here."],
      ["Loss volume", "matters, but much of it came against elite competition, which softens the drag."],
      ["Featherweight run", "is the core of the profile even though important lightweight fights add context."]
    ],
    finalTakeaway: "Holloway is the volume-and-quality-wins monster of this ranking: one of the deepest win ledgers in the UFC, backed by real longevity, even without a top-tier championship score."
  }

};

// Durable source override for Petr Yan.
DISPLAY_OVERRIDES["Petr Yan"] = {
  "overallOvr": 87,
  "allTimeRank": 16,
  "divisionLabel": "BW",
  "resumeTag": "Modern bantamweight title case",
  "oneLiner": "A modern bantamweight title case with elite skill, strong round control, and unusual DQ context that needs more nuance than a normal loss.",
  "categories": {
    "championship": {
      "ovr": 78,
      "rank": 20
    },
    "opponentQuality": {
      "ovr": 86,
      "rank": 10
    },
    "primeDominance": {
      "ovr": 91,
      "rank": 8
    },
    "longevity": {
      "ovr": 82,
      "rank": 20
    }
  },
  "snapshot": [
    [
      "UFC Record",
      "12-4"
    ],
    [
      "UFC Title-Fight Wins",
      "2 adjusted title-win credit"
    ],
    [
      "Championship Level",
      "Former Bantamweight Champion"
    ],
    [
      "Quality Wins",
      "Aldo and Sandhagen anchor the case"
    ],
    
    [
      "Active Elite Years",
      "6.0 Elite Years"
    ],
    [
      "Loss Context",
      "Sterling DQ and elite-loss context need nuance"
    ]
  ],
  "whyRankedHere": "Yan ranks here because his UFC-only case has real bantamweight title value, strong elite-round control, and enough quality-win/context credit to belong in the all-time conversation rather than being hidden by the messy Sterling rivalry.",
  "whyNotHigher": "He does not climb higher because the championship volume is limited and the official loss column is heavy for an all-time case, even when several losses have strong context.",
  "keyJudgmentCalls": [
    [
      "Sterling DQ",
      "treated with special context instead of like a normal competitive title loss."
    ],
    [
      "Sandhagen win",
      "important interim-title and elite contender value."
    ],
    [
      "Aldo win",
      "vacant title win over an elite former champion, but not prime Aldo at featherweight."
    ],
    [
      "Later losses",
      "count against the resume, but without finish add-ons where appropriate."
    ],
    [
      "Bantamweight depth",
      "modern bantamweight is treated as a strong division context."
    ]
  ],
  "finalTakeaway": "Yan is a legit modern bantamweight title case: not a top-tier GOAT resume, but clearly strong enough that he should appear in the ranking and compare mode."
};
