(function () {
  const $ = id => document.getElementById(id);
  const board = window.FIGHTER_DATA || window.PROVISIONAL_LAUNCH_BOARD_V1 || { men: [], women: [] };
  const compareProfiles = () => window.COMPARE_PROFILES || {};
  const fightLedger = () => window.COMPARE_FIGHT_LEDGER || {};

  function normalizeKey(a, b) {
    return [String(a || '').toLowerCase(), String(b || '').toLowerCase()].sort().join('|');
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  function rows(scope) {
    return scope === 'women' ? board.women : board.men;
  }

  function allRows() {
    return [
      ...(board.men || []).map(row => ({ ...row, leaderboard: 'men' })),
      ...(board.women || []).map(row => ({ ...row, leaderboard: 'women' }))
    ];
  }

  function findFighter(name) {
    return allRows().find(row => row.fighter === name) || null;
  }

  function profileFor(name) {
    return compareProfiles()[name] || {};
  }

  function fighterSlug(name) {
    return String(name || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function fighterInitials(name) {
    return String(name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  function photoUrls(row) {
    const profile = profileFor(row.fighter);
    const slug = profile.slug || row.slug || fighterSlug(row.fighter);
    return {
      profile: profile.photoUrl || row.photoUrl || `assets/fighters/${slug}.webp`,
      profileFallback: profile.photoFallbackUrl || row.photoFallbackUrl || `assets/fighters/${slug}-profile.webp`,
      thumb: profile.thumbUrl || row.thumbUrl || `assets/fighters/${slug}-thumb.webp`
    };
  }

  function rowPhoto(row) {
    const urls = photoUrls(row);
    return `<div class="row-photo"><span>${esc(fighterInitials(row.fighter))}</span><img src="${esc(urls.thumb)}" alt="" loading="lazy" onerror="this.remove()"></div>`;
  }

  function profilePhoto(row) {
    const urls = photoUrls(row);
    return `<div class="fighter-photo">
      <div class="photo-initials">${esc(fighterInitials(row.fighter))}</div>
      <img src="${esc(urls.profile)}" data-fallback="${esc(urls.profileFallback)}" alt="${esc(row.fighter)} profile photo" class="fighter-photo-img" loading="lazy" onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.dataset.fallback='';}else{this.remove();}">
    </div>`;
  }

  function ovr(row) {
    return row?.ovr ?? Math.round(75 + ((Number(row?.score || 0) / 88.7) * 24));
  }

  function renderKpis(scope) {
    const list = rows(scope);
    const top = list[0];
    $(scope + 'Stats').innerHTML = [
      ['Fighters', list.length],
      ['Top OVR', top ? `${ovr(top)} ${top.fighter}` : '—'],
      ['Top Score', top ? Number(top.score).toFixed(2) : '—']
    ].map(([label, value]) => `<div class="kpi"><span>${esc(value)}</span><small>${esc(label)}</small></div>`).join('');
  }

  function renderList(id, scope) {
    const q = $('search').value.trim().toLowerCase();
    const list = rows(scope).filter(row => !q || row.fighter.toLowerCase().includes(q));

    $(id).innerHTML = list.map(row => {
      const profile = profileFor(row.fighter);
      return `<article class="row fighter-row" data-fighter="${esc(row.fighter)}">
        <div class="rank">#${esc(row.rank)}</div>
        ${rowPhoto(row)}
        <div class="row-main">
          <div class="name">${esc(row.fighter)}</div>
          <div class="meta">Score ${Number(row.score).toFixed(2)} · ${esc(row.source || 'current')}</div>
          <div class="resume-tag">${esc(profile.titleStyle || row.source || 'UFC résumé')}</div>
        </div>
        <div class="score">${esc(ovr(row))} <span class="meta">OVR</span></div>
        <div class="review">${esc(profile.shortCase || row.review || 'Profile copy pending.')}</div>
      </article>`;
    }).join('') || '<div class="notice">No fighters match that search.</div>';

    document.querySelectorAll(`#${id} .row`).forEach(row => {
      row.addEventListener('click', () => openFighter(row.dataset.fighter));
    });
  }

  function fillCompare() {
    const scope = $('compareScope').value;
    const names = rows(scope).map(row => row.fighter);

    ['fighterA', 'fighterB'].forEach((id, index) => {
      const select = $(id);
      const current = select.value;
      select.innerHTML = names.map(name => `<option value="${esc(name)}">${esc(name)}</option>`).join('');
      select.value = names.includes(current) ? current : names[index] || '';
    });
  }

  function ledgerFor(a, b) {
    return fightLedger()[normalizeKey(a, b)] || null;
  }

  function verdict(a, b) {
    if (!a || !b) return 'Pick two fighters.';
    if (a.score === b.score) return `${a.fighter} and ${b.fighter} are basically tied.`;
    const winner = a.score > b.score ? a : b;
    const loser = a.score > b.score ? b : a;
    return `${winner.fighter} has the stronger UFC-only résumé over ${loser.fighter}.`;
  }

  function compareCard(row) {
    const profile = profileFor(row.fighter);
    return `<div class="card">
      <h3>${esc(row.fighter)}</h3>
      <p><span class="badge">#${esc(row.rank)}</span><span class="badge">${esc(ovr(row))} OVR</span><span class="badge">${Number(row.score).toFixed(2)} score</span></p>
      <p>${esc(profile.shortCase || row.review || 'Comparison profile pending.')}</p>
      ${profile.edge ? `<p><strong>Wins comparisons when:</strong> ${esc(profile.edge)}</p>` : ''}
      ${profile.counter ? `<p><strong>Pushback:</strong> ${esc(profile.counter)}</p>` : ''}
    </div>`;
  }

  function renderCompare() {
    const a = findFighter($('fighterA').value);
    const b = findFighter($('fighterB').value);

    if (!a || !b) {
      $('compareResult').innerHTML = '<div class="notice">Pick two fighters.</div>';
      return;
    }

    if (a.leaderboard !== b.leaderboard) {
      $('compareResult').innerHTML = '<div class="notice">Men and women stay separate in this ranking.</div>';
      return;
    }

    const ledger = ledgerFor(a.fighter, b.fighter);
    const leader = a.score >= b.score ? a : b;
    const gap = Math.abs(Number(a.score) - Number(b.score)).toFixed(2);

    $('compareResult').innerHTML = `
      <div class="card compare-hero">
        <h3>Verdict</h3>
        <div class="verdict">${esc(verdict(a, b))}</div>
        <p>${esc(leader.fighter)} leads by ${gap} raw-score points in the current scoring table. This view uses Compare Profiles plus direct fight/rivalry context when there is one.</p>
      </div>
      ${ledger ? `<div class="card compare-hero"><h3>Direct fight / rivalry context</h3><p><span class="badge">${esc(ledger.winner)} direct edge</span><span class="badge">${esc(ledger.importance)}</span></p><p>${esc(ledger.summary)}</p></div>` : ''}
      ${compareCard(a)}
      ${compareCard(b)}
    `;
  }

  function openFighter(name) {
    const row = findFighter(name);
    if (!row) return;

    const profile = profileFor(row.fighter);
    const stats = [
      ['Rank', `#${row.rank}`],
      ['OVR', ovr(row)],
      ['Raw score', Number(row.score).toFixed(2)],
      ['Source', row.source || 'current'],
      ['Title style', profile.titleStyle || 'TBD'],
      ['Prime style', profile.primeStyle || 'TBD']
    ];

    $('fighterDetail').innerHTML = `
      <button id="closeDrawerInner" class="close">×</button>
      <section class="profile-hero">
        ${profilePhoto(row)}
        <div class="profile-summary">
          <div class="profile-topline"><span class="profile-pill gold">UFC All-Time Rank: #${esc(row.rank)}</span><span class="profile-pill">${esc(row.leaderboard === 'women' ? 'Women' : 'Men')}</span></div>
          <h2>${esc(row.fighter)}</h2>
          <div class="profile-ovr">${esc(ovr(row))} <small>OVR</small></div>
          <p class="profile-copy">${esc(profile.shortCase || row.review || 'Profile copy pending.')}</p>
        </div>
      </section>
      <div class="card"><h3>Snapshot</h3><div class="snapshot-grid">${stats.map(([key, value]) => `<div class="snapshot-item"><strong>${esc(value)}</strong><small>${esc(key)}</small></div>`).join('')}</div></div>
      <div class="card"><h3>Best argument</h3><p>${esc(profile.resume || profile.edge || row.review || 'Pending.')}</p></div>
      <div class="card"><h3>Title context</h3><p>${esc(profile.titleSummary || profile.championship || 'Pending.')}</p></div>
      <div class="card"><h3>Prime identity</h3><p>${esc(profile.primeSummary || profile.peak || 'Pending.')}</p></div>
      <div class="card"><h3>Signature wins</h3><p>${esc(profile.signatureWins || 'Pending.')}</p></div>
      <div class="card"><h3>Why not higher?</h3><p>${esc(profile.counter || row.review || 'The fighters above have more total score weight in the current scoring table.')}</p></div>
    `;

    $('drawer').classList.add('open');
    $('drawer').setAttribute('aria-hidden', 'false');
    $('closeDrawerInner').addEventListener('click', closeDrawer);
  }

  function closeDrawer() {
    $('drawer').classList.remove('open');
    $('drawer').setAttribute('aria-hidden', 'true');
  }

  function renderRules() {
    $('rulesContent').innerHTML = `
      <div class="card"><h3>Current file structure</h3><ul class="list"><li><strong>index.html</strong> is the shell.</li><li><strong>assets/css/styles.css</strong> controls the look.</li><li><strong>assets/css/photo-fix.css</strong> controls fighter photos.</li><li><strong>assets/js/app.js</strong> controls rendering.</li><li><strong>assets/data/fighters.js</strong> controls scores and ranks.</li><li><strong>compare packs</strong> control Compare Profiles and Fight Ledger entries.</li></ul></div>
      <div class="card"><h3>Photo workflow</h3><p>Drop two files into assets/fighters: fighter-slug.webp for the profile photo and fighter-slug-thumb.webp for the ranking-card thumbnail. The app builds the paths automatically from the fighter name.</p></div>
      <div class="card"><h3>Compare Mode</h3><p>Compare Mode uses fighter identity profiles plus direct fight/rivalry context. Men and women stay separate.</p></div>
    `;
  }

  function refresh() {
    renderKpis('men');
    renderKpis('women');
    renderList('menList', 'men');
    renderList('womenList', 'women');
    fillCompare();
    renderCompare();
    renderRules();
    $('fighterCount').textContent = allRows().length;
  }

  function init() {
    document.querySelectorAll('.tab').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active-view'));
        button.classList.add('active');
        $(button.dataset.view).classList.add('active-view');
        refresh();
      });
    });

    $('search').addEventListener('input', refresh);
    $('resetBtn').addEventListener('click', () => { $('search').value = ''; refresh(); });
    $('compareScope').addEventListener('change', () => { fillCompare(); renderCompare(); });
    $('fighterA').addEventListener('change', renderCompare);
    $('fighterB').addEventListener('change', renderCompare);
    $('closeDrawer').addEventListener('click', closeDrawer);
    $('drawer').addEventListener('click', event => { if (event.target.id === 'drawer') closeDrawer(); });
    refresh();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
