# Picks setup

The Picks tab works in local preview mode immediately. Real friend rooms need one Supabase project.

## One-time setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/picks-schema.sql`.
3. Open **Project Settings → API**.
4. Copy the project URL and the public anon key into `assets/data/supabase-config.js`.
5. Do not place the service-role key in the repository.

## Weekly event maintenance

Supabase is the multiplayer source of truth. Update `pick_events` and `pick_fights` in the Table Editor or SQL Editor.

Rules:

- Numbered UFC events: load every scheduled fight.
- UFC Fight Nights: load only the main card.
- Each fight has its own `lock_at` timestamp.
- Set `result_status` to `complete` and `winner_name` to the winner after the fight.
- For draws, no contests, or cancellations, set the matching `result_status`; they do not award a point.

`assets/data/picks-events.js` is only the no-backend preview/fallback. Keep it aligned with the live event while testing.
