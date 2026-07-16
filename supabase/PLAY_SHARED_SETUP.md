# Generic Play Sharing Setup

This connects every Play game to the existing Picks member identity and PIN system.

## What it enables

- One reusable challenge table for every Play game
- One reusable response table for every challenger
- One generic daily challenge and leaderboard system
- Short links using `?challenge=ABC123#play`
- Exact saved game setup, reveal order, and creator result
- Challenger-versus-creator comparisons after completion
- The same Picks group code, display name, and 4-digit PIN in Safari, the Home Screen app, or another device

The database does not need a new table or migration each time another game is added. Each game registers a small front-end adapter that defines how to:

1. Export its setup
2. Export its completed result
3. Reopen a saved setup
4. Compare two results

## Current adapters

The generic system is currently wired for:

- Keep 4, Cut 4
- Blind Rank 5
- Blind Resume

The daily leaderboard currently uses Blind Resume. Future games such as Better Than and Find the Leader can register adapters without changing the challenge tables.

## Required migration

Run this file in the Supabase SQL Editor:

`supabase/play-shared-system.sql`

It must run after:

`supabase/picks-member-pin-phase.sql`

The migration is safe to rerun. It also upgrades the earlier Keep/Cut-only Play schema if that version was already run.

## Supabase steps

1. Open the Supabase dashboard.
2. Open the UFC app project.
3. Select **SQL Editor**.
4. Choose **New query**.
5. Copy all contents of `supabase/play-shared-system.sql` into the editor.
6. Click **Run**.
7. A successful run should finish without an error. DDL migrations commonly return no rows.

Do not place a service-role key in the repository or browser code. The public browser configuration is sufficient because all writes go through security-definer RPC functions.

## Identity preparation

Every person using challenges or daily leaderboards should have:

- Their Picks group code
- Their exact Picks display name
- A 4-digit Picks PIN

A member can create or change their PIN from Picks profile/settings. The commissioner can also set a PIN for a member.

## Challenge tests

### Keep 4, Cut 4

1. Refresh the app after the migration is complete.
2. Finish a Keep 4, Cut 4 game.
3. Tap **Challenge a Friend**.
4. Open the short link in another Safari/private session.
5. Sign in with the existing Picks profile when prompted.
6. Confirm the same eight fighters appear in the same order.
7. Finish and confirm both Keep/Cut results appear together.

### Blind Rank 5

1. Finish a Blind Rank game.
2. Tap **Challenge a Friend**.
3. Open the link in another browser session.
4. Confirm the same five fighters and reveal order.
5. Finish and confirm both ordered rankings appear together.

### Blind Resume

1. Open regular Blind Resume, not Today’s Challenge.
2. Finish all five rounds.
3. Tap **Challenge a Friend**.
4. Open the link in another browser session.
5. Confirm the same five matchups appear in the same A/B order.
6. Finish and confirm both scores and round-by-round picks appear together.

## Daily leaderboard test

1. Open **Play → Today’s Challenge**.
2. Sign in with a Picks profile when prompted.
3. Finish the five Blind Resume rounds.
4. Confirm the leaderboard shows official score, best score, attempt count, and rank.
5. Replay the challenge.
6. Confirm the official score does not change, while best score and attempt count may update.

## Daily rules

- Reset timezone: `America/Chicago`
- First completed attempt: official and permanent
- Unlimited replays
- Best score may improve
- Attempt count increases on every completion
- Leaderboard order uses official score only
- Equal official scores share a rank
- No speed tiebreaker

## Adding another game

Register the game through `window.UFC_PLAY_SHARED.registerAdapter()` in the front end. The adapter should provide:

- `id`
- `version`
- `challengeSelector`
- `isComplete()`
- `exportSetup()`
- `exportResult()`
- `openSetup(setup, challenge)`
- `renderComparison(response)`

No Supabase schema change is required unless the identity or leaderboard rules themselves change.

## Troubleshooting

### “Play sharing needs the generic Supabase Play migration”

The SQL migration has not been run successfully, or Supabase has not refreshed its function schema cache yet. Confirm the migration completed and wait briefly before refreshing the app.

### Challenge opens but asks for a PIN

That browser does not recognize the member yet. Sign in once using the existing Picks group code, display name, and PIN.

### Member has no PIN

Create one in Picks profile/settings or have the commissioner set one.

### Old challenge links

Links generated before the server-backed generic system are not compatible. Create a new challenge after the migration and app refresh.