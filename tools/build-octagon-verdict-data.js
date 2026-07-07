#!/usr/bin/env node
/*
 * Build small public Octagon Verdict GPT Action files from the same data that
 * powers the app. GPT Actions should pull the index, then only the two fighter
 * files needed for a comparison.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const legacyPath = path.join(root, 'assets/data/octagon-verdict-data.json');
const dataDir = path.join(root, 'assets/data/octagon-verdict');
const fightersDir = path.join(dataDir, 'fighters');
const matchupsDir = path.join(dataDir, 'matchups');

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function runScript(context, relPath, after = '') {
  const source = read(relPath);
  vm.runInContext(`${source}\n${after}`, context, { filename: relPath });
}

function round(value, digits = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Number(n.toFixed(digits));
}

function value(v) {
  return v === undefined || v === null || v === '' ? undefined : v;
}

function pickText(v, max = 220) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).replace(/\s+/g, ' ').trim();
  if (!s) return undefined;
  return s.length > max ? `${s.slice(0, max - 1).trim()}…` : s;
}

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pairKey(a, b) {
  return [slugify(a), slugify(b)].sort().join('--');
}

function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === undefined || v === null || v === '') return false;
      if (Array.isArray(v) && v.length === 0) return false;
      if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return false;
      return true;
    })
  );
}

function unique(values, max = 8) {
  return Array.from(new Set((values || [])
    .filter(Boolean)
    .map(v => String(v).replace(/\s+/g, ' ').trim())
    .filter(Boolean)))
    .slice(0, max);
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
  const total = Number(title.normalTitleWins || 0)
    + Number(title.interimTitleWins || 0)
    + Number(title.vacantUndisputedWins || 0)
    + Number(title.secondDivisionUndisputedWins || 0)
    + Number(title.vacantSecondDivisionWins || 0);
  return total ? round(total, 2) : undefined;
}

function adjustedTitleWinsFrom(profile, profileStats) {
  return value(round(profileStats?.adjustedTitleWins ?? profile?.title?.adjustedTitleWins));
}

function rankedRows(rows) {
  return [...(rows || [])]
    .filter(row => row?.fighter && Number.isFinite(Number(row.totalScore)))
    .sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0));
}

function makeContext() {
  const sandbox = {
    console,
    window: {},
    document: undefined,
    setTimeout: () => {},
    clearTimeout: () => {},
    Date,
    Math,
    Number,
    String,
    Boolean,
    Array,
    Object,
    JSON,
    RegExp,
    Map,
    Set
  };
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
    if (!exists(relPath)) {
      missingPackets.push(packet.slug);
      continue;
    }
    runScript(ctx, relPath);
  }

  return { ctx, manifest, missingPackets };
}

function fighterRecord({ name, row, profile, display, compare, packet, group, rank }) {
  const profileStats = display?.packetProfileStats || packet?.profileStats || {};
  const opponents = Array.isArray(profile?.opponents) ? profile.opponents : [];
  const bestWins = unique([
    compare?.signatureWins,
    ...opponents.slice(0, 10).map(o => o?.opponent)
  ], 10);

  return compact({
    slug: slugify(name),
    name,
    group,
    rank,
    appOvr: value(display?.overallOvr),
    totalScore: round(row?.totalScore ?? profile?.totalScore),
    division: value(display?.divisionLabel ?? row?.primaryDivision ?? profile?.primaryDivision),
    tag: pickText(display?.resumeTag, 80),
    oneLiner: pickText(display?.oneLiner, 180),
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
    titleSummary: pickText(compare?.titleSummary ?? profile?.title?.notes, 160),
    primeSummary: pickText(compare?.primeSummary, 170),
    bestArgument: pickText(compare?.bestArgument ?? display?.whyRankedHere ?? packet?.display?.finalTakeaway, 200),
    counter: pickText(compare?.counter ?? compare?.weakness ?? display?.whyNotHigher, 200),
    edge: pickText(compare?.edge, 200),
    bestWins,
    notes: unique([
      profileStats.divisionStrengthContext,
      profileStats.lossContext,
      compare?.resume,
      compare?.championship,
      compare?.opponentQuality,
      packet?.display?.finalTakeaway,
      row?.notes,
      profile?.notes
    ].map(note => pickText(note, 170)), 6)
  });
}

function buildSpecial(fightersByName) {
  const pair = (a, b, debate, split, notes = []) => {
    const fa = fightersByName.get(a);
    const fb = fightersByName.get(b);
    let lean;
    let margin;
    if (fa && fb && Number.isFinite(fa.totalScore) && Number.isFinite(fb.totalScore)) {
      lean = fa.totalScore === fb.totalScore ? 'Essentially even' : (fa.totalScore > fb.totalScore ? a : b);
      margin = round(Math.abs(fa.totalScore - fb.totalScore));
    }
    return compact({
      pairKey: pairKey(a, b),
      fighters: [a, b],
      slugs: [slugify(a), slugify(b)],
      defaultLean: lean,
      margin,
      coreDebate: debate,
      suggestedFinalSplit: split,
      notes
    });
  };

  return [
    pair(
      'Kamaru Usman',
      'Max Holloway',
      'Usman has the better championship reign and stronger peak control. Holloway has the deeper overall case because of elite longevity and quality-win volume.',
      { betterPeakChampion: 'Kamaru Usman', greaterOverallCase: 'Max Holloway, barely' },
      ['Use title-fight wins, elite longevity, prime rounds-won percentage, and opponent-quality volume. Avoid raw category point totals.']
    ),
    pair(
      'Jon Jones',
      'Georges St-Pierre',
      'GSP is the cleaner case. Jones is the bigger championship-volume and top-end case.',
      { cleanerCase: 'Georges St-Pierre', greaterOverallCase: 'Jon Jones' },
      ['If the user values clean record/controversy heavily, GSP has the easier counterargument.']
    ),
    pair(
      'Khabib Nurmagomedov',
      'Islam Makhachev',
      'Khabib has the cleaner peak. Islam has the fuller current championship and modern-depth case.',
      { cleanerPeak: 'Khabib Nurmagomedov', greaterCurrentCase: 'Islam Makhachev, barely' },
      ['Use Khabib undefeated run and Islam title-fight volume as the plain-language swing points. Avoid raw category point totals.']
    )
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
      const fighter = fighterRecord({
        name,
        row,
        profile: profiles.get(name),
        display: displayOverrides[name] || {},
        compare: compareProfiles[name] || displayOverrides[name]?.compareProfile || {},
        packet: packets[name] || {},
        group,
        rank: index + 1
      });
      fightersByName.set(name, fighter);
    });
  }

  const fighters = [...fightersByName.values()].sort((a, b) => {
    if (a.group !== b.group) return a.group === 'men' ? -1 : 1;
    return a.rank - b.rank;
  });

  const specialMatchups = buildSpecial(fightersByName);

  const index = {
    name: 'Octagon Verdict Index',
    version: new Date().toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    source: 'Generated from ranking-data, display-overrides, fighter-packet manifest, and fighter packets.',
    packetCount: manifest.packets?.length || 0,
    missingPackets,
    defaultScope: 'Judge UFC accomplishments by default. Only mention the scope when it matters.',
    actionWorkflow: [
      'Call getOctagonVerdictIndex to find fighter slugs.',
      'Call getOctagonVerdictFighter once for each fighter being compared.',
      'If index.specialMatchups has the pairKey, call getOctagonVerdictMatchup.'
    ],
    guidance: {
      sourceOfTruth: 'Use these Action files over uploaded Knowledge, memory, web browsing, or old scores.',
      explainWith: ['UFC record', 'title-fight wins', 'adjusted title wins when useful', 'elite wins', 'prime record', 'rounds-won percentage', 'finish percentage', 'active elite years', 'loss context', 'rivalry/direct-fight context'],
      avoid: ['Raw category point totals in normal answers', 'outside citations unless asked', 'Wikipedia/ESPN/UFC links unless asked', 'database/model language', 'repeated UFC-only disclaimers']
    },
    categoriesMeaning: {
      championship: 'Title-level accomplishment and reign quality.',
      opponentQuality: 'Quality and volume of elite wins.',
      primeDominance: 'Prime record, round-winning, finish threat, separation, durability, and control.',
      longevity: 'Active elite years at the top level.',
      penalty: 'Loss-context drag.'
    },
    fighterCount: fighters.length,
    fighters: fighters.map(f => compact({
      slug: f.slug,
      name: f.name,
      group: f.group,
      rank: f.rank,
      appOvr: f.appOvr,
      totalScore: f.totalScore,
      division: f.division,
      tag: f.tag
    })),
    specialMatchups: specialMatchups.map(m => compact({
      pairKey: m.pairKey,
      fighters: m.fighters,
      slugs: m.slugs,
      defaultLean: m.defaultLean,
      margin: m.margin,
      coreDebate: m.coreDebate
    }))
  };

  const legacyPointer = {
    name: 'Octagon Verdict Data Pointer',
    version: index.version,
    generatedAt: index.generatedAt,
    deprecated: 'Do not use this legacy all-in-one endpoint for comparisons.',
    useInstead: {
      index: '/assets/data/octagon-verdict/index.json',
      fighter: '/assets/data/octagon-verdict/fighters/{slug}.json',
      matchup: '/assets/data/octagon-verdict/matchups/{pairKey}.json'
    },
    guidance: index.guidance
  };

  return { index, fighters, specialMatchups, legacyPointer };
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data)}\n`, 'utf8');
}

const { index, fighters, specialMatchups, legacyPointer } = build();
fs.rmSync(dataDir, { recursive: true, force: true });
fs.mkdirSync(fightersDir, { recursive: true });
fs.mkdirSync(matchupsDir, { recursive: true });

writeJson(path.join(dataDir, 'index.json'), index);
for (const fighter of fighters) {
  writeJson(path.join(fightersDir, `${fighter.slug}.json`), fighter);
}
for (const matchup of specialMatchups) {
  writeJson(path.join(matchupsDir, `${matchup.pairKey}.json`), matchup);
}
writeJson(legacyPath, legacyPointer);

console.log(`Built Octagon Verdict index with ${index.fighterCount} fighters.`);
console.log(`Index size: ${fs.statSync(path.join(dataDir, 'index.json')).size} bytes.`);
console.log(`Fighter files: ${fighters.length}`);
console.log(`Special matchup files: ${specialMatchups.length}`);
if (index.missingPackets.length) console.warn(`Missing packet files: ${index.missingPackets.join(', ')}`);
