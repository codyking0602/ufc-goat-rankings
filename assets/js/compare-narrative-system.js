// Compare Narrative System
// Engine-only layer: stats decide matchup lanes; fighter packets provide seasoning; matchup frames live in compare-matchups.js.
(function(){
  const VERSION = 'compare-narrative-system-20260703c-tight-composer';
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
  let rendering = false;

  function el(id){ return document.getElementById(id); }
  function safe(s){ return String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function cleanText(s){
    const accentResume = new RegExp('r\\u00e9sum\\u00e9','g');
    const accentResumes = new RegExp('r\\u00e9sum\\u00e9s','g');
    const accentResumeCap = new RegExp('R\\u00e9sum\\u00e9','g');
    const accentResumesCap = new RegExp('R\\u00e9sum\\u00e9s','g');
    return String(s || '')
      .replace(accentResumes,'resumes').replace(accentResume,'resume').replace(accentResumesCap,'Resumes').replace(accentResumeCap,'Resume')
      .replace(/title column/gi,'title resume')
      .replace(/opponent-volume cases/gi,'win-depth resumes')
      .replace(/opponent-volume case/gi,'win-depth resume')
      .replace(/better best-version angle/gi,'best-version argument')
      .replace(/folded back into the bigger picture/gi,'weighed against the full resume')
      .replace(/bigger picture/gi,'full resume')
      .replace(/\s+/g,' ')
      .trim();
  }
  function cleanNum(n){ return Number.isFinite(Number(n)) ? Number(n) : 0; }
  function roundYear(n){ const val = Number(n); return Number.isFinite(val) ? String(Math.max(1, Math.round(val))) : null; }
  function normalizeKey(a,b){ return [String(a||'').toLowerCase(),String(b||'').toLowerCase()].sort().join('|'); }
  function hash(str){ let h=0; for(let i=0;i<String(str).length;i++){ h=((h<<5)-h)+String(str).charCodeAt(i); h|=0; } return Math.abs(h); }
  function pick(list,key){ return list[hash(key) % list.length]; }
  function pairKey(a,b,tag=''){ return `${normalizeKey(a.fighter,b.fighter)}|${tag}`; }
  function pronoun(f){ return (String(f.gender || f.sex || '').toLowerCase() === 'women') ? 'she' : 'he'; }
  function capPronoun(f){ return pronoun(f) === 'she' ? 'She' : 'He'; }

  function compactParagraph(parts, maxSentences=3, maxChars=560){
    const text = cleanText(parts.filter(Boolean).join(' '));
    if(!text) return '';
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const kept = [];
    for(const raw of sentences){
      const sentence = cleanText(raw);
      if(!sentence) continue;
      const next = cleanText([...kept, sentence].join(' '));
      if(kept.length && (kept.length >= maxSentences || next.length > maxChars)) break;
      kept.push(sentence);
      if(kept.length >= maxSentences) break;
    }
    return cleanText(kept.join(' '));
  }

  function matchup(){ return window.UFC_COMPARE_MATCHUPS || {}; }
  function frameFor(a,b){ return matchup().frameFor ? matchup().frameFor(a.fighter,b.fighter) : null; }
  function swingFor(a,b){ return matchup().swingFor ? matchup().swingFor(a.fighter,b.fighter) : null; }
  function finalFor(a,b){ return matchup().finalFor ? matchup().finalFor(a.fighter,b.fighter) : null; }
  function verdictFor(a,b){ return matchup().verdictFor ? matchup().verdictFor(a.fighter,b.fighter) : null; }

  function full(name){
    const boardRow = [...(DATA.men || []), ...(DATA.women || [])].find(f => f.fighter === name) || {fighter:name};
    if(typeof window.fullRow === 'function') return window.fullRow(boardRow);
    const profile = (DATA.fighters || []).find(f => f.fighter === name) || {};
    return {...profile, ...boardRow};
  }
  function profileFor(name){
    return (window.COMPARE_PROFILES && window.COMPARE_PROFILES[name])
      || (window.DISPLAY_OVERRIDES && window.DISPLAY_OVERRIDES[name] && window.DISPLAY_OVERRIDES[name].compareProfile)
      || {};
  }
  function packetFor(name){ return window.UFC_FIGHTER_PACKETS?.[name] || {}; }
  function rankFor(f){ return window.DISPLAY_OVERRIDES?.[f.fighter]?.allTimeRank || f.rank || '—'; }
  function ovrFor(f){
    if(typeof window.overallOvr === 'function') return window.overallOvr(f);
    const all = [...(DATA.men || []), ...(DATA.women || [])];
    const max = Math.max(...all.map(x => cleanNum(x.totalScore)), 1);
    return Math.max(60, Math.min(99, Math.round(75 + (cleanNum(f.totalScore) / max) * 24)));
  }
  function categoryOvrFor(f,key){
    if(key === 'overall') return ovrFor(f);
    if(typeof window.categoryOvr === 'function') return window.categoryOvr(f,key);
    return Math.round(cleanNum(f[key]));
  }
  function categoryBase(f,key){ const raw = Number(f?.[key]); return Number.isFinite(raw) ? raw : categoryOvrFor(f,key); }
  function edge(f,other,key){ return categoryBase(f,key) - categoryBase(other,key); }
  function hasEdge(f,other,key){ return edge(f,other,key) > 0; }

  function titleFightWins(f,p){
    if(p.legacyStats?.titleFightWins !== undefined) return p.legacyStats.titleFightWins;
    if(packetFor(f.fighter)?.profileStats?.titleFightWins !== undefined) return packetFor(f.fighter).profileStats.titleFightWins;
    const m = String(f.title?.notes || f.notes || '').match(/Total title fight wins = ([0-9.]+)/i);
    return m ? m[1].replace(/\.0$/,'') : null;
  }
  function eliteYears(f,p){
    if(packetFor(f.fighter)?.profileStats?.activeEliteYears !== undefined) return roundYear(packetFor(f.fighter).profileStats.activeEliteYears);
    if(f.activeEliteYears !== undefined && f.activeEliteYears !== null) return roundYear(f.activeEliteYears);
    const m = String(p.legacyStats?.activeEliteYearsLabel || '').match(/([0-9]+(?:\.[0-9]+)?)/);
    return m ? roundYear(m[1]) : null;
  }
  function compactWins(f,p,count=7){
    if(p.signatureWins) return cleanText(p.signatureWins);
    const opps = Array.isArray(f.opponents) ? f.opponents : [];
    if(!opps.length) return null;
    const names = [];
    opps.slice().sort((a,b)=>cleanNum(b.credit)-cleanNum(a.credit)).forEach(o => {
      const n = String(o.opponent || '').replace(/\s+\d+$/,'').trim();
      if(n && !names.includes(n)) names.push(n);
    });
    return names.slice(0,count).join(', ');
  }
  function profileText(f){
    const p = profileFor(f.fighter);
    const packet = packetFor(f.fighter);
    return cleanText([
      p.shortCase,p.peak,p.resume,p.championship,p.opponentQuality,p.longevity,p.counter,p.edge,p.bestArgument,p.titleSummary,p.primeSummary,p.scope,p.primeStyle,p.titleStyle,p.weakness,
      packet.status?.stage, packet.profileStats?.lossContext, f.primeEnd, f.notes
    ].filter(Boolean).join(' ')).toLowerCase();
  }
  function isStillBuilding(f){ return /still building|keeps getting stronger|keeps gaining|growing title run|young but|ceiling is real|can change|can keep closing|still adding|active modern|run is not closed|still strengthening|fast-rising/i.test(profileText(f)); }
  function isUnbeatenCase(f){ return /unbeaten|perfect ufc record|no ufc losses|purity|cleanest peak|almost flawless|unbeatable|no true competitive/i.test(profileText(f)); }
  function hasOutsideContext(f){ return /wec|pride|strikeforce|outside the main count|non-ufc/i.test(profileText(f)); }

  function edgeKeys(f, other){
    const edges = CATEGORY_KEYS.map(([key,label,weight]) => {
      const rawDiff = edge(f,other,key);
      return {key,label,rawDiff,diff:rawDiff*weight};
    }).filter(x => x.rawDiff > 0).sort((a,b)=>b.diff-a.diff);
    if(isUnbeatenCase(f)){
      const ordered = [];
      ['primeDominance','penalty'].forEach(key => { const item = edges.find(x => x.key === key); if(item) ordered.push(item); });
      edges.forEach(item => { if(!ordered.includes(item)) ordered.push(item); });
      return ordered;
    }
    const nonPenalty = edges.filter(x => x.key !== 'penalty');
    return nonPenalty.length ? nonPenalty.concat(edges.filter(x => x.key === 'penalty')) : edges;
  }
  function bestEdges(f,other){ return edgeKeys(f,other).filter(x => x.key !== 'penalty').slice(0,2); }
  function primaryLane(f,other){ return bestEdges(f,other)[0]?.key || null; }
  function lanesText(f,other){
    const edges = bestEdges(f,other).map(x => x.label);
    if(!edges.length) return 'the narrowest lane';
    if(edges.length === 1) return edges[0];
    return `${edges[0]} and ${edges[1]}`;
  }

  function archetype(winner, loser, a, b){
    const diff = Math.abs(ovrFor(a) - ovrFor(b));
    const ledger = window.COMPARE_FIGHT_LEDGER?.[normalizeKey(a.fighter,b.fighter)] || null;
    if(ledger) return {type:'rivalry', ledger};
    if(diff <= 1) return {type:'razor'};
    if(diff <= 4) return {type:'close'};
    if(isStillBuilding(loser)) return {type:'activeCeiling'};
    if(edgeKeys(loser,winner).some(x => x.key === 'primeDominance')) return {type:'peakVsResume'};
    if(diff >= 9) return {type:'tierGap'};
    return {type:'clear'};
  }

  function verdictLine(winner, loser, type, a, b){
    const special = verdictFor(a,b);
    if(special) return special;
    const ledger = window.COMPARE_FIGHT_LEDGER?.[normalizeKey(a.fighter,b.fighter)] || null;
    const splitLedger = /split/i.test(String(ledger?.winner || ledger?.summary || ''));
    const variants = {
      razor:[`${winner.fighter} wins by a hair, but ${loser.fighter} makes it uncomfortable.`,`${winner.fighter} edges it, but this is a real split-the-room debate.`],
      close:[`${winner.fighter} wins, but ${loser.fighter} has a serious answer.`,`${winner.fighter} gets the nod, while ${loser.fighter} still has a real lane.`],
      rivalry: splitLedger ? [`${winner.fighter} gets the edge, but the direct series is split.`] : [`${winner.fighter} wins, and the direct history helps explain why.`,`${winner.fighter} gets the edge, and this one comes with real direct-fight history.`],
      activeCeiling:[`${winner.fighter} has the finished resume; ${loser.fighter} has the still-building threat.`,`${winner.fighter} wins for now, but ${loser.fighter}'s ceiling is the interesting part.`],
      peakVsResume:[`${winner.fighter} has the fuller resume, but ${loser.fighter} has a real peak angle.`,`${winner.fighter} wins the total resume debate; ${loser.fighter} can still make the peak side uncomfortable.`],
      tierGap:[`${winner.fighter} wins this comparison clearly.`,`${loser.fighter} has pieces of an answer, but ${winner.fighter} owns the comparison overall.`],
      clear:[`${winner.fighter} wins the comparison, but ${loser.fighter} has a real lane.`,`${winner.fighter} has the stronger read, but the other side is still worth laying out.`]
    };
    return pick(variants[type] || variants.clear, pairKey(a,b,`verdict-${type}`));
  }

  function laneLead(f, other, role){
    const lane = primaryLane(f,other);
    if(role === 'loser'){
      if(isUnbeatenCase(f)) return `${f.fighter} keeps this uncomfortable through peak purity.`;
      if(lane === 'championship') return `${f.fighter} keeps this close through championship value.`;
      if(lane === 'opponentQuality') return `${f.fighter} keeps this close through win depth.`;
      if(lane === 'longevity') return `${f.fighter} keeps this close through longevity.`;
      if(lane === 'primeDominance') return f.fighter === 'Francis Ngannou' ? `${f.fighter} keeps this close through the scarier best-version argument.` : `${f.fighter} keeps this close through the best-version argument.`;
      return `${f.fighter} has a real lane, but it is narrower.`;
    }
    if(isUnbeatenCase(f)) return `${f.fighter} compresses this into peak purity.`;
    if(lane === 'championship') return `${f.fighter} wins through the bigger title resume.`;
    if(lane === 'opponentQuality') return `${f.fighter} wins through the deeper win list.`;
    if(lane === 'longevity') return `${f.fighter} wins the long-view side.`;
    if(lane === 'primeDominance') return `${f.fighter} starts with the better best-version argument.`;
    return `${f.fighter} has the slightly fuller read.`;
  }

  function primaryStatLine(f, other, role, lane){
    const p = profileFor(f.fighter);
    const otherP = profileFor(other.fighter);
    const tfw = titleFightWins(f,p);
    const otherTfw = titleFightWins(other,otherP);
    const years = eliteYears(f,p);
    const wins = compactWins(f,p,7);
    if(lane === 'championship' && tfw !== null){
      return otherTfw !== null ? `${capPronoun(f)} has ${tfw} title-fight wins to ${other.fighter}'s ${otherTfw}.` : `${capPronoun(f)} has ${tfw} title-fight wins.`;
    }
    if(lane === 'longevity' && years){
      return `About ${years} active elite years gives ${f.fighter} more time at the top.`;
    }
    if(lane === 'opponentQuality' && wins){
      return wins;
    }
    if(lane === 'primeDominance'){
      return cleanText(p.primeSummary || p.peak || p.bestArgument || '');
    }
    if(role === 'loser' && hasEdge(other,f,'championship') && tfw !== null && otherTfw !== null && Number(tfw) > 0){
      return `${f.fighter}'s ${tfw} title-fight wins keep this credible, but belt volume is not where ${pronoun(f)} wins it.`;
    }
    return '';
  }

  function seasoningLine(f, other, role, lane){
    const p = profileFor(f.fighter);
    const candidates = [];
    if(role === 'loser'){
      if(lane === 'primeDominance') candidates.push(p.bestArgument, p.peak, p.primeSummary);
      if(lane === 'championship') candidates.push(p.titleSummary, p.championship);
      if(lane === 'opponentQuality') candidates.push(p.opponentQuality, p.resume);
      if(lane === 'longevity') candidates.push(p.longevity, p.resume);
      candidates.push(p.weakness);
    } else {
      if(lane === 'championship') candidates.push(p.titleSummary, p.championship);
      if(lane === 'opponentQuality') candidates.push(p.signatureWins, p.opponentQuality);
      if(lane === 'longevity') candidates.push(p.longevity, p.resume);
      if(lane === 'primeDominance') candidates.push(p.bestArgument, p.peak, p.primeSummary);
      candidates.push(p.edge, p.resume, p.shortCase);
    }
    return cleanText(candidates.find(Boolean) || '');
  }

  function activeLine(f, role){
    if(role !== 'winner' || !isStillBuilding(f)) return null;
    return `${f.fighter}'s resume is not closed yet, so this gap can still stretch if more title-level wins follow.`;
  }
  function winnerCloseLine(f, type){
    if(type === 'rivalry') return `That is why ${f.fighter} still gets the nod once the full resume is weighed.`;
    if(isStillBuilding(f)) return null;
    return `That is why ${f.fighter} still gets the nod.`;
  }

  function debateParagraph(f, other, role, type){
    const lane = primaryLane(f,other);
    const parts = [laneLead(f,other,role)];
    const stat = primaryStatLine(f,other,role,lane);
    if(stat) parts.push(stat);
    const flavor = seasoningLine(f,other,role,lane);
    if(flavor && cleanText(flavor) !== cleanText(stat)) parts.push(flavor);
    const active = activeLine(f,role);
    if(active) parts.push(active);
    if(role === 'winner') parts.push(winnerCloseLine(f,type));
    return compactParagraph(parts, 3, role === 'winner' ? 560 : 520);
  }

  function ledgerWinnerMatches(ledger, fighter){ return String(ledger?.winner || '').toLowerCase() === String(fighter?.fighter || fighter || '').toLowerCase(); }
  function swingParagraph(winner, loser, type, ledger, a, b){
    const special = swingFor(a,b);
    if(special) return cleanText(special);
    if(type === 'rivalry' && ledger){
      if(ledgerWinnerMatches(ledger,winner)) return `${ledger.summary} The fight history is not the whole story, but here it points the same direction as the resume.`;
      if(ledgerWinnerMatches(ledger,loser)) return `${ledger.summary} That result matters, but it does not end the debate. ${winner.fighter} still has the broader resume.`;
      if(String(ledger?.winner || '').toLowerCase() === 'split') return `${ledger.summary} The series is split, so the tiebreaker is the broader resume.`;
      return `${ledger.summary} The direct history adds context, but the wider resume is the separator.`;
    }
    if(type === 'activeCeiling') return `${loser.fighter} may eventually change this. Right now, this is finished work over a still-building resume.`;
    if(type === 'peakVsResume') return `${loser.fighter} can win the peak conversation. ${winner.fighter} still has more total value banked.`;
    if(type === 'razor' || type === 'close') return `That is the difference. ${loser.fighter} wins real parts of the debate, but ${winner.fighter} has slightly more value banked.`;
    if(type === 'tierGap') return `${loser.fighter}'s best points matter, but they do not cover enough ground. ${winner.fighter} controls too much of the picture.`;
    return `${loser.fighter} has a real answer. ${winner.fighter} still has more ways to win the full debate.`;
  }

  function distinctionParagraph(winner, loser){
    const loserEdges = new Set(edgeKeys(loser,winner).map(x => x.key));
    const scope = hasOutsideContext(winner) || hasOutsideContext(loser) ? 'UFC-only resume' : 'resume';
    if(loserEdges.has('championship') && loserEdges.has('primeDominance')) return `Better champion peak: ${loser.fighter}. Better overall ${scope}: ${winner.fighter}.`;
    if(isUnbeatenCase(loser) || loserEdges.has('primeDominance')) return `Better peak: ${loser.fighter}. Better overall ${scope}: ${winner.fighter}.`;
    if(loserEdges.has('opponentQuality') || loserEdges.has('longevity')) return `Better depth angle: ${loser.fighter}. Better overall ${scope}: ${winner.fighter}.`;
    return `This is not the same as asking who would win head-to-head. The better all-time read belongs to ${winner.fighter}.`;
  }

  function finalTake(winner, loser, type, a, b, ledger){
    const specialFinal = finalFor(a,b);
    if(specialFinal) return cleanText(specialFinal);
    const lanes = lanesText(winner, loser);
    const scope = hasOutsideContext(winner) || hasOutsideContext(loser) ? 'UFC-only resume' : 'resume';
    if(type === 'rivalry' && ledger){
      if(ledgerWinnerMatches(ledger,winner)) return `${winner.fighter} wins. The direct fight history helps, and the broader ${lanes} read backs it up.`;
      if(ledgerWinnerMatches(ledger,loser)) return `${winner.fighter} wins the overall comparison, even though ${loser.fighter} owns the direct result.`;
      if(String(ledger?.winner || '').toLowerCase() === 'split') return `${winner.fighter} wins. The direct series is split, so the call comes down to the broader ${scope}.`;
    }
    if(type === 'razor') return `${winner.fighter} is the pick by a thin margin. ${loser.fighter} wins real parts of the debate, but ${winner.fighter}'s ${lanes} is just enough.`;
    if(type === 'close') return `${winner.fighter} gets the nod. ${loser.fighter} has a credible lane, but ${winner.fighter}'s ${lanes} carries the full debate.`;
    if(type === 'activeCeiling') return `${winner.fighter} wins today. ${loser.fighter} can keep closing the gap, but this is still finished work over a still-building resume.`;
    if(type === 'tierGap') return `${winner.fighter} wins clearly. ${loser.fighter}'s best points matter, but not enough to close the overall gap.`;
    return `${winner.fighter} wins. ${loser.fighter} has a real answer, but ${winner.fighter}'s resume is stronger.`;
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
    const frame = frameFor(a,b);
    const paragraphs = [
      frame,
      debateParagraph(loser,winner,'loser',type),
      debateParagraph(winner,loser,'winner',type),
      swingParagraph(winner,loser,type,typeInfo.ledger,a,b),
      frame ? null : distinctionParagraph(winner,loser)
    ].filter(Boolean).map(cleanText);

    rendering = true;
    result.classList.add('compare-article-mode');
    result.dataset.compareNarrativeRendered = VERSION;
    result.innerHTML = `${faceCard(a)}${faceCard(b)}<article class="card compare-flow-card"><h3>${safe(cleanText(verdictLine(winner, loser, type, a, b)))}</h3>${paragraphs.map((p,i) => `<p${i===0 && frame ? ' class="compare-debate-frame"' : ''}>${safe(p)}</p>`).join('')}<div class="compare-final-take"><p><strong>${safe(finalLabel(a,b))}:</strong> ${safe(cleanText(finalTake(winner, loser, type, a, b, typeInfo.ledger)))}</p></div></article>`;
    rendering = false;
  }

  function injectCss(){
    const existing = document.getElementById('compare-narrative-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'compare-narrative-css';
    style.textContent = `#compareResult.compare-article-mode{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.compare-face-card{position:relative;min-height:104px!important;padding:15px 16px!important;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,#23324a,#172033);box-shadow:0 13px 32px rgba(15,23,42,.16);display:flex;align-items:flex-end;justify-content:space-between;gap:12px;color:#f8faff;overflow:hidden}.compare-face-card h3{margin:0;font-size:clamp(22px,4vw,31px);line-height:1.02;color:#f8faff!important;letter-spacing:-.03em}.compare-face-card p{margin:8px 0 0;color:#c7d2e2!important;font-size:15px;line-height:1.25}.compare-face-badge{position:absolute;top:14px;right:14px;border:1px solid rgba(250,204,21,.48);background:rgba(250,204,21,.08);color:#fde68a;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:950;letter-spacing:.04em;white-space:nowrap}.compare-flow-card{grid-column:1/-1;background:linear-gradient(180deg,#23324a,#172033)!important;border-color:#40536f!important;color:#f8faff!important;padding:26px!important;border-radius:24px!important;box-shadow:0 13px 32px rgba(15,23,42,.16)}.compare-flow-card h3{margin:0 0 18px;font-size:clamp(30px,5vw,45px);line-height:1.05;letter-spacing:-.04em;color:#f8faff!important}.compare-flow-card p{margin:0 0 18px;color:#c7d2e2!important;line-height:1.55;font-size:18px}.compare-flow-card p.compare-debate-frame{border-left:5px solid #facc15;background:rgba(250,204,21,.08);border-radius:16px;padding:14px 16px;color:#f8faff!important;font-weight:750}.compare-flow-card p:last-child{margin-bottom:0}.compare-final-take{margin-top:24px;border:1px solid rgba(250,204,21,.42);border-left:7px solid #facc15;border-radius:20px;padding:18px 20px;background:rgba(34,40,42,.82);box-shadow:0 13px 32px rgba(15,23,42,.14)}.compare-final-take p{margin:0!important;color:#f8faff!important;font-size:18px;line-height:1.55}.compare-final-take strong{color:#facc15!important}@media(max-width:900px){#compareResult.compare-article-mode{grid-template-columns:1fr;gap:10px}.compare-face-card{min-height:88px!important;padding:14px!important;border-radius:18px}.compare-face-card h3{font-size:25px}.compare-face-card p{font-size:14px;padding-right:90px}.compare-face-badge{font-size:11px;padding:5px 9px;top:12px;right:12px}.compare-flow-card{padding:22px!important;border-radius:22px!important}.compare-flow-card h3{font-size:31px;margin-bottom:18px}.compare-flow-card p{font-size:17px;line-height:1.56;margin-bottom:18px}.compare-final-take{padding:17px 18px;margin-top:22px}.compare-final-take p{font-size:17px!important}}`;
    document.head.appendChild(style);
  }

  function install(){
    injectCss();
    setTimeout(render,0);
    ['fighterA','fighterB'].forEach(id => {
      const sel = el(id);
      if(sel && !sel.dataset.compareNarrativeListener){
        sel.dataset.compareNarrativeListener = 'true';
        sel.addEventListener('change', () => setTimeout(render,0));
      }
    });
    document.querySelectorAll('.tab').forEach(tab => {
      if(!tab.dataset.compareNarrativeTabListener){
        tab.dataset.compareNarrativeTabListener = 'true';
        tab.addEventListener('click', () => setTimeout(render,0));
      }
    });
  }

  window.UFC_COMPARE_NARRATIVE_SYSTEM = {version:VERSION, render};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();