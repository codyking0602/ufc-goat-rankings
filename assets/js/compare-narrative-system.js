// Compare Narrative System - Phase 3: flowing article + natural stat weaving.
(function(){
  const VERSION = 'compare-narrative-system-20260702f';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const CATEGORY_KEYS = [
    ['championship','title-fight value',1.15],
    ['opponentQuality','elite-win depth',1.05],
    ['primeDominance','peak control',1.10],
    ['longevity','completed elite years',1.00],
    ['penalty','cleaner loss profile',0.15]
  ];
  const FINAL_LABELS = ['Final take','Bottom line','The call'];
  let rendering = false;

  function el(id){ return document.getElementById(id); }
  function safe(s){ return String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function cleanNum(n){ return Number.isFinite(Number(n)) ? Number(n) : 0; }
  function roundYear(n){ const val = Number(n); return Number.isFinite(val) ? String(Math.max(1, Math.round(val))) : null; }
  function normalizeKey(a,b){ return [String(a||'').toLowerCase(),String(b||'').toLowerCase()].sort().join('|'); }
  function hash(str){ let h=0; for(let i=0;i<String(str).length;i++){ h=((h<<5)-h)+String(str).charCodeAt(i); h|=0; } return Math.abs(h); }
  function pick(list,key){ return list[hash(key) % list.length]; }
  function pairKey(a,b,tag=''){ return `${normalizeKey(a.fighter,b.fighter)}|${tag}`; }

  function full(name){
    const boardRow = [...(DATA.men || []), ...(DATA.women || [])].find(f => f.fighter === name) || {fighter:name};
    if(typeof window.fullRow === 'function') return window.fullRow(boardRow);
    const profile = (DATA.fighters || []).find(f => f.fighter === name) || {};
    return {...profile, ...boardRow};
  }
  function profileFor(name){ return (window.COMPARE_PROFILES && window.COMPARE_PROFILES[name]) || (window.DISPLAY_OVERRIDES && window.DISPLAY_OVERRIDES[name] && window.DISPLAY_OVERRIDES[name].compareProfile) || {}; }
  function rankFor(f){ return window.DISPLAY_OVERRIDES?.[f.fighter]?.allTimeRank || f.rank || '—'; }
  function ovrFor(f){
    if(typeof window.overallOvr === 'function') return window.overallOvr(f);
    const all = [...(DATA.men || []), ...(DATA.women || [])];
    const max = Math.max(...all.map(x => cleanNum(x.totalScore)), 1);
    return Math.max(60, Math.min(99, Math.round(75 + (cleanNum(f.totalScore) / max) * 24)));
  }
  function categoryOvrFor(f,key){ if(key === 'overall') return ovrFor(f); if(typeof window.categoryOvr === 'function') return window.categoryOvr(f,key); return Math.round(cleanNum(f[key])); }
  function categoryBaseForCompare(f,key){ const raw = Number(f?.[key]); return Number.isFinite(raw) ? raw : categoryOvrFor(f,key); }
  function categoryEdge(f,other,key){ return categoryBaseForCompare(f,key) - categoryBaseForCompare(other,key); }
  function titleFightWins(f,p){
    if(p.legacyStats?.titleFightWins !== undefined) return p.legacyStats.titleFightWins;
    const m = String(f.title?.notes || f.notes || '').match(/Total title fight wins = ([0-9.]+)/i);
    return m ? m[1].replace(/\.0$/,'') : null;
  }
  function eliteYears(f,p){
    if(f.activeEliteYears !== undefined && f.activeEliteYears !== null) return roundYear(f.activeEliteYears);
    const m = String(p.legacyStats?.activeEliteYearsLabel || '').match(/([0-9]+(?:\.[0-9]+)?)/);
    return m ? roundYear(m[1]) : null;
  }
  function compactWins(f,p,count=7){
    if(p.signatureWins) return p.signatureWins;
    const opps = Array.isArray(f.opponents) ? f.opponents : [];
    if(!opps.length) return null;
    const names = [];
    opps.slice().sort((a,b)=>cleanNum(b.credit)-cleanNum(a.credit)).forEach(o => {
      const n = String(o.opponent || '').replace(/\s+\d+$/,'').trim();
      if(n && !names.includes(n)) names.push(n);
    });
    return names.slice(0,count).join(', ');
  }
  function opponentLine(f,p){ const wins = compactWins(f,p,7); if(!wins) return null; return p.signatureWins ? wins : `Wins over ${wins} keep the opponent ledger strong.`; }
  function profileText(f){
    const p = profileFor(f.fighter);
    return [p.shortCase,p.peak,p.resume,p.championship,p.opponentQuality,p.longevity,p.counter,p.edge,p.bestArgument,p.titleSummary,p.primeSummary,p.scope,f.primeEnd,f.notes].filter(Boolean).join(' ').toLowerCase();
  }
  function isStillBuilding(f){ return /still building|case is still growing|keeps getting stronger|keeps gaining|growing title run|young but|ceiling is real|can change the answer|can keep closing|still adding chapters|active modern/i.test(profileText(f)); }
  function isUnbeatenDominanceCase(f){ return /unbeaten|perfect ufc record|no ufc losses|purity|cleanest peak|almost flawless|unbeatable/i.test(profileText(f)); }

  function edgeKeys(f, other){
    const edges = CATEGORY_KEYS.map(([key,label,weight]) => {
      const rawDiff = categoryEdge(f,other,key);
      return { key, label, rawDiff, diff: rawDiff * weight };
    }).filter(x => x.rawDiff > 0).sort((a,b)=>b.diff-a.diff);
    if(isUnbeatenDominanceCase(f)){
      const preferred = ['primeDominance','penalty'];
      const boosted = [];
      preferred.forEach(key => { const item = edges.find(x => x.key === key); if(item && !boosted.includes(item)) boosted.push(item); });
      edges.forEach(item => { if(!boosted.includes(item)) boosted.push(item); });
      return boosted;
    }
    const nonPenalty = edges.filter(x => x.key !== 'penalty');
    if(nonPenalty.length) return nonPenalty.concat(edges.filter(x => x.key === 'penalty'));
    return edges;
  }
  function displayEdges(f, other){
    const all = edgeKeys(f, other);
    if(isUnbeatenDominanceCase(f)) return all.slice(0,2);
    const nonPenalty = all.filter(x => x.key !== 'penalty');
    return (nonPenalty.length ? nonPenalty : all).slice(0,2);
  }
  function readableLanes(f, other){
    const edges = displayEdges(f, other).map(x => x.label);
    if(edges.length === 0) return 'his best individual lane';
    if(edges.length === 1) return edges[0];
    return `${edges[0]} and ${edges[1]}`;
  }
  function archetype(winner, loser, a, b){
    const diff = Math.abs(ovrFor(a) - ovrFor(b));
    const ledger = window.COMPARE_FIGHT_LEDGER?.[normalizeKey(a.fighter,b.fighter)] || null;
    const loserPrimeEdge = edgeKeys(loser,winner).some(x => x.key === 'primeDominance');
    if(ledger) return {type:'rivalry', ledger};
    if(diff <= 1) return {type:'razor'};
    if(diff <= 4) return {type:'close'};
    if(isStillBuilding(loser)) return {type:'activeCeiling'};
    if(loserPrimeEdge) return {type:'peakVsResume'};
    if(diff >= 9) return {type:'tierGap'};
    return {type:'clear'};
  }

  function verdictLine(winner, loser, type, a, b){
    const variants = {
      razor: [`${winner.fighter} wins by a hair, but ${loser.fighter} makes it uncomfortable.`,`${winner.fighter} edges it, but this is a real split-the-room comparison.`,`${winner.fighter} is barely ahead; ${loser.fighter} has a serious losing argument.`],
      close: [`${winner.fighter} wins, but ${loser.fighter} has a serious counterargument.`,`${winner.fighter} has the better UFC-only case, but ${loser.fighter} makes him work for it.`,`${winner.fighter} gets the nod, while ${loser.fighter} still has a real lane.`],
      rivalry: [`${winner.fighter} wins, and their direct UFC history helps explain why.`,`${winner.fighter} has the stronger case, with the rivalry context part of the story.`,`${winner.fighter} gets the edge, and this one comes with real direct-fight history.`],
      activeCeiling: [`${winner.fighter} has the completed resume; ${loser.fighter} has the still-building case.`,`${winner.fighter} wins for now, but ${loser.fighter}'s ceiling is the interesting part.`,`${winner.fighter} leads today, but ${loser.fighter} is the one who can change the answer later.`],
      peakVsResume: [`${winner.fighter} has the better UFC-only resume, but ${loser.fighter} has a real peak argument.`,`${winner.fighter} wins the total resume debate; ${loser.fighter} can still make the peak case uncomfortable.`,`${winner.fighter} has more complete UFC value, even if ${loser.fighter}'s best version deserves respect.`],
      tierGap: [`${winner.fighter} wins this comparison clearly.`,`This is a tier-gap comparison in ${winner.fighter}'s favor.`,`${loser.fighter} has an argument in pieces, but ${winner.fighter} owns the comparison overall.`],
      clear: [`${winner.fighter} wins the UFC-only GOAT comparison, but ${loser.fighter} has a real lane.`,`${winner.fighter} has the stronger case, but the losing argument is still worth laying out.`,`${winner.fighter} is the pick, with ${loser.fighter}'s counterargument sitting in a narrower lane.`]
    };
    return pick(variants[type] || variants.clear, pairKey(a,b,`verdict-${type}`));
  }
  function titleValueLine(f,p,other,role){
    const tfw = titleFightWins(f,p);
    if(tfw === null) return null;
    const edge = categoryEdge(f,other,'championship');
    const otherTfw = titleFightWins(other, profileFor(other.fighter));
    if(edge > 0){
      if(role === 'winner') return `${f.fighter}'s ${tfw} UFC title-fight wins help create separation in the title-reign part of the debate.`;
      return `${f.fighter}'s ${tfw} UFC title-fight wins are a real counterargument${otherTfw !== null ? ` against ${other.fighter}'s ${otherTfw}` : ''}.`;
    }
    if(role === 'loser') return `${f.fighter}'s ${tfw} UFC title-fight wins keep the case credible, but title volume is not where he wins this comparison.`;
    return null;
  }
  function eliteYearsLine(f,p,other,role){
    const years = eliteYears(f,p);
    if(!years) return null;
    const edge = categoryEdge(f,other,'longevity');
    if(edge > 0){
      if(role === 'winner') return `About ${years} active elite years gives ${f.fighter} more completed UFC proof.`;
      return `About ${years} active elite years adds real weight to ${f.fighter}'s counterargument.`;
    }
    if(role === 'loser'){
      if(isStillBuilding(f)) return `About ${years} active elite years shows the case is still building, not fully maxed out yet.`;
      return `About ${years} active elite years gives the case real weight, but ${other.fighter} owns the longer completed elite window.`;
    }
    return null;
  }
  function detailFor(f,other,role,hasWinsLine){
    const p = profileFor(f.fighter);
    const top = edgeKeys(f, other)[0]?.key;
    if(role === 'loser' && p.bestArgument) return p.bestArgument;
    const opponentFallback = hasWinsLine ? (role === 'winner' ? (p.longevity || p.resume || p.edge) : (p.counter || p.peak || p.resume)) : (p.opponentQuality || p.resume);
    const byCategory = {
      championship: p.championship || p.titleSummary,
      opponentQuality: opponentFallback,
      primeDominance: p.peak || p.primeSummary,
      longevity: p.longevity || p.resume,
      penalty: p.weakness || p.shortCase
    };
    if(top && byCategory[top]) return byCategory[top];
    if(role === 'winner') return p.edge || p.resume || p.shortCase;
    return p.peak || p.counter || p.resume || p.shortCase;
  }
  function argumentParagraph(f, other, role, type){
    const p = profileFor(f.fighter);
    const lanes = readableLanes(f, other);
    const titleLine = titleValueLine(f,p,other,role);
    const yearsLine = eliteYearsLine(f,p,other,role);
    const winsLine = opponentLine(f,p);
    const parts = [];
    if(role === 'loser'){
      if(type === 'activeCeiling' && isStillBuilding(f)) parts.push(`If you are arguing for ${f.fighter}, the lane is obvious: the case is still growing.`);
      else if(type === 'peakVsResume') parts.push(`The best case for ${f.fighter} starts with peak value.`);
      else if(type === 'rivalry') parts.push(`${f.fighter}'s counterargument is real; it just has to survive the direct history.`);
      else parts.push(`The best version of the ${f.fighter} argument starts with ${lanes}.`);
    } else {
      if(type === 'activeCeiling') parts.push(`${f.fighter} still pulls ahead because his case has more completed proof.`);
      else if(type === 'rivalry') parts.push(`${f.fighter}'s broader case holds up because the direct history is part of the larger resume story.`);
      else parts.push(`${f.fighter} creates separation through ${lanes}.`);
    }
    if(titleLine) parts.push(titleLine);
    if(yearsLine) parts.push(yearsLine);
    if(winsLine) parts.push(winsLine);
    const detail = detailFor(f, other, role, Boolean(winsLine));
    if(detail) parts.push(detail);
    return parts.filter(Boolean).join(' ');
  }
  function ledgerWinnerMatches(ledger, fighter){ return String(ledger?.winner || '').toLowerCase() === String(fighter?.fighter || fighter || '').toLowerCase(); }
  function swingParagraph(winner, loser, type, ledger){
    if(type === 'rivalry' && ledger){
      if(ledgerWinnerMatches(ledger,winner)) return `${ledger.summary} That does not mean the fight ledger is the only thing that matters, but it makes the comparison cleaner: the direct history and the broader UFC case both point toward ${winner.fighter}.`;
      if(ledgerWinnerMatches(ledger,loser)) return `${ledger.summary} That direct result matters, but it does not automatically decide the GOAT comparison. ${winner.fighter} still has the stronger completed UFC resume once title value, elite wins, longevity, and loss context are weighed together.`;
      if(String(ledger?.winner || '').toLowerCase() === 'split') return `${ledger.summary} The series is split, so this is not a clean direct edge either way. The tiebreaker is the broader UFC resume, where ${winner.fighter} has more completed value.`;
      return `${ledger.summary} The direct history adds context, but ${winner.fighter}'s broader UFC resume is the separator.`;
    }
    if(type === 'activeCeiling') return `${loser.fighter} may eventually make this a different conversation. Right now, the difference is completed proof. ${winner.fighter} has the larger finished UFC case, while ${loser.fighter} is still adding chapters.`;
    if(type === 'peakVsResume') return `${loser.fighter} can win parts of the peak conversation. The reason it does not flip is that this ranking is asking for total UFC value, and ${winner.fighter} has more of it banked.`;
    if(type === 'razor' || type === 'close') return `${loser.fighter} wins enough of the debate to make it close. The swing point is that ${winner.fighter} has slightly more complete UFC value once title-fight value, elite wins, longevity, and loss context are all considered together.`;
    if(type === 'tierGap') return `${loser.fighter}'s best points matter, but they do not cover enough ground. ${winner.fighter} owns too much of the total UFC-only picture.`;
    return `${loser.fighter} has a real counterargument. ${winner.fighter} still has more ways to win the full UFC-only resume debate.`;
  }
  function distinctionParagraph(winner, loser){
    const loserEdges = edgeKeys(loser,winner);
    const keys = new Set(loserEdges.map(x => x.key));
    const hasVolume = keys.has('opponentQuality') || keys.has('longevity');
    const hasPeak = keys.has('primeDominance');
    const hasTitle = keys.has('championship');
    if(hasTitle && hasPeak) return `Better champion-peak argument: ${loser.fighter} has a real case if you are focused on title control and round-to-round dominance. Greater UFC-only resume: ${winner.fighter} still has the stronger completed body of work.`;
    if(isUnbeatenDominanceCase(loser) || (hasPeak && !hasVolume)) return `Better fighter argument: ${loser.fighter} has a real case if you are talking peak skill, matchup dominance, or how unbeatable the best version looked. Greater UFC-only resume: ${winner.fighter} still has the stronger completed UFC career.`;
    if(hasVolume) return `${loser.fighter}'s best counterargument is resume depth: longevity, durability, and opponent volume. Greater UFC-only resume: ${winner.fighter} still has the stronger total case once the full comparison is weighed.`;
    return `This is not the same as asking who would win head-to-head. The better UFC-only GOAT case belongs to ${winner.fighter}, because his resume has more completed all-time value.`;
  }
  function finalTake(winner, loser, type, a, b, ledger){
    const winnerLanes = readableLanes(winner, loser);
    if(type === 'rivalry' && ledger){
      if(ledgerWinnerMatches(ledger,winner)) return `${winner.fighter} wins. The direct fight history helps, and the broader ${winnerLanes} case backs it up.`;
      if(ledgerWinnerMatches(ledger,loser)) return `${winner.fighter} wins the UFC-only GOAT comparison, even though ${loser.fighter} owns the direct result. The broader completed resume gives ${winner.fighter} the edge.`;
      if(String(ledger?.winner || '').toLowerCase() === 'split') return `${winner.fighter} wins. The direct series is split, so the call comes down to the broader UFC resume and ${winner.fighter}'s edge in ${winnerLanes}.`;
    }
    const variants = {
      razor: [`${winner.fighter} wins, barely. ${loser.fighter} has enough category strength to make it uncomfortable, but ${winner.fighter}'s edge in ${winnerLanes} gives him the slight nod.`,`${winner.fighter} is the pick by a thin margin. ${loser.fighter} wins real parts of the debate, but ${winner.fighter}'s edge in ${winnerLanes} is just enough.`],
      activeCeiling: [`${winner.fighter} gets the nod for now. ${loser.fighter}'s ceiling is real, but ${winner.fighter} owns more of the completed UFC-only resume today.`,`${winner.fighter} wins today. ${loser.fighter} can keep closing the gap, but this is still completed resume over a still-building case.`],
      rivalry: [`${winner.fighter} wins. The direct fight history adds context, and the broader UFC resume points his way.`,`${winner.fighter} is the call. The head-to-head context and the wider UFC resume are both part of the answer.`],
      tierGap: [`${winner.fighter} wins clearly. ${loser.fighter} has a real argument in specific lanes, but not enough to close the overall UFC-only gap.`,`${winner.fighter} is too far ahead overall. ${loser.fighter}'s best points matter, but this does not become a true toss-up.`],
      default: [`${winner.fighter} wins the UFC-only GOAT comparison. ${loser.fighter} has a real argument, but ${winner.fighter}'s edge in ${winnerLanes} gives him the stronger completed case.`,`${winner.fighter} gets the nod. ${loser.fighter} has a credible case in the right lane, but ${winner.fighter} owns more of the completed UFC-only resume.`,`${winner.fighter} is the answer here. ${loser.fighter}'s argument is real, but it does not outweigh the total UFC resume on the other side.`]
    };
    return pick(variants[type] || variants.default, pairKey(a,b,`final-${type}`));
  }
  function finalLabel(a,b){ return pick(FINAL_LABELS, pairKey(a,b,'final-label')); }
  function faceCard(f){
    const rank = rankFor(f);
    const div = [f.primaryDivision, f.secondaryDivision].filter(Boolean).join(' / ');
    return `<article class="compare-face-card"><div><h3>${safe(f.fighter)}</h3><p>${safe(f.ufcRecord || '')}${div ? ` · ${safe(div)}` : ''}</p></div><span class="compare-face-badge">#${safe(rank)} · ${safe(ovrFor(f))} OVR</span></article>`;
  }
  function render(){
    if(rendering) return;
    const result = el('compareResult');
    const selectA = el('fighterA');
    const selectB = el('fighterB');
    if(!result || !selectA || !selectB || !selectA.value || !selectB.value) return;
    const a = full(selectA.value);
    const b = full(selectB.value);
    const aScore = cleanNum(a.totalScore) || ovrFor(a);
    const bScore = cleanNum(b.totalScore) || ovrFor(b);
    const winner = aScore >= bScore ? a : b;
    const loser = winner.fighter === a.fighter ? b : a;
    const typeInfo = archetype(winner, loser, a, b);
    const type = typeInfo.type;
    const paragraphs = [argumentParagraph(loser, winner, 'loser', type),argumentParagraph(winner, loser, 'winner', type),swingParagraph(winner, loser, type, typeInfo.ledger),distinctionParagraph(winner, loser)].filter(Boolean);
    rendering = true;
    result.classList.add('compare-article-mode');
    result.dataset.compareNarrativeRendered = VERSION;
    result.innerHTML = `${faceCard(a)}${faceCard(b)}<article class="card compare-flow-card"><h3>${safe(verdictLine(winner, loser, type, a, b))}</h3>${paragraphs.map(p => `<p>${safe(p)}</p>`).join('')}<div class="compare-final-take"><p><strong>${safe(finalLabel(a,b))}:</strong> ${safe(finalTake(winner, loser, type, a, b, typeInfo.ledger))}</p></div></article>`;
    rendering = false;
  }
  function injectCss(){
    const existing = document.getElementById('compare-narrative-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'compare-narrative-css';
    style.textContent = `#compareResult.compare-article-mode{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.compare-face-card{position:relative;min-height:104px!important;padding:15px 16px!important;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,#23324a,#172033);box-shadow:0 13px 32px rgba(15,23,42,.16);display:flex;align-items:flex-end;justify-content:space-between;gap:12px;color:#f8faff;overflow:hidden}.compare-face-card h3{margin:0;font-size:clamp(22px,4vw,31px);line-height:1.02;color:#f8faff!important;letter-spacing:-.03em}.compare-face-card p{margin:8px 0 0;color:#c7d2e2!important;font-size:15px;line-height:1.25}.compare-face-badge{position:absolute;top:14px;right:14px;border:1px solid rgba(250,204,21,.48);background:rgba(250,204,21,.08);color:#fde68a;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:950;letter-spacing:.04em;white-space:nowrap}.compare-flow-card{grid-column:1/-1;background:linear-gradient(180deg,#23324a,#172033)!important;border-color:#40536f!important;color:#f8faff!important;padding:26px!important;border-radius:24px!important;box-shadow:0 13px 32px rgba(15,23,42,.16)}.compare-flow-card h3{margin:0 0 18px;font-size:clamp(30px,5vw,45px);line-height:1.05;letter-spacing:-.04em;color:#f8faff!important}.compare-flow-card p{margin:0 0 18px;color:#c7d2e2!important;line-height:1.6;font-size:18px}.compare-flow-card p:last-child{margin-bottom:0}.compare-final-take{margin-top:24px;border:1px solid rgba(250,204,21,.42);border-left:7px solid #facc15;border-radius:20px;padding:18px 20px;background:rgba(34,40,42,.82);box-shadow:0 13px 32px rgba(15,23,42,.14)}.compare-final-take p{margin:0!important;color:#f8faff!important;font-size:18px;line-height:1.55}.compare-final-take strong{color:#facc15!important}@media(max-width:900px){#compareResult.compare-article-mode{grid-template-columns:1fr;gap:10px}.compare-face-card{min-height:88px!important;padding:14px!important;border-radius:18px}.compare-face-card h3{font-size:25px}.compare-face-card p{font-size:14px;padding-right:90px}.compare-face-badge{font-size:11px;padding:5px 9px;top:12px;right:12px}.compare-flow-card{padding:22px!important;border-radius:22px!important}.compare-flow-card h3{font-size:31px;margin-bottom:18px}.compare-flow-card p{font-size:17px;line-height:1.58;margin-bottom:18px}.compare-final-take{padding:17px 18px;margin-top:22px}.compare-final-take p{font-size:17px!important}}`;
    document.head.appendChild(style);
  }
  function install(){
    injectCss();
    setTimeout(render, 0);
    ['fighterA','fighterB'].forEach(id => { const sel = el(id); if(sel && !sel.dataset.compareNarrativeListener){ sel.dataset.compareNarrativeListener = 'true'; sel.addEventListener('change', () => setTimeout(render, 0)); } });
    document.querySelectorAll('.tab').forEach(tab => { if(!tab.dataset.compareNarrativeTabListener){ tab.dataset.compareNarrativeTabListener = 'true'; tab.addEventListener('click', () => setTimeout(render, 0)); } });
  }

  window.UFC_COMPARE_NARRATIVE_SYSTEM = {version:VERSION, render};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();