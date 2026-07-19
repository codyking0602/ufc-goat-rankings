# Startup Ownership Inventory

This file records the canonical owner of each startup responsibility. Detailed duplicate-execution findings and the planned runtime sequence are in [`PHASE-1-OWNER-AUDIT.md`](./PHASE-1-OWNER-AUDIT.md).

## Ownership rules

- A responsibility should have one canonical owner.
- Enhancers may call an owner through a documented API but may not recreate the responsibility.
- Temporary repair layers must be labeled as temporary.
- A startup owner must become idempotent before duplicate loading or ownership is removed.
- One ownership issue is changed per runtime batch.

## Current owners

| Responsibility | Canonical owner | Current status | Phase 1 decision |
|---|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Canonical synchronous owner | Global guard proposed in PR #100 |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Canonical navigation owner | Next isolated simple-guard candidate |
| Legacy navigation-grid cleanup | `assets/js/octagon-hq-nav-grid.js` | Compatibility cleanup | Isolated simple-guard candidate after app shell |
| Ranking data | `assets/data/ranking-data.js` | Canonical data source | Outside startup cleanup except load-order checks |
| Base ranking rendering and global UI APIs | `assets/js/app.js` | Structural global singleton | Enforce exact-one manifest load; no standard IIFE guard |
| Calculated production scoring bootstrap | `assets/js/production-ranking-bootstrap.js` | Canonical calculated-production launcher | Explicit retry semantics required before idempotence change |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks owner | Isolated guard candidate with Picks/mobile testing |
| Play base runtime | `assets/js/play.js` | Canonical base Play owner | Prerequisite-aware guard required |
| Play game hub | `assets/js/play-hub.js` | Canonical Play navigation owner | Separate prerequisite-aware guard required |
| Home dashboard rendering | `assets/js/home-dashboard.js` | Canonical Home owner | Isolated simple-guard candidate |
| Community profile rendering | `assets/js/community-profiles.js` | Canonical community owner | Isolated broad-surface guard candidate |
| Cross-feature profile compatibility | `assets/js/product-architecture.js` | Compatibility/handoff owner | Already globally protected |
| Late initial route activation and reminder injection | `assets/js/fresh-home-launch.js` | Late startup owner | Global guard proposed in PR #100 |
| Notification data and rendering | `assets/js/app-notification-center.js` | Intended canonical notification owner | Isolated mobile-sensitive guard candidate |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Temporary compatibility layer | Already globally protected; must not expand |
| Mobile bottom navigation, badges, transitions, pull-to-refresh | `assets/js/native-app-shell.js` | Intended canonical native shell owner | Isolated physical-iPhone guard candidate |
| Mobile/native compatibility repairs | `assets/js/native-app-shell-stability.js` | Temporary repair layer | Isolated guard candidate; removal belongs to Phase 3 |
| Sharing and incoming share routing | `assets/js/share-deep-links.js` | Canonical share/deep-link owner | Isolated guard candidate after core startup owners |

## Dynamic-loading boundaries

Dynamic loading is currently permitted only where ownership and timing are explicit:

- the app shell may load Play daily support after Play is opened;
- fresh launch may load the profile setup reminder after route selection;
- product architecture may load its named support modules once;
- production ranking bootstrap may load its ordered canonical calculation dependencies.

Critical navigation, notification, route, native-shell, Picks, profile, and share owners must not be dynamically loaded a second time.

## Known ownership boundaries for later phases

These are documented concerns, not authorization to consolidate them during Phase 1:

- calculated ranking responsibility spans `app.js`, the production bootstrap, and the scoring pipeline;
- Play intentionally has a base runtime and a hub;
- notification rendering has a canonical owner plus a compatibility surface fix;
- native navigation has a canonical shell plus a stability/repair layer;
- profile and identity handoffs cross product architecture, community, notification, and route code.

No boundary should be consolidated until the current behavior is covered by tests and every participating owner is idempotent.