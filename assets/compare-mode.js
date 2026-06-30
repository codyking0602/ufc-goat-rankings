(function () {
  const SPECIAL_COMPARISONS = {
    "jon jones|georges st-pierre": "jones_gsp",
    "georges st-pierre|jon jones": "jones_gsp",
    "kamaru usman|max holloway": "usman_holloway",
    "max holloway|kamaru usman": "usman_holloway",
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
        paragraphs: [
          "GSP has the cleaner argument. His resume is easier to defend: he avenged both losses, controlled his division with consistency, and has fewer weird record-context issues. If someone values polish, professionalism, and opponent quality control, GSP is the strongest counterargument to Jones.",
          "But Jones has the bigger overall case. He has more championship weight, a longer run at the very top, and more separation across multiple eras. Even with the messy context around his record, Jones' total resume is just larger. He was elite for longer, beat more title-level opponents, and stayed at the top across a wider competitive window.",
          "GSP is the cleaner case. Jones is the greater case."
        ],
        finalTake: "Jones wins. GSP is the best counterargument because his resume is cleaner, but Jones has too much total championship volume, longevity, and all-time separation to rank behind him."
      },
      usman_holloway: {
        type: "close_split",
        winner: "Max Holloway",
        paragraphs: [
          "Usman has the better champion argument. At his best, he looked more controlled, more complete, and more dominant in title fights. His title run had real authority: he shut down contenders, controlled rounds, finished elite opponents, and carried himself like the clear best fighter in the world for that stretch.",
          "Holloway's edge is the bigger overall resume. He has more long-term elite volume, more time proving himself against top-tier names, and a deeper body of work across different phases of his career. He was not always as clean as Usman at the very top, but he kept stacking relevant wins for longer and against a wider range of elite opponents.",
          "Usman peaked higher as champion. Holloway built the slightly greater total resume."
        ],
        finalTake: "Holloway wins, barely. Usman has the stronger champion/peak argument, but Holloway's longevity, opponent volume, and sustained elite relevance give him the edge in the overall ranking."
      },
      khabib_islam: {
        type: "peak_vs_resume_split",
        winner: "Islam Makhachev",
        paragraphs: [
          "Khabib still has the better peak argument. At his best, he was cleaner, more terrifying, and more untouchable. He never lost in the UFC, never really had a bad night, and his final stretch felt like complete separation from the rest of the division.",
          "But Islam has passed him in total resume. The title-run volume is bigger, the elite-win depth is stronger, and he has had more time to prove his championship level against different styles. Khabib's case is built on perfection and dominance. Islam's case is built on a larger body of elite work.",
          "Khabib has the cleaner peak. Islam has the stronger overall ranking case."
        ],
        finalTake: "Islam wins. Khabib still owns the peak-dominance argument, but Islam has built the deeper championship resume and now has the stronger total GOAT case in this model."
      },
      volk_holloway: {
        type: "same_division_rivalry",
        winner: "Alexander Volkanovski",
        paragraphs: [
          "Holloway has the volume argument. His resume is longer, deeper, and loaded with elite featherweight wins across multiple phases of his career. Max's case is built on durability, activity, elite opponent volume, and staying relevant for years.",
          "But Volkanovski has the separation argument, and in a same-division rivalry, that matters a lot. He did not just edge past Holloway once and disappear. He beat him three times, took the championship from him, defended the era, and left very little doubt by the end of the trilogy.",
          "Holloway's volume keeps it close. Volk's head-to-head and championship edge decide it."
        ],
        finalTake: "Volkanovski wins. Holloway has the volume argument, but Volk has the cleaner championship case, the head-to-head separation, and the stronger claim as the defining featherweight of their shared era."
      },
      anderson_dj: {
        type: "elite_category_tension",
        winner: "Demetrious Johnson",
        paragraphs: [
          "Anderson has the bigger aura argument. At his peak, he felt like the most dangerous fighter in the sport. The title reign, the finishes, the creativity, the matrix moments — Anderson's case has a kind of mythology that almost no one else can match.",
          "But DJ has the more complete overall case in this model. His dominance was cleaner, his skill set was more complete, and his championship run had less collapse at the end of the prime window. Anderson's peak was spectacular, but the Weidman losses create real drag because they happened before the model fully moves him into post-prime protection.",
          "Anderson has the bigger aura. DJ has the cleaner, more complete ranking case."
        ],
        finalTake: "Demetrious Johnson wins. Anderson has the bigger aura and the more iconic peak, but DJ has the cleaner, more complete all-time case and fewer penalties pulling down his ranking."
      },
      aldo_cruz: {
        type: "scope_context",
        winner: "Jose Aldo",
        paragraphs: [
          "Aldo's WEC run and Cruz's WEC run both matter historically, but this model is scoring the UFC portion of their careers. That matters because both fighters built part of their legend before their divisions were fully established in the UFC.",
          "With that boundary set, Aldo has the stronger overall case. He still has enough championship weight, elite wins, and long-term relevance inside the UFC to sit above Cruz. Even after his featherweight reign ended, Aldo kept adding meaningful value by staying competitive with elite opponents and later making a serious bantamweight run.",
          "Cruz has the incredible comeback win over Dillashaw and one of the most unique styles ever, but the gaps, injuries, and thinner UFC fight volume make his ranking case harder to stack against Aldo's."
        ],
        finalTake: "Aldo wins. Cruz has the incredible comeback story and the more complicated context, but Aldo has the deeper UFC resume, more sustained elite relevance, and the stronger overall ranking case."
      },
      conor_usman: {
        type: "star_power_vs_resume",
        winner: "Kamaru Usman",
        paragraphs: [
          "Conor has the bigger star-power argument. He changed the business, became the first simultaneous two-division UFC champion, and owns some of the most iconic moments in company history. The Aldo knockout, the Eddie Alvarez performance, the double-champ moment — those are legacy moments that very few fighters can match.",
          "But Usman has the much stronger ranking case. His championship run was longer, cleaner, and more complete. He ruled welterweight with real control, defended the belt repeatedly, and built a deeper title-level resume than Conor.",
          "Conor's highs are enormous, but his actual ranked resume is shorter and more uneven. Usman did more of the things this model rewards: sustained championship control, elite consistency, and long-term title relevance."
        ],
        finalTake: "Usman wins. Conor is the bigger star and the more historically famous fighter, but Usman has the clearly stronger GOAT resume and belongs higher in the ranking."
      },
      jones_omalley: {
        type: "blowout",
        winner: "Jon Jones",
        paragraphs: [
          "O'Malley is a high-level modern bantamweight with real star power, dangerous striking, and a legitimate championship moment. This is not a disrespect comparison.",
          "But this is not really a GOAT debate yet. Jones is the all-time benchmark in this model. His championship resume, title-fight volume, elite longevity, and opponent depth are on a completely different level.",
          "O'Malley may still add to his case. Jones has already built the standard everyone else is chasing."
        ],
        finalTake: "Jones wins easily. O'Malley may still be building a strong modern bantamweight legacy, but Jones is already the standard."
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

    result.classList.add("compare-natural");
    result.innerHTML = `
      ${fighterCard(a)}
      ${fighterCard(b)}
      <article class="card debate-card">
        <h3>${escapeHtml(copy.winner)} wins this comparison.</h3>
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
