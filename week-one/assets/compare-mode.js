(function () {
  const SPECIAL_COMPARISONS = {
    "jon jones|georges st-pierre": "jones_gsp",
    "georges st-pierre|jon jones": "jones_gsp",
    "kamaru usman|max holloway": "usman_holloway",
    "max holloway|kamaru usman": "usman_holloway",
    "kamaru usman|henry cejudo": "usman_cejudo",
    "henry cejudo|kamaru usman": "usman_cejudo",
    "khabib nurmagomedov|islam makhachev": "khabib_islam",
    "islam makhachev|khabib nurmagomedov": "khabib_islam",
    "alexander volkanovski|max holloway": "volk_holloway",
    "max holloway|alexander volkanovski": "volk_holloway",
    "anderson silva|demetrious johnson": "anderson_dj",
    "demetrious johnson|anderson silva": "anderson_dj",
    "jose aldo|dominick cruz": "aldo_cruz",
    "dominick cruz|jose aldo": "aldo_cruz",
    "conor mcgregor|kamaru usman": "conor_usman",
    "kamaru usman|conor mcgregor": "conor_usman",
    "jon jones|sean o'malley": "jones_omalley",
    "sean o'malley|jon jones": "jones_omalley",
    "jon jones|sean omalley": "jones_omalley",
    "sean omalley|jon jones": "jones_omalley"
  };

  const CATEGORY_WORDS = {
    championship: "championship case",
    opponentQuality: "win-depth case",
    primeDominance: "peak argument",
    longevity: "long-term resume",
    penalty: "cleaner record context"
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  }

  function data() {
    return window.RANKING_DATA || { men: [], women: [], fighters: [] };
  }

  function lookup(name) {
    const d = data();
    const row = [...(d.men || []), ...(d.women || [])].find(f => f.fighter === name) || { fighter: name };
    const profile = (d.fighters || []).find(f => f.fighter === name) || {};
    return { ...profile, ...row };
  }

  function overrideFor(name) {
    try {
      if (typeof DISPLAY_OVERRIDES !== "undefined" && DISPLAY_OVERRIDES[name]) return DISPLAY_OVERRIDES[name];
    } catch (e) {}
    return {};
  }

  function compareProfile(f) {
    return overrideFor(f.fighter).compareProfile || f.compareProfile || {};
  }

  function score(f) {
    return Number(f.totalScore || 0);
  }

  function rank(f) {
    return Number(overrideFor(f.fighter).allTimeRank || f.rank || 9999);
  }

  function ovr(f) {
    try {
      if (typeof overallOvr === "function") return overallOvr(f);
    } catch (e) {}
    return Number(overrideFor(f.fighter).overallOvr || Math.round((score(f) / 88.7) * 99));
  }

  function categoryScore(f, key) {
    try {
      if (typeof categoryOvr === "function") return Number(categoryOvr(f, key));
    } catch (e) {}
    if (key === "penalty") return Math.max(0, 100 + Number(f.penalty || 0) * 6);
    return Number(f[key] || 0);
  }

  function winnerLoser(a, b) {
    if (score(a) !== score(b)) return score(a) > score(b) ? [a, b] : [b, a];
    return rank(a) <= rank(b) ? [a, b] : [b, a];
  }

  function normalizedPair(a, b) {
    return `${String(a.fighter || "").toLowerCase()}|${String(b.fighter || "").toLowerCase()}`;
  }

  function sameDivision(a, b) {
    const bDivs = [b.primaryDivision, b.secondaryDivision].filter(Boolean).join(" / ").toLowerCase();
    if (!bDivs) return false;
    return [a.primaryDivision, a.secondaryDivision].filter(Boolean).some(div => bDivs.includes(String(div).toLowerCase()));
  }

  function scoreGap(a, b) {
    return Math.abs(score(a) - score(b));
  }

  function bestEdge(f, other, keys = ["championship", "opponentQuality", "primeDominance", "longevity", "penalty"]) {
    let best = null;
    keys.forEach(key => {
      const diff = categoryScore(f, key) - categoryScore(other, key);
      if (!best || diff > best.diff) best = { key, diff };
    });
    return best;
  }

  function classify(a, b) {
    const special = SPECIAL_COMPARISONS[normalizedPair(a, b)];
    if (special) {
      return {
        jones_gsp: "clear_with_counter",
        usman_holloway: "close_split",
        usman_cejudo: "compact_peak_vs_long_reign",
        khabib_islam: "peak_vs_resume_split",
        volk_holloway: "same_division_rivalry",
        anderson_dj: "elite_category_tension",
        aldo_cruz: "scope_context",
        conor_usman: "star_power_vs_resume",
        jones_omalley: "blowout"
      }[special];
    }

    const [winner, loser] = winnerLoser(a, b);
    const gap = scoreGap(winner, loser);
    const winnerPrime = categoryScore(winner, "primeDominance");
    const loserPrime = categoryScore(loser, "primeDominance");
    const winnerResume = categoryScore(winner, "championship") + categoryScore(winner, "opponentQuality") + categoryScore(winner, "longevity");
    const loserResume = categoryScore(loser, "championship") + categoryScore(loser, "opponentQuality") + categoryScore(loser, "longevity");

    if (gap >= 8 || rank(loser) - rank(winner) >= 14) return "blowout";
    if (sameDivision(a, b) && gap <= 8) return "same_division_rivalry";
    if (gap <= 4 && loserPrime - winnerPrime >= 4 && winnerResume - loserResume >= 4) return "peak_vs_resume_split";
    if (gap <= 4) return "close_split";
    return "clear_with_counter";
  }

  function fighterCard(f) {
    const divLabel = [f.primaryDivision, f.secondaryDivision].filter(Boolean).join(" / ");
    return `<div class="card compare-fighter-card">
      <div class="compare-fighter-rank">#${escapeHtml(rank(f))} · ${escapeHtml(ovr(f))} OVR</div>
      <h3>${escapeHtml(f.fighter)}</h3>
      <p>${escapeHtml(f.ufcRecord || "")}${divLabel ? ` · ${escapeHtml(divLabel)}` : ""}</p>
    </div>`;
  }

  function firstUseful(items, fallback) {
    return items.find(x => x && String(x).trim()) || fallback;
  }

  function fighterHook(f, key, fallback) {
    const p = compareProfile(f);
    return firstUseful([p[key], p.shortCase, p.careerSummary], fallback);
  }

  function specialCopy(key) {
    const blocks = {
      jones_gsp: {
        type: "clear_with_counter",
        winner: "Jon Jones",
        headline: "Jon Jones wins, but GSP is the cleanest counterargument to the throne.",
        paragraphs: [
          "GSP has the cleaner case. He avenged the Hughes and Serra losses, controlled welterweight for years, and built one of the best quality-win ledgers ever with names like Penn, Fitch, Shields, Condit, Hendricks, and Bisping. If the debate is about polish, consistency, and fewer weird resume questions, GSP is the guy.",
          "Jones separates because his total championship weight is bigger. He took the light heavyweight belt from Shogun, beat Rampage, Machida, Rashad, Gustafsson, Glover, and Cormier, then later added heavyweight gold. The case gets messy around the edges, but the title-fight volume and multi-era opponent list are enormous.",
          "GSP has the cleaner resume. Jones has the larger one."
        ],
        finalTake: "Jones wins. GSP is the best counterargument because his resume is cleaner, but Jones has too much championship volume, opponent depth, and all-time separation to rank behind him."
      },
      usman_holloway: {
        type: "close_split",
        winner: "Max Holloway",
        headline: "Max Holloway wins by a hair, but Usman has the stronger champion-peak argument.",
        paragraphs: [
          "Usman has the better title-run argument. He took the belt from Woodley, defended against Colby twice, beat Burns, knocked out Masvidal, and looked like the clear welterweight standard during his best stretch. At his peak, he felt more controlled and more champion-like than almost anyone outside the very top tier.",
          "Holloway separates through volume. He beat Aldo twice, ran through Ortega, put on historic performances against Kattar and Yair, stayed relevant after losing the belt, and added the Gaethje moment to an already deep resume. Usman's peak was sharper, but Max kept stacking elite proof for longer.",
          "Usman has the better championship peak. Holloway has the deeper overall body of work."
        ],
        finalTake: "Holloway wins, barely. Usman has the stronger champion-peak argument, but Holloway's longevity, opponent volume, and sustained elite relevance give him the edge."
      },
      usman_cejudo: {
        type: "compact_peak_vs_long_reign",
        winner: "Kamaru Usman",
        headline: "Kamaru Usman wins, but Cejudo makes this more interesting than the rank gap suggests.",
        paragraphs: [
          "Cejudo has the flashier achievement stack. He beat Demetrious Johnson, finished T.J. Dillashaw, moved up to bantamweight, and won a second belt against Marlon Moraes. For a short UFC run, that is a ridiculous amount of legacy packed into a small window.",
          "Usman separates because his title run was bigger and more sustained. He beat Woodley to take the belt, defended against Colby twice, knocked out Masvidal, beat Burns, and spent years as the clear welterweight standard. Cejudo's peak is loud, but Usman's reign has more weight behind it.",
          "Cejudo has the better compact resume. Usman has the stronger championship resume."
        ],
        finalTake: "Usman wins. Cejudo's two-division peak deserves real respect, but Usman's welterweight reign was longer, deeper, and more complete."
      },
      khabib_islam: {
        type: "peak_vs_resume_split",
        winner: "Islam Makhachev",
        headline: "Islam Makhachev wins, but Khabib still owns the cleaner peak argument.",
        paragraphs: [
          "Khabib has the purity argument. He never lost in the UFC, ran through RDA, Barboza, McGregor, Poirier, and Gaethje, and left before the resume ever got messy. At his best, he felt like the most inevitable fighter in the sport.",
          "Islam separates because the title-level resume has grown bigger. Oliveira, Volkanovski, Poirier, and the deeper modern lightweight run give him more championship volume and more elite proof across different styles. Khabib's case is cleaner; Islam's case has more total weight now.",
          "Khabib has the more untouchable peak. Islam has the deeper championship resume."
        ],
        finalTake: "Islam wins. Khabib still owns the peak-dominance argument, but Islam's title-run volume and elite-win depth give him the stronger total case."
      },
      volk_holloway: {
        type: "same_division_rivalry",
        winner: "Alexander Volkanovski",
        headline: "Volkanovski wins, because the trilogy gives him the cleanest separation.",
        paragraphs: [
          "Holloway has the volume argument. Aldo twice, Ortega, Kattar, Yair, Korean Zombie, Gaethje, and years of elite relevance give Max one of the deepest featherweight resumes ever. If this were just about total body of work, Max makes it uncomfortable.",
          "Volk separates because he directly took the era from him. He beat Holloway three times, took the belt, defended against elite contenders, and left the trilogy with the cleaner championship claim. In a same-division rivalry, that kind of direct separation matters a lot.",
          "Max has the deeper volume case. Volk has the stronger head-to-head and championship separation."
        ],
        finalTake: "Volkanovski wins. Holloway's volume is real, but Volk's trilogy edge and title-run control make him the defining featherweight of their shared era."
      },
      anderson_dj: {
        type: "elite_category_tension",
        winner: "Demetrious Johnson",
        headline: "Demetrious Johnson wins, but Anderson has the bigger aura argument.",
        paragraphs: [
          "Anderson has the mythology. The Franklin destruction, the Forrest Griffin matrix moment, the Vitor front kick, the Chael comeback, and the long middleweight reign made him feel like the most dangerous champion in the sport. His peak had a fear factor DJ never really matched culturally.",
          "DJ separates because his case is cleaner and more complete. He defended flyweight for years, beat Benavidez, Dodson, Cejudo, and Horiguchi, and rarely looked out of control during his prime run. Anderson's aura is bigger, but the Weidman losses create real drag in this scoring window.",
          "Anderson has the more iconic peak. DJ has the cleaner all-around resume."
        ],
        finalTake: "Demetrious Johnson wins. Anderson's aura is massive, but DJ's consistency, technical completeness, and cleaner championship run give him the edge."
      },
      aldo_cruz: {
        type: "scope_context",
        winner: "Jose Aldo",
        headline: "Jose Aldo wins, but Cruz is one of the trickiest scope debates.",
        paragraphs: [
          "Cruz has the comeback and style argument. He was a tactical nightmare, beat Demetrious Johnson at bantamweight, and the Dillashaw comeback win is one of the best legacy moments in UFC history. The problem is that injuries broke the resume into pieces.",
          "Aldo separates through sustained elite relevance. Even with the WEC run treated as historical context instead of scored value, Aldo still has Edgar, Mendes, Korean Zombie, Lamas, Stephens, Moicano, Vera, and Font inside the UFC picture. He also stayed dangerous long after the featherweight reign ended.",
          "Cruz has the cleaner comeback story. Aldo has the deeper scored resume."
        ],
        finalTake: "Aldo wins. Cruz has the brilliant comeback and unique style, but Aldo's UFC resume has more volume, more sustained relevance, and more usable all-time weight."
      },
      conor_usman: {
        type: "star_power_vs_resume",
        winner: "Kamaru Usman",
        headline: "Kamaru Usman wins, but Conor owns the impact argument.",
        paragraphs: [
          "Conor has the iconic-moment case. The Aldo knockout, the Mendes interim win, the Alvarez masterclass, and the first simultaneous double-champ moment changed the sport. If the debate is fame, impact, and unforgettable highs, Conor is in a different universe.",
          "Usman separates because his title run has more substance. He beat Woodley, Colby twice, Burns, Masvidal, Edwards, and RDA while spending years as the welterweight standard. Conor's highs are bigger, but Usman's championship resume is longer, cleaner, and more complete.",
          "Conor has the bigger star case. Usman has the stronger ranking case."
        ],
        finalTake: "Usman wins. Conor is the bigger icon, but Usman has the deeper title run, better sustained elite work, and stronger overall resume."
      },
      jones_omalley: {
        type: "blowout",
        winner: "Jon Jones",
        headline: "Jon Jones wins easily; this is a star-vs-standard comparison.",
        paragraphs: [
          "O'Malley has real star power and a legitimate championship moment. He is dangerous, marketable, and skilled enough to matter in a strong bantamweight era. This is not a disrespect comparison.",
          "Jones is just operating on a completely different all-time scale. Shogun, Rampage, Machida, Rashad, Gustafsson, Cormier, Glover, Gane, title-fight volume, multi-era dominance — that is the benchmark case in this ranking.",
          "O'Malley is still building. Jones is the standard everyone else is chasing."
        ],
        finalTake: "Jones wins easily. O'Malley has the star profile, but Jones has the championship resume, longevity, and opponent depth of an all-time benchmark."
      }
    };
    return blocks[key] || null;
  }

  function genericCopy(a, b, type) {
    const [winner, loser] = winnerLoser(a, b);
    const loserEdge = bestEdge(loser, winner);
    const winnerEdge = bestEdge(winner, loser);
    const loserLane = CATEGORY_WORDS[loserEdge?.key] || "best argument";
    const winnerLane = CATEGORY_WORDS[winnerEdge?.key] || "overall case";
    const loserPeak = fighterHook(loser, "peak", `${loser.fighter}'s strongest argument is the ${loserLane}.`);
    const winnerResume = fighterHook(winner, "resume", `${winner.fighter} has the stronger total case, especially through the ${winnerLane}.`);

    if (type === "blowout") {
      return {
        type,
        winner: winner.fighter,
        paragraphs: [
          fighterHook(loser, "shortCase", `${loser.fighter} has a real fighting legacy, but the all-time gap is large here.`),
          winnerResume,
          `${winner.fighter}'s ranking case is much more complete: more total resume weight, stronger all-time placement, and a clearer path to the top of this list.`
        ],
        finalTake: `${winner.fighter} wins comfortably. ${loser.fighter} has a case worth respecting, but ${winner.fighter} is clearly higher in this ranking.`
      };
    }

    if (type === "same_division_rivalry") {
      return {
        type,
        winner: winner.fighter,
        paragraphs: [
          fighterHook(loser, "resume", `${loser.fighter} has a real argument here, especially through the ${loserLane}.`),
          fighterHook(winner, "rivalry", `${winner.fighter} has the cleaner same-division separation, which matters when two legacies overlap by division or era.`),
          `${loser.fighter}'s argument keeps it competitive, but ${winner.fighter}'s overall placement is stronger.`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter} has a real argument, but ${winner.fighter} has the stronger same-division ranking case.`
      };
    }

    if (type === "peak_vs_resume_split") {
      return {
        type,
        winner: winner.fighter,
        paragraphs: [
          loserPeak,
          winnerResume,
          `${loser.fighter} owns the peak lane, but ${winner.fighter} owns the overall resume lane.`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter} has the better peak argument, but ${winner.fighter} has the stronger total GOAT case in this model.`
      };
    }

    if (type === "close_split") {
      return {
        type,
        winner: winner.fighter,
        paragraphs: [
          fighterHook(loser, "counter", `${loser.fighter} has a very real argument here, especially through the ${loserLane}.`),
          fighterHook(winner, "edge", `${winner.fighter}'s edge is the ${winnerLane}. It is a small overall advantage created by how the pieces add up.`),
          `${loser.fighter} may win one version of the argument, but ${winner.fighter} wins the full ranking comparison.`
        ],
        finalTake: `${winner.fighter} wins, barely. ${loser.fighter} has the strongest counterargument, but ${winner.fighter}'s total resume gives him the edge.`
      };
    }

    return {
      type: "clear_with_counter",
      winner: winner.fighter,
      paragraphs: [
        fighterHook(loser, "counter", `${loser.fighter} has a real counterargument, especially through the ${loserLane}.`),
        fighterHook(winner, "edge", `${winner.fighter} has the bigger overall case. The ${winnerLane} is stronger, and the total resume gives him clearer separation in this ranking.`),
        `${loser.fighter} has the cleaner lane in part of the debate. ${winner.fighter} has the greater total case.`
      ],
      finalTake: `${winner.fighter} wins. ${loser.fighter} has a real counterargument, but ${winner.fighter}'s overall ranking case is stronger.`
    };
  }

  function comparisonCopy(a, b) {
    const specialKey = SPECIAL_COMPARISONS[normalizedPair(a, b)];
    if (specialKey) return specialCopy(specialKey);
    return genericCopy(a, b, classify(a, b));
  }

  function renderNaturalCompare() {
    const fighterA = document.getElementById("fighterA");
    const fighterB = document.getElementById("fighterB");
    const result = document.getElementById("compareResult");
    if (!fighterA || !fighterB || !result) return;

    const a = lookup(fighterA.value);
    const b = lookup(fighterB.value);
    const copy = comparisonCopy(a, b);
    const headline = copy.headline || `${copy.winner} wins this comparison.`;

    result.classList.add("compare-natural");
    result.innerHTML = `
      ${fighterCard(a)}
      ${fighterCard(b)}
      <article class="card debate-card">
        <h3>${escapeHtml(headline)}</h3>
        ${copy.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("")}
        <div class="final-take"><strong>Final take:</strong> ${escapeHtml(copy.finalTake)}</div>
      </article>
    `;

    const compareSection = document.querySelector("#compare .section-title p");
    if (compareSection) {
      compareSection.textContent = "Pick two fighters and get a clear debate summary with a winner, the best counterargument, and the deciding edge.";
    }
  }

  function installStyles() {
    if (document.getElementById("compare-mode-natural-styles")) return;
    const style = document.createElement("style");
    style.id = "compare-mode-natural-styles";
    style.textContent = `
      .compare-natural { grid-template-columns: repeat(2, minmax(260px, 1fr)); }
      .compare-fighter-card { position:relative; min-height:132px; }
      .compare-fighter-card h3 { margin:28px 0 6px; font-size:24px; }
      .compare-fighter-card p { color:var(--muted); margin:0; line-height:1.45; }
      .compare-fighter-rank { position:absolute; top:14px; right:14px; border:1px solid rgba(250,204,21,.35); background:rgba(250,204,21,.08); color:#fde68a; border-radius:999px; padding:5px 9px; font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.04em; }
      .debate-card { grid-column:1 / -1; padding:22px; }
      .debate-card h3 { margin:0 0 14px; font-size:30px; line-height:1.05; }
      .debate-card p { color:#cbd5e1; line-height:1.62; max-width:940px; }
      .final-take { margin-top:16px; border-left:4px solid var(--accent2); background:rgba(250,204,21,.08); border-radius:14px; padding:14px 16px; color:#f8fafc; line-height:1.55; }
      .final-take strong { color:var(--accent2); }
      @media (max-width:760px){ .compare-natural { grid-template-columns:1fr; } .debate-card h3 { font-size:24px; } .compare-fighter-card h3 { margin-top:32px; } }
    `;
    document.head.appendChild(style);
  }

  function bootCompareMode() {
    installStyles();
    try { window.renderCompare = renderNaturalCompare; } catch (e) {}
    try { renderCompare = renderNaturalCompare; } catch (e) {}
    ["fighterA", "fighterB"].forEach(id => {
      const select = document.getElementById(id);
      if (select && !select.dataset.naturalCompareBound) {
        select.dataset.naturalCompareBound = "true";
        select.addEventListener("change", renderNaturalCompare);
      }
    });
    renderNaturalCompare();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootCompareMode);
  } else {
    bootCompareMode();
  }
})();
