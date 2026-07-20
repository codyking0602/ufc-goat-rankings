(function(){
  'use strict';

  const STORAGE_KEY = 'ufc-goat-play-top10-v1';
  const DATA = window.RANKING_DATA || {};
  const OVERRIDES = window.DISPLAY_OVERRIDES || {};
  const panel = document.getElementById('play');
  if(!panel || !Array.isArray(DATA.men)) return;

  if(window.__UFC_PLAY_STARTED__)return;
  window.__UFC_PLAY_STARTED__=true;

  const state = {
    mode: 'top10',
    top10: loadTop10(),
    query: '',
    blindPair: null,
    blindChoice: null,
    blindScore: 0,
    blindRounds: 0,
    lastPairKey: ''
  };

  function $(id){ return document.getElementById(id); }
  function esc(value){
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[char]));
  }
  function clamp(value,min,max){ return Math.max(min, Math.min(max, value)); }
  function key(value){ return String(value || '').trim().toLowerCase(); }

  function liveRow(name){
    const target = key(name);
    return [...(DATA.men || []), ...(DATA.women || [])].find(row => key(row?.fighter) === target) || null;
  }
  function liveProfile(name){
    const target = key(name);
    return (DATA.fighters || []).find(row => key(row?.fighter) === target) || null;
  }
  function liveFighter(name){
    return { ...(liveProfile(name) || {}), ...(liveRow(name) || {}), fighter:name };
  }
  function liveMenBoard(){
    return (DATA.men || [])
      .map(row => liveFighter(row.fighter))
      .filter(fighter => fighter?.fighter)
      .sort((a,b) => rankFor(a.fighter) - rankFor(b.fighter) || a.fighter.localeCompare(b.fighter));
  }
  function rankFor(name){
    const live = Number(liveRow(name)?.rank);
    if(Number.isFinite(live) && live > 0) return live;
    const override = Number(OVERRIDES[name]?.allTimeRank);
    if(Number.isFinite(override) && override > 0) return override;
    return 999;
  }
  function photoFor(fighter){
    return OVERRIDES[fighter.fighter]?.thumbUrl || OVERRIDES[fighter.fighter]?.photoUrl || '';
  }
  function initials(name){
    return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase();
  }
  function fighterPhoto(fighter, extraClass=''){
    const url = photoFor(fighter);
    return `<div class="play-fighter-photo ${extraClass}">${url
      ? `<img src="${esc(url)}" alt="${esc(fighter.fighter)}">`
      : `<span>${esc(initials(fighter.fighter))}</span>`}</div>`;
  }
  function fighterMeta(fighter){
    const parts = [fighter.primaryDivision, fighter.ufcRecord].filter(Boolean);
    return parts.join(' · ') || 'UFC resume';
  }

  function saveTop10(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.top10)); }
    catch(_error){}
  }
  function loadTop10(){
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if(!Array.isArray(saved)) return [];
      const names = new Set((DATA.men || []).map(row => row.fighter));
      return saved.filter(name => typeof name === 'string' && names.has(name)).slice(0,10);
    } catch(_error){ return []; }
  }

  function setMode(mode){
    state.mode = mode;
    document.querySelectorAll('[data-play-mode]').forEach(button => {
      const active = button.dataset.playMode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $('playTop10Panel').hidden = mode !== 'top10';
    $('playBlindPanel').hidden = mode !== 'blind';
    if(mode === 'blind' && !window.UFC_BLIND_MATCHMAKING && !state.blindPair) nextBlindRound();
  }

  function renderSearchResults(){
    const target = $('playFighterResults');
    if(!target) return;
    const query = state.query.trim().toLowerCase();
    const selected = new Set(state.top10);
    const matches = liveMenBoard()
      .filter(fighter => !selected.has(fighter.fighter))
      .filter(fighter => !query || fighter.fighter.toLowerCase().includes(query))
      .slice(0, query ? 12 : 8);

    target.innerHTML = matches.length ? matches.map(fighter => `
      <button class="play-search-result" type="button" data-add-fighter="${esc(fighter.fighter)}" ${state.top10.length >= 10 ? 'disabled' : ''}>
        ${fighterPhoto(fighter, 'small')}
        <span><strong>${esc(fighter.fighter)}</strong><small>${esc(fighterMeta(fighter))}</small></span>
        <b>ADD</b>
      </button>`).join('') : `<div class="play-empty-mini">${state.top10.length >= 10 ? 'Your Top 10 is full.' : 'No fighters match that search.'}</div>`;
  }

  function moveFighter(from,to){
    if(from < 0 || to < 0 || from >= state.top10.length || to >= state.top10.length || from === to) return;
    const [fighter] = state.top10.splice(from,1);
    state.top10.splice(to,0,fighter);
    saveTop10();
    renderTop10();
  }

  function renderTop10(){
    const list = $('playTop10List');
    if(!list) return;
    const count = state.top10.length;
    $('playTop10Count').textContent = `${count}/10 selected`;
    $('playTop10ProgressFill').style.width = `${count * 10}%`;
    $('playCompareBtn').disabled = count !== 10;
    $('playShareBtn').disabled = count !== 10;

    if(!count){
      list.innerHTML = `<div class="play-empty-state"><strong>Your GOAT list starts here.</strong><span>Add ten fighters, then settle the order.</span></div>`;
    } else {
      list.innerHTML = state.top10.map((name,index) => {
        const fighter = liveFighter(name);
        return `<article class="play-rank-row" draggable="true" data-top10-index="${index}">
          <div class="play-rank-number">#${index + 1}</div>
          ${fighterPhoto(fighter)}
          <div class="play-rank-copy"><strong>${esc(name)}</strong><small>${esc(fighterMeta(fighter))}</small></div>
          <div class="play-rank-actions" aria-label="Reorder ${esc(name)}">
            <button type="button" data-move="up" aria-label="Move ${esc(name)} up" ${index === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" data-move="down" aria-label="Move ${esc(name)} down" ${index === count - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="remove" data-remove-fighter="${esc(name)}" aria-label="Remove ${esc(name)}">×</button>
          </div>
        </article>`;
      }).join('');
    }

    renderSearchResults();
    if(count !== 10) $('playTop10Result').hidden = true;
  }

  function comparisonData(){
    const rows = state.top10.map((name,index) => ({
      name,
      userRank:index + 1,
      modelRank:rankFor(name),
      delta:rankFor(name) - (index + 1)
    }));
    const biggest = [...rows].sort((a,b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
    const higher = [...rows].filter(row => row.delta > 0).sort((a,b) => b.delta - a.delta)[0];
    const lower = [...rows].filter(row => row.delta < 0).sort((a,b) => a.delta - b.delta)[0];
    const averageGap = rows.reduce((sum,row) => sum + Math.abs(row.delta), 0) / Math.max(rows.length,1);
    const agreement = clamp(Math.round(100 - averageGap * 5), 0, 100);
    return {rows,biggest,higher,lower,agreement};
  }
  function disagreementText(row){
    if(!row) return 'Your list closely tracks the model.';
    if(row.delta > 0) return `You have ${row.name} ${row.delta} spot${row.delta === 1 ? '' : 's'} higher than the model.`;
    if(row.delta < 0) return `You have ${row.name} ${Math.abs(row.delta)} spot${Math.abs(row.delta) === 1 ? '' : 's'} lower than the model.`;
    return `You and the model agree exactly on ${row.name}.`;
  }
  function renderComparison(shouldScroll=true){
    if(state.top10.length !== 10) return;
    const result = comparisonData();
    const target = $('playTop10Result');
    target.hidden = false;
    target.innerHTML = `
      <div class="play-result-hero"><span>MODEL AGREEMENT</span><strong>${result.agreement}</strong><small>out of 100</small></div>
      <div class="play-insight-grid">
        <div><span>Biggest disagreement</span><strong>${esc(disagreementText(result.biggest))}</strong></div>
        <div><span>You are highest on</span><strong>${result.higher ? `${esc(result.higher.name)} · +${result.higher.delta}` : 'No fighter above the model'}</strong></div>
        <div><span>You are lowest on</span><strong>${result.lower ? `${esc(result.lower.name)} · ${result.lower.delta}` : 'No fighter below the model'}</strong></div>
      </div>
      <div class="play-result-list">${result.rows.map(row => `
        <div><b>#${row.userRank}</b><span>${esc(row.name)}</span><small>Model #${row.modelRank}</small><em class="${row.delta > 0 ? 'up' : row.delta < 0 ? 'down' : ''}">${row.delta === 0 ? 'EVEN' : row.delta > 0 ? `+${row.delta}` : row.delta}</em></div>`).join('')}</div>`;
    if(shouldScroll) target.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function top10ShareText(){
    const result = comparisonData();
    return `MY UFC GOAT TOP 10\n\n${state.top10.map((name,index) => `${index + 1}. ${name}`).join('\n')}\n\nModel agreement: ${result.agreement}/100\nBiggest disagreement: ${disagreementText(result.biggest)}\n\nBuilt with UFC All-Time Rankings`;
  }
  function wrapCanvasText(context,text,x,y,maxWidth,lineHeight,maxLines){
    const words = String(text).split(/\s+/);
    let line = '';
    let lines = 0;
    for(const word of words){
      const test = line ? `${line} ${word}` : word;
      if(context.measureText(test).width > maxWidth && line){
        context.fillText(line,x,y);
        y += lineHeight;
        lines += 1;
        line = word;
        if(lines >= maxLines - 1) break;
      } else line = test;
    }
    if(line && lines < maxLines) context.fillText(line,x,y);
  }
  function makeTop10Card(){
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext('2d');
    const result = comparisonData();
    const gradient = context.createLinearGradient(0,0,1080,1350);
    gradient.addColorStop(0,'#171d2a');
    gradient.addColorStop(1,'#080a0f');
    context.fillStyle = gradient;
    context.fillRect(0,0,1080,1350);
    context.fillStyle = '#f97316';
    context.fillRect(0,0,22,1350);
    context.fillStyle = '#facc15';
    context.font = '800 28px system-ui, sans-serif';
    context.fillText('UFC ALL-TIME RANKINGS',70,78);
    context.fillStyle = '#ffffff';
    context.font = '950 68px system-ui, sans-serif';
    context.fillText('MY UFC GOAT TOP 10',70,158);
    context.fillStyle = '#cbd5e1';
    context.font = '500 26px system-ui, sans-serif';
    context.fillText(`MODEL AGREEMENT: ${result.agreement}/100`,72,210);

    state.top10.forEach((name,index) => {
      const y = 285 + index * 82;
      context.fillStyle = index < 3 ? '#facc15' : '#f97316';
      context.font = '950 34px system-ui, sans-serif';
      context.fillText(`#${index + 1}`,72,y);
      context.fillStyle = '#ffffff';
      context.font = '850 34px system-ui, sans-serif';
      context.fillText(name,155,y);
      context.fillStyle = '#cbd5e1';
      context.font = '600 22px system-ui, sans-serif';
      context.textAlign = 'right';
      context.fillText(`MODEL #${rankFor(name)}`,1005,y);
      context.textAlign = 'left';
      context.strokeStyle = '#334155';
      context.beginPath();
      context.moveTo(72,y+28);
      context.lineTo(1005,y+28);
      context.stroke();
    });

    context.fillStyle = '#facc15';
    context.font = '800 22px system-ui, sans-serif';
    context.fillText('BIGGEST DISAGREEMENT',72,1142);
    context.fillStyle = '#ffffff';
    context.font = '750 30px system-ui, sans-serif';
    wrapCanvasText(context, disagreementText(result.biggest), 72, 1190, 930, 40, 2);
    context.fillStyle = '#94a3b8';
    context.font = '600 22px system-ui, sans-serif';
    context.fillText('codyking0602.github.io/ufc-goat-rankings',72,1300);
    return canvas;
  }
  async function shareTop10(){
    if(state.top10.length !== 10) return;
    const button = $('playShareBtn');
    const original = button.textContent;
    button.textContent = 'CREATING CARD…';
    button.disabled = true;
    try {
      const canvas = makeTop10Card();
      const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'));
      const file = blob ? new File([blob], 'my-ufc-goat-top-10.png', {type:'image/png'}) : null;
      if(file && navigator.canShare?.({files:[file]})){
        await navigator.share({title:'My UFC GOAT Top 10', text:top10ShareText(), files:[file]});
      } else if(navigator.share){
        await navigator.share({title:'My UFC GOAT Top 10', text:top10ShareText()});
      } else if(blob){
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-ufc-goat-top-10.png';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        await navigator.clipboard.writeText(top10ShareText());
        button.textContent = 'COPIED';
        setTimeout(() => { button.textContent = original; }, 1300);
        return;
      }
    } catch(error){
      if(error?.name !== 'AbortError'){
        try {
          await navigator.clipboard.writeText(top10ShareText());
          button.textContent = 'COPIED';
        } catch(_copyError){ button.textContent = 'SHARE FAILED'; }
        setTimeout(() => { button.textContent = original; }, 1300);
        return;
      }
    }
    button.textContent = original;
    button.disabled = false;
  }

  function numberFrom(object,keys){
    for(const name of keys){
      const value = Number(object?.[name]);
      if(Number.isFinite(value)) return value;
    }
    return null;
  }
  function adjustedTitleWins(fighter){
    const exact = numberFrom(fighter.title, ['adjustedTitleWins','adjustedTitleWinCredit']);
    if(exact !== null) return exact.toFixed(1);
    const titleWins = numberFrom(fighter.title, ['normalTitleWins']);
    return titleWins !== null ? titleWins.toFixed(1) : '—';
  }
  function eliteWins(fighter){
    const direct = numberFrom(fighter, ['topFiveWins','top5Wins','eliteWins','qualityWins']);
    if(direct !== null) return String(direct).replace(/\.0$/,'');
    const opponents = Array.isArray(fighter.opponents) ? fighter.opponents : [];
    return opponents.length ? String(opponents.length) : '—';
  }
  function primeRecord(fighter){ return DATA.primeRecords?.[fighter.fighter]?.record || fighter.primeRecord || '—'; }
  function roundControl(fighter){
    const direct = numberFrom(fighter,['roundsWonPct','roundsWonPercentage','roundWinPct','roundsWonPercent']);
    if(direct !== null) return `${direct.toFixed(1)}%`;
    const rounds = Array.isArray(fighter.rounds) ? fighter.rounds : [];
    const won = rounds.reduce((sum,row) => sum + Number(row.roundsWon || 0),0);
    const total = rounds.reduce((sum,row) => sum + Number(row.roundsCounted || 0),0);
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
      ['Adjusted title wins', adjustedTitleWins(fighter)],
      ['Elite wins', eliteWins(fighter)],
      ['Prime UFC record', primeRecord(fighter)],
      ['Rounds won', roundControl(fighter)],
      ['Finish rate', finishRate !== null ? `${finishRate.toFixed(1)}%` : '—'],
      ['Active elite years', eliteYears !== null ? eliteYears.toFixed(1) : '—'],
      ['Loss context', lossContext(fighter)]
    ];
  }

  function pickBlindPair(){
    const board = liveMenBoard();
    const pool = board.filter(fighter => rankFor(fighter.fighter) <= Math.min(35,board.length));
    let fighterA;
    let fighterB;
    let pairKey = '';
    for(let tries=0; tries<100; tries += 1){
      fighterA = pool[Math.floor(Math.random() * pool.length)];
      const candidates = pool.filter(fighter => fighter.fighter !== fighterA.fighter && Math.abs(rankFor(fighter.fighter) - rankFor(fighterA.fighter)) <= 10);
      fighterB = candidates[Math.floor(Math.random() * candidates.length)] || pool[Math.floor(Math.random() * pool.length)];
      pairKey = [fighterA.fighter,fighterB.fighter].sort().join('|');
      if(fighterA.fighter !== fighterB.fighter && pairKey !== state.lastPairKey) break;
    }
    state.lastPairKey = pairKey;
    return Math.random() > .5 ? [fighterA,fighterB] : [fighterB,fighterA];
  }
  function renderBlind(){
    if(!state.blindPair) return;
    const [fighterA,fighterB] = state.blindPair.map(fighter => liveFighter(fighter.fighter));
    state.blindPair = [fighterA,fighterB];
    const statsA = blindStats(fighterA);
    const statsB = blindStats(fighterB);
    $('blindScore').textContent = `${state.blindScore}-${state.blindRounds - state.blindScore}`;
    $('blindRound').textContent = `ROUND ${state.blindRounds + 1}`;
    $('blindMatchup').innerHTML = `
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
          <button class="blind-pick-button blind-pick-a" type="button" data-blind-choice="A">PICK A</button>
          <button class="blind-pick-button blind-pick-b" type="button" data-blind-choice="B">PICK B</button>
        </div>
      </div>`;
    $('blindReveal').hidden = true;
    state.blindChoice = null;
  }
  function nextBlindRound(){
    state.blindPair = pickBlindPair();
    renderBlind();
  }
  function revealBlind(choice){
    if(state.blindChoice || !state.blindPair) return;
    state.blindChoice = choice;
    const [fighterA,fighterB] = state.blindPair.map(fighter => liveFighter(fighter.fighter));
    const picked = choice === 'A' ? fighterA : fighterB;
    const winner = rankFor(fighterA.fighter) < rankFor(fighterB.fighter) ? fighterA : fighterB;
    const loser = winner.fighter === fighterA.fighter ? fighterB : fighterA;
    const correct = picked.fighter === winner.fighter;
    state.blindRounds += 1;
    if(correct) state.blindScore += 1;
    $('blindScore').textContent = `${state.blindScore}-${state.blindRounds - state.blindScore}`;

    const reveal = $('blindReveal');
    reveal.hidden = false;
    reveal.innerHTML = `
      <div class="blind-verdict ${correct ? 'correct' : 'miss'}">
        <span>${correct ? 'YOU PICKED THE MODEL WINNER' : 'THE MODEL DISAGREES'}</span>
        <strong>${esc(winner.fighter)} ranks higher</strong>
        <p>${esc(winner.fighter)} is #${rankFor(winner.fighter)} in the UFC-only model. ${esc(loser.fighter)} is #${rankFor(loser.fighter)}.</p>
      </div>
      <div class="blind-reveal-grid">
        ${[fighterA,fighterB].map((fighter,index) => `<div class="blind-reveal-fighter ${picked.fighter === fighter.fighter ? 'user-pick' : ''} ${winner.fighter === fighter.fighter ? 'model-winner' : ''}">
          ${fighterPhoto(fighter,'reveal')}
          <span>FIGHTER ${index === 0 ? 'A' : 'B'}</span>
          <strong>${esc(fighter.fighter)}</strong>
          <small>Official UFC GOAT rank #${rankFor(fighter.fighter)}</small>
          ${picked.fighter === fighter.fighter ? '<em>YOUR PICK</em>' : ''}
        </div>`).join('')}
      </div>
      <button id="blindNextBtn" class="play-primary" type="button">NEXT BLIND MATCHUP</button>`;
    reveal.scrollIntoView({behavior:'smooth', block:'nearest'});
  }

  function refreshFromLiveScoring(){
    const comparisonVisible = !$('playTop10Result')?.hidden;
    renderTop10();
    if(comparisonVisible && state.top10.length === 10) renderComparison(false);
    if(state.mode === 'blind' && !window.UFC_BLIND_MATCHMAKING && state.blindPair && !state.blindChoice) renderBlind();
  }

  function wireEvents(){
    document.querySelectorAll('[data-play-mode]').forEach(button => {
      button.addEventListener('click', () => setMode(button.dataset.playMode));
    });
    $('playFighterSearch')?.addEventListener('input', event => {
      state.query = event.target.value;
      renderSearchResults();
    });
    $('playFighterResults')?.addEventListener('click', event => {
      const button = event.target.closest('[data-add-fighter]');
      if(!button || state.top10.length >= 10) return;
      const name = button.dataset.addFighter;
      if(!state.top10.includes(name)) state.top10.push(name);
      state.query = '';
      $('playFighterSearch').value = '';
      saveTop10();
      renderTop10();
    });
    $('playTop10List')?.addEventListener('click', event => {
      const remove = event.target.closest('[data-remove-fighter]');
      if(remove){
        state.top10 = state.top10.filter(name => name !== remove.dataset.removeFighter);
        saveTop10();
        renderTop10();
        return;
      }
      const row = event.target.closest('[data-top10-index]');
      const move = event.target.closest('[data-move]');
      if(row && move){
        const index = Number(row.dataset.top10Index);
        moveFighter(index, move.dataset.move === 'up' ? index - 1 : index + 1);
      }
    });

    let dragIndex = null;
    $('playTop10List')?.addEventListener('dragstart', event => {
      const row = event.target.closest('[data-top10-index]');
      if(!row) return;
      dragIndex = Number(row.dataset.top10Index);
      row.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
    });
    $('playTop10List')?.addEventListener('dragover', event => {
      if(event.target.closest('[data-top10-index]')) event.preventDefault();
    });
    $('playTop10List')?.addEventListener('drop', event => {
      const row = event.target.closest('[data-top10-index]');
      if(!row || dragIndex === null) return;
      event.preventDefault();
      moveFighter(dragIndex, Number(row.dataset.top10Index));
      dragIndex = null;
    });
    $('playTop10List')?.addEventListener('dragend', () => {
      document.querySelectorAll('.play-rank-row.dragging').forEach(row => row.classList.remove('dragging'));
      dragIndex = null;
    });

    $('playResetTop10Btn')?.addEventListener('click', () => {
      state.top10 = [];
      saveTop10();
      renderTop10();
    });
    $('playCompareBtn')?.addEventListener('click', () => renderComparison(true));
    $('playShareBtn')?.addEventListener('click', shareTop10);
    $('blindMatchup')?.addEventListener('click', event => {
      const choice = event.target.closest('[data-blind-choice]');
      if(choice) revealBlind(choice.dataset.blindChoice);
    });
    $('blindReveal')?.addEventListener('click', event => {
      if(event.target.closest('#blindNextBtn')) nextBlindRound();
    });

    window.addEventListener('ufc-scoring-pipeline-ready', refreshFromLiveScoring);
    window.addEventListener('ufc-division-era-depth-finalized', refreshFromLiveScoring);
    window.setTimeout(refreshFromLiveScoring, 1400);
  }

  wireEvents();
  renderTop10();
  setMode('top10');
})();
