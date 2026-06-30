(function () {
  const LEDGER = {
    "jose aldo|max holloway": {
      fighters: ["Jose Aldo", "Max Holloway"],
      fights: 2,
      winner: "Max Holloway",
      importance: "major",
      summary: "Holloway finished Aldo twice in featherweight title fights, which gives Max direct separation even though Aldo's broader historical legacy remains massive."
    },
    "alexander volkanovski|max holloway": {
      fighters: ["Alexander Volkanovski", "Max Holloway"],
      fights: 3,
      winner: "Alexander Volkanovski",
      importance: "major",
      summary: "Volkanovski beat Holloway three times, took the featherweight belt from him, and owned the clearest head-to-head separation of their shared era."
    },
    "alexander volkanovski|jose aldo": {
      fighters: ["Alexander Volkanovski", "Jose Aldo"],
      fights: 1,
      winner: "Alexander Volkanovski",
      importance: "major",
      summary: "Volkanovski beat Aldo before winning the belt, giving Volk a clean bridge win between featherweight eras."
    },
    "conor mcgregor|max holloway": {
      fighters: ["Conor McGregor", "Max Holloway"],
      fights: 1,
      winner: "Conor McGregor",
      importance: "contextual",
      summary: "Conor beat a young Holloway in 2013. That matters historically, but Max later built a much deeper long-term resume, so the head-to-head note does not automatically decide the all-time ranking."
    },
    "conor mcgregor|jose aldo": {
      fighters: ["Conor McGregor", "Jose Aldo"],
      fights: 1,
      winner: "Conor McGregor",
      importance: "major",
      summary: "Conor knocked out Aldo in 13 seconds, one of the biggest legacy moments in UFC history. Aldo still has the larger long-term featherweight legacy, but that head-to-head result is impossible to ignore."
    },
    "conor mcgregor|khabib nurmagomedov": {
      fighters: ["Conor McGregor", "Khabib Nurmagomedov"],
      fights: 1,
      winner: "Khabib Nurmagomedov",
      importance: "major",
      summary: "Khabib submitted Conor in their lightweight title fight, which gives Khabib direct separation in one of the most important fights of the modern era."
    },
    "demetrious johnson|henry cejudo": {
      fighters: ["Demetrious Johnson", "Henry Cejudo"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "DJ finished Cejudo in their first fight, then Cejudo edged the rematch to win the flyweight title. The split head-to-head keeps the debate nuanced instead of one-sided."
    },
    "dominick cruz|demetrious johnson": {
      fighters: ["Dominick Cruz", "Demetrious Johnson"],
      fights: 1,
      winner: "Dominick Cruz",
      importance: "contextual",
      summary: "Cruz beat DJ at bantamweight before DJ became the flyweight standard. It matters historically, but it should be treated with division and career-stage context."
    },
    "dominick cruz|henry cejudo": {
      fighters: ["Dominick Cruz", "Henry Cejudo"],
      fights: 1,
      winner: "Henry Cejudo",
      importance: "contextual",
      summary: "Cejudo finished Cruz in Cruz's comeback-era bantamweight title challenge. It helps Cejudo's compact legacy, but Cruz's broader case still needs injury and layoff context."
    },
    "georges st-pierre|matt hughes": {
      fighters: ["Georges St-Pierre", "Matt Hughes"],
      fights: 3,
      winner: "Georges St-Pierre",
      importance: "major",
      summary: "Hughes beat young GSP first, but GSP won the next two and took clear generational separation at welterweight."
    },
    "georges st-pierre|bj penn": {
      fighters: ["Georges St-Pierre", "BJ Penn"],
      fights: 2,
      winner: "Georges St-Pierre",
      importance: "major",
      summary: "GSP beat Penn twice, including a dominant championship rematch, which adds major value to GSP's opponent-quality case."
    },
    "georges st-pierre|matt serra": {
      fighters: ["Georges St-Pierre", "Matt Serra"],
      fights: 2,
      winner: "Split",
      importance: "major",
      summary: "Serra's upset is the biggest blemish on GSP's record, but GSP avenged it emphatically to restore the championship arc."
    },
    "anderson silva|chael sonnen": {
      fighters: ["Anderson Silva", "Chael Sonnen"],
      fights: 2,
      winner: "Anderson Silva",
      importance: "major",
      summary: "Anderson beat Sonnen twice, including the famous late comeback in their first fight, which became one of the defining moments of his reign."
    },
    "jon jones|daniel cormier": {
      fighters: ["Jon Jones", "Daniel Cormier"],
      fights: 2,
      winner: "Jon Jones",
      importance: "major",
      summary: "Jones beat Cormier officially in their first fight, while the rematch was overturned to a no contest. Even with the messy context, Jones holds the direct rivalry separation."
    },
    "jon jones|alexander gustafsson": {
      fighters: ["Jon Jones", "Alexander Gustafsson"],
      fights: 2,
      winner: "Jon Jones",
      importance: "major",
      summary: "Jones beat Gustafsson twice: the first was a classic close title fight, and the rematch gave Jones much cleaner separation."
    },
    "islam makhachev|alexander volkanovski": {
      fighters: ["Islam Makhachev", "Alexander Volkanovski"],
      fights: 2,
      winner: "Islam Makhachev",
      importance: "major",
      summary: "Islam beat Volkanovski twice at lightweight. Volk gets upward-division context, but Islam still owns the direct championship separation."
    },
    "kamaru usman|leon edwards": {
      fighters: ["Kamaru Usman", "Leon Edwards"],
      fights: 3,
      winner: "Leon Edwards",
      importance: "major",
      summary: "Usman beat Edwards early, but Edwards won the two title fights, including the head-kick comeback that ended Usman's reign. That finish matters in Usman's record context."
    },
    "kamaru usman|colby covington": {
      fighters: ["Kamaru Usman", "Colby Covington"],
      fights: 2,
      winner: "Kamaru Usman",
      importance: "major",
      summary: "Usman beat Covington twice in title fights, which is a major part of his welterweight title-run authority."
    },
    "max holloway|dustin poirier": {
      fighters: ["Max Holloway", "Dustin Poirier"],
      fights: 2,
      winner: "Dustin Poirier",
      importance: "major",
      summary: "Poirier beat Holloway twice, including their interim lightweight title fight. It matters, but Max's featherweight legacy still carries separate all-time weight."
    },
    "jose aldo|frankie edgar": {
      fighters: ["Jose Aldo", "Frankie Edgar"],
      fights: 2,
      winner: "Jose Aldo",
      importance: "major",
      summary: "Aldo beat Edgar twice in UFC featherweight title-level fights, which is a major part of Aldo's scored UFC resume."
    },
    "jose aldo|chad mendes": {
      fighters: ["Jose Aldo", "Chad Mendes"],
      fights: 2,
      winner: "Jose Aldo",
      importance: "major",
      summary: "Aldo beat Mendes twice, including an all-time classic rematch, which helps show Aldo's UFC title-level quality even with the WEC run excluded from scoring."
    },
    "khabib nurmagomedov|dustin poirier": {
      fighters: ["Khabib Nurmagomedov", "Dustin Poirier"],
      fights: 1,
      winner: "Khabib Nurmagomedov",
      importance: "major",
      summary: "Khabib submitted Poirier in a lightweight title defense, one of the key wins in Khabib's perfect compact reign."
    },
    "khabib nurmagomedov|justin gaethje": {
      fighters: ["Khabib Nurmagomedov", "Justin Gaethje"],
      fights: 1,
      winner: "Khabib Nurmagomedov",
      importance: "major",
      summary: "Khabib submitted Gaethje in his final UFC fight, closing his prime with one of the cleanest title-run finishes ever."
    },
    "islam makhachev|charles oliveira": {
      fighters: ["Islam Makhachev", "Charles Oliveira"],
      fights: 1,
      winner: "Islam Makhachev",
      importance: "major",
      summary: "Islam submitted Oliveira to win the lightweight title, giving him a defining championship win over an elite modern lightweight."
    }
  };

  window.COMPARE_FIGHT_LEDGER = LEDGER;
})();
