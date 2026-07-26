import { writeFile } from "node:fs/promises";

const supabaseUrl = String(process.env.V1_SUPABASE_URL || "").replace(/\/$/, "");
const serviceRoleKey = String(process.env.V1_SERVICE_ROLE_KEY || "");
const outputPath = String(process.env.EXPORT_OUTPUT || "/tmp/octagon-v1-export.json");
const cutoff = new Date(process.env.EXPORT_CUTOFF || "2026-07-25T00:00:00Z");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("V1 Supabase service credentials are required.");
}
if (!Number.isFinite(cutoff.getTime())) {
  throw new Error("EXPORT_CUTOFF must be a valid timestamp.");
}

const restBase = `${supabaseUrl}/rest/v1`;
const headers = {
  apikey: serviceRoleKey,
  authorization: `Bearer ${serviceRoleKey}`,
  accept: "application/json",
};

async function fetchRows(table, params, { allowFailure = false } = {}) {
  const rows = [];
  const pageSize = 1000;
  for (let start = 0; ; start += pageSize) {
    const url = new URL(`${restBase}/${table}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
    const response = await fetch(url, {
      headers: {
        ...headers,
        range: `${start}-${start + pageSize - 1}`,
        "range-unit": "items",
      },
    });
    if (!response.ok) {
      const detail = await response.text();
      if (allowFailure) return null;
      throw new Error(`${table} export failed (${response.status}): ${detail.slice(0, 500)}`);
    }
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error(`${table} did not return a row array.`);
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

function normalizeDisplayName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function cleanDisplayName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function inFilter(values) {
  const safe = unique(values);
  return safe.length ? `in.(${safe.join(",")})` : null;
}

function safeInteger(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let groupMembers = await fetchRows("pick_group_members", {
  select: "id,display_name,profile_photo_data",
  order: "created_at.asc",
}, { allowFailure: true });
if (!groupMembers) {
  groupMembers = await fetchRows("pick_group_members", {
    select: "id,display_name",
    order: "created_at.asc",
  });
}

groupMembers = groupMembers.map((member) => ({
  ...member,
  profile_photo_data: member.profile_photo_data || null,
}));

const dailyAttempts = await fetchRows("play_daily_attempts", {
  select: "member_id,challenge_day,game_type,official_score,best_score,attempt_count,first_completed_at",
  game_type: "eq.find-leader",
  order: "challenge_day.asc",
});

const completedEvents = (await fetchRows("pick_events", {
  select: "id,name,subtitle,event_type,event_date,location,status",
  status: "eq.complete",
  event_date: `lt.${cutoff.toISOString()}`,
  order: "event_date.asc",
})).filter((event) => new Date(event.event_date).getTime() < cutoff.getTime());

const eventIds = completedEvents.map((event) => event.id);
const fights = eventIds.length ? await fetchRows("pick_fights", {
  select: "id,event_id,bout_order,weight_class,red_name,blue_name,lock_at,winner_name,result_status",
  event_id: inFilter(eventIds),
  order: "event_id.asc,bout_order.asc",
}) : [];

const resolvedFights = fights.filter((fight) => (
  fight.result_status === "complete"
  && cleanDisplayName(fight.winner_name)
  && [cleanDisplayName(fight.red_name), cleanDisplayName(fight.blue_name)].includes(cleanDisplayName(fight.winner_name))
));
const resolvedFightIds = resolvedFights.map((fight) => fight.id);
const resolvedEventIds = unique(resolvedFights.map((fight) => fight.event_id));

const groupEvents = resolvedEventIds.length ? await fetchRows("pick_group_events", {
  select: "group_id,event_id,room_id",
  event_id: inFilter(resolvedEventIds),
}) : [];
const roomIds = unique(groupEvents.map((row) => row.room_id));
const roomMembers = roomIds.length ? await fetchRows("pick_room_members", {
  select: "id,room_id,display_name,group_member_id",
  room_id: inFilter(roomIds),
}) : [];
const selections = resolvedFightIds.length ? await fetchRows("pick_selections", {
  select: "member_id,fight_id,fighter_name,picked_at",
  fight_id: inFilter(resolvedFightIds),
  order: "picked_at.asc",
}) : [];

const groupMemberById = new Map(groupMembers.map((member) => [member.id, member]));
const roomMemberById = new Map(roomMembers.map((member) => [member.id, member]));
const fightById = new Map(resolvedFights.map((fight) => [fight.id, fight]));
const eventById = new Map(completedEvents.map((event) => [event.id, event]));

const profiles = new Map();
function ensureProfile(displayName, avatarPhotoData = null) {
  const cleaned = cleanDisplayName(displayName);
  const normalizedName = normalizeDisplayName(cleaned);
  if (!normalizedName) return null;
  const current = profiles.get(normalizedName) || {
    displayName: cleaned,
    normalizedName,
    avatarPhotoData: null,
    findLeader: [],
    picks: [],
  };
  if (!current.avatarPhotoData && avatarPhotoData) current.avatarPhotoData = avatarPhotoData;
  profiles.set(normalizedName, current);
  return current;
}

for (const member of groupMembers) {
  ensureProfile(member.display_name, member.profile_photo_data);
}

for (const attempt of dailyAttempts) {
  const member = groupMemberById.get(attempt.member_id);
  if (!member) continue;
  const profile = ensureProfile(member.display_name, member.profile_photo_data);
  if (!profile) continue;
  const day = String(attempt.challenge_day || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
  profile.findLeader.push({
    day,
    officialScore: Math.max(0, Math.min(10, safeInteger(attempt.official_score))),
    bestScore: Math.max(0, Math.min(10, safeInteger(attempt.best_score, safeInteger(attempt.official_score)))),
    attempts: Math.max(1, safeInteger(attempt.attempt_count, 1)),
    completedAt: attempt.first_completed_at || `${day}T12:00:00Z`,
  });
}

const pickConflictKey = new Map();
for (const selection of selections) {
  const roomMember = roomMemberById.get(selection.member_id);
  const fight = fightById.get(selection.fight_id);
  if (!roomMember || !fight) continue;
  const groupMember = roomMember.group_member_id ? groupMemberById.get(roomMember.group_member_id) : null;
  const profile = ensureProfile(groupMember?.display_name || roomMember.display_name, groupMember?.profile_photo_data || null);
  if (!profile) continue;
  const fighterName = cleanDisplayName(selection.fighter_name);
  if (![cleanDisplayName(fight.red_name), cleanDisplayName(fight.blue_name)].includes(fighterName)) continue;
  const conflictKey = `${profile.normalizedName}|${fight.event_id}|${fight.id}`;
  const previous = pickConflictKey.get(conflictKey);
  if (previous && previous !== fighterName) {
    throw new Error(`Conflicting V1 picks for ${profile.displayName} on ${fight.id}: ${previous} vs ${fighterName}`);
  }
  pickConflictKey.set(conflictKey, fighterName);
  profile.picks.push({
    eventId: fight.event_id,
    fightId: fight.id,
    fighterName,
    fighterSlug: slugify(fighterName),
    pickedAt: selection.picked_at || null,
  });
}

for (const profile of profiles.values()) {
  const findLeaderByDay = new Map();
  for (const row of profile.findLeader) {
    const existing = findLeaderByDay.get(row.day);
    if (!existing) {
      findLeaderByDay.set(row.day, row);
      continue;
    }
    existing.bestScore = Math.max(existing.bestScore, row.bestScore);
    existing.attempts = Math.max(existing.attempts, row.attempts);
    existing.completedAt = new Date(existing.completedAt) <= new Date(row.completedAt) ? existing.completedAt : row.completedAt;
  }
  profile.findLeader = [...findLeaderByDay.values()].sort((left, right) => left.day.localeCompare(right.day));

  const picksByFight = new Map();
  for (const pick of profile.picks) picksByFight.set(`${pick.eventId}|${pick.fightId}`, pick);
  profile.picks = [...picksByFight.values()].sort((left, right) => (
    left.eventId.localeCompare(right.eventId) || left.fightId.localeCompare(right.fightId)
  ));
}

const exportEvents = completedEvents
  .filter((event) => resolvedEventIds.includes(event.id))
  .map((event) => ({
    eventId: event.id,
    name: cleanDisplayName(event.name) || "UFC Event",
    subtitle: cleanDisplayName(event.subtitle),
    venue: "V1 historical import",
    location: cleanDisplayName(event.location) || "Unknown",
    startsAt: new Date(event.event_date).toISOString(),
    locksAt: new Date(event.event_date).toISOString(),
    season: new Date(event.event_date).getUTCFullYear(),
    status: "complete",
  }));

const exportFights = resolvedFights.map((fight) => ({
  eventId: fight.event_id,
  boutId: fight.id,
  position: Math.max(1, safeInteger(fight.bout_order, 1)),
  weightClass: cleanDisplayName(fight.weight_class) || "UFC",
  redFighterSlug: slugify(fight.red_name),
  redFighterName: cleanDisplayName(fight.red_name),
  blueFighterSlug: slugify(fight.blue_name),
  blueFighterName: cleanDisplayName(fight.blue_name),
  winnerFighterSlug: slugify(fight.winner_name),
}));

const payload = {
  schemaVersion: 1,
  source: "Octagon HQ V1 production",
  generatedAt: new Date().toISOString(),
  cutoff: cutoff.toISOString(),
  rules: {
    completedEventsOnly: true,
    resolvedWinnerFightsOnly: true,
    preserveExistingV2Rows: true,
    excludedCurrentEvent: true,
  },
  profiles: [...profiles.values()].sort((left, right) => left.normalizedName.localeCompare(right.normalizedName)),
  pickEvents: exportEvents,
  pickFights: exportFights,
  summary: {
    profiles: profiles.size,
    avatars: [...profiles.values()].filter((profile) => profile.avatarPhotoData).length,
    findLeaderDays: [...profiles.values()].reduce((sum, profile) => sum + profile.findLeader.length, 0),
    completedPickEvents: exportEvents.length,
    resolvedPickFights: exportFights.length,
    profilePicks: [...profiles.values()].reduce((sum, profile) => sum + profile.picks.length, 0),
    excludedEventsAtOrAfterCutoff: true,
  },
};

await writeFile(outputPath, `${JSON.stringify(payload)}\n`, { mode: 0o600 });
console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  cutoff: payload.cutoff,
  summary: payload.summary,
}));
