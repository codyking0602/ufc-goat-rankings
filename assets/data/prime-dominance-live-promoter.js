// Promotes the audited Prime Dominance model into live category scores and GOAT totals.
(function(){
  const VERSION = 'prime-dominance-live-promoter-20260708c';
  let applying = false;

  function applyPrimeDominanceLive(){
    if(applying) return;
    const DATA = window.RANKING_DATA;
    const base = window.UFC_PRIME_DOMINANCE_LEDGERS;
    const report = base?.report || window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report || [];
    if(!DATA || !report.length) return;
    applying = true;

    function round(v){ return Math.round((Number(v || 0) + Number.EPSILON) * 100) / 100; }
    function scoreTotal(row){
      return round(Number(row.championship || 0) + Number(row.opponentQuality || 0) + Number(row.primeDominance || 0) + Number(row.longevity || 0) + Number(row.penalty || 0));
    }
    function profileFor(name){ return (DATA.fighters || []).find(f => f.fighter === name); }
    function boardFor(row){ return row.leaderboard === 'women' ? DATA.women : DATA.men; }
    function dynamicOvr(row){
      const allRows = [...(DATA.men || []), ...(DATA.women || [])];
      const max = Math.max(...allRows.map(x => Number(x.totalScore || 0)), 1);
      return Math.max(60, Math.min(99, Math.round(75 + (Number(row.totalScore || 0) / max) * 24)));
    }
    function categoryRank(row, key){
      const board = boardFor(row) || [];
      const val = Number(row[key] || 0);
      return 1 + board.filter(x => Number(x[key] || 0) > val).length;
    }
    function categoryOvr(row, key){
      const board = boardFor(row) || [];
      const rank = categoryRank(row, key);
      if(board.length <= 1) return 99;
      return Math.max(55, Math.min(99, Math.round(99 - ((rank - 1) / (board.length - 1)) * 44)));
    }
    function roundsWonText(entry){
      const audit = entry?.roundControlAudit;
      if(audit?.roundsWon !== undefined && audit?.roundsCounted !== undefined){
        return `${audit.roundsWon}/${audit.roundsCounted} (${entry.roundControlPct}%)`;
      }
      if(entry?.roundControlPct !== undefined) return `${entry.roundControlPct}%`;
      return '—';
    }
    function finishRateText(entry){
      if(entry?.primeFinishes !== undefined && entry?.primeFights){
        return `${entry.primeFinishRate}% (${entry.primeFinishes}/${entry.primeFights})`;
      }
      if(entry?.primeFinishRate !== undefined) return `${entry.primeFinishRate}%`;
      return '—';
    }
    function upsertProfileScore(row, entry){
      const profile = profileFor(row.fighter);
      if(!profile) return;
      profile.rank = row.rank;
      profile.totalScore = row.totalScore;
      profile.primeDominance = row.primeDominance;
      profile.primeDominanceLiveAudit = entry;
      profile.primeDominanceShadowAudit = entry;
      profile.primeRecord = entry.primeRecord || profile.primeRecord;
      profile.roundsWonPct = entry.roundControlPct ?? profile.roundsWonPct;
      profile.primeFinishRatePct = entry.primeFinishRate ?? profile.primeFinishRatePct;
      if(entry.roundControlAudit?.roundsWon !== undefined){
        profile.primeRoundsWon = entry.roundControlAudit.roundsWon;
        profile.primeRoundsCounted = entry.roundControlAudit.roundsCounted;
      }
      if(entry.primeFinishes !== undefined){
        profile.primeFinishes = entry.primeFinishes;
        profile.primeFights = entry.primeFights;
      }
    }
    function snapshotFor(row, entry){
      const profile = profileFor(row.fighter) || row;
      return [
        ['UFC Record', profile.ufcRecord || row.ufcRecord || '—'],
        ['UFC All-Time Rank', `#${row.rank || '—'}`],
        ['GOAT Score', Number(row.totalScore || 0).toFixed(2)],
        ['Prime Dominance', `${Number(row.primeDominance || 0).toFixed(2)} / 30`],
        ['Prime Record', entry?.primeRecord || profile.primeRecord || '—'],
        ['Rounds Won', roundsWonText(entry)],
        ['Prime Finish Rate', finishRateText(entry)],
        ['Active Elite Years', row.activeEliteYears !== undefined ? Number(row.activeEliteYears).toFixed(2) : (profile.activeEliteYears !== undefined ? Number(profile.activeEliteYears).toFixed(2) : '—')]
      ];
    }

    const entriesByName = Object.fromEntries(report.map(entry => [entry.fighter, entry]));
    const liveRows = [...(DATA.men || []), ...(DATA.women || [])];

    liveRows.forEach(row => {
      const entry = entriesByName[row.fighter];
      if(!entry) return;
      row.primeDominance = round(entry.total);
      row.primeDominanceLiveAudit = entry;
      row.primeDominanceShadowAudit = entry;
      row.primeRecord = entry.primeRecord || row.primeRecord;
      row.roundsWonPct = entry.roundControlPct ?? row.roundsWonPct;
      row.primeFinishRatePct = entry.primeFinishRate ?? row.primeFinishRatePct;
      row.totalScore = scoreTotal(row);
    });

    function rerank(rows){
      rows.sort((a,b) => Number(b.totalScore || 0) - Number(a.totalScore || 0) || String(a.fighter).localeCompare(String(b.fighter)));
      rows.forEach((row, idx) => { row.rank = idx + 1; });
    }
    rerank(DATA.men || []);
    rerank(DATA.women || []);

    [...(DATA.men || []), ...(DATA.women || [])].forEach(row => {
      const entry = entriesByName[row.fighter];
      if(entry) upsertProfileScore(row, entry);
      if(typeof DISPLAY_OVERRIDES !== 'undefined'){
        DISPLAY_OVERRIDES[row.fighter] = DISPLAY_OVERRIDES[row.fighter] || {};
        const o = DISPLAY_OVERRIDES[row.fighter];
        o.allTimeRank = row.rank;
        o.overallOvr = dynamicOvr(row);
        if(entry){
          o.snapshot = snapshotFor(row, entry);
          o.snapshotStats = {
            ...(o.snapshotStats || {}),
            primeDominance: row.primeDominance,
            primeDominanceLive: row.primeDominance,
            primeFinishRate: finishRateText(entry),
            roundControl: `${entry.roundControlPct}%`,
            roundsWon: roundsWonText(entry),
            dominanceProfile: entry.dominanceProfile
          };
        }
        const cats = o.categories || {};
        ['championship','opponentQuality','primeDominance','longevity','penalty'].forEach(key => {
          cats[key] = { ovr: categoryOvr(row, key), rank: categoryRank(row, key) };
        });
        o.categories = cats;
      }
    });

    DATA.primeDominanceLiveVersion = VERSION;
    DATA.liveScoreMode = 'prime-dominance-live';
    window.UFC_LIVE_SCORE_PROMOTION = {
      version: VERSION,
      promoted: Object.keys(entriesByName),
      menTopFive: (DATA.men || []).slice(0,5).map(r => ({fighter:r.fighter,totalScore:r.totalScore,rank:r.rank})),
      womenTopFive: (DATA.women || []).slice(0,5).map(r => ({fighter:r.fighter,totalScore:r.totalScore,rank:r.rank}))
    };
    document.documentElement.setAttribute('data-prime-dominance-live', VERSION);
    applying = false;
  }

  window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER = {version: VERSION, apply: applyPrimeDominanceLive};
  applyPrimeDominanceLive();

  if(typeof refresh === 'function' && !refresh.__primeDominanceLiveWrapped){
    const oldRefresh = refresh;
    refresh = function(){
      applyPrimeDominanceLive();
      return oldRefresh();
    };
    refresh.__primeDominanceLiveWrapped = true;
  }

  if(typeof refresh === 'function'){
    try{ refresh(); }catch(e){}
  }
})();
