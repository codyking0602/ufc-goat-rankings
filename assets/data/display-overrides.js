// App-facing copy, photos, links, and presentation-only overrides.
// Calculated stats, totals, ranks, category ratings, and Resume Snapshot values come from ranking-pipeline.js.
const DISPLAY_OVERRIDES = {
  "Alex Pereira": {
    "photoUrl": "assets/fighters/alex-pereira.webp",
    "thumbUrl": "assets/fighters/alex-pereira-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/rb-yUzZNAcQ?is=o8jclP4Z3MTHGH0x",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/a8orgTRB9zA?is=zvdHIQSdKbY-kgxz",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Pereira is the fast-climb, two-division knockout case: middleweight gold, light heavyweight gold, huge title moments, and a risky heavyweight swing that made the resume louder but messier.",
      "peak": "At his best, Pereira is terrifying because every exchange carries fight-ending danger. The left hook, calf kicks, patience, size, and championship composure make him feel different from normal contenders.",
      "resume": "Pereira’s UFC case is short but extremely loud. He does not have the long active-elite window of the older legends, and the Gane finish loss makes the profile messier, but the title value and finish impact are still massive.",
      "counter": "The argument against Pereira is volume and loss context. The peak is huge, but the UFC sample is still shorter and now messier than the deepest all-time cases.",
      "edge": "Pereira wins comparisons when two-division title value, knockout danger, and high-impact championship moments outweigh longer but less explosive resumes.",
      "eliteCounter": true,
      "signatureWins": "Adesanya, Prochazka twice, Hill, Blachowicz, Strickland, and Rountree give Pereira one of the loudest short-run win lists in the ranking.",
      "titleSummary": "Pereira’s title case is built on winning UFC gold at middleweight and light heavyweight, then adding major light heavyweight title wins almost immediately.",
      "primeSummary": "His elite window is short compared with long-reign champions, and the Gane loss adds heavyweight risk context plus a second counted UFC prime finish loss.",
      "titleStyle": "Fast Two-Division Champion",
      "primeStyle": "Short Knockout Prime",
      "weakness": "The case is still short, and the Adesanya/Gane finish losses keep him below cleaner long-reign GOAT resumes.",
      "bestArgument": "Pereira's case starts with impact: two UFC belts, huge title moments, and one of the loudest short championship climbs in the ranking."
    },
    "divisionLabel": "MW / LHW / HW",
    "resumeTag": "Fast two-division knockout case",
    "oneLiner": "The fast-climb knockout case: middleweight gold, light heavyweight gold, huge title moments, and a heavyweight swing that added risk to a short UFC prime.",
    "whyRankedHere": "Pereira ranks here because his UFC case is short but extremely loud: two-division champion value, major knockout moments, and high-end wins packed into a very small window.",
    "whyNotHigher": "He does not rank higher because the active elite window is still short compared with the long-reign resumes, and the Adesanya and Gane finish losses now give the profile more prime-loss drag. The peak impact is massive, but the total UFC sample is not deep or clean enough yet.",
    "keyJudgmentCalls": [
      [
        "Two-division value",
        "middleweight and light heavyweight gold carry major front-end value."
      ],
      [
        "Knockout impact",
        "a huge part of the profile and why the resume feels louder than the raw volume."
      ],
      [
        "Gane loss",
        "counts as a reduced upward-division elite loss, but being finished still matters."
      ],
      [
        "Adesanya rivalry",
        "adds both a major title win and a major knockout loss."
      ],
      [
        "Short sample",
        "keeps longevity and total resume score capped."
      ]
    ],
    "finalTakeaway": "Pereira remains the loudest short-run case in the ranking: massive title impact and knockout danger, with the Gane heavyweight finish loss adding real drag to an already compact resume.",
    "packetStatus": {
      "stage": "packet live; Watch Moment added; Gane loss updated; UFC record reconciled",
      "lastUpdated": "2026-07-10",
      "nextFix": "Recalculate raw model score if Cody wants the base scoring table adjusted too."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/alex-pereira.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-2.js",
      "watchFallback": "assets/data/fighter-packets/alex-pereira.js",
      "photos": "assets/fighters/alex-pereira.webp and assets/fighters/alex-pereira-thumb.webp"
    }
  },
  "Alexa Grasso": {
    "watchUrl": "https://youtube.com/shorts/JXqN4rvMty4?si=Lige5a6x4R4JlITd",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/P0U_W35_cJw?is=mRmw6BHCQGDfTygx",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "FLW / SW",
    "resumeTag": "Valentina title breaker",
    "oneLiner": "A former UFC flyweight champion whose case is built on the Valentina upset, draw retention, and strong flyweight contender work.",
    "whyRankedHere": "Grasso scores well because beating Valentina for the belt is one of the best women’s UFC wins ever, and the draw retention adds real championship value.",
    "whyNotHigher": "She does not rank higher because the reign was short, she never logged a clean defense win, and Valentina/Natália losses cap the case.",
    "bigAssumptions": [
      [
        "Draw retention",
        "Valentina II is 0.25 adjusted title credit."
      ],
      [
        "Valentina win",
        "Valentina I gets the rare 1.25 Quality Win title-winning champion exception."
      ],
      [
        "Prime start",
        "Prime starts at Maycee Barber I."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Title case",
        "Huge single win plus draw retainment, not long-reign control."
      ],
      [
        "Losses",
        "Valentina III and Natália Silva are meaningful prime/post-title elite losses."
      ],
      [
        "Flyweight strength",
        "Modern women’s flyweight gets solid but not max division credit."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.6,
      "window": "Valentina title win through draw retention",
      "components": {
        "peakStatus": 1.2,
        "eliteOpponentProof": 1.25,
        "separationDominance": 0.7,
        "divisionStrength": 0.75,
        "cleanApexAura": 0.7
      },
      "notes": "The Valentina upset creates major apex value, capped by the trilogy loss."
    },
    "primeDominanceSummary": {
      "score": 15.45,
      "components": {
        "primeRecord": 4.35,
        "primeRoundsWon": 3.6,
        "titleDefenseDominance": 1.25,
        "finishStoppageDominance": 2.55,
        "lossSafetyDurability": 2.1,
        "divisionStrength": 1.6
      },
      "notes": "Good but not dominant; the title peak is better than the control profile."
    },
    "finalTakeaway": "Grasso is a real women’s UFC champion case with one signature win carrying a lot of weight.",
    "packetStatus": {
      "stage": "complete first-pass packet; flyweight title case, win ledger, loss context, compare seasoning, fight ledger, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/alexa-grasso.js",
      "centralPacket": "assets/data/fighter-packets/alexa-grasso.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Grasso is the Valentina-breaker case: one huge title win, draw retention, and useful flyweight wins.",
      "peak": "At her best, Grasso had the boxing and opportunistic grappling to beat an all-time champion.",
      "resume": "The resume is strong at the top but not deep enough to clear long-reign champions.",
      "counter": "The counter is short reign and no clean title defense win.",
      "edge": "Grasso wins comparisons when signature title-win value matters.",
      "eliteCounter": true,
      "signatureWins": "Valentina Shevchenko, Maycee Barber twice, Viviane Araujo, Joanne Wood.",
      "weakness": "Short title reign and trilogy loss.",
      "titleSummary": "Former UFC flyweight champion with 1.25 adjusted title wins.",
      "primeSummary": "Prime/current flyweight title window from Maycee Barber I onward.",
      "bestArgument": "She beat Valentina at the height of Valentina’s GOAT-tier reign.",
      "titleStyle": "Flyweight Title Breaker",
      "primeStyle": "Sharp Boxing Upset Peak"
    },
    "photoUrl": "assets/fighters/alexa-grasso.webp",
    "thumbUrl": "assets/fighters/alexa-grasso-thumb.webp"
  },
  "Alexander Volkanovski": {
    "divisionLabel": "FW / LW",
    "resumeTag": "All-around featherweight case",
    "photoUrl": "assets/fighters/alexander-volkanovski.webp",
    "thumbUrl": "assets/fighters/alexander-volkanovski-thumb.webp",
    "oneLiner": "The complete featherweight champion case: title consistency, strong quality wins, and one of the deepest modern resumes in the sport.",
    "whyRankedHere": "Volkanovski ranks #7 because he checks every important box well: championship success, quality wins, consistency, and a long elite stretch at featherweight. He may not have the single highest peak score, but his overall balance is extremely strong.",
    "whyNotHigher": "The current scoring model hits him for the Topuria loss and keeps his prime-dominance score below the names with more overwhelming peaks. The up-division Islam losses are handled more lightly, but they still do not boost the resume the way a win would have.",
    "keyJudgmentCalls": [
      [
        "Jose Aldo win",
        "marks the beginning of the prime scoring window."
      ],
      [
        "Islam losses",
        "receive reduced penalties because they were elite up-division title fights."
      ],
      [
        "Topuria loss",
        "counts as a meaningful main-division prime finished loss."
      ],
      [
        "Quality wins",
        "are a major strength of the Volk case and grade near the top of this ranking."
      ],
      [
        "Balanced resume",
        "is the core reason he stays near the top seven even without a #1 category score."
      ]
    ],
    "finalTakeaway": "Volkanovski is the all-around featherweight standard: deep title work, strong quality wins, and a balanced resume with very few weak points.",
    "watchUrl": "https://youtube.com/shorts/5zVynz57V-c?is=UsPP0oG5BB8Xlg8r",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/vE-Vu1EA94A?is=53qFtddjjQOFrkBF",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Volk is the defining modern featherweight champion: elite title control, Max trilogy separation, Aldo win value, and a strong case across skill, resume, and era strength.",
      "peak": "At his best, Volk was adaptable, disciplined, fast, and difficult to solve. He could strike, wrestle, defend, adjust mid-fight, and win tactical battles against elite opponents.",
      "resume": "Volk’s resume is built on featherweight separation. He beat Aldo, took the belt from Holloway, won the trilogy, and defended against multiple top contenders.",
      "counter": "Volk’s best argument is direct separation. He did not just share an era with Max; he beat him three times and became the defining featherweight champion.",
      "edge": "Volk wins when head-to-head separation, championship control, and modern featherweight strength matter more than raw career volume.",
      "rivalry": "Against Holloway, Volk’s case is simple: Max has the volume, but Volk took the belt, won the trilogy, and owns the championship separation.",
      "eliteCounter": true,
      "signatureWins": "Aldo, Holloway three times, Ortega, Korean Zombie, and Yair give Volk one of the cleanest modern featherweight title resumes.",
      "titleSummary": "Volk’s title case is a clean modern featherweight reign built around Holloway trilogy separation and repeated contender defenses.",
      "primeSummary": "His prime was not as long as Holloway’s total run, but at his best he was the defining featherweight of the era.",
      "titleStyle": "Clean Division Separation",
      "primeStyle": "Elite Modern Prime",
      "primeNote": "clean modern featherweight prime built around Holloway trilogy separation",
      "weakness": "The Islam losses do not hurt as much because they were up-division elite fights, but the Topuria loss is real main-division drag and his prime-dominance score is not as high as the peak monsters.",
      "bestArgument": "Volk’s best argument is balance plus direct separation: title success, elite wins, Max trilogy control, and modern featherweight strength."
    },
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-03",
      "nextFix": "Title-fight wins audited to literal UFC championship title-fight wins."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/alexander-volkanovski.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/alexander-volkanovski.webp and assets/fighters/alexander-volkanovski-thumb.webp"
    }
  },
  "Alexandre Pantoja": {
    "photoUrl": "assets/fighters/alex-pantoja.webp",
    "thumbUrl": "assets/fighters/alex-pantoja-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/SWNsHqqKulw?is=dOqXog5XPpyNVzKO",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/7sj-snC5qWk?is=_DkasmmAc4OA-IDR",
    "signatureFightLabel": "Watch Signature Fight",
    "displayName": "Alexandre “The Cannibal” Pantoja",
    "profileDisplayName": "Alexandre “The Cannibal” Pantoja",
    "divisionLabel": "FLW",
    "oneLiner": "A relentless flyweight champion whose five title-fight wins, elite grappling, and eight-fight run built the best UFC flyweight resume outside Demetrious Johnson.",
    "whyRankedHere": "Pantoja combines a real championship reign with repeated wins over the modern flyweight elite. He beat Brandon Moreno for the belt, defeated Brandon Royval twice, and finished both Kai Asakura and Kai Kara-France during a four-defense reign.",
    "whyNotHigher": "His reign is much shorter than Demetrious Johnson’s, the flyweight opponent pool receives a division-depth discount, and several title challengers lacked proven UFC elite resumes. The Dustin Ortiz, Deiveson Figueiredo, Askar Askarov, and Joshua Van losses also keep the case from becoming completely clean.",
    "finalTakeaway": "Pantoja is the clear second-best UFC flyweight championship resume behind Demetrious Johnson: a rugged, high-pressure champion with real title volume and elite submission wins."
  },
  "Aljamain Sterling": {
    "watchUrl": "https://youtube.com/shorts/9u6oSybWX0o?is=vI7Sq1yLpVg-CsbN",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/I6WajDmm3yk?is=eGkspFsY7CtEjyHo",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Sterling is the modern bantamweight resume case: four title-fight wins, a Yan rematch win, Cejudo defense, Sandhagen submission, and featherweight extension with messy context attached.",
      "peak": "At his best, Sterling was back-control, chain wrestling, length, pace, and awkward striking layered into a style most bantamweights hated solving.",
      "resume": "The UFC resume includes Petr Yan, Henry Cejudo, T.J. Dillashaw, Cory Sandhagen, Pedro Munhoz, Calvin Kattar, Brian Ortega, Youssef Zalal, Jimmie Rivera, and Cody Stamann.",
      "counter": "The counterargument against Sterling is that the resume needs footnotes: DQ title win, injured Dillashaw, split Cejudo, and an abrupt O’Malley finish.",
      "edge": "Sterling wins comparisons when official title-fight wins, direct Yan series edge, modern bantamweight depth, and elite longevity matter more than clean aura.",
      "eliteCounter": true,
      "signatureWins": "Petr Yan, Henry Cejudo, Cory Sandhagen, T.J. Dillashaw, Pedro Munhoz, Calvin Kattar, Brian Ortega, Youssef Zalal, Jimmie Rivera, and Cody Stamann.",
      "weakness": "The title context is messy, and the O’Malley finish plus Evloev loss stop the case from feeling like a top-10 lock.",
      "titleSummary": "Sterling’s title case is four bantamweight title-fight wins, with the Yan DQ discounted and the Yan rematch/Cejudo defense doing the heavy lifting.",
      "primeSummary": "His prime is more control-and-position dominance than highlight violence, but it produced real elite wins in a loaded bantamweight era.",
      "titleStyle": "Awkward Bantamweight Reign",
      "primeStyle": "Backpack Control Prime"
    },
    "divisionLabel": "BW / FW",
    "resumeTag": "Modern bantamweight title resume case",
    "oneLiner": "The awkward-but-real bantamweight resume case: four UFC title-fight wins, wins over Yan, Cejudo, Sandhagen, and late featherweight relevance, with DQ/injury context keeping the debate spicy.",
    "whyRankedHere": "Sterling ranks here because the UFC-only case is bigger than the jokes around the DQ title win. He has four bantamweight title-fight wins, a real rematch win over Petr Yan, a title defense over Henry Cejudo, an elite Sandhagen submission, and useful featherweight extension wins over Calvin Kattar, Brian Ortega, and Youssef Zalal.",
    "whyNotHigher": "He does not rank higher because the championship resume needs context. The first Yan title win came by DQ, the Dillashaw defense had major shoulder-injury context, and the Sean O’Malley finish plus Movsar Evloev loss keep him below cleaner all-time champions.",
    "bigAssumptions": [
      [
        "Prime start",
        "Pedro Munhoz 2019 / Cory Sandhagen 2020 starts the clean elite window."
      ],
      [
        "Title credit",
        "The Yan DQ title win counts, but is discounted. The Yan rematch, Dillashaw defense, and Cejudo defense carry the title case."
      ],
      [
        "Dillashaw context",
        "The TJ win stays on the ledger, but shoulder-injury context keeps it from being treated like a clean prime champion win."
      ],
      [
        "Featherweight extension",
        "Kattar, Ortega, and Zalal help longevity, but the Evloev loss prevents a second-division title push from scoring yet."
      ],
      [
        "Non-UFC resume",
        "CFFC and regional achievements are not scored."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Yan rivalry",
        "Sterling owns the official UFC series and the rematch is the cleanest title anchor."
      ],
      [
        "Cejudo defense",
        "A split decision over a returning Cejudo still counts as a real title defense over a former two-division champion."
      ],
      [
        "O’Malley loss",
        "The title-losing finish is the biggest prime-damage item."
      ],
      [
        "Featherweight run",
        "Adds relevance and longevity without becoming a new championship tier yet."
      ],
      [
        "Style translation",
        "Control grappling and backpack dominance score well, even if the fan perception is polarizing."
      ]
    ],
    "finalTakeaway": "Sterling is not the cleanest-looking champion, but the UFC-only resume is legitimately strong. The title context is messy, yet the wins and longevity are too good to keep him out of the top-15 range.",
    "packetStatus": {
      "stage": "permanent hand-added fighter; packet live; photos needed",
      "lastUpdated": "2026-07-03",
      "nextFix": "Add Aljamain Sterling photos. Add Watch Moment only if Cody provides a URL."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/aljamain-sterling.js",
      "displayFallback": "assets/data/display-overrides.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "Add assets/fighters/aljamain-sterling.webp and assets/fighters/aljamain-sterling-thumb.webp when real files exist."
    },
    "photoUrl": "assets/fighters/aljamain-sterling.webp",
    "thumbUrl": "assets/fighters/aljamain-sterling-thumb.webp"
  },
  "Amanda Nunes": {
    "photoUrl": "assets/fighters/amanda-nunes.webp",
    "thumbUrl": "assets/fighters/amanda-nunes-thumb.webp",
    "watchUrl": "https://youtu.be/t4wkBuFpoPs?is=CL7ge7FDuHQPrbMq",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/qwPBPiUzgag?is=pTBaihmA06TEDxKo",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Nunes is the women’s GOAT standard: two-division champion, massive title-fight volume, legendary finishes, and wins over nearly every major name from her era.",
      "peak": "At her best, Nunes was power, athleticism, takedown defense, jiu-jitsu, confidence, and finishing danger. She could erase great fighters quickly or beat them over five rounds.",
      "resume": "Nunes has the strongest women’s UFC resume: bantamweight reign, featherweight title value, Shevchenko rivalry, Cyborg knockout, Rousey finish, and years of title control.",
      "counter": "The only real argument against Nunes is the Pena upset and the fact that women’s featherweight depth was thin. It matters, but it does not erase the whole case.",
      "edge": "Nunes wins women’s comparisons when total title weight, two-division value, and elite-name wins are the deciding factors.",
      "eliteCounter": true,
      "signatureWins": "Shevchenko twice, Cyborg, Rousey, Holm, Tate, de Randamie, Pena, Aldana, Spencer, and Megan Anderson give Nunes the deepest women’s UFC win list.",
      "titleSummary": "Nunes has the strongest women’s UFC title case: two belts, repeated defenses, a Cyborg knockout, and the Pena revenge win.",
      "primeSummary": "Her elite window was long, violent, and title-heavy, with enough two-division value to separate her from every other women’s case.",
      "titleStyle": "Women’s GOAT Two-Division Champion",
      "primeStyle": "Long Violent Title Prime",
      "weakness": "The Pena upset and featherweight depth context are the only real brakes on an otherwise clear women’s GOAT case.",
      "bestArgument": "Nunes' case starts with women's GOAT separation: two UFC belts, repeated defenses, the Cyborg win, the Rousey win, and two wins over Shevchenko."
    },
    "divisionLabel": "BW / FW",
    "resumeTag": "Women’s UFC GOAT standard",
    "oneLiner": "The women’s UFC GOAT case: two-division champion, huge title-fight volume, legendary finishes, and the deepest women’s win list in this ranking.",
    "whyRankedHere": "Nunes ranks as the women’s #1 because her UFC resume has the cleanest separation: bantamweight title control, featherweight title value, the Cyborg knockout, the Rousey finish, Shevchenko rivalry value, and years of elite wins.",
    "whyNotHigher": "On the full app board, she does not pass the top men because this ranking keeps the men’s and women’s boards separate and does not pretend division depth is identical. Within the women’s board, she is the clear benchmark.",
    "keyJudgmentCalls": [
      [
        "Two-division value",
        "bantamweight and featherweight gold drive the championship case."
      ],
      [
        "Cyborg knockout",
        "one of the biggest single wins in women’s MMA history and a major UFC legacy moment."
      ],
      [
        "Shevchenko rivalry",
        "direct edge over Valentina is central to the women’s GOAT separation."
      ],
      [
        "Pena upset",
        "a real blemish, but the rematch win restores a lot of the damage."
      ],
      [
        "Featherweight depth",
        "thin division context matters, but it does not erase the two-division value."
      ]
    ],
    "finalTakeaway": "Nunes is the women’s UFC GOAT standard: two belts, deep elite wins, violent title dominance, and direct separation over every major rival from her era.",
    "packetStatus": {
      "stage": "packet live; UFC-only record corrected; photos and Watch Moment needed",
      "lastUpdated": "2026-07-10",
      "nextFix": "Add Amanda photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/amanda-nunes.js",
      "compareFallback": "assets/compare-coverage-pack-2.js"
    }
  },
  "Anderson Silva": {
    "divisionLabel": "MW",
    "resumeTag": "Peak aura standard",
    "photoUrl": "assets/fighters/anderson-silva.webp",
    "thumbUrl": "assets/fighters/anderson-silva-thumb.webp",
    "oneLiner": "The peak-aura case: historic middleweight title control, terrifying finishing dominance, and one of the most iconic prime runs in UFC history.",
    "whyRankedHere": "Silva ranks #4 because his peak remains one of the most dominant and iconic runs in UFC history. He paired a historic middleweight title reign with rare finishing threat, long-term aura, and a level of separation that still defines elite prime dominance.",
    "whyNotHigher": "Silva does not pass the top three because the current scoring model gives Jones, St-Pierre, and Johnson stronger overall combinations of championship volume, opponent-quality wins, clean prime record, and loss context. The Weidman losses matter, and the middleweight division-strength adjustment keeps his quality-wins score below the very top tier.",
    "keyJudgmentCalls": [
      [
        "Peak aura",
        "central to the Silva case and heavily reflected in the prime-dominance score."
      ],
      [
        "Weidman losses",
        "count as in-prime losses and are real resume drag."
      ],
      [
        "Later losses",
        "treated mostly as post-prime context rather than the core Silva case."
      ],
      [
        "Middleweight context",
        "the division-strength adjustment keeps the quality-wins category below the top tier."
      ],
      [
        "Finishing threat",
        "a major reason his prime still feels more dominant than a normal title reign."
      ]
    ],
    "finalTakeaway": "Silva is the UFC peak-aura legend: a historic champion, terrifying finisher, and one of the most influential dominant runs ever, with enough loss and opponent-strength context to keep him just behind the top three.",
    "watchUrl": "https://youtube.com/shorts/KITOr2BPlyg?is=czgA_fjxyDuXlbpO",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/mWjv5lfe4eY?is=DwGlau_bq7PzxqVe",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Anderson is the peak-aura legend: the most iconic middleweight reign, terrifying finishing ability, and some of the most memorable dominance moments ever.",
      "peak": "At his best, Anderson felt untouchable. The counters, creativity, front kick, matrix defense, and sudden finishes gave his prime a mythology few fighters can match.",
      "resume": "Anderson’s resume is built on title reign plus aura. He ruled middleweight for years, finished challengers spectacularly, and became the symbol of peak dominance.",
      "counter": "Anderson’s argument is aura and peak fear factor. If someone values the most terrifying prime, he has one of the strongest cases ever.",
      "edge": "Anderson wins comparisons when peak impact, finishing danger, and iconic championship dominance outweigh cleaner but less explosive resumes.",
      "eliteCounter": true,
      "signatureWins": "Franklin, Henderson, Griffin, Belfort, Sonnen, Okami, and years of middleweight title wins give Anderson one of the sport’s most iconic reigns.",
      "weakness": "The Weidman losses matter because they land before this ranking fully moves Anderson into post-prime protection, and middleweight depth is slightly division-adjusted.",
      "titleSummary": "Anderson’s title case is a long middleweight reign built on repeated defenses, spectacular finishes, and one of the most iconic champion runs ever.",
      "primeSummary": "His prime aura lasted for years, but the Weidman losses create drag because they land before the model fully shifts him into post-prime protection.",
      "titleStyle": "Aura Reign Standard",
      "primeStyle": "Peak Fear Factor",
      "primeNote": "long middleweight title aura before the Weidman losses damaged the back end",
      "bestArgument": "Anderson’s best argument is peak aura: few fighters ever felt more dangerous, more creative, or more inevitable during a title reign."
    },
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Anderson. Migrate Khabib Nurmagomedov next."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/anderson-silva.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/anderson-silva.webp and assets/fighters/anderson-silva-thumb.webp"
    }
  },
  "Anthony Johnson": {
    "compareProfile": {
      "shortCase": "Johnson is the terrifying UFC knockout contender: a destructive light-heavyweight peak, two title shots, and a major What-If case.",
      "peak": "Explosive entries, frightening power, fast finishing instincts, and improved wrestling defense made him one of the division's scariest peaks.",
      "resume": "His strongest UFC work came at light heavyweight, where he destroyed contenders but lost both title fights to Daniel Cormier.",
      "counter": "The power looked championship-level, but he never converted it into a UFC belt.",
      "edge": "He wins finishing-danger and peak-intimidation debates.",
      "eliteCounter": true,
      "signatureWins": "Alexander Gustafsson, Glover Teixeira, Ryan Bader, Phil Davis, Jimi Manuwa, Antônio Rogério Nogueira, and Andrei Arlovski.",
      "titleSummary": "Two UFC title losses to Daniel Cormier.",
      "primeSummary": "An elite knockout peak with limited championship conversion.",
      "titleStyle": "twoTimePowerChallenger",
      "primeStyle": "eliteKnockoutTerror"
    },
    "oneLiner": "Terrifying knockout power with two title losses defining the ceiling.",
    "photoStatus": "pending-real-files"
  },
  "Anthony Pettis": {
    "displayName": "Anthony “Showtime” Pettis",
    "profileDisplayName": "Anthony “Showtime” Pettis",
    "divisionLabel": "LW / FW / WW",
    "resumeTag": "Showtime lightweight champion",
    "photoUrl": "assets/fighters/anthony-pettis.webp",
    "thumbUrl": "assets/fighters/anthony-pettis-thumb.webp",
    "photoUnavailable": false,
    "photoStatus": "verified",
    "signatureFight": "Benson Henderson II — UFC 164",
    "alternateFight": "Gilbert Melendez — UFC 181",
    "watchUrl": "https://youtube.com/shorts/BiPvl_p6JqY?is=gwu2EsszP22T9us-",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/smbYO1-yqtA?is=lhtpeK1nOCqGUvdc",
    "signatureFightLabel": "Watch Signature Fight",
    "oneLiner": "The Showtime champion case: two UFC title-fight wins, three top-five victories, and signature finishes across three divisions.",
    "whyRankedHere": "Pettis earns his place through an undisputed lightweight title win, a successful defense, three top-five victories, and one of the most memorable two-fight championship peaks of his era. The Henderson armbar and Melendez guillotine give the UFC-only resume real title proof beyond the highlight reel.",
    "whyNotHigher": "He does not rank higher because the title reign ended after one defense, the reviewed prime finished 7-6, and six counted prime losses—including three finishes—drag down the consistency and round-control case. The WEC title and Showtime Kick are excluded from the score.",
    "keyJudgmentCalls": [
      [
        "Nickname",
        "The app-facing profile name is Anthony “Showtime” Pettis."
      ],
      [
        "UFC-only scope",
        "The WEC title, Showtime Kick, PFL run, and all non-UFC fights are context only."
      ],
      [
        "Prime start",
        "The Joe Lauzon head-kick knockout begins the connected ranked and title-level run."
      ],
      [
        "Prime end",
        "Tony Ferguson closes the connected prime after Pettis’s final Chiesa rebound; the later Thompson knockout is an isolated post-prime elite win."
      ],
      [
        "Max Holloway",
        "The loss counts as a prime elite finish, but Pettis receives no title participation credit because he missed weight and was ineligible for the interim belt."
      ],
      [
        "Stephen Thompson",
        "The post-prime upward-division knockout still receives full Opponent Quality win credit."
      ],
      [
        "Division depth",
        "The lightweight murderers’ row earns a separate positive era-depth adjustment without double-counting the same strength in longevity."
      ],
      [
        "Signature fight",
        "Benson Henderson II at UFC 164."
      ],
      [
        "Alternate fight",
        "Gilbert Melendez at UFC 181."
      ]
    ],
    "finalTakeaway": "Pettis is a real UFC champion case with a spectacular peak, not merely a highlight-reel celebrity. Two title-fight wins and elite finishes secure his ranking; the 7-6 prime and loss-heavy post-title stretch keep Showtime below the deeper long-reign champions.",
    "compareProfile": {
      "shortCase": "Pettis is the iconic lightweight champion peak case: he submitted Benson Henderson for the UFC title, became the first fighter to finish Gilbert Melendez, and added elite wins across three divisions.",
      "peak": "At his best, Showtime blended explosive kicks, opportunistic submissions, and genuine championship composure. Henderson II and the Melendez defense prove the peak was more than highlight-reel style.",
      "resume": "The UFC-only ledger is led by Benson Henderson, Gilbert Melendez, Donald Cerrone, Stephen Thompson, Charles Oliveira, Michael Chiesa, Joe Lauzon, and Jim Miller. His WEC title and Showtime Kick are context only.",
      "prime": "The reviewed prime runs from Joe Lauzon through Tony Ferguson at 7-6, with an 11-21 audited round mark, six finish wins, and three counted prime finish losses.",
      "counter": "The best counterargument against Pettis is consistency: the title reign produced only one defense, the prime finished 7-6, and losses to dos Anjos, Alvarez, Barboza, Holloway, Poirier, and Ferguson prevent a cleaner all-time case.",
      "edge": "Pettis wins appropriate comparisons through championship proof, an elite two-performance apex, finishing versatility, and meaningful wins at lightweight, featherweight, and welterweight. His peak can beat deeper but title-less resumes.",
      "signatureWins": "Benson Henderson, Gilbert Melendez, Donald Cerrone, Stephen Thompson, Charles Oliveira, Michael Chiesa, Joe Lauzon, and Jim Miller define the UFC-only case.",
      "weakness": "One successful title defense, six prime losses, poor prime round control, and an inconsistent post-title run cap the ranking ceiling.",
      "titleSummary": "Won the undisputed UFC lightweight title at UFC 164 and defended it by submitting Gilbert Melendez at UFC 181.",
      "primeSummary": "A 7-6 prime from Joe Lauzon through Tony Ferguson with six finishes and a 34.38% reviewed rounds-won rate.",
      "titleStyle": "showtimeLightweightChampion",
      "primeStyle": "explosiveSubmissionStriker"
    }
  },
  "B.J. Penn": {
    "photoUrl": "assets/fighters/bj-penn.webp",
    "thumbUrl": "assets/fighters/bj-penn-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/FfBpWXo-EWo?is=4SrvWa7ntRkx5Bia",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/MQGf9p4YsOk?t=1122&is=6pFin0iSE-knCsaR",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "BJ Penn is the skill-and-two-division legacy case: lightweight champion, welterweight title upset over Hughes, elite talent, and a messy late record that drags the score down.",
      "peak": "At his best, Penn was boxing, takedown defense, jiu-jitsu, balance, and natural fighting instinct. His peak skill level was much cleaner than his final record suggests.",
      "resume": "Penn’s UFC case has huge highs and ugly lows. The Hughes win and lightweight title run are real all-time material, but the late-career losses are impossible to ignore.",
      "counter": "Penn’s argument is peak skill and two-division greatness. The argument against him is the record collapse and too many damaging losses after the best years.",
      "edge": "Penn wins comparisons when peak skill, lightweight title value, and the Hughes upset outweigh a messy career arc.",
      "eliteCounter": true,
      "signatureWins": "Hughes twice, Sherk, Florian, Sanchez, Stevenson, Pulver, and Uno give Penn a real UFC-only win list, even without using non-UFC achievements as scoring value.",
      "titleSummary": "Penn won UFC titles at lightweight and welterweight, with the Hughes upset and lightweight defenses carrying most of the championship value.",
      "primeSummary": "His best UFC years were brilliant but not long enough to erase the late-career collapse.",
      "titleStyle": "Two-Division Skill Champion",
      "primeStyle": "Brilliant But Messy Prime",
      "weakness": "The late-career collapse is the obvious drag and keeps the ranking from matching the peak-skill reputation.",
      "bestArgument": "Penn's case starts with peak skill and two-division title value: lightweight gold, the Hughes welterweight upset, and a prime that was much cleaner than his final record suggests."
    },
    "divisionLabel": "LW / WW",
    "resumeTag": "Two-division skill legend",
    "oneLiner": "The brilliant-but-messy skill case: lightweight gold, the Hughes welterweight upset, elite talent, and a late record collapse that drags the resume down.",
    "whyRankedHere": "Penn ranks here because the high-end UFC case is still real: lightweight champion, welterweight champion, the Hughes upset, and a peak skill set that was ahead of its time.",
    "whyNotHigher": "He does not rank higher because the late-career record collapse is too damaging, and the active elite window is not deep enough to offset the loss drag against cleaner champions.",
    "keyJudgmentCalls": [
      [
        "Two-division value",
        "lightweight and welterweight gold are central to the case."
      ],
      [
        "Hughes upset",
        "one of the biggest high-end wins in the profile."
      ],
      [
        "Late losses",
        "do not erase the peak, but they drag the UFC-only resume hard."
      ],
      [
        "Non-UFC context",
        "historical context only; the ranking is UFC-only."
      ],
      [
        "Skill vs resume",
        "his skill reputation is higher than the clean resume score."
      ]
    ],
    "finalTakeaway": "Penn is a real two-division skill legend, but the UFC-only score has to balance the brilliant peak against one of the messiest late-career records in the ranking.",
    "packetStatus": {
      "stage": "packet live; Watch Moment added",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for BJ Watch Moment."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/bj-penn.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-1.js",
      "watchFallback": "assets/data/fighter-packets/bj-penn.js",
      "photos": "assets/fighters/bj-penn.webp and assets/fighters/bj-penn-thumb.webp"
    }
  },
  "Ben Askren": {
    "compareProfile": {
      "shortCase": "Askren is the UFC what-if wrestler: a late three-fight run, one disputed win, and the Masvidal knockout defining the resume.",
      "peak": "Pressure wrestling, chain takedowns, scrambling, toughness, and positional persistence were the strengths; striking was the clear weakness.",
      "resume": "UFC-only, he went 1-2 against Robbie Lawler, Jorge Masvidal, and Demian Maia. Outside achievements are context only.",
      "counter": "He arrived late and physically diminished after proving elite wrestling elsewhere.",
      "edge": "His value is strongest in What-If, specialist, personality, and cult debates.",
      "eliteCounter": false,
      "signatureWins": "Robbie Lawler is the only official UFC win, with stoppage controversy attached.",
      "titleSummary": "No UFC title-fight wins.",
      "primeSummary": "A late, extremely short UFC window that showed the wrestling identity without an elite UFC resume.",
      "titleStyle": "noUfcTitleCase",
      "primeStyle": "lateWrestlingWhatIf"
    },
    "oneLiner": "Elite wrestling reputation, disastrous UFC sample, perfect category trap.",
    "photoStatus": "pending-real-files"
  },
  "Benson Henderson": {
    "thumbUrl": "assets/fighters/benson-henderson-thumb.webp",
    "photoUrl": "assets/fighters/benson-henderson.webp",
    "photoNote": "",
    "signatureFightUrl": "https://www.youtube.com/watch?v=P65mAfnAFhk",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/ZAhtyftLDFM?is=CW0y_Eq4kDAXaN8b",
    "watchLabel": "Watch Moment",
    "oneLiner": "A decision-heavy lightweight champion whose four UFC title-fight wins and seven Top-5 victories give him one of the division’s deepest UFC-only ledgers.",
    "whyRankedHere": "Henderson ranks here because his lightweight run combined real championship volume with elite opponent depth. He beat Frankie Edgar twice, defended against Nate Diaz and Gilbert Melendez, and added strong contender wins over Jim Miller and Clay Guida while winning roughly two-thirds of his tracked rounds.",
    "whyNotHigher": "He does not rank higher because the title reign was strong rather than historically dominant, his 18% UFC finish rate limits the separation case, and prime stoppage losses to Anthony Pettis and Rafael dos Anjos damaged the resume. Several signature decisions were close enough that his dominance case trails the cleaner lightweight peaks above him.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/benson-henderson.js",
      "displayFallback": "assets/data/fighter-packets/benson-henderson.js"
    }
  },
  "Bethe Correia": {
    "compareProfile": {
      "shortCase": "Correia is the personality-driven title-shot underdog: an unbeaten UFC start created the Rousey rivalry, but later results exposed the ceiling.",
      "peak": "Pressure boxing, toughness, confidence, and steady output drove the short rise.",
      "resume": "The UFC resume has a few wins and a memorable title build but no elite win depth.",
      "counter": "The title shot came before a deep elite resume, and the later record confirmed the ceiling.",
      "edge": "She adds personality, chaos, recognition, and genuine lower-tier lineup variety.",
      "eliteCounter": false,
      "signatureWins": "Jessamyn Duke, Shayna Baszler, Julie Kedzie, and Sijara Eubanks.",
      "titleSummary": "One UFC bantamweight title loss.",
      "primeSummary": "A short unbeaten rise followed by a decisive title-level ceiling.",
      "titleStyle": "personalityTitleChallenger",
      "primeStyle": "shortUnderdogRise"
    },
    "oneLiner": "Personality, recognition, and a title shot without elite resume depth.",
    "photoStatus": "pending-real-files"
  },
  "Brandon Moreno": {
    "displayName": "Brandon “The Assassin Baby” Moreno",
    "profileDisplayName": "Brandon “The Assassin Baby” Moreno",
    "divisionLabel": "FLW",
    "resumeTag": "Two-reign flyweight champion",
    "photoUrl": "assets/fighters/brandon-moreno.webp",
    "thumbUrl": "assets/fighters/brandon-moreno-thumb.webp",
    "photoUnavailable": false,
    "photoStatus": "verified",
    "watchUrl": "https://youtube.com/shorts/eKlp7eFDSTM?is=_dMar84p0EkqYXz_",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/GPrzwbgg8yU?is=M-G22YQ8u-8QVKtz",
    "signatureFightLabel": "Watch Signature Fight",
    "oneLiner": "The resilient two-reign flyweight champion: three UFC title-fight wins, a 2-1-1 Figueiredo rivalry edge, and nearly six active elite years.",
    "whyRankedHere": "Moreno earns his place through three UFC title-fight wins, five top-five victories, two undisputed title reigns, an interim-title finish, and a deep modern flyweight prime. His UFC 263 submission and UFC 283 title reclaim give the resume championship proof and historical identity.",
    "whyNotHigher": "He does not rank higher because he never completed a successful undisputed defense, lost both official UFC fights to Alexandre Pantoja, and accumulated four counted prime losses. Modern flyweight also receives a modest division-depth discount compared with the strongest all-time divisions.",
    "keyJudgmentCalls": [
      [
        "Nickname",
        "The app-facing profile name is Brandon “The Assassin Baby” Moreno."
      ],
      [
        "UFC-only scope",
        "The Ultimate Fighter exhibition loss to Alexandre Pantoja and all regional fights are excluded."
      ],
      [
        "Prime start",
        "Jussier Formiga begins the connected elite run."
      ],
      [
        "Prime end",
        "Tatsuro Taira is the unrecovered prime finish loss; Lone’er Kavanagh is post-prime decline confirmation."
      ],
      [
        "Figueiredo rivalry",
        "The official UFC series is 2-1-1 for Moreno and anchors his championship case."
      ],
      [
        "Pantoja rivalry",
        "Pantoja leads the official UFC series 2-0; the TUF exhibition is not part of the UFC record."
      ],
      [
        "Division depth",
        "Modern flyweight receives a modest discount rather than the heavier launch-era flyweight penalty."
      ]
    ],
    "finalTakeaway": "Moreno is the resilience champion of the flyweight GOAT conversation: two undisputed reigns, three title-fight wins, rivalry history, and real longevity. The absence of a completed undisputed defense and the Pantoja losses keep him below the division’s deepest UFC-only resumes.",
    "compareProfile": {
      "shortCase": "Moreno is the two-reign flyweight resilience case: three UFC title-fight wins, a 2-1-1 Figueiredo rivalry edge, elite comeback wins, and nearly six active prime years.",
      "peak": "At his best, Moreno combined pace, durability, scrambling, sharp combinations, and opportunistic submissions. The Figueiredo II performance is one of the cleanest championship breakthroughs in flyweight history.",
      "resume": "The UFC-only ledger includes Figueiredo twice, Kai Kara-France twice, Jussier Formiga, Brandon Royval, Amir Albazi, Dustin Ortiz, Louis Smolka, and Steve Erceg. TUF and regional results add no score.",
      "prime": "The reviewed prime runs from Jussier Formiga through Tatsuro Taira at 7-4-1, with a 28-17 audited round edge, four prime finishes, and one counted finish loss.",
      "counter": "The best counterargument against Moreno is title control: he never completed a successful undisputed defense, lost both official UFC fights to Pantoja, and carries four counted prime losses.",
      "edge": "Moreno wins appropriate comparisons through championship resilience, rivalry proof, and a deeper elite window than most two-reign champions. He repeatedly recovered from losses and returned to title level.",
      "signatureWins": "Deiveson Figueiredo twice, Kai Kara-France twice, Jussier Formiga, Brandon Royval, Amir Albazi, Dustin Ortiz, Louis Smolka, and Steve Erceg define the UFC-only case.",
      "weakness": "No successful undisputed defense, a 0-2 official UFC record against Pantoja, four prime losses, and a flyweight-era discount cap the all-time ceiling.",
      "titleSummary": "Won the undisputed flyweight title at UFC 263, won interim gold at UFC 277, and reclaimed the undisputed belt at UFC 283.",
      "primeSummary": "A 7-4-1 prime from Jussier Formiga through Tatsuro Taira with a 28-17 reviewed round edge and four finish wins.",
      "titleStyle": "twoReignFlyweightChampion",
      "primeStyle": "resilientScrambleChampion"
    }
  },
  "Brock Lesnar": {
    "displayName": "Brock “The Beast Incarnate” Lesnar",
    "profileDisplayName": "Brock “The Beast Incarnate” Lesnar",
    "resumeTag": "Short-window heavyweight champ",
    "watchUrl": "https://youtube.com/shorts/F3Z32PDzObA?is=uzqAk5wbnG7dx9TS",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/WD2-K7dsqYM?is=3Jn9ethtTZSoaFk5",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "HW",
    "oneLiner": "A massive short-window UFC heavyweight champion whose title run was real, explosive, and historically important, but capped by tiny sample size and a brief elite window.",
    "whyRankedHere": "Lesnar lands here because his UFC heavyweight title run was real: he beat Couture, smashed Mir in the rematch, and survived Carwin to defend the belt.",
    "whyNotHigher": "He does not rank higher because the elite UFC sample is tiny, the title reign was short, Cain ended the run quickly, and the later Overeem/Hunt chapter does not add resume depth.",
    "bigAssumptions": [
      [
        "Title run",
        "The Couture, Mir, and Carwin fights carry real heavyweight championship value, even with the short path and short reign."
      ],
      [
        "Cain fight",
        "Cain counts as the title-ending loss that exposes the limit of Brock’s short-window case."
      ],
      [
        "Overeem fight",
        "The Overeem loss is treated more like a health-exit/decline-stage fight than another clean title-run defeat."
      ],
      [
        "Mark Hunt no contest",
        "The Hunt fight adds no win credit."
      ],
      [
        "Heavyweight context",
        "The division was volatile, but heavyweight title wins still matter because the margin for error is brutal."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Short peak, real peak",
        "Brock was not around long, but he absolutely reached a real UFC champion level."
      ],
      [
        "Title value",
        "Three UFC title-fight wins keep him from being treated like a novelty case."
      ],
      [
        "Sample-size cap",
        "The resume cannot climb much higher with only a handful of UFC results."
      ],
      [
        "Skill profile",
        "His wrestling, size, and athleticism were overwhelming, but the Cain/Overeem fights showed the danger when he was forced backward."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.6,
      "window": "Couture title win through Carwin defense",
      "components": {
        "peakStatus": 1.15,
        "eliteOpponentProof": 0.85,
        "separationDominance": 0.9,
        "divisionStrength": 0.95,
        "cleanApexAura": 0.75
      },
      "notes": "Winning the UFC heavyweight title that fast is a massive short-window peak, but the elite proof is capped by the thin resume."
    },
    "primeDominanceSummary": {
      "score": 14.35,
      "components": {
        "primeRecord": 3.1,
        "primeRoundsWon": 2.75,
        "titleDefenseDominance": 2.3,
        "finishStoppageDominance": 2.6,
        "lossSafetyDurability": 1.7,
        "divisionStrength": 1.9
      },
      "notes": "Short, violent title run with real defenses, but not clean sustained dominance."
    },
    "finalTakeaway": "Brock is a real UFC heavyweight champion case, not just a star-power case — but the resume is too short to push higher.",
    "packetStatus": {
      "stage": "complete first-pass packet; short-window title case, quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/brock-lesnar.js",
      "centralPacket": "assets/data/fighter-packets/brock-lesnar.js",
      "watchMoment": "assets/js/watch-moments.js",
      "nickname": "assets/js/card-nicknames.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Brock is the short-window heavyweight champion case: tiny sample, huge impact, real title wins, and one of the strangest fast rises in UFC history.",
      "peak": "At his apex, Brock was an overwhelming size-and-wrestling problem who could turn heavyweight fights into a physical mismatch.",
      "resume": "The resume is real but short. Couture, Mir, and Carwin matter; the lack of volume is the cap.",
      "counter": "The counter is obvious: tiny sample, Cain, Overeem, no long reign, and no broad contender run.",
      "edge": "Brock wins comparisons when heavyweight title results and short-window peak impact matter more than career depth.",
      "eliteCounter": false,
      "signatureWins": "Randy Couture, Frank Mir, Shane Carwin, Heath Herring.",
      "weakness": "Small UFC sample and major vulnerability when pressured backward.",
      "titleSummary": "Former UFC heavyweight champion with three UFC title-fight wins.",
      "primeSummary": "Prime runs from Couture through the Cain title loss.",
      "bestArgument": "Few fighters ever reached real UFC heavyweight champion status faster.",
      "titleStyle": "Short-Window Heavyweight Champ",
      "primeStyle": "Physical Mismatch Title Run"
    },
    "photoUrl": "assets/fighters/brock-lesnar.webp",
    "thumbUrl": "assets/fighters/brock-lesnar-thumb.webp"
  },
  "Cain Velasquez": {
    "photoUrl": "assets/fighters/cain-velasquez.webp",
    "thumbUrl": "assets/fighters/cain-velasquez-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/qF8yfMWdjgg?is=7q2cASkqgIQC9JVY",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/avpNktfdq_4?is=m3ah1k_z7OvWJKWl",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "HW",
    "resumeTag": "Heavyweight peak-dominance case",
    "oneLiner": "The heavyweight pressure machine: elite pace, wrestling, cardio, and one of the best primes in UFC heavyweight history.",
    "whyRankedHere": "Cain ranks here because his prime dominance at heavyweight was exceptional. His pace, wrestling pressure, and cardio made him one of the most overwhelming heavyweights ever during his best window.",
    "whyNotHigher": "He does not rank higher because the UFC resume is thin compared with the deeper champions. Injuries, limited title volume, and key losses to dos Santos and Werdum keep his all-time case below Stipe and the broader top tier.",
    "keyJudgmentCalls": [
      [
        "Prime dominance",
        "the main reason Cain stays this high despite a shorter resume."
      ],
      [
        "Heavyweight context",
        "volatility matters, but his peak was genuinely elite."
      ],
      [
        "JDS rivalry",
        "Cain won the trilogy and that carries major heavyweight value."
      ],
      [
        "Injuries",
        "limit longevity and title-volume credit."
      ],
      [
        "Werdum loss",
        "is real prime/back-end drag and keeps the ending from feeling clean."
      ]
    ],
    "finalTakeaway": "Cain is the heavyweight peak-pressure case: outstanding at his best, but held back by injuries, shorter title volume, and a thinner total UFC resume than Stipe.",
    "packetStatus": {
      "stage": "packet live; Watch Moment added",
      "lastUpdated": "2026-07-02",
      "nextFix": "Add direct fight ledger if/when we want Cain rivalry context."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/cain-velasquez.js",
      "displayFallback": "assets/data/display-overrides.js",
      "watchFallback": "assets/data/fighter-packets/cain-velasquez.js",
      "photos": "assets/fighters/cain-velasquez.webp and assets/fighters/cain-velasquez-thumb.webp"
    },
    "compareProfile": {
      "shortCase": "Cain is the heavyweight peak-dominance case: pace, wrestling, cardio, pressure, and a prime that looked better than his total resume size.",
      "peak": "At his best, Cain fought with rare heavyweight pace. The wrestling pressure, clinch work, cardio, and repeat attacks made him a uniquely difficult heavyweight champion.",
      "resume": "Cain’s UFC resume is high-end but compact. The JDS trilogy carries major value, but injuries and limited title volume keep the case from matching Stipe’s heavyweight resume.",
      "counter": "Cain’s argument is peak. If the debate is who looked like the most overwhelming heavyweight at his best, Cain has one of the strongest lanes.",
      "edge": "Cain wins comparisons when peak pressure, heavyweight dominance, and the JDS trilogy matter more than title-volume depth.",
      "eliteCounter": true,
      "signatureWins": "Junior dos Santos twice, Brock Lesnar, Bigfoot Silva twice, Nogueira, and Rothwell give Cain a compact but serious heavyweight resume.",
      "weakness": "The resume is short, injuries capped the title run, and Stipe has the stronger full UFC heavyweight case.",
      "titleSummary": "Cain’s title case is a strong but compact heavyweight reign built around the JDS rivalry and elite pressure dominance.",
      "primeSummary": "His prime was outstanding and high-paced, but injuries kept it from becoming a long all-time reign.",
      "titleStyle": "Heavyweight Peak Champion",
      "primeStyle": "Pressure Machine Prime"
    }
  },
  "Carla Esparza": {
    "watchUrl": "https://youtube.com/shorts/haoZSXlndok?si=gPH4hX-eBK8U8G_I",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/jJeZ2wZv0YQ?is=QOK9v0B_kfqvZgqd",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "SW",
    "resumeTag": "Two-time strawweight spoiler",
    "oneLiner": "A two-time UFC strawweight champion whose resume is stronger than the eye test, built around beating Rose twice and a strong second title climb.",
    "whyRankedHere": "Esparza scores as a real UFC champion because two UFC title wins matter and the second-title climb had real ranked names.",
    "whyNotHigher": "She does not rank higher because she never defended either belt, had two damaging title losses, and rarely separated from elite opponents in a dominant way.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "Rose I = 1.00; Rose II = 0.85 due ugly title-win context."
      ],
      [
        "Quality Wins",
        "Rose II is full quality credit, but not above-cap."
      ],
      [
        "Prime split",
        "Treats her case as a split-prime/inaugural-and-second-reign resume."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Eye test vs resume",
        "The app should score the title results even if the style is ugly."
      ],
      [
        "No defenses",
        "This is the ceiling cap."
      ],
      [
        "Zhang/Joanna losses",
        "Both are real finish-loss title damage."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.5,
      "window": "Rose I and Rose II title wins",
      "components": {
        "peakStatus": 0.95,
        "eliteOpponentProof": 0.85,
        "separationDominance": 0.35,
        "divisionStrength": 0.75,
        "cleanApexAura": 0.6
      },
      "notes": "Two title wins create real apex value, but dominance/separation stays low."
    },
    "primeDominanceSummary": {
      "score": 14.2,
      "components": {
        "primeRecord": 4.2,
        "primeRoundsWon": 3.2,
        "titleDefenseDominance": 0,
        "finishStoppageDominance": 1.75,
        "lossSafetyDurability": 3.25,
        "divisionStrength": 1.8
      },
      "notes": "Good results, low separation."
    },
    "finalTakeaway": "Esparza is not fun to rank, but she is a required UFC-only women’s champion add.",
    "packetStatus": {
      "stage": "complete first-pass packet; two-time strawweight title case, win ledger, loss context, compare seasoning, fight ledger, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/carla-esparza.js",
      "centralPacket": "assets/data/fighter-packets/carla-esparza.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Esparza is the awkward two-time champion case: beat Rose twice, won the inaugural belt, regained it years later.",
      "peak": "Her best form was wrestling control and spoiler game planning, not highlight dominance.",
      "resume": "The resume matters more than the aesthetics. Two UFC title wins are real.",
      "counter": "The counter is dominance: no defenses and ugly title losses.",
      "edge": "Esparza wins comparisons when official title results and head-to-head Rose value matter.",
      "eliteCounter": false,
      "signatureWins": "Rose Namajunas twice, Yan Xiaonan, Marina Rodriguez, Alexa Grasso, Virna Jandiroba.",
      "weakness": "No defenses and low separation.",
      "titleSummary": "Two-time UFC strawweight champion with 1.85 adjusted title wins.",
      "primeSummary": "Split-prime case across inaugural and second title runs.",
      "bestArgument": "She beat Rose twice and won UFC gold twice.",
      "titleStyle": "Strawweight Spoiler Champion",
      "primeStyle": "Wrestling-Control Title Climb"
    },
    "photoUrl": "assets/fighters/carla-esparza.webp",
    "thumbUrl": "assets/fighters/carla-esparza-thumb.webp"
  },
  "Chael Sonnen": {
    "displayName": "Chael “The American Gangster” Sonnen",
    "profileDisplayName": "Chael “The American Gangster” Sonnen",
    "resumeTag": "Middleweight title agitator",
    "watchUrl": "https://youtube.com/shorts/feVMRUL1R9o?is=fQrfnJ4c8IMVu0k4",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/DpLaqnwFQEY?is=VUYzF8zQsZszQ4aj",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "MW / LHW",
    "oneLiner": "A relentless UFC title challenger whose wrestling pressure and Anderson Silva rivalry made him unforgettable, but zero title wins cap the resume hard.",
    "whyRankedHere": "Sonnen lands here because his middleweight contender run was real: Okami, Marquardt, Stann, and Bisping gave him one of the strongest no-belt cases in this tier.",
    "whyNotHigher": "He does not rank higher because he never won a UFC title, lost all three UFC title fights, and the biggest moments of his UFC career still ended as losses.",
    "bigAssumptions": [
      [
        "Championship ceiling",
        "The Anderson fights are legendary, but they are still title losses, so Chael gets no Championship Resume credit."
      ],
      [
        "Anderson rivalry",
        "The first Anderson fight boosts his peak and round-control case without being treated like a win."
      ],
      [
        "Loss context",
        "The two Anderson title losses are combined as one major title-rivalry penalty instead of two separate full penalties."
      ],
      [
        "Jon Jones fight",
        "The Jones loss is treated as an upward-division title challenge against an all-time champion."
      ],
      [
        "Rashad fight",
        "The Rashad loss is treated as a late/post-prime UFC exit fight."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Almost champion",
        "Chael gets real respect for how close he came, but almost-title moments cannot replace title wins."
      ],
      [
        "Round control",
        "The Anderson I performance keeps his Prime Dominance respectable because he controlled most of an all-time champion fight."
      ],
      [
        "Quality wins",
        "Bisping, Marquardt, Okami, and Stann are the real resume anchors."
      ],
      [
        "Losses",
        "The loss column is not ignored. Finished title losses are why he stays capped."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.95,
      "window": "Anderson Silva I near-upset and middleweight contender run",
      "components": {
        "peakStatus": 0.95,
        "eliteOpponentProof": 0.9,
        "separationDominance": 0.9,
        "divisionStrength": 0.75,
        "cleanApexAura": 0.45
      },
      "notes": "Near-champion apex: unforgettable pressure and rivalry value, but not a champion peak."
    },
    "primeDominanceSummary": {
      "score": 17.25,
      "components": {
        "primeRecord": 4.55,
        "primeRoundsWon": 5.15,
        "titleDefenseDominance": 0,
        "finishStoppageDominance": 1.85,
        "lossSafetyDurability": 4,
        "divisionStrength": 1.7
      },
      "notes": "High round-control contender run, especially in the first Anderson fight, but no belt and no title defense dominance."
    },
    "finalTakeaway": "Chael is one of the strongest UFC no-belt personality/resume cases: memorable, dangerous, and elite — but clearly below true champion resumes.",
    "packetStatus": {
      "stage": "complete first-pass packet; revised loss context, quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/chael-sonnen.js",
      "centralPacket": "assets/data/fighter-packets/chael-sonnen.js",
      "watchMoment": "assets/js/watch-moments.js",
      "nickname": "assets/js/card-nicknames.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Chael is the elite no-belt agitator case: pressure wrestling, massive Anderson rivalry, and real wins over Bisping, Marquardt, Okami, and Stann.",
      "peak": "At his apex, Chael nearly solved Anderson with pace, wrestling, and pressure before losing late.",
      "resume": "The contender resume is strong, but it is capped hard by zero UFC title wins.",
      "counter": "The counter is simple: the biggest fights ended as losses.",
      "edge": "Chael wins comparisons when contender strength, rivalry impact, and round-control pressure matter more than title hardware.",
      "eliteCounter": false,
      "signatureWins": "Michael Bisping, Nate Marquardt, Yushin Okami, Brian Stann, Mauricio Rua.",
      "weakness": "Zero UFC title wins and finished losses in major title spots.",
      "titleSummary": "Three-time UFC title challenger with no title-fight wins.",
      "primeSummary": "Prime runs from Dan Miller through Anderson Silva II.",
      "bestArgument": "He is one of the most memorable and dangerous no-belt contenders in UFC history.",
      "titleStyle": "Middleweight Title Agitator",
      "primeStyle": "Pressure-Wrestling Near-Champion"
    },
    "photoUrl": "assets/fighters/chael-sonnen.webp",
    "thumbUrl": "assets/fighters/chael-sonnen-thumb.webp"
  },
  "Charles Oliveira": {
    "watchUrl": "https://youtube.com/shorts/zHUAvACSUk4?is=VYzwsuIvxV85k8zH",
    "photoUrl": "assets/fighters/charles-oliveira.webp",
    "thumbUrl": "assets/fighters/charles-oliveira-thumb.webp",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/Z-B99m_jqJs?is=eHglISzDShhwojtn",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "eliteCounter": true,
      "signatureWins": "Chandler, Poirier, Gaethje, Dariush, Ferguson, and Lee give Oliveira a dangerous lightweight finishing resume.",
      "primeNote": "late-blooming lightweight title peak with elite finishing value",
      "shortCase": "Oliveira is the late-blooming lightweight danger case: elite finishing, huge quality wins, and one of the most exciting title peaks in the division’s history.",
      "peak": "At his best, Charles was constant danger: submissions, knees, front kicks, pressure, counters, and the ability to survive chaos long enough to finish elite lightweights.",
      "resume": "Oliveira’s resume is high-value and messy. The lightweight peak is elite, but the full UFC record carries too much damage to rank like a clean champion case.",
      "counter": "Oliveira’s argument is quality and danger. He beat elite lightweights in violent fashion and was never a normal champion to prepare for.",
      "edge": "Oliveira wins comparisons when lightweight quality wins, finishing value, and prime chaos outweigh record cleanliness.",
      "weakness": "The loss column is the drag. The prime was great, but the full UFC-only record is too messy for the deeper GOAT tier.",
      "titleSummary": "Oliveira’s title case is short but valuable: belt win, defense-level value, and elite lightweight finishes.",
      "primeSummary": "His late lightweight peak was elite and violent, but not long enough to erase the earlier and later losses.",
      "titleStyle": "Late-Blooming Lightweight Champion",
      "primeStyle": "Chaos Finish Prime"
    },
    "divisionLabel": "LW",
    "resumeTag": "Late-blooming finish king",
    "oneLiner": "The late-blooming lightweight chaos case: elite finishing value, huge quality wins, and a messy record that keeps the score volatile.",
    "whyRankedHere": "Oliveira ranks here because his high-end lightweight run is impossible to ignore. Chandler, Poirier, Gaethje, Dariush, Ferguson, and Lee give him one of the most dangerous quality-win ledgers in the ranking.",
    "whyNotHigher": "He does not rank higher because the loss penalty is heavy and the title reign was short. The highs are elite, but the full UFC resume is messier than the cleaner champion cases.",
    "keyJudgmentCalls": [
      [
        "Quality wins",
        "the biggest strength of the Charles case."
      ],
      [
        "Finish threat",
        "central to his prime and why the resume feels so dangerous."
      ],
      [
        "Late-blooming prime",
        "the scoring window protects the best lightweight run but cannot erase earlier damage."
      ],
      [
        "Islam and Topuria losses",
        "real elite title losses that cap the lightweight supremacy case."
      ],
      [
        "Title volume",
        "short reign keeps him below longer champions even with strong wins."
      ]
    ],
    "finalTakeaway": "Charles is the lightweight chaos-finishing legend: dangerous, accomplished, and loaded with quality wins, but too messy to rank with the clean long-reign champions.",
    "packetStatus": {
      "stage": "packet live; current UFC record reconciled; photos and Watch Moment needed",
      "lastUpdated": "2026-07-10",
      "nextFix": "Add Charles photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/charles-oliveira.js",
      "compareFallback": "assets/compare-data.js"
    }
  },
  "Chris Weidman": {
    "divisionLabel": "MW / LHW",
    "resumeTag": "Compact middleweight champion peak",
    "photoUrl": "assets/fighters/chris-weidman.webp",
    "thumbUrl": "assets/fighters/chris-weidman-thumb.webp",
    "oneLiner": "A compact elite middleweight peak built on ending Anderson Silva's reign, three successful title defenses, and real contender depth before a brutal loss-heavy back half.",
    "whyRankedHere": "Weidman ranks here because his best UFC run delivered championship proof that most contenders never reach: nine straight UFC wins, two official victories over Anderson Silva, and defenses against Silva, Lyoto Machida, and Vitor Belfort. The model also credits the Munoz breakthrough, the Gastelum rebound, and more than six active elite years.",
    "whyNotHigher": "He does not rank with the long-reign champions because the title run ended after three defenses and the reviewed prime includes four consecutive finished losses around one Gastelum rebound. His peak was elite, but the total UFC resume is much less stable than the names above him.",
    "keyJudgmentCalls": [
      [
        "Prime start",
        "Mark Munoz begins the connected elite and title-level window; the earlier unbeaten UFC run builds the record but not the GOAT-level prime."
      ],
      [
        "Anderson Silva rematch",
        "remains an official title-defense win, but the checked-kick leg injury receives reduced Championship and Opponent Quality credit."
      ],
      [
        "Gegard Mousasi",
        "counts as a competitive prime finish loss despite the confusing legal-knee and replay sequence."
      ],
      [
        "Uriah Hall leg break",
        "remains an official UFC loss but is treated as a freak technical result, not a normal knockout or competitive finish loss."
      ],
      [
        "Post-prime losses",
        "Reyes, Tavares, and Anders sit outside the reviewed prime window; Ring of Combat achievements are excluded entirely."
      ]
    ],
    "finalTakeaway": "Weidman is a serious UFC-only champion case with one of the sport's most important title wins and a genuinely elite compact peak. Three defenses and strong names get him into the debate; the short reign and four damaging prime finishes keep him below the long-term greats.",
    "watchUrl": "https://youtube.com/shorts/dnmX5Xwnwa8?is=V_PYG_dmthEU2LWM",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/jDPeuWStJy4?is=gI85bNLTdl6U6q05",
    "signatureFightLabel": "Watch Signature Fight",
    "displayName": "Chris “The All-American” Weidman",
    "profileDisplayName": "Chris “The All-American” Weidman",
    "compareProfile": {
      "shortCase": "Weidman owns one of the strongest compact middleweight peaks ever: nine straight UFC wins, two victories over Anderson Silva, and three successful title defenses.",
      "peak": "At his best he combined elite wrestling, pressure, timing, durability, and enough striking threat to knock out the most dominant middleweight champion ever.",
      "resume": "The Silva series is the foundation, with Machida, Belfort, Munoz, Gastelum, and Maia supplying real contender depth.",
      "prime": "The prime runs from the Munoz breakthrough through the Jacare loss, including a 6-4 record, elite title proof, and a Gastelum rebound after three losses.",
      "counter": "His best counterargument against deeper resumes is peak proof: he beat Anderson Silva twice and defended against two former champions before his first loss.",
      "edge": "Weidman wins comparisons against fighters without championship proof because his peak produced four UFC title-fight wins and a direct overthrow of an all-time great.",
      "signatureWins": "Anderson Silva twice, Lyoto Machida, Vitor Belfort, Mark Munoz, and Kelvin Gastelum define the UFC-only case.",
      "weakness": "Four finished losses inside the reviewed prime and only three successful defenses keep the total resume below the long-reign champions.",
      "titleSummary": "Won the undisputed middleweight title from Anderson Silva and posted three successful defenses before losing it to Luke Rockhold.",
      "primeSummary": "A 6-4 elite window from Mark Munoz through Jacare Souza, with five prime finishes, strong round control, and four damaging finished losses.",
      "titleStyle": "compactEliteReign",
      "primeStyle": "highPeakLossHeavyBackHalf"
    }
  },
  "Chuck Liddell": {
    "photoUrl": "assets/fighters/chuck-liddell.webp",
    "thumbUrl": "assets/fighters/chuck-liddell-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/yx_Phoyotj0?is=37ZCvF_fOG0d62BR",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/4g7YMHiQpf8?is=NYfyiSQTGxpzBQTT",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Chuck is the classic light heavyweight champion case: knockout aura, title defenses, Tito and Couture rivalries, and one of the defining star runs of the early modern UFC.",
      "peak": "At his best, Chuck was sprawl-and-brawl pressure, knockout power, defensive wrestling, and the confidence to force dangerous exchanges.",
      "resume": "Chuck’s UFC case is built on a real title reign and major rivalry wins, though the late knockout losses make the ending rough.",
      "counter": "Chuck’s argument is peak aura and era impact. The knock is that the resume is not as deep or clean as later light heavyweight and pound-for-pound cases.",
      "edge": "Chuck wins comparisons when title-reign value, knockout aura, and era-defining star power matter more than clean longevity.",
      "eliteCounter": true,
      "signatureWins": "Couture twice, Ortiz twice, Belfort, Sobral, Horn, Monson, and Mezger give Chuck a strong light heavyweight era resume.",
      "titleSummary": "Chuck’s title case is a real light heavyweight reign with multiple defenses and major rivalry wins during the UFC breakout years.",
      "primeSummary": "His UFC prime runs from the Vitor Belfort win through the Quinton Jackson title loss, with the Couture loss and the full championship knockout run included.",
      "titleStyle": "Classic Light Heavyweight Reign",
      "primeStyle": "Knockout Aura Prime",
      "weakness": "The late knockout losses and later-era LHW depth keep him below the cleaner long-reign champions.",
      "bestArgument": "Chuck's case starts with title-reign value, star power, and rivalry wins over Couture and Ortiz during the UFC's breakout years."
    },
    "divisionLabel": "LHW",
    "resumeTag": "Classic LHW knockout aura",
    "oneLiner": "The classic light heavyweight star case: knockout aura, title defenses, Tito/Couture rivalry value, and a rough late-career ending.",
    "whyRankedHere": "Liddell ranks here because his light heavyweight title run and rivalry wins were central to the UFC’s breakout era. He had real championship volume, major star power, and a dangerous peak built around knockout threat.",
    "whyNotHigher": "He does not rank higher because later light heavyweight resumes are deeper and cleaner, and the late knockout losses drag the UFC-only profile hard.",
    "keyJudgmentCalls": [
      [
        "Era impact",
        "matters as context, but the ranking still scores UFC resume value."
      ],
      [
        "Rivalry wins",
        "Tito and Couture wins carry a large part of the case."
      ],
      [
        "Title defenses",
        "give real championship value for his era."
      ],
      [
        "Late losses",
        "hurt the record and durability perception."
      ],
      [
        "Opponent depth",
        "is solid but not top-tier compared with Jones or modern deep divisions."
      ]
    ],
    "finalTakeaway": "Chuck is the classic UFC light heavyweight star: real title value and huge knockout aura, held back by a rough ending and deeper later-era resumes.",
    "packetStatus": {
      "stage": "canonical Vitor-to-Rampage prime rebuilt; Watch Moment needed",
      "lastUpdated": "2026-07-10",
      "nextFix": "Add Chuck Watch Moment link when Cody picks one."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/chuck-liddell.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-1.js",
      "photos": "assets/fighters/chuck-liddell.webp and assets/fighters/chuck-liddell-thumb.webp"
    }
  },
  "Cody Garbrandt": {
    "compareProfile": {
      "shortCase": "Garbrandt is the brilliant short-peak champion: the Cruz masterpiece proved an elite ceiling, while the Dillashaw losses and later knockouts crushed the long-term case.",
      "peak": "Hand speed, footwork, counters, takedown defense, power, and composure peaked in the Cruz title performance.",
      "resume": "The UFC resume has a real title win and several finishes, but the post-title record is the major limitation.",
      "counter": "One spectacular title win does not equal sustained championship control.",
      "edge": "He wins peak-brilliance debates more often than full resume debates.",
      "eliteCounter": true,
      "signatureWins": "Dominick Cruz, Thomas Almeida, Takeya Mizugaki, Raphael Assunção, and Rob Font.",
      "titleSummary": "One UFC bantamweight title win and zero defenses.",
      "primeSummary": "A spectacular but fragile peak centered on speed, power, and the Cruz performance.",
      "titleStyle": "shortBantamweightChampion",
      "primeStyle": "brilliantFragilePeak"
    },
    "oneLiner": "A brilliant championship peak wrapped inside a wildly unstable career.",
    "photoStatus": "pending-real-files"
  },
  "Conor McGregor": {
    "photoUrl": "assets/fighters/conor-mcgregor.webp",
    "thumbUrl": "assets/fighters/conor-mcgregor-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/eeHdLpBUmlU?is=rKzl28sGEKreaI2g",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/YCE8TDYj7aU?is=I7P8Wc-PVWXMlIzr",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Conor is the star-power and iconic-moment case: the Aldo knockout, the Alvarez masterclass, the double-champ moment, and the biggest cultural impact in UFC history.",
      "peak": "At his best, Conor was a terrifying precision striker with timing, distance control, confidence, and left-hand power that changed fights instantly.",
      "resume": "Conor’s resume is high-impact but short. The best moments are enormous, but the long-term ranked body of work does not match the deeper all-time champions.",
      "counter": "Conor’s argument is impact. If the debate is iconic moments, star power, and changing the business, he is in a class almost by himself.",
      "edge": "Conor wins comparisons when peak fame, historic moments, and two-division star power outweigh deeper but less spectacular resumes.",
      "starPower": "Conor should never be treated like a normal resume case. His ranking score should stay honest, but the app should respect that his cultural impact is unmatched.",
      "eliteCounter": true,
      "signatureWins": "Aldo, Alvarez, Mendes, Poirier, Holloway, and Diaz give Conor a high-impact win list even though the long-term resume is short.",
      "titleSummary": "Conor’s title case is historically important because of the two-division achievement, but he lacks the title-defense volume of the deeper champions.",
      "primeSummary": "His prime was electric but short: a fast rise from featherweight contender to double champ, followed by inactivity and uneven later results.",
      "titleStyle": "Compact Double-Champ Star",
      "primeStyle": "Short Explosive Prime",
      "primeNote": "short explosive prime built around the Aldo knockout and Alvarez double-champ moment",
      "weakness": "No title defenses, inactivity, and later losses keep the ranking lower than the fame suggests."
    },
    "divisionLabel": "FW / LW / WW",
    "resumeTag": "Compact double-champ star",
    "oneLiner": "The iconic-moment case: Aldo in 13 seconds, Alvarez double-champ masterclass, unmatched UFC star power, and a short prime window.",
    "whyRankedHere": "McGregor ranks here because his best UFC moments are enormous. The Aldo knockout, Alvarez masterclass, Mendes win, Holloway win, and Poirier early win make his peak impact impossible to ignore.",
    "whyNotHigher": "He does not rank higher because the long-term UFC body of work is short. No title defenses, inactivity, and later losses keep the scoring honest even though the cultural impact is unmatched.",
    "keyJudgmentCalls": [
      [
        "Star power",
        "respected in the profile but not allowed to replace championship volume."
      ],
      [
        "Aldo knockout",
        "one of the biggest single wins in UFC history."
      ],
      [
        "Alvarez win",
        "historic double-champ value and one of the cleanest title performances ever."
      ],
      [
        "No title defenses",
        "major reason the championship score stays capped."
      ],
      [
        "Later losses",
        "drag the resume but do not erase the short prime."
      ]
    ],
    "finalTakeaway": "Conor is the UFC iconic-moment king: massive peak impact and history-changing star power, but a shorter and less defended resume than the deeper GOAT cases.",
    "packetStatus": {
      "stage": "packet live; photos and Watch Moment needed",
      "lastUpdated": "2026-07-02",
      "nextFix": "Add Conor photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/conor-mcgregor.js",
      "compareFallback": "assets/compare-data.js"
    }
  },
  "Cris Cyborg": {
    "watchUrl": "https://youtu.be/QkLy3fUaGIE?is=3V5jMfq5SAyZSHR0",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/VD6vOlDi6fQ?is=xk9UVu9Ei9tZeH_I",
    "signatureFightLabel": "Watch Signature Fight",
    "oneLiner": "A terrifying short-run featherweight champion who went 5-1 in the UFC, won three title fights, and finished four opponents before Amanda Nunes ended the reign.",
    "whyRankedHere": "Cyborg ranks here because her UFC sample was brief but clearly championship-level. She won the featherweight belt, defeated Holly Holm over five rounds, defended again against Yana Kunitskaya, finished four of her five UFC victories, and won nearly 85% of her tracked rounds during the run.",
    "whyNotHigher": "She does not rank higher because this is a UFC-only list, so the long Strikeforce and Invicta portions of her legacy are excluded. Her UFC resume contains only six fights, roughly 2.6 active elite years, and one Top-5 win. The Amanda Nunes knockout is also a decisive prime title-loss finish that sharply limits an otherwise dominant sample.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/cris-cyborg.js",
      "displayFallback": "assets/data/fighter-packets/cris-cyborg.js"
    },
    "photoUrl": "assets/fighters/cris-cyborg.webp",
    "thumbUrl": "assets/fighters/cris-cyborg-thumb.webp"
  },
  "Dan Henderson": {
    "watchUrl": "https://youtube.com/shorts/dA2kztF7KpQ?is=wDxZ4DLlPA-C74uh",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/rLuppO32rUI?is=DdM4tdoZAMapoDRg",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "MW / LHW",
    "resumeTag": "All-time MMA legend, UFC-only cap",
    "oneLiner": "A true all-time MMA legend whose UFC-only score is much harsher: great Shogun/Bisping/Franklin moments, no UFC title wins, and most of the historic aura living outside this scoring scope.",
    "whyRankedHere": "Henderson ranks here because UFC-only still gives him real value: the Shogun classic, the Bisping knockout, the Franklin win, the Lombard knockout, old-era UFC 17 tournament context, and a long stretch of elite-name fights across middleweight and light heavyweight.",
    "whyNotHigher": "He does not rank higher because this ranking does not score Pride, Strikeforce, Rings, or the broader all-time MMA resume. In the UFC alone, Hendo went 8-9, never won an undisputed UFC title, and lost UFC title-level fights to Anderson Silva, Quinton Jackson, Daniel Cormier, and Michael Bisping.",
    "bigAssumptions": [
      [
        "UFC-only scope",
        "Pride titles, Strikeforce title, Rings tournament success, and broader all-time MMA aura are excluded from the score."
      ],
      [
        "Championship credit",
        "UFC 17 tournament history is context, not treated like a modern undisputed UFC title reign."
      ],
      [
        "Prime issue",
        "A lot of Henderson’s best career value happened outside the UFC, so the UFC-only prime window is naturally awkward."
      ],
      [
        "Post-prime losses",
        "Several late UFC losses are treated as post-prime/context-heavy rather than flat prime collapses."
      ],
      [
        "Fan perception",
        "The OVR is kept respectable because Hendo is a legend, but the raw UFC-only score stays honest."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Shogun fight",
        "The first Rua fight is the UFC-only resume anchor."
      ],
      [
        "Bisping split",
        "Hendo owns the iconic knockout, but lost the later UFC title fight."
      ],
      [
        "No UFC belt",
        "No undisputed UFC title win is the main ceiling."
      ],
      [
        "Outside resume",
        "Pride/Strikeforce greatness can be mentioned as context but not scored."
      ],
      [
        "Late-career volatility",
        "The record looks rough because much of the UFC sample came around or after his broader career peak."
      ]
    ],
    "finalTakeaway": "Henderson is exactly why the app needs UFC-only discipline. Historically, he is much greater than this slot. In this scoring system, the missing UFC title win and 8-9 UFC record keep him below cleaner UFC resume fighters.",
    "packetStatus": {
      "stage": "permanent hand-added fighter; packet live; UFC record corrected; photos needed",
      "lastUpdated": "2026-07-10",
      "nextFix": "Add Dan Henderson photos. Add Watch Moment only if Cody provides a URL."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/dan-henderson.js",
      "displayFallback": "assets/data/display-overrides.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "Add assets/fighters/dan-henderson.webp and assets/fighters/dan-henderson-thumb.webp when real files exist."
    },
    "compareProfile": {
      "shortCase": "Henderson is the all-time MMA legend with a UFC-only cap: huge names, unforgettable knockouts, no UFC undisputed belt, and too much resume value outside the scoring scope.",
      "peak": "At his best, Hendo had Olympic-level wrestling roots, absurd durability, and the right hand that could end anyone’s night. The problem is that much of that best value was not UFC-only.",
      "resume": "The UFC resume has Shogun Rua twice, Michael Bisping, Rich Franklin, Hector Lombard, Carlos Newton, and title-level losses to Anderson Silva, Rampage Jackson, Daniel Cormier, and Bisping.",
      "counter": "Hendo’s counterargument is that UFC-only underrates him by design because it excludes the exact promotions where much of his greatness happened.",
      "edge": "Henderson wins comparisons only when the debate allows broader MMA legacy. In strict UFC-only scoring, he loses to fighters with cleaner UFC title resumes.",
      "eliteCounter": true,
      "signatureWins": "Mauricio Rua, Michael Bisping, Rich Franklin, Hector Lombard, Carlos Newton, and the old UFC tournament context.",
      "weakness": "No UFC undisputed title win, 8-9 UFC record, and too much greatness outside the scoring scope.",
      "titleSummary": "Henderson has UFC title-challenge and tournament context, but no scored UFC undisputed title-fight wins.",
      "primeSummary": "His UFC prime is hard to isolate because his broader career peak is split across Pride, Strikeforce, and older tournament eras.",
      "titleStyle": "Old-School Tournament Context",
      "primeStyle": "H-Bomb Veteran Prime"
    },
    "photoUrl": "assets/fighters/dan-henderson.webp",
    "thumbUrl": "assets/fighters/dan-henderson-thumb.webp"
  },
  "Daniel Cormier": {
    "photoUrl": "assets/fighters/daniel-cormier.webp",
    "thumbUrl": "assets/fighters/daniel-cormier-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/seA_5VuSqFM?is=2bLCZ4sd8urFGiE8",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/2a0Ul8hRyqk?is=CYsGZkWOUaXUK6lt",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Cormier is the elite two-division champion case: light heavyweight title wins, heavyweight gold, strong opponent quality, and only losing ground because the Jones rivalry blocks the very top tier.",
      "peak": "At his best, Cormier was pressure, wrestling, clinch work, durability, and championship composure. He could fight elite opponents at light heavyweight or heavyweight and still look like one of the best fighters in the world.",
      "resume": "Cormier’s UFC resume is compact but elite: two-division champion, strong title-fight wins, and major victories over contenders and champions.",
      "counter": "The counterargument is direct separation. Jones beat him, and Stipe won the trilogy, so Cormier has two major rivalry ceilings in the all-time debate.",
      "edge": "Cormier wins comparisons when two-division title value and elite opponent quality outweigh rivalry losses to other all-time greats.",
      "eliteCounter": true,
      "signatureWins": "Stipe, Anthony Johnson twice, Gustafsson, Oezdemir, Derrick Lewis, Dan Henderson, and Anderson Silva give Cormier a strong UFC title-level win list.",
      "titleSummary": "Cormier won UFC gold at light heavyweight and heavyweight, defended both belts, and built a dense title-fight resume in a short UFC window.",
      "primeSummary": "His UFC prime was compact but packed with title fights, elite opponents, and very few low-value appearances.",
      "titleStyle": "Compact Two-Division Champion",
      "primeStyle": "Dense Elite Window",
      "weakness": "The Jones rivalry and Stipe trilogy keep DC from having clean divisional separation.",
      "bestArgument": "Cormier's case starts with two-division title value: light heavyweight gold, heavyweight gold, elite opponent quality, and a dense UFC title window."
    },
    "divisionLabel": "LHW / HW",
    "resumeTag": "Compact two-division champion",
    "oneLiner": "The compact two-division champion case: heavyweight gold, light heavyweight gold, elite wins, and rivalry ceilings against Jones and Stipe.",
    "whyRankedHere": "Cormier ranks #13 because his UFC resume is compact but elite: two-division champion, strong title-fight wins, and high-level wins at both light heavyweight and heavyweight.",
    "whyNotHigher": "He does not rank higher because direct rivalry separation blocks him. Jones clearly caps the light heavyweight case, Stipe won the heavyweight trilogy, and the UFC window is not as long as the deeper resumes above him.",
    "keyJudgmentCalls": [
      [
        "Two-division value",
        "UFC light heavyweight and heavyweight gold are central to the case."
      ],
      [
        "Jones rivalry",
        "keeps him out of the top-tier GOAT range even though DC was elite."
      ],
      [
        "Stipe trilogy",
        "gives DC huge value but also a direct-rivalry ceiling."
      ],
      [
        "Strikeforce context",
        "can be mentioned historically, but it is not scored here."
      ],
      [
        "Compact UFC window",
        "dense title value matters more than long calendar volume."
      ]
    ],
    "finalTakeaway": "Cormier is a dense elite-resume case: two UFC belts, major title wins, and all-time skill, held back by direct rivalry ceilings against Jones and Stipe.",
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for DC. Continue current-roster packet cleanup."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/daniel-cormier.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-1.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/daniel-cormier.webp and assets/fighters/daniel-cormier-thumb.webp"
    }
  },
  "Deiveson Figueiredo": {
    "displayName": "Deiveson “Deus da Guerra” Figueiredo",
    "profileDisplayName": "Deiveson “Deus da Guerra” Figueiredo",
    "resumeTag": "Two-time flyweight king",
    "watchUrl": "https://youtube.com/shorts/SZqB9e5-Evs?si=95XRoS9BiLZ6jZnw",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/OW_uA-X3HOg?is=8ya9VlZVXXDrXSNf",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "FLW / BW",
    "oneLiner": "A violent two-time UFC flyweight champion with real Moreno-rivalry title value, elite Pantoja/Benavidez wins, and useful bantamweight depth.",
    "whyRankedHere": "Figueiredo ranks here because he has real championship meat: three UFC flyweight title-fight wins, a draw-retainment credit, a violent title peak, and enough quality wins to separate him from thin-title cases.",
    "whyNotHigher": "He does not rank higher because the reign was short, flyweight gets a division-strength discount, the Moreno rivalry includes two damaging title losses, and the late bantamweight run adds respect without becoming prime GOAT longevity.",
    "bigAssumptions": [
      [
        "Draw retainment",
        "Moreno I counts as 0.25 adjusted title-win credit because Figueiredo retained the belt in a draw, but it is not treated like a full win."
      ],
      [
        "Missed-weight title bout",
        "Benavidez I gets quality and prime credit, but no title-win credit because Figueiredo missed weight and could not win the belt."
      ],
      [
        "Quality Wins cap",
        "Moreno, Benavidez II, and Pantoja sit at 1.00-level wins. No casual bumps above 1.00."
      ],
      [
        "Flyweight strength",
        "Flyweight gets a division-strength discount, but not enough to erase the title-level quality of the run."
      ],
      [
        "Bantamweight context",
        "BW wins help depth and longevity; BW decline losses are mostly post-prime/upward-division context."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Moreno rivalry",
        "The rivalry boosts the championship story, but Moreno II and IV put a real ceiling on the prime."
      ],
      [
        "Benavidez I",
        "No double punishment: no title credit, but the win still supports quality and apex."
      ],
      [
        "Pantoja win",
        "A full 1.00 quality win because it aged into elite flyweight proof."
      ],
      [
        "BW run",
        "Font, Garbrandt, Vera, and Montel help the resume; Yan/Sandhagen/Umar/Song are mostly post-prime upward-division losses."
      ]
    ],
    "apexPeakSummary": {
      "score": 4,
      "window": "Benavidez rematch through Moreno I/Perez title stretch",
      "components": {
        "peakStatus": 0.9,
        "eliteOpponentProof": 1.1,
        "separationDominance": 0.9,
        "divisionStrength": 0.45,
        "cleanApexAura": 0.65
      },
      "notes": "The 2020 finishing aura was real, but the Moreno rivalry prevents a higher clean-aura score."
    },
    "primeDominanceSummary": {
      "score": 18.6,
      "components": {
        "primeRecord": 4.5,
        "primeRoundsWon": 4.25,
        "titleDefenseDominance": 2.25,
        "finishStoppageDominance": 4.25,
        "lossSafetyDurability": 2.1,
        "divisionStrength": 1.25
      },
      "notes": "Violent finishing peak and title-level danger, capped by Moreno losses and lower flyweight strength."
    },
    "finalTakeaway": "Figueiredo is a real champion case with more title value than the thin-title group, but not enough clean reign length or division-strength leverage to jump the deeper UFC-only champion resumes.",
    "packetStatus": {
      "stage": "complete first-pass packet; corrected draw-retainment and missed-weight title logic; round-control rows included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/deiveson-figueiredo.js",
      "centralPacket": "assets/data/fighter-packets/deiveson-figueiredo.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Figueiredo is the violent two-time flyweight champion case: real title-fight wins, Moreno-rivalry history, Benavidez/Pantoja/Perez proof, and late bantamweight depth.",
      "peak": "At his best, Figueiredo was a scary flyweight finisher with title-level power and submission danger in a division built around speed.",
      "resume": "The resume has strong flyweight title value plus some bantamweight depth, but the Moreno losses and flyweight-strength discount cap the ceiling.",
      "counter": "The counterargument is that the clean reign was short and Moreno clearly capped the prime.",
      "edge": "Figueiredo wins comparisons when title-fight value and violent peak matter more than long clean dominance.",
      "eliteCounter": true,
      "signatureWins": "Brandon Moreno, Joseph Benavidez, Alexandre Pantoja, Alex Perez, Marlon Vera, Rob Font.",
      "weakness": "Short clean reign, flyweight strength discount, Moreno title losses, and late bantamweight decline.",
      "titleSummary": "Two-time UFC flyweight champion with three official title-fight wins plus draw-retainment context.",
      "primeSummary": "Violent flyweight title prime with strong finishing threat and messy Moreno-rivalry ceiling.",
      "bestArgument": "The best argument is that he has real UFC championship value, not just contender depth, and his best flyweight stretch was terrifying.",
      "titleStyle": "Two-Time Flyweight King",
      "primeStyle": "Violent Flyweight Apex"
    },
    "photoUrl": "assets/fighters/deiveson-figueiredo.webp",
    "thumbUrl": "assets/fighters/deiveson-figueiredo-thumb.webp"
  },
  "Demetrious Johnson": {
    "divisionLabel": "FLW",
    "resumeTag": "Flyweight standard",
    "photoUrl": "assets/fighters/demetrious-johnson.webp",
    "thumbUrl": "assets/fighters/demetrious-johnson-thumb.webp",
    "oneLiner": "The defining UFC flyweight champion: historic title control, elite technical dominance, and one of the cleanest prime skill sets in the sport.",
    "whyRankedHere": "Johnson ranks #3 because he built the UFC flyweight standard: a long title reign, elite technical control, strong prime dominance, and one of the best championship resumes in this ranking. His case is especially strong in title success and prime skill separation.",
    "whyNotHigher": "Johnson trails Jones and St-Pierre because his quality-wins score and flyweight division-strength context are lower in the current scoring model. His later non-UFC success adds historical context, but this ranking is based on the UFC resume.",
    "keyJudgmentCalls": [
      [
        "Flyweight context",
        "his dominance is respected, while the division-strength adjustment keeps the quality-wins score below the very top tier."
      ],
      [
        "Dominick Cruz loss",
        "a real UFC loss at bantamweight, but not the core of his flyweight prime."
      ],
      [
        "Henry Cejudo loss",
        "matters because it ended the UFC reign, but it was close enough that it does not erase the championship run."
      ],
      [
        "Non-UFC success",
        "can be mentioned historically, but it is not scored in this ranking."
      ],
      [
        "Skill vs resume",
        "his skill case may be even higher than his UFC resume score."
      ]
    ],
    "finalTakeaway": "Johnson is the UFC flyweight benchmark: historic title success, elite prime dominance, and a clean technical style that still grades near the top of the all-time list.",
    "watchUrl": "https://youtube.com/shorts/U6EH3w_Kg84?is=GNVuKz921_a_zud9",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/9LfHvnxk170?is=tYaKigfsNWM3-rEk",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "DJ is the flyweight standard: historic title control, elite technical completeness, and one of the cleanest dominance cases in the ranking.",
      "peak": "At his best, DJ was the most complete fighter in the sport: pace, wrestling, scrambling, submissions, striking, cardio, and fight IQ all working together.",
      "resume": "DJ’s resume is built on championship consistency. He ruled flyweight for years, defended repeatedly, and rarely looked out of control during his prime run.",
      "counter": "DJ’s best counterargument is skill and cleanliness. He may not have the biggest names, but his technical control and consistency are almost impossible to ignore.",
      "edge": "DJ wins when the debate rewards complete dominance, clean title control, and fewer resume holes over bigger-name but messier cases.",
      "scope": "His later ONE run adds historical context, but this ranking is scoring the UFC portion of the career.",
      "eliteCounter": true,
      "signatureWins": "Benavidez, Dodson, Cejudo, Horiguchi, and years of flyweight title defenses give DJ a clean dominance case even after division-strength context.",
      "weakness": "The only real drag is division depth. DJ’s skill and dominance are elite, but the flyweight opponent pool does not score like welterweight or lightweight.",
      "titleSummary": "DJ’s title case is historic at flyweight: long reign, repeated defenses, and clean separation from the division, with division-strength context applied.",
      "primeSummary": "His UFC prime was long, technical, consistent, and rarely chaotic; he controlled fights without many ugly dips.",
      "titleStyle": "Flyweight Reign Standard",
      "primeStyle": "Technical Completeness",
      "primeNote": "long technical flyweight reign with very few ugly moments",
      "bestArgument": "DJ’s best argument is technical completeness plus title control: he was cleaner than Anderson, more dominant than most longer-resume fighters, and more complete than almost anyone skill-for-skill."
    },
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for DJ. Migrate Anderson Silva next."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/demetrious-johnson.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/demetrious-johnson.webp and assets/fighters/demetrious-johnson-thumb.webp"
    }
  },
  "Dominick Cruz": {
    "photoUrl": "assets/fighters/dominick-cruz.webp",
    "thumbUrl": "assets/fighters/dominick-cruz-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/qtiyeEjlmNE?is=RFtIr9qAPjx98Ey5",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/n_KzCRNlcjA?is=n2AH_YPeYsG-SMNq",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Cruz is one of the smartest and most unique champions ever: brilliant footwork, elite fight IQ, a historic comeback, and a complicated resume shaped by injuries and gaps.",
      "peak": "At his best, Cruz was a puzzle. The movement, timing, defensive reads, and awkward entries made him one of the hardest champions to prepare for.",
      "resume": "Cruz’s resume is brilliant but fragmented. The highs are elite, especially the Dillashaw comeback, but injuries and gaps limit the total UFC volume.",
      "counter": "Cruz’s argument is uniqueness and comeback value. Few fighters ever returned from that much time away and beat a champion like Dillashaw.",
      "edge": "Cruz wins when the debate values tactical brilliance, comeback legacy, and peak skill over raw fight volume.",
      "scope": "Cruz’s WEC run is historical context, but this ranking scores his UFC resume. That keeps the comparison consistent while limiting his full historical picture.",
      "eliteCounter": true,
      "signatureWins": "Dillashaw, Faber, Demetrious Johnson, and Mizugaki give Cruz meaningful win value, with the Dillashaw comeback carrying huge legacy weight.",
      "titleSummary": "Cruz’s UFC title case has real shine, especially the Dillashaw comeback, but injuries and gaps limit the total scored title volume.",
      "primeSummary": "His prime is fragmented: brilliant at his best, but interrupted by long layoffs that cap active elite years.",
      "titleStyle": "Fragmented Champion Case",
      "primeStyle": "Injury-Interrupted Prime",
      "primeNote": "brilliant but injury-fragmented prime with long gaps between elite wins",
      "weakness": "The injuries and WEC/UFC scoring boundary keep the resume lighter than his full historical reputation."
    },
    "divisionLabel": "BW",
    "resumeTag": "Injury-fragmented champion",
    "oneLiner": "The movement genius case: brilliant bantamweight skill, a legendary comeback, and a UFC-only resume capped by injuries and long gaps.",
    "whyRankedHere": "Cruz ranks here because his best UFC work is brilliant. The Demetrious Johnson win, the Dillashaw comeback, and his unique championship style give him a real all-time bantamweight case inside the UFC scoring boundary.",
    "whyNotHigher": "He does not rank higher because this is UFC-only and active elite years matter more than calendar legacy. The WEC reign is historical context only, and the injuries created too many gaps to score like a long uninterrupted UFC reign.",
    "keyJudgmentCalls": [
      [
        "WEC reign",
        "historical context only, not main scoring credit."
      ],
      [
        "Dillashaw comeback",
        "a huge UFC legacy win and the center of his title case."
      ],
      [
        "Injury gaps",
        "cap active elite years even though the calendar span is long."
      ],
      [
        "Late losses",
        "create drag but do not erase the prime skill case."
      ],
      [
        "Skill vs resume",
        "his tactical genius grades higher than the raw UFC-only resume volume."
      ]
    ],
    "finalTakeaway": "Cruz is the injury-fragmented genius: one of the smartest and most unique champions ever, but UFC-only scoring keeps the total resume below the deeper title-volume cases.",
    "packetStatus": {
      "stage": "packet live; photos and Watch Moment needed",
      "lastUpdated": "2026-07-16",
      "nextFix": "Add Cruz photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/dominick-cruz.js",
      "compareFallback": "assets/compare-data.js"
    }
  },
  "Dricus du Plessis": {
    "displayName": "Dricus “Stillknocks” du Plessis",
    "profileDisplayName": "Dricus “Stillknocks” du Plessis",
    "resumeTag": "Modern middleweight champion",
    "watchUrl": "https://youtube.com/shorts/ifsX-hgSzz4?is=NWgRwVVkTzsNBGVC",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/jLTuhXQRMSg?is=RGX__HY_u-mRzr0F",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "MW",
    "oneLiner": "The modern middleweight chaos champion: Whittaker, Adesanya, and Strickland wins, strong finishing threat, and only one elite decision loss in the UFC.",
    "whyRankedHere": "Du Plessis ranks here because his UFC middleweight run got loud fast: Whittaker, Strickland, Adesanya, and Strickland again is a serious modern title-level win stack. The record is clean, the finishing threat is real, and the only UFC loss came to an elite champion-level opponent by decision.",
    "whyNotHigher": "He does not rank higher yet because the elite window is still short. He has strong championship value, but not the long title-fight volume, clean round-control dominance, active elite years, clean apex aura, or multi-era proof of the all-time names above him.",
    "bigAssumptions": [
      [
        "Current-table scope",
        "Uses the current scoring-table version where Dricus is 9-1 in the UFC with title wins over Strickland, Adesanya, and Strickland again, plus a Khamzat title loss."
      ],
      [
        "Apex window",
        "Robert Whittaker 2023 and Israel Adesanya 2024 are the locked two-performance Apex pair."
      ],
      [
        "Middleweight strength",
        "Modern middleweight gets respect but does not score like lightweight or GSP-era welterweight."
      ],
      [
        "Loss treatment",
        "The Khamzat loss is a prime elite decision loss only, not a finish penalty."
      ],
      [
        "Apex adjustment",
        "Two-performance strength is 1.90, Proof 1.50, Best-fighter claim 0.70, and Aura 0.45. Cody reduced the claim and aura to reflect close Strickland fights, a short reign, chaotic separation, and the Khamzat ceiling."
      ],
      [
        "Prime Dominance adjustment",
        "Prime Dominance is locked at 20.27 from the coherent 4-1 Whittaker-through-Khamzat elite window."
      ],
      [
        "Round control",
        "Round rows are best-effort and remain part of the future distribution review."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Non-UFC titles",
        "KSW and EFC accomplishments are historical context only, not scored."
      ],
      [
        "Whittaker win",
        "Starts the true elite window and anchors one of the two Apex performances."
      ],
      [
        "Adesanya win",
        "Carries major champion-value credit and is the second locked Apex performance."
      ],
      [
        "Strickland rivalry",
        "The two UFC title-fight wins strengthen the run but the close scorecards cap clean separation."
      ],
      [
        "Khamzat loss",
        "Counts as a prime elite decision loss, with no finish add-on, and caps the Apex claim/aura."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.55,
      "window": "Robert Whittaker 2023 + Israel Adesanya 2024",
      "components": {
        "twoPerformanceStrength": 1.9,
        "proof": 1.5,
        "bestFighterClaim": 0.7,
        "aura": 0.45
      },
      "notes": "Elite two-night proof from the Whittaker and Adesanya finishes, capped by close Strickland fights, a short reign, chaotic separation, and the Khamzat ceiling."
    },
    "primeDominanceSummary": {
      "score": 20.27,
      "notes": "Compact 4-1 elite/title window with major wins and real finishing threat; capped by moderate round control and the Khamzat title loss."
    },
    "finalTakeaway": "Du Plessis is already a real UFC-only middleweight legacy case: not long enough or clean enough for the inner GOAT circle, but strong enough to sit with the modern champion tier because the high-end wins are loud.",
    "packetStatus": {
      "stage": "Cody-reviewed Quality Wins, Prime Dominance, and Apex Peak complete",
      "lastUpdated": "2026-07-10",
      "nextFix": "Add real photos after Cody uploads source images; audit exact rounds-won percentage during the future distribution review."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/dricus-du-plessis.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Dricus is the modern middleweight champion burst: a short UFC window, but a loud one built around Whittaker, Strickland, Adesanya, and Strickland again.",
      "peak": "At his best, Dricus is awkward pressure, durability, strength, scrambling, and finishing threat. The Whittaker and Adesanya finishes create major Apex proof, even though the run never felt untouchable.",
      "resume": "The UFC resume is compact but powerful: Whittaker as the elite breakthrough, Strickland for the title, Adesanya for the title defense, and Strickland again for rivalry separation.",
      "counter": "Dricus keeps debates interesting because the high-end wins are stronger than his total UFC time would suggest.",
      "edge": "Dricus wins comparisons when modern title wins and high-end middleweight names matter more than long-term volume.",
      "eliteCounter": true,
      "signatureWins": "Whittaker, Strickland twice, Adesanya, Brunson, and Till give Dricus a compact but serious UFC middleweight resume.",
      "weakness": "The weakness is time and clean dominance. His case is still short on title defenses, active elite years, clean round-control dominance, and clean apex aura.",
      "titleSummary": "Three UFC title-fight wins make the title case legit, but still much shorter than the long-reign champions.",
      "primeSummary": "His 20.27 Prime Dominance score rewards the compact 4-1 elite window without treating close, chaotic title fights like clean domination.",
      "bestArgument": "Dricus has a rare compact-resume argument: even without long longevity, the Whittaker and Adesanya finishes plus two Strickland title wins make the top end hard to dismiss.",
      "titleStyle": "Short Modern Title Reign",
      "primeStyle": "Compact Middleweight Burst"
    },
    "photoUrl": "assets/fighters/dricus-du-plessis.webp",
    "thumbUrl": "assets/fighters/dricus-du-plessis-thumb.webp"
  },
  "Dustin Poirier": {
    "watchUrl": "https://youtube.com/shorts/IhdiRCgysNo?is=TQ3t1VPYpkftSVRQ",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/m3N1WuErSlg?is=_jDLz8z8YOZmGC9q",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "eliteCounter": true,
      "signatureWins": "Max Holloway twice, Conor McGregor twice, Justin Gaethje, Eddie Alvarez, Michael Chandler, Anthony Pettis, Dan Hooker, Benoit Saint Denis, and Jim Miller.",
      "primeNote": "long elite lightweight run built more on contender depth than undisputed title reign",
      "shortCase": "Poirier is the elite lightweight resume case: one interim belt, a giant win ledger, brutal schedule strength, and no undisputed title to push him into the higher GOAT tier.",
      "peak": "At his best, Poirier was pressure boxing, southpaw counters, durability, pace, and opportunistic submissions. He was championship-level dangerous without becoming a dominant undisputed champion.",
      "resume": "The UFC resume is excellent: Max Holloway twice, Conor McGregor twice, Justin Gaethje, Eddie Alvarez, Michael Chandler, Anthony Pettis, Dan Hooker, Benoit Saint Denis, Jim Miller, Bobby Green, and more.",
      "counter": "Poirier’s counterargument in debates is that he beat more great fighters than some actual champions and kept taking the hardest available lightweight fights.",
      "edge": "Poirier wins comparisons when deep win quality, modern lightweight strength, and repeated elite relevance matter more than undisputed title reign length.",
      "weakness": "The missing undisputed title is the headline weakness, with Khabib, Charles, Gaethje 2, Islam, and Max 3 making the loss cap important.",
      "titleSummary": "Poirier’s title case is one interim lightweight title win and three failed undisputed title shots.",
      "primeSummary": "His prime is elite, violent, and resilient, but not cleanly dominant enough to overcome the title-fight ceiling.",
      "titleStyle": "Interim Lightweight War King",
      "primeStyle": "Elite Lightweight War Prime"
    },
    "divisionLabel": "LW / FW",
    "resumeTag": "Interim lightweight legend, title-shot ceiling",
    "oneLiner": "The best non-undisputed lightweight resume in this range: elite wins everywhere, an interim belt, three undisputed title misses, and a capped loss profile keeping him out of the higher GOAT tier.",
    "whyRankedHere": "Poirier ranks here because the UFC-only resume is loaded: 22 UFC wins, an interim lightweight title, two UFC wins over Max Holloway, two over Conor McGregor, and major lightweight wins over Justin Gaethje, Eddie Alvarez, Michael Chandler, Anthony Pettis, Dan Hooker, Benoit Saint Denis, and Jim Miller.",
    "whyNotHigher": "He does not rank higher because he never won the undisputed UFC title, lost three undisputed lightweight title fights, and the Gaethje rematch plus Islam finish stack enough late elite damage that the -10 loss cap is doing real work.",
    "bigAssumptions": [
      [
        "Prime start",
        "Anthony Pettis 2017 / Justin Gaethje 2018 is treated as the start of the clean title-level lightweight window."
      ],
      [
        "Prime end",
        "The 2025 Holloway retirement fight is included as late elite context, but not treated like a peak-title version of Poirier."
      ],
      [
        "Title credit",
        "Only the Max Holloway interim lightweight title win counts as a UFC title-fight win. BMF fights are not scored as title wins."
      ],
      [
        "Loss cap",
        "Khabib, Charles, Gaethje 2, Islam, and Holloway 3 create more loss drag than the visible -10 cap shows."
      ],
      [
        "Division strength",
        "Modern lightweight gets strong 1.10-ish environment credit, which boosts the wins but also makes the loss ledger brutal."
      ],
      [
        "Non-UFC resume",
        "WEC and regional wins are historical context only and are not scored."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Interim title",
        "the Holloway 2019 win is the championship anchor, but one interim belt cannot match undisputed champions with defenses."
      ],
      [
        "Holloway trilogy",
        "Poirier owns two UFC wins over Max, while Max owns the final BMF/retirement-fight result and the stronger total GOAT case."
      ],
      [
        "McGregor series",
        "Poirier’s 2-1 UFC series edge over Conor matters, but the third fight has injury-finish context."
      ],
      [
        "Lightweight schedule",
        "his opponent-quality score is elite because he spent years fighting the hardest lightweight names available."
      ],
      [
        "Ceiling",
        "three failed undisputed title shots are the cleanest reason he stays below the higher championship cases."
      ]
    ],
    "finalTakeaway": "Poirier is the elite resume-over-belt case: he has enough UFC wins and opponent quality to sit around the top 20, but the missing undisputed title and capped loss context keep him below the true champion-reign tier.",
    "packetStatus": {
      "stage": "permanent hand-added fighter; packet live; photos needed",
      "lastUpdated": "2026-07-03",
      "nextFix": "Add Dustin Poirier photos. Add Watch Moment only if Cody provides a URL."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/dustin-poirier.js",
      "displayFallback": "assets/data/display-overrides.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "Add assets/fighters/dustin-poirier.webp and assets/fighters/dustin-poirier-thumb.webp when real files exist."
    },
    "photoUrl": "assets/fighters/dustin-poirier.webp",
    "thumbUrl": "assets/fighters/dustin-poirier-thumb.webp"
  },
  "Fabricio Werdum": {
    "thumbUrl": "assets/fighters/fabricio-werdum-thumb.webp",
    "photoUrl": "assets/fighters/fabricio-werdum.webp",
    "photoNote": "",
    "signatureFightUrl": "https://youtu.be/EA_u7Uge45Q?is=CP-pl6SIga7UptkJ",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/cayrTy79QNo?is=zOsLCkArO7f6rMcx",
    "watchLabel": "Watch Moment",
    "oneLiner": "A complete heavyweight champion whose submission of Cain Velasquez crowned a deep six-year run of elite wins, finishes, and high-level round control.",
    "whyRankedHere": "Werdum ranks here because his UFC resume is much deeper than a one-night title upset. He stopped Mark Hunt for the interim belt, submitted Cain Velasquez for the undisputed championship, beat Antônio Rodrigo Nogueira and Travis Browne, collected ten ranked wins, and maintained a 9-3 prime with strong finishing and round-winning numbers.",
    "whyNotHigher": "He does not rank higher because he recorded only two UFC title-fight wins and never completed an undisputed defense. The Stipe Miocic knockout ended the reign immediately, and later prime losses to Alistair Overeem and Alexander Volkov added further damage. His contender resume is excellent, but the championship control is too brief for the heavyweight GOAT tier.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/fabricio-werdum.js",
      "displayFallback": "assets/data/fighter-packets/fabricio-werdum.js"
    }
  },
  "Forrest Griffin": {
    "thumbUrl": "assets/fighters/forrest-griffin-thumb.webp",
    "photoUrl": "assets/fighters/forrest-griffin.webp",
    "photoNote": "",
    "signatureFightUrl": "https://youtu.be/dkECRNJCgOc?is=Bh3jqyclBSJ0X-G_",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/jeOGMfFxufc?is=7uTdPAA4zChmN_a4",
    "watchLabel": "Watch Moment",
    "oneLiner": "An upset-driven light-heavyweight champion whose wins over Shogun Rua and Rampage Jackson created a legitimate but short-lived elite peak.",
    "whyRankedHere": "Griffin ranks here because his best two-fight stretch carried real historical weight. He submitted Mauricio Rua in a major upset, then beat Quinton Jackson to win the UFC light-heavyweight title. Wins over Rich Franklin and Tito Ortiz add useful depth, while the Stephan Bonnar fight remains important context even though it is not an elite quality win.",
    "whyNotHigher": "He does not rank higher because the championship run ended in his first defense, the counted prime finished only 4-3, and Rashad Evans, Anderson Silva, and Rua all stopped him during that window. With one title-fight win, three Top-5 victories, and a 30% UFC finish rate, the resume lacks the sustained dominance of the champions above him.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/forrest-griffin.js",
      "displayFallback": "assets/data/fighter-packets/forrest-griffin.js"
    }
  },
  "Francis Ngannou": {
    "photoUrl": "assets/fighters/francis-ngannou.webp",
    "thumbUrl": "assets/fighters/francis-ngannou-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/UlZTD5oOgpU?is=dxMm-lAXt6S8UnTo",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/4Go5p7NWaiE?is=8BnCL81aC4u2greg",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Ngannou is the heavyweight terror case: historic power, a title win over Stipe, a defense over Gane, and a prime that felt more dangerous than almost anyone’s.",
      "peak": "At his best, Ngannou was pure consequence. His power changed every fight, and the improved patience and wrestling defense later in his UFC run made him more complete than the early version.",
      "resume": "Ngannou’s UFC resume is strong but shorter than Stipe’s. The high-end wins are massive, but the UFC exit capped the long-term title volume.",
      "counter": "The argument against Ngannou is title volume. His peak danger is obvious, but he does not have the long UFC championship run of the top heavyweight resume case.",
      "edge": "Ngannou wins comparisons when peak danger, heavyweight finishing power, and the Stipe title win matter more than long reign volume.",
      "eliteCounter": true,
      "signatureWins": "Stipe, Gane, Blaydes twice, Rozenstruik, dos Santos, Cain, Overeem, and Arlovski give Ngannou a dangerous heavyweight win list.",
      "titleSummary": "Ngannou’s title case is built on knocking out Stipe for the heavyweight belt and defending against Gane, though the UFC run ended before he could stack long-reign volume.",
      "primeSummary": "His prime was terrifying and more complete by the end, but shorter than the deepest heavyweight championship cases.",
      "titleStyle": "Heavyweight Power Champion",
      "primeStyle": "Terrifying Heavyweight Peak",
      "weakness": "The UFC run ended before he could stack long-reign volume, and Stipe still owns the deeper heavyweight case.",
      "bestArgument": "Ngannou's case starts with heavyweight peak value: the Stipe title win, the Gane defense, and a prime that felt uniquely dangerous."
    },
    "divisionLabel": "HW",
    "resumeTag": "Heavyweight power champion",
    "oneLiner": "The heavyweight terror case: historic power, Stipe title value, Gane defense value, and a UFC run capped before long-reign volume.",
    "whyRankedHere": "Ngannou ranks here because his peak danger and heavyweight title wins are massive. The Stipe knockout and Gane defense give him real championship value, while his finishing threat makes the prime-dominance case unusually strong.",
    "whyNotHigher": "He does not rank higher because the UFC title volume is short. The exit from the UFC capped the long-reign case, and Stipe still has the stronger full UFC heavyweight resume.",
    "keyJudgmentCalls": [
      [
        "Stipe split",
        "Ngannou gets huge credit for the title knockout, but Stipe has the deeper full heavyweight case."
      ],
      [
        "Gane defense",
        "important because it showed a more complete championship skill set."
      ],
      [
        "Power aura",
        "central to the prime-dominance argument."
      ],
      [
        "UFC exit",
        "caps longevity and championship volume in this ranking."
      ],
      [
        "Heavyweight context",
        "volatility is acknowledged while still rewarding the title peak."
      ]
    ],
    "finalTakeaway": "Ngannou is the heavyweight power-aura champion: terrifying, historically dangerous, and title-proven, but short on the UFC volume needed to climb higher.",
    "packetStatus": {
      "stage": "packet live; photos and Watch Moment needed",
      "lastUpdated": "2026-07-02",
      "nextFix": "Add Ngannou photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/francis-ngannou.js",
      "compareFallback": "assets/compare-coverage-pack-2.js"
    }
  },
  "Frank Shamrock": {
    "signatureFightUrl": "https://www.youtube.com/watch?v=obS1W3kHGvk",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/paKVbCYymQo?is=VWwRMYAM2viXsbs8",
    "watchLabel": "Watch Moment",
    "oneLiner": "A perfect early-UFC champion who went 5-0 with five title-fight wins, five finishes, and a defining victory over Tito Ortiz.",
    "whyRankedHere": "Shamrock ranks here because his short UFC run was flawless at championship level. He won all five appearances, finished every opponent, controlled every tracked round, and closed the run by stopping Tito Ortiz in the strongest performance of his UFC resume.",
    "whyNotHigher": "He does not rank higher because the entire UFC case spans only five fights and roughly 1.8 active elite years. The early light-heavyweight field was much thinner than later eras, only three wins reach Top-5 quality in the current model, and the limited sample cannot match champions who proved themselves across multiple generations.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/frank-shamrock.js",
      "displayFallback": "assets/data/fighter-packets/frank-shamrock.js"
    },
    "photoUrl": "assets/fighters/frank-shamrock.webp",
    "thumbUrl": "assets/fighters/frank-shamrock-thumb.webp"
  },
  "Frankie Edgar": {
    "watchUrl": "https://youtube.com/shorts/lLpRwEN3PJk?is=QVVQjKx_0gVmw-wO",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/9jpBlAiA3BM?is=zHpZeVMxigNffl0x",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "LW / FW / BW",
    "resumeTag": "Lightweight champ, three-division grinder",
    "oneLiner": "The toughness-and-longevity case: UFC lightweight gold, legendary title fights, elite featherweight wins, and enough late-career losses to keep the ceiling capped.",
    "whyRankedHere": "Edgar ranks here because his UFC-only resume has real championship value, rare three-division relevance, and a deep quality-win ledger built around B.J. Penn, Gray Maynard, Chad Mendes, Cub Swanson, Charles Oliveira, Urijah Faber, Sean Sherk, Jeremy Stephens, and Tyson Griffin.",
    "whyNotHigher": "He does not rank higher because the official loss column is heavy, his title reign was not long enough to match the top champions, and his prime dominance is more about grit, pace, and durability than overwhelming separation.",
    "bigAssumptions": [
      [
        "Prime start",
        "B.J. Penn 2010 starts the clean title-level prime window."
      ],
      [
        "Prime end",
        "Brian Ortega 2018 is treated as the end of the counted prime window; later bantamweight losses are mostly post-prime."
      ],
      [
        "Title credit",
        "Penn, Penn 2, and Maynard 3 count as UFC title-fight wins; the Maynard draw is context only."
      ],
      [
        "Division strength",
        "Lightweight and featherweight are treated as strong environments, but bantamweight losses come late and do not define the peak case."
      ],
      [
        "Loss cap",
        "Raw loss damage would be ugly if treated flat, so the locked post-prime and -10 cap rules matter a lot here."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "B.J. Penn rivalry",
        "Penn wins are the championship anchor, even with debate around the first decision."
      ],
      [
        "Maynard trilogy",
        "draw plus comeback title defense adds real title-reign context, but the draw is not scored as a win."
      ],
      [
        "Featherweight run",
        "Aldo losses hurt, but Mendes, Cub, and Faber keep the second-act case strong."
      ],
      [
        "Durability",
        "Edgar’s not-finished aura matters, but Ortega and Yair still count in the prime window."
      ],
      [
        "Late losses",
        "Sandhagen, Vera, Gutierrez, Zombie-type late results are mostly post-prime drag, not the core case."
      ]
    ],
    "finalTakeaway": "Edgar is a classic UFC-only resume fighter: not a top-tier GOAT case, but a former lightweight champion with elite longevity, real quality wins, and one of the most respected toughness profiles in UFC history.",
    "packetStatus": {
      "stage": "permanent hand-added fighter; Watch Moment added; photos needed",
      "lastUpdated": "2026-07-03",
      "nextFix": "Add Frankie photos."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/frankie-edgar.js",
      "displayFallback": "assets/data/display-overrides.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "Add assets/fighters/frankie-edgar.webp and assets/fighters/frankie-edgar-thumb.webp when real files exist."
    },
    "compareProfile": {
      "shortCase": "Edgar is the lightweight champion and three-division longevity case: title wins, elite featherweight wins, legendary durability, and a loss column that keeps him below cleaner champions.",
      "peak": "At his best, Edgar was pace, wrestling, recovery, boxing volume, and absurd toughness. His peak was less destructive than the knockout artists, but extremely hard to separate from.",
      "resume": "The UFC resume has real depth: Penn twice, Maynard, Mendes, Cub, Oliveira, Faber, Sherk, Stephens, and Griffin across lightweight and featherweight.",
      "counter": "Edgar’s counterargument is simple: his record looks worse than his actual career because he spent years fighting elite and larger opponents across divisions.",
      "edge": "Edgar wins comparisons when title grit, schedule depth, three-division relevance, and elite longevity matter more than clean dominance.",
      "eliteCounter": true,
      "signatureWins": "B.J. Penn twice, Gray Maynard, Chad Mendes, Cub Swanson, Charles Oliveira, Urijah Faber, Sean Sherk, Jeremy Stephens, and Tyson Griffin.",
      "weakness": "The losses are the ceiling. Henderson, Aldo, Ortega, Holloway, Zombie, Sandhagen, Vera, and Gutierrez-type results make the -10 cap important.",
      "titleSummary": "Edgar’s title case is lightweight-focused: title win, title defense over Penn, and Maynard trilogy payoff.",
      "primeSummary": "His prime is durable and high-paced rather than overwhelmingly dominant, which keeps his Prime Dominance below the cleaner top-tier cases.",
      "titleStyle": "Lightweight Comeback Champion",
      "primeStyle": "Durable Pace Prime"
    },
    "photoUrl": "assets/fighters/frankie-edgar.webp",
    "thumbUrl": "assets/fighters/frankie-edgar-thumb.webp"
  },
  "Georges St-Pierre": {
    "divisionLabel": "WW / MW",
    "resumeTag": "Complete all-time resume",
    "photoUrl": "assets/fighters/georges-st-pierre.webp",
    "thumbUrl": "assets/fighters/georges-st-pierre-thumb.webp",
    "oneLiner": "The complete UFC resume: a legendary welterweight reign, elite quality wins, and one of the cleanest prime runs in the sport.",
    "whyRankedHere": "St-Pierre ranks #2 because he combines an all-time welterweight title reign with the strongest quality-wins case in the UFC, elite consistency across his prime, and decisive revenge wins over the losses that matter most. His resume is one of the deepest, cleanest, and easiest to defend in the sport.",
    "whyNotHigher": "Jon Jones still has the edge in championship volume and total time at the very top. St-Pierre's case is elite across the board, but the Serra upset and slightly lower title-fight total keep him just behind #1.",
    "keyJudgmentCalls": [
      [
        "Matt Hughes 2004",
        "counts as a real early-career elite loss, but it was avenged twice."
      ],
      [
        "Matt Serra 2007",
        "counts as a meaningful upset loss, but the rematch and title reclaim are central to his case."
      ],
      [
        "Middleweight title win",
        "adds value, but his resume is built primarily on the welterweight reign."
      ],
      [
        "Opponent quality wins",
        "is the clearest strength of the GSP case and the best in this ranking."
      ],
      [
        "Late-career sample",
        "is small, so the profile stays focused on the established welterweight prime."
      ]
    ],
    "finalTakeaway": "St-Pierre is the complete champion case: elite title success, the best quality-wins score in this ranking, long-term consistency, and decisive answers to the biggest questions on his resume.",
    "watchUrl": "https://youtube.com/shorts/Gb0lJf0-lZU?is=ViJReSsAfOjWw1xf",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/4BCLM2kLh9I?is=F6TfTvsJpzKshLPK",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "GSP is the cleanest elite GOAT case: deep opponent quality, long welterweight control, avenged losses, and one of the most complete skill sets ever.",
      "peak": "At his best, GSP was control without chaos. He could out-wrestle strikers, out-strike wrestlers, win rounds safely, and make elite opponents look limited.",
      "resume": "GSP's resume is built on quality and polish. He beat elite names across multiple generations, reclaimed his belt after the Serra upset, and later added the middleweight title.",
      "counter": "GSP's argument against anyone is cleanliness. He avenged the losses, controlled elite opponents, and has fewer awkward resume questions than Jones.",
      "edge": "GSP wins comparisons when opponent quality, resume polish, and clean championship control matter more than raw title-fight volume.",
      "eliteCounter": true,
      "signatureWins": "Hughes, Penn, Fitch, Shields, Condit, Diaz, Hendricks, and Bisping give GSP one of the deepest elite-win ledgers in the ranking.",
      "againstPerfectPeak": "Against perfect-peak fighters, GSP's argument is total proof: more elite opponents, more championship rounds, and a longer window as the standard at welterweight.",
      "titleSummary": "GSP's title case is built on a long welterweight reign, repeated title-fight wins, and a later middleweight belt that adds bonus value.",
      "primeSummary": "His prime lasted across multiple welterweight eras, and he left before piling up ugly post-prime damage.",
      "titleStyle": "Clean Reign Standard",
      "primeStyle": "Control Without Chaos",
      "primeNote": "long, clean welterweight control without much post-prime damage",
      "cleanResumeCounter": "GSP is the cleanest counterargument to Jon: fewer weird resume questions, avenged losses, elite control, and one of the best opponent-quality cases ever.",
      "bestArgument": "GSP's best argument is clean completeness: elite opponent quality, long title control, avenged losses, and very few awkward resume questions."
    },
    "categories": {},
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for GSP. Migrate Demetrious Johnson next."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/georges-st-pierre.webp and assets/fighters/georges-st-pierre-thumb.webp"
    }
  },
  "Germaine de Randamie": {
    "compareProfile": {
      "shortCase": "De Randamie is the underfilled champion case: elite kickboxing, a featherweight title win, strong bantamweight performances, and too little activity.",
      "peak": "Precise kickboxing, clinch knees, timing, distance management, and strong defensive instincts defined her best version.",
      "resume": "The UFC resume contains a championship win and credible contender victories, but inactivity limits depth.",
      "counter": "No title defense, shallow featherweight depth, and two losses to Nunes cap the case.",
      "edge": "She wins pure-striking and peak-difficulty comparisons.",
      "eliteCounter": false,
      "signatureWins": "Holly Holm, Julianna Peña, Aspen Ladd, Raquel Pennington, and Julia Budd.",
      "titleSummary": "One UFC title win, zero defenses, and a later bantamweight title loss.",
      "primeSummary": "Elite kickboxing peak with sparse activity and an incomplete reign.",
      "titleStyle": "inauguralFeatherweightChampion",
      "primeStyle": "eliteKickboxingSparsePrime"
    },
    "oneLiner": "Championship-level kickboxing with an inactivity-limited resume.",
    "photoStatus": "pending-real-files"
  },
  "Gilbert Melendez": {
    "compareProfile": {
      "shortCase": "Melendez is a major UFC-only scope casualty: he nearly won the title immediately but went 1-6 in the promotion.",
      "peak": "His best UFC showing was the razor-close Benson Henderson title fight, built on pressure boxing, scrambling, and toughness.",
      "resume": "UFC-only, the resume is one win over Diego Sanchez and six losses. Strikeforce achievements are context only.",
      "counter": "His full career is much stronger than his UFC-only resume.",
      "edge": "He mainly wins broader historical-context debates, not UFC-only career debates.",
      "eliteCounter": false,
      "signatureWins": "Diego Sanchez is the lone UFC win; the close Henderson loss is the signature performance.",
      "titleSummary": "Two UFC lightweight title losses.",
      "primeSummary": "Entered the UFC late in an elite broader career and did not build UFC win volume.",
      "titleStyle": "outsideLegacyScopeCasualty",
      "primeStyle": "lateArrivalVeteranPrime"
    },
    "oneLiner": "A major UFC-only scope casualty whose best work happened before arrival.",
    "photoStatus": "pending-real-files"
  },
  "Glover Teixeira": {
    "thumbUrl": "assets/fighters/glover-teixeira-thumb.webp",
    "photoUrl": "assets/fighters/glover-teixeira.webp",
    "photoNote": "",
    "signatureFightUrl": "https://www.youtube.com/watch?v=dAsCS4R0cuE",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/fED8oDX1LBs?is=1iGeCVa-GP0UeZPS",
    "watchLabel": "Watch Moment",
    "oneLiner": "The late-career title miracle: sixteen UFC wins, thirteen ranked victories, relentless finishing, and a championship breakthrough after nearly a decade among the elite.",
    "whyRankedHere": "Teixeira ranks here because his light-heavyweight resume combines extraordinary longevity with real opponent depth and an improbable championship finish. He beat Rampage Jackson, Ryan Bader, Rashad Evans, Anthony Smith, Thiago Santos, and Jan Błachowicz, collected seven Top-5 wins, and finally won the belt during an elite run in his forties.",
    "whyNotHigher": "He does not rank higher because the championship chapter produced only one title-fight win and no successful defense. His 12-6 prime contains several meaningful defeats, including finish losses to Anthony Johnson, Alexander Gustafsson, and Jiří Procházka, while the Corey Anderson decision is a damaging non-elite prime loss in the model.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/glover-teixeira.js",
      "displayFallback": "assets/data/fighter-packets/glover-teixeira.js"
    }
  },
  "Henry Cejudo": {
    "photoUrl": "assets/fighters/henry-cejudo.webp",
    "thumbUrl": "assets/fighters/henry-cejudo-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/iqVU88zpDXw?is=NaDy1Ol5Kn1XlYzV",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/Cpujg52kBU0?is=lA6FmsD5nZQYNLKr",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Cejudo is one of the best short-window legacy cases in the sport: flyweight champion, bantamweight champion, and a fighter who packed a lot of value into a compact UFC run.",
      "peak": "Cejudo’s peak was absurdly efficient: he beat Demetrious Johnson, finished T.J. Dillashaw, moved up, and won bantamweight gold against Marlon Moraes.",
      "resume": "His issue is volume. The high-end wins are excellent, but the long-term UFC resume is short compared with the deeper all-time champions.",
      "counter": "Cejudo’s argument is peak efficiency. He did a lot in a small window, and his best wins are loud enough to make him dangerous in almost any comparison.",
      "edge": "Cejudo wins when compact championship achievement and two-division value matter more than long-term title volume.",
      "eliteCounter": true,
      "signatureWins": "Demetrious Johnson, T.J. Dillashaw, Marlon Moraes, Dominick Cruz, and Jussier Formiga give Cejudo a compact but loud elite-win stack.",
      "titleSummary": "Cejudo won UFC gold in two divisions, but the title window was short and does not have long-reign defense volume.",
      "primeSummary": "His best UFC work came in a compact burst from the DJ rematch through the Dillashaw and Moraes wins.",
      "titleStyle": "Compact Double Champ",
      "primeStyle": "Short Achievement Burst",
      "primeNote": "compact achievement burst across flyweight and bantamweight",
      "weakness": "The short window and return losses keep him below deeper all-time championship resumes."
    },
    "divisionLabel": "FLW / BW",
    "resumeTag": "Compact double-champ burst",
    "oneLiner": "The compact achievement burst: flyweight gold, bantamweight gold, huge name wins, and a short window that limits total volume.",
    "whyRankedHere": "Cejudo ranks here because he packed major value into a short UFC window: flyweight title, bantamweight title, the Demetrious Johnson win, and a fast run through elite names.",
    "whyNotHigher": "He does not rank higher because the title window is short and the total UFC volume is limited. The achievements are loud, but the long-reign proof is not there.",
    "keyJudgmentCalls": [
      [
        "Double-champ value",
        "a major part of the case."
      ],
      [
        "DJ win",
        "huge high-end flyweight value, even with close-fight context."
      ],
      [
        "Dillashaw and Moraes wins",
        "make the title burst feel historically loud."
      ],
      [
        "Retirement gap",
        "limits active elite longevity."
      ],
      [
        "Return losses",
        "add record drag, but post-prime losses do not reduce the locked Loss Context score."
      ]
    ],
    "finalTakeaway": "Cejudo is the compact double-champ case: one of the most efficient achievement bursts in UFC history, but too short to outrank deeper long-reign resumes.",
    "packetStatus": {
      "stage": "packet live; current UFC record reconciled; photos and Watch Moment needed",
      "lastUpdated": "2026-07-10",
      "nextFix": "Add Henry photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/henry-cejudo.js",
      "compareFallback": "assets/compare-data.js"
    }
  },
  "Holly Holm": {
    "watchUrl": "https://youtube.com/shorts/U_SlK5dA1Zw?si=M7W6XcHaTz4SlAMD",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/3j7WaTd8bkQ?is=MPSWMNle4EFHa4Y0",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "WBW / WFW",
    "resumeTag": "Ronda upset legend",
    "oneLiner": "A former UFC bantamweight champion with one immortal title upset, but no defenses and too many failed elite/title spots to climb higher.",
    "whyRankedHere": "Holm scores because the Ronda knockout is one of the biggest UFC championship moments ever and she stayed relevant in title/elite fights for years.",
    "whyNotHigher": "She does not rank higher because she had no successful defenses, lost the belt immediately, and came up short in several title/elite fights.",
    "bigAssumptions": [
      [
        "Ronda win",
        "Ronda gets rare 1.25 Quality Win credit and full adjusted-title credit."
      ],
      [
        "Featherweight title losses",
        "GDR and Cyborg are reduced context, not full same-division collapse."
      ],
      [
        "Kayla loss",
        "Kayla is post-prime and not fully charged."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Signature moment",
        "Ronda win drives both Quality Wins and Apex Peak."
      ],
      [
        "No defenses",
        "Hard cap on Championship."
      ],
      [
        "Loss context",
        "The score charges repeated failed elite/title spots."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.45,
      "window": "Ronda title knockout",
      "components": {
        "peakStatus": 1.2,
        "eliteOpponentProof": 1.2,
        "separationDominance": 0.55,
        "divisionStrength": 0.75,
        "cleanApexAura": 0.75
      },
      "notes": "The Ronda upset maxes aura, but the reign did not last."
    },
    "primeDominanceSummary": {
      "score": 12.85,
      "components": {
        "primeRecord": 2.95,
        "primeRoundsWon": 3.25,
        "titleDefenseDominance": 0,
        "finishStoppageDominance": 2,
        "lossSafetyDurability": 2.85,
        "divisionStrength": 1.8
      },
      "notes": "Good apex moment, mixed prime control."
    },
    "finalTakeaway": "Holm belongs on the board, but she lands lower than historical reputation because UFC-only depth after Ronda is thin.",
    "packetStatus": {
      "stage": "complete first-pass packet; bantamweight title case, win ledger, loss context, compare seasoning, fight ledger, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/holly-holm.js",
      "centralPacket": "assets/data/fighter-packets/holly-holm.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Holm is the immortal upset case: she knocked out Ronda for the belt and stayed around elite/title fights for years.",
      "peak": "At her apex, Holm produced one of the cleanest title-upset performances in UFC history.",
      "resume": "The resume is top-heavy: Ronda is huge, but the supporting championship case is thin.",
      "counter": "The counter is everything after Ronda: no defenses, immediate Miesha loss, and repeated title-fight failures.",
      "edge": "Holm wins comparisons when signature moment and historical shock value matter.",
      "eliteCounter": false,
      "signatureWins": "Ronda Rousey, Irene Aldana, Raquel Pennington, Megan Anderson.",
      "weakness": "No defenses and several elite/title losses.",
      "titleSummary": "One-time UFC bantamweight champion.",
      "primeSummary": "Title/elite window from Ronda through Aldana.",
      "bestArgument": "She authored one of the biggest UFC wins ever.",
      "titleStyle": "Ronda Upset Legend",
      "primeStyle": "Signature Moment Champion"
    },
    "photoUrl": "assets/fighters/holly-holm.webp",
    "thumbUrl": "assets/fighters/holly-holm-thumb.webp"
  },
  "Ilia Topuria": {
    "photoUrl": "assets/fighters/ilia-topuria.webp",
    "thumbUrl": "assets/fighters/ilia-topuria-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/8HrxSwOoLZM?is=eygzt_4-hGWU87kL",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/nGcK0ilhu9c?is=VaKy-0-UQAad68t0",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Topuria is the new-era featherweight takeover case: wins over legends, title-level finishing power, and a resume that is already loud even while still building.",
      "peak": "At his best, Topuria is boxing power, grappling threat, confidence, pressure, and finishing instincts. He does not just win; he changes the temperature of a division fast.",
      "resume": "Topuria’s UFC case is still young, but the high end is already enormous because the Volkanovski and Holloway wins hit directly against featherweight history. The current-table Gaethje loss adds the first major blemish.",
      "counter": "The argument against Topuria is that he is still early. The top wins are huge, but he has not had time to build a long title reign, and the Gaethje loss makes the case less clean.",
      "edge": "Topuria wins comparisons when current peak value and direct wins over featherweight legends outweigh older fighters’ longer volume.",
      "eliteCounter": true,
      "signatureWins": "Volkanovski, Holloway, Emmett, Mitchell, Ryan Hall, and Jai Herbert give Topuria a young but already serious featherweight resume.",
      "titleSummary": "Topuria’s title case is not long yet, but beating Volkanovski and Holloway gives it rare high-end featherweight value.",
      "primeSummary": "His prime is still building, which makes the ceiling exciting but keeps the all-time case less proven than the long-reign champions. The Gaethje loss adds the first prime blemish.",
      "titleStyle": "New-Era Title Takeover",
      "primeStyle": "Still-Building Peak",
      "weakness": "Longevity and title volume are the clear gaps, and the Gaethje loss removes the clean unbeaten UFC argument.",
      "bestArgument": "Topuria's case starts with high-end featherweight value: an unbeaten UFC rise and direct wins over Volkanovski and Holloway while his title run is still building."
    },
    "divisionLabel": "FW / LW",
    "resumeTag": "New-era title takeover",
    "oneLiner": "The new-era takeover case: massive featherweight legend wins, elite finishing threat, and one current-table Gaethje loss adding the first real blemish.",
    "whyRankedHere": "Topuria ranks #15 because the high end is already enormous. Beating Volkanovski and Holloway gives him direct value against featherweight history, and his fast title rise gives the profile a real peak-dominance lane.",
    "whyNotHigher": "He does not rank higher yet because the championship volume and active elite years are still early, and the current-table Gaethje loss adds the first real blemish. The resume is loud, but it has not had time to become a long reign or deep all-time body of work.",
    "keyJudgmentCalls": [
      [
        "Volkanovski and Holloway wins",
        "carry huge featherweight historical value."
      ],
      [
        "Gaethje loss",
        "counts as the first UFC blemish and is handled as prime elite-loss context."
      ],
      [
        "Short sample",
        "keeps longevity and championship volume below the long-reign champions."
      ],
      [
        "Current trajectory",
        "his ceiling is very high, but the ranking still scores what has happened."
      ],
      [
        "Division context",
        "modern featherweight strength helps the quality-win case."
      ]
    ],
    "finalTakeaway": "Topuria is the fast-rising new-era case: huge high-end wins and elite peak signals already, with the Gaethje loss and short title volume keeping him below the long-reign greats for now.",
    "packetStatus": {
      "stage": "complete in packet system; current-table Gaethje loss synced",
      "lastUpdated": "2026-07-05",
      "nextFix": "None for Ilia. Current-table loss context now matches scoring."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/ilia-topuria.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-2.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/ilia-topuria.webp and assets/fighters/ilia-topuria-thumb.webp"
    }
  },
  "Islam Makhachev": {
    "divisionLabel": "LW / WW",
    "resumeTag": "Modern lightweight standard",
    "photoUrl": "assets/fighters/islam-makhachev.webp",
    "thumbUrl": "assets/fighters/islam-makhachev-thumb.webp",
    "oneLiner": "The modern lightweight control case: elite finishing efficiency, high-end prime dominance, and a title run that keeps getting stronger.",
    "whyRankedHere": "Islam ranks #5 because the current scoring model sees a rare combination of elite prime dominance and a rapidly growing championship resume. His skill, control, and finishing threat already put him near the very top tier.",
    "whyNotHigher": "He is still chasing the total volume of the fighters above him. The current scoring model also carries his pre-prime Martins loss and gives him fewer total elite-year reps than the older all-time resumes above him.",
    "keyJudgmentCalls": [
      [
        "Prime start",
        "the main scoring window begins with Drew Dober in 2021."
      ],
      [
        "Volkanovski wins",
        "receive top-level quality-wins credit in this ranking."
      ],
      [
        "Pre-prime loss",
        "the Martins loss counts, but only lightly because it came before his prime."
      ],
      [
        "Prime dominance",
        "is second-best in this ranking and the strongest part of his case outside the belt run."
      ],
      [
        "Second division",
        "the welterweight piece helps the profile, but lightweight remains the center of his resume."
      ]
    ],
    "finalTakeaway": "Islam is the modern lightweight benchmark: elite control, elite finishing, and a championship case that is already strong enough to sit in the all-time top five.",
    "watchUrl": "https://youtube.com/shorts/_S2i56bqwE8?is=WYg2MSMlw8IGYa9H",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/h9oj6HEdZSI?is=1Fp-NwJ3VRAXCl56",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Islam is the modern lightweight resume case: elite skill, growing championship volume, and a deeper title-level resume than Khabib’s shorter run.",
      "peak": "At his best, Islam is a complete control fighter with elite grappling, improved striking, patience, defense, and the ability to beat champions across styles.",
      "resume": "Islam’s resume has grown into one of the strongest lightweight cases. The championship volume and elite-win depth have pushed him beyond a pure successor argument.",
      "counter": "The counterargument against Islam is that he still does not feel as untouchable as Khabib. The resume may be bigger, but the aura is not quite as clean.",
      "edge": "Islam wins when the debate rewards total resume over pure peak. His championship volume and elite-win depth have become too much to ignore.",
      "eliteCounter": true,
      "signatureWins": "Oliveira, Volkanovski, Poirier, Tsarukyan, and Hooker give Islam a deep modern lightweight ledger with real championship weight.",
      "titleSummary": "Islam’s title case has grown into a deeper modern lightweight reign, with more championship volume than a short peak-only case.",
      "primeSummary": "His prime began later than Khabib’s scoring window but has already stacked elite years against modern lightweight and pound-for-pound level opponents.",
      "titleStyle": "Modern Lightweight Reign",
      "primeStyle": "Still-Building Elite Prime",
      "primeNote": "modern lightweight title run that later expanded into a second-division championship case",
      "weakness": "The case is still building compared with older all-time resumes, and the pre-prime Martins loss remains a small drag.",
      "bestArgument": "Islam’s best argument is modern depth: elite skill, growing title volume, quality wins across styles, and a prime run that is still strengthening."
    },
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Islam. Migrate Alexander Volkanovski next."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/islam-makhachev.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/islam-makhachev.webp and assets/fighters/islam-makhachev-thumb.webp"
    }
  },
  "Israel Adesanya": {
    "photoUrl": "assets/fighters/israel-adesanya.webp",
    "thumbUrl": "assets/fighters/israel-adesanya-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/CbvjjHBCUQM?is=J86x9mup7tQHDZS7",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/vx3vs0p6TEs?is=jS0EkVTFsuUKhoZn",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Adesanya is the modern middleweight title-volume case: elite striking, repeated defenses, two wins over Whittaker, and a long run as the face of the division.",
      "peak": "At his best, Izzy was distance, feints, counter-striking, takedown defense, and five-round control. He made elite middleweights fight at his rhythm.",
      "resume": "Adesanya’s UFC case is built on middleweight title volume and consistency, with the Pereira rivalry adding both a blemish and a major redemption moment.",
      "counter": "The counterargument is that the later losses and Pereira rivalry make the case less clean than the longest-reigning champions above him.",
      "edge": "Adesanya wins comparisons when modern middleweight title volume, striking dominance, and repeated elite wins outweigh messy rivalry context.",
      "eliteCounter": true,
      "signatureWins": "Whittaker twice, Costa, Cannonier, Vettori twice, Gastelum, Pereira, Brunson, and Silva give Adesanya one of the best modern middleweight win lists.",
      "titleSummary": "Adesanya’s title case is built on a strong middleweight reign, repeated defenses, and a title regain after the Pereira loss.",
      "primeSummary": "His elite window was active and title-heavy, with frequent five-round fights against the best middleweights of his era.",
      "titleStyle": "Modern Middleweight Volume",
      "primeStyle": "Active Title Prime",
      "weakness": "The later losses lower the prime-dominance case and make the story less clean than Anderson or the top GOAT-tier resumes.",
      "bestArgument": "Adesanya's case starts with middleweight title volume: repeated defenses, two wins over Whittaker, the Pereira revenge moment, and years as the face of the division."
    },
    "divisionLabel": "MW / LHW",
    "resumeTag": "Modern middleweight title volume",
    "oneLiner": "The modern middleweight title-volume case: elite striking, repeated defenses, a title regain, and one of the deepest active title windows of his era.",
    "whyRankedHere": "Adesanya ranks here because his middleweight championship volume is real: title win, repeated defenses, a title regain, and a deep list of modern contenders.",
    "whyNotHigher": "He does not rank higher because the later losses make the case less clean, and the Pereira/Strickland/DDP stretch creates prime-dominance drag. The title volume is excellent, but the resume is not as clean as the names above him.",
    "keyJudgmentCalls": [
      [
        "Middleweight title volume",
        "the repeated defenses and title regain are the core of the case."
      ],
      [
        "Pereira rivalry",
        "adds both a major blemish and a major redemption win."
      ],
      [
        "Whittaker wins",
        "carry high-end middleweight value."
      ],
      [
        "Later losses",
        "create real drag and keep the profile outside the top ten."
      ],
      [
        "Light heavyweight attempt",
        "adds context, but middleweight remains the scoring center."
      ]
    ],
    "finalTakeaway": "Adesanya is the modern middleweight title-volume standard: deep, active, and important, but less clean than the longest-reign GOAT cases above him.",
    "packetStatus": {
      "stage": "complete in packet system; current UFC record reconciled",
      "lastUpdated": "2026-07-10",
      "nextFix": "None for Izzy. Continue current-roster packet cleanup."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/israel-adesanya.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-1.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/israel-adesanya.webp and assets/fighters/israel-adesanya-thumb.webp"
    }
  },
  "Jessica Andrade": {
    "watchUrl": "https://youtube.com/shorts/ifn-NLuFWi0?si=kjwT0ZO3k_kd4KX-",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/nQIBZ2fjrMQ?is=_o9fLH0odv_P1miD",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "SW / FLW",
    "resumeTag": "Three-division wrecking ball",
    "oneLiner": "A former UFC strawweight champion with elite volume, real cross-division wins, and a messy but undeniable UFC-only resume.",
    "whyRankedHere": "Andrade belongs high in this women’s champion tier because she has real UFC title value, the strongest win volume in this batch, and quality names across 115 and 125.",
    "whyNotHigher": "She does not rank higher because she never defended the belt, lost several title/elite fights, and the late record is messy.",
    "bigAssumptions": [
      [
        "Title credit",
        "Rose title win is 1.00 adjusted title win."
      ],
      [
        "Loss treatment",
        "Late skid is not all treated as full prime damage, but elite/title losses still matter."
      ],
      [
        "Division context",
        "Strawweight gets strong women’s division credit; flyweight adds cross-division relevance."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Volume vs cleanliness",
        "The app rewards the huge UFC win ledger without pretending the record is clean."
      ],
      [
        "No defenses",
        "This keeps Championship from climbing higher."
      ],
      [
        "Late losses",
        "Some late chaos is softened as decline, not full-prime collapse."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.35,
      "window": "Rose title win and 2017-2022 elite run",
      "components": {
        "peakStatus": 1.05,
        "eliteOpponentProof": 1.15,
        "separationDominance": 0.8,
        "divisionStrength": 0.75,
        "cleanApexAura": 0.6
      },
      "notes": "Real champion peak with violent finish threat, capped by no title-defense stack."
    },
    "primeDominanceSummary": {
      "score": 17.45,
      "components": {
        "primeRecord": 4.6,
        "primeRoundsWon": 3.7,
        "titleDefenseDominance": 0,
        "finishStoppageDominance": 4.15,
        "lossSafetyDurability": 2.95,
        "divisionStrength": 2.05
      },
      "notes": "Dangerous and durable, but too many elite losses for a clean dominance grade."
    },
    "finalTakeaway": "Andrade is not a clean champion case, but she is absolutely a needed women’s UFC GOAT-board add.",
    "packetStatus": {
      "stage": "complete first-pass packet; championship case, quality ledger, loss context, compare seasoning, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next full rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/jessica-andrade.js",
      "centralPacket": "assets/data/fighter-packets/jessica-andrade.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Andrade is the volume-and-violence women’s UFC case: real title win, huge win count, and quality names across divisions.",
      "peak": "At her best, Andrade was one of the most physically destructive women in UFC history.",
      "resume": "The resume is messy but deep. The app rewards the top-end names and volume while charging title losses and the late skid.",
      "counter": "The counter is no defenses and too many losses.",
      "edge": "Andrade wins comparisons when volume, finish danger, and cross-division resume matter.",
      "eliteCounter": true,
      "signatureWins": "Rose Namajunas, Claudia Gadelha, Karolina Kowalkiewicz, Amanda Lemos, Mackenzie Dern, Marina Rodriguez, Lauren Murphy.",
      "weakness": "No defenses and a heavy loss column.",
      "titleSummary": "One-time UFC strawweight champion.",
      "primeSummary": "Elite/title window from Claudia through Lemos/Murphy.",
      "bestArgument": "Few women have more real UFC win volume and ranked-name depth.",
      "titleStyle": "Strawweight Wrecking Ball",
      "primeStyle": "Violent Cross-Division Volume"
    },
    "photoUrl": "assets/fighters/jessica-andrade.webp",
    "thumbUrl": "assets/fighters/jessica-andrade-thumb.webp"
  },
  "Jessica Eye": {
    "compareProfile": {
      "shortCase": "Eye is the shallow-division title challenger: durable veteran experience and a flyweight title shot, but a losing UFC record and little finishing value.",
      "peak": "Boxing volume, toughness, and clinch work were enough to create a brief flyweight contender run.",
      "resume": "The UFC-only resume is losing overall, with a short flyweight streak providing most of the value.",
      "counter": "The resume lacks elite wins, finishes, and championship competitiveness.",
      "edge": "She functions as a realistic lower-tier career, finishing, and completeness trap.",
      "eliteCounter": false,
      "signatureWins": "Katlyn Chookagian, Jessica-Rose Clark, and Kalindra Faria.",
      "titleSummary": "One UFC flyweight title loss.",
      "primeSummary": "A brief contender window in a developing division.",
      "titleStyle": "shallowDivisionChallenger",
      "primeStyle": "briefVolumeBoxingPrime"
    },
    "oneLiner": "A real title challenger who adds honest lower-tier career and finishing traps.",
    "photoStatus": "pending-real-files"
  },
  "Joanna Jedrzejczyk": {
    "photoUrl": "assets/fighters/joanna-jedrzejczyk.webp",
    "thumbUrl": "assets/fighters/joanna-jedrzejczyk-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/rqxlySX0WwA?is=qmc_JW12ecYdL3KT",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/cINJim4gWN4?is=Y9AgsjUAgh-5WYoQ",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "SW",
    "resumeTag": "Strawweight title standard",
    "oneLiner": "The strawweight standard: long title control, elite striking volume, and one of the cleanest technical champion runs in women’s UFC history.",
    "whyRankedHere": "Joanna ranks women’s #3 because her strawweight reign was historically important and technically dominant. Her title defenses, pace, takedown defense, and striking output made her the early standard for the division.",
    "whyNotHigher": "She does not pass Nunes or Valentina because she has less two-division value, less total title-fight separation, and the Rose/Zhang stretch damaged the back end of the case.",
    "keyJudgmentCalls": [
      [
        "Strawweight title reign",
        "the center of her all-time case."
      ],
      [
        "Technical striking",
        "a major part of the prime-dominance score."
      ],
      [
        "Rose losses",
        "real championship drag and the turning point of the reign."
      ],
      [
        "Zhang fights",
        "add high-level context but also back-end damage."
      ],
      [
        "Division impact",
        "she helped define what elite UFC strawweight looked like."
      ]
    ],
    "finalTakeaway": "Joanna is the strawweight title standard: technically brilliant, historically important, and clearly women’s top-three in this ranking, but capped below the two deeper GOAT cases.",
    "packetStatus": {
      "stage": "packet live; photos and Watch Moment needed",
      "lastUpdated": "2026-07-02",
      "nextFix": "Add Joanna photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/joanna-jedrzejczyk.js",
      "compareFallback": "assets/compare-coverage-pack-2.js"
    },
    "compareProfile": {
      "shortCase": "Joanna is the strawweight standard: elite striking volume, long title control, and one of the most important early women’s UFC championship runs.",
      "peak": "At her best, Joanna was pace, footwork, combinations, takedown defense, and five-round striking pressure. She made elite strawweights fight at a volume they could not match.",
      "resume": "Joanna’s UFC resume is built on a real title reign and technical dominance at strawweight, with later losses keeping the case from matching the top two women.",
      "counter": "Joanna’s argument is divisional standard-setting. She may not have two-division value, but she built the strawweight benchmark.",
      "edge": "Joanna wins comparisons when strawweight title control, technical dominance, and division-defining impact matter most.",
      "eliteCounter": true,
      "signatureWins": "Esparza, Gadelha twice, Penne, Letourneau, Kowalkiewicz, Andrade, and Waterson give Joanna a strong strawweight title-era resume.",
      "weakness": "No two-division value and the Rose/Zhang losses keep her below Nunes and Valentina.",
      "titleSummary": "Joanna’s title case is a historic strawweight reign with repeated defenses and clear division-setting value.",
      "primeSummary": "Her prime was technical and volume-heavy, but the Rose losses sharply ended the clean title-control phase.",
      "titleStyle": "Strawweight Reign Standard",
      "primeStyle": "Technical Volume Prime"
    }
  },
  "Jon Jones": {
    "divisionLabel": "LHW / HW",
    "resumeTag": "UFC benchmark resume",
    "photoUrl": "assets/fighters/jon-jones.webp",
    "thumbUrl": "assets/fighters/jon-jones-thumb.webp",
    "oneLiner": "The benchmark UFC resume: unmatched title-fight success, elite quality wins, long-term dominance, and no true competitive loss.",
    "whyRankedHere": "Jones ranks #1 because he has the strongest UFC championship resume ever, the best title-fight win total, elite wins across multiple eras, and one of the longest elite runs in UFC history. His resume combines championship success, quality wins, prime dominance, and longevity better than anyone else.",
    "whyNotLower": "The main arguments against Jones are close fights, inactivity gaps, late-career sample size at heavyweight, and outside-the-cage controversy. But as a UFC resume, his in-cage case still has the strongest overall combination of title success, elite opponents, dominance, and longevity.",
    "keyJudgmentCalls": [
      [
        "Matt Hamill DQ",
        "not treated as a true competitive loss."
      ],
      [
        "Daniel Cormier NC",
        "not counted as a win, but the broader Cormier rivalry still matters in context."
      ],
      [
        "Heavyweight run",
        "boosts the resume, but does not carry the case by itself."
      ],
      [
        "Close fights",
        "Santos/Reyes slightly affect dominance, but not enough to move him from #1."
      ],
      [
        "Controversy",
        "acknowledged in context, while the profile stays focused on the UFC resume."
      ]
    ],
    "finalTakeaway": "Jones is the UFC benchmark: the deepest championship resume, elite quality wins, rare longevity, and no true competitive loss. He is the 99 OVR standard every other fighter is measured against.",
    "watchUrl": "https://youtube.com/shorts/yG-D2r6HVp4?is=fstX4Wc_rvCITSw0",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/ILOnZDCbmKM?is=YBFWXqGDjc9mpcjR",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "The UFC-only GOAT benchmark: unmatched title-fight volume, elite opponent depth, two-division champion status, and no true competitive UFC loss.",
      "peak": "At his peak, Jon was a matchup nightmare: length, wrestling, clinch damage, creativity, fight IQ, durability, and defensive composure all stacked together. He did not just beat elite light heavyweights; he usually made their strengths look unusable.",
      "resume": "Jon's resume is built on repeated championship wins over elite names across multiple eras, then capped by moving up and winning the heavyweight title. In a UFC-only comparison, his volume of title-level success is the standard everyone else is chasing.",
      "counter": "The case against Jon is cleanliness: late-career performances were less dominant, Gustafsson and Reyes created real debate, the heavyweight sample is thin, and some fans will always hold the official Hamill DQ, no contest, or outside-the-cage issues against the resume.",
      "edge": "Jon's edge is championship volume plus opponent depth. Other fighters may have cleaner stories, prettier peaks, or fewer caveats, but Jon's UFC-only resume has the most total weight.",
      "eliteCounter": true,
      "signatureWins": "Cormier, Gustafsson, Shogun, Machida, Rashad, Rampage, Glover, Belfort, and Gane give Jon a title-level win stack that almost nobody can match.",
      "weakness": "Late-prime dominance dipped, Reyes and Gustafsson created real debate, the heavyweight resume is short, and the Hamill DQ needs context even though this model does not treat it as a true competitive loss.",
      "titleSummary": "UFC light heavyweight champion, UFC heavyweight champion, and the strongest UFC title-fight resume in the system.",
      "primeSummary": "Long prime built around elite control, adaptability, durability, and the ability to beat championship-level opponents in different styles of fights.",
      "titleStyle": "Championship Volume King",
      "primeStyle": "Matchup Nightmare",
      "primeNote": "multi-era elite run from young light heavyweight champion to later heavyweight title winner",
      "bestArgument": "Jon's best argument is total UFC-only weight: the deepest title-fight resume, elite opponent depth across eras, two-division champion value, and no true competitive UFC loss.",
      "hamillContext": "The Matt Hamill DQ is official, but this ranking does not treat it as a true competitive loss.",
      "cleanResumeCounter": "GSP, Khabib, and DJ can argue cleaner resumes in different ways; Jon's answer is that his championship volume and opponent depth still carry more total UFC-only weight.",
      "betterFighterVsGoat": "Skill-for-skill debates can get closer, but the UFC-only GOAT resume benchmark remains Jon because of title volume, opponent depth, and multi-era championship success."
    },
    "categories": {},
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Jon. Migrate GSP next."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/jon-jones.webp and assets/fighters/jon-jones-thumb.webp"
    }
  },
  "Jose Aldo": {
    "divisionLabel": "FW / BW",
    "resumeTag": "Scope-affected legend",
    "photoUrl": "assets/fighters/jose-aldo.webp",
    "thumbUrl": "assets/fighters/jose-aldo-thumb.webp",
    "oneLiner": "A UFC-only legend with real title value and longevity, but not a clean top-10 case once WEC is excluded and the McGregor/Holloway/Volk damage is counted.",
    "whyRankedHere": "Aldo ranks in the top-15 range because the UFC-only model still respects his title work, quality wins, and ability to stay relevant across featherweight and bantamweight. He is a real legend, but the app no longer treats him like a clean top-10 UFC-only resume.",
    "whyNotHigher": "The UFC-only boundary hurts him because his full historical peak includes WEC. Inside the UFC-only scoring window, the McGregor KO, Holloway TKO losses, Volkanovski loss, and uneven back half make him too damaged for the top ten.",
    "keyJudgmentCalls": [
      [
        "UFC-only scope",
        "means the all-time WEC case is context only, not scored directly."
      ],
      [
        "Title value",
        "his UFC title defenses still matter, but inheriting the belt from the WEC transition is treated with some context."
      ],
      [
        "Loss context",
        "McGregor and both Holloway losses are counted as finished losses in the prime/late-prime window; Volkanovski is counted as elite decision damage."
      ],
      [
        "Longevity",
        "the bantamweight resurgence helps, but it no longer gets max-style elite continuity credit."
      ],
      [
        "Prime dominance",
        "is strong historically, but the UFC-only version is not clean enough for top-10 treatment."
      ]
    ],
    "finalTakeaway": "Aldo is a scope-affected legend: historically massive, still very strong in UFC-only scoring, but more believable around the top-14/top-15 range than as a top-10 UFC-only GOAT.",
    "watchUrl": "https://youtube.com/shorts/BC0MG13fz20?is=3YJEJvXqUfyAMg6W",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/K63PJBKuA4U?is=DDLXv7eVTA8Bjewm",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Aldo is a scope-affected UFC-only legend: strong title value, real longevity, and quality wins, but not the same case he has when WEC is included.",
      "peak": "At his best historically, Aldo was explosive, technical, and difficult to pressure cleanly. In UFC-only scoring, that peak is partially outside the model, so the app grades him more conservatively.",
      "resume": "Aldo’s resume in this ranking is strong but complicated. His WEC run is historical context, while the scored UFC portion still has title value and longevity but carries major McGregor/Holloway/Volk damage.",
      "counter": "Aldo’s argument is historical greatness plus longevity. If WEC is included, his case jumps. In this UFC-only ranking, that context is respected but not scored directly.",
      "edge": "Aldo wins debates when the opponent has weaker championship proof or less sustained elite relevance. He loses more often when the opponent has a cleaner UFC-only prime or stronger modern quality wins.",
      "scope": "Aldo’s WEC greatness matters historically, but this ranking only scores his UFC resume. That keeps the ranking consistent even if it underrates his full career legacy.",
      "eliteCounter": true,
      "signatureWins": "Edgar, Mendes, Korean Zombie, Lamas, Stephens, Moicano, Vera, and Font give Aldo real scored value even with the WEC run treated as historical context.",
      "titleSummary": "Aldo’s UFC title case is strong but incomplete without historical context because part of his legendary reign happened in WEC before the scored UFC window.",
      "primeSummary": "Aldo’s broader prime was long and legendary, while the UFC-only scored version is damaged by three finished losses and the Volkanovski decision.",
      "titleStyle": "Scope-Affected Legend",
      "primeStyle": "Damaged UFC-Only Prime",
      "primeNote": "long broader featherweight prime, with UFC value continuing into his bantamweight run",
      "weakness": "UFC-only scope limits his full historical case, and the McGregor/Holloway/Volk stretch keeps the resume from looking like a top-10 UFC-only case."
    },
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-05",
      "nextFix": "UFC-only ranking tone rebalanced after Aldo top-10 sanity pass."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/jose-aldo.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/jose-aldo.webp and assets/fighters/jose-aldo-thumb.webp"
    }
  },
  "Josh Koscheck": {
    "compareProfile": {
      "shortCase": "Koscheck is the durable TUF-era welterweight contender: elite wrestling, improved power, a title shot, and a long run below championship level.",
      "peak": "Explosive wrestling, physical top control, a dangerous right hand, and toughness defined his best version.",
      "resume": "The UFC resume has strong volume and several ranked-level wins, but the GSP losses create clear separation.",
      "counter": "He never won UFC gold and lost the fights that could have elevated him historically.",
      "edge": "He wins volume, wrestling, durability, and sustained-contender comparisons.",
      "eliteCounter": false,
      "signatureWins": "Matt Hughes, Anthony Johnson, Paul Daley, Diego Sanchez, Chris Lytle, Frank Trigg, and Thiago Alves.",
      "titleSummary": "One UFC title loss to Georges St-Pierre.",
      "primeSummary": "A strong wrestling-and-power contender prime below GSP's tier.",
      "titleStyle": "tufEraTitleChallenger",
      "primeStyle": "wrestlingPowerContender"
    },
    "oneLiner": "A durable TUF-era wrestler who lived just below championship level.",
    "photoStatus": "pending-real-files"
  },
  "Julianna Peña": {
    "watchUrl": "https://youtube.com/shorts/l7vgw_69nvI?si=0PD-rPVHC9VbnoUE",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/tB_Xg1LbMVQ?is=cMc6BXC1LV3u8rJa",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "WBW",
    "resumeTag": "Nunes upset champion",
    "oneLiner": "A two-time UFC bantamweight champion with one of the biggest title upsets ever, balanced by no defenses and rough elite losses.",
    "whyRankedHere": "Peña scores this high because beating Amanda Nunes for the belt is a gigantic UFC-only title result, and the Pennington title win gives her a second championship point.",
    "whyNotHigher": "She does not rank higher because she has zero defenses, the Nunes rematch was decisive, and the Kayla/Valentina/GDR losses keep the dominance case low.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "Nunes = 1.00; Pennington = 0.75 due to disputed split decision."
      ],
      [
        "Quality Wins",
        "Nunes gets rare 1.25 title-win exception."
      ],
      [
        "Prime window",
        "Prime/title window starts at Sara McMann and runs through Kayla."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Title-result value",
        "Championship score is strong despite low dominance."
      ],
      [
        "Disputed Pennington win",
        "Counts as a title win but discounted."
      ],
      [
        "No defenses",
        "Capped below sustained champion cases."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.5,
      "window": "Nunes title upset",
      "components": {
        "peakStatus": 1.15,
        "eliteOpponentProof": 1.25,
        "separationDominance": 0.55,
        "divisionStrength": 0.8,
        "cleanApexAura": 0.75
      },
      "notes": "The Nunes upset maxes aura, but low dominance prevents a bigger peak total."
    },
    "primeDominanceSummary": {
      "score": 13.25,
      "components": {
        "primeRecord": 3.45,
        "primeRoundsWon": 2.75,
        "titleDefenseDominance": 0,
        "finishStoppageDominance": 2.8,
        "lossSafetyDurability": 2.55,
        "divisionStrength": 1.7
      },
      "notes": "The title results are better than the round-to-round control."
    },
    "finalTakeaway": "Peña is weird but necessary: a huge UFC championship resume without a clean dominance resume.",
    "packetStatus": {
      "stage": "complete first-pass packet; bantamweight title case, win ledger, loss context, compare seasoning, fight ledger, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/julianna-pena.js",
      "centralPacket": "assets/data/fighter-packets/julianna-pena.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Peña is the giant-upset title case: she beat Amanda Nunes and later won a second UFC bantamweight title.",
      "peak": "At her apex, Peña broke one of the greatest UFC champions ever with pressure and grappling.",
      "resume": "The title results are enormous, but the control profile and loss context are not clean.",
      "counter": "The counter is dominance: no defenses, decisive rematch loss, and Kayla loss.",
      "edge": "Peña wins comparisons when title-result shock value matters more than clean dominance.",
      "eliteCounter": true,
      "signatureWins": "Amanda Nunes, Raquel Pennington, Cat Zingano, Sara McMann.",
      "weakness": "No defenses and damaging elite losses.",
      "titleSummary": "Two-time UFC bantamweight champion with 1.75 adjusted title wins.",
      "primeSummary": "Title/elite phase from McMann through Kayla.",
      "bestArgument": "She owns one of the biggest UFC title wins ever.",
      "titleStyle": "Nunes Upset Champion",
      "primeStyle": "Title-Result Chaos Case"
    },
    "photoUrl": "assets/fighters/julianna-pena.webp",
    "thumbUrl": "assets/fighters/julianna-pena-thumb.webp"
  },
  "Junior dos Santos": {
    "displayName": "Junior “Cigano” dos Santos",
    "profileDisplayName": "Junior “Cigano” dos Santos",
    "resumeTag": "Heavyweight knockout king",
    "watchUrl": "https://youtube.com/shorts/Lj6I1i8V0-Y?si=SCGyTCBodnA4CkbE",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/zj_IMcTmcNU?is=IrloHxxSgOE9Q_pR",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "HW",
    "oneLiner": "A UFC heavyweight champion with a historic nine-fight rise, elite Cain/Werdum/Stipe wins, and a ceiling capped by the Cain rematches.",
    "whyRankedHere": "Dos Santos ranks here because the heavyweight win ledger is excellent: Cain, Werdum, Stipe, Mir, Carwin, Hunt, Lewis, Rothwell, Nelson, and more. He has enough championship value and peak danger to clear most thin-title cases.",
    "whyNotHigher": "He does not rank higher because the reign was short, he only has one defense, and Cain clearly won the rivalry with two damaging title-fight losses. The late-career losses are mostly post-prime, but they do not add value either.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "Cain title win is 1.00; Mir defense is 0.85. No title result goes above 1.00."
      ],
      [
        "Quality Wins cap",
        "Cain, Werdum, and Stipe are full 1.00 quality wins, not above-cap title bumps."
      ],
      [
        "Prime start",
        "Prime starts immediately at Werdum because that UFC debut win is too important to treat as developmental."
      ],
      [
        "Prime end",
        "Prime runs through Stipe I, with Overeem treated as late-prime counted damage."
      ],
      [
        "Late skid",
        "Stipe II, Ngannou, Blaydes, Rozenstruik, and Gane are post-prime decline and do not add loss penalty."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Cain rivalry",
        "JDS owns the explosive title win, but Cain owns the rivalry and caps the all-time case."
      ],
      [
        "Werdum win",
        "Full 1.00 quality credit because it aged into elite heavyweight proof."
      ],
      [
        "Mir defense",
        "Real title defense, but 0.85 adjusted credit rather than max-defense value."
      ],
      [
        "Heavyweight context",
        "Heavyweight volatility gives danger credit but not lightweight-style division-depth credit."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.35,
      "window": "Cain title win through Mir defense and Hunt/Stipe proof",
      "components": {
        "peakStatus": 1.05,
        "eliteOpponentProof": 1.2,
        "separationDominance": 0.85,
        "divisionStrength": 0.6,
        "cleanApexAura": 0.65
      },
      "notes": "Real best-heavyweight-alive claim after Cain/Mir, capped by the Cain rematches."
    },
    "primeDominanceSummary": {
      "score": 19.2,
      "components": {
        "primeRecord": 5.05,
        "primeRoundsWon": 4.4,
        "titleDefenseDominance": 1.9,
        "finishStoppageDominance": 4.1,
        "lossSafetyDurability": 2.1,
        "divisionStrength": 1.65
      },
      "notes": "Scary boxing/KO peak with strong heavyweight division proof, but not a clean dominance reign because Cain solved him twice."
    },
    "finalTakeaway": "Dos Santos is a high-quality heavyweight champion case. He belongs around the Tito/Deiveson tier, with stronger opponent quality than many short-reign champions but less title volume than the bigger reign cases.",
    "packetStatus": {
      "stage": "complete first-pass packet; heavyweight title case, win ledger, loss context, and round-control rows included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/junior-dos-santos.js",
      "centralPacket": "assets/data/fighter-packets/junior-dos-santos.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Dos Santos is the heavyweight win-ledger champion case: Cain, Werdum, Stipe, Mir, Carwin, Hunt, Lewis, and a historic UFC heavyweight rise.",
      "peak": "At his best, JDS had one of the scariest boxing/KO peaks heavyweight has seen in the UFC.",
      "resume": "The resume top end is excellent for heavyweight, but the title reign is short and the Cain rivalry caps the ceiling.",
      "counter": "The counterargument is championship volume: only one defense, and Cain took the belt back decisively.",
      "edge": "Dos Santos wins comparisons when heavyweight opponent quality and KO peak matter more than long title-control volume.",
      "eliteCounter": true,
      "signatureWins": "Cain Velasquez, Fabricio Werdum, Stipe Miocic, Frank Mir, Shane Carwin, Mark Hunt, Derrick Lewis.",
      "weakness": "Short reign, one defense, Cain rematch damage, and late-prime Overeem finish.",
      "titleSummary": "UFC heavyweight champion with one successful title defense and 1.85 adjusted title wins.",
      "primeSummary": "Historic heavyweight rise with elite boxing power, then Cain rivalry cap.",
      "bestArgument": "The best argument is that very few heavyweights in this range have three wins as strong as Cain, Werdum, and Stipe.",
      "titleStyle": "Heavyweight Title Breakthrough",
      "primeStyle": "Boxing Power Apex"
    },
    "photoUrl": "assets/fighters/junior-dos-santos.webp",
    "thumbUrl": "assets/fighters/junior-dos-santos-thumb.webp"
  },
  "Justin Gaethje": {
    "watchUrl": "https://youtube.com/shorts/2LxEazU0vuM?is=tHj1Dxylleh4yGG7",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/c_ZHlvDn4vM?is=2gEXV0uylOlRGzLU",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "LW",
    "resumeTag": "Undisputed lightweight chaos case",
    "oneLiner": "The lightweight chaos case: undisputed UFC gold, two interim-title wins, elite action wins, and enough finish-loss damage to keep the GOAT case capped.",
    "whyRankedHere": "Gaethje ranks here because the UFC-only case now has real championship weight: undisputed lightweight gold, two interim/title-level wins, and a modern lightweight win list built around Topuria, Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, and Johnson.",
    "whyNotHigher": "He does not rank higher because the loss context is still heavy even with the -10 cap. Gaethje has been finished in major prime fights, and one undisputed title win does not erase the Khabib, Oliveira, Max, Poirier, and Alvarez damage against cleaner all-time cases.",
    "bigAssumptions": [
      [
        "Prime start",
        "Tony Ferguson 2020 is treated as the clean title-level UFC breakout."
      ],
      [
        "Title update",
        "The Topuria win counts as undisputed UFC lightweight champion value."
      ],
      [
        "Loss cap",
        "Raw loss damage would exceed -10, but the locked model caps the visible penalty at -10."
      ],
      [
        "Division strength",
        "Modern lightweight gets strong credit, but that same schedule creates a brutal loss-context pile."
      ],
      [
        "Non-UFC resume",
        "WSOF context is historical only and is not scored."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Undisputed title update",
        "the Topuria win gives Gaethje real UFC champion value, not just action-fighter value."
      ],
      [
        "Loss cap",
        "his raw loss damage would go past -10, but the model caps the visible penalty at -10."
      ],
      [
        "Modern lightweight depth",
        "boosts the quality-wins case because this division is treated as one of the hardest UFC environments."
      ],
      [
        "Action style",
        "makes the resume feel huge, but style points do not erase finish losses."
      ],
      [
        "Non-UFC resume",
        "WSOF context is historical only and is not scored."
      ]
    ],
    "finalTakeaway": "Gaethje is now more than the great action-resume test case: the undisputed title win gives him real UFC champion weight, but the loss cap is doing work because the finish-loss pile still keeps him outside the deeper GOAT tier.",
    "packetStatus": {
      "stage": "packet live; undisputed title update; Watch Moment added; photos needed",
      "lastUpdated": "2026-07-02",
      "nextFix": "Add Gaethje photos. Move raw row into ranking-data.js if permanent."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-patches.js runtime add-on for first test fighter",
      "centralPacket": "assets/data/fighter-packets/justin-gaethje.js",
      "displayFallback": "assets/data/display-overrides.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "Add assets/fighters/justin-gaethje.webp and assets/fighters/justin-gaethje-thumb.webp when real files exist."
    },
    "compareProfile": {
      "shortCase": "Gaethje is the undisputed lightweight chaos case: real UFC gold, two interim-title wins, elite lightweight schedule strength, huge action wins, and a loss profile that keeps him below cleaner champions.",
      "peak": "At his best, Gaethje is pressure, leg kicks, durability, scrambling, and fight-ending power. The Topuria win adds the missing undisputed-title proof to a resume that was already dangerous.",
      "resume": "The UFC resume is deep and loud. Topuria, Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, Johnson, and title-level moments give him a serious modern lightweight lane.",
      "counter": "Gaethje’s counterargument in debates is that his schedule was brutal and his best wins are better than some cleaner records. The Topuria win strengthens that argument a lot.",
      "edge": "Gaethje wins comparisons when modern lightweight strength, action-fight resume, high-end win quality, and undisputed title value matter more than clean title reign length.",
      "eliteCounter": true,
      "signatureWins": "Topuria, Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, and Johnson give Gaethje one of the loudest modern lightweight resumes outside the top tier.",
      "weakness": "The finish-loss pile is the ceiling. Khabib, Oliveira, Max, Poirier, and Alvarez losses mean the -10 penalty cap is doing real work.",
      "titleSummary": "Gaethje’s title case now includes undisputed lightweight gold plus two interim/title-level wins, but not a long reign.",
      "primeSummary": "His prime is explosive and high-impact, but it is not clean. He could end elite fighters, but elite fighters also finished him.",
      "titleStyle": "Undisputed Lightweight Chaos Champion",
      "primeStyle": "Violent Action Prime"
    },
    "photoUrl": "assets/fighters/justin-gaethje.webp",
    "thumbUrl": "assets/fighters/justin-gaethje-thumb.webp"
  },
  "Kamaru Usman": {
    "photoUrl": "assets/fighters/kamaru-usman.webp",
    "thumbUrl": "assets/fighters/kamaru-usman-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/IESw7PEdMVo?is=okf-XopaawJFybfz",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/IRUrK8BhjNE?is=1RKIKERb2j7zdgag",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Usman is the great welterweight champion of the post-GSP era: dominant title run, elite round control, strong defenses, and one of the best championship peaks in the ranking.",
      "peak": "At his best, Usman was a suffocating champion with pressure, wrestling threat, cardio, clinch control, and improving power that made him feel like the clear best welterweight in the world.",
      "resume": "Usman’s resume is built on championship authority. He ruled welterweight, defended repeatedly, and beat top contenders during a strong modern era.",
      "counter": "Usman’s argument is champion peak. If the debate is who looked more in control at the top, Usman has a real lane.",
      "edge": "Usman wins when championship peak, round control, and title-defense authority outweigh longer but less dominant resumes.",
      "eliteCounter": true,
      "signatureWins": "Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give Usman a strong modern welterweight ledger.",
      "titleSummary": "Usman’s title case is a strong modern welterweight reign with repeated defenses and real champion authority, even if the ending got damaged by Edwards.",
      "primeSummary": "His prime was excellent but tighter than GSP’s or Holloway’s: a dominant title window rather than a decade-long all-time run.",
      "titleStyle": "Modern Title Authority",
      "primeStyle": "Dominant Focused Prime",
      "primeNote": "dominant but focused welterweight title window rather than a decade-long elite run",
      "weakness": "The Edwards losses hurt the clean ending, and the elite window is more compact than the longer all-time cases."
    },
    "divisionLabel": "WW / MW",
    "resumeTag": "Modern welterweight title authority",
    "oneLiner": "The post-GSP welterweight champion case: dominant title control, elite round winning, and a focused but powerful championship peak.",
    "whyRankedHere": "Usman ranks #10 because his welterweight title run had real champion authority. He paired elite round control with strong defenses and quality wins over the best contenders of his era.",
    "whyNotHigher": "He does not rank higher because his elite window is more compact than the long-volume cases, and the Edwards losses damaged the clean ending. His peak was elite, but the total UFC resume is not as broad as the names above him.",
    "keyJudgmentCalls": [
      [
        "Championship peak",
        "the title run is the center of his case."
      ],
      [
        "Round control",
        "his prime round-winning profile is one of his biggest strengths."
      ],
      [
        "Edwards losses",
        "the finish loss creates real drag even though Edwards is elite."
      ],
      [
        "Modern welterweight context",
        "Woodley, Covington, Burns, Masvidal, Edwards, and RDA give the resume quality."
      ],
      [
        "Middleweight fight",
        "adds context, but welterweight carries the ranking."
      ]
    ],
    "finalTakeaway": "Usman is the focused modern welterweight champion case: high-end title control, strong elite wins, and a peak that was better than the total volume of his resume.",
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Usman. Continue mid-board packet cleanup."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/kamaru-usman.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/kamaru-usman.webp and assets/fighters/kamaru-usman-thumb.webp"
    }
  },
  "Kayla Harrison": {
    "watchUrl": "https://youtube.com/shorts/iwq5RYsEmj0?si=xNAgtq1-FjeI4ozO",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/UUMlLth-4uQ?is=ZmRXsN5bIzaY1_rq",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "WBW",
    "resumeTag": "Bantamweight title force",
    "oneLiner": "A current UFC bantamweight champion with dominant grappling control and a perfect UFC record, but only three UFC fights keep the score capped.",
    "whyRankedHere": "Harrison scores as a real UFC champion because she beat Peña for the belt, dominated Holm, beat Vieira, and has no UFC loss penalty.",
    "whyNotHigher": "The cap is pure UFC volume. She has only three UFC fights, one title-fight win, and zero defenses. PFL and Olympic greatness are context only and cannot carry the UFC-only score.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "Peña title win is 1.00 because it was a clean undisputed title win over the reigning champion."
      ],
      [
        "Quality Wins cap",
        "Peña is 1.00. Vieira and Holm are 0.80 each; Holm is timing-discounted."
      ],
      [
        "Prime window",
        "Prime starts immediately at Holly Holm because the UFC debut was title-relevant."
      ],
      [
        "Non-UFC exclusion",
        "Olympic gold medals, PFL title runs, and Pacheco loss are context only, not scored."
      ],
      [
        "Nunes fight",
        "Amanda Nunes is not scored because the fight has not happened."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Tiny UFC sample",
        "Dominance is real, but Quality Wins and Longevity stay low because the UFC resume is only three fights."
      ],
      [
        "Current WBW strength",
        "Women’s bantamweight is historically important but not max-depth in this current window."
      ],
      [
        "Clean loss context",
        "No UFC losses means no penalty."
      ],
      [
        "Dominance vs volume",
        "She gets strong Prime Dominance, but the total score stays capped by UFC-only volume."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.85,
      "window": "Holm debut through Peña title win",
      "components": {
        "peakStatus": 1.05,
        "eliteOpponentProof": 0.9,
        "separationDominance": 0.95,
        "divisionStrength": 0.35,
        "cleanApexAura": 0.6
      },
      "notes": "Harrison has a real current-champion peak claim and dominant control, but the UFC sample is too small and current bantamweight depth is not max strength."
    },
    "primeDominanceSummary": {
      "score": 17.7,
      "components": {
        "primeRecord": 4,
        "primeRoundsWon": 4.75,
        "titleDefenseDominance": 0,
        "finishStoppageDominance": 3.6,
        "lossSafetyDurability": 4,
        "divisionStrength": 1.35
      },
      "notes": "Perfect UFC record and strong control create a high dominance score, but no title-defense stack keeps it from getting into long-reign territory."
    },
    "finalTakeaway": "Kayla is a dangerous current-champion UFC-only case: dominant and clean, but still waiting on the title-defense volume that would push her higher.",
    "packetStatus": {
      "stage": "complete first-pass packet; UFC bantamweight title case, win ledger, loss context, round-control rows, compare seasoning, fight ledger, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/kayla-harrison.js",
      "centralPacket": "assets/data/fighter-packets/kayla-harrison.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Harrison is the clean short-window champion case: dominant UFC grappling, a Peña title win, Holm/Vieira support, and no UFC losses.",
      "peak": "At her best in the UFC, Harrison has looked physically overwhelming with top-control, judo entries, and submission threat.",
      "resume": "The UFC resume is tiny but clean. The model rewards the title win and dominance while heavily capping non-UFC accomplishments.",
      "counter": "The counterargument is simple: three UFC fights is not enough volume to compete with long-reign UFC champions yet.",
      "edge": "Harrison wins comparisons when clean dominance, no UFC losses, and current-title value outweigh resume volume.",
      "eliteCounter": false,
      "signatureWins": "Julianna Peña, Ketlen Vieira, Holly Holm.",
      "weakness": "Only three UFC fights and zero title defenses.",
      "titleSummary": "One-time UFC bantamweight champion with one official and adjusted title-fight win.",
      "primeSummary": "3-0 UFC prime from Holm through Peña/current champ phase.",
      "bestArgument": "The best argument is that every UFC data point so far points to elite champion-level dominance.",
      "titleStyle": "Short-Window Bantamweight Champion",
      "primeStyle": "Dominant Grappling Arrival"
    },
    "photoUrl": "assets/fighters/kayla-harrison.webp",
    "thumbUrl": "assets/fighters/kayla-harrison-thumb.webp"
  },
  "Khabib Nurmagomedov": {
    "divisionLabel": "LW",
    "resumeTag": "Prime dominance case",
    "photoUrl": "assets/fighters/khabib-nurmagomedov.webp",
    "thumbUrl": "assets/fighters/khabib-nurmagomedov-thumb.webp",
    "oneLiner": "The cleanest prime run at lightweight: unbeaten in the UFC, overwhelming round control, and the strongest dominance case in this ranking.",
    "whyRankedHere": "Khabib ranks #6 because his prime-dominance score is the strongest in the current scoring model. He combined elite control, round winning, and a perfect UFC record, giving him one of the hardest peaks to challenge in this ranking.",
    "whyNotHigher": "He does not climb higher because the current scoring model gives him less championship volume and fewer quality-wins layers than the fighters above him. His peak is elite enough to compete with anyone, but his total UFC resume is shorter.",
    "keyJudgmentCalls": [
      [
        "Prime dominance",
        "the clearest strength of the Khabib case and the best score in this ranking."
      ],
      [
        "No UFC losses",
        "helps keep the resume unusually clean."
      ],
      [
        "Lightweight strength",
        "matters positively because his best work came in an elite division."
      ],
      [
        "Short title run",
        "keeps the championship category lower than the all-time leaders."
      ],
      [
        "Pre-prime wins",
        "still matter for record and context, but the core scoring window starts around Rafael dos Anjos."
      ]
    ],
    "finalTakeaway": "Khabib is the lightweight prime-dominance benchmark: unbeatable at his best, extremely efficient, and held back only by shorter championship volume than the names above him.",
    "watchUrl": "https://youtube.com/shorts/VqN3MN87_FU?is=O2pn1pdk6aS9aqo2",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/JuBBIJ7adjM?is=0QlHyjPjkzpsQGXL",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Khabib is the cleanest peak-dominance case: unbeaten, overwhelming, and almost never in real trouble once he reached elite lightweight level.",
      "peak": "At his best, Khabib was the strongest control fighter in the sport. Everyone knew the game plan, and almost nobody had answers for it.",
      "resume": "Khabib’s resume is short compared with the biggest title-volume cases, but it is incredibly clean: no losses, elite lightweight wins, and a final stretch that felt dominant and complete.",
      "counter": "Khabib’s argument against almost anyone is purity. No losses, no real collapse, no post-prime damage, and one of the clearest primes ever.",
      "edge": "Khabib wins when the debate rewards dominance, perfection, and how unbeatable a fighter looked at his best.",
      "eliteCounter": true,
      "signatureWins": "RDA, Barboza, McGregor, Poirier, and Gaethje give Khabib a compact but extremely high-quality lightweight resume.",
      "bestArgument": "Khabib’s best argument is purity: no UFC losses, no real collapse, and a final stretch that looked like total separation from elite lightweights.",
      "againstLongReign": "Against deeper champions, Khabib makes the debate uncomfortable because his peak was cleaner and more dominant than almost anyone else’s.",
      "titleSummary": "Khabib’s title resume is compact, but his defenses came against elite lightweights and he retired unbeaten on top.",
      "primeSummary": "His prime run from RDA through Gaethje was one of the cleanest dominance stretches ever: short compared with long-reign champions, but almost flawless.",
      "titleStyle": "Perfect Compact Reign",
      "primeStyle": "Unbeaten Peak",
      "primeNote": "shorter than the long-reign champions, but nearly flawless from RDA through Gaethje",
      "weakness": "The drag is not quality of prime; it is volume. The title reign is shorter, the title-fight count is lower, and the resume has fewer layers than the long-reign GOAT cases."
    },
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Khabib. Migrate Islam Makhachev next."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/khabib-nurmagomedov.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/khabib-nurmagomedov.webp and assets/fighters/khabib-nurmagomedov-thumb.webp"
    }
  },
  "Khamzat Chimaev": {
    "displayName": "Khamzat “Borz” Chimaev",
    "profileDisplayName": "Khamzat “Borz” Chimaev",
    "resumeTag": "Short elite-title monster",
    "watchUrl": "https://youtube.com/shorts/R8M89h0Y8qs?si=o2TK7J9c2YPcX3sy",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/P1Yl0iKipxs?is=3xlsp_uGjj6i2W07",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "MW / WW",
    "oneLiner": "A short but explosive UFC-only case: DDP title value, Whittaker/Burns elite proof, scary dominance, and one Strickland title-loss cap.",
    "whyRankedHere": "Chimaev ranks here because the peak is loud: a current-table UFC title win, elite wins over Whittaker and Burns, a strong Usman result, and one of the most dominant grappling profiles in this tier.",
    "whyNotHigher": "He does not rank higher because the UFC-only resume is still short: one title-fight win, no defenses, a short elite clock, and the Strickland title loss breaks the clean undefeated-aura version of the case.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "One normal title win equals 1.00 adjusted title win. Dominance is credited in Prime Dominance and Apex Peak, not by inflating adjusted title wins."
      ],
      [
        "Quality Wins cap",
        "Whittaker and Burns are capped at 1.00 as elite top-5 contender wins. DDP reaches 1.25 only as the rare reigning-champion title-win exception."
      ],
      [
        "Prime window",
        "The elite clock starts at Gilbert Burns, not the early UFC squash-win run."
      ],
      [
        "Current-table scope",
        "Uses the current scoring-table version with a DDP title win and a Strickland title loss."
      ],
      [
        "Round control",
        "Round rows are best-effort and should be audited during the next full scoring rebuild."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "DDP title win",
        "Championship value is real, but adjusted title wins stay at 1.00 because it is one title win."
      ],
      [
        "Whittaker and Burns",
        "Both are elite/top-5 wins, but they do not go above 1.00 in Quality Wins."
      ],
      [
        "Usman win",
        "Strong name and skill proof, discounted for short-notice/up-weight/timing context."
      ],
      [
        "Strickland loss",
        "Clean loss-context profile because it is a decision title loss, not a finish."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.75,
      "window": "Robert Whittaker 2024 through Dricus du Plessis current-table title win",
      "components": {
        "peakStatus": 1.1,
        "eliteOpponentProof": 1.4,
        "separationDominance": 1.1,
        "divisionStrength": 0.65,
        "cleanApexAura": 0.5
      },
      "notes": "Huge apex proof from Whittaker/DDP/Burns, capped by the current-table Strickland loss and short title run."
    },
    "primeDominanceSummary": {
      "score": 22,
      "components": {
        "primeRecord": 5.8,
        "primeRoundsWon": 5.35,
        "titleDefenseDominance": 1.2,
        "finishStoppageDominance": 4.35,
        "lossSafetyDurability": 3.7,
        "divisionStrength": 1.6
      },
      "notes": "This is the argument: elite control, finish threat, and very little bad loss damage, with short title-defense volume as the cap."
    },
    "finalTakeaway": "Chimaev is a peak-and-dominance case more than a deep-resume case. He belongs above most short-window contenders, but below fighters with more title-fight volume and longer elite UFC resumes.",
    "packetStatus": {
      "stage": "complete first-pass packet; corrected title-win and Quality Wins caps; round-control rows included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/khamzat-chimaev.js",
      "centralPacket": "assets/data/fighter-packets/khamzat-chimaev.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Chimaev is the scary short-window title case: DDP title value, Whittaker and Burns elite proof, Usman name value, and huge grappling dominance.",
      "peak": "At his best, Chimaev can make elite fighters look stuck under an avalanche of wrestling, pressure, and front-loaded danger.",
      "resume": "The resume top end is strong, but the depth falls off quickly after DDP, Whittaker, Burns, and Usman.",
      "counter": "The counterargument is short resume: not enough title fights, not enough elite years, and not enough volume yet.",
      "edge": "Chimaev wins comparisons when dominance and best-version danger matter more than long resume volume.",
      "eliteCounter": true,
      "signatureWins": "Dricus du Plessis, Robert Whittaker, Gilbert Burns, Kamaru Usman, Li Jingliang, Kevin Holland.",
      "weakness": "Short elite window, no defenses, thin depth after the top wins, and the Strickland title-loss cap.",
      "titleSummary": "One current-table UFC middleweight title win and one current-table title loss.",
      "primeSummary": "Explosive elite prime with a huge control profile, but not enough title-defense volume yet.",
      "bestArgument": "The best argument is that few fighters in this rank zone have a scarier best version or a cleaner high-end dominance profile.",
      "titleStyle": "Short Title Breakthrough",
      "primeStyle": "Grappling Avalanche Apex"
    },
    "photoUrl": "assets/fighters/khamzat-chimaev.webp",
    "thumbUrl": "assets/fighters/khamzat-chimaev-thumb.webp"
  },
  "Leon Edwards": {
    "watchUrl": "https://youtube.com/shorts/dDslAGcA7K8?is=XSzqPg0nDKPg-Drv",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/cBa12HbgdpA?is=394cct3V_dK5UMpz",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "eliteCounter": true,
      "signatureWins": "Usman twice, Covington, dos Anjos, Cerrone, and Luque give Edwards a strong welterweight title-era resume.",
      "primeNote": "shorter title window, but the Usman rivalry gives it major championship weight"
    },
    "oneLiner": "A patient welterweight champion whose two victories over Kamaru Usman, three title-fight wins, and long ranked ledger created a serious modern resume.",
    "whyRankedHere": "Edwards ranks here because he paired a long climb through the welterweight rankings with championship proof at the very top. He dethroned Kamaru Usman with one of the sport’s greatest late knockouts, beat him again over five rounds, defended against Colby Covington, and accumulated eleven ranked UFC wins across a durable elite run.",
    "whyNotHigher": "He does not rank higher because the reign stopped at three title-fight wins, his finishing rate is modest, and the Belal Muhammad title loss followed by the Sean Brady submission weakened the back end of the prime. His resume is deep, but it lacks the title volume and sustained control of the welterweight legends above him.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/leon-edwards.js",
      "displayFallback": "assets/data/fighter-packets/leon-edwards.js"
    },
    "photoUrl": "assets/fighters/leon-edwards.webp",
    "thumbUrl": "assets/fighters/leon-edwards-thumb.webp"
  },
  "Lyoto Machida": {
    "displayName": "Lyoto “The Dragon” Machida",
    "profileDisplayName": "Lyoto “The Dragon” Machida",
    "resumeTag": "Short-reign champion apex",
    "watchUrl": "https://youtube.com/shorts/egQH6YZhYE8?is=dPiUxTvLAK3X4qu6",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/P9IrK0Dflb4?is=5Lu2paN2r1OvY6Nk",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Machida is a short-reign champion with a real apex: Rashad title win, Shogun official defense, Mousasi, Bader, Hendo, Thiago Silva, and one of the most distinct defensive striking primes in UFC history.",
      "peak": "At his best, Machida looked like a puzzle the division had not solved yet: elusive, explosive, low-damage, and dangerous in sudden finishing moments.",
      "resume": "The resume has excellent top-end wins, but the depth is not as strong as the long-reign or murderers-row lightweight cases.",
      "counter": "The counterargument is that the Machida Era was short, Shogun solved him quickly, and the prime loss column is too loud.",
      "edge": "Machida wins comparisons when apex aura, defensive skill, and undisputed title value matter more than long-reign volume.",
      "eliteCounter": true,
      "signatureWins": "Rashad Evans, Mauricio Rua, Gegard Mousasi, Ryan Bader, Dan Henderson, Thiago Silva, Mark Munoz, Randy Couture, Vitor Belfort.",
      "titleSummary": "Won the UFC light heavyweight title and made one official defense, with Shogun I discounted for controversy.",
      "primeSummary": "Short but real apex, then a longer title/elite window across light heavyweight and middleweight.",
      "titleStyle": "Short-Reign LHW Champion",
      "primeStyle": "Karate Apex Puzzle",
      "weakness": "Short reign, controversial defense, and heavy prime losses to Shogun, Rampage, Jones, Davis, and Weidman.",
      "bestArgument": "Machida’s best UFC window felt bigger than the raw title count, and the scoring gives him controlled apex credit without overrating the reign."
    },
    "oneLiner": "The Machida Era was short, but real: UFC light heavyweight gold, a scary apex, and elite wins across LHW and MW — capped by a short reign and loud prime losses.",
    "photoStatus": "pending-real-files",
    "divisionLabel": "LHW / MW",
    "whyRankedHere": "Machida ranks here because his UFC-only case has real championship value, a memorable best-in-the-world window, and enough elite wins to sit above most non-champion or thin-title cases.",
    "whyNotHigher": "He does not rank higher because the title reign was short, the Shogun defense is discounted for controversy, and Shogun, Rampage, Jones, Davis, and Weidman create a heavy prime-loss profile.",
    "bigAssumptions": [
      [
        "Quality-win cap",
        "No individual win exceeds 1.25. Rashad is maxed at 1.25 instead of being inflated above the current cap."
      ],
      [
        "Shogun I",
        "Official title defense credit, but discounted because the decision is heavily debated."
      ],
      [
        "Prime window",
        "Prime runs from the Thiago Silva/Rashad title rise through the C.B. Dollaway win. Rockhold and later are treated as post-prime/decline-edge."
      ],
      [
        "Phil Davis loss",
        "Treated as an elite-contender decision loss, not a non-elite penalty."
      ],
      [
        "Round control",
        "Rows are best-effort and should be audited during the next full scoring rebuild."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Rashad title win",
        "Max quality-win credit plus major championship and apex proof."
      ],
      [
        "Short title reign",
        "Two official title-fight wins, but only about 1.65 adjusted title-win credit after the Shogun I discount."
      ],
      [
        "Mousasi win",
        "Strong five-round middleweight win that helps the non-title resume."
      ],
      [
        "Loss context",
        "Prime elite losses are understandable, but the volume is too heavy for a higher GOAT tier."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.25,
      "window": "Thiago Silva 2009 through Shogun Rua I 2009",
      "components": {
        "peakStatus": 1.2,
        "eliteOpponentProof": 1.1,
        "separationDominance": 0.85,
        "divisionStrength": 0.55,
        "cleanApexAura": 0.55
      },
      "notes": "The Machida Era gets real apex credit, but the Shogun rivalry ends the clean-aura argument quickly."
    },
    "primeDominanceSummary": {
      "score": 18.3,
      "components": {
        "primeRecord": 4.4,
        "primeRoundsWon": 4.6,
        "titleDefenseDominance": 1.8,
        "finishStoppageDominance": 3.4,
        "lossSafetyDurability": 2.6,
        "divisionStrength": 1.5
      },
      "notes": "Strong defensive-striking peak and several clean finishes, but title-defense dominance and prime-loss safety keep the score controlled."
    },
    "finalTakeaway": "Machida belongs in the respected former-champion tier: higher than most one-window contenders, below the deeper title-reign and cleaner-resume GOAT cases.",
    "packetStatus": {
      "stage": "complete first-pass packet; corrected Quality Wins cap; round-control rows included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/lyoto-machida.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "photoUrl": "assets/fighters/lyoto-machida.webp",
    "thumbUrl": "assets/fighters/lyoto-machida-thumb.webp"
  },
  "Mackenzie Dern": {
    "watchUrl": "https://youtube.com/shorts/FpPeheMbWcY?si=kpbSu9dKQ_1ZrJnF",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/Gnf14OGq9VY?is=AWeo4KKp08bB0v5k",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Dern is the submission-specialist champion case: elite grappling danger, long strawweight relevance, and a vacant-title breakthrough over Jandiroba.",
      "peak": "At her best, Dern brings immediate submission danger and enough improved striking/cardio to survive deep contender fights.",
      "resume": "The UFC resume has volume and a belt, but the elite-win ceiling is still building. The model rewards the title without pretending the losses disappeared.",
      "counter": "The counterargument is volatility: five UFC losses, no defenses, and no reigning-champion win yet.",
      "edge": "Dern wins comparisons when current-title value, submission threat, and long strawweight activity matter more than clean championship control.",
      "eliteCounter": false,
      "signatureWins": "Virna Jandiroba twice, Amanda Ribas, Tecia Torres, Angela Hill, Loopy Godinez, Nina Nunes.",
      "titleSummary": "One-time UFC strawweight champion with one official title-fight win and 0.90 adjusted title wins.",
      "primeSummary": "9-4 prime from Cifers through current champ phase.",
      "titleStyle": "Vacant-Title Strawweight Champion",
      "primeStyle": "Submission-First Contender Climb",
      "weakness": "Repeated prime contender losses and no UFC title defenses yet.",
      "bestArgument": "The best argument is that Dern is a current UFC champion with one of the strongest submission threats in women’s UFC history."
    },
    "oneLiner": "A current UFC strawweight champion with elite submission danger and real title value, but a volatile contender ledger keeps the UFC-only score grounded.",
    "photoStatus": "pending-real-files",
    "divisionLabel": "SW",
    "resumeTag": "Submission champ climb",
    "whyRankedHere": "Dern scores as a legitimate UFC champion because the Jandiroba title win, submission threat, and long strawweight relevance give her a real UFC-only case.",
    "whyNotHigher": "The score is capped by a vacant-title path, no defenses yet, no reigning-champion win, and repeated prime contender losses to Marina Rodriguez, Yan Xiaonan, Jessica Andrade, and Amanda Lemos.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "Jandiroba II is 0.90 because it was a vacant-title win over an elite contender, not a reigning-champion win."
      ],
      [
        "Apex aura",
        "Apex aura is intentionally only 0.25 / 0.75 because the title moment matters, but it does not create long-reign aura yet."
      ],
      [
        "Prime start",
        "Prime starts at Hannah Cifers in 2020, when the submission run begins."
      ],
      [
        "Prime status",
        "Dern is still treated as current/in-prime, so all UFC losses remain eligible for scoring unless later changed."
      ],
      [
        "BJJ context",
        "Elite grappling resume matters as style context only; non-UFC grappling accomplishments are not scored."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Vacant title credit",
        "The belt is real, but adjusted title credit is below a reigning-champion title win."
      ],
      [
        "Losses stay live",
        "No post-prime cutoff yet, so the Marina/Yan/Andrade/Lemos losses still matter."
      ],
      [
        "Submission dominance",
        "Finish/stoppage dominance is the strongest Prime Dominance input."
      ],
      [
        "Strawweight context",
        "Women’s strawweight is treated as a strong women’s UFC division."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.4,
      "window": "Jandiroba title breakthrough and submission-heavy contender climb",
      "components": {
        "peakStatus": 0.9,
        "eliteOpponentProof": 0.85,
        "separationDominance": 0.65,
        "divisionStrength": 0.75,
        "cleanApexAura": 0.25
      },
      "notes": "Dern gets current-champion peak value and strong division context, but apex aura is deliberately low because the title came through a vacant path and there is no defense/reign stack yet."
    },
    "primeDominanceSummary": {
      "score": 15.2,
      "components": {
        "primeRecord": 4.7,
        "primeRoundsWon": 3.35,
        "titleDefenseDominance": 0,
        "finishStoppageDominance": 3.45,
        "lossSafetyDurability": 1.95,
        "divisionStrength": 1.75
      },
      "notes": "Submission danger is elite, but the 9-4 prime and contender-loss pattern prevent a clean dominance score."
    },
    "finalTakeaway": "Dern is a real UFC champion add, but the model should treat her as a volatile current-title case, not a settled long-reign GOAT case.",
    "packetStatus": {
      "stage": "complete first-pass packet; vacant strawweight title case, win ledger, loss context, round-control rows, compare seasoning, fight ledger, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/mackenzie-dern.js",
      "centralPacket": "assets/data/fighter-packets/mackenzie-dern.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "photoUrl": "assets/fighters/mackenzie-dern.webp",
    "thumbUrl": "assets/fighters/mackenzie-dern-thumb.webp"
  },
  "Matt Hughes": {
    "photoUrl": "assets/fighters/matt-hughes.webp",
    "thumbUrl": "assets/fighters/matt-hughes-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/GmHGebqse1A?is=5ebbOhdaf9CEd8jN",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/W7StRPCtF-E?is=W9q0sloxVcyJN5XW",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Hughes is one of the defining welterweight champions: a physical, title-winning force from the earlier UFC era with real championship volume and a long list of important wins.",
      "peak": "At his best, Hughes was the standard at welterweight: overwhelming grappling, heavy top control, and a title-level style that shaped the division before GSP took over.",
      "resume": "Hughes has real championship depth: title-fight volume, sustained divisional control, and a long run as one of the sport’s defining champions.",
      "counter": "The knock on Hughes is era context. His welterweight run was historically huge, but the division was not as deep or modernized as later welterweight eras.",
      "edge": "Hughes wins when the debate becomes total title weight and sustained divisional control rather than pure peak efficiency.",
      "eliteCounter": true,
      "signatureWins": "GSP, Penn, Royce Gracie, Sherk, Trigg, and Newton give Hughes real championship-era weight at welterweight.",
      "titleSummary": "Hughes has major early-welterweight championship volume and spent years as the face of the UFC welterweight title picture.",
      "primeSummary": "His prime was longer and more title-heavy than many compact-resume fighters, even with era-strength context.",
      "titleStyle": "Early Era Long Reign",
      "primeStyle": "Physical Era Prime",
      "primeNote": "early-era welterweight title control with real reign volume",
      "weakness": "Era context, later losses, and GSP’s eventual separation keep Hughes below the cleaner modern all-time cases."
    },
    "divisionLabel": "WW",
    "resumeTag": "Early welterweight standard",
    "oneLiner": "The early welterweight title-control case: real championship volume, physical dominance, and one of the defining reigns before the GSP era.",
    "whyRankedHere": "Hughes ranks #12 because his UFC welterweight title volume is still meaningful. He spent years as the division standard, stacked title wins, and has enough important victories to remain a serious UFC-only GOAT case.",
    "whyNotHigher": "He does not rank higher because era strength, loss volume, and later separation by GSP cap the case. His championship weight is real, but the modern top-tier resumes are cleaner and deeper.",
    "keyJudgmentCalls": [
      [
        "Early era context",
        "his run was historically huge, but the division was not as deep as later welterweight eras."
      ],
      [
        "GSP rivalry",
        "a win over young GSP matters, but GSP ultimately took the all-time welterweight separation."
      ],
      [
        "Title volume",
        "is the center of the Hughes case and the reason he remains high."
      ],
      [
        "Loss penalty",
        "keeps him below cleaner champions with fewer damaging losses."
      ],
      [
        "UFC-only fit",
        "his main value is already inside the UFC scoring boundary."
      ]
    ],
    "finalTakeaway": "Hughes is the early welterweight standard: title-heavy, physically dominant, historically important, and held back by era context and loss drag.",
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Hughes. Continue mid-board packet cleanup."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/matt-hughes.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/matt-hughes.webp and assets/fighters/matt-hughes-thumb.webp"
    }
  },
  "Mauricio \"Shogun\" Rua": {
    "thumbUrl": "assets/fighters/shogun-rua-thumb.webp",
    "photoUrl": "assets/fighters/shogun-rua.webp",
    "photoNote": "",
    "signatureFightUrl": "https://youtu.be/08YmP1EM2ms?is=gQIDS9i91zPsk3kX",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/F6K-CKBntck?is=heruCDLgIBMrWtQc",
    "watchLabel": "Watch Moment",
    "displayName": "Mauricio “Shogun” Rua",
    "profileDisplayName": "Mauricio “Shogun” Rua",
    "oneLiner": "A violent light-heavyweight champion whose knockout of Lyoto Machida created an elite UFC peak, even though the broader UFC resume was far less consistent than his legend suggests.",
    "whyRankedHere": "Rua ranks here because his best UFC stretch delivered real championship proof. He stopped Chuck Liddell, pushed Lyoto Machida to a disputed decision, knocked Machida out in the rematch to win the belt, and later avenged the Forrest Griffin loss. Those performances create a legitimate Apex and quality-win case despite the uneven total record.",
    "whyNotHigher": "He does not rank higher because this ranking is UFC-only, so his celebrated PRIDE run is excluded. His UFC record is 11-12-1, he won only one title fight, and his counted prime finished 3-3 with damaging losses to Jon Jones and Dan Henderson. The late-career win volume adds context, but it cannot overcome the short championship window and losing overall record.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/mauricio-shogun-rua.js",
      "displayFallback": "assets/data/fighter-packets/mauricio-shogun-rua.js"
    }
  },
  "Maurício \"Shogun\" Rua": {
    "displayName": "Mauricio “Shogun” Rua",
    "profileDisplayName": "Mauricio “Shogun” Rua",
    "signatureFightUrl": "https://youtu.be/08YmP1EM2ms?is=gQIDS9i91zPsk3kX",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/F6K-CKBntck?is=heruCDLgIBMrWtQc",
    "watchLabel": "Watch Moment"
  },
  "Mauricio Rua": {
    "displayName": "Mauricio “Shogun” Rua",
    "profileDisplayName": "Mauricio “Shogun” Rua",
    "signatureFightUrl": "https://youtu.be/08YmP1EM2ms?is=gQIDS9i91zPsk3kX",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/F6K-CKBntck?is=heruCDLgIBMrWtQc",
    "watchLabel": "Watch Moment"
  },
  "Maurício Rua": {
    "displayName": "Mauricio “Shogun” Rua",
    "profileDisplayName": "Mauricio “Shogun” Rua",
    "signatureFightUrl": "https://youtu.be/08YmP1EM2ms?is=gQIDS9i91zPsk3kX",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/F6K-CKBntck?is=heruCDLgIBMrWtQc",
    "watchLabel": "Watch Moment"
  },
  "Max Holloway": {
    "divisionLabel": "FW / LW",
    "resumeTag": "Volume and quality wins",
    "photoUrl": "assets/fighters/max-holloway.webp",
    "thumbUrl": "assets/fighters/max-holloway-thumb.webp",
    "oneLiner": "The volume case: relentless pace, elite quality wins, and one of the longest useful elite windows in the featherweight era.",
    "whyRankedHere": "Holloway ranks #9 because his quality-wins score and longevity score are both elite. Few fighters in this ranking have stacked as many meaningful UFC wins over as long a stretch.",
    "whyNotHigher": "He sits below the very top names because the current scoring model gives him less championship control and more resume drag from total losses. The volume is impressive, but the belt dominance is not on the level of the names above him.",
    "keyJudgmentCalls": [
      [
        "Quality wins",
        "are the clearest strength of the Holloway case and rank #2 in this scoring model."
      ],
      [
        "Longevity",
        "is another major positive because he stayed elite for such a long period."
      ],
      [
        "BMF belt",
        "is not counted as UFC championship credit here."
      ],
      [
        "Loss volume",
        "matters, but much of it came against elite competition, which softens the drag."
      ],
      [
        "Featherweight run",
        "is the core of the profile even though important lightweight fights add context."
      ]
    ],
    "finalTakeaway": "Holloway is the volume-and-quality-wins monster of this ranking: one of the deepest win ledgers in the UFC, backed by real longevity, even without a top-tier championship score.",
    "watchUrl": "https://youtube.com/shorts/z4m1wNoAC7k?is=BRWVC4am_k8yJQzZ",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/5oDsN9s9-yE?is=3pdZSWDbL4y_mzul",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Holloway is the volume king at featherweight: elite durability, huge opponent depth, long-term relevance, and one of the deepest bodies of work in the ranking.",
      "peak": "At his best, Max was pace, boxing, durability, and pressure. He overwhelmed great fighters by turning fights into long, exhausting conversations they could not keep up with.",
      "resume": "Holloway’s resume is built on volume and staying power. He kept beating top-tier names before, during, and after his title reign.",
      "counter": "Max’s argument is total body of work. Even when someone peaked higher, Max often has more elite volume and more proof over time.",
      "edge": "Holloway wins when the debate rewards longevity, opponent volume, durability, and sustained elite relevance.",
      "eliteCounter": true,
      "signatureWins": "Aldo twice, Ortega, Kattar, Yair, Korean Zombie, and Gaethje give Holloway one of the strongest depth arguments in the ranking.",
      "titleSummary": "Holloway’s title case is strong, but his all-time case is even more about volume, elite wins, and relevance before and after the belt.",
      "primeSummary": "Max’s prime and relevance window is unusually long: he stayed elite through multiple phases, even after losing the featherweight title.",
      "titleStyle": "Champion Volume Case",
      "primeStyle": "Long Elite Volume",
      "primeNote": "one of the longest elite windows in the ranking, with major value before and after the belt",
      "weakness": "The Volk trilogy blocks the clean featherweight supremacy argument, and the total loss count keeps him out of the top tier."
    },
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-03",
      "nextFix": "Title-fight wins audited to literal UFC championship title-fight wins."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/max-holloway.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-data.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/max-holloway.webp and assets/fighters/max-holloway-thumb.webp"
    }
  },
  "Merab Dvalishvili": {
    "photoUrl": "assets/fighters/merab-dvalishvili.webp",
    "thumbUrl": "assets/fighters/merab-dvalishvili-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/v8qciKt0g9Y?is=9I22lnhlQVqsQyQT",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/VazxJSDXUs4?is=k9w1Cx8ybdudP3qR",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Merab is the modern bantamweight pressure-and-longevity case: endless pace, elite control, a deep contender run, and a championship profile tied closely to the Yan rivalry.",
      "peak": "At his best, Merab turns fights into a cardio and wrestling test almost nobody can keep up with. The pace, chain wrestling, and control volume are the whole problem.",
      "resume": "Merab’s resume is built on modern bantamweight depth. Yan, Cejudo, Aldo, O’Malley, Umar, and other ranked wins give him a serious current-era case.",
      "counter": "Merab’s argument is depth and pace. Even with Yan context, the broader modern bantamweight schedule makes his case stronger than a simple title-loss read suggests.",
      "edge": "Merab wins comparisons when modern division depth, pace, wrestling control, and active elite consistency matter most.",
      "eliteCounter": true,
      "signatureWins": "Yan, Cejudo, Aldo, Moraes, O’Malley, Umar, and ranked bantamweight wins give Merab one of the strongest modern 135-pound ledgers.",
      "titleSummary": "Merab’s title case is a major modern bantamweight run, but the rivalry context keeps it from being a simple long-reign champion story.",
      "primeSummary": "His prime is a pressure-control prime: less about finishes, more about making elite opponents fight his pace for five rounds.",
      "titleStyle": "Modern Bantamweight Pace Champion",
      "primeStyle": "Pressure-Control Prime",
      "weakness": "The title run is still young, and the Yan rivalry keeps the championship separation from being completely clean.",
      "bestArgument": "Merab's case starts with modern bantamweight strength: relentless pace, elite wins over Aldo, Cejudo, Yan, O'Malley, and Umar, plus a growing title run."
    },
    "divisionLabel": "BW",
    "resumeTag": "Modern bantamweight pace case",
    "oneLiner": "The modern bantamweight pace engine: relentless pressure, elite contender depth, and a title case built in one of the sport’s toughest divisions.",
    "whyRankedHere": "Merab ranks here because his modern bantamweight run has serious depth. The pace, wrestling volume, and quality wins in a strong division give him one of the best active-era cases outside the top tier.",
    "whyNotHigher": "He does not rank higher because the title run is still newer than the long-reign champions, and the Yan rematch/split rivalry keeps the case from being cleanly separated.",
    "keyJudgmentCalls": [
      [
        "Modern bantamweight strength",
        "raises the value of the opponent-quality case."
      ],
      [
        "Pace dominance",
        "is the core of the prime-dominance argument."
      ],
      [
        "Yan rivalry",
        "needs split-series context rather than a simple one-way read."
      ],
      [
        "Championship volume",
        "is still building compared with older champions."
      ],
      [
        "Finish rate",
        "is not the point of the case; control and schedule strength are."
      ]
    ],
    "finalTakeaway": "Merab is the modern bantamweight pace case: deep, exhausting, and elite, with the ceiling tied to how much more title volume he adds.",
    "packetStatus": {
      "stage": "packet live; Watch Moment added",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Merab Watch Moment. Add more rivalry copy only if needed."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/merab-dvalishvili.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-2.js and assets/compare-phase2-yan.js",
      "watchFallback": "assets/data/fighter-packets/merab-dvalishvili.js",
      "photos": "assets/fighters/merab-dvalishvili.webp and assets/fighters/merab-dvalishvili-thumb.webp"
    }
  },
  "Michael Bisping": {
    "displayName": "Michael “The Count” Bisping",
    "profileDisplayName": "Michael “The Count” Bisping",
    "resumeTag": "Middleweight title shocker",
    "watchUrl": "https://youtube.com/shorts/YqLi--j4cMA?is=S7b7jX4a5yrGhV02",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/Ne2fSWUWv4U?is=LejcNbriCXqsO38n",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "MW / LHW",
    "oneLiner": "A grit-and-volume UFC legend whose Rockhold upset and long middleweight resume make him a real champion case, even without a dominant reign.",
    "whyRankedHere": "Bisping scores as a real UFC champion case because he beat Rockhold for the belt, defended once, beat Anderson, and stacked one of the longest relevant middleweight runs in UFC history.",
    "whyNotHigher": "He does not rank higher because the reign was short, the Henderson defense is discounted, he did not clear the Yoel/Jacare/Whittaker contender line, and the GSP title loss counts as a prime finish loss.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "Rockhold = 1.00; Henderson defense = 0.75; GSP loss = 0.00."
      ],
      [
        "Apex Peak",
        "Peak status 0.50, separation 0.60, aura 0.25 per approved adjustment."
      ],
      [
        "Prime window",
        "Prime/title window runs from Brian Stann through the GSP title fight."
      ],
      [
        "Gastelum loss",
        "Post-prime short-turnaround exit loss, not fully charged."
      ],
      [
        "Nickname",
        "Profile-card display should show Michael “The Count” Bisping only after opening the profile."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Rockhold upset",
        "Huge title win, but not enough to imply he was clearly best middleweight alive."
      ],
      [
        "GSP treatment",
        "Because it was a literal title fight, it stays inside prime and gets counted."
      ],
      [
        "Henderson defense",
        "Official defense, but discounted because of challenger context and fight difficulty."
      ],
      [
        "Longevity",
        "His best category is UFC middleweight volume and relevance."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.35,
      "window": "Rockhold title upset and short title reign",
      "components": {
        "peakStatus": 0.5,
        "eliteOpponentProof": 1.1,
        "separationDominance": 0.6,
        "divisionStrength": 0.9,
        "cleanApexAura": 0.25
      },
      "notes": "The Rockhold KO is legendary, but Bisping was not a dominant apex champion or clearly the best middleweight alive."
    },
    "primeDominanceSummary": {
      "score": 16.4,
      "components": {
        "primeRecord": 4.3,
        "primeRoundsWon": 4.25,
        "titleDefenseDominance": 1.3,
        "finishStoppageDominance": 2.25,
        "lossSafetyDurability": 2.5,
        "divisionStrength": 1.8
      },
      "notes": "Prime now runs through the GSP title loss, which lowers the dominance and durability profile."
    },
    "finalTakeaway": "Bisping is a necessary UFC-only add: huge volume, one legendary title moment, and real champion status, but not a dominant-reign GOAT case.",
    "packetStatus": {
      "stage": "complete first-pass packet; adjusted apex, GSP counted in prime, title/quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/michael-bisping.js",
      "centralPacket": "assets/data/fighter-packets/michael-bisping.js",
      "watchMoment": "assets/js/watch-moments.js",
      "nickname": "assets/js/card-nicknames.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Bisping is the grit-and-volume middleweight champion case: 20 UFC wins, Rockhold title upset, Anderson win, and one defense.",
      "peak": "At his apex, Bisping authored a legendary short-notice title knockout, but the model does not treat him as a dominant best-alive champion.",
      "resume": "The resume is long and real, with a storybook title peak. The cap is that the reign was short and the elite losses stack up.",
      "counter": "The counter is that he was never a dominant champion and did not clear the strongest post-title contender line.",
      "edge": "Bisping wins comparisons when UFC volume, title-upset value, and historical middleweight relevance matter more than clean dominance.",
      "eliteCounter": false,
      "signatureWins": "Luke Rockhold, Anderson Silva, Dan Henderson, Brian Stann, Thales Leites, Cung Le, Alan Belcher.",
      "weakness": "Short reign, discounted defense, and several prime/elite losses.",
      "titleSummary": "UFC middleweight champion with 2 official title-fight wins and 1.75 adjusted title wins.",
      "primeSummary": "Prime runs from Brian Stann through the GSP title loss.",
      "bestArgument": "He turned a long contender career into one of the most memorable title wins in UFC history.",
      "titleStyle": "Middleweight Title Shocker",
      "primeStyle": "Grit-and-Volume Contender King"
    },
    "photoUrl": "assets/fighters/michael-bisping.webp",
    "thumbUrl": "assets/fighters/michael-bisping-thumb.webp"
  },
  "Miesha Tate": {
    "displayName": "Miesha “Cupcake” Tate",
    "profileDisplayName": "Miesha “Cupcake” Tate",
    "resumeTag": "Bantamweight title comeback",
    "watchUrl": "https://youtube.com/shorts/b9uD21LpKvY?si=J1e02C6oGjmLRfuk",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/4BWMHK_gnhA?t=661&is=en-jw61zn6lQ-wvD",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "WBW / WFLW",
    "oneLiner": "A former UFC bantamweight champion whose UFC-only case is built on the legendary Holm comeback, a solid contender climb, and a short reign with no defenses.",
    "whyRankedHere": "Tate scores as a legitimate UFC champion because the Holm win was a real title-winning peak moment, and the Carmouche/McMann/Eye run gives the title climb enough support.",
    "whyNotHigher": "The UFC-only case is thin after the Holm win. She has one title-fight win, zero defenses, limited elite UFC win depth, and three counted finish losses before the post-prime cutoff.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "Holm title win is 1.00. No title result gets boosted above 1.00."
      ],
      [
        "Quality Wins cap",
        "Holm gets the rare 1.25 title-winning champion exception; every other win stays below 1.00."
      ],
      [
        "Prime start",
        "Prime starts at Liz Carmouche in 2014, not the Cat/Rousey losses."
      ],
      [
        "Prime end",
        "Prime ends with the Amanda Nunes title loss. Pennington and later comeback losses are post-prime."
      ],
      [
        "Strikeforce context",
        "Strikeforce title and broader Rousey rivalry matter historically but are not scored in UFC-only rankings."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Holm win",
        "The Holm comeback carries the case and gets the rare 1.25 Quality Win credit."
      ],
      [
        "Pennington cutoff",
        "Pennington is treated as post-prime/retirement-exit, not a full prime non-elite loss."
      ],
      [
        "Comeback phase",
        "Reneau and Avila help record volume, but Vieira, Murphy, and Santos are post-prime losses with 0 penalty."
      ],
      [
        "Women’s bantamweight context",
        "Historically important division, but uneven depth compared with later women’s strawweight/flyweight peaks."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.35,
      "window": "Holm title-winning comeback",
      "components": {
        "peakStatus": 0.75,
        "eliteOpponentProof": 0.85,
        "separationDominance": 0.45,
        "divisionStrength": 0.55,
        "cleanApexAura": 0.75
      },
      "notes": "The Holm finish maxes the apex-aura piece, but the overall Apex score is capped because the title reign ended immediately and Tate was not a sustained dominant champion."
    },
    "primeDominanceSummary": {
      "score": 14.8,
      "components": {
        "primeRecord": 5.6,
        "primeRoundsWon": 3.45,
        "titleDefenseDominance": 0,
        "finishStoppageDominance": 1.85,
        "lossSafetyDurability": 2.3,
        "divisionStrength": 1.6
      },
      "notes": "A 5-1 prime title climb gets real credit, but the round-control profile and no-defense reign keep dominance moderate."
    },
    "finalTakeaway": "Tate is a historically important women’s MMA figure, but in UFC-only scoring she is a one-great-title-win champion case rather than a deep-reign GOAT case.",
    "packetStatus": {
      "stage": "complete first-pass packet; UFC bantamweight title case, win ledger, loss context, round-control rows, compare seasoning, fight ledger, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/miesha-tate.js",
      "centralPacket": "assets/data/fighter-packets/miesha-tate.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Tate is the gritty UFC bantamweight champion case: one legendary Holm comeback title win, a real contender climb, and major historical importance around early women’s UFC.",
      "peak": "At her best, Tate combined wrestling, toughness, late-fight grappling danger, and title-fight survival into one unforgettable Holm comeback.",
      "resume": "Her UFC resume is not deep, but the Holm title win gives her a real champion case. The model rewards that moment without importing Strikeforce value into the score.",
      "counter": "The counterargument is thin UFC-only depth: one title-fight win, no defenses, a 7-7 UFC record, and limited elite wins outside Holm.",
      "edge": "Tate wins comparisons when a real undisputed title win and signature championship comeback matter more than clean record volume.",
      "eliteCounter": false,
      "signatureWins": "Holly Holm, Sara McMann, Liz Carmouche, Jessica Eye, Marion Reneau, Julia Avila.",
      "weakness": "No UFC title defenses and limited elite UFC win depth after Holm.",
      "titleSummary": "One-time UFC women’s bantamweight champion with one official and adjusted title-fight win.",
      "primeSummary": "5-1 prime from Carmouche through Nunes, capped by the Nunes title loss.",
      "bestArgument": "The best argument is that beating Holm for the belt is a legitimate top-end UFC championship moment.",
      "titleStyle": "Bantamweight Title Comeback",
      "primeStyle": "Gritty Champion Climb"
    },
    "photoUrl": "assets/fighters/miesha-tate.webp",
    "thumbUrl": "assets/fighters/miesha-tate-thumb.webp"
  },
  "Paddy Pimblett": {
    "divisionLabel": "LW",
    "resumeTag": "Current lightweight contender",
    "photoUrl": "assets/fighters/paddy-pimblett.webp",
    "thumbUrl": "assets/fighters/paddy-pimblett-thumb.webp",
    "oneLiner": "A fearless modern lightweight contender with a 7-0 UFC start, dangerous submission offense, and a rebound win that proved he belongs against ranked opposition.",
    "whyRankedHere": "Pimblett earns a place in the UFC-only ranking through eight UFC wins, six finishes, and a current elite stretch highlighted by King Green, Michael Chandler, and Benoit Saint Denis. The Saint Denis submission is the clearest proof that his contender run is more than popularity.",
    "whyNotHigher": "He has not won a UFC championship fight, owns only one clear top-five win, and his elite window is still short. The Justin Gaethje interim-title loss also keeps him below established champions and long-term contenders.",
    "keyJudgmentCalls": [
      [
        "Prime start",
        "King Green begins the counted elite window; the earlier unbeaten run builds the record but not the GOAT-level prime."
      ],
      [
        "Jared Gordon",
        "the official win remains in the UFC record, but the disputed decision receives no meaningful opponent-quality boost."
      ],
      [
        "Tony Ferguson",
        "counts as a UFC win but receives minimal quality credit because Ferguson was deep into his decline."
      ],
      [
        "Michael Chandler",
        "a ranked finish with real value, discounted for Chandler's age, inactivity, and recent form."
      ],
      [
        "Justin Gaethje",
        "counts as a prime elite decision loss without a finish add-on."
      ]
    ],
    "finalTakeaway": "Pimblett is now a legitimate UFC lightweight contender with real finishing proof. His resume has entered the all-time database, but title success and a deeper elite win ledger are still required before he can challenge established greats.",
    "watchUrl": "https://youtube.com/shorts/KwhW_EA1T58?is=T0iZdi_2Xj9PNYyj",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/-qygvEuJEC8?is=PanrIaWCzzfNqhuf",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Pimblett’s UFC case is built on an 8-1 record, six finishes, and a ranked run over King Green, Michael Chandler, and Benoit Saint Denis.",
      "peak": "His best version pressures forward, survives danger, and turns scrambles into sudden submissions or ground-and-pound finishes.",
      "resume": "The Saint Denis submission is the anchor, with Chandler and Green giving the contender run legitimate ranked depth.",
      "prime": "A short current ranked-lightweight window with three finishes and one elite decision loss.",
      "counter": "The strongest counterargument is momentum: his current form is better than the thin historical resume suggests.",
      "edge": "He beats lower-level cases through UFC win volume, finishing rate, and modern lightweight strength—not championship achievement.",
      "signatureWins": "Benoit Saint Denis, Michael Chandler, and King Green define the UFC resume.",
      "weakness": "No championship win, only one clear top-five victory, and a short elite window limit the all-time case.",
      "titleSummary": "Lost a competitive five-round interim-title fight to Justin Gaethje; no UFC title-fight wins.",
      "primeSummary": "A 3-1 ranked-lightweight prime from King Green through Saint Denis, with three finishes and one elite decision loss."
    }
  },
  "Petr Yan": {
    "divisionLabel": "BW",
    "resumeTag": "Modern bantamweight title case",
    "oneLiner": "A modern bantamweight title case with elite skill, strong round control, and unusual DQ context that needs more nuance than a normal loss.",
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
    "finalTakeaway": "Yan is a legit modern bantamweight title case: not a top-tier GOAT resume, but clearly strong enough that he should appear in the ranking and compare mode.",
    "photoUrl": "assets/fighters/petr-yan.webp",
    "thumbUrl": "assets/fighters/petr-yan-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/WcKa_HG1CbA?is=CZxfIq317Q4sggsB",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/HscShxH_JtI?is=shXOQYq7ZBJ9Ij6z",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Yan is a modern bantamweight title case: elite boxing, strong round control, real title-level wins, and loss context that needs more nuance than the record alone shows.",
      "peak": "At his best, Yan was one of the cleanest technical pressure fighters in the UFC: sharp boxing, layered defense, pace, and the ability to take over rounds once reads settled in.",
      "resume": "Yan’s UFC resume has a compact but serious bantamweight title case. Aldo and Sandhagen anchor the title-race value, while the Sterling rivalry and Merab split series make the loss column more nuanced than a cold record read.",
      "counter": "Yan’s best counterargument is context. The Sterling DQ should not be treated like a normal competitive title loss, the Sterling rematch was close, and the Merab series is split rather than one-way.",
      "edge": "Yan wins comparisons when clean skill, round control, title-rematch context, and DQ/loss-context nuance matter more than raw title-defense volume.",
      "eliteCounter": true,
      "signatureWins": "Aldo, Sandhagen, Faber, Dodson, and the Merab title-rematch value give Yan a compact but real UFC bantamweight win stack.",
      "weakness": "The ceiling is title volume. Yan has elite skill and strong context, but the official loss column and lack of a long reign keep him below deeper champion cases.",
      "titleSummary": "Yan’s title case is a real bantamweight champion profile, but it is compact: title win, interim title-level value, title-rematch value, and no long defense run.",
      "primeSummary": "His prime argument is built on round control and technical separation, with major rivalry context against Sterling and Merab.",
      "titleStyle": "Compact Modern Bantamweight Champion",
      "primeStyle": "Technical Round Control"
    },
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Yan."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/petr-yan.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-phase2-yan.js",
      "profileStatsFallback": "assets/data/ranking-data.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/petr-yan.webp and assets/fighters/petr-yan-thumb.webp"
    }
  },
  "Quinton Jackson": {
    "displayName": "Quinton “Rampage” Jackson",
    "profileDisplayName": "Quinton “Rampage” Jackson",
    "divisionLabel": "LHW",
    "resumeTag": "High-impact light heavyweight champion",
    "photoUrl": "assets/fighters/quinton-jackson.webp",
    "thumbUrl": "assets/fighters/quinton-jackson-thumb.webp",
    "photoUnavailable": false,
    "photoStatus": "verified",
    "oneLiner": "The high-impact UFC light heavyweight case: knocked out Chuck Liddell for the belt, defended against Dan Henderson, and stayed in the elite title mix through the Jon Jones era.",
    "whyRankedHere": "Rampage earns his place through two UFC title-fight wins, four top-five victories, championship-level wins over Chuck Liddell and Dan Henderson, and a strong late-2000s light heavyweight prime. His PRIDE resume is excluded, so this ranking stands on UFC work alone.",
    "whyNotHigher": "He does not rank higher because the UFC title reign was short, the reviewed prime includes losses to Forrest Griffin, Rashad Evans, and Jon Jones, and his thirteen-fight UFC sample cannot match the championship volume of the division’s longest-reigning greats.",
    "keyJudgmentCalls": [
      [
        "Nickname",
        "The app-facing name is Quinton “Rampage” Jackson."
      ],
      [
        "UFC-only scope",
        "PRIDE, Bellator, WFA, and regional results are excluded from scoring."
      ],
      [
        "Prime start",
        "The Chuck Liddell title knockout begins the connected elite UFC run."
      ],
      [
        "Prime end",
        "The Jon Jones title loss closes the prime; Bader and Teixeira are post-prime losses."
      ],
      [
        "Lyoto Machida",
        "The official split-decision win counts, but receives discounted Opponent Quality credit because the performance was disputed."
      ],
      [
        "Division depth",
        "Late-2000s light heavyweight uses the neutral 1.00 depth baseline."
      ]
    ],
    "finalTakeaway": "Rampage has a real UFC champion’s resume, not just star power: a title knockout, a defense over an elite challenger, and multiple ranked wins in a deep division. The ceiling is held down by short championship volume and three prime losses.",
    "watchUrl": "https://youtube.com/shorts/JVSaguPG9nY?is=1ShwPvQ9FoBzYOFK",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/W3Ce7KPszhU?is=Pzzqz2wACxC7VY6g",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Rampage is the short-reign, high-impact light heavyweight case: he knocked out Chuck Liddell for the UFC title, defended it against Dan Henderson, and added ranked wins over Wanderlei Silva, Lyoto Machida, Keith Jardine, and Matt Hamill.",
      "peak": "At his UFC best, Rampage paired fight-changing power with elite takedown defense, physical strength, composure, and enough round-winning structure to beat champions in both explosive and five-round fights.",
      "resume": "The UFC-only ledger is compact but legitimate: Liddell, Henderson, Wanderlei, Machida, Jardine, and Hamill, plus a title win and defense. His PRIDE success is historical context only and adds no score.",
      "prime": "The reviewed prime runs from Liddell through Jon Jones at 6-3. It includes two title wins, four top-five wins, a 15-13 audited round edge, and one counted finish loss to Jones.",
      "counter": "The best counterargument against Rampage is UFC volume: two title-fight wins, three prime losses, and only thirteen UFC appearances leave less room for sustained dominance than the division’s longest championship resumes.",
      "edge": "Rampage wins appropriate comparisons through championship proof and elite peak wins. He was not merely popular—he beat the reigning champion, defended against an elite challenger, and remained in the top-title mix for years.",
      "signatureWins": "Chuck Liddell, Dan Henderson, Wanderlei Silva, Lyoto Machida, Keith Jardine, and Matt Hamill define the UFC-only case.",
      "weakness": "A short title reign, a disputed Machida win, three counted prime losses, and limited UFC longevity keep him below the deepest light heavyweight resumes.",
      "titleSummary": "Won the UFC light heavyweight title by knocking out Chuck Liddell and successfully defended it over Dan Henderson before losing to Forrest Griffin.",
      "primeSummary": "A 6-3 prime from Chuck Liddell through Jon Jones, with a 15-13 reviewed round edge and two finish wins.",
      "titleStyle": "shortReignUndisputedChampion",
      "primeStyle": "powerChampionTufBoom"
    }
  },
  "Rafael Fiziev": {
    "compareProfile": {
      "shortCase": "Fiziev is the action-striker contender: elite kicking offense, speed, combinations, and renewed momentum without championship proof yet.",
      "peak": "Layered Muay Thai, body work, counters, balance, and sudden finishing combinations define his best performances.",
      "resume": "His UFC resume now includes a strong winning streak, ranked lightweight wins, and a 2026 knockout over Manuel Torres, but no title fight.",
      "counter": "He still lacks championship fights and deep top-five win volume.",
      "edge": "He wins striking, action, finishing-threat, and What-If debates more often than career-resume debates.",
      "eliteCounter": false,
      "signatureWins": "Rafael dos Anjos, Bobby Green, Renato Moicano, Brad Riddell, Ignacio Bahamondes, and Manuel Torres.",
      "titleSummary": "No UFC title-fight wins.",
      "primeSummary": "A dangerous modern lightweight striking peak that regained momentum with a 2026 knockout win.",
      "titleStyle": "noTitleActionContender",
      "primeStyle": "muayThaiContenderPrime"
    },
    "oneLiner": "Elite Muay Thai violence with renewed lightweight momentum and unfinished upside.",
    "photoStatus": "pending-real-files"
  },
  "Randy Couture": {
    "photoUrl": "assets/fighters/randy-couture.webp",
    "thumbUrl": "assets/fighters/randy-couture-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/nU1eSclGMeA?is=R8t0HlpAbHb_E1DO",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/KsLneUSMF9A?is=xbM0ss9sbQg9Dv4I",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Couture is the chaos-era championship case: heavyweight gold, light heavyweight gold, huge title moments, and a resume that looks messy because he kept taking dangerous fights.",
      "peak": "At his best, Couture was game-planning, clinch control, dirty boxing, wrestling pressure, and veteran nerve. He repeatedly solved bigger or more explosive champions.",
      "resume": "Couture’s UFC case is built around title moments across two divisions. The losses hurt, but the championship achievements are too loud to treat him like a normal flawed contender.",
      "counter": "The case against Couture is the record. He has more losses than the cleaner GOAT candidates, so his ranking depends on how much credit you give for title risk and era context.",
      "edge": "Couture wins comparisons when championship moments, two-division relevance, and title-fight difficulty matter more than clean record aesthetics.",
      "eliteCounter": true,
      "signatureWins": "Sylvia, Liddell, Ortiz, Belfort, Rizzo twice, Randleman, Gonzaga, and Coleman give Couture one of the most important old-school UFC win lists.",
      "titleSummary": "Couture’s title case is built on winning UFC gold at heavyweight and light heavyweight, with repeated championship upsets and major title-fight moments.",
      "primeSummary": "His best years were not one smooth prime; they were multiple veteran surges across divisions, which makes the case impressive but messy.",
      "titleStyle": "Two-Division Chaos Champion",
      "primeStyle": "Veteran Era Surges",
      "weakness": "The record is messy, and the loss penalty keeps him from the cleaner top-tier cases.",
      "bestArgument": "Couture's case starts with championship chaos: heavyweight gold, light heavyweight gold, huge upset wins, and title value across multiple eras."
    },
    "divisionLabel": "HW / LHW",
    "resumeTag": "Two-division chaos champion",
    "oneLiner": "The old-school championship chaos case: heavyweight gold, light heavyweight gold, huge title moments, and a messy record built from constant risk.",
    "whyRankedHere": "Couture ranks #8 because his UFC-only case is loaded with championship moments across heavyweight and light heavyweight. The record is messy, but his title wins, two-division relevance, and era-spanning opponent list carry real all-time weight.",
    "whyNotHigher": "He does not climb higher because the loss penalty and prime-dominance profile are much messier than the cleaner GOAT cases. His greatness is championship value and risk-taking, not spotless dominance.",
    "keyJudgmentCalls": [
      [
        "Two-division value",
        "heavyweight and light heavyweight gold are central to his ranking."
      ],
      [
        "Era context",
        "old-school volatility matters because he kept taking dangerous title fights."
      ],
      [
        "Loss volume",
        "keeps him below cleaner resumes even with strong championship credit."
      ],
      [
        "Prime shape",
        "his case is multiple veteran surges rather than one smooth prime."
      ],
      [
        "UFC-only fit",
        "his biggest value is already inside the UFC scoring boundary."
      ]
    ],
    "finalTakeaway": "Couture is the championship-chaos legend: not clean, not smooth, but too decorated across UFC title history to rank like a normal flawed contender.",
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Randy. Continue mid-board packet cleanup."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/randy-couture.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-1.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/randy-couture.webp and assets/fighters/randy-couture-thumb.webp"
    }
  },
  "Rashad Evans": {
    "thumbUrl": "assets/fighters/rashad-evans-thumb.webp",
    "photoUrl": "assets/fighters/rashad-evans.webp",
    "photoNote": "",
    "signatureFightUrl": "https://youtu.be/YzJjSBV5jsg?is=F9l9dmmcWV30K4Bj",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/1WKvEuvMXQs?is=h4BR1iaH5xE2siI1",
    "watchLabel": "Watch Moment",
    "oneLiner": "A deep one-reign light-heavyweight champion whose seven Top-5 wins, iconic Chuck Liddell knockout, and Forrest Griffin title victory built a stronger resume than the brief reign suggests.",
    "whyRankedHere": "Evans ranks here because his UFC light-heavyweight ledger is loaded with meaningful wins. He knocked out Chuck Liddell, stopped Forrest Griffin to win the title, beat Rampage Jackson, Michael Bisping, Phil Davis, Thiago Silva, and Dan Henderson, and produced a 9-3 prime across six active elite years.",
    "whyNotHigher": "He does not rank higher because the championship reign lasted only one title-fight win and ended immediately against Lyoto Machida. The Jon Jones loss is understandable elite damage, but the Antônio Rogério Nogueira upset is a costly non-elite prime loss. With no successful defense and only a 60% rounds-won rate, his resume trails the longer and cleaner light-heavyweight champions above him.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/rashad-evans.js",
      "displayFallback": "assets/data/fighter-packets/rashad-evans.js"
    }
  },
  "Renato Moicano": {
    "compareProfile": {
      "shortCase": "Moicano is the adaptable two-division veteran: elite back-taking, improved pressure boxing, a short-notice title challenge, and a strong 2026 return.",
      "peak": "Long-range combinations, reactive takedowns, back control, submissions, cardio, and veteran adjustments form a complete style.",
      "resume": "The UFC resume has meaningful depth across featherweight and lightweight, a 2025 lightweight title challenge, and a 2026 submission win over Chris Duncan.",
      "counter": "The best opponents have often beaten him, and he has no UFC title-fight win.",
      "edge": "He wins versatility, grappling, finishing variety, longevity, and solid-win-depth debates.",
      "eliteCounter": false,
      "signatureWins": "Benoît Saint Denis, Jalin Turner, Drew Dober, Brad Riddell, Calvin Kattar, Jeremy Stephens, and Chris Duncan.",
      "titleSummary": "One UFC lightweight title challenge and zero title-fight wins.",
      "primeSummary": "A late-developing two-division prime built around submissions, improved pressure striking, and sustained veteran relevance.",
      "titleStyle": "shortNoticeTitleChallenger",
      "primeStyle": "adaptiveGrapplingPrime"
    },
    "oneLiner": "Submission craft, late-career growth, and personality across two divisions.",
    "photoStatus": "pending-real-files"
  },
  "Robbie Lawler": {
    "displayName": "Robbie “Ruthless” Lawler",
    "profileDisplayName": "Robbie “Ruthless” Lawler",
    "resumeTag": "Ruthless title-war champion",
    "watchUrl": "https://youtu.be/GkBBqPkfGYg?is=aWsbqeDBGQmaJg4Q",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/ocsu8P4-GS4?is=kQFibyNlGENs6-QK",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "WW / MW",
    "oneLiner": "A Hall of Fame welterweight champion whose comeback title run delivered all-time violence and real defenses, capped by close decisions and a short reign.",
    "whyRankedHere": "Lawler lands here because his UFC comeback title run was real: he beat Hendricks for the belt, finished Rory in an all-time defense, and officially defended again against Condit.",
    "whyNotHigher": "He does not rank higher because the reign was short, several title fights were razor-close, and Woodley ended the champion run quickly and violently.",
    "bigAssumptions": [
      [
        "Title run",
        "The Hendricks title win and Condit defense count, but their close-score nature keeps the championship case from looking cleaner than it was."
      ],
      [
        "Rory rematch",
        "The Rory defense is the signature win, but it was a war rather than a clean separation performance."
      ],
      [
        "Apex Peak",
        "Robbie gets strong peak respect, but his peak status and signature peak moment are capped because his title run was dramatic, not dominant."
      ],
      [
        "Prime window",
        "The main prime window is the comeback title run from Koscheck through Woodley."
      ],
      [
        "Late-career skid",
        "The RDA fight and everything after are treated as decline-stage results, so they do not erase the champion version of Lawler."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Violence vs dominance",
        "Lawler’s title run was legendary, but he was not a clean round-to-round controller."
      ],
      [
        "Condit defense",
        "The Condit win stays on the resume, but with controversy context."
      ],
      [
        "Woodley loss",
        "The Woodley KO is the hard cap on the reign."
      ],
      [
        "UFC-only lens",
        "Strikeforce and Pride context can explain the legend, but the ranking here is built on UFC results."
      ]
    ],
    "apexPeakSummary": {
      "score": 4,
      "window": "Hendricks title win through Rory/Condit defenses",
      "components": {
        "peakStatus": 0.9,
        "eliteOpponentProof": 1.1,
        "separationDominance": 0.75,
        "divisionStrength": 1,
        "cleanApexAura": 0.25
      },
      "notes": "Rory II is an all-time title fight, but Robbie’s peak was dramatic and violent rather than cleanly dominant."
    },
    "primeDominanceSummary": {
      "score": 15.95,
      "components": {
        "primeRecord": 4.6,
        "primeRoundsWon": 3.45,
        "titleDefenseDominance": 2.65,
        "finishStoppageDominance": 2.55,
        "lossSafetyDurability": 1.6,
        "divisionStrength": 1.1
      },
      "notes": "Two title defenses and elite violence, but not clean sustained control."
    },
    "finalTakeaway": "Robbie is a real UFC champion and Hall of Fame action legend, but his GOAT case is a title-war case, not a long-dominance case.",
    "packetStatus": {
      "stage": "complete first-pass packet; title-run logic, revised apex peak, quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/robbie-lawler.js",
      "centralPacket": "assets/data/fighter-packets/robbie-lawler.js",
      "watchMoment": "assets/js/watch-moments.js",
      "nickname": "assets/js/card-nicknames.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Robbie is the ruthless title-war champion case: comeback UFC belt, two defenses, Rory II, and one of the most violent champion runs ever.",
      "peak": "At his apex, Robbie was not cleanly dominant — he was dangerous late, durable, and willing to drag elite welterweights into deep water.",
      "resume": "The title resume is real, but the close Hendricks/Condit results and short reign keep it capped.",
      "counter": "The counter is cleanliness: close title fights, Woodley KO, and too many losses to climb into cleaner champion tiers.",
      "edge": "Robbie wins comparisons when title-war value, violence, and real defenses matter more than clean control.",
      "eliteCounter": false,
      "signatureWins": "Rory MacDonald, Johny Hendricks, Carlos Condit, Matt Brown, Josh Koscheck, Jake Ellenberger.",
      "weakness": "Short reign, close decisions, and a heavy loss column.",
      "titleSummary": "Former UFC welterweight champion with two title defenses.",
      "primeSummary": "Prime runs from Koscheck through the Woodley title loss.",
      "bestArgument": "Few comeback champions have a more memorable title run than Lawler’s welterweight violence era.",
      "titleStyle": "Ruthless Title-War Champion",
      "primeStyle": "Comeback Violence Prime"
    },
    "photoUrl": "assets/fighters/robbie-lawler.webp",
    "thumbUrl": "assets/fighters/robbie-lawler-thumb.webp"
  },
  "Robert Whittaker": {
    "displayName": "Robert “The Reaper” Whittaker",
    "profileDisplayName": "Robert “The Reaper” Whittaker",
    "resumeTag": "Middleweight champion contender king",
    "watchUrl": "https://youtube.com/shorts/mmIGDqLaRVM?is=n7F_4C410g2bf3nm",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/7CAkyfHMhhA?is=-CafmSWmneEDF7dK",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "MW",
    "oneLiner": "A former middleweight champion with elite resume depth, Romero-war proof, and long contender relevance — capped by no defense streak and several elite finish losses.",
    "whyRankedHere": "Whittaker ranks here because his UFC-only resume has rare middleweight depth: Romero twice, Jacare, Cannonier, Costa, Vettori, Brunson, Till, Gastelum, and years of elite relevance after winning UFC gold.",
    "whyNotHigher": "He does not rank higher because his championship case is light for an all-time champion: no official defense streak, Adesanya clearly capped the title era, and later Dricus/Khamzat finish losses hurt the prime-dominance and loss-context side.",
    "bigAssumptions": [
      [
        "Romero rematch",
        "Gets major title-level resume credit even though it was non-title after Romero missed weight. Cody approved this treatment."
      ],
      [
        "RDR loss",
        "Treated as post-prime/late-career context instead of a Prime Dominance killer."
      ],
      [
        "Khamzat and Dricus losses",
        "Count because Whittaker was still relevant enough to be taking elite middleweight fights."
      ],
      [
        "Championship value",
        "Interim title plus promotion to undisputed counts, but lack of official title defenses keeps the championship score modest."
      ],
      [
        "Round control",
        "Round rows are best-effort and should be audited in the next full scoring-table rebuild. Romero 1 and Romero 2 are included."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Romero 1",
        "Full elite/title credit as the interim title win."
      ],
      [
        "Romero 2",
        "High credit as an elite rematch win, but slightly discounted for non-title/missed-weight/close-war context."
      ],
      [
        "Jacare finish",
        "One of the cleanest elite wins on his resume."
      ],
      [
        "Loss context",
        "Adesanya, Dricus, and Khamzat losses keep him from a higher GOAT tier."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.25,
      "window": "Jacare Souza 2017 through Yoel Romero II 2018",
      "notes": "Legit elite middleweight apex with Jacare finish and Romero proof, but not a clean separation/aura peak."
    },
    "primeDominanceSummary": {
      "score": 16.4,
      "notes": "Long, skilled, and elite, but not a clean title-dominance prime because of finish losses and no defense streak."
    },
    "finalTakeaway": "Whittaker is a better UFC-only resume case than his belt stats make him look. He is not a long-reign champion, but he is one of the strongest non-inner-circle middleweight legacy resumes.",
    "packetStatus": {
      "stage": "complete packet; Loss Context record reconciled; round-control rows added",
      "lastUpdated": "2026-07-10",
      "nextFix": "Add real photos after Cody uploads source images; audit exact round-control rows during next scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/robert-whittaker.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Whittaker is the middleweight resume-depth case: champion value, Romero x2, Jacare, Cannonier, Costa, Vettori, and years of elite relevance.",
      "peak": "At his best, Whittaker had elite footwork, counter-wrestling, pace, and durability in brutal middleweight matchups.",
      "resume": "His resume is deep for a non-long-reign champion. The Romero wins and Jacare finish are the centerpieces.",
      "counter": "The counterargument against Whittaker is that his belt resume is thin and the elite finish losses are loud.",
      "edge": "Whittaker wins comparisons when resume depth and elite longevity matter more than title defenses.",
      "eliteCounter": true,
      "signatureWins": "Yoel Romero twice, Ronaldo Souza, Jared Cannonier, Paulo Costa, Marvin Vettori, Derek Brunson, Kelvin Gastelum.",
      "weakness": "No official defense streak and multiple elite finish losses.",
      "titleSummary": "Interim UFC middleweight title win, promoted to undisputed champion, but no official defense streak.",
      "primeSummary": "Long elite middleweight prime with high-level wins, but not a clean domination reign.",
      "bestArgument": "Whittaker has one of the best UFC-only middleweight resumes among fighters without a long title reign.",
      "titleStyle": "Interim-to-undisputed Champion",
      "primeStyle": "Long Elite Contender Prime"
    },
    "photoUrl": "assets/fighters/robert-whittaker.webp",
    "thumbUrl": "assets/fighters/robert-whittaker-thumb.webp"
  },
  "Ronda Rousey": {
    "photoUrl": "assets/fighters/ronda-rousey.webp",
    "thumbUrl": "assets/fighters/ronda-rousey-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/l4hilvKQgYc?is=diOKawJqeBkHdtcf",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/tbKIVH8nY60?is=y5-Dat4Qb7IjqLe_",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "BW",
    "resumeTag": "Original women’s UFC superstar",
    "oneLiner": "The original women’s UFC superstar case: historic bantamweight title dominance, instant finishes, mainstream impact, and a sharp ending that caps the score.",
    "whyRankedHere": "Rousey ranks women’s #4 because her UFC peak mattered enormously. She was the original women’s UFC champion, defended repeatedly, and finished fights in a way that made her feel almost inevitable during the early run.",
    "whyNotHigher": "She does not rank higher because the run was short and the ending was severe. The Holm and Nunes losses damaged the aura, and the later women’s champions built deeper UFC resumes.",
    "keyJudgmentCalls": [
      [
        "Era impact",
        "huge context, but the scoring still stays UFC-resume based."
      ],
      [
        "Title-fight volume",
        "strong for a short UFC run."
      ],
      [
        "Finish dominance",
        "central to the prime-dominance score."
      ],
      [
        "Holm/Nunes losses",
        "major drag because they ended the reign and aura decisively."
      ],
      [
        "Short window",
        "keeps longevity below Nunes, Valentina, and Joanna."
      ]
    ],
    "finalTakeaway": "Rousey is the original women’s UFC force: historically massive, brutally dominant for a short window, and held back by a short run with a rough finish.",
    "packetStatus": {
      "stage": "packet live; photos and Watch Moment needed",
      "lastUpdated": "2026-07-02",
      "nextFix": "Add Ronda photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/ronda-rousey.js",
      "compareFallback": "assets/compare-coverage-pack-2.js"
    },
    "compareProfile": {
      "shortCase": "Rousey is the original women’s UFC superstar case: historic title dominance, instant finishes, and one of the most important short peaks in company history.",
      "peak": "At her best, Rousey was immediate chaos: clinch entry, throws, armbar threat, and pressure that made opponents panic before the fight settled.",
      "resume": "Rousey’s UFC resume is short but historically loud. She created the first women’s UFC standard, then lost the aura sharply against Holm and Nunes.",
      "counter": "Rousey’s argument is impact and dominance. Nobody on the women’s board changed the UFC faster, but the resume depth is not Nunes or Valentina level.",
      "edge": "Rousey wins comparisons when historic impact, title-finishing dominance, and short-peak aura outweigh long-term resume depth.",
      "eliteCounter": true,
      "signatureWins": "Tate, Zingano, Davis, Carmouche, McMann, and Correia give Rousey the original women’s UFC title-run resume.",
      "weakness": "The Holm and Nunes losses ended the aura, and the UFC window was too short to match deeper champions.",
      "titleSummary": "Rousey’s title case is historically important and finish-heavy, but compact compared with Nunes and Valentina.",
      "primeSummary": "Her prime was short, violent, and transformative, then ended sharply in two damaging losses.",
      "titleStyle": "Original Women’s UFC Champion",
      "primeStyle": "Short Armbar-Aura Prime"
    }
  },
  "Rose Namajunas": {
    "displayName": "“Thug” Rose Namajunas",
    "profileDisplayName": "“Thug” Rose Namajunas",
    "resumeTag": "Two-reign strawweight giant killer",
    "watchUrl": "https://youtube.com/shorts/BVqANFBGq7w?si=FYfcFp-j5hSIXn7b",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/G2vSZhl6BFY?is=IYpvomkm6ZdY8fYg",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "SW / FLW",
    "oneLiner": "A volatile but elite UFC-only case: two strawweight reigns, four title-fight wins, Joanna twice, Zhang twice, and a 6-2 prime capped by Andrade and Esparza damage.",
    "whyRankedHere": "Rose belongs in the high-end women’s UFC champion tier because the quality wins are enormous: Joanna twice, Zhang twice, Andrade, and two separate strawweight title wins.",
    "whyNotHigher": "The case is capped by short title reigns and volatility. Four title-fight wins is strong, but not Amanda, Valentina, or Zhang title volume, and the Andrade finish plus Esparza rematch loss keep the prime from looking clean.",
    "bigAssumptions": [
      [
        "Prime record",
        "Prime is 6-2: Waterson, Joanna I, Joanna II, Andrade II, Zhang I, Zhang II, with losses to Andrade I and Esparza II."
      ],
      [
        "Loss cutoff",
        "Loss penalties stop after Carla Esparza II because the later flyweight losses are post-prime/upward-division phase."
      ],
      [
        "Quality Wins cap",
        "Joanna I and Zhang I get rare 1.25 title-win exception credit. Joanna II, Zhang II, and Andrade II are full 1.00 wins, not above-cap bumps."
      ],
      [
        "Championship volume",
        "Four adjusted title wins is strong but not long-reign volume."
      ],
      [
        "Photos",
        "No photo paths until real files exist in assets/fighters/."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Prime cutoff",
        "Esparza II ends the prime-loss window."
      ],
      [
        "Flyweight phase",
        "Counts for longevity/relevance, not prime-loss damage."
      ],
      [
        "Head-to-head value",
        "Wins over Joanna and Zhang carry major Quality Wins and Apex value."
      ],
      [
        "Volatility",
        "Rose gets huge peak value, but short reigns and bad-looking title losses matter."
      ],
      [
        "Strawweight context",
        "Modern strawweight is treated as a strong women’s UFC division."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.85,
      "window": "Joanna title breakthrough through Zhang rematch defense",
      "components": {
        "peakStatus": 1.3,
        "eliteOpponentProof": 1.4,
        "separationDominance": 0.75,
        "divisionStrength": 0.7,
        "cleanApexAura": 0.7
      },
      "notes": "Elite opponent proof is the core: Joanna twice and Zhang twice. Not maxed because the reigns were short and the dominance was uneven."
    },
    "primeDominanceSummary": {
      "score": 18.75,
      "components": {
        "primeRecord": 5,
        "primeRoundsWon": 4.15,
        "titleDefenseDominance": 2.5,
        "finishStoppageDominance": 3,
        "lossSafetyDurability": 2.25,
        "divisionStrength": 1.85
      },
      "notes": "A 6-2 prime with huge wins, but not a round-control machine and finished by Andrade during the core window."
    },
    "finalTakeaway": "Rose is one of the highest-variance women’s UFC GOAT cases: legendary quality wins and real title moments, balanced by short reigns and meaningful prime losses.",
    "packetStatus": {
      "stage": "complete first-pass packet; two-reign strawweight case, win ledger, loss context, round-control rows, compare seasoning, and fight ledger included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; add Watch Moment only if URL is provided; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/rose-namajunas.js",
      "centralPacket": "assets/data/fighter-packets/rose-namajunas.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Rose is the giant-killer strawweight case: two title reigns, Joanna twice, Zhang twice, and one of the best women’s UFC quality-win clusters ever.",
      "peak": "At her best, Rose had timing, movement, sudden finishing danger, and title-fight poise against historically great strawweights.",
      "resume": "Her UFC resume is not the cleanest, but the top-end wins are massive. The model rewards the wins while still charging the volatility.",
      "counter": "The counterargument is consistency: short reigns, the Andrade finish, the Esparza rematch, and several post-prime flyweight losses.",
      "edge": "Rose wins comparisons when elite-win quality and head-to-head strawweight proof matter more than clean long-reign control.",
      "eliteCounter": true,
      "signatureWins": "Joanna Jedrzejczyk twice, Zhang Weili twice, Jessica Andrade, Michelle Waterson, Tecia Torres, Amanda Ribas, Tracy Cortez.",
      "weakness": "Short title reigns and volatile prime-loss context.",
      "titleSummary": "Two-time UFC strawweight champion with four official and adjusted title-fight wins.",
      "primeSummary": "6-2 prime from Waterson through Esparza II.",
      "bestArgument": "The best argument is that very few women have a better top-five win cluster than Rose’s Joanna/Zhang run.",
      "titleStyle": "Two-Reign Strawweight Giant Killer",
      "primeStyle": "High-Variance Elite Peak"
    },
    "photoUrl": "assets/fighters/rose-namajunas.webp",
    "thumbUrl": "assets/fighters/rose-namajunas-thumb.webp"
  },
  "Royce Gracie": {
    "photoUrl": "assets/fighters/royce-gracie.webp",
    "thumbUrl": "assets/fighters/royce-gracie-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/OQlVzoAnM9M?is=p7sB7tAt3oEAzJSL",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/-y2SEefVNtE?is=NN1arJDFgj8_a7F9",
    "signatureFightLabel": "Watch Signature Fight",
    "oneLiner": "The foundational tournament legend: an 11-0-1 opening run, complete finishing dominance, and the resume that made Brazilian jiu-jitsu impossible to ignore.",
    "whyRankedHere": "Gracie ranks here because his early UFC run was historically dominant inside the format that existed. He won three tournaments, opened 11-0-1, finished every UFC victory, and defeated the two strongest established opponents on the ledger in Ken Shamrock and Dan Severn.",
    "whyNotHigher": "He does not rank higher because early tournaments were not the same as a modern UFC title reign, the opponent pool was undeveloped, only two victories receive Top-5-level credit, and his counted elite window lasted roughly 1.4 years. The model respects the dominance without pretending the competitive depth matched later divisions.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/royce-gracie.js",
      "displayFallback": "assets/data/fighter-packets/royce-gracie.js"
    }
  },
  "Sean O'Malley": {
    "displayName": "“Sugar” Sean O’Malley",
    "profileDisplayName": "“Sugar” Sean O’Malley",
    "resumeTag": "Bantamweight champion burst",
    "watchUrl": "https://youtube.com/shorts/Qelywtchvk8?is=C0v8L_ndxdC5BS9c",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/EDAt1j_mTCw?is=GFpQRutBy6Ibbvnx",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "BW",
    "oneLiner": "A precision-striking bantamweight champion with a huge Aljo title KO, a Vera title defense, and a resume capped hard by Merab.",
    "whyRankedHere": "O'Malley ranks here because the top of the UFC resume is real: he knocked out Aljamain Sterling to win the bantamweight title, defended against Marlon Vera, beat Petr Yan in a close elite fight, and added Song/Zahabi current-table rebound value.",
    "whyNotHigher": "He does not rank higher yet because the reign was short, the elite-win list is not deep, and the two Merab losses sharply cap the title-prime and GOAT case.",
    "bigAssumptions": [
      [
        "Current-table scope",
        "Uses the current scoring-table version where O'Malley has rebound wins over Song Yadong and Aiemann Zahabi after the Merab losses."
      ],
      [
        "Yan win",
        "Counts as elite top-five credit, but slightly discounted because the decision was highly debated."
      ],
      [
        "Vera title defense",
        "Gets near-full top-five title-defense credit after Cody clarified top-five wins should usually land near 1.00."
      ],
      [
        "Munhoz NC",
        "No contest is context only, not meaningful win credit."
      ],
      [
        "Merab ceiling",
        "The two Merab losses are the main cap on Prime Dominance, Apex Peak, and Loss Context."
      ],
      [
        "Round control",
        "Round rows are best-effort and should be audited in the next full scoring-table rebuild."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Aljo title KO",
        "Receives a slight champion/title bump at 1.10 quality-win credit."
      ],
      [
        "Vera 1 loss",
        "Counts, but with injury/TKO context rather than a clean skill-gap loss."
      ],
      [
        "Modern bantamweight",
        "Gets solid division-strength respect, but not lightweight-level multiplier."
      ],
      [
        "Apex window",
        "Aljamain Sterling 2023 through Marlon Vera 2 2024 is treated as his best short UFC window."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.25,
      "window": "Aljamain Sterling 2023 through Marlon Vera 2 2024",
      "notes": "Explosive title KO plus dominant title defense, but Merab matchups remove clean apex aura."
    },
    "primeDominanceSummary": {
      "score": 16.6,
      "notes": "Dangerous striking peak and real title burst, capped by short reign, moderate round-control profile, and Merab losses."
    },
    "finalTakeaway": "O'Malley is a real UFC-only champion case, not just a star case. But right now he belongs in the lower modern-champion tier, not near the long-reign bantamweight greats.",
    "packetStatus": {
      "stage": "complete first-pass packet; Cody-reviewed Quality Wins; round-control rows added",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after Cody uploads source images; audit exact round-control rows during next scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/sean-omalley.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "O'Malley is a short-burst bantamweight champion case: huge title KO, one defense, debated Yan win, and a star-level striking peak.",
      "peak": "At his best, Sean is a long-range timing striker with real one-shot title-fight danger.",
      "resume": "The resume has a strong top end with Aljo, Yan, Vera, and Song, but it does not yet have deep elite volume.",
      "counter": "O'Malley can win debates against longer but less explosive resumes because the Aljo KO and Vera defense are loud title moments.",
      "edge": "O'Malley wins comparisons when title-shot peak and high-end striking danger matter more than longevity.",
      "eliteCounter": false,
      "signatureWins": "Aljamain Sterling, Petr Yan, Marlon Vera, Song Yadong, Aiemann Zahabi.",
      "weakness": "Short reign, two Merab losses, and limited elite-win depth.",
      "titleSummary": "One UFC bantamweight title win and one title defense.",
      "primeSummary": "Dangerous and real, but not a clean long-control prime.",
      "bestArgument": "The best argument is that beating Aljo for the belt, defending against Vera, and beating Yan gives Sean a stronger top-end resume than his short reign suggests.",
      "titleStyle": "Short Title Burst",
      "primeStyle": "Precision Striking Peak"
    },
    "photoUrl": "assets/fighters/sean-omalley.webp",
    "thumbUrl": "assets/fighters/sean-omalley-thumb.webp"
  },
  "Sean Strickland": {
    "displayName": "Sean “Tarzan” Strickland",
    "profileDisplayName": "Sean “Tarzan” Strickland",
    "resumeTag": "Awkward middleweight title disruptor",
    "watchUrl": "https://youtube.com/shorts/oOeeWkSuOIo?si=f2F9cDqI4ZOvPaKh",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/VhuOa60BVy0?is=mW_KDjjwj4D179ON",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "MW",
    "oneLiner": "A pace-and-defense middleweight champion with a legendary Adesanya upset, current-table Khamzat proof, and a resume capped by Dricus/Pereira loss context.",
    "whyRankedHere": "Strickland ranks here because the top of the UFC middleweight resume is loud: the Adesanya title upset is one of the best middleweight wins ever, the current-table Khamzat win adds elite title-level proof, and his pressure/defense style gives him real round-control value.",
    "whyNotHigher": "He does not rank higher because there is no long defense streak, the finishing profile is low, Dricus has direct title-fight separation twice, and the loss ledger reaches the cap.",
    "bigAssumptions": [
      [
        "Current-table scope",
        "Uses the current scoring-table version where Strickland owns a title-level win over Khamzat. Without that, he drops several points."
      ],
      [
        "Apex adjustment",
        "Separation is set at 0.50 and aura at 0.25, bringing Apex Peak to +3.25."
      ],
      [
        "Round control",
        "Round rows are included from the start so the Rounds Won section renders; they remain best-effort until a full rebuild."
      ],
      [
        "Loss cap",
        "The loss ledger reaches the -10 cap because of early losses plus Pereira, Cannonier, and Dricus title-fight context."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Adesanya win",
        "Massive title and apex proof because it was a clean five-round title upset."
      ],
      [
        "Khamzat win",
        "Counts as current-table title-level elite proof."
      ],
      [
        "Dricus rivalry",
        "Dricus has the direct edge twice, so Strickland cannot climb into the higher champion tier yet."
      ],
      [
        "Pereira loss",
        "Counts as a prime finished loss to a champion/top-five level opponent."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.25,
      "window": "Israel Adesanya 2023 through Khamzat Chimaev current-table title win",
      "components": {
        "peakStatus": 0.75,
        "eliteOpponentProof": 1.25,
        "separationDominance": 0.5,
        "divisionStrength": 0.5,
        "cleanApexAura": 0.25
      },
      "notes": "Adesanya plus Khamzat proof gives a real apex, but Dricus losses cap separation and aura."
    },
    "primeDominanceSummary": {
      "score": 16.9,
      "notes": "High round-control/pace value, low finish value, no defense streak, and heavy elite-loss context."
    },
    "finalTakeaway": "Strickland is a weird but legit UFC-only champion case: better than the belt-count summary looks, but capped hard by direct rivalry losses and the -10 loss penalty.",
    "packetStatus": {
      "stage": "complete first-pass packet; category scores include Apex separation/aura reduction; round-control rows included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/sean-strickland.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Strickland is the awkward champion disruptor: Adesanya upset, current-table Khamzat proof, high round-control style, and heavy loss-context drag.",
      "peak": "At his best, Strickland wins by pressure, jab volume, defense, pace, and making elite strikers uncomfortable for five rounds.",
      "resume": "The resume top end is strong with Adesanya and Khamzat, then solid depth through Imavov, Costa, Hermansson, Allen, and Hall.",
      "counter": "The counterargument against Strickland is easy: not enough defenses, not enough finishes, and too many losses.",
      "edge": "Strickland wins comparisons when title upset value and round-control style outweigh cleaner records or longer but less explosive resumes.",
      "eliteCounter": true,
      "signatureWins": "Israel Adesanya, Khamzat Chimaev, Nassourdine Imavov, Paulo Costa, Jack Hermansson, Brendan Allen, Uriah Hall.",
      "weakness": "Low finishing dominance, no long reign, Dricus rivalry, and capped loss penalty.",
      "titleSummary": "UFC middleweight title win over Adesanya plus current-table Khamzat title-level credit; no defense streak.",
      "primeSummary": "Good control prime, not a clean dominance prime.",
      "bestArgument": "His best argument is that beating Adesanya cleanly, then adding Khamzat in the current table, gives him a louder top-end title resume than most short-reign champions.",
      "titleStyle": "Short Disruptor Title Case",
      "primeStyle": "Round-Control Pressure Prime"
    },
    "photoUrl": "assets/fighters/sean-strickland.webp",
    "thumbUrl": "assets/fighters/sean-strickland-thumb.webp"
  },
  "Stipe Miocic": {
    "photoUrl": "assets/fighters/stipe-miocic.webp",
    "thumbUrl": "assets/fighters/stipe-miocic-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/h_ThhOpI_dg?is=4Sr5Mcp01GkYxtrG",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/2yB-hp1OuKo?is=AaykrjmhihljMeKc",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Stipe is the best UFC heavyweight resume case: the strongest heavyweight title-run argument, major wins over champions, and trilogy separation over Cormier.",
      "peak": "At his best, Stipe combined boxing, wrestling, cardio, durability, and calm decision-making better than almost any heavyweight champion.",
      "resume": "Stipe’s UFC case is heavyweight-specific but very strong. Heavyweight careers are volatile, and he still built one of the cleanest title resumes the division has seen.",
      "counter": "The counterargument is division ceiling. Heavyweight is chaotic and thinner than lightweight or welterweight, so Stipe needs championship weight to carry the case.",
      "edge": "Stipe wins comparisons when heavyweight title value, champion wins, and the Cormier trilogy matter more than lighter-division depth.",
      "eliteCounter": true,
      "signatureWins": "Werdum, Overeem, dos Santos, Ngannou, Cormier twice, Hunt, Arlovski, and Nelson give Stipe the strongest UFC heavyweight win list.",
      "titleSummary": "Stipe’s title case is the UFC heavyweight standard: repeated title wins, multiple defenses, and the Cormier trilogy comeback.",
      "primeSummary": "His prime lasted through several heavyweight waves, with enough durability and adaptability to survive a historically volatile division.",
      "titleStyle": "Heavyweight Standard",
      "primeStyle": "Heavyweight Longevity",
      "weakness": "Heavyweight depth, loss volatility, and the late Jones loss cap the all-time ranking even though his divisional case is excellent.",
      "bestArgument": "Stipe's case starts with the best UFC heavyweight resume: title defenses, champion wins, the first Ngannou win, and the Cormier trilogy comeback."
    },
    "divisionLabel": "HW",
    "resumeTag": "UFC heavyweight standard",
    "oneLiner": "The strongest UFC heavyweight resume case: title defenses, champion wins, Ngannou value, and trilogy separation over Cormier.",
    "whyRankedHere": "Stipe ranks #14 because he has the strongest UFC heavyweight resume: heavyweight title wins, major defenses, champion-level opponent quality, and the Cormier trilogy edge.",
    "whyNotHigher": "He does not rank higher because heavyweight depth and volatility cap the score compared with lighter divisions, and the loss column is real. The Jones loss also keeps the back end from feeling clean.",
    "keyJudgmentCalls": [
      [
        "Heavyweight value",
        "he is treated as the UFC heavyweight standard, but heavyweight depth is still different from lightweight or welterweight."
      ],
      [
        "Cormier trilogy",
        "the 2-1 edge over DC is central to his ranking."
      ],
      [
        "Ngannou split",
        "the first win matters a lot, but the knockout loss also matters."
      ],
      [
        "Finish rate",
        "his heavyweight finishing profile helps the eye test and dominance case."
      ],
      [
        "Late Jones loss",
        "counts as late-career context and keeps the ending from being spotless."
      ]
    ],
    "finalTakeaway": "Stipe is the UFC heavyweight benchmark: the best heavyweight title resume, elite champion wins, and direct trilogy separation over Cormier, with heavyweight volatility holding him outside the top ten.",
    "packetStatus": {
      "stage": "complete in packet system",
      "lastUpdated": "2026-07-02",
      "nextFix": "None for Stipe. Continue current-roster packet cleanup."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/stipe-miocic.js",
      "displayFallback": "assets/data/display-overrides.js",
      "compareFallback": "assets/compare-coverage-pack-1.js",
      "profileStatsFallback": "assets/js/fighter-profile-packages.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "assets/fighters/stipe-miocic.webp and assets/fighters/stipe-miocic-thumb.webp"
    }
  },
  "T.J. Dillashaw": {
    "watchUrl": "https://youtube.com/shorts/FiV10zxE8RY?is=S7az7vuBDbjIuIfJ",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/xxROoFHRRd8?is=zUZGiVkLSrYCJQEO",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "BW / FLW",
    "resumeTag": "Two-time bantamweight champion, tainted ceiling",
    "oneLiner": "A real bantamweight title monster with five UFC title-fight wins, huge finishes over Barao and Garbrandt, and an EPO suspension that keeps the legacy from feeling clean.",
    "whyRankedHere": "Dillashaw ranks here because the UFC-only resume has serious championship weight: two bantamweight title reigns, five UFC title-fight wins, title finishes over Renan Barao, Joe Soto, and Cody Garbrandt, plus elite wins over Cory Sandhagen, Raphael Assuncao, and John Lineker.",
    "whyNotHigher": "He does not rank higher because the resume is permanently clouded by the EPO suspension and vacated belt, the Dominick Cruz loss cost him a cleaner reign, the Cejudo flyweight loss was ugly, and the Sterling fight ended with major shoulder-injury context.",
    "bigAssumptions": [
      [
        "Prime start",
        "Renan Barao 2014 starts the clean title-prime window."
      ],
      [
        "Title credit",
        "All five UFC bantamweight title-fight wins count, even though the later vacated title and EPO suspension are major visible context."
      ],
      [
        "PED context",
        "The EPO suspension is not a locked formula loss penalty, but it matters heavily in app-facing legacy copy."
      ],
      [
        "Cejudo loss",
        "The flyweight title loss is treated as a cross-division elite loss with a smaller resume penalty than a normal bantamweight collapse."
      ],
      [
        "Sterling loss",
        "The Sterling title loss stays on the record, but the shoulder issue keeps it from being treated like a clean prime destruction."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Barao upset",
        "The first Barao win is the championship anchor and one of the great UFC title upsets."
      ],
      [
        "Garbrandt rivalry",
        "Two knockout title wins over Cody are huge for the championship case."
      ],
      [
        "Cruz loss",
        "A close title loss, but it blocks a cleaner all-time bantamweight reign argument."
      ],
      [
        "Sandhagen win",
        "Counts as a major longevity/quality win, with disputed-scorecard context."
      ],
      [
        "EPO",
        "The title resume is real, but the legacy ceiling is capped by the suspension."
      ]
    ],
    "finalTakeaway": "Dillashaw is a top-20-ish UFC-only case because five title-fight wins are hard to ignore. The problem is not talent or peak; it is the EPO cloud and the way the ending keeps the resume from feeling clean.",
    "packetStatus": {
      "stage": "permanent hand-added fighter; packet live; photos needed",
      "lastUpdated": "2026-07-03",
      "nextFix": "Add T.J. Dillashaw photos. Add Watch Moment only if Cody provides a URL."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/tj-dillashaw.js",
      "displayFallback": "assets/data/display-overrides.js",
      "watchFallback": "assets/js/watch-moments.js",
      "photos": "Add assets/fighters/tj-dillashaw.webp and assets/fighters/tj-dillashaw-thumb.webp when real files exist."
    },
    "compareProfile": {
      "shortCase": "Dillashaw is the tainted bantamweight title resume: two reigns, five title-fight wins, violent finishes, and a PED cloud that caps the GOAT argument.",
      "peak": "At his best, Dillashaw was movement, stance switching, pace, wrestling, and fight-ending combinations. The Barao and Garbrandt performances are elite championship peak proof.",
      "resume": "The UFC resume has Renan Barao twice, Cody Garbrandt twice, Cory Sandhagen, Raphael Assuncao, John Lineker, Joe Soto, and Mike Easton.",
      "counter": "Dillashaw’s counterargument is that his best title performances are more dominant and more violent than many cleaner champions in this range.",
      "edge": "Dillashaw wins comparisons when title-fight wins, peak performance, and bantamweight finishing dominance matter more than clean legacy optics.",
      "eliteCounter": true,
      "signatureWins": "Renan Barao twice, Cody Garbrandt twice, Cory Sandhagen, Raphael Assuncao, John Lineker, Joe Soto, and Mike Easton.",
      "weakness": "The EPO suspension is the obvious weakness, and the Cruz/Cejudo/Sterling losses prevent a clean all-time bantamweight king case.",
      "titleSummary": "Dillashaw’s title case is five UFC bantamweight title-fight wins across two reigns, with one belt later relinquished after an adverse finding.",
      "primeSummary": "His prime was championship-level and explosive, but the legacy trust issue keeps the score from matching the raw title count.",
      "titleStyle": "Tainted Bantamweight King",
      "primeStyle": "Switch-Stance Violence Prime"
    },
    "photoUrl": "assets/fighters/tj-dillashaw.webp",
    "thumbUrl": "assets/fighters/tj-dillashaw-thumb.webp"
  },
  "Tito Ortiz": {
    "displayName": "Tito “The Huntington Beach Bad Boy” Ortiz",
    "profileDisplayName": "Tito “The Huntington Beach Bad Boy” Ortiz",
    "resumeTag": "Early UFC title king",
    "watchUrl": "https://youtube.com/shorts/oz2yVJTttC8?si=IPyqNy4AkugoWVfi",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/ZBNj8YBmzww?is=TfJb_wVvXgyVBrO6",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "LHW",
    "oneLiner": "A five-defense early UFC light heavyweight king with real title volume, huge star aura, and a ceiling capped by era strength plus Randy/Chuck losses.",
    "whyRankedHere": "Ortiz ranks here because five UFC title defenses are too much championship volume to bury. Even after early-era discounts, his title reign gives him more championship meat than most short-window champions.",
    "whyNotHigher": "He does not rank higher because the defense slate is not as strong as later elite reigns, the early light heavyweight division gets a depth discount, and the prime losses to Randy Couture and Chuck Liddell clearly cap the best-light-heavyweight claim.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "Six official title-fight wins are discounted to 5.20 adjusted title wins for early-era depth and opponent strength."
      ],
      [
        "No single title bump",
        "No title win or defense is credited above 1.00. Tito’s championship score is volume-driven."
      ],
      [
        "Wanderlei context",
        "The Wanderlei title win gets strong UFC credit, but Pride achievements are not scored as Tito’s UFC resume value."
      ],
      [
        "Ken Shamrock timing",
        "Shamrock I gets meaningful title-defense credit; Shamrock II and III are heavily timing-discounted."
      ],
      [
        "Bader upset",
        "The Ryan Bader upset helps the win ledger but does not restart Tito’s prime."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Five defenses",
        "Real UFC championship volume, discounted for early-era depth rather than ignored."
      ],
      [
        "Chuck rivalry",
        "The rivalry is historically huge, but two prime/late-prime finish losses are major scoring damage."
      ],
      [
        "Randy loss",
        "A clean title loss to a champion/top-5 level opponent cuts the reign off clearly."
      ],
      [
        "Opponent quality",
        "Famous names are useful, but timing and early-era strength keep Quality Wins controlled."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.75,
      "window": "Wanderlei Silva title win through Ken Shamrock I defense",
      "components": {
        "peakStatus": 0.9,
        "eliteOpponentProof": 0.85,
        "separationDominance": 0.85,
        "divisionStrength": 0.4,
        "cleanApexAura": 0.75
      },
      "notes": "Tito had major UFC aura and real early-LHW control, capped by early-era depth and later Randy/Chuck proof."
    },
    "primeDominanceSummary": {
      "score": 18.25,
      "components": {
        "primeRecord": 4.35,
        "primeRoundsWon": 4.65,
        "titleDefenseDominance": 3.5,
        "finishStoppageDominance": 2.85,
        "lossSafetyDurability": 1.75,
        "divisionStrength": 1.15
      },
      "notes": "Strong title-defense volume and wrestling control, but prime finish losses and early-LHW strength keep it below elite dominance tier."
    },
    "finalTakeaway": "Ortiz is a real UFC-only title-volume case. He belongs above many short-title and contender-heavy resumes, but below deeper modern champion resumes with better opponent quality and cleaner prime dominance.",
    "packetStatus": {
      "stage": "complete first-pass packet; early-era title reign and loss context reviewed; round-control rows included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add Watch Moment when URL is provided; add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/tito-ortiz.js",
      "centralPacket": "assets/data/fighter-packets/tito-ortiz.js",
      "watchMoment": "No Watch Moment URL provided yet.",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Ortiz is the early UFC light heavyweight title-volume case: one belt, five defenses, huge star aura, and a reign that still matters after era discounts.",
      "peak": "At his best, Tito was a pressure-wrestling champion who controlled early UFC light heavyweight with top-heavy ground-and-pound.",
      "resume": "The resume has strong championship volume, but the Quality Wins ledger is thinner and more timing-discounted than modern champion resumes.",
      "counter": "The counterargument is era depth: the defense count is big, but the opponent slate and Chuck/Randy losses cap the all-time ceiling.",
      "edge": "Ortiz wins comparisons when championship volume matters more than modern depth or cleaner prime loss profiles.",
      "eliteCounter": true,
      "signatureWins": "Wanderlei Silva, Ken Shamrock, Vitor Belfort, Forrest Griffin, Evan Tanner, Vladimir Matyushenko, Ryan Bader.",
      "weakness": "Early-era strength discount, weaker defense slate, and prime/late-prime losses to Randy Couture and Chuck Liddell.",
      "titleSummary": "UFC light heavyweight champion with five successful title defenses and 5.20 adjusted title wins.",
      "primeSummary": "Early UFC LHW control reign with major star aura, then clear ceiling against Randy and Chuck.",
      "bestArgument": "The best argument is simple: five UFC title defenses is championship volume most fighters in this rank zone cannot match.",
      "titleStyle": "Early UFC Reign",
      "primeStyle": "Ground-and-Pound Standard"
    },
    "photoUrl": "assets/fighters/tito-ortiz.webp",
    "thumbUrl": "assets/fighters/tito-ortiz-thumb.webp"
  },
  "Tom Aspinall": {
    "divisionLabel": "HW",
    "resumeTag": "Explosive heavyweight champion",
    "photoUrl": "assets/fighters/tom-aspinall.webp",
    "thumbUrl": "assets/fighters/tom-aspinall-thumb.webp",
    "oneLiner": "The heavyweight speed-and-finishing case: eight UFC wins, eight finishes, two interim-title wins, and a freak-injury loss that does not represent a competitive defeat.",
    "whyRankedHere": "Aspinall earns his place through perfect UFC finishing efficiency, elite first-round wins over Sergei Pavlovich and Curtis Blaydes, an Alexander Volkov submission, and two interim-title victories. The shared model also recognizes that his only official UFC loss was a 15-second knee injury rather than a normal competitive defeat.",
    "whyNotHigher": "He does not rank higher because the championship volume and active elite window are still short. He has two UFC title-fight wins, no completed undisputed title defense, and fewer top-five wins than Stipe Miocic, Francis Ngannou, and the deepest heavyweight resumes.",
    "keyJudgmentCalls": [
      [
        "Prime start",
        "Alexander Volkov begins the connected elite heavyweight window."
      ],
      [
        "Curtis Blaydes I",
        "the 15-second knee injury remains an official loss but is treated as a freak technical result with no normal loss penalty."
      ],
      [
        "Interim title wins",
        "Pavlovich and the Blaydes rematch receive partial interim-title credit under the shared Championship rules."
      ],
      [
        "Ciryl Gane no contest",
        "excluded from scoring and title-win credit; Aspinall retained the undisputed title."
      ],
      [
        "Heavyweight depth",
        "receives a modest era-depth discount because the top end is dangerous but the full division is thinner than elite lightweight and welterweight eras."
      ]
    ],
    "finalTakeaway": "Aspinall is already a serious UFC heavyweight peak case: fast, technically complete, title-proven, and perfect as a finisher. He needs completed undisputed defenses and more elite wins to become a top-tier all-time heavyweight resume.",
    "watchUrl": "https://youtube.com/shorts/d3yyyrC5Uak?is=2K29DezdqgreGAgg",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/sb3K8AuzrMc?is=vpfnb2vD4aPgWFxt",
    "signatureFightLabel": "Watch Signature Fight",
    "displayName": "Tom “Honey Badger” Aspinall",
    "profileDisplayName": "Tom “Honey Badger” Aspinall",
    "photoUnavailable": false,
    "photoStatus": "verified",
    "compareProfile": {
      "shortCase": "Aspinall is the heavyweight speed-and-finishing case: an 8-1 UFC record with one no contest, eight finishes, two interim-title wins, and no normal competitive loss inside his reviewed prime.",
      "peak": "At his best he combines rare heavyweight speed, clean boxing, submission threat, and first-round finishing authority.",
      "resume": "Volkov, Pavlovich, Blaydes, Tybura, Spivac, and Arlovski give him a strong modern heavyweight ledger, but the total UFC volume is still short.",
      "prime": "The prime starts with the Volkov submission and remains open. The Blaydes knee injury is treated as a technical exception, followed by three straight first-round finishes.",
      "counter": "The strongest counterargument is ceiling: his speed, skill, and finishing rate may make him the better fighter than several heavyweights ranked above him.",
      "edge": "He wins comparisons against thinner contender cases through perfect finishing efficiency, title-level proof, and the absence of a real competitive prime loss.",
      "signatureWins": "Sergei Pavlovich, Curtis Blaydes, Alexander Volkov, and Marcin Tybura define the UFC-only case.",
      "weakness": "Only two UFC title-fight wins, a short elite window, and no completed undisputed title defense keep the resume below the established heavyweight champions.",
      "titleSummary": "Won the interim heavyweight title over Pavlovich, defended it against Blaydes, and later became undisputed champion by elevation; the Gane defense was a no contest.",
      "primeSummary": "An open 4-0 scored prime from Volkov forward, plus one freak-injury technical result and one excluded no contest.",
      "titleStyle": "interimToUndisputedHeavyweight",
      "primeStyle": "shortExplosiveHeavyweightPrime"
    }
  },
  "Tony Ferguson": {
    "displayName": "Tony “El Cucuy” Ferguson",
    "profileDisplayName": "Tony “El Cucuy” Ferguson",
    "resumeTag": "Uncrowned lightweight terror",
    "watchUrl": "https://youtube.com/shorts/kwNQdTKvQbY?is=yeoa3ANZBlAMfEpv",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/PzrI9PY8gw4?is=DxvbhDuWHC4j1j__",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "LW / WW",
    "oneLiner": "A 12-fight-streak lightweight nightmare with interim-title value and elite prime dominance, capped by no undisputed belt and a brutal late-career collapse.",
    "whyRankedHere": "Ferguson lands here because the 12-fight UFC win streak, interim title, and brutal lightweight schedule make his prime impossible to ignore.",
    "whyNotHigher": "He does not rank higher because he never won the undisputed UFC lightweight title, never defended a UFC belt, and the Gaethje fight ended his run toward the top of the division.",
    "bigAssumptions": [
      [
        "Interim title",
        "Tony gets real credit for beating Kevin Lee for the interim belt, but it is not treated the same as winning the undisputed championship."
      ],
      [
        "Prime window",
        "His prime runs through the Justin Gaethje fight because that was the title-level moment where the streak finally broke."
      ],
      [
        "Late-career skid",
        "The Oliveira fight and everything after are treated as decline-stage results, so the late skid does not erase the 12-fight-streak version of Tony."
      ],
      [
        "Lightweight era",
        "The strength of the lightweight division gives extra weight to the RDA, Barboza, Lee, Pettis, and Cerrone run."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Title ceiling",
        "The interim belt matters, but the missing undisputed title keeps his championship resume capped."
      ],
      [
        "Gaethje fight",
        "The Gaethje loss counts because it happened at the end of Tony’s real title push."
      ],
      [
        "Late skid",
        "The losing streak hurts the story, but it is not treated like peak Tony losing eight straight."
      ],
      [
        "Peak danger",
        "At his best, Tony’s pace, elbows, scrambles, cardio, and submission threat made him one of lightweight’s scariest matchups."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.85,
      "window": "12-fight streak through interim title / Gaethje fight",
      "components": {
        "peakStatus": 1.2,
        "eliteOpponentProof": 1.05,
        "separationDominance": 1.05,
        "divisionStrength": 1,
        "cleanApexAura": 0.55
      },
      "notes": "Tony was not undisputed champion, but his peak lightweight danger, pace, durability, and streak created real uncrowned-champ aura."
    },
    "primeDominanceSummary": {
      "score": 20.85,
      "components": {
        "primeRecord": 6.1,
        "primeRoundsWon": 4.35,
        "titleDefenseDominance": 0.75,
        "finishStoppageDominance": 4.5,
        "lossSafetyDurability": 3.55,
        "divisionStrength": 1.6
      },
      "notes": "Prime runs through Gaethje, so the title-level loss is included, but the core streak still grades as elite."
    },
    "finalTakeaway": "Tony is the classic uncrowned-champion case: terrifying prime, elite lightweight streak, real interim-title value, but thin official championship hardware.",
    "packetStatus": {
      "stage": "complete first-pass packet; prime runs through Gaethje, interim-title logic, quality ledger, compare seasoning, fight ledger, nickname, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows next rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/tony-ferguson.js",
      "centralPacket": "assets/data/fighter-packets/tony-ferguson.js",
      "watchMoment": "assets/js/watch-moments.js",
      "nickname": "assets/js/card-nicknames.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Tony is the uncrowned lightweight terror case: 12-fight UFC win streak, interim title, elite lightweight wins, and a prime that felt like chaos no one wanted.",
      "peak": "At his apex, Tony was pace, elbows, scrambles, cardio, submissions, cuts, and impossible momentum.",
      "resume": "The resume is great by lightweight contender standards but thin by title-reign standards.",
      "counter": "The counter is official hardware: no undisputed title, no defenses, and Gaethje broke the title case.",
      "edge": "Tony wins comparisons when prime danger, streak value, and lightweight division strength matter more than official title volume.",
      "eliteCounter": false,
      "signatureWins": "Rafael dos Anjos, Edson Barboza, Kevin Lee, Anthony Pettis, Donald Cerrone, Josh Thomson, Gleison Tibau.",
      "weakness": "No undisputed UFC title and a brutal post-prime skid.",
      "titleSummary": "Interim UFC lightweight champion; no undisputed UFC title wins.",
      "primeSummary": "Prime runs from Tibau/Josh Thomson through the Gaethje title-level loss.",
      "bestArgument": "Few non-undisputed champions ever felt more champion-level during their best UFC stretch.",
      "titleStyle": "Uncrowned Lightweight Terror",
      "primeStyle": "12-Fight-Streak Chaos Prime"
    },
    "photoUrl": "assets/fighters/tony-ferguson.webp",
    "thumbUrl": "assets/fighters/tony-ferguson-thumb.webp"
  },
  "Tyron Woodley": {
    "displayName": "Tyron “The Chosen One” Woodley",
    "profileDisplayName": "Tyron “The Chosen One” Woodley",
    "resumeTag": "Welterweight title reign",
    "watchUrl": "https://youtube.com/shorts/l6zNZ9e3UzI?si=hjrJtxKUri3XWzdC",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/knOFYm1it0k?is=U-dOgX681hEz_cPf",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "WW",
    "oneLiner": "A real UFC welterweight champion case: Lawler, Wonderboy, Maia, and Till title value, with Burns included as the end of the prime window.",
    "whyRankedHere": "Woodley ranks here because his UFC-only title resume is stronger than casual memory usually gives it credit for: he won the welterweight belt and added multiple title-level results before Usman ended the prime window and Burns confirmed the decline.",
    "whyNotHigher": "He does not rank higher because the resume depth falls off after the title names, the round-control profile was inconsistent, and Usman clearly ended the prime window, while Burns confirmed the decline.",
    "bigAssumptions": [
      [
        "Prime extension",
        "The prime window extends through Gilbert Burns, so Burns counts as a prime elite decision loss."
      ],
      [
        "Post-prime line",
        "Colby Covington and Vicente Luque are treated as post-prime decline losses, not additional loss-penalty charges."
      ],
      [
        "Wonderboy draw",
        "The first Thompson fight is context only, not a title-fight win."
      ],
      [
        "Condit win",
        "Gets partial quality credit because of injury context."
      ],
      [
        "Round control",
        "Round rows are best-effort and should be audited in the next full scoring-table rebuild."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Lawler title win",
        "Big championship and apex proof."
      ],
      [
        "Wonderboy rematch",
        "Full title-defense credit, but close-fight context keeps dominance down."
      ],
      [
        "Maia defense",
        "Strong title defense value, lower dominance/aesthetic credit."
      ],
      [
        "Burns loss",
        "Now counted as an end-of-prime elite decision loss."
      ]
    ],
    "apexPeakSummary": {
      "score": 3.75,
      "window": "Robbie Lawler 2016 through Darren Till 2018",
      "components": {
        "peakStatus": 0.75,
        "eliteOpponentProof": 1,
        "separationDominance": 0.75,
        "divisionStrength": 0.75,
        "cleanApexAura": 0.5
      },
      "notes": "Lawler-through-Till is a real champion apex, capped by the Thompson/Maia low-output context."
    },
    "primeDominanceSummary": {
      "score": 16.2,
      "notes": "Strong title-prime results and durability, but low-output rounds plus Usman/Burns losses keep it below cleaner dominance champions."
    },
    "finalTakeaway": "Woodley is not an inner-circle GOAT, but he belongs above most short-reign champion cases because the UFC title resume is too strong to bury.",
    "packetStatus": {
      "stage": "complete first-pass packet; prime window includes Burns; round-control rows included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data-additions.js",
      "centralPacket": "assets/data/fighter-packets/tyron-woodley.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Woodley is a real welterweight title-reign case: 4 UFC title-fight wins, strong title names, and good prime durability.",
      "peak": "At his best, Woodley was explosive, defensively sharp, and dangerous in short moments.",
      "resume": "The resume is title-heavy more than deep-volume: Lawler, Wonderboy, Maia, Till, Gastelum, Condit, Kim, and Koscheck.",
      "counter": "The counterargument is that his reign had too many low-output stretches and Usman ended the prime window and Burns confirmed the decline.",
      "edge": "Woodley wins comparisons when title-fight wins and champion durability matter more than pace/aesthetics.",
      "eliteCounter": true,
      "signatureWins": "Robbie Lawler, Stephen Thompson, Demian Maia, Darren Till, Kelvin Gastelum, Carlos Condit, Dong Hyun Kim.",
      "weakness": "Inconsistent round dominance, thin depth after title names, and a clear Usman endpoint and Burns decline confirmation.",
      "titleSummary": "Won the UFC welterweight title and defended it three times.",
      "primeSummary": "Strong champion-prime results, but low-output stretches and Burns extension cap the dominance score.",
      "bestArgument": "Woodley has more real UFC title-fight value than most fighters in this rank zone.",
      "titleStyle": "Strong Welterweight Reign",
      "primeStyle": "Explosive Defensive Champion"
    },
    "photoUrl": "assets/fighters/tyron-woodley.webp",
    "thumbUrl": "assets/fighters/tyron-woodley-thumb.webp"
  },
  "Valentina Shevchenko": {
    "photoUrl": "assets/fighters/valentina-shevchenko.webp",
    "thumbUrl": "assets/fighters/valentina-shevchenko-thumb.webp",
    "watchUrl": "https://youtube.com/shorts/cucTCAAGTis?is=mf6p21fPtBheJuU8",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/bM9I7FEGZZA?is=JiQtLvizH4HgX5yE",
    "signatureFightLabel": "Watch Signature Fight",
    "compareProfile": {
      "shortCase": "Valentina is the clean technical champion case: long flyweight reign, elite skill, high opponent quality, and a resume that only trails Nunes because of direct rivalry and two-division title value.",
      "peak": "At her best, Valentina was balance, timing, counters, clinch control, kicks, grappling, and five-round composure. She made championship fights feel controlled and technical.",
      "resume": "Valentina’s UFC resume is built on flyweight dominance plus high-level bantamweight context. The Nunes losses matter, but they also show she was competitive with the women’s GOAT standard.",
      "counter": "The argument against Valentina is Nunes. She came close, but Nunes owns the direct edge and the stronger two-division championship case.",
      "edge": "Valentina wins comparisons when technical dominance, long flyweight control, and active elite years outweigh bigger but shorter peak cases.",
      "eliteCounter": true,
      "signatureWins": "Joanna, Andrade, Holm, Julianna, Chookagian, Murphy, Carmouche, Maia, Santos, Grasso, and Eye give Valentina a deep women’s UFC resume.",
      "titleSummary": "Valentina’s title case is a long flyweight reign with repeated defenses and a title regain, but it does not have Nunes’ two-division separation.",
      "primeSummary": "Her elite window was long and technical, with years of title-level control across bantamweight and flyweight.",
      "titleStyle": "Technical Flyweight Standard",
      "primeStyle": "Long Technical Prime",
      "weakness": "The Nunes rivalry and Grasso stretch prevent a completely clean women’s GOAT case.",
      "bestArgument": "Valentina's case starts with technical dominance: a long flyweight reign, repeated defenses, a title regain, and years of elite control across two divisions."
    },
    "divisionLabel": "FLW / BW",
    "resumeTag": "Technical flyweight standard",
    "oneLiner": "The clean technical champion case: long flyweight reign, elite skill, strong opponent quality, and direct rivalry context behind Nunes.",
    "whyRankedHere": "Valentina ranks women’s #2 because her UFC flyweight reign was long, technical, and consistent. She also has meaningful bantamweight context, strong opponent quality, and years of title-level control.",
    "whyNotHigher": "She does not pass Nunes because Nunes owns the direct rivalry edge and the stronger two-division title case. Valentina’s flyweight reign is excellent, but Nunes has the cleaner women’s GOAT separation.",
    "keyJudgmentCalls": [
      [
        "Nunes rivalry",
        "central reason she trails Amanda even with elite technical dominance."
      ],
      [
        "Flyweight reign",
        "the backbone of her ranking and the best women’s flyweight title case."
      ],
      [
        "Grasso rivalry",
        "adds both damage and title-regain context."
      ],
      [
        "Bantamweight context",
        "helps opponent quality but does not replace flyweight title value."
      ],
      [
        "Technical dominance",
        "a major reason her OVR stays close to Nunes."
      ]
    ],
    "finalTakeaway": "Valentina is the women’s technical standard: long-reigning, complete, and consistent, but direct rivalry and two-division value keep Nunes ahead.",
    "packetStatus": {
      "stage": "packet live; UFC-only record corrected; photos and Watch Moment needed",
      "lastUpdated": "2026-07-10",
      "nextFix": "Add Valentina photos and Watch Moment link."
    },
    "repoLocations": {
      "scoreSource": "assets/data/ranking-data.js",
      "centralPacket": "assets/data/fighter-packets/valentina-shevchenko.js",
      "compareFallback": "assets/compare-coverage-pack-2.js"
    }
  },
  "Vitor Belfort": {
    "thumbUrl": "assets/fighters/vitor-belfort-thumb.webp",
    "photoUrl": "assets/fighters/vitor-belfort.webp",
    "photoNote": "",
    "signatureFightUrl": "https://www.youtube.com/watch?v=St35ub7lmNg",
    "signatureFightLabel": "Watch Signature Fight",
    "watchUrl": "https://youtube.com/shorts/Egqw0YGlkV0?is=2HmxpxhvOy_-xXyy",
    "watchLabel": "Watch Moment",
    "oneLiner": "A three-era knockout threat whose explosive finishing, five Top-5 wins, and violent 2013 contender run created a dangerous but uneven UFC legacy.",
    "whyRankedHere": "Belfort ranks here because he produced elite UFC wins across an extraordinary span. His ledger includes Rich Franklin, Randy Couture, Michael Bisping, Luke Rockhold, Dan Henderson, Wanderlei Silva, and Anthony Johnson, while fifteen UFC wins and a 93% finishing rate give the resume rare offensive force and longevity.",
    "whyNotHigher": "He does not rank higher because the championship case is thin and unusual: his only undisputed title win came through an early cut stoppage over Randy Couture, and he never defended the belt. Prime finish losses to Anderson Silva, Jon Jones, and Chris Weidman create major drag, while ten official UFC losses make the total resume far less stable than the champions above him.",
    "packetStatus": {
      "stage": "live profile copy audited",
      "lastUpdated": "2026-07-16",
      "nextFix": "None."
    },
    "repoLocations": {
      "centralPacket": "assets/data/fighter-packets/vitor-belfort.js",
      "displayFallback": "assets/data/fighter-packets/vitor-belfort.js"
    }
  },
  "Zhang Weili": {
    "displayName": "Zhang “Magnum” Weili",
    "profileDisplayName": "Zhang “Magnum” Weili",
    "resumeTag": "Strawweight two-reign force",
    "watchUrl": "https://youtube.com/shorts/ZhdI2_I58YQ?is=TuRcxor17qZxSwUC",
    "watchLabel": "Watch Moment",
    "signatureFightUrl": "https://youtu.be/i_AL3LLUnHY?is=n4qx06JN_inLPn64",
    "signatureFightLabel": "Watch Signature Fight",
    "divisionLabel": "SW / FLW",
    "oneLiner": "A two-time UFC strawweight champion with six title-fight wins, a dominant second reign, elite Joanna/Andrade/Suarez proof, and Rose as the clear ceiling on the case.",
    "whyRankedHere": "Zhang belongs in the elite women’s UFC tier because the title resume is serious: two strawweight reigns, six title-fight wins, four defenses, a dominant second reign, and direct wins over Joanna.",
    "whyNotHigher": "She does not pass the top women’s benchmarks because Rose beat her twice in the heart of her title years, and the Valentina challenge did not create a two-division UFC title case. The second reign is elite, but the loss column keeps the ceiling clear.",
    "bigAssumptions": [
      [
        "Adjusted title wins",
        "All six title-fight wins receive 1.00 adjusted credit; no single win is inflated above 1.00."
      ],
      [
        "Quality Wins cap",
        "Andrade is the only 1.25 Quality Win because it is a reigning-champ title-win exception. Suarez and Joanna I are full 1.00, not above-cap bumps."
      ],
      [
        "Prime start",
        "Prime starts with the Andrade title win. Earlier UFC wins support the resume but do not define the elite window."
      ],
      [
        "Valentina loss",
        "Reduced upward-division elite-loss treatment applies because Zhang moved up to challenge an elite flyweight champion."
      ],
      [
        "Rose losses",
        "Both Rose losses are counted prime damage and are the main ceiling on the case."
      ]
    ],
    "keyJudgmentCalls": [
      [
        "Second reign",
        "The Esparza/Lemos/Yan/Suarez stretch is the core of her high-end ranking."
      ],
      [
        "Joanna rivalry",
        "Zhang owns the UFC series 2-0, with one classic defense and one violent rematch finish."
      ],
      [
        "Rose ceiling",
        "Two in-prime title losses to Rose prevent a clean top-women claim."
      ],
      [
        "Valentina context",
        "The flyweight title loss hurts lightly, not like a same-division title loss."
      ],
      [
        "Strawweight context",
        "Strong women’s division context, especially compared with thinner women’s title divisions."
      ]
    ],
    "apexPeakSummary": {
      "score": 4.85,
      "window": "Esparza title reclaim through Suarez defense",
      "components": {
        "peakStatus": 1.3,
        "eliteOpponentProof": 1.15,
        "separationDominance": 1.05,
        "divisionStrength": 0.65,
        "cleanApexAura": 0.7
      },
      "notes": "Clear best-strawweight claim during the second reign, capped from max by the Rose losses."
    },
    "primeDominanceSummary": {
      "score": 23,
      "components": {
        "primeRecord": 5.25,
        "primeRoundsWon": 5.75,
        "titleDefenseDominance": 4,
        "finishStoppageDominance": 3.25,
        "lossSafetyDurability": 3,
        "divisionStrength": 1.75
      },
      "notes": "Strong five-round control and improved grappling during the second reign, with Rose losses preventing a spotless dominance case."
    },
    "finalTakeaway": "Zhang is a high-end women’s UFC GOAT candidate: two reigns, six title-fight wins, real strawweight dominance, and enough loss context to sit below the Nunes/Valentina benchmark tier.",
    "packetStatus": {
      "stage": "complete first-pass packet; strawweight title case, win ledger, loss context, round-control rows, compare seasoning, ledger, and Watch Moment included",
      "lastUpdated": "2026-07-06",
      "nextFix": "Add real photos after source images are uploaded; audit exact round-control rows during next full scoring-table rebuild."
    },
    "repoLocations": {
      "scoreSource": "assets/data/fighter-packets/zhang-weili.js",
      "centralPacket": "assets/data/fighter-packets/zhang-weili.js",
      "watchMoment": "assets/js/watch-moments.js",
      "tracker": "docs/fighter-status.md",
      "photos": "No real photo files loaded yet; app should use initials fallback."
    },
    "compareProfile": {
      "shortCase": "Zhang is the two-reign strawweight force: six UFC title-fight wins, direct Joanna separation, a dominant second reign, and strong Andrade/Esparza/Suarez proof.",
      "peak": "At her best, Zhang was pace, strength, striking danger, clinch physicality, improved wrestling, and five-round control. The second reign showed the complete version.",
      "resume": "Her UFC resume is built on strawweight title volume and elite divisional wins. Rose is the ceiling, but Zhang’s comeback reign is one of the strongest women’s UFC arcs.",
      "counter": "The counterargument is Rose. Losing the belt and the rematch in-prime prevents Zhang from claiming the cleanest women’s UFC case.",
      "edge": "Zhang wins comparisons when two-reign title value, strawweight dominance, and direct Joanna separation matter more than longer but less explosive resumes.",
      "eliteCounter": true,
      "signatureWins": "Jessica Andrade, Joanna Jedrzejczyk twice, Carla Esparza, Tatiana Suarez, Amanda Lemos, Yan Xiaonan, and Tecia Torres.",
      "weakness": "Two Rose losses and the failed Valentina flyweight title challenge cap the overall case.",
      "titleSummary": "Two-time UFC strawweight champion with six official and adjusted title-fight wins.",
      "primeSummary": "Dominant second reign with elite control, improved grappling, and strong title-defense proof.",
      "bestArgument": "The best argument is that Zhang combined elite title volume with a higher peak than most women’s champions below the Nunes/Valentina tier.",
      "titleStyle": "Two-Reign Strawweight Champion",
      "primeStyle": "Complete Second-Reign Prime"
    },
    "photoUrl": "assets/fighters/zhang-weili.webp",
    "thumbUrl": "assets/fighters/zhang-weili-thumb.webp"
  }
};
