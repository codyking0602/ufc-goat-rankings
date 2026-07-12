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
10. `supabase/picks-event-automation-phase.sql`

Then open **Project Settings → API** and copy the project URL and public publishable key into `assets/data/supabase-config.js`.

Never place the service-role or secret key in the repository. All migration files are designed to be safe to rerun.

## Default scoring

- Correct winner: 1 point.
- One optional Underdog Lock per player and event.
- Correct Underdog Lock: 1 additional bonus point.
- Incorrect Underdog Lock: no penalty.
- Draws, no contests, and cancellations are void.
- Individual friends' picks remain hidden until that fight locks.

Commissioners can choose future-season point values after the commissioner migration runs. Scoring locks once the first pick is submitted in that season.

## Persistent groups

Every Picks room becomes a permanent group after `picks-persistent-groups-phase.sql` runs.

- The original room and all existing picks are preserved.
- The group gets one stable share link.
- Existing members carry into every new event automatically.
- Each event keeps its own room standings and recap.
- The group card tracks cumulative points, accuracy, event wins, and Underdog Lock bonuses for the active season.
- The group owner can attach the next UFC event without rebuilding the group.

## Event Manager

After `picks-event-manager-phase.sql` runs, the permanent-group owner gets a private **Event Manager** panel inside Picks.

The owner can:

- Create a draft numbered event or Fight Night.
- Enter the event date, headline matchup, and location.
- Add, edit, reorder, or delete fights before picks are submitted.
- Set each fight's card section, weight class, lock time, and American moneyline odds.
- Publish the event and automatically carry the permanent group into its new room.
- Reopen an upcoming event room directly from the manager.

Numbered UFC events should include the full scheduled card. Fight Nights should include the main card only.

## Commissioner controls

After `picks-commissioner-phase.sql` runs, the group owner gets a private **Commissioner** panel.

The commissioner can:

- Rename the permanent group.
- Remove a member while preserving that member's historical picks and scores.
- Transfer ownership with a one-time eight-character claim code.
- Correct fight odds without changing submitted picks.
- Reopen a completed event for result corrections.
- Rename the active season and set its scoring before picks begin.
- Start a new season while preserving every prior event and season.

Starting a new season resets the visible season standings, not the underlying history. The same permanent group and members continue forward.

## Social and retention

After `picks-social-retention-phase.sql` runs, every member gets a compact **Social Hub**.

It includes:

- Shareable event-winner and season-standings graphics.
- Current correct-pick streaks and all-season best streaks.
- Upset Hunter, Lock Master, and event-win awards.
- Current-season trophy race and archived season champions.
- Optional emoji avatars that appear beside standings names.
- A group activity feed for joins, event launches, fight results, season changes, and commissioner changes.
- An optional browser reminder preference and an **Add to calendar** file for the next event.

Browser notifications are opportunistic and appear when the app is opened near event time. The calendar file is the reliable reminder outside the app.

## Card and odds automation

After `picks-event-automation-phase.sql` runs, the group owner gets a private **Card Automation** panel beside the Event Manager.

The no-subscription workflow is:

1. Create the draft event in Event Manager.
2. Paste the full card into Card Automation.
3. Let the app infer bout order, sections, estimated lock times, and American odds.
4. Review additions, replacements, reordered fights, lock changes, and missing fights.
5. Apply the card in one transaction.
6. Paste the card again later to detect cancellations or matchup changes before publishing.

Supported card formats include pipe-delimited, tab-delimited, CSV-style, and simple `Fighter A vs Fighter B` lines. The canonical template is:

```text
1 | Early Prelims | Flyweight | Fighter A | Fighter B | -150 | +130
2 | Prelims | Lightweight | Fighter C | Fighter D | +120 | -140
3 | Main Event | Welterweight | Fighter E | Fighter F | -110 | -110
```

Bulk odds can be pasted as paired lines or one fighter per line. Matchups are resolved by fighter names. Missing fights are never silently removed: the preview shows them first, and the owner chooses whether to keep them or void them as cancellations when submitted picks already exist.

## Live event maintenance

Once an event is published, Supabase remains the multiplayer source of truth.

- Use the room-owner controls to lock or reopen fights.
- Set winners, draws, no contests, and cancellations from **Manage Live Results**.
- Draws, no contests, and cancellations remain void.
- Completed events stay available through the room recap and Past Events archive.

`assets/data/picks-events.js` is only the no-backend preview/fallback. Keep it aligned with the live event while testing.
