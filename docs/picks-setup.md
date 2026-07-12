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

Then open **Project Settings → API** and copy the project URL and public publishable key into `assets/data/supabase-config.js`.

Never place the service-role or secret key in the repository. All migration files are designed to be safe to rerun.

## Scoring

- Correct winner: 1 point.
- One optional Underdog Lock per player and event.
- Correct Underdog Lock: 1 additional bonus point.
- Incorrect Underdog Lock: no penalty.
- Draws, no contests, and cancellations are void.
- Individual friends' picks remain hidden until that fight locks.

## Persistent groups

Every Picks room becomes a permanent group after `picks-persistent-groups-phase.sql` runs.

- The original room and all existing picks are preserved.
- The group gets one stable share link.
- Existing members carry into every new event automatically.
- Each event keeps its own room standings and recap.
- The group card tracks cumulative points, accuracy, event wins, and Underdog Lock bonuses.
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

## Live event maintenance

Once an event is published, Supabase remains the multiplayer source of truth.

- Use the room-owner controls to lock or reopen fights.
- Set winners, draws, no contests, and cancellations from **Manage Live Results**.
- Each correct winner awards one point.
- Draws, no contests, and cancellations remain void.
- Completed events stay available through the room recap and Past Events archive.

`assets/data/picks-events.js` is only the no-backend preview/fallback. Keep it aligned with the live event while testing.
