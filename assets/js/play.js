(function(){
  'use strict';

  const STORAGE_KEY = 'ufc-goat-play-top10-v1';
  const DATA = window.RANKING_DATA || {};
  const OVERRIDES = window.DISPLAY_OVERRIDES || {};
  const panel = document.getElementById('play');
  if(!panel || !Array.isArray(DATA.men)) return;

  const profileMap = Object.fromEntries((DATA.fighters || []).map(f => [f.fighter, f]));
  const board = DATA.men
    .map(row => ({ ...(profileMap[row.fighter] || {}), ...row }))
    .filter(f => f && f.fighter)
    .sort((a,b) => Number(a.rank || 999) - Number(b.rank || 999));
  const byName = Object.fromEntries(board.map(f => [f.fighter, f]));
  const officialRank = Object.fromEntries(board.map((f,i) => [
    f.fighter,
    Number(OVERRIDES[f.fighter]?.allTimeRank || f.rank || i + 1)
  ]));

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
    return String(value ?? '').replace(/[&<>'\"]/g, ch => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '\"':'&quot;'
    }[ch]));
  }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function photoFor(f){ return OVERRIDES[f.fighter]?.thumbUrl || OVERRIDES[f.fighter]?.photoUrl || ''; }
  function initials(name){
    return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase();
  }
  function rankFor(name){ return officialRank[name] || 999; }
  function saveTop10(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.top10)); }
    catch(_err){}
  }
  function loadTop10(){
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if(!Array.isArray(saved)) return [];
      return saved.filter(name => typeof name === 'string' && byName[name]).slice(0,10);
    } catch(_err){ return []; }
  }
  function fighterPhoto(f, extraClass=''){
    const url = photoFor(f);
    return `<div class="play-fighter-photo ${extraClass}">${url
      ? `<img src="${esc(url)}" alt="${esc(f.fighter)}">`
      : `<span>${esc(initials(f.fighter))}</span>`}</div>`;
  }
  function fighterMeta(f){
    const parts = [f.primaryDivision, f.ufcRecord].filter(Boolean);
    return parts.join(' · ') || 'UFC résumé';
  }

  function setMode(mode){
    state.mode = mode;
    document.querySelectorAll('[data-play-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.playMode === mode);
      btn.setAttribute('aria-selected', String(btn.dataset.playMode === mode));
    });
    $('playTop10Panel').hidden = mode !== 'top10';
    $('playBlindPanel').hidden = mode !== 'blind';
    if(mode === 'blind' && !state.blindPair) nextBlindRound();
  }

  function renderSearchResults(){
    const target = $('playFighterResults');
    if(!target) return;
    const query = state.query.trim().toLowerCase();
    const selected = new Set(state.top10);
    const matches = board
      .filter(f => !selected.has(f.fighter))
      .filter(f => !query || f.fighter.toLowerCase().includes(query))
      .slice(0, query ? 12 : 8);

    target.innerHTML = matches.length ? matches.map(f => `
      <button class="play-search-result" type="button" data-add-fighter="${esc(f.fighter)}" ${state.top10.length >= 10 ? 'disabled' : ''}>
        ${fighterPhoto(f, 'small')}
        <span><strong>${esc(f.fighter)}</strong><small>${esc(fighterMeta(f))}</small></span>
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
    const count = state.top10.length;
    $('playTop10Count').textContent = `${count}/10 selected`;
    $('playTop10ProgressFill').style.width = `${count * 10}%`;
    $('playCompareBtn').disabled = count !== 10;
    $('playShareBtn').disabled = count !== 10;

    if(!count){
      list.innerHTML = `<div class="play-empty-state"><strong>Your GOAT list starts here.</strong><span>Add ten fighters, then settle the order.</span></div>`;
    } else {
      list.innerHTML = state.top10.map((name,index) => {
        const f = byName[name] || {fighter:name};
        return `<article class="play-rank-row" draggable="true" data-top10-index="${index}">
          <div class="play-rank-number">#${index + 1}</div>
          ${fighterPhoto(f)}
          <div class="play-rank-copy"><strong>${esc(name)}</strong><small>${esc(fighterMeta(f))}</small></div>
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
      userRank: index + 1,
      modelRank: rankFor(name),
      delta: rankFor(name) - (index + 1)
    }));
    const biggest = [...rows].sort((a,b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
    const higher = [...rows].filter(r => r.delta > 0).sort((a,b) => b.delta - a.delta)[0];
    const lower = [...rows].filter(r => r.delta < 0).sort((a,b) => a.delta - b.delta)[0];
    const avgDiff = rows.reduce((sum,row) => sum + Math.abs(row.delta), 0) / Math.max(rows.length,1);
    const agreement = clamp(Math.round(100 - avgDiff * 5), 0, 100);
    return {rows,biggest,higher,lower,agreement};
  }

  function disagreementText(row){
    if(!row) return 'Your list closely tracks the model.';
    if(row.delta > 0) return `You have ${row.name} ${row.delta} spot${row.delta === 1 ? '' : 's'} higher than the model.`;
    if(row.delta < 0) return `You have ${row.name} ${Math.abs(row.delta)} spot${Math.abs(row.delta) === 1 ? '' : 's'} lower than the model.`;
    return `You and the model agree exactly on ${row.name}.`;
  }

  function renderComparison(){
    if(state.top10.length !== 10) return;
    const result = comparisonData();
    const target = $('playTop10Result');
    target.hidden = false;
    target.innerHTML = `
      <div class="play-result-hero">
        <span>MODEL AGREEMENT</span>
        <strong>${result.agreement}</strong>
        <small>out of 100</small>
      </div>
      <div class="play-insight-grid">
        <div><span>Biggest disagreement</span><strong>${esc(disagreementText(result.biggest))}</strong></div>
        <div><span>You are highest on</span><strong>${result.higher ? `${esc(result.higher.name)} · +${result.higher.delta}` : 'No fighter above the model'}</strong></div>
        <div><span>You are lowest on</span><strong>${result.lower ? `${esc(result.lower.name)} · ${result.lower.delta}` : 'No fighter below the model'}</strong></div>
      </div>
      <div class="play-result-list">${result.rows.map(row => `
        <div><b>#${row.userRank}</b><span>${esc(row.name)}</span><small>Model #${row.modelRank}</small><em class="${row.delta > 0 ? 'up' : row.delta < 0 ? 'down' : ''}">${row.delta === 0 ? 'EVEN' : row.delta > 0 ? `+${row.delta}` : row.delta}</em></div>`).join('')}</div>`;
    target.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function top10ShareText(){
    const result = comparisonData();
    return `MY UFC GOAT TOP 10\n\n${state.top10.map((name,i) => `${i+1}. ${name}`).join('\n')}\n\nModel agreement: ${result.agreement}/100\nBiggest disagreement: ${disagreementText(result.biggest)}\n\nBuilt with UFC All-Time Rankings`;
  }

  function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight,maxLines){
    const words = String(text).split(/\s+/);
    let line = '';
    let lines = 0;
    for(const word of words){
      const test = line ? `${line} ${word}` : word;
      if(ctx.measureText(test).width > maxWidth && line){
        ctx.fillText(line,x,y);
        y += lineHeight;
        lines += 1;
        line = word;
        if(lines >= maxLines - 1) break;
      } else line = test;
    }
    if(line && lines < maxLines) ctx.fillText(line,x,y);
  }

  function makeTop10Card(){
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const result = comparisonData();
    const gradient = ctx.createLinearGradient(0,0,1080,1350);
    gradient.addColorStop(0,'#171d2a');
    gradient.addColorStop(1,'#080a0f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,1080,1350);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(0,0,22,1350);
    ctx.fillStyle = '#facc15';
    ctx.font = '800 28px system-ui, sans-serif';
    ctx.fillText('UFC ALL-TIME RANKINGS',70,78);
    ctx.fillStyle = '#ffffff';
    ctx.font = '950 68px system-ui, sans-serif';
    ctx.fillText('MY UFC GOAT TOP 10',70,158);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 26px system-ui, sans-serif';
    ctx.fillText(`MODEL AGREEMENT: ${result.agreement}/100`,72,210);

    state.top10.forEach((name,index) => {
      const y = 285 + index * 82;
      ctx.fillStyle = index < 3 ? '#facc15' : '#f97316';
      ctx.font = '950 34px system-ui, sans-serif';
      ctx.fillText(`#${index + 1}`,72,y);
      ctx.fillStyle = '#ffffff';
      ctx.font = '850 34px system-ui, sans-serif';
      ctx.fillText(name,155,y);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`MODEL #${rankFor(name)}`,1005,y);
      ctx.textAlign = 'left';
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(72,y+28);
      ctx.lineTo(1005,y+28);
      ctx.stroke();
    });

    ctx.fillStyle = '#facc15';
    ctx.font = '800 22px system-ui, sans-serif';
    ctx.fillText('BIGGEST DISAGREEMENT',72,1142);
    ctx.fillStyle = '#ffffff';
    ctx.font = '750 30px system-ui, sans-serif';
    wrapCanvasText(ctx, disagreementText(result.biggest), 72, 1190, 930, 40, 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText('codyking0602.github.io/ufc-goat-rankings',72,1300);
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
    } catch(err){
      if(err?.name !== 'AbortError'){
        try {
          await navigator.clipboard.writeText(top10ShareText());
          button.textContent = 'COPIED';
        } catch(_copyErr){ button.textContent = 'SHARE FAILED'; }
        setTimeout(() => { button.textContent = original; }, 1300);
        return;
      }
    }
    button.textContent = original;
    button.disabled = false;
  }

  function numberFrom(obj,keys){
    for(const key of keys){
      const value = Number(obj?.[key]);
      if(Number.isFinite(value)) return value;
    }
    return null;
  }
  function adjustedTitleWins(f){
    const exact = numberFrom(f.title, ['adjustedTitleWins','adjustedTitleWinCredit']);
    if(exact !== null) return exact.toFixed(1);
    const titleWins = numberFrom(f.title, ['normalTitleWins']);
    return titleWins !== null ? titleWins.toFixed(1) : '—';
  }
  function eliteWins(f){
    const direct = numberFrom(f, ['topFiveWins','top5Wins','eliteWins','qualityWins']);
    if(direct !== null) return String(direct).replace(/\.0$/,'');
    const opponents = Array.isArray(f.opponents) ? f.opponents : [];
    return opponents.length ? String(opponents.length) : '—';
  }
  function primeRecord(f){ return DATA.primeRecords?.[f.fighter]?.record || f.primeRecord || '—'; }
  function roundControl(f){
    const direct = numberFrom(f,['roundsWonPct','roundsWonPercentage','roundWinPct','roundsWonPercent']);
    if(direct !== null) return `${direct.toFixed(1)}%`;
    const rounds = Array.isArray(f.rounds) ? f.rounds : [];
    const won = rounds.reduce((sum,row) => sum + Number(row.roundsWon || 0),0);
    const total = rounds.reduce((sum,row) => sum + Number(row.roundsCounted || 0),0);
    return total ? `${((won / total) * 100).toFixed(1)}%` : '—';
  }
  function lossContext(f){
    const penalty = numberFrom(f,['penalty','lossPenalty']);
    if(penalty === null || penalty === 0) return 'Clean';
    if(penalty > -3) return 'Light damage';
    if(penalty > -7) return 'Moderate damage';
    return 'Heavy damage';
  }
  function blindStats(f){
    const finishRate = numberFrom(f,['finishRatePct']);
    const eliteYears = numberFrom(f,['activeEliteYears']);
    return [
      ['Adjusted title wins', adjustedTitleWins(f)],
      ['Elite wins', eliteWins(f)],
      ['Prime UFC record', primeRecord(f)],
      ['Rounds won', roundControl(f)],
      ['Finish rate', finishRate !== null ? `${finishRate.toFixed(1)}%` : '—'],
      ['Active elite years', eliteYears !== null ? eliteYears.toFixed(1) : '—'],
      ['Loss context', lossContext(f)]
    ];
  }

  function pickBlindPair(){
    const pool = board.filter(f => rankFor(f.fighter) <= Math.min(35,board.length));
    let a,b,key;
    for(let tries=0;tries<100;tries++){
      a = pool[Math.floor(Math.random() * pool.length)];
      const candidates = pool.filter(f => f.fighter !== a.fighter && Math.abs(rankFor(f.fighter) - rankFor(a.fighter)) <= 10);
      b = candidates[Math.floor(Math.random() * candidates.length)] || pool[Math.floor(Math.random() * pool.length)];
      key = [a.fighter,b.fighter].sort().join('|');
      if(a.fighter !== b.fighter && key !== state.lastPairKey) break;
    }
    state.lastPairKey = key;
    return Math.random() > .5 ? [a,b] : [b,a];
  }

  function renderBlind(){
    if(!state.blindPair) return;
    const [a,b] = state.blindPair;
    const aStats = blindStats(a);
    const bStats = blindStats(b);
    $('blindScore').textContent = `${state.blindScore}-${state.blindRounds - state.blindScore}`;
    $('blindRound').textContent = `ROUND ${state.blindRounds + 1}`;
    $('blindMatchup').innerHTML = `
      <div class="blind-comparison-card">
        <div class="blind-compare-head">
          <div class="blind-identity blind-a"><span>FIGHTER A</span><div class="blind-silhouette">?</div></div>
          <div class="blind-resume-label">RÉSUMÉ</div>
          <div class="blind-identity blind-b"><span>FIGHTER B</span><div class="blind-silhouette">?</div></div>
        </div>
        <div class="blind-compare-rows">
          ${aStats.map(([label,aValue],index) => `<div class="blind-compare-row">
            <strong>${esc(aValue)}</strong>
            <span>${esc(label)}</span>
            <strong>${esc(bStats[index][1])}</strong>
          </div>`).join('')}
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
    const [a,b] = state.blindPair;
    const picked = choice === 'A' ? a : b;
    const winner = rankFor(a.fighter) < rankFor(b.fighter) ? a : b;
    const loser = winner.fighter === a.fighter ? b : a;
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
        ${[a,b].map((f,index) => `<div class="blind-reveal-fighter ${picked.fighter === f.fighter ? 'user-pick' : ''} ${winner.fighter === f.fighter ? 'model-winner' : ''}">
          ${fighterPhoto(f,'reveal')}
          <span>FIGHTER ${index === 0 ? 'A' : 'B'}</span>
          <strong>${esc(f.fighter)}</strong>
          <small>Official UFC GOAT rank #${rankFor(f.fighter)}</small>
          ${picked.fighter === f.fighter ? '<em>YOUR PICK</em>' : ''}
        </div>`).join('')}
      </div>
      <button id="blindNextBtn" class="play-primary" type="button">NEXT BLIND MATCHUP</button>`;
    reveal.scrollIntoView({behavior:'smooth', block:'nearest'});
  }

  function wireEvents(){
    document.querySelectorAll('[data-play-mode]').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.playMode));
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
    $('playCompareBtn')?.addEventListener('click', renderComparison);
    $('playShareBtn')?.addEventListener('click', shareTop10);
    $('blindMatchup')?.addEventListener('click', event => {
      const choice = event.target.closest('[data-blind-choice]');
      if(choice) revealBlind(choice.dataset.blindChoice);
    });
    $('blindReveal')?.addEventListener('click', event => {
      if(event.target.closest('#blindNextBtn')) nextBlindRound();
    });
  }

  wireEvents();
  renderTop10();
  setMode('top10');
})();
