# Picks setup

The Picks tab works in local preview mode immediately. Real friend rooms need one Supabase project.

## One-time setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/picks-schema.sql`.
3. Run `supabase/picks-pgcrypto-fix.sql`.
4. Run `supabase/picks-live-gameplay-phase.sql` to add odds, Underdog Locks, live reveals, and scoring fields.
5. Open **Project Settings → API**.
6. Copy the project URL and public publishable key into `assets/data/supabase-config.js`.
7. Never place the service-role or secret key in the repository.

All migration files are safe to rerun.

## Scoring

- Correct winner: 1 point.
- One optional Underdog Lock per player and event.
- Correct Underdog Lock: 1 additional bonus point.
- Incorrect Underdog Lock: no penalty.
- Draws, no contests, and cancellations are void.
- Individual friends' picks remain hidden until that fight locks.

## Weekly event maintenance

Supabase is the multiplayer source of truth. Update `pick_events` and `pick_fights` in the Table Editor or SQL Editor.

Rules:

- Numbered UFC events: load every scheduled fight.
- UFC Fight Nights: load only the main card.
- Each fight has its own `lock_at` timestamp.
- Store American moneyline odds in `red_odds` and `blue_odds` with `odds_source` and `odds_updated_at`.
- Set `result_status` to `complete` and `winner_name` to the winner after the fight.
- For draws, no contests, or cancellations, set the matching `result_status`; they do not award a point.

`assets/data/picks-events.js` is only the no-backend preview/fallback. Keep it aligned with the live event while testing.
