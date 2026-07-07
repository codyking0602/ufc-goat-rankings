# UFC GOAT Rankings

Static UFC-only all-time ranking app.

Live app:

`https://codyking0602.github.io/ufc-goat-rankings/`

## What this is

A UFC-only ranking product with:

- P4P leaderboard
- Women-only leaderboard
- Division boards
- Category leaders
- Fighter profile cards
- OVR ratings
- Watch Moment links
- Compare Mode / Octagon Verdict support

This is UFC-only. Pride, WEC, Strikeforce, Bellator, ONE, PFL, regional, and boxing accomplishments are not scored in the main rankings.

## Current source structure

- `index.html` — layout shell and app entrypoint
- `assets/js/app.js` — main app rendering and interaction logic
- `assets/data/ranking-data.js` — canonical fighter data source
- `assets/data/ranking-data-patches.js` — lightweight loader/status hook
- `assets/fighters/` — fighter thumbnails and profile images
- `docs/fighter-status.md` — fighter audit tracker and workflow notes
- `manifest.webmanifest` — install/app icon metadata
- `.github/workflows/pages.yml` — GitHub Pages deployment

## Canonical fighter data

All fighter data now lives in:

`assets/data/ranking-data.js`

Add or edit fighters there only.

Do not add new fighter data to:

- `index.html`
- `assets/data/ranking-data-additions.js`
- `assets/data/display-overrides.js`
- `assets/data/fighter-packets/*.js`
- `assets/data/fighter-packet-manifest.js`
- `assets/js/watch-moments.js`
- compare coverage packs
- correction/patch files

Legacy files may still exist for audit/history, but they are not the workflow.

## Fighter object expectations

Each fighter should include the relevant canonical data in `ranking-data.js`:

- identity: name, slug/id, gender, leaderboard, divisions
- scoring: total score, Championship, Quality Wins, Prime Dominance, Longevity, Apex Peak, Loss Context
- resume snapshot: UFC record, title-fight wins, adjusted title wins, elite/top-5 wins, prime record, finish rate, rounds won %, active elite years, times finished in prime
- title context
- quality-win/opponent ledger
- prime/dominance notes
- loss-context notes
- display copy
- Watch Moment URL
- photo paths
- compare profile
- fight ledger, only for real direct fights/rivalries

## Fighter image convention

Use two real WebP images per fighter:

- `fighter-slug-thumb.webp` for ranking cards
- `fighter-slug.webp` for fighter profiles

Example:

- `jon-jones-thumb.webp`
- `jon-jones.webp`

Only add photo paths after the real files exist in:

`assets/fighters/`

Do not AI-generate fighter photos.

## Audit workflow

Use:

`docs/fighter-status.md`

as the live audit tracker.

Fighters should be reviewed in small batches. Score changes are allowed during audit, but each score change should be intentional and explainable.

Audit order:

1. Identity / placement
2. Scores
3. Resume Snapshot
4. Title context
5. Quality wins
6. Prime / rounds
7. Loss context
8. Display copy
9. Watch Moment
10. Photos
11. Compare profile
12. Fight ledger

## Development notes

GitHub Pages serves the app from `main`.

After JavaScript changes, bump cache-bust query strings where needed so the live mobile app does not keep stale scripts.
