// Phase 1 safe data layer.
// Patch layer only: keep the old product layout intact while moving score/profile fixes outside index.html.

(function () {
  const data = window.RANKING_DATA;
  if (!data) return;

  function findRow(boardName, fighterName) {
    const board = data && data[boardName];
    if (!Array.isArray(board)) return null;
    return board.find(row => row.fighter === fighterName) || null;
  }

  function patchRow(boardName, fighterName, patch) {
    const row = findRow(boardName, fighterName);
    if (!row) return null;
    Object.assign(row, patch);
    return row;
  }

  function upsertRow(boardName, row) {
    const board = data[boardName] = Array.isArray(data[boardName]) ? data[boardName] : [];
    const existing = board.find(item => item.fighter === row.fighter);
    if (existing) {
      Object.assign(existing, row);
      return existing;
    }
    board.push(row);
    return row;
  }

  function upsertProfile(profile) {
    data.fighters = Array.isArray(data.fighters) ? data.fighters : [];
    const existing = data.fighters.find(item => item.fighter === profile.fighter);
    if (existing) {
      Object.assign(existing, profile);
      return existing;
    }
    data.fighters.push(profile);
    return profile;
  }

  function scoreToOvr(score) {
    return Math.max(60, Math.min(99, Math.round(75 + (Number(score || 0) / 88.7) * 24)));
  }

  function sortBoards() {
    ['men', 'women'].forEach(boardName => {
      if (Array.isArray(data[boardName])) {
        data[boardName].sort((a, b) => Number(a.rank || 999) - Number(b.rank || 999));
      }
    });
  }

  function syncCompareSelects() {
    const names = Array.from(new Set([
      ...(Array.isArray(data.fighters) ? data.fighters.map(f => f.fighter) : []),
      ...(Array.isArray(data.men) ? data.men.map(f => f.fighter) : []),
      ...(Array.isArray(data.women) ? data.women.map(f => f.fighter) : [])
    ])).filter(Boolean).sort();

    ['fighterA', 'fighterB'].forEach(id => {
      const select = document.getElementById(id);
      if (!select) return;
      const current = select.value;
      const existing = new Set([...select.options].map(option => option.value));
      names.forEach(name => {
        if (!existing.has(name)) {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          select.appendChild(option);
        }
      });
      [...select.options]
        .sort((a, b) => a.textContent.localeCompare(b.textContent))
        .forEach(option => select.appendChild(option));
      if (names.includes(current)) select.value = current;
    });
  }

  const yan = {
    rank: 16,
    fighter: 'Petr Yan',
    totalScore: 43.35,
    championship: 5.04,
    opponentQuality: 13.10,
    primeDominance: 21.43,
    longevity: 5.98,
    penalty: -5.25,
    leaderboard: 'men',
    gender: 'Men',
    ufcRecord: '12-4',
    primaryDivision: 'Bantamweight',
    secondaryDivision: '',
    finishRatePct: 18.2,
    activeEliteYears: 5.98,
    timesFinishedPrime: 0,
    primeRecord: '7-4 in title/elite window',
    roundsWonPct: 65.2,
    notes: 'Audited bantamweight title case. Sterling DQ context reduced, later elite losses counted without finish add-ons.'
  };

  function applyPhase1Data() {
    patchRow('men', 'Georges St-Pierre', {
      timesFinishedPrime: 1,
      primeRecord: '18-1 after first Hughes loss; Serra is the counted prime finish loss',
      notes: 'Hughes 2004 is an early elite loss. Serra 2007 is the counted prime finished loss, then avenged decisively.'
    });

    const gspProfile = (data.fighters || []).find(f => f.fighter === 'Georges St-Pierre');
    if (gspProfile) {
      Object.assign(gspProfile, {
        timesFinishedPrime: 1,
        primeRecord: '18-1 after first Hughes loss; Serra is the counted prime finish loss',
        notes: 'Hughes 2004 is an early elite loss. Serra 2007 is the counted prime finished loss, then avenged decisively.'
      });
    }

    patchRow('men', 'Charles Oliveira', {
      rank: 24,
      totalScore: 40.13,
      championship: 5.32,
      opponentQuality: 17.85,
      primeDominance: 20.96,
      longevity: 5.99,
      penalty: -10.0
    });

    patchRow('men', 'Ilia Topuria', {
      rank: 15,
      totalScore: 43.44,
      championship: 5.99,
      opponentQuality: 13.10,
      primeDominance: 23.60,
      longevity: 2.97,
      penalty: -2.25
    });

    upsertRow('men', yan.fighter, yan);
    upsertProfile({
      ...yan,
      title: { adjustedTitleWins: 2.65, notes: 'UFC bantamweight champion with elite title-race context. Sterling DQ is handled with reduced context.' },
      opponents: [
        { opponent: 'Jose Aldo', division: 'Bantamweight', context: 'Vacant title win / elite former champion' },
        { opponent: 'Cory Sandhagen', division: 'Bantamweight', context: 'Interim title win / top contender' }
      ],
      rounds: []
    });

    sortBoards();
    syncCompareSelects();
  }

  window.UFC_RANKING_DATA_PATCHES_V1 = {
    meta: {
      purpose: 'Phase 1 modular-refactor-v2-safe ranking data patch layer',
      note: 'Keeps old UI intact while allowing fighter scoring fixes outside index.html.',
      updated: '2026-07-01'
    },
    apply: applyPhase1Data
  };

  function fighterByName(name) {
    const row = (data.men || []).find(f => f.fighter === name) || (data.women || []).find(f => f.fighter === name) || {};
    const profile = (data.fighters || []).find(f => f.fighter === name) || {};
    return { ...profile, ...row, fighter: name };
  }

  function rankLabel(f) {
    return f.rank ? '#' + f.rank : 'unranked';
  }

  function shortCase(f) {
    const cases = {
      'Jon Jones': 'The UFC-only benchmark: unmatched title-fight volume, elite LHW run, heavyweight chapter, and no true competitive loss in the scoring rules.',
      'Georges St-Pierre': 'The complete resume case: all-time welterweight reign, best quality-wins argument, and decisive revenge over the two losses that define the debate.',
      'Petr Yan': 'A modern bantamweight title case with elite skill, strong round control, and unusual DQ context that needs more nuance than a normal loss.',
      'Aljamain Sterling': 'A real bantamweight title-reign case with strong grappling control, but the Yan DQ, Dillashaw context, and O’Malley finish loss need explanation.',
      'Ilia Topuria': 'A short but explosive two-division peak case built on Volk, Max, and Charles-level wins, with limited longevity compared to the legends.',
      'Alexander Volkanovski': 'The complete featherweight champion case: elite title consistency, Max trilogy value, and reduced upward-division Islam loss context.',
      'Charles Oliveira': 'A modern lightweight quality-wins and finishing case with huge opponent value, held back by loss volume and a shorter undisputed reign.',
      'Dustin Poirier': 'A lightweight quality-wins monster with elite longevity and violence, but no undisputed UFC title win keeps a clear ceiling.'
    };
    return cases[f.fighter] || `${f.fighter} is graded by UFC title success, quality wins, prime dominance, elite longevity, and loss context.`;
  }

  function directContext(a, b) {
    const key = [a, b].sort().join('|');
    const ledger = {
      'Aljamain Sterling|Petr Yan': 'Direct rivalry context: Sterling officially holds the 2-0 UFC edge, but the first title win came by DQ and the rematch was close enough that this needs special debate context, not a simple category table.',
      'Alexander Volkanovski|Ilia Topuria': 'Direct fight context: Topuria has the head-to-head title win over Volkanovski, but Volk still owns the deeper total UFC featherweight championship resume.',
      'Charles Oliveira|Dustin Poirier': 'Direct fight context: Oliveira finished Poirier in a UFC lightweight title fight, which is a major direct edge inside a very strong lightweight resume debate.',
      'Georges St-Pierre|Jon Jones': 'No direct fight context. This is resume versus resume: Jones has the stronger title-volume case, while GSP has the cleaner complete champion and quality-wins argument.'
    };
    return ledger[key] || '';
  }

  function patchedRenderCompare() {
    applyPhase1Data();
    const fighterA = document.getElementById('fighterA');
    const fighterB = document.getElementById('fighterB');
    const target = document.getElementById('compareResult');
    if (!fighterA || !fighterB || !target) return;

    const a = fighterByName(fighterA.value);
    const b = fighterByName(fighterB.value);
    const aScore = Number(a.totalScore || 0);
    const bScore = Number(b.totalScore || 0);
    const winner = aScore >= bScore ? a : b;
    const loser = aScore >= bScore ? b : a;
    const gap = Math.abs(aScore - bScore).toFixed(2);
    const context = directContext(a.fighter, b.fighter);

    target.innerHTML = `
      <div class="card" style="grid-column:1/-1">
        <h3>Verdict</h3>
        <p><strong>${winner.fighter}</strong> has the stronger UFC-only resume over ${loser.fighter} in the current scoring table.</p>
        <p class="meta">${winner.fighter} leads by ${gap} raw-score points. Raw score is shown here for branch testing only; the normal product should keep OVR front-facing.</p>
      </div>
      ${context ? `<div class="card" style="grid-column:1/-1"><h3>Direct fight / rivalry context</h3><p>${context}</p></div>` : ''}
      <div class="card"><h3>${a.fighter}</h3><p><span class="badge">${rankLabel(a)}</span> <span class="badge">${scoreToOvr(a.totalScore)} OVR</span> <span class="badge">${aScore.toFixed(2)} raw</span></p><p>${shortCase(a)}</p></div>
      <div class="card"><h3>${b.fighter}</h3><p><span class="badge">${rankLabel(b)}</span> <span class="badge">${scoreToOvr(b.totalScore)} OVR</span> <span class="badge">${bScore.toFixed(2)} raw</span></p><p>${shortCase(b)}</p></div>
    `;
  }

  function enhanceDrawer(name) {
    const detail = document.getElementById('fighterDetail');
    if (!detail) return;
    if (name === 'Georges St-Pierre' && !detail.querySelector('[data-phase1-gsp-loss]')) {
      const cards = detail.querySelectorAll('.card');
      const anchor = cards[0] || detail.lastElementChild;
      const note = document.createElement('div');
      note.className = 'card';
      note.setAttribute('data-phase1-gsp-loss', 'true');
      note.innerHTML = '<h3>Prime Loss Context</h3><p>Phase 1 check: GSP has <strong>1 counted prime finish loss</strong> in this scoring system — Matt Serra 2007. Hughes 2004 is treated as an early elite loss, and both loss narratives are softened by decisive revenge wins.</p>';
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(note, anchor.nextSibling);
    }
  }

  function forceBoardRefresh() {
    applyPhase1Data();
    if (typeof renderList === 'function') {
      renderList('menList', data.men || []);
      renderList('womenList', data.women || []);
    }
    if (typeof setKpis === 'function') {
      setKpis('menStats', data.men || []);
      setKpis('womenStats', data.women || []);
    }
    if (typeof renderDivision === 'function') renderDivision();
    patchedRenderCompare();
  }

  applyPhase1Data();

  if (typeof renderCompare === 'function') {
    renderCompare = patchedRenderCompare;
    window.renderCompare = patchedRenderCompare;
  }

  if (typeof refresh === 'function') {
    const originalRefresh = refresh;
    refresh = function patchedRefresh() {
      applyPhase1Data();
      originalRefresh();
      syncCompareSelects();
      patchedRenderCompare();
    };
    window.refresh = refresh;
  }

  if (typeof openFighter === 'function') {
    const originalOpenFighter = openFighter;
    openFighter = function patchedOpenFighter(name) {
      originalOpenFighter(name);
      setTimeout(() => enhanceDrawer(name), 0);
    };
    window.openFighter = openFighter;
  }

  document.addEventListener('change', function interceptCompareChange(event) {
    if (event.target && (event.target.id === 'fighterA' || event.target.id === 'fighterB')) {
      event.stopImmediatePropagation();
      setTimeout(patchedRenderCompare, 0);
    }
  }, true);

  document.addEventListener('click', function interceptCompareTab(event) {
    if (event.target && event.target.dataset && event.target.dataset.view === 'compare') {
      setTimeout(patchedRenderCompare, 0);
    }
  }, true);

  window.UFC_PHASE1_FORCE_REFRESH = forceBoardRefresh;
  forceBoardRefresh();
  setTimeout(forceBoardRefresh, 250);
  setTimeout(forceBoardRefresh, 1000);
})();
