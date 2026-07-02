// Compare Narrative System - Phase 3: flowing article + deterministic fighter voice.
(function(){
  const VERSION = 'compare-narrative-system-20260702h';
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

  const FIGHTER_VOICE = {
    'Jon Jones': {
      title: ['Jones is the benchmark title case: too many championship wins, too many elite names, and almost no real competitive damage to the resume.'],
      peak: ['Jones did not just win at his best; he solved different styles across multiple eras and rarely looked like the smaller-picture debate could touch him.'],
      opponentQuality: ['The Jones win ledger is the separator: Cormier, Gustafsson, Glover, Machida, Shogun, Rashad, Rampage, and Gane give him all-time depth.'],
      longevity: ['Jones has the long-game proof too, staying title-relevant from the early 2010s into heavyweight.'],
      weakness: ['The pushback is outside-the-cage context, inactivity, and close late light heavyweight fights, not the core UFC win column.']
    },
    'Georges St-Pierre': {
      title: ['GSP brings the complete champion case: long welterweight control, a middleweight cherry on top, and title wins that aged extremely well.'],
      peak: ['At his best, GSP was process dominance: jab, timing, wrestling, top control, and almost no wasted rounds.'],
      opponentQuality: ['GSP wins a lot of debates through quality wins because the welterweight list is deep, proven, and full of rematch answers.'],
      longevity: ['The GSP case has staying power because the second act after Serra was cleaner than almost any long title run.'],
      weakness: ['The Serra upset is the obvious scar, but the rematch is also part of why the resume feels so complete.']
    },
    'Demetrious Johnson': {
      title: ['Johnson owns the flyweight-standard argument: long title control, repeated defenses, and a reign that defined the division.'],
      peak: ['At his best, Mighty Mouse was technical control with creativity, speed, transitions, and one of the cleanest skill sets in UFC history.'],
      opponentQuality: ['The Johnson debate always has division-strength context, but the skill and dominance are still real.'],
      longevity: ['Johnson stayed elite long enough that the flyweight run was not just a hot streak; it became the division standard.'],
      weakness: ['The limiter is not skill. It is flyweight depth and how much the ranking gives his opponent ledger.']
    },
    'Anderson Silva': {
      title: ['Silva has the historic middleweight reign: long title control, iconic finishes, and the kind of aura most champions never touch.'],
      peak: ['Peak Silva is the aura argument. He made elite fighters look frozen, reckless, or completely out of ideas.'],
      opponentQuality: ['The Silva win list has strong names, but the debate depends on how much you discount middleweight depth compared with tougher all-time divisions.'],
      longevity: ['Silva stayed dangerous for years, but the later stretch adds more context than clean scoring value.'],
      weakness: ['The Weidman losses matter because they hit the in-prime story; the later losses are more post-prime drag than the heart of the case.']
    },
    'Islam Makhachev': {
      title: ['Islam now has the title-volume separator at lightweight: more championship proof, more elite defenses, and a resume that keeps getting heavier.'],
      peak: ['Islam at his best is control with finishing threat: patient pressure, grappling danger, improved striking, and very few easy rounds for opponents.'],
      opponentQuality: ['Oliveira, Volkanovski, Poirier, Tsarukyan, and Hooker give Islam a modern lightweight ledger with real championship weight.'],
      longevity: ['Islam is no longer just a projection. The elite years are stacking into a real completed UFC case.'],
      weakness: ['The only real limiter is total time compared with the older legends, plus the pre-prime Martins loss sitting in the background.']
    },
    'Khabib Nurmagomedov': {
      title: ['Khabib title run is shorter than the all-time volume kings, but every title-level chapter felt clean and decisive.'],
      peak: ['Khabib case is peak purity: no UFC losses, no real collapse, and a final stretch that looked like total separation from elite lightweights.'],
      opponentQuality: ['RDA, Barboza, McGregor, Poirier, and Gaethje give Khabib a compact but extremely high-quality lightweight resume.'],
      longevity: ['Khabib has enough elite years to matter, but the argument is still peak dominance more than long title volume.'],
      weakness: ['The only real ceiling is volume. The peak is good enough for anyone; the title-fight count is the shorter part.']
    },
    'Alexander Volkanovski': {
      title: ['Volk championship case is extremely clean at featherweight: belt win, defenses, and direct separation from Holloway.'],
      peak: ['Volk best version was balance: footwork, adjustments, pace, defense, and the ability to win long tactical fights.'],
      opponentQuality: ['Aldo, Holloway three times, Ortega, Korean Zombie, and Yair give Volk one of the cleanest modern featherweight title resumes.'],
      longevity: ['Volk has real elite years, but his case is more balanced excellence than pure longevity volume.'],
      weakness: ['The Topuria loss and the Islam losses keep the ending complicated, even though the Islam losses get upward-division context.']
    },
    'Max Holloway': {
      title: ['Holloway title case is strong, but the bigger argument is not belt volume; it is how much elite UFC work he kept adding.'],
      peak: ['Peak Max was pace, boxing, durability, and pressure. He drowned great fighters by turning fights into long, exhausting conversations.'],
      opponentQuality: ['Holloway wins the long-game argument: Aldo twice, Ortega, Kattar, Yair, Korean Zombie, Gaethje, and more across a huge UFC window.'],
      longevity: ['Max is the volume monster: elite durability, years of relevance, and a resume that kept finding new ways to stay alive.'],
      weakness: ['The ceiling is championship control. The resume is deep, but the Volk trilogy keeps the featherweight reign from looking like the cleanest all-time case.']
    },
    'Kamaru Usman': {
      title: ['Usman case starts with the champion peak: more title-fight value, more round-to-round control, and a welterweight reign that felt locked in for years.'],
      peak: ['At his best, Usman was pressure, wrestling threat, cardio, clinch control, and improving power — a champion who made fights feel physically expensive.'],
      opponentQuality: ['Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give Usman a strong modern welterweight ledger.'],
      longevity: ['Usman elite window was not short, but it is more champion-peak than decade-long volume case.'],
      weakness: ['The Edwards losses and shorter all-time elite window are the gap when he is compared with deeper longevity resumes.']
    },
    'Jose Aldo': {
      title: ['Aldo UFC-only title case is strong, but the full historical aura is bigger than what this ranking can score because the WEC reign sits outside the main count.'],
      peak: ['Peak Aldo was speed, takedown defense, leg kicks, composure, and a champion presence that carried into the UFC era.'],
      opponentQuality: ['Aldo UFC list has real depth across featherweight and bantamweight, even with the WEC chapter treated as context.'],
      longevity: ['Aldo best UFC-only argument is longevity: he stayed relevant through multiple generations and even rebuilt value at bantamweight.'],
      weakness: ['The UFC-only boundary is the whole debate. Historically he feels higher; inside this scoring window he loses some of the WEC weight.']
    },
    'Matt Hughes': {
      title: ['Hughes brings old-school welterweight title volume: real reign value, repeated championship wins, and a foundational UFC resume.'],
      peak: ['At his best, Hughes was physical control, wrestling dominance, and top-position pressure before the modern era caught up.'],
      opponentQuality: ['The Hughes opponent ledger has major names, but some of it needs era context when compared with deeper modern resumes.'],
      longevity: ['Hughes stayed at the top long enough to matter historically, even if the late-career decline hurts the clean read.'],
      weakness: ['The issue is modern translation and loss context. The greatness is real, but the resume is messier than the cleanest champions.']
    },
    'Daniel Cormier': {
      title: ['Cormier case is two-division title value: light heavyweight gold, heavyweight gold, and a dense elite UFC window.'],
      peak: ['DC best version was pressure wrestling, clinch control, durability, and the ability to compete up at heavyweight without looking out of place.'],
      opponentQuality: ['Cormier UFC ledger is compact but high-end, with heavyweight and light heavyweight value packed into a shorter window.'],
      longevity: ['DC UFC run is dense more than long. He arrived late, but almost every chapter mattered.'],
      weakness: ['The Jones rivalry is the ceiling. DC is great, but the direct all-time measuring stick sits above him.']
    },
    'Stipe Miocic': {
      title: ['Stipe has the UFC heavyweight resume argument: title defenses, champion wins, and the Cormier trilogy comeback.'],
      peak: ['At his best, Stipe was heavyweight reliability: boxing, wrestling, cardio, toughness, and composure in chaos.'],
      opponentQuality: ['Ngannou, Cormier, Werdum, Overeem, dos Santos, Hunt, Arlovski, and others give Stipe heavyweight depth.'],
      longevity: ['Stipe case is not just one reign; it is heavyweight staying power across multiple dangerous styles.'],
      weakness: ['Heavyweight volatility is always part of the read, and the late Jones loss does not help the ending.']
    },
    'Alex Pereira': {
      title: ['Pereira is the fast-climb title case: two UFC belts, huge title moments, and immediate light heavyweight championship weight.'],
      peak: ['Pereira peak is consequence. Every exchange feels dangerous because one clean shot can rewrite the whole fight.'],
      opponentQuality: ['Adesanya, Prochazka twice, Hill, Blachowicz, Strickland, and Rountree make Pereira short UFC ledger loud.'],
      longevity: ['The volume is still building, but the title impact already punches above the length of the run.'],
      weakness: ['The question is length. Pereira high end is massive, but the UFC sample is shorter than the deepest all-time cases.']
    },
    'Israel Adesanya': {
      title: ['Adesanya case is middleweight title volume: repeated defenses, two Whittaker wins, and years as the division standard.'],
      peak: ['Peak Izzy was range control, feints, counters, and the ability to make elite strikers hesitate.'],
      opponentQuality: ['Whittaker twice, Vettori twice, Costa, Cannonier, Gastelum, and Pereira revenge context give Izzy a serious middleweight ledger.'],
      longevity: ['Adesanya held the middleweight conversation for years, which gives him more completed proof than a normal short-peak striker.'],
      weakness: ['The Pereira rivalry and later losses complicate the aura, even though the total middleweight resume remains strong.']
    },
    'Amanda Nunes': {
      title: ['Nunes is the women title standard: two belts, repeated defenses, and the biggest collection of elite-name wins in women UFC history.'],
      peak: ['Peak Nunes was violence with layers: power, takedown defense, jiu-jitsu, confidence, and the ability to erase legends fast.'],
      opponentQuality: ['Shevchenko twice, Cyborg, Rousey, Holm, Tate, de Randamie, and Pena revenge give Nunes the deepest women ledger.'],
      longevity: ['Nunes stayed elite long enough to own both the peak and the completed-resume argument among women.'],
      weakness: ['The Pena upset matters, but the revenge win keeps it from defining the whole case.']
    },
    'Valentina Shevchenko': {
      title: ['Valentina brings the technical flyweight reign: repeated defenses, title control, and a later regain that keeps the story alive.'],
      peak: ['Peak Valentina was timing, balance, counters, clinch work, and five-round calm.'],
      opponentQuality: ['Joanna, Andrade, Holm, Pena, Chookagian, Murphy, Santos, Grasso context, and more give Valentina real cross-division depth.'],
      longevity: ['Valentina case is long technical excellence across bantamweight and flyweight.'],
      weakness: ['Nunes is the ceiling. Valentina was close, but Amanda owns the direct rivalry and the stronger two-division case.']
    }
  };

  const MATCHUP_FRAMES = {
    'kamaru usman|max holloway': 'Better champion peak: Kamaru Usman. Better total UFC resume: Max Holloway, barely.',
    'islam makhachev|khabib nurmagomedov': 'Cleaner peak: Khabib Nurmagomedov. Bigger UFC title resume: Islam Makhachev.',
    'alexander volkanovski|max holloway': 'Longer volume case: Max Holloway. Shared-era featherweight separation: Alexander Volkanovski.',
    'georges st-pierre|jon jones': 'Cleanest complete challenger case: Georges St-Pierre. Highest UFC-only benchmark case: Jon Jones.',
    'anderson silva|demetrious johnson': 'Peak aura and finishing mythology: Anderson Silva. Cleaner title structure and technical control: Demetrious Johnson.',
    'dominick cruz|jose aldo': 'Style and comeback argument: Dominick Cruz. Deeper UFC-only volume and longevity: Jose Aldo.',
    'daniel cormier|stipe miocic': 'Two-division value: Daniel Cormier. Heavyweight trilogy and UFC heavyweight resume: Stipe Miocic.',
    'alex pereira|israel adesanya': 'Explosive two-division impact: Alex Pereira. Longer completed middleweight reign: Israel Adesanya.',
    'amanda nunes|valentina shevchenko': 'Technical flyweight standard: Valentina Shevchenko. Women two-division GOAT resume: Amanda Nunes.'
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
  function voicePhrase(f,key,other){ const bank = FIGHTER_VOICE[f.fighter]?.[key]; return Array.isArray(bank) && bank.length ? pick(bank, pairKey(f, other || f, `voice-${key}`)) : null; }
  function matchupFrame(a,b){ return MATCHUP_FRAMES[normalizeKey(a.fighter,b.fighter)] || null; }

  function full(name){
    const boardRow = [...(DATA.men || []), ...(DATA.women || [])].find(f => f.fighter === name) || {fighter:name};
    if(typeof window.fullRow === 'function') return window.fullRow(boardRow);
    const profile = (DATA.fighters || []).find(f => f.fighter === name) || {};
    return {...profile, ...boardRow};
  }
  function profileFor(name){ return (window.COMPARE_PROFILES && window.COMPARE_PROFILES[name]) || (window.DISPLAY_OVERRIDES && window.DISPLAY_OVERRIDES[name] && window.DISPLAY_OVERRIDES[name].compareProfile) || {}; }
  function rankFor(f){ return window.DISPLAY_OVERRIDES?.[f.fighter]?.allTimeRank || f.rank || '—'; }
  function ovrFor(f){ if(typeof window.overallOvr === 'function') return window.overallOvr(f); const all = [...(DATA.men || []), ...(DATA.women || [])]; const max = Math.max(...all.map(x => cleanNum(x.totalScore)), 1); return Math.max(60, Math.min(99, Math.round(75 + (cleanNum(f.totalScore) / max) * 24))); }
  function categoryOvrFor(f,key){ if(key === 'overall') return ovrFor(f); if(typeof window.categoryOvr === 'function') return window.categoryOvr(f,key); return Math.round(cleanNum(f[key])); }
  function categoryBaseForCompare(f,key){ const raw = Number(f?.[key]); return Number.isFinite(raw) ? raw : categoryOvrFor(f,key); }
  function categoryEdge(f,other,key){ return categoryBaseForCompare(f,key) - categoryBaseForCompare(other,key); }
  function titleFightWins(f,p){ if(p.legacyStats?.titleFightWins !== undefined) return p.legacyStats.titleFightWins; const m = String(f.title?.notes || f.notes || '').match(/Total title fight wins = ([0-9.]+)/i); return m ? m[1].replace(/\.0$/,'') : null; }
  function eliteYears(f,p){ if(f.activeEliteYears !== undefined && f.activeEliteYears !== null) return roundYear(f.activeEliteYears); const m = String(p.legacyStats?.activeEliteYearsLabel || '').match(/([0-9]+(?:\.[0-9]+)?)/); return m ? roundYear(m[1]) : null; }
  function compactWins(f,p,count=7){ if(p.signatureWins) return p.signatureWins; const opps = Array.isArray(f.opponents) ? f.opponents : []; if(!opps.length) return null; const names = []; opps.slice().sort((a,b)=>cleanNum(b.credit)-cleanNum(a.credit)).forEach(o => { const n = String(o.opponent || '').replace(/\s+\d+$/,'').trim(); if(n && !names.includes(n)) names.push(n); }); return names.slice(0,count).join(', '); }
  function opponentLine(f,p){ const wins = compactWins(f,p,7); if(!wins) return null; return p.signatureWins ? wins : `Wins over ${wins} keep the opponent ledger strong.`; }
  function profileText(f){ const p = profileFor(f.fighter); return [p.shortCase,p.peak,p.resume,p.championship,p.opponentQuality,p.longevity,p.counter,p.edge,p.bestArgument,p.titleSummary,p.primeSummary,p.scope,f.primeEnd,f.notes].filter(Boolean).join(' ').toLowerCase(); }
  function isStillBuilding(f){ return /still building|case is still growing|keeps getting stronger|keeps gaining|growing title run|young but|ceiling is real|can change the answer|can keep closing|still adding chapters|active modern/i.test(profileText(f)); }
  function isUnbeatenDominanceCase(f){ return /unbeaten|perfect ufc record|no ufc losses|purity|cleanest peak|almost flawless|unbeatable/i.test(profileText(f)); }
  function edgeKeys(f, other){
    const edges = CATEGORY_KEYS.map(([key,label,weight]) => { const rawDiff = categoryEdge(f,other,key); return { key, label, rawDiff, diff: rawDiff * weight }; }).filter(x => x.rawDiff > 0).sort((a,b)=>b.diff-a.diff);
    if(isUnbeatenDominanceCase(f)){ const preferred = ['primeDominance','penalty']; const boosted = []; preferred.forEach(key => { const item = edges.find(x => x.key === key); if(item && !boosted.includes(item)) boosted.push(item); }); edges.forEach(item => { if(!boosted.includes(item)) boosted.push(item); }); return boosted; }
    const nonPenalty = edges.filter(x => x.key !== 'penalty'); return nonPenalty.length ? nonPenalty.concat(edges.filter(x => x.key === 'penalty')) : edges;
  }
  function displayEdges(f, other){ const all = edgeKeys(f, other); if(isUnbeatenDominanceCase(f)) return all.slice(0,2); const nonPenalty = all.filter(x => x.key !== 'penalty'); return (nonPenalty.length ? nonPenalty : all).slice(0,2); }
  function readableLanes(f, other){ const edges = displayEdges(f, other).map(x => x.label); if(edges.length === 0) return 'his best individual lane'; if(edges.length === 1) return edges[0]; return `${edges[0]} and ${edges[1]}`; }
  function archetype(winner, loser, a, b){ const diff = Math.abs(ovrFor(a) - ovrFor(b)); const ledger = window.COMPARE_FIGHT_LEDGER?.[normalizeKey(a.fighter,b.fighter)] || null; const loserPrimeEdge = edgeKeys(loser,winner).some(x => x.key === 'primeDominance'); if(ledger) return {type:'rivalry', ledger}; if(diff <= 1) return {type:'razor'}; if(diff <= 4) return {type:'close'}; if(isStillBuilding(loser)) return {type:'activeCeiling'}; if(loserPrimeEdge) return {type:'peakVsResume'}; if(diff >= 9) return {type:'tierGap'}; return {type:'clear'}; }
  function verdictLine(winner, loser, type, a, b){
    const variants = { razor: [`${winner.fighter} wins by a hair, but ${loser.fighter} makes it uncomfortable.`,`${winner.fighter} edges it, but this is a real split-the-room comparison.`,`${winner.fighter} is barely ahead; ${loser.fighter} has a serious losing argument.`], close: [`${winner.fighter} wins, but ${loser.fighter} has a serious counterargument.`,`${winner.fighter} has the better UFC-only case, but ${loser.fighter} makes him work for it.`,`${winner.fighter} gets the nod, while ${loser.fighter} still has a real lane.`], rivalry: [`${winner.fighter} wins, and their direct UFC history helps explain why.`,`${winner.fighter} has the stronger case, with the rivalry context part of the story.`,`${winner.fighter} gets the edge, and this one comes with real direct-fight history.`], activeCeiling: [`${winner.fighter} has the completed resume; ${loser.fighter} has the still-building case.`,`${winner.fighter} wins for now, but ${loser.fighter}'s ceiling is the interesting part.`,`${winner.fighter} leads today, but ${loser.fighter} is the one who can change the answer later.`], peakVsResume: [`${winner.fighter} has the better UFC-only resume, but ${loser.fighter} has a real peak argument.`,`${winner.fighter} wins the total resume debate; ${loser.fighter} can still make the peak case uncomfortable.`,`${winner.fighter} has more complete UFC value, even if ${loser.fighter}'s best version deserves respect.`], tierGap: [`${winner.fighter} wins this comparison clearly.`,`This is a tier-gap comparison in ${winner.fighter}'s favor.`,`${loser.fighter} has an argument in pieces, but ${winner.fighter} owns the comparison overall.`], clear: [`${winner.fighter} wins the UFC-only GOAT comparison, but ${loser.fighter} has a real lane.`,`${winner.fighter} has the stronger case, but the losing argument is still worth laying out.`,`${winner.fighter} is the pick, with ${loser.fighter}'s counterargument sitting in a narrower lane.`] };
    return pick(variants[type] || variants.clear, pairKey(a,b,`verdict-${type}`));
  }
  function titleValueLine(f,p,other,role){ const tfw = titleFightWins(f,p); if(tfw === null) return null; const edge = categoryEdge(f,other,'championship'); const otherTfw = titleFightWins(other, profileFor(other.fighter)); if(edge > 0){ if(role === 'winner') return `${f.fighter}'s ${tfw} UFC title-fight wins help create separation in the title-reign part of the debate.`; return `${f.fighter}'s ${tfw} UFC title-fight wins are a real counterargument${otherTfw !== null ? ` against ${other.fighter}'s ${otherTfw}` : ''}.`; } if(role === 'loser') return `${f.fighter}'s ${tfw} UFC title-fight wins keep the case credible, but title volume is not where he wins this comparison.`; return null; }
  function eliteYearsLine(f,p,other,role){ const years = eliteYears(f,p); if(!years) return null; const edge = categoryEdge(f,other,'longevity'); if(edge > 0){ if(role === 'winner') return `About ${years} active elite years gives ${f.fighter} more completed UFC proof.`; return `About ${years} active elite years adds real weight to ${f.fighter}'s counterargument.`; } if(role === 'loser'){ if(isStillBuilding(f)) return `About ${years} active elite years shows the case is still building, not fully maxed out yet.`; return `About ${years} active elite years gives the case real weight, but ${other.fighter} owns the longer completed elite window.`; } return null; }
  function voiceKeyForCategory(key){ return ({championship:'title',opponentQuality:'opponentQuality',primeDominance:'peak',longevity:'longevity',penalty:'weakness'}[key] || null); }
  function detailFor(f,other,role,hasWinsLine){ const p = profileFor(f.fighter); const top = edgeKeys(f, other)[0]?.key; const voiceKey = voiceKeyForCategory(top); const voice = voiceKey ? voicePhrase(f, voiceKey, other) : null; if(voice) return voice; if(role === 'loser' && p.bestArgument) return p.bestArgument; const opponentFallback = hasWinsLine ? (role === 'winner' ? (p.longevity || p.resume || p.edge) : (p.counter || p.peak || p.resume)) : (p.opponentQuality || p.resume); const byCategory = { championship: p.championship || p.titleSummary, opponentQuality: opponentFallback, primeDominance: p.peak || p.primeSummary, longevity: p.longevity || p.resume, penalty: p.weakness || p.shortCase }; if(top && byCategory[top]) return byCategory[top]; if(role === 'winner') return p.edge || p.resume || p.shortCase; return p.peak || p.counter || p.resume || p.shortCase; }
  function argumentParagraph(f, other, role, type){ const p = profileFor(f.fighter); const lanes = readableLanes(f, other); const titleLine = titleValueLine(f,p,other,role); const yearsLine = eliteYearsLine(f,p,other,role); const winsLine = opponentLine(f,p); const parts = []; if(role === 'loser'){ if(type === 'activeCeiling' && isStillBuilding(f)) parts.push(`If you are arguing for ${f.fighter}, the lane is obvious: the case is still growing.`); else if(type === 'peakVsResume') parts.push(`The best case for ${f.fighter} starts with peak value.`); else if(type === 'rivalry') parts.push(`${f.fighter}'s counterargument is real; it just has to survive the direct history.`); else parts.push(`The best version of the ${f.fighter} argument starts with ${lanes}.`); } else { if(type === 'activeCeiling') parts.push(`${f.fighter} still pulls ahead because his case has more completed proof.`); else if(type === 'rivalry') parts.push(`${f.fighter}'s broader case holds up because the direct history is part of the larger resume story.`); else parts.push(`${f.fighter} creates separation through ${lanes}.`); } if(titleLine) parts.push(titleLine); if(yearsLine) parts.push(yearsLine); if(winsLine) parts.push(winsLine); const detail = detailFor(f, other, role, Boolean(winsLine)); if(detail) parts.push(detail); return parts.filter(Boolean).join(' '); }
  function ledgerWinnerMatches(ledger, fighter){ return String(ledger?.winner || '').toLowerCase() === String(fighter?.fighter || fighter || '').toLowerCase(); }
  function swingParagraph(winner, loser, type, ledger){ if(type === 'rivalry' && ledger){ if(ledgerWinnerMatches(ledger,winner)) return `${ledger.summary} That does not mean the fight ledger is the only thing that matters, but it makes the comparison cleaner: the direct history and the broader UFC case both point toward ${winner.fighter}.`; if(ledgerWinnerMatches(ledger,loser)) return `${ledger.summary} That direct result matters, but it does not automatically decide the GOAT comparison. ${winner.fighter} still has the stronger completed UFC resume once title value, elite wins, longevity, and loss context are weighed together.`; if(String(ledger?.winner || '').toLowerCase() === 'split') return `${ledger.summary} The series is split, so this is not a clean direct edge either way. The tiebreaker is the broader UFC resume, where ${winner.fighter} has more completed value.`; return `${ledger.summary} The direct history adds context, but ${winner.fighter}'s broader UFC resume is the separator.`; } if(type === 'activeCeiling') return `${loser.fighter} may eventually make this a different conversation. Right now, the difference is completed proof. ${winner.fighter} has the larger finished UFC case, while ${loser.fighter} is still adding chapters.`; if(type === 'peakVsResume') return `${loser.fighter} can win parts of the peak conversation. The reason it does not flip is that this ranking is asking for total UFC value, and ${winner.fighter} has more of it banked.`; if(type === 'razor' || type === 'close') return `${loser.fighter} wins enough of the debate to make it close. The swing point is that ${winner.fighter} has slightly more complete UFC value once title-fight value, elite wins, longevity, and loss context are all considered together.`; if(type === 'tierGap') return `${loser.fighter}'s best points matter, but they do not cover enough ground. ${winner.fighter} owns too much of the total UFC-only picture.`; return `${loser.fighter} has a real counterargument. ${winner.fighter} still has more ways to win the full UFC-only resume debate.`; }
  function distinctionParagraph(winner, loser){ const loserEdges = edgeKeys(loser,winner); const keys = new Set(loserEdges.map(x => x.key)); const hasVolume = keys.has('opponentQuality') || keys.has('longevity'); const hasPeak = keys.has('primeDominance'); const hasTitle = keys.has('championship'); if(hasTitle && hasPeak) return `Better champion-peak argument: ${loser.fighter} has a real case if you are focused on title control and round-to-round dominance. Greater UFC-only resume: ${winner.fighter} still has the stronger completed body of work.`; if(isUnbeatenDominanceCase(loser) || (hasPeak && !hasVolume)) return `Better fighter argument: ${loser.fighter} has a real case if you are talking peak skill, matchup dominance, or how unbeatable the best version looked. Greater UFC-only resume: ${winner.fighter} still has the stronger completed UFC career.`; if(hasVolume) return `${loser.fighter}'s best counterargument is resume depth: longevity, durability, and opponent volume. Greater UFC-only resume: ${winner.fighter} still has the stronger total case once the full comparison is weighed.`; return `This is not the same as asking who would win head-to-head. The better UFC-only GOAT case belongs to ${winner.fighter}, because his resume has more completed all-time value.`; }
  function finalTake(winner, loser, type, a, b, ledger){ const winnerLanes = readableLanes(winner, loser); if(type === 'rivalry' && ledger){ if(ledgerWinnerMatches(ledger,winner)) return `${winner.fighter} wins. The direct fight history helps, and the broader ${winnerLanes} case backs it up.`; if(ledgerWinnerMatches(ledger,loser)) return `${winner.fighter} wins the UFC-only GOAT comparison, even though ${loser.fighter} owns the direct result. The broader completed resume gives ${winner.fighter} the edge.`; if(String(ledger?.winner || '').toLowerCase() === 'split') return `${winner.fighter} wins. The direct series is split, so the call comes down to the broader UFC resume and ${winner.fighter}'s edge in ${winnerLanes}.`; } const variants = { razor: [`${winner.fighter} wins, barely. ${loser.fighter} has enough category strength to make it uncomfortable, but ${winner.fighter}'s edge in ${winnerLanes} gives him the slight nod.`,`${winner.fighter} is the pick by a thin margin. ${loser.fighter} wins real parts of the debate, but ${winner.fighter}'s edge in ${winnerLanes} is just enough.`], activeCeiling: [`${winner.fighter} gets the nod for now. ${loser.fighter}'s ceiling is real, but ${winner.fighter} owns more of the completed UFC-only resume today.`,`${winner.fighter} wins today. ${loser.fighter} can keep closing the gap, but this is still completed resume over a still-building case.`], rivalry: [`${winner.fighter} wins. The direct fight history adds context, and the broader UFC resume points his way.`,`${winner.fighter} is the call. The head-to-head context and the wider UFC resume are both part of the answer.`], tierGap: [`${winner.fighter} wins clearly. ${loser.fighter} has a real argument in specific lanes, but not enough to close the overall UFC-only gap.`,`${winner.fighter} is too far ahead overall. ${loser.fighter}'s best points matter, but this does not become a true toss-up.`], default: [`${winner.fighter} wins the UFC-only GOAT comparison. ${loser.fighter} has a real argument, but ${winner.fighter}'s edge in ${winnerLanes} gives him the stronger completed case.`,`${winner.fighter} gets the nod. ${loser.fighter} has a credible case in the right lane, but ${winner.fighter} owns more of the completed UFC-only resume.`,`${winner.fighter} is the answer here. ${loser.fighter}'s argument is real, but it does not outweigh the total UFC resume on the other side.`] }; return pick(variants[type] || variants.default, pairKey(a,b,`final-${type}`)); }
  function finalLabel(a,b){ return pick(FINAL_LABELS, pairKey(a,b,'final-label')); }
  function faceCard(f){ const rank = rankFor(f); const div = [f.primaryDivision, f.secondaryDivision].filter(Boolean).join(' / '); return `<article class="compare-face-card"><div><h3>${safe(f.fighter)}</h3><p>${safe(f.ufcRecord || '')}${div ? ` · ${safe(div)}` : ''}</p></div><span class="compare-face-badge">#${safe(rank)} · ${safe(ovrFor(f))} OVR</span></article>`; }
  function render(){ if(rendering) return; const result = el('compareResult'); const selectA = el('fighterA'); const selectB = el('fighterB'); if(!result || !selectA || !selectB || !selectA.value || !selectB.value) return; const a = full(selectA.value); const b = full(selectB.value); const aScore = cleanNum(a.totalScore) || ovrFor(a); const bScore = cleanNum(b.totalScore) || ovrFor(b); const winner = aScore >= bScore ? a : b; const loser = winner.fighter === a.fighter ? b : a; const typeInfo = archetype(winner, loser, a, b); const type = typeInfo.type; const frame = matchupFrame(a,b); const paragraphs = [frame,argumentParagraph(loser, winner, 'loser', type),argumentParagraph(winner, loser, 'winner', type),swingParagraph(winner, loser, type, typeInfo.ledger),distinctionParagraph(winner, loser)].filter(Boolean); rendering = true; result.classList.add('compare-article-mode'); result.dataset.compareNarrativeRendered = VERSION; result.innerHTML = `${faceCard(a)}${faceCard(b)}<article class="card compare-flow-card"><h3>${safe(verdictLine(winner, loser, type, a, b))}</h3>${paragraphs.map((p,i) => `<p${i===0 && frame ? ' class="compare-debate-frame"' : ''}>${safe(p)}</p>`).join('')}<div class="compare-final-take"><p><strong>${safe(finalLabel(a,b))}:</strong> ${safe(finalTake(winner, loser, type, a, b, typeInfo.ledger))}</p></div></article>`; rendering = false; }
  function injectCss(){ const existing = document.getElementById('compare-narrative-css'); if(existing) existing.remove(); const style = document.createElement('style'); style.id = 'compare-narrative-css'; style.textContent = `#compareResult.compare-article-mode{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.compare-face-card{position:relative;min-height:104px!important;padding:15px 16px!important;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,#23324a,#172033);box-shadow:0 13px 32px rgba(15,23,42,.16);display:flex;align-items:flex-end;justify-content:space-between;gap:12px;color:#f8faff;overflow:hidden}.compare-face-card h3{margin:0;font-size:clamp(22px,4vw,31px);line-height:1.02;color:#f8faff!important;letter-spacing:-.03em}.compare-face-card p{margin:8px 0 0;color:#c7d2e2!important;font-size:15px;line-height:1.25}.compare-face-badge{position:absolute;top:14px;right:14px;border:1px solid rgba(250,204,21,.48);background:rgba(250,204,21,.08);color:#fde68a;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:950;letter-spacing:.04em;white-space:nowrap}.compare-flow-card{grid-column:1/-1;background:linear-gradient(180deg,#23324a,#172033)!important;border-color:#40536f!important;color:#f8faff!important;padding:26px!important;border-radius:24px!important;box-shadow:0 13px 32px rgba(15,23,42,.16)}.compare-flow-card h3{margin:0 0 18px;font-size:clamp(30px,5vw,45px);line-height:1.05;letter-spacing:-.04em;color:#f8faff!important}.compare-flow-card p{margin:0 0 18px;color:#c7d2e2!important;line-height:1.6;font-size:18px}.compare-flow-card p.compare-debate-frame{border-left:5px solid #facc15;background:rgba(250,204,21,.08);border-radius:16px;padding:14px 16px;color:#f8faff!important;font-weight:750}.compare-flow-card p:last-child{margin-bottom:0}.compare-final-take{margin-top:24px;border:1px solid rgba(250,204,21,.42);border-left:7px solid #facc15;border-radius:20px;padding:18px 20px;background:rgba(34,40,42,.82);box-shadow:0 13px 32px rgba(15,23,42,.14)}.compare-final-take p{margin:0!important;color:#f8faff!important;font-size:18px;line-height:1.55}.compare-final-take strong{color:#facc15!important}@media(max-width:900px){#compareResult.compare-article-mode{grid-template-columns:1fr;gap:10px}.compare-face-card{min-height:88px!important;padding:14px!important;border-radius:18px}.compare-face-card h3{font-size:25px}.compare-face-card p{font-size:14px;padding-right:90px}.compare-face-badge{font-size:11px;padding:5px 9px;top:12px;right:12px}.compare-flow-card{padding:22px!important;border-radius:22px!important}.compare-flow-card h3{font-size:31px;margin-bottom:18px}.compare-flow-card p{font-size:17px;line-height:1.58;margin-bottom:18px}.compare-final-take{padding:17px 18px;margin-top:22px}.compare-final-take p{font-size:17px!important}}`; document.head.appendChild(style); }
  function install(){ injectCss(); setTimeout(render, 0); ['fighterA','fighterB'].forEach(id => { const sel = el(id); if(sel && !sel.dataset.compareNarrativeListener){ sel.dataset.compareNarrativeListener = 'true'; sel.addEventListener('change', () => setTimeout(render, 0)); } }); document.querySelectorAll('.tab').forEach(tab => { if(!tab.dataset.compareNarrativeTabListener){ tab.dataset.compareNarrativeTabListener = 'true'; tab.addEventListener('click', () => setTimeout(render, 0)); } }); }
  window.UFC_COMPARE_NARRATIVE_SYSTEM = {version:VERSION, render};
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();