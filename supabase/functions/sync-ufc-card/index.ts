import { createClient } from "npm:@supabase/supabase-js@2";
import {
  buildReconciliationPlan,
  isAuthoritativeSource,
  isPickable,
  matchupKey,
  normalizeName,
} from "./reconciliation.mjs";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const ALLOWED_SOURCE_HOSTS = new Set(["mmamania.com", "www.mmamania.com"]);
const ALLOWED_SOURCE_TYPES = new Set(["maintained-repo", "mma-mania"]);
const RESOLVED_STATUSES = new Set(["complete", "draw", "no-contest"]);

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function normalizeSpace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function safeFightId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function authorityFromNote(value) {
  return String(value || "").match(/slot-authority=(mma-mania|maintained-repo)/i)?.[1]?.toLowerCase() || null;
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
  if (!body || body.confirmed !== true || !body.confirmationHash) throw new Error("A confirmed card snapshot is required");
  if (!ALLOWED_SOURCE_TYPES.has(body.sourceType)) throw new Error(`Unsupported card source type: ${body.sourceType}`);
  if (!body.event?.id || !body.event?.event_date || !body.event?.event_type) throw new Error("Incomplete event payload");
  if (!Array.isArray(body.fights)) throw new Error("Fight snapshot is missing");
  const minFights = Math.max(5, Number(body.validation?.minFights || 5));
  if (body.fights.length < minFights) throw new Error(`Snapshot contains only ${body.fights.length} fights; expected at least ${minFights}`);
  const expectedMainCardFights = Math.max(0, Number(body.validation?.expectedMainCardFights || 0));
  const mainCardFights = body.fights.filter((fight) => String(fight.card_section || "").toLowerCase().includes("main")).length;
  if (expectedMainCardFights && mainCardFights !== expectedMainCardFights) {
    throw new Error(`Snapshot contains ${mainCardFights} main-card fights; expected exactly ${expectedMainCardFights}`);
  }
  if (body.sourceType === "maintained-repo") {
    if (body.sourceUrl !== "repository:assets/data/picks-events.js") throw new Error("Unapproved maintained card source");
  } else {
    const sourceUrl = new URL(body.sourceUrl);
    if (!ALLOWED_SOURCE_HOSTS.has(sourceUrl.hostname.toLowerCase())) throw new Error(`Unapproved card source: ${sourceUrl.hostname}`);
  }
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
  const incomingPickable = incomingFights.filter((fight) => isPickable(event, fight));
  const summary = {
    eventId: event.id,
    sourceType: body.sourceType,
    sourceUrl: body.sourceUrl,
    confirmationHash: body.confirmationHash,
    fightsReceived: incomingFights.length,
    pickableFightsReceived: incomingPickable.length,
    sectionAuthority: isAuthoritativeSource(body.sourceType) ? body.sourceType : "preserve-existing",
    priorAuthority: null,
    skipped: false,
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
      .select("id,status,source_note")
      .eq("id", event.id)
      .maybeSingle();
    if (existingEventError) throw new Error(`Could not load event: ${existingEventError.message}`);

    const priorAuthority = authorityFromNote(existingEvent?.source_note);
    summary.priorAuthority = priorAuthority;
    if (body.sourceType === "maintained-repo" && priorAuthority === "mma-mania") {
      summary.skipped = true;
      summary.sectionAuthority = "mma-mania";
      return json(200, {
        synced: true,
        skipped: true,
        reason: "MMA Mania already owns this event's card slots",
        summary,
        syncedAt: new Date().toISOString(),
      });
    }

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

    const plan = buildReconciliationPlan(existing, incomingFights, event, body.sourceType);
    const nextAuthority = body.sourceType === "mma-mania"
      ? "mma-mania"
      : body.sourceType === "maintained-repo"
        ? "maintained-repo"
        : priorAuthority || "maintained-repo";
    summary.sectionAuthority = nextAuthority;

    const status = existingEvent && ["live", "complete"].includes(existingEvent.status)
      ? existingEvent.status
      : event.status;
    const sourceNote = `${normalizeSpace(event.source_note)} · slot-authority=${nextAuthority} · ${body.fights.length} fights · ${incomingPickable.length} source-pickable · observed-by=${body.sourceType} · confirmed ${body.confirmationHash.slice(0, 12)}`;
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

    for (const [index, fight] of existing.entries()) {
      const { error } = await supabase
        .from("pick_fights")
        .update({ bout_order: -1000000 - index })
        .eq("id", fight.id);
      if (error) throw new Error(`Could not stage bout order for ${fight.id}: ${error.message}`);
    }

    for (const action of plan.actions) {
      if (action.type === "insert") {
        const incoming = action.incoming;
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

      const { previous, incoming, matchupChanged, promoted, demoted } = action;
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
    for (const stale of plan.stale) {
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
