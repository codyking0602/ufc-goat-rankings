import { createClient } from "npm:@supabase/supabase-js@2";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const ALLOWED_SOURCE_HOSTS = new Set(["ufc.com", "www.ufc.com", "mmamania.com", "www.mmamania.com"]);
const RESOLVED_STATUSES = new Set(["complete", "draw", "no-contest"]);

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function normalizeSpace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeName(value) {
  return normalizeSpace(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\b/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function normalizeWeight(value) {
  return normalizeName(value).replace(/womens/g, "");
}

function matchupKey(first, second) {
  return [normalizeName(first), normalizeName(second)].sort().join("|");
}

function isMainCard(section) {
  return String(section || "").toLowerCase().includes("main");
}

function isPickable(event, fight) {
  return event.event_type === "numbered" || /full card/i.test(String(event.card_rule || "")) || isMainCard(fight.card_section);
}

function sharedFighterCount(left, right) {
  const leftNames = new Set([normalizeName(left.red_name), normalizeName(left.blue_name)]);
  return [normalizeName(right.red_name), normalizeName(right.blue_name)].filter((name) => leftNames.has(name)).length;
}

function safeFightId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function deleteFightPicks(supabase, fightIds, summary) {
  const ids = [...new Set((fightIds || []).filter(Boolean))];
  if (!ids.length) return;
  const { data, error } = await supabase
    .from("pick_selections")
    .delete()
    .in("fight_id", ids)
    .select("fight_id");
  if (error) throw new Error(`Could not reset picks for ${ids.join(", ")}: ${error.message}`);
  summary.picksReset += (data || []).length;
}

function validatePayload(body) {
  if (!body || body.confirmed !== true || !body.confirmationHash) throw new Error("Two matching source captures are required");
  if (!body.event?.id || !body.event?.event_date || !body.event?.event_type) throw new Error("Incomplete event payload");
  if (!Array.isArray(body.fights)) throw new Error("Fight snapshot is missing");
  const minFights = Math.max(5, Number(body.validation?.minFights || 5));
  if (body.fights.length < minFights) throw new Error(`Snapshot contains only ${body.fights.length} fights; expected at least ${minFights}`);
  const sourceUrl = new URL(body.sourceUrl);
  if (!ALLOWED_SOURCE_HOSTS.has(sourceUrl.hostname.toLowerCase())) throw new Error(`Unapproved card source: ${sourceUrl.hostname}`);
  const expected = body.validation?.expectedMainEvent;
  if (Array.isArray(expected) && expected.length === 2) {
    const expectedKey = matchupKey(expected[0], expected[1]);
    if (!body.fights.some((fight) => matchupKey(fight.red_name, fight.blue_name) === expectedKey)) {
      throw new Error("Expected main event is missing from the confirmed snapshot");
    }
  }
  const pairs = new Set();
  for (const fight of body.fights) {
    if (!fight.id || !fight.red_name || !fight.blue_name || !fight.card_section || !fight.weight_class || !fight.lock_at) {
      throw new Error("Snapshot contains an incomplete fight row");
    }
    if (!Number.isFinite(new Date(fight.lock_at).getTime())) throw new Error(`Invalid lock time for ${fight.id}`);
    const pair = matchupKey(fight.red_name, fight.blue_name);
    if (!pair || pair === "|" || pairs.has(pair)) throw new Error(`Duplicate or invalid matchup: ${fight.red_name} vs. ${fight.blue_name}`);
    pairs.add(pair);
  }
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json(405, { error: "POST required" });

  const expectedSecret = Deno.env.get("CARD_SYNC_SECRET") || Deno.env.get("ODDS_REFRESH_SECRET") || "";
  const suppliedSecret = request.headers.get("x-card-sync-secret") || "";
  if (!expectedSecret || suppliedSecret !== expectedSecret) return json(401, { error: "Unauthorized card sync" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !serviceRoleKey) return json(500, { error: "Missing Supabase service credentials" });

  let body;
  try {
    body = await request.json();
    validatePayload(body);
  } catch (error) {
    return json(400, { error: "Invalid card snapshot", detail: error.message });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const event = body.event;
  const incomingFights = body.fights.map((fight) => ({
    id: safeFightId(fight.id),
    event_id: event.id,
    bout_order: Number(fight.bout_order),
    card_section: normalizeSpace(fight.card_section),
    weight_class: normalizeSpace(fight.weight_class),
    red_name: normalizeSpace(fight.red_name),
    blue_name: normalizeSpace(fight.blue_name),
    lock_at: new Date(fight.lock_at).toISOString(),
  }));
  const summary = {
    eventId: event.id,
    sourceType: body.sourceType,
    sourceUrl: body.sourceUrl,
    confirmationHash: body.confirmationHash,
    fightsReceived: incomingFights.length,
    inserted: 0,
    updated: 0,
    cancelled: 0,
    replacements: 0,
    promotions: 0,
    demotions: 0,
    picksReset: 0,
  };

  try {
    const { data: existingEvent, error: existingEventError } = await supabase
      .from("pick_events")
      .select("id,status")
      .eq("id", event.id)
      .maybeSingle();
    if (existingEventError) throw new Error(`Could not load event: ${existingEventError.message}`);

    const status = existingEvent && ["live", "complete"].includes(existingEvent.status)
      ? existingEvent.status
      : event.status;
    const sourceNote = `${normalizeSpace(event.source_note)} · ${body.fights.length} fights · confirmed ${body.confirmationHash.slice(0, 12)}`;
    const { error: eventError } = await supabase.from("pick_events").upsert({
      id: event.id,
      name: normalizeSpace(event.name),
      subtitle: normalizeSpace(event.subtitle),
      event_type: event.event_type,
      event_date: new Date(event.event_date).toISOString(),
      location: normalizeSpace(event.location),
      card_rule: normalizeSpace(event.card_rule),
      status,
      source_note: sourceNote,
    }, { onConflict: "id" });
    if (eventError) throw new Error(`Could not upsert event: ${eventError.message}`);

    const { data: existingRows, error: existingError } = await supabase
      .from("pick_fights")
      .select("id,event_id,bout_order,card_section,weight_class,red_name,blue_name,lock_at,winner_name,result_status,red_odds,blue_odds,odds_source,odds_updated_at")
      .eq("event_id", event.id);
    if (existingError) throw new Error(`Could not load existing fights: ${existingError.message}`);

    const existing = existingRows || [];
    const activeExisting = existing.filter((fight) => !RESOLVED_STATUSES.has(fight.result_status));
    if (activeExisting.length >= 5 && incomingFights.length < Math.ceil(activeExisting.length * 0.6)) {
      throw new Error(`Refusing destructive card shrink from ${activeExisting.length} to ${incomingFights.length} fights`);
    }

    for (const [index, fight] of existing.entries()) {
      const { error } = await supabase
        .from("pick_fights")
        .update({ bout_order: -1000000 - index })
        .eq("id", fight.id);
      if (error) throw new Error(`Could not stage bout order for ${fight.id}: ${error.message}`);
    }

    const unmatched = new Map(existing.map((fight) => [fight.id, fight]));
    const byPair = new Map();
    for (const fight of existing) {
      const pair = matchupKey(fight.red_name, fight.blue_name);
      const list = byPair.get(pair) || [];
      list.push(fight);
      byPair.set(pair, list);
    }

    for (const incoming of incomingFights) {
      let previous = unmatched.get(incoming.id) || null;
      if (!previous) {
        previous = (byPair.get(matchupKey(incoming.red_name, incoming.blue_name)) || []).find((fight) => unmatched.has(fight.id)) || null;
      }
      if (!previous) {
        const replacementCandidates = [...unmatched.values()].filter((fight) =>
          !RESOLVED_STATUSES.has(fight.result_status) &&
          sharedFighterCount(fight, incoming) === 1 &&
          normalizeWeight(fight.weight_class) === normalizeWeight(incoming.weight_class)
        );
        if (replacementCandidates.length === 1) previous = replacementCandidates[0];
      }

      if (!previous) {
        let fightId = incoming.id;
        if (existing.some((fight) => fight.id === fightId)) fightId = `${fightId}-${incoming.bout_order}`.slice(0, 120);
        const { error } = await supabase.from("pick_fights").insert({
          ...incoming,
          id: fightId,
          winner_name: null,
          result_status: "scheduled",
          red_odds: null,
          blue_odds: null,
          odds_source: null,
          odds_updated_at: null,
        });
        if (error) throw new Error(`Could not insert ${fightId}: ${error.message}`);
        summary.inserted += 1;
        continue;
      }

      unmatched.delete(previous.id);
      const previousPair = matchupKey(previous.red_name, previous.blue_name);
      const incomingPair = matchupKey(incoming.red_name, incoming.blue_name);
      const matchupChanged = previousPair !== incomingPair;
      const wasPickable = isPickable(event, previous);
      const nowPickable = isPickable(event, incoming);
      const promoted = !wasPickable && nowPickable;
      const demoted = wasPickable && !nowPickable;
      if (matchupChanged || demoted) await deleteFightPicks(supabase, [previous.id], summary);
      if (matchupChanged) summary.replacements += 1;
      if (promoted) summary.promotions += 1;
      if (demoted) summary.demotions += 1;

      let redOdds = previous.red_odds;
      let blueOdds = previous.blue_odds;
      let oddsSource = previous.odds_source;
      let oddsUpdatedAt = previous.odds_updated_at;
      if (matchupChanged) {
        redOdds = null;
        blueOdds = null;
        oddsSource = null;
        oddsUpdatedAt = null;
      } else if (normalizeName(previous.red_name) === normalizeName(incoming.blue_name)) {
        redOdds = previous.blue_odds;
        blueOdds = previous.red_odds;
      }

      const resolved = RESOLVED_STATUSES.has(previous.result_status);
      const resultStatus = resolved ? previous.result_status : "scheduled";
      const { error } = await supabase.from("pick_fights").update({
        event_id: event.id,
        bout_order: incoming.bout_order,
        card_section: incoming.card_section,
        weight_class: incoming.weight_class,
        red_name: incoming.red_name,
        blue_name: incoming.blue_name,
        lock_at: incoming.lock_at,
        winner_name: resolved ? previous.winner_name : null,
        result_status: resultStatus,
        red_odds: redOdds,
        blue_odds: blueOdds,
        odds_source: oddsSource,
        odds_updated_at: oddsUpdatedAt,
      }).eq("id", previous.id);
      if (error) throw new Error(`Could not update ${previous.id}: ${error.message}`);
      summary.updated += 1;
    }

    let staleOrder = 1000;
    for (const stale of unmatched.values()) {
      if (RESOLVED_STATUSES.has(stale.result_status)) {
        const { error } = await supabase.from("pick_fights").update({ bout_order: 10000 + staleOrder }).eq("id", stale.id);
        if (error) throw new Error(`Could not preserve resolved fight ${stale.id}: ${error.message}`);
        staleOrder += 1;
        continue;
      }
      await deleteFightPicks(supabase, [stale.id], summary);
      const { error } = await supabase.from("pick_fights").update({
        bout_order: staleOrder,
        result_status: "cancelled",
        winner_name: null,
        red_odds: null,
        blue_odds: null,
        odds_source: null,
        odds_updated_at: null,
      }).eq("id", stale.id);
      if (error) throw new Error(`Could not cancel stale fight ${stale.id}: ${error.message}`);
      staleOrder += 1;
      summary.cancelled += 1;
    }

    if (!isPickable(event, { card_section: "Prelims" })) {
      const { data: prelimRows, error: prelimError } = await supabase
        .from("pick_fights")
        .select("id")
        .eq("event_id", event.id)
        .eq("result_status", "scheduled")
        .not("card_section", "ilike", "%main%");
      if (prelimError) throw new Error(`Could not load non-pickable prelims: ${prelimError.message}`);
      await deleteFightPicks(supabase, (prelimRows || []).map((fight) => fight.id), summary);
    }

    return json(200, { synced: true, summary, syncedAt: new Date().toISOString() });
  } catch (error) {
    return json(500, { error: "Card synchronization failed", detail: error.message, summary });
  }
});
