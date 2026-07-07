#!/usr/bin/env node
/*
 * Build compact public Octagon Verdict GPT Action data from the same data that
 * powers the app. The legacy all-in-one endpoint stays small enough for GPT.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const legacyPath = path.join(root, 'assets/data/octagon-verdict-data.json');
const dataDir = path.join(root, 'assets/data/octagon-verdict');
const fightersDir = path.join(dataDir, 'fighters');
const matchupsDir = path.join(dataDir, 'matchups');

function read(relPath) { return fs.readFileSync(path.join(root, relPath), 'utf8'); }
function exists(relPath) { return fs.existsSync(path.join(root, relPath)); }
function runScript(context, relPath, after = '') {
  const source = read(relPath);
  vm.runInContext(`${source}\n${after}`, context, { filename: relPath });
}
function round(value, digits = 2) {
  const n = Number(value);
  return Number.isFinite(n) ? Number(n.toFixed(digits)) : undefined;
}
function value(v) { return v === undefined || v === null || v === '' ? undefined : v; }
function pickText(v, max = 170) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).replace(/\s+/g, ' ').trim();
  if (!s) return undefined;
  return s.length > max ? `${s.slice(0, max - 1).trim()}…` : s;
}
function slugify(name) {
  return String(name || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
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
function unique(values, max = 6) {
  return Array.from(new Set((values || []).filter(Boolean).map(v => String(v).replace(/\s+/g, ' ').trim()).filter(Boolean))).slice(0, max);
}
function snapshotValue(snapshot, label) {
  if (!Array.isArray(snapshot)) return undefined;
  const row = snapshot.find(item => Array.isArray(item) && item[0] === label);
  return row ? row[1] : undefined;
}
function titleFightWinsFrom(profile, profileStats, display) {
  const direct = value(profileStats?.titleFightWins ?? profile?.titleFightWins);
  if (direct !== undefined) return direct;
  const snap = snapshotValue(display?.snapshot, 'UFC Title-Fight Wins');
  if (snap !== undefined) {
    const match = String(snap).match(/\d+(?:\.\d+)?/);
    if (match) return Number(match[0]);
  }
  const title = profile?.title || {};
  const total = Number(title.normalTitleWins || 0) + Number(title.interimTitleWins || 0) + Number(title.vacantUndisputedWins || 0) + Number(title.secondDivisionUndisputedWins || 0) + Number(title.vacantSecondDivisionWins || 0);
  return total ? round(total, 2) : undefined;
}
function adjustedTitleWinsFrom(profile, profileStats) {
  return value(round(profileStats?.adjustedTitleWins ?? profile?.title?.adjustedTitleWins));
}
function rankedRows(rows) {
  return [...(rows || [])].filter(row => row?.fighter && Number.isFinite(Number(row.totalScore))).sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0));
}
function makeContext() {
  const sandbox = { console, window: {}, document: undefined, setTimeout: () => {}, clearTimeout: () => {}, Date, Math, Number, String, Boolean, Array, Object, JSON, RegExp, Map, Set };
  sandbox.window = sandbox;
  return vm.createContext(sandbox);
}
function load() {
  const ctx = makeContext();
  runScript(ctx, 'assets/data/ranking-data.js');
  runScript(ctx, 'assets/data/display-overrides.js', 'window.DISPLAY_OVERRIDES = DISPLAY_OVERRIDES;');
  runScript(ctx, 'assets/data/fighter-packet-manifest.js');
  const manifest = ctx.window.UFC_FIGHTER_PACKET_MANIFEST || { packets: [] };
  const missingPackets = [];
  for (const packet of manifest.packets || []) {
    const relPath = `assets/data/fighter-packets/${packet.slug}.js`;
    if (!exists(relPath)) { missingPackets.push(packet.slug); continue; }
    runScript(ctx, relPath);
  }
  return { ctx, manifest, missingPackets };
}
function fighterRecord({ name, row, profile, display, compare, packet, group, rank }) {
  const profileStats = display?.packetProfileStats || packet?.profileStats || {};
  const opponents = Array.isArray(profile?.opponents) ? profile.opponents : [];
  const bestWins = unique([compare?.signatureWins, ...opponents.slice(0, 8).map(o => o?.opponent)], 8);
  return compact({
    slug: slugify(name), name, group, rank,
    appOvr: value(display?.overallOvr),
    totalScore: round(row?.totalScore ?? profile?.totalScore),
    division: value(display?.divisionLabel ?? row?.primaryDivision ?? profile?.primaryDivision),
    tag: pickText(display?.resumeTag, 70),
    oneLiner: pickText(display?.oneLiner, 140),
    ufcRecord: value(profileStats.ufcRecord ?? row?.ufcRecord ?? profile?.ufcRecord ?? snapshotValue(display?.snapshot, 'UFC Record')),
    titleFightWins: value(titleFightWinsFrom(profile, profileStats, display)),
    adjustedTitleWins: value(adjustedTitleWinsFrom(profile, profileStats)),
    eliteWins: value(profileStats.eliteWins),
    primeRecord: value(profileStats.primeRecord ?? row?.primeRecord ?? profile?.primeRecord ?? snapshotValue(display?.snapshot, 'Prime Record')),
    roundsWonPct: value(round(profileStats.roundsWonPct ?? row?.roundsWonPct ?? profile?.roundsWonPct)),
    finishRatePct: value(round(profileStats.finishRatePct ?? row?.finishRatePct ?? profile?.finishRatePct)),
    activeEliteYears: value(round(profileStats.activeEliteYears ?? row?.activeEliteYears ?? profile?.activeEliteYears)),
    timesFinishedPrime: value(profileStats.timesFinishedPrime ?? row?.timesFinishedPrime ?? profile?.timesFinishedPrime),
    lossPenalty: value(round(profileStats.lossPenalty ?? row?.penalty ?? profile?.penalty)),
    categories: compact({
      championship: round(row?.championship ?? profile?.championship),
      opponentQuality: round(row?.opponentQuality ?? profile?.opponentQuality),
      primeDominance: round(row?.primeDominance ?? profile?.primeDominance),
      longevity: round(row?.longevity ?? profile?.longevity),
      apexPeak: round(row?.apexPeak ?? profile?.apexPeak),
      penalty: round(row?.penalty ?? profile?.penalty)
    }),
    titleSummary: pickText(compare?.titleSummary ?? profile?.title?.notes, 110),
    primeSummary: pickText(compare?.primeSummary, 120),
    bestArgument: pickText(compare?.bestArgument ?? display?.whyRankedHere ?? packet?.display?.finalTakeaway, 140),
    counter: pickText(compare?.counter ?? compare?.weakness ?? display?.whyNotHigher, 140),
    edge: pickText(compare?.edge, 140),
    bestWins,
    notes: unique([profileStats.divisionStrengthContext, profileStats.lossContext, compare?.resume, compare?.championship, compare?.opponentQuality, packet?.display?.finalTakeaway].map(note => pickText(note, 120)), 4)
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
    pair('Khabib Nurmagomedov', 'Islam Makhachev', 'Khabib has the cleaner peak. Islam has the fuller current championship and modern-depth case.', { cleanerPeak: 'Khabib Nurmagomedov', greaterCurrentCase: 'Islam Makhachev, barely' }, ['Use Khabib undefeated run and Islam title-fight volume as the swing points.'])
  ];
}
function build() {
  const { ctx, manifest, missingPackets } = load();
  const rankingData = ctx.window.RANKING_DATA || {};
  const displayOverrides = ctx.window.DISPLAY_OVERRIDES || {};
  const packets = ctx.window.UFC_FIGHTER_PACKETS || {};
  const compareProfiles = ctx.window.COMPARE_PROFILES || {};
  const profiles = new Map((rankingData.fighters || []).map(profile => [profile.fighter, profile]));
  const fightersByName = new Map();
  for (const [group, rows] of [['men', rankedRows(rankingData.men)], ['women', rankedRows(rankingData.women)]]) {
    rows.forEach((row, index) => {
      const name = row.fighter;
      const fighter = fighterRecord({ name, row, profile: profiles.get(name), display: displayOverrides[name] || {}, compare: compareProfiles[name] || displayOverrides[name]?.compareProfile || {}, packet: packets[name] || {}, group, rank: index + 1 });
      fightersByName.set(name, fighter);
    });
  }
  const fighters = [...fightersByName.values()].sort((a, b) => a.group !== b.group ? (a.group === 'men' ? -1 : 1) : a.rank - b.rank);
  const specialMatchups = buildSpecial(fightersByName);
  const guidance = {
    sourceOfTruth: 'Use this Action feed over uploaded Knowledge, memory, web browsing, or old scores.',
    explainWith: ['UFC record', 'title-fight wins', 'elite wins', 'prime record', 'rounds-won percentage', 'finish percentage', 'active elite years', 'loss context'],
    avoid: ['Raw category point totals in normal answers', 'outside citations unless asked', 'Wikipedia/ESPN/UFC links unless asked', 'database/model language']
  };
  const index = { name: 'Octagon Verdict Index', version: new Date().toISOString().slice(0, 10), generatedAt: new Date().toISOString(), packetCount: manifest.packets?.length || 0, missingPackets, guidance, fighterCount: fighters.length, fighters: fighters.map(f => compact({ slug: f.slug, name: f.name, group: f.group, rank: f.rank, appOvr: f.appOvr, totalScore: f.totalScore, division: f.division, tag: f.tag })), specialMatchups: specialMatchups.map(m => compact({ pairKey: m.pairKey, fighters: m.fighters, slugs: m.slugs, defaultLean: m.defaultLean, margin: m.margin, coreDebate: m.coreDebate })) };
  const legacyFeed = { name: 'Octagon Verdict Data', version: index.version, generatedAt: index.generatedAt, defaultScope: 'Judge UFC accomplishments by default. Only mention scope when it matters.', guidance, fighterCount: fighters.length, fighters, specialMatchups };
  return { index, fighters, specialMatchups, legacyFeed };
}
function writeJson(filePath, data) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(data)}\n`, 'utf8'); }
const { index, fighters, specialMatchups, legacyFeed } = build();
fs.rmSync(dataDir, { recursive: true, force: true });
fs.mkdirSync(fightersDir, { recursive: true });
fs.mkdirSync(matchupsDir, { recursive: true });
writeJson(path.join(dataDir, 'index.json'), index);
for (const fighter of fighters) writeJson(path.join(fightersDir, `${fighter.slug}.json`), fighter);
for (const matchup of specialMatchups) writeJson(path.join(matchupsDir, `${matchup.pairKey}.json`), matchup);
writeJson(legacyPath, legacyFeed);
console.log(`Built compact legacy feed with ${legacyFeed.fighterCount} fighters.`);
console.log(`Legacy size: ${fs.statSync(legacyPath).size} bytes.`);
if (index.missingPackets.length) console.warn(`Missing packet files: ${index.missingPackets.join(', ')}`);
