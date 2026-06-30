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
    "Jon Jones",
    "Georges St-Pierre",
    "Demetrious Johnson",
    "Anderson Silva",
    "Khabib Nurmagomedov",
    "Islam Makhachev",
    "Alexander Volkanovski",
    "Max Holloway",
    "Kamaru Usman",
    "Jose Aldo",
    "Dominick Cruz",
    "Conor McGregor",
    "Matt Hughes",
    "Henry Cejudo"
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
    return Object.values(p).filter(v => typeof v === "string").join(" ");
  }

  function field(f, key, fallback) {
    const p = compareProfile(f);
    return p[key] || fallback;
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

  function directNote(a, b) {
    const aMatchups = compareProfile(a).directMatchups || {};
    const bMatchups = compareProfile(b).directMatchups || {};
    return aMatchups[b.fighter] || bMatchups[a.fighter] || "";
  }

  function isEliteCounter(f) {
    return Boolean(compareProfile(f).eliteCounter) || ELITE_COUNTER_NAMES.has(f.fighter) || rank(f) <= 30 || ovr(f) >= 84;
  }

  function isStarPower(f) {
    const text = profileText(f).toLowerCase();
    return Boolean(compareProfile(f).starPower) || /star-power|cultural impact|changed the business|iconic-moment|biggest cultural/.test(text);
  }

  function isScopeContext(f) { return Boolean(compareProfile(f).scope); }

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
    return /aura|mythology|fear factor|untouchable|terrifying|dangerous|inevitable|matrix|purity/.test(text) || categoryScore(f, "primeDominance") >= 88;
  }

  function hasVolumeCase(f) {
    const text = profileText(f).toLowerCase();
    return /volume|body of work|long-term|stayed elite|opponent volume|deeper.*resume|sustained elite|multiple generations|quality-win/.test(text) || categoryScore(f, "longevity") >= 70 || categoryScore(f, "opponentQuality") >= 70;
  }

  function headlineVerb(winner, loser, type) {
    if (type === "elite_counter") return `${winner.fighter} wins, but ${loser.fighter} has one of the stronger losing arguments.`;
    if (type === "close_split") return `${winner.fighter} wins, but this is close enough to argue.`;
    if (type === "clear_with_counter") return `${winner.fighter} wins, but ${loser.fighter} has a real counterargument.`;
    return `${winner.fighter} wins comfortably, but ${loser.fighter}'s case still gets respect.`;
  }

  function classifyGeneric(winner, loser) {
    const gap = Math.abs(score(winner) - score(loser));
    if (gap <= 4) return "close_split";
    if (gap >= 8 || rank(loser) - rank(winner) >= 14) {
      return isEliteCounter(loser) ? "elite_counter" : "blowout";
    }
    return isEliteCounter(loser) ? "elite_counter" : "clear_with_counter";
  }

  function pickAngle(winner, loser, type) {
    if (isScopeContext(winner) || isScopeContext(loser)) return "scopeContext";
    if (sameDivision(winner, loser)) return "sameDivision_rivalry";
    if (isStarPower(loser) && !isStarPower(winner)) return "starPower_vs_resume";
    if (directNote(winner, loser)) return "directFightContext";
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

  function bestLoserLine(loser) {
    return field(loser, "bestArgument", field(loser, "counter", field(loser, "peak", field(loser, "shortCase", `${loser.fighter} has a real argument.`))));
  }

  function winnerSeparationLine(winner) {
    return field(winner, "againstPerfectPeak", field(winner, "signatureWins", field(winner, "opponentQuality", field(winner, "resume", `${winner.fighter} has the stronger total resume.`))));
  }

  function angleCopy(winner, loser, angle, type) {
    const loserBest = bestLoserLine(loser);
    const loserSignature = field(loser, "signatureWins", loserBest);
    const winnerSignature = winnerSeparationLine(winner);
    const winnerResume = field(winner, "resume", winnerSignature);
    const dNote = directNote(winner, loser);

    if (angle === "directFightContext") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but the head-to-head history matters.`,
        paragraphs: [
          dNote,
          `${loser.fighter} still has a real lane in the all-time debate. ${loserSignature}`,
          `${winner.fighter} separates because the full resume is stronger. ${winnerSignature}`
        ],
        finalTake: `${winner.fighter} wins. The head-to-head note matters, but the total all-time resume decides the ranking.`
      };
    }

    if (angle === "eliteCounter") {
      return {
        winner: winner.fighter,
        headline: headlineVerb(winner, loser, type),
        paragraphs: [
          `${loser.fighter} has a serious losing argument. ${loserSignature}`,
          `${winner.fighter} separates because the complete case has more total proof. ${winnerSignature}`,
          `${loser.fighter}'s lane is real. ${winner.fighter}'s overall resume is bigger and easier to rank higher.`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter} has a strong counterargument, but ${winner.fighter}'s opponent depth, title value, and complete resume give him the edge.`
      };
    }

    if (angle === "compactPeak_vs_longReign") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but ${loser.fighter}'s peak makes this a real debate.`,
        paragraphs: [
          `${loser.fighter} has the cleaner short-window argument. ${loserSignature}`,
          `${winner.fighter} separates because the resume is longer and more layered. ${winnerSignature}`,
          `${loser.fighter} has the better compact case. ${winner.fighter} has the stronger total resume.`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s peak deserves real respect, but ${winner.fighter}'s deeper body of work carries the comparison.`
      };
    }

    if (angle === "starPower_vs_resume") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but ${loser.fighter} owns the impact argument.`,
        paragraphs: [
          `${loser.fighter} has the star-power lane. ${field(loser, "starPower", loserSignature)}`,
          dNote ? dNote : `${winner.fighter} separates because the competitive resume has more substance. ${winnerSignature}`,
          `${loser.fighter} has the bigger moment case. ${winner.fighter} has the stronger full ranking case.`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s impact is real, but ${winner.fighter} has the better sustained all-time resume.`
      };
    }

    if (angle === "sameDivision_rivalry") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins because the divisional separation is cleaner.`,
        paragraphs: [
          dNote || `${loser.fighter} has a real case. ${loserSignature}`,
          `${winner.fighter} separates inside the shared divisional picture. ${field(winner, "rivalry", winnerSignature)}`,
          `${loser.fighter}'s argument keeps it competitive. ${winner.fighter}'s divisional claim is stronger.`
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
          `${loser.fighter} still has a real argument. ${loserSignature}`,
          `${winner.fighter} separates on the scored resume. ${winnerSignature}`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s broader legacy matters historically, but ${winner.fighter} has the stronger scored resume here.`
      };
    }

    if (angle === "peakAura_vs_consistency") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but ${loser.fighter} has the louder peak argument.`,
        paragraphs: [
          `${loser.fighter} has the peak/aura lane. ${loserBest}`,
          `${winner.fighter} separates through the more complete case. ${winnerSignature}`,
          `${loser.fighter} has the more explosive argument. ${winner.fighter} has more total proof.`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s peak is dangerous in the debate, but ${winner.fighter}'s total case is deeper and more complete.`
      };
    }

    if (angle === "volume_vs_championshipPeak") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but ${loser.fighter} has the sharper champion-peak argument.`,
        paragraphs: [
          `${loser.fighter} has the better peak/title-run lane. ${field(loser, "championship", loserBest)}`,
          `${winner.fighter} separates through volume and staying power. ${winnerResume}`,
          `${loser.fighter} has the stronger peak argument. ${winner.fighter} has the deeper body of work.`
        ],
        finalTake: `${winner.fighter} wins. ${loser.fighter}'s peak matters, but ${winner.fighter}'s longer and deeper resume carries the comparison.`
      };
    }

    if (angle === "closeDebate") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins, but this is close enough to argue.`,
        paragraphs: [
          `${loser.fighter} has a real lane. ${loserSignature}`,
          `${winner.fighter} gets the edge because the full case adds up better. ${winnerSignature}`,
          `${loser.fighter} may win one version of the argument. ${winner.fighter} wins the overall ranking comparison.`
        ],
        finalTake: `${winner.fighter} wins narrowly. ${loser.fighter} has a real argument, but ${winner.fighter}'s overall resume has the edge.`
      };
    }

    if (angle === "blowoutRespect") {
      return {
        winner: winner.fighter,
        headline: `${winner.fighter} wins comfortably, but ${loser.fighter}'s case still gets respect.`,
        paragraphs: [
          field(loser, "shortCase", `${loser.fighter} has real all-time value, but this is a difficult matchup.`),
          `${winner.fighter} is operating with a more complete resume. ${winnerSignature}`,
          `${loser.fighter} may have a lane worth discussing, but ${winner.fighter}'s championship weight and overall body of work are too far ahead.`
        ],
        finalTake: `${winner.fighter} wins comfortably. ${loser.fighter}'s best argument matters, but ${winner.fighter} has the deeper and more complete all-time case.`
      };
    }

    return {
      winner: winner.fighter,
      headline: headlineVerb(winner, loser, type),
      paragraphs: [
        `${loser.fighter}'s best lane is clear. ${loserSignature}`,
        `${winner.fighter} separates because the overall case is stronger. ${winnerSignature}`,
        `${loser.fighter} has the counterargument. ${winner.fighter} has the greater total case.`
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
    const type = classifyGeneric(winner, loser);
    const angle = pickAngle(winner, loser, type);
    const copy = angleCopy(winner, loser, angle, type);

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

  function bootAngleEngineV11() {
    const previousRender = window.renderCompare;
    window.renderCompare = function angleAwareRenderCompareV11() {
      if (typeof previousRender === "function") previousRender();
      setTimeout(renderAngleIfGeneric, 0);
    };
    try { renderCompare = window.renderCompare; } catch (e) {}

    ["fighterA", "fighterB"].forEach(id => {
      const select = document.getElementById(id);
      if (select && !select.dataset.angleEngineV11Bound) {
        select.dataset.angleEngineV11Bound = "true";
        select.addEventListener("change", () => setTimeout(renderAngleIfGeneric, 0));
      }
    });

    setTimeout(renderAngleIfGeneric, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAngleEngineV11);
  } else {
    bootAngleEngineV11();
  }
})();
