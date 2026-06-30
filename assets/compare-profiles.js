(function () {
  const PROFILES = {
    "Matt Hughes": {
      shortCase: "Hughes is one of the defining welterweight champions: a physical, title-winning force from the earlier UFC era with real championship volume and a long list of important wins.",
      peak: "At his best, Hughes was the standard at welterweight: overwhelming grappling, brutal top control, and a title-level style that shaped the division before GSP took over.",
      resume: "Hughes has the deeper championship resume here: more title-fight volume, more sustained divisional control, and a longer run as one of the sport's defining champions.",
      championship: "His best argument is championship weight. Hughes did not just win a belt; he spent years as the face of the welterweight title picture.",
      opponentQuality: "Hughes' win list carries strong era value, especially when the model gives credit for title-level opponents and former champions in his division.",
      longevity: "The edge for Hughes is that his case is not just one great moment or one short burst. He stayed relevant at championship level for longer than most compact-resume fighters.",
      counter: "The knock on Hughes is era context. His welterweight run was historically huge, but the division was not as deep or modernized as later welterweight eras.",
      edge: "Hughes wins when the debate becomes total title weight and sustained divisional control rather than pure peak efficiency."
    },
    "Henry Cejudo": {
      shortCase: "Cejudo is one of the best short-window legacy cases in the sport: Olympic gold medalist, flyweight champion, bantamweight champion, and a fighter who packed a lot of value into a compact UFC run.",
      peak: "Cejudo's peak was absurdly efficient: he beat Demetrious Johnson, finished T.J. Dillashaw, moved up, and won bantamweight gold against Marlon Moraes.",
      resume: "His issue is volume. The high-end wins are excellent, but the long-term UFC resume is short compared with the deeper all-time champions.",
      championship: "Cejudo has real championship shine because of the two-division achievement, but he does not have the long title reign or defense volume of the bigger all-time cases.",
      opponentQuality: "The best Cejudo names are strong: Demetrious Johnson, T.J. Dillashaw, Marlon Moraes, Dominick Cruz, and Jussier Formiga give him real elite-name value.",
      longevity: "The retirement gap and short title window keep Cejudo from climbing as high as fighters with years of sustained championship relevance.",
      counter: "Cejudo's argument is peak efficiency. He did a lot in a small window, and his best wins are loud enough to make him dangerous in almost any comparison.",
      edge: "Cejudo loses ground when the model asks for long-term title volume and sustained elite years."
    }
  };

  function install() {
    if (typeof DISPLAY_OVERRIDES === "undefined") return;
    Object.entries(PROFILES).forEach(([fighter, compareProfile]) => {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile || {}),
        ...compareProfile
      };
    });
  }

  install();
})();
