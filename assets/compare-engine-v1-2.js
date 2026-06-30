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

  const ELITE_COUNTER_NAMES = new Set([
    "Jon Jones", "Georges St-Pierre", "Demetrious Johnson", "Anderson Silva", "Khabib Nurmagomedov",
    "Islam Makhachev", "Alexander Volkanovski", "Max Holloway", "Kamaru Usman", "Jose Aldo",
    "Dominick Cruz", "Conor McGregor", "Matt Hughes", "Henry Cejudo"
  ]);

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  }

  function data() { return window.RANKING_DATA || { men: [], women: [], fighters: [] }; }

  function lookup(name) {
    const d = data();
    const row = [...(d.men || []), ...(d.women || [])].find(f => f.fighter === name) || { fighter: name };
    const profile = (d.fighters || []).find(f => f.fighter === name) || {};
    return { ...profile, ...row };
  }

  function overrideFor(name) {
    try { if (typeof DISPLAY_OVERRIDES !== "undefined" && DISPLAY_OVERRIDES[name]) return DISPLAY_OVERRIDES[name]; } catch (e) {}
    return {};
  }

  function compareProfile(f) { return overrideFor(f.fighter).compareProfile || f.compareProfile || {}; }
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

  function directKey(a, b) { return `${String(a.fighter || "").toLowerCase()}|${String(b.fighter || "").toLowerCase()}`; }
  function ledgerKey(a, b) { return [String(a.fighter || "").toLowerCase(), String(b.fighter || "").toLowerCase()].sort().join("|"); }

  function ledgerEntry(a, b) {
    const ledger = window.COMPARE_FIGHT_LEDGER || {};
    return ledger[ledgerKey(a, b)] || ledger[directKey(a, b)] || ledger[directKey(b, a)] || null;
  }

  function sameDivision(a, b) {
    const bDivs = [b.primaryDivision, b.secondaryDivision].filter(Boolean).join(" / ").toLowerCase();
    return [a.primaryDivision, a.secondaryDivision].filter(Boolean).some(div => bDivs.includes(String(div).toLowerCase()));
  }

  function field(f, key, fallback) {
    const p = compareProfile(f);
    return p[key] || fallback || "";
  }

  function profileText(f) {
    const p = compareProfile(f);
    return Object.values(p).filter(v => typeof v === "string").join(" ").toLowerCase();
  }

  function isEliteCounter(f) { return Boolean(compareProfile(f).eliteCounter) || ELITE_COUNTER_NAMES.has(f.fighter) || rank(f) <= 30 || ovr(f) >= 84; }
  function isStarPower(f) { return Boolean(compareProfile(f).starPower) || /star-power|cultural impact|changed the business|iconic-moment|biggest cultural/.test(profileText(f)); }
  function isScopeContext(f) { return Boolean(compareProfile(f).scope); }
  function isCompactPeak(f) { return /compact|short-window|short ufc run|high-impact but short|perfect record|purity|short compared|short explosive|achievement burst/.test(profileText(f)) || Number(f.activeEliteYears || 0) <= 4.5; }
  function isLongReign(f) { return /long reign|repeated|sustained|years as|title run|championship authority|controlled|multiple eras|long elite/.test(profileText(f)) || (categoryScore(f, "championship") >= 70 && categoryScore(f, "longevity") >= 50); }
  function isAuraPeak(f) { return /aura|mythology|fear factor|untouchable|terrifying|dangerous|inevitable|matrix|purity|unbeaten/.test(profileText(f)) || categoryScore(f, "primeDominance") >= 88; }
  function hasVolumeCase(f) { return /volume|body of work|long-term|stayed elite|opponent volume|deeper.*resume|sustained elite|multiple generations|quality-win|long elite/.test(profileText(f)) || categoryScore(f, "longevity") >= 70 || categoryScore(f, "opponentQuality") >= 70; }

  function classifyGeneric(winner, loser) {
    const gap = Math.abs(score(winner) - score(loser));
    if (gap <= 4) return "close_split";
    if (gap >= 8 || rank(loser) - rank(winner) >= 14) return isEliteCounter(loser) ? "elite_counter" : "blowout";
    return isEliteCounter(loser) ? "elite_counter" : "clear_with_counter";
  }

  function pickAngle(winner, loser, type, h2h) {
    if (h2h) return "headToHead";
    if (isScopeContext(winner) || isScopeContext(loser)) return "scopeContext";
    if (sameDivision(winner, loser)) return "sameDivision_rivalry";
    if (isStarPower(loser) && !isStarPower(winner)) return "starPower_vs_resume";
    if (isCompactPeak(loser) && (isLongReign(winner) || hasVolumeCase(winner))) return "compactPeak_vs_longReign";
    if (isAuraPeak(loser) && (hasVolumeCase(winner) || categoryScore(winner, "penalty") - categoryScore(loser, "penalty") >= 8)) return "peakAura_vs_consistency";
    if (categoryScore(loser, "primeDominance") + categoryScore(loser, "championship") > categoryScore(winner, "primeDominance") + categoryScore(winner, "championship") + 8 && hasVolumeCase(winner)) return "volume_vs_championshipPeak";
    if (type === "elite_counter") return "eliteCounter";
    if (type === "close_split") return "closeDebate";
    if (type === "blowout") return "blowoutRespect";
    return "clearWithCounter";
  }

  function fighterCard(f) {
    const divLabel = [f.primaryDivision, f.secondaryDivision].filter(Boolean).join(" / ");
    return `<div class="card compare-fighter-card">
      <div class="compare-fighter-rank">#${escapeHtml(rank(f))} · ${escapeHtml(ovr(f))} OVR</div>
      <h3>${escapeHtml(f.fighter)}</h3>
      <p>${escapeHtml(f.ufcRecord || "")}${divLabel ? ` · ${escapeHtml(divLabel)}` : ""}</p>
    </div>`;
  }

  function titlePrimeLine(f, fallback) {
    const title = field(f, "titleSummary", "");
    const prime = field(f, "primeSummary", "");
    if (title && prime) return `${title} ${prime}`;
    return title || prime || fallback;
  }

  function bestArgumentLine(f) {
    return field(f, "bestArgument", field(f, "counter", field(f, "peak", field(f, "shortCase", `${f.fighter} has a real argument.`))));
  }

  function signatureLine(f) {
    return field(f, "signatureWins", field(f, "opponentQuality", field(f, "resume", `${f.fighter} has meaningful ranked wins.`)));
  }

  function winnerSeparationLine(winner) {
    const titlePrime = titlePrimeLine(winner, "");
    const sig = signatureLine(winner);
    if (titlePrime && sig) return `${titlePrime} ${sig}`;
    return titlePrime || sig || `${winner.fighter} has the stronger complete case.`;
  }

  function loserArgumentLine(loser) {
    const best = bestArgumentLine(loser);
    const titlePrime = titlePrimeLine(loser, "");
    const sig = signatureLine(loser);
    const pieces = [best, titlePrime, sig].filter(Boolean);
    return pieces.join(" ");
  }

  function headline(winner, loser, type, angle) {
    if (angle === "headToHead") return `${winner.fighter} wins, but the head-to-head history has to be part of the debate.`;
    if (type === "elite_counter") return `${winner.fighter} wins, but ${loser.fighter} has one of the stronger losing arguments.`;
    if (type === "close_split") return `${winner.fighter} wins, but this is close enough to argue.`;
    if (type === "blowout") return `${winner.fighter} wins comfortably, but ${loser.fighter}'s case still gets respect.`;
    return `${winner.fighter} wins, but ${loser.fighter} has a real counterargument.`;
  }

  function summaryLabel(winner, loser, angle) {
    if (angle === "headToHead") return `${loser.fighter} has the broader lane that keeps it interesting. ${winner.fighter} has the stronger full ranking case once the direct-fight context, title picture, and prime window are all weighed together.`;
    if (angle === "compactPeak_vs_longReign") return `${loser.fighter} has the cleaner compact peak. ${winner.fighter} has the longer, deeper championship case.`;
    if (angle === "starPower_vs_resume") return `${loser.fighter} has the bigger impact and moment case. ${winner.fighter} has the stronger sustained competitive resume.`;
    if (angle === "peakAura_vs_consistency") return `${loser.fighter} has the louder peak argument. ${winner.fighter} has the cleaner and more complete total case.`;
    if (angle === "volume_vs_championshipPeak") return `${loser.fighter} has the sharper champion-peak argument. ${winner.fighter} has the deeper body of work.`;
    if (angle === "scopeContext") return `${loser.fighter}'s broader historical case matters. ${winner.fighter} has the stronger scored resume here.`;
    return `${loser.fighter} has the counterargument. ${winner.fighter} has the stronger overall ranking case.`;
  }

  function angleCopy(winner, loser, angle, type, h2h) {
    const loserArgument = loserArgumentLine(loser);
    const winnerSeparation = winnerSeparationLine(winner);

    if (angle === "headToHead") {
      return {
        winner: winner.fighter,
        headline: headline(winner, loser, type, angle),
        paragraphs: [
          h2h.summary,
          `${loser.fighter} still has a real all-time lane. ${loserArgument}`,
          `${winner.fighter} separates through the fuller title-and-prime picture. ${winnerSeparation}`,
          summaryLabel(winner, loser, angle)
        ],
        finalTake: `${winner.fighter} wins. The head-to-head history matters, but the total all-time case still decides the ranking.`
      };
    }

    if (angle === "scopeContext") {
      return {
        winner: winner.fighter,
        headline: headline(winner, loser, type, angle),
        paragraphs: [
          field(loser, "scope", field(winner, "scope", "Some of the historical case sits outside the scoring boundary, so the comparison needs context.")),
          `${loser.fighter}'s best argument is still real. ${loserArgument}`,
          `${winner.fighter} separates on the scored title-and-prime picture. ${winnerSeparation}`,
          summaryLabel(winner, loser, angle)
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s broader legacy matters historically, but ${winner.fighter} has the stronger scored resume here.`
      };
    }

    return {
      winner: winner.fighter,
      headline: headline(winner, loser, type, angle),
      paragraphs: [
        `${loser.fighter}'s best lane is clear. ${loserArgument}`,
        `${winner.fighter} separates because the title-and-prime case is stronger. ${winnerSeparation}`,
        summaryLabel(winner, loser, angle)
      ],
      finalTake: `${winner.fighter} wins. ${loser.fighter} has a real argument, but ${winner.fighter}'s title value, prime window, and complete resume give him the edge.`
    };
  }

  function renderV12IfGeneric() {
    const fighterA = document.getElementById("fighterA");
    const fighterB = document.getElementById("fighterB");
    const result = document.getElementById("compareResult");
    if (!fighterA || !fighterB || !result) return false;

    const a = lookup(fighterA.value);
    const b = lookup(fighterB.value);
    if (SPECIAL_KEYS.has(directKey(a, b))) return false;

    const [winner, loser] = winnerLoser(a, b);
    const type = classifyGeneric(winner, loser);
    const h2h = ledgerEntry(winner, loser);
    const angle = pickAngle(winner, loser, type, h2h);
    const copy = angleCopy(winner, loser, angle, type, h2h);

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

  function bootCompareEngineV12() {
    const previousRender = window.renderCompare;
    window.renderCompare = function compareEngineV12Render() {
      if (typeof previousRender === "function") previousRender();
      setTimeout(renderV12IfGeneric, 0);
    };
    try { renderCompare = window.renderCompare; } catch (e) {}

    ["fighterA", "fighterB"].forEach(id => {
      const select = document.getElementById(id);
      if (select && !select.dataset.compareEngineV12Bound) {
        select.dataset.compareEngineV12Bound = "true";
        select.addEventListener("change", () => setTimeout(renderV12IfGeneric, 0));
      }
    });

    setTimeout(renderV12IfGeneric, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootCompareEngineV12);
  } else {
    bootCompareEngineV12();
  }
})();
