# Production architecture ownership map

Last verified against certified production baseline `89dce5c2a123f54c20d1c65d01136ac5f5dcc30e` on 2026-07-21.

This map is intentionally lightweight. Its purpose is to stop a small product tweak from creating a second owner for an existing responsibility.

## Operating rule

Before changing behavior:

1. Identify the canonical owner below.
2. Change that owner or document an intentional ownership transfer.
3. Do not add a late patch, fallback, duplicate initializer, second timer, second route listener, or second identity resolver.
4. Add or update the focused proof for the responsibility being changed.
5. Merge only after the exact PR head passes the required validation gate.

## Canonical owners

| Responsibility | Canonical owner | Allowed supporting modules | Do not duplicate |
| --- | --- | --- | --- |
| Initial production load order | `index.html` | `assets/js/fresh-home-route-bootstrap.js` may publish the bounded startup handoff | New scripts that independently start the app, re-run the full load sequence, or activate a destination after the shell owns it |
| Primary route activation | `assets/js/octagon-hq-shell.js` through `window.UFC_APP_SHELL` | `assets/js/octagon-hq-nav-grid.js`, `assets/js/product-architecture.js`, and feature modules may request navigation through the shell | Direct primary-tab listeners, competing route events, late same-view activation, or reload-based navigation |
| Mobile navigation surface | `assets/js/native-app-shell.js` | `assets/js/native-app-shell-stability.js` may preserve proven compatibility only; it does not own routing | A second bottom-nav controller or a feature module that scrolls, centers, or reorders the primary navigation |
| Shared identity, canonical readiness, login fallback, identity cache, and access persistence | `assets/js/play-profile-identity.js` | `assets/js/app-canonical-group.js` owns historical-token migration and hands the resolved identity to the canonical owner | Direct canonical token reads, independent snapshot resolution, duplicate readiness publication, or consumer-triggered sign-in ownership |
| Startup ownership contract | `scripts/test-startup-contract.mjs` and `.github/workflows/startup-architecture-gate.yml` | Focused ownership proofs under `scripts/test-*owner*.mjs` and `scripts/test-*contract*.mjs` | Unproved broad cleanup or a new repair path that is not represented in the contract |
| Ranking source rows and profile rows | `assets/data/ranking-data.js` | Approved canonical roster and adjustment layers loaded by `index.html` | Fighter data added to `index.html`, a new post-bootstrap fighter repair file, or presentation code mutating scoring inputs |
| Ranking display overrides | `assets/data/display-overrides.js` | Photo files under `assets/fighters/` and deterministic materialization tools | A second app-facing override registry or photo path that points to a nonexistent file |
| Ranking calculation and generated production board | `assets/js/ranking-pipeline.js`, category calculators, and `assets/js/production-ranking-bootstrap.js` | Approved source facts, judgments, and adjustment layers | Presentation modules launching scoring repairs, one-fighter scoring fixes after bootstrap, or formulas embedded in the UI |
| Ranking and fighter-card rendering | `assets/js/app.js` | `assets/js/live-score-ui.js`, `assets/js/ranking-ui-polish.js`, and focused profile-card presentation modules | A second leaderboard renderer, a second fighter drawer owner, or a late rerender loop that repeats full ranking work |
| Picks core room and fight interaction | `assets/js/picks.js` | The `assets/js/picks-*.js` modules each own only their named feature and delegate identity/navigation to canonical owners | A second room bootstrap, competing event selection owner, duplicate full room refresh, or browser odds polling |
| Picks event source | `assets/data/picks-events.js` | Visual and photo override data may decorate the canonical event | A second current-event registry or feature-local fight card copy |
| Recurring UFC card and odds refresh | `.github/workflows/refresh-ufc-odds.yml` | Supabase refresh functions and generated health snapshots | Another recurring schedule, browser focus/visibility polling, or the deploy workflow becoming a second scheduler |
| Member profile rendering and editing | `assets/js/app-profile.js` | `assets/js/community-profiles.js`, `assets/js/profile-challenges.js`, and notification surfaces consume the canonical profile/identity handoff | A consumer opening the editor to resolve identity, independently loading the full profile/group snapshot, or publishing profile readiness |
| Fighter profile content | `assets/js/app.js` plus `assets/data/display-overrides.js` | Compare profiles and fighter packets may supply approved copy and evidence | A second profile-card data source or special-case renderer outside the canonical card path |

## Protected maintenance boundary

Startup and identity cleanup is complete and maintenance-only. A future change may touch those owners only when a deterministic failure or a clearly approved product requirement proves the need. Cosmetic changes should not alter startup, identity, route, scoring, refresh, or persistence ownership.

## Ownership-transfer rule

An intentional ownership transfer must be completed in one PR:

- name the old owner and the new owner;
- remove the old owner in the same change;
- update this map and the relevant permanent contract;
- prove that only one accepted action, route, readiness publication, refresh, or render remains;
- state the protected behavior that did not change.
