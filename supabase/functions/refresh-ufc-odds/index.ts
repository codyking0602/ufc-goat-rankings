import { createClient } from "npm:@supabase/supabase-js@2";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const SPORT_KEY = "mma_mixed_martial_arts";
const DEFAULT_BOOKMAKERS = ["betonlineag", "draftkings", "fanduel", "betmgm", "betrivers", "bovada"];

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

  const now = Date.now();
  const from = new Date(now - 48 * 60 * 60 * 1000).toISOString();
  const to = new Date(now + 60 * 24 * 60 * 60 * 1000).toISOString();
  const { data: events, error: eventsError } = await supabase
    .from("pick_events")
    .select("id,name,event_date,status")
    .in("status", ["upcoming", "live"])
    .gte("event_date", from)
    .lte("event_date", to);

  if (eventsError) return json(500, { error: "Could not load UFC events", detail: eventsError.message });
  const eventIds = (events || []).map((event) => event.id);
  if (!eventIds.length) return json(200, { updated: 0, matched: 0, missing: 0, message: "No active UFC events" });

  const { data: fights, error: fightsError } = await supabase
    .from("pick_fights")
    .select("id,event_id,red_name,blue_name,lock_at,result_status,red_odds,blue_odds")
    .in("event_id", eventIds)
    .eq("result_status", "scheduled")
    .gt("lock_at", new Date().toISOString());
  if (fightsError) return json(500, { error: "Could not load UFC fights", detail: fightsError.message });

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
  for (const fight of fights || []) {
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
    activeEvents: eventIds.length,
    scheduledFights: (fights || []).length,
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
