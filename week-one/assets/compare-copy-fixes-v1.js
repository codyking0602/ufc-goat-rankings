(function () {
  const BEST_ARGUMENT_FIXES = {
    "Randy Couture": "Couture's case starts with championship chaos: heavyweight gold, light heavyweight gold, huge upset wins, and title value across multiple eras.",
    "Daniel Cormier": "Cormier's case starts with two-division title value: light heavyweight gold, heavyweight gold, elite opponent quality, and a dense UFC title window.",
    "Stipe Miocic": "Stipe's case starts with the best UFC heavyweight resume: title defenses, champion wins, the first Ngannou win, and the Cormier trilogy comeback.",
    "Israel Adesanya": "Adesanya's case starts with middleweight title volume: repeated defenses, two wins over Whittaker, the Pereira revenge moment, and years as the face of the division.",
    "B.J. Penn": "Penn's case starts with peak skill and two-division title value: lightweight gold, the Hughes welterweight upset, and a prime that was much cleaner than his final record suggests.",
    "Chuck Liddell": "Chuck's case starts with title-reign value, star power, and rivalry wins over Couture and Ortiz during the UFC's breakout years.",
    "Alex Pereira": "Pereira's case starts with impact: two UFC belts, huge title moments, and one of the loudest short championship climbs in the ranking.",
    "Ilia Topuria": "Topuria's case starts with high-end featherweight value: an unbeaten UFC rise and direct wins over Volkanovski and Holloway while his title run is still building.",
    "Francis Ngannou": "Ngannou's case starts with heavyweight peak value: the Stipe title win, the Gane defense, and a prime that felt uniquely dangerous.",
    "Merab Dvalishvili": "Merab's case starts with modern bantamweight strength: relentless pace, elite wins over Aldo, Cejudo, Yan, O'Malley, and Umar, plus a growing title run.",
    "Amanda Nunes": "Nunes' case starts with women's GOAT separation: two UFC belts, repeated defenses, the Cyborg win, the Rousey win, and two wins over Shevchenko.",
    "Valentina Shevchenko": "Valentina's case starts with technical dominance: a long flyweight reign, repeated defenses, a title regain, and years of elite control across two divisions."
  };

  function mergeProfile(fighter, update) {
    window.COMPARE_PROFILES = window.COMPARE_PROFILES || {};
    window.COMPARE_PROFILES[fighter] = {
      ...(window.COMPARE_PROFILES[fighter] || {}),
      ...update
    };

    if (typeof DISPLAY_OVERRIDES !== "undefined") {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile || {}),
        ...update
      };
    }
  }

  Object.entries(BEST_ARGUMENT_FIXES).forEach(([fighter, bestArgument]) => {
    mergeProfile(fighter, { bestArgument });
  });

  function cleanText(value) {
    return String(value || "")
      .replace(/^The argument for ([A-Z][^:]+?) is built around this:\s*/g, "$1's case starts here: ")
      .replace(/^([A-Z][^:]+?)'s side of the debate starts here:\s*/g, "$1's case starts here: ")
      .replace(/The counterargument is that/g, "The concern is that")
      .replace(/the counterargument is that/g, "the concern is that")
      .replace(/The counterargument is/g, "The concern is")
      .replace(/the counterargument is/g, "the concern is")
      .replace(/\.\s+([a-z])/g, function (_, letter) { return ". " + letter.toUpperCase(); })
      .replace(/\s+/g, " ")
      .trim();
  }

  function postProcessCompareCopy() {
    const result = document.getElementById("compareResult");
    if (!result) return;
    result.querySelectorAll("h3, p, .final-take").forEach(node => {
      const before = node.textContent;
      const after = cleanText(before);
      if (after && after !== before) node.textContent = after;
    });
  }

  const previousRender = window.renderCompare;
  window.renderCompare = function compareCopyFixesRender() {
    if (typeof previousRender === "function") previousRender();
    setTimeout(postProcessCompareCopy, 0);
  };
  try { renderCompare = window.renderCompare; } catch (e) {}

  ["fighterA", "fighterB"].forEach(id => {
    const select = document.getElementById(id);
    if (select && !select.dataset.compareCopyFixesBound) {
      select.dataset.compareCopyFixesBound = "true";
      select.addEventListener("change", () => setTimeout(postProcessCompareCopy, 0));
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(postProcessCompareCopy, 0));
  } else {
    setTimeout(postProcessCompareCopy, 0);
  }
})();
