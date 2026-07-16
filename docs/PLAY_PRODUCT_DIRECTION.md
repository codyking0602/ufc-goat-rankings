# Play Tab Product Direction

## Status

This document is the long-term product direction for the UFC GOAT app's Play tab.

- Repository: `codyking0602/ufc-goat-rankings`
- Live app: `https://codyking0602.github.io/ufc-goat-rankings/`
- `main` is the live source of truth.
- The Play tab should evolve into one reusable UFC social-game platform, not a collection of unrelated mini-games.

### Current locked product decision

**Build Your Top 10 remains a solo ranking tool.** It is a subjective experience and should not receive a friend-challenge mode unless that decision is explicitly reopened later.

---

## Product vision

The Play tab should feel like a UFC/2K arcade mode where users can:

1. Play games casually by themselves.
2. Complete one shared Daily Challenge.
3. Challenge friends with the exact same game setup when the game supports friend challenges.
4. Compare answers in a clean, debate-ready results screen.
5. Compete on daily leaderboards when a game has a defensible objective score.
6. Use the same identity they already have in UFC Picks.

The product should create repeat visits, group-chat debates, and shareable UFC arguments without feeling like a spreadsheet.

---

## Core product layers

### 1. Play Hub

The main Play tab in `index.html` is the discovery and navigation hub.

It should contain:

- Today's Challenge
- View Today's Leaderboard
- All Games grid
- Saved Play/Picks identity
- Entry points for local games
- Challenge creation after a supported game is completed

The Play Hub must **not** open incoming friend challenges.

### 2. Local Games

Every game should work normally without requiring sign-in.

A user should be able to:

- Choose a game.
- Choose a themed fighter pack when applicable.
- Complete the game locally.
- Replay with a new lineup.
- Sign in only when submitting a daily score or creating a friend challenge.

### 3. Daily Challenge

There should be one authoritative daily challenge shared by everyone.

Rules:

- Reset timezone: `America/Chicago`
- Everyone receives the exact same setup.
- The first completed attempt is the permanent official leaderboard score.
- Replays update only best score and attempt count.
- The public leaderboard ranks the official first score.
- Ties share the same place.
- No speed tiebreaker.
- The leaderboard remains accessible from the Play home screen after the game is completed.

Daily leaderboards should only be used for games with a defensible objective score.

Subjective games should show community comparisons rather than invented correctness scores.

### 4. Friend Challenges

Friend challenges must use standalone pages.

The main app creates the challenge link, but incoming links must never reopen inside `index.html`.

Architecture:

- `index.html` creates and shares the challenge.
- A dedicated standalone page loads the challenge.
- The standalone page loads only the data and UI needed for that game.
- No P4P screen.
- No Picks navigation.
- No Play Hub.
- No automatic tab switching.
- No MutationObservers controlling routing.
- No repeated click or refresh logic.

Each friend challenge freezes:

- Game type
- Game version
- Exact fighter lineup
- Exact reveal order
- Any matchup A/B order
- Challenger's completed result
- Challenger's identity
- Creation and expiration dates

After the responder finishes, the app reveals the challenger's result and generates a comparison.

Completed comparison screens should support **Challenge Back**, reusing the same setup while making the responder's completed result the new challenger result.

Native sharing must send exactly one URL. Do not duplicate the URL in both share text and the URL payload.

---

## Player identity

Play should reuse the existing UFC Picks identity.

Identity fields:

- Picks group code
- Exact display name
- Four-digit PIN
- Saved member token on the device

Users should not need a second Play account.

A challenge receiver may play before signing in. Sign-in should happen only when submitting and revealing the final comparison.

Keep identity behavior reusable through:

- `assets/js/play-profile-identity.js`

---

## Shared backend

Use the existing generic Supabase system rather than creating separate tables for every game.

Generic RPCs:

- `play_create_challenge`
- `play_get_challenge`
- `play_submit_challenge`
- `play_identity_snapshot`
- `play_daily_context`
- `play_submit_daily_attempt`
- `play_daily_leaderboard`

Each game should use a small adapter that can:

1. Export the exact game setup.
2. Export the completed player result.
3. Reopen the setup on a standalone page.
4. Submit the responder's result.
5. Generate the appropriate comparison.

Do not create one-off Supabase tables or RPC systems for each new game unless the generic system genuinely cannot support the requirement.

---

## Current completed friend challenges

### Keep 4, Cut 4

Standalone page:

- `challenge.html?code=XXXXXX`

Current behavior:

- Exact eight fighters
- Same reveal order
- Exactly four Keeps and four Cuts
- Locked decisions
- Picks profile submission
- Side-by-side comparison
- Blue responder section
- Orange challenger section
- Green Keep labels
- Red Cut labels
- Yellow disagreement section
- Challenge Back rematch
- Working through iMessage

### Blind Rank 5

Standalone page:

- `blind-rank-challenge.html?code=XXXXXX`

Current behavior:

- Exact five fighters
- Same reveal order
- Locked #1-#5 placement slots
- Picks profile submission
- Side-by-side rankings
- Exact placement matches
- Placement movement and biggest differences
- Blue responder section
- Orange challenger section
- Challenge Back rematch

### Blind Resume

Standalone page:

- `blind-resume-challenge.html?code=XXXXXX`

Current behavior:

- Same five matchups
- Exact A/B order
- Hidden fighter identities until choices lock
- Challenger and responder scores
- Round-by-round selections
- Matches and disagreements
- Blue responder section
- Orange challenger section
- Yellow disagreement highlights
- Challenge Back rematch

### Better Than...

Standalone page:

- `better-than-challenge.html?code=XXXXXX`

Current behavior:

- Frozen target fighter, debate lens, eligibility pool, challenger count, and eligible fighter snapshots
- Challenger names hidden until responder submission
- Responder chooses their own count and exact list
- Shared, challenger-only, and responder-only comparisons
- Blue responder and orange challenger sections
- No fake winner or model correctness
- Challenge Back rematch

---

## Game classification rules

Every game must be clearly classified as either subjective or objective.

### Subjective games

Examples:

- Blind Rank 5
- Keep 4, Cut 4
- Better Than...
- Build Your Top 10

Subjective games should compare:

- Overlap
- Ordering
- Matching decisions
- Biggest disagreements
- Community choice percentages later, when enough data exists

They should not pretend one answer is officially correct.

### Objective games

Examples:

- Blind Resume
- Find the Leader

Objective games may use:

- Scores
- Official first-attempt leaderboard
- Best score
- Attempt count
- Missed answers
- Incorrect answers
- Round-by-round breakdown

All objective answers must be grounded in the UFC-only ranking model or verified app statistics.

---

## Game roadmap

### A. Blind Rank 5

**Status:** Local and standalone friend challenge complete.

### B. Keep 4, Cut 4

**Status:** Local and standalone friend challenge complete.

### C. Blind Resume

**Status:** Local, Daily Challenge, standalone friend challenge, and Challenge Back flows are complete or in final stabilization.

### D. Better Than...

**Status:** Subjective local claim builder and standalone friend challenge complete.

Core prompt structure:

> I can name 7 fighters better than Charles Oliveira at striking.

The challenger controls:

- Challenge fighter
- Debate lens, such as overall, striking, wrestling, grappling, submissions, power, durability, cardio, or UFC-only resume
- Eligible fighter pool, including the full roster, gender pools, verified UFC divisions, same-division pools, and 205+ division pools
- Claim count, capped at 15 or the available pool size
- Exact supporting fighter list

The responder sees the frozen prompt and challenger's number, chooses their own number, and builds an exact list from the same frozen pool. The challenger's names remain hidden until submission.

Comparison shows both counts, the narrower claim without an official winner, shared selections, each person's unique selections, list overlap, and Challenge Back.

Better Than is subjective. It must not use model correctness, official scores, or a scored Daily Challenge leaderboard. Community percentages may be added later when enough submissions exist.

### E. Build Your Top 10

**Status:** Solo subjective ranking tool. No friend-challenge mode is currently planned.

It may continue to compare the user's list against the official model, including:

- Placement differences
- Model agreement
- Biggest disagreements
- Fighters ranked higher or lower than the model

Do not add a friend challenge or fake head-to-head winner unless the product decision is explicitly changed later.

### F. Find the Leader

Only enable after the underlying category and statistical data are verified.

Examples:

- Who has the most UFC title-fight wins?
- Who has the highest finish percentage?
- Who has the most Top-5 wins?
- Who has the best rounds-won percentage?

Do not launch using incomplete, estimated, or inconsistently sourced category data.

### G. Daily Game Rotation

Once multiple objective games are stable, Today's Challenge can rotate between:

- Blind Resume
- Find the Leader

The server must remain the source of truth for:

- Challenge day
- Game type
- Game version
- Exact setup
- Maximum score

Do not rotate subjective games into a scored daily leaderboard unless the experience is explicitly framed as community voting rather than correctness.

---

## Visual direction

The Play tab and standalone pages should feel like UFC/2K, not forms or spreadsheets.

Use:

- Dark navy and charcoal surfaces
- Orange UFC-style primary actions
- Yellow for important challenge or disagreement moments
- Blue for the responder/current user
- Orange for the challenger
- Green and red only for meaningful decisions such as Keep/Cut or correct/incorrect
- Real fighter photos when files exist
- Initials fallback when they do not
- Compact mobile-first layouts
- Large fighter identity moments
- Clear progress and locked-decision feedback

---

## Data rules

- UFC-only
- Use `window.UFC_PLAY_DATA` and the live ranking model.
- Do not invent fighter facts or statistics.
- Do not use non-UFC achievements for scoring.
- Do not add fighter data directly to `index.html`.
- Do not add fake photo paths.
- Freeze fighter names and basic snapshots into challenge setup so a challenge remains playable if app data later changes.
- Preserve the exact fighter, matchup, reveal, and A/B order chosen by the challenger.

---

## Development rules

- Inspect the current repository before editing.
- `main` is the live source of truth.
- Other app features may change between commits, especially Intelligence and Picks.
- Avoid replacing the entire `index.html` when only one script reference needs changing.
- Add features in small batches.
- Test one game before adapting another.
- Preserve the working Keep/Cut, Blind Rank, and Blind Resume standalone flows.
- Do not return to the old `index.html` challenge-routing architecture.
- Do not introduce global MutationObserver overrides.
- Do not repeatedly select or click the Play tab in code.
- Do not require Supabase migrations unless the existing generic schema is genuinely insufficient.

---

## Overarching success state

The finished Play tab should allow a user to:

1. Open the UFC app.
2. See the same Daily Challenge as everyone else.
3. Complete it and see their official leaderboard position.
4. Return later and view the updated leaderboard.
5. Choose any supported game.
6. Play locally without signing in.
7. Finish a supported game and challenge a friend.
8. Send one clean iMessage link.
9. Have the friend open a dedicated standalone game page.
10. Compare both results in a polished UFC-style screen.
11. Challenge Back from the comparison when supported.
12. Return to the Play Hub and choose another game.

The goal is a reusable UFC game platform, not a separate custom sharing system for every mini-game.
