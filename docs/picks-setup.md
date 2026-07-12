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

Then open **Project Settings → API** and copy the project URL and public publishable key into `assets/data/supabase-config.js`.

Never place the service-role or secret key in the repository. All migration files are designed to be safe to rerun.

`supabase/picks-event-automation-phase.sql` is retired and should not be run. The live app no longer includes a paste/import card workflow.

## Default scoring

- Correct winner: 1 point.
- One optional Underdog Lock per player and event.
- Correct Underdog Lock: 1 additional bonus point.
- Incorrect Underdog Lock: no penalty.
- Draws, no contests, cancellations, and unresolved fights are excluded from accuracy.
- Friends' exact picks remain hidden until that fight locks.

Commissioners can choose future-season point values. Scoring locks once the first pick is submitted in that season.

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
- Completed-event recap
- Collapsible Fight Results
- Collapsible Room Pick History
- Owner-only Results & Corrections

### Settings

- Emoji avatar
- Browser reminder preference
- Add Event to Calendar
- Device recovery key
- Rename group
- Season settings and new-season controls
- Member removal
- Commissioner transfer
- Temporary member recovery codes for the commissioner

The old Social Hub, winner graphics, season awards, activity feed, Event Manager interface, odds editor, and card-import interface are not part of the live app.

## Identity and device recovery

Run `picks-device-recovery-phase.sql`, then each member should open **Picks → Settings → Device Recovery** and create one private recovery key.

- The saved key restores the same permanent profile on a replacement phone.
- Picks, points, avatar, event history, and season standing remain attached to the profile.
- Recovering rotates the member token, so the old device is signed out.
- If the recovered member is the commissioner, commissioner access moves to the new device too.
- A successful recovery generates a new recovery key and invalidates the old key.
- Existing members without a saved key can ask the commissioner for a temporary 30-minute recovery code.
- The commissioner creates that code inside **Settings → Members & Ownership**.
- Recovery uses the permanent group link, the exact existing display name, and the recovery code.

Recovery codes are stored only as hashes in Supabase. The plaintext key is shown only when it is created or rotated.

## Event maintenance

Event cards are maintained directly in the repository and Supabase rather than through an owner-facing import screen.

For each new event:

1. Confirm the official card, event date, bout order, and sections.
2. Add or update the event in the maintained data workflow.
3. Verify the room and picks on the live site.
4. Let the daily odds workflow fill available moneylines.
5. Update replacements or cancellations when the card changes.

`picks-event-manager-phase.sql` remains in the migration sequence because later group and commissioner schema depends on that phase, but its retired front-end files have been removed.

## Automated odds refresh

The live Picks card can refresh UFC moneylines every 24 hours through `supabase/functions/refresh-ufc-odds/index.ts` and the **Refresh UFC Odds** GitHub Actions workflow.

### Required repository secrets

Open **GitHub → Settings → Secrets and variables → Actions** and add:

- `SUPABASE_ACCESS_TOKEN` — a Supabase personal access token used only to deploy the Edge Function.
- `THE_ODDS_API_KEY` — the private API key from The Odds API.
- `ODDS_REFRESH_SECRET` — a long random secret shared only by the deploy and refresh workflows.

Do not put any of these values in source files, browser JavaScript, workflow YAML, screenshots, or chat messages.

### First deployment

1. Open **Actions → Deploy UFC Odds Refresh**.
2. Choose **Run workflow** on `main`.
3. Confirm the deployment and test steps finish green.
4. Open **Actions → Refresh UFC Odds** and run it once manually if another immediate refresh is needed.

The deployment workflow stores `THE_ODDS_API_KEY` and `ODDS_REFRESH_SECRET` as Supabase Edge Function secrets, deploys the function with JWT verification disabled, protects it with the custom refresh secret, and performs one test refresh.

### Daily behavior

- **Refresh UFC Odds** runs daily at 12:17 UTC and can also be run manually.
- The provider request is restricted to MMA head-to-head moneylines in the US region.
- Only `upcoming` or `live` UFC events and `scheduled` fights are eligible.
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
- An event cannot be completed while scheduled fights still need outcomes.
- The owner can mark all unresolved fights cancelled and complete the event in one confirmed action.
- Completed events remain available in Past Events and open directly to their recap.

## Profile and reminders

`picks-social-retention-phase.sql` now supports only the retained profile features:

- Optional emoji avatars beside leaderboard and recap names
- Browser reminder preference
- Add-to-calendar file for the next event

Browser notifications are opportunistic and only appear when the app is opened near event time. The calendar file is the reliable reminder outside the app.

## Reliability checks

The `Picks UI Smoke` GitHub Actions workflow runs whenever the Picks interface changes.

It checks:

- JavaScript syntax for every `picks*.js` file
- Every local CSS and JavaScript asset referenced by `index.html`
- Required Home, Event, Settings, standings, recap, and correction mount points
- Cleanup-script loading order
- Route restoration and keyboard navigation hooks
- Profile, reminder, recovery, and automatic-odds hooks
- Daily odds schedule and Edge Function deployment contract
- Absence of the retired Event Manager, Social Hub, and Phase 11 frontend files

Run the same check locally with:

```bash
node scripts/check-picks-ui.mjs
```

## Fallback data

`assets/data/picks-events.js` is only the no-backend preview/fallback. Keep it aligned with the live event while testing.
