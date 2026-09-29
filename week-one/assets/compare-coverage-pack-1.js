(function () {
  const PACK_PROFILES = {
    "Randy Couture": {
      shortCase: "Couture is the chaos-era championship case: heavyweight gold, light heavyweight gold, huge title moments, and a resume that looks messy because he kept taking dangerous fights.",
      peak: "At his best, Couture was game-planning, clinch control, dirty boxing, wrestling pressure, and veteran nerve. He was rarely the prettiest athlete, but he repeatedly solved bigger or more explosive champions.",
      resume: "Couture's UFC case is built around title moments across two divisions. The losses hurt, but the championship achievements are too loud to treat him like a normal flawed contender.",
      championship: "The title case is the whole argument: multiple UFC championship runs, heavyweight and light heavyweight value, and some of the most important upset wins in early UFC history.",
      opponentQuality: "Sylvia, Liddell, Ortiz, Belfort, Rizzo, Randleman, Gonzaga, and Coleman give Couture a deep era-spanning UFC win list.",
      longevity: "Couture's longevity is unusual because he stayed relevant across weight classes and eras, but the case is also dragged down by losses and late-career damage.",
      counter: "The case against Couture is the record. He has more losses than the cleaner GOAT candidates, so his ranking depends on how much credit you give for title risk and era context.",
      edge: "Couture wins comparisons when championship moments, two-division relevance, and title-fight difficulty matter more than clean record aesthetics.",
      eliteCounter: true,
      signatureWins: "Sylvia, Liddell, Ortiz, Belfort, Rizzo twice, Randleman, Gonzaga, and Coleman give Couture one of the most important old-school UFC win lists.",
      titleSummary: "Couture's title case is built on winning UFC gold at heavyweight and light heavyweight, with repeated championship upsets and major title-fight moments.",
      primeSummary: "His best years were not one smooth prime; they were multiple veteran surges across divisions, which makes the case impressive but messy.",
      titleStyle: "twoDivisionChaosChampion",
      primeStyle: "veteranEraSurges",
      legacyStats: {
        titleFightWins: 8,
        beltsWon: 2,
        titleDefenses: 3,
        activeEliteYearsLabel: "roughly 7 active elite years",
        primeNote: "multiple veteran surges across heavyweight and light heavyweight rather than one clean uninterrupted prime"
      }
    },
    "Daniel Cormier": {
      shortCase: "Cormier is the elite two-division champion case: light heavyweight title wins, heavyweight gold, strong opponent quality, and only losing ground because the Jones rivalry blocks the very top tier.",
      peak: "At his best, Cormier was pressure, wrestling, clinch work, durability, and championship composure. He could fight elite opponents at light heavyweight or heavyweight and still look like one of the best fighters in the world.",
      resume: "Cormier's UFC resume is compact but elite: two-division champion, strong title-fight wins, and major victories over contenders and champions.",
      championship: "The championship case is strong because he won UFC titles in two divisions and defended both belts, even if the Jones rivalry keeps the light heavyweight story from feeling fully clean.",
      opponentQuality: "Stipe, Anthony Johnson twice, Gustafsson, Oezdemir, Derrick Lewis, Dan Henderson, and Josh Barnett context give Cormier a strong high-end resume, with Strikeforce treated only as historical context.",
      longevity: "Cormier's UFC elite window was not extremely long, but it was dense. Almost every major UFC fight was title-level or close to it.",
      counter: "The counterargument is direct separation. Jones beat him, and Stipe won the trilogy, so Cormier has two major rivalry ceilings in the all-time debate.",
      edge: "Cormier wins comparisons when two-division title value and elite opponent quality outweigh rivalry losses to other all-time greats.",
      eliteCounter: true,
      signatureWins: "Stipe, Anthony Johnson twice, Gustafsson, Oezdemir, Derrick Lewis, Dan Henderson, and Anderson Silva give Cormier a strong UFC title-level win list.",
      titleSummary: "Cormier won UFC gold at light heavyweight and heavyweight, defended both belts, and built a dense title-fight resume in a short UFC window.",
      primeSummary: "His UFC prime was compact but packed with title fights, elite opponents, and very few low-value appearances.",
      titleStyle: "compactTwoDivisionChampion",
      primeStyle: "denseEliteWindow",
      legacyStats: {
        titleFightWins: 6,
        beltsWon: 2,
        titleDefenses: 4,
        activeEliteYearsLabel: "roughly 5 active elite years",
        primeNote: "compact UFC prime packed with title fights at light heavyweight and heavyweight"
      }
    },
    "Stipe Miocic": {
      shortCase: "Stipe is the best UFC heavyweight resume case: the strongest heavyweight title-run argument, major wins over champions, and trilogy separation over Cormier.",
      peak: "At his best, Stipe combined boxing, wrestling, cardio, durability, and calm decision-making better than almost any heavyweight champion.",
      resume: "Stipe's UFC case is heavyweight-specific but very strong. Heavyweight careers are volatile, and he still built one of the cleanest title resumes the division has seen.",
      championship: "The championship case is his separator: heavyweight title wins, defenses, the first Ngannou win, and the Cormier trilogy comeback.",
      opponentQuality: "Werdum, Overeem, dos Santos, Ngannou, Cormier twice, Hunt, Arlovski, and Nelson give Stipe the deepest UFC heavyweight win list.",
      longevity: "Stipe stayed elite through multiple heavyweight eras, though heavyweight volatility and the late Jones loss keep the back end from being spotless.",
      counter: "The counterargument is division ceiling. Heavyweight is chaotic and thinner than lightweight or welterweight, so Stipe needs championship weight to carry the case.",
      edge: "Stipe wins comparisons when heavyweight title value, champion wins, and the Cormier trilogy matter more than lighter-division depth.",
      eliteCounter: true,
      signatureWins: "Werdum, Overeem, dos Santos, Ngannou, Cormier twice, Hunt, Arlovski, and Nelson give Stipe the strongest UFC heavyweight win list.",
      titleSummary: "Stipe's title case is the UFC heavyweight standard: repeated title wins, multiple defenses, and the Cormier trilogy comeback.",
      primeSummary: "His prime lasted through several heavyweight waves, with enough durability and adaptability to survive a historically volatile division.",
      titleStyle: "heavyweightStandard",
      primeStyle: "heavyweightLongevity",
      legacyStats: {
        titleFightWins: 6,
        beltsWon: 1,
        titleDefenses: 4,
        activeEliteYearsLabel: "roughly 6 active elite years",
        primeNote: "the strongest UFC heavyweight title run, carried by champion wins and trilogy value"
      }
    },
    "Israel Adesanya": {
      shortCase: "Adesanya is the modern middleweight title-volume case: elite striking, repeated defenses, two wins over Whittaker, and a long run as the face of the division.",
      peak: "At his best, Izzy was distance, feints, counter-striking, takedown defense, and five-round control. He made elite middleweights fight at his rhythm.",
      resume: "Adesanya's UFC case is built on middleweight title volume and consistency, with the Pereira rivalry adding both a blemish and a major redemption moment.",
      championship: "His championship case is excellent at middleweight: title win, repeated defenses, a title regain, and multiple wins over the best contenders of his era.",
      opponentQuality: "Whittaker twice, Costa, Cannonier, Vettori twice, Gastelum, Pereira, Brunson, and Silva give Adesanya a deep modern middleweight ledger.",
      longevity: "Izzy's elite window is strong because he fought often, stayed at title level for years, and carried the middleweight division through a full era.",
      counter: "The counterargument is that the later losses and Pereira rivalry make the case less clean than the longest-reigning champions above him.",
      edge: "Adesanya wins comparisons when modern middleweight title volume, striking dominance, and repeated elite wins outweigh messy rivalry context.",
      eliteCounter: true,
      signatureWins: "Whittaker twice, Costa, Cannonier, Vettori twice, Gastelum, Pereira, Brunson, and Silva give Adesanya one of the best modern middleweight win lists.",
      titleSummary: "Adesanya's title case is built on a strong middleweight reign, repeated defenses, and a title regain after the Pereira loss.",
      primeSummary: "His elite window was active and title-heavy, with frequent five-round fights against the best middleweights of his era.",
      titleStyle: "modernMiddleweightVolume",
      primeStyle: "activeTitlePrime",
      legacyStats: {
        titleFightWins: 8,
        beltsWon: 1,
        titleDefenses: 5,
        activeEliteYearsLabel: "roughly 6 active elite years",
        primeNote: "active modern middleweight title run with a major Pereira redemption win"
      }
    },
    "B.J. Penn": {
      shortCase: "BJ Penn is the skill-and-two-division legacy case: lightweight champion, welterweight title upset over Hughes, elite talent, and a messy late record that drags the score down.",
      peak: "At his best, Penn was boxing, takedown defense, jiu-jitsu, balance, and natural fighting instinct. His peak skill level was much cleaner than his final record suggests.",
      resume: "Penn's UFC case has huge highs and ugly lows. The Hughes win and lightweight title run are real all-time material, but the late-career losses are impossible to ignore.",
      championship: "The championship case is strong because Penn won UFC titles at lightweight and welterweight, then defended lightweight gold during one of the division's defining early runs.",
      opponentQuality: "Hughes twice, Sherk, Florian, Sanchez, Stevenson, Pulver, and Uno give Penn real UFC value, with GSP and Hughes rivalry context shaping the case.",
      longevity: "Penn's true elite window was shorter than his calendar career. The later years should not inflate him; they mostly explain why the record looks so damaged.",
      counter: "Penn's argument is peak skill and two-division greatness. The argument against him is the record collapse and too many damaging losses after the best years.",
      edge: "Penn wins comparisons when peak skill, lightweight title value, and the Hughes upset outweigh a messy career arc.",
      eliteCounter: true,
      signatureWins: "Hughes twice, Sherk, Florian, Sanchez, Stevenson, Pulver, and Uno give Penn a real UFC-only win list, even without using non-UFC achievements as scoring value.",
      titleSummary: "Penn won UFC titles at lightweight and welterweight, with the Hughes upset and lightweight defenses carrying most of the championship value.",
      primeSummary: "His best UFC years were brilliant but not long enough to erase the late-career collapse.",
      titleStyle: "twoDivisionSkillChampion",
      primeStyle: "brilliantButMessyPrime",
      legacyStats: {
        titleFightWins: 5,
        beltsWon: 2,
        titleDefenses: 3,
        activeEliteYearsLabel: "roughly 6 active elite years",
        primeNote: "brilliant lightweight and welterweight peak with a late-career collapse that hurts the overall case"
      }
    },
    "Chuck Liddell": {
      shortCase: "Chuck is the classic light heavyweight champion case: knockout aura, title defenses, Tito and Couture rivalries, and one of the defining star runs of the early modern UFC.",
      peak: "At his best, Chuck was sprawl-and-brawl pressure, knockout power, defensive wrestling, and the confidence to force dangerous exchanges.",
      resume: "Chuck's UFC case is built on a real title reign and major rivalry wins, though the late knockout losses make the ending rough.",
      championship: "The championship case is strong for his era: he won the light heavyweight title, defended it multiple times, and was the face of the division during the UFC's breakout period.",
      opponentQuality: "Couture twice, Ortiz twice, Belfort, Sobral, Horn, Monson, and Mezger give Chuck a meaningful UFC win list with major rivalry value.",
      longevity: "Chuck's elite window had real weight, but the post-prime knockout losses clearly damage the back half of the case.",
      counter: "Chuck's argument is peak aura and era impact. The knock is that the resume is not as deep or clean as later light heavyweight and pound-for-pound cases.",
      edge: "Chuck wins comparisons when title-reign value, knockout aura, and era-defining star power matter more than clean longevity.",
      eliteCounter: true,
      signatureWins: "Couture twice, Ortiz twice, Belfort, Sobral, Horn, Monson, and Mezger give Chuck a strong light heavyweight era resume.",
      titleSummary: "Chuck's title case is a real light heavyweight reign with multiple defenses and major rivalry wins during the UFC's breakout years.",
      primeSummary: "His prime had huge knockout aura, but the ending was rough and keeps him below cleaner long-reign champions.",
      titleStyle: "classicLightHeavyweightReign",
      primeStyle: "knockoutAuraPrime",
      legacyStats: {
        titleFightWins: 5,
        beltsWon: 1,
        titleDefenses: 4,
        activeEliteYearsLabel: "roughly 5 active elite years",
        primeNote: "classic light heavyweight knockout prime with a rough post-prime ending"
      }
    }
  };

  const PACK_LEDGER = {
    "chuck liddell|randy couture": {
      fighters: ["Chuck Liddell", "Randy Couture"],
      fights: 3,
      winner: "Chuck Liddell",
      importance: "major",
      summary: "Couture beat Chuck first, but Liddell won the next two by knockout and took the rivalry separation during the light heavyweight title era."
    },
    "daniel cormier|stipe miocic": {
      fighters: ["Daniel Cormier", "Stipe Miocic"],
      fights: 3,
      winner: "Stipe Miocic",
      importance: "major",
      summary: "Cormier knocked out Stipe first, but Stipe won the next two and took the heavyweight trilogy. That gives Stipe the direct rivalry edge."
    },
    "daniel cormier|alexander gustafsson": {
      fighters: ["Daniel Cormier", "Alexander Gustafsson"],
      fights: 1,
      winner: "Daniel Cormier",
      importance: "major",
      summary: "Cormier beat Gustafsson in a close light heavyweight title fight, one of the strongest defenses in DC's UFC title run."
    },
    "francis ngannou|stipe miocic": {
      fighters: ["Francis Ngannou", "Stipe Miocic"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "Stipe controlled Ngannou in their first title fight, then Ngannou knocked him out in the rematch. The split keeps both heavyweight cases connected."
    },
    "alex pereira|israel adesanya": {
      fighters: ["Alex Pereira", "Israel Adesanya"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "Pereira stopped Adesanya to win the middleweight title, then Adesanya knocked Pereira out in the rematch to regain it. In UFC terms, the rivalry is split."
    },
    "israel adesanya|robert whittaker": {
      fighters: ["Israel Adesanya", "Robert Whittaker"],
      fights: 2,
      winner: "Israel Adesanya",
      importance: "major",
      summary: "Adesanya beat Whittaker twice, first to unify the middleweight title and later to defend it. Those wins are central to Izzy's title-era case."
    },
    "israel adesanya|marvin vettori": {
      fighters: ["Israel Adesanya", "Marvin Vettori"],
      fights: 2,
      winner: "Israel Adesanya",
      importance: "contextual",
      summary: "Adesanya beat Vettori twice, including a clear middleweight title defense, which helps show his repeated control over the division."
    },
    "b.j. penn|matt hughes": {
      fighters: ["B.J. Penn", "Matt Hughes"],
      fights: 3,
      winner: "B.J. Penn",
      importance: "major",
      summary: "Penn beat Hughes twice, including the welterweight title upset, while Hughes won the middle fight. The series is a huge part of Penn's two-division argument."
    },
    "b.j. penn|georges st-pierre": {
      fighters: ["B.J. Penn", "Georges St-Pierre"],
      fights: 2,
      winner: "Georges St-Pierre",
      importance: "major",
      summary: "GSP beat Penn twice, including a dominant championship rematch, which creates clear separation between them in the all-time debate."
    },
    "chuck liddell|tito ortiz": {
      fighters: ["Chuck Liddell", "Tito Ortiz"],
      fights: 2,
      winner: "Chuck Liddell",
      importance: "major",
      summary: "Liddell beat Ortiz twice in major light heavyweight rivalry fights, including a title defense that helped define Chuck's championship era."
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
