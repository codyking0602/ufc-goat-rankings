# Picks setup

The Picks tab works in local preview mode immediately. Real friend rooms need one Supabase project.

## One-time setup

Run these files in **Supabase → SQL Editor** in this order:

1. `supabase/picks-schema.sql`
2. `supabase/picks-pgcrypto-fix.sql`
3. `supabase/picks-live-gameplay-phase.sql`
4. `supabase/picks-room-admin-phase.sql`
5. `supabase/picks-manual-lock-phase.sql`
6. `supabase/picks-persistent-groups-phase.sql`
7. `supabase/picks-event-manager-phase.sql`
8. `supabase/picks-commissioner-phase.sql`
9. `supabase/picks-social-retention-phase.sql`
10. `supabase/picks-correctness-cleanup-phase.sql`
11. `supabase/picks-device-recovery-phase.sql`
12. `supabase/picks-member-pin-phase.sql`
13. `supabase/picks-archive-admin-phase.sql`
14. `supabase/picks-member-merge-phase.sql`
15. `supabase/picks-tiered-scoring-phase.sql`

Then open **Project Settings → API** and copy the project URL and public publishable key into `assets/data/supabase-config.js`.

Never place the service-role or secret key in the repository. All migration files are designed to be safe to rerun.

`supabase/picks-event-automation-phase.sql` is retired and should not be run. The live app no longer includes a paste/import card workflow.

## Default scoring

- Correct winner: 4 points from UFC Oklahoma City forward.
- One optional Underdog Lock per player and event.
- Correct Lock bonus: +1 at +100–149, +2 at +150–199, +3 at +200–249, +4 at +250–299, +5 at +300–349, +6 at +350–399, and +7 at +400 or higher.
- Incorrect Underdog Lock: no penalty.
- UFC 329 keeps its original scoring and is not recalculated.
- Draws, no contests, cancellations, and unresolved fights are excluded from accuracy.
- Friends' exact picks remain hidden until that fight locks.

Commissioners can choose future-season point values. Scoring locks once the first pick is submitted in that season, but the season name remains editable.

## Permanent groups

Every room becomes a permanent group after `picks-persistent-groups-phase.sql` runs.

- The group uses one stable share link.
- New members join by opening that link and entering their name.
- Existing members carry into every future event.
- New members begin with zero season points and do not receive retroactive picks.
- Each event keeps its own standings, picks, results, and recap.
- The Home view tracks cumulative season points, graded-pick accuracy, and event wins.

## App structure

### Home

- Start or Join Room for users who are not already in a group
- Group name and permanent share link
- Current or next event
- Season leaderboard
- Past Events
- Profile and reminder shortcut

### Event

- Fight card and picks
- Pick progress
- Event standings
- Locked room picks
- Live results
- Dedicated archived-event recap
- Final fight-by-fight pick map
- Collapsible Fight Results
- Collapsible Room Pick History
- Commissioner result corrections
- Commissioner member-pick and Underdog Lock corrections

### Settings

- Emoji avatar
- Browser reminder preference
- Add Event to Calendar
- Member PIN setup and change controls
- Rename group
- Season settings and new-season controls
- Member rename and removal
- Commissioner Set / Reset PIN controls
- Commissioner transfer

The old Social Hub, winner graphics, season awards, activity feed, Event Manager interface, odds editor, card-import interface, and Device Recovery interface are not part of the live app.

## Identity and member PIN

Run `picks-member-pin-phase.sql`, then each member should create a PIN in **Picks → Settings → Member PIN**.

- A member can sign in on another device with the permanent group or room code, exact display name, and PIN.
- Picks, points, avatar, event history, and season standing remain attached to the same permanent profile.
- The commissioner can set or reset a member PIN from **Settings → Members & Ownership**.
- The commissioner can rename a member without breaking that member's saved picks or history.
- PINs are stored only as hashes in Supabase.

`picks-device-recovery-phase.sql` remains in the migration sequence for existing installations, but its old recovery-key interface is retired in favor of member PIN sign-in.

## Event maintenance

Event cards are maintained directly in the repository and Supabase rather than through an owner-facing import screen.

For each new event:

1. Confirm the official card, event date, bout order, and sections.
2. Add the event to `config/ufc-card-sources.json` and the local fallback in `assets/data/picks-events.js`.
3. Verify the room and picks on the live site.
4. Let the scheduled card-and-odds workflow refresh Supabase every six hours.
5. Update the maintained source only when the next UFC event needs to be added or a source rule changes.

`picks-event-manager-phase.sql` remains in the migration sequence because later group and commissioner schema depends on that phase, but its retired front-end files have been removed.

## Automated card and odds refresh

The live Picks card is checked every six hours through `scripts/sync-ufc-card.mjs`, `supabase/functions/sync-ufc-card/index.ts`, and the **Sync UFC Card and Odds** GitHub Actions workflow. Once the confirmed card is applied to Supabase, `supabase/functions/refresh-ufc-odds/index.ts` refreshes available moneylines.

### Required repository secrets

Open **GitHub → Settings → Secrets and variables → Actions** and add:

- `SUPABASE_ACCESS_TOKEN` — a Supabase personal access token used only to deploy the Edge Functions.
- `THE_ODDS_API_KEY` — the private API key from The Odds API.
- `ODDS_REFRESH_SECRET` — a long random secret shared only by the deploy and refresh workflows.

Do not put any of these values in source files, browser JavaScript, workflow YAML, screenshots, or chat messages.

### First deployment

1. Open **Actions → Deploy UFC Card Sync** and run it on `main`.
2. Open **Actions → Deploy UFC Odds Refresh** and run it on `main`.
3. Confirm both deployment and test steps finish green.
4. Open **Actions → Sync UFC Card and Odds** and run it once manually if another immediate refresh is needed.

The deployment workflows store the required private values as Supabase Edge Function secrets, deploy the functions with JWT verification disabled, protect them with the custom refresh secret, and perform test requests.

### Scheduled behavior

- **Sync UFC Card and Odds** runs every six hours at minute 17 and can also be run manually.
- The card scraper uses UFC.com first and MMA Mania only as a fallback.
- Two matching captures are required before a card can update Supabase.
- The sync detects new fights, opponent replacements, order changes, main-card promotions or demotions, and cancellations.
- Destructive card shrinkage and incomplete snapshots are rejected.
- The odds provider request is restricted to MMA head-to-head moneylines in the US region.
- Only `upcoming` or `live` UFC events and `scheduled` pickable fights are eligible for odds.
- Fighter pairs are matched after punctuation and accent normalization.
- A line is saved only when both fighters have a valid moneyline from the same sportsbook.
- Missing or unmatched provider data never clears the last valid odds already stored.
- Resolved, cancelled, drawn, or completed fights are never overwritten.
- The app says **Not all odds available yet** when only part of the card has posted lines.
- When no lines are available, the app explains that the Underdog Lock is waiting on posted odds.

The preferred sportsbook order is BetOnline, DraftKings, FanDuel, BetMGM, BetRivers, then Bovada. The function falls back to another available US sportsbook when none of those has both sides posted.

## Live event maintenance

Once an event is published, Supabase is the multiplayer source of truth.

- Use the event's owner controls to lock or reopen fights.
- Set winners, draws, no contests, and cancellations in **Results & Corrections**.
- Completed events hide editing controls until **Enter Correction Mode** is selected.
- Correction Mode also exposes each member's saved pick and Underdog Lock for that event.
- An event cannot be completed while scheduled fights still need outcomes.
- The owner can mark all unresolved fights cancelled and complete the event in one confirmed action.
- Completed events remain available in Past Events and open directly to their archived recap.
- Use **Return to Current Event** to leave an archived event without losing the permanent group.

## Profile and reminders

`picks-social-retention-phase.sql` now supports only the retained profile features:

- Optional emoji avatars beside leaderboard and recap names
- Browser reminder preference
- Add-to-calendar file for the next event

Browser notifications are opportunistic and only appear when the app is opened near event time. The calendar file is the reliable reminder outside the app.

## Reliability checks
