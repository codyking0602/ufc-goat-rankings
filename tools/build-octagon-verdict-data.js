#!/usr/bin/env node
/*
 * Build compact public Octagon Verdict GPT data from the canonical fighter board.
 * Fighter data source: assets/data/ranking-data.js only.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const legacyPath = path.join(root, 'assets/data/octagon-verdict-data.json');
const dataDir = path.join(root, 'assets/data/octagon-verdict');
const fightersDir = path.join(dataDir, 'fighters');
const matchupsDir = path.join(dataDir, 'matchups');

const DERIVED_SCRIPTS = [
  'assets/js/score-derived-ovr.js'
];

function abs(relPath) { return path.join(root, relPath); }
function exists(relPath) { return fs.existsSync(abs(relPath)); }
function read(relPath) { return fs.readFileSync(abs(relPath), 'utf8'); }
function runScript(context, relPath) {
  vm.runInContext(read(relPath), context, { filename: relPath });
}
function round(value, digits = 2) {
  const n = Number(value);
  return Number.isFinite(n) ? Number(n.toFixed(digits)) : undefined;
}
function value(v) { return v === undefined || v === null || v === '' ? undefined : v; }
function text(v, max = 160) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).replace(/\s+/g, ' ').trim();
  if (!s) return undefined;
  return s.length > max ? `${s.slice(0, max - 1).trim()}…` : s;
}
function slugify(name) {
  return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function pairKey(a, b) { return [slugify(a), slugify(b)].sort().join('--'); }
function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => {
    if (v === undefined || v === null || v === '') return false;
    if (Array.isArray(v) && v.length === 0) return false;
    if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return false;
    return true;
  }));
}
function unique(values, max = 8) {
  return Array.from(new Set((values || []).filter(Boolean).map(v => String(v).replace(/\s+/g, ' ').trim()).filter(Boolean))).slice(0, max);
}
function firstFinite(...values) {
  for (const v of values) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}
function scoreRows(rows) {
  return [...(rows || [])]
    .filter(row => row?.fighter && Number.isFinite(Number(row.totalScore)))
    .sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0) || String(a.fighter || '').localeCompare(String(b.fighter || '')));
}
function makeMockElement() {
  return {
    value: '', textContent: '', innerHTML: '', style: {}, dataset: {}, hidden: false,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {}, getAttribute() { return ''; }, appendChild() {}, remove() {}, prepend() {},
    addEventListener() {}, insertAdjacentHTML() {}, querySelector() { return null; }, querySelectorAll() { return []; }
  };
}
function makeContext() {
  const document = {
    getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; },
    createElement() { return makeMockElement(); }, addEventListener() {},
    documentElement: { setAttribute() {} }, head: { appendChild() {} }, body: { appendChild() {} }
  };
  const sandbox = {
    console, window: {}, document, setTimeout: () => {}, clearTimeout: () => {}, requestAnimationFrame: fn => fn(),
    Date, Math, Number, String, Boolean, Array, Object, JSON, RegExp, Map, Set, WeakSet
  };
  sandbox.window = sandbox;
  return vm.createContext(sandbox);
}
function load() {
  const ctx = makeContext();
  runScript(ctx, 'assets/data/ranking-data.js');
  const loadedDerivedScripts = [];
  for (const relPath of DERIVED_SCRIPTS) {
    if (!exists(relPath)) continue;
    runScript(ctx, relPath);
    loadedDerivedScripts.push(relPath);
  }
  return { ctx, loadedDerivedScripts };
}
function appOvrFrom(ctx, row, groupRows) {
  if (typeof ctx.window.overallOvr === 'function') return value(ctx.window.overallOvr(row));
  const values = scoreRows(groupRows).map(x => Number(x.totalScore || 0)).filter(Number.isFinite);
  if (!values.length) return undefined;
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 99;
  return Math.max(82, Math.min(99, Math.round(82 + ((Number(row.totalScore || 0) - min) / (max - min)) * 17)));
}
function watchUrlFor(profile, display) {
  return value(display?.watchUrl || display?.watchMomentUrl || display?.signatureMomentUrl || profile?.watchUrl || profile?.watchMomentUrl || profile?.signatureMomentUrl || profile?.watch?.url || profile?.watchMoment?.url);
}
function titleFightWinsFrom(profile, row) {
  const stats = profile?.profileStats || profile?.resume || {};
  const direct = firstFinite(stats.titleFightWins, row?.titleFightWins, profile?.titleFightWins, row?.resume?.titleFightWins);
  if (direct !== undefined && direct <= 20) return direct;
  const title = row?.title || profile?.title || {};
  const noteMatch = String(title.notes || '').match(/Total title fight wins = ([0-9.]+)/i);
  if (noteMatch) return Number(noteMatch[1]);
  const total = firstFinite(
    title.titleFightWins,
    title.ufcTitleFightWins,
    Number(title.normalTitleWins || 0) + Number(title.interimTitleWins || 0) + Number(title.vacantUndisputedWins || 0) + Number(title.secondDivisionUndisputedWins || 0) + Number(title.vacantSecondDivisionWins || 0)
  );
  return total ? round(total, 2) : undefined;
}
function adjustedTitleWinsFrom(profile, row) {
  return value(round(profile?.profileStats?.adjustedTitleWins ?? profile?.resume?.adjustedTitleWins ?? row?.title?.adjustedTitleWins ?? profile?.title?.adjustedTitleWins ?? row?.adjustedTitleWins));
}
function eliteWinsFrom(profile, row) {
  const stats = profile?.profileStats || profile?.resume || {};
  const direct = firstFinite(stats.eliteWins, stats.topFiveWins, row?.eliteWins, row?.topFiveWins, profile?.eliteWins, profile?.topFiveWins);
  if (direct !== undefined && direct > 0 && direct < 50) return direct;
  const opponents = Array.isArray(profile?.opponents) ? profile.opponents : Array.isArray(profile?.qualityWins) ? profile.qualityWins : Array.isArray(row?.opponents) ? row.opponents : [];
  const names = new Set();
  for (const o of opponents) {
    const credit = Number(o?.credit || o?.value || 0);
    const context = String(o?.context || o?.notes || o?.note || '').toLowerCase();
    if (credit >= 0.75 || /champion|top 5|top-five|elite/.test(context)) {
      const name = String(o?.opponent || '').replace(/\s+\d+$/, '').trim();
      if (name) names.add(name);
    }
  }
  return names.size || undefined;
}
function bestWinsFrom(profile, row) {
  const opponents = Array.isArray(profile?.opponents) ? profile.opponents : Array.isArray(profile?.qualityWins) ? profile.qualityWins : Array.isArray(row?.opponents) ? row.opponents : [];
  return unique(opponents.map(o => o?.opponent), 8);
}
function fighterRecord({ ctx, name, row, profile, display, compare, group, rank, groupRows }) {
  const stats = profile?.profileStats || profile?.resume || {};
  return compact({
    slug: slugify(name), name, group, rank,
    appOvr: value(appOvrFrom(ctx, row, groupRows)),
    totalScore: round(row?.totalScore ?? profile?.totalScore),
    championship: round(row?.championship ?? profile?.championship ?? profile?.scoring?.championship),
    opponentQuality: round(row?.opponentQuality ?? profile?.opponentQuality ?? profile?.scoring?.opponentQuality),
    primeDominance: round(row?.primeDominance ?? profile?.primeDominance ?? profile?.scoring?.primeDominance),
    longevity: round(row?.longevity ?? profile?.longevity ?? profile?.scoring?.longevity),
    apexPeak: round(row?.apexPeak ?? profile?.apexPeak ?? profile?.scoring?.apexPeak),
    penalty: round(row?.penalty ?? profile?.penalty ?? profile?.scoring?.penalty),
    division: value(display?.divisionLabel ?? row?.primaryDivision ?? profile?.primaryDivision),
    divisions: unique([row?.primaryDivision, row?.secondaryDivision, profile?.primaryDivision, profile?.secondaryDivision], 4),
    tag: text(display?.resumeTag ?? profile?.display?.resumeTag ?? profile?.resumeTag, 80),
    oneLiner: text(display?.oneLiner ?? profile?.display?.oneLiner ?? profile?.oneLiner, 180),
    ufcRecord: value(stats.ufcRecord ?? row?.ufcRecord ?? profile?.ufcRecord),
    titleFightWins: value(titleFightWinsFrom(profile, row)),
    adjustedTitleWins: adjustedTitleWinsFrom(profile, row),
    eliteWins: value(eliteWinsFrom(profile, row)),
    primeRecord: value(stats.primeRecord ?? row?.primeRecord ?? profile?.primeRecord),
    roundsWonPct: value(round(stats.roundsWonPct ?? row?.roundsWonPct ?? profile?.roundsWonPct)),
    finishRatePct: value(round(stats.finishRatePct ?? row?.finishRatePct ?? profile?.finishRatePct)),
    activeEliteYears: value(round(stats.activeEliteYears ?? row?.activeEliteYears ?? profile?.activeEliteYears)),
    timesFinishedPrime: value(stats.timesFinishedPrime ?? row?.timesFinishedPrime ?? profile?.timesFinishedPrime),
    lossPenalty: value(round(stats.lossPenalty ?? row?.penalty ?? profile?.penalty)),
    bestWins: bestWinsFrom(profile, row),
    watchUrl: watchUrlFor(profile, display),
    compareShortCase: text(compare?.shortCase ?? compare?.case ?? profile?.compare?.shortCase, 220),
    compareCounter: text(compare?.counter ?? compare?.counterArgument ?? profile?.compare?.counter, 220),
    compareWeakness: text(compare?.weakness ?? profile?.compare?.weakness, 220)
  });
}
function legacyFighter(f) {
  return compact({
    slug: f.slug, name: f.name, group: f.group, rank: f.rank,
    appOvr: f.appOvr, totalScore: f.totalScore, division: f.division, tag: f.tag,
    ufcRecord: f.ufcRecord, titleFightWins: f.titleFightWins, adjustedTitleWins: f.adjustedTitleWins,
    eliteWins: f.eliteWins, primeRecord: f.primeRecord, roundsWonPct: f.roundsWonPct,
    finishRatePct: f.finishRatePct, activeEliteYears: f.activeEliteYears,
    timesFinishedPrime: f.timesFinishedPrime, lossPenalty: f.lossPenalty, bestWins: f.bestWins, watchUrl: f.watchUrl
  });
}
function buildSpecial(fightersByName) {
  const pair = (a, b, debate, split, notes = []) => {
    const fa = fightersByName.get(a); const fb = fightersByName.get(b);
    let lean; let margin;
    if (fa && fb && Number.isFinite(fa.totalScore) && Number.isFinite(fb.totalScore)) {
      lean = fa.totalScore === fb.totalScore ? 'Essentially even' : (fa.totalScore > fb.totalScore ? a : b);
      margin = round(Math.abs(fa.totalScore - fb.totalScore));
    }
    return compact({ pairKey: pairKey(a, b), fighters: [a, b], slugs: [slugify(a), slugify(b)], defaultLean: lean, margin, coreDebate: debate, suggestedFinalSplit: split, notes });
  };
  return [
    pair('Kamaru Usman', 'Max Holloway', 'Usman has the better championship reign and stronger peak control. Holloway has the deeper overall case because of elite longevity and quality-win volume.', { betterPeakChampion: 'Kamaru Usman', greaterOverallCase: 'Max Holloway, barely' }, ['Avoid raw category point totals.']),
    pair('Jon Jones', 'Georges St-Pierre', 'GSP is the cleaner case. Jones is the bigger championship-volume and top-end case.', { cleanerCase: 'Georges St-Pierre', greaterOverallCase: 'Jon Jones' }, ['If clean record/controversy is weighted heavily, GSP has the easier counterargument.']),
    pair('Khabib Nurmagomedov', 'Islam Makhachev', 'Khabib has the cleaner peak. Islam has the fuller current championship and modern-depth case.', { cleanerPeak: 'Khabib Nurmagomedov', greaterCurrentCase: 'Islam Makhachev, barely' }, ['Use Khabib undefeated run and Islam title-fight volume as the swing points.']),
    pair('Jose Aldo', 'Lyoto Machida', 'Aldo has the deeper overall UFC case and scope-affected historical featherweight legacy. Machida has the short-reign champion apex and peak-aura counterargument.', { greaterUfcCase: 'Jose Aldo', betterApexAuraArgument: 'Lyoto Machida' }, ['WEC context helps Aldo historically, but is not scored directly.'])
  ];
}
function build() {
  const { ctx, loadedDerivedScripts } = load();
  const rankingData = ctx.window.RANKING_DATA || {};
  const displayOverrides = ctx.window.DISPLAY_OVERRIDES || {};
  const compareProfiles = ctx.window.COMPARE_PROFILES || {};
  const profiles = new Map((rankingData.fighters || []).map(profile => [profile.fighter, profile]));
  const fightersByName = new Map();
  for (const [group, rawRows] of [['men', rankingData.men || []], ['women', rankingData.women || []]]) {
    const rows = scoreRows(rawRows);
    rows.forEach((row, index) => {
      const name = row.fighter;
      const profile = profiles.get(name) || row;
      const display = displayOverrides[name] || profile.display || {};
      const compare = compareProfiles[name] || profile.compareProfile || profile.compare || {};
      const fighter = fighterRecord({ ctx, name, row, profile, display, compare, group, rank: index + 1, groupRows: rows });
      fightersByName.set(name, fighter);
    });
  }
  const fighters = [...fightersByName.values()].sort((a, b) => a.group !== b.group ? (a.group === 'men' ? -1 : 1) : a.rank - b.rank);
  const specialMatchups = buildSpecial(fightersByName);
  const guidance = {
    sourceOfTruth: 'Use this feed over uploaded memory, web browsing, or old scores. It is built from canonical ranking-data.js.',
    explainWith: ['UFC record', 'title-fight wins', 'elite wins', 'prime record', 'rounds-won percentage', 'finish percentage', 'active elite years', 'loss context'],
    avoid: ['Raw category point totals in normal answers', 'outside citations unless asked', 'Wikipedia/ESPN/UFC links unless asked', 'database/model language']
  };
  const index = {
    name: 'Octagon Verdict Index', version: new Date().toISOString().slice(0, 10), generatedAt: new Date().toISOString(),
    source: 'assets/data/ranking-data.js', loadedDerivedScripts, guidance, fighterCount: fighters.length,
    fighters: fighters.map(f => compact({ slug: f.slug, name: f.name, group: f.group, rank: f.rank, appOvr: f.appOvr, totalScore: f.totalScore, division: f.division, tag: f.tag })),
    specialMatchups: specialMatchups.map(m => compact({ pairKey: m.pairKey, fighters: m.fighters, slugs: m.slugs, defaultLean: m.defaultLean, margin: m.margin, coreDebate: m.coreDebate }))
  };
  const legacyFeed = { name: 'Octagon Verdict Data', version: index.version, generatedAt: index.generatedAt, defaultScope: 'Judge UFC accomplishments by default. Only mention scope when it matters.', source: index.source, loadedDerivedScripts, guidance, fighterCount: fighters.length, fighters: fighters.map(legacyFighter), specialMatchups };
  return { index, fighters, specialMatchups, legacyFeed };
}
function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data)}\n`, 'utf8');
}
const { index, fighters, specialMatchups, legacyFeed } = build();
fs.rmSync(dataDir, { recursive: true, force: true });
fs.mkdirSync(fightersDir, { recursive: true });
fs.mkdirSync(matchupsDir, { recursive: true });
writeJson(path.join(dataDir, 'index.json'), index);
for (const fighter of fighters) writeJson(path.join(fightersDir, `${fighter.slug}.json`), fighter);
for (const matchup of specialMatchups) writeJson(path.join(matchupsDir, `${matchup.pairKey}.json`), matchup);
writeJson(legacyPath, legacyFeed);
console.log(`Built Octagon Verdict feed with ${legacyFeed.fighterCount} fighters from canonical ranking data.`);
console.log(`Loaded derived scripts: ${index.loadedDerivedScripts.join(', ') || 'none'}`);
console.log(`Legacy size: ${fs.statSync(legacyPath).size} bytes.`);
