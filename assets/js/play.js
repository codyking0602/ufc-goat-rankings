(function () {
  'use strict';

  const root = document.getElementById('playApp');
  if (!root || !window.RANKING_DATA) return;

  const STORAGE_KEY = 'ufc-play-top10-v1';
  const board = (window.RANKING_DATA.men || [])
    .map(row => (typeof fullRow === 'function' ? fullRow(row) : row))
    .filter(fighter => fighter && fighter.fighter)
    .sort((a, b) => officialRank(a) - officialRank(b));
  const fighterByName = Object.fromEntries(board.map(fighter => [fighter.fighter, fighter]));

  const curatedPairs = [
    ['Khabib Nurmagomedov', 'Jose Aldo'],
    ['Alexander Volkanovski', 'Khabib Nurmagomedov'],
    ['Randy Couture', 'Kamaru Usman'],
    ['Max Holloway', 'Matt Hughes'],
    ['Daniel Cormier', 'Stipe Miocic'],
    ['Islam Makhachev', 'Demetrious Johnson'],
    ['Anderson Silva', 'Khabib Nurmagomedov'],
    ['Jose Aldo', 'Kamaru Usman'],
    ['Max Holloway', 'Daniel Cormier'],
    ['Ilia Topuria', 'Stipe Miocic'],
    ['Alex Pereira', 'Charles Oliveira'],
    ['Conor McGregor', 'BJ Penn']
  ].filter(pair => pair.every(name => fighterByName[name]));

  const state = {
    mode: 'top10',
    top10: loadTop10(),
    pairIndex: Math.floor(Math.random() * Math.max(curatedPairs.length, 1)),
    pair: null,
    selected: null,
    revealed: false,
    rounds: 0,
    correct: 0,
    draggedIndex: null
  };

  function clampValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function officialRank(fighter) {
    const overrideRank = Number(window.DISPLAY_OVERRIDES?.[fighter?.fighter]?.allTimeRank);
    const rowRank = Number(fighter?.rank);
    if (Number.isFinite(overrideRank) && overrideRank > 0) return overrideRank;
    if (Number.isFinite(rowRank) && rowRank > 0) return rowRank;
    return 999;
  }

  function fighterPhoto(fighter) {
    return window.DISPLAY_OVERRIDES?.[fighter?.fighter]?.thumbUrl
      || window.DISPLAY_OVERRIDES?.[fighter?.fighter]?.photoUrl
      || '';
  }

  function initials(name) {
    return String(name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  function photoMarkup(fighter, className) {
    const photo = fighterPhoto(fighter);
    return `<div class="${className}">${photo
      ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(fighter.fighter)}">`
      : escapeHtml(initials(fighter.fighter))}</div>`;
  }

  function loadTop10() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(stored)) return [];
      return stored.filter(name => typeof name === 'string').slice(0, 10);
    } catch (error) {
      return [];
    }
  }

  function saveTop10() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.top10));
  }

  function currentTop10Fighters() {
    return state.top10.map(name => fighterByName[name]).filter(Boolean);
  }

  function render() {
    root.innerHTML = `
      <div class="play-mode-switch" role="tablist" aria-label="Play modes">
        <button type="button" class="${state.mode === 'top10' ? 'active' : ''}" data-play-mode="top10">Build Your Top 10</button>
        <button type="button" class="${state.mode === 'blind' ? 'active' : ''}" data-play-mode="blind">Blind Résumé</button>
      </div>
      <div class="play-stage">
        ${state.mode === 'top10' ? renderTop10() : renderBlindResume()}
      </div>`;

    bindModeSwitch();
    if (state.mode === 'top10') bindTop10();
    else bindBlindResume();
  }

  function bindModeSwitch() {
    root.querySelectorAll('[data-play-mode]').forEach(button => {
      button.addEventListener('click', () => {
        state.mode = button.dataset.playMode;
        render();
      });
    });
  }

  function renderTop10() {
    const fighters = currentTop10Fighters();
    const available = board.filter(fighter => !state.top10.includes(fighter.fighter));
    const complete = fighters.length === 10;

    return `
      <section class="play-panel top10-builder">
        <div class="play-panel-head">
          <div>
            <span class="play-kicker">Your list. Your argument.</span>
            <h3>Build Your UFC Top 10</h3>
            <p>Choose ten fighters, then reorder them. Official ranks stay hidden until your list is finished.</p>
          </div>
          <div class="play-progress" aria-label="${fighters.length} of 10 fighters selected">
            <strong>${fighters.length}<span>/10</span></strong>
            <small>selected</small>
          </div>
        </div>

        <div class="top10-add-row">
          <label for="top10FighterSelect">Add a fighter</label>
          <div>
            <select id="top10FighterSelect" ${complete ? 'disabled' : ''}>
              <option value="">Choose from the UFC board…</option>
              ${available.map(fighter => `<option value="${escapeHtml(fighter.fighter)}">${escapeHtml(fighter.fighter)}</option>`).join('')}
            </select>
            <button id="top10Add" type="button" class="play-primary" ${complete ? 'disabled' : ''}>Add</button>
          </div>
        </div>

        <div class="top10-utility-row">
          <button id="top10OfficialSeed" type="button" class="play-secondary">Start with Model Top 10</button>
          <button id="top10Clear" type="button" class="play-text-button" ${fighters.length ? '' : 'disabled'}>Clear list</button>
        </div>

        <div id="top10List" class="top10-list ${fighters.length ? '' : 'is-empty'}">
          ${fighters.length ? fighters.map((fighter, index) => top10Row(fighter, index)).join('') : `
            <div class="top10-empty">
              <strong>Your GOAT list starts here.</strong>
              <span>Add ten fighters, then settle the order.</span>
            </div>`}
        </div>

        <button id="top10Finish" type="button" class="play-finish" ${complete ? '' : 'disabled'}>
          ${complete ? 'Compare My Top 10' : `Add ${10 - fighters.length} More Fighter${10 - fighters.length === 1 ? '' : 's'}`}
        </button>
        <div id="top10Result" class="top10-result" aria-live="polite"></div>
      </section>`;
  }

  function top10Row(fighter, index) {
    return `
      <article class="top10-row" draggable="true" data-index="${index}">
        <div class="top10-rank">${index + 1}</div>
        ${photoMarkup(fighter, 'top10-photo')}
        <div class="top10-name">
          <strong>${escapeHtml(fighter.fighter)}</strong>
          <span>${escapeHtml(fighter.primaryDivision || 'UFC')}</span>
        </div>
        <div class="top10-actions" aria-label="Move ${escapeHtml(fighter.fighter)}">
          <button type="button" data-move="up" data-index="${index}" aria-label="Move up" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" data-move="down" data-index="${index}" aria-label="Move down" ${index === state.top10.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" data-remove="${index}" aria-label="Remove ${escapeHtml(fighter.fighter)}">×</button>
        </div>
      </article>`;
  }

  function bindTop10() {
    const select = document.getElementById('top10FighterSelect');
    const addButton = document.getElementById('top10Add');

    const addSelected = () => {
      const name = select?.value;
      if (!name || state.top10.includes(name) || state.top10.length >= 10) return;
      state.top10.push(name);
      saveTop10();
      render();
    };

    addButton?.addEventListener('click', addSelected);
    select?.addEventListener('change', () => {
      if (select.value) addSelected();
    });

    document.getElementById('top10OfficialSeed')?.addEventListener('click', () => {
      state.top10 = board.slice(0, 10).map(fighter => fighter.fighter);
      saveTop10();
      render();
    });

    document.getElementById('top10Clear')?.addEventListener('click', () => {
      state.top10 = [];
      saveTop10();
      render();
    });

    root.querySelectorAll('[data-remove]').forEach(button => {
      button.addEventListener('click', () => {
        state.top10.splice(Number(button.dataset.remove), 1);
        saveTop10();
        render();
      });
    });

    root.querySelectorAll('[data-move]').forEach(button => {
      button.addEventListener('click', () => {
        const from = Number(button.dataset.index);
        const to = button.dataset.move === 'up' ? from - 1 : from + 1;
        moveTop10(from, to);
      });
    });

    root.querySelectorAll('.top10-row').forEach(row => {
      row.addEventListener('dragstart', event => {
        state.draggedIndex = Number(row.dataset.index);
        row.classList.add('is-dragging');
        event.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', () => {
        state.draggedIndex = null;
        row.classList.remove('is-dragging');
        root.querySelectorAll('.top10-row').forEach(item => item.classList.remove('is-drag-target'));
      });
      row.addEventListener('dragover', event => {
        event.preventDefault();
        row.classList.add('is-drag-target');
      });
      row.addEventListener('dragleave', () => row.classList.remove('is-drag-target'));
      row.addEventListener('drop', event => {
        event.preventDefault();
        const to = Number(row.dataset.index);
        const from = state.draggedIndex;
        if (Number.isInteger(from) && from !== to) moveTop10(from, to);
      });
    });

    document.getElementById('top10Finish')?.addEventListener('click', showTop10Result);
  }

  function moveTop10(from, to) {
    if (to < 0 || to >= state.top10.length || from === to) return;
    const [fighter] = state.top10.splice(from, 1);
    state.top10.splice(to, 0, fighter);
    saveTop10();
    render();
  }

  function top10Analysis() {
    const fighters = currentTop10Fighters();
    const gaps = fighters.map((fighter, index) => ({
      fighter,
      userRank: index + 1,
      modelRank: officialRank(fighter),
      gap: officialRank(fighter) - (index + 1)
    }));
    const biggest = [...gaps].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))[0];
    const higher = [...gaps].filter(item => item.gap > 0).sort((a, b) => b.gap - a.gap)[0];
    const lower = [...gaps].filter(item => item.gap < 0).sort((a, b) => a.gap - b.gap)[0];
    const averageGap = gaps.reduce((sum, item) => sum + Math.abs(item.gap), 0) / Math.max(gaps.length, 1);
    const agreement = clampValue(Math.round(100 - averageGap * 5), 0, 100);
    const officialTop10 = board.slice(0, 10).map(fighter => fighter.fighter);
    const omitted = officialTop10.filter(name => !state.top10.includes(name));
    return { gaps, biggest, higher, lower, agreement, omitted };
  }

  function disagreementSentence(item) {
    if (!item) return 'Your order matches the model unusually closely.';
    if (item.gap > 0) return `You have ${item.fighter.fighter} ${item.gap} spot${item.gap === 1 ? '' : 's'} higher than the model.`;
    if (item.gap < 0) return `You have ${item.fighter.fighter} ${Math.abs(item.gap)} spot${Math.abs(item.gap) === 1 ? '' : 's'} lower than the model.`;
    return `${item.fighter.fighter} lands in the same spot as the model.`;
  }

  function showTop10Result() {
    if (state.top10.length !== 10) return;
    const result = top10Analysis();
    const resultRoot = document.getElementById('top10Result');
    if (!resultRoot) return;

    resultRoot.innerHTML = `
      <div class="top10-payoff">
        <div class="top10-payoff-head">
          <div>
            <span class="play-kicker">Your result</span>
            <h3>${result.agreement}% Model Agreement</h3>
          </div>
          <span class="agreement-badge">${result.agreement >= 80 ? 'Model Ally' : result.agreement >= 55 ? 'Independent Thinker' : 'Chaos Ballot'}</span>
        </div>
        <div class="top10-biggest">
          <small>Biggest disagreement</small>
          <strong>${escapeHtml(disagreementSentence(result.biggest))}</strong>
        </div>
        <div class="top10-insights">
          <div><small>Highest versus model</small><strong>${result.higher ? `${escapeHtml(result.higher.fighter.fighter)} · +${result.higher.gap}` : 'No major reach'}</strong></div>
          <div><small>Lowest versus model</small><strong>${result.lower ? `${escapeHtml(result.lower.fighter.fighter)} · ${result.lower.gap}` : 'No major fade'}</strong></div>
          <div><small>Model top-10 omissions</small><strong>${result.omitted.length ? result.omitted.map(escapeHtml).join(', ') : 'None'}</strong></div>
        </div>
        <div class="top10-payoff-list">
          ${currentTop10Fighters().map((fighter, index) => `<span><b>${index + 1}</b>${escapeHtml(fighter.fighter)}</span>`).join('')}
        </div>
        <div class="top10-share-actions">
          <button id="top10ShareCard" type="button" class="play-primary">Share Results Card</button>
          <button id="top10Edit" type="button" class="play-secondary">Keep Editing</button>
        </div>
        <p id="top10ShareStatus" class="play-status"></p>
      </div>`;

    document.getElementById('top10ShareCard')?.addEventListener('click', shareTop10Card);
    document.getElementById('top10Edit')?.addEventListener('click', () => {
      resultRoot.innerHTML = '';
      document.getElementById('top10List')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    resultRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function shareText() {
    const analysis = top10Analysis();
    return [
      'MY UFC ALL-TIME TOP 10',
      '',
      ...currentTop10Fighters().map((fighter, index) => `${index + 1}. ${fighter.fighter}`),
      '',
      `${analysis.agreement}% agreement with the UFC GOAT model`,
      `Biggest disagreement: ${disagreementSentence(analysis.biggest)}`
    ].join('\n');
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function buildTop10Canvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const analysis = top10Analysis();

    const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
    gradient.addColorStop(0, '#20283a');
    gradient.addColorStop(0.55, '#0b0d12');
    gradient.addColorStop(1, '#111827');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#facc15';
    ctx.font = '800 28px Arial';
    ctx.fillText('UFC GOAT RANKINGS', 72, 88);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 66px Arial';
    ctx.fillText('MY ALL-TIME TOP 10', 72, 164);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '500 28px Arial';
    ctx.fillText(`${analysis.agreement}% agreement with the official model`, 72, 214);

    currentTop10Fighters().forEach((fighter, index) => {
      const y = 270 + index * 78;
      ctx.fillStyle = index < 3 ? 'rgba(249,115,22,.20)' : 'rgba(255,255,255,.055)';
      roundedRect(ctx, 72, y, 936, 62, 16);
      ctx.fill();
      ctx.fillStyle = index < 3 ? '#facc15' : '#9ca3af';
      ctx.font = '900 28px Arial';
      ctx.fillText(String(index + 1), 98, y + 41);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 29px Arial';
      ctx.fillText(fighter.fighter, 160, y + 41);
    });

    ctx.fillStyle = 'rgba(250,204,21,.10)';
    roundedRect(ctx, 72, 1080, 936, 162, 22);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.font = '800 22px Arial';
    ctx.fillText('BIGGEST DISAGREEMENT', 104, 1122);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 27px Arial';
    wrapCanvasText(ctx, disagreementSentence(analysis.biggest), 104, 1164, 845, 34);

    ctx.fillStyle = '#6b7280';
    ctx.font = '600 21px Arial';
    ctx.fillText('Built with UFC All-Time Rankings', 72, 1300);
    return canvas;
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(' ');
    let line = '';
    let lineY = y;
    words.forEach(word => {
      const test = `${line}${word} `;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), x, lineY);
        line = `${word} `;
        lineY += lineHeight;
      } else {
        line = test;
      }
    });
    if (line) ctx.fillText(line.trim(), x, lineY);
  }

  async function shareTop10Card() {
    const status = document.getElementById('top10ShareStatus');
    const text = shareText();
    try {
      const canvas = buildTop10Canvas();
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (blob && navigator.share) {
        const file = new File([blob], 'ufc-top-10.png', { type: 'image/png' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'My UFC All-Time Top 10', text, files: [file] });
          if (status) status.textContent = 'Results card ready to share.';
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ title: 'My UFC All-Time Top 10', text });
        if (status) status.textContent = 'Results shared.';
        return;
      }
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = 'Your Top 10 was copied to the clipboard.';
    } catch (error) {
      if (error?.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(text);
        if (status) status.textContent = 'Image sharing was unavailable, so the results were copied instead.';
      } catch (clipboardError) {
        if (status) status.textContent = 'Sharing is not available in this browser.';
      }
    }
  }

  function nextPair() {
    if (!curatedPairs.length) {
      const first = board[Math.floor(Math.random() * Math.min(board.length, 30))];
      const candidates = board.filter(fighter => fighter.fighter !== first.fighter && Math.abs(officialRank(fighter) - officialRank(first)) <= 12);
      const second = candidates[Math.floor(Math.random() * candidates.length)] || board[1];
      state.pair = Math.random() > 0.5 ? [first, second] : [second, first];
    } else {
      const names = curatedPairs[state.pairIndex % curatedPairs.length];
      const pair = names.map(name => fighterByName[name]);
      state.pair = Math.random() > 0.5 ? pair : [pair[1], pair[0]];
      state.pairIndex += 1;
    }
    state.selected = null;
    state.revealed = false;
  }

  function ensurePair() {
    if (!state.pair) nextPair();
    return state.pair;
  }

  function titleWins(fighter) {
    const value = Number(fighter?.title?.adjustedTitleWins ?? fighter?.adjustedTitleWins);
    if (Number.isFinite(value)) return value.toFixed(1).replace(/\.0$/, '');
    return '—';
  }

  function eliteWins(fighter) {
    const direct = Number(fighter?.top5Wins ?? fighter?.eliteWins);
    if (Number.isFinite(direct)) return String(direct);
    const opponents = Array.isArray(fighter?.opponents) ? fighter.opponents : [];
    const strongWins = opponents.filter(opponent => {
      if (opponent?.top5 === true || opponent?.elite === true) return true;
      const credit = Number(opponent?.credit);
      return Number.isFinite(credit) && credit >= 0.8;
    }).length;
    return strongWins ? String(strongWins) : '—';
  }

  function primeRecord(fighter) {
    return window.RANKING_DATA.primeRecords?.[fighter?.fighter]?.record
      || fighter?.primeRecord
      || '—';
  }

  function roundsWon(fighter) {
    const direct = [fighter?.roundsWonPct, fighter?.roundsWonPercentage, fighter?.roundWinPct, fighter?.roundsWonPercent]
      .map(Number)
      .find(Number.isFinite);
    if (Number.isFinite(direct)) return `${direct.toFixed(1)}%`;
    const rounds = Array.isArray(fighter?.rounds) ? fighter.rounds : [];
    const won = rounds.reduce((sum, fight) => sum + Number(fight?.roundsWon || 0), 0);
    const counted = rounds.reduce((sum, fight) => sum + Number(fight?.roundsCounted || 0), 0);
    return counted ? `${((won / counted) * 100).toFixed(1)}%` : '—';
  }

  function finishRate(fighter) {
    const value = Number(fighter?.finishRatePct);
    return Number.isFinite(value) ? `${value.toFixed(1)}%` : '—';
  }

  function eliteYears(fighter) {
    const value = Number(fighter?.activeEliteYears);
    return Number.isFinite(value) ? value.toFixed(1) : '—';
  }

  function lossContext(fighter) {
    const penalty = Number(fighter?.penalty ?? fighter?.lossPenalty ?? 0);
    if (!Number.isFinite(penalty) || penalty === 0) return 'Clean';
    if (penalty > -3) return 'Light damage';
    if (penalty > -7) return 'Moderate damage';
    return 'Heavy damage';
  }

  function blindStats(fighter) {
    return [
      ['Adjusted title wins', titleWins(fighter)],
      ['Elite-win count', eliteWins(fighter)],
      ['Prime UFC record', primeRecord(fighter)],
      ['Rounds won', roundsWon(fighter)],
      ['Finish rate', finishRate(fighter)],
      ['Active elite years', eliteYears(fighter)],
      ['Loss context', lossContext(fighter)]
    ];
  }

  function renderBlindResume() {
    const pair = ensurePair();
    const [a, b] = pair;
    return `
      <section class="play-panel blind-resume">
        <div class="play-panel-head blind-head">
          <div>
            <span class="play-kicker">Names hidden. Bias exposed.</span>
            <h3>Which UFC Résumé Ranks Higher?</h3>
            <p>Choose the career before the fighters are revealed.</p>
          </div>
          <div class="blind-score"><strong>${state.correct}/${state.rounds}</strong><small>correct picks</small></div>
        </div>

        <div class="blind-grid ${state.revealed ? 'is-revealed' : ''}">
          ${blindCard(a, 'A', 0)}
          <div class="blind-versus">VS</div>
          ${blindCard(b, 'B', 1)}
        </div>

        <div id="blindVerdict" class="blind-verdict" aria-live="polite">
          ${state.revealed ? blindVerdict(a, b) : '<span>Tap the résumé you believe belongs higher on the UFC-only GOAT list.</span>'}
        </div>
        ${state.revealed ? '<button id="blindNext" type="button" class="play-finish">Next Matchup</button>' : ''}
      </section>`;
  }

  function blindCard(fighter, label, index) {
    const selected = state.selected === index;
    return `
      <button type="button" class="blind-card ${selected ? 'is-selected' : ''}" data-blind-choice="${index}" ${state.revealed ? 'disabled' : ''}>
        <div class="blind-card-top">
          ${state.revealed ? photoMarkup(fighter, 'blind-photo') : `<div class="blind-letter">${label}</div>`}
          <div>
            <span>${state.revealed ? `Official #${officialRank(fighter)}` : `Fighter ${label}`}</span>
            <strong>${state.revealed ? escapeHtml(fighter.fighter) : 'Anonymous Résumé'}</strong>
          </div>
        </div>
        <div class="blind-stat-list">
          ${blindStats(fighter).map(([stat, value]) => `<div><small>${escapeHtml(stat)}</small><strong>${escapeHtml(value)}</strong></div>`).join('')}
        </div>
        <span class="blind-pick-label">${state.revealed ? (officialRank(fighter) < officialRank(state.pair[index === 0 ? 1 : 0]) ? 'Higher-ranked résumé' : 'Lower-ranked résumé') : 'Choose this résumé'}</span>
      </button>`;
  }

  function categoryLeaders(a, b) {
    const categories = [
      ['championship', 'Championship'],
      ['opponentQuality', 'Quality Wins'],
      ['primeDominance', 'Prime Dominance'],
      ['longevity', 'Longevity'],
      ['penalty', 'Loss Context']
    ];
    const aEdges = [];
    const bEdges = [];
    categories.forEach(([key, label]) => {
      const aValue = typeof categoryOvr === 'function' ? categoryOvr(a, key) : Number(a[key] || 0);
      const bValue = typeof categoryOvr === 'function' ? categoryOvr(b, key) : Number(b[key] || 0);
      if (aValue > bValue) aEdges.push(label);
      if (bValue > aValue) bEdges.push(label);
    });
    return { aEdges, bEdges };
  }

  function blindVerdict(a, b) {
    const winner = officialRank(a) < officialRank(b) ? a : b;
    const loser = winner === a ? b : a;
    const correct = state.selected !== null && state.pair[state.selected] === winner;
    const edges = categoryLeaders(winner, loser);
    const winnerEdges = winner === a ? edges.aEdges : edges.bEdges;
    const loserEdges = winner === a ? edges.bEdges : edges.aEdges;
    return `
      <div class="blind-result ${correct ? 'is-correct' : 'is-wrong'}">
        <span>${correct ? 'You got it' : 'Résumé trap'}</span>
        <h4>${escapeHtml(winner.fighter)} ranks higher, #${officialRank(winner)} to #${officialRank(loser)}.</h4>
        <p><strong>Why the winner wins:</strong> ${escapeHtml(winner.fighter)} holds the stronger model edge in ${escapeHtml(winnerEdges.slice(0, 3).join(', ') || 'overall résumé balance')}.</p>
        <p><strong>The counterargument:</strong> ${escapeHtml(loser.fighter)} still leads in ${escapeHtml(loserEdges.slice(0, 2).join(', ') || 'a narrower peak case')}, which is why the matchup is debatable.</p>
      </div>`;
  }

  function bindBlindResume() {
    root.querySelectorAll('[data-blind-choice]').forEach(button => {
      button.addEventListener('click', () => {
        if (state.revealed) return;
        state.selected = Number(button.dataset.blindChoice);
        const pair = ensurePair();
        const winnerIndex = officialRank(pair[0]) < officialRank(pair[1]) ? 0 : 1;
        state.rounds += 1;
        if (state.selected === winnerIndex) state.correct += 1;
        state.revealed = true;
        render();
      });
    });

    document.getElementById('blindNext')?.addEventListener('click', () => {
      nextPair();
      render();
    });
  }

  render();
})();
