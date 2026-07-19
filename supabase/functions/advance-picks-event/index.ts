import { createClient } from "npm:@supabase/supabase-js@2";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const OPEN_STATUSES = new Set(["upcoming", "live"]);
const FINISHED_STATUSES = new Set(["complete", "hidden"]);
const STALE_ACTIVE_GRACE_MS = 6 * 60 * 60 * 1000;

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function randomRoomCode() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function eventIsFinished(event, now) {
  if (!event) return true;
  if (FINISHED_STATUSES.has(String(event.status || ""))) return true;
  const eventTime = new Date(event.event_date || 0).getTime();
  return event.status !== "live" && Number.isFinite(eventTime) && eventTime < now - STALE_ACTIVE_GRACE_MS;
}

async function createRoom(supabase, group, eventId) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = randomRoomCode();
    const { data, error } = await supabase
      .from("pick_rooms")
      .insert({
        code,
        event_id: eventId,
        name: group.name,
        admin_token_hash: group.admin_token_hash,
        group_id: group.id,
      })
      .select("id,code,event_id")
      .single();

    if (!error) return data;
    if (error.code !== "23505") throw new Error(`Could not create room for ${group.code}: ${error.message}`);
  }
  throw new Error(`Could not generate a unique room code for ${group.code}`);
}

async function ensureRoomMembers(supabase, groupId, roomId) {
  const [{ data: groupMembers, error: groupError }, { data: roomMembers, error: roomError }] = await Promise.all([
    supabase.from("pick_group_members").select("id,display_name,member_token_hash").eq("group_id", groupId),
    supabase.from("pick_room_members").select("group_member_id").eq("room_id", roomId),
  ]);
  if (groupError) throw new Error(`Could not load group members: ${groupError.message}`);
  if (roomError) throw new Error(`Could not load room members: ${roomError.message}`);

  const existing = new Set((roomMembers || []).map((member) => member.group_member_id).filter(Boolean));
  const missing = (groupMembers || [])
    .filter((member) => !existing.has(member.id))
    .map((member) => ({
      room_id: roomId,
      display_name: member.display_name,
      member_token_hash: member.member_token_hash,
      group_member_id: member.id,
    }));

  if (!missing.length) return 0;
  const { error } = await supabase.from("pick_room_members").insert(missing);
  if (error) throw new Error(`Could not carry group members into the next event: ${error.message}`);
  return missing.length;
}

async function ensureGroupEvent(supabase, group, target, summary) {
  const { data: existingLink, error: linkError } = await supabase
    .from("pick_group_events")
    .select("room_id")
    .eq("group_id", group.id)
    .eq("event_id", target.id)
    .maybeSingle();
  if (linkError) throw new Error(`Could not inspect ${group.code} event link: ${linkError.message}`);

  let room = null;
  if (existingLink?.room_id) {
    const { data, error } = await supabase
      .from("pick_rooms")
      .select("id,code,event_id")
      .eq("id", existingLink.room_id)
      .single();
    if (error) throw new Error(`Could not load the existing ${group.code} room: ${error.message}`);
    room = data;
    summary.roomsReused += 1;
  } else {
    const { data: existingRoom, error: roomLookupError } = await supabase
      .from("pick_rooms")
      .select("id,code,event_id")
      .eq("group_id", group.id)
      .eq("event_id", target.id)
      .maybeSingle();
    if (roomLookupError) throw new Error(`Could not inspect ${group.code} rooms: ${roomLookupError.message}`);
    room = existingRoom || await createRoom(supabase, group, target.id);
    if (!existingRoom) summary.roomsCreated += 1;

    const { error: eventLinkError } = await supabase
      .from("pick_group_events")
      .upsert({ group_id: group.id, event_id: target.id, room_id: room.id }, { onConflict: "group_id,event_id" });
    if (eventLinkError) throw new Error(`Could not attach ${target.id} to ${group.code}: ${eventLinkError.message}`);
  }

  summary.membersAdded += await ensureRoomMembers(supabase, group.id, room.id);

  const { error: groupUpdateError } = await supabase
    .from("pick_groups")
    .update({ active_event_id: target.id })
    .eq("id", group.id);
  if (groupUpdateError) throw new Error(`Could not activate ${target.id} for ${group.code}: ${groupUpdateError.message}`);

  const { error: adminRoomError } = await supabase
    .from("pick_events")
    .update({ admin_room_id: room.id })
    .eq("id", target.id)
    .is("admin_room_id", null);
  if (adminRoomError) throw new Error(`Could not set the result-admin room for ${target.id}: ${adminRoomError.message}`);

  summary.groupsAdvanced += 1;
  summary.advanced.push({ groupCode: group.code, roomCode: room.code });
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json(405, { error: "POST required" });

  const expectedSecret = Deno.env.get("CARD_SYNC_SECRET") || Deno.env.get("ODDS_REFRESH_SECRET") || "";
  const suppliedSecret = request.headers.get("x-card-sync-secret") || request.headers.get("x-odds-refresh-secret") || "";
  if (!expectedSecret || suppliedSecret !== expectedSecret) return json(401, { error: "Unauthorized event advance" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !serviceRoleKey) return json(500, { error: "Missing Supabase service credentials" });

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const summary = {
    targetEventId: null,
    targetEventName: null,
    groupsChecked: 0,
    groupsEligible: 0,
    groupsAdvanced: 0,
    roomsCreated: 0,
    roomsReused: 0,
    membersAdded: 0,
    advanced: [],
  };

  try {
    const now = Date.now();
    const { data: openEvents, error: eventError } = await supabase
      .from("pick_events")
      .select("id,name,subtitle,event_date,status")
      .in("status", ["upcoming", "live"])
      .order("event_date", { ascending: true });
    if (eventError) throw new Error(`Could not load upcoming events: ${eventError.message}`);

    const target = (openEvents || [])
      .filter((event) => OPEN_STATUSES.has(event.status))
      .filter((event) => event.status === "live" || new Date(event.event_date).getTime() >= now - STALE_ACTIVE_GRACE_MS)
      .sort((left, right) => new Date(left.event_date).getTime() - new Date(right.event_date).getTime())[0];

    if (!target) return json(200, { advanced: false, message: "No upcoming UFC event is ready", summary });
    summary.targetEventId = target.id;
    summary.targetEventName = `${target.name}${target.subtitle ? ` · ${target.subtitle}` : ""}`;

    const { data: groups, error: groupError } = await supabase
      .from("pick_groups")
      .select("id,code,name,admin_token_hash,active_event_id");
    if (groupError) throw new Error(`Could not load Picks groups: ${groupError.message}`);
    summary.groupsChecked = (groups || []).length;

    const activeIds = [...new Set((groups || []).map((group) => group.active_event_id).filter(Boolean))];
    let activeEvents = [];
    if (activeIds.length) {
      const { data, error } = await supabase
        .from("pick_events")
        .select("id,status,event_date")
        .in("id", activeIds);
      if (error) throw new Error(`Could not inspect active group events: ${error.message}`);
      activeEvents = data || [];
    }
    const activeById = new Map(activeEvents.map((event) => [event.id, event]));

    const eligible = (groups || []).filter((group) => {
      if (group.active_event_id === target.id) return false;
      return eventIsFinished(activeById.get(group.active_event_id), now);
    });
    summary.groupsEligible = eligible.length;

    for (const group of eligible) await ensureGroupEvent(supabase, group, target, summary);

    return json(200, {
      advanced: summary.groupsAdvanced > 0,
      summary,
      advancedAt: new Date().toISOString(),
    });
  } catch (error) {
    return json(500, { error: "Picks event advance failed", detail: error.message, summary });
  }
});
