// Phase 2 safe data layer.
// Data only: patch rankings/profiles without owning Compare Mode rendering.

(function () {
  const data = window.RANKING_DATA;
  if (!data) return;

  const PATCH_VERSION = 'phase2-data-only-yan-2026-07-01';

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

  function repairLegacyState(profile) {
    try {
      if (typeof byName !== 'undefined' && byName && typeof byName === 'object') byName[profile.fighter] = profile;
    } catch (error) {}

    try {
      if (typeof allProfiles !== 'undefined' && Array.isArray(allProfiles) && !allProfiles.some(f => f.fighter === profile.fighter)) {
        allProfiles.push(profile);
      }
    } catch (error) {}

    try {
      if (typeof menNames !== 'undefined' && menNames && typeof menNames.add === 'function') menNames.add(profile.fighter);
      if (typeof womenNames !== 'undefined' && womenNames && typeof womenNames.delete === 'function') womenNames.delete(profile.fighter);
    } catch (error) {}

    try {
      if (typeof DISPLAY_OVERRIDES !== 'undefined' && DISPLAY_OVERRIDES && typeof DISPLAY_OVERRIDES === 'object') {
        DISPLAY_OVERRIDES['Petr Yan'] = {
          ...(DISPLAY_OVERRIDES['Petr Yan'] || {}),
          overallOvr: scoreToOvr(profile.totalScore),
          allTimeRank: profile.rank,
          divisionLabel: 'BW',
          resumeTag: 'Modern bantamweight title case',
          oneLiner: 'A modern bantamweight title case with elite skill, strong round control, and unusual DQ context that needs more nuance than a normal loss.',
          categories: {
            championship: { ovr: 78, rank: 20 },
            opponentQuality: { ovr: 86, rank: 10 },
            primeDominance: { ovr: 91, rank: 8 },
            longevity: { ovr: 82, rank: 20 }
          },
          snapshot: [
            ['UFC Record', profile.ufcRecord || '12-4'],
            ['UFC Title-Fight Wins', '2 adjusted title-win credit'],
            ['Championship Level', 'Former Bantamweight Champion'],
            ['Quality Wins', 'Aldo and Sandhagen anchor the case'],
            ['Prime Record', profile.primeRecord || '7-4 in title/elite window'],
            ['Active Elite Years', '6.0 Elite Years'],
            ['Loss Context', 'Sterling DQ and elite-loss context need nuance']
          ],
          whyRankedHere: 'Yan ranks here because his UFC-only case has real bantamweight title value, strong elite-round control, and enough quality-win/context credit to belong in the all-time conversation rather than being hidden by the messy Sterling rivalry.',
          whyNotHigher: 'He does not climb higher because the championship volume is limited and the official loss column is heavy for an all-time case, even when several losses have strong context.',
          keyJudgmentCalls: [
            ['Sterling DQ', 'treated with special context instead of like a normal competitive title loss.'],
            ['Sandhagen win', 'important interim-title and elite contender value.'],
            ['Aldo win', 'vacant title win over an elite former champion, but not prime Aldo at featherweight.'],
            ['Later losses', 'count against the resume, but without finish add-ons where appropriate.'],
            ['Bantamweight depth', 'modern bantamweight is treated as a strong division context.']
          ],
          finalTakeaway: 'Yan is a legit modern bantamweight title case: not a top-tier GOAT resume, but clearly strong enough that he should appear in the ranking and compare mode.'
        };
      }
    } catch (error) {}
  }

  function applyPhase2Data() {
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

    upsertRow('men', yan);
    const yanProfile = upsertProfile({
      ...yan,
      title: { adjustedTitleWins: 2.65, notes: 'UFC bantamweight champion with elite title-race context. Sterling DQ is handled with reduced context.' },
      opponents: [
        { opponent: 'Jose Aldo', division: 'Bantamweight', context: 'Vacant title win / elite former champion', credit: 1.0 },
        { opponent: 'Cory Sandhagen', division: 'Bantamweight', context: 'Interim title win / top contender', credit: 1.0 }
      ],
      rounds: []
    });

    repairLegacyState(yanProfile);
    sortBoards();
    syncCompareSelects();

    const fighterCount = document.getElementById('fighterCount');
    if (fighterCount && Array.isArray(data.fighters)) fighterCount.textContent = data.fighters.length;
  }

  function refreshBoardsOnly() {
    applyPhase2Data();
    if (typeof renderList === 'function') {
      renderList('menList', data.men || []);
      renderList('womenList', data.women || []);
    }
    if (typeof setKpis === 'function') {
      setKpis('menStats', data.men || []);
      setKpis('womenStats', data.women || []);
    }
    if (typeof renderDivision === 'function') renderDivision();
    document.documentElement.setAttribute('data-phase2-data-patch', PATCH_VERSION);
    window.UFC_PHASE2_DATA_STATUS = {
      version: PATCH_VERSION,
      petrYanInMen: Array.isArray(data.men) && data.men.some(f => f.fighter === 'Petr Yan'),
      petrYanInProfiles: Array.isArray(data.fighters) && data.fighters.some(f => f.fighter === 'Petr Yan'),
      appliedAt: new Date().toISOString()
    };
  }

  window.UFC_RANKING_DATA_PATCHES_V1 = {
    meta: {
      purpose: 'Phase 2 modular-refactor-v2-safe ranking data patch layer',
      note: 'Data-only layer. Compare Mode is owned by COMPARE_PROFILES and COMPARE_FIGHT_LEDGER.',
      updated: '2026-07-01',
      version: PATCH_VERSION
    },
    apply: applyPhase2Data
  };

  window.UFC_PHASE2_DATA_REFRESH = refreshBoardsOnly;
  refreshBoardsOnly();
})();
