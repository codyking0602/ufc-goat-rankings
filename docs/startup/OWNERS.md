# Startup Ownership Inventory

This file records the canonical owner of each startup responsibility. Detailed duplicate-execution findings and the completed Phase 1 sequence are in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md). The current route boundary is documented in [`PHASE-2-ROUTE-OWNERSHIP-AUDIT.md`](./PHASE-2-ROUTE-OWNERSHIP-AUDIT.md).

## Ownership rules

- A responsibility should have one canonical owner.
- Enhancers may call an owner through a documented API but may not recreate the responsibility.
- Temporary repair layers must remain labeled as temporary.
- A startup owner must be idempotent before duplicate loading or ownership is removed.
- One ownership issue is changed per runtime batch.
- `assets/js/app.js` is a structural manifest singleton and must not receive a standard IIFE guard.
- Observing, decorating, retrying, or repairing an activated route is not automatically duplicate route ownership.
- A secondary activation cannot be removed until missing-owner and prerequisite recovery are covered by focused tests.

## Current owners

| Responsibility | Canonical owner | Current status | Phase 1 / Phase 2 result |
|---|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Canonical synchronous owner | Global duplicate-start guard merged and physically verified in PR #100; Phase 2 confirms late launch repeats part of its Home/Picks classification but still closes a query-only Picks gap |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Canonical navigation owner | Global duplicate-file guard merged and physically verified in PR #105; Phase 2 confirms `app.js` still contains a shadowed legacy top-tab activation path |
| Legacy navigation-grid cleanup | `assets/js/octagon-hq-nav-grid.js` | Compatibility cleanup | Global duplicate-file guard merged and physically verified in PR #106; presentation-only route synchronization, not a second route chooser |
| Ranking data | `assets/data/ranking-data.js` | Canonical data source | Outside startup cleanup except load-order checks |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Structural global singleton | Exact-one manifest load retained; Phase 2 identifies its legacy `.tab` activation block as duplicate primary-navigation code, but removal is blocked until delayed/missing-shell recovery proof passes |
| Calculated production scoring bootstrap | `assets/js/production-ranking-bootstrap.js` via `window.UFC_PRODUCTION_RANKING_BOOTSTRAP_LIFECYCLE` | Canonical calculated-production launcher | Explicit `start`/`retry`/`apply`/`refresh` lifecycle plus complete-owner guard merged and physically verified in PR #123; failed attempts remain callable without file re-evaluation |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks owner | Global duplicate-file guard merged and physically verified in PR #113; original `DOMContentLoaded`, saved-state, room-resume, rendering, support handoffs, and 30-second polling preserved |
| Picks internal section routing | `assets/js/picks-internal-navigation.js` | Canonical Picks Home/Event/Settings subroute owner | Legitimate nested route owner using `picksView`, session state, popstate, and DOM repair; not primary destination ownership |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner | Prerequisite-aware guard merged and physically verified in PR #115; ownership begins only after `#play` and `RANKING_DATA.men` exist |
| Play game hub | `assets/js/play-hub.js` | Canonical Play internal-game navigation owner | Prerequisite-aware guard merged and physically verified in PR #119; its game-screen lifecycle is separate from primary Play destination activation |
| Home dashboard rendering | `assets/js/home-dashboard.js` | Canonical Home owner | Global duplicate-file guard merged and physically verified in PR #107 |
| Community profile rendering | `assets/js/community-profiles.js` | Canonical community owner | Global duplicate-file guard merged and physically verified in PR #114; directory/profile/Top 10/Picks/challenge retry paths preserved |
| Cross-feature profile and shell compatibility | `assets/js/product-architecture.js` | Compatibility/handoff owner | Existing global protection retained; can dynamically recover a missing shell API and therefore remains relevant to the first Phase 2 route candidate's stop condition |
| Late initial route activation and reminder injection | `assets/js/fresh-home-launch.js` | Late startup and Picks-continuation owner | Global duplicate-start guard merged and physically verified in PR #100; Phase 2 confirms duplicate startup classification/activation but broad removal is unsafe while query-only Picks and resume-marker behavior depend on it |
| Notification data and rendering | `assets/js/app-notification-center.js` | Intended canonical notification owner | Global duplicate-file guard merged and physically verified in PR #110; service-worker, profile/activity, event/API retry, and user-gesture permission behavior preserved |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Temporary compatibility layer | Existing global protection retained; must not expand and removal belongs to Phase 3 after proof |
| Mobile bottom navigation, badges, transitions, pull-to-refresh | `assets/js/native-app-shell.js` | Intended canonical native-shell presentation owner | Global duplicate-file guard merged and physically verified in PR #112; bottom-nav taps delegate to the shell, while active-state/visibility/timer work is presentation synchronization |
| Mobile/native compatibility repairs | `assets/js/native-app-shell-stability.js` | Temporary repair layer | Global duplicate-file guard merged and physically verified in PR #108; closes/repairs drawer and Home/profile surfaces without calling route activation; removal belongs to Phase 3 |
| Sharing and incoming share routing | `assets/js/share-deep-links.js` | Canonical share/deep-link orchestrator | Global duplicate-file guard merged and physically verified in PR #121; destination activation is delegated to the shell while payload waits, retries, warm routing, metadata, and supported route types remain here |
| Profile challenge routing | `assets/js/profile-challenges.js` | Canonical challenge retrieval/game-opening owner | Its delayed startup pass and share-deep-link invocation are guarded by `state.routed`; this is a required load-order handoff, not duplicate primary navigation |

## Dynamic-loading boundaries

Dynamic loading is currently permitted only where ownership and timing are explicit:

- the app shell may load Play daily support after Play is opened;
- fresh launch may load the profile setup reminder after route selection;
- product architecture may load its named support modules once and may recover a missing shell API;
- production ranking bootstrap may load its 40 ordered canonical calculation dependencies through its stable lifecycle owner.

Critical navigation, notification, route, native-shell, Picks, profile, Play, share, and calculated-ranking owners must not be dynamically loaded as replacement owners except for the documented product-architecture shell compatibility path.

## Phase 1 completion

All owners listed in the major Phase 1 audit have been handled according to their classification:

- simple owners are globally guarded;
- prerequisite-aware owners claim ownership only after prerequisites pass;
- `app.js` remains an exact-one structural singleton;
- the retry-sensitive production ranking launcher now exposes an explicit callable lifecycle before duplicate evaluation is blocked.

There is no next isolated Phase 1 owner in the current audit.

## Phase 2 route boundary

The route audit is complete and proves genuine duplicate ownership, but it does not authorize runtime deletion.

### Canonical primary route owner

`assets/js/octagon-hq-shell.js` is the sole intended owner of:

- primary destination activation;
- ranking-subview activation and preservation;
- active-view mutation;
- primary top-nav selection/ARIA;
- route hash writing and hash parsing;
- toolbar synchronization;
- disabled War Room fallback;
- `octagon-hq:view-change` publication.

### First candidate responsibility

The first candidate is removal of the legacy primary `.tab` activation block in `assets/js/app.js`.

It is **not runtime-ready** until a focused harness proves that:

- the shell still handles normal and programmatic top-tab clicks once;
- Rankings subview preservation is unchanged;
- a failed or delayed first shell load recovers through product architecture without relying on the legacy handler;
- an activation during that recovery window is not lost.

If the missing-owner proof fails, the candidate must be rejected and the audit updated. Do not compensate by editing multiple route owners in one batch.

### Later route candidate

Early bootstrap and late launch both classify startup route intent. Consolidation is deferred because late launch still activates query-only Picks invitations/continuations and owns the short-lived Picks resume marker.

## Remaining Phase 2 audit order

After the first route candidate is either proved or rejected, continue the roadmap one responsibility area at a time:

1. complete the isolated route-owner runtime batch or update the route audit;
2. identity/profile ownership audit;
3. notification ownership audit;
4. refresh/lifecycle ownership audit.

Do not combine these areas.

## Known ownership boundaries for later phases

These are documented concerns, not authorization to consolidate them without a new audit:

- calculated ranking responsibility spans `app.js`, the production bootstrap, and the scoring pipeline;
- Play intentionally has a base runtime and a hub;
- notification rendering has a canonical owner plus a compatibility surface fix;
- native navigation has a canonical shell plus a stability/repair layer;
- profile and identity handoffs cross product architecture, community, notification, route, Picks, and sharing code;
- primary route, incoming payload route, and nested Picks/Play route responsibilities are intentionally separate.

No boundary should be consolidated until current behavior is covered by tests and the Phase 2 audit proves one canonical owner and one safe isolated change.
