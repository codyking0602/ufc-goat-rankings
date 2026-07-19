# Startup Ownership Inventory

This file records who currently owns each startup responsibility. It describes the present architecture, including temporary compatibility layers. Update it whenever ownership changes.

## Ownership rules

- A responsibility should have one canonical owner.
- Enhancers may call an owner through a documented API but may not recreate the responsibility.
- Temporary repair layers must be labeled as temporary.
- A startup owner must become idempotent before duplicate loading or ownership is removed.

## Current owners

| Responsibility | Canonical owner | Current status | Phase 1 state |
|---|---|---|---|
| Earliest installed-app route normalization | `assets/js/fresh-home-route-bootstrap.js` | Canonical synchronous owner | Singleton guard proposed in PR #100 |
| Primary destination and ranking-subview activation | `assets/js/octagon-hq-shell.js` via `window.UFC_APP_SHELL` | Canonical navigation owner | Audit pending |
| Ranking data | `assets/data/ranking-data.js` | Canonical data source | Outside startup cleanup except load-order checks |
| Ranking rendering/runtime | `assets/js/app.js` and `assets/js/production-ranking-bootstrap.js` | Shared calculated-production responsibility | Ownership boundary audit pending |
| Picks base runtime | `assets/js/picks.js` | Canonical Picks owner | Audit pending |
| Play base runtime | `assets/js/play.js` and `assets/js/play-hub.js` | Shared Play responsibility | Ownership boundary audit pending |
| Home dashboard rendering | `assets/js/home-dashboard.js` | Canonical Home owner | Listener/refresh audit pending |
| Community profile rendering | `assets/js/community-profiles.js` | Canonical community owner | Listener/refresh audit pending |
| Cross-feature profile compatibility | `assets/js/product-architecture.js` | Compatibility/handoff owner | Audit pending |
| Late initial route activation and reminder injection | `assets/js/fresh-home-launch.js` | Late startup owner | Singleton guard proposed in PR #100 |
| Notification data and rendering | `assets/js/app-notification-center.js` | Intended canonical notification owner | Audit pending |
| Notification/profile surface compatibility | `assets/js/app-notification-surface-fix.js` | Temporary compatibility layer | Must not expand; removal belongs to later phases |
| Mobile bottom navigation, badges, transitions, pull-to-refresh | `assets/js/native-app-shell.js` | Intended canonical native shell owner | Audit pending |
| Mobile/native compatibility repairs | `assets/js/native-app-shell-stability.js` | Temporary repair layer | Inventory only in Phase 1; removal belongs to Phase 3 |

## Allowed dynamic loading

Dynamic loading is currently permitted only where ownership and timing are explicit:

- the app shell may load Play daily support after Play is opened;
- fresh launch may load the profile setup reminder after route selection;
- product architecture may load its named support modules once.

Critical navigation, notification, route, and native-shell owners must not be dynamically loaded a second time.

## Phase 1 audit questions for every owner

For each startup file, record:

1. Can the file itself execute twice?
2. Does it attach document/window listeners?
3. Does it create observers, intervals, timeouts, or polling loops?
4. Does it dynamically inject another script?
5. Does it mutate the active route or visible view?
6. Does it expose a reusable public API?
7. Is there already a safe initialized marker?
8. Would a top-level singleton guard preserve all intended first-run behavior?

## Known boundary concerns

These are observations to investigate, not conclusions:

- Ranking calculated-production responsibility is split across more than one runtime file.
- Play intentionally has a base runtime and a hub; their ownership boundary needs explicit proof.
- Notification rendering has a canonical owner plus a compatibility surface fix.
- Native navigation has a canonical shell plus a stability/repair layer.
- Profile and identity handoffs cross product-architecture, community, notification, and fresh-launch code.

No boundary should be consolidated until tests demonstrate the exact current behavior.
