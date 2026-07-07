#!/usr/bin/env node
/*
 * Build the public Octagon Verdict GPT Action data feed from the same files
 * that power the app. This keeps the GPT feed synced with fighter packets.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'assets/data/octagon-verdict-data.json');

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

function clean(value) {
  if (value === undefined || value === null || value === '') return undefined;
  return value;
}

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function compactObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === undefined || value === null || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
      return true;
    })
  );
}

function uniqueStrings(values) {
  return Array.from(new Set((values || []).filter(Boolean).map(String)));
}

function parseSnapshot(snapshot) {
  const out = {};
  if (!Array.isArray(snapshot)) return out;
  for (const pair of snapshot) {
    if (!Array.isArray(pair) || pair.length < 2) continue;
    const [label, value] = pair;
    if (!label) continue;
    out[String(label)] = value;
  }
  return out;
}

function numericRankedRows(rows) {
  return [...(rows || [])]
    .filter(row => row && row.fighter && Number.isFinite(Number(row.totalScore)))
    .sort((a, b) => Number(b.totalScore || 0) - Number(a.totalScore || 0));
}

function titleFightWinsFrom(profile, profileStats, snapshot) {
  const direct = clean(profileStats?.titleFightWins ?? profile?.titleFightWins);
  if (direct !== undefined) return direct;

  const snapTitle = snapshot['UFC Title-Fight Wins'];
  if (snapTitle !== undefined) {
    const match = String(snapTitle).match(/\d+(?:\.\d+)?/);
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
  return clean(round(profileStats?.adjustedTitleWins ?? profile?.title?.adjustedTitleWins));
}

function buildContext() {
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
  sandbox.window = sandbox.window || {};
  return vm.createContext(sandbox);
}

function loadAppData() {
  const context = buildContext();

  runScript(context, 'assets/data/ranking-data.js');
  runScript(context, 'assets/data/display-overrides.js', 'window.DISPLAY_OVERRIDES = DISPLAY_OVERRIDES;');
  runScript(context, 'assets/data/fighter-packet-manifest.js');

  const manifest = context.window.UFC_FIGHTER_PACKET_MANIFEST || { packets: [] };
  const missingPackets = [];

  for (const packet of manifest.packets || []) {
    const relPath = `assets/data/fighter-packets/${packet.slug}.js`;
    if (!exists(relPath)) {
      missingPackets.push(packet.slug);
      continue;
    }
    runScript(context, relPath);
  }

  return { context, manifest, missingPackets };
}

function buildFighter({ name, boardRow, profile, display, compareProfile, packet, leaderboard, rank }) {
  const snapshot = parseSnapshot(display?.snapshot);
  const profileStats = display?.packetProfileStats || packet?.profileStats || {};
  const title = profile?.title || {};
  const opponentLedger = Array.isArray(profile?.opponents) ? profile.opponents : [];

  const categoryScores = compactObject({
    championship: round(boardRow?.championship ?? profile?.championship),
    opponentQuality: round(boardRow?.opponentQuality ?? profile?.opponentQuality),
    primeDominance: round(boardRow?.primeDominance ?? profile?.primeDominance),
    longevity: round(boardRow?.longevity ?? profile?.longevity),
    apexPeak: round(boardRow?.apexPeak ?? profile?.apexPeak),
    penalty: round(boardRow?.penalty ?? profile?.penalty)
  });

  const humanStats = compactObject({
    ufcRecord: clean(profileStats.ufcRecord ?? profile?.ufcRecord ?? boardRow?.ufcRecord ?? snapshot['UFC Record']),
    titleFightWins: clean(titleFightWinsFrom(profile, profileStats, snapshot)),
    adjustedTitleWins: clean(adjustedTitleWinsFrom(profile, profileStats)),
    eliteWins: clean(profileStats.eliteWins),
    primeRecord: clean(profileStats.primeRecord ?? profile?.primeRecord ?? boardRow?.primeRecord ?? snapshot['Prime Record']),
    roundsWonPct: clean(round(profileStats.roundsWonPct ?? profile?.roundsWonPct ?? boardRow?.roundsWonPct)),
    finishRatePct: clean(round(profileStats.finishRatePct ?? profile?.finishRatePct ?? boardRow?.finishRatePct)),
    activeEliteYears: clean(round(profileStats.activeEliteYears ?? profile?.activeEliteYears ?? boardRow?.activeEliteYears)),
    timesFinishedPrime: clean(profileStats.timesFinishedPrime ?? profile?.timesFinishedPrime ?? boardRow?.timesFinishedPrime),
    titleSummary: clean(compareProfile?.titleSummary ?? title.notes),
    primeSummary: clean(compareProfile?.primeSummary),
    lossContext: clean(profileStats.lossContext ?? profile?.notes ?? boardRow?.notes),
    divisionStrengthContext: clean(profileStats.divisionStrengthContext),
    signatureWins: clean(compareProfile?.signatureWins),
    snapshot
  });

  const opponentHighlights = opponentLedger.slice(0, 14).map(item => compactObject({
    opponent: item.opponent,
    context: item.context,
    credit: round(item.credit),
    type: item.type,
    notes: item.notes
  }));

  const strengths = uniqueStrings([
    compareProfile?.edge,
    compareProfile?.peak,
    compareProfile?.championship,
    compareProfile?.opponentQuality,
    compareProfile?.longevity,
    ...(packet?.display?.keyJudgmentCalls || []).map(pair => Array.isArray(pair) ? `${pair[0]}: ${pair[1]}` : pair),
    display?.oneLiner
  ]).slice(0, 8);

  const weaknesses = uniqueStrings([
    compareProfile?.weakness,
    compareProfile?.counter,
    display?.whyNotHigher,
    display?.whyNotLower
  ]).slice(0, 6);

  const notes = uniqueStrings([
    profile?.notes,
    boardRow?.notes,
    display?.finalTakeaway,
    packet?.display?.finalTakeaway,
    ...(packet?.display?.bigAssumptions || []).map(pair => Array.isArray(pair) ? `${pair[0]}: ${pair[1]}` : pair)
  ]).slice(0, 10);

  return compactObject({
    slug: slugify(name),
    name,
    group: leaderboard,
    rank,
    appOvr: clean(display?.overallOvr),
    totalScore: round(boardRow?.totalScore ?? profile?.totalScore),
    division: clean(display?.divisionLabel ?? profile?.primaryDivision ?? boardRow?.primaryDivision),
    resumeTag: clean(display?.resumeTag),
    oneLiner: clean(display?.oneLiner),
    coreCase: clean(compareProfile?.shortCase ?? display?.finalTakeaway ?? display?.whyRankedHere ?? packet?.display?.finalTakeaway),
    bestArgument: clean(compareProfile?.bestArgument),
    categoryScores,
    humanStats,
    strengths,
    weaknesses,
    notes,
    opponentHighlights,
    comparisonAngles: uniqueStrings([
      compareProfile?.titleStyle,
      compareProfile?.primeStyle,
      compareProfile?.edge,
      profileStats?.divisionStrengthContext
    ]).slice(0, 5)
  });
}

function buildSpecialMatchups(fightersByName, fightLedger) {
  const lookup = (name) => fightersByName.get(name);
  const margin = (a, b) => {
    const fa = lookup(a);
    const fb = lookup(b);
    if (!fa || !fb || !Number.isFinite(fa.totalScore) || !Number.isFinite(fb.totalScore)) return undefined;
    return round(Math.abs(fa.totalScore - fb.totalScore));
  };

  const staticMatchups = [
    {
      fighters: ['Kamaru Usman', 'Max Holloway'],
      coreDebate: 'Usman has the better championship reign and stronger peak control. Holloway has the deeper overall case because of elite longevity and quality-win volume.',
      suggestedFinalSplit: { betterPeakChampion: 'Kamaru Usman', greaterOverallCase: 'Max Holloway, barely' },
      notes: [
        'Use title-fight wins, elite longevity, prime rounds-won percentage, and opponent-quality volume instead of raw category point totals.'
      ]
    },
    {
      fighters: ['Jon Jones', 'Georges St-Pierre'],
      coreDebate: 'GSP is the cleaner case. Jones is the bigger case.',
      suggestedFinalSplit: { cleanerCase: 'Georges St-Pierre', greaterOverallCase: 'Jon Jones' },
      notes: [
        'If the user heavily values clean record or controversy context, GSP becomes easier to defend.',
        'The current board keeps Jones ahead because of championship volume and total top-end value.'
      ]
    },
    {
      fighters: ['Khabib Nurmagomedov', 'Islam Makhachev'],
      coreDebate: 'Khabib has the cleaner peak. Islam has the fuller current championship and modern-depth case.',
      suggestedFinalSplit: { cleanerPeak: 'Khabib Nurmagomedov', greaterCurrentCase: 'Islam Makhachev, barely' },
      notes: [
        'Avoid raw category point totals unless asked.',
        'Use Khabib undefeated run and Islam title-fight volume as the plain-language swing points.'
      ]
    }
  ];

  const dynamicLedger = Object.entries(fightLedger || {}).map(([key, item]) => compactObject({
    key,
    fighters: item.fighters,
    winner: item.winner,
    importance: item.importance,
    summary: item.summary,
    fights: item.fights
  }));

  return staticMatchups.map(matchup => {
    const [a, b] = matchup.fighters;
    const fa = lookup(a);
    const fb = lookup(b);
    let defaultLean;
    if (fa && fb && Number.isFinite(fa.totalScore) && Number.isFinite(fb.totalScore)) {
      defaultLean = fa.totalScore === fb.totalScore ? 'Essentially even' : (fa.totalScore > fb.totalScore ? a : b);
    }
    return compactObject({ ...matchup, defaultLean, margin: margin(a, b) });
  }).concat(dynamicLedger);
}

function buildPayload() {
  const { context, manifest, missingPackets } = loadAppData();
  const rankingData = context.window.RANKING_DATA || {};
  const displayOverrides = context.window.DISPLAY_OVERRIDES || {};
  const packetsByName = context.window.UFC_FIGHTER_PACKETS || {};
  const compareProfiles = context.window.COMPARE_PROFILES || {};
  const fightLedger = context.window.COMPARE_FIGHT_LEDGER || {};

  const menRows = numericRankedRows(rankingData.men);
  const womenRows = numericRankedRows(rankingData.women);
  const profileByName = new Map((rankingData.fighters || []).map(profile => [profile.fighter, profile]));
  const fightersByName = new Map();

  for (const [leaderboard, rows] of [['men', menRows], ['women', womenRows]]) {
    rows.forEach((row, index) => {
      const name = row.fighter;
      const fighter = buildFighter({
        name,
        boardRow: row,
        profile: profileByName.get(name),
        display: displayOverrides[name] || {},
        compareProfile: compareProfiles[name] || displayOverrides[name]?.compareProfile || {},
        packet: packetsByName[name] || {},
        leaderboard,
        rank: index + 1
      });
      fightersByName.set(name, fighter);
    });
  }

  const fighters = [...fightersByName.values()].sort((a, b) => {
    if (a.group !== b.group) return a.group === 'men' ? -1 : 1;
    return a.rank - b.rank;
  });

  return {
    name: 'Octagon Verdict Data',
    version: new Date().toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    generatedFrom: {
      rankingData: 'assets/data/ranking-data.js',
      displayOverrides: 'assets/data/display-overrides.js',
      fighterPacketManifest: 'assets/data/fighter-packet-manifest.js',
      packetCount: manifest.packets?.length || 0,
      missingPackets
    },
    defaultScope: 'Judge UFC accomplishments by default. Only mention the scope when it actually matters.',
    consumerGuidance: {
      rawScoresAreBackend: true,
      plainLanguageRule: 'Use total scores and category scores to decide the answer, but explain the answer with fan-friendly stats like title-fight wins, UFC record, elite wins, prime record, rounds-won percentage, active elite years, rivalry context, and loss context.',
      avoidInNormalAnswers: [
        'Raw category point totals like championship 11.68 vs 7.41',
        'Footnotes or outside source citations unless asked',
        'Repeated UFC-only disclaimers',
        'Database/model language'
      ]
    },
    writingStyle: {
      voice: 'plain, scoring-aware, conversational, direct',
      defaultFlow: [
        'Start with a plain verdict.',
        'Say if the comparison is close and who is ahead if useful.',
        'Explain where Fighter A has the edge.',
        'Explain where Fighter B has the edge.',
        'Ask the right debate question for each side.',
        'End with a clean final split.'
      ],
      avoid: [
        'Do not mention Cody.',
        'Do not sound like a database or algorithm.',
        'Do not constantly say UFC-only.',
        'Use resume, not résumé.',
        'Do not use tables unless asked.'
      ]
    },
    categoryDefinitions: {
      championship: 'Title-level accomplishment, adjusted title wins, title-fight wins, and reign quality.',
      opponentQuality: 'Quality and volume of elite wins.',
      primeDominance: 'Prime record, round-winning, finish threat, separation, durability, and control.',
      longevity: 'Active elite years and how long the fighter stayed relevant at the top level.',
      penalty: 'Loss-context drag based on timing, opponent quality, finish context, and division context.'
    },
    fighterCount: fighters.length,
    leaderboards: {
      men: menRows.map((row, index) => ({ rank: index + 1, name: row.fighter, totalScore: round(row.totalScore) })),
      women: womenRows.map((row, index) => ({ rank: index + 1, name: row.fighter, totalScore: round(row.totalScore) }))
    },
    fighters,
    specialMatchups: buildSpecialMatchups(fightersByName, fightLedger)
  };
}

const payload = buildPayload();
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Built ${path.relative(root, outPath)} with ${payload.fighterCount} fighters.`);
console.log(`Packet manifest count: ${payload.generatedFrom.packetCount}`);
if (payload.generatedFrom.missingPackets.length) {
  console.warn(`Missing packet files: ${payload.generatedFrom.missingPackets.join(', ')}`);
}
