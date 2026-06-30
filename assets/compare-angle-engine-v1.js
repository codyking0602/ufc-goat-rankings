(function () {
  const SPECIAL_KEYS = new Set([
    "jon jones|georges st-pierre",
    "georges st-pierre|jon jones",
    "kamaru usman|max holloway",
    "max holloway|kamaru usman",
    "kamaru usman|henry cejudo",
    "henry cejudo|kamaru usman",
    "khabib nurmagomedov|islam makhachev",
    "islam makhachev|khabib nurmagomedov",
    "alexander volkanovski|max holloway",
    "max holloway|alexander volkanovski",
    "anderson silva|demetrious johnson",
    "demetrious johnson|anderson silva",
    "jose aldo|dominick cruz",
    "dominick cruz|jose aldo",
    "conor mcgregor|kamaru usman",
    "kamaru usman|conor mcgregor",
    "jon jones|sean o'malley",
    "sean o'malley|jon jones",
    "jon jones|sean omalley",
    "sean omalley|jon jones"
  ]);

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

  function profileText(f) {
    const p = compareProfile(f);
    return Object.values(p).filter(Boolean).join(" ");
  }

  function field(f, key, fallback) {
    const p = compareProfile(f);
    return p[key] || p.shortCase || fallback;
  }

  function score(f) { return Number(f.totalScore || 0); }
  function rank(f) { return Number(overrideFor(f.fighter).allTimeRank || f.rank || 9999); }

  function ovr(f) {
    try { if (typeof overallOvr === "function") return overallOvr(f); } catch (e) {}
    return Number(overrideFor(f.fighter).overallOvr || Math.round((score(f) / 88.7) * 99));
  }

  function categoryScore(f, key) {
    try { if (typeof categoryOvr === "function") return Number(categoryOvr(f, key)); } catch (e) {}
    if (key === "penalty") return Math.max(0, 100 + Number(f.penalty || 0) * 6);
    return Number(f[key] || 0);
  }

  function winnerLoser(a, b) {
    if (score(a) !== score(b)) return score(a) > score(b) ? [a, b] : [b, a];
    return rank(a) <= rank(b) ? [a, b] : [b, a];
  }

  function pairKey(a, b) {
    return `${String(a.fighter || "").toLowerCase()}|${String(b.fighter || "").toLowerCase()}`;
  }

  function sameDivision(a, b) {
    const bDivs = [b.primaryDivision, b.secondaryDivision].filter(Boolean).join(" / ").toLowerCase();
    return [a.primaryDivision, a.secondaryDivision].filter(Boolean).some(div => bDivs.includes(String(div).toLowerCase()));
  }

  function isStarPower(f) {
    const text = profileText(f).toLowerCase();
    return Boolean(compareProfile(f).starPower) || /star-power|cultural impact|changed the business|iconic-moment|biggest cultural/.test(text);
  }

  function isScopeContext(f) {
    return Boolean(compareProfile(f).scope);
  }

  function isCompactPeak(f) {
    const text = profileText(f).toLowerCase();
    return /compact|short-window|short ufc run|high-impact but short|perfect record|purity|short compared/.test(text) || Number(f.activeEliteYears || 0) <= 4.5;
  }

  function isLongReign(f) {
    const text = profileText(f).toLowerCase();
    return /long reign|defended repeatedly|title run|sustained|years as|championship authority|controlled/.test(text) || (categoryScore(f, "championship") >= 70 && categoryScore(f, "longevity") >= 50);
  }

  function isAuraPeak(f) {
    const text = profileText(f).toLowerCase();
    return /aura|mythology|fear factor|untouchable|terrifying|dangerous|inevitable|matrix/.test(text) || categoryScore(f, "primeDominance") >= 88;
  }

  function hasVolumeCase(f) {
    const text = profileText(f).toLowerCase();
    return /volume|body of work|long-term|stayed elite|opponent volume|deeper.*resume|sustained elite/.test(text) || categoryScore(f, "longevity") >= 75 || categoryScore(f, "opponentQuality") >= 75;
  }

  function cleanRecordGap(winner, loser) {
    return categoryScore(winner, "penalty") - categoryScore(loser, "penalty");
  }

  function pickAngle(winner, loser, type) {
    if (type === "blowout") return "blowoutRespect";
    if (isScopeContext(winner) || isScopeContext(loser)) return "scopeContext";
    if (sameDivision(winner, loser)) return "sameDivision_rivalry";
    if (isStarPower(loser) && !isStarPower(winner)) return "starPower_vs_resume";
    if (isCompactPeak(loser) && isLongReign(winner)) return "compactPeak_vs_longReign";
    if (isAuraPeak(loser) && (hasVolumeCase(winner) || cleanRecordGap(winner, loser) >= 8)) return "peakAura_vs_consistency";
    if (categoryScore(loser, "primeDominance") + categoryScore(loser, "championship") > categoryScore(winner, "primeDominance") + categoryScore(winner, "championship") + 8 && hasVolumeCase(winner)) return "volume_vs_championshipPeak";
    if (cleanRecordGap(winner, loser) >= 10 && Math.abs(score(winner) - score(loser)) <= 6) return "cleanResume_vs_biggerResume";
    if (type === "close_split") return "closeDebate";
    return "clearWithCounter";
  }

  function classifyGeneric(a, b) {
    const [winner, loser] = winnerLoser(a, b);
    const gap = Math.abs(score(winner) - score(loser));
    if (gap >= 8 || rank(loser) - rank(winner) >= 14) return "blowout";
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

  function summarySentence(winner, loser, winnerLabel, loserLabel) {
    return `${loser.fighter} has the ${loserLabel}. ${winner.fighter} has the ${winnerLabel}.`;
  }

  function angleCopy(winner, loser, angle) {
    const winnerResume = field(winner, "resume", `${winner.fighter} has the stronger total resume.`);
    const winnerEdge = field(winner, "edge", `${winner.fighter} separates through the bigger overall case.`);
    const loserCounter = field(loser, "counter", `${loser.fighter} has a real counterargument.`);
    const loserPeak = field(loser, "peak", `${loser.fighter}'s best version gives him a real lane in this debate.`);
    const loserSignature = field(loser, "signatureWins", loserCounter);
    const winnerSignature = field(winner, "signatureWins", field(winner, "opponentQuality", winnerResume));

    if (angle === "blowoutRespect") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins comfortably, but ${loser.fighter}'s case still gets respect.`,
        paragraphs: [
          field(loser, "shortCase", `${loser.fighter} has real all-time value, but this is a difficult matchup for him.`),
          `${winner.fighter} is operating with a much more complete resume. ${winnerResume}`,
          `${loser.fighter} may have a lane worth discussing, but ${winner.fighter}'s championship weight, ranking position, and overall body of work are too far ahead.`
        ],
        finalTake: `${winner.fighter} wins comfortably. ${loser.fighter}'s best argument matters, but ${winner.fighter} has the deeper and more complete all-time case.`
      };
    }

    if (angle === "compactPeak_vs_longReign") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but ${loser.fighter}'s compact peak makes it interesting.`,
        paragraphs: [
          `${loser.fighter} has the flashier short-window case. ${loserSignature}`,
          `${winner.fighter} separates because the run is bigger and more sustained. ${winnerSignature}`,
          summarySentence(winner, loser, "stronger championship resume", "better compact resume")
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s peak deserves real respect, but ${winner.fighter}'s resume is longer, deeper, and more complete.`
      };
    }

    if (angle === "starPower_vs_resume") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but ${loser.fighter} owns the impact argument.`,
        paragraphs: [
          `${loser.fighter} has the star-power lane. ${field(loser, "starPower", loserCounter)}`,
          `${winner.fighter} separates because the ranking case has more substance. ${winnerResume}`,
          summarySentence(winner, loser, "stronger competitive resume", "bigger star and moment case")
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s impact is real, but ${winner.fighter} has the better sustained all-time resume.`
      };
    }

    if (angle === "sameDivision_rivalry") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins because the divisional separation is cleaner.`,
        paragraphs: [
          `${loser.fighter} has a real case. ${field(loser, "resume", loserCounter)}`,
          `${winner.fighter} separates inside the shared divisional picture. ${field(winner, "rivalry", winnerEdge)}`,
          summarySentence(winner, loser, "stronger divisional separation", "argument that keeps the debate alive")
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s case is real, but ${winner.fighter} has the cleaner divisional claim in this comparison.`
      };
    }

    if (angle === "scopeContext") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but this one needs context.`,
        paragraphs: [
          field(loser, "scope", field(winner, "scope", "Some of the historical case sits outside the scoring boundary, so the comparison needs context.")),
          `${loser.fighter} still has a real argument. ${loserCounter}`,
          `${winner.fighter} separates on the scored resume. ${winnerResume}`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s broader legacy matters historically, but ${winner.fighter} has the stronger scored resume here.`
      };
    }

    if (angle === "peakAura_vs_consistency") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but ${loser.fighter} has the louder peak argument.`,
        paragraphs: [
          `${loser.fighter} has the aura lane. ${loserPeak}`,
          `${winner.fighter} separates through consistency and a cleaner full case. ${winnerResume}`,
          summarySentence(winner, loser, "cleaner overall resume", "more explosive peak argument")
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s peak is dangerous in the debate, but ${winner.fighter}'s total case is cleaner and more complete.`
      };
    }

    if (angle === "volume_vs_championshipPeak") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but ${loser.fighter} has the sharper champion-peak argument.`,
        paragraphs: [
          `${loser.fighter} has the better peak/title-run lane. ${field(loser, "championship", loserPeak)}`,
          `${winner.fighter} separates through volume and staying power. ${winnerResume}`,
          summarySentence(winner, loser, "deeper body of work", "stronger peak argument")
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s peak matters, but ${winner.fighter}'s longer and deeper resume carries the comparison.`
      };
    }

    if (angle === "cleanResume_vs_biggerResume") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins because the case is cleaner.`,
        paragraphs: [
          `${loser.fighter} has a real volume or peak argument. ${loserCounter}`,
          `${winner.fighter} separates because there is less to explain away. ${winnerEdge}`,
          summarySentence(winner, loser, "cleaner ranking case", "messier but dangerous counterargument")
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter} has real all-time value, but ${winner.fighter}'s cleaner resume wins the debate.`
      };
    }

    if (angle === "closeDebate") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but this is close enough to argue.`,
        paragraphs: [
          `${loser.fighter} has a real lane. ${loserCounter}`,
          `${winner.fighter} gets the edge because the total case adds up better. ${winnerEdge}`,
          summarySentence(winner, loser, "slightly stronger complete case", "best counterargument")
        ],
        finalTake: `${winner.fighter} wins narrowly. ${loser.fighter} has a real argument, but ${winner.fighter}'s overall resume has the edge.`
      };
    }

    return {
      winner: winner.fighter,
      headline: `${winner.fighter} wins, but ${loser.fighter} has a real counterargument.`,
      paragraphs: [
        `${loser.fighter}'s best lane is clear. ${loserCounter}`,
        `${winner.fighter} separates because the overall case is stronger. ${winnerEdge}`,
        summarySentence(winner, loser, "greater total case", "cleaner debate lane")
      ],
      finalTake: `${winner.fighter} wins. ${loser.fighter} has a real argument, but ${winner.fighter}'s total resume is stronger.`
    };
  }

  function renderAngleIfGeneric() {
    const fighterA = document.getElementById("fighterA");
    const fighterB = document.getElementById("fighterB");
    const result = document.getElementById("compareResult");
    if (!fighterA || !fighterB || !result) return false;

    const a = lookup(fighterA.value);
    const b = lookup(fighterB.value);
    if (SPECIAL_KEYS.has(pairKey(a, b))) return false;

    const [winner, loser] = winnerLoser(a, b);
    const type = classifyGeneric(a, b);
    const angle = pickAngle(winner, loser, type);
    const copy = angleCopy(winner, loser, angle);

    result.classList.add("compare-natural");
    result.innerHTML = `
      ${fighterCard(a)}
      ${fighterCard(b)}
      <article class="card debate-card">
        <h3>${escapeHtml(copy.headline)}</h3>
        ${copy.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("")}
        <div class="final-take"><strong>Final take:</strong> ${escapeHtml(copy.finalTake)}</div>
      </article>
    `;
    return true;
  }

  function bootAngleEngine() {
    const previousRender = window.renderCompare;
    window.renderCompare = function angleAwareRenderCompare() {
      if (typeof previousRender === "function") previousRender();
      setTimeout(renderAngleIfGeneric, 0);
    };
    try { renderCompare = window.renderCompare; } catch (e) {}

    ["fighterA", "fighterB"].forEach(id => {
      const select = document.getElementById(id);
      if (select && !select.dataset.angleEngineV1Bound) {
        select.dataset.angleEngineV1Bound = "true";
        select.addEventListener("change", () => setTimeout(renderAngleIfGeneric, 0));
      }
    });

    setTimeout(renderAngleIfGeneric, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAngleEngine);
  } else {
    bootAngleEngine();
  }
})();
