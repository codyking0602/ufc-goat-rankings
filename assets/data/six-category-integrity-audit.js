// Read-only full-roster integrity audit for the six-category UFC GOAT model.
// This module must never mutate fighter scores, ranks, OVRs, display overrides, or source ledgers.
(function(){
  'use strict';

  const VERSION = 'six-category-integrity-audit-20260709a';
  const EPSILON = 0.011;
  const WEIGHTS = {
    championship: 35,
    opponentQuality: 27.5,
    primeDominance: 27.5,
    longevity: 10
  };
  const MAXIMUMS = {
    championship: 30,
    opponentQuality: 30,
    primeDominance: 30,
    longevity: 30,
    apexPeak: 6
  };
  const FORBIDDEN_OVERRIDE_FIELDS = [
    'overallOvr',
    'allTimeRank',
    'totalScore',
    'rawScore',
    'championship',
    'opponentQuality',
    'primeDominance',
    'longevity',
    'apexPeak',
    'penalty'
  ];

  function normalizeName(name){
    return String(name || '')
      .trim()
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/\s+/g, ' ');
  }

  function finiteNumber(value){
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  function round2(value){
    const n = finiteNumber(value);
    return n === null ? null : Math.round((n + Number.EPSILON) * 100) / 100;
  }

  function equalWithin(a,b,tolerance=EPSILON){
    const x = finiteNumber(a);
    const y = finiteNumber(b);
    return x !== null && y !== null && Math.abs(x-y) <= tolerance;
  }

  function inRange(value,min,max){
    const n = finiteNumber(value);
    return n !== null && n >= min-EPSILON && n <= max+EPSILON;
  }

  function boardRows(){
    const data = window.RANKING_DATA || {};
    return [
      ...(data.men || []).map(row => ({row, board:'men'})),
      ...(data.women || []).map(row => ({row, board:'women'}))
    ].filter(item => item.row && item.row.fighter);
  }

  function profileRows(){
    return (window.RANKING_DATA?.fighters || []).filter(row => row && row.fighter);
  }

  function groupedByName(rows,unwrap){
    const map = new Map();
    rows.forEach(item => {
      const row = unwrap ? unwrap(item) : item;
      const key = normalizeName(row?.fighter);
      if(!key) return;
      if(!map.has(key)) map.set(key,[]);
      map.get(key).push(item);
    });
    return map;
  }

  function profileFor(name){
    const key = normalizeName(name);
    return profileRows().find(row => normalizeName(row.fighter) === key) || null;
  }

  function expectedFormula(row){
    const championship = finiteNumber(row?.championship);
    const opponentQuality = finiteNumber(row?.opponentQuality);
    const primeDominance = finiteNumber(row?.primeDominance);
    const longevity = finiteNumber(row?.longevity);
    const apexPeak = finiteNumber(row?.apexPeak);
    const penalty = finiteNumber(row?.penalty);
    if([championship,opponentQuality,primeDominance,longevity,apexPeak,penalty].some(v => v === null)) return null;
    return round2(
      (championship / MAXIMUMS.championship) * WEIGHTS.championship +
      (opponentQuality / MAXIMUMS.opponentQuality) * WEIGHTS.opponentQuality +
      (primeDominance / MAXIMUMS.primeDominance) * WEIGHTS.primeDominance +
      (longevity / MAXIMUMS.longevity) * WEIGHTS.longevity +
      apexPeak +
      penalty
    );
  }

  function status(level,source,details,extra={}){
    return {level,source,details,...extra};
  }

  function championshipStatus(row){
    const value = finiteNumber(row.championship);
    const audit = row.championshipResumeAudit || null;
    const formulaScore = finiteNumber(audit?.formulaScore ?? audit?.championshipScore);
    const liveFlag = row.championshipResumeLive === true;
    const rangeOk = inRange(value,0,MAXIMUMS.championship);
    const valueMatchesAudit = formulaScore === null ? null : equalWithin(value,formulaScore);
    if(liveFlag && audit && rangeOk && valueMatchesAudit !== false){
      return status('pass','championship-resume-ledger','Live ledger value reached row.championship.',{value,auditVersion:audit.version || window.UFC_CHAMPIONSHIP_RESUME_LIVE?.version || null,valueMatchesAudit});
    }
    if(rangeOk && audit){
      return status('warning','championship-resume-audit','Audit exists, but the live flag or exact audit match is missing.',{value,auditVersion:audit.version || null,valueMatchesAudit});
    }
    return status('fail','legacy-or-missing','No confirmed live Championship Resume audit reached the row.',{value,auditVersion:audit?.version || null,valueMatchesAudit});
  }

  function qualityStatus(row){
    const value = finiteNumber(row.opponentQuality);
    const audit = row.opponentQualityLiveAudit || row.opponentQualityShadowAudit || null;
    const auditScore = finiteNumber(audit?.liveScore ?? audit?.categoryScore);
    const liveFlag = row.opponentQualityLive === true;
    const rangeOk = inRange(value,0,MAXIMUMS.opponentQuality);
    const valueMatchesAudit = auditScore === null ? null : equalWithin(value,auditScore);
    if(liveFlag && row.opponentQualityLiveAudit && rangeOk && valueMatchesAudit !== false){
      return status('pass','opponent-quality-ledger','Live Quality Wins ledger value reached row.opponentQuality.',{value,auditVersion:audit?.version || window.UFC_OPPONENT_QUALITY_LIVE?.version || null,valueMatchesAudit});
    }
    if(rangeOk && audit){
      return status('warning','opponent-quality-audit','Quality audit exists, but the live flag or exact audit match is missing.',{value,auditVersion:audit?.version || null,valueMatchesAudit});
    }
    return status('fail','legacy-or-missing','No confirmed live Quality Wins audit reached the row.',{value,auditVersion:audit?.version || null,valueMatchesAudit});
  }

  function primeEntry(name,row){
    return row.primeDominanceLiveAudit
      || row.primeDominanceShadowAudit
      || window.UFC_PRIME_DOMINANCE_LEDGERS?.entryFor?.(name)
      || window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report?.find(entry => normalizeName(entry.fighter) === normalizeName(name))
      || null;
  }

  function primeStatus(row){
    const value = finiteNumber(row.primeDominance);
    const audit = primeEntry(row.fighter,row);
    const auditScore = finiteNumber(audit?.total);
    const rangeOk = inRange(value,0,MAXIMUMS.primeDominance);
    const valueMatchesAudit = auditScore === null ? null : equalWithin(value,auditScore);
    if(row.primeDominanceLiveAudit && rangeOk && valueMatchesAudit === true){
      return status('pass','prime-dominance-merged-ledger','Merged audited Prime Dominance value reached row.primeDominance.',{value,auditVersion:audit?.version || window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER?.version || null,valueMatchesAudit});
    }
    if(audit && rangeOk){
      return status('warning','prime-dominance-shadow-or-partial','Prime audit exists, but the row is not confirmed as live or does not exactly match.',{value,auditScore,auditVersion:audit?.version || null,valueMatchesAudit});
    }
    return status('fail','legacy-or-missing','No merged Prime Dominance audit exists for this fighter.',{value,auditScore,auditVersion:audit?.version || null,valueMatchesAudit});
  }

  function longevityStatus(row){
    const value = finiteNumber(row.longevity);
    const audit = row.longevityAudit || null;
    const auditScore = finiteNumber(audit?.raw30);
    const nativeThirty = row.longevityThirtyPoint === true;
    const sourceOk = row.longevitySource === 'fighter-era-ledger';
    const rangeOk = inRange(value,0,MAXIMUMS.longevity);
    const valueMatchesAudit = auditScore === null ? null : equalWithin(value,auditScore);
    if(nativeThirty && sourceOk && audit && rangeOk && valueMatchesAudit !== false){
      return status('pass','fighter-era-ledger','Native /30 Longevity value reached row.longevity.',{value,auditVersion:audit.version || window.UFC_LONGEVITY_LIVE_PROMOTER?.version || null,valueMatchesAudit});
    }
    if(audit && rangeOk){
      return status('warning','longevity-audit','Longevity audit exists, but native /30/live-source confirmation is incomplete.',{value,nativeThirty,source:row.longevitySource || null,auditVersion:audit.version || null,valueMatchesAudit});
    }
    return status('fail','legacy-or-missing','No confirmed live Fighter Era Ledger Longevity value reached the row.',{value,nativeThirty,source:row.longevitySource || null,auditVersion:audit?.version || null,valueMatchesAudit});
  }

  function apexStatus(row){
    const value = finiteNumber(row.apexPeak);
    const audit = row.apexPeakAudit || null;
    const auditScore = finiteNumber(audit?.score);
    const text = [audit?.window,audit?.notes,audit?.source].filter(Boolean).join(' ').toLowerCase();
    const pending = /pending|review pending|still being loaded/.test(text);
    const rangeOk = inRange(value,0,MAXIMUMS.apexPeak);
    const valueMatchesAudit = auditScore === null ? null : equalWithin(value,auditScore);
    if(audit && !pending && rangeOk && valueMatchesAudit !== false){
      return status('pass','locked-apex-audit','Audited Apex Peak value reached row.apexPeak.',{value,auditVersion:audit.version || window.UFC_APEX_PEAK_LIVE_BONUS?.version || null,valueMatchesAudit,pending:false});
    }
    if(audit && pending){
      return status('warning','pending-apex-audit','Apex Peak row exists but is explicitly pending review.',{value,auditVersion:audit.version || null,valueMatchesAudit,pending:true});
    }
    return status('fail','legacy-or-missing','No completed Apex Peak audit reached the row.',{value,auditVersion:audit?.version || null,valueMatchesAudit,pending});
  }

  function lossStatus(row){
    const value = finiteNumber(row.penalty);
    const adapterEntry = window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER?.entryFor?.(row.fighter) || null;
    const estimated = finiteNumber(adapterEntry?.estimatedPenaltyTotal);
    const promoter = window.UFC_LOSS_CONTEXT_LIVE_PROMOTER || null;
    const live = row.lossContextLive === true || (promoter?.applied === true && row.lossContextAudit);
    const signOk = value !== null && value <= EPSILON;
    const valueMatchesAudit = estimated === null ? null : equalWithin(value,estimated);
    if(live && row.lossContextAudit && signOk && valueMatchesAudit !== false){
      return status('pass','loss-context-ledger','Audited Loss Context value reached row.penalty.',{value,estimated,auditVersion:row.lossContextAudit.version || promoter?.version || null,valueMatchesAudit});
    }
    if(adapterEntry && signOk){
      return status('warning','legacy-penalty-with-ledger-qa','Loss ledger exists, but the live promoter is disabled or the row still uses a legacy penalty.',{value,estimated,auditVersion:window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER?.version || null,promoterApplied:promoter?.applied === true,valueMatchesAudit});
    }
    return status('fail','legacy-or-missing','No usable Loss Context ledger audit exists for this fighter.',{value,estimated,auditVersion:null,promoterApplied:promoter?.applied === true,valueMatchesAudit});
  }

  function profileMismatches(row,profile){
    if(!profile) return ['missing profile row'];
    const fields = ['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','totalScore','rank'];
    return fields.filter(field => {
      const a = finiteNumber(row[field]);
      const b = finiteNumber(profile[field]);
      if(a === null && b === null) return false;
      return !equalWithin(a,b,field === 'rank' ? 0 : EPSILON);
    }).map(field => `${field}: board=${row[field]} profile=${profile[field]}`);
  }

  function forbiddenOverrideFields(name){
    const override = window.DISPLAY_OVERRIDES?.[name];
    if(!override) return [];
    const found = FORBIDDEN_OVERRIDE_FIELDS.filter(field => Object.prototype.hasOwnProperty.call(override,field));
    const categoryFields = [];
    Object.entries(override.categories || {}).forEach(([category,value]) => {
      if(value && typeof value === 'object'){
        if(Object.prototype.hasOwnProperty.call(value,'ovr')) categoryFields.push(`categories.${category}.ovr`);
        if(Object.prototype.hasOwnProperty.call(value,'rank')) categoryFields.push(`categories.${category}.rank`);
        if(Object.prototype.hasOwnProperty.call(value,'score')) categoryFields.push(`categories.${category}.score`);
      }
    });
    return [...found,...categoryFields];
  }

  function moduleReadiness(){
    return {
      rankingData: !!window.RANKING_DATA,
      championshipResumeLive: !!window.UFC_CHAMPIONSHIP_RESUME_LIVE,
      opponentQualityLive: !!window.UFC_OPPONENT_QUALITY_LIVE,
      primeDominanceReport: !!(window.UFC_PRIME_DOMINANCE_LEDGERS?.report?.length || window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report?.length),
      primeDominanceLivePromoter: !!window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER,
      longevityShadow: !!window.UFC_LONGEVITY_SHADOW_SCORER,
      longevityLivePromoter: !!window.UFC_LONGEVITY_LIVE_PROMOTER,
      apexPeakLiveBonus: !!window.UFC_APEX_PEAK_LIVE_BONUS,
      lossContextAdapter: !!window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER,
      lossContextLivePromoter: !!window.UFC_LOSS_CONTEXT_LIVE_PROMOTER,
      scoreWeighting: !!window.UFC_SCORE_WEIGHTING
    };
  }

  function summarizeCategory(rows,key){
    const counts = {pass:0,warning:0,fail:0};
    rows.forEach(row => { counts[row.categories[key].level] += 1; });
    return counts;
  }

  function auditFighter(item){
    const row = item.row;
    const profile = profileFor(row.fighter);
    const expectedTotal = expectedFormula(row);
    const actualTotal = finiteNumber(row.totalScore);
    const formulaDelta = expectedTotal === null || actualTotal === null ? null : round2(actualTotal-expectedTotal);
    const categories = {
      championship: championshipStatus(row),
      opponentQuality: qualityStatus(row),
      primeDominance: primeStatus(row),
      longevity: longevityStatus(row),
      apexPeak: apexStatus(row),
      penalty: lossStatus(row)
    };
    const categoryFailures = Object.entries(categories).filter(([,result]) => result.level === 'fail').map(([key]) => key);
    const categoryWarnings = Object.entries(categories).filter(([,result]) => result.level === 'warning').map(([key]) => key);
    const formulaPass = formulaDelta !== null && Math.abs(formulaDelta) <= EPSILON;
    const mismatches = profileMismatches(row,profile);
    const forbiddenOverrides = forbiddenOverrideFields(row.fighter);
    const complete = categoryFailures.length === 0 && categoryWarnings.length === 0 && formulaPass && mismatches.length === 0 && forbiddenOverrides.length === 0;
    return {
      fighter: row.fighter,
      board: item.board,
      rank: row.rank,
      values: {
        championship: finiteNumber(row.championship),
        opponentQuality: finiteNumber(row.opponentQuality),
        primeDominance: finiteNumber(row.primeDominance),
        longevity: finiteNumber(row.longevity),
        apexPeak: finiteNumber(row.apexPeak),
        penalty: finiteNumber(row.penalty),
        totalScore: actualTotal
      },
      categories,
      expectedTotal,
      actualTotal,
      formulaDelta,
      formulaPass,
      profilePresent: !!profile,
      profileMismatches: mismatches,
      forbiddenOverrideFields: forbiddenOverrides,
      categoryFailures,
      categoryWarnings,
      complete
    };
  }

  function buildMarkdown(report){
    const lines = [];
    lines.push('# Six-Category Integrity Audit');
    lines.push('');
    lines.push(`Generated: ${report.generatedAt}`);
    lines.push(`Version: ${report.version}`);
    lines.push(`Roster fighters: ${report.summary.fighterCount}`);
    lines.push(`Fully complete: ${report.summary.completeCount}`);
    lines.push(`Incomplete: ${report.summary.incompleteCount}`);
    lines.push(`Formula mismatches: ${report.summary.formulaMismatchCount}`);
    lines.push(`Forbidden score-derived overrides: ${report.summary.forbiddenOverrideCount}`);
    lines.push('');
    lines.push('| Fighter | Champ | Quality | Prime | Longevity | Apex | Loss | Formula | Profile | Overrides |');
    lines.push('|---|---|---|---|---|---|---|---|---|---|');
    report.fighters.forEach(f => {
      const icon = level => level === 'pass' ? 'PASS' : level === 'warning' ? 'WARN' : 'FAIL';
      lines.push(`| ${f.fighter} | ${icon(f.categories.championship.level)} | ${icon(f.categories.opponentQuality.level)} | ${icon(f.categories.primeDominance.level)} | ${icon(f.categories.longevity.level)} | ${icon(f.categories.apexPeak.level)} | ${icon(f.categories.penalty.level)} | ${f.formulaPass ? 'PASS' : 'FAIL'} | ${f.profileMismatches.length ? 'FAIL' : 'PASS'} | ${f.forbiddenOverrideFields.length ? 'FAIL' : 'PASS'} |`);
    });
    lines.push('');
    lines.push('## Notes');
    lines.push('');
    lines.push('- This report is read-only and does not change scores, ranks, OVRs, ledgers, or display data.');
    lines.push('- WARN means audited data exists but is not confirmed as the final live source.');
    lines.push('- FAIL means the audited source is missing, the row does not match it, or the locked formula does not reconcile.');
    return lines.join('\n');
  }

  function run(label='manual'){
    const data = window.RANKING_DATA;
    if(!data){
      const missing = {version:VERSION,label,generatedAt:new Date().toISOString(),mutatesScores:false,error:'Missing window.RANKING_DATA'};
      api.latest = missing;
      return missing;
    }

    const boards = boardRows();
    const boardGroups = groupedByName(boards,item => item.row);
    const profileGroups = groupedByName(profileRows());
    const duplicateBoardRows = [...boardGroups.entries()].filter(([,items]) => items.length > 1).map(([name,items]) => ({name,count:items.length,fighters:items.map(item => item.row.fighter)}));
    const duplicateProfileRows = [...profileGroups.entries()].filter(([,items]) => items.length > 1).map(([name,items]) => ({name,count:items.length,fighters:items.map(item => item.fighter)}));
    const fighters = boards.map(auditFighter);
    const formulaMismatches = fighters.filter(f => !f.formulaPass);
    const forbiddenOverrideRows = fighters.filter(f => f.forbiddenOverrideFields.length);
    const incomplete = fighters.filter(f => !f.complete);
    const report = {
      version: VERSION,
      label,
      generatedAt: new Date().toISOString(),
      mutatesScores: false,
      formula: 'championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty',
      weights: {...WEIGHTS},
      maximums: {...MAXIMUMS},
      modules: moduleReadiness(),
      summary: {
        fighterCount: fighters.length,
        menCount: fighters.filter(f => f.board === 'men').length,
        womenCount: fighters.filter(f => f.board === 'women').length,
        completeCount: fighters.filter(f => f.complete).length,
        incompleteCount: incomplete.length,
        formulaMismatchCount: formulaMismatches.length,
        forbiddenOverrideCount: forbiddenOverrideRows.length,
        duplicateBoardNameCount: duplicateBoardRows.length,
        duplicateProfileNameCount: duplicateProfileRows.length,
        categories: {
          championship: summarizeCategory(fighters,'championship'),
          opponentQuality: summarizeCategory(fighters,'opponentQuality'),
          primeDominance: summarizeCategory(fighters,'primeDominance'),
          longevity: summarizeCategory(fighters,'longevity'),
          apexPeak: summarizeCategory(fighters,'apexPeak'),
          penalty: summarizeCategory(fighters,'penalty')
        }
      },
      duplicateBoardRows,
      duplicateProfileRows,
      fighters,
      incompleteFighters: incomplete.map(f => f.fighter),
      formulaMismatches: formulaMismatches.map(f => ({fighter:f.fighter,expected:f.expectedTotal,actual:f.actualTotal,delta:f.formulaDelta})),
      forbiddenOverrides: forbiddenOverrideRows.map(f => ({fighter:f.fighter,fields:f.forbiddenOverrideFields})),
      passed: incomplete.length === 0 && duplicateBoardRows.length === 0 && duplicateProfileRows.length === 0
    };
    report.markdown = buildMarkdown(report);
    api.latest = report;
    api.history.push(report);
    if(api.history.length > 10) api.history.shift();
    document.documentElement?.setAttribute('data-six-category-integrity-audit',report.passed ? 'pass' : 'issues-found');
    if(window.console){
      console.groupCollapsed(`[UFC integrity audit] ${label}: ${report.summary.completeCount}/${report.summary.fighterCount} fully complete`);
      console.log(report.summary);
      if(report.formulaMismatches.length) console.table(report.formulaMismatches);
      if(report.forbiddenOverrides.length) console.table(report.forbiddenOverrides);
      console.log('Full report:',report);
      console.groupEnd();
    }
    return report;
  }

  function schedule(){
    const checkpoints = [
      [0,'initial'],
      [3000,'mid-load'],
      [9500,'settled']
    ];
    checkpoints.forEach(([delay,label]) => setTimeout(() => run(label),delay));
  }

  const api = {
    version: VERSION,
    mutatesScores: false,
    latest: null,
    history: [],
    run,
    schedule,
    exportJson(){ return JSON.stringify(api.latest || run('export-json'),null,2); },
    exportMarkdown(){ return (api.latest || run('export-markdown')).markdown; }
  };

  window.UFC_SIX_CATEGORY_INTEGRITY_AUDIT = api;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();
