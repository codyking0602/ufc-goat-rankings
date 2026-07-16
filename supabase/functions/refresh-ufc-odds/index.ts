import { createClient } from "npm:@supabase/supabase-js@2";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const SPORT_KEY = "mma_mixed_martial_arts";
const DEFAULT_BOOKMAKERS = ["betonlineag", "draftkings", "fanduel", "betmgm", "betrivers", "bovada"];

const MAINTAINED_CARDS = [
  {
    id: "ufc-oklahoma-city-2026-07-18",
    name: "UFC Oklahoma City",
    subtitle: "Du Plessis vs. Usman",
    event_type: "fight-night",
    event_date: "2026-07-19T00:00:00.000Z",
    location: "Paycom Center · Oklahoma City, Oklahoma",
    card_rule: "Main card only",
    status: "upcoming",
    source_note: "Full 11-fight card stored as of July 16. Fight Night Picks show only the five-fight main card. Tavares vs. Barriault was cancelled; Hooper vs. Ramirez was promoted.",
    sync_until: "2026-07-19T00:00:00.000Z",
    fights: [
      { id:"okc-barbosa-melisano", bout_order:1, card_section:"Prelims", weight_class:"Women's Flyweight", red_name:"Dione Barbosa", blue_name:"Anna Melisano", lock_at:"2026-07-18T21:00:00.000Z" },
      { id:"okc-hines-harris", bout_order:2, card_section:"Prelims", weight_class:"Heavyweight", red_name:"Alvin Hines", blue_name:"RJ Harris", lock_at:"2026-07-18T21:30:00.000Z" },
      { id:"okc-coria-nicoll", bout_order:3, card_section:"Prelims", weight_class:"Flyweight", red_name:"Alden Coria", blue_name:"Stewart Nicoll", lock_at:"2026-07-18T22:00:00.000Z" },
      { id:"okc-franco-rodrigues", bout_order:4, card_section:"Prelims", weight_class:"Heavyweight", red_name:"Felipe Franco", blue_name:"Levi Rodrigues Jr.", lock_at:"2026-07-18T22:30:00.000Z" },
      { id:"okc-lebosnoyani-ko", bout_order:5, card_section:"Prelims", weight_class:"Welterweight", red_name:"Jean-Paul Lebosnoyani", blue_name:"Seok Hyeon Ko", lock_at:"2026-07-18T23:00:00.000Z" },
      { id:"okc-delgado-bashi", bout_order:6, card_section:"Prelims", weight_class:"Featherweight", red_name:"Jose Delgado", blue_name:"Austin Bashi", lock_at:"2026-07-18T23:30:00.000Z" },
      { id:"okc-mcmillen-montes", bout_order:7, card_section:"Main Card", weight_class:"Featherweight", red_name:"Tommy McMillen", blue_name:"Alberto Montes", lock_at:"2026-07-19T00:00:00.000Z" },
      { id:"okc-ricci-kline", bout_order:8, card_section:"Main Card", weight_class:"Women's Strawweight", red_name:"Tabatha Ricci", blue_name:"Fatima Kline", lock_at:"2026-07-19T00:30:00.000Z" },
      { id:"okc-hooper-ramirez", bout_order:9, card_section:"Main Card", weight_class:"Lightweight", red_name:"Chase Hooper", blue_name:"Mitch Ramirez", lock_at:"2026-07-19T01:00:00.000Z" },
      { id:"okc-cannonier-duncan", bout_order:10, card_section:"Co-Main Event", weight_class:"Middleweight", red_name:"Jared Cannonier", blue_name:"Christian Leroy Duncan", lock_at:"2026-07-19T02:00:00.000Z" },
      { id:"okc-du-plessis-usman", bout_order:11, card_section:"Main Event", weight_class:"Middleweight", red_name:"Dricus Du Plessis", blue_name:"Kamaru Usman", lock_at:"2026-07-19T02:45:00.000Z" },
    ],
  },
];

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\b/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function matchupKey(first, second) {
  return [normalizeName(first), normalizeName(second)].sort().join("|");
}

function asAmericanPrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price) || price === 0) return null;
  return Math.round(price);
}

function findMarket(bookmaker) {
  return Array.isArray(bookmaker?.markets)
    ? bookmaker.markets.find((market) => market?.key === "h2h")
    : null;
}

function lineForBookmaker(bookmaker, fight) {
  const market = findMarket(bookmaker);
  if (!market || !Array.isArray(market.outcomes)) return null;

  const outcomes = new Map(
    market.outcomes.map((outcome) => [normalizeName(outcome?.name), asAmericanPrice(outcome?.price)])
  );
  const redOdds = outcomes.get(normalizeName(fight.red_name));
  const blueOdds = outcomes.get(normalizeName(fight.blue_name));
  if (redOdds == null || blueOdds == null) return null;

  return {
    redOdds,
    blueOdds,
    bookmakerKey: String(bookmaker?.key || "unknown"),
    bookmakerTitle: String(bookmaker?.title || bookmaker?.key || "Sportsbook"),
    updatedAt: bookmaker?.last_update || new Date().toISOString(),
  };
}

function chooseLine(providerEvent, fight, preferredBookmakers) {
  const bookmakers = Array.isArray(providerEvent?.bookmakers) ? providerEvent.bookmakers : [];
  const byKey = new Map(bookmakers.map((bookmaker) => [String(bookmaker?.key || ""), bookmaker]));

  for (const key of preferredBookmakers) {
    const line = lineForBookmaker(byKey.get(key), fight);
    if (line) return line;
  }

  for (const bookmaker of bookmakers) {
    const line = lineForBookmaker(bookmaker, fight);
    if (line) return line;
  }
  return null;
}

function closestProviderEvent(candidates, fight) {
  if (!candidates.length) return null;
  const fightTime = new Date(fight.lock_at || 0).getTime();
  return [...candidates].sort((left, right) => {
    const leftTime = new Date(left?.commence_time || 0).getTime();
    const rightTime = new Date(right?.commence_time || 0).getTime();
    return Math.abs(leftTime - fightTime) - Math.abs(rightTime - fightTime);
  })[0];
}

function isMainCard(section) {
  return String(section || "").toLowerCase().includes("main");
}

function isPickableFight(event, fight) {
  return event.event_type === "numbered" || /full card/i.test(String(event.card_rule || "")) || isMainCard(fight.card_section);
}

async function deleteFightPicks(supabase, fightIds, failures) {
  const ids = [...new Set((fightIds || []).filter(Boolean))];
  if (!ids.length) return 0;
  const { data, error } = await supabase
    .from("pick_selections")
    .delete()
    .in("fight_id", ids)
    .select("fight_id");
  if (error) {
    failures.push({ stage: "reset-picks", fightIds: ids, error: error.message });
    return 0;
  }
  return (data || []).length;
}

async function syncMaintainedCards(supabase) {
  const summary = { events: 0, fightsInserted: 0, fightsUpdated: 0, fightsCancelled: 0, picksReset: 0, failures: [] };
  const now = Date.now();

  for (const maintained of MAINTAINED_CARDS) {
    if (now >= new Date(maintained.sync_until).getTime()) continue;
    const { fights, sync_until: _syncUntil, ...eventRow } = maintained;
    const { error: eventError } = await supabase.from("pick_events").upsert(eventRow, { onConflict: "id" });
    if (eventError) {
      summary.failures.push({ stage: "upsert-event", eventId: maintained.id, error: eventError.message });
      continue;
    }
    summary.events += 1;

    const { data: existingRows, error: existingError } = await supabase
      .from("pick_fights")
      .select("id,bout_order,card_section,red_name,blue_name,result_status,winner_name,red_odds,blue_odds,odds_source,odds_updated_at")
      .eq("event_id", maintained.id);
    if (existingError) {
      summary.failures.push({ stage: "load-fights", eventId: maintained.id, error: existingError.message });
      continue;
    }

    const existing = existingRows || [];
    const byId = new Map(existing.map((fight) => [fight.id, fight]));
    const usedOrders = new Set(existing.map((fight) => Number(fight.bout_order)));
    let stageBase = -1000000000;
    while (existing.some((_fight, index) => usedOrders.has(stageBase - index))) stageBase -= 1000;
    for (const [index, fight] of existing.entries()) {
      const { error } = await supabase
        .from("pick_fights")
        .update({ bout_order: stageBase - index })
        .eq("id", fight.id);
      if (error) summary.failures.push({ stage: "stage-order", fightId: fight.id, error: error.message });
    }

    const activeIds = new Set(fights.map((fight) => fight.id));
    const stale = existing.filter((fight) => !activeIds.has(fight.id) && fight.result_status !== "cancelled");
    summary.picksReset += await deleteFightPicks(supabase, stale.map((fight) => fight.id), summary.failures);
    for (const fight of stale) {
      const { error } = await supabase.from("pick_fights").update({
        result_status: "cancelled",
        winner_name: null,
        red_odds: null,
        blue_odds: null,
        odds_source: null,
        odds_updated_at: null,
      }).eq("id", fight.id);
      if (error) summary.failures.push({ stage: "cancel-stale", fightId: fight.id, error: error.message });
      else summary.fightsCancelled += 1;
    }

    for (const fight of fights) {
      const previous = byId.get(fight.id);
      const matchupChanged = Boolean(previous) && matchupKey(previous.red_name, previous.blue_name) !== matchupKey(fight.red_name, fight.blue_name);
      const demoted = Boolean(previous) && isPickableFight(maintained, previous) && !isPickableFight(maintained, fight);
      if (matchupChanged || demoted) {
        summary.picksReset += await deleteFightPicks(supabase, [fight.id], summary.failures);
      }

      if (!previous) {
        const { error } = await supabase.from("pick_fights").insert({
          ...fight,
          event_id: maintained.id,
          winner_name: null,
          result_status: "scheduled",
          red_odds: null,
          blue_odds: null,
          odds_source: null,
          odds_updated_at: null,
        });
        if (error) summary.failures.push({ stage: "insert-fight", fightId: fight.id, error: error.message });
        else summary.fightsInserted += 1;
        continue;
      }

      const resultStatus = matchupChanged || previous.result_status === "cancelled" ? "scheduled" : previous.result_status;
      const update = {
        ...fight,
        event_id: maintained.id,
        result_status: resultStatus,
        winner_name: resultStatus === "complete" ? previous.winner_name : null,
      };
      if (matchupChanged) {
        Object.assign(update, { red_odds: null, blue_odds: null, odds_source: null, odds_updated_at: null });
      }
      const { error } = await supabase.from("pick_fights").update(update).eq("id", fight.id);
      if (error) summary.failures.push({ stage: "update-fight", fightId: fight.id, error: error.message });
      else summary.fightsUpdated += 1;
    }
  }

  return summary;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json(405, { error: "POST required" });

  const expectedSecret = Deno.env.get("ODDS_REFRESH_SECRET") || "";
  const suppliedSecret = request.headers.get("x-odds-refresh-secret") || "";
  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return json(401, { error: "Unauthorized odds refresh" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const oddsApiKey = Deno.env.get("THE_ODDS_API_KEY") || "";
  if (!supabaseUrl || !serviceRoleKey || !oddsApiKey) {
    return json(500, { error: "Missing Supabase or odds-provider secrets" });
  }

  const preferredBookmakers = (Deno.env.get("ODDS_PREFERRED_BOOKMAKERS") || DEFAULT_BOOKMAKERS.join(","))
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const cardSync = await syncMaintainedCards(supabase);
  if (cardSync.failures.length) {
    return json(500, { error: "Card synchronization failed", cardSync });
  }

  const now = Date.now();
  const from = new Date(now - 48 * 60 * 60 * 1000).toISOString();
  const to = new Date(now + 60 * 24 * 60 * 60 * 1000).toISOString();
  const { data: events, error: eventsError } = await supabase
    .from("pick_events")
    .select("id,name,event_date,status,event_type,card_rule")
    .in("status", ["upcoming", "live"])
    .gte("event_date", from)
    .lte("event_date", to);

  if (eventsError) return json(500, { error: "Could not load UFC events", detail: eventsError.message, cardSync });
  const eventIds = (events || []).map((event) => event.id);
  if (!eventIds.length) return json(200, { updated: 0, matched: 0, missing: 0, message: "No active UFC events", cardSync });

  const { data: fights, error: fightsError } = await supabase
    .from("pick_fights")
    .select("id,event_id,card_section,red_name,blue_name,lock_at,result_status,red_odds,blue_odds")
    .in("event_id", eventIds)
    .eq("result_status", "scheduled")
    .gt("lock_at", new Date().toISOString());
  if (fightsError) return json(500, { error: "Could not load UFC fights", detail: fightsError.message, cardSync });

  const eventById = new Map((events || []).map((event) => [event.id, event]));
  const eligibleFights = (fights || []).filter((fight) => isPickableFight(eventById.get(fight.event_id) || {}, fight));

  const endpoint = new URL(`https://api.the-odds-api.com/v4/sports/${SPORT_KEY}/odds/`);
  endpoint.searchParams.set("apiKey", oddsApiKey);
  endpoint.searchParams.set("regions", "us");
  endpoint.searchParams.set("markets", "h2h");
  endpoint.searchParams.set("oddsFormat", "american");
  endpoint.searchParams.set("dateFormat", "iso");

  const providerResponse = await fetch(endpoint, { headers: { accept: "application/json" } });
  if (!providerResponse.ok) {
    return json(502, {
      error: "Odds provider request failed",
      status: providerResponse.status,
      detail: await providerResponse.text(),
      cardSync,
    });
  }

  const providerEvents = await providerResponse.json();
  const byMatchup = new Map();
  for (const providerEvent of Array.isArray(providerEvents) ? providerEvents : []) {
    const key = matchupKey(providerEvent?.home_team, providerEvent?.away_team);
    if (!key || key === "|") continue;
    const list = byMatchup.get(key) || [];
    list.push(providerEvent);
    byMatchup.set(key, list);
  }

  const updates = [];
  const missing = [];
  for (const fight of eligibleFights) {
    const candidates = byMatchup.get(matchupKey(fight.red_name, fight.blue_name)) || [];
    const providerEvent = closestProviderEvent(candidates, fight);
    if (!providerEvent) {
      missing.push({ fightId: fight.id, matchup: `${fight.red_name} vs. ${fight.blue_name}`, reason: "matchup-not-found" });
      continue;
    }

    const line = chooseLine(providerEvent, fight, preferredBookmakers);
    if (!line) {
      missing.push({ fightId: fight.id, matchup: `${fight.red_name} vs. ${fight.blue_name}`, reason: "moneyline-not-posted" });
      continue;
    }

    updates.push({ fight, providerEvent, line });
  }

  const failures = [];
  let updated = 0;
  for (const item of updates) {
    const { error } = await supabase
      .from("pick_fights")
      .update({
        red_odds: item.line.redOdds,
        blue_odds: item.line.blueOdds,
        odds_source: `${item.line.bookmakerTitle} via The Odds API`,
        odds_updated_at: item.line.updatedAt,
      })
      .eq("id", item.fight.id)
      .eq("result_status", "scheduled")
      .gt("lock_at", new Date().toISOString());

    if (error) failures.push({ fightId: item.fight.id, error: error.message });
    else updated += 1;
  }

  return json(failures.length ? 207 : 200, {
    provider: "The Odds API",
    sport: SPORT_KEY,
    cardSync,
    activeEvents: eventIds.length,
    scheduledFights: eligibleFights.length,
    providerEvents: Array.isArray(providerEvents) ? providerEvents.length : 0,
    matched: updates.length,
    updated,
    missing,
    failures,
    quota: {
      remaining: providerResponse.headers.get("x-requests-remaining"),
      used: providerResponse.headers.get("x-requests-used"),
      last: providerResponse.headers.get("x-requests-last"),
    },
    refreshedAt: new Date().toISOString(),
  });
});
