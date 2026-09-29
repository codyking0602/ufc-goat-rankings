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
    "Dominick Cruz", "Conor McGregor", "Matt Hughes", "Henry Cejudo", "Randy Couture", "Daniel Cormier",
    "Stipe Miocic", "Israel Adesanya", "B.J. Penn", "Chuck Liddell", "Alex Pereira", "Ilia Topuria",
    "Francis Ngannou", "Merab Dvalishvili", "Amanda Nunes", "Valentina Shevchenko"
  ]);

  const PHRASES = {
    loserOpen: [
      "The best case for {loser} is straightforward:",
      "{loser}'s side of the debate starts here:",
      "{loser} keeps this interesting because",
      "The argument for {loser} is built around this:"
    ],
    winnerOpen: [
      "The edge for {winner} comes from",
      "{winner} pulls ahead through",
      "What pushes {winner} ahead is",
      "{winner}'s case gets stronger when you weigh"
    ],
    bridge: [
      "That is the split in the debate.",
      "That is where the comparison separates.",
      "That is the cleanest way to frame it.",
      "That is the difference between the two cases."
    ],
    finalLead: [
      "Final take:",
      "Bottom line:",
      "Verdict:",
      "The call:"
    ]
  };

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

  function hash(value) {
    return String(value).split("").reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0);
  }

  function pick(list, key, vars = {}) {
    const phrase = list[Math.abs(hash(key)) % list.length];
    return phrase.replace(/\{winner\}/g, vars.winner || "").replace(/\{loser\}/g, vars.loser || "");
  }

  function capitalizeFirst(text) {
    const value = String(text || "").trim();
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function clean(text) {
    return String(text || "")
      .replace(/résumé/g, "resume")
      .replace(/Résumé/g, "Resume")
      .replace(/scoring boundary/g, "UFC-only boundary")
      .replace(/scored window/g, "UFC portion")
      .replace(/scored UFC/g, "UFC")
      .replace(/scored value/g, "UFC value")
      .replace(/scored resume/g, "UFC resume")
      .replace(/scored portion/g, "UFC portion")
      .replace(/scored/g, "UFC")
      .replace(/scoring/g, "ranking")
      .replace(/visible resume profile/g, "UFC case")
      .replace(/visible résumé profile/g, "UFC case")
      .replace(/title-and-prime profile/g, "title run and elite years")
      .replace(/full title-and-prime profile/g, "title run and elite years")
      .replace(/prime note:/g, "prime:")
      .replace(/direct result/g, "fight between them")
      .replace(/head-to-head history/g, "fight between them")
      .replace(/direct-fight context/g, "fight between them")
      .replace(/full ranking case/g, "overall case")
      .replace(/ranking case/g, "overall case")
      .replace(/clean modern/g, "sharp")
      .replace(/cleaner modern/g, "stronger")
      .replace(/direct separation/g, "clear separation")
      .replace(/The argument against ([^.]+?) is that/g, "The concern with $1 is that")
      .replace(/the argument against ([^.]+?) is that/g, "the concern with $1 is that")
      .replace(/The argument against ([^.]+?) is/g, "The concern with $1 is")
      .replace(/the argument against ([^.]+?) is/g, "the concern with $1 is")
      .replace(/argument against/g, "concern with")
      .replace(/, or both/g, "")
      .replace(/ or both/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function sentence(text) {
    return capitalizeFirst(clean(text));
  }

  function ledgerEntry(a, b) {
    const ledger = window.COMPARE_FIGHT_LEDGER || {};
    const item = ledger[ledgerKey(a, b)] || ledger[directKey(a, b)] || ledger[directKey(b, a)] || null;
    if (!item) return null;
    return { ...item, summary: sentence(item.summary) };
  }

  function sameDivision(a, b) {
    const bDivs = [b.primaryDivision, b.secondaryDivision].filter(Boolean).join(" / ").toLowerCase();
    return [a.primaryDivision, a.secondaryDivision].filter(Boolean).some(div => bDivs.includes(String(div).toLowerCase()));
  }

  function field(f, key, fallback) {
    const p = compareProfile(f);
    return sentence(p[key] || fallback || "");
  }

  function profileText(f) {
    const p = compareProfile(f);
    return Object.values(p).filter(v => typeof v === "string").join(" ").toLowerCase();
  }

  function plural(value, singular, pluralText) {
    return Number(value) === 1 ? singular : (pluralText || `${singular}s`);
  }

  function legacyStats(f) { return compareProfile(f).legacyStats || {}; }

  function titleStatLine(f) {
    const s = legacyStats(f);
    const pieces = [];
    if (s.titleFightWins !== undefined) pieces.push(`${s.titleFightWins} UFC ${plural(s.titleFightWins, "title-fight win")}`);
    if (s.beltsWon !== undefined) pieces.push(`${s.beltsWon} UFC ${plural(s.beltsWon, "belt")} won`);
    if (s.titleDefenses !== undefined) pieces.push(`${s.titleDefenses} ${plural(s.titleDefenses, "title defense")}`);
    return pieces.length ? pieces.join(", ") : "";
  }

  function activeYearsLine(f) {
    const s = legacyStats(f);
    if (!s.activeEliteYearsLabel) return "";
    return clean(s.activeEliteYearsLabel.replace(/^roughly /, "about "));
  }

  function primeLine(f) {
    const s = legacyStats(f);
    return sentence(s.primeNote || "");
  }

  function statSentence(f) {
    const title = titleStatLine(f);
    const years = activeYearsLine(f);
    const parts = [];
    if (title) parts.push(title);
    if (years) parts.push(years);
    if (!parts.length) return "";
    return `${f.fighter} brings ${parts.join(", and ")}.`;
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

  function directHeadline(winner, loser, h2h) {
    if (!h2h) return "";
    if (h2h.winner === loser.fighter) return `${winner.fighter} wins, even with ${loser.fighter}'s win between them.`;
    if (h2h.winner === winner.fighter) return `${winner.fighter} wins, and their fight helps explain why.`;
    if (h2h.winner === "Split") return `${winner.fighter} wins, but their fights make it more complicated.`;
    return `${winner.fighter} wins, with their fight adding real context.`;
  }

  function headline(winner, loser, type, angle, h2h) {
    if (angle === "directFight") return directHeadline(winner, loser, h2h);
    if (angle === "compactPeak_vs_longReign") return `${winner.fighter} wins, but ${loser.fighter}'s compact peak keeps it interesting.`;
    if (angle === "starPower_vs_resume") return `${winner.fighter} wins, but ${loser.fighter} owns the impact argument.`;
    if (angle === "peakAura_vs_consistency") return `${winner.fighter} wins, but ${loser.fighter} has the louder peak argument.`;
    if (type === "elite_counter") return `${winner.fighter} wins, but ${loser.fighter} has one of the stronger losing arguments.`;
    if (type === "close_split") return `${winner.fighter} wins, but this is close enough to argue.`;
    if (type === "blowout") return `${winner.fighter} wins comfortably, but ${loser.fighter}'s case still gets respect.`;
    return `${winner.fighter} wins, but ${loser.fighter} has a real counterargument.`;
  }

  function loserParagraph(winner, loser, key) {
    const opener = pick(PHRASES.loserOpen, key + "loser", { winner: winner.fighter, loser: loser.fighter });
    const stat = statSentence(loser);
    const prime = primeLine(loser);
    const sig = signatureLine(loser);
    const best = bestArgumentLine(loser);
    const body = `${opener} ${best} ${stat} ${prime ? `${prime}.` : ""} ${sig}`;
    return clean(body);
  }

  function winnerParagraph(winner, loser, key) {
    const opener = pick(PHRASES.winnerOpen, key + "winner", { winner: winner.fighter, loser: loser.fighter });
    const stat = statSentence(winner);
    const prime = primeLine(winner);
    const sig = signatureLine(winner);
    const body = `${opener} the stronger title run and cleaner elite-years case. ${stat} ${prime ? `${prime}.` : ""} ${sig}`;
    return clean(body);
  }

  function summaryParagraph(winner, loser, angle, h2h, key) {
    const bridge = pick(PHRASES.bridge, key + "bridge", { winner: winner.fighter, loser: loser.fighter });
    if (angle === "directFight") {
      if (h2h && h2h.winner === loser.fighter) return clean(`${loser.fighter} won the fight. ${winner.fighter} built the stronger overall case after everything else is weighed. ${bridge}`);
      if (h2h && h2h.winner === winner.fighter) return clean(`${winner.fighter} has the win between them and the stronger overall case. ${bridge}`);
      return clean(`${loser.fighter} keeps the debate alive, but ${winner.fighter} has the stronger overall case. ${bridge}`);
    }
    if (angle === "compactPeak_vs_longReign") return clean(`${loser.fighter} has the cleaner compact peak. ${winner.fighter} has the longer, deeper title run and elite-years case. ${bridge}`);
    if (angle === "starPower_vs_resume") return clean(`${loser.fighter} has the bigger impact and moment case. ${winner.fighter} has the stronger sustained competitive resume. ${bridge}`);
    if (angle === "peakAura_vs_consistency") return clean(`${loser.fighter} has the louder peak argument. ${winner.fighter} has the cleaner, more complete resume. ${bridge}`);
    if (angle === "scopeContext") return clean(`${loser.fighter}'s broader historical case matters. ${winner.fighter} has the stronger UFC case here. ${bridge}`);
    return clean(`${loser.fighter} has a real counterargument. ${winner.fighter} has the stronger title value, active elite years, and complete resume. ${bridge}`);
  }

  function finalTake(winner, loser, angle, h2h, key) {
    const lead = pick(PHRASES.finalLead, key + "final", { winner: winner.fighter, loser: loser.fighter });
    let text;
    if (angle === "directFight") {
      if (h2h && h2h.winner === loser.fighter) text = `${lead} ${winner.fighter} wins. ${loser.fighter} won their fight, but ${winner.fighter} built the longer and deeper all-time resume.`;
      else if (h2h && h2h.winner === winner.fighter) text = `${lead} ${winner.fighter} wins. The fight between them helps, and the broader title/prime case backs it up.`;
      else text = `${lead} ${winner.fighter} wins. Their fights add context, but ${winner.fighter}'s full body of work carries the debate.`;
    } else {
      text = `${lead} ${winner.fighter} wins. ${loser.fighter} has a real argument, but ${winner.fighter}'s title-fight value, active elite years, and complete resume give him the edge.`;
    }
    return clean(text);
  }

  function angleCopy(winner, loser, angle, type, h2h, key) {
    const paragraphs = [];
    if (angle === "directFight" && h2h) paragraphs.push(sentence(h2h.summary));
    if (angle === "scopeContext") paragraphs.push(sentence(field(loser, "scope", field(winner, "scope", "Some of the historical case sits outside this comparison's UFC boundary, so it needs context."))));
    paragraphs.push(loserParagraph(winner, loser, key));
    paragraphs.push(winnerParagraph(winner, loser, key));
    paragraphs.push(summaryParagraph(winner, loser, angle, h2h, key));

    return {
      winner: winner.fighter,
      headline: clean(headline(winner, loser, type, angle, h2h)),
      paragraphs,
      finalTake: finalTake(winner, loser, angle, h2h, key)
    };
  }

  function renderV15IfGeneric() {
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
    const key = ledgerKey(winner, loser) + angle;
    const copy = angleCopy(winner, loser, angle, type, h2h, key);

    result.classList.add("compare-natural");
    result.innerHTML = `
      ${fighterCard(a)}
      ${fighterCard(b)}
      <article class="card debate-card">
        <h3>${escapeHtml(copy.headline)}</h3>
        ${copy.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("")}
        <div class="final-take"><strong>${escapeHtml(copy.finalTake.split(":")[0])}:</strong>${escapeHtml(copy.finalTake.slice(copy.finalTake.indexOf(":") + 1))}</div>
      </article>
    `;
    return true;
  }

  function bootCompareEngineV15() {
    const previousRender = window.renderCompare;
    window.renderCompare = function compareEngineV15Render() {
      if (typeof previousRender === "function") previousRender();
      setTimeout(renderV15IfGeneric, 0);
    };
    try { renderCompare = window.renderCompare; } catch (e) {}

    ["fighterA", "fighterB"].forEach(id => {
      const select = document.getElementById(id);
      if (select && !select.dataset.compareEngineV15Bound) {
        select.dataset.compareEngineV15Bound = "true";
        select.addEventListener("change", () => setTimeout(renderV15IfGeneric, 0));
      }
    });

    setTimeout(renderV15IfGeneric, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootCompareEngineV15);
  } else {
    bootCompareEngineV15();
  }
})();
