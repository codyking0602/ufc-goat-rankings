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

  function plural(value, singular, pluralText) {
    return Number(value) === 1 ? singular : (pluralText || `${singular}s`);
  }

  function legacyStats(f) {
    return compareProfile(f).legacyStats || {};
  }

  function legacyStatLine(f) {
    const s = legacyStats(f);
    const parts = [];
    if (s.titleFightWins !== undefined) parts.push(`${s.titleFightWins} UFC ${plural(s.titleFightWins, "title-fight win")}`);
    if (s.beltsWon !== undefined) parts.push(`${s.beltsWon} UFC ${plural(s.beltsWon, "belt")} won`);
    if (s.titleDefenses !== undefined) parts.push(`${s.titleDefenses} ${plural(s.titleDefenses, "title defense")}`);
    if (s.activeEliteYearsLabel) parts.push(s.activeEliteYearsLabel);
    if (!parts.length) return "";
    return `${f.fighter}'s visible résumé profile: ${parts.join(", ")}.`;
  }

  function primeNoteLine(f) {
    const s = legacyStats(f);
    return s.primeNote ? `${f.fighter}'s prime note: ${s.primeNote}.` : "";
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
    if (h2h) return "directFight";
    if (isScopeContext(winner) || isScopeContext(loser)) return "scopeContext";
    if (sameDivision(winner, loser)) return "sameDivision_rivalry";
    if (isStarPower(loser) && !isStarPower(winner)) return "starPower_vs_resume";
    if (isCompactPeak(loser) && (isLongReign(winner) || hasVolumeCase(winner))) return "compactPeak_vs_longReign";
    if (isAuraPeak(loser) && hasVolumeCase(winner)) return "peakAura_vs_consistency";
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

  function bestArgumentLine(f) {
    return field(f, "bestArgument", field(f, "counter", field(f, "peak", field(f, "shortCase", `${f.fighter} has a real argument.`))));
  }

  function signatureLine(f) {
    return field(f, "signatureWins", field(f, "opponentQuality", field(f, "resume", `${f.fighter} has meaningful ranked wins.`)));
  }

  function cleanDirectHeadline(winner, loser, h2h) {
    if (!h2h) return "";
    if (h2h.winner === loser.fighter) return `${winner.fighter} wins, even though ${loser.fighter} owns the direct win.`;
    if (h2h.winner === winner.fighter) return `${winner.fighter} wins, and their fight history supports it.`;
    if (h2h.winner === "Split") return `${winner.fighter} wins, but their fights keep the debate nuanced.`;
    return `${winner.fighter} wins, but their fight matters to the debate.`;
  }

  function headline(winner, loser, type, angle, h2h) {
    if (angle === "directFight") return cleanDirectHeadline(winner, loser, h2h);
    if (angle === "compactPeak_vs_longReign") return `${winner.fighter} wins, but ${loser.fighter}'s compact peak makes it interesting.`;
    if (angle === "starPower_vs_resume") return `${winner.fighter} wins, but ${loser.fighter} owns the impact argument.`;
    if (angle === "peakAura_vs_consistency") return `${winner.fighter} wins, but ${loser.fighter} has the louder peak argument.`;
    if (type === "elite_counter") return `${winner.fighter} wins, but ${loser.fighter} has one of the stronger losing arguments.`;
    if (type === "close_split") return `${winner.fighter} wins, but this is close enough to argue.`;
    if (type === "blowout") return `${winner.fighter} wins comfortably, but ${loser.fighter}'s case still gets respect.`;
    return `${winner.fighter} wins, but ${loser.fighter} has a real counterargument.`;
  }

  function loserParagraph(loser) {
    const stat = legacyStatLine(loser);
    const prime = primeNoteLine(loser);
    const best = bestArgumentLine(loser);
    const sig = signatureLine(loser);
    return `${loser.fighter}'s best lane is still real. ${best} ${stat} ${prime} ${sig}`.replace(/\s+/g, " ").trim();
  }

  function winnerParagraph(winner) {
    const stat = legacyStatLine(winner);
    const prime = primeNoteLine(winner);
    const sig = signatureLine(winner);
    const title = field(winner, "titleSummary", "");
    return `${winner.fighter} separates because the full title-and-prime profile is stronger. ${stat} ${prime} ${title} ${sig}`.replace(/\s+/g, " ").trim();
  }

  function summaryParagraph(winner, loser, angle, h2h) {
    if (angle === "directFight") {
      if (h2h && h2h.winner === loser.fighter) return `${loser.fighter} won the fight. ${winner.fighter} built the stronger all-time résumé after everything else is weighed.`;
      if (h2h && h2h.winner === winner.fighter) return `${winner.fighter} has both the direct result and the stronger ranking case.`;
      return `${loser.fighter} keeps the debate alive, but ${winner.fighter} has the stronger complete résumé.`;
    }
    if (angle === "compactPeak_vs_longReign") return `${loser.fighter} has the cleaner compact peak. ${winner.fighter} has the longer, deeper title-and-prime case.`;
    if (angle === "starPower_vs_resume") return `${loser.fighter} has the bigger impact and moment case. ${winner.fighter} has the stronger sustained competitive résumé.`;
    if (angle === "peakAura_vs_consistency") return `${loser.fighter} has the louder peak argument. ${winner.fighter} has the cleaner, more complete résumé profile.`;
    if (angle === "scopeContext") return `${loser.fighter}'s broader historical case matters. ${winner.fighter} has the stronger scored résumé here.`;
    return `${loser.fighter} has the counterargument. ${winner.fighter} has the stronger title value, active elite years, and complete résumé.`;
  }

  function finalTake(winner, loser, angle, h2h) {
    if (angle === "directFight") {
      if (h2h && h2h.winner === loser.fighter) return `${winner.fighter} wins. ${loser.fighter} won their fight, but ${winner.fighter} built the longer and deeper all-time résumé.`;
      if (h2h && h2h.winner === winner.fighter) return `${winner.fighter} wins. The direct result helps, and the broader title/prime case backs it up.`;
      return `${winner.fighter} wins. Their fights add context, but ${winner.fighter}'s total résumé still carries the ranking.`;
    }
    return `${winner.fighter} wins. ${loser.fighter} has a real argument, but ${winner.fighter}'s title-fight value, active elite years, and complete résumé give him the edge.`;
  }

  function angleCopy(winner, loser, angle, type, h2h) {
    const paragraphs = [];
    if (angle === "directFight" && h2h) paragraphs.push(h2h.summary);
    if (angle === "scopeContext") paragraphs.push(field(loser, "scope", field(winner, "scope", "Some of the historical case sits outside the scoring boundary, so the comparison needs context.")));
    paragraphs.push(loserParagraph(loser));
    paragraphs.push(winnerParagraph(winner));
    paragraphs.push(summaryParagraph(winner, loser, angle, h2h));

    return {
      winner: winner.fighter,
      headline: headline(winner, loser, type, angle, h2h),
      paragraphs,
      finalTake: finalTake(winner, loser, angle, h2h)
    };
  }

  function renderV13IfGeneric() {
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

  function bootCompareEngineV13() {
    const previousRender = window.renderCompare;
    window.renderCompare = function compareEngineV13Render() {
      if (typeof previousRender === "function") previousRender();
      setTimeout(renderV13IfGeneric, 0);
    };
    try { renderCompare = window.renderCompare; } catch (e) {}

    ["fighterA", "fighterB"].forEach(id => {
      const select = document.getElementById(id);
      if (select && !select.dataset.compareEngineV13Bound) {
        select.dataset.compareEngineV13Bound = "true";
        select.addEventListener("change", () => setTimeout(renderV13IfGeneric, 0));
      }
    });

    setTimeout(renderV13IfGeneric, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootCompareEngineV13);
  } else {
    bootCompareEngineV13();
  }
})();
