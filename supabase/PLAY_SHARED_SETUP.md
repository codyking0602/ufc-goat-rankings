# Play Shared System Setup

This setup connects Play to the existing Picks member identity and PIN system.

## What it enables

- Keep 4, Cut 4 challenges stored in Supabase
- Short challenge links using `?challenge=ABC123#play`
- Exact fighter lineup and reveal order
- Challenger-versus-creator Keep/Cut comparison
- Daily Blind Resume leaderboard
- First completed attempt locked as the official score
- Replays update best score and attempt count
- The same Picks group code, display name, and 4-digit PIN work in Safari, the Home Screen app, or another device

## Required migration

Run this file in the Supabase SQL Editor:

`supabase/play-shared-system.sql`

It is designed to run after:

`supabase/picks-member-pin-phase.sql`

The migration is safe to rerun.

## Supabase steps

1. Open the Supabase dashboard.
2. Open the UFC app project.
3. Select **SQL Editor**.
4. Choose **New query**.
5. Copy all contents of `supabase/play-shared-system.sql` into the editor.
6. Click **Run**.
7. A successful run should finish without an error. DDL migrations commonly return no rows.

Do not place a service-role key in the repository or browser code. The existing public browser configuration is sufficient because all writes go through security-definer RPC functions.

## Identity preparation

Every person who will use challenges or the daily leaderboard should have:

- Their Picks group code
- Their exact Picks display name
- A 4-digit Picks PIN

A member can create or change their PIN from Picks profile/settings. The commissioner can also set a PIN for a member.

## Challenge test

1. Refresh the app after the migration is complete.
2. Open **Play → Keep 4, Cut 4**.
3. Finish all eight decisions.
4. Tap **Challenge a Friend**.
5. The app should create a short link containing only a challenge code.
6. Open the link in a different Safari/private browsing session.
7. Sign in with a Picks group code, display name, and PIN when prompted.
8. Confirm the exact same eight fighters appear in the exact same order.
9. Finish the challenge.
10. Confirm the final screen shows both players’ Keep 4 and Cut 4, matching calls, and disagreements.

## Daily leaderboard test

1. Open **Play → Today’s Challenge**.
2. Sign in with a Picks profile when prompted.
3. Finish the five Blind Resume rounds.
4. Confirm the leaderboard shows:
   - Official score
   - Best score
   - Attempt count
   - Player rank
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

## Troubleshooting

### “Play sharing needs the new Supabase Play migration”

The SQL migration has not been run successfully, or Supabase has not refreshed its function schema cache yet. Confirm the migration completed and wait briefly before refreshing the app.

### Challenge opens but asks for a PIN

That browser does not recognize the member yet. Sign in once using the existing Picks group code, display name, and PIN.

### Member has no PIN

Create one in Picks profile/settings or have the commissioner set one.

### Old challenge links

Links generated before the server-backed system are not compatible. Create a new challenge after the migration and app refresh.
