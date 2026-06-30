(function () {
  const ENHANCEMENTS = {
    "Jon Jones": {
      eliteCounter: true,
      signatureWins: "Shogun, Rampage, Machida, Rashad, Gustafsson, Glover, Cormier, and Gane give Jones a title-level win list that almost nobody can match.",
      weakness: "The only reason Jones debates stay alive is the messy context: the Hamill DQ, the no contest, long gaps, and close late-career decisions."
    },
    "Georges St-Pierre": {
      eliteCounter: true,
      signatureWins: "Hughes, Penn, Fitch, Shields, Condit, Diaz, Hendricks, and Bisping give GSP one of the deepest elite-win ledgers in the ranking.",
      againstPerfectPeak: "Against perfect-peak fighters, GSP's argument is total proof: more elite opponents, more championship rounds, and a longer window as the standard at welterweight."
    },
    "Demetrious Johnson": {
      eliteCounter: true,
      signatureWins: "Benavidez, Dodson, Cejudo, Horiguchi, and years of flyweight title defenses give DJ a clean dominance case even after division-strength context.",
      weakness: "The only real drag is division depth. DJ's skill and dominance are elite, but the flyweight opponent pool does not score like welterweight or lightweight."
    },
    "Anderson Silva": {
      eliteCounter: true,
      signatureWins: "Franklin, Henderson, Griffin, Belfort, Sonnen, Okami, and years of middleweight title wins give Anderson one of the sport's most iconic reigns.",
      weakness: "The Weidman losses matter because they land before the model fully moves Anderson into post-prime protection."
    },
    "Khabib Nurmagomedov": {
      eliteCounter: true,
      signatureWins: "RDA, Barboza, McGregor, Poirier, and Gaethje give Khabib a compact but extremely high-quality lightweight resume.",
      bestArgument: "Khabib's best argument is purity: no UFC losses, no real collapse, and a final stretch that looked like total separation from elite lightweights.",
      againstLongReign: "Against deeper champions, Khabib makes the debate uncomfortable because his peak was cleaner and more dominant than almost anyone else's."
    },
    "Islam Makhachev": {
      eliteCounter: true,
      signatureWins: "Oliveira, Volkanovski, Poirier, Tsarukyan, and Hooker give Islam a deep modern lightweight ledger with real championship weight."
    },
    "Alexander Volkanovski": {
      eliteCounter: true,
      signatureWins: "Aldo, Holloway three times, Ortega, Korean Zombie, and Yair give Volk one of the cleanest modern featherweight title resumes.",
      directMatchups: {
        "Jose Aldo": "Volk beat Aldo before winning the belt, which matters as a bridge win between featherweight eras."
      }
    },
    "Max Holloway": {
      eliteCounter: true,
      signatureWins: "Aldo twice, Ortega, Kattar, Yair, Korean Zombie, and Gaethje give Holloway one of the best opponent-volume cases in the ranking.",
      directMatchups: {
        "Conor McGregor": "Conor did beat a young Holloway in 2013, and that matters historically. It does not erase the fact that Max later built a much deeper long-term resume.",
        "Jose Aldo": "Holloway finished Aldo twice, which is a massive part of Max's featherweight legacy and one of the key reasons his volume case is so strong."
      }
    },
    "Kamaru Usman": {
      eliteCounter: true,
      signatureWins: "Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give Usman a strong modern welterweight ledger."
    },
    "Jose Aldo": {
      eliteCounter: true,
      signatureWins: "Edgar, Mendes, Korean Zombie, Lamas, Stephens, Moicano, Vera, and Font give Aldo real scored value even with the WEC run treated as historical context.",
      directMatchups: {
        "Max Holloway": "Holloway beat Aldo twice, so Max has the direct head-to-head separation even if Aldo's broader historical legacy remains enormous.",
        "Alexander Volkanovski": "Volk beat Aldo before becoming champion, which gives Volk a clean bridge win in the featherweight timeline."
      }
    },
    "Dominick Cruz": {
      eliteCounter: true,
      signatureWins: "Dillashaw, Faber, Demetrious Johnson, and Mizugaki give Cruz meaningful win value, with the Dillashaw comeback carrying huge legacy weight."
    },
    "Conor McGregor": {
      eliteCounter: true,
      signatureWins: "Aldo, Alvarez, Mendes, Poirier, Holloway, and Diaz give Conor a high-impact win list even though the long-term resume is short.",
      directMatchups: {
        "Max Holloway": "Conor beat a young Holloway in 2013, and that should be mentioned. But Max's later featherweight title run and long-term elite volume are why head-to-head does not automatically decide the all-time ranking.",
        "Jose Aldo": "The Aldo knockout is one of the biggest legacy moments in UFC history, but Aldo's larger career still matters in broader all-time debates."
      }
    },
    "Matt Hughes": {
      eliteCounter: true,
      signatureWins: "GSP, Penn, Royce Gracie, Sherk, Trigg, and Newton give Hughes real championship-era weight at welterweight."
    },
    "Henry Cejudo": {
      eliteCounter: true,
      signatureWins: "Demetrious Johnson, T.J. Dillashaw, Marlon Moraes, Dominick Cruz, and Jussier Formiga give Cejudo a compact but loud elite-win stack."
    }
  };

  function install() {
    if (typeof DISPLAY_OVERRIDES === "undefined") return;
    Object.entries(ENHANCEMENTS).forEach(([fighter, compareProfile]) => {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile || {}),
        ...compareProfile,
        directMatchups: {
          ...((DISPLAY_OVERRIDES[fighter].compareProfile || {}).directMatchups || {}),
          ...(compareProfile.directMatchups || {})
        }
      };
    });
  }

  install();
})();
