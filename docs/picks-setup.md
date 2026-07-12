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
- The group owner can attach the next upcoming UFC event from the app after that event has been loaded into Supabase.

## Weekly event maintenance

Supabase is the multiplayer source of truth. Update `pick_events` and `pick_fights` in the Table Editor or SQL Editor.

Rules:

- Numbered UFC events: load every scheduled fight.
- UFC Fight Nights: load only the main card.
- Each fight has its own `lock_at` timestamp.
- Store American moneyline odds in `red_odds` and `blue_odds` with `odds_source` and `odds_updated_at`.
- Set `result_status` to `complete` and `winner_name` to the winner after the fight.
- For draws, no contests, or cancellations, set the matching `result_status`; they do not award a point.
- Once a new event is loaded with status `upcoming` or `live`, the group owner can add it from the permanent group panel.

`assets/data/picks-events.js` is only the no-backend preview/fallback. Keep it aligned with the live event while testing.