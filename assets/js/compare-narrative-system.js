// Compare Narrative System - Phase 1: compact cards + structured debate article.
(function(){
  const VERSION = 'compare-narrative-system-20260702a';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const CATEGORY_KEYS = [
    ['championship','championship resume'],
    ['opponentQuality','quality wins'],
    ['primeDominance','prime dominance'],
    ['longevity','elite longevity'],
    ['penalty','loss context']
  ];

  let rendering = false;

  function el(id){ return document.getElementById(id); }
  function safe(s){ return String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function cleanNum(n){ return Number.isFinite(Number(n)) ? Number(n) : 0; }
  function fmt(n){ return Number.isFinite(Number(n)) ? Number(n).toFixed(1).replace(/\.0$/,'') : '—'; }
  function normalizeKey(a,b){ return [String(a||'').toLowerCase(),String(b||'').toLowerCase()].sort().join('|'); }

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

  function rankFor(f){
    return window.DISPLAY_OVERRIDES?.[f.fighter]?.allTimeRank || f.rank || '—';
  }

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

  function titleFightWins(f,p){
    if(p.legacyStats?.titleFightWins !== undefined) return p.legacyStats.titleFightWins;
    const note = String(f.title?.notes || f.notes || '');
    const m = note.match(/Total title fight wins = ([0-9.]+)/i);
    return m ? m[1].replace(/\.0$/,'') : null;
  }

  function eliteYears(f,p){
    if(p.legacyStats?.activeEliteYearsLabel) return p.legacyStats.activeEliteYearsLabel;
    if(f.activeEliteYears !== undefined && f.activeEliteYears !== null) return `roughly ${fmt(f.activeEliteYears)} active elite years`;
    return null;
  }

  function compactWins(f,p){
    if(p.signatureWins) return p.signatureWins;
    const opps = Array.isArray(f.opponents) ? f.opponents : [];
    if(!opps.length) return null;
    const names = [];
    opps.slice().sort((a,b)=>cleanNum(b.credit)-cleanNum(a.credit)).forEach(o => {
      const n = String(o.opponent || '').replace(/\s+\d+$/,'').trim();
      if(n && !names.includes(n)) names.push(n);
    });
    return names.slice(0,7).join(', ');
  }

  function edgeKeys(f, other){
    return CATEGORY_KEYS.map(([key,label]) => ({
      key,
      label,
      diff: categoryOvrFor(f,key) - categoryOvrFor(other,key)
    })).filter(x => x.diff > 0).sort((a,b)=>b.diff-a.diff);
  }

  function archetype(winner, loser, a, b){
    const diff = Math.abs(ovrFor(a) - ovrFor(b));
    const ledger = window.COMPARE_FIGHT_LEDGER?.[normalizeKey(a.fighter,b.fighter)] || null;
    const loserPrimeEdge = edgeKeys(loser,winner).some(x => x.key === 'primeDominance');
    const loserActive = String(profileFor(loser.fighter).legacyStats?.activeEliteYearsLabel || loser.primeEnd || loser.notes || '').toLowerCase().includes('active');
    if(ledger) return {type:'rivalry', ledger};
    if(diff <= 1) return {type:'razor'};
    if(diff <= 4) return {type:'close'};
    if(loserActive) return {type:'activeCeiling'};
    if(loserPrimeEdge) return {type:'peakVsResume'};
    if(diff >= 9) return {type:'tierGap'};
    return {type:'clear'};
  }

  function verdictLine(winner, loser, type){
    if(type === 'razor') return `${winner.fighter} edges it, but this is a real split-the-room comparison.`;
    if(type === 'close') return `${winner.fighter} wins, but ${loser.fighter} has a serious counterargument.`;
    if(type === 'rivalry') return `${winner.fighter} has the stronger UFC-only case, and the direct history matters.`;
    if(type === 'activeCeiling') return `${winner.fighter} wins for now, but ${loser.fighter}'s ceiling is the interesting part.`;
    if(type === 'peakVsResume') return `${winner.fighter} has the better UFC-only resume, but ${loser.fighter} has a real peak argument.`;
    if(type === 'tierGap') return `${winner.fighter} wins this comparison clearly.`;
    return `${winner.fighter} wins the UFC-only GOAT comparison, but ${loser.fighter} has a real lane.`;
  }

  function statSentence(f,p){
    const parts = [];
    const tfw = titleFightWins(f,p);
    const years = eliteYears(f,p);
    if(tfw !== null) parts.push(`${tfw} UFC title-fight wins`);
    if(years) parts.push(years);
    return parts.length ? parts.join(' and ') : '';
  }

  function argumentSection(f, other, preferredTitle){
    const p = profileFor(f.fighter);
    const edges = edgeKeys(f, other);
    const edgeLabels = edges.slice(0,2).map(x => x.label);
    const numbers = statSentence(f,p);
    const wins = compactWins(f,p);

    const lead = p.shortCase || p.resume || `${f.fighter}'s case is built around the parts of the UFC resume where he creates the most separation.`;
    let body = lead;
    if(edgeLabels.length){
      body += ` The strongest lanes are ${edgeLabels.join(' and ')}.`;
    }
    if(numbers){
      body += ` The quick number check: ${numbers}.`;
    }

    const detailParts = [];
    if(edges.some(x => x.key === 'championship') && (p.championship || p.titleSummary)) detailParts.push(p.championship || p.titleSummary);
    if(edges.some(x => x.key === 'opponentQuality') && (p.opponentQuality || wins)) detailParts.push(p.opponentQuality || `${wins} shape the quality-wins argument.`);
    if(edges.some(x => x.key === 'primeDominance') && (p.peak || p.primeSummary)) detailParts.push(p.peak || p.primeSummary);
    if(edges.some(x => x.key === 'longevity') && p.longevity) detailParts.push(p.longevity);
    if(!detailParts.length && p.edge) detailParts.push(p.edge);
    if(!detailParts.length && wins) detailParts.push(`${wins} give ${f.fighter} the best names in this side of the comparison.`);

    return `<section class="compare-article-section"><h3>${safe(preferredTitle)}</h3><p>${safe(body)}</p>${detailParts.slice(0,2).map(x=>`<p>${safe(x)}</p>`).join('')}</section>`;
  }

  function swingSection(winner, loser, type){
    const wp = profileFor(winner.fighter);
    const lp = profileFor(loser.fighter);
    const winnerEdges = edgeKeys(winner, loser).slice(0,3).map(x => x.label);
    const loserEdges = edgeKeys(loser, winner).slice(0,2).map(x => x.label);
    let copy;
    if(type === 'razor' || type === 'close'){
      copy = `The swing point is not whether ${loser.fighter} has a real argument. He does. The difference is that ${winner.fighter}'s advantages in ${winnerEdges.join(', ') || 'the fuller UFC resume'} slightly outweigh ${loser.fighter}'s best lanes${loserEdges.length ? ` in ${loserEdges.join(' and ')}` : ''}.`;
    } else if(type === 'activeCeiling'){
      copy = `${loser.fighter}'s case can still grow. Right now, though, ${winner.fighter} has more of the completed UFC-only resume already banked.`;
    } else if(type === 'peakVsResume'){
      copy = `${loser.fighter} can own parts of the peak conversation, but the ranking question is broader than peak. ${winner.fighter} has the stronger total UFC-only resume once title value, quality wins, elite years, and loss context are all counted together.`;
    } else if(type === 'tierGap'){
      copy = `The gap is mostly resume weight. ${loser.fighter}'s best argument is real, but it does not cover enough categories to pull ${winner.fighter} down into a coin-flip debate.`;
    } else {
      copy = `This is where ${winner.fighter} creates separation. ${loser.fighter}'s case has a lane, but ${winner.fighter} is stronger across the full UFC-only scoring picture.`;
    }
    if(wp.edge && lp.counter){
      copy += ` In plain terms: ${wp.edge} ${lp.counter}`;
    }
    return `<section class="compare-article-section"><h3>The swing point</h3><p>${safe(copy)}</p></section>`;
  }

  function betterFighterSection(winner, loser){
    const loserPrime = edgeKeys(loser,winner).some(x => x.key === 'primeDominance');
    const copy = loserPrime
      ? `<p><strong>Better fighter argument:</strong> ${safe(loser.fighter)} has a real case if the debate is peak skill, current form, or how dangerous the best version looked.</p><p><strong>Greater UFC-only resume:</strong> ${safe(winner.fighter)} still has the stronger scored resume because the model is measuring completed UFC value, not just who feels scarier at their best.</p>`
      : `<p><strong>Better fighter argument:</strong> This can depend on era, skill projection, and matchup assumptions.</p><p><strong>Greater UFC-only resume:</strong> ${safe(winner.fighter)} has the stronger UFC-only case in this comparison.</p>`;
    return `<section class="compare-article-section"><h3>Better fighter vs greater UFC resume</h3>${copy}</section>`;
  }

  function finalTake(winner, loser, type){
    const p = profileFor(winner.fighter);
    let copy;
    if(type === 'razor') copy = `${winner.fighter} wins, barely. ${loser.fighter} has enough category strength to make it uncomfortable, but ${winner.fighter}'s full UFC resume gives him the edge.`;
    else if(type === 'tierGap') copy = `${winner.fighter} wins clearly. ${loser.fighter} has a real argument in specific lanes, but not enough to close the overall UFC-only gap.`;
    else copy = `${winner.fighter} wins the UFC-only GOAT comparison. ${loser.fighter} has a real argument, but ${winner.fighter}'s title value, quality wins, elite years, and complete resume give him the edge.`;
    if(p.finalCompareTake) copy = p.finalCompareTake;
    return `<div class="compare-final-take"><p><strong>Final take:</strong> ${safe(copy)}</p></div>`;
  }

  function faceCard(f){
    const rank = rankFor(f);
    const div = [f.primaryDivision, f.secondaryDivision].filter(Boolean).join(' / ');
    return `<article class="compare-face-card"><div><h3>${safe(f.fighter)}</h3><p>${safe(f.ufcRecord || '')}${div ? ` · ${safe(div)}` : ''}</p></div><span class="compare-face-badge">#${safe(rank)} · ${safe(ovrFor(f))} OVR</span></article>`;
  }

  function directSection(ledger){
    if(!ledger) return '';
    return `<section class="compare-article-section compare-direct"><h3>Direct UFC context</h3><p>${safe(ledger.summary || 'These fighters have direct UFC history that matters to the comparison.')}</p></section>`;
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

    rendering = true;
    result.classList.add('compare-article-mode');
    result.dataset.compareNarrativeRendered = VERSION;
    result.innerHTML = `
      ${faceCard(a)}
      ${faceCard(b)}
      <article class="card compare-verdict-card">
        <h3>${safe(verdictLine(winner, loser, type))}</h3>
        <p>${safe(type === 'rivalry' ? 'This comparison has direct UFC history, so the fight ledger gets mentioned before the broader resume debate.' : 'The ranking tab tells you who is higher. Compare Mode is about why the argument lands there and what the losing case still gets right.')}</p>
      </article>
      ${directSection(typeInfo.ledger)}
      ${argumentSection(loser, winner, `Where ${loser.fighter} has the edge`)}
      ${argumentSection(winner, loser, `Where ${winner.fighter} creates separation`)}
      ${swingSection(winner, loser, type)}
      ${betterFighterSection(winner, loser)}
      ${finalTake(winner, loser, type)}
    `;
    rendering = false;
  }

  function injectCss(){
    const existing = document.getElementById('compare-narrative-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'compare-narrative-css';
    style.textContent = `
      #compareResult.compare-article-mode{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}
      .compare-face-card{position:relative;min-height:112px!important;padding:16px 16px!important;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,#23324a,#172033);box-shadow:0 13px 32px rgba(15,23,42,.16);display:flex;align-items:flex-end;justify-content:space-between;gap:12px;color:#f8faff;overflow:hidden}
      .compare-face-card h3{margin:0;font-size:clamp(22px,4vw,31px);line-height:1.02;color:#f8faff!important;letter-spacing:-.03em}
      .compare-face-card p{margin:8px 0 0;color:#c7d2e2!important;font-size:15px;line-height:1.25}
      .compare-face-badge{position:absolute;top:14px;right:14px;border:1px solid rgba(250,204,21,.48);background:rgba(250,204,21,.08);color:#fde68a;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:950;letter-spacing:.04em;white-space:nowrap}
      .compare-verdict-card,.compare-article-section,.compare-final-take{grid-column:1/-1;background:linear-gradient(180deg,#23324a,#172033)!important;border-color:#40536f!important;color:#f8faff!important}
      .compare-verdict-card{padding:22px!important;border-radius:22px!important}
      .compare-verdict-card h3{margin:0;font-size:clamp(27px,5vw,42px);line-height:1.05;letter-spacing:-.035em;color:#f8faff!important}
      .compare-verdict-card p{margin:14px 0 0;color:#c7d2e2!important;line-height:1.55;font-size:17px}
      .compare-article-section{border:1px solid var(--line);border-radius:20px;padding:20px 22px;box-shadow:0 13px 32px rgba(15,23,42,.16)}
      .compare-article-section h3{margin:0 0 10px;color:#f8faff!important;font-size:23px;letter-spacing:-.02em}
      .compare-article-section p{margin:0 0 14px;color:#c7d2e2!important;line-height:1.58;font-size:17px}
      .compare-article-section p:last-child{margin-bottom:0}
      .compare-direct{border-color:rgba(250,204,21,.42)!important}
      .compare-final-take{border:1px solid rgba(250,204,21,.42);border-left:7px solid #facc15;border-radius:20px;padding:18px 20px;box-shadow:0 13px 32px rgba(15,23,42,.14)}
      .compare-final-take p{margin:0;color:#f8faff!important;font-size:18px;line-height:1.55}
      .compare-final-take strong{color:#facc15!important}
      @media(max-width:900px){
        #compareResult.compare-article-mode{grid-template-columns:1fr;gap:10px}
        .compare-face-card{min-height:92px!important;padding:14px!important;border-radius:18px}
        .compare-face-card h3{font-size:25px}
        .compare-face-card p{font-size:14px;padding-right:90px}
        .compare-face-badge{font-size:11px;padding:5px 9px;top:12px;right:12px}
        .compare-verdict-card{padding:20px!important}
        .compare-verdict-card h3{font-size:28px}
        .compare-verdict-card p,.compare-article-section p{font-size:16px;line-height:1.55}
        .compare-article-section{padding:18px;border-radius:18px}
        .compare-article-section h3{font-size:21px}
      }
    `;
    document.head.appendChild(style);
  }

  function install(){
    injectCss();
    setTimeout(render, 0);
    ['fighterA','fighterB'].forEach(id => {
      const sel = el(id);
      if(sel && !sel.dataset.compareNarrativeListener){
        sel.dataset.compareNarrativeListener = 'true';
        sel.addEventListener('change', () => setTimeout(render, 0));
      }
    });
    document.querySelectorAll('.tab').forEach(tab => {
      if(!tab.dataset.compareNarrativeTabListener){
        tab.dataset.compareNarrativeTabListener = 'true';
        tab.addEventListener('click', () => setTimeout(render, 0));
      }
    });
    const result = el('compareResult');
    if(result && !result.dataset.compareNarrativeObserver){
      result.dataset.compareNarrativeObserver = 'true';
      const obs = new MutationObserver(() => {
        if(rendering) return;
        if(result.dataset.compareNarrativeRendered !== VERSION){
          setTimeout(render, 0);
        }
      });
      obs.observe(result, {childList:true, subtree:false});
    }
  }

  window.UFC_COMPARE_NARRATIVE_SYSTEM = {version:VERSION, render};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
