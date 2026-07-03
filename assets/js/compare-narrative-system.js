// Compare Narrative System - tight debate blocks + natural matchup voice.
(function(){
  const VERSION = 'compare-narrative-system-20260702k';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const CATEGORY_KEYS = [
    ['championship','title value',1.15],
    ['opponentQuality','quality wins',1.05],
    ['primeDominance','prime control',1.10],
    ['longevity','staying power',1.00],
    ['penalty','cleaner loss record',0.15]
  ];
  const FINAL_LABELS = ['Final take','Bottom line','The call'];

  const VOICE = {
    'Jon Jones': { title:'Jones is still the benchmark: too many title wins, too many elite names, and the Hamill DQ is not treated like a real competitive loss.', peak:'At his best, Jones solved different styles across multiple eras and rarely looked like the debate could touch him.', volume:'He has both the championship stack and the long-range track record.' },
    'Georges St-Pierre': { title:'GSP is the complete champion profile: long welterweight control, a middleweight cherry on top, and rematch answers that aged extremely well.', peak:'At his best, GSP was process dominance: jab, timing, wrestling, top control, and almost no wasted rounds.', volume:'The second act after Serra is why the résumé feels so clean.' },
    'Demetrious Johnson': { title:'Johnson set the flyweight standard with title control, repeated defenses, and a reign that defined the division.', peak:'At his best, Mighty Mouse was technical control with creativity, speed, transitions, and one of the cleanest skill sets in UFC history.', volume:'The division-strength question matters, but the skill and dominance are real.' },
    'Anderson Silva': { title:'Silva owns the historic middleweight reign: long title control, iconic finishes, and the kind of aura most champions never touch.', peak:'Peak Silva is the aura play. He made elite fighters look frozen, reckless, or completely out of ideas.', volume:'The Weidman losses matter, but the prime aura still carries major weight.' },
    'Islam Makhachev': { title:'Islam has built the larger lightweight title résumé: more championship work, more elite defenses, and a ledger that keeps getting heavier.', peak:'His best version is control with finishing threat: patient pressure, grappling danger, improved striking, and very few easy rounds for opponents.', volume:'Oliveira, Volkanovski, Poirier, Tsarukyan, and Hooker give him modern lightweight depth with real title weight.' },
    'Khabib Nurmagomedov': { title:'Khabib’s title run is shorter than the volume kings, but every title-level chapter felt clean and decisive.', peak:'Khabib compresses the debate into peak purity: no UFC losses, no collapse, and a final stretch where elite lightweights looked trapped.', volume:'RDA, Barboza, McGregor, Poirier, and Gaethje make the résumé compact but high quality.' },
    'Alexander Volkanovski': { title:'Volk’s featherweight run is clean: belt win, defenses, and direct separation from Holloway.', peak:'Volk’s best version was balance: footwork, adjustments, pace, defense, and the ability to win long tactical fights.', volume:'Aldo, Holloway three times, Ortega, Korean Zombie, and Yair give him one of the cleanest modern featherweight title runs.' },
    'Max Holloway': { title:'Holloway’s title work is strong, but his bigger weapon is how much high-level work he kept adding.', peak:'Peak Max was pace, boxing, durability, and pressure. He turned great fights into long, exhausting conversations.', volume:'Max drags the debate into deep water: Aldo twice, Ortega, Kattar, Yair, Korean Zombie, Gaethje, and more across a huge window.' },
    'Kamaru Usman': { title:'His welterweight reign felt locked in for years: title control, round-to-round authority, and a cleaner champion peak than overall volume.', peak:'At his best, Usman was pressure, wrestling threat, cardio, clinch control, and improving power — a champion who made fights feel physically expensive.', volume:'Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give him a strong modern welterweight ledger.' },
    'Jose Aldo': { title:'Aldo’s UFC-only title work is strong, but the full historical aura is bigger because the WEC reign sits outside the main count.', peak:'Peak Aldo was speed, takedown defense, leg kicks, composure, and champion presence.', volume:'His UFC chapter still has real staying power across featherweight and bantamweight.' },
    'Daniel Cormier': { title:'Cormier brings two-division value: light heavyweight gold, heavyweight gold, and a dense title-level run.', peak:'DC’s best version was pressure wrestling, clinch control, durability, and the ability to compete up at heavyweight.', volume:'The Jones rivalry caps the ceiling, but the two-division work is still serious.' },
    'Stipe Miocic': { title:'Stipe is the UFC heavyweight résumé play: title defenses, champion wins, and the Cormier trilogy comeback.', peak:'At his best, Stipe was heavyweight reliability: boxing, wrestling, cardio, toughness, and composure in chaos.', volume:'Ngannou, Cormier, Werdum, Overeem, dos Santos, Hunt, and Arlovski give him heavyweight depth.' },
    'Francis Ngannou': { title:'Ngannou’s title run is shorter, but the heavyweight danger was obvious every second he was near the belt.', peak:'Ngannou has the scarier best-version angle. One clean shot could erase the whole fight.', volume:'The résumé is not as long as Stipe’s, but the peak threat was terrifying.' },
    'Alex Pereira': { title:'Pereira is the fast-climb title play: two UFC belts, huge title moments, and immediate light heavyweight weight.', peak:'Pereira’s peak is consequence. Every exchange feels dangerous because one clean shot can rewrite the fight.', volume:'The title impact punches above the length of the run, but the sample is still shorter than the deepest all-time résumés.' },
    'Israel Adesanya': { title:'Adesanya brings middleweight title volume: repeated defenses, two Whittaker wins, and years as the division standard.', peak:'Peak Izzy was range control, feints, counters, and the ability to make elite strikers hesitate.', volume:'The Pereira rivalry complicates the aura, but the completed middleweight run remains strong.' },
    'Amanda Nunes': { title:'Nunes is the women’s title standard: two belts, repeated defenses, and the biggest collection of elite-name wins in women’s UFC history.', peak:'Peak Nunes was violence with layers: power, takedown defense, jiu-jitsu, confidence, and the ability to erase legends fast.', volume:'The Peña upset matters, but the revenge win keeps it from defining the whole résumé.' },
    'Valentina Shevchenko': { title:'Valentina brings the technical flyweight reign: repeated defenses, title control, and a later regain that keeps the story alive.', peak:'Peak Valentina was timing, balance, counters, clinch work, and five-round calm.', volume:'Nunes is the ceiling, but Valentina’s long technical excellence keeps the résumé elite.' }
  };

  const MATCHUP_FRAMES = {
    'kamaru usman|max holloway':'Better champion peak: Kamaru Usman. Better total résumé: Max Holloway, barely.',
    'islam makhachev|khabib nurmagomedov':'Cleaner peak: Khabib Nurmagomedov. Bigger title résumé: Islam Makhachev.',
    'alexander volkanovski|max holloway':'Longer volume résumé: Max Holloway. Shared-era featherweight answer: Alexander Volkanovski.',
    'francis ngannou|stipe miocic':'Scarier best version: Francis Ngannou. Bigger heavyweight résumé: Stipe Miocic.',
    'georges st-pierre|jon jones':'Cleanest challenger profile: Georges St-Pierre. Highest benchmark profile: Jon Jones.',
    'anderson silva|demetrious johnson':'Peak aura and finishing mythology: Anderson Silva. Cleaner title structure: Demetrious Johnson.',
    'dominick cruz|jose aldo':'Style and comeback angle: Dominick Cruz. Deeper UFC-only volume: Jose Aldo.',
    'daniel cormier|stipe miocic':'Two-division value: Daniel Cormier. Heavyweight trilogy and heavyweight résumé: Stipe Miocic.',
    'alex pereira|israel adesanya':'Explosive two-division impact: Alex Pereira. Longer middleweight reign: Israel Adesanya.',
    'amanda nunes|valentina shevchenko':'Technical flyweight standard: Valentina Shevchenko. Women’s two-division GOAT résumé: Amanda Nunes.'
  };

  const MATCHUP_SWINGS = {
    'kamaru usman|max holloway':'So if the question is better champion peak, it is probably Usman. If the question is better overall résumé, Holloway gets it by a thin margin.',
    'islam makhachev|khabib nurmagomedov':'So if the question is cleanest peak, Khabib still has the answer. If the question is the larger title résumé, Islam has passed him.',
    'alexander volkanovski|max holloway':'So if the question is long-term volume, Max has a real answer. If the question is shared-era featherweight separation, the trilogy makes Volk the pick.',
    'francis ngannou|stipe miocic':'The split series keeps this honest. Ngannou erased Stipe in the rematch, but Stipe still owns the broader heavyweight résumé.'
  };

  const MATCHUP_FINALS = {
    'kamaru usman|max holloway':'Max Holloway, barely. Usman wins the champion-peak debate, but Holloway’s quality-win depth and staying power give him the stronger full résumé.',
    'islam makhachev|khabib nurmagomedov':'Islam Makhachev, narrowly. Khabib owns the cleaner peak, but Islam’s title work and high-end lightweight wins give him the larger résumé.',
    'alexander volkanovski|max holloway':'Alexander Volkanovski wins. Max has the longer volume résumé, but Volk’s trilogy edge and championship separation make the shared-era answer cleaner.',
    'francis ngannou|stipe miocic':'Stipe Miocic wins. Ngannou has the scarier peak, but the split series pushes the call back to Stipe’s deeper heavyweight résumé.'
  };

  let rendering = false;
  function el(id){ return document.getElementById(id); }
  function safe(s){ return String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function cleanNum(n){ return Number.isFinite(Number(n)) ? Number(n) : 0; }
  function roundYear(n){ const val = Number(n); return Number.isFinite(val) ? String(Math.max(1, Math.round(val))) : null; }
  function normalizeKey(a,b){ return [String(a||'').toLowerCase(),String(b||'').toLowerCase()].sort().join('|'); }
  function hash(str){ let h=0; for(let i=0;i<String(str).length;i++){ h=((h<<5)-h)+String(str).charCodeAt(i); h|=0; } return Math.abs(h); }
  function pick(list,key){ return list[hash(key) % list.length]; }
  function pairKey(a,b,tag=''){ return `${normalizeKey(a.fighter,b.fighter)}|${tag}`; }
  function pronoun(f){ return (f.gender === 'women' || f.sex === 'women') ? 'she' : 'he'; }
  function capPronoun(f){ return pronoun(f) === 'she' ? 'She' : 'He'; }
  function voice(f,key){ return VOICE[f.fighter]?.[key] || null; }
  function frameFor(a,b){ return MATCHUP_FRAMES[normalizeKey(a.fighter,b.fighter)] || null; }
  function swingFor(a,b){ return MATCHUP_SWINGS[normalizeKey(a.fighter,b.fighter)] || null; }
  function finalFor(a,b){ return MATCHUP_FINALS[normalizeKey(a.fighter,b.fighter)] || null; }
  function hasOutsideContext(f){ return /WEC|PRIDE|Pride|Strikeforce|outside the main count/i.test([f.fighter, profileText(f), voice(f,'title'), voice(f,'volume')].filter(Boolean).join(' ')); }

  function full(name){ const boardRow = [...(DATA.men || []), ...(DATA.women || [])].find(f => f.fighter === name) || {fighter:name}; if(typeof window.fullRow === 'function') return window.fullRow(boardRow); const profile = (DATA.fighters || []).find(f => f.fighter === name) || {}; return {...profile, ...boardRow}; }
  function profileFor(name){ return (window.COMPARE_PROFILES && window.COMPARE_PROFILES[name]) || (window.DISPLAY_OVERRIDES && window.DISPLAY_OVERRIDES[name] && window.DISPLAY_OVERRIDES[name].compareProfile) || {}; }
  function rankFor(f){ return window.DISPLAY_OVERRIDES?.[f.fighter]?.allTimeRank || f.rank || '—'; }
  function ovrFor(f){ if(typeof window.overallOvr === 'function') return window.overallOvr(f); const all = [...(DATA.men || []), ...(DATA.women || [])]; const max = Math.max(...all.map(x => cleanNum(x.totalScore)), 1); return Math.max(60, Math.min(99, Math.round(75 + (cleanNum(f.totalScore) / max) * 24))); }
  function categoryOvrFor(f,key){ if(key === 'overall') return ovrFor(f); if(typeof window.categoryOvr === 'function') return window.categoryOvr(f,key); return Math.round(cleanNum(f[key])); }
  function categoryBase(f,key){ const raw = Number(f?.[key]); return Number.isFinite(raw) ? raw : categoryOvrFor(f,key); }
  function edge(f,other,key){ return categoryBase(f,key) - categoryBase(other,key); }
  function titleFightWins(f,p){ if(p.legacyStats?.titleFightWins !== undefined) return p.legacyStats.titleFightWins; const m = String(f.title?.notes || f.notes || '').match(/Total title fight wins = ([0-9.]+)/i); return m ? m[1].replace(/\.0$/,'') : null; }
  function eliteYears(f,p){ if(f.activeEliteYears !== undefined && f.activeEliteYears !== null) return roundYear(f.activeEliteYears); const m = String(p.legacyStats?.activeEliteYearsLabel || '').match(/([0-9]+(?:\.[0-9]+)?)/); return m ? roundYear(m[1]) : null; }
  function compactWins(f,p,count=7){ if(p.signatureWins) return p.signatureWins; const opps = Array.isArray(f.opponents) ? f.opponents : []; if(!opps.length) return null; const names = []; opps.slice().sort((a,b)=>cleanNum(b.credit)-cleanNum(a.credit)).forEach(o => { const n = String(o.opponent || '').replace(/\s+\d+$/,'').trim(); if(n && !names.includes(n)) names.push(n); }); return names.slice(0,count).join(', '); }
  function profileText(f){ const p = profileFor(f.fighter); return [p.shortCase,p.peak,p.resume,p.championship,p.opponentQuality,p.longevity,p.counter,p.edge,p.bestArgument,p.titleSummary,p.primeSummary,p.scope,f.primeEnd,f.notes].filter(Boolean).join(' ').toLowerCase(); }
  function isStillBuilding(f){ return /still building|case is still growing|keeps getting stronger|keeps gaining|growing title run|young but|ceiling is real|can change the answer|can keep closing|still adding chapters|active modern/i.test(profileText(f)); }
  function isUnbeatenCase(f){ return /unbeaten|perfect ufc record|no ufc losses|purity|cleanest peak|almost flawless|unbeatable/i.test(profileText(f)); }
  function edgeKeys(f, other){ const edges = CATEGORY_KEYS.map(([key,label,weight]) => { const rawDiff = edge(f,other,key); return {key,label,rawDiff,diff:rawDiff*weight}; }).filter(x => x.rawDiff > 0).sort((a,b)=>b.diff-a.diff); if(isUnbeatenCase(f)){ const ordered = []; ['primeDominance','penalty'].forEach(key => { const item = edges.find(x => x.key === key); if(item) ordered.push(item); }); edges.forEach(item => { if(!ordered.includes(item)) ordered.push(item); }); return ordered; } const nonPenalty = edges.filter(x => x.key !== 'penalty'); return nonPenalty.length ? nonPenalty.concat(edges.filter(x => x.key === 'penalty')) : edges; }
  function hasEdge(f,other,key){ return edge(f,other,key) > 0; }
  function bestEdges(f,other){ return edgeKeys(f,other).filter(x => x.key !== 'penalty').slice(0,2); }
  function lanesText(f,other){ const edges = bestEdges(f,other).map(x => x.label); if(!edges.length) return 'the narrowest lane'; if(edges.length === 1) return edges[0]; return `${edges[0]} and ${edges[1]}`; }
  function archetype(winner, loser, a, b){ const diff = Math.abs(ovrFor(a) - ovrFor(b)); const ledger = window.COMPARE_FIGHT_LEDGER?.[normalizeKey(a.fighter,b.fighter)] || null; if(ledger) return {type:'rivalry', ledger}; if(diff <= 1) return {type:'razor'}; if(diff <= 4) return {type:'close'}; if(isStillBuilding(loser)) return {type:'activeCeiling'}; if(edgeKeys(loser,winner).some(x => x.key === 'primeDominance')) return {type:'peakVsResume'}; if(diff >= 9) return {type:'tierGap'}; return {type:'clear'}; }

  function verdictLine(winner, loser, type, a, b){
    const splitLedger = window.COMPARE_FIGHT_LEDGER?.[normalizeKey(a.fighter,b.fighter)]?.winner === 'split';
    const variants = {
      razor:[`${winner.fighter} wins by a hair, but ${loser.fighter} makes it uncomfortable.`,`${winner.fighter} edges it, but this is a real split-the-room debate.`],
      close:[`${winner.fighter} wins, but ${loser.fighter} has a serious answer.`,`${winner.fighter} gets the nod, while ${loser.fighter} still has a real lane.`],
      rivalry: splitLedger ? [`${winner.fighter} gets the edge, but the direct series is split.`] : [`${winner.fighter} wins, and the direct history helps explain why.`,`${winner.fighter} gets the edge, and this one comes with real direct-fight history.`],
      activeCeiling:[`${winner.fighter} has the finished résumé; ${loser.fighter} has the still-building threat.`,`${winner.fighter} wins for now, but ${loser.fighter}'s ceiling is the interesting part.`],
      peakVsResume:[`${winner.fighter} has the fuller résumé, but ${loser.fighter} has a real peak angle.`,`${winner.fighter} wins the total résumé debate; ${loser.fighter} can still make the peak side uncomfortable.`],
      tierGap:[`${winner.fighter} wins this comparison clearly.`,`${loser.fighter} has pieces of an answer, but ${winner.fighter} owns the comparison overall.`],
      clear:[`${winner.fighter} wins the comparison, but ${loser.fighter} has a real lane.`,`${winner.fighter} has the stronger read, but the other side is still worth laying out.`]
    };
    return pick(variants[type] || variants.clear, pairKey(a,b,`verdict-${type}`));
  }

  function laneLead(f, other, role){
    const fTitlePrime = hasEdge(f,other,'championship') && hasEdge(f,other,'primeDominance');
    const fVolume = hasEdge(f,other,'opponentQuality') || hasEdge(f,other,'longevity');
    if(isUnbeatenCase(f)) return `${f.fighter} compresses this into peak purity.`;
    if(fTitlePrime) return role === 'winner' ? `${f.fighter} turns this into a champion-peak debate.` : `${f.fighter} makes this a champion-peak debate.`;
    if(fVolume) return role === 'winner' ? `${f.fighter} wins the long-view side.` : `${f.fighter} drags this toward volume and longevity.`;
    if(hasEdge(f,other,'championship')) return `${f.fighter} starts with the title column.`;
    if(hasEdge(f,other,'primeDominance')) return `${f.fighter} starts with the better best-version angle.`;
    return role === 'winner' ? `${f.fighter} has the slightly fuller read.` : `${f.fighter} has a real lane, but it is narrower.`;
  }

  function statLines(f, other, role){
    const p = profileFor(f.fighter); const otherP = profileFor(other.fighter); const lines = [];
    const tfw = titleFightWins(f,p); const otherTfw = titleFightWins(other,otherP); const years = eliteYears(f,p); const wins = compactWins(f,p,7);
    if(hasEdge(f,other,'championship') && tfw !== null){ lines.push(otherTfw !== null ? `${capPronoun(f)} has ${tfw} title-fight wins to ${other.fighter}'s ${otherTfw}.` : `${capPronoun(f)} has ${tfw} title-fight wins.`); }
    else if(role === 'loser' && tfw !== null && otherTfw !== null && Number(tfw) > 0){ lines.push(`${f.fighter}'s ${tfw} title-fight wins keep this credible, but belt volume is not where ${pronoun(f)} wins it.`); }
    if(hasEdge(f,other,'longevity') && years){ lines.push(`About ${years} active elite years gives ${f.fighter} more time at the top.`); }
    else if(role === 'loser' && hasEdge(other,f,'longevity')){ lines.push(`The problem is that ${other.fighter} owns the longer top-level window.`); }
    if(hasEdge(f,other,'opponentQuality') && wins && !voice(f,'volume')){ lines.push(`${wins} give ${f.fighter} the deeper win list.`); }
    return lines;
  }

  function voiceLine(f, other){
    const edges = bestEdges(f,other).map(x => x.key);
    if((edges.includes('opponentQuality') || edges.includes('longevity')) && voice(f,'volume')) return voice(f,'volume');
    if(edges.includes('championship') && voice(f,'title')) return voice(f,'title');
    if(edges.includes('primeDominance') && voice(f,'peak')) return voice(f,'peak');
    return voice(f,'volume') || voice(f,'title') || voice(f,'peak') || null;
  }
  function debateParagraph(f, other, role, type){ const parts = [laneLead(f,other,role), ...statLines(f,other,role)]; const flavor = voiceLine(f,other); if(flavor) parts.push(flavor); return parts.filter(Boolean).join(' '); }
  function ledgerWinnerMatches(ledger, fighter){ return String(ledger?.winner || '').toLowerCase() === String(fighter?.fighter || fighter || '').toLowerCase(); }

  function swingParagraph(winner, loser, type, ledger, a, b){
    const special = swingFor(a,b); if(special) return special;
    if(type === 'rivalry' && ledger){
      if(ledgerWinnerMatches(ledger,winner)) return `${ledger.summary} The fight history is not the whole story, but here it points the same direction as the résumé.`;
      if(ledgerWinnerMatches(ledger,loser)) return `${ledger.summary} That result matters, but it does not end the debate. ${winner.fighter} still has the broader résumé.`;
      if(String(ledger?.winner || '').toLowerCase() === 'split') return `${ledger.summary} The series is split, so the tiebreaker is the broader résumé.`;
      return `${ledger.summary} The direct history adds context, but the wider résumé is the separator.`;
    }
    if(type === 'activeCeiling') return `${loser.fighter} may eventually change this. Right now, this is finished work over a still-building résumé.`;
    if(type === 'peakVsResume') return `${loser.fighter} can win the peak conversation. ${winner.fighter} still has more total value banked.`;
    if(type === 'razor' || type === 'close') return `That is the difference. ${loser.fighter} wins real parts of the debate, but ${winner.fighter} has slightly more value banked.`;
    if(type === 'tierGap') return `${loser.fighter}'s best points matter, but they do not cover enough ground. ${winner.fighter} controls too much of the picture.`;
    return `${loser.fighter} has a real answer. ${winner.fighter} still has more ways to win the full debate.`;
  }

  function distinctionParagraph(winner, loser){
    const loserEdges = new Set(edgeKeys(loser,winner).map(x => x.key));
    const scope = hasOutsideContext(winner) || hasOutsideContext(loser) ? 'UFC-only résumé' : 'résumé';
    if(loserEdges.has('championship') && loserEdges.has('primeDominance')) return `Better champion peak: ${loser.fighter}. Better overall ${scope}: ${winner.fighter}.`;
    if(isUnbeatenCase(loser) || loserEdges.has('primeDominance')) return `Better peak: ${loser.fighter}. Better overall ${scope}: ${winner.fighter}.`;
    if(loserEdges.has('opponentQuality') || loserEdges.has('longevity')) return `Better depth angle: ${loser.fighter}. Better overall ${scope}: ${winner.fighter}.`;
    return `This is not the same as asking who would win head-to-head. The better all-time read belongs to ${winner.fighter}.`;
  }

  function finalTake(winner, loser, type, a, b, ledger){
    const specialFinal = finalFor(a,b); if(specialFinal) return specialFinal;
    const lanes = lanesText(winner, loser);
    const scope = hasOutsideContext(winner) || hasOutsideContext(loser) ? 'UFC-only résumé' : 'résumé';
    if(type === 'rivalry' && ledger){ if(ledgerWinnerMatches(ledger,winner)) return `${winner.fighter} wins. The direct fight history helps, and the broader ${lanes} read backs it up.`; if(ledgerWinnerMatches(ledger,loser)) return `${winner.fighter} wins the overall comparison, even though ${loser.fighter} owns the direct result.`; if(String(ledger?.winner || '').toLowerCase() === 'split') return `${winner.fighter} wins. The direct series is split, so the call comes down to the broader ${scope}.`; }
    if(type === 'razor') return `${winner.fighter} is the pick by a thin margin. ${loser.fighter} wins real parts of the debate, but ${winner.fighter}'s ${lanes} is just enough.`;
    if(type === 'close') return `${winner.fighter} gets the nod. ${loser.fighter} has a credible lane, but ${winner.fighter}'s ${lanes} carries the full debate.`;
    if(type === 'activeCeiling') return `${winner.fighter} wins today. ${loser.fighter} can keep closing the gap, but this is still finished work over a still-building résumé.`;
    if(type === 'tierGap') return `${winner.fighter} wins clearly. ${loser.fighter}'s best points matter, but not enough to close the overall gap.`;
    return `${winner.fighter} wins. ${loser.fighter} has a real answer, but ${winner.fighter}'s résumé is stronger.`;
  }
  function finalLabel(a,b){ return pick(FINAL_LABELS, pairKey(a,b,'final-label')); }
  function faceCard(f){ const rank = rankFor(f); const div = [f.primaryDivision, f.secondaryDivision].filter(Boolean).join(' / '); return `<article class="compare-face-card"><div><h3>${safe(f.fighter)}</h3><p>${safe(f.ufcRecord || '')}${div ? ` · ${safe(div)}` : ''}</p></div><span class="compare-face-badge">#${safe(rank)} · ${safe(ovrFor(f))} OVR</span></article>`; }

  function render(){
    if(rendering) return;
    const result = el('compareResult'); const selectA = el('fighterA'); const selectB = el('fighterB');
    if(!result || !selectA || !selectB || !selectA.value || !selectB.value) return;
    const a = full(selectA.value); const b = full(selectB.value);
    const aScore = cleanNum(a.totalScore) || ovrFor(a); const bScore = cleanNum(b.totalScore) || ovrFor(b);
    const winner = aScore >= bScore ? a : b; const loser = winner.fighter === a.fighter ? b : a;
    const typeInfo = archetype(winner, loser, a, b); const type = typeInfo.type; const frame = frameFor(a,b);
    const paragraphs = [frame, debateParagraph(loser,winner,'loser',type), debateParagraph(winner,loser,'winner',type), swingParagraph(winner,loser,type,typeInfo.ledger,a,b), frame ? null : distinctionParagraph(winner,loser)].filter(Boolean);
    rendering = true;
    result.classList.add('compare-article-mode');
    result.dataset.compareNarrativeRendered = VERSION;
    result.innerHTML = `${faceCard(a)}${faceCard(b)}<article class="card compare-flow-card"><h3>${safe(verdictLine(winner, loser, type, a, b))}</h3>${paragraphs.map((p,i) => `<p${i===0 && frame ? ' class="compare-debate-frame"' : ''}>${safe(p)}</p>`).join('')}<div class="compare-final-take"><p><strong>${safe(finalLabel(a,b))}:</strong> ${safe(finalTake(winner, loser, type, a, b, typeInfo.ledger))}</p></div></article>`;
    rendering = false;
  }

  function injectCss(){
    const existing = document.getElementById('compare-narrative-css'); if(existing) existing.remove();
    const style = document.createElement('style'); style.id = 'compare-narrative-css';
    style.textContent = `#compareResult.compare-article-mode{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.compare-face-card{position:relative;min-height:104px!important;padding:15px 16px!important;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,#23324a,#172033);box-shadow:0 13px 32px rgba(15,23,42,.16);display:flex;align-items:flex-end;justify-content:space-between;gap:12px;color:#f8faff;overflow:hidden}.compare-face-card h3{margin:0;font-size:clamp(22px,4vw,31px);line-height:1.02;color:#f8faff!important;letter-spacing:-.03em}.compare-face-card p{margin:8px 0 0;color:#c7d2e2!important;font-size:15px;line-height:1.25}.compare-face-badge{position:absolute;top:14px;right:14px;border:1px solid rgba(250,204,21,.48);background:rgba(250,204,21,.08);color:#fde68a;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:950;letter-spacing:.04em;white-space:nowrap}.compare-flow-card{grid-column:1/-1;background:linear-gradient(180deg,#23324a,#172033)!important;border-color:#40536f!important;color:#f8faff!important;padding:26px!important;border-radius:24px!important;box-shadow:0 13px 32px rgba(15,23,42,.16)}.compare-flow-card h3{margin:0 0 18px;font-size:clamp(30px,5vw,45px);line-height:1.05;letter-spacing:-.04em;color:#f8faff!important}.compare-flow-card p{margin:0 0 18px;color:#c7d2e2!important;line-height:1.55;font-size:18px}.compare-flow-card p.compare-debate-frame{border-left:5px solid #facc15;background:rgba(250,204,21,.08);border-radius:16px;padding:14px 16px;color:#f8faff!important;font-weight:750}.compare-flow-card p:last-child{margin-bottom:0}.compare-final-take{margin-top:24px;border:1px solid rgba(250,204,21,.42);border-left:7px solid #facc15;border-radius:20px;padding:18px 20px;background:rgba(34,40,42,.82);box-shadow:0 13px 32px rgba(15,23,42,.14)}.compare-final-take p{margin:0!important;color:#f8faff!important;font-size:18px;line-height:1.55}.compare-final-take strong{color:#facc15!important}@media(max-width:900px){#compareResult.compare-article-mode{grid-template-columns:1fr;gap:10px}.compare-face-card{min-height:88px!important;padding:14px!important;border-radius:18px}.compare-face-card h3{font-size:25px}.compare-face-card p{font-size:14px;padding-right:90px}.compare-face-badge{font-size:11px;padding:5px 9px;top:12px;right:12px}.compare-flow-card{padding:22px!important;border-radius:22px!important}.compare-flow-card h3{font-size:31px;margin-bottom:18px}.compare-flow-card p{font-size:17px;line-height:1.56;margin-bottom:18px}.compare-final-take{padding:17px 18px;margin-top:22px}.compare-final-take p{font-size:17px!important}}`;
    document.head.appendChild(style);
  }

  function install(){
    injectCss(); setTimeout(render,0);
    ['fighterA','fighterB'].forEach(id => { const sel = el(id); if(sel && !sel.dataset.compareNarrativeListener){ sel.dataset.compareNarrativeListener = 'true'; sel.addEventListener('change', () => setTimeout(render,0)); } });
    document.querySelectorAll('.tab').forEach(tab => { if(!tab.dataset.compareNarrativeTabListener){ tab.dataset.compareNarrativeTabListener = 'true'; tab.addEventListener('click', () => setTimeout(render,0)); } });
  }

  window.UFC_COMPARE_NARRATIVE_SYSTEM = {version:VERSION, render};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();