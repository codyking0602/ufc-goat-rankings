(function(){
  'use strict';

  const VERSION = 'blind-matchmaking-20260713b-five-round-watch-moments';
  const TOTAL_ROUNDS = 5;
  const APEX_MAX = 6;
  const DATA = window.RANKING_DATA || {};
  const OVERRIDES = window.DISPLAY_OVERRIDES || {};
  const blindButton = document.querySelector('[data-play-mode="blind"]');
  const oldMatchup = document.getElementById('blindMatchup');
  const oldReveal = document.getElementById('blindReveal');
  const scoreNode = document.getElementById('blindScore');
  const roundNode = document.getElementById('blindRound');
  if(!blindButton || !oldMatchup || !oldReveal || !scoreNode || !roundNode) return;

  const matchup = oldMatchup.cloneNode(false);
  const reveal = oldReveal.cloneNode(false);
  oldMatchup.replaceWith(matchup);
  oldReveal.replaceWith(reveal);

  const headerCopy = document.querySelector('#playBlindPanel .blind-header p');
  if(headerCopy) headerCopy.textContent = 'Pick the better UFC-only resume without seeing the names. Five close matchups. One final score.';

  const state = {
    pair: null,
    choice: null,
    currentResult: null,
    score: 0,
    rounds: 0,
    history: [],
    seenPairs: new Set(),
    usedNames: new Set(),
    lastNames: new Set(),
    appearances: new Map(),
    genderHistory: [],
    waitingForModel: false,
    finalVisible: false
  };

  function injectCss(){
    if(document.getElementById('blind-five-round-css')) return;
    const style = document.createElement('style');
    style.id = 'blind-five-round-css';
    style.textContent = `
      #play .blind-apex-note{padding:8px 12px 10px;border-bottom:1px solid #334155;color:#94a3b8;font-size:10px;line-height:1.3;text-align:center;letter-spacing:.03em;text-transform:uppercase}
      #play .blind-final-card{display:grid;gap:12px}
      #play .blind-final-hero{border:1px solid rgba(250,204,21,.5);border-radius:18px;background:linear-gradient(145deg,rgba(250,204,21,.12),rgba(249,115,22,.08));padding:20px 14px;text-align:center}
      #play .blind-final-hero>span{display:block;color:#facc15;font-size:11px;font-weight:950;letter-spacing:.12em}
      #play .blind-final-score{display:block;color:#f8fafc;font-size:66px;line-height:.95;margin:10px 0 6px;font-weight:950}
      #play .blind-final-hero h3{margin:0;color:#f8fafc;font-size:25px}
      #play .blind-final-hero p{max-width:620px;margin:8px auto 0;color:#cbd5e1;font-size:13px;line-height:1.4}
      #play .blind-final-recap{display:grid;gap:9px}
      #play .blind-final-round{border:1px solid #526786;border-radius:16px;background:#101725;padding:11px}
      #play .blind-final-round-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
      #play .blind-final-round-head span{color:#94a3b8;font-size:10px;font-weight:900;letter-spacing:.08em}
      #play .blind-final-round-head strong{border-radius:999px;padding:5px 8px;font-size:10px;letter-spacing:.04em}
      #play .blind-final-round-head strong.correct{background:rgba(34,197,94,.14);color:#86efac}
      #play .blind-final-round-head strong.miss{background:rgba(249,115,22,.16);color:#fdba74}
      #play .blind-final-fighters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      #play .blind-final-fighter{display:grid;grid-template-columns:48px minmax(0,1fr);gap:9px;align-items:center;border:1px solid #334155;border-radius:13px;padding:8px;background:#0f1624;min-width:0}
      #play .blind-final-fighter.model-winner{border-color:rgba(250,204,21,.58)}
      #play .blind-final-fighter .play-fighter-photo{width:48px;height:48px;border-radius:12px;margin:0}
      #play .blind-final-fighter-copy{min-width:0}
      #play .blind-final-fighter-copy>b,#play .blind-final-fighter-copy>small{display:block}
      #play .blind-final-fighter-copy>b{color:#f8fafc;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #play .blind-final-fighter-copy>small{color:#94a3b8;font-size:10px;margin-top:2px;line-height:1.25}
      #play .blind-final-badges{display:flex;gap:4px;flex-wrap:wrap;margin-top:5px}
      #play .blind-final-badge{border-radius:999px;padding:3px 6px;background:#26364e;color:#cbd5e1;font-size:8px;font-weight:950;letter-spacing:.03em}
      #play .blind-final-badge.winner{background:rgba(250,204,21,.16);color:#fde68a}
      #play .blind-final-badge.pick{background:rgba(249,115,22,.18);color:#fdba74}
      #play .blind-watch-moment{display:inline-flex;align-items:center;justify-content:center;margin-top:7px;border:1px solid rgba(248,113,113,.38);background:rgba(248,113,113,.1);color:#fecaca;border-radius:999px;padding:5px 8px;font-size:9px;font-weight:950;letter-spacing:.03em;text-decoration:none;text-transform:uppercase}
      #play .blind-watch-moment:hover{border-color:rgba(248,113,113,.75);color:#fff}
      #play .blind-final-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      #play .blind-final-actions .play-primary,#play .blind-final-actions .play-secondary{width:100%}
      @media (max-width:620px){
        #play .blind-final-score{font-size:58px}
        #play .blind-final-fighter{grid-template-columns:42px minmax(0,1fr);gap:7px;padding:7px}
        #play .blind-final-fighter .play-fighter-photo{width:42px;height:42px}
        #play .blind-final-fighter-copy>b{font-size:12px}
        #play .blind-final-fighter-copy>small{font-size:9px}
        #play .blind-watch-moment{font-size:8px;padding:5px 6px}
      }
    `;
    document.head.appendChild(style);
  }

  function esc(value){
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[char]));
  }
  function key(value){ return String(value || '').trim().toLowerCase(); }
  function number(value,fallback=0){
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  function clamp(value,min,max){ return Math.max(min,Math.min(max,value)); }
  function numberFrom(object,keys){
    if(!object) return null;
    for(const name of keys){
      const value = Number(object[name]);
      if(Number.isFinite(value)) return value;
    }
    return null;
  }
  function formatCount(value){
    if(value === null || !Number.isFinite(Number(value))) return '—';
    const num = Number(value);
    return Number.isInteger(num) ? String(num) : num.toFixed(1).replace(/\.0$/,'');
  }

  function liveRow(name){
    const target = key(name);
    return [...(DATA.men || []), ...(DATA.women || [])].find(row => key(row?.fighter) === target) || null;
  }
  function liveProfile(name){
    const target = key(name);
    return (DATA.fighters || []).find(row => key(row?.fighter) === target) || null;
  }
  function fighterFor(row){
    return { ...(liveProfile(row?.fighter) || {}), ...(row || {}) };
  }
  function genderFor(fighter){
    return (DATA.women || []).some(row => key(row.fighter) === key(fighter?.fighter)) ? 'women' : 'men';
  }
  function rankFor(fighter){
    const live = number(liveRow(fighter?.fighter)?.rank,NaN);
    if(Number.isFinite(live) && live > 0) return live;
    const fallback = number(OVERRIDES[fighter?.fighter]?.allTimeRank,NaN);
    return Number.isFinite(fallback) && fallback > 0 ? fallback : 999;
  }
  function rawScoreFor(fighter){
    const row = liveRow(fighter?.fighter) || fighter || {};
    const profile = liveProfile(fighter?.fighter) || {};
    const candidates = [row.totalScore,row.rawScore,profile.totalScore,profile.rawScore];
    const found = candidates.find(value => Number.isFinite(Number(value)));
    return found === undefined ? NaN : Number(found);
  }
  function board(gender){
    const rows = gender === 'women' ? DATA.women : DATA.men;
    return (rows || [])
      .map(fighterFor)
      .filter(fighter => fighter?.fighter && Number.isFinite(rawScoreFor(fighter)) && rankFor(fighter) > 0)
      .sort((a,b) => rankFor(a) - rankFor(b));
  }
  function modelReady(){
    return window.UFC_SCORING_PIPELINE?.status === 'ready' || document.documentElement.getAttribute('data-scoring-pipeline') === 'ready';
  }

  function pairKey(a,b){ return [a.fighter,b.fighter].sort().join('|'); }
  function appearanceCount(name){ return state.appearances.get(name) || 0; }
  function weightedPick(items,weightFor){
    if(!items.length) return null;
    const weighted = items.map(item => ({item,weight:Math.max(0.0001,number(weightFor(item),0.0001))}));
    const total = weighted.reduce((sum,row) => sum + row.weight,0);
    let cursor = Math.random() * total;
    for(const row of weighted){
      cursor -= row.weight;
      if(cursor <= 0) return row.item;
    }
    return weighted[weighted.length - 1].item;
  }
  function categoryValue(fighter,name){ return number(fighter?.[name],0); }
  function resumeContrast(a,b){
    const components = [
      Math.abs(categoryValue(a,'championship') - categoryValue(b,'championship')) / 30,
      Math.abs(categoryValue(a,'opponentQuality') - categoryValue(b,'opponentQuality')) / 30,
      Math.abs(categoryValue(a,'primeDominance') - categoryValue(b,'primeDominance')) / 30,
      Math.abs(categoryValue(a,'longevity') - categoryValue(b,'longevity')) / 30,
      Math.abs(categoryValue(a,'penalty') - categoryValue(b,'penalty')) / 10,
      Math.abs(categoryValue(a,'apexPeak') - categoryValue(b,'apexPeak')) / APEX_MAX
    ];
    return components.reduce((sum,value) => sum + Math.min(value,1.5),0);
  }
  function scoreGap(a,b){ return Math.abs(rawScoreFor(a) - rawScoreFor(b)); }
  function chooseGender(){
    const womenAvailable = board('women').length >= 2;
    if(!womenAvailable) return 'men';
    const womenRounds = state.genderHistory.filter(value => value === 'women').length;
    if(womenRounds >= 1) return 'men';
    if(state.rounds === TOTAL_ROUNDS - 1 && womenRounds === 0 && Math.random() < 0.35) return 'women';
    return Math.random() < 0.18 ? 'women' : 'men';
  }
  function chooseBand(){
    const roll = Math.random();
    if(roll < 0.72) return {name:'close',min:0,max:3,target:1.5};
    if(roll < 0.96) return {name:'stretch',min:3,max:6,target:4.5};
    return {name:'wildcard',min:6,max:9,target:7.5};
  }
  function inBand(gap,band){ return band.min === 0 ? gap <= band.max : gap > band.min && gap <= band.max; }
  function anchorWeight(fighter){ return 1 / Math.pow(1 + appearanceCount(fighter.fighter),2); }
  function candidateWeight(anchor,candidate,band){
    const exposure = 1 / Math.pow(1 + appearanceCount(candidate.fighter),2);
    const contrast = 1 + resumeContrast(anchor,candidate);
    const fit = 1 / (1 + Math.abs(scoreGap(anchor,candidate) - band.target));
    return exposure * contrast * fit;
  }
  function availableAnchors(pool,allowUsed=false){
    const unused = allowUsed ? pool : pool.filter(fighter => !state.usedNames.has(fighter.fighter));
    const fresh = unused.filter(fighter => !state.lastNames.has(fighter.fighter));
    return fresh.length ? fresh : unused;
  }
  function candidatePool(anchor,pool,band,options={}){
    return pool.filter(candidate => {
      if(candidate.fighter === anchor.fighter) return false;
      if(state.lastNames.has(candidate.fighter)) return false;
      if(!options.allowUsed && state.usedNames.has(candidate.fighter)) return false;
      if(!options.ignoreSeen && state.seenPairs.has(pairKey(anchor,candidate))) return false;
      return inBand(scoreGap(anchor,candidate),band);
    });
  }
  function nearestCandidates(anchor,pool,options={}){
    const eligible = pool.filter(candidate => {
      if(candidate.fighter === anchor.fighter) return false;
      if(state.lastNames.has(candidate.fighter)) return false;
      if(!options.allowUsed && state.usedNames.has(candidate.fighter)) return false;
      return options.ignoreSeen || !state.seenPairs.has(pairKey(anchor,candidate));
    });
    if(!eligible.length) return [];
    const nearestGap = Math.min(...eligible.map(candidate => scoreGap(anchor,candidate)));
    return eligible.filter(candidate => Math.abs(scoreGap(anchor,candidate) - nearestGap) < 0.001);
  }
  function buildPair(){
    const gender = chooseGender();
    const pool = board(gender);
    if(pool.length < 2) return null;
    const band = chooseBand();
    const fallbackBands = [
      band,
      {name:'close',min:0,max:3,target:1.5},
      {name:'stretch',min:3,max:6,target:4.5},
      {name:'wildcard',min:6,max:9,target:7.5}
    ].filter((item,index,array) => array.findIndex(other => other.name === item.name) === index);

    let anchors = availableAnchors(pool,false);
    if(!anchors.length) anchors = availableAnchors(pool,true);
    const orderedAnchors = [...anchors].sort((a,b) => appearanceCount(a.fighter) - appearanceCount(b.fighter) || Math.random() - 0.5);
    let anchor = weightedPick(orderedAnchors,anchorWeight);
    let candidates = [];
    let activeBand = band;

    for(const currentBand of fallbackBands){
      candidates = candidatePool(anchor,pool,currentBand,{allowUsed:false,ignoreSeen:false});
      if(candidates.length){ activeBand = currentBand; break; }
    }
    if(!candidates.length){
      for(const alternate of orderedAnchors){
        for(const currentBand of fallbackBands){
          const possible = candidatePool(alternate,pool,currentBand,{allowUsed:false,ignoreSeen:false});
          if(possible.length){
            anchor = alternate;
            candidates = possible;
            activeBand = currentBand;
            break;
          }
        }
        if(candidates.length) break;
      }
    }
    if(!candidates.length) candidates = nearestCandidates(anchor,pool,{allowUsed:false,ignoreSeen:false});
    if(!candidates.length) candidates = nearestCandidates(anchor,pool,{allowUsed:true,ignoreSeen:false});
    if(!candidates.length){
      state.seenPairs.clear();
      candidates = nearestCandidates(anchor,pool,{allowUsed:true,ignoreSeen:true});
    }
    if(!candidates.length) return null;

    const opponent = weightedPick(candidates,candidate => candidateWeight(anchor,candidate,activeBand));
    const pair = Math.random() < 0.5 ? [anchor,opponent] : [opponent,anchor];
    state.seenPairs.add(pairKey(anchor,opponent));
    state.usedNames.add(anchor.fighter);
    state.usedNames.add(opponent.fighter);
    state.lastNames = new Set([anchor.fighter,opponent.fighter]);
    state.appearances.set(anchor.fighter,appearanceCount(anchor.fighter) + 1);
    state.appearances.set(opponent.fighter,appearanceCount(opponent.fighter) + 1);
    state.genderHistory.push(gender);
    return pair;
  }

  function photoFor(fighter){ return OVERRIDES[fighter.fighter]?.thumbUrl || OVERRIDES[fighter.fighter]?.photoUrl || ''; }
  function initials(name){ return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase(); }
  function fighterPhoto(fighter,extraClass=''){
    const url = photoFor(fighter);
    return `<div class="play-fighter-photo ${extraClass}">${url
      ? `<img src="${esc(url)}" alt="${esc(fighter.fighter)}">`
      : `<span>${esc(initials(fighter.fighter))}</span>`}</div>`;
  }
  function titleFightWins(fighter){
    const name = fighter?.fighter;
    const override = OVERRIDES[name] || {};
    const compareStats = window.COMPARE_PROFILES?.[name]?.legacyStats || {};
    const directSources = [
      fighter?.title,
      fighter?.championshipResumeAudit,
      fighter,
      override.snapshotStats,
      override.packetProfileStats,
      compareStats
    ];
    for(const source of directSources){
      const direct = numberFrom(source,['titleFightWins','ufcTitleFightWins']);
      if(direct !== null) return formatCount(direct);
    }
    const title = fighter?.title || {};
    const titleParts = ['normalTitleWins','interimTitleWins','vacantUndisputedWins'];
    const present = titleParts.filter(name => Number.isFinite(Number(title[name])));
    if(present.length) return formatCount(present.reduce((sum,name) => sum + Number(title[name]),0));
    const notes = String(title.notes || fighter?.notes || '');
    const match = notes.match(/(?:total\s+)?title[- ]fight wins\s*(?:=|:)\s*([0-9.]+)/i);
    return match ? formatCount(Number(match[1])) : '—';
  }
  function topFiveWins(fighter){
    const name = fighter?.fighter;
    const override = OVERRIDES[name] || {};
    const compareStats = window.COMPARE_PROFILES?.[name]?.legacyStats || {};
    const sources = [
      fighter,
      fighter?.opponentQualityAudit,
      fighter?.opponentQualityLiveAudit,
      override.snapshotStats,
      override.packetProfileStats,
      compareStats
    ];
    for(const source of sources){
      const direct = numberFrom(source,['topFiveWins','top5Wins']);
      if(direct !== null) return formatCount(direct);
    }
    const opponents = Array.isArray(fighter?.opponents) ? fighter.opponents : [];
    const count = opponents.filter(row => /top[\s-]?(?:5|five)/i.test(`${row?.type || ''} ${row?.context || ''}`)).length;
    return count ? String(count) : '—';
  }
  function primeRecord(fighter){ return DATA.primeRecords?.[fighter.fighter]?.record || fighter.primeRecord || '—'; }
  function apexRating(fighter){
    const score = numberFrom(fighter,['apexPeak']) ?? numberFrom(fighter?.apexPeakAudit,['score','total']);
    if(score === null) return '—';
    return String(clamp(Math.round(55 + (score / APEX_MAX) * 44),55,99));
  }
  function roundControl(fighter){
    const direct = numberFrom(fighter,['roundsWonPct','roundsWonPercentage','roundWinPct','roundsWonPercent']);
    if(direct !== null) return `${direct.toFixed(1)}%`;
    const rounds = Array.isArray(fighter.rounds) ? fighter.rounds : [];
    const won = rounds.reduce((sum,row) => sum + number(row.roundsWon),0);
    const total = rounds.reduce((sum,row) => sum + number(row.roundsCounted),0);
    return total ? `${((won / total) * 100).toFixed(1)}%` : '—';
  }
  function blindStats(fighter){
    const finishRate = numberFrom(fighter,['finishRatePct']);
    const eliteYears = numberFrom(fighter,['activeEliteYears']);
    return [
      ['UFC title-fight wins',titleFightWins(fighter)],
      ['Top-5 wins',topFiveWins(fighter)],
      ['Prime UFC record',primeRecord(fighter)],
      ['Apex rating',apexRating(fighter)],
      ['Rounds won',roundControl(fighter)],
      ['Finish rate',finishRate !== null ? `${finishRate.toFixed(1)}%` : '—'],
      ['Active elite years',eliteYears !== null ? eliteYears.toFixed(1) : '—']
    ];
  }
  function watchUrlFor(name){ return OVERRIDES[name]?.watchUrl || ''; }
  function rankLabel(fighter){ return genderFor(fighter) === 'women' ? "Official Women's UFC GOAT rank" : 'Official UFC GOAT rank'; }

  function updateScoreboard(){
    scoreNode.textContent = `${state.score}-${state.rounds - state.score}`;
    roundNode.textContent = `ROUND ${Math.min(state.rounds + 1,TOTAL_ROUNDS)} OF ${TOTAL_ROUNDS}`;
  }
  function renderLoading(){
    matchup.hidden = false;
    matchup.innerHTML = '<div class="play-empty-mini">Finalizing the live model and building a fair matchup…</div>';
    reveal.hidden = true;
  }
  function renderPair(){
    if(!state.pair) return;
    const [fighterA,fighterB] = state.pair.map(fighter => fighterFor(liveRow(fighter.fighter) || fighter));
    state.pair = [fighterA,fighterB];
    state.choice = null;
    state.currentResult = null;
    state.finalVisible = false;
    const statsA = blindStats(fighterA);
    const statsB = blindStats(fighterB);
    updateScoreboard();
    matchup.hidden = false;
    matchup.innerHTML = `
      <div class="blind-comparison-card">
        <div class="blind-compare-head">
          <div class="blind-identity blind-a"><span>FIGHTER A</span><div class="blind-silhouette">?</div></div>
          <div class="blind-resume-label">RESUME</div>
          <div class="blind-identity blind-b"><span>FIGHTER B</span><div class="blind-silhouette">?</div></div>
        </div>
        <div class="blind-compare-rows">
          ${statsA.map(([label,value],index) => `<div class="blind-compare-row"><strong>${esc(value)}</strong><span>${esc(label)}</span><strong>${esc(statsB[index][1])}</strong></div>`).join('')}
        </div>
        <div class="blind-apex-note">Apex rating measures the fighter's best one-night or short-stretch peak.</div>
        <div class="blind-pick-row">
          <button class="blind-pick-button blind-pick-a" type="button" data-five-round-choice="A">PICK A</button>
          <button class="blind-pick-button blind-pick-b" type="button" data-five-round-choice="B">PICK B</button>
        </div>
      </div>`;
    reveal.hidden = true;
  }
  function startRound(){
    if(state.rounds >= TOTAL_ROUNDS){
      renderFinal();
      return;
    }
    if(!modelReady()){
      state.waitingForModel = true;
      renderLoading();
      return;
    }
    state.waitingForModel = false;
    state.pair = buildPair();
    if(!state.pair){
      matchup.hidden = false;
      matchup.innerHTML = '<div class="play-empty-mini">A fair same-gender matchup could not be built from the current live board.</div>';
      reveal.hidden = true;
      return;
    }
    renderPair();
  }
  function resultForChoice(choice){
    const [fighterA,fighterB] = state.pair.map(fighter => fighterFor(liveRow(fighter.fighter) || fighter));
    const picked = choice === 'A' ? fighterA : fighterB;
    const rankA = rankFor(fighterA);
    const rankB = rankFor(fighterB);
    const winner = rankA === rankB
      ? (rawScoreFor(fighterA) >= rawScoreFor(fighterB) ? fighterA : fighterB)
      : (rankA < rankB ? fighterA : fighterB);
    const loser = winner.fighter === fighterA.fighter ? fighterB : fighterA;
    return {
      round:state.rounds + 1,
      fighterA:fighterA.fighter,
      fighterB:fighterB.fighter,
      rankA,
      rankB,
      gender:genderFor(fighterA),
      picked:picked.fighter,
      winner:winner.fighter,
      loser:loser.fighter,
      correct:picked.fighter === winner.fighter,
      rankGap:Math.abs(rankFor(winner) - rankFor(loser))
    };
  }
  function renderRoundReveal(result){
    const fighterA = fighterFor(liveRow(result.fighterA) || {fighter:result.fighterA});
    const fighterB = fighterFor(liveRow(result.fighterB) || {fighter:result.fighterB});
    const winner = result.winner === fighterA.fighter ? fighterA : fighterB;
    const loser = result.loser === fighterA.fighter ? fighterA : fighterB;
    const finalRound = state.rounds >= TOTAL_ROUNDS;
    updateScoreboard();
    reveal.hidden = false;
    reveal.innerHTML = `
      <div class="blind-verdict ${result.correct ? 'correct' : 'miss'}">
        <span>${result.correct ? 'YOU PICKED THE MODEL WINNER' : 'THE MODEL DISAGREES'}</span>
        <strong>${esc(winner.fighter)} ranks higher</strong>
        <p>${esc(winner.fighter)} is #${rankFor(winner)} on the ${result.gender === 'women' ? "women's" : "men's"} UFC-only board. ${esc(loser.fighter)} is #${rankFor(loser)}.</p>
      </div>
      <div class="blind-reveal-grid">
        ${[fighterA,fighterB].map((fighter,index) => `<div class="blind-reveal-fighter ${result.picked === fighter.fighter ? 'user-pick' : ''} ${result.winner === fighter.fighter ? 'model-winner' : ''}">
          ${fighterPhoto(fighter,'reveal')}
          <span>FIGHTER ${index === 0 ? 'A' : 'B'}</span>
          <strong>${esc(fighter.fighter)}</strong>
          <small>${rankLabel(fighter)} #${rankFor(fighter)}</small>
          ${result.picked === fighter.fighter ? '<em>YOUR PICK</em>' : ''}
        </div>`).join('')}
      </div>
      <button class="play-primary" type="button" data-five-round-next>${finalRound ? 'SEE FINAL SCORE' : 'NEXT ROUND'}</button>`;
    reveal.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function revealChoice(choice){
    if(state.choice || !state.pair || state.rounds >= TOTAL_ROUNDS) return;
    state.choice = choice;
    const result = resultForChoice(choice);
    state.currentResult = result;
    state.history.push(result);
    state.rounds = state.history.length;
    if(result.correct) state.score += 1;
    renderRoundReveal(result);
  }

  function scoreTier(score){
    if(score === 5) return 'GOAT Scholar';
    if(score === 4) return 'Elite Eye';
    if(score === 3) return 'Contender';
    if(score === 2) return 'Casual Allegations';
    return 'Dana Needs to See You';
  }
  function biggestMiss(){
    return [...state.history].filter(result => !result.correct).sort((a,b) => b.rankGap - a.rankGap)[0] || null;
  }
  function finalSummary(){
    const miss = biggestMiss();
    if(!miss) return 'Perfect card. You matched the model on every close call.';
    return `Biggest miss: you took ${miss.picked} over ${miss.winner}.`;
  }
  function finalFighterCard(name,rank,result){
    const fighter = fighterFor(liveRow(name) || {fighter:name});
    const url = watchUrlFor(name);
    const winner = result.winner === name;
    const picked = result.picked === name;
    return `<div class="blind-final-fighter ${winner ? 'model-winner' : ''}">
      ${fighterPhoto(fighter)}
      <div class="blind-final-fighter-copy">
        <b>${esc(name)}</b>
        <small>${result.gender === 'women' ? "Women's" : "Men's"} UFC GOAT #${rank}</small>
        <div class="blind-final-badges">
          ${winner ? '<span class="blind-final-badge winner">MODEL WINNER</span>' : ''}
          ${picked ? '<span class="blind-final-badge pick">YOUR PICK</span>' : ''}
        </div>
        ${url ? `<a class="blind-watch-moment" href="${esc(url)}" target="_blank" rel="noopener noreferrer">▶ Watch Moment</a>` : ''}
      </div>
    </div>`;
  }
  function renderFinal(){
    state.finalVisible = true;
    state.currentResult = null;
    matchup.hidden = true;
    roundNode.textContent = 'FINAL SCORE';
    scoreNode.textContent = `${state.score}/${TOTAL_ROUNDS}`;
    reveal.hidden = false;
    reveal.innerHTML = `
      <div class="blind-final-card">
        <div class="blind-final-hero">
          <span>FIVE-ROUND RESULTS</span>
          <strong class="blind-final-score">${state.score}/${TOTAL_ROUNDS}</strong>
          <h3>${esc(scoreTier(state.score))}</h3>
          <p>${esc(finalSummary())}</p>
        </div>
        <div class="blind-final-recap">
          ${state.history.map(result => `<article class="blind-final-round">
            <div class="blind-final-round-head"><span>ROUND ${result.round}</span><strong class="${result.correct ? 'correct' : 'miss'}">${result.correct ? 'CORRECT' : 'MISS'}</strong></div>
            <div class="blind-final-fighters">
              ${finalFighterCard(result.fighterA,result.rankA,result)}
              ${finalFighterCard(result.fighterB,result.rankB,result)}
            </div>
          </article>`).join('')}
        </div>
        <div class="blind-final-actions">
          <button class="play-primary" type="button" data-five-round-replay>PLAY AGAIN</button>
          <button class="play-secondary" type="button" data-five-round-share>SHARE MY SCORE</button>
        </div>
      </div>`;
    reveal.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function shareText(){
    const miss = biggestMiss();
    const lines = state.history.map(result => `Round ${result.round}: ${result.correct ? 'Correct' : 'Miss'} — ${result.winner} over ${result.loser}`);
    return `I scored ${state.score}/${TOTAL_ROUNDS} in Blind Resume — ${scoreTier(state.score)}.\n\n${lines.join('\n')}${miss ? `\n\nBiggest miss: I took ${miss.picked} over ${miss.winner}.` : '\n\nPerfect card.'}\n\nUFC All-Time Rankings`;
  }
  async function shareResults(button){
    const original = button.textContent;
    try {
      if(navigator.share){
        await navigator.share({title:'My Blind Resume Score',text:shareText()});
      } else {
        await navigator.clipboard.writeText(shareText());
        button.textContent = 'COPIED';
        setTimeout(() => { button.textContent = original; },1300);
        return;
      }
    } catch(error){
      if(error?.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(shareText());
        button.textContent = 'COPIED';
      } catch(_copyError){
        button.textContent = 'SHARE FAILED';
      }
      setTimeout(() => { button.textContent = original; },1300);
    }
  }
  function resetGame(){
    state.pair = null;
    state.choice = null;
    state.currentResult = null;
    state.score = 0;
    state.rounds = 0;
    state.history = [];
    state.seenPairs = new Set();
    state.usedNames = new Set();
    state.lastNames = new Set();
    state.appearances = new Map();
    state.genderHistory = [];
    state.waitingForModel = false;
    state.finalVisible = false;
    matchup.hidden = false;
    reveal.hidden = true;
    startRound();
  }
  function renderCurrentState(){
    if(state.finalVisible){ renderFinal(); return; }
    if(state.currentResult && state.choice){ renderRoundReveal(state.currentResult); return; }
    if(state.pair){ renderPair(); return; }
    startRound();
  }

  matchup.addEventListener('click',event => {
    const button = event.target.closest('[data-five-round-choice]');
    if(button) revealChoice(button.dataset.fiveRoundChoice);
  });
  reveal.addEventListener('click',event => {
    const link = event.target.closest('.blind-watch-moment');
    if(link) return;
    if(event.target.closest('[data-five-round-next]')){
      if(state.rounds >= TOTAL_ROUNDS) renderFinal();
      else startRound();
      return;
    }
    if(event.target.closest('[data-five-round-replay]')){
      resetGame();
      return;
    }
    const share = event.target.closest('[data-five-round-share]');
    if(share) shareResults(share);
  });
  blindButton.addEventListener('click',() => window.setTimeout(renderCurrentState,0));
  window.addEventListener('ufc-scoring-pipeline-ready',() => {
    if(state.waitingForModel) startRound();
    else if(!document.getElementById('playBlindPanel')?.hidden) renderCurrentState();
  });
  window.addEventListener('ufc-division-era-depth-finalized',() => {
    if(state.waitingForModel) startRound();
    else if(!document.getElementById('playBlindPanel')?.hidden) renderCurrentState();
  });
  window.setTimeout(() => {
    if(!document.getElementById('playBlindPanel')?.hidden) renderCurrentState();
  },1550);

  injectCss();
  updateScoreboard();
  window.UFC_BLIND_MATCHMAKING = {
    version:VERSION,
    mode:'five-round-full-roster-same-gender-raw-score',
    totalRounds:TOTAL_ROUNDS,
    scoreBands:{close:'0-3',stretch:'3-6',wildcard:'6-9'},
    womenTargetRate:0.18,
    stats:['UFC title-fight wins','Top-5 wins','Prime UFC record','Apex rating','Rounds won','Finish rate','Active elite years'],
    watchLinkType:'Watch Moment',
    state
  };
  document.documentElement.setAttribute('data-blind-game',VERSION);
})();
