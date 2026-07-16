# External UFC card ingestion

The Picks backend now separates fight-card maintenance from odds maintenance.

## Current flow

1. `.github/workflows/refresh-ufc-odds.yml` runs every six hours.
2. `scripts/sync-ufc-card.mjs` opens the tracked UFC event in Chromium through Playwright.
3. UFC.com is the primary source. A configured secondary source is used only when the official page cannot be read or validated.
4. The scraper captures the card twice and requires identical normalized snapshots.
5. The confirmed snapshot is sent to `supabase/functions/sync-ufc-card/index.ts`.
6. Supabase reconciles the event and fights, resets invalidated picks, and keeps safe picks.
7. `refresh-ufc-odds` runs afterward and fills available moneylines.

## Source registration

Tracked events live in `config/ufc-card-sources.json`.

Each event defines:

- Internal Picks event ID
- Event name, subtitle, type, date, location, and pick scope
- Expected main event
- Official UFC event discovery settings
- Secondary fallback source
- Minimum valid fight count
- Main-card fight count fallback
- Prelim and main-card start times used to estimate individual lock times
- The time when automated card synchronization stops

For Fight Nights, the full card is stored but only main-card fights are pickable. Numbered events expose the full card.

## Reconciliation rules

- Order, card-section, start-time, spelling, and corner changes keep picks.
- A prelim promoted to the Fight Night main card becomes pickable.
- A Fight Night main-card bout demoted to the prelims loses its picks and Underdog Locks.
- A replacement opponent resets every selection and Underdog Lock for that matchup.
- A removed fight is marked cancelled and its selections are deleted.
- Existing odds are preserved for the same matchup and swapped when red/blue corners reverse.
- Replacement matchups clear stale odds before the odds updater runs.
- Completed, drawn, and no-contest fights are not reopened by card ingestion.

## Safety rules

The ingestion function refuses to write unless:

- Two consecutive browser captures produce the same normalized card hash.
- The expected main event is present.
- The configured minimum number of fights is present.
- Every fight has two fighters, a section, a weight class, and a valid lock time.
- The source hostname is approved.
- An existing card is not suddenly reduced below 60% of its active fight count.

Failure screenshots and HTML are uploaded as a private GitHub Actions artifact for 14 days. A failed scrape leaves the live Supabase card unchanged.

## First managed event

`UFC Fight Night: Ankalaev vs. Guskov` on July 25, 2026 is the first event registered under the external ingestion system.

The primary source is UFC.com. The current MMA Mania fight-card page is configured as the fallback source because UFC.com can reject normal server requests even when a browser can render the page.

## Adding the next event

1. Add one event object to `config/ufc-card-sources.json`.
2. Add the same event to `assets/data/picks-events.js` as the no-backend preview fallback.
3. Push to `main`.
4. The deploy workflow publishes both Edge Functions, performs a confirmed card import, and then refreshes odds.
5. Verify the live Picks event selector and main-card scope.

No manual Supabase SQL is required for ordinary event setup or card changes.
