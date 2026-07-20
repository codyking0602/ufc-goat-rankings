# Startup Ownership Inventory

This file records the canonical owner of each startup responsibility. Detailed duplicate-execution findings and the completed Phase 1 sequence are in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md).

## Ownership rules

- A responsibility should have one canonical owner.
- Enhancers may call an owner through a documented API but may not recreate the responsibility.
- Temporary repair layers must remain labeled as temporary.
- A startup owner must be idempotent before duplicate loading or ownership is removed.
- One ownership issue is changed per runtime batch.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.

## Current owners

| Responsibility | Canonical owner | Current status | Phase 1 result |
|---|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Canonical synchronous owner | Global duplicate-start guard merged and physically verified in PR #100 |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Canonical navigation owner | Global duplicate-file guard merged and physically verified in PR #105 |
| Legacy navigation-grid cleanup | `assets/js/octagon-hq-nav-grid.js` | Compatibility cleanup | Global duplicate-file guard merged and physically verified in PR #106; repair retirement remains Phase 3 work |
| Ranking data | `assets/data/ranking-data.js` | Canonical data source | Outside startup cleanup except load-order checks |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Structural global singleton | Protected by exact-one manifest load and startup contract; no standard IIFE guard |
| Calculated production scoring bootstrap | `assets/js/production-ranking-bootstrap.js` via `window.UFC_PRODUCTION_RANKING_BOOTSTRAP_LIFECYCLE` | Canonical calculated-production launcher | Explicit `start`/`retry`/`apply`/`refresh` lifecycle plus complete-owner guard merged and physically verified in PR #123; failed attempts remain callable without file re-evaluation |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks owner | Global duplicate-file guard merged and physically verified in PR #113; original `DOMContentLoaded`, saved-state, room-resume, rendering, support handoffs, and 30-second polling preserved |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner | Prerequisite-aware guard merged and physically verified in PR #115; ownership begins only after `#play` and `RANKING_DATA.men` exist |
| Play game hub | `assets/js/play-hub.js` | Canonical Play navigation owner | Prerequisite-aware guard merged and physically verified in PR #119; five static Play DOM prerequisites and all daily/random/restoration behavior preserved |
| Home dashboard rendering | `assets/js/home-dashboard.js` | Canonical Home owner | Global duplicate-file guard merged and physically verified in PR #107 |
| Community profile rendering | `assets/js/community-profiles.js` | Canonical community owner | Global duplicate-file guard merged and physically verified in PR #114; directory/profile/Top 10/Picks/challenge retry paths preserved |
| Cross-feature profile compatibility | `assets/js/product-architecture.js` | Compatibility/handoff owner | Existing global protection retained; consolidation remains later-phase work |
| Late initial route activation and reminder injection | `assets/js/fresh-home-launch.js` | Late startup owner | Global duplicate-start guard merged and physically verified in PR #100 |
| Notification data and rendering | `assets/js/app-notification-center.js` | Intended canonical notification owner | Global duplicate-file guard merged and physically verified in PR #110; service-worker, profile/activity, event/API retry, and user-gesture permission behavior preserved |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Temporary compatibility layer | Existing global protection retained; must not expand and removal belongs to Phase 3 after proof |
| Mobile bottom navigation, badges, transitions, pull-to-refresh | `assets/js/native-app-shell.js` | Intended canonical native-shell owner | Global duplicate-file guard merged and physically verified in PR #112; public APIs, events, observer, timers, lifecycle retries, and 10-second badge interval preserved |
| Mobile/native compatibility repairs | `assets/js/native-app-shell-stability.js` | Temporary repair layer | Global duplicate-file guard merged and physically verified in PR #108; public `schedule()` retry path preserved; removal belongs to Phase 3 |
| Sharing and incoming share routing | `assets/js/share-deep-links.js` | Canonical share/deep-link owner | Global duplicate-file guard merged and physically verified in PR #121; native share/clipboard fallbacks, observers, delayed passes, ranking-ready/popstate retries, and all supported routes preserved |

## Dynamic-loading boundaries

Dynamic loading is currently permitted only where ownership and timing are explicit:

- the app shell may load Play daily support after Play is opened;
- fresh launch may load the profile setup reminder after route selection;
- product architecture may load its named support modules once;
- production ranking bootstrap may load its 40 ordered canonical calculation dependencies through its stable lifecycle owner.

Critical navigation, notification, route, native-shell, Picks, profile, Play, share, and calculated-ranking owners must not be dynamically loaded as replacement owners.

## Phase 1 completion

All owners listed in the major Phase 1 audit have been handled according to their classification:

- simple owners are globally guarded;
- prerequisite-aware owners claim ownership only after prerequisites pass;
- `app.js` remains an exact-one structural singleton;
- the retry-sensitive production ranking launcher now exposes an explicit callable lifecycle before duplicate evaluation is blocked.

There is no next isolated Phase 1 owner in the current audit.

## Phase 2 boundary

Phase 2 is **Remove duplicate ownership**, not another singleton-marker pass. Before any runtime change, create a dedicated audit for these responsibility areas in order:

1. route ownership;
2. identity/profile ownership;
3. notification ownership;
4. refresh/lifecycle ownership.

The Phase 2 audit must identify one duplicated responsibility, its canonical owner, subordinate compatibility owners, required regression proof, and the exact isolated removal or delegation change. Do not combine these areas.

## Known ownership boundaries for later phases

These are documented concerns, not authorization to consolidate them without a new audit:

- calculated ranking responsibility spans `app.js`, the production bootstrap, and the scoring pipeline;
- Play intentionally has a base runtime and a hub;
- notification rendering has a canonical owner plus a compatibility surface fix;
- native navigation has a canonical shell plus a stability/repair layer;
- profile and identity handoffs cross product architecture, community, notification, route, Picks, and sharing code.

No boundary should be consolidated until current behavior is covered by tests and the Phase 2 audit proves one canonical owner and one safe isolated change.
