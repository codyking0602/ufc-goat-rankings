(function(){
  'use strict';

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

  const state = {
    pair: null,
    choice: null,
    score: 0,
    rounds: 0,
    seenPairs: new Set(),
    lastNames: new Set(),
    appearances: new Map(),
    genderHistory: [],
    waitingForModel: false
  };

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
  function board(gender){
    const rows = gender === 'women' ? DATA.women : DATA.men;
    return (rows || [])
      .map(fighterFor)
      .filter(fighter => fighter?.fighter && Number.isFinite(rawScoreFor(fighter)) && rankFor(fighter) > 0)
      .sort((a,b) => rankFor(a) - rankFor(b));
  }
  function genderFor(fighter){
    return (DATA.women || []).some(row => key(row.fighter) === key(fighter?.fighter)) ? 'women' : 'men';
  }
  function rankFor(fighter){
    const live = number(liveRow(fighter?.fighter)?.rank, NaN);
    if(Number.isFinite(live) && live > 0) return live;
    const fallback = number(OVERRIDES[fighter?.fighter]?.allTimeRank, NaN);
    return Number.isFinite(fallback) && fallback > 0 ? fallback : 999;
  }
  function rawScoreFor(fighter){
    const row = liveRow(fighter?.fighter) || fighter || {};
    const profile = liveProfile(fighter?.fighter) || {};
    const candidates = [row.totalScore,row.rawScore,profile.totalScore,profile.rawScore];
    const found = candidates.find(value => Number.isFinite(Number(value)));
    return found === undefined ? NaN : Number(found);
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
      Math.abs(categoryValue(a,'apexPeak') - categoryValue(b,'apexPeak')) / 6
    ];
    return components.reduce((sum,value) => sum + Math.min(value,1.5),0);
  }
  function scoreGap(a,b){ return Math.abs(rawScoreFor(a) - rawScoreFor(b)); }

  function chooseGender(){
    const womenAvailable = board('women').length >= 2;
    if(!womenAvailable) return 'men';
    const lastGender = state.genderHistory[state.genderHistory.length - 1];
    const lastWomenIndex = state.genderHistory.lastIndexOf('women');
    const roundsSinceWomen = lastWomenIndex < 0 ? state.genderHistory.length : state.genderHistory.length - 1 - lastWomenIndex;
    if(roundsSinceWomen >= 5) return 'women';
    if(lastGender === 'women') return 'men';
    return Math.random() < 0.18 ? 'women' : 'men';
  }
  function chooseBand(){
    const roll = Math.random();
    if(roll < 0.70) return {name:'close',min:0,max:3,target:1.5};
    if(roll < 0.95) return {name:'stretch',min:3,max:6,target:4.5};
    return {name:'wildcard',min:6,max:9,target:7.5};
  }
  function inBand(gap,band){
    if(band.min === 0) return gap <= band.max;
    return gap > band.min && gap <= band.max;
  }
  function anchorWeight(fighter){
    return 1 / Math.pow(1 + appearanceCount(fighter.fighter),2);
  }
  function candidateWeight(anchor,candidate,band){
    const exposure = 1 / Math.pow(1 + appearanceCount(candidate.fighter),2);
    const contrast = 1 + resumeContrast(anchor,candidate);
    const fit = 1 / (1 + Math.abs(scoreGap(anchor,candidate) - band.target));
    return exposure * contrast * fit;
  }
  function availableAnchors(pool){
    const fresh = pool.filter(fighter => !state.lastNames.has(fighter.fighter));
    return fresh.length ? fresh : pool;
  }
  function candidatePool(anchor,pool,band,ignoreSeenPairs=false){
    return pool.filter(candidate => {
      if(candidate.fighter === anchor.fighter) return false;
      if(state.lastNames.has(candidate.fighter)) return false;
      if(!ignoreSeenPairs && state.seenPairs.has(pairKey(anchor,candidate))) return false;
      return inBand(scoreGap(anchor,candidate),band);
    });
  }
  function nearestCandidates(anchor,pool,ignoreSeenPairs=false){
    const eligible = pool.filter(candidate => {
      if(candidate.fighter === anchor.fighter) return false;
      if(state.lastNames.has(candidate.fighter)) return false;
      return ignoreSeenPairs || !state.seenPairs.has(pairKey(anchor,candidate));
    });
    if(!eligible.length) return [];
    const nearestGap = Math.min(...eligible.map(candidate => scoreGap(anchor,candidate)));
    return eligible.filter(candidate => Math.abs(scoreGap(anchor,candidate) - nearestGap) < 0.001);
  }
  function buildPair(){
    const gender = chooseGender();
    const pool = board(gender);
    if(pool.length < 2) return null;

    const anchors = availableAnchors(pool);
    const band = chooseBand();
    const fallbackBands = [
      band,
      {name:'close',min:0,max:3,target:1.5},
      {name:'stretch',min:3,max:6,target:4.5},
      {name:'wildcard',min:6,max:9,target:7.5}
    ].filter((item,index,array) => array.findIndex(other => other.name === item.name) === index);

    const orderedAnchors = [...anchors].sort((a,b) => appearanceCount(a.fighter) - appearanceCount(b.fighter) || Math.random() - 0.5);
    let anchor = weightedPick(orderedAnchors,anchorWeight);
    let candidates = [];
    let activeBand = band;

    for(const currentBand of fallbackBands){
      candidates = candidatePool(anchor,pool,currentBand,false);
      if(candidates.length){ activeBand = currentBand; break; }
    }

    if(!candidates.length){
      for(const alternate of orderedAnchors){
        for(const currentBand of fallbackBands){
          const possible = candidatePool(alternate,pool,currentBand,false);
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

    if(!candidates.length) candidates = nearestCandidates(anchor,pool,false);
    if(!candidates.length){
      state.seenPairs.clear();
      candidates = nearestCandidates(anchor,pool,true);
    }
    if(!candidates.length) return null;

    const opponent = weightedPick(candidates,candidate => candidateWeight(anchor,candidate,activeBand));
    const pair = Math.random() < 0.5 ? [anchor,opponent] : [opponent,anchor];
    state.seenPairs.add(pairKey(anchor,opponent));
    state.lastNames = new Set([anchor.fighter,opponent.fighter]);
    state.appearances.set(anchor.fighter,appearanceCount(anchor.fighter) + 1);
    state.appearances.set(opponent.fighter,appearanceCount(opponent.fighter) + 1);
    state.genderHistory.push(gender);
    return pair;
  }

  function photoFor(fighter){
    return OVERRIDES[fighter.fighter]?.thumbUrl || OVERRIDES[fighter.fighter]?.photoUrl || '';
  }
  function initials(name){
    return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase();
  }
  function fighterPhoto(fighter,extraClass=''){
    const url = photoFor(fighter);
    return `<div class="play-fighter-photo ${extraClass}">${url
      ? `<img src="${esc(url)}" alt="${esc(fighter.fighter)}">`
      : `<span>${esc(initials(fighter.fighter))}</span>`}</div>`;
  }
  function numberFrom(object,keys){
    for(const name of keys){
      const value = Number(object?.[name]);
      if(Number.isFinite(value)) return value;
    }
    return null;
  }
  function adjustedTitleWins(fighter){
    const exact = numberFrom(fighter.title,['adjustedTitleWins','adjustedTitleWinCredit']);
    if(exact !== null) return exact.toFixed(1);
    const titleWins = numberFrom(fighter.title,['normalTitleWins']);
    return titleWins !== null ? titleWins.toFixed(1) : '—';
  }
  function eliteWins(fighter){
    const direct = numberFrom(fighter,['elitePlusWins','topFiveWins','top5Wins','eliteWins','qualityWins']);
    if(direct !== null) return String(direct).replace(/\.0$/,'');
    const opponents = Array.isArray(fighter.opponents) ? fighter.opponents : [];
    return opponents.length ? String(opponents.length) : '—';
  }
  function primeRecord(fighter){ return DATA.primeRecords?.[fighter.fighter]?.record || fighter.primeRecord || '—'; }
  function roundControl(fighter){
    const direct = numberFrom(fighter,['roundsWonPct','roundsWonPercentage','roundWinPct','roundsWonPercent']);
    if(direct !== null) return `${direct.toFixed(1)}%`;
    const rounds = Array.isArray(fighter.rounds) ? fighter.rounds : [];
    const won = rounds.reduce((sum,row) => sum + number(row.roundsWon),0);
    const total = rounds.reduce((sum,row) => sum + number(row.roundsCounted),0);
    return total ? `${((won / total) * 100).toFixed(1)}%` : '—';
  }
  function lossContext(fighter){
    const penalty = numberFrom(fighter,['penalty','lossPenalty']);
    if(penalty === null || penalty === 0) return 'Clean';
    if(penalty > -3) return 'Light damage';
    if(penalty > -7) return 'Moderate damage';
    return 'Heavy damage';
  }
  function blindStats(fighter){
    const finishRate = numberFrom(fighter,['finishRatePct']);
    const eliteYears = numberFrom(fighter,['activeEliteYears']);
    return [
      ['Adjusted title wins',adjustedTitleWins(fighter)],
      ['Elite wins',eliteWins(fighter)],
      ['Prime UFC record',primeRecord(fighter)],
      ['Rounds won',roundControl(fighter)],
      ['Finish rate',finishRate !== null ? `${finishRate.toFixed(1)}%` : '—'],
      ['Active elite years',eliteYears !== null ? eliteYears.toFixed(1) : '—'],
      ['Loss context',lossContext(fighter)]
    ];
  }
  function modelReady(){
    return window.UFC_SCORING_PIPELINE?.status === 'ready' || document.documentElement.getAttribute('data-scoring-pipeline') === 'ready';
  }
  function updateScoreboard(){
    scoreNode.textContent = `${state.score}-${state.rounds - state.score}`;
    roundNode.textContent = `ROUND ${state.rounds + 1}`;
  }
  function renderLoading(){
    matchup.innerHTML = '<div class="play-empty-mini">Finalizing the live model and building a fair matchup…</div>';
    reveal.hidden = true;
  }
  function renderPair(){
    if(!state.pair) return;
    const [fighterA,fighterB] = state.pair.map(fighter => fighterFor(liveRow(fighter.fighter) || fighter));
    state.pair = [fighterA,fighterB];
    const statsA = blindStats(fighterA);
    const statsB = blindStats(fighterB);
    updateScoreboard();
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
        <div class="blind-pick-row">
          <button class="blind-pick-button blind-pick-a" type="button" data-smart-blind-choice="A">PICK A</button>
          <button class="blind-pick-button blind-pick-b" type="button" data-smart-blind-choice="B">PICK B</button>
        </div>
      </div>`;
    reveal.hidden = true;
    state.choice = null;
  }
  function startRound(){
    if(!modelReady()){
      state.waitingForModel = true;
      renderLoading();
      return;
    }
    state.waitingForModel = false;
    state.pair = buildPair();
    if(!state.pair){
      matchup.innerHTML = '<div class="play-empty-mini">A fair same-gender matchup could not be built from the current live board.</div>';
      return;
    }
    renderPair();
  }
  function rankLabel(fighter){
    return genderFor(fighter) === 'women' ? "Official Women's UFC GOAT rank" : 'Official UFC GOAT rank';
  }
  function revealChoice(choice){
    if(state.choice || !state.pair) return;
    state.choice = choice;
    const [fighterA,fighterB] = state.pair.map(fighter => fighterFor(liveRow(fighter.fighter) || fighter));
    const picked = choice === 'A' ? fighterA : fighterB;
    const rankA = rankFor(fighterA);
    const rankB = rankFor(fighterB);
    const winner = rankA === rankB
      ? (rawScoreFor(fighterA) >= rawScoreFor(fighterB) ? fighterA : fighterB)
      : (rankA < rankB ? fighterA : fighterB);
    const loser = winner.fighter === fighterA.fighter ? fighterB : fighterA;
    const correct = picked.fighter === winner.fighter;
    state.rounds += 1;
    if(correct) state.score += 1;
    scoreNode.textContent = `${state.score}-${state.rounds - state.score}`;

    reveal.hidden = false;
    reveal.innerHTML = `
      <div class="blind-verdict ${correct ? 'correct' : 'miss'}">
        <span>${correct ? 'YOU PICKED THE MODEL WINNER' : 'THE MODEL DISAGREES'}</span>
        <strong>${esc(winner.fighter)} ranks higher</strong>
        <p>${esc(winner.fighter)} is #${rankFor(winner)} on the ${genderFor(winner) === 'women' ? "women's" : "men's"} UFC-only board. ${esc(loser.fighter)} is #${rankFor(loser)}.</p>
      </div>
      <div class="blind-reveal-grid">
        ${[fighterA,fighterB].map((fighter,index) => `<div class="blind-reveal-fighter ${picked.fighter === fighter.fighter ? 'user-pick' : ''} ${winner.fighter === fighter.fighter ? 'model-winner' : ''}">
          ${fighterPhoto(fighter,'reveal')}
          <span>FIGHTER ${index === 0 ? 'A' : 'B'}</span>
          <strong>${esc(fighter.fighter)}</strong>
          <small>${rankLabel(fighter)} #${rankFor(fighter)}</small>
          ${picked.fighter === fighter.fighter ? '<em>YOUR PICK</em>' : ''}
        </div>`).join('')}
      </div>
      <button class="play-primary" type="button" data-smart-blind-next>NEXT BLIND MATCHUP</button>`;
    reveal.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  matchup.addEventListener('click',event => {
    const button = event.target.closest('[data-smart-blind-choice]');
    if(button) revealChoice(button.dataset.smartBlindChoice);
  });
  reveal.addEventListener('click',event => {
    if(event.target.closest('[data-smart-blind-next]')) startRound();
  });
  blindButton.addEventListener('click',() => {
    if(!state.pair || state.choice) startRound();
    else renderPair();
  });
  window.addEventListener('ufc-scoring-pipeline-ready',() => {
    if(state.waitingForModel || (!state.choice && state.pair)) startRound();
  });
  window.addEventListener('ufc-division-era-depth-finalized',() => {
    if(state.waitingForModel || (!state.choice && state.pair)) startRound();
  });

  window.UFC_BLIND_MATCHMAKING = {
    version:'blind-matchmaking-20260712a-full-roster-raw-score',
    mode:'full-roster-same-gender-raw-score',
    scoreBands:{close:'0-3',stretch:'3-6',wildcard:'6-9'},
    womenTargetRate:0.18,
    state
  };
})();
